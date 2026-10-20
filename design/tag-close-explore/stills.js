// Tag close EXPLORATION (tag-close-explore, stills only): four ways to close the Hanging Tag, each on a
// plain pin, a starred tag, a visited pin, a plan stop and a district; 390x844, real OSM tiles.
//   node design/tag-close-explore/stills.js [index.html] [outdir] [tilecache] [dsf]
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const P = require('../add-tag-jam/p2/lib-p2.js');
const S = require('../add-tag-jam/p3/lib-p3.js');
const W = P.W;
(async () => {
  const file = path.resolve(process.argv[2] || path.join(__dirname, '../../index.html'));
  const OUT = path.resolve(process.argv[3] || path.join(__dirname, 'raw'));
  const TC = path.resolve(process.argv[4] || path.join(OUT, '.tiles'));
  const dsf = +process.argv[5] || 3;
  fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(TC, { recursive: true });
  const b = await P.lib.launch();
  const storage = { 'gh.plans': '1', 'triplet.reorderHint': '1', 'triplet.hiddenCities': JSON.stringify(['la', 'copenhagen', 'malmo', 'stockholm']) };
  for (const opt of (process.env.OPTS || 'cat,navy,seal,string,none').split(',')) {
    const o = await P.openP2(b, { dsf, file, storage });
    const page = o.page;
    await page.route('**/*tile.openstreetmap.org/**', async r => {
      const u = r.request().url(), f = TC + '/' + u.replace(/[^0-9a-z]/gi, '_');
      if (!fs.existsSync(f)) { try { execFileSync('curl', ['-s', '--max-time', '15', '-A', 'triplet-design-stills', '-o', f, u]); } catch (e) { } }
      if (fs.existsSync(f) && fs.statSync(f).size > 100) return r.fulfill({ contentType: 'image/png', body: fs.readFileSync(f) });
      return r.fulfill({ status: 404, body: '' });
    });
    await S.install(page);
    await S.realRows(page, { rey15: { ...S.REAL.rey15, visited: true }, rey17: { ...S.REAL.rey17, starred: true } });
    await page.evaluate(c => { document.documentElement.classList.add(c === 'cat' ? 'tag-close-pin' : 'close-' + c);
      // the bigger close sits on a district's dot too: the string hangs from its edge (radius 15/18), not the 6px dot
      if (c === 'navy' || c === 'seal') { const orig = tagPinRadius; window.tagPinRadius = p => { const src = p && p._source; return src && src.locationId == null ? (c === 'seal' ? 16 : 16) : orig(p); }; } }, opt);
    const shot = async n => { await W(900); await page.screenshot({ path: `${OUT}/${opt}-${n}.png` }); console.log(opt, n); };
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
  await b.close();
})();
