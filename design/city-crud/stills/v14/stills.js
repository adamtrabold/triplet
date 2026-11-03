// City CRUD v14 (owner: 'there should be a "move to new city" and more differentiation between remove the places too and the keep stockholm (which maybe should just be "cancel"?'). Built on v13: post-build fixes, drawn as mock layers over the BUILT index.html (952bc58).
// 1 the remove picker fits: it takes over the menu box, which unlocks and grows (upward on a phone,
//   downward on desktop) to the room there is; the held row + question pinned on top, the destinations
//   scroll, Remove-too + Keep pinned at the foot. 2 the Undo slip on two lines, destination never cut.
// 3 the empty-city note (the build's empty-section voice, shorter copy).
//   CHROME=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome node design/city-crud/stills/v14/stills.js [prefix|sheets]
const path = require('path'), fs = require('fs');
const { open, P, W } = require('../../proto/lib-cc.js');
const OUT = path.join(__dirname, 'raw');
fs.mkdirSync(OUT, { recursive: true });
const STORAGE = { 'gh.plans': '1', 'triplet.reorderHint': '1' };
// a roadtrip's worth of cities (real coordinates), so the list is long
const EXTRA = [['philadelphia', 'Philadelphia', 39.95, -75.16], ['wilmington', 'Wilmington', 39.75, -75.55], ['lewes', 'Lewes', 38.77, -75.14], ['baltimore', 'Baltimore', 39.29, -76.61],
  ['annapolis', 'Annapolis', 38.98, -76.49], ['capemay', 'Cape May', 38.94, -74.91], ['newyork', 'New York', 40.71, -74.01], ['princeton', 'Princeton', 40.35, -74.66]];
const CSS = `
  #ccPick { position: fixed; z-index: 2700; display: flex; flex-direction: column; box-sizing: border-box; background: var(--paper-raised);
    border: 1px solid var(--navy); box-shadow: 4px 4px 0 var(--navy); overflow: hidden; }
  #ccPick .head { flex: none; border-bottom: 1px solid var(--navy); }
  #ccPick .held { position: relative; height: 44px; display: flex; align-items: center; gap: var(--s2); padding: 0 var(--s3); border-bottom: 1px solid var(--hair); overflow: hidden; }
  #ccPick .held .board { position: absolute; top: 4px; bottom: 4px; right: 0; width: 132px; display: flex; align-items: center; justify-content: center; padding-left: 12px; box-sizing: border-box;
    background: var(--navy); color: var(--paper); clip-path: polygon(12px 0,100% 0,100% 100%,12px 100%,0 50%); font-family: var(--font-ui); font-stretch: 75%; font-weight: 700; font-size: 12px; letter-spacing: .12em; text-transform: uppercase; }
  #ccPick .q { padding: 10px var(--s3) 8px; font-size: 14px; line-height: 20px; font-weight: 600; color: var(--ink); background: var(--paper); }
  #ccPick .dests { flex: 1 1 auto; min-height: 0; overflow-y: auto; background: var(--paper); }
  #ccPick .dests.more { box-shadow: inset 0 -10px 10px -10px var(--scroll-shadow); }
  #ccPick .d { height: 44px; display: flex; align-items: center; gap: var(--s2); padding: 0 var(--s3); border-bottom: 1px solid var(--hair);
    font-family: var(--font-ui); font-stretch: 75%; font-weight: 700; font-size: 13px; letter-spacing: .05em; text-transform: uppercase; color: var(--navy); }
  #ccPick .d small { margin-left: auto; font-size: 11px; font-weight: 600; letter-spacing: 0; text-transform: none; font-stretch: 100%; color: var(--ink-2); }
  #ccPick .foot { flex: none; border-top: 1px solid var(--navy); background: var(--paper-raised); }
  #ccPick .f { height: 44px; display: flex; align-items: center; padding: 0 var(--s3) 0 40px; font-family: var(--font-ui); font-stretch: 75%; font-weight: 700; font-size: 13px; letter-spacing: .05em; text-transform: uppercase; }
  #ccPick .f.too { color: var(--ink-2); font-weight: 600; border-bottom: 1px solid var(--hair); }
  #ccPick .f.keep { justify-content: center; padding: 0; color: var(--navy); }
  #ccPick .find { flex: none; display: flex; align-items: center; gap: var(--s2); height: 48px; padding: 0 var(--s3); background: var(--paper-raised); border-top: 1px solid var(--hair); }
  #ccPick .find .in { flex: 1; height: 32px; display: flex; align-items: center; padding: 0 var(--s2); background: var(--paper); border-bottom: 1.5px solid var(--navy); font-size: 16px; color: var(--ink-2); }
  #ccPick .find .in.typed { color: var(--ink); border-bottom-width: 2px; }
  #ccPick .res { height: 52px; display: flex; flex-direction: column; justify-content: center; padding: 0 var(--s3) 0 40px; border-bottom: 1px solid var(--hair); }
  #ccPick .res b { font-size: 14px; line-height: 20px; font-weight: 600; color: var(--ink); }
  #ccPick .res span { font-size: 11px; line-height: 14px; color: var(--ink-2); }
  #ccPick .foot { border-top: 1px solid var(--navy); }
  #ccPick .f.too { gap: 10px; padding-left: var(--s3); color: var(--ink); font-weight: 700; border-bottom: none; background: var(--paper); }
  #ccPick .f.too svg { width: 18px; height: 18px; flex: none; color: var(--ink); }
  #ccPick .gapband { height: 8px; background: var(--paper-pressed); border-top: 1px solid var(--hair); border-bottom: 1px solid var(--navy); }
  #ccPick .f.keep { color: var(--navy); }
  /* the slip, two lines: what went, then where its places went (never cut) */
  .ccSlip { position: fixed; z-index: 2800; display: flex; align-items: stretch; box-sizing: border-box; background: var(--paper-raised); border-bottom: 1px solid var(--hair); }
  .ccSlip .tx { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; gap: 2px; padding: 0 var(--s3) 0 var(--gutter); font-family: var(--font-ui); font-stretch: 75%; text-transform: uppercase; }
  .ccSlip .l1 { font-size: 11px; line-height: 14px; font-weight: 600; letter-spacing: .1em; color: var(--ink-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ccSlip .l2 { font-size: 13px; line-height: 16px; font-weight: 700; letter-spacing: .06em; color: var(--navy); white-space: nowrap; display: flex; }
  .ccSlip .l2 .nm { flex: none; }
  .ccSlip button { all: unset; flex: none; display: flex; align-items: center; padding: 0 var(--gutter) 0 var(--s3); border-left: 1px solid var(--hair); font-family: var(--font-ui); font-stretch: 75%;
    font-weight: 700; font-size: 12px; letter-spacing: .1em; text-transform: uppercase; color: var(--navy); text-decoration: underline; text-underline-offset: 3px; }
`;
const DESTS = [['Malmö', '515 km'], ['Copenhagen', '520 km'], ['Reykjavík', '2,135 km'], ['New York', '6,320 km'], ['Princeton', '6,370 km'], ['Philadelphia', '6,420 km'],
  ['Wilmington', '6,460 km'], ['Cape May', '6,480 km'], ['Lewes', '6,520 km'], ['Annapolis', '6,550 km'], ['Baltimore', '6,560 km'], ['LA', '8,880 km']];
async function base(page, w) {
  await page.evaluate(([CSS, EXTRA]) => { const s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    EXTRA.forEach(([id, label, la, ln]) => { CITIES[id] = { label, center: [la, ln], zoom: 12, viewbox: `${ln - .1},${la - .1},${ln + .1},${la + .1}` }; });
    CC.unhideAll(); goToCity('malmo'); map.setView([57, 5], 3, { animate: false }); }, [CSS, EXTRA]); await W(2500);
}
// THE PICKER RULE (phone): the box keeps its left/width; its bottom stays where the menu's bottom was;
// it grows upward to fit, never above the top controls + 8 (82px); past that the destinations scroll.
// (desktop): it opens down from the menu's top and grows to the window's foot - 16.
const FOUND = [['Philadelphia', 'City · Pennsylvania, United States · ≈ 6,420 km'], ['Philadelphia', 'Village · New York, United States · ≈ 6,000 km'], ['Philadelphia', 'Village · Tennessee, United States · ≈ 7,300 km']];
const PICK = (desktop, FIND = false) => `(() => { const FIND = ${FIND}, FOUND = ${JSON.stringify(FOUND)}; const m = document.getElementById('titleMenu'); const r = m.getBoundingClientRect(); m.style.visibility = 'hidden';
  const w = Math.max(r.width, Math.min(innerWidth - 32, 340));
  const el = document.createElement('div'); el.id = 'ccPick';
  el.innerHTML = '<div class="head"><div class="held"><svg class="menu-ico" viewBox="0 0 24 24" style="width:16px;height:16px"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="2.5" fill="currentColor"/></svg><span class="menu-lab">Stockholm</span><span class="board">Remove</span></div>'
    + '<div class="q">Remove Stockholm. Move its 23 places to:</div>'
    + '<div class="find"><svg class="menu-ico" viewBox="0 0 24 24" style="width:16px;height:16px"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span class="in' + (FIND ? ' typed' : '') + '">' + (FIND ? 'Philadelphia<span class="cc-caret"></span>' : 'A new city…') + '</span></div></div>'
    + '<div class="dests more">' + (FIND ? FOUND.map(([n, w]) => '<div class="res"><b>' + n + '</b><span>' + w + '</span></div>').join('')
      : ${JSON.stringify(DESTS)}.map(([n, d]) => '<div class="d"><svg viewBox="0 0 16 16" width="16" height="16"><path d="M3 8h9M8.5 4.5L12 8l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' + n + '<small>≈ ' + d + '</small></div>').join('')) + '</div>'
    + '<div class="foot"><div class="f too"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/></svg>Remove Stockholm and its 23 places</div><div class="gapband"></div><div class="f keep">Cancel</div></div>';
  document.body.appendChild(el); el.style.left = r.left + 'px'; el.style.width = w + 'px';
  const content = el.querySelector('.head').offsetHeight + el.querySelector('.dests').scrollHeight + el.querySelector('.foot').offsetHeight + 2;
  if (${desktop}) { const top = r.top; el.style.top = top + 'px'; el.style.height = Math.min(content, innerHeight - top - 16) + 'px'; }
  else { const bottom = r.bottom, top = Math.max(82, bottom - content); el.style.top = top + 'px'; el.style.height = (bottom - top) + 'px'; }
  const d = el.querySelector('.dests'); d.classList.toggle('more', d.scrollHeight > d.clientHeight + 1); })()`;
const SLIP = (l1, pre, nm) => `(() => { const h = document.getElementById('locationsHeader').getBoundingClientRect();
  document.body.insertAdjacentHTML('beforeend', '<div class="ccSlip" style="left:' + h.left + 'px;top:' + h.top + 'px;width:' + h.width + 'px;height:' + h.height + 'px"><div class="tx"><span class="l1">${l1}</span><span class="l2"><span>${pre}</span><span class="nm">${nm}</span></span></div><button>Undo</button></div>'); })()`;

const FRAMES = {
  async 'P1-390-picker'(page) { await base(page); await P.tap(page, '#titleBtn'); await W(400); await page.evaluate(s => eval(s), PICK(false)); },
  async 'P2-390-new-city'(page) { await base(page); await P.tap(page, '#titleBtn'); await W(400); await page.evaluate(s => eval(s), PICK(false, true)); },
  async 'P3-375-picker'(page) { await base(page); await P.tap(page, '#titleBtn'); await W(400); await page.evaluate(s => eval(s), PICK(false)); },
  async 'P4-1280-picker'(page) { await base(page); await page.evaluate(() => document.getElementById('titleBtn').click()); await W(500); await page.evaluate(s => eval(s), PICK(true)); },
};
const SIZES = { 'P3-375-picker': [375, 667], 'P4-1280-picker': [1280, 800] };

const SHEETS = [
  ['1-picker-new-city', '1 · The picker: a new-city line under the question, and a destructive foot that looks like one', [
    ['P1-390-picker', '390 × 844', '"+ A new city…" sits pinned under the question. At the foot, "Remove Stockholm and its 23 places" with a bin, then a band, then "Cancel" on its own.'],
    ['P2-390-new-city', 'Typing a new city', 'The middle swaps your cities for real-city results. Tapping Philadelphia makes it and moves the 23 places there: still one step.'],
  ]],
  ['2-picker-small-and-desktop', '2 · Same shape at 375 × 667 and on desktop', [
    ['P3-375-picker', '375 × 667', 'The new-city line and the foot stay pinned; only the destinations scroll.'],
    ['P4-1280-picker', '1280 × 800', 'Desktop: the box runs down to the window\'s foot; here the last city (LA) scrolls just under it, and the new-city line and the foot stay pinned.'],
  ]],
];

(async () => {
  const only = process.argv[2] || '';
  const b = await P.lib.launch();
  if (only !== 'sheets') for (const [name, fn] of Object.entries(FRAMES)) {
    if (only && !name.startsWith(only)) continue;
    const [w, h] = SIZES[name] || [390, 844];
    const o = await open(b, { storage: STORAGE, w, h, dsf: w > 800 ? 2 : 3 });
    try { await fn(o.page); await W(600); await o.page.screenshot({ path: path.join(OUT, name + '.png') }); console.log('shot', name, o.errors.length ? o.errors : ''); }
    catch (e) { console.log('FAIL', name, e.message.split('\n')[0]); }
    await o.page.context().close();
  }
  const ctx = await b.newContext({ deviceScaleFactor: 3, viewport: { width: 800, height: 600 } });
  const page = await ctx.newPage();
  for (const [file, title, frames] of SHEETS) {
    if (!frames.every(([f]) => fs.existsSync(path.join(OUT, f + '.png')))) continue;
    const fw = f => f.includes('1280') ? 900 : 330;
    const FW = Math.max(...frames.map(([f]) => fw(f)));
    const cells = frames.map(([f, h, c]) => `<figure style="width:${fw(f)}px"><img style="width:${fw(f)}px" src="data:image/png;base64,${fs.readFileSync(path.join(OUT, f + '.png')).toString('base64')}"><figcaption><b>${h}</b><span>${c}</span></figcaption></figure>`).join('');
    const w = Math.max(frames.reduce((t, [f]) => t + fw(f), 0) + (frames.length + 1) * 20, 760);
    await page.setViewportSize({ width: w, height: 600 });
    await page.setContent(`<!doctype html><html><head><style>
      body { margin: 0; padding: 20px; background: #F2EBDD; font-family: -apple-system, 'Segoe UI', Roboto, sans-serif; color: #12293F; width: ${w - 40}px; }
      h1 { font-size: 22px; line-height: 28px; margin: 0 0 16px; }
      .row { display: flex; gap: 20px; align-items: flex-start; }
      figure { margin: 0; }
      img { display: block; border: 1px solid #D8CEBA; border-radius: 6px; }
      figcaption { margin-top: 10px; font-size: 16px; line-height: 21px; color: #3a3a36; }
      figcaption b { display: block; font-size: 18px; line-height: 23px; color: #12293F; margin-bottom: 2px; }
    </style></head><body><h1>${title}</h1><div class="row">${cells}</div></body></html>`);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(__dirname, file + '.png'), fullPage: true });
    console.log('sheet', file);
  }
  await b.close();
})();
