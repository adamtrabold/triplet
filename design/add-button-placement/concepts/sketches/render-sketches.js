// Jam sketches (visual designer, pass 1). Injects CSS + one element into a COPY of index.html in memory.
// Run: node render-sketches.js   (writes <variant>-<state>-3x.png next to this file)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'); const H = '/home/user/la-trip-map/design/gesture-harness';
const OUT = __dirname;
const d = fs.readdirSync('/opt/pw-browsers').filter(x => /^chromium-\d+$/.test(x)).sort().pop();
const PLUS = (c, w=2.75, s=22) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
function perfRect(w, h, r, step) { // svg mask circles along edges
  let c = '';
  for (let x = step/2; x < w; x += step) { c += `<circle cx="${x}" cy="0" r="${r}"/><circle cx="${x}" cy="${h}" r="${r}"/>`; }
  for (let y = step/2; y < h; y += step) { c += `<circle cx="0" cy="${y}" r="${r}"/><circle cx="${w}" cy="${y}" r="${r}"/>`; }
  return c;
}
const V = {
  // 1. Wax seal on the envelope flap: today's scalloped badge, bigger, orange field, straddling the sheet's top edge.
  seal: {
    css: `#locationsHeader{padding-right:84px}
      #nb{position:absolute;right:14px;top:-31px;width:62px;height:62px;background:var(--brand-orange);display:flex;align-items:center;justify-content:center;
      -webkit-mask-image:var(--sealmask);mask-image:var(--sealmask);-webkit-mask-size:100% 100%;mask-size:100% 100%;filter:drop-shadow(0 1px 0 rgba(0,0,0,.25))}`,
    html: PLUS('#12293F', 2.75, 26),
  },
  // 2. Index-card tab: a tab of the sheet's own paper rising off its top edge, the + printed on it.
  tab: {
    css: `#nb{position:absolute;right:12px;top:-35px;width:76px;height:36px;display:flex;align-items:center;justify-content:center;padding-top:2px}
      #nb svg.bg{position:absolute;inset:0}`,
    html: `<svg class="bg" width="76" height="36" viewBox="0 0 76 36"><path d="M0 36 C6 36 7 33 8.5 28 L14 6 C15 2 17 0 21 0 L55 0 C59 0 61 2 62 6 L67.5 28 C69 33 70 36 76 36 Z" fill="#EE7434"/></svg><span style="position:relative">${PLUS('#12293F', 2.75, 22)}</span>`,
  },
  // 3. Postage stamp in the envelope's top-right corner (where a stamp goes), perforated, overlapping the edge.
  stamp: {
    css: `#locationsHeader{padding-right:80px}
      #nb{position:absolute;right:14px;top:-24px;width:54px;height:62px;transform:rotate(-4deg);filter:drop-shadow(0 1px 0 rgba(0,0,0,.22)) drop-shadow(0 2px 3px rgba(0,0,0,.10))}
      #nb > svg{position:absolute;inset:0}`,
    html: `<svg width="54" height="62" viewBox="0 0 54 62"><defs><mask id="pm"><rect width="54" height="62" fill="#fff"/><g fill="#000">${perfRect(54,62,2.4,6.75)}</g></mask></defs>
      <g mask="url(#pm)"><rect width="54" height="62" fill="#FAF5EA"/><rect x="5" y="5" width="44" height="52" fill="#EE7434"/></g>
      <g transform="translate(13 15)"><path d="M14 4 V24 M4 14 H24" stroke="#12293F" stroke-width="3.2" stroke-linecap="round"/></g>
      <text x="27" y="51" text-anchor="middle" font-family="Archivo, sans-serif" font-stretch="75%" font-weight="700" font-size="7" letter-spacing="1" fill="#12293F">ADD</text></svg>`,
  },
  // 4. Claim-check stub: the header row is a ticket; + is its tear-off stub, perforated like the tag's stub.
  stub: {
    css: `#locationsHeader{padding-right:84px}
      #nb{position:absolute;right:0;top:0;bottom:0;width:68px;background:var(--brand-orange);display:flex;align-items:center;justify-content:center}
      #nb::before{content:'';position:absolute;left:0;top:6px;bottom:6px;border-left:1.5px dashed rgba(18,41,63,.55)}
      #nb::after{content:'';position:absolute;left:-6px;top:-6px;width:12px;height:12px;border-radius:50%;background:transparent}`,
    html: PLUS('#12293F', 2.75, 24),
  },
};
(async () => {
  const b = await chromium.launch({ executablePath: `/opt/pw-browsers/${d}/chrome-linux/chrome` });
  const html = fs.readFileSync('/home/user/la-trip-map/index.html', 'utf8');
  const sealMask = (html.match(/mask-image: (url\("data:image\/svg\+xml,[^)]*\))/) || [])[1];
  for (const [name, v] of Object.entries(V)) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true });
    const page = await ctx.newPage();
    await page.route('**/*', r => { const u = r.request().url();
      if (u.startsWith('https://triplet.test/')) return r.fulfill({ contentType: 'text/html', body: html });
      if (u.includes('leaflet.js')) return r.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(H + '/vendor/leaflet.js') });
      if (u.includes('leaflet.css')) return r.fulfill({ contentType: 'text/css', body: fs.readFileSync(H + '/vendor/leaflet.css') });
      if (u.includes('supabase')) return r.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(H + '/stub.js', 'utf8') });
      if (u.includes('fonts.googleapis.com')) return r.fulfill({ contentType: 'text/css', body: fs.readFileSync(H + '/vendor/archivo.css') });
      if (u.includes('fonts.gstatic.com')) { const f = H + '/vendor/' + u.split('/').pop(); return fs.existsSync(f) ? r.fulfill({ contentType: 'font/woff2', body: fs.readFileSync(f) }) : r.fulfill({ status: 404, body: '' }); }
      return r.fulfill({ status: 404, body: '' }); });
    await page.goto('https://triplet.test/index.html');
    await page.waitForFunction(() => document.querySelectorAll('#locationsList .location-card[data-id]').length > 5);
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(({ css, h, sealMask }) => {
      const s = document.createElement('style');
      s.textContent = `:root{--sealmask:${sealMask}} #floatingAddBtn{display:none!important} #accountBtn{right:var(--s4)!important}
        #locations, #mainContent{overflow:visible!important} #locationsHeader{overflow:visible} ${css}`;
      document.head.appendChild(s);
      const e = document.createElement('div'); e.id = 'nb'; e.innerHTML = h;
      document.getElementById('locationsHeader').appendChild(e);
    }, { css: v.css, h: v.html, sealMask });
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/${name}-rest-3x.png` });
    await page.click('#collapseBtn').catch(() => {}); await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}/${name}-collapsed-3x.png` });
    await ctx.close();
  }
  await b.close();
})();
