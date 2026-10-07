// Shape pins (round 6) renders: the REAL app (index.html, unmodified) in the gesture harness with a
// Reykjavík scene of extra pins, three districts and two streets; round 3's helpers (K2), round 5's
// Hanging Tag (tag3.js, unchanged but for the type word of a street), then pins.js draws the shape pins.
//   node design/popup-hierarchy/round6/shape-pin/render.js [name ...]
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process');
const { launch, openProto, W } = require('../../../gesture-harness/lib');
const OUT = __dirname, R3 = path.join(__dirname, '../../round3'), R5 = path.join(__dirname, '../../round5/tag');
const BASE = fs.readFileSync(path.join(__dirname, '../../round1/concepts.js'), 'utf8').match(/  function basemap\(\) \{[\s\S]*?\n  \}\n/)[0];
const HELPERS = fs.readFileSync(path.join(R3, 'concepts.js'), 'utf8').replace('/*BASEMAP*/', () => BASE)
  .replace('  window.K = {', '  window.K2 = { esc, ic, rowStamp, seal, typeWord, meta, dirBtn, starBtn, acts0: acts, addr1, select, pinScreen, movePinTo, anno, tapAt, bg, SHADOW, growMap, basemap, place };\n  window.K = {');
const TAG = fs.readFileSync(path.join(R5, 'tag3.js'), 'utf8').replace("P.shape ? 'District'", "P.shape ? (P.shape.type === 'street' ? 'Street' : 'District')");
if (TAG.indexOf("P.shape.type === 'street'") < 0) throw new Error('tag3 type patch failed');
const PINS = fs.readFileSync(path.join(__dirname, 'pins.js'), 'utf8');

// Reykjavík scene (offsets from the fixture's city centre 64.1466, -21.9426)
const SCENE = {
  shapes: [
    { label: 'Miðborg', type: 'district', note: 'Old town core: Laugavegur, Ingólfstorg, the harbour end of Lækjargata. Walk it end to end on day one.', g: [[0.0036, -0.0078], [0.0044, -0.0016], [0.0006, 0.0006], [-0.0020, -0.0022], [-0.0014, -0.0070]] },
    { label: 'Grandi (Old Harbour creative district)', type: 'district', note: 'Converted fish factories: Omnom chocolate, Marshall House galleries, the Grandi food hall.', g: [[0.0046, 0.0016], [0.0062, 0.0062], [0.0034, 0.0080], [0.0020, 0.0034]] },
    { label: 'Hlemmur', type: 'district', note: null, g: [[-0.0030, 0.0030], [-0.0021, 0.0078], [-0.0056, 0.0074], [-0.0062, 0.0036]] },
    { label: 'Laugavegur', type: 'street', note: 'The main shopping street; best walked downhill from Hlemmur in the late afternoon.', g: [[-0.0004, -0.0072], [-0.0011, -0.0030], [-0.0017, 0.0012], [-0.0026, 0.0066]] },
    { label: 'Skólavörðustígur', type: 'street', note: 'Rainbow street up to Hallgrímskirkja.', g: [[-0.0040, -0.0062], [-0.0054, -0.0014]] },
  ],
  pins: [
    ['Mokka Kaffi', 'cafe', 0.0019, -0.0049], ['Prikið', 'bar', -0.0004, -0.0046], ['Hafnarhús', 'attraction', 0.0030, -0.0026],
    ['Matur og Drykkur', 'restaurant', 0.0024, -0.0062], ['Kiosk', 'shopping', 0.0040, -0.0041], ['Einar Jónsson Museum', 'attraction', -0.0060, -0.0040],
    ['Omnom', 'shopping', 0.0050, 0.0050], ['Bryggjan', 'restaurant', 0.0041, 0.0028], ['Skál!', 'restaurant', -0.0034, 0.0052],
    ['Kaffitár', 'cafe', -0.0046, -0.0026], ['Bus stop 4', 'other', -0.0012, 0.0062], ['Hotel Holt', 'hotel', -0.0026, -0.0006],
  ],
};
const C0 = [64.1466, -21.9426], K = 1.6;   // the scene is drawn at 1.6x these offsets

// [name, variant, scene, caption]
const VARS = ['blaze', 'tie', 'pennant'];
const SCENES = {
  'busy-z14': 'Busy map at zoom 14 (where Reykjavík\'s shapes first draw)',
  'busy-z16': 'Busy map at zoom 16',
  district: 'District open: its tag hangs from the pin',
  street: 'Street open: its tag hangs from the pin',
  states: 'States: unvisited, starred, visited, visited + starred, open; plan stop',
  visited: 'In context: visited and starred shapes among visited pins',
  plan: 'Plans: a district and a street as stops 2 and 4',
};
const J = [];
for (const v of VARS) for (const [s, c] of Object.entries(SCENES)) J.push([`${v}-${s}`, v, s, c]);

async function setup(b, scene) {
  const plan = scene === 'plan';
  const { ctx, page, errors } = await openProto(b, { dsf: 3, reduced: true, storage: plan ? { 'gh.plans': '1', 'triplet.reorderHint': '1' } : {} });
  await page.evaluate(async ([S, C0, scene, K]) => {
    let sid = 900;
    const keep = window.__SHAPES.filter(s => s.city !== 'reykjavik');
    const mine = S.shapes.map((s, i) => ({ id: sid + i, city: 'reykjavik', type: s.type, label: s.label, color: null, note: s.note, min_zoom: null,
      visited: scene === 'visited' ? [true, false, false, false, true][i] : (scene.startsWith('busy') ? i === 2 : false),
      starred: scene === 'visited' ? [false, true, false, true, true][i] : (scene.startsWith('busy') ? i === 3 : false),
      geometry: s.g.map(([a, b]) => [C0[0] + a * K, C0[1] + b * K]) }));
    window.__SHAPES.length = 0; keep.concat(mine).forEach(s => window.__SHAPES.push(s));
    S.pins.forEach(([name, category, a, b], i) => window.__ROWS.push({ id: 'rx' + String(i).padStart(2, '0'), name, address: `${i + 3} Gata, reykjavik`, category,
      lat: C0[0] + a * K, lng: C0[1] + b * K, notes: null, visited: scene === 'visited' ? i % 3 === 0 : i === 4, starred: i === 1 || (scene === 'visited' && i === 6), city: 'reykjavik',
      created_at: new Date(Date.UTC(2026, 8, 2, 0, i)).toISOString() }));
    if (scene === 'plan') {
      window.__PT.plan_stops = [['rx00', null], [null, 900], ['rx02', null], [null, 903], ['rx05', null]].map(([l, s], i) => ({ id: 'gs' + i, plan_id: 'gh-p', location_id: l, shape_id: s, position: i + 1 }));
    }
    await refetchLocations(); await refetchNeighborhoodShapes();
    if (scene === 'plan') { await refetchPlans(); setListView('plans'); }
  }, [SCENE, C0, scene, K]);
  await W(700);
  return { ctx, page, errors };
}

(async () => {
  const only = process.argv.slice(2);
  const b = await launch();
  fs.mkdirSync(path.join(OUT, 'stills'), { recursive: true }); fs.mkdirSync(path.join(OUT, '_sheet'), { recursive: true });
  for (const [name, variant, scene, caption] of J) {
    if (only.length && !only.some(o => name === o || name.startsWith(o + '-') || name.endsWith('-' + o))) continue;
    const { ctx, page, errors } = await setup(b, scene);
    await page.addScriptTag({ content: HELPERS }); await page.addScriptTag({ content: TAG }); await page.addScriptTag({ content: PINS });
    let sels;
    try {
      sels = await page.evaluate(async ([variant, scene, C0]) => {
        K.css(); SP.css(); K2.basemap(); SP.quietShipped();
        const nbBy = l => neighborhoodShapes.find(n => n.label.startsWith(l));
        const wait = ms => new Promise(r => setTimeout(r, ms));
        if (scene.startsWith('busy') || scene === 'visited' || scene === 'states') {
          const z = scene === 'busy-z14' ? 14 : scene === 'busy-z16' ? 16 : 15;
          const c = scene === 'busy-z16' ? [C0[0] + 0.0008, C0[1] - 0.0040] : [C0[0] - 0.0006, C0[1]];
          map.setView(c, z, { animate: false }); await wait(400);
          SP.sync(variant);
          if (scene === 'states') return SP.board(variant);
          return ['#map'];
        }
        if (scene === 'plan') {
          const pts = planMarks().rows.map(r => r.loc ? [r.loc.lat, r.loc.lng] : shapeAnchor(r.nb));
          map.fitBounds(pts, { padding: [40, 40], animate: false }); if (map.getZoom() > 15) map.setZoom(15, { animate: false }); await wait(400);
          SP.sync(variant); return ['#map'];
        }
        // district / street open: round 5's tag (claim check), hung from the new pin
        const nb = scene === 'district' ? nbBy('Grandi') : nbBy('Laugavegur');
        map.setView(shapeAnchor(nb), 16, { animate: false }); await wait(300);
        const P = { ...shapeRowItem(nb), shape: nb, ink: nb.color || categoryInk(nb.type), kind: 'diamond', stop: planStopLine('shape', nb.id), category: nb.type };
        const sels = TAG3(P, { variant: 'claim' });
        await wait(200);
        document.querySelectorAll('.W-knot').forEach(e => e.remove());
        const layers = document.querySelectorAll('.k-layer'); layers[layers.length - 1].remove();
        SP.sync(variant, { sel: nb.id }); await wait(100);
        const t = SP.tiePoint(nb.id), tag = document.querySelector('.W').getBoundingClientRect();
        const str = document.createElement('div'); str.className = 'k-layer'; Object.assign(str.style, { left: 0, top: 0, width: '390px', height: '844px', zIndex: 1101, position: 'absolute', pointerEvents: 'none' });
        str.innerHTML = `<svg width="390" height="844"><line x1="${t.x}" y1="${t.y}" x2="${t.x}" y2="${tag.top + 10}" stroke="#7A6A55" stroke-width="1.5" stroke-linecap="round"/></svg>`;
        document.body.appendChild(str);
        // the pin rides above the string (the leaflet marker pane sits under the tag layers)
        const pin = SP.pins.get(nb.id)._icon, r = pin.getBoundingClientRect(), cp = document.createElement('div');
        cp.innerHTML = pin.innerHTML; Object.assign(cp.style, { position: 'absolute', left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', zIndex: 1104, lineHeight: 0 });
        cp.className = 'sp-pincopy'; document.body.appendChild(cp);
        return sels.concat(['.sp-pincopy']);
      }, [variant, scene, C0]);
    } catch (e) { console.log('FAIL', name, e.message); await ctx.close(); continue; }
    await page.evaluate(() => document.fonts.ready); await W(500);
    const f = n => path.join(OUT, 'stills', `${name}-${n}`);
    await page.screenshot({ path: f('phone@3x.png') });
    // crop: the open tag's top + pin; the board; or a fixed window on the map's middle
    let clip;
    if (scene === 'district' || scene === 'street') {
      const bx = await page.evaluate(() => { const p = document.querySelector('.sp-pincopy').getBoundingClientRect(), t = document.querySelector('.W').getBoundingClientRect(); return { y0: p.top, y1: t.top + 150 }; });
      clip = { x: 30, y: Math.max(0, bx.y0 - 40), width: 330, height: 0 }; clip.height = Math.min(844, bx.y1) - clip.y;
    } else if (scene === 'states') {
      const r = await page.evaluate(() => { const e = document.querySelector('.sp-board').getBoundingClientRect(); return { x: e.left, y: e.top, w: e.width, h: e.height }; });
      clip = { x: Math.max(0, r.x - 6), y: Math.max(0, r.y - 6), width: Math.min(390, r.w + 12), height: r.h + 12 };
    } else clip = { x: 45, y: 230, width: 300, height: 300 };
    await page.screenshot({ path: f('crop@3x.png'), clip });
    execFileSync('convert', [f('phone@3x.png'), '-filter', 'Box', '-resize', '390x844', f('phone@1x.png')]);
    execFileSync('convert', [f('phone@3x.png'), '-resize', '780x1688', '-quality', '72', path.join(OUT, '_sheet', `${name}-phone.jpg`)]);
    execFileSync('convert', [f('crop@3x.png'), '-resize', '1000x>', '-quality', '76', path.join(OUT, '_sheet', `${name}-crop.jpg`)]);
    fs.unlinkSync(f('phone@3x.png'));
    console.log(name, errors.length ? errors : '');
    await ctx.close();
  }
  fs.writeFileSync(path.join(OUT, '_sheet', 'captions.json'), JSON.stringify(J.map(j => [j[0], j[3]]), null, 1));
  await b.close();
})();
