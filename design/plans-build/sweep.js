// Pan sweep (r9; rules r20, designer v3 §15), ported to the REAL index.html. Nørrebro and the Harbour
// loop, sheet collapsed and panel open, at z11-z15, the map panned over a 7x7 grid (±120px) around the
// plan -- 980 views; after every pan (moveend -> applyPlanMap) the CHECK below holds.
//   REPO=<worktree> VENDOR=<dir> node sweep.js
const fs = require('fs'), path = require('path');
const REPO = process.env.REPO || path.resolve(__dirname, '../..');
process.env.PAGE = process.env.PAGE || path.join(REPO, 'index.html');   // the REAL index.html
const { open, launch, FIX } = require('./harness');
const W = ms => new Promise(r => setTimeout(r, ms));
const P7 = { id: 'p-7', name: 'Harbour loop', created_at: '2026-09-26T10:00:00Z' };
const SEVEN = { plans: FIX.plans.concat([P7]), stops: FIX.stops.concat(['nyh', 'har', 'ama', 'jmm', 'chr', 'tiv', 'isr'].map((l, i) => ({ id: 'h' + i, plan_id: 'p-7', location_id: l, shape_id: null, position: i + 1 }))) };

const CHECK = () => {
  // r20: the stop tags beside clusters (the only tags since r18). After every pan/zoom: no two tags overlap;
  // every tag's numerals are on top (not under a star, a disc or another tag); every stop in view is findable
  // -- its numbered pin, or a tag that lists it.
  const mb = document.getElementById('map').getBoundingClientRect(), pn = document.getElementById('filtersPanel'), l = document.getElementById('locations');
  const cover = Math.min(l.getBoundingClientRect().top, pn.classList.contains('visible') ? pn.getBoundingClientRect().top : 1e9);
  const vis = p => p.x >= 0 && p.x <= innerWidth && p.y >= mb.top && p.y <= cover;
  const cen = el => { const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; };
  const tags = [...document.querySelectorAll('#map .cluster-stops')].filter(t => vis(cen(t)));
  const bad = [], forced = [];
  tags.forEach((a, i) => tags.slice(i + 1).forEach(b => { const p = a.getBoundingClientRect(), q = b.getBoundingClientRect();
    if (p.left < q.right && q.left < p.right && p.top < q.bottom && q.top < p.bottom) bad.push(`tag ${a.textContent} on tag ${b.textContent}`); }));
  tags.forEach(t => { const rg = document.createRange(); rg.selectNodeContents(t); const r = rg.getBoundingClientRect();
    const pts = [0.2, 0.5, 0.8].map(f => ({ x: r.left + r.width * f, y: r.top + r.height / 2 }));
    const cov = pts.map(pt => document.elementFromPoint(pt.x, pt.y)).filter(h => !h || !t.contains(h) && h !== t);
    if (cov.length) (t.dataset.forced ? forced : bad).push(`digits of ${t.textContent} covered by ${cov.map(h => h ? (h.closest('.cluster-stops') ? 'tag ' + h.closest('.cluster-stops').textContent : h.closest('.marker-star') ? 'star' : h.closest('.leaflet-marker-icon') ? (h.closest('.leaflet-marker-icon').querySelector('.plan-stop') ? 'stop' : h.closest('.leaflet-marker-icon').querySelector('svg text') ? (h.closest('.leaflet-marker-icon') === t.closest('.leaflet-marker-icon') ? 'own cluster' : 'cluster z' + h.closest('.leaflet-marker-icon').style.zIndex + ' vs ' + t.closest('.leaflet-marker-icon').style.zIndex + (h.closest('.leaflet-marker-icon').querySelector('.cluster-stops') ? ' (tagged)' : '')) : 'pin') : h.tagName) : 'none').join('/')}`); });
  const pm = planMarks(), shown = new Set();
  const nums = label => label.split(',').flatMap(tk => { const [x, y] = tk.split(/[–…]/).map(Number); return y ? Array.from({ length: y - x + 1 }, (_, i) => x + i) : [x]; });
  tags.forEach(t => nums(t.textContent).forEach(n => shown.add(n)));
  document.querySelectorAll('#map .plan-stop .pin-n').forEach(pn2 => { const c = cen(pn2); if (!vis(c)) return; const h = document.elementFromPoint(c.x, c.y); if (h && h.closest('.leaflet-marker-icon') === pn2.closest('.leaflet-marker-icon')) shown.add(+pn2.textContent); else forced.push('pin ' + pn2.textContent + ' stacked'); });
  pm.rows.forEach(r => { const c = r.loc ? [r.loc.lat, r.loc.lng] : shapeCentroid(r.nb); if (!c) return; const p = map.latLngToContainerPoint(c);
    const pp = { x: p.x + mb.left, y: p.y + mb.top }; if (pp.x < 14 || pp.x > innerWidth - 14 || pp.y < mb.top + 14 || pp.y > cover - 14) return;
    if (!shown.has(r.n) && !forced.some(f => f === 'pin ' + r.n + ' stacked')) bad.push(`stop ${r.n} not findable`); });
  // build extras (r18/r19 truths): a tag sits flush (0-2.5px) beside / above / below its own count, and
  // never over any count unless forced (every flush spot over another count: disclosed above)
  const counts = [...document.querySelectorAll('#map .leaflet-marker-icon svg text')];
  tags.forEach(t => { const a = t.getBoundingClientRect(), own = t.closest('.leaflet-marker-icon').querySelector('svg text').getBoundingClientRect();
    if (!t.dataset.forced && counts.some(tx => { const q = tx.getBoundingClientRect(); return a.left < q.right && q.left < a.right && a.top < q.bottom && q.top < a.bottom; })) bad.push('tag ' + t.textContent + ' over a count');
    const side = a.left >= own.right - 0.5 ? a.left - own.right : own.left >= a.right - 0.5 ? own.left - a.right : null, stack = a.top >= own.bottom - 0.5 ? a.top - own.bottom : own.top >= a.bottom - 0.5 ? own.top - a.bottom : null;
    const level = a.top <= own.top + 1 && a.bottom >= own.bottom - 1, centred = a.left <= own.left + 1 && a.right >= own.right - 1;
    if (!((side != null && side <= 2.5 && level) || (stack != null && stack <= 2.5 && centred))) bad.push('tag ' + t.textContent + ' not flush'); });
  return { n: tags.length, bad, forced };
};

(async () => {
  const b = await launch();
  let views = 0, fails = 0, tagsSeen = 0, forcedN = 0;
  for (const [pid, fix] of [['p-nor', FIX], ['p-7', SEVEN]]) for (const state of ['collapsed', 'panel']) for (const z of [11, 12, 13, 14, 15]) {
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
      views++; tagsSeen += r.n; forcedN += r.forced.length;
      if (r.bad.length) { fails++; console.log(`FAIL ${pid} ${state} z${z} pan ${i * 40},${j * 40}: ${r.bad.join('; ')}`); }
    }
    await page.context().close();
  }
  await b.close();
  console.log(`${fails ? 'FAIL' : 'PASS'} sweep: ${views - fails}/${views} views clean (${tagsSeen} cluster tags checked; ${forcedN} disclosed: a single stop pin stacked under another, or a forced knot)`);
  process.exit(fails ? 1 : 0);
})();
