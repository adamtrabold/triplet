// Add tag close (the pin is the close on the add tag too): blank, typing (docked over a keyboard),
// picked with TYPE, starred + visited, a District; 390x844 and 375x667 at 3x, on real OSM tiles (cache).
// The keyboard is emulated: window.visualViewport is replaced by a viewport KB px shorter (the
// docking rule reads it) and a grey block is drawn where the keyboard would be.
//   node design/add-tag-close/stills.js [index.html] [outdir] [tilecache]
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const P = require('../add-tag-jam/p2/lib-p2.js');
const W = P.W;
const KB = 300;
(async () => {
  const file = path.resolve(process.argv[2] || path.join(__dirname, '../../index.html'));
  const OUT = path.resolve(process.argv[3] || path.join(__dirname, 'raw/after'));
  const TC = path.resolve(process.argv[4] || path.join(OUT, '.tiles'));
  fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(TC, { recursive: true });
  const b = await P.lib.launch();
  const storage = { 'triplet.reorderHint': '1', 'triplet.hiddenCities': JSON.stringify(['la', 'copenhagen', 'malmo', 'stockholm']) };
  const measure = page => page.evaluate(() => {
    const pin = document.getElementById('addPin'), r = pin.getBoundingClientRect(), a = getComputedStyle(pin, '::after'), bf = getComputedStyle(pin, '::before');
    const st = document.querySelector('#addForm .tag-string'), sr = st.getBoundingClientRect(), x = document.getElementById('addCancel').getBoundingClientRect();
    const zoom = document.querySelector('.leaflet-control-zoom').getBoundingClientRect(), acct = document.getElementById('accountBtn').getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2, disc = parseFloat(a.width) || 0;
    const ov = (q) => !(q.right < cx - 14 || q.left > cx + 14 || q.bottom < cy - 14 || q.top > cy + 14);
    return { shown: getComputedStyle(pin).display !== 'none' && r.width > 0, cx, cy, disc, hit: r.width - 2 * (parseFloat(bf.top) || 0), stringGap: sr.height ? Math.round((sr.top - (cy + disc / 2)) * 10) / 10 : null,
      x: Math.round(x.width) + 'x' + Math.round(x.height), discTop: Math.round(cy - 14), overControls: ov(zoom) || ov(acct), lifted: document.getElementById('addForm').classList.contains('is-lifted') };
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
    const shot = async (n, kb) => {
      await W(700);
      if (kb) await page.evaluate(KB => { const d = document.createElement('div'); d.id = '__kb'; d.style.cssText = `position:fixed;left:0;right:0;bottom:0;height:${KB}px;background:#C9CCD1;z-index:99999`; d.textContent = ''; document.body.appendChild(d); }, KB);
      await page.screenshot({ path: `${OUT}/${w}-${n}.png` });
      const m = await measure(page); pos[`${w}-${n}`] = m; console.log(w, n, JSON.stringify(m));
      if (kb) await page.evaluate(() => document.getElementById('__kb').remove());
    };
    const keyboard = on => page.evaluate(([on, KB]) => {
      if (on) { const real = window.__vv || window.visualViewport; window.__vv = real;
        Object.defineProperty(window, 'visualViewport', { configurable: true, get: () => ({ height: innerHeight - KB, width: innerWidth, offsetTop: 0, offsetLeft: 0, scale: 1, addEventListener: (...a) => real.addEventListener(...a), removeEventListener: (...a) => real.removeEventListener(...a) }) }); }
      else if (window.__vv) Object.defineProperty(window, 'visualViewport', { configurable: true, get: () => window.__vv });
      placeAddTag();
    }, [on, KB]);
    await P.openAdd(page);
    await page.evaluate(() => document.activeElement && document.activeElement.blur()); await W(200);
    await page.evaluate(() => placeAddTag());
    await shot('1-blank');
    await keyboard(true);
    await P.typeName(page, 'Hallgrímskirkja');
    await page.evaluate(() => { document.getElementById('nameInput').focus(); placeAddTag(); });
    await shot('2-typing', true);
    await keyboard(false);
    await P.pick(page, 0); await page.evaluate(() => document.activeElement && document.activeElement.blur()); await W(300);
    await page.evaluate(() => placeAddTag());
    await shot('3-picked');
    await page.evaluate(() => { document.querySelector('#addStub .popup-star').click(); }); await W(400);
    await page.evaluate(() => { document.querySelector('#addStub .popup-visited').click(); }); await W(900);
    await shot('4-starred-visited');
    await page.evaluate(() => { addDraft.starred = false; addDraft.visited = false; cancelAddForm(); }); await W(500);
    await P.openAdd(page); await P.typeName(page, 'Sund');
    await page.evaluate(() => { const i = [...document.querySelectorAll('#addResults .add-res')].findIndex(r => /District · Reykjavik/.test(r.textContent)); document.querySelectorAll('#addResults .add-res')[i].click(); }); await W(500);
    await page.evaluate(() => document.activeElement && document.activeElement.blur()); await W(300);
    await page.evaluate(() => placeAddTag());
    await shot('5-district');
    if (o.errors.length) console.log('errors', o.errors);
    await page.context().close();
  }
  fs.writeFileSync(`${OUT}/pos.json`, JSON.stringify(pos, null, 1));
  await b.close();
})();
