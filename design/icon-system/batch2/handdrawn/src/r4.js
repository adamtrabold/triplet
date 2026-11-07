// r4.js — round 4 options (after the owner's notes, 2026-11-07). Loaded after icons.js; every key is a
// variant ('<icon>@r4-<name>'), so nothing here overwrites ../18 until the owner picks.
// Draws: camera "Look at the order in which you do things" / road signs; curtain "Use fewer notes" / circus
// posters; houses "Turn it upside down" / stamps; bag "Discard an axiom" / origami; wheel "Infinitesimal
// gradations" / typography; walker "Use an old idea" / typography.
{
const { block, poly, disc, oval, post, ring, U, S, mill, d } = H;
const R4 = {};
const ROUND = (cxR = 0.25, ccR = 0.125) => (p, cx) => cx ? cxR : ccR;
const cap = (x0, x1, yb, h, r = 0.5) => H.mill(block(x0, yb - h, x1, yb + 0.3), p => p.y < yb - h + 0.1 ? r : 0.01);

// ── Camera: vintage. Lens first (the order): every option is built round a big lens.
// A. Rangefinder: a flat body, two knobs on top, the two rangefinder windows, the lens in the middle.
{
  const top = 10, bot = 15.67;
  let g = U(H.mill(block(7, top, 17, bot), () => 0.5), cap(7.67, 9.33, top + 0.1, 1.17, 0.5), cap(14.67, 16.33, top + 0.1, 1.17, 0.5));
  g = S(g, disc(12, 12.83, 2.33), block(7.83, 10.83, 9.17, 11.83), block(14.83, 10.83, 16.17, 11.83));
  g = U(g, disc(12, 12.83, 1.25));
  R4['landmark@r4-rangefinder'] = d(mill(g, ROUND(0.25, 0.125)));
}
// B. Twin-lens reflex: a tall box, the folding hood on top, a viewing lens over the taking lens.
{
  let g = U(H.mill(block(8.33, 8.67, 15.67, 17), () => 0.5), poly([[9.17, 8.8], [9.67, 7.33], [14.33, 7.33], [14.83, 8.8]]));
  g = S(g, disc(12, 11.33, 1.5), disc(12, 14.67, 1.67));
  g = U(g, disc(12, 14.67, 0.75));
  R4['landmark@r4-tlr'] = d(mill(g, ROUND(0.25, 0.125)));
}
// C. Film SLR: the prism in the middle over the lens, a knob each side of it.
{
  const top = 10.33, bot = 15.67;
  let g = U(H.mill(block(7, top, 17, bot), () => 0.5), poly([[9.67, top + 0.3], [10.67, 8.33], [13.33, 8.33], [14.33, top + 0.3]]),
    cap(7.67, 9, top + 0.1, 0.83, 0.4), cap(15, 16.33, top + 0.1, 0.83, 0.4));
  g = S(g, disc(12, 13, 2.17));
  g = U(g, disc(12, 13, 1.17));
  R4['landmark@r4-slr'] = d(mill(g, ROUND(0.25, 0.125)));
}

// ── Curtain: must read as a curtain. Circus posters: the swagged valance and the tied drape.
const drape = (x0, top, bot, inner, tY, wx, foot, hem, knob) => {
  const L = new paper.Path({ insert: false, closed: true, segments: [[x0, top]] }); L.lineTo([inner, top]);
  L.cubicCurveTo(new paper.Point(inner, top + 2), new paper.Point(wx + 0.8, tY - 0.9), new paper.Point(wx, tY));
  L.cubicCurveTo(new paper.Point(wx + 0.1, tY + 1.2), new paper.Point(foot - 0.1, bot - 1.4), new paper.Point(foot, bot));
  L.lineTo([x0 - hem, bot]); L.cubicCurveTo(new paper.Point(x0 - hem * 0.4, bot - 1.6), new paper.Point(x0, tY + 0.6), new paper.Point(x0, tY)); L.lineTo([x0, top]);
  return knob ? U(L, poly([[x0, tY - 0.67], [wx + 1, tY - 0.67], [wx + 1, tY + 0.1], [wx + 0.25, tY + 1.67], [x0, tY + 1.67]])) : L;
};
const mirror = p => { const q = p.clone({ insert: false }); q.scale(-1, 1, new paper.Point(12, 12)); return q; };
// A. Swagged valance: three swags hang from the rail over two drapes tied back.
{
  const rail = block(7, 7, 17, 7.83);
  const swags = [8.67, 12, 15.33].map(x => S(oval(x, 7.83, 1.67, 1.5), block(0, 0, 24, 7.83)));
  const L = drape(7.67, 10.17, 17, 11.33, 13.67, 9.33, 10.33, 0.33, true);
  const g = U(rail, ...swags, L, mirror(L));
  R4['venue@r4-swags'] = d(mill(g, ROUND(0.25, 0.125)));
}
// B. Pleated: the same drapes with a pleat cut down each one, the rail on round finials.
{
  const rail = U(block(7.5, 7.33, 16.5, 8.33), disc(7.17, 7.83, 0.83), disc(16.83, 7.83, 0.83));
  let L = drape(7.67, 9.33, 17, 11.5, 13.33, 9.33, 10.33, 0.33, true);
  L = S(L, H.mill(block(9.33, 10.33, 10, 12.67), () => 0.3), H.mill(block(8.67, 15, 9.33, 18), () => 0.3));
  const g = U(rail, L, mirror(L));
  R4['venue@r4-pleats'] = d(mill(g, ROUND(0.25, 0.125)));
}
// C. Both cues together: the swagged valance over pleated drapes (the circus poster's proscenium).
{
  const rail = block(7, 7, 17, 7.83);
  const swags = [8.67, 12, 15.33].map(x => S(oval(x, 7.83, 1.67, 1.5), block(0, 0, 24, 7.83)));
  let L = drape(7.67, 10.17, 17, 11.33, 13.67, 9.33, 10.33, 0.33, true);
  L = S(L, H.mill(block(9.17, 11, 9.83, 12.83), () => 0.3), H.mill(block(8.67, 15.33, 9.33, 18), () => 0.3));
  const g = U(rail, ...swags, L, mirror(L));
  R4['venue@r4-swagpleats'] = d(mill(g, ROUND(0.25, 0.125)));
}

// ── Houses: one house that says "house". Stamps: a single subject, framed; upside down: the detail at
// the ground, not the roof.
const house = (x0, x1, eb, base, pitch, door, chim) => {
  const ov = 1 / 3, ee = 0.33, hw = (x1 - x0) / 2 + ov, cx = (x0 + x1) / 2, apex = eb - ee - hw * pitch;
  let h = poly([[x0, base], [x0, eb + ov], [x0 - ov, eb], [x0 - ov, eb - ee], [cx, apex], [x1 + ov, eb - ee], [x1 + ov, eb], [x1, eb + ov], [x1, base]]);
  if (chim) h = U(h, block(chim[0], chim[1], chim[0] + chim[2], eb - 1));
  if (door) h = S(h, block(cx - door[0] / 2 + (door[2] || 0), base - door[1], cx + door[0] / 2 + (door[2] || 0), base + 1));
  return h;
};
const picket = (x, top, base, w = 1) => poly([[x, base], [x, top + w / 2], [x + w / 2, top], [x + w, top + w / 2], [x + w, base]]);
// A. One house, left of centre, a picket fence running off to its right (three pickets on a rail).
{
  const base = 16.33;
  const h = house(7.67, 12.33, 12, base, 0.9, [1.33, 2], null);
  const fence = U(...[13.33, 15, 16.67].map(x => picket(x, 13.17, base, 1.17)), block(13.33, 14.33, 17.83, 15));
  const g = U(h, fence); g.translate(-0.5, 0);
  R4['neighbourhood@r4-fence'] = d(mill(g, (p, cx, t) => cx ? (t > 80 && p.y < 13.6 && p.x > 12.5 ? 0.2 : 0.25) : 0.125));
}
// B. One house, big in the diamond: a chimney and a door set off centre.
{
  const g = house(8.67, 15.33, 12, 16.33, 0.8, [1.67, 2.33, -1.17], [13.67, 8.67, 1.33]);
  R4['neighbourhood@r4-chimney'] = d(mill(g, ROUND(0.25, 0.125)));
}
// C. One house behind a low fence across its front: four pickets on a rail, a cut clear of the walls.
{
  const base = 16.33;
  const h = house(8.67, 15.33, 11.33, base - 0.01, 0.8, null, [13.67, 8, 1.33]);
  const xs = [8.5, 10.83, 13.17, 15.5];
  const fence = U(...xs.map(x => picket(x - 0.58, 13.33, base, 1.17)), block(7.67, 14.5, 16.33, 15.17));
  const halo = U(...xs.map(x => picket(x - 1.25, 12.67, base + 1, 2.5)), block(7, 13.83, 17, 16));
  const g = U(S(h, halo), fence);
  R4['neighbourhood@r4-frontfence'] = d(mill(g, (p, cx, t) => cx ? 0.2 : 0.125));
}

// ── Bag: the og's cues (a body wider at the top, a narrow U handle with straight legs going into it),
// in this set's finish. Discard an axiom: the handle needn't stand on the face; origami: folds.
const bagBody = (tw, bw, top, bot = 17.33) => H.mill(poly([[12 - tw / 2, top], [12 + tw / 2, top], [12 + bw / 2, bot], [12 - bw / 2, bot]]), p => p.y > bot - 0.1 ? 0.67 : 0.25);
const uHandle = (w, top, legBot, t, square) => {
  const x0 = 12 - w / 2, x1 = 12 + w / 2;
  if (square) return S(H.mill(block(x0, top, x1, legBot), p => p.y < top + 0.1 ? 0.6 : 0.01), H.mill(block(x0 + t, top + t, x1 - t, legBot + 1), p => p.y < top + t + 0.1 ? 0.2 : 0.01));
  const r = w / 2; return S(U(disc(12, top + r, r), block(x0, top + r, x1, legBot)), U(disc(12, top + r, r - t), block(x0 + t, top + r, x1 - t, legBot + 1)));
};
// A. The og, redrawn: a round U, half the body wide, its legs running into the top.
{
  const g = U(bagBody(8, 6.67, 10.67), uHandle(4, 7, 10.8, 1.17));
  R4['shopping@r4-og'] = d(mill(g, (p, cx) => cx ? 0.25 : 0.25));
}
// B. The carrier bag's square handle (the 2026 concept: "a round handle = padlock").
{
  const g = U(bagBody(8, 6.67, 10.67), uHandle(4.33, 7.67, 10.8, 1.17, true));
  R4['shopping@r4-square'] = d(mill(g, (p, cx) => cx ? 0.25 : 0.25));
}
// C. Origami: the round U, and the bag's side folds cut as two small darts at the top corners.
{
  let g = U(bagBody(8, 6.67, 10.67), uHandle(4, 7, 10.8, 1.17));
  for (const s of [-1, 1]) { const x = 12 + s * 4; g = S(g, poly([[x + s * 0.2, 10.5], [x - s * 0.9, 10.5], [x + s * 0.1, 12.67]])); }
  R4['shopping@r4-folds'] = d(mill(g, (p, cx) => cx ? 0.25 : 0.125));
}

// ── Wheel. What makes a Ferris wheel read (notes.md): necessary — a big round rim, the A-frame legs to the
// ground, the cabins round the rim; nice to have — spokes, a hub, a footing; not needed — the count of
// cabins, lights, bracing, a platform. So: cabins first, spokes optional.
const legsFoot = (cx, cy, ang, foot = 16.17) => {
  const ps = [];
  for (const s of [-1, 1]) { const a = (90 - s * ang) * Math.PI / 180, t = (17.5 - cy) / Math.sin(a); ps.push(post(cx, cy, cx + Math.cos(a) * t, cy + Math.sin(a) * t, 1.33)); }
  ps.push(block(7.33, foot, 16.67, 17)); return ps;
};
// The legs stand behind the wheel: they start at the rim's outer edge, never through it (through it, the
// A in the O reads as a sign).
const wheelR4 = (o) => {
  const cx = 12, cy = o.cy, R = o.R;
  const parts = [ring(cx, cy, R, o.w), disc(cx, cy, o.hub)];
  for (const s of [-1, 1]) { const a = (90 - s * o.leg) * Math.PI / 180, r0 = R - o.w / 2, sx = cx + Math.cos(a) * r0, sy = cy + Math.sin(a) * r0, t = (17.5 - sy) / Math.sin(a);
    parts.push(post(sx, sy, sx + Math.cos(a) * t, sy + Math.sin(a) * t, 1.33)); }
  parts.push(block(7.33, 16.17, 16.67, 17));
  for (let i = 0; i < (o.spokes || 0); i++) { const a = (i * 180 / o.spokes + 90) * Math.PI / 180, r = R - o.w + 0.2; parts.push(post(cx - Math.cos(a) * r, cy - Math.sin(a) * r, cx + Math.cos(a) * r, cy + Math.sin(a) * r, o.sw)); }
  for (let i = 0; i < o.cabins; i++) { const a = (i * 360 / o.cabins + (o.turn || 0) - 90) * Math.PI / 180, px = cx + Math.cos(a) * (R + o.off), py = cy + Math.sin(a) * (R + o.off);
    parts.push(o.hang ? U(post(px, py - 0.4, px, py + 0.4, 0.67), H.mill(block(px - o.cs / 2, py + 0.2, px + o.cs / 2, py + 0.2 + o.cs), () => 0.4)) : H.mill(block(px - o.cs / 2, py - o.cs / 2, px + o.cs / 2, py + o.cs / 2), () => 0.4)); }
  return d(mill(S(U(...parts), block(-5, 17, 30, 30)), (p, c) => c ? 0.25 : 0.2));
};
// A. Spokes, no cabins: six fine spokes and the hub (the bicycle-wheel read), the legs behind. (Eight cabins sat on the rim read as a gear: dropped.)
R4['attraction@r4-finespokes'] = wheelR4({ cy: 10.67, R: 3.83, w: 1.33, hub: 0.83, leg: 30, spokes: 3, sw: 0.67, cabins: 0 });
// B. The full picture, rule broken on purpose: six fine spokes, the hub, six cabins hung outside the rim.
R4['attraction@r4-spokes'] = wheelR4({ cy: 10.5, R: 3.5, w: 1.17, hub: 0.83, leg: 30, spokes: 3, sw: 0.67, cabins: 6, cs: 1.17, off: 0.5, hang: true, turn: 0 });
// C. Cabins, no spokes: six cabins hung outside the rim, a hub, the legs behind.
R4['attraction@r4-cabins'] = wheelR4({ cy: 10.5, R: 3.5, w: 1.33, hub: 1, leg: 30, cabins: 6, cs: 1.17, off: 0.5, hang: true, turn: 0 });

// ── Walker: an old idea — the 1972 Munich figures (limbs only at 45 and 90 degrees, made by a tool);
// typography — limbs as strokes with contrast; and a short-stride figure with a bigger head.
const fig = (parts, hands = []) => d(mill(U(...parts), (p, c) => c ? (hands.some(h => h.getDistance(p) < 0.9) ? 0.5 : 0.25) : 0.3));
// A. Square-cut (the Munich figures): an upright torso, the arms at 45, the legs at 30, ends square.
{
  const parts = [disc(12, 7.17, 1.17), H.mill(block(11, 9, 13, 13.67), p => p.y < 9.4 ? 0.9 : 0.01),
    post(12, 10, 14.33, 12.33, 1.5), post(12, 10, 9.67, 12.33, 1.5),
    post(12.2, 13.17, 14.33, 17, 1.67), post(11.8, 13.17, 9.67, 17, 1.67)];
  R4['street@r4-munich'] = fig(parts, [Pt(14.33, 12.33), Pt(9.67, 12.33)]);
}
// B. Contrast: limbs flare from the body (thick at the joint, thin at hand and foot), the torso leaning,
// the front knee bent; every join filleted.
{
  const parts = [disc(13.33, 7.17, 1.17), taper(12.9, 9.5, 12, 13.17, 2.17, 1.67), disc(12.9, 9.83, 1.08),
    taper(12.75, 10.17, 14.83, 12.67, 1.83, 1.17), taper(12.6, 10.17, 10.17, 12.5, 1.83, 1.17),
    taper(12.1, 12.83, 13.5, 14.83, 2, 1.67), taper(13.5, 14.83, 14.17, 17, 1.67, 1.5), disc(13.5, 14.83, 0.83),
    taper(11.9, 12.83, 9.5, 17, 2, 1.5)];
  R4['street@r4-flare'] = fig(parts, [Pt(14.83, 12.67), Pt(10.17, 12.5)]);
}
// C. A bigger head, a shorter body and a short brisk stride; the arms short and close.
{
  const parts = [disc(12.67, 7.67, 1.5), taper(12.33, 10.33, 11.83, 13.67, 2.17, 1.83), disc(12.33, 10.5, 1.08),
    post(12.33, 10.83, 14, 13, 1.5), post(12.2, 10.83, 10.67, 13.17, 1.5),
    post(12, 13.33, 13.83, 17, 1.67), post(11.67, 13.33, 9.83, 17, 1.67)];
  R4['street@r4-bighead'] = fig(parts, [Pt(14, 13), Pt(10.67, 13.17)]);
}
Object.assign(ICONS, R4);
window.R4KEYS = Object.keys(R4);
}
