// Builds live.html ("Un-visit: Dry up vs Erase"): a self-contained page with two REAL tag stubs that
// play their un-visit when tapped (and re-stamp with the shipped stamp-in on the next tap).
//   node design/popup-hierarchy/unvisit/render-r2.js dry erase && node design/popup-hierarchy/unvisit/live-build.js
// Everything on the stub is the app's own:
//   - markup: captured from the real page in the gesture harness (Aurora, starred, visited): the stub
//     at rest, the Visited button at the un-visit moment (with its .tag-stamp-out copy) and at the
//     visit moment (with .tag-stamp-in), plus the three SVG symbols it uses;
//   - CSS: the app's own rules, extracted from index.html's <style> by selector (tokens, .tag*,
//     .row-stamp*, .popup-*, the stamp keyframes, their @container / reduced-motion blocks);
//   - each option's CSS (options.js), scoped to its own stub (#opt-<key>) with its keyframes renamed.
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process');
const { launch, openProto, W, FILE } = require('../../gesture-harness/lib');
const OPT = require('./options');
const D = __dirname, KEYS = [
  ['dry3', 'Dry up by thickness (new)', 'Every piece dries from its own edges toward its middle: the dotted edge goes almost at once, the letters next, the ring and the check last, and the thick parts stay dark longest. 560 ms.'],
  ['dry2', 'Dry up B, from two directions (last round)', 'For comparison: edges in and centre out across the whole stamp. 560 ms.']];

// ---- a small CSS splitter: top-level blocks with brace matching (comments stripped first) ----
function blocks(css) {
  const out = []; let i = 0;
  while (i < css.length) {
    const open = css.indexOf('{', i); if (open < 0) break;
    const head = css.slice(i, open).trim(); let depth = 1, j = open + 1;
    while (j < css.length && depth) { if (css[j] === '{') depth++; else if (css[j] === '}') depth--; j++; }
    out.push({ head, body: css.slice(open + 1, j - 1) }); i = j;
  }
  return out;
}
const KEEP = /(^|[\s,>+~])(:root|\.tag\b|\.tag-|\.row-stamp|\.popup-star|\.popup-visited|\.popup-directions|\.sgp|\.sg-|\.sr-only)/;
function extract(css, frames) {
  let out = '';
  for (const b of blocks(css)) {
    if (b.head.startsWith('@keyframes')) { const n = b.head.split(/\s+/)[1]; if (frames.has(n)) out += `${b.head}{${b.body}}\n`; continue; }
    if (b.head.startsWith('@media') || b.head.startsWith('@container') || b.head.startsWith('@supports')) { const inner = extract(b.body, frames); if (inner.trim()) out += `${b.head}{\n${inner}}\n`; continue; }
    if (b.head.startsWith('@')) continue;
    if (KEEP.test(b.head) && !/leaflet|location-card|#|\.marker|\.cluster/.test(b.head)) out += `${b.head}{${b.body}}\n`;
  }
  return out;
}
// scope an option's CSS to #opt-<key>, renaming its keyframes
function scope(css, key) {
  const names = [...css.matchAll(/@keyframes\s+([\w-]+)/g)].map(m => m[1]);
  for (const n of new Set(names)) css = css.replace(new RegExp(`\\b${n}\\b`, 'g'), `${n}_${key}`);
  const walk = c => blocks(c).map(b => {
    if (b.head.startsWith('@keyframes') || b.head.startsWith('@property')) return `${b.head}{${b.body}}`;
    if (b.head.startsWith('@')) return `${b.head}{${walk(b.body)}}`;
    return `${b.head.split(',').map(s => `#opt-${key} ${s.trim()}`).join(', ')}{${b.body}}`;
  }).join('\n');
  return walk(css);
}

(async () => {
  // 1. capture the real markup
  const b = await launch();
  const { ctx, page } = await openProto(b, { dsf: 1, reduced: true });
  await page.evaluate(async () => { const r = window.__ROWS.find(x => x.id === 'rey07'); Object.assign(r, { starred: true, visited: true }); await refetchLocations(); });
  await W(200);
  await page.evaluate(() => { const l = locations.find(x => x.id === 'rey07'); map.setView([l.lat, l.lng], 16, { animate: false }); markersById.get('rey07').marker.openPopup(); });
  await W(1000);
  const cap = await page.evaluate(async () => {
    const q = s => document.querySelector('.tag-popup ' + s);
    const tagClass = q('.tag').className, stub = q('.tag-stub').outerHTML;
    q('.popup-visited').click(); await new Promise(r => setTimeout(r, 30));
    const btnOut = q('.popup-visited').outerHTML;
    q('.popup-visited').click(); await new Promise(r => setTimeout(r, 30));
    const btnIn = q('.popup-visited').outerHTML;
    const sym = ['g-compass', 'g-star', 'g-star-open'].map(id => document.getElementById(id).outerHTML).join('');
    return { tagClass, stub, btnOut, btnIn, sym };
  });
  await ctx.close(); await b.close();
  if (!/tag-stamp-out/.test(cap.btnOut) || !/tag-stamp-in/.test(cap.btnIn)) throw new Error('capture failed');

  // 2. the app's CSS
  const src = fs.readFileSync(FILE, 'utf8');
  const appCss = [...src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n').replace(/\/\*[\s\S]*?\*\//g, '');
  const frames = new Set(['tagStampIn', 'tagStampOut', 'sgpLift', 'sgpOff', 'sgpOn', 'sgpPress']);
  const css = extract(appCss, frames);
  const font = (src.match(/<link rel="stylesheet" href="(https:\/\/fonts\.googleapis\.com[^"]+)">/) || [])[1];

  const jpg = (file, w, q) => `data:image/jpeg;base64,${execFileSync('convert', [path.join(D, file), '-resize', `${w}x>`, '-quality', String(q), 'jpg:-']).toString('base64')}`;
  const stubFor = key => `<div class="${cap.tagClass}" style="padding:0"><div class="demo-card">${cap.stub}</div></div>`;

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Un-visit: Dry up Blot</title>
${font ? `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="${font}">` : ''}
<style>
/* ---- the app's own stub CSS (extracted from index.html) ---- */
${css}
/* ---- the two options, each scoped to its stub ---- */
${KEYS.map(([k]) => scope(OPT[k].css, k)).join('\n')}
/* ---- this page (its own tokens, --pg-*, so the app's tokens stay the app's) ---- */
:root { --pg-bg: #F2EBDD; --pg-surface: #FAF5EA; --pg-ink: #1A1A18; --pg-ink-2: #5A564C; --pg-hair: #D8CEBA; color-scheme: light dark; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --pg-bg: #1B1A17; --pg-surface: #25231F; --pg-ink: #EDE6D8; --pg-ink-2: #B3AB9C; --pg-hair: #3A3630; } }
:root[data-theme="dark"] { --pg-bg: #1B1A17; --pg-surface: #25231F; --pg-ink: #EDE6D8; --pg-ink-2: #B3AB9C; --pg-hair: #3A3630; }
* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body { margin: 0; background: var(--pg-bg); color: var(--pg-ink); font: 16px/24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px 16px 64px; overflow-x: hidden; }
main { max-width: 760px; margin: 0 auto; }
h1 { font-size: 26px; line-height: 32px; font-weight: 700; letter-spacing: -0.01em; margin: 0; }
h2 { font-size: 20px; line-height: 26px; margin: 0; }
.lede, p.t { margin: 8px 0 0; font-size: 15px; line-height: 22px; }
.lede { color: var(--pg-ink-2); }
.pair { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(330px, 100%), 1fr)); gap: 28px; margin-top: 24px; }
.opt { min-width: 0; }
/* the stub on the tag's paper: always the app's light cream (the tag never changes colour) */
.stage { margin-top: 12px; display: flex; justify-content: center; }
.stage .tag { width: min(316px, 100%); font-family: var(--font-ui); font-size: 14px; line-height: 20px; color: var(--ink); }
.demo-card { background: var(--paper-raised); padding-top: 14px; border-radius: 0 0 2px 2px;
  filter: drop-shadow(0 0 .5px rgba(107, 74, 40, .5)) drop-shadow(0 1px 1px rgba(26, 26, 24, .10)) drop-shadow(0 4px 6px rgba(26, 26, 24, .08)); }
.stage .tag-slot.dir, .stage .tag-slot.star { pointer-events: none; }
.hint { margin-top: 8px; font-size: 13px; line-height: 18px; color: var(--pg-ink-2); text-align: center; }
.ctl { display: flex; justify-content: center; gap: 8px; margin-top: 6px; }
button.replay, button.reseed { all: unset; display: block; font-size: 14px; line-height: 20px; color: var(--pg-ink); text-decoration: underline; text-underline-offset: 3px; cursor: pointer; padding: 10px 12px; }
button.replay:focus-visible, button.reseed:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
h3 { font-size: 17px; line-height: 24px; margin: 40px 0 0; padding-top: 20px; border-top: 1px solid var(--pg-hair); }
figure { margin: 12px 0 0; min-width: 0; }
figure img { display: block; width: 100%; height: auto; border: 1px solid var(--pg-hair); border-radius: 4px; background: var(--pg-surface); }
figcaption { margin-top: 6px; font-size: 13px; line-height: 18px; color: var(--pg-ink-2); }
.strips { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr)); gap: 0 12px; }
footer { margin-top: 48px; font-size: 13px; line-height: 20px; color: var(--pg-ink-2); }
</style>
</head>
<body>
<svg width="0" height="0" style="position:absolute" aria-hidden="true">${cap.sym}</svg>
<main>
  <h1>Un-visit: Dry up Blot</h1>
  <p class="lede">Tap the VISITED stamp to un-visit and watch it leave. Tap again to stamp it back. These are the tag's real stubs. The new thickness version first, then last round's two-direction B.</p>
  <div class="pair">
${KEYS.map(([k, t, d]) => `    <section class="opt" id="opt-${k}" aria-label="${t}">
      <h2>${t}</h2>
      <p class="t">${d}</p>
      <div class="stage">${stubFor(k)}</div>
      <p class="hint">Tap Visited</p>
      <div class="ctl"><button type="button" class="replay" data-k="${k}">Play again</button></div>
    </section>`).join('\n')}
  </div>

  <h3>Frame by frame</h3>
  <p class="t">The same two, slowed down: before the tap at the top, the resting “Mark visited” at the bottom.</p>
  <div class="strips">${KEYS.map(([k, t]) => `<figure><img src="${jpg(`stills/r2/${k}-strip.png`, 640, 76)}" alt="${t}, frame by frame"><figcaption>${t}</figcaption></figure>`).join('')}</div>

  <footer>Built from the app's own stub markup and styles; only the un-visit animation differs. With reduced motion turned on, both become a quick crossfade.</footer>
</main>
<script>
${OPT.DRY3_FN}
(function () {
  var IDS = []; for (var q = 0; q < 21; q++) IDS.push('rey' + (q < 10 ? '0' : '') + q);
  var place = 7;
  var OUT = ${JSON.stringify(cap.btnOut)}, IN = ${JSON.stringify(cap.btnIn)};
  function swap(sec, html) {
    var btn = sec.querySelector('.popup-visited'); var t = document.createElement('div'); t.innerHTML = html;
    var nb = t.firstElementChild; btn.replaceWith(nb); return nb;
  }
  function toggle(sec) {
    var btn = sec.querySelector('.popup-visited');
    var visited = btn.getAttribute('aria-pressed') === 'true';
    var nb = swap(sec, visited ? OUT : IN);
    if (visited && sec.id === 'opt-dry3') uvDry3(nb.querySelector('.tag-stamp-out'));
    sec.querySelector('.hint').textContent = visited ? 'Tap Mark visited to stamp it back' : 'Tap Visited';
  }
  document.querySelectorAll('.opt').forEach(function (sec) {
    sec.querySelector('.tag-slot.vis').addEventListener('click', function (e) { e.preventDefault(); toggle(sec); });
    function play() {
      var btn = sec.querySelector('.popup-visited');
      if (btn.getAttribute('aria-pressed') !== 'true') { swap(sec, IN); setTimeout(function () { toggle(sec); }, 520); }
      else toggle(sec);
    }
    sec.querySelector('.replay').addEventListener('click', play);
    var rs = null;
    if (rs) rs.addEventListener('click', function () { place = (place + 1) % IDS.length; var lab = sec.querySelector('.seedlab'); lab.textContent = 'Place ' + (place + 1) + ' of ' + IDS.length + (sec.id === 'opt-blot' ? '' : ' (B looks the same at every place)'); play(); });
  });
})();
</script>
</body>
</html>
`;
  fs.writeFileSync(path.join(D, 'live.html'), html);
  console.log('live.html', (html.length / 1024).toFixed(0), 'KB; app css', (css.length / 1024).toFixed(0), 'KB');
})();
