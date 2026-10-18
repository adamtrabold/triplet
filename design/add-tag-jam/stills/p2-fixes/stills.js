// Phase 2 fixes (designer prototype on design-p2-fixes): the open looks after the build check.
// 390x844 @3x on the gesture harness's stub with the p2 Nominatim fixtures.
//   node design/add-tag-jam/stills/p2-fixes/stills.js [index.html] [outdir]
const path = require('path');
const P = require('../../p2/lib-p2.js');
const W = P.W;
(async () => {
  const file = path.resolve(process.argv[2] || path.join(__dirname, '../../../../index.html'));
  const OUT = path.resolve(process.argv[3] || path.join(__dirname, 'raw'));
  require('fs').mkdirSync(OUT, { recursive: true });
  const b = await P.lib.launch();
  const o = await P.openP2(b, { dsf: 3, file });
  const page = o.page;
  const shot = async name => { await W(450); await page.screenshot({ path: path.join(OUT, name + '.png') }); console.log('shot', name); };
  const reset = async () => { await page.evaluate(() => { closeAddMenus(false); if (addFormOpen()) cancelAddForm(); clearAddDraft(); }); await W(500); };
  const blur = () => page.evaluate(() => document.activeElement && document.activeElement.blur());

  // 1. ADD's line, empty: "Name it first"
  await P.openAdd(page); await blur();
  await shot('01-add-empty');
  // 2. results: plain kind words
  await P.typeName(page, 'Tivoli');
  await shot('02-results-tivoli');
  await P.typeName(page, 'Harpa');
  await shot('03-results-harpa');
  // 4. a name typed, nothing picked (results put away): "Pick a place"
  await page.evaluate(() => { hideAutocomplete(); renderAddTag(); }); await blur();
  await shot('04-add-typed-not-picked');
  await reset();
  // 5. a pick: the TYPE trigger in the city button's voice
  await P.openAdd(page); await P.typeName(page, 'Sundhöllin'); await P.pick(page, 0); await blur();
  await shot('05-picked-type-closed');
  await P.tap(page, '#addTypeBtn');
  await shot('06-type-open');
  await reset();
  // 7. the busiest tag: TYPE open fits above the list bar
  await P.openAdd(page); await P.typeName(page, 'Blue Lagoon'); await P.pick(page, 0);
  await page.evaluate(() => { const n = document.getElementById('notesInput'); n.value = 'Go early, before the tour buses. Bring cash for the parking and a towel; the path down is slippery after rain.'; n.dispatchEvent(new Event('input', { bubbles: true })); });
  await W(400); await blur();
  await shot('07-busiest-closed');
  await P.tap(page, '#addTypeBtn');
  await shot('08-busiest-type-open');
  await reset();
  // 9. a District: the anchor dot, its where-line, no sentence
  await P.openAdd(page); await P.typeName(page, 'Vesterbro');
  await shot('09-results-vesterbro');
  await P.pick(page, 0); await blur();
  await shot('10-district-picked');
  await reset();
  // 11. a District typed by hand, nothing picked: empty address line, no pin
  await P.openAdd(page);
  await page.evaluate(() => { setAddType('district', true); const i = document.getElementById('nameInput'); i.value = 'Vesturbær'; i.dispatchEvent(new Event('input', { bubbles: true })); });
  await W(300); await page.evaluate(() => { hideAutocomplete(); renderAddTag(); }); await blur();
  await shot('11-district-typed');
  if (o.errors.length) console.log('page errors', o.errors);
  await b.close();
})();
