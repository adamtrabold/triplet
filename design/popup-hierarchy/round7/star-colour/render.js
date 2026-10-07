// Star colour options across surfaces, in the REAL app (index.html, unmodified) in the gesture harness. Each option is
// injected as one CSS override of the three star inks (list row star, map star, gesture ink) + the tag (round 6 tag4.js).
//   node design/popup-hierarchy/round7/star-colour/render.js [option ...]
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process');
const { launch, openProto, W, drag, line, rowRect } = require('../../../gesture-harness/lib');
const OUT = __dirname;
const OPTS = { ink: ['#1A1A18', 'Today: black ink'], magenta: ['#A3266F', 'A Red-pencil magenta'], leaf: ['#4E7A0E', 'B Leaf green'] };
const BASE = fs.readFileSync(path.join(__dirname, '../../round1/concepts.js'), 'utf8').match(/  function basemap\(\) \{[\s\S]*?\n  \}\n/)[0];
const HELPERS = fs.readFileSync(path.join(__dirname, '../../round3/concepts.js'), 'utf8').replace('/*BASEMAP*/', () => BASE)
  .replace('  window.K = {', '  window.K2 = { esc, ic, rowStamp, seal, typeWord, meta, dirBtn, starBtn, acts0: acts, addr1, select, pinScreen, movePinTo, anno, tapAt, bg, SHADOW, growMap, basemap, place };\n  window.K = {');
const TAG = fs.readFileSync(path.join(__dirname, '../../round6/tag/tag4.js'), 'utf8');
const css = c => `:root { --star: ${c}; }
  .row-star, .sg-star .sg-ink, .marker-star-ink { color: var(--star) !important; }
  .location-card.highlighted .row-star { color: var(--paper) !important; }   /* reversed block: everything paper, as today */
  .c-star .W-seg.star.on { color: var(--star) !important; }`;
// starred: restaurants (orange) and a visited cafe; visited: several
const STAR = ['00', '03', '06', '01', '02', '10', '12'], VIS = ['01', '02', '12', '04'];

async function prep(b, city, { plan = false } = {}) {
  const pre = city.slice(0, 3);
  const r = await openProto(b, { dsf: 3, reduced: false, city, storage: plan ? { 'gh.plans': '1', 'triplet.reorderHint': '1' } : {} });
  await r.page.evaluate(async ([pre, S, V]) => { window.__ROWS.forEach(x => { if (x.city.startsWith(pre)) { const n = x.id.slice(3); x.starred = S.includes(n); x.visited = V.includes(n); } }); await refetchLocations(); }, [pre, STAR, VIS]);
  await r.page.addScriptTag({ content: HELPERS }); await r.page.evaluate(() => { K.css(); K2.basemap(); });
  await W(500); return r;
}
async function shot(page, name, clip) {
  const f = n => path.join(OUT, 'stills', `${name}-${n}`);
  await page.screenshot({ path: f('phone@3x.png') });
  if (clip) await page.screenshot({ path: f('crop@3x.png'), clip });
  execFileSync('convert', [f('phone@3x.png'), '-filter', 'Box', '-resize', '390x844', f('phone@1x.png')]);
  fs.unlinkSync(f('phone@3x.png'));
  console.log(name);
}

(async () => {
  const only = process.argv.slice(2);
  fs.mkdirSync(path.join(OUT, 'stills'), { recursive: true });
  const b = await launch();
  for (const [key, [hex]] of Object.entries(OPTS)) {
    if (only.length && !only.includes(key)) continue;
    // 1 the list, two orange-accent cities (Reykjavík, Copenhagen), one starred row highlighted
    for (const city of ['reykjavik', 'copenhagen']) {
      const { ctx, page } = await prep(b, city);
      await page.addStyleTag({ content: css(hex) });
      await page.evaluate(pre => { try { setHighlighted(pre + '03'); } catch (e) {} }, city.slice(0, 3)); await W(400);
      await shot(page, `${key}-list-${city}`, { x: 0, y: 520, width: 390, height: 324 });
      await ctx.close();
    }
    // 2 the map: starred pins beside orange restaurant pins, and clusters (zoom out one step)
    { const { ctx, page } = await prep(b, 'reykjavik');
      await page.addStyleTag({ content: css(hex) });
      await page.evaluate(() => { document.getElementById('locations').classList.add('collapsed'); map.setView([64.1466, -21.9426], 14, { animate: false }); }); await W(700);
      await shot(page, `${key}-map-near`, { x: 0, y: 120, width: 390, height: 420 });
      await page.evaluate(() => map.setView([64.1466, -21.9426], 12, { animate: false })); await W(700);
      await shot(page, `${key}-map-far`, { x: 0, y: 120, width: 390, height: 420 });
      await ctx.close(); }
    // 3 the tag (round 6 design, pencil circle kept): VEGA busiest
    { const { ctx, page } = await openProto(b, { dsf: 3, reduced: true, storage: { 'gh.plans': '1', 'triplet.reorderHint': '1' } });
      await page.waitForFunction(() => typeof plans !== 'undefined' && plans.length === 1, null, { timeout: 10000 }); await page.evaluate(() => setListView('plans')); await W(500);
      await page.evaluate(async () => { const r = window.__ROWS.find(x => x.id === 'rey05'); Object.assign(r, { name: 'VEGA Copenhagen', category: 'bar',
        address: 'Vega, Rejsbygade, Humleby, Den Gule By, Vesterbro, Copenhagen, Copenhagen Municipality, Capital Region of Denmark, 1674, Denmark',
        notes: "Store VEGA, Lille VEGA, Ideal Bar — the city's premier venue. Sat Sept 26: María José Llergo (Lille VEGA), Lake Street Dive w/ Røverdatter (Store VEGA, waitlisted), KARLA w/ Asger Falgren (Ideal Bar).", starred: true, visited: true });
        await refetchLocations(); window.__placeId = 'rey05'; }); await W(400);
      await page.evaluate(() => { const l = locations.find(x => x.id === 'rey05'); map.setView([l.lat, l.lng], 15, { animate: false }); }); await W(400);
      await page.addScriptTag({ content: HELPERS }); await page.addScriptTag({ content: TAG });
      await page.evaluate(() => { K.css(); K2.basemap(); return TAG4(K2.place('busiest'), { color: 'star' }); });
      await page.addStyleTag({ content: css(hex) }); await page.evaluate(() => document.fonts.ready); await W(400);
      await shot(page, `${key}-tag`, { x: 17, y: 60, width: 356, height: 420 });
      await ctx.close(); }
    // 4 the Pencil Star gesture: one frame just past the commit (the ink lands in the star colour)
    { const { ctx, page } = await prep(b, 'reykjavik');
      await page.addStyleTag({ content: css(hex) });
      const cdp = await ctx.newCDPSession(page);
      const rr = await rowRect(page, 4);
      const y = rr.y + rr.h / 2, x0 = 140;
      let done = false;
      await drag(page, cdp, line(x0, y, x0 + 72, y, 18), { stepMs: 16, hold: 300, onStep: async i => { if (i === 18 && !done) { done = true; await W(260); await shot(page, `${key}-gesture`, { x: 0, y: rr.y - 60, width: 390, height: rr.h + 120 }); } } });
      await ctx.close(); }
  }
  await b.close();
})();
