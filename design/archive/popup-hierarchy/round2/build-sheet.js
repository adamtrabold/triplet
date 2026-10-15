// Builds index.html ("Popup Concepts Round 2"): the owner's phone-readable contact
// sheet, JPEGs embedded as base64 from ./_sheet (render.js writes them + manifest.json).
//   node design/popup-hierarchy/round2/build-sheet.js
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const S = path.join(__dirname, '_sheet');
const manifest = JSON.parse(fs.readFileSync(path.join(S, 'manifest.json'), 'utf8'));
const b64 = (file, w, q) => { const p = path.join(S, file); if (!fs.existsSync(p)) return '';
  const buf = w ? execFileSync('convert', [p, '-resize', `${w}x`, '-quality', String(q), 'jpg:-']) : fs.readFileSync(p);
  return `data:image/jpeg;base64,${buf.toString('base64')}`; };
const img = (file, alt, w, q) => `<img src="${b64(file, w, q)}" alt="${alt}" loading="lazy">`;

const C = [
  ['fold', 'A. In-map Card', 'The popup at the pin, with a height cap. A typical note shows whole; only a long note folds, and More opens it upward while the buttons stay put.',
    'Weak spot: still a box over the map; opening always pans the map to the same spot.'],
  ['sheet', 'B. Place Sheet', 'Tap a place and the list’s box becomes that place: name, the whole note, a one-line address, buttons at the bottom. × brings the list back exactly as it was.',
    'Weak spot: you can’t see the list while a place is open; a name-only place leaves empty paper.'],
  ['pin', 'C. Row Becomes the Card', 'Tap a pin and its list row lifts to the top of the list and opens into the card. The rest of the list stays below, untouched. Nothing grows.',
    'Weak spot: only about one list row stays visible under a busy card; buttons sit above the note so they never move.'],
  ['dock', 'D. Fold + Dock', 'The place docks as a card just above the list, with its own name, the note and the buttons. More raises it; the buttons stay put. Nothing boxes the pin.',
    'Weak spot: three layers stacked in the bottom half (map, card, list).'],
];

const sections = C.map(([id, name, idea, weak], i) => {
  const items = manifest.filter(m => m.concept === id);
  const frames = items.filter(m => /^f\d/.test(m.name));
  const states = items.filter(m => !/^f\d/.test(m.name) && m.name !== 'busiest');
  const fig = m => `<figure>${img(`${id}-${m.name}-phone.jpg`, `${name}: ${m.caption}`, 600, 70)}<figcaption>${m.caption}</figcaption></figure>`;
  return `<section id="${id}">
  <p class="num">${i + 1} / ${C.length}</p>
  <h2>${name}</h2>
  <p class="idea">${idea}</p>
  <p class="meta">${weak}</p>
  <figure class="hero">${img(`${id}-busiest-phone.jpg`, `${name}, busiest, full screen`, 780, 74)}<figcaption>Busiest: VEGA (starred, visited, plan stop, long note, long address)</figcaption></figure>
  <figure class="hero">${img(`${id}-busiest-crop.jpg`, `${name}, busiest, close-up`)}<figcaption>Close-up</figcaption></figure>
  ${frames.length ? `<h3>In motion</h3><p class="hint">Pink dashed lines and rings are notes, not part of the design.</p><div class="grid">${frames.map(fig).join('')}</div>` : ''}
  <h3>Other places</h3>
  <div class="grid">${states.map(fig).join('')}</div>
</section>`;
}).join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Popup Concepts Round 2</title>
<style>
  :root { --bg: #F2EBDD; --surface: #FAF5EA; --ink: #1A1A18; --ink-2: #5A564C; --hair: #D8CEBA; color-scheme: light dark; }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) { --bg: #1B1A17; --surface: #25231F; --ink: #EDE6D8; --ink-2: #B3AB9C; --hair: #3A3630; }
  }
  :root[data-theme="dark"] { --bg: #1B1A17; --surface: #25231F; --ink: #EDE6D8; --ink-2: #B3AB9C; --hair: #3A3630; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-text-size-adjust: 100%; }
  body { background: var(--bg); color: var(--ink); font: 16px/24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px 16px 64px; overflow-x: hidden; }
  main { max-width: 760px; margin: 0 auto; }
  h1 { font-size: 26px; line-height: 32px; font-weight: 700; letter-spacing: -0.01em; }
  .lede { margin-top: 8px; color: var(--ink-2); }
  .box { margin-top: 16px; background: var(--surface); border: 1px solid var(--hair); border-radius: 4px; padding: 12px 16px; }
  .box h3 { font-size: 13px; line-height: 20px; text-transform: uppercase; letter-spacing: .08em; color: var(--ink-2); margin: 0; }
  .box ul, .box ol { margin: 4px 0 0 20px; }
  .box li { margin-top: 4px; font-size: 15px; line-height: 22px; }
  nav { margin-top: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
  nav a { color: var(--ink); text-decoration: none; font-size: 14px; border: 1px solid var(--hair); border-radius: 4px; padding: 6px 10px; background: var(--surface); }
  section { margin-top: 40px; padding-top: 24px; border-top: 1px solid var(--hair); }
  .num { font-size: 13px; color: var(--ink-2); letter-spacing: .06em; }
  h2 { font-size: 22px; line-height: 28px; margin-top: 2px; }
  h3 { font-size: 13px; line-height: 20px; text-transform: uppercase; letter-spacing: .08em; color: var(--ink-2); margin-top: 24px; }
  .idea { margin-top: 8px; }
  .meta, .hint { margin-top: 8px; font-size: 14px; line-height: 20px; color: var(--ink-2); }
  .hint { margin-top: 2px; }
  figure { margin-top: 16px; }
  figure img { display: block; width: 100%; height: auto; border: 1px solid var(--hair); border-radius: 4px; background: var(--surface); }
  .hero img { max-width: 420px; }
  figcaption { margin-top: 6px; font-size: 13px; line-height: 18px; color: var(--ink-2); }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 12px; }
  .grid figure { margin-top: 12px; }
  footer { margin-top: 48px; font-size: 13px; line-height: 20px; color: var(--ink-2); }
</style>
</head>
<body>
<main>
  <h1>Popup Concepts Round 2</h1>
  <p class="lede">Four ways to show a place, after both reviews and your notes. Each starts with the busiest real place (VEGA), then the motion, then six other real places. Pinch to zoom.</p>
  <div class="box">
    <h3>Changed from your notes</h3>
    <ul>
      <li>Notes come first: a normal note shows whole. Only a long one folds.</li>
      <li>Type is quieter, in a line under the name (the same line as in the list).</li>
      <li>Option B replaces the list with the place, fully.</li>
      <li>One star per card: the star button is the mark. One visited stamp.</li>
      <li>Address cut to one line; the full address is one tap away.</li>
    </ul>
  </div>
  <div class="box">
    <h3>Your calls</h3>
    <ol>
      <li>“Get Directions” or “Directions”? (B shows both)</li>
      <li>Signed-out viewers: Get Directions only, or Star and Visited too?</li>
      <li>B: keep the sheet one fixed height (empty paper for name-only places), or let it fit the content?</li>
      <li>The orange selected row is very loud next to an open card (A, D). Keep it?</li>
      <li>C: buttons above the note so they never move. OK?</li>
    </ol>
  </div>
  <nav>${C.map(([id, name]) => `<a href="#${id}">${name}</a>`).join('')}</nav>
${sections}
  <footer>The map is a stand-in drawing (real map tiles can’t load where these were made). Rendered in Chrome; not checked on iPhone yet. Details: design/popup-hierarchy/round2/README.md.</footer>
</main>
</body>
</html>
`;
fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('index.html', (html.length / 1048576).toFixed(2) + ' MB');
