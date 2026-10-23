// City CRUD v2 build stills: the real index.html (this build, no design layer) on the gesture
// harness's stub with real Nominatim answers (./fixtures) and real OSM tiles (cached on disk, one
// polite fetch each; CC_TILES moves the cache). Phone frames at 390x844 @3x, plus the 375x667 fits;
// then the contact sheets.
//   CHROME=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome node design/city-crud/build/stills.js [frames|sheets]
const path = require('path'), fs = require('fs');
const L = require('./lib-cc.js');
const { P, P3, W } = L;
const OUT = path.join(__dirname, 'stills', 'raw');
fs.mkdirSync(OUT, { recursive: true });
const TILES = process.env.CC_TILES || '/tmp/claude-0/-home-user-triplet/93db611f-01c4-59bd-abb2-1bd1be23b367/scratchpad/tiles';
fs.mkdirSync(TILES, { recursive: true });
const PHL = [39.9526, -75.1652];

async function open(b, opts) {
  const o = await L.open(b, { dsf: 3, storage: { 'gh.plans': '1', 'triplet.reorderHint': '1' }, ...opts });
  await o.page.route(/tile\.openstreetmap\.org\/\d+\/\d+\/\d+\.png/, async route => {
    const m = route.request().url().match(/\/(\d+)\/(\d+)\/(\d+)\.png/);
    const f = path.join(TILES, `${m[1]}-${m[2]}-${m[3]}.png`);
    if (!fs.existsSync(f)) {
      try { const r = await fetch(`https://tile.openstreetmap.org/${m[1]}/${m[2]}/${m[3]}.png`, { headers: { 'User-Agent': 'triplet-design-stills/1.0' } }); if (r.ok) fs.writeFileSync(f, Buffer.from(await r.arrayBuffer())); } catch (e) {}
    }
    return fs.existsSync(f) ? route.fulfill({ contentType: 'image/png', body: fs.readFileSync(f) }) : route.fallback();
  });
  // the stub's blank tiles were drawn at load: redraw with the real ones
  await o.page.evaluate(() => { map.eachLayer(l => { if (l.redraw && l._url) l.redraw(); }); });
  await W(400);
  return o;
}
const shot = async (page, name) => { await W(700); await page.screenshot({ path: path.join(OUT, name + '.png') }); console.log('shot', name); };
const setName = (page, t) => page.evaluate(t => { const i = document.getElementById('nameInput'); i.value = t; i.dispatchEvent(new Event('input', { bubbles: true })); }, t);
const blur = page => page.evaluate(() => document.activeElement && document.activeElement.blur());
const unhide = page => page.evaluate(() => { hiddenCities.clear(); persistHiddenCities(); updateUI(); });

async function phone(b) {
  const o = await open(b, {}), page = o.page, ev = (f, a) => page.evaluate(f, a);
  await ev(ll => map.setView(ll, 11, { animate: false }), PHL); await W(800);
  // 1. ADDRESS written on: the CITY caption, results under ADDRESS
  await P.openAdd(page);
  await L.typeAddr(page, '1007 N Orange St Wilmington');
  await shot(page, 'B1-address-search');
  // 2. picked; NAME is mine
  await P.pick(page, 0); await W(600);
  await setName(page, 'Rental, night 2'); await blur(page); await W(1300);
  await shot(page, 'B2-address-picked');
  // 2b. NAME being written: its caption stays above the entry
  await ev(() => { const i = document.getElementById('nameInput'); i.focus(); i.setSelectionRange(i.value.length, i.value.length); });
  await shot(page, 'B2b-name-writing');
  await ev(() => { cancelAddForm(); clearAddDraft(); }); await W(500);
  // 3. the owner's case: Longwood Gardens filed NEW East Marlborough Township; Find a city on its tag
  await P.openAdd(page); await P.typeName(page, 'Longwood Gardens'); await P.pick(page, 0); await W(400);
  await ev(() => { document.querySelector('#addStub .popup-star').click(); }); await W(500);
  await ev(() => document.getElementById('submitBtn').click()); await W(2600);
  await unhide(page); await W(300);
  const lw = await ev(() => locations.find(l => l.name === 'Longwood Gardens').id);
  await P3.openTag(page, lw);
  await P.tap(page, '.leaflet-popup .tag-city');
  await L.findCity(page, 'tagCityMenu', 'Philadelphia');
  await shot(page, 'B3-find-a-city');
  await ev(() => document.querySelector('#tagCityMenu .menu-res').click()); await W(2000);
  await shot(page, 'B4-moved');
  // 3b. the add tag's city menu: Find a city there too (a hit that is one of your cities)
  await ev(() => map.closePopup()); await W(400);
  await ev(ll => map.setView(ll, 11, { animate: false }), [39.75, -75.55]); await W(500);
  await P.openAdd(page); await L.typeAddr(page, '1007 N Orange St Wilmington'); await P.pick(page, 0); await W(500);
  await setName(page, 'Rental, night 2'); await blur(page); await W(1200);
  await P.tap(page, '#addCityBtn');
  await L.findCity(page, 'addCityMenu', 'Philadelphia');
  await shot(page, 'B3b-find-on-add-tag');
  await ev(() => { closeAddMenus(false); cancelAddForm(); clearAddDraft(); }); await W(500);
  // 4. a roadtrip is a plan: a plan open, + shows the PLAN line
  const pid = await ev(async () => createPlan('Philly roadtrip'));
  await ev(async ([pid, lw]) => { await addStop(pid, { locationId: lw }); }, [pid, lw]);
  await ev(pid => choosePlan(pid), pid); await W(1500);
  await P.openAdd(page); await P.typeName(page, 'Cape Henlopen State Park'); await P.pick(page, 0); await W(600); await blur(page);
  await shot(page, 'B5-add-into-plan');
  await ev(() => document.getElementById('submitBtn').click()); await W(3000);
  await shot(page, 'B6-stop-in-plan');
  // 5. the stop write fails: the place is kept, the tag says so
  await ev(() => map.closePopup()); await W(400);
  await ev(ll => map.setView(ll, 11, { animate: false }), [39.75, -75.55]); await W(500);
  await P.openAdd(page); await L.typeAddr(page, '1007 N Orange St Wilmington'); await P.pick(page, 0); await W(500);
  await setName(page, 'Rental, night 2'); await blur(page); await W(1200);
  await ev(() => { window.__failNext = 'plan_stops'; document.getElementById('submitBtn').click(); }); await W(2600);
  await ev(() => { const s = document.getElementById('errorBanner') || document.querySelector('.error-banner'); if (s) s.hidden = true; });
  await shot(page, 'B7-stop-failed');
  console.log('errors', o.errors);
  await page.context().close();
}
async function small(b) {
  const o = await open(b, { w: 375, h: 667 }), page = o.page, ev = (f, a) => page.evaluate(f, a);
  await ev(ll => map.setView(ll, 11, { animate: false }), PHL); await W(600);
  const pid = await ev(async () => createPlan('Philly roadtrip'));
  await ev(pid => choosePlan(pid), pid); await W(1200);
  await P.openAdd(page); await P.typeName(page, 'Longwood Gardens'); await P.pick(page, 0); await W(600); await blur(page); await W(400);
  await shot(page, 'S1-375-plan-line');
  await P.tap(page, '#addCityBtn'); await L.findCity(page, 'addCityMenu', 'Philadelphia');
  await shot(page, 'S2-375-find-a-city');
  await page.context().close();
}

const SHEETS = [
  ['1-name-and-address', '1 · Name and address are two lines (build)', [
    ['B1-address-search', 'Type the address in ADDRESS', 'No city near the map: the line prints CITY. The address results open under ADDRESS; its caption stays above the entry, the rule navy.'],
    ['B2-address-picked', 'Name it what you call it', 'The pick fills ADDRESS; NAME is mine ("Rental, night 2") and no longer searches. The city is the guess (NEW Wilmington).'],
    ['B2b-name-writing', 'Writing on NAME', 'A line being written on keeps its caption above the entry (the spec\'s rule, applied to every line).'],
  ]],
  ['2-move-to-a-city', '2 · Move a place to a new real city (build)', [
    ['B3-find-a-city', 'Find a city', 'Longwood Gardens, filed NEW East Marlborough Township. Its city menu: "+ Find a city…" finds Philadelphia, ≈ 45 km away.'],
    ['B4-moved', 'Moved', 'Philadelphia is made from the result, the place moves; the township, emptied, is cleaned up.'],
    ['B3b-find-on-add-tag', 'On the add tag too', 'The same line on the add tag\'s city menu. Philadelphia is now one of your cities: picking it just picks it.'],
  ]],
  ['3-roadtrip-is-a-plan', '3 · A roadtrip is a saved plan (build)', [
    ['B5-add-into-plan', 'Add from the open plan', 'With a plan open, + shows the PLAN line, preset: STOP 2 of Philly roadtrip. The city is the real town (NEW Lewes).'],
    ['B6-stop-in-plan', 'It\'s stop 2', 'ADD makes the place and its stop; its tag says STOP 2 OF 2, under a new LEWES leg.'],
    ['B7-stop-failed', 'The stop didn\'t save', 'The place is kept; the tag stays up and says so. ADD tries only the stop again.'],
  ]],
  ['4-small-phone', '4 · 375x667 fits (build)', [
    ['S1-375-plan-line', 'The add tag with PLAN', 'The busiest add tag fits the open map above the list.'],
    ['S2-375-find-a-city', 'Find a city', 'The menu stays on screen; the search line and its results scroll in the box.'],
  ]],
];
async function sheets(b) {
  const FW = 340;
  const ctx = await b.newContext({ deviceScaleFactor: 3, viewport: { width: 800, height: 600 } });
  const page = await ctx.newPage();
  for (const [file, title, frames] of SHEETS) {
    if (!frames.every(([f]) => fs.existsSync(path.join(OUT, f + '.png')))) { console.log('skip sheet', file); continue; }
    const cells = frames.map(([f, h, c]) => `<figure><img src="data:image/png;base64,${fs.readFileSync(path.join(OUT, f + '.png')).toString('base64')}"><figcaption><b>${h}</b><span>${c}</span></figcaption></figure>`).join('');
    const w = frames.length * FW + (frames.length + 1) * 20;
    await page.setViewportSize({ width: w, height: 600 });
    await page.setContent(`<!doctype html><html><head><style>
      body { margin: 0; padding: 20px; background: #F2EBDD; font-family: -apple-system, 'Segoe UI', Roboto, sans-serif; color: #12293F; width: ${w - 40}px; }
      h1 { font-size: 22px; line-height: 28px; margin: 0 0 16px; }
      .row { display: flex; gap: 20px; align-items: flex-start; }
      figure { margin: 0; width: ${FW}px; }
      img { width: ${FW}px; display: block; border: 1px solid #D8CEBA; border-radius: 6px; }
      figcaption { margin-top: 10px; font-size: 16px; line-height: 21px; color: #3a3a36; }
      figcaption b { display: block; font-size: 18px; line-height: 23px; color: #12293F; margin-bottom: 2px; }
    </style></head><body><h1>${title}</h1><div class="row">${cells}</div></body></html>`);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(__dirname, 'stills', file + '.png'), fullPage: true });
    console.log('sheet', file);
  }
  await ctx.close();
}
(async () => {
  const only = process.argv[2] || '';
  const b = await P.lib.launch();
  if (only !== 'sheets') { await phone(b); await small(b); }
  if (only !== 'frames') await sheets(b);
  await b.close();
})();
