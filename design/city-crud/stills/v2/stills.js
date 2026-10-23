// City CRUD v2 (after the owner's scope change: the roadtrip is a saved plan; cities are real cities,
// deletable, never renamed). Phone frames (390x844 @3x) of the real index.html + ../../proto/design-layer.js,
// then the contact sheets.
//   CHROME=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome node design/city-crud/stills/v2/stills.js [prefix]
const path = require('path'), fs = require('fs');
const { open, P, W } = require('../../proto/lib-cc.js');
const OUT = path.join(__dirname, 'raw');
fs.mkdirSync(OUT, { recursive: true });
const STORAGE = { 'gh.plans': '1', 'triplet.reorderHint': '1' };
const PHL = [39.9526, -75.1652];
const SEEDS = ['la', 'reykjavik', 'copenhagen', 'malmo', 'stockholm'];
const blur = page => page.evaluate(() => document.activeElement && document.activeElement.blur());
async function addAt(page, latlng, z = 11) {
  await page.evaluate(([ll, z]) => { CC.unhideAll(); map.setView(ll, z, { animate: false }); }, [latlng, z]); await W(400);
  await P.openAdd(page);
}
// Longwood Gardens as the app filed it: NEW "East Marlborough Township" (the owner's add, saved)
const TOWNSHIP = () => {
  CITIES.eastmarl = { label: 'East Marlborough Township', center: [39.866, -75.655], zoom: 12, viewbox: '-75.75,39.83,-75.60,39.91' };
  locations = locations.map(l => l.id === 'phl03' ? { ...l, city: 'eastmarl' } : l); window.__ROWS.forEach(r => { if (r.id === 'phl03') r.city = 'eastmarl'; });
};
async function openTagOf(page, id) {
  await page.evaluate(id => { const en = rowEntry(id); en.el.scrollIntoView({ block: 'center' }); en.el.click(); }, id); await W(2000);
}
const PLAN = (ids) => {
  plans = plans.concat([{ id: 'phl-p', name: 'Philly roadtrip', created_at: '2026-10-20T00:00:00Z' }]);
  planStops = planStops.concat(ids.map((l, i) => ({ id: 'ps' + i, plan_id: 'phl-p', location_id: l, shape_id: null, position: i + 1 })));
  window.__PT && window.__PT.plans.push({ id: 'phl-p', name: 'Philly roadtrip', created_at: '2026-10-20T00:00:00Z' });
  window.__PT && ids.forEach((l, i) => window.__PT.plan_stops.push({ id: 'ps' + i, plan_id: 'phl-p', location_id: l, shape_id: null, position: i + 1 }));
};

const FRAMES = {
  // ---- 1: NAME and ADDRESS ----
  async 'V1-address-search'(page) {
    await addAt(page, PHL);
    await page.evaluate(() => {
      document.getElementById('addCityName').innerHTML = '<span style="color:var(--ink-2);font-weight:500">City</span>';
      CC.addressTyping('1007 N Orange St, Wilmington', [['1007 North Orange Street', 'Address · Wilmington, United States'], ['North Orange Street', 'Street · Wilmington, United States']]);
    });
  },
  async 'V2-address-picked'(page) {
    await addAt(page, PHL);
    await P.typeName(page, '1007 N Orange St Wilmington'); await P.pick(page, 0); await W(1500); await blur(page);
    await page.evaluate(() => { CC.setName('Rental, night 2'); CC.hideResults(); CC.addrShown('1007 North Orange Street · Wilmington'); });
  },
  // ---- 2: move a place to another / a new (real) city ----
  async 'V3-find-a-city'(page) {
    await page.evaluate(TOWNSHIP_SRC => { CC.seedPhilly(true, ['phl03']); delete CITIES.philadelphia; eval(TOWNSHIP_SRC)(); CC.hideOnly(['la', 'reykjavik', 'copenhagen', 'malmo', 'stockholm']); goToCity('eastmarl'); }, `(${TOWNSHIP})`); await W(1500);
    await openTagOf(page, 'phl03');
    await P.tap(page, '.leaflet-popup .tag-city');
    await page.evaluate(() => {
      const m = document.getElementById('tagCityMenu');
      m.insertAdjacentHTML('beforeend', '<div class="menu-foot"><div class="menu-cap is-mid">New city</div>'
        + `<div class="menu-row cc-in" role="presentation">${CC.ICO.plus}<span class="cc-field">Philadelphia<span class="cc-caret"></span></span></div>`
        + '<button type="button" class="add-res" style="padding-left:40px"><span class="add-res-name">Philadelphia</span><span class="add-res-where">City · Pennsylvania, United States · ≈ 45 km away</span></button></div>');
      m.style.height = 'auto'; m.style.maxHeight = 'none';
    });
  },
  async 'V4-moved'(page) {
    await page.evaluate(() => { CC.seedPhilly(true, ['phl01', 'phl02', 'phl03']); CC.hideOnly(['la', 'reykjavik', 'copenhagen', 'malmo', 'stockholm']); goToCity('philadelphia'); }); await W(1500);
    await openTagOf(page, 'phl03');
  },
  // ---- 3: the roadtrip is a plan ----
  async 'V5-add-into-plan'(page) {
    await page.evaluate(PLAN_SRC => { CC.seedPhilly(true, ['phl01', 'phl03']); eval(PLAN_SRC)(['phl01', 'phl03']); CC.unhideAll(); setListView('plans'); choosePlan('phl-p'); }, `(${PLAN})`); await W(1500);
    await P.openAdd(page);
    await P.typeName(page, 'Cape Henlopen State Park'); await P.pick(page, 0); await W(1500); await blur(page);
    await page.evaluate(() => {
      CC.hideResults(); CC.addrShown('Cape Henlopen Drive · Lewes');
      document.querySelector('#addForm .add-type').insertAdjacentHTML('afterend',
        `<div class="add-type" style="display:flex;gap:var(--s2);border-top:1px solid var(--hair)"><span class="tag-lab" style="width:40px">Plan</span><button type="button" class="add-type-btn"><span class="add-type-val">Philly roadtrip</span>${CC.ICO.chev}</button>`
        + `<span class="tag-val tag-plan" style="margin-left:auto;font-stretch:75%;text-transform:uppercase;font-weight:500;font-size:11px;letter-spacing:.12em;color:var(--ink-2)">Stop <span class="tag-stamp" style="--tilt:-2deg;${texVars('cape', 'n', 170, .1)}">3</span></span></div>`);
    });
  },
  async 'V6-stop-in-plan'(page) {
    await page.evaluate(PLAN_SRC => { CC.seedPhilly(true, ['phl01', 'phl03']); eval(PLAN_SRC)(['phl01', 'phl03']); CC.unhideAll(); setListView('plans'); choosePlan('phl-p'); }, `(${PLAN})`); await W(1500);
    await P.openAdd(page);
    await P.typeName(page, 'Cape Henlopen State Park'); await P.pick(page, 0); await W(1500); await blur(page);
    await page.evaluate(() => document.querySelector('#addStub .add-go').click()); await W(2500);
    const id = await page.evaluate(() => { const r = window.__ROWS[window.__ROWS.length - 1]; return r.id; });
    await page.evaluate(async id => { await addStop('phl-p', { locationId: id }); updateUI(); }, id); await W(800);
    await page.evaluate(() => map.closePopup()); await W(400);
    await openTagOf(page, id);
  },
  // ---- 4: delete a city (no rename) ----
  async 'V7-delete-foot'(page) {
    await page.evaluate(() => { window.__toSection = id => { const list = document.getElementById('locationsList'); list.insertAdjacentHTML('beforeend', '<div style="height:500px"></div>'); const h = cityHeads.get(id).el; list.scrollTop += h.getBoundingClientRect().top - list.getBoundingClientRect().top; }; });
    await page.evaluate(TOWNSHIP_SRC => { CC.seedPhilly(true, ['phl01', 'phl02', 'phl03']); eval(TOWNSHIP_SRC)(); CC.hideOnly(['la', 'reykjavik', 'copenhagen', 'malmo', 'stockholm']); goToCity('eastmarl'); }, `(${TOWNSHIP})`); await W(1500);
    await page.evaluate(() => { const r = rowEntry('phl03').el; r.insertAdjacentHTML('afterend', '<div class="plan-foot" role="group"><button type="button" class="plan-act">Delete city…</button></div>'); window.__toSection('eastmarl'); });
  },
  async 'V8-delete-confirm'(page) {
    await page.evaluate(() => { window.__toSection = id => { const list = document.getElementById('locationsList'); list.insertAdjacentHTML('beforeend', '<div style="height:500px"></div>'); const h = rowEntry('phl03').el; list.scrollTop += h.getBoundingClientRect().top - list.getBoundingClientRect().top; }; });
    await page.evaluate(TOWNSHIP_SRC => { CC.seedPhilly(true, ['phl01', 'phl02', 'phl03']); eval(TOWNSHIP_SRC)(); CC.hideOnly(['la', 'reykjavik', 'copenhagen', 'malmo', 'stockholm']); goToCity('eastmarl'); }, `(${TOWNSHIP})`); await W(1500);
    await page.evaluate(() => { const r = rowEntry('phl03').el; r.insertAdjacentHTML('afterend',
      '<div class="cc-expand" style="padding:var(--s3) var(--gutter) var(--s3);background:var(--paper-raised)"><div class="cc-q" style="font-weight:600">Delete East Marlborough Township?</div>'
      + `<div class="cc-choice"><span class="cc-radio on"></span><span class="cc-lab">Move its 1 place to</span><button type="button" class="route-city" style="margin-left:0"><span class="route-city-name">Philadelphia</span>${CC.ICO.chev}</button></div>`
      + '<div class="cc-choice"><span class="cc-radio"></span><span class="cc-lab">Delete the place too</span></div>'
      + '<div class="cc-acts" style="margin-top:var(--s2)"><span class="cc-btn">Cancel</span><span class="cc-btn go">Delete city</span></div></div>'); window.__toSection('eastmarl'); });
  },
};

const SHEETS = [
  ['1-name-and-address', '1 · Name and address are two lines', [
    ['V1-address-search', 'Type the address in ADDRESS', 'NAME (empty) and ADDRESS are separate lines; each one searches. The address results open under ADDRESS.'],
    ['V2-address-picked', 'Name it what you call it', 'A pick fills the address; NAME is yours ("Rental, night 2"). The city is guessed as today.'],
  ]],
  ['2-move-to-a-city', '2 · Close by: move a place to another city, or a new real one', [
    ['V3-find-a-city', 'Find a city', 'The city menu (on any place\'s tag, and the add tag) gets a search for real cities. Typing "Philadelphia" offers the city, with how far it is.'],
    ['V4-moved', 'Moved', 'Longwood Gardens is now in Philadelphia, ≈ 45 km out. The empty township city is cleaned up, as today.'],
  ]],
  ['3-roadtrip-is-a-plan', '3 · A roadtrip is a saved plan', [
    ['V5-add-into-plan', 'Add from the open plan', 'With a plan open, + adds a PLAN line: this place becomes stop 3 of Philly roadtrip. The city is its real town (NEW Lewes).'],
    ['V6-stop-in-plan', 'It\'s stop 3', 'ADD makes the place and the stop: in the plan it sits under a new LEWES leg after the Philadelphia stops, and its tag says STOP 3 OF 3.'],
  ]],
  ['4-delete-a-city', '4 · Delete a city (no rename)', [
    ['V7-delete-foot', 'Delete city…', 'Under the city you\'ve gone to, one quiet action, the way an open plan has its foot.'],
    ['V8-delete-confirm', 'Where its places go', 'Move them to a city you pick (default: the nearest), or delete them too.'],
  ]],
];

(async () => {
  const only = process.argv[2] || '';
  const b = await P.lib.launch();
  if (only !== 'sheets') for (const [name, fn] of Object.entries(FRAMES)) {
    if (only && !name.startsWith(only)) continue;
    const o = await open(b, { storage: STORAGE });
    try { await fn(o.page); await W(600); await o.page.screenshot({ path: path.join(OUT, name + '.png') }); console.log('shot', name, o.errors.length ? o.errors : ''); }
    catch (e) { console.log('FAIL', name, e.message.split('\n')[0]); }
    await o.page.context().close();
  }
  const FW = 340;
  const ctx = await b.newContext({ deviceScaleFactor: 3, viewport: { width: 800, height: 600 } });
  const page = await ctx.newPage();
  for (const [file, title, frames] of SHEETS) {
    if (!frames.every(([f]) => fs.existsSync(path.join(OUT, f + '.png')))) continue;
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
    await page.screenshot({ path: path.join(__dirname, file + '.png'), fullPage: true });
    console.log('sheet', file);
  }
  await b.close();
})();
