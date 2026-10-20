// Phase 4 build stills (add-tag-jam, the city signposts) at 390x844, 3x, on the gesture harness's
// stub with every fixture city shown and trimmed to different tallies (../../p4/lib-p4.js) and REAL
// OSM tiles (fetched once into a tile cache; not committed).
//   node design/add-tag-jam/stills/build-p4/stills.js [index.html] [tilecache]
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const P = require('../../p4/lib-p4.js');
const OUT = __dirname;
const W = P.W;
(async () => {
  const file = path.resolve(process.argv[2] || path.join(__dirname, '../../../../index.html'));
  const TC = path.resolve(process.argv[3] || path.join(OUT, '.tiles'));
  fs.mkdirSync(TC, { recursive: true });
  const b = await P.lib.launch();
  const o = await P.open(b, { dsf: 3, file });
  const page = o.page;
  await page.route('**/*tile.openstreetmap.org/**', async r => {
    const u = r.request().url(), f = TC + '/' + u.replace(/[^0-9a-z]/gi, '_');
    if (!fs.existsSync(f)) { try { execFileSync('curl', ['-s', '--max-time', '15', '-A', 'triplet-design-stills', '-o', f, u]); } catch (e) { } }
    if (fs.existsSync(f) && fs.statSync(f).size > 100) return r.fulfill({ contentType: 'image/png', body: fs.readFileSync(f) });
    return r.fulfill({ status: 404, body: '' });
  });
  const shot = async name => { await W(1800); await page.screenshot({ path: path.join(OUT, name + '.png') }); console.log('shot', name, 'z' + await page.evaluate(() => map.getZoom())); };
  const tapSel = async sel => { const r = await page.evaluate(s => { const b = document.querySelector(s).getBoundingClientRect(); return { x: b.x + b.width * 0.4, y: b.y + b.height / 2 }; }, sel); await page.touchscreen.tap(r.x, r.y); };
  const NORDIC = [59, 12], NORDIC_Z = 4;

  // 1. zoomed out (z4): Copenhagen + Malmö + Stockholm share one post
  await P.view(page, NORDIC, NORDIC_Z);
  await shot('01-signposts-z4');
  // 2. Copenhagen + Malmö close (z7): one post standing between them, each board toward its city
  await P.view(page, [55.64, 12.8], 7);
  await shot('02-z7-copenhagen-malmo-one-post');
  // 3. one city hidden (Malmö): no board
  await P.view(page, NORDIC, NORDIC_Z);
  await page.evaluate(() => setCityHidden('malmo', true)); await W(300);
  await shot('03-malmo-hidden-no-board');
  await page.evaluate(() => setCityHidden('malmo', false)); await W(300);
  // 4. a category chip off (restaurant): the tallies follow, as the section headers
  await page.evaluate(() => document.getElementById('filter-restaurant').click()); await W(300);
  await shot('04-restaurant-chip-off-counts-follow');
  await page.evaluate(() => document.getElementById('filter-restaurant').click()); await W(300);
  // 5. just past the threshold (zoom 8, CITY_BADGE_MAX_ZOOM): clusters and pins are back
  await P.view(page, [55.64, 12.8], 8);
  await shot('05-zoom-8-clusters-back');
  // 6. after tapping a board (Stockholm): the map at the city, the list at its header
  await P.view(page, NORDIC, NORDIC_Z);
  await tapSel('[data-city-badge="stockholm"]'); await W(600);
  await shot('06-after-board-tap-stockholm');
  // 7. the title menu's All places: every shown city's sign on screen (LA + the Nordics, z1)
  await page.evaluate(() => goToCity('__all__')); await W(1200);
  await shot('07-after-all-places');
  // 8. Plans view: no signs; the plan's numbered stops at zoom 4
  await page.evaluate(() => choosePlan('gh-p')); await W(900);
  await P.view(page, NORDIC, NORDIC_Z);
  await shot('08-plans-no-signs');
  if (o.errors.length) console.log('page errors', o.errors);
  await b.close();
})();
