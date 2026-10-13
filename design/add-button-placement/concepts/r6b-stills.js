// ROUND 6b raw frames (visual designer, after director turn 23). Built like systems' r6-check/check.js: copies of TODAY'S
// MAIN index.html (signed out = the playground) with the concept layers injected in memory. The real index.html is only
// read. Float: the full phone screens at the 60px badge (TAG_SHEET_GAP 88 = data-taggap="box", the scale-aware Add =
// data-fix="rect", "Leaflet |" dropped). C: the rank dials, then the pick's tag-open frame and add strip in the new pin.
// Run: node r6b-stills.js  (ONLY=<comma prefixes>)   then: node compose-r6.js
const L = require('./lib-render.js'); const chromeCheck = require('./chrome-check.js'); const fs = require('fs'); const path = require('path');
const C = __dirname, REAL = '/home/user/la-trip-map/index.html';
const rd = f => fs.readFileSync(path.join(C, f), 'utf8');
const real = fs.readFileSync(REAL, 'utf8');
// ---- Float copy (systems' r6-check patches, verbatim in effect) ----
const TOPPAD = "for (const el of [document.querySelector('.leaflet-control-zoom'), document.getElementById('floatingAddBtn'), document.getElementById('accountBtn')]) {";
if (!real.includes(TOPPAD) || !real.includes('const TAG_SHEET_GAP = 48;')) throw new Error('main moved: patch strings not found');
const floatBase = real.replace('const TAG_SHEET_GAP = 48;', 'let TAG_SHEET_GAP = 48;')
  .replace(TOPPAD, "for (const el of [document.querySelector('.leaflet-control-zoom'), document.getElementById('accountBtn')]) {");
const eInc = rd('E-float/concept.inc.html')
  .replace("(root.dataset.taggap || 'clear') === 'clear' ? Math.ceil(c.gap - INK + 50 + liftForCredit(c) + 12) : 48",
    "(root.dataset.taggap || 'clear') === 'clear' ? Math.ceil(c.gap - INK + 50 + liftForCredit(c) + 12) : root.dataset.taggap === 'box' ? Math.ceil(__floatEdge() - fab.getBoundingClientRect().top + 12) : (+root.dataset.taggap || 48)")
  .replace('const H = 44, edge = __floatEdge(), bc = top + 25;',
    "const H = 44, edge = __floatEdge(), FR = fab.getBoundingClientRect(), fix = root.dataset.fix === 'rect', bc = fix ? (FR.top + FR.bottom) / 2 : top + 25;")
  .replace('const fl = parseFloat(fab.style.left), padL = 56, padR = 16;', "const fl = fix ? FR.left : parseFloat(fab.style.left), padL = 56, padR = 16;");
if (!eInc.includes("dataset.taggap === 'box'") || !eInc.includes("fix ? FR.left")) throw new Error('E inc patch failed');
const R17 = `<style id="floatR17">#floatingAddBtn.active { background: var(--navy); color: var(--paper); }
  #floatingAddBtn.active:active { background: var(--state-on-press); color: var(--paper); }</style>
<script>(function () { const t = setInterval(() => { try { if (map && map.attributionControl) { map.attributionControl.setPrefix(false); clearInterval(t); } } catch (e) {} }, 50); })();</script>`;
const PICK = 'data-corner="r" data-align="gutter" data-gap="19.9" data-form="ride" data-credit="move" data-filters="under" data-ff="orange" data-fs="1.2" data-fc="seal" data-taggap="box" data-fix="rect"';
const inj = (h, incs, attrs) => { const i = h.lastIndexOf('</body>'); return (h.slice(0, i) + incs.join('\n') + '\n' + h.slice(i)).replace('<html lang="en"', `<html lang="en" ${attrs}`); };
const floatHtml = () => inj(floatBase, [eInc, R17, rd('E-float/r6.inc.html')], PICK);
const cHtml = a => inj(real, [rd('C-pin/concept.inc.html'), rd('C-pin/visual.inc.html'), rd('C-pin/visual-r5.inc.html'), rd('C-pin/visual-r6.inc.html')],
  `data-c="ring" data-ring="graphite" ${/data-c6=/.test(a) ? '' : 'data-c6="hi"'} ${a}`);
const CPICK = 'data-ct="xl" data-te="edge" data-al="ink" data-c6="hio"';   // round 6b pick: the selected pin in the action orange
const CNAVY = 'data-ct="xl" data-te="edge" data-al="ink"';
// ---- C's add flow helpers (from C-pin/stills.js) ----
const PICKED = { lat: 64.1417, lon: -21.9266, name: 'Hallgrímskirkja, Hallgrímstorg 1, Miðborg, Reykjavík, 101, Iceland',
  ad: { tourism: 'attraction', house_number: '1', road: 'Hallgrímstorg', suburb: 'Miðborg', city: 'Reykjavík', postcode: '101', country: 'Iceland', country_code: 'is' } };
const RESULTS = [PICKED, { lat: 64.1466, lon: -21.9426, name: 'Hallgrímskirkja bus stop, Skólavörðustígur, Reykjavík, Iceland', ad: { city: 'Reykjavík', country_code: 'is' } },
  { lat: 64.135, lon: -21.89, name: 'Hallgríms Bistro, Laugavegur 120, Reykjavík, Iceland', ad: { city: 'Reykjavík', country_code: 'is' } },
  { lat: 65.68, lon: -18.09, name: 'Hallgrímskirkja, Akureyri, Iceland', ad: { town: 'Akureyri', country_code: 'is' } }];
const showResults = (page, typed) => page.evaluate(({ R, typed }) => {
  const n = document.getElementById('nameInput'); n.value = typed; const ac = document.getElementById('addressAutocomplete');
  ac.innerHTML = R.map(r => `<div class="autocomplete-item" data-lat="${r.lat}" data-lon="${r.lon}" data-name="${r.name}" data-address-details='${JSON.stringify(r.ad)}'>${r.name}</div>`).join('');
  ac.querySelectorAll('.autocomplete-item').forEach(i => { i.onclick = () => selectAddress(i); }); ac.classList.add('show');
}, { R: RESULTS, typed });
const fakeKb = (page, kbH) => page.evaluate(kbH => { window.__fakeVV = { height: innerHeight - kbH, offsetTop: 0 }; window.__conceptKb();
  const k = document.createElement('div'); k.id = 'fakeKb'; k.style.cssText = `position:fixed;left:0;right:0;bottom:0;height:${kbH}px;z-index:3000;background:#CED2D9;font:600 13px -apple-system,system-ui,sans-serif;color:#6b7280;text-align:center;padding-top:18px;box-sizing:border-box`; k.textContent = 'iOS keyboard (drawn stand-in)'; document.body.appendChild(k); }, kbH);
const tapPin = async page => { await page.click('#pencilPin .c6-tagw'); await page.waitForTimeout(900); };
const placed = async page => { await tapPin(page); await showResults(page, 'Hallgr'); await page.click('.autocomplete-item'); await page.waitForTimeout(500); await page.selectOption('#categoryInput', 'attraction'); await page.waitForTimeout(400); };
const starTag = async p => { const id = await p.evaluate(() => (locations.find(l => l.starred && l.visited && document.querySelector(`#locationsList .location-card[data-id="${l.id}"]`)) || locations.find(l => l.starred && document.querySelector(`#locationsList .location-card[data-id="${l.id}"]`)) || {}).id);
  await p.click(`#locationsList .location-card[data-id="${id}"]`); await p.waitForTimeout(1900); };
const zoomIn = p => p.evaluate(() => map.setView([64.1471, -21.9426], 14, { animate: false }));
const PLAY = "try { localStorage.removeItem('sb-jgvckilmltimabfdvaly-auth-token'); } catch (e) {}";

const F = {};
const both = (n, s) => { F[n] = s; F[n + '-1x'] = { ...s, dsf: 1 }; };
// ---- Float: full phone screens at the 60px badge ----
F['f-tag664'] = { k: 'F', vp: [390, 664], run: starTag };
F['f-form844'] = { k: 'F', vp: [390, 844], run: async p => { await p.click('#floatingAddBtn'); await p.waitForTimeout(1100); } };
F['f-tag320'] = { k: 'F', vp: [320, 568], city: 'copenhagen', run: starTag };
F['f-tag844'] = { k: 'F', vp: [390, 844], run: starTag };
// ---- C: rank dials (zoomed view, real pins in frame) ----
both('c-big', { k: 'C', a: 'data-ct="big" data-al="ink"', zoom: true });
both('c-big-edge', { k: 'C', a: 'data-ct="big" data-te="edge" data-al="ink"', zoom: true });
both('c-xl', { k: 'C', a: 'data-ct="xl" data-al="ink"', zoom: true });
both('c-xl-edge', { k: 'C', a: CNAVY, zoom: true });
both('c-xl-edge-orange', { k: 'C', a: CPICK, zoom: true });
F['c-pick-pressed'] = { k: 'C', a: CPICK, zoom: true, run: p => p.evaluate(() => document.getElementById('pencilPin').classList.add('press')) };
// ---- C: the pick through the flow ----
F['c-tag844'] = { k: 'C', a: CPICK, run: starTag };
F['c-2a-tap-664'] = { k: 'C', a: CPICK, vp: [390, 664] };
F['c-2b-search-664'] = { k: 'C', a: CPICK, vp: [390, 664], run: async p => { await tapPin(p); await showResults(p, 'Hallgr'); await fakeKb(p, 336); await p.waitForTimeout(300); } };
F['c-2c-placed-664'] = { k: 'C', a: CPICK, vp: [390, 664], run: placed };
F['c-2d-done-844'] = { k: 'C', a: CPICK, vp: [390, 844], play: true, run: async p => { await placed(p); await p.click('#submitBtn'); await p.waitForTimeout(3800); } };

const OUTS = { F: 'E-float/r6', C: 'C-pin/r6' }, SEL = { F: '#floatingAddBtn', C: '#pencilPin' };
const objClash = (page, sel) => page.evaluate(sel => {
  const vis = q => { const e = typeof q === 'string' ? document.querySelector(q) : q; if (!e) return null; const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return null; const r = e.getBoundingClientRect(); return r.width ? r : null; };
  const f = vis(sel); if (!f) return [];
  const ov = b => b && Math.min(f.right, b.right) - Math.max(f.left, b.left) > 1 && Math.min(f.bottom, b.bottom) - Math.max(f.top, b.top) > 1;
  const out = [];
  for (const [n, q] of Object.entries({ credit: '.leaflet-control-attribution', tag: '.tag-popup .tag-body', zoom: '.leaflet-control-zoom', account: '#accountBtn', submit: '#submitBtn' })) if (ov(vis(q))) out.push('plus x ' + n);
  if (ov(vis('#locations'))) out.push('plus x sheet');
  for (const m of document.querySelectorAll('.leaflet-marker-icon')) if (ov(m.getBoundingClientRect())) { out.push('plus x pin'); break; }
  return out; }, sel);
(async () => {
  const b = await L.launch(); const meas = {};
  for (const [name, s] of Object.entries(F).filter(([n]) => !process.env.ONLY || process.env.ONLY.split(',').some(p => n.startsWith(p)))) {
    const html = path.join(C, `.r6b-${s.k}.html`); fs.writeFileSync(html, s.k === 'F' ? floatHtml() : cHtml(s.a));
    const { ctx, page, errs } = await L.open(b, { html, vp: s.vp || [390, 844], dsf: s.dsf, js: s.play ? PLAY : '' });
    await page.evaluate(c => setActiveCity(c), s.city || 'reykjavik'); await page.waitForTimeout(900);
    if (s.zoom) { await zoomIn(page); await page.waitForTimeout(900); }
    if (s.run) await s.run(page);
    await page.waitForTimeout(400);
    const sel = SEL[s.k];
    const m = await page.evaluate(sel => {
      const bx = q => { const e = document.querySelector(q); if (!e) return null; const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return 'hidden'; const r = e.getBoundingClientRect(); return r.width ? [r.left, r.top, r.right, r.bottom].map(v => +v.toFixed(1)) : 'hidden'; };
      const o = document.querySelector(sel); const R = o && o.getBoundingClientRect(), W = innerWidth;
      return { obj: bx(sel), disc: bx(sel + ' .c6-pin svg'), miniTag: bx(sel + ' .c6-tagw'), acct: bx('#accountBtn'), acctInkRight: (() => { const a = document.getElementById('accountBtn').getBoundingClientRect(); return +(a.right - 3.9 * a.width / 50).toFixed(1); })(),
        tagGap: typeof TAG_SHEET_GAP !== 'undefined' ? TAG_SHEET_GAP : null, tag: bx('.tag-popup .tag-body'), sheetTop: Math.round(document.getElementById('locations').getBoundingClientRect().top),
        credit: bx('.leaflet-control-attribution'), creditText: (document.querySelector('.leaflet-control-attribution') || {}).textContent, submit: bx('#submitBtn'), blank: bx('#blankTag'), marker: bx('.pencil-marker'),
        rows: [...document.querySelectorAll('#locationsList .location-card[data-id]')].filter(c => { const r = c.getBoundingClientRect(), l = document.getElementById('locationsList').getBoundingClientRect(); return r.top >= l.top - 1 && r.bottom <= Math.min(l.bottom, innerHeight) + 1; }).length };
    }, sel);
    m.errs = errs; m.clash = [...await chromeCheck(page), ...await objClash(page, sel)];
    meas[name] = m; console.log(name, JSON.stringify(m));
    await page.screenshot({ path: path.join(C, OUTS[s.k], `${name.replace(/-1x$/, '')}-${s.dsf === 1 ? 1 : 3}x.png`) });
    await ctx.close(); fs.unlinkSync(html);
  }
  for (const k of ['F', 'C']) { const names = Object.keys(meas).filter(n => F[n].k === k); if (!names.length) continue;
    const f = path.join(C, OUTS[k], 'measure-r6b.json'); const prev = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {};
    names.forEach(n => prev[n] = meas[n]); fs.writeFileSync(f, JSON.stringify(prev, null, 1)); }
  await b.close();
})();
