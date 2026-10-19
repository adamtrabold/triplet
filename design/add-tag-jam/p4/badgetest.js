// Phase 4 checks (add-tag-jam): the map's city badge and the "All cities" control.
//   node design/add-tag-jam/p4/badgetest.js [index.html]      (FILE env works too)
// Chromium, emulated touch, the gesture harness's stub. Covers: the zoom sweep (badges <-> pins /
// clusters swap at ONE zoom, CITY_BADGE_MAX_ZOOM); no flicker on pan (the same badge node, never
// removed); hidden city = no badge; the count follows the category chips; a city with nothing
// matching = no badge; list membership never changes with zoom; a badge tap (touch + keyboard) =
// the go-to (title, list header, map at the city's zoom, nothing hidden); "All cities" (fit + list
// top; gone in Plans and under the add tag); Plans = no badges; a cluster click still lands at
// SOLO_MIN_ZOOM; a list tap from a badge zoom still lands solo with its tag open.
const path = require('path');
if (process.argv[2]) process.env.FILE = path.resolve(process.argv[2]);
const P = require('./lib-p4.js');
const { lib, W } = P;
const { rec, finish } = lib.recorder('badgetest');

(async () => {
  const b = await lib.launch();
  const o = await P.open(b, { file: process.env.FILE });
  const page = o.page;
  const ev = (f, a) => page.evaluate(f, a);
  const REY = [64.1466, -21.9426];
  const consts = await ev(() => ({ badge: CITY_BADGE_MAX_ZOOM, solo: SOLO_MIN_ZOOM, glyph: GLYPH_MIN_ZOOM, cityZooms: Object.values(CITIES).map(c => c.zoom) }));
  rec('const', 'CITY_BADGE_MAX_ZOOM 8, SOLO 14, GLYPH 12, below every city zoom', consts.badge === 8 && consts.solo === 14 && consts.glyph === 12 && consts.cityZooms.every(z => z > consts.badge), consts);

  // 1. zoom sweep at Reykjavík: badge below 8, its pins/clusters at/above; swap at ONE zoom
  const sweep = [];
  for (let z = 3; z <= 15; z++) { await P.view(page, REY, z); sweep.push(await P.mapState(page, 'reykjavik')); }
  const swapOk = sweep.every(s => s.zoom < 8 ? (s.badge && s.pins + s.clusters === 0 && s.shapes === 0) : (!s.badge && s.pins + s.clusters > 0));
  rec('sweep', 'badge below 8, pins/clusters from 8, never both, never neither', swapOk, sweep);
  rec('sweep', 'badge text = name + tally (Reykjavík 23)', sweep[0].badge === 'Reykjavík23', sweep[0].badge);
  // stepping back down: the same swap (zoom out)
  const down = [];
  for (const z of [9, 8, 7, 6]) { await P.view(page, REY, z); down.push(await P.mapState(page, 'reykjavik')); }
  rec('sweep', 'zooming out swaps back at the same zoom', !down[0].badge && !down[1].badge && down[2].badge && down[3].badge, down);
  // at the real flyTo (zoom buttons), the end state only
  await P.view(page, REY, 8);
  await page.evaluate(() => map.zoomOut()); await W(800);
  rec('sweep', 'zoom-out button 8 -> 7: badge, no Reykjavík pins', (await P.mapState(page, 'reykjavik')).badge === 'Reykjavík23' && (await P.mapState(page, 'reykjavik')).pins === 0);

  // 2. pan at a badge zoom: the same node, never removed/re-added
  await P.view(page, [58, -5], 5);
  await ev(() => { window.__badgeNode = document.querySelector('.city-badge[data-city-badge="copenhagen"]');
    window.__badgeRemoved = 0; window.__mo = new MutationObserver(ms => ms.forEach(m => m.removedNodes.forEach(n => { if (n.classList && n.classList.contains('city-badge-anchor')) window.__badgeRemoved++; })));
    window.__mo.observe(map.getPane('markerPane'), { childList: true }); });
  for (const [dx, dy] of [[60, 0], [0, 40], [-80, -20], [30, 30]]) { await page.evaluate(([x, y]) => map.panBy([x, y], { animate: false }), [dx, dy]); await W(200); }
  const pan = await ev(() => ({ same: document.querySelector('.city-badge[data-city-badge="copenhagen"]') === window.__badgeNode, removed: window.__badgeRemoved, n: document.querySelectorAll('.city-badge').length }));
  rec('pan', 'no flicker on pan: same badge node, 0 removals', pan.same && pan.removed === 0, pan);
  // a real touch drag pan
  await lib.drag(page, o.cdp, lib.line(200, 250, 120, 300, 12));
  await W(500);
  const pan2 = await ev(() => ({ same: document.querySelector('.city-badge[data-city-badge="copenhagen"]') === window.__badgeNode, removed: window.__badgeRemoved }));
  rec('pan', 'touch-drag pan: same node, 0 removals', pan2.same && pan2.removed === 0, pan2);
  await ev(() => window.__mo.disconnect());

  // 3. list membership is zoom-independent
  const rowsAt = async z => { await P.view(page, REY, z); return ev(() => document.querySelectorAll('#locationsList .location-card').length + '/' + document.querySelectorAll('#locationsList .sec-head').length); };
  const r5 = await rowsAt(5), r13 = await rowsAt(13), r16 = await rowsAt(16);
  rec('list', 'list rows + headers identical at zoom 5 / 13 / 16', r5 === r13 && r13 === r16, { r5, r13, r16 });

  // 4. hidden city: no badge; showing it brings it back
  await P.view(page, [57, 0], 4);
  await ev(() => setCityHidden('malmo', true)); await W(300);
  const hid = await ev(() => ({ malmo: !!document.querySelector('[data-city-badge="malmo"]'), others: [...document.querySelectorAll('.city-badge')].map(e => e.dataset.cityBadge) }));
  rec('hidden', 'hidden Malmö: no badge, the others stay', !hid.malmo && hid.others.includes('copenhagen') && hid.others.includes('stockholm'), hid);
  await ev(() => setCityHidden('malmo', false)); await W(300);
  rec('hidden', 'shown again: its badge returns', await ev(() => !!document.querySelector('[data-city-badge="malmo"]')));

  // 5. the count follows the category chips (= the section tally)
  const before = await ev(() => document.querySelector('[data-city-badge="reykjavik"]').textContent);
  await ev(() => document.getElementById('filter-restaurant').click()); await W(300);
  const after = await ev(() => ({ badge: document.querySelector('[data-city-badge="reykjavik"]').textContent, tally: cityTally('reykjavik'),
    head: (cityHeads.get('reykjavik').el.querySelector('.sec-name .tally') || {}).textContent }));
  rec('count', 'restaurant chip off: badge tally drops and equals the section tally', after.badge !== before && after.badge === 'Reykjavík' + after.tally && after.head === String(after.tally), { before, after });
  await ev(() => document.getElementById('filter-restaurant').click()); await W(300);
  // every chip off: no badges (no shown place anywhere)
  await ev(() => { Object.keys(filters.categories).forEach(c => filters.categories[c] = false); updateUI(); }); await W(300);
  rec('count', 'every chip off: no badges', await ev(() => document.querySelectorAll('.city-badge').length === 0));
  await ev(() => resetCategoryFilters()); await W(300);

  // 6. a badge tap = the go-to (touch)
  await P.view(page, [59, 10], 5);
  await ev(() => { document.getElementById('locationsList').scrollTop = 0; });
  const bb = await ev(() => { const r = document.querySelector('[data-city-badge="stockholm"]').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  await page.touchscreen.tap(bb.x, bb.y); await W(2200);
  const go = await ev(() => {
    const head = cityHeads.get('stockholm').el, list = document.getElementById('locationsList');
    return { zoom: map.getZoom(), center: map.getCenter(), title: document.getElementById('titleBtn').getAttribute('aria-label') || document.getElementById('titleBtn').textContent,
      headTop: Math.round(head.getBoundingClientRect().top - list.getBoundingClientRect().top + landingTrim(head)), hidden: [...hiddenCities], badges: document.querySelectorAll('.city-badge').length,
      pins: [...markersById.values()].filter(e => e.loc.city === 'stockholm').length + clusterMarkersById.size, sel: citySelection };
  });
  rec('tap', 'badge tap: citySelection = Stockholm, map at its zoom (11), centred on it', go.sel === 'stockholm' && go.zoom === 11 && Math.abs(go.center.lat - 59.3293) < 0.01, go);
  rec('tap', 'badge tap: the title names Stockholm', /stockholm/i.test(go.title), go.title);
  rec('tap', 'badge tap: list lands on its header (compact landing)', Math.abs(go.headTop) <= 1, go.headTop);
  rec('tap', 'badge tap: nothing hidden, badges gone, its pins/clusters drawn', go.hidden.length === 0 && go.badges === 0 && go.pins > 0, go);

  // 7. keyboard: the badge is a focusable <button>; Enter goes
  await P.view(page, [62, -15], 4);
  rec('keys', 'Reykjavík badge on screen at [62,-15] z4', await ev(() => { const r = document.querySelector('[data-city-badge="reykjavik"]').getBoundingClientRect(); return r.left > 0 && r.right < innerWidth && r.top > 0; }));
  const kb = await ev(() => { const el = document.querySelector('[data-city-badge="reykjavik"]'); el.focus(); return { tag: el.tagName, focused: document.activeElement === el, wrapperTab: el.parentElement.getAttribute('tabindex') }; });
  await page.keyboard.press('Enter'); await W(2200);
  const kb2 = await ev(() => ({ sel: citySelection, zoom: map.getZoom() }));
  rec('keys', 'badge: a focusable button (wrapper not in the tab order); Enter = go-to', kb.tag === 'BUTTON' && kb.focused && kb.wrapperTab == null && kb2.sel === 'reykjavik' && kb2.zoom === 11, { kb, kb2 });

  // 8. "All cities": place, look, tap
  const ctl = await ev(() => { const r = document.getElementById('allCitiesBtn').getBoundingClientRect(), z = document.querySelector('.leaflet-control-zoom').getBoundingClientRect();
    const cs = getComputedStyle(document.getElementById('allCitiesBtn')); return { left: r.left, top: r.top, h: r.height, gap: r.top - z.bottom, border: cs.borderTopWidth + ' ' + cs.borderTopColor, radius: cs.borderTopLeftRadius }; });
  rec('all', 'All cities: left 10, top 84, 34 tall, 10px under the zoom control, Leaflet border', ctl.left === 10 && ctl.top === 84 && ctl.h === 34 && ctl.gap === 10 && ctl.border === '2px rgba(0, 0, 0, 0.2)' && ctl.radius === '4px', ctl);
  await ev(() => { document.getElementById('locationsList').scrollTop = 400; });
  await page.touchscreen.tap(50, 101); await W(2200);
  const all = await ev(() => { const bnd = map.getBounds(); const vis = visibleLocations();
    return { sel: citySelection, scroll: document.getElementById('locationsList').scrollTop, title: document.querySelector('#titleBtn .h-name').textContent, zoom: map.getZoom(),
      inView: vis.filter(l => bnd.contains([l.lat, l.lng])).length, total: vis.length, badges: [...document.querySelectorAll('.city-badge')].map(e => e.dataset.cityBadge) }; });
  rec('all', 'All cities tap: the All places go-to (title, list top), map zoomed out to badges', all.sel === '__all__' || all.title === 'All places', all);
  rec('all', 'All cities tap: list at its top; badges drawn', all.scroll === 0 && all.badges.length >= 4, all);
  // gone in Plans and under the add tag
  await ev(() => choosePlan('gh-p')); await W(900);
  const inPlan = await ev(() => getComputedStyle(document.getElementById('allCitiesBtn')).display);
  await P.view(page, [62, -15], 4);
  const planMap = await ev(() => ({ badges: document.querySelectorAll('.city-badge').length, stops: planMarks().rows.length, marks: markersById.size + clusterMarkersById.size }));
  rec('plans', 'Plans: no All cities control, no badges, the stops still drawn at zoom 4', inPlan === 'none' && planMap.badges === 0 && planMap.marks > 0, { inPlan, planMap });
  await ev(() => goToCity('reykjavik')); await W(1800);
  await ev(() => document.getElementById('floatingAddBtn').click()); await W(700);
  const inAdd = await ev(() => getComputedStyle(document.getElementById('allCitiesBtn')).display);
  rec('add', 'add tag up: no All cities control', inAdd === 'none', inAdd);
  await ev(() => { cancelAddForm(); }); await W(600);
  rec('add', 'add tag closed: the control is back', await ev(() => getComputedStyle(document.getElementById('allCitiesBtn')).display) === 'flex');

  // 9. a cluster click still lands at SOLO_MIN_ZOOM (from zoom 10)
  await P.view(page, REY, 10);
  const cl = await ev(() => { const m = [...clusterMarkersById.values()][0]; if (!m) return null; const r = m.getElement().getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  if (cl) { await page.touchscreen.tap(cl.x, cl.y); await W(2000); }
  const clz = await ev(() => map.getZoom());
  rec('cluster', 'cluster tap at zoom 10 lands at SOLO_MIN_ZOOM (14)', cl && clz === 14, { cl, clz });

  // 10. a list tap from a badge zoom lands solo, tag open
  await P.view(page, [60, -10], 5);
  await ev(() => { const en = rowEntry('rey05'); en.el.scrollIntoView({ block: 'center' }); en.el.click(); }); await W(3000);
  const lt = await ev(() => ({ zoom: map.getZoom(), tag: typeof openTagKey === 'function' ? openTagKey() : null, solo: markersById.has('rey05'), badges: document.querySelectorAll('.city-badge').length }));
  rec('listtap', 'list tap from zoom 5: lands >= SOLO_MIN_ZOOM, solo pin, its tag open, no badges', lt.zoom >= 14 && lt.solo && lt.tag === 'rey05' && lt.badges === 0, lt);
  await ev(() => map.closePopup()); await W(400);

  // 11. a city with no stored centre (data-only id) keeps its pins (no badge, no crash)
  await ev(() => { locations = locations.concat([{ ...locations.find(l => l.id === 'rey00'), id: 'orphan1', city: 'nowhere', lat: 40, lng: -40 }]); updateUI(); });
  await P.view(page, [40, -40], 5);
  const orphan = await ev(() => ({ pin: markersById.has('orphan1'), badge: !!document.querySelector('[data-city-badge="nowhere"]') }));
  rec('orphan', 'a city id with no CITIES entry: its pin stays, no badge', orphan.pin && !orphan.badge, orphan);

  rec('errors', 'no page errors', o.errors.length === 0, o.errors);
  finish();
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
