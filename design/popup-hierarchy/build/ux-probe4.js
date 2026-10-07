// UX lane-2 probe, part 4: keyboard focus return and Esc.   node design/popup-hierarchy/build/ux-probe4.js
const { launch, openProto, W } = require('../../gesture-harness/lib');
const F = () => { const a = document.activeElement; return { focus: a ? (a.id || a.className || a.tagName) + '' : null, open: !!document.querySelector('.leaflet-popup.tag-popup') }; };
(async () => {
  const b = await launch(); const { page, errors } = await openProto(b, { touch: false });
  const open = async () => { await page.evaluate(() => { document.getElementById('sortBtn').focus(); const l = locations.find(x => x.id === 'rey07'); map.setView([l.lat, l.lng], 14, { animate: false }); markersById.get('rey07').marker.openPopup(); }); await W(1400); };
  await open(); console.log('opened (focus was #sortBtn)', JSON.stringify(await page.evaluate(F)));
  await page.keyboard.press('Escape'); await W(500); console.log('Esc with focus on tag', JSON.stringify(await page.evaluate(F)));
  await page.evaluate(() => map.closePopup()); await W(400); console.log('after closePopup()', JSON.stringify(await page.evaluate(F)));
  await open(); await page.keyboard.press('Tab'); console.log('Tab ->', JSON.stringify(await page.evaluate(F)));
  await page.keyboard.press('Enter'); await W(500); console.log('Enter on Close', JSON.stringify(await page.evaluate(F)));
  console.log('errors', JSON.stringify(errors)); await b.close();
})();
