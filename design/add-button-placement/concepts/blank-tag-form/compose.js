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
function taps() { const t = M['r9-f-card664'].taps, x0 = 20, y0 = 320, x1 = 370, y1 = 596, sc = 1170 / (x1 - x0);
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
const P = CON + '/P-blank-pin/', A = CON + '/A-header-tag/', T = C + '/', CP = CON + '/C-pintag/';
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
  // ================= C · PIN+TAG =================
  [CP + 'C1-rest-vs-today-3x.png']: `${cap('C · the pin and its tag', 'The + is a blank place: the app’s own pin, at its own size, with a blank luggage tag on its string. The + is printed on the tag where you’ll write, and the tag’s stub has ADD’s navy slot, like the form it opens. Bottom-left; the account badge is alone at the top.')}
     ${pair(f('r9-today'), 'Today', f('r9-c-rest'), 'C', 640)}<div class="gap"></div>`,
  [CP + 'C2-1x-3x.png']: `${cap('At real size (1x), beside the app’s pins and the account badge', 'Top: the whole screen at 1x, and blurred (the squint test: the + should come first). Bottom: close-ups at 1x ×4: the pick, and the same object with no navy on the tag.')}
     <div class="row" style="padding:0 30px;gap:18px">${col('C, 1x', crop1(f('r9-c-rest-1x'), 0, 0, 390, 560, 1.4), 546)}${col('Blurred', crop1(f('r9-c-rest-1x'), 0, 0, 390, 560, 1.4, true), 546)}</div>
     <div class="row" style="padding:0 30px;gap:18px">${col('Pick: ADD’s navy slot on the stub', crop1(f('r9-c-rest-1x'), 0, 385, 136, 545, 4), 544)}${col('Also tried: no navy (too quiet)', crop1(f('r9-c-alt-1x'), 0, 385, 136, 545, 4), 544)}</div>
     ${note('Measured roughly here (systems re-measures): the pick is about 1.4× the account badge’s weight when blurred; with no navy on the tag it’s about 0.85× — the “same weight as account” problem. The pin stays the app’s own 32px pin; the weight comes from the tag.')}`,
  [CP + 'C3-tap-3x.png']: `${cap('Tap it (Safari, 390×664)', 'The tag comes off the pin and rises above the keyboard as the blank form; the pin waits. The map doesn’t move while you fill it in. On ADD the pin goes into the eyelet, on the place (T5).')}
     ${pair(f('r9-c-rest664'), 'At rest', f('r9-c-tapped664'), 'Tapped: type the name', 664)}<div class="gap"></div>`,
  [CP + 'C4-tag-open-3x.png']: `${cap('A place’s tag open', 'The pin and tag step aside while a place’s tag is open, and come back when you close it. With the filters open it’s under them the same way.')}
     ${full(f('r9-c-tag664'))}${cost('one extra tap to add while a place’s tag or the filters are open (close it first). The header tag (A) has no such step.')}`,
  [CP + 'C5-sizes-3x.png']: `${cap('Small phone, list down', 'Left: 320 wide. Right: list down on the Home Screen app: it rides the list’s edge.')}
     <div class="row" style="gap:20px">${col('320 × 568', crop(f('r9-c-rest320'), 0, 0, 320, 568, 575 / 320, 320), 575)}${col('List down', crop(f('r9-c-collapsed'), 0, 300, 390, 844, 575 / 390), 575)}</div><div class="gap"></div>`,
  [CP + 'C6-pressed-3x.png']: `${cap('Pressed', 'Deep orange pin, the tag goes to paper: the pressed grammar of every orange action.')}
     <div class="row" style="gap:20px">${col('Rest', crop(f('r9-c-rest'), 0, 385, 136, 545, 575 / 136), 575)}${col('Pressed', crop(f('r9-c-pressed'), 0, 385, 136, 545, 575 / 136), 575)}</div><div class="gap"></div>`,
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
