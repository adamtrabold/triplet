// Builds index.html ("Popup Round 4"): the owner's combined page for Hanging Tag v2 and the two Card File variants.
//   node design/popup-hierarchy/round4/build.js   (after tag/render.js and file/render.js + file/filmstrip.js)
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const D = __dirname;
const b64 = (file, w, q) => `data:image/jpeg;base64,${execFileSync('convert', [path.join(D, file), '-resize', `${w}x>`, '-quality', String(q), 'jpg:-']).toString('base64')}`;
const fig = (file, cap, w = 560, q = 66, cls = '') => `<figure${cls ? ` class="${cls}"` : ''}><img src="${b64(file, w, q)}" alt="${cap}" loading="lazy"><figcaption>${cap}</figcaption></figure>`;
const grid = items => `<div class="grid">${items.map(([f, c]) => fig(f, c)).join('')}</div>`;
const strip = (files, cap) => `<figure class="strip"><div class="row">${files.map(f => `<img src="${b64(f, 300, 62)}" alt="" loading="lazy">`).join('')}</div><figcaption>${cap}</figcaption></figure>`;
const T = n => `tag/stills/${n}-phone@1x.png`, T3 = n => `tag/stills/${n}-crop@3x.png`;

const tag = `<section id="tag">
  <p class="num">1 / 3</p>
  <h2>Hanging Tag v2</h2>
  <ul class="notes">
    <li><b>Pops out of the pin</b> and hangs on a straight string. No swing.</li>
    <li><b>Short address under the name:</b> street · neighbourhood.</li>
    <li><b>The tear-off stub is Visited.</b> Two takes below: A punches it, C stamps it.</li>
    <li><b>Long notes show in full.</b> No flip-over.</li>
  </ul>
  <h3>Visited on the stub: A or C?</h3>
  <div class="grid">${fig(T('busiest'), 'A. Punched: a check-shaped hole in the stub', 600, 70)}${fig(T('busiest-stamp'), 'C. Stamped: the list’s VISITED stamp', 600, 70)}</div>
  <div class="grid">${fig(T3('stub-punch'), 'A close up', 600, 72)}${fig(T3('stub-stamp'), 'C close up', 600, 72)}</div>
  ${strip(['punch1', 'punch2', 'punch3'].map(T3), 'A in motion: tap the stub → punched, the chad drops out → visited (the pin turns to its visited sticker)')}
  ${strip(['stamp1', 'stamp2', 'stamp3'].map(T3), 'C in motion: tap the stub → the stamp comes down → stamped')}
  <h3>Opening</h3>
  ${strip(['pop0', 'pop1', 'pop2', 'pop3', 'pop4', 'pop5'].map(n => T3(n)), 'Tap → map pans, list drops → tag grows out of the pin → drops → bounces → hangs still (about ¼ second)')}
  <p class="flag">While a tag is open, the list drops to its header.</p>
  <h3>Other places</h3>
  ${grid([[T('typical'), 'Typical note'], [T('approx'), 'Longest note (8 lines), in full'], [T('bare'), 'Name only'], [T('shape'), 'District. New: a small diamond on the map for the string to hang from'], [T('signedout'), 'Signed out: Star and Visited greyed, Directions works'], [T('swap'), 'Tag open: one tap on another pin swaps to it']])}
</section>`;

const F = (dir, n, name, line, weak, plansName) => `<section id="${dir}">
  <p class="num">${n} / 3</p>
  <h2>${name}</h2>
  <p class="idea">${line}</p>
  <figure class="film"><img src="${b64(`file/${dir}/filmstrip.png`, 824, 68)}" alt="${name} in motion" loading="lazy"><figcaption>In motion, step by step</figcaption></figure>
  <h3>Stills</h3>
  ${grid([[`file/${dir}/busiest-phone@1x.png`, 'Busiest: VEGA'], [`file/${dir}/${plansName}-phone@1x.png`, 'In a plan: stop 1, long name'], [`file/${dir}/typical-phone@1x.png`, 'Typical note'], [`file/${dir}/bare-phone@1x.png`, 'Name only'], [`file/${dir}/signedout-phone@1x.png`, 'Signed out']])}
  <p class="meta"><b>Weak spot.</b> ${weak}</p>
</section>`;

const rolo = F('rolo', 2, 'Card File: Rolodex', 'The list is a card drawer. Tap a place and its card tips forward to face you, with the card before it standing behind and the rest of the list in front.',
  'The open drawer is always tall, so the map shrinks for every place, even a name-only one.', 'plans');
const out = F('out', 3, 'Card File: Dealt Out', 'Tap a place and its card is pulled out of the list and laid on the map under its pin. The list closes up around a thin slot where it goes back, and stays usable.',
  'It covers the map between the pin and the list, and in a still it looks like a callout; the card-file idea shows mainly in the motion.', 'plans');

const decide = `<section id="decide">
  <h2>Decisions for you</h2>
  <ol class="dec">
    <li>Pick a direction: Tag (A punched or C stamped), Rolodex, or Dealt Out.</li>
    <li>Signed out: Directions stays tappable (it changes nothing)? And should tapping a greyed-out Star or Visited offer sign-in?</li>
    <li>OK that the list drops to its header while a tag is open?</li>
    <li>OK for a district to show a small diamond on the map while its tag is open?</li>
  </ol>
</section>`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Popup Round 4</title>
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
  nav { margin-top: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
  nav a { color: var(--ink); text-decoration: none; font-size: 14px; border: 1px solid var(--hair); border-radius: 4px; padding: 8px 12px; background: var(--surface); }
  section { margin-top: 40px; padding-top: 24px; border-top: 1px solid var(--hair); }
  .num { font-size: 13px; color: var(--ink-2); letter-spacing: .06em; }
  h2 { font-size: 22px; line-height: 28px; margin-top: 2px; }
  h3 { font-size: 13px; line-height: 20px; text-transform: uppercase; letter-spacing: .08em; color: var(--ink-2); margin-top: 24px; }
  .idea { margin-top: 8px; }
  ul.notes { margin: 8px 0 0 20px; }
  ul.notes li { margin-top: 4px; font-size: 15px; line-height: 22px; }
  .flag { margin-top: 16px; padding: 10px 12px; background: var(--surface); border: 1px solid var(--hair); border-radius: 4px; font-size: 15px; line-height: 22px; }
  .meta { margin-top: 16px; font-size: 15px; line-height: 22px; color: var(--ink-2); }
  figure { margin-top: 12px; }
  figure img { display: block; width: 100%; height: auto; border: 1px solid var(--hair); border-radius: 4px; background: var(--surface); }
  figcaption { margin-top: 6px; font-size: 13px; line-height: 18px; color: var(--ink-2); }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 12px; }
  .strip .row { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 4px; }
  .strip .row img { border-radius: 3px; }
  .film img { max-width: 560px; }
  ol.dec { margin: 8px 0 0 20px; }
  ol.dec li { margin-top: 8px; font-size: 16px; line-height: 24px; }
  footer { margin-top: 48px; font-size: 13px; line-height: 20px; color: var(--ink-2); }
</style>
</head>
<body>
<main>
  <h1>Popup Round 4</h1>
  <p class="lede">Your tag notes, applied, and two takes on Card File. Pick one at the bottom. Pinch to zoom.</p>
  <nav><a href="#tag">Hanging Tag</a><a href="#rolo">Rolodex</a><a href="#out">Dealt Out</a><a href="#decide">Decide</a></nav>
${tag}
${rolo}
${out}
${decide}
  <footer>The map is a stand-in drawing (real tiles can’t load where these were made). Rendered in Chrome, not checked on iPhone. Details: design/popup-hierarchy/round4/tag/README.md and file/README.md.</footer>
</main>
</body>
</html>
`;
fs.writeFileSync(path.join(D, 'index.html'), html);
console.log('index.html', (html.length / 1048576).toFixed(2) + ' MB');
