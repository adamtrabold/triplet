// Round 2 stills from a PATCHED COPY of index.html (real file only read). node render2.js
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const ROOT = '/home/user/la-trip-map', H = ROOT + '/design/gesture-harness', HERE = __dirname, OUT = HERE + '/shots';
const { BASEMAP } = require(ROOT + '/design/visited-system/build/basemap.js');
const d = fs.readdirSync('/opt/pw-browsers').filter(x => /^chromium-\d+$/.test(x)).sort().pop();
const PATCH = fs.readFileSync(HERE + '/../../flow/proto/patch.js', 'utf8'), B2 = fs.readFileSync(HERE + '/badge2.js', 'utf8');
const copy = fs.readFileSync(ROOT + '/index.html', 'utf8').replace(/<\/body>/i, `<script>window.__CONCEPT='A';window.__V=2;\n${PATCH}\n${B2}\n</script>\n</body>`);
fs.writeFileSync(HERE + '/index-A2.html', copy);
const DARK = (W, Hh) => `<svg width="${W}" height="${Hh}" xmlns="http://www.w3.org/2000/svg"><rect width="${W}" height="${Hh}" fill="#AAD3DF"/>
  <path d="M0 ${Hh * .32} C ${W * .3} ${Hh * .26}, ${W * .55} ${Hh * .4}, ${W} ${Hh * .3} L${W} ${Hh} L0 ${Hh}Z" fill="#E0DFDF"/>
  <path d="M0 0 L${W * .45} 0 L${W * .3} ${Hh * .12} L0 ${Hh * .16}Z" fill="#ADD19E"/>
  <path d="M${W * .2} ${Hh * .05} L${W * .95} ${Hh * .2}" stroke="#FFFFFF" stroke-width="5"/><path d="M${W * .6} 0 L${W * .55} ${Hh}" stroke="#FCD6A4" stroke-width="7"/></svg>`;
async function open(b, { w = 390, h = 844, base = 'cream' } = {}) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 3, hasTouch: true, isMobile: true });
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.route('**/*', r => { const u = r.request().url();
    if (u.startsWith('https://triplet.test/')) return r.fulfill({ contentType: 'text/html', body: copy });
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
  await page.evaluate(() => { const st = document.createElement('style'); st.textContent = '#accountBtn{transition:none!important}'; document.head.appendChild(st); }); 
  return { ctx, page, errs };
}
const set = (page, js) => page.evaluate(js).then(() => page.waitForTimeout(120));
(async () => {
  const b = await chromium.launch({ executablePath: `/opt/pw-browsers/${d}/chrome-linux/chrome` });
  const WIDE = { x: 230, y: 0, width: 160, height: 80 };          // corner with + : badge + plus
  for (const base of ['cream', 'dark']) {
    const { ctx, page, errs } = await open(b, { base });
    for (const v of [1, 2, 3]) {
      await set(page, `document.getElementById('floatingAddBtn').style.display='';const a=document.getElementById('accountBtn');a.style.right='';SB.renderControl('A',SB.badgeA({v:${v}}));SB.centerArcs();`);
      await page.screenshot({ path: `${OUT}/v${v}-${base}-plus.png`, clip: WIDE });
      await set(page, `document.getElementById('floatingAddBtn').style.display='none';document.getElementById('accountBtn').style.right='16px'`);
      await page.screenshot({ path: `${OUT}/v${v}-${base}-alone.png`, clip: WIDE });
    }
    if (base === 'cream') {
      // full-width real-size strip for the recommended variant, + and alone
      await set(page, `document.getElementById('floatingAddBtn').style.display='';const a=document.getElementById('accountBtn');a.style.right='';SB.renderControl('A',SB.badgeA({v:2}));SB.centerArcs();`);
      await page.screenshot({ path: `${OUT}/top-v2-390.png`, clip: { x: 0, y: 0, width: 390, height: 84 } });
      // motion, recommended variant (v2), same timings as round 1
      const clip = { x: 244, y: 4, width: 86, height: 82 };
      const IN = [['0', '{}', 1], ['60', '{ink:9,t:.15}', 1.06], ['130', '{ink:17,t:.55}', 1.12], ['250', '{ink:24,t:.9}', .97], ['380', 'SI', 1]];
      const OUTF = [['0', 'SI', 1], ['150', '{dry:.25,t:.8}', 1], ['300', '{dry:.55,t:.5}', 1], ['450', '{dry:.85,t:.15}', 1], ['540', '{}', 1]];
      for (const [name, list] of [['in', IN], ['out', OUTF]]) for (const [t, spec, sc] of list) {
        await set(page, `(()=>{const b=document.getElementById('accountBtn');b.style.cssText='';
          if ('${spec}'==='SI'){SB.renderSignedIn();return;}
          const o=(${spec});o.v=2;SB.renderControl('A',SB.badgeA(o));SB.centerArcs();b.style.transform='scale(${sc})';})()`);
        await page.screenshot({ path: `${OUT}/${name}-${t}.png`, clip });
      }
      await set(page, `(()=>{const b=document.getElementById('accountBtn');b.style.cssText='';SB.renderSignedIn();})()`);
      await page.screenshot({ path: `${OUT}/signedin-plus.png`, clip: WIDE });
    }
    if (errs.length) console.log(base, 'errors', errs);
    await ctx.close();
  }
  { const { ctx, page } = await open(b, { w: 320, h: 700 });
    await set(page, `SB.renderControl('A',SB.badgeA({v:2}));SB.centerArcs()`);
    await page.screenshot({ path: `${OUT}/top-v2-320.png`, clip: { x: 0, y: 0, width: 320, height: 84 } }); await ctx.close(); }
  await b.close(); console.log('done');
})();
