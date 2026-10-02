// Numbers hierarchy, measured at 1x (390x844) on the real pages:
//   phase-1 build (ba0865c, unpatched) vs v3 options (patched, window.__V3 knobs).
// For each mark: box size, WCAG contrast of its darkest ink vs the row field, and INK MASS =
// sum over the box of (1 - L/L_field), L = relative luminance -- how much "dark" the eye gets.
// Reported relative to the row's own name (h3) so "quieter than the name" is a number.
//   REPO=<worktree> VENDOR=<dir> node measure.js   -> ../measure.json
const fs = require('fs'), path = require('path'), zlib = require('zlib'), { execFileSync } = require('child_process');
const REPO = process.env.REPO || path.resolve(__dirname, '../../../..');
const TMP = fs.mkdtempSync('/tmp/plans-v3m-');
const built = path.join(TMP, 'built.html'), v3 = path.join(TMP, 'v3.html');
fs.writeFileSync(built, execFileSync('git', ['-C', REPO, 'show', 'ba0865c:index.html']));
execFileSync('python3', [path.join(__dirname, 'patch.py'), built, v3]);
process.env.PAGE = process.env.PAGE || v3;
function decodePNG(buf) {   // 8-bit RGB/RGBA, non-interlaced (what Chromium writes)
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
const lin = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const L = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
async function marks(page, sels) {
  const boxes = await page.evaluate(sels => Object.fromEntries(Object.entries(sels).map(([k, s]) => { const e = document.querySelector(s); if (!e) return [k, null]; const r = e.getBoundingClientRect(); return [k, { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), font: getComputedStyle(e).fontSize }]; })), sels);
  const img = decodePNG(await page.screenshot());
  const res = {};
  for (const [k, b] of Object.entries(boxes)) {
    if (!b) { res[k] = null; continue; }
    // field = the brightest pixel in the box's row band (the row background)
    let field = 0, mass = 0, darkest = 1;
    const at = (x, y) => { const i = y * img.w * img.bpp + x * img.bpp; return L(img.px[i], img.px[i + 1], img.px[i + 2]); };
    for (let y = b.y; y < b.y + b.h; y++) for (let x = b.x; x < b.x + b.w; x++) field = Math.max(field, at(x, y));
    for (let y = b.y; y < b.y + b.h; y++) for (let x = b.x; x < b.x + b.w; x++) { const l = at(x, y); darkest = Math.min(darkest, l); mass += Math.max(0, 1 - l / field); }
    res[k] = { box: `${b.w}x${b.h}`, font: b.font, contrast: +((field + 0.05) / (darkest + 0.05)).toFixed(2), mass: Math.round(mass) };
  }
  return res;
}
(async () => {
  const H = require('./harness');   // needs PAGE set per run
  const out = {};
  const runs = [['build (phase 1)', built, null, { next: '.plan-tile.next', stop: '.location-card[data-id="cof"] .plan-tile', x: null, name: '.location-card[data-id="jae"] h3', nameCof: '.location-card[data-id="cof"] h3' }]];
  // r11: one number state (grey), so one run
  runs.push(['r11 grey number (one state)', v3, { num: 'plain' }, { stop: '.location-card[data-id="cof"] .row-n', x: '.location-card[data-id="cof"] .plan-x', nameCof: '.location-card[data-id="cof"] h3' }]);
  for (const [tag, page, v, sels] of runs) {
    process.env.PAGE = page;
    delete require.cache[require.resolve('./harness')];
    const { open, launch, FIX } = require('./harness');
    const b = await launch();
    const { page: pg } = await open(b, { plans: FIX.plans, stops: FIX.stops, visited: ['mir'], init: v ? `window.__V3=${JSON.stringify(v)}` : null });
    await pg.evaluate(() => document.getElementById('toggleFiltersBtn').click()); await new Promise(r => setTimeout(r, 400));
    await pg.evaluate(() => document.querySelector('#listSwitch [data-view="plans"]').click()); await new Promise(r => setTimeout(r, 800));
    await pg.evaluate(() => document.getElementById('toggleFiltersBtn').click()); await new Promise(r => setTimeout(r, 600));
    const s = Object.fromEntries(Object.entries(sels).filter(([, x]) => x));
    const m = await marks(pg, s);
    m.nextVsName = m.next && m.name ? +(m.next.mass / m.name.mass).toFixed(2) : null;
    if (v && v.num === 'plain') {   // r7: the bare + against its row's name and icon (and the X for comparison)
      await pg.evaluate(() => showPlanRule()); await new Promise(r => setTimeout(r, 400));
      const id = await pg.evaluate(() => document.querySelector('#locationsList > .location-card:not(.is-stop)[data-id]').dataset.id);
      const mp = await marks(pg, { plus: `.location-card[data-id="${id}"] .plan-add`, pname: `.location-card[data-id="${id}"] h3`, picon: `.location-card[data-id="${id}"] .row-badge` });
      m.plus = mp.plus; m.plusVsName = +(mp.plus.mass / mp.pname.mass).toFixed(2); m.plusVsIcon = +(mp.plus.mass / mp.picon.mass).toFixed(2);
    }
    m.stopVsName = m.stop && m.nameCof ? +(m.stop.mass / m.nameCof.mass).toFixed(2) : null;
    m.xVsName = m.x && m.nameCof ? +(m.x.mass / m.nameCof.mass).toFixed(2) : null;
    out[tag] = m;
    await b.close();
  }
  // r11: left edges at 1x (Places rows vs Plans stop and place rows)
  {
    process.env.PAGE = v3; delete require.cache[require.resolve('./harness')];
    const { open, launch, FIX } = require('./harness');
    const b = await launch(); const { page: pg } = await open(b, { plans: FIX.plans, stops: FIX.stops, visited: ['mir'] });
    const L = sel => pg.evaluate(s => { const e = document.querySelector(s); return e ? Math.round(e.getBoundingClientRect().left) : null; }, sel);
    const e = { placesBadge: await L('#locationsList .location-card .row-badge'), placesMain: await L('#locationsList .location-card .row-main') };
    await pg.evaluate(() => document.getElementById('toggleFiltersBtn').click()); await new Promise(r => setTimeout(r, 400));
    await pg.evaluate(() => document.querySelector('#listSwitch [data-view="plans"]').click()); await new Promise(r => setTimeout(r, 800));
    await pg.evaluate(() => document.getElementById('toggleFiltersBtn').click()); await new Promise(r => setTimeout(r, 600));
    Object.assign(e, { stopBadge: await L('.location-card.is-stop[data-id="jae"] .row-badge'), stopMain: await L('.location-card.is-stop[data-id="jae"] .row-main'),
      stopNum: await L('.location-card.is-stop[data-id="jae"] .row-n'), stopName: await L('.location-card.is-stop[data-id="jae"] h3') });
    await pg.evaluate(() => showPlanRule()); await new Promise(r => setTimeout(r, 400));
    Object.assign(e, { candBadge: await L('#locationsList > .location-card:not(.is-stop)[data-id] .row-badge'), candMain: await L('#locationsList > .location-card:not(.is-stop)[data-id] .row-main') });
    out['r11 edges'] = e;
    await b.close();
  }
  fs.writeFileSync(path.join(__dirname, '../measure.json'), JSON.stringify(out, null, 1));
  for (const [k, m] of Object.entries(out)) console.log(k.padEnd(48), 'NEXT', JSON.stringify(m.next), 'next/name', m.nextVsName, '| stop', JSON.stringify(m.stop), 'stop/name', m.stopVsName, '| x/name', m.xVsName, '| +/name', m.plusVsName, '+/icon', m.plusVsIcon, JSON.stringify(m.plus || null));
})();
