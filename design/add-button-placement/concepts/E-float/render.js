// Baseline E (Float) -- systems pass: today's badge floated to a bottom corner, riding the sheet edge.
// Builds ./index.html = a COPY of the real index.html with concept.inc.html injected before </body>
// (+ one builder fix: the floated + no longer counts as a TOP control in pinPopupTopPad()).
// Run: node render.js            -> frames/<variant>/<state>-3x.png + measure.json
//      VARIANTS=r-gutter-16 ONLY=rest node render.js
const L = require('../lib-render.js'); const chromeCheck = require('../chrome-check.js'); const fs = require('fs'); const path = require('path');
const REAL = '/home/user/la-trip-map/index.html', COPY = path.join(__dirname, 'index.html'), OUT = path.join(__dirname, 'frames');
let src = fs.readFileSync(REAL, 'utf8');
const TOPPAD = "for (const el of [document.querySelector('.leaflet-control-zoom'), document.getElementById('floatingAddBtn'), document.getElementById('accountBtn')]) {";
if (!src.includes(TOPPAD)) throw new Error('pinPopupTopPad line moved');
if (!src.includes('const TAG_SHEET_GAP = 48;')) throw new Error('TAG_SHEET_GAP moved');
src = src.replace('const TAG_SHEET_GAP = 48;', 'let TAG_SHEET_GAP = 48;');   // so the concept can make it badge-aware
src = src.replace(TOPPAD, "for (const el of [document.querySelector('.leaflet-control-zoom'), document.getElementById('accountBtn')]) {");
fs.writeFileSync(COPY, src.replace('</body>', fs.readFileSync(path.join(__dirname, 'concept.inc.html'), 'utf8') + '\n</body>'));

// variant = corner-align-gap[-form][-credit]
const ALL = {
  'r-gutter-16': { corner: 'r', align: 'gutter', gap: 16 }, 'r-axis-16': { corner: 'r', align: 'axis', gap: 16 }, 'r-ink-16': { corner: 'r', align: 'ink', gap: 16 },
  'l-gutter-16': { corner: 'l', align: 'gutter', gap: 16 }, 'l-axis-16': { corner: 'l', align: 'axis', gap: 16 }, 'l-ink-16': { corner: 'l', align: 'ink', gap: 16 },
  'r-ink-12': { corner: 'r', align: 'ink', gap: 12 }, 'l-ink-12': { corner: 'l', align: 'ink', gap: 12 },
  'r-gutter-20': { corner: 'r', align: 'gutter', gap: 19.9 }, 'l-gutter-20': { corner: 'l', align: 'gutter', gap: 19.9 },   // THE PICK: box 16 from the side AND the edge (ink 19.9 both)
  'r-ink-16-lift': { corner: 'r', align: 'ink', gap: 16, credit: 'lift' },
};
const STATES = {
  rest_844: { vp: [390, 844] },
  axes_844: { vp: [390, 844], axes: true, clip: { x: 0, y: 440, width: 390, height: 230 } },   // alignment close-up, axes drawn (this frame only)
  collapsed_safe: { vp: [390, 844], inset: true, pre: 'collapse' },
  tag_844: { vp: [390, 844], pre: 'tag' },
  tag_664: { vp: [390, 664], pre: 'tag' },
  form_844: { vp: [390, 844], q: '?play', tap: true, form: 'ride' },
  form_664: { vp: [390, 664], q: '?play', tap: true, form: 'ride' },
  formstay_844: { vp: [390, 844], q: '?play', tap: true, form: 'stay' },
  formstay_664: { vp: [390, 664], q: '?play', tap: true, form: 'stay' },
  formcol_safe: { vp: [390, 844], inset: true, q: '?play', pre: 'collapse', tap: true, form: 'ride' },
  tagform_844: { vp: [390, 844], q: '?play', pre: 'tag', tap: true, form: 'ride', cancel: true },
  filters_844: { vp: [390, 844], pre: 'filters' },
  filtersride_844: { vp: [390, 844], pre: 'filters', filters: 'ride' },
  filtersride_664: { vp: [390, 664], pre: 'filters', filters: 'ride' },
  tagtall_844: { vp: [390, 844], pre: 'tagtall' },
  tagtall_664: { vp: [390, 664], pre: 'tagtall' },
  tag48_664: { vp: [390, 664], pre: 'tag', taggap: '48' },
  filters_tap_844: { vp: [390, 844], q: '?play', pre: 'filters', filters: 'ride', tap: true, form: 'ride' },
  cph_320: { vp: [320, 568], city: 'copenhagen' },
  cph_320_form: { vp: [320, 568], city: 'copenhagen', q: '?play', tap: true, form: 'ride' },
  rest_664: { vp: [390, 664] },
  signedout_tap: { vp: [390, 844], q: '?signin', tap: true },
  desktop_rest: { vp: [1280, 800], desk: true },
};
const want = (process.env.VARIANTS || 'r-ink-16,l-ink-16').split(',');
const FULL = (process.env.FULL || 'r-ink-16,l-ink-16,r-gutter-20,l-gutter-20').split(',');   // all states; the others get rest + collapsed + 320 only
const SHORT = ['axes_844', 'rest_844', 'collapsed_safe', 'cph_320', 'tag_844', 'tag_664'];

const measureFab = page => page.evaluate(() => {
  const R = e => { if (!e) return null; const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return null; const r = e.getBoundingClientRect(); return r.width ? r : null; };
  const f = R(document.getElementById('floatingAddBtn')); if (!f) return null;
  const I = 3.9, ink = { l: f.left + I, t: f.top + I, r: f.right - I, b: f.bottom - I };
  const edge = __floatEdge();
  const ov = (a, b) => a && b && Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1;
  const gapTo = (b) => b ? { dx: +Math.max(b.left - f.right, f.left - b.right).toFixed(1), dy: +Math.max(b.top - f.bottom, f.top - b.bottom).toFixed(1) } : null;
  const credit = R(document.querySelector('.leaflet-control-attribution')), tag = R(document.querySelector('.tag-popup .tag-body')) || R(document.querySelector('.tag-popup')),
    zoom = R(document.querySelector('.leaflet-control-zoom')), acct = R(document.getElementById('accountBtn')), sub = R(document.getElementById('submitBtn')),
    panel = document.getElementById('filtersPanel').classList.contains('visible') ? R(document.getElementById('filtersPanel')) : null, sheet = R(document.getElementById('locations'));
  const formParts = [...document.querySelectorAll('#addForm input, #addForm select, #addForm textarea, #addForm .form-star, #addForm .field-label')].map(R).filter(Boolean);
  const markers = [...document.querySelectorAll('.leaflet-marker-icon')].map(R).filter(Boolean);
  const cx = (f.left + f.right) / 2, cy = (f.top + f.bottom) / 2, el = document.elementFromPoint(cx, cy);
  const t = tag;
  return { box: [f.left, f.top, f.right, f.bottom].map(v => +v.toFixed(1)), ink: [ink.l, ink.t, ink.r, ink.b].map(v => +v.toFixed(1)), centre: [+cx.toFixed(1), +cy.toFixed(1)],
    inkFromLeft: +ink.l.toFixed(1), inkFromRight: +(innerWidth - ink.r).toFixed(1), edge: +edge.toFixed(1), inkGap: +(edge - ink.b).toFixed(1),
    hit: el ? (el.closest('#floatingAddBtn') ? 'self' : (el.id || el.className || el.tagName)) : null, active: document.getElementById('floatingAddBtn').classList.contains('active'),
    credit: credit && [credit.left, credit.top, credit.right, credit.bottom].map(Math.round), creditGap: gapTo(credit), overCredit: ov(f, credit),
    tag: t && [t.left, t.top, t.right, t.bottom].map(Math.round), tagGap: gapTo(t), overTag: ov(f, t), tagFootToSheet: t && sheet ? Math.round(sheet.top - t.bottom) : null,
    overZoom: ov(f, zoom), overAcct: ov(f, acct), overPanel: ov(f, panel), overSheet: ov(f, sheet),
    formFieldsUnder: formParts.filter(p => ov(f, p)).length, submit: sub && [sub.left, sub.top, sub.right, sub.bottom].map(Math.round), submitGap: gapTo(sub),
    submitCentreDy: sub ? +(((sub.top + sub.bottom) / 2) - cy).toFixed(1) : null,
    submitHit: sub ? (() => { const e = document.elementFromPoint((sub.left + sub.right) / 2, (sub.top + sub.bottom) / 2); return e && (e.id || e.className); })() : null,
    pinsUnder: markers.filter(m => ov(f, m)).length };
});

(async () => {
  const b = await L.launch(); const out = fs.existsSync(path.join(__dirname, 'measure.json')) ? JSON.parse(fs.readFileSync(path.join(__dirname, 'measure.json'), 'utf8')) : {};
  for (const vn of want) {
    const v = ALL[vn]; if (!v) throw new Error('no variant ' + vn); out[vn] = out[vn] || {};
    const states = Object.entries(STATES).filter(([n]) => (FULL.includes(vn) || SHORT.includes(n)) && (!process.env.ONLY || n.startsWith(process.env.ONLY)));
    fs.mkdirSync(path.join(OUT, vn), { recursive: true });
    for (const [name, s] of states) {
      const attrs = `data-corner="${v.corner}" data-align="${v.align}" data-gap="${v.gap}" data-form="${s.form || 'ride'}" data-credit="${v.credit || 'move'}" data-filters="${s.filters || 'under'}" data-taggap="${s.taggap || 'clear'}"`;
      const { ctx, page, errs } = await L.open(b, { html: COPY, ...s, patch: h => h.replace('<html lang="en"', `<html lang="en" ${attrs}`) });
      if (s.city) { await page.evaluate(c => setActiveCity(c), s.city); await page.waitForTimeout(900); }
      if (s.pre === 'collapse') { await page.click('#collapseBtn'); await page.waitForTimeout(600); }
      if (s.pre === 'filters') { await page.click('#toggleFiltersBtn'); await page.waitForTimeout(600); }
      if (s.pre === 'tag') {   // a STARRED place, so the tag carries the orange band and the row goes navy
        const id = await page.evaluate(() => { const l = locations.find(l => l.starred && document.querySelector(`#locationsList .location-card[data-id="${l.id}"]`)); return l && l.id; });
        await page.click(`#locationsList .location-card[data-id="${id}"]`); await page.waitForTimeout(1900);
      }
      if (s.pre === 'tagtall') {   // the place with the longest notes: the tallest tag
        const id = await page.evaluate(() => { const l = locations.filter(l => document.querySelector(`#locationsList .location-card[data-id="${l.id}"]`)).sort((a, b) => (b.notes || '').length - (a.notes || '').length)[0]; return l && l.id; });
        await page.click(`#locationsList .location-card[data-id="${id}"]`); await page.waitForTimeout(1900);
      }
      await page.waitForTimeout(100);
      const m = { before: await measureFab(page), rows: await L.rowsVisible(page), tagScrolls: await page.evaluate(() => !!document.querySelector('.tag-popup .tag-in.scrolls')), sheetLower: await page.evaluate(() => document.documentElement.style.getPropertyValue('--sheet-lower')), tagGapConst: await page.evaluate(() => TAG_SHEET_GAP) };
      if (s.tap) {
        if (s.form !== 'ride') await page.evaluate(() => document.documentElement.dataset.form = 'stay');
        await page.click('#floatingAddBtn'); await page.waitForTimeout(900);
        m.authModal = await page.evaluate(() => document.getElementById('authModal').classList.contains('show'));
        m.formOpen = await page.evaluate(() => document.getElementById('addForm').classList.contains('show'));
        m.panelOpen = await page.evaluate(() => document.getElementById('filtersPanel').classList.contains('visible'));
        m.after = await measureFab(page);
        m.formBox = await L.box(page, '#controls');
      }
      m.chrome = await chromeCheck(page); m.errs = errs;
      if (s.axes) await page.evaluate(() => {   // measured ink lines: row-icon ring ink 19 / axis 30; locate ink 367.2 / x axis 360; the sheet edge
        const W = innerWidth, edge = __floatEdge(), f = document.getElementById('floatingAddBtn').getBoundingClientRect();
        const lines = [[19, '#0a8'], [30, '#0a8'], [W - 22.8, '#c3c'], [W - 30, '#c3c'], [f.left + 3.9, '#e33'], [f.right - 3.9, '#e33']];
        const o = document.createElement('div'); o.style.cssText = 'position:fixed;inset:0;z-index:5000;pointer-events:none';
        o.innerHTML = lines.map(([x, c]) => `<div style="position:absolute;left:${x}px;top:0;bottom:0;border-left:1px dashed ${c};opacity:.8"></div>`).join('')
          + `<div style="position:absolute;left:0;right:0;top:${edge}px;border-top:1px dashed #33f"></div><div style="position:absolute;left:0;right:0;top:${f.bottom - 3.9}px;border-top:1px dashed #e33"></div>`;
        document.body.appendChild(o); });
      await page.screenshot({ path: `${OUT}/${vn}/${name}-${s.desk ? 1 : 3}x.png`, clip: s.clip });
      if (s.cancel) {
        await page.click('#floatingAddBtn'); await page.waitForTimeout(1200);
        m.afterCancel = { fab: await measureFab(page), listCollapsed: await page.evaluate(() => document.getElementById('locations').classList.contains('collapsed')),
          tagKey: await page.evaluate(() => openTagKey()), draft: await page.evaluate(() => document.getElementById('nameInput').value) };
      }
      out[vn][name] = m; console.log(vn, name, JSON.stringify(m));
      await ctx.close();
    }
    // pins under the resting badge: every city, list up and collapsed (1x, 390x844)
    if (!process.env.ONLY) {
      out[vn].pins = {};
      for (const city of ['la', 'reykjavik', 'copenhagen', 'malmo', 'stockholm']) for (const col of [false, true]) {
        const attrs = `data-corner="${v.corner}" data-align="${v.align}" data-gap="${v.gap}" data-credit="${v.credit || 'move'}"`;
        const { ctx, page } = await L.open(b, { html: COPY, vp: [390, 844], dsf: 1, patch: h => h.replace('<html lang="en"', `<html lang="en" ${attrs}`) });
        await page.evaluate(c => setActiveCity(c), city); await page.waitForTimeout(900);
        if (col) { await page.click('#collapseBtn'); await page.waitForTimeout(600); }
        const f = await measureFab(page);
        out[vn].pins[city + (col ? '_collapsed' : '')] = { under: f.pinsUnder, total: await page.evaluate(() => document.querySelectorAll('.leaflet-marker-icon').length) };
        await ctx.close();
      }
      console.log(vn, 'pins', JSON.stringify(out[vn].pins));
    }
  }
  fs.writeFileSync(path.join(__dirname, 'measure.json'), JSON.stringify(out, null, 1));
  await b.close();
})();
