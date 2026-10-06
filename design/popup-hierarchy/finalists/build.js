// Builds index.html ("Popup Finalists") for the owner from the round-3 renders in ../round3/_sheet.
//   node design/popup-hierarchy/round3/render.js label tag post   (first, if anything changed)
//   node design/popup-hierarchy/finalists/build.js
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const S = path.join(__dirname, '../round3/_sheet');
const manifest = JSON.parse(fs.readFileSync(path.join(S, 'manifest.json'), 'utf8'));
const cap = (c, n) => (manifest.find(m => m.concept === c && m.name === n) || {}).caption || n;
const b64 = (file, w, q) => { const p = path.join(S, file);
  const buf = execFileSync('convert', [p, '-resize', `${w}x>`, '-quality', String(q), 'jpg:-']);
  return `data:image/jpeg;base64,${buf.toString('base64')}`; };
const fig = (c, n, label, big) => `<figure${big ? ' class="hero"' : ''}><img src="${b64(`${c}-${n}-phone.jpg`, big ? 780 : 560, big ? 72 : 66)}" alt="${label}" loading="lazy"><figcaption>${label}</figcaption></figure>`;
const crop = (c, n, label) => `<figure class="hero"><img src="${b64(`${c}-${n}-crop.jpg`, 900, 74)}" alt="${label}" loading="lazy"><figcaption>${label}</figcaption></figure>`;

const F = [
  { id: 'post', name: 'Postcard', line: 'The postcard you write to yourself. Your note is the message, the pin’s seal is the postage stamp, the address sits on the address lines, and Visited is the postmark.',
    from: 'Postcards and the Yosemite trail scrapbook; the passport stamps for the postmark.',
    why: 'Every part of the postcard holds real content, nothing is decoration. The address finally reads as small print. The pin’s seal becomes the stamp, so the pin and the card are one idea.',
    weak: 'Visited sits up by the stamp, not with the other two buttons. The message column is narrower, so long notes wrap more. The list is away while a place is open.',
    states: [['typical', 'Typical note'], ['bare', 'Name only'], ['signedout-unvisited', 'Signed out, not visited'], ['signedout', 'Signed out, visited']],
    motion: [['f2', 'Open: the pin’s seal flies to the stamp corner'], ['f3', 'Tap Mark visited (dashed: the target)'], ['f4', 'The postmark comes down'], ['f5', 'Lands, ink bleeds in'], ['f6', 'Settled']] },
  { id: 'label', name: 'Luggage Label', line: 'The hotel label, with the map as its picture. An orange band carries the pin’s seal as its emblem and the name in label lettering.',
    from: 'Hotel de la Poste (Cortina), Hotel Guynemer (Casablanca) and Hotel Savoy luggage labels.',
    why: 'The cleanest busiest view of the three: name, then your note, then the buttons. The map above plays the label’s picture. The band is the only colour on screen and it means “this place is open”.',
    weak: 'A big orange band. Nothing on the label changes when you’ve been there, unless you want the postmark option (last still). The list is away while a place is open.',
    states: [['typical', 'Typical note'], ['bare', 'Name only'], ['longname', 'Long name, still in label lettering'], ['signedout-unvisited', 'Signed out, not visited'], ['postmark', 'Option: Visited as a postmark on the band']],
    motion: [['f2', 'Open: the label rises, the seal lifts off the pin'], ['f3', 'The seal lands as the emblem'], ['f4', '× : the list comes back as you left it']] },
  { id: 'tag', name: 'Hanging Tag', line: 'A luggage tag hanging off the pin on a string. The address is on the tear-off stub. A long note: turn the tag over.',
    from: 'Luggage tags and labels; the trail scrapbook’s paper and string.',
    why: 'The pin is the knot the tag hangs from, the most physical link between pin and card. It stays on the map, and the list drops to its header so the tag has room and the orange row is out of the way.',
    weak: 'It still covers the map below the pin. The list lowers while a tag is open. Every open moves the map so the pin sits near the top.',
    states: [['typical', 'Typical note'], ['bare', 'Name only'], ['busiest-back', 'Turned over: the whole note, with the buttons'], ['signedout-unvisited', 'Signed out, not visited']],
    motion: [['f2', 'Drops and swings, 300ms; dashed: taps already work where the buttons settle'], ['f3', 'Swings back'], ['f4', 'Settled'], ['f5', 'Turn over']] },
];

const CUT = [
  ['stamp', 'Passport Stamp', 'The card is an entry stamp; Mark Visited inks it.', 'Cut: an empty dashed frame on every place you haven’t been, and a box around the name inside a box. Its stamp-down motion lives on in the Postcard’s postmark.'],
  ['file', 'Card File', 'The row is pulled out of the list as an index card, the note typed on ruled lines.', 'Cut: the quietest of the five, its look is mostly rules and a borrowed typewriter font. UX liked how it handles Plans. Its pull-out motion can be how any finalist opens from the list.'],
  [null, 'Pinned Note', 'The pin as a pushpin holding a note scrap to the map.', 'Cut before you saw it: once drawn it was the old popup tilted a degree. Not more fun.'],
];

const sections = F.map((f, i) => `<section id="${f.id}">
  <p class="num">${i + 1} / ${F.length}</p>
  <h2>${f.name}</h2>
  <p class="idea">${f.line}</p>
  <dl><dt>From</dt><dd>${f.from}</dd></dl>
  ${fig(f.id, 'busiest', 'Busiest: VEGA (starred, visited, plan stop 2, long note, long address)', true)}
  ${crop(f.id, 'busiest', 'Close-up')}
  <p class="why"><b>Why it’s here.</b> ${f.why}</p>
  <p class="meta"><b>Weak spot.</b> ${f.weak}</p>
  <h3>Other places</h3>
  <div class="grid">${f.states.map(([n, l]) => fig(f.id, n, l)).join('')}</div>
  <h3>In motion</h3><p class="hint">Pink lines and boxes are notes, not part of the design.</p>
  <div class="grid">${f.motion.map(([n, l]) => fig(f.id, n, l)).join('')}</div>
</section>`).join('\n');

const cut = CUT.map(([id, name, idea, why]) => `<li class="cut">${id ? `<img src="${b64(`${id}-busiest-phone.jpg`, 240, 62)}" alt="${name}, busiest">` : '<span class="noimg"></span>'}<div><b>${name}.</b> ${idea} <span class="dim">${why}</span></div></li>`).join('');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Popup Finalists</title>
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
  .box h3 { margin: 0; }
  .box ul { margin: 4px 0 0 20px; }
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
  .why, .meta { margin-top: 12px; font-size: 15px; line-height: 22px; }
  .meta { color: var(--ink-2); }
  .hint { margin-top: 2px; font-size: 14px; line-height: 20px; color: var(--ink-2); }
  figure { margin-top: 16px; }
  figure img { display: block; width: 100%; height: auto; border: 1px solid var(--hair); border-radius: 4px; background: var(--surface); }
  .hero img { max-width: 420px; }
  figcaption { margin-top: 6px; font-size: 13px; line-height: 18px; color: var(--ink-2); }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 12px; }
  .grid figure { margin-top: 12px; }
  ul.cuts { list-style: none; margin-top: 8px; }
  .cut { display: grid; grid-template-columns: 72px 1fr; gap: 12px; margin-top: 16px; font-size: 15px; line-height: 22px; }
  .cut img, .cut .noimg { display: block; width: 72px; height: auto; border: 1px solid var(--hair); border-radius: 4px; }
  .cut .noimg { height: 0; border: 0; }
  .dim { color: var(--ink-2); }
  footer { margin-top: 48px; font-size: 13px; line-height: 20px; color: var(--ink-2); }
</style>
</head>
<body>
<main>
  <h1>Popup Finalists</h1>
  <p class="lede">Three ways to open a place, each a real travel object. Each starts with the busiest real place (VEGA). Pinch to zoom.</p>
  <div class="box">
    <h3>The same in all three</h3>
    <ul>
      <li>Name and your note read first. A normal note shows whole.</li>
      <li>Type is the small line under the name.</li>
      <li>Directions, Star, Visited: one tap each, same size. Star only filled when starred.</li>
      <li>Signed out: Star and Visited greyed out. Directions still works, since it changes nothing.</li>
      <li>Map pins unchanged.</li>
    </ul>
  </div>
  <nav>${F.map(f => `<a href="#${f.id}">${f.name}</a>`).join('')}<a href="#cut">Cut</a></nav>
${sections}
  <section id="cut">
    <h2>Cut, and why</h2>
    <p class="hint">Say the word and any of these comes back.</p>
    <ul class="cuts">${cut}</ul>
  </section>
  <footer>The map is a stand-in drawing (real tiles can’t load where these were made). Rendered in Chrome, not checked on iPhone. Details: design/popup-hierarchy/round3/README.md.</footer>
</main>
</body>
</html>
`;
fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('index.html', (html.length / 1048576).toFixed(2) + ' MB');
