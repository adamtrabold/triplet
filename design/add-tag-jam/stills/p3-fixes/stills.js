// Phase 3 fixes (designer prototype on design-p3-fixes): the Hanging Tag's city cue, the busiest tag's
// fit at 375x667 and 390x844, the city menu (one rule, reach, the + badge), the signed-out slip.
//   node design/add-tag-jam/stills/p3-fixes/stills.js [index.html] [outdir]
const path = require('path');
const P = require('../../p2/lib-p2.js');
const S = require('../../p3/lib-p3.js');
const W = P.W;
const BUSY = { rey15: { ...S.REAL.rey15, name: 'Gunnhuver geothermal area - fumarole and mud pools', notes: 'Boardwalk over the steam vents; very windy. Pair with Reykjanesviti lighthouse and the Bridge Between Continents on the same loop.', starred: true, visited: true } };
(async () => {
  const file = path.resolve(process.argv[2] || path.join(__dirname, '../../../../index.html'));
  const OUT = path.resolve(process.argv[3] || path.join(__dirname, 'raw'));
  require('fs').mkdirSync(OUT, { recursive: true });
  const b = await P.lib.launch();
  const storage = { 'gh.plans': '1', 'triplet.reorderHint': '1', 'triplet.hiddenCities': JSON.stringify(['la', 'copenhagen', 'malmo', 'stockholm']) };
  const measure = page => page.evaluate(() => { const i = document.querySelector('.leaflet-popup .tag-in'); return i ? { sh: i.scrollHeight, ch: i.clientHeight, scrolls: i.classList.contains('scrolls') } : null; });
  for (const [w, h] of [[375, 667], [390, 844]]) {
    const o = await P.openP2(b, { dsf: 3, file, w, h, storage });
    const page = o.page;
    const shot = async name => { await W(450); await page.screenshot({ path: path.join(OUT, `${w}-${name}.png`) }); console.log('shot', w, name, JSON.stringify(await measure(page))); };
    await S.install(page);
    await S.realRows(page, BUSY);
    // the busiest tag: long name, address + distance note, a note, starred, visited, a plan stop
    await page.evaluate(() => { const st = planStops.filter(x => x.plan_id === 'gh-p').sort((a, b) => a.position - b.position); if (st[2]) { st[2].location_id = 'rey15'; st[2].shape_id = null; } choosePlan('gh-p'); }); await W(900);
    await S.openTag(page, 'rey15');
    await shot('01-busiest');
    if (w === 390) {
      // a plain tag at rest: the city's chevron cue
      await page.evaluate(() => { showPlacesView && showPlacesView(); }).catch(() => {});
    }
    // the city menu open from the busiest tag
    await P.tap(page, '.leaflet-popup .tag-city');
    await shot('02-city-menu');
    await page.evaluate(() => { const m = document.getElementById('tagCityMenu'); if (m && !m.hidden) document.querySelector('.leaflet-popup .tag-city').click(); }); await W(300);
    if (w === 390) {
      // many cities (14): the trigger stays visible, "+ town" pinned in reach
      await page.evaluate(() => { for (let i = 0; i < 9; i++) CITIES['x' + i] = { ...CITIES.reykjavik, label: ['Akureyri', 'Bergen', 'Gothenburg', 'Helsinki', 'Oslo', 'Tromsø', 'Aarhus', 'Odense', 'Turku'][i] }; });
      await P.tap(page, '.leaflet-popup .tag-city');
      await shot('03-city-menu-many');
      await page.evaluate(() => { document.querySelector('.leaflet-popup .tag-city').click(); for (let i = 0; i < 9; i++) delete CITIES['x' + i]; }); await W(300);
      // signed out: the city keeps its cue; tapping offers sign-in with copy that covers it
      await page.evaluate(() => { window.__u = currentUser; currentUser = null; refreshTags(); }); await W(300);
      await S.openTag(page, 'rey15');
      await page.evaluate(() => document.querySelector('.leaflet-popup .tag-city').click()); await W(500);
      await shot('04-signed-out-slip');
      await page.evaluate(() => { hideTagSlip(); currentUser = window.__u; refreshTags(); }); await W(400);
      await S.openTag(page, 'rey15');
      // the add tag's city menu (same shared menu): one rule above New city
      await page.evaluate(() => map.closePopup()); await W(300);
      await P.openAdd(page); await P.typeName(page, 'Blue Lagoon'); await P.pick(page, 0); await page.evaluate(() => document.activeElement && document.activeElement.blur());
      await P.tap(page, '#addCityBtn');
      await shot('05-add-city-menu');
    }
    if (o.errors.length) console.log('page errors', o.errors);
    await o.page.context().close();
  }
  await b.close();
})();
