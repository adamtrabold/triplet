// City CRUD v13: post-build fixes, drawn as mock layers over the BUILT index.html (952bc58).
// 1 the remove picker fits: it takes over the menu box, which unlocks and grows (upward on a phone,
//   downward on desktop) to the room there is; the held row + question pinned on top, the destinations
//   scroll, Remove-too + Keep pinned at the foot. 2 the Undo slip on two lines, destination never cut.
// 3 the empty-city note (the build's empty-section voice, shorter copy).
//   CHROME=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome node design/city-crud/stills/v13/stills.js [prefix|sheets]
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
const PICK = desktop => `(() => { const m = document.getElementById('titleMenu'); const r = m.getBoundingClientRect(); m.style.visibility = 'hidden';
  const w = Math.max(r.width, Math.min(innerWidth - 32, 340));
  const el = document.createElement('div'); el.id = 'ccPick';
  el.innerHTML = '<div class="head"><div class="held"><svg class="menu-ico" viewBox="0 0 24 24" style="width:16px;height:16px"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="2.5" fill="currentColor"/></svg><span class="menu-lab">Stockholm</span><span class="board">Remove</span></div>'
    + '<div class="q">Remove Stockholm. Move its 23 places to:</div></div>'
    + '<div class="dests more">' + ${JSON.stringify(DESTS)}.map(([n, d]) => '<div class="d"><svg viewBox="0 0 16 16" width="16" height="16"><path d="M3 8h9M8.5 4.5L12 8l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' + n + '<small>≈ ' + d + '</small></div>').join('') + '</div>'
    + '<div class="foot"><div class="f too">Remove the 23 places too</div><div class="f keep">Keep Stockholm</div></div>';
  document.body.appendChild(el); el.style.left = r.left + 'px'; el.style.width = w + 'px';
  const content = el.querySelector('.head').offsetHeight + el.querySelector('.dests').scrollHeight + el.querySelector('.foot').offsetHeight + 2;
  if (${desktop}) { const top = r.top; el.style.top = top + 'px'; el.style.height = Math.min(content, innerHeight - top - 16) + 'px'; }
  else { const bottom = r.bottom, top = Math.max(82, bottom - content); el.style.top = top + 'px'; el.style.height = (bottom - top) + 'px'; }
  const d = el.querySelector('.dests'); d.classList.toggle('more', d.scrollHeight > d.clientHeight + 1); })()`;
const SLIP = (l1, pre, nm) => `(() => { const h = document.getElementById('locationsHeader').getBoundingClientRect();
  document.body.insertAdjacentHTML('beforeend', '<div class="ccSlip" style="left:' + h.left + 'px;top:' + h.top + 'px;width:' + h.width + 'px;height:' + h.height + 'px"><div class="tx"><span class="l1">${l1}</span><span class="l2"><span>${pre}</span><span class="nm">${nm}</span></span></div><button>Undo</button></div>'); })()`;

const FRAMES = {
  async 'P1-390-picker'(page) { await base(page); await P.tap(page, '#titleBtn'); await W(400); await page.evaluate(s => eval(s), PICK(false)); },
  async 'P2-375-picker'(page) { await base(page); await P.tap(page, '#titleBtn'); await W(400); await page.evaluate(s => eval(s), PICK(false)); },
  async 'P3-1280-picker'(page) { await base(page); await page.evaluate(() => document.getElementById('titleBtn').click()); await W(500); await page.evaluate(s => eval(s), PICK(true)); },
  async 'S1-slip-moved'(page) { await base(page); await page.evaluate(s => eval(s), SLIP('Stockholm removed', 'Its places → ', 'Copenhagen')); },
  async 'S2-slip-long-names'(page) { await base(page); await page.evaluate(s => eval(s), SLIP('East Marlborough Township removed', 'Its place → ', 'Philadelphia')); },
  async 'S3-slip-removed-too'(page) { await base(page); await page.evaluate(s => eval(s), SLIP('Stockholm removed', '', 'and its 23 places')); },
  async 'E1-empty-city'(page) {
    await page.evaluate(() => { CITIES.philadelphia = { label: 'Philadelphia', center: [39.9524, -75.1636], zoom: 12, viewbox: '-75.28,39.87,-74.96,40.14' }; CC.unhideAll(); setActiveCity('philadelphia'); }); await W(2500);
    await page.evaluate(() => { const all = [...document.querySelectorAll('#locationsList *')]; const n = all.find(e => e.children.length === 0 && /Nothing here yet\. Tap \+/.test(e.textContent)) || all.reverse().find(e => /Nothing here yet\. Tap \+/.test(e.textContent));
      if (n) n.lastChild.textContent = n.lastChild.textContent.replace(/Nothing here yet\. Tap \+ to add a place; it.s yours until you remove it\./, 'Nothing here yet · tap + to add a place'); });
  },
};
const SIZES = { 'P2-375-picker': [375, 667], 'P3-1280-picker': [1280, 800], 'S2-slip-long-names': [375, 667] };

const SHEETS = [
  ['1-picker-fits', '1 · The remove picker takes the whole menu box, grows to the room there is, and pins the choices that matter', [
    ['P1-390-picker', '390 × 844', 'The box grows up to fit: Stockholm and the question on top, all 12 destinations, Remove-too and Keep at the foot. With more cities, only the middle scrolls.'],
    ['P2-375-picker', '375 × 667', 'Less room: the box stops just under the top controls, the destinations scroll (cut at Lewes, a soft shadow at the edge), and Remove-too and Keep stay pinned.'],
  ]],
  ['2-picker-desktop', '2 · Desktop: the same box, opening down to the window\'s foot', [
    ['P3-1280-picker', '1280 × 800', 'No locked height on desktop: every destination fits here, and the foot sits right under them.'],
  ]],
  ['3-undo-slip', '3 · The Undo slip on two lines: what went, then where its places went', [
    ['S1-slip-moved', 'Moved', 'Line 1 (grey): Stockholm removed. Line 2: Its places → Copenhagen, never cut.'],
    ['S2-slip-long-names', 'Long names at 375', 'Even East Marlborough Township fits on line 1 at 375. A longer name would cut there, never on line 2, so the destination stays whole.'],
    ['S3-slip-removed-too', 'Removed too', 'Line 2 says the places went with it: and its 23 places.'],
  ]],
  ['4-empty-city', '4 · The empty city: the build\'s empty-section voice is right; the copy gets shorter', [
    ['E1-empty-city', 'Philadelphia, 0', 'Nothing here yet · tap + to add a place. (The \'it\'s yours until you remove it\' clause is dropped.)'],
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
    const FW = frames.some(([f]) => f.includes('1280')) ? 900 : 330;
    const cells = frames.map(([f, h, c]) => `<figure style="width:${FW}px"><img style="width:${FW}px" src="data:image/png;base64,${fs.readFileSync(path.join(OUT, f + '.png')).toString('base64')}"><figcaption><b>${h}</b><span>${c}</span></figcaption></figure>`).join('');
    const w = Math.max(frames.length * FW + (frames.length + 1) * 20, 760);
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
