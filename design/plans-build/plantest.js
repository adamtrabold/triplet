// Plans phase 1 suite: fail-soft without the tables, Places unchanged, the Places | Plans panel,
// the Plans view (order, NEXT, tiles, Edit stops, no sort), map numbers + diamonds, popups,
// persistence, poll/no-clobber, and the data layer (optimistic writes + rollback, login gate)
// against the in-memory Supabase double (stub.js).
//   VENDOR=<dir> node plantest.js
const { open, launch, FIX } = require('./harness');
const W = ms => new Promise(r => setTimeout(r, ms));
let pass = 0, total = 0; const fails = [];
const ok = (name, cond, info) => { total++; if (cond) pass++; else fails.push(name); console.log(`${cond ? 'PASS' : 'FAIL'} ${name}${info !== undefined ? ' ' + JSON.stringify(info) : ''}`); };
const NAVY = 'rgb(18, 41, 63)';
const base = { plans: FIX.plans, stops: FIX.stops, visited: ['mir'] };

const tap = async (page, sel) => {
  const r = await page.evaluate(sel => { const e = document.querySelector(sel); if (!e) return null; e.scrollIntoView({ block: 'nearest' }); const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }, sel);
  if (!r) throw new Error('no element ' + sel);
  await page.touchscreen.tap(r.x, r.y);
};
const openPanel = async page => { if (!(await page.evaluate(() => document.getElementById('filtersPanel').classList.contains('visible')))) { await tap(page, '#toggleFiltersBtn'); await W(400); } };
const closePanel = async page => { if (await page.evaluate(() => document.getElementById('filtersPanel').classList.contains('visible'))) { await tap(page, '#toggleFiltersBtn'); await W(400); } };
const toPlans = async page => { await openPanel(page); await tap(page, '#listSwitch [data-view="plans"]'); await W(700); };
const rowKeys = page => page.evaluate(() => [...document.querySelectorAll('#locationsList > *')].filter(e => e.offsetParent && (e.matches('.location-card, .plan-edit-row'))).map(e => e.classList.contains('plan-edit-row') ? 'EDIT' : (e.dataset.id || 'S' + e.dataset.shapeId)));
const tiles = page => page.evaluate(() => [...document.querySelectorAll('#locationsList .plan-tile')].map(t => (t.classList.contains('next') ? '*' : '') + t.textContent));
const h2 = page => page.evaluate(() => document.querySelector('#locationsHeader h2').textContent);
const shown = (page, sel) => page.evaluate(sel => { const e = document.querySelector(sel); return !!e && getComputedStyle(e).display !== 'none' && e.getClientRects().length > 0; }, sel);
const planCalls = page => page.evaluate(() => __calls.filter(c => (c.table === 'plans' || c.table === 'plan_stops') && c.op !== 'select'));

(async () => {
  const b = await launch();

  // ---------------------------------------------------------------- F: fail soft without the tables
  { const { ctx, page, errors, consoleErrors } = await open(b, { missing: true, storage: { 'triplet.listView': 'plans', 'triplet.activePlan': 'p-nor' } });
    const s = await page.evaluate(() => ({ view: listView, avail: plansAvailable, err: getComputedStyle(document.getElementById('error')).display, h2: document.querySelector('#locationsHeader h2').textContent,
      rows: document.querySelectorAll('#locationsList .location-card').length, x: document.querySelectorAll('#locationsList .delete-btn').length }));
    ok('F1 tables missing: no page/console errors, no error banner', !errors.length && !consoleErrors.length && s.err === 'none', { errors, consoleErrors, err: s.err });
    ok('F2 tables missing: a stored Plans view starts in Places, list exactly as today', s.view === 'places' && s.avail === false && /^Copenhagen list \(\d+\)$/.test(s.h2) && s.rows > 20 && s.x === s.rows, s);
    await toPlans(page);
    const note = await page.evaluate(() => document.getElementById('planLedger').textContent.trim());
    const empty = await page.evaluate(() => document.getElementById('locationsEmpty').textContent.trim());
    ok('F3 Plans side says plans aren’t available yet (panel and list), no rows, no New plan', note === 'Plans aren’t available yet.' && empty === 'Plans aren’t available yet.' && !(await page.$('.plan-new')) && (await rowKeys(page)).length === 0, { note, empty });
    ok('F4 Plans without tables: header "Plans", no ⇅, chips hidden', (await h2(page)) === 'Plans' && !(await shown(page, '#sortBtn')) && !(await shown(page, '#cityFilters')) && !(await shown(page, '#filters')));
    await tap(page, '#listSwitch [data-view="places"]'); await W(500);
    ok('F5 back to Places: list and header restored, still no errors', /^Copenhagen list/.test(await h2(page)) && (await page.evaluate(() => document.querySelectorAll('#locationsList .location-card').length)) > 20 && !errors.length && !consoleErrors.length);
    await page.evaluate(() => { pollTick(); }); await W(400);
    ok('F6 a poll with the tables still missing stays silent', !errors.length && !consoleErrors.length && (await page.evaluate(() => getComputedStyle(document.getElementById('error')).display)) === 'none');
    await ctx.close(); }

  // ---------------------------------------------------------------- P: Places unchanged + the panel's Places side
  { const { ctx, page, errors } = await open(b, base);
    const s = await page.evaluate(() => ({ view: listView, tiles: document.querySelectorAll('.plan-tile').length, nums: document.querySelectorAll('.pin-num').length,
      x: document.querySelectorAll('#locationsList .delete-btn').length, rows: document.querySelectorAll('#locationsList .location-card').length, edit: !!document.querySelector('#locationsList .plan-edit-row') }));
    ok('P1 default = Places: every row has its X, no stop tiles, no Edit stops row, no pin numbers', s.view === 'places' && !s.tiles && !s.nums && s.x === s.rows && !s.edit, s);
    ok('P2 Places header keeps its count and ⇅', /^Copenhagen list \(\d+\)$/.test(await h2(page)) && (await shown(page, '#sortBtn')));
    await openPanel(page);
    const p = await page.evaluate(() => { const r = [...document.querySelectorAll('#listSwitch [role="radio"]')];
      return { group: document.getElementById('listSwitch').getAttribute('role'), labels: r.map(e => e.textContent), checked: r.map(e => e.getAttribute('aria-checked')),
        cities: document.querySelectorAll('#cityFilters .city-btn').length, cats: document.querySelectorAll('#filters .filter-btn').length, ledger: getComputedStyle(document.getElementById('planLedger')).display,
        segH: document.querySelector('.seg').getBoundingClientRect().height, first: document.getElementById('filtersPanel').firstElementChild.className }; });
    ok('P3 panel: a radiogroup switch first, "Places" then "Plans", Places checked', p.group === 'radiogroup' && p.labels.join() === 'Places,Plans' && p.checked.join() === 'true,false' && p.first === 'seg-wrap', p);
    ok('P4 Places side keeps every chip (6 cities incl. All, 11 categories); no plan list', p.cities === 6 && p.cats === 11 && p.ledger === 'none', p);
    const tgt = await page.evaluate(() => [...document.querySelectorAll('#listSwitch button')].map(e => { const r = e.getBoundingClientRect(), a = getComputedStyle(e, '::before'); return r.height + parseFloat(a.top) * -1 + parseFloat(a.bottom) * -1; }));
    ok('P5 switch segments: 36px drawn, ≥44px target', tgt.every(h => h >= 44), tgt);
    ok('P6 no errors', !errors.length, errors);
    await ctx.close(); }

  // ---------------------------------------------------------------- N / V: Plans side + following
  { const { ctx, page, errors, consoleErrors } = await open(b, base);
    await toPlans(page);
    const led = await page.evaluate(() => [...document.querySelectorAll('#planLedger .plan-opt')].map(o => ({ name: (o.querySelector('.plan-name') || {}).textContent, ct: (o.querySelector('.plan-count') || {}).textContent || '',
      cur: (o.querySelector('.plan-pick') || {}).getAttribute ? o.querySelector('.plan-pick').getAttribute('aria-current') : null, more: !!o.querySelector('.plan-more'), h: o.getBoundingClientRect().height })));
    ok('N1 Plans side: every plan with its stop count, then New plan', led.map(l => l.name).join('|') === 'Nørrebro afternoon|Malmö + Copenhagen day|Tivoli tonight|Last full day before we fly home from Kastrup|Rainy day|New plan'
      && led.map(l => l.ct).join('|') === '6 stops|3 stops|1 stop|4 stops|0 stops|', led.map(l => l.name + ':' + l.ct));
    ok('N2 first plan opens by default; ✓ + ⋯ only on it; rows 45px', led[0].cur === 'true' && led.slice(1, 5).every(l => l.cur === 'false' && !l.more) && led[0].more && led.every(l => l.h === 45), led.map(l => [l.cur, l.more, l.h]));
    ok('N3 chips hidden on the Plans side', !(await shown(page, '#cityFilters')) && !(await shown(page, '#filters')));
    ok('N4 header = the plan name, no count; no ⇅; filters + locate stay', (await h2(page)) === 'Nørrebro afternoon' && !(await shown(page, '#sortBtn')) && (await shown(page, '#toggleFiltersBtn')) && (await shown(page, '#centerMeBtn')));
    ok('N5 panel stays open after picking', await page.evaluate(() => document.getElementById('filtersPanel').classList.contains('visible')));
    ok('V1 the plan in order: Edit stops, then pins and the shape interleaved by position', (await rowKeys(page)).join() === 'EDIT,mir,jae,cof,ass,S9001,bla', await rowKeys(page));
    ok('V2 outline tiles 1..6, only NEXT solid (stop 2: Mirabelle is visited)', (await tiles(page)).join() === '1,*2,3,4,5,6', await tiles(page));
    const t = await page.evaluate(() => { const n = document.querySelector('.plan-tile.next'), o = document.querySelector('.plan-tile:not(.next)'), cn = getComputedStyle(n), co = getComputedStyle(o);
      return { nBg: cn.backgroundColor, nFg: cn.color, oBg: co.backgroundColor, oB: co.borderTopColor, w: n.getBoundingClientRect().width, fs: parseFloat(cn.fontSize), role: n.getAttribute('role'), label: n.getAttribute('aria-label'), lo: o.getAttribute('aria-label') }; });
    ok('V3 NEXT tile = navy tile, paper numeral; others = navy outline on raised paper; 28px, 14px numerals; role img + labels', t.nBg === NAVY && t.nFg === 'rgb(242, 235, 221)' && t.oB === NAVY && t.oBg === 'rgb(250, 245, 234)' && t.w === 28 && t.fs >= 14 && t.role === 'img' && t.label === 'Stop 2 of 6, next' && t.lo === 'Stop 1 of 6', t);
    const r = await page.evaluate(() => ({ rows: [...document.querySelectorAll('#locationsList .location-card')].map(e => e.getBoundingClientRect().height), edit: document.querySelector('.plan-edit-row').getBoundingClientRect().height,
      head: document.getElementById('locationsHeader').getBoundingClientRect().height, x: document.querySelectorAll('#locationsList .delete-btn').length, slot: (() => { const a = document.querySelector('.location-card[data-id="jae"] .plan-tile').getBoundingClientRect(); return Math.round(innerWidth - a.right); })() }));
    ok('V4 rows 56px (Edit stops too), header 57px, no delete X in Plans, tile on the X\'s gutter', r.rows.every(h => h === 56) && r.edit === 56 && r.head === 57 && r.x === 0 && r.slot === 16, r);
    const e = await page.evaluate(() => { const b = document.querySelector('.plan-edit-row'); return { dis: b.getAttribute('aria-disabled'), txt: [...b.querySelectorAll('span')].map(x => x.textContent).join(' '), color: getComputedStyle(b).color }; });
    ok('V5 Edit stops = first row, unavailable with its reason (phase 1)', e.dis === 'true' && e.txt === 'Edit stops Coming next' && e.color === 'rgb(90, 86, 76)', e);
    await closePanel(page);
    const z0 = await page.evaluate(() => [map.getZoom(), map.getCenter().lat]);
    await tap(page, '.plan-edit-row'); await W(900);
    ok('V6 Edit stops is exempt from tap-to-fly: no move, no popup', JSON.stringify(await page.evaluate(() => [map.getZoom(), map.getCenter().lat])) === JSON.stringify(z0) && !(await page.$('.leaflet-popup')));
    // row tap: fly + popup "Stop n of m"
    await tap(page, '.location-card[data-id="jae"] .row-main'); await W(1600);
    const pop = await page.evaluate(() => ({ z: map.getZoom(), cat: (document.querySelector('.leaflet-popup .popup-cat') || {}).textContent, hl: document.querySelector('.location-card[data-id="jae"]').classList.contains('highlighted') }));
    ok('V7 a stop row flies (≥ SOLO_MIN_ZOOM) and opens its popup, which says "Stop 2 of 6"', pop.z >= 14 && /Stop\s2 of 6/.test(pop.cat.replace(/ /g, ' ')) && pop.hl, pop);
    const hlTile = await page.evaluate(() => { const c = getComputedStyle(document.querySelector('.location-card.highlighted .plan-tile')); return [c.backgroundColor, c.color]; });
    ok('V8 highlighted NEXT row: its tile reverses to a paper tile, navy numeral', hlTile[0] === 'rgb(242, 235, 221)' && hlTile[1] === NAVY, hlTile);
    await tap(page, '.location-card[data-shape-id="9001"] .row-main'); await W(1600);
    const sp = await page.evaluate(() => (document.querySelector('.leaflet-popup .shape-stop') || {}).textContent);
    ok('V9 a shape stop row flies and its popup says "Stop 5 of 6"', sp === 'Stop 5 of 6', sp);
    // map numbers at a stop-level zoom
    await page.evaluate(() => { map.closePopup(); setHighlighted(null); map.setView([55.6905, 12.5520], 15, { animate: false }); }); await W(500);
    const mk = await page.evaluate(() => {
      const out = {}; markersById.forEach((m, id) => { const el = m.marker.getElement(); const n = el && el.querySelector('.pin-num'); out[id] = { n: n && n.textContent, glyph: !!(el && el.querySelector('use[href^="#g-"]:not([href="#g-star"])')), fill: el && el.querySelector('circle') && el.querySelector('circle').getAttribute('fill'), z: m.marker.options.zIndexOffset }; });
      const d = [...planShapeMarkers.values()].map(e => { const el = e.marker.getElement(); return { n: el.querySelector('.pin-num').textContent, poly: !!el.querySelector('polygon') }; });
      return { out, d }; });
    ok('V10 zoom ≥14: every stop pin shows its number instead of the glyph', ['mir', 'jae', 'cof', 'ass', 'bla'].every((id, i) => mk.out[id] && mk.out[id].n === String([1, 2, 3, 4, 6][i]) && !mk.out[id].glyph), mk.out);
    ok('V11 NEXT pin is solid navy; the others paper', mk.out.jae.fill === '#12293F' && mk.out.mir.fill === '#F2EBDD', [mk.out.jae.fill, mk.out.mir.fill]);
    ok('V12 the district stop gets ONE numbered diamond (5)', mk.d.length === 1 && mk.d[0].n === '5' && mk.d[0].poly, mk.d);
    ok('V13 stop pins stack above starred pins (NEXT highest), below clusters', mk.out.jae.z === 560 && mk.out.cof.z === 550 && 550 > 500 && 560 < 600, [mk.out.jae.z, mk.out.cof.z]);
    ok('V14 only the plan\'s stops are on the map', Object.keys(mk.out).sort().join() === 'ass,bla,cof,jae,mir');
    await page.evaluate(() => map.setView([55.6905, 12.5520], 11, { animate: false })); await W(500);
    const far = await page.evaluate(() => ({ nums: document.querySelectorAll('.leaflet-marker-pane .pin-num').length, clusters: clusterMarkersById.size, diamonds: planShapeMarkers.size }));
    ok('V15 below GLYPH_MIN_ZOOM: no numbers anywhere, clusters keep their count', far.nums === 0 && far.diamonds === 0 && far.clusters >= 1, far);
    // NEXT follows visits
    await page.evaluate(async () => { await toggleLocationFlag('jae', 'visited'); }); await W(400);
    ok('V16 visiting NEXT moves it to the next unvisited stop', (await tiles(page)).join() === '1,2,*3,4,5,6', await tiles(page));
    await page.evaluate(async () => { await toggleLocationFlag('bla', 'visited'); }); await W(400);
    ok('V17 a later stop visited: NEXT is still the FIRST unvisited stop', (await tiles(page)).join() === '1,2,*3,4,5,6', await tiles(page));
    await page.evaluate(async () => { await toggleLocationFlag('cof', 'visited'); await toggleLocationFlag('ass', 'visited'); }); await W(400);
    ok('V18 all pins visited: the district before the last visited stop counts as passed, no NEXT', (await tiles(page)).join() === '1,2,3,4,5,6', await tiles(page));
    await page.evaluate(async () => { await toggleLocationFlag('bla', 'visited'); }); await W(400);
    ok('V19 un-visit the last stop: the district (no visited state) is NEXT again', (await tiles(page)).join() === '1,2,3,4,*5,6', await tiles(page));
    const stamp = await page.evaluate(() => getComputedStyle(document.querySelector('.location-card[data-id="mir"] .row-stamp')).color);
    ok('V20 the shared VISITED stamp is present and muted in Plans', /^color\(srgb|rgba/.test(stamp) && !/0\.82/.test(stamp), stamp);
    // filters ignored
    await page.evaluate(() => { filters.categories.cafe = false; filters.categories.area = false; filters.categories.district = false; setActiveCity('malmo', { frame: false }); }); await W(300);
    ok('V21 Plans ignores the city and category filters (the plan shows whole)', (await rowKeys(page)).join() === 'EDIT,mir,jae,cof,ass,S9001,bla', await rowKeys(page));
    await page.evaluate(() => { filters.categories.cafe = true; filters.categories.area = true; filters.categories.district = true; setActiveCity('copenhagen', { frame: false }); }); await W(300);
    ok('V22 no page or console errors', !errors.length && !consoleErrors.length, { errors, consoleErrors });
    await ctx.close(); }

  // ---------------------------------------------------------------- switching, spanning, empty, long names, exit
  { const { ctx, page } = await open(b, base);
    await toPlans(page);
    await tap(page, '#planLedger [data-plan="p-mc"]'); await W(900);
    ok('S1 switch plan: header + list follow, ✓ moves', (await h2(page)) === 'Malmö + Copenhagen day' && (await rowKeys(page)).join() === 'EDIT,lil,tiv,nyh'
      && (await page.evaluate(() => document.querySelector('[data-plan="p-mc"]').getAttribute('aria-current'))) === 'true', await rowKeys(page));
    const bounds = await page.evaluate(() => { const b = map.getBounds(); return ['lil', 'tiv', 'nyh'].every(id => { const l = locations.find(x => x.id === id); return b.contains([l.lat, l.lng]); }); });
    ok('S2 a plan spanning two cities frames every stop', bounds);
    const metas = await page.evaluate(() => [...document.querySelectorAll('#locationsList .location-card .row-meta')].map(e => e.textContent.split(',')[0].trim()));
    ok('S3 spanning plan: each row names its city', metas[0].includes('Malmö') && metas[1].includes('Copenhagen'), metas);
    await tap(page, '#planLedger [data-plan="p-empty"]'); await W(700);
    ok('S4 a plan with 0 stops: Edit stops + "No stops yet."', (await rowKeys(page)).join() === 'EDIT' && (await page.evaluate(() => document.getElementById('locationsEmpty').textContent.trim())) === 'No stops yet.' && (await shown(page, '#locationsEmpty')));
    await tap(page, '#planLedger [data-plan="p-long"]'); await W(700);
    const lg = await page.evaluate(() => { const h = document.querySelector('#locationsHeader h2'), n = document.querySelector('[data-plan="p-long"] .plan-name'); return { h: h.scrollWidth > h.clientWidth, e: getComputedStyle(h).textOverflow, n: n.scrollWidth > n.clientWidth, ne: getComputedStyle(n).textOverflow, lh: h.getBoundingClientRect().height }; });
    ok('S5 a long name ellipsizes on one line (header and panel), header stays one row', lg.h && lg.e === 'ellipsis' && lg.n && lg.ne === 'ellipsis' && lg.lh === 20, lg);
    await tap(page, '#planLedger [data-plan="p-nor"]'); await W(700);
    const fit = await page.evaluate(() => { const h = document.querySelector('#locationsHeader h2'), n = document.querySelector('[data-plan="p-nor"] .plan-name'); return [h.scrollWidth <= h.clientWidth, n.scrollWidth <= n.clientWidth, h.textContent.length]; });
    ok('S6 an 18-character name is never truncated (header, panel)', fit[0] && fit[1] && fit[2] === 18, fit);
    const twenty = await page.evaluate(() => { plans = plans.map(p => p.id === 'p-nor' ? { ...p, name: 'Østerbro and harbour' } : p); updateUI(); const h = document.querySelector('#locationsHeader h2'); return [h.textContent.length, h.scrollWidth <= h.clientWidth]; });
    ok('S7 a 20-character name fits the phone header untruncated', twenty[0] === 20 && twenty[1], twenty);
    // exit restores the city
    await page.evaluate(() => { plans = plans.map(p => p.id === 'p-nor' ? { ...p, name: 'Nørrebro afternoon' } : p); updateUI(); });
    const city0 = await page.evaluate(() => citySelection);
    await tap(page, '#listSwitch [data-view="places"]'); await W(1400);
    const ex = await page.evaluate(() => ({ city: citySelection, c: map.getCenter(), z: map.getZoom(), h: document.querySelector('#locationsHeader h2').textContent, sort: getComputedStyle(document.getElementById('sortBtn')).display, x: document.querySelectorAll('#locationsList .delete-btn').length, tiles: document.querySelectorAll('.plan-tile').length, edit: !!document.querySelector('.plan-edit-row') }));
    ok('X1 exit to Places: the city is unchanged and re-framed; list, count, ⇅ and X back; no plan marks', ex.city === city0 && ex.city === 'copenhagen' && Math.abs(ex.c.lat - 55.6761) < 0.01 && ex.z === 12 && /^Copenhagen list/.test(ex.h) && ex.sort !== 'none' && ex.x > 20 && !ex.tiles && !ex.edit, ex);
    const cities = await page.evaluate(() => getComputedStyle(document.getElementById('cityFilters')).display);
    ok('X2 the Places side shows its chips again', cities !== 'none');
    await ctx.close(); }

  // ---------------------------------------------------------------- no plans yet
  { const { ctx, page } = await open(b, { plans: [], stops: [] });
    await toPlans(page);
    const s = await page.evaluate(() => ({ led: document.getElementById('planLedger').textContent.replace(/\s+/g, ' ').trim(), empty: document.getElementById('locationsEmpty').textContent.trim(), h: document.querySelector('#locationsHeader h2').textContent, edit: !!document.querySelector('#locationsList .plan-edit-row') }));
    ok('E1 no plans yet: panel offers New plan, list says "No plans yet.", header "Plans", no Edit stops row', s.led === 'New plan' && s.empty === 'No plans yet.' && s.h === 'Plans' && !s.edit, s);
    await ctx.close(); }

  // ---------------------------------------------------------------- persistence
  { const { ctx, page } = await open(b, base);
    await toPlans(page); await tap(page, '#planLedger [data-plan="p-tiv"]'); await W(600);
    const st = await page.evaluate(() => [localStorage.getItem('triplet.listView'), localStorage.getItem('triplet.activePlan')]);
    ok('R1 view + active plan persist per device', st.join() === 'plans,p-tiv', st);
    await page.reload(); await W(1200);
    ok('R2 reload reopens that plan', (await h2(page)) === 'Tivoli tonight' && (await rowKeys(page)).join() === 'EDIT,tiv', await rowKeys(page));
    await page.evaluate(() => localStorage.setItem('triplet.activePlan', 'p-gone')); await page.reload(); await W(1200);
    ok('R3 a stored plan that no longer exists falls back to the first plan', (await h2(page)) === 'Nørrebro afternoon');
    await ctx.close(); }
  { const { ctx, page, errors } = await open(b, { ...base, init: () => { Storage.prototype.getItem = () => { throw new Error('denied'); }; Storage.prototype.setItem = () => { throw new Error('denied'); }; } });
    await toPlans(page);
    ok('R4 storage that throws: Plans still works (try/catch), no errors', (await h2(page)) === 'Nørrebro afternoon' && !errors.length, errors);
    await ctx.close(); }

  // ---------------------------------------------------------------- poll / reconcile: never clobbers the plan
  { const { ctx, page } = await open(b, base);
    await toPlans(page); await closePanel(page);
    const quiet = await page.evaluate(async () => { let n = 0; const mo = new MutationObserver(m => { n += m.length; }); mo.observe(document.getElementById('locationsList'), { subtree: true, childList: true, attributes: true, characterData: true });
      await fetchPlans(); await fetchLocations(); await W(50); mo.disconnect(); return n; function W(ms) { return new Promise(r => setTimeout(r, ms)); } });
    ok('C1 an unchanged poll touches nothing in the plan list', quiet === 0, quiet);
    await page.evaluate(async () => { __db.locations.find(r => r.id === 'cof').name = 'The Coffee Collective (Jgb)'; __db.locations.push({ id: 'new', name: 'Aaa new place', address: 'x', category: 'cafe', lat: 55.69, lng: 12.55, notes: null, visited: false, starred: false, city: 'copenhagen' }); await fetchLocations(); }); await W(300);
    ok('C2 a locations poll with changes keeps plan order and membership (no Places rows leak in)', (await rowKeys(page)).join() === 'EDIT,mir,jae,cof,ass,S9001,bla' && (await page.evaluate(() => document.querySelector('.location-card[data-id="cof"] h3').textContent)) === 'The Coffee Collective (Jgb)', await rowKeys(page));
    await page.evaluate(async () => { __db.plan_stops.push({ id: 'sx', plan_id: 'p-nor', location_id: 'tor', shape_id: null, position: 2.5 }); await fetchPlans(); }); await W(300);
    ok('C3 the other phone adds a stop: it lands at its position', (await rowKeys(page)).join() === 'EDIT,mir,jae,tor,cof,ass,S9001,bla' && (await tiles(page)).join() === '1,*2,3,4,5,6,7', await rowKeys(page));
    await page.evaluate(async () => { __db.plans = __db.plans.filter(p => p.id !== 'p-nor'); __db.plan_stops = __db.plan_stops.filter(s => s.plan_id !== 'p-nor'); await fetchPlans(); }); await W(300);
    ok('C4 the other phone deletes the open plan: this one moves to the first remaining plan', (await h2(page)) === 'Malmö + Copenhagen day', await h2(page));
    await ctx.close(); }
  { const { ctx, page } = await open(b, { ...base, writeDelay: 600 });
    await toPlans(page);
    const s = await page.evaluate(async () => { const p = renamePlan('p-nor', 'Nørrebro slow'); await new Promise(r => setTimeout(r, 100)); await fetchPlans(); const mid = document.querySelector('#locationsHeader h2').textContent; await p; return [mid, document.querySelector('#locationsHeader h2').textContent]; });
    ok('C5 a poll during an in-flight write never paints the old name back', s[0] === 'Nørrebro slow' && s[1] === 'Nørrebro slow', s);
    await ctx.close(); }

  // ---------------------------------------------------------------- writes through the panel
  { const { ctx, page, errors } = await open(b, base);
    await toPlans(page);
    await tap(page, '#planLedger [data-act="new"]'); await W(300);
    const focused = await page.evaluate(() => document.activeElement && document.activeElement.getAttribute('aria-label'));
    ok('W1 New plan opens a name field in place, focused', focused === 'New plan name', focused);
    await tap(page, '#planLedger [data-act="cancel"]'); await W(200);
    ok('W2 Cancel creates nothing', (await planCalls(page)).length === 0 && !!(await page.$('.plan-new')));
    await tap(page, '#planLedger [data-act="new"]'); await W(200);
    await page.keyboard.type('  Harbour   swim  '); await tap(page, '#planLedger [data-act="create"]'); await W(700);
    const c = await planCalls(page);
    ok('W3 Create: one insert (trimmed name, client uuid), the plan opens, panel stays open', c.length === 1 && c[0].table === 'plans' && c[0].op === 'insert' && c[0].payload[0].name === 'Harbour swim' && /^[0-9a-f-]{36}$/.test(c[0].payload[0].id)
      && (await h2(page)) === 'Harbour swim' && (await rowKeys(page)).join() === 'EDIT' && (await page.evaluate(() => document.getElementById('filtersPanel').classList.contains('visible'))), c);
    await tap(page, '#planLedger .plan-more'); await W(200);
    const acts = await page.evaluate(() => [...document.querySelectorAll('#planLedger .plan-form .plan-act')].map(b => b.textContent));
    ok('W4 ⋯ opens Rename / Delete plan / Cancel in the row', acts.join() === 'Rename,Delete plan,Cancel', acts);
    await tap(page, '#planLedger [data-act="rename"]'); await W(200);
    await page.evaluate(() => { const i = document.querySelector('#planLedger input'); i.select(); }); await page.keyboard.type('Harbour swim + sauna'); await page.keyboard.press('Enter'); await W(600);
    const c2 = (await planCalls(page)).slice(1);
    ok('W5 Rename (Enter saves): one update, header follows', c2.length === 1 && c2[0].op === 'update' && c2[0].payload.name === 'Harbour swim + sauna' && (await h2(page)) === 'Harbour swim + sauna', c2);
    await page.evaluate(() => { window.__confirmText = null; window.confirm = t => { __confirmText = t; return false; }; });
    await tap(page, '#planLedger .plan-more'); await W(150); await tap(page, '#planLedger [data-act="delete"]'); await W(300);
    ok('W6 Delete asks first ("Its places stay in your list."); Cancel deletes nothing', (await page.evaluate(() => __confirmText)) === 'Delete “Harbour swim + sauna”? Its places stay in your list.' && (await planCalls(page)).length === 2);
    await page.evaluate(() => { window.confirm = () => true; });
    await tap(page, '#planLedger .plan-more'); await W(150); await tap(page, '#planLedger [data-act="delete"]'); await W(700);
    const c3 = (await planCalls(page)).slice(2);
    ok('W7 Delete confirmed: one delete, the plan is gone, the first plan opens', c3.length === 1 && c3[0].op === 'delete' && (await h2(page)) === 'Nørrebro afternoon' && !(await page.evaluate(() => plans.some(p => p.name.startsWith('Harbour')))), c3);
    await page.evaluate(() => { window.confirm = () => true; });
    await tap(page, '#planLedger .plan-more'); await W(150); await tap(page, '#planLedger [data-act="delete"]'); await W(700);
    ok('W8 deleting a plan with stops removes its stops too (cascade), places stay', !(await page.evaluate(() => planStops.some(s => s.plan_id === 'p-nor'))) && (await page.evaluate(() => locations.some(l => l.id === 'mir'))) && (await h2(page)) === 'Malmö + Copenhagen day');
    ok('W9 no errors', !errors.length, errors);
    await ctx.close(); }

  // ---------------------------------------------------------------- failure rollback + login gate
  { const { ctx, page } = await open(b, { ...base, failWrites: true, writeDelay: 200 });
    await toPlans(page);
    const r = await page.evaluate(async () => {
      const p = createPlan('Doomed'); await new Promise(r => setTimeout(r, 50)); const mid = plans.some(x => x.name === 'Doomed'); const id = await p;
      const after = plans.some(x => x.name === 'Doomed'), err = document.getElementById('errorText').textContent;
      await renamePlan('p-nor', 'Renamed'); const nm = plans.find(x => x.id === 'p-nor').name;
      const n0 = planStops.length; await deletePlan('p-tiv'); const back = plans.some(x => x.id === 'p-tiv') && planStops.length === n0;
      return { mid, id, after, err, nm, back, h: document.querySelector('#locationsHeader h2').textContent };
    });
    ok('W10 a failed write shows at once (optimistic), then rolls back with the RLS message', r.mid && r.id === null && !r.after && /Access denied: Only authorized users can create the plan\./.test(r.err), r);
    ok('W11 failed rename and delete roll back exactly', r.nm === 'Nørrebro afternoon' && r.back && r.h === 'Nørrebro afternoon', r);
    await ctx.close(); }
  { const { ctx, page } = await open(b, { ...base, signedOut: true });
    await toPlans(page);
    ok('G1 signed out: plans are readable (list, ledger, numbers)', (await rowKeys(page)).length === 7 && (await page.evaluate(() => document.querySelectorAll('#planLedger .plan-pick').length)) === 6);
    await tap(page, '#planLedger [data-act="new"]'); await W(300);
    const g = await page.evaluate(() => ({ modal: document.getElementById('authModal').classList.contains('show'), form: !!document.querySelector('#planLedger input'), copy: document.querySelector('#authModalBody p').textContent }));
    ok('G2 signed out: New plan opens the sign-in, no name field, no write', g.modal && !g.form && (await planCalls(page)).length === 0, g);
    ok('G3 sign-in copy covers plans', g.copy === 'You need to log in to make changes. Anyone can view places and plans without logging in.', g.copy);
    await page.evaluate(() => hideAuthModal());
    await tap(page, '#planLedger .plan-more'); await W(150); await tap(page, '#planLedger [data-act="delete"]'); await W(300);
    ok('G4 signed out: Delete plan opens the sign-in, nothing deleted', (await page.evaluate(() => document.getElementById('authModal').classList.contains('show'))) && (await planCalls(page)).length === 0);
    const api = await page.evaluate(async () => [await addStop('p-nor', { locationId: 'tor' }), await removeStop('s1'), await reorderStop('s1', 3)]);
    ok('G5 signed out: the data layer writes nothing', api.join() === ',false,false' && (await planCalls(page)).length === 0, api);
    await ctx.close(); }

  // ---------------------------------------------------------------- data layer: stops
  { const { ctx, page } = await open(b, base);
    await toPlans(page);
    const a = await page.evaluate(async () => {
      const out = {};
      out.bad = [await addStop('p-nor', {}), await addStop('p-nor', { locationId: 'tor', shapeId: 9002 }), await addStop('p-nor', { locationId: 'mir' }), await addStop('nope', { locationId: 'tor' })];
      out.add = await addStop('p-nor', { shapeId: 9002 });
      out.addRow = __calls.filter(c => c.table === 'plan_stops' && c.op === 'insert').map(c => c.payload[0]);
      out.order1 = stopsOf('p-nor').map(s => s.location_id || s.shape_id);
      await reorderStop('s6', 0);   // bla to the front
      out.order2 = stopsOf('p-nor').map(s => s.location_id || s.shape_id);
      out.upd = __calls.filter(c => c.table === 'plan_stops' && c.op === 'update').map(c => [c.payload.position, c.filters]);
      await removeStop('s3');
      out.order3 = stopsOf('p-nor').map(s => s.location_id || s.shape_id);
      out.del = __calls.filter(c => c.table === 'plan_stops' && c.op === 'delete').map(c => c.filters);
      out.server = __db.plan_stops.filter(s => s.plan_id === 'p-nor').sort((a, b) => a.position - b.position).map(s => s.location_id || s.shape_id);
      // squeeze two neighbours together: the next move between them renumbers the plan in one upsert
      planStops = planStops.map(s => s.id === 's1' ? { ...s, position: 2 } : s.id === 's2' ? { ...s, position: 2 + 1e-12 } : s);
      __db.plan_stops.forEach(s => { if (s.id === 's1') s.position = 2; if (s.id === 's2') s.position = 2 + 1e-12; });
      const before = stopsOf('p-nor').map(s => s.id); const toIdx = before.indexOf('s2');
      await reorderStop('s4', toIdx);
      out.ups = __calls.filter(c => c.op === 'upsert').map(c => c.payload.map(r => r.position));
      out.order4 = stopsOf('p-nor').map(s => s.id);
      return out; });
    ok('D1 addStop rejects: no target, both targets, a duplicate, an unknown plan', a.bad.every(x => x === null), a.bad);
    ok('D2 addStop appends a shape stop (one target, next position, client uuid)', typeof a.add === 'string' && a.addRow.length === 1 && a.addRow[0].shape_id === 9002 && a.addRow[0].location_id === null && a.addRow[0].position === 7 && a.order1[6] === 9002, a.addRow);
    ok('D3 reorderStop writes ONE row at the midpoint (to the front = first - 1)', a.order2[0] === 'bla' && a.upd.length === 1 && a.upd[0][0] === 0, a.upd);
    ok('D4 removeStop deletes by id; local and server orders agree', a.order3.join() === a.server.join() && !a.order3.includes('cof') && a.del.length === 1, [a.order3, a.server]);
    ok('D5 neighbours too close for a midpoint: the plan renumbers 1..n in one upsert', a.ups.length === 1 && a.ups[0].join() === a.ups[0].map((_, i) => i + 1).join() && a.order4.indexOf('s4') === a.order4.indexOf('s2') - 1, a);
    const v = await page.evaluate(() => [...document.querySelectorAll('#locationsList .plan-tile')].map(t => t.textContent).join());
    ok('D6 the list follows the data layer (numbers 1..n with no gaps)', v === '1,2,3,4,5,6', v);
    await ctx.close(); }
  { const { ctx, page } = await open(b, { ...base, failWrites: true });
    await toPlans(page);
    const r = await page.evaluate(async () => { const o0 = stopsOf('p-nor').map(s => s.id + ':' + s.position).join();
      await addStop('p-nor', { locationId: 'tor' }); await removeStop('s2'); await reorderStop('s5', 0);
      return [o0, stopsOf('p-nor').map(s => s.id + ':' + s.position).join()]; });
    ok('D7 failed add / remove / reorder each roll back exactly', r[0] === r[1], r);
    await ctx.close(); }

  // ---------------------------------------------------------------- rail + collapsed
  { const { ctx, page, errors } = await open(b, { ...base, w: 1280, h: 800, touch: false });
    await page.click('#toggleFiltersBtn'); await W(400); await page.click('#listSwitch [data-view="plans"]'); await W(700);
    const r = await page.evaluate(() => { const p = document.getElementById('filtersPanel').getBoundingClientRect(), l = document.getElementById('locations').getBoundingClientRect(); return { pl: p.left, lw: l.width, h: document.querySelector('#locationsHeader h2').textContent, rows: [...document.querySelectorAll('#locationsList .location-card')].map(e => e.getBoundingClientRect().height) }; });
    ok('L1 ≥900px rail: panel beside the rail, Plans list in the rail, rows 56px', r.pl === 360 && r.lw === 360 && r.h === 'Nørrebro afternoon' && r.rows.length === 6 && r.rows.every(h => h === 56), r);
    await page.keyboard.press('Tab');
    await page.evaluate(() => document.querySelector('#listSwitch [aria-checked="true"]').focus()); await page.keyboard.press('ArrowLeft'); await W(500);
    ok('L2 keyboard: arrows move the switch (radiogroup)', (await page.evaluate(() => listView)) === 'places' && (await page.evaluate(() => document.activeElement.dataset.view)) === 'places');
    ok('L3 no errors on the rail', !errors.length, errors);
    await ctx.close(); }
  { const { ctx, page } = await open(b, base);
    await toPlans(page); await closePanel(page); await tap(page, '#collapseBtn'); await W(500);
    const c = await page.evaluate(() => ({ h: document.querySelector('#locationsHeader h2').textContent, band: document.getElementById('locationsHeader').getBoundingClientRect().height, sort: getComputedStyle(document.getElementById('sortBtn')).display }));
    ok('L4 collapsed sheet: the band shows the plan name, 57px, no ⇅', c.h === 'Nørrebro afternoon' && c.band === 57 && c.sort === 'none', c);
    await ctx.close(); }

  await b.close();
  console.log(`\n${pass}/${total} passed${fails.length ? '\nFAILED: ' + fails.join(' | ') : ''}`);
  process.exit(fails.length ? 1 : 0);
})();
