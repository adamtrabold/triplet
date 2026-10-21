// Monoweight check (g7r): every counter's edge should sit one line in from the outline that walls it.
// For each hole in a finished glyph, sample its edge and measure the distance to the nearest other contour
// (the outline, or a neighbouring hole across a post). A wall is where that distance is under 2 lines:
//   ok   within 0.08px of the line;   off  anything else under 1.5 lines (a wall that is not the line).
// Distances of 1.5 lines or more are mass or open space (the drink under a band, the pediment), not walls.
// Usage: node src/offset-check.js <svg> <line px in the svg's units> [out.svg]   (TOOLS must point at paper)
'use strict';
const fs = require('fs'), path = require('path');
const paper = require(path.join(process.env.TOOLS, 'node_modules/paper/dist/paper-core.js'));
paper.setup(new paper.Size(100, 100));

function contours(d) {
  const cp = new paper.CompoundPath(d); cp.flatten(0.01);
  const kids = cp.children && cp.children.length ? cp.children : [cp];
  return kids.map(k => k.segments.map(s => [s.point.x, s.point.y]));
}
function inside(pt, p) { let c = false; for (let i = 0, j = p.length - 1; i < p.length; j = i++) { const [xi, yi] = p[i], [xj, yj] = p[j]; if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi) c = !c; } return c; }
function distPoly(pt, p) {
  let m = Infinity;
  for (let i = 0; i < p.length; i++) {
    const a = p[i], b = p[(i + 1) % p.length], dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy;
    const t = L2 ? Math.max(0, Math.min(1, ((pt[0] - a[0]) * dx + (pt[1] - a[1]) * dy) / L2)) : 0;
    m = Math.min(m, Math.hypot(pt[0] - a[0] - t * dx, pt[1] - a[1] - t * dy));
  }
  return m;
}
function resample(p, step) {
  const out = [];
  for (let i = 0; i < p.length; i++) {
    const a = p[i], b = p[(i + 1) % p.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(L / step));
    for (let k = 0; k < n; k++) out.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]);
  }
  return out;
}
function check(d, line, tol = 0.08) {
  const cs = contours(d);
  const depth = cs.map((p, i) => cs.filter((q, j) => j !== i && inside(p[0], q)).length);
  const holes = [];
  cs.forEach((p, i) => {
    if (depth[i] % 2 === 0) return;
    const others = cs.filter((_, j) => j !== i);
    // a wall sample: the nearest other contour lies straight across (within 25 degrees of the edge's normal),
    // so corners seen diagonally across a mass (the museum's beam over a slot) don't count as walls
    const rs = resample(p, 0.04), N = rs.length;
    const pts = rs.map((pt, i) => {
      const a = rs[(i - 1 + N) % N], b = rs[(i + 1) % N], tx = b[0] - a[0], ty = b[1] - a[1], L = Math.hypot(tx, ty) || 1;
      let nx = -ty / L, ny = tx / L; if (inside([pt[0] + nx * 0.02, pt[1] + ny * 0.02], p)) { nx = -nx; ny = -ny; }
      let best = Infinity, bq = null;
      for (const q of others) for (let j = 0; j < q.length; j++) {
        const u = q[j], v = q[(j + 1) % q.length], dx = v[0] - u[0], dy = v[1] - u[1], L2 = dx * dx + dy * dy;
        const tt = L2 ? Math.max(0, Math.min(1, ((pt[0] - u[0]) * dx + (pt[1] - u[1]) * dy) / L2)) : 0, cx = u[0] + tt * dx, cy = u[1] + tt * dy, dd = Math.hypot(pt[0] - cx, pt[1] - cy);
        if (dd < best) { best = dd; bq = [cx, cy]; }
      }
      const cos = ((bq[0] - pt[0]) * nx + (bq[1] - pt[1]) * ny) / (best || 1);
      const k = best >= 1.5 * line || cos < Math.cos(25 * Math.PI / 180) ? 'mass' : Math.abs(best - line) <= tol ? 'ok' : 'off';
      return { pt, d: best, k };
    });
    const wall = pts.filter(x => x.k !== 'mass'), off = wall.filter(x => x.k === 'off');
    const xs = p.map(q => q[0]), ys = p.map(q => q[1]);
    holes.push({ box: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)], n: wall.length, off: off.length,
      share: wall.length ? off.length / wall.length : 0, min: wall.length ? Math.min(...wall.map(x => x.d)) : null, max: wall.length ? Math.max(...wall.map(x => x.d)) : null, pts });
  });
  return { holes, cs };
}
function overlay(d, res, scale = 24) {
  const dots = res.holes.flatMap(h => h.pts.filter(x => x.k !== 'mass').map(x => `<circle cx="${x.pt[0].toFixed(3)}" cy="${x.pt[1].toFixed(3)}" r="0.07" fill="${x.k === 'ok' ? '#2E8B57' : '#E0301E'}"/>`)).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${24 * scale}" height="${24 * scale}" viewBox="0 0 24 24"><rect width="24" height="24" fill="#FAF5EA"/><path d="${d}" fill="#12293F" fill-opacity=".35" fill-rule="evenodd"/>${dots}</svg>`;
}
module.exports = { check, overlay };
if (require.main === module) {
  const [f, line, out] = process.argv.slice(2);
  const d = [...fs.readFileSync(f, 'utf8').matchAll(/<path[^>]* d="([^"]+)"/g)].map(m => m[1]).join(' ');
  const r = check(d, +line);
  for (const h of r.holes) console.log(path.basename(f), 'hole at', h.box.map(v => v.toFixed(2)).join(','), `wall samples ${h.n}, off ${h.off} (${(100 * h.share).toFixed(0)}%), wall ${h.min == null ? '-' : h.min.toFixed(3)}..${h.max == null ? '-' : h.max.toFixed(3)}`);
  if (out) fs.writeFileSync(out, overlay(d, r));
}
