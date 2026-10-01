// r9: pan sweep. Nørrebro and the Harbour loop, sheet collapsed and panel open, at z14 and z15, map
// panned over a 7x7 grid (±120px) around the plan -- after every pan (moveend -> applyPlanMap),
// no stop tag sits under the zoom control / round buttons / attribution, and every tag is nearer
// its own stop's pin than any other marker.
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
  const mb = document.getElementById('map').getBoundingClientRect(), pn = document.getElementById('filtersPanel'), l = document.getElementById('locations');
  const cover = Math.min(l.getBoundingClientRect().top, pn.classList.contains('visible') ? pn.getBoundingClientRect().top : 1e9);
  const cen = el => { const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; };
  const vis = p => p.x >= 0 && p.x <= innerWidth && p.y >= mb.top && p.y <= cover;
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const pm = planMarks(), chrome = planChrome();
  const parse = label => label.split(',').flatMap(tk => { const [x, y] = tk.split('–').map(Number); return y ? Array.from({ length: y - x + 1 }, (_, i) => x + i) : [x]; });
  const elOfN = n => { const r = pm.rows.find(x => x.n === n); const e = r && (r.loc ? markersById.get(r.loc.id) : planShapeMarkers.get(r.nb.id)); return e && e.marker.getElement(); };

  // r9: judge each visible tag against its 8 possible spots, measured from the DOM: a spot is CLEAN
  // if it is on screen, clear of the map chrome, and its centre is nearer the tag's own pin(s) than
  // any other marker. A tag fails only if it is not clean while a clean spot existed; tags with
  // no clean spot (pin at the screen edge, under a button, or overlapped by a place pin) are counted.
  const judgeTags = (tagEls, ownOf, markerEls, mb, chromeR) => {
    const out = { bad: [], forced: [] };
    const cenOf = el => { const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2 - mb.left, y: r.y + r.height / 2 - mb.top }; };
    tagEls.forEach(t => {
      const own = ownOf(t); if (!own.length) return;
      const ownC = own.map(cenOf), others = markerEls.filter(e => !own.includes(e)).map(cenOf);
      const top = t.closest('.leaflet-marker-icon'), P = cenOf(top.querySelector('.plan-stop') ? top.querySelector('.plan-stop').closest('.leaflet-marker-icon') : top);
      const w = t.offsetWidth || 14, h = 14;
      const clean = rc => { const c = { x: (rc.x1 + rc.x2) / 2, y: (rc.y1 + rc.y2) / 2 };
        if (rc.x1 < 2 || rc.y1 < 2 || rc.x2 > mb.width - 2 || rc.y2 > mb.height - 2) return false;
        if (chromeR.some(o => rc.x1 < o.x2 - 4 && o.x1 + 4 < rc.x2 && rc.y1 < o.y2 - 4 && o.y1 + 4 < rc.y2)) return false;
        if (tagEls.concat([...document.querySelectorAll('.stop-tag')]).some(o => o !== t && getComputedStyle(o).display !== 'none' && (() => { const q = o.getBoundingClientRect(); return rc.x1 < q.right - mb.left && q.left - mb.left < rc.x2 && rc.y1 < q.bottom - mb.top && q.top - mb.top < rc.y2; })())) return false;   // on another tag
        const ownD = Math.min(...ownC.map(p => Math.hypot(p.x - c.x, p.y - c.y)));
        return !others.some(p => Math.hypot(p.x - c.x, p.y - c.y) <= ownD); };
      const spots = [[-13 - w + 2, -13 - h + 2], [11, -13 - h + 2], [11, 11], [-13 - w + 2, 11], [-w / 2, -13 - h], [13, -h / 2], [-w / 2, 13], [-13 - w, -h / 2]]
        .map(([dx, dy]) => ({ x1: P.x + dx, y1: P.y + dy, x2: P.x + dx + w, y2: P.y + dy + h }));
      const r = t.getBoundingClientRect(), act = { x1: r.left - mb.left, y1: r.top - mb.top, x2: r.right - mb.left, y2: r.bottom - mb.top };
      if (clean(act)) return;
      if (spots.some(clean)) out.bad.push(t.textContent); else out.forced.push(t.textContent);
    });
    return out;
  };
  const all = [...document.querySelectorAll('#map .leaflet-marker-icon')].filter(e => vis(cen(e)));
  const vtags = [...document.querySelectorAll('.stop-tag')].filter(t => getComputedStyle(t).display !== 'none' && vis(cen(t)) && (() => { const o = elOfN(parse(t.textContent)[0]); return o && vis(cen(o)); })());
  const n = vtags.length;
  const j = judgeTags(vtags, t => parse(t.textContent).map(elOfN).filter(Boolean), all, { left: mb.left, top: mb.top, width: mb.width, height: cover - mb.top }, chrome);
  const bad = j.bad, forced = j.forced;
  return { n, bad, forced };
};

(async () => {
  const b = await launch();
  let views = 0, fails = 0, tagsSeen = 0, forcedN = 0;
  for (const [pid, fix] of [['p-nor', FIX], ['p-7', SEVEN]]) for (const state of ['collapsed', 'panel']) for (const z of [14, 15]) {
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
  console.log(`${fails ? 'FAIL' : 'PASS'} sweep: ${views - fails}/${views} views clean (${tagsSeen} tags checked; ${forcedN} tag-views had no clean spot: pin at the edge, under a button, or overlapped by a place pin)`);
  process.exit(fails ? 1 : 0);
})();
