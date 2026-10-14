// CONCEPTS turn 1 owner stills (visual designer): 1170 wide (3x of a 390 phone), captioned. Run after stills.js:
//   node compose.js  (ONLY=<substring>)
// Writes P-blank-pin/P*.png, A-header-tag/A*.png, blank-tag-form/T*.png.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'); const path = require('path');
const dd = fs.readdirSync('/opt/pw-browsers').filter(x => /^chromium-\d+$/.test(x)).sort().pop();
const C = __dirname, CON = path.dirname(C), R = C + '/raw/';
const f = n => R + n + (n.endsWith('-1x') ? '.png' : '-3x.png');
const img = (p, style = '') => `<img src="file://${p}" style="display:block;${style}">`;
const cap = (t, sub) => `<div class="cap">${t}</div>${sub ? `<div class="sub">${sub}</div>` : ''}`;
const lab = t => `<div class="lab">${t}</div>`;
const cost = t => `<div class="cost"><b>Cost:</b> ${t}</div>`;
const note = t => `<div class="cost">${t}</div>`;
// a window (css px) of a 3x frame of width vw, drawn at s display px per css px
const crop = (p, x0, y0, x1, y1, s, vw = 390, extra = '') => `<div style="width:${(x1 - x0) * s}px;height:${(y1 - y0) * s}px;overflow:hidden;flex:none;${extra}">${img(p, `width:${vw * s}px;margin:${-y0 * s}px 0 0 ${-x0 * s}px`)}</div>`;
// a window of a 1x frame, enlarged without smoothing; blur = the squint test
const crop1 = (p, x0, y0, x1, y1, s, blur) => `<div style="width:${(x1 - x0) * s}px;height:${(y1 - y0) * s}px;overflow:hidden;flex:none">${img(p, `width:${390 * s}px;margin:${-y0 * s}px 0 0 ${-x0 * s}px;image-rendering:pixelated;${blur ? `filter:blur(${4 * s}px)` : ''}`)}</div>`;
const col = (t, inner, w) => `<div class="col" style="width:${w}px">${lab(t)}${inner}</div>`;
const pair = (lf, lt, rf, rt, h) => `<div class="row" style="gap:20px">${col(lt, crop(lf, 0, 0, 390, h, 575 / 390), 575)}${col(rt, crop(rf, 0, 0, 390, h, 575 / 390), 575)}</div>`;
const full = p => img(p, 'width:1170px');
// the journey: n frames of 390x664, numbered
const journey = steps => { const w = Math.floor((1170 - 30 - (steps.length - 1) * 12) / steps.length), s = w / 390;
  return `<div class="row" style="padding:0 15px;gap:12px">${steps.map(([n, t], i) => `<div class="col" style="width:${w}px"><div class="lab small"><span class="num">${i + 1}</span>${t}</div>${crop(f(n), 0, 0, 390, 664, s, 390, 'border:1px solid #cfc4ae')}</div>`).join('')}</div>`; };
const CSS = `body{margin:0;background:#E9E2D3;font-family:'DejaVu Sans Condensed','Arial Narrow',sans-serif;color:#12293F;width:1170px}
 .cap{font-weight:700;letter-spacing:.05em;text-transform:uppercase;font-size:40px;padding:26px 30px 12px}
 .sub{font-size:33px;padding:0 30px 22px;color:#3d4a55;line-height:1.3}
 .lab{font-weight:700;font-size:28px;letter-spacing:.03em;padding:12px 0 10px;line-height:1.2} .lab.small{font-size:24px;height:96px;overflow:hidden}
 .num{display:inline-block;width:34px;height:34px;border-radius:50%;background:#12293F;color:#F2EBDD;text-align:center;line-height:34px;font-size:22px;margin-right:8px}
 .cost{font-size:33px;padding:22px 30px 30px;line-height:1.3} .cost b{color:#A8400C}
 .row{display:flex;align-items:flex-start} .col{flex:none} .gap{height:24px}`;
const P = CON + '/P-blank-pin/', A = CON + '/A-header-tag/', T = C + '/';
const pages = {
  // ================= P · BLANK PIN =================
  [P + 'P1-rest-vs-today-3x.png']: `${cap('P · the blank pin', 'The + is a place’s pin, held above the map, not yet placed: the app’s own round pin in the action orange, on a short needle with its shadow on the ground. Bottom-left, by your thumb. The account badge is alone at the top.')}
     ${pair(f('today-rest'), 'Today', f('p-rest'), 'P', 640)}
     ${note('The needle is the string the tag comes down when you tap it. When you add a place, this pin lands on the map and becomes that place.')}`,
  [P + 'P2-1x-pin-or-button-3x.png']: `${cap('At real size (1x): a pin, or a button?', 'Left: P. Right: a stock app “add” button (a FAB) the same size, for comparison. Below: blurred, the squint test. The + should come before the account badge.')}
     <div class="row" style="padding:0 30px;gap:18px">${col('P, 1x', crop1(f('p-rest-1x'), 0, 0, 390, 560, 1.4), 546)}${col('Stock FAB, 1x', crop1(f('p-fab-1x'), 0, 0, 390, 560, 1.4), 546)}</div>
     <div class="row" style="padding:0 30px;gap:18px">${col('P, blurred', crop1(f('p-rest-1x'), 0, 0, 390, 560, 1.4, true), 546)}${col('FAB, blurred', crop1(f('p-fab-1x'), 0, 0, 390, 560, 1.4, true), 546)}</div>
     <div class="row" style="padding:0 30px;gap:18px">${col('Close-up, 1x ×4', crop1(f('p-rest-1x'), 0, 410, 136, 545, 4), 544)}${col('', crop1(f('p-fab-1x'), 0, 410, 136, 545, 4), 544)}</div>
     ${note('Measured (systems): P is 1.4× the account badge’s weight when blurred; the FAB is 1.9×. The needle and its ground shadow are what say “pin”: the button floats, the pin is about to go in.')}`,
  [P + 'P3-journey-3x.png']: `${cap('Adding, start to finish (Safari, 390×664)', 'One object the whole way: the pin carries a blank tag, you write on it, the ink goes on, the pin is now the place.')}
     ${journey([['p-rest664', 'Tap the pin'], ['f-typing664', 'The tag drops down its string. Type.'], ['f-picked664', 'Pick: the pin lands. Tap ADD.'], ['f-inking664', 'The pencil inks. TYPE is stamped.'], ['f-done664', 'The place’s own tag. Close it: a new blank pin.']])}
     <div class="gap"></div>`,
  [P + 'P4-tag-open-3x.png']: `${cap('A place’s tag open', 'The blank pin steps aside while a place’s tag is open, and comes back when you close it. With the filters open it’s under them the same way.')}
     ${full(f('p-tag664'))}${cost('one extra tap to add while a place’s tag or the filters are open (close it first). The header tag (A) has no such step.')}`,
  [P + 'P5-sizes-3x.png']: `${cap('Small phone, list down', 'Left: 320 wide (the credit drops “Leaflet |” so the pin has room). Right: list down on the Home Screen app: the pin rides the list’s edge.')}
     <div class="row" style="gap:20px;padding:0 0 0 0">${col('320 × 568', crop(f('p-rest320'), 0, 0, 320, 568, 575 / 320, 320), 575)}${col('List down', crop(f('p-collapsed'), 0, 300, 390, 844, 575 / 390), 575)}</div><div class="gap"></div>`,
  [P + 'P6-pressed-and-also-tried-3x.png']: `${cap('Pressed, and one route we dropped', 'Left: pressed (deep orange, paper +), the same as every orange action. Right, also tried: the blank tag tucked behind the list, its top showing. Dropped: it needs the map credit moved, it’s two things at the list’s edge, and it gets its weight from the paper, not the +.')}
     <div class="row" style="gap:20px">${col('Pressed', crop(f('p-pressed'), 0, 420, 138, 560, 575 / 138), 575)}${col('Also tried: tag in a pocket', crop(f('p-v3'), 0, 420, 138, 560, 575 / 138), 575)}</div><div class="gap"></div>`,
  // ================= A · HEADER TAG =================
  [A + 'A1-rest-vs-today-3x.png']: `${cap('A · the header tag', 'Round 7’s orange tag cut at the end of the list header, with the +. Tapping it pulls a blank tag up out of it: the same blank tag as the pin’s.')}
     ${pair(f('today-rest'), 'Today', f('a-rest'), 'A', 700)}
     ${cost('the list title is 32px shorter; the + is on the right (you asked about the left).')}`,
  [A + 'A2-1x-3x.png']: `${cap('At real size (1x)', 'Account badge at the top, the tag at the end of the list header. Right: blurred.')}
     <div class="row" style="padding:0 30px;gap:18px">${col('A, 1x', crop1(f('a-rest-1x'), 0, 0, 390, 620, 1.4), 546)}${col('Blurred', crop1(f('a-rest-1x'), 0, 0, 390, 620, 1.4, true), 546)}</div><div class="gap"></div>`,
  [A + 'A3-journey-3x.png']: `${cap('Adding, start to finish (Safari, 390×664)', 'The tag comes up out of the header with a blank pin on its string. The header tag turns into a navy × (a second cancel) until you add.')}
     ${journey([['a-rest664', 'Tap the header tag'], ['a-typing664', 'The tag comes up with its pin. Type.'], ['a-picked664', 'Pick: the pin lands. Tap ADD.'], ['a-inking664', 'The pencil inks. TYPE is stamped.'], ['a-done664', 'The place’s own tag. The header is + again.']])}
     <div class="gap"></div>`,
  [A + 'A4-tag-open-3x.png']: `${cap('A place’s tag open', 'The header tag is still there to tap: adding closes the place’s tag, and cancelling brings it back. No extra step, here or with the filters open.')}${full(f('a-tag664'))}<div class="gap"></div>`,
  [A + 'A5-float-frame-3x.png']: `${cap('The same blank tag from the badge (Float)', 'Round 7’s orange badge at the bottom-left opens the same blank tag; the badge turns into a navy × while you add.')}
     ${pair(f('fl-rest664'), 'At rest', f('fl-picked664'), 'Picked, about to ADD', 664)}<div class="gap"></div>`,
  // ================= THE BLANK TAG (both) =================
  [T + 'T1-typing-3x.png']: `${cap('The blank tag: type the name', 'The name line is the search. What you type is pencil. The results are printed on the tag under it; a half row shows there are more. ADD is on the tag’s stub, under the keyboard for now.')}${full(f('f-typing664'))}<div class="gap"></div>`,
  [T + 'T2-blank-and-no-results-3x.png']: `${cap('Before you type, and no results', 'Left: just tapped, the keyboard is up on NAME. Right: nothing found, said on the tag; what you typed stays.')}
     <div class="row" style="gap:20px">${col('Blank', crop(f('f-blank664'), 0, 0, 390, 330, 575 / 390), 575)}${col('No results', crop(f('f-nores664'), 0, 0, 390, 330, 575 / 390), 575)}</div><div class="gap"></div>`,
  [T + 'T3-picked-3x.png']: `${cap('Picked: check it, then ADD', 'The pin lands on the place and the tag hangs from it, filled in in pencil: address and city, NOTES to write on, TYPE guessed (tap to change). ADD is navy: on a tag, orange means starred.')}${full(f('f-picked664'))}<div class="gap"></div>`,
  [T + 'T4-starred-visited-3x.png']: `${cap('Starred, visited and a note, while adding', 'STAR prints the orange band, exactly as on a starred place’s tag. VISITED stamps, as on the real tag. The note is pencil until you add.')}${full(f('f-starred664'))}<div class="gap"></div>`,
  [T + 'T5-ink-over-3x.png']: `${cap('ADD: the pencil inks', 'Left to right: before, the moment of ADD (the name inks, TYPE is stamped, the pin takes the place’s icon), and after: the place’s own tag, its row selected in the list.')}
     <div class="row" style="padding:0 15px;gap:12px">${[['f-picked664', 'Before'], ['f-inking664', 'ADD'], ['f-done664', 'After']].map(([n, t]) => col(t, crop(f(n), 0, 0, 390, 664, 370 / 390, 390, 'border:1px solid #cfc4ae'), 372)).join('')}</div><div class="gap"></div>`,
  [T + 'T6-district-3x.png']: `${cap('A district or a street', 'Same tag, same ADD. A district isn’t a point, so the pin stays held above it; on ADD it fades as the outline draws in and the tag hangs from the area’s centre dot.')}${full(f('f-shape664'))}<div class="gap"></div>`,
  [T + 'T7-questions-3x.png']: `${cap('When the app needs an answer', 'Left: a place outside your cities: the tag asks, with two answers, and ADD waits. Right: the save failed: the tag stays as it was, nothing lost.')}
     <div class="row" style="gap:20px">${col('New city', crop(f('f-newcity664'), 0, 180, 390, 584, 575 / 390), 575)}${col('Couldn’t save', crop(f('f-failed664'), 0, 180, 390, 584, 575 / 390), 575)}</div><div class="gap"></div>`,
  [T + 'T8-320-3x.png']: `${cap('Smallest phone (320 × 568)', 'Typing: three results above the keyboard. Picked: the whole tag and ADD in view.')}
     <div class="row" style="gap:20px">${col('Typing', crop(f('f-typing320'), 0, 0, 320, 568, 575 / 320, 320), 575)}${col('Picked', crop(f('f-picked320'), 0, 0, 320, 568, 575 / 320, 320), 575)}</div><div class="gap"></div>`,
};
(async () => {
  const b = await chromium.launch({ executablePath: `/opt/pw-browsers/${dd}/chrome-linux/chrome`, args: ['--allow-file-access-from-files'] });
  for (const [n, body] of Object.entries(pages).filter(([n]) => !process.env.ONLY || n.includes(process.env.ONLY))) {
    const pg = await b.newPage({ viewport: { width: 1170, height: 400 }, deviceScaleFactor: 1 });
    const tmp = path.join(C, '.compose.html');
    fs.writeFileSync(tmp, `<!doctype html><meta charset=utf-8><style>${CSS}</style><body>${body}</body>`);
    await pg.goto('file://' + tmp); await pg.waitForTimeout(500);
    await pg.screenshot({ path: n, fullPage: true }); await pg.close(); fs.unlinkSync(tmp);
    console.log('wrote', path.relative(CON, n));
  }
  await b.close();
})();
