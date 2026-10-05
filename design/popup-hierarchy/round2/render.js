// Round 2 concept renders: the REAL app (index.html, unmodified) in the gesture
// harness, real rows' text patched into fixture rows (as ../render.js), then
// concepts.js draws one concept. Stand-in basemap from round 1 (tiles blocked).
//   node design/popup-hierarchy/round2/render.js [concept ...]
// Writes <concept>/<name>-phone@1x.png (box-downscaled from 3x), <name>-crop@3x.png,
// and JPEGs for the contact sheet into _sheet/.
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process');
const { launch, openProto, W } = require('../../gesture-harness/lib');
const OUT = __dirname;
const JS = fs.readFileSync(path.join(__dirname, 'concepts.js'), 'utf8')
  .replace('/*BASEMAP*/', () => fs.readFileSync(path.join(__dirname, '../round1/concepts.js'), 'utf8').match(/  function basemap\(\) \{[\s\S]*?\n  \}\n/)[0]);

// Real rows (read-only from Supabase, 2026-10-05), as in ../render.js; ADDRONLY queried for round 2.
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
  longname: ['rey09', { name: 'Swedish Museum of Performing Arts Scenkonstmuseet', category: 'attraction',
    address: '2, Sibyllegatan, Östermalm, Norra innerstadens stadsdelsområde, Stockholm, Stockholm Municipality, Stockholm County, 102 41, Sweden',
    notes: 'Instrument history, hands-on, kid-friendly.', starred: true, visited: false }, 16],
  addronly: ['rey11', { name: 'Reykjavík Maritime Museum', category: 'attraction',
    address: 'Reykjavík Maritime Museum, 8, Grandagarður, Grandi, Vesturhöfn, Vesturbær, Reykjavik, Capital Region, 101, Iceland', notes: null, starred: false, visited: false }, 16],
  bare: ['rey13', { name: 'Perlan', category: 'attraction', address: null, notes: null, starred: false, visited: false }, 16],
};
const STATES = ['busiest', 'typical', 'approx', 'longname', 'addronly', 'bare', 'shape'];
const LABEL = { busiest: 'Busiest: VEGA', typical: 'Typical: Aurora (3-line note)', approx: 'Approx pin, 8-line note', longname: '2-line name', addronly: 'Address, no note', bare: 'Bare: Perlan', shape: 'District' };

// [concept, state, kind, mode, out-name, caption]; kind 'show' | 'frame'
const J = [];
const dense = c => STATES.forEach(s => J.push([c, s, 'show', 'peek', s, LABEL[s]]));
// A Fold
dense('fold');
J.push(['fold', 'busiest', 'show', 'open', 'busiest-open', 'Busiest, unfolded'], ['fold', 'approx', 'show', 'open', 'approx-open', 'Approx, unfolded (scrolls inside)'],
  ['fold', 'busiest', 'show', 'peek', 'f1-peek', '1 Peek'], ['fold', 'busiest', 'show', 'mid', 'f2-mid', '2 Unfolding'], ['fold', 'busiest', 'show', 'open', 'f3-open', '3 Open'],
  ['fold', 'busiest', 'show', 'high', 'f4-high', '4 Pin high on the map: caps, scrolls']);
// B Sheet
dense('sheet');
J.push(['sheet', 'busiest', 'frame', 'list-row', 'f1-list', '1 Plans list, tap VEGA'], ['sheet', 'busiest', 'show', 'peek', 'f2-open', '2 Map flies, sheet opens'],
  ['sheet', 'approx', 'show', 'scrolled', 'f3-read', '3 A long note scrolls inside; the buttons stay'], ['sheet', 'busiest', 'frame', 'closed', 'f4-closed', '4 × : the list as left'],
  ['sheet', 'busiest', 'show', 'signedout', 'signedout', 'Owner question: signed-out viewer sees Get Directions only'],
  ['sheet', 'busiest', 'show', 'directions', 'copy-directions', 'Owner question: “Directions” instead of “Get Directions”']);
// C Dock
dense('dock');
J.push(['dock', 'busiest', 'show', 'open', 'busiest-open', 'Busiest, raised'], ['dock', 'approx', 'show', 'open', 'approx-open', 'Approx, raised (scrolls inside)']);
// D Pinned
dense('pin');
J.push(['pin', 'busiest', 'frame', 'list-pin', 'f1-list', '1 Plans list, tap the pin'], ['pin', 'busiest', 'show', 'peek', 'f2-pinned', '2 Row lifts into the card'],
  ['pin', 'busiest', 'show', 'open', 'f3-open', '3 More: the card takes the sheet'], ['pin', 'busiest', 'frame', 'closed', 'f4-closed', '4 × : the row drops back']);

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
  fs.mkdirSync(path.join(OUT, '_sheet'), { recursive: true });
  const manifest = [];
  for (const [concept, state, kind, mode, name, caption] of J) {
    if (only.length && !only.includes(concept)) continue;
    fs.mkdirSync(path.join(OUT, concept), { recursive: true });
    const { ctx, page, errors } = await setup(b, state);
    await page.addScriptTag({ content: JS });
    await page.evaluate(n => { window.__anno = /^f\d/.test(n); }, name);
    let sels;
    try { sels = await page.evaluate(([c, s, k, m]) => k === 'show' ? K.show(c, s, m) : K.frame(c, s, m), [concept, state, kind, mode]); }
    catch (e) { console.log('FAIL', concept, name, e.message); await ctx.close(); continue; }
    await page.evaluate(() => document.fonts.ready); await W(500);
    const chk = await page.evaluate(() => [...document.querySelectorAll('.k-acts')].map(a => a.scrollWidth > a.clientWidth + 1 ? 'OVERFLOW' : 'ok').join(','));
    const box = await page.evaluate((sels) => {
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      for (const s of sels) for (const e of document.querySelectorAll(s)) { const r = e.getBoundingClientRect(); if (!r.width) continue;
        x0 = Math.min(x0, r.left); y0 = Math.min(y0, r.top); x1 = Math.max(x1, r.right); y1 = Math.max(y1, r.bottom); }
      return { x0, y0, x1, y1 };
    }, sels);
    const pad = 12, clip = { x: Math.max(0, box.x0 - pad), y: Math.max(0, box.y0 - pad) };
    clip.width = Math.min(390, box.x1 + pad) - clip.x; clip.height = Math.min(844, box.y1 + pad + (sels[0] === '.leaflet-popup' ? 30 : 0)) - clip.y;
    const f = n => path.join(OUT, concept, `${name}-${n}`);
    await page.screenshot({ path: f('phone@3x.png') });
    await page.screenshot({ path: f('crop@3x.png'), clip });
    execFileSync('convert', [f('phone@3x.png'), '-filter', 'Box', '-resize', '390x844', f('phone@1x.png')]);
    execFileSync('convert', [f('phone@3x.png'), '-resize', '780x1688', '-quality', '74', path.join(OUT, '_sheet', `${concept}-${name}-phone.jpg`)]);
    execFileSync('convert', [f('crop@3x.png'), '-quality', '78', path.join(OUT, '_sheet', `${concept}-${name}-crop.jpg`)]);
    fs.unlinkSync(f('phone@3x.png'));
    manifest.push({ concept, name, caption });
    console.log(concept, name, chk, JSON.stringify(clip), errors.length ? errors : '');
    await ctx.close();
  }
  if (!only.length) fs.writeFileSync(path.join(OUT, '_sheet', 'manifest.json'), JSON.stringify(manifest, null, 1));
  await b.close();
})();
