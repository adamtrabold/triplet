// Owner sheets for a phone: one vertical filmstrip per option, frames at 1x, large plain captions.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const OUT = process.env.OUT || __dirname + '/out';
const img = f => 'data:image/png;base64,' + fs.readFileSync(`${OUT}/${f}.png`).toString('base64');
const SHEETS = {
  'owner-option-X': {
    title: 'Option X: your stops on top while you edit',
    lead: 'Remove: 1 tap. Reorder: just drag. But while you edit, your stops and the rest of your places share one list, split by a line.',
    steps: [
      ['X1-edit-opens', 'Tap “Edit stops”. Your 6 stops come first, in order. Below a line: every other place.'],
      ['Xa-add', 'Tap + on any place to add it. It becomes stop 7, at the end of your stops.'],
      ['X3-remove', 'Tap a stop’s number to take it out. “Undo” shows for 6 seconds.'],
      ['X4-reorder', 'To reorder, hold ≡ for a moment, then drag.'],
      ['Xd-done-follow', 'Tap DONE. You’re back to following your plan; the solid number is your next stop.'],
    ],
  },
  'owner-option-Y': {
    title: 'Option Y: your usual list while you edit',
    lead: 'One list, in your usual order (A–Z). Reordering switches to stops-first, via ⇅ › Plan order. Removing means finding the stop in the list.',
    steps: [
      ['32-edit-opens-places-order', 'Tap “Edit stops”. You get your usual places list (A–Z). Your stops show their number.'],
      ['Ya-add', 'Tap + on any place to add it. It becomes stop 7.'],
      ['Yb-remove', 'To take a stop out, scroll to it and tap its number. “Undo” shows for 6 seconds.'],
      ['Yc-sort-menu', 'To reorder, first tap ⇅ and pick “Plan order”…'],
      ['Yd-reorder', '…now your stops come first. Hold ≡ for a moment, then drag.'],
      ['Ye-done-follow', 'Tap DONE. You’re back to following your plan; the solid number is your next stop.'],
    ],
  },
};
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [name, sh] of Object.entries(SHEETS)) {
    const html = `<!doctype html><html><head><style>
      body { margin: 0; padding: 20px 15px 28px; width: 390px; background: #E9E1D1; font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; color: #1A1A18; }
      h1 { font-size: 22px; line-height: 27px; margin: 0 0 8px; color: #12293F; }
      .lead { font-size: 17px; line-height: 23px; margin: 0 0 20px; }
      .step { margin: 0 0 26px; }
      .n { font-size: 15px; font-weight: 700; color: #A8400C; letter-spacing: .04em; margin-bottom: 6px; }
      .step img { display: block; width: 390px; height: 844px; outline: 1px solid #C9BFA9; }
      .c { font-size: 18px; line-height: 24px; margin-top: 10px; }
    </style></head><body><h1>${sh.title}</h1><p class="lead">${sh.lead}</p>
    ${sh.steps.map(([f, c], i) => `<div class="step"><div class="n">STEP ${i + 1} OF ${sh.steps.length}</div><img src="${img(f)}"><div class="c">${c}</div></div>`).join('')}
    </body></html>`;
    const p = await b.newPage({ viewport: { width: 420, height: 900 }, deviceScaleFactor: 1 });
    await p.setContent(html); await p.waitForTimeout(300);
    await p.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
    await p.close(); console.log(name);
  }
  await b.close();
})();
