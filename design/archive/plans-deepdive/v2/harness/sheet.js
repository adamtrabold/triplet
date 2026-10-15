// Contact sheets at 1x. Each open-panel frame is followed by its full panel strip ("…-panel.png").
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const OUT = process.env.OUT || __dirname + '/out';
const C = {
  '15-plans-panel-no-chips': 'START HERE. Plans-side panel: the switch and your plans ONLY. The city and category chips are removed on purpose: a plan always shows all its stops, so those filters would do nothing here. Compare with the next two.',
  '02-panel-places': 'Places-side panel (unchanged): the switch plus EVERY real control, i.e. all cities and all 11 categories.',
  '15a-places-panel-cafe-off': 'Places-side panel scrolled to the categories, with Cafe turned off (dashed).',
  '01-places': 'Places (default): today’s app, unchanged.',
  '03-panel-no-plans': 'No plans yet: the Plans side has New plan, and the list says “No plans yet.”',
  '04-create-name': 'Create: New plan becomes a name field, with Cancel or Create.',
  '05-add-empty': 'After Create you’re in Edit mode. The header is the plan’s name, with the word DONE at the right. Every place has +.',
  '06-add-three': 'Edit (X, the owner’s choice): the stops lead, then a line, then the rest. + appends. A stop shows the “in plan” tile and a quiet mark on the row’s leading edge.',
  '07-add-shape': 'Districts and streets are in the same list: Elmegade quarter becomes stop 5.',
  '28-zero-stops': 'Create, then ✓ with nothing added: Edit stops, then “No stops yet”.',
  '09-follow': 'Plans (read-only). Edit stops is the first row. Only NEXT (2) is filled, in the list AND on the map (pin 2). Every stop is numbered: pins in their ring, the district (5) in a diamond.',
  '10-follow-end': 'The end of a plan: its last stops. There’s nothing to scroll to for editing; Edit stops is at the top.',
  '32-edit-opens-places-order': 'Option Y (not chosen; kept for the record): Edit in the Places order (A–Z), with stops marked inline.',
  '14-edit-plan-order': 'Option Y only (not chosen): ⇅ › Plan order puts the stops first with grips.',
  '13-sort-menu': 'Option Y only (not chosen): Edit’s ⇅ with Plan order as an item.',
  '08-remove-undo': 'Edit (X): tap a stop’s number at the top of the list to take it out. Undo lasts 6s.',
  '33-tile-pressed': 'Finger down on a stop number: it turns to −. Slide off to cancel.',
  '34-undo-two': 'Two removals inside the window: “2 removed · Undo”.',
  '36-undo-after-done': 'Removed, then ✓: Undo is still there inside its window.',
  '11-reorder': 'Hold the grip 250ms to arm, then drag (real CDP touch). A stroke that moves first scrolls.',
  '11b-reorder-drop': 'After the drop, Assistens is stop 2.',
  '12-popup': 'Row tap in Plans: fly, highlight (the pin keeps its “2”), popup “· Stop 2 of 6” (information only).',
  '16-plan-menu': '⋯ on the current plan: Rename · Delete plan · Cancel, inline.',
  '17-rename': 'Rename: an inline field, with Cancel or Save.',
  '18-delete-confirm': 'Delete asks first. This is the app’s native confirm(), drawn as a stand-in.',
  '19-switch-spanning': 'A plan spanning Copenhagen and Malmö shows whole. Zoomed out (below 12), so no numbers; a cluster keeps its count.',
  '27-exit-places': 'Exit: tap Places. It’s the Copenhagen list again, and the city never changed.',
  '24-clusters': 'Below zoom 14 stops cluster the same way pins do. The cluster shows its count, never a stop number; solo pins keep their numbers.',
  '31-shape-popup': 'A shape stop: its diamond carries “5”, and its popup reads “· Stop 5 of 6”.',
  '25-approx-highlight': 'An approximate stop keeps its dashed rim, with its number and popup.',
  '37-long-names': 'Long place names: “Keramiker Inge Vincents” (23 characters) fits. Outline tiles, filled NEXT, muted stamp.',
  '20-long-name': 'A long plan name truncates (about 24 characters fit in Plans, 20 in Edit). The panel row truncates too.',
  '21-one-stop': 'A one-stop plan: its only stop is NEXT.',
  '22-collapsed': 'Collapsed sheet: the header still names the plan.',
  '35-undo-collapsed': 'Edit, a removal, then collapse: Undo docks above the header.',
  '29-add-collapsed': 'Edit mode, collapsed: collapse works, and the ink ✓ keeps locate’s slot.',
  '23-signed-out': 'Signed out: plans are readable. Edit stops opens sign-in (proposed copy).',
  'X1-edit-opens': 'OPTION X (the CD’s): Edit stops opens with the plan’s stops FIRST, in order, with grips. The map shows every stop’s number.',
  'X2-edit-rule': 'X, scrolled: a plain rule (no label) ends the stops; everything else follows A–Z with +.',
  'X3-remove': 'X: remove from the top of the list: tap the number, then Undo.',
  'X4-reorder': 'X: hold a grip and drag straight away (no sort step).',
  '26-rail': '≥900px rail in Plans: the panel beside it shows switch + plans only.',
  '30-add-rail': '≥900px rail, Edit mode: the ✓ in the same slot, full plan name, stops numbered on the map.',
};
const GROUPS = {
  'contact-sheet-1-lifecycle': ['15-plans-panel-no-chips', '02-panel-places', '15a-places-panel-cafe-off', '01-places', '03-panel-no-plans', '04-create-name', '05-add-empty', '06-add-three', '07-add-shape', '28-zero-stops', '09-follow', '10-follow-end', '32-edit-opens-places-order', '13-sort-menu', '14-edit-plan-order', '08-remove-undo', '33-tile-pressed', '34-undo-two', '36-undo-after-done', '11-reorder', '11b-reorder-drop', '12-popup', '16-plan-menu', '17-rename', '18-delete-confirm', '19-switch-spanning', '27-exit-places'],
  'contact-sheet-2-rules-states': ['24-clusters', '31-shape-popup', '25-approx-highlight', '37-long-names', '20-long-name', '21-one-stop', '22-collapsed', '35-undo-collapsed', '29-add-collapsed', '23-signed-out', '26-rail', '30-add-rail'],
};
const img = f => 'data:image/png;base64,' + fs.readFileSync(`${OUT}/${f}.png`).toString('base64');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [name, ids] of Object.entries(GROUPS)) {
    const cells = ids.flatMap(id => {
      const main = `<div class="cell${id.includes('rail') ? ' wide' : ''}"><img src="${img(id)}"><div class="c"><b>${id.replace(/^(\d+)-/, '$1 · ').replace(/-/g, ' ')}</b> ${C[id]}</div></div>`;
      const strip = fs.existsSync(`${OUT}/${id}-panel.png`) ? `<div class="cell strip"><img src="${img(id + '-panel')}"><div class="c"><b>${id.slice(0, 2)} · whole panel</b> The same panel unrolled: every control it holds.</div></div>` : '';
      return [main, strip];
    }).join('');
    const html = `<!doctype html><html><head><style>
      body { margin: 0; padding: 24px; background: #E9E1D1; font-family: Arial, sans-serif; color: #1A1A18; width: ${name.includes("decision") ? 4 * 390 + 3 * 24 : 5 * 390 + 4 * 24}px; }
      h1 { font: 800 22px/28px Arial; letter-spacing: .06em; text-transform: uppercase; color: #12293F; margin: 0 0 4px; }
      p { margin: 0 0 18px; font: 13px/18px Arial; color: #5A564C; }
      .grid { display: flex; flex-wrap: wrap; gap: 28px 24px; align-items: flex-start; }
      .cell { width: 390px; } .cell.wide { width: 1280px; }
      .cell img { display: block; outline: 1px solid #C9BFA9; }
      .strip img { outline: 1px dashed #5A564C; }
      .c { font: 12px/16px Arial; margin-top: 6px; } .c b { color: #12293F; text-transform: uppercase; font-size: 11px; letter-spacing: .04em; margin-right: 4px; }
    </style></head><body><h1>Plans v2 · ${name.includes('lifecycle') ? 'the panel first, then the lifecycle' : name.includes('decision') ? 'owner decision: how Edit opens (row 1: Y, current · row 2: X, the CD’s)' : 'rules, states and map'}</h1>
    ${name.includes('decision') ? '<p><b>Y</b>: add 5 taps + scroll · remove 3 + scroll (or 5 via ⇅) · reorder 5. One list in Places’ own order. <b>X</b>: add 5 + scroll · remove 3 · reorder 3. Stops first, then a rule, then everything else: faster, but it puts the plan and the places in one list in Edit.</p>' : ''}
    <p>Real index.html (origin/main ca7e330) + Copenhagen stub + proto.js, 390×844 at 1x (rail 1280×800). Flat map-tile stand-in. Dashed outline = the open panel unrolled to full length.</p>
    <div class="grid">${cells}</div></body></html>`;
    const p = await b.newPage({ viewport: { width: (name.includes("decision") ? 4 * 390 + 3 * 24 : 5 * 390 + 4 * 24) + 48, height: 800 }, deviceScaleFactor: 1 });
    await p.setContent(html); await p.waitForTimeout(300);
    await p.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
    await p.close();
    console.log(name);
  }
  await b.close();
})();
