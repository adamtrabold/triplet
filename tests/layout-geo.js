const { open, launch, ROWS, SHAPES } = require('./lib');
const FILE = require('./lib').FILE;
const many = Array.from({ length: 24 }, (_, i) => ({ ...ROWS[i % ROWS.length], id: ROWS[i % ROWS.length].id.slice(0, -2) + String(i).padStart(2, '0') }));
const R = (x) => Math.round(x * 100) / 100;
async function measure(page) {
  return page.evaluate(() => {
    const q = s => document.querySelector(s).getBoundingClientRect();
    const loc = q('#locations'), main = q('#mainContent'), hdr = q('#locationsHeader'), msz = map.getSize();
    const cs = getComputedStyle(document.documentElement);
    const p = document.createElement('div'); p.style.cssText = 'position:absolute;height:var(--chrome-bottom);width:1px'; document.body.appendChild(p);
    const p2 = document.createElement('div'); p2.style.cssText = 'position:absolute;height:var(--sheet-under);width:1px'; document.body.appendChild(p2);
    const chrome = p.getBoundingClientRect().height, under = p2.getBoundingClientRect().height; p.remove(); p2.remove();
    const fp = document.getElementById('filtersPanel'); const f = fp.getBoundingClientRect();
    const se = document.scrollingElement;
    return { vh: innerHeight, body: document.body.getBoundingClientRect().height, chrome, under,
      sheetTop: loc.top, sheetBottom: loc.bottom, hdrTop: hdr.top, hdrBottom: hdr.bottom, mainTop: main.top, mainBottom: main.bottom, mainLeft: main.left,
      mapSize: [msz.x, msz.y], mainSize: [main.width, main.height], filtersVisible: fp.classList.contains('visible'), filtersTop: f.top, filtersBottom: f.bottom,
      docScrollable: se.scrollHeight - se.clientHeight, scrollY };
  });
}
async function lastRow(page) {
  return page.evaluate(async () => { const l = document.getElementById('locationsList'); l.scrollTop = 1e6; await new Promise(r => setTimeout(r, 60));
    const cards = l.querySelectorAll('.location-card, .shape-card, [data-shape-id]'); const last = cards[cards.length - 1].getBoundingClientRect();
    return { lastRowBottom: last.bottom, listBottom: l.getBoundingClientRect().bottom, scrolling: l.classList.contains('scrolling') }; });
}
const toggle = async (page) => { await page.click('#collapseBtn'); await page.waitForTimeout(450); };
const filt = async (page) => { await page.evaluate(() => document.getElementById('toggleFiltersBtn').click()); await page.waitForTimeout(380); };
(async () => {
  const b = await launch(); const out = {}; const fails = [];
  const ok = (name, cond, v) => { (cond ? 0 : fails.push(name)); console.log((cond ? 'PASS ' : 'FAIL ') + name + (v !== undefined ? ' ' + JSON.stringify(v) : '')); };
  const modes = [
    { name: 'phone-plain', vp: { width: 390, height: 844 } },
    { name: 'standalone', vp: { width: 440, height: 956 }, insets: { top: 62, bottom: 34 } },
    { name: 'tab-emulated', vp: { width: 440, height: 836 }, chrome: 100 },
  ];
  for (const m of modes) {
    const { ctx, page, errors } = await open(b, '', { viewport: m.vp, deviceScaleFactor: 2, hasTouch: true }, { file: FILE, rows: many, hi: -1, pressed: -1 });
    if (m.insets) { const c = await ctx.newCDPSession(page); await c.send('Emulation.setSafeAreaInsetsOverride', { insets: { top: m.insets.top, bottom: m.insets.bottom, left: 0, right: 0 } }); await page.waitForTimeout(200); }
    if (m.chrome) { await page.evaluate(c => { document.documentElement.style.setProperty('--chrome-bottom', c + 'px'); }, m.chrome); await page.waitForTimeout(400); await page.evaluate(() => map.invalidateSize()); }  // as if in effect at load (+ transitions settled)
    await page.evaluate(() => { window.__inv = 0; const o = map.invalidateSize.bind(map); map.invalidateSize = (...a) => { __inv++; return o(...a); }; });
    await page.waitForTimeout(100);
    const H = m.vp.height, chrome = m.chrome || 0, ib = m.insets ? m.insets.bottom : 0, visBottom = H - chrome;   // visible bottom = top of the (emulated) toolbar
    const r = {}; r.expanded = await measure(page); r.expandedLast = await lastRow(page);
    await filt(page); r.expFilters = await measure(page); await filt(page);
    await toggle(page); r.collapsed = await measure(page); r.inv = await page.evaluate(() => __inv);
    await filt(page); r.colFilters = await measure(page); await filt(page);
    await toggle(page); r.reexpanded = await measure(page);
    r.errors = errors; out[m.name] = r;
    const e = r.expanded, c = r.collapsed;
    ok(`${m.name} chrome var = ${chrome}`, Math.abs(e.chrome - chrome) < 0.01, e.chrome);
    ok(`${m.name} sheet-under = ${chrome + ib}`, Math.abs(e.under - chrome - ib) < 0.01, e.under);
    ok(`${m.name} body = ${H}`, Math.abs(e.body - H) < 0.01, e.body);
    ok(`${m.name} sheet reaches bottom edge`, Math.abs(e.sheetBottom - H) < 0.01, e.sheetBottom);
    ok(`${m.name} expanded visible sheet = 300 above chrome`, Math.abs(visBottom - e.sheetTop - 300) < 0.01, visBottom - e.sheetTop);
    ok(`${m.name} expanded map meets sheet`, Math.abs(e.mainBottom - e.sheetTop) < 0.01, [e.mainBottom, e.sheetTop]);
    ok(`${m.name} map top 0`, e.mainTop === 0);
    ok(`${m.name} leaflet size = mainContent`, e.mapSize[0] === Math.round(e.mainSize[0]) && e.mapSize[1] === Math.round(e.mainSize[1]), [e.mapSize, e.mainSize]);
    ok(`${m.name} last row clears chrome+inset`, r.expandedLast.lastRowBottom <= H - chrome - ib + 0.01, r.expandedLast);
    ok(`${m.name} scrolling mask on`, r.expandedLast.scrolling);
    ok(`${m.name} expanded filters sit on sheet`, r.expFilters.filtersVisible && Math.abs(r.expFilters.filtersBottom - r.expFilters.sheetTop) < 0.01, [r.expFilters.filtersBottom, r.expFilters.sheetTop]);
    ok(`${m.name} collapsed header band bottom = ${H - chrome - ib}`, Math.abs(c.sheetTop + 60 - (H - chrome - ib)) < 0.01 && c.hdrBottom <= H - chrome - ib, [c.sheetTop, c.hdrTop, c.hdrBottom]);
    ok(`${m.name} collapsed map meets sheet`, Math.abs(c.mainBottom - c.sheetTop) < 0.01, [c.mainBottom, c.sheetTop]);
    ok(`${m.name} collapsed invalidateSize + leaflet size`, r.inv >= 1 && c.mapSize[1] === Math.round(c.mainSize[1]), [r.inv, c.mapSize, c.mainSize]);
    ok(`${m.name} collapsed filters sit on band`, r.colFilters.filtersVisible && Math.abs(r.colFilters.filtersBottom - r.colFilters.sheetTop) < 0.01, [r.colFilters.filtersBottom, r.colFilters.sheetTop]);
    ok(`${m.name} re-expanded = expanded`, Math.abs(r.reexpanded.mainBottom - e.mainBottom) < 0.01 && Math.abs(r.reexpanded.sheetTop - e.sheetTop) < 0.01);
    ok(`${m.name} page never scrolled`, e.scrollY === 0 && c.scrollY === 0 && r.colFilters.scrollY === 0 && r.expFilters.scrollY === 0, [e.docScrollable, c.docScrollable]);
    ok(`${m.name} no page errors`, errors.length === 0, errors);
    // hidden filters panel fully out of sight (clipped by body) in both modes
    ok(`${m.name} hidden filters off-screen`, e.filtersTop >= H - 0.01 && c.filtersTop >= H - 0.01, [e.filtersTop, c.filtersTop]);
    // auth modal scrim covers the whole body
    const am = await page.evaluate(() => { const a = document.getElementById('authModal'); a.classList.add('show'); const r = a.getBoundingClientRect(); const cr = document.getElementById('authModalContent').getBoundingClientRect(); const top = document.elementFromPoint(innerWidth / 2, innerHeight - 2); a.classList.remove('show'); return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, cardMid: (cr.top + cr.bottom) / 2, hitBottom: top && top.id }; });
    ok(`${m.name} auth scrim covers screen`, am.top === 0 && Math.abs(am.bottom - H) < 0.01 && am.left === 0 && am.right === m.vp.width && am.hitBottom === 'authModal', am);
    ok(`${m.name} auth card centred in visible area`, Math.abs(am.cardMid - (H - chrome) / 2) < 1, [am.cardMid, (H - chrome) / 2]);
    await ctx.close();
  }
  // Desktop rail
  { const { ctx, page, errors } = await open(b, '', { viewport: { width: 1280, height: 800 } }, { file: FILE, rows: many, hi: -1, pressed: -1 });
    const e = await measure(page); const l = await page.evaluate(() => { const r = document.getElementById('locations').getBoundingClientRect(); return [r.top, r.bottom, r.width]; });
    out.desktop = { e, l };
    ok('desktop rail full height', l[0] === 0 && l[1] === 800 && l[2] === 360, l);
    ok('desktop map fills right side', e.mainLeft === 360 && e.mainBottom === 800 && e.mainTop === 0, [e.mainLeft, e.mainBottom]);
    ok('desktop leaflet size', e.mapSize[0] === 920 && e.mapSize[1] === 800, e.mapSize);
    ok('desktop chrome 0', e.chrome === 0 && e.under === 0);
    const lr = await lastRow(page); ok('desktop last row within rail', lr.lastRowBottom <= 800.01, lr);
    // resize to phone and back while collapsed: map must follow the class
    await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(150); await toggle(page);
    await page.setViewportSize({ width: 1280, height: 800 }); await page.waitForTimeout(150);
    await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(450);
    const c = await measure(page); ok('rail->phone while collapsed: map meets band', Math.abs(c.mainBottom - c.sheetTop) < 0.01, [c.mainBottom, c.sheetTop]);
    ok('desktop no errors', errors.length === 0, errors);
    await ctx.close(); }
  // Root taller than the viewport (the tab's lvh > innerHeight case): page must not scroll
  { const { ctx, page } = await open(b, '', { viewport: { width: 440, height: 736 }, hasTouch: true }, { file: FILE, rows: many, hi: -1, pressed: -1 });
    await page.addStyleTag({ content: 'html, body { height: 836px !important; }' }); await page.evaluate(() => document.documentElement.style.setProperty('--chrome-bottom', '100px'));
    await page.mouse.move(220, 600); await page.mouse.wheel(0, 400); await page.waitForTimeout(200);
    const w = await page.evaluate(() => scrollY);
    await page.mouse.move(220, 100); await page.mouse.wheel(0, 400); await page.waitForTimeout(200);
    const w2 = await page.evaluate(() => scrollY);
    const hdr = await page.evaluate(() => { const r = document.getElementById('locationsHeader').getBoundingClientRect(); return (r.top + r.bottom) / 2; });
    await page.mouse.move(200, hdr); await page.mouse.wheel(0, 400); await page.waitForTimeout(200);
    const w3 = await page.evaluate(() => scrollY);
    const g = await page.evaluate(async () => { document.activeElement && document.activeElement.blur(); window.scrollTo(0, 100); await new Promise(r => setTimeout(r, 100)); return scrollY; });
    const bodyClip = await page.evaluate(async () => { const chip = document.querySelector('#filtersPanel button'); chip.focus(); await new Promise(r => setTimeout(r, 100)); const a = [scrollY, document.body.scrollTop]; chip.blur(); return a[0] + a[1]; });
    await page.evaluate(() => document.getElementById('collapseBtn').click()); await page.waitForTimeout(450);
    const t2 = await page.evaluate(async () => { const chip = document.querySelector('#filtersPanel button'); chip.focus(); await new Promise(r => setTimeout(r, 100)); return scrollY + document.body.scrollTop; });
    out.tallRoot = { wheelList: w, wheelMap: w2, wheelHeader: w3, programmaticAfterGuard: g, bodyScrollTop: bodyClip };
    ok('tall root: wheel on list/map/header never scrolls the page', w === 0 && w2 === 0 && w3 === 0, [w, w2, w3]);
    ok('tall root: programmatic scroll is reset by the guard', g === 0, g);
    ok('focusing a hidden (off-screen) filter chip leaves the page at 0 (guard)', bodyClip === 0 && t2 === 0, [bodyClip, t2]);
    await ctx.close(); }
  // standalone class pins chrome to 0 even if the formula would say otherwise
  { const { ctx, page } = await open(b, '', { viewport: { width: 440, height: 956 } }, { file: FILE, rows: many, hi: -1, pressed: -1 });
    const v = await page.evaluate(() => { const s = document.createElement('style'); s.textContent = ':root{--chrome-bottom:62px}'; document.head.appendChild(s);
      const p = document.createElement('div'); p.style.cssText = 'position:absolute;height:var(--chrome-bottom)'; document.body.appendChild(p); const a = p.getBoundingClientRect().height;
      document.documentElement.classList.add('standalone'); const c = p.getBoundingClientRect().height; return [a, c]; });
    ok('.standalone pins --chrome-bottom to 0', v[0] === 62 && v[1] === 0, v);
    const f = await page.evaluate(() => { const p = document.createElement('div'); p.style.cssText = 'position:absolute;height:max(0px, 100lvh - 100dvh)'; document.body.appendChild(p); return p.getBoundingClientRect().height; });
    ok('raw formula max(0, 100lvh-100dvh) = 0 in Chromium', f === 0, f);
    await ctx.close(); }
  await b.close();
  require('fs').writeFileSync(require('./lib').outPath('layout-geo.json'), JSON.stringify(out, null, 1));
  console.log(fails.length ? 'FAILS ' + fails.length + ': ' + fails.join(' | ') : 'ALL PASS');
})();
