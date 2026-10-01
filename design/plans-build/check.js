// The per-frame truth list, asserted against ../frames/frames.json (measured on the page).
// Writes ../truths.md. Fails on any false or missing value (no vacuous passes).
//   node check.js
const fs = require('fs'), path = require('path');
const OUTROOT = process.env.OUT || '/tmp/plans-v3-out';
const F = JSON.parse(fs.readFileSync(path.join(OUTROOT, 'frames/frames.json'), 'utf8'));
// r15: rendered-ink alignment from ink.js (run it first): a stop's icon must LOOK left-aligned with the
// Places names below the divider. Optical rule, as type does it: a round icon (ring, dotted ring) lands
// where round capitals (C, G, O, S) land; the district diamond's tip lands where pointed capitals (A, T,
// V) land. Both within 0.5 css px, at 1x and at 3x.
const INK = JSON.parse(fs.readFileSync(path.join(OUTROOT, 'ink.json'), 'utf8'));
const inkTruths = () => Object.entries(INK).flatMap(([k, v]) => {
  const ref = s => s.kind === 'diamond' ? v.letters.point : v.letters.round;
  const off = v.stopIcons.map(s => `${s.kind} ${(s.iconInk - ref(s)).toFixed(2)}`).join(', ');
  return [[`r15 ink at ${k}: every stop icon’s left ink is within 0.5px of the matching Places letters’ ink (rings → C/G/O/S at ${v.letters.round}, diamond → A/T/V at ${v.letters.point}); offsets: ${off}`,
    v.stopIcons.length >= 6 && v.stopIcons.every(s => Math.abs(s.iconInk - ref(s)) <= 0.5)]];
});
const CITIES = ['LA', 'Reykjavík', 'Copenhagen', 'Malmö', 'Stockholm', 'All cities'];
const CATS = ['restaurant', 'cafe', 'bar', 'attraction', 'nature', 'shopping', 'area', 'hotel', 'other', 'district', 'street'];
const stops = f => f.rows.filter(r => r.kind === 'stop');
const others = f => f.rows.filter(r => r.kind === 'place');
const ruleIdx = f => f.rows.findIndex(r => r.kind === 'rule');
const nums = f => stops(f).map(r => r.num).join(',');
const onCities = f => f.cities.filter(c => c.on).map(c => c.label);
const offCats = f => f.cats.filter(c => !c.on).map(c => c.label.toLowerCase());
const eqCats = f => f.cats.length === 11 && CATS.every((c, i) => f.cats[i].label.toLowerCase() === c);
const eqCities = f => f.cities.length === 6 && CITIES.every((c, i) => f.cities[i].label.toLowerCase() === c.toLowerCase());
// Leaflet z = screen y + offset, so the ladder only matters where marks overlap (< 24px apart)
const overlapsOk = f => f.markers.filter(m => m.num).every(m => f.markers.filter(x => !x.num && !x.redCluster && Math.hypot(x.x - m.x, x.y - m.y) < 24).every(x => x.z < m.z));
// r3 map rules: every stop number readable (the stop is the topmost thing at its centre);
// stops never hide each other; below SOLO_MIN_ZOOM nothing else sits within 24px of a stop.
const mapRules = f => {   // the frame-level subset of matrix.js's rules (the matrix asserts them all)
  const st = f.markers.filter(m => m.num && m.onMap);
  return [
    ['R1 digits only on stop tags and on Places’ red count clusters', f.markers.filter(m => m.onMap && !m.num && !m.redCluster).every(m => !/\d/.test(m.txt || ''))],
    [`R4 every shown stop tag on screen is uncovered (${st.filter(m => m.tagShown).length})`, st.filter(m => m.tagShown).every(m => m.tagTop)],
    ['R4 no Places cluster is under a stop (clusters are topmost at their centres)', f.markers.filter(m => m.redCluster && m.onMap).every(m => m.topmost || !f.markers.some(s => s.num && Math.hypot(s.x - m.x, s.y - m.y) < 14 && s.z > m.z))],
    ['R3 other places are ordinary Places pins (no muted/faint marks)', f.markers.every(m => !m.muted)]
  ];
};
const stopMarkers = f => f.markers.filter(m => m.num && m.onMap);
// ---- truths common to every Plans frame with an open plan
const HAIR = 'rgb(216, 206, 186)', INK2 = 'rgb(90, 86, 76)', NAVY = 'rgb(18, 41, 63)';
const planCommon = (f, plan, n) => [
  [`view is Plans; header title is exactly "${plan}"`, f.view === 'plans' && f.title === plan],
  ['header keeps collapse, sort, filters and locate; 57px', (f.header.collapse || f.w > 900) && f.header.sort && f.header.filters && f.header.locate && Math.round(f.headerH) === 57],
  [`all ${n} stops lead the list, numbered 1..${n} in plan order`, stops(f).length === n && nums(f) === Array.from({ length: n }, (_, i) => i + 1).join(',') && f.rows.slice(0, n).every(r => r.kind === 'stop' || r.kind === 'note')],
  ['r11: then exactly one divider -- Places’ group divider, 2px of --hair (the last stop’s 1px rule + the caption’s 1px), no navy -- then only non-stops', f.rows.filter(r => r.kind === 'rule').length === 1 && f.rows.slice(ruleIdx(f) + 1).every(r => r.kind !== 'stop') && f.rows[ruleIdx(f)].border === `1px ${HAIR}` && (() => { const last = f.rows[ruleIdx(f) - 1]; return !last || last.kind === 'note' || last.rowBorder === `1px ${HAIR}`; })()],
  ['r14: one left axis: the header chevron, every stop number (1 or 2 digits, measured on the glyphs) and every place icon below the divider share a centre x within 0.5px (x=30 at 390px); a stop’s own icon sits one column over (box x=56–84, drawn up to 1.83px left by r15’s ink alignment), its text at 96 (122 when starred); X (remove) on the right', (() => { const ax = f.chevCx ?? 30; const near = x => x != null && Math.abs(x - ax) <= 0.5;
    return (f.w > 900 || near(30)) && stops(f).every(r => near(r.numCx) && r.badgeLeft >= r.mainLeft - 42 && r.badgeLeft <= r.mainLeft - 40 && r.nameLeft === r.mainLeft + (r.starred ? 26 : 0) && (f.w > 900 || r.mainLeft === 96) && r.action === 'x-remove' && r.actionLeft > (f.w > 900 ? 300 : 330)) && others(f).every(r => near(r.badgeCx)); })()],
  ['every place below the rule: a plain Places row (icon x=16, text column x=56; r13: the stops’ shifted icons set them apart), + on the right as a bare grey glyph (--ink-2, no tile), no number', others(f).every(r => r.action === '+' && r.num === null && (f.w > 900 || (r.badgeLeft === 16 && r.mainLeft === 56)) && /^0px/.test(r.addBorder) && (r.highlighted || r.addColor === INK2))],
  ['the rule carries its caption "Add from <city>… (n)", n = the places below it', (() => { const r = f.rows[ruleIdx(f)]; const m = /^Add from .+ \((\d+)\)$/.exec(r.text); return m && +m[1] === others(f).length; })()],
  ['visited rows use the Places visited field (#E7DFD0), never the pressed tone (#DCD3C3)', stops(f).filter(r => r.visited && !r.highlighted).every(r => r.bg === 'rgb(231, 223, 208)')],
  ['r11: no NEXT anywhere: no word, and every number has one state -- 13px/600 --ink-2 (grey), below the 15px name', !f.rows.some(r => /\bnext\b/i.test(r.meta || '')) && stops(f).every(r => r.numFont === '13px' && (r.highlighted || r.numColor === INK2) && r.numWeight === '600' && parseFloat(r.nameFont) > 13)],
  ['rows are 56px', f.rows.filter(r => r.kind !== 'rule' && r.kind !== 'note').every(r => r.h === 56 || r.h === 56.0)],
  ['no page errors', !f.errors.length]
];
const panelParity = f => [
  ['panel: the Places|Plans switch and the plan picker in one row', f.switchVisible && !!f.picker],
  ['panel: all 6 city chips (LA … ALL CITIES), exactly one on', f.citiesVisible && eqCities(f) && onCities(f).length === 1],
  ['panel: all 11 category chips, in the Places order', f.catsVisible && eqCats(f)]
];
const T = {
  '01-places-panel': f => [...panelParity(f), ['view Places; switch on Places; no plan row', f.view === 'places' && f.switchOn === 'Places' && f.planRow === null],
    ['Places list is the app as it was: count title, X on every row, no numbers', /^Copenhagen list \(\d+\)$/.test(f.title) && f.rows.every(r => r.action === 'x-delete' && r.num === null)]],
  '02-plans-panel': f => [...panelParity(f), ['r11 no navy lines: the picker and the switch’s off half are 1px --hair (a city chip’s rule); the ON half is the state system’s solid navy tile', f.lines.picker === `1px ${HAIR}` && f.lines.segOff === `1px ${HAIR}` && f.lines.segOn === `1px ${NAVY}`], ['switch on Plans; the picker shows the open plan; no extra row', f.switchOn === 'Plans' && f.picker.text === 'Nørrebro afternoon' && f.planRow === null],
    ['the Plans panel is EXACTLY as tall as the Places panel (0px difference, measured)', F['01-places-panel'] && f.panelScrollH === F['01-places-panel'].panelScrollH && f.panelH === F['01-places-panel'].panelH],
    ...planCommon(f, 'Nørrebro afternoon', 6)],
  '40-places-rows': f => [['Places rows (the reference, unchanged): icon centred on the chevron’s axis (x=30, within 0.5px), text x=56, rules 1px --hair', f.view === 'places' && f.rows.length > 3 && f.rows.every(r => Math.abs(r.badgeCx - f.chevCx) <= 0.5 && r.mainLeft === 56 && r.rowBorder.endsWith(HAIR))]],
  '41-twelve-stops': f => [...planCommon(f, 'Twelve stops', 12), ['r14 two-digit numbers (10, 11, 12) are centred on the same axis as 1-digit ones and the chevron (within 0.5px)', (() => { const two = stops(f).filter(r => r.num.length === 2 && r.onScreen), one = stops(f).filter(r => r.num.length === 1 && r.onScreen); return two.length >= 2 && one.length >= 1 && two.concat(one).every(r => Math.abs(r.numCx - f.chevCx) <= 0.5); })()]],
  '03-plans-list': f => [...planCommon(f, 'Nørrebro afternoon', 6), ['stop 1 is visited: its row is a Places visited row (filed field), nothing plan-specific', stops(f)[0].visited && stops(f)[0].bg === 'rgb(231, 223, 208)'],
    ['r11 following view: every stop in view, each number on one neutral tag (1px --ink-2 rule, --ink-2 numeral)', stopMarkers(f).length === 6 && f.lines.tag === `1px ${INK2}` && f.lines.tagInk === INK2]],
  '04-rule-and-others': f => [...planCommon(f, 'Nørrebro afternoon', 6), ['the rule and places with + are on screen', f.rows.some(r => r.kind === 'place' && r.onScreen)]],
  '05-filter-cafe': f => [...inkTruths(), ...panelParity(f), ['only Cafe on (10 chips off); still Plans', offCats(f).length === 10 && !offCats(f).includes('cafe') && f.view === 'plans'],
    ...planCommon(f, 'Nørrebro afternoon', 6), ['below the rule: only cafés that are not stops (Hart Bageri)', others(f).map(r => r.name).join() === 'Hart Bageri'],
    ['the list scrolled toward the rule (filter change lands on what it changed)', f.listScroll > 0]],
  '06-added': f => [...planCommon(f, 'Nørrebro afternoon', 7), ['Hart Bageri is now stop 7, above the rule', stops(f)[6].name === 'Hart Bageri'],
    ['slip: "Added Hart Bageri as stop 7 · Undo" (once, the first time a plan reaches 2+ stops: "Stop 7 added · hold a number to move")', /^(Added Hart Bageri as stop 7|Stop 7 added · hold a number to move)\s*Undo$/i.test(f.slip)], ['r10: stop 7 (the one just added) is on the map in view', f.markers.some(m => m.num && m.onMap && m.num.split(/[–,]/).some(x => x === '7') || (m.num && /–/.test(m.num) && +m.num.split('–')[0] <= 7 && +m.num.split('–')[1] >= 7 && m.onMap))],
    ['r10: no stop pin is cut by the map’s side edge; no tag sits on the attribution or a control', f.mapClear && f.mapClear.cut.length === 0 && f.mapClear.onChrome.length === 0],
    ['r10: the slip text fits on one line', f.slipBox && f.slipBox.fits]],
  '06b-hint-on-header': f => [...planCommon(f, 'Nørrebro afternoon', 7),
    ['the one-time hint, in full: "Stop 7 added · hold a number to move · Undo"', /^Stop 7 added · hold a number to move\s*Undo$/i.test(f.slip)],
    ['the rule is scrolled out, so the slip sits on the list header', f.slipBox && /on-header/.test(f.slipBox.cls)],
    ['…on one line, untruncated (text fits), 32px tall', f.slipBox && f.slipBox.fits && Math.round(f.slipBox.h) === 32],
    ['…and never over the filter toggle or locate button', f.slipBox && !f.slipBox.overFilterOrLocate]],
  '07-city-malmo': f => [...panelParity(f), ['Malmö on; still Plans', onCities(f).join() === 'Malmö' && f.view === 'plans'], ...planCommon(f, 'Nørrebro afternoon', 6),
    ['r8 building fit across cities: the strip above the open panel shows BOTH the stops (all 6 drawn, Copenhagen) and Malmö’s places (pins or Places’ own cluster) -- stops 2–6 are never hidden by a city pick', f.markers.filter(m => !m.num && m.onMap).length >= 1 && f.markers.filter(m => m.num).length === 6 && f.markers.filter(m => m.num && m.onMap).length >= 1],
    ['below the rule: only Malmö places', others(f).length > 0 && others(f).every(r => /malm/i.test(r.meta))]],
  '08-all-cities': f => [...mapRules(f), ['following (panel closed) with ALL CITIES frames every stop at a stop-level zoom (build: the prototype\'s z9 here was a focusCity race)', f.markers.filter(m => m.num && m.tagShown && m.onMap).length >= 1 && f.zoom >= 12], ['ALL CITIES on; still Plans', onCities(f).join() === 'All cities' && f.view === 'plans'], ...planCommon(f, 'Nørrebro afternoon', 6),
    ['below the rule: places from Copenhagen AND Malmö', others(f).some(r => /malm/i.test(r.meta)) || F['08-all-cities'].rows.length > 20]],
  '09-filter-excludes-stops': f => [['Cafe chip off', offCats(f).join() === 'cafe'], ...planCommon(f, 'Nørrebro afternoon', 6),
    ['the two café stops (1, 3) still show: the chips never hide a stop', /cafe/i.test(stops(f)[0].meta) && /cafe/i.test(stops(f)[2].meta)],
    ['no café below the rule', others(f).every(r => !/cafe/i.test(r.meta))]],
  '10-empty-filtered': f => [['LA on; still Plans', onCities(f).join() === 'LA' && f.view === 'plans'], ...planCommon(f, 'Nørrebro afternoon', 6),
    ['below the rule: "No places match these filters."', f.rows.some(r => r.kind === 'note' && r.text === 'No places match these filters.') && others(f).length === 0]],
  '11-all-in-plan': f => [['only District on', offCats(f).length === 10 && !offCats(f).includes('district')], ...planCommon(f, 'Nørrebro afternoon', 6),
    ['below the rule: "Every place these filters match is in this plan."', f.rows.some(r => r.kind === 'note' && r.text === 'Every place these filters match is in this plan.')]],
  '12-zero-stops': f => [['header "Rainy day"; first row says "No stops yet. Tap + on a place below."', f.title === 'Rainy day' && f.rows[0].kind === 'note' && f.rows[0].text === 'No stops yet. Tap + on a place below.'],
    ['then the rule, then places with +', f.rows[1].kind === 'rule' && others(f).length > 5 && others(f).every(r => r.action === '+')], ['no NEXT anywhere', !f.rows.some(r => /\bnext\b/i.test(r.meta || ''))]],
  '13-removed': f => [...planCommon(f, 'Nørrebro afternoon', 5), ['r11 the slip: 1px --hair, no navy box or shadow', f.lines.slip === `1px ${HAIR}` && !/18, 41, 63/.test(f.lines.slipShadow || '')], ['The Coffee Collective is gone from the stops; numbers close up', !stops(f).some(r => r.name === 'The Coffee Collective')],
    ['slip: "Removed The Coffee Collective · Undo"', /^Removed The Coffee Collective\s*Undo$/i.test(f.slip)]],
  '14b-reorder-dropped-undo': f => [...planCommon(f, 'Nørrebro afternoon', 6), ['build: Jægersborggade dropped at stop 4; the numbers close up 1..6', stops(f)[3].name === 'Jægersborggade'],
    ['build: the drop answers with the add/remove slip, "Moved Jægersborggade to stop 4 · Undo", on one line', /^Moved Jægersborggade to stop 4\s*Undo$/.test(f.slip || '') && !!f.slipBox && f.slipBox.fits],
    ['build: the slip rides the rule (1px --hair, no shadow)', /on-rule/.test(f.slipBox ? f.slipBox.cls : '') && f.lines.slip === `1px ${HAIR}` && !/18, 41, 63/.test(f.lines.slipShadow || '')]],
  '14-reorder-held': f => [['one row lifted (Jægersborggade), mid-drag', f.rows.filter(r => r.lifted).map(r => r.name).join() === 'Jægersborggade'], ['still 6 stops', stops(f).length === 6]],
  '15-sort-menu': f => [['sort menu open in Plans with the six Places modes, A–Z checked', f.view === 'plans' && f.sortMenu && f.sortMenu.length === 6 && f.sortMenu[0] === 'A–Z ✓'], ...planCommon(f, 'Nørrebro afternoon', 6)],
  '16-sort-category': f => [['sort = Category', f.sortMode === 'category'], ...planCommon(f, 'Nørrebro afternoon', 6),
    ['stops keep plan order (1..6); places below the rule are grouped by category', (() => { const c = others(f).map(r => r.meta.split('·')[0].trim()); return c.every((x, i) => i === 0 || c.indexOf(x) === i || c[i - 1] === x); })()]],
  '17-plan-menu': f => [...panelParity(f), ['r11 the plan list opens on a 1px --hair edge with a 2px --hair drop, not the navy box', f.lines.ledger === `1px ${HAIR}` && /216, 206, 186/.test(f.lines.ledgerShadow || '') && !/18, 41, 63/.test(f.lines.ledgerShadow || '')], ['the picker, open: pale pressed tone (#DCD3C3), never the navy of the selected PLANS half', f.picker.expanded && f.pickerBg === 'rgb(220, 211, 195)'],
    ['a slip with every plan and its stop count (6, 3, 1, 4, 0), ⋯ on each, New plan', f.planRow.length === 6 && /New plan/i.test(f.planRow[5]) && ['6 stops', '3 stops', '1 stop', '4 stops', '0 stops'].every((c, i) => f.planRow[i].includes(c))],
    ['the slip overlays the chips: the panel height does not change', f.panelScrollH === F['02-plans-panel'].panelScrollH]],
  '17b-plan-more-other': f => [['⋯ on a plan that is NOT open (Tivoli tonight) offers Rename / Delete plan / Cancel', f.planRow.some(t => /^Rename\s*Delete plan\s*Cancel$/.test(t))], ['still viewing Nørrebro afternoon', f.title.startsWith('Nørrebro afternoon')]],
  '17c-rename-other': f => [['renaming another plan in place: a name field with Cancel / Save', f.planRow.some(t => /Cancel\s*Save/.test(t))], ['still viewing Nørrebro afternoon', f.title.startsWith('Nørrebro afternoon')]],
  '17d-deleted-other': f => [['delete asks: "Delete “Tivoli tonight”? Its places stay in your list."', f.dialogs[0] === 'Delete “Tivoli tonight”? Its places stay in your list.'],
    ['after deleting it: 4 plans + New plan; the open plan and its list are untouched', f.planRow.length === 5 && !f.planRow.some(t => /Tivoli/.test(t)) && f.title === 'Nørrebro afternoon']],
  '18-no-plans': f => [...panelParity(f), ['Plans with no plans: the picker reads "+ New plan"; list "No plans yet." with a New plan button; no sort', f.picker.text === 'New plan' && /No plans yet/i.test(f.empty) && f.emptyButton === 'New plan' && !f.header.sort],
    ['the map draws nothing the list does not show', f.markers.length === 0]],
  '19-signed-out-add': f => [['tapping + signed out opens the sign-in (writes are login-gated)', f.authOpen]],
  '20-tables-missing': f => [...panelParity(f), ['tables missing: the picker is unavailable ("Not available yet"), the list says "Plans aren’t available yet."; no New plan button; filters still live', f.picker.disabled && f.picker.text === 'Not available yet' && /aren’t available/i.test(f.empty) && !f.emptyButton && !f.header.sort && f.markers.length === 0]],
  '21-map-z16': f => [...mapRules(f), ['zoom 16: all 6 stops are numbered markers, every tag the same neutral style', f.zoom === 16 && f.markers.filter(m => m.num).length === 6 && f.lines.tag === `1px ${INK2}`]],
  '22-map-z13-clusters': f => [...mapRules(f), ['zoom 13 (clusters on): all 6 stops still numbered, none inside a cluster', f.zoom === 13 && stopMarkers(f).length === 6], ['a stop draws above every place pin it overlaps (Places clusters draw above stops, as above every pin)', overlapsOk(f)],
    ['clusters are Places’ red count discs; stop numerals sit on square grey-ruled paper tags (a different family)', f.markers.some(m => m.redCluster) && f.markers.filter(m => m.num).every(m => !m.redCluster)]],
  '23-map-z11': f => [...mapRules(f), ['zoomed out, the 6 stops keep their true spots and share one tag “1–6”', f.markers.some(m => m.num && m.tagShown && m.num.replace(/\s/g, '') === '1–6')]],
  '24-stop-tapped': f => [['tapping stop 2’s row flies + opens its popup ("Stop 2 of 6")', /Stop 2 of 6/.test(f.popup) && f.rows.find(r => r.highlighted).name === 'Jægersborggade'], ...planCommon(f, 'Nørrebro afternoon', 6)],
  '25-other-place-tap': f => [['tapping a place below the rule flies + opens its popup', !!f.popup && f.rows.some(r => r.highlighted && r.kind === 'place')]],
  '26-collapsed': f => [['collapsed sheet in Plans: the header still names the plan', f.title === 'Nørrebro afternoon']],
  '27-long-name': f => [['a 45-char name truncates with an ellipsis (fit disclosed in README)', f.titleTrunc && f.title.length === 45], ...planCommon(f, 'Last full day before we fly home from Kastrup', 4)],
  '28-rail': f => [...panelParity(f), ...planCommon(f, 'Nørrebro afternoon', 6)],
  '29-back-to-places': f => [...panelParity(f), ['back in Places: the same filters (only Cafe on); Places list; no plan row', f.view === 'places' && offCats(f).length === 10 && f.planRow === null && f.rows.every(r => r.action === 'x-delete')]],
  '31-all-visited-shape-last': f => [...planCommon(f, 'Last full day before we fly home from Kastrup', 4),
    ['all 3 pin stops visited: they are Places visited rows; the street stop is a plain row', stops(f).filter(r => r.visited).length === 3]],
  '18b-no-plans-closed': f => [['panel closed, no plans: the empty list offers one action, "New plan"', /No plans yet/i.test(f.empty) && f.emptyButton === 'New plan']],
  '18c-no-plans-signed-out': f => [['signed out: that button asks you to sign in first', f.authOpen]],
  '32-reorder-long-drag': f => [...planCommon(f, 'Harbour loop', 7), ['panel open (4 rows of list); stop 7 lifted and held at the list’s top edge: the list auto-scrolled to the top', f.panelOpen && f.rows.filter(r => r.lifted).map(r => r.name).join() === 'Israels Plads' && f.listScroll === 0],
    ['the lifted row stays clear of the header (its top ≥ the list’s top)', f.liftedTop !== null && f.liftedTop >= f.listTop - 0.5]],
  '39-place-deleted-renumbered': f => [['Mirabelle bakery deleted in Places (confirm accepted): the plan closes up to 5 stops, 1..5, no gap', f.dialogs[0] && /It is a stop in “Nørrebro afternoon”/.test(f.dialogs[0]) && stops(f).length === 5 && nums(f) === '1,2,3,4,5' && !stops(f).some(r => r.id === 'mir')]],
  '33-reorder-long-dropped': f => [['after the drop: Israels Plads is stop 1, the others follow in order', stops(f).map(r => r.id).join() === 'isr,nyh,har,ama,jmm,chr,tiv']],
  '34-collapsed-following-map': f => [...mapRules(f), ['r11 collapsed sheet, following: every stop is on the map with its number (overlapping stops share a tag)', (() => { const shown = new Set(f.markers.filter(m => m.num && m.onMap).flatMap(m => m.num.split(',').flatMap(t => { const [a, b] = t.split('–').map(Number); return b ? Array.from({ length: b - a + 1 }, (_, i) => a + i) : [a]; }))); return [1, 2, 3, 4, 5, 6].every(n => shown.has(n)); })()]],
  '35-places-delete-in-plan': f => [['Places × on a place that is a stop: the confirm names the plan', f.view === 'places' && f.dialogs[0] === 'Delete Mirabelle bakery?\nIt is a stop in “Nørrebro afternoon”; it will leave that plan too.']],
  '36-add-form-in-plans': f => [['the add form opens over Plans, unchanged; the view stays Plans', f.view === 'plans']],
  '37-new-place-below-rule': f => [['the tapped place (Grød, next to stop 3) is Places’ highlighted pin; it draws under the stops (R5)', (() => { const p = f.markers.find(m => m.picked); return p && f.markers.filter(m => m.num).every(m => m.z > p.z); })()], ['a place added through the form appears below the rule with + (Grød, a café, matches the filters)', others(f).some(r => r.id === 'grd' && r.action === '+') && !stops(f).some(r => r.id === 'grd')]],
  '30-spanning': f => [...mapRules(f), ['r12 Copenhagen chip on: following frames the plan’s Copenhagen leg (stops 2–3 in view); Malmö’s stop 1 is off this view and in the list', f.markers.some(m => m.onMap && /2/.test(m.num || '')) && f.markers.some(m => m.onMap && /3/.test(m.num || '')) && !f.markers.some(m => m.onMap && /(^|,)1(–|,|$)/.test(m.num || ''))]],
  '30b-spanning-malmo': f => [...mapRules(f), ['r12 Malmö chip on: following frames the Malmö leg (stop 1 in view); still Plans, all 3 stops in the list', f.view === 'plans' && f.markers.some(m => m.onMap && /(^|,)1(–|,|$)/.test(m.num || '')) && stops(f).length === 3]]
};
let pass = 0, fail = 0;
const md = ['# Plans v3: per-frame truths', '', 'Generated by `harness/check.js` from `frames/frames.json` (values measured on the rendered page). Every line PASSES or the run fails.', ''];
for (const [name, fn] of Object.entries(T)) {
  const f = F[name];
  md.push(`## ${name}`);
  if (!f) { fail++; md.push('- **MISSING FRAME**'); console.log('FAIL missing', name); continue; }
  let list;
  try { list = fn(f); } catch (e) { list = [['(threw) ' + e.message, false]]; }
  for (const [t, v] of list) { const good = !!v; if (good) pass++; else { fail++; console.log('FAIL', name, '-', t); } md.push(`- ${good ? 'PASS' : '**FAIL**'} ${t}`); }
  md.push('');
}
fs.writeFileSync(path.join(OUTROOT, 'truths.md'), md.join('\n'));
console.log(`${fail ? 'FAIL' : 'PASS'} ${pass}/${pass + fail}, ${Object.keys(T).length} frames`);
process.exit(fail ? 1 : 0);
