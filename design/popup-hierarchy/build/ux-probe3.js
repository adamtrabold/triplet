// UX lane-2 probe, part 3: one-tap swap to a neighbouring pin while a tag is open
// (signed in and signed out), and selection state after a map-pin open.
//   node design/popup-hierarchy/build/ux-probe3.js
const path = require('path');
const { launch, openProto, T, W } = require('../../gesture-harness/lib');
const tapAt = async (cdp, x, y) => { await T(cdp, 'touchStart', x, y); await W(60); await T(cdp, 'touchEnd'); };
const S = () => ({ open: !!document.querySelector('.leaflet-popup.tag-popup'), title: (document.querySelector('.tag-popup .tag-name') || {}).textContent || null, hl: highlightedId,
  rowHl: [...document.querySelectorAll('.location-card.highlighted')].map(e => e.dataset.id), lower: document.documentElement.style.getPropertyValue('--sheet-lower') || '0', slip: (document.querySelector('.tag-slip') || {}).textContent || '' });
const scan = () => { const t = document.querySelector('.tag-popup .tag-body'); const tr = t ? t.getBoundingClientRect() : null; const listTop = document.getElementById('locations').getBoundingClientRect().top;
  const pins = [...markersById].filter(([id, en]) => map.hasLayer(en.marker) && en.marker.getElement()).map(([id, en]) => { const r = en.marker.getElement().getBoundingClientRect(); return { id, name: en.loc.name, x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) }; });
  return { tag: tr && [Math.round(tr.left), Math.round(tr.top), Math.round(tr.right), Math.round(tr.bottom)], listTop, pins }; };
(async () => {
  const b = await launch();
  for (const signedIn of [true, false]) {
    const { page, cdp, ctx, errors } = await openProto(b, {});
    if (!signedIn) { await page.evaluate(() => { currentUser = null; updateAuthUI(); }); await W(300); }
    await page.evaluate(() => { const l = locations.find(x => x.id === 'rey07'); map.setView([l.lat, l.lng], 14, { animate: false }); }); await W(500);
    const p0 = await page.evaluate(() => { const r = markersById.get('rey07').marker.getElement().getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    await tapAt(cdp, p0.x, p0.y); await W(1400);
    // the fixture has no pin in the open map below the tag: move rey20 there (and rey19 beside the pin's top strip)
    await page.evaluate(async () => { const a = map.containerPointToLatLng([200, 430]); const r = window.__ROWS.find(x => x.id === 'rey20'); r.lat = +a.lat.toFixed(6); r.lng = +a.lng.toFixed(6); await refetchLocations(); });
    await W(800);
    const sc = await page.evaluate(scan);
    const tag = signedIn ? 'in' : 'out';
    console.log(tag, 'scene', JSON.stringify(sc));
    const cand = sc.pins.filter(p => p.id !== 'rey07' && p.y < sc.listTop - 16 && p.y > 70 && p.x > 24 && p.x < 366 && !(sc.tag && p.x > sc.tag[0] - 14 && p.x < sc.tag[2] + 14 && p.y > sc.tag[1] - 50 && p.y < sc.tag[3] + 14));
    console.log(tag, 'candidates', JSON.stringify(cand));
    if (signedIn) { await page.evaluate(() => { currentUser && 0; }); }
    if (!signedIn) { // show the slip first
      const st = await page.evaluate(() => { const b = document.querySelectorAll('.tag-popup .tag-seg')[1].getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
      await tapAt(cdp, st.x, st.y); await W(400); console.log(tag, 'slip shown', JSON.stringify(await page.evaluate(S)));
    }
    if (cand.length) {
      const o = cand[0];
      await tapAt(cdp, o.x, o.y); await W(1400);
      console.log(tag, 'ONE tap on', o.name, JSON.stringify(await page.evaluate(S)));
      if (!signedIn) { await tapAt(cdp, o.x, o.y); await W(1400); console.log(tag, 'SECOND tap on', o.name, JSON.stringify(await page.evaluate(S))); }
      await page.screenshot({ path: path.join(__dirname, `ux-probe3-swap-${tag}.png`) });
    }
    console.log(tag, 'errors', JSON.stringify(errors));
    await ctx.close();
  }
  await b.close();
})();
