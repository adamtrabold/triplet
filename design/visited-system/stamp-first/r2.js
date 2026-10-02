// Round 2 (owner: keep the stamp; its container calls back to the pin; visited pin unmistakable).
// Run: NODE_PATH=/opt/node22/lib/node_modules node r2.js [archivo.woff2]
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const dir = __dirname, url = 'file://' + path.join(dir, 'mockup.html');
const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const FONT = process.argv[2];
const O = f => path.join(dir, 'r2', f);
const DIRS = {
  R1: ['1. Stamp-shaped', 'Visited pin is re-cut as the stamp\'s oval: same width, shorter, ~70% of the seal\'s area, stacked under to-do pins; tilted at NEAR, flat at FAR. The stamp is that oval with the word.'],
  R2: ['2. Stamp ink', 'Visited pin is drawn in the stamp\'s one slate ink; the stamp is the pin\'s round-ended shell in that ink.'],
  R3: ['3. Smaller seal', 'Visited pin drops a size (NEAR 24 to 16, no glyph); the stamp is the pin\'s round-ended shell.'],
};

(async () => {
  fs.mkdirSync(path.join(dir, 'r2'), { recursive: true });
  const b = await chromium.launch({ executablePath: exe });
  for (const dpr of [1, 3]) {
    const p = await b.newPage({ viewport: { width: 390, height: 700 }, deviceScaleFactor: dpr });
    if (FONT) {
      await p.route(/fonts\.googleapis\.com/, r => r.fulfill({ contentType: 'text/css', body:
        `@font-face{font-family:'Archivo';font-style:normal;font-weight:400 700;font-stretch:62% 125%;src:url(https://fonts.gstatic.com/archivo.woff2) format('woff2');}` }));
      await p.route(/fonts\.gstatic\.com/, r => r.fulfill({ contentType: 'font/woff2', body: fs.readFileSync(FONT) }));
    }
    for (const d of Object.keys(DIRS)) {
      for (const [q, sel, out] of [[`sys=${d}&view=list`, '#app', 'list'], [`sys=${d}&tier=near`, '.phone', 'near'], [`sys=${d}&tier=far`, '.phone', 'far']]) {
        await p.goto(`${url}?${q}`); await p.evaluate(() => document.fonts.ready);
        await p.locator(sel).first().screenshot({ path: O(`${d}-${out}-${dpr}x.png`) });
      }
    }
    await p.goto(`${url}?sys=R1&view=pairs`); await p.evaluate(() => document.fonts.ready);
    await p.locator('.legend').first().screenshot({ path: path.join(dir, `r2-pairs-${dpr}x.png`) });
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
    <div class="t">Visited, round 2: keep the stamp, make its container the pin's · true 1x · list + to-do/visited key | map NEAR | map FAR (75% visited)
      <small>Basemap is an SVG STAND-IN. Rows and pins use index.html's real CSS, badgeHtml(), markerStarHtml(), glyphs and tokens.</small></div>
    ${Object.entries(DIRS).map(([d, [t, s]]) => `<div class="h">${t}<small>${s}</small></div>
      <img src="${img(`${d}-list-1x.png`)}"><img src="${img(`${d}-near-1x.png`)}"><img src="${img(`${d}-far-1x.png`)}">`).join('')}
  </div></body></html>`;
  fs.writeFileSync(O('sheet.html'), sheet);
  const c = await b.newPage({ viewport: { width: 1250, height: 1000 }, deviceScaleFactor: 1 });
  await c.goto('file://' + O('sheet.html'));
  await c.locator('.wrap').screenshot({ path: path.join(dir, 'r2-contact-1x.png') });
  await b.close();
})();
