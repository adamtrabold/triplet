// Stills of every changed state on the real page (stubbed backend), 1x/3x/4x.
// VENDOR=<dir> [REPO=<checkout>] OUT=<dir> node stills.js   (harness from design/list-ordering/build)
const { open, launch } = require('../list-ordering/build/harness');
const fs = require('fs'), path = require('path');
const OUT = process.env.OUT || path.join(__dirname, 'stills');
fs.mkdirSync(OUT, { recursive: true });
const W = ms => new Promise(r => setTimeout(r, ms));
const clip = (page, sel, pad = 0) => page.evaluate(([sel, pad]) => { const b = document.querySelector(sel).getBoundingClientRect();
  return { x: Math.max(0, b.x - pad), y: Math.max(0, b.y - pad), width: b.width + pad * 2, height: b.height + pad * 2 }; }, [sel, pad]);
async function force(page, sels, on = true) {   // CDP :active
  const c = page._c || (page._c = await page.context().newCDPSession(page));
  await c.send('DOM.enable'); await c.send('CSS.enable');
  const { root } = await c.send('DOM.getDocument', { depth: -1 });
  for (const sel of sels) { const { nodeId } = await c.send('DOM.querySelector', { nodeId: root.nodeId, selector: sel });
    if (nodeId) await c.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: on ? ['active'] : [] }); }
  await W(400);
}
const click = (page, id) => page.evaluate(id => document.getElementById(id).click(), id);
(async () => {
  const b = await launch();
  for (const dsf of [1, 3, 4]) {
    const s = `@${dsf}x`;
    const { ctx, page } = await open(b, { dsf });
    const shot = async (name, sel, pad) => page.screenshot({ path: `${OUT}/${name}${s}.png`, clip: await clip(page, sel, pad) });
    await page.evaluate(() => document.getElementById('accountBtn').classList.add('show'));
    const FB = ['#floatingAddBtn', '#accountBtn'];
    const fshot = async (name) => page.screenshot({ path: `${OUT}/${name}${s}.png`, clip: await page.evaluate(() => { const a = document.getElementById('accountBtn').getBoundingClientRect(), b = document.getElementById('floatingAddBtn').getBoundingClientRect(); return { x: a.x - 6, y: a.y - 6, width: b.right - a.x + 12, height: a.height + 12 }; }) });
    await fshot('floating-idle');
    await force(page, FB); await fshot('floating-pressed'); await force(page, FB, false);
        await page.evaluate(() => { document.getElementById('accountBtn').classList.add('active'); document.getElementById('floatingAddBtn').classList.add('active'); });
    await W(300); await fshot('floating-open');
    await force(page, FB); await fshot('floating-open-pressed'); await force(page, FB, false);
    await page.evaluate(() => { document.getElementById('accountBtn').classList.remove('active'); document.getElementById('floatingAddBtn').classList.remove('active'); });
    await W(300);
    const HB = ['#collapseBtn', '#sortBtn', '#toggleFiltersBtn', '#centerMeBtn'];
    await shot('header-idle', '#locationsHeader');
    await force(page, HB); await shot('header-pressed', '#locationsHeader'); await force(page, HB, false);
    await click(page, 'toggleFiltersBtn'); await W(400);
    await shot('header-open-filters', '#locationsHeader');
    await force(page, ['#toggleFiltersBtn']); await shot('header-open-filters-pressed', '#locationsHeader'); await force(page, ['#toggleFiltersBtn'], false);
    await shot('chips-idle', '#filtersPanel');
    await page.evaluate(() => { document.querySelectorAll('#cityFilters .city-btn:not(.active)')[0].id = 'pc'; document.querySelector('#filtersPanel .filter-btn:not(.inactive)').id = 'pf'; });
    await force(page, ['#pc', '#pf']); await shot('chips-pressed', '#filtersPanel'); await force(page, ['#pc', '#pf'], false);
    await click(page, 'toggleFiltersBtn'); await W(400);
    await page.evaluate(() => { document.getElementById('centerMeBtn').classList.add('loading'); document.getElementById('sortBtn').classList.add('loading'); });
    await W(400); await shot('header-loading', '#locationsHeader');
    await page.evaluate(() => { document.getElementById('centerMeBtn').classList.remove('loading'); document.getElementById('sortBtn').classList.remove('loading'); });
    await click(page, 'sortBtn'); await W(400);
    await shot('sortmenu-idle', '#sortMenu', 6);
    await page.evaluate(() => { document.querySelectorAll('.sort-opt')[1].id = 'so1'; }); await force(page, ['#so1']); await shot('sortmenu-pressed', '#sortMenu', 6); await force(page, ['#so1'], false);
    await shot('header-open-sort', '#locationsHeader');
    await force(page, ['#sortBtn']); await shot('header-open-sort-pressed', '#locationsHeader'); await force(page, ['#sortBtn'], false);
    await click(page, 'sortBtn'); await W(300);
    for (const want of [false, true]) {
      await page.evaluate(want => { const l = locations.find(x => !!x.visited === want); if (l) { highlightedId = null; highlightMarker(l.id); } }, want).catch(() => {});
      await W(900);
      if (!(await page.$('.popup-visited'))) { console.log('no popup for', want); continue; }
      const t = want ? 'popup-visited-on' : 'popup-visited-idle';
      await shot(t, '.leaflet-popup-content-wrapper', 6);
      await force(page, ['.popup-visited-tap']); await shot(t + '-pressed', '.leaflet-popup-content-wrapper', 6); await force(page, ['.popup-visited-tap'], false);
      if (!want) { await force(page, ['.popup-star-tap']); await shot('popup-star-pressed', '.leaflet-popup-content-wrapper', 6); await force(page, ['.popup-star-tap'], false); }
    }
    await page.evaluate(() => { map.closePopup(); document.getElementById('floatingAddBtn').click(); }); await W(500);
    await shot('submit-enabled', '#submitBtn', 8);
    await page.evaluate(() => { document.getElementById('submitBtn').disabled = true; }); await shot('submit-disabled', '#submitBtn', 8);
    await page.evaluate(() => { document.getElementById('submitBtn').disabled = false; });
    await force(page, ['#submitBtn']); await shot('submit-pressed', '#submitBtn', 8); await force(page, ['#submitBtn'], false);
    await shot('formstar-idle', '#starInputRow', 6);
    await force(page, ['.form-star-tap']); await shot('formstar-pressed', '#starInputRow', 6); await force(page, ['.form-star-tap'], false);
    await ctx.close();
  }
  await b.close();
})();
