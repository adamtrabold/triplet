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
// node fair-check.js file.svg ... (exit 1 if any fault)   or require('./fair-check').check(d) -> [{ kind, at, ... }]
'use strict';
const fs = require('fs'), { parse, kAt } = require('./join-check');
const KNEE_MIN = 2, KNEE_REL = 0.25, KNEE_SHARE = 0.5, TAIL_MAX = 0.7, JUMP_MIN = 0.35, CREST_MIN = 1.2, N = 48;
const bz = (P, t, i) => (1 - t) ** 3 * P[0][i] + 3 * t * (1 - t) ** 2 * P[1][i] + 3 * t * t * (1 - t) * P[2][i] + t ** 3 * P[3][i];
const dk = (P, t) => {   // dk/ds of a cubic at t, one-sided at its ends
  const e = 1e-3, a = Math.max(0, Math.min(1 - 2 * e, t - e)), b = a + 2 * e;
  const ds = Math.hypot(bz(P, b, 0) - bz(P, a, 0), bz(P, b, 1) - bz(P, a, 1)); return ds < 1e-12 ? 0 : (kAt(P, b) - kAt(P, a)) / ds;
};
function check(d) {
  const q = 0.5 * 10 ** -Math.max(...(d.match(/\.\d+/g) || [".0"]).map(s => s.length - 1));   // half the last written decimal
  const faults = [];
  for (const segs of parse(d)) {
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
    segs.forEach(s => { for (let q = 0; q <= N; q++) { const t = q / N, p = [bz(s.P, t, 0), bz(s.P, t, 1)]; if (prev) L += Math.hypot(p[0] - prev[0], p[1] - prev[1]); prev = p; pts.push({ L, k: isL(s) ? 0 : kAt(s.P, t), p }); } });
    const crests = [], m = pts.length, A = i => Math.abs(pts[(i + m) % m].k), Lof = (i, j) => { let s = pts[(j + m) % m].L - pts[(i + m) % m].L; if (s < 0) s += L; return s; };
    for (let i = 0; i < m; i++) {
      // a crest: the tightest point within six samples either side (a node's doubled sample, or a hair of mismatch between two pieces, is not a crest)
      if (!(A(i) >= CREST_MIN && A(i) > A(i - 1) + 1e-9 && [1, 2, 3, 4, 5, 6].every(o => A(i) >= A(i - o) - 0.02 * A(i) && A(i) >= A(i + o) - 0.02 * A(i)))) continue;
      if (crests.some(q => Math.abs(q - pts[i].L) < 0.08)) continue; crests.push(pts[i].L);
      const crest = A(i), sgn = Math.sign(pts[i].k), half = [];
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
