// Phase 1 build stills (add-tag-jam): every Phase 1 state at 390x844, 3x, on the gesture
// harness's stub (5 cities x 21 places + a district and a street each; flat tiles, vendored
// Archivo). Plans are set in the page (the harness's playground has none).
//   node design/add-tag-jam/stills/build-p1/stills.js [index.html]
const path = require('path');
const lib = require('../../../gesture-harness/lib.js');
const OUT = __dirname;
const W = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const file = path.resolve(process.argv[2] || path.join(__dirname, '../../../../index.html'));
  const b = await lib.launch();
  const { ctx, page, errors } = await lib.openProto(b, { dsf: 3, file, city: 'copenhagen', storage: { 'triplet.reorderHint': '1' } });
  await page.evaluate(() => { hiddenCities.clear(); persistHiddenCities(); updateUI(); });   // the harness hides the other cities; the stills show them all
  const shot = async name => { await W(450); await page.screenshot({ path: path.join(OUT, name + '.png') }); console.log('shot', name); };
  const tap = async sel => { const r = await page.evaluate(sel => { const e = document.querySelector(sel); const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }, sel); await page.touchscreen.tap(r.x, r.y); };
  // plans: Golden Circle (3, Reykjavík), Copenhagen weekend (Copenhagen -> Malmö -> Copenhagen: a recurring city), Malmö day trip (4)
  await page.evaluate(() => {
    const P = (id, name, i) => ({ id, name, created_at: `2026-09-2${i}T10:00:00Z` });
    plans = [P('gc', 'Golden Circle', 1), P('cw', 'Copenhagen weekend', 2), P('md', 'Malmö day trip', 3)];
    const st = []; let k = 0;
    const add = (plan, ids) => ids.forEach((loc, i) => st.push({ id: 'st' + (k++), plan_id: plan, location_id: loc, shape_id: null, position: i + 1 }));
    add('gc', ['rey09', 'rey15', 'rey11']);
    add('cw', ['cop04', 'cop13', 'mal05', 'mal07', 'cop12', 'cop00']);
    add('md', ['mal00', 'mal04', 'mal12', 'mal18']);
    planStops = st; plansAvailable = true; plansOffline = false; updateUI();
  });
  // 1. All places, top of the list (the first section header compact)
  await page.evaluate(() => goToCity(ALL_CITIES)); await W(1500);
  await shot('01-all-places');
  // 2. went to a city: the whole list scrolled to its header
  await page.evaluate(() => goToCity('copenhagen')); await W(1500);
  await shot('02-went-to-copenhagen');
  // 3. a hidden city's greyed header (Malmö), scrolled into view
  await page.evaluate(() => { setCityHidden('malmo', true); const l = document.getElementById('locationsList'), h = document.querySelector('.sec-head[data-city="malmo"]');
    l.scrollTop += h.getBoundingClientRect().top - l.getBoundingClientRect().top - 112; }); await W(300);
  await shot('03-hidden-city-header');
  // 4. title menu, Places side (Malmö hidden: dimmed, closed eye)
  await tap('#titleBtn'); await W(400);
  await shot('04-title-menu-places');
  // 5. title menu, Plans side (the quiet row)
  await tap('#titleMenu [data-kind="plans"]'); await W(300);
  await shot('05-title-menu-plans');
  // 6. All plans
  await tap('#titleMenu [data-plans="all"]'); await W(1200);
  await shot('06-all-plans');
  // 7. a plan open: leg sections, Copenhagen recurring
  await page.evaluate(() => choosePlan('cw')); await W(1200);
  await shot('07-plan-legs-recurring');
  await page.evaluate(() => { const l = document.getElementById('locationsList'); l.scrollTop = 170; }); await W(200);
  await shot('07b-plan-legs-scrolled');
  // 8. collapse tab: raised is every shot above; lowered
  await page.evaluate(() => goToCity('copenhagen')); await W(1400);
  await tap('#collapseTab'); await W(700);
  await shot('08-collapse-tab-lowered');
  await tap('#collapseTab'); await W(700);
  await shot('08b-collapse-tab-raised');
  // 9. every city hidden: only greyed headers
  await page.evaluate(() => { ['la', 'reykjavik', 'copenhagen', 'malmo', 'stockholm'].forEach(c => { hiddenCities.add(c); }); persistHiddenCities(); updateUI(); document.getElementById('locationsList').scrollTop = 0; }); await W(300);
  await shot('09-every-city-hidden');
  // 10. zero places
  await page.evaluate(() => { hiddenCities.clear(); persistHiddenCities(); locations = []; neighborhoodShapes = []; planStops = []; citySelection = ALL_CITIES; updateUI(); }); await W(300);
  await shot('10-zero-places');
  await tap('#titleBtn'); await W(400);
  await shot('10b-zero-places-menu');
  console.log('errors', errors);
  await ctx.close(); await b.close();
})();
