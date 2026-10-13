// ROUND 6 raw frames (visual designer): Float hierarchy dials, A's place routes, C rebuilt on the app's own pin, D one
// rough frame. Every frame is the SAME zoomed view of Reykjavík (zoom 14 over the stub's places), so the real map pins
// sit in frame beside every concept and the account badge is always in shot. Everything is injected in memory; no
// file on disk (least of all the real index.html) is written except the PNGs and measure JSON in each folder's r6/.
// Run: node r6-stills.js   (ONLY=<prefix> to re-shoot some)   then: node compose-r6.js
const L = require('./lib-render.js'); const chromeCheck = require('./chrome-check.js'); const fs = require('fs'); const path = require('path');
const C = __dirname, REAL = '/home/user/la-trip-map/index.html';
const rd = f => fs.readFileSync(path.join(C, f), 'utf8');
const R17 = `<style id="floatR17">#floatingAddBtn.active { background: var(--navy); color: var(--paper); }
  #floatingAddBtn.active:active { background: var(--state-on-press); color: var(--paper); }</style>
<script>(function () { const t = setInterval(() => { try { if (map && map.attributionControl) { map.attributionControl.setPrefix(false); clearInterval(t); } } catch (e) {} }, 50); })();</script>`;
const FLOAT_CFG = 'data-corner="r" data-align="gutter" data-gap="19.9" data-form="ride" data-credit="move" data-filters="under" data-taggap="clear"';
const inject = (incs, attrs) => h => { const i = h.lastIndexOf('</body>'); h = h.slice(0, i) + incs.join('\n') + '\n' + h.slice(i); return h.replace('<html lang="en"', `<html lang="en" ${attrs}`); };
const KIND = {
  F: { html: path.join(C, 'E-float/index.html'), out: 'E-float/r6', sel: '#floatingAddBtn', incs: () => [R17, rd('E-float/r6.inc.html')], attrs: a => `${FLOAT_CFG} ${a}` },
  D: { html: path.join(C, 'E-float/index.html'), out: 'D-floated-ticket/r6', sel: '#floatingAddBtn', incs: () => [R17, rd('D-floated-ticket/d.inc.html')], attrs: a => `${FLOAT_CFG} ${a}` },
  A: { html: REAL, out: 'stub/r6', sel: '#nb', incs: () => [rd('stub/r5.inc.html'), rd('stub/r6.inc.html')], attrs: a => a },
  C: { html: path.join(C, 'C-pin/index.html'), out: 'C-pin/r6', sel: '#pencilPin', incs: () => [rd('C-pin/visual.inc.html'), rd('C-pin/visual-r5.inc.html'), rd('C-pin/visual-r6.inc.html')], attrs: a => `data-c="ring" data-ring="graphite" ${a}` },
};
const openStarred = async page => {
  const id = await page.evaluate(() => (locations.find(l => l.starred && l.visited && document.querySelector(`#locationsList .location-card[data-id="${l.id}"]`)) || {}).id);
  await page.click(`#locationsList .location-card[data-id="${id}"]`); await page.waitForTimeout(1900); };
const press = sel => p => p.evaluate(s => document.querySelector(s).classList.add('press'), sel);
const F = {};
const both = (n, s) => { F[n] = s; F[n + '-1x'] = { ...s, dsf: 1 }; };
// ---- Float: the dials (field / size / cut), one at a time, then combined ----
both('f-today', { k: 'F', a: 'data-ff="navy" data-fs="1" data-fc="same"' });
both('f-orange', { k: 'F', a: 'data-ff="orange" data-fs="1" data-fc="same"' });
both('f-navy-big', { k: 'F', a: 'data-ff="navy" data-fs="1.2" data-fc="same"' });
both('f-navy-big-rosette', { k: 'F', a: 'data-ff="navy" data-fs="1.2" data-fc="rosette"' });
both('f-orange-big', { k: 'F', a: 'data-ff="orange" data-fs="1.2" data-fc="same"' });
both('f-orange-big-rosette', { k: 'F', a: 'data-ff="orange" data-fs="1.2" data-fc="seal"' });
both('f-orange-big-seal', { k: 'F', a: 'data-ff="orange" data-fs="1.2" data-fc="seal"' });
both('f-acct-small', { k: 'F', a: 'data-ff="orange" data-fs="1.2" data-fc="seal" data-acct="small"' });
F['f-pick-pressed'] = { k: 'F', a: 'data-ff="orange" data-fs="1.2" data-fc="seal"', run: press('#floatingAddBtn') };
F['f-pick-tag'] = { k: 'F', a: 'data-ff="orange" data-fs="1.2" data-fc="seal"', run: openStarred, noZoom: true };
F['f-pick-form'] = { k: 'F', a: 'data-ff="orange" data-fs="1.2" data-fc="seal"', q: '?play', run: async p => { await p.click('#floatingAddBtn'); await p.waitForTimeout(1000); } };
// ---- A: routes to "a ticket to a place" ----
for (const v of ['ticket', 'admit', 'tagcut', 'punchdisc', 'punchdrop']) both('a-' + v, { k: 'A', a: `data-a="${v}"` });
F['a-admit-pressed'] = { k: 'A', a: 'data-a="admit"', run: press('#nb') };
// ---- C: the app's own pin ----
for (const v of ['dashed', 'solid', 'orange', 'hi', 'tagplus']) both('c-' + v, { k: 'C', a: `data-c6="${v}"` });
both('c-hi-big', { k: 'C', a: 'data-c6="hi" data-ct="big"' });
both('c-solid-big', { k: 'C', a: 'data-c6="solid" data-ct="big"' });
F['c-dashed-pressed'] = { k: 'C', a: 'data-c6="dashed"', run: press('#pencilPin') };
// ---- D: one rough frame (two cuts of it, to kill or keep) ----
both('d-bare', { k: 'D', a: 'data-d="bare"' });
both('d-pinned', { k: 'D', a: 'data-d="pinned"' });

const objClash = (page, sel) => page.evaluate(sel => {
  const vis = q => { const e = typeof q === 'string' ? document.querySelector(q) : q; if (!e) return null; const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return null; const r = e.getBoundingClientRect(); return r.width ? r : null; };
  const f = vis(sel); if (!f) return ['no object'];
  const ov = b => b && Math.min(f.right, b.right) - Math.max(f.left, b.left) > 1 && Math.min(f.bottom, b.bottom) - Math.max(f.top, b.top) > 1;
  const out = [];
  for (const [n, q] of Object.entries({ credit: '.leaflet-control-attribution', tag: '.tag-popup .tag-body', zoom: '.leaflet-control-zoom', account: '#accountBtn', submit: '#submitBtn' })) if (ov(vis(q))) out.push('plus x ' + n);
  if (sel !== '#nb' && ov(vis('#locations'))) out.push('plus x sheet');
  for (const m of document.querySelectorAll('.leaflet-marker-icon')) if (ov(m.getBoundingClientRect())) { out.push('plus x pin'); break; }
  return out; }, sel);
(async () => {
  const b = await L.launch(); const meas = {};
  for (const [name, s] of Object.entries(F).filter(([n]) => !process.env.ONLY || process.env.ONLY.split(',').some(p => n.startsWith(p)))) {
    const K = KIND[s.k]; const out = path.join(C, K.out); fs.mkdirSync(out, { recursive: true });
    const { ctx, page, errs } = await L.open(b, { html: K.html, vp: s.vp || [390, 844], dsf: s.dsf, q: s.q, patch: inject(K.incs(), K.attrs(s.a)) });
    await page.evaluate(() => setActiveCity('reykjavik')); await page.waitForTimeout(900);
    if (s.k === 'A') await page.evaluate(() => window.fitTitle && window.fitTitle());
    if (!s.noZoom) { await page.evaluate(() => map.setView([64.1471, -21.9426], 14, { animate: false })); await page.waitForTimeout(900); }
    if (s.run) await s.run(page);
    await page.waitForTimeout(400);
    const m = { obj: await L.box(page, K.sel), objHit: await L.hit(page, K.sel), acct: await L.box(page, '#accountBtn'), credit: await L.box(page, '.leaflet-control-attribution'),
      sheetTop: await page.evaluate(() => Math.round(document.getElementById('locations').getBoundingClientRect().top)),
      submit: await L.box(page, '#submitBtn'), pinsInView: await page.evaluate(() => [...document.querySelectorAll('.leaflet-marker-icon')].filter(m => { const r = m.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth; }).length),
      title: s.k === 'A' ? await page.evaluate(() => document.querySelector('#locationsHeader h2').className + ' | ' + document.querySelector('#locationsHeader h2').textContent) : undefined,
      errs, clash: [...await chromeCheck(page), ...await objClash(page, K.sel)] };
    meas[name] = m; console.log(name, JSON.stringify(m));
    await page.screenshot({ path: path.join(out, `${name.replace(/-1x$/, '')}-${s.dsf === 1 ? 1 : 3}x.png`) });
    await ctx.close();
  }
  for (const k of Object.values(KIND)) { const names = Object.keys(meas).filter(n => F[n] && KIND[F[n].k] === k); if (!names.length) continue;
    const f = path.join(C, k.out, 'measure.json'); const prev = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {};
    names.forEach(n => prev[n] = meas[n]); fs.writeFileSync(f, JSON.stringify(prev, null, 1)); }
  await b.close();
})();
