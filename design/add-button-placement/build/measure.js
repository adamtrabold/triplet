// Re-measure: node design/add-button-placement/build/measure.js index.html [framesdir]   (ONLY=<prefix>)
// node measure.js <index.html> [outdir]  -- measures the add badge in every state the handoff names; shoots stills when outdir given.
const L = require('./lib.js'); const path = require('path'); const fs = require('fs');
const HTML = process.argv[2], OUT = process.argv[3];
if (OUT) fs.mkdirSync(OUT, { recursive: true });
const M = () => {
  const bx = r => r && r.width ? [r.left, r.top, r.right, r.bottom].map(v => +v.toFixed(1)) : null;
  const vis = e => { if (!e) return null; const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return null; return e.getBoundingClientRect(); };
  const b = document.getElementById('floatingAddBtn'), br = b.getBoundingClientRect();
  const sheet = document.getElementById('locations').getBoundingClientRect();
  const credit = vis(document.querySelector('.leaflet-control-attribution'));
  const tag = vis(document.querySelector('.tag-popup .tag')) || vis(document.querySelector('.tag-popup'));
  const sub = vis(document.getElementById('submitBtn'));
  const hit = (x, y) => { const e = document.elementFromPoint(x, y); return e ? (b.contains(e) ? 'badge' : (e.id || String(e.className).slice(0, 24) || e.tagName)) : null; };
  const l = document.getElementById('locationsList'); let rows = 0;
  if (l.offsetHeight) { const lr = l.getBoundingClientRect(); rows = [...l.querySelectorAll('.location-card[data-id]')].filter(c => { const r = c.getBoundingClientRect(); return r.top >= lr.top - 1 && r.bottom <= Math.min(lr.bottom, innerHeight) + 1; }).length; }
  const cs = getComputedStyle(b);
  return { box: bx(br), sheetTop: +sheet.top.toFixed(1), inkLeft: +(br.left + 4.68).toFixed(2), inkFoot: +(sheet.top - (br.bottom - 4.68)).toFixed(2),
    centreHit: hit((br.left + br.right) / 2, (br.top + br.bottom) / 2), active: b.classList.contains('active'), bg: cs.backgroundColor, img: cs.backgroundImage.slice(0, 12), fg: cs.color,
    gap: tagSheetGap(), add: bx(sub), addCentreDy: sub ? +(((sub.top + sub.bottom) / 2) - (br.top + br.bottom) / 2).toFixed(2) : null, addHit: sub ? hit((sub.left + sub.right) / 2, (sub.top + sub.bottom) / 2) : null,
    credit: bx(credit), creditText: credit && credit.width ? document.querySelector('.leaflet-control-attribution').textContent : null,
    creditGapToBadge: credit ? +Math.max(credit.left - br.right, br.top - credit.bottom, credit.top - br.bottom).toFixed(1) : null,
    tag: bx(tag), tagFootToBadgeTop: tag ? +(br.top - tag.bottom).toFixed(1) : null, rows, collapsed: document.getElementById('locations').classList.contains('collapsed'),
    form: bx(vis(document.getElementById('controls'))), tagKey: openTagKey(), auth: document.getElementById('authModal').classList.contains('show'),
    acct: bx(document.getElementById('accountBtn').getBoundingClientRect()), scroll: l.scrollTop };
};
const starTag = async p => { const id = await p.evaluate(() => (locations.find(l => l.starred && document.querySelector(`#locationsList .location-card[data-id="${l.id}"]`)) || {}).id); await p.click(`#locationsList .location-card[data-id="${id}"] .row-main`).catch(() => p.click(`#locationsList .location-card[data-id="${id}"]`)); await p.waitForTimeout(1900); };
const S = {
  rest_844: {}, rest_664: { vp: [390, 664] }, rest_375: { vp: [375, 667] }, rest_320: { vp: [320, 568], city: 'copenhagen' },
  collapsed_home: { inset: true, pre: 'collapse' }, desktop: { vp: [1280, 800], desk: true },
  tag_844: { pre: 'tag' }, tag_664: { vp: [390, 664], pre: 'tag' }, tag_320: { vp: [320, 568], city: 'copenhagen', pre: 'tag' },
  filters_844: { pre: 'filters' }, sort_844: { pre: 'sort', tap: true },
  form_844: { tap: true }, form_664: { vp: [390, 664], tap: true }, form_320: { vp: [320, 568], city: 'copenhagen', tap: true },
  form_collapsed_home: { inset: true, pre: 'collapse', tap: true }, form_desktop: { vp: [1280, 800], desk: true, tap: true },
  tagform_844: { pre: 'tag', tap: true, cancel: true }, scrolled_cancel: { pre: 'scroll', tap: true, cancel: true },
  play_form: { q: '', js: "try { localStorage.removeItem('sb-jgvckilmltimabfdvaly-auth-token'); } catch (e) {}", tap: true },
  stale_tap: { q: '?signin', tap: true },
  pressed_844: { press: true }, focus_844: { focus: true }, open_pressed: { tap: true, press: true },
  reduced_tag: { pre: 'tag', reduced: true },
};
(async () => {
  const b = await L.launch(); const only = process.env.ONLY; const out = {};
  for (const [n, s] of Object.entries(S)) {
    if (only && !n.startsWith(only)) continue;
    const { ctx, page, errs } = await L.open(b, { html: HTML, vp: s.vp || [390, 844], inset: s.inset, desk: s.desk, q: s.q, js: s.js, reduced: s.reduced });
    await page.evaluate(c => setActiveCity(c), s.city || 'reykjavik'); await page.waitForTimeout(900);
    if (s.pre === 'collapse') { await page.click('#collapseBtn'); await page.waitForTimeout(700); }
    if (s.pre === 'filters') { await page.click('#toggleFiltersBtn'); await page.waitForTimeout(700); }
    if (s.pre === 'sort') { await page.click('#sortBtn'); await page.waitForTimeout(500); }
    if (s.pre === 'tag') await starTag(page);
    if (s.pre === 'scroll') { await page.evaluate(() => { document.getElementById('locationsList').scrollTop = 200; }); await page.waitForTimeout(200); }
    const m = { before: await page.evaluate(M) };
    if (s.tap) {
      if (s.pre === 'sort') { await page.mouse.click(45, m.before.box[1] + 30); await page.waitForTimeout(800); m.afterFirstTap = await page.evaluate(M); await page.mouse.click(45, m.before.box[1] + 30); }
      else await page.click('#floatingAddBtn');
      // ride in step: sample the badge foot vs the sheet edge every frame of the drop
      m.track = await page.evaluate(() => new Promise(res => { const o = []; const t0 = performance.now(); (function f() { const b = document.getElementById('floatingAddBtn').getBoundingClientRect(), sh = document.getElementById('locations').getBoundingClientRect(); o.push(+(sh.top - b.bottom).toFixed(2)); if (performance.now() - t0 < 450) requestAnimationFrame(f); else res(o); })(); }));
      await page.waitForTimeout(700); m.after = await page.evaluate(M);
    }
    if (s.press) { const r = m.before.box; await page.mouse.move((r[0] + r[2]) / 2, (r[1] + r[3]) / 2); await page.mouse.down(); await page.waitForTimeout(250); m.pressed = await page.evaluate(M); }
    if (s.focus) { await page.focus('#locationsHeader h2').catch(() => {}); await page.evaluate(() => document.getElementById('floatingAddBtn').focus()); await page.keyboard.press('Shift'); await page.waitForTimeout(200); m.focusRing = await page.evaluate(() => getComputedStyle(document.getElementById('addFocus')).display); }
    if (OUT) await page.screenshot({ path: path.join(OUT, `${n}.png`) });
    if (s.press) await page.mouse.up();
    if (s.cancel) { await page.click('#floatingAddBtn'); await page.waitForTimeout(1500); m.afterCancel = await page.evaluate(M); if (OUT) await page.screenshot({ path: path.join(OUT, `${n}-cancel.png`) }); }
    m.errs = errs; out[n] = m; console.log(n, JSON.stringify(m));
    await ctx.close();
  }
  if (OUT) fs.writeFileSync(path.join(OUT, 'measure.json'), JSON.stringify(out, null, 1));
  await b.close();
})();
