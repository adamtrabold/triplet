// Renders + contact sheet for design/visited-system/stamp-first.
// Run: NODE_PATH=/opt/node22/lib/node_modules node shoot.js [archivo.woff2]
// The sandbox can't always reach Google Fonts from Chromium, so the Archivo request is
// served from a local copy (argv[2]) when given.
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const dir = __dirname, url = 'file://' + path.join(dir, 'mockup.html');
const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const FONT = process.argv[2];
const SYSTEMS = ['ref', 'A', 'B', 'C', 'D'];
const R = f => path.join(dir, 'renders', f);

async function page(b, w, h, dpr) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
  if (FONT) {
    await p.route(/fonts\.googleapis\.com/, r => r.fulfill({ contentType: 'text/css', body:
      `@font-face{font-family:'Archivo';font-style:normal;font-weight:400 700;font-stretch:62% 125%;src:url(https://fonts.gstatic.com/archivo.woff2) format('woff2');}` }));
    await p.route(/fonts\.gstatic\.com/, r => r.fulfill({ contentType: 'font/woff2', body: fs.readFileSync(FONT) }));
  }
  return p;
}
async function shot(p, q, sel, out) {
  await p.goto(`${url}?${q}`); await p.evaluate(() => document.fonts.ready);
  await p.locator(sel).first().screenshot({ path: R(out) });
}

(async () => {
  fs.mkdirSync(path.join(dir, 'renders'), { recursive: true });
  const b = await chromium.launch({ executablePath: exe });
  for (const dpr of [1, 3]) {
    const p = await page(b, 700, 600, dpr);
    for (const s of SYSTEMS) {
      await shot(p, `sys=${s}&view=list`, '.listframe', `${s}-list-${dpr}x.png`);
      await shot(p, `sys=${s}&tier=near`, '.phone', `${s}-map-near-${dpr}x.png`);
      await shot(p, `sys=${s}&tier=far`, '.phone', `${s}-map-far-${dpr}x.png`);
      await shot(p, `sys=${s}&view=spec`, '.spec', `${s}-spec-${dpr}x.png`);
    }
    await p.close();
  }
  // contact sheet, true 1x: one row per system, list | map NEAR | map FAR
  const img = f => 'data:image/png;base64,' + fs.readFileSync(R(f)).toString('base64');
  const NAMES = {
    ref: ['Reference: shipped today', 'ringed seal on the map · perforated VISITED stamp in the row'],
    A: ['A. Coloured in: one mark', 'the stamp retires · the row badge IS the pin · both fill in, rim gone'],
    B: ['B. Inked from one pad', 'pin fills in · the stamp keeps its column but fills in with the SAME wash; ring + dots gone'],
    D: ['D. Just the word', 'pin fills in · the stamp drops its ring + dots and keeps only the tilted navy word'],
    C: ['C. The row is coloured in', 'pin fills in · the whole visited row takes the pin\'s hue · stamp retires'],
  };
  const sheet = `<!doctype html><html><head><meta charset="utf-8"><style>
    body{margin:0;background:#1d1d1b;font:600 13px/1.3 -apple-system,Segoe UI,Roboto,sans-serif;color:#F2EBDD}
    .wrap{padding:16px;display:grid;grid-template-columns:390px 390px 390px;gap:12px 14px}
    .t{grid-column:1/-1;font-size:16px}.t small{display:block;font-weight:400;color:#bdb5a6;font-size:12px;margin-top:3px}
    .h{grid-column:1/-1;font-size:15px;padding-top:14px;border-top:1px solid #3a3a36}.h small{font-weight:400;color:#bdb5a6;font-size:12px;margin-left:8px}
    img{display:block;width:390px}
  </style></head><body><div class="wrap">
    <div class="t">Visited as one system, stamp-first · every panel true 1x, 390px · list | map NEAR 24 | map FAR 16 · 75% of map pins visited
      <small>Basemap is an SVG STAND-IN (no OSM tiles in the sandbox). Rows and pins use index.html's real CSS, badgeHtml(), markerStarHtml(), glyphs and tokens.</small></div>
    ${SYSTEMS.map(s => `<div class="h">${NAMES[s][0]}<small>${NAMES[s][1]}</small></div>
      <img src="${img(`${s}-list-1x.png`)}"><img src="${img(`${s}-map-near-1x.png`)}"><img src="${img(`${s}-map-far-1x.png`)}">`).join('')}
  </div></body></html>`;
  fs.writeFileSync(path.join(dir, 'contact-sheet.html'), sheet);
  const c = await b.newPage({ viewport: { width: 1250, height: 1000 }, deviceScaleFactor: 1 });
  await c.goto('file://' + path.join(dir, 'contact-sheet.html'));
  await c.locator('.wrap').screenshot({ path: path.join(dir, 'contact-sheet-1x.png') });
  await b.close();
})();
