// Real-touch checks (CDP touch events, Chromium) for the plan row controls.
// Plans is read-only; ALL editing (add, remove, reorder) lives in Edit mode.
// Controls prove the harness sees a real swipe and a real tap when they DO happen.
// Not a substitute for the full gesture gate or an iPhone.   usage: REPO=<worktree> node griptest.js
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { open } = require('./shot.js');
const FULL = 'mir,jae,cof,ass,9001,bla';
const seedJs = () => {
  const L_ = id => ({ k: 'loc', id }), S_ = id => ({ k: 'shape', id });
  const P = window.__plans;
  P.plans = [{ id: 'nor', name: 'Nørrebro afternoon', stops: [L_('mir'), L_('jae'), L_('cof'), L_('ass'), S_(9001), L_('bla')] }];
  P.view = 'plans'; P.choosePlan('nor');
};
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  let pass = 0, fail = 0;
  const ok = (c, what) => { console.log(`${c ? 'PASS' : 'FAIL'} ${what}`); c ? pass++ : fail++; };
  async function fresh(edit = false, planOrder = false, layout = 'X') {
    const { ctx, page } = await open(b, {});
    await page.evaluate(seedJs);
    if (edit) await page.evaluate(l => { window.__plans.editLayout = l; window.__plans.enterEdit(); }, layout);
    if (planOrder) await page.evaluate(() => window.__plans.setEditSort('plan'));
    await page.waitForTimeout(400);
    const cdp = await ctx.newCDPSession(page);
    const t = (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
    const stroke = async (x, y, dx, dy, { steps = 12, pre = 0, hold = 0 } = {}) => { await t('touchStart', x, y); if (pre) await page.waitForTimeout(pre);
      for (let k = 1; k <= steps; k++) { await t('touchMove', x + dx * k / steps, y + dy * k / steps); await page.waitForTimeout(16); } if (hold) await page.waitForTimeout(hold); await t('touchEnd'); await page.waitForTimeout(700); };
    const tap = async (x, y, after = 2600) => { await t('touchStart', x, y); await page.waitForTimeout(60); await t('touchEnd'); await page.waitForTimeout(after); };
    const flags = id => page.evaluate(i => (({ starred, visited }) => ({ starred, visited }))(locations.find(l => l.id === i)), id);
    const state = () => page.evaluate(() => ({ popup: !!document.querySelector('.leaflet-popup'), popupRemove: document.querySelectorAll('.popup-remove').length,
      order: window.__plans.plans[0].stops.map(s => s.id).join(','), undo: !document.getElementById('planUndo').hidden, undoText: document.getElementById('planUndo').textContent,
      scroll: document.getElementById('locationsList').scrollTop }));
    const box = sel => page.evaluate(s => { const e = document.querySelector(s); if (!e) return null; const c = e.closest('#locationsList .location-card');
      if (c) { const l = document.getElementById('locationsList'); const cr = c.getBoundingClientRect(), lr = l.getBoundingClientRect(); if (cr.top < lr.top || cr.bottom > lr.bottom) l.scrollTop += (cr.top - lr.top) - (lr.height - cr.height) / 2; }
      const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, sel);
    return { ctx, page, stroke, tap, state, box, flags };
  }
  const same = (a, b) => a.starred === b.starred && a.visited === b.visited;
  // controls
  { const f = await fresh(); const r = await f.box('[data-id="jae"] h3'); const s0 = await f.flags('jae'); await f.stroke(r.x - 40, r.y, 140, 0); ok((await f.flags('jae')).starred !== s0.starred, 'control: right stroke on a Plans row body toggles the star'); await f.ctx.close(); }
  { const f = await fresh(); const r = await f.box('[data-id="jae"] h3'); await f.tap(r.x, r.y); ok((await f.state()).popup, 'control: tap on a Plans row flies + opens the popup'); await f.ctx.close(); }
  // Plans is read-only
  { const f = await fresh(); const n = await f.page.evaluate(() => document.querySelectorAll('#locationsList .grip, #locationsList button.rowslot').length); const first = await f.page.evaluate(() => document.querySelector('#locationsList > *').className); ok(n === 0 && /add-row/.test(first), `Plans: no grip, no tile buttons (${n}); Edit stops is the first row`); await f.ctx.close(); }
  { const f = await fresh(); const t = await f.box('[data-id="cof"] .rowslot.passive'); await f.tap(t.x, t.y); const s1 = await f.state();
    ok(s1.order === FULL && !s1.undo && s1.popup && s1.popupRemove === 0, 'Plans: a tap on the number is a row tap (popup, information only, no Remove), nothing removed'); await f.ctx.close(); }
  { const f = await fresh(); const t = await f.box('[data-id="ass"] .rowslot.passive'); const s0 = await f.state(); await f.stroke(t.x, t.y, 0, -150, { steps: 10 }); const s1 = await f.state();
    ok(s1.scroll !== s0.scroll && s1.order === FULL, `Plans: a vertical stroke from the right edge scrolls (scrollTop ${s0.scroll} -> ${s1.scroll})`); await f.ctx.close(); }
  // Edit opens in the Places list's own sort; Plan order is a session-only choice
  { const f = await fresh(true, false, 'Y'); const r = await f.page.evaluate(() => ({ first: document.querySelector('#locationsList .location-card')?.dataset.id, mode: sortMode, edit: window.__plans.editSort }));
    ok(r.first === 'ama' && r.mode === r.edit, `Edit opens in Places' sort (${r.mode}; first row ${r.first}), not Plan order`); await f.ctx.close(); }
  { const f = await fresh(true, false, 'Y'); await f.page.click('#sortBtn'); await f.page.waitForTimeout(300); await f.page.click('#sortMenu .sort-opt[data-sort="plan"]'); await f.page.waitForTimeout(300);
    const r = await f.page.evaluate(() => ({ first: [...document.querySelectorAll('#locationsList .location-card')].slice(0, 6).map(c => c.dataset.id || c.dataset.shapeId).join(','), stored: localStorage.getItem('triplet.sortMode') }));
    ok(r.first === FULL, `Edit ⇅ › Plan order: the plan's stops lead (${r.first})`);
    await f.page.click('#sortBtn'); await f.page.waitForTimeout(300); await f.page.click('#sortMenu .sort-opt[data-sort="category"]'); await f.page.waitForTimeout(300);
    const st = await f.page.evaluate(() => localStorage.getItem('triplet.sortMode')); await f.page.click('#doneBtn'); await f.page.waitForTimeout(300);
    const after = await f.page.evaluate(() => sortMode);
    ok(st === r.stored && after === 'az', `Edit's sort is session-only: storage unchanged (${st}), Places back to ${after} after Done`); await f.ctx.close(); }
  // Option X (owner decision): stops first + a rule, grips without choosing a sort
  { const f = await fresh(true, false, 'X'); await f.page.waitForTimeout(300);
    const r = await f.page.evaluate(() => ({ first: [...document.querySelectorAll('#locationsList .location-card')].slice(0, 6).map(c => c.dataset.id || c.dataset.shapeId).join(','), rule: document.querySelectorAll('#locationsList .edit-rule').length, grips: document.querySelectorAll('#locationsList .grip').length }));
    ok(r.first === FULL && r.rule === 1 && r.grips === 6, `Option X: stops lead (${r.first}), one rule, ${r.grips} grips`);
    const g = await f.box('[data-id="ass"] .grip'); await f.stroke(g.x, g.y, 0, -112, { steps: 14, pre: 350, hold: 150 });
    ok((await f.state()).order === 'mir,ass,jae,cof,9001,bla', 'Option X: hold-drag reorders with no sort step'); await f.ctx.close(); }
  // Edit grip: hold to arm
  { const f = await fresh(true, true); const g = await f.box('[data-id="ass"] .grip'); const s0 = await f.flags('ass'); await f.stroke(g.x, g.y, -140, 0); const s1 = await f.state();
    ok(same(await f.flags('ass'), s0) && !s1.popup && s1.order === FULL, 'Edit grip: a left stroke does not visit/star, fly or reorder'); await f.ctx.close(); }
  { const f = await fresh(true, true); const g = await f.box('[data-id="ass"] .grip'); await f.tap(g.x, g.y); ok(!(await f.state()).popup, 'Edit grip: a tap does not fly'); await f.ctx.close(); }
  { const f = await fresh(true, true); const g = await f.box('[data-id="ass"] .grip'); const s0 = await f.state(); await f.stroke(g.x, g.y, 0, -150, { steps: 10 }); const s1 = await f.state();
    ok(s1.scroll !== s0.scroll && s1.order === FULL, `Edit grip: a quick vertical stroke SCROLLS (scrollTop ${s0.scroll} -> ${s1.scroll}), no reorder`); await f.ctx.close(); }
  { const f = await fresh(true, true); const g = await f.box('[data-id="ass"] .grip'); const s0 = await f.flags('ass'); await f.stroke(g.x, g.y, 0, -112, { steps: 14, pre: 350, hold: 150 }); const s1 = await f.state();
    ok(s1.order === 'mir,ass,jae,cof,9001,bla' && !s1.popup && same(await f.flags('ass'), s0), `Edit grip: hold 350ms then drag reorders, no fly/star/visit (${s1.order})`); await f.ctx.close(); }
  { const f = await fresh(true, true); await f.box('[data-id="ass"] .grip'); await f.page.focus('[data-id="ass"] .grip'); await f.page.keyboard.press('ArrowUp'); ok((await f.state()).order === 'mir,jae,ass,cof,9001,bla', 'Edit grip: ArrowUp moves the stop up one'); await f.ctx.close(); }
  // Edit tile: remove with a still tap; strokes are inert
  { const f = await fresh(true); const t = await f.box('[data-id="cof"] .rowslot:not(.grip)'); await f.tap(t.x, t.y, 400); const s1 = await f.state();
    ok(s1.order === 'mir,jae,ass,9001,bla' && s1.undo && !s1.popup, 'Edit tile: a still tap on a stop number removes it, Undo shows, no fly');
    const u = await f.box('#planUndo button'); await f.tap(u.x, u.y, 300); ok((await f.state()).order === FULL, 'Edit tile: Undo restores the stop to its position'); await f.ctx.close(); }
  { const f = await fresh(true); const t = await f.box('[data-id="cof"] .rowslot:not(.grip)'); const s0 = await f.flags('cof'); await f.stroke(t.x, t.y, -140, 0); const s1 = await f.state();
    ok(same(await f.flags('cof'), s0) && s1.order === FULL, 'Edit tile: a left stroke leaves visit/star unchanged and removes nothing'); await f.ctx.close(); }
  { const f = await fresh(true); const t = await f.box('[data-id="cof"] .rowslot:not(.grip)'); await f.stroke(t.x, t.y, 0, -112, { steps: 14 }); const s1 = await f.state();
    ok(s1.order === FULL && !s1.undo, 'missed grip: a vertical drag that starts on the tile neither removes nor reorders'); await f.ctx.close(); }
  // Undo: temporary, multi-level inside the window, survives Done, ends on leaving the plan
  { const f = await fresh(true); const t = await f.box('[data-id="cof"] .rowslot:not(.grip)'); await f.tap(t.x, t.y, 300);
    const ms = await f.page.evaluate(() => window.__plans.UNDO_MS); await f.page.waitForTimeout(ms + 400); const s1 = await f.state();
    ok(!s1.undo && s1.order === 'mir,jae,ass,9001,bla', `Undo is temporary: gone after ${ms}ms, the removal stands`); await f.ctx.close(); }
  { const f = await fresh(true); let a = await f.box('[data-id="cof"] .rowslot:not(.grip)'); await f.tap(a.x, a.y, 300); a = await f.box('[data-id="jae"] .rowslot:not(.grip)'); await f.tap(a.x, a.y, 300);
    const mid = await f.state(); let u = await f.box('#planUndo button'); await f.tap(u.x, u.y, 300); const one = await f.state(); u = await f.box('#planUndo button'); await f.tap(u.x, u.y, 300); const two = await f.state();
    ok(/2 removed/i.test(mid.undoText) && one.order === 'mir,jae,ass,9001,bla' && two.order === FULL && !two.undo, `Undo is multi-level inside its window: ${mid.order} -> ${one.order} -> ${two.order}`); await f.ctx.close(); }
  { const f = await fresh(true); const a = await f.box('[data-id="cof"] .rowslot:not(.grip)'); await f.tap(a.x, a.y, 300); await f.page.click('#doneBtn'); await f.page.waitForTimeout(200);
    ok((await f.state()).undo, 'Undo survives Done (same plan, inside the window)');
    await f.page.evaluate(() => { document.querySelector('.seg button[data-v="places"]').click(); document.querySelector('.seg button[data-v="plans"]').click(); }); await f.page.waitForTimeout(200);
    ok(!(await f.state()).undo, 'leaving the plan (Places) ends the Undo window'); await f.ctx.close(); }
  await b.close();
  console.log(`${fail ? 'FAIL' : 'PASS'} ${pass}/${pass + fail} (Chromium touch emulation; not a substitute for the full gesture gate or an iPhone)`);
  process.exit(fail ? 1 : 0);
})();
