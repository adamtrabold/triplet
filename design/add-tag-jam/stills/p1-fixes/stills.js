// Phase 1 fixes (designer prototype on design-p1-fixes): the open looks after the build check, on the
// gesture harness's stub (5 cities x 21 places + a district and a street each). 390x844 @3x.
//   node design/add-tag-jam/stills/p1-fixes/stills.js [index.html] [outdir]
const path = require('path');
const lib = require('../../../gesture-harness/lib.js');
const W = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const file = path.resolve(process.argv[2] || path.join(__dirname, '../../../../index.html'));
  const OUT = path.resolve(process.argv[3] || path.join(__dirname, 'raw'));
  require('fs').mkdirSync(OUT, { recursive: true });
  const b = await lib.launch();
  const { ctx, page, errors } = await lib.openProto(b, { dsf: 3, file, city: 'copenhagen', storage: { 'triplet.reorderHint': '1' } });
  const shot = async name => { await W(450); await page.screenshot({ path: path.join(OUT, name + '.png') }); console.log('shot', name); };
  const tap = async sel => { const r = await page.evaluate(sel => { const e = document.querySelector(sel); const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }, sel); await page.touchscreen.tap(r.x, r.y); };
  const headTo = (pred, off) => page.evaluate(([pred, off]) => {
    const l = document.getElementById('locationsList'), h = [...document.querySelectorAll('.sec-head')].find(e => e.querySelector(pred));
    l.scrollTop += h.getBoundingClientRect().top - l.getBoundingClientRect().top - off;
  }, [pred, off]);
  await page.evaluate(() => {
    const P = (id, name, i) => ({ id, name, created_at: `2026-09-2${i}T10:00:00Z` });
    plans = [P('gc', 'Golden Circle', 1), P('cw', 'Copenhagen weekend with Erica', 2), P('md', 'Malmö day trip', 3), P('sa', 'Stockholm archipelago', 4)];
    const st = []; let k = 0;
    const add = (plan, ids) => ids.forEach((loc, i) => st.push({ id: 'st' + (k++), plan_id: plan, location_id: loc, shape_id: null, position: i + 1 }));
    add('gc', ['rey09', 'rey15', 'rey11']);
    add('cw', ['cop04', 'cop13', 'mal05', 'mal07', 'cop12', 'cop00']);
    add('md', ['mal00', 'mal04', 'mal12', 'mal18']);
    add('sa', ['sto02', 'sto05']);
    planStops = st; plansAvailable = true; plansOffline = false;
    hiddenCities.clear(); hiddenCities.add('malmo'); persistHiddenCities(); updateUI();
  });
  // 1-2. the title menu, both sides (5 cities, Malmö hidden; 4 plans)
  await page.evaluate(() => goToCity('reykjavik')); await W(1500);
  await tap('#titleBtn'); await W(400);
  await shot('01-menu-places');
  await tap('#titleMenu [data-kind="plans"]'); await W(300);
  await shot('02-menu-plans');
  await page.keyboard.press('Escape'); await page.evaluate(() => document.activeElement && document.activeElement.blur()); await W(200);
  // 3. go-to landing
  await page.evaluate(() => goToCity('copenhagen')); await W(1500);
  await shot('03-goto-landing');
  // 4. a hidden city's header in context
  await headTo('[data-go="malmo"]', 112); await W(300);
  await shot('04-hidden-header');
  // 5. All plans
  await page.evaluate(() => showAllPlans()); await W(1200);
  await shot('05-all-plans');
  // 6. an open plan, top
  await page.evaluate(() => choosePlan('gc')); await W(1300);
  await page.evaluate(() => { const l = document.getElementById('locationsList'), r = l.querySelectorAll('.is-stop'); const last = r[r.length - 1]; l.scrollTop += last.getBoundingClientRect().top - l.getBoundingClientRect().top - 40; }); await W(300);
  await shot('06-plan-foot-addfrom');
  // 7. add-from block around the hidden city
  await headTo('[data-addgo="malmo"]', 120); await W(300);
  await shot('07-plan-addfrom-hidden');
  // 8. go to a city from the add-from block
  await page.evaluate(() => planGoToCity('stockholm')); await W(1600);
  await shot('08-plan-goto-stockholm');
  // 9. Rename open at the plan's foot
  await page.evaluate(() => { setPlanPanel({ mode: 'renaming', draft: 'Golden Circle', target: 'gc' }); const l = document.getElementById('locationsList'), f = l.querySelector('.plan-foot'); l.scrollTop += f.getBoundingClientRect().top - l.getBoundingClientRect().top - 100; document.activeElement && document.activeElement.blur(); }); await W(400);
  await shot('09-plan-rename');
  await page.evaluate(() => setPlanPanel({})); await W(200);
  // 10. long plan name
  await page.evaluate(() => choosePlan('cw')); await W(1200);
  await page.evaluate(() => { document.getElementById('locationsList').scrollTop = 0; });
  await shot('10-long-title');
  // 11-12. lowered sheet and its menu
  await page.evaluate(() => goToCity('reykjavik')); await W(1400);
  await tap('#collapseTab'); await W(700);
  await shot('11-lowered');
  await tap('#titleBtn'); await W(400);
  await shot('12-lowered-menu');
  await page.keyboard.press('Escape'); await page.evaluate(() => document.activeElement && document.activeElement.blur()); await W(200);
  await tap('#collapseTab'); await W(700);
  // 13. zero plans
  await page.evaluate(() => { plans = []; planStops = []; activePlanId = null; updateUI(); showAllPlans(); }); await W(1000);
  await shot('13-zero-plans');
  console.log('errors', errors);
  await ctx.close(); await b.close();
})();
