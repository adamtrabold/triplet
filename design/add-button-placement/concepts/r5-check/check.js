// Systems round-5 structural check (turn 16): C "ring" footprint collisions, A "ticket" title cost at 320/375/390.
// Reads the concept copies / the real index.html; injects the visual designer's round-5 includes in memory. Writes measure.json.
const L = require('../lib-render.js'); const chromeCheck = require('../chrome-check.js'); const fs = require('fs'); const path = require('path');
const C = path.join(__dirname, '../C-pin'), A = path.join(__dirname, '../stub');
const cLook = (h, v = 'ring') => { const i = h.lastIndexOf('</body>'); return (h.slice(0, i) + fs.readFileSync(C + '/visual.inc.html', 'utf8') + fs.readFileSync(C + '/visual-r5.inc.html', 'utf8') + h.slice(i)).replace('<html lang="en"', `<html lang="en" data-c="${v}"`); };
const aLook = h => { const i = h.lastIndexOf('</body>'); return (h.slice(0, i) + fs.readFileSync(A + '/r5.inc.html', 'utf8') + h.slice(i)).replace('<html lang="en"', '<html lang="en" data-a="ticket"'); };
const pinM = page => page.evaluate(() => {
  const p = document.getElementById('pencilPin'), cs = getComputedStyle(p), r = p.getBoundingClientRect(), tg = p.querySelector('.r5-tagw').getBoundingClientRect(), ring = p.querySelector('.r5-ring').getBoundingClientRect();
  const R = e => { if (!e) return null; const s = getComputedStyle(e); if (s.display === 'none' || s.visibility === 'hidden') return null; const q = e.getBoundingClientRect(); return q.width ? q : null; };
  const ov = (a, b) => a && b && Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1;
  const gap = (a, b) => a && b ? [+Math.max(b.left - a.right, a.left - b.right).toFixed(1), +Math.max(b.top - a.bottom, a.top - b.bottom).toFixed(1)] : null;
  const sheet = document.getElementById('locations').getBoundingClientRect(), credit = R(document.querySelector('.leaflet-control-attribution')), tag = R(document.querySelector('.tag-popup .tag-body')) || R(document.querySelector('.tag-popup'));
  const panel = document.getElementById('filtersPanel').classList.contains('visible') ? R(document.getElementById('filtersPanel')) : null;
  const el = document.elementFromPoint((tg.left + tg.right) / 2, (tg.top + tg.bottom) / 2);
  return { visible: cs.visibility !== 'hidden', box: [r.left, r.top, r.right, r.bottom].map(Math.round), tag: [tg.left, tg.top, tg.right, tg.bottom].map(Math.round), ringTop: Math.round(ring.top),
    footToSheet: Math.round(sheet.top - tg.bottom), sheetTop: Math.round(sheet.top), hitTag: el ? (el.closest('#pencilPin') ? 'self' : (el.id || el.className || el.tagName)) : null,
    credit: credit && [credit.left, credit.top, credit.right, credit.bottom].map(Math.round), creditGap: gap(r, credit), overCredit: ov(r, credit),
    tagBox: tag && [tag.left, tag.top, tag.right, tag.bottom].map(Math.round), overTag: ov(r, tag), tagFootToSheet: tag ? Math.round(sheet.top - tag.bottom) : null, overPanel: ov(r, panel),
    pinsUnder: [...document.querySelectorAll('.leaflet-marker-icon')].filter(m => ov(r, m.getBoundingClientRect())).length,
    zoomGap: gap(r, document.querySelector('.leaflet-control-zoom').getBoundingClientRect()), acctGap: gap(r, document.getElementById('accountBtn').getBoundingClientRect()) };
});
const starTag = async p => { const id = await p.evaluate(() => (locations.find(l => l.starred && document.querySelector(`#locationsList .location-card[data-id="${l.id}"]`)) || {}).id); await p.click(`#locationsList .location-card[data-id="${id}"]`); await p.waitForTimeout(1900); };
(async () => {
  const b = await L.launch(); const out = { C: {}, A: {} };
  const CS = {
    rest_844: { vp: [390, 844] }, rest_664: { vp: [390, 664] }, collapsed_safe: { vp: [390, 844], inset: true, pre: 'collapse' },
    cph_320: { vp: [320, 568], city: 'copenhagen' }, se_375: { vp: [375, 667] },
    tag_844: { vp: [390, 844], pre: 'tag' }, tag_664: { vp: [390, 664], pre: 'tag' }, tag_closed_664: { vp: [390, 664], pre: 'tag', close: true },
    filters_844: { vp: [390, 844], pre: 'filters' }, filters_664: { vp: [390, 664], pre: 'filters' },
  };
  fs.mkdirSync(path.join(__dirname, 'frames'), { recursive: true });
  for (const [n, s] of Object.entries(CS)) {
    const { ctx, page, errs } = await L.open(b, { html: C + '/index.html', ...s, patch: h => cLook(h) });
    await page.evaluate(c => setActiveCity(c), s.city || 'reykjavik'); await page.waitForTimeout(900);
    if (s.pre === 'collapse') { await page.click('#collapseBtn'); await page.waitForTimeout(700); }
    if (s.pre === 'filters') { await page.click('#toggleFiltersBtn'); await page.waitForTimeout(600); }
    if (s.pre === 'tag') await starTag(page);
    if (s.close) { await page.evaluate(() => map.closePopup()); await page.waitForTimeout(900); }
    out.C[n] = { ...(await pinM(page)), chrome: await chromeCheck(page), errs };
    await page.screenshot({ path: path.join(__dirname, `frames/C-${n}-3x.png`) });
    console.log('C', n, JSON.stringify(out.C[n])); await ctx.close();
  }
  out.C.pins = {};
  for (const city of ['la', 'reykjavik', 'copenhagen', 'malmo', 'stockholm']) for (const col of [false, true]) {
    const { ctx, page } = await L.open(b, { html: C + '/index.html', vp: [390, 844], dsf: 1, patch: h => cLook(h) });
    await page.evaluate(c => setActiveCity(c), city); await page.waitForTimeout(900);
    if (col) { await page.click('#collapseBtn'); await page.waitForTimeout(700); }
    out.C.pins[city + (col ? '_collapsed' : '')] = (await pinM(page)).pinsUnder; await ctx.close();
  }
  console.log('C pins', JSON.stringify(out.C.pins));
  // A: the title at each width, every city, places + a long plan name; today vs the ticket
  for (const vp of [[320, 568], [375, 667], [390, 844]]) for (const who of ['today', 'A']) {
    const { ctx, page } = await L.open(b, { html: '/home/user/la-trip-map/index.html', vp, dsf: 1, patch: who === 'A' ? aLook : undefined });
    for (const city of ['la', 'reykjavik', 'copenhagen', 'malmo', 'stockholm', 'all']) {
      await page.evaluate(c => setActiveCity(c), city); await page.waitForTimeout(500);
      await page.evaluate(() => window.fitTitle && window.fitTitle()); await page.waitForTimeout(50);
      const t = await page.evaluate(() => { const h = document.querySelector('#locationsHeader h2'), r = h.getBoundingClientRect(), n = h.querySelector('.n') || h;
        const shown = [...(h.querySelectorAll('span').length ? h.querySelectorAll('span') : [h])].filter(e => getComputedStyle(e).display !== 'none').map(e => e.textContent).join('');
        return { w: Math.round(r.width), full: h.textContent, shown, ellipsized: n.scrollWidth > n.clientWidth + 1, cls: h.className }; });
      (out.A[vp.join('x')] = out.A[vp.join('x')] || {})[`${who}:${city}`] = t;
    }
    if (who === 'A') await page.screenshot({ path: path.join(__dirname, `frames/A-title-${vp[0]}-1x.png`), clip: { x: 0, y: vp[1] - 300, width: vp[0], height: 57 } });
    await ctx.close();
  }
  console.log('A', JSON.stringify(out.A, null, 1));
  fs.writeFileSync(path.join(__dirname, 'measure.json'), JSON.stringify(out, null, 1));
  await b.close();
})();
