// Round 7 owner stills (Float bottom-left; A as the Hanging Tag cut).
// Was: Round 6 owner stills (visual designer): captioned, 1170 wide (3x of a 390 phone). Every still 1 and every 1x crop has
// the ACCOUNT BADGE in the same frame (director turn 20). Run after r6-stills.js:   node compose-r6.js  (ONLY=<prefix>)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'); const path = require('path');
const dd = fs.readdirSync('/opt/pw-browsers').filter(x => /^chromium-\d+$/.test(x)).sort().pop();
const C = __dirname, E = C + '/E-float/r6/', A = C + '/stub/r6/', P = C + '/C-pin/r6/', D = C + '/D-floated-ticket/r6/';
const E5 = C + '/E-float/stills/', A5 = C + '/stub/r5/', P5 = C + '/C-pin/r5/';
const img = (f, style = '') => `<img src="file://${f}" style="display:block;${style}">`;
const cap = (t, sub) => `<div class="cap">${t}</div>${sub ? `<div class="sub">${sub}</div>` : ''}`;
const lab = t => `<div class="lab">${t}</div>`;
// a window (css px x0..x1, y0..y1) of a 3x frame, drawn at s display px per css px
const crop = (f, x0, y0, x1, y1, s, extra = '') => `<div style="width:${(x1 - x0) * s}px;height:${(y1 - y0) * s}px;overflow:hidden;flex:none;${extra}">${img(f, `width:${390 * s}px;margin:${-y0 * s}px 0 0 ${-x0 * s}px`)}</div>`;
// a window of a 1x frame, enlarged without smoothing (each screen pixel = s x s); blur: the squint test
const crop1 = (f, x0, y0, x1, y1, s, blur) => `<div style="width:${(x1 - x0) * s}px;height:${(y1 - y0) * s}px;overflow:hidden;flex:none">${img(f, `width:${390 * s}px;margin:${-y0 * s}px 0 0 ${-x0 * s}px;image-rendering:pixelated;${blur ? `filter:blur(${4 * s}px)` : ''}`)}</div>`;
const col = (t, inner, w) => `<div class="col" style="width:${w}px">${lab(t)}${inner}</div>`;
const pair = (lf, lt, rf, rt) => `<div class="row"><div class="col" style="width:575px"><div class="lab" style="padding-left:30px">${lt}</div>${img(lf, 'width:575px')}</div><div class="col" style="width:575px"><div class="lab" style="padding-left:10px">${rt}</div>${img(rf, 'width:575px')}</div></div>`;
const W1 = [150, 0, 390, 610];   // the 1x window: the right 240px of the phone, from the account badge down into the list header
const oneX = (f, name) => `<div class="row" style="padding:0 30px;gap:40px">${col(name + ', 1x', crop1(f, ...W1, 2), 480)}${col('Squint test (blurred)', crop1(f, ...W1, 2, true), 480)}</div>`;
const strip = (f, t, s = 1.05) => col(t, crop(f, 150, 0, 390, 600, s, 'border:1px solid #d6ccb8'), 240 * s + 2);
const CSS = `body{margin:0;background:#E9E2D3;font-family:'DejaVu Sans Condensed','Arial Narrow',sans-serif;color:#12293F;width:1170px}
 .cap{font-weight:700;letter-spacing:.05em;text-transform:uppercase;font-size:40px;padding:26px 30px 14px}
 .sub{font-size:34px;padding:0 30px 22px;color:#3d4a55;line-height:1.3}
 .lab{font-weight:700;font-size:28px;letter-spacing:.03em;padding:14px 0 10px;line-height:1.2}
 .cost{font-size:34px;padding:22px 30px 30px;line-height:1.3} .cost b{color:#A8400C}
 .row{display:flex;gap:20px;align-items:flex-start} .col{flex:none} .gap{height:24px} .kill{color:#A8400C}`;
const F7 = C + '/E-float/r7/', A7 = C + '/stub/r7/';
const oneFull = (f, name) => `<div class="row" style="padding:0 30px;gap:18px">${col(name + ', 1x', crop1(f, 0, 0, 390, 610, 1.4), 546)}${col('Squint test (blurred)', crop1(f, 0, 0, 390, 610, 1.4, true), 546)}</div>`;
const band3 = (f, y0, y1, w = 390) => crop(f, 0, y0, w, y1, 3);
const pages = {
  // ---------------- FLOAT, LEFT ----------------
  'E-float/R7-F1-right-vs-left-3x.png': `${cap('Float · the + moves to the left', 'The same orange badge, at the bottom-left corner. Its edge is 20px from the side and 20px above the list, on the same line as the list’s icons.')}
     ${pair(F7 + 'fr-rest-3x.png', 'Right (round 6)', F7 + 'fl-rest-3x.png', 'Left')}
     <div class="cost"><b>Cost:</b> + rides down with the list when you tap it (and back on cancel); with the filters open, close them first. The map credit goes back to the right.</div>`,
  'E-float/R7-F2-1x.png': `${cap('At real size (1x)', 'The whole map, account badge top-right, + bottom-left. Right: blurred. The + should still come first.')}
     ${oneFull(F7 + 'fl-rest-1x.png', 'Left')}<div class="gap"></div>`,
  'E-float/R7-F3-tag-open-664-3x.png': `${cap('A place’s tag open, in a Safari tab (390×664)', 'The list sits a little lower so the tag clears the +. You still see 3 rows.')}${img(F7 + 'fl-tag664-3x.png', 'width:1170px')}`,
  'E-float/R7-F4-adding-844-3x.png': `${cap('Tap +', 'The list slides down and the + rides down with it, turning into a navy ×. ADD LOCATION sits beside it on the same line: 12px from its edge, out to the form’s right edge.')}${img(F7 + 'fl-form844-3x.png', 'width:1170px')}
     <div class="cost"><b>Cost:</b> on this one line, ADD LOCATION starts about 27px right of the form’s fields, so it can sit beside the ×.</div>`,
  'E-float/R7-F5-collapsed-3x.png': `${cap('List down (Home Screen)', 'The + rides the list’s edge down, the same 20px above it.')}${img(F7 + 'fl-collapsed-3x.png', 'width:1170px')}`,
  'E-float/R7-F6-320-tag-3x.png': `${cap('Smallest phone (320 wide), a tag open', 'Copenhagen. The selected row shows whole, with about half of the next. At this width the credit is just “© OpenStreetMap contributors”.')}${img(F7 + 'fl-tag320-3x.png', 'width:960px;margin:0 105px')}<div class="gap"></div>`,
  // ---------------- A, THE TAG CUT ----------------
  'stub/R7-A1-tag-vs-ticket-3x.png': `${cap('A · the place tag’s cut', 'The end of the list header, cut like the top of a place’s tag (both corners), with the +. Left: round 6’s admission ticket.')}
     ${pair(A7 + 'a-admit-3x.png', 'Round 6: ticket', A7 + 'a7-none-3x.png', 'Round 7: tag')}
     <div class="cost"><b>Cost:</b> the list title gets 32px shorter (‘list’ drops first, at 320 the count too).</div>`,
  'stub/R7-A2-1x.png': `${cap('At real size (1x)', 'Account badge at the top, the tag at the end of the list header. Right: blurred.')}
     ${oneX(A7 + 'a7-none-1x.png', 'A')}<div class="gap"></div>`,
  'stub/R7-A3-eyelet-3x.png': `${cap('A · with or without the tag’s hole', 'Close-ups at 3x, then the same at 1x.')}
     <div class="row" style="padding:0 30px;gap:16px">${[['a7-none', 'No hole (pick)'], ['a7-hole', 'Hole'], ['a7-patch', 'Hole + patch']].map(([v, t]) => col(t, crop(A7 + v + '-3x.png', 270, 534, 390, 608, 2.95), 354)).join('')}</div>
     <div class="row" style="padding:0 30px;gap:16px">${['a7-none', 'a7-hole', 'a7-patch'].map(v => col('', crop1(A7 + v + '-1x.png', 270, 534, 390, 608, 2.95), 354)).join('')}</div>
     <div class="cost"><b>No hole:</b> the two cut corners already say “tag”. <span class="kill"><b>Hole:</b> a dot beside the locate icon. <b>Hole + patch:</b> a little switch knob, a fourth control.</span></div>`,
  'stub/R7-A4-states-3x.png': `${cap('Rest, pressed, open', 'Pressed: deep orange, paper +, like ADD LOCATION. Open: the header’s navy “on” colour, the + turned into ×.')}
     ${cap('Rest', '')}${band3(A7 + 'a7-none-3x.png', 540, 604)}${cap('Pressed', '')}${band3(A7 + 'a7-pressed-3x.png', 540, 604)}${cap('Open', '')}${band3(A7 + 'a7-open844-3x.png', 780, 844)}<div class="gap"></div>`,
  'stub/R7-A5-tag-open-3x.png': `${cap('A place’s tag open', 'The same cut as the tag above it: the tag you add with, and the tags your places open into. The place’s tag stays the main thing. Right: a starred place (its band is orange too; the + keeps the header tag reading as add).')}
     ${pair(A7 + 'a7-tag-plain-3x.png', 'A place', A7 + 'a7-tag-starred-3x.png', 'A starred place')}<div class="gap"></div>`,
  'stub/R7-A6-adding-3x.png': `${cap('Tap +', 'The list drops and the tag rides down with it as a navy ×. ADD LOCATION sits just above.')}${img(A7 + 'a7-open844-3x.png', 'width:1170px')}`,
  'stub/R7-A7-320-3x.png': `${cap('Smallest phone (320 wide)', 'Copenhagen. The title drops “list” and the count, then shortens the name. The cut corners leave the locate icon its room.')}${img(A7 + 'a7-320-3x.png', 'width:960px;margin:0 105px')}<div class="gap"></div>`,
};
(async () => {
  const b = await chromium.launch({ executablePath: `/opt/pw-browsers/${dd}/chrome-linux/chrome`, args: ['--allow-file-access-from-files'] });
  for (const [n, body] of Object.entries(pages).filter(([n]) => !process.env.ONLY || n.includes(process.env.ONLY))) {
    const pg = await b.newPage({ viewport: { width: 1170, height: 400 }, deviceScaleFactor: 1 });
    const tmp = path.join(C, '.compose-r7.html');
    fs.writeFileSync(tmp, `<!doctype html><meta charset=utf-8><style>${CSS}</style><body>${body}</body>`);
    await pg.goto('file://' + tmp); await pg.waitForTimeout(400);
    await pg.screenshot({ path: path.join(C, n), fullPage: true }); await pg.close(); fs.unlinkSync(tmp);
    console.log('wrote', n);
  }
  await b.close();
})();
