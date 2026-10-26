// Jitter check for the mix in clean curves (as jitter-check.js, for mix-curves.js builds): every root nudged together by up to
// 0.02px (seeded), rebuilt, moved back; pass = every rebuild within 0.05px of the base outline and the same fair-check faults.
//   node mix-jitter.js <name> [N] [seed]      -> svg/mix/curves/jitter-<name>.json
'use strict';
const fs = require('fs'), path = require('path');
const { buildIcon } = require('./mix-curves.js');
const { check } = require('./fair-check.js');
const paper = require(path.join(process.env.TOOLS, 'node_modules/paper/dist/paper-core.js'));
const name = process.argv[2], N = +(process.argv[3] || 8);
let seed = +(process.argv[4] || 7); const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const pts = d => { const p = new paper.CompoundPath(d); p.flatten(0.02); const out = []; for (const k of (p.children && p.children.length ? p.children : [p])) for (const s of k.segments) out.push(s.point); return { p, out }; };
const base = buildIcon(name), B = pts(base.d), f0 = check(base.d).map(f => f.kind).sort().join(',');
const res = { name, N, baseFaults: f0, runs: [] };
for (let i = 0; i < N; i++) {
  const dx = (rnd() * 2 - 1) * 0.02, dy = (rnd() * 2 - 1) * 0.02;
  const j = buildIcon(name, { dx, dy }), Jp = pts(j.d);
  let far = 0;
  for (const q of Jp.out) { const q0 = new paper.Point(q.x - dx, q.y - dy); far = Math.max(far, B.p.getNearestPoint(q0).getDistance(q0)); }
  const f = check(j.d).map(x => x.kind).sort().join(',');
  res.runs.push({ dx: +dx.toFixed(4), dy: +dy.toFixed(4), far: +far.toFixed(4), faults: f });
  Jp.p.remove();
  console.log(name, i, far.toFixed(4), f || 'clean');
}
res.maxFar = Math.max(...res.runs.map(r => r.far)); res.flips = res.runs.filter(r => r.faults !== f0).length;
res.pass = res.maxFar <= 0.05 && res.flips === 0;
fs.writeFileSync(path.join(__dirname, `../svg/mix/curves/jitter-${name}.json`), JSON.stringify(res, null, 1));
console.log(name, 'max', res.maxFar, 'flips', res.flips, res.pass ? 'HOLDS' : 'FAILS');
