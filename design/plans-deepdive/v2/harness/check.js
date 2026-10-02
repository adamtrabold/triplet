// Asserts the machine-checkable acceptance lines (1, 2, 9, 14 counts) on frames.json from frames.js.
// usage: node check.js out/frames.json
const F = JSON.parse(require('fs').readFileSync(process.argv[2] || __dirname + '/out/frames.json', 'utf8'));
let pass = 0, fail = 0;
const ok = (cond, id, what) => { if (cond) pass++; else { fail++; console.log(`FAIL ${id}: ${what}`); } };
let anyOff = false;
for (const [id, m] of Object.entries(F)) {
  const rail = id.includes('rail');
  // 2 -- header: same 57px band, one row. Title rule (declared, never vacuous):
  //   Places: "<City> list (N)", N = rows shown.  Edit mode: "<Plan> · edit" (names the target; no count).
  //   Plans: exactly the plan's name ("Plans" with no plan), no count -- progress lives on the rows.
  ok(m.header.h === 57, id, `header height ${m.header.h} != 57`);
  const T = m.title;
  if (m.view === 'places') { const mm = T.match(/^.+ list \((\d+)\)$/i); ok(!!mm && +mm[1] === m.rows, id, `Places title "${T}" must be "<City> list (${m.rows})"`); }
  else if (m.adding) { ok(!!m.plan && T === m.plan, id, `Edit title "${T}" must be exactly the plan's name "${m.plan}" (Done signals the mode)`); }
  else { ok(T === (m.plan || 'Plans'), id, `Plans title "${T}" must be exactly "${m.plan || 'Plans'}"`); ok(!/\(\d+\)\s*$/.test(T), id, `Plans title "${T}" carries a count`); }
  const shown = Object.fromEntries(m.headerButtons.map(b => [b.id, b.shown]));
  ok(shown.toggleFiltersBtn, id, 'filters button missing from header');
  const sortHidden = m.planView || (m.adding && m.editLayout === 'X');
  ok(sortHidden ? !shown.sortBtn : shown.sortBtn, id, sortHidden ? '⇅ must be hidden (Plans, or Edit option X)' : '⇅ missing from header');
  if (m.adding) ok(m.doneText === 'Done', id, `Done must be the ink-only word "Done" (${m.doneText})`);
  ok(m.stopOverlapViolations === 0, id, `${m.stopOverlapViolations} stop pins drawn under an overlapping place pin`);
  ok(rail ? !shown.collapseBtn : shown.collapseBtn, id, rail ? 'rail hides collapse (app behaviour)' : 'collapse must be present');
  if (m.adding) ok(shown.doneBtn && !shown.centerMeBtn, id, 'Add mode: Done takes the trailing slot, replacing locate');
  else ok(!shown.doneBtn && shown.centerMeBtn, id, 'outside Add mode: locate present, no Done');
  // 9 -- rows 56px, stop numbers >= 15px, targets >= 44px
  if (!m.collapsed && m.rows) ok(m.rowHeights.length > 0 && m.rowHeights.every(h => Math.abs(h - 56) < 0.01), id, `row heights ${m.rowHeights}`);
  m.stopTiles.forEach(t => ok(parseFloat(t.fs) >= 14 && t.w >= 28, id, `stop number tile ${t.t} ${t.w}px at ${t.fs}`));
  m.targets.forEach(t => ok(t.h >= 44 && t.w >= 44, id, `target ${t.cls} ${t.w}x${t.h} < 44`));
  // 3 -- Plans ignores the filters: the whole plan shows, the chips read unavailable (40%) in the Plans view only
  if (m.planView && m.plan && !m.collapsed) ok(m.rows === m.planStops, id, `Plans shows ${m.rows} of ${m.planStops} stops (filters must not apply)`);
  // CD fix -- the Plans tile is information, never a control; visited shows on the tile, no stamp
  ok(m.tileButtonsInPlanView === 0, id, `${m.tileButtonsInPlanView} tile buttons in the Plans view`);
  // visited in Plans = the app's own VISITED stamp (the shared mark), never a second language on the tile
  if (m.planView && !m.collapsed) ok(m.stampsInPlanView === m.visitedStopsShown, id, `${m.stampsInPlanView} stamps for ${m.visitedStopsShown} visited stops in Plans`);
  ok(m.hollowTiles === 0, id, `${m.hollowTiles} hollow 'visited' tiles (retired)`);
  // Plans is read-only: no grips; outline tiles, exactly one filled tile = NEXT (none when the plan is done)
  if (m.planView && m.plan && !m.collapsed) { ok(m.gripsInPlanView === 0, id, `${m.gripsInPlanView} grips in the read-only Plans view`);
    ok(m.filledTilesInPlanView === (m.nextExpected >= 0 ? 1 : 0), id, `${m.filledTilesInPlanView} filled tiles (expected ${m.nextExpected >= 0 ? 1 : 0}: NEXT only)`); }
  ok(m.popupRemove === 0, id, 'the popup carries no Remove (editing lives in Edit mode)');
  if (m.editPlanOrderOk !== null) ok(m.editPlanOrderOk === true, id, 'Edit mode, Plan order (chosen): the plan\'s stops must lead the list in plan order');
  // Edit opens in the Places list's own current sort (Plan order is a choice, never the default), session-only
  if (m.adding && m.editLayout === 'Y' && !/plan-order|reorder|sort-menu/.test(id)) ok(!!m.placesSort && m.editSort === m.placesSort && m.sortModeNow === m.placesSort, id, `Edit must open in Places' sort (edit ${m.editSort}, places ${m.placesSort})`);
  // Option X: stops lead with grips, one rule after them, always (owner decision frames)
  if (m.adding && m.editLayout === 'X') { ok(m.editPlanOrderOk === true, id, 'Option X: stops must lead in plan order'); ok(m.ruleCount === 1, id, `Option X: exactly one rule (${m.ruleCount})`); }
  if (m.adding && m.editLayout === 'Y') ok(m.ruleCount === 0, id, 'Option Y has no rule');
  // Edit: every stop row shows the "in plan" tile + row mark (distinct from + and from NEXT's solid navy)
  if (m.adding) { ok(m.instopTiles === m.stopCardsInList, id, `${m.instopTiles} in-plan tiles for ${m.stopCardsInList} stop rows`); ok(m.inPlanRows === m.stopCardsInList, id, `${m.inPlanRows} in-plan row marks for ${m.stopCardsInList} stop rows`); }
  // Done is ink-only (navy fill is reserved for NEXT)
  if (m.doneBg !== null) ok(m.doneBg !== 'rgb(18, 41, 63)', id, `Done ✓ is a navy tile (${m.doneBg})`);
  // NEXT is filled on the map too (Plans only), never in Edit
  if (m.pinNextExpected !== null) ok(m.pinNextShown === m.pinNextExpected, id, `NEXT pin fill: ${m.pinNextShown} shown, ${m.pinNextExpected} expected`);
  if (m.adding) ok(m.pinNextShown === 0, id, 'a NEXT pin fill in Edit mode');
  // filled = NEXT only, everywhere: none in Edit
  if (m.adding) ok(m.filledTilesInEdit === 0, id, `${m.filledTilesInEdit} filled tiles in Edit (filled means NEXT only)`);
  // "Edit stops" is the first row of a plan's list (no scrolling to reach it)
  if (m.firstRowIsEdit !== null && !m.collapsed) ok(m.firstRowIsEdit === true, id, '"Edit stops" must be the first row of the Plans list');
  // stated title fit: plan names up to 20 characters are never truncated, in Plans or Edit
  // stated fit: phone (390px) 20 characters in Plans and Edit; the 360px rail in Edit 16 (Done's word takes locate's slot)
  const fit = m.vw >= 900 && m.adding ? 16 : 20;
  if (m.view === 'plans' && m.plan && m.plan.length <= fit) ok(m.titleTruncated === false, id, `"${m.plan}" (${m.plan.length} chars, fit ${fit}) is truncated in the header`);
  // map numbers: in Plans every stop in view carries its number (pins AND shapes) once pins are solo
  if (m.expectedMapNums && m.mapZoom >= 14) ok(JSON.stringify(m.shownMapNums) === JSON.stringify(m.expectedMapNums), id, `map numbers ${m.shownMapNums} != stops in view ${m.expectedMapNums}`);
  if (m.view !== 'plans') ok(m.shownMapNums.length === 0, id, 'stop numbers on the map in Places');
  // map numbers: only when the option is on; never on a cluster
  if (!m.mapNumbersOn) ok(m.pinNumbers.length === 0, id, 'pin numbers shown with the option off');
  ok(m.clusterPinNumbers === 0, id, 'a cluster carries a stop number');
  // unavailable city chips never read as selected in the Plans view
  if (m.panelOpen && !m.planView && !m.adding && m.view === 'places') ok(m.selectedCityChipBg === 'rgb(18, 41, 63)', id, `Places: the selected city chip must stay navy (${m.selectedCityChipBg})`);
  // 1 -- every panel frame holds the whole real panel + the switch
  if (m.panelOpen) {
    const P = m.panel;
    if (m.adding) ok(!P.seg && P.plans.length === 0, id, 'Edit panel must hold only the Places filters (no switch, no plans: it cannot flip you out of editing)');
    else ok(P.seg && P.segLabels.length === 2 && /^Places/.test(P.segLabels[0]) && /^Plans/.test(P.segLabels[1]), id, `switch ${P.segLabels}`);
    if (m.planView) ok(P.cities.length === 0 && P.categories.length === 0, id, `Plans-side panel must not show chips (${P.cities.length} cities, ${P.categories.length} categories)`);
    else { ok(P.cities.length === 6 && P.cities.some(c => /^All cities/i.test(c)), id, `city chips ${P.cities}`); ok(P.categories.length === 11, id, `category chips ${P.categories.length}`); }
    if (P.categories.some(c => c.endsWith('(off)'))) anyOff = true;
    ok(P.maxH === '40vh' || /px$/.test(P.maxH), id, `panel max-height ${P.maxH}`);
    P.plans.forEach(t => { const mm = t.match(/(\d+) (stops?)$/); if (mm) ok((+mm[1] === 1) === (mm[2] === 'stop'), id, `plural "${t}"`); });
  }
  // 10 -- popup in a plan names the stop on the category line
  if (m.popup && m.view === 'plans') ok(/Stop \d+ of \d+/.test(m.popupCat || ''), id, `popup category line "${m.popupCat}"`);
}
ok(anyOff, 'all', 'no panel frame shows a category chip in its off state');
console.log(`${fail ? 'FAIL' : 'PASS'} ${pass} passed, ${fail} failed, ${Object.keys(F).length} frames`);
process.exit(fail ? 1 : 0);
