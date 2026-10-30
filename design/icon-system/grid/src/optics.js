// Optical measures for a finished glyph path (g7): ink area, ink centroid, bounding box.
// Exact, from the outline: each closed piece is flattened to a polygon; a piece inside an odd number
// of others is a hole. Used to place glyphs by optical centre and to compare optical weight.
'use strict';
const path = require('path');
const paper = require(path.join(process.env.TOOLS || '/tmp/claude-0/-home-user-la-trip-map/04f8fb34-0476-5960-add5-8bd3d6d8820e/scratchpad/tools', 'node_modules/paper/dist/paper-core.js'));

function polys(d) {
  const cp = new paper.CompoundPath(d); cp.flatten(0.02);
  const kids = cp.children && cp.children.length ? cp.children : [cp];
  const out = kids.map(k => k.segments.map(s => [s.point.x, s.point.y]));
  cp.remove(); return out;
}
function polyAC(p) { // |area| and centroid of one polygon
  let a = 0, cx = 0, cy = 0;
  for (let i = 0; i < p.length; i++) { const [x0, y0] = p[i], [x1, y1] = p[(i + 1) % p.length], c = x0 * y1 - x1 * y0; a += c; cx += (x0 + x1) * c; cy += (y0 + y1) * c; }
  a /= 2; return { a: Math.abs(a), cx: cx / (6 * a), cy: cy / (6 * a) };
}
function inside(pt, p) { let c = false; for (let i = 0, j = p.length - 1; i < p.length; j = i++) { const [xi, yi] = p[i], [xj, yj] = p[j]; if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi) c = !c; } return c; }
function measure(d) {
  const ps = polys(d); let A = 0, X = 0, Y = 0, x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  ps.forEach((p, i) => {
    const depth = ps.filter((q, j) => j !== i && inside(p[0], q)).length, s = depth % 2 ? -1 : 1, m = polyAC(p);
    A += s * m.a; X += s * m.a * m.cx; Y += s * m.a * m.cy;
    for (const [x, y] of p) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  });
  // l1: how far the ink reaches across a diamond about the box's centre (the largest |x| + |y|), for a diamond class box
  const bcx = (x0 + x1) / 2, bcy = (y0 + y1) / 2; let l1 = 0; ps.forEach(p => { for (const [x, y] of p) l1 = Math.max(l1, Math.abs(x - bcx) + Math.abs(y - bcy)); });
  return { area: A, cx: X / A, cy: Y / A, box: { x0, y0, x1, y1, cx: bcx, cy: bcy }, l1 };
}
module.exports = { measure };
