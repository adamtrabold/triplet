// THE SYSTEM, the maker. One generic builder: it reads an icon's declaration (system.js DECL: roots, their sizes as shares of a
// parent, how each meets the one above it) and makes the icon from the system's rules alone. Nothing here names an icon.
//
//   KINDS     what each kind of root is (vessel, loop, cap, slab, post, gable, tiers, row, comb, head, blade, star, cross): the one
//             drawing of that kind, its thickness from the size (stroke for walls and slabs, part for posts)
//   JOINS     how a root meets the one above it: cut (rests on: a cut apart, the lower face on the lattice), into (a post into a
//             face: a fillet, the engine's flare), held (posts under a slab that runs past them: the chamfer, joins.js heldSlab),
//             notch (gables stacked), tangent (a loop on a vessel's wall: one tangent curve, its counter running from the wall)
//   LAYOUT    the spine top to bottom; a tall class spans its box's height, a wide or square one its widest root spans the box's
//             width; a group beside another (a cut between) shares its top and bottom; an asymmetric group resting on a base sits
//             with its ink centre over the base's centre
//   PIPELINE  the class fit (sides that scale only), optical centring, the roots landed on the iPhone grid, the corner law with
//             the cutter rack, fairing, the mirror for a symmetric icon
'use strict';
const path = require('path');
const E = require('./engine.js'), P7 = require('./picks7.js');
const { PROP, capOver } = require('./proportions.js');
const { measure } = require('./optics.js');
const { fromTable, scaled } = require('./laws7.js');
const f = v => +v.toFixed(3), f5 = v => +v.toFixed(5), T3 = v => Math.round(v * 3) / 3, K = 0.5523;
const { ELL_ARC, CAP, APEX } = P7;
// the class boxes; DIAMOND (10-30): a shape's badge is a diamond, so its class box is a diamond of the coin's area (diagonals
// sqrt(2 x 36 pi)); a drawing in it is fitted by how far its ink reaches across the diamond (|x| + |y| about its centre)
const KEY = { ...P7.KEY, DIAMOND: [Math.sqrt(72 * Math.PI), Math.sqrt(72 * Math.PI)] };
const CAP_P = { root: 'ellipse', ry: 1, over: capOver(PROP.cap.end) };   // the cap rule: a slab cut by one ellipse its full height
const E15 = 8 * Math.PI / 180;   // an ellipse running on from a straight wall: its first 8 degrees its own cubic (the engine eases it in)
const FAIR_K = 0.33;
const LANDING = { on: false };   // widths land on the final drawing only (the fit sizes the drawing as drawn)
const TIE_UP = process.env.OVER_TIE !== 'down';   // an overhang half way between two grid steps: the larger (yours to change)             // a line running into an ellipse at its widest point: the ellipse's bend there stays under this

// ---------------------------------------------------------------------------------------------------------------------------
// THE CUTTER RACK (the machined rule): every round is one of three cutters, 1/8, 1/4, 1/2px, the one nearest (on the doubling
// scale) to what the corner law asks; a cutter that doesn't fit the corner's edges steps down; under the smallest the edge is
// only broken (what fits). Points sharper than 75 degrees keep the tip rule (broken, not milled). px at the size: a tool is a tool.
const RACK = [1 / 8, 1 / 4, 1 / 2];
function rack(law, k) {
  return c => {
    const r0 = law(c); if (typeof r0 !== 'number' || !(r0 > 0) || process.env.RACK === '0') return r0;
    if (c.convex && c.angle < 75) return r0;                        // a tip: broken by its edge
    const px = r0 * k, e = Math.min(c.lin, c.lout) * k, room = (!c.convex && !c.hole ? 0.45 : 0.2) * e;
    if (px < RACK[0] * 0.75) return r0;                              // too small for any cutter: the edge is broken
    let i = 0, best = 1e9; RACK.forEach((r, j) => { const d = Math.abs(Math.log2(r / px)); if (d < best) { best = d; i = j; } });
    while (i > 0 && RACK[i] > room + 1e-9) i--;
    return RACK[i] > room + 1e-9 ? Math.min(r0, room / k) : RACK[i] / k;
  };
}

// ---------------------------------------------------------------------------------------------------------------------------
// THE KINDS. Each returns { prims, box: {x0, x1, top, bot}, ... } in the drawing's frame (positions in units x u, thicknesses in
// frame units). t: the size's thicknesses in frame units (stroke, part, cut, band, min, counter, protrude, grid).
const KINDS = {
  // a vessel: a flat rim, its sides one ellipse (PROP.ellipse.vessel tall as wide). deep (share of its width): straight walls run
  // into the ellipse at its widest point; rimCut (share of the ellipse's height): the rim cuts the ellipse that far above its centre
  vessel(r, at, t, u) {
    const w = at.w, cx = at.cx, top = at.top, rx = w / 2, ry = PROP.ellipse.vessel * rx, X = v => f(v * u), Q = v => f5(v * u);
    if (r.deep != null) {
      const l = cx - rx, rr = cx + rx, bot = top + r.deep * w, cy = bot - ry;
      const C_ = (a0, a1) => { const P = ELL_ARC(cx, cy, rx, ry, a0, a1); return `C${Q(P[1][0])} ${Q(P[1][1])} ${Q(P[2][0])} ${Q(P[2][1])} ${Q(P[3][0])} ${Q(P[3][1])}`; };
      const prim = E.D(`M${X(l)} ${X(top)}H${X(rr)}V${Q(cy)}${C_(0, E15)}${C_(E15, Math.PI / 2)}${C_(Math.PI / 2, Math.PI - E15)}${C_(Math.PI - E15, Math.PI)}Z`, { root: 'VESSEL' });
      return { prims: [prim], box: { x0: l, x1: rr, top, bot }, depth: bot - top, walls: true };
    }
    const c = r.rimCut, cy = top + c * ry, hr = rx * Math.sqrt(1 - c * c), a = Math.atan2(-c, hr / rx), mA = (a + Math.PI / 2) / 2, bot = cy + ry;
    const arc = (a0, a1) => ELL_ARC(cx, cy, rx, ry, a0, a1), sR2 = arc(a, mA), sR = arc(mA, Math.PI / 2), sL = arc(Math.PI / 2, Math.PI - mA), sL2 = arc(Math.PI - mA, Math.PI - a);
    const qq = v => `${X(v[0])} ${X(v[1])}`, cc = A => `C${qq(A[1])} ${qq(A[2])} ${qq(A[3])}`;
    const prims = [E.D(`M${X(cx - hr)} ${X(top)}H${X(cx + hr)}${cc(sR2)}${cc(sR)}${cc(sL)}${cc(sL2)}Z`, { root: 'VESSEL' })];
    if (r.band) {
      // the inner band: under the rim (a stroke down), a band's height deep, its sides the vessel's own side moved in by the stroke
      const Lc = sL2.map(v => [X(v[0]), X(v[1])]), rimT = top * u + t.stroke, liq = rimT + t.band, mid = cx * u;
      const pt = (q, tt) => [0, 1].map(i => (1 - tt) ** 3 * q[0][i] + 3 * tt * (1 - tt) ** 2 * q[1][i] + 3 * tt * tt * (1 - tt) * q[2][i] + tt ** 3 * q[3][i]);
      const tY = y => { let lo = 0, hi = 1; for (let n = 0; n < 60; n++) { const m = (lo + hi) / 2; if (pt(Lc, m)[1] > y) lo = m; else hi = m; } return (lo + hi) / 2; };
      const lerp = (p, q, tt) => [p[0] + (q[0] - p[0]) * tt, p[1] + (q[1] - p[1]) * tt];
      const sub = (q, ta, tb) => { const cut1 = (q, tt) => { const a_ = lerp(q[0], q[1], tt), b_ = lerp(q[1], q[2], tt), c_ = lerp(q[2], q[3], tt), ab = lerp(a_, b_, tt), bc = lerp(b_, c_, tt), m = lerp(ab, bc, tt); return [[m, bc, c_, q[3]], [q[0], a_, ab, m]]; }; const [tail] = cut1(q, ta); return cut1(tail, (tb - ta) / (1 - ta))[1]; };
      const q = sub(Lc, tY(liq), tY(rimT)).map(([x, y]) => [x + t.stroke, y]), mq = q.map(([x, y]) => [2 * mid - x, y]);
      prims.push(E.cut(E.D(`M${f(q[0][0])} ${f(q[0][1])}C${f(q[1][0])} ${f(q[1][1])} ${f(q[2][0])} ${f(q[2][1])} ${f(q[3][0])} ${f(q[3][1])}H${f(mq[3][0])}C${f(mq[2][0])} ${f(mq[2][1])} ${f(mq[1][0])} ${f(mq[1][1])} ${f(mq[0][0])} ${f(mq[0][1])}Z`, { role: 'band' })));
    }
    return { prims, box: { x0: cx - rx, x1: cx + rx, top, bot }, depth: bot - top, rx, ry };
  },
  // a loop (a handle): a band of the stroke round a counter, its back a half circle, on its parent's wall at the parent's top; its
  // counter a circle on the loop's own centre (the loop's radius less the stroke), run on to the wall as a slot (PROP.line.slot)
  loop(r, at, t, u, P) {
    if (r.at === 'top') {
      // a loop on a top face: its feet span of the face apart, its back a half circle on the face; a loop that runs on behind a face
      // shows through it (into): past a band of the line, its legs go on as slots of its own width, into of the face's depth, ending round
      // rise: its back may stand on legs (a share of the line); with none its half circle stands on the face
      const W = t.stroke, b = P.box, c = (b.x0 + b.x1) / 2 * u, yF = b.top * u, yT = yF - (r.rise ?? 0) * W, Ro = r.span * (b.x1 - b.x0) * u / 2, Ri = Ro - W, n = v => f5(v);
      const arc = (R_, a, z) => `C${n(c + a * R_)} ${n(yT - R_ * K)} ${n(c + a * R_ * K)} ${n(yT - R_)} ${n(c)} ${n(yT - R_)}C${n(c + z * R_ * K)} ${n(yT - R_)} ${n(c + z * R_)} ${n(yT - R_ * K)} ${n(c + z * R_)} ${n(yT)}`;
      const prims = [E.D(`M${n(c - Ro)} ${n(yF + 0.3)}V${n(yT)}${arc(Ro, -1, 1)}V${n(yF + 0.3)}H${n(c + Ri)}V${n(yT)}${arc(Ri, 1, -1)}V${n(yF + 0.3)}Z`, { root: 'LOOP' })];
      if (r.into) for (const sg of [-1, 1]) { const xs = c + sg * (Ro - W / 2), y0 = yT + W, y1 = y0 + r.into * P.depth * u, h = W / 2;
        prims.push(E.cut(E.D(`M${n(xs - h)} ${n(y0)}H${n(xs + h)}V${n(y1 - h)}C${n(xs + h)} ${n(y1 - h + h * K)} ${n(xs + h * K)} ${n(y1)} ${n(xs)} ${n(y1)}C${n(xs - h * K)} ${n(y1)} ${n(xs - h)} ${n(y1 - h + h * K)} ${n(xs - h)} ${n(y1 - h)}Z`, { root: 'SLOT', role: 'counter' }))); }
      return { prims, box: { x0: (c - Ro) / u, x1: (c + Ro) / u, top: (yT - Ro) / u, bot: b.top } };
    }
    const X = v => f(v * u), W = t.stroke / u, top = P.box.top, side = r.at === 'left' ? -1 : 1, wall = side > 0 ? P.box.x1 : P.box.x0;
    const eb = top + r.h * P.depth, R_ = (eb - top) / 2, eR = wall + side * (PROP.line.slot * W + R_), ex = eR - side * R_, inW = wall - side * W / 2;
    const s = side, xs = v => X(v);
    const ear = E.D(`M${xs(inW)} ${X(top)}H${xs(ex)}C${xs(ex + s * R_ * K)} ${X(top)} ${xs(eR)} ${X(top + R_ - R_ * K)} ${xs(eR)} ${X(top + R_)}C${xs(eR)} ${X(top + R_ + R_ * K)} ${xs(ex + s * R_ * K)} ${X(eb)} ${xs(ex)} ${X(eb)}H${xs(inW)}Z`, { root: 'LOOP' });
    const cy = top + R_, iT = top + W, iB = eb - W, iK = eR - s * W, rx = Math.abs(iK - ex), ry1 = cy - iT, ry2 = iB - cy;
    const hole = E.cut(E.D(`M${xs(wall)} ${X(iT)}H${xs(ex)}C${xs(ex + s * rx * K)} ${X(iT)} ${xs(iK)} ${X(cy - ry1 * K)} ${xs(iK)} ${X(cy)}C${xs(iK)} ${X(cy + ry2 * K)} ${xs(ex + s * rx * K)} ${X(iB)} ${xs(ex)} ${X(iB)}H${xs(wall)}Z`, { root: 'CIRCLE', also: 'SLOT', role: 'counter' }));
    return { prims: [ear, hole], box: { x0: Math.min(wall, eR), x1: Math.max(wall, eR), top, bot: eb } };
  },
  // a cap: a slab (the stroke thick) cut by one ellipse (the cap rule). face 'up': the curve on top (a foot); 'down': underneath (a
  // plate). measure 'ellipse': w is the ellipse's width (the slab's ends cut it); else the slab's
  cap(r, at, t, u) {
    const we = r.measure === 'ellipse' ? at.w / CAP_P.over : at.w, x0 = (at.cx - we / 2) * u, x1 = (at.cx + we / 2) * u, h = t.stroke;
    const up = r.face === 'up', yb = up ? T3(at.topF + h) : at.topF, yTop = up ? yb - h : yb;   // a base's flat face on the lattice
    return { prims: [{ ...CAP(x0, x1, yb, h, CAP_P, up), root: 'CAP' }], box: { x0: at.cx - we / 2, x1: at.cx + we / 2, top: yTop / u, bot: (yTop + h) / u }, frame: true };
  },
  slab(r, at, t, u) {
    const x0 = at.cx - at.w / 2, x1 = at.cx + at.w / 2, h = t.stroke * (r.lines || 1);   // lines: its thickness, a count of the line
    return { prims: [E.R(x0 * u, at.topF, (x1 - x0) * u, h, { root: 'SLAB' })], box: { x0, x1, top: at.topF / u, bot: (at.topF + h) / u }, slab: true, frame: true };
  },
  // a gable: a triangle on a flat base, its ends upright (ends: a share of the stroke), rising pitch of its half run to the apex
  gable(r, at, t, u) {
    const x0 = at.cx - at.w / 2, x1 = at.cx + at.w / 2, ge = (r.ends || 0) * t.stroke, hr = (x1 - x0) / 2 * u;
    const gb = T3(at.topF + ge + r.pitch * hr), ap = f(gb - ge - r.pitch * hr);
    const pts = ge ? [[x0 * u, gb], [x0 * u, gb - ge], [at.cx * u, ap], [x1 * u, gb - ge], [x1 * u, gb]] : [[x0 * u, gb], [at.cx * u, ap], [x1 * u, gb]];
    return { prims: [{ ...E.P(...pts), root: 'GABLE' }], box: { x0, x1, top: ap / u, bot: gb / u }, frame: true, point: true };
  },
  // gables stacked into tiers: shown heights and half widths in the declared rhythm, the bottom one the width given; each lower tier's
  // apex set so the notch under the tier above is notch of that tier's half width. A tier hangs (it overhangs what is under it), so its
  // underside lifts half a line toward the centre (PROP.line.droop) and its sides sweep in a fifth of a line (PROP.line.bow)
  tiers(r, at, t, u) {
    const W = t.stroke / u, n = r.heights.length, apex = at.top - APEX, B = at.bot, crown = B - apex, sH = r.heights.reduce((a, b) => a + b, 0), hwN = at.w / 2, c = at.cx * u;
    const X = v => f(v * u), Y = v => T3(v * u), tiers = []; let cum = 0;
    for (let i = 0; i < n; i++) { cum += r.heights[i]; tiers.push([i === 0 ? apex : null, apex + crown * cum / sH, hwN * r.widths[i] / r.widths[n - 1]]); }
    for (let i = 1; i < n; i++) { const [, byU, hwU] = tiers[i - 1], [, byL, hwL] = tiers[i], r_ = (hwU - r.notch * hwU) / hwL; tiers[i][0] = (byU - r_ * byL) / (1 - r_); }
    for (let i = 1; i < n; i++) tiers[i][0] = Math.min(tiers[i][0], tiers[i - 1][1] - (PROP.line.droop + 1) * W);
    const dr = PROP.line.droop * t.stroke, bw = PROP.line.bow * t.stroke;
    const bowSide = (x0, y0, x1, y1) => { const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, L = Math.hypot(x1 - x0, y1 - y0), nx = (y1 - y0) / L, ny = -(x1 - x0) / L, s_ = Math.sign((mx - c) * nx || 1); return `Q${f(mx + s_ * nx * 2 * bw)} ${f(my + s_ * ny * 2 * bw)} ${f(x1)} ${f(y1)}`; };
    const prims = tiers.map(([ty, by, hw]) => ({ ...E.D(`M${f(c)} ${X(ty)}${bowSide(c, X(ty), c + X(hw), Y(by))}Q${f(c + X(hw) * 0.45)} ${f(Y(by) - dr)} ${f(c)} ${f(Y(by) - dr)}Q${f(c - X(hw) * 0.45)} ${f(Y(by) - dr)} ${f(c - X(hw))} ${Y(by)}${bowSide(c - X(hw), Y(by), c, X(ty))}Z`), root: 'GABLE' }));
    return { prims, box: { x0: at.cx - hwN, x1: at.cx + hwN, top: apex, bot: B }, point: true };
  },
  post(r, at, t, u) {
    const w = t.part, x0 = at.cx * u - w / 2;
    return { prims: [E.R(x0, at.topF, w, at.botF - at.topF, { root: 'POST' })], box: { x0: x0 / u, x1: (x0 + w) / u, top: at.topF / u, bot: at.botF / u }, frame: true };
  },
  // ---- 10-30: the roots the rest of the set needed. Each is general (a kind of part, never an icon); C: what the layout knows
  // (placed roots, the box's height H, the root above, the icon's top and bottom so far, widths by id, end posts declared)
  // a block: a mass, w of its parent wide and deep of its own width deep, its corners a mass's; at the left or right end of the
  // root it names (of), beside an end post there a cut apart
  block(r, at, t, u, C) {
    const w = at.w * u, h = (r.deep ?? 1) * w; let x0 = at.cx * u - w / 2;
    if (r.at && r.of) { const ow = C.wOf(r.of) * u, oc = at.cx * u, inset = C.endPost(r.of, r.at) ? t.part + t.cut : 0;
      x0 = r.at === 'left' ? oc - ow / 2 + inset : oc + ow / 2 - inset - w; }
    return { prims: [E.R(x0, at.topF, w, h, { root: 'BLOCK' })], box: { x0: x0 / u, x1: (x0 + w) / u, top: at.topF / u, bot: (at.topF + h) / u }, asym: !!r.at };
  },
  // a ring: a circle of the stroke round a round counter, w across its outside
  ring(r, at, t, u) {
    const D = at.w * u, R0 = D / 2 - t.stroke / 2, c = at.cx * u, cy = at.topF + D / 2;
    return { prims: [{ ...E.O(c, cy, R0, t.stroke), root: 'CIRCLE' }], box: { x0: at.cx - at.w / 2, x1: at.cx + at.w / 2, top: at.topF / u, bot: (at.topF + D) / u }, centre: [c, cy], radius: R0 };
  },
  // a disc: a solid circle, w across
  disc(r, at, t, u) {
    const D = at.w * u, c = at.cx * u, cy = at.topF + D / 2;
    return { prims: [{ ...E.C(c, cy, D / 2), root: 'CIRCLE' }], box: { x0: at.cx - at.w / 2, x1: at.cx + at.w / 2, top: at.topF / u, bot: (at.topF + D) / u }, centre: [c, cy], radius: D / 2 };
  },
  // spokes: n posts crossed through the centre of the ring they name, wall to wall, the first turned `turn` degrees off upright
  spokes(r, at, t, u, C) {
    const P = C.placed[r.of], [c, cy] = P.centre, L = P.radius, prims = [];
    for (let i = 0; i < r.n; i++) { const a = ((r.turn || 0) + i * 180 / r.n) * Math.PI / 180, dx = Math.sin(a) * L, dy = -Math.cos(a) * L;
      prims.push({ ...E.B([c - dx, cy - dy], [c + dx, cy + dy], t.part), root: 'POST', role: 'spoke' }); }
    return { prims, box: { ...P.box }, noStack: true };
  },
  // a splay: two posts from one point of the root they name (its centre; or a share of the way down a post), leaning `lean`
  // degrees off upright to either side, each with a flat foot: down to the box's bottom (to), `past` of that root's height
  // below it, or `reach` of the box's height below the point
  splay(r, at, t, u, C) {
    const P = C.placed[r.of], [ox, oy] = r.from != null && P.axis ? [P.axis[0][0] + (P.axis[1][0] - P.axis[0][0]) * r.from, P.axis[0][1] + (P.axis[1][1] - P.axis[0][1]) * r.from] : P.centre;
    const yb = r.to === 'bottom' ? C.H * u : r.past != null ? P.box.bot * u + r.past * (P.box.bot - P.box.top) * u : oy + r.reach * C.H * u;
    // from a centre the posts meet in a pin (a disc a line across on the point, their square ends inside it); from a post's foot
    // they are one root with that post (one band: the grid moves them together, and the joint is the corners the rack cuts)
    const foot = r.from != null && P.axis, a = r.lean * Math.PI / 180, hw = t.part / 2 / Math.cos(a), run = (yb - oy) * Math.tan(a), h = t.part / 2;
    const parts = foot ? P.prims.slice() : [E.C(ox, oy, t.stroke / 2)];
    for (const sg of [-1, 1]) { const xb = ox + sg * run, dx = sg * Math.sin(a), dy = Math.cos(a), nx = dy * h, ny = -dx * h;
      parts.push(E.P([ox - nx, oy - ny], [ox + nx, oy + ny], [xb + hw, yb], [xb - hw, yb])); }
    const prims = [E.D(E.build(parts).d, { root: 'POST', also: foot ? null : 'CIRCLE', role: 'splay' })];
    if (foot) P.prims = [];
    return { prims, box: { x0: (ox - run - hw) / u, x1: (ox + run + hw) / u, top: oy / u, bot: yb / u }, noStack: true };
  },
  // a knot: a square, `square` of the span (its width less a line) between its lines' centres; each side runs on past its corners
  // and turns, as one band of the stroke, into a loop round the corner (a three-quarter ring tangent to both sides)
  knot(r, at, t, u) {
    const W = t.stroke, Wd = at.w * u, span = Wd - W, side = r.square * span, a = side / 2, rr = (span - side) / 4, c = at.cx * u, cy = at.topF + Wd / 2, L = a + rr, prims = [];
    for (const sg of [-1, 1]) {
      prims.push(E.R(c + sg * a - W / 2, cy - L, W, 2 * L, { root: 'POST', role: 'knot' }));
      prims.push(E.R(c - L, cy + sg * a - W / 2, 2 * L, W, { root: 'POST', role: 'knot' }));
    }
    // a round loop: a three-quarter ring tangent to both sides; a square loop (loop: 'square'): the sides run on and turn square
    // round a square counter, so every join is a corner the rack cuts
    const holes = [];
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) { const phi = Math.atan2(sy, sx) * 180 / Math.PI, lx = c + sx * L, ly = cy + sy * L;
      if (r.loop === 'square') { prims.push(E.R(lx - rr - W / 2, ly - rr - W / 2, 2 * rr + W, 2 * rr + W)); holes.push(E.cut(E.R(lx - rr + W / 2, ly - rr + W / 2, 2 * rr - W, 2 * rr - W))); }
      else prims.push({ ...E.A(lx, ly, rr, W, phi - 135, phi + 135), root: 'LOOP' }); }
    prims.push(...holes);
    // one band: its straights and loops are one root, so the grid moves it whole
    return { prims: [E.D(E.build(prims).d, { root: 'LOOP', also: 'POST' })], box: { x0: at.cx - at.w / 2, x1: at.cx + at.w / 2, top: at.topF / u, bot: (at.topF + Wd) / u } };
  },
  // a drape and its mirror (a cut apart down the middle), hung under the root above from its middle out to its ends, where it falls
  // as a post to the bottom: its edge a quarter ellipse centred on the fall's inner face at the top, `tie` of the height left below
  // it, so the edge meets the fall square (a corner the rack cuts), never running level into it
  drape(r, at, t, u, C) {
    const P = C.prev, x0 = P.box.x0 * u, x1 = P.box.x1 * u, top = at.topF, H = C.H * u, ry = r.tie * (H - top), rx = (x1 - x0) / 2 - t.cut / 2 - t.part, prims = [];
    for (const sg of [-1, 1]) { const xo = sg < 0 ? x0 + t.part : x1 - t.part, A = ELL_ARC(xo, top, rx, ry, sg < 0 ? 0 : Math.PI, Math.PI / 2), q = v => `${f5(v[0])} ${f5(v[1])}`;
      prims.push({ ...E.D(`M${f5(xo)} ${f5(top)}H${f5(xo - sg * rx)}C${q(A[1])} ${q(A[2])} ${q(A[3])}Z`), root: 'ELLIPSE', role: 'drape' });
      prims.push(E.R(sg < 0 ? x0 : x1 - t.part, top, t.part, H - top, { root: 'POST', role: 'fall' })); }
    return { prims, box: { x0: x0 / u, x1: x1 / u, top: top / u, bot: H / u } };
  },
  // blocks: cols x rows blocks, a cut apart (the streets), a square w across, turned `turn` degrees about its centre
  blocks(r, at, t, u) {
    const G = at.w * u, c = at.cx * u, cy = at.topF + G / 2, bw = (G - (r.cols - 1) * t.cut) / r.cols, bh = (G - (r.rows - 1) * t.cut) / r.rows, a = (r.turn || 0) * Math.PI / 180, co = Math.cos(a), si = Math.sin(a);
    const rot = (x, y) => [c + (x - c) * co - (y - cy) * si, cy + (x - c) * si + (y - cy) * co], prims = [];
    for (let i = 0; i < r.cols; i++) for (let j = 0; j < r.rows; j++) { const x = c - G / 2 + i * (bw + t.cut), y = cy - G / 2 + j * (bh + t.cut);
      prims.push({ ...E.P(rot(x, y), rot(x + bw, y), rot(x + bw, y + bh), rot(x, y + bh)), root: 'BLOCK', role: 'block' }); }
    const hx = G / 2 * (Math.abs(co) + Math.abs(si));
    return { prims, box: { x0: (c - hx) / u, x1: (c + hx) / u, top: (cy - hx) / u, bot: (cy + hx) / u } };
  },
  // an end post: a post flush with one end of the root it names, into it; from that root's top (or, rise, a line over the icon's
  // top) down `h` of that root's width below it, else to the icon's bottom
  endPost(r, at, t, u, C) {
    const P = C.placed[r.of], x0 = r.at === 'left' ? P.box.x0 * u : P.box.x1 * u - t.part, y0 = r.rise ? C.top * u - t.stroke : P.box.top * u;
    const y1 = r.h != null ? P.box.bot * u + r.h * (P.box.x1 - P.box.x0) * u : C.bot * u;
    return { prims: [E.R(x0, y0, t.part, y1 - y0, { root: 'POST' })], box: { x0: x0 / u, x1: (x0 + t.part) / u, top: y0 / u, bot: y1 / u }, asym: true, noStack: true };
  },
  // a leaning post: from under the root above (a cut apart from its edge, along the post), `show` of the box's height long,
  // leaning `lean` degrees: its top ahead, its foot behind
  lean(r, at, t, u, C) {
    const P = C.prev, [hx, hy] = P.centre, a = r.lean * Math.PI / 180, dx = -Math.sin(a), dy = Math.cos(a), g = P.radius + t.cut, len = r.show * C.H * u;
    const p0 = [hx + dx * g, hy + dy * g], p1 = [p0[0] + dx * len, p0[1] + dy * len];
    return { prims: [{ ...E.B(p0, p1, t.part), root: 'POST' }], box: { x0: Math.min(p0[0], p1[0]) / u, x1: Math.max(p0[0], p1[0]) / u, top: p0[1] / u, bot: p1[1] / u }, axis: [p0, p1], asym: true };
  },
};

// THE CHAMFER (a slab held by posts under its overhang): past each outer post the slab's near face is cut back by a straight
// chamfer at 45 degrees, as a chamfer cutter leaves it: from the slab's end, half the overhang above its near face, down to the
// post's outside face, half the overhang below it, so the cut rises as far as it runs. Its two edges turn 45 degrees (a shallower
// turn reads as a knee in one line) and the corner law breaks them with the rack's cutters.
function chamfered({ x0, x1, yT, yB, top = null, bot = null }) {
  // top / bot: the row holding that face { l: its left post's outside face, r: its right post's, w: a post's width, c: the chamfer
  // (the rule's overhang; a slab that runs further past its post runs on flat, half a chamfer thinner) }, or null (a plain face)
  const P = [];
  if (top) { const { l, r, w, c } = top, yd = yT + c / 2, yf = yT - c / 2;
    P.push([x0, yd]); if (l - c - x0 > 1e-6) P.push([l - c, yd]); P.push([l, yf], [l + w / 2, yf], [l + w / 2, yT], [r - w / 2, yT], [r - w / 2, yf], [r, yf]); if (x1 - r - c > 1e-6) P.push([r + c, yd]); P.push([x1, yd]); }
  else P.push([x0, yT], [x1, yT]);
  if (bot) { const { l, r, w, c } = bot, yd = yB - c / 2, yf = yB + c / 2;
    P.push([x1, yd]); if (x1 - r - c > 1e-6) P.push([r + c, yd]); P.push([r, yf], [r - w / 2, yf], [r - w / 2, yB], [l + w / 2, yB], [l + w / 2, yf], [l, yf]); if (l - c - x0 > 1e-6) P.push([l - c, yd]); P.push([x0, yd]); }
  else P.push([x1, yB], [x0, yB]);
  return { ...E.D('M' + P.map(([x, y]) => `${f(x)} ${f(y)}`).join('L') + 'Z'), root: 'SLAB', role: 'chamfer' };
}

// ---------------------------------------------------------------------------------------------------------------------------
// THE LAYOUT. decl.spine: the roots top to bottom; a group of columns side by side is { side: [spine, spine], join: 'cut' }.
// s: the drawing's size (the class's box is KEY units at s = 12); Z: the size; S: the general rules (row, comb); room: the width the
// box allows (frame units). Returns the prims and what each rule decided (meta, for the checks and the board).
function layout(decl, s, Z, S, room, gdx = null) {
  const u = s / 12, k = Z.k, t = { stroke: Z.stroke / k, part: Z.part / k, cut: Z.gap / k, band: Z.band / k, min: Z.min / k, counter: Z.counter / k, protrude: Z.protrude / k, grid: (1 / 3) / k };
  const cls = decl.cls.toUpperCase(), key = KEY[cls], tall = cls === 'TALL', H = key[1];
  const meta = { rows: [], combs: [], protrusions: [], bands: [], chamfers: [], loops: [] };
  // WIDTHS first: each a share of the root it names (of), else of the box's width
  // the group that rests on a base: the roots above the first root that rests (cut) once a loop has come
  const iRest = decl.spine.findIndex((r, i) => r.join === 'cut' && decl.spine.slice(0, i).some(q => q.kind === 'loop')), inGroup = i => iRest > 0 && i < iRest;
  const byId = {}; const walk = L => L.forEach(r => r.side ? r.side.forEach(walk) : (byId[r.id] = r)); walk(decl.spine);
  // not mirrored: a root off the middle (a loop on a wall, a group beside another, an end post, a lean), and blocks turned off the
  // grid (its corners fall on the axis, where the mirror's seam would cut a round in two); a turned root is drawn whole, centred
  const asymRoot = r => r.side || (r.kind === 'loop' && r.at !== 'top') || r.at === 'left' || r.at === 'right' || r.lean != null || (r.kind === 'blocks' && !!r.turn);
  const symmetric0 = !decl.spine.some(asymRoot);
  // LANDED BEFORE IT IS DRAWN: in a symmetric icon (its centre on a whole px) a straight root's width lands by the snap priority
  // (its ends to a whole px within 1/4px, else the nearest iPhone pixel), and an overhang lands on the grid, so a bevel or a join
  // drawn on them is drawn whole and the landing never stretches it
  const landHalf = hF => { const p = hF * k, w = Math.round(p); return (Math.abs(p - w) <= 0.25 + 1e-9 ? w : Math.round(p * 3) / 3) / k; };
  const landGrid = vF => { const q = vF * k * 3, fl = Math.floor(q + 1e-9); return (q - fl > 0.5 + 1e-9 || (Math.abs(q - fl - 0.5) < 1e-9 && TIE_UP) ? fl + 1 : fl) / 3 / k; };
  const wOf = id => { const r = byId[id], w = (r.of ? wOf(r.of) : key[0]) * (r.w ?? 1); return LANDING.on && symmetric0 && (r.kind === 'slab' || r.kind === 'gable') ? 2 * landHalf(w / 2 * u) / u : w; };
  const OVER = LANDING.on && symmetric0 ? landGrid(PROP.joins.over * t.stroke) : PROP.joins.over * t.stroke;
  // a row's height is a share of the span as drawn (its root's proportion); landing moves edges only
  const rawSpan = slab => { const was = LANDING.on; LANDING.on = false; const w = wOf(slab.r.id) * u; LANDING.on = was; return w - 2 * PROP.joins.over * t.stroke; };
  const placed = {}, out = [];   // out: every placed root in spine order (R: { r, prims, box (units), ... })
  let prev = null, yTop = null, yBot = null;
  const ctx = { placed, H, get prev() { return prev; }, get top() { return yTop; }, get bot() { return yBot; }, wOf: id => wOf(id),
    endPost: (of, side) => decl.spine.some(q => q.kind === 'post' && q.of === of && q.at === side) };
  const below = (r, prevR) => !prevR ? 0 : r.join === 'cut' ? Math.ceil((prevR.box.bot * u + t.cut) * 3 - 1e-6) / 3 : prevR.box.bot * u;
  for (let i = 0; i < decl.spine.length; i++) {
    const r = decl.spine[i], next = decl.spine[i + 1];
    if (r.side) { const G = columns(r, prev ? prev.box.bot : 0); out.push(G); prev = G; continue; }
    const topF = below(r, prev), cx = 6 + (gdx != null && inGroup(i) ? gdx / u : 0);
    let R;
    if (r.kind === 'post' && r.at) R = KINDS.endPost(r, {}, t, u, ctx);
    else if (r.kind === 'post' && r.lean != null) R = KINDS.lean(r, {}, t, u, ctx);
    else if (['spokes', 'splay', 'drape', 'block', 'ring', 'disc', 'knot', 'blocks'].includes(r.kind)) R = KINDS[r.kind](r, { cx, w: ['spokes', 'splay', 'drape'].includes(r.kind) ? 0 : wOf(r.id), top: topF / u, topF }, t, u, ctx);
    else if (r.kind === 'post') {
      // a post: into the face above by a stroke and into the root below by half its stroke (a fillet each end), showing what its
      // declaration says (a share of a root's depth, or a stroke under the root above), or to the box's bottom
      // (a post showing a share of its root, or a stroke, is never longer than what it holds: What carries the read leaves it)
      const show = r.show === 'stroke' ? t.stroke : r.show != null ? r.show * placed[r.showOf].depth * u : null;
      const end = show == null ? H * u : topF + show, botF = next ? end + t.stroke / 2 : end;
      R = KINDS.post(r, { cx, topF: topF - (prev ? t.stroke : 0), botF }, t, u); R.box.bot = end / u;
    } else if (r.kind === 'tiers') R = KINDS.tiers(r, { cx, w: wOf(r.id), top: 0, bot: H - (next && next.show === 'stroke' ? t.stroke / u : 0) }, t, u);
    else if (r.kind === 'loop') R = KINDS.loop(r, {}, t, u, placed[r.of]);
    else if (r.kind === 'row') R = rowUnder(r, topF, prev, next);
    else if (r.kind === 'slab' && (r.join === 'held' || (next && next.join === 'held'))) {
      const w = wOf(r.id); R = { held: true, topF, prims: [], box: { x0: cx - w / 2, x1: cx + w / 2, top: topF / u, bot: (topF + t.stroke) / u } };
    } else R = KINDS[r.kind](r, { cx, w: wOf(r.id), top: topF / u, topF }, t, u);
    R.r = r; R.depth = R.depth ?? (R.box.bot - R.box.top); placed[r.id] = R; out.push(R);
    // what lands with what: a root's own counters (a band) and a loop with its counter move with the root they are cut in or sit on
    if (R.prims[0]) R.prims[0] = { ...R.prims[0], rid: r.id };
    // a part drawn from a curved root (a loop on its wall, spokes or a splay from a ring's centre) moves with that root on the grid
    R.prims = R.prims.map((p, j) => r.kind === 'loop' || ((r.kind === 'splay' || r.kind === 'spokes') && placed[r.of] && placed[r.of].centre) ? { ...p, withRoot: r.of } : j > 0 && p.cut ? { ...p, withRoot: r.id } : p);
    yTop = yTop == null ? R.box.top : Math.min(yTop, R.box.top); yBot = yBot == null ? R.box.bot : Math.max(yBot, R.box.bot);
    if (r.kind === 'loop') meta.loops.push({ id: r.id }); else if (!R.noStack) prev = R;
    if (R.prims.some(p => p.role === 'band')) meta.bands.push({ id: r.id, band: t.band * k, stroke: Z.stroke });
  }
  // a ROW of posts under a held slab: the row rule across the slab's width less its overhang (a third of a line each side, the
  // chamfer's); the posts stand h of the row's span tall, to the lattice
  function rowUnder(r, topF, slab, next) {
    const over = OVER, slabW = (slab.box.x1 - slab.box.x0) * u, span = slabW - 2 * over;
    const Rw = S.row({ span, w: t.part, wMin: t.min, n: r.n, min: t.counter, grid: t.grid, exact: true });
    const pl = T3(topF + r.h * rawSpan(slab)), xa = 6 * u - Rw.span / 2, gp = Rw.n > 1 ? (Rw.span - Rw.n * Rw.w) / (Rw.n - 1) : 0, posts = [];
    for (let j = 0; j < Rw.n; j++) posts.push(E.R(xa + j * (Rw.w + gp), topF - 0.01, Rw.w, pl - topF + 0.02, { root: 'POST', role: 'row', group: r.id }));
    const ov = (slabW - Rw.span) / 2;
    meta.rows.push({ id: r.id, declared: r.n, n: Rw.n, w: +(Rw.w * k).toFixed(3), gap: +(gp * k).toFixed(3), onGrid: Rw.grid, span: +(Rw.span * k).toFixed(3), rootSpan: +(span * k).toFixed(3), over: +(ov * k).toFixed(3), thinned: Rw.w < t.part - 1e-9, closed: !!(next && next.join === 'held'), hPx: +((pl - topF) * k).toFixed(3) });
    return { prims: posts, box: { x0: xa / u, x1: (xa + Rw.span) / u, top: topF / u, bot: pl / u }, row: { xa, w: Rw.w, span: Rw.span, over: ov } };
  }
  // COLUMNS side by side, a cut between, tops at the top and bottoms at the box's bottom. Their widths are fixed widths (a comb's
  // tines and slots, posts, a blade's handle and protrusion), so they don't scale with the size: the comb takes the room the box
  // leaves after the rest (the comb rule)
  function columns(g, yTop) {
    const topF = yTop * u, botF = H * u, cols = g.side, prims = [];
    const fixedOf = sp => sp.some(q => q.kind === 'blade') ? t.part + t.protrude : sp.some(q => q.kind === 'comb') ? null : t.part;
    const fixed = cols.map(fixedOf), combCol = cols.findIndex(sp => sp.some(q => q.kind === 'comb'));
    const others = fixed.reduce((a, w) => a + (w || 0), 0) + (cols.length - 1) * t.cut;
    let C = null;
    if (combCol >= 0) { const cr = cols[combCol].find(q => q.kind === 'comb');
      C = S.comb({ n: cr.n, w: t.part, wMin: t.min, span: room - others, grid: t.grid });
      fixed[combCol] = C.span; meta.combs.push({ id: cr.id, declared: cr.n, n: C.n, w: +(C.w * k).toFixed(3), slot: +(C.slot * k).toFixed(3), span: +(C.span * k).toFixed(3), room: +((room - others) * k).toFixed(3), thinned: C.thinned }); }
    const total = fixed.reduce((a, w) => a + w, 0) + (cols.length - 1) * t.cut;
    let x = 6 * u - total / 2, headBot = null, head = null;
    cols.forEach((sp, ci) => {
      const wc = fixed[ci]; let yy = topF;
      sp.forEach((r, j) => {
        if (r.kind === 'comb') {   // the tines, one width with the slots between them
          // WHAT CARRIES THE READ: a plain part under it (a post to the bottom) keeps the master's proportion to what it holds; where
          // this size has drifted it past the master's by more than the drift, the plain part gives height back until they match
          let hc = topF + r.h * H * u;
          const hd = sp[j + 1] && sp[j + 1].kind === 'head', rxh = wc / 2, ryh = hd ? Math.max(1.05 * rxh, Math.sqrt(rxh / FAIR_K)) : 0;
          if (sp.slice(j + 1).some(q => q.kind === 'post' && q.show == null)) {
            const plain = botF - hc - ryh, held = hc - topF + ryh, ratio = plain / held, M = (Z.master || []).find(q => q.id === r.id);
            const want = M ? M.ratio : null, need = want != null && ratio > want * (1 + (Z.drift || 0)) + 1e-9;
            const give = need ? plain - (plain + held) * want / (1 + want) : 0;
            meta.read = (meta.read || []).concat({ id: r.id, ratio: +ratio.toFixed(3), master: want, need, took: +(give * k).toFixed(3), now: +((plain - give) / (held + give)).toFixed(3) });
            hc += give;
          }
          for (let q = 0; q < C.n; q++) prims.push(E.R(x + q * 2 * C.w, topF, C.w, hc - 0.1 - topF, { root: 'POST', role: 'comb', group: 'comb' }));
          yy = hc;
        } else if (r.kind === 'head') {
          // a half ellipse under what runs into it, as wide: as tall as the fair limit lets a line run into it at its widest point
          const rx = wc / 2, ry = Math.max(1.05 * rx, Math.sqrt(rx / FAIR_K)), cx = x + rx;
          prims.push({ withGroup: 'comb', ...E.D(`M${f(cx - rx)} ${f(yy - 0.3)}V${f(yy)}C${f(cx - rx)} ${f(yy + ry * K)} ${f(cx - rx * K)} ${f(yy + ry)} ${f(cx)} ${f(yy + ry)}C${f(cx + rx * K)} ${f(yy + ry)} ${f(cx + rx)} ${f(yy + ry * K)} ${f(cx + rx)} ${f(yy)}V${f(yy - 0.3)}Z`), root: 'ELLIPSE' });
          // THE SLOTS (cut once the comb has landed, in asOne): they follow the head's curve, see the comb depth rule there
          if (C && sp[j - 1] && sp[j - 1].kind === 'comb' && C.n > 1) { const cm = meta.combs[meta.combs.length - 1]; prims.forEach(p => { if (p.group === 'comb') { p.slotDeep = true; p.slotMeta = cm; } }); }
          yy += ry; headBot = yy; head = { rx, ry };
        } else if (r.kind === 'blade') {
          // a straight spine, its edge a quarter ellipse, down to where the column beside it ends its head (else half the height);
          // it stands past its handle by the protrusion
          const ke = headBot ?? (topF + (botF - topF) / 2), ry = ke - topF;
          prims.push({ ...E.D(`M${f(x)} ${f(topF)}C${f(x + wc * K)} ${f(topF)} ${f(x + wc)} ${f(ke - ry * K)} ${f(x + wc)} ${f(ke)}H${f(x)}Z`), root: 'ELLIPSE', role: 'blade' });
          meta.protrusions.push({ id: r.id, past: +((wc - t.part) * k).toFixed(3), min: Z.protrude });
          yy = ke;
        } else if (r.kind === 'post') {   // a handle: under its head's centre (or flush with the spine above), to the bottom
          // centred under a head it takes the head's parity (one iPhone pixel wider when they differ), so it stays exactly centred
          // it runs into the head past where the head's curve crosses its sides
          const afterHead = sp[j - 1] && sp[j - 1].kind === 'head';
          const pw = afterHead && (Math.round(wc / t.grid) - Math.round(t.part / t.grid)) % 2 ? t.part + t.grid : t.part;
          const ov = afterHead ? 0.4 + head.ry * (1 - Math.sqrt(Math.max(0, 1 - (pw / 2 / head.rx) ** 2))) : 0.2;
          if (pw !== t.part) meta.parity = (meta.parity || []).concat({ id: r.id, w: +(pw * k).toFixed(3) });
          prims.push(E.R(afterHead ? x + wc / 2 - pw / 2 : x, yy - ov, pw, botF - yy + ov, { root: 'POST' }));
          yy = botF;
        }
      });
      x += wc + t.cut;
    });
    const x0 = 6 * u - total / 2;
    return { r: g, prims, box: { x0: x0 / u, x1: (x0 + total) / u, top: yTop, bot: H } };
  }
  // HELD SLABS, drawn once the row under or over each is placed: past each outer post the slab's near face drops a step and the post
  // flares into it (the chamfer, joins.js heldSlab); a slab with no row is plain
  out.forEach((R, i) => {
    if (!R.held) return;
    const up = out[i + 1] && out[i + 1].row ? out[i + 1] : null, dn = out[i - 1] && out[i - 1].row ? out[i - 1] : null, rowR = up || dn;
    const x0 = R.box.x0 * u, x1 = R.box.x1 * u, by = R.topF + t.stroke;
    if (!rowR) { R.prims = [E.R(x0, R.topF, x1 - x0, t.stroke, { root: 'SLAB' })]; return; }
    const face = Q => Q ? { l: Q.row.xa, r: Q.row.xa + Q.row.span, w: Q.row.w, c: Math.min(Q.row.over, OVER) } : null;
    R.prims = [chamfered({ x0, x1, yT: R.topF, yB: by, top: face(dn), bot: face(up) })];   // the row above holds the top face, the row below the bottom
    meta.chamfers.push({ id: R.r.id, over: +(rowR.row.over * k).toFixed(3), size: +(Math.min(rowR.row.over, OVER) * k).toFixed(3) });
  });
  let prims = out.flatMap(R => R.prims);
  // an asymmetric group (it carries a loop) resting on a base: its ink centre over the base's centre
  const iBase = out.findIndex((R, i) => i > 0 && R.r.join === 'cut' && out.slice(0, i).some(q => q.r.kind === 'loop'));
  if (iBase > 0 && gdx == null) {
    const grp = out.slice(0, iBase).flatMap(R => R.prims), m = measure(E.build(grp).d);
    return layout(decl, s, Z, S, room, s / 2 - m.cx);
  }
  const symmetric = !out.some(R => asymRoot(R.r) || R.asym);
  return { prims, meta, symmetric };
}

// ---------------------------------------------------------------------------------------------------------------------------
// THE PIPELINE (as construction.js did for v264, by class and kind, never by name)
const EASE = 2.3;
const JOIN10 = { ease: EASE, trim: 1.4, ends2: 1.5, fair: true, hillKeep: 'depth', tipKeep: 'crest', tipLand: true, tipPow: 1, tipSoft: PROP.transition.tipSoft, noReverse: true, maxPieces: 2, arcEase: true, arcRamp: 0.3, flareLean: PROP.transition.flareLean };
const LAW = fromTable(PROP.rounds.shaped), LINE_LAW = fromTable(PROP.rounds.line), FK = 11 / 12;
const r3 = v => Math.round(v * 3) / 3, r4 = v => Math.round(v * 4) / 4;
const opticalY = m => m.box.cy - 0.5 * Math.max(0, m.box.cy - m.cy);

function make(decl, Z, S, opts = {}) {
  const apex = decl.spine.some(r => r.kind === 'gable' || r.kind === 'tiers') ? APEX : 0;
  const law = rack(LAW, 1), bopts = { law, tightHoles: true, ease: EASE, join: JOIN10 }, fast = { ...bopts, join: { ...JOIN10, fair: false } };
  // the box: never past the icon's v264 size by more than one iPhone pixel a side (opts.v264: its bounds), else the class's cut
  let cls = decl.cls.toUpperCase();
  const room = () => opts.v264 ? opts.v264.w + 2 / 3 / Z.k : KEY[cls][0] * FK;
  let L;
  const dr = s_ => { L = layout({ ...decl, cls }, s_, Z, S, room()); return L.prims; };
  const bx = s_ => measure(E.build(dr(s_), fast).d).box;
  // THE FIT: the largest size whose box fits the class's cut, by the sides that scale (a side made only of fixed widths, strokes,
  // parts and cuts, doesn't grow with the size: the box rule holds it instead)
  const b1 = bx(12), b2 = bx(13.2), grows = (a, b) => (b - a) > 0.05 * a;
  const gW = grows(b1.x1 - b1.x0, b2.x1 - b2.x0), gH = grows(b1.y1 - b1.y0, b2.y1 - b2.y0);
  const cut = c => [KEY[c][0] * FK, (KEY[c][1] + apex) * FK];
  const fitK = (b, c) => { const [kw, bh] = cut(c); return Math.min(gW ? kw / (b.x1 - b.x0) : Infinity, gH ? bh / (b.y1 - b.y0) : Infinity); };
  // THE CLASS by the drawing's proportion at its fitted size (as v264: px parts don't scale, so a drawing reads squatter small)
  const diamond = cls === 'DIAMOND';
  if (gW && gH && !diamond) { const c0 = cls; let s_ = 12; for (let i = 0; i < 4; i++) s_ *= fitK(bx(s_), c0);
    const b = bx(s_), a = (b.x1 - b.x0) / (b.y1 - b.y0); let bd = 1e9;
    for (const c of ['WIDE', 'SQUARE', 'TALL']) { const dd = Math.abs(Math.log(a / (KEY[c][0] / (KEY[c][1] + apex)))); if (dd < bd) { bd = dd; cls = c; } } }
  const [kw, bh] = cut(cls);
  let s = 12;
  if (diamond) {   // a diamond class box: the largest size whose ink reaches no further across the diamond than its half diagonal
    const Lc = KEY.DIAMOND[0] / 2 * FK, reach = (s_, o) => measure(E.build(dr(s_), o).d).l1;
    for (let i = 0; i < 6; i++) s *= Lc / reach(s, i < 4 ? fast : bopts);
    if (reach(s, bopts) > Lc + 1e-3) { let lo = s * 0.9, hi = s; for (let i = 0; i < 20; i++) { const m = (lo + hi) / 2; if (reach(m, bopts) <= Lc + 1e-3) lo = m; else hi = m; } s = lo; }
  } else { for (let i = 0; i < 6; i++) { const b = measure(E.build(dr(s), i < 4 ? fast : bopts).d).box; s *= fitK(b, cls); if (process.env.FITDBG) console.error("fit", i, s, b); } }
  if (!diamond) { const fits = (s_, full) => { const b = full ? measure(E.build(dr(s_), bopts).d).box : bx(s_); return { ok: (!gW || b.x1 - b.x0 <= kw + 1e-3) && (!gH || b.y1 - b.y0 <= bh + 1e-3), touch: (gW && Math.abs(b.x1 - b.x0 - kw) < 5e-3) || (gH && Math.abs(b.y1 - b.y0 - bh) < 5e-3) }; };
    const f0 = fits(s, true); if (!(f0.ok && f0.touch)) { let lo = f0.ok ? s : s * 0.9, hi = f0.ok ? s * 1.1 : s; for (let i = 0; i < 24; i++) { const m = (lo + hi) / 2; if (fits(m).ok) lo = m; else hi = m; } s = lo; } }
  { const cs = E.clearSteps(dr, s); if (cs.s !== s) s = cs.s; }
  // PLACE: optically centred (x by the box and the ink centre together; y by the optical rule), offsets to 1/1000
  LANDING.on = true; const ox = (24 - s) / 2, oy = r3((24 - s) / 2), prims0 = dr(s); LANDING.on = false; const meta = L.meta, symmetric = L.symmetric, m = measure(E.build(E.xform(prims0, 1, 0, 0, ox, oy), bopts).d);
  let tx = r4(12 - (m.box.cx + m.cx) / 2), ty = E.placeOffset(oy + 12 - opticalY(m));
  // the box always holds: the optical move stops where an edge would pass the icon's v264 size by half an iPhone pixel (the other
  // half is the landing's)
  if (opts.v264) { const g = 1 / 6 / Z.k, V = opts.v264, cl = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
    ty = E.placeOffset(cl(ty, V.y0 - g - (m.box.y0 - oy), V.y1 + g - (m.box.y1 - oy)));
    if (!symmetric) tx = cl(tx, V.x0 - g - m.box.x0, V.x1 + g - m.box.x1); }
  const sym = symmetric ? ox + tx + s / 2 : undefined;
  let prims = E.xform(prims0, 1, 0, 0, ox + tx, ty);
  // LAND the roots on the iPhone grid before any corner is rounded; a row or a comb lands as one (below)
  if (opts.land) prims = asOne(prims, opts.land(prims, sym), Z);
  const AB = apexBuild(prims, { ...bopts, sym }, Z.k, Z.stroke), d = AB.d; if (AB.apex) meta.apex = AB.apex;
  return { d, s, sym: sym ?? null, meta: { ...meta, cls, s: +s.toFixed(4), fitBy: diamond ? 'the diamond' : gW && gH ? 'both sides' : gW ? 'width' : 'height' }, prims };
}

// A ROW OR A COMB LANDS AS ONE: its outer sides where the grid put them, its parts at their one width and the spaces between them
// equal (a comb: as wide as its parts), so the landing never makes one counter or tine differ from the next
function asOne(before, after, Z) {
  const paper = require(path.join(process.env.TOOLS, 'node_modules/paper/dist/paper-core.js')), bb = d => { const it = new paper.CompoundPath(d), b = it.bounds; it.remove(); return b; };
  const out = after.slice();
  const groups = [...new Set(before.filter(q => q.group).map(q => q.group))];
  for (const gid of groups) {
    const idx = before.map((q, i) => q.group === gid ? i : -1).filter(i => i >= 0); if (idx.length < 2) continue;
    const role = before[idx[0]].role;
    const B = idx.map(i => bb(after[i].d)), w0 = before[idx[0]].w, x0 = Math.min(...B.map(b => b.x)), x1 = Math.max(...B.map(b => b.x + b.width)), n = idx.length;
    const w = w0, gap = role === 'comb' ? w : (x1 - x0 - n * w) / (n - 1);
    idx.forEach((i, j) => { const b = B[j], x = x0 + j * (w + gap); out[i] = { ...after[i], d: `M${f5(x)} ${f5(b.y)}H${f5(x + w)}V${f5(b.y + b.height)}H${f5(x)}Z`, how: 'landed as one ' + role }; });
  }
  // a root drawn on a comb's width (its head) moves across with the comb as it landed (its own landing kept up and down)
  before.forEach((q, i) => {
    if (!q.withGroup) return;
    const idx = before.map((p, j) => p.group === q.withGroup ? j : -1).filter(j => j >= 0); if (!idx.length) return;
    const span = L => { const B = L.map(d => bb(d)); return [Math.min(...B.map(b => b.x)), Math.max(...B.map(b => b.x + b.width))]; };
    const [a0, a1] = span(idx.map(j => E.parts([before[j]])[0].d)), [b0, b1] = span(idx.map(j => out[j].d)), sx = (b1 - b0) / (a1 - a0);
    const own = bb(E.parts([q])[0].d), landed = bb(after[i].d), it = new paper.CompoundPath(E.parts([q])[0].d);
    it.scale(sx, landed.height / own.height, new paper.Point(a0, own.y)); it.translate(new paper.Point(b0 - a0, landed.y - own.y));
    out[i] = { ...after[i], d: it.pathData, how: 'moved with its comb' }; it.remove();
  });
  // a counter cut in a root (an inner band), and a loop on a root with its counter, move with that root: the same scale and move the
  // landing gave the root
  before.forEach((q, i) => {
    if (!q.withRoot) return;
    const pi = before.findIndex(p => p.rid === q.withRoot); if (pi < 0) return;
    let a = bb(E.parts([before[pi]])[0].d), b = bb(after[pi].d), sx = b.width / a.width, sy = b.height / a.height;
    // a curved part is never stretched: on a root the grid stretched (a straight root takes the map), it takes the root's scale
    // across, evenly (10-30)
    if (Math.abs(sx - sy) > 1e-3 && /[cC]/.test(E.parts([q])[0].d)) sy = sx;
    const it = new paper.CompoundPath(E.parts([q])[0].d);
    it.scale(sx, sy, new paper.Point(a.x, a.y)); it.translate(new paper.Point(b.x - a.x, b.y - a.y));
    out[i] = { ...after[i], d: it.pathData, how: 'moved with its root' }; it.remove();
  });
  // A COMB'S SLOTS cut on past its tines into the root it runs into (a head), between the tines as they landed. A cut into a curved
  // root follows the curve, moved in by the wall, and the wall is the tine's own width, so the outer tine runs on round the head as
  // one even band. A cut stops where the part starts to turn (its curve moved in has turned 22.5 degrees, half the chamfer's 45);
  // there it is a floor, and a floor runs flat, on the nearest iPhone pixel line, never leaving less than a line under it.
  // The curve is the round moved in (one arc, so the engine eases it in from the straight side with no step in curvature).
  const tn = before.map((q, i) => q.slotDeep ? i : -1).filter(i => i >= 0), hi = before.findIndex(q => q.withGroup === 'comb' && q.root === 'ELLIPSE');
  if (tn.length > 1 && hi >= 0) {
    const T = tn.map(i => bb(out[i].d)).sort((a, b) => a.x - b.x), cm = before[tn[0]].slotMeta, g = (1 / 3) / Z.k, line = Z.stroke / Z.k;
    const H = bb(out[hi].d), cx = H.x + H.width / 2, cy = H.y + 0.3, rx = H.width / 2, ry = H.y + H.height - cy, wall = T[0].width;
    const yb = Math.max(...T.map(b => b.y + b.height)), bot = H.y + H.height, ri = rx - wall;
    // the cut stops where the part starts to turn: its curve moved in has turned a quarter of a right angle (22.5 degrees, half
    // the chamfer's); it never runs down into the turn, so the part keeps its mass
    const capY = Math.min(Math.round((cy + ri * Math.sin(Math.PI / 8)) / g) * g, Math.floor((bot - line) / g + 1e-6) * g);
    const inner = new paper.Path.Circle({ center: [cx, cy], radius: ri, insert: false });
    let deepest = yb;
    for (let j = 0; j + 1 < T.length; j++) {
      const x0 = T[j].x + T[j].width, x1 = T[j + 1].x;
      const box = new paper.Path.Rectangle({ from: [x0, yb - 0.3], to: [x1, capY], insert: false });
      const above = new paper.Path.Rectangle({ from: [x0, yb - 0.3], to: [x1, cy], insert: false });
      // the curve moved in must be rounder than a line to be followed; tighter, it kinks (curvature first): the cut stays square
      const room = ri * Z.k > Z.stroke + 1e-6 ? inner.unite(above, { insert: false }) : box.clone({ insert: false }), cutP = box.intersect(room, { insert: false });
      deepest = Math.max(deepest, cutP.bounds.y + cutP.bounds.height);
      out.push({ t: 'D', d: cutP.pathData, cut: true, root: 'SLOT', how: 'the comb\'s slot, following its root\'s curve until the root starts to turn (22.5 degrees), then flat' });
      [box, above, room, cutP].forEach(q => q.remove());
    }
    inner.remove();
    const tineTop = Math.min(...T.map(b => b.y));
    if (cm) { cm.slotDepth = +((deepest - tineTop) * Z.k).toFixed(3); cm.past = +((deepest - cy) * Z.k).toFixed(3); cm.bridge = +((bot - deepest) * Z.k).toFixed(3); cm.wall = +(wall * Z.k).toFixed(3); cm.follows = ri * Z.k > Z.stroke + 1e-6; cm.curvePx = +(ri * Z.k).toFixed(3); }
  }
  // SNAP PRIORITY, a point level with an outer edge: a part whose curve or point was drawn on the same line as a straight outer edge
  // goes to the line that edge landed on, its other end staying landed, so landing never parts what was drawn level
  const pre = before.map(q => { try { return bb(E.parts([q])[0].d); } catch (e) { return null; } });
  const ends = (b, end) => end === 'top' ? b.y : b.y + b.height;
  before.forEach((q, i) => {
    if (q.root === 'POST' || q.cut || !pre[i] || q.root === 'SLOT') return;
    for (const end of ['top', 'bot']) {
      const j = before.findIndex((p, jj) => jj !== i && p.root === 'POST' && pre[jj] && Math.abs(ends(pre[jj], end) - ends(pre[i], end)) < 1e-3); if (j < 0) continue;
      const line = ends(bb(out[j].d), end), b = bb(out[i].d); if (Math.abs(ends(b, end) - line) < 1e-4) return;
      // its point is drawn to the line along its own height; its other end stays where it landed (on the grid)
      const pin = end === 'top' ? b.y + b.height : b.y, it = new paper.CompoundPath(out[i].d);
      it.scale(1, Math.abs(pin - line) / b.height, new paper.Point(b.x, pin));
      out[i] = { ...out[i], d: it.pathData, how: (out[i].how || '') + '; its ' + end + ' drawn to the edge it was level with' }; it.remove();
      return;
    }
  });
  return out;
}

// LINE MARKS: one root of a kind (star, cross), drawn in its own app box; the class sets its size (outline: the counter at least
// 2 1/2 lines across; open: the arms span the coin)
function mark(decl, opts = {}) {   // opts.land: { size, std } the line class's landing (system.js MARK), for curvature first
  const root = decl.spine[0], W = P7.W;
  if (root.kind === 'star') {
    const OUTLINE_HOLE = PROP.line.outlineCounter, rc0 = (OUTLINE_HOLE * W / 2 + (W / 2) / Math.sin(3 * Math.PI / 10)) / P7.STAR.ri, rc = rc0 * 24 / 20 / 9.6;
    const prims = P7.star(20, rc, W, 'root'), law = scaled(LINE_LAW, 24 / 20);
    // shown in its 18px box: 3/4px a unit; the line 1 1/2px on screen
    const ok = opts.land ? (() => { const OS = require('./one-side.js'), fair = require('./fair-check.js'), jn = require('./join-check.js');
      return d => { const dl = shiftD(d, E.placeOffset(12 - opticalY(measure(d)))), L = OS.land(dl, { size: opts.land.frame, sym: 12, std: opts.land.std }).d; return fair.check(L).length + jn.check(L).length === 0; }; })() : null;
    const AB = apexBuild(prims, { law, ease: EASE, tightHoles: true, join: JOIN10 }, 18 / 24, 1.5, ok), d0 = AB.d, m = measure(d0), dy = E.placeOffset(12 - opticalY(m));
    return { d: shiftD(d0, dy), sym: 12, meta: { cls: 'OUTLINE', apex: AB.apex }, prims, dy };
  }
  const sc = KEY.OPEN[0] / 14, prims = P7.plus(26.4, sc, 5 / 3), law = scaled(LINE_LAW, 24 / 26.4);
  const d0 = E.build(prims, { law, ease: EASE, join: JOIN10 }).d, m = measure(d0), dy = E.placeOffset(12 - opticalY(m));
  return { d: shiftD(d0, dy), sym: 12, meta: { cls: 'OPEN' }, prims, dy };
}
const shiftD = (d, dy) => { let k = 0; return d.replace(/[MLCZ]|-?\d*\.?\d+(?:e-?\d+)?/g, t => { if (/[MLCZ]/.test(t)) { k = 0; return t; } const v = (k++ % 2) ? (+t + dy).toFixed(7).replace(/\.?0+$/, '').replace(/^-0$/, '0') : t; return v; }).replace(/([0-9])(-)/g, '$1 $2'); };

// POINTS (10-28). A point (a convex corner under 75 degrees) is one of two kinds, told by its two sides:
//   an APEX: its sides mirror each other (a gable's or a tier's top, a star's points). It reads by its CREST, the radius at its
//     nose on screen, a fifth of the line at every size (0.3px at 18), however its sides arrive: straight sides that meet a round
//     leave a smaller crest than curved sides easing in, so the round is sized until the crest reads a fifth of a line.
//   a TIP: its sides differ (a tier's eave, a blade's tip). The tip rule: broken by its edge, not milled; its round scales with it.
const APEX_CREST = 1 / 5, APEX_SYM = 0.03;
const isApex = c => c.convex && !c.hole && c.angle < 75 && Math.abs(c.lin - c.lout) <= APEX_SYM * Math.max(c.lin, c.lout);
function crestAt(d, pt) {   // the smallest radius of curvature within a unit of the corner's point (its nose), in drawing units
  const paper = require(path.join(process.env.TOOLS, 'node_modules/paper/dist/paper-core.js'));
  const cp = new paper.CompoundPath(d), P = new paper.Point(pt[0], pt[1]); let best = Infinity;
  for (const p of (cp.children.length ? cp.children : [cp])) for (let o = 0; o < p.length; o += 0.005) { const q = p.getPointAt(o); if (q.getDistance(P) < 1.5) { const K = Math.abs(p.getCurvatureAt(o)); if (K > 1e-6) best = Math.min(best, 1 / K); } }
  cp.remove(); return best;
}
// build with every apex sized by its crest: pxPerUnit converts the drawing to screen px; line: the line on screen (px)
function apexBuild(prims, bopts, pxPerUnit, line, ok = null) {   // ok(d): curvature first: a larger round that lands with a fault is too far
  const want = APEX_CREST * line / pxPerUnit, base = bopts.law;
  const at = m => {
    const seen = [];
    const law = c => { const r = base(c); if (isApex(c) && typeof r === 'number') { if (!seen.some(q => Math.hypot(q[0] - c.pt[0], q[1] - c.pt[1]) < 0.3)) seen.push(c.pt.slice()); return r * m; } return r; };
    const R = E.build(prims, { ...bopts, law }), cr = seen.map(pt => crestAt(R.d, pt)).filter(Number.isFinite);
    return { R, n: seen.length, crest: cr.length ? Math.min(...cr) : null };
  };
  let m = 1, A = at(1);
  // an apex that already reads a fifth of a line (or none) is left as drawn; else its round grows until its crest does
  if (A.n && A.crest != null && A.crest < 0.9 * want) {
    let lo = 1, hi = 4;
    for (let i = 0; i < 7; i++) { const mid = (lo + hi) / 2, B = at(mid); if (B.crest != null && B.crest < want && (!ok || ok(B.R.d))) lo = mid; else hi = mid; }
    m = lo; A = at(m);
  }
  return { ...A.R, apex: A.n ? { n: A.n, crestPx: A.crest != null ? +(A.crest * pxPerUnit).toFixed(3) : null, wantPx: +(want * pxPerUnit).toFixed(3), scale: +m.toFixed(3) } : null };
}
module.exports = { make, mark, layout, KINDS, RACK, rack, apexBuild, crestAt, isApex };
