// r15: INK alignment, not box alignment. The owner: "make sure the icon in the plans list is
// visually left aligned with the text in the normal list ... may not follow mathematical number".
// Renders the Plans list (stops above the divider, plain Places rows below) at 1x and 3x and finds,
// from the pixels, the left INK edge of every stop's icon and of every Places row's name (and the
// header title): the first column, scanning right, where the ink covers >= 50% (the perceived edge
// of an anti-aliased stroke). Reports css px. Used by check.js (truths) and owner-11.
//   REPO=<worktree> VENDOR=<dir> node ink.js   -> ../ink.json
const fs = require('fs'), path = require('path'), zlib = require('zlib'), { execFileSync } = require('child_process');
const REPO = process.env.REPO || path.resolve(__dirname, '../../..');
process.env.PAGE = process.env.PAGE || path.join(REPO, 'index.html');   // the REAL index.html
const OUTROOT = process.env.OUT || '/tmp/plans-v3-out';   // checks write here, never into the repo
const { open, launch, FIX } = require('./harness');
const W = ms => new Promise(r => setTimeout(r, ms));
function decodePNG(buf) {
  let p = 8, w, h, ct, idat = [];
  while (p < buf.length) { const len = buf.readUInt32BE(p), type = buf.toString('ascii', p + 4, p + 8), d = buf.slice(p + 8, p + 8 + len);
    if (type === 'IHDR') { w = d.readUInt32BE(0); h = d.readUInt32BE(4); ct = d[9]; } else if (type === 'IDAT') idat.push(d); p += 12 + len; }
  const bpp = ct === 6 ? 4 : 3, raw = zlib.inflateSync(Buffer.concat(idat)), stride = w * bpp, out = Buffer.alloc(h * stride);
  for (let y = 0; y < h; y++) { const f = raw[y * (stride + 1)], row = raw.slice(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x++) { const a = x >= bpp ? out[y * stride + x - bpp] : 0, b = y ? out[(y - 1) * stride + x] : 0, c = x >= bpp && y ? out[(y - 1) * stride + x - bpp] : 0;
      let v = row[x]; if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1; else if (f === 4) { const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
      out[y * stride + x] = v & 255; } }
  return { w, h, bpp, px: out };
}
// left ink edge inside box (css px) -> css px, scanning columns; coverage = colour distance from the
// background / the darkest distance in the box; edge = first column whose max coverage >= 0.5
function inkLeft(img, dpr, box, bg) {
  const x0 = Math.round(box.x1 * dpr), x1 = Math.round(box.x2 * dpr), y0 = Math.round(box.y1 * dpr), y1 = Math.round(box.y2 * dpr);
  const d = (x, y) => { const i = y * img.w * img.bpp + x * img.bpp; return Math.abs(img.px[i] - bg[0]) + Math.abs(img.px[i + 1] - bg[1]) + Math.abs(img.px[i + 2] - bg[2]); };
  let dmax = 0; for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) dmax = Math.max(dmax, d(x, y));
  if (dmax < 40) return null;
  for (let x = x0; x < x1; x++) { let m = 0; for (let y = y0; y < y1; y++) m = Math.max(m, d(x, y)); if (m / dmax >= 0.5) {
      // sub-pixel: interpolate between this column and the previous one on the 0.5 crossing
      let mp = 0; if (x > x0) for (let y = y0; y < y1; y++) mp = Math.max(mp, d(x - 1, y));
      const t = x > x0 && m !== mp ? (0.5 - mp / dmax) / ((m - mp) / dmax) : 0;
      return +(((x - 1 + t) + 0.5) / dpr).toFixed(2); } }
  return null;
}
(async () => {
  const b = await launch();
  const out = {};
  for (const dpr of [1, 3]) {
    const { page } = await open(b, { plans: FIX.plans, stops: FIX.stops, visited: ['mir'], dsf: dpr });
    await page.evaluate(() => document.getElementById('toggleFiltersBtn').click()); await W(350);
    await page.evaluate(() => document.querySelector('#listSwitch [data-view="plans"]').click()); await W(700);
    await page.evaluate(() => document.getElementById('toggleFiltersBtn').click()); await W(500);
    const shots = [];
    const maxScroll = await page.evaluate(() => { const l = document.getElementById('locationsList'); return l.scrollHeight - l.clientHeight; });
    for (let top = 0; top <= maxScroll + 100; top += 112) {   // every row of the list: the stops, then every Places row below the divider
      await page.evaluate(t => { document.getElementById('locationsList').scrollTop = t; }, top); await W(250);
      const geo = await page.evaluate(() => {
        const lr = document.getElementById('locationsList').getBoundingClientRect(), hdr = document.getElementById('locationsHeader');
        const vis = r => r.top >= lr.top && r.bottom <= Math.min(lr.bottom, innerHeight);
        const rows = [...document.querySelectorAll('#locationsList > .location-card')].map(e => {
          const r = e.getBoundingClientRect(); if (!vis(r)) return null;
          const bad = e.querySelector('.row-badge').getBoundingClientRect(), h3 = e.querySelector('h3').getBoundingClientRect();
          const kind = e.querySelector('.row-badge polygon') ? 'diamond' : e.querySelector('.row-badge circle[stroke-dasharray]') ? 'dashed' : 'ring';
          return { id: e.dataset.id || 's' + e.dataset.shapeId, stop: e.classList.contains('is-stop'), name: e.querySelector('h3').textContent, kind,
            badge: { x1: bad.left - 3, x2: bad.right, y1: bad.top, y2: bad.bottom }, text: { x1: h3.left - 4, x2: h3.left + 14, y1: h3.top, y2: h3.bottom },
            bgAt: { x: r.left + 3, y: r.top + 4 } };
        }).filter(Boolean);
        const t = hdr.querySelector('h2').getBoundingClientRect();
        return { rows, title: { x1: t.left - 4, x2: t.left + 14, y1: t.top, y2: t.bottom, bgAt: { x: t.left - 6, y: t.top + 2 } } };
      });
      const img = decodePNG(await page.screenshot());
      const px = (p) => { const i = Math.round(p.y * dpr) * img.w * img.bpp + Math.round(p.x * dpr) * img.bpp; return [img.px[i], img.px[i + 1], img.px[i + 2]]; };
      geo.rows.forEach(r => { const bg = px(r.bgAt); r.iconInk = inkLeft(img, dpr, r.badge, bg); r.textInk = inkLeft(img, dpr, r.text, bg); delete r.badge; delete r.text; delete r.bgAt; });
      geo.titleInk = inkLeft(img, dpr, geo.title, px(geo.title.bgAt));
      shots.push(geo);
    }
    const rows = shots.flatMap(s => s.rows).filter((r, i, a) => a.findIndex(x => x.id === r.id) === i);
    const placeText = rows.filter(r => !r.stop).map(r => r.textInk).filter(x => x != null && x < 60);   // (a starred row's name sits after its star)
    const med = a => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; };
    // names by the shape of their first letter (the type's own optical rule): stems sit ON the edge,
    // rounds overshoot it a little, points (A, T, V...) overshoot it most
    const cls = n => /^[BDEFHIKLMNPRÆ]/.test(n) ? 'stem' : /^[CGOQSØ]/.test(n) ? 'round' : /^[AVWTXY]/.test(n) ? 'point' : null;
    const by = k => med(rows.filter(r => !r.stop && r.textInk != null && r.textInk < 60 && cls(r.name) === k).map(r => r.textInk));
    const letters = { stem: by('stem'), round: by('round'), point: by('point') };
    out[`${dpr}x`] = { letters, titleInk: shots[0].titleInk, placeTextInk: { median: med(placeText), min: Math.min(...placeText), max: Math.max(...placeText), each: rows.filter(r => !r.stop).map(r => [r.name, r.textInk]) },
      stopIcons: rows.filter(r => r.stop).map(r => ({ name: r.name, kind: r.kind, iconInk: r.iconInk })) };
    await page.context().close();
  }
  await b.close();
  fs.writeFileSync(path.join(OUTROOT, 'ink.json'), JSON.stringify(out, null, 1));
  for (const [k, v] of Object.entries(out)) {
    console.log(`${k}: title ink ${v.titleInk} · Places names ink median ${v.placeTextInk.median} (${v.placeTextInk.min}–${v.placeTextInk.max}) · by first letter: stem ${v.letters.stem}, round ${v.letters.round}, point ${v.letters.point}`);
    v.stopIcons.forEach(s => console.log(`   ${s.kind.padEnd(7)} ${s.iconInk}  (${s.name})  offset vs names ${(s.iconInk - v.placeTextInk.median).toFixed(2)}`));
  }
})();
