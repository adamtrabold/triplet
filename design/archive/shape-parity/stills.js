// Shape parity stills (2026-10-02): the real index.html on the gesture harness's stub
// (stub.js: Reykjavik "Fixture District" plain, "Fixture Street" starred + visited), at
// 1x and 3x: shape rows plain / starred / visited / both, the street popup before and
// after (pin layout), the district popup, a starred shape's map star, and a visited
// street as a Plans stop. FILE=<index.html> OUT=<dir> node stills.js
const H = require('path').join(__dirname, '../gesture-harness/lib');
const { launch, openProto, W } = require(H);
const fs = require('fs'), path = require('path');
const OUT = process.env.OUT || path.join(__dirname, 'stills'); fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await launch();
  for (const dsf of [1, 3]) {
    const { ctx, page } = await openProto(b, { dsf });
    const D = await page.evaluate(() => neighborhoodShapes.find(n => n.city === activeCity && n.type === 'district').id);
    const S = await page.evaluate(() => neighborhoodShapes.find(n => n.city === activeCity && n.type === 'street').id);
    // rows: the district plain, starred, visited, starred + visited, next to the (starred + visited) street and the last pins
    const rows = async (name) => { await page.evaluate(() => { const l = document.getElementById('locationsList'); l.scrollTop = l.scrollHeight; }); await W(300);
      const r = await page.evaluate(() => { const c = [...document.querySelectorAll('#locationsList .location-card')]; const a = c[c.length - 4].getBoundingClientRect(), z = c[c.length - 1].getBoundingClientRect(); return { x: 0, y: a.y, width: a.width, height: z.bottom - a.y }; });
      await page.screenshot({ path: path.join(OUT, `${name}@${dsf}x.png`), clip: r }); };
    await rows('rows-district-plain');
    await page.evaluate(sid => setLocationFlag(shapeKey(sid), 'starred', true), D); await W(200); await rows('rows-district-starred');
    await page.evaluate(sid => { setLocationFlag(shapeKey(sid), 'starred', false); setLocationFlag(shapeKey(sid), 'visited', true); }, D); await W(200); await rows('rows-district-visited');
    await page.evaluate(sid => setLocationFlag(shapeKey(sid), 'starred', true), D); await W(200); await rows('rows-district-both');
    await page.evaluate(sid => { setLocationFlag(shapeKey(sid), 'starred', false); setLocationFlag(shapeKey(sid), 'visited', false); }, D); await W(200);
    // popups (street: starred + visited; then cleared), district; the map star in full-page shots
    const pop = async (sid, name) => { await page.evaluate(sid => { map.closePopup(); focusShape(sid); }, sid); await W(1500); await page.screenshot({ path: path.join(OUT, `${name}@${dsf}x.png`) }); };
    await pop(S, 'popup-street-starred-visited+map-star');
    await page.evaluate(sid => { setLocationFlag(shapeKey(sid), 'starred', false); setLocationFlag(shapeKey(sid), 'visited', false); }, S); await W(400);
    await page.screenshot({ path: path.join(OUT, `popup-street-cleared@${dsf}x.png`) });
    await page.evaluate(sid => { setLocationFlag(shapeKey(sid), 'starred', true); setLocationFlag(shapeKey(sid), 'visited', true); }, S); await W(200);
    await pop(D, 'popup-district');
    await page.evaluate(sid => { map.closePopup(); const ll = shapeStarMarkersById.get(sid).getLatLng(); map.setView(ll, 16, { animate: false }); map.panBy([0, 200], { animate: false }); }, S); await W(500);
    await page.screenshot({ path: path.join(OUT, `map-star-street@${dsf}x.png`), clip: await page.evaluate(sid => { const p = map.latLngToContainerPoint(shapeStarMarkersById.get(sid).getLatLng()), m = document.getElementById('map').getBoundingClientRect(); return { x: Math.max(0, m.x + p.x - 90), y: Math.max(0, m.y + p.y - 60), width: 180, height: 120 }; }, S) });
    await ctx.close();
    // Plans: the visited + starred street as stop 4
    { const { ctx, page } = await openProto(b, { dsf, storage: { 'gh.plans': '1', 'triplet.reorderHint': '1' } });
      await page.waitForFunction(() => typeof plans !== 'undefined' && plans.length === 1, null, { timeout: 10000 });
      await page.evaluate(() => setListView('plans')); await W(600);
      await page.evaluate(async () => { const sid = neighborhoodShapes.find(n => n.city === activeCity && n.type === 'street').id; await addStop('gh-p', { shapeId: sid }); }).catch(e => console.log('addStop', e.message));
      await W(800);
      const r = await page.evaluate(() => { const l = document.getElementById('locationsList'); l.scrollTop = 0; const c = [...document.querySelectorAll('#locationsList .location-card.is-stop')]; const a = c[0].getBoundingClientRect(), z = c[c.length - 1].getBoundingClientRect(); return { x: 0, y: a.y, width: a.width, height: z.bottom - a.y }; });
      await W(200); await page.screenshot({ path: path.join(OUT, `plans-street-stop-visited@${dsf}x.png`), clip: r });
      await ctx.close(); }
  }
  await b.close(); console.log('stills ->', OUT);
})();
