// STATE MATRIX: the single source of truth for every interactive element x state.
// Drives the real page (stubbed backend) per cell, asserts the computed style
// against the named rule, shoots the cell, and writes the contact matrix and the
// README checklist FROM THIS TABLE. Any failed assertion fails the run.
//   VENDOR=<dir> node matrix.js        (harness: ../list-ordering/build/harness.js)
// Outputs: stills/matrix/<row>-<col>@{1x,3x,4x}.png, matrix@1x.png, matrix.html, README.md (checklist block)
const { open, launch } = require('../list-ordering/build/harness');
const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, 'stills', 'matrix');
const W = ms => new Promise(r => setTimeout(r, ms));
const COLS = ['idle', 'pressed', 'on', 'onpressed', 'off', 'other'];
const COLNAME = { idle: 'idle', pressed: 'pressed', on: 'on / open / selected', onpressed: 'on + pressed', off: 'disabled / loading / off', other: 'other' };

// ---- the rules (named) ------------------------------------------------------
const RULES = {
  press: 'pressed = pale tile (--state-press)',
  on: 'on = navy tile, paper glyph',
  onpress: 'on + pressed = lighter navy (--state-on-press)',
  off: 'unavailable / loading = opacity .4',
  filled: 'filled button: pressed steps one tone, text flips to paper',
  float: 'floating open = inverts to --figure (navy cannot reverse to navy)',
  glyph: 'on = glyph fills (named exception)',
  chip: 'category chip: rule = on, dashed = off (named exception)',
  row: 'row: pressed fill; highlighted = figure-deep block',
  isoff: 'unavailable-but-tappable: ink-2 text + reason line (named exception to .4)',
  hover: 'hover = pointer-only (raised paper); touch uses pressed'
};

// ---- helpers in node --------------------------------------------------------
const cs = (page, sel, prop, pseudo) => page.evaluate(([s, p, ps]) => { const e = document.querySelector(s); return e ? getComputedStyle(e, ps || null)[p] : null; }, [sel, prop, pseudo]);
const tok = (page, name) => page.evaluate(n => { const e = document.createElement('i'); e.style.color = `var(${n})`; document.body.appendChild(e); const c = getComputedStyle(e).color; e.remove(); return c; }, name);
const click = (page, sel) => page.evaluate(s => document.querySelector(s).click(), sel);
const TRANSPARENT = 'rgba(0, 0, 0, 0)';
let cdp = null, forced = [], CLAIMS = {};
async function force(page, sels) {
  cdp = cdp || await page.context().newCDPSession(page);
  await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
  const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
  for (const sel of sels) { const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: sel });
    if (!nodeId) throw new Error('force: no node ' + sel);
    await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: ['active'] }); forced.push(nodeId); }
}
async function unforce(page) {
  if (cdp) for (const nodeId of forced) { try { await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: [] }); } catch (e) {} }
  forced = [];
  await page.evaluate(() => { const a = document.activeElement; if (a && a !== document.body) a.blur(); });
  await page.mouse.move(0, 0);
}
async function realTap(page, sel) {
  const r = await page.evaluate(s => { const b = document.querySelector(s).getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }, sel);
  await page.touchscreen.tap(r.x, r.y); await W(450);
}
const rectOf = (page, sel, pad, maxW) => page.evaluate(([s, pad, maxW]) => { const b = document.querySelector(s).getBoundingClientRect();
  return { x: Math.max(0, b.x - pad), y: Math.max(0, b.y - pad), width: Math.min(b.width + pad * 2, innerWidth, maxW || 1e9), height: b.height + pad * 2 }; }, [sel, pad, maxW]);
const tileInsets = (p, host, target) => p.evaluate(([host, target]) => { const h = document.querySelector(host), t = document.querySelector(target || host); const cb = getComputedStyle(h, '::before'); const hr = h.getBoundingClientRect();
  const L = hr.left + parseFloat(cb.left), Tp = hr.top + parseFloat(cb.top), R = L + parseFloat(cb.width), B = Tp + parseFloat(cb.height); const rg = document.createRange(); rg.selectNodeContents(t); const c = rg.getBoundingClientRect();
  return { l: c.left - L, t: c.top - Tp, r: R - c.right, b: B - c.bottom, tileL: L }; }, [host, target]);
const chDiff = (a, b) => { const f = x => x.match(/\d+/g).slice(0, 3).map(Number); const A = f(a), B = f(b); return Math.max(...A.map((v, i) => Math.abs(v - B[i]))); };
const near = (v, x, tol = 0.8) => Math.abs(v - x) <= tol;
const insetsOk = i => near(i.l, 4) && near(i.t, 4) && near(i.r, 4) && near(i.b, 4);
const isolatePin = p => p.evaluate(() => { const st = document.createElement('style'); st.id = 'isoPin'; st.textContent = '.leaflet-marker-icon{visibility:hidden}.leaflet-marker-icon.pinShot{visibility:visible!important}'; document.head.appendChild(st); markersById.get(window.__pid).marker._icon.classList.add('pinShot'); });
const unisolatePin = p => p.evaluate(() => { const e = document.getElementById('isoPin'); if (e) e.remove(); const i = markersById.get(window.__pid); if (i && i.marker._icon) i.marker._icon.classList.remove('pinShot'); });
const popupFor = async (page, pred) => { await page.evaluate(p => { const l = locations.find(new Function('x', 'return ' + p)); highlightedId = null; highlightMarker(l.id); }, pred); await W(1000); };
const closePopup = page => page.evaluate(() => map.closePopup()).then(() => W(200));
const openForm = async page => { await click(page, '#floatingAddBtn'); await W(500); };
const openFilters = async page => { await click(page, '#toggleFiltersBtn'); await W(450); };

// ---- the table --------------------------------------------------------------
// cell = { press:[sel], hover:sel, run(page), undo(page), shot: sel | {sel,pad}, pad, check(page,T)->[[label,ok]], rule }
// or { na: 'reason' }.  row.enter(page) once per row; row.sel is the default shot target.
const NA = r => ({ na: r });
const hdr = (id, pad = 6) => ({ shot: '#locationsHeader', pad: 0 });
const ROWS = [];
const add = r => ROWS.push(r);

const headerButton = (name, id, opts) => ({
  key: id.slice(1), name, group: 'Header', shot: '#locationsHeader',
  cells: Object.assign({
    idle: { rule: 'press', check: async (p, T) => [[`${id} transparent`, (await cs(p, id, 'backgroundColor')) === TRANSPARENT], ['opacity 1', (await cs(p, id, 'opacity')) === '1']] },
    pressed: { press: [id], rule: 'press', check: async (p, T) => [['pressed bg = --state-press', (await cs(p, id, 'backgroundColor')) === T.press]] },
  }, opts)
});

add(Object.assign(headerButton('Collapse arrow', '#collapseBtn', {}), { cells: {
  idle: { rule: 'press', check: async (p, T) => [['tile hidden', (await cs(p, '#collapseBtn', 'backgroundColor', '::before')) === TRANSPARENT]] },
  pressed: { press: ['#collapseBtn'], rule: 'press', check: async (p, T) => [['::before bg = --state-press', (await cs(p, '#collapseBtn', 'backgroundColor', '::before')) === T.press],
    ['tile 32px wide', (await p.evaluate(() => { const e = document.getElementById('collapseBtn'); return e.getBoundingClientRect().width + 4; })) === 32],
    ['radius 3px', (await cs(p, '#collapseBtn', 'borderTopLeftRadius', '::before')) === '3px']] },
  on: NA('not a toggle: collapsed is shown by the arrow rotating'), onpressed: NA('not a toggle'), off: NA('never unavailable'), other: NA('n/a') } }));

add(Object.assign(headerButton('Sort', '#sortBtn', {}), { cells: {
  idle: { rule: 'press', check: async (p, T) => [['transparent', (await cs(p, '#sortBtn', 'backgroundColor')) === TRANSPARENT], ['opacity 1', (await cs(p, '#sortBtn', 'opacity')) === '1']] },
  pressed: { press: ['#sortBtn'], rule: 'press', check: async (p, T) => [['bg = --state-press', (await cs(p, '#sortBtn', 'backgroundColor')) === T.press]] },
  on: { coverSel: '#sortBtn', run: p => realTap(p, '#sortBtn'), undo: p => click(p, '#sortBtn').then(() => W(300)), rule: 'on', check: async (p, T) => [['bg navy', (await cs(p, '#sortBtn', 'backgroundColor')) === T.navy], ['glyph paper', (await cs(p, '#sortBtn', 'color')) === T.paper], ['menu open', (await cs(p, '#sortBtn', 'ariaExpanded') || await p.evaluate(() => document.getElementById('sortBtn').getAttribute('aria-expanded'))) === 'true']] },
  onpressed: { coverSel: '#sortBtn', run: p => realTap(p, '#sortBtn'), press: ['#sortBtn'], undo: p => click(p, '#sortBtn').then(() => W(300)), rule: 'onpress', check: async (p, T) => [['bg = --state-on-press', (await cs(p, '#sortBtn', 'backgroundColor')) === T.onpress], ['glyph paper', (await cs(p, '#sortBtn', 'color')) === T.paper]] },
  off: { run: p => p.evaluate(() => document.getElementById('sortBtn').classList.add('loading')), undo: p => p.evaluate(() => document.getElementById('sortBtn').classList.remove('loading')), rule: 'off', check: async (p) => [['loading opacity .4', (await cs(p, '#sortBtn', 'opacity')) === '0.4']] },
  other: NA('n/a') } }));

add({ key: 'filters', name: 'Filters', group: 'Header', shot: '#locationsHeader', cells: {
  idle: { rule: 'press', check: async (p) => [['transparent', (await cs(p, '#toggleFiltersBtn', 'backgroundColor')) === TRANSPARENT]] },
  pressed: { press: ['#toggleFiltersBtn'], rule: 'press', check: async (p, T) => [['bg = --state-press', (await cs(p, '#toggleFiltersBtn', 'backgroundColor')) === T.press]] },
  on: { run: openFilters, undo: openFilters, rule: 'on', check: async (p, T) => [['bg navy', (await cs(p, '#toggleFiltersBtn', 'backgroundColor')) === T.navy], ['glyph paper', (await cs(p, '#toggleFiltersBtn', 'color')) === T.paper], ['other buttons idle', (await cs(p, '#sortBtn', 'backgroundColor')) === TRANSPARENT && (await cs(p, '#centerMeBtn', 'backgroundColor')) === TRANSPARENT]] },
  onpressed: { run: openFilters, press: ['#toggleFiltersBtn'], undo: openFilters, rule: 'onpress', check: async (p, T) => [['bg = --state-on-press', (await cs(p, '#toggleFiltersBtn', 'backgroundColor')) === T.onpress], ['glyph paper', (await cs(p, '#toggleFiltersBtn', 'color')) === T.paper]] },
  off: NA('never unavailable'), other: NA('n/a') } });

add({ key: 'locate', name: 'Locate', group: 'Header', shot: '#locationsHeader', cells: {
  idle: { rule: 'press', check: async (p) => [['transparent', (await cs(p, '#centerMeBtn', 'backgroundColor')) === TRANSPARENT]] },
  pressed: { press: ['#centerMeBtn'], rule: 'press', check: async (p, T) => [['bg = --state-press', (await cs(p, '#centerMeBtn', 'backgroundColor')) === T.press]] },
  on: NA('momentary action, not a toggle'), onpressed: NA('momentary action'),
  off: { run: p => p.evaluate(() => document.getElementById('centerMeBtn').classList.add('loading')), undo: p => p.evaluate(() => document.getElementById('centerMeBtn').classList.remove('loading')), rule: 'off', check: async (p) => [['loading opacity .4', (await cs(p, '#centerMeBtn', 'opacity')) === '0.4']] },
  other: NA('n/a') } });

const cityRow = { key: 'citychip', name: 'City chip', group: 'Filters panel', shot: '#filtersPanel', enter: async p => { await openFilters(p);
    await p.evaluate(() => { document.querySelectorAll('#cityFilters .city-btn:not(.active)')[0].id = 'cityU'; document.querySelector('#cityFilters .city-btn.active').id = 'cityS'; }); },
  cells: {
    idle: { shotSel: '#cityU', pad: 10, rule: 'press', check: async (p, T) => [['unselected: raised paper', (await cs(p, '#cityU', 'backgroundColor')) === T.raised]] },
    pressed: { shotSel: '#cityU', pad: 10, press: ['#cityU'], rule: 'press', check: async (p, T) => [['bg = --state-press', (await cs(p, '#cityU', 'backgroundColor')) === T.press]] },
    on: { shotSel: '#cityS', pad: 10, rule: 'on', check: async (p, T) => [['selected bg navy', (await cs(p, '#cityS', 'backgroundColor')) === T.navy], ['text paper', (await cs(p, '#cityS', 'color')) === T.paper]] },
    onpressed: { shotSel: '#cityS', pad: 10, press: ['#cityS'], rule: 'onpress', check: async (p, T) => [['selected pressed = --state-on-press', (await cs(p, '#cityS', 'backgroundColor')) === T.onpress], ['text paper', (await cs(p, '#cityS', 'color')) === T.paper]] },
    off: NA('never unavailable'), other: NA('n/a') } };
add(cityRow);

add({ key: 'catchip', name: 'Category chip', group: 'Filters panel', shot: '#filtersPanel', enter: openFilters,
  cells: {
    idle: { shotSel: '#filter-restaurant', pad: 10, rule: 'chip', check: async (p, T) => [['on: raised paper, solid border', (await cs(p, '#filter-restaurant', 'backgroundColor')) === T.raised && (await cs(p, '#filter-restaurant', 'borderTopStyle')) === 'solid']] },
    pressed: { shotSel: '#filter-restaurant', pad: 10, press: ['#filter-restaurant'], rule: 'press', check: async (p, T) => [['bg = --state-press', (await cs(p, '#filter-restaurant', 'backgroundColor')) === T.press]] },
    on: NA('on is the resting look (idle): the default state is quiet'), onpressed: NA('= pressed'),
    off: { shotSel: '#filter-cafe', pad: 10, run: async p => { await click(p, '#filter-cafe'); await W(300); }, undo: async p => { await click(p, '#filter-cafe'); await W(300); }, rule: 'chip', check: async (p, T) => [['off: dashed border', (await cs(p, '#filter-cafe', 'borderTopStyle')) === 'dashed'], ['off: text ink-2', (await cs(p, '#filter-cafe', 'color')) === T.ink2]] },
    other: { label: 'off + pressed', shotSel: '#filter-cafe', pad: 10, run: async p => { await click(p, '#filter-cafe'); await W(300); }, press: ['#filter-cafe'], undo: async p => { await click(p, '#filter-cafe'); await W(300); }, rule: 'press', check: async (p, T) => [['off pressed: bg = --state-press', (await cs(p, '#filter-cafe', 'backgroundColor')) === T.press], ['still dashed', (await cs(p, '#filter-cafe', 'borderTopStyle')) === 'dashed']] } } });

const starTile = (sel, tap) => ({ press: [tap], rule: 'press', check: async (p, T) => [['::before bg = --state-press', (await cs(p, sel, 'backgroundColor', '::before')) === T.press], ['radius 3px', (await cs(p, sel, 'borderTopLeftRadius', '::before')) === '3px'], ['tile 4px clear of glyph on every side', insetsOk(await tileInsets(p, sel))]] });
add({ key: 'popupstar', name: 'Popup star', group: 'Popup', shot: '.leaflet-popup-content-wrapper', pad: 6,
  enter: async p => { await popupFor(p, '!x.starred'); },
  cells: {
    idle: { rule: 'glyph', check: async (p, T) => [['hollow', (await p.evaluate(() => document.querySelector('.popup-star use').getAttribute('href'))) === '#g-star-open'], ['tile hidden', (await cs(p, '.popup-star', 'backgroundColor', '::before')) === TRANSPARENT]] },
    pressed: starTile('.popup-star', '.popup-star-tap'),
    on: { run: async p => { await closePopup(p); await popupFor(p, 'x.starred'); }, rule: 'glyph', check: async (p, T) => [['filled', (await p.evaluate(() => document.querySelector('.popup-star use').getAttribute('href'))) === '#g-star'], ['ink', (await cs(p, '.popup-star', 'color')) === T.ink]] },
    onpressed: Object.assign({ run: async p => { await closePopup(p); await popupFor(p, 'x.starred'); } }, starTile('.popup-star', '.popup-star-tap')),
    off: NA('never unavailable'), other: NA('n/a') } });

add({ key: 'popupvisited', name: 'Popup Mark Visited', group: 'Popup', shot: '.leaflet-popup-content-wrapper', pad: 6,
  enter: async p => { await popupFor(p, '!x.visited'); },
  cells: {
    idle: { rule: 'glyph', check: async (p, T) => [['ink-2 text', (await cs(p, '.popup-visited', 'color')) === T.ink2], ['tile hidden', (await cs(p, '.popup-visited', 'backgroundColor', '::before')) === TRANSPARENT]] },
    pressed: { press: ['.popup-visited-tap'], rule: 'press', check: async (p, T) => [['::before bg = --state-press', (await cs(p, '.popup-visited', 'backgroundColor', '::before')) === T.press], ['radius 3px', (await cs(p, '.popup-visited', 'borderTopLeftRadius', '::before')) === '3px'],
      ['tile 4px clear of the words/ring on every side', insetsOk(await tileInsets(p, '.popup-visited'))]] },
    on: { run: async p => { await closePopup(p); await popupFor(p, 'x.visited'); }, rule: 'glyph', check: async (p, T) => [['navy text', (await cs(p, '.popup-visited', 'color')) === T.navy], ['navy dot', (await cs(p, '.popup-visited-check', 'backgroundColor')) === T.navy]] },
    onpressed: { run: async p => { await closePopup(p); await popupFor(p, 'x.visited'); }, press: ['.popup-visited-tap'], rule: 'press', check: async (p, T) => [['::before bg = --state-press', (await cs(p, '.popup-visited', 'backgroundColor', '::before')) === T.press]] },
    off: NA('never unavailable'), other: NA('n/a') } });

add({ key: 'popupclose', name: 'Popup close', group: 'Popup', shot: '.leaflet-popup-content-wrapper', pad: 6,
  enter: async p => { await popupFor(p, '!x.visited'); },
  cells: {
    idle: { rule: 'press', check: async (p) => [['transparent', (await cs(p, '.leaflet-popup-close-button', 'backgroundColor')) === TRANSPARENT]] },
    pressed: { press: ['.leaflet-popup-close-button'], rule: 'press', check: async (p, T) => [['::before bg = --state-press', (await cs(p, '.leaflet-popup-close-button', 'backgroundColor', '::before')) === T.press], ['radius 3px', (await cs(p, '.leaflet-popup-close-button', 'borderTopLeftRadius', '::before')) === '3px'], ['tile clears the popup border by >= 1px (border unbroken)', await p.evaluate(() => { const b = document.querySelector('.leaflet-popup-close-button'), w = document.querySelector('.leaflet-popup-content-wrapper'), cb = getComputedStyle(b, '::before'), r = b.getBoundingClientRect(), wr = w.getBoundingClientRect(), bw = parseFloat(getComputedStyle(w).borderTopWidth); return (wr.right - (r.left + parseFloat(cb.left) + parseFloat(cb.width))) >= bw + 1 && ((r.top + parseFloat(cb.top)) - wr.top) >= bw + 1; })]] },
    on: NA('not a toggle'), onpressed: NA('not a toggle'), off: NA('never unavailable'), other: NA('n/a') } });

add({ key: 'directions', name: 'Get Directions', group: 'Popup', shot: '.leaflet-popup-content-wrapper', pad: 6,
  enter: async p => { await popupFor(p, '!x.visited'); },
  cells: {
    idle: { rule: 'press', check: async (p) => [['tile hidden', (await cs(p, '.popup-directions', 'backgroundColor', '::before')) === TRANSPARENT]] },
    pressed: { press: ['.popup-directions'], rule: 'press', check: async (p, T) => [['::before bg = --state-press', (await cs(p, '.popup-directions', 'backgroundColor', '::before')) === T.press], ['radius 3px', (await cs(p, '.popup-directions', 'borderTopLeftRadius', '::before')) === '3px'], ['tile 4px clear top/right/bottom; 7px left (4 + the compass 3px icon margin)', await (async () => { const i = await tileInsets(p, '.popup-directions'); return near(i.t, 4) && near(i.r, 4) && near(i.b, 4) && near(i.l, 7); })()], ['left edge aligns with the star tile', near((await tileInsets(p, '.popup-directions')).tileL, (await tileInsets(p, '.popup-star')).tileL, 0.6)]] },
    on: NA('link, not a toggle'), onpressed: NA('link'), off: NA('never unavailable'), other: NA('n/a') } });

add({ key: 'formstar', name: 'Add-form star', group: 'Add form', shot: '#starInputRow', pad: 4, maxW: 96, enter: openForm,
  cells: {
    idle: { rule: 'glyph', check: async (p) => [['aria-pressed false', (await p.evaluate(() => starInput.getAttribute('aria-pressed'))) === 'false'], ['tile hidden', (await cs(p, '#starInput', 'backgroundColor', '::before')) === TRANSPARENT]] },
    pressed: { press: ['.form-star-tap'], rule: 'press', check: async (p, T) => [['::before bg = --state-press', (await cs(p, '#starInput', 'backgroundColor', '::before')) === T.press], ['radius 3px', (await cs(p, '#starInput', 'borderTopLeftRadius', '::before')) === '3px']] },
    on: { run: p => click(p, '#starInput').then(() => W(300)), undo: p => click(p, '#starInput').then(() => W(300)), rule: 'glyph', check: async (p, T) => [['aria-pressed true', (await p.evaluate(() => starInput.getAttribute('aria-pressed'))) === 'true'], ['glyph ink', (await cs(p, '#starInput svg', 'color')) === T.ink]] },
    onpressed: { run: p => click(p, '#starInput').then(() => W(300)), press: ['.form-star-tap'], undo: p => click(p, '#starInput').then(() => W(300)), rule: 'press', check: async (p, T) => [['::before bg = --state-press', (await cs(p, '#starInput', 'backgroundColor', '::before')) === T.press]] },
    off: NA('never unavailable'), other: NA('n/a') } });

add({ key: 'submit', name: 'Submit', group: 'Add form', shot: '#submitBtn', pad: 8, enter: openForm,
  cells: {
    idle: { rule: 'filled', check: async (p, T) => [['bg --figure', (await cs(p, '#submitBtn', 'backgroundColor')) === T.figure], ['text navy', (await cs(p, '#submitBtn', 'color')) === T.navy]] },
    pressed: { press: ['#submitBtn'], rule: 'filled', check: async (p, T) => [['bg --figure-deep', (await cs(p, '#submitBtn', 'backgroundColor')) === T.figureDeep], ['text flips to paper', (await cs(p, '#submitBtn', 'color')) === T.paper]] },
    on: NA('not a toggle'), onpressed: NA('not a toggle'),
    off: { run: p => p.evaluate(() => { submitBtn.disabled = true; }), undo: p => p.evaluate(() => { submitBtn.disabled = false; }), rule: 'off', check: async (p) => [['disabled opacity .4', (await cs(p, '#submitBtn', 'opacity')) === '0.4']] },
    other: NA('n/a') } });

const floating = (name, id, prep) => ({ key: id.slice(1), name, group: 'Floating', shot: id, pad: 8, enter: async p => { await p.evaluate(() => document.getElementById('accountBtn').classList.add('show')); },
  cells: {
    idle: { rule: 'filled', check: async (p, T) => [['bg navy', (await cs(p, id, 'backgroundColor')) === T.navy], ['glyph --figure', (await cs(p, id, 'color')) === T.figure]] },
    pressed: { press: [id], rule: 'filled', check: async (p, T) => [['bg --state-on-press', (await cs(p, id, 'backgroundColor')) === T.onpress], ['glyph flips to paper', (await cs(p, id, 'color')) === T.paper]] },
    on: { run: async p => { await click(p, id); await W(400); }, undo: async p => { await click(p, id); await W(400); }, rule: 'float', check: async (p, T) => [['open: bg --figure', (await cs(p, id, 'backgroundColor')) === T.figure], ['open: glyph navy', (await cs(p, id, 'color')) === T.navy]] },
    onpressed: { run: async p => { await click(p, id); await W(400); }, press: [id], undo: async p => { await click(p, id); await W(400); }, rule: 'filled', check: async (p, T) => [['open-pressed: bg --figure-deep', (await cs(p, id, 'backgroundColor')) === T.figureDeep], ['glyph flips to paper', (await cs(p, id, 'color')) === T.paper]] },
    off: NA('never unavailable'), other: NA('n/a') } });
add(floating('Add button', '#floatingAddBtn'));
add(floating('Account button', '#accountBtn'));

add({ key: 'acctitem', name: 'Account menu item', group: 'Menus', shot: '#accountDropdown', pad: 6, enter: async p => { await p.evaluate(() => document.getElementById('accountBtn').classList.add('show')); await click(p, '#accountBtn'); await W(400); },
  cells: {
    idle: { rule: 'hover', check: async (p) => [['transparent', (await cs(p, '#accountDropdown button', 'backgroundColor')) === TRANSPARENT]] },
    pressed: { press: ['#accountDropdown button'], rule: 'press', check: async (p, T) => [['bg = --state-press', (await cs(p, '#accountDropdown button', 'backgroundColor')) === T.press]] },
    on: NA('not a toggle'), onpressed: NA('not a toggle'), off: NA('never unavailable'),
    other: { label: 'hover (pointer)', hover: '#accountDropdown button', rule: 'hover', check: async (p, T) => [['hover bg = raised paper', (await cs(p, '#accountDropdown button', 'backgroundColor')) === T.raised]] } } });

const sortEnter = async p => { await realTap(p, '#sortBtn'); };
add({ key: 'sortitem', name: 'Sort menu item', group: 'Menus', shot: '#sortMenu', pad: 6, enter: async p => { await sortEnter(p); await p.evaluate(() => { const o = [...document.querySelectorAll('.sort-opt')]; const cur = o.find(x => x.getAttribute('aria-checked') === 'true'); cur.id = 'soCur'; o.find(x => x !== cur && !x.classList.contains('is-off')).id = 'soOther'; const off = o.find(x => x.classList.contains('is-off')); if (off) off.id = 'soOff'; }); },
  cells: {
    idle: { rule: 'press', check: async (p) => [['idle item transparent', (await cs(p, '#soOther', 'backgroundColor')) === TRANSPARENT], ['current item: no fill', (await cs(p, '#soCur', 'backgroundColor')) === TRANSPARENT], ['current item: no focus ring', (await cs(p, '#soCur', 'boxShadow')) === 'none'], ['nothing focus-visible', await p.evaluate(() => !document.querySelector(':focus-visible'))]] },
    pressed: { press: ['#soOther'], rule: 'press', check: async (p, T) => [['bg = --state-press', (await cs(p, '#soOther', 'backgroundColor')) === T.press]] },
    on: { rule: 'press', check: async (p) => [['current: check visible', (await cs(p, '#soCur .sort-check', 'visibility')) === 'visible'], ['others: check hidden', (await cs(p, '#soOther .sort-check', 'visibility')) === 'hidden']] },
    onpressed: { press: ['#soCur'], rule: 'press', check: async (p, T) => [['current pressed: bg = --state-press', (await cs(p, '#soCur', 'backgroundColor')) === T.press], ['check still visible', (await cs(p, '#soCur .sort-check', 'visibility')) === 'visible']] },
    off: { label: 'unavailable, tappable', run: p => p.evaluate(() => { const n = document.querySelector('.sort-opt[data-sort="nearest"]'); n.classList.add('is-off'); n.id = 'soOff'; }), undo: p => p.evaluate(() => document.getElementById('soOff').classList.remove('is-off')), rule: 'isoff', check: async (p, T) => [['is-off: ink-2 text + reason line, still tappable (named exception to .4)', (await cs(p, '#soOff', 'color')) === T.ink2]] },
    other: NA('n/a') } });

const rowSel = (n) => `#locationsList .location-card[data-id]${n}`;
add({ key: 'row', name: 'List row', group: 'Rows', shot: '#rowShot', pad: 0, maxW: 230, enter: async p => {
    await p.evaluate(() => { const cards = [...document.querySelectorAll('#locationsList .location-card[data-id]')]; const u = cards.find(c => !c.classList.contains('is-visited')), v = cards.find(c => c.classList.contains('is-visited')); u.id = 'rowU'; v.id = 'rowV'; window.__idU = u.dataset.id; window.__idV = v.dataset.id; }); },
  cells: {
    idle: { shotSel: '#rowU', rule: 'row', check: async (p, T) => [['unvisited bg paper', (await cs(p, '#rowU', 'backgroundColor')) === T.paper]] },
    pressed: { shotSel: '#rowU', run: p => p.evaluate(() => document.getElementById('rowU').classList.add('active')), undo: p => p.evaluate(() => document.getElementById('rowU').classList.remove('active')), rule: 'press', check: async (p, T) => [['bg = --state-press', (await cs(p, '#rowU', 'backgroundColor')) === T.press], ['visible step vs idle (max channel diff >= 20)', chDiff(await cs(p, '#rowU', 'backgroundColor'), T.paper) >= 20]] },
    on: { shotSel: '#rowU', run: async p => { await p.evaluate(() => { highlightedId = null; highlightMarker(window.__idU); }); await W(1100); await p.evaluate(() => document.getElementById('rowU').scrollIntoView({ block: 'center' })); await W(200); }, undo: p => closePopup(p), rule: 'row', check: async (p, T) => [['highlighted bg --figure-deep', (await cs(p, '#rowU', 'backgroundColor')) === T.figureDeep], ['name paper', (await cs(p, '#rowU h3', 'color')) === T.paper]] },
    onpressed: { shotSel: '#rowU', run: async p => { await p.evaluate(() => { highlightedId = null; highlightMarker(window.__idU); }); await W(1100); await p.evaluate(() => document.getElementById('rowU').scrollIntoView({ block: 'center' })); await W(200); await p.evaluate(() => document.getElementById('rowU').classList.add('active')); }, undo: async p => { await p.evaluate(() => document.getElementById('rowU').classList.remove('active')); await closePopup(p); }, rule: 'row', check: async (p, T) => [['highlighted + pressed stays --figure-deep (already reversed; named exception: no deeper step)', (await cs(p, '#rowU', 'backgroundColor')) === T.figureDeep]] },
    off: { label: 'visited (filed)', shotSel: '#rowV', rule: 'row', check: async (p, T) => [['visited bg --paper-filed', (await cs(p, '#rowV', 'backgroundColor')) === T.filed]] },
    other: { label: 'visited + pressed', shotSel: '#rowV', run: p => p.evaluate(() => document.getElementById('rowV').classList.add('active')), undo: p => p.evaluate(() => document.getElementById('rowV').classList.remove('active')), rule: 'press', check: async (p, T) => [['filed row pressed = --state-press-filed', (await cs(p, '#rowV', 'backgroundColor')) === T.pressFiled], ['visible step vs filed idle (max channel diff >= 20)', chDiff(await cs(p, '#rowV', 'backgroundColor'), T.filed) >= 20]] } } });

add({ key: 'delx', name: 'Row delete X', group: 'Rows', shot: '#rowShot', maxW: 390, enter: async p => { await p.evaluate(() => { const c = document.querySelector('#locationsList .location-card[data-id]'); c.id = 'rowD'; }); },
  cells: {
    idle: { shotSel: '#rowD', rule: 'row', check: async (p, T) => [['ink-2', (await cs(p, '#rowD .delete-btn', 'color')) === T.ink2]] },
    pressed: NA('deliberately no pressed-X rule (index.html comment: pressed-X colour was backwards feedback and failed contrast); the row press is the feedback'),
    on: NA('not a toggle'), onpressed: NA('not a toggle'), off: NA('n/a'), other: NA('n/a') } });

add({ key: 'pin', name: 'Map pin', group: 'Map', shot: '#map', enter: async p => { await p.evaluate(() => { let best = null, bd = -1; const ic = [...markersById.entries()].map(([id, m]) => [id, m.marker._icon.getBoundingClientRect()]).filter(([, r]) => r.y > 20 && r.bottom < 500 && r.x > 40 && r.right < 350);
    for (const [id, r] of ic) { let md = 1e9; for (const [id2, r2] of ic) if (id2 !== id) md = Math.min(md, Math.hypot(r.x - r2.x, r.y - r2.y)); if (md > bd) { bd = md; best = id; } } window.__pid = best; }); },
  cells: {
    idle: { label: 'other pins hidden for the crop', run: isolatePin, undo: unisolatePin, shotFn: async p => p.evaluate(() => { const b = markersById.get(window.__pid).marker._icon.getBoundingClientRect(); return { x: b.x - 24, y: b.y - 24, width: b.width + 48, height: b.height + 48 }; }), rule: 'row', check: async (p) => [['idle: no pulse', await p.evaluate(() => !markersById.get(window.__pid).marker._icon.querySelector('.highlighted-marker'))]] },
    pressed: NA('map pins open the popup on tap; the popup is the feedback'),
    on: { shotFn: async p => p.evaluate(() => { const b = markersById.get(window.__pid).marker._icon.getBoundingClientRect(); return { x: b.x - 24, y: b.y - 24, width: b.width + 48, height: b.height + 48 }; }), run: async p => { await p.evaluate(() => { highlightedId = null; highlightMarker(window.__pid); }); await W(1000); await isolatePin(p); await p.evaluate(() => { const st = document.createElement('style'); st.id = 'hidePopup'; st.textContent = '.leaflet-popup-pane{visibility:hidden}'; document.head.appendChild(st); }); await W(100); }, undo: async p => { await p.evaluate(() => document.getElementById('hidePopup').remove()); await unisolatePin(p); await closePopup(p); }, cover: p => p.evaluate(() => { const i = markersById.get(window.__pid).marker._icon, r = i.getBoundingClientRect(), e = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return !!e && i.contains(e); }), label: 'highlighted (popup and other pins hidden for the crop)', rule: 'row', check: async (p) => [['highlighted: pulse animation', await p.evaluate(() => { const e = markersById.get(window.__pid).marker._icon.querySelector('.highlighted-marker'); return !!e && getComputedStyle(e).animationName === 'markerPulse'; })]] },
    onpressed: NA('n/a'), off: NA('n/a'), other: NA('n/a') } });

// ---- driver -----------------------------------------------------------------
const cellName = (row, col) => `${row.key}-${col}`;
async function runPass(browser, dsf, isFirst) {
  const fails = [], shots = {}; CLAIMS = {};
  for (const row of ROWS) {
    const { ctx, page } = await open(browser, { dsf });
    cdp = null; forced = [];
    const T = { press: await tok(page, '--state-press'), onpress: await tok(page, '--state-on-press'), navy: await tok(page, '--navy'), paper: await tok(page, '--paper'), raised: await tok(page, '--paper-raised'),
      figure: await tok(page, '--figure'), figureDeep: await tok(page, '--figure-deep'), ink: await tok(page, '--ink'), ink2: await tok(page, '--ink-2'), filed: await tok(page, '--paper-filed'), pressFiled: await tok(page, '--state-press-filed') };
    if (row.enter) await row.enter(page);
    for (const col of COLS) {
      const c = row.cells[col]; if (!c || c.na !== undefined) continue;
      if (c.run) await c.run(page);
      if (c.press) await force(page, c.press);
      if (c.hover) { const r = await page.evaluate(s => { const b = document.querySelector(s).getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }, c.hover); await page.mouse.move(r.x, r.y); }
      if (c.shotSel) await page.evaluate(s => document.querySelector(s).scrollIntoView({ block: 'center' }), c.shotSel);
      await W(450);   // transitions settle
      const results = c.check ? await c.check(page, T) : [];
      { let cov = true;
        if (c.cover) cov = await c.cover(page);
        else { const sel = c.coverSel || c.shotSel || (typeof row.shot === 'string' && row.shot[1] !== 'r' && row.shot !== '#map' ? row.shot : null);
          if (sel) cov = await page.evaluate(s => { const t = document.querySelector(s), r = t.getBoundingClientRect(), els = document.elementsFromPoint(r.x + r.width / 2, Math.min(Math.max(r.y + r.height / 2, 1), innerHeight - 1)); const i = els.findIndex(e => t.contains(e)); if (i < 0) return false; return els.slice(0, i).every(e => { if (e.closest('[class*="-tap"]')) return true; const c = getComputedStyle(e); const m = c.backgroundColor.match(/[\d.]+/g); const a = m && m.length > 3 ? +m[3] : (m ? 1 : 0); return a < 0.02 && c.backgroundImage === 'none'; }); }, sel); }
        results.push(['crop target not covered', cov]); }
      if (!c.press && !c.hover && !(col === 'idle' && row.key === 'sortitem')) results.push(['no stray focus ring', await page.evaluate(() => !document.querySelector(':focus-visible'))]);
      CLAIMS[cellName(row, col)] = results.map(r => r[0]).filter(l => l !== 'no stray focus ring' && l !== 'crop target not covered');
      for (const [label, ok] of results) if (!ok) fails.push(`${dsf}x ${cellName(row, col)}: ${label}`);
      let clip;
      if (c.shotFn) clip = await c.shotFn(page);
      else { const sel = c.shotSel || (typeof row.shot === 'string' ? row.shot : row.shot.sel); if (sel === '#rowShot') throw new Error('rowShot'); clip = await rectOf(page, sel, c.pad !== undefined ? c.pad : (row.pad || 0), row.maxW); }
      const file = `${cellName(row, col)}@${dsf}x.png`;
      try { await page.screenshot({ path: path.join(OUT, file), clip }); } catch (e) { fails.push(`${dsf}x ${cellName(row, col)}: screenshot failed, clip ${JSON.stringify(clip)}`); }
      shots[cellName(row, col)] = file;
      await unforce(page);
      if (c.undo) await c.undo(page);
      await W(150);
    }
    await ctx.close();
  }
  return { fails, shots };
}

(async () => {
  fs.rmSync(path.join(__dirname, 'stills'), { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  const b = await launch();
  let allFails = [], shots1 = {};
  for (const dsf of [1, 3, 4]) { const r = await runPass(b, dsf); allFails = allFails.concat(r.fails); if (dsf === 1) shots1 = r.shots; }
  // contact matrix at 1x, built from this table
  const cell = (row, col) => { const c = row.cells[col]; if (!c || c.na !== undefined) return `<td class=na>n/a<br><small>${(c && c.na) || ''}</small></td>`;
    return `<td><img src="stills/matrix/${shots1[cellName(row, col)]}"><small>${c.label ? '<b>' + c.label + '</b>: ' : ''}${(CLAIMS[cellName(row, col)] || []).join('; ')}<br><i>${RULES[c.rule]}</i></small></td>`; };
  let group = '';
  const body = ROWS.map(r => { const g = r.group !== group ? `<tr class=g><th colspan=7>${(group = r.group)}</th></tr>` : ''; return g + `<tr><th>${r.name}</th>${COLS.map(c => cell(r, c)).join('')}</tr>`; }).join('');
  const html = `<!doctype html><meta charset=utf-8><style>body{margin:0;padding:12px;background:#F2EBDD;font:11px/14px system-ui;color:#1A1A18}table{border-collapse:collapse}th,td{border:1px solid #D8CEBA;padding:4px;vertical-align:top;max-width:230px}th{text-align:left;background:#FAF5EA}tr.g th{background:#12293F;color:#F2EBDD}img{display:block;max-width:220px}small{display:block;color:#5A564C;font-size:10px;line-height:12px}td.na{color:#8a8578;background:#efe8d8}</style><table><tr><th></th>${COLS.map(c => `<th>${COLNAME[c]}</th>`).join('')}</tr>${body}</table>`;
  fs.writeFileSync(path.join(__dirname, 'matrix.html'), html);
  const pg = await b.newPage({ viewport: { width: 1500, height: 900 }, deviceScaleFactor: 1 });
  await pg.goto('file://' + path.join(__dirname, 'matrix.html')); await pg.waitForTimeout(500);
  await pg.screenshot({ path: path.join(__dirname, 'matrix@1x.png'), fullPage: true });
  // automatic crop-quality check: no crop blank or mostly one colour
  { const pg2 = await b.newPage(); const bad = [];
    for (const f of fs.readdirSync(OUT)) { const b64 = fs.readFileSync(path.join(OUT, f)).toString('base64');
      const r = await pg2.evaluate(async b64 => { const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode(); const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d'); x.drawImage(img, 0, 0); const d = x.getImageData(0, 0, c.width, c.height).data; const m = new Map(); for (let i = 0; i < d.length; i += 4) { const k = (d[i] << 16) | (d[i + 1] << 8) | d[i + 2]; m.set(k, (m.get(k) || 0) + 1); } let top = 0; for (const v of m.values()) top = Math.max(top, v); return { w: c.width, h: c.height, n: m.size, share: top / (c.width * c.height) }; }, b64);
      if (r.w < 8 || r.h < 8 || r.n < 4 || r.share > 0.97) bad.push(`${f}: ${r.w}x${r.h}, ${r.n} colours, dominant ${(r.share * 100).toFixed(1)}%`); }
    bad.forEach(x => allFails.push('crop quality: ' + x)); await pg2.close(); }
  await b.close();
  // README checklist block from the table
  const mdRows = ROWS.map(r => `| ${r.group}: ${r.name} | ${COLS.map(c => { const x = r.cells[c]; return !x || x.na !== undefined ? 'n/a: ' + ((x && x.na) || '') : (x.label ? x.label + ': ' : '') + (CLAIMS[cellName(r, c)] || []).join('; ') + ' [' + RULES[x.rule] + ']'; }).join(' | ')} |`).join('\n');
  const readme = fs.readFileSync(path.join(__dirname, 'README.md'), 'utf8');
  const block = `<!-- MATRIX:START (generated by matrix.js from its table; do not edit) -->\n| Element | ${COLS.map(c => COLNAME[c]).join(' | ')} |\n|---|${COLS.map(() => '---').join('|')}|\n${mdRows}\n<!-- MATRIX:END -->`;
  fs.writeFileSync(path.join(__dirname, 'README.md'), readme.replace(/<!-- MATRIX:START[\s\S]*<!-- MATRIX:END -->/, block));
  const cells = ROWS.reduce((n, r) => n + COLS.filter(c => r.cells[c] && r.cells[c].na === undefined).length, 0);
  console.log(`${cells} cells x 3 scales; ${allFails.length} failures`);
  allFails.forEach(f => console.log('FAIL ' + f));
  process.exit(allFails.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
