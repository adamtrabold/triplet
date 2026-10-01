// Pan sweep (r9; rules r18). Nørrebro and the Harbour loop, sheet collapsed and panel open, at z12-z15,
// the map panned over a 7x7 grid (±120px) around the plan -- after every pan (moveend -> applyPlanMap)
// the CHECK below holds.
//   REPO=<worktree> VENDOR=<dir> node sweep.js
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const REPO = process.env.REPO || path.resolve(__dirname, '../..');
process.env.PAGE = process.env.PAGE || path.join(REPO, 'index.html');   // the REAL index.html
const OUTROOT = process.env.OUT || '/tmp/plans-v3-out';   // checks write here, never into the repo
const { open, launch, FIX } = require('./harness');
const W = ms => new Promise(r => setTimeout(r, ms));
const P7 = { id: 'p-7', name: 'Harbour loop', created_at: '2026-09-26T10:00:00Z' };
const SEVEN = { plans: FIX.plans.concat([P7]), stops: FIX.stops.concat(['nyh', 'har', 'ama', 'jmm', 'chr', 'tiv', 'isr'].map((l, i) => ({ id: 'h' + i, plan_id: 'p-7', location_id: l, shape_id: null, position: i + 1 }))) };

const CHECK = () => {
  // r18 (owner): a single stop pin carries its number in place of the glyph; a red cluster that holds
  // stops carries one grey tag flush against its count. After every pan: every stop in view shows
  // its number (its own pin's, or its cluster's tag), uncovered -- two stop pins drawn on top of
  // each other show the lower number, as Places stacks pins (counted, not failed); no cluster tag
  // covers any count, and each sits flush (0-2.5px) beside / above / below its own count.
  const mb = document.getElementById('map').getBoundingClientRect(), pn = document.getElementById('filtersPanel'), l = document.getElementById('locations');
  const cover = Math.min(l.getBoundingClientRect().top, pn.classList.contains('visible') ? pn.getBoundingClientRect().top : 1e9);
  const cen = el => { const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; };
  const vis = p => p.x >= 14 && p.x <= innerWidth - 14 && p.y >= mb.top + 80 && p.y <= cover - 22;
  const pm = planMarks();
  const parse = label => /…/.test(label) ? (() => { const [x, y] = label.split('…').map(Number); return pm.rows.filter(r => r.n >= x && r.n <= y).map(r => r.n); })()
    : label.split(',').flatMap(tk => { const [x, y] = tk.split('–').map(Number); return y ? Array.from({ length: y - x + 1 }, (_, i) => x + i) : [x]; });
  const top = (t) => { const c = cen(t), h = document.elementFromPoint(c.x, c.y); return h && h.closest('.leaflet-marker-icon') === t.closest('.leaflet-marker-icon'); };
  const shown = new Set(), stacked = [];
  document.querySelectorAll('#map .plan-stop .pin-n').forEach(t => { if (top(t)) shown.add(+t.textContent); else { const h = document.elementFromPoint(cen(t).x, cen(t).y); if (h && h.closest('.plan-stop')) stacked.push(+t.textContent); } });
  const ctags = [...document.querySelectorAll('#map .cluster-stops')];
  ctags.forEach(t => { if (top(t)) parse(t.textContent).forEach(n => shown.add(n)); });
  const bad = [];
  pm.rows.forEach(r => { const c = r.loc ? [r.loc.lat, r.loc.lng] : shapeCentroid(r.nb); if (!c) return; const p = map.latLngToContainerPoint(c);
    if (vis({ x: p.x + mb.left, y: p.y + mb.top }) && !shown.has(r.n) && !stacked.includes(r.n)) bad.push('stop ' + r.n + ' number not visible'); });
  const counts = [...document.querySelectorAll('#map .leaflet-marker-icon svg text')];
  ctags.forEach(t => { const a = t.getBoundingClientRect(), own = t.closest('.leaflet-marker-icon').querySelector('svg text').getBoundingClientRect();
    if (counts.some(tx => { const b = tx.getBoundingClientRect(); return a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom; })) bad.push('tag ' + t.textContent + ' over a count');
    const side = a.left >= own.right - 0.5 ? a.left - own.right : own.left >= a.right - 0.5 ? own.left - a.right : null, stack = a.top >= own.bottom - 0.5 ? a.top - own.bottom : own.top >= a.bottom - 0.5 ? own.top - a.bottom : null;
    const level = a.top <= own.top + 1 && a.bottom >= own.bottom - 1, centred = a.left <= own.left + 1 && a.right >= own.right - 1;
    if (!((side != null && side <= 2.5 && level) || (stack != null && stack <= 2.5 && centred))) bad.push('tag ' + t.textContent + ' not flush'); });
  return { n: shown.size, bad, stacked: stacked.length, ctags: ctags.length };
};

(async () => {
  const b = await launch();
  let views = 0, fails = 0, numsSeen = 0, stackedN = 0, ctagN = 0;
  for (const [pid, fix] of [['p-nor', FIX], ['p-7', SEVEN]]) for (const state of ['collapsed', 'panel']) for (const z of [12, 13, 14, 15]) {
    const { page } = await open(b, { plans: fix.plans, stops: fix.stops, visited: ['mir'] });
    await page.evaluate(() => document.getElementById('toggleFiltersBtn').click()); await W(350);
    await page.evaluate(() => document.querySelector('#listSwitch [data-view="plans"]').click()); await W(700);
    if (pid !== 'p-nor') { await page.evaluate(() => document.querySelector('#planPick .plan-picker').click()); await W(150); await page.evaluate(id => document.querySelector(`#planLedger [data-plan="${id}"]`).click(), pid); await W(700); }
    if (state === 'collapsed') { await page.evaluate(() => document.getElementById('toggleFiltersBtn').click()); await W(450); await page.evaluate(() => document.getElementById('collapseBtn').click()); await W(600); }
    await page.evaluate(z => { const pts = planMarks().rows.map(r => r.loc ? [r.loc.lat, r.loc.lng] : shapeCentroid(r.nb)); map.setView(L.latLngBounds(pts).getCenter(), z, { animate: false }); }, z);
    await W(300);
    for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) {
      await page.evaluate(([dx, dy]) => { window.__o = window.__o || map.getCenter(); map.setView(window.__o, map.getZoom(), { animate: false }); map.panBy([dx, dy], { animate: false }); }, [i * 40, j * 40]);
      await W(60);
      const r = await page.evaluate(CHECK);
      views++; numsSeen += r.n; stackedN += r.stacked; ctagN += r.ctags;
      if (r.bad.length) { fails++; console.log(`FAIL ${pid} ${state} z${z} pan ${i * 40},${j * 40}: ${r.bad.join('; ')}`); }
    }
    await page.context().close();
  }
  await b.close();
  console.log(`${fails ? 'FAIL' : 'PASS'} sweep: ${views - fails}/${views} views clean (${numsSeen} stop numbers seen, ${ctagN} cluster tags; ${stackedN} stop numbers under another stop's pin, as Places stacks pins)`);
  process.exit(fails ? 1 : 0);
})();
