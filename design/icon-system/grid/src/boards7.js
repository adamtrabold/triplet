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
  const sStar = starRc(lw('star')) * 24 / 20 / 9.6 * (o.k || 1);
  const ui = { star: E.build(star(20, sStar, lw('star')), { law: scaled(LAWS7.joint, 24 / 20) }).d, plus: E.build(plus(26.4, USC.plus * (o.k || 1), lw('plus')), { law: scaled(LAWS7.joint, 24 / 26.4) }).d };
  WSET[key] = { cafe: GD.joint[12].cafe.d, bar, museum: GD.joint[12].museum.d, nature: GD.joint[12].nature.d, ...ui };
  const dir = path.join(ROOT, 'svg', 'g7', `weight-${key}`); fs.mkdirSync(dir, { recursive: true });
  for (const id of ['cafe', 'bar', 'museum', 'nature']) fs.writeFileSync(path.join(dir, `${id}-24.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11.25" fill="none" stroke="currentColor" stroke-width="1.5"/><path fill="currentColor" d="${WSET[key][id]}"/></svg>\n`);
  for (const [k, px] of [['star', 20], ['plus', 26.4]]) fs.writeFileSync(path.join(dir, `${k}-${px}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 24 24"><path fill="currentColor" d="${WSET[key][k]}"/></svg>\n`);
}
// measured with src/blur-measure.js on each weight-<opt> folder (the darkest fifth of the live circle, 1.5px blur)
const WBLUR = JSON.parse(fs.existsSync(path.join(ROOT, 'svg', 'g7', 'weight-blur.json')) ? fs.readFileSync(path.join(ROOT, 'svg', 'g7', 'weight-blur.json'), 'utf8') : '{}');
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
<div class="lab">Large (8x)</div>
${WOPTS.map(([key, title]) => `<div class="srow"><div class="k">${title}</div><div class="set big">${ids.map(id => cell(key, id, big)).join('')}</div></div>`).join('')}
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
const COUPES = [
  ['v134', 'As shipped', {}],
  ['A: taller stem', 'The bowl as shipped, the stem a line longer (the glass fills its square).', { fb: 11.75 }],
  ['B: flatter bowl', 'A pancaked bowl (depth 5 1/2, sides falling fast into a wide flat bottom); the drink a thin layer, read by its surface.', { bd: 5.5, bk: 0.35, bx: 0.5, fb: 10.333 }],
  ['C: both', 'The flat bowl on the long stem.', { bd: 5.5, bk: 0.35, bx: 0.5, fb: 11.75 }],
];
const EASE = 2.3;
const HSETS = [
  ['Now (v134): monoweight', 'The set as it is. Every round is a compass arc: its curvature jumps where it meets a line.', {}, LAWS7.joint, 1, false, 0],
  ['H1: monoweight, eased curves', 'A CURVE RULE for every icon: each outside round and join starts 2.3 times farther from its corner and eases out of the line with no jump in curvature, a hand\'s stroke rather than a compass arc; the corner is about as deep as before. Counter corners stay tight. Reaches all eight: every outside corner and join of the cup, coupe, museum, tree, + and Star. At true size this is subtle; it shows in the corners at 7x.', {}, LAWS7.joint, 1, true, EASE],
  ['H2: monoweight, eased curves, a domed foot, drooping branches, and air', 'H1, plus: a foot that holds a glass up by its stem is a DOME (the coupe); a tier\'s underside lifts toward the trunk by half a line (the tree); and the fit stops at 11/12 of the cut, so every glyph sits with more air. The cup, museum, + and Star change by the curve rule and the air only.', { droop: 0.5, dome: true }, LAWS7.joint, 11 / 12, true, EASE],
  ['H3: monoweight relaxed: free posts 1 1/4, flaring into their joins', 'H2, plus: a post that stands free (the coupe\'s stem, the trunk) thins to 1 1/4px and flares into the mass it meets with a round of one line, as batch 1\'s stem did; the cup\'s handle joins flare the same way. The museum, + and Star change by the curve rule and the air only. The v123 tree changes: its trunk flares into the lowest tier.', { droop: 0.5, dome: true, post: 1.25 }, HUMAN({ flare: 1.5, mass: 0.6, end: 0.3 }), 11 / 12, true, EASE],
].map(([nm, rule, o, law, fk, bal, ease]) => {
  const opts = { law, tightHoles: true, ease: ease || undefined };
  const fitPlace = (id, extra = {}) => {
    const [cls, apex] = CLASS[id], kw = KEY[cls][0] * fk, bh = (KEY[cls][1] + apex) * fk, dr = s => DRAW[id](s, { style: 'mono', ...o, ...extra });
    let s = 12; for (let k = 0; k < 6; k++) { const b = measure(E.build(dr(s), opts).d).box; s *= Math.min(kw / (b.x1 - b.x0), bh / (b.y1 - b.y0)); }
    const ox = (24 - s) / 2, oy = r3((24 - s) / 2), prims = dr(s), m = measure(E.build(E.xform(prims, 1, 0, 0, ox, oy), opts).d);
    return E.build(E.xform(prims, 1, 0, 0, ox + r4(12 - (m.box.cx + m.cx) / 2), oy + r3(12 - (m.box.cy + m.cy) / 2)), opts).d;
  };
  const ds = {};
  for (const [id] of BATCH) ds[id] = fitPlace(id);
  ds.star = bal ? starAt({ ease: ease || undefined, tightHoles: true }) : UD.joint.star.d;
  ds.plus = ease ? E.build(plus(26.4, USC.plus, LINEW), { law: scaled(LAWS7.joint, 24 / 26.4), ease }).d : UD.joint.plus.d;
  const coupes = COUPES.map(([, , co]) => fitPlace('bar', co));
  return { nm, rule, ds, coupes, ease };
});
// checks on every tuned glyph: counters (distance and direction), and the CURVE CHECK: at every smooth join
// (where the outline's direction is continuous), the jump in curvature between the two sides, 1/px
function curveJump(d) {
  const cp = new paperLib.CompoundPath(d), kids = cp.children && cp.children.length ? cp.children : [cp];
  let worst = 0, n = 0;
  for (const k of kids) { if (kids.some(o => o !== k && o.contains(k.firstSegment.point))) continue;   // outlines only: counters keep tight compass rounds
    const cv = k.curves; for (let q = 0; q < cv.length; q++) {
    const a = cv[q], b = cv[(q + 1) % cv.length], ta = a.getTangentAtTime(1), tb = b.getTangentAtTime(0);
    if (Math.abs(ta.getDirectedAngle(tb)) > 2) continue;
    const ka = Math.abs(a.getCurvatureAtTime(1)), kb = Math.abs(b.getCurvatureAtTime(0)); if (!isFinite(ka) || !isFinite(kb)) continue;
    worst = Math.max(worst, Math.abs(ka - kb)); n++;
  } }
  cp.remove(); return { worst, n };
}
const paperLib = require(path.join(process.env.TOOLS || '/tmp/claude-0/-home-user-la-trip-map/04f8fb34-0476-5960-add5-8bd3d6d8820e/scratchpad/tools', 'node_modules/paper/dist/paper-core.js'));
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
    return `Counters: ${off} of ${nn} wall points off${who ? ` (${who})` : ''}, worst turn ${md.toFixed(1)}°. Outlines: worst curvature jump at a smooth join ${Math.max(...cj.map(c => c.worst)).toFixed(2)}/px over ${cj.reduce((a, c) => a + c.n, 0)} joins.`;
  };
  const setRow = S => `<div style="display:grid;grid-template-columns:330px 1fr;gap:28px;padding:22px 0;border-top:1px solid ${COL.hair}">
<div><div style="font-size:21px;font-weight:700;color:${N};margin-bottom:6px">${S.nm}</div><div style="font-size:16px;line-height:1.45;color:${I2}">${S.rule}</div><div style="font-size:13px;line-height:1.4;color:${I2};margin-top:8px">${checks(S)}</div></div>
<div><div style="display:flex;gap:24px;align-items:flex-start">${inApp(S)}<div><div style="display:flex;gap:14px;align-items:center">${BATCH.map(([id]) => badge(S.ds[id])).join('')}${uiD(S.ds.plus, 26.4)}${uiD(S.ds.star, 20)}<span style="width:12px"></span>${BATCH.map(([id]) => chip12(S.ds[id])).join('')}</div>
<div style="display:flex;gap:10px;margin-top:14px;align-items:center;flex-wrap:wrap">${BATCH.map(([id]) => badge(S.ds[id], 168)).join('')}${uiD(S.ds.plus, 185)}${uiD(S.ds.star, 140)}</div></div></div></div></div>`;
  // the coupe options in every row, with their drink and checks
  const cHead = `<div></div>${COUPES.map(([nm, txt]) => `<div><div style="font-size:17px;font-weight:700;color:${N}">${nm}</div><div style="font-size:13px;line-height:1.35;color:${I2}">${txt}</div></div>`).join('')}`;
  const cRow = S => `<div style="font-size:16px;font-weight:700;color:${N};align-self:center">${S.nm.split(':')[0]}</div>${S.coupes.map(d => { const r = DRINK(d), b = measure(d).box, oc = OCHECK(d, 1.5).holes[0]; return `<div style="display:flex;flex-direction:column;gap:6px;align-items:flex-start"><div style="display:flex;gap:8px;align-items:center">${badge(d)}${badge(d, 120)}</div><div style="font-size:13px;line-height:1.4;color:${I2}">${(b.x1 - b.x0).toFixed(2)} × ${(b.y1 - b.y0).toFixed(2)} · drink ${r.area.toFixed(1)}px², surface ${r.surface.toFixed(1)}px · counter ${oc.off}/${oc.n} off${oc.offD ? `: ${oc.offD} by distance, the thin drink\'s floor, which sits under 1.5 lines from the bowl\'s underside, so the check counts it as a wall (an artefact of the check, not a fault in the wall)` : ''}${oc.offA ? `${oc.offD ? ';' : ':'} ${oc.offA} by direction, beside the band\'s lower corners, where the drink meets the wall (worst ${oc.maxDir.toFixed(1)}°)` : ''}</div></div>`; }).join('')}`;
  return `<div style="width:1600px;box-sizing:border-box;padding:56px 64px 64px;background:${COL.raised};font-family:Archivo,Arial,sans-serif;color:${COL.ink}">
<div style="font-size:14px;letter-spacing:.12em;font-weight:700;color:${I2};text-transform:uppercase">Icon grid · an exploration, nothing ships unless you pick it</div>
<h1 style="margin:6px 0 10px;font-size:44px;line-height:1.1;color:${N}">More human, by rule</h1>
<p style="margin:0 0 18px;font-size:19px;line-height:1.45;max-width:1200px">You said: "i still find myself pining for that original shape. i think it's the fact that it feels more delicate. that more humanistic approach to curves gives it a handmade feel that i think calls back to the physicality of making vintage work." Below, the set as it is and three tunings of the whole set, each a grid rule applied to all of them, in the app at true size, then at 7x. Counters and the size classes stay as they are. Then the coupe, three ways (you: "the taller stem or more pancaked bowl really sell coupeness"), in the current drawing.</p>
<div style="margin:0 0 36px;padding:24px 28px;background:${COL.paper};border-top:4px solid ${O}"><div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${COL.ord};text-transform:uppercase;margin-bottom:8px">The questions</div><div style="font-size:26px;line-height:1.3;color:${N};font-weight:600">${H_Q}</div><div style="font-size:22px;line-height:1.3;color:${N};font-weight:600;margin-top:10px">And the coupe: which of A, B or C reads most like a coupe?</div></div>
<div style="display:grid;grid-template-columns:330px 1fr;gap:28px;align-items:center;margin:0 0 30px">
<div>${title('The feeling: batch 1\'s coupe')}<div style="font-size:16px;line-height:1.45;color:${I2}">Shown for the feeling only, not as a target. What made it feel drawn by hand: a <b>thin stem that flared</b> into the bowl and the foot, a <b>domed foot</b>, a bowl that was one <b>full curve</b>, and, in its tree, <b>drooping</b> branches. The tunings carry these as rules to every icon.</div></div>
<div style="display:flex;gap:18px;align-items:center">${badge(b1)}${badge(b1, 168)}</div></div>
${HSETS.map(setRow).join('')}
<div style="margin-top:44px">${title('The coupe, three ways, in the current drawing: true size, then 5x')}<div style="display:grid;grid-template-columns:150px repeat(4, 1fr);gap:18px 20px;align-items:start">${cHead}${cRow(HSETS[0])}</div>
<div style="font-size:14px;color:${I2};margin-top:10px">Every coupe stays in the square class, monoweight, the band the stroke's height with its sides one line in from the bowl. A flat bowl (B, C) leaves room for only a thin drink under the band, read by its surface, not its depth.</div><div style="font-size:16px;color:${N};font-weight:600;margin-top:10px">The trade in C: its drink is ${DRINK(HSETS[0].coupes[3]).area.toFixed(1)}px², below v130's 14.2px², which you once called too little; but your newest note blames the depth for the wine-glass look, and a flat bowl can only hold a shallow drink.</div></div>
${REFS.map(([nm, rs]) => `<div style="display:grid;grid-template-columns:330px 1fr;gap:28px;padding:22px 0;border-top:1px solid ${COL.hair};margin-top:30px">
<div><div style="font-size:21px;font-weight:700;color:${N};margin-bottom:6px">${nm.split(' (')[0]}</div><div style="font-size:16px;line-height:1.45;color:${I2}">For comparison, not a craft benchmark: in our badge, at our box.</div></div>
<div><div style="display:flex;gap:14px;align-items:center">${rs.slice(0, 4).map(r => refInBadge(r)).join('')}${refBare(rs[4], 26.4)}${refBare(rs[5], 20)}</div>
<div style="display:flex;gap:10px;margin-top:14px;align-items:center">${rs.slice(0, 4).map(r => refInBadge(r, 168)).join('')}${refBare(rs[4], 185)}${refBare(rs[5], 140)}</div></div></div>`).join('')}
<div style="display:grid;grid-template-columns:1fr 1fr;gap:48px;margin-top:36px">
<div>${title('Rules that bend')}<div style="font-size:16px;line-height:1.5">
<p style="margin:0 0 10px"><b>The corner law</b> keeps its radii in every tuning; H1 to H3 change only how a round meets its lines (eased, not a compass arc).</p>
<p style="margin:0 0 10px"><b>Interior tighter than exterior</b> (your rule) bends in H3 only, at one kind of corner: where a thin post flares into a mass. Counters, slots and the tree's notches stay tight in every tuning.</p>
<p style="margin:0 0 10px"><b>Every base is a slab</b> gains one exception in H2 and H3: a foot that holds something up by a stem is a DOME (the coupe now; a lamp, a trophy, a bell later). The saucer and the plinth stay slabs.</p>
<p style="margin:0 0 10px"><b>Monoweight</b> (your pick) holds in H1 and H2; H3 relaxes it for free-standing posts only, and says so in its name.</p>
<p style="margin:0"><b>The Outline class</b>: in H1 to H3 the star's points reach as far as the +'s arms (the shipped star's 4px hole minimum made it 15% wider than v133); its hole is then about 2 lines.</p></div></div>
<div>${title('Craft bar, and comparisons')}<div style="font-size:16px;line-height:1.5">The craft bar, for finish and construction rigour rather than style: Central, Nucleo, Lucide and Apple's published method. None is copied; Lucide glyphs may appear only labelled "craft reference". Material and Phosphor are shown above for comparison, not as a craft benchmark (you: "just to see how much *better* ours are").</div></div></div>
</div>`;
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
const { drink: DRINK } = require('./drink-measure.js');
const { check: OCHECK, overlay: OVERLAY } = require('./offset-check.js');
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
    for (const [f, fn, ttl] of [['master-g7.html', sheetMaster, 'The master grid'], ['taper-g7.html', sheetTaper, 'The taper'], ['human-g7.html', sheetHuman, 'More human, by rule']]) fs.writeFileSync(path.join(ROOT, f), `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${ttl}</title>
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
    for (const [nm, fn, ttl] of [['Grid7Master', sheetMaster, 'The master grid'], ['Grid7Taper', sheetTaper, 'The taper'], ['Grid7Human', sheetHuman, 'More human, by rule']]) fs.writeFileSync(path.join(out, 'project', nm + '.dc.html'), `<!doctype html>
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
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":1600,"height":1000}}'>
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
