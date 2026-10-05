// Round 4 Card File renders: the REAL app (index.html, unmodified) in the gesture harness, real rows' text patched
// into fixture rows (as round 3), then concepts.js draws one variant. Stand-in basemap from round 1.
//   node design/popup-hierarchy/round4/file/render.js [variant ...] [variant/name ...]
// Writes <variant>/<name>-phone@1x.png (box-downscaled from 3x) and <name>-crop@3x.png.
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process');
const { launch, openProto, W } = require('../../../gesture-harness/lib');
const OUT = __dirname;
const JS = fs.readFileSync(path.join(__dirname, 'concepts.js'), 'utf8')
  .replace('/*BASEMAP*/', () => fs.readFileSync(path.join(__dirname, '../../round1/concepts.js'), 'utf8').match(/  function basemap\(\) \{[\s\S]*?\n  \}\n/)[0]);

// Real rows (read-only from Supabase, 2026-10-05), as in rounds 2-3.
const VEGA = { name: 'VEGA Copenhagen', category: 'bar',
  address: 'Vega, Rejsbygade, Humleby, Den Gule By, Vesterbro, Copenhagen, Copenhagen Municipality, Capital Region of Denmark, 1674, Denmark',
  notes: "Store VEGA, Lille VEGA, Ideal Bar — the city's premier venue. Sat Sept 26: María José Llergo (Lille VEGA), Lake Street Dive w/ Røverdatter (Store VEGA, waitlisted), KARLA w/ Asger Falgren (Ideal Bar).",
  starred: true, visited: true };
const AURORA = { name: 'Aurora Reykjavík', category: 'attraction',
  address: 'Aurora Reykjavik Northern Lights Center, 53, Fiskislóð, Örfirisey, Vesturbær, Reykjavik, Capital Region, 101, Iceland',
  notes: 'Indoor Northern Lights exhibit, rainy-day/kid option. Grandi harbor — not to be confused with unrelated businesses that also use "Aurora" in their name.',
  starred: false, visited: false };
const MUSEUM = { name: 'Swedish Museum of Performing Arts Scenkonstmuseet', category: 'attraction',
  address: '2, Sibyllegatan, Östermalm, Norra innerstadens stadsdelsområde, Stockholm, Stockholm Municipality, Stockholm County, 102 41, Sweden',
  notes: 'Instrument history, hands-on, kid-friendly.', starred: true, visited: false };
const DATA = {
  busiest: ['rey05', VEGA, 15],
  typical: ['rey07', AURORA, 16],
  typvis: ['rey07', { ...AURORA, visited: true }, 16],
  approx: ['rey15', { name: 'Værnedamsvej (approx.)', category: 'district', address: null,
    notes: "Copenhagen's most charming market street; Granola (retro coffee lounge/backyard café), Le Gourmand (French deli/cheese & charcuterie), Helges Ost (cheesemonger), Falernum (natural wine bar with tapas), Café Viggo (French bistro), Dora (design/vintage homewares)\n\nApproximate placement -- OSM has no boundary/way for this district; resolved via point search.",
    starred: false, visited: false }, 16],
  bare: ['rey12', { name: 'Perlan', category: 'attraction', address: null, notes: null, starred: false, visited: false }, 16],
  plans: ['rey00', MUSEUM, 16],
  stop3: ['rey01', {}, 16],   // fixture row (Brauð & Co: starred, visited, no note): the card a swap lands on
};
const PLAN_STATES = ['busiest', 'plans', 'stop3'];
const LABEL = {
  busiest: 'Busiest: VEGA (Plans stop 2; starred, visited; 5-line note; long OSM address)',
  typical: 'Typical note: Aurora (not visited)', typvis: 'Same place, visited',
  approx: 'Approx pin, 8-line note, in full', bare: 'Name only: Perlan', shape: 'District: Grandi',
  plans: 'Plans: stop 1 of 3 (long name, starred)', signedout: 'Signed out (visited): Star and Visited disabled, Directions live',
  'signedout-unvisited': 'Signed out, not visited',
  stop3: 'After the swap: stop 3 open (fixture row)',
};
const V = ['rolo', 'out'];   // Stand-Up (up/) not carried after the reviews; its stills stay as history
const J = [];   // [variant, state, mode, out-name, caption]
for (const v of V) {
  J.push([v, 'busiest', 'file', 'f1', '1 The list is the file. Tap VEGA (stop 2)'],
    [v, 'busiest', 'pull1', 'f2', '2 Pulled'], [v, 'busiest', 'pull2', 'f3', '3 Nearly there'],
    [v, 'busiest', 'peek', 'busiest', LABEL.busiest],
    [v, 'busiest', 'back1', 'f4', '4 Put back'], [v, 'busiest', 'closed', 'f5', '5 Back in the file: the list as left']);
  for (const s of ['typical', 'typvis', 'approx', 'bare', 'shape', 'plans']) J.push([v, s, 'peek', s, LABEL[s]]);
  J.push([v, 'typical', 'vm1', 'v1', 'Visited moment 1: tap Mark visited'], [v, 'typical', 'vm2', 'v2', 'Visited moment 2']);
  J.push([v, 'busiest', 'signedout', 'signedout', LABEL.signedout], [v, 'typical', 'signedout', 'signedout-unvisited', LABEL['signedout-unvisited']]);
  J.push([v, 'busiest', 'swap', 'swap', 'Swap: one tap on stop 3 while VEGA is out'], [v, 'stop3', 'peek', 'stop3', LABEL.stop3]);
}
J.push(['rolo', 'busiest', 'hits', 'hits', 'The edge behind the card is a 44px target']);

async function setup(b, state) {
  const plan = PLAN_STATES.includes(state);
  const { ctx, page, errors } = await openProto(b, { dsf: 3, reduced: true, storage: plan ? { 'gh.plans': '1', 'triplet.reorderHint': '1' } : {} });
  if (plan) { await page.waitForFunction(() => typeof plans !== 'undefined' && plans.length === 1, null, { timeout: 10000 }); await page.evaluate(() => setListView('plans')); await W(600); }
  if (state === 'shape') {
    await page.evaluate(async () => { const s = window.__SHAPES.find(x => x.city === 'reykjavik' && x.type === 'district'); s.label = 'Grandi (Old Harbour creative district)'; await refetchNeighborhoodShapes(); });
    await W(300);
    await page.evaluate(() => { const s = neighborhoodShapes.find(x => x.city === 'reykjavik' && x.type === 'district'); map.setView(shapeAnchor(s), 16, { animate: false }); });
  } else {
    const [id, data, z] = DATA[state];
    // in Plans, stop 2 is always the real VEGA row
    await page.evaluate(async ([id, d, plan, vega]) => { if (plan) Object.assign(window.__ROWS.find(x => x.id === 'rey05'), vega); const r = window.__ROWS.find(x => x.id === id); Object.assign(r, d); await refetchLocations(); window.__placeId = id; }, [id, data, plan, VEGA]);
    await W(300);
    await page.evaluate(([id, z]) => { const l = locations.find(x => x.id === id); map.setView([l.lat, l.lng], z, { animate: false }); }, [id, z]);
  }
  await W(600);
  return { ctx, page, errors };
}

(async () => {
  const args = process.argv.slice(2);
  const only = args.filter(a => !a.includes('/')), names = args.filter(a => a.includes('/'));
  const want = j => (!only.length && !names.length) || only.includes(j[0]) || names.includes(j[0] + '/' + j[3]);
  const b = await launch();
  const manifest = [];
  for (const [v, state, mode, name, caption] of J) {
    manifest.push({ variant: v, name, caption });
    if (!want([v, state, mode, name])) continue;
    fs.mkdirSync(path.join(OUT, v), { recursive: true });
    const { ctx, page, errors } = await setup(b, state);
    await page.addScriptTag({ content: JS });
    let sels;
    try { sels = await page.evaluate(([c, s, m]) => K.show(c, s, m), [v, state, mode]); }
    catch (e) { console.log('FAIL', v, name, e.message); await ctx.close(); continue; }
    await page.evaluate(() => document.fonts.ready); await W(500);
    const box = await page.evaluate((sels) => {
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      for (const s of sels) for (const e of document.querySelectorAll(s)) { const r = e.getBoundingClientRect(); if (!r.width) continue;
        x0 = Math.min(x0, r.left); y0 = Math.min(y0, r.top); x1 = Math.max(x1, r.right); y1 = Math.max(y1, r.bottom); }
      return { x0, y0, x1, y1 };
    }, sels);
    const pad = 12, clip = { x: Math.max(0, box.x0 - pad), y: Math.max(0, box.y0 - pad - 30) };
    clip.width = Math.min(390, box.x1 + pad) - clip.x; clip.height = Math.min(844, box.y1 + pad) - clip.y;
    const f = n => path.join(OUT, v, `${name}-${n}`);
    await page.screenshot({ path: f('phone@3x.png') });
    await page.screenshot({ path: f('crop@3x.png'), clip });
    execFileSync('convert', [f('phone@3x.png'), '-filter', 'Box', '-resize', '390x844', f('phone@1x.png')]);
    fs.unlinkSync(f('phone@3x.png'));
    console.log(v, name, errors.length ? errors : '');
    await ctx.close();
  }
  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 1));
  await b.close();
})();
