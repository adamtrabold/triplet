// Builds the three owner sheets (HTML) from the shots; shoot each with ../../sketches/shoot.js
const fs = require('fs'); const CON = '/home/user/la-trip-map/design/signin-button/concepts';
const img = (src, w, h) => `<img class="img" src="${src}" width="${w}" height="${h}">`;   // shots are 3x: CSS size = px/3
const head = (title, concept) => `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=390"><title>${title}</title>
<link rel="stylesheet" href="../flow/proto/sheet.css"><script>window.__CONCEPT='${concept}'</script><script src="../flow/proto/patch.js"></script></head><body>`;
const frames = (list, w, h, s = 1) => `<div class="frames">${list.map(([f, t]) => `<div style="width:${Math.round(w * s)}px"><img src="${f}" width="${Math.round(w * s)}" height="${Math.round(h * s)}"><div class="t">${t}</div></div>`).join('')}</div>`;
function sheet(c) {
  const A = c === 'A', dir = A ? 'A-arc-badge' : 'B-label';
  let h = head(A ? 'Sign-in A' : 'Sign-in B', c);
  h += A ? `<h1>A · Sign-in badge</h1><p>Your idea: a small signed-out person with SIGN IN curving under it. Same badge shape as +, but plain paper with navy print, so it stays quieter than +. One tap opens the sign-in sheet; no menu. Signed in, it’s inked into your usual navy badge.</p>`
         : `<h1>B · Sign-in label</h1><p>A small paper label, like the little banners on old hotel labels, reading SIGN IN. Plain paper with navy print, so it stays quieter than +. One tap opens the sign-in sheet; no menu.</p>`;
  h += `<h2>Real size</h2>` + img(`shots/top-cream-390.png`, 390, 96) + `<div class="cap">On the map.</div>`;
  h += img(`shots/top-dark-390.png`, 390, 96) + `<div class="cap">Over water and park, where the map is darkest.</div>`;
  h += img(`shots/top-signedin-390.png`, 390, 96) + `<div class="cap">Signed in: today’s account badge in the same spot (unchanged).</div>`;
  h += `<h2>Up close</h2><div class="big">`;
  if (A) h += `<div>${SBX.badgeA(104)}<div class="t">Sign in</div></div><div>${SBX.badgeA(104, '#DCD3C3')}<div class="t">Pressed</div></div><div>${SBX.signedIn(104)}<div class="t">Signed in</div></div>`;
  else h += `<div style="width:160px">${SBX.labelB(1.9)}<div class="t">Sign in</div></div><div style="width:160px">${SBX.labelB(1.9, '#DCD3C3')}<div class="t">Pressed</div></div></div><div class="big"><div>${SBX.signedIn(104)}<div class="t">Signed in</div></div>`;
  h += `</div><h2>Small phone (320 wide)</h2>` + img(`shots/top-cream-320.png`, 320, 96);
  const W = A ? 86 : 116, s = A ? .76 : .72;
  const IN = A ? [['in-0', 'Arrive'], ['in-60', '0.06s ink lands'], ['in-130', '0.13s'], ['in-250', '0.25s'], ['in-380', '0.38s signed in']]
               : [['in-0', 'Arrive'], ['in-130', '0.13s badge stamps down'], ['in-250', '0.25s label fades'], ['in-380', '0.38s signed in']];
  const OUT = A ? [['out-0', 'Signed in'], ['out-150', '0.15s edges dry first'], ['out-300', '0.3s'], ['out-450', '0.45s'], ['out-540', '0.54s signed out']]
                : [['out-0', 'Signed in'], ['out-200', '0.2s badge dries up'], ['out-400', '0.4s label prints back'], ['out-540', '0.54s signed out']];
  h += `<h2>Signing in</h2><p>After you sign in from the playground, the real trip opens with the sign-in ${A ? 'badge' : 'label'}, and it’s inked into your badge so you see it change.</p>` + frames(IN.map(([f, t]) => [`shots/${f}.png`, t]), W, 82, s);
  h += `<h2>Signing out</h2><p>Only if sign-in also lives in the real app (we recommend it). The ink dries away the way Visited does, and the sign-in ${A ? 'badge' : 'label'} is left.</p>` + frames(OUT.map(([f, t]) => [`shots/${f}.png`, t]), W, 82, s);
  h += `<div style="height:16px"></div></body></html>`;
  fs.writeFileSync(`${CON}/${dir}/sheet.html`, h);
}
// tiny server-side copies of the drawing so the enlargements are the same code as the build
global.window = {}; global.document = { createElement: () => ({}), head: { appendChild() {} } };
eval(fs.readFileSync(__dirname + '/patch.js', 'utf8'));
const SBX = {
  badgeA: (size, face) => window.SB.badgeA({ size, face }),
  signedIn: size => window.SB.signedIn(size),
  labelB: (sc, face) => window.SB.labelB({ scale: sc, face }),
};
sheet('A'); sheet('B');
// flow sheet
let h = head('Sign-in flow', 'A').replace(/\.\.\/flow\//g, '');
h += `<h1>Signing in, both concepts</h1><p>Only the words in the sign-in sheet change; its look stays as it is today.</p>`;
h += `<h2>1 · Tap Sign in in the playground</h2><p>The sheet opens over whatever you were looking at. Nothing behind it changes.</p>`;
h += `<div style="display:flex;gap:8px;padding:0 16px"><img src="shots/play-tag-open.png" width="175" height="251"><img src="shots/play-sheet-full.png" width="175" height="251"></div>`;
h += `<div class="cap">Left: a place open in the playground. Right: after tapping Sign in.</div>`;
const card = (f, cap) => { const { h: hh } = require('child_process').execSync(`python3 -c "from PIL import Image;i=Image.open('${CON}/flow/shots/${f}');print(i.size[1])"`).toString().trim() ? { h: +require('child_process').execSync(`python3 -c "from PIL import Image;i=Image.open('${CON}/flow/shots/${f}');print(i.size[1])"`).toString().trim() } : {}; const full = f === 'sheet-open.png'; const ww = full ? 390 : 358; const w3 = +require('child_process').execSync(`python3 -c "from PIL import Image;print(Image.open('${CON}/flow/shots/${f}').size[0])"`).toString().trim(); return `<img class="img" src="shots/${f}" width="${ww}" height="${Math.round(hh * ww / w3)}" style="${full ? '' : 'margin-left:16px'}">` + (cap ? `<div class="cap">${cap}</div>` : ''); };
h += `<h2>2 · The sheet</h2>` + card('sheet-open.png', 'Visitors read why they can’t sign in, tap Keep playing, and lose nothing. Tapping outside the sheet does the same.');
h += `<h2>3 · While it checks</h2>` + card('sheet-busy.png', 'The button says Signing in… and can’t be tapped twice.');
h += `<h2>4 · If something’s wrong</h2>` + card('sheet-wrong.png', '') + card('sheet-offline.png', 'Your email stays; nothing is lost, and you’re still in the playground.');
h += `<h2>5 · You arrive in the real trip</h2><p>The badge you tapped is there for a beat, then it’s inked into your account badge. This only plays right after signing in, not on every visit.</p>`;
h += frames([['../A-arc-badge/shots/in-0.png', 'Arrive'], ['../A-arc-badge/shots/in-130.png', 'Inked'], ['../A-arc-badge/shots/in-380.png', 'Signed in']], 86, 82, 1);
h += `<h2>Two questions for you</h2><div class="q"><b>1.</b> When you’re signed out of the real trip (new phone, cleared Safari), should this same sign-in button sit in the corner? Today nothing is there until you try to edit. <b>We recommend yes.</b> Then the sheet looks like this, without the playground line:</div>`;
h += card('sheet-real.png', '');
h += `<div class="q"><b>2.</b> Is the line in the sign-in sheet enough to tell visitors their changes aren’t kept, or do you want something on the map too?</div><div style="height:16px"></div></body></html>`;
fs.writeFileSync(`${CON}/flow/sheet.html`, h.replace('href="proto/sheet.css"', 'href="proto/sheet.css"'));
console.log('sheets written');
