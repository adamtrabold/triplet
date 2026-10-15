// Builds index.html ("Hanging Tag v3") for the owner from round5/tag renders.
//   node design/popup-hierarchy/round5/tag/render.js && node design/popup-hierarchy/round5/build.js
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const D = __dirname;
const b64 = (file, w, q) => `data:image/jpeg;base64,${execFileSync('convert', [path.join(D, file), '-resize', `${w}x>`, '-quality', String(q), 'jpg:-']).toString('base64')}`;
const P = n => `tag/stills/${n}-phone@1x.png`, C = n => `tag/stills/${n}-crop@3x.png`;
const fig = (file, cap, w = 560, q = 66) => `<figure><img src="${b64(file, w, q)}" alt="${cap}" loading="lazy"><figcaption>${cap}</figcaption></figure>`;
const grid = items => `<div class="grid">${items.map(([f, c]) => fig(f, c)).join('')}</div>`;
const strip = (files, cap) => `<figure class="strip"><div class="row">${files.map(f => `<img src="${b64(f, 340, 64)}" alt="" loading="lazy">`).join('')}</div><figcaption>${cap}</figcaption></figure>`;

const V = [
  ['seg', 'A. Segmented stub', 'The tear-off stub is three buttons: Directions, Star, Visited. Visited gets punched: a check-shaped hole, the map shows through.'],
  ['claim', 'B. Claim check', 'The stub is the claim check: Directions, centred, on its own. Star and Visited sit just above it. Visited still gets the punch.'],
];
const sec = ([v, name, line], i) => `<section id="${v}">
  <p class="num">${i + 1} / 2</p>
  <h2>${name}</h2>
  <p class="idea">${line}</p>
  ${fig(P(v + '-busiest'), 'Busiest: VEGA (starred, visited, plan stop 2)', 780, 72)}
  ${fig(C(v + '-busiest'), 'Close-up', 900, 74)}
  ${strip([1, 2, 3].map(n => C(`${v}-v${n}`)), 'Marking visited: tap → punched, the check-shaped piece falls out → visited (the pin turns to its visited sticker)')}
  <h3>Other places</h3>
  ${grid([[P(v + '-typical'), 'Typical note'], [P(v + '-approx'), 'Longest note (8 lines), in full'], [P(v + '-bare'), 'Name only'], [P(v + '-shape'), 'District'], [P(v + '-signedout'), 'Signed out: Star and Visited greyed, Directions works'], [P(v + '-worst'), 'Worst case: starred, visited, plan stop, long note, signed out']])}
</section>`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Hanging Tag v3</title>
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
  ul.notes { margin: 12px 0 0 20px; }
  ul.notes li { margin-top: 4px; font-size: 15px; line-height: 22px; }
  nav { margin-top: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
  nav a { color: var(--ink); text-decoration: none; font-size: 14px; border: 1px solid var(--hair); border-radius: 4px; padding: 8px 12px; background: var(--surface); }
  section { margin-top: 40px; padding-top: 24px; border-top: 1px solid var(--hair); }
  .num { font-size: 13px; color: var(--ink-2); letter-spacing: .06em; }
  h2 { font-size: 22px; line-height: 28px; margin-top: 2px; }
  h3 { font-size: 13px; line-height: 20px; text-transform: uppercase; letter-spacing: .08em; color: var(--ink-2); margin-top: 24px; }
  .idea { margin-top: 8px; }
  figure { margin-top: 12px; }
  figure img { display: block; width: 100%; height: auto; border: 1px solid var(--hair); border-radius: 4px; background: var(--surface); }
  figure:not(.strip) > img { max-width: 420px; }
  .grid figure > img { max-width: none; }
  figcaption { margin-top: 6px; font-size: 13px; line-height: 18px; color: var(--ink-2); }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 12px; }
  .strip .row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; }
  ol.dec { margin: 8px 0 0 20px; }
  ol.dec li { margin-top: 8px; }
  footer { margin-top: 48px; font-size: 13px; line-height: 20px; color: var(--ink-2); }
</style>
</head>
<body>
<main>
  <h1>Hanging Tag v3</h1>
  <p class="lede">Your notes, applied. Two ways to do the stub. Pinch to zoom.</p>
  <ul class="notes">
    <li><b>Stub is a claim check, not just Visited:</b> A makes it three buttons; B puts Directions there, centred.</li>
    <li><b>Type is out of the header:</b> a quiet “TYPE · BAR” line under the note, like a tag’s small fields.</li>
    <li>Kept: pops out of the pin on a straight string, short address under the name, full notes.</li>
  </ul>
  <h3>Side by side</h3>
  <div class="grid">${fig(P('seg-busiest'), 'A. Segmented stub')}${fig(P('claim-busiest'), 'B. Claim check')}</div>
  <nav>${V.map(([v, n]) => `<a href="#${v}">${n}</a>`).join('')}<a href="#decide">Decide</a></nav>
${V.map(sec).join('\n')}
  <section id="decide">
    <h2>Decisions for you</h2>
    <ol class="dec">
      <li>Pick one: A Segmented stub or B Claim check.</li>
      <li>Signed out: does Directions stay tappable? Does tapping a greyed Star or Visited offer sign-in?</li>
      <li>OK that the list drops to its header while a tag is open?</li>
      <li>OK for a district to show a small diamond on the map while its tag is open?</li>
    </ol>
  </section>
  <footer>The map is a stand-in drawing; the punched hole will show real map tiles through it. Rendered in Chrome, not checked on iPhone. Details: design/popup-hierarchy/round5/tag/README.md.</footer>
</main>
</body>
</html>
`;
fs.writeFileSync(path.join(D, 'index.html'), html);
console.log('index.html', (html.length / 1048576).toFixed(2) + ' MB');
