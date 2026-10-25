// Grid engine: simple shapes -> one joined outline -> corner law -> SVG path data.
// Node only (paper.js for the booleans). Every glyph on the grid boards is built here,
// so a skeleton is always a real single path with real holes (no paper-coloured fakes).
//
// Primitives (all in the glyph's own units; y down):
//   R(x,y,w,h)            rectangle
//   C(cx,cy,r)            disc
//   P([x,y],...)          polygon
//   B([x1,y1],[x2,y2],w)  bar: a straight member of width w, butt ends
//   O(cx,cy,r,w)          ring: centreline radius r, width w
//   A(cx,cy,r,w,a0,a1)    arc member (degrees, 0 = east, clockwise on screen), butt ends
//   I(p, q)               intersection of two primitives (g7i: the coupe's clear band, inside its bowl)
//   any primitive with .cut = true is subtracted after the union.
//   .pen = true marks a member drawn with the concept's pen (its width is the line).
'use strict';
const path = require('path');
const paper = require(path.join(process.env.TOOLS || '/tmp/claude-0/-home-user-la-trip-map/04f8fb34-0476-5960-add5-8bd3d6d8820e/scratchpad/tools', 'node_modules/paper/dist/paper-core.js'));
paper.setup(new paper.Size(1000, 1000));
const { Path, Point, CompoundPath } = paper;

const R = (x, y, w, h, o = {}) => ({ t: 'R', x, y, w, h, ...o });
const C = (cx, cy, r, o = {}) => ({ t: 'C', cx, cy, r, ...o });
const P = (...pts) => ({ t: 'P', pts });
const B = (a, b, w, o = {}) => ({ t: 'B', a, b, w, ...o });
const O = (cx, cy, r, w, o = {}) => ({ t: 'O', cx, cy, r, w, ...o });
const A = (cx, cy, r, w, a0, a1, o = {}) => ({ t: 'A', cx, cy, r, w, a0, a1, ...o });
const S = (cx, cy, r, a0, a1, o = {}) => ({ t: 'S', cx, cy, r, a0, a1, ...o });
const D = (d, o = {}) => ({ t: 'D', d, ...o }); // a drawn closed path (SVG path data, glyph units)
const I = (p, q, o = {}) => ({ t: 'I', p, q, ...o });
const cut = (p) => ({ ...p, cut: true });
// E(of, w, clip): a COUNTER cut as the outline of `of` (after the corner law) moved in by w, everywhere at once
// (g7r, monoweight: "every inner edge is a true parallel offset of its outer edge"); clip, a primitive, keeps
// only the part of it that is the counter (the coupe's band stops at the drink). Always a cut.
const E = (of, w, clip = null, o = {}) => ({ t: 'E', of, w, clip, cut: true, ...o });
const pen = (p) => ({ ...p, pen: true });

function toItem(q, penW) {
  const w = q.pen && penW ? penW : q.w;
  switch (q.t) {
    case 'I': { const a = toItem(q.p, penW), b = toItem(q.q, penW), r = a.intersect(b); a.remove(); b.remove(); return r; }
    case 'E': { const of = join(q.of, penW), h = erode(of.pathData, q.w); of.remove(); if (!q.clip) return h; const c = toItem(q.clip, penW), r = h.intersect(c); h.remove(); c.remove(); return r; }   // construction only (before the law)
    case 'R': return new Path.Rectangle(q.x, q.y, q.w, q.h);
    case 'C': return new Path.Circle(new Point(q.cx, q.cy), q.r);
    case 'D': { const it = new CompoundPath(q.d); if (q.m) { it.scale(q.m[0], new Point(q.m[1], q.m[2])); it.translate(new Point(q.m[3] - q.m[1], q.m[4] - q.m[2])); } return it; }
    case 'P': return new Path({ segments: q.pts.map(p => new Point(p[0], p[1])), closed: true });
    case 'B': {
      const a = new Point(q.a), b = new Point(q.b), n = b.subtract(a).normalize().rotate(90).multiply(w / 2);
      return new Path({ segments: [a.add(n), b.add(n), b.subtract(n), a.subtract(n)], closed: true });
    }
    case 'O': {
      const o = new Path.Circle(new Point(q.cx, q.cy), q.r + w / 2), i = new Path.Circle(new Point(q.cx, q.cy), q.r - w / 2);
      const res = o.subtract(i); o.remove(); i.remove(); return res;
    }
    case 'S': { // pie sector (a quarter disc is S(cx,cy,r,0,90))
      const rad = d => d * Math.PI / 180, pt = d => new Point(q.cx + q.r * Math.cos(rad(d)), q.cy + q.r * Math.sin(rad(d)));
      const p = new Path({ closed: true });
      p.moveTo(new Point(q.cx, q.cy)); p.lineTo(pt(q.a0)); p.arcTo(pt((q.a0 + q.a1) / 2), pt(q.a1)); p.closePath();
      return p;
    }
    case 'A': {
      const rad = d => d * Math.PI / 180, pt = (r, d) => new Point(q.cx + r * Math.cos(rad(d)), q.cy + r * Math.sin(rad(d)));
      const ro = q.r + w / 2, ri = q.r - w / 2, m = (q.a0 + q.a1) / 2;
      const p = new Path({ closed: true });
      p.moveTo(pt(ro, q.a0)); p.arcTo(pt(ro, m), pt(ro, q.a1)); p.lineTo(pt(ri, q.a1)); p.arcTo(pt(ri, m), pt(ri, q.a0)); p.closePath();
      return p;
    }
  }
  throw new Error('bad prim ' + q.t);
}

// Union of every non-cut primitive, minus every cut one.
function join(prims, penW) {
  let acc = null;
  for (const q of prims.filter(p => !p.cut)) {
    const it = toItem(q, penW);
    acc = acc ? (() => { const u = acc.unite(it); acc.remove(); it.remove(); return u; })() : it;
  }
  for (const q of prims.filter(p => p.cut)) {
    const it = toItem(q, penW), s = acc.subtract(it); acc.remove(); it.remove(); acc = s;
  }
  return acc;
}

// ---- corners
// For every corner of the joined outline: is it convex (the ink side is the inside of the
// turn) and what is its interior angle on the ink side? The law gives a radius; the corner is
// replaced by ONE cubic (a circular-arc fit), so each rounded corner adds exactly one curve.
const r3 = v => Math.round(v * 1000) / 1000, r3g = r3;
function corners(item, law, info, opts = {}) {
  // g7as TIPS LAND WHERE THEY WERE (director, turn 133: "keep the tip's length by running the flanks on, not by fattening the
  // nose"): with opts.join.tipLand, a sharp tip keeps the eased tip's nose (J.tipKeep 'crest') and still lands exactly where
  // the eased tip's point was: its two edges are re-aimed (each turned and scaled about its other end) so that they meet
  // just far enough beyond that point for the short round to end on it. The flanks then run straight (their own drawn bend)
  // right up into the nose, which is what the eye already read as the tip's line; the silhouette keeps its size.
  if (opts.join && opts.join.fair && opts.join.tipLand && !opts._probe) {
    // per tip: where its point was (T, the eased tip's apex on the drawing as drawn) and its nose (kC, the eased tip's peak
    // bend there); each pass re-aims the edges and moves the corner by what the apex still misses
    const tips = [];
    for (let pass = 0; pass < (opts.join.tipLand === true ? 3 : opts.join.tipLand); pass++) {
      const probe = [], cl = item.clone({ insert: false }); corners(cl, law, null, { ...opts, _probe: probe, join: { ...opts.join, _tips: tips } }); cl.remove();
      if (!probe.length) break;
      for (const h of probe) { let tp = tips.find(x => x.P.getDistance(h.P0) < 1e-6); if (!tp) { tp = { T: h.M0, kC: h.kC, P: h.P0 }; tips.push(tp); } tp.Q = h.P0.add(tp.T.subtract(h.M)); tp.err = tp.T.getDistance(h.M); }
      const kidsT = item instanceof CompoundPath ? item.children.slice() : [item];
      for (const p of kidsT) {
        const segs = p.segments, n = segs.length, P = segs.map(s => s.point.clone()), Q = P.map(pt => { const h = tips.find(x => x.P.getDistance(pt) < 1e-6); return h ? h.Q : pt; });
        if (Q.every((q, i) => q === P[i])) continue;
        const hIn = segs.map(s => s.handleIn.clone()), hOut = segs.map(s => s.handleOut.clone());
        const cmul = (v, a, b) => new Point(v.x * a - v.y * b, v.x * b + v.y * a);
        for (let j = 0; j < n; j++) {
          const k = (j + 1) % n, A = P[j], B = P[k], A2 = Q[j], B2 = Q[k], dv = B.subtract(A), dv2 = B2.subtract(A2), den = dv.x * dv.x + dv.y * dv.y; if (den < 1e-12) continue;
          const qa = (dv2.x * dv.x + dv2.y * dv.y) / den, qb = (dv2.y * dv.x - dv2.x * dv.y) / den;   // q = dv2 / dv (complex)
          segs[j].handleOut = cmul(hOut[j], qa, qb); segs[k].handleIn = cmul(hIn[k], qa, qb);
        }
        for (let j = 0; j < n; j++) segs[j].point = Q[j];
      }
      for (const tp of tips) tp.P = tp.Q;
      if (process.env.TIPDBG) console.error('tipLand pass', pass, tips.map(x => x.err.toFixed(4)).join(' '));
    }
    opts = { ...opts, join: { ...opts.join, _tips: tips } };
  }
  const kids = item instanceof CompoundPath ? item.children.slice() : [item];
  const out = [];
  for (const p of kids) {
    // g7s (owner: "tight interior corners should be less rounded than exterior corners"; on the eroded star:
    // "far too rounded on the interior joins"): with opts.tightHoles, every corner of a COUNTER takes the
    // inside round, whichever way the ink turns there
    const isHole = opts.tightHoles && kids.filter(k => k !== p && k.contains(p.firstSegment.point)).length % 2 === 1;
    // drop slivers the booleans leave where two parts meet almost tangent
    for (let i = p.segments.length - 1; i > 0 && p.segments.length > 3; i--) {
      const s = p.segments[i], q = p.segments[i - 1];
      if (s.point.getDistance(q.point) < 0.06) { q.handleOut = s.handleOut; s.remove(); }
    }
    const curves = p.curves, n = curves.length;
    const cs = []; // per segment i (start of curve i): corner data
    for (let i = 0; i < n; i++) {
      const prev = curves[(i - 1 + n) % n], next = curves[i];
      const tin = prev.getTangentAtTime(1), tout = next.getTangentAtTime(0);
      const turn = Math.atan2(tin.x * tout.y - tin.y * tout.x, tin.dot(tout)); // signed turn
      const ang = Math.abs(turn);
      if (ang < 0.02) { cs.push(null); continue; }
      const P0 = next.point1, bis = tout.subtract(tin).normalize();
      const probe = P0.add(bis.multiply(0.05));
      const convex = item.contains(probe);
      const interior = 180 - ang * 180 / Math.PI; // angle on the turn's inside
      const inkAngle = convex ? interior : interior; // for concave, the empty side holds `interior`
      const straight = prev.isStraight() && next.isStraight();
      const lin = prev.length, lout = next.length;
      let r = law({ convex: isHole ? false : convex, hole: isHole, angle: inkAngle, lin, lout, straight, pt: [P0.x, P0.y] });
      // an INK TRAP (g7 fix, contrast compensation at joins): the law may return { trap: [a, t] } for
      // a join; the corner is then cut by a small V: from a point a back along each edge to a point t
      // into the ink along the corner's bisector, thinning the join instead of adding ink to it.
      if (r && r.trap) { cs.push({ d: r.trap[0], trap: true, N: P0.add(bis.multiply(-r.trap[1])), ang, turn, convex, angle: inkAngle }); if (info) info.push({ trap: true, x: r3(P0.x), y: r3(P0.y) }); continue; }
      if (!r || r <= 0) { cs.push(null); continue; }
      // g7u EASE (a curve rule, exploration): opts.ease = e > 1 starts the round e times farther from the
      // corner and pulls both handles to the corner, so the curve eases out of the line with no jump in
      // curvature (a hand's stroke, not a compass arc); e = 2.3 keeps the corner about as deep as the arc
      // a counter's corners stay tight compass rounds (tight interior), so its walls stay one line all round
      // g7y: line ENDS (a corner on an edge shorter than 2 lines: the end of a slab, a stem, a trunk) keep the
      // law's plain round, so terminals read the same in every icon; only the corners of masses and joins ease
      // g7aq ONE JOIN (owner on v222: "the join patterns for sharp corners like this tree don't seem to be the same quite
      // yet at a pattern level"): the length test above split corners of one kind by the size of their edges (the tree's
      // bottom tips and apex eased, its upper tips plain arcs). opts.join = { ease, holes, ends } makes the ease a rule of
      // the corner's KIND: every corner of a mass eases; counters ease when join.holes; line ends when join.ends.
      // With opts.join: the OUTSIDE corners of a mass (convex, not a line end, not a counter) ease, whatever their size;
      // every other corner (joins, flares, notches, counters, line ends) takes the compact JOIN ROUND (joinRound below).
      const J = opts.join, isEnd = convex && Math.abs(ang - Math.PI / 2) < 0.2 && Math.min(lin, lout) < 3;
      const ez = J ? (convex && !isHole && !isEnd ? J.ease : 0) : opts.ease && !isHole && Math.min(lin, lout) >= 3 ? opts.ease : 0;
      // with opts.join every round is the JOIN ROUND (below): it starts join.trim times as far from the corner as the
      // compass arc of the law's radius would, so it has room to ease in and out
      let d = J && !ez ? r * Math.tan(ang / 2) * J.trim : r * Math.tan(ang / 2) * (ez || 1);
      cs.push({ d, d0: d, r, ang, turn, convex, angle: inkAngle, ease: !!ez, jr: !!J && !ez, P0, bis, tin, tout, hole: isHole, end: isEnd });
      if (info) info.push({ x: r3(P0.x), y: r3(P0.y), r: r3(r), convex, angle: Math.round(inkAngle) });
    }
    // g7aq COUNTER ENDS (owner on v222, the coupe's band: "im still concerned that the counter edge looks less curved than
    // the exterior edge"): with opts.join.ends2, a counter's END (an edge shorter than join.ends2 between two corners
    // that turn the same way and is itself a curve, e.g. the band's end against the bowl; a slot's straight end is not) is drawn as one curve: its two corners' rounds grow
    // until they meet at the end's middle, so the end follows the wall beside it instead of reading as a straight cut.
    if (opts.join && opts.join.ends2 && isHole) for (let i = 0; i < n; i++) {
      const a = cs[i], b = cs[(i + 1) % n], cv = curves[i], L = cv.length;
      if (!a || !b || cv.isStraight() || L >= opts.join.ends2 || Math.sign(a.turn) !== Math.sign(b.turn)) continue;   // an end that is itself a curve: it runs beside a curved wall
      for (const c of [a, b]) { const k = (L / 2) / c.d; c.r *= k; c.d = L / 2; c.d0 = c.d; }
    }
    // COLLISION RULE (g6 fix): two rounds that want more than a straight edge holds, where the edge
    // ends in two right-angle turns the same way (a slot end, a bar end), become ONE true arc: a
    // semicircle of radius L/2 centred on the edge, drawn as two equal quarter arcs meeting at its middle.
    const caps = new Set();
    if (!opts.noCaps && !opts.join) for (let i = 0; i < n; i++) {
      const a = cs[i], b = cs[(i + 1) % n], cv = curves[i], L = cv.length;
      if (!a || !b || a.trap || b.trap || !cv.isStraight() || a.d + b.d <= L - 0.2) continue;   // they collide, or would leave a sliver
      const q = Math.PI / 2;
      if (Math.sign(a.turn) !== Math.sign(b.turn) || Math.abs(Math.abs(a.turn) - q) > 0.03 || Math.abs(Math.abs(b.turn) - q) > 0.03) continue;
      caps.add(i); a.d = L / 2; b.d = L / 2; a.cap = 'start'; b.cap = 'end';
      if (info) info.push({ cap: true, x: r3(cv.getPointAtTime(0.5).x), y: r3(cv.getPointAtTime(0.5).y), r: r3(L / 2) });
    }
    // clamp: two trims on one curve never pass each other
    for (let i = 0; i < n; i++) {
      if (caps.has(i)) continue;
      const a = cs[i], b = cs[(i + 1) % n], L = curves[i].length;
      const da = a ? a.d : 0, db = b ? b.d : 0;
      // two trims that would pass each other, or leave a run under 0.2px (a sliver), share the edge
      // exactly: both scale by the same factor so they meet, and the edge vanishes evenly (symmetric)
      if (a && b && (a.cap || b.cap) && da + db > L - 0.2) { // a semicircle keeps its size; the other round gives way
        if (a.cap && b.cap) continue;
        const keep = a.cap ? a : b, give = a.cap ? b : a; give.d = Math.max(0, L - keep.d);
      }
      else if (a && b && da + db > L - 0.2) { const k = L / (da + db); a.d *= k; b.d *= k; }
      else if (da + db > L * 0.96) { const k = (L * 0.96) / (da + db); if (a) a.d = Math.min(a.d, a.d * k); if (b) b.d = Math.min(b.d, b.d * k); }
    }
    for (let i = 0; i < n; i++) if (cs[i] && cs[i].d < 0.005) cs[i] = null; // a round that gave way entirely is a plain corner
    // g7aq: a join round that can't be solved evenly where it meets a curved edge (the edge bends hard right at the corner,
    // as a flare drawn from a beam's end does) slides its end along that edge, up to three times its trim, to where the
    // edge has eased enough for one even round: the corner and the flare become one built transition, not a knuckle
    // g7ar HILL JOINS (owner on v223: "not at the join itself, but on the line coming out of it"): with opts.join.fair every
    // round, eased tips included, is drawn by hillRound (below): its curvature rises from each edge's own and falls back as
    // one smooth, even hill, cresting at the law's radius. Two passes: each round first says how much of its edges it
    // wants (alone); then an edge two rounds both want is shared in proportion to what they asked, and each is solved
    // within its share (if the law's crest doesn't fit its share, the g7aq depth is kept instead).
    if (opts.join && opts.join.fair) {
      // g7as DRAWN BENDS START FROM NO BEND (director, turn 133, the cup's handle: "a drawn bend that meets a straight starts
      // from no bend, and the arc may shift by the tiny amount that takes"): where a drawn arc runs on from a line (or a gentler
      // bend) with no corner, its bend switched on at once (a step in curvature, the check's JUMP). With opts.join.arcEase the
      // arc's half from that node to its middle is redrawn: the bend ramps up from the edge's own by the same even ramp the
      // rounds use, then holds a slightly tighter arc to the middle, which it reaches exactly (place, direction, and the same
      // bend from both sides). The ramp starts a little back along the line, so the arc moves in by a hair (reported).
      if (opts.join.arcEase) for (let i = 0; i < n; i++) {
        if (cs[i]) continue;
        const cin = curves[(i - 1 + n) % n], cout = curves[i];
        const kin = cin.isStraight() ? 0 : kOf(cin, 1), kout = cout.isStraight() ? 0 : kOf(cout, 0);
        if (Math.abs(kin - kout) < (opts.join.arcJump ?? 0.05)) continue;
        const arcOut = Math.abs(kout) > Math.abs(kin), arc = arcOut ? cout : cin, edge = arcOut ? cin : cout;
        if (arc.isStraight()) continue;
        const kq = [0.02, 0.5, 0.98].map(q => kOf(arc, q)); if (Math.max(...kq) - Math.min(...kq) > 0.03 * Math.abs(kq[1])) continue;   // a true arc only
        const nxt = arcOut ? (i + 1) % n : (i - 1 + n) % n, farNode = arcOut ? curves[(i + 1) % n] : curves[(i - 2 + n) % n];
        const farK = farNode.isStraight() ? 0 : kOf(farNode, arcOut ? 0 : 1), farSmooth = !cs[nxt] && Math.abs(farK - kq[1]) < 0.03 * Math.abs(kq[1]);
        const dQ = farSmooth ? arc.length : arc.length / 2;   // to the arc's middle: its own, or past a smooth node into its other piece
        // the edge's room: what the corner at its far end (if any) leaves of it
        const eFar = arcOut ? cs[(i - 1 + n) % n] : cs[(i + 1) % n], room = edge.length - (eFar && !eFar.arcEase ? (eFar.d || 0) * 1.6 + 0.05 : edge.length / 2);
        const sol = arcEase(edge, arc, arcOut, dQ, { ...opts.join, room });
        if (opts.join.log) opts.join.log.push(sol ? 'arcEase' : 'noArcEase');
        if (!sol) continue;
        cs[i] = { arcEase: true, sSpan: true, jrSol: sol.sol, dIn: arcOut ? sol.a : dQ, dOut: arcOut ? dQ : sol.a, turn: 0, ang: 0, d: 0, P0: cout.point1, shift: sol.shift };
        if (opts.join.arcLog) opts.join.arcLog.push({ at: [cout.point1.x, cout.point1.y], k: kq[1], k2: sol.k2, a: sol.a, shift: sol.shift, n: sol.sol.length });
      }
      // a corner running straight into a short drawn bend the other way (a beam's end into a capital's flare): the corner
      // and the bend become ONE S, from the corner's straight edge to where the bend meets what follows it (taking that
      // edge's curvature there, so the post runs on with no step); the S crosses straight at its middle (g7aq's S rule)
      for (let i = 0; i < n; i++) {
        const b = cs[i]; if (!b || b.trap || b.arcEase) continue;
        for (const side of ['out', 'in']) {
          const ce = side === 'out' ? curves[i] : curves[(i - 1 + n) % n], other = side === 'out' ? curves[(i - 1 + n) % n] : curves[i];
          if (ce.isStraight() || ce.length > 2) continue;
          const kc = kOf(ce, side === 'out' ? 0.02 : 0.98); if (!(Math.sign(kc) === -Math.sign(b.turn) && Math.abs(kc) > 0.3)) continue;
          const far = side === 'out' ? (i + 1) % n : (i - 1 + n) % n, fc = cs[far];   // the join at the bend's far end
          if (fc) continue;
          const beyond = side === 'out' ? curves[(i + 1) % n] : curves[(i - 2 + n) % n], kBy = beyond.isStraight() ? 0 : kOf(beyond, side === 'out' ? 0 : 1);
          const dS = Math.min(b.d, other.length * 0.5), tS = side === 'out' ? other.getTimeAt(other.length - dS) : other.getTimeAt(dS); if (tS == null) continue;
          const pS = other.getPointAtTime(tS), tgS = other.getTangentAtTime(tS), kS = other.isStraight() ? 0 : kOf(other, tS);
          const pE = side === 'out' ? ce.getPointAtTime(1) : ce.getPointAtTime(0), tgE = side === 'out' ? ce.getTangentAtTime(1) : ce.getTangentAtTime(0);
          const [pA, tA, kA, pB, tB, kB] = side === 'out' ? [pS, tgS, kS, pE, tgE, kBy] : [pE, tgE, kBy, pS, tgS, kS];
          const u = tA.add(tB).normalize(), D_ = pB.subtract(pA), al = D_.dot(u), Mid = pA.add(pB).multiply(0.5), tM = u.multiply(al).add(D_.subtract(u.multiply(al)).multiply(2)).normalize();
          const h1 = g2Handles(pA, tA, kA, Mid, tM, 0), h2 = g2Handles(Mid, tM, 0, pB, tB, kB); if (!h1 || !h2) continue;
          b.jrSol = [[pA, pA.add(tA.multiply(h1[0])), Mid.subtract(tM.multiply(h1[1])), Mid], [Mid, Mid.add(tM.multiply(h2[0])), pB.subtract(tB.multiply(h2[1])), pB]];
          if (side === 'out') { b.dIn = dS; b.dOut = ce.length; } else { b.dIn = ce.length; b.dOut = dS; }
          b.sSpan = true;
          if (opts.join.log) opts.join.log.push('S');
          break;
        }
      }
      const want = cs.map((b, i) => { if (!b || b.trap) return null; if (b.sSpan) return [b.dIn, b.dOut]; const w = hillRound(curves[(i - 1 + n) % n], curves[i], b, curves[(i - 1 + n) % n].length * 0.98, curves[i].length * 0.98, { ...opts.join, solveOnly: true }); return w ? [w.dI, w.dO] : [b.d, b.d]; });
      for (let i = 0; i < n; i++) {
        const b = cs[i]; if (!b || b.trap || b.sSpan) continue;
        const cin = curves[(i - 1 + n) % n], cout = curves[i], wI = want[i][0], wO = want[i][1];   // cin runs from corner i-1 to corner i
        const pw = want[(i - 1 + n) % n], nw = want[(i + 1) % n];
        // two rounds that between them want all but a sliver of the edge (or more) meet exactly on it: no sliver of edge is left
        // between them (a sliver of a drawn curve can carry a bend of its own, a step either side)
        const share = (mine, other, L) => other == null || mine + other <= L - 0.08 ? L - (other || 0) : L * mine / (mine + other);
        const roomIn = share(wI, pw ? pw[1] : null, cin.length), roomOut = share(wO, nw ? nw[0] : null, cout.length);
        // the law's crest; if it doesn't fit its share, the g7aq depth; if that doesn't either, the round takes all its room
        // on the short side and its crest tightens to fit (a round never pushes into its neighbour)
        let sol = hillRound(cin, cout, b, roomIn, roomOut, opts.join) || hillRound(cin, cout, b, roomIn, roomOut, { ...opts.join, tipKeep: undefined, hillKeep: 'fit', fitSide: wO - roomOut >= wI - roomIn ? 'out' : 'in' })
          || hillRound(cin, cout, b, roomIn, roomOut, { ...opts.join, tipKeep: undefined, hillKeep: 'depth' });
        if (opts.join.log) opts.join.log.push(sol ? 'fair' : 'nofair');
        if (process.env.FAIRDBG && !sol) console.error(b.P0.x.toFixed(2), b.P0.y.toFixed(2), b.ease ? 'EASE' : 'jr', 'NO', 'd', b.d.toFixed(2), 'want', wI.toFixed(2), wO.toFixed(2), 'room', roomIn.toFixed(2), roomOut.toFixed(2), 'turn', (b.turn * 180 / Math.PI).toFixed(0), 'edges', cin.isStraight() ? 'L' : 'C', cout.isStraight() ? 'L' : 'C');
        if (process.env.FAIRDBG && sol) console.error(b.P0.x.toFixed(2), b.P0.y.toFixed(2), b.ease ? 'EASE' : 'jr', 'd', b.d.toFixed(2), '->', sol.dI.toFixed(2), sol.dO.toFixed(2), 'kM', (sol.kM ?? 0).toFixed(2), 'dz', (sol.dDepth ?? 0).toFixed(3), 'cubics', sol.sol.length);
        if (process.env.FAIRDBG3 && sol) for (const P of sol.sol) { const c_ = P[0].getDistance(P[3]), h0 = P[0].getDistance(P[1]), h1 = P[3].getDistance(P[2]); if (Math.min(h0, h1) < 0.1 * c_) console.error("DEGEN", b.P0.x.toFixed(2), b.P0.y.toFixed(2), P[0].x.toFixed(3), P[0].y.toFixed(3), "chord", c_.toFixed(3), "h", h0.toFixed(4), h1.toFixed(4), "n", sol.sol.length); }
        if (opts._probe && b.ease && b.angle < (opts.join.tipAngle ?? 75) && sol && sol.M && sol.kM && Math.abs(sol.dDepth) > 1e-4) opts._probe.push({ P0: b.P0.clone(), M0: sol.M0, M: sol.M, bis: b.bis, kC: sol.kM });
        // g7au LEANED FLARE (owner on v228: "On the corner types on the coupe, there is still an awkward hump on the bowl and
        // foot on either side as a result of the round shape"): a round between a LINE and a gentle CURVE THAT BENDS THE OTHER
        // WAY (a stem into a bowl or a foot, a handle into a cup's side; gentle: its bend under a quarter of the round's) was an
        // even hill, its bend split half and half. The curve meets the corner nearly level, so it ran on level into a shelf
        // and the round sat on it as a knuckle: the hump. With opts.join.flareLean = R the round leans onto the curve: its run
        // along the curve is R times its run along the line (1.75: the most the even hill leans with a real half left on the
        // line; at 2 that half shrinks to a step), and it crests at the corner law's own radius (the plain hill crested
        // tighter). Both runs are scaled together until it does; its crest slides off the bisector toward the line.
        if (sol && opts.join.flareLean && !b.convex && !b.ease) {
          const kI = cin.isStraight() ? 0 : kOf(cin, 0.999), kO = cout.isStraight() ? 0 : kOf(cout, 0.001), sg = Math.sign(b.turn);
          const gentle = k => Math.abs(k) > 0.03 && Math.abs(k) < 0.25 * Math.abs(sol.kM), lineK = k => Math.abs(k) < 1e-3;
          const side = Math.sign(kI) === -sg && gentle(kI) && lineK(kO) ? 'in' : Math.sign(kO) === -sg && gentle(kO) && lineK(kI) ? 'out' : null;
          if (side) {
            const R = opts.join.flareLean, lineBase = side === 'in' ? sol.dO : sol.dI, far = side === 'in' ? Math.min(roomIn, cin.length * 0.98) : Math.min(roomOut, cout.length * 0.98);
            const lineRoom = side === 'in' ? roomOut : roomIn, kL = 1 / b.r;
            const tryS = sc => { const lineL = Math.min(lineRoom, lineBase * sc), curveL = Math.min(far, R * lineL), rI = side === 'in' ? curveL : lineL, rO = side === 'out' ? curveL : lineL;
              const s2 = hillRound(cin, cout, b, rI, rO, { ...opts.join, tipKeep: undefined, hillKeep: 'flare', flareFrom: sol }); return s2 ? { s2, g: Math.abs(s2.kM) - kL } : null; };
            const T0 = (sol.dI + sol.dO) / (1 + R) / lineBase; let a = T0, ea = tryS(a), c_ = T0 * 1.25, ec = tryS(c_), got = null;
            for (let it = 0; it < 12 && ea && ec; it++) { if (Math.abs(ec.g) < 1e-3 * kL) { got = ec; break; } const n_ = Math.max(0.3, Math.min(3, c_ - ec.g * (c_ - a) / (ec.g - ea.g || 1e-9))); a = c_; ea = ec; c_ = n_; ec = tryS(c_); }
            if (process.env.FLAREDBG) console.error('flare', b.P0.x.toFixed(2), b.P0.y.toFixed(2), side, got ? 'dI ' + got.s2.dI.toFixed(3) + ' dO ' + got.s2.dO.toFixed(3) + ' kM ' + got.s2.kM.toFixed(2) : 'FAIL (plain hill kept)');
            if (opts.join.flareLog) opts.join.flareLog.push(got ? { at: [b.P0.x, b.P0.y], side, dI: got.s2.dI, dO: got.s2.dO, kM: got.s2.kM, plain: [sol.dI, sol.dO, sol.kM] } : { at: [b.P0.x, b.P0.y], fail: true });
            if (got) { sol = got.s2; b.flared = side; }
          }
        }
        if (sol) { b.dIn = sol.dI; b.dOut = sol.dO; b.jrSol = sol.sol; b.crest = sol.M; b.kM = sol.kM; } else { b.dIn = Math.min(b.d, roomIn); b.dOut = Math.min(b.d, roomOut); }
      }
    }
    if (opts.join && !opts.join.fair) for (let i = 0; i < n; i++) {
      const b = cs[i]; if (!b || !b.jr || caps.has(i) || caps.has((i - 1 + n) % n)) continue;
      const cin = curves[(i - 1 + n) % n], cout = curves[i], nxt = cs[(i + 1) % n], prv = cs[(i - 2 + n) % n];
      const roomOut = cout.length - (nxt ? (nxt.dIn ?? nxt.d) : 0) - 0.05, roomIn = cin.length - (prv ? (prv.dOut ?? prv.d) : 0) - 0.05;
      // one == 'jr': the two-half join round; 'one': a single even cubic (it may turn from convex to concave once, as a
      // corner flowing into a flare must), its tightest bend no tighter than the law's round allows (3 / r)
      const at = (dI, dO, how) => {
        const t1 = cin.getTimeAt(cin.length - dI), tb = cout.getTimeAt(dO); if (t1 == null || tb == null) return null;
        const pA = cin.getPointAtTime(t1), tA = cin.getTangentAtTime(t1), pB = cout.getPointAtTime(tb), tB = cout.getTangentAtTime(tb);
        const kA = cin.isStraight() ? 0 : kOf(cin, t1), kB = cout.isStraight() ? 0 : kOf(cout, tb);
        if (how === 'jr') return joinRound(b, pA, tA, kA, pB, tB, kB);
        if (how === 'ss') {   // an S through the chord's middle: two even halves, straight (curvature 0) where they meet
          // the S turns at the chord's middle, leaning twice as far from the edges' direction as the chord does (so each half has room to bend)
          const u = tA.add(tB).normalize(), D_ = pB.subtract(pA), al = D_.dot(u), Mid = pA.add(pB).multiply(0.5), tM = u.multiply(al).add(D_.subtract(u.multiply(al)).multiply(2)).normalize();
          const h1 = g2Handles(pA, tA, kA, Mid, tM, 0), h2 = g2Handles(Mid, tM, 0, pB, tB, kB); if (!h1 || !h2) return null;
          return [[pA, pA.add(tA.multiply(h1[0])), Mid.subtract(tM.multiply(h1[1])), Mid], [Mid, Mid.add(tM.multiply(h2[0])), pB.subtract(tB.multiply(h2[1])), pB]];
        }
        const h = g2Handles(pA, tA, kA, pB, tB, kB); if (!h) return null;
        const P = [pA, pA.add(tA.multiply(h[0])), pB.subtract(tB.multiply(h[1])), pB]; let flips = 0, last = 0;
        for (let q = 0; q <= 40; q++) { const k = kBez(P, q / 40); if (Math.abs(k) > 3 / b.r) return null; const sg = Math.abs(k) < 0.05 ? 0 : Math.sign(k); if (sg && last && sg !== last) flips++; if (sg) last = sg; }
        return flips <= 1 ? [P] : null;
      };
      if (at(b.d, b.d, 'jr')) continue;
      let best = null;
      for (const how of ['jr', 'one']) { for (const f of [1, 1.25, 1.5, 2, 2.5, 3]) for (const [mi, mo] of [[1, f], [f, 1], [f, f]]) {
        if (cin.isStraight() && cout.isStraight()) continue;   // two straight edges always solve; a curved edge on either side may need room on both
        const dI = Math.min(b.d * mi, roomIn), dO = Math.min(b.d * mo, roomOut); if (dI <= 0 || dO <= 0) continue;
        const sol = at(dI, dO, how); if (sol && (!best || dI + dO < best.dI + best.dO)) best = { dI, dO, sol };
      } if (best) break; }
      // still none: the curved edge is mostly a bend of its own the other way (a flare drawn from a beam's end); the round
      // and that bend become ONE S, from the straight edge to where the curved edge ends, through the middle of its chord
      if (!best) { const curvedOut = !cout.isStraight(), dI = curvedOut ? b.d : Math.max(0.01, roomIn), dO = curvedOut ? Math.max(0.01, roomOut) : b.d; const sol = at(dI, dO, 'ss'); if (sol) best = { dI, dO, sol }; }
      if (best) { b.dIn = best.dI; b.dOut = best.dO; b.jrSol = best.sol; }
    }
    // emit: trimmed curves + one cubic per rounded corner
    const segs = []; // cubic list [p0,c1,c2,p3]
    const part = (cv, t0, t1) => {
      const c = cv.getPart(t0, t1);
      return [c.point1, c.point1.add(c.handle1), c.point2.add(c.handle2), c.point2];
    };
    const K90 = (4 / 3) * Math.tan(Math.PI / 8); // a quarter circle's handle, as a share of its radius
    for (let i = 0; i < n; i++) {
      const cv = curves[i], a = cs[i], b = cs[(i + 1) % n], L = cv.length;
      if (caps.has(i)) { // the second quarter: from the edge's middle to the next curve
        const nx = curves[(i + 1) % n], r = L / 2, tb = nx.getTimeAt(r) ?? 0;
        const apex = cv.getPointAtTime(0.5), tE = cv.getTangentAtTime(0.5), pB = nx.getPointAtTime(tb), tB = nx.getTangentAtTime(tb);
        segs.push({ kind: 'C', pts: [apex, apex.add(tE.multiply(K90 * r)), pB.subtract(tB.multiply(K90 * r)), pB] });
        continue;
      }
      const aO = a ? (a.dOut ?? a.d) : 0, bI = b ? (b.dIn ?? b.d) : 0;
      const t0 = a ? cv.getTimeAt(aO) : 0, t1 = b ? cv.getTimeAt(L - bI) : 1;
      // a curve whose two rounds now meet has nothing left of itself: emit no zero-length piece
      if (L - aO - bI > 0.01) segs.push({ kind: cv.isStraight() ? 'L' : 'C', pts: part(cv, t0 == null ? 0 : t0, t1 == null ? 1 : t1) });
      if (b && b.cap === 'start') { // the first quarter: from this curve to the middle of the capped edge
        const ce = curves[(i + 1) % n], r = ce.length / 2;
        const pA = cv.getPointAtTime(t1 == null ? 1 : t1), tA = cv.getTangentAtTime(t1 == null ? 1 : t1);
        const apex = ce.getPointAtTime(0.5), tE = ce.getTangentAtTime(0.5);
        segs.push({ kind: 'C', pts: [pA, pA.add(tA.multiply(K90 * r)), apex.subtract(tE.multiply(K90 * r)), apex] });
      } else if (b && b.trap) { // the V of an ink trap: in to the notch point, out along the next edge
        const nx = curves[(i + 1) % n], tb = nx.getTimeAt(b.d) ?? 0;
        const pA = cv.getPointAtTime(t1 == null ? 1 : t1), pB = nx.getPointAtTime(tb);
        segs.push({ kind: 'L', pts: [pA, pA, b.N, b.N] }, { kind: 'L', pts: [b.N, b.N, pB, pB] });
      } else if (b) {
        const nx = curves[(i + 1) % n];
        const tb = nx.getTimeAt(b.dOut ?? b.d) ?? 0;
        const pA = cv.getPointAtTime(t1 == null ? 1 : t1), pB = nx.getPointAtTime(tb);
        const tA = cv.getTangentAtTime(t1 == null ? 1 : t1), tB = nx.getTangentAtTime(tb);
        // eased: the handles reach 0.92 of the way to the corner along each edge (near-continuous curvature)
        const h = b.ease ? 0.92 * b.d : (4 / 3) * Math.tan(b.ang / 4) * (b.d / Math.tan(b.ang / 2));
        // g7aq (owner: "a slight wobbliness at some of the joins because of the rounding mechanics ... no visible humps or
        // wobbles"): with opts.join the round is solved, not guessed. Its handles are found so that the round leaves each
        // edge with that edge's OWN curvature (a line's 0, a bowl's bend), so nothing goes flat and bends again where a round
        // meets a curve (the old handles assumed both edges were straight).
        const kA = cv.isStraight() ? 0 : kOf(cv, t1 == null ? 1 : t1), kB = nx.isStraight() ? 0 : kOf(nx, tb);
        const jr = b.jrSol ? b.jrSol : b.jr ? joinRound(b, pA, tA, kA, pB, tB, kB) : null;
        // where the edges bend away from the round (a concave side into a convex tip) no cubic can take their curvature
        // without an S inside the round; it then leaves them straight (curvature 0, its handles meeting where the edges'
        // tangents cross), so the turn from the edge's slight hollow into the round happens exactly at the join
        const g = !jr && opts.join ? g2Handles(pA, tA, kA, pB, tB, kB) || (b.ease ? g2Handles(pA, tA, 0, pB, tB, 0) : null) : null;   // a join round with no even solution: one cubic that still meets both curvatures
        if (opts.join && opts.join.log) opts.join.log.push(jr ? 'join' : g ? 'g2' : 'fallback');
        // g7av CONSTRUCTION LOG (the Construction board): with opts.join.cornerLog, every round as drawn: its corner, kind, law radius,
        // where it leaves each edge, its crest and its cubics. Logging only; the outline is the same with or without it.
        if (opts.join && opts.join.cornerLog && !opts._probe) opts.join.cornerLog.push({ P0: b.P0 && [b.P0.x, b.P0.y], pA: [pA.x, pA.y], pB: [pB.x, pB.y], r: b.r, angle: b.angle, convex: b.convex, hole: !!b.hole, end: !!b.end, ease: !!b.ease, sSpan: !!b.sSpan, arcEase: !!b.arcEase, flared: b.flared || null, crest: b.crest ? [b.crest.x, b.crest.y] : null, kM: b.kM ?? null, edges: [cv.isStraight() ? 'L' : 'C', nx.isStraight() ? 'L' : 'C'], cubics: (jr || []).map(P => P.map(q => [q.x, q.y])), how: jr ? 'hill' : g ? 'g2' : 'plain' });
        if (jr) segs.push(...jr.map(pts => ({ kind: 'C', pts })));
        else segs.push({ kind: 'C', pts: g ? [pA, pA.add(tA.multiply(g[0])), pB.subtract(tB.multiply(g[1])), pB] : [pA, pA.add(tA.multiply(h)), pB.subtract(tB.multiply(h)), pB] });
      }
    }
    if (!segs.length) continue;  // a degenerate piece the booleans left: nothing to draw
    const rd = opts.join ? (opts.join.fair ? v => Math.round(v * 1e5) / 1e5 : v => Math.round(v * 1e4) / 1e4) : r3g;   // g7ar: a hill's short pieces need the 5th decimal (at 4, a 0.005 handle loses its bend)   // g7aq: a join round's short handles need the 4th decimal to keep its curvature
    let d = `M${rd(segs[0].pts[0].x)} ${rd(segs[0].pts[0].y)}`;
    for (const s of segs) {
      const [p0, c1, c2, p3] = s.pts;
      // a straight left shorter than 0.2px between two rounded corners (or by the booleans) is a
      // sliver: drop it, and the next curve starts from here (the g2 must-do; moves a point < 0.2px)
      if (s.kind === 'L' && p0.getDistance(p3) < 0.2) continue;
      if (s.kind === 'L') d += `L${rd(p3.x)} ${rd(p3.y)}`;
      else d += `C${rd(c1.x)} ${rd(c1.y)} ${rd(c2.x)} ${rd(c2.y)} ${rd(p3.x)} ${rd(p3.y)}`;
    }
    out.push(d + 'Z');
  }
  return out.join('');
}

// g7aq: signed curvature of a paper curve at time t (the same sign as a cubic's own (B' x B'') / |B'|^3)
function kOf(cv, t) {
  const P = [cv.point1, cv.point1.add(cv.handle1), cv.point2.add(cv.handle2), cv.point2];
  const tt = Math.min(1 - 1e-4, Math.max(1e-4, t));
  const d1 = P[1].subtract(P[0]).multiply(3 * (1 - tt) ** 2).add(P[2].subtract(P[1]).multiply(6 * tt * (1 - tt))).add(P[3].subtract(P[2]).multiply(3 * tt * tt));
  const d2 = P[2].subtract(P[1].multiply(2)).add(P[0]).multiply(6 * (1 - tt)).add(P[3].subtract(P[2].multiply(2)).add(P[1]).multiply(6 * tt));
  const v = d1.length; return v < 1e-9 ? 0 : (d1.x * d2.y - d1.y * d2.x) / v ** 3;
}
// g7aq: the handles (a along tA from pA, b back along tB from pB) of the one cubic that meets both edges with their own
// tangent AND curvature (G2). With both curvatures 0 the handles meet at the corner (the ease); otherwise solved by
// Newton from there. Returns null when no positive solution exists (the caller keeps the plain ease).
function g2Handles(pA, tA, kA, pB, tB, kB) {
  const cr = (u, v) => u.x * v.y - u.y * v.x, D = pB.subtract(pA), X = cr(tA, tB), cA = cr(tA, D), cB = cr(D, tB);
  if (Math.abs(X) < 1e-6) return null;
  let a = cB / X, b = cA / X; if (!(a > 0 && b > 0)) return null;
  const a0 = a, b0 = b;
  for (let it = 0; it < 60; it++) {
    const f1 = 1.5 * kA * a * a - cA + b * X, f2 = 1.5 * kB * b * b - cB + a * X;
    if (Math.abs(f1) + Math.abs(f2) < 1e-10) break;
    const j11 = 3 * kA * a, j12 = X, j21 = X, j22 = 3 * kB * b, det = j11 * j22 - j12 * j21;
    if (Math.abs(det) < 1e-12) return null;
    a -= (f1 * j22 - f2 * j12) / det; b -= (j11 * f2 - j21 * f1) / det;
  }
  const L = D.length; if (!(a > 0.02 * L && b > 0.02 * L && a < 2 * L && b < 2 * L)) return null;   // handles within twice the chord: no loops
  { // no cusp: the curve keeps moving (its speed never falls under a fifth of the chord's)
    const P0 = pA, P1 = pA.add(tA.multiply(a)), P2 = pB.subtract(tB.multiply(b)), P3 = pB;
    for (let i = 0; i <= 20; i++) { const t = i / 20, v = P1.subtract(P0).multiply(3 * (1 - t) ** 2).add(P2.subtract(P1).multiply(6 * t * (1 - t))).add(P3.subtract(P2).multiply(3 * t * t)); if (v.length < 0.2 * L) return null; }
  }
  if (Math.abs(1.5 * kA * a * a - cA + b * X) + Math.abs(1.5 * kB * b * b - cB + a * X) > 1e-6) return null;
  return [a, b];
}
// g7aq THE JOIN ROUND (owner on v222: "they should be architectural and smooth with no visible humps or wobbles... they
// should feel impeccably constructed at every join"): one construction for every corner of every icon. The law still
// names a radius r; the round is two cubics, mirror halves about the corner's bisector, that
//   - pass through the deepest point of the compass arc of radius r (so a corner is exactly as deep as the law says),
//   - leave each edge with that edge's own tangent and curvature (a line's 0, a bowl's bend): no kink, no flat spot,
//   - bend evenly: the curvature only rises from each edge to the bisector, its tightest point (no second peak, no hump).
// It starts join.trim times as far from the corner as the arc would (the room an even bend needs). If the edges are too
// short (clamped), the whole round scales down with its start, keeping its shape. Returns the two cubics, or null.
function joinRound(c, pA, tA, kA, pB, tB, kB) {
  const k = Math.min(1, c.d / c.d0), r = c.r * k, phi = Math.PI - c.ang;
  const sg = Math.sign(c.turn), M = c.P0.add(c.bis.multiply(r / Math.sin(phi / 2) - r)), tM = c.tin.add(c.tout).normalize();
  const mono = (P, up) => { let prev = null; for (let i = 0; i <= 32; i++) { const t = i / 32, v = sg * kBez(P, t); if (prev != null && (up ? v < prev - 1e-3 : v > prev + 1e-3)) return false; prev = v; } return true; };
  for (let m = 1; m <= 4; m += 0.02) {
    const kM = sg * m / r, h1 = g2Handles(pA, tA, kA, M, tM, kM), h2 = g2Handles(M, tM, kM, pB, tB, kB);
    if (!h1 || !h2) continue;
    const P1 = [pA, pA.add(tA.multiply(h1[0])), M.subtract(tM.multiply(h1[1])), M], P2 = [M, M.add(tM.multiply(h2[0])), pB.subtract(tB.multiply(h2[1])), pB];
    if (mono(P1, true) && mono(P2, false)) return [P1, P2];
  }
  return null;
}
// g7ar THE HILL ROUND (owner on v223: "can you see the wobbliness ... further away from the point itself on both sides
// ... maybe it's how it's exiting the point? ... not at the join itself, but on the line coming out of it"). The g7aq
// rounds met each edge's curvature (G2) but not how fast it changes: a join round's curvature ramped up from the edge in
// a straight line and peaked in a V (a knee where the line leaves the round, a crease at its deepest point), and an eased
// tip was one cubic whose curvature crept up from almost 0 a long way out along the flank and then shot up at the point:
// a soft shoulder far from the point, then a hard nose. The eye reads a sudden change in how fast a line bends as a hitch.
// g7as arcEase: one half of a drawn arc that runs on from an edge with no corner. Walking from the edge toward the arc's
// middle Q: the bend ramps from the edge's own (k0) to k2 by the even ramp (raised cosine) over a share J.arcRamp of the
// way, then holds k2 to Q. Solved (Newton, 3x3): a (how far back along the edge the ramp starts), the length, and k2, so
// the walk ends exactly on Q in Q's direction. Written as the ramp (one cubic, else two) and the arc (one cubic): two or
// three curves where there was one. Returns { a, k2, shift, sol } or null.
function arcEase(edge, arc, arcOut, dQ, J) {
  const rho = J.arcRamp ?? 0.5, w = u => u >= rho ? 1 : (1 - Math.cos(Math.PI * u / rho)) / 2, ang = v => Math.atan2(v.y, v.x);
  const wrap = x => { while (x > Math.PI) x -= 2 * Math.PI; while (x < -Math.PI) x += 2 * Math.PI; return x; };
  // the edge, walking toward the node; the arc's middle, in the walking direction (walking backwards flips the bend's sign)
  const onEdge = dist => { if (dist > Math.min(edge.length * 0.95, J.room ?? Infinity) || dist < 0) return null; const t = arcOut ? edge.getTimeAt(edge.length - dist) : edge.getTimeAt(dist); if (t == null) return null; const tg = edge.getTangentAtTime(t), k = edge.isStraight() ? 0 : kOf(edge, t); return { p: edge.getPointAtTime(t), a: ang(arcOut ? tg : tg.multiply(-1)), k: arcOut ? k : -k }; };
  const tQ = arcOut ? arc.getTimeAt(dQ) : arc.getTimeAt(arc.length - dQ); if (tQ == null) return null;
  const Q = arc.getPointAtTime(tQ), tgQ = arc.getTangentAtTime(tQ), aQ = ang(arcOut ? tgQ : tgQ.multiply(-1)), kArc = arcOut ? kOf(arc, tQ) : -kOf(arc, tQ);
  const run = (S, L, k2, N = 160, keep = false) => {
    let x = S.p.x, y = S.p.y, th = S.a; const h = L / N, pts = keep ? [{ x, y, th, k: S.k }] : null;
    for (let i = 0; i < N; i++) { const u = (i + 0.5) / N, km = S.k + (k2 - S.k) * w(u), thm = th + km * h / 2; x += h * Math.cos(thm); y += h * Math.sin(thm); th += km * h; if (keep) pts.push({ x, y, th, k: S.k + (k2 - S.k) * w((i + 1) / N) }); }
    return keep ? pts : { x, y, th };
  };
  const res = v => { const [a, L, k2] = v; if (!(a > 0.002 && L > 0.01)) return null; const S = onEdge(a); if (!S) return null; const e = run(S, L, k2); return [e.x - Q.x, e.y - Q.y, (e.th - S.a) - wrap(aQ - S.a)]; };
  let v = [Math.min(0.25 * rho * dQ, (J.room ?? edge.length) * 0.5), dQ * 1.05, kArc * 1.02], r = res(v); if (!r) return null;
  for (let it = 0; it < 60; it++) {
    const n2 = Math.hypot(...r); if (n2 < 1e-10) break;
    const Jm = []; for (let j = 0; j < 3; j++) { const hj = 1e-6 * Math.max(1, Math.abs(v[j])), vv = v.slice(); vv[j] += hj; const rr = res(vv); if (!rr) return null; Jm.push(rr.map((x, i) => (x - r[i]) / hj)); }
    const A = [0, 1, 2].map(i => [Jm[0][i], Jm[1][i], Jm[2][i]]), det = M3 => M3[0][0] * (M3[1][1] * M3[2][2] - M3[1][2] * M3[2][1]) - M3[0][1] * (M3[1][0] * M3[2][2] - M3[1][2] * M3[2][0]) + M3[0][2] * (M3[1][0] * M3[2][1] - M3[1][1] * M3[2][0]);
    const D = det(A); if (Math.abs(D) < 1e-14) return null;
    const dv = [0, 1, 2].map(j => det(A.map((row, i) => row.map((x, c) => c === j ? r[i] : x))) / D);
    let step = 1, ok = false;
    for (let ls = 0; ls < 14; ls++, step /= 2) { const vv = v.map((x, j) => x - step * dv[j]), rr = res(vv); if (rr && Math.hypot(...rr) < n2) { v = vv; r = rr; ok = true; break; } }
    if (!ok) break;
  }
  if (process.env.ARCDBG) console.error('arcEase', arcOut ? 'out' : 'in', 'Q', Q.x.toFixed(2), Q.y.toFixed(2), 'kArc', kArc.toFixed(3), 'res', Math.hypot(...r).toExponential(1), 'v', v.map(x => x.toFixed(4)).join(','), 'edge', edge.length.toFixed(2));
  if (Math.hypot(...r) > 1e-7 || Math.sign(v[2]) !== Math.sign(kArc)) return null;
  const [a, L, k2] = v, S = onEdge(a), pts = run(S, L, k2, 320, true), iR = Math.round(320 * rho), P = q => new Point(q.x, q.y), T = q => new Point(Math.cos(q.th), Math.sin(q.th));
  const dev = (C, i0, i1) => { let m = 0; const B = []; for (let q = 0; q <= 64; q++) B.push(bzP(C, q / 64)); for (let i = i0; i <= i1; i += 2) { let dm = Infinity; for (const b of B) dm = Math.min(dm, (b.x - pts[i].x) ** 2 + (b.y - pts[i].y) ** 2); m = Math.max(m, dm); } return Math.sqrt(m); };
  const cub = (i0, i1) => { const A_ = pts[i0], B_ = pts[i1], h = g2Handles(P(A_), T(A_), A_.k, P(B_), T(B_), B_.k); return h ? [P(A_), P(A_).add(T(A_).multiply(h[0])), P(B_).subtract(T(B_).multiply(h[1])), P(B_)] : null; };
  let ramp = null; { const c1 = cub(0, iR); if (c1 && dev(c1, 0, iR) <= (J.hillTol2 ?? 0.02) / 4) ramp = [c1]; else { const m = Math.round(iR / 2), c2 = cub(0, m), c3 = cub(m, iR); if (c2 && c3) ramp = [c2, c3]; } }
  if (!ramp) return null;
  const R = pts[iR], phi = (L * (1 - rho)) * k2, hA = (4 / 3) * Math.tan(phi / 4) / k2, arcC = [P(R), P(R).add(T(R).multiply(hA)), Q.add(new Point(Math.cos(aQ), Math.sin(aQ)).multiply(-hA)), Q.clone()];
  let sol = [...ramp, arcC];
  if (!arcOut) sol = sol.reverse().map(C => [C[3], C[2], C[1], C[0]]);
  // the shift: how far the redrawn half runs from the drawn arc, at most (the drawn arc as it was, sampled)
  let shift = 0; { const ctr = Q.add(new Point(-Math.sin(aQ), Math.cos(aQ)).multiply(1 / kArc)), rr = Math.abs(1 / kArc); for (let i = iR; i <= 320; i += 4) shift = Math.max(shift, Math.abs(Math.hypot(pts[i].x - ctr.x, pts[i].y - ctr.y) - rr)); }
  return { a, k2: arcOut ? k2 : -k2, shift, sol };
}
// The hill round is DESIGNED BY ITS CURVATURE: each half (edge to the corner's deepest point M) bends by a raised cosine,
//   k(s) = kE + (kM - kE) (1 - cos(pi s / L)) / 2,
// so the bend grows from the edge's own curvature with no jolt, crests flat at M, and is halfway up halfway along: one
// smooth, even hill (curvature continuous, and its rate of change too). M is where it was (the law's depth for a join,
// the eased tip's own apex for a tip), so a silhouette keeps its depth; what is solved is where each half leaves its edge
// (dI, dO), each half's length, the crest kM and the tangent at M, so both halves meet M and their edges exactly. Each half
// is then written as the FEWEST cubics that follow it (one where one does, within J.hillTol of the hill, else two, three).
// Returns { dI, dO, sol: [cubics...] } or null (the caller keeps the g7aq round).
function hillRound(cin, cout, c, roomIn, roomOut, J) {
  const sg = Math.sign(c.turn), rho = J.hillRamp ?? 1, isTip = c.ease && J.tipKeep && c.angle < (J.tipAngle ?? 75), pw = isTip ? (J.tipPow ?? 1) : 1, w = u => u >= rho ? 1 : ((1 - Math.cos(Math.PI * u / rho)) / 2) ** pw, ang = v => Math.atan2(v.y, v.x);
  const wrap = a => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
  // g7as NO REVERSE BEND (director, turn 135: the tree's top tip pinched into a bulb on a neck): with J.noReverse, the round
  // at a convex corner never bends the other way. Where its edge bends the other way (the tree's flanks sweep in), the round
  // starts from no bend (a step of at most the edge's own slight sweep at the joint, under the check's step limit) and
  // rises in one hill, so the S sits at the joint, never inside the round
  const noRev = J.noReverse && c.convex, kEdge = k => noRev && Math.sign(k) === -sg ? 0 : k;
  const edgeAt = (cv, dist, isIn) => { const t = isIn ? cv.getTimeAt(Math.max(0, cv.length - dist)) : cv.getTimeAt(Math.min(cv.length, dist)); if (t == null) return null; return { p: cv.getPointAtTime(t), a: ang(cv.getTangentAtTime(t)), k: kEdge(cv.isStraight() ? 0 : kOf(cv, t)) }; };
  // the g7aq round at this corner, as the reference: its point on the bisector (M0) and its curvature there (the crest the
  // eye reads as how round the corner is: the law's radius, as g7aq drew it)
  const A0 = edgeAt(cin, Math.min(c.d, roomIn), true), B0 = edgeAt(cout, Math.min(c.d, roomOut), false); if (!A0 || !B0) return null;
  const tA0 = new Point(Math.cos(A0.a), Math.sin(A0.a)), tB0 = new Point(Math.cos(B0.a), Math.sin(B0.a));
  let ref = null;
  if (!c.ease) { const jr = joinRound(c, A0.p, tA0, A0.k, B0.p, tB0, B0.k); if (jr) ref = jr; }
  if (!ref) { const g = g2Handles(A0.p, tA0, A0.k, B0.p, tB0, B0.k) || g2Handles(A0.p, tA0, 0, B0.p, tB0, 0); if (!g) { if (process.env.FAIRDBG) console.error("   why: no ref"); return null; } ref = [[A0.p, A0.p.add(tA0.multiply(g[0])), B0.p.subtract(tB0.multiply(g[1])), B0.p]]; }
  const nrm = new Point(-c.bis.y, c.bis.x);
  let M0 = null, kC = 0;
  for (const P of ref) {
    const side = t => bzP(P, t).subtract(c.P0).dot(nrm); if (Math.sign(side(0)) === Math.sign(side(1)) && Math.abs(side(1)) > 1e-7) continue;
    let lo = 0, hi = 1; if (Math.abs(side(1)) <= 1e-7) lo = hi = 1; else for (let it = 0; it < 50; it++) { const mid = (lo + hi) / 2; if (Math.sign(side(mid)) === Math.sign(side(lo))) lo = mid; else hi = mid; }
    M0 = bzP(P, lo); kC = kBez(P, Math.min(1 - 1e-4, Math.max(1e-4, lo))); break;
  }
  if (!M0) { if (process.env.FAIRDBG) console.error("   why: no M0"); return null; }
  // J.hillKeep: 'crest' keeps the corner's crest curvature (its depth then follows), 'depth' keeps its deepest point
  // g7as SHARP TIPS (director, turn 133: the hill tips read as knobs): a convex tip of a mass (an eased corner) keeps the
  // eased tip's own nose (its crest, J.tipKeep 'crest'), so its hill is only as long as that bend needs and the flanks run
  // straight right up into it; joins keep their depth (J.hillKeep)
  const keep = (isTip && J.tipKeep) || (J.hillKeep ?? 'crest'), keepCrest = keep !== 'depth';
  // a sharp tip keeps the eased tip's PEAK bend (its tightest point, which on a lopsided tip is off the bisector), not its
  // bend at the bisector
  const tipRec = isTip && J._tips ? J._tips.find(x => x.P.getDistance(c.P0) < 1e-6) : null;
  if (tipRec && tipRec.kC && keep === 'crest') kC = tipRec.kC;
  else if (isTip && keep === 'crest') { let km = 0; for (const P of ref) for (let q = 0; q <= 200; q++) km = Math.max(km, Math.abs(kBez(P, Math.min(1 - 1e-4, Math.max(1e-4, q / 200))))); kC = sg * Math.min(km, J.tipSoft ? km * km / J.tipSoft : km) * (J.tipShare ?? 1); }
  if (keep === 'law') kC = sg / (c.r * Math.min(1, Math.min(c.d, roomIn, roomOut) / c.d0));   // the crest is the law's own radius
  if (process.env.FAIRDBG) console.error('   ref crest', kC.toFixed(2), 'law r', c.r.toFixed(3), 'law k', (1 / c.r).toFixed(2));
  let M = M0;
  const aM0 = ang(c.tin.add(c.tout));
  // integrate one half: from (p, a) with curvature k0 -> k1 by the raised cosine over length L; N steps (midpoint rule)
  // (rev: the half from the crest down to an edge, its plateau first: the weight mirrored)
  const run = (p, a, k0, k1, L, N = 48, keep = false, rev = false) => {
    const W = rev ? u => 1 - w(1 - u) : w;
    let x = p.x, y = p.y, th = a; const pts = keep ? [{ x, y, th, k: k0 }] : null, h = L / N;
    for (let i = 0; i < N; i++) { const km = k0 + (k1 - k0) * W((i + 0.5) / N), thm = th + km * h / 2; x += h * Math.cos(thm); y += h * Math.sin(thm); th += km * h; if (keep) pts.push({ x, y, th, k: k0 + (k1 - k0) * W((i + 1) / N) }); }
    return keep ? pts : { x, y, th };
  };
  // unknowns v = [dI, L1, dO, L2, kM or the depth offset along the bisector, phi]; 'fit' (a round with less room than it
  // wants): the short side takes all its room, and the crest and the depth are both solved
  const fitOut = keep === 'fit' && J.fitSide !== 'in', fitIn = keep === 'fit' && J.fitSide === 'in';
  // 'flare' (g7au, the leaned flare): both runs are given (roomIn, roomOut), and the crest point M moves freely (along and
  // across the bisector), with the crest bend; it is reached from the plain hill by continuation (J.flareFrom)
  const flR = [roomIn, roomOut];
  const unpack = v => keep === 'flare' ? { dI: flR[0], dO: flR[1], kM: v[4], M: M0.add(c.bis.multiply(v[0])).add(nrm.multiply(v[2])) } : keep === 'fit' ? { dI: fitIn ? roomIn : v[0], dO: fitOut ? roomOut : v[2], kM: v[4], M: M0.add(c.bis.multiply(fitIn ? v[0] : v[2])) }
    : keepCrest ? { dI: v[0], dO: v[2], kM: kC, M: M0.add(c.bis.multiply(v[4])) } : { dI: v[0], dO: v[2], kM: v[4], M: M0 };
  const res = v => {
    const [, L1, , L2, , phi] = v, { dI, dO, kM, M } = unpack(v); if (!(dI > 0.005 && dO > 0.005 && L1 > 0.005 && L2 > 0.005 && (keep === 'flare' || (dI <= roomIn && dO <= roomOut)))) return null;
    const A = edgeAt(cin, dI, true), Bq = edgeAt(cout, dO, false); if (!A || !Bq) return null;
    const aM = aM0 + phi, e1 = run(A.p, A.a, A.k, kM, L1), e2 = run(M, aM, kM, Bq.k, L2, 48, false, true);
    // the turns read unwrapped (each half turns by less than half a circle), so a half can never loop round to land
    return [e1.x - M.x, e1.y - M.y, (e1.th - A.a) - wrap(aM - A.a), e2.x - Bq.p.x, e2.y - Bq.p.y, (e2.th - aM) - wrap(Bq.a - aM)];
  };
  const chordIn = Math.max(0.05, c.d), turn1 = Math.abs(c.turn) / 2;
  let best = null;
  // a flare is reached from the plain hill at this corner (J.flareFrom) by moving its two legs out in small steps,
  // each solved from the last (a continuation: the lopsided hill is a long way from any guess)
  if (keep === 'flare' && J.flareFrom) {
    const F0 = J.flareFrom; let v = [0, F0.L1, 0, F0.L2, F0.kM, F0.phi], ok = true;
    for (let st = 1; st <= 12 && ok; st++) {
      const u = st / 12; flR[0] = F0.dI + (roomIn - F0.dI) * u; flR[1] = F0.dO + (roomOut - F0.dO) * u;
      let r = res(v); if (!r) { ok = false; if (process.env.FLAREDBG) console.error('   res null at', v.map(x => x.toFixed(3)).join(',')); break; }
      for (let it = 0; it < 40; it++) {
        const n2 = Math.hypot(...r); if (n2 < 1e-10) break;
        const Jm = []; for (let j = 0; j < 6; j++) { const hj = 1e-6 * Math.max(1, Math.abs(v[j])), vv = v.slice(); vv[j] += hj; const rr = res(vv); if (!rr) { Jm.length = 0; break; } Jm.push(rr.map((x, i) => (x - r[i]) / hj)); }
        if (Jm.length < 6) break;
        const dv = solve6(Jm, r); if (!dv) break;
        let step = 1, okk = false;
        for (let ls = 0; ls < 12; ls++, step /= 2) { const vv = v.map((x, j) => x - step * dv[j]), rr = res(vv); if (rr && Math.hypot(...rr) < n2) { v = vv; r = rr; okk = true; break; } }
        if (!okk) break;
      }
      if (Math.hypot(...r) > 1e-6) { ok = false; if (process.env.FLAREDBG) console.error('   res', Math.hypot(...r).toExponential(2), 'v', v.map(x => x.toFixed(3)).join(','), 'r', r.map(x => x.toExponential(1)).join(',')); }
    }
    if (process.env.FLAREDBG) console.error('   flare continuation', ok ? 'ok' : 'stuck at ' + flR.map(x => x.toFixed(3)).join(','));
    if (!ok) return null;
    best = v;
  }
  for (const f0 of c.ease ? [0.35, 0.5, 0.7, 1] : [1, 0.7, 1.4]) {
    if (best) break;
    // a kept crest sets the hill's length (each half turns about half the corner at about half the crest); else from the chord
    const Lk = keepCrest && keep !== 'fit' && Math.abs(kC) > 1e-6 ? 2 * turn1 / Math.abs(kC) * f0 / (c.ease ? 0.35 : 1) : 0;
    const d0 = Math.min(Lk ? Lk : chordIn * f0, roomIn * 0.95, roomOut * 0.95), L0 = Lk || d0 * 1.1, kM0 = sg * 2 * turn1 / L0;
    let v = keep === 'fit' ? [fitIn ? 0 : d0, L0, fitOut ? 0 : d0, L0, kC || kM0, 0] : [d0, L0, d0, L0, keepCrest ? 0 : kM0, 0], r = res(v); if (!r) continue;
    for (let it = 0; it < 40; it++) {
      const n2 = Math.hypot(...r); if (n2 < 1e-9) break;
      const Jm = []; for (let j = 0; j < 6; j++) { const hj = 1e-6 * Math.max(1, Math.abs(v[j])), vv = v.slice(); vv[j] += hj; const rr = res(vv); if (!rr) { Jm.length = 0; break; } Jm.push(rr.map((x, i) => (x - r[i]) / hj)); }
      if (Jm.length < 6) break;
      const dv = solve6(Jm, r); if (!dv) break;
      let step = 1, ok = false;
      for (let ls = 0; ls < 12; ls++, step /= 2) { const vv = v.map((x, j) => x - step * dv[j]), rr = res(vv); if (rr && Math.hypot(...rr) < n2) { v = vv; r = rr; ok = true; break; } }
      if (!ok) break;
    }
    if (process.env.FAIRDBG2 && (keep === "fit" || process.env.FAIRDBG2 === "all")) console.error("      fit f0", f0, "res", Math.hypot(...r).toExponential(2), "v", v.map(x => x.toFixed(3)).join(","), "room", roomIn.toFixed(2), roomOut.toFixed(2), "kC", kC.toFixed(2));
    if (Math.hypot(...r) < 1e-6 && Math.sign(unpack(v).kM) === sg) { best = v; break; }
  }
  if (!best) { if (process.env.FAIRDBG) console.error("   why: no solve"); return null; }
  if (keep === "fit" && Math.abs(unpack(best).M.subtract(M0).dot(c.bis)) > 0.05) { if (process.env.FAIRDBG) console.error("   why: fit moves the corner"); return null; }   // a tightened crest may not move the corner's depth visibly
  if (J.solveOnly) return { dI: unpack(best).dI, dO: unpack(best).dO };
  const [, L1, , L2, , phi] = best, { dI, dO, kM } = unpack(best); M = unpack(best).M; const A = edgeAt(cin, dI, true), Bq = edgeAt(cout, dO, false), aM = aM0 + phi;
  // a half's curvature must stay one hill: from the edge's to the crest, never past the crest
  if (sg * kM < sg * A.k || sg * kM < sg * Bq.k) { if (process.env.FAIRDBG) console.error("   why: crest below edge"); return null; }
  // a half written as cubics: ONE where one follows the hill (its place within J.hillTol, and it leaves its ends bending at
  // the hill's own rate), else TWO, their meeting point, tangent and curvature there solved so all three ends bend at the
  // hill's rate (no knee where the pieces meet); three or four even pieces only if two can't
  const pieces = (p, a, k0, k1, L, rev) => {
    const NS = 240, S = run(p, a, k0, k1, L, NS, true, rev), tol = J.hillTol ?? 0.004;
    const stol = Math.max(0.7, (J.hillSlopeTol ?? 0.12) * Math.max(Math.abs(k0), Math.abs(k1)) ** 2);   // relative to the round: a tight round may change faster
    const sl = q => { const a_ = Math.max(0, q - 1), b_ = Math.min(NS, q + 1); return (S[b_].k - S[a_].k) / ((b_ - a_) * L / NS); };
    const kd = (P, t) => { const e = 1e-3, a_ = Math.max(0, Math.min(1 - 2 * e, t - e)), b_ = a_ + 2 * e; return (kBez(P, b_) - kBez(P, a_)) / bzP(P, b_).getDistance(bzP(P, a_)); };
    const nodeAt = q => ({ p: new Point(S[q].x, S[q].y), th: S[q].th, k: S[q].k });
    // the pieces make one hill: read signed, the bend only moves from k0 toward k1 (an edge bending the other way passes
    // through straight once, never back), within 3% of the larger
    const hillMono = Ps => { const ks = Ps.flatMap(P => Array.from({ length: 25 }, (_, q) => kBez(P, q / 24))), dir = Math.sign(k1 - k0) || 1, tolK = 0.03 * Math.max(Math.abs(k0), Math.abs(k1)); for (let q = 1; q < ks.length; q++) if (dir * (ks[q] - ks[q - 1]) < -tolK) return false; return true; };
    const cubic = (A_, B_) => { const t0 = new Point(Math.cos(A_.th), Math.sin(A_.th)), t1 = new Point(Math.cos(B_.th), Math.sin(B_.th)); const h = g2Handles(A_.p, t0, A_.k, B_.p, t1, B_.k) || (Math.abs(A_.th - B_.th) < 0.02 && Math.max(Math.abs(A_.k), Math.abs(B_.k)) * A_.p.getDistance(B_.p) < 0.004 ? [A_.p.getDistance(B_.p) / 3, A_.p.getDistance(B_.p) / 3] : null); const ch = A_.p.getDistance(B_.p); return h && Math.min(h[0], h[1]) >= 0.08 * ch ? [A_.p, A_.p.add(t0.multiply(h[0])), B_.p.subtract(t1.multiply(h[1])), B_.p] : null; };
    const dev = (P, q0, q1, fast) => { let w_ = 0; const T = []; for (let t = 0; t <= 1.0001; t += 1 / 64) T.push(bzP(P, t)); for (let q = q0; q <= q1; q += fast ? 12 : 4) { let dm = Infinity; for (const pt of T) dm = Math.min(dm, (pt.x - S[q].x) ** 2 + (pt.y - S[q].y) ** 2); w_ = Math.max(w_, dm); } return Math.sqrt(w_); };
    // one
    { const P = cubic(nodeAt(0), nodeAt(NS)); if (P && dev(P, 0, NS) <= tol && hillMono([P]) && Math.abs(kd(P, 0) - sl(0)) <= stol && Math.abs(kd(P, 1) - sl(NS)) <= stol) return [P]; }
    // two: v = [split index share u, normal offset of the meeting point, its tangent turn, its curvature change]
    const fl = S.findIndex((q, i) => i > 0 && i < NS && Math.sign(q.k) !== Math.sign(S[i - 1].k) && Math.abs(S[i - 1].k) > 1e-9);
    const build2 = v => {
      const q = Math.max(8, Math.min(NS - 8, Math.round(v[0] * NS))), Q = nodeAt(q), nrm = new Point(-Math.sin(Q.th), Math.cos(Q.th));
      const Qn = { p: Q.p.add(nrm.multiply(v[1])), th: Q.th + v[2], k: Q.k + v[3] };
      const P1 = cubic(nodeAt(0), Qn), P2 = cubic(Qn, nodeAt(NS)); if (!P1 || !P2) return null;
      return { P1, P2, q };
    };
    const cost2 = v => {
      const b_ = build2(v); if (!b_) return 1e9;
      const e1 = (kd(b_.P1, 0) - sl(0)) / stol, e2 = (kd(b_.P1, 1) - kd(b_.P2, 0)) / stol, e3 = (kd(b_.P2, 1) - sl(NS)) / stol;
      const dv = Math.max(dev(b_.P1, 0, b_.q, true), dev(b_.P2, b_.q, NS, true)) / (J.maxPieces === 2 ? (J.hillTol2 ?? 0.02) : tol);
      // and a dip (the bend easing off and tightening again inside the hill) costs as much as a knee
      const dir = Math.sign(k1 - k0) || 1, tk = 0.03 * Math.max(Math.abs(k0), Math.abs(k1)); let dip = 0; { const ks = [b_.P1, b_.P2].flatMap(P => Array.from({ length: 13 }, (_, q) => kBez(P, q / 12))); for (let q = 1; q < ks.length; q++) { const v_ = -dir * (ks[q] - ks[q - 1]); if (v_ > 0) dip += (v_ / tk) ** 2; } }
      // g7as: the two pieces follow the hill's BEND, not only its place: where they stall (the bend stops growing at the
      // pieces' meeting point and starts again, a shoulder) the eye reads two bends; scored against the hill sampled by length
      let kv = 0; if (J.maxPieces === 2) { const span = Math.max(1e-6, Math.abs(k1 - k0)); for (const [P, i0, i1] of [[b_.P1, 0, b_.q], [b_.P2, b_.q, NS]]) { let Lp = 0; const Ls = [0]; let pr = bzP(P, 0); for (let s_ = 1; s_ <= 16; s_++) { const pt = bzP(P, s_ / 16); Lp += pt.getDistance(pr); pr = pt; Ls.push(Lp); } for (let s_ = 1; s_ < 16; s_++) { const qi = Math.round(i0 + (i1 - i0) * Ls[s_] / Lp); kv += ((kBez(P, s_ / 16) - S[qi].k) / (0.03 * span)) ** 2 / 30; } } }
      return e1 * e1 + e2 * e2 + e3 * e3 + dip + kv + (dv > 1 ? 10 * (dv - 1) ** 2 : 0) + 0.01 * dv * dv;
    };
    let best2 = null;
    for (const u0 of fl > 0 ? [fl / NS, 0.5, 0.3, 0.7] : J.maxPieces === 2 ? [0.5, 0.35, 0.65, 0.25, 0.75, 0.15, 0.85] : [0.5, 0.35, 0.65, 0.25, 0.75]) {
      const scale = [0.15, tol * 2, 0.05, Math.max(0.05, 0.1 * Math.abs(k1 - k0))];
      const v = nelderMead(cost2, [u0, 0, 0, 0], scale, 260);
      if (!best2 || v.f < best2.f) best2 = v;
      if (best2.f < (J.maxPieces === 2 ? 1.5 : 0.5)) break;
    }
    if (best2) {
      const b_ = build2(best2.x);
      if (b_) {
        const kl2 = Math.max(2.5, 0.2 * Math.max(Math.abs(k0), Math.abs(k1)) ** 2), ok = Math.abs(kd(b_.P1, 0) - sl(0)) <= kl2 && Math.abs(kd(b_.P1, 1) - kd(b_.P2, 0)) <= kl2 && Math.abs(kd(b_.P2, 1) - sl(NS)) <= kl2 && Math.max(dev(b_.P1, 0, b_.q), dev(b_.P2, b_.q, NS)) <= tol * 1.5;
        // and the pieces together still make one hill: the bend only grows toward the crest (a dip between the pieces is a wobble)
        const mono = hillMono;
        if (ok && mono([b_.P1, b_.P2])) return [b_.P1, b_.P2];
        // g7as AT MOST TWO (director, turn 133: "one cubic per half where it holds within the knee limit, two at most"): with
        // J.maxPieces 2, two pieces that keep the knee limit and one hill are taken even where they stray from the ideal hill by
        // more than hillTol, up to J.hillTol2 (the hill is the aim; the knee limit and the single hill are what the eye reads)
        const kOK = Math.abs(kd(b_.P1, 0) - sl(0)) <= kl2 && Math.abs(kd(b_.P1, 1) - kd(b_.P2, 0)) <= kl2 && Math.abs(kd(b_.P2, 1) - sl(NS)) <= kl2;
        if (J.maxPieces === 2 && kOK && mono([b_.P1, b_.P2]) && Math.max(dev(b_.P1, 0, b_.q), dev(b_.P2, b_.q, NS)) <= (J.hillTol2 ?? 0.02)) return [b_.P1, b_.P2];
        if (ok && process.env.FAIRDBG2) console.error("      mono fail", k0.toFixed(2), k1.toFixed(2), [b_.P1, b_.P2].flatMap(P => [0, 0.25, 0.5, 0.75, 1].map(t => kBez(P, t).toFixed(2))).join(" "));
        if (process.env.FAIRDBG2) console.error('      two failed', best2.f.toFixed(3), kd(b_.P1, 0).toFixed(2), sl(0).toFixed(2), kd(b_.P1, 1).toFixed(2), kd(b_.P2, 0).toFixed(2), kd(b_.P2, 1).toFixed(2), sl(NS).toFixed(2), 'stol', stol.toFixed(2), 'dev', Math.max(dev(b_.P1, 0, b_.q), dev(b_.P2, b_.q, NS)).toFixed(4));
      }
    }
    // three to six pieces, their meeting points ON the hill (each piece held to the hill's place, tangent and bend there);
    // accepted on the fair check's own knee limit
    const klim = Math.max(2.5, 0.2 * Math.max(Math.abs(k0), Math.abs(k1)) ** 2);
    for (let n = 3; n <= (J.maxPieces ?? 6); n++) {
      const Ps = []; let bad = false;
      for (let j = 0; j < n && !bad; j++) { const i0 = Math.round(NS * j / n), i1 = Math.round(NS * (j + 1) / n), P = cubic(nodeAt(i0), nodeAt(i1)); if (!P || dev(P, i0, i1) > tol) bad = true; else Ps.push(P); }
      if (process.env.FAIRDBG2) console.error("      n", n, "bad", bad, bad ? "" : "mono " + hillMono(Ps), bad ? "" : Ps.map(P => kd(P, 0).toFixed(1) + "/" + kd(P, 1).toFixed(1)).join(" "), "edge sl", sl(0).toFixed(2), sl(NS).toFixed(2), "k", k0.toFixed(2), k1.toFixed(2));
      if (bad || !hillMono(Ps)) continue;
      // the fair check's own knee rule at every node: a step in the rate of bend over max(2, a quarter of the local crest squared)
      const kmx = P => Math.max(...[0, 0.25, 0.5, 0.75, 1].map(t => Math.abs(kBez(P, t)))), lim = (...ks) => Math.max(2, 0.25 * Math.max(...ks) ** 2);
      if (Math.abs(kd(Ps[0], 0) - sl(0)) > lim(Math.abs(k0), kmx(Ps[0]), n > 1 ? kmx(Ps[1]) : 0) || Math.abs(kd(Ps[n - 1], 1) - sl(NS)) > lim(Math.abs(k1), kmx(Ps[n - 1]), n > 1 ? kmx(Ps[n - 2]) : 0)) continue;
      let kn = false; for (let j = 1; j < n; j++) if (Math.abs(kd(Ps[j - 1], 1) - kd(Ps[j], 0)) > lim(kmx(Ps[j - 1]), kmx(Ps[j]), kmx(Ps[Math.min(n - 1, j + 1)]), kmx(Ps[Math.max(0, j - 2)]))) kn = true;
      if (!kn) return Ps;
    }
    return null;
  };
  const h1 = pieces(A.p, A.a, A.k, kM, L1, false), h2 = pieces(M, aM, kM, Bq.k, L2, true); if (!h1 || !h2) { if (process.env.FAIRDBG) console.error("   why: no fit", !!h1, !!h2); return null; }
  const S0 = [...h1, ...h2], kS = kBez(S0[0], 1e-4), kE_ = kBez(S0[S0.length - 1], 1 - 1e-4);
  if (Math.abs(kS - A.k) > 0.1 || Math.abs(kE_ - Bq.k) > 0.1) { if (process.env.FAIRDBG) console.error("   why: ends off", kS.toFixed(2), A.k.toFixed(2), kE_.toFixed(2), Bq.k.toFixed(2)); return null; }   // never leave an edge with a step in its bend
  return { dI, dO, sol: S0, kM, L1, L2, phi, dDepth: M.subtract(M0).dot(c.bis), M, M0, kC: kM };
}
function nelderMead(f, x0, step, iters) {   // a small Nelder-Mead minimiser: returns { x, f }
  const n = x0.length; let P = [x0.slice()]; for (let i = 0; i < n; i++) { const x = x0.slice(); x[i] += step[i]; P.push(x); }
  let F = P.map(f);
  for (let it = 0; it < iters; it++) {
    const ord = F.map((v, i) => i).sort((i, j) => F[i] - F[j]); P = ord.map(i => P[i]); F = ord.map(i => F[i]);
    const c = Array(n).fill(0); for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) c[j] += P[i][j] / n;
    const at = t => c.map((v, j) => v + t * (P[n][j] - v));
    const xr = at(-1), fr = f(xr);
    if (fr < F[0]) { const xe = at(-2), fe = f(xe); if (fe < fr) { P[n] = xe; F[n] = fe; } else { P[n] = xr; F[n] = fr; } }
    else if (fr < F[n - 1]) { P[n] = xr; F[n] = fr; }
    else { const xc = at(0.5), fc = f(xc); if (fc < F[n]) { P[n] = xc; F[n] = fc; } else { for (let i = 1; i <= n; i++) { P[i] = P[i].map((v, j) => P[0][j] + 0.5 * (v - P[0][j])); F[i] = f(P[i]); } } }
  }
  let bi = 0; for (let i = 1; i <= n; i++) if (F[i] < F[bi]) bi = i; return { x: P[bi], f: F[bi] };
}
function solve6(A, b) {   // Gaussian elimination, partial pivoting; A[j][i] = d r_i / d v_j (rows are the Jacobian's columns)
  const n = 6, M_ = []; for (let i = 0; i < n; i++) { M_.push([]); for (let j = 0; j < n; j++) M_[i].push(A[j][i]); M_[i].push(b[i]); }
  for (let c = 0; c < n; c++) { let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M_[r][c]) > Math.abs(M_[p][c])) p = r; if (Math.abs(M_[p][c]) < 1e-14) return null; [M_[c], M_[p]] = [M_[p], M_[c]];
    for (let r = 0; r < n; r++) if (r !== c) { const f = M_[r][c] / M_[c][c]; for (let k = c; k <= n; k++) M_[r][k] -= f * M_[c][k]; } }
  return M_.map((row, i) => row[n] / row[i]);
}
const bzP = (P, t) => P[0].multiply((1 - t) ** 3).add(P[1].multiply(3 * t * (1 - t) ** 2)).add(P[2].multiply(3 * t * t * (1 - t))).add(P[3].multiply(t ** 3));
const bzD = (P, t) => P[1].subtract(P[0]).multiply(3 * (1 - t) ** 2).add(P[2].subtract(P[1]).multiply(6 * t * (1 - t))).add(P[3].subtract(P[2]).multiply(3 * t * t));
function kBez(P, t) {
  const d1 = P[1].subtract(P[0]).multiply(3 * (1 - t) ** 2).add(P[2].subtract(P[1]).multiply(6 * t * (1 - t))).add(P[3].subtract(P[2]).multiply(3 * t * t));
  const d2 = P[2].subtract(P[1].multiply(2)).add(P[0]).multiply(6 * (1 - t)).add(P[3].subtract(P[2].multiply(2)).add(P[1]).multiply(6 * t));
  const v = d1.length; return v < 1e-9 ? 0 : (d1.x * d2.y - d1.y * d2.x) / v ** 3;
}
// transform primitives: scale k about (ox,oy) then move to (tx,ty). Pen widths are NOT scaled
// (the pen is a screen width); every other width scales.
function xform(prims, k, ox, oy, tx, ty) {
  const X = x => tx + (x - ox) * k, Y = y => ty + (y - oy) * k;
  return prims.map(q => {
    const s = { ...q };
    if (q.t === 'I') { const [p2, q2] = xform([q.p, q.q], k, ox, oy, tx, ty); Object.assign(s, { p: p2, q: q2 }); }
    if (q.t === 'E') Object.assign(s, { of: xform(q.of, k, ox, oy, tx, ty), w: q.w * k, clip: q.clip ? xform([q.clip], k, ox, oy, tx, ty)[0] : null, mirror: q.mirror == null ? null : X(q.mirror) });
    if (q.t === 'R') Object.assign(s, { x: X(q.x), y: Y(q.y), w: q.w * k, h: q.h * k });
    if (q.t === 'C' || q.t === 'S') Object.assign(s, { cx: X(q.cx), cy: Y(q.cy), r: q.r * k });
    if (q.t === 'P') s.pts = q.pts.map(p => [X(p[0]), Y(p[1])]);
    if (q.t === 'D') { if (q.m) throw new Error('D: one xform only'); s.m = [k, ox, oy, tx, ty]; }
    if (q.t === 'B') Object.assign(s, { a: [X(q.a[0]), Y(q.a[1])], b: [X(q.b[0]), Y(q.b[1])], w: q.pen ? q.w : q.w * k });
    if (q.t === 'O' || q.t === 'A') Object.assign(s, { cx: X(q.cx), cy: Y(q.cy), r: q.r * k, w: q.pen ? q.w : q.w * k });
    return s;
  });
}

// the outline d moved in by w (Minkowski erosion, exact round joins via Clipper), as a paper item whose
// smooth runs are fitted curves and whose true corners stay corners (so the law rounds them as usual)
function erode(d, w, miter = true) {
  const CL = require(path.join(process.env.TOOLS || '/tmp/claude-0/-home-user-la-trip-map/04f8fb34-0476-5960-add5-8bd3d6d8820e/scratchpad/tools', 'node_modules/clipper-lib/clipper.js'));
  const K = 1e5, src = new CompoundPath(d); src.flatten(0.002);
  const kids = src.children && src.children.length ? src.children : [src];
  const polys = kids.map(k => k.segments.map(s => ({ X: Math.round(s.point.x * K), Y: Math.round(s.point.y * K) })));
  src.remove();
  // g7s (owner: "far too rounded on the interior joins"): mitred joins, so a counter's corners stay corners
  // and the corner law rounds them like any other (tight inside); round joins (the g7r erosion) are kept as an option
  const co = new CL.ClipperOffset(50, 0.001 * K); co.AddPaths(polys, miter ? CL.JoinType.jtMiter : CL.JoinType.jtRound, CL.EndType.etClosedPolygon);
  const sol = []; co.Execute(sol, -w * K);
  const out = new CompoundPath({});
  for (const poly of sol) {
    let pts = poly.map(q => new Point(q.X / K, q.Y / K));
    pts = pts.filter((q, i) => q.getDistance(pts[(i + 1) % pts.length]) > 0.003);
    const n = pts.length; if (n < 3) continue;
    // a corner: the direction turns by more than 12 degrees over 0.03px either side
    const dirAt = (i, s) => { let j = i, L = 0; while (L < 0.03) { const k = (j + s + n) % n; L += pts[j].getDistance(pts[k]); j = k; if (j === i) break; } return s > 0 ? pts[j].subtract(pts[i]) : pts[i].subtract(pts[j]); };
    const corner = pts.map((_, i) => { const a = dirAt(i, -1), b = dirAt(i, 1); return Math.abs(a.getDirectedAngle(b)) > 12; });
    // keep one corner per cluster (the sharpest turn); a cluster is a run of corner points closer than 0.05px
    const sharp = k => 180 - Math.abs(pts[(k - 1 + n) % n].subtract(pts[k]).getDirectedAngle(pts[(k + 1) % n].subtract(pts[k])));
    const near = k => pts[k].getDistance(pts[(k + 1) % n]) < 0.05;
    const ci = [];
    if (corner.every(Boolean) && !pts.some((_, k) => near(k))) { for (let k = 0; k < n; k++) ci.push(k); }
    else {
      let start = corner.findIndex((c, k) => c && !(corner[(k - 1 + n) % n] && near((k - 1 + n) % n)));
      if (start >= 0) for (let c = 0, k = start; c < n; c++, k = (k + 1) % n) {
        if (!corner[k] || (corner[(k - 1 + n) % n] && near((k - 1 + n) % n))) continue;
        let best = k, bt = sharp(k), j = k;
        while (near(j) && corner[(j + 1) % n] && (j + 1) % n !== k) { j = (j + 1) % n; if (sharp(j) > bt) { bt = sharp(j); best = j; } }
        ci.push(best);
      }
    }
    const path_ = new Path({ closed: true });
    if (!ci.length) { pts.forEach(q => path_.add(q)); path_.simplify(0.002); out.addChild(path_); continue; }
    ci.sort((a, b) => a - b);
    for (let c = 0; c < ci.length; c++) {
      const i0 = ci[c], i1 = ci[(c + 1) % ci.length], run = [];
      for (let j = i0; ; j = (j + 1) % n) { run.push(pts[j]); if (j === i1 && run.length > 1) break; }
      const seg = new Path(run); if (run.length > 2) seg.simplify(0.002);
      seg.segments.forEach((s, k) => { if (k === seg.segments.length - 1) return; if (k === 0 && path_.segments.length) { path_.lastSegment.handleOut = s.handleOut; return; } path_.add(new paper.Segment(s.point, k === 0 ? null : s.handleIn, s.handleOut)); });
      const last = seg.lastSegment; if (c === ci.length - 1) { path_.firstSegment.handleIn = last.handleIn; } else { path_.add(new paper.Segment(last.point, last.handleIn, null)); }
      seg.remove();
    }
    out.addChild(path_);
  }
  return out;
}
// g7z: a glyph drawn symmetric stays symmetric after the law. corners() treats an edge by its direction of
// travel, so a symmetric outline whose halves run opposite ways came out up to 0.2px off (the H3 coupe, once its
// stem flared into the domed foot). Keep the left half of the FINISHED outline, mirror it across x, and drop the
// collinear points the seam leaves on straight lines.
function symD(d, x, dec = 4) {
  const it = new CompoundPath(d), half = new Path.Rectangle(new Point(-1000, -1000), new Point(x, 1000));
  const seamPts = []; for (const k of (it.children.length ? it.children : [it])) for (const s of k.segments) if (Math.abs(s.point.x - x) < 1e-4) seamPts.push({ p: s.point.clone(), hi: s.handleIn.clone(), ho: s.handleOut.clone() });
  const l = it.intersect(half); it.remove(); half.remove();
  const r = l.clone(); r.scale(-1, 1, new Point(x, 0)); const u = l.unite(r); l.remove(); r.remove();
  for (const k of (u.children && u.children.length ? u.children : [u])) {
    // g7ae: the seam can split a curve into slivers a hundredth of a px long; fold them into their neighbours
    // (in mirror pairs, so the outline stays symmetric: a point just off the seam, next to a point on it, goes)
    for (let i = k.segments.length - 1; i >= 0 && k.segments.length > 3; i--) { const s = k.segments[i], off = Math.abs(s.point.x - x); if (off > 1e-6 && off < 0.012 && [s.next, s.previous].some(q => Math.abs(q.point.x - x) < 1e-6 && q.point.getDistance(s.point) < 0.012)) s.remove(); }
    for (let i = k.segments.length - 1; i >= 0 && k.segments.length > 3; i--) {
      const s = k.segments[i], p = s.previous, n = s.next;
      if (!s.handleIn.isZero() || !s.handleOut.isZero() || !p.handleOut.isZero() || !n.handleIn.isZero()) continue;
      const a = s.point.subtract(p.point), b = n.point.subtract(s.point);
      if (Math.abs(a.cross(b)) < 1e-4 * a.length * b.length && a.dot(b) > 0) s.remove();
    }
  }
  // g7ar: a point on the seam can come out of the booleans with one handle dropped (a curve that crossed the seam at its own
  // end: a hill's crest); the outline is symmetric, so the dropped handle is the mirror of the kept one
  for (const k of (u.children && u.children.length ? u.children : [u])) for (const s of k.segments) {
    if (Math.abs(s.point.x - x) > 1e-6) continue;
    if (s.handleIn.length < 1e-3 && s.handleOut.length < 1e-3 && dec > 4) {
      // both dropped (the booleans cut a round's crest a hair off the seam): the crossing is rebuilt as ONE cubic from the
      // node before to the node after, held to their tangent and bend (G2), symmetric by construction
      const pv = s.previous, nx = s.next, cin = pv.previous ? new Path([pv.previous.clone(), pv.clone()]).firstCurve : null, cout = nx.next ? new Path([nx.clone(), nx.next.clone()]).firstCurve : null;
      if (cin && cout && cin.length > 1e-3 && cout.length > 1e-3) {
        const tA = cin.getTangentAtTime(1), kA = cin.isStraight() ? 0 : kOf(cin, 1), tB = cout.getTangentAtTime(0), kB = cout.isStraight() ? 0 : kOf(cout, 0);
        const h = g2Handles(pv.point, tA, kA, nx.point, tB, kB);
        if (h) { pv.handleOut = tA.multiply(h[0]); nx.handleIn = tB.multiply(-h[1]); s.remove(); }
        cin.path.remove(); cout.path.remove();
      }
      continue;
    }
    if (s.handleIn.isZero() && !s.handleOut.isZero() && s.handleOut.length > 1e-4) s.handleIn = new Point(-s.handleOut.x, s.handleOut.y);
    else if (s.handleOut.isZero() && !s.handleIn.isZero() && s.handleIn.length > 1e-4) s.handleOut = new Point(-s.handleIn.x, s.handleIn.y);
  }
  // absolute commands, as corners() writes them (the checks read M, L, C, Z)
  const n = v => +v.toFixed(dec), P = q => `${n(q.x)} ${n(q.y)}`;
  let out = '';
  for (const k of (u.children && u.children.length ? u.children : [u])) {
    out += `M${P(k.firstSegment.point)}`;
    for (const c of k.curves) out += c.hasHandles() ? `C${P(c.point1.add(c.handle1))} ${P(c.point2.add(c.handle2))} ${P(c.point2)}` : `L${P(c.point2)}`;
    out += 'Z';
  }
  u.remove(); return out;
}
function build(prims, { law, penW, info, centre, noCaps, tightHoles, ease, sym, join: jn } = {}) {
  const ers = prims.filter(q => q.t === 'E');
  if (ers.length) {
    let acc = join(prims.filter(q => q.t !== 'E'), penW);
    // counters first (cut), then fills (g7s: the coupe's drink, an erosion laid back inside its counter)
    for (const q of [...ers.filter(e => !e.fill), ...ers.filter(e => e.fill)]) {
      // the outline before the law (its corners sharp), moved in by the line with mitred joins; the law then
      // rounds the counter's own corners in the final pass (g7s). q.round: the g7r way (law first, round joins)
      const of = q.round ? build(q.of, { law, penW, noCaps }).d : (() => { const it = join(q.of, penW), d = it.pathData; it.remove(); return d; })();
      let hole = erode(of, q.w, !q.round);
      if (q.clip) { const c = toItem(q.clip, penW), h2 = hole.intersect(c); hole.remove(); c.remove(); hole = h2; }
      if (q.mirror != null) {   // a symmetric counter stays symmetric: keep the left half, mirror it across
        const half = new Path.Rectangle(new Point(-1000, -1000), new Point(q.mirror, 1000)), l = hole.intersect(half); half.remove(); hole.remove();
        const r = l.clone(); r.scale(-1, 1, new Point(q.mirror, 0)); hole = l.unite(r); l.remove(); r.remove();
      }
      const s = q.fill ? acc.unite(hole) : acc.subtract(hole); acc.remove(); hole.remove(); acc = s;
    }
    let d = law ? corners(acc, law, info, { noCaps, tightHoles: true, ease, join: jn }) : acc.pathData; if (sym != null) d = symD(d, sym, jn && jn.fair ? 5 : 4);
    const b = acc.bounds; acc.remove();
    let far = 0;
    if (centre) { const fl = new CompoundPath(d); fl.flatten(0.05); for (const k of (fl.children && fl.children.length ? fl.children : [fl])) for (const s of k.segments) far = Math.max(far, Math.hypot(s.point.x - centre[0], s.point.y - centre[1])); fl.remove(); }
    return { d, far, bounds: { x: b.x, y: b.y, w: b.width, h: b.height } };
  }
  const it = join(prims, penW);
  let d = law ? corners(it, law, info, { noCaps, tightHoles, ease, join: jn }) : it.pathData; if (sym != null) d = symD(d, sym, jn && jn.fair ? 5 : 4);
  const b = it.bounds;
  // farthest ink point from the badge centre, for the fit check
  let far = 0;
  if (centre) { // measured on the FINISHED outline (after the corner law)
    const fl = new CompoundPath(d); fl.flatten(0.05);
    const kids = fl instanceof CompoundPath ? fl.children : [fl];
    for (const k of kids) for (const s of k.segments) far = Math.max(far, Math.hypot(s.point.x - centre[0], s.point.y - centre[1]));
    fl.remove();
  }
  it.remove();
  return { d, far, bounds: { x: b.x, y: b.y, w: b.width, h: b.height } };
}

// construction: each primitive's own outline (before the union), for drawing the build over a glyph
function parts(prims) { return prims.map(q => { const it = toItem(q); const d = it.pathData; it.remove(); return { d, cut: !!q.cut }; }); }
// anatomy of one primitive: its on-curve points and handles (for showing the curve rule)
function anatomy(q) {
  const it = toItem(q), kids = it.children ? it.children : [it], out = [];
  for (const k of kids) for (const s of k.segments) {
    const p = s.point;
    out.push({ p: [p.x, p.y], hi: s.handleIn.isZero() ? null : [p.x + s.handleIn.x, p.y + s.handleIn.y], ho: s.handleOut.isZero() ? null : [p.x + s.handleOut.x, p.y + s.handleOut.y] });
  }
  it.remove(); return out;
}

// count curve commands in a path (the "minimal bezier" figure on the boards)
const countCurves = d => (d.match(/C/g) || []).length;

// g7ba ENGINE LAW, PLACEMENT TO 1/1000 (director, turn 158: "Make the 1/1000 rounding engine law ... A blind designer must not need
// to know it"): every POSITION is written to 1/1000 of a unit: the offsets the centring moves a glyph by (placeOffset, rounded) and a
// solved measure that is itself a position (an outline mark's fitted radius: placeSize, floored so it stays inside its cut), as every
// drawn position already is (picks7 f: 3 decimals). A shaped icon's solved SIZE is a scale, not a position: it is not rounded, because
// picks7 writes the scaled positions at 1/1000 itself, and rounding the scale too moved the coupe's rim coordinates across a 1/1000 step
// (a TAIL appeared; turn 159). At raw float precision a corner round could fall to the fallback (the person at rx 6.5350749..., the bed
// at ty 7.9999967: KNEEs).
// Applied to every new build (blind.js and what follows). The six stay as approved, built before it: rebuilt under it (construction.js
// LAW1000=1) they move 0.0001-0.02px, and the tree's top tip gains a TAIL (with sizes rounded too, the coupe's rim does instead). So
// rounding moves the engine's knife-edge cases, it doesn't remove them: the round solver changes branch on sub-1/1000 input changes.
// That solver robustness is the real fix (open).
const placeSize = v => Math.floor(v * 1000 + 1e-6) / 1000, placeOffset = v => Math.round(v * 1000) / 1000;
module.exports = { R, C, P, B, O, A, S, D, I, E, erode, cut, pen, build, join, xform, countCurves, parts, anatomy, g2Handles, joinRound, placeSize, placeOffset };
