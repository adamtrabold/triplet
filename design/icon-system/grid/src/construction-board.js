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
const VB = [3, 3, 18, 18], PX = 540, K = PX / VB[2];   // 30px a unit of the 24 grid
const u = px => px / K;                                  // screen px -> units
const T = (x, y, t, o = {}) => `<text x="${f(x)}" y="${f(y)}" font-family="Archivo, Arial, sans-serif" font-size="${f(u(o.fs || 13))}" font-weight="${o.fw || 700}" fill="${o.fill || COL.ink2}" text-anchor="${o.a || 'start'}" letter-spacing="${f(u(o.ls ?? 0.6))}" paint-order="stroke" stroke="${COL.raised}" stroke-width="${f(u(o.halo ?? 3))}" stroke-linejoin="round">${t}</text>`;

function gridLayer() {
  let g = `<rect x="${VB[0]}" y="${VB[1]}" width="${VB[2]}" height="${VB[3]}" fill="${COL.raised}"/>`;
  for (let i = 3 * VB[0] + 1; i < 3 * (VB[0] + VB[2]); i++) if (i % 3) g += `<line x1="${f(i / 3)}" y1="${VB[1]}" x2="${f(i / 3)}" y2="${VB[1] + VB[3]}" stroke="${COL.hair}" stroke-width="${f(u(0.6))}" opacity=".55"/><line x1="${VB[0]}" y1="${f(i / 3)}" x2="${VB[0] + VB[2]}" y2="${f(i / 3)}" stroke="${COL.hair}" stroke-width="${f(u(0.6))}" opacity=".55"/>`;
  for (let i = VB[0] + 1; i < VB[0] + VB[2]; i++) g += `<line x1="${i}" y1="${VB[1]}" x2="${i}" y2="${VB[1] + VB[3]}" stroke="${COL.hair}" stroke-width="${f(u(1))}"/><line x1="${VB[0]}" y1="${i}" x2="${VB[0] + VB[2]}" y2="${i}" stroke="${COL.hair}" stroke-width="${f(u(1))}"/>`;
  g += `<circle cx="12" cy="12" r="8" fill="none" stroke="${COL.ink2}" stroke-width="${f(u(1))}" stroke-dasharray="${f(u(5))} ${f(u(4))}" opacity=".7"/>`;
  g += `<rect x="6" y="6" width="12" height="12" fill="none" stroke="${COL.ink2}" stroke-width="${f(u(1))}" opacity=".8"/>`;
  for (const v of [6, 12, 18]) g += T(v, VB[1] + u(15), `${v}`, { fs: 11, a: 'middle', fw: 600 }) + T(VB[0] + u(5), v + u(4), `${v}`, { fs: 11, fw: 600 });
  return g;
}
const glyphFill = d => `<path d="${d}" fill="${COL.navy}" fill-opacity=".13" fill-rule="nonzero"/><path d="${d}" fill="none" stroke="${COL.navy}" stroke-width="${f(u(1))}" opacity=".85"/>`;
const marker = (x, y, t, col, lx, ly) => `${lx != null ? `<line x1="${f(lx)}" y1="${f(ly)}" x2="${f(x)}" y2="${f(y)}" stroke="${col}" stroke-width="${f(u(1.2))}"/>` : ''}<circle cx="${f(x)}" cy="${f(y)}" r="${f(u(11))}" fill="${col}" stroke="${COL.raised}" stroke-width="${f(u(2))}"/>${T(x, y + u(4.6), t, { fs: 13, a: 'middle', fill: COL.raised, halo: 0, ls: 0 })}`;
const svgWrap = (inner, label) => `<svg width="${PX}" height="${PX}" viewBox="${VB.join(' ')}" role="img" aria-label="${label}" style="display:block;flex:none">${inner}</svg>`;

// ---- per icon: what the sheet says about its shapes (A, B, ... on the shapes diagram), from the code's own values
const g = J;
const ROOTCOL = COL.or;
const SH = {
  cafe: {
    title: 'Café', who: 'cup on a plate',
    tags: [['VESSEL', 8.2, 9.1], ['LOOP', 15.9, 7.2], ['PLATE (DOME)', 7.2, 17.2], ['COUNTER', 14.75, 13.8, 'cut']],
    notes: G => [
      ['A', [8.7, 12.6], `<b>Vessel.</b> A flat rim, two straight walls (a side drawn straight is a line), and one half-ellipse under them: two cubics.`],
      ['B', [17.3, 9.9], `<b>Loop.</b> The ear: its back a half circle (two quarter cubics), laid over the right wall; the union joins them.`],
      ['C', [15.75, 10.29], `<b>Its counter</b> is drawn, not offset: two quarter curves that follow the back, so the band is 1 1/2 at the arms and the back.`],
      ['D', [12, 16.85], `<b>Plate rule.</b> Flat on top; the underside drops 1/2 at the middle, so its ends are 1px. 1px cut above it.`],
      ['E', [12, 6.15], `<b>Size class:</b> Wide. Its saucer meets the sides of the cut. <b>No mirror</b>: the only glyph built whole.`],
    ] },
  bar: {
    title: 'Bar', who: 'coupe',
    tags: [['VESSEL', 5.9, 7.2], ['POST 1 1/4', 13.0, 14.25], ['FOOT (DOME)', 5.6, 17.85], ['BAND', 4.6, 9.75, 'cut']],
    notes: G => [
      ['A', [12, 12.15], `<b>Vessel.</b> A flat rim and one curve a side to the bottom (the vessel side rule: handles 1/2 the depth down and 1 1/2 in).`],
      ['B', [9.05, 9.82], `<b>The clear band</b> is the bowl's own side over the band's height, moved in by the line: same curve as the outside. 5/6 tall under a 1 1/2 rim.`],
      ['C', [12, 14.1], `<b>Post rule.</b> A post that holds a mass up is 1 1/4. It runs half-way into the foot, so its sides meet the foot in a real join.`],
      ['D', [12, 16.3], `<b>The foot by the plate rule:</b> flat underneath, its top rises 1/2 at the middle; ends 1px.`],
      ['E', [12, 6.15], `<b>Size class:</b> Square. The rim meets the sides. Right half = the left, mirrored.`],
    ] },
  museum: {
    title: 'Museum', who: 'temple',
    tags: [['GABLE', 8.0, 7.75], ['BEAM (SLAB)', 3.6, 10.55], ['POST 1 1/4', 8.95, 14.15], ['PLINTH (SLAB)', 3.6, 18.0]],
    notes: G => [
      ['A', [12, 7.6], `<b>Gable</b> with 1.2 upright ends, apex 1/2 over the top.`],
      ['B', [14.4, 10.43], `<b>The separated gable:</b> it rests on its beam across the 1px cut (a part that rests on another is cut from it).`],
      ['C', [16.7, 12.25], `<b>Capital and foot:</b> past the outer posts the beam and the plinth thin to 1px ends; the outer posts flare 1/2 into them, outside only.`],
      ['D', [12, 13.95], `<b>Openings</b> are the gaps the posts leave: square, tight. Posts 1 1/4 (post rule).`],
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
      ['B', [7.75, 11.45], `<b>Outline rule:</b> the counter is the outside (before rounding) moved in by the line; then the law rounds it, tight.`],
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

function shapesSvg(id) {
  const G = J[id], S = SH[id];
  let s = gridLayer();
  // class cut (the place icons): the cut's size about the finished box's centre
  if (G.cut) { const b = G.mFin.box, [w, h] = G.cut, cx = b.cx, cy = b.cy; s += `<rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${f(w)}" height="${f(h)}" fill="${COL.or}" fill-opacity=".07" stroke="${COL.or}" stroke-width="${f(u(1.2))}" stroke-dasharray="${f(u(6))} ${f(u(3))}"/>`; }
  if (id === 'plus') s += `<circle cx="12" cy="12" r="6" fill="${COL.or}" fill-opacity=".07" stroke="${COL.or}" stroke-width="${f(u(1.2))}" stroke-dasharray="${f(u(6))} ${f(u(3))}"/>`;
  s += glyphFill(G.d);
  // the root shapes as the engine received them: placed and sized, before the union; cuts dashed
  const sh = G.dy ? `<g transform="translate(0 ${f(G.dy)})">` : '<g>';
  s += sh;
  G.parts.forEach((d, i) => { const p = G.prims[i]; if (p.t === 'E') return; s += `<path d="${d}" fill="none" stroke="${ROOTCOL}" stroke-width="${f(u(1.6))}" ${p.cut ? `stroke-dasharray="${f(u(4))} ${f(u(2.5))}"` : ''} stroke-linejoin="round"/>`; });
  // counters by offset (E): the outline it is taken from (thin), and the counter (dashed)
  G.prims.forEach((p, i) => { if (p.t !== 'E') return; s += `<path d="${G.parts[i]}" fill="none" stroke="${ROOTCOL}" stroke-width="${f(u(1.6))}" stroke-dasharray="${f(u(4))} ${f(u(2.5))}"/>`; });
  s += '</g>';
  if (id === 'star') {   // the centreline star the outline is drawn on
    const c = G.centre, R = G.Rc, ri = G.ri, pts = []; for (let i = 0; i < 10; i++) { const r = i % 2 ? ri : R, a = -Math.PI / 2 + i * Math.PI / 5; pts.push(`${f(c[0] + r * Math.cos(a))},${f(c[1] + r * Math.sin(a) + G.dy)}`); }
    s += `<polygon points="${pts.join(' ')}" fill="none" stroke="${COL.ink2}" stroke-width="${f(u(1))}" stroke-dasharray="${f(u(2))} ${f(u(2))}"/><circle cx="${c[0]}" cy="${f(c[1] + G.dy)}" r="${f(R)}" fill="none" stroke="${COL.ink2}" stroke-width="${f(u(0.8))}" opacity=".5"/><circle cx="${c[0]}" cy="${f(c[1] + G.dy)}" r="${f(ri)}" fill="none" stroke="${COL.ink2}" stroke-width="${f(u(0.8))}" opacity=".5"/>`;
  }
  // the mirror
  if (G.sym != null) s += `<line x1="${f(G.sym)}" y1="${VB[1] + 0.9}" x2="${f(G.sym)}" y2="${VB[1] + VB[3] - 0.3}" stroke="${COL.navy}" stroke-width="${f(u(1.2))}" stroke-dasharray="${f(u(10))} ${f(u(3))} ${f(u(2))} ${f(u(3))}"/>${T(G.sym + u(6), VB[1] + VB[3] - u(9), 'MIRROR', { fs: 11, fill: COL.navy })}`;
  // optical centre: the badge's middle (orange), the box centre (open square), the ink centroid (dot)
  const b = G.mFin.box, oy = b.cy - 0.5 * Math.max(0, b.cy - G.mFin.cy), ox = (b.cx + G.mFin.cx) / 2;
  s += `<line x1="${VB[0] + 0.2}" y1="12" x2="${VB[0] + 1.6}" y2="12" stroke="${COL.or}" stroke-width="${f(u(2))}"/><line x1="${VB[0] + VB[2] - 1.6}" y1="12" x2="${VB[0] + VB[2] - 0.2}" y2="12" stroke="${COL.or}" stroke-width="${f(u(2))}"/>`;
  s += `<rect x="${f(b.cx - u(5))}" y="${f(b.cy - u(5))}" width="${f(u(10))}" height="${f(u(10))}" fill="${COL.raised}" stroke="${COL.navy}" stroke-width="${f(u(1.5))}"/><circle cx="${f(G.mFin.cx)}" cy="${f(G.mFin.cy)}" r="${f(u(4))}" fill="${COL.navy}"/><circle cx="${f(ox)}" cy="${f(oy)}" r="${f(u(6.5))}" fill="none" stroke="${COL.or}" stroke-width="${f(u(2.2))}"/>`;
  // root names
  for (const [t, x, y, cut] of S.tags) s += T(x, y, t, { fs: 12, fill: COL.ord });
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
const note = (L, col, html) => `<div style="display:flex;gap:10px;align-items:flex-start;margin:0 0 10px"><span style="flex:none;width:22px;height:22px;border-radius:11px;background:${col};color:${COL.raised};font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;margin-top:1px">${L}</span><span style="font-size:15px;line-height:1.4;color:${COL.ink}">${html}</span></div>`;

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
<div style="display:flex;gap:36px;align-items:flex-start">
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

function legend() {
  const sw = (svg, t) => `<div style="display:flex;align-items:center;gap:10px;font-size:15px;color:${COL.ink}"><svg width="44" height="22" viewBox="0 0 44 22" aria-hidden="true">${svg}</svg>${t}</div>`;
  const kinds = ['mass', 'tip', 'end', 'join', 'lean', 'counter', 's'].map(k => sw(`<path d="M4 18 C 14 18 18 14 22 11 S 30 4 40 4" fill="none" stroke="${KIND[k].c}" stroke-width="4" stroke-linecap="round"/>`, KIND[k].nm)).join('');
  return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:36px;margin:0 0 40px">
<div><div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${COL.ink2};text-transform:uppercase;margin:0 0 12px">Shapes diagram</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 24px">
${sw(`<rect x="3" y="4" width="38" height="14" fill="none" stroke="${COL.or}" stroke-width="1.6"/>`, 'A root shape, placed and sized')}
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
${step(1, 'Draw it from root shapes', 'In the 12-unit box: slabs (bases, beams), posts (stems, columns, trunks), gables (roofs, tiers), vessels (bowls), loops (handles), domes (plates, feet). Lines 1 1/2; a post that holds a mass up 1 1/4; horizontal edges on the 1/3px lattice; a part that rests on another is cut 1px from it.')}
${step(2, 'Let its proportion pick the class', 'Wide, Square or Tall: whichever cut of the coin is nearest the drawing\'s own width to height (a lone apex counts 1/2 more). Line marks: Outline (sized by its counter, 2 1/2 lines) or Open (arms span 12).')}
${step(3, 'Size it to the cut', 'Positions scale, line widths never do, until the finished outline just meets the cut × 11/12 in width or height.')}
${step(4, 'Join, then cut the counters', 'The shapes are united; counters and gaps are subtracted. A counter keeps the wall a line wide (see the findings: four ways today).')}
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
<p style="margin:0 0 20px;font-size:17px;line-height:1.45;color:${COL.ink2};max-width:1100px">Drawn from the engine's own record, these are the places where the build doesn't reduce to clean shapes, or where one job is done more than one way. They're findings, not changes: no drawing changed for this board.</p>
<ol style="margin:0;padding-left:26px;font-size:17px;line-height:1.45;color:${COL.ink};max-width:1300px">
${li('Every round is a hill of bend, not a circle.', 'Each is 2 to 4 cubics whose bend rises from the edge\'s own and falls back; the dashed circle is only its tightest point. No compass draws them; only the engine can. That is what keeps the lines leaving a join smooth, and it is also why the set has many curves: ' + curves + '. Central or Lucide would use one curve a corner.')}
${li('Counters are made four ways.', 'The star\'s counter is its outline moved in by the line. The coupe\'s band is the bowl\'s side shifted sideways by the line. The cup\'s ear is two quarter curves drawn to follow its back. The museum\'s openings are just the gaps the posts leave. All four keep the wall a line wide, but only the first is one rule a seventh icon could follow without choosing. <b>Question:</b> should one of them become the rule?')}
${li('Some drawn curves are only aims.', 'The museum\'s capital and foot curves set where an S begins and ends; the engine draws the S. The cup\'s loop is eased in where it leaves a straight. The tree\'s tiers are re-aimed so each tip lands where the eased tip was: the drawn points move ' + 'about 0.4px (top tier) to 1px (bottom tier). So the orange shapes are exact everywhere except at those places.')}
${li('The mirror hides one seam.', 'Built whole, the museum\'s right half has a 0.0004px step where the capital meets the outer post (the drawing rounds to 3 decimals, the post doesn\'t), so its outer opening\'s corners would take 0.10 instead of 0.15. The mirror replaces the right half with the left, so it never shows. An asymmetric icon wouldn\'t have that safety net.')}
${li('Every slab is the line, 1 1/2.', 'The 4/3px horizontal in the drawing code\'s notes isn\'t used by this row: monoweight makes bases and beams 1 1/2. Only the posts that hold a mass up (1 1/4), the coupe\'s band (5/6) and the + (1 2/3) differ.')}
</ol>
<p style="margin:24px 0 0;font-size:15px;color:${COL.ink2}">Built by <code>src/construction.js</code> (the row rebuilt with a logging hook in the engine; each finished outline compared with the row's svg: ${['cafe', 'bar', 'museum', 'nature', 'star', 'plus'].filter(id => J[id].same).length} of 6 identical) and <code>src/construction-board.js</code>.</p></div>`;
}

function sheet() {
  return `<div style="width:1700px;box-sizing:border-box;padding:56px 64px 64px;background:${COL.raised};font-family:Archivo,Arial,sans-serif;color:${COL.ink}">
<div style="font-size:14px;letter-spacing:.12em;font-weight:700;color:${COL.ink2};text-transform:uppercase">Icon grid · the system's proof</div>
<h1 style="margin:6px 0 14px;font-size:44px;line-height:1.1;color:${COL.navy}">Construction</h1>
<div style="margin:0 0 24px;padding:18px 20px;background:${COL.paper};border-top:4px solid ${COL.or};font-size:22px;line-height:1.35;color:${COL.navy};font-weight:600;max-width:1150px">"These are looking great. I want to see a diagram now that overlays the shapes used to make these shapes on top of them, a construction diagram"</div>
<p style="margin:0 0 36px;font-size:19px;line-height:1.45;max-width:1150px">Each of the six, as the engine builds it, on the 24 grid at 30px a unit. Left: the root shapes it was given, its size class, mirror and optical centre. Right: every round it drew, coloured by its kind. Every line here is read from the code's record of the build, not drawn after it.</p>
${legend()}
${['cafe', 'bar', 'museum', 'nature', 'star', 'plus'].map(iconRow).join('')}
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
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":1700,"height":1000}}'>
class Component extends DCLogic {
renderVals() { return {}; }
}
</script>
</body>
</html>
`); }
console.log('ok', html.length);
