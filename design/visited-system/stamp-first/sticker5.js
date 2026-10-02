// Round 5: peel back + check (K1/K2/K3). Contact sheet, 3x crops, category-from-colour test, motion keyframes,
// UNKEYED blind sheets + separate truth JSON.
// Run: NODE_PATH=/opt/node22/lib/node_modules node sticker5.js [archivo.woff2] [PICK=K1]
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const dir = __dirname, url = 'file://' + path.join(dir, 'mockup.html');
const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const FONT = process.argv[2], PICK = process.argv[3] || 'K1';
const O = f => path.join(dir, 'sticker', f);
const DIRS = {
  K1: ['1. Bold check + word', 'Category-wash face, no rim, inward peel lower-right in paper tone; heavy check in category ink. List oval: check + VISITED.'],
  K2: ['2. Check-only, matte', 'Matte paper-deep face, no rim, peel upper-left; heaviest check. List oval: check only, no word.'],
  K3: ['3. Light check, ringed', 'Same ringed paper disc as to-do (family), lighter check, peel lower-left. List oval: ringed, check + VISITED.'],
};
const VSEED = { K1: 1122334, K2: 5566778, K3: 9900112 };

(async () => {
  fs.mkdirSync(path.join(dir, 'sticker'), { recursive: true });
  fs.rmSync(path.join(dir, 'blind'), { recursive: true, force: true });
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
      await go(`sys=${d}&view=cats`, '.legend', O(`${d}-cats-${dpr}x.png`));
      for (let k = 0; k < 4; k++) await go(`sys=${d}&view=k9key&k=${k}`, '#app > div', O(`${d}-key-${k + 1}-${dpr}x.png`));
      if (dpr === 1) {
        await p.setViewportSize({ width: 390, height: 760 });
        for (const t of ['near', 'far']) await go(`sys=${d}&tier=${t}&blind=1&vseed=${VSEED[d]}`, '.phone', path.join(dir, 'blind', `${d}-${t}-1x.png`));
      }
    }
    await p.close();
  }
  // truth + colour-only category distances, in the page
  const t = await b.newPage();
  await t.goto(url + '?sys=K1');
  const truth = {};
  for (const d of Object.keys(DIRS)) truth[d] = await t.evaluate(seed => {
    const out = {};
    for (const far of [false, true]) { let sd = seed; const vr = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
      out[far ? 'far' : 'near'] = pinSet(far).map(p => ({ x: Math.round(p.x), y: Math.round(p.y), cat: p.category, kind: p.kind || 'pin', starred: p.starred, visited: vr() < 0.75 })); }
    return out; }, VSEED[d]);
  fs.writeFileSync(path.join(dir, 'blind', 'TRUTH-do-not-show-testers.json'), JSON.stringify(truth));
  const dist = await t.evaluate(() => {
    const cats = Object.keys(CATEGORY_COLORS);
    const lab = h => { const [L, C, H] = hex2oklch(h); return [L, C * Math.cos(H), C * Math.sin(H)]; };
    const d = (a, b) => Math.hypot(a[0]-b[0], a[1]-b[1], a[2]-b[2]) * 100;
    const out = {};
    for (const tier of ['near', 'far']) {
      const faces = cats.map(c => lab(pinWash(c, tier))), inks = cats.map(c => lab(categoryInk(c)));
      const pairs = [];
      for (let i = 0; i < cats.length; i++) for (let j = i + 1; j < cats.length; j++) pairs.push([cats[i], cats[j], +d(faces[i], faces[j]).toFixed(1), +d(inks[i], inks[j]).toFixed(1)]);
      pairs.sort((a, b) => (a[2] + a[3]) - (b[2] + b[3]));
      out[tier] = pairs.slice(0, 6);
    }
    return out; });
  fs.writeFileSync(O('K-category-colour-distances.json'), JSON.stringify(dist, null, 1));

  const img = f => 'data:image/png;base64,' + fs.readFileSync(O(f)).toString('base64');
  const sheet = `<!doctype html><html><head><meta charset="utf-8"><style>
    body{margin:0;background:#1d1d1b;font:600 13px/1.3 -apple-system,Segoe UI,Roboto,sans-serif;color:#F2EBDD}
    .wrap{padding:16px;display:grid;grid-template-columns:390px 390px 390px;gap:10px 14px;align-items:start}
    .t{grid-column:1/-1;font-size:16px}.t small{display:block;font-weight:400;color:#bdb5a6;font-size:12px;margin-top:3px}
    .h{grid-column:1/-1;font-size:15px;padding-top:12px;border-top:1px solid #3a3a36}.h small{display:block;font-weight:400;color:#bdb5a6;font-size:12px;margin-top:2px}
    img{display:block}
  </style></head><body><div class="wrap">
    <div class="t">Visited = a peeled sticker carrying a check · true 1x · list + to-do/visited key | map NEAR | map FAR (75% visited)
      <small>Basemap is an SVG STAND-IN. Rows and pins use index.html's real CSS, badgeHtml() geometry, markerStarHtml(), glyphs and tokens. The list badge keeps its category glyph; the check lives on the oval.</small></div>
    ${Object.entries(DIRS).map(([d, [tt, s]]) => `<div class="h">${tt}<small>${s}</small></div>
      <img src="${img(`${d}-list-1x.png`)}"><img src="${img(`${d}-near-1x.png`)}"><img src="${img(`${d}-far-1x.png`)}">`).join('')}
  </div></body></html>`;
  fs.writeFileSync(O('sheet5.html'), sheet);
  const c = await b.newPage({ viewport: { width: 1250, height: 1000 }, deviceScaleFactor: 1 });
  await c.goto('file://' + O('sheet5.html'));
  await c.locator('.wrap').screenshot({ path: path.join(dir, 'sticker-contact-1x.png') });
  // keyframes for the pick
  const ks = `<!doctype html><html><body style="margin:0;background:#1d1d1b"><div id="k" style="display:flex;flex-direction:column;gap:8px;padding:12px;width:max-content">
    <div style="color:#F2EBDD;font:600 30px -apple-system,Segoe UI,Roboto,sans-serif">Visit swipe = placing the sticker (${DIRS[PICK][0]}), 3x keyframes</div>
    ${[1,2,3,4].map(i => `<img src="${img(`${PICK}-key-${i}-3x.png`)}">`).join('')}</div></body></html>`;
  fs.writeFileSync(O('keys5.html'), ks);
  const k = await b.newPage({ viewport: { width: 1400, height: 1000 }, deviceScaleFactor: 1 });
  await k.goto('file://' + O('keys5.html'));
  await k.locator('#k').screenshot({ path: path.join(dir, 'sticker-keyframes-3x.png') });
  await b.close();
})();
