// Round g6, batch 1: the first drawn icons at 1.5px, the corner choice and the air shown on
// drawings, and the grid pressure-tested by them. Writes grid/cards-g6.html, grid/svg/g6/ and,
// given an out dir, the canvas artboards. Run: TOOLS=<dir with node_modules/paper> node src/boards6.js [out]
'use strict';
const fs = require('fs'), path = require('path');
const E = require('./engine.js');
const B4 = require('./boards4.js');
const { COL, f2, uiIcon } = B4;
const { W, CUT, DRAW, plus, star, BATCH } = require('./picks6.js');
const { R, cut } = E;
const { LAWS6, LAW_NAMES } = require('./laws6.js');
const ROOT = path.join(__dirname, '..');
const LAWS = ['joint', 'wear', 'press'];
const AIRS = [[12, '2px of air'], [12.75, '1.5px of air']];
const NAME = Object.fromEntries(BATCH);

const Q1 = 'Weight wise 1.5 but these icons are far from there drawing wise';
const Q2 = "Let's do a few at a time— we will need to pressure test the grid as it's being made";
const BRIEF = 'they need to sit in the stroked circle but also make sense on their own. they need to be at their root simple shapes, but joined together to make coherent glyphs. they must be crafted with the highest attention to detail and quality -- minimal bezier curves with perfect architecture. personality in the approach to how strokes are connected and curve. slight rounding of interior and exterior corners to add a vintage softness. corner rounding should not be 100% consistent though as there are different architecturally sound prinicples to how different angles intersect. the effect of the rounding should allude to something screened or pressed.';
const ASK = 'Are these closer drawing-wise? If so: which corners (by joint, even wear or pressed), and 2px or 1.5px of air?';

// ---- build everything once ----------------------------------------------------------------------
const GD = {}; // GD[law][s][id] = { b24, c12, curves }
for (const law of LAWS) {
  GD[law] = {};
  for (const [s] of AIRS) {
    GD[law][s] = {};
    const o = (24 - s) / 2;
    for (const [id] of BATCH) {
      const info = [];
      const b24 = E.build(E.xform(DRAW[id](s), 1, 0, 0, o, o), { law: LAWS6[law], centre: [12, 12], info });
      const c12 = E.build(DRAW[id](12), { law: LAWS6[law] });
      GD[law][s][id] = { b24, c12, curves: E.countCurves(b24.d), caps: info.filter(x => x.cap).length, d: b24.d };
    }
  }
}
// the two drawn UI icons, in their own 24 viewBox, radii in screen px at their app size
const UIP = { plus: [plus, 26.4], star: [star, 20] };
// batch 1's four-tier conifer, kept beside the three-tier drawing that replaced it (g6 fix 3)
const N4 = {};
for (const law of LAWS) N4[law] = { b24: E.build(E.xform(DRAW.nature4(12), 1, 0, 0, 6, 6), { law: LAWS6[law] }), c12: E.build(DRAW.nature4(12), { law: LAWS6[law] }) };
// a finished path's points (squares) and handles (dots), for a close-up; k = viewBox units per css px
function pathAnat(d, k) {
  const t = d.match(/[MLCZ]|-?\d*\.?\d+/g); let i = 0, cur = null, start = null, g = '';
  const sq = (x, y) => `<rect x="${f2(x - 3 * k)}" y="${f2(y - 3 * k)}" width="${f2(6 * k)}" height="${f2(6 * k)}" fill="${COL.raised}" stroke="${COL.ord}" stroke-width="${f2(1.4 * k)}"/>`;
  const hd = (a, b) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${COL.or}" stroke-width="${f2(1.4 * k)}"/><circle cx="${b[0]}" cy="${b[1]}" r="${f2(2.6 * k)}" fill="${COL.or}"/>`;
  while (i < t.length) {
    if (t[i] === 'M') { cur = start = [+t[i + 1], +t[i + 2]]; g += sq(...cur); i += 3; }
    else if (t[i] === 'L') { cur = [+t[i + 1], +t[i + 2]]; g += sq(...cur); i += 3; }
    else if (t[i] === 'C') { const c = t.slice(i + 1, i + 7).map(Number); g += hd(cur, [c[0], c[1]]) + hd([c[4], c[5]], [c[2], c[3]]) + sq(c[4], c[5]); cur = [c[4], c[5]]; i += 7; }
    else { cur = start; i++; }
  }
  return g;
}
// mirror check on a 24 drawing: the worst distance from any point to its mirror twin (0 = symmetric)
function mirror(d, vb = 24) {
  const n = (d.match(/-?\d*\.?\d+/g) || []).map(Number), pts = [];
  for (let i = 0; i + 1 < n.length; i += 2) pts.push([n[i], n[i + 1]]);
  let worst = 0;
  for (const [x, y] of pts) { let m = Infinity; for (const [a, b] of pts) m = Math.min(m, Math.hypot(vb - x - a, y - b)); worst = Math.max(worst, m); }
  return worst;
}
const UD = {};
for (const law of LAWS) { UD[law] = {}; for (const [k, [fn, px]] of Object.entries(UIP)) { const info = []; UD[law][k] = E.build(fn(px), { law: c => LAWS6[law](c) * 24 / px, info }); UD[law][k].caps = info.filter(x => x.cap).length; } }

// SVG files
for (const law of LAWS) for (const [s] of AIRS) {
  const dir = path.join(ROOT, 'svg', 'g6', `${law}-${s === 12 ? 'air2' : 'air1_5'}`); fs.mkdirSync(dir, { recursive: true });
  for (const [id] of BATCH) {
    fs.writeFileSync(path.join(dir, `${id}-24.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11.25" fill="none" stroke="currentColor" stroke-width="1.5"/><path fill="currentColor" d="${GD[law][s][id].b24.d}"/></svg>\n`);
    if (s === 12) fs.writeFileSync(path.join(dir, `${id}-12.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><path fill="currentColor" d="${GD[law][s][id].c12.d}"/></svg>\n`);
  }
  if (s === 12) for (const [k, [, px]] of Object.entries(UIP)) fs.writeFileSync(path.join(dir, `${k}-${px}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 24 24"><path fill="currentColor" d="${UD[law][k].d}"/></svg>\n`);
}

// ---- drawing helpers ----------------------------------------------------------------------------
let REL = { stamp: '../inventory-png/row-stamp.png', sticker: '../inventory-png/sticker-near.png' };
const badge = (d, px = 24, sel = false) => sel
  ? `<svg width="${px}" height="${px}" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11.25" fill="${COL.navy}" stroke="${COL.navy}" stroke-width="1.5"/><path d="${d}" fill="${COL.paper}"/></svg>`
  : `<svg width="${px}" height="${px}" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11.25" fill="${COL.paper}" stroke="${COL.navy}" stroke-width="1.5"/><path d="${d}" fill="${COL.navy}"/></svg>`;
const chip = d => `<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="${d}" fill="${COL.navy}"/></svg>`;
const ui = (law, k, px) => `<svg width="${f2(px || UIP[k][1])}" height="${f2(px || UIP[k][1])}" viewBox="0 0 24 24" aria-hidden="true"><path d="${UD[law][k].d}" fill="${COL.navy}"/></svg>`;
// the selected pin: 32px navy, the 24 drawing at 1:1 in paper
const selPin = (d) => `<svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="15.25" fill="${COL.navy}" stroke="${COL.navy}" stroke-width="1.5"/><path d="${d}" transform="translate(4 4)" fill="${COL.paper}"/></svg>`;
const SCALLOP_PATH = (() => { const src = fs.readFileSync(path.join(__dirname, 'boards5.js'), 'utf8'); return src.match(/const SCALLOP = '([^']+)'/)[1]; })();
const plusBadge = (law, px = 60) => `<div style="position:relative;width:${px}px;height:${px}px;line-height:0;flex:none"><svg width="${px}" height="${px}" viewBox="0 0 60 60" style="position:absolute;left:0;top:0" aria-hidden="true"><polygon points="${SCALLOP_PATH}" fill="${COL.or}"/></svg><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${ui(law, 'plus')}</div></div>`;
// the construction: each simple shape's own outline, in orange, over the drawing (cuts dashed)
const cons = (prims, px, o = 6) => E.parts(E.xform(prims, 1, 0, 0, o, o)).map(q => `<path d="${q.d}" fill="none" stroke="${COL.or}" stroke-width="${f2(1.4 * 24 / px)}"${q.cut ? ` stroke-dasharray="${f2(3 * 24 / px)} ${f2(2 * 24 / px)}"` : ''}/>`).join('');
// the curve rule made visible: on-curve points (squares) and handles (lines + dots) of one shape
function anat(q, px, o = 6) {
  const k = 24 / px, pts = E.anatomy(E.xform([q], 1, 0, 0, o, o)[0]); let g = '';
  for (const a of pts) {
    for (const h of [a.hi, a.ho]) if (h) g += `<line x1="${a.p[0]}" y1="${a.p[1]}" x2="${h[0]}" y2="${h[1]}" stroke="${COL.or}" stroke-width="${f2(1.2 * k)}"/><circle cx="${h[0]}" cy="${h[1]}" r="${f2(2.2 * k)}" fill="${COL.or}"/>`;
    g += `<rect x="${f2(a.p[0] - 2.6 * k)}" y="${f2(a.p[1] - 2.6 * k)}" width="${f2(5.2 * k)}" height="${f2(5.2 * k)}" fill="${COL.raised}" stroke="${COL.ord}" stroke-width="${f2(1.2 * k)}"/>`;
  }
  return g;
}
// on the grid, enlarged: half-pixel lattice, the box, the guides
function onGrid(d, px, s = 12, ring = true, extra = '') {
  const k = px / 24, o = (24 - s) / 2, L = (a, b, c, e, col, sw, dash) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${e}" stroke="${col}" stroke-width="${f2(sw / k)}"${dash ? ` stroke-dasharray="${f2(dash[0] / k)} ${f2(dash[1] / k)}"` : ''}/>`;
  let g = `<rect width="24" height="24" fill="${COL.raised}"/>`;
  for (let i = 0; i <= 48; i++) { const v = i / 2, c = i % 2 ? '#EFE8DA' : i === 24 ? COL.g3 : COL.g1; g += L(v, 0, v, 24, c, 1) + L(0, v, 24, v, c, 1); }
  if (ring) g += `<circle cx="12" cy="12" r="11.25" fill="none" stroke="${COL.navy}" stroke-width="1.5"/>`;
  if (ring) { // the place grid: box and guides (an app icon has its own box, so none)
    g += `<rect x="${o}" y="${o}" width="${s}" height="${s}" fill="none" stroke="${COL.blue}" stroke-opacity=".7" stroke-width="${f2(1 / k)}"/>`;
    for (const [y, dash] of [[0], [4, [4, 3]], [6, [1.5, 2.5]], [12]]) g += L(0, o + y * s / 12, 24, o + y * s / 12, COL.blue, 1.2, dash);
  }
  g += `<path d="${d}" fill="${COL.navy}" fill-opacity=".88"/>`;
  return `<svg width="${px}" height="${px}" viewBox="0 0 24 24" aria-hidden="true">${g}${extra}</svg>`;
}

const CSS = W_ => `
*{box-sizing:border-box}
.cards{width:${W_}px;font-family:Archivo,Arial,sans-serif;color:${COL.ink};background:#E4DCCB}
.card{background:${COL.raised};padding:14px 16px 18px;margin:0 0 24px}
.no{font-size:10px;letter-spacing:.12em;color:${COL.ink2};font-weight:700;text-transform:uppercase}
h2{font-size:22px;margin:2px 0 4px;letter-spacing:.04em;text-transform:uppercase;color:${COL.navy};line-height:1.1}
.att{font-size:13px;margin:4px 0 10px;line-height:1.4}
.sm{font-size:12px;line-height:1.4;margin:6px 0}
.mute{color:${COL.ink2}}
.lab{font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;color:${COL.ink2};font-weight:700;margin:18px 0 6px}
.q{font-size:13px;line-height:1.4;color:${COL.navy};background:#F3ECDF;border-left:3px solid ${COL.or};padding:8px 10px;margin:10px 0}
.q b{display:block;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:${COL.ord};margin-bottom:2px}
.q.long{font-size:12px}
.facts{font-size:12.5px;line-height:1.4;margin:0;padding:0;list-style:none}
.facts li{padding:6px 0;border-top:1px solid ${COL.hair}}
.facts b{color:${COL.navy}}
.facts .tag{display:inline-block;font-size:9px;letter-spacing:.1em;font-weight:700;text-transform:uppercase;padding:1px 5px;margin-right:4px;border:1px solid ${COL.navy};color:${COL.navy}}
.facts .tag.new{background:${COL.navy};color:${COL.raised}}
.g3{display:grid;grid-template-columns:${W_ > 500 ? '120px' : '64px'} repeat(3,minmax(0,1fr));gap:0 6px;align-items:center}
.g3 .h{font-size:13px;font-weight:700;color:${COL.navy};text-align:center;padding-bottom:4px;border-bottom:2px solid ${COL.navy}}
.g3 .n{font-size:11px;font-weight:700;color:${COL.navy};line-height:1.2;padding:8px 0;border-top:1px solid ${COL.hair};align-self:stretch;display:flex;align-items:center}
.g3 .c{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:8px 0;border-top:1px solid ${COL.hair};align-self:stretch}
.g3 .c .rs{display:flex;gap:8px;align-items:center}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:10px;align-items:start}
.pair>div{display:flex;flex-direction:column;align-items:center;gap:6px;font-size:10px;font-weight:700;color:${COL.ink2};letter-spacing:.06em;text-transform:uppercase}
.icon{border-top:2px solid ${COL.navy};padding:10px 0 12px}
.icon h3{font-size:17px;margin:0 0 6px;color:${COL.navy}}
.icon .rs{display:flex;gap:10px;align-items:center;justify-content:center}
.tri{display:grid;grid-template-columns:76px 1fr;align-items:center;border-top:1px solid ${COL.hair}}
.tri:first-of-type{border-top:0}
.tri>div:last-child{min-width:0;overflow:hidden}
.wl{font-size:12px;font-weight:700;color:${COL.navy};line-height:1.15}
.row{display:flex;align-items:center;gap:10px;height:56px;background:#F1E9DB;padding:0 10px;border-bottom:1px solid ${COL.hair}}
.row .t{font-size:16px;font-weight:600;line-height:1.15;flex:1;white-space:nowrap;overflow:hidden}
.row .t small{display:block;font-size:10.5px;letter-spacing:.08em;font-weight:700;opacity:.72;margin-top:2px}
.map{position:relative;height:84px;background:${COL.map};overflow:hidden;margin:4px 0}
.map .pn{position:absolute;line-height:0}
.chips{display:flex;gap:6px;overflow:hidden;padding:8px 0}
.chipx{display:inline-flex;align-items:center;gap:7px;height:30px;padding:0 10px;background:${COL.raised};border:1px solid ${COL.hair};border-bottom:2px solid ${COL.navy};font-size:11px;font-weight:700;letter-spacing:.08em;color:${COL.navy};flex:none}
`;

// ---- sheet 0: the batch and the question -------------------------------------------------------
function sheetIntro(n) {
  return `<section class="card" id="c${n}"><div class="no">Grid · round 6 · batch 1 · sheet ${n}</div><h2>Batch 1: drawn at 1.5px</h2>
<div class="q"><b>You said</b>"${Q1}"<br><br>"${Q2}"</div>
<p class="att">Four places and two app icons, drawn properly on grid A at 1.5px. Each one tests a different kind of joint, so the grid gets pushed in different places:</p>
<ul class="facts">
<li><b>Café:</b> curves. A low, wide cup, its handle an ear, on a saucer with a lifted rim.</li>
<li><b>Bar:</b> a curve flowing into a straight stem, and a foot.</li>
<li><b>Museum:</b> right angles and a repeated part (columns).</li>
<li><b>Nature:</b> sharp tips and notches.</li>
<li><b>The + and the Star:</b> a crossing, and the one outline.</li>
</ul>
<p class="sm">Every part is a simple shape (rectangle, triangle, a curve with two points), joined into one solid glyph. The bowls of the cup and the coupe are each two curves; the conifer's drooping branches are one curve each side.</p>
<div class="q long"><b>Your build brief</b>"${BRIEF}"</div>
<p class="sm"><b>What you can judge now that you couldn't on skeletons:</b> the corner law (sheet 2, on the drawings; sheet 3 in the app) and the air in the ring (sheet 4). Sheet 5 is the grid, pressure-tested: where it held and broke, icon by icon, and each change before and after.</p>
<p class="sm mute">Not in this batch: the other 9 places and the rest of the app icons. Visited and the home-screen icon are unchanged.</p>
<div class="q"><b>The question</b>${ASK}</div>
</section>`;
}

// ---- sheet 1: the drawings, before and now ------------------------------------------------------
const HOW = {
  cafe: 'Bowl: a flat rim and two curves meeting at the bottom. Ear: half a ring on the shoulder, so its counter stays open at 24px. Saucer: a 1.5px slab whose ends lift. No rim line: at 1.5 it split the cup.',
  bar: 'Bowl: a flat rim on TOP and two curves into the stem, its foot on SHOULDER. Stem: one 1.5px line. Foot: a low dome on BASE. The bowl is solid, so it reads as a full glass. No drink line: at 1.5 it turned the glass into an "I".',
  museum: 'Pediment on TOP; a cut; a beam; four columns hanging from it; a plinth on BASE. The spaces between the columns are 1.5px, the same as the line, so four fit (the skeleton had three).',
  nature: 'Three tiers, each a tip and two branches that droop to their ends, so the notches between tiers are sharp and the tips stay points. The trunk is one 1.5px line on BASE. (Batch 1 had four; see below.)',
};
const NATURE_READ = 'three reads better. At 24 and in the 12px chip each notch is wider, so the tree is calmer and still clearly a conifer; on the 32 pin it holds. The cost: it is a broader, more triangular tree, and the four-tier one looks more like a spruce when enlarged. Three is now the drawing.';
function natureTry(big) {
  const four = N4.joint, three = GD.joint[12].nature;
  return `<div class="lab">The one try: three tiers beside batch 1's four</div>
<div class="pair"><div>${onGrid(four.b24.d, big)}Four tiers (batch 1)</div><div>${onGrid(three.b24.d, big)}Three tiers (now the drawing)</div></div>
<div class="pair" style="margin-top:8px"><div><span class="rs" style="display:flex;gap:8px;align-items:center">${badge(four.b24.d)}${chip(four.c12.d)}${selPin(four.b24.d)}${badge(four.b24.d, 72)}</span></div><div><span class="rs" style="display:flex;gap:8px;align-items:center">${badge(three.b24.d)}${chip(three.c12.d)}${selPin(three.b24.d)}${badge(three.b24.d, 72)}</span></div></div>
<p class="sm"><b>Plainly:</b> ${NATURE_READ}</p>`;
}
function sheetDrawings(W_, n) {
  const big = W_ > 500 ? 220 : 150;
  const blocks = BATCH.map(([id, nm]) => {
    const g = GD.joint[12][id], old = B4.GL[1.5][id];
    return `<div class="icon"><h3>${nm}</h3>
<div class="pair"><div>${onGrid(old.b24.d, big)}Skeleton (g5)</div><div>${onGrid(g.b24.d, big, 12, true, cons(DRAW[id](12), big))}Drawn, its parts in orange</div></div>
<div class="pair" style="margin-top:8px"><div><span class="rs" style="display:flex;gap:8px;align-items:center">${badge(old.b24.d)}${chip(old.c12.d)}${badge(old.b24.d, 72)}</span></div><div><span class="rs" style="display:flex;gap:8px;align-items:center">${badge(g.b24.d)}${chip(g.c12.d)}${selPin(g.b24.d)}${badge(g.b24.d, 72)}</span></div></div>
<p class="sm">${HOW[id]}</p><p class="sm mute">${g.curves} curves in the outline, with the by-joint corners.</p>${id === 'nature' ? natureTry(big) : ''}</div>`;
  }).join('');
  const uis = ['plus', 'star'].map(k => `<div class="icon"><h3>${k === 'plus' ? 'The +' : 'The Star (not starred)'}</h3>
<div class="pair"><div>${uiIcon(k === 'plus' ? 0 : 3, 1.5, big)}Stroke at 1.5px (g5)</div><div>${onGrid(UD.joint[k].d, big, 12, false)}Drawn (batch 1)</div></div>
<div class="pair" style="margin-top:8px"><div>${uiIcon(k === 'plus' ? 0 : 3, 1.5)}</div><div>${ui('joint', k)}</div></div>
<p class="sm">${k === 'plus' ? 'Two 1.5px bars; the crossing takes the same fillet as a joint in the places, the ends stay cut.' : 'A five-point star 1.5px wide, drawn as a shape: the outer tips stay points, the inner corners take the joint fillet. It stays the one outline.'}</p></div>`).join('');
  return `<section class="card" id="c${n}"><div class="no">Grid · round 6 · batch 1 · sheet ${n}</div><h2>The drawings</h2>
<p class="att">Each icon on the grid, ${(big / 24).toFixed(1)}x, the g5 skeleton beside the drawing. The orange outlines are the simple shapes each drawing is joined from (a dashed one is cut away). Under each, real size (badge 24, chip 12, the selected pin 32) and 3x. Shown with the by-joint corners; sheet 2 has all three laws.</p>
${blocks}${uis}
<div class="q"><b>The question</b>${ASK}</div>
</section>`;
}

// ---- sheet 2: the corner law on the drawings ----------------------------------------------------
const LAW_LINE = {
  joint: 'Joins are filleted, as if carved from one piece; cut ends and tips stay crisp.',
  wear: 'The silhouette is worn evenly, like an old rubber stamp; joins stay tight.',
  press: 'Ink pools into every join and notch, like letterpress; outer edges stay sharp.',
};
function sheetCorners(W_, n) {
  const big = W_ > 500 ? 150 : 84;
  const head = `<div></div>${LAWS.map(l => `<div class="h">${LAW_NAMES[l]}</div>`).join('')}`;
  const rows = BATCH.map(([id, nm]) => `<div class="n">${nm}</div>${LAWS.map(l => `<div class="c">${badge(GD[l][12][id].b24.d, big)}<span class="rs">${badge(GD[l][12][id].b24.d)}${chip(GD[l][12][id].c12.d)}${selPin(GD[l][12][id].b24.d)}</span></div>`).join('')}`).join('');
  const urows = ['plus', 'star'].map(k => `<div class="n">${k === 'plus' ? 'The +' : 'Star'}</div>${LAWS.map(l => `<div class="c">${ui(l, k, big * 0.8)}${ui(l, k)}</div>`).join('')}`).join('');
  const zoom = W_ > 500 ? 190 : 104;
  // close-ups per law: the museum's beam meeting its columns (joins and outside corners), and the conifer's notches
  const zv = (id, x, y, s) => LAWS.map(l => `<div class="c"><svg width="${zoom}" height="${zoom}" viewBox="${x} ${y} ${s} ${s}" aria-hidden="true"><rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${COL.raised}"/><path d="${GD[l][12][id].b24.d}" fill="${COL.navy}"/></svg></div>`).join('');
  const close = zv('museum', 6, 8.5, 6.5);
  const close2 = zv('nature', 12, 10, 6);
  return `<section class="card" id="c${n}"><div class="no">Grid · round 6 · batch 1 · sheet ${n}</div><h2>The corners, on the drawings</h2>
<p class="att">The same drawings with each corner law, ${(big / 24).toFixed(1)}x, and at real size underneath (badge 24, chip 12, selected pin 32).</p>
<div class="g3">${head}<div class="n">How</div>${LAWS.map(l => `<div class="c" style="font-size:10.5px;line-height:1.3;text-align:center;font-weight:400">${LAW_LINE[l]}</div>`).join('')}${rows}${urows}
<div class="n">Close-up: museum, beam and columns</div>${close}<div class="n">Close-up: conifer, the notches</div>${close2}</div>
<p class="sm"><b>Plainly:</b> at real size the three are close for the cup, the coupe, the conifer and the Star; you see them at 3x and on the selected pin. Two places differ at real size, and each law has a cost:</p>
<ul class="facts">
<li><b>By joint and pressed, the museum:</b> the spaces between the columns end round at both ends, so at real size the museum reads more as an arcade, or a comb, than as columns under a beam. Pressed rounds them deepest.</li>
<li><b>Even wear, the cut ends:</b> it rounds every end (the + arms, the plinth's ends, the ends of the coupe's foot), so those look blunter and less exact at real size. It keeps the museum's spaces square, so the museum reads as columns.</li>
</ul>
<div class="q"><b>The question</b>Which corners: by joint, even wear or pressed?</div>
</section>`;
}

// ---- sheet 3: in the app, real size, one block per law ------------------------------------------
function sheetApp(n) {
  const pins = [['cafe', 6, 8], ['bar', 52, 48], ['nature', 196, 8], ['museum', 240, 46]];
  const tri = fn => LAWS.map(l => `<div class="tri"><div class="wl">${LAW_NAMES[l]}</div><div>${fn(l)}</div></div>`).join('');
  return `<section class="card" id="c${n}"><div class="no">Grid · round 6 · batch 1 · sheet ${n}</div><h2>In the app, real size</h2>
<p class="att">The three corner laws, one under another. Only the drawn icons change; the visited stamp and sticker are today's.</p>
<div class="lab">List rows</div>${tri(l => `<div class="row">${badge(GD[l][12].cafe.b24.d)}<div class="t">Kaffeverket<small>CAFÉ · STOCKHOLM</small></div>${ui(l, 'star')}</div><div class="row">${badge(GD[l][12].bar.b24.d)}<div class="t">Kaldi<small>BAR · REYKJAVÍK</small></div><img src="${REL.stamp}" width="82" height="44" alt="Visited stamp, unchanged" style="display:block"></div>`)}
<div class="lab">Map: pins and a selected pin</div>${tri(l => `<div class="map">${pins.map(([id, x, y]) => `<div class="pn" style="left:${x}px;top:${y}px">${badge(GD[l][12][id].b24.d)}</div>`).join('')}<div class="pn" style="left:136px;top:30px">${selPin(GD[l][12].museum.b24.d)}</div><div class="pn" style="left:92px;top:2px"><img src="${REL.sticker}" width="40" height="40" alt="Visited sticker, unchanged" style="display:block"></div></div>`)}
<div class="lab">Filter chips (12px)</div>${tri(l => `<div class="chips">${BATCH.map(([id, nm]) => `<span class="chipx">${chip(GD[l][12][id].c12.d)}${nm.toUpperCase()}</span>`).join('')}</div>`)}
<div class="lab">The + button</div>${tri(l => `<div style="padding:6px 0">${plusBadge(l)}</div>`)}
<div class="q"><b>The question</b>Which corners: by joint, even wear or pressed?</div>
</section>`;
}

// ---- sheet 4: the air ---------------------------------------------------------------------------
function sheetAir(W_, n) {
  const big = W_ > 500 ? 150 : 96;
  const head = `<div></div>${AIRS.map(([, nm]) => `<div class="h">${nm}</div>`).join('')}`;
  const rows = BATCH.map(([id, nm]) => `<div class="n">${nm}</div>${AIRS.map(([s]) => `<div class="c">${onGrid(GD.joint[s][id].b24.d, big, s)}<span class="rs">${badge(GD.joint[s][id].b24.d)}${selPin(GD.joint[s][id].b24.d)}</span></div>`).join('')}`).join('');
  return `<section class="card" id="c${n}"><div class="no">Grid · round 6 · batch 1 · sheet ${n}</div><h2>The air in the ring</h2>
<p class="att">How much paper between the drawing and the ring. 2px: the drawing fills the 12px box. 1.5px: the box grows to 12.75px; every line stays 1.5. Shown by joint, ${(big / 24).toFixed(1)}x on the grid, then real size and on the selected pin.</p>
<div class="g3" style="grid-template-columns:${W_ > 500 ? '120px' : '64px'} 1fr 1fr">${head}${rows}</div>
<div class="lab">In a row, real size</div>
${AIRS.map(([s, nm]) => `<div class="tri"><div class="wl">${nm}</div><div><div class="row">${badge(GD.joint[s].cafe.b24.d)}<div class="t">Kaffeverket<small>CAFÉ · STOCKHOLM</small></div>${badge(GD.joint[s].museum.b24.d)}${badge(GD.joint[s].nature.b24.d)}</div></div></div>`).join('')}
<p class="sm"><b>What 1.5px costs:</b> the box is 12.75, so the guides fall off the half-pixel lattice (TOP lands at 5.625px). At 2px they land on whole pixels.</p>
<p class="sm"><b>Plainly:</b> at real size it's half a pixel on each side. You see it most on the selected pin and in the coupe and the museum, which reach the box's corners.</p>
<div class="q"><b>The question</b>2px or 1.5px of air?</div>
</section>`;
}

// ---- sheet 5: the grid, pressure-tested by batch 1 ----------------------------------------------
const { G4 } = require('./picks4.js');
const REPORT = {
  cafe: { held: 'box; MIDDLE (the cup and saucer centres on it exactly); the ear opens 2.3px at 24', broke: ['cut 0.9 → change 1', 'the rim line → change 3', 'curves had no rule → change 4'] },
  bar: { held: 'box; TOP (the rim) and BASE (the foot); SHOULDER (the bowl ends on it); one piece, no cuts', broke: ['the drink line → change 3', 'curves → change 4'] },
  museum: { held: 'box; TOP, SHOULDER (the beam), BASE (the plinth); the pediment\'s 1-in-2 slope; the beam is a part, not a cut, so it stays', broke: ['cut 0.9 → change 1', 'its own column spacing → change 2', 'lopsided slot ends → change 7'] },
  nature: { held: 'box; TOP (the tip), BASE (the trunk)', broke: ['branches are curves, which the angle rule didn\'t cover → change 5', 'the g4 tier table says four at 1.5px, and four crowd at 24 → change 8'] },
  plus: { held: 'its size and place in the + badge', broke: ['a stroke can\'t take a corner law → change 6'] },
  star: { held: 'the one outline; its size', broke: ['a stroke → change 6'] },
};
function sheetGrid(W_, n) {
  const px = W_ > 500 ? 150 : 96, sm = W_ > 500 ? 110 : 72;
  const L = LAWS6.joint, built = (prims) => E.build(E.xform(prims, 1, 0, 0, 6, 6), { law: L }).d;
  const ba = (before, after, lb = 'Before', la = 'After') => `<div class="pair" style="margin:6px 0 4px"><div>${before}${lb}</div><div>${after}${la}</div></div>`;
  const real = (d1, d2) => `<div class="pair"><div><span class="rs" style="display:flex;gap:6px">${badge(d1)}${badge(d1, 48)}</span></div><div><span class="rs" style="display:flex;gap:6px">${badge(d2)}${badge(d2, 48)}</span></div></div>`;
  // change 1: the cut
  const cafe09 = built(DRAW.cafe(12, 0.9)), mus09 = built(DRAW.museum(12, 0.9));
  const c1 = ba(onGrid(cafe09, px), onGrid(GD.joint[12].cafe.b24.d, px), 'Cut 0.9px', 'Cut 1px') + real(mus09, GD.joint[12].museum.b24.d);
  // change 2: spaces between repeated parts
  const c2 = ba(onGrid(B4.GL[1.5].museum.b24.d, px), onGrid(GD.joint[12].museum.b24.d, px), 'Own spacing 2.1px: 3 columns', 'Spaces = the line: 4 columns');
  // change 3: no hairline cuts inside a mass
  const rim = built([...DRAW.cafe(12), cut(R(0.5, 2.6, 9, 0.9))]), drink = built([...DRAW.bar(12), cut(R(-1, 1.2, 14, 0.9))]);
  const c3 = ba(onGrid(rim, px), onGrid(GD.joint[12].cafe.b24.d, px), 'With the rim cut', 'Without') + real(rim, GD.joint[12].cafe.b24.d)
    + ba(onGrid(drink, px), onGrid(GD.joint[12].bar.b24.d, px), 'With the drink line', 'Without') + real(drink, GD.joint[12].bar.b24.d);
  // change 4: the curve rule (before: the skeleton's bowl was a circle cut off at TOP)
  const oldBowl = G4.bar(1.5)[0], newBowl = DRAW.bar(12)[0], cupBowl = DRAW.cafe(12)[0];
  const c4 = ba(onGrid(B4.GL[1.5].bar.b24.d, px, 12, true, anat(oldBowl, px)), onGrid(GD.joint[12].bar.b24.d, px, 12, true, anat(newBowl, px)), 'Skeleton: a circle, its points off the glyph', 'Drawn: two curves, points at the extremes')
    + `<div class="pair"><div></div><div>${onGrid(GD.joint[12].cafe.b24.d, px, 12, true, anat(cupBowl, px))}The cup's bowl, the same rule</div></div>`;
  // change 5: angles. Straight lines keep the rule (the pediment); the branches are curves
  const c5 = ba(onGrid(GD.joint[12].museum.b24.d, px, 12, true, anat(DRAW.museum(12)[0], px)), onGrid(GD.joint[12].nature.b24.d, px, 12, true, DRAW.nature(12).slice(0, 4).map(q => anat(q, px)).join('')), 'Straight: the pediment rises 1 in 2', 'Curved: each branch is one curve');
  // change 6: app icons drawn
  const c6 = ba(uiIcon(0, 1.5, px), onGrid(UD.joint.plus.d, px, 12, false), 'A stroke: the crossing can\'t be shaped', 'A shape: the crossing takes the joint fillet');
  const c8 = ba(onGrid(N4.joint.b24.d, px), onGrid(GD.joint[12].nature.b24.d, px), 'Four tiers (the table)', 'Three tiers (as many as read)') + real(N4.joint.b24.d, GD.joint[12].nature.b24.d);
  // change 7: the collision rule. Before = batch 1 as first sent (the run between two rounds dropped)
  const oldMus = fs.readFileSync(path.join(ROOT, 'svg/g6/before-collision/museum-24.svg'), 'utf8').match(/ d="([^"]+)"/g).pop().slice(4, -1);
  const zs = W_ > 500 ? 220 : 150, zb = [7.9, 11.0, 2.2];   // one slot's top: x 8.25 to 9.75, top at 11.5
  const zoomv = (d) => `<svg width="${zs}" height="${zs}" viewBox="${zb[0]} ${zb[1]} ${zb[2]} ${zb[2]}" aria-hidden="true"><rect x="${zb[0]}" y="${zb[1]}" width="${zb[2]}" height="${zb[2]}" fill="${COL.raised}"/><line x1="9" y1="${zb[1]}" x2="9" y2="${zb[1] + zb[2]}" stroke="${COL.blue}" stroke-width="${f2(zb[2] / zs)}" stroke-dasharray="${f2(4 * zb[2] / zs)} ${f2(3 * zb[2] / zs)}"/><path d="${d}" fill="${COL.navy}" fill-opacity=".85"/>${pathAnat(d, zb[2] / zs)}</svg>`;
  const c7 = ba(zoomv(oldMus), zoomv(GD.joint[12].museum.b24.d), 'Before: two unequal curves, the top off centre', 'After: one arc, two equal quarters, centred') + real(oldMus, GD.joint[12].museum.b24.d);
  const rechk = [...BATCH.map(([id, nm]) => [nm, LAWS.map(l => GD[l][12][id]), id === 'cafe']), ['The +', LAWS.map(l => UD[l].plus), false], ['The Star', LAWS.map(l => UD[l].star), false]]
    .map(([nm, gs, asym]) => `<li><b>${nm}:</b> ${LAWS.map((l, i) => `${LAW_NAMES[l].toLowerCase()} ${gs[i].caps} arc${gs[i].caps === 1 ? '' : 's'}`).join(', ')}. Mirror check: ${asym ? 'not symmetric by design (the ear)' : `worst ${Math.max(...gs.map(g => mirror(g.d))).toFixed(3)}px`}. Slivers: 0.</li>`).join('');
  const rep = [...BATCH, ['plus', 'The +'], ['star', 'The Star']].map(([id, nm]) => `<li><b>${nm}.</b> Held: ${REPORT[id].held}. <b>Broke:</b> ${REPORT[id].broke.join('; ')}.</li>`).join('');
  const ch = (no, title, why, fig) => `<div class="icon"><h3>Change ${no}: ${title}</h3><p class="sm">${why}</p>${fig}</div>`;
  return `<section class="card" id="c${n}"><div class="no">Grid · round 6 · batch 1 · sheet ${n}</div><h2>The grid, pressure-tested</h2>
<p class="att">You said "${Q2}". First, icon by icon, where grid A held and where it broke. Then each change we propose, shown before and after. Batch 1 is the first, so there are no earlier drawings to re-check; batch 2 will re-check these six under any new change.</p>
<div style="display:flex;gap:6px;justify-content:space-between;margin:8px 0">${BATCH.map(([id]) => onGrid(GD.joint[12][id].b24.d, sm, 12, true, cons(DRAW[id](12), sm))).join('')}</div>
<div class="lab">Held and broke, icon by icon</div>
<ul class="facts">${rep}</ul>
<div class="lab">The changes (proposed; none is a one-icon exception). Change 7 was added after the director's score.</div>
${ch(1, 'a cut is 1px, not 0.9', '0.9 (0.6 × the line) never lands on the 0.25px drawing lattice, so every edge after a cut drifted off it. 1px does. It fixes the café and the museum; at real size the difference is a hair (the museum, real size and 2x, below).', c1)}
${ch(2, 'spaces between repeated parts = the line', 'The skeleton gave the museum its own wider column spacing, an exception for one icon. The general rule (a space between separate parts is the line, 1.5px) fits four columns, and four reads as a column front at 24px.', c2)}
${ch(3, 'no hairline cuts inside a mass', 'This replaces "small details only at w ≤ 1.5px", which let in the rim, the drink line, the bag\'s band and the bed\'s fold; all four cost the read (g5). Detail comes from the silhouette and from open counters instead. Shown on the two in this batch; the bag and bed are batch 2.', c3)}
${ch(4, 'a rule for curves', 'The grid had none. As drawn: a curve runs between two points that are its extremes, with flat or upright handles, and ends on the 0.25px lattice or at a corner. So a bowl is two curves. Squares are points; dots are handles.', c4)}
${ch(5, 'angles: straight lines and curves', 'Straight lines keep "orthogonal, 45° or a whole-pixel slope". The conifer\'s branches are curves, which that rule didn\'t cover; they follow change 4.', c5)}
${ch(6, 'app icons are drawn as shapes', 'The + and the Star are drawn like the places, so the corner law reaches them. A stroke can only have round or square ends.', c6)}
${ch(7, 'two rounds that collide become one arc', `Added after the director's score. Where two rounds want more room than a short edge has (a 1.5px slot end, a bar's end), batch 1 dropped the leftover run, which left the slot's top off centre (x 9.03 on a slot centred at 9.0) with unequal curves. The rule now: they become one true semicircle, radius 0.75 on a 1.5px slot, drawn as two equal quarter arcs meeting on the centre line. Any other two rounds that would leave a run under 0.2px share the edge evenly. Shown 68x on one slot of the museum (squares are points, dots are handles), then real size before and after. <b>Re-checked under it, all six:</b><ul class="facts">${rechk}</ul><p class="sm">The mirror check: every point has a mirrored twin within 0.01px (the batch 1 museum missed by ${mirror(oldMus).toFixed(2)}px). The checks are in <code>src/check-svg.py</code>, beside the sliver scan.</p>`, c7)}
${ch(8, '"as many as fit" is a ceiling, not a target', 'Added after the director\'s score. The g4 rule set the conifer\'s tiers by a table (four at 1.5px). Four fit, but they crowd at 24 and in the chip; three read cleaner. Proposed: repeated parts are as many as read at 24px, never more than the cut and space rules allow. It changes the conifer only; the museum\'s four columns and the other counts still read.', c8)}
<div class="lab">Open</div>
<ul class="facts">
<li><b>SHOULDER (4):</b> it held in two of four (the coupe's bowl and the museum's beam end on it). Batch 2 tests it again.</li>
<li><b>The corner law and the air:</b> your picks (sheets 2 to 4).</li>
<li><b>The pixel lattice:</b> every construction point is on a 0.25px lattice; the corner rounds end where the law puts them. A 1.5px line centred in the box can't sit on whole or half pixels (the coupe's stem runs 11.25 to 12.75), so its edges fall between dots on a 3x phone.</li>
</ul>
<p class="sm mute">Next batch, if this direction is right: hotel (the bed without its fold), venue, landmark (the ⌘) and attraction (the wheel's spokes), with the account and locate icons.</p>
<div class="q"><b>The question</b>${ASK}</div>
</section>`;
}

function page(W_) { return { css: CSS(W_), cards: [sheetIntro(0), sheetDrawings(W_, 1), sheetCorners(W_, 2), sheetApp(3), sheetAir(W_, 4), sheetGrid(W_, 5)] }; }
const NAMES6 = ['Grid6Intro', 'Grid6Drawings', 'Grid6Corners', 'Grid6App', 'Grid6Air', 'Grid6Rules'];
const TITLES6 = ['Batch 1: drawn at 1.5px', 'The drawings', 'The corners, on the drawings', 'In the app, real size', 'The air in the ring', 'The grid, pressure-tested'];

if (require.main === module) {
  {
    const { css, cards } = page(390);
    fs.writeFileSync(path.join(ROOT, 'cards-g6.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=390"><title>Grid round 6: batch 1</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&display=swap">
<style>body{margin:0;background:#E4DCCB}${css}</style></head><body><div class="cards">${cards.join('\n')}</div></body></html>\n`);
  }
  const out = process.argv[2];
  if (out) {
    const W_ = 760;
    REL = { stamp: path.join(ROOT, '../inventory-png/row-stamp.png'), sticker: path.join(ROOT, '../inventory-png/sticker-near.png') };
    const m = page(W_);
    REL = JSON.parse(process.env.ASSETS || '{}');
    const { css, cards } = page(W_);
    fs.mkdirSync(path.join(out, 'project'), { recursive: true });
    cards.forEach((html, i) => fs.writeFileSync(path.join(out, 'project', NAMES6[i] + '.dc.html'), `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${TITLES6[i]}</title>
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
<div class="cards" style="width: ${W_}px">
${html.replace(/<section class="card" id="c\d+">/, '<section class="card">')}
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":${W_},"height":1000}}'>
class Component extends DCLogic {
renderVals() { return {}; }
}
</script>
</body>
</html>
`));
    fs.writeFileSync(path.join(out, 'boards.json'), JSON.stringify(NAMES6.map((nm, i) => ({ file: nm + '.dc.html', title: TITLES6[i] })), null, 1));
    fs.writeFileSync(path.join(out, 'measure.html'), `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0}${m.css}.card{margin:0}</style></head><body><div class="cards">${m.cards.join('')}</div></body></html>`);
  }
  console.log('ok', BATCH.map(([id]) => id + ' C' + GD.joint[12][id].curves).join(' · '));
}
