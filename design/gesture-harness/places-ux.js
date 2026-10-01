// PLACES-UX SUITE -- owner-approved Places changes (2026-10-01, docs/shipped.md "Plans (v3
// build)", Places changes): real touch taps, both motion modes.
//   P1 x8  a list-row tap with the filter panel OPEN closes the panel first, then flies and opens
//          that row's popup (the popup-open contract: title, zoom >= SOLO_MIN_ZOOM, solo marker),
//          with the popup clear of the list sheet; the filters are unchanged
//   P2     a tap on the row's delete X never closes the panel (the confirm is stubbed)
//   P3     a district row tap with the panel open: closed, shape popup open
//   B1     a write that fails for want of a connection: "Couldn't save. Check your connection.",
//          the row rolled back, the banner above the badges, gone after 6s
//   B2     an RLS refusal: "Only Adam and Erica can edit places.", stays past 6s, a tap dismisses
//   B3     a failed read: the navy info band "Offline. Showing what's loaded.", the list kept,
//          the `online` event clears it
//   E1     every chip off: "Nothing matches these filters."
// FILE=<index.html> OUT=<json> node places-ux.js
const { launch, openProto, W, recorder } = require('./lib');
const { rec, finish } = recorder('places-ux');
(async () => {
  const b = await launch();
  for (const reduced of [false, true]) { const mode = reduced ? 'reduced' : 'full';
    const { ctx, page, errors } = await openProto(b, { reduced });
    const ids = await page.evaluate(() => __rowIds());
    const panelOpen = () => page.evaluate(() => document.getElementById('filtersPanel').classList.contains('visible'));
    const openPanel = async () => { if (!(await panelOpen())) { await page.evaluate(() => document.getElementById('toggleFiltersBtn').click()); await W(450); } };
    const home = () => page.evaluate(() => { map.closePopup(); const c = CITIES[activeCity]; map.setView(c.center, c.zoom, { animate: false }); });
    const tapSel = async sel => { await page.evaluate(sel => { const e = document.querySelector(sel); const l = document.getElementById('locationsList'); const er = e.getBoundingClientRect(), lr = l.getBoundingClientRect();
        if (er.top < lr.top + 4 || er.bottom > lr.bottom - 4) l.scrollTop += er.top - lr.top - 8; }, sel); await W(150);
      const p = await page.evaluate(sel => { const r = document.querySelector(sel).getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, sel); await page.touchscreen.tap(p.x, p.y); };
    const filt0 = await page.evaluate(() => JSON.stringify(filters));
    for (const i of [0, 3, 5, 7, 9, 12, 15, 19]) {
      await home(); await openPanel(); const id = ids[i];
      await tapSel(`.location-card[data-id="${id}"] .row-main`); await W(1900);
      const s = await page.evaluate(id => { const loc = locations.find(l => l.id === id), t = document.querySelector('.leaflet-popup .popup-title'), e = markersById.get(id), pop = document.querySelector('.leaflet-popup');
        const sheet = document.getElementById('locations').getBoundingClientRect().top;
        return { panel: document.getElementById('filtersPanel').classList.contains('visible'), title: t ? t.textContent : null, name: loc.name, z: map.getZoom(), solo: !!(e && map.hasLayer(e.marker) && e.marker.isPopupOpen()),
          clear: pop ? pop.getBoundingClientRect().bottom <= sheet + 1 : false, filt: JSON.stringify(filters) }; }, id);
      rec(mode, `P1 row ${i} with the panel open: the panel closes, then the popup opens on arrival, clear of the sheet`, !s.panel && s.title === s.name && s.z >= 14 && s.solo && s.clear && s.filt === filt0, s);
    }
    { await home(); await openPanel(); await page.evaluate(() => { __del.length = 0; __nav.length = 0; }); await W(300);
      await tapSel(`.location-card[data-id="${ids[3]}"] .delete-btn`); await W(400); const o = await page.evaluate(() => ({ del: __del.length, nav: __nav.length }));
      rec(mode, 'P2 a tap on the delete X never closes the panel', (await panelOpen()) && o.del === 1, o); }
    { await home(); await openPanel(); await tapSel('.location-card[data-shape-id] .row-main'); await W(2200);
      const s = await page.evaluate(() => ({ panel: document.getElementById('filtersPanel').classList.contains('visible'), pop: !!document.querySelector('.leaflet-popup') }));
      rec(mode, 'P3 a district/street row tap with the panel open: the panel closes, the shape popup opens', !s.panel && s.pop, s); }
    const ban = () => page.evaluate(() => { const e = document.getElementById('error'); return { on: e.classList.contains('show'), info: e.classList.contains('info'), text: document.getElementById('errorText').textContent, z: +getComputedStyle(e).zIndex }; });
    { await page.evaluate(() => { window.__qf = supabaseClient.from; supabaseClient.from = t => { const b = window.__qf(t); if (t === 'locations') b.update = () => ({ eq: async () => ({ data: null, error: { message: 'TypeError: Failed to fetch' } }) }); return b; }; });
      const id = ids[4], v0 = await page.evaluate(id => locations.find(l => l.id === id).visited, id);
      await page.evaluate(id => toggleLocationFlag(id, 'visited'), id); await W(400);
      const n1 = await ban(), v1 = await page.evaluate(id => locations.find(l => l.id === id).visited, id); await W(6200); const n2 = await ban();
      rec(mode, 'B1 a write failing offline: rolled back, "Couldn’t save. Check your connection." above the badges, gone after 6s', n1.on && !n1.info && n1.text === 'Couldn’t save. Check your connection.' && n1.z > 2000 && v1 === v0 && !n2.on, { n1, n2 }); }
    { await page.evaluate(() => { supabaseClient.from = t => { const b = window.__qf(t); if (t === 'locations') b.update = () => ({ eq: async () => ({ data: null, error: { message: 'new row violates row-level security policy', code: '42501' } }) }); return b; }; });
      await page.evaluate(id => toggleLocationFlag(id, 'visited'), ids[4]); await W(400); const r1 = await ban(); await W(6400); const r2 = await ban();
      const q = await page.evaluate(() => { const r = document.getElementById('error').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }); await page.touchscreen.tap(q.x, q.y); await W(150); const r3 = await ban();
      rec(mode, 'B2 an RLS refusal: "Only Adam and Erica can edit places.", still there after 6s, a tap dismisses it', r1.text === 'Only Adam and Erica can edit places.' && r2.on && !r3.on, { r1, r2, r3 }); }
    { const n0 = await page.evaluate(() => document.querySelectorAll('#locationsList .location-card').length);
      await page.evaluate(async () => { supabaseClient.from = t => { const b = window.__qf(t); if (t === 'locations') b.then = (ok, bad) => Promise.resolve({ data: null, error: { message: 'TypeError: Load failed' } }).then(ok, bad); return b; }; await fetchLocations(); }); await W(300);
      const o1 = await ban(), n1 = await page.evaluate(() => document.querySelectorAll('#locationsList .location-card').length);
      await page.evaluate(() => { supabaseClient.from = window.__qf; window.dispatchEvent(new Event('online')); }); await W(900); const o2 = await ban();
      rec(mode, 'B3 a failed read: navy "Offline. Showing what’s loaded.", the list kept; `online` clears it', o1.on && o1.info && o1.text === 'Offline. Showing what’s loaded.' && n1 === n0 && !o2.on, { o1, o2, n0, n1 }); }
    { await page.evaluate(() => Object.keys(CATEGORY_COLORS).forEach(c => { if (filters.categories[c]) document.getElementById('filter-' + c).click(); })); await W(300);
      const t = await page.evaluate(() => [...document.getElementById('locationsEmpty').childNodes].find(n => n.nodeType === 3).textContent.trim());
      rec(mode, 'E1 every chip off: "Nothing matches these filters."', t === 'Nothing matches these filters.', t); }
    rec(mode, 'no page errors', !errors.length, errors);
    await ctx.close();
  }
  const ok = finish(); await b.close(); process.exitCode = ok ? 0 : 1;
})();
