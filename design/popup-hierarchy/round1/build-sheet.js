// Builds index.html: the owner's phone-readable contact sheet, images embedded
// as base64 JPEG from ./_sheet (written by render.js).
//   node design/popup-hierarchy/round1/build-sheet.js
const fs = require('fs'), path = require('path');
const S = path.join(__dirname, '_sheet');
const img = (f, alt) => { const p = path.join(S, f); if (!fs.existsSync(p)) return '';
  return `<img src="data:image/jpeg;base64,${fs.readFileSync(p).toString('base64')}" alt="${alt}" loading="lazy">`; };

const LABEL = { 'busiest': 'Busiest (VEGA)', 'busiest-x': 'Opened / expanded', 'bare': 'Bare (Perlan)', 'shape': 'District' };
const C = [
  ['quiet', 'Quiet Fix', 'Today’s popup, fixed: type above the name, measured spacing, notes readable, address last, one action row.',
    'Everything stays in the popup.', 'Still big when busy. Notes now outweigh the name.', ['busiest', 'bare', 'shape']],
  ['fold', 'Folded Note', 'Popup shows type, name, two lines of notes and the actions. “More” unfolds it upward; the buttons never move.',
    'Address only when unfolded.', 'Unfolded it’s as tall as today. Two orange words.', ['busiest', 'busiest-x', 'bare', 'shape']],
  ['sheet', 'Place Sheet', 'No popup. The place takes the list sheet’s spot: header like the list header, three big buttons, then notes. Pull up for everything.',
    'Leaves the popup: bottom sheet.', 'The list is hidden while a place is open. Sheet height changes per place.', ['busiest', 'busiest-x', 'bare', 'shape']],
  ['row', 'Row Unfolds', 'The list row is the card. Tap a pin: its row lights up and unfolds notes and buttons. The map keeps a small name flag.',
    'Leaves the popup: into the list row.', 'Type stays under the name (row layout). Sheet grows to 480. No × .', ['busiest', 'bare', 'shape']],
  ['tab', 'Side Tab', 'Small popup: type, name, buttons. A NOTES tab on its edge opens a side drawer with notes and address.',
    'Leaves the popup: side drawer.', 'Drawer hides most of the map. Tab is narrow.', ['busiest', 'busiest-x', 'bare', 'shape']],
  ['dock', 'Map Label + Dock', 'Type and name printed on the map beside the pin, like a map label. Notes and buttons dock above the list.',
    'Leaves the popup: map label + card.', 'Dock has no name. Covers the map credit.', ['busiest', 'busiest-x', 'bare', 'shape']],
  ['rail', 'Action Rail', 'Content on the left, the three buttons stacked on the right. Address shrinks to street and area, full address one tap.',
    'Popup, two columns.', 'Tall even when empty. Notes column is narrow.', ['busiest', 'busiest-x', 'bare', 'shape']],
  ['lug', 'Luggage Label', 'Wildcard: the selected place as a hotel label. Orange band with the pin’s seal and the name in caps, paper below.',
    'Popup, all shown.', 'Loud. Long names run to 3 lines.', ['busiest', 'bare', 'shape']],
];

const sections = C.map(([id, name, idea, where, weak, states], i) => {
  const rest = states.filter(s => s !== 'busiest').map(s => `<figure>${img(`${id}-${s}-phone.jpg`, `${name}, ${LABEL[s]}`)}<figcaption>${LABEL[s]}</figcaption></figure>`).join('');
  return `<section id="${id}">
  <p class="num">${i + 1} / ${C.length}</p>
  <h2>${name}</h2>
  <p class="idea">${idea}</p>
  <p class="meta"><span>${where}</span> <span class="weak">Weak spot: ${weak}</span></p>
  <figure class="hero">${img(`${id}-busiest-phone.jpg`, `${name}, busiest, full screen`)}<figcaption>${LABEL.busiest}, full screen</figcaption></figure>
  <figure class="hero">${img(`${id}-busiest-crop.jpg`, `${name}, busiest, close-up`)}<figcaption>Close-up</figcaption></figure>
  <div class="grid">${rest}</div>
</section>`;
}).join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Popup Concepts Round 1</title>
<style>
  :root {
    --bg: #F2EBDD; --surface: #FAF5EA; --ink: #1A1A18; --ink-2: #5A564C; --hair: #D8CEBA; --accent: #A8400C;
    color-scheme: light dark;
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) { --bg: #1B1A17; --surface: #25231F; --ink: #EDE6D8; --ink-2: #B3AB9C; --hair: #3A3630; --accent: #F08A55; }
  }
  :root[data-theme="dark"] { --bg: #1B1A17; --surface: #25231F; --ink: #EDE6D8; --ink-2: #B3AB9C; --hair: #3A3630; --accent: #F08A55; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-text-size-adjust: 100%; }
  body { background: var(--bg); color: var(--ink); font: 16px/24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px 16px 64px; overflow-x: hidden; }
  main { max-width: 760px; margin: 0 auto; }
  h1 { font-size: 26px; line-height: 32px; font-weight: 700; letter-spacing: -0.01em; }
  .lede { margin-top: 8px; color: var(--ink-2); }
  .shared { margin-top: 16px; background: var(--surface); border: 1px solid var(--hair); border-radius: 4px; padding: 12px 16px; }
  .shared h3 { font-size: 13px; line-height: 20px; text-transform: uppercase; letter-spacing: .08em; color: var(--ink-2); }
  .shared ul { margin: 4px 0 0 18px; }
  .shared li { margin-top: 4px; font-size: 15px; line-height: 22px; }
  nav { margin-top: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
  nav a { color: var(--ink); text-decoration: none; font-size: 14px; border: 1px solid var(--hair); border-radius: 4px; padding: 6px 10px; background: var(--surface); }
  section { margin-top: 40px; padding-top: 24px; border-top: 1px solid var(--hair); }
  .num { font-size: 13px; color: var(--ink-2); letter-spacing: .06em; }
  h2 { font-size: 22px; line-height: 28px; margin-top: 2px; }
  .idea { margin-top: 8px; }
  .meta { margin-top: 8px; font-size: 14px; line-height: 20px; color: var(--ink-2); }
  .meta span { display: block; }
  .meta .weak { margin-top: 2px; }
  figure { margin-top: 16px; }
  figure img { display: block; width: 100%; height: auto; border: 1px solid var(--hair); border-radius: 4px; background: var(--surface); }
  .hero img { max-width: 420px; }
  figcaption { margin-top: 6px; font-size: 13px; line-height: 18px; color: var(--ink-2); }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 12px; }
  .grid figure img { max-width: 100%; }
  footer { margin-top: 48px; font-size: 13px; line-height: 20px; color: var(--ink-2); }
</style>
</head>
<body>
<main>
  <h1>Popup Concepts Round 1</h1>
  <p class="lede">Eight ways to lay out a place’s card. Each shows the busiest real place first (VEGA: starred, visited, plan stop, long address, long note), then the opened state, a bare place and a district. Pinch to zoom.</p>
  <div class="shared">
    <h3>Same in all eight</h3>
    <ul>
      <li>Type sits above the name (BAR · STOP 2 OF 3).</li>
      <li>Category icon is the list row’s seal, same as the pin.</li>
      <li>Star shows by the name only when starred; the star button has a fixed spot.</li>
      <li>Visited shows as the list’s stamp.</li>
      <li>Notes in readable ink, not grey italics. Address last or folded.</li>
      <li>Spacing only from the 4px scale; one left line for icons and text.</li>
    </ul>
  </div>
  <nav>${C.map(([id, name], i) => `<a href="#${id}">${i + 1}. ${name}</a>`).join('')}</nav>
${sections}
  <footer>The map behind is a stand-in drawing (real map tiles can’t load where these were made). Rendered in Chrome; not yet checked on iPhone. Details: design/popup-hierarchy/round1/README.md.</footer>
</main>
</body>
</html>
`;
fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('index.html', (html.length / 1048576).toFixed(2) + ' MB');
