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
      cs.push({ d, d0: d, r, ang, turn, convex, angle: inkAngle, ease: !!ez, jr: !!J && !ez, P0, bis, tin, tout });
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
    if (opts.join) for (let i = 0; i < n; i++) {
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
        if (jr) segs.push(...jr.map(pts => ({ kind: 'C', pts })));
        else segs.push({ kind: 'C', pts: g ? [pA, pA.add(tA.multiply(g[0])), pB.subtract(tB.multiply(g[1])), pB] : [pA, pA.add(tA.multiply(h)), pB.subtract(tB.multiply(h)), pB] });
      }
    }
    if (!segs.length) continue;  // a degenerate piece the booleans left: nothing to draw
    const rd = opts.join ? (v => Math.round(v * 1e4) / 1e4) : r3g;   // g7aq: a join round's short handles need the 4th decimal to keep its curvature
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
function symD(d, x) {
  const it = new CompoundPath(d), half = new Path.Rectangle(new Point(-1000, -1000), new Point(x, 1000));
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
  // absolute commands, as corners() writes them (the checks read M, L, C, Z)
  const n = v => +v.toFixed(4), P = q => `${n(q.x)} ${n(q.y)}`;
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
    let d = law ? corners(acc, law, info, { noCaps, tightHoles: true, ease, join: jn }) : acc.pathData; if (sym != null) d = symD(d, sym);
    const b = acc.bounds; acc.remove();
    let far = 0;
    if (centre) { const fl = new CompoundPath(d); fl.flatten(0.05); for (const k of (fl.children && fl.children.length ? fl.children : [fl])) for (const s of k.segments) far = Math.max(far, Math.hypot(s.point.x - centre[0], s.point.y - centre[1])); fl.remove(); }
    return { d, far, bounds: { x: b.x, y: b.y, w: b.width, h: b.height } };
  }
  const it = join(prims, penW);
  let d = law ? corners(it, law, info, { noCaps, tightHoles, ease, join: jn }) : it.pathData; if (sym != null) d = symD(d, sym);
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

module.exports = { R, C, P, B, O, A, S, D, I, E, erode, cut, pen, build, join, xform, countCurves, parts, anatomy, g2Handles, joinRound };
