// Builds index.html ("Un-visit Transition", round 2) for the owner: today first, then Lift off (lead),
// Dry up (UX's alternate), Strike through (CD's alternate), reduced motion, the decision.
//   node design/popup-hierarchy/unvisit/render-r2.js && node design/popup-hierarchy/unvisit/build.js
// (Round 1's page builder: build-r1.js.)
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const D = __dirname, R = 'stills/r2/';
const jpg = (file, w, q) => `data:image/jpeg;base64,${execFileSync('convert', [path.join(D, file), '-resize', `${w}x>`, '-quality', String(q), 'jpg:-']).toString('base64')}`;
const png = file => `data:image/png;base64,${fs.readFileSync(path.join(D, file)).toString('base64')}`;
const fig = (file, cap, w = 900) => `<figure><img src="${jpg(file, w, 74)}" alt="${cap}" loading="lazy"><figcaption>${cap}</figcaption></figure>`;
// the whole tag at TRUE 1x: shown at its own pixel size, scrolled sideways inside its frame
const one = (file, cap) => { const [w, h] = execFileSync('identify', ['-format', '%w %h', path.join(D, file)]).toString().split(' ').map(Number);
  return `<figure><div class="scroll"><img class="native" src="${png(file)}" width="${w}" height="${h}" alt="${cap}"></div><figcaption>${cap} Swipe sideways.</figcaption></figure>`; };
const narrow = k => `<div class="grid">${fig(`${R}${k}-strip-s100.png`, 'Small phone (stamp 1.0)', 640)}${fig(`${R}${k}-strip-s085.png`, 'Smallest tag (stamp 0.85)', 640)}</div>`;
const section = (k, title, who, what) => `
  <h2>${title}</h2>
  <p class="who">${who}</p>
  <p class="t">${what}</p>
  ${fig(`${R}${k}-strip.png`, `${title}: frames from the real tag, top to bottom`)}
  ${one(`${R}${k}-tag1x.png`, 'The whole tag at true phone size.')}
  ${narrow(k)}`;

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
  .lede, p.t, p.who { margin-top: 8px; font-size: 15px; line-height: 22px; }
  .lede, p.who { color: var(--ink-2); }
  p.who { font-style: italic; }
  figure { margin-top: 12px; min-width: 0; }
  figure img { display: block; width: 100%; height: auto; border: 1px solid var(--hair); border-radius: 4px; background: var(--surface); }
  .scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; border: 1px solid var(--hair); border-radius: 4px; background: var(--surface); }
  .scroll img.native { width: auto; max-width: none; border: 0; border-radius: 0; }
  figcaption { margin-top: 6px; font-size: 13px; line-height: 18px; color: var(--ink-2); }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 12px; }
  ol.dec { margin: 8px 0 0 20px; }
  ol.dec li { margin-top: 8px; }
  footer { margin-top: 48px; font-size: 13px; line-height: 20px; color: var(--ink-2); }
</style>
</head>
<body>
<main>
  <h1>Un-visit Transition</h1>
  <p class="lede">How the VISITED stamp should leave when you tap Visited again on the tag. Today first, then three options. In all three the stamp lifts with the same small pop as the list row, at the same moment, pales to a light navy and is fully gone before “Mark visited” comes back. Pinch to zoom.</p>

  <h2>Today</h2>
  <p class="t">The stamp fades and grows a little over 220 ms while “Mark visited” already shows underneath, so the two overlap the whole time.</p>
  ${fig(`${R}shipped-strip.png`, 'Today: frames from the real tag, top to bottom')}
  ${one(`${R}shipped-tag1x.png`, 'The whole tag at true phone size.')}
${section('lift', 'Lift off (lead)', 'Backed by both reviewers: the stamp-in answered, the same motion in reverse.',
  'The stamp pops up with the row, holds for a beat as if picked up, then tilts back and lifts away, paling as it goes. It stays inside its box. 360 ms.')}
${section('dry', 'Dry up', 'UX’s pick: it tells the same story as the list row, where the stamp pales away.',
  'After the same pop, the ink draws back toward the middle of the stamp and pales until it’s gone. The quietest of the three. 360 ms.')}
${section('strike', 'Strike through', 'The CD’s pick: you correct the record in pencil, the way a clerk would.',
  'A light pencil stroke is drawn through VISITED during the pop, then the struck stamp pales away. 380 ms.')}

  <h2>Reduced motion (all three)</h2>
  <p class="t">With reduced motion turned on: no pop or movement. The stamp pales and goes, then “Mark visited” comes in. 160 ms.</p>
  ${fig(`${R}reduced-strip.png`, 'Reduced motion')}

  <h2>Decision</h2>
  <ol class="dec">
    <li>Which one? (Lift off, Dry up or Strike through)</li>
  </ol>

  <footer>Frames from the real app with only the un-visit animation changed (Chromium; stand-in map). The other two segments never move. Records: design/popup-hierarchy/unvisit/README.md.</footer>
</main>
</body>
</html>
`;
fs.writeFileSync(path.join(D, 'index.html'), html);
console.log('index.html', (html.length / 1024).toFixed(0), 'KB');
