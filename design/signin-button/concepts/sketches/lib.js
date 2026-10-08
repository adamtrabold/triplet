// Shared sketch helpers (pass 2). Coordinates in the app's 50-unit badge box.
const SCALLOP = "45.00,25.00 45.71,25.93 46.10,26.90 46.00,27.84 45.40,28.70 44.50,29.45 43.57,30.13 42.89,30.81 42.61,31.61 42.71,32.57 43.02,33.68 43.26,34.83 43.19,35.87 42.68,36.67 41.77,37.19 40.64,37.47 39.51,37.68 38.60,38.00 38.00,38.60 37.68,39.51 37.47,40.64 37.19,41.77 36.67,42.68 35.87,43.19 34.83,43.26 33.68,43.02 32.57,42.71 31.61,42.61 30.81,42.89 30.13,43.57 29.45,44.50 28.70,45.40 27.84,46.00 26.90,46.10 25.93,45.71 25.00,45.00 24.14,44.25 23.31,43.74 22.47,43.64 21.56,43.96 20.55,44.50 19.48,44.99 18.45,45.15 17.55,44.84 16.85,44.07 16.32,43.02 15.87,41.96 15.35,41.15 14.64,40.70 13.68,40.59 12.53,40.64 11.36,40.61 10.36,40.32 9.68,39.64 9.39,38.64 9.36,37.47 9.41,36.32 9.30,35.36 8.85,34.65 8.04,34.13 6.98,33.68 5.93,33.15 5.16,32.45 4.85,31.55 5.01,30.52 5.50,29.45 6.04,28.44 6.36,27.53 6.26,26.69 5.75,25.86 5.00,25.00 4.29,24.07 3.90,23.10 4.00,22.16 4.60,21.30 5.50,20.55 6.43,19.87 7.11,19.19 7.39,18.39 7.29,17.43 6.98,16.32 6.74,15.17 6.81,14.13 7.32,13.33 8.23,12.81 9.36,12.53 10.49,12.32 11.40,12.00 12.00,11.40 12.32,10.49 12.53,9.36 12.81,8.23 13.33,7.32 14.13,6.81 15.17,6.74 16.32,6.98 17.43,7.29 18.39,7.39 19.19,7.11 19.87,6.43 20.55,5.50 21.30,4.60 22.16,4.00 23.10,3.90 24.07,4.29 25.00,5.00 25.86,5.75 26.69,6.26 27.53,6.36 28.44,6.04 29.45,5.50 30.52,5.01 31.55,4.85 32.45,5.16 33.15,5.93 33.68,6.98 34.13,8.04 34.65,8.85 35.36,9.30 36.32,9.41 37.47,9.36 38.64,9.39 39.64,9.68 40.32,10.36 40.61,11.36 40.64,12.53 40.59,13.68 40.70,14.64 41.15,15.35 41.96,15.87 43.02,16.32 44.07,16.85 44.84,17.55 45.15,18.45 44.99,19.48 44.50,20.55 43.96,21.56 43.64,22.47 43.74,23.31 44.25,24.14";
const C = { paper:'#F2EBDD', raised:'#FAF5EA', pressed:'#DCD3C3', navy:'#12293F', ink2:'#5A564C', hair:'#D8CEBA',
  orange:'#EE7434', deep:'#A8400C', edge:'rgba(107,74,40,.22)' };
const BODY = 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2';
let uid = 0;
// person glyph = the app's account glyph, scaled. sw is the stroke in RENDERED px at 1x for a 50px badge
function person(cx, cy, s, ink, o = {}) {
  const t = `translate(${cx - 12 * s},${cy - 11.5 * s}) scale(${s})`;
  if (o.solid) return `<g transform="${t}" fill="${ink}"><circle cx="12" cy="7" r="4.6"/><path d="M3 21.5v-2.2a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v2.2z"/></g>`;
  const sw = (o.sw || 2) / s * (o.unitsPerPx || 1);
  return `<g transform="${t}" fill="none" stroke="${ink}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><path d="${BODY}"/><circle cx="12" cy="7" r="4"/></g>`;
}
function arcText(r, txt, ink, fs, ls) {
  const id = 'a' + (uid++);
  return `<defs><path id="${id}" d="M${25 - r},25 A${r},${r} 0 0 0 ${25 + r},25"/></defs><text font-family="Archivo" font-weight="700" font-stretch="75%" font-size="${fs}" letter-spacing="${ls}" fill="${ink}"><textPath href="#${id}" startOffset="50%" text-anchor="middle">${txt}</textPath></text>`;
}
// rim: 'heavy' 1.4 navy | 'thin' 0.8 navy | 'hair' 0.6 navy@50% | 'none' warm 1px edge only
function die(face, rim, extra = '') {
  let s = `<polygon points="${SCALLOP}" fill="rgba(0,0,0,.22)" transform="translate(0,1)"/>`;
  const st = { heavy: `stroke="${C.navy}" stroke-width="1.4"`, thin: `stroke="${C.navy}" stroke-width=".8"`,
    hair: `stroke="${C.navy}" stroke-opacity=".5" stroke-width=".7"`, none: `stroke="${C.edge}" stroke-width="1"`, off: '' }[rim || 'off'];
  s += `<polygon points="${SCALLOP}" fill="${face}" ${st} stroke-linejoin="round"/>` + extra;
  return s;
}
function badgeA(o = {}) {
  const size = o.size || 50, ink = o.ink || C.navy;
  let inner = die(o.face || C.raised, o.rim || 'none');
  inner += `<g opacity="${o.contentOp ?? 1}">` + person(25, 17.6, o.ps || 0.42, ink, { solid: o.solid, sw: o.sw || 1.15 }) + `</g>`;
  inner += `<g opacity="${o.textOp ?? 1}">` + arcText(15.6, 'SIGN IN', ink, 8, .5) + `</g>`;
  if (o.over) inner += o.over;
  return svg(size, inner, o.focus);
}
function signedIn(o = {}) {
  let inner = die(C.orange, 'off') + person(25, 25, .95, C.navy, { sw: 2 * .95 });
  return svg(o.size || 50, inner, o.focus);
}
function plus() { return svg(50, die(C.navy, 'off') + `<path d="M25 17v16M17 25h16" stroke="${C.orange}" stroke-width="2.6" stroke-linecap="round"/>`); }
function svg(size, inner, focus) {
  const f = focus ? `<polygon points="${SCALLOP}" fill="none" stroke="${C.navy}" stroke-width="2" transform="translate(25,25) scale(1.16) translate(-25,-25)"/>` : '';
  return `<svg width="${size}" height="${size}" viewBox="0 0 50 50" style="display:block;overflow:visible" aria-hidden="true">${f}${inner}</svg>`;
}
// ---- Concept B: printed label. h = height in px; shape: 'rect' | 'scallop' | 'flag'
function labelB(o = {}) {
  const h = o.h || 32, w = o.w || 92, face = o.face || C.raised, ink = o.ink || C.navy;
  let path;
  if (o.shape === 'scallop') path = scallopCapsule(w, h, 1.0, 7.6);
  else if (o.shape === 'flag') { const n = 7; path = `M${n},0 H${w - 3} Q${w},0 ${w},3 V${h - 3} Q${w},${h} ${w - 3},${h} H${n} L0,${h} L${n * .9},${h / 2} L0,0 Z`; path = `M0,0 H${w-3} Q${w},0 ${w},3 V${h-3} Q${w},${h} ${w-3},${h} H0 L${n},${h/2} Z`; }
  else path = `M3,0 H${w - 3} Q${w},0 ${w},3 V${h - 3} Q${w},${h} ${w - 3},${h} H3 Q0,${h} 0,${h - 3} V3 Q0,0 3,0 Z`;
  const edge = o.keyline ? `stroke="${C.navy}" stroke-width=".8"` : `stroke="${C.edge}" stroke-width="1"`;
  const lx = o.shape === 'flag' ? 14 : (o.shape === 'scallop' ? 13 : 11);
  const content = o.blank ? '' : `<g opacity="${o.contentOp ?? 1}">${personAt(lx, h / 2, ink)}
    <text x="${lx + 15}" y="${h / 2 + 4.3}" font-family="Archivo" font-weight="700" font-stretch="75%" font-size="12.5" letter-spacing="1" fill="${ink}">SIGN IN</text></g>`;
  const f = o.focus ? `<path d="${path}" fill="none" stroke="${C.navy}" stroke-width="2" transform="translate(-3,-3) scale(${(w + 6) / w},${(h + 6) / h})"/>` : '';
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="display:block;overflow:visible">${f}<path d="${path}" fill="rgba(0,0,0,.22)" transform="translate(0,1)"/><path d="${path}" fill="${face}" ${edge}/>${content}${o.over || ''}</svg>`;
}
function personAt(x, cy, ink) { // 12px person, 1.15px stroke, matched to 12.5px caps
  const s = .5; return `<g transform="translate(${x - 1 * s},${cy - 12 * s}) scale(${s})" fill="none" stroke="${ink}" stroke-width="${1.6 / s}" stroke-linecap="round" stroke-linejoin="round"><path d="${BODY}"/><circle cx="12" cy="7" r="4"/></g>`;
}
function scallopCapsule(w, h, amp, wave) {
  // stadium outline, offset by a sine of arc length (same lobe pitch as the badge die)
  const r = h / 2 - amp, L = w - h, pts = [], per = 2 * L + 2 * Math.PI * r, N = 400;
  const n = Math.round(per / wave);
  for (let i = 0; i < N; i++) {
    const s = per * i / N; let x, y, nx, ny;
    if (s < L) { x = h / 2 + s; y = amp; nx = 0; ny = -1; }
    else if (s < L + Math.PI * r) { const a = -Math.PI / 2 + (s - L) / r; x = w - h / 2 + r * Math.cos(a); y = h / 2 + r * Math.sin(a); nx = Math.cos(a); ny = Math.sin(a); }
    else if (s < 2 * L + Math.PI * r) { const t = s - L - Math.PI * r; x = w - h / 2 - t; y = h - amp; nx = 0; ny = 1; }
    else { const a = Math.PI / 2 + (s - 2 * L - Math.PI * r) / r; x = h / 2 + r * Math.cos(a); y = h / 2 + r * Math.sin(a); nx = Math.cos(a); ny = Math.sin(a); }
    const d = amp * Math.cos(2 * Math.PI * n * i / N);
    pts.push(`${(x + nx * d).toFixed(2)},${(y + ny * d).toFixed(2)}`);
  }
  return 'M' + pts.join(' L') + ' Z';
}
// a phone's top strip: map bg, zoom box at left, controls right-aligned like the app (+ at right 16, badge slot at right 74)
function strip(width, bg, left, opts = {}) {
  const tiles = bg === 'dark'
    ? 'background:#6F8791;background-image:linear-gradient(115deg,transparent 46%,#E9E2D2 46% 49%,transparent 49%),linear-gradient(20deg,#5E7A62 0 30%,transparent 30%)'
    : 'background:#EDE6D6;background-image:linear-gradient(115deg,transparent 46%,#F8F3E8 46% 49%,transparent 49%),radial-gradient(rgba(0,0,0,.04) 1px,transparent 1px);background-size:auto,6px 6px';
  return `<div style="position:relative;width:${width}px;height:${opts.h || 84}px;${tiles};overflow:hidden">
    <div style="position:absolute;left:10px;top:10px;width:30px;height:58px;background:#fff;border:2px solid rgba(0,0,0,.2);border-radius:4px;font:700 20px/27px Archivo;text-align:center;color:#000">+<br>−</div>
    <div style="position:absolute;right:16px;top:16px">${plus()}</div>
    <div style="position:absolute;right:74px;top:16px;height:50px;display:flex;align-items:center">${left}</div>
    ${opts.cap ? `<div style="position:absolute;left:50px;bottom:4px;font:600 10px Archivo;color:${bg === 'dark' ? '#fff' : C.ink2}">${opts.cap}</div>` : ''}
  </div>`;
}
