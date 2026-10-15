// The + riding the filters panel (branch plus-rides-filters): panel closed / open at each size, 1x and 3x.
// "open-todays-list" is the stub's 5 cities; "open" carries a LONG city list (6 extra test cities added in the page only, never written) so the panel
// is taller than its room and scrolls inside. Re-shoot:
//   node design/add-button-placement/build/filters-stills.js index.html design/add-button-placement/build/filters
const L = require('./lib.js'); const path = require('path'); const fs = require('fs');
const HTML = process.argv[2], OUT = process.argv[3];
fs.mkdirSync(OUT, { recursive: true });
const SIZES = [
  ['390x844-safari', { vp: [390, 844] }],
  ['390x844-home-screen', { vp: [390, 844], inset: true }],
  ['390x664', { vp: [390, 664] }],
  ['320x568', { vp: [320, 568] }],
  ['390x844-list-collapsed', { vp: [390, 844], col: true }],
  ['desktop-1280x800', { vp: [1280, 800], desk: true }],
];
const LONG = () => {
  const extra = { bergen: 'Bergen', oslo: 'Oslo', gothenburg: 'Gothenburg', aarhus: 'Aarhus', helsinki: 'Helsinki', tromso: 'Tromsø' };
  for (const [id, label] of Object.entries(extra)) CITIES[id] = { label, center: [60, 10], zoom: 12 };
  createCitySelector(); updateCitySelectorUI();
};
(async () => {
  const b = await L.launch(); const log = {};
  for (const [n, s] of SIZES) {
    for (const dsf of s.desk ? [1] : [1, 3]) {
      for (const state of ['closed', 'open-todays-list', 'open', 'open-scrolled']) {
        if (state === 'open-scrolled' && dsf === 1) continue;
        const { ctx, page, errs } = await L.open(b, { html: HTML, vp: s.vp, inset: s.inset, desk: s.desk, dsf });
        await page.evaluate(() => setActiveCity('reykjavik')); await page.waitForTimeout(800);
        if (state !== 'open-todays-list') { await page.evaluate(LONG); await page.waitForTimeout(200); }
        if (s.col) { await page.click('#collapseBtn'); await page.waitForTimeout(600); }
        if (state !== 'closed') { await page.click('#toggleFiltersBtn'); await page.waitForTimeout(800); }
        if (state === 'open-scrolled') { await page.evaluate(() => { const p = document.getElementById('filtersPanel'); p.scrollTop = p.scrollHeight; }); await page.waitForTimeout(300); }
        const m = await page.evaluate(() => { const p = document.getElementById('filtersPanel'), q = document.getElementById('floatingAddBtn').getBoundingClientRect();
          return { rides: document.body.classList.contains('add-rides-filters'), panelTop: Math.round(p.getBoundingClientRect().top), panelH: Math.round(p.clientHeight), content: p.scrollHeight, scrolls: p.scrollHeight > p.clientHeight + 1, plusTop: +q.top.toFixed(1) }; });
        const f = `${n}-${state}-${s.desk ? 1 : dsf}x.png`;
        await page.screenshot({ path: path.join(OUT, f) });
        log[f] = { ...m, errs: errs.length };
        console.log(f, JSON.stringify(m), errs.length ? errs : '');
        await ctx.close();
      }
    }
  }
  fs.writeFileSync(path.join(OUT, 'filters-measure.json'), JSON.stringify(log, null, 1));
  await b.close();
})();
