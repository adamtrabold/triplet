// Round g3: the GRID is the subject. One sheet per grid: the outside (circle, live area, keyshapes,
// pixel structure), the inside (the guides every glyph obeys, with all 13 overlaid to show it working),
// the 12px chip, and the corner rule. Then the two grids side by side.
// Writes grid/cards-g3.html, grid/svg/g3/<grid>/<pick>-24.svg and, given an out dir, canvas artboards.
// Run: TOOLS=<paper dir> node boards3.js [out]
'use strict';
const fs = require('fs'), path = require('path');
const E = require('./engine.js');
const { LAWS } = require('./frame.js');
const { X12, NAMES } = require('./picks.js');
const { A3, B3 } = require('./picks3.js');
const ROOT = path.join(__dirname, '..');
const COL = { paper: '#F2EBDD', raised: '#FAF5EA', hair: '#D8CEBA', ink: '#1A1A18', ink2: '#5A564C', navy: '#12293F', or: '#EE7434', ord: '#A8400C', g1: '#E6DDCB', g2: '#CDBFA4', g3: '#B3A27F', blue: '#2F5A7A' };
const f2 = v => +(+v).toFixed(3);
const FONT = 'font-family="Archivo, Arial, sans-serif"';

const GRIDS = [
  {
    id: 'A', key: 'pixel', name: 'Pixel keyline grid', law: 'joint', set: A3, live: 8, pts: 8.5,
    line: 'Square, like a drawing board: one square is one screen pixel. Glyphs are built inside a square and share three horizontal guides.',
    outside: [
      ['Unit', '1px squares, 24 × 24'],
      ['Circle', 'ring 2px · air 2px · live circle Ø16 · points to Ø17'],
      ['Keyshapes', 'circle Ø16 · square 12 · upright 10 × 14 · wide 14 × 10'],
    ],
    inside: [
      ['Box', 'every glyph inside the 12px square (6 to 18); tips and heads may reach the circle'],
      ['Guides', 'TOP 6 · SHOULDER 10 · BASE 18 · centre axis 12'],
      ['How', 'standing glyphs stand on BASE; tall ones reach TOP; where a top part meets a body (roof on columns, bowl on stem, valance over curtains) it is at SHOULDER'],
      ['Angles', 'orthogonal, 45°, and whole-pixel slopes (1:2)'],
    ],
    corners: 'By joint: joins filleted 1.1px, cut ends 0.35, tips 0.3. The curve lives where strokes connect.',
    precedent: 'Material Design\'s keyline grid; type design\'s baseline, x-height and cap height (shared horizontal guides).',
  },
  {
    id: 'B', key: 'radial', name: 'Radial seal grid', law: 'wear', set: B3, live: 8.5, pts: 9,
    line: 'Round, like a coin or a seal: rings and rays from the centre. Glyphs are built out from the middle and sized by rings.',
    outside: [
      ['Unit', 'rings every 1px from the centre, rays every 15°; pixels underneath for straight edges'],
      ['Circle', 'ring 2px · air 1.5px · live circle Ø17 · points to Ø18'],
      ['Keyshapes', 'all inscribed in the live circle: circle, square, diamond, triangle, hexagon'],
    ],
    inside: [
      ['Rings', 'CORE r3 (hubs, heads, centres) · BODY r5.5 (the main mass) · REACH r8.5 (round glyphs fill it)'],
      ['Guides', 'TOP 5.5 and BASE 18.5 (chords of the circle) · centre axis 12'],
      ['How', 'standing glyphs stand on BASE; tall ones reach TOP (tips may pass it); round glyphs fill REACH; the main mass fills BODY; a hub sits inside CORE'],
      ['Angles', 'any multiple of 15° (30° and 60° give triangles and hexagons)'],
    ],
    corners: 'Even wear: every outside corner worn 0.38px deep (right angles round 0.9, tips stay sharp); inside corners barely change. The curve lives on the silhouette.',
    precedent: 'Coin and seal engraving (the device fills the field), compass roses, the US brown-sign symbols drawn to a circle.',
  },
];
const SHARED = [
  ['Lines', '2px, every one (the ⌘ too)'],
  ['Parts', 'whole pixels, 2px the smallest; widths 2 · 4 · 6 · 8 · 12 by default, an odd size only where a 1px gap or centring needs it (the blocks are 5 + 2 + 5 = 12)'],
  ['Gaps', 'only 1px (a cut between parts that nearly touch) or 2px (a space between separate parts)'],
  ['Counters', 'enclosed holes at least 2px (the ⌘\'s loops are the one exception at 1–1.5px)'],
  ['Circles', 'radii from a short set: 1.5 · 2 · 3 · 4 (heads, handles, hubs, wheels); a bowl is drawn through three guide points'],
];

// glyph cache
const GL = {};
for (const g of GRIDS) { GL[g.id] = {}; for (const [id] of NAMES) GL[g.id][id] = E.build(g.set[id], { law: LAWS[g.law], centre: [12, 12] }); }
const CHIP = {}; for (const [id] of NAMES) CHIP[id] = E.build(X12[id], { law: LAWS.joint });

// SVG files
for (const g of GRIDS) {
  const dir = path.join(ROOT, 'svg', 'g3', g.id + '-' + g.key); fs.mkdirSync(dir, { recursive: true });
  for (const [id] of NAMES) fs.writeFileSync(path.join(dir, `${id}-24.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="${GL[g.id][id].d}"/></svg>\n`);
}

// ---- grid geometry ----------------------------------------------------------------------------
const L = (s, x1, y1, x2, y2, c, w = 1, dash) => `<line x1="${f2(x1)}" y1="${f2(y1)}" x2="${f2(x2)}" y2="${f2(y2)}" stroke="${c}" stroke-width="${f2(w / s)}"${dash ? ` stroke-dasharray="${dash.map(d => f2(d / s)).join(' ')}"` : ''}/>`;
function structure(gd, s, n = 24) {
  let g = ''; const c0 = n / 2;
  if (gd.id === 'A') {
    for (let i = 0; i <= n; i++) { const c = i === c0 ? COL.g3 : i % 2 === 0 ? COL.g2 : COL.g1; g += L(s, i, 0, i, n, c) + L(s, 0, i, n, i, c); }
  } else {
    for (let i = 0; i <= n; i++) g += L(s, i, 0, i, n, '#EFE8DA') + L(s, 0, i, n, i, '#EFE8DA');
    for (let r = 1; r <= c0; r++) g += `<circle cx="${c0}" cy="${c0}" r="${r}" fill="none" stroke="${r % 2 ? COL.g1 : COL.g2}" stroke-width="${f2(1 / s)}"/>`;
    for (let a = 0; a < 180; a += 15) { const c = Math.cos(a * Math.PI / 180) * c0, si = Math.sin(a * Math.PI / 180) * c0; g += L(s, c0 - c, c0 - si, c0 + c, c0 + si, a % 45 ? COL.g1 : COL.g2, a % 90 ? 1 : 1.3); }
  }
  return g;
}
function circleParts(gd, s, { faint = false } = {}) {
  const live = gd.live, pts = gd.pts, o = faint ? 0.5 : 1;
  let g = `<circle cx="12" cy="12" r="11" fill="none" stroke="${COL.navy}" stroke-opacity="${0.2 * o}" stroke-width="2"/>`;
  g += `<path fill-rule="evenodd" fill="${COL.or}" fill-opacity="${0.1 * o}" d="M12 2a10 10 0 1 1 0 20a10 10 0 1 1 0-20ZM12 ${12 - live}a${live} ${live} 0 1 0 0 ${2 * live}a${live} ${live} 0 1 0 0-${2 * live}Z"/>`;
  g += `<circle cx="12" cy="12" r="${live}" fill="none" stroke="${COL.or}" stroke-opacity="${o}" stroke-width="${f2(2 / s)}"/>`;
  g += `<circle cx="12" cy="12" r="${pts}" fill="none" stroke="${COL.or}" stroke-opacity="${o}" stroke-width="${f2(1.2 / s)}" stroke-dasharray="${f2(3 / s)} ${f2(3 / s)}"/>`;
  return g;
}
function keyshapes(gd, s, which = 'all', strong = false) {
  const st = `fill="${strong ? 'rgba(18,41,63,.07)' : 'none'}" stroke="${COL.navy}" stroke-opacity="${strong ? 0.9 : 0.55}" stroke-width="${f2((strong ? 2 : 1.2) / s)}"`;
  const poly = (n, rot, r = gd.live) => { const p = []; for (let i = 0; i < n; i++) { const a = (rot + i * 360 / n) * Math.PI / 180; p.push([12 + r * Math.cos(a), 12 + r * Math.sin(a)]); } return `<path d="M${p.map(q => q.map(f2).join(' ')).join('L')}Z" ${st}/>`; };
  const ks = gd.id === 'A'
    ? { circle: `<circle cx="12" cy="12" r="8" ${st}/>`, square: `<rect x="6" y="6" width="12" height="12" ${st}/>`, upright: `<rect x="7" y="5" width="10" height="14" ${st}/>`, wide: `<rect x="5" y="7" width="14" height="10" ${st}/>` }
    : { circle: `<circle cx="12" cy="12" r="8.5" ${st}/>`, square: poly(4, 45), diamond: poly(4, 0), triangle: poly(3, -90), hexagon: poly(6, 0) };
  return which === 'all' ? Object.values(ks).join('') : ks[which];
}
function T(s, x, y, t, c = COL.ord, a = 'middle', size = 10.5) {
  return `<text x="${f2(x)}" y="${f2(y)}" font-size="${f2(size / s)}" ${FONT} font-weight="700" fill="${c}" text-anchor="${a}" paint-order="stroke" stroke="${COL.raised}" stroke-width="${f2(3.5 / s)}">${t}</text>`;
}
function rulers(s, n = 24, step = 4) {
  let g = ''; const fs = f2(8.5 / s);
  for (let i = 0; i <= n; i += step) g += `<text x="${i}" y="${f2(-0.45 * 24 / n * (n / 24))}" font-size="${fs}" text-anchor="middle" fill="${COL.ink2}" ${FONT}>${i}</text><text x="${f2(-0.4)}" y="${f2(i + 0.3)}" font-size="${fs}" text-anchor="end" fill="${COL.ink2}" ${FONT}>${i}</text>`;
  return g;
}
const frameSvg = (px, inner, pad = 1.6) => { const s = px / 24; return `<svg width="${f2(px + pad * 2 * s)}" height="${f2(px + pad * 2 * s)}" viewBox="${-pad} ${-pad} ${24 + 2 * pad} ${24 + 2 * pad}" role="img">${inner}<rect width="24" height="24" fill="none" stroke="${COL.g3}" stroke-width="${f2(1 / s)}"/></svg>`; };

function outsideSheet(gd, px, labels = true) {
  const s = px / 24, air = 10 - gd.live;
  let g = `<rect width="24" height="24" fill="${COL.raised}"/>${structure(gd, s)}${circleParts(gd, s)}${keyshapes(gd, s)}<path d="M11 12h2M12 11v2" stroke="${COL.or}" stroke-width="${f2(1.5 / s)}"/>`;
  if (labels) g += T(s, 12, 1.35, 'RING 2', COL.navy) + T(s, 12, 2 + air / 2 + 0.35, `AIR ${air}`) + T(s, 12, 12 - gd.live + 1, `LIVE Ø${2 * gd.live}`) + T(s, 12, 12 + gd.pts + 0.95, `POINTS Ø${2 * gd.pts}`) + rulers(s);
  return frameSvg(px, g, labels ? 1.6 : 0.2);
}
function guides(gd, s, { x0 = 0, x1 = 24, label = true, ox = 0 } = {}) {
  const c = COL.blue; let g = '';
  const H = (y, name, dash) => L(s, x0, y, x1, y, c, 1.6, dash) + (label ? T(s, x0 + 0.3, y - 0.3, name, c, 'start', 9.5) : '');
  if (gd.id === 'A') {
    g += H(6, 'TOP 6') + H(10, 'SHOULDER 10', [4, 3]) + H(18, 'BASE 18');
    g += L(s, ox + 12, 0, ox + 12, 24, c, 1, [2, 3]);
    if (label) g += `<rect x="${ox + 6}" y="6" width="12" height="12" fill="none" stroke="${c}" stroke-opacity=".5" stroke-width="${f2(1 / s)}"/>`;
  } else {
    g += H(5.5, 'TOP 5.5') + H(18.5, 'BASE 18.5');
    g += L(s, ox + 12, 0, ox + 12, 24, c, 1, [2, 3]);
    for (const [r, n] of [[3, 'CORE r3'], [5.5, 'BODY r5.5'], [8.5, 'REACH r8.5']]) {
      g += `<circle cx="${ox + 12}" cy="12" r="${r}" fill="none" stroke="${c}" stroke-width="${f2(1.6 / s)}"${r === 5.5 ? ` stroke-dasharray="${f2(4 / s)} ${f2(3 / s)}"` : ''}/>`;
      if (label) g += T(s, ox + 12 + r * 0.7071 + 0.3, 12 - r * 0.7071 - 0.2, n, c, 'start', 9.5);
    }
  }
  return g;
}
function insideSheet(gd, px) {
  const s = px / 24;
  let g = `<rect width="24" height="24" fill="${COL.raised}"/>${structure(gd, s)}${circleParts(gd, s, { faint: true })}`;
  for (const [id] of NAMES) g += `<path d="${GL[gd.id][id].d}" fill="${COL.navy}" fill-opacity=".045" stroke="${COL.navy}" stroke-opacity=".55" stroke-width="${f2(1 / s)}"/>`;
  g += guides(gd, s) + rulers(s);
  return frameSvg(px, g);
}
function guideRows(gd, cell, perRow) {
  const ids = NAMES.map(n => n[0]); let out = '';
  for (let i = 0; i < ids.length; i += perRow) {
    const row = ids.slice(i, i + perRow), W = row.length * 24, s = cell / 24;
    let g = `<rect width="${W}" height="24" fill="${COL.raised}"/>`;
    row.forEach((id, k) => { g += `<g transform="translate(${k * 24} 0)"><circle cx="12" cy="12" r="11" fill="${COL.paper}" stroke="${COL.navy}" stroke-width="2"/><path d="${GL[gd.id][id].d}" fill="${COL.navy}"/></g>`; });
    // guides across the whole row, over the glyphs
    const c = COL.blue;
    const ys = gd.id === 'A' ? [[6], [10, 1], [18]] : [[5.5], [18.5]];
    for (const [y, d] of ys) g += L(s, 0, y, W, y, c, 1.4, d ? [4, 3] : null).replace('<line', '<line stroke-opacity=".85"');
    row.forEach((id, k) => { g += L(s, k * 24 + 12, 0, k * 24 + 12, 24, c, 1, [2, 3]); });
    out += `<svg width="${f2(row.length * cell)}" height="${cell}" viewBox="0 0 ${W} 24" aria-hidden="true" style="display:block;margin-bottom:6px">${g}</svg>`;
  }
  return out;
}
function miniKey(gd, which, px) { const s = px / 24; return `<svg width="${px}" height="${px}" viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" fill="${COL.raised}"/>${structure(gd, s)}<circle cx="12" cy="12" r="11" fill="none" stroke="${COL.navy}" stroke-opacity=".15" stroke-width="2"/><circle cx="12" cy="12" r="${gd.live}" fill="none" stroke="${COL.or}" stroke-opacity=".6" stroke-width="${f2(1 / s)}"/>${keyshapes(gd, s, which, true)}</svg>`; }
function chipSheet(px, d) {
  const s = px / 12, pad = 1; let g = `<rect width="12" height="12" fill="${COL.raised}"/>`;
  for (let i = 1; i < 12; i += 2) g += L(s, i, 0, i, 12, COL.g1, 1, [2, 3]) + L(s, 0, i, 12, i, COL.g1, 1, [2, 3]);
  for (let i = 0; i <= 12; i += 2) g += L(s, i, 0, i, 12, i === 6 ? COL.g3 : COL.g2, 1.5) + L(s, 0, i, 12, i, i === 6 ? COL.g3 : COL.g2, 1.5);
  if (d) g += `<path d="${d}" fill="${COL.navy}" fill-opacity=".85"/>`;
  g += `<rect width="12" height="12" fill="none" stroke="${COL.or}" stroke-width="${f2(2 / s)}"/>`;
  for (let i = 0; i <= 12; i += 2) g += `<text x="${i}" y="-0.35" font-size="${f2(8.5 / s)}" text-anchor="middle" fill="${COL.ink2}" ${FONT}>${i}</text>`;
  return `<svg width="${f2(px + 2 * pad * s)}" height="${f2(px + 2 * pad * s)}" viewBox="${-pad} ${-pad} ${12 + 2 * pad} ${12 + 2 * pad}" role="img">${g}</svg>`;
}
const { R, P } = E;
const SPEC = [[R(2, 2, 2, 9), R(2, 9, 9, 2)], [R(1.5, 2, 9, 2), R(5, 4, 2, 7)], [P([6, 1.5], [10, 6], [2, 6]), P([6, 4], [11, 10], [1, 10])]];
function cornerMini(gd, prims, px) {
  const r = E.build(prims, { law: LAWS[gd.law] }), sh = E.build(prims, {}), s = px / 12;
  let g = `<rect width="12" height="12" fill="${COL.raised}"/>`;
  for (let i = 0; i <= 12; i++) g += L(s, i, 0, i, 12, COL.g1) + L(s, 0, i, 12, i, COL.g1);
  g += `<path d="${r.d}" fill="${COL.navy}"/><path d="${sh.d}" fill="none" stroke="${COL.or}" stroke-width="${f2(1.5 / s)}" stroke-dasharray="${f2(3 / s)} ${f2(2 / s)}"/>`;
  return `<svg width="${px}" height="${px}" viewBox="0 0 12 12" aria-hidden="true">${g}</svg>`;
}
const badge = d => `<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="${COL.paper}" stroke="${COL.navy}" stroke-width="2"/><path d="${d}" fill="${COL.navy}"/></svg>`;

// ---- copy and cards ------------------------------------------------------------------------------
const BRIEF = 'yes they need to sit in the stroked circle but also make sense on their own. they need to be at their root simple shapes, but joined together to make coherent glyphs. they must be crafted with the highest attention to detail and quality -- minimal bezier curves with perfect architecture. personality in the approach to how strokes are connected and curve. slight rounding of interior and exterior corners to add a vintage softness. corner rounding should not be 100% consistent though as there are different architecturally sound prinicples to how different angles intersect. the effect of the rounding should allude to something screened or pressed.';
const INTERIOR_Q = 'I am glad we have the outer stuff defined in that grid by what about the interior? There\'s nothing to keep them consistent outside height/width and space to the ring';
const Q = 'Which grid do we draw the 13 on: A, the square pixel grid, or B, the round seal grid?';

const CSS = W => `
*{box-sizing:border-box}
.cards{width:${W}px;font-family:Archivo,Arial,sans-serif;color:${COL.ink};background:#E4DCCB}
.card{background:${COL.raised};padding:14px 16px 18px;margin:0 0 24px}
.no{font-size:10px;letter-spacing:.12em;color:${COL.ink2};font-weight:700;text-transform:uppercase}
h2{font-size:22px;margin:2px 0 4px;letter-spacing:.04em;text-transform:uppercase;color:${COL.navy};line-height:1.1}
h2 span{color:${COL.ord}}
h3{font-size:14px;margin:20px 0 2px;letter-spacing:.08em;text-transform:uppercase;color:${COL.navy};border-top:2px solid ${COL.navy};padding-top:8px}
.att{font-size:13px;margin:4px 0 10px;line-height:1.4}
.sm{font-size:12px;line-height:1.4;margin:6px 0}
.lab{font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;color:${COL.ink2};font-weight:700;margin:14px 0 6px}
.hero{display:flex;justify-content:center;margin:4px -8px 0}
.leg{display:flex;flex-wrap:wrap;gap:4px 12px;font-size:10.5px;color:${COL.ink2};margin:6px 0 0}
.leg i{display:inline-block;width:16px;height:0;border-top:2px solid ${COL.or};vertical-align:middle;margin-right:4px}
.leg i.d{border-top-style:dashed}.leg i.k{border-top:1.5px solid rgba(18,41,63,.6)}.leg i.a{border-top:7px solid rgba(238,116,52,.18)}.leg i.r{border-top:5px solid rgba(18,41,63,.2)}.leg i.b{border-top:2px solid ${COL.blue}}.leg i.o{border-top:1.5px solid rgba(18,41,63,.55)}
.keys{display:grid;grid-template-columns:repeat(${W > 500 ? 5 : 4},1fr);gap:8px}
.keys div{display:flex;flex-direction:column;align-items:center;gap:3px;font-size:10px;color:${COL.navy};font-weight:700;letter-spacing:.06em;text-transform:uppercase}
.row2{display:flex;gap:14px;align-items:center;flex-wrap:wrap}
.row2 .t{flex:1;min-width:140px;font-size:12px;line-height:1.4}
.facts{width:100%;border-collapse:collapse;font-size:12px;line-height:1.35}
.facts td{border-top:1px solid ${COL.hair};padding:6px 4px;vertical-align:top}
.facts td:first-child{width:76px;font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;color:${COL.navy};padding-top:8px}
.corn{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
.q{font-size:13px;line-height:1.4;color:${COL.navy};background:#F3ECDF;border-left:3px solid ${COL.or};padding:8px 10px;margin:10px 0}
.q b{display:block;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:${COL.ord};margin-bottom:2px}
.cmp{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;text-align:center}
.cmp .h{font-size:12px;font-weight:700;color:${COL.navy};letter-spacing:.06em;text-transform:uppercase;margin-bottom:4px}
.cmp .s{font-size:11px;color:${COL.ink2};line-height:1.35;text-align:left}
.real{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-top:6px}
.prec{font-size:11px;color:${COL.ink2};line-height:1.4;margin-top:8px}
`;

function cardIntro(n) {
  return `<section class="card" id="c${n}"><div class="no">Grid · round 3 · sheet ${n}</div><h2>Two grids</h2>
<p class="att">A grid is the board every icon is drawn on. Each sheet shows one grid as a grid:</p>
<p class="sm"><b>Outside</b>: the circle, the air, the live area, the keyshapes and the squares or rings everything snaps to.<br><b>Inside</b>: the guides that keep the glyphs consistent with each other, with all 13 laid over them to show it working.<br><b>The chip</b>: the same grid at 12px.<br><b>Corners</b>: the grid's corner rule.</p>
<div class="q"><b>You asked</b>"${INTERIOR_Q}"</div>
<p class="sm">The inside of each sheet is the answer: shared guide lines (or rings) every glyph stands on and reaches to, one set of part sizes, two gap sizes and a minimum hole. The same rules hold in both grids; each grid lays its guides out its own way.</p>
<p class="sm" style="color:${COL.ink2}">Settled in both: every line 2.00px; a separate drawing per size; places solid. Icons on these sheets are rough skeletons placed on the grid to show it in use, not drawings.</p>
<div class="q"><b>Your brief for the build, word for word</b>${BRIEF}</div>
<div class="q"><b>The question</b>${Q}</div>
</section>`;
}

function cardGrid(gd, W, n) {
  const big = Math.min(W - 32, 620) - 30;
  const keyNames = gd.id === 'B' ? ['circle', 'square', 'diamond', 'triangle', 'hexagon'] : ['circle', 'square', 'upright', 'wide'];
  const kpx = W > 500 ? 120 : 76, cell = W > 500 ? 150 : 84, per = W > 500 ? 4 : 4;
  return `<section class="card" id="c${n}"><div class="no">Grid · round 3 · sheet ${n}</div><h2><span>${gd.id}</span> · ${gd.name}</h2>
<p class="att">${gd.line}</p>
<h3>Outside</h3>
<div class="lab">The grid at 24px (row badge, map pin), enlarged ${(big / 24).toFixed(0)}x</div>
<div class="hero">${outsideSheet(gd, big)}</div>
<div class="leg"><span><i class="r"></i>ring 2px</span><span><i class="a"></i>air</span><span><i></i>live circle</span><span><i class="d"></i>points (tips, heads) may reach</span><span><i class="k"></i>keyshapes</span></div>
<div class="lab">Keyshapes: the largest each kind of glyph may be</div>
<div class="keys">${keyNames.map(k => `<div>${miniKey(gd, k, kpx)}${k}</div>`).join('')}</div>
<table class="facts" style="margin-top:8px">${gd.outside.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table>
<h3>Inside</h3>
<div class="lab">The guides, with all 13 glyphs overlaid as outlines</div>
<div class="hero">${insideSheet(gd, big)}</div>
<div class="leg"><span><i class="b"></i>guides${gd.id === 'B' ? ' and rings' : ''}</span><span><i class="o"></i>the 13, outlined</span></div>
<table class="facts" style="margin-top:8px">${gd.inside.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}${SHARED.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table>
<div class="lab">The guides running through all 13, enlarged ${(cell / 24).toFixed(1)}x</div>
${guideRows(gd, cell, per)}
<div class="real">${NAMES.map(([id]) => badge(GL[gd.id][id].d)).join('')}</div>
<p class="sm" style="text-align:center;color:${COL.ink2};font-size:10.5px">Real size</p>
<h3>The chip</h3>
<div class="row2">${chipSheet(W > 500 ? 240 : 150, CHIP.museum.d)}<div class="t">At 12px the glyph stands alone, without the circle. It gets its own simpler drawing on a 6 × 6 grid of 2px modules: six lines across. Both grids hand over to this same chip grid, because at 12px a 2px line leaves no room for anything finer.</div></div>
<h3>Corners</h3>
<div class="corn">${SPEC.map(p => cornerMini(gd, p, W > 500 ? 200 : 110)).join('')}</div>
<p class="sm" style="color:${COL.ink2};font-size:10.5px;margin:2px 0 0">An elbow, a T-join and the conifer's notch, enlarged ${W > 500 ? 17 : 9}x.</p>
<p class="sm">${gd.corners} Dashed orange: the sharp construction.</p>
<p class="prec">Precedent: ${gd.precedent}</p>
</section>`;
}

function cardCompare(W, n) {
  const px = Math.floor((W - 32 - 10) / 2) - 14;
  return `<section class="card" id="c${n}"><div class="no">Grid · round 3 · sheet ${n}</div><h2>Side by side</h2>
<div class="lab">Outside</div>
<div class="cmp">${GRIDS.map(g => `<div><div class="h">${g.id} · ${g.name.split(' ')[0]}</div>${outsideSheet(g, px, false)}</div>`).join('')}</div>
<div class="lab">Inside, with the 13 overlaid</div>
<div class="cmp">${GRIDS.map(g => { const s = px / 24; let gg = `<rect width="24" height="24" fill="${COL.raised}"/>${structure(g, s)}${circleParts(g, s, { faint: true })}`; for (const [id] of NAMES) gg += `<path d="${GL[g.id][id].d}" fill="${COL.navy}" fill-opacity=".045" stroke="${COL.navy}" stroke-opacity=".55" stroke-width="${f2(1 / s)}"/>`; gg += guides(g, s, { label: false }); return `<div>${frameSvg(px, gg, 0.2)}</div>`; }).join('')}</div>
<div class="lab">Real size</div>
<div class="cmp">${GRIDS.map(g => `<div class="real">${NAMES.map(([id]) => badge(GL[g.id][id].d)).join('')}</div>`).join('')}</div>
<div class="lab">How they differ</div>
<div class="cmp">${GRIDS.map(g => `<div class="s"><b>${g.name}</b><br>${g.outside[1][1]}<br>${g.inside[1][1]}<br>${g.corners.split(':')[0]} corners</div>`).join('')}</div>
<div class="q"><b>The question</b>${Q}</div>
</section>`;
}

function cardTool(n) {
  return `<section class="card" id="c${n}"><div class="no">Grid · round 3 · sheet ${n}</div><h2>How we'd draw on it</h2>
<p class="att">We recommend <b>drawing as code</b> on the grid you pick. Each glyph is a list of simple shapes placed on the guides; a script joins them into one SVG path with real holes and applies the grid's corner rule, so a change to a guide or a rule reaches all 13 at once. Figma via its MCP is the alternative if you want to push curves by hand; its write tools are in beta and this environment has no Figma connection.</p>
</section>`;
}

function page(W) { return { css: CSS(W), cards: [cardIntro(0), ...GRIDS.map((g, i) => cardGrid(g, W, i + 1)), cardCompare(W, 3), cardTool(4)] }; }

{
  const { css, cards } = page(390);
  fs.writeFileSync(path.join(ROOT, 'cards-g3.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=390"><title>Grid round 3</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&display=swap">
<style>body{margin:0;background:#E4DCCB}${css}</style></head><body><div class="cards">${cards.join('\n')}</div></body></html>\n`);
}
const out = process.argv[2];
if (out) {
  const W = 760, { css, cards } = page(W);
  const names = ['Grid3Intro', 'Grid3A', 'Grid3B', 'Grid3Compare', 'Grid3Tool'];
  const titles = ['Two grids', 'A · Pixel keyline grid', 'B · Radial seal grid', 'Side by side', 'How we\'d draw on it'];
  fs.mkdirSync(path.join(out, 'project'), { recursive: true });
  cards.forEach((html, i) => fs.writeFileSync(path.join(out, 'project', names[i] + '.dc.html'), `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${titles[i]}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&amp;display=swap">
<style>
body{margin:0}
${css}
.cards{background:${COL.raised}}
.card{margin:0}
</style>
</helmet>
<div class="cards" style="width: ${W}px">
${html.replace(/<section class="card" id="c\d+">/, '<section class="card">')}
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":${W},"height":1000}}'>
class Component extends DCLogic {
renderVals() { return {}; }
}
</script>
</body>
</html>
`));
  fs.writeFileSync(path.join(out, 'boards.json'), JSON.stringify(names.map((nm, i) => ({ file: nm + '.dc.html', title: titles[i] })), null, 1));
  fs.writeFileSync(path.join(out, 'measure.html'), `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&display=swap"><style>body{margin:0}${css}.card{margin:0}</style></head><body><div class="cards">${cards.join('')}</div></body></html>`);
}
console.log('fit', GRIDS.map(g => g.id + ':' + NAMES.map(([id]) => GL[g.id][id].far.toFixed(2)).join(',')).join(' | '));
