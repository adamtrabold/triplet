// Round 6 (M1): owner's combined direction. Contact sheet, 3x crops, 1x verify strip, keyframes, blind sheets + truth.
// Run: NODE_PATH=/opt/node22/lib/node_modules node sticker6.js [archivo.woff2]
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const dir = __dirname, url = 'file://' + path.join(dir, 'mockup.html');
const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const FONT = process.argv[2];
const O = f => path.join(dir, 'sticker', f);
const SEEDS = [3141592, 2718281, 1618033];

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
    await go('sys=M1&view=list', '#app', O(`M1-list-${dpr}x.png`));
    await go('sys=M1&tier=near', '.phone', O(`M1-near-${dpr}x.png`));
    await go('sys=M1&tier=far', '.phone', O(`M1-far-${dpr}x.png`));
    await p.setViewportSize({ width: 520, height: 760 });
    await go('sys=M1&view=crop', '#app > div', O(`M1-crop-${dpr}x.png`));
    await go('sys=M1&view=verify', '#app > div', O(`M1-verify-${dpr}x.png`));
    for (let k = 0; k < 4; k++) await go(`sys=M1&view=m1key&k=${k}`, '#app > div', O(`M1-key-${k + 1}-${dpr}x.png`));
    if (dpr === 1) {
      await p.setViewportSize({ width: 390, height: 760 });
      for (let i = 0; i < SEEDS.length; i++) for (const t of ['near', 'far'])
        await go(`sys=M1&tier=${t}&blind=1&vseed=${SEEDS[i]}`, '.phone', path.join(dir, 'blind', `set${i + 1}-${t}-1x.png`));
    }
    await p.close();
  }
  const t = await b.newPage();
  await t.goto(url + '?sys=M1');
  const truth = {};
  for (let i = 0; i < SEEDS.length; i++) truth[`set${i + 1}`] = await t.evaluate(seed => {
    const out = {};
    for (const far of [false, true]) { let sd = seed; const vr = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
      out[far ? 'far' : 'near'] = pinSet(far).map(p => ({ x: Math.round(p.x), y: Math.round(p.y), cat: p.category, kind: p.kind || 'pin', starred: p.starred, visited: vr() < 0.75 })); }
    return out; }, SEEDS[i]);
  fs.writeFileSync(path.join(dir, 'blind', 'TRUTH-do-not-show-testers.json'), JSON.stringify(truth));

  const img = f => 'data:image/png;base64,' + fs.readFileSync(O(f)).toString('base64');
  const sheet = `<!doctype html><html><head><meta charset="utf-8"><style>
    body{margin:0;background:#1d1d1b;font:600 13px/1.3 -apple-system,Segoe UI,Roboto,sans-serif;color:#F2EBDD}
    .wrap{padding:16px;display:grid;grid-template-columns:390px 390px 390px;gap:10px 14px;align-items:start}
    .t{grid-column:1/-1;font-size:16px}.t small{display:block;font-weight:400;color:#bdb5a6;font-size:12px;margin-top:3px}
    img{display:block}
  </style></head><body><div class="wrap">
    <div class="t">Visited = peeled sticker + small check · true 1x · list + to-do/visited key | map NEAR | map FAR (75% visited)
      <small>Pin: category-wash face, small check, flap bottom-left. List: flat matte oval, small check, flap left. Basemap is an SVG STAND-IN. Rows and pins use index.html's real CSS, geometry and tokens.</small></div>
    <img src="${img('M1-list-1x.png')}"><img src="${img('M1-near-1x.png')}"><img src="${img('M1-far-1x.png')}">
  </div></body></html>`;
  fs.writeFileSync(O('sheet6.html'), sheet);
  const c = await b.newPage({ viewport: { width: 1250, height: 800 }, deviceScaleFactor: 1 });
  await c.goto('file://' + O('sheet6.html'));
  await c.locator('.wrap').screenshot({ path: path.join(dir, 'sticker-contact-1x.png') });
  const ks = `<!doctype html><html><body style="margin:0;background:#1d1d1b"><div id="k" style="display:flex;flex-direction:column;gap:8px;padding:12px;width:max-content">
    <div style="color:#F2EBDD;font:600 30px -apple-system,Segoe UI,Roboto,sans-serif">Visit swipe = placing the sticker (M1), 3x keyframes</div>
    ${[1,2,3,4].map(i => `<img src="${img(`M1-key-${i}-3x.png`)}">`).join('')}</div></body></html>`;
  fs.writeFileSync(O('keys6.html'), ks);
  const k = await b.newPage({ viewport: { width: 1400, height: 1000 }, deviceScaleFactor: 1 });
  await k.goto('file://' + O('keys6.html'));
  await k.locator('#k').screenshot({ path: path.join(dir, 'sticker-keyframes-3x.png') });
  await b.close();
})();
