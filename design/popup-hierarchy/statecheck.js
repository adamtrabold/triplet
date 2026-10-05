// State audit probes for the popup (UX analysis): selection on map-tap vs list-tap,
// highlight after close, close-button size, logged-out controls.
//   node design/popup-hierarchy/statecheck.js
const { launch, openProto, W } = require('../gesture-harness/lib');
(async () => {
  const b = await launch(); const { ctx, page } = await openProto(b, { reduced: true });
  const st = () => page.evaluate(() => ({ popup: (document.querySelector('.leaflet-popup .popup-title') || {}).textContent || null, highlightedId,
    rowHl: [...document.querySelectorAll('.location-card.highlighted')].map(e => e.dataset.id) }));
  // 1. tap a pin on the map
  await page.evaluate(() => { const l = locations.find(x => x.id === 'rey07'); map.setView([l.lat, l.lng], 16, { animate: false }); }); await W(600);
  const p = await page.evaluate(() => { const r = markersById.get('rey07').marker.getElement().getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  await page.touchscreen.tap(p.x, p.y); await W(800);
  console.log('map-tap pin:', JSON.stringify(await st()));
  // 2. close via map tap, then list tap
  await page.touchscreen.tap(200, 480); await W(500); console.log('after map tap close:', JSON.stringify(await st()));
  const r = await page.evaluate(() => { const e = document.querySelector('.location-card[data-id="rey00"] .row-main').getBoundingClientRect(); return { x: e.x + e.width / 2, y: e.y + e.height / 2 }; });
  await page.touchscreen.tap(r.x, r.y); await W(1800); console.log('list-tap row 0:', JSON.stringify(await st()));
  const close = await page.evaluate(() => { const c = document.querySelector('.leaflet-popup-close-button').getBoundingClientRect(); return { w: c.width, h: c.height }; });
  console.log('close button box:', JSON.stringify(close));
  const cr = await page.evaluate(() => { const c = document.querySelector('.leaflet-popup-close-button').getBoundingClientRect(); return { x: c.x + c.width / 2, y: c.y + c.height / 2 }; });
  await page.touchscreen.tap(cr.x, cr.y); await W(500); console.log('after close x:', JSON.stringify(await st()));
  // 3. logged out
  await page.evaluate(() => { currentUser = null; updateAuthUI(); markersById.get('rey07').marker.openPopup(); }); await W(500);
  console.log('logged-out controls:', JSON.stringify(await page.evaluate(() => [...document.querySelectorAll('.leaflet-popup button, .leaflet-popup a')].map(e => e.className + ':' + e.textContent.trim()))));
  await b.close();
})();
