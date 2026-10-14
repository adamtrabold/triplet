// Round 2 badge: person CENTRED (and larger), SIGN IN smaller + tracked out on a U under it.
// Loaded AFTER ../../flow/proto/patch.js; overrides SB.badgeA with a variant-aware drawing.
// window.__V picks the variant ('1' | '2' | '3'); badgeA({v}) overrides per call.
(function () {
const SB = window.SB, SCALLOP = SB.SCALLOP;
const C = { navy:'#12293F', orange:'#EE7434', edge:'rgba(107,74,40,.22)' };
const BODY = 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2';
const FACE = 'var(--sb-face, #FAF5EA)';
// the variants the director chooses between
const V = {
  1: { ps: .58, sw: 1.35, fs: 6.5, ls: 1.3, r: 17.6, fw: 700, st: '100%', cy: 25 },
  // 2 after the director's round-2 fixes: baseline in (valleys r 18.8 -> >=2px clear), tracking ~0.22em,
  // word space narrowed to a hair space (word gap ~2x letter gap), weight 700 so the I holds at 1x.
  2: { ps: .68, sw: 1.45, fs: 6,   ls: 1.3, r: 16.6, fw: 700, st: '100%', cy: 25, ws: '\u200A' },
  // 2c: the owner's 'weighted low ... everything up some / visually centered ... more space' -- lifted group.
  // cy = person centre, ay = arc centre (arc no longer concentric with the die; clearance only grows).
  4: { ps: .68, sw: 1.45, fs: 6, ls: 1.3, r: 16.6, fw: 700, st: '100%', cy: 20.6, ay: 22.4, ws: '\u200A' },
  5: { ps: .68, sw: 1.45, fs: 6, ls: 1.3, r: 16.6, fw: 700, st: '100%', cy: 19.6, ay: 21.8, ws: '\u200A' },
  6: { ps: .68, sw: 1.45, fs: 6, ls: 1.3, r: 16.6, fw: 700, st: '100%', cy: 18.8, ay: 21.2, ws: '\u200A' },
  7: { ps: .68, sw: 1.45, fs: 6, ls: 1.3, r: 16.6, fw: 700, st: '100%', cy: 18.4, ay: 21.6, ws: '\u200A' },
  // 2d: owner on 2c 'Person is too high ... take it to the blue and orange style again since the plus is changing'
  // nv = navy die, orange person + orange arc (today's account badge colours). Lift between 2b and 2c.
  8:  { ps: .68, sw: 1.45, fs: 6, ls: 1.3, r: 16.6, fw: 700, st: '100%', cy: 22.4, ay: 23.6, ws: '\u200A', nv: 1 },
  9:  { ps: .68, sw: 1.45, fs: 6, ls: 1.3, r: 16.6, fw: 700, st: '100%', cy: 21.6, ay: 23.2, ws: '\u200A', nv: 1 },
  10: { ps: .68, sw: 1.45, fs: 6, ls: 1.3, r: 16.6, fw: 700, st: '100%', cy: 20.8, ay: 22.8, ws: '\u200A', nv: 1 },
  11: { ps: .68, sw: 1.45, fs: 6, ls: 1.3, r: 16.6, fw: 700, st: '100%', cy: 25, ay: 25, ws: '\u200A', nv: 1 },   // 2b position, navy (comparison only)
  12: { ps: .68, sw: 1.45, fs: 6, ls: 1.3, r: 16.6, fw: 700, st: '100%', cy: 18.4, ay: 21.6, ws: '\u200A', nv: 1 }, // 2c position, navy (comparison only)
  3: { ps: .76, sw: 1.5, fs: 5.5, ls: 2.3, r: 18.3, fw: 650, st: '100%', cy: 25 },
};
SB.V = V;
let uid = 0;
// glyph centre is (12,12) in the 24-unit lucide box
function person(cx, cy, s, ink, swPx) {
  return `<g transform="translate(${cx - 12 * s},${cy - 12 * s}) scale(${s})" fill="none" stroke="${ink}" stroke-width="${swPx / s}" stroke-linecap="round" stroke-linejoin="round"><path d="${BODY}"/><circle cx="12" cy="7" r="4"/></g>`;
}
// U arc under the centre; startOffset compensates the trailing letter-space so the word sits dead centre
function arc(r, fs, ls, fw, st, op = 1, ws = ' ', ay = 25, ink = C.navy) {
  const id = 'sbR' + (uid++), half = Math.PI * r / 2 + ls / 2;
  return `<g class="sb-arc" data-ay="${ay}" opacity="${op}"><defs><path id="${id}" d="M${25 - r},${ay} A${r},${r} 0 0 0 ${25 + r},${ay}"/></defs><text font-family="Archivo" font-weight="${fw}" font-stretch="${st}" font-size="${fs}" letter-spacing="${ls}" fill="${ink}"><textPath href="#${id}" startOffset="${half.toFixed(2)}" text-anchor="middle" data-r="${r}">SIGN${ws}IN</textPath></text></g>`;
}
// k = blow-up factor for enlargements: edge and contact shadow stay 1 CSS px, as on the map
const shadowEdge = (face, k = 1) => `<polygon points="${SCALLOP}" fill="rgba(0,0,0,.22)" transform="translate(0,${1 / k})"/><polygon points="${SCALLOP}" style="fill:${face}" stroke="${C.edge}" stroke-width="${1 / k}" stroke-linejoin="round"/>`;
function blotPts(r, oy = 25) { const p = []; for (let i = 0; i < 48; i++) { const a = i / 48 * 2 * Math.PI, rr = r * (1 + .06 * Math.sin(i * 7.3) + .04 * Math.sin(i * 3.1)); p.push(`${(25 + rr * Math.cos(a)).toFixed(2)},${(oy + rr * Math.sin(a)).toFixed(2)}`); } return p.join(' '); }
function dryPts(k, oy = 25) { const R = (21.5 + (25 - oy) * .6) * Math.pow(1 - k, .8), p = []; for (let i = 0; i < 64; i++) { const a = i / 64 * 2 * Math.PI, lobe = .5 + .5 * Math.cos(a * 16), rr = Math.max(0, R * (1 - .16 * lobe * Math.min(1, k * 2)) + .5 * Math.sin(i * 5.7) * k); p.push(`${(25 + rr * Math.cos(a)).toFixed(2)},${(oy + rr * Math.sin(a)).toFixed(2)}`); } return p.join(' '); }
function inkLayer(pts, inner, op = 1) {
  const cid = 'sbK' + (uid++), iid = 'sbI' + (uid++);
  return `<defs><clipPath id="${cid}"><polygon points="${SCALLOP}"/></clipPath><clipPath id="${iid}"><polygon points="${pts}"/></clipPath></defs>
    <g clip-path="url(#${cid})" opacity="${op}"><polygon points="${pts}" fill="${C.navy}"/><g clip-path="url(#${iid})">${inner}</g></g>`;
}
const wrap = (inner, size = 50) => `<svg width="${size}" height="${size}" viewBox="0 0 50 50" style="display:block;overflow:visible" aria-hidden="true">${inner}</svg>`;
// o = { v, ink (radius), dry (0..1), t (0 = sign-in person, 1 = signed-in person), face, size, textOp }
SB.badgeA = function (o = {}) {
  const v = V[o.v || window.__V || 2];
  const t = o.t ?? 0, ps = v.ps + (1 - v.ps) * t, cy = v.cy + (25 - v.cy) * t, sw = v.sw + (2 - v.sw) * t;
  // navy style: plain navy die like today's account badge (no edge/shadow; pressed = --state-on-press, paper ink)
  const nv = v.nv, pr = o.pressed, inkC = nv ? (pr ? '#F2EBDD' : C.orange) : C.navy;
  let s = (nv ? `<polygon points="${SCALLOP}" fill="${pr ? '#2A4F73' : C.navy}"/>` : shadowEdge(o.face || FACE, o.size ? o.size / 50 : 1))
    + arc(v.r, v.fs, v.ls, v.fw, v.st, o.textOp ?? 1, v.ws, v.ay ?? 25, inkC) + person(25, cy, ps, inkC, sw);
  const pts = o.ink ? blotPts(o.ink, cy) : o.dry !== undefined ? dryPts(o.dry, cy) : null;
  if (pts) s += inkLayer(pts, person(25, cy, ps, C.orange, sw), o.dry !== undefined ? 1 - o.dry * .25 : 1);
  return wrap(s, o.size);
};
// measured end-letter angles from 6 o'clock (deg; after centring) -- for the record
SB.arcAngles = function (g) {
  const ay = +(g.dataset.ay || 25), t = g.querySelector('text'), n = t.getNumberOfChars(), ang = p => (Math.atan2(p.y - ay, p.x - 25) * 180 / Math.PI + 360) % 360;
  const a0 = ang(t.getStartPositionOfChar(0)), a1 = ang(t.getEndPositionOfChar(n - 1)), mid = (a0 + a1) / 2;
  return { left: +(a0 - mid).toFixed(1), right: +(a1 - mid).toFixed(1) };
};
// Chromium places textPath glyphs off-centre (round 1's arc leaned too); measure the real ink and
// rotate the arc group so SIGN IN's first and last letters sit symmetric about 6 o'clock.
SB.centerArcs = function (root = document) {
  root.querySelectorAll('g.sb-arc').forEach(g => {
    const ay = +(g.dataset.ay || 25), t = g.querySelector('text'), n = t.getNumberOfChars(); if (!n) return;
    const ang = p => (Math.atan2(p.y - ay, p.x - 25) * 180 / Math.PI + 360) % 360;
    const a0 = ang(t.getStartPositionOfChar(0)), a1 = ang(t.getEndPositionOfChar(n - 1));
    const mid = (a0 + a1) / 2;                 // bottom = 90deg in SVG coords
    g.setAttribute('transform', `rotate(${(90 - mid).toFixed(2)} 25 ${ay})`);
  });
};
if (typeof document !== 'undefined' && document.addEventListener) new MutationObserver(() => SB.centerArcs()).observe(document.documentElement, { childList: true, subtree: true });
})();
