// g7av THE CONSTRUCTION BOARD: draws svg/g7/construction.json (written by construction.js, the engine's own record of how
// each glyph of the shown row is built) as construction sheets: per icon, the shapes (grid, class cut, root shapes, counters,
// mirror, optical centre) and the corners (every round, coloured by its kind, its crest circle), the notes, true sizes.
//   node construction-board.js [outdir]   -> ../construction-g7.html and <outdir>/project/Grid7Construction.dc.html
'use strict';
const fs = require('fs'), path = require('path');
const paper = require(path.join(process.env.TOOLS || '/tmp/claude-0/-home-user-la-trip-map/04f8fb34-0476-5960-add5-8bd3d6d8820e/scratchpad/tools', 'node_modules/paper/dist/paper-core.js'));
paper.setup(new paper.Size(100, 100));
const J = JSON.parse(fs.readFileSync(path.join(__dirname, '../svg/g7/construction.json'), 'utf8'));
const COL = { paper: '#F2EBDD', raised: '#FAF5EA', hair: '#D8CEBA', ink: '#1A1A18', ink2: '#5A564C', navy: '#12293F', or: '#EE7434', ord: '#A8400C' };
const KIND = {
  mass: { c: '#2F6FA8', nm: 'Outside corner, eased' },
  tip: { c: '#6B4C9A', nm: 'Tip, eased and landed' },
  end: { c: '#547326', nm: 'Line end' },
  join: { c: '#A8400C', nm: 'Join or flare' },
  lean: { c: '#A8400C', nm: 'Leaned flare' },
  counter: { c: '#7A2436', nm: 'Counter corner' },
  s: { c: '#1F7A7A', nm: 'Drawn bend, rebuilt' },
};
const f = v => +(+v).toFixed(3), f1 = v => (+v).toFixed(1), f2 = v => (+v).toFixed(2);
const fr = v => { const w = Math.floor(v + 1e-6), t = v - w; const fs_ = [[0, ''], [1 / 6, '1/6'], [1 / 4, '1/4'], [1 / 3, '1/3'], [1 / 2, '1/2'], [2 / 3, '2/3'], [3 / 4, '3/4'], [5 / 6, '5/6'], [1, '']]; for (const [q, s] of fs_) if (Math.abs(t - q) < 0.004) return q === 1 ? `${w + 1}` : s ? (w ? `${w} ${s}` : s) : `${w}`; return v.toFixed(2); };
const kindOf = c => c.arcEase || c.sSpan ? 's' : c.hole ? 'counter' : c.end ? 'end' : c.convex ? (c.ease && c.angle < 75 ? 'tip' : 'mass') : c.flared ? 'lean' : 'join';
const pathBox = d => { const p = new paper.CompoundPath(d), b = p.bounds; p.remove(); return { x0: b.x, y0: b.y, x1: b.x + b.width, y1: b.y + b.height, cx: b.x + b.width / 2, cy: b.y + b.height / 2 }; };
const VB = [3, 3, 18, 18]; let PX = 540, K = PX / VB[2];   // px a unit of the 24 grid, set per sheet
const setScale = px => { PX = px; K = px / VB[2]; };
const u = px => px / K;                                  // screen px -> units
const T = (x, y, t, o = {}) => `<text x="${f(x)}" y="${f(y)}" font-family="Archivo, Arial, sans-serif" font-size="${f(u(o.fs || 13))}" font-weight="${o.fw || 700}" fill="${o.fill || COL.ink2}" text-anchor="${o.a || 'start'}" letter-spacing="${f(u(o.ls ?? 0.6))}" paint-order="stroke" stroke="${COL.raised}" stroke-width="${f(u(o.halo ?? 3))}" stroke-linejoin="round">${t}</text>`;

function gridLayer() {
  let g = `<rect x="${VB[0]}" y="${VB[1]}" width="${VB[2]}" height="${VB[3]}" fill="${COL.raised}"/>`;
  for (let i = 3 * VB[0] + 1; i < 3 * (VB[0] + VB[2]); i++) if (i % 3) g += `<line x1="${f(i / 3)}" y1="${VB[1]}" x2="${f(i / 3)}" y2="${VB[1] + VB[3]}" stroke="${COL.hair}" stroke-width="${f(u(0.6))}" opacity=".55"/><line x1="${VB[0]}" y1="${f(i / 3)}" x2="${VB[0] + VB[2]}" y2="${f(i / 3)}" stroke="${COL.hair}" stroke-width="${f(u(0.6))}" opacity=".55"/>`;
  for (let i = VB[0] + 1; i < VB[0] + VB[2]; i++) g += `<line x1="${i}" y1="${VB[1]}" x2="${i}" y2="${VB[1] + VB[3]}" stroke="${COL.hair}" stroke-width="${f(u(1))}"/><line x1="${VB[0]}" y1="${i}" x2="${VB[0] + VB[2]}" y2="${i}" stroke="${COL.hair}" stroke-width="${f(u(1))}"/>`;
  g += `<circle cx="12" cy="12" r="8" fill="none" stroke="${COL.ink2}" stroke-width="${f(u(1))}" stroke-dasharray="${f(u(5))} ${f(u(4))}" opacity=".7"/>`;
  g += `<rect x="6" y="6" width="12" height="12" fill="none" stroke="${COL.ink2}" stroke-width="${f(u(1))}" opacity=".8"/>`;
  for (const v of [6, 12, 18]) g += T(v, VB[1] + u(16), `${v}`, { fs: 13, a: 'middle', fw: 600 }) + T(VB[0] + u(5), v + u(5), `${v}`, { fs: 13, fw: 600 });
  return g;
}
const glyphFill = (d, a = 0.13) => `<path d="${d}" fill="${COL.navy}" fill-opacity="${a}" fill-rule="nonzero"/><path d="${d}" fill="none" stroke="${COL.navy}" stroke-width="${f(u(1))}" opacity=".85"/>`;
const marker = (x, y, t, col, lx, ly) => `${lx != null ? `<line x1="${f(lx)}" y1="${f(ly)}" x2="${f(x)}" y2="${f(y)}" stroke="${col}" stroke-width="${f(u(1.2))}"/>` : ''}<circle cx="${f(x)}" cy="${f(y)}" r="${f(u(13))}" fill="${col}" stroke="${COL.raised}" stroke-width="${f(u(2))}"/>${T(x, y + u(5.4), t, { fs: 15, a: 'middle', fill: COL.raised, halo: 0, ls: 0 })}`;
const svgWrap = (inner, label) => `<svg width="${PX}" height="${PX}" viewBox="${VB.join(' ')}" role="img" aria-label="${label}" style="display:block;flex:none">${inner}</svg>`;

// ---- per icon: what the sheet says about its shapes (A, B, ... on the shapes diagram), from the code's own values
const g = J;
const ROOTCOL = COL.or;
const SH = {
  cafe: {
    title: 'Café', who: 'cup on a plate',
    tags: [['VESSEL', 8.2, 9.1], ['LOOP', 15.9, 7.2], ['PLATE (CAP)', 7.2, 17.2], ['COUNTER', 14.75, 13.8, 'cut']],
    notes: G => [
      ['A', [8.7, 12.6], `<b>Vessel.</b> A flat rim and two straight walls (keylines), cut at the bottom by one ellipse (orange, whole): 1.02 × the cup's width, 4/9 of its depth.`],
      ['B', [17.3, 9.9], `<b>Loop.</b> The ear's back is half of a whole circle (r ${f2(KG.cafe.circles[0].r)}), laid over the right wall; the union joins them.`],
      ['C', [15.75, 10.29], `<b>Its counter</b> is a circle on the same centre, r ${f2(KG.cafe.circles[1].r)} (0.37 of the ear's), so the wall is even, 1 1/2 all round.`],
      ['D', [12, 16.85], `<b>Cap rule</b> (a plate): flat on top; underneath, one ellipse 7/6 its width and its full height, cut by the plate's ends. 1px cut above it.`],
      ['E', [12, 6.15], `<b>Size class:</b> Wide. Its saucer meets the sides of the cut. <b>No mirror</b>: the only glyph built whole.`],
    ] },
  bar: {
    title: 'Bar', who: 'coupe',
    tags: [['VESSEL', 5.9, 7.2], ['POST 1 1/4', 13.0, 14.25], ['FOOT (CAP)', 5.6, 17.85], ['BAND', 4.6, 9.75, 'cut']],
    notes: G => [
      ['A', [12, 12.15], `<b>Vessel.</b> One ellipse (orange, whole), 7/8 of the bowl's depth tall, its widest point the glass's width, cut by the rim line just above that.`],
      ['B', [9.05, 9.82], `<b>The clear band</b> is cut by the bowl's own side moved in 1 1/2 (dashed), between the rim's underside and the drink's surface (keylines): 5/6 tall, its sides the outside's own curve.`],
      ['C', [12, 14.1], `<b>Post rule.</b> A post that holds a mass up is 1 1/4. It runs half-way into the foot, so its sides meet the foot in a real join.`],
      ['D', [12, 16.3], `<b>Cap rule</b> (a foot): flat underneath; its top and shoulders one ellipse (whole, orange), 7/6 its width and its full height, cut by the foot's ends.`],
      ['E', [12, 6.15], `<b>Size class:</b> Square. The rim meets the sides. Right half = the left, mirrored.`],
    ] },
  museum: {
    title: 'Museum', who: 'temple',
    tags: [['GABLE', 8.0, 7.75], ['BEAM (SLAB)', 3.6, 10.55], ['POST 1 1/4', 8.95, 14.15], ['PLINTH (SLAB)', 3.6, 18.0]],
    notes: G => [
      ['A', [12, 7.6], `<b>Gable</b>: two slopes (run on past the apex) on 1.2 upright ends; apex 1/2 over the top.`],
      ['B', [14.4, 10.43], `<b>The separated gable:</b> it rests on its beam across the 1px cut (a part that rests on another is cut from it).`],
      ['C', [17.6, 13.93], `<b>Capital and foot:</b> past the outer posts the beam and the plinth thin to 1px ends; the outer posts flare 1/2 into them, outside only.`],
      ['D', [12, 13.95], `<b>Four posts</b>, 1 1/4 (post rule), standing full height between the beam and the plinth; the openings are the gaps they leave.`],
      ['E', [12, 19.2], `<b>Class follows drawn proportion:</b> drawn ${f2(G.classFrom.ratio)}:1, so Square, not Wide.`],
    ] },
  nature: {
    title: 'Nature', who: 'tree',
    tags: [['GABLE ×3', 15.9, 7.4], ['POST 1 1/4', 13.1, 17.55]],
    notes: G => [
      ['A', [12, 7.6], `<b>Three gables.</b> They show 4.83 : 3 : 3.33 of the height, half widths 2.8 : 4.1 : 5.3 (the bottom one the tall class's).`],
      ['B', [13.45, 9.45], `<b>Notch:</b> each tier tucks under the one above by 0.6 of that tier's half width.`],
      ['C', [14.35, 15.75], `<b>Drawn, not ruled:</b> each underside droops 1/2 line toward the trunk; each side sweeps in 0.2 line.`],
      ['D', [12, 16.6], `<b>Trunk</b>, a post 1 1/4: it shows one line under the bottom tier.`],
      ['E', [12, 4.35], `<b>Size class:</b> Tall, apex 1/2 over the top. Right half = the left, mirrored.`],
    ] },
  star: {
    title: 'Star', who: 'outline mark, at its 20px slot',
    tags: [['CENTRELINE STAR', 14.2, 5.3], ['OUTLINE', 17.8, 8.6], ['COUNTER', 13.6, 16.3, 'cut']],
    notes: G => [
      ['A', [16.15, 8.95], `<b>Centreline star:</b> inner radius 0.47 of the outer (its points' slenderness). Its outside is that star moved out by half the line, mitred.`],
      ['B', [7.75, 11.45], `<b>Its counter:</b> the same star on the same centre, ${f2(G.prims.find(p => p.cut).ratio || 0)} its size (dashed); then the law rounds it, tight.`],
      ['C', [12, 12.75], `<b>Sized by its counter:</b> 2 1/2 lines across at the centre, valley to valley; the outside follows.`],
      ['D', [18.6, 10.35], `<b>The line:</b> the solids' 1 1/2px, drawn in its own 24 box at 20px (${f2(G.lw)} units).`],
    ] },
  plus: {
    title: 'Plus', who: 'open mark, at its 26.4px slot',
    tags: [['POST 1 2/3', 13.15, 7.0], ['POST 1 2/3', 15.6, 11.0]],
    notes: G => [
      ['A', [12, 12], `<b>Two posts</b>, 1 2/3px each (an open stroke reads lighter), crossing at the middle.`],
      ['B', [17.9, 13.6], `<b>Open class:</b> the arms span the coin, 12 across, in its own 24 box shown at 26.4px.`],
    ] },
};

// THE KEYLINES (director, turn 143: "overlay a whole ellipse for the bowl, the loop's whole circle and its counter's, the slabs
// and the dome's whole arc, in thin keylines extended past the glyph"): read from each root shape's own segments, as the
// engine got them. A straight edge runs on past its ends; a quarter circle (a cubic whose handles are 0.552 of its radius,
// at right angles) is drawn as its whole circle; any other curve shows its handles, and where its ends meet at a right
// angle, the ellipse that would fill the same corner (dashed), with how far its handles reach against an ellipse's 0.552.
const KAPPA = 0.5523;
function keyGeom(G, skip = []) {
  const lines = new Map(), circles = new Map(), cubics = [], ellipses = [];
  G.parts.forEach((d, i) => {
    if (G.prims[i].t === 'E') return;   // a part in skip shows its straight edges only
    const cp = new paper.CompoundPath(d);
    for (const k of (cp.children.length ? cp.children : [cp])) for (const c of k.curves) {
      const A = c.point1, B = c.point2;
      if (c.length < 0.05) continue;
      if (c.isStraight()) {
        const dv = B.subtract(A).normalize(), ang = ((Math.atan2(dv.y, dv.x) + Math.PI) % Math.PI), n = new paper.Point(-Math.sin(ang), Math.cos(ang)), off = A.dot(n);
        const key = `${ang.toFixed(2)}|${(Math.round(off * 20) / 20).toFixed(2)}`, e = new paper.Point(Math.cos(ang), Math.sin(ang)), ta = A.dot(e), tb = B.dot(e);
        const L = lines.get(key) || { e, n, off, t0: 1e9, t1: -1e9, diag: Math.abs(Math.sin(2 * ang)) > 0.05 };
        L.t0 = Math.min(L.t0, ta, tb); L.t1 = Math.max(L.t1, ta, tb); lines.set(key, L); continue;
      }
      if (skip.includes(i)) continue;
      const P = [A, A.add(c.handle1), B.add(c.handle2), B], h0 = P[1].subtract(P[0]), h1 = P[3].subtract(P[2]);
      const perp = Math.abs(h0.normalize().dot(h1.normalize())) < 0.02;
      if (perp && Math.abs(h0.length - h1.length) < 0.02 * h0.length) {
        const r = h0.length / KAPPA, nn = new paper.Point(-h0.y, h0.x).normalize();
        for (const C of [P[0].add(nn.multiply(r)), P[0].subtract(nn.multiply(r))]) if (Math.abs(C.getDistance(P[3]) - r) < 0.03 * r) { if (![...circles.values()].some(q => q.C.getDistance(C) < 0.05 && Math.abs(q.r - r) < 0.05)) circles.set(`${C.x.toFixed(2)},${C.y.toFixed(2)},${r.toFixed(2)}`, { C, r }); break; }
        if ([...circles.values()].some(q => Math.abs(q.C.getDistance(P[0]) - q.r) < 0.03 * q.r && Math.abs(q.C.getDistance(P[3]) - q.r) < 0.03 * q.r)) continue;
      }
      cubics.push(P);
      if (perp) {   // the corner Q where the two end tangents meet; the ellipse that turns the same corner
        const t0 = h0.normalize(), t1 = h1.normalize(), den = t0.x * t1.y - t0.y * t1.x; if (Math.abs(den) < 1e-6) continue;
        const w = P[3].subtract(P[0]), a = (w.x * t1.y - w.y * t1.x) / den, Q = P[0].add(t0.multiply(a)), Ce = P[0].add(P[3]).subtract(Q);
        ellipses.push({ C: Ce, rx: Math.abs(Q.x - Ce.x) || Math.abs(P[0].x - Ce.x), ry: Math.abs(Q.y - Ce.y) || Math.abs(P[0].y - Ce.y), k: [h0.length / P[0].getDistance(Q), h1.length / P[3].getDistance(Q)], Q });
      }
    }
    cp.remove();
  });
  return { lines: [...lines.values()], circles: [...circles.values()], cubics, ellipses };
}
function keylines(G, skip, noEll, keepH) {
  const K_ = keyGeom(G, skip), w = f(u(1.3)), OR = COL.or, OD = COL.ord;
  let s = '';
  for (const L of K_.lines) { if (keepH && Math.abs(L.e.y) < 1e-3 && !keepH.some(y => Math.abs(Math.abs(L.off) - y) < 0.03)) continue; const ext = L.diag ? 2.2 : 1.1, a = L.e.multiply(L.t0 - ext).add(L.n.multiply(L.off)), b = L.e.multiply(L.t1 + ext).add(L.n.multiply(L.off)); s += `<line x1="${f(a.x)}" y1="${f(a.y)}" x2="${f(b.x)}" y2="${f(b.y)}" stroke="${OR}" stroke-width="${w}"/>`; }
  for (const { C, r } of K_.circles) s += `<circle cx="${f(C.x)}" cy="${f(C.y)}" r="${f(r)}" fill="none" stroke="${OR}" stroke-width="${w}"/><circle cx="${f(C.x)}" cy="${f(C.y)}" r="${f(u(2.5))}" fill="${OR}"/>`;
  const seenE = new Set(); for (const E_ of K_.ellipses) if (!noEll && !seenE.has(`${f2(E_.C.x)},${f2(E_.C.y)}`) && seenE.add(`${f2(E_.C.x)},${f2(E_.C.y)}`)) s += `<ellipse cx="${f(E_.C.x)}" cy="${f(E_.C.y)}" rx="${f(E_.rx)}" ry="${f(E_.ry)}" fill="none" stroke="${COL.ink2}" stroke-width="${f(u(1.1))}" stroke-dasharray="${f(u(5))} ${f(u(4))}"/>`;
  for (const P of K_.cubics) s += `<path d="M${f(P[0].x)} ${f(P[0].y)}L${f(P[1].x)} ${f(P[1].y)}M${f(P[3].x)} ${f(P[3].y)}L${f(P[2].x)} ${f(P[2].y)}" stroke="${OD}" stroke-width="${f(u(1.1))}" fill="none"/>${[P[1], P[2]].map(q => `<rect x="${f(q.x - u(3))}" y="${f(q.y - u(3))}" width="${f(u(6))}" height="${f(u(6))}" fill="${COL.raised}" stroke="${OD}" stroke-width="${f(u(1.3))}"/>`).join('')}${[P[0], P[3]].map(q => `<circle cx="${f(q.x)}" cy="${f(q.y)}" r="${f(u(3))}" fill="${OD}"/>`).join('')}`;
  return s;
}
const KEYED = { cafe: { skip: [0, 2] }, bar: { skip: [0, 2, 3] }, museum: { skip: [], noEll: true, keepH: [9.931, 10.931, 12.931, 14.931] } };   // turn 145: the museum keeps only the cut's two lines and the flares' levels; a horizontal that only repeats a slab's edge is dropped
const KG = Object.fromEntries(Object.keys(KEYED).map(id => [id, keyGeom(J[id], KEYED[id].skip)]));
if (process.env.KEYDBG) for (const id of Object.keys(KEYED)) { const g_ = keyGeom(J[id], KEYED[id].skip); console.log(id, 'lines', g_.lines.length, 'circles', g_.circles.map(q => `${f2(q.C.x)},${f2(q.C.y)} r${f2(q.r)}`).join(' '), 'cubics', g_.cubics.length, 'ellipses', g_.ellipses.map(e => `c${f2(e.C.x)},${f2(e.C.y)} ${f2(e.rx)}x${f2(e.ry)} k ${e.k.map(f2).join('/')}`).join(' ; ')); }

function shapesSvg(id) {
  const G = J[id], S = SH[id];
  setScale(720);
  let s = gridLayer();
  // class cut (the place icons): the cut's size about the finished box's centre
  if (G.cut) { const b = G.mFin.box, [w, h] = G.cut, cx = b.cx, cy = b.cy; s += `<rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${f(w)}" height="${f(h)}" fill="${COL.or}" fill-opacity=".07" stroke="${COL.or}" stroke-width="${f(u(1.2))}" stroke-dasharray="${f(u(6))} ${f(u(3))}"/>`; }
  if (id === 'plus') s += `<circle cx="12" cy="12" r="6" fill="${COL.or}" fill-opacity=".07" stroke="${COL.or}" stroke-width="${f(u(1.2))}" stroke-dasharray="${f(u(6))} ${f(u(3))}"/>`;
  s += glyphFill(G.d, 0.2);
  // the root shapes as the engine received them: placed and sized, before the union; cuts dashed
  const sh = G.dy ? `<g transform="translate(0 ${f(G.dy)})">` : '<g>';
  s += sh;
  if (KEYED[id]) s += keylines(G, KEYED[id].skip, KEYED[id].noEll, KEYED[id].keepH);
  for (const p of G.prims) if (p.cap) s += `<ellipse cx="${f(p.cap.cx)}" cy="${f(p.cap.cy)}" rx="${f(p.cap.rx)}" ry="${f(p.cap.ry)}" fill="none" stroke="${COL.or}" stroke-width="${f(u(1.6))}"/><circle cx="${f(p.cap.cx)}" cy="${f(p.cap.cy)}" r="${f(u(2.5))}" fill="${COL.or}"/>`;   // g7aw: a cap's root ellipse, whole
  if (id === 'bar') {   // the band's sides: the bowl's own side, moved in by the line
    const cp = new paper.CompoundPath(G.parts[0]);
    for (const c of cp.children.length ? cp.children[0].curves : cp.curves) { if (c.isStraight()) continue; const sg = c.bounds.center.x < (G.sym || 12) ? 1 : -1, q = c.clone({ insert: false }); const P = [c.point1, c.point1.add(c.handle1), c.point2.add(c.handle2), c.point2].map(v => v.add(new paper.Point(sg * 1.5, 0)));
      s += `<path d="M${f(P[0].x)} ${f(P[0].y)}C${f(P[1].x)} ${f(P[1].y)} ${f(P[2].x)} ${f(P[2].y)} ${f(P[3].x)} ${f(P[3].y)}" fill="none" stroke="${COL.or}" stroke-width="${f(u(1.3))}" stroke-dasharray="${f(u(5))} ${f(u(3))}"/>`; }
    cp.remove();
  }
  if (!KEYED[id]) G.parts.forEach((d, i) => { const p = G.prims[i]; if (p.t === 'E') return; s += `<path d="${d}" fill="none" stroke="${ROOTCOL}" stroke-width="${f(u(1.6))}" ${p.cut ? `stroke-dasharray="${f(u(4))} ${f(u(2.5))}"` : ''} stroke-linejoin="round"/>`; });
  // counters by offset (E): the outline it is taken from (thin), and the counter (dashed)
  G.prims.forEach((p, i) => { if (p.t !== 'E') return; s += `<path d="${G.parts[i]}" fill="none" stroke="${ROOTCOL}" stroke-width="${f(u(1.6))}" stroke-dasharray="${f(u(4))} ${f(u(2.5))}"/>`; });
  s += '</g>';
  if (id === 'star') {   // the centreline star the outline is drawn on
    const c = G.centre, R = G.Rc, ri = G.ri, pts = []; for (let i = 0; i < 10; i++) { const r = i % 2 ? ri : R, a = -Math.PI / 2 + i * Math.PI / 5; pts.push(`${f(c[0] + r * Math.cos(a))},${f(c[1] + r * Math.sin(a) + G.dy)}`); }
    s += `<polygon points="${pts.join(' ')}" fill="none" stroke="${COL.ink2}" stroke-width="${f(u(1))}" stroke-dasharray="${f(u(2))} ${f(u(2))}"/><circle cx="${c[0]}" cy="${f(c[1] + G.dy)}" r="${f(R)}" fill="none" stroke="${COL.ink2}" stroke-width="${f(u(0.8))}" opacity=".5"/><circle cx="${c[0]}" cy="${f(c[1] + G.dy)}" r="${f(ri)}" fill="none" stroke="${COL.ink2}" stroke-width="${f(u(0.8))}" opacity=".5"/>`;
  }
  // the mirror
  if (G.sym != null) s += `<line x1="${f(G.sym)}" y1="${VB[1] + 0.9}" x2="${f(G.sym)}" y2="${VB[1] + VB[3] - 0.3}" stroke="${COL.navy}" stroke-width="${f(u(1.2))}" stroke-dasharray="${f(u(10))} ${f(u(3))} ${f(u(2))} ${f(u(3))}"/>${T(G.sym + u(6), VB[1] + VB[3] - u(9), 'MIRROR', { fs: 13, fill: COL.navy })}`;
  // optical centre: the badge's middle (orange), the box centre (open square), the ink centroid (dot)
  const b = G.mFin.box, oy = b.cy - 0.5 * Math.max(0, b.cy - G.mFin.cy), ox = (b.cx + G.mFin.cx) / 2;
  s += `<line x1="${VB[0] + 0.2}" y1="12" x2="${VB[0] + 1.6}" y2="12" stroke="${COL.or}" stroke-width="${f(u(2))}"/><line x1="${VB[0] + VB[2] - 1.6}" y1="12" x2="${VB[0] + VB[2] - 0.2}" y2="12" stroke="${COL.or}" stroke-width="${f(u(2))}"/>`;
  s += `<rect x="${f(b.cx - u(5))}" y="${f(b.cy - u(5))}" width="${f(u(10))}" height="${f(u(10))}" fill="${COL.raised}" stroke="${COL.navy}" stroke-width="${f(u(1.5))}"/><circle cx="${f(G.mFin.cx)}" cy="${f(G.mFin.cy)}" r="${f(u(4))}" fill="${COL.navy}"/><circle cx="${f(ox)}" cy="${f(oy)}" r="${f(u(6.5))}" fill="none" stroke="${COL.or}" stroke-width="${f(u(2.2))}"/>`;
  // root names
  for (const [t, x, y, cut] of S.tags) s += T(x, y, t, { fs: 15, fill: COL.ord });
  // lettered notes
  for (const [L, [x, y]] of S.notes(G)) s += marker(x, y, L, COL.or);
  return svgWrap(s, `${S.title}: its root shapes on the 24 grid`);
}

// corners: the rounds the engine drew, each coloured by its kind, with the circle at its crest
function groupCorners(G) {
  const cs = G.corners.filter(c => G.sym == null || (c.P0 ? c.P0[0] : c.pA[0]) <= G.sym + 1e-3);
  const out = {}; for (const c of cs) { const k = kindOf(c); (out[k] = out[k] || []).push(c); } return out;
}
function cornersSvg(id) {
  const G = J[id];
  setScale(480);
  let s = gridLayer() + glyphFill(G.d) + (G.dy ? `<g transform="translate(0 ${f(G.dy)})">` : '<g>');
  const mir = G.sym != null ? `transform="translate(${f(2 * G.sym)} 0) scale(-1 1)"` : null;
  const one = (c, extra = '') => { const k = KIND[kindOf(c)], dd = c.cubics.map((P, i) => `${i ? '' : `M${f(P[0][0])} ${f(P[0][1])}`}C${f(P[1][0])} ${f(P[1][1])} ${f(P[2][0])} ${f(P[2][1])} ${f(P[3][0])} ${f(P[3][1])}`).join('');
    let r = `<path d="${dd}" fill="none" stroke="${k.c}" stroke-width="${f(u(4))}" stroke-linecap="round" ${extra}/>`;
    if (c.crest && c.kM) { const R = 1 / Math.abs(c.kM), P = c.crest, A = c.pA, B = c.pB, mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2, dx = mx - P[0], dy = my - P[1], L = Math.hypot(dx, dy) || 1;   // the chord's middle is on the inside of the bend
      const cx = P[0] + dx / L * R, cy = P[1] + dy / L * R;
      r += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R)}" fill="none" stroke="${k.c}" stroke-width="${f(u(1))}" stroke-dasharray="${f(u(3))} ${f(u(2))}" ${extra}/>`; }
    for (const q of [c.pA, c.pB]) r += `<circle cx="${f(q[0])}" cy="${f(q[1])}" r="${f(u(2.6))}" fill="${COL.raised}" stroke="${k.c}" stroke-width="${f(u(1.4))}" ${extra}/>`;
    return r; };
  const shown = G.corners.filter(c => G.sym == null || (c.P0 ? c.P0[0] : c.pA[0]) <= G.sym + 1e-3);
  for (const c of shown) { s += one(c); if (mir && (c.P0 ? c.P0[0] : c.pA[0]) < G.sym - 1e-3) s += `<g ${mir}>${one(c)}</g>`; }
  // the leaned flare: its two runs, on the line and on the curve
  for (const c of shown.filter(c => c.flared)) { const P = c.P0, tick = (q, t) => { const dx = q[0] - P[0], dy = q[1] - P[1], L = Math.hypot(dx, dy); return `<line x1="${f(P[0])}" y1="${f(P[1])}" x2="${f(q[0])}" y2="${f(q[1])}" stroke="${KIND.lean.c}" stroke-width="${f(u(1))}" stroke-dasharray="${f(u(1.5))} ${f(u(1.5))}"/>`; }; s += tick(c.pA) + tick(c.pB) + `<circle cx="${f(P[0])}" cy="${f(P[1])}" r="${f(u(2))}" fill="${KIND.lean.c}"/>`; }
  s += '</g>';
  // numbered: one marker per kind, at its first corner, pushed out from the glyph's centre
  const grp = groupCorners(G), b = G.mFin.box, order = ['mass', 'tip', 'end', 'join', 'lean', 'counter', 's'];
  let n = 0; const marks = [];
  for (const k of order) { if (!grp[k]) continue; n++; const ov = (CORNER_AT[id] || {})[k]; const c = grp[k][ov && ov.i != null ? ov.i : 0], P = c.crest || c.P0 || c.pA;
    const dx = P[0] - b.cx, dy = P[1] - b.cy, L = Math.hypot(dx, dy) || 1, at = ov && ov.at ? ov.at : [P[0] + dx / L * 1.3, P[1] + dy / L * 1.3];
    const sy = G.dy || 0; s += marker(at[0], at[1] + (ov && ov.at ? 0 : sy), `${n}`, KIND[k].c, P[0], P[1] + sy); marks.push([n, k, grp[k]]); }
  return { svg: svgWrap(s, `${SH[id].title}: its corners, by kind`), marks };
}
// hand-placed markers where the automatic one lands on another (index into that kind's corners, and the marker's place)
const CORNER_AT = {
  cafe: { mass: { at: [6.4, 6.9] }, end: { i: 1, at: [4.9, 14.6] }, lean: { at: [12.6, 13.9] }, counter: { i: 0, at: [12.9, 10.3] }, s: { i: 2, at: [18.6, 8.9] } },
  bar: { mass: { i: 1, at: [5.6, 7.0] }, lean: { i: 0, at: [9.7, 13.6] }, end: { at: [7.3, 18.3] }, counter: { i: 0, at: [10.4, 9.85] }, s: {} },
  museum: { mass: { i: 1, at: [12, 5.5] }, end: { i: 0, at: [5.6, 9.6] }, counter: { i: 2, at: [7.9, 14.0] }, s: { i: 0, at: [5.3, 13.9] } },
  nature: { tip: { i: 2, at: [8.0, 8.4] }, join: { i: 0, at: [10.2, 13.0] }, end: { i: 0, at: [9.9, 18.9] } },
  star: { tip: { i: 3, at: [4.2, 7.4] }, join: { i: 4, at: [8.4, 6.9] }, counter: { i: 6, at: [6.0, 12.4] } },
  plus: { end: { i: 0, at: [4.7, 10.2] }, join: { i: 1, at: [9.6, 9.6] } },
};

function kindNote(k, list, G) {
  const num = (a, b) => a - b, rs = [...new Set(list.map(c => c.r).filter(v => v != null).map(v => f2(v)))].sort(num), crest = [...new Set(list.filter(c => c.kM).map(c => f2(1 / Math.abs(c.kM))))].sort(num);
  const rr = rs.length ? (rs.length > 2 ? `${rs[0]}-${rs[rs.length - 1]}` : rs.join(', ')) : '', cr = crest.length ? (crest.length > 2 ? `${Math.min(...crest)}-${Math.max(...crest)}` : crest.join(', ')) : '';
  const nCub = [...new Set(list.map(c => c.cubics.length))].join(' or ');
  const per = G.sym != null ? ' a side' : '', nn = ` <span style="color:${COL.ink2}">×${list.length}${G.sym != null ? ' a side' : ''}</span>`;
  switch (k) {
    case 'mass': return `<b>Outside corners, eased</b>: law ${rr}; the round's tightest point r ${cr}.${nn}`;
    case 'tip': return G.id === 'star' ? `<b>Tips</b>: the law's 0.35 at its slot (${rr} in its box), eased, and landed where the eased tip's point was: its edges re-aimed, the drawn point moves 0.25.${nn}` : `<b>Tips</b>: a share of the shorter edge (0.0877), law ${rr}; eased, and landed where the eased tip's point was: their edges re-aimed, the drawn points move 0.4 (top) to 1.0 (bottom tier). The top tip is soft: one wide hill.${nn}`;
    case 'end': return `<b>Line ends</b>: law ${rr} (the end round, never over 0.2 of the edge).${nn}`;
    case 'join': return G.id === 'nature' ? `<b>Joins</b>: the notches ${rs[0]} (tight inside); the trunk into the tier ${rs[rs.length - 1]} (a flare, an even hill: its tier's underside bends the same way, so it doesn't lean).${nn}` : G.id === 'star' ? `<b>Valleys</b> (wide inside): law ${rr}, tightest point r ${cr}.${nn}` : `<b>Joins</b>: law ${rr}, tightest point r ${cr}.${nn}`;
    case 'lean': return `<b>Leaned flare</b>: a line into a gentle curve bending the other way. Its tightest point at the law's own ${rr}; the run on the curve 1 3/4 × the run on the line (dotted).${nn}`;
    case 'counter': return G.id === 'bar' ? `<b>The band's ends</b>: each end is one curve (the counter-end rule): its two corners' rounds grow from the law's 0.15 until they meet, ${rr}.${nn}` : `<b>Counter corners</b>: the tight join round, law ${rr}.${nn}`;
    case 's': return G.id === 'museum' ? `<b>Capital and foot ends</b>: the beam's end and the drawn flare become one S of two even bends; the drawn curve sets only its ends.${nn}` : `<b>Drawn arcs eased in</b>: where the loop's half circles leave a straight, the bend ramps up over 3/10 of the half (arc ease).${nn}`;
  }
}
const sizes = (id, d) => {
  const N = COL.navy, ring = `<circle cx="12" cy="12" r="11.25" fill="${COL.paper}" stroke="${N}" stroke-width="1.5"/>`;
  if (id === 'plus' || id === 'star') { const px = id === 'plus' ? 26.4 : 20; return `<svg width="${px}" height="${px}" viewBox="0 0 24 24" aria-hidden="true"><path d="${d}" fill="${N}"/></svg><svg width="${px * 3}" height="${px * 3}" viewBox="0 0 24 24" aria-hidden="true"><path d="${d}" fill="${N}"/></svg>`; }
  return `<svg width="12" height="12" viewBox="6 6 12 12" aria-hidden="true"><path d="${d}" fill="${N}"/></svg><svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">${ring}<path d="${d}" fill="${N}"/></svg><svg width="72" height="72" viewBox="0 0 24 24" aria-hidden="true"><path d="${d}" fill="${N}"/></svg>`;
};
const note = (L, col, html) => `<div style="display:flex;gap:10px;align-items:flex-start;margin:0 0 10px"><span style="flex:none;width:22px;height:22px;border-radius:11px;background:${col};color:${COL.raised};font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;margin-top:1px">${L}</span><span style="font-size:16px;line-height:1.4;color:${COL.ink}">${html}</span></div>`;

function iconRow(id) {
  const G = J[id], S = SH[id], cs = cornersSvg(id);
  const b = G.mFin.box, oyPt = b.cy - 0.5 * Math.max(0, b.cy - G.mFin.cy);
  const fit = G.cut ? `${S.title === 'Museum' ? 'Square' : { WIDE: 'Wide', SQUARE: 'Square', TALL: 'Tall' }[G.cls]} cut ${fr(G.cut[0])} × ${fr(G.cut[1])} (the class, ${fr(G.key[0])} × ${fr(G.key[1])}${G.apex ? ' + 1/2 apex' : ''}, × 11/12); drawn at ${f2(G.s)} units to the 12. Finished ${f2(b.x1 - b.x0)} × ${f2(b.y1 - b.y0)}.` : id === 'star' ? `Its points ${f1((b.x1 - b.x0) * 20 / 24)}px across at 20px.` : `Arms ${f1((b.x1 - b.x0) * 26.4 / 24)}px across at 26.4px.`;
  const opt = G.cut ? `<b>Optical centre</b> (orange ring) on the badge's middle (orange ticks): the box's centre (square) ${b.cy - G.mFin.cy > 0 ? `pulled down by half the ${f2(b.cy - G.mFin.cy)} its ink sits above it` : 'as it is: its ink sits low, so it is not lifted'}; across, half-way from the box centre to the ink (dot), to 1/4px.` : (G.dy ? `<b>Optical centre</b>: in its own slot, the same rule: moved ${f2(G.dy)} down.` : `<b>Optical centre</b>: in its own slot, the same rule; it is already centred.`);
  const shapeNotes = S.notes(G).map(([L, , h]) => note(L, COL.or, h)).join('');
  const cornerNotes = cs.marks.map(([n, k, list]) => note(n, KIND[k].c, kindNote(k, list, G))).join('');
  const nCurves = (G.d.match(/C/g) || []).length;
  return `<div style="padding:40px 0 44px;border-top:2px solid ${COL.hair}">
<div style="display:flex;align-items:baseline;gap:14px;margin:0 0 18px"><h2 style="margin:0;font-size:34px;line-height:1.1;color:${COL.navy}">${S.title}</h2><span style="font-size:17px;color:${COL.ink2}">${S.who}</span><span style="margin-left:auto;font-size:14px;color:${COL.ink2}">rebuilt from the code: ${G.same ? 'identical to the row, byte for byte' : '<b style="color:#A8400C">differs from the row</b>'} · ${nCurves} curves</span></div>
<div style="display:flex;gap:32px;align-items:flex-start">
<div>${shapesSvg(id)}<div style="font-size:13px;letter-spacing:.1em;font-weight:700;color:${COL.ink2};text-transform:uppercase;margin-top:10px">Shapes · grid, cut, roots, mirror, centre</div></div>
<div>${cs.svg}<div style="font-size:13px;letter-spacing:.1em;font-weight:700;color:${COL.ink2};text-transform:uppercase;margin-top:10px">Corners · every round, by kind</div></div>
<div style="flex:1;min-width:0">
<div style="display:flex;gap:14px;align-items:center;padding:12px 14px;background:${COL.paper};margin:0 0 18px">${sizes(id, G.d)}<span style="font-size:13px;color:${COL.ink2}">${id === 'plus' || id === 'star' ? 'at its slot, and 3x' : '12, 24 in its badge, 72'}</span></div>
${shapeNotes}
<div style="font-size:15px;line-height:1.4;color:${COL.ink};margin:0 0 10px 32px">${fit}</div>
<div style="font-size:15px;line-height:1.4;color:${COL.ink};margin:0 0 16px 32px">${opt}</div>
${cornerNotes}
</div></div></div>`;
}

// THE ROUNDS, CLOSE UP (director, turn 143: "a 0.15 round is about 4px ... add one inset per kind of round at about 4x"): one
// real corner of each kind, at about 150px a unit: the outline before the round (dashed), the round (its hill), its crest
// circle, and where it leaves each edge.
const CLOSE = [['mass', 'bar', 1, 'the coupe\'s rim'], ['tip', 'nature', 0, 'the tree\'s bottom tier'], ['end', 'bar', 0, 'the coupe\'s foot'], ['join', 'nature', 1, 'a notch of the tree'], ['lean', 'bar', 1, 'the coupe\'s bowl into its stem'], ['counter', 'museum', 0, 'an opening of the museum'], ['s', 'museum', 0, 'the museum\'s capital']];
function closeUps() {
  const cell = ([k, id, i, where]) => {
    const G = J[id], c = groupCorners(G)[k][i], pts = c.cubics.flat(), xs = pts.map(q => q[0]), ys = pts.map(q => q[1]);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2, span = Math.max(0.9, 2.2 * Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)));
    const px = 222, sc = px / span, uu = v => v / sc, vb = [cx - span / 2, cy - span / 2, span, span];
    let g = `<rect x="${f(vb[0])}" y="${f(vb[1])}" width="${f(span)}" height="${f(span)}" fill="${COL.raised}"/>`;
    for (let q = Math.ceil(vb[0] * 3); q <= (vb[0] + span) * 3; q++) g += `<line x1="${f(q / 3)}" y1="${f(vb[1])}" x2="${f(q / 3)}" y2="${f(vb[1] + span)}" stroke="${COL.hair}" stroke-width="${f(uu(q % 3 ? 0.7 : 1.2))}"/>`;
    for (let q = Math.ceil(vb[1] * 3); q <= (vb[1] + span) * 3; q++) g += `<line x1="${f(vb[0])}" y1="${f(q / 3)}" x2="${f(vb[0] + span)}" y2="${f(q / 3)}" stroke="${COL.hair}" stroke-width="${f(uu(q % 3 ? 0.7 : 1.2))}"/>`;
    g += `<path d="${G.d}" fill="${COL.navy}" fill-opacity=".2"/><path d="${G.sharp}" fill="none" stroke="${COL.ink2}" stroke-width="${f(uu(1.3))}" stroke-dasharray="${f(uu(6))} ${f(uu(4))}"/><path d="${G.d}" fill="none" stroke="${COL.navy}" stroke-width="${f(uu(1.2))}"/>`;
    const col = KIND[k].c, dd = c.cubics.map((P, j) => `${j ? '' : `M${f(P[0][0])} ${f(P[0][1])}`}C${f(P[1][0])} ${f(P[1][1])} ${f(P[2][0])} ${f(P[2][1])} ${f(P[3][0])} ${f(P[3][1])}`).join('');
    g += `<path d="${dd}" fill="none" stroke="${col}" stroke-width="${f(uu(5))}" stroke-linecap="round"/>`;
    for (let j = 1; j < c.cubics.length; j++) { const q = c.cubics[j][0]; g += `<line x1="${f(q[0])}" y1="${f(q[1])}" x2="${f(q[0])}" y2="${f(q[1])}" stroke="${COL.raised}" stroke-width="${f(uu(3))}" stroke-linecap="round"/>`; }
    let cr = '';
    if (c.crest && c.kM) { const R = 1 / Math.abs(c.kM), P = c.crest, mx = (c.pA[0] + c.pB[0]) / 2, my = (c.pA[1] + c.pB[1]) / 2, dx = mx - P[0], dy = my - P[1], L = Math.hypot(dx, dy) || 1; g += `<circle cx="${f(P[0] + dx / L * R)}" cy="${f(P[1] + dy / L * R)}" r="${f(R)}" fill="none" stroke="${col}" stroke-width="${f(uu(1.4))}" stroke-dasharray="${f(uu(5))} ${f(uu(3))}"/><circle cx="${f(P[0])}" cy="${f(P[1])}" r="${f(uu(3.5))}" fill="${col}"/>`; cr = ` · tightest r ${f2(R)}`; }
    for (const q of [c.pA, c.pB]) g += `<circle cx="${f(q[0])}" cy="${f(q[1])}" r="${f(uu(4.5))}" fill="${COL.raised}" stroke="${col}" stroke-width="${f(uu(2))}"/>`;
    const law = c.r != null ? `law ${f2(c.r)}` : 'no law radius: an S';
    return `<div style="width:${px}px"><svg width="${px}" height="${px}" viewBox="${vb.map(f).join(' ')}" role="img" aria-label="${KIND[k].nm}, close up" style="display:block">${g}</svg><div style="display:flex;align-items:center;gap:8px;margin-top:10px"><span style="width:14px;height:14px;border-radius:7px;background:${col};flex:none"></span><span style="font-size:17px;font-weight:700;color:${COL.navy}">${KIND[k].nm}</span></div><div style="font-size:15px;line-height:1.35;color:${COL.ink2};margin-top:2px">${where}<br>${law}${cr} · ${c.cubics.length} cubics</div></div>`;
  };
  return `<div style="border-top:2px solid ${COL.hair};padding:36px 0 44px"><h2 style="margin:0 0 6px;font-size:30px;color:${COL.navy}">The seven kinds of round, close up</h2>
<p style="margin:0 0 22px;font-size:17px;line-height:1.45;color:${COL.ink2};max-width:1200px">One real corner of each kind, at about 150px a unit (4x the shapes sheets). Dashed grey: the outline before the round. Thick: the round as drawn, its pieces split by a gap. Dashed circle: its tightest point. Open dots: where it leaves each edge. Grid: the 1/3px lattice.</p>
<div style="display:flex;gap:14px;flex-wrap:wrap">${CLOSE.map(cell).join('')}</div></div>`;
}

// THE TEMPLATE (director, turn 143: "SF Symbols' bar is the blank sheet you draw on"): the badge on the 24 grid, with the three
// shape classes' cuts as the engine fits them (x 11/12), the coin for the line marks, the lattice, the centre ticks, and the
// line widths as swatches at the same scale. Read from picks7's KEY and the row's values.
function template() {
  setScale(720);
  const T_ = v => Math.round(v * 3) / 3, KEY_ = { WIDE: [12, T_(Math.PI * 36 / 12)], SQUARE: [T_(Math.sqrt(Math.PI * 36)), T_(Math.sqrt(Math.PI * 36))], TALL: [T_(Math.PI * 36 / 12), 12] }, FK_ = 11 / 12;
  let g = gridLayer();
  g += `<circle cx="12" cy="12" r="6" fill="none" stroke="${COL.ink2}" stroke-width="${f(u(1.2))}"/>`;
  const cut = (w, h, col, dash, lab, lx, ly) => `<rect x="${f(12 - w / 2)}" y="${f(12 - h / 2)}" width="${f(w)}" height="${f(h)}" fill="none" stroke="${col}" stroke-width="${f(u(1.8))}" stroke-dasharray="${dash}"/>${T(lx, ly, lab, { fs: 15, fill: col })}`;
  const [ww, wh] = KEY_.WIDE.map(v => v * FK_), [sw_] = KEY_.SQUARE.map(v => v * FK_), [tw, th] = [KEY_.TALL[0] * FK_, (KEY_.TALL[1] + 0.5) * FK_];
  g += cut(ww, wh, COL.or, '', `WIDE ${fr(ww)} × ${fr(wh)}`, 12 - ww / 2 + u(8), 12 + wh / 2 - u(10));
  g += cut(sw_, sw_, '#2F6FA8', `${f(u(8))} ${f(u(4))}`, `SQUARE ${fr(sw_)}`, 12 + sw_ / 2 - u(112), 12 - sw_ / 2 + u(22));
  g += cut(tw, th, '#6B4C9A', `${f(u(3))} ${f(u(3))}`, `TALL ${fr(tw)} × ${fr(th)} (APEX +1/2)`, 12 - tw / 2, 12 + th / 2 + u(20));
  g += T(12, 6 - u(10), 'THE COIN Ø12: OPEN MARKS SPAN IT', { fs: 13, a: 'middle', fill: COL.ink2 });
  g += `<line x1="${VB[0] + 0.2}" y1="12" x2="${VB[0] + 1.6}" y2="12" stroke="${COL.or}" stroke-width="${f(u(2.5))}"/><line x1="${VB[0] + VB[2] - 1.6}" y1="12" x2="${VB[0] + VB[2] - 0.2}" y2="12" stroke="${COL.or}" stroke-width="${f(u(2.5))}"/><line x1="12" y1="${VB[1] + 0.2}" x2="12" y2="${VB[1] + 1.2}" stroke="${COL.or}" stroke-width="${f(u(2.5))}"/><line x1="12" y1="${VB[1] + VB[3] - 1.2}" x2="12" y2="${VB[1] + VB[3] - 0.2}" stroke="${COL.or}" stroke-width="${f(u(2.5))}"/>`;
  const sheet_ = svgWrap(g, 'The template: the 24 grid with the class cuts');
  // swatches at the same scale (40px a unit)
  const S_ = 40, bar = (w, lab, sub, gap) => `<div style="display:flex;align-items:center;gap:18px;margin:0 0 16px"><svg width="${S_ * 4}" height="${Math.round(S_ * (gap ? 3 + gap : w) + 8)}" aria-hidden="true">${gap ? `<rect x="0" y="0" width="${S_ * 4}" height="${S_ * 1.5}" fill="${COL.navy}"/><rect x="0" y="${S_ * (1.5 + gap)}" width="${S_ * 4}" height="${S_ * 1.5}" fill="${COL.navy}"/>` : `<rect x="0" y="4" width="${S_ * 4}" height="${S_ * w}" fill="${COL.navy}"/>`}</svg><div><div style="font-size:19px;font-weight:700;color:${COL.navy}">${lab}</div><div style="font-size:15px;color:${COL.ink2};line-height:1.35">${sub}</div></div></div>`;
  const sw = [bar(1.5, '1 1/2: the line', 'every wall, slab, beam and plinth; outline marks (the star)'), bar(1.25, '1 1/4: a post that holds a mass up', 'stems, columns, trunks'), bar(5 / 3, '1 2/3: an open mark', 'the +, later an x or an arrow'), bar(0, '5/6: the clear band', 'a clear gap between two walls (the coupe)', 5 / 6), bar(0, '1: the cut', 'between parts that rest on each other', 1)].join('');
  const law = `<div style="margin-top:8px;font-size:15px;line-height:1.5;color:${COL.ink}"><b style="color:${COL.navy}">Rounds, by kind</b> (the law, px at 24): outside corners 0.6 · wide outside 0.7 · line ends 0.3 · tips 0.35, or 0.0877 of the shorter edge · joins, notches, counters 0.15 · wide inside 0.3 · flares 1/2 · never over 0.2 of the shorter edge.</div>`;
  return `<div style="border-top:2px solid ${COL.hair};padding:36px 0 44px"><h2 style="margin:0 0 6px;font-size:30px;color:${COL.navy}">Template: start a seventh icon here</h2>
<p style="margin:0 0 22px;font-size:17px;line-height:1.45;color:${COL.ink2};max-width:1200px">The 24 grid at 40px a unit with what the engine fits to: the three shape classes' cuts (× 11/12, as fitted), the coin, the 12 box and live circle, the 1/3px lattice and the centre ticks. Draw inside the cut of the class your drawing's proportion is nearest; the engine sizes, rounds and centres it.</p>
<div style="display:flex;gap:44px;align-items:flex-start"><div>${sheet_}</div><div style="flex:1;min-width:0;padding-top:6px"><div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${COL.ink2};text-transform:uppercase;margin:0 0 16px">Line widths, at the same scale</div>${sw}${law}</div></div></div>`;
}

function legend() {
  const sw = (svg, t) => `<div style="display:flex;align-items:center;gap:10px;font-size:15px;color:${COL.ink}"><svg width="44" height="22" viewBox="0 0 44 22" aria-hidden="true">${svg}</svg>${t}</div>`;
  const kinds = ['mass', 'tip', 'end', 'join', 'lean', 'counter', 's'].map(k => sw(`<path d="M4 18 C 14 18 18 14 22 11 S 30 4 40 4" fill="none" stroke="${KIND[k].c}" stroke-width="4" stroke-linecap="round"/>`, KIND[k].nm)).join('');
  return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:36px;margin:0 0 40px">
<div><div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${COL.ink2};text-transform:uppercase;margin:0 0 12px">Shapes diagram</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 24px">
${sw(`<line x1="0" y1="11" x2="44" y2="11" stroke="${COL.or}" stroke-width="1.3"/><circle cx="22" cy="11" r="2.5" fill="${COL.or}"/>`, 'Keyline, run past the shape · a circle\'s centre')}
${sw(`<path d="M6 17 L16 6 M38 17 L28 6" stroke="${COL.ord}" stroke-width="1.1"/><rect x="13" y="3" width="6" height="6" fill="${COL.raised}" stroke="${COL.ord}" stroke-width="1.3"/><rect x="25" y="3" width="6" height="6" fill="${COL.raised}" stroke="${COL.ord}" stroke-width="1.3"/><circle cx="6" cy="17" r="3" fill="${COL.ord}"/><circle cx="38" cy="17" r="3" fill="${COL.ord}"/>`, 'A drawn curve\'s handles')}
${sw(`<ellipse cx="22" cy="11" rx="19" ry="8" fill="none" stroke="${COL.ink2}" stroke-width="1.1" stroke-dasharray="5 4"/>`, 'The ellipse that would turn the same corner')}
${sw(`<rect x="3" y="4" width="38" height="14" fill="none" stroke="${COL.or}" stroke-width="1.6"/>`, 'A root shape (tree, star, +)')}
${sw(`<rect x="3" y="4" width="38" height="14" fill="none" stroke="${COL.or}" stroke-width="1.6" stroke-dasharray="4 2.5"/>`, 'A cut: a counter or gap')}
${sw(`<rect x="3" y="4" width="38" height="14" fill="${COL.or}" fill-opacity=".07" stroke="${COL.or}" stroke-width="1.2" stroke-dasharray="6 3"/>`, 'The size class\'s cut')}
${sw(`<line x1="22" y1="1" x2="22" y2="21" stroke="${COL.navy}" stroke-width="1.2" stroke-dasharray="10 3 2 3"/>`, 'The mirror axis')}
${sw(`<rect x="10" y="6" width="10" height="10" fill="${COL.raised}" stroke="${COL.navy}" stroke-width="1.5"/><circle cx="34" cy="11" r="4" fill="${COL.navy}"/>`, 'Box centre · ink centre')}
${sw(`<circle cx="22" cy="11" r="6.5" fill="none" stroke="${COL.or}" stroke-width="2.2"/><line x1="0" y1="11" x2="10" y2="11" stroke="${COL.or}" stroke-width="2"/><line x1="34" y1="11" x2="44" y2="11" stroke="${COL.or}" stroke-width="2"/>`, 'Optical centre, on the middle')}
${sw(`<line x1="0" y1="11" x2="44" y2="11" stroke="${COL.hair}" stroke-width="1"/><line x1="0" y1="4" x2="44" y2="4" stroke="${COL.hair}" stroke-width=".6"/><line x1="0" y1="18" x2="44" y2="18" stroke="${COL.hair}" stroke-width=".6"/>`, '1px grid · 1/3px lattice')}
${sw(`<rect x="3" y="3" width="38" height="16" fill="none" stroke="${COL.ink2}" stroke-width="1"/>`, 'The 12px box · live circle (dashes)')}
</div></div>
<div><div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${COL.ink2};text-transform:uppercase;margin:0 0 12px">Corners diagram</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 24px">${kinds}
${sw(`<circle cx="22" cy="20" r="14" fill="none" stroke="${COL.ink2}" stroke-width="1" stroke-dasharray="3 2"/><circle cx="8" cy="15" r="2.6" fill="${COL.raised}" stroke="${COL.ink2}" stroke-width="1.4"/><circle cx="36" cy="15" r="2.6" fill="${COL.raised}" stroke="${COL.ink2}" stroke-width="1.4"/>`, 'Crest circle · where the round leaves each edge')}
</div><p style="margin:12px 0 0;font-size:15px;line-height:1.4;color:${COL.ink2}">Where the glyph is mirrored, each round is numbered on the left; the right side is its mirror.</p></div></div>`;
}

function recipe() {
  const step = (n, t, b) => `<div style="padding:14px 16px;background:${COL.paper};border-top:4px solid ${COL.or}"><div style="font-size:13px;letter-spacing:.1em;font-weight:700;color:${COL.ord};text-transform:uppercase">Step ${n}</div><div style="font-size:19px;font-weight:700;color:${COL.navy};margin:2px 0 6px">${t}</div><div style="font-size:15px;line-height:1.4;color:${COL.ink}">${b}</div></div>`;
  return `<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${COL.ink2};text-transform:uppercase;margin:0 0 14px">How a seventh icon is built: the engine's order</div>
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin:0 0 44px">
${step(1, 'Draw it from root shapes', 'In the 12-unit box, every piece one root drawn whole (see Roots): slabs (beams), posts (stems, columns, trunks), gables (roofs, tiers), vessels (bowls), loops (handles), caps (plates, feet: a slab cut by one ellipse). Lines 1 1/2; a post that holds a mass up 1 1/4; horizontal edges on the 1/3px lattice; a part that rests on another is cut 1px from it.')}
${step(2, 'Let its proportion pick the class', 'Wide, Square or Tall: whichever cut of the coin is nearest the drawing\'s own width to height (a lone apex counts 1/2 more). Line marks: Outline (sized by its counter, 2 1/2 lines) or Open (arms span 12).')}
${step(3, 'Size it to the cut', 'Positions scale, line widths never do, until the finished outline just meets the cut × 11/12 in width or height.')}
${step(4, 'Join, then cut the counters', 'The shapes are united; counters and gaps are subtracted. A counter is a root too: the same shape on the same centre made smaller, the space a spacing leaves, or a root moved; sized by proportion, never by offsetting.')}
${step(5, 'Round every corner by its kind', 'The law sets a radius by angle and by what meets (mass corners 0.6, line ends 0.3, tips by their edge, joins and counters 0.15, flares 1/2; never over 0.2 of the shorter edge). Each round is solved as a smooth hill of bend, not an arc.')}
${step(6, 'Mirror', 'A symmetric glyph keeps its left half after the rounds and mirrors it, so both sides are exactly alike.')}
${step(7, 'Centre it by eye, by rule', 'Across: half-way between its box centre and its ink centre, to 1/4px. Up and down: its box centre, pulled down by half of how far its ink sits above it.')}
${step(8, 'Check it', 'The fair check (knee, tail, dip, shoulder, inflect, shelf, step), at 12, 24 and 72px by eye, and beside the other six.')}
</div>`;
}

function findings() {
  const nat = J.nature, mus = J.museum;
  const li = (t, b) => `<li style="margin:0 0 14px"><b style="color:${COL.navy}">${t}</b> ${b}</li>`;
  const curves = ['cafe', 'bar', 'museum', 'nature', 'star', 'plus'].map(id => `${SH[id].title.toLowerCase()} ${(J[id].d.match(/C/g) || []).length}`).join(', ');
  return `<div style="border-top:2px solid ${COL.hair};padding:40px 0 0"><h2 style="margin:0 0 6px;font-size:34px;color:${COL.navy}">What the construction shows</h2>
<p style="margin:0 0 20px;font-size:17px;line-height:1.45;color:${COL.ink2};max-width:1100px">Drawn from the engine's own record, these are where the build doesn't reduce to clean shapes, or where one job is done more than one way. (v233's second finding, the counters, is answered: see Roots.)</p>
<ol style="margin:0;padding-left:26px;font-size:17px;line-height:1.45;color:${COL.ink};max-width:1300px">
${li('The curve count is the price of no wobbles.', 'You asked for joins with "no visible humps or wobbles". A compass round can\'t give that: its bend switches on at once where it meets a line. So every round here is a hill of bend, 2 to 4 cubics, rising from the edge\'s own bend and falling back (the dashed circle is only its tightest point). That makes the set curve-heavy: ' + curves + '. For comparison, Lucide (checked in its source) draws on a 2px centreline: its cup\'s corners are single arcs, and its star and museum have no drawn rounds at all; the stroke\'s round join softens them.')}
${li('Some drawn curves are only aims.', 'The museum\'s capital and foot curves set where an S begins and ends; the engine draws the S. The cup\'s loop is eased in where it leaves a straight. The tree\'s tiers are re-aimed so each tip lands where the eased tip was: the drawn points move ' + 'about 0.4px (top tier) to 1px (bottom tier). So the orange shapes are exact everywhere except at those places.')}
</ol>
<p style="margin:24px 0 0;font-size:15px;color:${COL.ink2}">Built by <code>src/construction.js</code> (the row rebuilt with a logging hook in the engine; each finished outline compared with the row's svg: ${['cafe', 'bar', 'museum', 'nature', 'star', 'plus'].filter(id => J[id].same).length} of 6 identical) and <code>src/construction-board.js</code>.</p></div>`;
}

// g7aw ROOTS (owner on v233: "an icon should have root shapes at its core that are then connected / disconnected to create the
// greater form ... the top edge should be crafted holistically from the top of a circle or ellipses"; on finding #2: "Yeah I want
// it all defined by the shapes and proportions not stroke logic", "I mean it shouldn't change anything should it?"). The rule,
// the audit of every piece (src/roots-audit.js), the foot and the plate rebuilt from one ellipse (before = v233, frozen in
// svg/g7/before-g7aw/), the tries that were dropped (svg/g7/roots-tried/), and the four counters as root shapes.
const FCK = require('./fair-check.js');
const AUD = JSON.parse(fs.readFileSync(path.join(__dirname, '../svg/g7/roots-audit.json'), 'utf8'));
const BJ = JSON.parse(fs.readFileSync(path.join(__dirname, '../svg/g7/before-g7aw/construction.json'), 'utf8'));
const svgOf = rel => fs.readFileSync(path.join(__dirname, '../svg/g7', rel), 'utf8').match(/ d="([^"]+)"/)[1];
const BX = JSON.parse(fs.readFileSync(path.join(__dirname, '../svg/g7/before-g7ax/construction.json'), 'utf8'));
function vesselSvg(G, label, vb, after) {
  const px = 48, uu = v => v / px, N = COL.navy, OR = COL.or;
  let s = `<rect x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}" fill="${COL.raised}"/>`;
  for (let q = Math.ceil(vb[0]); q <= vb[0] + vb[2]; q++) s += `<line x1="${q}" y1="${vb[1]}" x2="${q}" y2="${vb[1] + vb[3]}" stroke="${COL.hair}" stroke-width="${f(uu(1))}"/>`;
  for (let q = Math.ceil(vb[1]); q <= vb[1] + vb[3]; q++) s += `<line x1="${vb[0]}" y1="${q}" x2="${vb[0] + vb[2]}" y2="${q}" stroke="${COL.hair}" stroke-width="${f(uu(1))}"/>`;
  s += `<path d="${G.d}" fill="${N}" fill-opacity=".18"/><path d="${G.d}" fill="none" stroke="${N}" stroke-width="${f(uu(1.2))}"/>`;
  const vi = G.prims.findIndex(p => p.root === 'VESSEL');
  if (after && G.prims[vi].cap) { const E_ = G.prims[vi].cap; s += `<ellipse cx="${f(E_.cx)}" cy="${f(E_.cy)}" rx="${f(E_.rx)}" ry="${f(E_.ry)}" fill="none" stroke="${OR}" stroke-width="${f(uu(1.8))}"/><circle cx="${f(E_.cx)}" cy="${f(E_.cy)}" r="${f(uu(3))}" fill="${OR}"/>`; }
  else { const cp = new paper.CompoundPath(G.parts[vi]); for (const c of (cp.children.length ? cp.children[0] : cp).curves) if (!c.isStraight()) { const P = [c.point1, c.point1.add(c.handle1), c.point2.add(c.handle2), c.point2]; s += `<path d="M${f(P[0].x)} ${f(P[0].y)}C${f(P[1].x)} ${f(P[1].y)} ${f(P[2].x)} ${f(P[2].y)} ${f(P[3].x)} ${f(P[3].y)}" fill="none" stroke="${OR}" stroke-width="${f(uu(1.6))}"/><path d="M${f(P[0].x)} ${f(P[0].y)}L${f(P[1].x)} ${f(P[1].y)}M${f(P[3].x)} ${f(P[3].y)}L${f(P[2].x)} ${f(P[2].y)}" stroke="${COL.ord}" stroke-width="${f(uu(1.1))}"/>`; } cp.remove(); }
  return `<div><svg width="${Math.round(vb[2] * px)}" height="${Math.round(vb[3] * px)}" viewBox="${vb.join(' ')}" role="img" aria-label="${label}" style="display:block">${s}</svg><div style="font-size:15px;font-weight:700;color:${N};margin-top:6px">${label}${after ? '' : ': drawn curves (handles shown)'}</div></div>`;
}
function roots() {
  const N = COL.navy, I2 = COL.ink2, OR = COL.or, OD = COL.ord;
  const aud = (icon, piece) => AUD.rows.find(r => r.icon === icon && r.piece.startsWith(piece));
  const near = r => `${r.px72 < 0.01 ? r.px72.toFixed(3) : f2(r.px72)}px at 72`;
  // ---- the rule
  const rule = [
    ['Every piece is one root shape, drawn whole:', 'a circle, an ellipse, a rectangle (a slab or a post), a triangle (a gable), a regular star, or a straight line. Its size and its place are proportions of the grid and of the other roots.'],
    ['The form is roots connected and disconnected:', 'joined into one outline, or cut apart (a counter, the 1px cut between resting parts, a slab\'s end cutting an ellipse).'],
    ['A curved edge belongs to its root, ends included.', 'No end draws its own arc. The only rounds are where roots meet or are cut, and the law sets each by its kind.'],
    ['A counter is a root too:', 'the same shape on the same centre made smaller (circle in circle, star in star), the space a spacing leaves (rectangles between posts), or a root moved (the bowl\'s side moved in for the band). Sized by proportion; never by offsetting the outline by the stroke.'],
    ['For a seventh icon:', 'before drawing, name each piece\'s root and its proportions. An edge you can\'t name that way is the one to fix.'],
  ].map(([a, b], i) => `<div style="display:flex;gap:14px;margin:0 0 10px"><span style="flex:none;width:26px;height:26px;border-radius:13px;background:${OR};color:${COL.raised};font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center">${i + 1}</span><span style="font-size:18px;line-height:1.45"><b style="color:${N}">${a}</b> ${b}</span></div>`).join('');
  // ---- the audit
  const ok = t => `<span style="color:#3E6B2F;font-weight:700">${t}</span>`, fix = t => `<span style="color:${OD};font-weight:700">${t}</span>`, open = t => `<span style="color:#7A2436;font-weight:700">${t}</span>`;
  const rows = [
    ['Cup', 'rim and walls', 'rectangle', ok('root'), ''],
    ['', 'bottom', 'one ellipse, 1.02 × the cup\'s width, 4/9 of its depth; the walls cut it', fix('rebuilt'), 'was one drawn curve a side; now moves under 0.2px at 72 (below)'],
    ['', 'ear', 'circle (half) and two arms', ok('root'), ''],
    ['', 'ear\'s counter', 'circle on the ear\'s centre, its radius 0.37 of the ear\'s, run on to the wall as a slot', ok('root'), 'named as a root this round; same drawing, byte for byte'],
    ['', 'plate', 'was: a drawn curve, each end its own round', fix('rebuilt'), 'the cap rule: a slab cut by one ellipse (below)'],
    ['Coupe', 'rim', 'rectangle (the bowl\'s flat top)', ok('root'), ''],
    ['', 'bowl\'s sides', 'one ellipse, 7/8 of the depth, its widest point the glass\'s width; the rim line cuts it just above that', fix('rebuilt'), 'was one drawn curve a side (the vessel side rule); the glass about 1% smaller in its class; the outline moves up to 0.58px at 72, the bowl\'s own shape under 0.3 (below)'],
    ['', 'clear band', 'the bowl\'s side moved in', ok('from the bowl'), 'a root moved; it inherits the bowl\'s answer'],
    ['', 'drink', 'the bowl, below the band', ok('from the bowl'), ''],
    ['', 'stem', 'rectangle (a post, 1 1/4)', ok('root'), ''],
    ['', 'foot', 'was: a drawn curve, each end its own round', fix('rebuilt'), 'the cap rule: a slab cut by one ellipse (below)'],
    ['Museum', 'gable', 'triangle on two short uprights', ok('root'), ''],
    ['', 'beam, plinth', 'rectangles (slabs)', ok('root'), ''],
    ['', 'columns', 'rectangles (posts, 1 1/4)', ok('root'), ''],
    ['', 'openings', 'rectangles: the spacing of the columns', ok('root'), ''],
    ['', 'capital and base flares', 'quarter ellipse (drawn)', ok('near'), `${near(aud('museum', 'capital'))} from it; the engine draws an S there anyway`],
    ['Tree', 'tiers', 'triangles', ok('root'), ''],
    ['', 'their swept sides', 'circle arc (drawn as a parabola)', ok('near'), `${near(aud('tree', 'tiers: the swept'))} from it`],
    ['', 'their drooping undersides', 'circle arc (drawn as two parabolas)', ok('near'), `${near(aud('tree', 'tiers: the drooping'))} from it (the bottom tier)`],
    ['', 'trunk', 'rectangle (a post, 1 1/4)', ok('root'), ''],
    ['Star', 'star', 'regular ten-point star, inner radius 0.47', ok('root'), ''],
    ['', 'counter', `the same star, ${f2(AUD.star.ratio)} its size`, fix('redefined'), 'was the outline moved in by the line; same drawing (below)'],
    ['Plus', 'arms', 'two rectangles', ok('root'), ''],
  ];
  const table = `<table style="width:100%;border-collapse:collapse;font-size:16px;line-height:1.35;margin:4px 0 0"><tr style="color:${I2};font-size:13px;letter-spacing:.06em;text-transform:uppercase"><td style="padding:4px 8px 6px 0;width:8%">Icon</td><td style="padding:4px 8px 6px;width:17%">Piece</td><td style="padding:4px 8px 6px;width:30%">Root</td><td style="padding:4px 8px 6px;width:11%">From it?</td><td style="padding:4px 0 6px 8px">Measured</td></tr>${rows.map(([a, b, c, d, e]) => `<tr style="border-top:1px solid ${a ? COL.hair : '#EEE6D6'};vertical-align:top"><td style="padding:7px 8px 5px 0;font-weight:700;color:${N}">${a}</td><td style="padding:7px 8px 5px">${b}</td><td style="padding:7px 8px 5px;color:${I2}">${c}</td><td style="padding:7px 8px 5px">${d}</td><td style="padding:7px 0 5px 8px;color:${I2}">${e}</td></tr>`).join('')}</table>`;
  // ---- the foot: v233 beside now, the root drawn whole
  const footSvg = (G, label, after) => {
    const vb = [6.4, 13.2, 11.2, 5.6], px = 56, W_ = vb[2] * px, H_ = vb[3] * px, uu = v => v / px;
    let s = `<rect x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}" fill="${COL.raised}"/>`;
    for (let q = Math.ceil(vb[0]); q <= vb[0] + vb[2]; q++) s += `<line x1="${q}" y1="${vb[1]}" x2="${q}" y2="${vb[1] + vb[3]}" stroke="${COL.hair}" stroke-width="${f(uu(1))}"/>`;
    for (let q = Math.ceil(vb[1]); q <= vb[1] + vb[3]; q++) s += `<line x1="${vb[0]}" y1="${q}" x2="${vb[0] + vb[2]}" y2="${q}" stroke="${COL.hair}" stroke-width="${f(uu(1))}"/>`;
    s += `<path d="${G.d}" fill="${N}" fill-opacity=".18"/><path d="${G.d}" fill="none" stroke="${N}" stroke-width="${f(uu(1.2))}"/>`;
    const footI = G.prims.findIndex(p => p.root === 'DOME' || (p.cap && p.root === 'ELLIPSE'));
    if (!after) {
      // the drawn top: one curve, its handles
      const cp = new paper.CompoundPath(G.parts[footI]);
      for (const c of (cp.children.length ? cp.children[0] : cp).curves) if (!c.isStraight()) { const P = [c.point1, c.point1.add(c.handle1), c.point2.add(c.handle2), c.point2]; s += `<path d="M${f(P[0].x)} ${f(P[0].y)}C${f(P[1].x)} ${f(P[1].y)} ${f(P[2].x)} ${f(P[2].y)} ${f(P[3].x)} ${f(P[3].y)}" fill="none" stroke="${OR}" stroke-width="${f(uu(1.6))}"/><path d="M${f(P[0].x)} ${f(P[0].y)}L${f(P[1].x)} ${f(P[1].y)}M${f(P[3].x)} ${f(P[3].y)}L${f(P[2].x)} ${f(P[2].y)}" stroke="${OD}" stroke-width="${f(uu(1.1))}"/>${[P[1], P[2]].map(q => `<rect x="${f(q.x - uu(3))}" y="${f(q.y - uu(3))}" width="${f(uu(6))}" height="${f(uu(6))}" fill="${COL.raised}" stroke="${OD}" stroke-width="${f(uu(1.3))}"/>`).join('')}`; }
      cp.remove();
    } else {
      const E_ = G.prims[footI].cap, hw = E_.rx / (E_.over || 7 / 6), x0 = E_.cx - hw, x1 = E_.cx + hw, yb = E_.cy, yt = yb - E_.ry;
      s += `<ellipse cx="${f(E_.cx)}" cy="${f(E_.cy)}" rx="${f(E_.rx)}" ry="${f(E_.ry)}" fill="none" stroke="${OR}" stroke-width="${f(uu(1.8))}"/><circle cx="${f(E_.cx)}" cy="${f(E_.cy)}" r="${f(uu(3))}" fill="${OR}"/>`;
      for (const x of [x0, x1]) s += `<line x1="${f(x)}" y1="${f(yt - 0.7)}" x2="${f(x)}" y2="${f(yb + 0.6)}" stroke="${OR}" stroke-width="${f(uu(1.2))}" stroke-dasharray="${f(uu(5))} ${f(uu(3))}"/>`;
      s += `<line x1="${f(E_.cx - E_.rx - 0.3)}" y1="${f(yb)}" x2="${f(E_.cx + E_.rx + 0.3)}" y2="${f(yb)}" stroke="${OR}" stroke-width="${f(uu(1.2))}"/>`;
    }
    // the rounds at the foot's ends (each end's own round before; the cuts' rounds now)
    for (const c of G.corners) { const y = c.P0 ? c.P0[1] : c.pA[1]; if (!c.convex || y < G.mFin.box.y1 - 1.6 || y > G.mFin.box.y1 - 0.2) continue; const dd = c.cubics.map((P, j) => `${j ? '' : `M${f(P[0][0])} ${f(P[0][1])}`}C${f(P[1][0])} ${f(P[1][1])} ${f(P[2][0])} ${f(P[2][1])} ${f(P[3][0])} ${f(P[3][1])}`).join(''); s += `<path d="${dd}" fill="none" stroke="${KIND.end.c}" stroke-width="${f(uu(5))}" stroke-linecap="round"/>`; }
    return `<div><svg width="${Math.round(W_)}" height="${Math.round(H_)}" viewBox="${vb.join(' ')}" role="img" aria-label="${label}" style="display:block">${s}</svg><div style="font-size:15px;font-weight:700;color:${N};margin-top:6px">${label}</div></div>`;
  };
  const N8 = (d, x, y, w, h, px) => `<svg width="${Math.round(px * w / h)}" height="${px}" viewBox="${f2(x)} ${f2(y)} ${w} ${h}" style="background:${COL.paper};display:block" aria-hidden="true"><path d="${d}" fill="${N}"/></svg>`;
  const ring = `<circle cx="12" cy="12" r="11.25" fill="${COL.paper}" stroke="${N}" stroke-width="1.5"/>`;
  const sz = d => `<svg width="12" height="12" viewBox="6 6 12 12" aria-hidden="true"><path d="${d}" fill="${N}"/></svg><svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">${ring}<path d="${d}" fill="${N}"/></svg><svg width="72" height="72" viewBox="0 0 24 24" aria-hidden="true"><path d="${d}" fill="${N}"/></svg>`;
  const zoomFoot = d => { const b = pathBox(d); return N8(d, b.x0 - 0.3, b.y1 - 2.1, 3.6, 2.4, 170); };
  const zoomPlate = d => { const b = pathBox(d); return N8(d, b.x0 - 0.3, b.y1 - 1.9, 4.4, 2.2, 150); };
  const cell = (inner, t, sub, strong) => `<div>${inner}<div style="font-size:15px;font-weight:700;color:${strong ? N : I2};margin-top:6px">${t}</div>${sub ? `<div style="font-size:14px;color:${I2};max-width:250px;line-height:1.35">${sub}</div>` : ''}</div>`;
  const nf = d => { const n = FCK.check(d).length; return n ? `${n} faults in the fair check` : 'fair check clean'; };
  const tried = [['roots-tried/bar-circle.svg', 'One circle, the old ends', 'no visible change: within 0.03px of v233 at 72; the ends still draw their own rounds'], ['roots-tried/bar-ellipse-upright.svg', 'The ellipse turning upright, no cut', 'the nicest roll, but its bend switches on at once at the upright (a jump)'], ['roots-tried/bar-half-ellipse.svg', 'A whole half ellipse', 'the ends come to a beak']];
  const tryRow = tried.map(([f_, t, sub]) => cell(zoomFoot(svgOf(f_)), t, `${sub}; ${nf(svgOf(f_))}`)).join('');
  // ---- the counters as root shapes
  const ctr = (id, vb, extra, t, how, same) => { const G = J[id], px = 250, uu = v => v * vb[2] / px; return `<div style="width:${px}px"><svg width="${px}" height="${px}" viewBox="${vb.join(' ')}" style="display:block;background:${COL.raised}" aria-hidden="true"><path d="${G.d}" fill="${N}" fill-opacity=".18"/><path d="${G.d}" fill="none" stroke="${N}" stroke-width="${f(uu(1.1))}"/>${extra(uu)}</svg><div style="font-size:17px;font-weight:700;color:${N};margin-top:8px">${t}</div><div style="font-size:15px;line-height:1.4;color:${COL.ink};margin-top:2px">${how}</div><div style="font-size:14px;line-height:1.35;color:${I2};margin-top:4px">${same}</div></div>`; };
  const cupX = uu => KG.cafe.circles.map(({ C, r }) => `<circle cx="${f(C.x)}" cy="${f(C.y)}" r="${f(r)}" fill="none" stroke="${OR}" stroke-width="${f(uu(1.6))}"/>`).join('') + `<circle cx="${f(KG.cafe.circles[0].C.x)}" cy="${f(KG.cafe.circles[0].C.y)}" r="${f(uu(3))}" fill="${OR}"/>`;
  const starX = uu => { const G = J.star, i = G.prims.findIndex(p => p.cut); return `<path d="${G.parts[0]}" transform="translate(0 ${f(G.dy)})" fill="none" stroke="${OR}" stroke-width="${f(uu(1.6))}"/><path d="${G.parts[i]}" transform="translate(0 ${f(G.dy)})" fill="none" stroke="${OR}" stroke-width="${f(uu(1.6))}" stroke-dasharray="${f(uu(5))} ${f(uu(3))}"/><circle cx="${G.centre[0]}" cy="${f(G.centre[1] + G.dy)}" r="${f(uu(3))}" fill="${OR}"/>`; };
  const musX = uu => { const G = J.museum, posts = G.parts.map((d, i) => [d, G.prims[i]]).filter(([, p]) => p.root === 'POST').map(([d]) => pathBox(d)).sort((a, b) => a.x0 - b.x0); let s = ''; for (let i = 0; i + 1 < posts.length; i++) { const a = posts[i], b = posts[i + 1]; s += `<rect x="${f(a.x1)}" y="${f(a.y0)}" width="${f(b.x0 - a.x1)}" height="${f(a.y1 - a.y0)}" fill="none" stroke="${OR}" stroke-width="${f(uu(1.6))}" stroke-dasharray="${f(uu(5))} ${f(uu(3))}"/>`; } return s; };
  const barX = uu => { const G = J.bar, cp = new paper.CompoundPath(G.parts[0]); let s = ''; for (const c of cp.children.length ? cp.children[0].curves : cp.curves) { if (c.isStraight()) continue; const sg = c.bounds.center.x < (G.sym || 12) ? 1 : -1; const P = [c.point1, c.point1.add(c.handle1), c.point2.add(c.handle2), c.point2]; const Q = P.map(v => v.add(new paper.Point(sg * 1.5, 0))); s += `<path d="M${f(P[0].x)} ${f(P[0].y)}C${f(P[1].x)} ${f(P[1].y)} ${f(P[2].x)} ${f(P[2].y)} ${f(P[3].x)} ${f(P[3].y)}" fill="none" stroke="${OR}" stroke-width="${f(uu(1.6))}"/><path d="M${f(Q[0].x)} ${f(Q[0].y)}C${f(Q[1].x)} ${f(Q[1].y)} ${f(Q[2].x)} ${f(Q[2].y)} ${f(Q[3].x)} ${f(Q[3].y)}" fill="none" stroke="${OR}" stroke-width="${f(uu(1.6))}" stroke-dasharray="${f(uu(5))} ${f(uu(3))}"/>`; } cp.remove(); return s; };
  const bw = AUD.bandWall.map(v => v.toFixed(2));
  const counters = [
    ctr('cafe', (() => { const { C, r } = KG.cafe.circles[0]; return [C.x - r - 2.2, C.y - r - 1.2, 2 * r + 3.4, 2 * r + 3.4].map(f); })(), cupX, 'The cup\'s ear', 'A circle on the ear\'s own centre, its radius 0.37 of the ear\'s, run on to the cup\'s wall as a slot. Two concentric circles: the wall is even all round, 1 1/2.', 'Same drawing, byte for byte (it always was this circle; now it is named as one).'),
    ctr('museum', [5, 8.5, 14, 14], musX, 'The museum\'s openings', 'Rectangles: what the four columns\' spacing leaves between the beam and the plinth. The columns are 1 1/4 (the post rule).', 'Same drawing, byte for byte (nothing to change: they were never offsets).'),
    ctr('star', [3, 3, 18, 18], starX, 'The star\'s counter', `The same star on the same centre, ${f2(AUD.star.ratio)} its size. A regular star's ten edges all stand the same distance from its centre, so the smaller star leaves every wall the same, 1 1/2.`, `Same drawing: under 0.0001px apart at 72 before the rounds (the old erosion ran on a 1/100000 grid); after the rounds, within 0.002px at 72.`),
    ctr('bar', [6.6, 6.9, 10.8, 10.8], barX, 'The coupe\'s clear band', 'The bowl\'s own side (solid) moved in sideways (dashed), between the rim and the drink: a root moved, not an offset. Walls 1 1/2 across; measured square to the bowl they are ' + bw.join(' → ') + 'px down the band (v234: 1.44 → 1.30, the look you approved at v144; the bowl is now its ellipse, so the band follows it).', 'Same rule (it was already the bowl\'s shape); it moved only because the bowl is now its ellipse.'),
  ].join('');
  const tbl = (r) => r.map(([a, b]) => `<div style="padding:10px 0;border-top:1px solid ${COL.hair};display:flex;gap:18px"><div style="width:260px;flex:none;font-weight:700;color:${N};font-size:17px">${a}</div><div style="font-size:17px;line-height:1.45">${b}</div></div>`).join('');
  const retire = tbl([
    ['The plate rule', '<b>Retired.</b> Its drawn curve ("flat on top, the underside dropping 1/2px at the centre, ends 1px") is now the cap rule\'s ellipse underneath. One rule draws the plate and the foot.'],
    ['The domed foot', '<b>Retired</b> (the dome options in the code stay only for the archived rows). The foot is the cap rule\'s ellipse on top.'],
    ['The leaned flare', '<b>Kept.</b> Built without it, the four shelves come back where the stem meets the bowl and the foot: a root\'s crown is level under the stem, whatever the root. So it is still the rule for that kind of corner (a line into a gentle curve bending the other way).'],
    ['The vessel side rule\'s drawn handles', '<b>Replaced</b> by one ellipse per side (above). What the rule was for, a side that turns from the rim on with no upright run, the ellipse does by where the rim cuts it.'],
    ['"A counter is the outline moved in by the line"', '<b>Replaced</b>, as you asked, by rule 4 above. The star was the only icon built that way.'],
  ]);
  return `<div style="border-top:2px solid ${COL.hair};padding:36px 0 44px">
<h2 style="margin:0 0 10px;font-size:34px;color:${N}">Roots: every piece from a root shape</h2>
<div style="margin:0 0 10px;padding:14px 18px;background:${COL.paper};border-top:4px solid ${OR};font-size:19px;line-height:1.4;color:${N};font-weight:600;max-width:1400px">"So an icon should have root shapes at its core that are then connected / disconnected to create the greater form. I'm realizing not all pieces have clear root shapes they are derived from - notably the foot (currently in use on the coupe) which I think is what's causing the hump…each top point on the left and right side are drawing their own arc, when the top edge should be crafted holistically from the top of a circle or ellipses"</div>
<div style="margin:0 0 26px;padding:14px 18px;background:${COL.paper};font-size:19px;line-height:1.4;color:${N};font-weight:600;max-width:1400px">On the counters: "Yeah I want it all defined by the shapes and proportions not stroke logic" · "I mean it shouldn't change anything should it?"</div>
<div style="max-width:1300px"><div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${I2};text-transform:uppercase;margin:0 0 14px">The rule, for every icon</div>${rule}</div>
<div style="margin-top:30px"><div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${I2};text-transform:uppercase;margin:0 0 6px">The audit: every piece of the six</div>${table}
<p style="margin:12px 0 0;font-size:15px;line-height:1.4;color:${I2};max-width:1300px">Every piece now has a root. "Near": a drawn curve that sits within a tenth of a pixel of its root at 72px (measured by src/roots-audit.js); rebuilding those would change nothing you could see.</p></div>
<h3 style="margin:40px 0 6px;font-size:26px;color:${N}">The foot, rebuilt from one ellipse</h3>
<p style="margin:0 0 18px;font-size:17px;line-height:1.45;max-width:1300px">v233: the top was one drawn curve (handles shown), but each end made its own round (thick) where it met the upright. Now: the cap rule. One ellipse (orange, drawn whole past the glyph: 7/6 the foot's width, its full height, centred on its base) makes the top and both shoulders; the slab's ends (dashed) cut it at about half its height, and only those cuts take a round (thick), set by the law. The stem's flares into it are unchanged. The shoulders move 0.18px at most in the 24px badge, 0.55px at 72.</p>
<div style="display:flex;gap:28px;flex-wrap:wrap">${footSvg(BJ.bar, 'v233', false)}${footSvg(J.bar, 'Now: the cap rule', true)}</div>
<div style="display:flex;gap:28px;align-items:flex-end;flex-wrap:wrap;margin:22px 0 0">
${cell(zoomFoot(BJ.bar.d), 'v233, at about your zoom', '')}${cell(zoomFoot(J.bar.d), 'Now', nf(J.bar.d), true)}
<div style="padding:12px 14px;background:${COL.paper}"><div style="display:flex;gap:14px;align-items:center"><span style="width:44px;font-size:14px;color:${I2}">v233</span>${sz(BJ.bar.d)}</div><div style="display:flex;gap:14px;align-items:center;margin-top:8px"><span style="width:44px;font-size:14px;color:${N};font-weight:700">now</span>${sz(J.bar.d)}</div></div></div>
<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${I2};text-transform:uppercase;margin:26px 0 10px">Tried and dropped</div>
<div style="display:flex;gap:28px;flex-wrap:wrap">${tryRow}</div>
<h3 style="margin:40px 0 6px;font-size:26px;color:${N}">The plate: the same rule, upside down</h3>
<p style="margin:0 0 18px;font-size:17px;line-height:1.45;max-width:1300px">The cup sits on the flat; the ellipse is underneath, 7/6 the plate's width and its full height. Its ends are a little thinner than the plate rule's 1px. Is that still the plate you want?</p>
<div style="display:flex;gap:28px;align-items:flex-end;flex-wrap:wrap">${cell(zoomPlate(BJ.cafe.d), 'v233: the plate rule', '')}${cell(zoomPlate(J.cafe.d), 'Now: the cap rule', nf(J.cafe.d), true)}
<div style="padding:12px 14px;background:${COL.paper}"><div style="display:flex;gap:14px;align-items:center"><span style="width:44px;font-size:14px;color:${I2}">v233</span>${sz(BJ.cafe.d)}</div><div style="display:flex;gap:14px;align-items:center;margin-top:8px"><span style="width:44px;font-size:14px;color:${N};font-weight:700">now</span>${sz(J.cafe.d)}</div></div></div>
<h3 style="margin:40px 0 6px;font-size:26px;color:${N}">The bowl and the cup: one ellipse each, cut by their neighbours</h3>
<p style="margin:0 0 18px;font-size:17px;line-height:1.45;max-width:1300px">The same rule as the foot, for a vessel's curved side. <b>The coupe's bowl</b>: one ellipse (orange, whole), its lowest point the bowl's bottom, 7/8 of the bowl's depth tall, its widest point the glass's width; the rim line cuts it just above that, so the side turns from the rim on, with no upright run. The clear band is still the bowl's side moved in, so it follows. <b>The cup's bottom</b>: one ellipse 1.02 times the cup's width and 4/9 of its depth tall; the straight walls cut it a little inside its widest point (where a wall met an ellipse with no cut, the bend switched on at once: a jump, tried and dropped). v234 beside now.</p>
<div style="display:flex;gap:28px;flex-wrap:wrap">${vesselSvg(BX.bar, 'Coupe, v234', [5.6, 6.6, 12.8, 7], false)}${vesselSvg(J.bar, 'Coupe, now', [5.6, 6.6, 12.8, 7], true)}</div>
<div style="display:flex;gap:28px;flex-wrap:wrap;margin-top:18px">${vesselSvg(BX.cafe, 'Cup, v234', [5.2, 6.4, 13, 7.6], false)}${vesselSvg(J.cafe, 'Cup, now', [5.2, 6.4, 13, 7.6], true)}</div>
<div style="display:flex;gap:28px;align-items:flex-end;flex-wrap:wrap;margin:22px 0 0">
<div style="padding:12px 14px;background:${COL.paper}"><div style="display:flex;gap:14px;align-items:center"><span style="width:44px;font-size:14px;color:${I2}">v234</span>${sz(BX.bar.d)}${sz(BX.cafe.d)}</div><div style="display:flex;gap:14px;align-items:center;margin-top:8px"><span style="width:44px;font-size:14px;color:${N};font-weight:700">now</span>${sz(J.bar.d)}${sz(J.cafe.d)}</div></div>
<div style="max-width:700px;font-size:16px;line-height:1.45">${nf(J.bar.d)} (coupe), ${nf(J.cafe.d)} (cup). One fix to the check, stated plainly: its shoulder walk counted the whole ellipse side as part of the rim's round, because an ellipse's bend rises gently toward its end; it now stops where a round lands on a curved edge's steady bend. Every earlier row's count is unchanged by it (v223-v234 rechecked).</div></div>
<h3 style="margin:40px 0 6px;font-size:26px;color:${N}">The four counters, as shapes and proportions</h3>
<p style="margin:0 0 18px;font-size:17px;line-height:1.45;max-width:1300px">You asked whether it changes anything: it doesn't. Three were already root shapes and are now named as them; the star's is rebuilt as a smaller star and comes out the same. Monoweight holds, for a reason that is about shapes: the walls are even wherever the hole is the same shape as the outside on the same centre (circle in circle, regular star in star) or the space between parallel posts. Where that isn't true, proportion alone would let the walls vary: a smaller ellipse inside an ellipse, scaled, is thicker at its ends than its sides. So a future counter in an ellipse takes the same ellipse less a wall on each axis: in an 8 × 10 ellipse with a 1 1/2 wall that keeps the walls at 1.49 to 1.50 (scaled instead, they would run 1.50 to 1.88).</p>
<div style="display:flex;gap:28px;flex-wrap:wrap">${counters}</div>
<h3 style="margin:40px 0 6px;font-size:26px;color:${N}">Rules this retires, and the one it keeps</h3>
${retire}
</div>`;
}

function sheet() {
  return `<div style="width:1800px;box-sizing:border-box;padding:56px 64px 64px;background:${COL.raised};font-family:Archivo,Arial,sans-serif;color:${COL.ink}">
<div style="font-size:14px;letter-spacing:.12em;font-weight:700;color:${COL.ink2};text-transform:uppercase">Icon grid · the system's proof</div>
<h1 style="margin:6px 0 14px;font-size:44px;line-height:1.1;color:${COL.navy}">Construction</h1>
<div style="margin:0 0 24px;padding:18px 20px;background:${COL.paper};border-top:4px solid ${COL.or};font-size:22px;line-height:1.35;color:${COL.navy};font-weight:600;max-width:1150px">"These are looking great. I want to see a diagram now that overlays the shapes used to make these shapes on top of them, a construction diagram"</div>
<p style="margin:0 0 36px;font-size:19px;line-height:1.45;max-width:1150px">Each of the six, as the engine builds it, on the 24 grid. Large, left: the shapes it is built from, run past the glyph, with its size class, mirror and optical centre (40px a unit). Right: every round it drew, coloured by its kind. Every line here is read from the code's record of the build, not drawn after it.</p>
${roots()}
${legend()}
${closeUps()}
${['cafe', 'bar', 'museum', 'nature', 'star', 'plus'].map(iconRow).join('')}
${template()}
<div style="border-top:2px solid ${COL.hair};padding:40px 0 0">${recipe()}</div>
${findings()}
</div>`;
}

const html = sheet();
const ROOT = path.join(__dirname, '..');
fs.writeFileSync(path.join(ROOT, 'construction-g7.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Construction</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&display=swap">
<style>body{margin:0}</style></head><body>${html}</body></html>\n`);
const out = process.argv[2];
if (out) { fs.mkdirSync(path.join(out, 'project'), { recursive: true }); fs.writeFileSync(path.join(out, 'project', 'Grid7Construction.dc.html'), `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Construction</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&amp;display=swap">
<style>
body{margin:0}
</style>
</helmet>
${html}
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":1800,"height":1000}}'>
class Component extends DCLogic {
renderVals() { return {}; }
}
</script>
</body>
</html>
`); }
console.log('ok', html.length);
