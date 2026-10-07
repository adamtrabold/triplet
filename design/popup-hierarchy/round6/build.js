// Builds tag/filmstrip.png and index.html ("Hanging Tag v4") for the owner from round6/tag renders.
//   node design/popup-hierarchy/round6/tag/render.js && node design/popup-hierarchy/round6/build.js
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const D = __dirname, S = n => path.join(D, 'tag/stills', n);
// filmstrip: the 4 stamp frames, cropped to the tag, 2x2 with captions
const caps = ['1 Tap Mark visited', '2 The stamp comes down', '3 Lands on the stub', '4 Settled: one VISITED'];
const tiles = [1, 2, 3, 4].map((n, i) => { const o = `/tmp/fs-${n}.png`;
  execFileSync('convert', [S(`st-${n}-crop@3x.png`), '-resize', '520x', '-background', '#F2EBDD', '-gravity', 'south', '-splice', '0x46', '-font', 'DejaVu-Sans', '-pointsize', '22', '-fill', '#1A1A18', '-annotate', '+0+10', caps[i], o]); return o; });
execFileSync('convert', ['(', tiles[0], tiles[1], '+append', ')', '(', tiles[2], tiles[3], '+append', ')', '-append', '-bordercolor', '#F2EBDD', '-border', '8', path.join(D, 'tag/filmstrip.png')]);

const b64 = (file, w, q) => `data:image/jpeg;base64,${execFileSync('convert', [file, '-resize', `${w}x>`, '-quality', String(q), 'jpg:-']).toString('base64')}`;
const P = n => S(`${n}-phone@1x.png`), C = n => S(`${n}-crop@3x.png`);
const fig = (file, cap, w = 560, q = 66) => `<figure><img src="${b64(file, w, q)}" alt="${cap}" loading="lazy"><figcaption>${cap}</figcaption></figure>`;
const grid = items => `<div class="grid">${items.map(([f, c]) => fig(f, c)).join('')}</div>`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Hanging Tag v4</title>
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
  h2 { font-size: 20px; line-height: 26px; margin-top: 36px; padding-top: 20px; border-top: 1px solid var(--hair); }
  .lede { margin-top: 8px; color: var(--ink-2); }
  ul.notes { margin: 12px 0 0 20px; }
  ul.notes li { margin-top: 6px; font-size: 15px; line-height: 22px; }
  p.t { margin-top: 8px; font-size: 15px; line-height: 22px; }
  figure { margin-top: 12px; }
  figure img { display: block; width: 100%; height: auto; border: 1px solid var(--hair); border-radius: 4px; background: var(--surface); }
  .hero img { max-width: 420px; }
  figcaption { margin-top: 6px; font-size: 13px; line-height: 18px; color: var(--ink-2); }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 12px; }
  ol.dec { margin: 8px 0 0 20px; }
  ol.dec li { margin-top: 8px; }
  footer { margin-top: 48px; font-size: 13px; line-height: 20px; color: var(--ink-2); }
</style>
</head>
<body>
<main>
  <h1>Hanging Tag v4</h1>
  <p class="lede">Your notes on the segmented stub, applied. Pinch to zoom.</p>
  <ul class="notes">
    <li><b>Colour:</b> Directions is plain ink now. Starred gets the colour: its stub segment is printed in the city’s accent, a light second ink, like the coloured fields on your tags. The star itself stays the same black star as on the pin and in the list.</li>
    <li><b>Visited:</b> one tap. The VISITED stamp comes down and lands on the stub, and the tag’s paper screens back to the tone of a visited row. The text stays full strength. Tap the stamp to undo.</li>
    <li><b>Signed out:</b> Directions works. Tapping a greyed Star or Visited shows a sign-in slip under the tag.</li>
    <li><b>List drops to its header</b> while a tag is open, for you to judge live.</li>
  </ul>
  ${fig(P('star-busiest'), 'Busiest: VEGA (starred, visited, plan stop 2)', 780, 72).replace('<figure>', '<figure class="hero">')}
  ${fig(C('star-busiest'), 'Close-up', 900, 74).replace('<figure>', '<figure class="hero">')}
  <h2>Marking visited</h2>
  ${fig(path.join(D, 'tag/filmstrip.png'), 'The stamp grows as it comes down, then shrinks as it lands on the stub', 1060, 74)}
  <h2>Other places</h2>
  ${grid([[P('star-typical'), 'Typical note, not visited'], [P('star-bare'), 'Name only'], [P('star-signedout'), 'Signed out'], [P('star-signin'), 'Signed out: tap Star, the sign-in slip'], [P('star-resto'), 'A starred restaurant: the starred field next to an orange pin'], [P('two-busiest'), 'Quieter option: only the star turns orange, no printed field']])}
  <h2>Decisions for you</h2>
  <ol class="dec">
    <li>Starred colour: the printed field (main stills) or the quieter orange star (last still)?</li>
    <li>Should “starred” have one colour everywhere (tag, pin and list)? Today the pin and the list use a black star.</li>
  </ol>
  <footer>The map is a stand-in drawing. Rendered in Chrome, not checked on iPhone. Details: design/popup-hierarchy/round6/tag/README.md.</footer>
</main>
</body>
</html>
`;
fs.writeFileSync(path.join(D, 'index.html'), html);
console.log('index.html', (html.length / 1048576).toFixed(2) + ' MB');
