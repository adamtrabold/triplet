// Systems pass 2: stress-test the claim-check stub (visual designer's turn-2 sketch, unchanged look)
// against the director's six checks + the "Close and Add in the thumb band" claim + the One-band wildcard.
// Injects into an in-memory COPY of index.html. Run: node stress.js  (ONLY=<scenario> to run one)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'); const H = '/home/user/la-trip-map/design/gesture-harness'; const OUT = __dirname;
const d = fs.readdirSync('/opt/pw-browsers').filter(x => /^chromium-\d+$/.test(x)).sort().pop();
const PLUS = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
const X = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>';
const SIGNOUT = `;(function(){const cc=window.supabase.createClient;window.supabase.createClient=function(){const c=cc.apply(this,arguments);
if(location.search.includes('signin')){c.auth.getSession=async()=>({data:{session:null}});c.auth.onAuthStateChange=()=>({data:{subscription:{unsubscribe(){}}}});}return c}})();`;
// the stub, as sketched in turn 2 (orange field, dashed perforation, navy +); open = "swap ends" (navy field, orange x)
const STUB_CSS = `#floatingAddBtn{display:none!important} #accountBtn{right:var(--s4)!important}
  #locationsHeader{padding-right:84px}
  #nb{position:absolute;right:0;top:0;bottom:0;width:68px;border:0;padding:0;background:var(--brand-orange);color:#12293F;display:flex;align-items:center;justify-content:center;cursor:pointer}
  #nb::before{content:'';position:absolute;left:0;top:6px;bottom:6px;border-left:1.5px dashed rgba(18,41,63,.55)}
  #nb.open{background:var(--navy);color:var(--brand-orange)} #nb.open::before{border-color:rgba(242,235,221,.5)}`;
// One band wildcard: no chrome on the map; zoom gone (pinch), account becomes a header icon left of the stub.
const ONEBAND_CSS = `.leaflet-control-zoom{display:none!important} #accountBtn{display:none!important}
  #locationsHeader{padding-right:84px} #acct2{width:32px;height:32px;border:0;background:none;color:var(--navy);display:flex;align-items:center;justify-content:center;padding:0}`;
const scenarios = {
  // claim: Close (stub turned x) and ADD LOCATION both in the thumb band, form unchanged -- at 844 and at 664 (Safari tab with toolbars)
  form844:   { vp: [390, 844], act: 'form' },
  form664:   { vp: [390, 664], act: 'form' },
  form667se: { vp: [375, 667], act: 'form' },
  // 1 safe area, list collapsed: emulate a Home Screen launch on a notched phone (34px bottom, 47px top)
  safearea:  { vp: [390, 844], inset: true, act: 'collapse' },
  // 2 filters panel open
  filters:   { vp: [390, 844], act: 'filters' },
  // 3 320 wide, longest city + a long plan-like title
  narrow:    { vp: [320, 640], act: 'narrow' },
  // 4 tag open on a starred place + navy selected row + stub
  tag:       { vp: [390, 844], act: 'tag' },
  // 5 signed out (tap -> sign in) and playground (tap -> add)
  signedout: { vp: [390, 844], q: '?signin', stubJs: SIGNOUT, act: 'tapstub' },
  play:      { vp: [390, 844], q: '?play', act: 'tapstub' },
  // 6 desktop rail
  desktop:   { vp: [1280, 800], dsf: 1, act: 'none' },
  filtersform: { vp: [390, 844], act: 'filtersform' },
  title375:  { vp: [375, 667], act: 'narrow' },
  title390:  { vp: [390, 844], act: 'narrow' },
  // wildcard
  oneband:   { vp: [390, 844], act: 'oneband' },
};
(async () => {
  const b = await chromium.launch({ executablePath: `/opt/pw-browsers/${d}/chrome-linux/chrome` });
  let html0 = fs.readFileSync('/home/user/la-trip-map/index.html', 'utf8');
  for (const [name, s] of Object.entries(scenarios).filter(([n]) => !process.env.ONLY || n === process.env.ONLY)) {
    let html = html0;
    if (s.inset) html = html.replace(/env\(safe-area-inset-bottom(, *0px)?\)/g, '34px').replace(/env\(safe-area-inset-top(, *0px)?\)/g, '47px')
      .replace('<html lang="en">', '<html lang="en" class="standalone" style="--chrome-top-inset:47px">');
    const ctx = await b.newContext({ viewport: { width: s.vp[0], height: s.vp[1] }, deviceScaleFactor: s.dsf || 3, hasTouch: !s.dsf, isMobile: !s.dsf });
    const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
    await page.route('**/*', r => { const u = r.request().url();
      if (u.startsWith('https://triplet.test/')) return r.fulfill({ contentType: 'text/html', body: html });
      if (u.includes('leaflet.js')) return r.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(H + '/vendor/leaflet.js') });
      if (u.includes('leaflet.css')) return r.fulfill({ contentType: 'text/css', body: fs.readFileSync(H + '/vendor/leaflet.css') });
      if (u.includes('supabase')) return r.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(H + '/stub.js', 'utf8') + (s.stubJs || '') });
      if (u.includes('fonts.googleapis.com')) return r.fulfill({ contentType: 'text/css', body: fs.readFileSync(H + '/vendor/archivo.css') });
      if (u.includes('fonts.gstatic.com')) { const f = H + '/vendor/' + u.split('/').pop(); return fs.existsSync(f) ? r.fulfill({ contentType: 'font/woff2', body: fs.readFileSync(f) }) : r.fulfill({ status: 404, body: '' }); }
      return r.fulfill({ status: 404, body: '' }); });
    await page.goto('https://triplet.test/index.html' + (s.q || ''));
    await page.waitForFunction(() => document.querySelectorAll('#locationsList .location-card[data-id]').length > 5);
    await page.evaluate(() => document.fonts.ready);
    if (await page.evaluate(() => document.getElementById('authModal').classList.contains('show'))) { await page.click('#cancelAuthBtn'); await page.waitForTimeout(300); }
    await page.evaluate(({ css, plus, x, oneband, obcss }) => {
      const st = document.createElement('style'); st.textContent = css + (oneband ? obcss : ''); document.head.appendChild(st);
      const nb = document.createElement('button'); nb.id = 'nb'; nb.setAttribute('aria-label', 'Add a place'); nb.innerHTML = plus;
      const fab = document.getElementById('floatingAddBtn');
      nb.onclick = () => fab.click();
      new MutationObserver(() => { const o = fab.classList.contains('active'); nb.classList.toggle('open', o); nb.innerHTML = o ? x : plus; }).observe(fab, { attributes: true });
      const hdr = document.getElementById('locationsHeader'); hdr.appendChild(nb);
      if (oneband) { const a = document.createElement('button'); a.id = 'acct2'; a.innerHTML = document.getElementById('accountBtn').innerHTML; a.querySelector('svg').setAttribute('width', 20); a.querySelector('svg').setAttribute('height', 20);
        hdr.insertBefore(a, nb); }
    }, { css: STUB_CSS, plus: PLUS, x: X, oneband: s.act === 'oneband', obcss: ONEBAND_CSS });
    await page.waitForTimeout(500);
    const box = sel => page.evaluate(q => { const e = document.querySelector(q); if (!e) return null; const r = e.getBoundingClientRect(); return r.width ? [r.left, r.top, r.right, r.bottom].map(Math.round) : 'hidden'; }, sel);
    const m = {};
    if (s.act === 'form' || s.act === 'tapstub') {
      await page.click('#nb'); await page.waitForTimeout(600);
      m.submit = await box('#submitBtn'); m.search = await box('#nameInput'); m.stub = await box('#nb'); m.authModal = await page.evaluate(() => document.getElementById('authModal').classList.contains('show'));
      m.formVisible = await page.evaluate(() => document.getElementById('addForm').classList.contains('show'));
      m.submitHitIsSubmit = m.submit && m.submit !== 'hidden' ? await page.evaluate(([l, t, r, bt]) => { const e = document.elementFromPoint((l + r) / 2, (t + bt) / 2); return e && (e.id || e.className || e.tagName); }, m.submit) : null;
    }
    if (s.act === 'collapse') { await page.click('#collapseBtn'); await page.waitForTimeout(700); }
    if (s.act === 'filters') { await page.click('#toggleFiltersBtn'); await page.waitForTimeout(600); m.panel = await box('#filtersPanel'); }
    if (s.act === 'filtersform') { await page.click('#toggleFiltersBtn'); await page.waitForTimeout(500); await page.click('#nb'); await page.waitForTimeout(600); m.panelOpen = await page.evaluate(() => document.getElementById('filtersPanel').classList.contains('visible')); m.panel = await box('#filtersPanel'); m.submit = await box('#submitBtn'); m.submitHit = await page.evaluate(() => { const r = document.getElementById('submitBtn').getBoundingClientRect(); const e = document.elementFromPoint(r.left + r.width/2, r.top + r.height/2); return e && (e.id || e.className); }); }
    if (s.act === 'narrow') { await page.evaluate(() => { document.querySelector('#locationsHeader h2').textContent = 'Copenhagen List (112)'; }); await page.waitForTimeout(200); }
    if (s.act === 'tag') { const cards = await page.$$('#locationsList .location-card[data-id]'); await cards[1].click(); await page.waitForTimeout(1600); m.tag = await box('.leaflet-popup'); }
    m.titleW = await page.evaluate(() => { const h = document.querySelector('#locationsHeader h2'); return [Math.round(h.getBoundingClientRect().width), h.scrollWidth]; }); m.nb = await box('#nb'); m.header = await box('#locationsHeader'); m.vp = s.vp; m.errs = errs;
    console.log(name, JSON.stringify(m));
    await page.screenshot({ path: `${OUT}/${name}-${s.dsf || 3}x.png` });
    await ctx.close();
  }
  await b.close();
})();
