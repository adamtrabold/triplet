// Claim-check stub -- owner stills 1-5 + overview sheet (visual designer).
// Real app: an in-memory COPY of index.html + the gesture-harness Supabase stub; the stub is injected
// and wired to the app's own add button (form, auth, playground are the app's code). index.html untouched.
// Run: node render.js            (all)      ONLY=<name-prefix> node render.js
//      PERF=<css colour> to try a perforation ink (default var(--hair), the tag stub's own).
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'); const path = require('path');
const H = '/home/user/la-trip-map/design/gesture-harness'; const OUT = __dirname;
const d = fs.readdirSync('/opt/pw-browsers').filter(x => /^chromium-\d+$/.test(x)).sort().pop();
const PERF = process.env.PERF || 'var(--paper)';   // raised from the tag's var(--hair) (1.87:1 on orange) after the 1x check: paper (2.46:1) = the sheet's own paper showing through the holes
const PLUS = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';

// ---- the stub (concept spec) ----
const STUB_CSS = (rideMs) => `
  #floatingAddBtn{display:none!important}
  #accountBtn{right:var(--s4)!important}                       /* today's account badge, alone in the corner */
  #locationsHeader{padding-right:calc(60px + var(--s1))}
  #sortBtn,#toggleFiltersBtn{margin-right:calc(var(--s1) - var(--gap))}   /* icon gaps 12 -> 4 */
  #nb{position:absolute;right:0;top:0;bottom:-1px;width:60px;border:0;padding:0;margin:0;cursor:pointer;
      background:var(--brand-orange);color:var(--navy);display:flex;align-items:center;justify-content:center;
      -webkit-tap-highlight-color:transparent;transition:background ${rideMs}ms ease,color ${rideMs}ms ease}
  /* the Hanging Tag stub's perforation: 1.5px dashed, 10px end insets, var(--s1) inside the orange */
  #nb::before{content:'';position:absolute;left:var(--s1);top:10px;bottom:10px;border-left:1.5px dashed ${PERF};pointer-events:none}
  #nb svg{transition:transform ${rideMs}ms ease}
  #nb.press{background:var(--brand-orange-deep);color:var(--paper)}
  #nb.open{background:var(--state-on-bg);color:var(--state-on-fg)}
  #nb.open svg{transform:rotate(45deg)}                         /* + turns into x: one glyph */
  #nb.open.press{background:var(--state-on-bg);color:var(--state-on-fg)}   /* press on open keeps the tile */
  /* title gives way: " list" -> count -> the name ellipsizes */
  #locationsHeader h2.fit{display:flex;min-width:0}
  #locationsHeader h2.fit .n{overflow:hidden;text-overflow:ellipsis;min-width:0;flex:0 1 auto;white-space:nowrap}
  #locationsHeader h2.fit .w,#locationsHeader h2.fit .c{flex:none;white-space:pre}
  #locationsHeader h2.fit.no-w .w{display:none} #locationsHeader h2.fit.no-c .c{display:none}`;
function inject(rideMs) {
  const st = document.createElement('style'); st.textContent = window.__STUBCSS; document.head.appendChild(st);
  const fab = document.getElementById('floatingAddBtn');
  const nb = document.createElement('button'); nb.id = 'nb'; nb.setAttribute('aria-label', 'Add a place'); nb.innerHTML = window.__PLUS;
  document.getElementById('locationsHeader').appendChild(nb);
  let dropped = false;
  const collapsed = () => document.getElementById('locations').classList.contains('collapsed');
  nb.addEventListener('click', () => {
    const opening = !fab.classList.contains('active');
    if (opening) {
      // one ON tile in the band at a time: close filters / sort first
      const fp = document.getElementById('filtersPanel'); if (fp && fp.classList.contains('visible')) document.getElementById('toggleFiltersBtn').click();
      if (!document.getElementById('sortMenu').hidden) document.getElementById('sortScrim').click();
    }
    fab.click();
    const nowOpen = fab.classList.contains('active');
    if (nowOpen && !collapsed()) { dropped = true; document.getElementById('collapseBtn').click(); }   // the list drops to its band
    if (!nowOpen && dropped) { dropped = false; if (collapsed()) document.getElementById('collapseBtn').click(); }
  });
  new MutationObserver(() => { nb.classList.toggle('open', fab.classList.contains('active')); nb.setAttribute('aria-label', fab.classList.contains('active') ? 'Close' : 'Add a place'); })
    .observe(fab, { attributes: true, attributeFilter: ['class'] });
  window.fitTitle = () => {
    const h2 = document.querySelector('#locationsHeader h2');
    const t = h2.textContent.match(/^(.*?)( list)( \(\d+\))$/i); if (!t) return;
    h2.className = 'fit';
    h2.innerHTML = `<span class="n"></span><span class="w"></span><span class="c"></span>`;
    h2.querySelector('.n').textContent = t[1]; h2.querySelector('.w').textContent = t[2]; h2.querySelector('.c').textContent = ' ' + t[3].trim();
    const nat = () => [...h2.children].filter(c => getComputedStyle(c).display !== 'none').reduce((a, c) => { const k = c.cloneNode(true); k.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;display:inline'; h2.appendChild(k); const w = k.getBoundingClientRect().width; k.remove(); return a + w; }, 0);
    if (nat() > h2.clientWidth + 0.5) h2.classList.add('no-w');
    if (nat() > h2.clientWidth + 0.5) h2.classList.add('no-c');
  };
  window.fitTitle();
}

async function open(b, vp, { stub = true, city = 'reykjavik', rideMs = 300, dsf = 3, inset = false } = {}) {
  let html = fs.readFileSync('/home/user/la-trip-map/index.html', 'utf8');
  const ctx = await b.newContext({ viewport: { width: vp[0], height: vp[1] }, deviceScaleFactor: dsf, hasTouch: true, isMobile: true });
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message)); page.errs = errs;
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
  await page.evaluate(c => { setActiveCity(c); }, city); await page.waitForTimeout(900);
  if (stub) {
    await page.evaluate(({ css, plus }) => { window.__STUBCSS = css; window.__PLUS = plus; }, { css: STUB_CSS(rideMs), plus: PLUS });
    await page.evaluate(inject, rideMs);
  }
  await page.waitForTimeout(400);
  return { ctx, page };
}
const shot = (page, name, clip) => page.screenshot({ path: path.join(OUT, name), ...(clip ? { clip } : {}) });
const box = (page, sel) => page.evaluate(q => { const r = document.querySelector(q).getBoundingClientRect(); return { x: r.left, y: r.top, width: r.width, height: r.height }; }, sel);

const JOBS = {
  // 1. rest, list up, 390x844: today | stub
  async still1(b) {
    for (const [stub, n] of [[false, 'today'], [true, 'stub']]) {
      const { ctx, page } = await open(b, [390, 844], { stub });
      await shot(page, `1-rest-${n}-3x.png`); await ctx.close();
    }
  },
  // 2. adding at 390x664 (Safari tab): form open, list dropped, x in band; + a 3-frame strip of the tap
  async still2(b) {
    { const { ctx, page } = await open(b, [390, 664]);
      await page.click('#nb'); await page.waitForTimeout(800);
      const hit = await page.evaluate(() => { const r = document.getElementById('submitBtn').getBoundingClientRect(); const e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return e && e.id; });
      console.log('still2 add hit:', hit, 'nb', JSON.stringify(await box(page, '#nb')), 'submit', JSON.stringify(await box(page, '#submitBtn')));
      await shot(page, '2-adding-664-3x.png'); await ctx.close(); }
    // strip: slow the ride 10x so the middle frame is deterministic
    const { ctx, page } = await open(b, [390, 664], { rideMs: 3000 });
    await page.addStyleTag({ content: '#locations{transition:transform 3s ease!important}' });
    await shot(page, '2-strip-a-rest-3x.png');
    await page.click('#nb'); await page.waitForTimeout(1500);
    await shot(page, '2-strip-b-mid-3x.png');
    await page.waitForTimeout(2300);
    await shot(page, '2-strip-c-open-3x.png'); await ctx.close();
  },
  // 3. tag open (starred place) + navy selected row + stub
  async still3(b) {
    const { ctx, page } = await open(b, [390, 844]);
    // the starred + visited fixture row, as in stub-stress/tag
    const cards = await page.$$('#locationsList .location-card[data-id]');
    let pick = cards[1];
    for (const c of cards) { if (await c.evaluate(e => !!e.querySelector('.row-star, .star-on, [class*="star"]') && e.classList.contains('visited'))) { pick = c; break; } }
    await pick.click(); await page.waitForTimeout(1700);
    await shot(page, '3-tag-open-3x.png'); await ctx.close();
  },
  // 4. states close-up: rest / pressed / open, beside the open filters tile
  async still4(b) {
    const crops = [];
    for (const [n, act] of [['rest', null], ['pressed', 'press'], ['open', 'open'], ['filters', 'filters']]) {
      const { ctx, page } = await open(b, [390, 844]);
      if (act === 'press' || act === 'open') await page.evaluate(c => document.getElementById('nb').classList.add(c), act);
      if (act === 'filters') { await page.click('#toggleFiltersBtn'); await page.waitForTimeout(700); }
      await page.waitForTimeout(400);
      const hb = await box(page, '#locationsHeader');
      await shot(page, `4-state-${n}-3x.png`, { x: 0, y: hb.y - 6, width: 390, height: hb.height + 12 }); await ctx.close();
    }
  },
  // 5. 320 wide, Copenhagen
  async still5(b) {
    const { ctx, page } = await open(b, [320, 568], { city: 'copenhagen' });
    console.log('still5 title:', await page.evaluate(() => { const h = document.querySelector('#locationsHeader h2'); return h.className + ' | ' + h.textContent; }));
    await shot(page, '5-320-copenhagen-3x.png'); await ctx.close();
    const r = await open(b, [390, 844], { city: 'copenhagen' });
    console.log('390 copenhagen title:', await r.page.evaluate(() => { const h = document.querySelector('#locationsHeader h2'); return h.className + ' | ' + h.textContent; }));
    await shot(r.page, '5b-390-copenhagen-3x.png'); await r.ctx.close();
  },
  // perforation check at 1x (phone-size crop)
  async perf(b) {
    const { ctx, page } = await open(b, [390, 844], { dsf: 1 });
    const hb = await box(page, '#locationsHeader');
    await shot(page, `perf-1x${process.env.PERF ? '-alt' : ''}.png`, { x: 190, y: hb.y - 10, width: 200, height: hb.height + 20 }); await ctx.close();
  },
};
(async () => {
  const b = await chromium.launch({ executablePath: `/opt/pw-browsers/${d}/chrome-linux/chrome` });
  for (const [n, f] of Object.entries(JOBS)) if (!process.env.ONLY || n.startsWith(process.env.ONLY)) await f(b);
  await b.close();
})();
