// List-order (sort) suite: order keys, never-filters, menu behaviour + a11y, persistence,
// Nearest (mocked position, denied, no fix, no-jump threshold, no prompt on load),
// row gestures in a sorted list, popup-open 20/20, geometry, desktop rail, collapsed sheet.
// VENDOR=<dir> node sorttest.js
const { open, launch } = require('./harness');
const W = ms => new Promise(r => setTimeout(r, ms));
let pass = 0, total = 0; const fails = [];
const ok = (name, cond, info) => { total++; if (cond) pass++; else fails.push(name); console.log(`${cond ? 'PASS' : 'FAIL'} ${name}${info !== undefined ? ' ' + JSON.stringify(info) : ''}`); };

const ids = page => page.evaluate(() => [...document.querySelectorAll('#locationsList .location-card[data-id]')].map(e => e.dataset.id));
const shapeIds = page => page.evaluate(() => [...document.querySelectorAll('#locationsList [data-shape-id], #locationsList .shape-card')].map(e => e.dataset.shapeId || e.dataset.id));
const state = page => page.evaluate(() => ({ mode: sortMode, label: document.getElementById('sortBtn').getAttribute('aria-label'), mark: document.getElementById('sortBtn').classList.contains('not-default'),
  open: !document.getElementById('sortMenu').hidden, expanded: document.getElementById('sortBtn').getAttribute('aria-expanded'), live: document.getElementById('sortLive').textContent,
  stored: (() => { try { return localStorage.getItem('triplet.sortMode'); } catch (e) { return 'THROWS'; } })() }));
const tapEl = async (page, sel) => { const r = await page.evaluate(sel => { const b = document.querySelector(sel).getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }, sel); await page.touchscreen.tap(r.x, r.y); };
const pick = async (page, m) => { await tapEl(page, '#sortBtn'); await W(250); await page.tap(`.sort-opt[data-sort="${m}"]`); await W(350); };
// expected orders from the stub rows, independently of the app code
const expected = (page, mode, fix) => page.evaluate(([mode, fix]) => {
  const rows = window.__ROWS.filter(r => r.city === 'copenhagen');
  const cmp = (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base', numeric: true });
  const cats = Object.keys(CATEGORY_COLORS);
  const hv = (a, b) => { const R = 6371, t = x => x * Math.PI / 180, dl = t(b[0] - a[0]), dn = t(b[1] - a[1]); const h = Math.sin(dl / 2) ** 2 + Math.cos(t(a[0])) * Math.cos(t(b[0])) * Math.sin(dn / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
  const key = { az: () => 0, category: r => cats.indexOf(r.category), nearest: r => hv([fix.latitude, fix.longitude], [r.lat, r.lng]),
    left: r => (r.visited ? 2 : 0) + (r.starred ? 0 : 1), starred: r => (r.starred ? 0 : 2) + (r.visited ? 1 : 0) };
  if (mode === 'newest') return rows.map(r => r.id);
  return rows.slice().sort((a, b) => (key[mode](a) - key[mode](b)) || cmp(a, b)).map(r => r.id);
}, [mode, fix]);
async function rowPt(page, id, sel = '.row-main') {
  await page.evaluate(id => document.querySelector(`.location-card[data-id="${id}"]`).scrollIntoView({ block: 'center' }), id); await W(150);
  return page.evaluate(([id, sel]) => { const b = document.querySelector(`.location-card[data-id="${id}"] ${sel}`).getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, l: b.x }; }, [id, sel]);
}
async function stroke(page, from, to, n = 14) {
  const c = await page.context().newCDPSession(page);
  await c.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: from.x, y: from.y }] });
  for (let i = 1; i <= n; i++) { await c.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: from.x + (to.x - from.x) * i / n, y: from.y }] }); await W(16); }
  await c.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}
const JAEGER = { latitude: 55.6925, longitude: 12.5445 };   // Jægersborggade

(async () => {
  const b = await launch();
  // ---------------------------------------------------------------- defaults, keys, never-filters
  { const { ctx, page, errors } = await open(b, {});
    let s = await state(page);
    ok('S1 first load: A-Z, label "Sort list: A–Z", no mark, nothing stored', s.mode === 'az' && s.label === 'Sort list: A–Z' && !s.mark && s.stored === null, s);
    ok('S2 A-Z order = name A-Z', JSON.stringify(await ids(page)) === JSON.stringify(await expected(page, 'az')));
    const base = (await ids(page)).slice().sort().join();
    for (const m of ['category', 'left', 'starred', 'newest']) {
      await pick(page, m);
      const got = await ids(page);
      const ge = await page.evaluate(() => { const cards = [...document.querySelectorAll('#locationsList .location-card[data-id]')], cat = id => locations.find(l => l.id === id).category;
        const want = cards.map((c, i) => i < cards.length - 1 && cat(c.dataset.id) !== cat(cards[i + 1].dataset.id)); const has = cards.map(c => c.classList.contains('group-end'));
        return { ok: sortMode === 'category' ? want.join() === has.join() && want.some(Boolean) : !has.some(Boolean), n: has.filter(Boolean).length, color: (cards.find(c => c.classList.contains('group-end')) ? getComputedStyle(cards.find(c => c.classList.contains('group-end'))).borderBottomColor : null), h: cards.every(c => c.getBoundingClientRect().height === 56) }; });
      ok(`S3b ${m}: category runs end in an ink hairline only in Category order; rows stay 56px`, ge.ok && ge.h && (m !== 'category' || ge.color === 'rgb(90, 86, 76)'), ge);
      ok(`S3 ${m}: order matches its key`, JSON.stringify(got) === JSON.stringify(await expected(page, m)), got.slice(0, 6));
      ok(`S4 ${m}: same membership as A-Z (reorders, never filters)`, got.slice().sort().join() === base);
      s = await state(page);
      ok(`S5 ${m}: aria-label current, mark on, persisted, announced`, s.label === `Sort list: ${await page.evaluate(m => SORT_LABELS[m], m)}` && s.mark && s.stored === m && /^Sort: /.test(s.live), s);
    }
    // category filter off: every mode still shows exactly the filtered set
    await page.evaluate(() => { filters.categories.shopping = false; updateUI(); }); await W(100);
    const filtered = (await ids(page)).slice().sort().join();
    let same = true; for (const m of ['az', 'category', 'left', 'starred', 'newest']) { await page.evaluate(m => setSortMode(m, { announce: false }), m); if ((await ids(page)).slice().sort().join() !== filtered) same = false; }
    ok('S6 with a category filter on, every order shows exactly the filtered set', same && !filtered.includes('kin'));
    await page.evaluate(() => { filters.categories.shopping = true; setSortMode('az'); }); await W(100);
    const sh = await page.evaluate(() => [...document.querySelectorAll('#locationsList > *')].map(e => e.querySelector('h3') && e.querySelector('h3').textContent).filter(Boolean).slice(-2));
    ok('S7 shapes keep their own block after the pins, A-Z', JSON.stringify(sh) === JSON.stringify(['Istedgade', 'Vesterbro']), sh);
    ok('S8 no page errors', !errors.length, errors);
    await ctx.close(); }

  // ---------------------------------------------------------------- menu behaviour + a11y
  { const { ctx, page, errors } = await open(b, {});
    await page.tap('#toggleFiltersBtn'); await W(400);
    await tapEl(page, '#sortBtn'); await W(300);
    const m = await page.evaluate(() => { const menu = document.getElementById('sortMenu'), r = menu.getBoundingClientRect(), br = document.getElementById('sortBtn').getBoundingClientRect(), btn = document.getElementById('sortBtn'), cs = getComputedStyle(btn);
      return { role: menu.getAttribute('role'), items: [...menu.querySelectorAll('[role="menuitemradio"]')].map(e => [e.dataset.sort, e.getAttribute('aria-checked')]), focus: document.activeElement.dataset.sort,
        above: r.bottom <= br.top, inView: r.top >= 0 && r.left >= 0 && r.right <= innerWidth, panel: document.getElementById('filtersPanel').classList.contains('visible'),
        opacity: cs.opacity, bg: cs.backgroundColor, fg: cs.color, rowH: [...menu.querySelectorAll('.sort-opt')].map(e => e.getBoundingClientRect().height),
        hit: [...menu.querySelectorAll('.sort-opt')].map(e => { const a = getComputedStyle(e, '::before'); return e.getBoundingClientRect().height - parseFloat(a.top) - parseFloat(a.bottom); }),
        flush: Math.round(document.getElementById('locationsHeader').getBoundingClientRect().top - r.bottom), width: r.width,
        fits: [...menu.querySelectorAll('.sort-opt')].every(e => e.scrollWidth <= e.clientWidth), cap: (menu.querySelector('.sort-cap') || {}).textContent,
        attr: getComputedStyle(document.querySelector('.leaflet-control-attribution')).visibility,
        check: [...menu.querySelectorAll('.sort-opt')].map(e => getComputedStyle(e.querySelector('.sort-check')).visibility).join() }; });
    ok('M1 role=menu, 6 menuitemradio in order, exactly one aria-checked (A-Z)', m.role === 'menu' && m.items.map(x => x[0]).join() === 'az,category,nearest,left,starred,newest' && m.items.filter(x => x[1] === 'true').length === 1 && m.items[0][1] === 'true', m.items);
    ok('M2 focus moves to the checked item on open', m.focus === 'az', m.focus);
    ok('M3 opens upward over the map, fully on screen', m.above && m.inView, m);
    ok('M4 opening the menu closed the filters panel', !m.panel);
    ok('M5 open ⇅ = ink tile with a paper glyph, not greyed', m.opacity === '1' && m.bg === 'rgb(18, 41, 63)' && m.fg === 'rgb(242, 235, 221)', { opacity: m.opacity, bg: m.bg, fg: m.fg });
    ok('M6 rows 40px, every target 44px', m.rowH.every(h => h === 40) && m.hit.every(h => h === 44), { rowH: m.rowH, hit: m.hit });
    ok('M6b slip: its 2px ink offset ends exactly on the band line, fixed 200px, caption "Sort by", attribution stepped out, ✓ only on A–Z', m.flush === 2 && m.width === 200 && m.cap === 'Sort by' && m.attr === 'hidden' && m.check === 'visible,hidden,hidden,hidden,hidden,hidden', m);
    await page.keyboard.press('ArrowDown'); let f = await page.evaluate(() => document.activeElement.dataset.sort);
    await page.keyboard.press('ArrowUp'); await page.keyboard.press('ArrowUp'); const f2 = await page.evaluate(() => document.activeElement.dataset.sort);
    await page.keyboard.press('Home'); const f3 = await page.evaluate(() => document.activeElement.dataset.sort);
    await page.keyboard.press('End'); const f4 = await page.evaluate(() => document.activeElement.dataset.sort);
    ok('M7 arrows move + wrap, Home/End', f === 'category' && f2 === 'newest' && f3 === 'az' && f4 === 'newest', [f, f2, f3, f4]);
    await page.keyboard.press('Escape'); await W(100);
    let s = await state(page); const fb = await page.evaluate(() => document.activeElement.id);
    ok('M8 Escape closes; focus back on ⇅; aria-expanded false', !s.open && s.expanded === 'false' && fb === 'sortBtn', { s, fb });
    await tapEl(page, '#sortBtn'); await W(250); await tapEl(page, '#sortBtn'); await W(150); s = await state(page);
    ok('M9 a second ⇅ tap closes', !s.open && s.expanded === 'false');
    // outside tap swallowed: tap a row while open -> closes, nothing navigates, map untouched
    await tapEl(page, '#sortBtn'); await W(250);
    const before = await page.evaluate(() => ({ hl: highlightedId, z: map.getZoom(), c: map.getCenter().toString() }));
    const p = await rowPt(page, (await ids(page))[1]).catch(() => null);
    await page.touchscreen.tap(200, 780); await W(1200);
    const after = await page.evaluate(() => ({ hl: highlightedId, z: map.getZoom(), c: map.getCenter().toString(), open: !document.getElementById('sortMenu').hidden, popup: !!document.querySelector('.leaflet-popup') }));
    ok('M10 outside tap only dismisses (swallowed: no navigation, no popup, map unchanged)', !after.open && after.hl === before.hl && after.z === before.z && after.c === before.c && !after.popup, { before, after });
    await tapEl(page, '#sortBtn'); await W(250);
    await tapEl(page, '#sortBtn'); await W(150);   // closes
    await tapEl(page, '#sortBtn'); await W(250);
    await page.evaluate(() => document.getElementById('toggleFiltersBtn').click()); await W(300);
    const x = await page.evaluate(() => ({ open: !document.getElementById('sortMenu').hidden, panel: document.getElementById('filtersPanel').classList.contains('visible') }));
    ok('M11 opening the filters panel closes the menu', !x.open && x.panel, x);
    await page.evaluate(() => document.getElementById('toggleFiltersBtn').click()); await W(300);
    // keyboard select
    await page.focus('#sortBtn'); await page.keyboard.press('Enter'); await W(200); await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter'); await W(300);
    s = await state(page); const fb2 = await page.evaluate(() => document.activeElement.id);
    ok('M12 keyboard: Enter opens, arrow + Enter picks Category, focus returns to ⇅', s.mode === 'category' && !s.open && fb2 === 'sortBtn', { s, fb2 });
    ok('M13 live region announces the new order', s.live === 'Sort: Category', s.live);
    const anim = await page.evaluate(async () => { await setSortMode('az', { announce: false }); document.getElementById('sortBtn').click(); const a = document.getElementById('sortMenu').getAnimations()[0]; const d = a ? a.effect.getComputedTiming().duration : 0; const t0 = performance.now(); if (a) await a.finished; return { d, real: performance.now() - t0 }; });
    ok('M14 open motion: 140ms slip (real-time run finishes within one frame of it)', anim.d === 140 && anim.real >= 100 && anim.real <= 190, anim);
    ok('M15 no page errors', !errors.length, errors);
    await ctx.close(); }
  { const { ctx, page } = await open(b, { reduced: true });
    await tapEl(page, '#sortBtn'); await W(100);
    const n = await page.evaluate(() => document.getElementById('sortMenu').getAnimations().length);
    ok('M16 reduced motion: the menu appears with no animation', n === 0, n);
    await ctx.close(); }

  // ---------------------------------------------------------------- persistence
  { const { ctx, page } = await open(b, { storage: { 'triplet.sortMode': 'starred' } });
    const s = await state(page);
    ok('P1 stored order restored on load (Starred)', s.mode === 'starred' && s.mark && JSON.stringify(await ids(page)) === JSON.stringify(await expected(page, 'starred')), s);
    await pick(page, 'left'); await page.reload(); await W(900);
    ok('P2 a pick survives a reload', (await state(page)).mode === 'left');
    await ctx.close(); }
  { const { ctx, page } = await open(b, { storage: { 'triplet.sortMode': 'bogus' } });
    ok('P3 an unknown stored value falls back to A-Z', (await state(page)).mode === 'az');
    await ctx.close(); }
  { const { ctx, page, errors } = await open(b, { init: () => { const t = () => { throw new Error('blocked'); }; Storage.prototype.getItem = t; Storage.prototype.setItem = t; } });
    await pick(page, 'category'); const s = await page.evaluate(() => sortMode);
    ok('P4 storage that throws: loads A-Z, picking still works, no errors', s === 'category' && !errors.length, { s, errors });
    await ctx.close(); }

  // ---------------------------------------------------------------- Nearest
  { const { ctx, page, errors } = await open(b, { geo: JAEGER });
    await pick(page, 'nearest'); await W(600);
    let got = await ids(page); const exp = await expected(page, 'nearest', JAEGER);
    ok('N1 Nearest with a mocked position: ascending distance', JSON.stringify(got) === JSON.stringify(exp), got.slice(0, 5));
    const meta = await page.evaluate(id => document.querySelector(`.location-card[data-id="${id}"] .row-meta`).textContent, got[0]);
    ok('N2 distance leads the meta in Nearest', /^\d+ m · /.test(meta), meta);
    const dc = await page.evaluate(id => getComputedStyle(document.querySelector(`.location-card[data-id="${id}"] .row-dist`)).color, got[0]);
    ok('N2b distance in ink (not grey meta)', dc === 'rgb(26, 26, 24)', dc);
    ok('N3 membership unchanged (never filters)', got.slice().sort().join() === (await expected(page, 'az')).slice().sort().join());
    const fix0 = await page.evaluate(() => sortFix);
    // ~100 m east: below the 150 m threshold -> no re-sort
    await ctx.setGeolocation({ latitude: JAEGER.latitude, longitude: JAEGER.longitude + 0.0016 }); await W(700);
    const fix1 = await page.evaluate(() => ({ sortFix, lastFix })); const got1 = await ids(page);
    ok('N4 moved ~100 m: position taken, order NOT re-sorted (no jump)', fix1.lastFix.lng !== fix0.lng && fix1.sortFix.lng === fix0.lng && JSON.stringify(got1) === JSON.stringify(got), fix1);
    // ~2 km south-east: re-sorts to the new position
    const far = { latitude: 55.6760, longitude: 12.5690 };
    await ctx.setGeolocation(far); await W(700);
    got = await ids(page);
    const km = await page.evaluate(() => [...document.querySelectorAll('.row-dist')].map(e => e.textContent));
    const longRow = await page.evaluate(() => { const e = document.querySelector('.location-card[data-id="lng"]'), m = e.querySelector('.row-meta'), h = e.querySelector('h3'), d = m.querySelector('.row-dist');
      return { h3Trunc: h.scrollWidth > h.clientWidth, dist: d.textContent, distVisible: d.getBoundingClientRect().right <= m.getBoundingClientRect().right, height: e.getBoundingClientRect().height }; });
    ok('N5b km format ("1.2 km") and a long street name: name ellipsizes, distance stays whole, row 56px', km.some(t => /^\d\.\d km$/.test(t)) && longRow.h3Trunc && longRow.distVisible && longRow.height === 56, { km: km.slice(0, 8), longRow });
    ok('N5 moved past the threshold: re-sorted to the new position', JSON.stringify(got) === JSON.stringify(await expected(page, 'nearest', far)), got.slice(0, 4));
    await pick(page, 'az');
    const w = await page.evaluate(() => ({ watch: nearestWatch, meta: document.querySelector('#locationsList .location-card .row-meta').textContent }));
    ok('N6 leaving Nearest stops the watcher and drops the distance', w.watch === null && !/ m · | km · /.test(w.meta), w);
    ok('N7 no page errors', !errors.length, errors);
    await ctx.close(); }
  { const { ctx, page, errors } = await open(b, { init: () => { navigator.geolocation.watchPosition = (ok, err) => { setTimeout(() => err({ code: 1, message: 'denied' }), 80); return 9; }; } });   // user denies the prompt
    await pick(page, 'nearest'); await W(900);
    const s = await state(page);
    const r = await page.evaluate(() => { const n = document.getElementById('sortNote'), nr = n.getBoundingClientRect(), hd = document.getElementById('locationsHeader').getBoundingClientRect();
      const hits = ['.leaflet-control-zoom', '#floatingAddBtn', '#accountBtn'].map(q => document.querySelector(q)).filter(e => e && e.offsetParent !== null).map(e => e.getBoundingClientRect()).some(c => !(c.right <= nr.left || c.left >= nr.right || c.bottom <= nr.top || c.top >= nr.bottom));
      return { banner: n.textContent, shown: !n.hidden, docked: Math.round(hd.top - nr.bottom) === 2, attr: getComputedStyle(document.querySelector('.leaflet-control-attribution')).visibility, overlapsControls: hits, errorBanner: document.getElementById('error').classList.contains('show') }; });
    await tapEl(page, '#sortBtn'); await W(250);
    const row = await page.evaluate(() => { const e = document.querySelector('.sort-opt[data-sort="nearest"]'); return { off: e.classList.contains('is-off'), why: e.querySelector('.sort-why').textContent, color: getComputedStyle(e).color }; });
    ok('N8 denied: visibly falls back to A-Z (order, label, banner, announcement)', s.mode === 'az' && JSON.stringify(await ids(page)) === JSON.stringify(await expected(page, 'az')) && r.shown && r.banner === 'Location off — sorted A–Z' && r.docked && r.attr === 'hidden' && !r.overlapsControls && !r.errorBanner && /Location unavailable/.test(s.live), { s, r });
    ok('N9 denied: Nearest greys out with a short reason', row.off && row.why === 'Location off' && row.color === 'rgb(90, 86, 76)', row);
    ok('N10 no page errors', !errors.length, errors);
    await ctx.close(); }
  { const { ctx, page } = await open(b, { init: () => { navigator.geolocation.watchPosition = (ok, err) => { setTimeout(() => err({ code: 2, message: 'unavailable' }), 50); return 7; }; } });
    await pick(page, 'nearest'); await W(500);
    await tapEl(page, '#sortBtn'); await W(250);
    const r = await page.evaluate(() => ({ mode: sortMode, why: document.querySelector('.sort-opt[data-sort="nearest"] .sort-why').textContent }));
    ok('N11 no fix: falls back to A-Z, reason "No fix"', r.mode === 'az' && r.why === 'No fix', r);
    await ctx.close(); }
  { const { ctx, page } = await open(b, { clock: true, init: () => { navigator.geolocation.watchPosition = () => 5; } });   // prompt never answered
    await pick(page, 'nearest'); await W(300);
    const p1 = await page.evaluate(() => ({ mode: sortMode, state: nearestState, loading: document.getElementById('sortBtn').classList.contains('loading') }));
    await page.clock.fastForward(21000); await W(300);
    const p2 = await page.evaluate(() => ({ mode: sortMode, why: nearestWhy }));
    ok('N15 no answer at all: shows "locating" (list stays A-Z), then after 20s falls back with "No fix"', p1.mode === 'nearest' && p1.state === 'pending' && p1.loading && p2.mode === 'az' && p2.why === 'No fix', { p1, p2 });
    await ctx.close(); }
  { const { ctx, page } = await open(b, { storage: { 'triplet.sortMode': 'nearest' }, init: () => { window.__geoCalls = 0; const g = navigator.geolocation; for (const k of ['watchPosition', 'getCurrentPosition']) { const f = g[k].bind(g); g[k] = (...a) => { window.__geoCalls++; return f(...a); }; } } });
    await W(500); const r = await page.evaluate(() => ({ mode: sortMode, calls: __geoCalls }));
    ok('N12 stored Nearest, permission not granted: no location request on load, shows A-Z', r.mode === 'az' && r.calls === 0, r);
    await ctx.close(); }
  { const { ctx, page } = await open(b, { storage: { 'triplet.sortMode': 'nearest' }, geo: JAEGER });
    await W(800); const r = await page.evaluate(() => ({ mode: sortMode, fix: !!sortFix }));
    ok('N13 stored Nearest with permission already granted: resumes silently', r.mode === 'nearest' && r.fix, r);
    await ctx.close(); }
  { const { ctx, page } = await open(b, { geo: JAEGER });
    await page.tap('#centerMeBtn'); await W(900);
    const r = await page.evaluate(() => ({ lastFix, watch: nearestWatch }));
    ok('N14 center-me feeds the shared fix; no watcher outside Nearest', !!r.lastFix && r.watch === null, r);
    await ctx.close(); }

  // ---------------------------------------------------------------- row gestures in a sorted list
  { const { ctx, page, errors } = await open(b, { storage: { 'triplet.sortMode': 'starred' } });
    const order0 = await ids(page); const id = order0[order0.length - 1];   // an unstarred row at the bottom
    const p = await rowPt(page, id); const samples = [];
    const c = await page.context().newCDPSession(page);
    await c.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: p.l + 10, y: p.y }] });
    for (let i = 1; i <= 12; i++) { await c.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: p.l + 10 + 110 * i / 12, y: p.y }] }); await W(16); samples.push((await ids(page)).indexOf(id)); }
    await c.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    for (let i = 0; i < 20; i++) { await W(50); samples.push((await ids(page)).indexOf(id)); }
    await W(1200);
    const fin = await page.evaluate(id => ({ starred: locations.find(l => l.id === id).starred, idx: [...document.querySelectorAll('#locationsList .location-card')].findIndex(e => e.dataset.id === id), held: starHeld.size }), id);
    const firstMove = samples.findIndex(i => i !== order0.length - 1);
    ok('G1 star stroke in Starred order: row holds its place through the gesture, then moves up once settled', fin.starred && fin.idx < order0.length - 1 && fin.held === 0 && firstMove >= 12, { firstMove, fin });
    ok('G2 ...and lands where the Starred key puts it', JSON.stringify(await ids(page)) === JSON.stringify(await page.evaluate(() => sortLocations(visibleLocations()).map(l => l.id))));
    ok('G3 no page errors', !errors.length, errors);
    await ctx.close(); }
  { const { ctx, page, errors } = await open(b, { storage: { 'triplet.sortMode': 'left' } });
    const order0 = await ids(page); const id = order0[0];
    const p = await rowPt(page, id, '.delete-btn');
    await stroke(page, p, { x: p.x - 110, y: p.y }, 12); await W(1500);
    const fin = await page.evaluate(id => ({ visited: locations.find(l => l.id === id).visited, idx: [...document.querySelectorAll('#locationsList .location-card')].findIndex(e => e.dataset.id === id), del: locations.some(l => l.id === id) }), id);
    ok('G4 visit stroke in What\'s left order: row visited, sinks after settle, not deleted', fin.visited && fin.idx > 0 && fin.del, fin);
    ok('G5 no page errors', !errors.length, errors);
    await ctx.close(); }

  // ---------------------------------------------------------------- popup-open 20/20 across orders
  { const { ctx, page, errors } = await open(b, {}); let hits = 0, n = 0; const miss = [];
    for (const m of ['az', 'category', 'left', 'starred', 'newest']) {
      await page.evaluate(m => setSortMode(m, { announce: false }), m);
      const list = await ids(page);
      for (const id of [list[0], list[5], list[11], list[list.length - 1]]) {
        n++; await page.evaluate(() => map.closePopup()); const pt = await rowPt(page, id); await page.touchscreen.tap(pt.x, pt.y); await W(1800);
        const r = await page.evaluate(id => ({ z: map.getZoom(), title: (document.querySelector('.leaflet-popup .popup-title') || {}).textContent || null, name: locations.find(l => l.id === id).name }), id);
        if (r.z >= 14 && r.title === r.name) hits++; else miss.push([m, id, r]);
      }
    }
    ok(`R1 popup-open ${hits}/${n} (row tap navigates + popup, every order)`, hits === n && n === 20, miss);
    ok('R2 no page errors', !errors.length, errors);
    await ctx.close(); }

  // ---------------------------------------------------------------- geometry
  { const { ctx, page } = await open(b, {});
    const g = await page.evaluate(() => { const r = s => document.querySelector(s).getBoundingClientRect(); const btn = document.getElementById('sortBtn'), a = getComputedStyle(btn, '::after');
      const zoneL = r('#sortBtn').left + parseFloat(a.left), zoneR = r('#sortBtn').right - parseFloat(a.right), zoneT = r('#sortBtn').top + parseFloat(a.top), zoneB = r('#sortBtn').bottom - parseFloat(a.bottom);
      const h2 = document.querySelector('#locationsHeader h2');
      return { header: r('#locationsHeader').height, zone: [zoneR - zoneL, zoneB - zoneT], inert: r('#toggleFiltersBtn').left - zoneR, clearCollapse: zoneL - r('#collapseBtn').right, h2fits: h2.scrollWidth <= h2.clientWidth, rows: [...document.querySelectorAll('.location-card')].slice(0, 5).map(e => e.getBoundingClientRect().height) }; });
    ok('X1 header one row, 57px (56 + rule), unchanged', g.header === 57, g.header);
    ok('X2 ⇅ tap zone >= 44 x 44 (50 x 56)', g.zone[0] >= 44 && g.zone[1] >= 44, g.zone);
    ok('X3 inert margin ⇅ zone -> filters box 4-8px', g.inert >= 4 && g.inert <= 8, g.inert);
    ok('X4 clear of the collapse button', g.clearCollapse > 20, g.clearCollapse);
    ok('X5 rows still 56.00px', g.rows.every(h => h === 56), g.rows);
    let fits = []; for (const c of ['copenhagen', 'stockholm', null]) { fits.push(await page.evaluate(c => { setActiveCity ? setActiveCity(c === null ? ALL_CITIES : c) : 0; const h2 = document.querySelector('#locationsHeader h2'); return [h2.textContent, h2.scrollWidth <= h2.clientWidth]; }, c)); }
    ok('X6 long titles fit untruncated (Copenhagen / Stockholm / All cities)', fits.every(f => f[1]), fits);
    await page.evaluate(() => setActiveCity('copenhagen'));
    await page.tap('#collapseBtn'); await W(500); await tapEl(page, '#sortBtn'); await W(300);
    const cg = await page.evaluate(() => { const m = document.getElementById('sortMenu').getBoundingClientRect(), h = document.getElementById('locationsHeader').getBoundingClientRect(); return { above: m.bottom <= h.top, inView: m.top >= 0, hdrVisible: h.bottom <= innerHeight + 1 }; });
    ok('X7 collapsed sheet: ⇅ visible, menu opens above it, on screen', cg.above && cg.inView && cg.hdrVisible, cg);
    await ctx.close(); }
  { const { ctx, page, errors } = await open(b, { w: 1280, h: 800, touch: false });
    await page.click('#sortBtn'); await W(300);
    const d = await page.evaluate(() => { const m = document.getElementById('sortMenu').getBoundingClientRect(), br = document.getElementById('sortBtn').getBoundingClientRect(), h2 = document.querySelector('#locationsHeader h2').getBoundingClientRect();
      const t = document.querySelector('#locationsHeader h2'); return { below: m.top >= br.bottom, inView: m.bottom <= innerHeight && m.right <= innerWidth && m.left >= 0, h2left: h2.left, fits: t.scrollWidth <= t.clientWidth, title: t.textContent }; });
    ok('D0 desktop rail: the title fits untruncated beside four icons', d.fits, d.title);
    const fitsAll = await page.evaluate(() => [['stockholm'], [ALL_CITIES]].map(([c]) => { setActiveCity(c); const t = document.querySelector('#locationsHeader h2'); return [t.textContent, t.scrollWidth <= t.clientWidth]; }));
    ok('D0b desktop rail: Stockholm / All cities titles fit', fitsAll.every(f => f[1]), fitsAll);
    await page.evaluate(() => setActiveCity('copenhagen'));
    await page.click('.sort-opt[data-sort="category"]'); await W(300);
    ok('D1 desktop rail: menu opens below ⇅ (no room above), on screen; title stays on the 56px spine', d.below && d.inView && Math.round(d.h2left) === 56, d);
    ok('D2 desktop: mouse pick works', (await page.evaluate(() => sortMode)) === 'category' && !errors.length, errors);
    await ctx.close(); }

  await b.close();
  console.log(`\n${pass}/${total} passed${fails.length ? ' -- FAILED: ' + fails.join(' | ') : ''}`);
  process.exit(fails.length ? 1 : 0);
})();
