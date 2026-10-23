// City CRUD concepts: the phone frames (390x844 @3x), each on a fresh page of the real index.html with
// the design layer (../proto/design-layer.js) drawing the new states in the app's own parts.
//   CHROME=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome node design/city-crud/stills/stills.js [only-prefix]
const path = require('path'), fs = require('fs');
const { open, P, W } = require('../proto/lib-cc.js');
const OUT = path.join(__dirname, 'raw');
fs.mkdirSync(OUT, { recursive: true });
const STORAGE = { 'gh.plans': '1', 'triplet.reorderHint': '1' };
const PHL = [39.9526, -75.1652];

async function addAt(page, latlng, z = 11) {
  await page.evaluate(([ll, z]) => { CC.unhideAll(); map.setView(ll, z, { animate: false }); }, [latlng, z]); await W(400);
  await P.openAdd(page);
}
const blur = page => page.evaluate(() => document.activeElement && document.activeElement.blur());


// B: "New city" from the title menu opens a blank City Label in the frame (the add tag's card, the
// label's navy band): CITY NAME searches towns; a pick sets the centre; MAKE CITY.
async function createLabel(page, picked) {
  await addAt(page, [39.95, -75.16], 9);
  await page.evaluate(() => {
    const f = document.getElementById('addForm');
    f.querySelector('.tag').classList.add('cc-city');
    document.getElementById('addBand').hidden = false;
    document.querySelector('#addForm .route-line').style.display = 'none';
    document.getElementById('addNotesRow').style.display = 'none';
    document.querySelector('#addForm .add-type').style.display = 'none';
    document.querySelector('#addAddrRow .add-cap').textContent = 'Centre';
    document.querySelector('#addNameRow .add-cap').textContent = 'City name';
    const n = document.getElementById('nameInput'); n.style.textTransform = 'uppercase'; n.style.fontSize = '34px'; n.style.lineHeight = '36px'; n.style.color = 'var(--navy)';
  });
  await P.typeName(page, 'Philadelphia');
  // the line keeps its caption once written on (as B4's rename), so CITY NAME and CENTRE read as two lines
  await page.evaluate(() => { const r = document.getElementById('addNameRow'); r.insertAdjacentHTML('beforebegin', '<div class="cc-cap" id="ccNameCap">City name</div>');
    const res = document.getElementById('addResults'); res.style.setProperty('--res-top', (r.getBoundingClientRect().bottom - res.parentElement.getBoundingClientRect().top) + 'px'); });
  if (picked) { await P.pick(page, 0); await W(1500); await blur(page); }
  await page.evaluate(picked => {
    if (picked) {
      CC.hideResults(); CC.setName('Philadelphia');
      CC.addrShown('Philadelphia, Pennsylvania, United States', '', 'Centre');
      const pin = document.getElementById('addPin'); pin.className = 'is-dot';
      pin.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="6" fill="var(--paper-raised)"/><circle cx="7" cy="7" r="4" fill="var(--navy)"/></svg>';
      document.getElementById('addForm').classList.add('is-picked');
    }
    document.getElementById('addBand').hidden = false;
    document.querySelector('#addForm .tag-x').style.top = '58px';
    document.getElementById('addStub').innerHTML = picked
      ? '<span class="tag-slot" style="grid-column:1/4"><button type="button" class="tag-seg add-go is-ready"><span>Make city</span></button></span>'
      : '<span class="tag-slot" style="grid-column:1/4"><button type="button" class="tag-seg add-go"><span>Make city</span><span class="add-sub">Pick where it is, or just make it</span></button></span>';
  }, picked);
}

async function rental(page) {
  await addAt(page, PHL);
  await P.typeName(page, '1007 N Orange St Wilmington'); await P.pick(page, 0); await W(1500); await blur(page);
  await page.evaluate(() => { CC.setName('Rental, night 2'); CC.hideResults(); CC.addrShown('1007 North Orange Street · Wilmington'); });
}
const FRAMES = {
  // ---- today ----
  async 'T1-today'(page) {
    await addAt(page, PHL);
    await P.typeName(page, 'Longwood Gardens'); await P.pick(page, 0); await W(1500); await blur(page);
    await P.tap(page, '#addCityBtn');
  },
  // ---- shared: name and address are two lines, each searches ----
  async 'S1-address-search'(page) {
    await addAt(page, PHL);
    await page.evaluate(() => {
      document.getElementById('addCityName').innerHTML = '<span style="color:var(--ink-2);font-weight:500">City</span>';
      CC.addressTyping('1007 N Orange St, Wilmington', [['1007 North Orange Street', 'Address · Wilmington, United States'], ['North Orange Street', 'Street · Wilmington, United States']]);
    });
  },
  async 'S2-address-picked'(page) {
    await addAt(page, PHL);
    await P.typeName(page, '1007 N Orange St Wilmington'); await P.pick(page, 0); await W(1500); await blur(page);
    await page.evaluate(() => { CC.setName('Rental, night 2'); CC.hideResults(); CC.addrShown('1007 North Orange Street · Wilmington'); });
  },
  // ---- B: City Labels ----
  async 'B1-menu-name-a-city'(page) {
    await addAt(page, PHL);
    await P.typeName(page, '1007 N Orange St Wilmington'); await P.pick(page, 0); await W(1500); await blur(page);
    await page.evaluate(() => { CC.setName('Rental, night 2'); CC.hideResults(); CC.addrShown('1007 North Orange Street · Wilmington'); });
    await P.tap(page, '#addCityBtn');
    await page.evaluate(() => CC.cityMenuWithInput('Philadelphia'));
  },
  async 'B2-filed-under-new'(page) {
    await addAt(page, PHL);
    await P.typeName(page, '1007 N Orange St Wilmington'); await P.pick(page, 0); await W(1500); await blur(page);
    await page.evaluate(() => { CC.setName('Rental, night 2'); CC.hideResults(); CC.routeLine('Philadelphia', true); CC.addrShown('1007 North Orange Street · Wilmington', '≈ 40 km from Philadelphia'); });
  },
  async 'B3-label'(page) {
    await page.evaluate(() => { CC.seedPhilly(); CC.hideOnly(['la', 'reykjavik', 'copenhagen', 'malmo', 'stockholm']); goToCity('philadelphia'); }); await W(1200); await page.evaluate(() => map.setView(CC.PHL.center, 14, { animate: false })); await W(600);
    await page.evaluate(() => CC.openLabel(CC.PHL.center, CC.labelHtml({ name: 'Philadelphia', where: 'Pennsylvania, United States', fields: [['Places', '6'], ['Visited', '1'], ['Farthest', '≈ 150 km']], stub: CC.STUB_READ })));
    await W(1600);
  },
  async 'B4-rename'(page) {
    await page.evaluate(() => { CC.seedPhilly(); CC.hideOnly(['la', 'reykjavik', 'copenhagen', 'malmo', 'stockholm']); goToCity('philadelphia'); }); await W(1200); await page.evaluate(() => map.setView(CC.PHL.center, 14, { animate: false })); await W(600);
    await page.evaluate(() => CC.openLabel(CC.PHL.center, CC.labelHtml({ name: 'Philadelphia', stub: [{ t: 'Cancel', cls: 'cc-quiet' }, { t: '' , cls: 'cc-quiet' }, { t: 'Save', cls: 'cc-go' }],
      body: `<div class="cc-cap">City name</div><h2 class="tag-name cc-cityname cc-edit">Philly roadtrip<span class="cc-caret"></span></h2><div class="tag-addr">Centred on Philadelphia, Pennsylvania</div><div class="cc-help">The name is yours: a city here is a part of a trip, not a boundary. Its 6 places keep their addresses.</div><div style="height:12px"></div>` })));
    await W(1600);
  },
  async 'B5-move'(page) {
    await page.evaluate(() => { CC.seedPhilly(); CC.hideOnly(['la', 'reykjavik', 'copenhagen', 'malmo', 'stockholm']); goToCity('philadelphia'); }); await W(1200); await page.evaluate(() => map.setView(CC.PHL.center, 14, { animate: false })); await W(600);
    await page.evaluate(() => { map.setView([39.70, -75.35], 8, { animate: false }); }); await W(800);
    await page.evaluate(() => CC.moveMode('Philadelphia'));
  },
  async 'B6-delete'(page) {
    await page.evaluate(() => {
      CC.seedPhilly();
      CC.addCityRaw('eastmarl', { label: 'East Marlborough Township', center: [39.866, -75.655], zoom: 12, viewbox: '-75.75,39.83,-75.60,39.91' });
      // Longwood Gardens is the one place the app filed there
      locations = locations.map(l => l.id === 'phl03' ? { ...l, city: 'eastmarl' } : l); window.__ROWS.forEach(r => { if (r.id === 'phl03') r.city = 'eastmarl'; });
      CC.hideOnly(['la', 'reykjavik', 'copenhagen', 'malmo', 'stockholm']); goToCity('eastmarl');
    }); await W(1400);
    await page.evaluate(() => CC.openLabel([39.866, -75.655], CC.labelHtml({ name: 'East Marlborough Township', stub: [{ t: 'Cancel', cls: 'cc-quiet' }, { t: '', cls: 'cc-quiet' }, { t: 'Delete city', cls: 'cc-go' }],
      body: `<h2 class="tag-name" style="font-size:26px;line-height:28px">Delete East Marlborough Township?</h2>`
        + `<div class="cc-choices"><div class="cc-choice"><span class="cc-radio on"></span><span class="cc-lab">Move its 1 place to</span><button type="button" class="route-city"><span class="route-city-name">Philadelphia</span>${CC.ICO.chev}</button></div>`
        + `<div class="cc-choice"><span class="cc-radio"></span><span class="cc-lab">Delete the place too</span></div></div>` })));
    await W(1600);
  },
  async 'B7-title-new-city'(page) {
    await page.evaluate(() => { CC.unhideAll(); map.setView([39.95, -75.16], 10, { animate: false }); toggleSheetCollapsed(); }); await W(1200); await page.evaluate(() => map.invalidateSize()); await W(3000);
    await P.tap(page, '#titleBtn'); await W(300);
    await page.evaluate(() => CC.titleMenuNewCity());
  },
  // ---- A: Write on the line ----
  async 'A1-type-the-city'(page) {
    await rental(page);
    await P.tap(page, '#addCityBtn');
    await page.evaluate(() => {
      const b = document.getElementById('addCityBtn');
      b.setAttribute('aria-expanded', 'false'); b.style.background = 'var(--paper)'; b.style.boxShadow = 'inset 0 -1.5px 0 var(--navy)'; b.style.borderRadius = '0';
      document.getElementById('addCityName').innerHTML = '<span style="font-size:16px;letter-spacing:.06em">Philadelphia</span><span class="cc-caret"></span>';
      document.getElementById('addNewStamp').hidden = true;
      const m = document.getElementById('addCityMenu');
      m.innerHTML = '<div class="menu-cap">City</div><div class="menu-row" style="cursor:default"><span class="menu-ico"></span><span class="menu-lab" style="color:var(--ink-2);font-weight:500;text-transform:none;letter-spacing:0;font-stretch:100%;font-size:13px">None of your cities is called that</span></div>'
        + '<div class="menu-foot"><div class="menu-cap is-mid">New city</div>'
        + '<button type="button" class="menu-row" aria-checked="true">' + CC.ICO.plus + '<span class="menu-lab">Philadelphia</span><span class="menu-gap"></span><svg class="menu-end" viewBox="0 0 16 16"><path d="M3 7.75l3.2 3.2L13 4.05" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></button>'
        + '<button type="button" class="menu-row">' + CC.ICO.plus + '<span class="menu-lab">Wilmington</span><span class="menu-gap"></span><span class="menu-end" style="width:auto;font-size:11px;color:var(--ink-2);font-stretch:75%;letter-spacing:.08em;text-transform:uppercase">where it is</span></button></div>';
      m.style.height = 'auto'; m.style.maxHeight = 'none';
    });
  },
  async 'A2-edit-cities'(page) {
    await page.evaluate(() => { CC.seedPhilly(); CC.addCityRaw('eastmarl', { label: 'East Marlborough Township', center: [39.866, -75.655], zoom: 12 });
      locations = locations.map(l => l.id === 'phl03' ? { ...l, city: 'eastmarl' } : l); window.__ROWS.forEach(r => { if (r.id === 'phl03') r.city = 'eastmarl'; });
      CC.unhideAll(); map.setView([39.95, -75.16], 10, { animate: false }); toggleSheetCollapsed(); }); await W(1200); await page.evaluate(() => map.invalidateSize()); await W(3000);
    await P.tap(page, '#titleBtn'); await W(300);
    await page.evaluate(() => CC.titleMenuEdit());
    await page.evaluate(() => { document.getElementById('titleMenu').scrollTop = 0; });
  },
  async 'A3-delete-in-menu'(page) {
    await page.evaluate(() => { CC.seedPhilly(); CC.addCityRaw('eastmarl', { label: 'East Marlborough Township', center: [39.866, -75.655], zoom: 12 });
      locations = locations.map(l => l.id === 'phl03' ? { ...l, city: 'eastmarl' } : l); window.__ROWS.forEach(r => { if (r.id === 'phl03') r.city = 'eastmarl'; });
      CC.unhideAll(); map.setView([39.95, -75.16], 10, { animate: false }); toggleSheetCollapsed(); }); await W(1200); await page.evaluate(() => map.invalidateSize()); await W(3000);
    await P.tap(page, '#titleBtn'); await W(300);
    await page.evaluate(() => CC.titleMenuEdit('East Marl', `<div class="cc-expand"><div class="cc-q">Delete it? Its 1 place moves to <span class="route-city" style="margin:0;height:24px"><span class="route-city-name">Philadelphia</span>${CC.ICO.chev}</span></div><div class="cc-acts"><span class="cc-btn">Cancel</span><span class="cc-btn go">Delete</span></div></div>`));
  },
  // ---- C: The city you're in ----
  async 'C1-new-city-in-menu'(page) {
    await page.evaluate(() => { CC.unhideAll(); map.setView([39.95, -75.16], 10, { animate: false }); toggleSheetCollapsed(); }); await W(1200); await page.evaluate(() => map.invalidateSize()); await W(3000);
    await P.tap(page, '#titleBtn'); await W(300);
    await page.evaluate(() => CC.titleMenuNewCity('Philadelphia'));
  },
  async 'C2-working-city'(page) {
    await page.evaluate(() => { CC.seedPhilly(false); CC.unhideAll(); setActiveCity('philadelphia'); }); await W(1500);
    await page.evaluate(() => {
      const list = document.getElementById('locationsList');
      list.insertAdjacentHTML('afterbegin', `<div class="sec-head is-first"><h3 class="sec-title"><button type="button" class="sec-name"><span class="h-name">Philadelphia</span><span class="tally">0</span></button></h3><button type="button" class="sec-eye">${eyeSvg(false, '--paper')}</button></div>`
        + '<div class="cc-note">Nothing here yet. While you\'re in Philadelphia, what you add files here, wherever it is.</div>'
        + '<div class="plan-foot" role="group"><button type="button" class="plan-act">Rename</button><button type="button" class="plan-act">Move centre</button><button type="button" class="plan-act">Delete city…</button></div>');
      list.querySelectorAll('.sec-head.is-first').forEach((h, i) => { if (i > 0) h.classList.remove('is-first'); });
      list.scrollTop = 0;
      const t = document.querySelector('#titleBtn .title-text'); if (t) t.innerHTML = '<span class="h-name">Philadelphia</span><span class="tally">0</span>';
    });
  },
  async 'C3-far-stop-files-here'(page) {
    await page.evaluate(() => { CC.seedPhilly(); CC.hideOnly(['la', 'reykjavik', 'copenhagen', 'malmo', 'stockholm']); goToCity('philadelphia'); }); await W(1500);
    await P.openAdd(page);
    await P.typeName(page, 'Cape Henlopen State Park'); await P.pick(page, 0); await W(1500); await blur(page);
    await page.evaluate(() => { CC.hideResults(); CC.routeLine('Philadelphia', false); CC.addrShown('Cape Henlopen Drive · Lewes', '≈ 130 km from Philadelphia'); });
  },
  async 'B8-create-search'(page) { await createLabel(page, false); },
  async 'B9-create-ready'(page) { await createLabel(page, true); },
};

(async () => {
  const only = process.argv[2] || '';
  const b = await P.lib.launch();
  for (const [name, fn] of Object.entries(FRAMES)) {
    if (only && !name.startsWith(only)) continue;
    const o = await open(b, { storage: STORAGE });
    try { await fn(o.page); await W(500); await o.page.screenshot({ path: path.join(OUT, name + '.png') }); console.log('shot', name, o.errors.length ? o.errors : ''); }
    catch (e) { console.log('FAIL', name, e.message); }
    await o.page.context().close();
  }
  await b.close();
})();
