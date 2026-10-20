// Phase 4 checks (add-tag-jam): the map's city SIGNPOSTS (owner: "signposts instead of city
// badges are approved"); the "All cities" map control is gone (All places does the job).
//   node design/add-tag-jam/p4/badgetest.js [index.html]      (FILE env works too)
// Chromium, emulated touch, the gesture harness's stub. Covers: the zoom sweep (signs <-> pins /
// clusters swap at ONE zoom, CITY_BADGE_MAX_ZOOM); no flicker on pan (the same sign node, never
// removed); list membership never changes with zoom; hidden city = no sign; the count follows the
// chips; joined posts (one post for close cities, boards north to south pointing toward their
// cities; LA never joins a Nordic post); no two signs overlap and none overlaps a control at
// z1-7; a drawn sign is whole inside the clear area, its foot on its city (or its cities' mean);
// a sign that doesn't fit isn't drawn; only boards tap, each to its own city (touch + keyboard);
// All places shows every shown city's sign fully on screen at 390px; Plans = no signs; a cluster
// click still lands at SOLO_MIN_ZOOM; a list tap from sign zoom still lands solo with its tag.
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
  // every drawn sign: its boards, its rect (incl. pole + foot dot), its foot vs its cities
  const signs = () => ev(() => {
    const mr = map.getContainer().getBoundingClientRect(), safe = badgeSafeRect();
    return [...document.querySelectorAll('#map .sp-post')].map(post => {
      const boards = [...post.querySelectorAll('.sp-board')], foot = post.querySelector('.sp-foot').getBoundingClientRect();
      const rs = boards.map(e => e.getBoundingClientRect()).concat([foot, post.querySelector('.sp-pole').getBoundingClientRect()]);
      const ids = boards.map(e => e.dataset.cityBadge);
      const pts = ids.map(id => map.latLngToContainerPoint(CITIES[id].center));
      const m = { x: pts.reduce((t, q) => t + q.x, 0) / pts.length, y: pts.reduce((t, q) => t + q.y, 0) / pts.length };
      const fx = foot.left + foot.width / 2 - mr.left, fy = foot.top + foot.height / 2 - mr.top;
      return { ids, sides: boards.map(e => e.classList.contains('is-w') ? 'w' : 'e'), lats: ids.map(id => CITIES[id].center[0]),
        cityX: pts.map(q => q.x), footX: fx, footY: fy, footOff: Math.hypot(fx - m.x, fy - m.y),
        x0: Math.min(...rs.map(r => r.left)) - mr.left, y0: Math.min(...rs.map(r => r.top)) - mr.top, x1: Math.max(...rs.map(r => r.right)) - mr.left + 2, y1: Math.max(...rs.map(r => r.bottom)) - mr.top,
        safe: { l: safe.left, r: safe.right, t: safe.top, b: safe.bottom }, controls: safe.controls };
    });
  });
  const consts = await ev(() => ({ badge: CITY_BADGE_MAX_ZOOM, solo: SOLO_MIN_ZOOM, glyph: GLYPH_MIN_ZOOM, min: map.getMinZoom(), cityZooms: Object.values(CITIES).map(c => c.zoom) }));
  rec('const', 'CITY_BADGE_MAX_ZOOM 8, SOLO 14, GLYPH 12, minZoom 1, 8 below every city zoom', consts.badge === 8 && consts.solo === 14 && consts.glyph === 12 && consts.min === 1 && consts.cityZooms.every(z => z > consts.badge), consts);
  rec('control', 'no "All cities" map control', await ev(() => !document.getElementById('allCitiesBtn') && !document.querySelector('.all-cities-btn')));

  // 1. zoom sweep at Reykjavík: a sign below 8, its pins/clusters at/above; swap at ONE zoom
  const sweep = [];
  for (let z = 3; z <= 15; z++) { await P.view(page, REY, z); sweep.push(await P.mapState(page, 'reykjavik')); }
  rec('sweep', 'sign below 8, pins/clusters from 8, never both, never neither', sweep.every(s => s.zoom < 8 ? (s.badge && s.pins + s.clusters === 0 && s.shapes === 0) : (!s.badge && s.pins + s.clusters > 0)), sweep);
  rec('sweep', 'board text = name + tally (Reykjavík 23)', sweep[0].badge === 'Reykjavík23', sweep[0].badge);
  const down = [];
  for (const z of [9, 8, 7, 6]) { await P.view(page, REY, z); down.push(await P.mapState(page, 'reykjavik')); }
  rec('sweep', 'zooming out swaps back at the same zoom', !down[0].badge && !down[1].badge && down[2].badge && down[3].badge, down);
  await P.view(page, REY, 8);
  await ev(() => map.zoomOut()); await W(800);
  const zb = await P.mapState(page, 'reykjavik');
  rec('sweep', 'zoom-out button 8 -> 7: sign, no Reykjavík pins', zb.badge === 'Reykjavík23' && zb.pins === 0, zb);

  // 2. pan at a sign zoom: the same node, never removed/re-added (the post stands mid-map)
  await P.view(page, [56.5, 13], 5);
  await ev(() => { window.__badgeNode = document.querySelector('[data-city-badge="copenhagen"]');
    window.__badgeRemoved = 0; window.__mo = new MutationObserver(ms => ms.forEach(m => m.removedNodes.forEach(n => { if (n.querySelector && n.querySelector('[data-city-badge="copenhagen"]')) window.__badgeRemoved++; })));
    window.__mo.observe(map.getPane('markerPane'), { childList: true }); });
  for (const [dx, dy] of [[30, 0], [0, 20], [-40, -10], [15, 15]]) { await page.evaluate(([x, y]) => map.panBy([x, y], { animate: false }), [dx, dy]); await W(200); }
  const pan = await ev(() => ({ had: !!window.__badgeNode, same: document.querySelector('[data-city-badge="copenhagen"]') === window.__badgeNode, removed: window.__badgeRemoved }));
  rec('pan', 'no flicker on pan: same sign node, 0 removals', pan.had && pan.same && pan.removed === 0, pan);
  await lib.drag(page, o.cdp, lib.line(200, 250, 160, 270, 10));
  await W(500);
  const pan2 = await ev(() => ({ same: document.querySelector('[data-city-badge="copenhagen"]') === window.__badgeNode, removed: window.__badgeRemoved }));
  rec('pan', 'touch-drag pan: same node, 0 removals', pan2.same && pan2.removed === 0, pan2);
  await ev(() => window.__mo.disconnect());

  // 3. list membership is zoom-independent
  const rowsAt = async z => { await P.view(page, REY, z); return ev(() => document.querySelectorAll('#locationsList .location-card').length + '/' + document.querySelectorAll('#locationsList .sec-head').length); };
  const r5 = await rowsAt(5), r13 = await rowsAt(13), r16 = await rowsAt(16);
  rec('list', 'list rows + headers identical at zoom 5 / 13 / 16', r5 === r13 && r13 === r16, { r5, r13, r16 });

  // 4. layout at z1-7 over the 5-city fixture: no overlaps, clear of controls, whole in the clear
  // area, foot on its cities' mean, boards north to south pointing toward their cities, LA alone
  const views = [[[59, 12], 4], [[57, 14], 6], [[55.64, 12.8], 7], [[62, 0], 2], [[50, -40], 1], [[48, -75], 3], [[60, -2], 3], [[56.5, 13], 5]];
  const bad = [];
  let drawn = 0;
  for (const [c, z] of views) {
    await P.view(page, c, z);
    const ss = await signs(); drawn += ss.length;
    const hit = (a, q) => a.x0 < q.x1 && q.x0 < a.x1 && a.y0 < q.y1 && q.y0 < a.y1;
    ss.forEach((s, i) => {
      if (ss.some((t, j) => j > i && hit(s, t))) bad.push(['overlap', z, s.ids]);
      if (s.controls.some(k => hit(s, k))) bad.push(['control', z, s.ids]);
      if (s.x0 < s.safe.l - 0.5 || s.x1 > s.safe.r + 0.5 || s.y0 < s.safe.t - 0.5 || s.y1 > s.safe.b + 1) bad.push(['outside clear area', z, s.ids, [s.x0, s.y0, s.x1, s.y1], s.safe]);
      if (s.footOff > 1.5) bad.push(['foot off its cities', z, s.ids, s.footOff]);
      if (s.lats.some((l, k) => k && l > s.lats[k - 1])) bad.push(['not north to south', z, s.ids]);
      if (s.ids.length > 1 && s.sides.some((d, k) => (d === 'w') !== (s.cityX[k] < s.footX - 0.5) && Math.abs(s.cityX[k] - s.footX) > 0.5)) bad.push(['board points away from its city', z, s.ids, s.sides]);
      if (s.ids.includes('la') && s.ids.length > 1) bad.push(['LA joined', z, s.ids]);
    });
  }
  rec('layout', 'z1-7: no overlaps, clear of controls, whole in the clear area, foot on its city, boards point to their cities, LA alone', bad.length === 0 && drawn >= 8, { drawn, bad });
  // close cities share ONE post (Copenhagen + Malmö at z7)
  await P.view(page, [55.64, 12.8], 7);
  const cm = await signs();
  rec('join', 'Copenhagen + Malmö at z7: one post, Copenhagen west, Malmö east', cm.length === 1 && cm[0].ids.join() === 'copenhagen,malmo' && cm[0].sides.join() === 'w,e', cm.map(s => [s.ids, s.sides]));
  // only boards tap: the pole and the foot don't
  rec('tap', 'pole and foot are not tap targets (pointer-events none), boards are', await ev(() => {
    const post = document.querySelector('#map .sp-post'); if (!post) return false;
    const pe = sel => getComputedStyle(post.querySelector(sel)).pointerEvents;
    return getComputedStyle(post).pointerEvents === 'none' && pe('.sp-pole') === 'none' && pe('.sp-foot') === 'none' && pe('.sp-board') === 'auto';
  }));

  // a sign that doesn't fit isn't drawn (Stockholm with its spot by the map's right edge)
  await P.view(page, [59.3293, 18.0686], 6);
  await ev(() => map.panBy([0, map.getSize().y / 2 - 60], { animate: false })); await W(400);   // Stockholm's spot 60px from the top: no room above it
  const edge = await ev(() => ({ y: map.latLngToContainerPoint(CITIES.stockholm.center).y, drawn: !!document.querySelector('[data-city-badge="stockholm"]'), pins: [...markersById.values()].filter(e => e.loc.city === 'stockholm').length + [...clusterMarkersById.keys()].filter(k => k.includes('sto')).length }));
  rec('fit', 'a sign with no room (Stockholm 60px from the top) is not drawn, and no pins stand in for it', Math.abs(edge.y - 60) < 2 && !edge.drawn && edge.pins === 0, edge);
  // 5. hidden city: no sign; showing it brings it back
  await P.view(page, [59, 12], 4);
  await ev(() => setCityHidden('malmo', true)); await W(300);
  const hid = await ev(() => ({ malmo: !!document.querySelector('[data-city-badge="malmo"]'), others: [...document.querySelectorAll('.sp-board')].map(e => e.dataset.cityBadge) }));
  rec('hidden', 'hidden Malmö: no board, the others stay', !hid.malmo && hid.others.includes('copenhagen') && hid.others.includes('stockholm'), hid);
  await ev(() => setCityHidden('malmo', false)); await W(300);
  rec('hidden', 'shown again: its board returns', await ev(() => !!document.querySelector('[data-city-badge="malmo"]')));

  // 6. the count follows the category chips (= the section tally)
  await P.view(page, REY, 5);
  const before = await ev(() => document.querySelector('[data-city-badge="reykjavik"]').textContent);
  await ev(() => document.getElementById('filter-restaurant').click()); await W(300);
  const after = await ev(() => ({ badge: document.querySelector('[data-city-badge="reykjavik"]').textContent, tally: cityTally('reykjavik'),
    head: (cityHeads.get('reykjavik').el.querySelector('.sec-name .tally') || {}).textContent }));
  rec('count', 'restaurant chip off: the tally drops and equals the section tally', after.badge !== before && after.badge === 'Reykjavík' + after.tally && after.head === String(after.tally), { before, after });
  await ev(() => document.getElementById('filter-restaurant').click()); await W(300);
  await ev(() => { Object.keys(filters.categories).forEach(c => filters.categories[c] = false); updateUI(); }); await W(300);
  rec('count', 'every chip off: no signs', await ev(() => document.querySelectorAll('#map .sp-post').length === 0));
  await ev(() => resetCategoryFilters()); await W(300);

  // 7. every board's tap goes to its own city (touch), each from the z4 view
  const tapped = {};
  for (const id of ['stockholm', 'copenhagen', 'malmo']) {
    await ev(() => goToCity('__all__')); await W(1500);
    await P.view(page, [59, 12], 4);
    await ev(() => { document.getElementById('locationsList').scrollTop = 0; });
    const bb = await ev(id => { const e = document.querySelector(`[data-city-badge="${id}"]`); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width * 0.4, y: r.y + r.height / 2 }; }, id);
    if (!bb) { tapped[id] = 'no board'; continue; }
    await page.touchscreen.tap(bb.x, bb.y); await W(2200);
    tapped[id] = await ev(id => {
      const head = cityHeads.get(id).el, list = document.getElementById('locationsList');
      return { sel: citySelection, zoom: map.getZoom(), title: document.getElementById('titleBtn').getAttribute('aria-label') || '', near: haversineKm([map.getCenter().lat, map.getCenter().lng], CITIES[id].center) < 2,
        headTop: Math.round(head.getBoundingClientRect().top - list.getBoundingClientRect().top + landingTrim(head)), hidden: hiddenCities.size, signs: document.querySelectorAll('#map .sp-post').length };
    }, id);
  }
  rec('tap', 'each board goes to its own city: selection, the city zoom, centred, title, list on its header, nothing hidden, signs gone',
    Object.entries(tapped).every(([id, t]) => t.sel === id && t.zoom === CITIES_ZOOM(id) && t.near && new RegExp(id === 'malmo' ? 'malm' : id, 'i').test(t.title) && Math.abs(t.headTop) <= 1 && t.hidden === 0 && t.signs === 0), tapped);
  function CITIES_ZOOM(id) { return { stockholm: 11, copenhagen: 12, malmo: 12 }[id]; }

  // 8. keyboard: a board is a focusable button (the marker wrapper isn't); Enter goes
  await P.view(page, [62, -15], 4);
  const kb = await ev(() => { const el = document.querySelector('[data-city-badge="reykjavik"]'); if (!el) return null; el.focus(); return { tag: el.tagName, focused: document.activeElement === el, wrapperTab: el.closest('.leaflet-marker-icon').getAttribute('tabindex') }; });
  await page.keyboard.press('Enter'); await W(2200);
  const kb2 = await ev(() => ({ sel: citySelection, zoom: map.getZoom() }));
  rec('keys', 'board: a focusable button (wrapper not in the tab order); Enter = go-to', kb && kb.tag === 'BUTTON' && kb.focused && kb.wrapperTab == null && kb2.sel === 'reykjavik' && kb2.zoom === 11, { kb, kb2 });

  // 9. All places (the title menu's go-to): every shown city's sign fully on screen at 390px
  await ev(() => { document.getElementById('locationsList').scrollTop = 400; goToCity('__all__'); }); await W(2800);
  const all = await ev(() => ({ zoom: map.getZoom(), scroll: document.getElementById('locationsList').scrollTop, w: innerWidth,
    shown: sectionCityIds().filter(id => cityShown(id) && cityTally(id) > 0) }));
  const allSigns = await signs();
  const onIds = allSigns.flatMap(s => s.ids);
  const whole = allSigns.every(s => s.x0 >= s.safe.l - 0.5 && s.x1 <= s.safe.r + 0.5 && s.y0 >= s.safe.t - 0.5 && s.y1 <= s.safe.b + 1);
  rec('all', 'after All places at 390px: every shown city has a board, every sign whole in the clear area; list at its top', all.w === 390 && all.shown.length === 5 && all.shown.every(id => onIds.includes(id)) && whole && all.scroll === 0, { all, signs: allSigns.map(s => [s.ids, Math.round(s.x0), Math.round(s.y0), Math.round(s.x1), Math.round(s.y1)]) });
  // one city hidden: All places still frames the rest
  await ev(() => setCityHidden('la', true)); await W(200);
  await ev(() => goToCity('__all__')); await W(2800);
  const all2 = (await signs()).flatMap(s => s.ids);
  rec('all', 'All places with LA hidden: the four others drawn, LA not; closer than before', ['reykjavik', 'copenhagen', 'malmo', 'stockholm'].every(id => all2.includes(id)) && !all2.includes('la') && await ev(() => map.getZoom()) > all.zoom, all2);
  await ev(() => setCityHidden('la', false)); await W(200);

  // 10. Plans: no signs; the stops still drawn at zoom 4
  await ev(() => choosePlan('gh-p')); await W(900);
  await P.view(page, [59, 12], 4);
  const planMap = await ev(() => ({ signs: document.querySelectorAll('#map .sp-post').length, marks: markersById.size + clusterMarkersById.size }));
  rec('plans', 'Plans: no signs, the stops still drawn at zoom 4', planMap.signs === 0 && planMap.marks > 0, planMap);
  await ev(() => goToCity('reykjavik')); await W(1800);

  // 11. a cluster click still lands at SOLO_MIN_ZOOM (from zoom 10)
  await P.view(page, REY, 10);
  const cl = await ev(() => { const m = [...clusterMarkersById.values()][0]; if (!m) return null; const r = m.getElement().getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  if (cl) { await page.touchscreen.tap(cl.x, cl.y); await W(2000); }
  const clz = await ev(() => map.getZoom());
  rec('cluster', 'cluster tap at zoom 10 lands at SOLO_MIN_ZOOM (14)', cl && clz === 14, { cl, clz });

  // 12. a list tap from a sign zoom lands solo, tag open
  await P.view(page, [60, -10], 5);
  await ev(() => { const en = rowEntry('rey05'); en.el.scrollIntoView({ block: 'center' }); en.el.click(); }); await W(3000);
  const lt = await ev(() => ({ zoom: map.getZoom(), tag: openTagKey(), solo: markersById.has('rey05'), signs: document.querySelectorAll('#map .sp-post').length }));
  rec('listtap', 'list tap from zoom 5: lands >= SOLO_MIN_ZOOM, solo pin, its tag open, no signs', lt.zoom >= 14 && lt.solo && lt.tag === 'rey05' && lt.signs === 0, lt);
  await ev(() => map.closePopup()); await W(400);

  // 13. a city id with no stored centre (data-only) keeps its pins (no sign, no crash)
  await ev(() => { locations = locations.concat([{ ...locations.find(l => l.id === 'rey00'), id: 'orphan1', city: 'nowhere', lat: 40, lng: -40 }]); updateUI(); });
  await P.view(page, [40, -40], 5);
  const orphan = await ev(() => ({ pin: markersById.has('orphan1'), badge: !!document.querySelector('[data-city-badge="nowhere"]') }));
  rec('orphan', 'a city id with no CITIES entry: its pin stays, no sign', orphan.pin && !orphan.badge, orphan);

  rec('errors', 'no page errors', o.errors.length === 0, o.errors);
  finish();
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
