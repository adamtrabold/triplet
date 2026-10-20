// Tag close-x fix (tweak lane): the Hanging Tag's x across short / two-line / starred / busiest tags,
// at 390x844 and 375x667, 1x and 3x, with the x's geometry measured against the tag.
//   node design/tag-close-fix/stills.js [index.html] [outdir]
const path = require('path');
const P = require('../add-tag-jam/p2/lib-p2.js');
const S = require('../add-tag-jam/p3/lib-p3.js');
const W = P.W;
const TWO = { rey16: { ...S.REAL.rey16, name: 'Sundhöllin public baths and hot tubs' } };
const STAR = { rey16: { ...S.REAL.rey16, starred: true } };
const BUSY = { rey15: { ...S.REAL.rey15, name: 'Gunnhuver geothermal area - fumarole and mud pools', notes: 'Boardwalk over the steam vents; very windy. Pair with Reykjanesviti lighthouse and the Bridge Between Continents on the same loop.', starred: true, visited: true } };
(async () => {
  const file = path.resolve(process.argv[2] || path.join(__dirname, '../../index.html'));
  const OUT = path.resolve(process.argv[3] || path.join(__dirname, 'raw'));
  require('fs').mkdirSync(OUT, { recursive: true });
  const b = await P.lib.launch();
  const storage = { 'gh.plans': '1', 'triplet.reorderHint': '1', 'triplet.hiddenCities': JSON.stringify(['la', 'copenhagen', 'malmo', 'stockholm']) };
  const measure = page => page.evaluate(() => {
    const t = document.querySelector('.leaflet-popup .tag'); if (!t) return null;
    const R = el => el && el.getBoundingClientRect();
    const stock = R(t.querySelector('.tag-stock')), x = R(t.querySelector('.tag-x')), ico = R(t.querySelector('.tag-x svg')),
      name = t.querySelector('.tag-name'), nr = R(name), line = R(t.querySelector('.tag-in > .route-line')), band = R(t.querySelector('.tag-band')),
      city = R(t.querySelector('.route-city-name')), lh = parseFloat(getComputedStyle(name).lineHeight);
    const r = v => Math.round(v * 10) / 10;
    return {
      lines: Math.round(nr.height / lh),
      xBox: { top: r(x.top - stock.top), right: r(stock.right - x.right), w: x.width, h: x.height },
      icoC: { y: r(ico.top + ico.height / 2 - stock.top), fromRight: r(stock.right - (ico.left + ico.width / 2)) },
      nameL1C: r(nr.top + lh / 2 - stock.top), nameTop: r(nr.top - stock.top), nameBottom: r(nr.bottom - stock.top),
      cityC: r(line.top + line.height / 2 - stock.top), cityTop: r(line.top - stock.top), cityToName: r(nr.top - line.bottom),
      cityTextRight: r(city.right - stock.left), stockW: stock.width, stockH: r(stock.height),
      bandBottom: band ? r(band.bottom - stock.top) : null,
    };
  });
  for (const [w, h] of [[390, 844], [375, 667]]) for (const dsf of [1, 3]) {
    const o = await P.openP2(b, { dsf, file, w, h, storage });
    const page = o.page;
    const shot = async name => { await W(450); await page.screenshot({ path: path.join(OUT, `${w}-${dsf}x-${name}.png`) }); if (dsf === 1) console.log(w, name, JSON.stringify(await measure(page))); };
    await S.install(page);
    await S.realRows(page, BUSY);
    await page.evaluate(() => { const st = planStops.filter(x => x.plan_id === 'gh-p').sort((a, b) => a.position - b.position); if (st[2]) { st[2].location_id = 'rey15'; st[2].shape_id = null; } choosePlan('gh-p'); }); await W(900);
    await S.openTag(page, 'rey16'); await shot('1-short');
    await S.realRows(page, { ...BUSY, ...TWO }); await S.openTag(page, 'rey16'); await shot('2-two-line');
    await S.realRows(page, { ...BUSY, ...STAR }); await S.openTag(page, 'rey16'); await shot('3-starred');
    await S.openTag(page, 'rey15'); await shot('4-busiest');
    if (o.errors.length) console.log('page errors', o.errors);
    await o.page.context().close();
  }
  await b.close();
})();
