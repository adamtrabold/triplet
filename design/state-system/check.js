// State-system checks: computed styles per state + popup Mark Visited toggle still works.
// VENDOR=<dir> node check.js
const { open, launch } = require('../list-ordering/build/harness');
const W = ms => new Promise(r => setTimeout(r, ms));
let pass = 0, total = 0;
const ok = (n, c, i) => { total++; if (c) pass++; console.log(`${c ? 'PASS' : 'FAIL'} ${n}${i !== undefined ? ' ' + JSON.stringify(i) : ''}`); };
const cs = (page, sel, p) => page.evaluate(([s, p]) => getComputedStyle(document.querySelector(s))[p], [sel, p]);
(async () => {
  const b = await launch();
  const { ctx, page, errors } = await open(b, {});
  const NAVY = 'rgb(18, 41, 63)', PAPER = 'rgb(242, 235, 221)';
  ok('idle header buttons transparent', (await cs(page, '#toggleFiltersBtn', 'backgroundColor')) === 'rgba(0, 0, 0, 0)');
  await page.evaluate(() => document.getElementById('toggleFiltersBtn').click()); await W(300);
  ok('filters open = navy tile', (await cs(page, '#toggleFiltersBtn', 'backgroundColor')) === NAVY && (await cs(page, '#toggleFiltersBtn', 'color')) === PAPER && (await cs(page, '#toggleFiltersBtn', 'opacity')) === '1');
  await page.evaluate(() => document.getElementById('sortBtn').click()); await W(300);
  ok('sort open = navy tile (unchanged)', (await cs(page, '#sortBtn', 'backgroundColor')) === NAVY && (await cs(page, '#sortBtn', 'color')) === PAPER);
  await page.evaluate(() => document.getElementById('sortBtn').click()); await W(200);
  ok('selected city chip navy', (await cs(page, '.city-btn.active', 'backgroundColor')) === NAVY);
  ok('submit disabled opacity .4', await page.evaluate(() => { const b = document.getElementById('submitBtn'); b.disabled = true; return getComputedStyle(b).opacity === '0.4'; }));
  await page.evaluate(() => document.getElementById('centerMeBtn').classList.add('loading')); await W(300);
  ok('loading opacity .4', (await cs(page, '#centerMeBtn', 'opacity')) === '0.4');
  // Mark Visited toggles through a real tap on the popup's tap label
  for (const want of [false, true]) {
    const id = await page.evaluate(want => { const l = locations.find(x => !!x.visited === want); highlightedId = null; highlightMarker(l.id); return l.id; }, want); await W(900);
    const before = await page.evaluate(() => document.querySelector('.popup-visited').getAttribute('aria-pressed'));
    const r = await page.evaluate(() => { const b = document.querySelector('.popup-visited-tap').getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
    await page.touchscreen.tap(r.x, r.y); await W(700);
    const after = await page.evaluate(id => locations.find(x => x.id === id).visited, id);
    ok(`popup visited tap toggles (was ${want})`, !!after === !want, { before });
  }
  for (const want of [false, true]) {
    const id = await page.evaluate(want => { const l = locations.find(x => !!x.starred === want); highlightedId = null; highlightMarker(l.id); return l.id; }, want); await W(900);
    const r = await page.evaluate(() => { const b = document.querySelector('.popup-star-tap').getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
    await page.touchscreen.tap(r.x, r.y); await W(900);
    ok(`popup star tap toggles (was ${want})`, !!(await page.evaluate(id => locations.find(x => x.id === id).starred, id)) === !want);
  }
  ok('no page errors', errors.length === 0, errors);
  console.log(`${pass}/${total} passed`);
  await ctx.close(); await b.close();
})();
