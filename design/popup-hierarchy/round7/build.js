// Builds index.html ("Star Colour & Tag Paper") for the owner from round7/star-colour and round7/tag-colour renders.
//   node design/popup-hierarchy/round7/build.js
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const D = __dirname;
const b64 = (file, w, q) => `data:image/jpeg;base64,${execFileSync('convert', [path.join(D, file), '-resize', `${w}x>`, '-quality', String(q), 'jpg:-']).toString('base64')}`;
const S = n => `star-colour/stills/${n}-phone@1x.png`, T = n => `tag-colour/stills/${n}-phone@1x.png`, TC = n => `tag-colour/stills/${n}-crop@3x.png`;
const fig = (file, cap, w = 560, q = 66) => `<figure><img src="${b64(file, w, q)}" alt="${cap}" loading="lazy"><figcaption>${cap}</figcaption></figure>`;
const grid = items => `<div class="grid">${items.map(([f, c, w]) => fig(f, c, w)).join('')}</div>`;

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
  .sw { display: inline-block; width: 14px; height: 14px; border-radius: 3px; vertical-align: -2px; margin-right: 4px; }
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
  <p class="lede">Stars get one colour everywhere, the pink ink of your reference tags. The tag can carry it too. Pinch to zoom.</p>

  <h2>1. Recommended: pink star everywhere</h2>
  <p class="t"><span class="sw" style="background:#C0306E"></span><b>Pink ink #C0306E</b> means “starred” and nothing else. It’s kept away from every category colour and every city’s orange. On the map it always sits on a paper halo, so it reads even without colour. On a selected (orange) row the star turns paper, as it does today.</p>
  ${grid([[S('pink-list-reykjavik'), 'List (Reykjavík)', 600], [S('pink-map-far'), 'Map, zoomed out: starred clusters', 600], [S('pink-map-near'), 'Map: starred pins beside orange ones', 600], [T('band-busiest'), 'The tag (band version)', 600]])}

  <h2>2. Tag paper: band or whole tag?</h2>
  <p class="t"><b>Band:</b> a starred tag gets a pink printed header, like the airline tags. <b>Whole:</b> a starred tag is printed on rose stock. Either way, visited turns the paper to the visited row’s tone and stamps the stub.</p>
  ${grid([[T('band-starred'), 'Band: starred'], [T('whole-starred'), 'Whole: starred'], [T('band-both'), 'Band: starred + visited'], [T('whole-both'), 'Whole: starred + visited'], [T('band-visited'), 'Band: visited'], [T('whole-visited'), 'Whole: visited'], [T('band-signedout'), 'Band: signed out (greyed, no pink on controls)'], [T('whole-signedout'), 'Whole: signed out']])}
  <h2>Districts and streets</h2>
  <p class="t">No pin. While the tag is open, a small dot in the middle of the area is what it hangs from.</p>
  ${grid([[T('band-shape'), 'District open'], [T('band-street'), 'Street open']])}

  <h2>3. Which pink?</h2>
  ${grid([[S('pink-list-malmo'), 'Pink ink #C0306E (recommended)', 600], [S('plum-list-malmo'), 'Plum #A3266F: reads purple next to shopping', 600]])}

  <h2>4. Today, for comparison</h2>
  ${grid([[S('ink-list-reykjavik'), 'Black stars (today)', 600], [S('ink-map-near'), 'Black stars on the map', 600]])}

  <h2>Decisions for you</h2>
  <ol class="dec">
    <li>Star colour: pink ink #C0306E or plum #A3266F?</li>
    <li>Tag paper: band or whole tag?</li>
  </ol>
  <footer>The map is a stand-in drawing; real tiles may sit darker or lighter under the tag. Rendered in Chrome, not checked on iPhone. Details: design/popup-hierarchy/round7/.</footer>
</main>
</body>
</html>
`;
fs.writeFileSync(path.join(D, 'index.html'), html);
console.log('index.html', (html.length / 1048576).toFixed(2) + ' MB');
