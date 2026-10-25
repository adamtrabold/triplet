// g7bb JITTER CHECK (director, turn 160: "an engine where an invisible 0.02px move flips a check isn't the foundation for 'perfect
// on every icon ever created'"). Rebuilds an icon many times with its inputs nudged at random by up to 0.02px (its solved size, and
// its placement across and down), and asks two things of every rebuild:
//   1. MOVE: the outline moves 0.05px or less from the approved drawing (the farthest any point of one is from the other, both ways;
//      the nudge itself is in it, up to about 0.03px).
//   2. VERDICT: every check (fair-check, join-check) gives the same answer: the same faults, of the same kinds, as the base build.
// A fault that appears in some rebuilds and not others is MARGINAL (it sits on a limit, within noise); a fault in every rebuild holds.
// Fixed trials first: the base build (the engine as it builds every icon: the 1/1000 placement law), LAWS (the size floored to 1/1000
// too), NOLAW (positions at full float precision). Then N random ones (seeded, so a run can be repeated).
//   node jitter-check.js <id>[,<id>...] [N=50] [seed=1]      ids: cafe bar museum nature star plus (the six), bed2 person2
//   -> prints one line per icon and writes svg/g7/jitter/<id>.json; exit 1 if any rebuild moves over 0.05px or changes a verdict
// For a NEW icon: the drawing's builder goes in BUILDERS below (a function (J) -> { d }, J = { ds, dx, dy } in px), then run it.
'use strict';
const fs = require('fs'), path = require('path');
const fair = require('./fair-check.js'), joinC = require('./join-check.js');
const MOVE_MAX = 0.05, NUDGE = 0.02;

// ---- the outlines, sampled densely, and the farthest distance between two of them (both ways)
function samples(d, step = 0.02) {
  const pts = [], segs = [];
  for (const sub of joinC.parse(d)) for (const s of sub) {
    const P = s.P, L = Math.hypot(P[3][0] - P[0][0], P[3][1] - P[0][1]) + Math.hypot(P[1][0] - P[0][0], P[1][1] - P[0][1]) + Math.hypot(P[2][0] - P[3][0], P[2][1] - P[3][1]);
    const n = Math.max(2, Math.ceil(L / step)); let prev = null;
    for (let q = 0; q <= n; q++) { const t = q / n, u = 1 - t, p = [u * u * u * P[0][0] + 3 * t * u * u * P[1][0] + 3 * t * t * u * P[2][0] + t * t * t * P[3][0], u * u * u * P[0][1] + 3 * t * u * u * P[1][1] + 3 * t * t * u * P[2][1] + t * t * t * P[3][1]]; pts.push(p); if (prev) segs.push([prev, p]); prev = p; }
  }
  return { pts, segs };
}
function grid(segs, cell = 0.25) { const g = new Map(); for (const s of segs) { const x0 = Math.floor(Math.min(s[0][0], s[1][0]) / cell), x1 = Math.floor(Math.max(s[0][0], s[1][0]) / cell), y0 = Math.floor(Math.min(s[0][1], s[1][1]) / cell), y1 = Math.floor(Math.max(s[0][1], s[1][1]) / cell); for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) { const k = x + ',' + y; if (!g.has(k)) g.set(k, []); g.get(k).push(s); } } return { g, cell }; }
function near(G, p) {
  const cx = Math.floor(p[0] / G.cell), cy = Math.floor(p[1] / G.cell); let best = Infinity;
  for (let r = 0; r < 40 && (best === Infinity || (r - 1) * G.cell < best); r++) for (let x = cx - r; x <= cx + r; x++) for (let y = cy - r; y <= cy + r; y++) {
    if (Math.max(Math.abs(x - cx), Math.abs(y - cy)) !== r) continue; const L = G.g.get(x + ',' + y); if (!L) continue;
    for (const [a, b] of L) { const vx = b[0] - a[0], vy = b[1] - a[1], l2 = vx * vx + vy * vy, t = l2 ? Math.max(0, Math.min(1, ((p[0] - a[0]) * vx + (p[1] - a[1]) * vy) / l2)) : 0; best = Math.min(best, Math.hypot(p[0] - a[0] - t * vx, p[1] - a[1] - t * vy)); }
  }
  return best;
}
function apart(d1, d2) { const A = samples(d1), B = samples(d2), GA = grid(A.segs), GB = grid(B.segs); let m = 0, at = null; for (const p of A.pts) { const v = near(GB, p); if (v > m) { m = v; at = p; } } for (const p of B.pts) { const v = near(GA, p); if (v > m) { m = v; at = p; } } return { m, at: at && at.map(v => +v.toFixed(2)) }; }

// a verdict: the faults each check finds, by kind and place (to 0.25 units: a fault that stays put is the same fault)
const verdict = d => [...fair.check(d), ...joinC.check(d)].map(f => `${f.kind}@${(Math.round(f.at[0] * 4) / 4).toFixed(2)},${(Math.round(f.at[1] * 4) / 4).toFixed(2)}`).sort();
const kinds = v => v.map(x => x.split('@')[0]).sort().join(' ') || 'clean';

// ---- builders: (J) -> { d }; the six from construction.js (the approved fit, nudged), the bed and the person from blind.js
const SIX = ['cafe', 'bar', 'museum', 'nature', 'star', 'plus'];
let CON = null; const con = () => CON || (CON = require('./construction.js'));
const fitOf = id => { const all = JSON.parse(fs.readFileSync(path.join(__dirname, '../svg/g7/construction.json'), 'utf8')); return all[id]; };
const BUILDERS = {};
for (const id of SIX) BUILDERS[id] = J => {
  if (id === 'star' || id === 'plus') return con().mark(id, { fit: true, ds: J.ds, dx: J.dx, dy0: J.dy, law1000: J.law1000 });
  const f = fitOf(id); let s = f.s; if (J.sizeLaw) s = Math.floor(s * 1000 + 1e-6) / 1000;
  return con().shaped(id, { fit: { s, classFrom: f.classFrom }, ds: J.ds, dx: J.dx, dy: J.dy, law1000: J.law1000 });
};
const approved = id => SIX.includes(id) ? con().svgD({ cafe: 'cafe-r3.svg', bar: 'bar-r3.svg', museum: 'museum-r3.svg', nature: 'nature-r3.svg', star: 'star-r3.svg', plus: 'plus-r3.svg' }[id])
  : (f => fs.existsSync(f) ? fs.readFileSync(f, 'utf8').match(/ d="([^"]+)"/)[1] : null)(path.join(__dirname, '../svg/blind', id + '.svg'));
try { Object.assign(BUILDERS, require('./blind.js').JITTER || {}); } catch (e) { /* blind.js may not be loadable without its inputs */ }

function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

function run(id, N, seed) {
  const B = BUILDERS[id]; if (!B) throw new Error('no builder for ' + id);
  const R = rng(seed + id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)), u = () => (2 * R() - 1) * NUDGE;
  const trials = [{ name: 'base' }];
  if (seed === 1) { trials.push({ name: 'LAWS', sizeLaw: true }, { name: 'NOLAW', law1000: false }); if (id === 'person2') trials.push({ name: 'RAW', raw: true }); }   // RAW: its size at full float precision (turn 157: 4 KNEE)
  for (let i = 0; i < N; i++) trials.push({ name: `j${seed}_${i}`, ds: u(), dx: u(), dy: u() });
  const ref = approved(id), out = [];
  let base = null;
  for (const t of trials) {
    const t0 = Date.now(), g = B(t), v = verdict(g.d);
    if (!base) base = { d: g.d, v };
    const mv = apart(g.d, ref || base.d);
    out.push({ ...t, move: +mv.m.toFixed(4), moveAt: mv.at, faults: v, kinds: kinds(v), sec: (Date.now() - t0) / 1000 });
    if (process.env.JDBG) console.error(id, t.name, mv.m.toFixed(4), kinds(v), ((Date.now() - t0) / 1000).toFixed(1) + 's');
    if (process.env.JSAVE) fs.writeFileSync(path.join(process.env.JSAVE, `${id}-${t.name}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${g.d}"/></svg>`);
  }
  // the faults: in every trial (holds), in some (marginal)
  const all = new Map(); for (const o of out) for (const f of new Set(o.faults)) all.set(f, (all.get(f) || 0) + 1);
  const holds = [...all].filter(([, c]) => c === out.length).map(([f]) => f), marginal = [...all].filter(([, c]) => c < out.length).map(([f, c]) => `${f} (${c}/${out.length})`);
  const flips = out.filter(o => o.faults.join() !== base.v.join()).length, maxMove = Math.max(...out.map(o => o.move));
  const res = { id, N, seed, maxMove, maxMoveAt: out.find(o => o.move === maxMove).moveAt, flips, holds, marginal, ok: maxMove <= MOVE_MAX && flips === 0, trials: out };
  const dir = path.join(__dirname, '../svg/g7/jitter'); fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(path.join(dir, seed === 1 ? `${id}.json` : `${id}-s${seed}.json`), JSON.stringify(res, null, 1));
  console.log(`${id}: ${res.ok ? 'HOLDS' : 'FAILS'}  ${out.length} builds, max move ${maxMove.toFixed(4)}px (limit ${MOVE_MAX}), verdict changes ${flips}; faults that hold: ${holds.join(' ') || 'none'}; marginal: ${marginal.join(' ') || 'none'}`);
  return res;
}
module.exports = { run, apart, verdict, BUILDERS, MOVE_MAX, NUDGE };
// merge: node jitter-check.js merge <id>,...  -> folds <id>-s<k>.json (runs split across processes by seed) into <id>.json
function merge(id) {
  const dir = path.join(__dirname, '../svg/g7/jitter'), files = fs.readdirSync(dir).filter(f => f === `${id}.json` || (f.startsWith(`${id}-s`) && f.endsWith('.json'))).sort();
  const runs = files.map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))), base = runs.find(r => r.seed === 1) || runs[0];
  const seen = new Set(), out = []; for (const r of runs) for (const t of r.trials) { const k = t.name === 'base' ? 'base' : t.name; if (seen.has(k)) continue; seen.add(k); out.push(t); }
  const all = new Map(); for (const o of out) for (const f of new Set(o.faults)) all.set(f, (all.get(f) || 0) + 1);
  const holds = [...all].filter(([, c]) => c === out.length).map(([f]) => f), marginal = [...all].filter(([, c]) => c < out.length).map(([f, c]) => `${f} (${c}/${out.length})`);
  const bv = out.find(o => o.name === 'base').faults.join(), flips = out.filter(o => o.faults.join() !== bv).length, maxMove = Math.max(...out.map(o => o.move));
  const res = { id, N: out.filter(o => /^j/.test(o.name)).length, seeds: runs.map(r => r.seed), maxMove, maxMoveAt: out.find(o => o.move === maxMove).moveAt, flips, holds, marginal, ok: maxMove <= MOVE_MAX && flips === 0, trials: out };
  fs.writeFileSync(path.join(dir, `${id}.json`), JSON.stringify(res, null, 1)); for (const f of files) if (f !== `${id}.json`) fs.unlinkSync(path.join(dir, f));
  console.log(`${id}: ${res.ok ? 'HOLDS' : 'FAILS'}  ${out.length} builds (${res.N} nudged), max move ${maxMove.toFixed(4)}px (limit ${MOVE_MAX}), verdict changes ${flips}; faults that hold: ${holds.join(' ') || 'none'}; marginal: ${marginal.join(' ') || 'none'}`);
  return res;
}
module.exports.merge = merge;
if (require.main === module && process.argv[2] === 'merge') { let bad = 0; for (const id of process.argv[3].split(',')) if (!merge(id).ok) bad++; process.exit(bad ? 1 : 0); }
else if (require.main === module) {
  const ids = (process.argv[2] || SIX.join(',')).split(','), N = +(process.argv[3] || 50), seed = +(process.argv[4] || 1);
  let bad = 0; for (const id of ids) if (!run(id, N, seed).ok) bad++;
  process.exit(bad ? 1 : 0);
}
