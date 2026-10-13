// Baseline E (Float) -- OWNER STILLS (visual designer, round 5). Today's badge, unchanged in look.
// Renders systems' prototype (this folder's index.html copy + concept.inc.html, built by render.js) in Reykjavík.
// Nothing of systems' is edited; the config is set on <html> exactly as render.js does.
// Run: node stills.js  (ONLY=<prefix>)   then: node compose.js
const L = require('../lib-render.js'); const chromeCheck = require('../chrome-check.js'); const fs = require('fs'); const path = require('path');
const COPY = path.join(__dirname, 'index.html'), OUT = path.join(__dirname, 'stills');
fs.mkdirSync(OUT, { recursive: true });
const V = { r: 'data-corner="r" data-align="gutter" data-gap="19.9"', l: 'data-corner="l" data-align="gutter" data-gap="19.9"' };
const cfg = (corner, form) => h => h.replace('<html lang="en"', `<html lang="en" ${V[corner]} data-form="${form || 'ride'}" data-credit="move" data-filters="under" data-taggap="clear"`);
const openStarred = async page => {
  const id = await page.evaluate(() => { const l = locations.find(l => l.starred && l.visited && document.querySelector(`#locationsList .location-card[data-id="${l.id}"]`)) || locations.find(l => l.starred && document.querySelector(`#locationsList .location-card[data-id="${l.id}"]`)); return l && l.id; });
  await page.click(`#locationsList .location-card[data-id="${id}"]`); await page.waitForTimeout(1900); };
const tapAdd = async page => { await page.click('#floatingAddBtn'); await page.waitForTimeout(1000); };
const S = {
  'rest-r':        { c: 'r', vp: [390, 844] },
  'rest-l':        { c: 'l', vp: [390, 844] },
  'collapsed-r':   { c: 'r', vp: [390, 844], inset: true, run: async p => { await p.click('#collapseBtn'); await p.waitForTimeout(700); } },
  'tag-r':         { c: 'r', vp: [390, 844], run: openStarred },
  'form-r':        { c: 'r', vp: [390, 844], q: '?play', run: tapAdd },
  'form664-r':     { c: 'r', vp: [390, 664], q: '?play', run: tapAdd },
  'cph320-r':      { c: 'r', vp: [320, 568], city: 'copenhagen' },
  'rest664-r':     { c: 'r', vp: [390, 664] },
  'tag664-r':      { c: 'r', vp: [390, 664], run: openStarred },
  'axes-r':        { c: 'r', vp: [390, 844], axes: true },
  'crop1x-r':      { c: 'r', vp: [390, 844], dsf: 1, crop1x: true },
};
// the badge itself is not in chrome-check's list (it was written for concepts that hid it): check it here too
const badgeClash = page => page.evaluate(() => {
  const vis = q => { const e = document.querySelector(q); if (!e) return null; const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return null; const r = e.getBoundingClientRect(); return r.width ? r : null; };
  const f = vis('#floatingAddBtn'); if (!f) return ['no badge'];
  const ov = b => b && Math.min(f.right, b.right) - Math.max(f.left, b.left) > 1 && Math.min(f.bottom, b.bottom) - Math.max(f.top, b.top) > 1;
  const out = [];
  for (const [n, q] of Object.entries({ credit: '.leaflet-control-attribution', tag: '.tag-popup .tag-body', zoom: '.leaflet-control-zoom', account: '#accountBtn', submit: '#submitBtn', sheet: '#locations' })) if (ov(vis(q))) out.push('plus x ' + n);
  for (const m of document.querySelectorAll('.leaflet-marker-icon')) if (ov(m.getBoundingClientRect())) { out.push('plus x pin'); break; }
  return out; });
(async () => {
  const b = await L.launch(); const out = {};
  for (const [name, s] of Object.entries(S).filter(([n]) => !process.env.ONLY || n.startsWith(process.env.ONLY))) {
    const { ctx, page, errs } = await L.open(b, { html: COPY, ...s, patch: cfg(s.c, s.form) });
    await page.evaluate(c => setActiveCity(c), s.city || 'reykjavik'); await page.waitForTimeout(900);
    if (s.run) await s.run(page);
    await page.waitForTimeout(300);
    const m = { fab: await L.box(page, '#floatingAddBtn'), acct: await L.box(page, '#accountBtn'), submit: await L.box(page, '#submitBtn'), submitHit: await L.hit(page, '#submitBtn'),
      credit: await L.box(page, '.leaflet-control-attribution'), tag: await L.box(page, '.tag-popup .tag-body'), sheetTop: await page.evaluate(() => Math.round(document.getElementById('locations').getBoundingClientRect().top)),
      rows: await L.rowsVisible(page), errs, clash: [...await chromeCheck(page), ...await badgeClash(page)] };
    out[name] = m; console.log(name, JSON.stringify(m));
    let clip;
    if (s.axes) {
      clip = await page.evaluate(() => {
        const f = document.getElementById('floatingAddBtn').getBoundingClientRect(), a = document.getElementById('accountBtn').getBoundingClientRect(), edge = document.getElementById('locations').getBoundingClientRect().top, W = innerWidth;
        const loc = document.getElementById('locateBtn') || document.querySelector('#locationsHeader button:last-of-type');
        const I = 3.9, inkR = f.right - I, inkB = f.bottom - I;
        const o = document.createElement('div'); o.style.cssText = 'position:fixed;inset:0;z-index:5000;pointer-events:none;font:700 9px/1 Archivo, sans-serif;letter-spacing:.04em';
        const vline = (x, c, t, b) => `<div style="position:absolute;left:${x}px;top:${t}px;height:${b - t}px;border-left:1px dashed ${c}"></div>`;
        const hline = (y, c, l, r) => `<div style="position:absolute;top:${y}px;left:${l}px;width:${r - l}px;border-top:1px dashed ${c}"></div>`;
        const lab = (x, y, c, t, al) => `<div style="position:absolute;left:${x}px;top:${y}px;color:${c};background:rgba(242,235,221,.92);padding:2px 3px;white-space:nowrap;${al || ''}">${t}</div>`;
        const RED = '#D0342C', BLUE = '#2456C8';
        o.innerHTML = vline(inkR, RED, 0, edge + 60)
          + hline(inkB, RED, 230, W) + hline(edge, BLUE, 0, W)
          + `<div style="position:absolute;left:${inkR}px;width:${W - inkR}px;top:${f.top + 25}px;border-top:1.5px solid ${RED}"></div>` + lab(inkR - 4, f.top + 8, RED, (W - inkR).toFixed(0), 'transform:translateX(0)')
          + `<div style="position:absolute;left:${f.left + 25}px;top:${inkB}px;height:${edge - inkB}px;border-left:1.5px solid ${RED}"></div>` + lab(f.left - 14, inkB + 3, RED, (edge - inkB).toFixed(0))
          + `<div style="position:absolute;left:${a.left + 25}px;top:0;height:${a.top + 3.9}px;border-left:1.5px solid ${RED}"></div>`
          + `<div style="position:absolute;left:${inkR}px;width:${W - inkR}px;top:${a.top + 25}px;border-top:1.5px solid ${RED}"></div>` + lab(inkR - 4, a.top + 8, RED, (W - inkR).toFixed(0))
          + lab(8, edge + 4, BLUE, 'TOP OF THE LIST');
        document.body.appendChild(o);
        window.__ax = { f: [f.left, f.top, f.right, f.bottom], a: [a.left, a.top, a.right, a.bottom], edge };
        return undefined;
      });
    }
    if (s.crop1x) clip = { x: 150, y: 400, width: 240, height: 240 };   // the SAME window in A, C and the baseline
    await page.screenshot({ path: `${OUT}/${name}-${s.dsf === 1 ? 1 : 3}x.png`, ...(clip ? { clip } : {}) });
    await ctx.close();
  }
  fs.writeFileSync(path.join(OUT, `measure${process.env.ONLY ? '-' + process.env.ONLY : ''}.json`), JSON.stringify(out, null, 1));
  await b.close();
})();
