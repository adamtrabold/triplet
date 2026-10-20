// Phase 4 badge-collision CONCEPTS for the owner (prototype switch 'triplet.badgeStyle'), real OSM
// tiles, the 5-city fixture, 390x844. Per concept: z6 (Copenhagen + Malmö close), z7, All places
// (zoom to fit everything), and how a tap resolves to one city.
//   node design/add-tag-jam/stills/p4-fixes/concepts.js [index.html] [outdir] [tilecache] [dsf]
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const P = require('../../p4/lib-p4.js'); const W = P.W;
(async () => {
  const file = path.resolve(process.argv[2] || path.join(__dirname, '../../../../index.html'));
  const OUT = path.resolve(process.argv[3] || path.join(__dirname, 'raw'));
  const TC = path.resolve(process.argv[4] || path.join(OUT, '.tiles'));
  const dsf = +process.argv[5] || 3;
  fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(TC, { recursive: true });
  const b = await P.lib.launch();
  for (const style of ['signpost', 'shingle', 'picker', 'disc']) {
    const o = await P.open(b, { dsf, file, storage: { 'triplet.badgeStyle': style } }); const page = o.page;
    await page.route('**/*tile.openstreetmap.org/**', async r => {
      const u = r.request().url(), f = TC + '/' + u.replace(/[^0-9a-z]/gi, '_');
      if (!fs.existsSync(f)) { try { execFileSync('curl', ['-s', '--max-time', '15', '-A', 'triplet-design-stills', '-o', f, u]); } catch (e) { } }
      if (fs.existsSync(f) && fs.statSync(f).size > 100) return r.fulfill({ contentType: 'image/png', body: fs.readFileSync(f) });
      return r.fulfill({ status: 404, body: '' });
    });
    const shot = async n => { await W(1800); await page.screenshot({ path: `${OUT}/c-${style}-${n}.png` }); console.log(style, n, 'z' + await page.evaluate(() => map.getZoom())); };
    await P.view(page, [57, 14], 6); await shot('1-z6');
    await P.view(page, [55.64, 12.8], 7); await shot('2-z7');
    await page.evaluate(() => goToCity(ALL_CITIES)); await W(2600); await shot('3-all-places');
    // how a tap resolves (from z6)
    await P.view(page, [57, 14], 6); await W(1200);
    if (style === 'picker') { await page.evaluate(() => document.querySelector('[data-city-many]').click()); await W(500); await shot('4-tap'); }
    else if (style === 'disc') { await page.evaluate(() => document.querySelector('[data-city-zoom]').click()); await W(1800); await shot('4-tap'); }
    else { await page.evaluate(() => document.querySelector('[data-city-badge="copenhagen"]').click()); await W(4000); await shot('4-tap'); }
    if (o.errors.length) console.log('errors', o.errors);
    await page.context().close();
  }
  await b.close();
})();
