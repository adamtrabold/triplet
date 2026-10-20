// Phase 4 fixes (designer prototype on design-p4-fixes): the zoomed-out map with REAL OSM tiles
// (fetched once into a tile cache), the busiest real state (5 cities), 390x844.
//   node design/add-tag-jam/stills/p4-fixes/stills.js [index.html] [outdir] [tilecache] [dsf]
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const P = require('../../p4/lib-p4.js'); const W = P.W;
(async () => {
  const file = path.resolve(process.argv[2] || path.join(__dirname, '../../../../index.html'));
  const OUT = path.resolve(process.argv[3] || path.join(__dirname, 'raw'));
  const TC = path.resolve(process.argv[4] || path.join(OUT, '.tiles'));
  const dsf = +process.argv[5] || 3;
  fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(TC, { recursive: true });
  const b = await P.lib.launch(); const o = await P.open(b, { dsf, file }); const page = o.page;
  await page.route('**/*tile.openstreetmap.org/**', async r => {
    const u = r.request().url(), f = TC + '/' + u.replace(/[^0-9a-z]/gi, '_');
    if (!fs.existsSync(f)) { try { execFileSync('curl', ['-s', '--max-time', '15', '-A', 'triplet-design-stills', '-o', f, u]); } catch (e) { } }
    if (fs.existsSync(f) && fs.statSync(f).size > 100) return r.fulfill({ contentType: 'image/png', body: fs.readFileSync(f) });
    return r.fulfill({ status: 404, body: '' });
  });
  const boxes = () => page.evaluate(() => [...document.querySelectorAll('.city-badge, .city-badge-group')].map(e => { const r = e.getBoundingClientRect(); return [e.textContent.replace(/\s+/g, ' ').trim(), Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; }));
  const shot = async n => { await W(1800); await page.screenshot({ path: `${OUT}/${n}.png` }); console.log(n, 'z' + await page.evaluate(() => map.getZoom()), JSON.stringify(await boxes())); };
  for (const [c, z, n] of [[[59, 12], 4, '01-z4'], [[57, 14], 6, '02-z6'], [[55.64, 12.8], 7, '03-z7-cph-malmo']]) { await P.view(page, c, z); await shot(n); }
  await page.tap('#allCitiesBtn'); await W(2600); await shot('04-after-all-places');
  // the control, close
  await P.view(page, [64.1, -21.9], 11); await W(800);
  await page.screenshot({ path: `${OUT}/05-control.png`, clip: { x: 0, y: 0, width: 220, height: 140 } }); console.log('05-control');
  if (o.errors.length) console.log('errors', o.errors);
  await b.close();
})();
