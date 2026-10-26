// PIXEL FIT (10-26; owner: "the long play is an iphone app, so we need to resolve the subpixel issue. subpixels are fine in
// some cases, but in core dimensions and core line landings the fuzziness is tough ... i am also using a 5k LG display on
// mac...so im seeing these in high res no matter where i am looking.")
//
// A FINAL PASS, outside the drawing logic: it takes a finished outline (absolute M L C Z, in the 24 badge's px, as the
// engine writes it), a render size (css px of the 24 box) and a density (device px per css px: 2 = the 5K at its default
// "looks like 2560x1440" and older iPhones, 3 = iPhones), and moves only what it has to so the core edges land on whole
// DEVICE pixels. Nothing in the approved drawings changes; the pass is run per size and density, like an @2x / @3x asset.
//
// What it fits (the rule, in pixel-fit.md):
//   1. EDGES: every straight upright or level edge 0.4px long or more, and the extremes of a round (a bowl's bottom, the top
//      of a ring) where its radius is 3/4px or more: the edges the eye reads as "the line lands here".
//   2. STEMS: an edge with ink after it, paired with the nearest edge facing it that overlaps it, up to 3.5px away, is a
//      stem (a post, a slab, a ring's wall, a mass). Its width is read as a token (to 1/12px) and set to whole device
//      pixels: round(width x size/24 x density), at least 1. A tie (the 1.5px line at 3x is 4.5 device px) goes by rank
//      (devW): the line and heavier up (3x: 5 device px, 1 2/3px), thinner parts down (a 1.25px post at 2x: 2 device px);
//      tie: 'up' or 'down' forces one way. Same token, same fitted width, everywhere in the icon.
//      The stem keeps its centre to within half a device pixel: its first edge goes to the whole device pixel nearest
//      (centre - fitted width / 2).
//   3. LONE EDGES (an outside edge with no partner, a round's extreme): to the nearest whole device pixel.
//   4. EVERYTHING ELSE (curves, diagonals, the points of the star, the rounds at corners) is not snapped: per axis, every
//      point is moved by the straight-line interpolation between the fitted edges either side of it (TrueType's IUP), so a
//      curve between two fitted edges is stretched with them, never kinked, and a diagonal keeps meeting its edges.
//   Conflicts: fitted edges must keep their order and no space that was 0.3px or more may close; where two disagree the
//   one with the shorter run gives way (it is interpolated instead).
//
//   const { fit, edges } = require('./pixel-fit.js');
//   fit(d, { size: 24, dpr: 3, tie: 'rank' }) -> { d, moves: [...], stems: [...], maxMove }   (moves in css px)
//   edges(d, size, dpr) -> the core edges with how far each sits from a whole device pixel (for the measure)
'use strict';
const { parse } = require('./join-check.js');

const MIN_LEN = 0.4, ROUND_R = 0.75, STEM_MAX = 3.5, OVERLAP = 0.4, KEEP_GAP = 0.3, EPS = 1e-3;
const bz = (P, t, i) => (1 - t) ** 3 * P[0][i] + 3 * t * (1 - t) ** 2 * P[1][i] + 3 * t * t * (1 - t) * P[2][i] + t ** 3 * P[3][i];
const d1 = (P, t, i) => 3 * (1 - t) ** 2 * (P[1][i] - P[0][i]) + 6 * t * (1 - t) * (P[2][i] - P[1][i]) + 3 * t * t * (P[3][i] - P[2][i]);
const d2 = (P, t, i) => 6 * (1 - t) * (P[2][i] - 2 * P[1][i] + P[0][i]) + 6 * t * (P[3][i] - 2 * P[2][i] + P[1][i]);
const f6 = v => +v.toFixed(6);

// ---- the outline as polygons, for "which side is ink" (even-odd, as the paths are filled)
function polys(subs, n = 24) {
  return subs.map(segs => { const p = []; for (const s of segs) { if (s.k === 'L') p.push(s.P[0]); else for (let q = 0; q < n; q++) p.push([bz(s.P, q / n, 0), bz(s.P, q / n, 1)]); } return p; });
}
function inkAt(pt, ps) {
  let c = false;
  for (const p of ps) for (let i = 0, j = p.length - 1; i < p.length; j = i++) { const [xi, yi] = p[i], [xj, yj] = p[j]; if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi) c = !c; }
  return c;
}

// ---- 1. the core edges, per axis. ax 'y': level edges (pos = y, run along x); ax 'x': upright edges.
function findEdges(d) {
  const subs = parse(d), ps = polys(subs), raw = { x: [], y: [] };
  let ci = -1;
  const add = (ax, pos, a, b, kind, len) => {
    const o = ax === 'y' ? 0 : 1, mid = (a + b) / 2, e = 0.03;
    const p1 = ax === 'y' ? [mid, pos + e] : [pos + e, mid], p0 = ax === 'y' ? [mid, pos - e] : [pos - e, mid];
    const after = inkAt(p1, ps), before = inkAt(p0, ps);
    if (after === before) return;                       // not a boundary (a seam): skip
    raw[ax].push({ pos, lo: Math.min(a, b), hi: Math.max(a, b), ink: after ? 1 : -1, kind, len, ci });
  };
  for (const segs of subs) {
    ci++;
    // straight runs: consecutive level/upright L segments merged
    for (const s of segs) {
      const [p, , , q] = s.P;
      const straight = s.k === 'L' || (Math.abs(s.P[1][0] - p[0]) + Math.abs(s.P[2][0] - q[0]) < EPS && Math.abs(p[0] - q[0]) < EPS) || (Math.abs(s.P[1][1] - p[1]) + Math.abs(s.P[2][1] - q[1]) < EPS && Math.abs(p[1] - q[1]) < EPS);
      if (straight) {
        if (Math.abs(p[1] - q[1]) < EPS && Math.abs(p[0] - q[0]) >= MIN_LEN) add('y', (p[1] + q[1]) / 2, p[0], q[0], 'straight', Math.abs(p[0] - q[0]));
        else if (Math.abs(p[0] - q[0]) < EPS && Math.abs(p[1] - q[1]) >= MIN_LEN) add('x', (p[0] + q[0]) / 2, p[1], q[1], 'straight', Math.abs(p[1] - q[1]));
        continue;
      }
      // a round's extremes: where the tangent is level (an extreme in y) or upright (in x), radius >= ROUND_R
      for (const [ax, i] of [['y', 1], ['x', 0]]) {
        const a = s.P[0][i], b = s.P[1][i], c = s.P[2][i], dd = s.P[3][i];
        // d/dt of the coordinate = 3[(b-a)(1-t)^2 + 2(c-b)t(1-t) + (d-c)t^2] -> quadratic in t
        const A = (b - a) - 2 * (c - b) + (dd - c), B = 2 * ((c - b) - (b - a)), C0 = b - a, ts = [];
        if (Math.abs(A) < 1e-12) { if (Math.abs(B) > 1e-12) ts.push(-C0 / B); }
        else { const disc = B * B - 4 * A * C0; if (disc >= 0) { const r = Math.sqrt(disc); ts.push((-B + r) / (2 * A), (-B - r) / (2 * A)); } }
        // an extreme that falls on a node (the engine splits a bowl at its bottom): the handle there runs across the axis
        if (Math.abs(b - a) < EPS && Math.abs(s.P[1][1 - i] - s.P[0][1 - i]) > EPS) ts.push(1e-3);
        if (Math.abs(dd - c) < EPS && Math.abs(s.P[3][1 - i] - s.P[2][1 - i]) > EPS) ts.push(1 - 1e-3);
        for (const t of ts) {
          if (t < 1e-3 - 1e-9 || t > 1 - 1e-3 + 1e-9) continue;
          const vx = d1(s.P, t, 0), vy = d1(s.P, t, 1), v = Math.hypot(vx, vy); if (v < 1e-9) continue;
          const k = Math.abs(vx * d2(s.P, t, 1) - vy * d2(s.P, t, 0)) / v ** 3;
          if (k > 1 / ROUND_R) continue;
          const pos = t === 1e-3 ? s.P[0][i] : t === 1 - 1e-3 ? s.P[3][i] : bz(s.P, t, i), along = bz(s.P, t, 1 - i), half = Math.min(0.5, Math.sqrt(2 * (1 / Math.max(k, 1e-6)) * 0.08));   // the run that sits within 0.08px of the extreme
          add(ax, pos, along - half, along + half, 'round', 2 * half);
        }
      }
    }
  }
  // merge edges at the same place facing the same way with touching runs
  const out = {};
  for (const ax of ['x', 'y']) {
    const list = raw[ax].sort((a, b) => a.pos - b.pos || a.lo - b.lo), m = [];
    for (const e of list) {
      const g = m.find(q => q.ci === e.ci && Math.abs(q.pos - e.pos) < 0.01 && q.ink === e.ink && e.lo <= q.hi + 0.05 && e.hi >= q.lo - 0.05);
      if (g) { g.lo = Math.min(g.lo, e.lo); g.hi = Math.max(g.hi, e.hi); g.len += e.len; if (e.kind === 'straight') g.kind = 'straight'; }
      else m.push({ ...e });
    }
    out[ax] = m;
  }
  return out;
}

// ---- 2. stems: ink-after edge + the nearest facing edge that overlaps it
function pairStems(list) {
  const used = new Set(), stems = [];
  const cands = [];
  list.forEach((a, i) => {
    if (a.ink !== 1) return;
    let best = null;
    list.forEach((b, j) => {
      if (b.ink !== -1 || b.pos <= a.pos + EPS || b.pos - a.pos > STEM_MAX) return;
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

// mirror symmetry of one axis's edges: { c, mate: [[i, j]] } when 90% of the run has a twin facing the other way about c
function mirror(list) {
  if (list.length < 2) return null;
  const c = (Math.min(...list.map(e => e.pos)) + Math.max(...list.map(e => e.pos))) / 2, mate = [];
  let run = 0, hit = 0;
  list.forEach((e, i) => {
    run += e.hi - e.lo;
    const j = list.findIndex(q => q !== e && Math.abs(e.pos + q.pos - 2 * c) < 0.01 && q.ink === -e.ink && Math.abs((q.hi - q.lo) - (e.hi - e.lo)) < 0.6 + 0.2 * (e.hi - e.lo) && Math.min(q.hi, e.hi) - Math.max(q.lo, e.lo) > 0.3 * Math.min(q.hi - q.lo, e.hi - e.lo));
    if (j >= 0) { hit += e.hi - e.lo; mate.push([i, j]); }
  });
  return hit >= 0.9 * run ? { c, mate } : null;
}

const tokenW = w => Math.round(w * 12) / 12;   // a width read as its token, to 1/12px (1.25, 1.5, 1 2/3, 3/4 ...)
// a tie (exactly half a device px over) goes by RANK by default: the line (1.5px) and anything heavier up, anything thinner than
// the line (a post, 1.25px) down, so a post stays thinner than the line at both densities (2x: line 3, post 2; 3x: line 5, post 4)
const LINE = 1.5;
function devW(w, k, tie = 'rank') { const t = tokenW(w), v = t * k; const fl = Math.floor(v + 1e-9), fr = v - fl; const up = tie === 'up' || (tie === 'rank' && t >= LINE - 1e-6); return Math.max(1, Math.abs(fr - 0.5) < 1e-6 ? (up ? fl + 1 : fl) : Math.round(v)); }

// ---- the per-axis map: control points (orig -> fitted), then a smooth monotone curve through them
// SHIFT: first the whole glyph moves, by less than half a device pixel, so that its lattice edges (lone edges and every
// stem's first edge) land as near whole device pixels as they can, weighted by run: the optical centring is itself
// snapped, and the 1/3px lattice the drawing is built on then lands whole at 3x. Then each edge snaps from there.
// The shift is the run-weighted mean PHASE of the lattice edges (their positions read round a circle of one device pixel),
// brought to a whole pixel: it follows the drawing smoothly, so a nudge can't make it jump. STABLE (the jitter check):
// after the shift every position is read in sixths of a device pixel before it is rounded, so a nudge of a few hundredths
// can't flip it; relative to the shift the drawings' own lattice values (thirds, halves) sit well inside a sixth's bin.
// A position half way between two pixels goes up / left (the rasteriser's usual tie rule): a centred odd width (the + at
// 2x) always lands the same way.
// nearest whole px, via sixths; a half goes back toward where the edge was drawn (o, unshifted), else down
const rnd6 = (v, o = null) => { const T = Math.round(v * 6); if (((T % 6) + 6) % 6 === 3) { const a = (T - 3) / 6; return o !== null && Math.abs(a + 1 - o) < Math.abs(a - o) - 1e-9 ? a + 1 : a; } return Math.round(T / 6); };
function axisMap(list, k, tie, minSpan = false) {
  const { stems, used } = pairStems(list), lat = [];
  for (const s of stems) lat.push({ v: list[s.i].pos * k, w: list[s.i].hi - list[s.i].lo });
  list.forEach((e, i) => { if (!used.has(i)) lat.push({ v: e.pos * k, w: e.hi - e.lo }); });
  // (Tried 10-26 and dropped: an ANCHOR, the longest edge snapped and the rest placed relative to it. Stabler under a nudge,
  // but when the anchor sits near a half pixel every other edge moves almost a whole one: the tree's tiers moved 0.9 device px.)
  let cx = 0, cy = 0; for (const e of lat) { cx += e.w * Math.cos(2 * Math.PI * e.v); cy += e.w * Math.sin(2 * Math.PI * e.v); }
  let phase = lat.length && Math.hypot(cx, cy) > 1e-6 ? Math.atan2(cy, cx) / (2 * Math.PI) : 0;   // -1/2 .. 1/2
  if (phase < -5 / 12) phase += 1;   // a phase near a half (a centred odd width) always reads as + a half: no flip across the seam
  const shift = -phase, ctl = [];
  for (const s of stems) {
    const a = list[s.i], b = list[s.j], W = devW(s.w, k, tie), lo = rnd6(a.pos * k + shift);
    const pri = Math.min(a.hi - a.lo, b.hi - b.lo) + 100;   // stems before lone edges
    ctl.push({ o: a.pos, n: lo / k, pri, W, role: 'stem', sid: s.i, cis: [a.ci] }, { o: b.pos, n: (lo + W) / k, pri, W, role: 'stem', sid: s.i, cis: [b.ci] });
  }
  list.forEach((e, i) => { if (!used.has(i)) ctl.push({ o: e.pos, n: rnd6(e.pos * k + shift) / k, pri: e.hi - e.lo, role: 'lone', cis: [e.ci] }); });
  // SYMMETRY: a glyph drawn symmetric on this axis (nine tenths of its edge run has a mirror twin about one centre) is fitted
  // symmetric: its centre goes to the nearest whole or half device pixel (moving at most half a device pixel), the left half
  // is fitted, the right half is its mirror, so every mirrored edge lands whole too. A stem standing ON the centre fixes which:
  // an odd device width needs a half-pixel centre, an even one a whole-pixel centre (the + at 2x: 3 device px, so its centre
  // moves 1/4px). Without this the museum's two capitals snapped differently (one step 1 device px, the other 0).
  const sym = mirror(list);
  if (sym) {
    const byO = new Map(); for (const c of ctl) { const key = c.o.toFixed(5); if (!byO.has(key)) byO.set(key, []); byO.get(key).push(c); }
    const get = pos => (byO.get(pos.toFixed(5)) || [])[0], set = (pos, n) => { for (const c of byO.get(pos.toFixed(5)) || []) c.n = n; }, tag = (pos, m) => { for (const c of byO.get(pos.toFixed(5)) || []) c.mate = m; };
    const centred = stems.filter(s => Math.abs(list[s.i].pos + list[s.j].pos - 2 * sym.c) < 0.01).sort((p, q) => q.ov - p.ov);
    let twoC = Math.round(2 * sym.c * k);
    if (centred.length) { const W = devW(centred[0].w, k, tie); if (((twoC - W) % 2 + 2) % 2) twoC = Math.abs(twoC - 1 - 2 * sym.c * k) <= Math.abs(twoC + 1 - 2 * sym.c * k) + 0.5 ? twoC - 1 : twoC + 1; }   // near a tie (a centre on a whole pixel), always up / left
    const C = twoC / 2, sh = C - sym.c * k;
    for (const s of stems) {
      const a = list[s.i], b = list[s.j], W = devW(s.w, k, tie);
      if (centred.includes(s)) { set(a.pos, (C - W / 2) / k); set(b.pos, (C + W / 2) / k); }
      else if (b.pos < sym.c) { const lo = rnd6(a.pos * k + sh, a.pos * k); set(a.pos, lo / k); set(b.pos, (lo + W) / k); }
    }
    list.forEach((e, i) => { if (!used.has(i) && e.pos < sym.c) set(e.pos, rnd6(e.pos * k + sh, e.pos * k) / k); });
    for (const [i, j] of sym.mate) if (list[i].pos > sym.c && list[j].pos < sym.c) { const R = get(list[i].pos), L = get(list[j].pos); if (R && L) { set(R.o, (2 * C - L.n * k) / k); tag(R.o, L.o); tag(L.o, R.o); } }
  }
  // merge the same place (two edges at one coordinate, e.g. two posts' tops): keep the higher priority's target
  ctl.sort((p, q) => p.o - q.o || q.pri - p.pri);
  let pts = [];
  for (const c of ctl) { const last = pts[pts.length - 1]; if (last && Math.abs(last.o - c.o) < EPS) { const u = [...new Set([...last.cis, ...c.cis])]; if (c.pri > last.pri) pts[pts.length - 1] = { ...c, cis: u }; else last.cis = u; } else pts.push({ ...c }); }
  // A SHOWN LENGTH IS A MINIMUM (the master grid: "a space or a shown length (a cut, a gap, how much of a post shows) is a
  // minimum"): a short span under 1px between two fitted edges that the snap would shorten (a capital's step past its
  // column, a cut) is kept at least as long: its lone edge moves one more device pixel outward. A stem's own width is the
  // stem rule's, not this one's. OFF by default (minSpan): tried 10-26, it trades one fault for others (the coupe's 3/4px band
  // grows to 1px at 3x and its corners kink; the museum's capital flares turn too far); see pixel-fit.md.
  if (minSpan) for (let i = 1; i < pts.length; i++) {
    const A = pts[i - 1], B = pts[i], go = B.o - A.o, gn = B.n - A.n;
    if (go >= 1 || go < KEEP_GAP / 2 || gn >= go - 1e-6 || (A.sid !== undefined && A.sid === B.sid)) continue;
    if (B.role === 'lone') B.n += 1 / k; else if (A.role === 'lone') A.n -= 1 / k;
  }
  // order and no closing space: drop the weakest of a clashing pair until none clash
  for (let guard = 0; guard < 200; guard++) {
    let bad = -1;
    for (let i = 1; i < pts.length; i++) {
      const go = pts[i].o - pts[i - 1].o, gn = pts[i].n - pts[i - 1].n;
      if (gn < -EPS || (go >= KEEP_GAP && gn < EPS)) { bad = i; break; }
    }
    if (bad < 0) break;
    // a step that would close (a capital past its column, at a size where the step is under a device pixel) keeps one device
    // pixel: its lone edge moves outward, and its mirror twin with it
    { const P = pts[bad - 1], Q = pts[bad], gn = Q.n - P.n;
      if (gn > -EPS && (Q.role === 'lone' || P.role === 'lone') && !Q.pushed && !P.pushed) {
        const L = Q.role === 'lone' && (P.role !== 'lone' || Q.pri <= P.pri) ? Q : P, dir = L === Q ? 1 : -1;
        L.n += dir / k; L.pushed = true;
        if (L.mate !== undefined) { const t = pts.find(p => Math.abs(p.o - L.mate) < EPS); if (t) { t.n -= dir / k; t.pushed = true; } }
        continue;
      } }
    const i = pts[bad].pri < pts[bad - 1].pri ? bad : bad - 1, mo = pts[i].mate;
    pts.splice(i, 1);
    if (mo !== undefined) { const j = pts.findIndex(p => Math.abs(p.o - mo) < EPS); if (j >= 0) pts.splice(j, 1); }   // its mirror twin goes too
  }
  // INTERPOLATE, per contour (TrueType's IUP): a contour is moved only by the fitted edges ON it (so the pediment's apex is
  // carried by the pediment's own sides, not squeezed by the gap between the columns under it). Between two of its edges a
  // point moves by straight-line interpolation (the piece between is mapped affinely, so a curve keeps its shape, only
  // stretched by the edge moves); beyond its outermost edge it moves with that edge. A contour with no fitted edge on this
  // axis (a counter made only of curves) uses every edge of the glyph.
  const per = new Map();
  for (const p of pts) for (const c of p.cis) { if (!per.has(c)) per.set(c, []); per.get(c).push(p); }
  const mk = P => {
    const n = P.length, X = P.map(p => p.o), Y = P.map(p => p.n);
    const at = v => { let i = 0; while (i < n - 2 && X[i + 1] < v) i++; return i; };
    const slope = (v, dir) => {   // the slope of the piece the point is in; on a fitted edge, the piece on the handle's side
      if (n < 2) return 1;
      if (v < X[0] || (v === X[0] && dir < 0)) return 1; if (v > X[n - 1] || (v === X[n - 1] && dir > 0)) return 1;
      let i = at(v); if (Math.abs(v - X[i + 1]) < 1e-9 && dir > 0 && i < n - 2) i++; if (Math.abs(v - X[i]) < 1e-9 && dir < 0 && i > 0) i--;
      return (Y[i + 1] - Y[i]) / (X[i + 1] - X[i]);
    };
    const map = v => {
      if (!n) return v + shift / k;
      if (v <= X[0]) return Y[0] + (v - X[0]); if (v >= X[n - 1]) return Y[n - 1] + (v - X[n - 1]);
      const i = at(v); return Y[i] + (v - X[i]) * (Y[i + 1] - Y[i]) / (X[i + 1] - X[i]);
    };
    return { map, slope };
  };
  const all = mk(pts), maps = new Map([...per].map(([c, P]) => [c, mk(P)]));
  const forC = ci => maps.get(ci) || all;
  return { forC, pts, shift: shift / k, stems: stems.map(s => ({ a: list[s.i].pos, b: list[s.j].pos, w: s.w, W: devW(s.w, k, tie) })) };
}

// ---- the pass. The drawing is in the 24 badge's px; at render size `size` and density `dpr`, 1 drawing px = size/24 x dpr
// device px. Fitting happens in drawing px with k = device px per drawing px. A node goes through the map; its handles are
// carried by the map's slope at the node, so a smooth join stays smooth and a level or upright tangent stays so.
function fit(d, { size = 24, dpr = 3, tie = 'rank', minSpan = false } = {}) {
  const k = size / 24 * dpr, E = findEdges(d), mx = axisMap(E.x, k, tie, minSpan), my = axisMap(E.y, k, tie, minSpan);
  const subs = parse(d); let out = '', maxMove = 0;
  let ax, ay;
  const T = p => { const q = [ax.map(p[0]), ay.map(p[1])]; maxMove = Math.max(maxMove, Math.hypot(q[0] - p[0], q[1] - p[1])); return q; };
  const H = (h, node, nn) => [nn[0] + (h[0] - node[0]) * ax.slope(node[0], Math.sign(h[0] - node[0])), nn[1] + (h[1] - node[1]) * ay.slope(node[1], Math.sign(h[1] - node[1]))];
  const s6 = p => `${f6(p[0])} ${f6(p[1])}`;
  // SMOOTH STAYS SMOOTH: a node where the drawing's line ran on without a turn (in and out within 1 degree) is made to run on
  // again after the map: a line next to it keeps its new direction and the curve's handle is turned onto it; between two
  // curves both handles turn onto the mean direction. Handle lengths are kept. (A straight that crosses a fitted edge is
  // stretched as a whole, its neighbours' handles piece by piece; without this a capital's flare would kink at its rounds.)
  const unit = v => { const l = Math.hypot(v[0], v[1]); return l < 1e-9 ? null : [v[0] / l, v[1] / l]; };
  const tin = P => unit([P[3][0] - P[2][0], P[3][1] - P[2][1]]) || unit([P[3][0] - P[0][0], P[3][1] - P[0][1]]);
  const tout = P => unit([P[1][0] - P[0][0], P[1][1] - P[0][1]]) || unit([P[3][0] - P[0][0], P[3][1] - P[0][1]]);
  let ci = -1;
  for (const segs of subs) {
    ci++; ax = mx.forC(ci); ay = my.forC(ci);
    if (!segs.length) continue;
    const nu = segs.map(s => {
      const p0 = T(s.P[0]), p3 = T(s.P[3]);
      return s.k === 'L' ? { k: 'L', P: [p0, p0, p3, p3] } : { k: 'C', P: [p0, H(s.P[1], s.P[0], p0), H(s.P[2], s.P[3], p3), p3] };
    });
    for (let i = 0; i < segs.length; i++) {
      const j = (i + 1) % segs.length, a0 = tin(segs[i].P), b0 = tout(segs[j].P);
      if (!a0 || !b0 || a0[0] * b0[0] + a0[1] * b0[1] < Math.cos(Math.PI / 180)) continue;
      const A = nu[i], B = nu[j], a = tin(A.P), b = tout(B.P); if (!a || !b) continue;
      const dir = A.k === 'L' ? a : B.k === 'L' ? b : unit([a[0] + b[0], a[1] + b[1]]);
      if (!dir || (A.k === 'L' && B.k === 'L')) continue;
      const nd = A.P[3];
      if (A.k === 'C') { const l = Math.hypot(A.P[2][0] - nd[0], A.P[2][1] - nd[1]); A.P[2] = [nd[0] - dir[0] * l, nd[1] - dir[1] * l]; }
      if (B.k === 'C') { const l = Math.hypot(B.P[1][0] - nd[0], B.P[1][1] - nd[1]); B.P[1] = [nd[0] + dir[0] * l, nd[1] + dir[1] * l]; }
    }
    out += 'M' + s6(nu[0].P[0]);
    for (const s of nu) out += s.k === 'L' ? 'L' + s6(s.P[3]) : 'C' + s6(s.P[1]) + ' ' + s6(s.P[2]) + ' ' + s6(s.P[3]);
    out += 'Z';
  }
  return { d: out, x: mx, y: my, maxMove, k };
}

// ---- the measure: each core edge, how far (device px, 0..0.5) it sits from a whole device pixel, and what it is
function edges(d, size, dpr) {
  const k = size / 24 * dpr, E = findEdges(d), res = [];
  for (const ax of ['x', 'y']) {
    const { stems, used } = pairStems(E[ax]);
    const role = new Map();
    for (const s of stems) { const w = s.w, r = w > 2.01 ? 'mass' : ax === 'x' ? 'stem (upright)' : 'horizontal'; role.set(s.i, { r, w }); role.set(s.j, { r, w }); }
    E[ax].forEach((e, i) => {
      const v = e.pos * k, off = Math.abs(v - Math.round(v)), ro = role.get(i);
      res.push({ ax, pos: e.pos, run: e.hi - e.lo, kind: e.kind, role: ro ? ro.r : e.kind === 'round' ? 'round extreme' : 'outer edge', w: ro ? ro.w : null, dev: v, off });
    });
  }
  return res;
}

// ---- ink area and centroid (even-odd), for how far optical centring moves
function centroid(d) {
  const ps = polys(parse(d), 32); let A = 0, X = 0, Y = 0;
  ps.forEach((p, i) => {
    let a = 0, cx = 0, cy = 0;
    for (let q = 0; q < p.length; q++) { const [x0, y0] = p[q], [x1, y1] = p[(q + 1) % p.length], c = x0 * y1 - x1 * y0; a += c; cx += (x0 + x1) * c; cy += (y0 + y1) * c; }
    a /= 2; if (!a) return;
    const depth = ps.filter((o, j) => j !== i && inkAt(p[0], [o])).length, sg = depth % 2 ? -1 : 1;
    A += sg * Math.abs(a); X += sg * Math.abs(a) * cx / (6 * a); Y += sg * Math.abs(a) * cy / (6 * a);
  });
  return { area: A, cx: X / A, cy: Y / A };
}

module.exports = { fit, edges, findEdges, centroid, devW, tokenW, mirror };
