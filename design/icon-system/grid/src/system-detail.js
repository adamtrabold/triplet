// THE SYSTEM, personality vocabulary (batch 2, 2026-11-03: the owner on canvas v295, "i think we need to iterate on ways of drawing
// them that give more personality -- they look very rigid and simplistic, no subtle details"). Three approaches, each a set of
// GENERAL declaration words the maker reads on any root (nothing here names an icon); a root that declares none of them is drawn
// exactly as before, so the approved set is untouched. Spec and pictures: batch2/personality.md.
//
//   A  CONTOUR (turned and pressed stock): the line between a part's ends is the part's own curve, as the approved set's are (the
//      saucer's curve, the coupe's flared bowl, the tree's bowed tiers): a face crowns, a wall bellies, a gable bows, a post tapers
//      or flares into what it stands on.
//        crown: { face: 'top' | 'ends', rise }   a slab's or block's top drawn from one ellipse rising `rise` lines (ends: its two ends
//                                                 half ellipses `rise` lines deep)
//        belly: n      a flat-based vessel's walls bow out n lines at their middle (one curve each, rim to base)
//        bow: n        a gable's sloped sides bow out n lines (the tree's tiers bow by the same move)
//        taper: k      a splay's posts are k of their width at their free end (k > 1: they flare to the ground)
//        flare: k      a drape's fall is k of its width where it meets the floor, its inner side leaning in
//   B  THE TELL: each subject carries the one secondary detail a person would draw from memory, made from three words, each clearing
//      the protrusion or counter minimum, closing at 12 where the size closes detail (as the cup's slots do).
//        nub: [{ shape: 'disc' | 'block' | 'brim', on: 'ends' | 'top', at, w }]   a small added root on its host: discs on a
//              slab's ends or a post's top stand the protrusion minimum past every face they sit on; a block on a top face is
//              the protrusion minimum tall, w lines wide, at a share across; a brim is a slab across a disc at a share down,
//              the protrusion minimum thick, standing that far past the disc each side
//        band: true    on a flat-based vessel: the coupe's band, a band's height deep, a line under the rim, its sides the walls moved in
//        seams: n      a slab cut into n planks, cuts a cut wide
//        door: [w, h]  a block cut from its base: w of its width (never under the counter minimum), h of its height
//        cabins: { n, d } on a ring: n discs d lines across hung from the rim's outside, evenly turned
//   C  THE LIP (the family move): every approved icon has one part that runs past the part it meets (the saucer past the cup, the
//      beam past the columns, the tiers past each other, the knife past its handle). Every icon carries one, by one word:
//        lip: true     the root runs past what it meets by the protrusion minimum each side: a top lip ('top' on a vessel, block or
//                      post: a slab a line thick across its top), a rail past the drapes it holds, a roof past its wall, a slab top
//                      past the legs it stands on, a base past the feet on it, a figure's foot past its leg in the stride
'use strict';
const E = require('./engine.js'), { CAP, ELL_ARC } = require('./picks7.js');
const f = v => +v.toFixed(5);
const K = 0.5523;

// a slab or block outline with a crowned face (A): x, y, w, h in frame units; c: { face, rise } (rise in lines); stroke: the line
function crowned(x, y, w, h, c, stroke, o = {}) {
  const rise = Math.min(c.rise * stroke, c.face === 'ends' ? w / 2 : h * 0.9);
  if (c.face === 'ends') {   // two half ellipses, rise deep, the full height tall: a stadium cut from the block
    const ry = h / 2, cy = y + ry, xl = x + rise, xr = x + w - rise, q = A => `C${f(A[1][0])} ${f(A[1][1])} ${f(A[2][0])} ${f(A[2][1])} ${f(A[3][0])} ${f(A[3][1])}`;
    const R1 = ELL_ARC(xr, cy, rise, ry, -Math.PI / 2, 0), R2 = ELL_ARC(xr, cy, rise, ry, 0, Math.PI / 2), L1 = ELL_ARC(xl, cy, rise, ry, Math.PI / 2, Math.PI), L2 = ELL_ARC(xl, cy, rise, ry, Math.PI, 3 * Math.PI / 2);
    return E.D(`M${f(xl)} ${f(y)}H${f(xr)}${q(R1)}${q(R2)}H${f(xl)}${q(L1)}${q(L2)}Z`, { root: 'ELLIPSE', also: 'BLOCK', ...o });
  }
  // the top: one ellipse its full width (over: the ends cut it a little inside its widest point, so the shoulders are corners the rack cuts)
  return { ...CAP(x, x + w, y + h, h, { root: 'ellipse', ry: rise / h, over: c.over ?? 1.15 }, true), ...o };
}

// a polygon whose sloped sides bow outward by b (frame units): A's bow on a gable
function bowed(pts, b, o = {}) {
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length, cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 1; i <= pts.length; i++) {
    const p = pts[i - 1], q = pts[i % pts.length], dx = q[0] - p[0], dy = q[1] - p[1];
    if (Math.abs(dx) > 1e-6 && Math.abs(dy) > 1e-6) {
      const L = Math.hypot(dx, dy), mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2; let nx = dy / L, ny = -dx / L;
      if ((mx - cx) * nx + (my - cy) * ny < 0) { nx = -nx; ny = -ny; }
      d += `Q${f(mx + 2 * b * nx)} ${f(my + 2 * b * ny)} ${f(q[0])} ${f(q[1])}`;
    } else d += `L${f(q[0])} ${f(q[1])}`;
  }
  return E.D(d + 'Z', o);
}

// a flat-based vessel (A belly; B band). x0..x1 the rim, bx its base half width, cx centre, top/bot frame units
function bellied(cx, rx, bx, top, bot, b, o = {}) {
  const my = (top + bot) / 2, mxR = cx + (rx + bx) / 2 + 2 * b, mxL = cx - (rx + bx) / 2 - 2 * b;
  return E.D(`M${f(cx - rx)} ${f(top)}H${f(cx + rx)}Q${f(mxR)} ${f(my)} ${f(cx + bx)} ${f(bot)}H${f(cx - bx)}Q${f(mxL)} ${f(my)} ${f(cx - rx)} ${f(top)}Z`, o);
}
// the coupe's band under a flat-based vessel's rim: a line down, a band deep, its sides the walls moved in by the line
function vesselBand(cx, rx, bx, top, bot, t, b = 0) {
  const wallAt = y => { const s = (y - top) / (bot - top); return rx + (bx - rx) * s + (b ? 4 * b * s * (1 - s) : 0); };
  const y0 = top + t.stroke, y1 = y0 + t.band, a = wallAt(y0) - t.stroke, c = wallAt(y1) - t.stroke;
  return E.cut(E.D(`M${f(cx - a)} ${f(y0)}H${f(cx + a)}L${f(cx + c)} ${f(y1)}H${f(cx - c)}Z`, { root: 'SLOT', role: 'band' }));
}

// the detail pass (B's tells and C's top lips): extra roots drawn on placed roots, once the layout has placed them. Each moves with
// its host on the grid (withRoot), as a band or a loop does. Returns nothing; adds to each host's prims.
function details(out, t, u, meta) {
  for (const R of out) {
    const r = R.r; if (!r || !R.box) continue;
    const b = R.box, X0 = b.x0 * u, X1 = b.x1 * u, Y0 = b.top * u, Y1 = b.bot * u, W = X1 - X0, H = Y1 - Y0, add = [], p = t.protrude;
    for (const n of r.nub || []) {
      if (n.shape === 'disc' && n.on === 'ends') {   // finials: discs on a slab's two ends, standing the minimum past every face
        const d = H + 2 * p; for (const x of [X0, X1]) add.push({ ...E.C(x, (Y0 + Y1) / 2, d / 2), root: 'CIRCLE', role: 'nub' });
      } else if (n.shape === 'disc' && n.on === 'top') {   // a knob on a post's top: the post's width and the minimum each side
        const d = W + 2 * p; add.push({ ...E.C((X0 + X1) / 2, Y0 + d / 2 - p, d / 2), root: 'CIRCLE', role: 'nub' });
      } else if (n.shape === 'block') {   // a button on a top face: the minimum tall, w lines wide, at a share across
        const w = (n.w ?? 1) * t.stroke, xc = X0 + (n.at ?? 1 / 2) * W; add.push(E.R(xc - w / 2, Y0 - p, w, p + t.stroke / 2, { root: 'BLOCK', role: 'nub' }));
      } else if (n.shape === 'brim') {   // a brim across a disc, at a share down, standing the minimum past it each side
        const y = Y0 + (n.at ?? 1 / 3) * H; add.push(E.R(X0 - p, y - p / 2, W + 2 * p, p, { root: 'SLAB', role: 'nub' }));
      }
    }
    if (r.seams && R.slab) { const n = r.seams, cw = t.cut, pw = (W - (n - 1) * cw) / n;
      for (let i = 1; i < n; i++) add.push(E.cut(E.R(X0 + i * pw + (i - 1) * cw, Y0 - 0.2, cw, H + 0.4, { root: 'SLOT', role: 'counter' }))); }
    if (r.door && t.detail !== false) { const [dw, dh] = r.door, w = Math.max(t.counter, dw * W), h = Math.max(t.counter, dh * H);
      add.push(E.cut(E.R((X0 + X1) / 2 - w / 2, Y1 - h, w, h + 0.3, { root: 'SLOT', role: 'counter' }))); }
    // cabins hang: each from a pivot on the rim's middle line, straight down under it (as a gondola does, whatever its place on the
    // wheel), so the ring never reads as a gear's even teeth
    if (r.cabins && R.centre) { const { n, d: dl, turn = 1 / 2 } = r.cabins, d = dl * t.stroke, [c, cy] = R.centre, Rm = R.radius;
      for (let i = 0; i < n; i++) { const a = (i + turn) * 2 * Math.PI / n, x = c + Math.sin(a) * Rm, y = cy - Math.cos(a) * Rm;
        add.push({ ...E.C(x, y + d / 2, d / 2), root: 'CIRCLE', role: 'nub' }); } }
    if (r.lip === 'top') add.push(E.R(X0 - p, Y0, W + 2 * p, t.stroke, { root: 'SLAB', role: 'lip' }));
    if (r.band && R.taper && t.detail !== false) add.push(vesselBand((X0 + X1) / 2, W / 2, W / 2 * R.taper.base, Y0, Y1, t, (r.belly || 0) * t.stroke));
    if (add.length) { R.prims.push(...add.map(q => ({ ...q, withRoot: r.id }))); (meta.tells = meta.tells || []).push({ id: r.id, n: add.length }); }
  }
}
module.exports = { crowned, bowed, bellied, vesselBand, details };
