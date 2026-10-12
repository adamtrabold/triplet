// Systems appendix frames for the claim-check stub (director turn 6): collapsed + iPhone safe area,
// filters open -> tap + (panel closes, list drops), signed out, playground, desktop rail.
// Stub look = visual designer's pass-2 spec (concepts/sketches/pass2/render.js), wired to the real add flow
// with the turn-6 rulings: list drops to its band while the form is open; opening closes filters/sort;
// open = navy ON tile + paper x; cancel restores the list. In-memory copy of index.html only.
// Run: node render-appendix.js   (ONLY=<prefix>)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'); const H = '/home/user/la-trip-map/design/gesture-harness'; const OUT = __dirname;
const d = fs.readdirSync('/opt/pw-browsers').filter(x => /^chromium-\d+$/.test(x)).sort().pop();
const PLUS = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
const X = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round"><line x1="6.5" y1="6.5" x2="17.5" y2="17.5"/><line x1="17.5" y1="6.5" x2="6.5" y2="17.5"/></svg>';
const SIGNOUT = `;(function(){const cc=window.supabase.createClient;window.supabase.createClient=function(){const c=cc.apply(this,arguments);
if(location.search.includes('signin')){c.auth.getSession=async()=>({data:{session:null}});c.auth.onAuthStateChange=()=>({data:{subscription:{unsubscribe(){}}}});}return c}})();`;
const CSS = `#floatingAddBtn{display:none!important} #accountBtn{right:var(--s4)!important}
  #locationsHeader{padding-right:64px}
  #sortBtn,#toggleFiltersBtn{margin-right:-8px}
  #nb{position:absolute;right:0;top:0;bottom:-1px;width:60px;border:0;padding:0;background:var(--brand-orange);color:var(--navy);display:flex;align-items:center;justify-content:center;cursor:pointer}
  #nb::before{content:'';position:absolute;left:var(--s1);top:10px;bottom:10px;border-left:1.5px dashed var(--hair);pointer-events:none}
  #nb.open{background:var(--state-on-bg);color:var(--state-on-fg)}
  #locationsHeader h2{display:flex;min-width:0} #locationsHeader h2 .n{overflow:hidden;text-overflow:ellipsis;min-width:0;flex:0 1 auto}
  #locationsHeader h2 .w,#locationsHeader h2 .c{flex:none;white-space:pre} #locationsHeader h2.tight .w{display:none} #locationsHeader h2.tighter .c{display:none}`;
const S = {
  safe_rest:      { vp: [390, 844], inset: true, pre: 'collapse' },                 // collapsed, Home Screen, 34px inset
  safe_form:      { vp: [390, 844], inset: true, pre: 'collapse', tap: true },      // + from collapsed: nothing moves
  filters_before: { vp: [390, 844], pre: 'filters' },                               // panel open, filters tile ON
  filters_after:  { vp: [390, 844], pre: 'filters', tap: true },                    // tap +: panel closes, list drops, one ON tile
  signedout_rest: { vp: [390, 844], q: '?signin', js: SIGNOUT },                    // stub looks the same signed out
  signedout_tap:  { vp: [390, 844], q: '?signin', js: SIGNOUT, tap: true },         // tap -> sign-in sheet (list not dropped)
  play_tap:       { vp: [390, 664], q: '?play', tap: true },                        // playground, Safari-tab height: form + Add reachable
  desktop_rest:   { vp: [1280, 800], desk: true },
  desktop_form:   { vp: [1280, 800], desk: true, tap: true },
};
(async () => {
  const b = await chromium.launch({ executablePath: `/opt/pw-browsers/${d}/chrome-linux/chrome` });
  const html0 = fs.readFileSync('/home/user/la-trip-map/index.html', 'utf8');
  const out = {};
  for (const [name, s] of Object.entries(S).filter(([n]) => !process.env.ONLY || n.startsWith(process.env.ONLY))) {
    let html = html0;
    if (s.inset) html = html.replace(/env\(safe-area-inset-bottom(, *0px)?\)/g, '34px').replace(/env\(safe-area-inset-top(, *0px)?\)/g, '47px')
      .replace('<html lang="en">', '<html lang="en" class="standalone" style="--chrome-top-inset:47px">');
    const ctx = await b.newContext({ viewport: { width: s.vp[0], height: s.vp[1] }, deviceScaleFactor: s.desk ? 1 : 3, hasTouch: !s.desk, isMobile: !s.desk });
    const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
    await page.route('**/*', r => { const u = r.request().url();
      if (u.startsWith('https://triplet.test/')) return r.fulfill({ contentType: 'text/html', body: html });
      if (u.includes('leaflet.js')) return r.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(H + '/vendor/leaflet.js') });
      if (u.includes('leaflet.css')) return r.fulfill({ contentType: 'text/css', body: fs.readFileSync(H + '/vendor/leaflet.css') });
      if (u.includes('supabase')) return r.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(H + '/stub.js', 'utf8') + (s.js || '') });
      if (u.includes('fonts.googleapis.com')) return r.fulfill({ contentType: 'text/css', body: fs.readFileSync(H + '/vendor/archivo.css') });
      if (u.includes('fonts.gstatic.com')) { const f = H + '/vendor/' + u.split('/').pop(); return fs.existsSync(f) ? r.fulfill({ contentType: 'font/woff2', body: fs.readFileSync(f) }) : r.fulfill({ status: 404, body: '' }); }
      return r.fulfill({ status: 404, body: '' }); });
    await page.goto('https://triplet.test/index.html' + (s.q || ''));
    await page.waitForFunction(() => document.querySelectorAll('#locationsList .location-card[data-id]').length > 5);
    await page.evaluate(() => document.fonts.ready);
    if (await page.evaluate(() => document.getElementById('authModal').classList.contains('show'))) { await page.click('#cancelAuthBtn'); await page.waitForTimeout(300); }
    await page.evaluate(({ CSS, PLUS, X }) => {
      const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
      const h2 = document.querySelector('#locationsHeader h2');
      const t = h2.textContent.match(/^(.*?)( list)( \(\d+\))$/i); if (t) h2.innerHTML = `<span class="n">${t[1]}</span><span class="w">${t[2]}</span><span class="c">${t[3]}</span>`;
      const nb = document.createElement('button'); nb.id = 'nb'; nb.setAttribute('aria-label', 'Add a place'); nb.innerHTML = PLUS;
      document.getElementById('locationsHeader').appendChild(nb);
      const fab = document.getElementById('floatingAddBtn'), loc = document.getElementById('locations');
      let restore = null;
      nb.onclick = () => {
        const opening = !fab.classList.contains('active');
        if (opening) {
          // one overlay / one ON tile at a time: close filters panel + sort menu first
          const fp = document.getElementById('filtersPanel'); if (fp.classList.contains('visible')) document.getElementById('toggleFiltersBtn').click();
          const sm = document.getElementById('sortMenu'); if (sm && sm.classList.contains('open')) document.getElementById('sortBtn').click();
        }
        Promise.resolve(fab.onclick()).then(() => {
          const open = fab.classList.contains('active');
          if (open && !restore) { restore = { collapsed: loc.classList.contains('collapsed') };
            if (!restore.collapsed && innerWidth < 900) document.getElementById('collapseBtn').click(); }   // the drop
          if (!open && restore) { if (!restore.collapsed && loc.classList.contains('collapsed')) document.getElementById('collapseBtn').click(); restore = null; }
        });
      };
      new MutationObserver(() => { const o = fab.classList.contains('active'); nb.classList.toggle('open', o); nb.innerHTML = o ? X : PLUS; nb.setAttribute('aria-label', o ? 'Close add form' : 'Add a place'); nb.setAttribute('aria-expanded', String(o)); }).observe(fab, { attributes: true });
    }, { CSS, PLUS, X });
    await page.waitForTimeout(400);
    if (s.pre === 'collapse') { await page.click('#collapseBtn'); await page.waitForTimeout(600); }
    if (s.pre === 'filters') { await page.click('#toggleFiltersBtn'); await page.waitForTimeout(500); }
    const box = q => page.evaluate(q => { const e = document.querySelector(q); if (!e) return null; const r = e.getBoundingClientRect(); return r.width ? [r.left, r.top, r.right, r.bottom].map(Math.round) : 'hidden'; }, q);
    const m = { nbBefore: await box('#nb') };
    if (s.tap) { await page.click('#nb'); await page.waitForTimeout(800);
      m.formOpen = await page.evaluate(() => document.getElementById('addForm').classList.contains('show'));
      m.authModal = await page.evaluate(() => document.getElementById('authModal').classList.contains('show'));
      m.panelOpen = await page.evaluate(() => document.getElementById('filtersPanel').classList.contains('visible'));
      m.onTiles = await page.evaluate(() => ['sortBtn', 'toggleFiltersBtn', 'nb'].filter(id => document.getElementById(id).classList.contains('active') || document.getElementById(id).classList.contains('open')));
      m.submit = await box('#submitBtn');
      m.submitHit = await page.evaluate(() => { const q = document.getElementById('submitBtn').getBoundingClientRect(); if (!q.width) return null; const e = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); return e && (e.id || e.className); });
      m.searchHit = await page.evaluate(() => { const q = document.getElementById('nameInput').getBoundingClientRect(); if (!q.width) return null; const e = document.elementFromPoint(q.left + 20, q.top + q.height / 2); return e && (e.id || e.className); });
    }
    m.nb = await box('#nb'); m.errs = errs;
    out[name] = m; console.log(name, JSON.stringify(m));
    await page.screenshot({ path: `${OUT}/${name}-${s.desk ? 1 : 3}x.png` });
    if (s.tap && !s.desk && !m.authModal && name === 'play_tap') {   // cancel restores the list
      await page.click('#nb'); await page.waitForTimeout(800);
      out.play_cancel = { listCollapsed: await page.evaluate(() => document.getElementById('locations').classList.contains('collapsed')), nb: await box('#nb') };
      console.log('play_cancel', JSON.stringify(out.play_cancel));
    }
    await ctx.close();
  }
  fs.writeFileSync(`${OUT}/measure${process.env.ONLY ? '-' + process.env.ONLY : ''}.json`, JSON.stringify(out, null, 1));
  await b.close();
})();
