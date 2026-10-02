// Owner stills: the combined system (CD 9/10) vs D, both on the combined pin.
// Run: NODE_PATH=/opt/node22/lib/node_modules node owner.js [archivo.woff2]
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const dir = __dirname, url = 'file://' + path.join(dir, 'mockup.html');
const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const FONT = process.argv[2];
const O = f => path.join(dir, 'owner', f);
const SETS = { combined: 'sys=X', D: 'sys=D&pin=combined' };

async function page(b, w, h, dpr) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
  if (FONT) {
    await p.route(/fonts\.googleapis\.com/, r => r.fulfill({ contentType: 'text/css', body:
      `@font-face{font-family:'Archivo';font-style:normal;font-weight:400 700;font-stretch:62% 125%;src:url(https://fonts.gstatic.com/archivo.woff2) format('woff2');}` }));
    await p.route(/fonts\.gstatic\.com/, r => r.fulfill({ contentType: 'font/woff2', body: fs.readFileSync(FONT) }));
  }
  return p;
}
async function shot(p, q, sel, out, clip) {
  await p.goto(`${url}?${q}`); await p.evaluate(() => document.fonts.ready);
  if (clip) await p.screenshot({ path: O(out), clip }); else await p.locator(sel).first().screenshot({ path: O(out) });
}

(async () => {
  fs.mkdirSync(path.join(dir, 'owner'), { recursive: true });
  const b = await chromium.launch({ executablePath: exe });
  const p1 = await page(b, 700, 600, 1), p3 = await page(b, 700, 600, 3);
  for (const [k, qs] of Object.entries(SETS)) {
    await shot(p1, `${qs}&view=list`, '.listframe', `${k}-list-1x.png`);
    await shot(p1, `${qs}&tier=near`, '.phone', `${k}-map-near-1x.png`);
    await shot(p1, `${qs}&tier=far`, '.phone', `${k}-map-far-1x.png`);
    await shot(p3, `${qs}&view=spec`, '.spec', `${k}-spec-3x.png`);
  }
  // dial inset: FAR with the 1px edge ON vs OFF, same crop (upper right of the FAR frame)
  const crop = { x: 180, y: 160, width: 210, height: 200 };
  await shot(p1, 'sys=X&tier=far', null, 'dial-edge-off-1x.png', crop);
  await shot(p1, 'sys=X&tier=far&edge=1', null, 'dial-edge-on-1x.png', crop);
  await shot(p3, 'sys=X&tier=far', null, 'dial-edge-off-3x.png', crop);
  await shot(p3, 'sys=X&tier=far&edge=1', null, 'dial-edge-on-3x.png', crop);

  const img = f => 'data:image/png;base64,' + fs.readFileSync(O(f)).toString('base64');
  const band = (k, title, sub) => `<div class="h">${title}<small>${sub}</small></div>
    <img src="${img(`${k}-list-1x.png`)}"><img src="${img(`${k}-map-near-1x.png`)}"><img src="${img(`${k}-map-far-1x.png`)}">`;
  const sheet = `<!doctype html><html><head><meta charset="utf-8"><style>
    body{margin:0;background:#1d1d1b;font:600 13px/1.3 -apple-system,Segoe UI,Roboto,sans-serif;color:#F2EBDD}
    .wrap{padding:16px;display:grid;grid-template-columns:390px 390px 390px;gap:12px 14px}
    .t{grid-column:1/-1;font-size:16px}.t small{display:block;font-weight:400;color:#bdb5a6;font-size:12px;margin-top:3px}
    .h{grid-column:1/-1;font-size:15px;padding-top:14px;border-top:1px solid #3a3a36}.h small{display:block;font-weight:400;color:#bdb5a6;font-size:12px;margin-top:2px}
    img{display:block;width:390px}
    .dial{grid-column:1/-1;display:flex;gap:14px;align-items:flex-start}.dial figure{margin:0}.dial figcaption{font-weight:400;color:#bdb5a6;font-size:12px;margin-top:4px}
    .dial img{width:210px}
  </style></head><body><div class="wrap">
    <div class="t">Visited: coloured in · every panel true 1x, 390px · list | map NEAR 24 | map FAR 16 · 75% of map pins visited
      <small>Basemap is an SVG STAND-IN (no OSM tiles in the sandbox). Rows and pins use index.html's real CSS, badgeHtml(), markerStarHtml(), glyphs and tokens.</small></div>
    ${band('combined', 'Recommended: coloured in, one mark', 'Visited pins fill in with their own hue, rim gone, glyph a deeper tone of it. The row badge is the same drawing, so the VISITED stamp retires.')}
    ${band('D', 'Alternative D: same pins, the row keeps the word', 'Identical pins and badges; the row keeps only the tilted navy VISITED (ring and dots gone).')}
    <div class="h">Dial, FAR only: 1px edge in the wash's deeper tone<small>OFF in the recommendation. Turn it on only if real tiles make visited discs read as map dots.</small></div>
    <div class="dial"><figure><img src="${img('dial-edge-off-1x.png')}"><figcaption>edge off (default)</figcaption></figure>
      <figure><img src="${img('dial-edge-on-1x.png')}"><figcaption>edge on (dial)</figcaption></figure></div>
  </div></body></html>`;
  fs.writeFileSync(path.join(dir, 'owner', 'sheet.html'), sheet);
  const c = await b.newPage({ viewport: { width: 1250, height: 1000 }, deviceScaleFactor: 1 });
  await c.goto('file://' + path.join(dir, 'owner', 'sheet.html'));
  await c.locator('.wrap').screenshot({ path: path.join(dir, 'owner-combined-1x.png') });
  await b.close();
})();
