// Builds ../shape-pins.html ("District & Street Pins") for the owner from the shape-pin stills.
//   node design/popup-hierarchy/round6/shape-pin/build.js
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const D = __dirname, S = n => path.join(D, 'stills', n);
const b64 = (file, w, q) => `data:image/jpeg;base64,${execFileSync('convert', [file, '-resize', `${w}x>`, '-quality', String(q), 'jpg:-']).toString('base64')}`;
const P = n => S(`${n}-phone@1x.png`), C = n => S(`${n}-crop@3x.png`);
const fig = (file, cap, w = 560, q = 66) => `<figure><img src="${b64(file, w, q)}" alt="${cap}" loading="lazy"><figcaption>${cap}</figcaption></figure>`;
const grid = items => `<div class="grid">${items.map(([f, c, w, q]) => fig(f, c, w, q)).join('')}</div>`;

const variant = (v, title, strength, weak, extra = '') => `
  <h2>${title}</h2>
  <p class="t"><b>Strength:</b> ${strength}</p>
  <p class="t"><b>Weak spot:</b> ${weak}</p>
  ${extra}
  <div class="hero">${fig(P(`${v}-busy-z14`), 'Busiest map (zoom 14, where districts first appear)', 780, 72)}</div>
  <div class="hero">${fig(C(`${v}-busy-z14`), 'Close-up: a place pin sits on top of a visited district pin', 900, 74)}</div>
  ${grid([[P(`${v}-district`), 'District open: the tag hangs from its pin', 780, 70], [P(`${v}-street`), 'Street open', 780, 70]])}
  ${grid([[C(`${v}-visited`), 'Visited district (centre) beside visited places', 900, 72], [C(`${v}-states`), 'Every state: unvisited, starred, visited, both, open; plan stop', 1000, 74]])}
  ${grid([[P(`${v}-plan`), 'Plans: the district is stop 2, the street stop 4', 780, 70], [P(`${v}-busy-z16`), 'Old town at zoom 16', 780, 70]])}`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>District &amp; Street Pins</title>
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
  figure { margin-top: 12px; min-width: 0; }
  figure img { display: block; width: 100%; height: auto; border: 1px solid var(--hair); border-radius: 4px; background: var(--surface); }
  .inspo img { max-width: 200px; }
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
  <h1>District &amp; Street Pins</h1>
  <p class="lede">Two pin types for districts and streets. The tag hangs from the pin. Pinch to zoom.</p>
  <ul class="notes">
    <li>One pin per district or street. It carries the star, visited and the plan number, and it sits under place pins where they overlap.</li>
    <li>It shows only when the outline does, so it never joins a cluster.</li>
    <li>The map stills show both app-wide options below turned on (coloured outlines, no-dot streets).</li>
    <li>Stars are black here. Their colour will follow the app-wide star decision, so please don’t judge these pins on it.</li>
    <li>A third idea, a tiny tag as the pin, was dropped: when open, two tags hung on one string.</li>
  </ul>
${variant('pennant', 'A · Staked pennant', 'the clearest “an area, not a place” shape on a busy map, and the clearest visited: the flag is filled in.', 'the flag sits a little up and right of the exact spot.')}
${variant('blaze', 'B · Trail blaze', 'the same diamond the list already uses, centred right on its spot.', 'it can read as “the diamond again”, and a diamond opening a tag isn’t one idea.',
  `<div class="inspo">${fig(S('inspo-pct-blaze.jpg'), 'Where it comes from: the Pacific Crest Trail blaze (your Yosemite scrapbook reference)', 400, 74)}</div>`)}
  <h2>App-wide option 1: coloured outlines</h2>
  <p class="t">Today every district and street outline is grey, even though its pin, chip and list icon are teal or rust. The option draws each outline in its own colour, a little lighter than today’s grey (60%).</p>
  ${grid([[C('opt-shipped'), 'Before: grey outlines', 780, 70], [C('opt-a'), 'After: outlines in their colour', 780, 70]])}
  <h2>App-wide option 2: streets without dots</h2>
  <p class="t">Today a street is a heavy chain of round dots on the map, and its icon is three specks. The option makes it a thin solid line and a solid road icon, in the list too.</p>
  ${grid([[C('opt-shipped'), 'Before: dotted street and icon', 780, 70], [C('opt-b'), 'After: solid line and road icon', 780, 70]])}
  ${grid([[C('opt-ab'), 'Both options on (as in the map stills above)', 780, 70]])}
  <h2>Decisions for you</h2>
  <ol class="dec">
    <li>Pick a pin: A (pennant) or B (blaze)?</li>
    <li>Coloured outlines: yes or no?</li>
    <li>Streets without dots: yes or no?</li>
  </ol>
  <footer>The map is a stand-in drawing with made-up Reykjavík districts. Rendered in Chrome, not checked on iPhone. Details: design/popup-hierarchy/round6/shape-pin/README.md.</footer>
</main>
</body>
</html>
`;
fs.writeFileSync(path.join(D, '..', 'shape-pins.html'), html);
console.log('shape-pins.html', (html.length / 1048576).toFixed(2) + ' MB');
