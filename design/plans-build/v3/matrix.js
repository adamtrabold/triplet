// The Plans map rules R1-R5 (README "Map rules"), asserted over a zoom matrix on the real page
// Copenhagen day (2 cities)} x {panel open, sheet collapsed}, plus the tapped-place cells.
// Every cell is rendered (1x full screen + 3x map crop) and every rule is checked on marker
// data read from the live map; the run fails on any violation.
//   REPO=<worktree> VENDOR=<dir> node matrix.js   -> ../matrix/*.png, ../matrix/matrix.json, ../matrix/sheet.png
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const REPO = process.env.REPO || path.resolve(__dirname, '../../..');
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
  const tags = marks.filter(mk => mk.k === 'stop').map(mk => mk.el.querySelector('.stop-tag')).filter(t => t && getComputedStyle(t).display !== 'none');
  // R1
  const bad = marks.filter(mk => mk.k === 'pin' && /\d/.test(mk.el.textContent));
  ok('R1 digits only on stop tags and Places clusters', bad.length === 0, bad.map(mk => mk.el.textContent));
  ok('R1 stop numbers sit on square grey-ruled paper tags (r11: one neutral style); clusters are red discs (different families)', tags.every(t => getComputedStyle(t).borderTopColor === 'rgb(90, 86, 76)' && getComputedStyle(t).color === 'rgb(90, 86, 76)' && parseFloat(getComputedStyle(t).borderRadius) <= 3));
  // R2
  const r2 = [];
  const mv = mapVisibleLocations();
  const clustered = new Set(mv.clusters.flatMap(c => c.memberIds || []));
  pm.rows.forEach(r => {
    const c = r.loc ? [r.loc.lat, r.loc.lng] : shapeCentroid(r.nb); if (!c) return;
    const t = toPage(c); if (!inView(t)) return;
    const e = r.loc ? markersById.get(r.loc.id) : planShapeMarkers.get(r.nb.id);
    const el = e && e.marker.getElement();
    if (!el) { r2.push(r.n + ' missing'); return; }
    if (dist(cen(el), t) > 1.5) r2.push(r.n + ' moved ' + dist(cen(el), t).toFixed(1));
    if (r.loc && clustered.has(r.loc.id)) r2.push(r.n + ' in a cluster');
  });
  ok('R2 every stop drawn once at its true location, never inside a cluster', r2.length === 0, r2);
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
  const coveredClusters = clusterMarks.filter(cl => { const t = cl.el.querySelector('text'); const tr = t.getBoundingClientRect();
    return [cl.c, { x: tr.x + tr.width / 2, y: tr.y + tr.height / 2 }].some(pt => { const h = hitBy(pt); return h && h !== cl.el && h.querySelector('.plan-stop'); }); });
  ok(`R4 no Places cluster’s centre or count is under a stop (${clusterMarks.length} clusters)`, coveredClusters.length === 0, coveredClusters.map(c => c.el.textContent));
  const stops = marks.filter(mk => mk.k === 'stop');
  const parse = label => label.split(',').flatMap(tk => { const [x, y] = tk.split('–').map(Number); return y ? Array.from({ length: y - x + 1 }, (_, i) => x + i) : [x]; });
  const shown = new Map();
  const blockers = [];
  tags.forEach(t => { const r = t.getBoundingClientRect(), c = { x: r.x + r.width / 2, y: r.y + r.height / 2 }; const h = document.elementFromPoint(c.x, c.y);
    if (h && h.closest('.leaflet-marker-icon') === t.closest('.leaflet-marker-icon')) parse(t.textContent).forEach(n => shown.set(n, true)); else blockers.push(t.textContent + ':' + (h ? (h.closest('.leaflet-marker-icon') ? kind(h.closest('.leaflet-marker-icon')) : h.className || h.tagName) : 'none')); });
  const unseen = pm.rows.filter(r => { const c = r.loc ? [r.loc.lat, r.loc.lng] : shapeCentroid(r.nb); return c && inView(toPage(c)); }).filter(r => !shown.get(r.n)).map(r => r.n);
  ok('R4 every stop in view has its number on a visible, uncovered tag', unseen.length === 0, { unseen, blockers });

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
  {
    const elOfN = n => { const r = pm.rows.find(x => x.n === n); const e = r && (r.loc ? markersById.get(r.loc.id) : planShapeMarkers.get(r.nb.id)); return e && e.marker.getElement(); };
    const mb0 = document.getElementById('map').getBoundingClientRect();
    const vtags = tags.filter(t => { const own = elOfN(parse(t.textContent)[0]); return own && inView(cen(own)); });
    const j = judgeTags(vtags, t => parse(t.textContent).map(elOfN).filter(Boolean), all.filter(e => { const c = cen(e); return c.x >= 0 && c.x <= innerWidth && c.y >= mapBox.top && c.y <= cover; }), mb0, planChrome());   // every marker you can see is a neighbour
    ok(`R4 every tag is on a clean spot (on screen, clear of the chrome, nearer its own pin than any other marker) whenever one exists${j.forced.length ? ' -- forced (no clean spot): ' + j.forced.join(',') : ''}`, j.bad.length === 0, j.bad);
  }
  const under = [];
  stops.forEach(s => marks.filter(o => o.k === 'pin').forEach(o => { if (dist(s.c, o.c) < 18 && z(o.el) >= z(s.el) && !o.el.querySelector('.highlighted-marker')) under.push(s.el.textContent); }));
  ok('R4 stops draw above every place pin', under.length === 0, under);
  if (c_fit) {
    const tb = tags.map(t => t.getBoundingClientRect());
    ok('FIT no two stop tags overlap', !tb.some((a, i) => tb.some((b, j) => i < j && a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom)));
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
