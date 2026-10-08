// TAG-SYNC SUITE -- "tag-sync n/n" (docs/shipped.md, "Randomized ink + tag stamps from anywhere").
// Owner 2026-10-08: "when i have a tag open that is unvisited, if i mark it visited in the list, the
// animation on the tag marking it visited should still run (right now the state just changes)".
// Per motion mode, with a place's tag open:
//   A  a real row swipe (visit) -> the open tag stamps ONCE (one tagStampIn start; reduced: none,
//      the stamp simply there)
//   B  a refetch + re-render afterwards never replays it (0 new starts, no .tag-stamp-in left)
//   C  a row swipe back (un-visit) -> the tag lifts the stamp ONCE (.tag-stamp-out; reduced: none)
//   D  Visited tapped ON the tag -> exactly one tagStampIn (no double from the state-change path)
//   E  a district: visited set from the list path -> its open tag stamps once
//   F  an unrelated place visited from its row -> the open tag does NOT animate
// FILE=<index.html> OUT=<json> node tagsync.js
const L = require('./lib');
const { launch, openProto, W, recorder } = L;
const { rec, finish } = recorder('tag-sync');
const left = (g, dist, n) => L.line(g.xc, g.y, g.xc - dist, g.y, n);
async function geo(page, id) {
  await page.evaluate(id => { const el = document.querySelector(`#locationsList .location-card[data-id="${CSS.escape(id)}"]`), l = document.getElementById('locationsList');
    const r = el.getBoundingClientRect(), lr = l.getBoundingClientRect(); if (r.top < lr.top + 4 || r.bottom > lr.bottom - 4) l.scrollTop += r.top - lr.top - 4; }, id);
  await W(150);
  return page.evaluate(id => { const el = document.querySelector(`#locationsList .location-card[data-id="${CSS.escape(id)}"]`); const r = el.getBoundingClientRect(), x = el.querySelector('.delete-btn').getBoundingClientRect();
    return { y: r.y + r.height / 2, xc: x.x + x.width / 2 }; }, id);
}
(async () => {
  const b = await launch();
  for (const reduced of [false, true]) {
    const mode = reduced ? 'reduced' : 'full';
    const r = (name, pass, detail) => rec(mode, name, pass, detail);
    const { ctx, page, cdp, errors } = await openProto(b, { reduced, h: 900 });
    await page.evaluate(() => { window.__ins = 0; window.__outs = 0;
      document.addEventListener('animationstart', e => { if (e.animationName === 'tagStampIn') __ins++; if (e.animationName === 'tagStampOut') __outs++; }, true); });
    const open = id => page.evaluate(async id => { const l = locations.find(x => x.id === id); map.setView([l.lat, l.lng], 16, { animate: false }); syncMarkerGlyphZoom(); markersById.get(l.id).marker.openPopup(); await new Promise(r => setTimeout(r, 900)); }, id);
    const tag = () => page.evaluate(() => { const t = document.querySelector('.tag-popup .tag'); const s = t && t.querySelector('.popup-visited .row-stamp:not(.tag-stamp-out)');
      return { open: !!t, name: t && t.getAttribute('aria-label'), stamp: !!s, stampIn: !!(s && s.classList.contains('tag-stamp-in')), out: !!(t && t.querySelector('.tag-stamp-out')), ins: __ins, outs: __outs }; });
    const ids = await page.evaluate(() => __rowIds().filter(id => { const l = locations.find(x => x.id === id); return l && !l.visited && !l.starred; }));
    const id = ids[1], other = ids[3];
    // A
    await open(id); let s0 = await tag();
    let g = await geo(page, id);
    await L.drag(page, cdp, left(g, 110, 12)); await W(120); let s = await tag();
    const visited = await page.evaluate(id => locations.find(x => x.id === id).visited, id);
    r('A row swipe visits; the open tag stamps once', s.open && visited && s.stamp && (reduced ? s.ins === s0.ins : s.ins === s0.ins + 1), { s0, s, visited });
    await W(900);
    // B
    const s1 = await tag();
    // the poll's path, then a forced rebuild of the open tag's HTML (what a star tap or a changed row does)
    await page.evaluate(async id => { await refetchLocations(); updateUI(); const e = markersById.get(id); e.marker.setPopupContent(buildPopupHtml(e.loc)); }, id); await W(500);
    s = await tag(); r('B a refetch + re-render never replays it', s.stamp && !s.stampIn && s.ins === s1.ins, { s1, s });
    // C
    g = await geo(page, id); const c0 = await tag();
    await L.drag(page, cdp, left(g, 110, 12)); await W(120); s = await tag();
    const unvisited = await page.evaluate(id => !locations.find(x => x.id === id).visited, id);
    r('C row swipe un-visits; the open tag lifts the stamp once', s.open && unvisited && !s.stamp && (reduced ? s.outs === c0.outs : s.out && s.outs === c0.outs + 1), { c0, s, unvisited });
    await W(900);
    // D
    const d0 = await tag();
    const q = await page.evaluate(() => { const e = document.querySelector('.tag-popup .popup-visited-tap') || document.querySelector('.tag-popup .popup-visited'); const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
    await page.touchscreen.tap(q.x, q.y); await W(900); s = await tag();
    r('D Visited tapped on the tag: exactly one stamp-in', s.stamp && (reduced ? s.ins === d0.ins : s.ins === d0.ins + 1), { d0, s });
    // F (tag of `id` open, visited; another place visited from its row -> no animation on this tag)
    const f0 = await tag(); g = await geo(page, other);
    await L.drag(page, cdp, left(g, 110, 12)); await W(700); s = await tag();
    const ov = await page.evaluate(id => locations.find(x => x.id === id).visited, other);
    r('F another row visited: the open tag does not animate', ov && s.open && s.name === f0.name && s.ins === f0.ins && s.outs === f0.outs, { f0, s, ov });
    // E (a district, through the same state path a row swipe uses)
    await page.evaluate(() => map.closePopup()); await W(300);
    const e0 = await page.evaluate(async () => { const nb = neighborhoodShapes.find(n => n.type === 'district' && !n.visited); map.setView(shapeAnchor(nb), 16, { animate: false }); syncNeighborhoodLayers(); neighborhoodLayersById.get(nb.id).openPopup();
      await new Promise(r => setTimeout(r, 900)); return { key: shapeKey(nb.id), ins: __ins }; });
    await page.evaluate(k => toggleLocationFlag(k, 'visited'), e0.key); await W(150); s = await tag();
    r('E a district visited from the list path: its tag stamps once', s.open && s.stamp && (reduced ? s.ins === e0.ins : s.ins === e0.ins + 1), { e0, s });
    if (errors.length) r('no page errors', false, errors);
    await ctx.close();
  }
  await b.close();
  finish();
})();
