// Round 1 concept renders. Loads the REAL app (index.html, unmodified) in the
// gesture harness (stub Supabase, vendored Leaflet/Archivo), patches real
// rows' text into fixture rows exactly as ../render.js does, then injects
// concepts.js and draws one concept. Tiles are blocked in the sandbox, so
// concepts.js paints a stand-in basemap under the markers (same re-tone filter).
//   node design/popup-hierarchy/round1/render.js [concept ...]
// Writes <concept>/<state>-phone@3x.png, -phone@1x.png (IM downscale),
// -crop@3x.png, and JPEGs for the contact sheet into ./_sheet/.
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process');
const { launch, openProto, W } = require('../../gesture-harness/lib');
const OUT = __dirname;
const CONCEPT_JS = fs.readFileSync(path.join(__dirname, 'concepts.js'), 'utf8');

const VEGA = { name: 'VEGA Copenhagen', category: 'bar',
  address: 'Vega, Rejsbygade, Humleby, Den Gule By, Vesterbro, Copenhagen, Copenhagen Municipality, Capital Region of Denmark, 1674, Denmark',
  notes: "Store VEGA, Lille VEGA, Ideal Bar — the city's premier venue. Sat Sept 26: María José Llergo (Lille VEGA), Lake Street Dive w/ Røverdatter (Store VEGA, waitlisted), KARLA w/ Asger Falgren (Ideal Bar).",
  starred: true, visited: true };
const BARE = { name: 'Perlan', category: 'attraction', address: null, notes: null, starred: false, visited: false };

const CONCEPTS = {
  quiet: ['busiest', 'bare', 'shape'],
  fold: ['busiest', 'busiest-x', 'bare', 'shape'],
  sheet: ['busiest', 'busiest-x', 'bare', 'shape'],
  row: ['busiest', 'bare', 'shape'],
  tab: ['busiest', 'busiest-x', 'bare', 'shape'],
  dock: ['busiest', 'busiest-x', 'bare', 'shape'],
  rail: ['busiest', 'busiest-x', 'bare', 'shape'],
  lug: ['busiest', 'bare', 'shape'],
};

async function setup(b, state, dsf) {
  const base = state.replace(/-x$/, '');
  const plan = base === 'busiest';
  const { ctx, page, errors } = await openProto(b, { dsf, reduced: true, storage: plan ? { 'gh.plans': '1', 'triplet.reorderHint': '1' } : {} });
  if (plan) { await page.waitForFunction(() => typeof plans !== 'undefined' && plans.length === 1, null, { timeout: 10000 }); await page.evaluate(() => setListView('plans')); await W(600); }
  if (base === 'shape') {
    await page.evaluate(async () => { const s = window.__SHAPES.find(x => x.city === 'reykjavik' && x.type === 'district'); s.label = 'Grandi (Old Harbour creative district)'; await refetchNeighborhoodShapes(); });
    await W(300);
    await page.evaluate(() => { const s = neighborhoodShapes.find(x => x.city === 'reykjavik' && x.type === 'district'); const a = shapeAnchor(s); map.setView(a, 16, { animate: false }); });
  } else {
    const [id, data, z] = plan ? ['rey05', VEGA, 15] : ['rey13', BARE, 16];
    await page.evaluate(async ([id, d]) => { const r = window.__ROWS.find(x => x.id === id); Object.assign(r, d); await refetchLocations(); window.__placeId = id; }, [id, data]);
    await W(300);
    await page.evaluate(([id, z]) => { const l = locations.find(x => x.id === id); map.setView([l.lat, l.lng], z, { animate: false }); }, [id, z]);
  }
  await W(600);
  return { ctx, page, errors };
}

const sh = (args) => execFileSync('convert', args);

(async () => {
  const only = process.argv.slice(2);
  const b = await launch();
  fs.mkdirSync(path.join(OUT, '_sheet'), { recursive: true });
  for (const [concept, states] of Object.entries(CONCEPTS)) {
    if (only.length && !only.includes(concept)) continue;
    fs.mkdirSync(path.join(OUT, concept), { recursive: true });
    for (const state of states) {
      const { ctx, page, errors } = await setup(b, state, 3);
      await page.addScriptTag({ content: CONCEPT_JS });
      let sel;
      try { sel = await page.evaluate(([c, s]) => K.show(c, s), [concept, state]); }
      catch (e) { console.log('FAIL', concept, state, e.message); await ctx.close(); continue; }
      await page.evaluate(() => document.fonts.ready); await W(500);
      const sels = Array.isArray(sel) ? sel : [sel];
      const box = await page.evaluate((sels) => {
        let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
        for (const s of sels) for (const e of document.querySelectorAll(s)) { const r = e.getBoundingClientRect(); if (!r.width) continue;
          x0 = Math.min(x0, r.left); y0 = Math.min(y0, r.top); x1 = Math.max(x1, r.right); y1 = Math.max(y1, r.bottom); }
        return { x0, y0, x1, y1 };
      }, sels);
      const pad = 12;
      const clip = { x: Math.max(0, box.x0 - pad), y: Math.max(0, box.y0 - pad) };
      clip.width = Math.min(390, box.x1 + pad) - clip.x; clip.height = Math.min(844, box.y1 + pad + (sels[0] === '.leaflet-popup' ? 30 : 0)) - clip.y;
      const f = (n) => path.join(OUT, concept, `${state}-${n}`);
      await page.screenshot({ path: f('phone@3x.png') });
      await page.screenshot({ path: f('crop@3x.png'), clip });
      sh([f('phone@3x.png'), '-filter', 'Box', '-resize', '390x844', f('phone@1x.png')]);
      sh([f('phone@3x.png'), '-resize', '780x1688', '-quality', '78', path.join(OUT, '_sheet', `${concept}-${state}-phone.jpg`)]);
      sh([f('crop@3x.png'), '-quality', '80', path.join(OUT, '_sheet', `${concept}-${state}-crop.jpg`)]);
      fs.unlinkSync(f('phone@3x.png'));
      console.log(concept, state, JSON.stringify(clip), errors.length ? errors : '');
      await ctx.close();
    }
  }
  await b.close();
})();
