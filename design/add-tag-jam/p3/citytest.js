// Phase 3 (the city-bucket model) functional checks, Chromium, on the gesture harness's stub with
// the phase 2 search fixtures (../p2/fixtures/). Prints PASS/FAIL per case and "citytest p/n".
//   node design/add-tag-jam/p3/citytest.js [index.html]
// Covers: the guess (CITY_REACH_KM, the real town as a NEW city, reverse geocode, the nearest
// anywhere); the Hanging Tag's routing line + distance note; its city menu; setPlaceCity()'s write,
// optimistic move and per-write rollback (a stubbed update failure); "+ town" (addCity() first);
// the orphan cleanup; a district's move; signed out (the slip); Esc; the poll held mid-write.
const path = require('path');
const P = require('../p2/lib-p2.js');
const { W } = P;
const sh = require('./lib-p3.js');
(async () => {
  const file = path.resolve(process.argv[2] || path.join(__dirname, '../../../index.html'));
  const b = await P.lib.launch();
  const { rec, finish } = P.lib.recorder('citytest');
  const ok = (name, pass, detail) => rec('p3', name, pass, detail);
  const o = await P.openP2(b, { file });
  const page = o.page;
  const ev = (f, a) => page.evaluate(f, a);
  await sh.install(page);

  // A. the guess
  const g = await ev(() => ({
    lagoon: guessCity(63.8804, -22.4495, { town: 'Grindavík', country_code: 'is' }),          // ~40 km from Reykjavík's centre
    gunnuhver: guessCity(63.8194, -22.6842, { town: 'Reykjanesbær', country_code: 'is' }),    // ~50 km
    vik: guessCity(63.4186, -19.0060, { village: 'Vík', country_code: 'is', country: 'Iceland' }),   // ~140 km: none in reach
    lund: guessCity(55.7047, 13.1910, { city: 'Lund', country_code: 'se' }),                  // 12 km from Malmö
    sameName: (() => { CITIES.vik = { label: 'Vík', center: [10, 10], zoom: 12, viewbox: '9,9,11,11' }; const r = guessCity(63.4186, -19.0060, { village: 'Vík', country_code: 'is' }); delete CITIES.vik; return r; })(),
    noTown: guessCity(63.4186, -19.0060, { county: 'Mýrdalshreppur', country_code: 'is' }),
    reach: CITY_REACH_KM,
  }));
  ok('A1 within CITY_REACH_KM (70) of a stored centre: that city (Blue Lagoon ~40 km, Gunnuhver ~50 km -> Reykjavík)', g.reach === 70 && g.lagoon.id === 'reykjavik' && g.gunnuhver.id === 'reykjavik', g);
  ok('A2 the nearest centre wins (Lund -> Malmö, not Copenhagen)', g.lund.id === 'malmo', g.lund);
  ok('A3 none in reach: the real town as a NEW city', g.vik.newCity && g.vik.newCity.label === 'Vík', g.vik);
  ok('A4 none in reach, a city of that name exists: that city, never a duplicate', g.sameName.id === 'vik', g.sameName);
  ok('A5 no town in the details: null (the caller reverse-geocodes)', g.noTown === null, g.noTown);
  sh.reverse.next = { village: 'Vík', country_code: 'is', country: 'Iceland' };
  const g2 = await ev(async () => guessCityAt(63.4186, -19.0060, null));
  ok('A6 no details: the point\'s reverse-geocoded town (NEW Vík)', g2.newCity && g2.newCity.label === 'Vík', g2);
  sh.reverse.next = null;
  const g3 = await ev(async () => guessCityAt(63.4186, -19.0060, null));
  ok('A7 reverse finds nothing: the nearest city anywhere, never new', g3 && g3.id === 'reykjavik', g3);
  const g4 = await ev(() => ({ inBox: matchCity(64.30, -21.25), far: guessCity(64.30, -22.69, null) }));
  ok('A8 boxes no longer file: a point in Reykjavík\'s box but far from every centre is guessed by distance', g4.inBox === 'reykjavik' && g4.far && g4.far.id === 'reykjavik', g4);

  // B. the Hanging Tag: routing line, distance note
  await sh.realRows(page);
  await sh.openTag(page, 'rey16');   // Sundhöllin, inside Reykjavík's box
  const t1 = await ev(() => { const t = document.querySelector('.leaflet-popup .tag'), first = t.querySelector('.tag-in').firstElementChild, btn = t.querySelector('.tag-city'), cs = getComputedStyle(t.querySelector('.route-city-name'));
    return { first: first.className, text: btn.textContent, chev: !!btn.querySelector('svg'), label: btn.getAttribute('aria-label'), dist: !!t.querySelector('.tag-dist'), font: [cs.fontSize, cs.fontWeight, cs.letterSpacing, cs.textTransform, cs.color].join(' '),
      left: btn.querySelector('.route-city-name').getBoundingClientRect().left - t.querySelector('.tag-name').getBoundingClientRect().left, hit: btn.getBoundingClientRect().height - 2 * parseFloat(getComputedStyle(btn, '::before').top),
      x: Math.abs((t.querySelector('.tag-x').getBoundingClientRect().top + 22) - (t.querySelector('.tag-name').getBoundingClientRect().top + 14)) };
  });
  ok('B1 the routing line is the tag\'s first line: the city, caps 12 navy, no chevron', t1.first === 'route-line' && t1.text === 'Reykjavík' && !t1.chev && /^12px 700 1.44px uppercase rgb\(18, 41, 63\)$/.test(t1.font), t1);
  ok('B2 left-aligned with the name; 44px target; the x stays on the name line', Math.abs(t1.left) <= 0.5 && t1.hit >= 44 && t1.x <= 1, t1);
  ok('B3 inside its city\'s area: no distance note; the button says "City: Reykjavík. Change the city"', !t1.dist && t1.label === 'City: Reykjavík. Change the city', t1);
  await sh.openTag(page, 'rey15');   // re-set as Gunnuhver (outside the box)
  const t2 = await ev(() => { const t = document.querySelector('.leaflet-popup .tag'), d = t.querySelector('.tag-dist'), a = t.querySelector('.tag-addr'), cs = d && getComputedStyle(d);
    return { text: d && d.textContent, under: d && a && d.previousElementSibling === a, font: cs && [cs.fontSize, cs.lineHeight, cs.fontWeight, cs.paddingTop].join(' '), desc: t.querySelector('.tag-city').getAttribute('aria-describedby') === d.id };
  });
  ok('B4 outside its city\'s area: "≈ 50 km from Reykjavík" under the address, 11/14 400, 4px above', t2.text === '≈ 50 km from Reykjavík' && t2.under && t2.font === '11px 14px 400 4px' && t2.desc, t2);
  await sh.openTag(page, 'rey17');   // re-set as Reykjanesviti: no address details, no short address
  const t3 = await ev(() => { const t = document.querySelector('.leaflet-popup .tag'); return { addr: !!t.querySelector('.tag-addr'), dist: (t.querySelector('.tag-dist') || {}).textContent }; });
  ok('B5 no address details: no address line, the note still works (coordinates only)', !t3.addr && t3.dist === '≈ 50 km from Reykjavík', t3);
  ok('B6 list rows never carry the note', await ev(() => !document.querySelector('#locationsList .tag-dist') && !/km from/.test(document.getElementById('locationsList').textContent)));

  // C. the city menu
  await sh.openTag(page, 'rey15');
  await P.tap(page, '.leaflet-popup .tag-city');
  const c1 = await ev(() => { const m = document.getElementById('tagCityMenu'), trig = document.querySelector('.leaflet-popup .tag-city'), r = m.getBoundingClientRect(), tr = trig.getBoundingClientRect();
    const cur = m.querySelector('[aria-checked="true"]');
    return { open: !m.hidden, cap: m.querySelector('.menu-cap').textContent, cities: m.querySelectorAll('[data-city]').length, cur: cur && cur.dataset.city, curIco: !!(cur && cur.querySelector('svg.menu-ico.is-quiet')), check: !!(cur && cur.querySelector('svg.menu-end')),
      mid: (m.querySelector('.menu-cap.is-mid') || {}).textContent, town: (m.querySelector('[data-newcity]') || {}).textContent, dy: r.top - tr.bottom, dx: r.left - tr.left, exp: trig.getAttribute('aria-expanded'),
      bg: getComputedStyle(trig).backgroundColor, focus: document.activeElement === cur, tally: /\d/.test(m.textContent) };
  });
  ok('C1 the menu: caption City, your 5 cities, the current one with the pin glyph + check, no tallies', c1.open && c1.cap === 'City' && c1.cities === 5 && c1.cur === 'reykjavik' && c1.curIco && c1.check && !c1.tally, c1);
  ok('C2 "New city" caption + "+ Reykjanesbær" (the real town)', c1.mid === 'New city' && c1.town === '+ Reykjanesbær', c1);
  ok('C3 6px under its trigger, left-aligned; the trigger open (navy, aria-expanded); focus on the current city', Math.abs(c1.dy - 6) <= 1 && Math.abs(c1.dx) <= 1 && c1.exp === 'true' && c1.bg === 'rgb(18, 41, 63)' && c1.focus, c1);
  await page.keyboard.press('Escape'); await W(200);
  ok('C4 Esc closes the menu first; the tag stays open, focus back on the city', await ev(() => document.getElementById('tagCityMenu').hidden && openTagKey() === 'rey15' && document.activeElement.classList.contains('tag-city')));
  sh.reverse.next = { town: 'Reykjanesbær', country_code: 'is', country: 'Iceland' };
  await sh.openTag(page, 'rey17');
  await P.tap(page, '.leaflet-popup .tag-city'); await W(400);
  ok('C5 no address details: the town is looked up once and "+ Reykjanesbær" joins the open menu', await ev(() => (document.querySelector('#tagCityMenu [data-newcity]') || {}).textContent === '+ Reykjanesbær'), await ev(() => document.getElementById('tagCityMenu').textContent));
  await ev(() => closeTagCityMenu(false));
  sh.reverse.next = null;

  // D. the move: optimistic, the write, the row's new section, the pin unmoved
  await sh.openTag(page, 'rey15');
  const pin0 = await ev(() => markersById.get('rey15').marker.getLatLng());
  await P.tap(page, '.leaflet-popup .tag-city');
  await ev(() => { window.__upd = []; document.querySelector('#tagCityMenu [data-city="copenhagen"]').click(); });
  const d0 = await ev(() => ({ city: locations.find(l => l.id === 'rey15').city, line: document.querySelector('.leaflet-popup .route-city-name').textContent }));
  ok('D1 optimistic: the place and the tag\'s line read Copenhagen at once', d0.city === 'copenhagen' && d0.line === 'Copenhagen', d0);
  await W(600);
  const d1 = await ev(() => { const el = document.querySelector('.location-card[data-id="rey15"]'); let n = el; while (n && !n.classList.contains('sec-head')) n = n.previousElementSibling;
    const pin = markersById.get('rey15').marker.getLatLng();
    return { upd: window.__upd, server: window.__ROWS.find(r => r.id === 'rey15').city, sec: n && n.querySelector('.sec-name').textContent, meta: el.querySelector('.row-meta').textContent, pin: [pin.lat, pin.lng], open: openTagKey(), sel: highlightedId,
      dist: (document.querySelector('.leaflet-popup .tag-dist') || {}).textContent, hidden: [...hiddenCities] };
  });
  ok('D2 the write: locations.update({ city }) .eq(id) -- one row, nothing else', JSON.stringify(d1.upd) === JSON.stringify([['locations', { city: 'copenhagen' }, ['id', 'rey15']]]) && d1.server === 'copenhagen', d1.upd);
  ok('D3 the row moved to the Copenhagen section (and its meta says so); the hidden city was shown', /^Copenhagen/.test(d1.sec) && /Copenhagen/.test(d1.meta) && !d1.hidden.includes('copenhagen'), d1);
  ok('D4 the pin did not move; the tag stays open and selected; the note recomputed', d1.pin[0] === pin0.lat && d1.pin[1] === pin0.lng && d1.open === 'rey15' && d1.sel === 'rey15' && /km from Copenhagen$/.test(d1.dist), d1);
  ok('D5 the selected row is in the list\'s view', await ev(() => { const l = document.getElementById('locationsList').getBoundingClientRect(), r = document.querySelector('.location-card[data-id="rey15"]').getBoundingClientRect(); return r.top >= l.top - 1 && r.bottom <= l.bottom + 1; }));

  // E. rollback: the write fails -> the city comes back (row, tag), the write error shows
  await P.tap(page, '.leaflet-popup .tag-city');
  await ev(() => { window.__slowFail = 'locations'; document.querySelector('#tagCityMenu [data-city="reykjavik"]').click(); });
  await W(100);
  const e0 = await ev(() => locations.find(l => l.id === 'rey15').city);
  await W(600);
  const e1 = await ev(() => { const el = document.querySelector('.location-card[data-id="rey15"]'); let n = el; while (n && !n.classList.contains('sec-head')) n = n.previousElementSibling;
    return { city: locations.find(l => l.id === 'rey15').city, server: window.__ROWS.find(r => r.id === 'rey15').city, line: document.querySelector('.leaflet-popup .route-city-name').textContent, sec: n && n.querySelector('.sec-name').textContent,
      err: document.getElementById('error').classList.contains('show') ? document.getElementById('errorText').textContent : '' };
  });
  ok('E1 optimistic first (Reykjavík), then rolled back to Copenhagen: the place, its tag and its row', e0 === 'reykjavik' && e1.city === 'copenhagen' && e1.server === 'copenhagen' && e1.line === 'Copenhagen' && /^Copenhagen/.test(e1.sec), { e0, e1 });
  ok('E2 the write error is shown', /couldn|save|stub failure|try again/i.test(e1.err), e1.err);
  // per write: a failing first write never undoes a second, later one
  await ev(() => { window.__slowFail = 'locations'; setPlaceCity('rey15', 'malmo'); });
  await W(50);
  await ev(() => setPlaceCity('rey15', 'stockholm')); await W(900);
  ok('E3 rollback is per write: a slow failed move leaves the later move standing', await ev(() => locations.find(l => l.id === 'rey15').city === 'stockholm' && window.__ROWS.find(r => r.id === 'rey15').city === 'stockholm'));
  ok('E4 the poll is held while a write is in flight (flagWritesInFlight)', await ev(async () => {
    window.__slowOk = 'locations'; const p = setPlaceCity('rey15', 'reykjavik'); await new Promise(r => setTimeout(r, 30));
    window.__ROWS.find(r => r.id === 'rey14').name = 'POLLED'; await doFetchLocations(); const held = !locations.some(l => l.name === 'POLLED');
    await p; window.__ROWS.find(r => r.id === 'rey14').name = 'Reykjavík Roasters'; await refetchLocations(); return held && flagWritesInFlight === 0; }));

  // F. "+ town": addCity() first, then the move; the orphan cleanup
  await sh.openTag(page, 'rey15');
  await P.tap(page, '.leaflet-popup .tag-city');
  await ev(() => { window.__ins = []; window.__upd = []; window.__del = []; document.querySelector('#tagCityMenu [data-newcity]').click(); });
  await W(1500);
  const f1 = await ev(() => ({ ins: window.__ins.map(x => [x[0], x[1][0].id, x[1][0].label]), upd: window.__upd, city: locations.find(l => l.id === 'rey15').city, inCities: !!CITIES.reykjanesbaer, line: document.querySelector('.leaflet-popup .route-city-name') && document.querySelector('.leaflet-popup .route-city-name').textContent }));
  ok('F1 "+ Reykjanesbær": the city is made first (cities insert), then the place is filed there', JSON.stringify(f1.ins) === JSON.stringify([['cities', 'reykjanesbaer', 'Reykjanesbær']]) && f1.upd.length === 1 && f1.upd[0][1].city === 'reykjanesbaer' && f1.city === 'reykjanesbaer' && f1.inCities && f1.line === 'Reykjanesbær', f1);
  await P.tap(page, '.leaflet-popup .tag-city');
  await ev(() => { window.__del = []; document.querySelector('#tagCityMenu [data-city="reykjavik"]').click(); }); await W(900);
  ok('F2 moved out of it again: the auto-added city left empty is removed (cleanupOrphanCities())', await ev(() => !CITIES.reykjanesbaer && window.__del.some(d => d[0] === 'cities')), await ev(() => window.__del));
  await P.tap(page, '.leaflet-popup .tag-city');
  await ev(() => { window.__ins = []; window.__upd = []; window.__failNext = 'cities'; document.querySelector('#tagCityMenu [data-newcity]').click(); }); await W(1200);
  ok('F3 addCity() fails: nothing moves, no city write', await ev(() => window.__upd.length === 0 && locations.find(l => l.id === 'rey15').city === 'reykjavik' && !CITIES.reykjanesbaer));

  // G. a district: the same line and menu; the write goes to neighborhood_shapes; no distance note
  const sid = await ev(() => neighborhoodShapes.find(n => n.city === 'reykjavik' && n.type === 'district').id);
  await ev(id => { const en = shapeCardsById.get(id); en.el.click(); }, sid); await W(1800);
  const g1 = await ev(() => { const t = document.querySelector('.leaflet-popup .tag'); return { line: t && t.querySelector('.route-city-name').textContent, dist: !!(t && t.querySelector('.tag-dist')) }; });
  ok('G1 a district\'s tag: the routing line, no distance note', g1.line === 'Reykjavík' && !g1.dist, g1);
  await P.tap(page, '.leaflet-popup .tag-city');
  await ev(() => { window.__upd = []; document.querySelector('#tagCityMenu [data-city="malmo"]').click(); }); await W(700);
  ok('G2 its write: neighborhood_shapes.update({ city }) by its id; the shape didn\'t move', await ev(id => JSON.stringify(window.__upd) === JSON.stringify([['neighborhood_shapes', { city: 'malmo' }, ['id', id]]]) && neighborhoodShapes.find(n => n.id === id).city === 'malmo' && document.querySelector('.leaflet-popup .route-city-name').textContent === 'Malmö', sid), await ev(() => window.__upd));
  await ev(id => setPlaceCity('shape:' + id, 'reykjavik'), sid); await W(500);
  await ev(() => map.closePopup()); await W(400);

  // H. signed out (the playground): greyed, the slip, no menu
  await ev(() => { window.__savedUser = currentUser; currentUser = null; refreshTags(); });
  await sh.openTag(page, 'rey16');
  const h0 = await ev(() => { const btn = document.querySelector('.leaflet-popup .tag-city'); return { dis: btn.getAttribute('aria-disabled'), label: btn.getAttribute('aria-label') }; });
  await P.tap(page, '.leaflet-popup .tag-city');
  const h1 = await ev(() => ({ menu: !document.getElementById('tagCityMenu').hidden, slip: (document.querySelector('.leaflet-popup .tag-slip') || {}).textContent, open: openTagKey() }));
  ok('H1 signed out: the city is aria-disabled and says so; a tap offers the sign-in slip, no menu', h0.dis === 'true' && /Sign in to change it/.test(h0.label) && !h1.menu && /Sign in/.test(h1.slip || '') && h1.open === 'rey16', { h0, h1 });
  await ev(() => { hideTagSlip(); map.closePopup(); currentUser = window.__savedUser; refreshTags(); }); await W(400);

  // S. the check's fixes (p3-cd-ux S1a / S1b): reveal only when the place would vanish; a failed
  // move hides again the city it showed
  await ev(() => setCityHidden('copenhagen', true)); await W(200);
  await sh.openTag(page, 'rey16');
  await P.tap(page, '.leaflet-popup .tag-city');
  await ev(() => { window.__slowFail = 'locations'; document.querySelector('#tagCityMenu [data-city="copenhagen"]').click(); });
  await W(150);
  const s1 = await ev(() => ({ shown: !hiddenCities.has('copenhagen'), city: locations.find(l => l.id === 'rey16').city, open: openTagKey() }));
  await W(700);
  const s2 = await ev(() => ({ hidden: hiddenCities.has('copenhagen'), stored: JSON.parse(localStorage.getItem('triplet.hiddenCities') || '[]').includes('copenhagen'), city: locations.find(l => l.id === 'rey16').city, open: openTagKey() }));
  ok('S1a a failed move into a hidden city: shown while it\'s pending, hidden again (and stored) on rollback; the place back, its tag open', s1.shown && s1.city === 'copenhagen' && s2.hidden && s2.stored && s2.city === 'reykjavik' && s2.open === 'rey16', { s1, s2 });
  await ev(() => map.closePopup()); await W(300);
  // a plan stop never hides: moving it into a hidden city leaves that city hidden
  await ev(async () => { window.__PT.plans.push({ id: 'ct-p', name: 'City plan', created_at: '2026-09-01T00:00:00Z' });
    ['rey00', 'rey05'].forEach((l, i) => window.__PT.plan_stops.push({ id: 'cs' + i, plan_id: 'ct-p', location_id: l, shape_id: null, position: i + 1 }));
    await refetchPlans(); choosePlan('ct-p'); });
  await W(900);
  await ev(() => setCityHidden('stockholm', true));
  await sh.openTag(page, 'rey05');
  await P.tap(page, '.leaflet-popup .tag-city');
  await ev(() => { window.__upd = []; document.querySelector('#tagCityMenu [data-city="stockholm"]').click(); }); await W(700);
  const s3 = await ev(() => ({ hidden: hiddenCities.has('stockholm'), city: locations.find(l => l.id === 'rey05').city, row: !!(rowEntry('rey05') && rowEntry('rey05').el.isConnected), open: openTagKey(), upd: window.__upd.length }));
  ok('S1b a stop of the open plan moved into a hidden city: the city stays hidden, the stop stays listed, its tag open', s3.hidden && s3.city === 'stockholm' && s3.row && s3.open === 'rey05' && s3.upd === 1, s3);
  await ev(async () => { await setPlaceCity('rey05', 'reykjavik'); map.closePopup(); setListView('places', { frame: false }); }); await W(500);
  ok('S1b\' outside a plan the same move still shows the city (the place would vanish)', await ev(async () => { const r = await setPlaceCity('rey05', 'stockholm'); const shown = !hiddenCities.has('stockholm'); await setPlaceCity('rey05', 'reykjavik'); return r && shown; }));

  // T. townOf(): a US-style admin prefix stripped (p3 check, item 8)
  const tw = await ev(() => ({ tivoli: townOf({ village: 'Village of Tivoli', town: 'Town of Red Hook', county: 'Dutchess County' }), city: townOf({ city: 'City of Westminster' }),
    plain: townOf({ city: 'Malmö kommun', town: 'Limhamn' }), admin: townOf({ town: 'Town of Red Hook County' }), none: townOf({ municipality: 'Grindavíkurbær' }) }));
  ok('T1 "Village of Tivoli" -> "Tivoli" (the most specific first); "City of Westminster" -> "Westminster"; plain names and admin units as before', tw.tivoli === "Tivoli" && tw.city === "Westminster" && tw.plain === "Limhamn" && tw.admin === "" && tw.none === "", tw);
  await P.openAdd(page); await P.typeName(page, 'Tivoli');
  await page.waitForFunction(() => /Village of Tivoli|Tivoli ·|Tivoli, /.test(document.getElementById('addResults').textContent), null, { timeout: 8000 }).catch(() => {});
  await ev(() => { const rows = [...document.querySelectorAll('#addResults .add-res')]; const i = rows.findIndex(r => /United States/.test(r.textContent)); rows[i].click(); }); await W(500);
  const tv = await ev(() => ({ city: addDraft.city, name: document.getElementById('addCityName').textContent, stamp: !document.getElementById('addNewStamp').hidden, dist: document.getElementById('addDist').textContent, where: addDraft.pick && addDraft.pick.where }));
  ok('T2 real fixture (Nominatim "Tivoli", the NY village): a NEW "Tivoli" city, not LA ~3,935 km away', tv.city && tv.city.newCity && tv.city.newCity.label === "Tivoli" && tv.name === "Tivoli" && tv.stamp && !tv.dist, tv);
  await ev(() => { if (addFormOpen()) cancelAddForm(); clearAddDraft(); }); await W(400);

  // I. the add tag: the pick's guess follows the new rule; a pick with no town waits for the reverse
  await P.openAdd(page); await P.typeName(page, 'Blue Lagoon'); await P.pick(page, 0);
  ok('I1 the add tag guesses by distance (Blue Lagoon -> Reykjavík, with the note)', await ev(() => addDraft.city.id === 'reykjavik' && document.getElementById('addDist').textContent === '≈ 40 km from Reykjavík'));
  await ev(() => { if (addFormOpen()) cancelAddForm(); clearAddDraft(); }); await W(400);

  if (o.errors.length) ok('no page errors', false, o.errors);
  await b.close();
  finish();
})();
