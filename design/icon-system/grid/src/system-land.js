// THE SYSTEM, the grid step. landPrims (below) is how the system lands an icon: the snap priority is worked out on the joined
// roots, the roots move, and only then are corners rounded and joins faired, so the grid costs no curvature.
// land / rigid: landing a finished outline instead (tried 10-27 and kept for comparison): stretching it between landed edges breaks
// curvature at joins (the museum's gable: 31 faults); moving runs of curves rigidly bends straight edges where two runs disagree.
'use strict';
const OS = require('./one-side.js'), { parse } = require('./join-check.js');
const f6 = v => +v.toFixed(6);
// a cubic whose handles lie on its chord is a straight line (the engine writes some lines as curves)
const straight = s => { const [a, b, c, e] = s.P, dx = e[0] - a[0], dy = e[1] - a[1], L = Math.hypot(dx, dy); if (L < 1e-9) return true;
  const off = p => Math.abs((p[0] - a[0]) * dy - (p[1] - a[1]) * dx) / L; return off(b) < 1e-4 && off(c) < 1e-4; };
function nodesOf(d) { return parse(d).map(segs => segs.map(s => ({ k: s.k === 'L' || straight(s) ? 'L' : 'C', P: s.P.map(p => p.slice()) }))); }
function bboxOf(segs) { let x0 = 1e9, y0 = 1e9; for (const s of segs) for (const p of s.P) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); } return [x0, y0]; }
function rigid(d0, opts, L) {
  const A = nodesOf(d0), Bs = nodesOf(L.d);
  // pair contours (a contour closed at 12 is gone): same segment count and the nearest corner
  const pairs = [];
  for (const b of Bs) { let best = null, bd = 1e9; const cb = bboxOf(b);
    A.forEach((a, i) => { if (a.length !== b.length || pairs.some(p => p.i === i)) return; const ca = bboxOf(a), dd = Math.hypot(ca[0] - cb[0], ca[1] - cb[1]); if (dd < bd) { bd = dd; best = i; } });
    pairs.push({ i: best, b }); }
  let out = '';
  for (const { i, b } of pairs) {
    if (i == null) { out += toD(b); continue; }
    const a = A[i], n = a.length, disp = a.map((s, j) => [b[j].P[0][0] - s.P[0][0], b[j].P[0][1] - s.P[0][1]]);   // node j = start of seg j
    const axisLine = (s, ax) => s.k === 'L' && Math.abs(s.P[0][ax] - s.P[3][ax]) < 1e-6 && Math.abs(s.P[0][1 - ax] - s.P[3][1 - ax]) >= 0.2;
    const nd = disp.map(v => v.slice());
    // chains of curves: nodes joined by C segments
    const isC = a.map(s => s.k === 'C');
    if (isC.some(x => !x)) {
      let start = isC.findIndex((c, j) => !c);   // begin after a line
      for (let step = 0; step < n; step++) {
        const j = (start + 1 + step) % n; if (!isC[j] || isC[(j - 1 + n) % n]) continue;
        const nodes = [j]; let e = j; while (isC[e]) { e = (e + 1) % n; nodes.push(e); if (nodes.length > n) break; }
        // chain: segs j..e-1, nodes j..e; its ends meet lines a[j-1] (before) and a[e] (after)
        const before = a[(j - 1 + n) % n], after = a[e % n];
        for (const ax of [0, 1]) {
          const c1 = axisLine(before, ax) ? disp[j][ax] : null, c2 = axisLine(after, ax) ? disp[e][ax] : null;
          let v;
          if (c1 != null && c2 != null) { if (Math.abs(c1 - c2) > 1e-6) continue; v = c1; }   // moved apart: keep the stretch
          else if (c1 != null || c2 != null) v = c1 != null ? c1 : c2;
          else {   // no straight edge on this axis: the run moves with its extreme (the silhouette point the grid placed)
            const lo = nodes.reduce((m, q) => a[q % n].P[0][ax] < a[m % n].P[0][ax] ? q : m, nodes[0]), hi = nodes.reduce((m, q) => a[q % n].P[0][ax] > a[m % n].P[0][ax] ? q : m, nodes[0]);
            v = Math.abs(disp[lo % n][ax]) > Math.abs(disp[hi % n][ax]) ? disp[lo % n][ax] : disp[hi % n][ax];
          }
          for (const q of nodes) nd[q][ax] = v;
        }
      }
    }
    // rebuild: nodes moved by nd; a curve's handles move with its own nodes when its chain is rigid, else as the landing put them
    const segs = a.map((s, j) => {
      const k = (j + 1) % n, p0 = [s.P[0][0] + nd[j][0], s.P[0][1] + nd[j][1]], p3 = [s.P[3][0] + nd[k][0], s.P[3][1] + nd[k][1]];
      if (s.k === 'L') return { k: 'L', P: [p0, p0, p3, p3] };
      const rigid = Math.abs(nd[j][0] - nd[k][0]) < 1e-9 && Math.abs(nd[j][1] - nd[k][1]) < 1e-9;
      return rigid ? { k: 'C', P: [p0, [s.P[1][0] + nd[j][0], s.P[1][1] + nd[j][1]], [s.P[2][0] + nd[k][0], s.P[2][1] + nd[k][1]], p3] } : { k: 'C', P: [p0, b[j].P[1], b[j].P[2], p3] };
    });
    out += toD(segs);
  }
  return { ...L, d: out };
}
function toD(segs) { const s6 = p => `${f6(p[0])} ${f6(p[1])}`; let o = 'M' + s6(segs[0].P[0]); for (const s of segs) o += s.k === 'L' ? 'L' + s6(s.P[3]) : 'C' + s6(s.P[1]) + ' ' + s6(s.P[2]) + ' ' + s6(s.P[3]); return o + 'Z'; }
// THE GRID STEP: both landings are made, and the one that keeps the drawn curvature wins (fewest curvature faults), then the one
// that lands the most outer edges. Continuous curvature outranks the snap method; neither is chosen per icon by hand.
function land(d0, opts) {
  const fair = require('./fair-check.js'), join = require('./join-check.js'), L = OS.land(d0, opts), R = rigid(d0, opts, L);
  const frame = opts.size, score = d => 100 * (fair.check(d).length + join.check(d).length) + OS.report(d, frame, 3, opts.sym).filter(r => r.kind.startsWith('outer') && !r.lands).length;
  const sL = score(L.d), sR = score(R.d);
  return sR < sL ? { ...R, how: 'rigid', score: sR, other: sL } : { ...L, how: 'stretch', score: sL, other: sR };
}
module.exports = { land, rigid };

// THE GRID FIRST, ON THE ROOTS (the system's landing): the snap priority is worked out on the joined roots before any corner is
// rounded (one-side.js on the plain union), and that map of the plane moves the roots themselves. The corner law and the fairing
// then run on roots that already sit on the grid: straight edges land exactly, and every round and join is built fresh, so the
// grid costs no curvature at all.
function landPrims(prims, sym, opts) {
  const E = require('./engine.js'), path = require('path');
  const paper = require(path.join(process.env.TOOLS, 'node_modules/paper/dist/paper-core.js'));
  const abs = d => { const it = new paper.CompoundPath(d), kids = it.children && it.children.length ? it.children : [it]; let o = '';
    const q = v => +v.toFixed(6);
    for (const k of kids) { const sg = k.segments, n = sg.length; o += `M${q(sg[0].point.x)} ${q(sg[0].point.y)}`;
      for (let i = 0; i < n; i++) { const a = sg[i], b = sg[(i + 1) % n];
        if (a.handleOut.isZero() && b.handleIn.isZero()) o += `L${q(b.point.x)} ${q(b.point.y)}`;
        else o += `C${q(a.point.x + a.handleOut.x)} ${q(a.point.y + a.handleOut.y)} ${q(b.point.x + b.handleIn.x)} ${q(b.point.y + b.handleIn.y)} ${q(b.point.x)} ${q(b.point.y)}`; }
      o += 'Z'; }
    it.remove(); return o; };
  const sharp = abs(E.build(prims).d), L = OS.land(sharp, { ...opts, sym });
  const [mx, my] = L.maps, ax = mx.forC(-1), ay = my.forC(-1);
  const mapD = d => {
    const it = new paper.CompoundPath(d), kids = it.children && it.children.length ? it.children : [it];
    for (const k of kids) for (const sg of k.segments) {
      const p = sg.point, np = new paper.Point(ax.map(p.x), ay.map(p.y));
      const hm = h => new paper.Point(h.x * ax.slope(p.x, Math.sign(h.x)), h.y * ay.slope(p.y, Math.sign(h.y)));
      sg.handleIn = hm(sg.handleIn); sg.handleOut = hm(sg.handleOut); sg.point = np;
    }
    const out = it.pathData; it.remove(); return out;
  };
  // a root moves whole (a translation: its curves keep their curvature) unless the grid changes its own width or height,
  // when it takes the map (its straight sides land; a curve inside it stretches with them)
  const shift = (d, dx, dy) => { const it = new paper.CompoundPath(d); it.translate(new paper.Point(dx, dy)); const o = it.pathData; it.remove(); return o; };
  const parts = E.parts(prims);
  return prims.map((q, i) => {
    const it = new paper.CompoundPath(parts[i].d), b = it.bounds; it.remove();
    const dx0 = ax.map(b.left) - b.left, dx1 = ax.map(b.right) - b.right, dy0 = ay.map(b.top) - b.top, dy1 = ay.map(b.bottom) - b.bottom;
    if (process.env.LANDDBG) console.error(i, b.left.toFixed(3), b.right.toFixed(3), b.top.toFixed(3), b.bottom.toFixed(3), dx0.toFixed(3), dx1.toFixed(3), dy0.toFixed(3), dy1.toFixed(3));
    const whole = Math.abs(dx0 - dx1) < 1e-6 && Math.abs(dy0 - dy1) < 1e-6, curved = /[cCqQaAsS]/.test(parts[i].d);
    if (whole) return { t: 'D', d: shift(parts[i].d, dx0, dy0), cut: !!q.cut, root: q.root, also: q.also, how: 'moved' };
    // a curved root keeps its shape: it is never stretched, only scaled evenly (a circle stays a circle and the corner law still
    // eases it in from its straights). It takes the even scale that lands both of its straight sides on one axis (the size the grid
    // gives its straight sides), then moves whole so they land; on the other axis it lands the side that reaches a whole px (else
    // its first side). With no axis of two straight sides it only moves. Curvature outranks a landed edge.
    const it3 = new paper.CompoundPath(parts[i].d), kids3 = it3.children && it3.children.length ? it3.children : [it3], side = { left: 0, right: 0, top: 0, bottom: 0 };
    for (const k3 of kids3) for (const cv of k3.curves) { if (!cv.isStraight()) continue; const a = cv.point1, z = cv.point2;
      if (Math.abs(a.x - z.x) < 2e-3 && Math.abs(a.y - z.y) > 0.3) { if (Math.abs(a.x - b.left) < 2e-3) side.left = 1; if (Math.abs(a.x - b.right) < 2e-3) side.right = 1; }
      if (Math.abs(a.y - z.y) < 2e-3 && Math.abs(a.x - z.x) > 0.3) { if (Math.abs(a.y - b.top) < 2e-3) side.top = 1; if (Math.abs(a.y - b.bottom) < 2e-3) side.bottom = 1; } }
    // a root whose four sides are straight (a slab with machined ends, a post) has curves only where its own straights turn: it
    // takes the map like any straight root, so it stays joined to the roots it was drawn against
    // the map is safe for a root when it scales every curve of the root by one even amount (the same across and down, and the same
    // either side of every smooth node): then each curve keeps its shape and its curvature stays continuous
    const safe = (() => { const eq = (f, lo, hi) => { const r0 = f(lo, 1); for (let t = 0; t <= 8; t++) { const v = lo + (hi - lo) * t / 8; if (Math.abs(f(v, 1) - r0) > 1e-6 || Math.abs(f(v, -1) - r0) > 1e-6) return false; } return true; };
      const sx = (v, d) => ax.slope(v, d), sy = (v, d) => ay.slope(v, d);
      for (const k3 of kids3) { const cs = k3.curves, n3 = cs.length; for (let c = 0; c < n3; c++) { const cv = cs[c], nx = cs[(c + 1) % n3];
        const bb = cv.bounds;
        if (!cv.isStraight() && !(eq(sx, bb.left, bb.right) && eq(sy, bb.top, bb.bottom) && Math.abs(sx(bb.left, 1) - sy(bb.top, 1)) < 1e-6)) return false;   // and evenly: a circle stays a circle
        const smooth = cv.getTangentAtTime(1).getDistance(nx.getTangentAtTime(0)) < 1e-3 && !(cv.isStraight() && nx.isStraight());
        if (smooth) { const P3 = cv.point2, bx = cv.isStraight() ? nx : cv, b2 = bx.bounds;
          if (!(eq(sx, Math.min(P3.x, b2.left), Math.max(P3.x, b2.right)) && eq(sy, Math.min(P3.y, b2.top), Math.max(P3.y, b2.bottom)))) return false; } } }
      return true; })();
    if (!curved || safe || (side.left && side.right && side.top && side.bottom)) { it3.remove(); return { t: 'D', d: mapD(parts[i].d), cut: !!q.cut, root: q.root, also: q.also, how: 'mapped' }; }
    let k = 1, tx, ty;
    // a curved root's straight sides land by the snap priority themselves (a whole px within 1/4px, else the nearest iPhone pixel):
    // a short straight side can be too short for the union's map to see it as an edge
    const q3 = opts.size / 24, snapS = v => { const p = v * q3, w = Math.round(p); return (Math.abs(p - w) <= 0.25 + 1e-9 ? w : Math.round(p * 3) / 3) / q3 - v; };
    if (side.top && side.bottom) { const a0 = snapS(b.top), a1 = snapS(b.bottom); k = (b.height + a1 - a0) / b.height; ty = a0; }
    else if (side.left && side.right) { const a0 = snapS(b.left), a1 = snapS(b.right); k = (b.width + a1 - a0) / b.width; tx = a0; }
    it3.scale(k, new paper.Point(b.left, b.top));
    const w2 = b.width * k, h2 = b.height * k;
    const kk = opts.size / 24, wholePx = v => Math.abs(v * kk - Math.round(v * kk)) < 1e-6;   // whole px at this size
    // the side to land: the straight one; if both or neither, the one on a whole px; else the first
    const choose = (s0, s1, p0, p1, a0, a1, ext) => (s0 && !s1) ? a0 : (s1 && !s0) ? p1 + a1 - ext - (p0) : wholePx(p0 + a0) ? a0 : wholePx(p1 + a1) ? p1 + a1 - ext - p0 : a0;
    if (tx == null) tx = choose(side.left, side.right, b.left, b.right, dx0, dx1, w2);
    if (ty == null) ty = choose(side.top, side.bottom, b.top, b.bottom, dy0, dy1, h2);
    // a root centred on the icon's axis stays centred (it is mirrored after; a tip moved off the axis comes back doubled)
    if (sym != null && Math.abs(b.left + b.right - 2 * sym) < 2e-3) tx = sym - (b.left + w2 / 2);
    it3.translate(new paper.Point(tx, ty)); const o = it3.pathData; it3.remove();
    return { t: 'D', d: o, cut: !!q.cut, root: q.root, also: q.also, how: 'scaled evenly ' + k.toFixed(4) };
  });
}
module.exports.landPrims = landPrims;
// at a size whose counters close: a hole whose narrower side is under the minimum (in frame units) is filled
function closeSmall(d, min) {
  const path = require('path'), paper = require(path.join(process.env.TOOLS, 'node_modules/paper/dist/paper-core.js'));
  const subs = d.split(/(?=M)/), items = subs.map(q => new paper.Path(q)), closed = [];
  const keep = subs.filter((q, i) => {
    const it = items[i], p = it.getPointAt(0), inside = items.filter((o, j) => j !== i && o.contains(p)).length % 2 === 1;
    if (inside && Math.min(it.bounds.width, it.bounds.height) < min - 0.05) { closed.push({ at: [+it.bounds.x.toFixed(2), +it.bounds.y.toFixed(2)], w: +it.bounds.width.toFixed(2), h: +it.bounds.height.toFixed(2) }); return false; }
    return true;
  });
  items.forEach(it => it.remove());
  return { d: keep.join(''), closed };
}
module.exports.closeSmall = closeSmall;
