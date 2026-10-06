// Builds index.html ("Popup Concepts Round 3"): the owner's phone-readable contact sheet, JPEGs embedded as base64
// from ./_sheet (render.js writes them + manifest.json).   node design/popup-hierarchy/round3/build-sheet.js
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const S = path.join(__dirname, '_sheet');
const manifest = JSON.parse(fs.readFileSync(path.join(S, 'manifest.json'), 'utf8'));
const b64 = (file, w, q) => { const p = path.join(S, file); if (!fs.existsSync(p)) return '';
  const buf = execFileSync('convert', [p, '-resize', `${w}x>`, '-quality', String(q), 'jpg:-']);
  return `data:image/jpeg;base64,${buf.toString('base64')}`; };
const img = (file, alt, w, q) => `<img src="${b64(file, w, q)}" alt="${alt}" loading="lazy">`;

// [folder, name, one line, from the inspo, pin link, weak spot]
const C = [
  ['label', 'Luggage Label', 'Tap a place and the list becomes its hotel label: an orange band with the pin’s own seal as the emblem and the name in label lettering. A place with no note gets poster-size lettering, so the paper is never empty.',
    'Hotel de la Poste, Hotel Guynemer and Savoy luggage labels.', 'The pin’s seal lifts off the map and lands as the label’s emblem.',
    'Weak spot: a big orange field, loudest on a name-only place. The list is away while a place is open.'],
  ['tag', 'Hanging Tag', 'The place hangs off its pin on a string, as a luggage tag. The address is on the tear-off stub. A long note: turn the tag over to read the back.',
    'Luggage tags and the hotel labels; the trail scrapbook’s paper and string.', 'The pin is the knot the tag hangs from; the eyelet is ringed in the pin’s colour.',
    'Weak spot: still covers the map under the pin. The back is for reading only; turn back to act.'],
  ['file', 'Card File', 'The list is a card file. Tap a place and its card is pulled up out of the file: an index card with the note typed on its ruled lines. A tab sticks up only when there’s more behind it.',
    'The ledger rows and the scrapbook’s typed field notes; round 1’s side tab, as an index tab.', 'The card is the place’s own row, pulled out (same number, same seal).',
    'Weak spot: typewriter face is a stand-in font. Quieter than the others.'],
  ['stamp', 'Passport Stamp', 'The card is an entry stamp. Not visited: an empty dashed frame waiting for ink, and its foot is the Mark Visited button. Tap it and the stamp comes down and inks the frame.',
    'The passport stamps (Tokyo “departed” stamp).', 'Visited ties the card to the row’s stamp; the pin keeps its sticker.',
    'Weak spot: the name in stamp caps; the frame is a box around the name. The boldest; may read as a costume.'],
  ['post', 'Postcard', 'The list becomes the back of a postcard. Your note is the message, the address sits on the address lines, the pin’s seal is the postage stamp, and Visited is the postmark.',
    'Postcards and the trail scrapbook; the passport stamps for the postmark.', 'The pin’s seal flies to the corner and becomes the postage stamp.',
    'Weak spot: the note gets a narrower column, so long notes wrap more. The list is away while a place is open.'],
];

const sections = C.map(([id, name, idea, inspo, pin, weak], i) => {
  const items = manifest.filter(m => m.concept === id);
  const frames = items.filter(m => /^f\d/.test(m.name));
  const states = items.filter(m => !/^f\d/.test(m.name) && m.name !== 'busiest');
  const fig = m => `<figure>${img(`${id}-${m.name}-phone.jpg`, `${name}: ${m.caption}`, 600, 68)}<figcaption>${m.caption}</figcaption></figure>`;
  return `<section id="${id}">
  <p class="num">${i + 1} / ${C.length}</p>
  <h2>${name}</h2>
  <p class="idea">${idea}</p>
  <dl><dt>From</dt><dd>${inspo}</dd><dt>Pin</dt><dd>${pin}</dd></dl>
  <p class="meta">${weak}</p>
  <figure class="hero">${img(`${id}-busiest-phone.jpg`, `${name}, busiest, full screen`, 780, 72)}<figcaption>Busiest: VEGA (starred, visited, plan stop 2, long note, long address)</figcaption></figure>
  <figure class="hero">${img(`${id}-busiest-crop.jpg`, `${name}, busiest, close-up`, 1000, 74)}<figcaption>Close-up</figcaption></figure>
  ${frames.length ? `<h3>In motion</h3><p class="hint">Pink lines and rings are notes, not part of the design.</p><div class="grid">${frames.map(fig).join('')}</div>` : ''}
  <h3>Other places</h3>
  <div class="grid">${states.map(fig).join('')}</div>
</section>`;
}).join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Popup Concepts Round 3</title>
<style>
  :root { --bg: #F2EBDD; --surface: #FAF5EA; --ink: #1A1A18; --ink-2: #5A564C; --hair: #D8CEBA; --accent: #A8400C; color-scheme: light dark; }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) { --bg: #1B1A17; --surface: #25231F; --ink: #EDE6D8; --ink-2: #B3AB9C; --hair: #3A3630; --accent: #EE7434; }
  }
  :root[data-theme="dark"] { --bg: #1B1A17; --surface: #25231F; --ink: #EDE6D8; --ink-2: #B3AB9C; --hair: #3A3630; --accent: #EE7434; }
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
  nav a { color: var(--ink); text-decoration: none; font-size: 14px; border: 1px solid var(--hair); border-radius: 4px; padding: 8px 12px; background: var(--surface); }
  section { margin-top: 40px; padding-top: 24px; border-top: 1px solid var(--hair); }
  .num { font-size: 13px; color: var(--ink-2); letter-spacing: .06em; }
  h2 { font-size: 22px; line-height: 28px; margin-top: 2px; }
  h3 { font-size: 13px; line-height: 20px; text-transform: uppercase; letter-spacing: .08em; color: var(--ink-2); margin-top: 24px; }
  .idea { margin-top: 8px; }
  dl { margin-top: 8px; display: grid; grid-template-columns: auto 1fr; gap: 2px 12px; font-size: 14px; line-height: 20px; }
  dt { color: var(--accent); font-weight: 600; }
  dd { color: var(--ink); }
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
  <h1>Popup Concepts Round 3</h1>
  <p class="lede">Five new ways to open a place, each built from one object in the inspo. Each starts with the busiest real place (VEGA), then the motion, then other real places. Pinch to zoom.</p>
  <div class="box">
    <h3>The same in all five</h3>
    <ul>
      <li>Name and your note read first. A normal note shows whole; only a long one folds.</li>
      <li>Type is the small line under the name.</li>
      <li>“Directions”. Star only shows filled when starred.</li>
      <li>The three buttons are the same size and evenly spaced. Visited is a small check, not the big stamp, unless the concept makes the stamp the button.</li>
      <li>Signed out: Star and Visited show but are greyed; Directions still works.</li>
      <li>The pins on the map are unchanged.</li>
    </ul>
  </div>
  <div class="box">
    <h3>Your calls</h3>
    <ol>
      <li>Which of these has the character you want?</li>
      <li>Luggage Label and Postcard replace the list while a place is open. OK?</li>
      <li>Card File uses a typewriter face for notes. A new font: yes or no?</li>
    </ol>
  </div>
  <nav>${C.map(([id, name]) => `<a href="#${id}">${name}</a>`).join('')}</nav>
${sections}
  <footer>The map is a stand-in drawing (real map tiles can’t load where these were made). Rendered in Chrome; not checked on iPhone. Details: design/popup-hierarchy/round3/README.md.</footer>
</main>
</body>
</html>
`;
fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('index.html', (html.length / 1048576).toFixed(2) + ' MB');
