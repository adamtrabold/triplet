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
  await W(260);
}
const click = (page, id) => page.evaluate(id => document.getElementById(id).click(), id);
(async () => {
  const b = await launch();
  for (const dsf of [1, 3, 4]) {
    const s = `@${dsf}x`;
    const { ctx, page } = await open(b, { dsf });
    const shot = async (name, sel, pad) => page.screenshot({ path: `${OUT}/${name}${s}.png`, clip: await clip(page, sel, pad) });
    const HB = ['#sortBtn', '#toggleFiltersBtn', '#centerMeBtn'];
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
    await shot('header-loading', '#locationsHeader');
    await page.evaluate(() => { document.getElementById('centerMeBtn').classList.remove('loading'); document.getElementById('sortBtn').classList.remove('loading'); });
    await click(page, 'sortBtn'); await W(400);
    await shot('header-open-sort', '#locationsHeader');
    await click(page, 'sortBtn'); await W(300);
    for (const want of [false, true]) {
      await page.evaluate(want => { const l = locations.find(x => !!x.visited === want); if (l) { highlightedId = null; highlightMarker(l.id); } }, want).catch(() => {});
      await W(900);
      if (!(await page.$('.popup-visited'))) { console.log('no popup for', want); continue; }
      const t = want ? 'popup-visited-on' : 'popup-visited-idle';
      await shot(t, '.leaflet-popup-content-wrapper', 6);
      await force(page, ['.popup-visited-tap']); await shot(t + '-pressed', '.leaflet-popup-content-wrapper', 6); await force(page, ['.popup-visited-tap'], false);
    }
    await page.evaluate(() => { map.closePopup(); document.getElementById('floatingAddBtn').click(); }); await W(500);
    await shot('submit-enabled', '#submitBtn', 8);
    await page.evaluate(() => { document.getElementById('submitBtn').disabled = true; }); await shot('submit-disabled', '#submitBtn', 8);
    await page.evaluate(() => { document.getElementById('submitBtn').disabled = false; });
    await force(page, ['#submitBtn']); await shot('submit-pressed', '#submitBtn', 8);
    await ctx.close();
  }
  await b.close();
})();
