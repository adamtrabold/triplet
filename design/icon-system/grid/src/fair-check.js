// FAIR CHECK (g7ar; owner on v223: "can you see the wobbliness i'm talking about ... on the tip of the tree join type --
// further away from the point itself on both sides... and on the bowl of the cup on either side (again, further away from
// the point itself...maybe it's how it's exiting the point?) and on the foot of the cup... same thing not at the join
// itself, but on the line coming out of it. again, we need to have programmatic approaches here so that this is perfect
// on every icon ever created.")
// join-check.js (g7aq) measures the curvature itself: a break in it (JUMP), a flat spot between bends (HUMP), a ripple
// (WOBBLE). v223 passed it, 0 faults, yet his eye failed three joins: what he sees is not the curvature but how FAST it
// changes, on the line just outside the corner. This check walks every outline (lines included: a line running into a
// round is a join too) and reports, per round (a hill of curvature between two stretches that bend steadily):
//   KNEE   at a node, the rate of change of curvature (dk/ds, per unit of the 24 grid) jumps: one side steady, the other
//          bending faster at once, or a crest that comes to a point (a V). The eye reads it as a hitch where the line
//          leaves (or turns in) the round. Reported when the jump is over KNEE_MIN and over KNEE_SHARE of the larger side.
//   TAIL   the round's curvature creeps up from its edge for most of its length and then shoots up at the crest: it is
//          not halfway up until more than TAIL_MAX of the way along. The bend reaches far out along the edges (a soft
//          shoulder away from the point) and the point reads as a separate knob. A raised cosine is halfway at 0.5.
//   JUMP   a break in curvature at a node over JUMP_MIN, a line meeting a round included (a plain compass fillet).
//   INFLECT (g7as) a round at a convex corner bends the other way inside its own curves (an S in the round: a bulb on a neck).
//   SHELF (g7au) a round between a line and a curve that bends the other way, drawn even: the curve runs on level into a
//          shelf and the round sits on it as a knuckle (the coupe's flares at v228). The run onto the curve must be 1.5x the line's.
//   SHOULDER (g7as) walking from a round's foot to its crest, the bend's rate of growth stalls (under 2/5 of the lower peak
//          either side, each over a quarter of the top one): two bends in one round, the bend flattening and then growing again.
// node fair-check.js file.svg ... (exit 1 if any fault)   or require('./fair-check').check(d) -> [{ kind, at, ... }]
'use strict';
const fs = require('fs'), { parse, kAt } = require('./join-check');
const SHELF_MIN = 1.5, KNEE_MIN = 2, KNEE_REL = 0.25, KNEE_SHARE = 0.5, TAIL_MAX = 0.7, JUMP_MIN = 0.35, CREST_MIN = 1.2, N = 48;
const bz = (P, t, i) => (1 - t) ** 3 * P[0][i] + 3 * t * (1 - t) ** 2 * P[1][i] + 3 * t * t * (1 - t) * P[2][i] + t ** 3 * P[3][i];
const dk = (P, t) => {   // dk/ds of a cubic at t, one-sided at its ends
  const e = 1e-3, a = Math.max(0, Math.min(1 - 2 * e, t - e)), b = a + 2 * e;
  const ds = Math.hypot(bz(P, b, 0) - bz(P, a, 0), bz(P, b, 1) - bz(P, a, 1)); return ds < 1e-12 ? 0 : (kAt(P, b) - kAt(P, a)) / ds;
};
function check(d) {
  const q = 0.5 * 10 ** -Math.max(...(d.match(/\.\d+/g) || [".0"]).map(s => s.length - 1));   // half the last written decimal
  const faults = [];
  // which way the ink lies: the paths come out of the booleans with counters reversed, so a turn toward the ink has the sign
  // of the largest path's area (y down); INFLECT reads it
  const subs = parse(d), area = segs => segs.reduce((s, g) => s + (g.P[0][0] * g.P[3][1] - g.P[3][0] * g.P[0][1]), 0);
  const inkSign = Math.sign(subs.map(area).reduce((a, b) => Math.abs(b) > Math.abs(a) ? b : a, 0)) || 1;
  for (const segs of subs) {
    const n = segs.length; if (!n) continue;
    const isL = s => s.k === 'L';
    // nodes: curvature and its slope each side
    for (let i = 0; i < n; i++) {
      const a = segs[i], b = segs[(i + 1) % n];
      const ka = isL(a) ? 0 : kAt(a.P, 1), kb = isL(b) ? 0 : kAt(b.P, 0), sa = isL(a) ? 0 : dk(a.P, 1), sb = isL(b) ? 0 : dk(b.P, 0);
      const at = a.P[3].map(v => +v.toFixed(2));
      // a sharp node (the tangent turns) is a corner left on purpose, not a join; skip it
      const ta = isL(a) ? [a.P[3][0] - a.P[0][0], a.P[3][1] - a.P[0][1]] : [a.P[3][0] - a.P[2][0], a.P[3][1] - a.P[2][1]];
      const tb = isL(b) ? [b.P[3][0] - b.P[0][0], b.P[3][1] - b.P[0][1]] : [b.P[1][0] - b.P[0][0], b.P[1][1] - b.P[0][1]];
      const cr = Math.abs(ta[0] * tb[1] - ta[1] * tb[0]) / (Math.hypot(...ta) * Math.hypot(...tb) || 1); if (cr > 0.05) continue;
      // what the file can say: its coordinates are rounded to q (the last decimal it writes), so a curvature read at the end of a
      // handle h is only known to about 3q/h² (and its slope to 3q/h³); a step smaller than that is the rounding, not a fault
      const hA = isL(a) ? 1 : Math.hypot(a.P[3][0] - a.P[2][0], a.P[3][1] - a.P[2][1]), hB = isL(b) ? 1 : Math.hypot(b.P[1][0] - b.P[0][0], b.P[1][1] - b.P[0][1]);
      const eK = 3 * q / Math.max(1e-6, hA) ** 2 + 3 * q / Math.max(1e-6, hB) ** 2, eS = 3 * q / Math.max(1e-6, hA) ** 3 + 3 * q / Math.max(1e-6, hB) ** 3;
      if (Math.abs(ka - kb) > JUMP_MIN + eK) faults.push({ kind: "JUMP", at, from: +ka.toFixed(2), to: +kb.toFixed(2) });
      else { const kmax = s => isL(s) ? 0 : Math.max(...[0, 0.25, 0.5, 0.75, 1].map(t => Math.abs(kAt(s.P, t))));   // the round this node belongs to: its two pieces, and one more toward the tighter side
        const ka_ = kmax(a), kb_ = kmax(b), Kloc = Math.max(ka_, kb_, ka_ >= kb_ ? kmax(segs[(i - 1 + n) % n]) : kmax(segs[(i + 2) % n])), lim = Math.max(KNEE_MIN, KNEE_REL * Kloc * Kloc);
        if (Math.abs(sa - sb) > lim + eS && Math.abs(sa - sb) > KNEE_SHARE * Math.max(Math.abs(sa), Math.abs(sb))) faults.push({ kind: "KNEE", at, slopes: [+sa.toFixed(2), +sb.toFixed(2)], limit: +lim.toFixed(2) }); }
    }
    // rounds: sample the whole outline by arc length; every crest of |k| over CREST_MIN is a round; walk out each side to
    // its foot (where the curvature has come back to within 3% of the crest above the edge's level, or stops falling)
    const pts = []; let L = 0, prev = null;
    segs.forEach(s => { for (let q = 0; q <= N; q++) { const t = q / N, p = [bz(s.P, t, 0), bz(s.P, t, 1)]; if (prev) L += Math.hypot(p[0] - prev[0], p[1] - prev[1]); prev = p; pts.push({ L, k: isL(s) ? 0 : kAt(s.P, t), p, s }); } });
    const crests = [], m = pts.length, A = i => Math.abs(pts[(i + m) % m].k), Lof = (i, j) => { let s = pts[(j + m) % m].L - pts[(i + m) % m].L; if (s < 0) s += L; return s; };
    for (let i = 0; i < m; i++) {
      // a crest: the tightest point within six samples either side (a node's doubled sample, or a hair of mismatch between two pieces, is not a crest)
      if (!(A(i) >= CREST_MIN && A(i) > A(i - 1) + 1e-9 && [1, 2, 3, 4, 5, 6].every(o => A(i) >= A(i - o) - 0.02 * A(i) && A(i) >= A(i + o) - 0.02 * A(i)))) continue;
      if (crests.some(q => Math.abs(q - pts[i].L) < 0.08)) continue; crests.push(pts[i].L);
      const crest = A(i), sgn = Math.sign(pts[i].k), half = [];
      // INFLECT (g7as; director, turn 135, the tree's top tip as a bulb on a neck): a round at a convex corner (one that turns
      // toward the ink) never bends the other way. Walking out from its crest, the bend may reach zero only where the round
      // ends (at a node); a sign change inside one of the round's own curves is an S in the round.
      if (sgn === inkSign) for (const dir of [-1, 1]) {
        let hw = i; while (A(hw) > 0.5 * crest && Math.abs(hw - i) < m / 2) hw += dir; const reach = 4 * (dir < 0 ? Lof(hw, i) : Lof(i, hw));   // g7au: the round reaches at most 4 half-widths from its crest; past that is its edge, which may bend the other way into the next round (a bowl into a flare)
        let j = i, st = 0; while (st < m / 2 && pts[(j + dir + m) % m].k * sgn > 0.02 * crest && (dir < 0 ? Lof(j + dir, i) : Lof(i, j + dir)) <= reach) { j += dir; st++; }
        const s0 = pts[(j + m) % m].s; let q = j, st2 = 0, low = 0;
        while (st2 < N && pts[(q + dir + m) % m].s === s0) { q += dir; st2++; low = Math.min(low, pts[(q + m) % m].k * sgn); }
        if (low < -0.02 && !faults.some(x => x.kind === 'INFLECT' && Math.hypot(x.at[0] - pts[i].p[0], x.at[1] - pts[i].p[1]) < 0.05)) faults.push({ kind: 'INFLECT', at: pts[i].p.map(v => +v.toFixed(2)), crest: +(sgn * crest).toFixed(2), reverse: +(sgn * low).toFixed(3) });
      }
      // SHOULDER (g7as): walking from a round's foot to its crest, the bend should grow at a rate that rises once and falls
      // once. A stall in between (the rate drops under 2/5 of the lower of the peaks either side, each over a quarter of the
      // top one) is two bends where the eye wants one: the v225 valleys' two-piece fits, the bend flattening where the pieces
      // meet and growing again. Its own walk: out from the crest until the bend is under 4% of it (a small rise of up to 5% of
      // the crest is walked through, so a stall can't end the round early), stopping where it climbs into the next round.
      for (const dir of [-1, 1]) {
        // g7ax: the walk also stops where the round has landed on a curved edge's own steady bend (an ellipse's side): the
        // bend stays within a tenth of itself for the next half unit outward. A stall inside a round is short, so it is still
        // walked through; a whole root curve is not counted as the round (the coupe's bowl, an ellipse, rising gently into its rim)
        const steady = g0 => { const a0 = A(g0); if (a0 < 0.08 * crest) return false; let L0 = pts[(g0 + m) % m].L, q = g0, n_ = 0; while (n_ < m / 2) { q += dir; n_++; const dl = Math.abs(pts[(q + m) % m].L - L0); if (Math.abs(A(q) - a0) > 0.1 * a0 || Math.sign(pts[(q + m) % m].k) !== sgn) return false; if (dl >= 0.5) return true; } return false; };
        let g = i, st = 0, lowest = crest; while (st < m / 2 && Math.sign(pts[(g + dir + m) % m].k) === sgn && A(g + dir) > 0.04 * crest && A(g + dir) <= lowest + 0.05 * crest && !steady(g)) { g += dir; st++; lowest = Math.min(lowest, A(g)); }
        const sl = []; for (let j = g; j !== i; j -= dir) { const a = (j + m) % m, b = (j - dir + m) % m, dL = Math.abs(pts[b].L - pts[a].L); if (dL > 1e-6 && dL < 0.5) sl.push(Math.max(0, A(b) - A(a)) / dL); }
        const S = Math.max(0, ...sl), lo = Math.floor(sl.length * 0.12), hi = Math.ceil(sl.length * 0.88);
        let pre = 0; const post = []; for (let j = sl.length - 1, mx = 0; j >= 0; j--) { mx = Math.max(mx, sl[j]); post[j] = mx; }
        for (let j = 0; j < sl.length; j++) { const after = j + 1 < sl.length ? post[j + 1] : 0, lowPk = Math.min(pre, after); if (j >= lo && j < hi && S > 2 && lowPk > 0.25 * S && sl[j] < 0.4 * lowPk) { if (!faults.some(x => x.kind === 'SHOULDER' && Math.hypot(x.at[0] - pts[i].p[0], x.at[1] - pts[i].p[1]) < 0.05)) faults.push({ kind: 'SHOULDER', at: pts[i].p.map(v => +v.toFixed(2)), crest: +(sgn * crest).toFixed(2), stall: +(sl[j] / S).toFixed(2) }); break; } pre = Math.max(pre, sl[j]); }
      }
      // SHELF (g7au; owner on v228: "On the corner types on the coupe, there is still an awkward hump on the bowl and foot on
      // either side as a result of the round shape"): a round between a LINE and a gentle CURVE THAT BENDS THE OTHER WAY (a
      // stem into a bowl or a foot; gentle: its bend under a quarter of the round's, so an S of two rounds, the museum's
      // capital, is another kind) drawn even, its bend split half and half. The curve meets the round nearly level, so it runs
      // on as a level shelf and the round sits on it as a knuckle: the hump. Walking out from the crest to where the bend
      // ends (it crosses zero, or a line starts), the run onto the curve must be at least SHELF_MIN times the run onto the line.
      if (sgn !== inkSign) {
        const run = dir => { let j = i, st = 0; while (st < m / 2 && pts[(j + dir + m) % m].k * sgn > 0.004 * crest) { j += dir; st++; } return j; };
        const beyond = (j, dir) => { let L0 = pts[(j + m) % m].L, sum = 0, cnt = 0, q = j; while (cnt < 400) { q += dir; const pq = pts[(q + m) % m]; let dl = Math.abs(pq.L - L0); if (dl > L / 2) dl = L - dl; if (dl > 0.4) break; sum += pq.k; cnt++; } return cnt ? sum / cnt : 0; };
        const side = [-1, 1].map(dir => { const j = run(dir), kb = beyond(j, dir); return { span: dir < 0 ? Lof(j, i) : Lof(i, j), kind: Math.abs(kb) < 0.01 ? 'line' : Math.sign(kb) === -sgn && Math.abs(kb) > 0.03 && Math.abs(kb) < 0.25 * crest ? 'curve' : 'other' }; });
        const cv = side.find(x => x.kind === 'curve'), ln = side.find(x => x.kind === 'line');
        if (cv && ln && cv.span < SHELF_MIN * ln.span && !faults.some(x => x.kind === 'SHELF' && Math.hypot(x.at[0] - pts[i].p[0], x.at[1] - pts[i].p[1]) < 0.05)) faults.push({ kind: 'SHELF', at: pts[i].p.map(v => +v.toFixed(2)), crest: +(sgn * crest).toFixed(2), onCurve: +cv.span.toFixed(3), onLine: +ln.span.toFixed(3) });
      }
      for (const dir of [-1, 1]) {
        let j = i, steps = 0; while (steps < m / 2 && Math.sign(pts[(j + dir + m) % m].k) === sgn && A(j + dir) <= A(j) + 1e-6) { j += dir; steps++; }
        // DIP: the walk stopped while the line still bends hard, and it bends harder again just past: two crests in one round, a wobble
        if (A(j) > 0.4 * crest && crest - A(j) > 0.1 * crest) { let q = j, s2 = 0; while (s2 < 60 && Math.sign(pts[(q + dir + m) % m].k) === sgn && A(q + dir) >= A(q) - 1e-6) { q += dir; s2++; } if (A(q) > 0.6 * crest && A(q) - A(j) > 0.1 * crest && !faults.some(x => x.kind === "DIP" && Math.hypot(x.at[0] - pts[(j + m) % m].p[0], x.at[1] - pts[(j + m) % m].p[1]) < 0.05)) faults.push({ kind: "DIP", at: pts[(j + m) % m].p.map(v => +v.toFixed(2)), crests: [+crest.toFixed(2), +A(q).toFixed(2)], valley: +A(j).toFixed(2) }); }
        const base = Math.sign(pts[(j + m) % m].k) === sgn ? A(j) : 0, H = crest - base; if (H < CREST_MIN * 0.5) { half.push(null); continue; }
        // the foot: where the curvature first rises 3% of the way from its base toward the crest (the faint run-up is the tail)
        let f = j; while (f !== i && A(f) - base < 0.03 * H) f -= dir;
        let h = f; while (h !== i && A(h) - base < 0.5 * H) h -= dir;
        const span = dir < 0 ? Lof(f, i) : Lof(i, f), toHalf = dir < 0 ? Lof(f, h) : Lof(h, f);
        half.push(span > 1e-6 ? { share: toHalf / span, span } : null);
      }
      for (const hh of half) if (hh && hh.share > TAIL_MAX && hh.span > 0.15) { faults.push({ kind: 'TAIL', at: pts[i].p.map(v => +v.toFixed(2)), crest: +(sgn * crest).toFixed(2), halfway: +hh.share.toFixed(2), span: +hh.span.toFixed(2) }); break; }
    }
  }
  return faults;
}
module.exports = { check };
if (require.main === module) {
  let bad = 0;
  for (const f of process.argv.slice(2).filter(a => !a.startsWith('--'))) {
    const ds = [...fs.readFileSync(f, 'utf8').matchAll(/ d="([^"]+)"/g)].map(m => m[1]);
    const fl = ds.flatMap(check); bad += fl.length;
    const by = fl.reduce((a, x) => (a[x.kind] = (a[x.kind] || 0) + 1, a), {});
    console.log(`${f.split('/').pop()}: ${fl.length ? fl.length + ' fault(s) ' + JSON.stringify(by) : 'clean'}`);
    if (process.argv.includes('--all')) for (const x of fl) console.log('  ', JSON.stringify(x));
  }
  process.exit(bad ? 1 : 0);
}
