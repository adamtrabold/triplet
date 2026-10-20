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
const pen = (p) => ({ ...p, pen: true });

function toItem(q, penW) {
  const w = q.pen && penW ? penW : q.w;
  switch (q.t) {
    case 'I': { const a = toItem(q.p, penW), b = toItem(q.q, penW), r = a.intersect(b); a.remove(); b.remove(); return r; }
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
const r3 = v => Math.round(v * 1000) / 1000;
function corners(item, law, info, opts = {}) {
  const kids = item instanceof CompoundPath ? item.children.slice() : [item];
  const out = [];
  for (const p of kids) {
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
      let r = law({ convex, angle: inkAngle, lin, lout, straight, pt: [P0.x, P0.y] });
      // an INK TRAP (g7 fix, contrast compensation at joins): the law may return { trap: [a, t] } for
      // a join; the corner is then cut by a small V: from a point a back along each edge to a point t
      // into the ink along the corner's bisector, thinning the join instead of adding ink to it.
      if (r && r.trap) { cs.push({ d: r.trap[0], trap: true, N: P0.add(bis.multiply(-r.trap[1])), ang, turn, convex, angle: inkAngle }); if (info) info.push({ trap: true, x: r3(P0.x), y: r3(P0.y) }); continue; }
      if (!r || r <= 0) { cs.push(null); continue; }
      let d = r * Math.tan(ang / 2);
      cs.push({ d, r, ang, turn, convex, angle: inkAngle });
      if (info) info.push({ x: r3(P0.x), y: r3(P0.y), r: r3(r), convex, angle: Math.round(inkAngle) });
    }
    // COLLISION RULE (g6 fix): two rounds that want more than a straight edge holds, where the edge
    // ends in two right-angle turns the same way (a slot end, a bar end), become ONE true arc: a
    // semicircle of radius L/2 centred on the edge, drawn as two equal quarter arcs meeting at its middle.
    const caps = new Set();
    if (!opts.noCaps) for (let i = 0; i < n; i++) {
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
      const t0 = a ? cv.getTimeAt(a.d) : 0, t1 = b ? cv.getTimeAt(L - b.d) : 1;
      // a curve whose two rounds now meet has nothing left of itself: emit no zero-length piece
      if (L - (a ? a.d : 0) - (b ? b.d : 0) > 0.01) segs.push({ kind: cv.isStraight() ? 'L' : 'C', pts: part(cv, t0 == null ? 0 : t0, t1 == null ? 1 : t1) });
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
        const tb = nx.getTimeAt(b.d) ?? 0;
        const pA = cv.getPointAtTime(t1 == null ? 1 : t1), pB = nx.getPointAtTime(tb);
        const tA = cv.getTangentAtTime(t1 == null ? 1 : t1), tB = nx.getTangentAtTime(tb);
        const h = (4 / 3) * Math.tan(b.ang / 4) * (b.d / Math.tan(b.ang / 2));
        segs.push({ kind: 'C', pts: [pA, pA.add(tA.multiply(h)), pB.subtract(tB.multiply(h)), pB] });
      }
    }
    if (!segs.length) continue;  // a degenerate piece the booleans left: nothing to draw
    let d = `M${r3(segs[0].pts[0].x)} ${r3(segs[0].pts[0].y)}`;
    for (const s of segs) {
      const [p0, c1, c2, p3] = s.pts;
      // a straight left shorter than 0.2px between two rounded corners (or by the booleans) is a
      // sliver: drop it, and the next curve starts from here (the g2 must-do; moves a point < 0.2px)
      if (s.kind === 'L' && p0.getDistance(p3) < 0.2) continue;
      if (s.kind === 'L') d += `L${r3(p3.x)} ${r3(p3.y)}`;
      else d += `C${r3(c1.x)} ${r3(c1.y)} ${r3(c2.x)} ${r3(c2.y)} ${r3(p3.x)} ${r3(p3.y)}`;
    }
    out.push(d + 'Z');
  }
  return out.join('');
}

// transform primitives: scale k about (ox,oy) then move to (tx,ty). Pen widths are NOT scaled
// (the pen is a screen width); every other width scales.
function xform(prims, k, ox, oy, tx, ty) {
  const X = x => tx + (x - ox) * k, Y = y => ty + (y - oy) * k;
  return prims.map(q => {
    const s = { ...q };
    if (q.t === 'I') { const [p2, q2] = xform([q.p, q.q], k, ox, oy, tx, ty); Object.assign(s, { p: p2, q: q2 }); }
    if (q.t === 'R') Object.assign(s, { x: X(q.x), y: Y(q.y), w: q.w * k, h: q.h * k });
    if (q.t === 'C' || q.t === 'S') Object.assign(s, { cx: X(q.cx), cy: Y(q.cy), r: q.r * k });
    if (q.t === 'P') s.pts = q.pts.map(p => [X(p[0]), Y(p[1])]);
    if (q.t === 'D') { if (q.m) throw new Error('D: one xform only'); s.m = [k, ox, oy, tx, ty]; }
    if (q.t === 'B') Object.assign(s, { a: [X(q.a[0]), Y(q.a[1])], b: [X(q.b[0]), Y(q.b[1])], w: q.pen ? q.w : q.w * k });
    if (q.t === 'O' || q.t === 'A') Object.assign(s, { cx: X(q.cx), cy: Y(q.cy), r: q.r * k, w: q.pen ? q.w : q.w * k });
    return s;
  });
}

function build(prims, { law, penW, info, centre, noCaps } = {}) {
  const it = join(prims, penW);
  const d = law ? corners(it, law, info, { noCaps }) : it.pathData;
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

module.exports = { R, C, P, B, O, A, S, D, I, cut, pen, build, join, xform, countCurves, parts, anatomy };
