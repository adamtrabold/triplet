// POPUP-OPEN SUITE -- "popup-open 20/20" (docs/shipped.md, "List click always opens the
// popup", 798134f/600912f). 20 real touch taps on list rows per motion mode; each must
// end with that item's popup open, the map arrived (pins: zoom >= SOLO_MIN_ZOOM, solo
// marker; shapes: zoom >= the shape's min zoom), and no other popup on the way.
//   A x8  pin clustered at the city's start view (zoom 11) -> fly in, open on arrival
//   B x4  pin tapped from another pin's close-up (chained taps)
//   C     already there (popup closed, same row again) -> opens at once
//   D     last tap wins (row, then another row 120ms later): only the 2nd ever opens
//   E     a map touch 100ms after the tap cancels the pending open (reduced: there is no flight,
//         so D/E assert the synchronous path instead: replaced / open within 60ms)
//   F x2  district below its min zoom (framed AT min zoom) / street
//   G     from far out (zoom 5)
//   H     the tapped row and its marker are the highlighted ones
//   I     the popup's marker is solo (never a cluster) at SOLO_MIN_ZOOM
// The original suite was never committed; these cases are rebuilt from the entry's
// spec. Gate: 20/20 in BOTH modes.
// FILE=<index.html> OUT=<json> node popup-open.js
const { launch, openProto, rowRect, W, recorder } = require('./lib');
const { rec, finish } = recorder('popup-open');
(async () => {
  const b = await launch(); const tally = {};
  for (const reduced of [false, true]) {
    const mode = reduced ? 'reduced' : 'full'; tally[mode] = 0;
    const r = (name, pass, detail) => { if (pass) tally[mode]++; rec(mode, name, pass, detail); };
    const { ctx, page, errors } = await openProto(b, { reduced });
    const ids = await page.evaluate(() => __rowIds());
    const home = () => page.evaluate(() => { map.closePopup(); const c = CITIES[activeCity]; map.setView(c.center, c.zoom, { animate: false }); });
    const tapRow = async (sel) => { const q = await page.evaluate(sel => { const e = document.querySelector(sel); const l = document.getElementById('locationsList'); const er = e.getBoundingClientRect(), lr = l.getBoundingClientRect();
        if (er.top < lr.top + 40 || er.bottom > lr.bottom - 8) l.scrollTop += er.top - lr.top - 60; }, sel); await W(120);
      const p = await page.evaluate(sel => { const b = document.querySelector(sel + ' .row-main').getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }, sel); await page.touchscreen.tap(p.x, p.y); };
    const pinState = (id) => page.evaluate(id => { const loc = locations.find(l => l.id === id); const t = document.querySelector('.leaflet-popup .popup-title');
      const e = markersById.get(id); return { z: map.getZoom(), title: t ? t.textContent : null, name: loc.name, solo: !!(e && map.hasLayer(e.marker) && e.marker.isPopupOpen()), hl: highlightedId === id,
        rowHl: document.querySelector(`.location-card[data-id="${id}"]`).classList.contains('highlighted'), solomin: SOLO_MIN_ZOOM }; }, id);
    const pinOk = s => s.title === s.name && s.z >= s.solomin && s.solo;
    const pin = async (label, idx, { reset = true } = {}) => { if (reset) await home(); await W(150); const id = ids[idx];
      const z0 = await page.evaluate(() => map.getZoom()); await tapRow(`.location-card[data-id="${id}"]`); await W(1800); const s = await pinState(id); r(`${label}: row ${idx} from zoom ${z0} -> popup "${s.title}" at z${s.z}`, pinOk(s), s); return s; };
    for (const i of [0, 2, 4, 6, 8, 10, 12, 14]) { const before = await (async () => { await home(); return page.evaluate(id => { const e = markersById.get(id); return !(e && map.hasLayer(e.marker)); }, ids[i]); })();
      await pin(`A clustered at start (${before ? 'no solo marker yet' : 'solo'})`, i, { reset: false }); }
    await home(); await W(100); for (const i of [16, 17, 18, 19]) await pin('B chained', i, { reset: false });
    { await page.evaluate(() => map.closePopup()); await W(200); const id = ids[19]; await tapRow(`.location-card[data-id="${id}"]`); await W(250); const s = await pinState(id);
      r('C already there: opens at once (<=250ms, no flight)', pinOk(s), s); }
    { await home(); await W(150); const seen = new Set(); const a = ids[1], c = ids[3]; await tapRow(`.location-card[data-id="${a}"]`); await W(120); await tapRow(`.location-card[data-id="${c}"]`);
      for (let k = 0; k < 40; k++) { const t = await page.evaluate(() => { const e = document.querySelector('.leaflet-popup .popup-title'); return e && e.textContent; }); if (t) seen.add(t); await W(50); }
      const s = await pinState(c); const na = await page.evaluate(id => locations.find(l => l.id === id).name, a);
      // reduced motion has no flight: the first tap opens at once and the second replaces it
      if (!reduced) r('D last tap wins: only the second row ever opens', pinOk(s) && !seen.has(na), { s, seen: [...seen] });
      else r('D last tap wins (reduced: the 1st opens at once, the 2nd replaces it)', pinOk(s), { s, seen: [...seen] }); }
    if (!reduced) { await home(); await W(150); const id = ids[5]; await tapRow(`.location-card[data-id="${id}"]`); await W(100); await page.touchscreen.tap(200, 250); await W(1800);
      const t = await page.evaluate(() => { const e = document.querySelector('.leaflet-popup .popup-title'); return e && e.textContent; }); const nm = await page.evaluate(id => locations.find(l => l.id === id).name, id);
      r('E a map touch during the flight cancels the pending popup', t !== nm, { popup: t }); }
    else { await home(); await W(150); const id = ids[5]; await tapRow(`.location-card[data-id="${id}"]`); await W(60); const s = await pinState(id);   // setView() fires moveend synchronously: same path, no pending intent
      r('E (reduced) no flight: the popup is open within 60ms of the tap', pinOk(s), s); }
    for (const type of ['district', 'street']) { await home(); await W(150);
      const sid = await page.evaluate(t => neighborhoodShapes.find(n => n.type === t && n.city === activeCity).id, type);
      await tapRow(`.location-card[data-shape-id="${sid}"]`); await W(1800);
      const s = await page.evaluate(id => { const nb = neighborhoodShapes.find(n => n.id === id); const lay = neighborhoodLayersById.get(id); const t = document.querySelector('.leaflet-popup .popup-title');
        return { z: map.getZoom(), minZoom: neighborhoodMinZoom(nb), title: t && t.textContent, label: nb.label, open: !!(lay && lay.isPopupOpen()) }; }, sid);
      r(`F ${type} row -> its popup at z${s.z} (min ${s.minZoom})`, s.open && s.title === s.label && s.z >= s.minZoom, s); }
    { await page.evaluate(() => { map.closePopup(); map.setView([60, 0], 5, { animate: false }); }); await W(150); const id = ids[7]; await tapRow(`.location-card[data-id="${id}"]`); await W(2500); const s = await pinState(id);
      r(`G from far out (zoom 5) -> popup at z${s.z}`, pinOk(s), s); }
    { await home(); await W(150); const id = ids[9]; await tapRow(`.location-card[data-id="${id}"]`); await W(1800); const s = await pinState(id);
      r('H tapped row + its marker are the highlighted ones', pinOk(s) && s.hl && s.rowHl, s); }
    { await home(); await W(150); const id = ids[11]; await tapRow(`.location-card[data-id="${id}"]`); await W(1800);
      const s = await page.evaluate(([id]) => { const e = markersById.get(id); const inCluster = [...document.querySelectorAll('.leaflet-marker-icon')].some(m => m.querySelector('.cluster-badge, .cluster') && m.classList.contains('leaflet-popup-open'));
        return { z: map.getZoom(), solo: !!(e && map.hasLayer(e.marker)), open: !!(e && e.marker.isPopupOpen()), inCluster, solomin: SOLO_MIN_ZOOM }; }, [id]);
      r('I the popup opens on a solo marker at >= SOLO_MIN_ZOOM', s.solo && s.open && s.z >= s.solomin && !s.inCluster, s); }
    r('no page errors', !errors.length, errors); tally[mode]--;   // not one of the 20
    await ctx.close();
  }
  const line = Object.entries(tally).map(([m, n]) => `${m} ${n}/20`).join(', ');
  console.log(`popup-open ${line}`);
  const ok = finish({ tally }); await b.close(); process.exitCode = ok && Object.values(tally).every(n => n === 20) ? 0 : 1;
})();
