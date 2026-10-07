// Hanging Tag v4 renders: the REAL app (index.html, unmodified) in the gesture harness, real rows patched in,
// round 3's concepts.js for shared helpers (exposed as K2), then tag4.js draws the tag.
//   node design/popup-hierarchy/round6/tag/render.js [name ...]
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process');
const { launch, openProto, W } = require('../../../gesture-harness/lib');
const OUT = __dirname, R3 = path.join(__dirname, '../../round3');
const BASE = fs.readFileSync(path.join(__dirname, '../../round1/concepts.js'), 'utf8').match(/  function basemap\(\) \{[\s\S]*?\n  \}\n/)[0];
const HELPERS = fs.readFileSync(path.join(R3, 'concepts.js'), 'utf8').replace('/*BASEMAP*/', () => BASE)
  .replace('  window.K = {', '  window.K2 = { esc, ic, rowStamp, seal, typeWord, meta, dirBtn, starBtn, acts0: acts, addr1, select, pinScreen, movePinTo, anno, tapAt, bg, SHADOW, growMap, basemap, place };\n  window.K = {');
const TAG = fs.readFileSync(path.join(__dirname, 'tag5.js'), 'utf8');

const DATA = {
  busiest: ['rey05', { name: 'VEGA Copenhagen', category: 'bar',
    address: 'Vega, Rejsbygade, Humleby, Den Gule By, Vesterbro, Copenhagen, Copenhagen Municipality, Capital Region of Denmark, 1674, Denmark',
    notes: "Store VEGA, Lille VEGA, Ideal Bar — the city's premier venue. Sat Sept 26: María José Llergo (Lille VEGA), Lake Street Dive w/ Røverdatter (Store VEGA, waitlisted), KARLA w/ Asger Falgren (Ideal Bar).",
    starred: true, visited: true }, 15],
  typical: ['rey07', { name: 'Aurora Reykjavík', category: 'attraction',
    address: 'Aurora Reykjavik Northern Lights Center, 53, Fiskislóð, Örfirisey, Vesturbær, Reykjavik, Capital Region, 101, Iceland',
    notes: 'Indoor Northern Lights exhibit, rainy-day/kid option. Grandi harbor — not to be confused with unrelated businesses that also use "Aurora" in their name.',
    starred: false, visited: false }, 16],
  'typ-s': ['rey07', null, 16, { starred: true, visited: false }],
  'typ-v': ['rey07', null, 16, { starred: false, visited: true }],
  'typ-sv': ['rey07', null, 16, { starred: true, visited: true }],
  approx: ['rey15', { name: 'Værnedamsvej (approx.)', category: 'district', address: null,
    notes: "Copenhagen's most charming market street; Granola (retro coffee lounge/backyard café), Le Gourmand (French deli/cheese & charcuterie), Helges Ost (cheesemonger), Falernum (natural wine bar with tapas), Café Viggo (French bistro), Dora (design/vintage homewares)\n\nApproximate placement -- OSM has no boundary/way for this district; resolved via point search.",
    starred: false, visited: false }, 16],
  worst: ['rey05', { name: 'Værnedamsvej (approx.)', category: 'district', address: null,
    notes: "Copenhagen's most charming market street; Granola (retro coffee lounge/backyard café), Le Gourmand (French deli/cheese & charcuterie), Helges Ost (cheesemonger), Falernum (natural wine bar with tapas), Café Viggo (French bistro), Dora (design/vintage homewares)\n\nApproximate placement -- OSM has no boundary/way for this district; resolved via point search.",
    starred: true, visited: true }, 16],
  resto: ['rey00', { name: 'Bæjarins Beztu', category: 'restaurant', address: null, notes: null, starred: true, visited: false }, 16],
  bare: ['rey13', { name: 'Perlan', category: 'attraction', address: null, notes: null, starred: false, visited: false }, 16],
};

// [name, state, opts, caption]
const J = [
  ['stub-busiest', 'busiest', { paperMode: 'stub' }, '1 The stub carries the state: busiest (starred + visited)'],
  ['stub-typical', 'typical', { paperMode: 'stub' }, '1 The stub carries the state: typical (neither)'],
  ['stub-visited', 'typ-v', { paperMode: 'stub' }, '1 The stub carries the state: visited'],
  ['stub-starred', 'typ-s', { paperMode: 'stub' }, '1 The stub carries the state: starred'],
  ['stub-both', 'typ-sv', { paperMode: 'stub' }, '1 The stub carries the state: starred + visited'],
  ['stub-signedout', 'typ-s', { paperMode: 'stub', so: true }, '1 The stub carries the state: signed out (starred)'],
  ['whole-busiest', 'busiest', { paperMode: 'whole' }, '2 The whole tag carries the state: busiest (starred + visited)'],
  ['whole-typical', 'typical', { paperMode: 'whole' }, '2 The whole tag carries the state: typical (neither)'],
  ['whole-visited', 'typ-v', { paperMode: 'whole' }, '2 The whole tag carries the state: visited'],
  ['whole-starred', 'typ-s', { paperMode: 'whole' }, '2 The whole tag carries the state: starred'],
  ['whole-both', 'typ-sv', { paperMode: 'whole' }, '2 The whole tag carries the state: starred + visited'],
  ['whole-signedout', 'typ-s', { paperMode: 'whole', so: true }, '2 The whole tag carries the state: signed out (starred)'],
  ['band-busiest', 'busiest', { paperMode: 'band' }, '3 A coloured band for starred: busiest (starred + visited)'],
  ['band-typical', 'typical', { paperMode: 'band' }, '3 A coloured band for starred: typical (neither)'],
  ['band-visited', 'typ-v', { paperMode: 'band' }, '3 A coloured band for starred: visited'],
  ['band-starred', 'typ-s', { paperMode: 'band' }, '3 A coloured band for starred: starred'],
  ['band-both', 'typ-sv', { paperMode: 'band' }, '3 A coloured band for starred: starred + visited'],
  ['band-signedout', 'typ-s', { paperMode: 'band', so: true }, '3 A coloured band for starred: signed out (starred)'],
];

async function setup(b, state) {
  const plan = state === 'busiest' || state === 'worst';
  const { ctx, page, errors } = await openProto(b, { dsf: 3, reduced: true, storage: plan ? { 'gh.plans': '1', 'triplet.reorderHint': '1' } : {} });
  if (plan) { await page.waitForFunction(() => typeof plans !== 'undefined' && plans.length === 1, null, { timeout: 10000 }); await page.evaluate(() => setListView('plans')); await W(600); }
  if (state === 'shape') {
    await page.evaluate(async () => { const s = window.__SHAPES.find(x => x.city === 'reykjavik' && x.type === 'district'); s.label = 'Grandi (Old Harbour creative district)'; await refetchNeighborhoodShapes(); });
    await W(300);
    await page.evaluate(() => { const s = neighborhoodShapes.find(x => x.city === 'reykjavik' && x.type === 'district'); map.setView(shapeAnchor(s), 16, { animate: false }); });
  } else {
    let [id, data, z, flags] = DATA[state]; if (!data) data = { ...DATA.typical[1], ...flags };
    await page.evaluate(async ([id, d]) => { const r = window.__ROWS.find(x => x.id === id); Object.assign(r, d); await refetchLocations(); window.__placeId = id; }, [id, data]);
    await W(300);
    await page.evaluate(([id, z]) => { const l = locations.find(x => x.id === id); map.setView([l.lat, l.lng], z, { animate: false }); }, [id, z]);
  }
  await W(600);
  return { ctx, page, errors };
}

(async () => {
  const only = process.argv.slice(2);
  const b = await launch();
  fs.mkdirSync(path.join(OUT, 'stills'), { recursive: true }); fs.mkdirSync(path.join(OUT, '_sheet'), { recursive: true });
  for (const [name, state, opts, caption] of J) {
    if (only.length && !only.includes(name)) continue;
    const { ctx, page, errors } = await setup(b, state);
    await page.addScriptTag({ content: HELPERS }); await page.addScriptTag({ content: TAG });
    let sels;
    try { sels = await page.evaluate(([st, o]) => { K.css(); K2.basemap(); const sty = document.createElement('style'); sty.textContent = ':root{--star:#A3266F;--paper-starred:color-mix(in srgb,var(--star) 12%,var(--paper-raised));--paper-starred-filed:color-mix(in srgb,var(--star) 12%,var(--paper-filed))} .row-star,.marker-star-ink{color:var(--star)!important}'; document.head.appendChild(sty); window.__anno = true; const P = K2.place(st); return TAG5(P, o); }, [state, opts]); }
    catch (e) { console.log('FAIL', name, e.message); await ctx.close(); continue; }
    await page.evaluate(() => document.fonts.ready); await W(500);
    const box = await page.evaluate((sels) => { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      for (const s of sels) for (const e of document.querySelectorAll(s)) { const r = e.getBoundingClientRect(); if (!r.width) continue; x0 = Math.min(x0, r.left); y0 = Math.min(y0, r.top); x1 = Math.max(x1, r.right); y1 = Math.max(y1, r.bottom); }
      return { x0, y0, x1, y1 }; }, sels);
    const pad = 20, clip = { x: Math.max(0, box.x0 - pad), y: Math.max(0, box.y0 - pad - 40) };
    clip.width = Math.min(390, box.x1 + pad) - clip.x; clip.height = Math.min(844, box.y1 + pad) - clip.y;
    const f = n => path.join(OUT, 'stills', `${name}-${n}`);
    await page.screenshot({ path: f('phone@3x.png') });
    await page.screenshot({ path: f('crop@3x.png'), clip });
    execFileSync('convert', [f('phone@3x.png'), '-filter', 'Box', '-resize', '390x844', f('phone@1x.png')]);
    execFileSync('convert', [f('phone@3x.png'), '-resize', '780x1688', '-quality', '72', path.join(OUT, '_sheet', `${name}-phone.jpg`)]);
    execFileSync('convert', [f('crop@3x.png'), '-resize', '1000x>', '-quality', '76', path.join(OUT, '_sheet', `${name}-crop.jpg`)]);
    fs.unlinkSync(f('phone@3x.png'));
    console.log(name, JSON.stringify(clip), errors.length ? errors : '');
    await ctx.close();
  }
  fs.writeFileSync(path.join(OUT, '_sheet', 'captions.json'), JSON.stringify(J.map(j => [j[0], j[3]]), null, 1));
  await b.close();
})();
