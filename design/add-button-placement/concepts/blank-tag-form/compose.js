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
// the tappables audit: the filled card cropped at 3.34x, numbered dots at each tappable's top-left (measure.json)
const M = JSON.parse(fs.readFileSync(R + 'measure.json', 'utf8'));
function taps() { const t = M['r9-f-card664'].taps, x0 = 20, y0 = 300, x1 = 370, y1 = 584, sc = 1170 / (x1 - x0);
  const pts = [t.x[0], t.chips[0], t.notes[0], t.chips[1], t.segs[0], t.segs[1], t.segs[2]];
  const dots = pts.map((b, i) => { const cx = ((b[0] + b[2]) / 2 - x0) * sc, cy = (b[1] - y0) * sc; return `<div style="position:absolute;left:${cx - 26}px;top:${cy - 30}px;width:52px;height:52px;border-radius:50%;background:#A8400C;color:#fff;font-size:30px;font-weight:700;text-align:center;line-height:52px;box-shadow:0 0 0 4px #F2EBDD">${i + 1}</div>`; }).join('');
  return `<div style="position:relative;width:1170px">${crop(f('r9-f-card664'), x0, y0, x1, y1, sc)}${dots}</div>`; }
const CSS = `body{margin:0;background:#E9E2D3;font-family:'DejaVu Sans Condensed','Arial Narrow',sans-serif;color:#12293F;width:1170px}
 .cap{font-weight:700;letter-spacing:.05em;text-transform:uppercase;font-size:40px;padding:26px 30px 12px}
 .sub{font-size:33px;padding:0 30px 22px;color:#3d4a55;line-height:1.3}
 .lab{font-weight:700;font-size:28px;letter-spacing:.03em;padding:12px 0 10px;line-height:1.2} .lab.small{font-size:24px;height:96px;overflow:hidden}
 .num{display:inline-block;width:34px;height:34px;border-radius:50%;background:#12293F;color:#F2EBDD;text-align:center;line-height:34px;font-size:22px;margin-right:8px}
 .cost{font-size:33px;padding:22px 30px 30px;line-height:1.3} .cost b{color:#A8400C}
 .row{display:flex;align-items:flex-start} .col{flex:none} .gap{height:24px}`;
const R11 = CON + '/C-tag-r11/', R10 = CON + '/C-tag-r10/', EF = CON + '/E-float/', P = CON + '/P-blank-pin/', A = CON + '/A-header-tag/', T = C + '/', CP = CON + '/C-pintag/';
const pages = {
  // ================= P · BLANK PIN =================
  [P + 'P1-rest-vs-today-3x.png']: `${cap('P · the blank pin', 'The + is a place’s pin, held above the map, not yet placed: the app’s own round pin in the action orange, on a short needle with its shadow on the ground. Bottom-left, by your thumb. The account badge is alone at the top.')}
     ${pair(f('today-rest'), 'Today', f('p-rest'), 'P', 640)}
     ${note('The needle is the string the tag comes down when you tap it. When you add a place, this pin lands on the map and becomes that place.')}`,
  [P + 'P2-1x-pin-or-button-3x.png']: `${cap('At real size (1x): a pin, or a button?', 'Left: P, with a 2px needle and its shadow on the ground. Right: a stock app “add” button (a FAB) the same size, for comparison. Below: blurred, the squint test. The + should come before the account badge.')}
     <div class="row" style="padding:0 30px;gap:18px">${col('P, 1x', crop1(f('p-rest-1x'), 0, 0, 390, 560, 1.4), 546)}${col('Stock FAB, 1x', crop1(f('p-fab-1x'), 0, 0, 390, 560, 1.4), 546)}</div>
     <div class="row" style="padding:0 30px;gap:18px">${col('P, blurred', crop1(f('p-rest-1x'), 0, 0, 390, 560, 1.4, true), 546)}${col('FAB, blurred', crop1(f('p-fab-1x'), 0, 0, 390, 560, 1.4, true), 546)}</div>
     <div class="row" style="padding:0 30px;gap:18px">${col('Close-up, 1x ×4', crop1(f('p-rest-1x'), 0, 410, 136, 545, 4), 544)}${col('', crop1(f('p-fab-1x'), 0, 410, 136, 545, 4), 544)}</div>
     ${note('Measured (systems): P is 1.4× the account badge’s weight when blurred; the FAB is 1.9×. The needle and its ground shadow are what say “pin”: the button floats, the pin is about to go in.')}`,
  [P + 'P3-tap-3x.png']: `${cap('Tap the pin (Safari, 390×664)', 'It rises to the top and a blank tag drops down its string: every line printed and empty, ready to fill in. Type the name; results print on the tag. Picking, ADD and after are the same for both packages (T3, T5).')}
     ${pair(f('p-rest664'), 'At rest', f('f-typing664'), 'Tapped: type the name', 664)}<div class="gap"></div>`,
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
  [A + 'A3-tap-3x.png']: `${cap('Tap the header tag (Safari, 390×664)', 'A blank tag comes up out of it: the same blank tag as C’s, its eyelet empty until you add. The header tag turns into a navy × (a second cancel) until you add.')}
     ${pair(f('a-rest664'), 'At rest', f('r9-a-typing664'), 'Tapped: type the name', 664)}<div class="gap"></div>`,
  [A + 'A4-tag-open-3x.png']: `${cap('A place’s tag open', 'The header tag is still there to tap: adding closes the place’s tag, and cancelling brings it back. No extra step, here or with the filters open.')}${full(f('a-tag664'))}<div class="gap"></div>`,
  [A + 'A5-float-frame-3x.png']: `${cap('The same blank tag from the badge (Float)', 'Round 7’s orange badge at the bottom-left opens the same blank tag; the badge turns into a navy × while you add.')}
     ${pair(f('fl-rest664'), 'At rest', f('r9-fl-card664'), 'Filled in, about to ADD', 664)}<div class="gap"></div>`,
  // ================= THE BLANK TAG (both) =================
  [T + 'T0-pencil-vs-greyed-1x.png']: `${cap('Pencil, not greyed out (real size, 1x)', 'Each strip is a real 1x screen, blown up 3× so you can see the pixels. Pencil should read as writing, not as something switched off.')}
     <div style="padding:0 30px">
     ${lab('1 · Pencil: what you’ve written, before ADD')}${crop1(f('r9-cmp-pencil-1x'), 45, 376, 345, 419, 3.7)}
     ${lab('2 · Inked: the same name once added')}${crop1(f('cmp-ink-1x'), 45, 184, 345, 222, 3.7)}
     ${lab('3 · Greyed out: signed-out Star and Visited (disabled)')}${crop1(f('cmp-off-1x'), 45, 280, 345, 336, 3.7)}
     ${lab('4 · Printed: ADD before there’s a name')}${crop1(f('cmp-blank-1x'), 45, 332, 345, 388, 3.7)}
     </div>${note('Pencil is a cool, dark graphite with grain you can see and a slight sheen; greyed out is the warm ink faded. Printed words are small caps; pencil keeps the face it will have in ink.')}`,
  [T + 'T1-typing-3x.png']: `${cap('The blank tag: type the name', 'The name line is the search; what you type is pencil, and the results print on the tag. The map stays still behind it. The eyelet is empty: the pin goes in when you add.')}${full(f('r9-f-typing664'))}<div class="gap"></div>`,
  [T + 'T2-blank-and-no-results-3x.png']: `${cap('Just tapped, and no results', 'Left: the whole blank tag, every line printed and empty; the keyboard is up on NAME. Right: nothing found, said on the tag; what you typed stays.')}
     ${pair(f('r9-f-blank664'), 'Blank', f('r9-f-nores664'), 'No results', 664)}<div class="gap"></div>`,
  [T + 'T3-picked-3x.png']: `${cap('Picked: check it, then ADD', 'The keyboard drops and the tag settles on the list, filled in in pencil. The map hasn’t moved and nothing is pinned yet: the words say where it is. City and TYPE are the app’s own chips: tap to change. ADD is navy: on a tag, orange means starred.')}${full(f('r9-f-card664'))}<div class="gap"></div>`,
  [T + 'T4-starred-visited-3x.png']: `${cap('Starred, visited and a note, while adding', 'STAR prints the orange band, exactly as on a starred place’s tag. VISITED stamps, as on the real tag. A long note shows in full; its line grows.')}${full(f('r9-f-starred664'))}<div class="gap"></div>`,
  [T + 'T5-ink-over-3x.png']: `${cap('ADD: the map moves once, and the pin goes in', 'Tap ADD: the map flies to the place and brings it to the tag, the pin drops into the eyelet, the pencil inks and TYPE is stamped. It’s the place’s own tag now, and DIRECTIONS sits where ADD was, under your thumb. That’s the only time the map moves.')}
     ${pair(f('r9-f-card664'), 'Before: tap ADD', f('r9-f-after664'), 'After: pinned on the place', 664)}<div class="gap"></div>`,
  [T + 'T6-district-3x.png']: `${cap('A district or a street', 'Same tag, same ADD. On ADD the map frames the outline, it draws in, and the tag hangs from the area’s centre dot.')}${full(f('r9-f-shape664'))}<div class="gap"></div>`,
  [T + 'T7-questions-3x.png']: `${cap('When the app needs an answer', 'Left: a place outside your cities. The question prints on the tag and its two answers take ADD’s place on the stub, where your thumb is: ADD LISBON or PICK FROM MY LIST. Right: the save failed; the tag stays as it was, nothing lost.')}
     ${pair(f('r9-f-newcity664'), 'New city', f('r9-f-failed664'), 'Couldn’t save', 664)}<div class="gap"></div>`,
  [T + 'T8-320-3x.png']: `${cap('Smallest phone (320 × 568)', 'Typing: three results above the keyboard. Filled in: the whole tag and ADD in view.')}
     <div class="row" style="gap:20px">${col('Typing', crop(f('r9-f-typing320'), 0, 0, 320, 568, 575 / 320, 320), 575)}${col('Filled in', crop(f('r9-f-card320'), 0, 0, 320, 568, 575 / 320, 320), 575)}</div><div class="gap"></div>`,
  [T + 'T9-tappables-3x.png']: `${cap('Everything you can tap reads as a button', 'The filled-in tag at full size, each tappable numbered. Each one uses a control the app already has.')}
     ${taps()}
     <div class="cost" style="font-size:31px">
     <b style="color:#12293F">1 · ×</b> the tag’s own close, as on every tag.<br>
     <b style="color:#12293F">2 · City</b> and <b style="color:#12293F">4 · Type</b> are the filter chips from the filter panel: outlined, with a ⌄. Type shows the category’s icon and colour, so you see the pin you’ll get.<br>
     <b style="color:#12293F">3 · Notes</b> is a line to write on, with its label; the whole line is the tap target.<br>
     <b style="color:#12293F">5 · ADD</b> navy, the one action on the tag. <b style="color:#12293F">6 · Star</b> and <b style="color:#12293F">7 · Mark visited</b>: the real tag’s segments, unchanged.</div>`,
  // ================= C · PIN+TAG (round 9b) =================
  [CP + 'C1-real-size-3x.png']: `${cap('C · a blank tag pinned to the map, at real size', 'This is how it looks on your phone (1x, each pixel as you’d see it), with the app’s own pins and the account badge. One of the app’s pins, its icon a +, pushed through the eyelet of a blank luggage tag with two lines to write on.')}
     ${crop1(f('r9-c-rest-1x'), 0, 0, 390, 544, 3)}<div class="gap"></div>`,
  [CP + 'C2-also-tried-3x.png']: `${cap('Also tried: the tag hanging below the pin', 'The arrangement you asked to revisit: the same pin with its +, a blank tag hanging from it on its string. Left: the pick; right: this one, both at real size.')}
     <div class="row" style="gap:30px">${col('Pick', crop1(f('r9-c-rest-1x'), 0, 382, 190, 525, 3), 570)}${col('Also tried', crop1(f('r9-c-alt-1x'), 0, 382, 190, 525, 3), 570)}</div>
     ${note('Why the tag lies flat: hanging, a tag this small reads as a box with a hat, and the pin and tag stand twice as tall over the map.')}`,
  [CP + 'C3-rest-vs-today-3x.png']: `${cap('C beside today', 'Bottom-left, by your thumb; the account badge is alone at the top.')}
     ${pair(f('r9-today'), 'Today', f('r9-c-rest'), 'C', 640)}<div class="gap"></div>`,
  [CP + 'C4-squint-1x.png']: `${cap('The squint test', 'The same screen blurred: the + should come before the account badge.')}
     <div class="row" style="padding:0 30px;gap:18px">${col('C, 1x', crop1(f('r9-c-rest-1x'), 0, 0, 390, 560, 1.4), 546)}${col('Blurred', crop1(f('r9-c-rest-1x'), 0, 0, 390, 560, 1.4, true), 546)}</div>
     ${note('Measured: 1.24× the account badge’s weight with a light blur, 1.19× with a heavier one. The weight is the pin and its +; nothing is added to carry it.')}`,
  [CP + 'C5-tap-3x.png']: `${cap('Tap it (Safari, 390×664)', 'The tag comes off the pin and rises above the keyboard as the blank form; the pin waits. The map doesn’t move while you fill it in. On ADD the pin goes into the eyelet, on the place (T5).')}
     ${pair(f('r9-c-rest664'), 'At rest', f('r9-c-tapped664'), 'Tapped: type the name', 664)}<div class="gap"></div>`,
  [CP + 'C6-tag-open-3x.png']: `${cap('A place’s tag open', 'C steps aside while a place’s tag is open, and comes back when you close it. With the filters open it’s under them the same way.')}
     ${full(f('r9-c-tag664'))}${cost('one extra tap to add while a place’s tag or the filters are open (close it first). The header tag (A) has no such step. In a street-level view it can sit on a place; panning frees it.')}`,
  [CP + 'C7-sizes-3x.png']: `${cap('Small phone, list down', 'Left: 320 wide. Right: list down on the Home Screen app: it rides the list’s edge.')}
     <div class="row" style="gap:20px">${col('320 × 568', crop(f('r9-c-rest320'), 0, 0, 320, 568, 575 / 320, 320), 575)}${col('List down', crop(f('r9-c-collapsed'), 0, 300, 390, 844, 575 / 390), 575)}</div><div class="gap"></div>`,
  [CP + 'C8-pressed-3x.png']: `${cap('Pressed', 'The pin goes deep orange and the tag goes to paper: the pressed grammar of every orange action.')}
     <div class="row" style="gap:20px">${col('Rest', crop(f('r9-c-rest'), 0, 430, 190, 525, 575 / 190), 575)}${col('Pressed', crop(f('r9-c-pressed'), 0, 430, 190, 525, 575 / 190), 575)}</div><div class="gap"></div>`,
  // ================= ROUND 10: the tag is the button =================
  [R10 + 'R1-eight-ways-real-size-3x.png']: `${cap('Also explored: eight colours and forms, at real size', 'No pin, no lines: the tag, its +, the dotted line and the claim-check end. Each strip is your phone’s real size (1x, each pixel as you’d see it), bottom-left by your thumb. Weights are against the account badge’s, at 104 wide (the Float badge is 1.34×). The pick ships at 84 wide: 2.65× the account, 2.0× the badge.')}
<div class="row" style="padding:0 30px;gap:30px;align-items:center">${crop1(f('t10-paper-1x'), 0, 436, 170, 526, 3)}<div style="flex:1"><div class="lab" style="padding-top:0">1 · Paper</div><div style="font-size:28px;line-height:1.3;color:#3d4a55">The shipped tag’s paper and edge, a navy +. Draws on the Hanging Tag itself. Quietest: 0.41× the account.</div></div></div><div style="height:18px"></div><div class="row" style="padding:0 30px;gap:30px;align-items:center">${crop1(f('t10-twoend-1x'), 0, 436, 170, 526, 3)}<div style="flex:1"><div class="lab" style="padding-top:0">2 · Runner-up: paper, orange claim-check end</div><div style="font-size:28px;line-height:1.3;color:#3d4a55">The end you tear off is the action colour; the + on the paper. Draws on claim checks and the stub’s tear-off. 1.37×.</div></div></div><div style="height:18px"></div><div class="row" style="padding:0 30px;gap:30px;align-items:center">${crop1(f('t10-stubplus-1x'), 0, 436, 170, 526, 3)}<div style="flex:1"><div class="lab" style="padding-top:0">3 · The + on the claim-check end</div><div style="font-size:28px;line-height:1.3;color:#3d4a55">A blank tag; the + on its navy tear-off end: you take a ticket. Draws on deli and cloakroom tickets. About 1.3× (rough).</div></div></div><div style="height:18px"></div><div class="row" style="padding:0 30px;gap:30px;align-items:center">${crop1(f('t10-punch-1x'), 0, 436, 170, 526, 3)}<div style="flex:1"><div class="lab" style="padding-top:0">4 · Navy, the + punched through</div><div style="font-size:28px;line-height:1.3;color:#3d4a55">A claim check punched with a +: the map shows through the hole. Draws on ticket punches. Navy is the account’s colour: they pair. About 5× (rough).</div></div></div><div style="height:18px"></div><div class="row" style="padding:0 30px;gap:30px;align-items:center">${crop1(f('t10-punchor-1x'), 0, 436, 170, 526, 3)}<div style="flex:1"><div class="lab" style="padding-top:0">5 · Orange, the + punched through</div><div style="font-size:28px;line-height:1.3;color:#3d4a55">The same punch on the action orange. 3.85×. Orange on a place’s tag means starred; here it is off the map’s tags, on a button.</div></div></div><div style="height:18px"></div><div class="row" style="padding:0 30px;gap:30px;align-items:center">${crop1(f('t10-navy-1x'), 0, 436, 170, 526, 3)}<div style="flex:1"><div class="lab" style="padding-top:0">6 · Navy tag, paper +</div><div style="font-size:28px;line-height:1.3;color:#3d4a55">The frame colour, like the account badge: strong, but a pair with it. About 5× (rough).</div></div></div><div style="height:18px"></div><div class="row" style="padding:0 30px;gap:30px;align-items:center">${crop1(f('t10-orange-1x'), 0, 436, 170, 526, 3)}<div style="flex:1"><div class="lab" style="padding-top:0">7 · The pick: orange tag, navy +</div><div style="font-size:28px;line-height:1.3;color:#3d4a55">The action orange, like the old + badge. 4.06×. Same note on orange as above.</div></div></div><div style="height:18px"></div><div class="row" style="padding:0 30px;gap:30px;align-items:center">${crop1(f('t10-apptag-1x'), 0, 436, 170, 526, 3)}<div style="flex:1"><div class="lab" style="padding-top:0">8 · The app’s own tag shape</div><div style="font-size:28px;line-height:1.3;color:#3d4a55">Chamfers on top, the eyelet, the stub along the bottom: the Hanging Tag in miniature, no pin. About 0.5× (rough); reads more as a card.</div></div></div><div style="height:18px"></div>`,
  [R10 + 'R2-paper-and-two-end-3x.png']: `${cap('Beside today: the quiet one and the claim-check one', 'Left: just paper (too quiet: it loses to the account badge). Right: the claim-check end in the action orange.')}
     ${pair(f('t10-paper'), 'Paper', f('t10-twoend'), 'Orange claim-check end', 640)}<div class="gap"></div>`,
  [R10 + 'R3-ticket-and-punch-3x.png']: `${cap('Beside today: take a ticket, and the punched +', 'Left: the + on the navy tear-off end. Right: the + punched through an orange tag.')}
     ${pair(f('t10-stubplus'), 'The + on the claim-check end', f('t10-punchor'), 'Punched, orange', 640)}<div class="gap"></div>`,
  [R10 + 'R4-solid-tags-3x.png']: `${cap('Beside today: solid colour', 'Left: navy, the account badge’s colour (they read as a pair). Right: orange, the pick.')}
     ${pair(f('t10-navy'), 'Navy', f('t10-orange'), 'Orange', 640)}<div class="gap"></div>`,
  [R10 + 'R5-real-size-full-3x.png']: `${cap('The claim-check one on the whole screen, at real size', 'With the app’s own pins and the account badge, as your phone shows it.')}
     $${crop1(f('t10-twoend-1x'), 0, 0, 390, 544, 3)}<div class="gap"></div>`,
  [T + 'R10-F1-unpinned-3x.png']: `${cap('Filling it in: not pinned yet', 'Until there’s an address the map is washed back: the tag is a card on paper, not on a place. Left: typing (the last row searches every city). Right: the keyboard down; the tag sits in the visual middle of the open space, every line there from the start, so it never changes size as you fill it in.')}
     ${pair(f('r10-f-typing664'), 'Typing', f('r10-f-blankcard664'), 'Keyboard down', 664)}<div class="gap"></div>`,
  [T + 'R10-F2-pinned-3x.png']: `${cap('An address: now it looks pinned', 'Pick a result: the wash lifts, the map is the place, and its pin stands above the tag on its string. TYPE is a row of the app’s own pins: tap one and that’s the pin you get. Nothing is saved until ADD.')}${full(f('r10-f-pinned664'))}<div class="gap"></div>`,
  [T + 'R10-F3-pinned-starred-3x.png']: `${cap('Starred, visited and a note', 'The orange band prints into the tag’s top on star (the tag doesn’t grow); VISITED stamps; the note is pencil until you add.')}${full(f('r10-f-pinned-starred664'))}<div class="gap"></div>`,
  [T + 'R10-F4-320-3x.png']: `${cap('Smallest phone (320 × 568)', 'Typing (not pinned yet), then pinned.')}
     <div class="row" style="gap:20px">${col('Typing', crop(f('r10-f-typing320'), 0, 0, 320, 568, 575 / 320, 320), 575)}${col('Pinned', crop(f('r10-f-pinned320'), 0, 0, 320, 568, 575 / 320, 320), 575)}</div><div class="gap"></div>`,
  [T + 'R10-F6-add-3x.png']: `${cap('ADD', 'Left: filled in and pinned. Right: after ADD it’s the place’s own tag: the pencil inks, TYPE is stamped, and ADD becomes DIRECTIONS in the same spot under your thumb. The tag tightens from the top, so the map shifts just that little; nothing flies.')}
     ${pair(f('r10-f-pinned664'), 'Before: tap ADD', f('r10-f-after664'), 'After: the place’s own tag', 664)}<div class="gap"></div>`,
  [T + 'R10-F5-city-3x.png']: `${cap('The city: a word you can tap', 'The city is just part of the address, with a fine underline to say it can be tapped. Tap it and your cities print on the tag; pick one. The pin doesn’t move: a city is where the place is filed, not where it is.')}
     ${pair(f('r10-f-pinned664'), 'The city word', f('r10-f-city664'), 'Tapped: your cities', 664)}<div class="gap"></div>`,
  [R10 + 'C0-two-options-3x.png']: `${cap('Two options for +', 'Left: the badge (Float). Right: the tag is the button (C). Both bottom-left, both open the same blank tag; both hide only while the filters are open.')}
     ${pair(f('f10-rest'), 'Float · the badge', f('c10-rest'), 'C · the tag', 640)}<div class="gap"></div>`,
  [R10 + 'C1-rest-vs-today-3x.png']: `${cap('C · the tag is the button', 'The + is a luggage tag in the action orange: a navy +, the dotted line and the claim-check end. One shape, one colour, one mark. Bottom-left by your thumb; the account badge alone at the top.')}
     ${pair(f('r9-today'), 'Today', f('c10-rest'), 'C', 640)}<div class="gap"></div>`,
  [R10 + 'C2-real-size-3x.png']: `${cap('C at real size', 'As your phone shows it (1x, each pixel as you’d see it), with the app’s own pins and the account badge.')}
     ${crop1(f('c10-rest-1x'), 0, 0, 390, 544, 3)}<div class="gap"></div>`,
  [R10 + 'C3-squint-1x.png']: `${cap('The squint test', 'The same screen blurred: the + should come before the account badge.')}
     <div class="row" style="padding:0 30px;gap:18px">${col('1x', crop1(f('c10-rest-1x'), 0, 0, 390, 544, 1.4), 546)}${col('Blurred', crop1(f('c10-rest-1x'), 0, 0, 390, 544, 1.4, true), 546)}</div>
     ${note('Measured: 2.65× the account badge’s weight, and 2.0× the Float badge’s.')}`,
  [R10 + 'C4-tap-3x.png']: `${cap('Tap it (Safari, 390×664)', 'The claim-check end tears off and the tag rises above the keyboard as the blank form; the map behind is washed back until there’s an address. The button is gone while you add: the tag’s × is the one cancel.')}
     ${pair(f('c10-rest664'), 'At rest', f('c10-tapped664'), 'Tapped: type the name', 664)}<div class="gap"></div>`,
  [R10 + 'C5-tag-open-3x.png']: `${cap('A place’s tag open', 'It stays where it is and can be tapped: adding closes the place’s tag, and cancelling brings it back. The list sits a little lower to make room.')}${full(f('c10-tag664'))}<div class="gap"></div>`,
  [R10 + 'C6-sizes-3x.png']: `${cap('Small phone, list down', 'Left: 320 wide. Right: list down on the Home Screen app: it rides the list’s edge.')}
     <div class="row" style="gap:20px">${col('320 × 568', crop(f('c10-rest320'), 0, 0, 320, 568, 575 / 320, 320), 575)}${col('List down', crop(f('c10-collapsed'), 0, 300, 390, 844, 575 / 390), 575)}</div><div class="gap"></div>`,
  [R10 + 'C7-pressed-3x.png']: `${cap('Pressed', 'Deep orange: the pressed look of every orange action.')}
     <div class="row" style="gap:20px">${col('Rest', crop(f('c10-rest'), 0, 425, 140, 525, 575 / 140), 575)}${col('Pressed', crop(f('c10-pressed'), 0, 425, 140, 525, 575 / 140), 575)}</div><div class="gap"></div>`,
  [EF + 'F1-rest-vs-today-3x.png']: `${cap('Float · the badge', 'Today’s scalloped badge, in orange and bigger, at the bottom-left by your thumb; the account badge alone at the top.')}
     ${pair(f('r9-today'), 'Today', f('f10-rest'), 'Float', 640)}<div class="gap"></div>`,
  [EF + 'F2-real-size-3x.png']: `${cap('Float at real size', 'As your phone shows it (1x, each pixel as you’d see it), with the app’s own pins and the account badge.')}
     ${crop1(f('f10-rest-1x'), 0, 0, 390, 544, 3)}<div class="gap"></div>`,
  [EF + 'F3-squint-1x.png']: `${cap('The squint test', 'The same screen blurred: the + should come before the account badge.')}
     <div class="row" style="padding:0 30px;gap:18px">${col('1x', crop1(f('f10-rest-1x'), 0, 0, 390, 544, 1.4), 546)}${col('Blurred', crop1(f('f10-rest-1x'), 0, 0, 390, 544, 1.4, true), 546)}</div>
     ${note('Measured: 1.34× the account badge’s weight with a light blur, 1.33× with a heavier one.')}`,
  [EF + 'F4-tap-3x.png']: `${cap('Tap it (Safari, 390×664)', 'The same blank form rises above the keyboard; the map behind is washed back until there’s an address. The badge is gone while you add: the tag’s × is the one cancel.')}
     ${pair(f('f10-rest664'), 'At rest', f('f10-tapped664'), 'Tapped: type the name', 664)}<div class="gap"></div>`,
  [EF + 'F5-tag-open-3x.png']: `${cap('A place’s tag open', 'It stays where it is and can be tapped: adding closes the place’s tag, and cancelling brings it back. The list sits a little lower to make room.')}${full(f('f10-tag664'))}<div class="gap"></div>`,
  [EF + 'F6-sizes-3x.png']: `${cap('Small phone, list down', 'Left: 320 wide. Right: list down on the Home Screen app: it rides the list’s edge.')}
     <div class="row" style="gap:20px">${col('320 × 568', crop(f('f10-rest320'), 0, 0, 320, 568, 575 / 320, 320), 575)}${col('List down', crop(f('f10-collapsed'), 0, 300, 390, 844, 575 / 390), 575)}</div><div class="gap"></div>`,
  [EF + 'F7-pressed-3x.png']: `${cap('Pressed', 'Deep orange with a paper +: the pressed look of every orange action.')}
     <div class="row" style="gap:20px">${col('Rest', crop(f('f10-rest'), 0, 425, 140, 525, 575 / 140), 575)}${col('Pressed', crop(f('f10-pressed'), 0, 425, 140, 525, 575 / 140), 575)}</div><div class="gap"></div>`,
  // ================= ROUND 11 =================
  [R11 + 'S1-proportions-real-size-3x.png']: `${cap('Narrower both sides, a smaller +, the hole back', 'Four proportions, each in both colourways: the orange tag, and cream with an orange claim-check end. Shown at real size and a half (1x ×1.5) so the parts can be seen.')}
<div class="lab" style="padding:16px 30px 6px">Compact, 72 × 42 <span style="font-weight:400;color:#3d4a55">— 1.7 : 1. Both ends shortened; the + at 18.</span></div><div class="row" style="padding:0 30px;gap:30px">${crop1(f('r11-orange-p1-1x'), 0, 452, 120, 527, 4.5)}${crop1(f('r11-twoend-p1-1x'), 0, 452, 120, 527, 4.5)}</div><div class="lab" style="padding:16px 30px 6px">Squat, 64 × 44 <span style="font-weight:400;color:#3d4a55">— 1.45 : 1, nearest a hand-held luggage tag; the tightest footprint.</span></div><div class="row" style="padding:0 30px;gap:30px">${crop1(f('r11-orange-p2-1x'), 0, 452, 120, 527, 4.5)}${crop1(f('r11-twoend-p2-1x'), 0, 452, 120, 527, 4.5)}</div><div class="lab" style="padding:16px 30px 6px">Slim, 80 × 36 <span style="font-weight:400;color:#3d4a55">— 2.2 : 1, a long claim check; the + at 16 reads small.</span></div><div class="row" style="padding:0 30px;gap:30px">${crop1(f('r11-orange-p3-1x'), 0, 452, 120, 527, 4.5)}${crop1(f('r11-twoend-p3-1x'), 0, 452, 120, 527, 4.5)}</div><div class="lab" style="padding:16px 30px 6px">Golden, 70 × 43 (the lead) <span style="font-weight:400;color:#3d4a55">— 1.62 : 1. The hole, the + and the claim-check end sit in even thirds of the tag.</span></div><div class="row" style="padding:0 30px;gap:30px">${crop1(f('r11-orange-p4-1x'), 0, 452, 120, 527, 4.5)}${crop1(f('r11-twoend-p4-1x'), 0, 452, 120, 527, 4.5)}</div><div class="gap"></div>`,
  [R11 + 'C0-two-options-3x.png']: `${cap('Two options for +', 'Left: the badge (Float). Right: the tag is the button (C), the orange tag. Both bottom-left, both open the same blank tag; both hide only while the filters are open.')}
     ${pair(f('f10-rest'), 'Float · the badge', f('c11-rest'), 'C · the tag', 640)}<div class="gap"></div>`,
  [R11 + 'C1-rest-vs-today-3x.png']: `${cap('C · the tag is the button', 'Smaller and better balanced: 70 × 43, the hole at the cut end, a smaller + in the middle, the dotted line and the claim-check end. Bottom-left by your thumb; the account badge alone at the top.')}
     ${pair(f('r9-today'), 'Today', f('c11-rest'), 'C', 640)}<div class="gap"></div>`,
  [R11 + 'C2-real-size-3x.png']: `${cap('C at real size', 'As your phone shows it (1x, each pixel as you’d see it), with the app’s own pins and the account badge.')}
     ${crop1(f('c11-rest-1x'), 0, 0, 390, 544, 3)}<div class="gap"></div>`,
  [R11 + 'C3-squint-1x.png']: `${cap('The squint test', 'The same screen blurred: the + should come before the account badge.')}
     <div class="row" style="padding:0 30px;gap:18px">${col('1x', crop1(f('c11-rest-1x'), 0, 0, 390, 544, 1.4), 546)}${col('Blurred', crop1(f('c11-rest-1x'), 0, 0, 390, 544, 1.4, true), 546)}</div>
     ${note('Rough measure (systems re-measures): about 2× the account badge’s weight, and about 1.5× the Float badge’s.')}`,
  [R11 + 'C4-tap-3x.png']: `${cap('Tap it (Safari, 390×664)', 'The claim-check end tears off and the tag rises above the keyboard as the blank form; the map behind is washed back until there’s an address. The button is gone while you add: the tag’s × is the one cancel.')}
     ${pair(f('c11-rest664'), 'At rest', f('c11-tapped664'), 'Tapped: type the name', 664)}<div class="gap"></div>`,
  [R11 + 'C5-tag-open-3x.png']: `${cap('A place’s tag open', 'It stays where it is and can be tapped: adding closes the place’s tag, and cancelling brings it back. The list sits a little lower to make room.')}${full(f('c11-tag664'))}<div class="gap"></div>`,
  [R11 + 'C6-sizes-3x.png']: `${cap('Small phone, list down', 'Left: 320 wide. Right: list down on the Home Screen app: it rides the list’s edge.')}
     <div class="row" style="gap:20px">${col('320 × 568', crop(f('c11-rest320'), 0, 0, 320, 568, 575 / 320, 320), 575)}${col('List down', crop(f('c11-collapsed'), 0, 300, 390, 844, 575 / 390), 575)}</div><div class="gap"></div>`,
  [R11 + 'C7-pressed-3x.png']: `${cap('Pressed', 'Deep orange: the pressed look of every orange action.')}
     <div class="row" style="gap:20px">${col('Rest', crop(f('c11-rest'), 0, 440, 110, 527, 575 / 110), 575)}${col('Pressed', crop(f('c11-pressed'), 0, 440, 110, 527, 575 / 110), 575)}</div><div class="gap"></div>`,
  [R11 + 'K1-two-colourways-3x.png']: `${cap('The two colourways, the same tag', 'Left: the orange tag. Right: cream, with the claim-check end in orange. Same size, hole and +.')}
     ${pair(f('c11-rest'), 'Orange tag', f('c11b-rest'), 'Cream, orange end', 640)}
     <div class="row" style="padding:20px 30px 0;gap:30px">${crop1(f('c11-rest-1x'), 0, 452, 120, 527, 4.5)}${crop1(f('c11b-rest-1x'), 0, 452, 120, 527, 4.5)}</div>
     ${note('Rough weights (systems re-measures): the orange tag about 2× the account badge; the cream one about 0.6× — quieter than the account, so it doesn’t come first.')}`,
  [R11 + 'K2-cream-real-size-3x.png']: `${cap('Cream with an orange claim-check end, at real size', 'As your phone shows it, with the app’s own pins and the account badge.')}
     ${crop1(f('c11b-rest-1x'), 0, 0, 390, 544, 3)}<div class="gap"></div>`,
  [R11 + 'K3-cream-rest-664-3x.png']: `${cap('Cream with an orange end, in a Safari tab (390×664)', 'At rest, beside the orange one.')}
     ${pair(f('c11-rest664'), 'Orange tag', f('c11b-rest664'), 'Cream, orange end', 664)}<div class="gap"></div>`,
  // ================= ROUND 11b: turned 90 degrees =================
  [R11 + 'V1-upright-options-real-size-3x.png']: `${cap('The tag turned 90°', 'Three ways to stand it up, each in both colourways (the orange tag; cream with an orange end), at real size and a half.')}
<div class="lab" style="padding:16px 30px 6px">Hole at the top, the claim-check end at the bottom (the lead) <span style="font-weight:400;color:#3d4a55">— A hanging luggage tag, the way the place’s tag hangs: eyelet up, stub down. 43 × 70.</span></div><div class="row" style="padding:0 30px;gap:30px">${crop1(f('r11v-orange-p4-up-1x'), 0, 430, 120, 527, 4.5)}${crop1(f('r11v-twoend-p4-up-1x'), 0, 430, 120, 527, 4.5)}</div><div class="lab" style="padding:16px 30px 6px">Hole at the bottom, the end at the top <span style="font-weight:400;color:#3d4a55">— The tag stood on its eyelet; the tear-off end points up. Reads more like a price label.</span></div><div class="row" style="padding:0 30px;gap:30px">${crop1(f('r11v-orange-p4-down-1x'), 0, 430, 120, 527, 4.5)}${crop1(f('r11v-twoend-p4-down-1x'), 0, 430, 120, 527, 4.5)}</div><div class="lab" style="padding:16px 30px 6px">Slimmer, hole at the top <span style="font-weight:400;color:#3d4a55">— 38 × 64: the same tag, a size smaller.</span></div><div class="row" style="padding:0 30px;gap:30px">${crop1(f('r11v-orange-p5-up-1x'), 0, 430, 120, 527, 4.5)}${crop1(f('r11v-twoend-p5-up-1x'), 0, 430, 120, 527, 4.5)}</div><div class="gap"></div>`,
  [R11 + 'V2-choice-3x.png']: `${cap('The choice', 'The badge, the tag lying flat (70 × 43), the tag standing up (36 × 58). All bottom-left; all open the same blank tag.')}
     <div class="row" style="padding:0 12px;gap:12px">${col('Float · the badge', crop(f('f10-rest'), 0, 0, 390, 640, 370 / 390, 390, 'border:1px solid #cfc4ae'), 372)}${col('C · flat', crop(f('c11-rest'), 0, 0, 390, 640, 370 / 390, 390, 'border:1px solid #cfc4ae'), 372)}${col('C · upright', crop(f('r11v-orange-p6-up'), 0, 0, 390, 640, 370 / 390, 390, 'border:1px solid #cfc4ae'), 372)}</div><div class="gap"></div>`,
  [R11 + 'V3-upright-rest-vs-today-3x.png']: `${cap('C upright beside today', 'The tag hangs the way a place’s tag does: hole at the top, the claim-check end at the bottom. 43 × 70, bottom-left; the account badge alone at the top.')}
     ${pair(f('r9-today'), 'Today', f('r11v-orange-p4-up'), 'C upright', 640)}<div class="gap"></div>`,
  [R11 + 'V4-upright-real-size-3x.png']: `${cap('C upright at real size', 'As your phone shows it, with the app’s own pins and the account badge.')}
     ${crop1(f('r11v-orange-p4-up-1x'), 0, 0, 390, 544, 3)}
     ${note('Rough weight (systems re-measures): about 2× the account badge, the same as lying flat; it stands 27px taller and takes 27px less width.')}`,
  [R11 + 'V5-upright-colourways-3x.png']: `${cap('Upright 36 × 58, both colourways', 'Left: the orange tag, 1.45× the account badge’s weight (measured). Right: cream with an orange end, about 0.6× (rough): quieter than the account.')}
     ${pair(f('r11v-orange-p6-up'), 'Orange tag', f('r11v-twoend-p6-up'), 'Cream, orange end', 640)}<div class="gap"></div>`,
  [R11 + 'V7-short-upright-3x.png']: `${cap('A shorter upright: 36 × 58', 'Left: 36 × 58. Right: 43 × 70. Both at real size (1x as your phone shows it), then at twice that so the hole, the dotted line and the end can be checked. Below: a place’s tag open in Safari, with 3 list rows still showing.')}
     <div class="row" style="padding:0 30px;gap:30px;align-items:flex-end">${col('36 × 58, real size', crop1(f('r11v-orange-p6-up-1x'), 0, 450, 90, 527, 3), 270)}${col('43 × 70, real size', crop1(f('r11v-orange-p4-up-1x'), 0, 440, 90, 527, 3), 270)}</div>
     <div class="row" style="padding:12px 30px 0;gap:30px;align-items:flex-end">${col('36 × 58, ×2', crop1(f('r11v-orange-p6-up-1x'), 0, 450, 90, 527, 6), 540)}${col('43 × 70, ×2', crop1(f('r11v-orange-p4-up-1x'), 0, 440, 90, 527, 6), 540)}</div>
     ${lab('<span style="padding-left:30px">A place’s tag open (390 × 664): 3 rows</span>')}${full(f('r11v-orange-p6-up-tag664'))}
     ${note('Rough weight (systems re-measures): about 1.5× the account badge.')}`,
  [R11 + 'V6-upright-sizes-3x.png']: `${cap('Upright: small phone, list down, a tag open', 'Left: 320 wide. Middle: list down (Home Screen). Right: a place’s tag open in Safari: it stays, the list sits a little lower.')}
     <div class="row" style="padding:0 12px;gap:12px;align-items:flex-end">${col('320 × 568', crop(f('r11v-orange-p4-up-320'), 0, 0, 320, 568, 372 / 320, 320, 'border:1px solid #cfc4ae'), 374)}${col('List down', crop(f('r11v-orange-p4-up-collapsed'), 0, 270, 390, 844, 372 / 390, 390, 'border:1px solid #cfc4ae'), 374)}${col('A tag open', crop(f('r11v-orange-p4-up-tag664'), 0, 0, 390, 664, 372 / 390, 390, 'border:1px solid #cfc4ae'), 374)}</div><div class="gap"></div>`,
  // ================= ROUND 11c: a tad more squat =================
  [R11 + 'Q1-squat-options-3x.png']: `${cap('A tad more squat', 'The cream upright with its orange end, shorter. Your route: a smaller orange end (8 or 6). Also: a touch wider and shorter (40 × 55). Close-ups at real size × 1.5. Weights are against the account badge.')}
     <div class="row" style="padding:0 20px;gap:14px">${col('Now: 36 × 58<br><span style="font-weight:400;font-size:22px;color:#3d4a55">orange end 12<br>0.42×</span>', crop1(f('r11v-twoend-p6-up-1x'), 0, 455, 62, 527, 4.4), 272)}${col('36 × 54<br><span style="font-weight:400;font-size:22px;color:#3d4a55">orange end 8 (your route)<br>0.31×</span>', crop1(f('r11q-twoend-q1-up-1x'), 0, 455, 62, 527, 4.4), 272)}${col('36 × 52<br><span style="font-weight:400;font-size:22px;color:#3d4a55">orange end 6<br>below 0.31× (rough)</span>', crop1(f('r11q-twoend-q2-up-1x'), 0, 455, 62, 527, 4.4), 272)}${col('Also: 40 × 55<br><span style="font-weight:400;font-size:22px;color:#3d4a55">a touch wider, end 10<br>0.41×</span>', crop1(f('r11q-twoend-q3-up-1x'), 0, 455, 62, 527, 4.4), 272)}</div>
     ${note('Plainly: a smaller orange end makes it quieter — the end is most of its colour. At 36 × 54 it is 0.31× the account, at 36 × 52 below that, against 0.42× now; every cream version comes after the account badge. The 40 × 55 is 0.41×.')}`,
  [R11 + 'Q2-squat-real-size-3x.png']: `${cap('36 × 54 (end 8) at real size', 'As your phone shows it, with the app’s own pins and the account badge.')}
     ${crop1(f('r11q-twoend-q1-up-1x'), 0, 0, 390, 544, 3)}<div class="gap"></div>`,
  [R11 + 'Q3-squat-vs-now-3x.png']: `${cap('Now vs a tad more squat', 'Left: 36 × 58, end 12 (now). Right: 36 × 54, end 8.')}
     ${pair(f('r11v-twoend-p6-up'), '36 × 58 (now)', f('r11q-twoend-q1-up'), '36 × 54', 640)}<div class="gap"></div>`,
  [R11 + 'Q4-squat-alternative-3x.png']: `${cap('Also: 40 × 55', 'Squatter by being a touch wider as well as shorter, so the orange end can stay at 10: it keeps the most weight of the squat versions. Left: 36 × 54 (end 8). Right: 40 × 55.')}
     ${pair(f('r11q-twoend-q1-up'), '36 × 54', f('r11q-twoend-q3-up'), '40 × 55', 640)}<div class="gap"></div>`,
  [R11 + 'Q5-squat-tag-open-3x.png']: `${cap('36 × 54 with a place’s tag open (390 × 664)', 'It stays and can be tapped; 3 list rows still show.')}${full(f('r11q-twoend-q1-up-tag664'))}<div class="gap"></div>`,
  // ================= ROUND 11d: proportion study (size held: height 54) =================
  [R11 + 'P1-proportion-grid-3x.png']: `${cap('Proportion first: width against height, and a thinner orange end', 'Every tag here is the same height (54), so only the shape changes: four widths across, five ways to end it down. Shown at about 1.1× real size.')}
     <div class="row" style="padding:0 20px;gap:10px"><div style="width:150px"></div><div class="lab" style="width:236px;text-align:center">32 wide · 0.59 : 1</div><div class="lab" style="width:236px;text-align:center">36 wide · 0.67 : 1</div><div class="lab" style="width:236px;text-align:center">40 wide · 0.74 : 1</div><div class="lab" style="width:236px;text-align:center">44 wide · 0.81 : 1</div></div><div class="row" style="padding:0 20px;gap:10px;align-items:center"><div style="width:150px;font-weight:700;font-size:24px;line-height:1.2">Orange end 8</div>${crop(f('r11p-32-e8'), 0, 458, 72, 527, 236 / 72)}${crop(f('r11p-36-e8'), 0, 458, 72, 527, 236 / 72)}${crop(f('r11p-40-e8'), 0, 458, 72, 527, 236 / 72)}${crop(f('r11p-44-e8'), 0, 458, 72, 527, 236 / 72)}</div><div style="height:10px"></div><div class="row" style="padding:0 20px;gap:10px;align-items:center"><div style="width:150px;font-weight:700;font-size:24px;line-height:1.2">Orange end 5</div>${crop(f('r11p-32-e5'), 0, 458, 72, 527, 236 / 72)}${crop(f('r11p-36-e5'), 0, 458, 72, 527, 236 / 72)}${crop(f('r11p-40-e5'), 0, 458, 72, 527, 236 / 72)}${crop(f('r11p-44-e5'), 0, 458, 72, 527, 236 / 72)}</div><div style="height:10px"></div><div class="row" style="padding:0 20px;gap:10px;align-items:center"><div style="width:150px;font-weight:700;font-size:24px;line-height:1.2">Orange end 3</div>${crop(f('r11p-32-e3'), 0, 458, 72, 527, 236 / 72)}${crop(f('r11p-36-e3'), 0, 458, 72, 527, 236 / 72)}${crop(f('r11p-40-e3'), 0, 458, 72, 527, 236 / 72)}${crop(f('r11p-44-e3'), 0, 458, 72, 527, 236 / 72)}</div><div style="height:10px"></div><div class="row" style="padding:0 20px;gap:10px;align-items:center"><div style="width:150px;font-weight:700;font-size:24px;line-height:1.2">Hairline 1.5</div>${crop(f('r11p-32-e1'), 0, 458, 72, 527, 236 / 72)}${crop(f('r11p-36-e1'), 0, 458, 72, 527, 236 / 72)}${crop(f('r11p-40-e1'), 0, 458, 72, 527, 236 / 72)}${crop(f('r11p-44-e1'), 0, 458, 72, 527, 236 / 72)}</div><div style="height:10px"></div><div class="row" style="padding:0 20px;gap:10px;align-items:center"><div style="width:150px;font-weight:700;font-size:24px;line-height:1.2">A cream stub (10) with a 3px orange edge</div>${crop(f('r11p-32-stub'), 0, 458, 72, 527, 236 / 72)}${crop(f('r11p-36-stub'), 0, 458, 72, 527, 236 / 72)}${crop(f('r11p-40-stub'), 0, 458, 72, 527, 236 / 72)}${crop(f('r11p-44-stub'), 0, 458, 72, 527, 236 / 72)}</div><div style="height:10px"></div>
     ${note('Honestly: at 8 and 5 the orange still reads as a strip you tear off. At 3 and the hairline it stops being a claim check and reads as a coloured hem or an underline, and the notches start biting the corners. The bottom row keeps the tear-off with orange that thin: the dotted line and notches move up 10px and make a cream stub, and the orange is just its edge.')}`,
  [R11 + 'P2-proportion-real-size-3x.png']: `${cap('At real size, beside the account badge', 'As your phone shows them: the account badge, then 36 wide with a 3px end, 36 with the cream stub, and 40 with the cream stub. Height 54 in all three.')}
     <div class="row" style="padding:0 30px;gap:24px;align-items:flex-end">${col('Account', crop1(f('r11p-real-36-e3-1x'), 316, 10, 384, 74, 3), 204)}${col('36, end 3', crop1(f('r11p-real-36-e3-1x'), 6, 458, 66, 527, 3), 180)}${col('36, cream stub', crop1(f('r11p-real-36-stub-1x'), 6, 458, 66, 527, 3), 180)}${col('40, cream stub', crop1(f('r11p-real-40-stub-1x'), 6, 458, 70, 527, 3), 192)}</div><div class="gap"></div>`,
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
