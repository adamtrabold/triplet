// The signpost board next to its family (the approved boxed city badge, the title menu, the place
// tag), at 1x and 3x, on the 5-city fixture with real tiles.
//   node design/add-tag-jam/stills/p4-fixes/family.js [index.html] [outdir] [tilecache]
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const P = require('../../p4/lib-p4.js'); const W = P.W;
(async () => {
  const file = path.resolve(process.argv[2] || path.join(__dirname, '../../../../index.html'));
  const OUT = path.resolve(process.argv[3] || path.join(__dirname, 'raw'));
  const TC = path.resolve(process.argv[4] || path.join(OUT, '.tiles'));
  fs.mkdirSync(OUT, { recursive: true });
  const b = await P.lib.launch();
  for (const dsf of [1, 3]) {
    for (const lone of ['box', 'post']) {
      const o = await P.open(b, { dsf, file, storage: { 'triplet.loneSign': lone } }); const page = o.page;
      await page.route('**/*tile.openstreetmap.org/**', async r => {
        const u = r.request().url(), f = TC + '/' + u.replace(/[^0-9a-z]/gi, '_');
        if (!fs.existsSync(f)) { try { execFileSync('curl', ['-s', '--max-time', '15', '-A', 'triplet-design-stills', '-o', f, u]); } catch (e) { } }
        if (fs.existsSync(f) && fs.statSync(f).size > 100) return r.fulfill({ contentType: 'image/png', body: fs.readFileSync(f) });
        return r.fulfill({ status: 404, body: '' });
      });
      const clip = async (sel, n, pad = 10) => {
        const r = await page.evaluate(sel => { const e = document.querySelector(sel); if (!e) return null; const q = e.getBoundingClientRect(); return [q.x, q.y, q.width, q.height]; }, sel);
        if (!r) { console.log('missing', sel); return; }
        await page.screenshot({ path: `${OUT}/f-${n}@${dsf}x.png`, clip: { x: Math.max(0, r[0] - pad), y: Math.max(0, r[1] - pad), width: r[2] + 2 * pad, height: r[3] + 2 * pad } });
        console.log(n, dsf);
      };
      await page.evaluate(() => goToCity(ALL_CITIES)); await W(2600);
      if (lone === 'box') { await clip('.city-badge[data-city-badge="la"]', 'badge'); }
      else {
        await clip('.sp-post', 'post-la');
        await P.view(page, [55.64, 12.8], 7); await W(1500);
        await clip('.sp-post', 'post-cph');
        await page.evaluate(() => goToCity('reykjavik')); await W(1800);
        await page.tap('#titleBtn'); await W(500);
        await clip('#titleMenu', 'menu', 6);
      }
      await page.context().close();
    }
  }
  await b.close();
})();
