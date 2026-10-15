// Renders every v2 frame at 1x from the real index.html + proto.js, a full-length strip of the filters
// panel for every frame where it is open, and frames.json with measured facts for check.js.
// usage: REPO=<worktree> node frames.js [frameId ...]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const { open } = require('./shot.js');
const OUT = process.env.OUT || __dirname + '/out';
fs.mkdirSync(OUT, { recursive: true });

// ---- seed data (would be the plans / plan_stops tables) ----
const seed = (page, { plans = 'all', visited = true, view = 'plans', active = 'nor', adding = false, stops = null, layout = 'X' } = {}) => page.evaluate(o => {
  const L_ = id => ({ k: 'loc', id }), S_ = id => ({ k: 'shape', id });
  const all = {
    nor: { id: 'nor', name: 'Nørrebro afternoon', stops: [L_('mir'), L_('jae'), L_('cof'), L_('ass'), S_(9001), L_('bla')] },
    mix: { id: 'mix', name: 'Malmö + Copenhagen day', stops: [L_('tor'), L_('isr'), L_('lil')] },
    tiv: { id: 'tiv', name: 'Tivoli tonight', stops: [L_('tiv')] },
    long: { id: 'long', name: 'Last full day before we fly home from Kastrup', stops: [L_('nyh'), L_('har'), L_('ama'), L_('dmd')] },
  };
  const P = window.__plans;
  P.plans = o.plans === 'none' ? [] : (o.plans === 'all' ? ['nor', 'mix', 'tiv', 'long'] : o.plans).map(k => all[k]);
  if (o.stops) P.plans.find(p => p.id === 'nor').stops = o.stops.map(s => typeof s === 'number' ? S_(s) : L_(s));
  if (o.visited) { const m = locations.find(l => l.id === 'mir'); m.visited = true; }
  P.view = o.view; P.adding = o.adding;
  if (o.view === 'plans' && P.plans.length && o.active) P.choosePlan(o.active); else { P.activeId = P.plans[0] ? P.plans[0].id : null; updateUI(); }
  P.editLayout = o.layout;
  if (o.adding) P.enterEdit();
}, { plans, visited, view, active, adding, stops, layout });
const fitNorrebro = page => page.evaluate(() => map.fitBounds(L.latLngBounds([[55.6936, 12.5424], [55.6865, 12.5617]]), { paddingTopLeft: [40, 90], paddingBottomRight: [40, 40], animate: false }));
const openPanel = async page => { await page.click('#toggleFiltersBtn'); await page.waitForTimeout(450); };
const scrollListTo = (page, sel, rowsAbove = 1) => page.evaluate(([s, n]) => { const l = document.getElementById('locationsList'); const el = l.querySelector(s); l.scrollTop = el.offsetTop - l.firstElementChild.offsetTop - 56 * n; }, [sel, rowsAbove]);
const scrollPanelTo = (page, sel) => page.evaluate(s => { const p = document.getElementById('filtersPanel'); const el = p.querySelector(s); p.scrollTop = el.offsetTop - 8; }, sel);
const wait = (page, ms = 500) => page.waitForTimeout(ms);
// A finger held down on an element (no release) for the pressed-state still.
async function holdTouch(page, sel) {
  const cdp = await page.context().newCDPSession(page);
  const r = await page.evaluate(s => { const b = document.querySelector(s).getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }, sel);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: r.x, y: r.y }] });
  await page.waitForTimeout(200);
}
// A real touch drag on a grip (CDP touch events). release=false leaves the finger down for the still.
async function dragGrip(page, sel, dy, release) {
  const cdp = await page.context().newCDPSession(page);
  const r = await page.evaluate(s => { const b = document.querySelector(s).getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }, sel);
  const t = (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
  await t('touchStart', r.x, r.y);
  await page.waitForTimeout(350);   // hold to arm
  for (let k = 1; k <= 14; k++) { await t('touchMove', r.x, r.y + dy * k / 14); await page.waitForTimeout(16); }
  await page.waitForTimeout(250);
  if (release) { await t('touchEnd'); await page.waitForTimeout(400); }
}

const FRAMES = [
  // ---- lifecycle ----
  { id: '01-places', run: async p => { await seed(p, { view: 'places' }); await fitNorrebro(p); } },
  { id: '02-panel-places', run: async p => { await seed(p, { view: 'places' }); await fitNorrebro(p); await openPanel(p); } },
  { id: '03-panel-no-plans', run: async p => { await seed(p, { plans: 'none', view: 'places' }); await openPanel(p); await p.click('.seg button[data-v="plans"]'); } },
  { id: '04-create-name', run: async p => { await seed(p, { plans: 'none', view: 'places' }); await openPanel(p); await p.click('.seg button[data-v="plans"]'); await p.click('.pick[data-new]'); await p.keyboard.type('Nørrebro afternoon'); await p.evaluate(() => document.activeElement.blur()); } },
  { id: '05-add-empty', run: async p => { await seed(p, { plans: 'none', view: 'places' }); await fitNorrebro(p); await openPanel(p); await p.click('.seg button[data-v="plans"]'); await p.click('.pick[data-new]'); await p.keyboard.type('Nørrebro afternoon'); await p.click('.act.primary'); } },
  { id: '06-add-three', run: async p => { await seed(p, { plans: ['nor'], stops: ['mir', 'jae', 'cof'], adding: true, visited: false }); await fitNorrebro(p); } },
  { id: '07-add-shape', run: async p => { await seed(p, { plans: ['nor'], stops: ['mir', 'jae', 'cof', 'ass'], adding: true, visited: false }); await fitNorrebro(p); await scrollListTo(p, '[data-shape-id="9001"]', 2); await p.click('[data-shape-id="9001"] .rowslot'); await wait(p, 200); await scrollListTo(p, '[data-shape-id="9001"]', 2); } },
  { id: '08-remove-undo', run: async p => { await seed(p, { plans: ['nor'], adding: true, visited: false }); await fitNorrebro(p); await scrollListTo(p, '[data-id="cof"]', 1); await p.click('[data-id="cof"] .rowslot'); await wait(p, 200); await scrollListTo(p, '[data-id="cof"]', 1); await p.evaluate(() => { const u = document.getElementById('planUndo'); const b = document.getElementById('locationsHeader').getBoundingClientRect(); u.style.top = (b.top - u.offsetHeight - 2) + 'px'; }); } },
  { id: '09-follow', run: async p => { await seed(p, {}); } },
  { id: '10-follow-end', run: async p => { await seed(p, {}); await p.evaluate(() => { const l = document.getElementById('locationsList'); l.scrollTop = l.scrollHeight; }); } },
  { id: '11-reorder', run: async p => { await seed(p, { adding: true, layout: 'Y' }); await fitNorrebro(p); await p.evaluate(() => window.__plans.setEditSort('plan')); await dragGrip(p, '[data-id="ass"] .grip', -112, false); } },
  { id: '11b-reorder-drop', run: async p => { await seed(p, { adding: true, layout: 'Y' }); await fitNorrebro(p); await p.evaluate(() => window.__plans.setEditSort('plan')); await dragGrip(p, '[data-id="ass"] .grip', -112, true); } },
  { id: '12-popup', run: async p => { await seed(p, {}); await p.click('[data-id="jae"] h3'); await wait(p, 2200); } },
  { id: '13-sort-menu', run: async p => { await seed(p, { adding: true, layout: 'Y' }); await fitNorrebro(p); await p.click('#sortBtn'); } },
  { id: '14-edit-plan-order', run: async p => { await seed(p, { adding: true, layout: 'Y' }); await fitNorrebro(p); await p.evaluate(() => window.__plans.setEditSort('plan')); await wait(p, 200); } },
  { id: '15a-places-panel-cafe-off', run: async p => { await seed(p, { view: 'places' }); await openPanel(p); await p.click('#filter-cafe'); await wait(p, 200); await scrollPanelTo(p, '#filters'); } },
  { id: '15-plans-panel-no-chips', run: async p => { await seed(p, { view: 'places' }); await openPanel(p); await p.click('#filter-cafe'); await p.click('.seg button[data-v="plans"]'); await wait(p, 300); } },
  { id: '16-plan-menu', run: async p => { await seed(p, {}); await openPanel(p); await p.click('.plan-opt .more'); } },
  { id: '17-rename', run: async p => { await seed(p, {}); await openPanel(p); await p.click('.plan-opt .more'); await p.click('#planLedger [data-a="rename"]'); await wait(p, 200); } },
  { id: '18-delete-confirm', run: async p => { await seed(p, {}); await openPanel(p); await p.evaluate(() => window.__plans.nativeConfirm('Delete “Nørrebro afternoon”? Its places stay in your list.')); } },
  { id: '19-switch-spanning', run: async p => { await seed(p, {}); await openPanel(p); await p.click('.pick[data-id="mix"]'); await wait(p, 300); } },
  { id: '20-long-name', run: async p => { await seed(p, {}); await openPanel(p); await p.click('.pick[data-id="long"]'); await wait(p, 300); } },
  { id: '21-one-stop', run: async p => { await seed(p, { active: 'tiv' }); } },
  { id: '22-collapsed', run: async p => { await seed(p, {}); await p.click('#collapseBtn'); await wait(p, 500); } },
  { id: '23-signed-out', signedOut: true, run: async p => { await seed(p, {}); await p.evaluate(() => { const l = document.getElementById('locationsList'); l.scrollTop = l.scrollHeight; }); await p.click('.add-row'); await wait(p, 400); } },
  // ---- map treatments ----
  { id: '24-clusters', run: async p => { await seed(p, {}); await p.evaluate(() => map.setView([55.6905, 12.5530], 12, { animate: false })); await wait(p, 400); } },
  { id: '25-approx-highlight', run: async p => { await seed(p, {}); await p.evaluate(() => { const l = document.getElementById('locationsList'); l.scrollTop = l.scrollHeight; }); await p.click('[data-id="bla"] h3'); await wait(p, 2200); } },
  { id: '26-rail', w: 1280, h: 800, run: async p => { await seed(p, {}); await openPanel(p); } },
  { id: '27-exit-places', run: async p => { await seed(p, {}); await openPanel(p); await p.click('.pick[data-id="mix"]'); await wait(p, 300); await p.click('.seg button[data-v="places"]'); await wait(p, 300); } },
  { id: '28-zero-stops', run: async p => { await seed(p, { plans: ['tiv'], view: 'places' }); await fitNorrebro(p); await openPanel(p); await p.click('.seg button[data-v="plans"]'); await p.click('.pick[data-new]'); await p.keyboard.type('Nørrebro afternoon'); await p.click('.act.primary'); await wait(p, 300); await p.click('#doneBtn'); await wait(p, 300); } },
  { id: '29-add-collapsed', run: async p => { await seed(p, { plans: ['nor'], stops: ['mir', 'jae', 'cof'], adding: true, visited: false }); await fitNorrebro(p); await p.click('#collapseBtn'); await wait(p, 500); } },
  { id: '30-add-rail', w: 1280, h: 800, run: async p => { await seed(p, { plans: ['nor'], stops: ['mir', 'jae', 'cof'], adding: true, visited: false }); await p.evaluate(() => map.fitBounds(L.latLngBounds([[55.6936, 12.5424], [55.6865, 12.5617]]), { padding: [60, 60], animate: false })); } },
  { id: '31-shape-popup', run: async p => { await seed(p, {}); await p.evaluate(() => { const l = document.getElementById('locationsList'); l.scrollTop = l.scrollHeight; }); await p.click('[data-shape-id="9001"] h3'); await wait(p, 2200); } },
  { id: '33-tile-pressed', run: async p => { await seed(p, { adding: true }); await fitNorrebro(p); await scrollListTo(p, '[data-id="cof"]', 1); await holdTouch(p, '[data-id="cof"] .rowslot'); } },
  { id: '34-undo-two', run: async p => { await seed(p, { adding: true }); await fitNorrebro(p); await scrollListTo(p, '[data-id="jae"]', 1); await p.click('[data-id="jae"] .rowslot'); await wait(p, 200); await scrollListTo(p, '[data-id="cof"]', 1); await p.click('[data-id="cof"] .rowslot'); await wait(p, 300); } },
  { id: '35-undo-collapsed', run: async p => { await seed(p, { adding: true }); await fitNorrebro(p); await p.click('[data-id="cof"] .rowslot'); await wait(p, 200); await p.click('#collapseBtn'); await wait(p, 600); } },
  { id: '37-long-names', run: async p => { await seed(p, { plans: ['nor'], stops: ['kin', 'cha', 'dmd', 'mir'] }); } },
  { id: '36-undo-after-done', run: async p => { await seed(p, { adding: true }); await fitNorrebro(p); await scrollListTo(p, '[data-id="cof"]', 1); await p.click('[data-id="cof"] .rowslot'); await wait(p, 200); await p.click('#doneBtn'); await wait(p, 300); } },
  { id: 'X1-edit-opens', run: async p => { await seed(p, {}); await p.evaluate(() => { window.__plans.editLayout = 'X'; window.__plans.enterEdit(); }); await wait(p, 200); await fitNorrebro(p); } },
  { id: 'X2-edit-rule', run: async p => { await seed(p, {}); await p.evaluate(() => { window.__plans.editLayout = 'X'; window.__plans.enterEdit(); }); await wait(p, 200); await fitNorrebro(p); await scrollListTo(p, '.edit-rule', 3); } },
  { id: 'X3-remove', run: async p => { await seed(p, {}); await p.evaluate(() => { window.__plans.editLayout = 'X'; window.__plans.enterEdit(); }); await wait(p, 200); await fitNorrebro(p); await p.click('[data-id="cof"] .rowslot:not(.grip)'); await wait(p, 300); } },
  { id: 'X4-reorder', run: async p => { await seed(p, {}); await p.evaluate(() => { window.__plans.editLayout = 'X'; window.__plans.enterEdit(); }); await wait(p, 200); await fitNorrebro(p); await dragGrip(p, '[data-id="ass"] .grip', -112, false); } },
  { id: 'Xa-add', run: async p => { await seed(p, {}); await p.evaluate(() => { window.__plans.editLayout = 'X'; window.__plans.enterEdit(); }); await wait(p, 200); await fitNorrebro(p); await p.click('[data-id="tor"] .rowslot'); await wait(p, 200); await scrollListTo(p, '[data-id="tor"]', 2); } },
  { id: 'Xd-done-follow', run: async p => { await seed(p, {}); await p.evaluate(() => { window.__plans.editLayout = 'X'; window.__plans.enterEdit(); }); await wait(p, 200); await fitNorrebro(p); await p.click('[data-id="tor"] .rowslot'); await wait(p, 200); await p.click('#doneBtn'); await wait(p, 300); } },
  { id: 'Ya-add', run: async p => { await seed(p, {}); await p.evaluate(() => { window.__plans.editLayout = 'Y'; window.__plans.enterEdit(); }); await wait(p, 200); await fitNorrebro(p); await p.click('[data-id="tor"] .rowslot'); await wait(p, 200); await scrollListTo(p, '[data-id="tor"]', 2); } },
  { id: 'Yb-remove', run: async p => { await seed(p, {}); await p.evaluate(() => { window.__plans.editLayout = 'Y'; window.__plans.enterEdit(); }); await wait(p, 200); await fitNorrebro(p); await scrollListTo(p, '[data-id="cof"]', 1); await p.click('[data-id="cof"] .rowslot'); await wait(p, 300); await scrollListTo(p, '[data-id="tiv"]', 1); } },
  { id: 'Yc-sort-menu', run: async p => { await seed(p, {}); await p.evaluate(() => { window.__plans.editLayout = 'Y'; window.__plans.enterEdit(); }); await wait(p, 200); await fitNorrebro(p); await p.click('#sortBtn'); await wait(p, 300); } },
  { id: 'Yd-reorder', run: async p => { await seed(p, {}); await p.evaluate(() => { window.__plans.editLayout = 'Y'; window.__plans.enterEdit(); }); await wait(p, 200); await fitNorrebro(p); await p.evaluate(() => window.__plans.setEditSort('plan')); await wait(p, 200); await dragGrip(p, '[data-id="ass"] .grip', -112, false); } },
  { id: 'Ye-done-follow', run: async p => { await seed(p, {}); await p.evaluate(() => { window.__plans.editLayout = 'Y'; window.__plans.enterEdit(); }); await wait(p, 200); await fitNorrebro(p); await p.click('[data-id="tor"] .rowslot'); await wait(p, 200); await p.click('#doneBtn'); await wait(p, 300); } },
  { id: 'E1-edit-panel', run: async p => { await seed(p, {}); await p.evaluate(() => { window.__plans.editLayout = 'Y'; window.__plans.enterEdit(); }); await wait(p, 200); await fitNorrebro(p); await openPanel(p); } },
  { id: '32-edit-opens-places-order', run: async p => { await seed(p, { layout: 'Y' }); await p.click('.add-row'); await wait(p, 300); await fitNorrebro(p); } },
];

// Facts check.js asserts. Measured on the rendered page.
const measure = page => page.evaluate(() => {
  const r = e => { const b = e.getBoundingClientRect(); return { x: Math.round(b.left), y: Math.round(b.top), w: Math.round(b.width), h: Math.round(b.height) }; };
  const header = document.getElementById('locationsHeader'), h2 = header.querySelector('h2');
  const vis = e => { const s = getComputedStyle(e); return s.display !== 'none' && s.visibility !== 'hidden' && e.getClientRects().length > 0; };
  const cards = [...document.querySelectorAll('#locationsList .location-card')].filter(c => getComputedStyle(c).display !== 'none');   // listed rows (a collapsed sheet still lists them)
  const panel = document.getElementById('filtersPanel');
  const panelOpen = panel.classList.contains('visible');
  const P = window.__plans;
  const m = h2.textContent.match(/\((\d+)\)\s*$/);
  const hbtns = ['collapseBtn', 'doneBtn', 'sortBtn', 'toggleFiltersBtn', 'centerMeBtn'].map(id => { const e = document.getElementById(id); return { id, shown: !!e && vis(e) }; });
  return {
    view: P.view, adding: P.adding, plan: P.plans.find(p => p.id === P.activeId)?.name || null,
    header: r(header), title: h2.textContent, titleTruncated: h2.scrollWidth > h2.clientWidth + 1, titleCount: m ? +m[1] : null,
    rows: cards.length, rowHeights: [...new Set(cards.map(c => Math.round(c.getBoundingClientRect().height * 100) / 100))],
    headerButtons: hbtns,
    planStops: (P.plans.find(p => p.id === P.activeId) || { stops: [] }).stops.length, planView: document.body.classList.contains('plan-view'),
    tileButtonsInPlanView: document.body.classList.contains('plan-view') ? document.querySelectorAll('#locationsList button.rowslot:not(.grip)').length : 0,
    chipsOpacity: [getComputedStyle(document.getElementById('cityFilters')).opacity, getComputedStyle(document.getElementById('filters')).opacity].map(Number),
    stampsInPlanView: document.body.classList.contains('plan-view') ? [...document.querySelectorAll('#locationsList .row-stamp')].filter(vis).length : 0,
    visitedStopsShown: document.body.classList.contains('plan-view') ? [...document.querySelectorAll('#locationsList .location-card.is-visited')].filter(c => getComputedStyle(c).display !== 'none').length : 0,
    hollowTiles: document.querySelectorAll('#locationsList .tile.done').length,
    filledTilesInPlanView: document.body.classList.contains('plan-view') ? [...document.querySelectorAll('#locationsList .tile.on')].filter(vis).length : 0,
    nextExpected: window.__plans.nextIndex(),
    gripsInPlanView: document.body.classList.contains('plan-view') ? [...document.querySelectorAll('#locationsList .grip')].filter(vis).length : 0,
    popupRemove: document.querySelectorAll('.popup-remove').length,
    editLayout: window.__plans.editLayout, ruleCount: document.querySelectorAll('#locationsList .edit-rule').length,
    instopTiles: window.__plans.adding ? document.querySelectorAll('#locationsList .tile.instop').length : null,
    inPlanRows: window.__plans.adding ? document.querySelectorAll('#locationsList .location-card.in-plan').length : null,
    stopCardsInList: (() => { const P = window.__plans, pl = P.plans.find(x => x.id === P.activeId); if (!pl) return 0; return [...document.querySelectorAll('#locationsList .location-card')].filter(c => pl.stops.some(s => (s.k === 'loc' ? s.id === c.dataset.id : s.id === Number(c.dataset.shapeId)))).length; })(),
    vw: innerWidth,
    doneText: (() => { const d = document.getElementById('doneBtn'); return d && getComputedStyle(d).display !== 'none' ? d.textContent.trim() : null; })(),
    stopOverlapViolations: (() => { const icons = [...document.querySelectorAll('.leaflet-marker-icon')].filter(e => e.offsetParent); const stops = icons.filter(e => e.querySelector('.pin-num')), others = icons.filter(e => !e.querySelector('.pin-num') && !e.querySelector('.highlighted-marker') && !/cluster/.test(e.className + e.innerHTML));
      const hit = (a, b) => { const r = a.getBoundingClientRect(), q = b.getBoundingClientRect(); return r.left < q.right && q.left < r.right && r.top < q.bottom && q.top < r.bottom; };
      let v = 0; stops.forEach(st => others.forEach(o => { if (hit(st, o) && +getComputedStyle(st).zIndex <= +getComputedStyle(o).zIndex) v++; })); return v; })(),
    doneBg: (() => { const d = document.getElementById('doneBtn'); return d && getComputedStyle(d).display !== 'none' ? getComputedStyle(d).backgroundColor : null; })(),
    pinNextShown: (() => { const mr = document.getElementById('map').getBoundingClientRect(); return [...document.querySelectorAll('.leaflet-marker-icon .pin-next')].filter(e => { const r = e.getBoundingClientRect(); const cx = r.left + r.width / 2, cy = r.top + r.height / 2; return cx >= mr.left && cx <= mr.right && cy >= mr.top && cy <= mr.bottom; }).length; })(),
    pinNextExpected: (() => { const P = window.__plans; if (!document.body.classList.contains('plan-view') || !P.mapNumbers || map.getZoom() < 14) return null; const pl = P.plans.find(x => x.id === P.activeId); if (!pl) return null; const nx = P.nextIndex(); if (nx < 0) return 0;
      const st = pl.stops[nx]; let ll; if (st.k === 'loc') { if (highlightedId === st.id) return 0; const l = locations.find(x => x.id === st.id); ll = [l.lat, l.lng]; } else { const nb = neighborhoodShapes.find(x => x.id === st.id); ll = shapeCentroid(nb); } return map.getBounds().contains(ll) ? 1 : 0; })(),
    filledTilesInEdit: window.__plans.adding ? [...document.querySelectorAll('#locationsList .tile.on')].length : 0,
    editSort: window.__plans.editSort, placesSort: window.__plans.placesSort, sortModeNow: sortMode,
    firstRowIsEdit: document.body.classList.contains('plan-view') && !!window.__plans.plans.find(x => x.id === window.__plans.activeId) ? (document.querySelector('#locationsList > *')?.classList.contains('add-row') || false) : null,
    mapZoom: map.getZoom(),
    expectedMapNums: (() => { const P = window.__plans; if (P.view !== 'plans' || !P.mapNumbers) return null; const pl = P.plans.find(x => x.id === P.activeId); if (!pl) return null; const b = map.getBounds();
      return pl.stops.map((st, i) => { let ll; if (st.k === 'loc') { const l = locations.find(x => x.id === st.id); ll = l && [l.lat, l.lng]; } else { const nb = neighborhoodShapes.find(x => x.id === st.id); ll = nb && shapeCentroid(nb); } return ll && b.contains(ll) ? String(i + 1) : null; }).filter(Boolean).sort(); })(),
    shownMapNums: (() => { const mr = document.getElementById('map').getBoundingClientRect(); return [...document.querySelectorAll('.leaflet-marker-icon .pin-num')].filter(e => { const r = e.getBoundingClientRect(); const cx = r.left + r.width / 2, cy = r.top + r.height / 2; return cx >= mr.left && cx <= mr.right && cy >= mr.top && cy <= mr.bottom; }).map(e => e.textContent).sort(); })(),
    editPlanOrderOk: (() => { const P = window.__plans; if (!P.adding || (P.editSort !== 'plan' && P.editLayout !== 'X')) return null; const pl = P.plans.find(x => x.id === P.activeId); const cards = [...document.querySelectorAll('#locationsList .location-card')];
      const ids = cards.slice(0, pl.stops.length).map(c => c.dataset.id || Number(c.dataset.shapeId)); return ids.every((id, k) => pl.stops[k] && pl.stops[k].id === id); })(),
    pinNumbers: [...document.querySelectorAll('.leaflet-marker-icon .pin-num')].map(e => e.textContent), mapNumbersOn: !!window.__plans.mapNumbers,
    clusterPinNumbers: [...document.querySelectorAll('.leaflet-marker-icon')].filter(e => /cluster/.test(e.className + e.innerHTML) && e.querySelector('.pin-num')).length,
    selectedCityChipBg: (() => { const c = document.querySelector('#cityFilters .city-btn.active'); return c ? getComputedStyle(c).backgroundColor : null; })(),
    nameCol: (() => { const w = [...document.querySelectorAll('#locationsList .location-card h3')].filter(vis).map(h => ({ n: h.textContent, w: h.clientWidth, cut: h.scrollWidth > h.clientWidth + 1 })); return w.length ? { min: Math.min(...w.map(x => x.w)), cut: w.filter(x => x.cut).map(x => x.n) } : null; })(),
    stopTiles: [...document.querySelectorAll('.tile.on, .tile.done')].filter(vis).map(e => ({ t: e.textContent, fs: getComputedStyle(e).fontSize, w: Math.round(e.getBoundingClientRect().width) })),
    targets: [...document.querySelectorAll('.rowslot, .plan-opt .more, .plan-opt .pick, .add-row, #doneBtn, .seg button, .plan-opt .act, #planUndo button, .popup-remove')].filter(vis).map(e => {
      const b = e.getBoundingClientRect(); const bs = getComputedStyle(e, '::before');
      const ext = bs.content !== 'none' && bs.position === 'absolute' ? { t: -parseFloat(bs.top) || 0, b: -parseFloat(bs.bottom) || 0, l: -parseFloat(bs.left) || 0, r: -parseFloat(bs.right) || 0 } : { t: 0, b: 0, l: 0, r: 0 };
      return { cls: e.className || e.id, w: Math.round(b.width + Math.max(0, ext.l) + Math.max(0, ext.r)), h: Math.round(b.height + Math.max(0, ext.t) + Math.max(0, ext.b)) };
    }),
    panelOpen,
    panel: panelOpen ? {
      h: Math.round(panel.clientHeight), scrollH: panel.scrollHeight, maxH: getComputedStyle(panel).maxHeight,
      seg: !!panel.querySelector('.seg') && panel.querySelector('.seg').getClientRects().length > 0, segLabels: [...panel.querySelectorAll('.seg button')].map(b => b.textContent + (b.getAttribute('aria-checked') === 'true' ? '*' : '')),
      cities: [...panel.querySelectorAll('#cityFilters .city-btn')].filter(vis).map(b => b.textContent + (b.classList.contains('active') ? '*' : '')),
      categories: [...panel.querySelectorAll('#filters .filter-btn')].filter(vis).map(b => b.textContent.trim() + (b.classList.contains('inactive') ? ' (off)' : '')),
      plans: [...panel.querySelectorAll('.plan-opt')].filter(e => e.getClientRects().length > 0).map(e => e.textContent.trim()),
      firstScreen: ['.seg-wrap', '#planLedger', '#cityFilters', '#filters'].filter(q => { const e = panel.querySelector(q); if (!e || !e.offsetHeight) return false; const top = e.offsetTop - panel.scrollTop; return top < panel.clientHeight && top + e.offsetHeight > 0; }),
      categoriesTopInPanel: (() => { const f = panel.querySelector('#filters'); return f.offsetTop - panel.scrollTop; })(),
    } : null,
    popup: !!document.querySelector('.leaflet-popup'), popupCat: document.querySelector('.leaflet-popup .popup-cat')?.textContent.trim() || document.querySelector('.leaflet-popup-content')?.textContent.trim() || null,
    clusters: document.querySelectorAll('.cluster-marker, [class*="cluster"]').length,
    routeLine: !!document.querySelector('path.leaflet-interactive, .leaflet-overlay-pane path'),
    authModal: (() => { const a = document.getElementById('authModal'); return !!a && vis(a); })(),
    undo: !document.getElementById('planUndo').hidden, undoText: document.getElementById('planUndo').textContent.trim(),
    collapsed: document.getElementById('locations').classList.contains('collapsed'),
  };
});

module.exports = { seed, fitNorrebro, openPanel, scrollListTo, scrollPanelTo, wait, holdTouch, dragGrip };
if (require.main === module) (async () => {
  const only = process.argv.slice(2);
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const facts = fs.existsSync(OUT + '/frames.json') ? JSON.parse(fs.readFileSync(OUT + '/frames.json', 'utf8')) : {};
  for (const f of FRAMES) {
    if (only.length && !only.includes(f.id)) continue;
    const { ctx, page } = await open(b, { w: f.w || 390, h: f.h || 844, signedOut: !!f.signedOut, geo: f.geo || null });
    await f.run(page);
    await wait(page, ['11-reorder', '33-tile-pressed', 'X4-reorder', 'Yd-reorder'].includes(f.id) ? 0 : 600);
    await page.screenshot({ path: `${OUT}/${f.id}.png` });
    const m = await measure(page);
    if (m.panelOpen) {   // the whole panel, unrolled: every control the panel holds
      await page.evaluate(() => { const p = document.getElementById('filtersPanel');
        p.style.cssText += ';position:fixed;top:0;bottom:auto;transform:none;max-height:none;z-index:10000;transition:none;';
        document.querySelectorAll('.floating-btn, #accountBtn, #floatingAddBtn, #planSlip, #nativeConfirm').forEach(e => e.style.visibility = 'hidden'); });
      await wait(page, 100);
      await page.locator('#filtersPanel').screenshot({ path: `${OUT}/${f.id}-panel.png` });
    }
    facts[f.id] = m;
    await ctx.close();
    process.stdout.write(f.id + ' ');
  }
  fs.writeFileSync(OUT + '/frames.json', JSON.stringify(facts, null, 1));
  await b.close();
  console.log('done');
})();
