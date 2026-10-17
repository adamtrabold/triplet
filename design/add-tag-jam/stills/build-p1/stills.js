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
  // 7c. the plan's foot (Rename / Delete plan…), the Add places break, the add-from city sections (Malmö hidden)
  await page.evaluate(() => { setCityHidden('malmo', true); const l = document.getElementById('locationsList'), f = document.querySelector('.plan-foot'); l.scrollTop += f.getBoundingClientRect().top - l.getBoundingClientRect().top - 120; }); await W(300);
  await shot('07c-plan-foot-add-places');
  await page.evaluate(() => { const l = document.getElementById('locationsList'), h = document.querySelector('.plan-rule ~ .sec-head[data-city="malmo"]'); l.scrollTop += h.getBoundingClientRect().top - l.getBoundingClientRect().top - 120; }); await W(300);
  await shot('07d-add-places-sections');
  // 7e. Rename in place at the foot
  await page.evaluate(() => { const l = document.getElementById('locationsList'), f = document.querySelector('.plan-foot'); l.scrollTop += f.getBoundingClientRect().top - l.getBoundingClientRect().top - 120; }); await W(200);
  await tap('.plan-foot [data-act="foot-rename"]'); await W(500);
  await shot('07e-plan-rename');
  await page.evaluate(() => setPlanPanel({})); await W(200);
  // 8. collapse tab: raised is every shot above; lowered
  await page.evaluate(() => goToCity('copenhagen')); await W(1400);
  await tap('#collapseTab'); await W(700);
  await shot('08-collapse-tab-lowered');
  await tap('#titleBtn'); await W(400);
  await shot('08c-lowered-menu');
  await page.keyboard.press('Escape'); await page.evaluate(() => document.activeElement && document.activeElement.blur()); await W(300);
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
  await page.keyboard.press('Escape'); await page.evaluate(() => document.activeElement && document.activeElement.blur()); await W(300);
  // 11. zero plans: the New plan row alone
  await page.evaluate(() => { plans = []; planStops = []; showAllPlans(); }); await W(800);
  await shot('11-zero-plans');
  // 12. a long title: cut by script, the "…" as close to the tally as an uncut name
  await page.evaluate(() => { plans = [{ id: 'lp', name: 'Last full day before we fly home from Kastrup', created_at: '2026-09-29T10:00:00Z' }]; choosePlan('lp'); }); await W(800);
  await shot('12-long-title');
  console.log('errors', errors);
  await ctx.close(); await b.close();
})();
