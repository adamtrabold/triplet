// Concept patch injected into a COPY of index.html (never the real file).
// window.__CONCEPT = 'A' | 'B' is set just before this runs.
(function () {
const SCALLOP = "45.00,25.00 45.71,25.93 46.10,26.90 46.00,27.84 45.40,28.70 44.50,29.45 43.57,30.13 42.89,30.81 42.61,31.61 42.71,32.57 43.02,33.68 43.26,34.83 43.19,35.87 42.68,36.67 41.77,37.19 40.64,37.47 39.51,37.68 38.60,38.00 38.00,38.60 37.68,39.51 37.47,40.64 37.19,41.77 36.67,42.68 35.87,43.19 34.83,43.26 33.68,43.02 32.57,42.71 31.61,42.61 30.81,42.89 30.13,43.57 29.45,44.50 28.70,45.40 27.84,46.00 26.90,46.10 25.93,45.71 25.00,45.00 24.14,44.25 23.31,43.74 22.47,43.64 21.56,43.96 20.55,44.50 19.48,44.99 18.45,45.15 17.55,44.84 16.85,44.07 16.32,43.02 15.87,41.96 15.35,41.15 14.64,40.70 13.68,40.59 12.53,40.64 11.36,40.61 10.36,40.32 9.68,39.64 9.39,38.64 9.36,37.47 9.41,36.32 9.30,35.36 8.85,34.65 8.04,34.13 6.98,33.68 5.93,33.15 5.16,32.45 4.85,31.55 5.01,30.52 5.50,29.45 6.04,28.44 6.36,27.53 6.26,26.69 5.75,25.86 5.00,25.00 4.29,24.07 3.90,23.10 4.00,22.16 4.60,21.30 5.50,20.55 6.43,19.87 7.11,19.19 7.39,18.39 7.29,17.43 6.98,16.32 6.74,15.17 6.81,14.13 7.32,13.33 8.23,12.81 9.36,12.53 10.49,12.32 11.40,12.00 12.00,11.40 12.32,10.49 12.53,9.36 12.81,8.23 13.33,7.32 14.13,6.81 15.17,6.74 16.32,6.98 17.43,7.29 18.39,7.39 19.19,7.11 19.87,6.43 20.55,5.50 21.30,4.60 22.16,4.00 23.10,3.90 24.07,4.29 25.00,5.00 25.86,5.75 26.69,6.26 27.53,6.36 28.44,6.04 29.45,5.50 30.52,5.01 31.55,4.85 32.45,5.16 33.15,5.93 33.68,6.98 34.13,8.04 34.65,8.85 35.36,9.30 36.32,9.41 37.47,9.36 38.64,9.39 39.64,9.68 40.32,10.36 40.61,11.36 40.64,12.53 40.59,13.68 40.70,14.64 41.15,15.35 41.96,15.87 43.02,16.32 44.07,16.85 44.84,17.55 45.15,18.45 44.99,19.48 44.50,20.55 43.96,21.56 43.64,22.47 43.74,23.31 44.25,24.14";
const C = { raised:'#FAF5EA', pressed:'#DCD3C3', navy:'#12293F', orange:'#EE7434', edge:'rgba(107,74,40,.22)' };
const BODY = 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2';
let uid = 0;
const FACE = 'var(--sb-face, #FAF5EA)';
function person(cx, cy, s, ink, swPx) {
  const t = `translate(${cx - 12 * s},${cy - 11.5 * s}) scale(${s})`;
  return `<g transform="${t}" fill="none" stroke="${ink}" stroke-width="${swPx / s}" stroke-linecap="round" stroke-linejoin="round"><path d="${BODY}"/><circle cx="12" cy="7" r="4"/></g>`;
}
function arc(r, txt, fs, ls, op = 1) {
  const id = 'sbA' + (uid++);
  return `<g opacity="${op}"><defs><path id="${id}" d="M${25 - r},25 A${r},${r} 0 0 0 ${25 + r},25"/></defs><text font-family="Archivo" font-weight="700" font-stretch="75%" font-size="${fs}" letter-spacing="${ls}" fill="${C.navy}"><textPath href="#${id}" startOffset="50%" text-anchor="middle">${txt}</textPath></text></g>`;
}
const shadowEdge = (face) => `<polygon points="${SCALLOP}" fill="rgba(0,0,0,.22)" transform="translate(0,1)"/><polygon points="${SCALLOP}" style="fill:${face}" stroke="${C.edge}" stroke-width="1" stroke-linejoin="round"/>`;
const clip = () => { const id = 'sbK' + (uid++); return [id, `<defs><clipPath id="${id}"><polygon points="${SCALLOP}"/></clipPath></defs>`]; };
// The signed-in badge at rest is NAVY with an ORANGE person (orange only while its menu is open).
// So the strike lands navy ink; the print under it is covered (navy on navy), and the person reverses to orange where the ink is.
function blotPts(r) { const p = []; for (let i = 0; i < 48; i++) { const a = i / 48 * 2 * Math.PI, rr = r * (1 + .06 * Math.sin(i * 7.3) + .04 * Math.sin(i * 3.1)); p.push(`${(25 + rr * Math.cos(a)).toFixed(2)},${(25 + rr * Math.sin(a)).toFixed(2)}`); } return p.join(' '); }
function dryPts(k) { const R = 21.5 * Math.pow(1 - k, .8), p = []; for (let i = 0; i < 64; i++) { const a = i / 64 * 2 * Math.PI, lobe = .5 + .5 * Math.cos(a * 16), rr = Math.max(0, R * (1 - .16 * lobe * Math.min(1, k * 2)) + .5 * Math.sin(i * 5.7) * k); p.push(`${(25 + rr * Math.cos(a)).toFixed(2)},${(25 + rr * Math.sin(a)).toFixed(2)}`); } return p.join(' '); }
// ink layer: navy shape clipped to the die, with the person reversed to orange inside it
function inkLayer(pts, personSvgOrange, op = 1) {
  const [cid, cd] = clip(), iid = 'sbI' + (uid++);
  return cd + `<defs><clipPath id="${iid}"><polygon points="${pts}"/></clipPath></defs>
    <g clip-path="url(#${cid})" opacity="${op}"><polygon points="${pts}" fill="${C.navy}"/><g clip-path="url(#${iid})">${personSvgOrange}</g></g>`;
}
const wrap = (inner, size = 50) => `<svg width="${size}" height="${size}" viewBox="0 0 50 50" style="display:block;overflow:visible" aria-hidden="true">${inner}</svg>`;
// A at rest, or a storyboard frame: o = { ink (radius), dry (0..1), ps, face, paper:false }
function badgeA(o = {}) {
  const ps = o.ps ?? .42, t = (ps - .42) / .53, py = 17.6 + 7.4 * t, sw = 1.4 + .5 * t;
  let s = o.paper === false ? '' : shadowEdge(o.face || FACE);
  if (o.paper !== false) s += arc(15.6, 'SIGN IN', 8, .5) + person(25, py, ps, C.navy, sw);
  const pts = o.ink ? blotPts(o.ink) : o.dry !== undefined ? dryPts(o.dry) : null;
  if (pts) s += inkLayer(pts, person(25, py, ps, C.orange, sw), o.dry !== undefined ? 1 - o.dry * .25 : 1);
  return wrap(s, o.size);
}
function signedIn(size) { return wrap(`<polygon points="${SCALLOP}" fill="${C.navy}"/>` + person(25, 25, 1, C.orange, 2), size); }
function signedInOpen(size) { return wrap(`<polygon points="${SCALLOP}" fill="${C.orange}"/>` + person(25, 25, 1, C.navy, 2), size); }
// B: hotel-label banner, notched tail on the left. 28 tall.
const LB = { h: 28, w: 84, notch: 7, fs: 11, ls: .9 };
function labelPath(w = LB.w, h = LB.h, n = LB.notch) { return `M0,0 H${w - 2.5} Q${w},0 ${w},2.5 V${h - 2.5} Q${w},${h} ${w - 2.5},${h} H0 L${n},${h / 2} Z`; }
function labelB(o = {}) {
  const { h, w, fs, ls } = LB, p = labelPath(), sc = o.scale || 1;
  const px = 15, s = .42;
  const ink = `<g opacity="${o.inkOp ?? 1}"><g transform="translate(${px - s},${h / 2 - 11.6 * s}) scale(${s})" fill="none" stroke="${C.navy}" stroke-width="${1.4 / s}" stroke-linecap="round" stroke-linejoin="round"><path d="${BODY}"/><circle cx="12" cy="7" r="4"/></g>
    <text x="${px + 13}" y="${h / 2 + fs * .36}" font-family="Archivo" font-weight="700" font-stretch="75%" font-size="${fs}" letter-spacing="${ls}" fill="${C.navy}">SIGN IN</text></g>`;
  const paper = (o.paperOp ?? 1) > 0 ? `<g opacity="${o.paperOp ?? 1}"><path d="${p}" fill="rgba(0,0,0,.22)" transform="translate(0,1)"/><path d="${p}" style="fill:${o.face || FACE}" stroke="${C.edge}" stroke-width="1"/></g>` : '';
  return `<svg width="${w * sc}" height="${h * sc}" viewBox="0 0 ${w} ${h}" style="display:block;overflow:visible" aria-hidden="true">${paper}${ink}</svg>`;
}
// B storyboard frame: label (paperOp/inkOp) + round badge (dieScale, dry) at the label's right end
function frameB(o = {}) {
  const lab = `<div style="position:absolute;right:0;top:11px">${labelB({ paperOp: o.paperOp, inkOp: o.inkOp })}</div>`;
  let die = '';
  if (o.die) { const inner = o.dry !== undefined ? wrap(inkLayer(dryPts(o.dry), person(25, 25, 1, C.orange, 2), 1 - o.dry * .25)) : signedIn();
    die = `<div style="position:absolute;right:-4px;top:0;transform:scale(${o.die})">${inner}</div>`; }
  return `<div style="position:relative;width:${LB.w}px;height:50px">${lab}${die}</div>`;
}
window.SB = { badgeA, signedIn, signedInOpen, labelB, frameB, LB, SCALLOP };

// ---- the control in the app ----
const css = document.createElement('style');
css.textContent = `
  #accountBtn.signin { background: transparent !important; -webkit-mask-image: none; mask-image: none; box-shadow: none; color: inherit; }
  #accountBtn.signin:active { --sb-face: #DCD3C3; background: transparent !important; }
  #accountBtn.signin.sb-B { right: 78px; width: ${LB.w}px; height: 44px; margin-top: 3px; align-items: center; justify-content: flex-end; }
  #accountBtn.signin:focus-visible { outline: 2px solid var(--navy); outline-offset: 2px; }
  #authModalBody .sb-busy { opacity: .6; }
`;
document.head.appendChild(css);
window.SB.renderControl = function (concept = window.__CONCEPT, html) {
  const b = document.getElementById('accountBtn');
  b.className = 'show signin sb-' + concept;
  b.setAttribute('aria-label', 'Sign in');
  b.innerHTML = html || (concept === 'A' ? badgeA() : labelB());
};
window.SB.renderSignedIn = function () {
  const b = document.getElementById('accountBtn');
  b.className = 'show'; b.setAttribute('aria-label', 'Account');
  b.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
};
// ---- the sign-in sheet's words (structure from jobs.md) ----
window.SB.sheet = function (mode = 'play', state = 'open') {
  const m = document.getElementById('authModal');
  m.querySelector('h2').textContent = 'Sign in';
  const line = m.querySelector('#authModalBody > p:first-child');
  line.textContent = mode === 'play' ? "Only the trip’s owners can sign in. Your changes here won’t be kept." : mode === 'edit' ? 'You need to sign in to make changes. Anyone can view places and plans.' : '';
  line.style.display = line.textContent ? '' : 'none';
  const login = document.getElementById('loginBtn'), cancel = document.getElementById('cancelAuthBtn'), err = document.getElementById('authError');
  const email = document.getElementById('authEmailInput'), pw = document.getElementById('authPasswordInput');
  cancel.textContent = mode === 'play' ? 'Keep playing' : 'Cancel';
  login.textContent = 'Sign in'; login.disabled = false; login.classList.remove('sb-busy'); email.value = ''; pw.value = '';
  pw.after(err); err.style.margin = '-12px 0 16px'; line.style.textWrap = 'balance'; email.readOnly = pw.readOnly = false; err.style.display = 'none';
  m.classList.add('show');
  if (state === 'busy') { email.value = 'you@example.com'; pw.value = 'xxxxxxxxxx'; login.textContent = 'Signing in…'; login.disabled = true; login.classList.add('sb-busy'); email.readOnly = pw.readOnly = true; }
  if (state === 'wrong') { email.value = 'you@example.com'; pw.value = ''; err.textContent = 'That email and password don’t match.'; err.style.display = 'block'; }
  if (state === 'offline') { email.value = 'you@example.com'; pw.value = 'xxxxxxxxxx'; err.textContent = 'Can’t reach the sign-in server. Check your connection.'; err.style.display = 'block'; }
};
})();
