// City CRUD v2b build stills (v4-v12 on the v2 build): the real index.html on the gesture harness's stub
// with real Nominatim answers (./fixtures) and real OSM tiles (cached; CC_TILES moves the cache). Phone
// frames at 390x844 @3x and 375x667 @3x into stills/v2b/raw/, then the contact sheets in stills/v2b/.
//   CHROME=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome node design/city-crud/build/stills-v2b.js [frames|sheets]
const path = require('path'), fs = require('fs');
const L = require('./lib-cc.js');
const { P, W } = L;
const OUT = path.join(__dirname, 'stills', 'v2b', 'raw');
fs.mkdirSync(OUT, { recursive: true });
const TILES = process.env.CC_TILES || '/tmp/claude-0/-home-user-triplet/93db611f-01c4-59bd-abb2-1bd1be23b367/scratchpad/tiles';
fs.mkdirSync(TILES, { recursive: true });

async function open(b, opts = {}) {
  const o = await L.open(b, { dsf: 3, storage: { 'gh.plans': '1', 'triplet.reorderHint': '1', 'triplet.hiddenCities': '[]' }, ...opts });
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
const menuOpen = async page => { if (await page.evaluate(() => document.getElementById('titleMenu').hidden)) { await P.tap(page, '#titleBtn'); await W(300); } };
const scrollMenuTo = (page, sel) => page.evaluate(sel => { const e = document.querySelector(sel), m = document.getElementById('titleMenu'), foot = m.querySelector('.menu-row[data-kind]'); e.scrollIntoView({ block: 'nearest' }); const er = e.getBoundingClientRect(), fr = foot.getBoundingClientRect(); if (er.bottom > fr.top) m.scrollTop += er.bottom - fr.top; }, sel);

async function frames(b, size) {
  const sm = size === 'small', pre = sm ? 'S' : 'B';
  const o = await open(b, sm ? { w: 375, h: 667 } : {}), page = o.page, ev = (f, a) => page.evaluate(f, a);
  // the zoomed-out view: the app's own signpost framing (All places' landing view), where the signs fit
  const Z = await (async () => {
    await ev(() => setActiveCity(ALL_CITIES, { frame: false }));
    for (const z of [4, 3]) for (const lat of [56, 58, 60, 62, 64, 66, 68, 70, 72]) for (const lng of [-8, -4, 0, 4, 8, 12]) {
      const n = await ev(([c, z]) => { map.setView(c, z, { animate: false }); updateUI(); return document.querySelectorAll('#map .sp-board').length; }, [[lat, lng], z]);
      if (n >= 4) return { c: [lat, lng], z };
    }
    return { c: [58, -2], z: 3 };
  })();
  console.log('signpost view', size, Z);
  // 1. a picked city: its list alone, no header; zoomed out, the other cities faded
  await ev(() => setActiveCity('malmo')); await W(1800);
  if (!sm) await shot(page, `${pre}1-picked-city`);
  await ev(Z => map.setView(Z.c, Z.z, { animate: false }), Z); await W(1500);
  await shot(page, `${pre}2-faded-signposts`);
  // 2. New city
  await ev(() => map.setView([40.3, -75.4], 7, { animate: false })); await W(800);
  await menuOpen(page); await scrollMenuTo(page, '#titleMenu [data-act="newcity"]'); await W(200);
  if (!sm) await shot(page, `${pre}3-new-city-row`);
  await P.tap(page, '#titleMenu [data-act="newcity"]'); await W(300);
  await L.findCity(page, 'titleMenu', 'Philadelphia');
  await shot(page, `${pre}4-new-city-find`);
  await ev(() => document.querySelector('#titleMenu .menu-res').click()); await W(2200);
  await shot(page, `${pre}5-empty-city`);
  // 3. remove: the swipe, the board and the turned sign, the picker, the slip
  await ev(Z => { setActiveCity(ALL_CITIES, { frame: false }); map.setView(Z.c, Z.z, { animate: false }); }, Z); await W(1500);
  await menuOpen(page);
  const q = await ev(() => { const b = document.querySelector('#titleMenu .menu-city[data-city="stockholm"]'); b.scrollIntoView({ block: 'nearest' }); const r = b.getBoundingClientRect(); return { x: r.left + r.width * 0.8, y: r.top + r.height / 2 }; });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: q.x, y: q.y }] });
  for (let i = 1; i <= 12; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: q.x - 7 * i, y: q.y }] }); await W(30); }
  if (!sm) { await W(300); await page.screenshot({ path: path.join(OUT, `${pre}6-swiping.png`) }); console.log('shot', `${pre}6-swiping`); }
  for (let i = 13; i <= 20; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: q.x - 7 * i, y: q.y }] }); await W(30); }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await W(900);
  await shot(page, `${pre}7-board-open`);
  await ev(() => rmShowPicker('stockholm')); await W(600);
  await shot(page, `${pre}8-picker`);
  await ev(() => document.querySelector('#titleMenu .rm-dest[data-rm-to]').click()); await W(1500);
  await shot(page, `${pre}9-moved-undo`);
  if (!sm) {
    await ev(() => document.querySelector('#planSlip button').click()); await W(1200);
    await menuOpen(page); await ev(() => rmShowPicker('copenhagen')); await W(500);
    await ev(() => document.querySelector('#titleMenu .rm-dest.is-too').click()); await W(1500);
    await shot(page, `${pre}10-removed-too-undo`);
    await ev(() => document.querySelector('#planSlip button').click()); await W(1200);
    // signed out: the board reads SIGN IN
    await ev(() => { currentUser = null; }); await menuOpen(page); await W(300);
    await ev(() => { menuSig = null; renderTitleMenu(); const r = document.querySelector('#titleMenu .menu-city[data-city="reykjavik"]'); rmSetOpen(r, true); }); await W(700);
    await shot(page, `${pre}11-signed-out`);
  }
  console.log('errors', o.errors);
  await page.context().close();
}

const SHEETS = [
  ['1-a-picked-city', '1 · A picked city is that city (build)', [
    ['B1-picked-city', 'Malmö picked', 'The list holds Malmö only, from its first place: no header (the title names it). The map holds its pins.'],
    ['B2-faded-signposts', 'Zoomed out', 'Malmö\'s signpost as before; the other cities faded (dashed grey rule, no shadow). A faded board picks its city.'],
  ]],
  ['2-new-city', '2 · New city, with no place yet (build)', [
    ['B3-new-city-row', 'New city', '"+ New city" on the Places side of the title menu, above Plans.'],
    ['B4-new-city-find', 'Find it', 'The row becomes the Find a city line: real cities only, nearest the map first.'],
    ['B5-empty-city', 'An empty city, kept', 'You land in Philadelphia, 0, with the empty note. It\'s yours until you remove it.'],
  ]],
  ['3-remove-a-city', '3 · Remove a city: swipe its row (build)', [
    ['B6-swiping', 'Swipe left', 'The REMOVE board slides in from the right with the finger; the name never moves; past 40% the sign turns.'],
    ['B7-board-open', 'Open', 'It snaps open at 132px; Stockholm\'s signpost now says SEE YOU SOON? (tap it, or the board).'],
    ['B8-picker', 'One step', 'Where its places go: the nearest city first, with distances; or remove them too; or keep it.'],
  ]],
  ['4-after-remove', '4 · Done, with Undo (build)', [
    ['B9-moved-undo', 'Moved', 'One tap moved Stockholm\'s places to Malmö (the nearest) and removed it; the slip offers Undo for 6s.'],
    ['B10-removed-too-undo', 'Removed too', 'Held: gone from the screen, written only when the slip ends. Undo brings it all back.'],
    ['B11-signed-out', 'Signed out', 'The board reads SIGN IN; tapping it asks you to sign in.'],
  ]],
  ['5-small-phone', '5 · 375x667 (build)', [
    ['S2-faded-signposts', 'Faded signposts', 'Malmö picked, zoomed out.'],
    ['S4-new-city-find', 'Find a city', 'The line and its results scroll inside the menu.'],
    ['S5-empty-city', 'Empty city', 'The note under the title.'],
    ['S7-board-open', 'Board open', 'The sign turned above the menu.'],
    ['S8-picker', 'Picker', 'It opens under the row; the menu scrolls.'],
    ['S9-moved-undo', 'Undo slip', 'On the list header.'],
  ]],
];
async function sheets(b) {
  const FW = 340;
  const ctx = await b.newContext({ deviceScaleFactor: 3, viewport: { width: 800, height: 600 } });
  const page = await ctx.newPage();
  for (const [file, title, fr] of SHEETS) {
    if (!fr.every(([f]) => fs.existsSync(path.join(OUT, f + '.png')))) { console.log('skip sheet', file); continue; }
    const cells = fr.map(([f, h, c]) => `<figure><img src="data:image/png;base64,${fs.readFileSync(path.join(OUT, f + '.png')).toString('base64')}"><figcaption><b>${h}</b><span>${c}</span></figcaption></figure>`).join('');
    const per = Math.min(fr.length, 3), w = per * FW + (per + 1) * 20;
    await page.setViewportSize({ width: w, height: 600 });
    await page.setContent(`<!doctype html><html><head><style>
      body { margin: 0; padding: 20px; background: #F2EBDD; font-family: -apple-system, 'Segoe UI', Roboto, sans-serif; color: #12293F; width: ${w - 40}px; }
      h1 { font-size: 22px; line-height: 28px; margin: 0 0 16px; }
      .row { display: flex; flex-wrap: wrap; gap: 20px; align-items: flex-start; }
      figure { margin: 0; width: ${FW}px; }
      img { width: ${FW}px; display: block; border: 1px solid #D8CEBA; border-radius: 6px; }
      figcaption { margin-top: 10px; font-size: 16px; line-height: 21px; color: #3a3a36; }
      figcaption b { display: block; font-size: 18px; line-height: 23px; color: #12293F; margin-bottom: 2px; }
    </style></head><body><h1>${title}</h1><div class="row">${cells}</div></body></html>`);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(__dirname, 'stills', 'v2b', file + '.png'), fullPage: true });
    console.log('sheet', file);
  }
  await ctx.close();
}
(async () => {
  const only = process.argv[2] || '';
  const b = await P.lib.launch();
  if (only !== 'sheets') { await frames(b, 'phone'); await frames(b, 'small'); }
  if (only !== 'frames') await sheets(b);
  await b.close();
})();
