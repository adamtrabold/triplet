// THE SYSTEM, the proof: how far a regenerated outline is from a reference outline.
//   node system-diff.js <a.svg|a.json:key|d> <b.svg|...>   -> { same, points, maxPoint, hausdorff }
// maxPoint: the largest move of any on-curve or control point when both outlines have the same commands (else null).
// hausdorff: the largest distance from any point of either outline to the other, sampled every 0.01 units (always given).
'use strict';
const fs = require('fs'), path = require('path');
const paper = require(path.join(process.env.TOOLS, 'node_modules/paper/dist/paper-core.js'));
paper.setup(new paper.Size(100, 100));

function readD(spec) {
  if (spec.startsWith('M')) return spec;
  const [f, key, field = 'd'] = spec.split(':');
  const s = fs.readFileSync(f, 'utf8');
  if (f.endsWith('.json')) { const j = JSON.parse(s); return key ? j[key][field] : j[field]; }
  return s.match(/ d="([^"]+)"/)[1];
}
const nums = d => (d.match(/-?\d*\.?\d+(?:e-?\d+)?/g) || []).map(Number);
const cmds = d => (d.match(/[A-Za-z]/g) || []).join('');
function sample(d) {
  const it = new paper.CompoundPath(d), pts = [];
  for (const p of it.children || [it]) { const L = p.length; for (let t = 0; t <= L; t += 0.01) pts.push(p.getPointAt(Math.min(t, L))); }
  return { it, pts };
}
function diff(da, db) {
  const same = da === db, na = nums(da), nb = nums(db);
  let maxPoint = null;
  if (cmds(da) === cmds(db) && na.length === nb.length) {
    maxPoint = 0; for (let i = 0; i < na.length; i += 2) maxPoint = Math.max(maxPoint, Math.hypot(na[i] - nb[i], (na[i + 1] || 0) - (nb[i + 1] || 0)));
  }
  const A = sample(da), B = sample(db);
  let h = 0;
  for (const p of A.pts) h = Math.max(h, B.it.getNearestPoint(p).getDistance(p));
  for (const p of B.pts) h = Math.max(h, A.it.getNearestPoint(p).getDistance(p));
  A.it.remove(); B.it.remove();
  return { same, points: na.length / 2, maxPoint: maxPoint == null ? null : +maxPoint.toFixed(6), hausdorff: +h.toFixed(6) };
}
module.exports = { diff, readD };
if (require.main === module) console.log(JSON.stringify(diff(readD(process.argv[2]), readD(process.argv[3]))));
