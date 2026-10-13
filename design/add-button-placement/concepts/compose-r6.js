// Round 6 owner stills (visual designer): captioned, 1170 wide (3x of a 390 phone). Every still 1 and every 1x crop has
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
const pages = {
  // ---------------- FLOAT ----------------
  'E-float/R6-F1-vs-account-3x.png': `${cap('Float · + outranks account', 'Round 5b on the left. Now the + is orange, one size bigger (60px against the account’s 50) and cut with a finer, postage-stamp edge.')}
     ${pair(E + 'f-today-3x.png', 'Round 5b: the twin', E + 'f-orange-big-seal-3x.png', 'Round 6: + first, account second')}
     <div class="cost"><b>Cost:</b> the badge is 10px wider and taller, and grows up and left from the same corner (still 20px from the side and the list). The account badge isn’t touched.</div>`,
  'E-float/R6-F2-1x.png': `${cap('At real size (1x)', 'The right edge of the phone, from the account badge down to the list. Right: the same, blurred. The + should still come first.')}
     ${oneX(E + 'f-orange-big-seal-1x.png', 'Float')}<div class="gap"></div>`,
  'E-float/R6-F3-dials-3x.png': `${cap('Three dials, one at a time', 'Colour, size and edge. Each one alone still leaves a pair. Together they don’t.')}
     <div class="row" style="padding:0 30px;gap:24px">${strip(E + 'f-today-3x.png', 'Today')}${strip(E + 'f-orange-3x.png', 'Orange only')}${strip(E + 'f-navy-big-3x.png', 'Bigger only')}${strip(E + 'f-orange-big-3x.png', 'Orange + bigger')}</div>
     <div class="row" style="padding:0 30px;gap:24px">${strip(E + 'f-orange-big-seal-3x.png', 'Pick: + stamp edge')}${strip(E + 'f-orange-big-rosette-3x.png', '<span class="kill">Flower: out</span>')}${strip(E + 'f-navy-big-rosette-3x.png', '<span class="kill">Navy: a pair</span>')}</div>
     <div class="cost"><b>Pick:</b> orange, 60px, postage edge. Orange alone looks lighter than the navy account badge, and bigger alone still reads as a pair. Big lobes read as a flower or a gear (settings).</div>`,
  'E-float/R6-F4-account-step-3x.png': `${cap('Flag: the one frame that touches the account badge', 'Not ours to design (the sign-in crew owns it). Shown only to see if it’s needed: the account badge one step smaller (40px), nothing else changed.')}
     ${pair(E + 'f-orange-big-seal-3x.png', 'Account as it is', E + 'f-acct-small-3x.png', 'Account at 40px')}
     <div class="cost"><b>Our read:</b> not needed. The + already ranks first with the account unchanged.</div>`,
  'E-float/R6-F5-states-3x.png': `${cap('Pressed, a tag open, adding', 'Pressed: deep orange with a paper +, like ADD LOCATION. Adding: the badge goes navy with a paper ×, so ADD LOCATION stays the one orange button.')}
     <div class="row" style="padding:0 30px;gap:24px">${col('Pressed', crop(E + 'f-pick-pressed-3x.png', 230, 400, 390, 560, 2), 320)}${col('Tag open', crop(E + 'f-pick-tag-3x.png', 230, 400, 390, 560, 2), 320)}${col('Adding', crop(E + 'f-pick-form-3x.png', 230, 690, 390, 790, 2), 320)}</div><div class="gap"></div>`,
  // ---------------- A ----------------
  'stub/R6-A1-vs-account-3x.png': `${cap('A · Admission ticket', 'Round 5b on the left. Now the tear line is inside the ticket, with a half-round notch at each end, like a rail or museum ticket and the tag’s own stub.')}
     ${pair(A + 'a-ticket-3x.png', 'Round 5b: coat check', A + 'a-admit-3x.png', 'Round 6: admission ticket')}
     <div class="cost"><b>Cost:</b> the same as before: the list title gets 32px shorter (‘list’ drops first, and at 320 the count too). It says “ticket”, but not “place”: see the routes.</div>`,
  'stub/R6-A2-1x.png': `${cap('At real size (1x)', 'Account badge at the top, the ticket at the end of the list header. Right: blurred.')}
     ${oneX(A + 'a-admit-1x.png', 'A')}<div class="gap"></div>`,
  'stub/R6-A3-routes-3x.png': `${cap('A · ways to say “a ticket to a place”', 'Close-ups at 3x, then the same at 1x. Pick: admission.')}
     <div class="row" style="padding:0 30px;gap:12px">${['ticket', 'admit', 'tagcut', 'punchdisc', 'punchdrop'].map((v, i) => col(['5b coat check', 'Admission', 'Tag cut', 'Round punch', 'Pin punch'][i], crop(A + `a-${v}-3x.png`, 318, 536, 390, 608, 2.85), 205)).join('')}</div>
     <div class="row" style="padding:0 30px;gap:12px">${['ticket', 'admit', 'tagcut', 'punchdisc', 'punchdrop'].map(v => col('', crop1(A + `a-${v}-1x.png`, 318, 536, 390, 608, 2.85), 205)).join('')}</div>
     <div class="cost"><b>Admission:</b> reads as a ticket. <b>Tag cut:</b> reads as a place’s tag, but stops being a ticket. <span class="kill"><b>Round punch:</b> a dot (our pin is round, so its punch is a dot). <b>Pin punch:</b> a water drop, and not our pin.</span> So A is a ticket for adding. Only the tag cut says “place” without an extra mark.</div>`,
  // ---------------- C ----------------
  'C-pin/R6-C1-vs-account-3x.png': `${cap('C · Pin and tag', 'The pin is the map’s own selected pin (the one whose tag is open), with a + where the category icon goes. Its tag is the place tag, blank, in miniature.')}
     ${pair(P5 + 'rest-3x.png', 'Round 5b', P + 'c-hi-big-3x.png', 'Round 6, among real pins')}
     <div class="cost"><b>Cost:</b> the form becomes a tag on the map; with a tag or the filters open, you close them to add. The pin and its tag stand 94px tall in the corner, 16px from the side and 20px above the list.</div>`,
  'C-pin/R6-C2-1x.png': `${cap('At real size (1x)', 'Account badge at the top, real pins between them. Right: blurred.')}
     ${oneX(P + 'c-hi-big-1x.png', 'C')}<div class="gap"></div>`,
  'C-pin/R6-C3-pins-3x.png': `${cap('C · which pin, where the + goes', 'Every pin is drawn by the app’s own pin code, at map size, beside the real ones.')}
     <div class="row" style="padding:0 30px;gap:14px">${[['solid', 'Pin with +'], ['dashed', 'Dashed (“approx.”)'], ['tagplus', '+ on the tag'], ['hi', 'Selected pin'], ['hi-big', 'Selected, bigger tag (pick)']].map(([v, t]) => col(t, crop(P + `c-${v}-3x.png`, 262, 360, 390, 535, 1.6), 205)).join('')}</div>
     <div class="row" style="padding:0 30px;gap:14px">${['solid', 'dashed', 'tagplus', 'hi', 'hi-big'].map(v => col('', crop1(P + `c-${v}-1x.png`, 262, 360, 390, 535, 1.6), 205)).join('')}</div>
     <div class="cost"><b>Pick: the selected pin, bigger tag.</b> On the map, a pin with its tag open looks just like this (a filled disc). The smaller pins read as pins but rank below the account badge. A + on the tag makes the pin an empty ring again (the 5b problem).</div>`,
  // ---------------- D ----------------
  'D-floated-ticket/R6-D1-floated-ticket-3x.png': `${cap('D · Floated ticket (rough, one frame)', 'A’s admission ticket, loose in the Float’s corner. Right: pinned to the map with our pin.')}
     <div class="row" style="padding:0 30px;gap:20px">${col('Floated ticket', crop(D + 'd-bare-3x.png', 150, 0, 390, 610, 1.15), 276)}${col('Pinned', crop(D + 'd-pinned-3x.png', 230, 420, 390, 540, 2.5), 400)}${col('1x', crop1(D + 'd-bare-1x.png', 230, 420, 390, 540, 2.5), 400)}</div>
     <div class="cost"><b>Verdict: kill.</b> It reads as “A moved to the corner” (kill rule 1). The pinned cut needs two marks to say “place”, and the empty pin reads as a placeholder (kill rule 2). It does outrank the account badge, as the orange Float does.</div>`,
};
(async () => {
  const b = await chromium.launch({ executablePath: `/opt/pw-browsers/${dd}/chrome-linux/chrome`, args: ['--allow-file-access-from-files'] });
  for (const [n, body] of Object.entries(pages).filter(([n]) => !process.env.ONLY || n.includes(process.env.ONLY))) {
    const pg = await b.newPage({ viewport: { width: 1170, height: 400 }, deviceScaleFactor: 1 });
    const tmp = path.join(C, '.compose-r6.html');
    fs.writeFileSync(tmp, `<!doctype html><meta charset=utf-8><style>${CSS}</style><body>${body}</body>`);
    await pg.goto('file://' + tmp); await pg.waitForTimeout(400);
    await pg.screenshot({ path: path.join(C, n), fullPage: true }); await pg.close(); fs.unlinkSync(tmp);
    console.log('wrote', n);
  }
  await b.close();
})();
