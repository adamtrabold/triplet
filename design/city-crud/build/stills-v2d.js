// City CRUD v2d build stills (v14 + the owner's rulings on the type, the tally and the bounce): the real
// index.html on the gesture harness's stub with real Nominatim answers (./fixtures) and real OSM tiles.
// The picker at 390x844 @3x, 375x667 @3x and desktop 1280x800 @2x, typing a new city, the commit's
// slip, an empty city's remove, and the title menu's 11px tally with a long name at 375.
//   CHROME=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome node design/city-crud/build/stills-v2d.js [frames|sheets]
const path = require('path'), fs = require('fs');
const L = require('./lib-cc.js');
const { P, W } = L;
const OUT = path.join(__dirname, 'stills', 'v2d', 'raw');
fs.mkdirSync(OUT, { recursive: true });
const TILES = process.env.CC_TILES || '/tmp/claude-0/-home-user-triplet/93db611f-01c4-59bd-abb2-1bd1be23b367/scratchpad/tiles';
fs.mkdirSync(TILES, { recursive: true });
const EXTRA = [['wilmington', 'Wilmington', 39.75, -75.55], ['lewes', 'Lewes', 38.77, -75.14], ['baltimore', 'Baltimore', 39.29, -76.61],
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
async function signView(page) {
  for (const z of [4, 3]) for (const lat of [56, 58, 60, 62, 64, 66, 68, 70]) for (const lng of [-8, -4, 0, 4, 8, 12]) {
    const n = await page.evaluate(([c, z]) => { map.setView(c, z, { animate: false }); updateUI(); return document.querySelectorAll('#map .sp-board').length; }, [[lat, lng], z]);
    if (n >= 4) return { c: [lat, lng], z };
  }
  return { c: [58, -2], z: 3 };
}

async function frames(b, key) {
  const sz = SIZES[key], pre = sz.pre, desk = key === 'desk';
  const o = await open(b, sz), page = o.page, ev = (f, a) => page.evaluate(f, a);
  await ev(E => { E.forEach(([id, label, la, ln]) => { CITIES[id] = { label, center: [la, ln], zoom: 12, countrycodes: 'us', viewbox: `${ln - .1},${la - .1},${ln + .1},${la + .1}`, auto: false }; }); setActiveCity(ALL_CITIES, { frame: false }); }, EXTRA);
  const Z = await signView(page);
  await ev(Z => map.setView(Z.c, Z.z, { animate: false }), Z); await W(1200);
  // 1. the picker: the question (the menu's caption), "+ A new city…", your cities, the foot
  await openMenu(page, desk);
  await ev(() => rmShowPicker('stockholm')); await W(700);
  await shot(page, `${pre}1-picker`);
  // 2. typing a new city: the results take the middle
  await ev(() => { const i = document.querySelector('#titleMenu .rm-new input'); i.focus(); }); await W(150);
  await L.findCity(page, 'titleMenu', 'Philadelphia');
  await shot(page, `${pre}2-new-city`);
  // 3. one tap: Philadelphia made, the places moved, Stockholm gone; the slip
  if (!desk) {
    await ev(() => document.querySelector('#titleMenu .rm-found .menu-res').click()); await W(1800);
    await shot(page, `${pre}3-moved-to-new-city`);
    await ev(() => document.querySelector('#planSlip button').click()); await W(1500);
  } else await ev(() => closeTitleMenu(false));
  // 4. an empty city's remove (Lewes: nothing filed there)
  await openMenu(page, desk);
  await ev(() => rmShowPicker('lewes')); await W(700);
  await shot(page, `${pre}4-empty-city`);
  await ev(() => closeTitleMenu(false)); await W(300);
  // 5. 375: the title menu's 11px tally with a long city name
  if (key === 'small') {
    await ev(() => { CITIES.stockholm.label = 'East Marlborough Township'; menuSig = null; }); await openMenu(page, desk);
    await ev(() => { const r = document.querySelector('#titleMenu .menu-city[data-city="stockholm"]'), m = document.getElementById('titleMenu'); m.scrollTop += r.getBoundingClientRect().top - m.getBoundingClientRect().top - 80; }); await W(300);
    await shot(page, `${pre}5-long-name-tally`);
  }
  console.log(key, 'errors', o.errors);
  await page.context().close();
}

const SHEETS = [
  ['1-picker', '1 · The picker: a new city, the owner\'s copy, the menu\'s own type (build)', [
    ['B1-picker', '390 × 844', '"Should we move Stockholm’s places to a new city?" (the menu caption), "+ A new city…", your cities, then "Remove places too" (bin), the band, "Cancel".'],
    ['S1-picker', '375 × 667', 'The new-city line and the whole foot stay on screen; your cities scroll.'],
    ['D1-picker', 'Desktop 1280 × 800', 'Opens down from the menu\'s top.'],
  ]],
  ['2-new-city', '2 · Move them to a new city, one step (build)', [
    ['B2-new-city', 'Typing a city', 'The results take the middle; clearing the line brings your cities back.'],
    ['B3-moved-to-new-city', 'One tap', 'Philadelphia is made, Stockholm\'s places move there, Stockholm goes: "Its places → Philadelphia", with Undo.'],
    ['S2-new-city', 'At 375', 'Typing.'],
    ['S3-moved-to-new-city', 'At 375', 'The slip.'],
    ['D2-new-city', 'Desktop', 'Typing.'],
  ]],
  ['3-empty-and-tally', '3 · An empty city; the menu\'s tally (build)', [
    ['B4-empty-city', 'An empty city', '"Remove Lewes? Nothing is filed here.": the destructive row and Cancel only, no new-city line.'],
    ['S4-empty-city', 'At 375', 'The same.'],
    ['S5-long-name-tally', 'The tally at 11px', 'The title menu\'s tally at the type floor (as the signposts\' and headers\'); "East Marlborough Township 23" still fits at 375.'],
    ['D4-empty-city', 'Desktop', 'The same.'],
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
    await page.screenshot({ path: path.join(__dirname, 'stills', 'v2d', file + '.png'), fullPage: true });
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
