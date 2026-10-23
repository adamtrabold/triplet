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
  ok('C4 results: real cities only, nearest the place first: "Philadelphia / City · Pennsylvania, United States · ≈ 45 km away"; no "Village of", no county; at most 5', c4.length >= 2 && c4.length <= 5 && c4[0][0] === 'Philadelphia' && c4[0][1] === 'City · Pennsylvania, United States · ≈ 45 km away' && !c4.some(([n, w]) => /Village of|Town of|County/.test(n + w)) && c4.filter(([n, w]) => /New York/.test(w)).length === 1, c4);
  const c5 = await ev(() => { const m = document.getElementById('addCityMenu').getBoundingClientRect(), i = document.querySelector('#addCityMenu .menu-find-in').getBoundingClientRect(), r = document.querySelector('#addCityMenu .menu-res').getBoundingClientRect();
    return { inView: m.top >= 0 && m.bottom <= innerHeight, findIn: i.top >= m.top - 0.5 && i.bottom <= m.bottom + 0.5, resIn: r.top >= m.top - 0.5 && r.bottom <= m.bottom + 0.5 }; });
  ok('C5 the menu stays on screen, the search line and its first result in view', c5.inView && c5.findIn && c5.resIn, c5);
  await ev(() => document.querySelector('#addCityMenu .menu-res').click()); await W(250);
  const c6 = await ev(() => ({ line: document.getElementById('addCityName').textContent, stamp: !document.getElementById('addNewStamp').hidden, hand: addDraft.cityHand, menu: document.getElementById('addCityMenu').hidden, dist: document.getElementById('addDist').hidden, made: !!CITIES.philadelphia }));
  ok('C6 picking it files the place there at ADD: the line reads Philadelphia, NEW-stamped (a hand pick); nothing written yet', c6.line === 'Philadelphia' && c6.stamp && c6.hand && c6.menu && c6.dist && !c6.made, c6);
  await ev(() => { window.__ins = []; document.getElementById('submitBtn').click(); }); await W(2200);
  const c7 = await ev(() => window.__ins);
  const city7 = (c7.find(x => x[0] === 'cities') || [0, [{}]])[1][0], loc7 = (c7.find(x => x[0] === 'locations') || [0, [{}]])[1][0];
  ok('C7 ADD made Philadelphia from the result\'s own name, centre and box (auto-added, as today), then the place in it', JSON.stringify(c7.map(x => x[0])) === '["cities","locations"]' && city7.id === 'philadelphia' && city7.label === 'Philadelphia' && Math.abs(city7.center_lat - 39.9527237) < 1e-6 && city7.viewbox === '-75.280266,39.867005,-74.9558314,40.1379593' && city7.countrycodes === 'us' && city7.geocode_suffix === 'Philadelphia, United States' && city7.auto_added === true && loc7.city === 'philadelphia', c7);
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
  ok('E2 nearest the place first: Lewes, Delaware ("Town · Delaware, United States · ≈ n km away")', e2[0] && e2[0][0] === 'Lewes' && /^Town · Delaware, United States · ≈ \d+ km away$/.test(e2[0][1]) && e2.length === 3, e2);
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
  ok('E7 the auto city it left empty (Lewes) is cleaned up, as today', !f2.lewes && f2.del >= 1, f2);
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
  await b.close();
  finish();
})();
