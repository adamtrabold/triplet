// Round 3 concept renders: the REAL app (index.html, unmodified) in the gesture harness, real rows' text patched
// into fixture rows (as ../render.js), then concepts.js draws one concept. Stand-in basemap from round 1.
//   node design/popup-hierarchy/round3/render.js [concept ...]
// Writes <concept>/<name>-phone@1x.png (box-downscaled from 3x), <name>-crop@3x.png, and JPEGs into _sheet/.
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process');
const { launch, openProto, W } = require('../../gesture-harness/lib');
const OUT = __dirname;
const JS = fs.readFileSync(path.join(__dirname, 'concepts.js'), 'utf8')
  .replace('/*BASEMAP*/', () => fs.readFileSync(path.join(__dirname, '../round1/concepts.js'), 'utf8').match(/  function basemap\(\) \{[\s\S]*?\n  \}\n/)[0]);

// Real rows (read-only from Supabase, 2026-10-05), as in ../render.js and round 2.
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
  bare: ['rey13', { name: 'Perlan', category: 'attraction', address: null, notes: null, starred: false, visited: false }, 16],
};
const STATES = ['busiest', 'typical', 'approx', 'bare', 'shape'];
const LABEL = { busiest: 'Busiest: VEGA', typical: 'Typical note: Aurora', approx: 'Approx pin, 8-line note', longname: 'Long name', bare: 'Bare: Perlan (name only)', shape: 'District: Grandi' };

// [concept, state, mode, out-name, caption]
const J = [];
const dense = c => STATES.forEach(s => J.push([c, s, 'peek', s, LABEL[s]]));
const so = c => J.push([c, 'busiest', 'signedout', 'signedout', 'Signed out: Star and Visited disabled, Directions live']);
dense('label'); J.push(['label', 'longname', 'peek', 'longname', LABEL.longname]);
J.push(['label', 'busiest', 'f1', 'f1', '1 Tap the pin'], ['label', 'busiest', 'f2', 'f2', '2 The label rises; the pin’s seal lifts off'], ['label', 'busiest', 'f3', 'f3', '3 The seal lands as the label’s emblem'], ['label', 'busiest', 'closed', 'f4', '4 × : the list comes back as left']); so('label');
dense('tag'); J.push(['tag', 'approx', 'back', 'approx-back', 'Approx, turned over: the whole note']);
J.push(['tag', 'typical', 'f1', 'f1', '1 Tap the pin'], ['tag', 'typical', 'f2', 'f2', '2 The tag drops and swings'], ['tag', 'typical', 'f3', 'f3', '3 Swings back'], ['tag', 'typical', 'peek', 'f4', '4 Settled; now it takes taps'], ['tag', 'approx', 'f-flip', 'f5', 'Turn over: the tag turns on its string']); so('tag');
dense('file');
J.push(['file', 'busiest', 'f1', 'f1', '1 Plans list, tap VEGA (stop 2)'], ['file', 'busiest', 'f2', 'f2', '2 Its card is pulled up out of the file'], ['file', 'busiest', 'f3', 'f3', '3 It stands in its own slot'], ['file', 'busiest', 'closed', 'f4', '4 Put back: the list as left']);
dense('stamp');
J.push(['stamp', 'typical', 'f1', 'f1', '1 Not visited: a ghost frame. Tap Mark Visited'], ['stamp', 'typical', 'f2', 'f2', '2 The stamp comes down'], ['stamp', 'typical', 'f3', 'f3', '3 Lands, ink bleeds in'], ['stamp', 'typical', 'f4', 'f4', '4 Settled']); so('stamp');
dense('post'); J.push(['post', 'longname', 'peek', 'longname', LABEL.longname]);
J.push(['post', 'busiest', 'f1', 'f1', '1 Tap the pin'], ['post', 'busiest', 'f2', 'f2', '2 The pin’s seal flies to the stamp corner'], ['post', 'typical', 'f3', 'f3', '3 Mark Visited: the postmark is struck']); so('post');
// Pinned Note (the pin as the pushpin of a note scrap) was drafted and cut: see README.

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
  const args = process.argv.slice(2);
  const only = args.filter(a => !a.includes('/'));
  const names = args.filter(a => a.includes('/'));   // concept/name to render a single still
  const b = await launch();
  fs.mkdirSync(path.join(OUT, '_sheet'), { recursive: true });
  const mf = path.join(OUT, '_sheet', 'manifest.json');
  let manifest = fs.existsSync(mf) ? JSON.parse(fs.readFileSync(mf, 'utf8')) : [];
  const want = j => (!only.length && !names.length) || only.includes(j[0]) || names.includes(j[0] + '/' + j[3]);
  manifest = manifest.filter(m => !J.some(j => want(j) && j[0] === m.concept && j[3] === m.name));
  for (const [concept, state, mode, name, caption] of J) {
    if (!want([concept, state, mode, name])) continue;
    fs.mkdirSync(path.join(OUT, concept), { recursive: true });
    const { ctx, page, errors } = await setup(b, state);
    await page.addScriptTag({ content: JS });
    await page.evaluate(n => { window.__anno = /^f\d/.test(n); window.__frameName = /^f\d/.test(n) ? n : ''; }, name);
    let sels;
    try { sels = await page.evaluate(([c, s, m]) => m === 'closed' ? K.closed(c, s) : K.show(c, s, m), [concept, state, mode]); }
    catch (e) { console.log('FAIL', concept, name, e.message); await ctx.close(); continue; }
    await page.evaluate(() => document.fonts.ready); await W(500);
    const box = await page.evaluate((sels) => {
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      for (const s of sels) for (const e of document.querySelectorAll(s)) { const r = e.getBoundingClientRect(); if (!r.width) continue;
        x0 = Math.min(x0, r.left); y0 = Math.min(y0, r.top); x1 = Math.max(x1, r.right); y1 = Math.max(y1, r.bottom); }
      return { x0, y0, x1, y1 };
    }, sels);
    const pad = 16, clip = { x: Math.max(0, box.x0 - pad), y: Math.max(0, box.y0 - pad) };
    clip.width = Math.min(390, box.x1 + pad) - clip.x; clip.height = Math.min(844, box.y1 + pad + (sels[0] === '.leaflet-popup' ? 30 : 0)) - clip.y;
    const f = n => path.join(OUT, concept, `${name}-${n}`);
    await page.screenshot({ path: f('phone@3x.png') });
    await page.screenshot({ path: f('crop@3x.png'), clip });
    execFileSync('convert', [f('phone@3x.png'), '-filter', 'Box', '-resize', '390x844', f('phone@1x.png')]);
    execFileSync('convert', [f('phone@3x.png'), '-resize', '780x1688', '-quality', '72', path.join(OUT, '_sheet', `${concept}-${name}-phone.jpg`)]);
    execFileSync('convert', [f('crop@3x.png'), '-resize', '1000x>', '-quality', '76', path.join(OUT, '_sheet', `${concept}-${name}-crop.jpg`)]);
    fs.unlinkSync(f('phone@3x.png'));
    manifest.push({ concept, name, caption });
    console.log(concept, name, JSON.stringify(clip), errors.length ? errors : '');
    await ctx.close();
  }
  const order = J.map(j => j[0] + '/' + j[3]);
  manifest.sort((a, b) => order.indexOf(a.concept + '/' + a.name) - order.indexOf(b.concept + '/' + b.name));
  fs.writeFileSync(mf, JSON.stringify(manifest, null, 1));
  await b.close();
})();
