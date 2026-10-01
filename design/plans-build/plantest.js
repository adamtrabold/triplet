// Plans suite (v3 build): fail-soft without the tables, Places unchanged, the shared panel
// (switch + picker + the same chips), the Plans list (stops / captioned rule / + places),
// the grey number, map tags + the Plans z ladder, popups, persistence, poll/no-clobber, add /
// remove / reorder with the Undo slip, and the data layer (optimistic writes + rollback,
// login gate) against the in-memory Supabase double (stub.js).
// Geometry, ink, map-rule and gesture detail live in check.js / matrix.js / sweep.js / griptest.js.
//   VENDOR=<dir> [PAGE=<index.html>] node plantest.js
const { open, launch, FIX } = require('./harness');
const W = ms => new Promise(r => setTimeout(r, ms));
let pass = 0, total = 0; const fails = [];
const ok = (name, cond, info) => { total++; if (cond) pass++; else fails.push(name); console.log(`${cond ? 'PASS' : 'FAIL'} ${name}${info !== undefined ? ' ' + JSON.stringify(info) : ''}`); };
const INK2 = 'rgb(90, 86, 76)';
const HINTED = { 'triplet.reorderHint': '1' };   // the one-time drag hint already shown on this device
const base = { plans: FIX.plans, stops: FIX.stops, visited: ['mir'], storage: HINTED };
const NOR = 'mir,jae,cof,ass,S9001,bla';

const tap = async (page, sel) => {
  const r = await page.evaluate(sel => { const e = document.querySelector(sel); if (!e) return null; e.scrollIntoView({ block: 'nearest' }); const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }, sel);
  if (!r) throw new Error('no element ' + sel);
  await page.touchscreen.tap(r.x, r.y);
};
const panelOpen = page => page.evaluate(() => document.getElementById('filtersPanel').classList.contains('visible'));
const openPanel = async page => { if (!(await panelOpen(page))) { await tap(page, '#toggleFiltersBtn'); await W(400); } };
const closePanel = async page => { if (await panelOpen(page)) { await tap(page, '#toggleFiltersBtn'); await W(400); } };
const toPlans = async page => { await openPanel(page); await tap(page, '#listSwitch [data-view="plans"]'); await W(700); };
const openPicker = async page => { await openPanel(page); if (await page.evaluate(() => document.getElementById('planLedger').hidden)) { await tap(page, '#planPick .plan-picker'); await W(200); } };
const pick = async (page, id) => { await openPicker(page); await tap(page, `#planLedger [data-plan="${id}"]`); await W(800); };
// the list: stops (bare keys), '|' for the rule, '+key' for a place with +
const keys = page => page.evaluate(() => [...document.querySelectorAll('#locationsList > *')].filter(e => e.offsetParent && e.matches('.location-card, .plan-rule'))
  .map(e => e.matches('.plan-rule') ? '|' : (e.classList.contains('is-stop') ? '' : '+') + (e.dataset.id || 'S' + e.dataset.shapeId)));
const stopKeys = async page => (await keys(page)).filter(k => k !== '|' && k[0] !== '+').join();
const nums = page => page.evaluate(() => [...document.querySelectorAll('#locationsList .row-n')].map(n => n.textContent).join());
const h2 = page => page.evaluate(() => document.querySelector('#locationsHeader h2').textContent);
const shown = (page, sel) => page.evaluate(sel => { const e = document.querySelector(sel); return !!e && getComputedStyle(e).display !== 'none' && e.getClientRects().length > 0; }, sel);
const slip = page => page.evaluate(() => { const s = document.getElementById('planSlip'); return s && !s.hidden ? s.querySelector('.slip-text').textContent : null; });
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
    const f = await page.evaluate(() => ({ pick: document.querySelector('#planPick .plan-picker').textContent.trim(), dis: document.querySelector('#planPick .plan-picker').getAttribute('aria-disabled'),
      empty: document.getElementById('locationsEmpty').textContent.trim(), led: document.getElementById('planLedger').hidden }));
    ok('F3 Plans side: the picker reads "Not available yet" (disabled), the list "Plans aren’t available yet.", no rows, no New plan', f.pick === 'Not available yet' && f.dis === 'true' && f.empty === 'Plans aren’t available yet.' && f.led && !(await page.$('.plan-empty-new')) && (await keys(page)).length === 0, f);
    await tap(page, '#planPick .plan-picker'); await W(200);
    ok('F4 the disabled picker opens nothing', await page.evaluate(() => document.getElementById('planLedger').hidden));
    ok('F5 Plans without tables: header "Plans", no ⇅, the chips stay live, nothing on the map', (await h2(page)) === 'Plans' && !(await shown(page, '#sortBtn')) && (await shown(page, '#cityFilters')) && (await shown(page, '#filters'))
      && (await page.evaluate(() => markersById.size + clusterMarkersById.size)) === 0);
    await tap(page, '#listSwitch [data-view="places"]'); await W(500);
    ok('F6 back to Places: list and header restored, still no errors', /^Copenhagen list/.test(await h2(page)) && (await page.evaluate(() => document.querySelectorAll('#locationsList .location-card').length)) > 20 && !errors.length && !consoleErrors.length);
    await page.evaluate(() => { pollTick(); }); await W(400);
    ok('F7 a poll with the tables still missing stays silent', !errors.length && !consoleErrors.length && (await page.evaluate(() => getComputedStyle(document.getElementById('error')).display)) === 'none');
    await ctx.close(); }

  // ---------------------------------------------------------------- P: Places unchanged + the panel's Places side
  { const { ctx, page, errors } = await open(b, base);
    const s = await page.evaluate(() => ({ view: listView, nums: document.querySelectorAll('.row-n').length, tags: document.querySelectorAll('.stop-tag').length, adds: document.querySelectorAll('.plan-add, .plan-x').length,
      x: document.querySelectorAll('#locationsList .delete-btn').length, rows: document.querySelectorAll('#locationsList .location-card').length, rule: !!document.querySelector('#locationsList .plan-rule') }));
    ok('P1 default = Places: every row has its delete X, no numbers, no +, no rule, no map tags', s.view === 'places' && !s.nums && !s.tags && !s.adds && !s.rule && s.x === s.rows, s);
    ok('P2 Places header keeps its count and ⇅', /^Copenhagen list \(\d+\)$/.test(await h2(page)) && (await shown(page, '#sortBtn')));
    await openPanel(page);
    const p = await page.evaluate(() => { const r = [...document.querySelectorAll('#listSwitch [role="radio"]')], pk = document.querySelector('#planPick .plan-picker');
      return { group: document.getElementById('listSwitch').getAttribute('role'), labels: r.map(e => e.textContent), checked: r.map(e => e.getAttribute('aria-checked')),
        cities: document.querySelectorAll('#cityFilters .city-btn').length, cats: document.querySelectorAll('#filters .filter-btn').length, ledger: document.getElementById('planLedger').hidden,
        first: document.getElementById('filtersPanel').firstElementChild.className, pick: pk.textContent.trim(), pickColor: getComputedStyle(pk).color,
        seg: document.querySelector('.seg').getBoundingClientRect().width, row: document.querySelector('.seg-wrap').getBoundingClientRect().height,
        scroll: document.getElementById('filtersPanel').scrollHeight - document.getElementById('filtersPanel').clientHeight }; });
    ok('P3 panel: a radiogroup switch first, "Places" then "Plans", Places checked', p.group === 'radiogroup' && p.labels.join() === 'Places,Plans' && p.checked.join() === 'true,false' && p.first === 'seg-wrap', p);
    ok('P4 Places side: every chip (6 cities incl. All, 11 categories), the picker in the switch\'s row, grey ("Pick a plan" before one was ever opened)', p.cities === 6 && p.cats === 11 && p.ledger && p.pick === 'Pick a plan' && p.pickColor === INK2 && p.seg === 176 && p.row === 61, p);
    ok('P5 every chip shows unscrolled (the panel does not scroll)', p.scroll <= 0, p.scroll);
    const tgt = await page.evaluate(() => [...document.querySelectorAll('#listSwitch button')].map(e => { const r = e.getBoundingClientRect(), a = getComputedStyle(e, '::before'); return r.height + parseFloat(a.top) * -1 + parseFloat(a.bottom) * -1; }));
    ok('P6 switch segments: 36px drawn, ≥44px target', tgt.every(h => h >= 44), tgt);
    await pick(page, 'p-tiv');
    ok('P7 picking a plan from Places opens it in Plans, the panel stays open', (await page.evaluate(() => listView)) === 'plans' && (await h2(page)) === 'Tivoli tonight' && (await panelOpen(page)));
    ok('P8 no errors', !errors.length, errors);
    await ctx.close(); }

  // ---------------------------------------------------------------- N / V: the Plans side
  { const { ctx, page, errors, consoleErrors } = await open(b, base);
    await toPlans(page);
    ok('N1 first plan opens by default; the panel keeps every chip; header = the plan name; ⇅, filters and locate stay', (await h2(page)) === 'Nørrebro afternoon' && (await shown(page, '#cityFilters')) && (await shown(page, '#filters'))
      && (await shown(page, '#sortBtn')) && (await shown(page, '#toggleFiltersBtn')) && (await shown(page, '#centerMeBtn')));
    await openPicker(page);
    const led = await page.evaluate(() => [...document.querySelectorAll('#planLedger .plan-opt')].map(o => ({ name: (o.querySelector('.plan-name') || {}).textContent, ct: (o.querySelector('.plan-count') || {}).textContent || '',
      cur: o.querySelector('.plan-pick') ? o.querySelector('.plan-pick').getAttribute('aria-current') : null, more: !!o.querySelector('.plan-more'), h: o.getBoundingClientRect().height })));
    ok('N2 the picker\'s slip: every plan with its stop count, then New plan', led.map(l => l.name).join('|') === 'Nørrebro afternoon|Malmö + Copenhagen day|Tivoli tonight|Last full day before we fly home from Kastrup|Rainy day|New plan'
      && led.map(l => l.ct).join('|') === '6 stops|3 stops|1 stop|4 stops|0 stops|', led.map(l => l.name + ':' + l.ct));
    ok('N3 ✓ on the open plan; ⋯ on EVERY plan; rows 45px', led[0].cur === 'true' && led.slice(1, 5).every(l => l.cur === 'false') && led.slice(0, 5).every(l => l.more) && led.every(l => l.h === 45), led.map(l => [l.cur, l.more, l.h]));
    const pk = await page.evaluate(() => { const p = document.querySelector('#planPick .plan-picker'), c = getComputedStyle(p); return { exp: p.getAttribute('aria-expanded'), bg: c.backgroundColor, color: c.color, chev: getComputedStyle(p.querySelector('svg')).transform }; });
    ok('N4 open picker: the pressed tone (not navy), ink text, chevron turned up', pk.exp === 'true' && pk.bg === 'rgb(220, 211, 195)' && pk.color === 'rgb(26, 26, 24)' && pk.chev !== 'none', pk);
    await tap(page, '#planPick .plan-picker'); await W(200);
    ok('N5 tapping the picker again closes its slip; the panel stays open', (await page.evaluate(() => document.getElementById('planLedger').hidden)) && (await panelOpen(page)));
    const k = await keys(page);
    ok('V1 the list: the stops in plan order, the rule, then every Copenhagen match that is not a stop, each with +', k.slice(0, 7).join() === NOR + ',|' && k.slice(7).every(x => x[0] === '+') && k.length > 20
      && !k.slice(7).some(x => ['+mir', '+jae', '+cof', '+ass', '+S9001', '+bla'].includes(x)), k.slice(0, 9));
    const expectN = await page.evaluate(() => { const st = new Set(planStops.filter(s => s.plan_id === 'p-nor').map(s => s.location_id)); return locations.filter(l => l.city === 'copenhagen' && !st.has(l.id)).length + neighborhoodShapes.filter(n => n.city === 'copenhagen' && n.id !== 9001).length; });
    ok('V2 the rule: Places\' group divider with its caption "Add from Copenhagen (n)", n = the rows below it', (await page.evaluate(() => document.querySelector('.plan-rule').textContent)) === `Add from Copenhagen (${expectN})` && k.length - 7 === expectN, [expectN, k.length - 7]);
    ok('V3 the numbers 1..6, one grey state', (await nums(page)) === '1,2,3,4,5,6' && (await page.evaluate(() => [...document.querySelectorAll('.row-n')].every(n => { const c = getComputedStyle(n); return c.color === 'rgb(90, 86, 76)' && c.fontWeight === '600' && c.fontSize === '13px'; }))));
    const r = await page.evaluate(() => ({ rows: [...document.querySelectorAll('#locationsList .location-card')].map(e => e.getBoundingClientRect().height),
      head: document.getElementById('locationsHeader').getBoundingClientRect().height, x: document.querySelectorAll('#locationsList .location-card.is-stop .plan-x').length, add: document.querySelectorAll('#locationsList .location-card:not(.is-stop) .plan-add').length,
      del: document.querySelectorAll('#locationsList .delete-btn:not(.plan-x):not(.plan-add)').length, addColor: getComputedStyle(document.querySelector('.plan-add')).color, xColor: getComputedStyle(document.querySelector('.plan-x')).color,
      label: document.querySelector('.location-card[data-id="jae"] .row-n').getAttribute('aria-label') }));
    ok('V4 rows 56px, header 57px; × on every stop, + on every other row, both grey; no Places delete X in Plans', r.rows.every(h => h === 56) && r.head === 57 && r.x === 6 && r.add === r.rows.length - 6 && r.del === 0 && r.addColor === INK2 && r.xColor === INK2, r);
    ok('V5 the number is a focusable button that says what it does', /^Stop 2 of 6, Jægersborggade\. Hold and drag, or use the arrow keys/.test(r.label), r.label);
    await closePanel(page);
    await tap(page, '.location-card[data-id="jae"] .row-main'); await W(1600);
    const pop = await page.evaluate(() => ({ z: map.getZoom(), cat: (document.querySelector('.leaflet-popup .popup-cat') || {}).textContent, hl: document.querySelector('.location-card[data-id="jae"]').classList.contains('highlighted') }));
    ok('V6 a stop row flies (≥ SOLO_MIN_ZOOM) and opens its popup, which says "Stop 2 of 6"', pop.z >= 14 && /Stop\s2 of 6/.test((pop.cat || '').replace(/ /g, ' ')) && pop.hl, pop);
    ok('V7 the highlighted row\'s number turns paper', (await page.evaluate(() => getComputedStyle(document.querySelector('.location-card.highlighted .row-n')).color)) === 'rgb(242, 235, 221)');
    await tap(page, '.location-card[data-shape-id="9001"] .row-main'); await W(1600);
    ok('V8 a shape stop row flies and its popup says "Stop 5 of 6"', (await page.evaluate(() => (document.querySelector('.leaflet-popup .shape-stop') || {}).textContent)) === 'Stop 5 of 6');
    const other = await page.evaluate(() => [...document.querySelectorAll('#locationsList .location-card:not(.is-stop)')].find(e => e.dataset.id).dataset.id);
    await tap(page, `.location-card[data-id="${other}"] .row-main`); await W(1600);
    ok('V9 a place below the rule flies and opens its popup too (no "Stop")', await page.evaluate(id => map.getZoom() >= 14 && !!document.querySelector('.leaflet-popup') && !/Stop \d/.test(document.querySelector('.leaflet-popup').textContent) && document.querySelector(`.location-card[data-id="${id}"]`).classList.contains('highlighted'), other));
    // the map at a stop-level zoom
    await page.evaluate(() => { map.closePopup(); setHighlighted(null); map.setView([55.6905, 12.5520], 15, { animate: false }); }); await W(600);
    const mk = await page.evaluate(() => {
      const out = {}; markersById.forEach((m, id) => { const el = m.marker.getElement(); const t = el && el.querySelector('.stop-tag'); out[id] = { tag: t && t.style.display !== 'none' ? t.textContent : null, glyph: !!(el && el.querySelector('use[href^="#g-"]:not([href="#g-star"])')), z: m.marker.options.zIndexOffset }; });
      const d = [...planShapeMarkers.values()].map(e => { const el = e.marker.getElement(); return { n: el.querySelector('.stop-tag').textContent, poly: !!el.querySelector('polygon') }; });
      const tg = getComputedStyle(document.querySelector('.stop-tag'));
      return { out, d, tag: { border: tg.borderTopWidth + ' ' + tg.borderTopColor, color: tg.color, bg: tg.backgroundColor } }; });
    ok('V10 zoom 15: every stop pin keeps its glyph and carries its number on a tag', ['mir', 'jae', 'cof', 'ass', 'bla'].every((id, i) => mk.out[id] && mk.out[id].tag === String([1, 2, 3, 4, 6][i]) && mk.out[id].glyph), mk.out);
    ok('V11 one tag style for every stop: paper tile, 1px --ink-2 edge and numeral', mk.tag.border === '1px ' + INK2 && mk.tag.color === INK2 && mk.tag.bg === 'rgb(242, 235, 221)', mk.tag);
    ok('V12 the district stop gets ONE diamond with its tag (5)', mk.d.length === 1 && mk.d[0].n === '5' && mk.d[0].poly, mk.d);
    ok('V13 stops stack at 20000 - n (lower numbers on top), above places', mk.out.mir.z === 19999 && mk.out.jae.z === 19998 && mk.out.bla.z === 19994, [mk.out.mir.z, mk.out.jae.z, mk.out.bla.z]);
    ok('V14 every other place the filters match is on the map as in Places (no tag)', Object.keys(mk.out).length > 6 && Object.entries(mk.out).filter(([id]) => !['mir', 'jae', 'cof', 'ass', 'bla'].includes(id)).every(([, v]) => v.tag === null), Object.keys(mk.out).length);
    await page.evaluate(() => map.setView([55.6905, 12.5520], 11, { animate: false })); await W(600);
    const far = await page.evaluate(() => { const st = ['mir', 'jae', 'cof', 'ass', 'bla']; return { stops: st.filter(id => markersById.has(id)).length, clusters: clusterMarkersById.size, cz: [...clusterMarkersById.values()].map(m => m.options.zIndexOffset),
      inCluster: false, diamonds: planShapeMarkers.size }; });
    ok('V15 zoom 11: stops are never clustered (all drawn), Places clusters keep their counts and draw above stops (30000)', far.stops === 5 && far.diamonds === 1 && far.clusters >= 1 && far.cz.every(z => z >= 30000), far);
    // visiting a stop: a Places visited row, nothing plan-specific
    await page.evaluate(async () => { await toggleLocationFlag('jae', 'visited'); }); await W(400);
    const vis = await page.evaluate(() => { const e = document.querySelector('.location-card[data-id="jae"]'), st = e.querySelector('.row-stamp:not(.vs-copy)'); return { n: e.querySelector('.row-n').textContent, stamp: st && getComputedStyle(st).color }; });
    const placesStamp = await page.evaluate(() => { document.body.classList.remove('plan-view'); const c = getComputedStyle(document.querySelector('.location-card[data-id="jae"] .row-stamp:not(.vs-copy)')).color; document.body.classList.add('plan-view'); return c; });
    ok('V16 a visited stop keeps its number and wears the Places stamp at its normal ink (no NEXT, nothing plan-specific)', (await nums(page)) === '1,2,3,4,5,6' && vis.stamp === placesStamp && !(await page.evaluate(() => /\bNEXT\b/i.test(document.body.innerText))), [vis, placesStamp]);
    // filters apply below the rule only
    await page.evaluate(() => { document.getElementById('filter-cafe').click(); setActiveCity('malmo', { frame: false }); }); await W(400);
    const fk = await keys(page);
    ok('V17 Malmö + Cafe off: every stop still shows; below the rule only Malmö non-cafés', fk.slice(0, 7).join() === NOR + ',|' && fk.slice(7).length > 0 && (await page.evaluate(ks => ks.every(k => { const l = locations.find(x => x.id === k.slice(1)); return l && l.city === 'malmo' && l.category !== 'cafe'; }), fk.slice(7))), fk);
    ok('V18 the caption names the filters', /^Add from Malmö · \d+ categories \(\d+\)$/.test(await page.evaluate(() => document.querySelector('.plan-rule').textContent)), await page.evaluate(() => document.querySelector('.plan-rule').textContent));
    ok('V19 a city or a chip never changes the view', (await page.evaluate(() => listView)) === 'plans' && (await h2(page)) === 'Nørrebro afternoon');
    await page.evaluate(() => { document.getElementById('filter-cafe').click(); setActiveCity('copenhagen', { frame: false }); }); await W(300);
    ok('V20 no page or console errors', !errors.length && !consoleErrors.length, { errors, consoleErrors });
    await ctx.close(); }

  // ---------------------------------------------------------------- switching, spanning, empty, long names, exit
  { const { ctx, page } = await open(b, base);
    await toPlans(page);
    await pick(page, 'p-mc');
    ok('S1 switch plan: header + stops follow, the picker\'s slip closes, ✓ moves', (await h2(page)) === 'Malmö + Copenhagen day' && (await stopKeys(page)) === 'lil,tiv,nyh'
      && (await page.evaluate(() => document.getElementById('planLedger').hidden)) && (await page.evaluate(() => (setPlanPanel({ open: true }), document.querySelector('[data-plan="p-mc"]').getAttribute('aria-current')))) === 'true', await stopKeys(page));
    await page.evaluate(() => setPlanPanel({ open: false }));
    const metas = await page.evaluate(() => [...document.querySelectorAll('#locationsList .location-card.is-stop .row-meta')].map(e => e.textContent));
    ok('S2 spanning plan: each stop row names its city', metas[0].includes('Malmö') && metas[1].includes('Copenhagen'), metas);
    await pick(page, 'p-empty');
    const e0 = await page.evaluate(() => [...document.querySelectorAll('#locationsList > *')].filter(e => e.offsetParent).slice(0, 2).map(e => e.className + ':' + e.textContent.trim()));
    ok('S3 a plan with 0 stops: "No stops yet. Tap + on a place below." above the rule, then the places', e0[0] === 'plan-list-note:No stops yet. Tap + on a place below.' && /^plan-rule:Add from Copenhagen/.test(e0[1]), e0);
    await pick(page, 'p-long');
    const lg = await page.evaluate(() => { const h = document.querySelector('#locationsHeader h2 .h-name'); return { h: h.scrollWidth > h.clientWidth, e: getComputedStyle(h).textOverflow, lh: document.querySelector('#locationsHeader h2').getBoundingClientRect().height }; });
    ok('S4 a long name ellipsizes on one line, header stays one row', lg.h && lg.e === 'ellipsis' && lg.lh === 20, lg);
    await pick(page, 'p-nor');
    const twenty = await page.evaluate(() => { plans = plans.map(p => p.id === 'p-nor' ? { ...p, name: 'Østerbro and harbour' } : p); updateUI(); const h = document.querySelector('#locationsHeader h2 .h-name'); return [h.textContent.length, h.scrollWidth <= h.clientWidth]; });
    ok('S5 a 20-character name fits the phone header untruncated (with ⇅ back)', twenty[0] === 20 && twenty[1], twenty);
    await page.evaluate(() => { plans = plans.map(p => p.id === 'p-nor' ? { ...p, name: 'Nørrebro afternoon' } : p); updateUI(); });
    await page.evaluate(() => { const l = document.getElementById('locationsList'); l.scrollTop = l.scrollHeight; }); await W(100);
    await tap(page, '#locationsHeader h2'); await W(900);
    ok('S6 tapping the plan\'s name returns the list to the stops', (await page.evaluate(() => document.getElementById('locationsList').scrollTop)) === 0);
    await page.evaluate(() => { document.getElementById('locationsList').scrollTop = 0; document.getElementById('filter-bar').click(); }); await W(300);
    ok('S7 a chip change in Plans scrolls the list so the rule sits at the top', await page.evaluate(() => { const l = document.getElementById('locationsList'), r = l.querySelector('.plan-rule'); return Math.abs(r.getBoundingClientRect().top - l.getBoundingClientRect().top) <= 1; }));
    await page.evaluate(() => document.getElementById('filter-bar').click()); await W(200);
    // exit restores the city
    const city0 = await page.evaluate(() => citySelection);
    await tap(page, '#listSwitch [data-view="places"]'); await W(1400);
    const ex = await page.evaluate(() => ({ city: citySelection, c: map.getCenter(), z: map.getZoom(), h: document.querySelector('#locationsHeader h2').textContent, sort: getComputedStyle(document.getElementById('sortBtn')).display,
      x: document.querySelectorAll('#locationsList .delete-btn').length, nums: document.querySelectorAll('.row-n').length, rule: !!document.querySelector('#locationsList .plan-rule'), tags: document.querySelectorAll('.stop-tag').length, panel: document.getElementById('filtersPanel').classList.contains('visible') }));
    ok('X1 back to Places: same city, re-framed; list, count, ⇅ and X back; no numbers, rule or tags; the panel stays open', ex.city === city0 && ex.city === 'copenhagen' && Math.abs(ex.c.lat - 55.6761) < 0.01 && ex.z === 12 && /^Copenhagen list/.test(ex.h) && ex.sort !== 'none' && ex.x > 20 && !ex.nums && !ex.rule && !ex.tags && ex.panel, ex);
    await ctx.close(); }

  // ---------------------------------------------------------------- no plans yet
  { const { ctx, page } = await open(b, { plans: [], stops: [] });
    await toPlans(page);
    const s = await page.evaluate(() => ({ pick: document.querySelector('#planPick .plan-picker').textContent.trim(), empty: document.getElementById('locationsEmpty').firstChild && [...document.getElementById('locationsEmpty').childNodes].find(n => n.nodeType === 3).textContent.trim(),
      btn: !!document.querySelector('#locationsEmpty .plan-empty-new'), h: document.querySelector('#locationsHeader h2').textContent, rows: document.querySelectorAll('#locationsList .location-card').length, map: markersById.size + clusterMarkersById.size }));
    ok('E1 no plans yet: the picker offers New plan; the list says so with a New plan button; header "Plans"; no rows, nothing on the map, no ⇅', s.pick === 'New plan' && s.empty === 'No plans yet. A plan’s stops show here and on the map.' && s.btn && s.h === 'Plans' && !s.rows && !s.map && !(await shown(page, '#sortBtn')), s);
    await closePanel(page); await tap(page, '#locationsEmpty .plan-empty-new'); await W(400);
    ok('E2 the empty list\'s New plan opens the panel with the name field, focused', (await panelOpen(page)) && (await page.evaluate(() => document.activeElement && document.activeElement.getAttribute('aria-label'))) === 'New plan name');
    await ctx.close(); }

  // ---------------------------------------------------------------- persistence
  { const { ctx, page } = await open(b, base);
    await toPlans(page); await pick(page, 'p-tiv');
    const st = await page.evaluate(() => [localStorage.getItem('triplet.listView'), localStorage.getItem('triplet.activePlan')]);
    ok('R1 view + active plan persist per device', st.join() === 'plans,p-tiv', st);
    await page.reload(); await W(1200);
    ok('R2 reload reopens that plan', (await h2(page)) === 'Tivoli tonight' && (await stopKeys(page)) === 'tiv', await stopKeys(page));
    await page.evaluate(() => localStorage.setItem('triplet.activePlan', 'p-gone')); await page.reload(); await W(1200);
    ok('R3 a stored plan that no longer exists falls back to the first plan', (await h2(page)) === 'Nørrebro afternoon');
    await ctx.close(); }
  { const { ctx, page, errors } = await open(b, { ...base, init: () => { Storage.prototype.getItem = () => { throw new Error('denied'); }; Storage.prototype.setItem = () => { throw new Error('denied'); }; } });
    await toPlans(page);
    await page.evaluate(() => planRowAct('add', { locationId: 'tor' }, 'Torvehallerne')); await W(300);
    ok('R4 storage that throws: Plans still works (try/catch) and + still adds, no errors', (await h2(page)) === 'Nørrebro afternoon' && (await stopKeys(page)) === NOR + ',tor' && !errors.length, errors);
    await ctx.close(); }

  // ---------------------------------------------------------------- poll / reconcile: never clobbers the plan
  { const { ctx, page } = await open(b, base);
    await toPlans(page); await closePanel(page);
    const quiet = await page.evaluate(async () => { let n = 0; const mo = new MutationObserver(m => { n += m.length; }); mo.observe(document.getElementById('locationsList'), { subtree: true, childList: true, attributes: true, characterData: true });
      await fetchPlans(); await fetchLocations(); await W(50); mo.disconnect(); return n; function W(ms) { return new Promise(r => setTimeout(r, ms)); } });
    ok('C1 an unchanged poll touches nothing in the plan list', quiet === 0, quiet);
    await page.evaluate(async () => { __db.locations.find(r => r.id === 'cof').name = 'The Coffee Collective (Jgb)'; __db.locations.push({ id: 'new', name: 'Aaa new place', address: 'x', category: 'cafe', lat: 55.69, lng: 12.55, notes: null, visited: false, starred: false, city: 'copenhagen' }); await fetchLocations(); }); await W(300);
    const k = await keys(page);
    ok('C2 a locations poll with changes keeps the plan order; a new matching place appears below the rule with +', k.slice(0, 7).join() === NOR + ',|' && k.includes('+new') && (await page.evaluate(() => document.querySelector('.location-card[data-id="cof"] h3').textContent)) === 'The Coffee Collective (Jgb)', k.slice(0, 9));
    await page.evaluate(async () => { __db.plan_stops.push({ id: 'sx', plan_id: 'p-nor', location_id: 'tor', shape_id: null, position: 2.5 }); await fetchPlans(); }); await W(300);
    ok('C3 the other phone adds a stop: it lands at its position, numbers 1..7, it leaves the places below', (await stopKeys(page)) === 'mir,jae,tor,cof,ass,S9001,bla' && (await nums(page)) === '1,2,3,4,5,6,7' && !(await keys(page)).includes('+tor'), await stopKeys(page));
    await page.evaluate(async () => { __db.plans = __db.plans.filter(p => p.id !== 'p-nor'); __db.plan_stops = __db.plan_stops.filter(s => s.plan_id !== 'p-nor'); await fetchPlans(); }); await W(300);
    ok('C4 the other phone deletes the open plan: this one moves to the first remaining plan', (await h2(page)) === 'Malmö + Copenhagen day', await h2(page));
    await ctx.close(); }
  { const { ctx, page } = await open(b, { ...base, writeDelay: 600 });
    await toPlans(page);
    const s = await page.evaluate(async () => { const p = renamePlan('p-nor', 'Nørrebro slow'); await new Promise(r => setTimeout(r, 100)); await fetchPlans(); const mid = document.querySelector('#locationsHeader h2').textContent; await p; return [mid, document.querySelector('#locationsHeader h2').textContent]; });
    ok('C5 a poll during an in-flight write never paints the old name back', s[0] === 'Nørrebro slow' && s[1] === 'Nørrebro slow', s);
    await ctx.close(); }

  // ---------------------------------------------------------------- add / remove / reorder + the Undo slip
  { const { ctx, page, errors } = await open(b, base);
    await toPlans(page);
    const tor = await page.evaluate(() => locations.find(l => l.id === 'tor').name);
    await tap(page, '.location-card[data-id="tor"] .plan-add'); await W(500);
    const c0 = await planCalls(page);
    ok('U1 + appends the place as the last stop: one insert, number 7, it moves above the rule', c0.length === 1 && c0[0].op === 'insert' && c0[0].payload[0].location_id === 'tor' && (await stopKeys(page)) === NOR + ',tor' && (await nums(page)) === '1,2,3,4,5,6,7', c0);
    ok('U2 the slip: "Added <name> as stop 7"', (await slip(page)) === `Added ${tor} as stop 7`, await slip(page));
    await closePanel(page);
    await page.evaluate(() => { const l = document.getElementById('locationsList'); l.scrollTop = 900; }); await W(100);
    const sl = await page.evaluate(() => { const s = document.getElementById('planSlip').getBoundingClientRect(), r = document.querySelector('.plan-rule').getBoundingClientRect(), h = document.getElementById('locationsHeader').getBoundingClientRect();
      return { onHeader: document.getElementById('planSlip').classList.contains('on-header'), s: [s.top, s.height].map(Math.round), r: [r.top, r.height].map(Math.round), h: [h.top, h.bottom].map(Math.round) }; });
    ok('U3 the rule scrolled out of view: the slip sits on the list header', sl.onHeader && sl.s[0] > sl.h[0] && sl.s[0] + sl.s[1] < sl.h[1], sl);
    await page.evaluate(() => { const l = document.getElementById('locationsList'); l.scrollTop = 0; l.scrollTop = l.querySelector('.plan-rule').getBoundingClientRect().top - l.getBoundingClientRect().top - 100; }); await W(100);
    const sl2 = await page.evaluate(() => { const s = document.getElementById('planSlip').getBoundingClientRect(), r = document.querySelector('.plan-rule').getBoundingClientRect(); return [s.top, s.height, r.top, r.height, s.left, s.width, r.left, r.width].map(Math.round); });
    ok('U3b scrolled so the rule shows, the slip rides it, covering exactly the caption line', sl2[0] === sl2[2] && sl2[1] === sl2[3] && sl2[4] === sl2[6] && sl2[5] === sl2[7], sl2);
    await tap(page, '#planSlip button'); await W(500);
    ok('U4 Undo removes the stop again; the slip goes', (await stopKeys(page)) === NOR && (await slip(page)) === null && (await planCalls(page)).slice(-1)[0].op === 'delete');
    await tap(page, '.location-card[data-id="cof"] .plan-x'); await W(500);
    ok('U5 × removes the stop from the plan (the place stays in Places): "Removed <name>"', (await stopKeys(page)) === 'mir,jae,ass,S9001,bla' && (await page.evaluate(() => locations.some(l => l.id === 'cof'))) && (await keys(page)).includes('+cof')
      && /^Removed The Coffee Collective/.test(await slip(page)), await slip(page));
    await tap(page, '#planSlip button'); await W(500);
    const back = await page.evaluate(() => planStops.find(s => s.id === 's3'));
    ok('U6 Undo restores the same stop row at its old position (restoreStop)', (await stopKeys(page)) === NOR && back && back.position === 3 && (await planCalls(page)).slice(-1)[0].op === 'insert', back);
    // keyboard reorder answers with the slip; Undo moves it back
    await page.evaluate(() => document.querySelector('.location-card[data-id="mir"] .row-n').focus());
    await page.keyboard.press('ArrowDown'); await W(500);
    ok('U7 ArrowDown moves a stop one place: "Moved <name> to stop 2"; focus stays on its number', (await stopKeys(page)) === 'jae,mir,cof,ass,S9001,bla' && /^Moved Mirabelle.* to stop 2$/.test(await slip(page))
      && (await page.evaluate(() => document.activeElement.closest('.location-card').dataset.id)) === 'mir', await slip(page));
    await page.keyboard.press('End'); await W(500);
    ok('U8 End moves it to last', (await stopKeys(page)) === 'jae,cof,ass,S9001,bla,mir' && /to stop 6$/.test(await slip(page)));
    await tap(page, '#planSlip button'); await W(500);
    ok('U9 Undo of a move puts the stop back where it was', (await stopKeys(page)) === 'jae,mir,cof,ass,S9001,bla', await stopKeys(page));
    await page.keyboard.press('Home'); await W(500); await tap(page, '#planSlip button'); await W(500);
    await page.evaluate(() => reorderStop('s1', 0)); await W(300);
    ok('U10 Home then Undo, and back to the start', (await stopKeys(page)) === NOR, await stopKeys(page));
    // hold-drag reorder (touch) answers with the slip too
    const cdp = await page.context().newCDPSession(page);
    await closePanel(page);
    await page.evaluate(() => { document.getElementById('locationsList').scrollTop = 0; }); await W(200);
    const pts = await page.evaluate(() => { const n = document.querySelector('.location-card[data-id="jae"] .row-n').getBoundingClientRect(), r = document.querySelector('.location-card[data-id="ass"]').getBoundingClientRect(); return { x: n.x + n.width / 2, y: n.y + n.height / 2, to: r.y + r.height / 2 }; });
    const tp = (x, y) => [{ x, y, id: 1, radiusX: 4, radiusY: 4, force: 1 }];
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: tp(pts.x, pts.y) }); await W(470);
    for (let i = 1; i <= 10; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: tp(pts.x, pts.y + (pts.to - pts.y) * i / 10) }); await W(20); }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await W(600);
    ok('U11 hold the number 400ms and drag: the stop moves, "Moved <name> to stop 4"', (await stopKeys(page)) === 'mir,cof,ass,jae,S9001,bla' && /^Moved Jægersborggade to stop 4$/.test(await slip(page)), [await stopKeys(page), await slip(page)]);
    await tap(page, '#planSlip button'); await W(500);
    ok('U12 Undo puts it back', (await stopKeys(page)) === NOR, await stopKeys(page));
    await page.evaluate(() => showPlanSlip('x', null)); await W(6300);
    ok('U13 the slip goes by itself after 6s', (await slip(page)) === null);
    ok('U14 no errors', !errors.length, errors);
    await ctx.close(); }
  // the one-time drag hint
  { const { ctx, page } = await open(b, { ...base, storage: {} });
    await toPlans(page);
    await tap(page, '.location-card[data-id="tor"] .plan-add'); await W(500);
    const h = [await slip(page), await page.evaluate(() => localStorage.getItem('triplet.reorderHint'))];
    await tap(page, '#planSlip button'); await W(400);
    await tap(page, '.location-card[data-id="tor"] .plan-add'); await W(500);
    ok('U15 the first time a plan reaches 2+ stops, the slip teaches the drag, once per device', h[0] === 'Stop 7 added · hold a number to move' && h[1] === '1' && /^Added .* as stop 7$/.test(await slip(page)), [h, await slip(page)]);
    await ctx.close(); }
  // shape rows: + / × only on a near-still tap
  { const { ctx, page } = await open(b, base);
    await toPlans(page); await closePanel(page);
    const n0 = (await planCalls(page)).length;
    const q = await page.evaluate(() => { const e = document.querySelector('.location-card[data-shape-id="9002"] .plan-add'); e.scrollIntoView({ block: 'center' }); const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }); await W(200);
    const cdp = await page.context().newCDPSession(page);
    const tp = (x, y) => [{ x, y, id: 1, radiusX: 4, radiusY: 4, force: 1 }];
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: tp(q.x, q.y) });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: tp(q.x - 3, q.y) });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: tp(q.x - 6, q.y) });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await W(500);
    ok('U16 a 6px stroke on a district/street + adds nothing (DELETE_TAP_SLOP)', (await planCalls(page)).length === n0 && (await stopKeys(page)) === NOR);
    await tap(page, '.location-card[data-shape-id="9002"] .plan-add'); await W(500);
    ok('U17 a still tap on it adds the street as stop 7', (await stopKeys(page)) === NOR + ',S9002', await stopKeys(page));
    await ctx.close(); }

  // ---------------------------------------------------------------- writes through the panel
  { const { ctx, page, errors } = await open(b, base);
    await toPlans(page); await openPicker(page);
    await tap(page, '#planLedger [data-act="new"]'); await W(300);
    const focused = await page.evaluate(() => document.activeElement && document.activeElement.getAttribute('aria-label'));
    ok('W1 New plan opens a name field in the picker\'s slip, focused', focused === 'New plan name', focused);
    await tap(page, '#planLedger [data-act="cancel"]'); await W(200);
    ok('W2 Cancel creates nothing', (await planCalls(page)).length === 0 && !!(await page.$('.plan-new')));
    await tap(page, '#planLedger [data-act="new"]'); await W(200);
    await page.keyboard.type('  Harbour   swim  '); await tap(page, '#planLedger [data-act="create"]'); await W(700);
    const c = await planCalls(page);
    ok('W3 Create: one insert (trimmed name, client uuid), the plan opens with no stops, the panel stays open', c.length === 1 && c[0].table === 'plans' && c[0].op === 'insert' && c[0].payload[0].name === 'Harbour swim' && /^[0-9a-f-]{36}$/.test(c[0].payload[0].id)
      && (await h2(page)) === 'Harbour swim' && (await stopKeys(page)) === '' && (await panelOpen(page)), c);
    await openPicker(page);
    await tap(page, '#planLedger [data-more="p-tiv"]'); await W(200);
    const acts = await page.evaluate(() => [...document.querySelectorAll('#planLedger .plan-form .plan-act')].map(b => b.textContent));
    ok('W4 ⋯ on a plan that is not open: Rename / Delete plan / Cancel in its row', acts.join() === 'Rename,Delete plan,Cancel', acts);
    await tap(page, '#planLedger [data-act="rename"]'); await W(200);
    await page.evaluate(() => { const i = document.querySelector('#planLedger input'); i.select(); }); await page.keyboard.type('Tivoli late'); await page.keyboard.press('Enter'); await W(600);
    const c2 = (await planCalls(page)).slice(1);
    ok('W5 Rename another plan (Enter saves): one update; the open plan is untouched', c2.length === 1 && c2[0].op === 'update' && c2[0].payload.name === 'Tivoli late' && (await h2(page)) === 'Harbour swim', c2);
    await page.evaluate(() => { window.__confirmText = null; window.confirm = t => { __confirmText = t; return false; }; });
    await openPicker(page);
    await tap(page, '#planLedger [data-more="p-tiv"]'); await W(150); await tap(page, '#planLedger [data-act="delete"]'); await W(300);
    ok('W6 Delete asks first ("Its places stay in your list."); Cancel deletes nothing', (await page.evaluate(() => __confirmText)) === 'Delete “Tivoli late”? Its places stay in your list.' && (await planCalls(page)).length === 2);
    await page.evaluate(() => { window.confirm = () => true; });
    await openPicker(page);
    await tap(page, '#planLedger [data-more="p-tiv"]'); await W(150); await tap(page, '#planLedger [data-act="delete"]'); await W(700);
    ok('W7 deleting another plan: one delete, it is gone, the open plan stays open', (await planCalls(page)).slice(-1)[0].op === 'delete' && (await h2(page)) === 'Harbour swim' && !(await page.evaluate(() => plans.some(p => p.id === 'p-tiv'))));
    await openPicker(page);
    await tap(page, '#planLedger [data-more="p-nor"]'); await W(150); await tap(page, '#planLedger [data-act="delete"]'); await W(700);
    ok('W8 deleting a plan with stops removes its stops too (cascade), places stay', !(await page.evaluate(() => planStops.some(s => s.plan_id === 'p-nor'))) && (await page.evaluate(() => locations.some(l => l.id === 'mir'))));
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
    await page.evaluate(() => planRowAct('add', { locationId: 'tor' }, 'Torvehallerne')); await W(700);
    ok('W12 a failed + rolls back and shows no slip', (await stopKeys(page)) === NOR && (await slip(page)) === null);
    await ctx.close(); }
  { const { ctx, page } = await open(b, { ...base, signedOut: true });
    await toPlans(page);
    ok('G1 signed out: plans are readable (stops, numbers, the picker\'s plans)', (await stopKeys(page)) === NOR && (await nums(page)) === '1,2,3,4,5,6' && (await page.evaluate(() => (setPlanPanel({ open: true }), document.querySelectorAll('#planLedger .plan-pick').length))) === 6);
    await tap(page, '#planLedger [data-act="new"]'); await W(300);
    const g = await page.evaluate(() => ({ modal: document.getElementById('authModal').classList.contains('show'), form: !!document.querySelector('#planLedger input'), copy: document.querySelector('#authModalBody p').textContent }));
    ok('G2 signed out: New plan opens the sign-in, no name field, no write', g.modal && !g.form && (await planCalls(page)).length === 0, g);
    ok('G3 sign-in copy covers plans', g.copy === 'You need to log in to make changes. Anyone can view places and plans without logging in.', g.copy);
    await page.evaluate(() => hideAuthModal());
    await page.evaluate(() => setPlanPanel({ open: false })); await closePanel(page);
    await tap(page, '.location-card[data-id="tor"] .plan-add'); await W(300);
    const g2 = await page.evaluate(() => document.getElementById('authModal').classList.contains('show')); await page.evaluate(() => hideAuthModal());
    await tap(page, '.location-card[data-id="cof"] .plan-x'); await W(300);
    const g3 = await page.evaluate(() => document.getElementById('authModal').classList.contains('show')); await page.evaluate(() => hideAuthModal());
    ok('G4 signed out: + and × open the sign-in; nothing changes, no slip', g2 && g3 && (await stopKeys(page)) === NOR && (await slip(page)) === null && (await planCalls(page)).length === 0);
    const api = await page.evaluate(async () => [await addStop('p-nor', { locationId: 'tor' }), await removeStop('s1'), await reorderStop('s1', 3), await moveStop('s1', 3)]);
    ok('G5 signed out: the data layer writes nothing', api.join() === ',false,false,false' && (await planCalls(page)).length === 0, api);
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
    ok('D6 the list follows the data layer (numbers 1..n with no gaps)', (await nums(page)) === '1,2,3,4,5,6', await nums(page));
    await ctx.close(); }
  { const { ctx, page } = await open(b, { ...base, failWrites: true });
    await toPlans(page);
    const r = await page.evaluate(async () => { const o0 = stopsOf('p-nor').map(s => s.id + ':' + s.position).join();
      await addStop('p-nor', { locationId: 'tor' }); await removeStop('s2'); await reorderStop('s5', 0);
      return [o0, stopsOf('p-nor').map(s => s.id + ':' + s.position).join()]; });
    ok('D7 failed add / remove / reorder each roll back exactly', r[0] === r[1], r);
    await ctx.close(); }

  // ---------------------------------------------------------------- the default view
  { const { ctx, page } = await open(b, base);
    await toPlans(page);
    const inBox = () => page.evaluate(() => { const box = planSafeBox(openPanelHeight()); return planMarks().rows.every(r => { const p = map.latLngToContainerPoint(stopLatLng(r)); return p.x >= box.l - 1 && p.x <= box.r + 1 && p.y >= box.t - 1 && p.y <= box.b + 1; }); });
    ok('M1 building (panel open): every stop and every filter match inside the safe box above the panel', (await inBox()) && (await page.evaluate(() => { const box = planSafeBox(openPanelHeight()); return planOthers().locs.every(l => { const p = map.latLngToContainerPoint([l.lat, l.lng]); return p.x >= box.l - 1 && p.x <= box.r + 1 && p.y >= box.t - 1 && p.y <= box.b + 1; }); })));
    const z0 = await page.evaluate(() => map.getZoom());
    await closePanel(page); await W(900);
    const z1 = await page.evaluate(() => map.getZoom());
    ok('M2 closing the panel re-fits for following (untouched map): every stop in the box, zoom not lower', (await inBox()) && z1 >= z0, [z0, z1]);
    await openPanel(page); await W(300);
    await page.evaluate(() => map.panBy([60, 40], { animate: false })); await W(200);
    await closePanel(page); await W(200);
    const c0 = await page.evaluate(() => planFitView());
    await W(500);
    ok('M3 once you moved the map, closing the panel leaves it alone', (await page.evaluate(() => planFitView())) === c0);
    await openPanel(page); await pick(page, 'p-mc'); await closePanel(page);
    await page.evaluate(() => setActiveCity('malmo')); await W(500);
    const leg = await page.evaluate(() => { const b = map.getBounds(); return ['lil', 'tiv', 'nyh'].map(id => { const l = locations.find(x => x.id === id); return b.contains([l.lat, l.lng]); }); });
    ok('M4 following a two-city plan: the Malmö chip frames the Malmö leg', leg[0] && !leg[1], leg);
    await ctx.close(); }

  // ---------------------------------------------------------------- row gestures still work on stop rows
  { const { ctx, page } = await open(b, base);
    await toPlans(page); await closePanel(page);
    const cdp = await page.context().newCDPSession(page);
    const drag = async pts => { await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [pts[0]] });
      for (const p of pts.slice(1)) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [p] }); await W(16); }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); };
    const line = (x0, y, x1, n) => Array.from({ length: n + 1 }, (_, i) => ({ x: x0 + (x1 - x0) * i / n, y }));
    const pt = async (id, sel) => { await page.evaluate(id => document.querySelector(`.location-card[data-id="${id}"]`).scrollIntoView({ block: 'center' }), id); await W(250);
      return page.evaluate(([id, sel]) => { const b = document.querySelector(`.location-card[data-id="${id}"] ${sel}`).getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, l: b.x }; }, [id, sel]); };
    let q = await pt('ass', '.row-main'); await drag(line(q.l + 10, q.y, q.l + 120, 12)); await W(1500);
    ok('Q1 Pencil Star (swipe right) stars a stop row; its number stays', await page.evaluate(() => locations.find(l => l.id === 'ass').starred && document.querySelector('.location-card[data-id="ass"] .row-n').textContent === '4' && !!document.querySelector('.location-card[data-id="ass"] .row-star')));
    q = await pt('jae', '.plan-x'); await drag(line(q.x, q.y, q.x - 110, 12)); await W(1500);
    const v = await page.evaluate(() => ({ v: locations.find(l => l.id === 'jae').visited, stamp: document.querySelectorAll('.location-card[data-id="jae"] .row-stamp').length, h: document.querySelector('.location-card[data-id="jae"]').getBoundingClientRect().height, held: starHeld.size }));
    ok('Q2 visit swipe (left, starting on ×) stamps a stop row and removes nothing; rows stay 56px', v.v && v.stamp === 1 && v.h === 56 && v.held === 0 && (await stopKeys(page)) === NOR, v);
    q = await pt('cof', '.row-n');
    const s0 = await page.evaluate(() => { const l = document.getElementById('locationsList'); l.scrollTop = 0; return l.scrollTop; });
    await drag([{ x: q.x, y: q.y + 40 }, { x: q.x, y: q.y + 20 }, { x: q.x, y: q.y }, { x: q.x, y: q.y - 20 }, { x: q.x, y: q.y - 40 }, { x: q.x, y: q.y - 60 }]); await W(400);
    ok('Q3 a quick vertical stroke on a number scrolls the list (no fly, no lift, no move)', (await page.evaluate(() => document.getElementById('locationsList').scrollTop)) > s0 && !(await page.$('.leaflet-popup')) && !(await page.$('.plan-lifted')) && (await stopKeys(page)) === NOR);
    await ctx.close(); }

  // ---------------------------------------------------------------- rail + collapsed
  { const { ctx, page, errors } = await open(b, { ...base, w: 1280, h: 800, touch: false });
    await page.click('#toggleFiltersBtn'); await W(400); await page.click('#listSwitch [data-view="plans"]'); await W(700);
    const r = await page.evaluate(() => { const p = document.getElementById('filtersPanel').getBoundingClientRect(), l = document.getElementById('locations').getBoundingClientRect(); return { pl: p.left, lw: l.width, h: document.querySelector('#locationsHeader h2').textContent, rows: [...document.querySelectorAll('#locationsList .location-card.is-stop')].map(e => e.getBoundingClientRect().height), cursor: getComputedStyle(document.querySelector('.row-n')).cursor }; });
    ok('L1 ≥900px rail: panel beside the rail, Plans list in the rail, rows 56px, the number shows a grab cursor', r.pl === 360 && r.lw === 360 && r.h === 'Nørrebro afternoon' && r.rows.length === 6 && r.rows.every(h => h === 56) && r.cursor === 'grab', r);
    // mouse hold-drag
    const m = await page.evaluate(() => { const n = document.querySelector('.location-card[data-id="mir"] .row-n').getBoundingClientRect(), t = document.querySelector('.location-card[data-id="cof"]').getBoundingClientRect(); return { x: n.x + n.width / 2, y: n.y + n.height / 2, to: t.y + t.height / 2 }; });
    await page.mouse.move(m.x, m.y); await page.mouse.down(); await W(470);
    for (let i = 1; i <= 8; i++) { await page.mouse.move(m.x, m.y + (m.to - m.y) * i / 8); await W(20); }
    await page.mouse.up(); await W(600);
    ok('L2 mouse: hold the number and drag reorders, no fly on release', (await stopKeys(page)) === 'jae,cof,mir,ass,S9001,bla' && !(await page.$('.leaflet-popup')), await stopKeys(page));
    await page.evaluate(() => document.querySelector('#listSwitch [aria-checked="true"]').focus()); await page.keyboard.press('ArrowLeft'); await W(500);
    ok('L3 keyboard: arrows move the switch (radiogroup)', (await page.evaluate(() => listView)) === 'places' && (await page.evaluate(() => document.activeElement.dataset.view)) === 'places');
    ok('L4 no errors on the rail', !errors.length, errors);
    await ctx.close(); }
  { const { ctx, page } = await open(b, base);
    await toPlans(page); await closePanel(page); await tap(page, '#collapseBtn'); await W(500);
    const c = await page.evaluate(() => ({ h: document.querySelector('#locationsHeader h2').textContent, band: document.getElementById('locationsHeader').getBoundingClientRect().height }));
    ok('L5 collapsed sheet: the band shows the plan name, 57px, ⇅ kept', c.h === 'Nørrebro afternoon' && c.band === 57 && (await shown(page, '#sortBtn')), c);
    await ctx.close(); }

  await b.close();
  console.log(`\n${pass}/${total} passed${fails.length ? '\nFAILED: ' + fails.join(' | ') : ''}`);
  process.exit(fails.length ? 1 : 0);
})();
