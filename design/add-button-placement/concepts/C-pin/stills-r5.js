// C. Pencilled pin, ROUND 5 stills (visual designer). This folder's index.html copy (systems) + visual.inc.html (round-3
// look) + visual-r5.inc.html (the new resting pin), injected in memory. Reykjavík, stub data.
// Run: node stills-r5.js  (ONLY=<prefix>, C=<variant list for the study>)
const L = require('../lib-render.js'); const chromeCheck = require('../chrome-check.js'); const fs = require('fs'); const path = require('path');
const COPY = path.join(__dirname, 'index.html'), OUT = path.join(__dirname, 'r5');
const LOOK = fs.readFileSync(path.join(__dirname, 'visual.inc.html'), 'utf8'), R5 = fs.readFileSync(path.join(__dirname, 'visual-r5.inc.html'), 'utf8');
fs.mkdirSync(OUT, { recursive: true });
const RING = s => s.ring || process.env.RING || 'graphite';   // the round-5 fix: an empty pin, not a dashed ring
const withLook = (v, ring) => h => { const i = h.lastIndexOf('</body>'); h = h.slice(0, i) + LOOK + '\n' + R5 + '\n' + h.slice(i); return h.replace('<html lang="en"', `<html lang="en" data-c="${v}"${ring === 'dashed' ? '' : ` data-ring="${ring}"`}`); };
const crop1x = { x: 150, y: 400, width: 240, height: 240 };   // the SAME window in A, C and the baseline
const S = {};
for (const v of (process.env.C || 'ring,bare,big').split(',')) { S[`study-${v}-1x`] = { v, vp: [390, 844], dsf: 1, clip: crop1x }; S[`study-${v}-3x`] = { v, vp: [390, 844], clip: crop1x }; }
for (const r of (process.env.RINGS || 'graphite,navy,hollow,dashed').split(',')) { S[`ring-${r}-1x`] = { v: 'ring', ring: r, vp: [390, 844], dsf: 1, clip: crop1x }; S[`ring-${r}-3x`] = { v: 'ring', ring: r, vp: [390, 844], clip: crop1x }; }
const openTag = async p => { const id = await p.evaluate(() => (locations.find(l => l.starred && l.visited && document.querySelector(`#locationsList .location-card[data-id="${l.id}"]`)) || {}).id); await p.click(`#locationsList .location-card[data-id="${id}"]`); await p.waitForTimeout(1900); };
Object.assign(S, {
  'rest':      { v: 'ring', vp: [390, 844] },
  'pressed':   { v: 'ring', vp: [390, 844], clip: { x: 230, y: 420, width: 160, height: 140 }, run: p => p.evaluate(() => document.getElementById('pencilPin').classList.add('press')) },
  'tag':       { v: 'ring', vp: [390, 844], run: openTag },
  'collapsed': { v: 'ring', vp: [390, 844], inset: true, run: async p => { await p.click('#collapseBtn'); await p.waitForTimeout(700); } },
  'cph320':    { v: 'ring', vp: [320, 568], city: 'copenhagen' },
  'rest664':   { v: 'ring', vp: [390, 664] },
});
(async () => {
  const b = await L.launch(); const out = {};
  for (const [name, s] of Object.entries(S).filter(([n]) => !process.env.ONLY || n.startsWith(process.env.ONLY))) {
    const { ctx, page, errs } = await L.open(b, { html: COPY, ...s, patch: withLook(s.v, RING(s)) });
    await page.evaluate(c => setActiveCity(c), s.city || 'reykjavik'); await page.waitForTimeout(900);
    if (s.run) await s.run(page);
    await page.waitForTimeout(300);
    out[name] = { pin: await L.box(page, '#pencilPin'), pinHit: await L.hit(page, '#pencilPin'), tag: await L.box(page, '#pencilPin .r5-tagw'), sheetTop: await page.evaluate(() => Math.round(document.getElementById('locations').getBoundingClientRect().top)),
      credit: await L.box(page, '.leaflet-control-attribution'), pinsUnder: await page.evaluate(() => { const p = document.getElementById('pencilPin').getBoundingClientRect(); return [...document.querySelectorAll('.leaflet-marker-icon')].filter(m => { const r = m.getBoundingClientRect(); return Math.min(p.right, r.right) - Math.max(p.left, r.left) > 1 && Math.min(p.bottom, r.bottom) - Math.max(p.top, r.top) > 1; }).length; }),
      errs, clash: await chromeCheck(page) };
    console.log(name, JSON.stringify(out[name]));
    await page.screenshot({ path: path.join(OUT, `${name}${name.endsWith('x') ? '' : '-3x'}.png`), ...(s.clip ? { clip: s.clip } : {}) });
    await ctx.close();
  }
  fs.writeFileSync(path.join(OUT, `measure${process.env.ONLY ? '-' + process.env.ONLY : ''}.json`), JSON.stringify(out, null, 1));
  await b.close();
})();
