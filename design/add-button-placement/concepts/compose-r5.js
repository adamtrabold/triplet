// Round 5 owner stills (visual designer): captioned, 1170 wide (3x of a 390 phone). Every concept still 1 sits beside
// the BASELINE (the floated badge, right corner), never beside today. Run after E-float/stills.js, stub/r5-stills.js,
// C-pin/stills-r5.js:   node compose-r5.js
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'); const path = require('path');
const dd = fs.readdirSync('/opt/pw-browsers').filter(x => /^chromium-\d+$/.test(x)).sort().pop();
const C = __dirname, E = C + '/E-float/stills/', A = C + '/stub/r5/', P = C + '/C-pin/r5/';
const img = (f, style = '') => `<img src="file://${f}" style="display:block;${style}">`;
const cap = (t, sub) => `<div class="cap">${t}</div>${sub ? `<div class="sub">${sub}</div>` : ''}`;
// a band of a 3x frame: css px y0..y1 of the phone, drawn at width w
const band = (f, y0, y1, w = 1170, fw = 1170) => `<div style="height:${(y1 - y0) * 3 * w / fw}px;overflow:hidden">${img(f, `width:${w}px;margin-top:${-y0 * 3 * w / fw}px`)}</div>`;
const pair = (lf, lt, rf, rt) => `<div class="row"><div class="col" style="width:575px">${cap(lt)}${img(lf, 'width:575px')}</div><div class="col" style="width:575px">${cap(rt)}${img(rf, 'width:575px')}</div></div>`;
// a 1x crop (240x240 css) shown pixel for pixel as a 1x screen draws it, enlarged without smoothing
const one = (f, t) => `<div class="col" style="width:555px">${cap(t)}${img(f, 'width:540px;height:540px;image-rendering:pixelated;margin-left:15px')}</div>`;
const CSS = `body{margin:0;background:#E9E2D3;font-family:'DejaVu Sans Condensed','Arial Narrow',sans-serif;color:#12293F;width:1170px}
 .cap{font-weight:700;letter-spacing:.05em;text-transform:uppercase;font-size:40px;padding:26px 30px 14px}
 .sub{font-size:34px;padding:0 30px 22px;color:#3d4a55;line-height:1.3}
 .cost{font-size:36px;padding:22px 30px 30px;line-height:1.3} .cost b{color:#A8400C}
 .row{display:flex;gap:20px;align-items:flex-start} .col{flex:none} .gap{height:24px}`;
const BASE = E + 'rest-r-3x.png';
const pages = {
  // ---- Baseline: the floated badge ----
  'E-float/E1-left-or-right-3x.png': `${cap('Today’s + badge, floated low', 'The same badge, unchanged, just above the list. Left corner or right corner.')}
     ${pair(E + 'rest-l-3x.png', 'Left', E + 'rest-r-3x.png', 'Right (our pick)')}
     <div class="cost"><b>Pick: right.</b> It’s where a right thumb rests, and it lines up exactly with the account badge above it. Left is close behind: it lines up with the list’s icons instead.</div>`,
  'E-float/E2-right-list-up-3x.png': `${cap('Right corner, list up', '16px in from the side and 16px above the list, so its edge sits 20px from both.')}${img(BASE, 'width:1170px')}`,
  'E-float/E3-right-list-down-3x.png': `${cap('List down (Home Screen)', 'It rides the list’s edge down, the same 20px above it.')}${img(E + 'collapsed-r-3x.png', 'width:1170px')}`,
  'E-float/E4-right-tag-open-3x.png': `${cap('A place’s tag open', 'The tag hangs clear of the badge; nothing moves.')}${img(E + 'tag-r-3x.png', 'width:1170px')}`,
  'E-float/E5-right-adding-3x.png': `${cap('Tap +', 'The list slides down and the badge rides down with it. It stays navy; only its + turns into ×. ADD LOCATION, the one orange button, sits on the same line beside it.')}${img(E + 'form-r-3x.png', 'width:1170px')}
     <div class="cost"><b>Cost:</b> + moves down on tap (and back on cancel). With the filters open, close them first.</div>`,
  'E-float/E6-right-320-3x.png': `${cap('Smallest phone (320 wide)', 'Copenhagen. The map credit moves to the left corner, shortened to “© OpenStreetMap contributors”.')}${img(E + 'cph320-r-3x.png', 'width:960px;margin:0 105px')}<div class="gap"></div>`,
  'E-float/E7-right-664-3x.png': `${cap('In a Safari tab (390×664)', 'Same rule, lower on the screen.')}${img(E + 'rest664-r-3x.png', 'width:1170px')}`,
  'E-float/E8-alignment-3x.png': `${cap('How it lines up (3x close-up)', 'Red: the badge’s scalloped edge. Blue: the top of the list.')}
     <div style="height:330px;overflow:hidden;border-bottom:6px solid #E9E2D3">${img(E + 'axes-r-3x.png', 'width:1170px;margin-top:0')}</div>
     <div style="height:540px;overflow:hidden">${img(E + 'axes-r-3x.png', 'width:1170px;margin-top:-1320px')}</div>
     <div class="cost"><b>Pick:</b> the + badge’s edge sits on the same vertical line as the account badge’s, and 20px above the list, the same as its gap from the side.</div>`,
  // ---- A. Claim-check stub, pushed ----
  'stub/A1-vs-float-3x.png': `${cap('A · Claim-check stub', 'Beside the floated badge (our pick for that option).')}
     ${pair(BASE, 'Floated badge', A + 'rest-3x.png', 'A · the stub')}
     <div class="cost"><b>Cost:</b> The list title gets 32px shorter: ‘list’ drops first, and at 320 the count too.</div>`,
  'stub/A2-close-up-1x.png': `${cap('At real size (1x)', 'Pixel for pixel as a phone without a Retina screen draws it, enlarged without smoothing.')}
     <div class="row">${one(E + 'crop1x-r-1x.png', 'Floated badge')}${one(A + 'study-ticket-1x.png', 'A · the stub')}</div><div class="gap"></div>`,
  'stub/A3-rest-3x.png': `${cap('A · the stub, list up', 'A ticket stub at the end of the list header: notched like the tag’s own stub, on the tag band’s paper, a bolder +.')}${img(A + 'rest-3x.png', 'width:1170px')}`,
  'stub/A4-states-3x.png': `${cap('Rest, pressed, open', 'Open: the header’s navy “on” tile, the + turned into ×.')}
     ${cap('Rest', '')}${band(A + 'rest-3x.png', 544, 604)}${cap('Pressed', 'Deep orange, paper +, as ADD LOCATION.')}${band(A + 'pressed-3x.png', 544, 604)}${cap('Open', '')}${band(A + 'open-844-3x.png', 784, 844)}<div class="gap"></div>`,
  'stub/A5-adding-3x.png': `${cap('Tap +', 'The list drops, the stub rides down with it as ×; ADD LOCATION sits just above. (Same as before.)')}${img(A + 'open-844-3x.png', 'width:1170px')}`,
  'stub/A6-tag-open-3x.png': `${cap('A place’s tag open', 'The stub stays in the header; nothing moves.')}${img(A + 'tag-3x.png', 'width:1170px')}`,
  'stub/A7-list-down-3x.png': `${cap('List down (Home Screen)', '')}${img(A + 'collapsed-3x.png', 'width:1170px')}`,
  'stub/A8-320-3x.png': `${cap('Smallest phone (320 wide)', 'The title drops “list” and the count, then shortens the name.')}${img(A + 'cph320-3x.png', 'width:960px;margin:0 105px')}<div class="gap"></div>`,
  // ---- C. Pencilled pin, pushed ----
  'C-pin/C1-vs-float-3x.png': `${cap('C · Blank pin', 'Beside the floated badge (our pick for that option).')}
     ${pair(BASE, 'Floated badge', P + 'rest-3x.png', 'C · blank pin')}
     <div class="cost"><b>Cost:</b> the add form becomes a tag on the map, and with a tag or the filters open, you close them to add.</div>`,
  'C-pin/C2-close-up-1x.png': `${cap('At real size (1x)', 'Pixel for pixel as a phone without a Retina screen draws it, enlarged without smoothing.')}
     <div class="row">${one(E + 'crop1x-r-1x.png', 'Floated badge')}${one(P + 'study-ring-1x.png', 'C · blank pin')}</div><div class="gap"></div>`,
  'C-pin/C3-rest-3x.png': `${cap('C · the blank pin, list up', 'An empty pin (not placed yet) with its tag printed with a +. No words.')}${img(P + 'rest-3x.png', 'width:1170px')}`,
  'C-pin/C4-pressed-3x.png': `${cap('Rest and pressed (3x)', '')}<div class="row" style="padding:0 30px 30px">${img(P + 'rest-3x.png', 'width:1170px;margin:-1260px 0 0 -690px;clip-path:inset(1260px 0 0 690px)')}</div>`,
  'C-pin/C5-tag-open-3x.png': `${cap('A place’s tag open', 'One tag at a time: the pin steps aside. Close the tag to add.')}${img(P + 'tag-3x.png', 'width:1170px')}`,
  'C-pin/C6-list-down-3x.png': `${cap('List down (Home Screen)', '')}${img(P + 'collapsed-3x.png', 'width:1170px')}`,
  'C-pin/C7-320-3x.png': `${cap('Smallest phone (320 wide)', '')}${img(P + 'cph320-3x.png', 'width:960px;margin:0 105px')}<div class="gap"></div>`,
};
// C4: rest and pressed side by side, cropped from the frames (the pressed frame is already a 160x140 crop)
pages['C-pin/C4-pressed-3x.png'] = `${cap('Rest and pressed', 'Pressed: the deep orange, paper +, as ADD LOCATION.')}
  <div class="row" style="padding:0 30px 30px;gap:30px"><div style="width:480px;height:420px;overflow:hidden">${img(P + 'rest-3x.png', 'width:1170px;margin:-1260px 0 0 -690px')}</div>${img(P + 'pressed-3x.png', 'width:480px')}</div>`;
(async () => {
  const b = await chromium.launch({ executablePath: `/opt/pw-browsers/${dd}/chrome-linux/chrome`, args: ['--allow-file-access-from-files'] });
  for (const [n, body] of Object.entries(pages)) {
    const pg = await b.newPage({ viewport: { width: 1170, height: 400 }, deviceScaleFactor: 1 });
    const tmp = path.join(C, '.compose-r5.html');
    fs.writeFileSync(tmp, `<!doctype html><meta charset=utf-8><style>${CSS}</style><body>${body}</body>`);
    await pg.goto('file://' + tmp); await pg.waitForTimeout(300);
    await pg.screenshot({ path: path.join(C, n), fullPage: true }); await pg.close(); fs.unlinkSync(tmp);
    console.log('wrote', n);
  }
  await b.close();
})();
