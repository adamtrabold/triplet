// The + moving beside the account badge when the filters panel is too tall for it to ride (branch
// plus-rides-filters). Both size variants: (a) normal 60px, (b) matched to the account's 50px. 3x.
// "long" = 6 extra test cities added in the page only (never written), so the panel is taller.
//   node design/add-button-placement/build/top-stills.js index.html design/add-button-placement/build/top
const L = require('./lib.js'); const path = require('path'); const fs = require('fs');
const HTML = process.argv[2], OUT = process.argv[3];
fs.mkdirSync(OUT, { recursive: true });
const LONG = () => { const extra = { bergen: 'Bergen', oslo: 'Oslo', gothenburg: 'Gothenburg', aarhus: 'Aarhus', helsinki: 'Helsinki', tromso: 'Tromsø' }; for (const [id, label] of Object.entries(extra)) CITIES[id] = { label, center: [60, 10], zoom: 12 }; createCitySelector(); updateCitySelectorUI(); };
const CASES = [
  ['390x844-home-screen', { vp: [390, 844], inset: true }],
  ['390x664', { vp: [390, 664] }],
  ['320x568', { vp: [320, 568] }],
  ['390x844-safari-long-list', { vp: [390, 844], long: true }],
  ['390x844-safari-todays-list-rides', { vp: [390, 844], one: true }],
  ['390x664-mid-move', { vp: [390, 664], mid: true }],
];
(async () => {
  const b = await L.launch(); const log = {};
  for (const [variant, matched] of [['a-normal', false], ['b-matched', true]]) {
    for (const [n, s] of CASES) {
      if (s.one && matched) continue;   // it rides there: the size dial doesn't apply
      const { ctx, page, errs } = await L.open(b, { html: HTML, vp: s.vp, inset: s.inset, dsf: 3 });
      await page.evaluate(() => setActiveCity('reykjavik')); await page.waitForTimeout(800);
      if (matched) await page.evaluate(() => document.body.classList.add('add-top-matched'));
      if (s.long) await page.evaluate(LONG);
      await page.click('#toggleFiltersBtn');
      if (s.mid) { await page.waitForTimeout(30); await page.evaluate(() => document.getAnimations().forEach(a => { a.pause(); a.currentTime = 150; })); await page.waitForTimeout(100); }   // half-way through the 0.3s move, frozen for the still
      else await page.waitForTimeout(900);
      const f = s.one ? `${n}-3x.png` : `${variant}-${n}-3x.png`;
      await page.screenshot({ path: path.join(OUT, f) });
      log[f] = await page.evaluate(() => { const r = document.getElementById('floatingAddBtn').getBoundingClientRect(), a = document.getElementById('accountBtn').getBoundingClientRect();
        return { mode: document.body.classList.contains('add-to-top') ? 'beside account' : document.body.classList.contains('add-rides-filters') ? 'rides' : 'covered', box: [r.left, r.top, r.right, r.bottom].map(v => +v.toFixed(1)), gapToAccount: +(a.left - r.right).toFixed(2) }; });
      console.log(f, JSON.stringify(log[f]), errs.length ? errs : '');
      await ctx.close();
    }
  }
  fs.writeFileSync(path.join(OUT, 'top-measure.json'), JSON.stringify(log, null, 1));
  await b.close();
})();
