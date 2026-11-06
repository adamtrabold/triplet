// icons.js — the eight, drawn by hand at 18 (the master) in the 24 box. Units: px; the grid is 1/3.
// Stroke 1 1/2, parts 1 1/3, cuts and counters 1. Rack: 1/8, 1/4, 1/2.
// A key with '@' is a variant (shown on the work sheet, not written to ../18).
const { block, poly, disc, oval, post, ring, U, S, I, mill, d } = H;
const ICONS = {};
const rad = a => a * Math.PI / 180;
const path = (start, build) => { const p = new paper.Path({ insert: false, closed: true, segments: [start] }); build(p); return p; };

// Landmark: a camera. A body, its prism off to the left, a shutter button, the lens in a ring.
{
  const body = block(7, 9.67, 17, 16.33);
  const hump = poly([[8.33, 10], [9.33, 8], [11.67, 8], [12.67, 10]]);
  const btn = block(14, 8.67, 15.67, 10);
  const lensHole = disc(12.33, 13, 2.17), lens = disc(12.33, 13, 1.08);
  const g = U(S(U(body, hump, btn), lensHole), lens);
  ICONS.landmark = d(mill(g, (p, cx) => cx ? ((p.y > 9.5 && (p.x < 7.2 || p.x > 16.8)) ? 0.5 : 0.25) : 0.25));
}

// Attraction: a Ferris wheel on its A-frame and footing.
const wheel = (o) => {
  const cx = 12, cy = o.cy, R = o.R, w = o.w;
  const parts = [ring(cx, cy, R, w), disc(cx, cy, o.hub)];
  for (const a of o.spokes) { const r = R - w + 0.25, c = Math.cos(rad(a)) * r, s = Math.sin(rad(a)) * r; parts.push(post(cx - c, cy - s, cx + c, cy + s, o.sw)); }
  for (const a of o.legs) { const L = 20, c = Math.cos(rad(a)) * L, s = Math.sin(rad(a)) * L; parts.push(post(cx, cy, cx + c, cy + s, o.lw)); }
  if (o.base) parts.push(block(o.base[0], o.bottom - o.base[1], o.base[2], o.bottom));
  let g = U(...parts);
  g = S(g, block(-20, o.bottom, 44, 44));
  return d(mill(g, (p, cx_) => cx_ ? 0.25 : (p.y > o.bottom - o.base[1] - 0.2 && p.y < o.bottom - o.base[1] + 0.2 ? 0.5 : 0.125)));
};
ICONS.attraction = wheel({ cy: 10.67, R: 3.83, w: 1.33, hub: 0.83, spokes: [0, 60, 120], sw: 0.67, legs: [60, 120], lw: 1.33, bottom: 17, base: [7.33, 1, 16.67] });
// Venue: a stage curtain on its rail, drawn back to its ties.
const drape = (x0, top, bottom, inner, tieX, tieY, footX) => path([x0, top], p => {
  p.lineTo([inner, top]);
  p.cubicCurveTo([inner, top + 2.2], [tieX + 0.6, tieY - 0.5], [tieX, tieY]);
  p.lineTo([footX, bottom]); p.lineTo([x0, bottom]);
});
const curtain = (o) => {
  const L = drape(o.x0, o.top, o.bottom, 11.5, o.tieX, o.tieY, o.footX);
  const R = L.clone({ insert: false }); R.scale(-1, 1, new paper.Point(12, 12));
  const g = U(L, R, block(7, 7, 17, o.railB));
  return d(mill(g, (p, cx) => cx ? 0.25 : 0.125));
};
ICONS.venue = curtain({ x0: 7.33, top: 9.33, bottom: 17, railB: 8.33, tieX: 9.33, tieY: 13.67, footX: 10.17 });

// Hotel: a bed, the cover turned down, a pillow at the head.
{
  const head = block(6.67, 8.33, 8, 16.67);
  const mattress = block(8, 12.67, 17.33, 15);
  const cover = block(11.67, 11.67, 17.33, 13);
  const foot = block(16, 14.5, 17.33, 16.67);
  const pillow = block(9, 10.33, 11.33, 11.67);
  const g = U(head, mattress, cover, foot, pillow);
  ICONS.hotel = d(mill(g, (p, cx) => cx ? ((p.y < 8.6 || (p.x < 11.5 && p.x > 8.8 && p.y < 11.8)) ? 0.5 : 0.25) : 0.25));
}

// Shopping: a paper bag, a thin rope handle.
const bag = (o) => {
  const body = poly([[8.33, o.top], [15.67, o.top], [16, 17.33], [8, 17.33]]);
  const hw = o.hw, hh = o.hh, t = o.ht;
  const handle = S(oval(12, o.top, hw, hh), oval(12, o.top, hw - t, hh - t), block(0, o.top, 24, 24));
  const g = U(body, handle);
  return d(mill(g, (p, cx) => cx ? 0.25 : 0.125));
};
ICONS.shopping = bag({ top: 10.33, hw: 2.33, hh: 2.67, ht: 1 });

// Park: a picnic table, end on: top, splayed legs, the bench running past them.
{
  const top = block(7.33, 8.67, 16.67, 10);
  const legL = post(10.33, 9.5, 8, 16.67, 1.33), legR = post(13.67, 9.5, 16, 16.67, 1.33);
  const seat = block(6.33, 12.67, 17.67, 14);
  let g = U(top, legL, legR, seat);
  g = S(g, block(0, 16.33, 24, 24));
  ICONS.park = d(mill(g, (p, cx) => cx ? 0.25 : 0.125));
}

// Neighbourhood: two houses side by side, a cut apart: the left lower, the right taller with its door.
const house = (x0, x1, eave, base) => { const h = (x1 - x0) / 2; return poly([[x0, base], [x0, eave], [x0 + h, eave - h], [x1, eave], [x1, base]]); };
const houses = (o) => {
  const y = v => v + o.dy;
  let L = house(7.33, 11.33, y(12), y(16.33)), R = house(12.33, 16.67, y(11.33), y(16.33));
  if (o.doorR) R = S(R, block(13.83, y(13.67), 15.17, y(17)));
  if (o.doorL) L = S(L, block(8.67, y(14), 10, y(17)));
  if (o.winL) L = S(L, block(8.83, y(13), 9.83, y(14)));
  const g = U(L, R); if (o.s) g.scale(o.s, new paper.Point(12, g.bounds.center.y));
  return d(mill(g, (p, cx) => cx ? 0.25 : 0.125));
};
ICONS.neighbourhood = houses({ dy: -0.67, doorR: true, s: 1.1 });

// Street: a walker, in stride (facing right). Torso tapered, limbs posts that end square, knees round.
const walker = (o) => {
  const head = disc(o.hx, o.hy, o.hr);
  const sh = o.sh, hip = o.hip;
  const n = new paper.Point(hip[0] - sh[0], hip[1] - sh[1]).normalize().rotate(90);
  const torso = poly([[sh[0] + n.x * o.tw / 2, sh[1] + n.y * o.tw / 2], [hip[0] + n.x * o.hw / 2, hip[1] + n.y * o.hw / 2], [hip[0] - n.x * o.hw / 2, hip[1] - n.y * o.hw / 2], [sh[0] - n.x * o.tw / 2, sh[1] - n.y * o.tw / 2]]);
  const parts = [head, torso];
  for (const l of o.limbs) for (let i = 0; i + 1 < l.pts.length; i++) parts.push(post(l.pts[i][0], l.pts[i][1], l.pts[i + 1][0], l.pts[i + 1][1], l.w));
  for (const l of o.limbs) for (let i = 1; i + 1 < l.pts.length; i++) parts.push(disc(l.pts[i][0], l.pts[i][1], l.w / 2));
  return d(mill(U(...parts), (p, cx) => cx ? (p.y < sh[1] + 0.4 && p.y > o.hy + o.hr ? o.shoulder : 0.25) : 0.25));
};
// Leans about 12 degrees into the step; torso longer than the legs' stride is high; each arm swings
// opposite its leg. The head sits a cut clear of the shoulders.
const W = { hx: 13.17, hy: 7, hr: 1.25, sh: [12.83, 9.33], hip: [12, 13.17], tw: 1.83, hw: 1.67, shoulder: 0.5,
  limbs: [
    { w: 1.33, pts: [[12.72, 9.9], [14.83, 12.33]] },  // front arm, swung forward
    { w: 1.33, pts: [[12.62, 9.9], [10.5, 12.5]] },    // back arm, swung back
    { w: 1.67, pts: [[12.05, 12.9], [14.17, 17]] },    // front leg
    { w: 1.67, pts: [[11.9, 12.9], [9.67, 16.83]] },   // back leg
  ] };
ICONS.street = walker(W);
window.ICONS = ICONS;
