// Plans v3 frames: the REAL index.html, stubbed backend (stills of the build).
//   REPO=<worktree> VENDOR=<dir> node frames.js
// Writes ../frames/<name>.png (390x844 @1x), <name>@3x.png, crops <name>-<crop>@3x.png,
// <name>-panel.png (the whole filter panel, unscrolled, @1x) and ../frames/frames.json
// (measured facts per frame; check.js asserts the truth list against them).
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const REPO = process.env.REPO || path.resolve(__dirname, '../..');
process.env.PAGE = process.env.PAGE || path.join(REPO, 'index.html');   // the REAL index.html
const OUTROOT = process.env.OUT || '/tmp/plans-v3-out';   // checks write here, never into the repo
const { open, launch, FIX } = require('./harness');
const OUT = path.join(OUTROOT, 'frames');
fs.mkdirSync(OUT, { recursive: true });
const W = ms => new Promise(r => setTimeout(r, ms));
const BASE = { plans: FIX.plans, stops: FIX.stops, visited: ['mir'] };
const ONLY = process.env.ONLY ? new RegExp(process.env.ONLY) : null;

// ---- steps -------------------------------------------------------------------------------
const click = (p, sel) => p.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error('no ' + s); e.click(); }, sel);
const openPanel = async p => { await p.evaluate(() => { if (!document.getElementById('filtersPanel').classList.contains('visible')) document.getElementById('toggleFiltersBtn').click(); }); await W(450); };
const closePanel = async p => { await p.evaluate(() => { if (document.getElementById('filtersPanel').classList.contains('visible')) document.getElementById('toggleFiltersBtn').click(); }); await W(450); };
const toPlans = async (p, planId) => {
  await openPanel(p);
  await click(p, '#listSwitch [data-view="plans"]'); await W(800);
  if (planId) { await click(p, '#planPick .plan-picker'); await W(150); await click(p, `#planLedger [data-plan="${planId}"]`); await W(800); }
};
const chip = async (p, cat) => { await click(p, `#filter-${cat}`); await W(250); };
const onlyChips = async (p, keep) => p.evaluate(keep => { Object.keys(CATEGORY_COLORS).forEach(c => { if ((filters.categories[c] !== false) !== keep.includes(c)) document.getElementById('filter-' + c).click(); }); }, keep);
const city = async (p, id) => { await click(p, `#cityFilters [data-city="${id}"]`); await W(900); };
const scrollList = (p, y) => p.evaluate(y => { document.getElementById('locationsList').scrollTop = y; }, y);
const tapRowAction = (p, sel) => p.evaluate(s => document.querySelector(s).click(), sel);
async function touchHoldDrag(page, sel, dy, { holdMs = 470, steps = 8, release = true } = {}) {
  const cdp = await page.context().newCDPSession(page);
  const b = await page.evaluate(s => { const r = document.querySelector(s).getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, sel);
  const tp = (x, y) => [{ x, y, id: 1, radiusX: 4, radiusY: 4, force: 1 }];
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: tp(b.x, b.y) });
  await W(holdMs);
  const toY = typeof dy === 'object' ? dy.toY : b.y + dy;
  for (let i = 1; i <= steps; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: tp(b.x, b.y + (toY - b.y) * i / steps) }); await W(30); }
  if (typeof dy === 'object' && dy.dwell) await W(dy.dwell);
  if (release) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await W(500); }
  return cdp;
}

// ---- measured facts ------------------------------------------------------------------------
const FACTS = () => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const vis = e => !!e && e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden' && getComputedStyle(e).display !== 'none';
  const panel = $('#filtersPanel');
  const list = $('#locationsList');
  const rows = $$('#locationsList > .location-card, #locationsList > .plan-rule, #locationsList > .plan-list-note');
  const lr = list.getBoundingClientRect();
  const rowInfo = rows.map(e => {
    const r = e.getBoundingClientRect();
    if (e.classList.contains('plan-rule')) return { kind: 'rule', top: Math.round(r.top), h: r.height, text: e.textContent, border: getComputedStyle(e).borderTopWidth + ' ' + getComputedStyle(e).borderTopColor };
    if (e.classList.contains('plan-list-note')) return { kind: 'note', text: e.textContent, top: Math.round(r.top) };
    const num = e.querySelector('.row-n'), act = e.querySelector('.location-actions button'), h3 = e.querySelector('h3');
    const nb = num ? num.getBoundingClientRect() : null, ab = act ? act.getBoundingClientRect() : null;
    const n = num ? num.textContent.trim() : null;
    return {
      kind: e.classList.contains('is-stop') ? 'stop' : 'place', id: e.dataset.id || ('shape:' + e.dataset.shapeId), name: h3 && h3.textContent,
      top: Math.round(r.top), h: Math.round(r.height * 100) / 100, onScreen: r.bottom > lr.top && r.top < Math.min(lr.bottom, innerHeight),
      num: n || null, numLeft: nb ? Math.round(nb.left) : null, numW: nb ? nb.width : null, nameLeft: h3 ? Math.round(h3.getBoundingClientRect().left) : null,
      starred: e.classList.contains('is-starred'), meta: (e.querySelector('.row-meta') || {}).textContent,
      action: act ? (act.classList.contains('plan-add') ? '+' : act.classList.contains('plan-x') ? 'x-remove' : 'x-delete') : null,
      actionLeft: ab ? Math.round(ab.left) : null, actionLabel: act ? act.getAttribute('aria-label') : null,
      bg: getComputedStyle(e).backgroundColor, addBorder: act && act.classList.contains('plan-add') ? getComputedStyle(act).borderTopWidth + ' ' + getComputedStyle(act).borderTopColor : null, addColor: act && act.classList.contains('plan-add') ? getComputedStyle(act).color : null,
      highlighted: e.classList.contains('highlighted'), lifted: e.classList.contains('plan-lifted'), visited: e.classList.contains('is-visited'),
      numFont: num ? getComputedStyle(num).fontSize : null, badgeGlyph: !!e.querySelector('.row-badge use[href^="#g-"]'), badgeLeft: e.querySelector('.row-badge') ? Math.round(e.querySelector('.row-badge').getBoundingClientRect().left) : null,
      nameFont: h3 ? getComputedStyle(h3).fontSize : null, numColor: num ? getComputedStyle(num).color : null, numWeight: num ? getComputedStyle(num).fontWeight : null,
      numCx: num ? (() => { const rg = document.createRange(); rg.selectNodeContents(num); const b = rg.getBoundingClientRect(); return Math.round((b.left + b.width / 2) * 100) / 100; })() : null,
      badgeCx: e.querySelector('.row-badge') ? (() => { const b = e.querySelector('.row-badge svg, .row-badge').getBoundingClientRect(); return Math.round((b.left + b.width / 2) * 100) / 100; })() : null,
      mainLeft: e.querySelector('.row-main') ? Math.round(e.querySelector('.row-main').getBoundingClientRect().left) : null,
      rowBorder: getComputedStyle(e).borderBottomWidth + ' ' + getComputedStyle(e).borderBottomColor
    };
  });
  const markers = $$('.leaflet-marker-icon').map(m => {
    const r = m.getBoundingClientRect(), num = m.querySelector('.stop-tag');
    const cx = r.x + r.width / 2, cy = r.y + r.height / 2, hit = document.elementFromPoint(cx, cy);
    return { num: num ? num.textContent : null, cluster: !!m.querySelector('.plan-cluster') || (!num && !m.querySelector('use[href^="#g-"]') && !!m.querySelector('text')),
      count: m.querySelector('.plan-cluster text') ? m.querySelector('.plan-cluster text').textContent : null, txt: m.textContent.trim(), stopgroup: false, picked: !num && !!m.querySelector('.highlighted-marker'), redCluster: !!m.querySelector('circle[fill="var(--figure-deep)"]'),
      topmost: !!hit && hit.closest('.leaflet-marker-icon') === m, glyph: !!m.querySelector('use[href^="#g-"]'), opacity: (m.querySelector('.plan-muted') ? +m.querySelector('.plan-muted').style.opacity : 1),
      x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2), w: r.width, z: +m.style.zIndex || 0,
      tagShown: !!(num && getComputedStyle(num).display !== 'none'),
      tagTop: !!num && getComputedStyle(num).display !== 'none' && (() => { const t = num.getBoundingClientRect(); const h = document.elementFromPoint(t.x + t.width / 2, t.y + t.height / 2); return !!h && h.closest('.leaflet-marker-icon') === m; })(), muted: !!m.querySelector('.plan-muted'), onMap: m.style.opacity !== '0' && cy > $('#map').getBoundingClientRect().top + 80 && cy < Math.min($('#locations').getBoundingClientRect().top, $('#filtersPanel').classList.contains('visible') ? $('#filtersPanel').getBoundingClientRect().top : 1e9) - 22 && cx > 14 && cx < innerWidth - 14 };
  });
  const cities = $$('#cityFilters .city-btn').map(b => ({ label: b.textContent.trim(), on: b.classList.contains('active') }));
  const cats = $$('#filters .filter-btn').map(b => ({ label: b.textContent.trim(), on: !b.classList.contains('inactive') }));
  return {
    view: document.body.classList.contains('plan-view') ? 'plans' : 'places', w: innerWidth,
    title: $('#locationsHeader h2').textContent.replace(/\u00a0/g, ' '), titleTrunc: (() => { const h = $('#locationsHeader .h-name') || $('#locationsHeader h2'); return h.scrollWidth > h.clientWidth + 1; })(),
    headerH: $('#locationsHeader').getBoundingClientRect().height,
    header: { collapse: vis($('#collapseBtn')), sort: vis($('#sortBtn')), filters: vis($('#toggleFiltersBtn')), locate: vis($('#centerMeBtn')) },
    panelOpen: panel.classList.contains('visible'), panelScrollH: panel.scrollHeight, panelH: panel.clientHeight,
    switchOn: ($('#listSwitch [aria-checked="true"]') || {}).textContent || null, switchVisible: vis($('#listSwitch')),
    listTop: list.getBoundingClientRect().top, liftedTop: $('.plan-lifted') ? $('.plan-lifted').getBoundingClientRect().top : null,
    pickerBg: $('#planPick .plan-picker') ? getComputedStyle($('#planPick .plan-picker')).backgroundColor : null,
    picker: $('#planPick .plan-picker') ? { text: $('#planPick .plan-picker').textContent.trim(), expanded: $('#planPick .plan-picker').getAttribute('aria-expanded') === 'true', disabled: $('#planPick .plan-picker').getAttribute('aria-disabled') === 'true', w: $('#planPick .plan-picker').getBoundingClientRect().width } : null,
    planRow: vis($('#planLedger')) ? $$('#planLedger .plan-opt').map(o => o.textContent.replace(/\s+/g, ' ').trim()) : null,
    emptyButton: vis($('.plan-empty-new')) ? $('.plan-empty-new').textContent : null,
    cities, cats, citiesVisible: vis($('#cityFilters')), catsVisible: vis($('#filters')),
    rows: rowInfo, empty: vis($('#locationsEmpty')) ? $('#locationsEmpty').textContent.trim() : null,
    chevCx: (() => { const c = $('#collapseBtn'); if (!c || !c.getBoundingClientRect().width) return null; const b = c.getBoundingClientRect(); return Math.round((b.left + b.width / 2) * 100) / 100; })(),
    slip: vis($('#planSlip')) ? $('#planSlip').textContent.trim() : null,
    // r11: every line the Plans panel and list draw, as computed (width + colour)
    lines: (() => { const cs = (el, side) => el ? getComputedStyle(el)[`border${side}Width`] + ' ' + getComputedStyle(el)[`border${side}Color`] : null;
      const seg = $('#listSwitch button[aria-checked="false"]'), segOn = $('#listSwitch button[aria-checked="true"]');
      return { picker: cs($('#planPick .plan-picker'), 'Top'), segOff: cs(seg, 'Top'), segOn: cs(segOn, 'Top'), ledger: cs($('#planLedger'), 'Top'), ledgerShadow: $('#planLedger') ? getComputedStyle($('#planLedger')).boxShadow : null,
        slip: cs($('#planSlip'), 'Top'), slipShadow: $('#planSlip') ? getComputedStyle($('#planSlip')).boxShadow : null,
        tag: cs($('#map .stop-tag'), 'Top'), tagInk: $('#map .stop-tag') ? getComputedStyle($('#map .stop-tag')).color : null }; })(),
    // r10: where the slip sits and whether its text fits on one line (no ellipsis)
    slipBox: vis($('#planSlip')) ? (() => { const sl = $('#planSlip'), t = sl.querySelector('.slip-text'), r = sl.getBoundingClientRect();
      const live = ['toggleFiltersBtn', 'centerMeBtn'].map(id => document.getElementById(id)).filter(Boolean).map(e => e.getBoundingClientRect()).filter(q => q.width);
      return { cls: sl.className, fits: t.scrollWidth <= t.clientWidth + 0.5, h: r.height, overFilterOrLocate: live.some(q => r.left < q.right && q.left < r.right && r.top < q.bottom && q.top < r.bottom) }; })() : null,
    // r10: stop pins cut by the map's side edges, and stop tags on the map chrome (attribution, controls)
    mapClear: (() => { if (typeof planChrome !== 'function' || !map) return null; const mb = $('#map').getBoundingClientRect(), ch = planChrome();
      const cut = [], onChrome = [];
      $$('#map .leaflet-marker-icon .plan-stop').forEach(ps => { const r = ps.getBoundingClientRect(); const cy = r.top + r.height / 2;
        if (cy < mb.top || cy > mb.bottom) return;
        if ((r.left < mb.left && r.right > mb.left) || (r.right > mb.right && r.left < mb.right)) cut.push(ps.dataset.n); });
      $$('#map .stop-tag').forEach(t => { if (getComputedStyle(t).display === 'none') return; const r = t.getBoundingClientRect(), x1 = r.left - mb.left, y1 = r.top - mb.top, x2 = r.right - mb.left, y2 = r.bottom - mb.top;
        if (ch.some(o => x1 < o.x2 - 4 && o.x1 + 4 < x2 && y1 < o.y2 - 4 && o.y1 + 4 < y2)) onChrome.push(t.textContent); });
      return { cut, onChrome }; })(),
    sortMenu: vis($('#sortMenu')) ? $$('#sortMenu [role^="menuitem"]').map(i => i.textContent.trim() + (i.getAttribute('aria-checked') === 'true' ? ' ✓' : '')) : null,
    sortMode: typeof sortMode !== 'undefined' ? sortMode : null,
    zoom: map.getZoom(), markers,
    popup: vis($('.leaflet-popup')) ? $('.leaflet-popup-content').textContent.replace(/\s+/g, ' ').trim() : null,
    authOpen: !!$('#authModal') && $('#authModal').classList.contains('show'),
    listScroll: list.scrollTop
  };
};

// ---- scenes ---------------------------------------------------------------------------------
// [name, opts, setup, crops [[cropName, selector|rect, pad]], panelStrip?]
const S = [];
const scene = (name, opts, setup, crops = [], strip = false) => S.push({ name, opts, setup, crops, strip });

scene('01-places-panel', {}, async p => { await openPanel(p); }, [['panel', '#filtersPanel', 0]], true);
scene('02-plans-panel', {}, async p => { await toPlans(p); }, [['panel', '#filtersPanel', 0]], true);
scene('03-plans-list', {}, async p => { await toPlans(p); await closePanel(p); await p.evaluate(() => frameActivePlan({ animate: false })); await W(500); },
  [['rows', [0, 544, 390, 300]], ['header', '#locationsHeader', 0]]);
scene('04-rule-and-others', {}, async p => { await toPlans(p); await closePanel(p); await p.evaluate(() => frameActivePlan({ animate: false })); await scrollList(p, 56 * 3); await W(300); },
  [['rows', [0, 544, 390, 300]]]);
scene('05-filter-cafe', {}, async p => { await toPlans(p); await onlyChips(p, ['cafe']); await W(300); await p.evaluate(() => showPlanRule()); await W(300); },
  [['rows', [0, 543, 390, 301]], ['panel', '#filtersPanel', 0]], true);
scene('06-added', {}, async p => { await toPlans(p); await onlyChips(p, ['cafe']); await p.evaluate(() => showPlanRule()); await W(200); await closePanel(p);
  await tapRowAction(p, '.location-card[data-id="har"] .plan-add'); await W(1100); },   // r10: as it really is after + (the map pans the least to keep stop 7 in view)
  [['rows', [0, 544, 390, 300]], ['slip', '#planSlip', 6]]);
// r10: the one-time drag hint when the rule is scrolled out of the list: the slip docks on the header
scene('06b-hint-on-header', {}, async p => { await toPlans(p); await closePanel(p); await p.evaluate(() => frameActivePlan({ animate: false })); await W(300);
  await p.evaluate(() => { const l = document.getElementById('locationsList'); l.scrollTop = l.scrollHeight; }); await W(300);
  await p.evaluate(() => { const b = [...document.querySelectorAll('#locationsList .plan-add')].pop(); b.click(); }); await W(700); },
  [['header', [0, 530, 390, 80]], ['slip', '#planSlip', 6]]);
scene('07-city-malmo', {}, async p => { await toPlans(p); await city(p, 'malmo'); await W(1800); },
  [['rows', [0, 543, 390, 301]]], true);
scene('08-all-cities', {}, async p => { await toPlans(p); await city(p, "__all__"); await closePanel(p); await p.evaluate(() => showPlanRule()); await W(300); }, []);
scene('09-filter-excludes-stops', {}, async p => { await toPlans(p); await chip(p, 'cafe'); await closePanel(p); await scrollList(p, 0); await W(300); },
  [['rows', [0, 544, 390, 300]]]);
scene('10-empty-filtered', {}, async p => { await toPlans(p); await city(p, 'la'); await closePanel(p); await p.evaluate(() => { frameActivePlan({ animate: false }); showPlanRule(); }); await W(300); },
  [['rows', [0, 544, 390, 300]]]);
scene('11-all-in-plan', {}, async p => { await toPlans(p); await onlyChips(p, ['district']); await closePanel(p); await p.evaluate(() => showPlanRule()); await W(300); },
  [['rows', [0, 544, 390, 300]]]);
scene('12-zero-stops', {}, async p => { await toPlans(p, 'p-empty'); await closePanel(p); await W(300); }, [['rows', [0, 544, 390, 300]]]);
scene('13-removed', {}, async p => { await toPlans(p); await closePanel(p); await p.evaluate(() => frameActivePlan({ animate: false })); await W(300);
  await tapRowAction(p, '.location-card[data-id="cof"] .plan-x'); await W(700); },
  [['rows', [0, 544, 390, 300]], ['slip', '#planSlip', 6]]);
scene('14-reorder-held', { touch: true }, async p => { await toPlans(p); await closePanel(p); await p.evaluate(() => frameActivePlan({ animate: false })); await W(300);
  await touchHoldDrag(p, '.location-card[data-id="jae"] .row-n', 62, { release: false }); await W(250); },
  [['rows', [0, 544, 390, 300]]]);
scene('15-sort-menu', {}, async p => { await toPlans(p); await closePanel(p); await p.evaluate(() => document.getElementById('sortBtn').click()); await W(400); }, []);
scene('16-sort-category', {}, async p => { await toPlans(p); await closePanel(p); await p.evaluate(() => setSortMode('category')); await W(300); await p.evaluate(() => showPlanRule()); await scrollList(p, 56 * 5); await W(300); },
  [['rows', [0, 544, 390, 300]]]);
scene('17-plan-menu', {}, async p => { await toPlans(p); await click(p, '#planPick .plan-picker'); await W(300); }, [['panel', '#filtersPanel', 0]], true);
scene('17b-plan-more-other', {}, async p => { await toPlans(p); await click(p, '#planPick .plan-picker'); await W(200); await click(p, '#planLedger [data-more="p-tiv"]'); await W(300); }, [['panel', '#filtersPanel', 0]]);
scene('17c-rename-other', {}, async p => { await toPlans(p); await click(p, '#planPick .plan-picker'); await W(200); await click(p, '#planLedger [data-more="p-tiv"]'); await W(200); await click(p, '#planLedger [data-act="rename"]'); await W(300); }, [['panel', '#filtersPanel', 0]]);
scene('17d-deleted-other', { acceptDialog: true }, async p => { await toPlans(p); await click(p, '#planPick .plan-picker'); await W(200); await click(p, '#planLedger [data-more="p-tiv"]'); await W(200); await click(p, '#planLedger [data-act="delete"]'); await W(900); }, [['panel', '#filtersPanel', 0]]);
scene('18-no-plans', { plans: [], stops: [] }, async p => { await toPlans(p); }, [], true);
scene('18b-no-plans-closed', { plans: [], stops: [] }, async p => { await toPlans(p); await closePanel(p); }, []);
scene('18c-no-plans-signed-out', { plans: [], stops: [], signedOut: true }, async p => { await toPlans(p); await closePanel(p); await click(p, '.plan-empty-new'); await W(600); }, []);
scene('19-signed-out-add', { signedOut: true }, async p => { await toPlans(p); await closePanel(p); await p.evaluate(() => showPlanRule()); await W(200);
  await tapRowAction(p, '#locationsList .plan-add'); await W(700); }, []);
scene('20-tables-missing', { missing: true }, async p => { await toPlans(p); }, [['panel', '#filtersPanel', 0]], true);
scene('21-map-z16', {}, async p => { await toPlans(p); await closePanel(p); await p.evaluate(() => map.setView([55.6912, 12.5520], 16, { animate: false })); await W(600); }, [['map', [40, 150, 310, 280]]]);
scene('22-map-z13-clusters', {}, async p => { await toPlans(p); await closePanel(p); await p.evaluate(() => map.setView([55.6860, 12.5620], 13, { animate: false })); await W(600); }, [['map', [40, 100, 310, 340]]]);
scene('23-map-z11', {}, async p => { await toPlans(p); await closePanel(p); await p.evaluate(() => map.setView([55.6800, 12.5700], 11, { animate: false })); await W(600); }, [['map', [95, 200, 200, 150]]]);
scene('24-stop-tapped', {}, async p => { await toPlans(p); await closePanel(p); await p.evaluate(() => document.querySelector('.location-card[data-id="jae"]').click()); await W(1800); },
  [['rows', [0, 544, 390, 300]], ['popup', '.leaflet-popup-content-wrapper', 6]]);
scene('25-other-place-tap', {}, async p => { await toPlans(p); await closePanel(p); await p.evaluate(() => showPlanRule()); await W(200); await p.evaluate(() => document.querySelector('.location-card:not(.is-stop)[data-id]').click()); await W(1800); },
  [['popup', '.leaflet-popup-content-wrapper', 6]]);
scene('26-collapsed', {}, async p => { await toPlans(p); await closePanel(p); await click(p, '#collapseBtn'); await W(600); }, []);
scene('27-long-name', {}, async p => { await toPlans(p, 'p-long'); await closePanel(p); }, [['header', '#locationsHeader', 0]]);
scene('28-rail', { w: 1280, h: 800, touch: false }, async p => { await toPlans(p); await onlyChips(p, ['cafe', 'restaurant']); await p.evaluate(() => showPlanRule()); await W(300); }, []);
scene('29-back-to-places', {}, async p => { await toPlans(p); await onlyChips(p, ['cafe']); await click(p, '#listSwitch [data-view="places"]'); await W(900); }, [], true);
scene('30-spanning', {}, async p => { await toPlans(p, 'p-mc'); await closePanel(p); await W(300); }, [['rows', [0, 544, 390, 300]]]);
// r12: the city chip picks the leg you follow -- Malmö on, the two-city plan frames its Malmö stop
scene('30b-spanning-malmo', {}, async p => { await toPlans(p, 'p-mc'); await city(p, 'malmo'); await closePanel(p); await W(600); }, [['rows', [0, 544, 390, 300]]]);
scene('31-all-visited-shape-last', { visited: ['mir', 'ref', 'kfb', 'mot'] }, async p => { await toPlans(p, 'p-long'); await closePanel(p); await W(300); }, [['rows', [0, 544, 390, 300]]]);
const P7 = { id: 'p-7', name: 'Harbour loop', created_at: '2026-09-26T10:00:00Z' };
const SEVEN = { plans: FIX.plans.concat([P7]), stops: FIX.stops.concat(['nyh', 'har', 'ama', 'jmm', 'chr', 'tiv', 'isr'].map((l, i) => ({ id: 'h' + i, plan_id: 'p-7', location_id: l, shape_id: null, position: i + 1 }))) };
scene('32-reorder-long-drag', SEVEN, async p => { await toPlans(p, 'p-7'); await p.evaluate(() => document.querySelector('.location-card[data-id="isr"]').scrollIntoView({ block: 'end' })); await W(300);
  const top = await p.evaluate(() => document.getElementById('locationsList').getBoundingClientRect().top);
  await touchHoldDrag(p, '.location-card[data-id="isr"] .row-n', { toY: top + 6, dwell: 1400 }, { release: false }); await W(300); }, [['rows', [0, 540, 390, 304]]]);
scene('33-reorder-long-dropped', SEVEN, async p => { await toPlans(p, 'p-7'); await p.evaluate(() => document.querySelector('.location-card[data-id="isr"]').scrollIntoView({ block: 'end' })); await W(300);
  const top = await p.evaluate(() => document.getElementById('locationsList').getBoundingClientRect().top);
  await touchHoldDrag(p, '.location-card[data-id="isr"] .row-n', { toY: top + 6, dwell: 1400 }); await W(600); }, [['rows', [0, 540, 390, 304]]]);
scene('34-collapsed-following-map', {}, async p => { await toPlans(p); await closePanel(p); await click(p, '#collapseBtn'); await W(700); await p.evaluate(() => frameActivePlan({ animate: false })); await W(500); }, [['map', [40, 200, 310, 330]]]);
scene('35-places-delete-in-plan', {}, async p => { await openPanel(p); await closePanel(p); await tapRowAction(p, '.location-card[data-id="mir"] .delete-btn'); await W(400); }, []);
scene('36-add-form-in-plans', {}, async p => { await toPlans(p); await closePanel(p); await click(p, '#floatingAddBtn'); await W(700); }, []);
scene('37-new-place-below-rule', {}, async p => { await toPlans(p); await closePanel(p);
  await p.evaluate(() => { __db.locations.push({ id: 'grd', name: 'Grød', address: 'Jægersborggade 50, Nørrebro, Copenhagen', category: 'cafe', lat: 55.6935, lng: 12.5431, notes: null, visited: false, starred: false, city: 'copenhagen' }); });
  await p.evaluate(() => refetchLocations()); await W(900);
  await p.evaluate(() => { const e = document.querySelector('.location-card[data-id="grd"]'); e.scrollIntoView({ block: 'center' }); highlightMarker('grd'); }); await W(1800); }, [['rows', [0, 544, 390, 300]]]);
scene('39-place-deleted-renumbered', { acceptDialog: true }, async p => { await openPanel(p); await closePanel(p);
  await p.evaluate(() => document.querySelector('.location-card[data-id="mir"]').scrollIntoView({ block: 'center' })); await W(200);
  await tapRowAction(p, '.location-card[data-id="mir"] .delete-btn'); await W(1200); await toPlans(p); await closePanel(p); await p.evaluate(() => frameActivePlan({ animate: false })); await W(600); }, [['rows', [0, 544, 390, 300]]]);
// r11: the number options are settled by the owner ("Numbers should be grey ... no multiple states").
// Places beside Plans, same rows band, for the left-channel comparison (owner-11).
// r14: two-digit numbers on the axis -- a 12-stop plan
scene('41-twelve-stops', { plans: FIX.plans.concat([{ id: 'p-12', name: 'Twelve stops', created_at: '2026-09-27T10:00:00Z' }]),
  stops: FIX.stops.concat(['nyh', 'har', 'ama', 'jmm', 'chr', 'tiv', 'isr', 'mir', 'jae', 'cof', 'ass', 'ref'].map((l, i) => ({ id: 't' + i, plan_id: 'p-12', location_id: l, shape_id: null, position: i + 1 }))) },
  async p => { await toPlans(p, 'p-12'); await closePanel(p); await p.evaluate(() => { const l = document.getElementById('locationsList'); l.scrollTop = 7 * 56; }); await W(400); }, [['rows', [0, 544, 390, 300]]]);
scene('40-places-rows', {}, async p => { await openPanel(p); await closePanel(p); await p.evaluate(() => { document.getElementById('locationsList').scrollTop = 0; }); await W(400); }, [['rows', [0, 544, 390, 300]]]);

(async () => {
  const b = await launch();
  const facts = {};
  for (const sc of S) {
    if (ONLY && !ONLY.test(sc.name)) continue;
    const init = null;   // (plans/stops in opts override the fixture)
    for (const dsf of [1, 3]) {
      const o = { ...BASE, ...sc.opts, dsf, init };
      const { ctx, page, errors } = await open(b, o);
      const dialogs = [];
      page.on('dialog', d => { dialogs.push(d.message()); (sc.opts.acceptDialog ? d.accept() : d.dismiss()).catch(() => {}); });
      await sc.setup(page);
      await page.screenshot({ path: path.join(OUT, `${sc.name}${dsf === 1 ? '' : '@3x'}.png`) });
      if (dsf === 1) {
        facts[sc.name] = { ...(await page.evaluate(FACTS)), errors, dialogs };
        if (sc.strip) {   // the whole panel, every control, unscrolled
          const h = await page.evaluate(() => { const pn = document.getElementById('filtersPanel'); pn.style.maxHeight = 'none'; return pn.getBoundingClientRect(); });
          await W(100);
          const r = await page.evaluate(() => { const x = document.getElementById('filtersPanel').getBoundingClientRect(); return { x: 0, y: Math.max(0, x.top), width: innerWidth, height: Math.min(innerHeight - Math.max(0, x.top), x.height) }; });
          await page.screenshot({ path: path.join(OUT, `${sc.name}-panel.png`), clip: r });
          facts[sc.name].panelFullH = r.height;
        }
      } else {
        for (const [cn, sel, pad] of sc.crops) {
          const clip = Array.isArray(sel) ? { x: sel[0], y: sel[1], width: sel[2], height: sel[3] }
            : await page.evaluate(([s, pad]) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { x: Math.max(0, r.x - pad), y: Math.max(0, r.y - pad), width: Math.min(innerWidth - Math.max(0, r.x - pad), r.width + 2 * pad), height: Math.min(innerHeight - Math.max(0, r.y - pad), r.height + 2 * pad) }; }, [sel, pad]);
          if (clip && clip.width > 0 && clip.height > 0) await page.screenshot({ path: path.join(OUT, `${sc.name}-${cn}@3x.png`), clip });
        }
      }
      await ctx.close();
    }
    process.stdout.write(sc.name + ' ');
  }
  const fj = path.join(OUT, 'frames.json');
  const prev = ONLY && fs.existsSync(fj) ? JSON.parse(fs.readFileSync(fj, 'utf8')) : {};
  fs.writeFileSync(fj, JSON.stringify({ ...prev, ...facts }, null, 1));
  console.log('\nframes:', Object.keys(facts).length);
  await b.close();
})();
