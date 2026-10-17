// Phase 2 build stills (add-tag-jam, the add tag): every Phase 2 state at 390x844, 3x, on the
// gesture harness's stub (Reykjavík shown, the other fixture cities hidden; flat tiles, vendored
// Archivo), with live search served from real Nominatim responses (../../p2/fixtures/).
//   node design/add-tag-jam/stills/build-p2/stills.js [index.html]
const path = require('path');
const P = require('../../p2/lib-p2.js');
const OUT = __dirname;
const W = P.W;
(async () => {
  const file = path.resolve(process.argv[2] || path.join(__dirname, '../../../../index.html'));
  const b = await P.lib.launch();
  let o = await P.openP2(b, { dsf: 3, file });
  let page = o.page;
  const shot = async name => { await W(450); await page.evaluate(() => document.activeElement && document.activeElement.blur && document.activeElement.tagName !== 'TEXTAREA' && 0); await page.screenshot({ path: path.join(OUT, name + '.png') }); console.log('shot', name); };
  const reset = async () => { await page.evaluate(() => { if (addFormOpen()) cancelAddForm(); clearAddDraft(); }); await W(500); };
  const blur = () => page.evaluate(() => document.activeElement && document.activeElement.blur());

  // 1. the blank tag, as + opens it (the wash on, the keyboard would be up: NAME focused)
  await P.openAdd(page);
  await shot('01-blank');
  // 2. typing: worldwide results, each row "type · Town, Country"
  await P.typeName(page, 'Tivoli');
  await shot('02-results-worldwide');
  await P.typeName(page, 'Harpa');
  await shot('02b-results-harpa');
  // 3. a pick (Sundhöllin): routing line closed, TYPE detected Attraction (leisure=sports_centre)
  await P.typeName(page, 'Sundhöllin'); await P.pick(page, 0); await blur();
  await shot('03-picked-type-detected');
  // 4. TYPE open
  await P.tap(page, '#addTypeBtn');
  await shot('04-type-open');
  await page.evaluate(() => closeAddMenus(false)); await W(150);
  // 5. Star + Mark visited set
  await page.evaluate(() => document.querySelector('#addStub .popup-star').click()); await W(500);
  await page.evaluate(() => document.querySelector('#addStub .popup-visited').click()); await W(700);
  await shot('05-star-visited');
  // 6. editing NAME after a pick: the pick is void (wash back, no pin, no address), City and TYPE stay
  // (the shot is the moment of the edit, before the next search answers)
  await page.evaluate(() => { const i = document.getElementById('nameInput'); i.value = 'Sundhöll'; voidAddPick(); }); await W(400);
  await shot('06-name-edited-after-pick');
  await reset();
  // 7. a place outside its city's area: the distance note (Blue Lagoon, ≈ 40 km from Reykjavík)
  await P.openAdd(page); await P.typeName(page, 'Blue Lagoon'); await P.pick(page, 0); await blur();
  await shot('07-distance-note');
  // 8. the routing line open: the city menu, "New city · + Grindavík"
  await P.tap(page, '#addCityBtn');
  await shot('08-city-menu-open');
  await page.evaluate(() => closeAddMenus(false)); await reset();
  // 9. a city ADD will make: the NEW stamp (Jönköping, picked from Reykjavík: worldwide search)
  await P.openAdd(page); await P.typeName(page, 'Jönköpings läns museum'); await P.pick(page, 0); await blur();
  await shot('09-new-stamp');
  await reset();
  // 10. a neighbourhood -> District (place=suburb): the shape flow, the address line its hint
  await P.openAdd(page); await P.typeName(page, 'Vesterbro');
  await shot('10a-results-vesterbro');
  await P.pick(page, 0); await blur();
  await shot('10-district-detected');
  await reset();
  // 11. the busiest: a long name, a long address, a note, Star and Mark visited, a NEW city
  await P.openAdd(page); await P.typeName(page, 'Blue Lagoon');
  await page.evaluate(() => { const i = [...document.querySelectorAll('#addResults .add-res')].findIndex(r => /Puncak/.test(r.textContent)); document.querySelectorAll('#addResults .add-res')[i].click(); }); await W(500);
  await page.evaluate(() => { const n = document.getElementById('notesInput'); n.value = 'Go early, before the tour buses. Bring cash for the parking and a towel; the path down is slippery after rain.'; n.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('#addStub .popup-star').click(); }); await W(400);
  await page.evaluate(() => document.querySelector('#addStub .popup-visited').click()); await W(700); await blur();
  await shot('11-busiest');
  await reset();
  // 12. the first place ever (no cities yet): the guess is a new city, NEW-stamped
  await page.evaluate(() => { window.__ROWS.length = 0; window.__SHAPES.length = 0; locations = []; neighborhoodShapes = []; Object.keys(CITIES).forEach(k => delete CITIES[k]); updateUI(); });
  await P.openAdd(page);
  await shot('12a-first-place-blank');
  await P.typeName(page, 'Hallgrímskirkja'); await P.pick(page, 0); await blur();
  await shot('12-first-place-ever');
  if (o.errors.length) console.log('page errors', o.errors);
  await b.close();
})();
