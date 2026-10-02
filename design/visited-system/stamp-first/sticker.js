// Sticker round (owner: "sticker route ... slightly peeled edge"). Renders + contact sheet + 3x crop + keyframes.
// Run: NODE_PATH=/opt/node22/lib/node_modules node sticker.js [archivo.woff2]
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const dir = __dirname, url = 'file://' + path.join(dir, 'mockup.html');
const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const FONT = process.argv[2];
const O = f => path.join(dir, 'sticker', f);
const DIRS = {
  S1: ['1. Small curl', 'Paper sticker, lower-left edge lifts a little and shows its white back.'],
  S2: ['2. Die-cut edge', 'As 1, plus a thin paper-white die-cut margin around the sticker.'],
  S3: ['3. Big lift', 'A larger lift at the lower-right, so it still reads on a 16px FAR pin.'],
};
const PICK = 'S1';

(async () => {
  fs.mkdirSync(path.join(dir, 'sticker'), { recursive: true });
  const b = await chromium.launch({ executablePath: exe });
  for (const dpr of [1, 3]) {
    const p = await b.newPage({ viewport: { width: 470, height: 760 }, deviceScaleFactor: dpr });
    if (FONT) {
      await p.route(/fonts\.googleapis\.com/, r => r.fulfill({ contentType: 'text/css', body:
        `@font-face{font-family:'Archivo';font-style:normal;font-weight:400 700;font-stretch:62% 125%;src:url(https://fonts.gstatic.com/archivo.woff2) format('woff2');}` }));
      await p.route(/fonts\.gstatic\.com/, r => r.fulfill({ contentType: 'font/woff2', body: fs.readFileSync(FONT) }));
    }
    const go = async (q, sel, out) => { await p.goto(`${url}?${q}`); await p.evaluate(() => document.fonts.ready); await p.locator(sel).first().screenshot({ path: O(out) }); };
    for (const d of Object.keys(DIRS)) {
      await p.setViewportSize({ width: 390, height: 760 });
      await go(`sys=${d}&view=list`, '#app', `${d}-list-${dpr}x.png`);
      await go(`sys=${d}&tier=near`, '.phone', `${d}-near-${dpr}x.png`);
      await go(`sys=${d}&tier=far`, '.phone', `${d}-far-${dpr}x.png`);
      await p.setViewportSize({ width: 470, height: 760 });
      await go(`sys=${d}&view=crop`, '#app > div', `${d}-crop-${dpr}x.png`);
    }
    for (let k = 0; k < 4; k++) await go(`sys=${PICK}&view=key&k=${k}`, '#app > div', `key-${k + 1}-${dpr}x.png`);
    await p.close();
  }
  const img = f => 'data:image/png;base64,' + fs.readFileSync(O(f)).toString('base64');
  const sheet = `<!doctype html><html><head><meta charset="utf-8"><style>
    body{margin:0;background:#1d1d1b;font:600 13px/1.3 -apple-system,Segoe UI,Roboto,sans-serif;color:#F2EBDD}
    .wrap{padding:16px;display:grid;grid-template-columns:390px 390px 390px;gap:10px 14px;align-items:start}
    .t{grid-column:1/-1;font-size:16px}.t small{display:block;font-weight:400;color:#bdb5a6;font-size:12px;margin-top:3px}
    .h{grid-column:1/-1;font-size:15px;padding-top:12px;border-top:1px solid #3a3a36}.h small{display:block;font-weight:400;color:#bdb5a6;font-size:12px;margin-top:2px}
    img{display:block;width:390px}
  </style></head><body><div class="wrap">
    <div class="t">Visited as a sticker with a peeled edge · true 1x · list + to-do/visited key | map NEAR | map FAR (75% visited)
      <small>Basemap is an SVG STAND-IN. Rows and pins use index.html's real CSS, badgeHtml() geometry, markerStarHtml(), glyphs and tokens.</small></div>
    ${Object.entries(DIRS).map(([d, [t, s]]) => `<div class="h">${t}<small>${s}</small></div>
      <img src="${img(`${d}-list-1x.png`)}"><img src="${img(`${d}-near-1x.png`)}"><img src="${img(`${d}-far-1x.png`)}">`).join('')}
  </div></body></html>`;
  fs.writeFileSync(O('sheet.html'), sheet);
  const c = await b.newPage({ viewport: { width: 1250, height: 1000 }, deviceScaleFactor: 1 });
  await c.goto('file://' + O('sheet.html'));
  await c.locator('.wrap').screenshot({ path: path.join(dir, 'sticker-contact-1x.png') });
  // keyframes filmstrip (3x frames, stacked)
  const ks = `<!doctype html><html><body style="margin:0;background:#1d1d1b"><div id="k" style="display:flex;flex-direction:column;gap:8px;padding:12px;width:max-content">
    <div style="color:#F2EBDD;font:600 30px -apple-system,Segoe UI,Roboto,sans-serif">Visit swipe = placing the sticker (1. Small curl), 3x keyframes</div>
    ${[1,2,3,4].map(i => `<img src="${img(`key-${i}-3x.png`)}">`).join('')}</div></body></html>`;
  fs.writeFileSync(O('keys.html'), ks);
  const k = await b.newPage({ viewport: { width: 1400, height: 1000 }, deviceScaleFactor: 1 });
  await k.goto('file://' + O('keys.html'));
  await k.locator('#k').screenshot({ path: path.join(dir, 'sticker-keyframes-3x.png') });
  await b.close();
})();
