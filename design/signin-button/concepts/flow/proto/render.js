// Renders the concept stills from a PATCHED COPY of index.html (the real file is only read).
// node render.js  -> writes ../../A-arc-badge/index-A.html, ../../B-label/index-B.html and shots/ crops
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
const ROOT = '/home/user/la-trip-map', H = ROOT + '/design/gesture-harness', CON = ROOT + '/design/signin-button/concepts';
const { BASEMAP } = require(ROOT + '/design/visited-system/build/basemap.js');
const d = fs.readdirSync('/opt/pw-browsers').filter(x => /^chromium-\d+$/.test(x)).sort().pop();
const PATCH = fs.readFileSync(__dirname + '/patch.js', 'utf8');
const SRC = fs.readFileSync(ROOT + '/index.html', 'utf8');
const copies = {};
for (const [c, dir] of [['A', 'A-arc-badge'], ['B', 'B-label']]) {
  const html = SRC.replace(/<\/body>/i, `<script>window.__CONCEPT='${c}';\n${PATCH}\n</script>\n</body>`);
  fs.writeFileSync(`${CON}/${dir}/index-${c}.html`, html); copies[c] = html;
  fs.mkdirSync(`${CON}/${dir}/shots`, { recursive: true });
}
fs.mkdirSync(`${CON}/flow/shots`, { recursive: true });
// a darker stand-in: the corner over harbour water and a park (the darkest the re-toned OSM map gets)
const DARK = (W, Hh) => `<svg width="${W}" height="${Hh}" xmlns="http://www.w3.org/2000/svg"><rect width="${W}" height="${Hh}" fill="#AAD3DF"/>
  <path d="M0 ${Hh * .32} C ${W * .3} ${Hh * .26}, ${W * .55} ${Hh * .4}, ${W} ${Hh * .3} L${W} ${Hh} L0 ${Hh}Z" fill="#E0DFDF"/>
  <path d="M0 0 L${W * .45} 0 L${W * .3} ${Hh * .12} L0 ${Hh * .16}Z" fill="#ADD19E"/>
  <path d="M${W * .2} ${Hh * .05} L${W * .95} ${Hh * .2}" stroke="#FFFFFF" stroke-width="5"/><path d="M${W * .6} 0 L${W * .55} ${Hh}" stroke="#FCD6A4" stroke-width="7"/></svg>`;
async function open(b, c, { w = 390, h = 844, base = 'cream' } = {}) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 3, hasTouch: true, isMobile: true });
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.route('**/*', r => { const u = r.request().url();
    if (u.startsWith('https://triplet.test/')) return r.fulfill({ contentType: 'text/html', body: copies[c] });
    if (u.includes('leaflet.js')) return r.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(H + '/vendor/leaflet.js') });
    if (u.includes('leaflet.css')) return r.fulfill({ contentType: 'text/css', body: fs.readFileSync(H + '/vendor/leaflet.css') });
    if (u.includes('supabase')) return r.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(H + '/stub.js', 'utf8') });
    if (u.includes('fonts.googleapis.com')) return r.fulfill({ contentType: 'text/css', body: fs.readFileSync(H + '/vendor/archivo.css') });
    if (u.includes('fonts.gstatic.com')) { const f = H + '/vendor/' + u.split('/').pop(); return fs.existsSync(f) ? r.fulfill({ contentType: 'font/woff2', body: fs.readFileSync(f) }) : r.fulfill({ status: 404, body: '' }); }
    return r.fulfill({ status: 404, body: '' }); });
  await page.goto('https://triplet.test/index.html?play');
  await page.waitForFunction(() => document.querySelectorAll('#locationsList .location-card[data-id]').length > 5);
  await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(400);
  await page.evaluate(() => { map.setView([64.1466, -21.9426], 14, { animate: false }); }); await page.waitForTimeout(400);
  const html = base === 'dark' ? DARK(w, h) : BASEMAP(w, h, false);
  await page.evaluate(([html]) => { const pane = document.querySelector('.leaflet-tile-pane'), p = map.containerPointToLayerPoint([0, 0]);
    const d = document.createElement('div'); d.style.cssText = `position:absolute;left:${p.x}px;top:${p.y}px;z-index:500;pointer-events:none`; d.innerHTML = html; pane.appendChild(d); }, [html]);
  await page.evaluate(() => { const st = document.createElement('style'); st.textContent = '#accountBtn{transition:none!important}'; document.head.appendChild(st); SB.renderControl(); }); await page.waitForTimeout(150);
  return { ctx, page, errs };
}
const shot = (page, file, clip) => page.screenshot({ path: file, clip });
// tight crop: the fields and buttons only (from the sheet's head when withHead)
async function tight(page, file, withHead) {
  const c = await page.locator('#authModalContent').boundingBox(), e = await page.locator('#authEmailInput').boundingBox(),
    k = await page.locator('#cancelAuthBtn').boundingBox(), hd = await page.locator('#authModalHead').boundingBox();
  const pw = await page.locator('#authPasswordInput').boundingBox(), l = await page.locator('#loginBtn').boundingBox();
  const top = withHead ? hd.y : pw.y - 12, bot = withHead ? k.y + k.height + 14 : l.y + l.height + 12;
  return shot(page, file, { x: c.x, y: top, width: c.width, height: bot - top });
}
(async () => {
  const b = await chromium.launch({ executablePath: `/opt/pw-browsers/${d}/chrome-linux/chrome` });
  for (const [c, dir] of [['A', 'A-arc-badge'], ['B', 'B-label']]) {
    const out = `${CON}/${dir}/shots`;
    for (const base of ['cream', 'dark']) {
      const { ctx, page, errs } = await open(b, c, { base });
      await shot(page, `${out}/top-${base}-390.png`, { x: 0, y: 0, width: 390, height: 96 });
      if (base === 'cream') {
        // signed-in pair, same spot
        await page.evaluate(() => SB.renderSignedIn()); await page.waitForTimeout(100);
        await shot(page, `${out}/top-signedin-390.png`, { x: 0, y: 0, width: 390, height: 96 });
        // storyboards in the real chrome
        const clip = c === 'A' ? { x: 244, y: 4, width: 86, height: 82 } : { x: 214, y: 4, width: 116, height: 82 };
        const IN = c === 'A'
          ? [['0', '{}', 1], ['60', '{ink:9,textOp:.8,ps:.55}', 1.06], ['130', '{ink:17,textOp:.25,ps:.8}', 1.12], ['250', '{ink:24,textOp:0,ps:.95}', .97], ['380', 'SI', 1]]
          : [['0', 'L', 1], ['130', '{paperOp:.6,inkOp:.5,die:1.12}', 1], ['250', '{paperOp:.15,inkOp:.1,die:.97}', 1], ['380', 'SI', 1]];
        const OUT = c === 'A'
          ? [['0', 'SI', 1], ['150', '{dry:.25,textOp:.35,ps:.8}', 1], ['300', '{dry:.55,textOp:.7,ps:.6}', 1], ['450', '{dry:.85,textOp:.95,ps:.45}', 1], ['540', '{}', 1]]
          : [['0', 'SI', 1], ['200', '{paperOp:.35,inkOp:.3,die:1,dry:.4}', 1], ['400', '{paperOp:.85,inkOp:.8,die:1,dry:.8}', 1], ['540', 'L', 1]];
        for (const [name, list] of [['in', IN], ['out', OUT]]) for (const [t, spec, sc] of list) {
          await page.evaluate(([c, spec, sc]) => {
            const b = document.getElementById('accountBtn'); b.style.transform = '';
            if (spec === 'SI') { SB.renderSignedIn(); b.style.right = '74px'; return; }
            b.style.right = '';
            if (spec === 'L') return SB.renderControl('B');
            const o = (new Function('return ' + spec))();
            SB.renderControl(c, c === 'A' ? SB.badgeA(o) : SB.frameB(o));
            if (c === 'B') { b.style.width = SB.LB.w + 'px'; b.style.height = '50px'; b.style.marginTop = '0'; }
            b.style.transform = `scale(${sc})`;
          }, [c, spec, sc]);
          await page.waitForTimeout(120);
          await shot(page, `${out}/${name}-${t}.png`, clip);
          await page.evaluate(() => { const b = document.getElementById('accountBtn'); b.style.cssText = ''; });
        }
      }
      if (errs.length) console.log(c, base, 'errors', errs);
      await ctx.close();
    }
    { const { ctx, page } = await open(b, c, { w: 320, h: 700 });
      await shot(page, `${out}/top-cream-320.png`, { x: 0, y: 0, width: 320, height: 96 }); await ctx.close(); }
  }
  // ---- shared flow (shown with A) ----
  { const out = `${CON}/flow/shots`; const { ctx, page } = await open(b, 'A');
    await page.locator('#locationsList .location-card[data-id]').nth(4).click(); await page.waitForTimeout(1600);
    await page.screenshot({ path: `${out}/play-tag-open.png` });
    for (const st of ['open', 'busy', 'wrong', 'offline']) {
      await page.evaluate(st => SB.sheet('play', st), st); await page.waitForTimeout(150);
      if (st === 'open') await page.screenshot({ path: `${out}/play-sheet-full.png` });
      const bb = await page.locator('#authModalContent').boundingBox();
      if (st === 'open') await shot(page, `${out}/sheet-${st}.png`, { x: 0, y: bb.y - 12, width: 390, height: bb.height + 24 });
      else await tight(page, `${out}/sheet-${st}.png`);
    }
    for (const st of ['open']) { await page.evaluate(() => SB.sheet('real', 'open')); await page.waitForTimeout(100);
      await tight(page, `${out}/sheet-real.png`, true); }
    await ctx.close(); }
  await b.close(); console.log('done');
})();
