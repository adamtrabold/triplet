// Phase 2 (the add tag) functional checks, Chromium, on the gesture harness's stub with live search
// served from real Nominatim responses (fixtures/). Prints PASS/FAIL per case and "addtest p/n".
//   node design/add-tag-jam/p2/addtest.js [index.html]
const path = require('path');
const P = require('./lib-p2.js');
const { W } = P;
(async () => {
  const file = path.resolve(process.argv[2] || path.join(__dirname, '../../../index.html'));
  const b = await P.lib.launch();
  const { rec, finish } = P.lib.recorder('addtest');
  const ok = (name, pass, detail) => rec('p2', name, pass, detail);
  let o = await P.openP2(b, { file });
  let page = o.page;
  const ev = (f, a) => page.evaluate(f, a);
  const reset = async () => { await ev(() => { if (addFormOpen()) cancelAddForm(); clearAddDraft(); }); await W(450); };

  // A. the search is worldwide: no suffix, no countrycodes, never bounded; the map's view is a soft hint
  await P.openAdd(page);
  ok('A1 the tag opens (blank, the wash on, NAME focused)', await ev(() => !document.getElementById('addForm').hidden && document.getElementById('addWash').classList.contains('is-on') && document.activeElement.id === 'nameInput'));
  ok('A2 the + hides while adding', await ev(() => getComputedStyle(document.getElementById('floatingAddBtn')).visibility === 'hidden'));
  ok('A3 the pre-pick line is the map centre\'s city', await ev(() => document.getElementById('addCityName').textContent === 'Reykjavík'));
  await P.typeName(page, 'Tivoli');
  await page.waitForFunction(() => /Tivoli Gardens/.test(document.getElementById('addResults').textContent), null, { timeout: 8000 }).catch(() => {});
  const q = new URL(o.requests.find(u => u.includes('q=Tivoli') && !u.includes('bounded')));
  ok('A4 the search: no countrycodes, no bounded, no suffix, the view as a viewbox, English', !q.searchParams.get('countrycodes') && !q.searchParams.get('bounded') && q.searchParams.get('q') === 'Tivoli' && !!q.searchParams.get('viewbox') && q.searchParams.get('accept-language') === 'en', q.search);
  const rows = await ev(() => [...document.querySelectorAll('#addResults .add-res')].map(r => [r.querySelector('.add-res-name').textContent, r.querySelector('.add-res-where').textContent]));
  ok('A5 each row says where: "type · Town, Country", in English', rows.length >= 5 && rows.every(([n, w]) => n && / · .+, .+/.test(w)) && rows.some(([, w]) => /Denmark/.test(w)), rows);
  const quiet = o.requests.filter(u => u.includes('q=Tivoli') && u.includes('bounded=1')).map(u => new URL(u).searchParams.get('viewbox'));
  ok('A6 nothing near your cities: one quiet bounded search per other region (LA; Copenhagen+Malmö+Stockholm), not the view\'s own', JSON.stringify(quiet.sort()) === JSON.stringify(['-118.668,33.704,-118.155,34.337', '12.450,55.530,18.220,59.420']), quiet);
  ok('A7 ... and Copenhagen\'s Tivoli Gardens is found and ranked first (near one of your cities)', rows[0] && rows[0][0] === 'Tivoli Gardens' && /Copenhagen, Denmark/.test(rows[0][1]), rows.slice(0, 3));
  await P.typeName(page, 'Noma');
  await page.waitForFunction(() => /Restaurant · Copenhagen/.test(document.getElementById('addResults').textContent), null, { timeout: 8000 }).catch(() => {});
  ok('A8 "Noma" from the Reykjavík view finds the Copenhagen restaurant, first', await ev(() => { const r = document.querySelector('#addResults .add-res'); return !!r && r.querySelector('.add-res-name').textContent === 'Noma' && /Restaurant · Copenhagen/.test(r.textContent); }), await ev(() => document.getElementById('addResults').textContent.slice(0, 200)));
  await P.typeName(page, 'Harpa');
  ok('A9b result kinds are plain words, never OSM codes', await ev(() => { const t = document.getElementById('addResults').textContent; return !/Administrative|Hamlet|Building|\bYes\b|Place of worship|Bus_stop/.test(t); }) &&
    await ev(() => [['place', 'hamlet'], ['boundary', 'administrative', 'town'], ['building', 'yes'], ['highway', 'bus_stop'], ['highway', 'residential'], ['amenity', 'place_of_worship'], ['leisure', 'sports_centre'], ['tourism', 'attraction'], ['shop', 'yes']]
      .map(([k, v, at]) => resultKind({ class: k, type: v, addresstype: at || '' })).join('|')) === 'Village|Town|Address|Bus stop|Street|Church|Sports centre|Sight|Place');
  ok('A9 a near result needs no quiet search', !o.requests.some(u => u.includes('q=Harpa') && u.includes('bounded=1')));
  ok('A10 ranking inside a tier: importance first; same name + kind within 50 m merged', await ev(() => {
    const R = (name, cls, type, lat, lon, imp, id) => ({ name, class: cls, type, lat: String(lat), lon: String(lon), importance: imp, osm_type: 'node', osm_id: id, address: {} });
    const out = rankSearchResults([R('Harpa', 'highway', 'bus_stop', 64.1503, -21.9330, 0.0001, 1), R('Harpa', 'highway', 'bus_stop', 64.15045, -21.9331, 0.0001, 2), R('Harpa', 'amenity', 'theatre', 64.1504, -21.9325, 0.36, 3)]);
    return out.length === 2 && out[0].type === 'theatre' && out[1].type === 'bus_stop'; }));

  // B. the OSM pair -> TYPE table
  const map = await ev(() => [['leisure', 'sports_centre'], ['amenity', 'cafe'], ['shop', 'bakery'], ['place', 'suburb'], ['place', 'neighbourhood'], ['highway', 'pedestrian'], ['highway', 'bus_stop'], ['tourism', 'viewpoint'], ['amenity', 'bank'], ['', ''], ['natural', 'waterfall'], ['shop', 'books'], ['amenity', 'place_of_worship'], ['tourism', 'hostel'], ['aeroway', 'aerodrome'],
    ['water', 'lake'], ['natural', 'hot_spring'], ['leisure', 'resort'], ['leisure', 'beach_resort'], ['amenity', 'public_bath'], ['leisure', 'sauna'], ['building', 'yes']].map(([k, v]) => osmToType(k, v)));
  ok('B1 the table (jam Turn 11 + water, hot springs, resorts, baths)', JSON.stringify(map) === JSON.stringify(['attraction', 'cafe', 'cafe', 'district', 'district', 'street', null, 'nature', null, null, 'nature', 'shopping', 'attraction', 'hotel', 'other',
    'nature', 'nature', 'attraction', 'attraction', 'attraction', 'attraction', null]), map);
  ok('B2 boundary=administrative below city level -> district', await ev(() => osmToType('boundary', 'administrative', 'neighbourhood') === 'district' && osmToType('boundary', 'administrative', 'city') === null));

  // C. a pick: the map jumps under the wash, the pin stands on the place, TYPE detected, city guessed
  await P.typeName(page, 'Sundhöllin'); await P.pick(page, 0);
  const c = await ev(() => {
    const pin = document.getElementById('addPin').getBoundingClientRect(), mr = map.getContainer().getBoundingClientRect();
    const pt = map.latLngToContainerPoint([addDraft.pick.lat, addDraft.pick.lng]);
    return { type: addDraft.type, city: addDraft.city, wash: document.getElementById('addWash').classList.contains('is-on'), dx: Math.abs(pin.left + 16 - mr.left - pt.x), dy: Math.abs(pin.top + 16 - mr.top - pt.y), z: map.getZoom(),
      addr: document.getElementById('addAddr').textContent, ready: document.getElementById('submitBtn').classList.contains('is-ready'), dist: document.getElementById('addDist').hidden };
  });
  ok('C1 TYPE detected Attraction (leisure=sports_centre)', c.type === 'attraction', c);
  ok('C2 city guessed Reykjavík', c.city && c.city.id === 'reykjavik', c);
  ok('C3 the wash lifted', !c.wash, c);
  ok('C4 the place sits under the pin (<= 1px)', c.dx <= 1 && c.dy <= 1, c);
  ok('C5 zoom at least 16', c.z >= 16, c);
  ok('C6 address = the short address; ADD ready; no distance note inside the city', c.addr === 'Barónsstígur 45A · Miðborg' && c.ready && c.dist, c);
  // a zoom from the control keeps the place under the pin
  await ev(() => map.zoomOut(1, { animate: false })); await W(200);
  const z2 = await ev(() => { const pin = document.getElementById('addPin').getBoundingClientRect(), mr = map.getContainer().getBoundingClientRect(), pt = map.latLngToContainerPoint([addDraft.pick.lat, addDraft.pick.lng]); return Math.hypot(pin.left + 16 - mr.left - pt.x, pin.top + 16 - mr.top - pt.y); });
  ok('C7 zooming keeps the place under the pin', z2 <= 1, z2);

  // D. hand picks win; editing NAME keeps the pick (and City and TYPE); the typed name is saved
  await P.tap(page, '#addTypeBtn');
  ok('D1 TYPE menu: caption Type, 11 rows, the check on Attraction', await ev(() => { const m = document.getElementById('addTypeMenu'); return !m.hidden && m.querySelector('.menu-cap').textContent === 'Type' && m.querySelectorAll('.menu-row').length === 11 && m.querySelector('[aria-checked="true"]').dataset.type === 'attraction'; }));
  ok('D2 the menu opens 6px under its trigger, left-aligned, sliding up only as far as the list bar needs', await ev(() => { const t = document.getElementById('addTypeBtn').getBoundingClientRect(), el = document.getElementById('addTypeMenu'), m = el.getBoundingClientRect();
    const floor = Math.min(innerHeight, document.getElementById('locations').getBoundingClientRect().top) - 8, want = Math.max(addOpenArea().top, Math.min(t.bottom + 6, floor - el.scrollHeight - 2));
    return Math.abs(m.left - t.left) < 0.5 && Math.abs(m.top - want) <= 1; }), await ev(() => [document.getElementById('addTypeBtn').getBoundingClientRect().bottom, document.getElementById('addTypeMenu').getBoundingClientRect().top]));
  await ev(() => document.querySelector('#addTypeMenu [data-type="nature"]').click()); await W(150);
  await P.tap(page, '#addCityBtn');
  ok('D3 City menu: caption City, your cities, the pin glyph + check on the current one', await ev(() => { const m = document.getElementById('addCityMenu'); const cur = m.querySelector('[aria-checked="true"]'); return !m.hidden && m.querySelector('.menu-cap').textContent === 'City' && cur.dataset.city === 'reykjavik' && !!cur.querySelector('svg.menu-ico') && m.querySelectorAll('[data-city]').length === 5; }));
  ok('D4 the city button is open (navy, aria-expanded)', await ev(() => document.getElementById('addCityBtn').getAttribute('aria-expanded') === 'true' && getComputedStyle(document.getElementById('addCityBtn')).backgroundColor === 'rgb(18, 41, 63)'));
  await ev(() => document.querySelector('#addCityMenu [data-city="copenhagen"]').click()); await W(150);
  const before = await ev(() => map.getCenter());
  await ev(() => { const i = document.getElementById('nameInput'); i.value = 'Sundhöll'; i.dispatchEvent(new Event('input', { bubbles: true })); }); await W(250);
  const d = await ev(() => ({ pick: addDraft.pick, city: addDraft.city, type: addDraft.type, wash: document.getElementById('addWash').classList.contains('is-on'), pin: getComputedStyle(document.getElementById('addPin')).display, addr: document.getElementById('addAddr').textContent, c: map.getCenter() }));
  ok('D5 editing NAME keeps the pick (place, address, OSM pair), the wash off, the map still', !!d.pick && d.pick.osmValue === 'sports_centre' && !d.wash && d.addr === 'Barónsstígur 45A · Miðborg' && Math.abs(d.c.lat - before.lat) < 1e-9, d);
  ok('D6 City and TYPE stay as last set by hand', d.city.id === 'copenhagen' && d.type === 'nature', d);
  ok('D6b typing re-runs the results only', await ev(() => !document.getElementById('addResults').hidden || true) && o.requests.some(u => u.includes('q=Sundh%C3%B6ll&') || u.includes('q=Sundh%C3%B6ll')));
  await ev(() => { hideAutocomplete(); const i = document.getElementById('nameInput'); i.value = 'Sundhöllin'; i.dispatchEvent(new Event('input', { bubbles: true })); hideAutocomplete(); window.__ins = []; document.getElementById('submitBtn').click(); }); await W(1400);
  ok('D7 W1: the place saves under my own name ("Sundhöllin"), at the picked place, as set', await ev(() => { const r = window.__ins.find(x => x[0] === 'locations'); return !!r && r[1][0].name === 'Sundhöllin' && Math.abs(r[1][0].lat - 64.14167) < 1e-3 && r[1][0].city === 'copenhagen' && r[1][0].category === 'nature' && r[1][0].address.startsWith('Sundhöll Reykjavíkur'); }), await ev(() => window.__ins));
  await ev(() => map.closePopup()); await W(400);
  await P.openAdd(page);
  await ev(() => { document.getElementById('addTypeBtn').click(); document.querySelector('#addTypeMenu [data-type="nature"]').click(); document.getElementById('addCityBtn').click(); document.querySelector('#addCityMenu [data-city="copenhagen"]').click(); });
  await P.typeName(page, 'Hallgrímskirkja'); await P.pick(page, 0);
  ok('D8 a hand pick stays a hand pick (a pick re-guesses neither)', await ev(() => addDraft.city.id === 'copenhagen' && addDraft.type === 'nature'));
  await reset();

  // W. W2: pasted addresses
  await P.openAdd(page); await P.typeName(page, 'Laugavegur 18, Reykjavík');
  ok('W1 an unnamed address hit is named from its street and number ("Laugavegur 18"), never "18"', await ev(() => { const n = [...document.querySelectorAll('#addResults .add-res-name')].map(e => e.textContent); return n.includes('Laugavegur 18') && !n.includes('18'); }));
  await ev(() => { const i = [...document.querySelectorAll('#addResults .add-res-name')].findIndex(e => e.textContent === 'Laugavegur 18'); document.querySelectorAll('#addResults .add-res')[i].click(); }); await W(400);
  ok('W2 ... the pick: name Laugavegur 18, TYPE Other (not Street, not the old default)', await ev(() => document.getElementById('nameInput').value === 'Laugavegur 18' && addDraft.type === 'other'), await ev(() => [document.getElementById('nameInput').value, addDraft.type]));
  await P.typeName(page, 'Vesterbrogade 10');
  ok('W3 "Vesterbrogade 10" rows read "Vesterbrogade 10"', await ev(() => [...document.querySelectorAll('#addResults .add-res-name')].every(e => e.textContent === 'Vesterbrogade 10')));
  await P.typeName(page, 'Grettisgata 20');
  await ev(() => { const i = [...document.querySelectorAll('#addResults .add-res')].findIndex(r => /^Grettisgata$/.test(r.querySelector('.add-res-name').textContent)); document.querySelectorAll('#addResults .add-res')[i].click(); }); await W(400);
  ok('W4 a street found for a typed house number is not auto-typed Street', await ev(() => addDraft.type !== 'street' && addDraft.type === 'other'), await ev(() => addDraft.type));
  ok('W5 a pick the table doesn\'t know resets an untouched TYPE to Other', await ev(() => { const r = { name: 'X', class: 'office', type: 'company', lat: '64.14', lon: '-21.94', address: {} }; return osmToType('office', 'company') === null; }) && await ev(() => addDraft.type === 'other'));
  await reset();
  ok('W6 the real town, not an admin unit', await ev(() => townOf({ city: 'Malmö kommun', town: 'Limhamn' }) === 'Limhamn' && townOf({ city: 'Reykjavik' }) === 'Reykjavik' && townOf({ municipality: 'Grindavíkurbær' }) === '' && townOf({ town: 'Town of Red Hook', village: 'Village of Tivoli' }) === ''));
  await reset();

  // E. the distance note and the city menu's New city
  await P.openAdd(page); await P.typeName(page, 'Blue Lagoon'); await P.pick(page, 0);
  ok('E1 outside the city\'s area: "≈ 40 km from Reykjavík"', await ev(() => !document.getElementById('addDist').hidden && document.getElementById('addDist').textContent === '≈ 40 km from Reykjavík'), await ev(() => document.getElementById('addDist').textContent));
  ok('E1b the Blue Lagoon (water=lake) is Nature now; the note describes the city button', await ev(() => addDraft.type === 'nature' && document.getElementById('addCityBtn').getAttribute('aria-describedby') === 'addDist'));
  ok('E1c TYPE button name: "Type: Nature…"', await ev(() => /^Type: Nature/.test(document.getElementById('addTypeBtn').getAttribute('aria-label'))));
  const e2 = await ev(() => { const p = addDraft.pick, save = { ...p }, vb = CITIES.reykjavik.viewbox, out = [];
    CITIES.reykjavik.viewbox = '-21.95,64.14,-21.94,64.15';
    [[64.1466, -21.80], [64.1466, -21.50], [64.1466, -21.9426]].forEach(([la, ln]) => { Object.assign(addDraft.pick, { lat: la, lng: ln }); out.push(addDistanceText()); });
    CITIES.reykjavik.viewbox = vb; Object.assign(addDraft.pick, save); return out; });
  ok('E2 rounding: under 10 km to the km, else to 5; inside the area, none', JSON.stringify(e2) === JSON.stringify(['≈ 7 km from Reykjavík', '≈ 20 km from Reykjavík', '']), e2);
  await P.tap(page, '#addCityBtn');
  ok('E3 City menu: "New city" caption and "+ Grindavík"', await ev(() => { const m = document.getElementById('addCityMenu'); return m.querySelector('.menu-cap.is-mid').textContent === 'New city' && m.querySelector('[data-newcity]').textContent.includes('+ Grindavík'); }));
  await ev(() => document.querySelector('#addCityMenu [data-newcity]').click()); await W(150);
  ok('E4 picking it: the line reads Grindavík with the NEW stamp, no distance note', await ev(() => document.getElementById('addCityName').textContent === 'Grindavík' && !document.getElementById('addNewStamp').hidden && document.getElementById('addDist').hidden));
  ok('E5 the city changed on the tag: the pin did not move', await ev(() => { const pin = document.getElementById('addPin').getBoundingClientRect(), mr = map.getContainer().getBoundingClientRect(), pt = map.latLngToContainerPoint([addDraft.pick.lat, addDraft.pick.lng]); return Math.hypot(pin.left + 16 - mr.left - pt.x, pin.top + 16 - mr.top - pt.y) <= 1; }));
  await reset();

  // F. ADD: a NEW city (addCity() first, then the insert, visited + starred written)
  await ev(() => { window.__ins = []; });
  await P.openAdd(page); await P.typeName(page, 'Jönköpings läns museum'); await P.pick(page, 0);
  ok('F1 a pick outside every city: NEW-stamped Jönköping; the city button says "new city"', await ev(() => addCityIsNew() && document.getElementById('addCityName').textContent === 'Jönköping' && !document.getElementById('addNewStamp').hidden && /new city/.test(document.getElementById('addCityBtn').getAttribute('aria-label'))));
  await ev(() => { document.querySelector('#addStub .popup-star').click(); }); await W(300);
  await ev(() => { document.querySelector('#addStub .popup-visited').click(); }); await W(500);
  ok('F2 Star prints the band; Mark visited shows the stamp', await ev(() => !document.getElementById('addBand').hidden && !!document.querySelector('#addStub .popup-visited .row-stamp') && document.querySelector('#addStub .popup-star').getAttribute('aria-pressed') === 'true'));
  await ev(() => { const n = document.getElementById('notesInput'); n.value = 'Castle grounds.'; n.dispatchEvent(new Event('input', { bubbles: true })); });
  await ev(() => document.getElementById('submitBtn').click()); await W(1500);
  const f = await ev(() => ({ ins: window.__ins, open: addFormOpen(), city: CITIES['jonkoping'] }));
  const order = f.ins.map(x => x[0]);
  ok('F3 ADD made the city first, then inserted', JSON.stringify(order) === JSON.stringify(['cities', 'locations']), order);
  const row = (f.ins.find(x => x[0] === 'locations') || [0, [{}]])[1][0];
  ok('F4 the insert: city jonkoping, visited + starred, category, notes, short address', row.city === 'jonkoping' && row.visited === true && row.starred === true && row.category === 'attraction' && row.notes === 'Castle grounds.' && row.short_address === 'Slottsgatan 2 · Kålgården', row);
  ok('F5 the tag closed; the city is in CITIES', !f.open && !!f.city, f);
  await W(800);
  ok('F6 the new place\'s own tag opened', await ev(() => tagOpenNow() && map._popup.getContent().includes('Jönköpings läns museum')));
  ok('F7 the draft cleared (a fresh + is blank)', await ev(() => !addDraft.pick && !addDraft.starred && !addDraft.visited && document.getElementById('nameInput').value === ''));
  await ev(() => map.closePopup()); await W(400);

  // G. failures: addCity fails -> nothing inserted; the insert fails -> the draft stays, the error line
  await P.openAdd(page); await P.typeName(page, 'Blue Lagoon');
  await ev(() => { const i = [...document.querySelectorAll('#addResults .add-res')].findIndex(r => /Malta/.test(r.textContent)); document.querySelectorAll('#addResults .add-res')[i].click(); }); await W(400);
  await ev(() => { window.__ins = []; window.__failNext = 'cities'; document.getElementById('submitBtn').click(); }); await W(1200);
  ok('G1 addCity fails: no insert, the tag stays with the error line, the draft kept', await ev(() => window.__ins.length === 0 && addFormOpen() && !document.getElementById('addErr').hidden && !!addDraft.pick && addCityIsNew()), await ev(() => ({ ins: window.__ins, err: document.getElementById('addErr').textContent })));
  await reset();
  await P.openAdd(page); await P.typeName(page, 'Sundhöllin'); await P.pick(page, 0);
  await ev(() => { window.__ins = []; window.__failNext = 'locations'; document.getElementById('submitBtn').click(); }); await W(1000);
  ok('G2 the insert fails: the tag stays, "Couldn\'t save", ADD ready again', await ev(() => addFormOpen() && /Couldn.t save/.test(document.getElementById('addErr').textContent) && document.getElementById('submitBtn').classList.contains('is-ready') && !!addDraft.pick));
  await ev(() => document.getElementById('submitBtn').click()); await W(1200);
  ok('G3 ADD again saves it, filed under Reykjavík, visited false', await ev(() => { const r = window.__ins.find(x => x[0] === 'locations'); return !!r && r[1][0].city === 'reykjavik' && r[1][0].visited === false && !addFormOpen(); }));
  await ev(() => map.closePopup()); await W(400);

  // H. a neighbourhood -> District: the shape flow (outline from the pick's own OSM object)
  await P.openAdd(page); await P.typeName(page, 'Sund');
  await ev(() => { const i = [...document.querySelectorAll('#addResults .add-res')].findIndex(r => /District · Reykjavik/.test(r.textContent)); document.querySelectorAll('#addResults .add-res')[i].click(); }); await W(400);
  ok('H1 Sund (boundary=administrative, neighbourhood) -> District; the address line says where ("Reykjavik, Iceland"), never a sentence', await ev(() => addDraft.type === 'district' && document.getElementById('addAddr').textContent === 'Reykjavik, Iceland'), await ev(() => document.getElementById('addAddr').textContent));
  ok('H1d a District hangs from the 14px shape dot, not the pin', await ev(() => { const p = document.getElementById('addPin'); return p.classList.contains('is-dot') && p.getBoundingClientRect().width === 14 && !p.querySelector('use'); }));
  await W(300);
  ok('H1b the District\'s outline shows before ADD (TypeDetected)', await ev(() => !!addOutlineLayer && map.hasLayer(addOutlineLayer) && addOutlineLayer.getLatLngs()[0].length > 10));
  await ev(() => { document.getElementById('addTypeBtn').click(); document.querySelector('#addTypeMenu [data-type="cafe"]').click(); });
  ok('H1c TYPE off District: the outline goes; back on: it returns', await ev(() => !addOutlineLayer) && await ev(() => { document.getElementById('addTypeBtn').click(); document.querySelector('#addTypeMenu [data-type="district"]').click(); return !!addOutlineLayer; }));
  await ev(() => { window.__ins = []; document.querySelector('#addStub .popup-visited').click(); }); await W(500);
  await ev(() => document.getElementById('submitBtn').click()); await W(1500);
  const h = await ev(() => window.__ins.find(x => x[0] === 'neighborhood_shapes'));
  ok('H2 the shape insert: type district, the looked-up outline, visited true, city reykjavik', !!h && h[1][0].type === 'district' && h[1][0].geometry.length > 10 && h[1][0].visited === true && h[1][0].city === 'reykjavik', h && { ...h[1][0], geometry: h[1][0].geometry.length });
  ok('H3 the outline came from one Nominatim lookup by OSM id (at the pick), reused at ADD', o.requests.filter(u => u.includes('/lookup') && u.includes('R2583102')).length === 1);
  await ev(() => map.closePopup()); await W(400);

  // I. cancel: the map view comes back, the draft is kept, Esc closes a menu first then the tag
  await W(800);
  await P.openAdd(page);
  const v0 = await ev(() => ({ c: addView.center, z: addView.zoom }));
  await P.typeName(page, 'Hallgrímskirkja'); await P.pick(page, 0);
  await P.tap(page, '#addTypeBtn');
  await page.keyboard.press('Escape'); await W(150);
  ok('I1 Esc closes the open menu, not the tag', await ev(() => document.getElementById('addTypeMenu').hidden && addFormOpen()));
  await page.keyboard.press('Escape'); await W(500);
  const v1 = await ev(() => ({ c: map.getCenter(), z: map.getZoom(), open: addFormOpen(), pick: !!addDraft.pick }));
  ok('I2 Esc cancels: the map view is back, the draft kept', !v1.open && v1.pick && v1.z === v0.z && Math.abs(v1.c.lat - v0.c.lat) < 1e-6, { v0, v1 });
  await P.openAdd(page);
  ok('I3 + again: the kept pick hangs, the place under the pin', await ev(() => { const pin = document.getElementById('addPin').getBoundingClientRect(), mr = map.getContainer().getBoundingClientRect(), pt = map.latLngToContainerPoint([addDraft.pick.lat, addDraft.pick.lng]); return document.getElementById('nameInput').value === 'Hallgrímskirkja' && Math.hypot(pin.left + 16 - mr.left - pt.x, pin.top + 16 - mr.top - pt.y) <= 1; }));
  await ev(() => document.getElementById('addCancel').click()); await W(400);
  ok('I4 the x cancels', await ev(() => !addFormOpen()));

  // J. one height: the blank and the picked tag are the same height (no note, one-line name)
  await reset();
  await P.openAdd(page);
  const hBlank = await ev(() => document.querySelector('#addForm .tag-body').offsetHeight);
  await P.typeName(page, 'Hallgrímskirkja'); await P.pick(page, 0);
  const hPicked = await ev(() => document.querySelector('#addForm .tag-body').offsetHeight);
  ok('J1 the card is one height from blank to picked', hBlank === hPicked, { hBlank, hPicked });
  ok('J2 targets: city line, TYPE, results rows >= 44 / 48', await ev(() => { const hit = el => { const r = el.getBoundingClientRect(), s = getComputedStyle(el, '::before'); return r.height - parseFloat(s.top) - parseFloat(s.bottom); }; return hit(document.getElementById('addCityBtn')) >= 44 && hit(document.getElementById('addTypeBtn')) >= 44; }));
  ok('J3 the tag clears the credit and the top controls', await ev(() => { const t = document.querySelector('#addForm .tag-body').getBoundingClientRect(), cr = document.querySelector('.leaflet-control-attribution').getBoundingClientRect(), pin = document.getElementById('addPin').getBoundingClientRect(), z = document.querySelector('.leaflet-control-zoom').getBoundingClientRect(); return t.bottom <= cr.top && pin.top >= z.bottom; }));

  // N. ADD's line, the TYPE trigger, the menu's fit (phase 2 fixes)
  await reset(); await P.openAdd(page);
  const hint = () => ev(() => { const b = document.getElementById('submitBtn'), sub = b.querySelector('.add-sub'); return [b.classList.contains('is-ready'), sub ? sub.textContent : null]; });
  const n1 = await hint();
  await ev(() => { const i = document.getElementById('nameInput'); i.value = 'Somewhere'; i.dispatchEvent(new Event('input', { bubbles: true })); hideAutocomplete(); });
  const n2 = await hint();
  await P.typeName(page, 'Hallgrímskirkja'); await P.pick(page, 0);
  const n3 = await hint();
  ok('N1 ADD\'s line: "Name it first" -> "Pick a place" -> ready, no line', JSON.stringify([n1, n2, n3]) === JSON.stringify([[false, 'Name it first'], [false, 'Pick a place'], [true, null]]), [n1, n2, n3]);
  ok('N2 the TYPE trigger is the city button\'s voice: no box, no badge, navy caps', await ev(() => { const b = document.getElementById('addTypeBtn'), cs = getComputedStyle(b); return parseFloat(cs.borderTopWidth) === 0 && !b.querySelector('.menu-badge, svg circle') && cs.color === 'rgb(18, 41, 63)' && b.getBoundingClientRect().height === 28; }));
  for (const [w, h] of [[390, 844], [375, 667]]) {
    await page.setViewportSize({ width: w, height: h }); await W(500);
    await P.tap(page, '#addTypeBtn');
    const fit = await ev(() => { const m = document.getElementById('addTypeMenu').getBoundingClientRect(), sheet = document.getElementById('locations').getBoundingClientRect().top;
      return { top: m.top, bottom: m.bottom, ceil: addOpenArea().top, floor: Math.min(innerHeight, sheet) - 8, scrolls: document.getElementById('addTypeMenu').scrollHeight > document.getElementById('addTypeMenu').clientHeight + 1 }; });
    ok(`N3 the TYPE menu sits between the top controls and 8px above the list bar at ${w}x${h}${w === 390 ? ', all 11 rows, no scroll' : ''}`, fit.top >= fit.ceil - 0.5 && fit.bottom <= fit.floor + 0.5 && (w !== 390 || !fit.scrolls), fit);
    await ev(() => closeAddMenus(false)); await W(150);
  }
  await page.setViewportSize({ width: 390, height: 844 }); await W(400);

  // K. the menus re-fit to the visible viewport
  await reset(); await P.openAdd(page); await P.tap(page, '#addTypeBtn');
  const mh0 = await ev(() => parseFloat(document.getElementById('addTypeMenu').style.maxHeight));
  await page.setViewportSize({ width: 390, height: 560 }); await W(400);
  const mh1 = await ev(() => parseFloat(document.getElementById('addTypeMenu').style.maxHeight));
  const inBox = await ev(() => { const m = document.getElementById('addTypeMenu').getBoundingClientRect(); return m.top >= addOpenArea().top - 0.5 && m.bottom <= Math.min(innerHeight, document.getElementById('locations').getBoundingClientRect().top) - 8 + 0.5; });
  ok('K1 the open menu re-fits on a viewport change (shorter, still between the controls and the list bar, still open)', mh1 < mh0 && inBox && await ev(() => !document.getElementById('addTypeMenu').hidden), { mh0, mh1, inBox });
  await page.setViewportSize({ width: 390, height: 844 }); await W(300);
  await ev(() => closeAddMenus(false));
  ok('L1 every Nominatim request asks for English', o.requests.every(u => new URL(u).searchParams.get('accept-language') === 'en'), o.requests.filter(u => !u.includes('accept-language')));
  ok('Z no page errors', o.errors.length === 0, o.errors);
  finish();
  await b.close();
})();
