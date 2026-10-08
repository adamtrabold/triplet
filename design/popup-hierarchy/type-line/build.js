// Builds index.html ("Tag Type Line") for the owner: A Ledger vs D Rubber stamp, busiest first.
//   node design/popup-hierarchy/type-line/render-r2.js && node design/popup-hierarchy/type-line/build.js
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const D = __dirname;
const b64 = (file, w, q) => `data:image/jpeg;base64,${execFileSync('convert', [path.join(D, file), '-resize', `${w}x>`, '-quality', String(q), 'jpg:-']).toString('base64')}`;
const P = (v, s) => `stills/r2/${v}/${s}-phone@1x.png`, C = (v, s) => `stills/r2/${v}/${s}-crop@3x.png`;
const fig = (file, cap, w = 640, q = 72) => `<figure><img src="${b64(file, w, q)}" alt="${cap}" loading="lazy"><figcaption>${cap}</figcaption></figure>`;
const L = (v, s) => `stills/r2/${v}/${s}-line@3x.png`;
// the field line itself, full width, A above D: the detail that decides it, readable without zooming
const lines = (s, note = '') => fig(L('ledger', s), `A · Ledger${note}, the line up close`, 720, 78) + fig(L('stamp', s), `D · Rubber stamp${note}, the line up close`, 720, 78);
const pair = (s, note = '', crop = true) => `<div class="grid">${fig((crop ? C : P)('ledger', s), `A · Ledger${note}`)}${fig((crop ? C : P)('stamp', s), `D · Rubber stamp${note}`)}</div>`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Tag Type Line</title>
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
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 12px; }
  ol.dec { margin: 8px 0 0 20px; }
  ol.dec li { margin-top: 8px; }
  footer { margin-top: 48px; font-size: 13px; line-height: 20px; color: var(--ink-2); }
</style>
</head>
<body>
<main>
  <h1>Tag Type Line</h1>
  <p class="lede">Two ways to make the tag's TYPE / PLAN line read clearly, drawn from the luggage-tag references. A is quiet. D stamps the type like a baggage clerk. Pinch to zoom.</p>

  <h2>1. Busiest: starred, visited, plan stop</h2>
  <p class="t"><b>A · Ledger:</b> a small printed label, then the entry written in plain text (“Bar”, “Stop 3 of 3”), so it no longer looks like the button labels below it.</p>
  <p class="t"><b>D · Rubber stamp:</b> the type is rubber-stamped: grey ink, the paper's grain showing through, a slight tilt fixed for each place. The plan stop stays plain text so the number stays quiet. The VISITED stamp sits right beside it here, so you can judge both stamps together.</p>
  ${lines('busiest')}
  ${pair('busiest')}
  ${pair('busiest', ', whole phone', false)}

  <h2>2. Typical: type only</h2>
  ${lines('typical')}
  ${pair('typical')}

  <h2>3. District</h2>
  ${lines('district')}
  ${pair('district')}

  <h2>4. Long: “Restaurant”, Stop 12 of 14, Plans view</h2>
  ${lines('long')}
  ${pair('long')}
  <p class="t">On the narrowest tag (a 320-wide phone) both still fit on one line.</p>
  ${lines('long-narrow', ', narrow tag')}
  ${pair('long-narrow', ', narrow tag')}

  <h2>5. Signed out</h2>
  ${lines('signedout')}
  ${pair('signedout')}

  <h2>Also tried: D with the plan stamped too</h2>
  <p class="t">Both entries are stamped, at the same quiet size. It has more character, but the stop number becomes a second inked mark.</p>
  <div class="grid">${fig(C('stampboth', 'busiest'), 'D, both stamped · busiest')}${fig(C('stampboth', 'long-narrow'), 'D, both stamped · long, narrow')}</div>

  <h2>Decisions</h2>
  <ol class="dec">
    <li>A or D?</li>
    <li>If D, is a second stamp next to VISITED OK?</li>
  </ol>

  <footer>Concept stills from the real app with only the type line changed (Chromium; stand-in map). D's textured ink measures 5.0–5.4:1 on the tag paper (at least 4.5 needed). Records: design/popup-hierarchy/type-line/README.md.</footer>
</main>
</body>
</html>
`;
fs.writeFileSync(path.join(D, 'index.html'), html);
console.log('index.html', (html.length / 1024).toFixed(0), 'KB');
