// Phase 3 build stills (add-tag-jam, the city-bucket model) at 390x844, 3x, on the gesture
// harness's stub (Reykjavík shown, the other fixture cities hidden; flat tiles, vendored Archivo)
// with real places from the live DB set on fixture rows (../../p3/lib-p3.js) and the phase 2
// search fixtures.
//   node design/add-tag-jam/stills/build-p3/stills.js [index.html]
const path = require('path');
const P = require('../../p2/lib-p2.js');
const S = require('../../p3/lib-p3.js');
const OUT = __dirname;
const W = P.W;
(async () => {
  const file = path.resolve(process.argv[2] || path.join(__dirname, '../../../../index.html'));
  const b = await P.lib.launch();
  const o = await P.openP2(b, { dsf: 3, file });
  let page = o.page;
  const shot = async name => { await W(450); await page.screenshot({ path: path.join(OUT, name + '.png') }); console.log('shot', name); };
  const blur = () => page.evaluate(() => document.activeElement && document.activeElement.blur());
  await S.install(page);
  await S.realRows(page);

  // 1. a place inside its city: the routing line, no note
  await S.openTag(page, 'rey16');
  await shot('01-tag-inside-city');
  // 2. a place outside its city's area: the distance note under the address
  await S.openTag(page, 'rey15');
  await shot('02-tag-outside-distance-note');
  // 3. the city menu open: your cities, then "New city · + Reykjanesbær"
  await P.tap(page, '.leaflet-popup .tag-city');
  await shot('03-tag-city-menu');
  // 4. after the move ("+ Reykjanesbær"): the row in its new section, the pin where it was
  await page.evaluate(() => document.querySelector('#tagCityMenu [data-newcity]').click()); await W(1500);
  await blur();
  await shot('04-after-move-new-section');
  // 4b. moved back to Reykjavík (the auto-added Reykjanesbær, left empty, is removed)
  await P.tap(page, '.leaflet-popup .tag-city');
  await page.evaluate(() => document.querySelector('#tagCityMenu [data-city="reykjavik"]').click()); await W(900);
  await page.evaluate(() => { map.closePopup(); document.getElementById('error').classList.remove('show'); }); await W(400);   // (the cleanup's "Removed unused city" band, shown by 4b's move)
  // 5. a place with no address details (Reykjanesviti): no address line, the note still shows
  await S.openTag(page, 'rey17');
  await shot('05-no-address-details');
  // 6. signed out: the city is greyed and offers the sign-in slip
  await page.evaluate(() => { window.__u = currentUser; currentUser = null; refreshTags(); });
  await S.openTag(page, 'rey16');
  await P.tap(page, '.leaflet-popup .tag-city');
  await shot('06-signed-out-slip');
  await page.evaluate(() => { hideTagSlip(); map.closePopup(); currentUser = window.__u; refreshTags(); }); await W(400);
  // 7. the add tag: a pick within reach of a city (Blue Lagoon -> Reykjavík, ≈ 40 km)
  await P.openAdd(page); await P.typeName(page, 'Blue Lagoon'); await P.pick(page, 0); await blur();
  await shot('07-add-guess-within-reach');
  await page.evaluate(() => { cancelAddForm(); clearAddDraft(); }); await W(500);
  // 8. the add tag: beyond reach of every city -> the real town, NEW
  await P.openAdd(page); await P.typeName(page, 'Jönköpings läns museum'); await P.pick(page, 0); await blur();
  await shot('08-add-new-city-beyond-reach');
  await page.evaluate(() => { cancelAddForm(); clearAddDraft(); }); await W(500);
  await page.context().close();

  // 9. the busiest real tag: Aurora Reykjavík (real name, address and note) starred, visited and a
  // plan stop (the fixture plan's third stop)
  const o2 = await P.openP2(b, { dsf: 3, file, storage: { 'gh.plans': '1', 'triplet.reorderHint': '1', 'triplet.hiddenCities': JSON.stringify(['la', 'copenhagen', 'malmo', 'stockholm']) } });
  page = o2.page;
  await S.install(page);
  await S.realRows(page, { rey01: { name: 'Aurora Reykjavík', category: 'attraction', lat: 64.1563842, lng: -21.9446856, address: 'Aurora Reykjavík, Fiskislóð 53, Reykjavík, Iceland',
    short_address: 'Fiskislóð 53 · Vesturbær', address_details: { road: 'Fiskislóð', house_number: '53', suburb: 'Vesturbær', city: 'Reykjavík', country: 'Iceland', country_code: 'is' },
    notes: 'Indoor Northern Lights exhibit, rainy-day/kid option. Grandi harbor — not to be confused with unrelated businesses that also use "Aurora" in their name.', starred: true, visited: true } });
  await page.evaluate(() => choosePlan('gh-p')); await W(900);
  await S.openTag(page, 'rey01');
  await shot('09-busiest-real-tag');
  if (o.errors.length || o2.errors.length) console.log('page errors', o.errors, o2.errors);
  await b.close();
})();
