// ONE SIDE ON THE GRID (10-27). The last step of every build: the drawing (the engine's outline, as drawn) is landed on the iPhone's
// pixels at the size it is shown. Not a refit: it is how the system writes an icon for its screen, at each size it ships.
//
// THE GRID: one iPhone pixel, 1/3 CSS px at 3x. At a size s (CSS px of the 24 box) one drawing unit is s/24 x 3 iPhone pixels.
// THE RULES (grid/THE-GRID.md says them in words):
//   1. Outer edges land. Every straight edge (0.4 long or more) and every big round's extreme (radius 3/4 or more) that faces the
//      outside of the icon goes to the nearest iPhone pixel: it moves at most half an iPhone pixel across itself (1/6 px at 24).
//   2. One side of each stroke and stem lands: the outer side. The part keeps its width, so its inner side falls where the width
//      puts it. Inner edges, counters and cut-outs are sized by the drawing, never snapped.
//   3. A part on the icon's centre line stays centred. A symmetric icon stays exactly on its centre; its right half is the mirror
//      of its left.
//   4. Curves, diagonals, points and corner rounds are not snapped: they are carried by the edges either side of them
//      (straight-line interpolation per contour), so a curve keeps its shape and a join stays smooth.
//   5. Counters (a space closed on every side) are at least the size's minimum. At 24 and 18 a short one opens by moving the
//      stroke beside it outward (its width kept), never the mass. At 12 a short one closes: the part goes solid.
//   6. SIZE STANDARDS: at 18 and 12 every part's width is whole iPhone pixels. A stroke (drawn 1.2-1.8) is the drawing's weight
//      rounded to the nearest pixel (18: 3, 12: 2); every other part is its drawn width rounded, a tie to the even count. A stroke
//      on the centre line takes the nearest even count; any other centred part, an odd count goes up one. So both sides of a
//      centred part land and the centre never moves. 24 keeps every width.
//
//   const { land, report } = require('./one-side.js');
//   land(d, { size: 24, sym: 12 }) -> { d, ... }        report(d, size, dpr) -> every core edge with its kind and how far it sits off
'use strict';
const { parse } = require('./join-check.js');
const { findEdges, centroid } = require('./pixel-fit.js');

const DPR = 3, STEM_MAX = 3.5, OVERLAP = 0.4, EPS = 1e-6;
const STANDARD = {   // per shown size: the stroke and the counter minimum, in iPhone pixels (null: keep the drawing's)
  24: { stroke: null, counter: 3 },
  18: { stroke: 3, counter: 3 },
  12: { stroke: 2, counter: 2, close: true },
};
const isStroke = w => w >= 1.2 && w <= 1.8;
const bz = (P, t, i) => (1 - t) ** 3 * P[0][i] + 3 * t * (1 - t) ** 2 * P[1][i] + 3 * t * t * (1 - t) * P[2][i] + t ** 3 * P[3][i];
const f6 = v => +v.toFixed(6);

// ---- which side is outside: the glyph rasterised at 1/10 unit, the empty space flood-filled from the frame's edge
function outside(d) {
  const subs = parse(d), ps = subs.map(segs => { const p = []; for (const s of segs) { if (s.k === 'L') p.push(s.P[0]); else for (let q = 0; q < 16; q++) p.push([bz(s.P, q / 16, 0), bz(s.P, q / 16, 1)]); } return p; });
  const R = 0.1, N = Math.round(24 / R) + 2, ink = new Uint8Array(N * N), ext = new Uint8Array(N * N);
  for (let j = 0; j < N; j++) {
    const y = (j - 1 + 0.5) * R, xs = [];
    for (const p of ps) for (let i = 0, k = p.length - 1; i < p.length; k = i++) { const [xi, yi] = p[i], [xk, yk] = p[k]; if ((yi > y) !== (yk > y)) xs.push((xk - xi) * (y - yi) / (yk - yi) + xi); }
    xs.sort((a, b) => a - b);
    for (let q = 0; q + 1 < xs.length; q += 2) { const a = Math.ceil(xs[q] / R - 0.5) + 1, b = Math.floor(xs[q + 1] / R - 0.5) + 1; for (let i = Math.max(0, a); i <= Math.min(N - 1, b); i++) ink[j * N + i] = 1; }
  }
  const st = [0]; ext[0] = 1;
  while (st.length) { const c = st.pop(), i = c % N, j = (c - i) / N; for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const a = i + di, b = j + dj; if (a < 0 || b < 0 || a >= N || b >= N) continue; const n = b * N + a; if (!ext[n] && !ink[n]) { ext[n] = 1; st.push(n); } } }
  return (x, y) => { const i = Math.round(x / R - 0.5) + 1, j = Math.round(y / R - 0.5) + 1; return i >= 0 && j >= 0 && i < N && j < N ? !!ext[j * N + i] : true; };
}
// an edge faces outside when the empty side of its run's middle is outside
function facesOut(e, ax, isOut) {
  const mid = (e.lo + e.hi) / 2, side = -e.ink * 0.2, p = ax === 'y' ? [mid, e.pos + side] : [e.pos + side, mid];
  return isOut(p[0], p[1]);
}

// ---- stems: an edge with ink after it and the nearest facing edge that overlaps it (as pixel-fit.js pairs them)
function pairStems(list) {
  const used = new Set(), stems = [], cands = [];
  list.forEach((a, i) => {
    if (a.ink !== 1) return; let best = null;
    list.forEach((b, j) => {
      if (b.ink !== -1 || b.pos <= a.pos + 1e-3 || b.pos - a.pos > STEM_MAX) return;
      const ov = Math.min(a.hi, b.hi) - Math.max(a.lo, b.lo);
      if (ov < OVERLAP * Math.min(a.hi - a.lo, b.hi - b.lo) && ov < 0.6) return;
      if (!best || b.pos < best.b.pos) best = { b, j, ov };
    });
    if (best) cands.push({ i, j: best.j, w: best.b.pos - a.pos, ov: best.ov });
  });
  cands.sort((p, q) => q.ov - p.ov);
  for (const c of cands) { if (used.has(c.i) || used.has(c.j)) continue; used.add(c.i); used.add(c.j); stems.push(c); }
  return { stems, used };
}

// ---- interpolation per contour (each point moved by the controls on its own contour), handles carried by the local slope
function mapper(ctl) {
  ctl.sort((p, q) => p.o - q.o);
  const pts = [];
  for (const c of ctl) { const l = pts[pts.length - 1]; if (l && Math.abs(l.o - c.o) < 1e-4) { if (c.pri > l.pri) { l.n = c.n; l.pri = c.pri; } l.cis = [...new Set([...l.cis, ...c.cis])]; } else pts.push({ ...c, cis: [...c.cis] }); }
  // order: a control that would cross its neighbour gives way (the shorter run)
  for (let g = 0; g < 200; g++) { let bad = -1; for (let i = 1; i < pts.length; i++) if (pts[i].n - pts[i - 1].n < 0.05 * Math.min(1, pts[i].o - pts[i - 1].o) - EPS) { bad = i; break; } if (bad < 0) break; pts.splice(pts[bad].pri < pts[bad - 1].pri ? bad : bad - 1, 1); }
  const mk = P => {
    const n = P.length, X = P.map(p => p.o), Y = P.map(p => p.n), at = v => { let i = 0; while (i < n - 2 && X[i + 1] < v) i++; return i; };
    const map = v => { if (!n) return v; if (v <= X[0]) return Y[0] + v - X[0]; if (v >= X[n - 1]) return Y[n - 1] + v - X[n - 1]; const i = at(v); return Y[i] + (v - X[i]) * (Y[i + 1] - Y[i]) / (X[i + 1] - X[i]); };
    const slope = (v, dir) => { if (n < 2 || v < X[0] || (v === X[0] && dir < 0) || v > X[n - 1] || (v === X[n - 1] && dir > 0)) return 1; let i = at(v); if (Math.abs(v - X[i + 1]) < 1e-9 && dir > 0 && i < n - 2) i++; if (Math.abs(v - X[i]) < 1e-9 && dir < 0 && i > 0) i--; return (Y[i + 1] - Y[i]) / (X[i + 1] - X[i]); };
    return { map, slope };
  };
  const per = new Map(); for (const p of pts) for (const c of p.cis) { if (!per.has(c)) per.set(c, []); per.get(c).push(p); }
  const all = mk(pts), maps = new Map([...per].map(([c, P]) => [c, mk(P)]));
  return { forC: ci => maps.get(ci) || all, pts };
}
function apply(d, mx, my) {
  const subs = parse(d); let out = '', maxMove = 0, ax, ay, ci = -1;
  const T = p => { const q = [ax.map(p[0]), ay.map(p[1])]; maxMove = Math.max(maxMove, Math.abs(q[0] - p[0]), Math.abs(q[1] - p[1])); return q; };
  const H = (h, node, nn) => [nn[0] + (h[0] - node[0]) * ax.slope(node[0], Math.sign(h[0] - node[0])), nn[1] + (h[1] - node[1]) * ay.slope(node[1], Math.sign(h[1] - node[1]))];
  const unit = v => { const l = Math.hypot(v[0], v[1]); return l < 1e-9 ? null : [v[0] / l, v[1] / l]; };
  const tin = P => unit([P[3][0] - P[2][0], P[3][1] - P[2][1]]) || unit([P[3][0] - P[0][0], P[3][1] - P[0][1]]);
  const tout = P => unit([P[1][0] - P[0][0], P[1][1] - P[0][1]]) || unit([P[3][0] - P[0][0], P[3][1] - P[0][1]]);
  for (const segs of subs) {
    ci++; ax = mx.forC(ci); ay = my.forC(ci); if (!segs.length) continue;
    const nu = segs.map(s => { const p0 = T(s.P[0]), p3 = T(s.P[3]); return s.k === 'L' ? { k: 'L', P: [p0, p0, p3, p3] } : { k: 'C', P: [p0, H(s.P[1], s.P[0], p0), H(s.P[2], s.P[3], p3), p3] }; });
    // smooth stays smooth: a node that ran on without a turn runs on again
    for (let i = 0; i < segs.length; i++) {
      const j = (i + 1) % segs.length, a0 = tin(segs[i].P), b0 = tout(segs[j].P);
      if (!a0 || !b0 || a0[0] * b0[0] + a0[1] * b0[1] < Math.cos(Math.PI / 180)) continue;
      const A = nu[i], B = nu[j], a = tin(A.P), b = tout(B.P); if (!a || !b || (A.k === 'L' && B.k === 'L')) continue;
      const dir = A.k === 'L' ? a : B.k === 'L' ? b : unit([a[0] + b[0], a[1] + b[1]]), nd = A.P[3];
      if (A.k === 'C') { const l = Math.hypot(A.P[2][0] - nd[0], A.P[2][1] - nd[1]); A.P[2] = [nd[0] - dir[0] * l, nd[1] - dir[1] * l]; }
      if (B.k === 'C') { const l = Math.hypot(B.P[1][0] - nd[0], B.P[1][1] - nd[1]); B.P[1] = [nd[0] + dir[0] * l, nd[1] + dir[1] * l]; }
    }
    const s6 = p => `${f6(p[0])} ${f6(p[1])}`;
    out += 'M' + s6(nu[0].P[0]); for (const s of nu) out += s.k === 'L' ? 'L' + s6(s.P[3]) : 'C' + s6(s.P[1]) + ' ' + s6(s.P[2]) + ' ' + s6(s.P[3]); out += 'Z';
  }
  return { d: out, maxMove };
}

// ---- rule 5: counters open to the size's minimum by moving the stroke beside them
function openAxis(list, stems, isOut, ax, min, strokeU, close = false, closed = new Set()) {
  const strokeish = w => isStroke(w) || (strokeU && Math.abs(w - strokeU) < 0.08);
  const ctl = list.map(e => ({ o: e.pos, n: e.pos, pri: e.hi - e.lo, cis: [e.ci] })), opened = [];
  const stemOf = i => stems.find(s => s.i === i || s.j === i);
  const sorted = list.map((e, i) => ({ e, i })).sort((a, b) => a.e.pos - b.e.pos);
  for (const { e: a, i } of sorted) {
    if (a.ink !== -1) continue;
    const nxt = sorted.find(({ e: b }) => b.ink === 1 && b.pos > a.pos + 1e-3 && Math.min(a.hi, b.hi) - Math.max(a.lo, b.lo) > 0.3);
    if (!nxt) continue;
    const b = nxt.e, j = nxt.i, g = b.pos - a.pos;
    if (g >= min - 1e-3) continue;
    const mid = (Math.max(a.lo, b.lo) + Math.min(a.hi, b.hi)) / 2, p = (a.pos + b.pos) / 2;
    if (ax === 'y' ? isOut(mid, p) : isOut(p, mid)) continue;   // open to the outside: a gap, not a counter
    if (close) { if (a.ci === b.ci) { closed.add(a.ci); opened.push({ ax, at: +a.pos.toFixed(3), from: +g.toFixed(3), to: 0 }); } continue; }
    const S1 = stemOf(i), S2 = stemOf(j), st1 = S1 && strokeish(S1.w), st2 = S2 && strokeish(S2.w), need = min - g;
    const mv = (S, dv) => { for (const k of [S.i, S.j]) ctl[k].n = list[k].pos + dv; };
    if (st1 && st2) { mv(S1, -need / 2); mv(S2, need / 2); } else if (st1) mv(S1, -need); else if (st2) mv(S2, need); else continue;
    opened.push({ ax, at: +a.pos.toFixed(3), from: +g.toFixed(3), to: +min.toFixed(3) });
  }
  return { m: mapper(ctl), opened };
}

// ---- rules 1-3 and 6: land
function landAxis(list, stems, used, isOut, ax, k, sym, strokeU, centredU, kW = null) {
  const snap = v => Math.round(v * k) / k, ctl = [], kinds = [];
  const solidW = w => kW ? evenTie(w * kW) / kW : w;
  const put = (e, n, kind) => { ctl.push({ o: e.pos, n, pri: (e.hi - e.lo) + (kind === 'kept' ? 0 : 100), cis: [e.ci], e }); kinds.push({ pos: e.pos, kind }); };
  const C = sym != null ? sym : null, left = v => C == null || v < C - 1e-3, onAxis = (a, b) => C != null && Math.abs(a + b - 2 * C) < 0.02;
  for (const s of stems) {
    const a = list[s.i], b = list[s.j], W = strokeU && isStroke(s.w) ? strokeU : solidW(s.w);
    if (onAxis(a.pos, b.pos)) { const Wc = centredU && isStroke(s.w) ? centredU : kW ? evenUp(W * kW) / kW : W; put(a, C - Wc / 2, 'centred'); put(b, C + Wc / 2, 'centred'); continue; }
    if (!left(b.pos)) continue;   // the right half is the left's mirror
    const oa = facesOut(a, ax, isOut), ob = facesOut(b, ax, isOut);
    let lo, hi;
    if (oa && !ob) { lo = snap(a.pos); hi = lo + W; put(a, lo, 'outer'); put(b, hi, 'stroke side'); }
    else if (ob && !oa) { hi = snap(b.pos); lo = hi - W; put(b, hi, 'outer'); put(a, lo, 'stroke side'); }
    else {   // both sides out (a free post) or both in (a column between counters): the side nearer the grid lands
      const la = snap(a.pos), hb = snap(b.pos);
      if (Math.abs(la - a.pos) <= Math.abs(hb - b.pos)) { put(a, la, oa ? 'outer' : 'inner (lands)'); put(b, la + W, 'stroke side'); }
      else { put(b, hb, ob ? 'outer' : 'inner (lands)'); put(a, hb - W, 'stroke side'); }
    }
  }
  list.forEach((e, i) => { if (used.has(i) || !left(e.pos)) return; if (facesOut(e, ax, isOut)) put(e, snap(e.pos), 'outer'); else put(e, e.pos, 'kept'); });
  if (C != null) {   // mirror the left half's controls onto the right
    const L = [...ctl];
    // each left edge's mate: the edge at its mirror position whose run matches it best (several edges can share a position)
    for (const c of L) { const near = (e, f) => Math.abs(e.lo - f.lo) + Math.abs(e.hi - f.hi), mate = list.filter(e => Math.abs(e.pos - (2 * C - c.o)) < 0.02 && e.pos > C + 1e-3).sort((p, q) => near(p, c.e) - near(q, c.e))[0]; if (!mate) continue; ctl.push({ o: mate.pos, n: 2 * C - c.n, pri: c.pri, cis: [mate.ci] }); const kd = kinds.find(q => Math.abs(q.pos - c.o) < 1e-6); kinds.push({ pos: mate.pos, kind: kd ? kd.kind : 'outer' }); }
  }
  return { m: mapper(ctl), kinds };
}

function land(d0, { size = 24, sym = null, symY = null } = {}) {
  const std = STANDARD[size] || { stroke: null, counter: 3 }, k = size / 24 * DPR, strokeU = std.stroke ? std.stroke / k : null;
  // a stroke centred on the icon's axis takes an even number of iPhone pixels, so both its sides land
  const centredU = std.stroke ? 2 * Math.round(1.5 * k / 2) / k : null;
  let d = d0, opened = [], shift = 0;
  if (strokeU) {
    // a centred solid whose whole-pixel count is odd grows one iPhone pixel; everything either side of it moves out half a pixel,
    // so the openings beside it keep their width and the centre never moves
    if (sym != null) { const E = findEdges(d), { stems } = pairStems(E.x);
      for (const s of stems) { const a = E.x[s.i], b = E.x[s.j]; if (Math.abs(a.pos + b.pos - 2 * sym) > 0.02 || isStroke(s.w)) continue;
        if (Math.round(evenTie(s.w * k)) % 2 === 0) continue;
        const h = 0.5 / k, A = a.pos, Bp = b.pos, sc = (Bp - A + 2 * h) / (Bp - A);
        const map = v => v <= A ? v - h : v >= Bp ? v + h : A - h + (v - A) * sc, slope = v => v > A && v < Bp ? sc : 1;
        const id = { forC: () => ({ map: v => v, slope: () => 1 }) };
        d = apply(d, { forC: () => ({ map, slope }) }, id).d; shift = h; break; } }
    // rule 8: the size's widths first (strokes to the standard, every other part to whole iPhone pixels), nothing moved to the grid yet
    const E = findEdges(d), isOut = outside(d), mx = landAxis(E.x, ...stemsOf(E.x), isOut, 'x', 1e6, sym, strokeU, centredU, k), my = landAxis(E.y, ...stemsOf(E.y), isOut, 'y', 1e6, symY, strokeU, centredU, k);
    d = apply(d, mx.m, my.m).d;
  }
  // rule 5: counters under the size's minimum open (24, 18) or close (12: the part goes solid)
  { const min = std.counter / k, E = findEdges(d), isOut = outside(d), sx = pairStems(E.x).stems, sy = pairStems(E.y).stems, closed = new Set();
    const ox = openAxis(E.x, sx, isOut, 'x', min, strokeU, !!std.close, closed), oy = openAxis(E.y, sy, isOut, 'y', min, strokeU, !!std.close, closed); opened = [...ox.opened, ...oy.opened];
    if (closed.size) d = d.split(/(?=M)/).filter((q, i) => !closed.has(i)).join('');
    else if (opened.length) d = apply(d, ox.m, oy.m).d; }
  // rules 2-4, 6: land
  const E = findEdges(d), isOut = outside(d), mx = landAxis(E.x, ...stemsOf(E.x), isOut, 'x', k, sym, null), my = landAxis(E.y, ...stemsOf(E.y), isOut, 'y', k, symY, null);
  const r = apply(d, mx.m, my.m);
  return { d: r.d, maxMove: r.maxMove, opened, shift, sym, size, k };
}
const evenUp = n => { const r = Math.round(n); return r % 2 ? r + 1 : r; };   // a centred part: an odd count goes up one, so both sides land and the centre never moves
const evenTie = v => { const f = Math.floor(v), r = v - f; return Math.abs(r - 0.5) < 0.02 ? (f % 2 ? f + 1 : f) : Math.round(v); };   // a tie (within 1/50 of a pixel) goes to the even count
function stemsOf(list) { const { stems, used } = pairStems(list); return [stems, used]; }

// ---- THE CHECK (information, not a goal): every core edge, its kind, and how far it sits off a device pixel at a density
function report(d, size = 24, dpr = 3, sym = null, symY = null) {
  const E = findEdges(d), isOut = outside(d), k = size / 24 * dpr, rows = [];
  for (const ax of ['x', 'y']) {
    const { stems, used } = pairStems(E[ax]), C = ax === 'x' ? sym : symY;
    const kindOf = new Map();
    for (const s of stems) {
      const a = E[ax][s.i], b = E[ax][s.j];
      if (C != null && Math.abs(a.pos + b.pos - 2 * C) < 0.02) { kindOf.set(s.i, 'centred'); kindOf.set(s.j, 'centred'); continue; }
      const oa = facesOut(a, ax, isOut), ob = facesOut(b, ax, isOut);
      if (oa !== ob) { kindOf.set(s.i, oa ? 'outer' : 'stroke side'); kindOf.set(s.j, ob ? 'outer' : 'stroke side'); }
      else { kindOf.set(s.i, oa ? 'outer (free post)' : 'inner'); kindOf.set(s.j, ob ? 'outer (free post)' : 'inner'); }
    }
    E[ax].forEach((e, i) => {
      const kind = kindOf.get(i) || (facesOut(e, ax, isOut) ? 'outer' : 'inner'), v = e.pos * k, off = Math.abs(v - Math.round(v));
      rows.push({ ax, pos: +e.pos.toFixed(4), run: +(e.hi - e.lo).toFixed(2), kind, off: +off.toFixed(3), lands: off < 0.05 });
    });
  }
  return rows;
}
const ink = d => centroid(d).area;
module.exports = { land, report, outside, STANDARD, DPR, ink };
