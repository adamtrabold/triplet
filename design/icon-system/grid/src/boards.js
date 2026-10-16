// Builds the grid review: phone cards (grid/cards.html), canvas artboards (out dir), and the
// SVG files (grid/svg/<concept>/<pick>-<size>.svg). Run: TOOLS=<dir with paper> node boards.js [canvasOutDir]
'use strict';
const fs = require('fs'), path = require('path');
const E = require('./engine.js');
const { CONCEPTS, NAMES, LAWS, glyph } = require('./concepts.js');
const ROOT = path.join(__dirname, '..');

const COL = { paper: '#F2EBDD', raised: '#FAF5EA', hair: '#D8CEBA', ink: '#1A1A18', ink2: '#5A564C', navy: '#12293F', or: '#EE7434', ord: '#A8400C', grid: '#E3D9C5', mod: '#C9B999', map: '#E8E4DA' };
const f2 = v => +v.toFixed(2);

// ---- precompute every glyph ---------------------------------------------------------
const G = {};
for (const con of CONCEPTS) {
  G[con.id] = {};
  for (const [id] of NAMES) G[con.id][id] = {
    badge24: glyph(con, id, 'badge24'), sel32: glyph(con, id, 'sel32'), chip12: glyph(con, id, 'chip12'),
  };
}

// ---- SVG files (the deliverable format) ---------------------------------------------------
for (const con of CONCEPTS) {
  const dir = path.join(ROOT, 'svg', con.id + '-' + con.key);
  fs.mkdirSync(dir, { recursive: true });
  for (const [id] of NAMES) {
    const g = G[con.id][id];
    fs.writeFileSync(path.join(dir, `${id}-24.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="${g.badge24.d}"/></svg>\n`);
    fs.writeFileSync(path.join(dir, `${id}-12.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><path fill="currentColor" d="${g.chip12.d}"/></svg>\n`);
  }
}

// ---- drawing helpers --------------------------------------------------------------------
const badge = (d, { px = 24, ink = COL.navy, field = COL.paper } = {}) =>
  `<svg width="${px}" height="${px}" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="${field}" stroke="${ink}" stroke-width="2"/><path d="${d}" fill="${ink}"/></svg>`;
const selected = (d, { px = 32, ink = COL.navy } = {}) =>
  `<svg width="${px}" height="${px}" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="14.75" fill="${ink}" stroke="${ink}" stroke-width="2.5"/><path d="${d}" fill="${COL.paper}"/></svg>`;
const bare = (d, vb, px, ink = COL.navy) => `<svg width="${px}" height="${px}" viewBox="0 0 ${vb} ${vb}" aria-hidden="true"><path d="${d}" fill="${ink}"/></svg>`;

// grid background for a concept, in 24-unit badge space, drawn at `s` px per unit
function gridLayer(con, s, { keylines = true, labels = false } = {}) {
  const N = 24, sw = 1 / s; // 1 screen px hairline
  let g = '';
  if (con.id === 'B') {
    for (let r = 1; r <= 12; r += 1) g += `<circle cx="12" cy="12" r="${r}" fill="none" stroke="${COL.grid}" stroke-width="${sw}"/>`;
    for (let a = 0; a < 180; a += 15) {
      const c = Math.cos(a * Math.PI / 180) * 12, si = Math.sin(a * Math.PI / 180) * 12;
      g += `<line x1="${f2(12 - c)}" y1="${f2(12 - si)}" x2="${f2(12 + c)}" y2="${f2(12 + si)}" stroke="${a % 45 ? COL.grid : COL.mod}" stroke-width="${sw}"/>`;
    }
  } else {
    for (let i = 0; i <= N; i++) {
      const strong = con.id === 'C' && i % 2 === 0;
      if (con.id === 'C' && !strong) continue;
      g += `<line x1="${i}" y1="0" x2="${i}" y2="${N}" stroke="${strong ? COL.mod : COL.grid}" stroke-width="${sw}"/><line x1="0" y1="${i}" x2="${N}" y2="${i}" stroke="${strong ? COL.mod : COL.grid}" stroke-width="${sw}"/>`;
    }
    if (con.id === 'C' && keylines) for (let i = 1; i < N; i += 2) g += `<line x1="${i}" y1="0" x2="${i}" y2="${N}" stroke="${COL.grid}" stroke-width="${sw}" stroke-dasharray="${2 / s} ${3 / s}"/><line x1="0" y1="${i}" x2="${N}" y2="${i}" stroke="${COL.grid}" stroke-width="${sw}" stroke-dasharray="${2 / s} ${3 / s}"/>`;
  }
  // ring, air, live circle, point limit
  const live = con.id === 'B' ? 8.5 : 8, lim = con.id === 'B' ? 9 : 8.5;
  g += `<circle cx="12" cy="12" r="11" fill="none" stroke="${COL.navy}" stroke-opacity=".12" stroke-width="2"/>`;
  g += `<path fill-rule="evenodd" fill="${COL.or}" fill-opacity=".09" d="M12 2a10 10 0 1 1 0 20a10 10 0 1 1 0-20ZM12 ${12 - live}a${live} ${live} 0 1 0 0 ${2 * live}a${live} ${live} 0 1 0 0-${2 * live}Z"/>`;
  g += `<circle cx="12" cy="12" r="${live}" fill="none" stroke="${COL.or}" stroke-width="${1.5 * sw}"/>`;
  g += `<circle cx="12" cy="12" r="${lim}" fill="none" stroke="${COL.or}" stroke-width="${sw}" stroke-dasharray="${2 * sw} ${2 * sw}"/>`;
  if (keylines) {
    const kl = `fill="none" stroke="${COL.navy}" stroke-opacity=".45" stroke-width="${sw}"`;
    if (con.id === 'A') g += `<rect x="6" y="6" width="12" height="12" ${kl}/><rect x="7" y="5" width="10" height="14" ${kl}/><rect x="5" y="7" width="14" height="10" ${kl}/>`;
    if (con.id === 'B') g += `<circle cx="12" cy="12" r="3" ${kl}/><circle cx="12" cy="12" r="5.5" ${kl}/>`;
    if (con.id === 'C') g += `<rect x="6" y="6" width="12" height="12" ${kl}/>`;
    g += `<path d="M11.5 12h1M12 11.5v1" stroke="${COL.or}" stroke-width="${sw}"/>`;
  }
  if (labels) {
    const fs = 10 * sw, tx = (x, y, s, c = COL.ord) => `<text x="${x}" y="${y}" font-size="${f2(fs)}" font-family="Archivo, Arial, sans-serif" font-weight="700" fill="${c}" text-anchor="middle" paint-order="stroke" stroke="${COL.raised}" stroke-width="${3 * sw}">${s}</text>`;
    g += tx(12, 1.35, 'RING 2', COL.navy) + tx(12, 2 + (10 - live) / 2 + 0.35, 'AIR ' + (10 - live)) + tx(12, 12 - live + 0.95, 'LIVE Ø' + 2 * live) + tx(12, 12 + lim + 0.85, 'POINTS TO Ø' + 2 * lim);
    if (con.id === 'C') g += tx(3, 23.4, 'MODULE = 2PX', COL.navy);
  }
  return g;
}

function onGrid(con, d, px, opts = {}) {
  const s = px / 24;
  return `<svg width="${px}" height="${px}" viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" fill="${COL.raised}"/>${gridLayer(con, s, opts)}<path d="${d}" fill="${COL.navy}" fill-opacity="${opts.ghost ? 0.1 : 0.9}"/></svg>`;
}
function chipGrid(d, px) {
  const s = px / 12, sw = 1 / s;
  let g = `<rect width="12" height="12" fill="${COL.raised}"/>`;
  for (let i = 0; i <= 12; i++) g += `<line x1="${i}" y1="0" x2="${i}" y2="12" stroke="${i % 2 ? COL.grid : COL.mod}" stroke-width="${sw}"/><line x1="0" y1="${i}" x2="12" y2="${i}" stroke="${i % 2 ? COL.grid : COL.mod}" stroke-width="${sw}"/>`;
  return `<svg width="${px}" height="${px}" viewBox="0 0 12 12" aria-hidden="true">${g}<path d="${d}" fill="${COL.navy}" fill-opacity=".9"/></svg>`;
}

// ---- corner specimens -------------------------------------------------------------------
const { R, P, B, C } = E;
const SPEC = [ // name, shape, crop [x, y, size] on the corner(s) that matter
  ['End of a line', [R(2, 5, 9, 2)], [8, 3, 5]],
  ['Elbow: outside and inside', [R(2, 2, 2, 9), R(2, 9, 9, 2)], [0.4, 6.2, 5.8]],
  ['T-join', [R(1.5, 2, 9, 2), R(5, 4, 2, 7)], [3.5, 1.5, 5]],
  ['Tip, 30°', [P([1.5, 10.5], [10.5, 10.5], [1.5, 5.3])], [6.5, 6.5, 5]],
  ['Pediment: apex 110°, eave 35°', [P([1, 8], [6, 4.5], [11, 8]), R(2, 8, 8, 2)], [-0.7, 2.8, 8.4]],
  ['Conifer tiers: the notch', [P([6, 1.5], [10, 6], [2, 6]), P([6, 4], [11, 10], [1, 10])], [0.5, 3, 5.5]],
];
function specimen(law, prims, px, crop, { label = true } = {}) {
  const info = [], r = E.build(prims, { law: LAWS[law], info });
  const [cx, cy, cs] = crop || [0, 0, 12], s = px / cs;
  let g = `<rect x="-1" y="-1" width="14" height="14" fill="${COL.raised}"/>`;
  for (let i = 0; i <= 12; i += 0.5) {
    const c = i % 1 ? COL.grid : COL.mod, w = (i % 1 ? 0.6 : 1) / s;
    g += `<line x1="${i}" y1="-1" x2="${i}" y2="13" stroke="${c}" stroke-width="${w}"/><line x1="-1" y1="${i}" x2="13" y2="${i}" stroke="${c}" stroke-width="${w}"/>`;
  }
  const sharp = E.build(prims, {});
  g += `<path d="${r.d}" fill="${COL.navy}" fill-opacity=".9"/>`;
  g += `<path d="${sharp.d}" fill="none" stroke="${COL.or}" stroke-width="${1.5 / s}" stroke-dasharray="${4 / s} ${3 / s}"/>`;
  if (label) {
    const seen = new Set();
    for (const c of info) {
      const k = c.x.toFixed(1) + ',' + c.y.toFixed(1);
      if (seen.has(k)) continue; seen.add(k);
      if (c.x < cx + 0.2 || c.x > cx + cs - 0.2 || c.y < cy + 0.2 || c.y > cy + cs - 0.2) continue;
      const fs = 11 / s;
      // put the number on the air side of the corner: outside corners outward, inside corners into the notch
      const mx = cx + cs / 2, my = cy + cs / 2;
      let dx = c.x < mx ? -1 : 1, dy = c.y < my ? -1 : 1;
      const tx = c.x + dx * 0.25 * (c.convex ? 1 : -1) + (c.convex ? 0 : dx * 0.6), ty = c.y + dy * 0.25 * (c.convex ? 1 : -1) + (c.convex ? 0 : dy * 0.6);
      let anchor = (c.convex ? dx : -dx) < 0 ? 'end' : 'start';
      if (tx > cx + cs - 1.2) anchor = 'end'; if (tx < cx + 1.2) anchor = 'start';
      g += `<text x="${f2(tx)}" y="${f2(ty + ((c.convex ? dy : -dy) > 0 ? fs * 0.8 : 0))}" font-size="${f2(fs)}" text-anchor="${anchor}" fill="${c.convex ? COL.ord : '#2F5A7A'}" font-family="Archivo, Arial, sans-serif" font-weight="700" paint-order="stroke" stroke="${COL.raised}" stroke-width="${3 / s}">${c.r < 1 ? c.r.toFixed(2).replace(/^0/, '').replace(/0$/, '') : c.r.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')}</text>`;
    }
  }
  return { svg: `<svg width="${px}" height="${px}" viewBox="${cx} ${cy} ${cs} ${cs}" aria-hidden="true" style="display:block">${g}</svg>`, d: r.d, s };
}

// ---- page pieces --------------------------------------------------------------------------
const BRIEF = 'yes they need to sit in the stroked circle but also make sense on their own. they need to be at their root simple shapes, but joined together to make coherent glyphs. they must be crafted with the highest attention to detail and quality -- minimal bezier curves with perfect architecture. personality in the approach to how strokes are connected and curve. slight rounding of interior and exterior corners to add a vintage softness. corner rounding should not be 100% consistent though as there are different architecturally sound prinicples to how different angles intersect. the effect of the rounding should allude to something screened or pressed.';

const CSS = (W) => `
:root{--paper:${COL.paper};--raised:${COL.raised};--hair:${COL.hair};--ink:${COL.ink};--ink2:${COL.ink2};--navy:${COL.navy};--or:${COL.or};--ord:${COL.ord}}
*{box-sizing:border-box}
.cards{width:${W}px;font-family:Archivo,Arial,sans-serif;color:var(--ink);background:#E4DCCB}
.card{background:var(--raised);padding:14px 16px 18px;margin:0 0 24px}
.card h2{font-size:17px;margin:2px 0 0;letter-spacing:.06em;text-transform:uppercase;color:var(--navy)}
.no{font-size:10px;letter-spacing:.12em;color:var(--ink2);font-weight:700;text-transform:uppercase}
.att{font-size:12.5px;margin:5px 0;line-height:1.38}
.q{font-size:12px;line-height:1.4;color:var(--navy);background:#F3ECDF;border-left:3px solid var(--or);padding:7px 10px;margin:8px 0}
.q b{display:block;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--ord);margin-bottom:2px}
.lab{font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink2);font-weight:700;margin:14px 0 6px}
.rules{margin:4px 0 0;padding:0;list-style:none;font-size:11.5px;line-height:1.38}
.rules li{padding:4px 0;border-top:1px solid var(--hair)}
.leg{display:flex;flex-wrap:wrap;gap:4px 12px;font-size:10px;color:var(--ink2);margin-top:6px}
.leg i{display:inline-block;width:14px;height:0;border-top:1.5px solid var(--or);vertical-align:middle;margin-right:4px}
.leg i.d{border-top-style:dashed}.leg i.k{border-top:1px solid rgba(18,41,63,.5)}.leg i.a{border-top:6px solid rgba(238,116,52,.15)}
.cells{display:grid;grid-template-columns:repeat(${W > 500 ? 5 : 3},1fr);gap:12px 8px}
.cell{display:flex;flex-direction:column;align-items:center;gap:4px}
.cell .real{display:flex;align-items:center;gap:6px;height:34px}
.cell .nm{font-size:9.5px;letter-spacing:.06em;text-transform:uppercase;font-weight:700;color:var(--navy);text-align:center;line-height:1.2}
.cell .nm small{display:block;font-weight:400;letter-spacing:0;text-transform:none;color:var(--ink2);font-size:9.5px}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chips div{display:flex;flex-direction:column;align-items:center;gap:3px;font-size:8.5px;color:var(--ink2)}
.row{display:flex;align-items:center;gap:10px;height:56px;background:#F1E9DB;padding:0 16px;border-bottom:1px solid var(--hair);margin:0 -16px}
.row .t{font-size:16px;font-weight:600;line-height:1.15;flex:1}
.row .t small{display:block;font-size:10.5px;letter-spacing:.08em;font-weight:700;opacity:.72;margin-top:2px}
.chip{display:inline-flex;align-items:center;gap:7px;height:30px;padding:0 10px;background:var(--raised);border:1px solid var(--hair);border-bottom:2px solid var(--navy);font-size:11px;font-weight:700;letter-spacing:.08em;color:var(--navy)}
.map{position:relative;height:120px;background:${COL.map};margin:0 -16px;overflow:hidden}
.map .pn{position:absolute;line-height:0}
.spec{display:grid;grid-template-columns:repeat(3,1fr);gap:6px 8px;align-items:center}
.spec .h{font-size:9px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;color:var(--navy);text-align:center}
.spec .rl{grid-column:1/-1;font-size:10.5px;font-weight:700;color:var(--navy);line-height:1.2;margin-top:8px;display:flex;align-items:center;gap:6px;flex-wrap:wrap}.spec .rl span{font-weight:400;color:var(--ink2)}
.spec .c{display:flex;flex-direction:column;align-items:center;gap:4px}
.one{display:grid;grid-template-columns:22px 1fr;gap:6px;align-items:center;margin:6px 0}
.one b{font-size:13px;color:var(--navy)}
.one .ics{display:flex;flex-wrap:wrap;gap:4px}
.facts{font-size:11.5px;line-height:1.38;margin:0;padding:0;list-style:none}
.facts li{padding:4px 0;border-top:1px solid var(--hair)}
.facts b{color:var(--navy)}
table.m{border-collapse:collapse;width:100%;font-size:11px;line-height:1.3}
table.m td,table.m th{border-top:1px solid var(--hair);padding:5px 4px;text-align:left;vertical-align:middle}
table.m th{font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink2)}
`;

function cardIntro(W) {
  const A = CONCEPTS[0];
  const rows = [
    ['Row badge, near pin', '24', 'ring 2px, inside Ø20', badge(G.A.cafe.badge24.d)],
    ['Selected pin', '32', 'rim 2.5px, inside Ø27, colours flip', selected(G.A.cafe.sel32.d)],
    ['Filter chip', '12', 'no circle, the glyph alone', bare(G.A.cafe.chip12.d, 12, 12)],
    ['Far pin', '16', 'no glyph', `<svg width="16" height="16"><circle cx="8" cy="8" r="7" fill="${COL.paper}" stroke="${COL.navy}" stroke-width="2"/></svg>`],
    ['The + button', '60', 'scalloped badge; its + is 2.00px', `<svg width="26" height="26" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="${COL.navy}" stroke-width="1.8182" stroke-linecap="round"/></svg>`],
  ];
  return `<section class="card" id="c0"><div class="no">Grid · card 0 · not drawings</div><h2>The grid, three ways</h2>
<p class="att">You asked for a shared grid to draw the 13 on, and more than one concept. Each grid below sets the frame, the sizes, the shapes it allows and a corner law. The 13 appear on each one as <b>skeletons</b>: plain shapes, so you can judge the grid, not the drawing.</p>
<div class="q"><b>Your brief for the build, word for word</b>${BRIEF}</div>
<div class="lab">Where the glyphs show, measured in the app today</div>
<table class="m"><tr><th></th><th>px</th><th>What surrounds the glyph</th><th>Real size</th></tr>
${rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}</table>
<p class="att" style="font-size:11.5px;color:var(--ink2)">Today every glyph is one 24-unit drawing, shrunk: a part 2 units wide is 1.5px in the badge and 1px in the chip. Your settled line is 2.00px at every size, so a grid has to say what happens at 12. On your phone 1px is 3 screen dots, so a 0.5px rounding is 1.5 dots: slight, but there.</p>
<div class="lab">The three</div>
<ul class="facts">${CONCEPTS.map(c => `<li><b>${c.id} · ${c.name}.</b> ${c.line}</li>`).join('')}</ul>
</section>`;
}

function realRow(con, picks) {
  // three of his saved places (named on the t6 cards), rendered as the app's row
  const ROWS = { museum: ['Vasa Museum', 'MUSEUM · STOCKHOLM'], attraction: ['Tivoli', 'ATTRACTION · COPENHAGEN'], landmark: ['Hallgrímskirkja', 'LANDMARK · REYKJAVÍK'] };
  return picks.map(id => `<div class="row">${badge(G[con.id][id].badge24.d)}<div class="t">${ROWS[id][0]}<small>${ROWS[id][1]}</small></div></div>`).join('');
}

function mapCrop(con) {
  const pins = [['restaurant', 24, 30], ['bar', 92, 64], ['museum', 150, 22], ['nature', 212, 70], ['shopping', 270, 30], ['street', 330, 74]];
  let h = `<div class="map">`;
  for (const [id, x, y] of pins) h += `<div class="pn" style="left:${x}px;top:${y}px">${badge(G[con.id][id].badge24.d)}</div>`;
  h += `<div class="pn" style="left:120px;top:72px">${selected(G[con.id].attraction.sel32.d)}</div>`;
  h += `<div class="pn" style="left:236px;top:14px">${badge(G[con.id].landmark.badge24.d)}</div>`;
  return h + `</div>`;
}

function cardConcept(con, W, n) {
  const big = Math.min(W - 32, 360);
  const cellPx = W > 500 ? 132 : 108;
  const cells = NAMES.map(([id, nm, what]) => {
    const g = G[con.id][id];
    return `<div class="cell">${onGrid(con, g.badge24.d, cellPx, { keylines: false })}<div class="real">${badge(g.badge24.d)}${selected(g.sel32.d)}${bare(g.chip12.d, 12, 12)}</div><div class="nm">${nm}<small>${what} · ${g.badge24.curves} curves</small></div></div>`;
  }).join('');
  const chips = NAMES.map(([id, nm]) => `<div>${chipGrid(G[con.id][id].chip12.d, 56)}<span>${nm}</span></div>`).join('');
  const sample = G[con.id].museum.badge24.d;
  return `<section class="card" id="c${n}"><div class="no">Grid · card ${n} · concept ${con.id}</div><h2>${con.id} · ${con.name}</h2>
<p class="att">${con.line}</p>
<div class="lab">Construction, the 24 badge enlarged (${(big / 24).toFixed(1)}x)</div>
${onGrid(con, sample, big, { ghost: true, labels: true })}
<div class="leg"><span><i></i>live circle</span><span><i class="d"></i>points may reach</span><span><i class="a"></i>air between glyph and ring</span><span><i class="k"></i>keylines</span></div>
<ul class="rules">${con.rules.map(r => `<li>${r}</li>`).join('')}</ul>
<p class="att" style="font-size:11px;color:var(--ink2)">Precedent: ${con.precedent}</p>
<div class="lab">What it costs</div>
<ul class="rules">${con.costs.map(r => `<li>${r}</li>`).join('')}</ul>
<div class="lab">The 13 on this grid · under each, real size: badge, selected pin, chip</div>
<div class="cells">${cells}</div>
<div class="lab">${con.id === 'B' ? 'The chip: the same drawing at 0.71x, pen still 2px (enlarged 4.7x)' : 'The chip drawings, on 6 × 6 modules of the 2px line (enlarged 4.7x)'}</div>
<div class="chips">${chips}</div>
<div class="lab">In the app, real size</div>
${realRow(con, ['museum', 'attraction', 'landmark'])}
<div style="display:flex;gap:6px;flex-wrap:wrap;margin:10px 0">${['restaurant', 'bar', 'park', 'nature'].map(id => `<span class="chip">${bare(G[con.id][id].chip12.d, 12, 12)}${NAMES.find(x => x[0] === id)[1].toUpperCase()}</span>`).join('')}</div>
${mapCrop(con)}
</section>`;
}

function cardCorners(W, n) {
  const px = Math.floor((W - 32 - 16) / 3);
  const head = CONCEPTS.map(c => `<div class="h">${c.id} · ${({ joinery: 'by joint', wear: 'even wear', press: 'press' })[c.law]}</div>`).join('');
  const rows = SPEC.map(([nm, prims, crop]) => {
    const cells = CONCEPTS.map(c => specimen(c.law, prims, px, crop));
    return `<div class="rl">${nm} <span>· enlarged ${(cells[0].s).toFixed(0)}x · whole shape at real size:</span> ${bare(cells[0].d, 12, 12)}</div>${cells.map(x => `<div class="c">${x.svg}</div>`).join('')}`;
  }).join('');
  return `<section class="card" id="c${n}"><div class="no">Grid · card ${n} · corners</div><h2>Three corner laws, same shapes</h2>
<p class="att">Each law is a rule, not a call per corner, and each rounded corner is <b>one</b> curve. Close-ups on the corners that matter. Dashed orange: the sharp construction. Numbers: radius in screen px, <span style="color:${COL.ord};font-weight:700">outside</span> and <span style="color:#2F5A7A;font-weight:700">inside</span>. Grid: 1px, with half-pixel lines.</p>
<div class="spec">${head}${rows}</div>
<ul class="facts" style="margin-top:12px">
<li><b>A · by joint.</b> The radius follows what the corner is: the cut end of a line 0.5, the outside of a mass 1.0, a tip 0.4, an obtuse shoulder 1.25, a join 0.6, a narrow notch 0.3 (kept open).</li>
<li><b>B · even wear.</b> Every outside corner loses the same 0.22px from its point; every inside corner fills 0.3px. So a 30° tip stays sharp (0.15), a right angle softens (0.53), the 110° apex goes round (1.0).</li>
<li><b>C · press.</b> Ink pressed onto paper: outside corners squeeze 0.35px, inside corners fill 0.9px. The radii don't change; what you see does: the tip blunts more than the right angle, and the notch fills.</li>
<li><b>Inside corners fill in all three</b>, because that is what print does: ink spreads into inside corners first. Bell Centennial (Matthew Carter, 1975–78) cut ink traps into its joins so phone-book ink could fill them; letterpress printers call the edge build-up "ink squeeze". We draw the filled result.</li>
<li><b>At real size</b> on your phone (3 dots per px), a 0.5px radius is 1.5 dots: you feel these more than see them, which fits "slight". Where they show is in the joins and tips of a whole glyph.</li>
</ul></section>`;
}
function cardOneInk(W, n) {
  const line = (con, k) => NAMES.map(([id]) => k === 'chip12' ? bare(G[con.id][id].chip12.d, 12, 12) : badge(G[con.id][id].badge24.d)).join('');
  return `<section class="card" id="c${n}"><div class="no">Grid · card ${n} · side by side</div><h2>All 13, each grid, real size</h2>
<p class="att">One ink, so only the grid differs. Skeletons, not drawings.</p>
${CONCEPTS.map(c => `<div class="lab">${c.id} · ${c.name}</div><div class="one"><b>24</b><div class="ics">${line(c, 'badge24')}</div></div><div class="one"><b>12</b><div class="ics" style="gap:10px">${line(c, 'chip12')}</div></div>`).join('')}
<div class="lab">What the builds measured</div>
<ul class="facts">
<li><b>Curves per glyph</b> (24 badge, rounded corners included): A ${sum('A')}, B ${sum('B')}, C ${sum('C')} across the 13. Each rounded corner is one curve; circles are four.</li>
<li><b>The chip.</b> A and C draw it separately, and at 12px they draw the same thing: with a 2px line, any grid becomes 6 × 6 modules there. B shrinks its one drawing and keeps the pen at 2px, so its chip is bolder; parts marked as detail drop out, so the wheel loses its spokes and the column front keeps two columns.</li>
<li><b>Three picks can't keep a 2px line at 12px</b> in A and C: the ⌘ (it doesn't fit), the wheel's spokes and the walker's arms are 1.5px there. That's a question for the drawing step, not a grid choice.</li>
<li><b>The ⌘'s heavier line.</b> The team's condition for the ⌘ is a line clearly heavier than 2.00px. A 3px ⌘ with 1px openings needs a circle Ø18.3; the badge's live area is Ø16 (A, C) or Ø17 (B). It has room only at the 32 selected pin. At 12px even a 2px ⌘ with 1px openings needs Ø13.5.</li>
</ul></section>`;
}
function sum(id) { return NAMES.reduce((a, [p]) => a + G[id][p].badge24.curves, 0); }

function cardTool(W, n) {
  return `<section class="card" id="c${n}"><div class="no">Grid · card ${n} · how we draw</div><h2>The tool</h2>
<p class="att">You asked whether another tool or an MCP would be better. Our recommendation: <b>keep drawing as code</b>, the way these boards were made.</p>
<ul class="facts">
<li><b>The grid is the code.</b> Each glyph is a list of simple shapes on the grid. A script joins them into one path with real holes, applies the corner law, and writes the SVG. Change a radius once and all 13 follow; every change is a reviewable line in git.</li>
<li><b>It works the way your brief reads.</b> "simple shapes, but joined together": the source is the shapes, and the script joins them. "minimal bezier curves": each rounded corner is one curve, and we count them. "should not be 100% consistent": the corner law, written once, says how each kind of corner rounds.</li>
<li><b>No fake cut-outs.</b> Earlier sketches faked holes with paper-coloured shapes, which break on the navy selected pin. These are single paths with real holes (see the selected pins above).</li>
<li><b>Figma (via its MCP) is the other route,</b> if you want to push curves by hand. Its write tools are in beta and this environment has no Figma connection, so we'd need you to connect it. We'd still keep the corner law in code.</li>
</ul>
<div class="q"><b>The question</b>Which grid do we draw the 13 on: A, B, C, or parts of more than one (for example one grid's frame with another's corners)?</div>
</section>`;
}

function page(W) {
  const cards = [cardIntro(W), ...CONCEPTS.map((c, i) => cardConcept(c, W, i + 1)), cardCorners(W, 4), cardOneInk(W, 5), cardTool(W, 6)];
  return { css: CSS(W), cards };
}

// ---- phone cards ---------------------------------------------------------------------------
{
  const { css, cards } = page(390);
  fs.writeFileSync(path.join(ROOT, 'cards.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=390"><title>Grid concepts</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&display=swap">
<style>body{margin:0;background:#E4DCCB}${css}</style></head><body><div class="cards">${cards.join('\n')}</div></body></html>\n`);
}

// ---- canvas artboards ----------------------------------------------------------------------
const out = process.argv[2];
if (out) {
  const W = 760;
  const { css, cards } = page(W);
  const names = ['GridIntro', 'GridA', 'GridB', 'GridC', 'GridCorners', 'GridSideBySide', 'GridTool'];
  const titles = ['The grid, three ways', 'A · Pixel plate', 'B · Seal', 'C · Press kit', 'Three corner laws', 'All 13, each grid, real size', 'The tool, and the question'];
  fs.mkdirSync(path.join(out, 'project'), { recursive: true });
  const meta = [];
  cards.forEach((html, i) => {
    const file = `${names[i]}.dc.html`;
    const doc = `<!doctype html>
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
`;
    fs.writeFileSync(path.join(out, 'project', file), doc);
    meta.push({ file, title: titles[i] });
  });
  fs.writeFileSync(path.join(out, 'boards.json'), JSON.stringify(meta, null, 1));
  // the same boards as one plain page, to measure each board's height
  fs.writeFileSync(path.join(out, 'measure.html'), `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&display=swap"><style>body{margin:0}${css}.card{margin:0}</style></head><body><div class="cards">${cards.join('')}</div></body></html>`);
}
console.log('ok', CONCEPTS.map(c => c.id + ':' + sum(c.id)).join(' '));
