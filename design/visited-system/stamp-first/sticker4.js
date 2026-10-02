// Round 4: three two-channel sticker directions (S6/S7/S8). Contact sheet, 3x crops, and UNKEYED blind sheets.
// Run: NODE_PATH=/opt/node22/lib/node_modules node sticker4.js [archivo.woff2]
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const dir = __dirname, url = 'file://' + path.join(dir, 'mockup.html');
const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const FONT = process.argv[2];
const O = f => path.join(dir, 'sticker', f);
const DIRS = {
  S6: ['A. Matte sat-down', 'To-do stays the glossy ringed disc. Visited is a matte paper-deep sticker: no rim, glyph printed on it, one big deliberate peel.'],
  S7: ['B. Raised vs stuck', 'To-do pins lift (drop shadow). Visited lies flat with no shadow, a thin printed edge and a medium peel.'],
  S8: ['C. Die-cut notch', 'Visited is a category-wash sticker, no rim, with a big straight-cut corner missing: a real silhouette change.'],
};
const VSEED = { S6: 1234567, S7: 7654321, S8: 2468101 };

(async () => {
  fs.mkdirSync(path.join(dir, 'sticker'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'blind'), { recursive: true });
  const b = await chromium.launch({ executablePath: exe });
  for (const dpr of [1, 3]) {
    const p = await b.newPage({ viewport: { width: 390, height: 760 }, deviceScaleFactor: dpr });
    if (FONT) {
      await p.route(/fonts\.googleapis\.com/, r => r.fulfill({ contentType: 'text/css', body:
        `@font-face{font-family:'Archivo';font-style:normal;font-weight:400 700;font-stretch:62% 125%;src:url(https://fonts.gstatic.com/archivo.woff2) format('woff2');}` }));
      await p.route(/fonts\.gstatic\.com/, r => r.fulfill({ contentType: 'font/woff2', body: fs.readFileSync(FONT) }));
    }
    const go = async (q, sel, out) => { await p.goto(`${url}?${q}`); await p.evaluate(() => document.fonts.ready); await p.locator(sel).first().screenshot({ path: out }); };
    for (const d of Object.keys(DIRS)) {
      await p.setViewportSize({ width: 390, height: 760 });
      await go(`sys=${d}&view=list`, '#app', O(`${d}-list-${dpr}x.png`));
      await go(`sys=${d}&tier=near`, '.phone', O(`${d}-near-${dpr}x.png`));
      await go(`sys=${d}&tier=far`, '.phone', O(`${d}-far-${dpr}x.png`));
      await p.setViewportSize({ width: 520, height: 760 });
      await go(`sys=${d}&view=crop`, '#app > div', O(`${d}-crop-${dpr}x.png`));
      if (dpr === 1) {
        await p.setViewportSize({ width: 390, height: 760 });
        for (const t of ['near', 'far']) await go(`sys=${d}&tier=${t}&blind=1&vseed=${VSEED[d]}`, '.phone', path.join(dir, 'blind', `${d}-${t}-1x.png`));
      }
    }
    await p.close();
  }
  // blind truth (visited pin coordinates for the unseen seeds) -- kept apart from the sheets
  const t = await b.newPage();
  await t.goto(url + '?sys=S6');
  const truth = {};
  for (const d of Object.keys(DIRS)) truth[d] = await t.evaluate(seed => {
    const out = {};
    for (const far of [false, true]) { let sd = seed; const vr = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
      out[far ? 'far' : 'near'] = pinSet(far).map(p => ({ x: Math.round(p.x), y: Math.round(p.y), cat: p.category, visited: vr() < 0.75 })); }
    return out; }, VSEED[d]);
  fs.writeFileSync(path.join(dir, 'blind', 'TRUTH-do-not-show-testers.json'), JSON.stringify(truth));
  const img = f => 'data:image/png;base64,' + fs.readFileSync(O(f)).toString('base64');
  const sheet = `<!doctype html><html><head><meta charset="utf-8"><style>
    body{margin:0;background:#1d1d1b;font:600 13px/1.3 -apple-system,Segoe UI,Roboto,sans-serif;color:#F2EBDD}
    .wrap{padding:16px;display:grid;grid-template-columns:390px 390px 390px;gap:10px 14px;align-items:start}
    .t{grid-column:1/-1;font-size:16px}.t small{display:block;font-weight:400;color:#bdb5a6;font-size:12px;margin-top:3px}
    .h{grid-column:1/-1;font-size:15px;padding-top:12px;border-top:1px solid #3a3a36}.h small{display:block;font-weight:400;color:#bdb5a6;font-size:12px;margin-top:2px}
    img{display:block}
  </style></head><body><div class="wrap">
    <div class="t">Visited = a different object, not a nicked pin · true 1x · list + to-do/visited key | map NEAR | map FAR (75% visited)
      <small>Basemap is an SVG STAND-IN. Rows and pins use index.html's real CSS, badgeHtml() geometry, markerStarHtml(), glyphs and tokens.</small></div>
    ${Object.entries(DIRS).map(([d, [tt, s]]) => `<div class="h">${tt}<small>${s}</small></div>
      <img src="${img(`${d}-list-1x.png`)}"><img src="${img(`${d}-near-1x.png`)}"><img src="${img(`${d}-far-1x.png`)}">`).join('')}
  </div></body></html>`;
  fs.writeFileSync(O('sheet4.html'), sheet);
  const c = await b.newPage({ viewport: { width: 1250, height: 1000 }, deviceScaleFactor: 1 });
  await c.goto('file://' + O('sheet4.html'));
  await c.locator('.wrap').screenshot({ path: path.join(dir, 'sticker-contact-1x.png') });
  await b.close();
})();
