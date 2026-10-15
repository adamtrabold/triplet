// CONCEPTS turn 1 raw frames (visual designer): the blank-tag form, P (blank pin), A (header tag), the Float frame.
// Copies of TODAY'S MAIN in memory + blank.inc.html (+ A's stub r5/r6/r7 layers for A). The real index.html is never touched.
// Run: node stills.js  (ONLY=<comma prefixes>)  then: node compose.js
const L = require('../lib-render.js'); const chromeCheck = require('../chrome-check.js'); const fs = require('fs'); const path = require('path');
const C = __dirname, CON = path.dirname(C), real = fs.readFileSync('/home/user/triplet/index.html', 'utf8'), rd = f => fs.readFileSync(path.join(CON, f), 'utf8');
const BT = fs.readFileSync(path.join(C, 'blank.inc.html'), 'utf8');
const inj = (h, incs, attrs) => { const i = h.lastIndexOf('</body>'); return (h.slice(0, i) + incs.join('\n') + '\n' + h.slice(i)).replace('<html lang="en"', `<html lang="en" ${attrs}`); };
// the credit's "Leaflet |" prefix drops below a 338px map (the Float's rule; P needs it at 320)
const PREFIX = `<script>(function () { const t = setInterval(() => { try { if (map && map.attributionControl) { if (map.getSize().x < 380) map.attributionControl.setPrefix(false); clearInterval(t); } } catch (e) {} }, 50); })();</script>`;
const HTML = {
  today: real,
  P: inj(real, [BT, PREFIX], 'data-k="P"'),
  A: inj(real, [rd('stub/r5.inc.html'), rd('stub/r6.inc.html'), rd('stub/r7.inc.html'), BT], 'data-k="A" data-a="tag7" data-eye="none"'),
  F: inj(real.replace('const TAG_SHEET_GAP = 48;', 'const TAG_SHEET_GAP = 88;'), [BT, PREFIX], 'data-k="F"'),
};
// C (pin+tag button, round 9): k = 'C' (the pick) or 'C:<pin>:<stub>:<plus>' for the variants
const CINC = fs.readFileSync(path.join(CON, 'C-pintag/c.inc.html'), 'utf8');
const CPICK = (process.env.CPICK || 'side:fillplus:rules:0:144:40:4:heavy').split(':');
const CREST = process.env.CC ? JSON.parse(process.env.CC) : [64.1460, -21.9380];
// C keys: 'C' (the pick) or 'C:<form>:<pin>:<plus>:<ps>:<w>:<pd>'
const TINC = fs.readFileSync(path.join(CON, 'C-tag-r10/t.inc.html'), 'utf8');
const htmlFor = k => { if (k.startsWith('T')) { const [, tv, tw, tilt, tp, trot] = k.split(':'); const GAP = trot && process.env.TGAP ? process.env.TGAP : trot ? ({ p6: 90, q1: 86, q2: 84, q3: 87 }[tp] || (tp && tp.startsWith('x-') ? 20 + +tp.split('-')[1] + 12 : 108)) : 86;   // foot 20 + the object + 12
    return inj(real.replace('const TAG_SHEET_GAP = 48;', `const TAG_SHEET_GAP = ${GAP};`), [BT, TINC, PREFIX], `data-k="T" data-tv="${tv || 'paper'}" data-tw="${tw || 104}" data-tilt="${tilt || 0}"${tp ? ` data-tp="${tp}"` : ""}${trot ? ` data-trot="${trot}"` : ""}`); }
  if (!k.startsWith('C')) return HTML[k]; const [form, pin, plus, ps, w, pd, rw, cg] = k === 'C' ? CPICK : k.split(':').slice(1);
  return inj(real, [BT, CINC, PREFIX], `data-k="C" data-cform="${form}" data-cpin="${pin}" data-cplus="${plus}" data-cps="${ps || 0}" data-cw="${w || 100}" data-cpd="${pd || 32}" data-crw="${rw || 3}" data-cg="${cg || ''}"`); };
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
async function dock(p, s, kbH) { await template(p); await p.click('#collapseBtn'); await p.waitForTimeout(900); await zoomIn(p, s.centre || (process.env.DC ? JSON.parse(process.env.DC) : [64.1440, -21.9400])); await p.waitForTimeout(500); await p.evaluate(([s, h]) => { __BT.dock(s); __BT.kb(true, h); }, [s, kbH]); await p.waitForTimeout(300); }
async function hang(p, s, place = 'Sundhöllin') { await openPlace(p, place, true);
  if (s.z1) { const dz = +(process.env.ZD || 0) || (s.z1 === true ? 1 : s.z1);
    await p.evaluate(([n, dz]) => { const l = locations.find(l => l.name === n && l.city === 'reykjavik'); map.setView([l.lat, l.lng], map.getZoom() + dz, { animate: false }); }, [place, dz]); await p.waitForTimeout(700); } await p.evaluate(s => __BT.hang(s), s); await p.waitForTimeout(300); }
const floatBadge = (p, open) => p.evaluate(open => {   // open: true = navy x (r9); 'press' = deep orange, paper +   // the Float frame: R7's badge (60px, orange, account's scalloped die) at bottom-left
  const a = document.getElementById('accountBtn'), m = getComputedStyle(a).webkitMaskImage || getComputedStyle(a).maskImage;
  let f = document.getElementById('fb'); if (!f) { f = document.createElement('div'); f.id = 'fb'; document.body.appendChild(f); }
  f.style.cssText = `position:fixed;z-index:1500;left:15.2px;width:60px;height:60px;display:flex;align-items:center;justify-content:center;background:${open === 'press' ? 'var(--brand-orange-deep)' : open ? 'var(--navy)' : 'var(--brand-orange)'};-webkit-mask-image:${m};-webkit-mask-size:100% 100%;mask-image:${m};mask-size:100% 100%`;
  f.innerHTML = `<svg width="30" height="30" viewBox="0 0 24 24" style="transform:rotate(${open === true ? 45 : 0}deg)"><path d="M12 5V19M5 12H19" stroke="${open ? 'var(--paper)' : 'var(--navy)'}" stroke-width="3" stroke-linecap="round"/></svg>`;
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
for (const v of (process.env.CV || 'hang:fillplus:none:0:100:32').split(',')) both('cv-' + v.replace(/:/g, '-'), { k: 'C:' + v, zoom: true, centre: CREST });
F['cv-none'] = { k: 'C', zoom: true, centre: CREST, dsf: 1, run: p => p.evaluate(() => document.getElementById('cp').classList.add('gone')) };
F['cv-noacct'] = { k: 'C', zoom: true, centre: CREST, dsf: 1, run: p => p.evaluate(() => { document.getElementById('cp').classList.add('gone'); document.getElementById('accountBtn').style.visibility = 'hidden'; }) };
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
both('r9-c-alt', { k: 'C:hang:fillplus:none:0:100:40:4:heavy', zoom: true, centre: CREST });
F['r9-c-pressed'] = { k: 'C', zoom: true, centre: CREST, run: p => p.evaluate(() => document.getElementById('cp').classList.add('press')) };
F['r9-c-rest664'] = { k: 'C', vp: V664 };   // the city view (the app's opening fit)
F['r9-c-tapped664'] = { k: 'C', vp: V664, zoom: true, centre: CREST, run: async p => { await dock(p, { state: 'typing' }); await cGone(p); } };
F['r9-c-tag664'] = { k: 'C', vp: V664, run: async p => { await openPlace(p, 'Brauð & Co, the cinnamon bakery on Frakkastígur'); await cGone(p); } };
F['r9-c-rest320'] = { k: 'C', vp: V320, zoom: true, centre: process.env.C3 ? JSON.parse(process.env.C3) : [64.1400, -21.9250] };
F['r9-c-collapsed'] = { k: 'C', inset: true, zoom: true, centre: process.env.CL ? JSON.parse(process.env.CL) : [64.1500, -21.9450], run: async p => { await p.click('#collapseBtn'); await p.waitForTimeout(900); } };
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

// ================= ROUND 10: the tag is the button (C-tag-r10) =================
const TV = (process.env.TV || 'paper,navy,orange,twoend,stubplus,apptag,punch,punchor').split(',');
for (const v of TV) both('t10-' + v.replace(/:/g, '-'), { k: 'T:' + v, zoom: true, centre: CREST });
F['t10-none'] = { k: 'T:paper', zoom: true, centre: CREST, dsf: 1, run: p => p.evaluate(() => document.getElementById('tb').classList.add('gone')) };
F['t10-noacct'] = { k: 'T:paper', zoom: true, centre: CREST, dsf: 1, run: p => p.evaluate(() => { document.getElementById('tb').classList.add('gone'); document.getElementById('accountBtn').style.visibility = 'hidden'; }) };

// ================= ROUND 10 form: unpinned (washed map) while there's no address; pinned (map at the place, the
// type's pin above the tag) once there is; centred in the open area; TYPE = pick your pin; city plain pencil =================
const R10 = { r10: true };
F['r10-f-typing664'] = { k: 'C', vp: V664, run: async p => { await dock(p, { state: 'typing', wash: true }); await cGone(p); } };
F['r10-f-blankcard664'] = { k: 'C', vp: V664, run: async p => { await card(p, { state: 'blank', ...R10, centre: true, wash: true }); } };
F['r10-f-pinned664'] = { k: 'C', vp: V664, run: async p => { await hang(p, { state: 'picked', ...R10, centre: true, realPin: true, z1: 2 }); await cGone(p); } };
F['r10-f-pinned-starred664'] = { k: 'C', vp: V664, run: async p => { await hang(p, { state: 'picked', ...R10, centre: true, realPin: true, starred: true, visited: true, notes: NOTE2 }); await cGone(p); } };
F['r10-f-pinned844'] = { k: 'C', inset: true, run: async p => { await hang(p, { state: 'picked', ...R10, centre: true, realPin: true }); await cGone(p); } };
F['r10-f-typing320'] = { k: 'C', vp: V320, run: async p => { await dock(p, { state: 'typing', wash: true, centre: [64.1500, -21.9480] }, 260); await cGone(p); } };
F['r10-f-pinned320'] = { k: 'C', vp: V320, run: async p => { await hang(p, { state: 'picked', ...R10, centre: true, realPin: true, z1: 2 }); await cGone(p); } };

// ================= ROUND 10b: one fixed card height; the city cue; C (#2) and the Float as two complete options =================
const NOTE1 = 'Bring a towel';
F['r10-f-typing664'] = { k: 'C', vp: V664, run: async p => { await dock(p, { state: 'typing', wash: true, r10: true }); await cGone(p); } };
F['r10-f-blankcard664'] = { k: 'C', vp: V664, run: async p => { await card(p, { state: 'blank', ...R10, centre: true, wash: true }); } };
F['r10-f-pinned664'] = { k: 'C', vp: V664, run: async p => { await hang(p, { state: 'picked', ...R10, centre: true, realPin: true, z1: 2 }); await cGone(p); } };
F['r10-f-pinned-starred664'] = { k: 'C', vp: V664, run: async p => { await hang(p, { state: 'picked', ...R10, centre: true, realPin: true, z1: 2, starred: true, visited: true, notes: NOTE1 }); await cGone(p); } };
F['r10-f-city664'] = { k: 'C', vp: V664, run: async p => { await hang(p, { state: 'cityopen', ...R10, centre: true, realPin: true, z1: 2 }); await cGone(p); } };
F['r10-f-typing320'] = { k: 'C', vp: V320, run: async p => { await dock(p, { state: 'typing', wash: true, r10: true, centre: [64.1500, -21.9480] }, 260); await cGone(p); } };
const tGone = p => p.evaluate(() => { const e = document.getElementById('tb'); if (e) e.classList.add('gone'); });
const fGone = p => p.evaluate(() => { const e = document.getElementById('fb'); if (e) e.style.display = 'none'; });
const TC = 'T:orange:84';   // director round 10c: 84 x 44
both('c10-rest', { k: TC, zoom: true, centre: CREST });
F['c10-pressed'] = { k: TC, zoom: true, centre: CREST, run: async p => { await p.evaluate(() => { document.getElementById('tb').classList.add('press'); __T.draw(); }); } };
F['c10-rest664'] = { k: TC, vp: V664 };
F['c10-tapped664'] = { k: TC, vp: V664, run: async p => { await dock(p, { state: 'typing', wash: true, r10: true }); await tGone(p); } };
F['c10-tag664'] = { k: TC, vp: V664, run: p => openPlace(p, 'Brauð & Co, the cinnamon bakery on Frakkastígur') };
F['c10-rest320'] = { k: TC, vp: V320, zoom: true, centre: [64.1400, -21.9250] };
F['c10-rest375'] = { k: TC, vp: [375, 667], zoom: true, centre: CREST };
F['c10-collapsed'] = { k: TC, inset: true, zoom: true, centre: [64.1500, -21.9450], run: async p => { await p.click('#collapseBtn'); await p.waitForTimeout(900); } };
F['c10-none-1x'] = { k: TC, zoom: true, centre: CREST, dsf: 1, run: tGone };
F['c10-noacct-1x'] = { k: TC, zoom: true, centre: CREST, dsf: 1, run: async p => { await tGone(p); await p.evaluate(() => document.getElementById('accountBtn').style.visibility = 'hidden'); } };
both('f10-rest', { k: 'F', zoom: true, centre: CREST, run: p => floatBadge(p, false) });
F['f10-pressed'] = { k: 'F', zoom: true, centre: CREST, run: p => floatBadge(p, 'press') };
F['f10-rest664'] = { k: 'F', vp: V664, run: p => floatBadge(p, false) };
F['f10-tapped664'] = { k: 'F', vp: V664, run: async p => { await dock(p, { state: 'typing', wash: true, r10: true }); } };
F['f10-tag664'] = { k: 'F', vp: V664, run: async p => { await openPlace(p, 'Brauð & Co, the cinnamon bakery on Frakkastígur'); await floatBadge(p, false); } };
F['f10-rest320'] = { k: 'F', vp: V320, zoom: true, centre: [64.1400, -21.9250], run: p => floatBadge(p, false) };
F['f10-collapsed'] = { k: 'F', inset: true, zoom: true, centre: [64.1500, -21.9450], run: async p => { await p.click('#collapseBtn'); await p.waitForTimeout(900); await floatBadge(p, false); } };

// round 10 ADD moment: the place's real tag, its stub where the pinned card's was (foot 458 at 664): the tag tightens by
// its top and the map pans that little with it (no fly). Same +2 zoom as the pinned frames.
F['r10-f-after664'] = { k: 'C', vp: V664, run: async p => { await openPlace(p, 'Sundhöllin', true); await cGone(p);
  await p.evaluate(() => { const l = locations.find(l => l.name === 'Sundhöllin' && l.city === 'reykjavik'); map.setView([l.lat, l.lng], map.getZoom() + 2, { animate: false }); }); await p.waitForTimeout(700);
  await p.evaluate(() => __BT.alignReal(458)); await p.waitForTimeout(300); } };

// ================= ROUND 11: narrower both sides, smaller +, the hole back; two colourways =================
const R11P = (process.env.R11P || 'p1,p2,p3,p4').split(',');
for (const tp of R11P) for (const cw of ['orange', 'twoend']) both(`r11-${cw}-${tp}`, { k: `T:${cw}:104:0:${tp}`, zoom: true, centre: CREST });

// round 11 lead: orange (#7) at p4 (70 x 43, golden); the cream colourway (#2) at the same proportion
const T11 = 'T:orange:104:0:p4', T11B = 'T:twoend:104:0:p4';
both('c11-rest', { k: T11, zoom: true, centre: CREST });
both('c11b-rest', { k: T11B, zoom: true, centre: CREST });
F['c11-pressed'] = { k: T11, zoom: true, centre: CREST, run: async p => { await p.evaluate(() => { document.getElementById('tb').classList.add('press'); __T.draw(); }); } };
F['c11-rest664'] = { k: T11, vp: V664 };
F['c11-tapped664'] = { k: T11, vp: V664, run: async p => { await dock(p, { state: 'typing', wash: true, r10: true }); await tGone(p); } };
F['c11-tag664'] = { k: T11, vp: V664, run: p => openPlace(p, 'Brauð & Co, the cinnamon bakery on Frakkastígur') };
F['c11-rest320'] = { k: T11, vp: V320, zoom: true, centre: [64.1400, -21.9250] };
F['c11-collapsed'] = { k: T11, inset: true, zoom: true, centre: [64.1500, -21.9450], run: async p => { await p.click('#collapseBtn'); await p.waitForTimeout(900); } };
F['c11b-rest664'] = { k: T11B, vp: V664 };

// round 11b: the tag turned 90 degrees
for (const cw of ['orange', 'twoend']) for (const [tp, rot] of [['p4', 'up'], ['p4', 'down'], ['p5', 'up']]) both(`r11v-${cw}-${tp}-${rot}`, { k: `T:${cw}:104:0:${tp}:${rot}`, zoom: true, centre: CREST });
F['r11v-orange-p4-up-664'] = { k: 'T:orange:104:0:p4:up', vp: V664 };
F['r11v-orange-p4-up-320'] = { k: 'T:orange:104:0:p4:up', vp: V320, zoom: true, centre: [64.1400, -21.9250] };
F['r11v-orange-p4-up-collapsed'] = { k: 'T:orange:104:0:p4:up', inset: true, zoom: true, centre: [64.1500, -21.9450], run: async p => { await p.click('#collapseBtn'); await p.waitForTimeout(900); } };
F['r11v-orange-p4-up-tag664'] = { k: 'T:orange:104:0:p4:up', vp: V664, run: p => openPlace(p, 'Brauð & Co, the cinnamon bakery on Frakkastígur') };

// round 11b: the short upright (36 x 58)
both('r11v-orange-p6-up', { k: 'T:orange:104:0:p6:up', zoom: true, centre: CREST });
both('r11v-twoend-p6-up', { k: 'T:twoend:104:0:p6:up', zoom: true, centre: CREST });
F['r11v-orange-p6-up-tag664'] = { k: 'T:orange:104:0:p6:up', vp: V664, run: p => openPlace(p, 'Brauð & Co, the cinnamon bakery on Frakkastígur') };

// round 11c: the upright cream a tad more squat
for (const q of ['q1', 'q2', 'q3']) { both(`r11q-twoend-${q}-up`, { k: `T:twoend:104:0:${q}:up`, zoom: true, centre: CREST });
  F[`r11q-twoend-${q}-up-tag664`] = { k: `T:twoend:104:0:${q}:up`, vp: V664, run: p => openPlace(p, 'Brauð & Co, the cinnamon bakery on Frakkastígur') }; }

// round 11d: proportion study, height held at 54 (upright); widths x end treatments; plus 'stub' = a cream claim-check
// stub 10 long behind the perforation with only its last 3px orange (the notches and perforation carry the tear-off)
const PW = [32, 36, 40, 44], PE = [['e8', 8, 8], ['e5', 5, 5], ['e3', 3, 3], ['e1', 1.5, 1.5], ['stub', 3, 10]];
for (const wd of PW) for (const [en, e, st] of PE) F[`r11p-${wd}-${en}`] = { k: `T:twoend:104:0:x-54-${wd}-${e}-${st}:up`, zoom: true, centre: CREST, dsf: 3 };
both('r11p-real-36-e3', { k: 'T:twoend:104:0:x-54-36-3-3:up', zoom: true, centre: CREST });
both('r11p-real-36-stub', { k: 'T:twoend:104:0:x-54-36-3-10:up', zoom: true, centre: CREST });
both('r11p-real-40-stub', { k: 'T:twoend:104:0:x-54-40-3-10:up', zoom: true, centre: CREST });

// round 11e: all cream, cream stub, the orange band at the top (the starred Hanging Tag's band), 40 x 54
for (const b of [12, 16, 20]) both(`r11b-40-b${b}`, { k: `T:twoend:104:0:x-54-40-0-10-${b}:up`, zoom: true, centre: CREST });
F['r11b-40-b16-tag664'] = { k: 'T:twoend:104:0:x-54-40-0-10-16:up', vp: V664, run: p => openPlace(p, 'Brauð & Co, the cinnamon bakery on Frakkastígur') };

// round 11f: the three side by side (owner: "the badge add, the cream with orange 40/8 and 12 next to each other with account too")
both('r11t-float', { k: 'F', zoom: true, centre: CREST, run: p => floatBadge(p, false) });
both('r11t-e8', { k: 'T:twoend:104:0:x-54-40-8-8:up', zoom: true, centre: CREST });
both('r11t-b12', { k: 'T:twoend:104:0:x-54-40-0-10-12:up', zoom: true, centre: CREST });

// build spec check (handoff "How it looks and feels"): the Float drawn natively at 60 -- 24 fine lobes (depth 2.04, outer R 25.32
// in a 60 box), brand orange on --tex-flood, a 26.4px navy + at stroke 3 (viewBox 24). Should match R7's scale(1.2) render.
const FINE60 = '30.00,4.68 30.66,4.88 31.29,5.42 31.88,6.09 32.45,6.65 33.04,6.92 33.67,6.81 34.37,6.42 35.12,5.92 35.87,5.57 36.55,5.54 37.14,5.91 37.61,6.59 38.01,7.39 38.41,8.08 38.91,8.49 39.55,8.55 40.33,8.35 41.18,8.07 41.99,7.92 42.66,8.07 43.13,8.58 43.41,9.36 43.59,10.23 43.80,11.01 44.17,11.53 44.77,11.76 45.58,11.76 46.47,11.71 47.30,11.77 47.90,12.10 48.23,12.70 48.29,13.53 48.24,14.42 48.24,15.23 48.47,15.83 48.99,16.20 49.77,16.41 50.64,16.59 51.42,16.87 51.93,17.34 52.08,18.01 51.93,18.82 51.65,19.67 51.45,20.45 51.51,21.09 51.92,21.59 52.61,21.99 53.41,22.39 54.09,22.86 54.46,23.45 54.43,24.13 54.08,24.88 53.58,25.63 53.19,26.33 53.08,26.96 53.35,27.55 53.91,28.12 54.58,28.71 55.12,29.34 55.32,30.00 55.12,30.66 54.58,31.29 53.91,31.88 53.35,32.45 53.08,33.04 53.19,33.67 53.58,34.37 54.08,35.12 54.43,35.87 54.46,36.55 54.09,37.14 53.41,37.61 52.61,38.01 51.92,38.41 51.51,38.91 51.45,39.55 51.65,40.33 51.93,41.18 52.08,41.99 51.93,42.66 51.42,43.13 50.64,43.41 49.77,43.59 48.99,43.80 48.47,44.17 48.24,44.77 48.24,45.58 48.29,46.47 48.23,47.30 47.90,47.90 47.30,48.23 46.47,48.29 45.58,48.24 44.77,48.24 44.17,48.47 43.80,48.99 43.59,49.77 43.41,50.64 43.13,51.42 42.66,51.93 41.99,52.08 41.18,51.93 40.33,51.65 39.55,51.45 38.91,51.51 38.41,51.92 38.01,52.61 37.61,53.41 37.14,54.09 36.55,54.46 35.87,54.43 35.12,54.08 34.37,53.58 33.67,53.19 33.04,53.08 32.45,53.35 31.88,53.91 31.29,54.58 30.66,55.12 30.00,55.32 29.34,55.12 28.71,54.58 28.12,53.91 27.55,53.35 26.96,53.08 26.33,53.19 25.63,53.58 24.88,54.08 24.13,54.43 23.45,54.46 22.86,54.09 22.39,53.41 21.99,52.61 21.59,51.92 21.09,51.51 20.45,51.45 19.67,51.65 18.82,51.93 18.01,52.08 17.34,51.93 16.87,51.42 16.59,50.64 16.41,49.77 16.20,48.99 15.83,48.47 15.23,48.24 14.42,48.24 13.53,48.29 12.70,48.23 12.10,47.90 11.77,47.30 11.71,46.47 11.76,45.58 11.76,44.77 11.53,44.17 11.01,43.80 10.23,43.59 9.36,43.41 8.58,43.13 8.07,42.66 7.92,41.99 8.07,41.18 8.35,40.33 8.55,39.55 8.49,38.91 8.08,38.41 7.39,38.01 6.59,37.61 5.91,37.14 5.54,36.55 5.57,35.87 5.92,35.12 6.42,34.37 6.81,33.67 6.92,33.04 6.65,32.45 6.09,31.88 5.42,31.29 4.88,30.66 4.68,30.00 4.88,29.34 5.42,28.71 6.09,28.12 6.65,27.55 6.92,26.96 6.81,26.33 6.42,25.63 5.92,24.88 5.57,24.13 5.54,23.45 5.91,22.86 6.59,22.39 7.39,21.99 8.08,21.59 8.49,21.09 8.55,20.45 8.35,19.67 8.07,18.82 7.92,18.01 8.07,17.34 8.58,16.87 9.36,16.59 10.23,16.41 11.01,16.20 11.53,15.83 11.76,15.23 11.76,14.42 11.71,13.53 11.77,12.70 12.10,12.10 12.70,11.77 13.53,11.71 14.42,11.76 15.23,11.76 15.83,11.53 16.20,11.01 16.41,10.23 16.59,9.36 16.87,8.58 17.34,8.07 18.01,7.92 18.82,8.07 19.67,8.35 20.45,8.55 21.09,8.49 21.59,8.08 21.99,7.39 22.39,6.59 22.86,5.91 23.45,5.54 24.13,5.57 24.88,5.92 25.63,6.42 26.33,6.81 26.96,6.92 27.55,6.65 28.12,6.09 28.71,5.42 29.34,4.88';
const nativeBadge = (p, st) => p.evaluate(([pts, st]) => { const m = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'><polygon fill='white' points='${pts}'/></svg>`)}")`;
  let f = document.getElementById('fb'); if (!f) { f = document.createElement('div'); f.id = 'fb'; document.body.appendChild(f); }
  const bg = st === 'open' ? 'background:var(--navy)' : st === 'openpress' ? 'background:var(--state-on-press)' : `background-color:${st === 'press' ? 'var(--brand-orange-deep)' : 'var(--brand-orange)'};background-image:var(--tex-flood);background-size:160px 160px;background-position:-23px -71px`;
  const sw = st === 'rest2' ? (2 * 24 / 26.4).toFixed(3) : 3; if (st === 'rest2') st = 'rest';
  const ink = st === 'rest' ? 'var(--navy)' : 'var(--paper)', open = st === 'open' || st === 'openpress';
  f.style.cssText = `position:fixed;z-index:1500;left:15.2px;width:60px;height:60px;display:flex;align-items:center;justify-content:center;${bg};-webkit-mask-image:${m};-webkit-mask-size:100% 100%;mask-image:${m};mask-size:100% 100%`;
  f.innerHTML = `<svg width="26.4" height="26.4" viewBox="0 0 24 24" fill="none" stroke="${ink}" stroke-width="${sw}" stroke-linecap="round">${open ? '<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>' : '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>'}</svg>`;
  const S = document.getElementById('locations').getBoundingClientRect().top; f.style.top = (S - 15.2 - 60) + 'px';
}, [FINE60, st]);
for (const st of ['rest', 'rest2', 'press', 'open', 'openpress']) both(`x1-native-${st}`, { k: 'F', zoom: true, centre: CREST, run: p => nativeBadge(p, st) });

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
      const LP = document.getElementById('lp') || document.getElementById('cp') || document.getElementById('tb') || document.getElementById('fb'); const lpPins = LP ? [...document.querySelectorAll('.leaflet-marker-icon')].filter(m => { const r = m.getBoundingClientRect(), q = LP.getBoundingClientRect(); return r.right > q.left - 4 && r.left < q.right + 4 && r.bottom > q.top - 4 && r.top < q.bottom + 4; }).length : null;
      const taps = window.__BT && __BT.taps && document.getElementById('btDock') ? __BT.taps() : null;
      const lst = document.getElementById('locationsList'), lr = lst.getBoundingClientRect();
      const rows = [...lst.querySelectorAll('.location-card[data-id]')].filter(c => { const r = c.getBoundingClientRect(); return r.top >= lr.top - 1 && r.bottom <= Math.min(lr.bottom, innerHeight) + 1; }).length;
      return { rows, taps, acctPins, eyePin, lpPins, lp: bx('#lp'), nb: bx('#nb'), acct: bx('#accountBtn'), credit: bx('.leaflet-control-attribution'), tag: bx('.tag-popup .tag-body'), add: bx('.bt-add'), pin: bx('#btPin'), sheetTop: Math.round(document.getElementById('locations').getBoundingClientRect().top) }; });
    m.errs = errs; m.clash = await chromeCheck(page);
    meas[name] = m; console.log(name, JSON.stringify(m));
    await page.screenshot({ path: path.join(C, 'raw', `${name.replace(/-1x$/, '')}-${s.dsf === 1 ? 1 : 3}x.png`) });
    await ctx.close(); fs.unlinkSync(html);
  }
  const f = path.join(C, 'raw', 'measure.json'); const prev = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {};
  Object.assign(prev, meas); fs.writeFileSync(f, JSON.stringify(prev, null, 1));
  await b.close();
})();
