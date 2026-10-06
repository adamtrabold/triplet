// Hanging Tag v3 renders: the REAL app (index.html, unmodified) in the gesture harness, real rows patched in,
// round 3's concepts.js for shared helpers (exposed as K2), then tag3.js draws the tag.
//   node design/popup-hierarchy/round5/tag/render.js [name ...]
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process');
const { launch, openProto, W } = require('../../../gesture-harness/lib');
const OUT = __dirname, R3 = path.join(__dirname, '../../round3');
const BASE = fs.readFileSync(path.join(__dirname, '../../round1/concepts.js'), 'utf8').match(/  function basemap\(\) \{[\s\S]*?\n  \}\n/)[0];
const HELPERS = fs.readFileSync(path.join(R3, 'concepts.js'), 'utf8').replace('/*BASEMAP*/', () => BASE)
  .replace('  window.K = {', '  window.K2 = { esc, ic, rowStamp, seal, typeWord, meta, dirBtn, starBtn, acts0: acts, addr1, select, pinScreen, movePinTo, anno, tapAt, bg, SHADOW, growMap, basemap, place };\n  window.K = {');
const TAG = fs.readFileSync(path.join(__dirname, 'tag3.js'), 'utf8');

const DATA = {
  busiest: ['rey05', { name: 'VEGA Copenhagen', category: 'bar',
    address: 'Vega, Rejsbygade, Humleby, Den Gule By, Vesterbro, Copenhagen, Copenhagen Municipality, Capital Region of Denmark, 1674, Denmark',
    notes: "Store VEGA, Lille VEGA, Ideal Bar — the city's premier venue. Sat Sept 26: María José Llergo (Lille VEGA), Lake Street Dive w/ Røverdatter (Store VEGA, waitlisted), KARLA w/ Asger Falgren (Ideal Bar).",
    starred: true, visited: true }, 15],
  typical: ['rey07', { name: 'Aurora Reykjavík', category: 'attraction',
    address: 'Aurora Reykjavik Northern Lights Center, 53, Fiskislóð, Örfirisey, Vesturbær, Reykjavik, Capital Region, 101, Iceland',
    notes: 'Indoor Northern Lights exhibit, rainy-day/kid option. Grandi harbor — not to be confused with unrelated businesses that also use "Aurora" in their name.',
    starred: false, visited: false }, 16],
  approx: ['rey15', { name: 'Værnedamsvej (approx.)', category: 'district', address: null,
    notes: "Copenhagen's most charming market street; Granola (retro coffee lounge/backyard café), Le Gourmand (French deli/cheese & charcuterie), Helges Ost (cheesemonger), Falernum (natural wine bar with tapas), Café Viggo (French bistro), Dora (design/vintage homewares)\n\nApproximate placement -- OSM has no boundary/way for this district; resolved via point search.",
    starred: false, visited: false }, 16],
  bare: ['rey13', { name: 'Perlan', category: 'attraction', address: null, notes: null, starred: false, visited: false }, 16],
};

// [name, state, opts, caption]
const J = [
  ['seg-busiest', 'busiest', { variant: 'seg' }, 'Segmented stub: busiest (VEGA)'],
  ['seg-typical', 'typical', { variant: 'seg' }, 'Segmented stub: typical, not visited'],
  ['seg-approx', 'approx', { variant: 'seg' }, 'Segmented stub: 8-line note in full'],
  ['seg-bare', 'bare', { variant: 'seg' }, 'Segmented stub: name only'],
  ['seg-shape', 'shape', { variant: 'seg' }, 'Segmented stub: district'],
  ['seg-signedout', 'typical', { variant: 'seg', so: true }, 'Segmented stub: signed out'],
  ['seg-v1', 'typical', { variant: 'seg', vis: true, step: 'press' }, 'Segmented stub: 1 tap Visited'],
  ['seg-v2', 'typical', { variant: 'seg', vis: true, step: 'fly' }, 'Segmented stub: 2 the visited moment'],
  ['seg-v3', 'typical', { variant: 'seg', vis: true }, 'Segmented stub: 3 visited'],
  ['claim-busiest', 'busiest', { variant: 'claim' }, 'Claim check: busiest (VEGA)'],
  ['claim-typical', 'typical', { variant: 'claim' }, 'Claim check: typical, not visited'],
  ['claim-approx', 'approx', { variant: 'claim' }, 'Claim check: 8-line note in full'],
  ['claim-bare', 'bare', { variant: 'claim' }, 'Claim check: name only'],
  ['claim-shape', 'shape', { variant: 'claim' }, 'Claim check: district'],
  ['claim-signedout', 'typical', { variant: 'claim', so: true }, 'Claim check: signed out'],
  ['claim-v1', 'typical', { variant: 'claim', vis: true, step: 'press' }, 'Claim check: 1 tap Visited'],
  ['claim-v2', 'typical', { variant: 'claim', vis: true, step: 'fly' }, 'Claim check: 2 the visited moment'],
  ['claim-v3', 'typical', { variant: 'claim', vis: true }, 'Claim check: 3 visited'],
];

async function setup(b, state) {
  const plan = state === 'busiest';
  const { ctx, page, errors } = await openProto(b, { dsf: 3, reduced: true, storage: plan ? { 'gh.plans': '1', 'triplet.reorderHint': '1' } : {} });
  if (plan) { await page.waitForFunction(() => typeof plans !== 'undefined' && plans.length === 1, null, { timeout: 10000 }); await page.evaluate(() => setListView('plans')); await W(600); }
  if (state === 'shape') {
    await page.evaluate(async () => { const s = window.__SHAPES.find(x => x.city === 'reykjavik' && x.type === 'district'); s.label = 'Grandi (Old Harbour creative district)'; await refetchNeighborhoodShapes(); });
    await W(300);
    await page.evaluate(() => { const s = neighborhoodShapes.find(x => x.city === 'reykjavik' && x.type === 'district'); map.setView(shapeAnchor(s), 16, { animate: false }); });
  } else {
    const [id, data, z] = DATA[state];
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
    try { sels = await page.evaluate(([st, o]) => { K.css(); K2.basemap(); window.__anno = true; const P = K2.place(st); return TAG3(P, o); }, [state, opts]); }
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
