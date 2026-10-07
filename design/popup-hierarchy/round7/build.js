// Builds index.html ("Star Colour & Tag Paper") for the owner: leads with the gold star + recoloured categories.
//   node design/popup-hierarchy/round7/star-colour/render-gold.js && node design/popup-hierarchy/round7/tag-colour/render.js && node design/popup-hierarchy/round7/build.js
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const D = __dirname;
const b64 = (file, w, q) => `data:image/jpeg;base64,${execFileSync('convert', [path.join(D, file), '-resize', `${w}x>`, '-quality', String(q), 'jpg:-']).toString('base64')}`;
const S = n => `star-colour/stills/${n}-phone@1x.png`, T = n => `tag-colour/stills/${n}-phone@1x.png`, TC = n => `tag-colour/stills/${n}-crop@3x.png`;
const fig = (file, cap, w = 560, q = 66) => `<figure><img src="${b64(file, w, q)}" alt="${cap}" loading="lazy"><figcaption>${cap}</figcaption></figure>`;
const grid = items => `<div class="grid">${items.map(([f, c, w]) => fig(f, c, w)).join('')}</div>`;
const CATS = [['restaurant', '#AC5019', '#7A2436'], ['attraction', '#A68018', '#547326'], ['cafe', '#6E4C22', '#6E4C22'], ['bar', '#3D5A7A', '#3D5A7A'], ['nature', '#1E3A2B', '#1E3A2B'], ['shopping', '#8A7AA8', '#8A7AA8'],
  ['area', '#2B3F52', '#2B3F52'], ['hotel', '#2E2433', '#2E2433'], ['other', '#4F5450', '#4F5450'], ['district', '#328177', '#328177'], ['street', '#5E2C17', '#5E2C17']];
const sw = c => `<span class="sw" style="background:${c}"></span>`;
const table = `<table class="cats"><tr><th></th><th>Before</th><th>After</th></tr>${CATS.map(([n, a, b]) => `<tr${a !== b ? ' class="ch"' : ''}><td>${n}</td><td>${sw(a)}${a}</td><td>${sw(b)}${b}</td></tr>`).join('')}<tr class="ch"><td><b>star</b></td><td>${sw('#1A1A18')}black</td><td>${sw('#F2B807')}#F2B807 gold</td></tr></table>`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Star Colour &amp; Tag Paper</title>
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
  .sw { display: inline-block; width: 14px; height: 14px; border-radius: 3px; vertical-align: -2px; margin-right: 6px; border: 1px solid rgba(0,0,0,.15); }
  table.cats { margin-top: 12px; border-collapse: collapse; width: 100%; font-size: 14px; line-height: 20px; }
  table.cats th { text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: .06em; color: var(--ink-2); padding: 4px 6px; }
  table.cats td { padding: 4px 6px; border-top: 1px solid var(--hair); white-space: nowrap; }
  table.cats tr.ch td { font-weight: 600; }
  figure { margin-top: 12px; }
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
  <h1>Star Colour &amp; Tag Paper</h1>
  <p class="lede">The gold star, with the two clashing categories recoloured. Pinch to zoom.</p>

  <h2>1. Gold star everywhere</h2>
  <p class="t">${sw('#F2B807')}<b>Gold #F2B807</b>, the yellow ink of your tags, with a thin dark-amber outline (from the app’s own palette) so it reads on any paper. It means “starred” and nothing else. It sits well clear of the orange clusters and selected rows in every city. On a selected (orange) row the star turns paper, as today.</p>
  ${grid([[S('gold-list-reykjavik'), 'List, Reykjavík', 600], [S('gold-list-stockholm'), 'List, Stockholm', 600], [S('gold-map-near'), 'Map, zoom 14', 600], [S('gold-map-far'), 'Map, zoom 11: starred clusters', 600]])}

  <h2>2. Categories that clash, recoloured</h2>
  <p class="t">Restaurant (orange) and attraction (gold) collided with a gold star. Restaurant becomes wine red, attraction becomes moss green. Everything else stays. No two categories end up closer than before. Note: attraction’s moss joins nature’s spruce, so there are two greens (light and dark).</p>
  ${table}
  ${grid([[S('gold-oldcats-map-near'), 'Before: today’s colours', 600], [S('gold-map-near'), 'After', 600]])}
  <p class="t">One close pair left: in Malmö the two round buttons (top right) use an ochre near the gold. They’re buttons, not marks. Leave it, or warm Malmö slightly?</p>
  ${grid([[S('gold-malmo-map'), 'Malmö: gold stars next to the ochre buttons', 600]])}

  <h2>3. The tag in gold</h2>
  <p class="t">Two equal options. <b>Band:</b> a thin gold stripe along the tag’s top edge, so the name still leads. <b>Segment:</b> the Starred box of the stub is printed gold, with a navy star. (A cream star on gold was too faint to read.)</p>
  ${grid([[T('g-band-busiest'), 'Band'], [T('g-none-segn-busiest'), 'Segment, navy star'], [T('g-band-starred'), 'Band: starred'], [T('g-none-segn-starred'), 'Segment: starred'], [T('g-band-signedout'), 'Band: signed out'], [T('g-none-segn-signedout'), 'Segment: signed out (gold fades)']])}

  <h2>Earlier option</h2>
  <p class="t">Pink star (#C0306E) and a claret restaurant (#972068), both set aside: they read as pink. The city orange can’t be the star: it already means map clusters and the selected row.</p>

  <h2>Decisions for you</h2>
  <ol class="dec">
    <li>Gold star #F2B807 with restaurant → wine and attraction → moss: yes?</li>
    <li>Tag: thin gold band, or gold segment with a navy star?</li>
    <li>Malmö’s ochre buttons next to the gold: leave, or warm them slightly?</li>
  </ol>
  <footer>The map is a stand-in drawing. Rendered in Chrome, not checked on iPhone. Details: design/popup-hierarchy/round7/star-colour/README.md and tag-colour/README.md.</footer>
</main>
</body>
</html>
`;
fs.writeFileSync(path.join(D, 'index.html'), html);
console.log('index.html', (html.length / 1048576).toFixed(2) + ' MB');
