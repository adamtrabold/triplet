// PIXEL SHAPES (10-26, after v262 and v264). The owner, on the five marks he put on v262's iPhone row:
//   "this should be a shape not a line" (the saucer, the beam); "nothing should be this small" (the coupe's 3/4px band);
//   "i think of the counters as shapes. they can go to (or be shortened to) a whole pixel"; "it is a hard pixel number wide,
//   it should be the same hard pixel number tall" (the +). On v264: "the museum and coupe counters are reading as too small
//   now -- maybe they could go up to 2px? would the museum width need to account for that"; "the knife edge doesnt stick out
//   far enough to be visible ... adjust that somehow mathematically in the rules"; "the star is way too fucking big -- it would
//   never be in a circle. and the plus is never in a circle like that."
// Standing: "no i want the base grid to make great icons without extrawork" (no fitting pass); "keep the line weight";
// "nothing should go that thin" (no ink under the 1.5px line).
//
// THE RULES (PROP.px in proportions.js holds the numbers; this file is the root calls that follow them). Whole CSS px are the
// only positions sharp at both 2x (the 5K) and 3x (iPhone), so:
//   1. SHAPES ARE WHOLE PX. A solid part that is not the line (a slab: beam, plinth, saucer, foot; a mass; a cup) has its height
//      and width in whole px and its level and upright edges, and a curve's flat side and its extreme, on whole px.
//      A slab is 2px: the first whole px that is not thinner than the line.
//   2. THE LINE STAYS 1 1/2px (posts, walls, rims, stems, a loop's wall). It is the one width that can't be whole: one edge sits
//      on a whole px (the silhouette's side), the other on a half px: sharp at 2x, half a pixel soft on one side at 3x.
//   3. COUNTERS ARE WHOLE PX, AT LEAST 2px (the museum's openings, the coupe's band, the cup's ear): a counter is a shape.
//      GAPS (a cut between parts that rest on each other, the fork's tines apart) are whole px, at least 1px.
//   4. MINIMUM PART: no ink part under the line, 1 1/2px. A cap's ends are where its curve runs out, not a part: they keep the
//      cap rule (half the crown), so a 2px cap ends at 1px and its flat side, the ends' foot and the crown all land whole.
//   5. MINIMUM PROTRUSION: a feature that names the object by sticking out past its neighbour (the knife's edge past its handle,
//      a step, a lip) sticks out at least 1px, on whole px. Why 1: the join's own round (the post flare, 1/2px) eats the first
//      1/2px of any step, so a 1/2px step shows nothing and a 3/4px step shows 1/4px (half a device pixel at 2x: a grey smudge);
//      at 1px, 1/2px of straight step survives the round: a whole device pixel at 2x, 1 1/2 at 3x.
//   6. SYMMETRIC ICONS STAY ON THE BADGE'S CENTRE LINE. A part centred on it is even px wide to land whole (a 2px opening
//      lands 11..13); a 1 1/2px part centred on it can't (11.25..12.75), so where a design can, it puts a counter or a pair on
//      the centre line, not a single post.
//   7. LINE MARKS (the +, the star) are drawn at 1:1 in their real slot, not scaled from a 24 box, and sized by that slot and the
//      type beside them, not by the badge's coin (they never sit in a ring). The + is 14px across, its stroke 2px: the one
//      stroke near the line that centres on whole px both ways, so every end and edge lands whole (the owner's "hard pixel
//      number wide ... same hard pixel number tall").
//   node src/pixel-shapes.js [names]   -> svg/pixel-shapes/<name>.svg, svg/pixel-shapes/build.json
'use strict';
const fs = require('fs'), path = require('path');
process.env.TOOLS = process.env.TOOLS || '/tmp/claude-0/-home-user-la-trip-map/e88b6fb0-7c93-5435-a682-b10a85f40e06/scratchpad/tools';
const E = require('./engine.js');
const MC = require('./mix-curves.js');
const { ELL_ARC, CAP } = require('./picks7.js');
const { PROP } = require('./proportions.js');
const X = PROP.px;
const L = X.line, SLAB = X.slab, CNT = X.counter, GAP = X.gap, STEP = X.step;
const K = 0.5523, f = v => +v.toFixed(4);
const ink = (kind, prim, t) => ({ kind, t: t ?? (kind === 'slab' ? SLAB : kind === 'mass' ? 2 * L : L), prim });
const capOverFor = (h, end) => 1 / Math.sqrt(1 - (end / h) ** 2);   // a cap h tall whose ends are `end` tall
const arcD = (P, dx = 0) => `C${f(P[1][0] + dx)} ${f(P[1][1])} ${f(P[2][0] + dx)} ${f(P[2][1])} ${f(P[3][0] + dx)} ${f(P[3][1])}`;

// ---- CAFÉ: a cup (mass, square, its bottom one ellipse 4/5) with an ear (loop) on a saucer (a cap, flat on top)
function cafe(o = {}) {
  const top = o.top ?? 8, w = o.cupW ?? 6, l = o.cupL ?? 8, r = l + w, mid = (l + r) / 2, rx = w / 2, ry = PROP.ellipse.vessel * rx, bot = top + w, cy = bot - ry;
  const cup = ink('mass', E.D(`M${l} ${top}H${r}V${f(cy)}${arcD(ELL_ARC(mid, cy, rx, ry, 0, Math.PI / 2))}${arcD(ELL_ARC(mid, cy, rx, ry, Math.PI / 2, Math.PI))}Z`));
  // the ear: walls of the line round a counter CNT tall; its counter runs straight from the cup's wall (a slot) into a half circle
  const eh = 2 * L + CNT, R_ = eh / 2, slot = o.slot ?? 1, ex = r + slot, eR = ex + R_, eb = top + eh, ecy = top + R_;
  const ear = ink('loop', E.D(`M${r - 0.75} ${top}H${ex}C${f(ex + R_ * K)} ${top} ${eR} ${f(ecy - R_ * K)} ${eR} ${ecy}C${eR} ${f(ecy + R_ * K)} ${f(ex + R_ * K)} ${eb} ${ex} ${eb}H${r - 0.75}Z`));
  const ri = R_ - L, it = top + L, ib = eb - L;
  const hole = E.cut(E.D(`M${r - 0.01} ${it}H${ex}C${f(ex + ri * K)} ${it} ${ex + ri} ${f(ecy - ri * K)} ${ex + ri} ${ecy}C${ex + ri} ${f(ecy + ri * K)} ${f(ex + ri * K)} ${ib} ${ex} ${ib}H${r - 0.01}Z`));
  // the saucer: a CAP, flat on top a cut below the cup, SLAB tall at its crown, its ends half that (rule 4)
  const sy = bot + GAP, sw = o.saucerW ?? 11, sx = o.saucerL ?? 6;
  const saucer = ink('slab', CAP(sx, sx + sw, sy, SLAB, { root: 'ellipse', ry: 1, over: capOverFor(SLAB, X.capEnd) }, false));
  return { roots: [cup, ear, saucer], cuts: [hole] };
}

// ---- BAR: the coupe. A vessel (one ellipse 4/5, the rim cutting it) with a clear band under the rim, on a post stem and a cap foot
function bar(o = {}) {
  const c = 12, hw = o.hw ?? 5, rx = hw, ry = PROP.ellipse.vessel * rx, rimTop = o.rimTop ?? 8, depth = o.depth ?? 5;
  const cy = rimTop + depth - ry, ya = Math.asin(Math.max(-1, (rimTop - cy) / ry)), a = -ya;   // ellipse angle of the rim cut (y down)
  const ang = y => Math.asin((y - cy) / ry);   // parametric angle on the right side for a y
  const rimX = rx * Math.cos(ang(rimTop));
  const P_ = (a0, a1) => ELL_ARC(c, cy, rx, ry, a0, a1);
  const a0 = ang(rimTop), mR = (a0 + Math.PI / 2) / 2, mL = Math.PI - mR;
  const bowl = ink('mass', E.D(`M${f(c - rimX)} ${rimTop}H${f(c + rimX)}${arcD(P_(a0, mR))}${arcD(P_(mR, Math.PI / 2))}${arcD(P_(Math.PI / 2, mL))}${arcD(P_(mL, Math.PI - a0))}Z`));
  // the band: the bowl's own side between the band's top and bottom, moved in by the line (the owner's counter-follows-outside)
  const bT = rimTop + L, bB = bT + (o.band ?? CNT);
  const t0 = ang(bT), t1 = ang(bB), R0 = P_(t0, t1), Lp = ELL_ARC(c, cy, rx, ry, Math.PI - t1, Math.PI - t0);
  const band = E.cut(E.D(`M${f(R0[0][0] - L)} ${f(R0[0][1])}${arcD(R0, -L)}H${f(Lp[0][0] + L)}${arcD(Lp, L)}Z`));
  const bb = rimTop + depth, stemW = o.stemW ?? L, ft = bb + (o.stemShow ?? 2), fh = SLAB, fw = o.footW ?? 8;
  const stem = ink('post', E.R(c - stemW / 2, bb - 0.5, stemW, ft - bb + 1), stemW);
  const foot = ink('slab', CAP(c - fw / 2, c + fw / 2, ft + fh, fh, { root: 'ellipse', ry: 1, over: capOverFor(fh, X.capEnd) }, true));
  return { roots: [bowl, stem, foot], cuts: [band], sym: c };
}

// ---- MUSEUM: a gable resting on a beam (a cut between), posts holding the beam, on a plinth. Posts the line, openings CNT,
// beam and plinth SLAB, the beam and plinth passing the outer posts by STEP with the capital (joins.heldSlab: the bevel).
function museum(o = {}) {
  const n = o.cols ?? 4, pw = o.postW ?? L, op = o.open ?? CNT, colW = n * pw + (n - 1) * op, c = 12 + (o.dx ?? 0), xa = c - colW / 2, xb = c + colW / 2;
  const over = o.over ?? STEP, bL = xa - over, bR = xb + over, oh = o.openH ?? 3, base = o.base ?? 18;
  const plT = base - SLAB, ct = plT - oh, bt = ct - SLAB, gb = bt - GAP, ge = PROP.line.gableEnd * L, ap = gb - ge - PROP.museum.pitch * (bR - bL) / 2;
  const roots = [ink('slab', E.P([bL, gb], [bL, gb - ge], [c, ap], [bR, gb - ge], [bR, gb]))];
  const held = (yFar, yNear) => require('./joins.js').heldSlab({ x0: bL, x1: bR, yFar, yNear, left: { x: xa, w: pw, over }, right: { x: xb, w: pw, over }, dp: STEP, fr: STEP, k: PROP.joins.k });
  roots.push(ink('slab', held(bt, ct)), ink('slab', held(base, plT)));
  for (let i = 0; i < n; i++) roots.push(ink('post', E.R(xa + i * (pw + op), ct - 0.01, pw, oh + 0.02), pw));
  return { roots, cuts: [], sym: c, meta: { cols: n, width: bR - bL, height: base - ap, colonnade: colW } };
}

// ---- RESTAURANT: the fork (three tines into a half-ellipse head, a post handle) and the knife (a quarter-ellipse blade on a post)
function restaurant(o = {}) {
  const post = L, gap = o.tineGap ?? GAP, cutW = o.cut ?? GAP, top = o.top ?? 7, bot = o.bot ?? 18, fw = 3 * post + 2 * gap;
  const prot = o.protrude ?? X.protrude, kw = post + prot;
  const x0 = o.x0 ?? Math.round(12 - (fw + cutW + kw) / 2), fcx = x0 + fw / 2, hc = top + 3.0, roots = [];
  for (let i = 0; i < 3; i++) { const x = x0 + i * (post + gap); roots.push(ink('post', E.R(x, top, post, hc - 0.1 - top))); }
  { const rx = fw / 2, ry = 1.05 * rx; roots.push(ink('mass', E.D(`M${fcx - rx} ${hc - 0.3}V${hc}C${fcx - rx} ${f(hc + ry * K)} ${f(fcx - rx * K)} ${f(hc + ry)} ${fcx} ${f(hc + ry)}C${f(fcx + rx * K)} ${f(hc + ry)} ${fcx + rx} ${f(hc + ry * K)} ${fcx + rx} ${hc}V${hc - 0.3}Z`))); }
  { const hb = hc + 1.05 * fw / 2 - 0.4; roots.push(ink('post', E.R(fcx - post / 2, hb, post, bot - hb))); }
  const ks = x0 + fw + cutW, ke = top + 6, ry = ke - top;
  roots.push(ink('mass', E.D(`M${ks} ${top}C${f(ks + kw * K)} ${top} ${ks + kw} ${f(ke - ry * K)} ${ks + kw} ${ke}H${ks}Z`)));
  roots.push(ink('post', E.R(ks, ke - 0.2, post, bot - ke + 0.2)));
  return { roots, cuts: [], meta: { protrude: prot, tineGap: gap } };
}

// ---- LINE MARKS at 1:1 (rule 7), in a 24px frame centred on (12, 12); shown cropped to their slot, centred
const { fromTable } = require('./laws7.js');
const LINE_LAW = fromTable(PROP.rounds.line), EASE = 2.3;
const JOIN10 = { ease: EASE, trim: 1.4, ends2: 1.5, fair: true, hillKeep: 'depth', tipKeep: 'crest', tipLand: true, tipPow: 1, tipSoft: PROP.transition.tipSoft, noReverse: true, maxPieces: 2, arcEase: true, arcRamp: 0.3, flareLean: PROP.transition.flareLean };
function plusMark(o = {}) {
  // o.off: the strokes sit that far right and down of the arms' centre. A 1 1/2px stroke can't be centred on arms whose ends
  // are whole (its centre is always k + 1/4 or k + 3/4), so at off 1/4 its edges land at 11.5 and 13: one whole, one half, like
  // every line; the cost is half a px between the arms (the left and top arms 6 1/2, the right and bottom 6)
  const s = o.span ?? X.mark.plus.span, w = o.stroke ?? X.mark.plus.stroke, a = 12 - s / 2, b = 12 - w / 2 + (o.off ?? 0);
  return E.build([E.R(b, a, w, s), E.R(a, b, s, w)], { law: LINE_LAW, ease: EASE, join: JOIN10 }).d;
}
// the star: the approved star (STAR.ri, its counter the star itself made smaller, a wall of the line), sized so its tip-to-feet
// height is o.h px on screen; returns its outline and measured size
function starMark(o = {}) {
  const P7 = require('./picks7.js'), { measure } = require('./optics.js');
  const mk = sc => E.build(P7.star(24, sc, L, 'root'), { law: LINE_LAW, ease: EASE, tightHoles: true, join: JOIN10 }).d;
  // the height is linear in the size (the line and the rounds are fixed px), so two builds give the size and a third confirms it
  const hAt = sc => { const m_ = measure(mk(sc)); return m_.box.y1 - m_.box.y0; }, h0 = hAt(0.6), h1 = hAt(0.9), sc = 0.6 + (o.h - h0) * 0.3 / (h1 - h0);
  const d = mk(sc), m = measure(d), lo = sc, hi = sc;
  // land the top tip on a whole px (the star has no straight edges; its height is the one core length) and centre it optically
  const dy = Math.round(m.box.y0) - m.box.y0, sh = s => s.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (q, x, y) => `${x} ${(+y + dy).toFixed(5)}`);
  return { d: sh(d), w: m.box.x1 - m.box.x0, h: m.box.y1 - m.box.y0, sc: (lo + hi) / 2 };
}
const ICONS = { cafe, bar, museum, restaurant };
function build(name, o = {}) {
  const key = `px_${name}_${Math.random().toString(36).slice(2)}`;
  const icon = ICONS[name](o);
  MC.ICONS[key] = () => icon;
  const r = MC.buildIcon(key);
  delete MC.ICONS[key];
  return { d: r.d, meta: icon.meta || {} };
}
module.exports = { build, ICONS, plusMark, starMark };
if (require.main === module) {
  const VAR = JSON.parse(process.env.VARIANTS || '{}');
  const out = process.env.OUT || path.join(__dirname, '..', 'svg', 'pixel-shapes');
  fs.mkdirSync(out, { recursive: true });
  const jf = path.join(out, 'build.json'), all = fs.existsSync(jf) ? JSON.parse(fs.readFileSync(jf, 'utf8')) : {};
  const names = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(VAR).length ? Object.keys(VAR) : Object.keys(ICONS);
  for (const n of names) {
    const [base, opts] = VAR[n] ? [VAR[n].icon, VAR[n].o] : [n, {}];
    const t0 = Date.now(), r = build(base, opts);
    all[n] = { icon: base, o: opts, d: r.d, meta: r.meta };
    fs.writeFileSync(path.join(out, `${n}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill-rule="evenodd" d="${r.d}"/></svg>\n`);
    fs.writeFileSync(jf, JSON.stringify(all, null, 1));
    console.log(n, `${((Date.now() - t0) / 1000).toFixed(0)}s`, JSON.stringify(r.meta));
  }
}
