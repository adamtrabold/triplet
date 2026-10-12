// Composes the owner stills that combine frames (1 pair, 2 strip, 4 states) and the overview sheet.
// Run after render.js: node compose.js
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'); const D = __dirname;
const dd = fs.readdirSync('/opt/pw-browsers').filter(x => /^chromium-\d+$/.test(x)).sort().pop();
const img = (f, style = '') => `<img src="file://${D}/${f}" style="display:block;${style}">`;
const CSS = `body{margin:0;background:#E9E2D3;font-family:'DejaVu Sans Condensed','Arial Narrow',sans-serif;color:#12293F}
 .cap{font-weight:700;letter-spacing:.06em;text-transform:uppercase;font-size:44px;padding:28px 36px 18px}
 .sub{font-size:34px;padding:0 36px 24px;color:#3d4a55;letter-spacing:0;text-transform:none;font-weight:400;line-height:1.3}
 .row{display:flex;gap:30px;align-items:flex-start} .col{flex:none}`;
const pages = {
  '1-rest-today-vs-stub-3x.png': { w: 2370, body: `<div class="row">
     <div class="col"><div class="cap">Today</div>${img('1-rest-today-3x.png', 'width:1170px')}</div>
     <div class="col"><div class="cap">Claim-check stub</div>${img('1-rest-stub-3x.png', 'width:1170px')}</div></div>` },
  '2-tap-strip-3x.png': { w: 1170, body: `
     <div class="cap">1 · Tap +</div><div class="sub">Phone in Safari (390×664). The list is up.</div>
     <div style="height:1092px;overflow:hidden">${img('2-strip-a-rest-3x.png', 'width:1170px;margin-top:-900px')}</div>
     <div class="cap">2 · The list slides down</div><div class="sub">The + switches to a navy × (no fade) and turns as it rides down; the form is uncovered above.</div>
     <div style="height:1092px;overflow:hidden">${img('2-strip-b-mid-3x.png', 'width:1170px;margin-top:-900px')}</div>
     <div class="cap">3 · Adding</div><div class="sub">The form sits on the band: × at the bottom edge, ADD LOCATION just above it, the map above. Tap × and the list comes back up.</div>
     <div style="height:1092px;overflow:hidden">${img('2-strip-c-open-3x.png', 'width:1170px;margin-top:-900px')}</div>` },
  '4-states-3x.png': { w: 1170, body: `
     <div class="cap">Rest</div><div class="sub">Brand orange, navy + (same as ADD LOCATION)</div>${img('4-state-rest-3x.png', 'width:1170px')}
     <div class="cap">Pressed</div><div class="sub">Deep orange, paper + (same as ADD LOCATION pressed)</div>${img('4-state-pressed-3x.png', 'width:1170px')}
     <div class="cap">Open (form showing)</div><div class="sub">Navy, paper × (same as any open header button)</div>${img('4-state-open-3x.png', 'width:1170px')}
     <div class="cap">Filters open, for comparison</div><div class="sub">One open (navy) tile in the band at a time</div>${img('4-state-filters-3x.png', 'width:1170px')}<div style="height:30px"></div>` },
};
(async () => {
  const b = await chromium.launch({ executablePath: `/opt/pw-browsers/${dd}/chrome-linux/chrome`, args: ['--allow-file-access-from-files'] });
  const shoot = async (name, w, body, dsf = 1) => {
    const p = await b.newPage({ viewport: { width: w, height: 400 }, deviceScaleFactor: dsf });
    fs.writeFileSync(`${D}/.compose.html`, `<!doctype html><meta charset=utf-8><style>${CSS}</style><body>${body}</body>`);
    await p.goto(`file://${D}/.compose.html`); await p.waitForTimeout(400);
    await p.screenshot({ path: `${D}/${name}`, fullPage: true }); await p.close();
  };
  for (const [n, p] of Object.entries(pages)) await shoot(n, p.w, p.body);
  // overview sheet: today vs stub + every owner still, half size (each phone 585px wide)
  const t = (f, cap, sub, w = 585) => `<div class="col" style="width:${w}px"><div class="cap" style="font-size:30px;padding:20px 0 6px">${cap}</div><div class="sub" style="font-size:24px;padding:0 0 14px;min-height:62px">${sub}</div>${img(f, `width:${w}px`)}</div>`;
  const body = `<div style="padding:30px 40px 50px">
    <div class="cap" style="font-size:60px;padding:10px 0 4px">+ placement: the claim-check stub</div>
    <div class="sub" style="font-size:30px;padding:0 0 10px">The + moves from the top corner to the end of the list header, the band that's always under your thumb. It's the list's tear-off stub: the same perforation as the tag's stub, with its centre on the rows' × column. One concept, compared with today.</div>
    <div class="row">${t('1-rest-today-3x.png', '1a · Today', 'Top-right corner, twin of the account badge')}${t('1-rest-stub-3x.png', '1b · Stub', 'End of the list header; account alone up top')}
      ${t('2-adding-664-3x.png', '2 · Adding (Safari, 390×664)', 'List drops to its band; × at the bottom, Add above')}${t('3-tag-open-3x.png', '3 · Tag open + selected row', 'The tag stays the loudest thing')}</div>
    <div class="row" style="margin-top:20px">${t('2-strip-a-rest-3x.png', '2 · Tap strip: rest', '')}${t('2-strip-b-mid-3x.png', 'Mid-ride', '+ turning to ×')}${t('2-strip-c-open-3x.png', 'Open', '× at the bottom edge')}
      ${t('5-320-copenhagen-3x.png', '5 · 320 wide, Copenhagen', 'Title gives way: LIST, then count, then …', 480)}</div>
    <div class="row" style="margin-top:20px">${t('2-adding-844-3x.png', '2b · Adding (Home Screen, 390×844)', 'Form sits on the band; Add just above the ×; map above')}${t('4-states-3x.png', '4 · States', 'Rest / pressed / open / filters open', 1200)}</div></div>`;
  await shoot('overview-sheet.png', 2500, body);
  fs.unlinkSync(`${D}/.compose.html`);
  await b.close();
})();
