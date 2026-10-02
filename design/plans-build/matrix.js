// The Plans map rules R1-R5 (README "Map rules"), asserted over a zoom matrix on the real page
// Copenhagen day (2 cities)} x {panel open, sheet collapsed}, plus the tapped-place cells.
// Every cell is rendered (1x full screen + 3x map crop) and every rule is checked on marker
// data read from the live map; the run fails on any violation.
//   REPO=<worktree> VENDOR=<dir> node matrix.js   -> ../matrix/*.png, ../matrix/matrix.json, ../matrix/sheet.png
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const REPO = process.env.REPO || path.resolve(__dirname, '../..');
process.env.PAGE = process.env.PAGE || path.join(REPO, 'index.html');   // the REAL index.html
const OUTROOT = process.env.OUT || '/tmp/plans-v3-out';   // checks write here, never into the repo
const { open, launch, FIX } = require('./harness');
const OUT = path.join(OUTROOT, 'matrix');
fs.mkdirSync(OUT, { recursive: true });
const W = ms => new Promise(r => setTimeout(r, ms));
const ZOOMS = [9, 10, 11, 12, 13, 14, 15];
const PLANS = [['nor', 'p-nor'], ['mc', 'p-mc']];
const P7 = { id: 'p-7', name: 'Harbour loop', created_at: '2026-09-26T10:00:00Z' };
const SEVEN = { plans: FIX.plans.concat([P7]), stops: FIX.stops.concat(['nyh', 'har', 'ama', 'jmm', 'chr', 'tiv', 'isr'].map((l, i) => ({ id: 'h' + i, plan_id: 'p-7', location_id: l, shape_id: null, position: i + 1 }))) };
const cells = [];
for (const [pk, pid] of PLANS) for (const state of ['collapsed', 'panel']) for (const z of ZOOMS) cells.push({ name: `${pk}-${state}-z${z}`, pid, state, z });
// r5: the 7-stop Harbour loop (owner-09), z11-z13, and mid-reorder (a stop held and lifted)
for (const state of ['collapsed', 'panel']) for (const z of [11, 12, 13]) cells.push({ name: `h7-${state}-z${z}`, pid: 'p-7', state, z, fix: SEVEN });
for (const z of [11, 12, 13]) cells.push({ name: `h7-reorder-z${z}`, pid: 'p-7', state: 'panel', z, fix: SEVEN, lift: 'isr' });
// r7: each plan's DEFAULT fit (frameActivePlan), panel open and sheet collapsed
for (const [pk, pid, fix] of [['nor', 'p-nor', null], ['mc', 'p-mc', null], ['h7', 'p-7', SEVEN]]) for (const state of ['panel', 'collapsed']) cells.push({ name: `${pk}-fit-${state}`, pid, state, fit: true, fix });
// r9: close -> reopen the panel: untouched, after a manual pan, and after the pan that follows a +
for (const [pk, pid, fix] of [['nor', 'p-nor', null], ['mc', 'p-mc', null], ['h7', 'p-7', SEVEN]]) for (const seq of ['reopen', 'reopen-panned', 'reopen-added']) cells.push({ name: `${pk}-${seq}`, pid, state: 'panel', seq, fix });
for (const z of [12, 13, 14, 15]) cells.push({ name: `nor-picked-z${z}`, pid: 'p-nor', state: 'collapsed', z, pick: 'kin' });   // Keramiker Inge Vincents, next to stop 3

// Runs in the page: the r6 rules over the markers actually drawn.
//  R1 digits only on stop tags (navy on a square tile) and Places' clusters (paper on a red disc)
//  R2 every stop drawn once, at its true location; never inside a cluster
//  R3 every place below the rule behaves as in Places: its own pin, or a member of a Places cluster
//  R4 stops above every cluster and pin they overlap; a stop clear of other stops is topmost (readable)
//  R5 the tapped place is Places' highlighted pin, drawn under the stops
const RULES = (o) => {
  const c_fit = !!(o && o.fit);
  const res = [];
  const ok = (rule, pass, info) => res.push({ rule, pass: !!pass, info: pass ? undefined : info });
  const mapBox = document.getElementById('map').getBoundingClientRect();
  const cover = (() => { const p = document.getElementById('filtersPanel'), l = document.getElementById('locations');
    const tops = [l.getBoundingClientRect().top]; if (p.classList.contains('visible')) tops.push(p.getBoundingClientRect().top); return Math.min(...tops); })();
  const inView = pt => pt.x >= 14 && pt.x <= innerWidth - 14 && pt.y >= mapBox.top + 80 && pt.y <= cover - 22;
  const cen = el => { const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width }; };
  const toPage = ll => { const p = map.latLngToContainerPoint(ll); return { x: p.x + mapBox.left, y: p.y + mapBox.top }; };
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const topAt = (pt, el) => { const h = document.elementFromPoint(pt.x, pt.y); return !!h && h.closest('.leaflet-marker-icon') === el; };
  const z = el => +el.style.zIndex || 0;
  const all = [...document.querySelectorAll('.leaflet-marker-icon')];
  const kind = el => el.querySelector('.plan-stop') ? 'stop' : el.querySelector('circle[fill="var(--figure-deep)"]') ? 'cluster' : 'pin';
  const marks = all.map(el => ({ el, k: kind(el), c: cen(el) })).filter(mk => inView(mk.c));
  const zoom = map.getZoom(), pm = planMarks();
  // a tag counts wherever it is visible on the map, even if its own pin's centre sits in the margin
  const tagVisible = t => { const r = t.getBoundingClientRect(), c = { x: r.x + r.width / 2, y: r.y + r.height / 2 }; return c.x >= 0 && c.x <= innerWidth && c.y >= mapBox.top && c.y <= cover; };
  // r18: a single stop pin carries its number in place of the glyph (no tag); tags exist only beside clusters
  const tags = all.filter(el => kind(el) === 'stop').map(el => el.querySelector('.pin-n')).filter(t => t && tagVisible(t));
  // r17: the tags clusters carry for the stops inside them
  const ctagsAll = all.filter(el => kind(el) === 'cluster').map(el => el.querySelector('.cluster-stops')).filter(t => t && tagVisible(t));
  const ctags = ctagsAll.filter(t => !t.dataset.forced);   // forced: every flush spot lies over another cluster's count (overlapping clusters) -- counted below
  const forcedTags = ctagsAll.filter(t => t.dataset.forced).map(t => t.textContent);
  // R1
  const bad = marks.filter(mk => mk.k === 'pin' && /\d/.test(mk.el.textContent));
  ok('R1 digits only on stop tags and Places clusters', bad.length === 0, bad.map(mk => mk.el.textContent));
  const r1bad = tags.filter(t => { const cs = getComputedStyle(t), pin = t.closest('.plan-stop'); return !(parseFloat(cs.fontSize) >= 12 && (cs.color === 'rgb(90, 86, 76)' || pin.classList.contains('highlighted-marker')) && !pin.querySelector('use[href^="#g-"]:not([href="#g-star"])')); }).map(t => t.textContent + ':' + getComputedStyle(t).fontSize + ':' + getComputedStyle(t).color)
    .concat(ctags.filter(t => !(getComputedStyle(t).borderTopColor === 'rgb(90, 86, 76)' && parseFloat(getComputedStyle(t).borderRadius) >= t.getBoundingClientRect().height / 2 - 0.5 && getComputedStyle(t).backgroundColor !== 'rgb(90, 86, 76)')).map(t => 'ctag ' + t.textContent));
  ok('R1 (r18) a single stop pin shows its number in place of its glyph: grey (--ink-2; paper when selected), ≥12px, no glyph; a cluster’s stop tag is a grey ring on paper (r19: circle for one number, pill for more), never a solid disc; clusters are red discs', r1bad.length === 0, r1bad);
  // R2
  const r2 = [];
  const mv = mapVisibleLocations();
  // a cluster's id is "<p>cluster:[*]<member ids, sorted, comma-joined>" (mapVisibleLocations); district/street stops are 'shape:<id>'
  const clustered = new Set(mv.clusters.flatMap(c => c.id.replace(/^p?cluster:\*?/, '').split(',')));
  pm.rows.forEach(r => {
    const c = r.loc ? [r.loc.lat, r.loc.lng] : shapeCentroid(r.nb); if (!c) return;
    const t = toPage(c); if (!inView(t)) return;
    if ((r.loc && clustered.has(r.loc.id)) || (r.nb && clustered.has('shape:' + r.nb.id))) return;   // r17: inside a cluster -- its number is on the cluster's tag (R4)
    const e = r.loc ? markersById.get(r.loc.id) : planShapeMarkers.get(r.nb.id);
    const el = e && e.marker.getElement();
    if (!el) { r2.push(r.n + ' missing'); return; }
    if (dist(cen(el), t) > 1.5) r2.push(r.n + ' moved ' + dist(cen(el), t).toFixed(1));
  });
  ok('R2 (r17) every stop in view is either its own pin at its true location or a member of a Places cluster (stops cluster like any pin)', r2.length === 0, r2);
  // R3
  const miss = [];
  const cands = [...document.querySelectorAll('#locationsList > .location-card:not(.is-stop)[data-id]')];
  cands.forEach(row => {
    const id = row.dataset.id, l = locations.find(x => x.id === id);
    if (!inView(toPage([l.lat, l.lng]))) return;
    const e = markersById.get(id);
    if (e && e.marker.getElement()) { if (e.marker.getElement().querySelector('.plan-muted')) miss.push(id + ' muted'); return; }
    if (clustered.has(id) && zoom < SOLO_MIN_ZOOM) return;
    miss.push(id + ' missing');
  });
  ok(`R3 every place below the rule in view is a Places pin or in a Places cluster (${cands.length} rows)`, miss.length === 0, miss);
  ok('R3 no clusters at or above SOLO_MIN_ZOOM (as in Places)', zoom < SOLO_MIN_ZOOM || mv.clusters.length === 0);
  // R4 (r7): clusters are never covered by a stop; every stop number is visible
  const clusterMarks = marks.filter(mk => mk.k === 'cluster');
  const hitBy = pt => { const h = document.elementFromPoint(pt.x, pt.y); return h && h.closest('.leaflet-marker-icon'); };
  // r16: both findable. Every cluster: its count is topmost at its centre AND >= 60% of its drawn disc is
  // exposed (13 sample points) -- countable and tappable. Every stop: >= 70% of its pin exposed (13
  // points) and its tag topmost -- visible, with its tag pointing at a visible pin.
  const ring13 = (c, r) => [c].concat(Array.from({ length: 12 }, (_, i) => ({ x: c.x + r * Math.cos(i * Math.PI / 6), y: c.y + r * Math.sin(i * Math.PI / 6) })));
  const share = (el, pts) => pts.filter(pt => hitBy(pt) === el).length / pts.length;
  // (cluster-on-cluster overlap that Places itself draws -- original centres < 22px apart -- is Places' behaviour and not counted)
  const offOf = el => { const m = /translate\(([-\d.]+)px, ([-\d.]+)px\)/.exec((el.firstElementChild && el.firstElementChild.style.transform) || ''); return m ? { x: +m[1], y: +m[2] } : { x: 0, y: 0 }; };
  const centreOf = el => { const tr = el.querySelector('text').getBoundingClientRect(); return { x: tr.x + tr.width / 2, y: tr.y + tr.height / 2 }; };
  const origOf = el => { const c = centreOf(el), o = offOf(el); return { x: c.x - o.x, y: c.y - o.y }; };
  const blockerOK = (cl, h) => h === cl.el || (h && !h.querySelector('.plan-stop') && h.querySelector('circle[fill="var(--figure-deep)"]') && dist(origOf(h), origOf(cl.el)) < 22);
  const coveredClusters = clusterMarks.filter(cl => { const c = centreOf(cl.el), pts = ring13(c, 7);
    return !blockerOK(cl, hitBy(c)) || pts.filter(pt => blockerOK(cl, hitBy(pt))).length / pts.length < 0.6; });
  ok(`R4 (r16/r17) every Places cluster’s count is on top and ≥60% of its disc is exposed (${clusterMarks.length} clusters)`, coveredClusters.length === 0, coveredClusters.map(cl => { const tr = cl.el.querySelector('text').getBoundingClientRect(), c = { x: tr.x + tr.width / 2, y: tr.y + tr.height / 2 }; const hs = ring13(c, 7).map(pt => { const h = hitBy(pt); return h === cl.el ? '.' : h ? (h.querySelector('.plan-stop') ? (document.elementFromPoint(pt.x, pt.y).closest('.stop-tag') ? 'T' : 'S') : h.querySelector('circle[fill="var(--figure-deep)"]') ? 'C' : 'P') : '0'; }).join(''); return cl.el.textContent + ':' + hs; }));
  const stops = marks.filter(mk => mk.k === 'stop');
  const parse = label => label.split(',').flatMap(tk => { const [x, y] = tk.split('–').map(Number); return y ? Array.from({ length: y - x + 1 }, (_, i) => x + i) : [x]; });
  const shown = new Map();
  const blockers = [];
  const parseC = label => /…/.test(label) ? (() => { const [x, y] = label.split('…').map(Number); return pm.rows.filter(r => r.n >= x && r.n <= y).map(r => r.n); })() : parse(label);
  ctags.forEach(t => { const r = t.getBoundingClientRect(), c = { x: r.x + r.width / 2, y: r.y + r.height / 2 }; const h = document.elementFromPoint(c.x, c.y);
    if (h && h.closest('.leaflet-marker-icon') === t.closest('.leaflet-marker-icon')) parseC(t.textContent).forEach(n => shown.set(n, true)); else blockers.push('cluster ' + t.textContent); });
  tags.forEach(t => { const r = t.getBoundingClientRect(), c = { x: r.x + r.width / 2, y: r.y + r.height / 2 }; const h = document.elementFromPoint(c.x, c.y);
    if (h && h.closest('.leaflet-marker-icon') === t.closest('.leaflet-marker-icon')) parse(t.textContent).forEach(n => shown.set(n, true)); else blockers.push(t.textContent + ':' + (h ? (h.closest('.leaflet-marker-icon') ? kind(h.closest('.leaflet-marker-icon')) : h.className || h.tagName) : 'none')); });
  forcedTags.forEach(l => parse(l.replace(/…/g, '–')).forEach(n => shown.set(n, true)));   // a forced tag's stops are counted as a disclosed knot, not failed
  const coveredByStop = new Set(blockers.filter(b => /:stop$/.test(b)).flatMap(b => parse(b.split(':')[0])));
  const unseen = pm.rows.filter(r => { const c = r.loc ? [r.loc.lat, r.loc.lng] : shapeCentroid(r.nb); return c && inView(toPage(c)); }).filter(r => !shown.get(r.n) && !coveredByStop.has(r.n)).map(r => r.n);
  // (two single stop pins drawn on top of each other: the lower number shows, as Places stacks pins -- counted, not failed)
  ok(`R4 (r17/r19) every stop in view has its number on a visible, uncovered tag: its own pin, or its cluster’s${forcedTags.length ? ' -- forced knot (every flush spot over another cluster’s count): ' + forcedTags.join(' ') : ''}`, unseen.length === 0, { unseen, blockers });
  const onCount = ctags.filter(t => { const a = t.getBoundingClientRect(); return clusterMarks.some(cl => { const b = cl.el.querySelector('text').getBoundingClientRect(); return a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom; }); }).map(t => t.textContent);
  ok('R4 (r17) no tag ever covers a cluster’s count', onCount.length === 0, onCount);
  // r18: the tag is FLUSH beside its count: 0-2.5px from the digits, level with them, never over them
  const flush = ctags.filter(t => { const own = t.closest('.leaflet-marker-icon'), b = own.querySelector('text').getBoundingClientRect(), a = t.getBoundingClientRect();
    const side = a.left >= b.right - 0.5 ? a.left - b.right : b.left >= a.right - 0.5 ? b.left - a.right : null;
    const stack = a.top >= b.bottom - 0.5 ? a.top - b.bottom : b.top >= a.bottom - 0.5 ? b.top - a.bottom : null;
    const level = a.top <= b.top + 1 && a.bottom >= b.bottom - 1, centred = a.left <= b.left + 1 && a.right >= b.right - 1;
    return !((side != null && side >= -0.5 && side <= 2.5 && level) || (stack != null && stack >= -0.5 && stack <= 2.5 && centred)); }).map(t => t.textContent);
  ok('R4 (r18) a cluster’s stop tag sits flush against its count (0–2.5px from the digits: beside them, level, or above/below them, centred; never over them)', flush.length === 0, flush);

  const under = [];
  stops.forEach(s => marks.filter(o => o.k === 'pin').forEach(o => { if (dist(s.c, o.c) < 18 && z(o.el) >= z(s.el) && !o.el.querySelector('.highlighted-marker')) under.push(s.el.textContent); }));
  ok('R4 stops draw above every place pin', under.length === 0, under);
  if (c_fit) {
    const tb = ctags.map(t => t.getBoundingClientRect());
    ok('FIT no two cluster tags overlap', !tb.some((a, i) => tb.some((b, j) => i < j && a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom)));
    const panelOpen = document.getElementById('filtersPanel').classList.contains('visible');
    const box = planSafeBox(panelOpen ? document.getElementById('filtersPanel').offsetHeight : 0);
    const inBox = ll => { const p = map.latLngToContainerPoint(ll); return p.x >= box.l - 1 && p.x <= box.r + 1 && p.y >= box.t - 1 && p.y <= box.b + 1; };
    const llOf = r => r.loc ? L.latLng(r.loc.lat, r.loc.lng) : L.latLng(shapeCentroid(r.nb));
    // r12: following frames the selected city's stops (all stops with ALL CITIES or none in that city); building frames every stop
    const cityRows = filters.city === null ? [] : pm.rows.filter(r => (r.loc ? r.loc.city : r.nb.city) === filters.city);
    const rows = panelOpen || !cityRows.length ? pm.rows : cityRows, allIn = rows.every(r => inBox(llOf(r)));
    ok(`FIT (r12) the default view shows ${panelOpen ? 'every stop' : cityRows.length ? 'every stop in the selected city' : 'every stop'} inside the safe box`, allIn, rows.filter(r => !inBox(llOf(r))).map(r => r.n));
    if (panelOpen) {
      const o = planOthers(), cand = o.locs.map(l => L.latLng(l.lat, l.lng));
      ok(`FIT building: every place the filters match is in the safe map (${cand.length}, zoom ${zoom})`, zoom < 10 || cand.every(inBox));
    }
    const chrome = planChrome(), mbx = document.getElementById('map').getBoundingClientRect();
    const underChrome = all.filter(el => { const c = cen(el), x = c.x - mbx.left, y = c.y - mbx.top; return chrome.some(o => x > o.x1 && x < o.x2 && y > o.y1 && y < o.y2); }).map(el => kind(el));
    ok('FIT no stop, place or cluster sits under the zoom control, round buttons or attribution', underChrome.length === 0, underChrome);
  }
  // r9: after close -> reopen, the stops are in the strip above the panel
  if (o && o.seq) {
    const pn = document.getElementById('filtersPanel');
    const box = planSafeBox(pn.classList.contains('visible') ? pn.offsetHeight : 0);
    const inBox = ll => { const p = map.latLngToContainerPoint(ll); return p.x >= box.l - 1 && p.x <= box.r + 1 && p.y >= box.t - 1 && p.y <= box.b + 1; };
    const llOf = r => r.loc ? L.latLng(r.loc.lat, r.loc.lng) : L.latLng(shapeCentroid(r.nb));
    ok('REOPEN the panel is open again', pn.classList.contains('visible'));
    if (o.seen) { const lost = pm.rows.filter(r => o.seen.includes(r.n) && !inBox(llOf(r))).map(r => r.n);
      ok(`REOPEN after your own pan: the stops you had on screen (${o.seen.join(',')}) are in the strip above the panel`, o.seen.length > 0 && lost.length === 0, lost); }
    else { const lost = pm.rows.filter(r => !inBox(llOf(r))).map(r => r.n);
      ok('REOPEN every stop is in the strip above the panel (the building fit)', lost.length === 0, lost); }
  }
  // R5
  if (highlightedId && !pm.byLoc.has(highlightedId)) {
    const e = markersById.get(highlightedId), el = e && e.marker.getElement();
    ok('R5 the tapped place is Places’ highlighted pin', !!el && !!el.querySelector('.highlighted-marker'));
    if (el) ok('R5 …drawn under every stop', stops.every(s => z(s.el) > z(el)));
  }
  return { zoom, res, counts: marks.reduce((a, mk) => (a[mk.k] = (a[mk.k] || 0) + 1, a), {}) };
};

// r9: the add slip covers no stop tag, no part of the map you can see, not the chips, no stop
// row and no row's + (its 44px hit area).
const SLIP = () => {
  const s = document.getElementById('planSlip'); if (!s || s.hidden) return { rule: 'SLIP visible', pass: false, info: 'hidden' };
  const a = s.getBoundingClientRect(), hit = (b, t = 0.5) => a.left < b.right - t && b.left < a.right - t && a.top < b.bottom - t && b.top < a.bottom - t;
  const why = [];
  document.querySelectorAll('.stop-tag').forEach(t => { if (getComputedStyle(t).display !== 'none' && hit(t.getBoundingClientRect())) why.push('tag ' + t.textContent); });
  const pn = document.getElementById('filtersPanel'), l = document.getElementById('locations');
  const mb = document.getElementById('map').getBoundingClientRect(), cover = Math.min(l.getBoundingClientRect().top, pn.classList.contains('visible') ? pn.getBoundingClientRect().top : 1e9);
  if (hit({ left: mb.left, right: mb.right, top: mb.top, bottom: cover })) why.push('map');
  if (pn.classList.contains('visible') && hit(pn.getBoundingClientRect())) why.push('chips');
  document.querySelectorAll('#locationsList > .location-card.is-stop').forEach(r => { if (hit(r.getBoundingClientRect())) why.push('stop row ' + r.dataset.id); });
  document.querySelectorAll('#locationsList .plan-add').forEach(p => { const r = p.getBoundingClientRect(); if (!r.width) return; const c = { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    if (hit({ left: c.x - 22, right: c.x + 22, top: c.y - 22, bottom: c.y + 22 })) why.push('+ ' + p.closest('.location-card').dataset.id); });
  return { rule: `SLIP (${s.className || 'plain'}) covers no tag, no visible map, no chip, no stop row, no +`, pass: why.length === 0, info: why.length ? why : undefined };
};

(async () => {
  const b = await launch();
  const report = {};
  let fails = 0;
  for (const c of cells.filter(c => !process.env.ONLY || new RegExp(process.env.ONLY).test(c.name))) {
    for (const dsf of (process.env.ONLY ? [1] : [1, 3])) {
      const { ctx, page } = await open(b, { plans: (c.fix || FIX).plans, stops: (c.fix || FIX).stops, visited: ['mir'], dsf });
      await page.evaluate(() => document.getElementById('toggleFiltersBtn').click()); await W(350);
      await page.evaluate(() => document.querySelector('#listSwitch [data-view="plans"]').click()); await W(700);
      if (c.pid !== 'p-nor') { await page.evaluate(() => document.querySelector('#planPick .plan-picker').click()); await W(150); await page.evaluate(id => document.querySelector(`#planLedger [data-plan="${id}"]`).click(), c.pid); await W(700); }
      if (c.state === 'collapsed') { await page.evaluate(() => document.getElementById('toggleFiltersBtn').click()); await W(450); await page.evaluate(() => document.getElementById('collapseBtn').click()); await W(600); }
      let seqInfo = null; const extra = [];
      if (c.seq) {
        const toggle = () => page.evaluate(() => document.getElementById('toggleFiltersBtn').click());
        await toggle(); await W(700);                                   // close: the following view
        if (c.seq === 'reopen-panned') {                                // your own pan (keeps some stops on screen)
          await page.evaluate(() => map.panBy([-40, 60], { animate: false })); await W(400);
          seqInfo = await page.evaluate(() => { const box = planSafeBox(0); return planMarks().rows.filter(r => { const ll = r.loc ? L.latLng(r.loc.lat, r.loc.lng) : L.latLng(shapeCentroid(r.nb)); const p = map.latLngToContainerPoint(ll); return p.x >= box.l && p.x <= box.r && p.y >= box.t && p.y <= box.b; }).map(r => r.n); });
        }
        if (c.seq === 'reopen-added') {                                 // reopen, + the first place below the rule, close
          await toggle(); await W(700);
          await page.evaluate(() => { showPlanRule(); }); await W(300);
          await page.evaluate(() => document.querySelector('#locationsList .plan-add').click()); await W(900);
          const r = await page.evaluate(SLIP); extra.push({ ...r, rule: r.rule + ' -- just after +, panel open' });
          await page.screenshot({ path: path.join(OUT, `${c.name}-slip${dsf === 3 ? '@3x' : ''}.png`) });
          await toggle(); await W(700);
        }
        await toggle(); await W(2500);                                  // reopen, and wait (the UX repro waited 2.5s)
        if (c.seq === 'reopen-added') { const r = await page.evaluate(SLIP); if (r.info !== 'hidden') extra.push({ ...r, rule: r.rule + ' -- after close and reopen' }); }
      }
      else if (c.fit) await page.evaluate(() => frameActivePlan({ animate: false }));
      else await page.evaluate(([z, pick]) => {
        const pts = planMarks().rows.map(r => r.loc ? [r.loc.lat, r.loc.lng] : shapeCentroid(r.nb));
        let ctr = L.latLngBounds(pts).getCenter();
        // the two-city plan: from z11 in, look at its Copenhagen stops (where the places to add are)
        if (z >= 11 && planMarks().rows.some(r => r.loc && r.loc.city === 'malmo')) { const cp = planMarks().rows.filter(r => r.loc && r.loc.city === 'copenhagen').map(r => [r.loc.lat, r.loc.lng]); ctr = L.latLngBounds(cp).getCenter(); }
        if (pick) { const l = locations.find(x => x.id === pick); ctr = L.latLng(l.lat, l.lng); setHighlighted(pick); }
        map.setView(ctr, z, { animate: false });
        const mb = document.getElementById('map').getBoundingClientRect(), p = document.getElementById('filtersPanel'), l = document.getElementById('locations');
        const bottom = p.classList.contains('visible') ? p.getBoundingClientRect().top : l.getBoundingClientRect().top;
        map.panBy([0, (mb.top + mb.height) / 2 - (mb.top + bottom) / 2], { animate: false });   // centre the plan in the map you can SEE
      }, [c.z, c.pick || null]);
      if (!c.seq) await W(700);
      if (c.lift) {   // hold a stop's number (CDP touch) until it lifts, then move a little: the drag in progress
        await page.evaluate(id => document.querySelector(`.location-card[data-id="${id}"]`).scrollIntoView({ block: 'end' }), c.lift); await W(250);
        const q = await page.evaluate(id => { const r = document.querySelector(`.location-card[data-id="${id}"] .row-n`).getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, c.lift);
        const cdp = await ctx.newCDPSession(page);
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: q.x, y: q.y, id: 1 }] }); await W(470);
        for (let i = 1; i <= 4; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: q.x, y: q.y - 8 * i, id: 1 }] }); await W(30); }
        await W(200);
      }
      if (dsf === 1) {
        const r = await page.evaluate(RULES, { fit: !!c.fit, seq: c.seq || null, seen: seqInfo });
        r.res.push(...extra);
        report[c.name] = r;
        const bad = r.res.filter(x => !x.pass);
        fails += bad.length;
        console.log(`${bad.length ? 'FAIL' : 'PASS'} ${c.name} ${JSON.stringify(r.counts)}${bad.length ? ' ' + JSON.stringify(bad) : ''}`);
        await page.screenshot({ path: path.join(OUT, `${c.name}.png`) });
      } else {
        const clip = await page.evaluate(() => { const mb = document.getElementById('map').getBoundingClientRect(), p = document.getElementById('filtersPanel'), l = document.getElementById('locations');
          const bottom = p.classList.contains('visible') ? p.getBoundingClientRect().top : l.getBoundingClientRect().top; return { x: 0, y: mb.top, width: innerWidth, height: bottom - mb.top }; });
        await page.screenshot({ path: path.join(OUT, `${c.name}-map@3x.png`), clip });
      }
      await ctx.close();
    }
  }
  if (process.env.ONLY) { await b.close(); console.log(`\n${fails ? 'FAIL' : 'PASS'} (ONLY) ${fails} failing`); process.exit(fails ? 1 : 0); }
  fs.writeFileSync(path.join(OUT, 'matrix.json'), JSON.stringify(report, null, 1));
  // contact sheet: one row per plan x state, z9..z15 across; picked cells last
  const ctx = await b.newContext({ viewport: { width: 1400, height: 800 } }); const page = await ctx.newPage();
  const img = f => 'data:image/png;base64,' + fs.readFileSync(path.join(OUT, f)).toString('base64');
  const rows = [['nor', 'collapsed'], ['nor', 'panel'], ['mc', 'collapsed'], ['mc', 'panel']];
  const fits = ['nor-fit-panel', 'nor-fit-collapsed', 'mc-fit-panel', 'mc-fit-collapsed', 'h7-fit-panel', 'h7-fit-collapsed'];
  const h7 = ['h7-collapsed-z11', 'h7-collapsed-z12', 'h7-collapsed-z13', 'h7-panel-z11', 'h7-panel-z12', 'h7-panel-z13', 'h7-reorder-z11', 'h7-reorder-z12', 'h7-reorder-z13'];
  const html = `<style>body{margin:0;background:#E7DFD0;font:600 14px Helvetica}td{padding:4px;vertical-align:top}img{width:190px;display:block;border:1px solid #12293F}.k{font-weight:700;color:#12293F;padding:2px 0}</style><table>` +
    rows.map(([pk, st]) => `<tr><td class="k">${pk === 'nor' ? 'Nørrebro (6 stops)' : 'Malmö + Cph'}<br>${st}</td>` + ZOOMS.map(z => `<td><div class="k">z${z} ${report[`${pk}-${st}-z${z}`].res.every(x => x.pass) ? '✓' : '✗'}</div><img src="${img(`${pk}-${st}-z${z}.png`)}"></td>`).join('') + '</tr>').join('') +
    `<tr><td class="k">default fit<br>(each plan)</td>` + fits.map(n => `<td><div class="k">${n.replace('-fit-', ' ')} ${report[n].res.every(x => x.pass) ? '✓' : '✗'}</div><img src="${img(n + '.png')}"></td>`).join('') + '</tr>' +
    `<tr><td class="k">Harbour loop<br>(7 stops)</td>` + h7.map(n => `<td><div class="k">${n.slice(3)} ${report[n].res.every(x => x.pass) ? '✓' : '✗'}</div><img src="${img(n + '.png')}"></td>`).join('') + '</tr>' +
    `<tr><td class="k">tapped place<br>(next to stop 3)</td>` + [12, 13, 14, 15].map(z => `<td><div class="k">z${z} ${report[`nor-picked-z${z}`].res.every(x => x.pass) ? '✓' : '✗'}</div><img src="${img(`nor-picked-z${z}.png`)}"></td>`).join('') + '</tr></table>';
  await page.setContent(html); await W(300);
  await page.setViewportSize({ width: 1400, height: await page.evaluate(() => document.body.scrollHeight) });
  await page.screenshot({ path: path.join(OUT, 'sheet.png'), fullPage: true });
  await b.close();
  console.log(`\n${fails ? 'FAIL' : 'PASS'} ${cells.length} cells, ${Object.values(report).reduce((a, r) => a + r.res.length, 0) - fails}/${Object.values(report).reduce((a, r) => a + r.res.length, 0)} assertions`);
  process.exit(fails ? 1 : 0);
})();
