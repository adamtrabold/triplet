// City CRUD v2e build stills (v15 / v15b + the owner's top-line tweak): the real index.html on the gesture
// harness's stub with real Nominatim answers (./fixtures) and real OSM tiles. 390x844 @3x, 375x667 @3x,
// desktop 1280x800 @2x: the picker with New city, the search in place, Delete places, the city-removed
// banner in and out with the top controls, and the top line before (main) / after at 390.
//   CHROME=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome node design/city-crud/build/stills-v2e.js [frames|sheets]
const path = require('path'), fs = require('fs');
const L = require('./lib-cc.js');
const { P, W } = L;
const OUT = path.join(__dirname, 'stills', 'v2e', 'raw');
fs.mkdirSync(OUT, { recursive: true });
const TILES = process.env.CC_TILES || '/tmp/claude-0/-home-user-triplet/93db611f-01c4-59bd-abb2-1bd1be23b367/scratchpad/tiles';
fs.mkdirSync(TILES, { recursive: true });
const EXTRA = [['wilmington', 'Wilmington', 39.75, -75.55], ['lewes', 'Lewes', 38.77, -75.14], ['baltimore', 'Baltimore', 39.29, -76.61],
  ['annapolis', 'Annapolis', 38.98, -76.49], ['capemay', 'Cape May', 38.94, -74.91], ['newyork', 'New York', 40.71, -74.01], ['princeton', 'Princeton', 40.35, -74.66]];
const SIZES = { phone: { w: 390, h: 844, dsf: 3, pre: 'B' }, small: { w: 375, h: 667, dsf: 3, pre: 'S' }, desk: { w: 1280, h: 800, dsf: 2, pre: 'D', touch: false } };

async function open(b, sz, file) {
  const o = await L.open(b, { file, dsf: sz.dsf, w: sz.w, h: sz.h, touch: sz.touch !== false, storage: { 'gh.plans': '1', 'triplet.reorderHint': '1', 'triplet.hiddenCities': '[]' } });
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


const banner = async page => { await W(2500); const st = await page.evaluate(() => [document.getElementById('cityBanner').hidden, document.body.className]); if (st[0]) throw new Error('no banner ' + st); await page.evaluate(() => document.activeElement && document.activeElement.blur()); };   // a scripted click reads as the keyboard (focus on Undo holds the banner)
async function frames(b, key) {
  const sz = SIZES[key], pre = sz.pre, desk = key === 'desk';
  const o = await open(b, sz), page = o.page, ev = (f, a) => page.evaluate(f, a);
  await ev(E => { E.forEach(([id, label, la, ln]) => { CITIES[id] = { label, center: [la, ln], zoom: 12, countrycodes: 'us', viewbox: `${ln - .1},${la - .1},${ln + .1},${la + .1}`, auto: false }; }); setActiveCity(ALL_CITIES, { frame: false }); }, EXTRA);
  const Z = await signView(page);
  await ev(Z => map.setView(Z.c, Z.z, { animate: false }), Z); await W(1200);
  // 1. the picker: New city the list's last row; Delete places set off by the doubled rule; Cancel
  await openMenu(page, desk);
  await ev(() => rmShowPicker('stockholm')); await W(700);
  await shot(page, `${pre}1-picker`);
  if (key === 'small') { await ev(() => { const m = document.querySelector('#titleMenu .rm-mine'); m.scrollTop = m.scrollHeight; rmShadows(); }); await W(300); await shot(page, `${pre}1b-picker-end`); }
  // 2. New city tapped: the Find a city line in place; typing, the results under it in the list
  await ev(() => document.querySelector('#titleMenu .rm-newcity').click()); await W(400);
  if (!desk) await shot(page, `${pre}2a-line`);
  await L.findCity(page, 'titleMenu', 'Philadelphia');
  await shot(page, `${pre}2-new-city`);
  // 3. one tap: made, moved, gone -- the banner at the top, the controls under it
  await ev(() => document.querySelector('#titleMenu .rm-found .menu-res').click()); await banner(page);
  await shot(page, `${pre}3-banner-moved`);
  await ev(() => document.querySelector('#cityBanner button').click()); await W(1500);
  // 4. Delete places: the banner's deleted copy
  await openMenu(page, desk);
  await ev(() => rmShowPicker('stockholm')); await W(500);
  await ev(() => document.querySelector('#titleMenu .rm-dest.is-too').click()); await banner(page);
  await shot(page, `${pre}4-banner-deleted`);
  // 5. after 6s: the banner gone, the controls back on the top line
  await W(6600);
  await shot(page, `${pre}5-after`);
  await ev(() => commitHeldRemoval && null);
  // 6. an empty city: line 1 alone
  if (key === 'phone') {
    await openMenu(page, desk);
    await ev(() => { const r = document.querySelector('#titleMenu .menu-city[data-city="lewes"]'); rmSetOpen(r, true); }); await W(500);
    await ev(() => document.querySelector('#titleMenu .menu-city[data-city="lewes"] .rm-board').click()); await banner(page);
    await shot(page, `${pre}6-banner-empty`);
  }
  console.log(key, 'errors', o.errors);
  await page.context().close();
}
// the top line, before and after, at 390 -- the map at rest. Before = the shipped badge position
// (box top --s4 + the inset, as on main), put back over this build: the only thing that moved at rest.
async function topLine(b) {
  for (const [name, css] of [['A0-top-main', '#accountBtn, #accountFocus { top: calc(16px + var(--chrome-top-inset)) !important; }'], ['A1-top-now', '']]) {
    const o = await open(b, SIZES.phone), page = o.page;
    await page.evaluate(css => { const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s); setActiveCity('reykjavik', { frame: false }); map.setView([57, 5], 4, { animate: false }); }, css); await W(1500);
    await page.screenshot({ path: path.join(OUT, name + '.png'), clip: { x: 0, y: 0, width: 390, height: 160 } }); console.log('shot', name);
    await page.context().close();
  }
}

const SHEETS = [
  ['1-picker', '1 · The picker: New city in the list; Delete places set off by the doubled rule (build)', [
    ['B1-picker', '390 × 844', 'Your cities, then "+ New city" as the list\'s last row; "Delete places" under the doubled 2px rule; "Cancel".'],
    ['S1-picker', '375 × 667', 'The cities scroll; the foot never does.'],
    ['S1b-picker-end', '375, scrolled', 'New city waits at the list\'s end.'],
    ['D1-picker', 'Desktop 1280 × 800', 'Opens down from the menu\'s top.'],
  ]],
  ['2-new-city', '2 · New city: the search in place (build)', [
    ['B2a-line', 'Tap New city', 'The row turns into the Find a city line, in place, focused.'],
    ['B2-new-city', 'Typing', 'The results open right under it, inside the list; the box re-fits.'],
    ['B3-banner-moved', 'One tap', 'Philadelphia made, the places moved, Stockholm gone: the banner at the top, Undo.'],
    ['S2a-line', 'At 375', 'The line in place.'],
    ['S2-new-city', 'At 375', 'Typing.'],
    ['D2-new-city', 'Desktop', 'Typing.'],
  ]],
  ['3-banner', '3 · The city-removed banner: in, and out (build)', [
    ['B4-banner-deleted', 'Delete places', '"Stockholm removed / and its 23 places deleted". It takes the top line; zoom and account ride down 68px (52 + 16).'],
    ['B5-after', 'After 6s', 'It fades (160ms); the controls ride back to the top line.'],
    ['B6-banner-empty', 'An empty city', 'Line 1 alone: "Lewes removed".'],
    ['S3-banner-moved', '375 × 667', '"Its places → Philadelphia".'],
    ['S4-banner-deleted', '375', 'The deleted copy.'],
    ['S5-after', '375', 'After.'],
    ['D3-banner-moved', 'Desktop', 'Over the map only: 420 wide, centred, 16px below its top; nothing moves.'],
    ['D4-banner-deleted', 'Desktop', 'The deleted copy.'],
  ]],
  ['4-top-line', '4 · The top line at 390: before (main) and after', [
    ['A0-top-main', 'Before (as on main)', 'The account badge\'s top edge sits ~10px lower than the zoom control\'s.'],
    ['A1-top-now', 'After', 'The badge\'s ink top and the zoom control\'s top on one line (10px).'],
  ]],
];
async function sheets(b) {
  const FW = 340;
  const ctx = await b.newContext({ deviceScaleFactor: 3, viewport: { width: 800, height: 600 } });
  const page = await ctx.newPage();
  for (const [file, title, fr] of SHEETS) {
    if (!fr.every(([f]) => fs.existsSync(path.join(OUT, f + '.png')))) { console.log('skip sheet', file); continue; }
    const cells = fr.map(([f, h, c]) => { const wide = f.startsWith('D') || f.startsWith('A'); return `<figure style="width:${wide ? 2 * FW + 20 : FW}px"><img style="width:100%" src="data:image/png;base64,${fs.readFileSync(path.join(OUT, f + '.png')).toString('base64')}"><figcaption><b>${h}</b><span>${c}</span></figcaption></figure>`; }).join('');
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
    await page.screenshot({ path: path.join(__dirname, 'stills', 'v2e', file + '.png'), fullPage: true });
    console.log('sheet', file);
  }
  await ctx.close();
}
(async () => {
  const only = process.argv[2] || '';
  const b = await P.lib.launch();
  if (only !== 'sheets') { for (const k of Object.keys(SIZES)) await frames(b, k); await topLine(b); }
  if (only !== 'frames') await sheets(b);
  await b.close();
})();
