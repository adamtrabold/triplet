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
const { LAWS7, LAW_NAMES, scaled, fit, TRAP } = require('./laws7.js');
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
  const holeRc = (lw + mitreValley) / 0.47;                                              // the hole's centre 2 lines across
  return Math.max(hullTip - mitreTip, holeRc);
};
const USC = {
  star: starRc() * 24 / 20 / 9.6,
  plus: KEY.OPEN[0] / 14,
};
const UD = {}; for (const law of LAWS) { UD[law] = {}; for (const [k, [fn, px]] of Object.entries(UIP)) { const info = []; UD[law][k] = E.build(fn(px, USC[k]), { law: scaled(LAWS7[law], 24 / px), info }); UD[law][k].caps = info.filter(x => x.cap).length; } }
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
    ['Contrast compensation', 'horizontals are drawn about 10% thinner than uprights (1.33px against 1.5px), because a horizontal reads heavier.'],
    ['Pixel fitting', 'horizontals are 4/3px, exactly 4 device pixels on a 3x phone, and sit on whole device pixels.'],
    ['Size by class (g7i, ours)', 'every glyph is fitted by the grid to a cut of one 12px coin with the coin\'s area (wide, square, tall, round, outline, open), so none reads bigger; no per-icon sizes.'],
    ['Root shapes (g7i)', 'like parts share one shape in every icon: slab, post, gable, vessel, loop.'],
  ];
  return `<section class="card" id="c${n}"><div class="no">Grid · round 7 · batch 1 redrawn · sheet ${n}</div><h2>Batch 1, redrawn to the craft bar</h2>
<div class="q long"><b>You said (on batch 1)</b>"${Q_CRAFT}"</div>
<div class="q"><b>And</b>"${Q_PRACTICE}"</div>
<p class="att">The same six (café, bar, museum, nature, the + and the Star), redrawn at 1.5px. Every change below comes from an established icon-design practice, named where it's used:</p>
<ul class="facts">${P.map(([k, v]) => `<li><b>${k}:</b> ${v}</li>`).join('')}</ul>
<p class="sm"><b>Sheet 1 is the set</b>, judged together at real size, (two mature sets appear only as a craft comparison, never as a size reference). Sheet 2 is each drawing, before and after. Sheet 6 is the grid, changed by this redraw.</p>
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
<div class="lab">Ours, then Material, then Phosphor: 24px and 12px, at 1x</div>
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

const HANDLE = `<div class="lab">The handle: the ear (now) beside the g7 ring and both reference cups, at 24 and 3x</div>
<div class="set">${badge(GD.joint[12].cafe.d)}${badge(RING.d)}${refInBadge(REFS[0][1][0])}${refInBadge(REFS[1][1][0])}</div>
<div class="set big">${badge(GD.joint[12].cafe.d, 72)}${badge(RING.d, 72)}${refInBadge(REFS[0][1][0], 72)}${refInBadge(REFS[1][1][0], 72)}</div>
<p class="sm"><b>Kept: the ear.</b> At 24 it reads as a handle joined to the cup, as both references do; the ring read as a separate bubble.</p>`;
// ---- sheet 2: each drawing ----------------------------------------------------------------------
const PRIN = {
  cafe: [['Counters', 'the handle is a loop joined to the cup over its height; its counter is 2.25 x 2.67px (taller than wide, so it reads as a loop, not a "P"), closed by the cup: no passage (your example).'], ['Flow', 'cup and handle are one outline: the bowl\'s right side rises in one smooth S-curve into the base of the handle, with no step where they meet.'], ['Proportion', 'cup 6.75 wide by 7 deep; the handle grows with it so the S into it stays gentle; the saucer runs the full width.'], ['Size (g7i)', 'Wide class, 12 x 9 1/3, fitted by the grid.'], ['Root shapes (g7i)', 'a vessel with a loop for its ear, on a slab saucer (it was a tapered blade).'], ['Contrast compensation and pixel fitting', 'the saucer is a slab, 4/3px, on whole device pixels.'], ['Optical centring', 'moved down 1/3px.']],
  bar: [['Proportion', 'a shallow bowl on one upright stem; the foot about 70% of the bowl.'], ['Size (g7i)', 'Square class, 10 2/3, fitted by the grid (no per-icon height).'], ['Root shapes (g7i)', 'a vessel on a post stem and a slab foot (it was a dome).'], ['Liquid (g7i)', 'under the rim a clear band, 1.5px (the counter minimum; g7k, more drink), closed by the walls at both ends; the drink fills the bowl below it, so it reads as a glass, not a chalice (your note), and its top is no longer one dark mass.'], ['Joins', 'the stem meets bowl and foot with the slightest round (0.15px), so the joins settle without thickening; the bowl\'s rim corners take the outside round.'], ['Optical centring', 'its mass is at the top, so it moves down 2/3px (batch 1 floated).']],
  museum: [['Counters', 'the spaces between the columns are closed upright slots, 1.5px wide, their corners slightly round: no pills (your example), no gap under the line.'], ['Proportion', 'between g7 and g7b: a low pediment (about 22°) set on a thin 4/3px beam; the four columns hang from the beam and stand on the plinth, so they read as a building, as both references do. Three columns were tried in g7 and read as a box with two doors.'], ['Size (g7i)', 'Wide class, 12 x 9 1/3, its apex passing by 1/2px, fitted by the grid.'], ['Root shapes (g7i)', 'a gable on a slab beam, four posts, a slab plinth: unchanged, the shapes the rest now share.'], ['Pixel fitting', 'the plinth is a 4/3px horizontal on whole device pixels.'], ['Optical centring', 'moved up 1px.']],
  nature: [['Overshoot', 'the pointed tip rises 1/2px above TOP.'], ['Joins', 'the trunk meets the lowest tier with the slightest round.'], ['Size (g7i)', 'Tall class, 9 1/3 x 12, its tip passing by 1/2px.'], ['Root shapes (g7i)', 'three gables on a post trunk; each tier\'s base is now flat (it rose 0.4px to the trunk), the same gable as the pediment.'], ['Proportion', 'three triangles widening by equal steps, each with a short overhang, so a tier ends in a proper point, not a spur; the points take the outside round (0.35px) and the notches a tighter one (0.15px), so the inside reads tighter than the outside (your note on the tree); no hooks, never needle-sharp.'], ['Optical centring', 'moved up 1/3px.']],
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
  const uis = [['plus', 'The +', 'Uprights 1.5px, the horizontal 4/3px (contrast compensation). The crossing takes the slightest round (0.15px), no notch.'], ['star', 'The Star (not starred)', 'A 1.5px outline. Its counter (the inner star) is 6px across, so it survives at 20px; the tips take a slight round and the inner corners a tighter one.']]
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
${ch('Change 15 (g7i)', 'size by class: the token', 'Ours: a glyph is struck like a token, a 12px coin inside the badge\'s ring with 2px of air. Every glyph is fitted by the grid to a cut of the coin with the coin\'s area: Wide 12 x 9 1/3 (cup, museum), Square 10 2/3 (coupe), Tall 9 1/3 x 12 (tree), Outline for outline marks (the Star: hull at least the coin, hole at least two lines across; g7j) and Open for line-only marks (the +: arms across the coin, every line 1.5px). A lone apex passes by 1/2px. No icon has its own size number; a new icon picks its class. Drawn on the main board.', '')}
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
const WOPTS = [
  ['now', 'As they are', 'Every line 1.5px, the same as the badge ring.', { lw: W, band: true, wall: W }],
  ['open', 'Heavier line marks', 'The star\'s outline 2px and the +\'s arms 2.5px (the + in the app today is 2.5); the star grows a little so its hole stays two lines wide; the coupe\'s walls around its clear band 2.5px. The other place icons don\'t change.', { lw: { star: 2, plus: 2.5 }, band: true, wall: 2.5 }],
];
const WSET = {};
for (const [key, , , o] of WOPTS) {
  const lw = k => typeof o.lw === 'number' ? o.lw : o.lw[k];
  const barS = fitS('bar', 12, { bar: s => DRAW.bar(s, o) });
  const prims = DRAW.bar(barS, o), ox = (24 - barS) / 2, oy = r3((24 - barS) / 2);
  const m = measure(E.build(E.xform(prims, 1, 0, 0, ox, oy), { law: LAWS7.joint }).d);
  const bar = E.build(E.xform(prims, 1, 0, 0, ox + r4(12 - (m.box.cx + m.cx) / 2), oy + r3(12 - (m.box.cy + m.cy) / 2)), { law: LAWS7.joint }).d;
  const sStar = starRc(lw('star')) * 24 / 20 / 9.6;
  const ui = { star: E.build(star(20, sStar, lw('star')), { law: scaled(LAWS7.joint, 24 / 20) }).d, plus: E.build(plus(26.4, USC.plus, lw('plus')), { law: scaled(LAWS7.joint, 24 / 26.4) }).d };
  WSET[key] = { cafe: GD.joint[12].cafe.d, bar, museum: GD.joint[12].museum.d, nature: GD.joint[12].nature.d, ...ui };
  const dir = path.join(ROOT, 'svg', 'g7', `weight-${key}`); fs.mkdirSync(dir, { recursive: true });
  for (const id of ['cafe', 'bar', 'museum', 'nature']) fs.writeFileSync(path.join(dir, `${id}-24.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11.25" fill="none" stroke="currentColor" stroke-width="1.5"/><path fill="currentColor" d="${WSET[key][id]}"/></svg>\n`);
  for (const [k, px] of [['star', 20], ['plus', 26.4]]) fs.writeFileSync(path.join(dir, `${k}-${px}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 24 24"><path fill="currentColor" d="${WSET[key][k]}"/></svg>\n`);
}
// measured with src/blur-measure.js on each weight-<opt> folder (the darkest fifth of the live circle, 1.5px blur)
const WBLUR = JSON.parse(fs.existsSync(path.join(ROOT, 'svg', 'g7', 'weight-blur.json')) ? fs.readFileSync(path.join(ROOT, 'svg', 'g7', 'weight-blur.json'), 'utf8') : '{}');
const W_Q = "The + and the star are drawn in the same thin line as the badge ring, so they read lighter than the solid place icons. The star\'s outline is how \'not starred yet\' reads. Do they feel right as they are (top row), or do you want them heavier (second row)? And in each row, does the coupe feel the same weight as the others? (In the second row its walls are heavier too.)";
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
  const head = key => `<div class="wl" style="font-size:14px;margin:0 0 4px">${name(key)[1]}</div><p class="sm" style="margin:0 0 6px;min-height:${W_ > 500 ? 72 : 120}px">${name(key)[2]}</p>`;
  const nm = id => id === 'plus' ? '+' : id === 'cafe' ? 'cup' : id === 'bar' ? 'coupe' : id === 'nature' ? 'tree' : id;
  const foot = WOPTS.map(([key, title]) => { const b = WBLUR[key] || {}, v = ids.map(id => b[id]).filter(x => x != null); return `${title}: ${ids.map(id => `${nm(id)} ${b[id] != null ? b[id].toFixed(0) : '?'}`).join(', ')} (spread ${v.length ? (Math.max(...v) - Math.min(...v)).toFixed(0) : '?'})`; }).join('. ');
  return `<section class="card" id="c${n}"><div class="no">Grid · round 7 · g7j · sheet ${n}</div><h2>Weight: the line marks</h2>
<div class="q"><b>The question</b>${W_Q}</div>
<div class="lab">True size, where they live</div>
<div class="pair" style="align-items:start">${WOPTS.map(([key]) => `<div style="text-transform:none;letter-spacing:0;align-items:stretch;text-align:left;font-weight:400;color:${COL.ink}">${head(key)}${live(key)}</div>`).join('')}</div>
<div class="lab">Large (8x)</div>
${WOPTS.map(([key, title]) => `<div class="srow"><div class="k">${title}</div><div class="set big">${ids.map(id => cell(key, id, big)).join('')}</div></div>`).join('')}
<p class="sm mute" style="margin-top:14px">Blurred darkness, measured (the darkest fifth of the live circle after a 1.5px blur; src/blur-measure.js): ${foot}.</p>
</section>`;
}

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
      name: nm.split(' (')[0], sub: nm.includes('Material') ? 'Google\'s set, for comparison' : 'for comparison',
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
    if (id === 'star') { const cy = t + (12 + 0.6 * USC.star) * k, ri = (0.47 * 9.6 * USC.star) * k - (W / 2) / Math.sin(3 * Math.PI / 10); o = cut(`<circle cx="12" cy="${f2(cy)}" r="6"/><circle cx="12" cy="${f2(cy)}" r="${f2(ri)}"/>`); }
    else { const s = KEY.OPEN[0] * k; o = cut(`<rect x="${f2(12 - s / 2)}" y="${f2(12 - s / 2)}" width="${f2(s)}" height="${f2(s)}"/>`); }
    return `<svg width="${px}" height="${px}" viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" fill="${COL.paper}"/>${g}${o}</svg>`;
  }
  const [cls, apex] = CLASS[id], [kw, kh] = KEY[cls], b = measure(GD.joint[12][id].d).box, cx = (b.x0 + b.x1) / 2;
  let o = `<rect x="${f2(cx - kw / 2)}" y="${f2(b.y1 - kh)}" width="${f2(kw)}" height="${f2(kh)}"/>`;
  if (apex) o += `<line x1="${f2(cx - 2)}" y1="${f2(b.y1 - kh - apex)}" x2="${f2(cx + 2)}" y2="${f2(b.y1 - kh - apex)}"/>`;
  return badge(GD.joint[12][id].d, px, cut(o));
}
const clsLabel = id => { const [cls, apex] = CLASS[id], [kw, kh] = KEY[cls]; return `${CLS_NAME[cls]}${cls === 'OUTLINE' ? ': hull at least the coin; hole at least 2 lines across (the hole decides)' : cls === 'ROUND' ? ': hull = the coin\'s area' : cls === 'OPEN' ? `: arms span ${fr(kw)}` : `: ${fr(kw)} × ${fr(kh)}`}${apex ? ', apex +1/2' : ''}`; };
// like parts pulled out of the set, each at 8x, by root shape
function rootRows(px = 8) {
  const parts = { SLAB: [], POST: [], GABLE: [], VESSEL: [], LOOP: [] };
  const NM = { cafe: 'Café', bar: 'Bar', museum: 'Museum', nature: 'Nature', plus: '+', star: 'Star' };
  for (const [id] of BATCH) {
    const pr = DRAW[id](SFIT[12][id]), cuts = pr.filter(p => p.cut);
    pr.forEach(p => { if (p.cut) return; for (const r of [p.root, p.also]) if (r && parts[r]) parts[r].push([NM[id], r === 'VESSEL' && p.also === 'LOOP' ? [p, ...cuts.filter(c => c.t === 'D')] : r === 'VESSEL' ? [p, ...cuts] : [p]]); });
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
<div style="font-size:14px;letter-spacing:.12em;font-weight:700;color:${COL.ink2};text-transform:uppercase">Icon set · the first six · grid changes g7i and g7j</div>
<h1 style="margin:6px 0 10px;font-size:44px;line-height:1.1;color:${COL.navy}">One token, five root shapes</h1>
<p style="margin:0 0 36px;font-size:19px;line-height:1.45;max-width:1200px">You asked for size and root shape to come from the grid, not from icon-by-icon fixes. This adds both to the grid: how big a glyph is now comes from its shape class, and parts that do the same job are cut from the same shape. Latest change (g7j): an <b>Outline</b> size class for the Star, sized so its hole always stays open (an outline means "not starred yet"), and a rule for <b>stacked gables</b>: every notch in the tree is the same depth, one and a half lines (g7k: deeper, so the tiers read at 100%). Before is v105; now is the same six, refitted by the rules. Every icon is a live vector: zoom in on the canvas.</p>
<div style="margin:0 0 56px;padding:28px 32px;background:${COL.paper};border-top:4px solid ${COL.or}">
<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${COL.ord};text-transform:uppercase;margin-bottom:8px">The question</div>
<div style="font-size:28px;line-height:1.3;color:${COL.navy};font-weight:600">${LOOK_Q}</div></div>
${sec('True size, where they live in the app: before and now')}
<div style="display:grid;grid-template-columns:repeat(2, 1fr);column-gap:48px;margin-bottom:64px">${[V105SET, NOWSET].map(inPlace).join('')}</div>
${sec('Grid change 1: size by class, the token')}
${p('Every glyph is fitted by the grid, never by hand, to a cut of one 12px coin with the coin\'s area: <b>Wide</b> 12 × 9 1/3, <b>Square</b> 10 2/3, <b>Tall</b> 9 1/3 × 12, <b>Outline</b> for outline marks (the Star, whose outline means "not yet tapped": the hull through its tips at least the coin\'s area, and its hole at least two lines across, so it never reads as filled; at 1.5px the hole decides), and <b>Open</b> for marks made only of lines (the +: its arms span the coin and every line is the full 1.5px, no thinner horizontal). A lone apex (the pediment, the tree\'s tip) passes the cut by 1/2px. The drawing sets proportions; the class sets size. A new icon picks its class and is fitted the same way.')}
<div style="margin:0 0 64px">${tokenRow}</div>
${sec('Grid change 2: root shapes, like parts cut from one shape')}
${p('Before, the three bases were three shapes: a tapered blade, a dome and a slab (your example). Now every base is the same slab, every bowl the same vessel, every roof and tier the same gable, every upright the same post, every handle and outline the same loop. Where gables stack (the tree), every notch shows the same shelf, one and a half lines (2.25px) deep; the tiers\' apexes follow from that. The coupe\'s bowl now holds a drink under a clear band, so it reads as a glass, not a chalice.')}
<div style="display:grid;grid-template-columns:330px 1fr;align-items:end;gap:24px;padding:0 0 18px"><div style="font-size:19px;font-weight:700;color:${COL.ink2};align-self:center">Bases before (v105)</div><div style="display:flex;flex-wrap:wrap;gap:28px;align-items:flex-end">${basesBefore()}</div></div>
${rootRows()}
<div style="margin:0 0 64px"></div>
${sec('What about the grid is ours')}
<div style="display:grid;grid-template-columns:repeat(2, 1fr);gap:20px 48px;margin:0 0 64px">${OURS.map(([h, t]) => `<div><div style="font-size:20px;font-weight:700;color:${COL.navy};margin-bottom:6px">${h}</div><div style="font-size:17px;line-height:1.45">${t}</div></div>`).join('')}</div>
${sec('Large (8x): before and now')}
<div style="${grid};margin-bottom:64px">${head}${row(V105SET)}${row(NOWSET)}</div>
${sec('Pressure test: the batch 2 subjects on this grid')}
<div style="margin:0 0 64px">${b2}</div>
${sec('Weight: still open')}
${p('Size and shape are now set by the grid; weight is not yet equal. In our blur, a 1.5px line can\'t get darker than about 58, and the solid places reach 75, so the Star, the + and the coupe (whose clear band opens its bowl) read lighter. The Weight board, to the right, shows them as they are beside a heavier line for the star and the +.')}
<div style="margin:0 0 64px"></div>
${sec('Craft comparison only, not a size reference: two well-made sets, for drawing quality')}
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
    fs.writeFileSync(path.join(out, 'boards.json'), JSON.stringify(NAMES7.map((nm, i) => ({ file: nm + '.dc.html', title: TITLES7[i] })), null, 1));
    fs.writeFileSync(path.join(out, 'measure.html'), `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0}${m.css}.card{margin:0}</style></head><body><div class="cards">${m.cards.join('')}</div></body></html>`);
  }
  console.log('caps', LAWS.map(l => l + ' ' + BATCH.map(([id]) => GD[l][12][id].caps).join('/') + ' +' + UD[l].plus.caps + ' star' + UD[l].star.caps).join(' | '));
  console.log('ok', BATCH.map(([id]) => `${id} ink ${ink(GD.joint[12][id].d).toFixed(1)}% ty ${GD.joint[12][id].ty.toFixed(2)} tx ${GD.joint[12][id].tx}`).join(' · '));
}
