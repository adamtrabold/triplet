// Gold star + recoloured categories, in the REAL app (index.html, unmodified) in the gesture harness. The star is a gold
// fill inside a 1px --ink keyline; restaurant and attraction get their proposed new inks (gold.json). Writes stills/gold-*.
//   node design/popup-hierarchy/round7/star-colour/render-gold.js
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process');
const { launch, openProto, W, drag, line, rowRect } = require('../../../gesture-harness/lib');
const OUT = __dirname;
const GOLD = '#F2B807', AMBER = '#8A5A0E', NEWCAT = { restaurant: '#7A2436', attraction: '#547326' };
const BASE = fs.readFileSync(path.join(__dirname, '../../round1/concepts.js'), 'utf8').match(/  function basemap\(\) \{[\s\S]*?\n  \}\n/)[0];
const HELPERS = fs.readFileSync(path.join(__dirname, '../../round3/concepts.js'), 'utf8').replace('/*BASEMAP*/', () => BASE)
  .replace('  window.K = {', '  window.K2 = { esc, ic, rowStamp, seal, typeWord, meta, dirBtn, starBtn, acts0: acts, addr1, select, pinScreen, movePinTo, anno, tapAt, bg, SHADOW, growMap, basemap, place };\n  window.K = {');
const CSS = `:root { --star: ${GOLD}; }
  .row-star, .sg-star .sg-ink, .marker-star-ink { color: var(--star) !important; stroke: ${AMBER}; stroke-width: 1.5px; paint-order: stroke; stroke-linejoin: round; }
  .row-star use { stroke: ${AMBER}; stroke-width: 1.5px; }
  .location-card.highlighted .row-star { color: var(--paper) !important; stroke: none; }`;
const STAR = ['00', '01', '02', '03', '05', '06', '08', '10', '12', '15'], VIS = ['01', '02', '04', '05', '12', '15'];
const C = { reykjavik: [64.1466, -21.9426], stockholm: [59.3293, 18.0686], malmo: [55.6050, 13.0038] };

async function prep(b, city, recolour) {
  const pre = city.slice(0, 3);
  const r = await openProto(b, { dsf: 3, city });
  await r.page.evaluate(async ([pre, S, V, NC, rec]) => {
    if (rec) Object.assign(CATEGORY_COLORS, NC);
    window.__ROWS.forEach(x => { if (x.city.startsWith(pre)) { const n = x.id.slice(3); x.starred = S.includes(n); x.visited = V.includes(n); } });
    await refetchLocations(); markersById.forEach(m => m.marker.setIcon(markerIcon(m.loc, false))); }, [pre, STAR, VIS, NEWCAT, recolour]);
  await r.page.addScriptTag({ content: HELPERS }); await r.page.evaluate(() => { K.css(); K2.basemap(); });
  await r.page.addStyleTag({ content: CSS });
  await W(500); return r;
}
async function shot(page, name) {
  const f = n => path.join(OUT, 'stills', `${name}-${n}`);
  await page.screenshot({ path: f('phone@3x.png') });
  execFileSync('convert', [f('phone@3x.png'), '-filter', 'Box', '-resize', '390x844', f('phone@1x.png')]);
  execFileSync('convert', [f('phone@3x.png'), '-crop', '1170x1260+0+180', '+repage', f('crop@3x.png')]);
  fs.unlinkSync(f('phone@3x.png')); console.log(name);
}
(async () => {
  const b = await launch();
  for (const rec of [true, false]) {
    const tag = rec ? 'gold' : 'gold-oldcats';
    for (const city of ['reykjavik', 'stockholm']) {
      const { ctx, page } = await prep(b, city, rec);
      await page.addStyleTag({ content: '#locations { height: 700px !important; }' });
      await page.evaluate(pre => { try { setHighlighted(pre + '03'); } catch (e) {} document.getElementById('locationsList').scrollTop = 0; }, city.slice(0, 3)); await W(500);
      await shot(page, `${tag}-list-${city}`);
      await ctx.close();
      if (!rec) break;
    }
    const { ctx, page } = await prep(b, 'reykjavik', rec);
    await page.evaluate(c => { document.getElementById('locations').classList.add('collapsed'); map.setView(c, 14, { animate: false }); }, C.reykjavik); await W(800);
    await shot(page, `${tag}-map-near`);
    if (rec) { await page.evaluate(c => map.setView(c, 11, { animate: false }), C.reykjavik); await W(900); await shot(page, `${tag}-map-far`); }
    await ctx.close();
  }
  // Malmö: the gold star beside Malmö's ochre --figure (the add / account buttons' glyphs, top right)
  { const { ctx, page } = await prep(b, 'malmo', true);
    await page.evaluate(c => { document.getElementById('locations').classList.add('collapsed'); map.setView(c, 14, { animate: false }); }, C.malmo); await W(800);
    await shot(page, 'gold-malmo-map'); await ctx.close(); }
  // the Pencil Star gesture: the ink lands gold
  { const { ctx, page } = await prep(b, 'reykjavik', true);
    const cdp = await ctx.newCDPSession(page); const rr = await rowRect(page, 4); const y = rr.y + rr.h / 2; let done = false;
    await drag(page, cdp, line(140, y, 212, y, 18), { stepMs: 16, hold: 300, onStep: async i => { if (i === 18 && !done) { done = true; await W(260); await shot(page, 'gold-gesture'); } } });
    await ctx.close(); }
  await b.close();
})();
