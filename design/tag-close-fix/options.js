// Corner x: candidate top offsets (glyph centre, px from the tag's top; right fixed at 32), plain + starred.
//   node design/tag-close-fix/options.js [index.html] [outdir]
const path = require('path');
const P = require('../add-tag-jam/p2/lib-p2.js');
const S = require('../add-tag-jam/p3/lib-p3.js');
const W = P.W;
const TOPS = [24, 28, 32, 48];
(async () => {
  const file = path.resolve(process.argv[2] || path.join(__dirname, '../../index.html'));
  const OUT = path.resolve(process.argv[3] || path.join(__dirname, 'raw/options'));
  require('fs').mkdirSync(OUT, { recursive: true });
  const b = await P.lib.launch();
  const storage = { 'gh.plans': '1', 'triplet.reorderHint': '1', 'triplet.hiddenCities': JSON.stringify(['la', 'copenhagen', 'malmo', 'stockholm']) };
  const o = await P.openP2(b, { dsf: 3, file, w: 390, h: 844, storage });
  const page = o.page;
  await S.install(page);
  for (const [k, star] of [['plain', false], ['starred', true]]) {
    await S.realRows(page, { rey16: { ...S.REAL.rey16, name: 'Sundhöllin public baths and hot tubs', starred: star } });
    await S.openTag(page, 'rey16');
    for (const t of TOPS) {
      await page.evaluate(t => { document.querySelector('.leaflet-popup .tag-x').style.top = (t - 22) + 'px'; }, t);
      await W(200);
      const r = await page.evaluate(() => { const s = document.querySelector('.leaflet-popup .tag-body').getBoundingClientRect(); return { x: s.left, y: s.top, width: s.width, height: 150 }; });
      await page.screenshot({ path: path.join(OUT, `${k}-${t}.png`), clip: { x: r.x - 8, y: r.y - 8, width: r.width + 16, height: r.height } });
    }
  }
  await o.page.context().close();
  await b.close();
})();
