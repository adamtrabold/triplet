// Tag close (tweak lane, the pin is the close): plain, starred, visited, plan stop and district at
// 390x844 and 375x667, 3x, on real OSM tiles (cached; the designer's tag-close-explore cache seeds it),
// with the closing disc measured: centre on the pin/dot, 28px, the string meeting its lower edge, 44px target.
//   node design/tag-close-fix/stills.js [index.html] [outdir] [tilecache]
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const P = require('../add-tag-jam/p2/lib-p2.js');
const S = require('../add-tag-jam/p3/lib-p3.js');
const W = P.W;
(async () => {
  const file = path.resolve(process.argv[2] || path.join(__dirname, '../../index.html'));
  const OUT = path.resolve(process.argv[3] || path.join(__dirname, 'raw/pin'));
  const TC = path.resolve(process.argv[4] || path.join(OUT, '.tiles'));
  fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(TC, { recursive: true });
  const b = await P.lib.launch();
  const storage = { 'gh.plans': '1', 'triplet.reorderHint': '1', 'triplet.hiddenCities': JSON.stringify(['la', 'copenhagen', 'malmo', 'stockholm']) };
  const measure = page => page.evaluate(() => {
    const pop = document.querySelector('.leaflet-popup.tag-popup'); if (!pop) return null;
    const m = document.querySelector('#map .highlighted-marker') || document.querySelector('#map .tag-dot');
    const host = m.classList.contains('tag-dot') ? m : m.closest('.leaflet-marker-icon');
    const r = m.getBoundingClientRect(), a = getComputedStyle(m, '::after'), hb = getComputedStyle(host, '::before');
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2, disc = parseFloat(a.width);
    const st = pop.querySelector('.tag-string').getBoundingClientRect(), hr = host.getBoundingClientRect();
    const hit = host.classList.contains('tag-dot') ? hr.width : hr.width - 2 * parseFloat(hb.top || 0);
    const vis = [...m.children].filter(c => getComputedStyle(c).visibility !== 'hidden').length;
    const x = pop.querySelector('.tag-x').getBoundingClientRect();
    return { cx, cy, disc, bg: a.backgroundColor, stringGap: Math.round((st.top - (cy + disc / 2)) * 10) / 10, stringX: Math.round((st.left + st.width / 2 - cx) * 10) / 10, hit, visibleChildren: vis, cornerX: x.width + 'x' + x.height };
  });
  const pos = {};
  for (const [w, h] of [[390, 844], [375, 667]]) {
    const o = await P.openP2(b, { dsf: 3, file, w, h, storage });
    const page = o.page;
    await page.route('**/*tile.openstreetmap.org/**', async r => {
      const u = r.request().url(), f = TC + '/' + u.replace(/[^0-9a-z]/gi, '_');
      if (!fs.existsSync(f)) { try { execFileSync('curl', ['-s', '--max-time', '15', '-A', 'triplet-design-stills', '-o', f, u]); } catch (e) { } }
      if (fs.existsSync(f) && fs.statSync(f).size > 100) return r.fulfill({ contentType: 'image/png', body: fs.readFileSync(f) });
      return r.fulfill({ status: 404, body: '' });
    });
    await S.install(page);
    await S.realRows(page, { rey15: { ...S.REAL.rey15, visited: true }, rey17: { ...S.REAL.rey17, starred: true } });
    const shot = async n => { await W(900); await page.screenshot({ path: `${OUT}/${w}-${n}.png` }); const m = await measure(page); pos[`${w}-${n}`] = m; console.log(w, n, JSON.stringify(m)); };
    await S.openTag(page, 'rey16'); await shot('1-plain');
    await S.openTag(page, 'rey17'); await shot('2-starred');
    await S.openTag(page, 'rey15'); await shot('3-visited');
    const sid = await page.evaluate(() => { const n = neighborhoodShapes.find(x => x.city === 'reykjavik' && x.type === 'district'); return n && 'shape:' + n.id; });
    if (sid) { await S.openTag(page, sid); await shot('5-district'); }
    await page.evaluate(() => { map.closePopup(); choosePlan('gh-p'); }); await W(900);
    const stop = await page.evaluate(() => { const st = planStops.filter(x => x.plan_id === 'gh-p' && x.location_id).sort((a, c) => a.position - c.position)[0]; return st && st.location_id; });
    if (stop) { await S.openTag(page, stop); await shot('4-stop'); }
    if (o.errors.length) console.log('errors', o.errors);
    await page.context().close();
  }
  fs.writeFileSync(`${OUT}/pos.json`, JSON.stringify(pos, null, 1));
  await b.close();
})();
