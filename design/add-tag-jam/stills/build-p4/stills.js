// Phase 4 build stills (add-tag-jam, the map's city badge) at 390x844, 3x, on the gesture
// harness's stub (flat tiles, vendored Archivo) with every fixture city shown and trimmed to
// different tallies (../../p4/lib-p4.js).
//   node design/add-tag-jam/stills/build-p4/stills.js [index.html]
const path = require('path');
const P = require('../../p4/lib-p4.js');
const OUT = __dirname;
const W = P.W;
(async () => {
  const file = path.resolve(process.argv[2] || path.join(__dirname, '../../../../index.html'));
  const b = await P.lib.launch();
  const o = await P.open(b, { dsf: 3, file });
  const page = o.page;
  const shot = async name => { await W(450); await page.screenshot({ path: path.join(OUT, name + '.png') }); console.log('shot', name); };
  const tapSel = async sel => { const r = await page.evaluate(s => { const b = document.querySelector(s).getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }, sel); await page.touchscreen.tap(r.x, r.y); };
  const NORDIC = [60, -2], NORDIC_Z = 3;

  // 1. zoomed out: a badge per shown city (Reykjavík, Copenhagen, Malmö, Stockholm in view)
  await page.evaluate(() => goToCity('__all__')); await W(1800);
  await P.view(page, NORDIC, NORDIC_Z);
  await shot('01-badges-all-shown');
  // 1b. the same zoom, panned west: LA's badge, far from the rest
  await P.view(page, [48, -75], 3);
  await shot('01b-badges-la-far-away');
  // 2. one city hidden (Malmö): no badge
  await P.view(page, NORDIC, NORDIC_Z);
  await page.evaluate(() => setCityHidden('malmo', true)); await W(300);
  await shot('02-malmo-hidden-no-badge');
  await page.evaluate(() => setCityHidden('malmo', false)); await W(300);
  // 3. a category chip off (restaurant): the tallies follow, as the section headers
  await page.evaluate(() => document.getElementById('filter-restaurant').click()); await W(300);
  await shot('03-restaurant-chip-off-counts-follow');
  await page.evaluate(() => document.getElementById('filter-restaurant').click()); await W(300);
  // 4. just past the threshold (zoom 8, CITY_BADGE_MAX_ZOOM): clusters and pins are back
  await P.view(page, [55.64, 12.8], 8);
  await shot('04-zoom-8-clusters-back');
  // 4b. one step out (zoom 7): the badges (Copenhagen and Malmö, 30 km apart, overlap)
  await P.view(page, [55.64, 12.8], 7);
  await shot('04b-zoom-7-badges');
  // 5. after tapping a badge (Stockholm): the map at the city, the list at its header
  await P.view(page, NORDIC, NORDIC_Z);
  await tapSel('[data-city-badge="stockholm"]'); await W(2200);
  await shot('05-after-badge-tap-stockholm');
  // 6. the All cities control (at a city), and 7. after tapping it
  await shot('06-all-cities-control');
  await tapSel('#allCitiesBtn'); await W(2200);
  await shot('07-after-all-cities');
  // 8. Plans view: no badges, no All cities; the plan's numbered stops at zoom 3
  await page.evaluate(() => choosePlan('gh-p')); await W(900);
  await P.view(page, NORDIC, NORDIC_Z);
  await shot('08-plans-no-badges');
  // 9. a Hanging Tag opened from the list (Places): the tag against the control stack
  await page.evaluate(() => goToCity('reykjavik')); await W(1800);
  await page.evaluate(() => { const en = rowEntry('rey05'); en.el.scrollIntoView({ block: 'center' }); en.el.click(); }); await W(2500);
  await shot('09-tag-open-control-stack');
  if (o.errors.length) console.log('page errors', o.errors);
  await b.close();
})();
