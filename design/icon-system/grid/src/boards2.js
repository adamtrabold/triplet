// Round g2: the team's frame and the owner's two visible choices.
// Writes grid/cards-g2.html (phone cards), grid/svg/g2/<law>/<pick>-<size>.svg, and, given an out dir,
// canvas artboards. Run: TOOLS=<dir with paper> node boards2.js [canvasOutDir]
'use strict';
const fs = require('fs'), path = require('path');
const E = require('./engine.js');
const { LAWS, LAW_INFO, NAMES, glyph } = require('./frame.js');
const ROOT = path.join(__dirname, '..');
const COL = { paper: '#F2EBDD', raised: '#FAF5EA', hair: '#D8CEBA', ink: '#1A1A18', ink2: '#5A564C', navy: '#12293F', or: '#EE7434', ord: '#A8400C', grid: '#E3D9C5', mod: '#C9B999', map: '#E8E4DA' };
const f2 = v => +v.toFixed(2);
const LAWK = ['joint', 'wear', 'press'];
const SHOW3 = ['museum', 'nature', 'bar'];
const sharp = { d: null };

// ---- glyph cache ----------------------------------------------------------------------------
const G = {}; // G[law][live][id][size]
for (const law of [...LAWK, 'none']) for (const live of [16, 18]) for (const [id] of NAMES) for (const size of ['badge24', 'sel32', 'chip12']) {
  G[law] = G[law] || {}; G[law][live] = G[law][live] || {}; G[law][live][id] = G[law][live][id] || {};
  if (size === 'chip12' && live === 18) continue;
  G[law][live][id][size] = glyph(id, size, law === 'none' ? null : law, live);
}
// glyph(law = null) builds with no corner law (sharp construction)

// ---- SVG files ------------------------------------------------------------------------------
for (const law of LAWK) {
  const dir = path.join(ROOT, 'svg', 'g2', law);
  fs.mkdirSync(dir, { recursive: true });
  for (const [id] of NAMES) {
    const g = G[law][16][id];
    fs.writeFileSync(path.join(dir, `${id}-24.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="${g.badge24.d}"/></svg>\n`);
    fs.writeFileSync(path.join(dir, `${id}-32.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="currentColor" d="${g.sel32.d}"/></svg>\n`);
    fs.writeFileSync(path.join(dir, `${id}-12.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><path fill="currentColor" d="${g.chip12.d}"/></svg>\n`);
  }
}

// ---- drawing helpers ------------------------------------------------------------------------
const badge = (d, px = 24) => `<svg width="${px}" height="${px}" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="${COL.paper}" stroke="${COL.navy}" stroke-width="2"/><path d="${d}" fill="${COL.navy}"/></svg>`;
const selected = (d, px = 32) => `<svg width="${px}" height="${px}" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="14.75" fill="${COL.navy}" stroke="${COL.navy}" stroke-width="2.5"/><path d="${d}" fill="${COL.paper}"/></svg>`;
const bare = (d, vb, px) => `<svg width="${px}" height="${px}" viewBox="0 0 ${vb} ${vb}" aria-hidden="true"><path d="${d}" fill="${COL.navy}"/></svg>`;

function frameGrid(px, d, { labels = true, ghost = false, live = 16 } = {}) {
  const s = px / 24, sw = 1 / s;
  let g = `<rect width="24" height="24" fill="${COL.raised}"/>`;
  for (let i = 0; i <= 24; i++) g += `<line x1="${i}" y1="0" x2="${i}" y2="24" stroke="${COL.grid}" stroke-width="${sw}"/><line x1="0" y1="${i}" x2="24" y2="${i}" stroke="${COL.grid}" stroke-width="${sw}"/>`;
  g += `<circle cx="12" cy="12" r="11" fill="none" stroke="${COL.navy}" stroke-opacity=".12" stroke-width="2"/>`;
  g += `<path fill-rule="evenodd" fill="${COL.or}" fill-opacity=".09" d="M12 2a10 10 0 1 1 0 20a10 10 0 1 1 0-20ZM12 4a8 8 0 1 0 0 16a8 8 0 1 0 0-16Z"/>`;
  g += `<circle cx="12" cy="12" r="8" fill="none" stroke="${COL.or}" stroke-width="${1.5 * sw}"/>`;
  g += `<circle cx="12" cy="12" r="8.5" fill="none" stroke="${COL.or}" stroke-width="${sw}" stroke-dasharray="${2 * sw} ${2 * sw}"/>`;
  if (labels) {
    g += `<circle cx="12" cy="12" r="9" fill="none" stroke="#2F5A7A" stroke-width="${sw}" stroke-dasharray="${5 * sw} ${3 * sw}"/>`;
    const kl = `fill="none" stroke="${COL.navy}" stroke-opacity=".45" stroke-width="${sw}"`;
    g += `<rect x="6" y="6" width="12" height="12" ${kl}/><rect x="7" y="5" width="10" height="14" ${kl}/><rect x="5" y="7" width="14" height="10" ${kl}/>`;
  }
  g += `<path d="M11.5 12h1M12 11.5v1" stroke="${COL.or}" stroke-width="${sw}"/>`;
  if (d) g += `<path d="${d}" fill="${COL.navy}" fill-opacity="${ghost ? 0.1 : 0.9}"/>`;
  if (labels) {
    const fs = 10 * sw, tx = (x, y, t, c = COL.ord) => `<text x="${x}" y="${y}" font-size="${f2(fs)}" font-family="Archivo, Arial, sans-serif" font-weight="700" fill="${c}" text-anchor="middle" paint-order="stroke" stroke="${COL.raised}" stroke-width="${3 * sw}">${t}</text>`;
    g += tx(12, 1.35, 'RING 2', COL.navy) + tx(12, 3.35, 'AIR 2') + tx(12, 4.95, 'LIVE Ø16') + tx(12, 20.85, 'POINTS TO Ø17') + tx(12, 21.9, 'FULLER OPTION: LIVE Ø18', '#2F5A7A');
  }
  return `<svg width="${px}" height="${px}" viewBox="0 0 24 24" aria-hidden="true">${g}</svg>`;
}
function chipGrid(d, px, labels = false) {
  const s = px / 12, sw = 1 / s;
  let g = `<rect width="12" height="12" fill="${COL.raised}"/>`;
  for (let i = 0; i <= 12; i++) g += `<line x1="${i}" y1="0" x2="${i}" y2="12" stroke="${i % 2 ? COL.grid : COL.mod}" stroke-width="${(i % 2 ? 1 : 1.5) * sw}"/><line x1="0" y1="${i}" x2="12" y2="${i}" stroke="${i % 2 ? COL.grid : COL.mod}" stroke-width="${(i % 2 ? 1 : 1.5) * sw}"/>`;
  if (d) g += `<path d="${d}" fill="${COL.navy}" fill-opacity="${labels ? 0.12 : 0.9}"/>`;
  if (labels) g += `<text x="6" y="11.3" font-size="${f2(9 * sw)}" font-family="Archivo, Arial, sans-serif" font-weight="700" fill="${COL.navy}" text-anchor="middle">MODULE = 2PX · 6 × 6</text>`;
  return `<svg width="${px}" height="${px}" viewBox="0 0 12 12" aria-hidden="true">${g}</svg>`;
}

// corner close-ups (same specimens as g1, the g2 laws)
const { R, P } = E;
const SPEC = [
  ['End of a line', [R(2, 5, 9, 2)], [8, 3, 5]],
  ['Elbow: outside and inside', [R(2, 2, 2, 9), R(2, 9, 9, 2)], [0.4, 6.2, 5.8]],
  ['T-join', [R(1.5, 2, 9, 2), R(5, 4, 2, 7)], [3.5, 1.5, 5]],
  ['Tip, 30°', [P([1.5, 10.5], [10.5, 10.5], [1.5, 5.3])], [6.5, 6.5, 5]],
  ['Pediment: apex 110°, eave 35°', [P([1, 8], [6, 4.5], [11, 8]), R(2, 8, 8, 2)], [-0.7, 2.8, 8.4]],
  ['Conifer tiers: the notch', [P([6, 1.5], [10, 6], [2, 6]), P([6, 4], [11, 10], [1, 10])], [0.5, 3, 5.5]],
];
function specimen(law, prims, px, crop) {
  const info = [], r = E.build(prims, { law: LAWS[law], info });
  const [cx, cy, cs] = crop, s = px / cs;
  let g = `<rect x="-1" y="-1" width="14" height="14" fill="${COL.raised}"/>`;
  for (let i = 0; i <= 12; i += 0.5) {
    const c = i % 1 ? COL.grid : COL.mod, w = (i % 1 ? 0.6 : 1) / s;
    g += `<line x1="${i}" y1="-1" x2="${i}" y2="13" stroke="${c}" stroke-width="${w}"/><line x1="-1" y1="${i}" x2="13" y2="${i}" stroke="${c}" stroke-width="${w}"/>`;
  }
  const sh = E.build(prims, {});
  g += `<path d="${r.d}" fill="${COL.navy}" fill-opacity=".9"/>`;
  g += `<path d="${sh.d}" fill="none" stroke="${COL.or}" stroke-width="${1.5 / s}" stroke-dasharray="${4 / s} ${3 / s}"/>`;
  const seen = new Set();
  for (const c of info) {
    const k = c.x.toFixed(1) + ',' + c.y.toFixed(1);
    if (seen.has(k)) continue; seen.add(k);
    if (c.x < cx + 0.2 || c.x > cx + cs - 0.2 || c.y < cy + 0.2 || c.y > cy + cs - 0.2) continue;
    const fs = 11 / s, mx = cx + cs / 2, my = cy + cs / 2;
    const dx = c.x < mx ? -1 : 1, dy = c.y < my ? -1 : 1;
    const tx = c.x + dx * 0.25 * (c.convex ? 1 : -1) + (c.convex ? 0 : dx * 0.6), ty = c.y + dy * 0.25 * (c.convex ? 1 : -1) + (c.convex ? 0 : dy * 0.6);
    let anchor = (c.convex ? dx : -dx) < 0 ? 'end' : 'start';
    if (tx > cx + cs - 2) anchor = 'end'; if (tx < cx + 1.2) anchor = 'start';
    const lab = c.r < 1 ? c.r.toFixed(2).replace(/^0/, '').replace(/0$/, '') : c.r.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
    g += `<text x="${f2(tx)}" y="${f2(ty + ((c.convex ? dy : -dy) > 0 ? fs * 0.8 : 0))}" font-size="${f2(fs)}" text-anchor="${anchor}" fill="${c.convex ? COL.ord : '#2F5A7A'}" font-family="Archivo, Arial, sans-serif" font-weight="700" paint-order="stroke" stroke="${COL.raised}" stroke-width="${3 / s}">${lab}</text>`;
  }
  return { svg: `<svg width="${px}" height="${px}" viewBox="${cx} ${cy} ${cs} ${cs}" aria-hidden="true" style="display:block">${g}</svg>`, d: r.d, s };
}

// ---- copy ------------------------------------------------------------------------------------
const BRIEF = 'yes they need to sit in the stroked circle but also make sense on their own. they need to be at their root simple shapes, but joined together to make coherent glyphs. they must be crafted with the highest attention to detail and quality -- minimal bezier curves with perfect architecture. personality in the approach to how strokes are connected and curve. slight rounding of interior and exterior corners to add a vintage softness. corner rounding should not be 100% consistent though as there are different architecturally sound prinicples to how different angles intersect. the effect of the rounding should allude to something screened or pressed.';
const QUESTION = 'For the grid: which corner law — by joint, even wear or pressed? And in the circle, 2px of air or the fuller 1px?';
const ROUGH = 'Skeletons are rough on purpose; the wheel, the bed, the bag and the walker look worst. Judge the grid, not them.';
const PERS = '"personality in the approach to how strokes are connected and curve"';

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
.rules b{color:var(--navy)}
.leg{display:flex;flex-wrap:wrap;gap:4px 12px;font-size:10px;color:var(--ink2);margin-top:6px}
.leg i{display:inline-block;width:14px;height:0;border-top:1.5px solid var(--or);vertical-align:middle;margin-right:4px}
.leg i.d{border-top-style:dashed}.leg i.b{border-top:1.5px dashed #2F5A7A}.leg i.k{border-top:1px solid rgba(18,41,63,.5)}.leg i.a{border-top:6px solid rgba(238,116,52,.15)}
.cells{display:grid;grid-template-columns:repeat(${W > 500 ? 5 : 3},1fr);gap:12px 8px}
.cell{display:flex;flex-direction:column;align-items:center;gap:4px}
.cell .real{display:flex;align-items:center;gap:6px;height:34px}
.cell .nm{font-size:9.5px;letter-spacing:.06em;text-transform:uppercase;font-weight:700;color:var(--navy);text-align:center;line-height:1.2}
.cell .nm small{display:block;font-weight:400;letter-spacing:0;text-transform:none;color:var(--ink2);font-size:9.5px}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chips div{display:flex;flex-direction:column;align-items:center;gap:3px;font-size:8.5px;color:var(--ink2)}
.law{border-top:2px solid var(--navy);margin-top:16px;padding-top:8px}
.law h3{margin:0;font-size:14px;letter-spacing:.08em;text-transform:uppercase;color:var(--navy)}
.law .pers{font-size:12px;line-height:1.4;margin:5px 0;color:var(--ink)}
.law .pers i{color:var(--ord);font-style:normal}
.law .rule{font-size:11px;line-height:1.35;color:var(--ink2);margin:3px 0 8px}
.three{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;justify-items:center}
.sizes{display:flex;align-items:center;gap:10px;margin:8px 0 4px;flex-wrap:wrap}
.sizes span{font-size:9px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;color:var(--ink2)}
.strip{display:flex;flex-wrap:wrap;gap:4px;margin:4px 0}
.spec{display:grid;grid-template-columns:repeat(3,1fr);gap:6px 8px;align-items:center}
.spec .h{font-size:9px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;color:var(--navy);text-align:center}
.spec .rl{grid-column:1/-1;font-size:10.5px;font-weight:700;color:var(--navy);line-height:1.2;margin-top:8px;display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.spec .rl span{font-weight:400;color:var(--ink2)}
.spec .c{display:flex;flex-direction:column;align-items:center;gap:4px}
.one{display:grid;grid-template-columns:42px 1fr;gap:6px;align-items:center;margin:6px 0}
.one b{font-size:10px;color:var(--navy);line-height:1.15}
.one .ics{display:flex;flex-wrap:wrap;gap:4px}
.facts{font-size:11.5px;line-height:1.38;margin:0;padding:0;list-style:none}
.facts li{padding:4px 0;border-top:1px solid var(--hair)}
.facts b{color:var(--navy)}
table.m{border-collapse:collapse;width:100%;font-size:11px;line-height:1.3}
table.m td,table.m th{border-top:1px solid var(--hair);padding:5px 4px;text-align:left;vertical-align:middle}
table.m th{font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink2)}
`;

const NAME = id => NAMES.find(n => n[0] === id)[1];

function cardIntro(n) {
  const rows = [
    ['Row badge, near pin', '24', 'ring 2px, inside Ø20', badge(G.joint[16].cafe.badge24.d)],
    ['Selected pin', '32', 'rim 2.5px, inside Ø27, colours flip', selected(G.joint[16].cafe.sel32.d)],
    ['Filter chip', '12', 'no circle, the glyph alone', bare(G.joint[16].cafe.chip12.d, 12, 12)],
    ['The + button', '60', 'scalloped badge; its + is 2.00px', `<svg width="26" height="26" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="${COL.navy}" stroke-width="1.8182" stroke-linecap="round"/></svg>`],
  ];
  return `<section class="card" id="c${n}"><div class="no">Grid · round 2 · card ${n}</div><h2>The grid: one frame, two choices</h2>
<p class="att">You asked for a shared grid to draw the 13 on. We've set the frame (card 1). Two things are yours to choose because you can see them: <b>the corner law</b> (card 2) and <b>how full the glyph sits in the circle</b> (card 4).</p>
<div class="q"><b>Your brief for the build, word for word</b>${BRIEF}</div>
<div class="lab">Where the glyphs show, measured in the app today</div>
<table class="m"><tr><th></th><th>px</th><th>Around the glyph</th><th>Real size</th></tr>
${rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}</table>
<p class="att" style="font-size:11.5px;color:var(--ink2)">Today every glyph is one drawing, shrunk: a 2-unit part is 1.5px in the badge and 1px in the chip. Your line is 2.00px at every size, so each size gets its own drawing.</p>
<div class="q"><b>Before you look</b>${ROUGH}</div>
<div class="q"><b>The question</b>${QUESTION}</div>
</section>`;
}

function cardFrame(W, n) {
  const big = Math.min(W - 32, 360), cellPx = W > 500 ? 132 : 108;
  const cells = NAMES.map(([id, nm, what]) => {
    const g = G.none[16][id];
    return `<div class="cell">${frameGrid(cellPx, g.badge24.d, { labels: false })}<div class="real">${badge(g.badge24.d)}${selected(g.sel32.d)}${bare(g.chip12.d, 12, 12)}</div><div class="nm">${nm}<small>${what}</small></div></div>`;
  }).join('');
  const chips = NAMES.map(([id, nm]) => `<div>${chipGrid(G.none[16][id].chip12.d, 56)}<span>${nm}</span></div>`).join('');
  return `<section class="card" id="c${n}"><div class="no">Grid · round 2 · card ${n} · the team's call</div><h2>The frame</h2>
<p class="att"><b>A separate drawing for each size, on the screen's own pixels; the 12px chip on a 2px module.</b> Why: one drawing shrunk to 12 couldn't keep your 2.00px line and still "make sense on their own" (round 1's Seal lost the wheel's spokes, two columns and the cup's handle there).</p>
<div class="lab">The 24 badge, enlarged ${(big / 24).toFixed(1)}x</div>
${frameGrid(big, G.none[16].museum.badge24.d, { ghost: true })}
<div class="leg"><span><i></i>live circle Ø16</span><span><i class="d"></i>points may reach Ø17</span><span><i class="b"></i>the fuller option, Ø18 (card 4)</span><span><i class="a"></i>air</span><span><i class="k"></i>keylines</span></div>
<div class="lab">The 12 chip, enlarged 15x: 6 × 6 modules of the 2px line</div>
${chipGrid(G.none[16].museum.chip12.d, Math.min(big, 180), true)}
<ul class="rules">
<li><b>24 badge and near pin:</b> 1 grid square = 1 screen pixel. Ring 2, air 2, live circle Ø16; points (corners, tips) may reach Ø17. Keylines: square 12, upright 10×14, wide 14×10.</li>
<li><b>32 selected pin:</b> its own drawing, the 24's parts enlarged 4/3 with every line kept at 2px.</li>
<li><b>12 chip:</b> 6 × 6 modules of 2px; each part is whole modules, a cut or gap at least 1px.</li>
<li><b>Every line is 2px</b>, the ⌘ included. A solid is never thinner than 2px.</li>
<li><b>Shapes:</b> rectangles, circles and arcs, 45° diagonals; other slopes as whole-pixel steps (1:2, 2:3).</li>
<li><b>Centring:</b> straight edges on whole pixels at 24 and 12; symmetric parts use even widths so they centre.</li>
</ul>
<p class="att" style="font-size:11px;color:var(--ink2)">Precedent: Material (24 canvas, 20 live, keyline shapes), IBM (whole-pixel coordinates), Fluent and Heroicons (a drawing per size), map symbols (design for the smallest size).</p>
<div class="lab">The 13 on the frame, corners not yet rounded · under each, real size: badge, selected pin, chip</div>
<div class="cells">${cells}</div>
<div class="lab">The 12 chip drawings, enlarged 4.7x</div>
<div class="chips">${chips}</div>
<ul class="facts" style="margin-top:10px">
<li><b>What was done this round:</b> the 12s were drawn as their own set on the 2px module, not derived from the 24s. The 32s are the 24s enlarged by code, a first fit to be hand-tuned in the drawing step.</li>
<li><b>At 12px three picks need 1.5px parts:</b> the ⌘, the wheel's spokes and the walker's arms. A drawing-step question.</li>
</ul>
</section>`;
}

function cardLaws(W, n) {
  const big = W > 500 ? 132 : 96;
  const blocks = LAWK.map(law => {
    const L = LAW_INFO[law];
    const four = SHOW3.map(id => badge(G[law][16][id].badge24.d, big)).join('');
    const sel = SHOW3.map(id => selected(G[law][16][id].sel32.d)).join('');
    const b24 = SHOW3.map(id => badge(G[law][16][id].badge24.d)).join('');
    const all = NAMES.map(([id]) => badge(G[law][16][id].badge24.d)).join('');
    return `<div class="law"><h3>${L.name}</h3>
<p class="pers"><i>${PERS}:</i> ${L.personality}</p>
<p class="rule">${L.rule}</p>
<div class="three">${four}</div>
<div class="sizes"><span>32 selected</span>${sel}<span>24</span>${b24}</div>
<div class="strip">${all}</div></div>`;
  }).join('');
  return `<section class="card" id="c${n}"><div class="no">Grid · round 2 · card ${n} · choice 1</div><h2>The corner law</h2>
<p class="att">Each law puts the softness in a different place: <b>by joint</b> in the joins, <b>even wear</b> on the outer edge, <b>pressed</b> in the inside corners. Shown on the column front, the conifer and the coupe at 4x, then at real size on the 32 selected pin and the 24 badge, then all 13 at 24.</p>
<div class="q"><b>Plainly</b>At 24 on your phone the difference is texture, not shape: you see it at line ends and joins if you look (round ends in even wear, webbed joins in pressed), not at a glance. On the 32 selected pin it shows, and at 4x it's obvious. All three are slight; they differ in kind.</div>
${blocks}
</section>`;
}

function cardCloseups(W, n) {
  const px = Math.floor((W - 32 - 16) / 3);
  const head = LAWK.map(l => `<div class="h">${LAW_INFO[l].name}</div>`).join('');
  const rows = SPEC.map(([nm, prims, crop]) => {
    const cells = LAWK.map(l => specimen(l, prims, px, crop));
    return `<div class="rl">${nm} <span>· enlarged ${cells[0].s.toFixed(0)}x</span></div>${cells.map(x => `<div class="c">${x.svg}</div>`).join('')}`;
  }).join('');
  return `<section class="card" id="c${n}"><div class="no">Grid · round 2 · card ${n} · choice 1, up close</div><h2>Each law, corner by corner</h2>
<p class="att">The same corners under each law. Dashed orange: the sharp construction. Numbers: radius in screen px, <span style="color:${COL.ord};font-weight:700">outside</span> and <span style="color:#2F5A7A;font-weight:700">inside</span>. Each rounded corner is one curve.</p>
<div class="spec">${head}${rows}</div>
<ul class="facts" style="margin-top:12px">
${LAWK.map(l => `<li><b>${LAW_INFO[l].name}.</b> ${LAW_INFO[l].rule} ${LAW_INFO[l].print}</li>`).join('')}
<li><b>Why print:</b> ink spreads into inside corners first. Bell Centennial (Matthew Carter, 1975–78) cut ink traps at its joins so phone-book ink could fill them; letterpress printers call the edge build-up "ink squeeze".</li>
</ul></section>`;
}

function cardFull(W, n) {
  const big = W > 500 ? 160 : 96;
  const row = (live) => NAMES.map(([id]) => badge(G.joint[live][id].badge24.d)).join('');
  const rowSel = (live) => ['restaurant', 'museum', 'nature', 'shopping', 'street'].map(id => selected(G.joint[live][id].sel32.d)).join('');
  return `<section class="card" id="c${n}"><div class="no">Grid · round 2 · card ${n} · choice 2</div><h2>How full in the circle</h2>
<p class="att">The same 13 (corners by joint), with 2px of air inside the ring or 1px. At 1px they fill the seal like a coin or a stamp; at 2px the air matches the ring's own weight.</p>
<div class="lab">2px of air, live Ø16 · 4x</div><div class="three">${['museum', 'nature', 'shopping'].map(id => badge(G.joint[16][id].badge24.d, big)).join('')}</div>
<div class="lab">1px of air, live Ø18 · 4x</div><div class="three">${['museum', 'nature', 'shopping'].map(id => badge(G.joint[18][id].badge24.d, big)).join('')}</div>
<div class="lab">All 13 at 24, then five on the 32 selected pin</div>
<div class="one"><b>2px air<br>Ø16</b><div class="ics">${row(16)}</div></div>
<div class="one"><b>1px air<br>Ø18</b><div class="ics">${row(18)}</div></div>
<div class="one"><b>2px</b><div class="ics">${rowSel(16)}</div></div>
<div class="one"><b>1px</b><div class="ics">${rowSel(18)}</div></div>
<ul class="facts" style="margin-top:8px">
<li><b>Why 1px and not 1.5px:</b> we built 1.5px (Ø17) too. It moved each edge half a pixel and didn't read as a different choice at 24, so we show the step that does.</li>
<li>The fuller rows are the same parts enlarged 1.125x with lines kept at 2px; edges land on whole pixels in the drawing step.</li>
</ul></section>`;
}

function cardTool(n) {
  return `<section class="card" id="c${n}"><div class="no">Grid · round 2 · card ${n} · how we draw</div><h2>The tool</h2>
<p class="att">You asked whether another tool or an MCP would be better. We recommend <b>drawing as code</b>, the way these cards were made.</p>
<ul class="facts">
<li><b>The grid is the code.</b> Each glyph is a list of simple shapes. A script joins them into one path with real holes, applies the corner law, and writes the SVG. Change a radius once and all 13 follow; every change is a reviewable line.</li>
<li><b>It works the way your brief reads.</b> "simple shapes, but joined together": the source is the shapes. "minimal bezier curves": each rounded corner is one curve, and we count them. "should not be 100% consistent": the corner law, written once, says how each kind of corner rounds.</li>
<li><b>Figma, via its MCP,</b> is the other route if you want to push curves by hand. Its write tools are in beta, and this environment has no Figma connection.</li>
</ul>
<div class="q"><b>The question</b>${QUESTION}</div>
</section>`;
}

function page(W) {
  return { css: CSS(W), cards: [cardIntro(0), cardFrame(W, 1), cardLaws(W, 2), cardCloseups(W, 3), cardFull(W, 4), cardTool(5)] };
}

{
  const { css, cards } = page(390);
  fs.writeFileSync(path.join(ROOT, 'cards-g2.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=390"><title>Grid round 2</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&display=swap">
<style>body{margin:0;background:#E4DCCB}${css}</style></head><body><div class="cards">${cards.join('\n')}</div></body></html>\n`);
}
const out = process.argv[2];
if (out) {
  const W = 760, { css, cards } = page(W);
  const names = ['Grid2Intro', 'Grid2Frame', 'Grid2Corners', 'Grid2CornerCloseups', 'Grid2Fullness', 'Grid2Tool'];
  const titles = ['The grid: one frame, two choices', 'The frame (the team\'s call)', 'Choice 1: the corner law', 'Choice 1, corner by corner', 'Choice 2: how full in the circle', 'The tool, and the question'];
  fs.mkdirSync(path.join(out, 'project'), { recursive: true });
  const meta = [];
  cards.forEach((html, i) => {
    const file = `${names[i]}.dc.html`;
    fs.writeFileSync(path.join(out, 'project', file), `<!doctype html>
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
`);
    meta.push({ file, title: titles[i] });
  });
  fs.writeFileSync(path.join(out, 'boards.json'), JSON.stringify(meta, null, 1));
  fs.writeFileSync(path.join(out, 'measure.html'), `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&display=swap"><style>body{margin:0}${css}.card{margin:0}</style></head><body><div class="cards">${cards.join('')}</div></body></html>`);
}
const sum = law => NAMES.reduce((a, [id]) => a + G[law][16][id].badge24.curves, 0);
console.log('ok curves', LAWK.map(l => l + ':' + sum(l)).join(' '));
