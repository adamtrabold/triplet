// Round g7: batch 1 REDRAWN to the owner's craft bar, grounded in icon-design practice
// (owner: "i want them all to be focusing on best practices and principles for icon design").
// Writes grid/cards-g7.html, grid/svg/g7/ and, given an out dir, the canvas artboards.
// Run: TOOLS=<dir with node_modules/paper> node src/boards7.js [out]
'use strict';
const fs = require('fs'), path = require('path');
const E = require('./engine.js');
const B4 = require('./boards4.js');
const { COL, f2, uiIcon } = B4;
const P7 = require('./picks7.js');
const P7H = require('./picks7h.js');   // v105 (g7h) as shown, frozen for the g7i before/after
const P6 = require('./picks6.js');
const { LAWS6 } = require('./laws6.js');
const { LAWS7, LAW_NAMES, scaled, fit, TRAP, HUMAN } = require('./laws7.js');
const { measure } = require('./optics.js');
const paperLib = require(path.join(process.env.TOOLS || '/tmp/claude-0/-home-user-la-trip-map/04f8fb34-0476-5960-add5-8bd3d6d8820e/scratchpad/tools', 'node_modules/paper/dist/paper-core.js'));
const { check: OCHECK, overlay: OVERLAY } = require('./offset-check.js');
const { drink: DRINK } = require('./drink-measure.js');
const { W, WH, DRAW, plus, star, BATCH } = P7;
const ROOT = path.join(__dirname, '..');
const LAWS = ['joint', 'wear', 'press'];
const AIRS = [[12, '2px of air'], [12.75, '1.5px of air']];

const Q_CRAFT = "i definitely think it's the right side for all of the icons on the first board on this page... and i definitely think the 1.5px weight feels the best right now. that said none of these are yet at the craft level i need the icons to be at -- the sizes of various parts of many of these are not yet optically pleasing, the rounding at various intersections feels wrong (some places too broad roujnding, some too tight), and some of the choices inside of the icons don't make sense (for example why does the coffee cup handle cut off on the bottom - it creates a narrow passage that will definitely disappear at small sizes...and why is the interior of the museum pillars totally rounded pill shapes...these are just examples). i also think some of these decisions are contributing to poor optical alignment inside of the badge -- some feel like they're floating above center, some feel slightly lower on center. none have the same optical weight exactly yet when viewed as a set.";
const Q_PRACTICE = 'i want them all to be focusing on best practices and principles for icon design';
const ASK = 'Sized by one rule and cut from one set of shapes, do the six now read as the same size and the same family? If not, which one still looks off?';

// ---- OPTICAL CENTRING (practice: centre the mass, not the box) ---------------------------------
// The point placed on the badge's centre is halfway between the drawing's box centre and its ink
// centroid: the box alone floats top-heavy drawings (the coupe) high; the centroid alone over-corrects
// thin parts. Steps: 1/3px up and down (keeps horizontals on whole device pixels), 1/4px across.
const r3 = v => Math.round(v * 3) / 3, r4 = v => Math.round(v * 4) / 4;
// ---- g7i: SIZE BY CLASS (the token). The drawing sets proportions; the grid sets size: fitS() scales
// each drawing (positions only, never its lines) until its box just fits its class's cut of the token,
// plus 1/2px for an apex. No icon carries its own size number.
const { KEY, CLASS, APEX } = P7;
function fitS(id, A = 12, draw = DRAW) {
  const [cls, apex] = CLASS[id], [kw, kh] = KEY[cls], bw = kw * A / 12, bh = kh * A / 12 + apex;
  let s = A;
  for (let i = 0; i < 6; i++) { const b = measure(E.build(draw[id](s), { law: LAWS7.joint }).d).box; s *= Math.min(bw / (b.x1 - b.x0), bh / (b.y1 - b.y0)); }   // the finished outline
  return s;
}
const SFIT = {}; for (const [A] of AIRS) { SFIT[A] = {}; for (const [id] of BATCH) SFIT[A][id] = fitS(id, A); }
function place(id, law, A = 12) {
  const s = SFIT[A][id], ox = (24 - s) / 2, oy = r3((24 - s) / 2), prims = DRAW[id](s);
  const raw = E.build(E.xform(prims, 1, 0, 0, ox, oy), { law });
  const m = measure(raw.d), tx = r4(12 - (m.box.cx + m.cx) / 2), ty = r3(12 - (m.box.cy + m.cy) / 2);
  const info = [];
  const b24 = E.build(E.xform(prims, 1, 0, 0, ox + tx, oy + ty), { law, centre: [12, 12], info });
  const c12 = E.build(E.xform(DRAW[id](SFIT[12][id]), 1, 0, 0, (12 - SFIT[12][id]) / 2 + tx, r3((12 - SFIT[12][id]) / 2) + ty), { law });
  return { b24, c12, raw, tx, ty, s, m: measure(b24.d), mraw: m, caps: info.filter(x => x.cap).length, curves: E.countCurves(b24.d), d: b24.d };
}
const GD = {}; // GD[law][A][id]
for (const law of LAWS) { GD[law] = {}; for (const [s] of AIRS) { GD[law][s] = {}; for (const [id] of BATCH) GD[law][s][id] = place(id, LAWS7[law], s); } }
// batch 1 as the owner saw it (g6, by joint), for before/after
const OLD = {}; for (const [id] of BATCH) OLD[id] = E.build(E.xform(P6.DRAW[id](12), 1, 0, 0, 6, 6), { law: LAWS6.joint });
const OLDC = {}; for (const [id] of BATCH) OLDC[id] = E.build(P6.DRAW[id](12), { law: LAWS6.joint });
// v105 as the owner last saw it (g7h), for the g7i before/after: its drawings and its law
const V105 = {}; for (const [id] of BATCH) { const prims = P7H.DRAW[id](12), raw = E.build(E.xform(prims, 1, 0, 0, 6, 6), { law: LAWS7.joint }); const m = measure(raw.d); V105[id] = E.build(E.xform(prims, 1, 0, 0, 6 + r4(12 - (m.box.cx + m.cx) / 2), 6 + r3(12 - (m.box.cy + m.cy) / 2)), { law: LAWS7.joint }); }
V105.star = E.build(P7H.star(20), { law: scaled(LAWS7.joint, 24 / 20) }); V105.plus = E.build(P7H.plus(26.4), { law: scaled(LAWS7.joint, 24 / 26.4) });
// the two UI marks, fitted by class: the Star's tips on the coin (ROUND) plus the apex; the +'s arms across it (OPEN)
const UIP = { plus: [plus, 26.4], star: [star, 20] };
// g7j: the Star is an OUTLINE mark (an outline means "not yet tapped", so its hole must read as a hole).
// Its class rule: the hull through its tips has the coin's area, AND its hole is at least two lines (3px)
// across at the centre; the larger of the two wins. At 1.5px the hole decides: tips 7.6px from the centre
// (g7i had 6.9, by the hull alone, and the hole nearly closed at 1x). All in px at its 20px slot.
const starRc = (lw = W) => {
  const hullTip = Math.sqrt(Math.PI * 36 / (2.5 * Math.sin(2 * Math.PI / 5)));        // the hull = the coin
  const mitreTip = (lw / 2) / Math.sin(Math.PI / 10), mitreValley = (lw / 2) / Math.sin(3 * Math.PI / 10);
  // g7s (owner: "the star also seems way heavier than the others"): the hole is 2 2/3 lines (4px) across at
  // the centre (was 2 lines, 3px), so the star reads as an outline, its walls as even as the +'s
  const HOLE = 4 / 3, holeRc = (HOLE * W + mitreValley) / P7.STAR.ri;
  return Math.max(hullTip - mitreTip, holeRc);
};
// g7p (owner: "the + and star do feel slightly lighter than the others"; on the Weight board: "as they are is too
// light but the heavier marks are way too heavy"): a LINE MARK (the open and outline classes: made only of lines,
// no mass to carry weight) draws its line at 7/6 of the line, 1.75px, even all along (monoweight still).
// g7r: the line marks' line, 1 2/3px (10/9 of the line), down from 1.75 (owner: "still too heavy optically");
// 1 2/3 rather than 1 5/8 because it sits on the grid's 1/3px lattice (5 device pixels on a 3x phone)
const LINEW = 5 / 3, LINEW_FRAC = '10/9';
const frT = v => { const w = Math.floor(v + 1e-6), r = Math.round((v - w) * 3); return r === 0 ? `${w}` : r === 3 ? `${w + 1}` : `${w} ${r}/3`; };
const USC = {
  star: starRc(LINEW) * 24 / 20 / 9.6,
  plus: KEY.OPEN[0] / 14,
};
const UD = {}; for (const law of LAWS) { UD[law] = {}; for (const [k, [fn, px]] of Object.entries(UIP)) { const info = []; UD[law][k] = E.build(fn(px, USC[k], LINEW), { law: scaled(LAWS7[law], 24 / px), info }); UD[law][k].caps = info.filter(x => x.cap).length; } }
const UOLD = { plus: E.build(P6.plus(26.4), { law: c => LAWS6.joint(c) * 24 / 26.4 }), star: E.build(P6.star(20), { law: c => LAWS6.joint(c) * 24 / 20 }) };
// g7 as first sent: line joins ROUNDED (0.6); g7c: joins TRAPPED (turned down by the owner). Kept to show change 14 before and after
const ROUNDJ = c => (!c.convex && c.angle >= 75 && c.angle <= 105) ? fit(c, 0.6) : LAWS7.joint(c);
const TRAPJ = c => (!c.convex && c.angle >= 75 && c.angle <= 105) ? TRAP : LAWS7.joint(c);
const PLUS_TRAP = E.build(P7H.plus(26.4), { law: scaled(TRAPJ, 24 / 26.4) });
const PLUS_ROUND = E.build(P7H.plus(26.4), { law: scaled(ROUNDJ, 24 / 26.4) });
const RING = (() => { const o = 6, prims = P7H.DRAW.cafeRing(12), raw = E.build(E.xform(prims, 1, 0, 0, o, o), { law: LAWS7.joint }); const m = measure(raw.d); return E.build(E.xform(prims, 1, 0, 0, o + r4(12 - (m.box.cx + m.cx) / 2), o + r3(12 - (m.box.cy + m.cy) / 2)), { law: LAWS7.joint }); })();
const BAR_ROUND = (() => { const b = V105; const prims = P7H.DRAW.bar(12), raw = E.build(E.xform(prims, 1, 0, 0, 6, 6)); const m = measure(raw.d); return E.build(E.xform(prims, 1, 0, 0, 6 + r4(12 - (m.box.cx + m.cx) / 2), 6 + r3(12 - (m.box.cy + m.cy) / 2)), { law: ROUNDJ }); })();
const BAR_TRAP = (() => { const prims = P7H.DRAW.bar(12), raw = E.build(E.xform(prims, 1, 0, 0, 6, 6)); const m = measure(raw.d); return E.build(E.xform(prims, 1, 0, 0, 6 + r4(12 - (m.box.cx + m.cx) / 2), 6 + r3(12 - (m.box.cy + m.cy) / 2)), { law: TRAPJ }); })();
const LIVE = Math.PI * 64; // the Ø16 live circle
const ink = d => 100 * measure(d).area / LIVE;

// interiors, enlarged with widths (G3 / C4): crop boxes in badge coords around each counter
function crop(d, x, y, sz, px, label) { return `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;font-size:10px;font-weight:700;color:${COL.ink2};text-align:center;max-width:${px + 10}px"><svg width="${px}" height="${px}" viewBox="${f2(x)} ${f2(y)} ${sz} ${sz}" aria-hidden="true"><rect x="${f2(x)}" y="${f2(y)}" width="${sz}" height="${sz}" fill="${COL.raised}"/><path d="${d}" fill="${COL.navy}"/></svg>${label}</div>`; }
const _c = GD.joint[12].cafe, _m = GD.joint[12].museum, _n = GD.joint[12].nature;
const INTERIORS = [
  crop(_c.d, 6 + _c.tx + 6.75, 6 + _c.ty + 0.5, 6, 64, 'Cup handle: a loop, counter 2.25 x 2.67px'),
  crop(_m.d, 6 + _m.tx + 1.75, 6 + _m.ty + 4.5, 4, 64, 'Museum: slots 1.5px wide, closed at both ends'),
  crop(_n.d, 6 + _n.tx + 6.5, 6 + _n.ty + 2.5, 4, 64, 'Conifer: softened V notches, open to the outside'),
  `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;font-size:10px;font-weight:700;color:${COL.ink2};text-align:center"><svg width="64" height="64" viewBox="4 4 16 16" aria-hidden="true"><rect x="4" y="4" width="16" height="16" fill="${COL.raised}"/><path d="${UD.joint.star.d}" fill="${COL.navy}"/></svg>Star: counter about 6px across at 20px</div>`,
].join('');
// SVG files
for (const law of LAWS) for (const [s] of AIRS) {
  const dir = path.join(ROOT, 'svg', 'g7', `${law}-${s === 12 ? 'air2' : 'air1_5'}`); fs.mkdirSync(dir, { recursive: true });
  for (const [id] of BATCH) {
    fs.writeFileSync(path.join(dir, `${id}-24.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11.25" fill="none" stroke="currentColor" stroke-width="1.5"/><path fill="currentColor" d="${GD[law][s][id].d}"/></svg>\n`);
    if (s === 12) fs.writeFileSync(path.join(dir, `${id}-12.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><path fill="currentColor" d="${GD[law][s][id].c12.d}"/></svg>\n`);
  }
  if (s === 12) for (const [k, [, px]] of Object.entries(UIP)) fs.writeFileSync(path.join(dir, `${k}-${px}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 24 24"><path fill="currentColor" d="${UD[law][k].d}"/></svg>\n`);
}

// ---- reference icons (mature sets) --------------------------------------------------------------
const REFDIR = path.join(ROOT, 'reference');
function refSvg(rel) { const src = fs.readFileSync(path.join(REFDIR, rel), 'utf8'); return { vb: src.match(/viewBox="([^"]+)"/)[1], d: [...src.matchAll(/ d="([^"]+)"/g)].map(m => m[1]) }; }
const REFS = [
  ['Material Symbols (Rounded, fill)', ['material-symbols-rounded/local_cafe-fill.svg', 'material-symbols-rounded/local_bar-fill.svg', 'material-symbols-rounded/account_balance-fill.svg', 'material-symbols-rounded/park-fill.svg', 'material-symbols-rounded/add.svg', 'material-symbols-rounded/star.svg'], 'Apache 2.0'],
  ['Phosphor (fill)', ['phosphor/coffee-fill.svg', 'phosphor/martini-fill.svg', 'phosphor/bank-fill.svg', 'phosphor/tree-evergreen-fill.svg', 'phosphor/plus.svg', 'phosphor/star.svg'], 'MIT'],
].map(([nm, files, lic]) => [nm, files.map(refSvg), lic]);
const refBare = (r, px = 24) => `<svg width="${px}" height="${px}" viewBox="${r.vb}" aria-hidden="true">${r.d.map(d => `<path d="${d}" fill="${COL.navy}"/>`).join('')}</svg>`;
// the reference glyph in OUR badge at OUR box: its 20px live area scaled into our 12px box
function refInBadge(r, px = 24) {
  const [x, y, w] = r.vb.split(/\s+/).map(Number), k = 12 / (w * 20 / 24), live = w * 2 / 24;
  return `<svg width="${px}" height="${px}" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11.25" fill="${COL.paper}" stroke="${COL.navy}" stroke-width="1.5"/><g transform="translate(6 6) scale(${f2(k)}) translate(${f2(-x - live)} ${f2(-y - live)})">${r.d.map(d => `<path d="${d}" fill="${COL.navy}"/>`).join('')}</g></svg>`;
}

// ---- drawing helpers ----------------------------------------------------------------------------
let REL = { stamp: '../inventory-png/row-stamp.png', sticker: '../inventory-png/sticker-near.png' };
const badge = (d, px = 24, extra = '') => `<svg width="${px}" height="${px}" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11.25" fill="${COL.paper}" stroke="${COL.navy}" stroke-width="1.5"/><path d="${d}" fill="${COL.navy}"/>${extra}</svg>`;
const chip = d => `<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="${d}" fill="${COL.navy}"/></svg>`;
const ui = (law, k, px) => `<svg width="${f2(px || UIP[k][1])}" height="${f2(px || UIP[k][1])}" viewBox="0 0 24 24" aria-hidden="true"><path d="${UD[law][k].d}" fill="${COL.navy}"/></svg>`;
const uiOld = (k, px) => `<svg width="${f2(px || UIP[k][1])}" height="${f2(px || UIP[k][1])}" viewBox="0 0 24 24" aria-hidden="true"><path d="${UOLD[k].d}" fill="${COL.navy}"/></svg>`;
const selPin = d => `<svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="15.25" fill="${COL.navy}" stroke="${COL.navy}" stroke-width="1.5"/><path d="${d}" transform="translate(4 4)" fill="${COL.paper}"/></svg>`;
const SCALLOP_PATH = fs.readFileSync(path.join(__dirname, 'boards5.js'), 'utf8').match(/const SCALLOP = '([^']+)'/)[1];
const plusBadge = (inner, px = 60) => `<div style="position:relative;width:${px}px;height:${px}px;line-height:0;flex:none"><svg width="${px}" height="${px}" viewBox="0 0 60 60" style="position:absolute;left:0;top:0" aria-hidden="true"><polygon points="${SCALLOP_PATH}" fill="${COL.or}"/></svg><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${inner}</div></div>`;
// the centre cross and the optical centre (orange dot) of a placed glyph, in badge coords
const cross = (px) => `<line x1="0" y1="12" x2="24" y2="12" stroke="${COL.or}" stroke-width="${f2(24 / px)}"/><line x1="12" y1="0" x2="12" y2="24" stroke="${COL.or}" stroke-width="${f2(24 / px)}"/>`;
const ocDot = (d, px) => { const m = measure(d), x = (m.box.cx + m.cx) / 2, y = (m.box.cy + m.cy) / 2; return `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(3.2 * 24 / px)}" fill="${COL.or}" stroke="${COL.raised}" stroke-width="${f2(1.2 * 24 / px)}"/>`; };
function onGrid(d, px, s = 12, ring = true, extra = '', off = 6) {
  const k = px / 24, o = off, L = (a, b, c, e, col, sw, dash) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${e}" stroke="${col}" stroke-width="${f2(sw / k)}"${dash ? ` stroke-dasharray="${f2(dash[0] / k)} ${f2(dash[1] / k)}"` : ''}/>`;
  let g = `<rect width="24" height="24" fill="${COL.raised}"/>`;
  for (let i = 0; i <= 48; i++) { const v = i / 2, c = i % 2 ? '#EFE8DA' : i === 24 ? COL.g3 : COL.g1; g += L(v, 0, v, 24, c, 1) + L(0, v, 24, v, c, 1); }
  if (ring) {
    g += `<circle cx="12" cy="12" r="11.25" fill="none" stroke="${COL.navy}" stroke-width="1.5"/>`;
    g += `<rect x="${o}" y="${o}" width="${s}" height="${s}" fill="none" stroke="${COL.blue}" stroke-opacity=".7" stroke-width="${f2(1 / k)}"/>`;
    for (const [y, dash] of [[0], [4, [4, 3]], [6, [1.5, 2.5]], [12]]) g += L(0, o + y * s / 12, 24, o + y * s / 12, COL.blue, 1.2, dash);
  }
  g += `<path d="${d}" fill="${COL.navy}" fill-opacity=".88"/>`;
  return `<svg width="${px}" height="${px}" viewBox="0 0 24 24" aria-hidden="true">${g}${extra}</svg>`;
}
const cons = (prims, px, ox = 6, oy = 6) => E.parts(E.xform(prims, 1, 0, 0, ox, oy)).map(q => `<path d="${q.d}" fill="none" stroke="${COL.or}" stroke-width="${f2(1.4 * 24 / px)}"${q.cut ? ` stroke-dasharray="${f2(3 * 24 / px)} ${f2(2 * 24 / px)}"` : ''}/>`).join('');

const CSS = W_ => `
*{box-sizing:border-box}
.cards{width:${W_}px;font-family:Archivo,Arial,sans-serif;color:${COL.ink};background:#E4DCCB}
.card{background:${COL.raised};padding:14px 16px 18px;margin:0 0 24px}
.no{font-size:10px;letter-spacing:.12em;color:${COL.ink2};font-weight:700;text-transform:uppercase}
h2{font-size:22px;margin:2px 0 4px;letter-spacing:.04em;text-transform:uppercase;color:${COL.navy};line-height:1.1}
h3{font-size:17px;margin:0 0 6px;color:${COL.navy}}
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
.tag{display:inline-block;font-size:9px;letter-spacing:.1em;font-weight:700;text-transform:uppercase;padding:1px 5px;margin-right:4px;border:1px solid ${COL.navy};color:${COL.navy}}
.tag.new{background:${COL.navy};color:${COL.raised}}
.set{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:6px 0}
.set.big{gap:8px}
.srow{display:grid;grid-template-columns:${W_ > 500 ? '120px' : '70px'} 1fr;align-items:center;border-top:1px solid ${COL.hair};padding:4px 0}
.srow .k{font-size:10.5px;font-weight:700;color:${COL.navy};line-height:1.2}
.srow>div:last-child{min-width:0;overflow:hidden}
.blur{filter:blur(1.6px)}
.g3{display:grid;grid-template-columns:${W_ > 500 ? '120px' : '64px'} repeat(3,minmax(0,1fr));gap:0 6px;align-items:center}
.g3 .h{font-size:13px;font-weight:700;color:${COL.navy};text-align:center;padding-bottom:4px;border-bottom:2px solid ${COL.navy}}
.g3 .n{font-size:11px;font-weight:700;color:${COL.navy};line-height:1.2;padding:8px 0;border-top:1px solid ${COL.hair};align-self:stretch;display:flex;align-items:center}
.g3 .c{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:8px 0;border-top:1px solid ${COL.hair};align-self:stretch}
.rs{display:flex;gap:8px;align-items:center}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:10px;align-items:start}
.pair>div{display:flex;flex-direction:column;align-items:center;gap:6px;font-size:10px;font-weight:700;color:${COL.ink2};letter-spacing:.06em;text-transform:uppercase;text-align:center}
.icon{border-top:2px solid ${COL.navy};padding:10px 0 12px}
.pr{font-size:12px;line-height:1.4;margin:6px 0;padding:0;list-style:none}
.pr li{padding:3px 0}
.pr b{color:${COL.navy}}
table.w{width:100%;border-collapse:collapse;font-size:11.5px}
table.w th,table.w td{text-align:left;padding:4px;border-top:1px solid ${COL.hair}}
table.w th{font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:${COL.ink2}}
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

// ---- sheet 0 ------------------------------------------------------------------------------------
function sheetIntro(n) {
  const P = [
    ['Optical centring', 'each glyph is placed by its mass, halfway between its box centre and its ink centroid, not by the box or BASE.'],
    ['Overshoot', 'pointed and round tops rise past a flat top (the tree\'s tip by 1/2px) so they look the same height.'],
    ['Equal optical weight', 'checked by squinting (a blurred row) and by ink share; wide glyphs are drawn shorter.'],
    ['Proportion', 'parts sized to each other: a coupe\'s foot about 70% of its bowl, a low classical pediment, a cup about as wide as deep, so it holds its own beside the others.'],
    ['Counters that survive small sizes', 'no passage narrower than the line; every hole at least 1.5px (the cup\'s handle is a D-shaped ear, its counter 2.25 x 2.67px).'],
    ['Joins and corners by angle, and by size', 'a round never exceeds 0.2 of the shortest edge at its corner, so slots and line ends take only a slight round (no pills).'],
    ['Every meeting point slightly round', 'where a line meets or crosses another part, the join takes the smallest round in the set (0.15px): enough to settle the corner, too small to thicken it, and never a notch (no ink traps, your call). Inside corners stay tighter than outside ones: the + crossing, the coupe\'s stem, the trunk, the slots.'],
    ['Monoweight (g7p, your pick)', 'one line everywhere, 1.5px, horizontals and uprights alike; every counter is the outline moved in by one line (g7r), so each wall is exactly the line. Line marks (the + and the Star) carry 1 2/3px, since they have no mass to carry weight.'],
    ['Pixel fitting', 'horizontal edges sit on the 1/3px lattice, whole device pixels on a 3x phone.'],
    ['Size by class (g7i, ours)', 'every glyph is fitted by the grid to a cut of one 12px coin with the coin\'s area (wide, square, tall, round, outline, open), so none reads bigger; no per-icon sizes.'],
    ['Root shapes (g7i)', 'like parts share one shape in every icon: slab, post, gable, vessel, loop.'],
  ];
  return `<section class="card" id="c${n}"><div class="no">Grid · round 7 · batch 1 redrawn · sheet ${n}</div><h2>Batch 1, redrawn to the craft bar</h2>
<div class="q long"><b>You said (on batch 1)</b>"${Q_CRAFT}"</div>
<div class="q"><b>And</b>"${Q_PRACTICE}"</div>
<p class="att">The same six (café, bar, museum, nature, the + and the Star), redrawn at 1.5px. Every change below comes from an established icon-design practice, named where it's used:</p>
<ul class="facts">${P.map(([k, v]) => `<li><b>${k}:</b> ${v}</li>`).join('')}</ul>
<p class="sm"><b>Sheet 1 is the set</b>, judged together at real size, (two other sets appear for comparison, not a craft benchmark). Sheet 2 is each drawing, before and after. Sheet 6 is the grid, changed by this redraw.</p>
<p class="sm mute">The main board (Batch 1: the set) is drawn with the proposed corners, by joint, and 2px of air (the team's call: the difference doesn't show at true size). Visited and the home-screen icon are unchanged.</p>
<div class="q"><b>The question</b>${ASK}</div>
</section>`;
}

// ---- sheet 1: the set ---------------------------------------------------------------------------
function sheetSet(W_, n) {
  const big = W_ > 500 ? 100 : 62;
  const oldRow = (px) => BATCH.map(([id]) => badge(OLD[id].d, px)).join('');
  const newRow = (px, mark) => BATCH.map(([id]) => { const d = GD.joint[12][id].d; return badge(d, px, mark ? cross(px) + ocDot(d, px) : ''); }).join('');
  const uis = (old) => `${old ? uiOld('plus') : ui('joint', 'plus')}${old ? uiOld('star') : ui('joint', 'star')}`;
  const wt = BATCH.map(([id, nm]) => `<tr><td>${nm}</td><td>${ink(OLD[id].d).toFixed(0)}%</td><td><b>${ink(GD.joint[12][id].d).toFixed(0)}%</b></td><td>${GD.joint[12][id].ty ? (GD.joint[12][id].ty > 0 ? 'down ' : 'up ') + Math.abs(GD.joint[12][id].ty).toFixed(2) + 'px' : 'none'}</td></tr>`).join('');
  const refRows = REFS.map(([nm, rs, lic]) => `<div class="srow"><div class="k">${nm}<br><span class="mute" style="font-weight:400">24px, as drawn (${lic})</span></div><div class="set">${rs.map(r => refBare(r)).join('')}</div></div>
<div class="srow"><div class="k">${nm}<br><span class="mute" style="font-weight:400">in our badge, at our 12px box</span></div><div class="set">${rs.slice(0, 4).map(r => refInBadge(r)).join('')}</div></div>`).join('');
  return `<section class="card" id="c${n}"><div class="no">Grid · round 7 · batch 1 redrawn · sheet ${n}</div><h2>The set, at real size</h2>
<p class="att">You said: "some feel like they're floating above center, some feel slightly lower on center. none have the same optical weight exactly yet when viewed as a set." Here they are as a set, before and after, at the sizes the app uses.</p>
<div class="lab">Badges (24px), the + and the Star</div>
<div class="srow"><div class="k">Batch 1</div><div class="set">${oldRow(24)}${uis(true)}</div></div>
<div class="srow"><div class="k">Redrawn</div><div class="set">${newRow(24)}${uis(false)}</div></div>
<div class="lab">Selected pins (32px) and chips (12px)</div>
<div class="srow"><div class="k">Batch 1</div><div class="set">${BATCH.map(([id]) => selPin(OLD[id].d)).join('')}${BATCH.map(([id]) => chip(OLDC[id].d)).join('')}</div></div>
<div class="srow"><div class="k">Redrawn</div><div class="set">${BATCH.map(([id]) => selPin(GD.joint[12][id].d)).join('')}${BATCH.map(([id]) => chip(GD.joint[12][id].c12.d)).join('')}</div></div>
<div class="lab">Centring, ${(big / 24).toFixed(1)}x: the badge's centre lines, and each drawing's optical centre (dot)</div>
<div class="srow"><div class="k">Batch 1</div><div class="set big">${BATCH.map(([id]) => badge(OLD[id].d, big, cross(big) + ocDot(OLD[id].d, big))).join('')}</div></div>
<div class="srow"><div class="k">Redrawn</div><div class="set big">${newRow(big, true)}</div></div>
<p class="sm">In batch 1 the dots sit off the centre: the coupe's 0.8px high (it floats) and the cup's 0.2px high; the museum's and the conifer's 0.4px low. Redrawn, every dot is within 1/6px of the centre (placement moves in 1/3px steps).</p>
<div class="lab">Weight: squint at them (blurred), then the ink share</div>
<div class="srow"><div class="k">Batch 1</div><div class="set big blur">${oldRow(big)}</div></div>
<div class="srow"><div class="k">Redrawn</div><div class="set big blur">${newRow(big)}</div></div>
<table class="w"><tr><th>Icon</th><th>Ink, batch 1</th><th>Ink, redrawn</th><th>Placement</th></tr>${wt}</table>
<p class="sm mute">Ink: the share of the Ø16 live circle that is ink. It is a guide, not the judge: a compact mass (the cup) looks darker than the same ink spread out (the museum), so the blurred row decides. <b>Blurred darkness</b> (the darkest fifth of the live circle after a 1.5px blur, measured; <code>src/blur-measure.js</code>): cup 75, conifer 72, museum 67, coupe 56 (its clear band opens the bowl; g7k's higher drink and even walls brought it up from 50), the Star 54 and the + 45 (line marks). <b>Plainly:</b> the conifer and the cup read darkest, about equal; the museum reads lightest, now only slightly.</p>
<div class="lab">Interiors, enlarged 8x, with their widths</div>
<div class="set big">${INTERIORS}</div>
<p class="sm mute">Every counter and slot is at least the line (1.5px), so it stays open at 12px and 24px. The one gap under it is the 1px cut between the cup and its saucer, open at both ends (a gap, not a passage).</p>
<div class="lab">Ours, then Material, then Phosphor (for comparison, not a craft benchmark): 24px and 12px, at 1x</div>
<div class="srow"><div class="k">Ours, 24</div><div class="set">${newRow(24)}${uis(false)}</div></div>
${REFS.map(([nm, rs]) => `<div class="srow"><div class="k">${nm.split(' (')[0]}, 24</div><div class="set">${rs.map(r => refBare(r)).join('')}</div></div>`).join('')}
<div class="srow"><div class="k">Ours, 12</div><div class="set">${BATCH.map(([id]) => chip(GD.joint[12][id].c12.d)).join('')}</div></div>
${REFS.map(([nm, rs]) => `<div class="srow"><div class="k">${nm.split(' (')[0]}, 12</div><div class="set">${rs.slice(0, 4).map(r => refBare(r, 12)).join('')}</div></div>`).join('')}
<div class="lab">The same subjects in our badge, at our 12px box, then blurred</div>
<div class="srow"><div class="k">Ours</div><div class="set">${newRow(24)}</div></div>
${REFS.map(([nm, rs]) => `<div class="srow"><div class="k">${nm.split(' (')[0]}</div><div class="set">${rs.slice(0, 4).map(r => refInBadge(r)).join('')}</div></div>`).join('')}
<div class="srow"><div class="k">Blurred: ours</div><div class="set big blur">${newRow(48)}</div></div>
${REFS.map(([nm, rs]) => `<div class="srow"><div class="k">Blurred: ${nm.split(' (')[0]}</div><div class="set big blur">${rs.slice(0, 4).map(r => refInBadge(r, 48)).join('')}</div></div>`).join('')}
<div class="srow"><div class="k">Ours, faint centre line</div><div class="set">${BATCH.map(([id]) => badge(GD.joint[12][id].d, 24, `<line x1="0" y1="12" x2="24" y2="12" stroke="${COL.or}" stroke-opacity=".55" stroke-width="0.5"/>`)).join('')}</div></div>
<p class="sm mute">The references use their own grids (Material: 2px lines, 20px live area; Phosphor: 1.5px). Shown to judge craft (joins, counters, proportion), not to copy. Plainly: in our set the conifer and the cup read darkest and the museum lightest, within a small spread. In our badge at our 12px box, both references look lighter than ours overall; that is our 1.5px line at a 12px drawing, which you chose for weight. SF Symbols isn't shown: Apple's licence doesn't allow its symbols outside Apple-platform work, and they can't be downloaded here, so Phosphor stands in.</p>
<div class="q"><b>The question</b>${ASK}</div>
</section>`;
}

const HANDLE = `<div class="lab">The handle: the ear (now) beside the g7 ring and the two comparison cups (for comparison, not a craft benchmark), at 24 and 3x</div>
<div class="set">${badge(GD.joint[12].cafe.d)}${badge(RING.d)}${refInBadge(REFS[0][1][0])}${refInBadge(REFS[1][1][0])}</div>
<div class="set big">${badge(GD.joint[12].cafe.d, 72)}${badge(RING.d, 72)}${refInBadge(REFS[0][1][0], 72)}${refInBadge(REFS[1][1][0], 72)}</div>
<p class="sm"><b>Kept: the ear.</b> At 24 it reads as a handle joined to the cup, as both references do; the ring read as a separate bubble.</p>`;
// ---- sheet 2: each drawing ----------------------------------------------------------------------
const PRIN = {
  cafe: [['Counters', 'the handle is a loop joined to the cup over its height; its counter is 2.25 x 2.67px (taller than wide, so it reads as a loop, not a "P"), closed by the cup: no passage (your example).'], ['Joins (g7p)', 'the bowl keeps both its walls and both lower corners (it used to melt in an S-curve into the handle\'s foot, which broke its bottom-right corner); the handle is its own loop laid over the right wall, and where they meet the join takes the slightest round (0.15px), inside tighter than outside.'], ['Proportion', 'cup 6.75 wide by 7 deep; the saucer runs the full width.'], ['Size (g7i)', 'Wide class, 12 x 9 1/3, fitted by the grid.'], ['Root shapes (g7i)', 'a vessel with a loop for its ear, on a slab saucer (it was a tapered blade).'], ['Monoweight and pixel fitting', 'the saucer is a slab, 1.5px, its edges on whole device pixels.'], ['Optical centring', 'moved down 1/3px.']],
  bar: [['Proportion (g7p)', 'the wide, broad-bottomed bowl of the earlier batches (your note), its sides falling steeply from the rim into a flatter bottom, on one upright stem; the foot about 70% of the bowl.'], ['Size (g7i)', 'Square class, 10 2/3, fitted by the grid (no per-icon height).'], ['Root shapes (g7i)', 'a vessel on a post stem and a slab foot (it was a dome).'], ['Liquid (g7i)', 'under the rim a clear band, 1.5px (the counter minimum; g7k and g7p, more drink), closed by the walls at both ends; the drink fills the bowl below it, so it reads as a glass, not a chalice (your note), and its top is no longer one dark mass.'], ['Joins', 'the stem meets bowl and foot with the slightest round (0.15px), so the joins settle without thickening; the bowl\'s rim corners take the outside round.'], ['Optical centring', 'its mass is at the top, so it moves down 2/3px (batch 1 floated).']],
  museum: [['Counters', 'the spaces between the columns are closed upright slots, 1.5px wide, their corners slightly round: no pills (your example), no gap under the line.'], ['Proportion', 'between g7 and g7b: a low pediment (about 22°) set on a 1.5px beam; the four columns hang from the beam and stand on the plinth, so they read as a building, as both references do. Three columns were tried in g7 and read as a box with two doors.'], ['Size (g7i)', 'Wide class, 12 x 9 1/3, its apex passing by 1/2px, fitted by the grid.'], ['Root shapes (g7i)', 'a gable on a slab beam, four posts, a slab plinth: unchanged, the shapes the rest now share.'], ['Pixel fitting', 'the plinth is a 1.5px slab, its edges on whole device pixels.'], ['Optical centring', 'moved up 1px.']],
  nature: [['Overshoot', 'the pointed tip rises 1/2px above TOP.'], ['Joins', 'the trunk meets the lowest tier with the slightest round.'], ['Size (g7i)', 'Tall class, 9 1/3 x 12, its tip passing by 1/2px.'], ['Root shapes (g7i)', 'three gables on a post trunk; each tier\'s base is now flat (it rose 0.4px to the trunk), the same gable as the pediment.'], ['Proportion (g7p, by rule)', 'the tip tier is the point and shows 1.5 times the height of each tier under it; the widths step evenly from narrow to the tall class, so each tier is steeper than the one below, as a fir is; each notch shows a 1.5-line shelf, so a tier ends in a proper point, not a spur; the points take the outside round (0.35px) and the notches a tighter one (0.15px), so the inside reads tighter than the outside (your note on the tree); no hooks, never needle-sharp.'], ['Optical centring', 'moved up 1/3px.']],
};
function sheetDrawings(W_, n) {
  const big = W_ > 500 ? 220 : 150;
  const blocks = BATCH.map(([id, nm]) => {
    const g = GD.joint[12][id];
    return `<div class="icon"><h3>${nm}</h3>
<div class="pair"><div>${onGrid(OLD[id].d, big)}Batch 1</div><div>${onGrid(g.d, big, 12, true, cons(DRAW[id](12), big, 6 + g.tx, 6 + g.ty), 6 + g.ty)}Redrawn, its parts in orange</div></div>
<div class="pair" style="margin-top:8px"><div><span class="rs">${badge(OLD[id].d)}${chip(OLDC[id].d)}${selPin(OLD[id].d)}</span></div><div><span class="rs">${badge(g.d)}${chip(g.c12.d)}${selPin(g.d)}${badge(g.d, 72)}</span></div></div>
${id === 'cafe' ? HANDLE : ''}<ul class="pr">${PRIN[id].map(([k, v]) => `<li><b>${k}:</b> ${v}</li>`).join('')}</ul>
<p class="sm mute">${g.curves} curves in the outline, by joint.</p></div>`;
  }).join('');
  const uis = [['plus', 'The +', 'Every arm 1 2/3px, the line marks\' weight (g7r). The crossing takes the slightest round (0.15px), no notch.'], ['star', 'The Star (not starred)', 'A 1 2/3px outline (g7r, the line marks\' weight). Its counter (the inner star) is 6px across, so it survives at 20px; the tips take a slight round and the inner corners a tighter one.']]
    .map(([k, nm, txt]) => `<div class="icon"><h3>${nm}</h3><div class="pair"><div>${uiOld(k, big)}Batch 1</div><div>${onGrid(UD.joint[k].d, big, 12, false)}Redrawn</div></div><div class="pair" style="margin-top:8px"><div>${uiOld(k)}</div><div>${ui('joint', k)}</div></div><p class="sm">${txt}</p></div>`).join('');
  return `<section class="card" id="c${n}"><div class="no">Grid · round 7 · batch 1 redrawn · sheet ${n}</div><h2>Each drawing, before and after</h2>
<p class="att">Batch 1 beside the redraw, on the grid at ${(big / 24).toFixed(1)}x (the redraw shown where it sits after optical centring), then real size: badge 24, chip 12, selected pin 32, and 3x. Under each, the practice behind each change.</p>
${blocks}${uis}
<div class="q"><b>The question</b>${ASK}</div>
</section>`;
}

// ---- sheet 3: corners on the redrawn set --------------------------------------------------------
function sheetCorners(W_, n) {
  const big = W_ > 500 ? 150 : 84, zoom = W_ > 500 ? 190 : 104;
  const head = `<div></div>${LAWS.map(l => `<div class="h">${LAW_NAMES[l]}</div>`).join('')}`;
  const rows = BATCH.map(([id, nm]) => `<div class="n">${nm}</div>${LAWS.map(l => `<div class="c">${badge(GD[l][12][id].d, big)}<span class="rs">${badge(GD[l][12][id].d)}${chip(GD[l][12][id].c12.d)}${selPin(GD[l][12][id].d)}</span></div>`).join('')}`).join('');
  const urows = ['plus', 'star'].map(k => `<div class="n">${k === 'plus' ? 'The +' : 'Star'}</div>${LAWS.map(l => `<div class="c">${ui(l, k, big * 0.8)}${ui(l, k)}</div>`).join('')}`).join('');
  const zv = (id, x, y, s) => LAWS.map(l => `<div class="c"><svg width="${zoom}" height="${zoom}" viewBox="${x} ${y} ${s} ${s}" aria-hidden="true"><rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${COL.raised}"/><path d="${GD[l][12][id].d}" fill="${COL.navy}"/></svg></div>`).join('');
  const m = GD.joint[12].museum, c = GD.joint[12].cafe;
  return `<section class="card" id="c${n}"><div class="no">Grid · round 7 · batch 1 redrawn · sheet ${n}</div><h2>The corners, on the redrawn set</h2>
<p class="att">You said "the rounding at various intersections feels wrong (some places too broad roujnding, some too tight)". All three laws now share one practice: <b>a round never exceeds 0.2 of the shortest edge at its corner</b>, so a 1.5px slot or line end gets at most 0.3px, and a big join can take the law's full radius. The laws still differ in where the softness goes. ${(big / 24).toFixed(1)}x, then real size (24, 12, 32).</p>
<div class="g3">${head}${rows}${urows}
<div class="n">Close-up: museum, beam and columns</div>${zv('museum', 6, 8 + m.ty, 6.5)}
<div class="n">Close-up: the cup's handle</div>${zv('cafe', 13 + c.tx, 7 + c.ty, 6)}</div>
<p class="sm"><b>Plainly:</b> at real size the three are close for every icon now; the slots and line ends no longer round into pills under any law. What each law still costs:</p>
<ul class="facts">
<li><b>All three:</b> line joins take the slightest round (0.15px, no notch), the same under every law, so the laws differ only at outside corners and sharp notches.</li>
<li><b>By joint (proposed, and on the main board):</b> every meeting point at least slightly round; tight inside corners (joins, slots, notches) 0.15px, wide inside corners 0.3, line ends 0.3, points 0.35, mass corners 0.45, wide corners 0.7. Inside stays tighter than outside.</li>
<li><b>Even wear:</b> the silhouette is softened evenly, so the ends of the + and the plinth read a little blunter at real size.</li>
<li><b>Pressed:</b> sharp outside corners and filled sharp notches (the conifer); with joins slightly round, it is closer to by joint than before.</li>
</ul>
<p class="sm mute">Proposed: by joint, which is what the main board shows. At true size the three laws look nearly the same; the director scores the proposal.</p>
</section>`;
}

// ---- sheet 4: in the app ------------------------------------------------------------------------
function sheetApp(n) {
  const pins = [['cafe', 6, 8], ['bar', 52, 48], ['nature', 196, 8], ['museum', 240, 46]];
  const tri = fn => LAWS.map(l => `<div class="tri"><div class="wl">${LAW_NAMES[l]}</div><div>${fn(l)}</div></div>`).join('');
  return `<section class="card" id="c${n}"><div class="no">Grid · round 7 · batch 1 redrawn · sheet ${n}</div><h2>In the app, real size</h2>
<p class="att">The redrawn set with each corner law, one under another. The visited stamp and sticker are today's.</p>
<div class="lab">List rows</div>${tri(l => `<div class="row">${badge(GD[l][12].cafe.d)}<div class="t">Kaffeverket<small>CAFÉ · STOCKHOLM</small></div>${ui(l, 'star')}</div><div class="row">${badge(GD[l][12].museum.d)}<div class="t">Vasa Museum<small>MUSEUM · STOCKHOLM</small></div><img src="${REL.stamp}" width="82" height="44" alt="Visited stamp, unchanged" style="display:block"></div>`)}
<div class="lab">Map: pins and a selected pin</div>${tri(l => `<div class="map">${pins.map(([id, x, y]) => `<div class="pn" style="left:${x}px;top:${y}px">${badge(GD[l][12][id].d)}</div>`).join('')}<div class="pn" style="left:136px;top:30px">${selPin(GD[l][12].bar.d)}</div><div class="pn" style="left:92px;top:2px"><img src="${REL.sticker}" width="40" height="40" alt="Visited sticker, unchanged" style="display:block"></div></div>`)}
<div class="lab">Filter chips (12px)</div>${tri(l => `<div class="chips">${BATCH.map(([id, nm]) => `<span class="chipx">${chip(GD[l][12][id].c12.d)}${nm.toUpperCase()}</span>`).join('')}</div>`)}
<div class="lab">The + button</div>${tri(l => `<div style="padding:6px 0">${plusBadge(ui(l, 'plus'))}</div>`)}
<p class="sm mute">Proposed: by joint, which is what the main board shows. At true size the three laws look nearly the same; the director scores the proposal.</p>
</section>`;
}

// ---- sheet 5: the air ---------------------------------------------------------------------------
function sheetAir(W_, n) {
  const big = W_ > 500 ? 150 : 96;
  const head = `<div></div>${AIRS.map(([, nm]) => `<div class="h">${nm}</div>`).join('')}`;
  const rows = BATCH.map(([id, nm]) => `<div class="n">${nm}</div>${AIRS.map(([s]) => `<div class="c">${badge(GD.joint[s][id].d, big)}<span class="rs">${badge(GD.joint[s][id].d)}${selPin(GD.joint[s][id].d)}</span></div>`).join('')}`).join('');
  return `<section class="card" id="c${n}"><div class="no">Grid · round 7 · batch 1 redrawn · sheet ${n}</div><h2>The air in the ring</h2>
<p class="att">2px: the drawing box is 12px. 1.5px: the box grows to 12.75px; every line keeps its width. Both optically centred. ${(big / 24).toFixed(1)}x, then real size and the selected pin.</p>
<div class="g3" style="grid-template-columns:${W_ > 500 ? '120px' : '64px'} 1fr 1fr">${head}${rows}</div>
<div class="lab">In a row, real size</div>
${AIRS.map(([s, nm]) => `<div class="tri"><div class="wl">${nm}</div><div><div class="row">${badge(GD.joint[s].cafe.d)}<div class="t">Kaffeverket<small>CAFÉ · STOCKHOLM</small></div>${badge(GD.joint[s].museum.d)}${badge(GD.joint[s].nature.d)}</div></div></div>`).join('')}
<p class="sm"><b>Plainly:</b> it's half a pixel a side, slight at real size. <b>What 1.5px costs:</b> the box sits at 5.625px, off the 1/3px lattice, so the horizontals lose their whole-pixel edges on a 3x phone (sheet 6, change 12).</p>
<p class="sm mute">Settled by the team: 2px. At true size the difference is half a pixel a side and doesn't show, and 2px keeps the horizontals on whole device pixels.</p>
</section>`;
}

// ---- sheet 6: the grid, changed by the redraw ---------------------------------------------------
function sheetGrid(W_, n) {
  const px = W_ > 500 ? 150 : 96;
  const ba = (before, after, lb, la) => `<div class="pair" style="margin:6px 0 4px"><div>${before}${lb}</div><div>${after}${la}</div></div>`;
  // 9: rounding fits the parts (the museum slot)
  const zs = W_ > 500 ? 200 : 140, slot = (d, x, y) => `<svg width="${zs}" height="${zs}" viewBox="${x} ${y} 3 3" aria-hidden="true"><rect x="${x}" y="${y}" width="3" height="3" fill="${COL.raised}"/><path d="${d}" fill="${COL.navy}"/></svg>`;
  const m = GD.joint[12].museum, c9 = ba(slot(OLD.museum.d, 7.5, 14.5), slot(m.d, 7.5, 6 + m.ty + 32 / 3 - 2), 'Batch 1: the slot ends in a semicircle (a pill)', 'Now: a square slot end, its corners slightly round (change 14)');
  // 10: optical centring, box-centred vs placed, the whole set
  const boxRow = BATCH.map(([id]) => { const b = GD.joint[12][id]; const d = E.build(E.xform(DRAW[id](12), 1, 0, 0, 6 + r4(12 - b.mraw.box.cx), 6 + r3(12 - b.mraw.box.cy)), { law: LAWS7.joint }).d; return badge(d, 62, cross(62) + ocDot(d, 62)); }).join('');
  const optRow = BATCH.map(([id]) => badge(GD.joint[12][id].d, 62, cross(62) + ocDot(GD.joint[12][id].d, 62))).join('');
  const c10 = `<div class="srow"><div class="k">Box centred</div><div class="set big">${boxRow}</div></div><div class="srow"><div class="k">Optically centred</div><div class="set big">${optRow}</div></div>`;
  // 12: pixel fitting, a 3x device-pixel grid over the museum's beam and plinth
  const dp = (d, x, y, s) => { const sz = W_ > 500 ? 220 : 150; let g = `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${COL.raised}"/><path d="${d}" fill="${COL.navy}" fill-opacity=".85"/>`; for (let i = Math.ceil(x * 3); i <= (x + s) * 3; i++) g += `<line x1="${i / 3}" y1="${y}" x2="${i / 3}" y2="${y + s}" stroke="${COL.or}" stroke-width="${f2(s / sz)}"/>`; for (let j = Math.ceil(y * 3); j <= (y + s) * 3; j++) g += `<line x1="${x}" y1="${j / 3}" x2="${x + s}" y2="${j / 3}" stroke="${COL.or}" stroke-width="${f2(s / sz)}"/>`; return `<svg width="${sz}" height="${sz}" viewBox="${x} ${y} ${s} ${s}" aria-hidden="true">${g}</svg>`; };
  const c12 = ba(dp(OLD.museum.d, 5.5, 16, 2.5), dp(m.d, 5.5, 6 + m.ty + 32 / 3 - 0.5, 2.5), 'Batch 1: a 1.5px plinth; its top edge falls between device pixels', 'Now: a 4/3px plinth; both edges on device pixels');
  const px3 = W_ > 500 ? 150 : 96, tri = (svgs, labels) => `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:6px 0 4px">${svgs.map((g, i) => `<div>${g}<div class="sm" style="font-weight:700">${labels[i]}</div></div>`).join('')}</div>`;
  const ch = (no, title, why, fig) => `<div class="icon"><h3>${no}: ${title}</h3><p class="sm">${why}</p>${fig}</div>`;
  return `<section class="card" id="c${n}"><div class="no">Grid · round 7 · batch 1 redrawn · sheet ${n}</div><h2>The grid, changed by the redraw</h2>
<p class="att">Your feedback says a grid of guides alone can't give optical centring or equal weight. These changes add the practices that do. Each one is shown before and after on the icons it fixes; all six were re-checked under each.</p>
${ch('Change 9', 'a round fits the parts it joins', 'Practice: join and corner treatment by angle and by size. A round is never more than 0.2 of the shortest edge at its corner. It replaces the pill ends that the collision rule (change 7) made on narrow slots; change 7 stays as a fallback and now fires nowhere in this batch.', c9)}
${ch('Change 10', 'placed by optical centre, not by the box', 'Practice: optical centring. The point put on the badge\'s centre is halfway between the drawing\'s box centre and its ink centroid. TOP, BASE and MIDDLE stay as drawing guides inside the box; they no longer set where the drawing sits in the badge. Dots: each drawing\'s optical centre.', c10)}
${ch('Change 11', 'equal optical weight, judged blurred', 'Practice: equal optical weight. Each batch is checked as a blurred row and by ink share (sheet 1). Wide drawings are drawn shorter (the museum is 10.3px tall) so they don\'t look bigger. The ink figure is a guide; the blurred row decides, and is now measured (src/blur-measure.js: the darkest fifth of the live circle after a 1.5px blur).', '')}
${ch('Change 12', 'horizontals 4/3px, on whole device pixels', 'Practices: contrast compensation (a horizontal reads heavier, so it is drawn about 10% thinner) and pixel fitting (4/3px is exactly 4 device pixels on a 3x phone). Horizontal edges sit on the 1/3px lattice and placement moves in 1/3px steps, so plinths, saucers and the + crossbar are crisp. Uprights stay 1.5px and centred, so their edges fall half a dot off: symmetry wins over snapping for uprights. Orange lines: device pixels on a 3x phone.', c12)}
${ch('Change 14', 'joins take the slightest round', 'Practice: a join adds as little ink as it can. Where a line meets or crosses another part at about a right angle, a round fills the corner and the join reads darker (g7, webbed). g7c thinned it with ink traps; you turned that down: "i do not want ink traps... no reason for that on digital imo". Then the joins went square. On v99 you asked for "all points of meeting" to be "at minimum a little bit rounded", and for tight inside corners to be "less rounded than exterior corners": so every join now takes the smallest round in the set, 0.15px, under all three laws (the + crossing, the coupe\'s stem at bowl and foot, the trunk, the ear on the cup, the columns on the beam and plinth). It adds under 0.01px² of ink per join, so nothing thickens, and there is no notch. The + and the coupe\'s stem at 3x:', tri([PLUS_ROUND.d, PLUS_TRAP.d, UD.joint.plus.d].map(d => `<svg width="${px3}" height="${px3}" viewBox="6 6 12 12" aria-hidden="true"><rect x="6" y="6" width="12" height="12" fill="${COL.raised}"/><path d="${d}" fill="${COL.navy}"/></svg>`), ['g7: rounded (webbed)', 'g7c: ink traps (turned down)', 'Now: 0.15px']) + `<div class="pair"><div><span class="rs">${plusBadge(`<svg width="26.4" height="26.4" viewBox="0 0 24 24"><path d="${PLUS_ROUND.d}" fill="${COL.navy}"/></svg>`)}</span></div><div><span class="rs">${plusBadge(ui('joint', 'plus'))}</span></div></div>` + tri([BAR_ROUND.d, BAR_TRAP.d, GD.joint[12].bar.d].map(d => `<svg width="${px3}" height="${px3}" viewBox="10 9 4 4" aria-hidden="true"><rect x="10" y="9" width="4" height="4" fill="${COL.raised}"/><path d="${d}" fill="${COL.navy}"/></svg>`), ['The coupe\'s stem, g7', 'g7c', 'Now']))}
${ch('Change 15 (g7i)', 'size by class: the token', 'Ours: a glyph is struck like a token, a 12px coin inside the badge\'s ring with 2px of air. Every glyph is fitted by the grid to a cut of the coin with the coin\'s area: Wide 12 x 9 1/3 (cup, museum), Square 10 2/3 (coupe), Tall 9 1/3 x 12 (tree), Outline for outline marks (the Star: hull at least the coin, hole at least 2 2/3 lines across; g7j, g7s) and Open for line-only marks (the +: arms across the coin, every line 1.5px). A lone apex passes by 1/2px. No icon has its own size number; a new icon picks its class. Drawn on the main board.', '')}
${ch('Change 16 (g7i)', 'root shapes: like parts, one shape', 'Parts that do the same job are cut from one root shape in every icon: slab (bases, spans), post (stems, columns, trunk, arms), gable (roofs, tiers), vessel (bowls), loop (handles, outlines). The bases were a blade, a dome and a slab (your example); all are slabs now. Batch 2 needs two more roots, tested on the main board: blade (the knife) and block (the bag, the city blocks). Like parts pulled out side by side on the main board.', '')}
${ch('Change 13', 'overshoot', 'Practice: overshoot. A pointed top rises past TOP (the tree by 1/2px) so it looks as tall as a flat top; round bottoms may pass BASE the same way. g7i: it is part of the size rule: a lone apex passes its class cut by 1/2px.', '')}
<div class="lab">Kept from batch 1</div>
<ul class="facts">
<li><b>Changes 1–6 and 8</b> (cut 1px, spaces = the line, no hairline cuts, the curve rule, angles, app icons drawn as shapes, "as many as fit" is a ceiling).</li>
<li><b>Change 7</b> (the collision rule) is now a fallback: fitted rounds (change 9) never collide in this batch.</li>
</ul>
<div class="lab">Open</div>
<ul class="facts">
<li><b>SHOULDER (4)</b> no longer places anything; with optical centring it is only a drawing guide. Batch 2 decides whether it earns its place.</li>
<li><b>The corner law and the air</b> are your picks.</li>

</ul>
<div class="q"><b>The question</b>${ASK}</div>
</section>`;
}


// ---- g7j: WEIGHT, the cost of each way to equal darkness (director, turn 52: "equal darkness in our own
// blur within about 9, place and UI icons alike", reached by a class rule). Each option is built by the
// same grid; its SVGs go to svg/g7/weight-<opt>/ so src/blur-measure.js measures it (SVGDIR=...).
// g7r (owner on the Weight board: "The middle weight option is close but still too heavy optically"): the line
// marks come down from 1.75; rows: 1.5 (as they were), the new rule, 1.75 (v130). TRYW: a trial row.
const WOPTS = [
  ['now', '1.5px: as they were', 'Every line 1.5px, the same as the badge ring.', { lw: W, band: true, wall: W }],
  ['line', `${frT(LINEW)}px: the line marks now`, `The star and the + draw their line at ${frT(LINEW)}px (${LINEW_FRAC} of the line, on the 1/3px lattice), even all along: they are made only of lines, with no mass to carry weight. The place icons stay 1.5px.`, { lw: LINEW, band: true, wall: W }],
  ['was', '1.75px: what you saw', 'The middle row on the board you saw (v130): "close but still too heavy optically".', { lw: W * 7 / 6, band: true, wall: W }],
];
if (process.env.TRYW) WOPTS.splice(2, 0, ['try', `${process.env.TRYW}px: trial`, 'trial', { lw: +process.env.TRYW, band: true, wall: W }]);
const WSET = {};
for (const [key, , , o] of WOPTS) {
  const lw = k => typeof o.lw === 'number' ? o.lw : o.lw[k];
  const barS = fitS('bar', 12, { bar: s => DRAW.bar(s, { style: 'mono', ...o }) });
  const prims = DRAW.bar(barS, { style: 'mono', ...o }), ox = (24 - barS) / 2, oy = r3((24 - barS) / 2);
  const m = measure(E.build(E.xform(prims, 1, 0, 0, ox, oy), { law: LAWS7.joint }).d);
  const bar = E.build(E.xform(prims, 1, 0, 0, ox + r4(12 - (m.box.cx + m.cx) / 2), oy + r3(12 - (m.box.cy + m.cy) / 2)), { law: LAWS7.joint }).d;
  // g7y fix (owner: "why is 1 2/3rds reading thinner? shouldnt it look thicker?" / "these look the same too"): the
  // star was sized per row by its own line (14.4, 15.2, 15.6px wide), so a heavier line came with a bigger star
  // and the weight barely changed; every row now draws the same star, sized at the line marks' rule, and only
  // the line changes
  const sStar = (() => { const sw = sc_ => { const b = measure(E.build(star(20, sc_, lw('star')), { law: scaled(LAWS7.joint, 24 / 20) }).d).box; return b.x1 - b.x0; };
    const target = (() => { const b = measure(E.build(star(20, starRc(LINEW) * 24 / 20 / 9.6, LINEW), { law: scaled(LAWS7.joint, 24 / 20) }).d).box; return b.x1 - b.x0; })();
    let lo = 0.3, hi = 1.2; for (let n = 0; n < 30; n++) { const m = (lo + hi) / 2; if (sw(m) > target) hi = m; else lo = m; } return lo * (o.k || 1); })();   // the same outside in every row: the line grows inward
  const ui = { star: E.build(star(20, sStar, lw('star')), { law: scaled(LAWS7.joint, 24 / 20) }).d, plus: E.build(plus(26.4, USC.plus * (o.k || 1), lw('plus')), { law: scaled(LAWS7.joint, 24 / 26.4) }).d };
  WSET[key] = { cafe: GD.joint[12].cafe.d, bar, museum: GD.joint[12].museum.d, nature: GD.joint[12].nature.d, ...ui };
  const dir = path.join(ROOT, 'svg', 'g7', `weight-${key}`); fs.mkdirSync(dir, { recursive: true });
  for (const id of ['cafe', 'bar', 'museum', 'nature']) fs.writeFileSync(path.join(dir, `${id}-24.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11.25" fill="none" stroke="currentColor" stroke-width="1.5"/><path fill="currentColor" d="${WSET[key][id]}"/></svg>\n`);
  for (const [k, px] of [['star', 20], ['plus', 26.4]]) fs.writeFileSync(path.join(dir, `${k}-${px}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 24 24"><path fill="currentColor" d="${WSET[key][k]}"/></svg>\n`);
}
// measured with src/blur-measure.js on each weight-<opt> folder (the darkest fifth of the live circle, 1.5px blur)
const WBLUR = JSON.parse(fs.existsSync(path.join(ROOT, 'svg', 'g7', 'weight-blur.json')) ? fs.readFileSync(path.join(ROOT, 'svg', 'g7', 'weight-blur.json'), 'utf8') : '{}');
// each row's + arm and star wall, measured on the drawn paths (px at their sizes)
const WMEAS = {};
for (const [key] of WOPTS) {
  const pp = new paperLib.CompoundPath(WSET[key].plus), ln = new paperLib.Path.Line(new paperLib.Point(0, 8), new paperLib.Point(24, 8));
  const xs = pp.getIntersections(ln).map(i => i.point.x).sort((a, b) => a - b); pp.remove(); ln.remove();
  const h = OCHECK(WSET[key].star, 1.6).holes[0], sb = measure(WSET[key].star).box;
  WMEAS[key] = `+ ${((xs[xs.length - 1] - xs[0]) * 26.4 / 24).toFixed(2)}px · star ${(h.min * 20 / 24).toFixed(2)}px, ${((sb.x1 - sb.x0) * 20 / 24).toFixed(1)}px wide`;
}
const W_Q = "The + and the star now sit between the last two. Do they feel as heavy as the place icons now?";
function sheetWeight(W_, n) {
  const ids = ['cafe', 'bar', 'museum', 'nature', 'star', 'plus'];
  const cell = (key, id, px) => id === 'star' || id === 'plus'
    ? `<svg width="${px}" height="${px}" viewBox="0 0 24 24" aria-hidden="true"><g transform="translate(${f2(12 - 12 * UIP[id][1] / 24)} ${f2(12 - 12 * UIP[id][1] / 24)}) scale(${f2(UIP[id][1] / 24)})"><path d="${WSET[key][id]}" fill="${COL.navy}"/></g></svg>`
    : badge(WSET[key][id], px);
  const ui = (key, id, px) => `<svg width="${px}" height="${px}" viewBox="0 0 24 24" aria-hidden="true"><path d="${WSET[key][id]}" fill="${COL.navy}"/></svg>`;
  // true size, where they live: list rows with the star, then the + in its Float badge with pins
  const live = key => {
    const rows = [['cafe', 'Kaffeverket', 'CAFÉ', true], ['bar', 'Tjoget', 'BAR', true], ['museum', 'Vasa Museum', 'MUSEUM', false], ['nature', 'Djurgården', 'NATURE', false]]
      .map(([id, nm, sub, st]) => `<div class="row">${badge(WSET[key][id])}<div class="t">${nm}<small>${sub} · STOCKHOLM</small></div>${st ? ui(key, 'star', 20) : ''}</div>`).join('');
    const map = `<div class="map" style="height:72px"><div class="pn" style="left:8px;top:6px">${plusBadge(ui(key, 'plus', 26.4), 60)}</div>${[['cafe', 84, 10], ['bar', 120, 40], ['museum', 160, 12], ['nature', 200, 38]].map(([id, x, y]) => `<div class="pn" style="left:${x}px;top:${y}px">${badge(WSET[key][id])}</div>`).join('')}</div>`;
    return rows + map;
  };
  const big = W_ > 500 ? 80 : 44;
  const name = key => WOPTS.find(o => o[0] === key);
  const head = key => `<div class="wl" style="font-size:14px;margin:0 0 4px">${name(key)[1]}</div><p class="sm" style="margin:0 0 6px;min-height:${W_ > 500 ? 104 : 200}px">${name(key)[2]}</p>`;
  const nm = id => id === 'plus' ? '+' : id === 'cafe' ? 'cup' : id === 'bar' ? 'coupe' : id === 'nature' ? 'tree' : id;
  const foot = WOPTS.map(([key, title]) => { const b = WBLUR[key] || {}, v = ids.map(id => b[id]).filter(x => x != null); return `${title}: ${ids.map(id => `${nm(id)} ${b[id] != null ? b[id].toFixed(0) : '?'}`).join(', ')} (spread ${v.length ? (Math.max(...v) - Math.min(...v)).toFixed(0) : '?'})`; }).join('. ');
  return `<section class="card" id="c${n}"><div class="no">Grid · round 7 · g7r · sheet ${n}</div><h2>Weight: the line marks</h2>
<div class="q"><b>The question</b>${W_Q}</div>
<div class="lab">True size, where they live</div>
<div class="pair" style="align-items:start;grid-template-columns:repeat(3,minmax(0,1fr))">${WOPTS.map(([key]) => `<div style="text-transform:none;letter-spacing:0;align-items:stretch;text-align:left;font-weight:400;color:${COL.ink}">${head(key)}${live(key)}</div>`).join('')}</div>
<div class="lab">Large (${frT(big / 24)}x: a 24px badge drawn at ${big}px), with the line each row draws, measured</div>
${WOPTS.map(([key, title]) => `<div class="srow"><div class="k">${title}<br><span class="mute" style="font-weight:400">${WMEAS[key]}</span></div><div class="set big">${ids.map(id => cell(key, id, big)).join('')}</div></div>`).join('')}
<p class="sm mute" style="margin-top:14px">Blurred darkness, measured (the darkest fifth of the live circle after a 1.5px blur; src/blur-measure.js): ${foot}.</p>
</section>`;
}

// ---- g7k: THE TAPER, several making methods beside no taper (owner: "have the team come up with the rule and
// give me a version of icons following it and not following it"; "several options is fine, i just dont want to
// lose the no taper option"). Each option is the same grid with one style switch (picks7.js, o.style).
const TOPTS = [
  ['mono', 'Monoweight', 'Every line the same 1.5px, the bases too (saucer, foot, plinth, beam). Every hole\'s inner edge runs parallel to its outer edge, so the inside follows the outside: the coupe\'s band, the cup\'s handle, the star\'s hole. Like neon tube.'],
  ['brush', 'Sign painter\'s flat brush', 'The brush is held flat, as on a road sign or a painted banner: a line is full (1.5px) where it runs up and down and thin (1px) where it runs across, changing smoothly around a curve. The handle is full at its back and thin at its arms; the star\'s arms change with their angle; every horizontal (saucer, foot, plinth, rim) is thin.'],
  ['settle', 'Settled ink', 'Ink on a hung, screened banner settles downward: a line is thin (1px) at its top and full (1.5px) at its bottom, changing smoothly down its length. The handle thins at its top arm, the star at its top point; posts (the stem, the columns, the trunk, the +) widen downward.'],
];
// tried and dropped (director, turn 59), each for a stated reason, on the board
const TDROP = [
  ['Counterpunch, woodcut and burin (on the board you saw before)', 'you saw they weren\'t real tapers: each changed a wall or a post at one point and drew the rest straight. Both rules here change the width smoothly along the whole line and keep its curve.'],
];
const TSET = {};
for (const [key] of TOPTS) {
  const o = { style: key }, dm = {}; for (const [id] of BATCH) dm[id] = s => DRAW[id](s, o);
  TSET[key] = {};
  for (const [id] of BATCH) {
    const s = fitS(id, 12, dm), ox = (24 - s) / 2, oy = r3((24 - s) / 2), prims = dm[id](s);
    const m = measure(E.build(E.xform(prims, 1, 0, 0, ox, oy), { law: LAWS7.joint }).d);
    TSET[key][id] = E.build(E.xform(prims, 1, 0, 0, ox + r4(12 - (m.box.cx + m.cx) / 2), oy + r3(12 - (m.box.cy + m.cy) / 2)), { law: LAWS7.joint }).d;
  }
  TSET[key].star = E.build(star(20, USC.star, W, key), { law: scaled(LAWS7.joint, 24 / 20) }).d;
  TSET[key].plus = E.build(plus(26.4, USC.plus, W, key), { law: scaled(LAWS7.joint, 24 / 26.4) }).d;
  // exported so src/check-svg.py checks every variant (svg/g7/taper-<key>/)
  const dir = path.join(ROOT, 'svg', 'g7', `taper-${key}`); fs.mkdirSync(dir, { recursive: true });
  for (const [id] of BATCH) fs.writeFileSync(path.join(dir, `${id}-24.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11.25" fill="none" stroke="currentColor" stroke-width="1.5"/><path fill="currentColor" d="${TSET[key][id]}"/></svg>\n`);
  for (const [k, px] of [['star', 20], ['plus', 26.4]]) fs.writeFileSync(path.join(dir, `${k}-${px}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 24 24"><path fill="currentColor" d="${TSET[key][k]}"/></svg>\n`);
}
// the check-svg.py result on the taper variants, written by the check run (svg/g7/taper-check.txt)
const TCHECK = fs.existsSync(path.join(ROOT, 'svg', 'g7', 'taper-check.txt')) ? fs.readFileSync(path.join(ROOT, 'svg', 'g7', 'taper-check.txt'), 'utf8').trim() : 'not run';
const T_Q = 'Real tapers now: in the two lower rows a line changes width smoothly from one end to the other and its inside keeps following the outside. Top row is monoweight. Which do you want?';
function sheetTaper() {
  const N = COL.navy, I2 = COL.ink2, big = 118;
  const ids = ['cafe', 'bar', 'museum', 'nature', 'plus', 'star'];
  const ui = (key, id, px) => `<svg width="${px}" height="${px}" viewBox="0 0 24 24" aria-hidden="true"><path d="${TSET[key][id]}" fill="${N}"/></svg>`;
  const cellBig = (key, id) => id === 'star' || id === 'plus'
    ? `<svg width="${big}" height="${big}" viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" fill="${COL.paper}"/><g transform="translate(${f2(12 - 12 * UIP[id][1] / 24)} ${f2(12 - 12 * UIP[id][1] / 24)}) scale(${f2(UIP[id][1] / 24)})"><path d="${TSET[key][id]}" fill="${N}"/></g></svg>`
    : badge(TSET[key][id], big);
  const trueSize = key => `<div style="display:flex;flex-direction:column;gap:8px"><div style="display:flex;align-items:center;gap:10px;height:56px;background:#F1E9DB;padding:0 10px;border-bottom:1px solid ${COL.hair}">${badge(TSET[key].bar)}<div style="flex:1;font-size:16px;font-weight:600;color:${COL.ink}">Tjoget<div style="font-size:10.5px;letter-spacing:.08em;font-weight:700;opacity:.72;margin-top:2px">BAR · STOCKHOLM</div></div>${ui(key, 'star', 20)}</div><div style="display:flex;align-items:center;gap:8px">${['cafe', 'bar', 'museum', 'nature'].map(id => badge(TSET[key][id])).join('')}${ui(key, 'star', 20)}${plusBadge(ui(key, 'plus', 26.4), 60)}</div><div style="display:flex;align-items:center;gap:8px">${['cafe', 'bar', 'museum', 'nature'].map(id => `<svg width="12" height="12" viewBox="6 6 12 12" aria-hidden="true"><path d="${TSET[key][id]}" fill="${N}"/></svg>`).join('')}</div></div>`;
  const rows = TOPTS.map(([key, nm, line]) => `<div style="display:grid;grid-template-columns:300px 330px 1fr;gap:32px;align-items:center;padding:28px 0;border-top:${key === 'none' ? 4 : 1}px solid ${key === 'none' ? N : COL.hair}">
<div><div style="font-size:24px;font-weight:700;color:${N};margin-bottom:6px">${nm}</div><div style="font-size:16px;line-height:1.4;color:${I2}">${line}</div></div>
<div>${trueSize(key)}</div>
<div style="display:flex;gap:14px">${ids.map(id => cellBig(key, id)).join('')}</div></div>`).join('');
  return `<div style="width:1600px;box-sizing:border-box;padding:56px 64px 64px;background:${COL.raised};font-family:Archivo,Arial,sans-serif;color:${COL.ink}">
<div style="font-size:14px;letter-spacing:.12em;font-weight:700;color:${I2};text-transform:uppercase">Icon set · the first six · the taper</div>
<h1 style="margin:6px 0 10px;font-size:44px;line-height:1.1;color:${N}">The line: monoweight, and two real tapers</h1>
<div style="margin:18px 0 40px;padding:28px 32px;background:${COL.paper};border-top:4px solid ${COL.or}"><div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${COL.ord};text-transform:uppercase;margin-bottom:8px">The question</div><div style="font-size:26px;line-height:1.3;color:${N};font-weight:600">${T_Q}</div></div>
<div style="display:grid;grid-template-columns:300px 330px 1fr;gap:32px;font-size:13px;letter-spacing:.1em;font-weight:700;color:${I2};text-transform:uppercase;padding-bottom:10px"><div>The rule</div><div>True size</div><div>Large (8x): café, bar, museum, nature, +, star</div></div>
${rows}
<div style="border-top:1px solid ${COL.hair};padding-top:18px;font-size:15px;line-height:1.45;color:${I2}"><b style="color:${N}">Tried and dropped:</b> ${TDROP.map(([n, r]) => `<b>${n}</b>, ${r}`).join(' ')}</div>
<div style="padding-top:10px;font-size:15px;color:${I2}"><b style="color:${N}">Checked:</b> ${TCHECK}</div>
</div>`;
}

// ---- THE MASTER GRID (owner, 10-20: "please have a board with the master grid"): the one source a new
// icon is drawn from. Every figure here is built from the live rules (KEY/CLASS and the roots in picks7.js,
// the joint law in laws7.js, fitS() and starRc() here), so the board changes whenever a rule does.
// ---- g7t/g7u EXPLORATION: more human, by rule (not shipped unless he picks one) ----------------------
const H_Q = 'These tune the whole set toward more rounded, flared, hand-drawn shapes, each by one rule. Does any feel right, or keep the current set?';   // the director's wording (turn 81)
// the star at a size that balances with the set (director, turn 82): its points reach as far as the +'s arms
const PLUS_SPAN = (() => { const b = measure(UD.joint.plus.d).box; return (b.x1 - b.x0) * 26.4 / 24; })();
const starAt = (opts = {}) => { let lo = 0.3, hi = 1.2, d; for (let k = 0; k < 30; k++) { const m = (lo + hi) / 2; d = E.build(star(20, m, LINEW), { law: scaled(LAWS7.joint, 24 / 20), ...opts }).d; const b = measure(d).box; if ((b.x1 - b.x0) * 20 / 24 > PLUS_SPAN) hi = m; else lo = m; } return d; };
// g7u (owner on the coupe: "its starting to read as wine glass with the liquid... i think the taller stem or
// more pancaked bowl really sell coupeness"): three coupes, each in the size class, the band the stroke
// the clear band, optically the stroke: a light gap between two dark lines reads wider than it measures
// (irradiation), so it is drawn 8/9 of the line, 1 1/3px, on the 1/3px lattice (g7y)
const BAND = 4 / 3;
const bandHeight = d => { const h = OCHECK(d, 1.5).holes; if (!h.length) return null; const b = h.sort((p, q) => (q.box[2] - q.box[0]) - (p.box[2] - p.box[0]))[0].box; return b[3] - b[1]; };
const COUPES = [
  ['v134', 'As shipped.', {}],
  ['A: taller stem', 'The bowl as shipped, the stem a line longer (the glass fills its square).', { fb: 11.75, bandH: BAND }],
  ['B: flatter bowl', 'A pancaked bowl with a wide flat bottom; the drink a thin layer, read by its surface.', { bd: 5.5, bk: 0.35, bx: 0.5, fb: 10.333, bandH: BAND }],
  ['C: both', 'The flat bowl on the long stem.', { bd: 5.5, bk: 0.35, bx: 0.5, fb: 11.75, bandH: BAND }],
];
// g7z: the coupe is B (owner: "shape wise b is it. but the counter is still wrong both in size and in curvature"):
// its band's sides are the bowl's own curve moved in by the line (picks7 bandSide 'shift'), so the wall is 1.5
// across at the band's top, middle and bottom; the band 1 1/6px, under the stroke as he asked, and it puts the
// drink's surface back on the 1/3px lattice (1.5 + 1 1/6 = 2 2/3)
const BAND_B = 7 / 6, COUPE_B = { bd: 5.5, bk: 0.35, bx: 0.5, fb: 10.333, bandH: BAND_B, bandSide: 'shift' };
const EASE = 2.3;
// g7aa (owner on v147: "also the interior counter shape of the coupe *still* does not look right. and there is
// *still* not enough liquid in the cup how many times do i have to say it"): B's flat bowl, closed by its rim bar,
// holds less drink than v134 (measured, src/liquid.js). Three ways to give it clearly more, one idea each:
// g7ae (owner on (a) at 8x: "this line on the left and right is waht looks wrong -- it looks too straight compared to
// the rest of the shape"; on (a): "the shorter bowl i think is necessary -- when it drops this far down it starts looking
// too wine glass or chalice-y...especially with the hard edged flares... very stout instead of delicate"): B's shallow
// bowl, its sides one curve from the rim: the handles balanced for the most even curvature with no inflection (searched:
// the top handle 0.5 of the depth, the bottom 1.5 from the side; a lean inward made an S, a straight spot of its own); the stem 1 1/4px, its flares half a line. In this bowl only an open rim holds more drink than v134.
const COUPE_S = { bd: 5.5, bk: 0.5, lean: 0, bx: 1.5, fb: 11, post: 1.25, bandH: 7 / 6, bandSide: 'shift' };
const COUPE_V = [
  ['An open glass', 'B\'s shallow bowl with no bar across the rim: the mouth is the clear part (1 1/6px, under the stroke) and the drink fills the bowl. It reads as a solid glass, like batch 1.', { ...COUPE_S, coupe: 'open' }],
  ['The glass as an outline, the drink inside it', 'The glass drawn as an outline and the drink a shape inside it, a 2/3px gap all round. The most drink any version with clear glass around it holds in this bowl.', { ...COUPE_S, coupe: 'inner', bandH: 2 / 3 }],
  ['A bar across the rim, a clear crescent under it', 'The bar across the rim, and under it a clear crescent that follows the bowl (1 1/6px at the middle).', { ...COUPE_S, coupe: 'crescent' }],
  ['A bar across the rim, a clear band under it', 'The bar across the rim and a clear band under it, as B was; its sides now follow the new curve.', { ...COUPE_S, coupe: 'band' }],
];
// g7ae (owner on the museum: "how might this style be reflected in architectural things like this that are a lot of
// straight lines"; on the beam-shed museum: "no this is awful"): H2's museum is the base again; three rules, one each
const MUSEUM_V = [
  ['Sized by its weight', 'A shape that fills its whole box, as a building does, is drawn a tenth smaller than its class, so its blurred weight sits with the cup\'s rather than above it; every part stays. The rule for any straight-lined building (a hotel, city blocks): it is sized by its weight, not its box.', { fitScale: 0.9 }],
  ['Cast soft, joins flared', 'The building\'s outside corners round by 0.6px, as the cup\'s and coupe\'s do, and where a column meets the beam or the plinth the opening\'s corners round by half a line, as the coupe\'s stem flares. Lines stay straight; the hand is in the corners and joins. It combines with the first.', { arch: { cast: 0.6, capital: 0.5, plainOuter: true } }],
];
// g7an (owner, answering the museum stuck note: "When I say connected I mean to the systemic approach. I like the separated
// gable … it's the flaring effects that the museum and other structures like it aren't going to naturally make. How might we
// build some of that in?"): the museum from parts (picks7 structMuseum): the gable rests on the beam across the 1px cut,
// the beam is back, the columns stand full height. MUSEUM_F: three ways the flaring vocabulary reaches a straight-lined
// building, each a rule acting on a different place: where a post meets a mass, the outline, where a mass ends in the air.
// g7ao (director, turn 125: the gable's ends were 0.43, under the 1px end): the gable keeps a body with 1px ends (gEnd 1.2
// units), its pitch kept; the room comes from the CLASS, by rule: a temple with its gable set on its beam is as tall as it is
// wide (11.5 x 11.5 units), so it is fitted to the SQUARE class (the coupe's), not WIDE. The columns keep their height in px.
const STRUCT = { gb: 4, ap: 0.5, gEnd: 1.2 }, STRUCT_CLS = 'SQUARE', JOINS = { cap: { flare: 0.5 }, foot: { over: 0.5, flare: 0.5 } };
const MUSEUM_F = [
  ['A · Joins: the outer posts flare into what they hold and stand on', 'Where an outer post meets the beam above it or the base below it, it flares 1/2px into it on the outside, as the coupe\'s stem flares into its bowl and foot; past the post the beam and the base thin to 1px ends (the plate rule). Openings are counters and stay square.', 'A hotel or city block: its corner walls flare into the cornice and the base; windows stay square.', { struct: { ...STRUCT, cap: { flare: 0.5 }, foot: { over: 0.5, flare: 0.5 } } }],
];
const HSETS = [
  ['Now (v134): monoweight', 'The set as it is: the baseline.', {}, LAWS7.joint, 1, false, 0],
  ['H2: monoweight, eased, settled', 'Every mass\'s outside corners and joins ease out of their lines (no jump in curvature); every line end (the saucer\'s, the plinth\'s, the coupe\'s foot, the trunk) keeps the same plain round, so the terminals match across all eight. Every base is a slab. The tree keeps today\'s proportions, but its tiers are drawn, not ruled: their sides sweep in a fifth of a line and their undersides droop half a line (you: "the less mechanical triangles"). Every glyph sits with 1/12 more air. At true size this is subtle; it shows in the corners at 7x.', { droop: 0.5, bow: -0.2, ...COUPE_B }, LAWS7.joint, 11 / 12, true, EASE],
  ['H3: monoweight, with flares', 'H2, plus personality. THE BASE RULE: what stands on a table has a domed foot (the saucer, the coupe\'s foot); what stands on the ground keeps a flat base (the museum\'s plinth, the tree\'s trunk). THE FLARE RULE: a post flares into the mass it meets (the coupe\'s stem at both ends, the trunk into its tier); counters, slots and line marks never flare. Every line stays 1.5.', { droop: 0.5, bow: -0.2, dome: true, ...COUPE_B }, HUMAN({ flare: 1.5, mass: 0.6, end: 0.3 }), 11 / 12, true, EASE],
  // g7ag (owner: "i wanna see h3 with plate flipped (not foot)")
  ['H3, plate flipped', 'H3 as it was, with only the cup\'s saucer turned over: flat on top, rounded underneath. The coupe\'s foot stays H3\'s dome.', { droop: 0.5, bow: -0.2, dome: true, saucerFlip: true, ...COUPE_B }, HUMAN({ flare: 1.5, mass: 0.6, end: 0.3 }), 11 / 12, true, EASE],
  // g7ah (owner: "thats fine but also we're building approach rules here remember -- so what rules need to change in this
  // row's approach to make that not an anomaly and to have that decision vector considered throughout all icons"): the
  // tree he loves ("i love this tree") comes from three rule values; the row takes them for every icon
  ['H3, saucer flipped, rules tuned to the tree', 'H3 with the saucer flipped, and the rules that make the tree you love applied to every icon: flares 1/2px (H3: 1 1/2), free-standing posts 1 1/4px (H3: 1 1/2), acute tips rounded by a share of their shorter edge (H3: 0.35 everywhere); g7aj: and the vessel rule (the curved side of a vessel, a more even curve; the change is slight). Now the Between row with H3\'s plates and foot.', { droop: 0.5, bow: -0.2, dome: true, saucerFlip: true, ...COUPE_B, ...P7.VESSEL_SIDE, post: 1.25, starTip: 0.0877 }, HUMAN({ flare: 0.5, mass: 0.6, end: 0.3, tipShare: 0.0877 }), 11 / 12, true, EASE],
  // g7ak (owner on v216: "in "after: rules tuned to the tree" "coup, after" and "tree, after" are perfect ... but the glass being
  // on something so rounded as a plate feels off and the museum feels completely disconnected. so what rules do we need to
  // establish to fix that"; "i will say "coupe after" needs slightly more drink"): the coupe and the tree are fixed; four rules
  // carry them to the rest, and the drink rule moves the coupe's surface up a lattice line
  ['Rules from the coupe and tree', 'The tuned row with the plate rule (the cup\'s saucer), every post that holds a mass up at 1 1/4px, a gable resting on its beam, buildings straight-lined, and the clear band 5/6px.', { droop: 0.5, bow: -0.2, dome: true, ...COUPE_B, ...P7.VESSEL_SIDE, post: 1.25, starTip: 0.0877, plate: 0.5, colW: 1.25, struct: { ...STRUCT, ...JOINS }, cls: STRUCT_CLS, bandH: 5 / 6 }, HUMAN({ flare: 0.5, mass: 0.6, end: 0.3, tipShare: 0.0877 }), 11 / 12, true, EASE],
  ['Rules from the coupe and tree, the foot by the plate rule', 'The tuned row with the plate rule (the cup\'s saucer), every post that holds a mass up at 1 1/4px, a gable resting on its beam, buildings straight-lined, and the clear band 5/6px.', { droop: 0.5, bow: -0.2, dome: true, ...COUPE_B, ...P7.VESSEL_SIDE, post: 1.25, starTip: 0.0877, plate: 0.5, colW: 1.25, struct: { ...STRUCT, ...JOINS }, cls: STRUCT_CLS, bandH: 5 / 6, dome: 0.5 }, HUMAN({ flare: 0.5, mass: 0.6, end: 0.3, tipShare: 0.0877 }), 11 / 12, true, EASE],
  ['H3 relaxed: free posts 1 1/4, flaring into their joins', 'H3, with monoweight relaxed for free-standing posts only: the coupe\'s stem and the trunk thin to 1 1/4px between their flares, as batch 1\'s stem did. Every other line stays 1.5.', { droop: 0.5, bow: -0.2, dome: true, post: 1.25, ...COUPE_B }, HUMAN({ flare: 1.5, mass: 0.6, end: 0.3 }), 11 / 12, true, EASE],
  // g7aa (owner on v147: "i want something between h2 and h3 -- i like the loosening up, but the coffee cup plate
  // feels too far. and the flares too intense. the museum looks completely out of place")
  ['Between H2 and H3', 'H3\'s loosening, pulled back: the plates are slabs whose tops rise half a line at the centre; the flares are a third of H3\'s (1/2px); every tip\'s round is a share of its edge; the museum is H2\'s, its architecture open (below).', { droop: 0.5, bow: -0.2, dome: 0.5, ...COUPE_V[0][2] }, HUMAN({ flare: 0.5, mass: 0.6, end: 0.3, tipShare: 0.0877 }), 11 / 12, true, EASE],
  // g7ae (owner: "what if the plate was flipped the other way with the rounding on the bottom")
  ['Between, plates flipped', 'The same, with the plate and the coupe\'s foot flat on top and rounded underneath: the underside drops 1/2px at the centre, like a saucer\'s.', { droop: 0.5, bow: -0.2, under: 0.5, ...COUPE_V[0][2] }, HUMAN({ flare: 0.5, mass: 0.6, end: 0.3, tipShare: 0.0877 }), 11 / 12, true, EASE],
].map(([nm, rule, o, law, fk, bal, ease]) => {
  const opts = { law, tightHoles: true, ease: ease || undefined };
  const fitPlace = (id, extra = {}, withSil = false) => {
    const fk_ = fk * (extra.fitScale || 1), [cls0, apex] = CLASS[id], cls = (id === 'museum' && (extra.cls || o.cls)) || cls0, kw = KEY[cls][0] * fk_, bh = (KEY[cls][1] + apex) * fk_, dr = (s, x = {}) => DRAW[id](s, { style: 'mono', ...o, ...extra, ...x });
    let s = 12; for (let k = 0; k < 6; k++) { const b = measure(E.build(dr(s), opts).d).box; s *= Math.min(kw / (b.x1 - b.x0), bh / (b.y1 - b.y0)); }
    const ox = (24 - s) / 2, oy = r3((24 - s) / 2), prims = dr(s), m = measure(E.build(E.xform(prims, 1, 0, 0, ox, oy), opts).d);
    const tx = r4(12 - (m.box.cx + m.cx) / 2), sym = (o.dome || typeof o.under === 'number') && id !== 'cafe' ? ox + tx + s / 2 : undefined;   // g7z: H3's symmetric glyphs mirrored after the law
    const ty = oy + r3(12 - (m.box.cy + m.cy) / 2), d = E.build(E.xform(prims, 1, 0, 0, ox + tx, ty), { ...opts, sym }).d;
    // g7aa: the silhouette (no band, no drink) placed exactly as the glyph is, for the liquid measure
    return withSil ? { d, sil: E.build(E.xform(dr(s, { band: false }), 1, 0, 0, ox + tx, ty), { ...opts, sym }).d } : d;
  };
  const ds = {};
  for (const [id] of BATCH) ds[id] = fitPlace(id);
  // g7ah: o.starTip, the tip-by-edge rule on the star too (its tips are acute tips like the tree's)
  ds.star = bal ? starAt({ ease: ease || undefined, tightHoles: true, ...(o.starTip ? { law: scaled(c => (c.convex && c.angle < 75) ? Math.min(LAWS7.joint(c), o.starTip * Math.min(c.lin, c.lout)) : LAWS7.joint(c), 24 / 20) } : {}) }) : UD.joint.star.d;
  ds.plus = ease ? E.build(plus(26.4, USC.plus, LINEW), { law: scaled(LAWS7.joint, 24 / 26.4), ease }).d : UD.joint.plus.d;
  const coupes = COUPES.map(([, , co]) => fitPlace('bar', co));
  const bar1 = o.bandSide === 'shift' ? fitPlace('bar', { bandH: 1 }) : null;   // g7z: the thinner band, for the coupe board
  const silBar = fitPlace('bar', {}, true).sil;   // g7aa: the coupe's silhouette, for the liquid measure
  const cv = nm === 'Between H2 and H3' ? COUPE_V.map(([, , v]) => fitPlace('bar', v, true)) : null;
  // g7ae: the museum's architecture, three ways on H2's four-column, beamed drawing (MUSEUM_V)
  const mus = nm === 'Between H2 and H3' ? MUSEUM_V.map(([, , v]) => fitPlace('museum', v)) : null;
  // g7al: the museum options the rules row shows beside its own (flared slots; swept roof)
  // g7an: the museum, three flaring rules (MUSEUM_F) on the base by these rules; [3] is v219's (the roof set on its columns), for the before
  // g7ao: [0] the base without the joins rule, [1] v219 (roof set on its columns), [2] v220's base (gable ends 0.43, WIDE), for the befores
  const mus2 = nm === 'Rules from the coupe and tree' ? [fitPlace('museum', { struct: STRUCT }), fitPlace('museum', { struct: null, restCut: { top: 1 }, cls: 'WIDE' }), fitPlace('museum', { struct: { gb: 4, ap: 1.333 }, cls: 'WIDE' })] : null;
  return { nm, rule, ds, coupes, ease, bar1, silBar, cv, mus, mus2 };
});
const R2 = HSETS.find(S => S.nm === 'Rules from the coupe and tree');
const R2B = HSETS.find(S => S.nm === 'Rules from the coupe and tree, the foot by the plate rule');
const HOLD = HSETS.filter(S => !S.nm.startsWith('Between') && !S.nm.startsWith('H3, ') && S !== R2 && S !== R2B), H3F = HSETS.find(S => S.nm === 'H3, plate flipped'), H3T = HSETS.find(S => S.nm === 'H3, saucer flipped, rules tuned to the tree'), BETW = HSETS.find(S => S.nm === 'Between H2 and H3'), BFLIP = HSETS.find(S => S.nm === 'Between, plates flipped');   // g7aa: the v144 boards keep their four rows
{ // g7aa: the between row and the three coupes as svg files, for check-svg.py and the counter checks
  const dir = path.join(__dirname, '../svg/g7/between'); fs.mkdirSync(dir, { recursive: true });
  const svg = d => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${d}"/></svg>`;
  for (const id of ['cafe', 'bar', 'museum', 'nature', 'star', 'plus']) fs.writeFileSync(path.join(dir, `${id}.svg`), svg(BETW.ds[id]));
  for (const f_ of fs.readdirSync(dir)) if (/^(bar-|museum-)/.test(f_)) fs.unlinkSync(path.join(dir, f_));
  BETW.cv.forEach(({ d }, k) => fs.writeFileSync(path.join(dir, `bar-${'abcd'[k]}.svg`), svg(d)));
  BETW.mus.forEach((d, k) => fs.writeFileSync(path.join(dir, `museum-${k + 1}.svg`), svg(d)));
  for (const id of ['cafe', 'bar']) fs.writeFileSync(path.join(dir, `${id}-flipped.svg`), svg(BFLIP.ds[id]));
  fs.writeFileSync(path.join(dir, 'cafe-h3-flipped.svg'), svg(H3F.ds.cafe));
  // g7ah: the row tuned to the tree, every glyph, for check-svg.py
  for (const id of ['cafe', 'bar', 'museum', 'nature', 'star', 'plus']) fs.writeFileSync(path.join(dir, `h3t-${id}.svg`), svg(H3T.ds[id]));
  // g7ak: the row by the rules from the coupe and tree
  for (const id of ['cafe', 'bar', 'museum', 'nature', 'star', 'plus']) fs.writeFileSync(path.join(dir, `${id}-r2.svg`), svg(R2.ds[id]));
  fs.writeFileSync(path.join(dir, 'bar-r2b.svg'), svg(R2B.ds.bar)); R2.mus2.forEach((d, k) => fs.writeFileSync(path.join(dir, `museum-r2-${['base', 'v219', 'v220'][k]}.svg`), svg(d)));
  fs.writeFileSync(path.join(dir, 'h3f-nature.svg'), svg(H3F.ds.nature)); fs.writeFileSync(path.join(dir, 'h3f-star.svg'), svg(H3F.ds.star)); fs.writeFileSync(path.join(dir, 'h3f-bar.svg'), svg(H3F.ds.bar)); fs.writeFileSync(path.join(dir, 'h3f-museum.svg'), svg(H3F.ds.museum)); fs.writeFileSync(path.join(dir, 'h3f-plus.svg'), svg(H3F.ds.plus));
}
// checks on every tuned glyph: counters (distance and direction), and the CURVE CHECK: at every smooth join
// (where the outline's direction is continuous), the jump in curvature between the two sides, 1/px
function curveJump(d) {
  const cp = new paperLib.CompoundPath(d), kids = cp.children && cp.children.length ? cp.children : [cp];
  let worst = 0, n = 0, endWorst = 0;
  for (const k of kids) { if (kids.some(o => o !== k && o.contains(k.firstSegment.point))) continue;   // outlines only: counters keep tight compass rounds
    const cv = k.curves; for (let q = 0; q < cv.length; q++) {
    const a = cv[q], b = cv[(q + 1) % cv.length], ta = a.getTangentAtTime(1), tb = b.getTangentAtTime(0);
    if (Math.abs(ta.getDirectedAngle(tb)) > 2) continue;
    const ka = Math.abs(a.getCurvatureAtTime(1)), kb = Math.abs(b.getCurvatureAtTime(0)); if (!isFinite(ka) || !isFinite(kb)) continue;
    // a line end: the straight edge beside the join is shorter than 2 lines (its round stays a plain arc, by rule)
    // the round is the shorter side; its corner is a line end if either edge it joins is under 2 lines (the
    // engine eases only corners between two edges of at least 2 lines)
    const arcFirst = a.length < b.length, e1 = arcFirst ? cv[(q - 1 + cv.length) % cv.length] : a, e2 = arcFirst ? b : cv[(q + 2) % cv.length];
    if (Math.min(e1.length, e2.length) < 3) { endWorst = Math.max(endWorst, Math.abs(ka - kb)); continue; }
    worst = Math.max(worst, Math.abs(ka - kb)); n++;
  } }
  cp.remove(); return { worst, n, endWorst };
}
function sheetHuman() {
  const N = COL.navy, I2 = COL.ink2, O = COL.or;
  const title = t_ => `<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${I2};text-transform:uppercase;margin:0 0 14px">${t_}</div>`;
  const uiD = (d, px) => `<svg width="${px}" height="${px}" viewBox="0 0 24 24" aria-hidden="true"><path d="${d}" fill="${N}"/></svg>`;
  const chip12 = d => `<svg width="12" height="12" viewBox="6 6 12 12" aria-hidden="true"><path d="${d}" fill="${N}"/></svg>`;
  const b1 = OLD.bar.d;
  // in the app, at true size: list rows with the star, and the + in its Float badge with pins
  const inApp = S => {
    const rows = [['cafe', 'Kaffeverket', 'CAFÉ', true], ['bar', 'Tjoget', 'BAR', false], ['museum', 'Vasa Museum', 'MUSEUM', true], ['nature', 'Djurgården', 'NATURE', false]]
      .map(([id, nm, sub, st]) => `<div style="display:flex;align-items:center;gap:10px;height:56px;background:${COL.paper};padding:0 10px;border-bottom:1px solid ${COL.hair}">${badge(S.ds[id])}<div style="flex:1;font-size:16px;font-weight:600;line-height:1.15">${nm}<div style="font-size:10.5px;letter-spacing:.08em;font-weight:700;opacity:.72;margin-top:2px">${sub} · STOCKHOLM</div></div>${st ? uiD(S.ds.star, 20) : ''}</div>`).join('');
    const map = `<div style="position:relative;height:72px;background:#E8E4DA;margin-top:6px">${['cafe', 'bar', 'museum', 'nature'].map((id, k) => `<div style="position:absolute;left:${84 + 44 * k}px;top:${k % 2 ? 38 : 8}px;line-height:0">${badge(S.ds[id])}</div>`).join('')}<div style="position:absolute;left:8px;top:6px;line-height:0">${plusBadge(uiD(S.ds.plus, 26.4), 60)}</div></div>`;
    return `<div style="width:330px">${rows}${map}</div>`;
  };
  const checks = S => {
    const ids = ['cafe', 'bar', 'museum', 'nature'];
    const oc = ids.map(id => OCHECK(S.ds[id], 1.5)).concat([OCHECK(S.ds.star, LINEW * 24 / 20)]);
    const off = oc.reduce((a, r) => a + r.holes.reduce((b, h) => b + h.off, 0), 0), nn = oc.reduce((a, r) => a + r.holes.reduce((b, h) => b + h.n, 0), 0), md = Math.max(...oc.map(r => Math.max(0, ...r.holes.map(h => h.maxDir || 0))));
    const cj = [...ids.map(id => curveJump(S.ds[id])), curveJump(S.ds.star), curveJump(S.ds.plus)];
    const who = ids.concat(['star']).map((id, k) => [id, oc[k].holes.reduce((a, h) => a + h.off, 0)]).filter(([, o]) => o).map(([id, o]) => id === 'bar' ? `coupe ${o}: its thinner drink's floor, which the check counts as a wall` : `${id} ${o}`).join(', ');
    return `Counters: ${off} of ${nn} wall points off${who ? ` (${who})` : ''}, worst turn ${md.toFixed(1)}°. Outlines: worst curvature jump at a smooth join ${Math.max(...cj.map(c => c.worst)).toFixed(2)}/px over ${cj.reduce((a, c) => a + c.n, 0)} joins; line ends, plain rounds by rule, ${Math.max(...cj.map(c => c.endWorst)).toFixed(2)}/px.`;
  };
  const setRow = S => `<div style="display:grid;grid-template-columns:330px 1fr;gap:28px;padding:22px 0;border-top:1px solid ${COL.hair}">
<div><div style="font-size:21px;font-weight:700;color:${N};margin-bottom:6px">${S.nm}</div><div style="font-size:16px;line-height:1.45;color:${I2}">${S.rule}</div><div style="font-size:13px;line-height:1.4;color:${I2};margin-top:8px">${checks(S)}</div></div>
<div><div style="display:flex;gap:24px;align-items:flex-start">${inApp(S)}<div><div style="display:flex;gap:14px;align-items:center">${BATCH.map(([id]) => badge(S.ds[id])).join('')}${uiD(S.ds.plus, 26.4)}${uiD(S.ds.star, 20)}<span style="width:12px"></span>${BATCH.map(([id]) => chip12(S.ds[id])).join('')}</div>
<div style="display:flex;gap:10px;margin-top:14px;align-items:center;flex-wrap:wrap">${BATCH.map(([id]) => badge(S.ds[id], 168)).join('')}${uiD(S.ds.plus, 185)}${uiD(S.ds.star, 140)}</div></div></div></div></div>`;
  // the coupe options in every row, with their drink and checks
  const cHead = `<div></div>${COUPES.map(([nm, txt]) => `<div><div style="font-size:17px;font-weight:700;color:${N}">${nm}</div><div style="font-size:13px;line-height:1.35;color:${I2}">${txt}</div></div>`).join('')}`;
  const cRow = S => `<div style="font-size:16px;font-weight:700;color:${N};align-self:center">${S.nm.split(':')[0]}</div>${S.coupes.map(d => { const r = DRINK(d), b = measure(d).box, oc = OCHECK(d, 1.5).holes[0]; return `<div style="display:flex;flex-direction:column;gap:6px;align-items:flex-start"><div style="display:flex;gap:8px;align-items:center">${badge(d)}${badge(d, 120)}</div><div style="font-size:13px;line-height:1.4;color:${I2}"><b style="color:${N}">clear band ${bandHeight(d).toFixed(2)}px</b> (the stroke 1.5) · ${(b.x1 - b.x0).toFixed(2)} × ${(b.y1 - b.y0).toFixed(2)} · drink ${r.area.toFixed(1)}px², surface ${r.surface.toFixed(1)}px · counter ${oc.off}/${oc.n} off${oc.offD ? `: ${oc.offD} by distance, the thin drink\'s floor, which sits under 1.5 lines from the bowl\'s underside, so the check counts it as a wall (an artefact of the check, not a fault in the wall)` : ''}${oc.offA ? `${oc.offD ? ';' : ':'} ${oc.offA} by direction, where the drink\'s surface meets the bowl wall (the check reads the drink\'s edge as a wall; an artefact) (worst ${oc.maxDir.toFixed(1)}°)` : ''}</div></div>`; }).join('')}`;
  return `<div style="width:1600px;box-sizing:border-box;padding:56px 64px 64px;background:${COL.raised};font-family:Archivo,Arial,sans-serif;color:${COL.ink}">
<div style="font-size:14px;letter-spacing:.12em;font-weight:700;color:${I2};text-transform:uppercase">Icon grid · an exploration, nothing ships unless you pick it</div>
<h1 style="margin:6px 0 10px;font-size:44px;line-height:1.1;color:${N}">More human, by rule</h1>
<p style="margin:0 0 18px;font-size:19px;line-height:1.45;max-width:1200px">You said: "i still find myself pining for that original shape. i think it's the fact that it feels more delicate. that more humanistic approach to curves gives it a handmade feel that i think calls back to the physicality of making vintage work." Below, the set as it is and the two directions you\'re weighing, H2 and H3 (H3 shown both monoweight and relaxed), each a grid rule applied to all eight, in the app at true size, then at 7x. Counters and the size classes stay as they are. Then the coupe, three ways (you: "the taller stem or more pancaked bowl really sell coupeness"), in the current drawing.</p>
<div style="margin:0 0 36px;padding:24px 28px;background:${COL.paper};border-top:4px solid ${O}"><div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${COL.ord};text-transform:uppercase;margin-bottom:8px">The questions</div><div style="font-size:26px;line-height:1.3;color:${N};font-weight:600">${H_Q}</div><div style="font-size:22px;line-height:1.3;color:${N};font-weight:600;margin-top:10px">And the coupe: which of A, B or C reads most like a coupe?</div></div>
<div style="display:grid;grid-template-columns:330px 1fr;gap:28px;align-items:center;margin:0 0 30px">
<div>${title('The feeling: batch 1\'s coupe')}<div style="font-size:16px;line-height:1.45;color:${I2}">Shown for the feeling only, not as a target. What made it feel drawn by hand: a <b>thin stem that flared</b> into the bowl and the foot, a <b>domed foot</b>, a bowl that was one <b>full curve</b>, and, in its tree, <b>drooping</b> branches. The tunings carry these as rules to every icon.</div></div>
<div style="display:flex;gap:18px;align-items:center">${badge(b1)}${badge(b1, 168)}</div></div>
${HOLD.map(setRow).join('')}
<div style="margin-top:44px">${title('The coupe, three ways, in the current drawing: true size, then 5x')}<div style="display:grid;grid-template-columns:150px repeat(4, 1fr);gap:18px 20px;align-items:start">${cHead}${cRow(HSETS[0])}</div>
<div style="font-size:14px;color:${I2};margin-top:10px">Every coupe stays in the square class, monoweight, the band 1 1/3px (v134: 1.5) with its sides one line in from the bowl. A flat bowl (B, C) leaves room for only a thin drink under the band, read by its surface, not its depth.</div><div style="font-size:16px;color:${N};font-weight:600;margin-top:10px">The drink in C: with the band at 1 1/3px, C holds ${DRINK(HSETS[0].coupes[3]).area.toFixed(1)}px², a little more than v130's 14.2px² (which you once called too little), in a flat bowl that can only hold a shallow layer; your newest note says the deep one was "starting to read as wine glass with the liquid".</div></div>
${REFS.map(([nm, rs]) => `<div style="display:grid;grid-template-columns:330px 1fr;gap:28px;padding:22px 0;border-top:1px solid ${COL.hair};margin-top:30px">
<div><div style="font-size:21px;font-weight:700;color:${N};margin-bottom:6px">${nm.split(' (')[0]}</div><div style="font-size:16px;line-height:1.45;color:${I2}">For comparison, not a craft benchmark: in our badge, at our box.</div></div>
<div><div style="display:flex;gap:14px;align-items:center">${rs.slice(0, 4).map(r => refInBadge(r)).join('')}${refBare(rs[4], 26.4)}${refBare(rs[5], 20)}</div>
<div style="display:flex;gap:10px;margin-top:14px;align-items:center">${rs.slice(0, 4).map(r => refInBadge(r, 168)).join('')}${refBare(rs[4], 185)}${refBare(rs[5], 140)}</div></div></div>`).join('')}
<div style="display:grid;grid-template-columns:1fr 1fr;gap:48px;margin-top:36px">
<div>${title('Rules that bend')}<div style="font-size:16px;line-height:1.5">
<p style="margin:0 0 10px"><b>The corner law</b> keeps its radii in every tuning; the tunings change only how a mass\'s round meets its lines (eased, not a compass arc). Line ends keep the plain round everywhere.</p>
<p style="margin:0 0 10px"><b>Interior tighter than exterior</b> (your rule) bends in H3 only, at one kind of corner: where a post flares into a mass. Counters, slots and the tree\'s notches stay tight in every tuning.</p>
<p style="margin:0 0 10px"><b>Every base is a slab</b> holds in H2. In H3 it becomes <b>table or ground</b>: what stands on a table has a domed foot (the saucer, the coupe\'s foot; later a lamp, a trophy, a vase); what stands on the ground keeps a flat base (the plinth, the trunk; later a bench, a sign). v138 kept the saucer a slab because no dome existed yet; under this rule it domes with the coupe.</p>
<p style="margin:0 0 10px"><b>Monoweight</b> (your pick) holds in H2 and H3. Only "H3 relaxed" thins the free-standing posts, and says so in its name.</p>
<p style="margin:0"><b>The Outline class</b>: in the tunings the star\'s points reach as far as the +\'s arms (the shipped star\'s 4px hole minimum made it 15% wider than v133); its hole is then about 2 lines.</p></div></div>
<div>${title('Craft bar, and comparisons')}<div style="font-size:16px;line-height:1.5">The craft bar, for finish and construction rigour rather than style: Central, Nucleo, Lucide and Apple's published method. None is copied; Lucide glyphs may appear only labelled "craft reference". Material and Phosphor are shown above for comparison, not as a craft benchmark (you: "just to see how much *better* ours are").</div></div></div>
</div>`;
}
// ---- the page's reading order (g7x, owner: "i am struggling to figure out how to read the file at this point"):
// a START HERE board, and one DECIDE board per open question, each 760 wide so it reads on a phone
const PH = { w: 760, pad: '36px 32px 40px' };
const phBoard = (kicker, title, body) => `<div style="width:${PH.w}px;box-sizing:border-box;padding:${PH.pad};background:${COL.raised};font-family:Archivo,Arial,sans-serif;color:${COL.ink}">
<div style="font-size:15px;letter-spacing:.12em;font-weight:700;color:${COL.ord};text-transform:uppercase">${kicker}</div>
<h1 style="margin:6px 0 18px;font-size:38px;line-height:1.1;color:${COL.navy}">${title}</h1>${body}</div>`;
const phQ = q => `<div style="margin:0 0 24px;padding:18px 20px;background:${COL.paper};border-top:4px solid ${COL.or};font-size:24px;line-height:1.3;color:${COL.navy};font-weight:600">${q}</div>`;
const phP = s => `<p style="margin:0 0 12px;font-size:19px;line-height:1.45">${s}</p>`;
const phOpt = (label, line, glyphs) => `<div style="padding:16px 0;border-top:1px solid ${COL.hair}"><div style="font-size:21px;font-weight:700;color:${COL.navy}">${label}</div><div style="font-size:17px;line-height:1.4;color:${COL.ink2};margin:2px 0 10px">${line}</div><div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">${glyphs}</div></div>`;
const phDetail = s => `<div style="margin-top:18px;font-size:16px;color:${COL.ink2}">Detail: ${s}</div>`;
const uiPath = (d, px) => `<svg width="${px}" height="${px}" viewBox="0 0 24 24" aria-hidden="true"><path d="${d}" fill="${COL.navy}"/></svg>`;
const OPEN_QS = [
  ['Decide: more human?', 'H2 or H3? And if H3, keep every line 1.5 (monoweight), or let the stem and trunk thin (relaxed)? (The tree\'s less mechanical tiers are part of both.)'],
  ['Decide: line marks', 'At 1 2/3px, do the + and the star feel as heavy as the place icons?'],
];
// g7ab: Start's open questions (the older boards keep OPEN_QS as they were published)
const START_QS = [
  ['Between H2 and H3, part 1', 'The coupe, in the shallow bowl: the open glass (more drink than v134), or more clear glass and less drink?'],
  ['Between H2 and H3, parts 2 and 3', 'Between H2 and H3: the plate rising or flipped? And which of three ways should buildings be drawn?'],
  ['Decide: line marks', 'At 1 2/3px, do the + and the star feel as heavy as the place icons?'],
];
const ANSWERED = ['The coupe, A, B or C: B, the flatter bowl. Its inside and its drink are question 1.', 'H1, H2 or H3: H1 dropped; you asked for something between H2 and H3 (question 2).'];
// g7ag (owner: "clean up all the old stuff first theres so much content to read"): one line on the page, then the
// open questions only, each pointing to its board. Everything older is on the Archive page.
function sheetStart() {
  const qs = START_QS.map(([b, q], k) => `<div style="display:grid;grid-template-columns:36px 1fr;gap:10px;padding:14px 0;border-top:1px solid ${COL.hair}"><div style="font-size:24px;font-weight:700;color:${COL.or}">${k + 1}</div><div><div style="font-size:20px;line-height:1.35;color:${COL.navy};font-weight:600">${q}</div><div style="font-size:17px;color:${COL.ink2};margin-top:4px">Board: ${b}</div></div></div>`).join('');
  return phBoard('Grid concepts', 'Start here', `${phP('The icon grid: the questions waiting on you, then the master grid and every icon, original beside newest. Everything older is on the Archive page.')}
<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${COL.ink2};text-transform:uppercase;margin:24px 0 6px">Waiting on you</div>${qs}`);
}
function sheetDecideTunings() {
  const SHORT = ['As shipped: the baseline.', 'Corners ease into their lines; every line end and every base matches (slabs); tree tiers drawn, not ruled; more air.', 'H2, plus flares where a post meets a mass, and one base rule: on a table, a domed foot; on the ground, a flat base. Every line 1.5.', 'H3, with the stem and trunk thinned to 1 1/4px (monoweight relaxed there only).'];
  const opt = (S, k) => phOpt(S.nm, SHORT[k], `${BATCH.map(([id]) => badge(S.ds[id])).join('')}${uiPath(S.ds.plus, 26.4)}${uiPath(S.ds.star, 20)}<span style="width:8px"></span>${BATCH.map(([id]) => badge(S.ds[id], 72)).join('')}`);
  // g7z (director, turn 94): H3's every base, end and join, per icon, with the rule each follows. Radii are
  // measured from the build at the 12px drawing (src/h3-ends.js prints them).
  const H3L = [
    ['Café', 'Saucer: domed (on a table)', 'Saucer ends 0.6 (a domed foot\'s round)', 'Cup on saucer: the join round 0.2 (a mass on a base, not a post). Handle: a loop; its inside corners stay tight, 0.15'],
    ['Coupe', 'Foot: domed (on a table)', 'Foot ends 0.6; rim corners 0.6', 'Stem flares 1.44 into the bowl and into the foot. Drink band corners tight'],
    ['Museum', 'Plinth: flat (on the ground)', 'Plinth and eave ends 0.1 to 0.3 (the end round, fitted to a 1.5 slab); apex 0.7', 'The columns are the walls between slots, so their corners are slot corners: tight, 0.15, no flare. That\'s why it matches H2'],
    ['Tree', 'Trunk: flat (on the ground)', 'Trunk end 0.3; tier tips 0.35', 'Trunk flares 0.93 into the bottom tier (capped by the tier\'s short edge). Notches tight, 0.15'],
    ['+', 'None', 'Arm ends: the plain round', 'The crossing keeps the line join. A line mark has no mass, so nothing flares'],
    ['Star', 'None', 'Tips: the joint round', 'Valleys and the hole\'s corners tight. No flare, as for the +'],
  ].map(([n, b, e, j]) => `<div style="padding:12px 0;border-top:1px solid ${COL.hair}"><div style="font-size:19px;font-weight:700;color:${COL.navy}">${n}</div><div style="font-size:16px;line-height:1.4;margin-top:2px"><b>Base</b>: ${b}<br><b>Ends</b>: ${e}<br><b>Joins</b>: ${j}</div></div>`).join('');
  const h3Rules = `<div style="margin-top:26px;padding:18px 20px;background:${COL.paper};border-left:4px solid ${COL.or}"><div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${COL.ink2};text-transform:uppercase;margin-bottom:6px">H3's base rule</div><div style="font-size:21px;line-height:1.35;color:${COL.navy};font-weight:600">What stands on a table has a domed foot; what stands on the ground keeps a flat base.</div><div style="font-size:16px;line-height:1.4;margin-top:6px">So the saucer and the coupe's foot dome, and the plinth and the trunk stay flat. And one flare rule: a post flares into the mass it meets; counters, slots and line marks never do.</div></div>
<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${COL.ink2};text-transform:uppercase;margin:24px 0 4px">H3, every base, end and join</div>${H3L}`;
  return phBoard('Waiting on you · 1', 'Decide: more human?', `${phQ(OPEN_QS[0][1])}${HOLD.map(opt).join('')}${h3Rules}${phDetail('"More human, by rule" (row 2), with every rule, the checks and the in-app view.')}`);
}
function sheetDecideCoupeV142() {   // v142's board, as the owner saw it (archived on the canvas)
  const S0 = HSETS[0], cs = S0.coupes, N = COL.navy;
  const listRows = ds => [['cafe', 'Kaffeverket', 'CAFÉ', true], ['bar', 'Tjoget', 'BAR', false], ['museum', 'Vasa Museum', 'MUSEUM', true], ['nature', 'Djurgården', 'NATURE', false]]
    .map(([id, nm, sub, st]) => `<div style="display:flex;align-items:center;gap:10px;height:56px;background:${COL.paper};padding:0 10px;border-bottom:1px solid ${COL.hair}">${badge(ds[id])}<div style="flex:1;font-size:16px;font-weight:600;line-height:1.15">${nm}<div style="font-size:10.5px;letter-spacing:.08em;font-weight:700;opacity:.72;margin-top:2px">${sub} · STOCKHOLM</div></div>${st ? uiPath(ds.star, 20) : ''}</div>`).join('');
  const opt = k => { const [nm, line] = COUPES[k], ds = { ...S0.ds, bar: cs[k] }, bh = bandHeight(cs[k]);
    return phOpt(nm, `${line} Clear band ${bh.toFixed(2)}px (the stroke 1.5).`, `<div style="display:flex;gap:10px;align-items:center;width:100%">${['cafe', 'bar', 'museum', 'nature'].map(id => badge(ds[id])).join('')}${uiPath(ds.plus, 26.4)}${uiPath(ds.star, 20)}</div><div style="display:flex;gap:18px;align-items:center;margin-top:10px"><div style="width:330px">${listRows(ds)}</div>${badge(cs[k], 150)}</div>`); };
  return phBoard('Waiting on you · 2', 'Decide: the coupe', `${phQ(OPEN_QS[1][1])}${phP('You: "the empty part should be equal to the thickness of the stroke. or maybe even a little thinner". A light gap between two dark lines reads wider than it measures, so A, B and C draw it 1 1/3px (8/9 of the line); v134 drew it 1.5 and you saw it as taller. Each is shown in the set and in the app.')}${[0, 1, 2, 3].map(opt).join('')}
<div style="margin-top:14px;font-size:17px;line-height:1.4;color:${N}">The drink in C: ${DRINK(cs[3]).area.toFixed(1)}px², a little more than v130's 14.2px², in a shallow layer that reads by its surface, not its depth.</div>${phDetail('"More human, by rule" (row 2), the coupe section.')}`);
}
// g7z: the coupe is decided (B); this board shows the band redrawn, with the proof he asked for
const { wall: bandWall } = require('./band-wall.js');
function sheetDecideCoupe() {
  const N = COL.navy, O = COL.or, I2 = COL.ink2;
  const SIDE = 'M6 5.5C0.5 5.5 0.25 1.925 0.25 0';   // B's bowl, its left side (bd 5.5, bk 0.35, bx 0.5), in the 12px drawing
  const draw = (o, law = LAWS7.joint, ease) => E.build(DRAW.bar(12, { style: 'mono', ...o }), { law, tightHoles: true, ease }).d;
  const v142 = draw({ ...COUPE_B, bandSide: undefined, bandH: 4 / 3 }), now = draw({ droop: 0.5, bow: -0.2, ...COUPE_B }, LAWS7.joint, EASE);
  const fig = (d, cap) => `<div style="flex:1;min-width:0"><svg viewBox="-0.4 -0.4 12.8 6.4" style="width:100%;display:block;background:${COL.paper}" aria-hidden="true"><path d="${d}" fill="${N}"/><path d="${SIDE}" transform="translate(${W} 0)" fill="none" stroke="${O}" stroke-width="0.045"/><path d="${SIDE}" transform="translate(12 0) scale(-1 1) translate(${W} 0)" fill="none" stroke="${O}" stroke-width="0.045"/></svg><div style="font-size:16px;line-height:1.35;color:${N};margin-top:6px">${cap}</div></div>`;
  const w0 = bandWall(v142);
  const row = (nm, w, hi) => `<tr style="border-top:1px solid ${COL.hair}${hi ? `;font-weight:700;color:${N}` : ''}"><td style="padding:8px 6px 8px 0">${nm}</td>${['top', 'mid', 'bot'].map(k => `<td style="padding:8px 6px;text-align:right">${w[k].across.toFixed(2)}</td>`).join('')}<td style="padding:8px 0 8px 6px;text-align:right">${w.h.toFixed(2)}</td></tr>`;
  const sets = HOLD.slice(1).map(S => [S.nm.split(':')[0], S.ds]);
  const walls = [['v142 (B as you saw it)', w0, false], ...HOLD.slice(1).map(S => [S.nm.split(':')[0] + ', now', bandWall(S.ds.bar), true])];
  const listRows = ds => [['cafe', 'Kaffeverket', 'CAFÉ'], ['bar', 'Tjoget', 'BAR'], ['museum', 'Vasa Museum', 'MUSEUM'], ['nature', 'Djurgården', 'NATURE']]
    .map(([id, nm, sub]) => `<div style="display:flex;align-items:center;gap:10px;height:56px;background:${COL.paper};padding:0 10px;border-bottom:1px solid ${COL.hair}">${badge(ds[id])}<div style="flex:1;font-size:16px;font-weight:600;line-height:1.15">${nm}<div style="font-size:10.5px;letter-spacing:.08em;font-weight:700;opacity:.72;margin-top:2px">${sub} · STOCKHOLM</div></div></div>`).join('');
  // in the badge: H2's coupe as the set draws it, and the same fitted with a 1px band
  const nowB = HSETS[1].ds.bar, thin = HSETS[1].bar1;
  const inSet = sets.map(([nm, ds]) => phOpt(nm, '', `<div style="display:flex;gap:10px;align-items:center">${BATCH.map(([id]) => badge(ds[id])).join('')}${uiPath(ds.plus, 26.4)}${uiPath(ds.star, 20)}</div><div style="display:flex;gap:18px;align-items:center;margin-top:10px;width:100%"><div style="width:330px">${listRows(ds)}</div>${badge(ds.bar, 150)}</div>`)).join('');
  const kick = t => `<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${I2};text-transform:uppercase;margin:26px 0 8px">${t}</div>`;
  return phBoard('Decided · the coupe', 'The coupe is B, its band redrawn', `${phP('You: "shape wise b is it. but the counter is still wrong both in size and in curvature i\'m getting tired of leaving this feedback!"')}
${kick('Curvature: what was wrong, and the fix')}
${phP(`v142 built the band's sides as a true offset: every point exactly a line from the bowl, measured square to it. But across the band the bowl turns, and a true offset bends tighter than the curve it follows, so its sides leaned in faster than the bowl. Read straight across, the way the eye reads an upright wall, the wall grew from ${w0.top.across.toFixed(2)} at the band's top to ${w0.bot.across.toFixed(2)} at its bottom.`)}
${phP('Now each side of the band <b>is the bowl\'s own curve</b> over the band\'s height, moved in by the line: the same curve, with the same curvature, as the outside. The orange line is the outside moved in by exactly one line (1.5px), drawn over the band at 8x.')}
<div style="display:flex;gap:16px;margin:10px 0 18px">${fig(v142, 'v142: the band\'s sides leave the orange line')}${fig(now, 'Now: the band\'s sides sit on it')}</div>
${kick('The wall beside the band, measured (px)')}
<table style="width:100%;border-collapse:collapse;font-size:17px;line-height:1.3"><tr style="color:${I2};font-size:14px;letter-spacing:.06em;text-transform:uppercase"><td style="padding:4px 6px 4px 0"></td><td style="text-align:right;padding:4px 6px">Top</td><td style="text-align:right;padding:4px 6px">Middle</td><td style="text-align:right;padding:4px 6px">Bottom</td><td style="text-align:right;padding:4px 0 4px 6px">Band</td></tr>${walls.map(([n, w, h]) => row(n, w, h)).join('')}</table>
<div style="font-size:15px;color:${I2};margin-top:6px">Straight across, on the finished outline, 0.2px inside the band's top and bottom edges (clear of its corner rounds). Measured square to the bowl instead (the shortest distance), the trade shows: v142 held ${w0.top.sq.toFixed(2)} / ${w0.mid.sq.toFixed(2)} / ${w0.bot.sq.toFixed(2)}; now ${walls[1][1].top.sq.toFixed(2)} / ${walls[1][1].mid.sq.toFixed(2)} / ${walls[1][1].bot.sq.toFixed(2)}, because the bowl leans in across the band.</div>
${kick('Size: 1 1/6px, under the stroke')}
${phP('A light gap between dark lines reads wider than it measures, so the band is 1 1/6px (was 1 1/3; the stroke is 1.5). It also puts the drink\'s surface back on the 1/3px grid (1.5 + 1 1/6 = 2 2/3). If it should go thinner still, 1px is beside it.')}
<div style="display:flex;gap:28px;align-items:end;margin:8px 0 6px">${[[nowB, '1 1/6 (this)'], [thin, '1']].map(([d, l]) => `<div style="text-align:center"><div style="display:flex;gap:10px;align-items:center">${badge(d)}${badge(d, 72)}${badge(d, 150)}</div><div style="font-size:16px;color:${N};margin-top:6px;font-weight:700">${l}</div></div>`).join('')}</div>
${kick('B in the set, and in the app')}${inSet}
${phDetail('the drawing is picks7 bar with bandSide "shift"; the wall measure is src/band-wall.js.')}`);
}
// g7aa: ONE board, "Between H2 and H3": the coupe question first, then the between row, then the museum's pattern
const { liquid: liquidOf } = require('./liquid.js');
// the wall beside the clear part, at its top, middle and bottom: across (left wall's width on a level line) and
// square (the shortest distance from the clear part's edge to the outside)
function clearWalls(d, sil) {
  const cp = new paperLib.CompoundPath(d), kids = cp.children && cp.children.length ? cp.children : [cp];
  const so = new paperLib.CompoundPath(sil || d), sk = so.children && so.children.length ? so.children : [so];
  const outer = sk.reduce((a, k) => (Math.abs(k.area) > Math.abs(a.area) ? k : a)), b = outer.bounds;
  const xsAt = y => { const ln = new paperLib.Path.Line(new paperLib.Point(b.left - 1, y), new paperLib.Point(b.right + 1, y)); const xs = cp.getIntersections(ln).map(i => i.point.x).sort((p_, q_) => p_ - q_); ln.remove(); return xs; };
  let y0 = null, y1 = null;
  for (let y = b.top + 0.02; y < b.top + b.height * 0.6; y += 0.02) { const n = xsAt(y).length; if (n >= 4 && y0 == null) y0 = y; if (n >= 4) y1 = y; else if (y0 != null) break; }
  const at = y => { const xs = xsAt(y), p = new paperLib.Point(xs[1], y); return { across: xs[1] - xs[0], sq: p.getDistance(outer.getNearestPoint(p)) }; };
  const e = 0.2, r = y0 == null ? null : { top: at(y0 + e), mid: at((y0 + y1) / 2), bot: at(y1 - e), h: y1 - y0 };
  cp.remove(); so.remove(); return r;
}
function sheetBetween() {
  const N = COL.navy, I2 = COL.ink2, S = BETW, SF = BFLIP, H2 = HSETS[1], H3 = HSETS[2];   // H3F: H3 with its saucer flipped
  const kick = t_ => `<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${I2};text-transform:uppercase;margin:30px 0 8px">${t_}</div>`;
  const quote = q => `<div style="margin:6px 0 12px;padding:10px 14px;background:${COL.paper};font-size:17px;line-height:1.4;color:${N}">You: "${q}"</div>`;
  const chip = d => `<svg width="12" height="12" viewBox="6 6 12 12" aria-hidden="true"><path d="${d}" fill="${N}"/></svg>`;
  const x8 = (d, px = 128) => `<svg width="${px}" height="${px}" viewBox="4 4 16 16" style="background:${COL.paper};flex:none" aria-hidden="true"><path d="${d}" fill="${N}"/></svg>`;
  const trio = d => `${chip(d)}${badge(d)}${badge(d, 72)}`;
  const fig = (d, label, px = 150) => `<div style="text-align:center">${x8(d, px)}<div style="display:flex;gap:8px;align-items:center;justify-content:center;margin-top:6px">${trio(d)}</div><div style="font-size:15px;font-weight:700;color:${N};margin-top:4px">${label}</div></div>`;
  const row1 = (d, nm, sub) => `<div style="display:flex;align-items:center;gap:10px;height:56px;background:${COL.paper};padding:0 10px;border-bottom:1px solid ${COL.hair};width:250px;box-sizing:border-box">${badge(d)}<div style="flex:1;font-size:16px;font-weight:600;line-height:1.15">${nm}<div style="font-size:10.5px;letter-spacing:.08em;font-weight:700;opacity:.72;margin-top:2px">${sub} · STOCKHOLM</div></div></div>`;
  const frozen = id => fs.readFileSync(path.join(__dirname, `../svg/g7/before-g7ae/${id}.svg`), 'utf8').match(/ d="([^"]+)"/)[1];
  let BL = {}; try { BL = JSON.parse(fs.readFileSync(path.join(__dirname, '../svg/g7/between/blur.json'), 'utf8')); } catch (e_) {}
  const bl = k => BL[k] ? `${BL[k].mean.toFixed(1)} / ${BL[k].core.toFixed(1)}` : '(not measured)';
  // the side's curvature, rim to bottom: how even it is (the least in the top third over the most anywhere)
  const even = (bk, ln, bx, bd = 5.5, bl_ = 0.25) => { const P_ = [[bl_, 0], [bl_ + ln, bk * bd], [bx, bd], [6, bd]]; let top = 1e9, mx = 0;
    for (let q = 0; q <= 60; q++) { const tt = q / 60, d1 = [0, 1].map(k_ => 3 * (1 - tt) ** 2 * (P_[1][k_] - P_[0][k_]) + 6 * tt * (1 - tt) * (P_[2][k_] - P_[1][k_]) + 3 * tt * tt * (P_[3][k_] - P_[2][k_])), d2 = [0, 1].map(k_ => 6 * (1 - tt) * (P_[2][k_] - 2 * P_[1][k_] + P_[0][k_]) + 6 * tt * (P_[3][k_] - 2 * P_[2][k_] + P_[1][k_]));
      const y = (1 - tt) ** 3 * P_[0][1] + 3 * tt * (1 - tt) ** 2 * P_[1][1] + 3 * tt * tt * (1 - tt) * P_[2][1] + tt ** 3 * P_[3][1], k_ = Math.abs(d1[0] * d2[1] - d1[1] * d2[0]) / Math.hypot(...d1) ** 3; mx = Math.max(mx, k_); if (y < bd / 3) top = Math.min(top, k_); }
    return top / mx; };
  const L0 = liquidOf(HSETS[0].ds.bar, HSETS[0].silBar);
  const opts = COUPE_V.map(([nm, line], k) => { const { d, sil } = S.cv[k], L = liquidOf(d, sil), more = Math.round(100 * (L.liquid / L0.liquid - 1));
    return `<div style="padding:16px 0;border-top:1px solid ${COL.hair}"><div style="font-size:21px;font-weight:700;color:${N}">${k === 0 ? 'Yes: ' : 'Or: '}${nm}</div><div style="font-size:17px;line-height:1.4;color:${I2};margin:4px 0 10px">${line}</div>
<div style="display:flex;gap:14px;align-items:center">${trio(d)}${row1(d, 'Tjoget', 'BAR')}${x8(d)}</div>
<div style="font-size:16px;line-height:1.4;color:${N};margin-top:8px"><b>Drink ${L.liquid.toFixed(1)}px²</b>: ${more >= 0 ? `${more}% more than` : `${-more}% less than`} v134's ${L0.liquid.toFixed(1)}.</div></div>`; }).join('');
  const setRow = (R, label) => `<div style="padding:14px 0;border-top:1px solid ${COL.hair}"><div style="font-size:19px;font-weight:700;color:${N};margin-bottom:8px">${label}</div><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">${BATCH.map(([id]) => badge(R.ds[id])).join('')}${uiPath(R.ds.plus, 26.4)}${uiPath(R.ds.star, 20)}<span style="width:10px"></span>${BATCH.map(([id]) => badge(R.ds[id], 72)).join('')}</div></div>`;
  const appRows = R => [['cafe', 'Kaffeverket', 'CAFÉ'], ['bar', 'Tjoget', 'BAR'], ['museum', 'Vasa Museum', 'MUSEUM'], ['nature', 'Djurgården', 'NATURE']].map(([id, nm, sub]) => row1(R.ds[id], nm, sub)).join('');
  // g7aj (director, turn 114: "One rules table for this row, every rule with its per-icon effect"): the one table for
  // the tuned row, H3 and Between beside it, replacing the tuned table and the Between-vs-H3 table
  const SAME = 'the same';
  const RULES = [
    ['Plates and feet', 'domes on top, a line high, ends to a point: the saucer and the foot', 'slabs whose top rises 1/2px (or, flipped, whose underside drops 1/2px)', '<b>What a thing sits on is flat on top, its dome underneath</b> (the saucer). <b>What rises into a stem domes up to meet it</b> (the coupe\'s foot). What stands on the ground is flat.', 'Cup: the saucer flat on top, H3\'s dome under it. Coupe: H3\'s domed foot. Museum, tree: flat on the ground. Open: this split is your call ("not foot"); a new thing that sits on a table follows the first half.'],
    ['Vessel sides', 'the side drops upright under the rim, then turns (its least curvature 17% of its peak)', 'the side\'s curve more even (38%)', 'Between\'s, now a rule every row takes (picks7 VESSEL_SIDE)', 'Coupe: the side\'s curve is more even, but the change is slight: the rim\'s eased corner still meets the side upright, here and in Between. If you still see the sides as straight, that corner rule is the cause, and changing it would change every icon. Cup: its walls are drawn straight, a line into one curve (44%), so nothing changes. Every drawn curve checked (src/curve-even.js). Flagged, not changed: the saucer\'s underside and the foot\'s top run flat across the middle (2%, 5%); a dome a line deep across 11px can\'t be one even curve without becoming a pointed lens.'],
    ['Flares (a post into the mass it meets)', '1 1/2px', '1/2px', '1/2px', 'Coupe: the stem meets bowl and foot with 1/2px (H3: 1.28, capped by its edges). Tree: the trunk meets its tier with 1/2px (H3: 1.06). Cup: none (its handle\'s joins are counter corners, always tight). Museum: none (its columns stand between slots). + and star: none (line marks never flare).'],
    ['Free posts (a post that holds a mass up on its own)', '1 1/2px', '1 1/4px', '1 1/4px', 'Coupe: the stem. Tree: the trunk. The museum\'s columns stand between slots and the + holds nothing up, so they stay 1 1/2. Cost: monoweight\'s one exception.'],
    ['Acute tips', '0.35 everywhere', 'a share of the tip\'s shorter edge, 0.35 at most', SAME, 'Tree: 0.35 / 0.22 / 0.15, bottom to top; its point 0.35. Star: its edges are long, so its tips stay 0.35. Cup, coupe, museum, +: no acute tips.'],
    ['Line ends', 'a fifth of the line\'s width, 0.3 at most', SAME, SAME, '0.3 on a 1 1/2px line and on the marks (the plinth, the + arms); 0.25 on a 1 1/4px post (the trunk\'s foot).'],
    ['The coupe\'s rim and drink', 'a bar across the rim, a clear band (1 1/6px) under it', 'the open glass (your liquid question, part 1)', 'H3\'s', 'Coupe only; waits on your liquid pick.'],
    ['The museum\'s size', 'by its class', 'by its class; two options in part 3', 'by its class', 'Museum only; waits on your pick in part 3.'],
  ];
  const rowRules = () => `<table style="width:100%;border-collapse:collapse;font-size:15px;line-height:1.35;margin:6px 0 10px"><tr style="color:${I2};font-size:13px;letter-spacing:.06em;text-transform:uppercase"><td style="padding:4px 8px 4px 0;width:21%">Rule</td><td style="padding:4px 8px;width:21%">H3</td><td style="padding:4px 8px;width:21%">Between</td><td style="padding:4px 0 4px 8px">This row</td></tr>${RULES.map(([a, b, c, d, e]) => `<tr style="border-top:1px solid ${COL.hair};vertical-align:top"><td style="padding:8px 8px 2px 0;font-weight:600;color:${N}">${a}</td><td style="padding:8px 8px 2px;color:${I2}">${b}</td><td style="padding:8px 8px 2px;color:${I2}">${c}</td><td style="padding:8px 0 2px 8px;color:${N}">${d}</td></tr><tr style="vertical-align:top"><td></td><td colspan="3" style="padding:2px 0 10px 8px;color:${N}"><b>Here:</b> ${e}</td></tr>`).join('')}<tr style="border-top:1px solid ${COL.hair}"><td colspan="4" style="padding:8px 0;color:${N}"><b>The same in all three:</b> outside corners of a mass 0.6, eased; counters and slots tight, 0.15; the tree\'s tiers sweep in 1/5px and droop 1/2px.</td></tr></table>`;
  // g7ak: the rules that carry the fixed coupe and tree to every icon
  const LB = liquidOf(H3T.ds.bar, H3T.silBar), LA = liquidOf(R2.ds.bar, R2.silBar);
  const R2RULES = [
    ['Plates', 'H3\'s dome turned under: ends thin to a point', 'A plate departs from flat by 1/2px at the centre, so its ends stay 1px (2/3 of the line). What a thing sits on curves underneath, flat on top.', 'Cup: the saucer. The coupe\'s foot: see the question below. Museum, tree: they stand on the ground, flat (unchanged).'],
    ['Posts', '1 1/4px for a free post; the columns exempt', 'Every post that holds a mass up is 1 1/4px, columns included.', 'Museum: the four columns, so each opening is 1/3px wider (the outside edges stay). Coupe stem, trunk: already. +: holds nothing up, 1 1/2.'],
    ['Resting parts', '(no rule; the cup was cut from its saucer by the 1px cut)', 'A load set on separate supports is cut from them by the 1px cut: the cup on its saucer, a roof on its beam. Parts made as one piece (a glass, a tree, a colonnade with its beam and base) join. Limits: at most one cut per icon; both parts read whole on their own; the cut never shortens the supports (its room comes from the load).', 'Museum: the gable rests on the beam across the cut; beam, columns and base are one piece; the columns are full height. Cup: as it was. Coupe, tree: one piece each, unchanged.'],
    ['Joins (a post into what it holds and stands on)', '(no rule for buildings: only free posts flared)', 'Where an outer post meets the mass it holds up or stands on, it flares 1/2px into it on the outside, as the coupe\'s stem meets its bowl and foot; past the post that mass thins to a 1px end (the plate rule). An opening is a counter: it stays square, no flare inside.', 'Museum: the outer columns flare into the beam and the plinth (capital and base). Coupe stem, trunk: as they were. A future hotel: its corner walls flare into cornice and base, windows square; a landmark or venue on posts: the same at its outer posts.'],
    ['Straight-lined buildings', '(no rule)', 'A building\'s walls, beams and roof slopes stay straight; sweep and droop are for living things. The 1/2px a plate rule gives a base and a vessel\'s curved side are not touched by this.', 'Museum: the pediment stays straight. Tree: keeps its sweep and droop.'],
    ['The clear band under a rim', '7/6px', '5/6px, so the drink\'s surface sits on the next 1/3px lattice line up. Still under the line, as you asked ("equal to the thickness of the stroke. or maybe even a little thinner").', 'Coupe only. 1px was tried: at 24px it didn\'t show.'],
  ];
  const r2Rules = () => `<table style="width:100%;border-collapse:collapse;font-size:15px;line-height:1.35;margin:6px 0 10px"><tr style="color:${I2};font-size:13px;letter-spacing:.06em;text-transform:uppercase"><td style="padding:4px 8px 4px 0;width:16%">Rule</td><td style="padding:4px 8px;width:24%">Was</td><td style="padding:4px 0 4px 8px">Now</td></tr>${R2RULES.map(([a, b, c, e]) => `<tr style="border-top:1px solid ${COL.hair};vertical-align:top"><td style="padding:8px 8px 2px 0;font-weight:600;color:${N}">${a}</td><td style="padding:8px 8px 2px;color:${I2}">${b}</td><td style="padding:8px 0 2px 8px;color:${N}">${c}</td></tr><tr style="vertical-align:top"><td></td><td colspan="2" style="padding:2px 0 10px 8px;color:${N}"><b>Here:</b> ${e}</td></tr>`).join('')}<tr style="border-top:1px solid ${COL.hair}"><td colspan="3" style="padding:8px 0;color:${N}"><b>Unchanged:</b> line ends, tips by their edge, flares 1/2px, mass corners 0.6, the vessel side, the tree\'s sweep and droop. The + and the star: nothing in these rules acts on them.</td></tr></table>`;
  const musRows = [['H2\'s museum (the base)', 'As H2 drew it: four columns, a beam, a straight roof, a plinth. Every approach below starts from it.', S.ds.museum, 'museum'], ...MUSEUM_V.map(([nm, line], k) => [nm, line, S.mus[k], `museum-${k + 1}`])]
    .map(([nm, line, d, key]) => `<div style="padding:16px 0;border-top:1px solid ${COL.hair}"><div style="font-size:21px;font-weight:700;color:${N}">${nm}</div><div style="font-size:17px;line-height:1.4;color:${I2};margin:4px 0 10px">${line}</div><div style="display:flex;gap:14px;align-items:center"><div style="display:flex;gap:6px;align-items:center;padding:8px;background:${COL.paper}">${badge(S.ds.cafe)}${badge(S.ds.bar)}${badge(d)}${badge(S.ds.nature)}</div>${chip(d)}${badge(S.ds.cafe, 72)}${badge(S.ds.bar, 72)}${badge(d, 72)}${badge(S.ds.nature, 72)}</div><div style="margin-top:10px">${x8(d)}</div><div style="font-size:16px;color:${N};margin-top:8px">Weight (blurred darkness, overall / darkest fifth): <b>${bl(key)}</b>; the cup ${bl('cafe')}, the coupe ${bl('bar')}, the tree ${bl('nature')}.</div></div>`).join('');
  return phBoard('Waiting on you', 'Between H2 and H3', `${phP('Your earlier notes on this board (the coupe options, H2 / Between / H3, the tuned row and its table) are on the Archive page, as v217.')}
${kick('1 · The coupe and the tree are fixed: rules for the rest')}
${quote('youre missing my point -- the between tree is perfect. what changes need to happen to h2 to make that tree fit in')}
${quote('in "after: rules tuned to the tree" "coup, after" and "tree, after" are perfect ... but the glass being on something so rounded as a plate feels off and the museum feels completely disconnected. so what rules do we need to establish to fix that.')}
${quote('i will say "coupe after" needs slightly more drink — still feels sliiiightly too empty')}
${phP('<b>Five rules, each a value for every icon.</b> The tree follows all of them and comes out byte-identical; the coupe changes only in its drink.')}
${r2Rules()}
${setRow(H3T, 'Before: rules tuned to the tree')}${setRow(R2, 'After: the plate rule on the cup\'s saucer')}${setRow(R2B, 'After: the plate rule on the coupe\'s foot too')}
${phQ('"The glass being on something so rounded as a plate": which did you mean, the cup on its saucer, or the coupe on its foot?')}
<div style="display:flex;gap:12px;justify-content:space-between;margin:14px 0">${fig(H3T.ds.cafe, 'Saucer, before', 128)}${fig(R2.ds.cafe, 'Saucer, plate rule', 128)}${fig(H3T.ds.bar, 'Coupe, after', 128)}${fig(R2B.ds.bar, 'Foot, plate rule', 128)}</div>
${phP('Under the plate rule the foot keeps its curve on top, where the stem rises out of it, but only 1/2px, so its ends stay 1px instead of thinning to a point. Everything else in that coupe is "Coupe, after" with the new drink. The saucer takes the rule in both rows.')}
${kick('The drink')}
<div style="display:flex;gap:12px;justify-content:flex-start;margin:14px 0">${fig(H3T.ds.bar, 'Coupe, after (band 7/6)', 128)}${fig(R2.ds.bar, 'More drink (band 5/6)', 128)}</div>
${phP(`${LB.liquid.toFixed(1)}px² → ${LA.liquid.toFixed(1)}px² of drink, the surface 1/3px higher. Nothing else in the coupe changed.`)}
${kick('The museum: building the flaring in')}
${quote("When I say connected I mean to the systemic approach. I like the separated gable … it's the flaring effects that the museum and other structures like it aren't going to naturally make. How might we build some of that in?")}
${phP('<b>The rule: Joins</b> (in the table above). The coupe\'s flaring is where its stem meets its bowl and foot. A building has the same meeting: its outer posts meet the beam they hold and the base they stand on. Joins flares them there, on the outside, as the stem does; the openings stay square. The museum in the row now takes it.')}
${phP('<b>Your separated gable</b> rests on the beam across the 1px cut; the beam is back and the columns keep their full height. The gable has its body back: its ends are 1px (they were 0.43 in v220, a sliver). <b>Where the room came from:</b> the class. With the gable set on its beam the temple is as tall as it is wide, so the grid fits it to the square class (the coupe\'s), not the wide one; that gives it the height for the gable\'s ends. The pitch is kept and the columns are as tall as before.')}
<div style="display:flex;gap:12px;justify-content:space-between;margin:14px 0">${fig(R2.mus2[2], 'v220: gable ends 0.43', 128)}${fig(R2.mus2[0], 'Gable with its body', 128)}${fig(R2.ds.museum, 'With Joins (the row)', 128)}</div>
${phP(`<b>At true size</b> the flared outer posts read as a capital and a base in the 24 badge; at the 12px chip they are under a pixel and the cut greys to half a pixel, so there it reads as a roof over a colonnade. Weight (blurred, overall / darkest fifth): ${bl('museum-r2')}; the cup ${bl('cafe-r2')}, the coupe ${bl('bar-r2')}, the tree ${bl('nature-r2')}. The solid gable makes it about 3 points heavier than the cup (v220's thin gable was level); your open v207 pick, "sized by its weight", is the rule that would level it. Not used, on the Archive page with v220: a sweep at the foot (it read as a trapezoid or a furniture foot), and a roof that hangs like a tier (it read as a pagoda, and breaks Straight-lined buildings).`)}
${phQ('Does Joins connect the museum to the coupe and the tree for you?')}
<div style="display:flex;gap:18px;align-items:center;margin:8px 0"><div>${appRows(R2)}</div></div>
${phDetail('the drawings are picks7 (plate, colW; the museum: structMuseum with cap and foot; class SQUARE); the measures are src/liquid.js and src/blur-between.js.')}`);
}
// (g7y: the tree's decision folded into the human direction; its board is archived)
// g7z (owner: "give me a board with the original icons next to the newest version of icon in order of what we're
// actually making"), reordered by the order of work, originals only: the 10-13 inventory renders (inventory-png, cut
// and stored at 6x by originals.json), the newest from the shipped set (Now, v134)
const ORIG = JSON.parse(fs.readFileSync(path.join(__dirname, '../svg/g7/originals.json'), 'utf8'));
function sheetOriginals() {
  const N = COL.navy, I2 = COL.ink2, ds = HSETS[0].ds, MAXL = 3, ROOM = 128;
  const img = (k, sc = 1) => { const o = ORIG[k]; return `<img src="${o.uri}" width="${f2(o.w * sc)}" height="${f2(o.h * sc)}" alt="" style="display:block;flex:none">`; };
  const none = `<div style="font-size:16px;line-height:1.25;color:${I2};text-align:center;padding:0 4px">none</div>`;
  const dash = `<div style="font-size:18px;color:${I2}" aria-label="none">–</div>`;
  // the newest, at scale sc, each on the box the app gives it (the badge 24 in a 30 cell, the + on its 60px Float badge, the star 20)
  const P = id => sc => badge(ds[id], 24 * sc);
  // the coupe he picked: B with its band redrawn (COUPE_B, 1 1/6px), fitted and centred exactly as the monoweight set
  // fits every place (HSETS[0]: the joint law, no easing), so it sits in the same set as the other five
  const barB = (() => {
    const opts = { law: LAWS7.joint, tightHoles: true }, [cls, apex] = CLASS.bar, kw = KEY[cls][0], bh = KEY[cls][1] + apex, dr = sz => DRAW.bar(sz, { style: 'mono', ...COUPE_B });
    let sz = 12; for (let k = 0; k < 6; k++) { const b = measure(E.build(dr(sz), opts).d).box; sz *= Math.min(kw / (b.x1 - b.x0), bh / (b.y1 - b.y0)); }
    const ox = (24 - sz) / 2, oy = r3((24 - sz) / 2), prims = dr(sz), m = measure(E.build(E.xform(prims, 1, 0, 0, ox, oy), opts).d);
    return E.build(E.xform(prims, 1, 0, 0, ox + r4(12 - (m.box.cx + m.cx) / 2), oy + r3(12 - (m.box.cy + m.cy) / 2)), opts).d;
  })();
  const plusNew = sc => plusBadge(uiPath(ds.plus, 26.4 * sc), 60 * sc);
  const starNew = sc => uiPath(ds.star, 20 * sc);
  const B1 = 'Drawn (batch 1)', ND = 'Not drawn yet', NEW = 'New since the original';
  // [name, original: originals.json keys (null: none), newest: (scale) => html (null: not drawn), status, note]
  // the order of work (owner: "please order this in order of how we are attacking them")
  const rows = [
    ['Batch 1 · drawn', 'The first six, drawn to the grid and in review now.'],
    ['Café', ['badge-cafe'], P('cafe'), `${B1} · cup and saucer`],
    ['Bar', ['badge-bar'], sc => badge(barB, 24 * sc), `${B1} · the coupe: B, the flatter bowl`, 'Your pick, with its band redrawn at 1 1/6px (board: The coupe is B)'],
    ['Museum', null, P('museum'), `${B1} · column front`, 'New category: there was no icon'],
    ['Nature', ['badge-nature'], P('nature'), `${B1} · conifer`],
    ['+ (add a place)', ['ctl-add'], plusNew, `${B1} · lines 1 2/3px`, 'Original: the navy + button. Newest: on the orange Float badge it moved to'],
    ['Star', ['g-star-open', 'g-star'], starNew, `${B1} · lines 1 2/3px`, 'Original: empty and starred. Newest: the outline; the starred fill comes later'],
    ['Batch 2 · next · not drawn yet', 'The eight subjects already tested on the grid (the batch 2 pressure test on the main board). That test sets no order inside the batch, so this one is a proposal: first the three that need a new root shape (the knife\'s blade; the block, in the bag and the city blocks), then the five that fit the roots we have.'],
    ['Restaurant', ['badge-restaurant'], null, `${ND} · pick: fork and knife`, 'New root to test: the blade'],
    ['Shopping', ['badge-shopping'], null, `${ND} · pick: bag`, 'New root to test: the block'],
    ['Neighbourhood', ['badge-district'], null, `${ND} · pick: city blocks`, 'The block again. The original is called District'],
    ['Hotel', ['badge-hotel'], null, `${ND} · pick: bed`],
    ['Park', null, null, `${ND} · pick: park bench`, 'New category: there was no icon'],
    ['Venue', null, null, `${ND} · pick: the curtain`, 'New category: there was no icon'],
    ['Landmark', null, null, `${ND} · pick: the ⌘ loop`, 'New category: there was no icon'],
    ['Attraction', ['badge-attraction'], null, `${ND} · pick: Ferris wheel`],
    ['After batch 2 · not drawn yet', 'The last place-type icon.'],
    ['Street', ['badge-street'], null, `${ND} · pick: walker`],
    ['Then the controls · not drawn yet', 'In the inventory\'s order.'],
    ['Account', ['ctl-account'], null, ND, 'Original: the account button'],
    ['Close the add form ×', ['ctl-add-open'], null, ND, 'Original: the + button, turned to ×'],
    ['Sort', ['ctl-sort'], null, ND],
    ['Filters', ['ctl-filters'], null, ND],
    ['Locate', ['ctl-locate'], null, ND],
    ['Close the tag ×', ['tag-x'], null, ND],
    ['Directions', ['tag-directions'], null, ND, 'On the place tag'],
    ['Mark visited ✓', ['tag-ochk'], null, ND, 'On the place tag, before the stamp'],
    ['Empty list', ['empty-compass'], null, ND, 'Original: the Directions compass, greyed'],
    ['Tick (the current choice)', ['sort-check', 'plan-check'], null, ND, 'Original: the sort menu\'s and the plan list\'s, one drawing'],
    ['New plan +', ['plan-plus'], null, ND],
    ['More (···)', ['plan-more'], null, ND, 'Original: the plan list\'s rename and delete'],
    ['Menu chevron', ['plan-chev'], null, ND, 'Original: the plan picker\'s'],
    ['Zoom + / −', ['ctl-zoom'], null, ND, 'Original: Leaflet\'s own text buttons'],
    ['Lower the list', ['ctl-collapse'], null, ND, 'Original: a text character'],
    ['Row delete ×', ['ctl-delete'], null, ND, 'Original: a text character'],
    ['Remove from plan ×', ['plan-x'], null, ND, 'Original: a text character'],
    ['Add to plan +', ['plan-add'], null, ND, 'Original: the × character, turned'],
    ['Right chevron', null, null, `${ND} · ${NEW}`, 'In the app now on menu rows and plan rows'],
    ['A city / All places', null, null, `${ND} · ${NEW}`, 'In the app now in the list-title menu (a ring)'],
    ['Plans', null, null, `${ND} · ${NEW}`, 'In the app now in the list-title menu and the Plans list (a route)'],
    ['Show / hide a city', null, null, `${ND} · ${NEW}`, 'In the app now on a city\'s header in the list (an eye)'],
    ['Last, once the set is done', 'Owner: "Home Screen icon will also need to feel naturally part of the family".'],
    ['Home-screen icon', ['home'], null, ND, 'Original: the apple-touch-icon, at 60px'],
  ];
  // the larger view: one scale per row for today AND the newest (3x, or less where today's render is wide)
  const scaleOf = today => { if (!today) return MAXL; const w = today.reduce((a, k) => a + ORIG[k].w, 0) + 6 * (today.length - 1), h = Math.max(...today.map(k => ORIG[k].h)); return Math.min(MAXL, Math.floor(ROOM / Math.max(w, h) * 2) / 2); };   // half steps, so the label reads plainly
  // compact (the board must sit inside its canvas row): the words on the left, the four views on the right in one line
  const CW = [72, 72, 128, 128], TXT = 236;
  const cell = (inner, w, bg, minH) => `<div style="width:${w}px;min-height:${minH}px;display:flex;gap:4px;align-items:center;justify-content:center;flex:none;background:${bg || 'transparent'};border-radius:4px;box-shadow:inset 0 0 0 1px ${COL.hair}">${inner}</div>`;
  const heads = `<div style="display:flex;gap:12px;align-items:end;margin:0 0 6px;padding-left:${TXT + 12}px;font-size:15px;line-height:1.2;font-weight:700;color:${I2}">${['Original', 'Newest', 'Original, larger', 'Newest, larger'].map((t, k) => `<div style="width:${CW[k]}px;flex:none">${t}</div>`).join('')}</div>`;
  const words = (nm, status, note, drawn, extra = '') => `<div style="width:${TXT}px;flex:none"><div style="font-size:21px;font-weight:700;color:${N};line-height:1.2"><span style="color:${I2};font-weight:600">${n}.</span> ${nm}</div>
<div style="font-size:17px;line-height:1.3;margin-top:3px;color:${drawn ? COL.ord : I2};font-weight:${drawn ? 700 : 500}">${status}</div>${note ? `<div style="font-size:17px;line-height:1.3;color:${I2};margin-top:2px">${note}</div>` : ''}${extra}</div>`;
  let n = 0;
  const body = rows.map(([nm, today, nw, status, note]) => {
    if (status === undefined) return `<div style="margin:34px 0 10px"><div style="font-size:17px;letter-spacing:.1em;font-weight:700;color:${COL.ord};text-transform:uppercase">${nm}</div>${today ? `<div style="font-size:17px;line-height:1.4;color:${I2};margin-top:4px">${today}</div>` : ''}</div>${heads}`;
    n++;
    if (!today && !nw) return `<div style="display:flex;gap:12px;align-items:center;padding:12px 0;border-top:1px solid ${COL.hair}">${words(nm, status, note, false)}<div style="font-size:17px;line-height:1.35;color:${I2}">No original and nothing drawn yet.</div></div>`;
    const sc = scaleOf(today), bg = today ? ORIG[today[0]].bg : COL.paper, drawn = status.startsWith(B1);
    const t1 = today ? today.map(k => img(k)).join('') : dash, tL = today ? today.map(k => img(k, sc)).join('') : none;
    const n1 = nw ? nw(1) : dash, nL = nw ? nw(sc) : `<div style="font-size:16px;color:${I2};text-align:center">not drawn yet</div>`;
    const hL = Math.max(64, Math.round(Math.max(today ? Math.max(...today.map(k => ORIG[k].h)) : 30, nm.startsWith('+') ? 64 : 0) * sc) + 14);
    const h1 = Math.max(64, Math.round(Math.max(today ? Math.max(...today.map(k => ORIG[k].h)) : 30, nm.startsWith('+') ? 64 : 0)) + 10);
    return `<div style="display:flex;gap:12px;align-items:center;padding:12px 0;border-top:1px solid ${COL.hair}">${words(nm, status, note, drawn, `<div style="font-size:17px;color:${I2};margin-top:2px">Larger: ${sc}x</div>`)}
${cell(t1, CW[0], bg, h1)}${cell(n1, CW[1], bg, h1)}${cell(tL, CW[2], bg, hL)}${cell(nL, CW[3], bg, hL)}</div>`;
  }).join('');
  const count = rows.filter(r => r[3] !== undefined && !r[3].endsWith(NEW)), drawnN = count.filter(r => r[3].startsWith(B1)).length;
  return phBoard('In progress', 'Every icon: original and newest', `${phP('You: "give me a board with the original icons next to the newest version of icon in order of what we\'re actually making", then "please order this in order of how we are attacking them" and "i want original and newest".')}
${phP('One row per icon, in the order we\'re working on them. <b>Original</b> is the icon as it was when this project started, from the 10-13 inventory ("Every icon today", in its colours). <b>Newest</b> is the latest drawing: the set as it stands (monoweight, the coupe B with its band redrawn, the + and the star at 1 2/3px), in navy; colour comes later. The first pair is true size; the larger pair is the same scale for both (the row says which).')}
<div style="margin:6px 0 4px;font-size:20px;line-height:1.4;color:${N}"><b>${drawnN} of ${count.length} drawn</b>: café, bar, museum, nature, the + and the star. Four controls are new since the original and are counted on their own.</div>
${body}
<div style="margin-top:26px;font-size:17px;line-height:1.45;color:${I2}"><b style="color:${N}">Not listed:</b> Area and Other are gone (the locked list). The visited stamp and sticker, clusters, plan stop numbers, you-are-here and the tag's anchor dot stay as they are. The filter chips use the place icons. Leaflet's attribution flag isn't ours.</div>`);
}
function sheetMaster() {
  const N = COL.navy, O = COL.or, H = COL.hair, I2 = COL.ink2, PA = COL.paper;
  const lab = (x, y, t, o = {}) => `<text x="${f2(x)}" y="${f2(y)}" font-family="Archivo, Arial, sans-serif" font-size="${o.fs || 0.55}" font-weight="${o.fw || 700}" fill="${o.fill || I2}" text-anchor="${o.a || 'start'}">${t}</text>`;
  const title = t => `<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${I2};text-transform:uppercase;margin:0 0 14px">${t}</div>`;
  const cap = t => `<div style="font-size:15px;line-height:1.35;color:${I2};margin-top:8px;text-align:center">${t}</div>`;
  const panel = (inner, w) => `<div style="width:${w}px">${inner}</div>`;
  // 1. THE BADGE: ring, air, live circle, the 12px box (the token), guides, the 1px grid and the 1/3px lattice
  const S = 30;   // px per unit
  let g = `<rect x="0" y="0" width="24" height="24" fill="${COL.raised}"/>`;
  for (let i = 1; i < 72; i++) if (i % 3) g += `<line x1="${f2(i / 3)}" y1="0" x2="${f2(i / 3)}" y2="24" stroke="${H}" stroke-width="0.01" opacity=".6"/><line x1="0" y1="${f2(i / 3)}" x2="24" y2="${f2(i / 3)}" stroke="${H}" stroke-width="0.01" opacity=".6"/>`;
  for (let i = 1; i < 24; i++) g += `<line x1="${i}" y1="0" x2="${i}" y2="24" stroke="${H}" stroke-width="0.03"/><line x1="0" y1="${i}" x2="24" y2="${i}" stroke="${H}" stroke-width="0.03"/>`;
  g += `<circle cx="12" cy="12" r="11.25" fill="none" stroke="${N}" stroke-width="1.5"/>`;
  g += `<circle cx="12" cy="12" r="10.5" fill="none" stroke="${O}" stroke-width="0.04" stroke-dasharray="0.25 0.2"/>`;      // ring's inner edge
  g += `<circle cx="12" cy="12" r="8" fill="none" stroke="${N}" stroke-width="0.05" stroke-dasharray="0.4 0.25"/>`;         // live circle
  g += `<circle cx="12" cy="12" r="6" fill="none" stroke="${O}" stroke-width="0.07"/>`;                                     // the coin
  g += `<rect x="6" y="6" width="12" height="12" fill="none" stroke="${N}" stroke-width="0.05"/>`;                          // the 12px box
  g += `<line x1="6" y1="12" x2="18" y2="12" stroke="${O}" stroke-width="0.03"/><line x1="12" y1="6" x2="12" y2="18" stroke="${O}" stroke-width="0.03"/>`;
  g += `<line x1="4.5" y1="6" x2="19.5" y2="6" stroke="${N}" stroke-width="0.03" stroke-dasharray="0.3 0.2"/><line x1="4.5" y1="18" x2="19.5" y2="18" stroke="${N}" stroke-width="0.03" stroke-dasharray="0.3 0.2"/><line x1="4.5" y1="5.5" x2="19.5" y2="5.5" stroke="${O}" stroke-width="0.03" stroke-dasharray="0.15 0.15"/>`;
  g += lab(19.7, 6.2, 'TOP', { fs: 0.42 }) + lab(19.7, 18.2, 'BASE', { fs: 0.42 }) + lab(19.7, 5.45, 'APEX +1/2', { fs: 0.42, fill: O }) + lab(19.7, 12.15, 'MIDDLE', { fs: 0.42, fill: O });
  g += lab(12, 3.15, '2PX OF AIR', { a: 'middle', fs: 0.42 }) + lab(12, 5.25, 'LIVE CIRCLE Ø16', { a: 'middle', fs: 0.42 }) + lab(12, 7.05, 'THE COIN Ø12 · THE BOX 12', { a: 'middle', fs: 0.42, fill: O });
  const badgeFig = `<svg width="${24 * S}" height="${24 * S}" viewBox="0 0 24 24" aria-hidden="true">${g}</svg>`;
  // 2. THE TOKEN: every class is a cut with the coin's area (drawn at 8x, coin in grey, cut in orange)
  const C8 = 10, cutFig = (cls, inner) => `<svg width="${16 * C8}" height="${16 * C8}" viewBox="4 4 16 16" aria-hidden="true"><rect x="4" y="4" width="16" height="16" fill="${COL.raised}"/><circle cx="12" cy="12" r="6" fill="none" stroke="${H}" stroke-width="0.12"/>${inner}</svg>`;
  const ok = `fill="${O}" fill-opacity=".14" stroke="${O}" stroke-width="0.12"`;
  const rectCut = ([w, h], apex) => `<rect x="${f2(12 - w / 2)}" y="${f2(12 - h / 2)}" width="${f2(w)}" height="${f2(h)}" ${ok}/>` + (apex ? `<line x1="10" y1="${f2(12 - h / 2 - apex)}" x2="14" y2="${f2(12 - h / 2 - apex)}" stroke="${O}" stroke-width="0.12" stroke-dasharray="0.3 0.2"/>` : '');
  const sR = starRc(LINEW), pent = [...Array(5)].map((_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / 5, r = sR + (LINEW / 2) / Math.sin(Math.PI / 10); return `${f2(12 + r * Math.cos(a))},${f2(12 + r * Math.sin(a))}`; }).join(' ');
  const holeR = P7.STAR.ri * sR - (LINEW / 2) / Math.sin(3 * Math.PI / 10);
  const token = [
    ['Wide', cutFig('WIDE', rectCut(KEY.WIDE)), `${fr(KEY.WIDE[0])} × ${fr(KEY.WIDE[1])}`, 'cup, museum'],
    ['Square', cutFig('SQUARE', rectCut(KEY.SQUARE)), `${fr(KEY.SQUARE[0])}`, 'coupe'],
    ['Tall', cutFig('TALL', rectCut(KEY.TALL, APEX)), `${fr(KEY.TALL[0])} × ${fr(KEY.TALL[1])} · apex +1/2`, 'tree'],
    ['Round', cutFig('ROUND', `<circle cx="12" cy="12" r="6" ${ok}/>`), 'Ø12', 'radial marks'],
    ['Outline', cutFig('OUTLINE', `<polygon points="${pent}" ${ok}/><circle cx="12" cy="12" r="${f2(holeR)}" fill="none" stroke="${N}" stroke-width="0.12"/>`), 'hull ≥ coin · hole ≥ 4px · line 1 2/3', 'star'],
    ['Open', cutFig('OPEN', `<rect x="${12 - W / 2}" y="6" width="${W}" height="12" ${ok}/><rect x="6" y="${12 - W / 2}" width="12" height="${W}" ${ok}/>`), 'arms span 12 · every line 1 2/3', '+'],
  ].map(([n, fig, dims, who]) => `<div style="display:flex;flex-direction:column;align-items:center">${fig}<div style="font-size:18px;font-weight:700;color:${N};margin-top:8px">${n}</div><div style="font-size:14px;color:${I2};text-align:center">${dims}</div><div style="font-size:14px;color:${I2};text-align:center;font-style:italic">${who}</div></div>`).join('');
  // 2b. FITTING (g7q): the whole drawing is fitted, never a part; its widest or tallest part meets the cut
  const FIT8 = 10, fitFig = id => {
    const d = GD.joint[12][id].d, b = measure(d).box, [cls, apex] = CLASS[id], [kw, kh] = KEY[cls];
    const dx = 12 - (b.x0 + b.x1) / 2, dy = 12 - (b.y0 + b.y1) / 2 + apex / 2;
    const fitsW = Math.abs((b.x1 - b.x0) - kw) <= 1 / 6 + 1e-3, fitsH = Math.abs((b.y1 - b.y0) - kh - apex) <= 1 / 6 + 1e-3;
    const svg = `<svg width="${16 * FIT8}" height="${16 * FIT8}" viewBox="4 4 16 16" aria-hidden="true"><rect x="4" y="4" width="16" height="16" fill="${COL.raised}"/><circle cx="12" cy="12" r="6" fill="none" stroke="${H}" stroke-width="0.12"/>${rectCut(KEY[cls], apex)}<path d="${d}" transform="translate(${f2(dx)} ${f2(dy)})" fill="${N}"/></svg>`;
    const part = { cafe: ['the saucer', 'cup top to saucer'], bar: ['the rim', 'rim to foot'], museum: ['the plinth', 'apex to plinth'], nature: ['the bottom tier', 'tip to trunk'] }[id];
    const what = fitsW ? `${part[0]} meets the sides` : `${part[1]} meets top and base`;
    return `<div style="display:flex;flex-direction:column;align-items:center">${svg}<div style="font-size:18px;font-weight:700;color:${N};margin-top:8px">${({ cafe: 'Café', bar: 'Bar', museum: 'Museum', nature: 'Nature' })[id]}</div><div style="font-size:14px;color:${I2};text-align:center">${what}</div><div style="font-size:14px;color:${I2};text-align:center">${(b.x1 - b.x0).toFixed(2)} × ${(b.y1 - b.y0).toFixed(2)} in a ${fr(kw)} × ${fr(kh)}${apex ? ' +1/2' : ''} cut${fitsW || fitsH ? '' : ' (!)'}</div></div>`;
  };
  const fitRow = ['cafe', 'bar', 'museum', 'nature'].map(fitFig).join('');
  // 3. ROOT SHAPES, drawn generic from the same helpers as the icons, at 10x, with their dimensions
  const R10 = 10, root = (prims, vb, nm, dim) => { const d = E.build(prims, { law: LAWS7.joint }).d; return `<div style="display:flex;flex-direction:column;align-items:center"><svg width="${vb[2] * R10}" height="${vb[3] * R10}" viewBox="${vb.join(' ')}" aria-hidden="true"><path d="${d}" fill="${N}"/></svg><div style="font-size:18px;font-weight:700;color:${N};margin-top:8px">${nm}</div><div style="font-size:14px;color:${I2};text-align:center">${dim}</div></div>`; };
  const cupPr = DRAW.cafe(12), barPr = DRAW.bar(12);
  const roots = [
    root([E.R(0, 0, 9, W)], [-0.5, -0.5, 10, W + 1], 'Slab', 'every base and span · 1.5 thick'),
    root([E.R(0, 0, W, 7)], [-0.5, -0.5, W + 1, 8], 'Post', 'every stem, column, trunk, arm · 1.5 wide'),
    root([E.P([4, 0], [8, 3.5], [0, 3.5])], [-0.5, -0.5, 9, 4.5], 'Gable', 'every roof and tier · flat base'),
    root([barPr[0], ...barPr.filter(p => p.cut)].map(p => p), [-0.2, -0.5, 12.4, 6.6], 'Vessel', 'every bowl · rim, clear band, drink'),
    root([cupPr[1], ...cupPr.filter(p => p.cut)], [6.5, 0.4, 5.6, 6.6], 'Loop', 'every handle and outline · 1.5 band'),
  ].join('');
  // 4. CORNERS by joint: specimens built and rounded by the live law, at 16x, radius read from the law
  const r = (convex, angle, lin = 4, lout = 4) => LAWS7.joint({ convex, angle, lin, lout });
  const K16 = 16, spec = (prims, vb, nm, rr, mark) => { const d = E.build(prims, { law: LAWS7.joint }).d; return `<div style="display:flex;flex-direction:column;align-items:center"><svg width="${vb[2] * K16}" height="${vb[3] * K16}" viewBox="${vb.join(' ')}" aria-hidden="true"><rect x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}" fill="${COL.raised}"/><path d="${d}" fill="${N}"/>${mark ? `<circle cx="${mark[0]}" cy="${mark[1]}" r="0.55" fill="none" stroke="${O}" stroke-width="0.08"/>` : ''}</svg><div style="font-size:16px;font-weight:700;color:${N};margin-top:6px">${nm}</div><div style="font-size:14px;color:${O};font-weight:700">${rr}</div></div>`; };
  const corners = [
    ['Inside', spec([E.R(0, 3, 6, WH), E.R(2.25, 0, W, 3.1)], [0.5, 0, 5, 5], 'Join', `${fr3(r(false, 90))}`, [2.25, 3])],
    ['Inside', spec([E.P([0, 0], [3, 3], [6, 0], [6, 4], [0, 4])], [0.5, -0.5, 5, 5], 'Notch', `${fr3(r(false, 60))}`, [3, 3])],
    ['Inside', spec([E.P([0, 4], [2, 2], [6, 2], [6, 5], [0, 5])], [0, 0.8, 5, 5], 'Wide inside', `${fr3(r(false, 135))}`, [2, 2])],
    ['Outside', spec([E.R(0, 0, W, 6)], [-1, -1, 3.5, 3.5], 'Cut end', `${fr3(r(true, 90, W, 6))}`, [0, 0])],
    ['Outside', spec([E.P([2, 0], [4, 4.5], [0, 4.5])], [-0.5, -0.5, 5, 5], 'Tip', `${fr3(r(true, 50))}`, [2, 0])],
    ['Outside', spec([E.R(0, 0, 5, 5)], [-1, -1, 4, 4], 'Mass corner', `${fr3(r(true, 90, 5, 5))}`, [0, 0])],
    ['Outside', spec([E.P([0, 2], [3, 0], [6, 2], [6, 5], [0, 5])], [-1, -1, 5, 5], 'Wide outside', `${fr3(r(true, 135))}`, [3, 0])],
  ];
  const cornerRow = `<div style="display:flex;gap:28px;align-items:flex-end;flex-wrap:wrap">${corners.map(([, s]) => s).join('')}</div>`;
  // 5. LINE WEIGHT and the lattice
  const LW = 40, weight = `<svg width="${14 * LW}" height="${6 * LW}" viewBox="0 0 14 6" aria-hidden="true"><rect width="14" height="6" fill="${COL.raised}"/>${[...Array(18)].map((_, j) => `<line x1="0" y1="${f2(j / 3)}" x2="14" y2="${f2(j / 3)}" stroke="${H}" stroke-width="0.02"/>`).join('')}<rect x="1" y="0.5" width="${W}" height="5" fill="${N}"/><rect x="4" y="${f2(2 / 3)}" width="9" height="${W}" fill="${N}"/><rect x="4" y="${f2(3 + 1 / 3)}" width="9" height="${f2(LINEW)}" fill="${N}" fill-opacity=".55"/>${lab(1.75, 5.9, '1.5', { fs: 0.4, a: 'middle', fill: N })}${lab(8.5, 2.75, 'EVERY LINE 1.5, ON THE 1/3PX LATTICE', { fs: 0.32, a: 'middle', fill: N })}${lab(8.5, 5.75, 'LINE MARKS (STAR, +): 1 2/3', { fs: 0.32, a: 'middle', fill: N })}</svg>`;
  // 6. THE STACKED GABLE: the notch shelf, from the live tree
  const tr = DRAW.nature(12), shelf = 1.5 * W, tg = E.build(tr, { law: LAWS7.joint }).d;
  const tierB = tr.filter(p => p.root === 'GABLE').map(p => p.pts);
  const sh = tierB.slice(0, -1).map(pts => { const by = pts[1][1], x = pts[1][0], shelf = 0.6 * (pts[1][0] - pts[0][0]); return `<line x1="${f2(x - shelf)}" y1="${f2(by + 0.45)}" x2="${f2(x)}" y2="${f2(by + 0.45)}" stroke="${O}" stroke-width="0.12"/><line x1="${f2(x - shelf)}" y1="${f2(by + 0.2)}" x2="${f2(x - shelf)}" y2="${f2(by + 0.7)}" stroke="${O}" stroke-width="0.08"/><line x1="${f2(x)}" y1="${f2(by + 0.2)}" x2="${f2(x)}" y2="${f2(by + 0.7)}" stroke="${O}" stroke-width="0.08"/>`; }).join('');
  // the tier heights: guides at the apex and every tier base, equal steps marked on the left
  const lv = [tierB[0][0][1], ...tierB.map(pts => pts[1][1])];
  const hg = lv.map(y => `<line x1="-0.6" y1="${f2(y)}" x2="12.6" y2="${f2(y)}" stroke="${O}" stroke-width="0.04" stroke-dasharray="0.25 0.2"/>`).join('')
    + lv.slice(1).map((y, i) => `<line x1="-0.4" y1="${f2(lv[i] + 0.15)}" x2="-0.4" y2="${f2(y - 0.15)}" stroke="${O}" stroke-width="0.08"/>${lab(-0.65, (lv[i] + y) / 2 + 0.15, ['4.83', '3', '3.33'][i], { fs: 0.4, fill: O, a: 'end' })}`).join('');
  const stack = `<svg width="${15 * 22}" height="${14 * 22}" viewBox="-2 -1 15 14" aria-hidden="true"><rect x="-2" y="-1" width="15" height="14" fill="${COL.raised}"/>${hg}<path d="${tg}" fill="${N}"/>${sh}</svg>`;
  return `<div style="width:1600px;box-sizing:border-box;padding:56px 64px 64px;background:${COL.raised};font-family:Archivo,Arial,sans-serif;color:${COL.ink}">
<div style="font-size:14px;letter-spacing:.12em;font-weight:700;color:${I2};text-transform:uppercase">Icon grid · the master</div>
<h1 style="margin:6px 0 10px;font-size:44px;line-height:1.1;color:${N}">The master grid</h1>
<p style="margin:0 0 40px;font-size:19px;line-height:1.45;max-width:1150px">Everything a new icon is drawn from, in one place. Built from the live rules, so it changes when a rule does. Units are px at the list size (badge 24).</p>
<div style="display:grid;grid-template-columns:${24 * S}px 1fr;gap:56px;align-items:start;margin-bottom:64px">
<div>${title('Badge, air, live area, guides')}${badgeFig}${cap('The badge is the seal; the glyph is struck inside it like a coin. Ring 1.5 · 2px of air · live circle Ø16 · the coin Ø12 in the 12px box. Grid: 1px; faint: the 1/3px lattice horizontals sit on, so their edges print crisp.')}</div>
<div>${title('The token: size by class')}<div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:28px 16px">${token}</div>${cap('Every cut has the coin\'s area, so none reads bigger: pins struck from one blank. The grid fits the drawing to its cut; a lone apex passes by 1/2.')}</div>
</div>
${title('Fitting: the whole drawing meets its cut')}
<div style="display:flex;gap:40px;align-items:flex-start;flex-wrap:wrap">${fitRow}</div>
${cap('The grid scales the whole drawing until its widest or its tallest part meets the cut, whichever comes first; nothing passes the cut except a lone apex, by 1/2. So a vessel\'s rim, a saucer or a plinth may span the cut\'s full width, and it is the class that sets that width, never the drawing. A drawing\'s own numbers (the coupe\'s rim is 11.5 of its 12-unit box) are proportions, not sizes. Measured on the shipped glyphs, to the 1/3px lattice.')}
<div style="margin-bottom:64px"></div>
${title('Root shapes: like parts, one shape')}
<div style="display:flex;gap:48px;align-items:flex-end;flex-wrap:wrap">${roots}</div>
${cap('Cut from a few blocks used again and again, like a woodcut or a case of metal type.')}
<div style="margin-bottom:64px"></div>
${title('Corners by joint: every meeting slightly round, inside tighter than outside')}
${cornerRow}
${cap('Ink settling on a screened banner: soft, never blotted. A round is never more than 0.2 of the shorter edge at its corner. No ink traps.')}
<div style="display:grid;grid-template-columns:1fr 1fr;gap:56px;margin-top:64px">
<div>${title('Line weight')}${weight}${cap('Monoweight: one line, the ring\'s weight, everywhere, horizontals and verticals alike; every counter is the finished outline moved in by one line, so each wall is the line. Line marks (the Outline and Open classes, made only of lines, no mass) carry 10/9 of it, 1 2/3px (on the lattice), so they come closer to the weight of the solid places without reading bold.')}</div>
<div>${title('Stacked gables')}${stack}${cap(`All by rule: the tiers keep v123\'s relationships, heights 4.83 : 3 : 3.33 and half widths 2.8 : 4.1 : 5.3 (tip to base), fitted to the crown (apex +1/2 to the trunk\'s line) and the tall class\'s width; each notch is 0.6 of the half width of the tier above it, so its neck is the other 0.4 and every tier holds on to the one below; the trunk shows one line. Inside rounds tighter than outside.`)}</div>
</div>
</div>`;
}
const fr3 = v => (Math.round(v * 100) / 100).toString();

// ---- the main board: the set, live vectors, in place at true size and large, beside the references --
const LOOK_COLS = [['cafe', 'Café'], ['bar', 'Bar'], ['museum', 'Museum'], ['nature', 'Nature'], ['plus', 'Add (+)'], ['star', 'Star']];
const LOOK_Q = ASK;
const CATS = ['cafe', 'bar', 'museum', 'nature'];
// a reference glyph's group, mapped into our 24px badge box (its 20px live area onto our 12px box)
const refG = (r, fill) => { const [x, y, w] = r.vb.split(/\s+/).map(Number), k = 12 / (w * 20 / 24), live = w * 2 / 24; return `<g transform="translate(6 6) scale(${f2(k)}) translate(${f2(-x - live)} ${f2(-y - live)})">${r.d.map(d => `<path d="${d}" fill="${fill}"/>`).join('')}</g>`; };
const SETS = (() => {
  const ours = {
    name: 'Ours', sub: 'redrawn',
    badge: (id, px = 24) => badge(GD.joint[12][id].d, px),
    pin: id => selPin(GD.joint[12][id].d),
    chip: id => chip(GD.joint[12][id].c12.d),
    ui: (id, px) => `<svg width="${px}" height="${px}" viewBox="0 0 24 24" aria-hidden="true"><path d="${UD.joint[id].d}" fill="${COL.navy}"/></svg>`,
  };
  const refs = REFS.map(([nm, rs]) => {
    const at = id => rs[CATS.indexOf(id)];
    return {
      name: nm.split(' (')[0], sub: 'for comparison, not a craft benchmark',
      badge: (id, px = 24) => refInBadge(at(id), px),
      pin: id => `<svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="15.25" fill="${COL.navy}" stroke="${COL.navy}" stroke-width="1.5"/><g transform="translate(4 4)">${refG(at(id), COL.paper)}</g></svg>`,
      chip: id => `<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><g transform="translate(-6 -6)">${refG(at(id), COL.navy)}</g></svg>`,
      ui: (id, px) => refBare(rs[id === 'plus' ? 4 : 5], px),
    };
  });
  return [ours, ...refs];
})();
const PLACES = [['cafe', 'Kaffeverket', 'CAFÉ · STOCKHOLM', true], ['bar', 'Tjoget', 'BAR · STOCKHOLM', false], ['museum', 'Vasa Museum', 'MUSEUM · STOCKHOLM', true], ['nature', 'Djurgården', 'NATURE · STOCKHOLM', false]];
function inPlace(S) {
  const rows = PLACES.map(([id, nm, sub, starred]) => `<div style="display:flex;align-items:center;gap:10px;height:56px;background:#F1E9DB;padding:0 10px;border-bottom:1px solid ${COL.hair}">${S.badge(id)}<div style="flex:1;min-width:0;font-size:16px;font-weight:600;line-height:1.15;color:${COL.ink};white-space:nowrap">${nm}<div style="font-size:10.5px;letter-spacing:.08em;font-weight:700;opacity:.72;margin-top:2px">${sub}</div></div>${starred ? S.ui('star', 20) : ''}</div>`).join('');
  const pins = [['cafe', 18, 14], ['museum', 96, 62], ['nature', 300, 20], ['bar', 360, 70]].map(([id, x, y]) => `<div style="position:absolute;left:${x}px;top:${y}px;line-height:0">${S.badge(id)}</div>`).join('');
  const map = `<div style="position:relative;height:112px;background:${COL.map};overflow:hidden">${pins}<div style="position:absolute;left:190px;top:34px;line-height:0">${S.pin('bar')}</div><div style="position:absolute;left:12px;bottom:-4px;line-height:0">${plusBadge(S.ui('plus', 26.4), 60)}</div></div>`;
  const chips = `<div style="display:flex;flex-wrap:wrap;gap:6px;padding:10px 0 0">${PLACES.map(([id]) => `<span style="display:inline-flex;align-items:center;gap:7px;height:30px;padding:0 10px;background:${COL.raised};border:1px solid ${COL.hair};border-bottom:2px solid ${COL.navy};font-size:11px;font-weight:700;letter-spacing:.08em;color:${COL.navy}">${S.chip(id)}${id === 'cafe' ? 'CAFÉ' : id.toUpperCase()}</span>`).join('')}</div>`;
  const lab = t => `<div style="font-size:12px;letter-spacing:.1em;font-weight:700;color:${COL.ink2};text-transform:uppercase;margin:16px 0 6px">${t}</div>`;
  return `<div><div style="font-size:22px;font-weight:700;color:${COL.navy}">${S.name}</div><div style="font-size:15px;color:${COL.ink2};margin-bottom:4px">${S.sub}</div>${lab('List rows')}${rows}${lab('Map: pins, a selected pin, the + button')}${map}${lab('Filter chips')}${chips}</div>`;
}
// ---- g7i on the main board: the grid change (the token, the root shapes), before (v105) and after ----
const chipVB = d => `<svg width="12" height="12" viewBox="6 6 12 12" aria-hidden="true"><path d="${d}" fill="${COL.navy}"/></svg>`;
const V105SET = {
  name: 'Before', sub: 'v105, as you last saw it',
  badge: (id, px = 24) => badge(V105[id].d, px),
  pin: id => selPin(V105[id].d),
  chip: id => chipVB(V105[id].d),
  ui: (id, px) => `<svg width="${px}" height="${px}" viewBox="0 0 24 24" aria-hidden="true"><path d="${V105[id].d}" fill="${COL.navy}"/></svg>`,
};
const NOWSET = { ...SETS[0], name: 'Now', sub: 'sized by the token, cut from the root shapes' };
const CLS_NAME = { WIDE: 'Wide', SQUARE: 'Square', TALL: 'Tall', ROUND: 'Round (radial)', OPEN: 'Open', OUTLINE: 'Outline' };
const fr = v => { const w = Math.floor(v + 1e-6), r = Math.round((v - w) * 3); return r === 0 ? `${w}` : r === 3 ? `${w + 1}` : `${w} ${r}/3`; };
// one 8x cell with the class's cut of the token drawn over the glyph (orange, dashed); px = cell size
function tokenCell(id, px = 192) {
  const sw = f2(24 / px * 1.5), dash = `stroke-dasharray="${f2(24 / px * 5)} ${f2(24 / px * 4)}"`, cut = (inner) => `<g fill="none" stroke="${COL.or}" stroke-width="${sw}" ${dash}>${inner}</g>`;
  const coin = `<circle cx="12" cy="12" r="6" fill="none" stroke="${COL.hair}" stroke-width="${sw}"/>`;
  if (id === 'star' || id === 'plus') {
    const px0 = UIP[id][1], k = px0 / 24, t = 12 - 12 * k;
    const g = `<g transform="translate(${f2(t)} ${f2(t)}) scale(${f2(k)})"><path d="${UD.joint[id].d}" fill="${COL.navy}"/></g>`;
    let o;
    if (id === 'star') { const cy = t + (12 + 0.6 * USC.star) * k, ri = (P7.STAR.ri * 9.6 * USC.star) * k - (W / 2) / Math.sin(3 * Math.PI / 10); o = cut(`<circle cx="12" cy="${f2(cy)}" r="6"/><circle cx="12" cy="${f2(cy)}" r="${f2(ri)}"/>`); }
    else { const s = KEY.OPEN[0] * k; o = cut(`<rect x="${f2(12 - s / 2)}" y="${f2(12 - s / 2)}" width="${f2(s)}" height="${f2(s)}"/>`); }
    return `<svg width="${px}" height="${px}" viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" fill="${COL.paper}"/>${g}${o}</svg>`;
  }
  const [cls, apex] = CLASS[id], [kw, kh] = KEY[cls], b = measure(GD.joint[12][id].d).box, cx = (b.x0 + b.x1) / 2;
  let o = `<rect x="${f2(cx - kw / 2)}" y="${f2(b.y1 - kh)}" width="${f2(kw)}" height="${f2(kh)}"/>`;
  if (apex) o += `<line x1="${f2(cx - 2)}" y1="${f2(b.y1 - kh - apex)}" x2="${f2(cx + 2)}" y2="${f2(b.y1 - kh - apex)}"/>`;
  return badge(GD.joint[12][id].d, px, cut(o));
}
const clsLabel = id => { const [cls, apex] = CLASS[id], [kw, kh] = KEY[cls]; return `${CLS_NAME[cls]}${cls === 'OUTLINE' ? ': hull at least the coin; hole at least 2 2/3 lines (4px) across (the hole decides)' : cls === 'ROUND' ? ': hull = the coin\'s area' : cls === 'OPEN' ? `: arms span ${fr(kw)}` : `: ${fr(kw)} × ${fr(kh)}`}${apex ? ', apex +1/2' : ''}`; };
// like parts pulled out of the set, each at 8x, by root shape
function rootRows(px = 8) {
  const parts = { SLAB: [], POST: [], GABLE: [], VESSEL: [], LOOP: [] };
  const NM = { cafe: 'Café', bar: 'Bar', museum: 'Museum', nature: 'Nature', plus: '+', star: 'Star' };
  for (const [id] of BATCH) {
    const pr = DRAW[id](SFIT[12][id]), cuts = pr.filter(p => p.cut);
    pr.forEach(p => { if (p.cut) return; for (const r of [p.root, p.also]) if (r && parts[r]) parts[r].push([NM[id], r === 'LOOP' ? [p, ...cuts.filter(c => c.t === 'D')] : r === 'VESSEL' && id === 'bar' ? [p, ...cuts] : [p]]); });
  }
  const pk = UIP.plus[1] / 24, pp = E.xform(plus(UIP.plus[1], USC.plus), pk, 0, 0, 0, 0); pp.forEach(p => parts.POST.push(['+', [p]]));
  const sk = UIP.star[1] / 24; parts.LOOP.push(['Star', E.xform(star(UIP.star[1], USC.star), sk, 0, 0, 0, 0)]);
  const one = ([nm, prims]) => { const d = E.build(prims, { law: LAWS7.joint }).d, b = measure(d).box, pad = 0.5, w = b.x1 - b.x0 + 2 * pad, h = b.y1 - b.y0 + 2 * pad;
    return `<div style="display:flex;flex-direction:column;align-items:center;gap:6px;font-size:14px;color:${COL.ink2}"><svg width="${f2(w * px)}" height="${f2(h * px)}" viewBox="${f2(b.x0 - pad)} ${f2(b.y0 - pad)} ${f2(w)} ${f2(h)}" aria-hidden="true"><path d="${d}" fill="${COL.navy}"/></svg>${nm}</div>`; };
  const JOB = { SLAB: 'Slab: every base and span', POST: 'Post: every stem, column, trunk and arm', GABLE: 'Gable: every roof and tier', VESSEL: 'Vessel: every bowl', LOOP: 'Loop: every handle and outline' };
  return Object.entries(parts).map(([r, list]) => `<div style="display:grid;grid-template-columns:330px 1fr;align-items:end;gap:24px;padding:18px 0;border-top:1px solid ${COL.hair}"><div style="font-size:19px;font-weight:700;color:${COL.navy};align-self:center">${JOB[r]}</div><div style="display:flex;flex-wrap:wrap;gap:28px;align-items:flex-end">${list.map(one).join('')}</div></div>`).join('');
}
// the three bases as they were (v105): a blade, a dome, a slab
function basesBefore(px = 8) {
  const items = [['Café: a tapered blade', P7H.DRAW.cafe(12)[1]], ['Bar: a dome', P7H.DRAW.bar(12)[2]], ['Museum: a slab', P7H.DRAW.museum(12).slice(-1)[0]]];
  return items.map(([nm, p]) => { const d = E.build([p], { law: LAWS7.joint }).d, b = measure(d).box, pad = 0.5, w = b.x1 - b.x0 + 2 * pad, h = b.y1 - b.y0 + 2 * pad;
    return `<div style="display:flex;flex-direction:column;align-items:center;gap:6px;font-size:14px;color:${COL.ink2}"><svg width="${f2(w * px)}" height="${f2(h * px)}" viewBox="${f2(b.x0 - pad)} ${f2(b.y0 - pad)} ${f2(w)} ${f2(h)}" aria-hidden="true"><path d="${d}" fill="${COL.ink2}"/></svg>${nm}</div>`; }).join('');
}
const BATCH2 = [
  ['Restaurant', 'fork and knife', 'Tall', 'Posts (handles, tines). The knife\'s blade is a post with one rounded side: a sixth root, BLADE, to add and test on the knife first.'],
  ['Venue', 'curtain', 'Square', 'Slab rail (a span), two drapes as posts swept by a vessel curve. Fits.'],
  ['Landmark', 'the Nordic ⌘ loop', 'Square', 'Four loops joined by posts. Fits; the loop is its whole drawing.'],
  ['Attraction', 'Ferris wheel', 'Round (radial): fitted by hull', 'A loop rim, post spokes, posts for legs, a slab base. Fits.'],
  ['Park', 'bench', 'Wide', 'Slab seat and back, post legs. Fits exactly.'],
  ['Shopping', 'carrier bag', 'Tall', 'The body is a plain block, not a slab or a vessel: a seventh root, BLOCK, shared with the city blocks. The handle is a loop with a square back, the one stated exception (a round back read as a padlock, concept round).'],
  ['Hotel', 'bed', 'Wide', 'Slab base, post legs and headboard; the pillow a short vessel. Fits.'],
  ['Neighbourhood', 'city blocks', 'Square', 'BLOCKs on a grid (see Shopping).'],
];
const OURS = [
  ['The token', 'A glyph is struck like a token: a 12px coin that sits inside our badge\'s ring with 2px of air, as a seal sits in a signet ring. Every glyph is cut to the coin\'s area, in the shape its subject needs (wide, square, tall, round, outline, open), so none reads bigger than its neighbour: a set of pins struck from one blank.'],
  ['The root shapes', 'Like a woodcut or a case of metal type, the set is cut from a few blocks used again and again: the slab is the bed every object stands on, the post the upright of a road sign, the gable a roof, the vessel and the loop.'],
  ['The corners', 'Every meeting point is slightly round and the inside settles tighter than the outside: ink settling on a screened banner, not a ruled line (your words).'],
  ['The 1/3px lattice', 'Slabs, rims and liquid lines sit on whole device pixels, so their edges print crisp, as a screened edge does, while the corners stay soft.'],
];
// ---- g7r: the trees compared, each fitted by the grid, with their tiers measured in px at 24
function fitTree(draw) {
  const s = fitS('nature', 12, { nature: draw }), ox = (24 - s) / 2, oy = r3((24 - s) / 2), prims = draw(s);
  const m = measure(E.build(E.xform(prims, 1, 0, 0, ox, oy), { law: LAWS7.joint }).d);
  const d = E.build(E.xform(prims, 1, 0, 0, ox + r4(12 - (m.box.cx + m.cx) / 2), oy + r3(12 - (m.box.cy + m.cy) / 2)), { law: LAWS7.joint }).d;
  // tiers: [apex y, base y, half width]; shown height: tip from its apex, the rest base to base; neck: the
  // tier below's width where the tier above ends; notch: the tier above's half width less half the neck
  const g = prims.filter(q => q.t === 'P' && q.pts.length === 3).map(q => [q.pts[0][1], q.pts[1][1], q.pts[1][0] - q.pts[0][0]]).sort((a, b) => a[0] - b[0]);
  const st = g.map(([ty, by, hw], k) => {
    const shown = k ? by - g[k - 1][1] : by - ty;
    const nk = k < g.length - 1 ? (() => { const [ty2, by2, hw2] = g[k + 1]; return 2 * hw2 * (by - ty2) / (by2 - ty2); })() : null;
    return { shown, hw, neck: nk, notch: nk == null ? null : hw - nk / 2 };
  });
  return { d, st, w: measure(d).box.x1 - measure(d).box.x0, h: measure(d).box.y1 - measure(d).box.y0 };
}
const W_ = W;
const TREE123D = s => { const u = s / 12, X = v => +(v * u).toFixed(3), Y = v => Math.round(v * u * 3) / 3, c = s / 2, L = 1.5 * W_ / u;
  const tiers = [[-0.5, 4.25, 2.8], [null, 7.6, 4.1], [null, 10.75, 5.3]];
  for (let i = 1; i < 3; i++) { const [, byU, hwU] = tiers[i - 1], [, byL, hwL] = tiers[i], r = (hwU - L) / hwL; tiers[i][0] = (byU - r * byL) / (1 - r); }
  return [...tiers.map(([ty, by, hw]) => E.P([c, X(ty)], [c + X(hw), Y(by)], [c - X(hw), Y(by)])), E.R(c - W_ / 2, X(9.5), W_, s - X(9.5))]; };
const TREES = {
  v123: fitTree(TREE123D),
  v130: fitTree(s => DRAW.nature(s, { style: 'mono', tip: 1.5 })),
  now: fitTree(s => DRAW.nature(s)),
};
const TREE123 = TREES.v123.d;
const TREE_Q = 'The tree now takes v123\'s tier sizes as its rule, fitted to the current height and width, and every tier holds on to the one below. Is this the shape you liked?';
function treeChange() {
  const N = COL.navy, I2 = COL.ink2, f2_ = v => v == null ? '–' : v.toFixed(2);
  const pair = (nm, d) => `<div style="display:flex;flex-direction:column;align-items:center;gap:10px"><div style="display:flex;align-items:center;gap:10px">${badge(d)}<svg width="12" height="12" viewBox="6 6 12 12" aria-hidden="true"><path d="${d}" fill="${N}"/></svg></div>${badge(d, 192)}<div style="font-size:18px;font-weight:700;color:${N}">${nm}</div></div>`;
  const row = (nm, T) => `<tr><td style="padding:6px 8px;font-weight:700;color:${N}">${nm}</td><td style="padding:6px 8px">${T.st.map(x => f2_(x.shown)).join(' : ')}</td><td style="padding:6px 8px">${(T.st[0].shown / T.st[1].shown).toFixed(2)} : 1 : ${(T.st[2].shown / T.st[1].shown).toFixed(2)}</td><td style="padding:6px 8px">${T.st.map(x => f2_(x.hw)).join(' : ')}</td><td style="padding:6px 8px">${T.st.slice(0, 2).map(x => f2_(x.neck)).join(' · ')}</td><td style="padding:6px 8px">${f2_(T.w)} × ${f2_(T.h)}</td></tr>`;
  const th = h => `<th style="text-align:left;padding:6px 8px;border-bottom:2px solid ${N};font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:${I2}">${h}</th>`;
  const table = `<table style="border-collapse:collapse;font-size:15px;margin-top:20px"><tr>${th('Tree')}${th('Tier heights shown, px (tip to base)')}${th('As ratios, middle = 1')}${th('Half widths, px')}${th('Neck under tip · under middle, px')}${th('Size, px')}</tr>${row('v123', TREES.v123)}${row('v130 (taller tip)', TREES.v130)}${row('Now', TREES.now)}</table>`;
  return `<div style="display:grid;grid-template-columns:400px 1fr;gap:32px;align-items:center;margin:0 0 24px">
<div><div style="font-size:22px;font-weight:700;color:${N};margin-bottom:8px">The tree: v123's tier sizes, as the rule.</div><div style="font-size:17px;line-height:1.45;color:${I2}">The tiers keep v123's relationships: heights 4.83 : 3 : 3.33 (v123 as it was seen at 24) and half widths 2.8 : 4.1 : 5.3, tip to base, fitted to the current height and width (the tall class). Each notch is now a share of the tier above it (0.6 of its half width), not a fixed depth, so the neck under every tier is the other 0.4 and no tier reads as coming off. v130's taller tip, for comparison. True size (24 and the 12px chip), then 8x.</div><div style="margin-top:18px;padding:16px 20px;background:${COL.paper};border-top:4px solid ${COL.or};font-size:20px;line-height:1.3;color:${N};font-weight:600">${TREE_Q}</div></div>
<div style="display:flex;gap:28px">${pair('v123', TREES.v123.d)}${pair('v130: taller tip', TREES.v130.d)}<div style="width:2px;background:${COL.hair};align-self:stretch"></div>${pair('Now', GD.joint[12].nature.d)}</div></div>
<div style="margin:0 0 64px">${table}<div style="font-size:15px;color:${I2};margin-top:8px">Measured on each tree as the grid fits it at 24. The neck under v130's tip was ${TREES.v130.st[0].neck.toFixed(2)}px, which is why its top tier read as coming off; now ${TREES.now.st[0].neck.toFixed(2)}px.</div></div>`;
}
// ---- g7r: before and after, measured (the coupe's drink, every counter's walls)
const svgD = f => fs.readFileSync(path.join(ROOT, 'svg', 'g7', f), 'utf8').match(/<path[^>]* d="([^"]+)"/g).map(m => m.match(/d="([^"]+)"/)[1]).pop();
function measuredG7r() {
  const N = COL.navy, I2 = COL.ink2;
  const th = h => `<th style="text-align:left;padding:6px 8px;border-bottom:2px solid ${N};font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:${I2}">${h}</th>`;
  const td = (v, b) => `<td style="padding:6px 8px;border-top:1px solid ${COL.hair};${b ? `font-weight:700;color:${N}` : ''}">${v}</td>`;
  const cap = s => `<div style="font-size:14px;color:${I2};margin-top:8px;line-height:1.4">${s}</div>`;
  const h3 = s => `<div style="font-size:22px;font-weight:700;color:${N};margin:0 0 8px">${s}</div>`;
  const body = s => `<div style="font-size:17px;line-height:1.45;color:${I2}">${s}</div>`;
  // ---- the coupe: v130, v133, now
  const cps = [['v130', svgD('before-g7r/bar-24.svg')], ['v133', svgD('before-g7s/bar-24.svg')], ['Now', GD.joint[12].bar.d]].map(([nm, d]) => [nm, d, DRINK(d), measure(d).box]);
  const drinkRows = cps.map(([nm, , r, b], k) => `<tr>${td(nm, true)}${td(r.area.toFixed(1) + ' px²', k === 2)}${td(r.depth.toFixed(2) + ' px')}${td(r.bandW.toFixed(2) + ' px')}${td((b.x1 - b.x0).toFixed(2) + ' × ' + (b.y1 - b.y0).toFixed(2))}</tr>`).join('');
  const glass = (nm, d) => `<div style="display:flex;flex-direction:column;align-items:center;gap:8px">${badge(d)}${badge(d, 192)}<div style="font-size:16px;font-weight:700;color:${N}">${nm}</div></div>`;
  // ---- counters: distance and direction, v130, v133, now
  const files = [['Cup handle', 'cafe-24.svg', 'cafe'], ['Coupe band', 'bar-24.svg', 'bar'], ['Museum slots', 'museum-24.svg', 'museum'], ['Star hole', 'star-20.svg', 'star']];
  const lineOf = (id, v) => id !== 'star' ? 1.5 : (v === 'v130' ? 1.75 : LINEW) * 24 / 20;
  const sum = r => { const H = r.holes, n = H.reduce((a, h) => a + h.n, 0); return { n, d: H.reduce((a, h) => a + h.offD, 0), a: H.reduce((a, h) => a + h.offA, 0), md: Math.max(...H.map(h => h.maxDir || 0)), mn: Math.min(...H.map(h => h.min ?? 99)), mx: Math.max(...H.map(h => h.max || 0)), c: H.reduce((a, h) => a + h.corner, 0), s: H.reduce((a, h) => a + h.surface, 0) }; };
  const cnt = files.map(([nm, f, id]) => [nm, id, sum(OCHECK(svgD('before-g7r/' + f), lineOf(id, 'v130'))), sum(OCHECK(svgD('before-g7s/' + f), lineOf(id, 'v133'))), sum(OCHECK(id === 'star' ? UD.joint.star.d : GD.joint[12][id].d, lineOf(id, 'now')))]);
  const cell = (id, s, b) => { const k = id === 'star' ? 20 / 24 : 1; return td(`${s.d + s.a ? `${s.d + s.a} of ${s.n} off (${s.d} distance, ${s.a} direction)` : `0 of ${s.n} off`} · walls ${(s.mn * k).toFixed(2)}–${(s.mx * k).toFixed(2)} px · worst turn ${s.md.toFixed(1)}°`, b); };
  const cntRows = cnt.map(([nm, id, a, b, c]) => `<tr>${td(nm, true)}${cell(id, a)}${cell(id, b)}${cell(id, c, true)}</tr>`).join('');
  const ovl = (d, line, vb = '2 2 20 20', w = 168) => OVERLAY(d, OCHECK(d, line), 6).replace('<svg xmlns="http://www.w3.org/2000/svg"', '<svg aria-hidden="true"').replace(/width="144" height="144" viewBox="0 0 24 24"/, `width="${w}" height="${w}" viewBox="${vb}"`);
  const zoomBowl = '6 6.5 12 12';
  const ovC = [['Coupe, v130', ovl(svgD('before-g7r/bar-24.svg'), 1.5, zoomBowl, 220)], ['Coupe, v133', ovl(svgD('before-g7s/bar-24.svg'), 1.5, zoomBowl, 220)], ['Coupe, now', ovl(GD.joint[12].bar.d, 1.5, zoomBowl, 220)]];
  const ovS = [['Star, v130', ovl(svgD('before-g7r/star-20.svg'), lineOf('star', 'v130'))], ['Star, v133', ovl(svgD('before-g7s/star-20.svg'), lineOf('star', 'v133'))], ['Star, now', ovl(UD.joint.star.d, lineOf('star', 'now'))], ['Cup, now', ovl(GD.joint[12].cafe.d, 1.5)], ['Museum, now', ovl(GD.joint[12].museum.d, 1.5)]];
  const ovRow = ov => `<div style="display:flex;gap:14px;flex-wrap:wrap;margin-top:16px">${ov.map(([nm, s]) => `<div style="display:flex;flex-direction:column;align-items:center;gap:4px">${s}<div style="font-size:13px;font-weight:700;color:${N}">${nm}</div></div>`).join('')}</div>`;
  // ---- the star beside the + and the places, at true size and 8x
  const starOf = v => v === 'now' ? UD.joint.star.d : svgD(`before-g7${v === 'v130' ? 'r' : 's'}/star-20.svg`);
  const uiCell = (d, px, z) => `<svg width="${px * z}" height="${px * z}" viewBox="0 0 24 24" aria-hidden="true"><path d="${d}" fill="${N}"/></svg>`;
  const starRow = (nm, v, z) => `<div style="display:flex;align-items:center;gap:${z > 1 ? 24 : 12}px;padding:${z > 1 ? 10 : 6}px 0;border-top:1px solid ${COL.hair}"><div style="width:120px;font-size:15px;font-weight:700;color:${N}">${nm}</div>${['cafe', 'bar', 'museum', 'nature'].map(id => badge(GD.joint[12][id].d, 24 * z)).join('')}${uiCell(UD.joint.plus.d, 26.4, z)}${uiCell(starOf(v), 20, z)}</div>`;
  const stars = ['v130', 'v133', 'now'].map(v => { const d = starOf(v), m = measure(d), hole = OCHECK(d, lineOf('star', v)).holes[0]; return [v, m.area * (20 / 24) ** 2, (hole.box[2] - hole.box[0]) * 20 / 24]; });
  return `<div style="margin:0 0 40px;display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:start">
<div>${h3('The coupe: v130\'s saucer, wider at the bottom, more drink')}${body('Back to v130\'s shallow saucer bowl (you: "v130 bowl was closer"), its bottom wider and flatter like a classic coupe, a third of a pixel deeper. The clear band is one stroke tall (1.5px), and its sides are the bowl\'s outline moved in by one line, so they curve with it. Measured: the drink is the ink under the band down to the stem (src/drink-measure.js).')}
<table style="border-collapse:collapse;font-size:15px;margin-top:14px"><tr>${th('Coupe')}${th('Drink')}${th('Depth at centre')}${th('Band width')}${th('Size, px')}</tr>${drinkRows}</table>
${cap(`Now holds ${Math.round(100 * (cps[2][2].area / cps[0][2].area - 1))}% more drink than v130. v133 held more (${cps[1][2].area.toFixed(1)}px²), but it did so with a deep bowl that read as a goblet; this keeps v130\'s saucer.`)}
<div style="display:flex;gap:24px;margin-top:20px">${cps.map(([nm, d]) => glass(nm, d)).join('')}</div>
${ovRow(ovC)}
${cap('The bowl at 8x: orange is the outline moved in by one line. Green dots sit on it within 0.08px and run within 4° of it; red is off by distance, magenta off by direction, grey a corner the corner rule rounds, blue the drink\'s surface meeting the wall (a free edge, not a wall). In v130 the band\'s sides were straight lines that cut across the curve.')}</div>
<div>${h3('Counters: the inside follows the outside')}${body('A counter is now the outline before rounding, moved in by one line with sharp joins; then the corner rule rounds the counter\'s own corners, tight inside (0.15px), like every inside corner. v133 rounded them by the offset itself, which made them far too round (you: "far too rounded on the interior joins"). The check now tests direction as well as distance: every wall must run within 4° of the outline across from it; a straight side a line from a curve no longer passes (src/offset-check.js).')}
<table style="border-collapse:collapse;font-size:14px;margin-top:14px"><tr>${th('Counter')}${th('v130')}${th('v133')}${th('Now')}</tr>${cntRows}</table>
${cap('Excused, as the corner rule: where a counter turns a corner, the wall across the corner is not the line (the cup handle\'s two left corners run up to 0.15px over; the star\'s valleys are the mitre of its points). Counted separately as corners, never as passes.')}
${ovRow(ovS)}</div></div>
<div style="margin:0 0 64px">${h3('The star: a line mark, an outline')}${body(`You found v133\'s star "way heavier than the others": its hole was small and its inner corners filled in. Now its hole is at least 2 2/3 lines (4px) across (was 2), so it opens up and reads as an outline, and its walls are the line marks\' 1 2/3px with tight inner corners. Ink at 20px: v130 ${stars[0][1].toFixed(1)}px², v133 ${stars[1][1].toFixed(1)}px², now ${stars[2][1].toFixed(1)}px²; hole tip to tip: ${stars.map(s => s[2].toFixed(2)).join(' · ')}px. The bigger hole makes the star about an eighth wider than v133 (the hole decides its size, as the Outline class says). True size, then 8x, beside the + and the place icons.`)}
<div style="margin-top:14px">${starRow('v130', 'v130', 1)}${starRow('v133', 'v133', 1)}${starRow('Now', 'now', 1)}${starRow('v130', 'v130', 3)}${starRow('v133', 'v133', 3)}${starRow('Now', 'now', 3)}</div></div>`;
}
function sheetLook() {
  const L = 150, gap = 24, big = 192;
  const plain = inner => `<svg width="${big}" height="${big}" viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" fill="${COL.paper}"/>${inner}</svg>`;
  const bigCell = (S, id) => id === 'plus' || id === 'star' ? plain(S.ui(id, 24).replace(/^<svg width="24" height="24"/, '<svg x="0" y="0" width="24" height="24"')) : S.badge(id, big);
  const grid = `display:grid;grid-template-columns:${L}px repeat(6, ${big}px);column-gap:${gap}px;row-gap:28px;align-items:center`;
  const head = `<div></div>${LOOK_COLS.map(([, nm]) => `<div style="font-size:20px;font-weight:700;color:${COL.navy}">${nm}</div>`).join('')}`;
  const rowLabel = S => `<div style="font-size:20px;font-weight:700;color:${COL.navy};line-height:1.25">${S.name}<div style="font-size:15px;font-weight:400;color:${COL.ink2}">${S.sub}</div></div>`;
  const row = S => rowLabel(S) + LOOK_COLS.map(([id]) => `<div>${bigCell(S, id)}</div>`).join('');
  const sec = t => `<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${COL.ink2};text-transform:uppercase;margin:0 0 16px">${t}</div>`;
  const p = t => `<p style="margin:0 0 20px;font-size:18px;line-height:1.45;max-width:1200px">${t}</p>`;
  const tokenRow = `<div style="${grid}"><div style="font-size:20px;font-weight:700;color:${COL.navy};line-height:1.25">Each in its cut<div style="font-size:15px;font-weight:400;color:${COL.ink2}">orange: the class's cut of the coin; grey: the coin</div></div>${LOOK_COLS.map(([id]) => `<div style="display:flex;flex-direction:column;gap:8px">${tokenCell(id, big)}<div style="font-size:14px;line-height:1.3;color:${COL.ink2}">${clsLabel(id)}</div></div>`).join('')}</div>`;
  const b2 = `<table style="width:100%;border-collapse:collapse;font-size:16px;line-height:1.4">${['<tr>' + ['Batch 2', 'Concept', 'Size class', 'Root shapes'].map(h => `<th style="text-align:left;padding:8px;border-bottom:2px solid ${COL.navy};font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:${COL.ink2}">${h}</th>`).join('') + '</tr>', ...BATCH2.map(r => '<tr>' + r.map((c, i) => `<td style="padding:8px;border-top:1px solid ${COL.hair};vertical-align:top;${i === 0 ? `font-weight:700;color:${COL.navy}` : ''}">${c}</td>`).join('') + '</tr>')].join('')}</table>`;
  return `<div style="width:1600px;box-sizing:border-box;padding:56px 64px 64px;background:${COL.raised};font-family:Archivo,Arial,sans-serif;color:${COL.ink}">
<div style="font-size:14px;letter-spacing:.12em;font-weight:700;color:${COL.ink2};text-transform:uppercase">Icon set · the first six · grid changes g7i to g7p</div>
<h1 style="margin:6px 0 10px;font-size:44px;line-height:1.1;color:${COL.navy}">One token, five root shapes</h1>
<p style="margin:0 0 36px;font-size:19px;line-height:1.45;max-width:1200px">You asked for size and root shape to come from the grid, not from icon-by-icon fixes. This adds both to the grid: how big a glyph is now comes from its shape class, and parts that do the same job are cut from the same shape. Latest change (g7j): an <b>Outline</b> size class for the Star, sized so its hole always stays open (an outline means "not starred yet"), and a rule for <b>stacked gables</b>: every notch in the tree is the same depth, one and a half lines (g7k: deeper, so the tiers read at 100%). Latest (g7p): monoweight is the line everywhere; the + and the star are line marks; Latest (g7r): the line marks come down to 1 2/3px; every counter is the outline moved in by one line; the coupe holds a third more drink; the tree takes v123\'s tier relationships as its rule; the coupe\'s wider bowl is back with more drink; the cup\'s broken corner is fixed. Before is v105; now is the same six, refitted by the rules. Every icon is a live vector: zoom in on the canvas.</p>
<div style="margin:0 0 56px;padding:28px 32px;background:${COL.paper};border-top:4px solid ${COL.or}">
<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${COL.ord};text-transform:uppercase;margin-bottom:8px">The question</div>
<div style="font-size:28px;line-height:1.3;color:${COL.navy};font-weight:600">${LOOK_Q}</div><div style="font-size:24px;line-height:1.3;color:${COL.navy};font-weight:600;margin-top:12px">${TREE_Q}</div></div>
${sec('The tree')}
${treeChange()}
${sec('Measured: what changed this round')}
${measuredG7r()}
<div style="margin:0 0 64px"></div>
${sec('True size, where they live in the app: before and now')}
<div style="display:grid;grid-template-columns:repeat(2, 1fr);column-gap:48px;margin-bottom:64px">${[V105SET, NOWSET].map(inPlace).join('')}</div>
${sec('Grid change 1: size by class, the token')}
${p('Every glyph is fitted by the grid, never by hand, to a cut of one 12px coin with the coin\'s area: <b>Wide</b> 12 × 9 1/3, <b>Square</b> 10 2/3, <b>Tall</b> 9 1/3 × 12, <b>Outline</b> for outline marks (the Star, whose outline means "not yet tapped": the hull through its tips at least the coin\'s area, and its hole at least 2 2/3 lines (4px) across, so it reads as an outline, never as filled; at 1.5px the hole decides), and <b>Open</b> for marks made only of lines (the +: its arms span the coin). The Outline and Open classes are <b>line marks</b>: with no mass to carry weight, they draw their line at 1 2/3px (10/9 of the line, on the 1/3px lattice), even all along. A lone apex (the pediment, the tree\'s tip) passes the cut by 1/2px. The drawing sets proportions; the class sets size. A new icon picks its class and is fitted the same way.')}
<div style="margin:0 0 64px">${tokenRow}</div>
${sec('Grid change 2: root shapes, like parts cut from one shape')}
${p('Before, the three bases were three shapes: a tapered blade, a dome and a slab (your example). Now every base is the same slab, every bowl the same vessel, every roof and tier the same gable, every upright the same post, every handle and outline the same loop. Where gables stack (the tree), the tiers keep v123\'s heights and widths (4.83 : 3 : 3.33 and 2.8 : 4.1 : 5.3), fitted to the tall class, and each notch is 0.6 of the half width of the tier above it. The coupe\'s wide bowl holds a drink under a clear band, so it reads as a glass, not a chalice. The cup\'s bowl keeps both its walls; the handle is its own loop, joined to it.')}
<div style="display:grid;grid-template-columns:330px 1fr;align-items:end;gap:24px;padding:0 0 18px"><div style="font-size:19px;font-weight:700;color:${COL.ink2};align-self:center">Bases before (v105)</div><div style="display:flex;flex-wrap:wrap;gap:28px;align-items:flex-end">${basesBefore()}</div></div>
${rootRows()}
<div style="margin:0 0 64px"></div>
${sec('What about the grid is ours')}
<div style="display:grid;grid-template-columns:repeat(2, 1fr);gap:20px 48px;margin:0 0 64px">${OURS.map(([h, t]) => `<div><div style="font-size:20px;font-weight:700;color:${COL.navy};margin-bottom:6px">${h}</div><div style="font-size:17px;line-height:1.45">${t}</div></div>`).join('')}</div>
${sec('Large (8x): before and now')}
<div style="${grid};margin-bottom:64px">${head}${row(V105SET)}${row(NOWSET)}</div>
${sec('Pressure test: the batch 2 subjects on this grid')}
<div style="margin:0 0 64px">${b2}</div>
${sec('Weight: the line marks')}
${p('In our blur, a 1.5px line can\'t get darker than about 58 and the solid places reach 75, so the Star and the + read light. You found 1.5px too light and the heavier row far too heavy; the line marks drew at 1.75px in v130, which you found close but still too heavy; they now draw at 1 2/3px. The Weight board, to the right, shows the new row between both rows you saw.')}
<div style="margin:0 0 64px"></div>
${sec('Material and Phosphor: for comparison, not a craft benchmark')}
<div style="${grid}">${head}${SETS.slice(1).map(row).join('')}</div>
</div>`;
}
function page(W_) { return { css: CSS(W_), cards: [sheetIntro(0), sheetSet(W_, 1), sheetDrawings(W_, 2), sheetCorners(W_, 3), sheetApp(4), sheetAir(W_, 5), sheetGrid(W_, 6), sheetWeight(W_, 7)] }; }
const NAMES7 = ['Grid7Intro', 'Grid7Set', 'Grid7Drawings', 'Grid7Corners', 'Grid7App', 'Grid7Air', 'Grid7Grid', 'Grid7Weight'];
const TITLES7 = ['Batch 1, redrawn to the craft bar', 'The set, at real size', 'Each drawing, before and after', 'The corners, on the redrawn set', 'In the app, real size', 'The air in the ring', 'The grid, changed by the redraw', 'Weight: the line marks'];

if (require.main === module) {
  {
    const { css, cards } = page(390);
    fs.writeFileSync(path.join(ROOT, 'cards-g7.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=390"><title>Grid round 7: batch 1 redrawn</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&display=swap">
<style>body{margin:0;background:#E4DCCB}${css}</style></head><body><div class="cards">${cards.join('\n')}</div></body></html>\n`);
    for (const [f, fn, ttl] of [['master-g7.html', sheetMaster, 'The master grid'], ['taper-g7.html', sheetTaper, 'The taper'], ['human-g7.html', sheetHuman, 'More human, by rule'], ['start-g7.html', sheetStart, 'Start here'], ['decide-tunings-g7.html', sheetDecideTunings, 'Decide: more human?'], ['decide-coupe-g7.html', sheetDecideCoupe, 'Decide: the coupe'], ['between-g7.html', sheetBetween, 'Between H2 and H3'], ['originals-g7.html', sheetOriginals, 'Every icon: original and newest']]) fs.writeFileSync(path.join(ROOT, f), `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${ttl}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&display=swap">
<style>body{margin:0}</style></head><body>${fn()}</body></html>\n`);
    fs.writeFileSync(path.join(ROOT, 'board-g7.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Batch 1, the set</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&display=swap">
<style>body{margin:0}</style></head><body>${sheetLook()}</body></html>\n`);
  }
  const out = process.argv[2];
  if (out) {
    const W_ = 760;
    REL = { stamp: path.join(ROOT, '../inventory-png/row-stamp.png'), sticker: path.join(ROOT, '../inventory-png/sticker-near.png') };
    const m = page(W_);
    REL = JSON.parse(process.env.ASSETS || '{}');
    const { css, cards } = page(W_);
    fs.mkdirSync(path.join(out, 'project'), { recursive: true });
    cards.forEach((html, i) => fs.writeFileSync(path.join(out, 'project', NAMES7[i] + '.dc.html'), `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${TITLES7[i]}</title>
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
    fs.writeFileSync(path.join(out, 'project', 'Grid7Look.dc.html'), `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Batch 1, the set</title>
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
${sheetLook()}
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":1600,"height":1000}}'>
class Component extends DCLogic {
renderVals() { return {}; }
}
</script>
</body>
</html>
`);
    for (const [nm, fn, ttl] of [['Grid7Master', sheetMaster, 'The master grid'], ['Grid7Taper', sheetTaper, 'The taper'], ['Grid7Human', sheetHuman, 'More human, by rule'], ['Grid7Start', sheetStart, 'Start here'], ['Grid7DecideTunings', sheetDecideTunings, 'Decide: more human?'], ['Grid7DecideCoupe', sheetDecideCoupe, 'Decide: the coupe'], ['Grid7Between', sheetBetween, 'Between H2 and H3'], ['Grid7Originals', sheetOriginals, 'Every icon: original and newest']]) fs.writeFileSync(path.join(out, 'project', nm + '.dc.html'), `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${ttl}</title>
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
${fn()}
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":${(fn().match(/width:(\d+)px/) || [, 1600])[1]},"height":1000}}'>
class Component extends DCLogic {
renderVals() { return {}; }
}
</script>
</body>
</html>
`);
    fs.writeFileSync(path.join(out, 'boards.json'), JSON.stringify(NAMES7.map((nm, i) => ({ file: nm + '.dc.html', title: TITLES7[i] })), null, 1));
    fs.writeFileSync(path.join(out, 'measure.html'), `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0}${m.css}.card{margin:0}</style></head><body><div class="cards">${m.cards.join('')}</div></body></html>`);
  }
  console.log('caps', LAWS.map(l => l + ' ' + BATCH.map(([id]) => GD[l][12][id].caps).join('/') + ' +' + UD[l].plus.caps + ' star' + UD[l].star.caps).join(' | '));
  console.log('ok', BATCH.map(([id]) => `${id} ink ${ink(GD.joint[12][id].d).toFixed(1)}% ty ${GD.joint[12][id].ty.toFixed(2)} tx ${GD.joint[12][id].tx}`).join(' · '));
}
