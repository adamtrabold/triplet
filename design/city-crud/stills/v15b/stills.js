// City CRUD v15b (owner: "i'd like to see the toast above the controls on mobile (zoom / account) and
// then for them to shift back when the toast goes away"; "Delete places"). Mock edits over the build.
//   CHROME=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome node design/city-crud/stills/v15b/stills.js [prefix|sheets]
const path = require('path'), fs = require('fs');
const { open, P, W } = require('../../proto/lib-cc.js');
const OUT = path.join(__dirname, 'raw');
fs.mkdirSync(OUT, { recursive: true });
const STORAGE = { 'gh.plans': '1', 'triplet.reorderHint': '1' };
const CSS = `
  .ccBan { position: fixed; z-index: 2800; display: flex; align-items: stretch; box-sizing: border-box; height: 52px; background: var(--paper-raised);
    border: 1px solid var(--navy); box-shadow: 4px 4px 0 var(--navy); }
  .ccBan .tx { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; gap: 2px; padding: 0 var(--s3); font-family: var(--font-ui); font-stretch: 75%; text-transform: uppercase; }
  .ccBan .l1 { font-size: 11px; line-height: 14px; font-weight: 600; letter-spacing: .1em; color: var(--ink-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ccBan .l2 { font-size: 13px; line-height: 16px; font-weight: 700; letter-spacing: .06em; color: var(--navy); white-space: nowrap; }
  .ccBan button { all: unset; flex: none; display: flex; align-items: center; padding: 0 var(--s3); border-left: 1px solid var(--hair); font-family: var(--font-ui); font-stretch: 75%;
    font-weight: 700; font-size: 12px; letter-spacing: .1em; text-transform: uppercase; color: var(--navy); text-decoration: underline; text-underline-offset: 3px; }
  /* THE PUSH: the top controls ride down by the banner's height + --s2 while it shows */
  body.cc-pushed .leaflet-top, body.cc-pushed #accountBtn, body.cc-pushed #accountFocus { transform: translateY(60px); }
`;
async function base(page) {
  await page.evaluate(CSS => { const s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    CC.unhideAll(); goToCity('malmo'); map.setView([57, 5], 3, { animate: false }); }, CSS); await W(2500);
}
// the banner: phone, at the very top, where the controls were (top --s4 + the standalone inset), in the gutters
const BAN = (l1, l2) => `(() => { const b = document.createElement('div'); b.className = 'ccBan';
  b.innerHTML = '<div class="tx"><span class="l1">${l1}</span><span class="l2">${l2}</span></div><button>Undo</button>';
  document.body.appendChild(b); b.style.left = '16px'; b.style.right = '20px'; b.style.top = '16px'; document.body.classList.add('cc-pushed'); })()`;
const FRAMES = {
  async 'A1-before'(page) {
    await base(page);
    await page.evaluate(() => { document.getElementById('titleBtn').click(); }); await W(400);
    await page.evaluate(async () => { await rmShowPicker('stockholm', false); }); await W(400);
    await page.evaluate(() => { const t = document.querySelector('.rm-pick .is-too .rm-lab'); if (t) t.textContent = 'Delete places';
      const c = document.querySelector('.rm-pick [data-rm-to="copenhagen"]'); if (c) c.style.background = 'var(--paper-pressed)';
      // v15: the new-city line is the list's last row, not a pinned field; Delete places set off by the 2px rule
      const pick = document.querySelector('.rm-pick'); pick.querySelector('.rm-new').remove();
      pick.querySelector('.rm-q').style.borderBottom = '1px solid var(--navy)';
      pick.querySelector('.rm-foot').style.borderTop = '2px solid var(--hair)';
      pick.querySelector('.rm-mine').insertAdjacentHTML('beforeend', '<button type="button" class="rm-dest" style="border-top:1px solid var(--hair)">' + FIND_PLUS_ICO.replace('<svg', '<svg class="menu-ico"') + '<span class="menu-lab rm-lab">New city</span></button>');
      placeRmPicker(); });
  },
  async 'A2-banner-in'(page) { await base(page); await page.evaluate(s => eval(s), BAN('Stockholm removed', 'Its places → Copenhagen')); },
  async 'A3-after'(page) { await base(page); },
  async 'B1-375-banner'(page) { await base(page); await page.evaluate(s => eval(s), BAN('Stockholm removed', 'and its 23 places deleted')); },
};
const SIZES = { 'B1-375-banner': [375, 667] };
const SHEETS = [
  ['1-banner-pushes-controls', '1 · The banner takes the top; the zoom and account controls ride down under it, then back', [
    ['A1-before', 'Before', 'The v15 picker: tap Copenhagen. New city is the last row; the destructive row now reads Delete places.'],
    ['A2-banner-in', 'Banner in', 'At the very top, where the controls were. Zoom and account slide down 60px (its 52 + 8) in the same 140ms.'],
    ['A3-after', 'After 6s', 'The banner fades (160ms) and the controls slide back up with it.'],
  ]],
  ['2-banner-375', '2 · 375 × 667, the deleted-too copy', [
    ['B1-375-banner', '375 × 667', 'Stockholm removed / and its 23 places deleted. The controls sit under it; the map\'s top is covered for 6s.'],
  ]],
];

(async () => {
  const only = process.argv[2] || '';
  const b = await P.lib.launch();
  if (only !== 'sheets') for (const [name, fn] of Object.entries(FRAMES)) {
    if (only && !name.startsWith(only)) continue;
    const [w, h] = SIZES[name] || [390, 844];
    const o = await open(b, { storage: STORAGE, w, h, dsf: 3 });
    try { await fn(o.page); await W(600); await o.page.screenshot({ path: path.join(OUT, name + '.png') }); console.log('shot', name, o.errors.length ? o.errors : ''); }
    catch (e) { console.log('FAIL', name, e.message.split('\n')[0]); }
    await o.page.context().close();
  }
  const ctx = await b.newContext({ deviceScaleFactor: 3, viewport: { width: 800, height: 600 } });
  const page = await ctx.newPage();
  for (const [file, title, frames] of SHEETS) {
    if (!frames.every(([f]) => fs.existsSync(path.join(OUT, f + '.png')))) continue;
    const FW = 330;
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
