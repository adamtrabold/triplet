// Systems round-7 check (jam turn 26): the 60px orange Float at the BOTTOM-LEFT. Derived from ../r6-check/check.js.
// Formerly: Systems round-6 structural check (jam turn 22): the Float's 60px stamp badge footprint and C's 72x94 selected-pin +
// mini-tag slot, on copies of the CURRENT main index.html (signed out = playground). Everything is built in memory; the
// real index.html is only read. Writes measure.json + frames/ here.
// Run: node check.js            (ONLY=F|C|P to run one block)
const L = require('../lib-render.js'); const chromeCheck = require('../chrome-check.js'); const fs = require('fs'); const path = require('path');
const C = path.join(__dirname, '..'), REAL = '/home/user/la-trip-map/index.html', OUT = path.join(__dirname, 'frames');
fs.mkdirSync(OUT, { recursive: true });
const rd = f => fs.readFileSync(path.join(C, f), 'utf8');
const real = fs.readFileSync(REAL, 'utf8');
// ---- Float copy: the same two builder patches as E-float/render.js, on today's main ----
const TOPPAD = "for (const el of [document.querySelector('.leaflet-control-zoom'), document.getElementById('floatingAddBtn'), document.getElementById('accountBtn')]) {";
if (!real.includes(TOPPAD) || !real.includes('const TAG_SHEET_GAP = 48;')) throw new Error('main moved: patch strings not found');
const floatBase = real.replace('const TAG_SHEET_GAP = 48;', 'let TAG_SHEET_GAP = 48;')
  .replace(TOPPAD, "for (const el of [document.querySelector('.leaflet-control-zoom'), document.getElementById('accountBtn')]) {");
// concept.inc's tag gap and Add alignment assume a 50px unscaled badge. data-taggap="<n>" pins the gap; data-fix="rect" makes the
// ride form read the badge's RENDERED box (scale-aware) for Add's right stop and centre line. Both only in this check.
let eInc = rd('E-float/concept.inc.html')
  .replace("(root.dataset.taggap || 'clear') === 'clear' ? Math.ceil(c.gap - INK + 50 + liftForCredit(c) + 12) : 48",
    "(root.dataset.taggap || 'clear') === 'clear' ? Math.ceil(c.gap - INK + 50 + liftForCredit(c) + 12) : root.dataset.taggap === 'box' ? Math.ceil(__floatEdge() - fab.getBoundingClientRect().top + 12) : (+root.dataset.taggap || 48)")
  .replace('const H = 44, edge = __floatEdge(), bc = top + 25;',
    "const H = 44, edge = __floatEdge(), FR = fab.getBoundingClientRect(), fix = root.dataset.fix === 'rect', bc = fix ? (FR.top + FR.bottom) / 2 : top + 25;")
  .replace('const fl = parseFloat(fab.style.left), padL = 56, padR = 16;', "const fl = fix ? FR.left : parseFloat(fab.style.left), padL = 56, padR = 16;")
  .replace("else { root.style.setProperty('--float-ml', Math.max(0, fl + 50 + 12 - padL) + 'px'); root.style.setProperty('--float-mr', '0px'); }",
    "else { root.style.setProperty('--float-ml', Math.max(0, fl + (fix ? FR.width : 50) + 12 - padL) + 'px'); root.style.setProperty('--float-mr', '0px'); }\n      if (root.dataset.formline === 'above') { root.style.setProperty('--float-ml', '0px'); root.style.setProperty('--float-mr', '0px'); root.style.setProperty('--float-pb', Math.max(0, edge - FR.top + 12).toFixed(2) + 'px'); }");
if (!eInc.includes("dataset.taggap === 'box'") || !eInc.includes("fix ? FR.left") || !eInc.includes("formline === 'above'")) throw new Error('E inc patch failed');
const R17 = `<style id="floatR17">#floatingAddBtn.active { background: var(--navy); color: var(--paper); }
  #floatingAddBtn.active:active { background: var(--state-on-press); color: var(--paper); }</style>`;
const NOPREFIX = `<script>(function () { const t = setInterval(() => { try { if (map && map.attributionControl) { map.attributionControl.setPrefix(false); clearInterval(t); } } catch (e) {} }, 50); })();</script>`;
const LEFT = `<style id="floatR7">html[data-corner="l"] #floatingAddBtn { transform-origin: 3.9px calc(100% - 3.9px); }</style>`;
const PICK = 'data-corner="l" data-align="gutter" data-gap="19.9" data-form="ride" data-credit="move" data-filters="under" data-ff="orange" data-fs="1.2" data-fc="seal"';
const inj = (h, incs, attrs) => { const i = h.lastIndexOf('</body>'); return (h.slice(0, i) + incs.join('\n') + '\n' + h.slice(i)).replace('<html lang="en"', `<html lang="en" ${attrs}`); };
const floatHtml = (extra = '', noprefix = false) => inj(floatBase, [eInc, R17, noprefix ? NOPREFIX : '', rd('E-float/r6.inc.html'), LEFT], `${PICK} ${extra}`);
// ---- C copy: C-pin/render.js's copy (main + concept.inc) + the visual's three layers, the round-6 pick (selected pin, big tag) ----
const cHtml = () => inj(real, [rd('C-pin/concept.inc.html'), rd('C-pin/visual.inc.html'), rd('C-pin/visual-r5.inc.html'), rd('C-pin/visual-r6.inc.html')],
  'data-c="ring" data-ring="graphite" ' + (process.env.CATTR || 'data-c6="hi" data-ct="big"'));
const CKEY = process.env.CKEY || 'C';   // round 6b: CKEY=C6b CATTR='data-c6="hio" data-ct="xl" data-te="edge" data-al="ink"'
// modes: signed in (the stub's stored session), playground (no stored session: today's signed-out app), stale (a stored session
// that no longer answers: the only state left where requireAuth() opens the sign-in sheet)
const PLAYGROUND_JS = "try { localStorage.removeItem('sb-jgvckilmltimabfdvaly-auth-token'); } catch (e) {}";
const modeOpts = m => m === 'play' ? { js: PLAYGROUND_JS } : m === 'stale' ? { q: '?signin' } : {};

const HELP = `var R = e => { if (!e) return null; const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return null; const r = e.getBoundingClientRect(); return r.width ? r : null; };
  var ov = (a, b) => a && b && Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1;
  var gap = (a, b) => a && b ? [+Math.max(b.left - a.right, a.left - b.right).toFixed(1), +Math.max(b.top - a.bottom, a.top - b.bottom).toFixed(1)] : null;
  var bx = r => r && [r.left, r.top, r.right, r.bottom].map(v => +v.toFixed(1));`;
const measure = (page, sel) => page.evaluate(([sel, HELP]) => { eval(HELP);
  const o = R(document.querySelector(sel)), raw = document.querySelector(sel);
  const sheet = document.getElementById('locations').getBoundingClientRect(), credit = R(document.querySelector('.leaflet-control-attribution')),
    tag = R(document.querySelector('.tag-popup .tag-body')) || R(document.querySelector('.tag-popup')), acct = R(document.getElementById('accountBtn')),
    zoom = R(document.querySelector('.leaflet-control-zoom')), sub = R(document.getElementById('submitBtn')),
    panel = document.getElementById('filtersPanel').classList.contains('visible') ? R(document.getElementById('filtersPanel')) : null;
  const centreHit = r => { if (!r) return null; const e = document.elementFromPoint((r.left + r.right) / 2, (r.top + r.bottom) / 2); return e ? (raw && raw.contains(e) ? 'self' : (e.id || String(e.className).slice(0, 30) || e.tagName)) : null; };
  const markers = [...document.querySelectorAll('.leaflet-marker-icon')].map(m => m.getBoundingClientRect());
  const out = { box: bx(o), visible: !!o, hit: centreHit(o), sheetTop: Math.round(sheet.top), acct: bx(acct), acctGap: gap(o, acct), credit: bx(credit), creditGap: gap(o, credit), overCredit: ov(o, credit),
    tag: bx(tag), tagGap: gap(o, tag), overTag: ov(o, tag), tagFootToSheet: tag ? Math.round(sheet.top - tag.bottom) : null, overZoom: ov(o, zoom), overPanel: ov(o, panel),
    pinsUnder: markers.filter(m => ov(o, m)).length, active: raw && raw.classList.contains('active'),
    submit: bx(sub), submitHit: sub ? centreHit.call(null, sub) && (() => { const e = document.elementFromPoint((sub.left + sub.right) / 2, (sub.top + sub.bottom) / 2); return e && (e.id || e.className); })() : null,
    submitToObj: sub && o ? +(o.left - sub.right).toFixed(1) : null, submitCentreDy: sub && o ? +(((sub.top + sub.bottom) / 2) - (o.top + o.bottom) / 2).toFixed(1) : null,
    tagGapConst: typeof TAG_SHEET_GAP !== 'undefined' ? TAG_SHEET_GAP : null, sheetLower: document.documentElement.style.getPropertyValue('--sheet-lower'),
    authModal: document.getElementById('authModal').classList.contains('show'), formOpen: document.getElementById('addForm').classList.contains('show'), pinadd: document.body.classList.contains('pinadd'),
    focus: document.activeElement && document.activeElement.id, acctLabel: document.getElementById('dropdownLogoutBtn') && document.getElementById('dropdownLogoutBtn').textContent, acctShown: !!acct,
    selectedPins: document.querySelectorAll('.leaflet-marker-icon.selected, .leaflet-marker-icon .selected').length };
  if (sel === '#floatingAddBtn' && o) { const I = 3.9 * (o.width / 50); out.ink = [o.left + I, o.top + I, o.right - I, o.bottom - I].map(v => +v.toFixed(1)); out.inkGapToSheet = +(sheet.top - (o.bottom - I)).toFixed(1); out.inkFromRight = +(innerWidth - (o.right - I)).toFixed(1);  out.inkFromLeft = +(o.left + I).toFixed(1); out.centreX = +((o.left + o.right) / 2).toFixed(1); out.zoom = bx(zoom); if (sub) { out.subGapRightOfObj = +(sub.left - o.right).toFixed(1); out.subAboveObj = +(o.top - sub.bottom).toFixed(1); out.subOverObj = ov(o, sub); } const ctl = document.getElementById('controls'); out.formBox = bx(R(ctl)); out.mapStripAboveForm = ctl && R(ctl) ? Math.round(R(ctl).top - (document.querySelector('.leaflet-control-zoom').getBoundingClientRect().bottom)) : null; }
  if (sel === '#pencilPin' && raw) { const disc = raw.querySelector('.c6-pin svg'), tg = raw.querySelector('.c6-tagw'); out.disc = bx(disc && disc.getBoundingClientRect()); out.miniTag = bx(tg && tg.getBoundingClientRect());
    out.hitDisc = centreHit(disc && disc.getBoundingClientRect()); if (o) { const e = document.elementFromPoint(o.left + 3, o.top + 3); out.hitBareCorner = e ? (raw.contains(e) ? 'self' : (e.id || String(e.className).slice(0, 30))) : null; } out.hitMiniTag = centreHit(tg && tg.getBoundingClientRect()); out.footToSheet = tg ? Math.round(sheet.top - tg.getBoundingClientRect().bottom) : null; }
  return out; }, [sel, HELP]);
const starTag = async p => { const id = await p.evaluate(() => (locations.find(l => l.starred && document.querySelector(`#locationsList .location-card[data-id="${l.id}"]`)) || {}).id); await p.click(`#locationsList .location-card[data-id="${id}"]`); await p.waitForTimeout(1900); };
const tallTag = async p => { const id = await p.evaluate(() => (locations.filter(l => document.querySelector(`#locationsList .location-card[data-id="${l.id}"]`)).sort((a, b) => (b.notes || '').length - (a.notes || '').length)[0] || {}).id); await p.click(`#locationsList .location-card[data-id="${id}"]`); await p.waitForTimeout(1900); };

const FS = {   // Float-left states (TAG_SHEET_GAP from the box = 88; Add maths scale-aware)
  rest_844: {}, rest_664: { vp: [390, 664] }, rest_375: { vp: [375, 667] },
  collapsed_safe: { inset: true, pre: 'collapse' },
  cph_320: { vp: [320, 568], city: 'copenhagen' }, cph_320_noprefix: { vp: [320, 568], city: 'copenhagen', noprefix: true },
  tag_844: { pre: 'tag', a: 'data-taggap="box"' }, tag_664: { vp: [390, 664], pre: 'tag', a: 'data-taggap="box"' },
  tagtall_664: { vp: [390, 664], pre: 'tall', a: 'data-taggap="box"' }, tag_320: { vp: [320, 568], city: 'copenhagen', pre: 'tag', a: 'data-taggap="box"' },
  filters_844: { pre: 'filters' }, filters_664: { vp: [390, 664], pre: 'filters' },
  formA_844: { tap: true, mode: 'play', a: 'data-fix="rect" data-formline="beside"' }, formA_664: { vp: [390, 664], tap: true, mode: 'play', a: 'data-fix="rect" data-formline="beside"' },
  formA_320: { vp: [320, 568], city: 'copenhagen', tap: true, mode: 'play', a: 'data-fix="rect" data-formline="beside"' },
  formB_844: { tap: true, mode: 'play', a: 'data-fix="rect" data-formline="above"' }, formB_664: { vp: [390, 664], tap: true, mode: 'play', a: 'data-fix="rect" data-formline="above"' },
  formB_320: { vp: [320, 568], city: 'copenhagen', tap: true, mode: 'play', a: 'data-fix="rect" data-formline="above"' },
  formcol_safe: { inset: true, pre: 'collapse', tap: true, mode: 'play', a: 'data-fix="rect" data-formline="beside"' },
  tagform_844: { pre: 'tag', tap: true, cancel: true, mode: 'play', a: 'data-taggap="box" data-fix="rect"' },
  stale_tap: { tap: true, mode: 'stale' }, play_rest: { mode: 'play' },
  desktop_rest: { vp: [1280, 800], desk: true },
};
const CS = {   // C states
  rest_844: {}, rest_664: { vp: [390, 664] }, rest_375: { vp: [375, 667] }, collapsed_safe: { inset: true, pre: 'collapse' },
  cph_320: { vp: [320, 568], city: 'copenhagen' }, tag_844: { pre: 'tag' }, tag_664: { vp: [390, 664], pre: 'tag' },
  tag_closed_664: { vp: [390, 664], pre: 'tag', close: true }, filters_664: { vp: [390, 664], pre: 'filters' },
  play_tap: { tap: true, mode: 'play' }, play_tap_320: { vp: [320, 568], tap: true, mode: 'play' }, stale_tap: { tap: true, mode: 'stale' },
  desktop_rest: { vp: [1280, 800], desk: true },
};
const run = async (b, kind, n, s) => {
  const sel = kind === 'F' ? '#floatingAddBtn' : '#pencilPin';
  const html = path.join(__dirname, `.${kind}.html`);   // scratch copy for lib-render (it reads a path); deleted at the end
  fs.writeFileSync(html, kind === 'F' ? floatHtml(s.a || '', s.noprefix) : cHtml());
  const { ctx, page, errs } = await L.open(b, { html, vp: s.vp || [390, 844], inset: s.inset, desk: s.desk, ...modeOpts(s.mode) });
  await page.evaluate(c => setActiveCity(c), s.city || 'reykjavik'); await page.waitForTimeout(900);
  if (s.pre === 'collapse') { await page.click('#collapseBtn'); await page.waitForTimeout(700); }
  if (s.pre === 'filters') { await page.click('#toggleFiltersBtn'); await page.waitForTimeout(700); }
  if (s.pre === 'tag') await starTag(page);
  if (s.pre === 'tall') await tallTag(page);
  if (s.close) { await page.evaluate(() => map.closePopup()); await page.waitForTimeout(900); }
  await page.waitForTimeout(200);
  const m = { before: await measure(page, sel), rows: await L.rowsVisible(page) };
  if (s.tap) { await page.click(sel); await page.waitForTimeout(1100); m.after = await measure(page, sel); }
  m.chrome = await chromeCheck(page); m.errs = errs;
  await page.screenshot({ path: path.join(OUT, `${kind === 'C' ? CKEY : kind}-${n}-${s.desk ? 1 : 3}x.png`) });
  if (s.cancel) { await page.click(sel); await page.waitForTimeout(1300);
    m.afterCancel = { obj: await measure(page, sel), collapsed: await page.evaluate(() => document.getElementById('locations').classList.contains('collapsed')), tagKey: await page.evaluate(() => openTagKey()) }; }
  await ctx.close(); return m;
};
(async () => {
  const b = await L.launch(); const f = path.join(__dirname, 'measure.json');
  const out = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {}; out.F = out.F || {}; out[CKEY] = out[CKEY] || {};
  const only = process.env.ONLY;
  if (!only || only === 'F') for (const [n, s] of Object.entries(FS)) { out.F[n] = await run(b, 'F', n, s); console.log('F', n, JSON.stringify(out.F[n])); }
  if (only === 'C') for (const [n, s] of Object.entries(CS)) { out[CKEY][n] = await run(b, 'C', n, s); console.log(CKEY, n, JSON.stringify(out[CKEY][n])); }
  if (!only || only === 'P') for (const kind of ['F']) {   // pins under the resting object: 5 cities x list up / collapsed, default view and street zoom 14
    const sel = kind === 'F' ? '#floatingAddBtn' : '#pencilPin', html = path.join(__dirname, `.${kind}.html`); fs.writeFileSync(html, kind === 'F' ? floatHtml() : cHtml());
    const K = kind === 'C' ? CKEY : kind; out[K].pins = {};
    for (const city of ['la', 'reykjavik', 'copenhagen', 'malmo', 'stockholm']) for (const col of [false, true]) {
      const { ctx, page } = await L.open(b, { html, vp: [390, 844], dsf: 1 });
      await page.evaluate(c => setActiveCity(c), city); await page.waitForTimeout(900);
      if (col) { await page.click('#collapseBtn'); await page.waitForTimeout(700); }
      const m = await measure(page, sel); out[K].pins[city + (col ? '_collapsed' : '')] = { under: m.pinsUnder, total: await page.evaluate(() => document.querySelectorAll('.leaflet-marker-icon').length) };
      await ctx.close();
    }
    console.log(K, 'pins', JSON.stringify(out[K].pins));
  }
  for (const k of ['F']) { const h = path.join(__dirname, `.${k}.html`); if (fs.existsSync(h)) fs.unlinkSync(h); }
  fs.writeFileSync(f, JSON.stringify(out, null, 1)); await b.close();
})();
