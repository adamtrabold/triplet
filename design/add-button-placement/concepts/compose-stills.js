// Composes the captioned owner stills for concepts B and C (visual designer, turn 9), in the stub's caption style.
// Run after each concept's stills.js:  node compose-stills.js B   |   node compose-stills.js C
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'); const path = require('path');
const dd = fs.readdirSync('/opt/pw-browsers').filter(x => /^chromium-\d+$/.test(x)).sort().pop();
const which = process.argv[2];
const D = path.join(__dirname, which === 'B' ? 'B-striker' : 'C-pin'), S = path.join(D, 'stills');
const STUB = path.join(__dirname, 'stub');
const img = (f, style = '') => `<img src="file://${f.startsWith('/') ? f : S + '/' + f}" style="display:block;${style}">`;
// a band of a 3x full-screen frame: y0..y1 in CSS px of the phone
const band = (f, y0, y1, w = 1170) => `<div style="height:${(y1 - y0) * 3 * w / 1170}px;overflow:hidden">${img(f, `width:${w}px;margin-top:${-y0 * 3 * w / 1170}px`)}</div>`;
// a close-up: css box x,y,w,h of a 3x frame, drawn at 3x
const crop = (f, x, y, w, h) => `<div style="width:${w * 3}px;height:${h * 3}px;overflow:hidden;flex:none">${img(f, `width:1170px;margin:${-y * 3}px 0 0 ${-x * 3}px`)}</div>`;
const cap = (t, sub) => `<div class="cap">${t}</div>${sub ? `<div class="sub">${sub}</div>` : ''}`;
const CSS = `body{margin:0;background:#E9E2D3;font-family:'DejaVu Sans Condensed','Arial Narrow',sans-serif;color:#12293F}
 .cap{font-weight:700;letter-spacing:.06em;text-transform:uppercase;font-size:44px;padding:28px 36px 18px}
 .sub{font-size:34px;padding:0 36px 24px;color:#3d4a55;line-height:1.3}
 .row{display:flex;gap:30px;align-items:flex-start} .col{flex:none} .gap{height:30px}`;
const pages = which === 'B' ? {
  '1-rest-today-vs-B-3x.png': { w: 2370, body: `<div class="row">
     <div class="col">${cap('Today')}${img(STUB + '/1-rest-today-3x.png', 'width:1170px')}</div>
     <div class="col">${cap('B · Striker strip')}${img('1-rest-B-3x.png', 'width:1170px')}</div></div>` },
  '2-add-strip-3x.png': { w: 1170, body: `
     ${cap('1 · Tap the strip', 'Phone in Safari (390×664). The list is up; the strip is the bottom edge.')}${band('2a-tap-664-3x.png', 360, 664)}
     ${cap('2 · The form rises from it', 'The list stays put underneath. The strip turns to the form’s paper and waits: ADD, then a blank to fill.')}${band('2b-blank-664-3x.png', 360, 664)}
     ${cap('3 · Pick a place', 'The blank is filled with the place’s name and the strip goes orange. Tap the same spot again to add it.')}${band('2c-ready-664-3x.png', 360, 664)}<div class="gap"></div>` },
  '4-states-3x.png': { w: 1170, body: `
     ${cap('Rest', 'Brand orange on the paper tooth, navy words (as ADD LOCATION)')}${img('st-rest-3x.png', 'width:1170px')}
     ${cap('Pressed', 'Deep orange, paper words (as ADD LOCATION pressed)')}${img('st-pressed-3x.png', 'width:1170px')}
     ${cap('Open, nothing picked yet', 'Not greyed out: printed ADD and a blank to fill. Tapping it does nothing.')}${img('st-blank-3x.png', 'width:1170px')}
     ${cap('Open, ready', 'The picked name fills the blank; the field goes orange')}${img('st-ready-3x.png', 'width:1170px')}
     ${cap('Adding…', 'Holds the pressed tone while it saves')}${img('st-adding-3x.png', 'width:1170px')}<div class="gap"></div>` },
  '6-keyboard-3x.png': { w: 1170, body: `${cap('Typing a note, keyboard up', 'Home Screen (390×844). The strip rides on the keyboard, so ADD is under your thumb while you type. Keyboard drawn; needs an iPhone check.')}${img('6-keyboard-notes-3x.png', 'width:1170px')}` },
  '7-collapsed-3x.png': { w: 1170, body: `${cap('List down, Home Screen', 'The band sits straight on the strip: one piece with one perforated seam, not two toolbars. The orange runs to the screen edge under the home bar.')}${img('7-collapsed-homescreen-3x.png', 'width:1170px')}` },
  '8-safari-tab-3x.png': { w: 1170, body: `${cap('In a Safari tab', 'The strip sits right above Safari’s own toolbar (drawn here). This is the height it costs: 56px, all the time.')}${img('8-safari-tab-3x.png', 'width:1170px')}` },
} : {
  '1-rest-today-vs-C-3x.png': { w: 2370, body: `<div class="row">
     <div class="col">${cap('Today')}${img(STUB + '/1-rest-today-3x.png', 'width:1170px')}</div>
     <div class="col">${cap('C · Pencilled pin')}${img('1-rest-C-3x.png', 'width:1170px')}</div></div>
     <div class="sub" style="padding-top:24px">Bigger change: the add form becomes a tag on the map.</div>
     <div class="sub">With a tag or the filters open, close them to add.</div>` },
  '2-add-strip-3x.png': { w: 1170, body: `
     ${cap('1 · Tap the blank pin', 'Phone in Safari (390×664). A pencilled pin with a tag that says + ADD, at the map’s lower right.')}${band('2a-tap-664-3x.png', 220, 560)}
     ${cap('2 · Search', 'The list drops and its band becomes the search line, keyboard up. Results rise from it, never over the zoom or your account button. (Keyboard drawn.)')}${band('2b-search-664-3x.png', 0, 340)}
     ${cap('3 · The pin stands on the place', 'The map goes there, and the form is a blank tag hanging from the pencilled pin. ADD LOCATION is on the tag’s stub, near your thumb.')}${band('2c-placed-664-3x.png', 250, 664)}<div class="gap"></div>` },
  '2d-done-3x.png': { w: 1170, body: `${cap('4 · Added', 'The pencilled pin is inked: the new place’s real pin and its real tag open, its row selected and in view. While the tag is open the + ADD pin steps aside. (390×844)')}${img('2d-done-844-3x.png', 'width:1170px')}` },
  '3-tag-open-3x.png': { w: 1170, body: `${cap('3 · A place’s tag open', 'One tag at a time: the + ADD pin steps aside while a tag is open. Close the tag to add.')}${img('3-tag-open-3x.png', 'width:1170px')}` },
  '4b-size-3x.png': { w: 1170, body: `
     ${cap('How big', 'Today’s + (top corner) next to the pin at two sizes, all at real phone scale')}
     <div class="row" style="gap:0;padding:0 0 0 0">
       <div class="col">${crop(STUB + '/1-rest-today-3x.png', 264, 0, 130, 100)}<div class="sub" style="padding:12px 20px">Today: 50px navy badge</div></div>
       <div class="col">${crop('size-s1-3x.png', 264, 422, 130, 100)}<div class="sub" style="padding:12px 20px">Pin, tag 44px wide</div></div>
       <div class="col">${crop('size-s125-3x.png', 264, 422, 130, 100)}<div class="sub" style="padding:12px 20px"><b>Chosen:</b> tag 55px wide</div></div></div>
     ${cap('On the whole screen', 'Left: tag 44px wide. Right: 55px, the one we’d build. Tap area 65×83.')}
     <div class="row" style="gap:20px">${img('size-s1-3x.png', 'width:575px')}${img('size-s125-3x.png', 'width:575px')}</div><div class="gap"></div>` },
  '4-states-3x.png': { w: 1170, body: `
     <div class="row" style="gap:0;align-items:flex-start">
       <div class="col" style="width:585px">${cap('Rest')}${img('st-pin-rest-3x.png', 'width:585px')}</div>
       <div class="col" style="width:585px">${cap('Pressed')}${img('st-pin-pressed-3x.png', 'width:585px')}</div></div>
     ${cap('At real size (1x)', 'The same pin, pixel for pixel as a phone without a Retina screen draws it, enlarged 3 times without smoothing')}${img('st-pin-1x-1x.png', 'width:648px;image-rendering:pixelated;margin-left:36px')}
     ${cap('Starring prints the band', 'Tap STAR on the blank tag: its top is printed orange, as on a starred tag')}${band('6a-starred-664-3x.png', 250, 600)}
     ${cap('District or street', 'Same tag; Address is not needed, the hint shows, the tag re-hangs')}${band('6b-district-664-3x.png', 220, 600)}<div class="gap"></div>` },
};
(async () => {
  const b = await chromium.launch({ executablePath: `/opt/pw-browsers/${dd}/chrome-linux/chrome`, args: ['--allow-file-access-from-files'] });
  for (const [n, p] of Object.entries(pages)) {
    const pg = await b.newPage({ viewport: { width: p.w, height: 400 }, deviceScaleFactor: 1 });
    const tmp = path.join(D, '.compose.html');
    fs.writeFileSync(tmp, `<!doctype html><meta charset=utf-8><style>${CSS}</style><body>${p.body}</body>`);
    await pg.goto('file://' + tmp); await pg.waitForTimeout(400);
    await pg.screenshot({ path: path.join(D, n), fullPage: true }); await pg.close(); fs.unlinkSync(tmp);
    console.log('wrote', path.join(D, n));
  }
  await b.close();
})();
