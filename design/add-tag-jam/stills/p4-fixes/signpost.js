// Phase 4 SIGNPOST stills (design-p4-fixes): real OSM tiles, the 5-city fixture, 390x844.
// For each lone-city style ('box' = today's boxed badge, 'post' = one board on its own post):
// z4 (busiest zoomed out), z7 (Copenhagen + Malmö close), All places (the whole world).
//   node design/add-tag-jam/stills/p4-fixes/signpost.js [index.html] [outdir] [tilecache] [dsf]
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const P = require('../../p4/lib-p4.js'); const W = P.W;
(async () => {
  const file = path.resolve(process.argv[2] || path.join(__dirname, '../../../../index.html'));
  const OUT = path.resolve(process.argv[3] || path.join(__dirname, 'raw'));
  const TC = path.resolve(process.argv[4] || path.join(OUT, '.tiles'));
  const dsf = +process.argv[5] || 3;
  fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(TC, { recursive: true });
  const b = await P.lib.launch();
  for (const lone of (process.env.LONES || 'box,post').split(',')) {
    const o = await P.open(b, { dsf, file, storage: { 'triplet.loneSign': lone } }); const page = o.page;
    await page.route('**/*tile.openstreetmap.org/**', async r => {
      const u = r.request().url(), f = TC + '/' + u.replace(/[^0-9a-z]/gi, '_');
      if (!fs.existsSync(f)) { try { execFileSync('curl', ['-s', '--max-time', '15', '-A', 'triplet-design-stills', '-o', f, u]); } catch (e) { } }
      if (fs.existsSync(f) && fs.statSync(f).size > 100) return r.fulfill({ contentType: 'image/png', body: fs.readFileSync(f) });
      return r.fulfill({ status: 404, body: '' });
    });
    const rects = () => page.evaluate(() => [...document.querySelectorAll('.city-badge, .sp-board')].map(e => { const r = e.getBoundingClientRect(); return [e.dataset.cityBadge, Math.round(r.x), Math.round(r.y), Math.round(r.right), Math.round(r.bottom)]; }));
    const shot = async n => { await W(1800); await page.screenshot({ path: `${OUT}/s-${lone}-${n}.png` }); console.log(lone, n, 'z' + await page.evaluate(() => map.getZoom()), JSON.stringify(await rects())); };
    await P.view(page, [59, 12], 4); await shot('1-z4');
    await P.view(page, [57, 14], 6); await shot('2-z6');
    await P.view(page, [55.64, 12.8], 7); await shot('3-z7');
    await page.evaluate(() => goToCity(ALL_CITIES)); await W(2600); await shot('4-world');
    if (o.errors.length) console.log('errors', o.errors);
    await page.context().close();
  }
  await b.close();
})();
