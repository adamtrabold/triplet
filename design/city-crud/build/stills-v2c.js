// City CRUD v2c build stills (the v2b check's fixes + v13): the real index.html on the gesture harness's
// stub with real Nominatim answers (./fixtures) and real OSM tiles (cached; CC_TILES moves the cache).
// Every changed state at 390x844 @3x, 375x667 @3x and desktop 1280x800 @2x into stills/v2c/raw/, then
// the contact sheets in stills/v2c/.
//   CHROME=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome node design/city-crud/build/stills-v2c.js [frames|sheets]
const path = require('path'), fs = require('fs');
const L = require('./lib-cc.js');
const { P, W } = L;
const OUT = path.join(__dirname, 'stills', 'v2c', 'raw');
fs.mkdirSync(OUT, { recursive: true });
const TILES = process.env.CC_TILES || '/tmp/claude-0/-home-user-triplet/93db611f-01c4-59bd-abb2-1bd1be23b367/scratchpad/tiles';
fs.mkdirSync(TILES, { recursive: true });
// a roadtrip's worth of real cities (as the designer's v13 stills), so the picker is long
const EXTRA = [['philadelphia', 'Philadelphia', 39.9527, -75.1635], ['wilmington', 'Wilmington', 39.75, -75.55], ['lewes', 'Lewes', 38.77, -75.14], ['baltimore', 'Baltimore', 39.29, -76.61],
  ['annapolis', 'Annapolis', 38.98, -76.49], ['capemay', 'Cape May', 38.94, -74.91], ['newyork', 'New York', 40.71, -74.01], ['princeton', 'Princeton', 40.35, -74.66]];
const SIZES = { phone: { w: 390, h: 844, dsf: 3, pre: 'B' }, small: { w: 375, h: 667, dsf: 3, pre: 'S' }, desk: { w: 1280, h: 800, dsf: 2, pre: 'D', touch: false } };

async function open(b, sz) {
  const o = await L.open(b, { dsf: sz.dsf, w: sz.w, h: sz.h, touch: sz.touch !== false, storage: { 'gh.plans': '1', 'triplet.reorderHint': '1', 'triplet.hiddenCities': '[]' } });
  await o.page.route(/tile\.openstreetmap\.org\/\d+\/\d+\/\d+\.png/, async route => {
    const m = route.request().url().match(/\/(\d+)\/(\d+)\/(\d+)\.png/);
    const f = path.join(TILES, `${m[1]}-${m[2]}-${m[3]}.png`);
    if (!fs.existsSync(f)) {
      try { const r = await fetch(`https://tile.openstreetmap.org/${m[1]}/${m[2]}/${m[3]}.png`, { headers: { 'User-Agent': 'triplet-design-stills/1.0' } }); if (r.ok) fs.writeFileSync(f, Buffer.from(await r.arrayBuffer())); } catch (e) {}
    }
    return fs.existsSync(f) ? route.fulfill({ contentType: 'image/png', body: fs.readFileSync(f) }) : route.fallback();
  });
  await o.page.evaluate(() => { map.eachLayer(l => { if (l.redraw && l._url) l.redraw(); }); });
  await W(400);
  return o;
}
const shot = async (page, name) => { await W(800); await page.screenshot({ path: path.join(OUT, name + '.png') }); console.log('shot', name); };
async function openMenu(page, desk) {
  if (!(await page.evaluate(() => document.getElementById('titleMenu').hidden))) return;
  if (desk) await page.click('#titleBtn'); else await P.tap(page, '#titleBtn');
  await W(350);
}
// the zoomed-out view where the signposts stand (probed; a post only stands where it fits)
async function signView(page) {
  for (const z of [4, 3]) for (const lat of [56, 58, 60, 62, 64, 66, 68, 70]) for (const lng of [-8, -4, 0, 4, 8, 12]) {
    const n = await page.evaluate(([c, z]) => { map.setView(c, z, { animate: false }); updateUI(); return document.querySelectorAll('#map .sp-board').length; }, [[lat, lng], z]);
    if (n >= 4) return { c: [lat, lng], z };
  }
  return { c: [58, -2], z: 3 };
}

async function frames(b, key) {
  const sz = SIZES[key], pre = sz.pre, desk = key === 'desk';
  let o = await open(b, sz), page = o.page;
  const ev = (f, a) => page.evaluate(f, a);
  // 1. the picker takes the box (12 destinations)
  await ev(E => { E.forEach(([id, label, la, ln]) => { CITIES[id] = { label, center: [la, ln], zoom: 12, countrycodes: 'us', viewbox: `${ln - .1},${la - .1},${ln + .1},${la + .1}` }; }); setActiveCity(ALL_CITIES, { frame: false }); }, EXTRA);
  const Z = await signView(page);
  await ev(Z => map.setView(Z.c, Z.z, { animate: false }), Z); await W(1200);
  await openMenu(page, desk);
  await ev(() => rmShowPicker('stockholm')); await W(700);
  await shot(page, `${pre}1-picker`);
  // 2. the two-line slip: moved
  await ev(() => document.querySelector('#titleMenu .rm-dest[data-rm-to="copenhagen"]').click()); await W(1600);
  await signView(page); await W(1000);   // a view where the destination's post fits (a post that doesn't fit isn't drawn: phase 4)
  await shot(page, `${pre}2-slip-moved`);
  // 3. the destination's post stands after the move (Copenhagen 46 with Malmö)
  if (!desk) await shot(page, `${pre}3-post-after-move`);
  await ev(() => document.querySelector('#planSlip button').click()); await W(1400);
  // 4. the two-line slip: removed too
  await openMenu(page, desk); await ev(() => rmShowPicker('reykjavik')); await W(500);
  await ev(() => document.querySelector('#titleMenu .rm-dest.is-too').click()); await W(1500);
  await shot(page, `${pre}4-slip-removed-too`);
  await ev(() => document.querySelector('#planSlip button').click()); await W(1200);
  // 5. Find a city's results: "≈ n km" held together, the where-line wraps
  await ev(() => map.setView([40.3, -75.4], 7, { animate: false })); await W(900);
  await openMenu(page, desk);
  await ev(() => { const n = document.querySelector('#titleMenu [data-act="newcity"]'), m = document.getElementById('titleMenu'), f = m.querySelector('.menu-row[data-kind]'); n.scrollIntoView({ block: 'nearest' }); const er = n.getBoundingClientRect(), fr = f.getBoundingClientRect(); if (er.bottom > fr.top) m.scrollTop += er.bottom - fr.top; });
  await W(200); await ev(() => document.querySelector('#titleMenu [data-act="newcity"]').click()); await W(300);
  await L.findCity(page, 'titleMenu', 'Philadelphia');
  await shot(page, `${pre}5-find-results`);
  await ev(() => closeTitleMenu(false)); await W(300);
  if (!desk) {
    // 6. the empty city's note
    await ev(() => goToCity('philadelphia')); await W(2200);
    await shot(page, `${pre}6-empty-city`);
    // 7. Malmö picked, a plan open: the add-from list shows every city, Malmö's first, with the eyes
    // one category on (bars: one a city), so every city's add-from header is on screen
    await ev(() => { Object.keys(CATEGORY_COLORS).forEach(c => { filters.categories[c] = c === 'bar'; const b = document.getElementById('filter-' + c); if (b) b.classList.toggle('inactive', c !== 'bar'); }); setActiveCity('malmo', { frame: false }); choosePlan('gh-p'); }); await W(1800);
    await ev(() => { const l = document.getElementById('locationsList'), r = document.querySelector('.plan-rule'); l.scrollTop += r.getBoundingClientRect().top - l.getBoundingClientRect().top; }); await W(400);
    await shot(page, `${pre}7-plan-add-from`);
    await ev(() => { Object.keys(CATEGORY_COLORS).forEach(c => { filters.categories[c] = true; const b = document.getElementById('filter-' + c); if (b) b.classList.remove('inactive'); }); setListView('places', { frame: false }); setActiveCity(ALL_CITIES, { frame: false }); }); await W(400);
    // 8. signed out: the board reads SIGN IN and the sign does not turn
    await ev(Z => map.setView(Z.c, Z.z, { animate: false }), Z); await W(1000);
    await ev(() => { currentUser = null; }); await openMenu(page, desk);
    await ev(() => { menuSig = null; renderTitleMenu(); const r = document.querySelector('#titleMenu .menu-city[data-city="stockholm"]'), m = document.getElementById('titleMenu'), f = m.querySelector('.menu-row[data-kind]'); r.scrollIntoView({ block: 'nearest' }); const er = r.getBoundingClientRect(), fr = f.getBoundingClientRect(); if (er.bottom > fr.top) m.scrollTop += er.bottom - fr.top; rmSetOpen(r, true); }); await W(800);
    await shot(page, `${pre}8-signed-out`);
  }
  console.log(key, 'errors', o.errors);
  await page.context().close();
}

const SHEETS = [
  ['1-picker', '1 · The remove picker takes the box (build)', [
    ['B1-picker', '390 × 844', '12 destinations: the box grows up from the menu\'s bottom; the held row and the question pinned on top, Remove-too and Keep pinned at the foot.'],
    ['S1-picker', '375 × 667', 'Less room: the box stops 8px under the top controls; only the destinations scroll, with the scroll shadow.'],
    ['D1-picker', 'Desktop 1280 × 800', 'The rail: it opens down from the menu\'s top, all 12 fit.'],
  ]],
  ['2-undo-slip', '2 · The Undo slip on two lines (build)', [
    ['B2-slip-moved', 'Moved', '"Stockholm removed" (grey) / "Its places → Copenhagen" (navy, never cut).'],
    ['B4-slip-removed-too', 'Removed too', '"Reykjavík removed" / "and its 23 places".'],
    ['S2-slip-moved', 'At 375', 'The same, on the list header.'],
    ['D2-slip-moved', 'Desktop', 'The rail\'s header.'],
  ]],
  ['3-post-and-results', '3 · The post stands; Find a city\'s results (build)', [
    ['B3-post-after-move', 'After a move', 'Copenhagen (now 46) still stands with Malmö: a post that fits within a pixel shows.'],
    ['B5-find-results', 'Find a city', '"≈ 45 km away" stays together when the line wraps.'],
    ['S5-find-results', 'At 375', 'The same.'],
    ['D5-find-results', 'Desktop', 'The same.'],
  ]],
  ['4-plan-empty-signed-out', '4 · A plan\'s add-from list, the empty city, signed out (build)', [
    ['B7-plan-add-from', 'A plan open, Malmö picked', 'The add-from list shows every city, Malmö\'s section first, each with its eye (UX ruling J8).'],
    ['B6-empty-city', 'An empty city', '"Nothing here yet · tap + to add a place".'],
    ['B8-signed-out', 'Signed out', 'The board reads SIGN IN; the map sign does not turn to SEE YOU SOON?.'],
    ['S7-plan-add-from', 'At 375', 'The add-from list.'],
    ['S6-empty-city', 'At 375', 'The empty city.'],
    ['S8-signed-out', 'At 375', 'Signed out.'],
  ]],
];
async function sheets(b) {
  const FW = 340;
  const ctx = await b.newContext({ deviceScaleFactor: 3, viewport: { width: 800, height: 600 } });
  const page = await ctx.newPage();
  for (const [file, title, fr] of SHEETS) {
    if (!fr.every(([f]) => fs.existsSync(path.join(OUT, f + '.png')))) { console.log('skip sheet', file); continue; }
    const cells = fr.map(([f, h, c]) => { const wide = f.startsWith('D'); return `<figure style="width:${wide ? 2 * FW + 20 : FW}px"><img style="width:100%" src="data:image/png;base64,${fs.readFileSync(path.join(OUT, f + '.png')).toString('base64')}"><figcaption><b>${h}</b><span>${c}</span></figcaption></figure>`; }).join('');
    const w = 3 * FW + 4 * 20;
    await page.setViewportSize({ width: w, height: 600 });
    await page.setContent(`<!doctype html><html><head><style>
      body { margin: 0; padding: 20px; background: #F2EBDD; font-family: -apple-system, 'Segoe UI', Roboto, sans-serif; color: #12293F; width: ${w - 40}px; }
      h1 { font-size: 22px; line-height: 28px; margin: 0 0 16px; }
      .row { display: flex; flex-wrap: wrap; gap: 20px; align-items: flex-start; }
      figure { margin: 0; }
      img { display: block; border: 1px solid #D8CEBA; border-radius: 6px; }
      figcaption { margin-top: 10px; font-size: 16px; line-height: 21px; color: #3a3a36; }
      figcaption b { display: block; font-size: 18px; line-height: 23px; color: #12293F; margin-bottom: 2px; }
    </style></head><body><h1>${title}</h1><div class="row">${cells}</div></body></html>`);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(__dirname, 'stills', 'v2c', file + '.png'), fullPage: true });
    console.log('sheet', file);
  }
  await ctx.close();
}
(async () => {
  const only = process.argv[2] || '';
  const b = await P.lib.launch();
  if (only !== 'sheets') for (const k of Object.keys(SIZES)) await frames(b, k);
  if (only !== 'frames') await sheets(b);
  await b.close();
})();
