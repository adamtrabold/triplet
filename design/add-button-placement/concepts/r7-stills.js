// ROUND 7 raw frames (visual designer; jam turns 25-27). Copies of TODAY'S MAIN with the concept layers, in memory.
//  Float at the bottom-LEFT, 60px orange (systems' r7-check/float-left.js construction) with the director's turn-27 rulings:
//    form line A (Add beside the x: Add's left = the x's INK + 12, right edge on 374), the "Leaflet |" prefix kept at a map
//    width >= 338 and dropped below, TAG_SHEET_GAP 88 (box), navy open state with a paper x.
//  A as the Hanging Tag cut in the list header (stub/r5 + r6 + r7.inc.html, data-a="tag7", data-eye=none|hole|patch).
// Run: node r7-stills.js  (ONLY=<comma prefixes>)   then: node compose-r7.js
const L = require('./lib-render.js'); const chromeCheck = require('./chrome-check.js'); const fs = require('fs'); const path = require('path');
const C = __dirname, real = fs.readFileSync('/home/user/la-trip-map/index.html', 'utf8'), rd = f => fs.readFileSync(path.join(C, f), 'utf8');
// ---- Float copy (systems' r7 patches) + the ink+12 Add rule ----
const TOPPAD = "for (const el of [document.querySelector('.leaflet-control-zoom'), document.getElementById('floatingAddBtn'), document.getElementById('accountBtn')]) {";
if (!real.includes(TOPPAD) || !real.includes('const TAG_SHEET_GAP = 48;')) throw new Error('main moved: patch strings not found');
const floatBase = real.replace('const TAG_SHEET_GAP = 48;', 'let TAG_SHEET_GAP = 48;')
  .replace(TOPPAD, "for (const el of [document.querySelector('.leaflet-control-zoom'), document.getElementById('accountBtn')]) {");
const eInc = rd('E-float/concept.inc.html')
  .replace("(root.dataset.taggap || 'clear') === 'clear' ? Math.ceil(c.gap - INK + 50 + liftForCredit(c) + 12) : 48",
    "(root.dataset.taggap || 'clear') === 'clear' ? Math.ceil(c.gap - INK + 50 + liftForCredit(c) + 12) : root.dataset.taggap === 'box' ? Math.ceil(__floatEdge() - fab.getBoundingClientRect().top + 12) : (+root.dataset.taggap || 48)")
  .replace('const H = 44, edge = __floatEdge(), bc = top + 25;',
    "const H = 44, edge = __floatEdge(), FR = fab.getBoundingClientRect(), fix = root.dataset.fix === 'rect', bc = fix ? (FR.top + FR.bottom) / 2 : top + 25;")
  .replace('const fl = parseFloat(fab.style.left), padL = 56, padR = 16;', "const fl = fix ? FR.left : parseFloat(fab.style.left), padL = 56, padR = 16;")
  // director turn 27, ruling 1: Add's left edge = the x's INK edge + 12 (the scallop's ink is 3.9/50 of the box in)
  .replace("else { root.style.setProperty('--float-ml', Math.max(0, fl + 50 + 12 - padL) + 'px'); root.style.setProperty('--float-mr', '0px'); }",
    "else { const W = fix ? FR.width : 50; root.style.setProperty('--float-ml', Math.max(0, fl + W - 3.9 * W / 50 + 12 - padL) + 'px'); root.style.setProperty('--float-mr', '0px'); }");
if (!eInc.includes("dataset.taggap === 'box'") || !eInc.includes("3.9 * W / 50 + 12")) throw new Error('E inc patch failed');
const R17 = `<style id="floatR17">#floatingAddBtn.active { background: var(--navy); color: var(--paper); }
  #floatingAddBtn.active:active { background: var(--state-on-press); color: var(--paper); }</style>`;
// ruling 2: the prefix stays at a map width >= 338, drops below. For the RIGHT corner (round 6 ruling 4) it always drops.
const PREFIX = `<script>(function () { const t = setInterval(() => { try { if (map && map.attributionControl) {
  const right = document.documentElement.dataset.corner === 'r'; if (right || map.getSize().x < 338) map.attributionControl.setPrefix(false); clearInterval(t); } } catch (e) {} }, 50); })();</script>`;
const LEFT = `<style id="floatR7">html[data-corner="l"] #floatingAddBtn { transform-origin: 3.9px calc(100% - 3.9px); }</style>`;
const FATTR = c => `data-corner="${c}" data-align="gutter" data-gap="19.9" data-form="ride" data-credit="move" data-filters="under" data-ff="orange" data-fs="1.2" data-fc="seal" data-taggap="box" data-fix="rect"`;
const inj = (h, incs, attrs) => { const i = h.lastIndexOf('</body>'); return (h.slice(0, i) + incs.join('\n') + '\n' + h.slice(i)).replace('<html lang="en"', `<html lang="en" ${attrs}`); };
const floatHtml = c => inj(floatBase, [eInc, R17, PREFIX, rd('E-float/r6.inc.html'), LEFT], FATTR(c));
const aHtml = a => inj(real, [rd('stub/r5.inc.html'), rd('stub/r6.inc.html'), rd('stub/r7.inc.html')], a);
const A7 = 'data-a="tag7" data-eye="none"';
// ---- helpers ----
const zoomIn = p => p.evaluate(() => map.setView([64.1471, -21.9426], 14, { animate: false }));
const openRow = which => async p => { const id = await p.evaluate(w => { const rows = locations.filter(l => document.querySelector(`#locationsList .location-card[data-id="${l.id}"]`));
    const l = w === 'starred' ? (rows.find(l => l.starred && l.visited) || rows.find(l => l.starred)) : rows.find(l => !l.starred && !l.visited); return l && l.id; }, which);
  await p.click(`#locationsList .location-card[data-id="${id}"]`); await p.waitForTimeout(1900); };
const collapse = async p => { await p.click('#collapseBtn'); await p.waitForTimeout(700); };
const F = {};
const both = (n, s) => { F[n] = s; F[n + '-1x'] = { ...s, dsf: 1 }; };
// Float: right vs left at rest (the move), the 1x, tag 664, adding 844, collapsed, 320 tag
both('fr-rest', { k: 'F', c: 'r', zoom: true });
both('fl-rest', { k: 'F', c: 'l', zoom: true });
F['fl-tag664'] = { k: 'F', c: 'l', vp: [390, 664], run: openRow('starred') };
F['fl-form844'] = { k: 'F', c: 'l', run: async p => { await p.click('#floatingAddBtn'); await p.waitForTimeout(1100); } };
F['fl-form844-1x'] = { ...F['fl-form844'], dsf: 1 };
F['fl-collapsed'] = { k: 'F', c: 'l', inset: true, run: collapse };
F['fl-tag320'] = { k: 'F', c: 'l', vp: [320, 568], city: 'copenhagen', run: openRow('starred') };
// A: the eyelet dial + admission for comparison (rest, zoomed so pins are in frame), then the pick's states
for (const [n, a] of [['a-admit', 'data-a="admit"'], ['a7-none', A7], ['a7-hole', 'data-a="tag7" data-eye="hole"'], ['a7-patch', 'data-a="tag7" data-eye="patch"']]) both(n, { k: 'A', a, zoom: true });
F['a7-pressed'] = { k: 'A', a: A7, zoom: true, run: p => p.evaluate(() => document.getElementById('nb').classList.add('press')) };
F['a7-open844'] = { k: 'A', a: A7, run: async p => { await p.click('#nb'); await p.waitForTimeout(1100); } };
F['a7-tag-plain'] = { k: 'A', a: A7, run: openRow('plain') };
F['a7-tag-starred'] = { k: 'A', a: A7, run: openRow('starred') };
F['a7-320'] = { k: 'A', a: A7, vp: [320, 568], city: 'copenhagen' };
F['a7-tag-plain-1x'] = { k: 'A', a: A7, dsf: 1, run: openRow('plain') };

const OUT = { F: 'E-float/r7', A: 'stub/r7' }, SEL = { F: '#floatingAddBtn', A: '#nb' };
const objClash = (page, sel) => page.evaluate(sel => {
  const vis = q => { const e = typeof q === 'string' ? document.querySelector(q) : q; if (!e) return null; const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return null; const r = e.getBoundingClientRect(); return r.width ? r : null; };
  const f = vis(sel); if (!f) return [];
  const ov = b => b && Math.min(f.right, b.right) - Math.max(f.left, b.left) > 1 && Math.min(f.bottom, b.bottom) - Math.max(f.top, b.top) > 1;
  const out = [];
  for (const [n, q] of Object.entries({ credit: '.leaflet-control-attribution', tag: '.tag-popup .tag-body', zoom: '.leaflet-control-zoom', account: '#accountBtn', submit: '#submitBtn' })) if (ov(vis(q))) out.push('plus x ' + n);
  if (sel !== '#nb' && ov(vis('#locations'))) out.push('plus x sheet');
  for (const m of document.querySelectorAll('.leaflet-marker-icon')) if (ov(m.getBoundingClientRect())) { out.push('plus x pin'); break; }
  return out; }, sel);
(async () => {
  const b = await L.launch(); const meas = {};
  for (const [name, s] of Object.entries(F).filter(([n]) => !process.env.ONLY || process.env.ONLY.split(',').some(p => n.startsWith(p)))) {
    const html = path.join(C, `.r7-${s.k}.html`); fs.writeFileSync(html, s.k === 'F' ? floatHtml(s.c) : aHtml(s.a));
    const { ctx, page, errs } = await L.open(b, { html, vp: s.vp || [390, 844], dsf: s.dsf, inset: s.inset });
    await page.evaluate(c => setActiveCity(c), s.city || 'reykjavik'); await page.waitForTimeout(900);
    if (s.k === 'A') await page.evaluate(() => window.fitTitle && window.fitTitle());
    if (s.zoom) { await zoomIn(page); await page.waitForTimeout(900); }
    if (s.run) await s.run(page);
    await page.waitForTimeout(400);
    const sel = SEL[s.k];
    const m = await page.evaluate(sel => {
      const bx = q => { const e = document.querySelector(q); if (!e) return null; const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return 'hidden'; const r = e.getBoundingClientRect(); return r.width ? [r.left, r.top, r.right, r.bottom].map(v => +v.toFixed(1)) : 'hidden'; };
      const o = document.querySelector(sel).getBoundingClientRect(), I = 3.9 * o.width / 50;
      const lst = document.getElementById('locationsList').getBoundingClientRect();
      return { obj: bx(sel), ink: sel === '#floatingAddBtn' ? [o.left + I, o.top + I, o.right - I, o.bottom - I].map(v => +v.toFixed(1)) : undefined, acct: bx('#accountBtn'), zoom: bx('.leaflet-control-zoom'),
        tagGap: typeof TAG_SHEET_GAP !== 'undefined' ? TAG_SHEET_GAP : null, tag: bx('.tag-popup .tag-body'), sheetTop: Math.round(document.getElementById('locations').getBoundingClientRect().top),
        credit: bx('.leaflet-control-attribution'), creditText: (document.querySelector('.leaflet-control-attribution') || {}).textContent, submit: bx('#submitBtn'), collapseBtn: bx('#collapseBtn'),
        title: (document.querySelector('#locationsHeader h2') || {}).textContent, locate: bx('#centerMeBtn svg'),
        rows: [...document.querySelectorAll('#locationsList .location-card[data-id]')].filter(c => { const r = c.getBoundingClientRect(); return r.top >= lst.top - 1 && r.bottom <= Math.min(lst.bottom, innerHeight) + 1; }).length };
    }, sel);
    m.errs = errs; m.clash = [...await chromeCheck(page), ...await objClash(page, sel)];
    meas[name] = m; console.log(name, JSON.stringify(m));
    fs.mkdirSync(path.join(C, OUT[s.k]), { recursive: true });
    await page.screenshot({ path: path.join(C, OUT[s.k], `${name.replace(/-1x$/, '')}-${s.dsf === 1 ? 1 : 3}x.png`) });
    await ctx.close(); fs.unlinkSync(html);
  }
  for (const k of ['F', 'A']) { const names = Object.keys(meas).filter(n => F[n].k === k); if (!names.length) continue;
    const f = path.join(C, OUT[k], 'measure.json'); const prev = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {};
    names.forEach(n => prev[n] = meas[n]); fs.writeFileSync(f, JSON.stringify(prev, null, 1)); }
  await b.close();
})();
