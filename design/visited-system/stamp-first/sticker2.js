// Sticker revision ("Folded corner", S4): contact sheet, 3x crop, B1 mid-swipe frames, fold-length measure.
// Run: NODE_PATH=/opt/node22/lib/node_modules node sticker2.js [archivo.woff2]
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const dir = __dirname, url = 'file://' + path.join(dir, 'mockup.html');
const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const FONT = process.argv[2];
const O = f => path.join(dir, 'sticker', f);

(async () => {
  fs.mkdirSync(path.join(dir, 'sticker'), { recursive: true });
  const b = await chromium.launch({ executablePath: exe });
  for (const dpr of [1, 3]) {
    const p = await b.newPage({ viewport: { width: 390, height: 760 }, deviceScaleFactor: dpr });
    if (FONT) {
      await p.route(/fonts\.googleapis\.com/, r => r.fulfill({ contentType: 'text/css', body:
        `@font-face{font-family:'Archivo';font-style:normal;font-weight:400 700;font-stretch:62% 125%;src:url(https://fonts.gstatic.com/archivo.woff2) format('woff2');}` }));
      await p.route(/fonts\.gstatic\.com/, r => r.fulfill({ contentType: 'font/woff2', body: fs.readFileSync(FONT) }));
    }
    const go = async (q, sel, out) => { await p.goto(`${url}?${q}`); await p.evaluate(() => document.fonts.ready); await p.locator(sel).first().screenshot({ path: O(out) }); };
    await go('sys=S4&view=list', '#app', `S4-list-${dpr}x.png`);
    await go('sys=S4&tier=near', '.phone', `S4-near-${dpr}x.png`);
    await go('sys=S4&tier=far', '.phone', `S4-far-${dpr}x.png`);
    await p.setViewportSize({ width: 520, height: 760 });
    await go('sys=S4&view=crop', '#app > div', `S4-crop-${dpr}x.png`);
    for (let k = 0; k < 3; k++) await go(`sys=S4&view=swipe&k=${k}`, '#app > div', `S4-swipe-${k + 1}-${dpr}x.png`);
    if (dpr === 1) {
      await p.goto(`${url}?sys=S4&view=crop`);
      const folds = await p.evaluate(() => [...document.querySelectorAll('svg[data-fold]')].map(s => +s.dataset.fold).filter(Boolean));
      const truth = await p.evaluate(() => ({ near: pinSet(false).filter(p => p.order < 0.75).length, nearAll: pinSet(false).length, far: pinSet(true).filter(p => p.order < 0.75).length, farAll: pinSet(true).length }));
      fs.writeFileSync(O('S4-measure.json'), JSON.stringify({ foldLengthsPx: [...new Set(folds.map(f => f.toFixed(1)))], visitedTruth: truth }, null, 1));
    }
    await p.close();
  }
  const img = f => 'data:image/png;base64,' + fs.readFileSync(O(f)).toString('base64');
  const sheet = `<!doctype html><html><head><meta charset="utf-8"><style>
    body{margin:0;background:#1d1d1b;font:600 13px/1.3 -apple-system,Segoe UI,Roboto,sans-serif;color:#F2EBDD}
    .wrap{padding:16px;display:grid;grid-template-columns:390px 390px 390px;gap:10px 14px;align-items:start}
    .t{grid-column:1/-1;font-size:16px}.t small{display:block;font-weight:400;color:#bdb5a6;font-size:12px;margin-top:3px}
    .h{grid-column:1/-1;font-size:15px;padding-top:12px;border-top:1px solid #3a3a36}.h small{display:block;font-weight:400;color:#bdb5a6;font-size:12px;margin-top:2px}
    img{display:block}
  </style></head><body><div class="wrap">
    <div class="t">Visited = a sticker with a folded-up white corner (revision) · true 1x · list + key | map NEAR | map FAR (75% visited)
      <small>Basemap is an SVG STAND-IN. Rows and pins use index.html's real CSS, badgeHtml() geometry, markerStarHtml(), glyphs and tokens.</small></div>
    <div class="h">Folded corner<small>The whole sticker stays; one lower-left corner folds up in pure white past the rim, crisp fold line, 1px shadow.</small></div>
    <img src="${img('S4-list-1x.png')}"><img src="${img('S4-near-1x.png')}"><img src="${img('S4-far-1x.png')}">
    <div class="h">Visit swipe (B1): the trailing oval is what animates; the badge and name never move<small>1x frames: finger at 40px · press at 56px · rest</small></div>
    <img src="${img('S4-swipe-1-1x.png')}"><img src="${img('S4-swipe-2-1x.png')}"><img src="${img('S4-swipe-3-1x.png')}">
  </div></body></html>`;
  fs.writeFileSync(O('sheet2.html'), sheet);
  const c = await b.newPage({ viewport: { width: 1250, height: 1000 }, deviceScaleFactor: 1 });
  await c.goto('file://' + O('sheet2.html'));
  await c.locator('.wrap').screenshot({ path: path.join(dir, 'sticker-contact-1x.png') });
  await b.close();
})();
