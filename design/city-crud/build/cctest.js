// City CRUD v2 build checks (design/city-crud/concepts/v2-lean.md + 0-shared-name-and-address.md),
// Chromium, on the gesture harness's stub with real Nominatim answers (./fixtures, ../../add-tag-jam/
// p2/fixtures). Prints PASS/FAIL per case and "cctest p/n".
//   CHROME=... node design/city-crud/build/cctest.js [index.html]
// Covers: NAME and ADDRESS as two lines that each search (results under the searching line, the
// caption kept above the entry, a pick fills both, NAME stops searching after a pick, an emptied
// ADDRESS lets the pick go, NAME IT FIRST); the pre-pick CITY caption; Find a city on the add tag
// and the Hanging Tag (settlements only, nearest first, "≈ n km away", a new real city from the
// result's own config, a hit that is one of your cities, the emptied city cleaned up, keyboard);
// signed out; the PLAN line (only with a plan open, preset, STOP n, Not in a plan, ADD + the stop,
// the stop write failing and its retry); the 375x667 fits.
const path = require('path');
const L = require('./lib-cc.js');
const { P, P3, W } = L;
const PA = [39.95, -75.40];   // the map over south-east Pennsylvania: no city of yours within 150 km
(async () => {
  const file = path.resolve(process.argv[2] || path.join(__dirname, '../../../index.html'));
  const b = await P.lib.launch();
  const { rec, finish } = P.lib.recorder('cctest');
  const ok = (name, pass, detail) => rec('cc', name, pass, detail);
  let o = await L.open(b, { file, storage: { 'gh.plans': '1' } });
  let page = o.page;
  const ev = (f, a) => page.evaluate(f, a);
  const reset = async () => { await ev(() => { if (addFormOpen()) cancelAddForm(); clearAddDraft(); map.closePopup(); }); await W(450); };
  const toPA = async () => { await ev(ll => map.setView(ll, 10, { animate: false }), PA); await W(300); };
  const setName = t => ev(t => { const i = document.getElementById('nameInput'); i.value = t; i.dispatchEvent(new Event('input', { bubbles: true })); }, t);
  const hint = () => ev(() => { const b = document.getElementById('submitBtn'), sub = b.querySelector('.add-sub'); return [b.classList.contains('is-ready'), sub ? sub.textContent : null]; });
  const NAVY = 'rgb(18, 41, 63)';

  // A1 first, while no city of yours is near Pennsylvania
  await toPA(); await P.openAdd(page);
  const a1 = await ev(() => { const n = document.getElementById('addCityName'), b = document.getElementById('addCityBtn'); return { text: n.textContent, cap: n.classList.contains('is-cap'), hidden: b.hidden, label: b.getAttribute('aria-label'), color: getComputedStyle(n).color }; });
  ok('A1 before a pick, no city near the map: the line prints its caption CITY (still a menu), never a far city', a1.text === 'City' && a1.cap && !a1.hidden && a1.label === 'City. Choose a city' && a1.color === 'rgb(90, 86, 76)', a1);
  await reset();

  // C. Find a city on the add tag (the owner's Longwood Gardens -> Philadelphia)
  await toPA(); await P.openAdd(page); await P.typeName(page, 'Longwood Gardens'); await P.pick(page, 0); await W(300);
  ok('C1 the guess (unchanged): no city in reach -> NEW East Marlborough Township', await ev(() => addCityIsNew() && addCityLabel() === 'East Marlborough Township'));
  await P.tap(page, '#addCityBtn');
  const c2 = await ev(() => { const m = document.getElementById('addCityMenu'), i = m.querySelector('.menu-find-in'), foot = m.querySelector('.menu-foot');
    return { cap: m.querySelector('.menu-cap.is-mid').textContent, town: (m.querySelector('[data-newcity]') || {}).textContent, ph: i && i.placeholder, label: i && i.getAttribute('aria-label'), font: i && getComputedStyle(i).fontSize, inFoot: foot && foot.contains(i), afterTown: !!(m.querySelector('[data-newcity]') && (m.querySelector('[data-newcity]').compareDocumentPosition(i) & 4)) }; });
  ok('C2 the city menu: "New city", "+ East Marlborough Township", then "+ Find a city…" (a 16px entry) under it', c2.cap === 'New city' && /\+ East Marlborough Township/.test(c2.town) && c2.ph === 'Find a city…' && c2.label === 'Find a city' && c2.font === '16px' && c2.inFoot && c2.afterTown, c2);
  await L.findCity(page, 'addCityMenu', 'Philadelphia');
  const cq = o.requests.filter(u => u.includes('featureType=city') && u.includes('q=Philadelphia')).map(u => new URL(u));
  ok('C3 Find a city searches settlements (featureType=city), worldwide, in English', cq.length === 1 && cq[0].searchParams.get('accept-language') === 'en' && !cq[0].searchParams.get('countrycodes') && !cq[0].searchParams.get('bounded'), cq.map(u => u.search));
  const c4 = await ev(() => [...document.querySelectorAll('#addCityMenu .menu-res')].map(r => [r.querySelector('.add-res-name').textContent, r.querySelector('.add-res-where').textContent]));
  ok('C4 results: real cities only, nearest the place first: "Philadelphia / City · Pennsylvania, United States · ≈ 45 km away"; no "Village of", no county; at most 5', c4.length >= 2 && c4.length <= 5 && c4[0][0] === 'Philadelphia' && c4[0][1] === 'City · Pennsylvania, United States · ≈\u00a045\u00a0km away' && !c4.some(([n, w]) => /Village of|Town of|County/.test(n + w)) && c4.filter(([n, w]) => /New York/.test(w)).length === 1, c4);
  const c5 = await ev(() => { const m = document.getElementById('addCityMenu').getBoundingClientRect(), i = document.querySelector('#addCityMenu .menu-find-in').getBoundingClientRect(), r = document.querySelector('#addCityMenu .menu-res').getBoundingClientRect();
    return { inView: m.top >= 0 && m.bottom <= innerHeight, findIn: i.top >= m.top - 0.5 && i.bottom <= m.bottom + 0.5, resIn: r.top >= m.top - 0.5 && r.bottom <= m.bottom + 0.5 }; });
  ok('C5 the menu stays on screen, the search line and its first result in view', c5.inView && c5.findIn && c5.resIn, c5);
  await ev(() => document.querySelector('#addCityMenu .menu-res').click()); await W(250);
  const c6 = await ev(() => ({ line: document.getElementById('addCityName').textContent, stamp: !document.getElementById('addNewStamp').hidden, hand: addDraft.cityHand, menu: document.getElementById('addCityMenu').hidden, dist: document.getElementById('addDist').hidden, made: !!CITIES.philadelphia }));
  ok('C6 picking it files the place there at ADD: the line reads Philadelphia, NEW-stamped (a hand pick); nothing written yet', c6.line === 'Philadelphia' && c6.stamp && c6.hand && c6.menu && c6.dist && !c6.made, c6);
  await ev(() => { window.__ins = []; document.getElementById('submitBtn').click(); }); await W(2200);
  const c7 = await ev(() => window.__ins);
  const city7 = (c7.find(x => x[0] === 'cities') || [0, [{}]])[1][0], loc7 = (c7.find(x => x[0] === 'locations') || [0, [{}]])[1][0];
  ok('C7 ADD made Philadelphia from the result\'s own name, centre and box (chosen by hand: kept, auto_added false), then the place in it', JSON.stringify(c7.map(x => x[0])) === '["cities","locations"]' && city7.id === 'philadelphia' && city7.label === 'Philadelphia' && Math.abs(city7.center_lat - 39.9527237) < 1e-6 && city7.viewbox === '-75.280266,39.867005,-74.9558314,40.1379593' && city7.countrycodes === 'us' && city7.geocode_suffix === 'Philadelphia, United States' && city7.auto_added === false && loc7.city === 'philadelphia', c7);
  ok('C8 no second lookup for the city (every Philadelphia search was Find a city\'s)', o.requests.filter(u => u.includes('/search') && u.includes('q=Philadelphia')).every(u => u.includes('featureType=city')));
  const c9 = await ev(() => { const t = document.querySelector('.leaflet-popup .tag'); return t && { city: t.querySelector('.tag-city').textContent, dist: (t.querySelector('.tag-dist') || {}).textContent }; });
  ok('C9 its tag: PHILADELPHIA, "≈ 45 km from Philadelphia" on the address line', c9 && c9.city === 'Philadelphia' && c9.dist === '≈ 45 km from Philadelphia', c9);
  const longwoodId = await ev(() => (locations.find(l => l.name === 'Longwood Gardens') || {}).id);
  await reset();

  // D. the guess now finds Philadelphia; a Find hit that is one of your cities just picks it
  await toPA(); await P.openAdd(page); await P.typeName(page, 'Longwood Gardens'); await P.pick(page, 0); await W(300);
  ok('D1 with Philadelphia yours, the guess files Longwood there (45 km, within reach)', await ev(() => addDraft.city && addDraft.city.id === 'philadelphia' && !addCityIsNew()));
  await P.tap(page, '#addCityBtn'); await L.findCity(page, 'addCityMenu', 'Reykjavik');
  await ev(() => { window.__ins = []; document.querySelector('#addCityMenu .menu-res').click(); }); await W(250);
  const d2 = await ev(() => ({ city: addDraft.city, stamp: !document.getElementById('addNewStamp').hidden, line: document.getElementById('addCityName').textContent, ins: window.__ins.length, ids: Object.keys(CITIES).filter(id => /reykjav/.test(id)) }));
  ok('D2 "Reykjavik" (one of your cities by name and country) picks Reykjavík: no NEW, no new city', d2.city && d2.city.id === 'reykjavik' && !d2.stamp && d2.line === 'Reykjavík' && d2.ins === 0 && d2.ids.length === 1, d2);
  await P.tap(page, '#addCityBtn'); await L.findCity(page, 'addCityMenu', 'Zzyzxqq');
  ok('D3 nothing found: "No cities called that — try another name."', await ev(() => document.querySelector('#addCityMenu .menu-find-res').textContent === 'No cities called that — try another name.'));
  await ev(() => closeAddMenus(false));
  await reset();

  // A. NAME and ADDRESS are two lines; each one searches
  await toPA(); await P.openAdd(page);
  const a2 = await ev(() => { const i = document.getElementById('addrInput'), cap = document.querySelector('#addAddrRow .add-cap'); return { tag: i.tagName, font: getComputedStyle(i).fontSize, label: i.getAttribute('aria-label'), cap: getComputedStyle(cap).display, capText: cap.textContent }; });
  ok('A2 ADDRESS is a line you write on: a 16px entry (no iOS zoom), its caption printed on the empty line', a2.tag === 'TEXTAREA' && a2.font === '16px' && a2.label === 'Address' && a2.cap !== 'none' && a2.capText === 'Address', a2);
  await L.typeAddr(page, '1007 N Orange St Wilmington');
  const aq = o.requests.filter(u => u.includes('/search') && u.includes('q=1007')).map(u => new URL(u));
  ok('A3 typing in ADDRESS runs the add tag\'s worldwide search with what you typed', aq.length >= 1 && aq[0].searchParams.get('q') === '1007 N Orange St Wilmington' && !aq[0].searchParams.get('countrycodes') && !aq[0].searchParams.get('bounded') && !aq[0].searchParams.get('featureType'), aq.map(u => u.search));
  const a4 = await ev(() => { const res = document.getElementById('addResults').getBoundingClientRect(), row = document.getElementById('addAddrRow').getBoundingClientRect(); return { d: Math.abs(res.top - row.bottom), rows: [...document.querySelectorAll('#addResults .add-res')].map(r => r.textContent) }; });
  ok('A4 ... its results open under ADDRESS\'s rule, each saying where', a4.d <= 1.5 && a4.rows.length >= 1 && /Wilmington, United States/.test(a4.rows[0]), a4);
  const a5 = await ev(() => { const row = document.getElementById('addAddrRow'), cap = row.querySelector('.add-cap').getBoundingClientRect(), ta = document.getElementById('addrInput').getBoundingClientRect(), ncap = getComputedStyle(document.querySelector('#addNameRow .add-cap')).display;
    return { writing: row.classList.contains('is-writing'), rule: getComputedStyle(row).borderBottomColor, capAbove: cap.height > 0 && cap.bottom <= ta.top + 1, ncap }; });
  ok('A5 while written on: the rule turns navy and the caption ADDRESS stays printed above the entry; the empty NAME line still shows NAME', a5.writing && a5.rule === NAVY && a5.capAbove && a5.ncap !== 'none', a5);
  const reqsAtPick = o.requests.length;
  await P.pick(page, 0); await W(400);
  const a6 = await ev(() => ({ name: document.getElementById('nameInput').value, shown: document.getElementById('addAddr').textContent, val: document.getElementById('addrInput').value, short: addDraft.pick && addDraft.pick.short, picked: addPicked() }));
  ok('A6 a pick from ADDRESS fills both: NAME (empty) takes the pick\'s name; ADDRESS prints the short address', a6.picked && a6.name === 'Nemours Building' && a6.shown === a6.short && a6.val === a6.short && /North Orange Street/.test(a6.shown), a6);
  await setName('Rental, night 2'); await W(1300);
  const a7 = await ev(() => ({ res: document.getElementById('addResults').hidden, pick: !!addDraft.pick }));
  ok('A7 after a pick NAME is just the name: "Rental, night 2" runs no search, the pick stays', a7.res && a7.pick && !o.requests.slice(reqsAtPick).some(u => u.includes('/search') && u.includes('Rental')), { a7, reqs: o.requests.slice(reqsAtPick) });
  ok('A8 ... and ADD is ready', JSON.stringify(await hint()) === JSON.stringify([true, null]), await hint());
  await setName('');
  ok('A9 NAME emptied after the pick: ADD waits, "Name it first"', JSON.stringify(await hint()) === JSON.stringify([false, 'Name it first']), await hint());
  await setName('Rental, night 2');
  await ev(() => { window.__ins = []; document.getElementById('submitBtn').click(); }); await W(1800);
  const a10 = await ev(() => window.__ins);
  const a10l = (a10.find(x => x[0] === 'locations') || [0, [{}]])[1][0];
  ok('A10 ADD saves my name at the picked address ("Rental, night 2", 1007 North Orange Street; the guess files it in Philadelphia, 40 km)', a10l.name === 'Rental, night 2' && Math.abs(a10l.lat - 39.7467) < 1e-3 && /North Orange Street/.test(a10l.short_address || '') && a10l.city === 'philadelphia' && JSON.stringify(a10.map(x => x[0])) === '["locations"]', a10);
  const rentalId = await ev(() => (locations.find(l => l.name === 'Rental, night 2') || {}).id);
  await reset();

  // B. a name you wrote stays; leaving ADDRESS without a pick puts the address back; emptied, the pick goes
  await toPA(); await P.openAdd(page);
  await setName('My spot'); await W(1300); await ev(() => hideAutocomplete());
  await L.typeAddr(page, '1007 N Orange St Wilmington'); await P.pick(page, 0); await W(300);
  ok('B1 a pick from ADDRESS keeps the name you wrote', await ev(() => document.getElementById('nameInput').value === 'My spot' && !!addDraft.pick));
  await ev(() => { const i = document.getElementById('addrInput'); i.focus(); i.value = 'Somewhere else'; i.dispatchEvent(new Event('input', { bubbles: true })); });
  await W(100); await ev(() => { document.getElementById('addrInput').blur(); }); await W(1500);
  const b2 = await ev(() => ({ val: document.getElementById('addrInput').value, shown: document.getElementById('addAddr').textContent, pick: !!addDraft.pick, res: document.getElementById('addResults').hidden, short: addDraft.pick && addDraft.pick.short }));
  ok('B2 leaving ADDRESS without a pick: the line goes back to the picked place\'s address; no stray results', b2.pick && b2.val === b2.short && b2.shown === b2.short && b2.res, b2);
  await ev(() => { const i = document.getElementById('addrInput'); i.focus(); i.value = ''; i.dispatchEvent(new Event('input', { bubbles: true })); });
  await W(100); await ev(() => document.getElementById('addrInput').blur()); await W(400);
  const b3 = await ev(() => ({ pick: addDraft.pick, picked: document.getElementById('addForm').classList.contains('is-picked'), wash: document.getElementById('addWash').classList.contains('is-on'), name: document.getElementById('nameInput').value, cap: getComputedStyle(document.querySelector('#addAddrRow .add-cap')).display }));
  ok('B3 ADDRESS emptied: the pick goes (no pin, the wash back), your NAME stays, the caption ADDRESS is back', !b3.pick && !b3.picked && b3.wash && b3.name === 'My spot' && b3.cap !== 'none', b3);
  ok('B4 ... ADD waits on a place: "Pick a place"', JSON.stringify(await hint()) === JSON.stringify([false, 'Pick a place']), await hint());
  await P.typeName(page, 'Longwood Gardens');
  ok('B5 ... and NAME searches again', await ev(() => [...document.querySelectorAll('#addResults .add-res-name')].some(e => e.textContent === 'Longwood Gardens')));
  await reset();

  // E. the Hanging Tag: move a place to a new real city (Lewes); the city it left is cleaned up
  await ev(() => { window.__upd = []; window.__del = []; window.__ins = []; });
  await P3.openTag(page, rentalId);
  await P.tap(page, '.leaflet-popup .tag-city');
  ok('E1 the place\'s city menu has the same "+ Find a city…" line', await ev(() => !document.getElementById('tagCityMenu').hidden && !!document.querySelector('#tagCityMenu .menu-foot .menu-find-in')));
  await L.findCity(page, 'tagCityMenu', 'Lewes');
  const e2 = await ev(() => [...document.querySelectorAll('#tagCityMenu .menu-res')].map(r => [r.querySelector('.add-res-name').textContent, r.querySelector('.add-res-where').textContent]));
  ok('E2 nearest the place first: Lewes, Delaware ("Town · Delaware, United States · ≈ n km away")', e2[0] && e2[0][0] === 'Lewes' && /^Town · Delaware, United States · ≈\u00a0\d+\u00a0km away$/.test(e2[0][1]) && e2.length === 3, e2);
  await ev(() => document.querySelector('#tagCityMenu .menu-res').click()); await W(1500);
  const e3 = await ev(id => ({ ins: window.__ins.map(x => [x[0], x[1][0].id]), upd: window.__upd, city: (locations.find(l => l.id === id) || {}).city, menu: document.getElementById('tagCityMenu').hidden,
    line: (document.querySelector('.leaflet-popup .tag-city') || {}).textContent }), rentalId);
  ok('E3 a new real city: addCity() (Lewes) first, then the place moves there; the pin stays put', JSON.stringify(e3.ins) === '[["cities","lewes"]]' && e3.upd.length === 1 && e3.upd[0][0] === 'locations' && e3.upd[0][1].city === 'lewes' && e3.city === 'lewes' && e3.menu, e3);
  ok('E4 the tag reads LEWES', e3.line === 'Lewes', e3);
  // keyboard, and a hit that is one of your cities (no new city)
  await ev(() => { window.__upd = []; window.__ins = []; window.__del = []; });
  await P.tap(page, '.leaflet-popup .tag-city');
  await L.findCity(page, 'tagCityMenu', 'Philadelphia');
  await page.keyboard.press('ArrowDown'); await W(100);
  const f1 = await ev(() => document.activeElement && document.activeElement.classList.contains('menu-res') && document.activeElement.querySelector('.add-res-name').textContent);
  await page.keyboard.press('Enter'); await W(1500);
  const f2 = await ev(id => ({ ins: window.__ins.length, upd: window.__upd.map(u => u[1].city), city: (locations.find(l => l.id === id) || {}).city, lewes: !!CITIES.lewes, del: window.__del.length }), rentalId);
  ok('E5 keyboard: ↓ from the search line reaches the first result; Enter picks it', f1 === 'Philadelphia', f1);
  ok('E6 a hit that is one of your cities just moves the place there (no new city)', f2.ins === 0 && JSON.stringify(f2.upd) === '["philadelphia"]' && f2.city === 'philadelphia', f2);
  ok('E7 the city it left empty (Lewes, found by hand) is KEPT (city-crud v4: auto_added false)', f2.lewes && f2.del === 0, f2);
  await reset();

  // G. signed out: the city menus (and so Find a city) are out of reach; the slip says why
  await ev(() => { window.__savedUser = currentUser; currentUser = null; refreshTags(); });
  await P3.openTag(page, longwoodId);
  await P.tap(page, '.leaflet-popup .tag-city');
  const g1 = await ev(() => ({ menu: !document.getElementById('tagCityMenu').hidden, dis: document.querySelector('.leaflet-popup .tag-city').getAttribute('aria-disabled'), slip: !!document.querySelector('.tag-slip:not([hidden]), #tagSlip:not([hidden])') }));
  ok('G1 signed out: the place\'s city is greyed, a tap offers sign-in, no menu (no Find a city)', !g1.menu && g1.dis === 'true', g1);
  await ev(() => { if (typeof hideTagSlip === 'function') hideTagSlip(); map.closePopup(); currentUser = window.__savedUser; refreshTags(); }); await W(400);

  // H. the PLAN line: only when + is tapped with a plan open
  await reset();
  await P.openAdd(page);
  ok('H1 Places: + shows no PLAN line', await ev(() => document.getElementById('addPlanRow').hidden));
  await reset();
  await ev(() => showAllPlans()); await W(600);
  await P.openAdd(page);
  ok('H2 Plans, no plan open (All plans): no PLAN line', await ev(() => document.getElementById('addPlanRow').hidden));
  await reset();
  await ev(() => choosePlan('gh-p')); await W(900);
  await P.openAdd(page);
  const h3 = await ev(() => { const r = document.getElementById('addPlanRow'), s = document.getElementById('addStopNo'); return { hidden: r.hidden, lab: r.querySelector('.tag-lab').textContent, val: document.getElementById('addPlanVal').textContent, stop: s.textContent, stamp: (s.querySelector('.tag-stamp') || {}).textContent, aria: s.getAttribute('aria-label'), after: !!(document.querySelector('#addForm .add-type:not(.add-plan)').compareDocumentPosition(r) & 4), rule: getComputedStyle(r).borderTopStyle }; });
  ok('H3 a plan open: + shows PLAN · Gate plan, preset, after TYPE under a rule; STOP 4 (the next position) with the number stamped', !h3.hidden && h3.lab === 'Plan' && h3.val === 'Gate plan' && h3.stop === 'Stop 4' && h3.stamp === '4' && h3.aria === 'Stop 4' && h3.after && h3.rule === 'solid', h3);
  await P.tap(page, '#addPlanBtn');
  const h4 = await ev(() => [...document.querySelectorAll('#addPlanMenu .menu-row')].map(r => [r.querySelector('.menu-lab').textContent, r.getAttribute('aria-checked')]));
  ok('H4 its menu: your plans (the open one checked) and "Not in a plan"', JSON.stringify(h4) === JSON.stringify([['Gate plan', 'true'], ['Not in a plan', 'false']]), h4);
  await ev(() => document.querySelector('#addPlanMenu [data-plan=""]').click()); await W(200);
  ok('H5 "Not in a plan": the line says so; no STOP', await ev(() => document.getElementById('addPlanVal').textContent === 'Not in a plan' && document.getElementById('addStopNo').textContent === '' && addDraft.plan === null));
  await P.tap(page, '#addPlanBtn'); await ev(() => document.querySelector('#addPlanMenu [data-plan="gh-p"]').click()); await W(200);
  await P.typeName(page, 'Cape Henlopen State Park'); await P.pick(page, 0); await W(400);
  ok('H6 a roadtrip stop is filed under its real town (the guess, unchanged: Lewes)', await ev(() => addCityLabel() === 'Lewes'), await ev(() => addDraft.city));
  await ev(() => { window.__ins = []; document.getElementById('submitBtn').click(); }); await W(2400);
  const h7 = await ev(() => window.__ins);
  const h7l = (h7.find(x => x[0] === 'locations') || [0, [{}]])[1][0], h7s = (h7.find(x => x[0] === 'plan_stops') || [0, [{}]])[1][0];
  const newCape = await ev(() => (locations.find(l => l.name === 'Cape Henlopen State Park') || {}).id);
  ok('H7 ADD makes the place, then its stop: plan Gate plan, position 4, the new place', /(^|,)"locations","plan_stops"\]$/.test(JSON.stringify(h7.map(x => x[0])).replace('[', '')) && h7l.name === 'Cape Henlopen State Park' && h7s.plan_id === 'gh-p' && h7s.location_id === newCape && h7s.shape_id === null && h7s.position === 4, h7);
  const h8 = await ev(() => { const t = document.querySelector('.leaflet-popup .tag'); return { open: addFormOpen(), plan: t && (t.querySelector('.tag-plan') || {}).textContent, name: t && t.querySelector('.tag-name').textContent }; });
  ok('H8 the add tag goes; the new place\'s tag says STOP 4 OF 4', !h8.open && h8.name === 'Cape Henlopen State Park' && /^Stop\s*4\s*of\s*4$/i.test((h8.plan || '').replace(/\s+/g, ' ').trim()), h8);
  await reset();

  // I. the stop write fails: the place stays saved, the tag says so, ADD retries only the stop
  await P.openAdd(page);
  await P.typeName(page, 'Hallgrímskirkja'); await P.pick(page, 0); await W(300);
  await ev(() => { window.__ins = []; window.__failNext = 'plan_stops'; document.getElementById('submitBtn').click(); }); await W(2400);
  const i1 = await ev(() => ({ ins: window.__ins.map(x => x[0]), open: addFormOpen(), err: document.getElementById('addErr').textContent, hidden: document.getElementById('addErr').hidden, ready: document.getElementById('submitBtn').classList.contains('is-ready'), stops: planStops.filter(s => s.plan_id === 'gh-p').length }));
  ok('I1 the stop fails: the place is saved once, the tag stays up and says "Saved, but not added to the plan — try again."; ADD is ready', JSON.stringify(i1.ins) === '["locations"]' && i1.open && !i1.hidden && i1.err === 'Saved,but not added to the plan — try again.' && i1.ready && i1.stops === 4, i1);
  await ev(() => { window.__ins = []; document.getElementById('submitBtn').click(); }); await W(2400);
  const i2 = await ev(() => ({ ins: window.__ins.map(x => [x[0], x[1][0].position]), open: addFormOpen(), n: locations.filter(l => l.name === 'Hallgrímskirkja' && l.id.startsWith('new')).length }));
  ok('I2 ADD again adds only the stop (position 5), no second place; the tag goes', JSON.stringify(i2.ins) === '[["plan_stops",5]]' && !i2.open && i2.n === 1, i2);
  await reset();
  await P.openAdd(page); await P.typeName(page, 'Harpa'); await P.pick(page, 0); await W(300);
  await ev(() => { window.__ins = []; window.__failNext = 'plan_stops'; document.getElementById('submitBtn').click(); }); await W(2400);
  await ev(() => cancelAddForm()); await W(500);
  ok('I3 ... cancel after a failed stop: the place stays, the draft is cleared (no duplicate on the next +)', await ev(() => !addFormOpen() && !addDraft.pick && !addDraft.saved && document.getElementById('nameInput').value === '' && locations.some(l => l.name === 'Harpa' && l.id.startsWith('new'))));
  await page.context().close();

  // K. fits at 375x667
  o = await L.open(b, { file, w: 375, h: 667, storage: { 'gh.plans': '1' } }); page = o.page;
  await ev(() => choosePlan('gh-p')); await W(900);
  await P.openAdd(page); await P.typeName(page, 'Hallgrímskirkja'); await P.pick(page, 0); await W(400);
  await ev(() => document.activeElement && document.activeElement.blur()); await W(300);
  const k1 = await ev(() => { const body = document.querySelector('#addForm .tag-body').getBoundingClientRect(), stub = document.getElementById('addStub').getBoundingClientRect(), plan = document.getElementById('addPlanRow').getBoundingClientRect(), credit = document.querySelector('.leaflet-control-attribution').getBoundingClientRect(), sheet = document.getElementById('locations').getBoundingClientRect();
    return { body: [body.top, body.bottom], stubBottom: stub.bottom, plan: plan.height, floor: Math.min(credit.top, sheet.top), top: body.top }; });
  ok('K1 375x667: the add tag with its PLAN line fits the open map (above the credit and the list), whole', k1.plan > 0 && k1.stubBottom <= k1.floor + 0.5 && k1.top >= 0, k1);
  await P.tap(page, '#addCityBtn'); await L.findCity(page, 'addCityMenu', 'Philadelphia');
  const k2 = await ev(() => { const m = document.getElementById('addCityMenu').getBoundingClientRect(), i = document.querySelector('#addCityMenu .menu-find-in').getBoundingClientRect(), r = document.querySelector('#addCityMenu .menu-res').getBoundingClientRect();
    return { m: [m.left, m.top, m.right, m.bottom], inView: m.left >= 0 && m.right <= innerWidth && m.top >= 0 && m.bottom <= innerHeight, findIn: i.top >= m.top - 0.5 && i.bottom <= m.bottom + 0.5, resIn: r.top >= m.top - 0.5 && r.bottom <= m.bottom + 0.5 }; });
  ok('K2 375x667: the city menu with Find a city\'s results stays on screen, the search line and a result in view', k2.inView && k2.findIn && k2.resIn, k2);
  await ev(() => { closeAddMenus(false); cancelAddForm(); }); await W(500);
  await P3.openTag(page, 'rey04');
  await P.tap(page, '.leaflet-popup .tag-city'); await L.findCity(page, 'tagCityMenu', 'Philadelphia');
  const k3 = await ev(() => { const m = document.getElementById('tagCityMenu').getBoundingClientRect(), i = document.querySelector('#tagCityMenu .menu-find-in').getBoundingClientRect(), r = document.querySelector('#tagCityMenu .menu-res').getBoundingClientRect();
    return { m: [m.left, m.top, m.right, m.bottom], inView: m.left >= 0 && m.right <= innerWidth && m.top >= 0 && m.bottom <= innerHeight, findIn: i.top >= m.top - 0.5 && i.bottom <= m.bottom + 0.5, resIn: r.top >= m.top - 0.5 && r.bottom <= m.bottom + 0.5 }; });
  ok('K3 375x667: the Hanging Tag\'s city menu with results stays on screen, the search line and a result in view', k3.inView && k3.findIn && k3.resIn, k3);
  ok('K4 no page errors', o.errors.length === 0, o.errors);
  await page.context().close();

  // ================================================================ v2b (city-crud v4-v12)
  o = await L.open(b, { file, storage: { 'gh.plans': '1', 'triplet.reorderHint': '1' } }); page = o.page;
  const menuOpen = async () => { if (await ev(() => document.getElementById('titleMenu').hidden)) { await P.tap(page, '#titleBtn'); await W(250); } };
  const rowSel = id => `#titleMenu .menu-city[data-city="${id}"]`;
  // a menu row may sit under the sticky Plans row: scroll it into view first, as a person would
  const tapIn = async sel => { await ev(sel => { const e = document.querySelector(sel), m = document.getElementById('titleMenu'), foot = m.querySelector('.menu-row[data-kind]'); e.scrollIntoView({ block: 'nearest' }); const er = e.getBoundingClientRect(), fr = foot.getBoundingClientRect(); if (er.bottom > fr.top) m.scrollTop += er.bottom - fr.top; }, sel); await W(100); await P.tap(page, sel); };
  const rowState = id => ev(id => { const r = document.querySelector(`#titleMenu .menu-city[data-city="${id}"]`); return r && { open: r.dataset.open === '1', w: parseFloat(r.querySelector('.rm-clip').style.width || '0'), name: r.querySelector('.menu-lab').getBoundingClientRect().left }; }, id);
  const cdp = await page.context().newCDPSession(page);
  // a touch drag: from (x0, y) by dx in n steps, ms apart
  const drag = async (x0, y, dx, n, ms) => {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x0, y }] });
    for (let i = 1; i <= n; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x0 + dx * i / n, y }] }); await W(ms); }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await W(420);
  };
  const rowPt = id => ev(id => { const b = document.querySelector(`#titleMenu .menu-city[data-city="${id}"]`).getBoundingClientRect(); return { x: b.left + b.width * 0.7, y: b.top + b.height / 2, l: b.left, r: b.right }; }, id);

  // V. a picked city filters; All places keeps sections + the eye; faded signposts
  const v1 = await ev(() => ({ picked: citySelection, heads: document.querySelectorAll('#locationsList .sec-head').length, rows: [...document.querySelectorAll('#locationsList .location-card')].map(e => rowItem(e.dataset.id || 'shape:' + e.dataset.shapeId).city),
    pins: [...markersById.values()].map(m => m.loc.city), title: document.querySelector('#titleBtn .h-name').textContent }));
  ok('V1 Reykjavík picked: the list and the map hold Reykjavík only; no header for it; the title names it', v1.picked === 'reykjavik' && v1.heads === 0 && v1.rows.length > 20 && v1.rows.every(c => c === 'reykjavik') && v1.pins.every(c => c === 'reykjavik') && v1.title === 'Reykjavík', v1);
  await ev(() => { hiddenCities.clear(); hiddenCities.add('la'); persistHiddenCities(); setActiveCity(ALL_CITIES, { frame: false }); }); await W(500);
  const v2 = await ev(() => { const h = [...document.querySelectorAll('#locationsList .sec-head')]; return { heads: h.map(e => e.dataset.city), btn: h.some(e => e.querySelector('button.sec-name')), eyes: h.every(e => !!e.querySelector('.sec-eye')), la: h.find(e => e.dataset.city === 'la').classList.contains('is-hidden') }; });
  ok('V2 All places: one section per city with its eye (LA hidden: its greyed header); the header names are headings, not buttons', v2.heads.join() === 'la,reykjavik,copenhagen,malmo,stockholm' && !v2.btn && v2.eyes && v2.la, v2);
  const v3c = await ev(() => map.getCenter());
  await P.tap(page, '.sec-head[data-city="copenhagen"] .sec-name'); await W(900);
  ok('V3 tapping a header\'s name in All places does nothing', await ev(c => citySelection === ALL_CITIES && Math.abs(map.getCenter().lat - c.lat) < 1e-6, v3c));
  await ev(() => { setActiveCity('malmo', { frame: false }); map.setView([58, -2], 3, { animate: false }); }); await W(900);
  const v4 = await ev(() => [...document.querySelectorAll('#map .sp-board')].map(b => { const ln = b.querySelector('.sp-line'), sh = b.querySelector('.sp-shadow'), lab = b.querySelector('.sp-lab');
    return { id: b.dataset.cityBadge, faded: b.classList.contains('is-faded'), dash: getComputedStyle(ln).strokeDasharray, stroke: getComputedStyle(ln).stroke, shadow: getComputedStyle(sh).display, color: getComputedStyle(lab).color, fill: getComputedStyle(b.querySelector('.sp-fill')).fill }; }));
  const vm = v4.find(x => x.id === 'malmo'), vo = v4.filter(x => x.id !== 'malmo');
  ok('V4 Malmö picked, zoomed out: Malmö\'s board solid; the other cities\' boards faded (dashed --ink-2 rule, no navy shadow, grey label, opaque paper face)', vm && !vm.faded && vm.shadow !== 'none' && vo.length >= 3 && vo.every(x => x.faded && x.dash !== 'none' && x.stroke === 'rgb(90, 86, 76)' && x.shadow === 'none' && x.color === 'rgb(90, 86, 76)' && /rgb\(250, 245, 234\)/.test(x.fill)), v4);
  await ev(() => { const bd = document.querySelector('#map .sp-board[data-city-badge="stockholm"]'); bd.click(); }); await W(1500);
  ok('V5 a faded board is tappable: it picks that city (Stockholm)', await ev(() => citySelection === 'stockholm' && document.querySelector('#titleBtn .h-name').textContent === 'Stockholm'));
  await ev(() => { setActiveCity(ALL_CITIES, { frame: false }); map.setView([58, -2], 3, { animate: false }); }); await W(900);
  ok('V6 All places zoomed out: no faded boards', await ev(() => document.querySelectorAll('#map .sp-board').length >= 3 && !document.querySelector('#map .sp-board.is-faded')));

  // N. New city: the title menu's row becomes Find a city; you land in the new, empty city
  await ev(() => map.setView([40.3, -75.4], 7, { animate: false })); await W(400);   // results rank nearest the map's centre
  await menuOpen();
  const n1 = await ev(() => [...document.querySelectorAll('#titleMenu .menu-row')].map(r => r.textContent.trim()));
  ok('N1 the Places side: your cities, then "+ New city", then the quiet Plans row', n1[n1.length - 2] === 'New city' && /^Plans/.test(n1[n1.length - 1]) && n1.slice(1, 6).every(t => /\d+$/.test(t)), n1);
  await tapIn('#titleMenu [data-act="newcity"]');
  ok('N2 tapping it turns the row into the Find a city line, focused (the menu stays open)', await ev(() => !document.getElementById('titleMenu').hidden && document.activeElement && document.activeElement.classList.contains('menu-find-in') && !document.querySelector('#titleMenu [data-act="newcity"]')));
  await L.findCity(page, 'titleMenu', 'Philadelphia');
  await ev(() => { window.__ins = []; window.__del = []; document.querySelector('#titleMenu .menu-res').click(); }); await W(1500);
  const n3 = await ev(() => ({ ins: window.__ins.map(x => [x[0], x[1][0].id, x[1][0].auto_added]), picked: citySelection, title: document.querySelector('#titleBtn .h-name').textContent, n: document.querySelector('#titleBtn .tally').textContent,
    heads: document.querySelectorAll('#locationsList .sec-head').length, empty: getComputedStyle(document.getElementById('locationsEmpty')).display, txt: document.getElementById('locationsEmpty').textContent.trim(), menu: document.getElementById('titleMenu').hidden, c: map.getCenter() }));
  ok('N3 a pick makes the city (kept: auto_added false) and lands in it: "Philadelphia 0", no header, the empty note, the map on it', JSON.stringify(n3.ins) === '[["cities","philadelphia",false]]' && n3.picked === 'philadelphia' && n3.title === 'Philadelphia' && n3.n === '0' && n3.heads === 0 && n3.empty === 'block' && n3.txt === 'Nothing here yet · tap + to add a place' && n3.menu && Math.abs(n3.c.lat - 39.95) < 0.1, n3);
  await ev(() => cleanupOrphanCities()); await W(300);
  ok('N4 an empty city you made is kept by the cleanup (it\'s yours until you remove it); it\'s in the menu with 0', await ev(() => !!CITIES.philadelphia && !window.__del.length) && await (async () => { await menuOpen(); return ev(() => !!document.querySelector('#titleMenu .menu-city[data-city="philadelphia"]')); })());
  await tapIn('#titleMenu [data-act="newcity"]'); await L.findCity(page, 'titleMenu', 'Reykjavik');
  await ev(() => { window.__ins = []; document.querySelector('#titleMenu .menu-res').click(); }); await W(1200);
  ok('N5 a pick that is one of your cities just goes to it (no new city)', await ev(() => citySelection === 'reykjavik' && !window.__ins.length));
  await ev(() => { setActiveCity(ALL_CITIES, { frame: false }); map.setView([58, -2], 3, { animate: false }); }); await W(800);

  // R. remove by touch: the approved prototype's seven snap cases, the detent, the sign
  await menuOpen();
  let q = await rowPt('copenhagen');
  const nm0 = (await rowState('copenhagen')).name;
  await drag(q.x, q.y, -40, 4, 8);
  ok('R1 a fast 40px flick left opens (velocity ≥ 0.25 px/ms decides)', (await rowState('copenhagen')).open);
  await drag(q.x, q.y, 40, 4, 8);
  ok('R2 a fast 40px flick right on an open row closes', !(await rowState('copenhagen')).open);
  await drag(q.x, q.y, -40, 20, 24);
  ok('R3 a slow 40px drag left stays shut (under 40% of 132)', !(await rowState('copenhagen')).open);
  await drag(q.x, q.y, -60, 24, 24);
  const r4 = await rowState('copenhagen');
  ok('R4 a slow 60px drag left opens (past 40%), landing at 132px; the city\'s name never moves', r4.open && Math.abs(r4.w - 132) < 0.5 && Math.abs(r4.name - nm0) < 0.5, r4);
  await drag(q.x, q.y, 30, 15, 24);
  ok('R5 a slow 30px drag right on an open row stays open', (await rowState('copenhagen')).open);
  await drag(q.x, q.y, 70, 25, 24);
  ok('R6 a slow 70px drag right on an open row closes', !(await rowState('copenhagen')).open);
  // the over-drag: a long drag gives at most 12px past the open width
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: q.x, y: q.y }] });
  const widths = [];
  for (let i = 1; i <= 30; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: q.x - 10 * i, y: q.y }] }); await W(16); if (i % 5 === 0) widths.push((await rowState('copenhagen')).w); }
  const turnedMid = await ev(() => { const bd = document.querySelector('#map .sp-board[data-city-badge="copenhagen"]'); return !!bd && bd.classList.contains('is-turned'); });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await W(500);
  ok('R7 a 300px drag: the board gives a little past 132 and stops (≤ 144px), then lands at 132', widths.every(w => w <= 144.01) && widths[widths.length - 1] > 140 && Math.abs((await rowState('copenhagen')).w - 132) < 0.5, widths);
  const sign = await ev(() => { const bd = document.querySelector('#map .sp-board[data-city-badge="copenhagen"]'), back = bd && bd.querySelector('.sp-back'), cs = back && getComputedStyle(back);
    return bd && { turned: bd.classList.contains('is-turned'), word: back.textContent, dur: cs.transitionDuration, ease: cs.transitionTimingFunction, wide: back.getBoundingClientRect().width >= bd.getBoundingClientRect().width - 0.5 }; });
  ok('R8 the city\'s signpost turns over while its row is open: SEE YOU SOON? on navy, a 480ms turn with no overshoot (cubic-bezier(.45,.05,.25,1); the owner\'s bounce ruling); it turned mid-drag past 40%', turnedMid && sign && sign.turned && sign.word === 'See you soon?' && sign.dur === '0.48s' && sign.ease === 'cubic-bezier(0.45, 0.05, 0.25, 1)' && sign.wide, sign);
  const snap = await ev(() => { const r = document.querySelector('#titleMenu .menu-city[data-city="copenhagen"]'); rmSetOpen(r, false); rmSetOpen(r, true); const c = getComputedStyle(r.querySelector('.rm-clip')); return { cls: r.className, dur: c.transitionDuration, ease: c.transitionTimingFunction }; });
  ok('R8b the board\'s open snap keeps the owner-approved overshoot (240ms cubic-bezier(.25,1.45,.45,1); the bounce ruling covered only the sign\'s turn)', snap.dur === '0.24s' && snap.ease === 'cubic-bezier(0.25, 1.45, 0.45, 1)', snap);
  // the turned sign is tappable through the menu's scrim: it opens the picker
  const sp = await ev(() => { const b = document.querySelector('#map .sp-board[data-city-badge="copenhagen"] .sp-back').getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; });
  await page.touchscreen.tap(sp.x, sp.y); await W(400);
  ok('R9 tapping the turned sign opens the picker (the menu stays open)', await ev(() => !document.getElementById('titleMenu').hidden && !!document.querySelector('#titleMenu .rm-pick[data-pick="copenhagen"]')));
  const pk = await ev(() => { const p = document.querySelector('#titleMenu .rm-pick'); return { q: p.querySelector('.rm-q').textContent, rows: [...p.querySelectorAll('.rm-dest')].map(b => b.textContent.trim()), focus: document.activeElement && document.activeElement.textContent.trim() }; });
  ok('R10 the one-step picker (v14 copy): "Should we move Copenhagen’s places to a new city?", the other cities nearest first with distances, then "Remove places too", then "Cancel"; focus on the nearest', pk.q === 'Should we move Copenhagen’s places to a new city?' && /^Malmö≈\s\d+\skm$/.test(pk.rows[0]) && /^Stockholm≈/.test(pk.rows[1]) && /^Reykjavík≈\s2,\d{3}\skm$/.test(pk.rows[2]) && pk.rows.some(t => /^Philadelphia≈/.test(t)) && pk.rows[pk.rows.length - 2] === 'Remove places too' && pk.rows[pk.rows.length - 1] === 'Cancel' && /^Malmö/.test(pk.focus), pk);
  await ev(() => document.querySelector('#titleMenu [data-rm-keep]').click()); await W(400);
  ok('R11 Keep closes the picker and the board; the sign turns back', await ev(() => !document.querySelector('#titleMenu .rm-pick') && document.querySelector('#titleMenu .menu-city[data-city="copenhagen"]').dataset.open !== '1' && !document.querySelector('#map .sp-board.is-turned')));
  // right-click; Shift+Delete; the screen reader's action
  await ev(() => document.querySelector('#titleMenu .menu-city[data-city="malmo"] .menu-row').dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, button: 2 }))); await W(400);
  ok('R12 right-click (control-click) on a row opens the same reveal', (await rowState('malmo')).open);
  await ev(() => { rmCloseAll(); const r = document.querySelector('#titleMenu .menu-city[data-city="stockholm"] .menu-row'); r.focus(); }); await W(300);
  await page.keyboard.press('Shift+Delete'); await W(400);
  ok('R13 Shift+Delete on a focused row: straight to the picker, focus on the nearest city', await ev(() => !!document.querySelector('#titleMenu .rm-pick[data-pick="stockholm"]') && /^(Copenhagen|Malmö)/.test(document.activeElement.textContent.trim())));
  await ev(() => document.querySelector('#titleMenu [data-rm-keep]').click()); await W(300);
  const sr = await ev(() => { const b = document.querySelector('#titleMenu .menu-city[data-city="malmo"] .rm-sr'); return { t: b.textContent, role: b.getAttribute('role'), cls: getComputedStyle(b).position, boardHidden: b.parentElement.querySelector('.rm-clip').getAttribute('aria-hidden') }; });
  await ev(() => document.querySelector('#titleMenu .menu-city[data-city="malmo"] .rm-sr').click()); await W(400);
  ok('R14 VoiceOver: each row is followed by its own "Remove {city}" action (visually hidden); it opens the picker; the visual board is hidden from it', sr.t === 'Remove Malmö' && sr.role === 'menuitem' && sr.cls === 'absolute' && sr.boardHidden === 'true' && await ev(() => !!document.querySelector('#titleMenu .rm-pick[data-pick="malmo"]')), sr);

  // P. the commit: move (written at once, Undo moves them home), held remove-too, seeds, safety
  await ev(() => { window.__upd = []; window.__ins = []; window.__del = []; window.__pdel = []; window.__CITIES_TABLE = Object.keys(CITIES).map(id => ({ id, label: CITIES[id].label, center_lat: CITIES[id].center[0], center_lng: CITIES[id].center[1], zoom: CITIES[id].zoom, geocode_suffix: CITIES[id].geocodeSuffix || '', countrycodes: CITIES[id].countrycodes || '', viewbox: CITIES[id].viewbox, auto_added: false })); });
  await ev(() => document.querySelector('#titleMenu [data-rm-keep]').click()); await W(300);
  await ev(() => rmShowPicker('copenhagen')); await W(300);
  const cph = await ev(() => locations.filter(l => l.city === 'copenhagen').map(l => l.id).concat(neighborhoodShapes.filter(n => n.city === 'copenhagen').map(n => 'shape:' + n.id)));
  await ev(() => document.querySelector('#titleMenu .rm-dest[data-rm-to="malmo"]').click()); await W(1200);
  const p1 = await ev(ids => ({ upd: window.__upd.map(u => [u[0], u[1].city, u[2]]), del: window.__del, gone: !CITIES.copenhagen, menu: document.getElementById('titleMenu').hidden, slip: !document.getElementById('planSlip').hidden && document.getElementById('planSlip').textContent,
    moved: ids.every(k => (rowItem(k) || {}).city === 'malmo'), server: window.__ROWS.filter(r => r.city === 'copenhagen').length }), cph);
  ok('P1 one tap on Malmö: its places are filed under Malmö (one update per table, by city) and Copenhagen is removed; the menu closes; the two-line slip: "Copenhagen removed" / "Its places → Malmö" with Undo', JSON.stringify(p1.upd) === JSON.stringify([['locations', 'malmo', ['city', 'copenhagen']], ['neighborhood_shapes', 'malmo', ['city', 'copenhagen']]]) && p1.del.some(d => d[1] === 'copenhagen') && p1.gone && p1.menu && /^Copenhagen removedIts places\u00a0→\u00a0MalmöUndo$/.test(p1.slip) && p1.moved && p1.server === 0, p1);
  await ev(() => { window.__upd = []; window.__ins = []; document.querySelector('#planSlip button').click(); }); await W(1200);
  const p2 = await ev(ids => ({ ins: window.__ins.map(x => [x[0], x[1][0].id, x[1][0].auto_added]), upd: window.__upd.map(u => [u[0], u[1].city, u[2][0], u[2][1].length]), back: !!CITIES.copenhagen, home: ids.every(k => (rowItem(k) || {}).city === 'copenhagen') }), cph);
  ok('P2 Undo: the city row back first, then its places moved home (by id); everything as it was', p2.ins.length === 1 && p2.ins[0][1] === 'copenhagen' && p2.upd.length === 2 && p2.upd.every(u => u[1] === 'copenhagen' && u[2] === 'id') && p2.back && p2.home, p2);
  // remove the places too: held; Undo writes nothing; the poll can't bring them back
  await menuOpen(); await ev(() => rmShowPicker('stockholm')); await W(300);
  const sto = await ev(() => ({ locs: locations.filter(l => l.city === 'stockholm').map(l => l.id), stops: rmStopsIn('stockholm') }));
  await ev(() => { window.__pdel = []; window.__del = []; document.querySelector('#titleMenu .rm-dest.is-too').click(); }); await W(500);
  const p3 = await ev(ids => ({ shown: ids.filter(id => !!rowItem(id)).length, city: !!CITIES.stockholm, writes: window.__pdel.length + window.__del.length, slip: document.getElementById('planSlip').textContent, pending: !!pendingRemoval }), sto.locs);
  ok('P3 "Remove the places too": the city and its places leave the screen at once, but NOTHING is written yet (held while the slip shows)', p3.shown === 0 && !p3.city && p3.writes === 0 && /^Stockholm removedand its 23 placesUndo$/.test(p3.slip) && p3.pending, p3);
  await ev(async () => { await doFetchLocations(); await doFetchNeighborhoodShapes(); }); await W(300);
  ok('P4 a poll meanwhile can\'t bring them back', await ev(ids => ids.every(id => !rowItem(id)), sto.locs));
  await ev(() => document.querySelector('#planSlip button').click()); await W(500);
  ok('P5 Undo: everything back (the city, its places), and nothing was ever written', await ev(ids => ids.every(id => (rowItem(id) || {}).city === 'stockholm') && !!CITIES.stockholm && !pendingRemoval && window.__pdel.length + window.__del.length === 0, sto.locs));
  // held, then the slip ends: the deletes are written (places, then the city); no resurrection
  await menuOpen(); await ev(() => rmShowPicker('stockholm')); await W(300);
  await ev(() => document.querySelector('#titleMenu .rm-dest.is-too').click()); await W(300);
  await ev(() => hidePlanSlip()); await W(1200);
  const p6 = await ev(ids => ({ pdel: window.__pdel.map(d => [d[0], d[1].length]), del: window.__del.map(d => d[1]), shown: ids.filter(id => !!rowItem(id)).length, server: window.__ROWS.filter(r => r.city === 'stockholm').length, pending: !!pendingRemoval, city: !!CITIES.stockholm }), sto.locs);
  ok('P6 the slip ends: the held delete is written -- its places, its shapes, then the city row; a refetch brings nothing back', JSON.stringify(p6.pdel) === JSON.stringify([['locations', 21], ['neighborhood_shapes', 2]]) && p6.del.includes('stockholm') && p6.shown === 0 && p6.server === 0 && !p6.pending && !p6.city, p6);
  await ev(async () => { await fetchCities(); }); await W(300);
  await menuOpen();
  ok('P7 a removed seed city does not come back from the static bootstrap (the live table is the truth)', await ev(() => !CITIES.stockholm && !document.querySelector('#titleMenu .menu-city[data-city="stockholm"]') && !!document.querySelector('#titleMenu .menu-city[data-city="malmo"]')));
  // a second remove while one is held commits the first; leaving the app commits a held one
  await menuOpen(); await ev(() => rmShowPicker('malmo')); await W(300);
  await ev(() => { window.__pdel = []; window.__del = []; document.querySelector('#titleMenu .rm-dest.is-too').click(); }); await W(300);
  const held1 = await ev(() => window.__pdel.length);
  await menuOpen(); await ev(() => rmShowPicker('philadelphia')); await W(300);
  const pph = await ev(() => document.querySelector('#titleMenu .rm-pick').textContent);
  await ev(() => document.querySelector('#titleMenu .rm-pick .rm-dest:not(.is-keep)').click()); await W(1200);
  const p8 = await ev(() => ({ pdel: window.__pdel.map(d => d[0]), del: window.__del.map(d => d[1]), held: pendingRemoval && pendingRemoval.id }));
  ok('P8 an empty city\'s picker: "Remove Philadelphia? Nothing is filed here."; a second remove while one is held commits the first (Malmö\'s places deleted, then its row); Philadelphia\'s is now the held one', held1 === 0 && /^Remove Philadelphia\? Nothing is filed here\./.test(pph) && p8.pdel.includes('locations') && p8.del.includes('malmo') && !p8.del.includes('philadelphia') && p8.held === 'philadelphia', { held1, pph, p8 });
  await menuOpen(); await ev(() => rmShowPicker('reykjavik')); await W(300);
  await ev(() => { window.__pdel = []; window.__del = []; document.querySelector('#titleMenu .rm-dest.is-too').click(); }); await W(300);
  await ev(() => { Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' }); document.dispatchEvent(new Event('visibilitychange')); }); await W(1200);
  const p9 = await ev(() => ({ pdel: window.__pdel.map(d => d[0]), del: window.__del.map(d => d[1]), slip: document.getElementById('planSlip').hidden }));
  await ev(() => { delete document.visibilityState; });
  ok('P9 the app is backgrounded (visibilitychange hidden): a held removal is committed at once (and its Undo goes)', p9.pdel.includes('locations') && p9.del.includes('reykjavik') && p9.slip, p9);
  ok('P10 no page errors', o.errors.length === 0, o.errors);
  await page.context().close();


  // X. the combined CD + UX check's fixes (2026-11-03)
  o = await L.open(b, { file, storage: { 'gh.plans': '1', 'triplet.reorderHint': '1', 'triplet.hiddenCities': '["la"]' } }); page = o.page;
  // J8: an open plan's add-from list crosses cities -- every city, the picked one first, with the eyes
  await ev(() => { setActiveCity('malmo', { frame: false }); }); await W(400);
  await ev(() => choosePlan('gh-p')); await W(1200);
  const x1 = await ev(() => { const list = [...document.getElementById('locationsList').children], ri = list.indexOf(document.querySelector('.plan-rule'));
    return list.slice(ri + 1).filter(e => e.matches('.sec-head')).map(e => [e.dataset.city, !!e.querySelector('.sec-eye'), e.classList.contains('is-hidden')]); });
  ok('X1 Malmö picked, a plan open: the add-from list shows every city (Malmö\'s section first), each with All places\' eye (LA hidden)', JSON.stringify(x1) === JSON.stringify([['malmo', true, false], ['la', true, true], ['reykjavik', true, false], ['copenhagen', true, false], ['stockholm', true, false]]), x1);
  ok('X2 ... and its rows: places from other cities are offered too; the plan stays open', await ev(() => inPlanView() && activePlanId === 'gh-p' && [...document.querySelectorAll('#locationsList .location-card:not(.is-stop)')].some(e => (rowItem(e.dataset.id) || {}).city === 'copenhagen')));
  await ev(() => { setListView('places', { frame: false }); setActiveCity(ALL_CITIES, { frame: false }); hiddenCities.clear(); persistHiddenCities(); updateUI(); const f = badgeFitView(); if (f) map.setView(f.center, f.zoom, { animate: false }); }); await W(800);
  // signed out: the board reads SIGN IN and the sign never turns
  await ev(() => { currentUser = null; }); await P.tap(page, '#titleBtn'); await W(300);
  const x3 = await ev(() => { const r = document.querySelector('#titleMenu .menu-city[data-city="copenhagen"]'); rmSetDrag(r, -100, true); const mid = !!document.querySelector('#map .sp-board.is-turned'); rmSetOpen(r, true);
    return { mid, open: !!document.querySelector('#map .sp-board.is-turned'), board: r.querySelector('.rm-board').textContent, signs: document.querySelectorAll('#map .sp-board').length }; });
  ok('X3 signed out: the board reads SIGN IN and the map sign does NOT turn to SEE YOU SOON? (mid-drag or open)', x3.board === 'Sign in' && !x3.mid && !x3.open && x3.signs >= 3, x3);
  await ev(() => { currentUser = { email: 'adamtrabold@gmail.com' }; closeTitleMenu(false); }); await W(300);
  // a post that fits within a pixel shows
  const x4 = await ev(() => { const safe = badgeSafeRect(), saved = rectOf;
    rectOf = () => ({ x0: safe.left - 0.4, x1: safe.right + 0.5, y0: safe.top, y1: safe.bottom + 0.9 }); const within = fitsAt({}, safe);
    rectOf = () => ({ x0: safe.left, x1: safe.right + 1.5, y0: safe.top, y1: safe.bottom }); const over = fitsAt({}, safe);
    rectOf = saved; return { within, over }; });
  ok('X4 a signpost that fits within a pixel shows (the Copenhagen+Malmö post at 382.5 against 382 vanished); 1.5px over still hides it', x4.within && !x4.over, x4);
  // Find a city: "≈ 45 km" never breaks; far results rank by importance
  await ev(ll => map.setView(ll, 9, { animate: false }), [64.15, -21.94]); await W(400);
  await P.tap(page, '#titleBtn'); await W(300);
  await tapIn('#titleMenu [data-act="newcity"]'); await L.findCity(page, 'titleMenu', 'Philadelphia');
  const x5 = await ev(() => [...document.querySelectorAll('#titleMenu .menu-res')].map(r => [r.querySelector('.add-res-name').textContent, r.querySelector('.add-res-where').textContent]));
  ok('X5 "≈ n km" is held together (no-break spaces): a wrapped line never leaves a lone ≈', x5.length && x5.every(([, w]) => /≈ [\d,]+ km away$/.test(w)), x5);
  ok('X6 every result far from the place (all > 300 km): ranked by OSM importance -- Philadelphia, Pennsylvania first, not the nearest village', /Pennsylvania/.test(x5[0][1]) && /Mississippi/.test(x5[1][1]), x5.map(r => r[0] + ' / ' + r[1]));
  ok('X6b a result whose own name matches what you typed ranks above one found by an alt name: every Philadelphia before Amman', x5[x5.length - 1][0] === 'Amman' && x5.slice(0, -1).every(([n]) => n === 'Philadelphia'), x5.map(r => r[0] + ' / ' + r[1]));
  await ev(() => closeTitleMenu(false)); await W(200);
  await page.context().close();
  // focus: a keyboard commit lands on the slip's Undo; a mouse click on the board, on the picker's first choice
  o = await L.open(b, { file, w: 800, h: 900, touch: false, storage: { 'triplet.hiddenCities': '[]' } }); page = o.page;
  await ev(() => setActiveCity(ALL_CITIES, { frame: false })); await W(400);
  await page.click('#titleBtn'); await W(300);
  await ev(() => rmSetOpen(document.querySelector('#titleMenu .menu-city[data-city="stockholm"]'), true)); await W(400);
  const bd = await ev(() => { const r = document.querySelector('#titleMenu .menu-city[data-city="stockholm"] .rm-board').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
  await page.mouse.click(bd.x, bd.y); await W(500);
  const x7 = await ev(() => ({ pick: !!document.querySelector('#titleMenu .rm-pick[data-pick="stockholm"]'), focus: document.activeElement && document.activeElement.classList.contains('rm-dest') && document.activeElement === document.querySelector('#titleMenu .rm-pick .rm-dest') }));
  ok('X7 a mouse click on the REMOVE board opens the picker with focus on its first choice', x7.pick && x7.focus, x7);
  await page.keyboard.press('Enter'); await W(1200);
  const x8 = await ev(() => ({ slip: !document.getElementById('planSlip').hidden, focus: document.activeElement === document.querySelector('#planSlip button'), tag: document.activeElement && document.activeElement.tagName }));
  ok('X8 a keyboard commit (Enter on a destination): focus goes to the slip\'s Undo, not <body>', x8.slip && x8.focus, x8);
  ok('X9 no page errors', o.errors.length === 0, o.errors);
  await page.context().close();


  // T. v13: the picker takes over the menu box; the two-line slip
  const EXTRA = [['philadelphia', 'Philadelphia', 39.95, -75.16], ['wilmington', 'Wilmington', 39.75, -75.55], ['lewes', 'Lewes', 38.77, -75.14], ['baltimore', 'Baltimore', 39.29, -76.61],
    ['annapolis', 'Annapolis', 38.98, -76.49], ['capemay', 'Cape May', 38.94, -74.91], ['newyork', 'New York', 40.71, -74.01], ['princeton', 'Princeton', 40.35, -74.66]];
  const pickBox = () => ev(() => { const m = document.getElementById('titleMenu'), r = m.getBoundingClientRect(), d = m.querySelector('.rm-dests:not([hidden])'), f = m.querySelector('.rm-foot').getBoundingClientRect(), q = m.querySelector('.rm-q').getBoundingClientRect(), held = m.querySelector('.menu-city.is-held').getBoundingClientRect();
    return { top: r.top, bottom: r.bottom, h: r.height, w: r.width, left: r.left, scroll: d.scrollHeight > d.clientHeight + 1, more: [d.classList.contains('more-above'), d.classList.contains('more-below')], foot: [f.top >= r.top && f.bottom <= r.bottom + 0.5, f.bottom <= innerHeight],
      head: held.top - r.top <= 1.5 && q.top >= held.bottom - 1, visible: [...m.children].filter(c => c.offsetParent !== null).map(c => c.className.split(' ')[0]), rows: m.querySelectorAll('.rm-dests .rm-dest').length }; });
  for (const [w, h] of [[390, 844], [375, 667]]) {
    o = await L.open(b, { file, w, h, storage: { 'triplet.hiddenCities': '[]' } }); page = o.page;
    await ev(E => { E.forEach(([id, label, la, ln]) => { CITIES[id] = { label, center: [la, ln], zoom: 12, viewbox: `${ln - .1},${la - .1},${ln + .1},${la + .1}` }; }); setActiveCity(ALL_CITIES, { frame: false }); }, EXTRA); await W(400);
    await P.tap(page, '#titleBtn'); await W(300);
    const before = await ev(() => { const r = document.getElementById('titleMenu').getBoundingClientRect(); return { top: r.top, bottom: r.bottom, w: r.width, left: r.left }; });
    await ev(() => rmShowPicker('stockholm')); await W(400);
    const t = await pickBox();
    if (w === 390) {
      ok('T1 390x844: the picker takes over the box -- only the held row (its board open) and the picker show; All places, the other cities, New city and Plans are hidden', JSON.stringify(t.visible) === '["menu-city","rm-pick"]' && t.head && await ev(() => document.querySelector('#titleMenu .menu-city.is-held').dataset.open === '1'), t);
      ok('T2 390x844, 12 destinations: the box grows UP from the menu\'s bottom to fit them all (no scroll), its width max(menu, min(100vw - 32, 340)), its left edge unchanged; Remove-too and Keep in the pinned foot', Math.abs(t.bottom - before.bottom) < 1 && t.top < before.top && t.top >= 82 - 0.5 && !t.scroll && t.rows === 12 && Math.abs(t.w - Math.max(before.w, Math.min(390 - 32, 340))) < 1 && Math.abs(t.left - before.left) < 0.5 && t.foot.every(Boolean) && !t.more[1], { before, t });
    } else {
      const t0 = t;
      await ev(() => { const d = document.querySelector('#titleMenu .rm-dests:not([hidden])'); d.scrollTop = 60; d.dispatchEvent(new Event('scroll')); }); await W(200);
      const t1 = await pickBox();
      ok('T3 375x667: the box stops 8px under the top controls (82px), the destinations scroll with the scroll shadow (below; above once scrolled), Remove-too and Keep pinned and on screen', Math.abs(t0.top - 82) < 0.6 && Math.abs(t0.bottom - before.bottom) < 1 && t0.scroll && t0.more[1] && !t0.more[0] && t1.more[0] && t0.foot.every(Boolean) && t1.foot.every(Boolean) && t0.head, { before, t0, t1 });
      await page.keyboard.press('Escape'); await W(400);
      const e1 = await ev(() => ({ open: !document.getElementById('titleMenu').hidden, picking: document.getElementById('titleMenu').classList.contains('is-picking'), rows: [...document.querySelectorAll('#titleMenu .menu-row')].filter(r => r.offsetParent !== null).length, board: document.querySelector('#titleMenu .menu-city[data-city="stockholm"]').dataset.open, h: document.getElementById('titleMenu').getBoundingClientRect().top }));
      ok('T4 Esc leaves the picker: the menu\'s rows and its box come back (the menu stays open), the board shut', e1.open && !e1.picking && e1.rows >= 8 && e1.board !== '1' && Math.abs(e1.h - before.top) < 1, e1);
      await ev(() => rmShowPicker('stockholm')); await W(300);
      await page.touchscreen.tap(360, 30); await W(400);
      ok('T5 a tap outside the picker brings the menu back too (it stays open)', await ev(() => !document.getElementById('titleMenu').hidden && !document.getElementById('titleMenu').classList.contains('is-picking')));
      // the slip at 375 with a long name: line 1 may cut, line 2 never
      await ev(() => { CITIES.stockholm.label = 'East Marlborough Township'; menuSig = null; renderTitleMenu(); }); await W(200);
      await ev(() => rmShowPicker('stockholm')); await W(300);
      await ev(() => document.querySelector('#titleMenu .rm-dest[data-rm-to="philadelphia"]').click()); await W(1500);
      const sl = await ev(() => { const s = document.getElementById('planSlip'), l1 = s.querySelector('.slip-l1'), l2 = s.querySelector('.slip-l2'), hd = document.getElementById('locationsHeader').getBoundingClientRect(), r = s.getBoundingClientRect();
        return { two: s.classList.contains('two-line'), l1: l1.textContent, l2: l2.textContent, l2cut: l2.scrollWidth > l2.clientWidth + 0.5 || l2.getBoundingClientRect().right > s.querySelector('button').getBoundingClientRect().left + 0.5, h: r.height, hh: hd.height, top: Math.abs(r.top - hd.top) < 0.5,
          c1: getComputedStyle(l1).color, c2: getComputedStyle(l2).color, f1: getComputedStyle(l1).fontSize, f2: getComputedStyle(l2).fontSize }; });
      ok('T6 375: the two-line Undo slip on the list header (its height): "East Marlborough Township removed" (grey 11px) / "Its places → Philadelphia" (navy 13px, never cut, no-break spaces round the arrow)', sl.two && sl.l1 === 'East Marlborough Township removed' && sl.l2 === 'Its places → Philadelphia' && !sl.l2cut && sl.top && Math.abs(sl.h - sl.hh) < 0.5 && sl.c1 === 'rgb(90, 86, 76)' && sl.c2 === 'rgb(18, 41, 63)' && sl.f1 === '11px' && sl.f2 === '13px', sl);
    }
    await page.context().close();
  }
  o = await L.open(b, { file, w: 1280, h: 800, touch: false, storage: { 'triplet.hiddenCities': '[]' } }); page = o.page;
  await ev(E => { E.forEach(([id, label, la, ln]) => { CITIES[id] = { label, center: [la, ln], zoom: 12, viewbox: `${ln - .1},${la - .1},${ln + .1},${la + .1}` }; }); setActiveCity(ALL_CITIES, { frame: false }); }, EXTRA); await W(400);
  await page.click('#titleBtn'); await W(300);
  const dtop = await ev(() => document.getElementById('titleMenu').getBoundingClientRect().top);
  await ev(() => rmShowPicker('stockholm')); await W(400);
  const t7 = await pickBox();
  ok('T7 desktop (the rail, 1280x800): the picker opens DOWN from the menu\'s top and runs to 16px above the window\'s foot; with v14\'s new-city line the 12th city scrolls just under it (v14 "Fit"); the foot on screen', Math.abs(t7.top - dtop) < 0.5 && Math.abs(t7.bottom - (800 - 16)) < 0.5 && t7.rows === 12 && t7.foot.every(Boolean), { dtop, t7 });
  await page.context().close();


  // Y. v14: the picker's "+ A new city…" line, the destructive foot, the band, Cancel (the owner's copy)
  for (const [w, h] of [[390, 844], [375, 667]]) {
    o = await L.open(b, { file, w, h, storage: { 'triplet.hiddenCities': '[]' } }); page = o.page;
    await ev(() => setActiveCity(ALL_CITIES, { frame: false })); await W(400);
    await P.tap(page, '#titleBtn'); await W(300);
    await ev(() => rmShowPicker('copenhagen')); await W(400);
    const y = await ev(() => { const p = document.querySelector('#titleMenu .rm-pick'), m = document.getElementById('titleMenu').getBoundingClientRect(), q = p.querySelector('.rm-q'), nl = p.querySelector('.rm-new'), inp = nl && nl.querySelector('input'),
      too = p.querySelector('.rm-foot .is-too'), band = p.querySelector('.rm-band'), keep = p.querySelector('.rm-foot .is-keep'), mine = p.querySelector('.rm-mine');
      const kids = [...p.children].map(c => c.className.split(' ').filter(x => /^rm-|^menu-find$/.test(x)).join('.'));
      return { q: q.textContent, ph: inp && inp.placeholder, font: inp && getComputedStyle(inp).fontSize, order: kids, qRule: getComputedStyle(q).borderBottomColor, nlRule: getComputedStyle(nl).borderBottomColor,
        too: too.textContent, bin: !!too.querySelector('svg.rm-bin'), tooInk: getComputedStyle(too).color, tooBg: getComputedStyle(too).backgroundColor, tooW: getComputedStyle(too).fontWeight,
        band: [band.getBoundingClientRect().height, getComputedStyle(band).backgroundColor, getComputedStyle(band).borderBottomColor], keep: keep.textContent, keepBg: getComputedStyle(keep).backgroundColor,
        onScreen: [nl.getBoundingClientRect(), too.getBoundingClientRect(), keep.getBoundingClientRect()].every(r => r.top >= m.top - 0.5 && r.bottom <= m.bottom + 0.5 && r.bottom <= innerHeight), mineRows: mine.querySelectorAll('.rm-dest').length }; });
    if (w === 390) {
      ok('Y1 the owner\'s copy: "Should we move Copenhagen’s places to a new city?" / "Remove places too" / "Cancel"', y.q === 'Should we move Copenhagen’s places to a new city?' && y.too === 'Remove places too' && y.keep === 'Cancel', y);
      ok('Y2 the "+ A new city…" line pinned under the question (16px entry; a hair rule above it, the navy rule below), then your cities', y.ph === 'A new city…' && y.font === '16px' && y.order.join('|') === 'rm-q|menu-find.rm-new|rm-dests.rm-found|rm-dests.rm-mine|rm-foot' && y.qRule === 'rgb(216, 206, 186)' && y.nlRule === 'rgb(18, 41, 63)' && y.mineRows === 4, y);
      ok('Y3 the foot: the destructive row (an 18px bin, ink, bold, on --paper), an 8px --paper-pressed band (navy below), then Cancel on its own (--paper-raised)', y.bin && y.tooInk === 'rgb(26, 26, 24)' && y.tooW === '700' && y.tooBg === 'rgb(242, 235, 221)' && Math.abs(y.band[0] - 9) < 1.5 && y.band[1] === 'rgb(220, 211, 195)' && y.band[2] === 'rgb(18, 41, 63)' && y.keepBg === 'rgb(250, 245, 234)', y);
      const ty = await ev(() => { const p = document.querySelector('#titleMenu .rm-pick'), cs = e => getComputedStyle(e), q = p.querySelector('.rm-q'), lab = p.querySelector('.rm-mine .rm-dest .menu-lab'), km = p.querySelector('.rm-mine .rm-km'),
        too = p.querySelector('.is-too .menu-lab'), keep = p.querySelector('.is-keep .menu-lab'), cap = document.createElement('div'); cap.className = 'menu-cap'; document.body.appendChild(cap); const capF = cs(cap).fontSize; cap.remove();
        return { q: [cs(q).fontSize, cs(q).textTransform, cs(q).color], capF, lab: cs(lab).fontSize, too: cs(too).fontSize, keep: cs(keep).fontSize, km: [km.classList.contains('tally'), cs(km).fontSize] }; });
      ok('Y11 the picker uses the menu\'s own type only: the question in the caption style (10px caps, --ink-2), rows / "Remove places too" / "Cancel" in the row label (13px), distances in the tally (11px floor)', ty.q[0] === ty.capF && ty.q[0] === '10px' && ty.q[1] === 'uppercase' && ty.q[2] === 'rgb(90, 86, 76)' && ty.lab === '13px' && ty.too === '13px' && ty.keep === '13px' && ty.km[0] && ty.km[1] === '11px', ty);
      // typing swaps the middle for real-city results; clearing brings your cities back
      const y0 = await ev(() => { const r = document.getElementById('titleMenu').getBoundingClientRect(); return { top: r.top, bottom: r.bottom }; });
      await ev(() => { const i = document.querySelector('#titleMenu .rm-new input'); i.focus(); }); await W(100);
      await L.findCity(page, 'titleMenu', 'Philadelphia');
      const y4 = await ev(() => { const p = document.querySelector('#titleMenu .rm-pick'); return { mine: p.querySelector('.rm-mine').hidden, found: p.querySelector('.rm-found').hidden, first: (p.querySelector('.rm-found .menu-res') || {}).textContent }; });
      const fit = await ev(() => { const m = document.getElementById('titleMenu'), r = m.getBoundingClientRect(), p = m.querySelector('.rm-pick'), foot = p.querySelector('.rm-foot').getBoundingClientRect(), f = p.querySelector('.rm-found'), last = [...f.children].pop().getBoundingClientRect();
        return { gap: foot.top - last.bottom, footBottom: r.bottom - foot.bottom, bottom: r.bottom, scroll: f.scrollHeight > f.clientHeight + 1 }; });
      ok('Y4b typing a new city: the box shrinks to fit the results (the foot right under them, no empty paper), keeping its bottom edge', fit.gap >= -0.5 && fit.gap <= 1.5 && fit.footBottom <= 1.5 && !fit.scroll && Math.abs(fit.bottom - y0.bottom) < 1, { fit, y0 });
      ok('Y4 typing in the line swaps your cities for real-city results (Philadelphia, Pennsylvania first)', y4.mine && !y4.found && /^PhiladelphiaCity · Pennsylvania/.test(y4.first || ''), y4);
      await ev(() => { const i = document.querySelector('#titleMenu .rm-new input'); i.value = ''; i.dispatchEvent(new Event('input', { bubbles: true })); }); await W(300);
      ok('Y5 clearing the line brings your cities back (and the box back to its size)', await ev(y0 => { const p = document.querySelector('#titleMenu .rm-pick'), r = document.getElementById('titleMenu').getBoundingClientRect(); return !p.querySelector('.rm-mine').hidden && p.querySelector('.rm-found').hidden && Math.abs(r.top - y0.top) < 1 && Math.abs(r.bottom - y0.bottom) < 1; }, y0));
      // one step: tap a result -> the city is made, the places move there, the old city goes; Undo undoes all of it
      await L.findCity(page, 'titleMenu', 'Philadelphia');
      const cph = await ev(() => locations.filter(l => l.city === 'copenhagen').map(l => l.id));
      await ev(() => { window.__ins = []; window.__upd = []; window.__del = []; document.querySelector('#titleMenu .rm-found .menu-res').click(); }); await W(1800);
      const y6 = await ev(ids => ({ ins: window.__ins.map(x => [x[0], x[1][0].id, x[1][0].auto_added]), upd: window.__upd.map(u => [u[0], u[1].city, u[2]]), del: window.__del.map(d => d[1] || d[0]), gone: !CITIES.copenhagen, made: !!CITIES.philadelphia,
        moved: ids.every(k => (rowItem(k) || {}).city === 'philadelphia'), slip: document.querySelector('#planSlip .slip-l2') && document.querySelector('#planSlip .slip-l2').textContent }), cph);
      ok('Y6 tapping a result: one step -- Philadelphia is made (kept), Copenhagen\'s places move there, Copenhagen goes; the slip "Its places → Philadelphia"', JSON.stringify(y6.ins) === '[["cities","philadelphia",false]]' && y6.upd.length === 2 && y6.upd.every(u => u[1] === 'philadelphia') && y6.gone && y6.made && y6.moved && y6.slip === 'Its places → Philadelphia', y6);
      await ev(() => { window.__del = []; document.querySelector('#planSlip button').click(); }); await W(1500);
      const y7 = await ev(ids => ({ back: !!CITIES.copenhagen, made: !!CITIES.philadelphia, home: ids.every(k => (rowItem(k) || {}).city === 'copenhagen'), del: window.__del.length }), cph);
      ok('Y7 Undo: Copenhagen back, its places home, and the city the line made (Philadelphia) removed again', y7.back && !y7.made && y7.home && y7.del >= 1, y7);
      // a result that is one of your cities is that city's row
      await P.tap(page, '#titleBtn'); await W(300); await ev(() => rmShowPicker('copenhagen')); await W(300);
      await ev(() => { const i = document.querySelector('#titleMenu .rm-new input'); i.focus(); }); await L.findCity(page, 'titleMenu', 'Reykjavik');
      await ev(() => { window.__ins = []; window.__upd = []; document.querySelector('#titleMenu .rm-found .menu-res').click(); }); await W(1500);
      ok('Y8 a result that is one of your cities (Reykjavík) moves the places there: no new city', await ev(() => !window.__ins.length && window.__upd.every(u => u[1].city === 'reykjavik') && !CITIES.copenhagen && document.querySelector('#planSlip .slip-l2').textContent === 'Its places → Reykjavík'));
      await ev(() => document.querySelector('#planSlip button').click()); await W(1200);
      // the empty city: v4's question, the destructive row and Cancel only, no new-city line
      await ev(() => { CITIES.emptyville = { label: 'Emptyville', center: [60, 10], zoom: 12, viewbox: '9.9,59.9,10.1,60.1', auto: false }; menuSig = null; }); await P.tap(page, '#titleBtn'); await W(300);
      await ev(() => rmShowPicker('emptyville')); await W(300);
      const y9 = await ev(() => { const p = document.querySelector('#titleMenu .rm-pick'); return { q: p.querySelector('.rm-q').textContent, line: !!p.querySelector('.rm-new'), rows: [...p.querySelectorAll('.rm-dest')].map(b => b.textContent), band: !!p.querySelector('.rm-band') }; });
      ok('Y9 an empty city: "Remove Emptyville? Nothing is filed here." with only the destructive row and Cancel (no new-city line)', y9.q === 'Remove Emptyville? Nothing is filed here.' && !y9.line && JSON.stringify(y9.rows) === '["Remove Emptyville","Cancel"]' && y9.band, y9);
    } else {
      ok('Y10 375x667: the new-city line and the whole foot (Remove places too, the band, Cancel) are on screen', y.onScreen, y);
    }
    await page.context().close();
  }

  // the title menu's row tally at the type floor (owner: "dont accept" 10.4px); a long name still fits at 375
  o = await L.open(b, { file, w: 375, h: 667, storage: { 'triplet.hiddenCities': '[]' } }); page = o.page;
  await ev(() => { CITIES.stockholm.label = 'East Marlborough Township'; setActiveCity(ALL_CITIES, { frame: false }); }); await W(400);
  await P.tap(page, '#titleBtn'); await W(300);
  const z1 = await ev(() => { const r = document.querySelector('#titleMenu .menu-city[data-city="stockholm"] .menu-row'), lab = r.querySelector('.menu-lab'), t = r.querySelector('.tally'), m = document.getElementById('titleMenu').getBoundingClientRect();
    return { size: getComputedStyle(t).fontSize, whole: lab.scrollWidth <= lab.clientWidth + 0.5, tallyIn: t.getBoundingClientRect().right <= r.getBoundingClientRect().right - 12 + 0.5, menuIn: m.right <= innerWidth, h: r.getBoundingClientRect().height }; });
  ok('Z1 the title menu\'s row tally is 11px (the type floor, as elsewhere); at 375 "East Marlborough Township 23" still fits its 40px row, whole', z1.size === '11px' && z1.whole && z1.tallyIn && z1.menuIn && z1.h === 40, z1);
  await page.context().close();

  // W. trackpad: continuous wheel streams with no quiet gap (the owner's Mac log: 550 events in 10.8s)
  o = await L.open(b, { file, w: 800, h: 900, touch: false }); page = o.page;
  await ev(() => { hiddenCities.clear(); persistHiddenCities(); setActiveCity(ALL_CITIES, { frame: false }); }); await W(400);
  await page.click('#titleBtn'); await W(300);
  const wrow = id => ev(id => { const r = document.querySelector(`#titleMenu .menu-city[data-city="${id}"]`); const b = r.getBoundingClientRect(); return { x: b.left + b.width * 0.6, y: b.top + b.height / 2, open: r.dataset.open === '1', w: parseFloat(r.querySelector('.rm-clip').style.width || '0') }; }, id);
  const SWIPE = [3, 8, 15, 22, 26, 24, 20, 16, 13, 10, 8, 6, 5, 4, 3, 2, 2, 1, 1, 1];   // one swipe: a push, then momentum decaying
  const stream = async (deltas, sign = 1, axis = 'x') => { for (const d of deltas) { await page.mouse.wheel(axis === 'x' ? sign * d : 0, axis === 'y' ? sign * d : 0); await W(18); } };
  let wa = await wrow('copenhagen'); await page.mouse.move(wa.x, wa.y);
  await stream(SWIPE);   // fingers left: deltaX > 0
  const w1 = await wrow('copenhagen');
  ok('W1 a two-finger swipe left on a row opens it (snaps at the open width); its momentum tail doesn\'t stretch the board', w1.open && Math.abs(w1.w - 132) < 0.5, w1);
  await stream(SWIPE, -1);   // straight into a swipe back, no gap: the stream turns around
  await W(250);
  ok('W2 with no quiet gap, a swipe back (the stream turns around) is heard at once: it closes', !(await wrow('copenhagen')).open);
  // one swipe that drifts onto the next row belongs to the row it started on
  wa = await wrow('copenhagen'); const wb = await wrow('malmo');
  for (let i = 0; i < SWIPE.length; i++) { await page.mouse.move(wa.x, i < 6 ? wa.y : wb.y); await page.mouse.wheel(SWIPE[i], 0); await W(18); }
  await W(250);
  const w3 = [await wrow('copenhagen'), await wrow('malmo')];
  ok('W3 a swipe that drifts onto another row belongs to the row it started on', w3[0].open && !w3[1].open, w3);
  // the momentum tail runs straight into a new push over Malmö (it speeds up again after slowing): a new swipe
  await stream([26, 20, 14, 9, 6, 4, 3]);   // same row's tail, decaying (swallowed: already open)
  await page.mouse.move(wb.x, wb.y);
  await stream([6, 14, 22, 28, 24, 18, 12, 8, 5, 3, 2, 1]);
  await W(250);
  const w4 = [await wrow('copenhagen'), await wrow('malmo')];
  ok('W4 no gap between swipes: a new push (the stream speeds up after slowing) over Malmö is a new swipe -- it opens Malmö and closes Copenhagen', !w4[0].open && w4[1].open && Math.abs(w4[1].w - 132) < 0.5, w4);
  await stream([3, 6, 9, 8, 6, 4, 2, 1], 1, 'y'); await W(250);
  ok('W5 a vertical wheel leaves the board alone (the menu scrolls)', (await wrow('malmo')).open);
  await stream(SWIPE, -1); await W(250);
  await page.mouse.move((await wrow('stockholm')).x, (await wrow('stockholm')).y);
  await stream([4, 8, 8, 6, 4, 2]); await W(300);   // 32px
  ok('W6 32px of wheel stays shut (under 40%)', !(await wrow('stockholm')).open && !(await wrow('malmo')).open);
  // a wheel over the row's band that the browser hands to the menu (an edge) still counts
  const wl = await wrow('reykjavik');
  await ev(([x, y]) => { const m = document.getElementById('titleMenu'); [3, 8, 15, 22, 26, 24, 20, 16, 13, 10, 8, 6].forEach((d, i) => setTimeout(() => m.dispatchEvent(new WheelEvent('wheel', { deltaX: d, deltaY: 0, clientX: x, clientY: y, bubbles: true, cancelable: true })), i * 18)); }, [wl.x, wl.y]);
  await W(700);
  ok('W7 a wheel over a row\'s band aimed at something else (the menu) counts for that row', (await wrow('reykjavik')).open);
  // the long, gap-free run: four swipes on alternating rows, ~20ms apart, never quiet
  const order = [['la', 1], ['la', -1], ['copenhagen', 1], ['copenhagen', -1]];
  const seen = [];
  await stream(SWIPE, -1);   // close Reykjavík first, then straight on
  for (const [id, s] of order) { const p = await wrow(id); await page.mouse.move(p.x, p.y); await stream(SWIPE, s); seen.push([id, (await wrow(id)).open]); }
  ok('W8 a continuous stream (no quiet gap anywhere): each swipe is told apart by its turn-around or its new push -- LA opens, closes; Copenhagen opens, closes', JSON.stringify(seen) === JSON.stringify([['la', true], ['la', false], ['copenhagen', true], ['copenhagen', false]]), seen);
  ok('W9 no page errors', o.errors.length === 0, o.errors);
  await page.context().close();

  // S. signed out; reduced motion; 375x667
  o = await L.open(b, { file, w: 375, h: 667, reduced: true }); page = o.page;
  await ev(() => { currentUser = null; }); await P.tap(page, '#titleBtn'); await W(300);
  const s1 = await ev(() => document.querySelector('#titleMenu .menu-city[data-city="reykjavik"] .rm-board').textContent);
  await ev(() => document.querySelector('#titleMenu .menu-city[data-city="reykjavik"] .rm-board').click()); await W(400);
  ok('S1 signed out: the board reads SIGN IN; tapping it asks you to sign in (no picker, nothing written)', s1 === 'Sign in' && await ev(() => document.getElementById('authModal').classList.contains('show') && !document.querySelector('#titleMenu .rm-pick')), s1);
  await ev(() => { document.getElementById('authModal').classList.remove('show'); currentUser = { email: 'adamtrabold@gmail.com' }; closeTitleMenu(false); }); await W(300);
  await P.tap(page, '#titleBtn'); await W(300);
  const s2 = await ev(() => { const r = document.querySelector('#titleMenu .menu-city[data-city="reykjavik"]'); rmSetOpen(r, true); return getComputedStyle(r.querySelector('.rm-clip')).transitionDuration; });
  ok('S2 reduced motion: the board appears and leaves without sliding', s2 === '0s', s2);
  await ev(() => rmShowPicker('reykjavik')); await W(400);
  const s3 = await ev(() => { const m = document.getElementById('titleMenu').getBoundingClientRect(), p = document.querySelector('#titleMenu .rm-pick').getBoundingClientRect(), f = document.activeElement.getBoundingClientRect();
    return { m: [m.top, m.bottom], inView: m.top >= 0 && m.bottom <= innerHeight && m.right <= innerWidth, focusIn: f.top >= m.top - 0.5 && f.bottom <= m.bottom + 0.5, pickTop: p.top }; });
  ok('S3 375x667: the picker opens inside the menu, scrolled into view, its nearest city focused and on screen', s3.inView && s3.focusIn, s3);
  await page.context().close();
  await b.close();
  finish();
})();
