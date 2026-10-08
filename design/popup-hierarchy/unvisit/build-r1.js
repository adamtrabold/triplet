// Builds index.html ("Un-visit Transition") for the owner: four filmstrips, today's for comparison,
// reduced motion, then the one decision.
//   node design/popup-hierarchy/unvisit/render.js && node design/popup-hierarchy/unvisit/build.js
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const D = __dirname;
const b64 = (file, w, q) => `data:image/jpeg;base64,${execFileSync('convert', [path.join(D, file), '-resize', `${w}x>`, '-quality', String(q), 'jpg:-']).toString('base64')}`;
const fig = (file, cap) => `<figure><img src="${b64(file, 900, 74)}" alt="${cap}" loading="lazy"><figcaption>${cap}</figcaption></figure>`;
const OPTS = [
  ['lift', '1. Lift off', 'The stamp-in, played backwards. The stamp gives the same small lift the star does when you unstar it, then rises off the paper along the path it came down (turning back, growing, softening) and is gone. 340 ms.'],
  ['dry', '2. Dry up', 'The ink bleed of the list swipe, reversed. After the same small lift, the ink shrinks back from the ring’s ends toward its centre through the paper’s grain, paling as it goes. 380 ms.'],
  ['rub', '3. Rub out', 'The Pencil Star’s erase. After the small lift, the stamp is rubbed out in three back-and-forth strokes, left to right, and a few eraser crumbs are swept into the corner. 400 ms.'],
  ['strike', '4. Strike through', 'How a clerk cancels a stamp: one pencil stroke is drawn through it, then stamp and stroke fade together. No lift. 380 ms.'],
];
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Un-visit Transition</title>
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
  .lede, p.t { margin-top: 8px; font-size: 15px; line-height: 22px; }
  .lede { color: var(--ink-2); }
  figure { margin-top: 12px; min-width: 0; }
  figure img { display: block; width: 100%; height: auto; border: 1px solid var(--hair); border-radius: 4px; background: var(--surface); }
  figcaption { margin-top: 6px; font-size: 13px; line-height: 18px; color: var(--ink-2); }
  ol.dec { margin: 8px 0 0 20px; }
  ol.dec li { margin-top: 8px; }
  footer { margin-top: 48px; font-size: 13px; line-height: 20px; color: var(--ink-2); }
</style>
</head>
<body>
<main>
  <h1>Un-visit Transition</h1>
  <p class="lede">Four ways for the VISITED stamp to leave when you tap Visited again on the tag. Each strip runs top to bottom, from before the tap to the resting “Mark visited”. Pinch to zoom.</p>
${OPTS.map(([k, t, d]) => `
  <h2>${t}</h2>
  <p class="t">${d}</p>
  ${fig(`stills/${k}-strip.png`, `${t}: frames from the real tag`)}`).join('')}

  <h2>For comparison: today</h2>
  <p class="t">The stamp fades and grows a little over 220 ms, with “Mark visited” already showing underneath from the first frame.</p>
  ${fig('stills/shipped-strip.png', 'Today: frames from the real tag')}

  <h2>Reduced motion (all four)</h2>
  <p class="t">With reduced motion turned on, every option becomes the same plain 160 ms crossfade: no lift, no movement.</p>
  ${fig('stills/reduced-strip.png', 'Reduced motion: crossfade')}

  <h2>Decision</h2>
  <ol class="dec">
    <li>Which one? (1 Lift off, 2 Dry up, 3 Rub out, 4 Strike through)</li>
  </ol>

  <footer>Concept frames from the real app with only the un-visit animation changed (Chromium; stand-in map). The other two segments never move. Records: design/popup-hierarchy/unvisit/README.md.</footer>
</main>
</body>
</html>
`;
fs.writeFileSync(path.join(D, 'index.html'), html);
console.log('index.html', (html.length / 1024).toFixed(0), 'KB');
