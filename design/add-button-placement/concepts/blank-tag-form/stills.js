// CONCEPTS turn 1 raw frames (visual designer): the blank-tag form, P (blank pin), A (header tag), the Float frame.
// Copies of TODAY'S MAIN in memory + blank.inc.html (+ A's stub r5/r6/r7 layers for A). The real index.html is never touched.
// Run: node stills.js  (ONLY=<comma prefixes>)  then: node compose.js
const L = require('../lib-render.js'); const chromeCheck = require('../chrome-check.js'); const fs = require('fs'); const path = require('path');
const C = __dirname, CON = path.dirname(C), real = fs.readFileSync('/home/user/triplet/index.html', 'utf8'), rd = f => fs.readFileSync(path.join(CON, f), 'utf8');
const BT = fs.readFileSync(path.join(C, 'blank.inc.html'), 'utf8');
const inj = (h, incs, attrs) => { const i = h.lastIndexOf('</body>'); return (h.slice(0, i) + incs.join('\n') + '\n' + h.slice(i)).replace('<html lang="en"', `<html lang="en" ${attrs}`); };
// the credit's "Leaflet |" prefix drops below a 338px map (the Float's rule; P needs it at 320)
const PREFIX = `<script>(function () { const t = setInterval(() => { try { if (map && map.attributionControl) { if (map.getSize().x < 338) map.attributionControl.setPrefix(false); clearInterval(t); } } catch (e) {} }, 50); })();</script>`;
const HTML = {
  today: real,
  P: inj(real, [BT, PREFIX], 'data-k="P"'),
  A: inj(real, [rd('stub/r5.inc.html'), rd('stub/r6.inc.html'), rd('stub/r7.inc.html'), BT], 'data-k="A" data-a="tag7" data-eye="none"'),
  F: inj(real, [BT, PREFIX], 'data-k="F"'),
};
// C (pin+tag button, round 9): k = 'C' (the pick) or 'C:<pin>:<stub>:<plus>' for the variants
const CINC = fs.readFileSync(path.join(CON, 'C-pintag/c.inc.html'), 'utf8');
const CPICK = ['fill', 'third', 'tag'];
const CREST = process.env.CC ? JSON.parse(process.env.CC) : [64.1460, -21.9380];
const htmlFor = k => { if (!k.startsWith('C')) return HTML[k]; const [pin, stub, plus, ps] = k === 'C' ? CPICK : k.split(':').slice(1);
  return inj(real, [BT, CINC, PREFIX], `data-k="C" data-cpin="${pin}" data-cstub="${stub}" data-cplus="${plus}" data-cps="${ps || ''}"`); };
// ---------- helpers ----------
const zoomIn = (p, c) => p.evaluate(c => map.setView(c || [64.1471, -21.9426], 14, { animate: false }), c);
const rowId = (p, name) => p.evaluate(n => locations.find(l => l.name === n && l.city === 'reykjavik').id, name);
async function openPlace(p, name, collapse) {
  const id = await rowId(p, name);
  await p.evaluate(id => { const l = locations.find(l => l.id === id); if (l && l.name === 'Sundhöllin') l.short_address = 'Barónsstígur 45a · Reykjavík'; }, id);
  await p.click(`#locationsList .location-card[data-id="${id}"]`); await p.waitForTimeout(1900);
  if (collapse) { await p.click('#collapseBtn'); await p.waitForTimeout(1200); }
}
const restP = p => p.evaluate(() => __BT.restP());
const hideP = p => p.evaluate(() => { const e = document.getElementById('lp'); if (e) e.classList.add('gone'); });
// capture a real tag as the template, then close it (the blank tag is built from the shipped DOM)
async function template(p) { await openPlace(p, 'Hallgrímskirkja'); await p.evaluate(() => { __BT.capture(); map.closePopup(); }); await p.waitForTimeout(700); }
async function dock(p, s, kbH) { await template(p); await zoomIn(p, s.centre || (process.env.DC ? JSON.parse(process.env.DC) : [64.1440, -21.9400])); await p.waitForTimeout(500); await p.evaluate(([s, h]) => { __BT.dock(s); __BT.kb(true, h); }, [s, kbH]); await p.waitForTimeout(300); }
async function hang(p, s, place = 'Sundhöllin') { await openPlace(p, place, true); await p.evaluate(s => __BT.hang(s), s); await p.waitForTimeout(300); }
const floatBadge = (p, open) => p.evaluate(open => {   // the Float frame: R7's badge (60px, orange, account's scalloped die) at bottom-left
  const a = document.getElementById('accountBtn'), m = getComputedStyle(a).webkitMaskImage || getComputedStyle(a).maskImage;
  let f = document.getElementById('fb'); if (!f) { f = document.createElement('div'); f.id = 'fb'; document.body.appendChild(f); }
  f.style.cssText = `position:fixed;z-index:1500;left:15.2px;width:60px;height:60px;display:flex;align-items:center;justify-content:center;background:${open ? 'var(--navy)' : 'var(--brand-orange)'};-webkit-mask-image:${m};-webkit-mask-size:100% 100%;mask-image:${m};mask-size:100% 100%`;
  f.innerHTML = `<svg width="30" height="30" viewBox="0 0 24 24" style="transform:rotate(${open ? 45 : 0}deg)"><path d="M12 5V19M5 12H19" stroke="${open ? 'var(--paper)' : 'var(--navy)'}" stroke-width="3" stroke-linecap="round"/></svg>`;
  const S = document.getElementById('locations').getBoundingClientRect().top; f.style.top = (S - 20 - 60) + 'px';
}, open);
const fab = p => p.evaluate(() => {   // a stock Material FAB at P's place, for the kill test
  const S = document.getElementById('locations').getBoundingClientRect().top, d = document.createElement('div'); d.id = 'fab';
  d.style.cssText = `position:fixed;z-index:1500;left:16px;top:${S - 20 - 56}px;width:56px;height:56px;border-radius:50%;background:#EE7434;box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12);display:flex;align-items:center;justify-content:center`;
  d.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M5 12H19M12 5V19" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></svg>'; document.body.appendChild(d); });
const v3 = p => p.evaluate(() => {   // V3-B "narrow, not small", for the "also tried" panel
  const S = document.getElementById('locations').getBoundingClientRect().top, d = document.createElement('div'); d.id = 'v3';
  d.style.cssText = `position:fixed;z-index:1;left:16px;top:${S - 26}px;width:120px;height:40px`;
  d.innerHTML = `<div style="position:absolute;inset:0;background:var(--paper-raised);clip-path:polygon(22px 0,98px 0,120px 22px,120px 100%,0 100%,0 22px);filter:drop-shadow(0 0 .5px var(--tag-edge))"></div>
    <div class="tag-patch" style="z-index:1;top:4px"></div>`;
  document.body.appendChild(d);
  const pin = document.createElement('div'); pin.className = 'bt-pin'; pin.innerHTML = __BT.pinSvg(32); pin.style.left = '76px'; pin.style.top = (S - 26 - 44) + 'px'; document.body.appendChild(pin);
  const s = document.createElement('div'); s.style.cssText = `position:fixed;z-index:1550;left:75.25px;top:${S - 26 - 28}px;width:1.5px;height:46px;background:var(--ink-2)`; document.body.appendChild(s);
  const st = document.getElementById('locations'); st.style.zIndex = st.style.zIndex; });
const press = p => p.evaluate(() => document.getElementById('lp').classList.add('press'));
const nbOpen = p => p.evaluate(() => document.getElementById('nb').classList.add('open'));
const blankAll = p => p.evaluate(() => document.querySelectorAll('.leaflet-marker-icon').forEach(m => { if (!m.querySelector('.highlighted-marker')) m.style.visibility = 'hidden'; }));

// ---------- frames ----------
const F = {};
const both = (n, s) => { F[n] = s; F[n + '-1x'] = { ...s, dsf: 1 }; };
const V664 = [390, 664], V320 = [320, 568];
// P: rest beside today; the 1x kill test; pressed; collapsed; tag open (exception); 320; V3
both('today-rest', { k: 'today', zoom: true });
F['f-blank844'] = { k: 'P', zoom: true, run: p => dock(p, { state: 'blank' }) };
both('p-rest', { k: 'P', zoom: true, run: restP });
both('p-fab', { k: 'P', zoom: true, run: fab });
F['p-pressed'] = { k: 'P', zoom: true, run: async p => { await restP(p); await press(p); } };
F['p-collapsed'] = { k: 'P', inset: true, run: async p => { await p.click('#collapseBtn'); await p.waitForTimeout(800); await restP(p); } };
F['p-tag664'] = { k: 'P', vp: V664, run: async p => { await restP(p); await openPlace(p, 'Brauð & Co, the cinnamon bakery on Frakkastígur'); await hideP(p); } };

F['p-rest664'] = { k: 'P', vp: V664, run: restP };
F['p-rest320'] = { k: 'P', vp: V320, zoom: true, centre: process.env.PC ? JSON.parse(process.env.PC) : [64.1420, -21.9380], run: restP };
F['p-v3'] = { k: 'P', zoom: true, run: v3 };
// THE FORM (on P's page: identical for every trigger but the trigger's own cancel)
F['f-blank664'] = { k: 'P', vp: V664, zoom: true, run: p => dock(p, { state: 'blank' }) };
F['f-typing664'] = { k: 'P', vp: V664, zoom: true, run: p => dock(p, { state: 'typing' }) };
F['f-nores664'] = { k: 'P', vp: V664, zoom: true, run: p => dock(p, { state: 'nores', text: 'Hallgrimz' }) };
F['f-picked664'] = { k: 'P', vp: V664, run: p => hang(p, { state: 'picked' }) };
F['f-starred664'] = { k: 'P', vp: V664, run: p => hang(p, { state: 'picked', starred: true, visited: true, notes: 'Bring a towel. Locals swim at 7am; the outdoor hot tubs are the best part' }) };
F['f-inking664'] = { k: 'P', vp: V664, run: p => hang(p, { state: 'picked', inked: 'mid', inking: true }) };
F['f-done664'] = { k: 'P', vp: V664, run: p => openPlace(p, 'Sundhöllin') };
F['f-after664'] = { k: 'P', vp: V664, run: async p => { await openPlace(p, 'Sundhöllin', true); await p.evaluate(() => __BT.alignReal()); await p.waitForTimeout(300); } };
F['f-shape664'] = { k: 'P', vp: V664, run: p => hang(p, { state: 'shape', name: 'Skólavörðuholt', type: 'district' }, 'Tjörnin pond') };
F['f-newcity664'] = { k: 'P', vp: V664, run: async p => { await hang(p, { state: 'newcity', name: 'Time Out Market', addr: 'Av. 24 de Julho 49', city: 'Lisbon', type: 'restaurant' }); await blankAll(p); } };
F['f-failed664'] = { k: 'P', vp: V664, run: p => hang(p, { state: 'failed' }) };
F['f-typing320'] = { k: 'P', vp: V320, zoom: true, centre: [64.1440, -21.9426], run: p => dock(p, { state: 'typing', centre: [64.1500, -21.9480] }, 260) };
F['f-picked320'] = { k: 'P', vp: V320, run: p => hang(p, { state: 'picked' }) };
F['f-typing844'] = { k: 'P', inset: true, zoom: true, centre: [64.1440, -21.9426], run: p => dock(p, { state: 'typing', pinTop: 61, tagTop: 121 }) };
// the pencil comparison (director turn 36, fix 1), at 1x
F['cmp-pencil-1x'] = { k: 'P', vp: V664, dsf: 1, run: p => hang(p, { state: 'picked' }) };
F['cmp-ink-1x'] = { k: 'P', vp: V664, dsf: 1, run: p => openPlace(p, 'Sundhöllin') };
F['cmp-off-1x'] = { k: 'P', vp: V664, dsf: 1, run: async p => { await openPlace(p, 'Sundhöllin'); await p.evaluate(() => document.querySelector('.tag-popup .tag').classList.add('is-off')); } };
F['cmp-blank-1x'] = { k: 'P', dsf: 1, zoom: true, run: p => dock(p, { state: 'blank' }) };
F['cmp-pencil'] = { k: 'P', vp: V664, run: p => hang(p, { state: 'picked' }) };
F['cmp-off'] = { ...F['cmp-off-1x'], dsf: 3 };
F['cmp-blank'] = { ...F['cmp-blank-1x'], dsf: 3 };
// C variants at rest (z14, the account in frame) and 1x, for the look and the squint
for (const v of ['fill:cream:tag', 'fill:navy:tag', 'ring:cream:tag', 'fill:cream:pin', 'fill:third:tag', 'fill:cream:tag:big', 'fill:third:tag:big']) both('cv-' + v.replace(/:/g, '-'), { k: 'C:' + v, zoom: true, centre: CREST });
F['cv-none'] = { k: 'C', zoom: true, dsf: 1, run: p => p.evaluate(() => document.getElementById('cp').classList.add('gone')) };
F['cv-noacct'] = { k: 'C', zoom: true, dsf: 1, run: p => p.evaluate(() => { document.getElementById('cp').classList.add('gone'); document.getElementById('accountBtn').style.visibility = 'hidden'; }) };
// A
both('a-rest', { k: 'A', zoom: true });
F['a-tag664'] = { k: 'A', vp: V664, run: p => openPlace(p, 'Brauð & Co, the cinnamon bakery on Frakkastígur') };
F['a-picked664'] = { k: 'A', vp: V664, run: async p => { await hang(p, { state: 'picked' }); await nbOpen(p); } };
F['a-done664'] = { k: 'A', vp: V664, run: p => openPlace(p, 'Sundhöllin') };
F['a-inking664'] = { k: 'A', vp: V664, run: async p => { await hang(p, { state: 'picked', inked: 'mid', inking: true }); await nbOpen(p); } };
F['a-rest664'] = { k: 'A', vp: V664, zoom: true, centre: [64.1440, -21.9426] };
F['a-after664'] = { k: 'A', vp: V664, run: async p => { await openPlace(p, 'Sundhöllin', true); await p.evaluate(() => __BT.alignReal()); await nbOpen(p); await p.evaluate(() => document.getElementById('nb').classList.remove('open')); await p.waitForTimeout(300); } };
F['a-rest320'] = { k: 'A', vp: V320, zoom: true };
F['a-typing664'] = { k: 'A', vp: V664, zoom: true, run: async p => { await nbOpen(p); await dock(p, { state: 'typing' }); } };
// Float frame
F['fl-rest664'] = { k: 'F', vp: V664, run: p => floatBadge(p, false) };
F['fl-picked664'] = { k: 'F', vp: V664, run: async p => { await hang(p, { state: 'picked', clear: 512 }); await floatBadge(p, true); } };

// ================= ROUND 9 (director turn 38): C pin+tag, the filled tag as a CARD (map still, eyelet empty), pin on ADD =================
const cGone = p => p.evaluate(() => { const e = document.getElementById('cp'); if (e) e.classList.add('gone'); });
async function card(p, s, o = {}) { await template(p); await p.click('#collapseBtn'); await p.waitForTimeout(900); await cGone(p);
  if (o.badge) await floatBadge(p, true);
  await zoomIn(p, o.centre || CREST); await p.waitForTimeout(600); await p.evaluate(s => __BT.card(s), s); await p.waitForTimeout(300); }
const NOTE2 = 'Bring a towel. Locals swim at 7am; the outdoor hot tubs are the best part';
both('r9-today', { k: 'today', zoom: true, centre: CREST });
both('r9-c-rest', { k: 'C', zoom: true, centre: CREST });
both('r9-c-alt', { k: 'C:fill:cream:tag', zoom: true, centre: CREST });
F['r9-c-pressed'] = { k: 'C', zoom: true, centre: CREST, run: p => p.evaluate(() => document.getElementById('cp').classList.add('press')) };
F['r9-c-rest664'] = { k: 'C', vp: V664 };   // the city view (the app's opening fit)
F['r9-c-tapped664'] = { k: 'C', vp: V664, zoom: true, centre: CREST, run: async p => { await dock(p, { state: 'typing' }); await cGone(p); } };
F['r9-c-tag664'] = { k: 'C', vp: V664, run: async p => { await openPlace(p, 'Brauð & Co, the cinnamon bakery on Frakkastígur'); await cGone(p); } };
F['r9-c-rest320'] = { k: 'C', vp: V320, zoom: true, centre: [64.1360, -21.9426] };
F['r9-c-collapsed'] = { k: 'C', inset: true, zoom: true, centre: CREST, run: async p => { await p.click('#collapseBtn'); await p.waitForTimeout(900); } };
F['r9-f-blank664'] = { k: 'C', vp: V664, run: async p => { await dock(p, { state: 'blank' }); await cGone(p); } };
F['r9-f-typing664'] = { k: 'C', vp: V664, run: async p => { await dock(p, { state: 'typing' }); await cGone(p); } };
F['r9-f-nores664'] = { k: 'C', vp: V664, run: async p => { await dock(p, { state: 'nores', text: 'Sundhx' }); await cGone(p); } };
F['r9-f-card664'] = { k: 'C', vp: V664, run: p => card(p, { state: 'picked' }) };
F['r9-f-starred664'] = { k: 'C', vp: V664, run: p => card(p, { state: 'picked', starred: true, visited: true, notes: NOTE2 }) };
F['r9-f-shape664'] = { k: 'C', vp: V664, run: p => card(p, { state: 'shape', name: 'Skólavörðuholt', type: 'district' }) };
F['r9-f-newcity664'] = { k: 'C', vp: V664, run: p => card(p, { state: 'newcity', name: 'Time Out Market', addr: 'Av. 24 de Julho 49', type: 'restaurant' }) };
F['r9-f-failed664'] = { k: 'C', vp: V664, run: p => card(p, { state: 'failed' }) };
F['r9-f-after664'] = { k: 'C', vp: V664, run: async p => { await openPlace(p, 'Sundhöllin', true); await cGone(p); await p.evaluate(() => __BT.alignReal()); await p.waitForTimeout(300); } };
F['r9-f-typing320'] = { k: 'C', vp: V320, run: async p => { await dock(p, { state: 'typing', centre: [64.1500, -21.9480] }, 260); await cGone(p); } };
F['r9-f-card320'] = { k: 'C', vp: V320, run: p => card(p, { state: 'picked' }, { centre: [64.1420, -21.9380] }) };
F['r9-cmp-pencil-1x'] = { k: 'C', vp: V664, dsf: 1, run: p => card(p, { state: 'picked' }) };
F['r9-a-typing664'] = { k: 'A', vp: V664, run: async p => { await nbOpen(p); await dock(p, { state: 'typing' }); } };
F['r9-a-card664'] = { k: 'A', vp: V664, run: async p => { await card(p, { state: 'picked' }); await nbOpen(p); } };
F['r9-fl-card664'] = { k: 'F', vp: V664, run: p => card(p, { state: 'picked', clear: 512 }, { badge: true }) };

(async () => {
  const b = await L.launch(); const meas = {}; fs.mkdirSync(path.join(C, 'raw'), { recursive: true });
  for (const [name, s] of Object.entries(F).filter(([n]) => !process.env.ONLY || process.env.ONLY.split(',').some(p => n.startsWith(p)))) {
    const html = path.join(C, `.st-${s.k.replace(/:/g, '_')}.html`); fs.writeFileSync(html, htmlFor(s.k));
    // the demo place: a pool, which OSM's leisure=swimming_pool maps to ATTRACTION (director, mapping table)
    const JS = `;window.__ROWS.forEach(r => { if (r.name === 'Sundhöllin') { r.category = 'attraction'; r.short_address = 'Barónsstígur 45a · Reykjavík'; } });`;
    const { ctx, page, errs } = await L.open(b, { html, vp: s.vp || [390, 844], dsf: s.dsf, inset: s.inset, js: JS });
    await page.evaluate(() => setActiveCity('reykjavik')); await page.waitForTimeout(900);
    if (s.k === 'A') await page.evaluate(() => window.fitTitle && window.fitTitle());
    if (s.zoom) { await zoomIn(page, s.centre); await page.waitForTimeout(900); }
    if (s.run) await s.run(page);
    await page.waitForTimeout(500);
    const m = await page.evaluate(() => { const bx = q => { const e = document.querySelector(q); if (!e) return null; const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return 'hidden'; const r = e.getBoundingClientRect(); return r.width ? [r.left, r.top, r.right, r.bottom].map(v => +v.toFixed(1)) : 'hidden'; };
      const A = document.getElementById('accountBtn').getBoundingClientRect();
      const acctPins = [...document.querySelectorAll('.leaflet-marker-icon')].filter(m => { const r = m.getBoundingClientRect(); return getComputedStyle(m).visibility !== 'hidden' && r.right > A.left - 4 && r.left < A.right + 4 && r.bottom > A.top - 4 && r.top < A.bottom + 4; }).length;
      const eye = document.querySelector('#btDock .tag-patch'); let eyePin = null;
      if (eye) { const e = eye.getBoundingClientRect(), cx = (e.left + e.right) / 2, cy = e.top + 14;
        eyePin = [...document.querySelectorAll('.leaflet-marker-icon')].filter(m => { const r = m.getBoundingClientRect(); return cx > r.left - 7 && cx < r.right + 7 && cy > r.top - 7 && cy < r.bottom + 7; }).length; }
      const LP = document.getElementById('lp') || document.getElementById('cp'); const lpPins = LP ? [...document.querySelectorAll('.leaflet-marker-icon')].filter(m => { const r = m.getBoundingClientRect(), q = LP.getBoundingClientRect(); return r.right > q.left - 4 && r.left < q.right + 4 && r.bottom > q.top - 4 && r.top < q.bottom + 4; }).length : null;
      const taps = window.__BT && __BT.taps && document.getElementById('btDock') ? __BT.taps() : null;
      return { taps, acctPins, eyePin, lpPins, lp: bx('#lp'), nb: bx('#nb'), acct: bx('#accountBtn'), credit: bx('.leaflet-control-attribution'), tag: bx('.tag-popup .tag-body'), add: bx('.bt-add'), pin: bx('#btPin'), sheetTop: Math.round(document.getElementById('locations').getBoundingClientRect().top) }; });
    m.errs = errs; m.clash = await chromeCheck(page);
    meas[name] = m; console.log(name, JSON.stringify(m));
    await page.screenshot({ path: path.join(C, 'raw', `${name.replace(/-1x$/, '')}-${s.dsf === 1 ? 1 : 3}x.png`) });
    await ctx.close(); fs.unlinkSync(html);
  }
  const f = path.join(C, 'raw', 'measure.json'); const prev = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {};
  Object.assign(prev, meas); fs.writeFileSync(f, JSON.stringify(prev, null, 1));
  await b.close();
})();
