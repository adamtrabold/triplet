// g7aw THE ROOTS AUDIT (owner on v233: "an icon should have root shapes at its core that are then connected / disconnected to
// create the greater form. I'm realizing not all pieces have clear root shapes they are derived from"; on finding #2: "Yeah I
// want it all defined by the shapes and proportions not stroke logic", "I mean it shouldn't change anything should it?").
// For every drawn curve in the six: how far it sits from the nearest root (circle or ellipse) through the same ends, in px at
// 24 and at 72. And for the counters redefined as root shapes: how far the new hole is from the old one.
//   node roots-audit.js   -> svg/g7/roots-audit.json
'use strict';
const fs = require('fs'), path = require('path');
const E = require('./engine.js'), P7 = require('./picks7.js');
const { LAWS7, scaled } = require('./laws7.js');
const paper = require(path.join(process.env.TOOLS || '/tmp/claude-0/-home-user-la-trip-map/04f8fb34-0476-5960-add5-8bd3d6d8820e/scratchpad/tools', 'node_modules/paper/dist/paper-core.js'));
const bz = (P, t) => [0, 1].map(i => (1 - t) ** 3 * P[0][i] + 3 * t * (1 - t) ** 2 * P[1][i] + 3 * t * t * (1 - t) * P[2][i] + t ** 3 * P[3][i]);
const qz = (P, t) => [0, 1].map(i => (1 - t) ** 2 * P[0][i] + 2 * t * (1 - t) * P[1][i] + t * t * P[2][i]);
const samp = (fn, n = 400) => Array.from({ length: n + 1 }, (_, k) => fn(k / n));
const gap = (A, B) => Math.max(...A.map(p => Math.min(...B.map(q => Math.hypot(p[0] - q[0], p[1] - q[1])))));
const ell = (cx, cy, rx, ry, a0, a1) => samp(t => { const a = a0 + (a1 - a0) * t; return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]; }, 800);
const arcThrough = (x0, x1, yEnd, sag, down) => { const hw = (x1 - x0) / 2, R = (hw * hw + sag * sag) / (2 * sag), xc = (x0 + x1) / 2; return samp(t => { const x = x0 + (x1 - x0) * t, dy = R - Math.sqrt(R * R - (x - xc) ** 2); return [x, down ? yEnd + sag - dy : yEnd - sag + dy]; }, 800); };
// drawing units (the 12 box) -> px at the 24 badge: the drawing's size s / 12 (from svg/g7/construction.json)
const J = JSON.parse(fs.readFileSync(path.join(__dirname, '../svg/g7/construction.json'), 'utf8')), px = id => J[id].s / 12;
const V = P7.VESSEL_SIDE, bd = 5.5;   // the row's coupe: COUPE_B's depth, the vessel side rule's handles
const rows = [];
const add = (icon, piece, root, d, k, note) => rows.push({ icon, piece, root, units: d, px24: d * k, px72: d * k * 3, note });
// the cup's body: its bottom corner (wall foot to bottom middle), picks7 cafe: one cubic, handles 2.17 down and 1.25 in
{ const r = 8.25, mid = 4.875, w = 4.667, b = 8; add('cup', 'body (v234, replaced): the bottom corners', 'quarter ellipse', gap(samp(t => bz([[r, w], [r, b - 1.167], [r - 1.25, b], [mid, b]], t)), ell(mid, w, r - mid, b - w, 0, Math.PI / 2)), px('cafe'), 'squarer than the ellipse'); }
// the coupe's bowl: rim to bottom middle, the vessel side rule
{ add('coupe', 'bowl (v234, replaced): its sides', 'half ellipse', gap(samp(t => bz([[11.75, 0], [11.75 - V.lean, V.bk * bd], [12 - V.bx, bd], [6, bd]], t)), ell(6, 0, 5.75, bd, 0, Math.PI / 2)), px('bar'), 'squarer than the ellipse'); }
// v233's plate and foot: one cubic each, handles at 3/10 and 7/10, 1/2 of rise
{ add('cup', 'plate (v233): its underside', 'circle arc', gap(samp(t => bz([[12, 1], [8.4, 1.5 + 0.5 / 3], [3.6, 1.5 + 0.5 / 3], [0, 1]], t)), arcThrough(0, 12, 1, 0.5, true)), px('cafe'), 'one arc to the eye; its ends drew their own rounds'); }
{ add('coupe', 'foot (v233): its top', 'circle arc', gap(samp(t => bz([[2, 0.5], [4.4, -1 / 6], [7.6, -1 / 6], [10, 0.5]], t)), arcThrough(2, 10, 0.5, 0.5, false)), px('bar'), 'one arc to the eye; its ends drew their own rounds'); }
// the tree: a tier's underside (two quadratics, controls at 0.45 of the half width) and its sides (a bow of 0.2 line)
{ const hw = 4.67, dr = 0.75; add('tree', 'tiers: the drooping underside', 'circle arc', gap(samp(t => qz([[hw, 0], [hw * 0.45, -dr], [0, -dr]], t)), samp(t => { const R = (hw * hw + dr * dr) / (2 * dr), x = hw * t; return [x, -dr + R - Math.sqrt(R * R - x * x)]; }, 800)), px('nature'), 'near'); }
{ const L = 6, b = 0.3; add('tree', 'tiers: the swept sides', 'circle arc', gap(samp(t => qz([[0, 0], [L / 2, 2 * b], [L, 0]], t)), samp(t => { const R = (L * L / 4 + b * b) / (2 * b), x = L * t; return [x, -R + b + Math.sqrt(R * R - (x - L / 2) ** 2)]; }, 800)), px('nature'), 'near'); }
// the museum's capital and foot flares: beam end to post, picks7 structMuseum (cap / foot: drop 1/2, flare 1/2, k 1/2)
{ const bo = 0.5, dp = 0.5, fr = 0.5, k = 0.5; add('museum', 'capital and foot: the flares', 'quarter ellipse', gap(samp(t => bz([[bo, -dp], [bo - bo * k, -dp], [0, -dp * 0.1], [0, fr]], t)), ell(bo, fr, bo, dp + fr, Math.PI, 1.5 * Math.PI)), px('museum'), 'near'); }
// THE COUNTERS, as root shapes: the star's hole as a smaller star (picks7 star 'root') against the erosion it replaces
paper.setup(new paper.Size(100, 100));
const W = P7.W, OUTLINE_HOLE = 2.5, starHoleRc = (lw = W, h = OUTLINE_HOLE) => (h * lw / 2 + (lw / 2) / Math.sin(3 * Math.PI / 10)) / P7.STAR.ri, law = scaled(LAWS7.joint, 24 / 20);
const rc = starHoleRc(W) * 24 / 20 / 9.6, sharp = st => E.build(P7.star(20, rc, W, st)).d;
const holeOf = d => { const cp = new paper.CompoundPath(d), kids = cp.children.slice().sort((a, b) => Math.abs(a.area) - Math.abs(b.area)); return kids[0]; };
const hA = holeOf(sharp()), hB = holeOf(sharp('root')); let sg = 0; for (let s = 0; s < hB.length; s += 0.01) { const p = hB.getPointAt(s); sg = Math.max(sg, hA.getNearestPoint(p).getDistance(p)); }
const starRatio = P7.star(20, rc, W, 'root')[1].ratio;
// the coupe band's wall, square to the bowl, along the band (its sides are the bowl's side moved in sideways by the line)
// g7ax: the bowl's side is its ellipse (picks7 bowlRoot 7/8, bowlWide: rx = 5.75, centre bd/8 below the rim)
const u = J.bar.s / 12, eRy = 7 / 8 * bd, eCy = bd - eRy, pts = samp(t => { const a = Math.PI / 2 + t * Math.PI / 2; return [(6 + 5.75 * Math.cos(a)) * u, (eCy + eRy * Math.sin(a)) * u]; }, 4000).filter(p => p[1] >= 0);
const band = [W, W + 5 / 12, W + 5 / 6].map(y => { const p = pts.reduce((b, q) => Math.abs(q[1] - y) < Math.abs(b[1] - y) ? q : b), q = [p[0] + W, p[1]]; return Math.min(...pts.map(r => Math.hypot(r[0] - q[0], r[1] - q[1]))); });
const out = { rows, star: { ratio: starRatio, gapUnits: sg, gap72: sg * 3 }, bandWall: band };
fs.writeFileSync(path.join(__dirname, '../svg/g7/roots-audit.json'), JSON.stringify(out, null, 1));
for (const r of rows) console.log(`${r.icon.padEnd(7)} ${r.piece.padEnd(34)} vs ${r.root.padEnd(16)} ${r.px24.toFixed(3)}px at 24, ${r.px72.toFixed(3)}px at 72`);
console.log('star hole: a smaller star x', starRatio.toFixed(4), '; from the erosion', sg.toExponential(2), 'units'); console.log('band wall, square to the bowl:', band.map(v => v.toFixed(2)).join(' / '));
