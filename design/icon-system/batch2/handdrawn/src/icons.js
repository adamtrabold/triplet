// icons.js — the eight, drawn by hand at 18 (the master) in the 24 box. Units: px; the grid is 1/3.
// Round 2 (after the director's score, 5e3142d1): drawn in the approved five's language — cap curves,
// flares and fillets where the object has them, not blocks with small rounds.
// Stroke 1 1/2, parts 1 1/3, cuts and counters 1. Rack: 1/8 (cuts), 1/4 (a part's own corners),
// 1/2 (a post into a face; a mass's corners).
// A key with '@' is a variant (shown on the work sheet, not written to ../18).
const { block, poly, disc, oval, post, ring, U, S, I, mill, d } = H;
const ICONS = {};
const rad = a => a * Math.PI / 180;
const Pt = (x, y) => new paper.Point(x, y);
const pth = (start) => new paper.Path({ insert: false, closed: true, segments: [start] });
// a post that flares: width w1 at a, w2 at b, ends square
const taper = (ax, ay, bx, by, w1, w2) => { const a = Pt(ax, ay), b = Pt(bx, by), n = b.subtract(a).normalize().rotate(90);
  return poly([a.add(n.multiply(w1 / 2)), b.add(n.multiply(w2 / 2)), b.subtract(n.multiply(w2 / 2)), a.subtract(n.multiply(w1 / 2))]); };
// a slab with a flat top and a curve underneath (the saucer's cap): sag at the middle
const capDown = (x0, x1, y0, t, sag) => { const p = pth([x0, y0]); p.lineTo([x1, y0]); p.lineTo([x1, y0 + t]); p.arcTo(Pt((x0 + x1) / 2, y0 + t + sag), Pt(x0, y0 + t)); return p; };
// a slab with a flat bottom and a curve on top (the coupe's foot)
const capUp = (x0, x1, y1, t, rise) => { const p = pth([x0, y1]); p.lineTo([x0, y1 - t]); p.arcTo(Pt((x0 + x1) / 2, y1 - t - rise), Pt(x1, y1 - t)); p.lineTo([x1, y1]); return p; };
const near = (p, x, y, r = 0.35) => Math.abs(p.x - x) < r && Math.abs(p.y - y) < r;

// Landmark: a rangefinder camera. Barrel ends, the lens right of centre, the viewfinder window top left,
// a shutter button with a domed top.
const camera = (o) => {
  const top = 9.33, bot = 15.67, x0 = 7, x1 = 17, e = o.end;
  const body = pth([x0 + e, top]); body.lineTo([x1 - e, top]); body.arcTo(Pt(x1, (top + bot) / 2), Pt(x1 - e, bot));
  body.lineTo([x0 + e, bot]); body.arcTo(Pt(x0, (top + bot) / 2), Pt(x0 + e, top));
  const btn = capUp(13.67, 15.33, top + 0.2, 0.87, 0.33);
  let g = U(body, btn);
  g = S(g, disc(o.lx, o.ly, o.lr));
  if (o.win) g = S(g, block(8.33, 10.67, 10.33, 11.67));
  g = U(g, disc(o.lx, o.ly, o.lr - o.gap));
  return d(mill(g, (p, cx) => cx ? 0.25 : (p.y < top + 0.1 ? 0.5 : 0.125)));
};
ICONS.landmark = camera({ end: 0.67, lx: 13.17, ly: 12.67, lr: 2.33, gap: 1.17, win: true });

// Attraction: a Ferris wheel. Rim at the stroke, two posts crossed (four spokes) meeting in a pin,
// legs from the rim's band flaring into a footing.
const wheel = (o) => {
  const cx = 12, cy = o.cy, R = o.R, w = 1.5;
  const parts = [ring(cx, cy, R, w), disc(cx, cy, o.pin)];
  for (const a of o.spokes) { const r = R - w + 0.5, c = Math.cos(rad(a)) * r, s = Math.sin(rad(a)) * r; parts.push(post(cx - c, cy - s, cx + c, cy + s, 1.33)); }
  const foot = 17 - o.ft;
  for (const sgn of [-1, 1]) { const a = rad(90 - sgn * o.leg), r0 = o.fromHub ? 0 : R - w / 2, sx = cx + Math.cos(a) * r0, sy = cy + Math.sin(a) * r0;
    const t = (17.5 - sy) / Math.sin(a); parts.push(taper(sx, sy, sx + Math.cos(a) * t, sy + Math.sin(a) * t, 1.33, o.flare)); }
  parts.push(block(o.fx0, foot, o.fx1, 17));
  if (o.nubs) for (let i = 0; i < o.nubs; i++) { const a = rad(i * 360 / o.nubs + o.nubTurn); parts.push(disc(cx + Math.cos(a) * (R + 0.35), cy + Math.sin(a) * (R + 0.35), 0.75)); }
  let g = S(U(...parts), block(-5, 17, 30, 30));
  return d(mill(g, (p, cvx) => cvx ? 0.25 : (Math.abs(p.y - foot) < 0.3 ? 0.5 : (Math.hypot(p.x - cx, p.y - cy) > R - 0.2 ? 0.5 : 0.125))));
};
const WH = { cy: 10.67, R: 4.17, pin: 0.5, spokes: [45, 135], leg: 28, flare: 2, ft: 1, fx0: 6.67, fx1: 17.33 };
// The A-frame is the crossed spokes carried on past the rim to the ground: four spokes, one line each way.
ICONS.attraction = wheel({ ...WH, spokes: [60, 120], leg: 30, flare: 1.33 });
ICONS['attraction@rimPlus'] = wheel({ ...WH, spokes: [0, 90], leg: 35, flare: 1.33 });

// Venue: a stage curtain. The rail runs past the drapes; each drape curves from the middle to its tie,
// where it gathers under a knob that stands proud of the fall, and the fall flares to the floor.
const curtain = (o) => {
  const top = 9.33, bot = 17, x0 = o.x0, tY = o.tieY, wx = o.waist;
  const L = pth([x0, top]); L.lineTo([11.5, top]);
  L.cubicCurveTo(Pt(11.5, top + 2.2), Pt(wx + 0.8, tY - 0.9), Pt(wx, tY));
  L.cubicCurveTo(Pt(wx + 0.1, tY + 1.2), Pt(o.foot - 0.1, bot - 1.4), Pt(o.foot, bot));
  L.lineTo([x0 - o.hem, bot]); L.cubicCurveTo(Pt(x0 - o.hem * 0.4, bot - 1.6), Pt(x0, tY + 0.6), Pt(x0, tY)); L.lineTo([x0, top]);
  let left = L;
  if (o.knob) left = U(L, H.mill(block(x0 - (o.knobOut || 0), tY - o.kh / 2, wx + o.knob, tY + o.kh / 2), () => o.kr));
  const right = left.clone({ insert: false }); right.scale(-1, 1, Pt(12, 12));
  const g = U(left, right, block(7, 7, 17, 8.33));
  return d(mill(g, (p, cx) => cx ? 0.25 : 0.125));
};
const CU = { x0: 7.67, tieY: 13.33, waist: 9.33, foot: 10.33, hem: 0.33, knob: 1, knobOut: 0.33, kh: 1.33, kr: 0.5 };
ICONS.venue = curtain({ ...CU, knobOut: 0, kh: 1.33, kr: 0.6, knob: 1 });

// Hotel: a bed. Headboard post with a domed top, a mattress with eased ends, the foot post filleted
// under it, a soft pillow resting on the mattress.
{
  const head = U(block(6.67, 9, 8, 16.67), disc(7.33, 9, 0.67));
  const mattress = block(8, 12.33, 17.33, 14.67);
  const foot = block(16, 14.67, 17.33, 16.67);
  const pillow = H.mill(block(9, 10.17, 12, 12.33 + 0.01), () => 0.9);
  const g = U(head, mattress, foot, pillow);
  ICONS.hotel = d(mill(g, (p, cx) => cx ? (p.x > 17 ? 0.67 : 0.25) : (p.y > 12 && p.y < 12.5 && p.x > 8.5 ? 0.25 : 0.5)));
}

// Shopping: a carrier bag. A narrow body, its base corners eased into a cap curve, a low handle at
// the stroke (wider than tall).
const bag = (o) => {
  const t = 1.5, x0 = 12 - o.bw / 2, x1 = 12 + o.bw / 2, top = o.top, bot = 17.33, r = o.br;
  const body = pth([x0, top]); body.lineTo([x1, top]); body.lineTo([x1, bot - r]);
  body.arcTo(Pt(x1 - r * 0.29, bot - r * 0.29 + o.sag * 0.2), Pt(x1 - r, bot)); // eased corner
  body.arcTo(Pt(12, bot + o.sag), Pt(x0 + r, bot));
  body.arcTo(Pt(x0 + r * 0.29, bot - r * 0.29 + o.sag * 0.2), Pt(x0, bot - r)); body.lineTo([x0, top]);
  const handle = S(oval(12, top, o.hw, o.hh), oval(12, top, o.hw - t, o.hh - t), block(-5, top, 30, 30));
  return d(mill(U(body, handle), (p, cx) => cx ? 0.25 : 0.5));
};
const bag2 = (o) => {
  const x0 = 12 - o.bw / 2, x1 = 12 + o.bw / 2, top = o.top, bot = o.bot || 17.33;
  const body = H.mill(poly([[x0 + o.taper, top], [x1 - o.taper, top], [x1, bot], [x0, bot]]), p => p.y > bot - 0.1 ? o.br : 0.01);
  let g = body;
  if (o.hw) g = U(g, S(oval(12, top, o.hw, o.hh), oval(12, top, o.hw - o.t, o.hh - o.t), block(-5, top, 30, 30)));
  if (o.slot) g = S(g, H.mill(block(12 - o.slot / 2, top + o.slotY, 12 + o.slot / 2, top + o.slotY + 1), () => 0.5));
  return d(mill(g, (p, cx) => cx ? (p.y > bot - 1.5 ? 0 : 0.25) : 0.5));
};
ICONS.shopping = bag2({ bw: 7.33, top: 11.33, br: 1, taper: 0.33, hw: 2.5, hh: 2.67, t: 1.33 });

// Park: a picnic table, end on. A full-weight top with a cap curve under it, legs splayed and filleted
// into it, the seat across them running past both.
const table = (o) => {
  const top = o.cap ? capDown(7.33, 16.67, 8.33, 1.67, o.cap) : block(7.33, 8.33, 16.67, 10.33);
  const legL = taper(10.5, 9.6, 8.33, 16.67, 1.33, o.flare), legR = taper(13.5, 9.6, 15.67, 16.67, 1.33, o.flare);
  const seat = block(6.33, 12.67, 17.67, 14);
  const g = S(U(top, legL, legR, seat), block(0, 16.67, 24, 24));
  return d(mill(g, (p, cx) => cx ? (p.y > 16 ? 0.125 : 0.25) : (p.y < 11 ? 0.5 : 0.125)));
};
ICONS.park = table({ cap: 0, flare: 1.33 });

// Neighbourhood: two houses. The museum's gable family: a roof that overhangs its walls, held over them
// with the 45-degree chamfer, short upright eave ends, a low-ish pitch; a door in each.
const house = (x0, x1, eb, base, pitch, door) => {
  const ov = 1 / 3, ee = 0.33, hw = (x1 - x0) / 2 + ov, cx = (x0 + x1) / 2, apex = eb - ee - hw * pitch;
  let h = poly([[x0, base], [x0, eb + ov], [x0 - ov, eb], [x0 - ov, eb - ee], [cx, apex], [x1 + ov, eb - ee], [x1 + ov, eb], [x1, eb + ov], [x1, base]]);
  if (door) h = S(h, block(cx - door / 2, base - 2, cx + door / 2, base + 1));
  return h;
};
const houses = (o) => {
  const g = U(house(7.67, 11.33, o.ebL, o.base, o.pitch, o.door), house(12.67, 16.33, o.ebR, o.base, o.pitch, o.door));
  if (o.s) g.scale(o.s, Pt(12, g.bounds.center.y));
  return d(mill(g, (p, cx, turn) => cx ? (turn > 80 && turn < 140 && p.y < 10 ? 0.3 : 0.25) : 0.125));
};
// The museum's own move: the roof a separate gable, a cut above its walls.
const house2 = (x0, x1, eb, base, pitch, door, cut, ov) => {
  const ee = 0.67, hw = (x1 - x0) / 2 + ov, cx = (x0 + x1) / 2, apex = eb - ee - hw * pitch;
  const roof = poly([[x0 - ov, eb], [x0 - ov, eb - ee], [cx, apex], [x1 + ov, eb - ee], [x1 + ov, eb]]);
  let walls = block(x0, eb + cut, x1, base);
  if (door) walls = S(walls, block(cx - door / 2, base - 2, cx + door / 2, base + 1));
  return U(roof, walls);
};
const housesB = (o) => {
  const g = U(house2(7.67, 11.33, o.ebL, o.base, o.pitch, o.door, o.cut, o.ov), house2(12.67, 16.33, o.ebR, o.base, o.pitch, o.door, o.cut, o.ov));
  if (o.s) g.scale(o.s, Pt(12, g.bounds.center.y));
  return d(mill(g, (p, cx, turn) => cx ? 0.25 : 0.125));
};
const HO = { ebL: 12, ebR: 11, base: 15.67, pitch: 0.9, door: 1.33, s: 1.12 };
ICONS.neighbourhood = houses(HO);

// Street: a walker, as on a crossing sign. A tapered torso leaning into the step; both arms straight,
// swinging opposite the legs, from one shoulder point inside the torso; head no wider than the shoulders.
const walker = (o) => {
  const head = disc(o.hx, o.hy, o.hr);
  const su = Pt(o.hip[0] - o.sh[0], o.hip[1] - o.sh[1]).normalize(o.tw / 2); // shoulders: a half round on the torso
  const torso = taper(o.sh[0] + su.x, o.sh[1] + su.y, o.hip[0], o.hip[1], o.tw, o.hw);
  const parts = [head, torso, (() => { const u = Pt(o.hip[0] - o.sh[0], o.hip[1] - o.sh[1]).normalize(o.tw / 2); return disc(o.sh[0] + u.x, o.sh[1] + u.y, o.tw / 2); })()];
  for (const l of o.limbs) parts.push(taper(l[0], l[1], l[2], l[3], l[4], l[5]));
  return d(mill(U(...parts), (p, cx) => cx ? (p.y < o.sh[1] + 0.3 && p.y > o.hy + o.hr ? 0.9 : 0.25) : 0.25));
};
const W = { hx: 13.17, hy: 7.17, hr: 1.08, sh: [12.83, 9.17], hip: [12, 13.17], tw: 2, hw: 1.67,
  limbs: [
    [12.6, 10.17, 14.83, 13, 1.5, 1.5],     // front arm, from inside the shoulder
    [12.6, 10.17, 10.5, 13, 1.5, 1.5],      // back arm
    [12.05, 12.83, 14.33, 17, 1.67, 1.67],    // front leg
    [11.95, 12.83, 9.67, 16.83, 1.67, 1.67],  // back leg
  ] };
ICONS.street = walker(W);
window.ICONS = ICONS;
