// Tag close CONCEPTS (tag-close-concepts, stills only): five different ways to close the Hanging Tag,
// each on a plain pin, a starred tag, a visited pin, a plan stop and a district; 390x844 at 3x, real
// OSM tiles; plus filmstrips for the motion concepts and the close mark's focus point per still
// (points.json) for the 3x crops.
//   node design/tag-close-explore/concepts/stills.js [index.html] [outdir]
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const P = require('../../add-tag-jam/p2/lib-p2.js');
const S = require('../../add-tag-jam/p3/lib-p3.js');
const W = P.W;
(async () => {
  const file = path.resolve(process.argv[2] || path.join(__dirname, '../../../index.html'));
  const OUT = path.resolve(process.argv[3] || path.join(__dirname, 'raw'));
  const TC = path.join(__dirname, '../raw/.tiles');
  fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(TC, { recursive: true });
  const ptsFile = path.join(OUT, 'points.json');
  const pts = fs.existsSync(ptsFile) ? JSON.parse(fs.readFileSync(ptsFile, 'utf8')) : {};
  const b = await P.lib.launch();
  const storage = { 'gh.plans': '1', 'triplet.reorderHint': '1', 'triplet.hiddenCities': JSON.stringify(['la', 'copenhagen', 'malmo', 'stockholm']) };
  for (const opt of (process.env.OPTS || 'pin,fold,reel,untie,flag').split(',')) {
    const o = await P.openP2(b, { dsf: 3, file, storage });
    const page = o.page;
    await page.route('**/*tile.openstreetmap.org/**', async r => {
      const u = r.request().url(), f = TC + '/' + u.replace(/[^0-9a-z]/gi, '_');
      if (!fs.existsSync(f)) { try { execFileSync('curl', ['-s', '--max-time', '15', '-A', 'triplet-design-stills', '-o', f, u]); } catch (e) { } }
      if (fs.existsSync(f) && fs.statSync(f).size > 100) return r.fulfill({ contentType: 'image/png', body: fs.readFileSync(f) });
      return r.fulfill({ status: 404, body: '' });
    });
    await S.install(page);
    await S.realRows(page, { rey15: { ...S.REAL.rey15, visited: true }, rey17: { ...S.REAL.rey17, starred: true } });
    await page.evaluate(c => { if (c.startsWith('pin-')) document.documentElement.classList.add('close-pin', c); else document.documentElement.classList.add('close-' + c);
      // the pin concept's disc sits on a district's dot too: the string hangs from its edge
      if (c.startsWith('pin')) { const orig = tagPinRadius; window.tagPinRadius = p => { const src = p && p._source; return src && src.locationId == null ? 16 : orig(p); }; } }, opt);
    // the focus point of this concept's close mark, in CSS px
    const point = () => page.evaluate(c => {
      const pop = document.querySelector('.leaflet-popup.tag-popup'); if (!pop) return null;
      const tb = pop.querySelector('.tag-body').getBoundingClientRect(), st = pop.querySelector('.tag-string').getBoundingClientRect();
      if (c.startsWith('pin') || c === 'reel') return { x: st.left + st.width / 2, y: st.top + 8 };
      if (c === 'untie') return { x: tb.left + tb.width / 2, y: tb.top + 20 };
      if (c === 'fold') return { x: tb.right - 22, y: tb.top + 24 };
      if (c === 'float-corner') return { x: tb.right - 8, y: tb.top + 8 };
      if (c === 'float-above') return { x: tb.right - 16, y: tb.top - 8 };
      if (c === 'float-below') return { x: tb.left + tb.width / 2, y: tb.bottom + 20 };
      if (c === 'flag') return { x: tb.right - 44, y: tb.top + 6 };
    }, opt);
    const shot = async (n, wait = 900) => { await W(wait); await page.screenshot({ path: `${OUT}/${opt}-${n}.png` }); pts[`${opt}-${n}`] = await point(); console.log(opt, n); };
    await S.openTag(page, 'rey16'); await shot('1-plain');
    if (opt === 'reel') {
      // filmstrip: pull (finger on the tag), past the line, the retract mid-way, closed
      const finger = (x, y) => page.evaluate(([x, y]) => { let f = document.getElementById('__finger'); if (!f) { f = document.createElement('div'); f.id = '__finger'; document.body.appendChild(f); }
        f.style.cssText = `position:fixed;z-index:99999;left:${x - 22}px;top:${y - 22}px;width:44px;height:44px;border-radius:50%;background:rgba(18,41,63,.18);box-shadow:0 0 0 2px rgba(18,41,63,.45);pointer-events:none`; }, [x, y]);
      const nofinger = () => page.evaluate(() => { const f = document.getElementById('__finger'); if (f) f.remove(); });
      const fy = await page.evaluate(() => { const r = document.querySelector('.tag-popup .tag-name').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
      await finger(fy.x + 40, fy.y); await shot('f1', 200);
      await page.evaluate(() => { const p = document.querySelector('.leaflet-popup.tag-popup'); p.classList.add('reel-tug'); p.style.setProperty('--tug', '56px'); });
      await finger(fy.x + 40, fy.y + 56); await shot('f2', 200);
      await nofinger();
      await page.evaluate(() => { const p = document.querySelector('.leaflet-popup.tag-popup'); p.classList.add('reel-go'); p.getAnimations({ subtree: true }).forEach(a => { a.pause(); a.currentTime = 185; }); });
      await shot('f3', 200);
      await page.evaluate(() => { const p = document.querySelector('.leaflet-popup.tag-popup'); p.getAnimations({ subtree: true }).forEach(a => a.finish()); p.style.visibility = 'hidden'; map.getContainer().classList.remove('tag-is-open'); });
      await shot('f4', 300);
      await page.evaluate(() => { const p = document.querySelector('.leaflet-popup.tag-popup'); map.closePopup(); p.classList.remove('reel-go', 'reel-tug'); p.style.removeProperty('--tug'); p.style.visibility = ''; });
      await W(500);
      await S.openTag(page, 'rey16');
    }
    if (opt === 'untie') {
      await shot('f1', 200);
      await page.evaluate(() => document.querySelector('.leaflet-popup.tag-popup').classList.add('untie-1')); await shot('f2', 200);
      await page.evaluate(() => { const p = document.querySelector('.leaflet-popup.tag-popup'); p.classList.remove('untie-1'); p.classList.add('untie-2'); }); await shot('f3', 200);
      await page.evaluate(() => { const p = document.querySelector('.leaflet-popup.tag-popup'); p.style.visibility = 'hidden'; map.getContainer().classList.remove('tag-is-open'); }); await shot('f4', 300);
      await page.evaluate(() => { const p = document.querySelector('.leaflet-popup.tag-popup'); map.closePopup(); p.classList.remove('untie-2'); p.style.visibility = ''; });
      await S.openTag(page, 'rey16');
    }
    await S.openTag(page, 'rey17'); await shot('2-starred');
    await S.openTag(page, 'rey15'); await shot('3-visited');
    const sid = await page.evaluate(() => { const n = neighborhoodShapes.find(x => x.city === 'reykjavik' && x.type === 'district'); return n && 'shape:' + n.id; });
    if (sid) { await S.openTag(page, sid); await shot('5-district'); }
    await page.evaluate(() => { map.closePopup(); choosePlan('gh-p'); }); await W(900);
    const stop = await page.evaluate(() => { const st = planStops.filter(x => x.plan_id === 'gh-p' && x.location_id).sort((a, c) => a.position - c.position)[0]; return st && st.location_id; });
    if (stop) { await S.openTag(page, stop); await shot('4-stop'); }
    if (o.errors.length) console.log('errors', o.errors);
    await page.context().close();
    fs.writeFileSync(ptsFile, JSON.stringify(pts, null, 1));
  }
  await b.close();
})();
