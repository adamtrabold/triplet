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
const GABLE = (cx, apex, base, hw) => ({ ...P([cx, apex], [cx + hw, base], [cx - hw, base]), root: 'GABLE' });

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
  cafe(s = 12) {
    // g7e: the bowl FLOWS into the ear's base in one tangent curve; cup and ear are ONE outline.
    // g7i: the saucer is a SLAB (was a tapered blade: a trapezoid, the owner's example).
    const u = s / 12, X = v => f(v * u), Y = v => T(v * u), K = 0.5523;
    const top = Y(1) / u, wall = 4.667, bot = Y(8) / u, l = 1.5, r = 8.25, mid = (l + r) / 2;
    const eR = 12 - 1 / 3;                                            // the ear's outer back
    const eb = top + 5 + 1 / 3, R_ = (eb - top) / 2, ex = eR - R_;     // ear: outer 5 1/3 tall, its back a half circle
    const body = D(`M${X(l)} ${X(top)}H${X(ex)}C${X(ex + R_ * K)} ${X(top)} ${X(eR)} ${X(top + R_ - R_ * K)} ${X(eR)} ${X(top + R_)}C${X(eR)} ${X(top + R_ + R_ * K)} ${X(ex + R_ * K)} ${X(eb)} ${X(ex)} ${X(eb)}H${X(r)}C${X(r - 1.35)} ${X(eb)} ${X(mid + 1.9)} ${X(bot)} ${X(mid)} ${X(bot)}C${X(l + 1.25)} ${X(bot)} ${X(l)} ${X(bot - 1.167)} ${X(l)} ${X(wall)}Z`, { root: 'VESSEL', also: 'LOOP' });
    const ct = top + WH / u, cb = eb - WH / u, cr = (cb - ct) / 2, cx = eR - W / u - cr;   // counter, its back a half circle
    const ci = r - 1 / 3;
    const counter = cut(D(`M${X(ci)} ${X(ct)}H${X(cx)}C${X(cx + cr * K)} ${X(ct)} ${X(eR - W / u)} ${X(ct + cr - cr * K)} ${X(eR - W / u)} ${X(ct + cr)}C${X(eR - W / u)} ${X(ct + cr + cr * K)} ${X(cx + cr * K)} ${X(cb)} ${X(cx)} ${X(cb)}H${X(ci)}Z`));
    const saucer = SLAB(0, s, T(X(bot) + CUT));
    return [body, saucer, counter];
  },
  // BAR. SQUARE. A VESSEL (a coupe's bowl is shallow) on a POST stem and a SLAB foot about 70% of the bowl.
  // g7i (owner: "i like how the material/phosphor examples have a bit of liquid then a clear space alluded
  // to.. i think that could be helpful to differentiate from a chalice"; and the coupe read "bigger/heavier"):
  // under the rim, a clear band (1 2/3px, over the 1.5px counter minimum, so it stays open at 12 and 24)
  // runs between the walls, and the liquid fills the bowl below it. The band is closed at both ends by the
  // walls, so the bowl reads as a glass holding a drink, not two parts (g5's single line split it into an "I").
  bar(s = 12, o = {}) {
    const u = s / 12, X = v => f(v * u), Y = v => T(v * u), c = s / 2;
    const bd = 5.667;                                                // g7k (owner: "needs a bit more liquid"): 1/3px deeper
    const bowl = D(`M${X(0.5)} ${X(0)}H${X(11.5)}C${X(11.5)} ${X(2.8)} ${X(9)} ${X(bd)} ${X(6)} ${X(bd)}C${X(3)} ${X(bd)} ${X(0.5)} ${X(2.8)} ${X(0.5)} ${X(0)}Z`, { root: 'VESSEL' });
    // The band's walls, two ways (owner, 10-20, on the g7i taper: "i like the handmade look of the taper, but im
    // not sure what in the real world it would allude to"; "i just dont want to lose the no taper option"):
    //   o.taper 'even': an EVEN offset of the bowl, the wall's width all the way down (straight sides between
    //     the true offset points at the band's two edges: 1.5px at both ends, 1.59 at the middle);
    //   otherwise (as shipped since g7i, and the COUNTERPUNCH option): the band is cut by the bowl's own shape
    //     made smaller, so the wall is full (1.5px) at the rim and thins toward the drink (about 1.1px).
    const wall = o.wall || W;
    if (o.style && o.style !== 'punch') o = { ...o, taper: 'even' };   // only the counterpunch cuts the band by the bowl's shape
    // the clear band, under the rim and over the drink: g7k, the counter minimum, 1.5px (was 1 2/3), so the
    // drink stands higher; its surface sits 1/6px off the 1/3px lattice, the one place the counter minimum wins
    const rim = WH, liquid = rim + W;
    let band;
    if (o.taper === 'even') {
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
    const FB = Y(11);
    const stem = o.style === 'woodcut' ? POSTW(c, X(bd - 0.5), FB - WH + 0.01, FLARE, W, FLARE) : POST(c, X(bd - 0.5), FB - WH + 0.01);
    const foot = SLAB(X(2.25), X(9.75), FB - WH);
    return o.band === false ? [bowl, stem, foot] : [bowl, stem, foot, band];
  },
  // MUSEUM. WIDE, its apex passing by 1/2px. A GABLE pediment on a SLAB beam, four POST columns, a SLAB
  // plinth. Counters: the spaces between the columns are plain upright slots (no pills, owner's example).
  museum(s = 12, o = {}) {
    const u = s / 12, X = v => f(v * u), Y = v => T(v * u);
    const pb = Y(4), bd = WH;
    // pediment and beam as one outline (a GABLE on a SLAB, joined), so no coincident corners go through the boolean
    const out = [{ ...P([X(0.25), pb + bd], [X(0.25), pb], [X(6), X(1.667)], [X(11.75), pb], [X(11.75), pb + bd]), root: 'GABLE', also: 'SLAB' }];
    const ct = pb + bd, pl = Y(12) - WH;                              // column tops; plinth top
    const n = 4, span = X(10.5), gap = (span - n * W) / (n - 1), x0 = X(0.75);
    for (let i = 0; i < n; i++) { const cx = x0 + W / 2 + i * (W + gap); out.push(o.style === 'woodcut' ? POSTW(cx, ct - 0.01, pl + 0.01, FLARE, W, FLARE) : POST(cx, ct - 0.01, pl + 0.01)); }
    out.push(SLAB(X(0.25), X(11.75), pl));
    return out;
  },
  // NATURE. TALL, its tip passing by 1/2px. Three GABLE tiers widening by equal steps, on a POST trunk.
  // g7i: each tier is a true GABLE, its base flat (it rose 0.4px to the trunk: a fourth shape for one job).
  nature(s = 12, o = {}) {
    const u = s / 12, X = v => f(v * u), Y = v => T(v * u), c = s / 2;
    // GABLE STACK rule: every notch shelf (the flat underside a tier shows past the tier below) is the same at
    // every notch, set from the line: g7j one line (1.5px; they were 1.45 and 2.14, uneven, and read as
    // steps); g7k (owner: "i think the branches should be a bit more indented -- looks like a triangle at
    // 100%") one and a half lines, 2.25px, so the tiers read at true size. Each lower tier's apex follows.
    const tiers = [[-0.5, 4.25, 2.8], [null, 7.6, 4.1], [null, 10.75, 5.3]], L = 1.5 * W / u;
    for (let i = 1; i < tiers.length; i++) { const [, byU, hwU] = tiers[i - 1], [, byL, hwL] = tiers[i], r = (hwU - L) / hwL; tiers[i][0] = (byU - r * byL) / (1 - r); }
    const out = [];
    for (const [ty, by, hw] of tiers) out.push(GABLE(c, X(ty), Y(by), X(hw)));
    out.push(o.style === 'woodcut' ? POSTW(c, X(9.5), s, FLARE, (FLARE + W) / 2, W) : o.style === 'burin' ? POSTW(c, X(9.5), s, W, (W + FREE) / 2, FREE) : POST(c, X(9.5), s));
    return out;
  },
};

// ---- the two UI icons, each in its own 24 viewBox, shown at its app size ----
function plus(px = 26.4, sc = 1, lw = W, style) {
  // g7i: OPEN class. Both arms are POSTs of the full 1.5px (no thinner horizontal: an open mark has no
  // mass to balance); sc is set by the grid's fit (boards7.js), never by hand.
  const k = 24 / px, w = lw * k, L = 14 * sc;
  if (style === 'burin') { const e = FREE * k, h = L / 2; return [P([12 - w / 2, 12], [12 - e / 2, 12 - h], [12 + e / 2, 12 - h], [12 + w / 2, 12], [12 + e / 2, 12 + h], [12 - e / 2, 12 + h]), P([12, 12 - w / 2], [12 - h, 12 - e / 2], [12 - h, 12 + e / 2], [12, 12 + w / 2], [12 + h, 12 + e / 2], [12 + h, 12 - e / 2])]; }
  return [R(12 - w / 2, 12 - L / 2, w, L), R(12 - L / 2, 12 - w / 2, L, w)];
}
function star(px = 20, sc = 1, lw = W, style) {
  // g7j: OUTLINE class (hull at least the coin, hole at least two lines across); sc is set by the grid (boards7.js, starRc()).
  const k = 24 / px, w = lw * k, cx = 12, cy = 12 + 0.6 * sc, Rc = 9.6 * sc, ri = Rc * 0.47;
  const cl = []; for (let i = 0; i < 10; i++) { const r = i % 2 ? ri : Rc, a = -Math.PI / 2 + i * Math.PI / 5; cl.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
  const outer = offset(cl, -w / 2);
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
module.exports = { W, WH, CUT, DRAW, plus, star, BATCH, KEY, CLASS, TOKEN, APEX, T, FLARE, FREE };
