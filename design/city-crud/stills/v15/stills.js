// City CRUD v15 (owner: "i think new city should be part of the list, and that the "city removed |undo"
// should be more of a top banner above the map"). Mock edits over the BUILT picker (f04ab1e): the real
// rmShowPicker() opens the box, then the new-city line is moved into the list as its last row; the
// banner is drawn above the map in the app's own menu-box voice.
//   CHROME=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome node design/city-crud/stills/v15/stills.js [prefix|sheets]
const path = require('path'), fs = require('fs');
const { open, P, W } = require('../../proto/lib-cc.js');
const OUT = path.join(__dirname, 'raw');
fs.mkdirSync(OUT, { recursive: true });
const STORAGE = { 'gh.plans': '1', 'triplet.reorderHint': '1' };
const EXTRA = [['philadelphia', 'Philadelphia', 39.95, -75.16], ['wilmington', 'Wilmington', 39.75, -75.55], ['lewes', 'Lewes', 38.77, -75.14], ['baltimore', 'Baltimore', 39.29, -76.61],
  ['annapolis', 'Annapolis', 38.98, -76.49], ['capemay', 'Cape May', 38.94, -74.91], ['newyork', 'New York', 40.71, -74.01], ['princeton', 'Princeton', 40.35, -74.66]];
const CSS = `
  /* v15: the new-city row lives in the list (its last row), in the destinations' own row voice */
  .rm-pick .rm-newrow .rm-lab { color: var(--navy); }
  /* "Remove places too" set off by the title menu's own break: the ledger's doubled rule (2px --hair),
     as under "All places" -- one step heavier than a row rule, lighter than the navy foot rule */
  .rm-foot.v15 { border-top: 2px solid var(--hair); }
  /* the banner: the menu box's voice (paper-raised, 1px navy, the 4px printed offset), two lines */
  .ccBan { position: fixed; z-index: 2800; display: flex; align-items: stretch; box-sizing: border-box; height: 52px; background: var(--paper-raised);
    border: 1px solid var(--navy); box-shadow: 4px 4px 0 var(--navy); }
  .ccBan .tx { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; gap: 2px; padding: 0 var(--s3); font-family: var(--font-ui); font-stretch: 75%; text-transform: uppercase; }
  .ccBan .l1 { font-size: 11px; line-height: 14px; font-weight: 600; letter-spacing: .1em; color: var(--ink-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ccBan .l2 { font-size: 13px; line-height: 16px; font-weight: 700; letter-spacing: .06em; color: var(--navy); white-space: nowrap; }
  .ccBan button { all: unset; flex: none; display: flex; align-items: center; padding: 0 var(--s3); border-left: 1px solid var(--hair); font-family: var(--font-ui); font-stretch: 75%;
    font-weight: 700; font-size: 12px; letter-spacing: .1em; text-transform: uppercase; color: var(--navy); text-decoration: underline; text-underline-offset: 3px; }
`;
async function base(page) {
  await page.evaluate(([CSS, EXTRA]) => { const s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    EXTRA.forEach(([id, label, la, ln]) => { CITIES[id] = { label, center: [la, ln], zoom: 12, viewbox: `${ln - .1},${la - .1},${ln + .1},${la + .1}` }; });
    CC.unhideAll(); goToCity('malmo'); map.setView([57, 5], 3, { animate: false }); }, [CSS, EXTRA]); await W(2500);
}
// open the real picker, then: the new-city line leaves the head and becomes the list's last row
const PICK = typed => `(async () => {
  document.getElementById('titleBtn').click(); await new Promise(r => setTimeout(r, 400));
  await rmShowPicker('stockholm', false); await new Promise(r => setTimeout(r, 300));
  const pick = document.querySelector('.rm-pick'), mine = pick.querySelector('.rm-mine'), line = pick.querySelector('.rm-new');
  pick.querySelector('.rm-foot').classList.add('v15');
  pick.querySelector('.rm-q').style.borderBottom = '1px solid var(--navy)';
  if (!${typed}) {
    line.remove();
    mine.insertAdjacentHTML('beforeend', '<button type="button" class="rm-dest rm-newrow" style="border-top:1px solid var(--hair)">' + FIND_PLUS_ICO.replace('<svg', '<svg class="menu-ico"') + '<span class="menu-lab rm-lab">New city</span></button>');
    placeRmPicker();
  } else {
    // tapped: the row turns into the search IN PLACE (the title menu's own "+ New city" behaviour);
    // the list scrolls so it sits at the top of the scrolling part, its results right under it
    line.style.borderBottom = '1px solid var(--hair)'; line.style.borderTop = '1px solid var(--hair)'; line.style.background = 'var(--paper-raised)';
    mine.appendChild(line);
    const res = ${JSON.stringify([['Philadelphia', 'City · Pennsylvania, United States · ≈ 6,420 km away'], ['Philadelphia', 'Village · New York, United States · ≈ 6,000 km away'], ['Philadelphia', 'Village · Tennessee, United States · ≈ 7,300 km away']])};
    line.insertAdjacentHTML('afterend', res.map(([n, w]) => '<button type="button" class="add-res menu-res" style="height:auto;min-height:52px;padding-left:40px;border-bottom:1px solid var(--hair)"><span class="add-res-name">' + n + '</span><span class="add-res-where" style="white-space:normal">' + w + '</span></button>').join(''));
    const inp = line.querySelector('.menu-find-in'); inp.value = 'Philadelphia';
    placeRmPicker();
    mine.scrollTop = line.offsetTop - mine.offsetTop;
    rmShadows && rmShadows();
  }
})()`;
// the banner: phone = full width inside the gutters, its top on the top controls' row bottom
// (--top-row-bottom), so it never covers the zoom control or the account badge; desktop = over the
// map only, centred, 420 wide, 16px below the map's top
const BAN = (l1, l2, desktop) => `(() => { document.querySelectorAll('#planSlip').forEach(s => s.hidden = true);
  const b = document.createElement('div'); b.className = 'ccBan'; b.innerHTML = '<div class="tx"><span class="l1">${l1}</span><span class="l2">${l2}</span></div><button>Undo</button>';
  document.body.appendChild(b);
  if (${desktop}) { const m = document.getElementById('map').getBoundingClientRect(); const w = Math.min(420, m.width - 32); b.style.width = w + 'px'; b.style.left = (m.left + (m.width - w) / 2) + 'px'; b.style.top = (m.top + 16) + 'px'; }
  else { b.style.left = '16px'; b.style.right = '20px'; b.style.top = topRowBottom() + 'px'; }
})()`;

const FRAMES = {
  async 'P1-390-new-city-row'(page) { await base(page); await page.evaluate(s => eval(s), PICK(false)); await W(400); await page.evaluate(() => { const m = document.querySelector('.rm-mine'); m.scrollTop = m.scrollHeight; rmShadows(); }); },
  async 'P2-390-new-city-typed'(page) { await base(page); await page.evaluate(s => eval(s), PICK(true)); await W(400); },
  async 'P3-375-picker'(page) { await base(page); await page.evaluate(s => eval(s), PICK(false)); await W(400); },
  async 'B1-390-banner'(page) { await base(page); await page.evaluate(s => eval(s), BAN('Stockholm removed', 'Its places → Copenhagen', false)); },
  async 'B2-375-banner-long'(page) { await base(page); await page.evaluate(s => eval(s), BAN('East Marlborough Township removed', 'Its place → Philadelphia', false)); },
  async 'B3-1280-banner'(page) { await base(page); await page.evaluate(s => eval(s), BAN('Stockholm removed', 'and its 23 places', true)); },
};
const SIZES = { 'P3-375-picker': [375, 667], 'B2-375-banner-long': [375, 667], 'B3-1280-banner': [1280, 800] };

const SHEETS = [
  ['1-new-city-in-the-list', '1 · New city is the list\'s last row; Remove places too is set off by the menu\'s doubled rule', [
    ['P1-390-new-city-row', 'The last row: + New city', 'All 12 cities fit at 390; "+ New city" is the list\'s last row, in the cities\' own row style. Then the 2px rule, Remove places too and Cancel (pinned).'],
    ['P2-390-new-city-typed', 'Tap it: the search, in place', 'The row becomes the Find a city line in place, its results right under it (the list scrolls to keep them in view). Tap Philadelphia: made, moved, removed.'],
    ['P3-375-picker', '375 × 667', 'Your cities scroll and New city waits at the end; Remove places too and Cancel never scroll.'],
  ]],
  ['2-top-banner', '2 · "City removed · Undo" is a banner at the top, over the map', [
    ['B1-390-banner', '390: under the top controls', 'Two lines, the menu box\'s look: Stockholm removed / Its places → Copenhagen, and Undo. It sits under the zoom and account controls, never on them.'],
    ['B2-375-banner-long', '375: long names', 'Line 1 may cut; line 2, the destination, never does.'],
  ]],
  ['3-top-banner-desktop', '3 · Desktop: centred over the map, not the list', [
    ['B3-1280-banner', '1280 × 800', '420 wide, 16px below the map\'s top: Stockholm removed / and its 23 places, and Undo.'],
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
