// v3 row controls under Chromium CDP touch (not the full gesture gate; unverified on iPhone):
// the leading number (hold-drag handle) and the trailing + / X next to the existing
// Pencil Star (right) and visit (left) swipes, tap-to-navigate and scrolling.
//   REPO=<worktree> VENDOR=<dir> node griptest.js
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const REPO = process.env.REPO || path.resolve(__dirname, '../../../..');
const TMP = fs.mkdtempSync('/tmp/plans-v3g-');
const built = path.join(TMP, 'built.html'), PAGE = path.join(TMP, 'v3.html');
fs.writeFileSync(built, execFileSync('git', ['-C', REPO, 'show', 'ba0865c:index.html']));
execFileSync('python3', [path.join(__dirname, 'patch.py'), built, PAGE]);
process.env.PAGE = PAGE;
const { open, launch, FIX } = require('./harness');
const W = ms => new Promise(r => setTimeout(r, ms));
let pass = 0, fail = 0;
const ok = (name, cond, info) => { if (cond) pass++; else fail++; console.log(`${cond ? 'PASS' : 'FAIL'} ${name}${cond ? '' : ' ' + JSON.stringify(info)}`); };
const base = { plans: FIX.plans, stops: FIX.stops, visited: ['mir'] };
async function setup(b, extra = {}) {
  const r = await open(b, { ...base, ...extra });
  const page = r.page;
  await page.evaluate(() => document.getElementById('toggleFiltersBtn').click()); await W(400);
  await page.evaluate(() => document.querySelector('#listSwitch [data-view="plans"]').click()); await W(800);
  await page.evaluate(() => document.getElementById('toggleFiltersBtn').click()); await W(600);
  const cdp = await page.context().newCDPSession(page);
  const tp = p => ({ x: p.x, y: p.y, id: 1, radiusX: 4, radiusY: 4, force: 1 });
  const touch = async (pts, { hold = 0, gap = 16 } = {}) => {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [tp(pts[0])] });
    if (hold) await W(hold);
    for (const p of pts.slice(1)) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [tp(p)] }); await W(gap); }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  };
  const tap = async p => { await page.touchscreen.tap(p.x, p.y); };
  const at = (id, sel) => page.evaluate(([id, sel]) => { const e = document.querySelector(`.location-card[data-id="${id}"] ${sel}`); const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, l: b.x, w: b.width, h: b.height }; }, [id, sel]);
  const order = () => page.evaluate(() => [...document.querySelectorAll('#locationsList > .location-card.is-stop')].map(e => e.dataset.id || 's' + e.dataset.shapeId).join(','));
  const line = (a, b, n) => Array.from({ length: n + 1 }, (_, i) => ({ x: a.x + (b.x - a.x) * i / n, y: a.y + (b.y - a.y) * i / n }));
  return { ...r, cdp, touch, tap, at, order, line };
}
(async () => {
  const b = await launch();
  // --- controls: the harness really detects a tap and a swipe
  { const t = await setup(b);
    const q = await t.at('ass', '.row-main');
    await t.tap(q); await W(1600);
    ok('C1 control: a tap on a stop row body flies and opens its popup', await t.page.evaluate(() => !!document.querySelector('.leaflet-popup') && highlightedId === 'ass'));
    await t.ctx.close(); }
  // --- the number: tap = the row's tap; vertical stroke scrolls; hold-drag reorders; star/visit swipes unchanged
  { const t = await setup(b);
    let q = await t.at('jae', '.row-n');
    ok('N0 (r14) the number fills the glyph column (28px at x=16, centred on x=30), left of the icon, with a 44x44 target (to the screen edge, 14px up/down)', q.w === 28 && q.l === 16 && await t.page.evaluate(() => { const e = document.querySelector('.location-card[data-id="jae"] .row-n'); const s = getComputedStyle(e, '::before'); return s.left === '-16px' && s.right === '0px' && s.top === '-14px' && e.getBoundingClientRect().height + 28 >= 44; }), q);
    await t.tap(q); await W(1600);
    ok('N1 a quick tap on the number flies to the stop and opens its popup (it is the row tap)', await t.page.evaluate(() => !!document.querySelector('.leaflet-popup') && highlightedId === 'jae'));
    await t.page.evaluate(() => { map.closePopup(); setHighlighted(null); document.getElementById('locationsList').scrollTop = 0; }); await W(300);
    const before = await t.order();
    q = await t.at('cof', '.row-n');
    await t.touch(t.line({ x: q.x, y: q.y }, { x: q.x, y: q.y - 90 }, 8)); await W(400);
    const st = await t.page.evaluate(() => document.getElementById('locationsList').scrollTop);
    ok('N2 a vertical stroke that starts on the number scrolls the list, reorders nothing', st > 0 && (await t.order()) === before, { st });
    await t.page.evaluate(() => { document.getElementById('locationsList').scrollTop = 0; }); await W(300);
    q = await t.at('jae', '.row-n');
    await t.touch(t.line({ x: q.x, y: q.y }, { x: q.x, y: q.y + 62 }, 8), { hold: 470, gap: 30 }); await W(700);
    ok('N3 hold 400ms still, then drag down one row: stop 2 becomes stop 3', (await t.order()) === 'mir,cof,jae,ass,s9001,bla', await t.order());
    ok('N4 …the write is one reorder of one row (plan_stops update)', await t.page.evaluate(() => { const w = __calls.filter(c => c.table === 'plan_stops' && c.op !== 'select'); return w.length === 1 && w[0].op === 'update'; }), await t.page.evaluate(() => __calls.filter(c => c.table === 'plan_stops' && c.op !== 'select')));
    ok('N5 …and a drag never stars, visits or flies', await t.page.evaluate(() => !locations.find(l => l.id === 'jae').starred && !locations.find(l => l.id === 'jae').visited && !document.querySelector('.leaflet-popup')));
    q = await t.at('ass', '.row-n');
    await t.touch(t.line({ x: q.x, y: q.y }, { x: q.x, y: q.y - 12 }, 3), { hold: 120 }); await W(400);
    ok('N6 a 120ms touch that moves is not a hold (no lift, no reorder)', (await t.order()) === 'mir,cof,jae,ass,s9001,bla' && !(await t.page.$('.plan-lifted')));
    q = await t.at('ass', '.row-n');
    await t.touch(t.line({ x: q.x, y: q.y }, { x: q.x, y: q.y - 40 }, 5), { hold: 300, gap: 20 }); await W(500);
    ok('N6b (r12) a 300ms rest that then moves is still a scroll, not a lift (hold is 400ms)', (await t.order()) === 'mir,cof,jae,ass,s9001,bla' && !(await t.page.$('.plan-lifted')));
    q = await t.at('ass', '.row-n');
    await t.touch(t.line({ x: q.x, y: q.y }, { x: q.x + 120, y: q.y }, 12)); await W(1600);
    ok('N7 a right stroke that starts on the number still stars (Pencil Star unchanged)', await t.page.evaluate(() => locations.find(l => l.id === 'ass').starred));
    q = await t.at('bla', '.row-main');
    await t.page.evaluate(() => document.querySelector('.location-card[data-id="bla"]').scrollIntoView({ block: 'center' })); await W(300);
    q = await t.at('bla', '.plan-x');
    await t.touch(t.line({ x: q.x, y: q.y }, { x: q.x - 110, y: q.y }, 12)); await W(1600);
    ok('N8 a left stroke that starts on the X visits (swipe), and removes nothing', await t.page.evaluate(() => locations.find(l => l.id === 'bla').visited) && (await t.order()).split(',').length === 6, await t.order());
    await t.page.evaluate(() => document.querySelector('.location-card[data-id="cof"] .row-n').focus());
    await t.page.keyboard.press('ArrowUp'); await W(500);
    ok('N9 keyboard: ArrowUp on a focused number moves the stop up', (await t.order()).startsWith('cof,mir'), await t.order());
    await t.ctx.close(); }
  // --- + and X: near-still tap acts; a stroke never does
  { const t = await setup(b);
    await t.page.evaluate(() => showPlanRule()); await W(300);
    const firstOther = await t.page.evaluate(() => document.querySelector('#locationsList > .location-card:not(.is-stop)[data-id]').dataset.id);
    let q = await t.at(firstOther, '.plan-add');
    ok('P0 + is the X slot: 28px, >=44px target', q.w === 28 && await t.page.evaluate(id => getComputedStyle(document.querySelector(`.location-card[data-id="${id}"] .plan-add`), '::before').inset === '-8px', firstOther), q);
    await t.touch([{ x: q.x, y: q.y }, { x: q.x + 2, y: q.y + 1 }]); await W(800);
    ok('P1 a near-still tap on + appends the place as the last stop', (await t.order()).endsWith(',' + firstOther), await t.order());
    ok('P2 …and the slip says so, with Undo', await t.page.evaluate(() => /^(Added .* as stop 7|Stop 7 added · hold a number to move)Undo$/.test(document.getElementById('planSlip').textContent.trim())), await t.page.evaluate(() => document.getElementById('planSlip').textContent));
    await t.page.evaluate(() => document.querySelector('#planSlip button').click()); await W(800);
    ok('P3 Undo takes it back out', (await t.order()).split(',').length === 6);
    await t.page.evaluate(() => showPlanRule()); await W(300);
    q = await t.at(firstOther, '.plan-add');
    await t.touch(t.line({ x: q.x, y: q.y }, { x: q.x, y: q.y - 8 }, 4)); await W(600);
    ok('P4 a stroke that starts on + (8px) never adds', (await t.order()).split(',').length === 6);
    await t.page.evaluate(() => { document.getElementById('locationsList').scrollTop = 0; }); await W(300);
    q = await t.at('cof', '.plan-x');
    await t.touch([{ x: q.x, y: q.y }, { x: q.x + 2, y: q.y }]); await W(800);
    ok('P5 a near-still tap on a stop\'s X removes it from the plan (the place stays in Places)', (await t.order()) === 'mir,jae,ass,s9001,bla' && await t.page.evaluate(() => locations.some(l => l.id === 'cof')), await t.order());
    ok('P6 …the numbers close up (1..5) and the slip offers Undo', await t.page.evaluate(() => [...document.querySelectorAll('.is-stop .row-n')].map(e => e.textContent).join() === '1,2,3,4,5' && /^Removed The Coffee CollectiveUndo$/.test(document.getElementById('planSlip').textContent.trim())));
    await t.page.evaluate(() => document.querySelector('#planSlip button').click()); await W(800);
    ok('P7 Undo puts it back at stop 3', (await t.order()) === 'mir,jae,cof,ass,s9001,bla', await t.order());
    await W(6500);
    ok('P8 the slip is gone after 6s', await t.page.evaluate(() => document.getElementById('planSlip').hidden));
    await t.ctx.close(); }
  // --- long moves: auto-scroll while dragging (panel open, 4 rows showing); Home / End; title tap
  { const P7 = { id: 'p-7', name: 'Harbour loop', created_at: '2026-09-26T10:00:00Z' };
    const t = await setup(b, { plans: FIX.plans.concat([P7]), stops: FIX.stops.concat(['nyh', 'har', 'ama', 'jmm', 'chr', 'tiv', 'isr'].map((l, i) => ({ id: 'h' + i, plan_id: 'p-7', location_id: l, shape_id: null, position: i + 1 }))) });
    await t.page.evaluate(() => document.getElementById('toggleFiltersBtn').click()); await W(400);
    await t.page.evaluate(() => document.querySelector('#planPick .plan-picker').click()); await W(200);
    await t.page.evaluate(() => document.querySelector('#planLedger [data-plan="p-7"]').click()); await W(800);
    await t.page.evaluate(() => document.querySelector('.location-card[data-id="isr"]').scrollIntoView({ block: 'end' })); await W(300);
    const vis = await t.page.evaluate(() => { const l = document.getElementById('locationsList').getBoundingClientRect(); return { top: l.top, rows: Math.round((Math.min(l.bottom, innerHeight) - l.top) / 56), scroll: document.getElementById('locationsList').scrollTop }; });
    ok('L0 setup: panel open, the list shows about 4 rows, stop 7 needs a scroll', vis.rows <= 5 && vis.scroll > 0, vis);
    // held at the edge: auto-scroll carries it to the top
    await t.page.evaluate(() => { document.querySelector('.location-card[data-id="isr"]').scrollIntoView({ block: 'end' }); }); await W(300);
    const q2 = await t.at('isr', '.row-n');
    await t.cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: q2.x, y: q2.y, id: 1 }] }); await W(470);
    for (let i = 1; i <= 10; i++) { await t.cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: q2.x, y: q2.y + (vis.top + 6 - q2.y) * i / 10, id: 1 }] }); await W(30); }
    await W(1500);
    const mid = await t.page.evaluate(() => document.getElementById('locationsList').scrollTop);
    await t.cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await W(700);
    ok('L1 holding the lifted stop at the list’s top edge auto-scrolls the list to the top', mid === 0, { mid });
    ok('L2 …and the drop makes stop 7 stop 1 (Israels Plads first)', (await t.order()).startsWith('isr,'), await t.order());
    await t.page.evaluate(() => document.querySelector('.location-card[data-id="isr"] .row-n').focus());
    await t.page.keyboard.press('End'); await W(600);
    ok('K1 End on a focused number moves it to the end', (await t.order()).endsWith(',isr'), await t.order());
    await t.page.evaluate(() => document.querySelector('.location-card[data-id="isr"] .row-n').focus());
    await t.page.keyboard.press('Home'); await W(600);
    ok('K2 Home moves it to the top', (await t.order()).startsWith('isr,'), await t.order());
    await t.page.evaluate(() => { document.getElementById('locationsList').scrollTop = 400; }); await W(200);
    await t.page.evaluate(() => document.querySelector('#locationsHeader h2').click()); await W(900);
    ok('H1 tapping the plan name in the header scrolls back to the stops (top)', await t.page.evaluate(() => document.getElementById('locationsList').scrollTop === 0));
    await t.ctx.close(); }
  // --- Places delete copy names the plan
  { const t = await setup(b); const msgs = [];
    t.page.on('dialog', d => { msgs.push(d.message()); d.dismiss(); });
    await t.page.evaluate(() => document.querySelector('#listSwitch [data-view="places"]').click()); await W(600);
    await t.page.evaluate(() => document.querySelector('.location-card[data-id="mir"]').scrollIntoView({ block: 'center' })); await W(300);
    const q = await t.at('mir', '.delete-btn'); await t.touch([{ x: q.x, y: q.y }, { x: q.x + 1, y: q.y }]); await W(600);
    ok('D1 Places × on a place that is a stop: the confirm names the plan, and Cancel keeps both', msgs[0] === 'Delete Mirabelle bakery?\nIt is a stop in “Nørrebro afternoon”; it will leave that plan too.' && await t.page.evaluate(() => locations.some(l => l.id === 'mir')), msgs);
    await t.ctx.close(); }
  // --- filters never change the view
  { const t = await setup(b);
    await t.page.evaluate(() => document.getElementById('toggleFiltersBtn').click()); await W(400);
    await t.page.evaluate(() => document.querySelector('#cityFilters [data-city="malmo"]').click()); await W(600);
    await t.page.evaluate(() => document.getElementById('filter-cafe').click()); await W(300);
    ok('F1 picking a city and a chip in Plans keeps Plans (switch, header, stops)', await t.page.evaluate(() => document.body.classList.contains('plan-view') && document.querySelector('#listSwitch [aria-checked="true"]').dataset.view === 'plans' && document.querySelectorAll('.is-stop').length === 6));
    await t.page.evaluate(() => document.querySelector('#listSwitch [data-view="places"]').click()); await W(600);
    ok('F2 switching to Places keeps the same filters (Malmö, cafe off)', await t.page.evaluate(() => citySelection === 'malmo' && filters.categories.cafe === false && document.getElementById('filter-cafe').classList.contains('inactive')));
    await t.ctx.close(); }
  console.log(`\n${fail ? 'FAIL' : 'PASS'} ${pass}/${pass + fail}`);
  await b.close();
  process.exit(fail ? 1 : 0);
})();
