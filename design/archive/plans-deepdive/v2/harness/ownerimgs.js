// Owner-readable images: one step per image, a phone screen (390x844) at 2x with a large caption band
// embedded below it. Real index.html + proto.js (option X, as chosen by the owner).
// usage: REPO=<worktree> OUT=<dir> node ownerimgs.js
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const { open } = require('./shot.js');
const { seed, fitNorrebro, openPanel, scrollListTo, scrollPanelTo, wait, dragGrip } = require('./frames.js');
const DIR = (process.env.OUT || __dirname + '/out') + '/owner-images';
fs.mkdirSync(DIR, { recursive: true });
const press = (p, sel) => p.evaluate(s => { const e = document.querySelector(s); e.style.background = 'var(--state-press)'; }, sel);   // a finger on it (the state system's pressed tile)
const collapse = async p => { await p.click('#collapseBtn'); await wait(p, 600); };
const zoomShape = p => p.evaluate(() => map.setView([55.6899, 12.5577], 16, { animate: false }));

const STEPS = [
  ['owner-01-places-panel', 'The Places side of the filter panel: unchanged, with every city and all 11 categories.',
    async p => { await seed(p, { view: 'places' }); await fitNorrebro(p); await openPanel(p); }],
  ['owner-02-plans-panel', 'The Plans side of the same panel: just your plans. City and category chips are hidden because a plan always shows all of its stops.',
    async p => { await seed(p, {}); await openPanel(p); }],
  ['owner-03-following', 'Following a plan. Stops are in order, and the solid 2 is your next stop (in the list and on the map). “Edit stops” is the first row.',
    async p => { await seed(p, {}); }],
  ['owner-04-tap-edit-stops', 'Step 1: tap “Edit stops”.',
    async p => { await seed(p, {}); await press(p, '.add-row'); }],
  ['owner-05-edit-stops-on-top', 'Step 2: Edit mode. Your stops are on top, in order, each with a ≡ to drag. Below a line: every other place.',
    async p => { await seed(p, { adding: true }); await fitNorrebro(p); }],
  ['owner-06-add-a-place', 'Step 3: tap + on any place to add it. Torvehallerne becomes stop 7, at the end of your stops.',
    async p => { await seed(p, { adding: true }); await fitNorrebro(p); await p.click('[data-id="tor"] .rowslot'); await wait(p, 200); await scrollListTo(p, '[data-id="tor"]', 2); }],
  ['owner-07-remove-with-undo', 'Step 4: tap a stop’s number to take it out. “Undo” shows for 6 seconds.',
    async p => { await seed(p, { adding: true }); await fitNorrebro(p); await p.click('[data-id="cof"] .rowslot:not(.grip)'); await wait(p, 300); }],
  ['owner-08-hold-and-drag', 'Step 5: to reorder, hold ≡ for a moment, then drag. Here, Assistens Cemetery is moving up to stop 2.',
    async p => { await seed(p, { adding: true }); await fitNorrebro(p); await dragGrip(p, '[data-id="ass"] .grip', -112, false); }],
  ['owner-09-tap-done', 'Step 6: tap DONE (top right) when you’re finished.',
    async p => { await seed(p, { adding: true }); await fitNorrebro(p); await press(p, '#doneBtn'); }],
  ['owner-10-back-to-following', 'Step 7: you’re back to following your plan, and the solid number is still your next stop.',
    async p => { await seed(p, { adding: true }); await fitNorrebro(p); await p.click('#doneBtn'); await wait(p, 300); }],
  ['owner-11-map-numbers-next-solid', 'Map while following: every stop shows its number. Only your next stop (2) is solid.',
    async p => { await seed(p, {}); await collapse(p); }],
  ['owner-12-map-numbers-while-editing', 'Map while editing: stops show their numbers (none is solid), and every other place keeps its usual icon.',
    async p => { await seed(p, { adding: true }); await fitNorrebro(p); await collapse(p); }],
  ['owner-13-map-district-diamond', 'A district or street stop has no pin, so its number sits in a diamond in the middle of the area (here, stop 5).',
    async p => { await seed(p, {}); await zoomShape(p); await wait(p, 300); await collapse(p); }],
  ['owner-14-plan-list-and-actions', 'The Plans panel: tap a plan to open it; “New plan” makes one. The ⋯ on the current plan opens Rename and Delete plan, right in the row.',
    async p => { await seed(p, {}); await openPanel(p); await p.click('.plan-opt .more'); }],
  ['owner-15-delete-confirm', 'Delete plan asks first (your phone’s own confirm box). The places stay in your list.',
    async p => { await seed(p, {}); await openPanel(p); await p.evaluate(() => window.__plans.nativeConfirm('Delete “Nørrebro afternoon”? Its places stay in your list.')); }],
];

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const only = process.argv.slice(2);
  for (const [name, caption, run] of STEPS) {
    if (only.length && !only.includes(name)) continue;
    const { ctx, page } = await open(b, { dsf: 2 });
    await run(page);
    await wait(page, name.includes('drag') ? 0 : 600);
    const shot = (await page.screenshot()).toString('base64');
    await ctx.close();
    const c = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    const pg = await c.newPage();
    await pg.setContent(`<!doctype html><html><head><style>
      body { margin: 0; width: 390px; background: #F2EBDD; font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; }
      img { display: block; width: 390px; height: 844px; }
      .cap { padding: 16px 18px 22px; background: #12293F; color: #F2EBDD; font-size: 21px; line-height: 28px; font-weight: 600; }
      .n { display: block; font-size: 14px; line-height: 18px; letter-spacing: .08em; opacity: .75; margin-bottom: 6px; font-weight: 700; }
    </style></head><body><img src="data:image/png;base64,${shot}"><div class="cap"><span class="n">${name.slice(6, 8)} OF ${String(STEPS.length).padStart(2, '0')}</span>${caption}</div></body></html>`);
    await pg.waitForTimeout(200);
    await pg.screenshot({ path: `${DIR}/${name}.png`, fullPage: true });
    await c.close();
    console.log(name);
  }
  await b.close();
})();
