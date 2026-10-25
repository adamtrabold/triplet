// JOIN CHECK (g7aq; owner on v222: "there also seems to be a slight wobbliness at some of the joins because of the
// rounding mechanics ... they should be architectural and smooth with no visible humps or wobbles... they should feel
// impeccably constructed at every join"). Reads finished outlines (absolute M L C Z, as the engine writes them) and walks
// every edge's signed curvature, in px of the 24 box. It reports three faults, each a way a join can look built badly:
//   JUMP    a curve meets a curve with a break in curvature (both sides bend, by different amounts or opposite ways):
//           a flat-then-round kink. A straight line meeting a round is a plain fillet and is not reported, and a
//           curvature break where both sides bend the same way by less than JUMP_MIN is not reported.
//   HUMP    inside one smooth run (curves only, no straight between), a BEND (a gentle curve, its peak |curvature|
//           between BEND_MIN and BEND_MAX, so a radius over 2/3px: a bowl, a dome, not a corner) sits beside a corner or
//           another bend with a near-flat valley between them on the same side (under VALLEY of the bend's peak): the
//           outline goes flat and bends again, a hump. Two corners joined by a short flat (a slot's end) are not humps.
//   WOBBLE  inside one smooth run, a short gentle lobe (a bend under BEND_MAX, shorter than WOB_L) bends the other way
//           from the outline on both sides of it: a ripple. A corner (notch, tip) is never a wobble, and a single
//           intended S (the cup's side into its ear) has no lobe between two opposite ones.
// node join-check.js file.svg ... [--all]   (exit 1 if any fault)   or require('./join-check').check(d)
'use strict';
const fs = require('fs');
const JUMP_MIN = 0.6, VALLEY = 0.5, BEND_MIN = 0.15, BEND_MAX = 1.5, WOB_L = 1.5, ZERO = 0.05, RUN_MAX = 4;
function parse(d) {
  const toks = d.match(/[MLCZ]|-?\d*\.?\d+(?:e-?\d+)?/gi), subs = []; let i = 0, cur = null, p = null, start = null;
  const num = () => +toks[i++];
  while (i < toks.length) {
    const c = toks[i++];
    if (c === 'M') { p = [num(), num()]; start = p; cur = []; subs.push(cur); }
    else if (c === 'L') { const q = [num(), num()]; cur.push({ k: 'L', P: [p, p, q, q] }); p = q; }
    else if (c === 'C') { const a = [num(), num()], b = [num(), num()], q = [num(), num()]; cur.push({ k: 'C', P: [p, a, b, q] }); p = q; }
    else if (c === 'Z' || c === 'z') { if (Math.hypot(p[0] - start[0], p[1] - start[1]) > 1e-6) cur.push({ k: 'L', P: [p, p, start, start] }); p = start; }
    else throw new Error('unsupported command ' + c);
  }
  return subs;
}
const bz = (P, t, i) => (1 - t) ** 3 * P[0][i] + 3 * t * (1 - t) ** 2 * P[1][i] + 3 * t * t * (1 - t) * P[2][i] + t ** 3 * P[3][i];
const d1 = (P, t, i) => 3 * (1 - t) ** 2 * (P[1][i] - P[0][i]) + 6 * t * (1 - t) * (P[2][i] - P[1][i]) + 3 * t * t * (P[3][i] - P[2][i]);
const d2 = (P, t, i) => 6 * (1 - t) * (P[2][i] - 2 * P[1][i] + P[0][i]) + 6 * t * (P[3][i] - 2 * P[2][i] + P[1][i]);
function kAt(P, t) {   // signed curvature; a degenerate end (a handle of zero length) is read just inside
  for (const e of [0, 1e-4, 1e-3, 1e-2]) { const tt = t === 0 ? e : t === 1 ? 1 - e : t, x = d1(P, tt, 0), y = d1(P, tt, 1), v = Math.hypot(x, y); if (v > 1e-6) return (x * d2(P, tt, 1) - y * d2(P, tt, 0)) / v ** 3; }
  return 0;
}
const isLine = s => s.k === 'L' || (Math.abs((s.P[1][0] - s.P[0][0]) * (s.P[3][1] - s.P[0][1]) - (s.P[1][1] - s.P[0][1]) * (s.P[3][0] - s.P[0][0])) < 1e-6 && Math.abs((s.P[2][0] - s.P[0][0]) * (s.P[3][1] - s.P[0][1]) - (s.P[2][1] - s.P[0][1]) * (s.P[3][0] - s.P[0][0])) < 1e-6);
function check(d) {
  const faults = [];
  for (const segs of parse(d)) {
    const n = segs.length; if (!n) continue;
    // tangent breaks are corners the law left sharp on purpose? report them as JUMP only when both sides are curves
    for (let i = 0; i < n; i++) {
      const a = segs[i], b = segs[(i + 1) % n]; if (isLine(a) || isLine(b)) continue;
      const ka = kAt(a.P, 1), kb = kAt(b.P, 0), big = Math.max(Math.abs(ka), Math.abs(kb));
      if ((Math.sign(ka) !== Math.sign(kb) && Math.min(Math.abs(ka), Math.abs(kb)) > 0.15) || Math.abs(ka - kb) > Math.max(JUMP_MIN, 0.35 * big))
        faults.push({ kind: 'JUMP', at: a.P[3].map(v => +v.toFixed(2)), from: +ka.toFixed(2), to: +kb.toFixed(2) });
    }
    // smooth runs: maximal chains of curves, sampled by arc length
    let s0 = segs.findIndex((s, i) => isLine(segs[(i - 1 + n) % n]) && !isLine(s));
    const allCurves = s0 < 0; if (allCurves) s0 = 0;
    const seen = new Set();
    for (let c = 0; c < n; c++) {
      const i0 = (s0 + c) % n; if (seen.has(i0) || isLine(segs[i0])) continue;
      if (!allCurves && !isLine(segs[(i0 - 1 + n) % n])) continue;
      const run = []; for (let j = i0; !isLine(segs[j]) && !seen.has(j); j = (j + 1) % n) { seen.add(j); run.push(segs[j]); }
      const pts = []; let L = 0, prev = null;
      for (const s of run) for (let k = 0; k <= 60; k++) { const t = k / 60, q = [bz(s.P, t, 0), bz(s.P, t, 1)]; if (prev) L += Math.hypot(q[0] - prev[0], q[1] - prev[1]); prev = q; pts.push({ L, k: kAt(s.P, t), q }); }
      // HUMP: a bend beside another peak on the same side, a near-flat valley between
      // g7bb (turn 161, jitter check): a peak or a valley counts only once the bend has turned back from it by more than noise
      // (0.02 + 3% of it). Read sample by sample, a hair of mismatch where two pieces meet (0.871 then 0.869, then rising into the
      // next round) was a "peak" of 0.87 beside a "valley", a HUMP that came and went with a 0.01px nudge
      const ext = []; { const A_ = k => Math.abs(pts[k].k), tolX = v => 0.02 + 0.03 * v; let dir = 0, cand = 0;
        for (let k = 1; k < pts.length; k++) {
          if (dir >= 0 && A_(k) >= A_(cand)) { if (dir === 0 && A_(k) > A_(cand) + tolX(A_(cand))) dir = 1; cand = k; continue; }
          if (dir <= 0 && A_(k) <= A_(cand)) { if (dir === 0 && A_(k) < A_(cand) - tolX(A_(cand))) dir = -1; cand = k; continue; }
          if (dir === 1 && A_(k) < A_(cand) - tolX(A_(cand))) { if (cand > 0) ext.push({ k: cand, t: 'max' }); dir = -1; cand = k; }
          else if (dir === -1 && A_(k) > A_(cand) + tolX(A_(cand))) { if (cand > 0) ext.push({ k: cand, t: 'min' }); dir = 1; cand = k; }
          else if (dir === 0) cand = k;
        }
        if (cand > 0 && cand < pts.length - 1) ext.push({ k: cand, t: dir === 1 ? 'max' : 'min' }); }
      for (let e = 1; e < ext.length - 1; e++) {
        if (ext[e].t !== 'min' || ext[e - 1].t !== 'max' || ext[e + 1].t !== 'max') continue;
        const A = pts[ext[e - 1].k], V = pts[ext[e].k], B = pts[ext[e + 1].k];
        if (Math.sign(A.k) !== Math.sign(B.k) || Math.sign(V.k) !== Math.sign(A.k) && Math.abs(V.k) > ZERO) continue;
        const lo = Math.min(Math.abs(A.k), Math.abs(B.k));
        if (lo >= BEND_MIN && lo <= BEND_MAX && Math.abs(V.k) < VALLEY * lo && B.L - A.L < RUN_MAX) faults.push({ kind: 'HUMP', at: V.q.map(v => +v.toFixed(2)), peaks: [+A.k.toFixed(2), +B.k.toFixed(2)], valley: +V.k.toFixed(2) });
      }
      // WOBBLE: lobes by sign; a short gentle lobe between two opposite lobes
      const lobes = []; for (const p of pts) { const sg = Math.abs(p.k) < ZERO ? 0 : Math.sign(p.k); if (!sg) continue; const l = lobes[lobes.length - 1]; if (l && l.s === sg) { l.L1 = p.L; l.pk = Math.max(l.pk, Math.abs(p.k)); } else lobes.push({ s: sg, L0: p.L, L1: p.L, pk: Math.abs(p.k), q: p.q }); }
      for (let l = 1; l < lobes.length - 1; l++) { const m = lobes[l]; if (m.pk >= BEND_MIN && m.pk < BEND_MAX && m.L1 - m.L0 < WOB_L && lobes[l - 1].s !== m.s && lobes[l + 1].s !== m.s) faults.push({ kind: 'WOBBLE', at: m.q.map(v => +v.toFixed(2)), peak: +(m.s * m.pk).toFixed(2), length: +(m.L1 - m.L0).toFixed(2) }); }
    }
  }
  return faults;
}
module.exports = { check, parse, kAt };
if (require.main === module) {
  let bad = 0;
  for (const f of process.argv.slice(2).filter(a => !a.startsWith('--'))) {
    const src = fs.readFileSync(f, 'utf8'), ds = [...src.matchAll(/ d="([^"]+)"/g)].map(m => m[1]);
    const fl = ds.flatMap(check); bad += fl.length;
    console.log(`${f.split('/').pop()}: ${fl.length ? fl.length + ' fault(s)' : 'clean'}`);
    for (const x of fl) console.log('  ', JSON.stringify(x));
  }
  process.exit(bad ? 1 : 0);
}
