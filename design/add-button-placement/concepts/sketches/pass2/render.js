// Visual designer jam pass 2: stub width/spacing, tag-stub perforation, states, form-open answers.
// In-memory copy of index.html; never touches the real file. Run: node render.js  (ONLY=<scenario>)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'); const H = '/home/user/la-trip-map/design/gesture-harness'; const OUT = __dirname;
const d = fs.readdirSync('/opt/pw-browsers').filter(x => /^chromium-\d+$/.test(x)).sort().pop();
const PLUS = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
const X = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round"><line x1="6.5" y1="6.5" x2="17.5" y2="17.5"/><line x1="17.5" y1="6.5" x2="6.5" y2="17.5"/></svg>';
// STUB v2: 60px wide (= the tag stub's 60px; centre x 360 = the rows' x column at 390).
// Perforation = the tag stub's exactly: 1.5px dashed var(--hair), inset 10px from the ends, drawn var(--s1) inside the orange (on the seam it read as a render glitch),
// the hair dashes on orange read as punched holes. No notches, no shadow, no texture.
// Icons: gap var(--s1) 4px between the three 32px tiles (was --gap 12); var(--s1) to the stub; the
// paper-side breathing room comes from the 32px tiles' own ~6px glyph inset.
const stubCss = (iconGap, stubGap, w) => `#floatingAddBtn{display:none!important} #accountBtn{right:var(--s4)!important}
  #locationsHeader{padding-right:${w + stubGap}px}
  #sortBtn,#toggleFiltersBtn{margin-right:${iconGap - 12}px}
  #nb{position:absolute;right:0;top:0;bottom:-1px;width:${w}px;border:0;padding:0;background:var(--brand-orange);color:var(--navy);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .12s ease,color .12s ease}
  #nb::before{content:'';position:absolute;left:var(--s1);top:10px;bottom:10px;border-left:1.5px dashed var(--hair);pointer-events:none}
  #nb.press{background:var(--brand-orange-deep);color:var(--paper)}
  #nb.open{background:var(--state-on-bg);color:var(--state-on-fg)}
  #nb.open.press{background:var(--navy);color:var(--paper);box-shadow:inset 0 0 0 100px rgba(0,0,0,.18)}
  /* intended truncation: the count never truncates; "list" goes first, then the city ellipsizes */
  #locationsHeader h2{display:flex;min-width:0} #locationsHeader h2 .n{overflow:hidden;text-overflow:ellipsis;min-width:0;flex:0 1 auto}
  #locationsHeader h2 .w,#locationsHeader h2 .c{flex:none;white-space:pre} #locationsHeader h2.tight .w{display:none}`;
const S = {
  // width study: [iconGap, stubGap, stubW]; title "Copenhagen list (112)" at 390 and 320
  w390_today:  { vp: [390, 844], none: true, title: true, crop: 'header' },
  w390_a:      { vp: [390, 844], g: [12, 12, 60], title: true, crop: 'header' },
  w390_b:      { vp: [390, 844], g: [4, 4, 60], title: true, crop: 'header' },
  w320_b:      { vp: [320, 640], g: [4, 4, 60], title: true, crop: 'header' },
  w375_b:      { vp: [375, 667], g: [4, 4, 60], title: true, crop: 'header' },
  rest390:     { vp: [390, 844], g: [4, 4, 60], crop: 'rows' },
  // states for the state-system strip
  st_rest:     { vp: [390, 844], g: [4, 4, 60], crop: 'stub' },
  st_press:    { vp: [390, 844], g: [4, 4, 60], cls: 'press', crop: 'stub' },
  st_open:     { vp: [390, 844], g: [4, 4, 60], cls: 'open', crop: 'stub' },
  st_filtersopen: { vp: [390, 844], g: [4, 4, 60], filtersTile: true, crop: 'stub' },
  st_acct:     { vp: [390, 844], g: [4, 4, 60], crop: 'acct' },
  st_acctopen: { vp: [390, 844], g: [4, 4, 60], acctOpen: true, crop: 'acct' },
  // form open answers at 664 (Safari tab): A = systems' drop (list to band), B = band holds, form scrolls above it, Add pinned
  formA664:    { vp: [390, 664], g: [4, 4, 60], form: 'drop' },
  formB664:    { vp: [390, 664], g: [4, 4, 60], form: 'hold' },
  formB844:    { vp: [390, 844], g: [4, 4, 60], form: 'hold' },
};
(async () => {
  const b = await chromium.launch({ executablePath: `/opt/pw-browsers/${d}/chrome-linux/chrome` });
  const html = fs.readFileSync('/home/user/la-trip-map/index.html', 'utf8');
  const report = {};
  for (const [name, s] of Object.entries(S).filter(([n]) => !process.env.ONLY || n.startsWith(process.env.ONLY))) {
    const ctx = await b.newContext({ viewport: { width: s.vp[0], height: s.vp[1] }, deviceScaleFactor: 3, hasTouch: true, isMobile: true });
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
    const m = await page.evaluate(({ s, css, PLUS, X }) => {
      if (!s.none) {
        const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
        const nb = document.createElement('button'); nb.id = 'nb'; nb.innerHTML = PLUS; if (s.cls) s.cls.split(' ').forEach(c => nb.classList.add(c));
        if (s.cls && s.cls.includes('open')) nb.innerHTML = X;
        document.getElementById('locationsHeader').appendChild(nb);
      }
      const h2 = document.querySelector('#locationsHeader h2');
      if (s.title) {
        if (s.none) h2.textContent = 'Copenhagen list (112)';
        else { h2.innerHTML = '<span class="n">Copenhagen</span><span class="w"> list</span><span class="c">&nbsp;(112)</span>';
          const nat = [...h2.children].reduce((a, c) => { const k = c.cloneNode(true); k.style.cssText = 'position:absolute;visibility:hidden;white-space:pre'; h2.appendChild(k); const w = k.getBoundingClientRect().width; k.remove(); return a + w; }, 0); window.__nat = nat; if (nat > h2.clientWidth + 0.5) h2.classList.add('tight'); }
      } else if (!s.none) {
        const t = h2.textContent.match(/^(.*?)( list)( \(\d+\))$/); if (t) h2.innerHTML = `<span class="n">${t[1]}</span><span class="w">${t[2]}</span><span class="c">${t[3]}</span>`;
      }
      if (s.filtersTile) document.getElementById('toggleFiltersBtn').style.cssText = 'background:var(--state-on-bg);color:var(--state-on-fg)';
      if (s.acctOpen) document.getElementById('accountBtn').classList.add('active');
      const r = e => { const q = e.getBoundingClientRect(); return [q.left, q.top, q.right, q.bottom].map(v => Math.round(v * 10) / 10); };
      const x = document.querySelector('#locationsList .delete-btn');
      return { h2: r(h2), h2scroll: h2.scrollWidth, nat: window.__nat, tight: h2.classList.contains('tight'), header: r(document.getElementById('locationsHeader')),
        nb: document.getElementById('nb') && r(document.getElementById('nb')), x: x && r(x), acct: r(document.getElementById('accountBtn')) };
    }, { s, css: s.g ? stubCss(...s.g) : '', PLUS, X });
    if (s.form) {
      await page.evaluate(({ mode, X }) => {
        const nb = document.getElementById('nb'); nb.classList.add('open'); nb.innerHTML = X;
        document.getElementById('floatingAddBtn').click();
        if (mode === 'drop') document.getElementById('collapseBtn').click();
      }, { mode: s.form, X });
      await page.waitForTimeout(700);
      if (s.form === 'hold') await page.evaluate(() => {
        // band holds where it is; the form becomes the region above it, scrolling, with ADD LOCATION pinned to its foot
        const band = document.getElementById('locationsHeader').getBoundingClientRect().top;
        const c = document.getElementById('controls');
        const st = document.createElement('style');
        st.textContent = `#controls{position:fixed;left:0;right:0;top:0;height:${band}px;overflow:auto;z-index:1500;background:var(--paper);border-bottom:0}
          #addForm{padding-top:calc(var(--s4) + 50px + var(--s3))!important;padding-bottom:0!important}
          #addForm #submitBtn{position:sticky;z-index:4;bottom:0;margin-top:var(--s4);box-shadow:0 -12px 12px -2px var(--paper)}`;
        document.head.appendChild(st);
      });
      await page.waitForTimeout(300);
      m.submit = await page.evaluate(() => { const q = document.getElementById('submitBtn').getBoundingClientRect(); return [q.left, q.top, q.right, q.bottom].map(Math.round); });
      m.hit = await page.evaluate(() => { const q = document.getElementById('submitBtn').getBoundingClientRect(); const e = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); return e && (e.id || e.className); });
      m.nb2 = await page.evaluate(() => { const q = document.getElementById('nb').getBoundingClientRect(); return [q.left, q.top, q.right, q.bottom].map(Math.round); });
    }
    await page.waitForTimeout(300);
    report[name] = m;
    let clip;
    if (s.crop === 'header') clip = { x: 0, y: m.header[1] - 8, width: s.vp[0], height: m.header[3] - m.header[1] + 70 };
    if (s.crop === 'rows') clip = { x: 0, y: m.header[1] - 60, width: s.vp[0], height: 300 };
    if (s.crop === 'stub') clip = { x: 210, y: m.header[1] - 12, width: 180, height: 140 };
    if (s.crop === 'acct') clip = { x: 280, y: 0, width: 110, height: 90 };
    await page.screenshot({ path: `${OUT}/${name}-3x.png`, ...(clip ? { clip } : {}) });
    await ctx.close();
  }
  fs.writeFileSync(`${OUT}/measure${process.env.ONLY ? '-' + process.env.ONLY : ''}.json`, JSON.stringify(report, null, 1));
  console.log(JSON.stringify(report));
  await b.close();
})();
