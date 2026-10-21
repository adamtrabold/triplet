// Round g7: batch 1 REDRAWN to the owner's craft bar (owner, 10-19: "none of these are yet at the craft
// level i need the icons to be at -- the sizes of various parts of many of these are not yet optically
// pleasing, the rounding at various intersections feels wrong ... some of the choices inside of the icons
// don't make sense ... poor optical alignment inside of the badge ... none have the same optical weight").
// Owner: "i want them all to be focusing on best practices and principles for icon design".
// Each drawing names the principles it uses. Coordinates: the 12px box, y down (TOP 0, BASE 12);
// positions scale with s (12 = 2px of air, 12.75 = 1.5px); line widths do not.
// The box is the drawing box. WHERE the drawing sits in the badge is set by its optical centre
// (src/boards7.js, place()), not by the box: optical centring.
'use strict';
const { R, C, P, B, O, A, D, I, E, cut } = require('./engine.js');
const W = 1.5;      // a line, upright or diagonal (decided by the owner)
const WH = 4 / 3;   // a horizontal line, 1.333px: CONTRAST COMPENSATION (a horizontal reads heavier than
                    // an upright of the same width, so it is drawn about 10% thinner, as in type design)
                    // and PIXEL FITTING (4/3px is exactly 4 device pixels on a 3x phone, so a horizontal
                    // whose top sits on the 1/3px lattice has both edges crisp). Horizontal edges are
                    // placed on the 1/3px lattice; see boards7.js place().
const T = v => Math.round(v * 3) / 3;   // to the 1/3px lattice
const CUT = 1;      // a cut between touching parts
const f = v => +v.toFixed(3);

// ---- g7i: THE ROOT SHAPES (owner, 10-20: "how are we determining the root shape of the drawing? ... the
// saucer, the base of the coupe, the museum are all at their core different shapes ... we probably want to
// align across all icons"). Parts that do the same JOB are cut from the same root, in every icon:
//   SLAB   a horizontal bar, 4/3px thick, ends cut square (the law softens them): every BASE (saucer,
//          coupe foot, plinth) and every SPAN (the museum's beam). A base is what a thing stands on, so it
//          is the same flat slab everywhere, like the bed of a press.
//   POST   an upright bar, 1.5px: every stem, column, trunk and the arms of the +.
//   GABLE  a triangle on a flat base: every roof and every tier (the pediment, the tree's three tiers).
//   VESSEL a flat rim whose sides fall into one half-ellipse: every bowl (the cup, the coupe).
//   LOOP   a band of the line's width around a counter, its back a half circle: every handle (the cup's ear).
// Horizontal edges of slabs, rims, tier bases and liquid sit on the 1/3px lattice (Y), so they print crisp.
const SLAB = (x0, x1, y) => R(x0, y, x1 - x0, WH, { root: 'SLAB' });
const POST = (cx, y0, y1) => R(cx - W / 2, y0, W, y1 - y0, { root: 'POST' });
// a POST whose width runs w0 (top) to wm (middle) to w1 (bottom): the taper options' posts (g7k)
const POSTW = (cx, y0, y1, w0, wm, w1) => { const ym = (y0 + y1) / 2; return { ...P([cx - w0 / 2, y0], [cx + w0 / 2, y0], [cx + wm / 2, ym], [cx + w1 / 2, y1], [cx - w1 / 2, y1], [cx - wm / 2, ym]), root: 'POST' }; };
// THE TAPER OPTIONS (g7k; owner: "have the team come up with the rule and give me a version of icons following
// it and not following it"; "several options is fine, i just dont want to lose the no taper option"). Each is
// a making method; o.style picks one: 'none' (even 1.5px), 'punch', 'burin', 'woodcut'.
const FLARE = W + 0.5, FREE = 1;   // woodcut: a post 2px where it meets a mass; burin: a free end thins to 1px
// WOODCUT (g7l, director: "if the columns read as balusters, soften them by a rule"): a post is straight
// through its middle three fifths and widens only over the last fifth at each end that meets a mass; the
// widening grows with the post: 1/12 of its length in all (a 5px column gains about 0.4px, a short trunk
// less), so long posts don't pinch to a waist like a baluster. top/bot: does that end meet a mass?
const POSTF = (cx, y0, y1, top, bot) => {
  const L = y1 - y0, f = L / 12, z = L / 5, wt = W + (top ? f : 0), wb = W + (bot ? f : 0);
  return { ...P([cx - wt / 2, y0], [cx + wt / 2, y0], [cx + W / 2, y0 + z], [cx + W / 2, y1 - z], [cx + wb / 2, y1], [cx - wb / 2, y1], [cx - W / 2, y1 - z], [cx - W / 2, y0 + z]), root: 'POST' };
};
// g7af: a polygon with each corner rounded: the corner is trimmed by d along both edges (at most half of either
// edge) and joined by a cubic whose handles reach 0.55 of the way back to the corner
const roundPoly = (pts, d) => {
  const n = pts.length, seg = [];
  for (let i = 0; i < n; i++) {
    const P0 = pts[(i + n - 1) % n], P1 = pts[i], P2 = pts[(i + 1) % n];
    const l0 = Math.hypot(P1[0] - P0[0], P1[1] - P0[1]), l1 = Math.hypot(P2[0] - P1[0], P2[1] - P1[1]), dd = Math.min(d, l0 / 2, l1 / 2);
    const a = [P1[0] + (P0[0] - P1[0]) * dd / l0, P1[1] + (P0[1] - P1[1]) * dd / l0], b = [P1[0] + (P2[0] - P1[0]) * dd / l1, P1[1] + (P2[1] - P1[1]) * dd / l1];
    const h = 0.55, c1 = [a[0] + (P1[0] - a[0]) * h, a[1] + (P1[1] - a[1]) * h], c2 = [b[0] + (P1[0] - b[0]) * h, b[1] + (P1[1] - b[1]) * h];
    seg.push({ a, b, c1, c2 });
  }
  let s = `M${f(seg[0].b[0])} ${f(seg[0].b[1])}`;
  for (let i = 1; i <= n; i++) { const g = seg[i % n]; s += `L${f(g.a[0])} ${f(g.a[1])}C${f(g.c1[0])} ${f(g.c1[1])} ${f(g.c2[0])} ${f(g.c2[1])} ${f(g.b[0])} ${f(g.b[1])}`; }
  return s + 'Z';
};
const GABLE = (cx, apex, base, hw) => ({ ...P([cx, apex], [cx + hw, base], [cx - hw, base]), root: 'GABLE' });

// ---- g7n: THE LINE, three ways (owner, 10-20: "when i think no taper i think the interior would follow the
// exterior line -- eg monoweight stroke"; "a taper would be one thickness one place, another thickness at the
// other side of the line... with the middle following the same curvature of the context"). A line's OUTER
// edge is the shape; its inner edge runs at the line's width from it, and in a tapered row that width changes
// smoothly along the line while the inner edge keeps following the outer curve.
//   'mono'   MONOWEIGHT: every line the same 1.5px; every hole's inner edge a parallel offset of its outer edge.
//   'brush'  SIGN PAINTER'S FLAT BRUSH (road signs, banners): the brush is held flat, so a line is full (1.5px)
//            where it runs up and down and thin (1px) where it runs across, changing smoothly around a curve.
//   'settle' SETTLED INK (a screened banner, hung): ink settles downward, so a line is thin (1px) at its top
//            and full (1.5px) at its bottom, changing smoothly down its length.
const WMIN = 1;                                                     // a tapered line's thinnest: 2/3 of the line
const wBrush = ang => WMIN + (W - WMIN) * Math.abs(Math.sin(ang));  // ang: the line's direction
const wSettle = (y, y0, y1) => WMIN + (W - WMIN) * Math.max(0, Math.min(1, (y - y0) / (y1 - y0)));
// a vertical POST whose width runs w0 (top) to w1 (bottom), straight-sided, centred on cx
const POSTT = (cx, y0, y1, w0, w1) => ({ ...P([cx - w0 / 2, y0], [cx + w0 / 2, y0], [cx + w1 / 2, y1], [cx - w1 / 2, y1]), root: 'POST' });
// a horizontal slab's thickness per row: the flat brush makes every horizontal thin
const slabH = o => o.style === 'brush' ? WMIN : o.style === 'mono' ? W : WH;   // monoweight: every line 1.5px, bases too (director, turn 64)

// ---- g7i: THE TOKEN, how big each glyph is (owner: "address this at the grid level across all of them...
// i dont want to have to negotiate this all the time"; "ours should be specific to our app"). Ours: a glyph
// is struck like a token, a coin of 12px that sits in the badge's ring with 2px of air. Every glyph is
// fitted, by its shape, to a cut of that token with THE SAME AREA as the coin, so none reads bigger:
//   OUTLINE an outline mark (the Star: an outline means "not yet tapped"): the hull through its tips at
//          least the coin's area AND its hole at least two lines (3px) across at the centre; the larger wins
//          (boards7.js, starRc()). At 1.5px the hole decides.
//   ROUND  the coin itself, 12 across; a RADIAL mark is fitted by its hull: the pentagon
//          through its tips has the coin's area, so its tips reach 6.9px from its centre
//   SQUARE 10 2/3 square (area of the coin, on the 1/3px lattice): the coupe
//   WIDE   12 x 9 1/3: the cup, the museum
//   TALL   9 1/3 x 12: the tree
//   OPEN   a mark made only of lines (the +): its arms span the coin, 12, and every line is the full
//          1.5px (no thinner horizontals: an open mark has no mass to balance, so it would read light)
// A lone APEX (the pediment, the tree's tip) passes the cut by 1/2px, because a point shows less of itself.
// The fit is made by the grid (boards7.js, fitS()), never by hand: the drawing sets proportions, the
// class sets size. Sizes are px at the list step (badge 24, chip, row star, tag star); the + is drawn at
// its Float badge's step (its 24 viewBox shown at 26.4px).
const TOKEN = 12, APEX = 0.5;
const KEY = { ROUND: [12, 12], OUTLINE: [12, 12], SQUARE: [T(Math.sqrt(Math.PI * 36)), T(Math.sqrt(Math.PI * 36))], WIDE: [12, T(Math.PI * 36 / 12)], TALL: [T(Math.PI * 36 / 12), 12], OPEN: [12, 12] };
const CLASS = { cafe: ['WIDE', 0], bar: ['SQUARE', 0], museum: ['WIDE', APEX], nature: ['TALL', APEX], star: ['OUTLINE', 0], plus: ['OPEN', 0] };

const DRAW = {
  // CAFÉ. WIDE. A VESSEL with a LOOP for its ear, on a SLAB saucer. Counters that survive (owner: "why does
  // the coffee cup handle cut off on the bottom - it creates a narrow passage"): the ear's counter is closed
  // by the cup's straight inner wall.
  cafe(s = 12, o = { style: 'mono' }) {   // g7p: monoweight is the line (owner: "monoweigh is looking the best")
    // g7e: the bowl FLOWS into the ear's base in one tangent curve; cup and ear are ONE outline.
    // g7i: the saucer is a SLAB (was a tapered blade: a trapezoid, the owner's example).
    const u = s / 12, X = v => f(v * u), Y = v => T(v * u), K = 0.5523;
    const top = Y(1) / u, wall = 4.667, bot = Y(8) / u, l = 1.5, r = 8.25, mid = (l + r) / 2;
    const eR = 12 - 1 / 3;                                            // the ear's outer back
    const eb = top + 5 + 1 / 3, R_ = (eb - top) / 2, ex = eR - R_;     // ear: outer 5 1/3 tall, its back a half circle
    // g7p (owner: "the bottom right edge of the cup is completely broken"): since g7e the bowl's right side
    // was one S-curve from the handle's foot down to the bottom, so the bowl had no right wall or corner and
    // melted into a lump under the handle. Now the bowl is a VESSEL with both walls (the right one mirrors
    // the left), and the handle is its own LOOP laid over the right wall; the union meets in a join, which the
    // law rounds at 0.15 (inside tighter than outside).
    const bowlP = D(`M${X(l)} ${X(top)}H${X(r)}V${X(wall)}C${X(r)} ${X(bot - 1.167)} ${X(r - 1.25)} ${X(bot)} ${X(mid)} ${X(bot)}C${X(l + 1.25)} ${X(bot)} ${X(l)} ${X(bot - 1.167)} ${X(l)} ${X(wall)}Z`, { root: 'VESSEL' });
    const earP = D(`M${X(r - 0.75)} ${X(top)}H${X(ex)}C${X(ex + R_ * K)} ${X(top)} ${X(eR)} ${X(top + R_ - R_ * K)} ${X(eR)} ${X(top + R_)}C${X(eR)} ${X(top + R_ + R_ * K)} ${X(ex + R_ * K)} ${X(eb)} ${X(ex)} ${X(eb)}H${X(r - 0.75)}Z`, { root: 'LOOP' });
    const body = bowlP;
    const ct = top + WH / u, cb = eb - WH / u, cr = (cb - ct) / 2, cx = eR - W / u - cr;   // counter, its back a half circle
    const ci = r;                                                     // g7p: the hole starts at the bowl's wall, so the bowl keeps it
    const counter = cut(D(`M${X(ci)} ${X(ct)}H${X(cx)}C${X(cx + cr * K)} ${X(ct)} ${X(eR - W / u)} ${X(ct + cr - cr * K)} ${X(eR - W / u)} ${X(ct + cr)}C${X(eR - W / u)} ${X(ct + cr + cr * K)} ${X(cx + cr * K)} ${X(cb)} ${X(cx)} ${X(cb)}H${X(ci)}Z`));
    // g7y exploration, o.dome (H3): a base that holds something on a ring or a point is a DOME, the saucer too
    const sy = T(X(bot) + CUT), sh = slabH(o);
    // g7ak PLATE RULE (owner on v216: "the glass being on something so rounded as a plate feels off"): o.plate, a plate a
    // thing sits on: flat on top, its underside dropping o.plate px at the centre, so its ends keep the slab less that
    // (1/2 on a 1 1/2px slab: ends 1px); never a lens thinning to a point. A cup-only option, so the coupe's foot keeps its dome
    const saucer = typeof o.plate === 'number' ? D(`M0 ${f(sy)}H${f(s)}V${f(sy + sh - o.plate)}C${f(0.7 * s)} ${f(sy + sh + o.plate / 3)} ${f(0.3 * s)} ${f(sy + sh + o.plate / 3)} 0 ${f(sy + sh - o.plate)}Z`, { root: 'DOME' }) : o.saucerFlip ? D(`M0 ${f(sy)}C0 ${f(sy + 0.8 * sh)} ${f(0.3 * s)} ${f(sy + sh)} ${f(s / 2)} ${f(sy + sh)}C${f(0.7 * s)} ${f(sy + sh)} ${f(s)} ${f(sy + 0.8 * sh)} ${f(s)} ${f(sy)}Z`, { root: 'DOME' }) : typeof o.under === 'number' ? D(`M0 ${f(sy)}H${f(s)}V${f(sy + sh - o.under)}C${f(0.7 * s)} ${f(sy + sh + o.under / 3)} ${f(0.3 * s)} ${f(sy + sh + o.under / 3)} 0 ${f(sy + sh - o.under)}Z`, { root: 'DOME' }) : typeof o.dome === 'number' ? D(`M0 ${f(sy + sh)}V${f(sy + o.dome)}C${f(0.3 * s)} ${f(sy - o.dome / 3)} ${f(0.7 * s)} ${f(sy - o.dome / 3)} ${f(s)} ${f(sy + o.dome)}V${f(sy + sh)}Z`, { root: 'DOME' }) : o.dome ? D(`M0 ${f(sy + sh)}C0 ${f(sy + 0.2 * sh)} ${f(0.3 * s)} ${f(sy)} ${f(s / 2)} ${f(sy)}C${f(0.7 * s)} ${f(sy)} ${f(s)} ${f(sy + 0.2 * sh)} ${f(s)} ${f(sy + sh)}Z`, { root: 'DOME' }) : o.style === 'brush' || o.style === 'mono' ? R(0, sy, s, sh, { root: 'SLAB' }) : SLAB(0, s, sy);
    if (o.style === 'mono' || o.style === 'brush' || o.style === 'settle') {
      // the loop's wall at its top arm, its back and its bottom arm; the inner edge is two quarter curves that
      // follow the outer half circle, so the width changes smoothly from arm to back to arm
      const wT = o.style === 'mono' ? W : o.style === 'brush' ? WMIN : WMIN;
      const wK = o.style === 'mono' ? W : o.style === 'brush' ? W : (WMIN + W) / 2;
      const wB = o.style === 'mono' ? W : o.style === 'brush' ? WMIN : W;
      const cy = top + R_, iT = top + wT / u, iB = eb - wB / u, iK = eR - wK / u, ry1 = cy - iT, ry2 = iB - cy, rx = iK - ex;
      const hole = cut(D(`M${X(ci)} ${X(iT)}H${X(ex)}C${X(ex + rx * K)} ${X(iT)} ${X(iK)} ${X(cy - ry1 * K)} ${X(iK)} ${X(cy)}C${X(iK)} ${X(cy + ry2 * K)} ${X(ex + rx * K)} ${X(iB)} ${X(ex)} ${X(iB)}H${X(ci)}Z`));
      return [body, earP, saucer, hole];
    }
    if (o.style === 'punch') {
      // COUNTERPUNCH (g7m): the handle's hole is the ear's own outside shape made smaller, about the ear's
      // middle, so its wall is full (the line, at the arms) at the outer edge and thins toward the back
      // (about 1.1px); the hole is 1.57 x 2.23px, over the 1.5px minimum.
      const xc = (ci + eR) / 2, yc = top + R_, kk = 1 - (W / u) / R_, g = (x, y) => `${X(xc + (x - xc) * kk)} ${X(yc + (y - yc) * kk)}`;
      const hole = cut(D(`M${g(ci, top)}H${X(xc + (ex - xc) * kk)}C${g(ex + R_ * K, top)} ${g(eR, top + R_ - R_ * K)} ${g(eR, top + R_)}C${g(eR, top + R_ + R_ * K)} ${g(ex + R_ * K, eb)} ${g(ex, eb)}H${X(xc + (ci - xc) * kk)}Z`));
      return [body, earP, saucer, hole];
    }
    return [body, earP, saucer, counter];
  },
  // BAR. SQUARE. A VESSEL (a coupe's bowl is shallow) on a POST stem and a SLAB foot about 70% of the bowl.
  // g7i (owner: "i like how the material/phosphor examples have a bit of liquid then a clear space alluded
  // to.. i think that could be helpful to differentiate from a chalice"; and the coupe read "bigger/heavier"):
  // under the rim, a clear band (1 2/3px, over the 1.5px counter minimum, so it stays open at 12 and 24)
  // runs between the walls, and the liquid fills the bowl below it. The band is closed at both ends by the
  // walls, so the bowl reads as a glass holding a drink, not two parts (g5's single line split it into an "I").
  bar(s = 12, o = { style: 'mono' }) {   // g7p: monoweight is the line (owner: "monoweigh is looking the best")
    const u = s / 12, X = v => f(v * u), Y = v => T(v * u), c = s / 2;
    // g7r (owner on v130: "There is less liquid in the coupe"): measured (src/drink-measure.js), the drink was
    // 16.1px² in v123-v128 and 14.2 in v130 (the wider bowl was scaled down to fit its class); the bowl is now
    // deeper (6 1/2, was 5 2/3) and fuller at the bottom (0.7, was 0.6), the foot 1/3px lower: 21.5px²
    // g7s (owner on v133: "i think v130 bowl was closer -- though it should be wider on the bottom to look more
    // like a classic coupe. go back to that and make there be more liquid in the bottom in that one"): v130's
    // saucer bowl, its bottom wider and flatter (handle 1.25 from the side, was 2.75), 1/3 deeper (6, was 5 2/3)
    // and its sides a touch steeper at the rim (0.55): drink 18.8px² (v130 14.2), still a shallow saucer
    const bd = o.bd ?? 6;
    // g7p (owner: "i liked the bowl shape from earlier batches (i like the wider bowl ...)" and "it needs slightly
    // more liquid still"): the bowl is wider in the drawing (its rim 11.5 of the 12-unit box, was 11) and broad-bottomed like the g6 coupe, its sides
    // falling steeply from the rim (handle 0.6 of the depth, was 0.49) into a flatter bottom, so at the same
    // depth it holds more drink; the stem is 1/3px shorter so the glass stays square to its class.
    const bl = 0.25, bk = o.bk ?? 0.55, ln = o.lean ?? 0;
    const bx = o.bx ?? 1.25;   // the bottom curve's handle: further in = a wider, flatter bottom (a classic coupe)
    const bowl = D(`M${X(bl)} ${X(0)}H${X(12 - bl)}C${X(12 - bl - ln)} ${X(bk * bd)} ${X(12 - bx)} ${X(bd)} ${X(6)} ${X(bd)}C${X(bx)} ${X(bd)} ${X(bl + ln)} ${X(bk * bd)} ${X(bl)} ${X(0)}Z`, { root: 'VESSEL' });
    // The band's walls, two ways (owner, 10-20, on the g7i taper: "i like the handmade look of the taper, but im
    // not sure what in the real world it would allude to"; "i just dont want to lose the no taper option"):
    //   o.taper 'even': an EVEN offset of the bowl, the wall's width all the way down (straight sides between
    //     the true offset points at the band's two edges: 1.5px at both ends, 1.59 at the middle);
    //   otherwise (as shipped since g7i, and the COUNTERPUNCH option): the band is cut by the bowl's own shape
    //     made smaller, so the wall is full (1.5px) at the rim and thins toward the drink (about 1.1px).
    const wall = o.wall || W;
    if (o.style && !['punch', 'mono', 'brush', 'settle'].includes(o.style) && o.taper !== 'cut') o = { ...o, taper: 'even' };   // the band is cut by the bowl's shape (tapered) unless a style says even
    // the clear band, under the rim and over the drink: g7k, the counter minimum, 1.5px (was 1 2/3), so the
    // drink stands higher; its surface sits 1/6px off the 1/3px lattice, the one place the counter minimum wins
    const rim = WH, liquid = rim + W;
    let band;
    if (o.style === 'mono' || o.style === 'brush' || o.style === 'settle') {
      // the band's sides are the bowl's inner edge between the rim and the drink: points at the line's width
      // in from the bowl, joined by one curve that follows the bowl (its handles along the bowl's tangent)
      // g7y (owner: "the empty part should be equal to the thickness of the stroke. or maybe even a little
      // thinner if that isn't optically what turns out"): o.bandH, the clear band's height (default the line)
      const rimT = o.style === 'mono' ? W : o.style === 'brush' ? WMIN : WH, liq = rimT + (o.bandH ?? W);
      const B = [[X(bl), 0], [X(bl + ln), X(bk * bd)], [X(bx), X(bd)], [X(6), X(bd)]];
      const bz = (tt, i) => (1 - tt) ** 3 * B[0][i] + 3 * tt * (1 - tt) ** 2 * B[1][i] + 3 * tt * tt * (1 - tt) * B[2][i] + tt ** 3 * B[3][i];
      const dz = (tt, i) => 3 * (1 - tt) ** 2 * (B[1][i] - B[0][i]) + 6 * tt * (1 - tt) * (B[2][i] - B[1][i]) + 3 * tt * tt * (B[3][i] - B[2][i]);
      const wAt = tt => o.style === 'mono' ? W : o.style === 'brush' ? wBrush(Math.atan2(dz(tt, 1), dz(tt, 0))) : wSettle(bz(tt, 1), 0, X(bd));
      const at = tt => { const dx = dz(tt, 0), dy = dz(tt, 1), L = Math.hypot(dx, dy), w = wAt(tt); return [bz(tt, 0) + dy / L * w, bz(tt, 1) - dx / L * w]; };
      const tAt = y => { let lo = 0, hi = 1; for (let n = 0; n < 60; n++) { const m = (lo + hi) / 2; if (at(m)[1] < y) lo = m; else hi = m; } return lo; };
      const t0 = tAt(rimT), t1 = tAt(liq), p0 = at(t0), p1 = at(t1);
      const tan = tt => { const a_ = at(tt - 1e-4), b_ = at(tt + 1e-4), L = Math.hypot(b_[0] - a_[0], b_[1] - a_[1]); return [(b_[0] - a_[0]) / L, (b_[1] - a_[1]) / L]; };
      const ch = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) / 3, d0 = tan(t0), d1 = tan(t1);
      const c1 = [p0[0] + d0[0] * ch, p0[1] + d0[1] * ch], c2 = [p1[0] - d1[0] * ch, p1[1] - d1[1] * ch], m = x => f(s - x);
      // g7s (owner on v133: "i would think the clear area should match the thickness of the stroke. i also dont
      // see the interior counter feedback being reflected in regards to the interior curve matching the exterior
      // curve"): the clear area is a CHANNEL one line wide that follows the wall: the whole inside of the bowl
      // (the outline moved in by a line) is cleared, and the drink is laid back in as the outline moved in by
      // two lines, below the surface; so the clear area is the stroke's width under the rim and down both
      // sides, and its inner edge is the outer curve, a line in, all the way down. o.chan: where the channel
      // stops (a share of the bowl's depth; the drink meets the wall below it), 1 = all the way round.
      const chanY = o.chan == null ? null : X(o.chan * bd);
      // g7z (owner on v142's B: "the counter is still wrong both in size and in curvature"): measured, v142's band
      // WAS the true offset (the wall 1.50 square to the bowl at the band's top, middle and bottom), but across
      // the band the bowl turns, so a true offset bends tighter than the outside and its sides lean in faster:
      // the wall read 1.55 wide at the band's top and 1.72 at its bottom. o.bandSide 'shift' (the coupe from g7z, B):
      // each side of the band is the bowl's own curve over the band's height, moved in by the line. Same curve,
      // same curvature as the outside; the wall is the line wide all the way down. Without it: v142's true offset (v134 and A-C as shown).
      if (o.style === 'mono' && o.chan == null && o.coupe !== 'inner' && (o.bandSide === 'shift' || o.coupe === 'open' || o.coupe === 'crescent')) {
        const Lc = [[X(6), X(bd)], [X(bx), X(bd)], [X(bl + ln), X(bk * bd)], [X(bl), 0]];   // the bowl's left side, bottom to rim
        const pt = (q, tt) => [0, 1].map(i => (1 - tt) ** 3 * q[0][i] + 3 * tt * (1 - tt) ** 2 * q[1][i] + 3 * tt * tt * (1 - tt) * q[2][i] + tt ** 3 * q[3][i]);
        const tY = y => { let lo = 0, hi = 1; for (let n = 0; n < 60; n++) { const m = (lo + hi) / 2; if (pt(Lc, m)[1] > y) lo = m; else hi = m; } return (lo + hi) / 2; };
        const lerp = (a, b, tt) => [a[0] + (b[0] - a[0]) * tt, a[1] + (b[1] - a[1]) * tt];
        const sub = (q, ta, tb) => {   // the exact piece of a cubic between ta and tb (de Casteljau, twice)
          const cut1 = (q, tt) => { const a = lerp(q[0], q[1], tt), b = lerp(q[1], q[2], tt), c_ = lerp(q[2], q[3], tt), ab = lerp(a, b, tt), bc = lerp(b, c_, tt), m = lerp(ab, bc, tt); return [[m, bc, c_, q[3]], [q[0], a, ab, m]]; };
          const [tail] = cut1(q, ta); return cut1(tail, (tb - ta) / (1 - ta))[1];
        };
        const q = sub(Lc, tY(liq), tY(rimT)).map(([x, y]) => [x + W, y]);   // drink level up to the rim, moved in by the line
        const mq = q.map(([x, y]) => [s - x, y]);
        if (o.coupe === 'crescent') {
          // g7ab (d) THE CLEAR PART AS A CRESCENT: under the rim, full height (o.bandH) at the middle, its lower edge
          // a sag like the bowl's, thinning toward the walls to o.crescentEnd (1/2px: below a line, by design)
          const te = o.crescentEnd ?? 0.5, yE = rimT + te, qc = sub(Lc, tY(yE), tY(rimT)).map(([x, y]) => [x + W, y]), mc = qc.map(([x, y]) => [s - x, y]);
          const xL = qc[0][0], xR = mc[0][0], a_ = (xR - xL) * 0.3, yH = (4 * liq - yE) / 3;
          band = cut(D(`M${f(qc[3][0])} ${f(qc[3][1])}H${f(mc[3][0])}C${f(mc[2][0])} ${f(mc[2][1])} ${f(mc[1][0])} ${f(mc[1][1])} ${f(xR)} ${f(yE)}C${f(xR - a_)} ${f(yH)} ${f(xL + a_)} ${f(yH)} ${f(xL)} ${f(yE)}C${f(qc[1][0])} ${f(qc[1][1])} ${f(qc[2][0])} ${f(qc[2][1])} ${f(qc[3][0])} ${f(qc[3][1])}Z`));
        } else
        if (o.coupe === 'open') {
          // g7aa (b) OPEN GLASS: no bar across the rim. The bowl is a wall a line wide, open at the top like a
          // glass seen from the side; the clear part is its mouth, the bowl's own sides moved in by the line, down
          // to the drink's flat surface (o.bandH below the rim: the empty part, at or under the stroke)
          const qo = sub(Lc, tY(o.bandH ?? W), 1).map(([x, y]) => [x + W, y]), mo = qo.map(([x, y]) => [s - x, y]);
          band = cut(D(`M${f(qo[0][0])} ${f(qo[0][1])}C${f(qo[1][0])} ${f(qo[1][1])} ${f(qo[2][0])} ${f(qo[2][1])} ${f(qo[3][0])} ${f(qo[3][1])}V-1H${f(mo[3][0])}V${f(mo[3][1])}C${f(mo[2][0])} ${f(mo[2][1])} ${f(mo[1][0])} ${f(mo[1][1])} ${f(mo[0][0])} ${f(mo[0][1])}Z`));
        } else
        band = cut(D(`M${f(q[0][0])} ${f(q[0][1])}C${f(q[1][0])} ${f(q[1][1])} ${f(q[2][0])} ${f(q[2][1])} ${f(q[3][0])} ${f(q[3][1])}H${f(mq[3][0])}C${f(mq[2][0])} ${f(mq[2][1])} ${f(mq[1][0])} ${f(mq[1][1])} ${f(mq[0][0])} ${f(mq[0][1])}Z`));
      } else
      if (o.coupe === 'inner') {
        // g7aa (c) THE DRINK AS ITS OWN SHAPE: the glass drawn as an outline a line wide (open at the top), and
        // the drink inside it a separate dark shape, a clear gap of o.bandH between them all round, its surface
        // flat, o.bandH below the rim
        const g = o.bandH ?? W, up = D(`M${X(bl)} ${f(-2 * W)}H${X(12 - bl)}V0C${X(12 - bl - ln)} ${X(bk * bd)} ${X(12 - bx)} ${X(bd)} ${X(6)} ${X(bd)}C${X(bx)} ${X(bd)} ${X(bl + ln)} ${X(bk * bd)} ${X(bl)} 0Z`);
        band = [E([up], W, null, { mirror: c }), E([up], W + g, R(-1, g, s + 2, 50), { mirror: c, fill: true, cut: false })];
      } else
      band = o.style === 'mono' && o.chan == null ? E([bowl], W, R(-1, -1, s + 2, liq + 1), { mirror: c }) : o.style === 'mono' ? [E([bowl], W, null, { mirror: c }), E([bowl], 2 * W, R(-1, liq, s + 2, 50), { mirror: c, fill: true, cut: false }), ...(chanY != null && o.chan < 1 ? [E([bowl], W, R(-1, Math.max(liq, chanY), s + 2, 50), { mirror: c, fill: true, cut: false })] : [])] : cut(D(`M${f(p0[0])} ${f(rimT)}H${m(p0[0])}C${m(c1[0])} ${f(c1[1])} ${m(c2[0])} ${f(c2[1])} ${m(p1[0])} ${f(liq)}H${f(p1[0])}C${f(c2[0])} ${f(c2[1])} ${f(c1[0])} ${f(c1[1])} ${f(p0[0])} ${f(rimT)}Z`));
    } else if (o.taper === 'even') {
      const B = [[X(0.5), 0], [X(0.5), X(2.8)], [X(3), X(bd)], [X(6), X(bd)]];   // the left side, in px
      const bz = (tt, i) => (1 - tt) ** 3 * B[0][i] + 3 * tt * (1 - tt) ** 2 * B[1][i] + 3 * tt * tt * (1 - tt) * B[2][i] + tt ** 3 * B[3][i];
      const dz = (tt, i) => 3 * (1 - tt) ** 2 * (B[1][i] - B[0][i]) + 6 * tt * (1 - tt) * (B[2][i] - B[1][i]) + 3 * tt * tt * (B[3][i] - B[2][i]);
      const inAt = y => {
        const at = tt => { const dx = dz(tt, 0), dy = dz(tt, 1), L = Math.hypot(dx, dy); return [bz(tt, 0) + dy / L * wall, bz(tt, 1) - dx / L * wall]; };
        let lo = 0, hi = 1; for (let n = 0; n < 60; n++) { const m = (lo + hi) / 2; if (at(m)[1] < y) lo = m; else hi = m; }
        return at(lo)[0];
      };
      const a = inAt(rim), b = inAt(liquid);
      band = cut(P([a, rim], [s - a, rim], [s - b, liquid], [b, liquid]));
    } else {
      const k = (5.5 - wall / u) / 5.5, ix = x => 6 + (x - 6) * k;
      const inside = D(`M${X(ix(0.5))} ${X(-1)}H${X(ix(11.5))}C${X(ix(11.5))} ${X(2.8)} ${X(ix(9))} ${X(bd)} ${X(6)} ${X(bd)}C${X(ix(3))} ${X(bd)} ${X(ix(0.5))} ${X(2.8)} ${X(ix(0.5))} ${X(-1)}Z`);
      band = cut(I(inside, R(0, rim, s, liquid - rim)));
    }
    const FB = Y(o.fb ?? 10.833);
    // g7z: on a DOME the stem runs down into the foot (half its height), so its sides meet the dome's arc in a
    // real join that flares like the trunk's; ending at the dome's crown left a 0.13px ledge at each side
    const fh = slabH(o), sy0 = X(bd - 0.5), sy1 = o.dome && typeof o.under !== 'number' ? FB - fh / 2 : FB - fh + 0.01;
    const stem = o.style === 'woodcut' ? POSTF(c, X(bd - 0.5), FB - WH + 0.01, true, true) : o.style === 'settle' ? POSTT(c, sy0, sy1, wSettle(sy0, 0, s), wSettle(sy1, 0, s)) : o.post ? R(c - o.post / 2, sy0, o.post, sy1 - sy0, { root: 'POST' }) : POST(c, sy0, sy1);   // o.post (g7t exploration): a free-standing post's width
    // g7t exploration, o.dome: a foot that holds a glass up by its stem is a DOME (its top a low arc, a line
    // high at the centre, its ends worn to the corner rule), as batch 1's was; a base an object sits flat on
    // (the saucer, the plinth) stays a SLAB
    const foot = typeof o.under === 'number' ? D(`M${X(2)} ${f(FB - fh)}H${X(10)}V${f(FB - o.under)}C${X(7.6)} ${f(FB + o.under / 3)} ${X(4.4)} ${f(FB + o.under / 3)} ${X(2)} ${f(FB - o.under)}Z`, { root: 'DOME' }) : typeof o.dome === 'number' ? D(`M${X(2)} ${f(FB)}V${f(FB - fh + o.dome)}C${X(4.4)} ${f(FB - fh - o.dome / 3)} ${X(7.6)} ${f(FB - fh - o.dome / 3)} ${X(10)} ${f(FB - fh + o.dome)}V${f(FB)}Z`, { root: 'DOME' }) : o.dome ? D(`M${X(2)} ${f(FB)}C${X(2)} ${f(FB - 0.8 * fh)} ${X(3.9)} ${f(FB - fh)} ${f(c)} ${f(FB - fh)}C${X(8.1)} ${f(FB - fh)} ${X(10)} ${f(FB - 0.8 * fh)} ${X(10)} ${f(FB)}Z`, { root: 'DOME' }) : R(X(2.25), FB - fh, X(9.75) - X(2.25), fh, { root: 'SLAB' });
    return o.band === false ? [bowl, stem, foot] : [bowl, stem, foot, ...(Array.isArray(band) ? band : [band])];
  },
  // MUSEUM. WIDE, its apex passing by 1/2px. A GABLE pediment on a SLAB beam, four POST columns, a SLAB
  // plinth. Counters: the spaces between the columns are plain upright slots (no pills, owner's example).
  museum(s = 12, o = { style: 'mono' }) {   // g7p: monoweight is the line (owner: "monoweigh is looking the best")
    const u = s / 12, X = v => f(v * u), Y = v => T(v * u);
    const pb = Y(4), bd = o.beam === 0 ? 0 : slabH(o), ap = X(o.apex ?? 1.667), fz = bd ? 0 : (o.fascia ?? 0), flush = !bd && o.eave === 'flush', eL = flush ? X(0.75) : X(0.25), eR = flush ? X(11.25) : X(11.75);
    // pediment and beam as one outline (a GABLE on a SLAB, joined), so no coincident corners go through the boolean
    const out = [bd ? { ...P([X(0.25), pb + bd], [X(0.25), pb], [X(6), ap], [X(11.75), pb], [X(11.75), pb + bd]), root: 'GABLE', also: 'SLAB' } : fz ? { ...P([eL, pb + fz], [eL, pb], [X(6), ap], [eR, pb], [eR, pb + fz]), root: 'GABLE' } : { ...P([eL, pb + 0.01], [X(6), ap], [eR, pb + 0.01]), root: 'GABLE' }];
    const ct = pb + bd, pl = Y(12) - slabH(o);                        // column tops; plinth top
    const n = o.cols ?? 4, span = X(10.5), gap = (span - n * W) / (n - 1), x0 = X(0.75);
    if (o.arch) {
      // g7ae (owner: "how might this style be reflected in architectural things like this that are a lot of straight
      // lines"): the four-column, beamed museum (H2's) with one structural rule at a time. o.arch:
      //   entasis  the columns swell (px at mid-height), as a stem or a real column does;
      //   droop    the beam's underside droops (px at the centre) and the roof's slopes sweep in (roofBow), the tree's
      //            numbers, so the long lines are drawn, not ruled;
      //   capital  the columns flare into the beam and the plinth (px), as the coupe's stem flares into its bowl
      const A = o.arch, e = A.entasis || 0, dB = A.droop || 0, r = Math.min(A.capital || 0, gap / 3), k = 0.5523, bwR = A.roofBow || 0;
      const xc = s / 2, hw = X(11.75) - xc, yt = x => ct + dB * (1 - ((x - xc) / hw) ** 2), ytd = x => -2 * dB * (x - xc) / (hw * hw);
      const sl = (x0_, y0_, x1_, y1_) => { if (!bwR) return `L${f(x1_)} ${f(y1_)}`; const mx = (x0_ + x1_) / 2, my = (y0_ + y1_) / 2, L = Math.hypot(x1_ - x0_, y1_ - y0_), nx = (y1_ - y0_) / L, ny = -(x1_ - x0_) / L, sg = Math.sign((mx - s / 2) * nx || 1); return `Q${f(mx + sg * nx * 2 * bwR)} ${f(my + sg * ny * 2 * bwR)} ${f(x1_)} ${f(y1_)}`; };
      out[0] = A.cast ? { ...D(roundPoly([[X(0.25), pb + bd], [X(0.25), pb], [X(6), ap], [X(11.75), pb], [X(11.75), pb + bd]], A.cast)), root: 'GABLE', also: 'SLAB' } : { ...D(`M${X(0.25)} ${f(pb + bd)}V${f(pb)}${sl(X(0.25), pb, X(6), ap)}${sl(X(6), ap, X(11.75), pb)}V${f(pb + bd)}${dB ? `Q${f(xc)} ${f(pb + bd + 2 * dB)} ${X(0.25)} ${f(pb + bd)}` : ''}Z`), root: 'GABLE', also: 'SLAB' };
      const mid = (ct + pl) / 2, R_ = x => x + 0.0001;
      out.push({ ...D(`M${f(x0 + e)} ${f(ct - 0.01)}H${f(x0 + span - e)}${e ? `Q${f(x0 + span + e)} ${f(mid)} ${f(x0 + span - e)} ${f(pl + 0.01)}` : `V${f(pl + 0.01)}`}H${f(x0 + e)}${e ? `Q${f(x0 - e)} ${f(mid)} ${f(x0 + e)} ${f(ct - 0.01)}` : ''}Z`), root: 'POST' });
      const cor = (x1, y1, x2, y2, x3, y3) => r > 0.05 ? `C${f(x1)} ${f(y1)} ${f(x2)} ${f(y2)} ${f(x3)} ${f(y3)}` : '';
      for (let i = 0; i < n - 1; i++) {
        const a_ = x0 + W + i * (W + gap) - e, b_ = a_ + gap + 2 * e, xm = (a_ + b_) / 2, ta = yt(a_ + r), tb = yt(b_ - r), cy = ta + ytd(a_ + r) * (xm - a_ - r);
        const sideMid = (yt(b_) + r + pl - r) / 2;
        out.push(cut(D(`M${f(a_ + r)} ${f(ta)}${dB ? `Q${f(xm)} ${f(cy)} ${f(b_ - r)} ${f(tb)}` : `H${f(b_ - r)}`}${cor(b_ - r + r * k, tb, b_, yt(b_) + r - r * k, b_, yt(b_) + r)}${e ? `Q${f(b_ - 2 * e)} ${f(sideMid)} ${f(b_)} ${f(pl - r)}` : `V${f(pl - r)}`}${cor(b_, pl - r + r * k, b_ - r + r * k, pl, b_ - r, pl)}H${f(a_ + r)}${cor(a_ + r - r * k, pl, a_, pl - r + r * k, a_, pl - r)}${e ? `Q${f(a_ + 2 * e)} ${f(sideMid)} ${f(a_)} ${f(yt(a_) + r)}` : `V${f(yt(a_) + r)}`}${cor(a_, yt(a_) + r - r * k, a_ + r - r * k, ta, a_ + r, ta)}Z`)));
      }
      if (r > 0.05 && !A.plainOuter) { const fil = (x, y, dx, dy) => D(`M${f(x)} ${f(y)}H${f(x + dx * r)}C${f(x + dx * r * (1 - k))} ${f(y)} ${f(x)} ${f(y + dy * r * (1 - k))} ${f(x)} ${f(y + dy * r)}Z`);
        out.push(fil(x0 + 0.01, yt(x0) - 0.01, -1, 1), fil(x0 + span - 0.01, yt(x0 + span) - 0.01, 1, 1), fil(x0 + 0.01, pl + 0.01, -1, -1), fil(x0 + span - 0.01, pl + 0.01, 1, -1)); }
    } else
    if (o.capital) {
      const r = Math.min(o.capital, ((span - n * (o.colW ?? W)) / (n - 1)) / 3), k = 0.5523;
      if (o.roofBow ?? o.bow) { const bw = o.roofBow ?? o.bow, sl = (x0_, y0_, x1_, y1_) => { const mx = (x0_ + x1_) / 2, my = (y0_ + y1_) / 2, L = Math.hypot(x1_ - x0_, y1_ - y0_), nx = (y1_ - y0_) / L, ny = -(x1_ - x0_) / L, sg = Math.sign((mx - s / 2) * nx || 1); return `Q${f(mx + sg * nx * 2 * bw)} ${f(my + sg * ny * 2 * bw)} ${f(x1_)} ${f(y1_)}`; };
        out[0] = bd ? { ...D(`M${X(0.25)} ${f(pb + bd)}V${f(pb)}${sl(X(0.25), pb, X(6), ap)}${sl(X(6), ap, X(11.75), pb)}V${f(pb + bd)}Z`), root: 'GABLE', also: 'SLAB' } : { ...D(`M${eL} ${f(pb + (fz || 0.01))}${fz ? `V${f(pb)}` : ''}${sl(eL, pb + (fz ? 0 : 0.01), X(6), ap)}${sl(X(6), ap, eR, pb + (fz ? 0 : 0.01))}${fz ? `V${f(pb + fz)}` : ''}Z`), root: 'GABLE' }; }
      out.push(R(x0, ct - 0.01, span, pl - ct + 0.02, { root: 'POST' }));   // the colonnade, its slots cut below
      // g7ak POST RULE: o.colW, a column's width (a post that holds a mass up: the free-post width); the outer edges stay
      const cw = o.colW ?? W, gp = (span - n * cw) / (n - 1);
      for (let i = 0; i < n - 1; i++) { const a = x0 + cw + i * (cw + gp), b = a + gp;
        out.push(cut(D(`M${f(a + r)} ${f(ct)}H${f(b - r)}C${f(b - r + r * k)} ${f(ct)} ${f(b)} ${f(ct + r - r * k)} ${f(b)} ${f(ct + r)}V${f(pl - r)}C${f(b)} ${f(pl - r + r * k)} ${f(b - r + r * k)} ${f(pl)} ${f(b - r)} ${f(pl)}H${f(a + r)}C${f(a + r - r * k)} ${f(pl)} ${f(a)} ${f(pl - r + r * k)} ${f(a)} ${f(pl - r)}V${f(ct + r)}C${f(a)} ${f(ct + r - r * k)} ${f(a + r - r * k)} ${f(ct)} ${f(a + r)} ${f(ct)}Z`))); }
      // the outer columns' capitals and bases: a quarter-round fill in each corner where a column meets an overhang
      const fil = (x, y, dx, dy) => D(`M${f(x)} ${f(y)}H${f(x + dx * r)}C${f(x + dx * r * (1 - k))} ${f(y)} ${f(x)} ${f(y + dy * r * (1 - k))} ${f(x)} ${f(y + dy * r)}Z`);
      if (!flush && !fz && !o.plainOuter) out.push(fil(x0 + 0.01, ct + fz - 0.01, -1, 1), fil(x0 + span - 0.01, ct + fz - 0.01, 1, 1));
      if (!flush && !fz && !o.plainOuter) out.push(fil(x0 + 0.01, pl + 0.01, -1, -1), fil(x0 + span - 0.01, pl + 0.01, 1, -1));   // flush: the outer columns are the building's sides, no fills (a fill in a 1/2px step left a 0.1px ledge)
    } else
    { const cw = o.colW ?? W, gp = (span - n * cw) / (n - 1);   // g7ak: o.colW, the posts-hold-a-mass width; outer edges stay
      if (o.roofBow) { const bw = o.roofBow, sl = (x0_, y0_, x1_, y1_) => { const mx = (x0_ + x1_) / 2, my = (y0_ + y1_) / 2, L = Math.hypot(x1_ - x0_, y1_ - y0_), nx = (y1_ - y0_) / L, ny = -(x1_ - x0_) / L, sg = Math.sign((mx - s / 2) * nx || 1); return `Q${f(mx + sg * nx * 2 * bw)} ${f(my + sg * ny * 2 * bw)} ${f(x1_)} ${f(y1_)}`; };
        if (bd) out[0] = { ...D(`M${X(0.25)} ${f(pb + bd)}V${f(pb)}${sl(X(0.25), pb, X(6), ap)}${sl(X(6), ap, X(11.75), pb)}V${f(pb + bd)}Z`), root: 'GABLE', also: 'SLAB' }; }
    const cT = o.restCut?.top ? CUT : -0.01, cB = o.restCut?.bot ? CUT : -0.01;   // g7am REST RULE: a part that rests on another is cut from it
    for (let i = 0; i < n; i++) { const cx = x0 + cw / 2 + i * (cw + gp); out.push(cw !== W || o.restCut ? R(cx - cw / 2, ct + cT, cw, pl - ct - cT - cB, { root: 'POST' }) : o.style === 'woodcut' ? POSTF(cx, ct - 0.01, pl + 0.01, true, true) : o.style === 'settle' ? POSTT(cx, ct - 0.01, pl + 0.01, wSettle(ct, 0, s), wSettle(pl, 0, s)) : POST(cx, ct - 0.01, pl + 0.01)); } }
    out.push(o.arch && o.arch.cast ? { ...D(roundPoly([[X(0.25), pl], [X(11.75), pl], [X(11.75), pl + slabH(o)], [X(0.25), pl + slabH(o)]], o.arch.cast)), root: 'SLAB' } : R(X(0.25), pl, X(11.75) - X(0.25), slabH(o), { root: 'SLAB' }));
    return out;
  },
  // NATURE. TALL, its tip passing by 1/2px. Three GABLE tiers widening by equal steps, on a POST trunk.
  // g7i: each tier is a true GABLE, its base flat (it rose 0.4px to the trunk: a fourth shape for one job).
  nature(s = 12, o = { style: 'mono' }) {   // g7p: monoweight is the line (owner: "monoweigh is looking the best")
    const u = s / 12, X = v => f(v * u), Y = v => T(v * u), c = s / 2;
    // GABLE STACK rule: every notch shelf (the flat underside a tier shows past the tier below) is the same at
    // every notch, set from the line: g7j one line (1.5px; they were 1.45 and 2.14, uneven, and read as
    // steps); g7k (owner: "i think the branches should be a bit more indented -- looks like a triangle at
    // 100%") one and a half lines, 2.25px, so the tiers read at true size. Each lower tier's apex follows.
    // g7n (owner: "how are the heights of the stacked gables defined?"): the whole stack now comes from the
    // grid, nothing by hand. In the 12-unit box:
    //   the apex passes TOP by the apex overshoot (1/2); the trunk shows one line (1.5px) under the bottom tier;
    //   N = 3 tiers, each showing the same height (crown height / N);
    //   every tier is the SAME gable (one slope), so they read as one tree;
    //   every notch shelf is one and a half lines (2.25px), which spaces the tier apexes by shelf / slope;
    //   the bottom tier spans the tall class's width (9 1/3).
    // Solving those: slope = (half width + (N-1) shelf) / crown height; then each tier's base and half width.
    // g7p (owner: "i like the proportions now, but i do think its less interesting with the more standard
    // triangle approach. i liked the intentionality of the other one overall shape wise"): the v123 shape, now
    // by rule. The TIP tier is the tree's point: it shows one and a half times the height of each tier under
    // it (they show equal heights); the tip's half width is the shelf plus a third of a line, the bottom
    // tier's is the tall class's, and the middle steps evenly between; each lower tier's apex follows from the
    // 1.5-line shelf, so the slopes differ (the tip steepest), as a fir's do. Trunk: one line; apex +1/2.
    const N = 3, L = 1.5 * W / u, apex = -APEX, B = 12 - W / u, hwN = KEY.TALL[0] / 2, hw1 = L + W / u / 3;
    const crown = B - apex, tiers = [];
    if (o.tip != null) {   // g7p/g7q: one taller-tip factor (shown in v129-v130, kept for the before/after)
      const TK = o.tip, h = crown / (N - 1 + TK);
      for (let i = 1; i <= N; i++) { const by = apex + (i - 1 + TK) * h, hw = hw1 + (hwN - hw1) * (i - 1) / (N - 1); tiers.push([i === 1 ? apex : null, by, hw]); }
      for (let i = 1; i < N; i++) { const [, byU, hwU] = tiers[i - 1], [, byL, hwL] = tiers[i], r_ = (hwU - L) / hwL; tiers[i][0] = (byU - r_ * byL) / (1 - r_); }
    } else {
      // g7r (owner on v130: "the tree now looks goofy with the less intentional size of tree sections" and
      // "The top tier of the tree looks like it's coming off"): V123'S TIER RELATIONSHIPS ARE THE RULE.
      //   heights: the tiers show 4.83 : 3 : 3.33 of the crown, tip to bottom: v123 as it was SEEN at 24 (its
      //     drawn 4.75 : 3.35 : 3.15 landed on the 1/3px lattice as these), a tall tip, a short middle, a
      //     longer base: the rhythm that read as intentional;
      //   widths: half widths 2.8 : 4.1 : 5.3 (v123's), the bottom one the tall class's;
      //   notches: each notch is a share of the tier above it (TREE_NOTCH of its half width), not a fixed
      //   depth, so the neck under every tier stays a fixed share of it and no tier reads as coming off.
      // Fitted to the current height (apex +1/2 to the trunk's line) and width (the tall class).
      const HV = o.hv || [4.83, 3, 3.33], WV = [2.8, 4.1, 5.3], sH = HV.reduce((a, b) => a + b, 0), sig = o.notch ?? TREE_NOTCH;
      let cum = 0;
      for (let i = 0; i < N; i++) { cum += HV[i]; tiers.push([i === 0 ? apex : null, apex + crown * cum / sH, hwN * WV[i] / WV[N - 1]]); }
      for (let i = 1; i < N; i++) { const [, byU, hwU] = tiers[i - 1], [, byL, hwL] = tiers[i], r_ = (hwU - sig * hwU) / hwL; tiers[i][0] = (byU - r_ * byL) / (1 - r_); }
      // a drooping underside lifts the tier's middle: the tier below must still reach a line up into it
      if (o.droop) for (let i = 1; i < N; i++) tiers[i][0] = Math.min(tiers[i][0], tiers[i - 1][1] - (o.droop + 1) * W / u);
    }
    const out = [], tTop = B - W / u;
    // g7t exploration, o.droop (in lines): each tier's underside lifts toward the trunk by that much, so the
    // branch tips droop, as batch 1's did (a gable whose base is a shallow arc)
    const dr = (o.droop || 0) * W;
    // g7y exploration, o.bow (in lines): each tier's sides bow outward by that much at their middle, so the
    // tiers read as drawn branches, not ruled triangles (the owner on the tree: "the less mechanical triangles")
    const bw = (o.bow || 0) * W;
    const bowSide = (x0, y0, x1, y1) => { if (!bw) return `L${f(x1)} ${f(y1)}`; const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, L = Math.hypot(x1 - x0, y1 - y0), nx = (y1 - y0) / L, ny = -(x1 - x0) / L, s_ = Math.sign((mx - c) * nx || 1); return `Q${f(mx + s_ * nx * 2 * bw)} ${f(my + s_ * ny * 2 * bw)} ${f(x1)} ${f(y1)}`; };
    for (const [ty, by, hw] of tiers) out.push(dr ? { ...D(`M${f(c)} ${X(ty)}${bowSide(c, X(ty), c + X(hw), Y(by))}Q${f(c + X(hw) * 0.45)} ${f(Y(by) - dr)} ${f(c)} ${f(Y(by) - dr)}Q${f(c - X(hw) * 0.45)} ${f(Y(by) - dr)} ${f(c - X(hw))} ${Y(by)}${bowSide(c - X(hw), Y(by), c, X(ty))}Z`), root: 'GABLE' } : GABLE(c, X(ty), Y(by), X(hw)));
    out.push(o.style === 'woodcut' ? POSTF(c, X(tTop), s, true, false) : o.style === 'burin' ? POSTW(c, X(tTop), s, W, (W + FREE) / 2, FREE) : o.style === 'settle' ? POSTT(c, X(tTop), s, wSettle(X(tTop), 0, s), W) : o.post ? R(c - o.post / 2, X(tTop), o.post, s - X(tTop), { root: 'POST' }) : POST(c, X(tTop), s));
    return out;
  },
};

// ---- the two UI icons, each in its own 24 viewBox, shown at its app size ----
function plus(px = 26.4, sc = 1, lw = W, style) {
  // g7i: OPEN class. Both arms are POSTs of the full 1.5px (no thinner horizontal: an open mark has no
  // mass to balance); sc is set by the grid's fit (boards7.js), never by hand.
  const k = 24 / px, w = lw * k, L = 14 * sc;
  if (style === 'brush') { const e = WMIN * k; return [R(12 - w / 2, 12 - L / 2, w, L), R(12 - L / 2, 12 - e / 2, L, e)]; }
  if (style === 'settle') { const e0 = WMIN * k, e1 = W * k, em = (e0 + e1) / 2; return [P([12 - e0 / 2, 12 - L / 2], [12 + e0 / 2, 12 - L / 2], [12 + e1 / 2, 12 + L / 2], [12 - e1 / 2, 12 + L / 2]), R(12 - L / 2, 12 - em / 2, L, em)]; }
  if (style === 'burin') { const e = FREE * k, h = L / 2; return [P([12 - w / 2, 12], [12 - e / 2, 12 - h], [12 + e / 2, 12 - h], [12 + w / 2, 12], [12 + e / 2, 12 + h], [12 - e / 2, 12 + h]), P([12, 12 - w / 2], [12 - h, 12 - e / 2], [12 - h, 12 + e / 2], [12, 12 + w / 2], [12 + h, 12 + e / 2], [12 + h, 12 - e / 2])]; }
  return [R(12 - w / 2, 12 - L / 2, w, L), R(12 - L / 2, 12 - w / 2, L, w)];
}
function star(px = 20, sc = 1, lw = W, style) {
  // g7j: OUTLINE class (hull at least the coin, hole at least two lines across); sc is set by the grid (boards7.js, starRc()).
  const k = 24 / px, w = lw * k, cx = 12, cy = 12 + 0.6 * sc, Rc = 9.6 * sc, ri = Rc * STAR.ri;
  const cl = []; for (let i = 0; i < 10; i++) { const r = i % 2 ? ri : Rc, a = -Math.PI / 2 + i * Math.PI / 5; cl.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
  const outer = offset(cl, -w / 2);
  if (style === 'brush' || style === 'settle') {
    // each outline edge keeps the outer edge; its inner edge runs through points at that edge's width in from
    // its two ends (brush: by the edge's direction, the same at both ends; settle: by each end's height)
    const ys = outer.map(q => q[1]), y0 = Math.min(...ys), y1 = Math.max(...ys), n = outer.length, lines = [];
    for (let i = 0; i < n; i++) {
      const a_ = outer[i], b_ = outer[(i + 1) % n], dx = b_[0] - a_[0], dy = b_[1] - a_[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
      const wa = (style === 'brush' ? wBrush(Math.atan2(dy, dx)) : wSettle(a_[1], y0, y1)) * k, wb = (style === 'brush' ? wBrush(Math.atan2(dy, dx)) : wSettle(b_[1], y0, y1)) * k;
      lines.push([[a_[0] + nx * wa, a_[1] + ny * wa], [b_[0] + nx * wb, b_[1] + ny * wb]]);
    }
    const inner = [];
    for (let i = 0; i < n; i++) { const [p1, p2] = lines[(i - 1 + n) % n], [q1, q2] = lines[i], e1 = [p2[0] - p1[0], p2[1] - p1[1]], e2 = [q2[0] - q1[0], q2[1] - q1[1]], den = e1[0] * e2[1] - e1[1] * e2[0], tt = ((q1[0] - p1[0]) * e2[1] - (q1[1] - p1[1]) * e2[0]) / den; inner.push([p1[0] + e1[0] * tt, p1[1] + e1[1] * tt]); }
    return [P(...outer), cut(P(...inner))];
  }
  if (style === 'punch') {   // the hole is the outside made smaller, scaled so the thickest wall (at the valleys) is the line
    const cyc = cy, rv = Math.hypot(outer[1][0] - cx, outer[1][1] - cyc), e = outer[0], f_ = outer[1], g = outer[2];
    const distSeg = (p, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], tt = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy))); return Math.hypot(p[0] - a[0] - tt * dx, p[1] - a[1] - tt * dy); };
    let lo = 0.3, hi = 0.99; for (let n = 0; n < 50; n++) { const m = (lo + hi) / 2, q = [cx + (f_[0] - cx) * m, cyc + (f_[1] - cyc) * m]; if (Math.min(distSeg(q, e, f_), distSeg(q, f_, g)) > w) lo = m; else hi = m; }
    return [P(...outer), cut(P(...outer.map(([x, y]) => [cx + (x - cx) * lo, cyc + (y - cyc) * lo])))];
  }
  // g7r (owner: "the internal counter lines don't match the external ones"): the hole is the finished outline
  // (tips and valleys rounded by the law) moved in by the line, so every wall is exactly the line, the
  // valleys' inner edge a round of their radius plus the line; it was the centreline offset, mitred, which
  // left the valley walls up to 13% thick
  return [P(...outer), E([P(...outer)], w, null, { mirror: cx })];
}
function offset(pts, d) {
  const n = pts.length, lines = [];
  for (let i = 0; i < n; i++) { const a = pts[i], b = pts[(i + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy); lines.push([[a[0] - dy / L * d, a[1] + dx / L * d], [dx, dy]]); }
  const out = [];
  for (let i = 0; i < n; i++) { const [p, e1] = lines[(i - 1 + n) % n], [q, e2] = lines[i]; const den = e1[0] * e2[1] - e1[1] * e2[0], t = ((q[0] - p[0]) * e2[1] - (q[1] - p[1]) * e2[0]) / den; out.push([p[0] + e1[0] * t, p[1] + e1[1] * t]); }
  return out;
}

// g7aj VESSEL SIDE RULE (owner on v205's coupe: "this line on the left and right is waht looks wrong -- it looks too
// straight compared to the rest of the shape"): a vessel's side drawn as a curve is ONE curve from the rim to the
// bottom, turning from the rim on, with no upright run and no S: its two handles balanced for the most even curvature
// (searched in g7ae: the rim handle half the depth down, the bottom handle 1 1/2 in from the side, no lean). A side drawn
// straight (the cup's wall) is a line, and is not a curve gone straight. Was a fix inside the Between coupe only; now
// any row spreads it into its coupe options, so a row built from another base doesn't bring the upright run back.
const VESSEL_SIDE = { bk: 0.5, bx: 1.5, lean: 0 };
const STAR = { ri: 0.47 };   // the star's inner radius, a share of its outer (its points' slenderness)
const TREE_NOTCH = 0.6;   // g7r: a notch is 0.6 of the half width of the tier above it (its neck the other 0.4)
const BATCH = [['cafe', 'Café'], ['bar', 'Bar'], ['museum', 'Museum'], ['nature', 'Nature']];
module.exports = { VESSEL_SIDE, STAR, W, WH, CUT, DRAW, plus, star, BATCH, KEY, CLASS, TOKEN, APEX, T, FLARE, FREE, WMIN };
