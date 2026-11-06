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

// Attraction: a Ferris wheel.
const wheel = (o) => {
  const cx = 12, cy = o.cy, R = o.R, w = o.w;
  const parts = [ring(cx, cy, R, w), disc(cx, cy, o.hub)];
  for (const a of o.spokes) { const r = R - w + 0.25, c = Math.cos(rad(a)) * r, s = Math.sin(rad(a)) * r; parts.push(post(cx - c, cy - s, cx + c, cy + s, o.sw)); }
  for (const a of o.legs) { const L = 20, c = Math.cos(rad(a)) * L, s = Math.sin(rad(a)) * L; parts.push(post(cx, cy, cx + c, cy + s, o.lw)); }
  if (o.cabins) for (let i = 0; i < o.cabins; i++) { const a = rad(i * 360 / o.cabins + (o.cabinTurn || 0)); parts.push(disc(cx + Math.cos(a) * (R + o.cabinOff), cy + Math.sin(a) * (R + o.cabinOff), o.cabinR)); }
  if (o.base) parts.push(block(o.base[0], o.bottom - o.base[1], o.base[2], o.bottom));
  let g = U(...parts);
  g = S(g, block(0, o.bottom, 24, 24), block(0, 0, 2, 24), block(22, 0, 24, 24));
  return d(mill(g, (p, cx_) => cx_ ? 0.25 : 0.125));
};
ICONS.attraction = wheel({ cy: 10.67, R: 3.83, w: 1.33, hub: 0.83, spokes: [0, 60, 120], sw: 0.67, legs: [60, 120], lw: 1.33, bottom: 17, base: [7.33, 1, 16.67] });

// Venue: a stage curtain, drawn back to its ties.
const drape = (top, bottom, inner, tieX, tieY, footX) => path([7, top], p => {
  p.lineTo([inner, top]);
  p.cubicCurveTo([inner, top + 2.2], [tieX + 0.6, tieY - 0.5], [tieX, tieY]);
  p.lineTo([footX, bottom]); p.lineTo([7, bottom]);
});
const curtain = (o) => {
  const L = drape(o.top, o.bottom, 11.5, o.tieX, o.tieY, o.footX);
  const R = L.clone({ insert: false }); R.scale(-1, 1, new paper.Point(12, 12));
  const parts = [L, R, block(7, 7, 17, o.railB)];
  if (o.stage) parts.push(block(o.stage[0], o.stage[1], o.stage[2], o.stage[3]));
  let g = U(...parts);
  if (o.scallop) { for (let i = 0; i < 3; i++) g = S(g, disc(7 + 10 / 6 + i * 10 / 3, o.railB + 0.95, 1.55)); g = U(g, block(7, 7, 17, o.railB - 0.9)); }
  return d(mill(g, (p, cx) => cx ? 0.25 : 0.125));
};
ICONS.venue = curtain({ top: 9.33, bottom: 17, railB: 8.33, tieX: 9, tieY: 13.67, footX: 9.83 });

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
  const handle = S(oval(12, o.top + o.sink, hw, hh), oval(12, o.top + o.sink, hw - t, hh - t), block(0, o.top + o.sink, 24, 24));
  let g = U(body, handle);
  if (o.slots) for (const x of [12 - hw + t / 2, 12 + hw - t / 2]) g = S(g, block(x - t / 2, o.top + 0.01, x + t / 2, o.top + o.slots));
  if (o.holes) for (const x of [12 - hw + t / 2, 12 + hw - t / 2]) g = S(g, disc(x, o.top + 1.17, 0.5));
  if (o.cuff) g = S(g, block(0, o.top + o.cuff, 24, o.top + o.cuff + 0.67));
  return d(mill(g, (p, cx) => cx ? 0.25 : 0.125));
};
ICONS.shopping = bag({ top: 10.33, hw: 2.33, hh: 2.67, ht: 1, sink: 0 });
ICONS['shopping@slots'] = bag({ top: 10.33, hw: 2.33, hh: 2.67, ht: 1, sink: 1.33, slots: 1.67 });
ICONS['shopping@cuff'] = bag({ top: 10.33, hw: 2.33, hh: 2.67, ht: 1, sink: 0, cuff: 1.33 });
ICONS['shopping@wide'] = bag({ top: 10.33, hw: 3, hh: 2.67, ht: 1, sink: 0 });

// Park: a picnic table, end on: top, splayed legs, the bench running past them.
{
  const top = block(7.33, 8.67, 16.67, 10);
  const legL = post(10.33, 9.5, 8, 16.67, 1.33), legR = post(13.67, 9.5, 16, 16.67, 1.33);
  const seat = block(6.33, 12.67, 17.67, 14);
  let g = U(top, legL, legR, seat);
  g = S(g, block(0, 16.33, 24, 24));
  ICONS.park = d(mill(g, (p, cx) => cx ? 0.25 : 0.125));
}

// Neighbourhood: houses.
const house = (x0, x1, eave, base) => { const h = (x1 - x0) / 2; return poly([[x0, base], [x0, eave], [x0 + h, eave - h], [x1, eave], [x1, base]]); };
{
  const pair = (bx0, bx1, beave, fx0, fx1, feave, base, door) => {
    const back = house(bx0, bx1, beave, base), front = house(fx0, fx1, feave, base);
    const frontOut = house(fx0 - 1, fx1 + 1, feave - 0.41, base + 1); // the front house grown by a cut, to part it from the back one
    let g = U(S(back, frontOut), front);
    if (door) g = S(g, block(door[0], door[1], door[2], base + 1));
    return d(mill(g, (p, cx) => cx ? 0.25 : 0.125));
  };
  ICONS.neighbourhood = pair(7.33, 12, 10.67, 10.67, 16.33, 12.67, 16.33, [12.83, 14, 14.17]);
  ICONS['neighbourhood@nodoor'] = pair(7.33, 12, 10.67, 10.67, 16.33, 12.67, 16.33, null);
  ICONS['neighbourhood@window'] = d(mill(S(U(S(house(7.33, 12, 10.67, 16.33), house(9.67, 17.33, 12.26, 17.33)), house(10.67, 16.33, 12.67, 16.33)), block(12.83, 14, 14.17, 17.33), block(8.67, 12, 9.67, 13)), (p, cx) => cx ? 0.25 : 0.125));
}

// Street: a walker, in stride.
{
  const head = disc(12.83, 7.33, 1.33);
  const body = post(12.5, 9.33, 11.67, 13.17, 2);
  const armF = post(12.33, 10.33, 14.17, 12.33, 1.33), armB = post(12.17, 10.5, 10.17, 12, 1.33);
  const legF = post(11.83, 12.83, 13.67, 16.67, 1.67);
  const thigh = post(11.67, 12.83, 10.67, 14.83, 1.67), shin = post(10.67, 14.83, 9.5, 16.67, 1.67);
  const g = U(head, body, armF, armB, legF, thigh, shin);
  ICONS.street = d(mill(g, (p, cx) => cx ? 0.25 : 0.25));
}
window.ICONS = ICONS;
