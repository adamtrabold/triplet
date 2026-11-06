// lib.js — hand-drawing kit, runs in the browser with paper.js (paper-core 0.12.18).
// Draw sharp roots (blocks, discs, posts, polygons), join/cut them with booleans, then
// machine every corner in one pass (mill()): convex corners and concave joins each take a
// cutter from the rack (1/8, 1/4, 1/2 px), chosen per corner by a function of the point.
paper.setup(new paper.Size(24, 24));
const P = (x, y) => new paper.Point(x, y);
const H = {};
// block: axis-aligned rectangle, sharp (mill() rounds it)
H.block = (x0, y0, x1, y1) => new paper.Path({ segments: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], closed: true, insert: false });
H.poly = pts => new paper.Path({ segments: pts, closed: true, insert: false });
H.disc = (cx, cy, r) => new paper.Path.Circle({ center: [cx, cy], radius: r, insert: false });
H.oval = (cx, cy, rx, ry) => new paper.Path.Ellipse({ center: [cx, cy], radius: [rx, ry], insert: false });
// post: a bar of width w along the line a→b, ends square to itself
H.post = (ax, ay, bx, by, w) => { const a = P(ax, ay), b = P(bx, by), n = b.subtract(a).normalize().rotate(90).multiply(w / 2);
  return H.poly([a.add(n), b.add(n), b.subtract(n), a.subtract(n)]); };
// ring: disc minus disc
H.ring = (cx, cy, r, w) => H.disc(cx, cy, r).subtract(H.disc(cx, cy, r - w), { insert: false });
H.U = (...xs) => xs.reduce((a, b) => a.unite(b, { insert: false }));
H.S = (a, ...xs) => xs.reduce((m, b) => m.subtract(b, { insert: false }), a);
H.I = (a, b) => a.intersect(b, { insert: false });

// mill(item, rfn): round every sharp corner. rfn(pt, convex, turnDeg) → radius (0 = leave).
H.mill = (item, rfn) => {
  item.reorient(true, true);
  const kids = item.children ? item.children.slice() : [item];
  for (const path of kids) millPath(path, rfn);
  return item;
};
function millPath(path, rfn) {
  let guard = 0;
  for (let i = 0; i < path.segments.length && guard++ < 400; i++) {
    const s = path.segments[i], n = path.segments.length;
    const cin = path.curves[(i - 1 + n) % n], cout = path.curves[i];
    const tin = cin.getTangentAtTime(1), tout = cout.getTangentAtTime(0);
    if (!tin || !tout || tin.length === 0 || tout.length === 0) continue;
    const turn = Math.abs(tin.getDirectedAngle(tout));
    if (turn < 4) continue;
    const inkConvex = tin.cross(tout) > 0; // outer contours clockwise (y down), holes counter-clockwise
    let r = rfn(s.point, inkConvex, turn);
    if (!r) continue;
    const phi = turn * Math.PI / 180;
    let t = r * Math.tan(phi / 2);
    const lim = 0.48 * Math.min(cin.length, cout.length);
    if (t > lim) { t = lim; r = t / Math.tan(phi / 2); }
    const k = 4 / 3 * Math.tan(phi / 4) * r;
    const pIn = cin.getLocationAt(cin.length - t), pOut = cout.getLocationAt(t);
    // split: outgoing first so indices of the incoming split stay valid
    const outNew = path.divideAt(pOut); const inNew = path.divideAt(pIn);
    const si = path.segments.indexOf(s);
    const a = path.segments[(si - 1 + path.segments.length) % path.segments.length];
    const b = path.segments[(si + 1) % path.segments.length];
    a.handleOut = tin.normalize().multiply(k);
    b.handleIn = tout.normalize().multiply(-k);
    s.remove();
    i = path.segments.indexOf(b);
  }
}
H.d = (item, prec = 4) => {
  const f = v => +v.toFixed(prec);
  const walk = p => { let s = ''; const seg = p.segments; if (!seg.length) return '';
    s += `M${f(seg[0].point.x)} ${f(seg[0].point.y)}`;
    const n = seg.length;
    for (let i = 1; i <= n; i++) { const a = seg[i - 1], b = seg[i % n];
      if (a.handleOut.isZero() && b.handleIn.isZero()) { if (i < n) s += `L${f(b.point.x)} ${f(b.point.y)}`; }
      else { const c1 = a.point.add(a.handleOut), c2 = b.point.add(b.handleIn); s += `C${f(c1.x)} ${f(c1.y)} ${f(c2.x)} ${f(c2.y)} ${f(b.point.x)} ${f(b.point.y)}`; } }
    return s + 'Z'; };
  return (item.children ? item.children : [item]).map(walk).join('');
};
window.H = H; window.P = P;
