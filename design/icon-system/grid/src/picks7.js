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
const { R, C, P, B, O, A, D, I, cut } = require('./engine.js');
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
    const saucer = o.style === 'brush' || o.style === 'mono' ? R(0, T(X(bot) + CUT), s, slabH(o), { root: 'SLAB' }) : SLAB(0, s, T(X(bot) + CUT));
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
    const bd = 5.667;                                                // g7k (owner: "needs a bit more liquid"): 1/3px deeper
    // g7p (owner: "i liked the bowl shape from earlier batches (i like the wider bowl ...)" and "it needs slightly
    // more liquid still"): the bowl is wider (11.5, was 11) and broad-bottomed like the g6 coupe, its sides
    // falling steeply from the rim (handle 0.6 of the depth, was 0.49) into a flatter bottom, so at the same
    // depth it holds more drink; the stem is 1/3px shorter so the glass stays square to its class.
    const bl = 0.25, bk = 0.6;
    const bowl = D(`M${X(bl)} ${X(0)}H${X(12 - bl)}C${X(12 - bl)} ${X(bk * bd)} ${X(9.25)} ${X(bd)} ${X(6)} ${X(bd)}C${X(2.75)} ${X(bd)} ${X(bl)} ${X(bk * bd)} ${X(bl)} ${X(0)}Z`, { root: 'VESSEL' });
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
      const rimT = o.style === 'mono' ? W : o.style === 'brush' ? WMIN : WH, liq = rimT + W;
      const B = [[X(bl), 0], [X(bl), X(bk * bd)], [X(2.75), X(bd)], [X(6), X(bd)]];
      const bz = (tt, i) => (1 - tt) ** 3 * B[0][i] + 3 * tt * (1 - tt) ** 2 * B[1][i] + 3 * tt * tt * (1 - tt) * B[2][i] + tt ** 3 * B[3][i];
      const dz = (tt, i) => 3 * (1 - tt) ** 2 * (B[1][i] - B[0][i]) + 6 * tt * (1 - tt) * (B[2][i] - B[1][i]) + 3 * tt * tt * (B[3][i] - B[2][i]);
      const wAt = tt => o.style === 'mono' ? W : o.style === 'brush' ? wBrush(Math.atan2(dz(tt, 1), dz(tt, 0))) : wSettle(bz(tt, 1), 0, X(bd));
      const at = tt => { const dx = dz(tt, 0), dy = dz(tt, 1), L = Math.hypot(dx, dy), w = wAt(tt); return [bz(tt, 0) + dy / L * w, bz(tt, 1) - dx / L * w]; };
      const tAt = y => { let lo = 0, hi = 1; for (let n = 0; n < 60; n++) { const m = (lo + hi) / 2; if (at(m)[1] < y) lo = m; else hi = m; } return lo; };
      const t0 = tAt(rimT), t1 = tAt(liq), p0 = at(t0), p1 = at(t1);
      const tan = tt => { const a_ = at(tt - 1e-4), b_ = at(tt + 1e-4), L = Math.hypot(b_[0] - a_[0], b_[1] - a_[1]); return [(b_[0] - a_[0]) / L, (b_[1] - a_[1]) / L]; };
      const ch = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) / 3, d0 = tan(t0), d1 = tan(t1);
      const c1 = [p0[0] + d0[0] * ch, p0[1] + d0[1] * ch], c2 = [p1[0] - d1[0] * ch, p1[1] - d1[1] * ch], m = x => f(s - x);
      band = cut(D(`M${f(p0[0])} ${f(rimT)}H${m(p0[0])}C${m(c1[0])} ${f(c1[1])} ${m(c2[0])} ${f(c2[1])} ${m(p1[0])} ${f(liq)}H${f(p1[0])}C${f(c2[0])} ${f(c2[1])} ${f(c1[0])} ${f(c1[1])} ${f(p0[0])} ${f(rimT)}Z`));
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
    const FB = Y(10.667);
    const fh = slabH(o), sy0 = X(bd - 0.5), sy1 = FB - fh + 0.01;
    const stem = o.style === 'woodcut' ? POSTF(c, X(bd - 0.5), FB - WH + 0.01, true, true) : o.style === 'settle' ? POSTT(c, sy0, sy1, wSettle(sy0, 0, s), wSettle(sy1, 0, s)) : POST(c, sy0, sy1);
    const foot = R(X(2.25), FB - fh, X(9.75) - X(2.25), fh, { root: 'SLAB' });
    return o.band === false ? [bowl, stem, foot] : [bowl, stem, foot, band];
  },
  // MUSEUM. WIDE, its apex passing by 1/2px. A GABLE pediment on a SLAB beam, four POST columns, a SLAB
  // plinth. Counters: the spaces between the columns are plain upright slots (no pills, owner's example).
  museum(s = 12, o = { style: 'mono' }) {   // g7p: monoweight is the line (owner: "monoweigh is looking the best")
    const u = s / 12, X = v => f(v * u), Y = v => T(v * u);
    const pb = Y(4), bd = slabH(o);
    // pediment and beam as one outline (a GABLE on a SLAB, joined), so no coincident corners go through the boolean
    const out = [{ ...P([X(0.25), pb + bd], [X(0.25), pb], [X(6), X(1.667)], [X(11.75), pb], [X(11.75), pb + bd]), root: 'GABLE', also: 'SLAB' }];
    const ct = pb + bd, pl = Y(12) - slabH(o);                        // column tops; plinth top
    const n = 4, span = X(10.5), gap = (span - n * W) / (n - 1), x0 = X(0.75);
    for (let i = 0; i < n; i++) { const cx = x0 + W / 2 + i * (W + gap); out.push(o.style === 'woodcut' ? POSTF(cx, ct - 0.01, pl + 0.01, true, true) : o.style === 'settle' ? POSTT(cx, ct - 0.01, pl + 0.01, wSettle(ct, 0, s), wSettle(pl, 0, s)) : POST(cx, ct - 0.01, pl + 0.01)); }
    out.push(R(X(0.25), pl, X(11.75) - X(0.25), slabH(o), { root: 'SLAB' }));
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
    const crown = B - apex, TK = 1.5, h = crown / (N - 1 + TK), tiers = [];
    for (let i = 1; i <= N; i++) { const by = apex + (i - 1 + TK) * h, hw = hw1 + (hwN - hw1) * (i - 1) / (N - 1); tiers.push([i === 1 ? apex : null, by, hw]); }
    for (let i = 1; i < N; i++) { const [, byU, hwU] = tiers[i - 1], [, byL, hwL] = tiers[i], r_ = (hwU - L) / hwL; tiers[i][0] = (byU - r_ * byL) / (1 - r_); }
    const out = [], tTop = B - W / u;
    for (const [ty, by, hw] of tiers) out.push(GABLE(c, X(ty), Y(by), X(hw)));
    out.push(o.style === 'woodcut' ? POSTF(c, X(tTop), s, true, false) : o.style === 'burin' ? POSTW(c, X(tTop), s, W, (W + FREE) / 2, FREE) : o.style === 'settle' ? POSTT(c, X(tTop), s, wSettle(X(tTop), 0, s), W) : POST(c, X(tTop), s));
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
  const k = 24 / px, w = lw * k, cx = 12, cy = 12 + 0.6 * sc, Rc = 9.6 * sc, ri = Rc * 0.47;
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
  return [P(...outer), cut(P(...offset(cl, w / 2)))];
}
function offset(pts, d) {
  const n = pts.length, lines = [];
  for (let i = 0; i < n; i++) { const a = pts[i], b = pts[(i + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy); lines.push([[a[0] - dy / L * d, a[1] + dx / L * d], [dx, dy]]); }
  const out = [];
  for (let i = 0; i < n; i++) { const [p, e1] = lines[(i - 1 + n) % n], [q, e2] = lines[i]; const den = e1[0] * e2[1] - e1[1] * e2[0], t = ((q[0] - p[0]) * e2[1] - (q[1] - p[1]) * e2[0]) / den; out.push([p[0] + e1[0] * t, p[1] + e1[1] * t]); }
  return out;
}

const BATCH = [['cafe', 'Café'], ['bar', 'Bar'], ['museum', 'Museum'], ['nature', 'Nature']];
module.exports = { W, WH, CUT, DRAW, plus, star, BATCH, KEY, CLASS, TOKEN, APEX, T, FLARE, FREE, WMIN };
