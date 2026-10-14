// Systems round 9: C (pin+tag button) on the REAL 202 pin positions (../pass-a-check/real-pins.txt). Uses visual's own layers
// (blank.inc.html + C-pintag/c.inc.html + the credit-prefix rule) on a copy of today's main; nothing is edited.
// 1) the button's box vs every live marker and the credit: 5 cities x 4 viewports x list up / collapsed (the app's opening fit)
// 2) squint frames (pick and the quiet variant, with/without the account) at the opening fit and at z14 (visual's CREST)
const L = require('../lib-render.js'); const fs = require('fs'); const path = require('path');
const CON = path.join(__dirname, '..'), real = fs.readFileSync('/home/user/triplet/index.html', 'utf8'), rd = f => fs.readFileSync(path.join(CON, f), 'utf8');
const PREFIX = `<script>(function () { const t = setInterval(() => { try { if (map && map.attributionControl) { if (map.getSize().x < 338) map.attributionControl.setPrefix(false); clearInterval(t); } } catch (e) {} }, 50); })();</script>`;
const inj = (h, incs, attrs) => { const i = h.lastIndexOf('</body>'); return (h.slice(0, i) + incs.join('\n') + '\n' + h.slice(i)).replace('<html lang="en"', `<html lang="en" ${attrs}`); };
const VAR = process.env.CV ? JSON.parse(process.env.CV) : { pick: 'data-cpin="fill" data-cstub="third" data-cplus="tag"', quiet: 'data-cpin="fill" data-cstub="cream" data-cplus="tag"' };
const html = v => inj(real, [rd('blank-tag-form/blank.inc.html'), rd('C-tag-r10/t.inc.html'), PREFIX], `${VAR[v]}`);
const TAG = process.env.TAG || '';
const CAT = { re: 'restaurant', sh: 'shopping', ca: 'cafe', ar: 'area', at: 'attraction', ba: 'bar', na: 'nature', di: 'district' };
const CITY = { co: 'copenhagen', la: 'la', ma: 'malmo', re: 'reykjavik', st: 'stockholm' };
const rows = fs.readFileSync(path.join(CON, 'pass-a-check/real-pins.txt'), 'utf8').trim().split(';').map((s, i) => { const [c, la, ln, k] = s.trim().split(' ');
  return { id: 'r' + i, name: 'Place ' + i, address: '1 Street', category: CAT[k.replace('*', '')], lat: +la, lng: +ln, notes: null, visited: false, starred: k.endsWith('*'), city: CITY[c], created_at: '2026-09-01T00:00:00Z' }; });
const JS = `;window.__ROWS = ${JSON.stringify(rows)}; window.__SHAPES = [];`;
const OUT = path.join(__dirname, 'frames'); fs.mkdirSync(OUT, { recursive: true });
const MEAS = `(() => { const ov = (a, b, m = 0) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > -m && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > -m;
  const cp = document.getElementById('tb').getBoundingClientRect(), cr = document.querySelector('.leaflet-control-attribution').getBoundingClientRect();
  const ms = [...document.querySelectorAll('.leaflet-marker-icon')].map(m => m.getBoundingClientRect());
  return { box: [cp.left, cp.top, cp.right, cp.bottom].map(v => +v.toFixed(1)), under: ms.filter(m => ov(cp, m)).length, near6: ms.filter(m => ov(cp, m, 6)).length - ms.filter(m => ov(cp, m)).length,
    credit: [cr.left, cr.top, cr.right, cr.bottom].map(v => +v.toFixed(1)), creditGap: +Math.max(cr.left - cp.right, cr.top - cp.bottom).toFixed(1), markers: ms.length, zoom: map.getZoom() }; })()`;
(async () => {
  const b = await L.launch(); const out = { fit: {}, frames: {} };
  const tmp = v => { const f = path.join(__dirname, `_c-${v}.html`); fs.writeFileSync(f, html(v)); return f; };
  const names = Object.keys(VAR), files = Object.fromEntries(names.map(n => [n, tmp(n)])); const fPick = files[names[0]];
  for (const vp of [[390, 844], [390, 664], [375, 667], [320, 568]]) {
    const { ctx, page } = await L.open(b, { html: fPick, vp, js: JS, dsf: 1 });
    for (const city of Object.values(CITY)) for (const col of [false, true]) {
      await page.evaluate(c => setActiveCity(c), city); await page.waitForTimeout(900);
      const isCol = await page.evaluate(() => document.getElementById('locations').classList.contains('collapsed'));
      if (isCol !== col) { await page.click('#collapseBtn'); await page.waitForTimeout(800); }
      out.fit[`${vp.join('x')}|${city}|${col ? 'collapsed' : 'up'}`] = await page.evaluate(MEAS);
    }
    await ctx.close();
  }
  // squint frames, 390x844 @1x: opening fit (Reykjavik) and z14 at visual's CREST
  for (const [v, f] of Object.entries(files)) for (const view of ['fit', 'z14']) {
    const { ctx, page } = await L.open(b, { html: f, vp: [390, 844], js: JS, dsf: 1 });
    await page.evaluate(() => setActiveCity('reykjavik')); await page.waitForTimeout(900);
    if (view === 'z14') { await page.evaluate(() => map.setView([64.1460, -21.9380], 14, { animate: false })); await page.waitForTimeout(900); }
    await page.screenshot({ path: path.join(OUT, `${TAG}${v}-${view}.png`) });
    out.frames[`${v}-${view}`] = await page.evaluate(MEAS);
    out.frames[`acct`] = await page.evaluate(() => { const r = document.getElementById('accountBtn').getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom]; });
    await page.evaluate(() => document.getElementById('tb').classList.add('gone')); await page.waitForTimeout(100);
    await page.screenshot({ path: path.join(OUT, `${TAG}${v}-${view}-none.png`) });
    await ctx.close();
  }
  fs.writeFileSync(path.join(__dirname, `${TAG}c-check.json`), JSON.stringify(out, null, 1)); Object.values(files).forEach(f => fs.unlinkSync(f)); await b.close();
})();
