// Round g4: the stroke-width sweep on grid A (owner: "Let's try a bunch of pixel widths for the
// stroke to give us the perfect overall density goal. I want sub pixels from prolly .8 to 2.5";
// "Also include app icons not just the ones for types").
// Writes grid/cards-g4.html, grid/svg/g4/w<width>/<pick>-24.svg and, given an out dir, canvas boards.
'use strict';
const fs = require('fs'), path = require('path');
const E = require('./engine.js');
const { NAMES } = require('./picks.js');
const { G4, library, details } = require('./picks4.js');
const ROOT = path.join(__dirname, '..');
const COL = { paper: '#F2EBDD', raised: '#FAF5EA', hair: '#D8CEBA', ink: '#1A1A18', ink2: '#5A564C', navy: '#12293F', or: '#EE7434', ord: '#A8400C', g1: '#E6DDCB', g2: '#CDBFA4', g3: '#B3A27F', blue: '#2F5A7A', map: '#E8E4DA' };
const f2 = v => +(+v).toFixed(3);
const WS = [0.8, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5];
const wl = w => (w % 1 ? w.toFixed(2).replace(/0$/, '') : w.toFixed(0)) + 'px';

// corner law "by joint", scaled with the stroke (the g2/g3 radii were set for a 2px line)
function lawFor(w) {
  const k = w / 2;
  return c => {
    if (c.convex) {
      if (c.angle < 75) return 0.3 * k;
      if (c.angle > 105) return 1.0 * k;
      if (Math.min(c.lin, c.lout) <= 1.3 * w) return 0.35 * k;
      return 0.6 * k;
    }
    if (c.angle < 75) return 0.3 * k;
    return 1.1 * k;
  };
}
// the middle rule from g3: glyphs that don't stand are centred on MIDDLE (box y 6), snapped to 0.25px
const MIDDLE = ['cafe', 'hotel', 'neighbourhood', 'landmark'];
function boxPrims(id, w) {
  let p = G4[id](w);
  if (MIDDLE.includes(id)) { const b = E.build(p, {}).bounds, dy = Math.round((6 - (b.y + b.h / 2)) * 4) / 4; if (dy) p = E.xform(p, 1, 0, 0, 0, dy); }
  return p;
}
const GL = {}; // GL[w][id] = { b24: built in badge coords, c12: built in chip coords, ink }
for (const w of WS) {
  GL[w] = {};
  for (const [id] of NAMES) {
    const p = boxPrims(id, w), law = lawFor(w);
    const b24 = E.build(E.xform(p, 1, 0, 0, 6, 6), { law, centre: [12, 12] });
    const c12 = E.build(p, { law });
    GL[w][id] = { b24, c12 };
  }
}
// ink coverage of the whole 24 badge (ring + glyph) as a share of the badge's disc
const paper = require(path.join(process.env.TOOLS || '/tmp/claude-0/-home-user-la-trip-map/04f8fb34-0476-5960-add5-8bd3d6d8820e/scratchpad/tools', 'node_modules/paper/dist/paper-core.js'));
function areaOf(d) { const cp = new paper.CompoundPath(d); const a = Math.abs(cp.area); cp.remove(); return a; }
const INK = {};
for (const w of WS) {
  const ring = Math.PI * (144 - (12 - w) ** 2);
  let sum = 0; for (const [id] of NAMES) sum += areaOf(GL[w][id].b24.d);
  INK[w] = Math.round(100 * (ring + sum / NAMES.length) / (Math.PI * 144));
}

// SVG files
for (const w of WS) {
  const dir = path.join(ROOT, 'svg', 'g4', 'w' + String(w).replace('.', '_')); fs.mkdirSync(dir, { recursive: true });
  for (const [id] of NAMES) {
    fs.writeFileSync(path.join(dir, `${id}-24.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="${f2(12 - w / 2)}" fill="none" stroke="currentColor" stroke-width="${w}"/><path fill="currentColor" d="${GL[w][id].b24.d}"/></svg>\n`);
    fs.writeFileSync(path.join(dir, `${id}-12.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><path fill="currentColor" d="${GL[w][id].c12.d}"/></svg>\n`);
  }
}

// ---- the app's UI icons (outlined: "not yet tapped"), as strokes at the sweep width ----------------
// each: [name, size it renders at in the app (px), inner svg in a 24 box; S = stroke attrs]
const STAR = 'M10.81 2.74A1.3 1.3 0 0 1 13.19 2.74L15.45 7.81A0.6 0.6 0 0 0 15.93 8.17L21.46 8.75A1.3 1.3 0 0 1 22.19 11.01L18.06 14.73A0.6 0.6 0 0 0 17.88 15.30L19.03 20.73A1.3 1.3 0 0 1 17.11 22.12L12.30 19.35A0.6 0.6 0 0 0 11.70 19.35L6.89 22.12A1.3 1.3 0 0 1 4.97 20.73L6.12 15.30A0.6 0.6 0 0 0 5.94 14.73L1.81 11.01A1.3 1.3 0 0 1 2.54 8.75L8.07 8.17A0.6 0.6 0 0 0 8.55 7.81Z';
const UI = [
  ['Add (+)', 26.4, (S) => `<path d="M12 5v14M5 12h14" ${S}/>`],
  ['Close form (×)', 26.4, (S) => `<path d="M6 6l12 12M18 6L6 18" ${S}/>`],
  ['Account', 24, (S) => `<circle cx="12" cy="7" r="4" ${S}/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" ${S}/>`],
  ['Star (not starred)', 20, (S) => `<path d="${STAR}" ${S}/>`],
  ['Locate', 20, (S) => `<circle cx="12" cy="12" r="3.5" ${S}/><path d="M12 2v5M12 17v5M2 12h5M17 12h5" ${S}/>`],
  ['Sort', 18, (S) => `<path d="M8 20V4M4 8l4-4 4 4M16 4v16M12 16l4 4 4-4" ${S}/>`],
  ['Filters', 18, (S, w, k) => `<path d="M3 6h18M3 12h18M3 18h18" ${S}/><circle cx="9" cy="6" r="2.6" fill="${COL.raised}" ${S}/><circle cx="15" cy="12" r="2.6" fill="${COL.raised}" ${S}/><circle cx="7" cy="18" r="2.6" fill="${COL.raised}" ${S}/>`],
  ['Directions', 20, (S) => `<circle cx="12" cy="12" r="9" ${S}/><path d="M16 8l-2.5 6L8 16.5l2.5-6Z" fill="currentColor" stroke="none"/>`],
  ['Close tag (×)', 14, (S) => `<path d="M5 5l14 14M19 5L5 19" ${S}/>`],
  ['Chosen (✓)', 16, (S) => `<path d="M3.5 12.5l5.5 5.5L20.5 6" ${S}/>`],
  ['Open / fold', 16, (S) => `<path d="M5 9l7 7 7-7" ${S}/>`],
  ['More', 18, (S, w, k) => [5, 12, 19].map(x => `<circle cx="${x}" cy="12" r="${f2(Math.max(1.4, 0.95 * w * k))}" fill="currentColor"/>`).join('')],
];
function uiIcon(i, w, px) {
  const [, size, fn] = UI[i], k = 24 / size, sw = f2(w * k); // stroke = w screen px at the icon's real size
  const S = `fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"`;
  const s = px || size;
  return `<svg width="${f2(s)}" height="${f2(s)}" viewBox="0 0 24 24" style="color:${COL.navy}" aria-hidden="true">${fn(S, w, k)}</svg>`;
}

// ---- drawing helpers ------------------------------------------------------------------------------
const badge = (w, d, px = 24) => `<svg width="${px}" height="${px}" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="${f2(12 - w / 2)}" fill="${COL.paper}" stroke="${COL.navy}" stroke-width="${w}"/><path d="${d}" fill="${COL.navy}"/></svg>`;
const chip = (d) => `<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="${d}" fill="${COL.navy}"/></svg>`;
function onGrid(w, id, px) {
  const s = px / 24, L = (a, b, c, d, col, sw = 1, dash) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="${col}" stroke-width="${f2(sw / s)}"${dash ? ` stroke-dasharray="${dash.map(v => f2(v / s)).join(' ')}"` : ''}/>`;
  let g = `<rect width="24" height="24" fill="${COL.raised}"/>`;
  for (let i = 0; i <= 24; i++) { const c = i === 12 ? COL.g3 : i % 2 ? COL.g1 : COL.g2; g += L(i, 0, i, 24, c) + L(0, i, 24, i, c); }
  g += `<circle cx="12" cy="12" r="${f2(12 - w / 2)}" fill="none" stroke="${COL.navy}" stroke-width="${w}"/>`;
  g += `<rect x="6" y="6" width="12" height="12" fill="none" stroke="${COL.blue}" stroke-opacity=".6" stroke-width="${f2(1 / s)}"/>`;
  for (const [y, d] of [[6], [10, [4, 3]], [12, [1.5, 2.5]], [18]]) g += L(0, y, 24, y, COL.blue, 1.2, d);
  g += `<path d="${GL[w][id].b24.d}" fill="${COL.navy}" fill-opacity=".9"/>`;
  return `<svg width="${px}" height="${px}" viewBox="0 0 24 24" aria-hidden="true">${g}</svg>`;
}
let HOME = '../../../apple-touch-icon.png';
const imgHome = (px = 60) => `<img src="${HOME}" width="${px}" height="${px}" alt="Home-screen icon, today's" style="border-radius:${f2(px * 0.2237)}px;display:block">`;
const COSTS = {
  0.8: 'The lightest: the ring is finer than the edge of the visited stamp and sticker; the 4 × 4 blocks read as an app grid; on a non-retina screen a 0.8px line renders grey.',
  1: 'Still lighter than the visited marks; the blocks are still 4 × 4; the walker is spindly.',
  1.25: 'Cuts are 0.75px, the smallest that still opens at 24px; the small details (rim, drink line, fold, architrave) are all in.',
  1.5: 'The last width with the small details; cuts 0.9px. The blocks drop to 2 × 2 and the spokes to 4.',
  1.75: 'The small details are gone; the curtain keeps its scallops; the fork drops to 2 tines.',
  2: "Today's line. No small details and no scallops; the chip starts to crowd (bench, bed).",
  2.25: "The wheel's openings nearly close; the bench and bed chips clog; the + and × are the heaviest marks on the header.",
  2.5: 'The heaviest: the wheel becomes a disc, the roof merges with the columns, most chips clog.',
};
const buys = w => { const d = details(w); return `${d.tines} tines · ${d.columns} columns · ${d.spokes} spokes · ${d.slats} slats · ${d.tiers} tiers · ${d.blocks} × ${d.blocks} blocks${d.scallops ? ' · scallops' : ''}${d.small ? ' · rim, drink line, fold, architrave' : ''}`; };
const imgStamp = (rel) => `<img src="${rel}row-stamp.png" width="82" height="44" alt="Visited stamp, unchanged">`;
const imgSticker = (rel) => `<img src="${rel}sticker-near.png" width="40" height="40" alt="Visited sticker pin, unchanged">`;

// ---- copy and sheets -----------------------------------------------------------------------------
const Q1 = 'A feels to be producing better sized icons but the icons are too simplistic that are coming out in reality. Let\'s try a bunch of pixel widths for the stroke to give us the perfect overall density goal. I want sub pixels from prolly .8 to 2.5';
const Q2 = 'Also include app icons not just the ones for types';
const ASK = 'Which stroke width gives the overall density you want? (Or two neighbours to look at closer.)';

const CSS = W => `
*{box-sizing:border-box}
.cards{width:${W}px;font-family:Archivo,Arial,sans-serif;color:${COL.ink};background:#E4DCCB}
.card{background:${COL.raised};padding:14px 16px 18px;margin:0 0 24px}
.no{font-size:10px;letter-spacing:.12em;color:${COL.ink2};font-weight:700;text-transform:uppercase}
h2{font-size:22px;margin:2px 0 4px;letter-spacing:.04em;text-transform:uppercase;color:${COL.navy};line-height:1.1}
.att{font-size:13px;margin:4px 0 10px;line-height:1.4}
.sm{font-size:12px;line-height:1.4;margin:6px 0}
.lab{font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;color:${COL.ink2};font-weight:700;margin:14px 0 6px}
.q{font-size:13px;line-height:1.4;color:${COL.navy};background:#F3ECDF;border-left:3px solid ${COL.or};padding:8px 10px;margin:10px 0}
.q b{display:block;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:${COL.ord};margin-bottom:2px}
.step{border-top:2px solid ${COL.navy};padding:8px 0 10px}
.step .hd{display:flex;align-items:baseline;gap:10px;margin-bottom:6px}
.step .hd b{font-size:20px;color:${COL.navy};letter-spacing:.02em}
.step .hd span{font-size:10px;color:${COL.ink2};letter-spacing:.06em;text-transform:uppercase;font-weight:700}
.ics{display:flex;flex-wrap:wrap;gap:2px;align-items:center}
.ics.chip{gap:14px;padding:4px 0}
.ics.ui{gap:9px;padding-top:4px}
.ctx{display:flex;gap:16px;align-items:center;flex-wrap:wrap;margin:6px 0}
.ctx div{display:flex;flex-direction:column;align-items:center;gap:3px;font-size:9px;color:${COL.ink2};letter-spacing:.06em;text-transform:uppercase;font-weight:700}
.across{display:grid;grid-template-columns:44px repeat(8,1fr);gap:2px;align-items:center;margin:4px 0}
.across .h{font-size:9px;color:${COL.ink2};text-align:center;font-weight:700}
.across .n{font-size:9.5px;font-weight:700;color:${COL.navy};line-height:1.1}
.across .c{display:flex;justify-content:center}
.big{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;justify-items:center}
.big div{display:flex;flex-direction:column;align-items:center;font-size:10px;font-weight:700;color:${COL.navy}}
.row{display:flex;align-items:center;gap:10px;height:56px;background:#F1E9DB;padding:0 16px;border-bottom:1px solid ${COL.hair};margin:0 -16px}
.row .t{font-size:16px;font-weight:600;line-height:1.15;flex:1}
.row .t small{display:block;font-size:10.5px;letter-spacing:.08em;font-weight:700;opacity:.72;margin-top:2px}
.map{position:relative;height:60px;background:${COL.map};margin:0 -16px;overflow:hidden}
.map .pn{position:absolute;line-height:0}
.plus{width:40px;height:40px;border-radius:50%;background:${COL.or};display:flex;align-items:center;justify-content:center}
.fam{display:flex;gap:10px;align-items:center;margin-top:8px}
.fam .t{flex:1;font-size:11px;line-height:1.35;color:${COL.ink2}}
.fam .t b{color:${COL.navy}}
.facts{font-size:12px;line-height:1.38;margin:0;padding:0;list-style:none}
.facts li{padding:5px 0;border-top:1px solid ${COL.hair}}
.facts b{color:${COL.navy}}
`;

function sheetIntro(rel, n) {
  return `<section class="card" id="c${n}"><div class="no">Grid · round 4 · sheet ${n}</div><h2>Stroke width, 0.8 to 2.5px</h2>
<div class="q"><b>You said</b>"${Q1}"<br><br>"${Q2}"</div>
<p class="att">Eight widths: ${WS.map(wl).join(', ')}. At each width, everything is rebuilt, not scaled:</p>
<ul class="facts">
<li><b>The 13 place glyphs</b>, solid, on grid A (the 12px box; TOP, SHOULDER, MIDDLE and BASE). Every line, every cut and the badge's ring take that width.</li>
<li><b>Finer strokes carry more detail.</b> Repeated parts are "as many as fit": from 5 tines down to 2, 5 columns to 3, 8 spokes to 4, 3 slats to 2, 5 tiers to 3, a 4 × 4 block plan to 2 × 2, scallops on the curtain, a drink line in the coupe, a rim on the cup, a fold in the blanket. That's how the glyphs get richer, not only thinner.</li>
<li><b>The app's own icons</b> (the +, the ×, account, star, locate, sort, filters, directions, the tick, the chevron, more): outlined, at the size each renders in the app, with that width.</li>
<li><b>Today's home-screen icon</b>, unchanged, at its home-screen size (60px) in every block, so you can see it with each width. Its marks are 3.75px wide at that size, about a 2px line relative to its seal. <b>Flag:</b> as it stands it doesn't sit naturally in the family at any width. It's the only solid, scalloped, ringless mark: it pairs with the + button's scallop, not with the ringed badges, and it's the heaviest thing in every block.</li>
<li><b>Ink</b>: how much of a 24px badge is ink, averaged over the 13. It's one number for "overall density".</li>
<li>Fixed: grid A's box, guides and the middle rule; the live circle Ø16; the corner rule (by joint, scaled with the width).</li>
</ul>
<div class="lab">Visited doesn't change: shown as it is, for context</div>
<div class="ctx"><div>${imgStamp(rel)}Row stamp</div><div>${imgSticker(rel)}Map sticker</div></div>
<p class="sm" style="color:${COL.ink2}">Skeletons, still: rough shapes on the grid, not final drawings. On your phone, 1px is 3 screen dots, so 0.8px is 2.4 dots: thin but whole.</p>
<div class="q"><b>The question</b>${ASK}</div>
</section>`;
}

function sheetSweep(n) {
  const steps = WS.map(w => `<div class="step"><div class="hd"><b>${wl(w)}</b><span>ink ${INK[w]}% of the badge</span></div>
<div class="ics">${NAMES.map(([id]) => badge(w, GL[w][id].b24.d)).join('')}</div>
<div class="ics chip">${NAMES.map(([id]) => chip(GL[w][id].c12.d)).join('')}</div>
<div class="ics ui">${UI.map((u, i) => uiIcon(i, w)).join('')}</div>
<div class="fam"><div class="plus">${uiIcon(0, w)}</div>${imgHome(60)}<div class="t"><b>Buys:</b> ${buys(w)}.<br><b>Costs:</b> ${COSTS[w]}</div></div></div>`).join('');
  return `<section class="card" id="c${n}"><div class="no">Grid · round 4 · sheet ${n}</div><h2>The sweep, real size</h2>
<p class="att">One block per width, the whole family together: the 13 badges at 24px, the 13 chips at 12px, the app's icons at their own sizes, then the + button and today's home-screen icon at its home-screen size (60px). Under each, what the width buys and what it costs. Look at this one at arm's length.</p>
${steps}
<div class="q"><b>The question</b>${ASK}</div>
</section>`;
}

function sheetAcross(W, n) {
  const ids = ['museum', 'attraction', 'venue', 'nature', 'restaurant', 'park', 'neighbourhood', 'cafe'];
  const head = `<div></div>${WS.map(w => `<div class="h">${wl(w)}</div>`).join('')}`;
  const rows = ids.map(id => `<div class="n">${NAMES.find(x => x[0] === id)[1]}</div>${WS.map(w => `<div class="c">${badge(w, GL[w][id].b24.d)}</div>`).join('')}`).join('');
  const uirows = UI.map((u, i) => `<div class="n">${u[0]}</div>${WS.map(w => `<div class="c">${uiIcon(i, w)}</div>`).join('')}`).join('');
  const px = W > 500 ? 160 : 84;
  const enl = id => `<div class="big">${WS.map(w => `<div>${onGrid(w, id, px)}${wl(w)}</div>`).join('')}</div>`;
  return `<section class="card" id="c${n}"><div class="no">Grid · round 4 · sheet ${n}</div><h2>One icon across the sweep</h2>
<div class="lab">Places, real size</div>
<div class="across">${head}${rows}</div>
<div class="lab">App icons, real size</div>
<div class="across">${head}${uirows}</div>
<div class="lab">On the grid, enlarged ${(px / 24).toFixed(1)}x: the column front</div>${enl('museum')}
<div class="lab">The Ferris wheel</div>${enl('attraction')}
<p class="sm" style="color:${COL.ink2}">Blue: the 12px box and the guides (TOP, SHOULDER, MIDDLE, BASE). The ring takes the same width as every line.</p>
</section>`;
}

function sheetApp(rel, n) {
  const pins = [['restaurant', 14, 18], ['bar', 70, 6], ['nature', 128, 22], ['shopping', 186, 8], ['street', 300, 20]];
  const blocks = WS.map(w => `<div class="step"><div class="hd"><b>${wl(w)}</b><span>ink ${INK[w]}%</span></div>
<div class="row">${badge(w, GL[w].museum.b24.d)}<div class="t">Vasa Museum<small>MUSEUM · STOCKHOLM</small></div>${uiIcon(3, w)}</div>
<div class="row">${badge(w, GL[w].landmark.b24.d)}<div class="t">Hallgrímskirkja<small>LANDMARK · REYKJAVÍK</small></div>${imgStamp(rel)}</div>
<div class="map">${pins.map(([id, x, y]) => `<div class="pn" style="left:${x}px;top:${y}px">${badge(w, GL[w][id].b24.d)}</div>`).join('')}<div class="pn" style="left:236px;top:6px">${imgSticker(rel)}</div></div>
<div class="ctx" style="margin-top:8px"><div class="plus">${uiIcon(0, w)}</div>${[2, 4, 5, 6].map(i => uiIcon(i, w)).join('')}</div></div>`).join('');
  return `<section class="card" id="c${n}"><div class="no">Grid · round 4 · sheet ${n}</div><h2>In the app, real size</h2>
<p class="att">Each width in a list row, on the map and in the header controls. The visited stamp and sticker are today's, unchanged, so you can see each width next to them.</p>
${blocks}
<div class="q"><b>The question</b>${ASK}</div>
</section>`;
}

function sheetGuide(W, n) {
  const lib = {}; for (const w of WS) { const p = library(w), law = lawFor(w); lib[w] = { b: E.build(E.xform(p, 1, 0, 0, 6, 6), { law }).d, c: E.build(p, { law }).d }; }
  const px = W > 500 ? 160 : 84;
  const onG = (w) => { const s = px / 24; let g = `<rect width="24" height="24" fill="${COL.raised}"/>`; for (let i = 0; i <= 24; i++) { const c = i === 12 ? COL.g3 : i % 2 ? COL.g1 : COL.g2; g += `<line x1="${i}" y1="0" x2="${i}" y2="24" stroke="${c}" stroke-width="${f2(1 / s)}"/><line x1="0" y1="${i}" x2="24" y2="${i}" stroke="${c}" stroke-width="${f2(1 / s)}"/>`; } g += `<circle cx="12" cy="12" r="${f2(12 - w / 2)}" fill="none" stroke="${COL.navy}" stroke-width="${w}"/><rect x="6" y="6" width="12" height="12" fill="none" stroke="${COL.blue}" stroke-opacity=".6" stroke-width="${f2(1 / s)}"/>`; for (const y of [6, 10, 12, 18]) g += `<line x1="0" y1="${y}" x2="24" y2="${y}" stroke="${COL.blue}" stroke-width="${f2(1.2 / s)}"${y === 10 || y === 12 ? ` stroke-dasharray="${f2(3 / s)} ${f2(2.5 / s)}"` : ''}/>`; return `<svg width="${px}" height="${px}" viewBox="0 0 24 24" aria-hidden="true">${g}<path d="${lib[w].b}" fill="${COL.navy}" fill-opacity=".9"/></svg>`; };
  return `<section class="card" id="c${n}"><div class="no">Grid · round 4 · sheet ${n}</div><h2>Guidance for the next icon</h2>
<p class="att">You asked for "an harmonious complete set and guidance for the future". These are the written rules every glyph on these sheets is built from. Whatever width you pick, they stay the same; only w changes.</p>
<ul class="facts">
<li><b>Box.</b> 12 × 12px: 6 to 18 in the 24px badge. The 12px chip is the same box with no ring.</li>
<li><b>Guides.</b> TOP 6, SHOULDER 10, MIDDLE 12, BASE 18. A glyph with a ground stands on BASE; one without (cup, bed, blocks, ⌘) is centred on MIDDLE.</li>
<li><b>One width, w.</b> Every line, the ring, and the app icons' strokes (at the size each renders) are w.</li>
<li><b>Cuts and spaces.</b> A cut between touching parts is 0.6w (at least 0.6px); a space between separate parts is w (at least 1px).</li>
<li><b>Repeated parts:</b> as many as fit with those cuts and spaces (tines, columns, spokes, slats, tiers, blocks).</li>
<li><b>Small details</b> (a rim, a drink line, a fold, an architrave, a book's band) only at w ≤ 1.5px.</li>
<li><b>Angles:</b> orthogonal, 45°, whole-pixel slopes. <b>Corners:</b> by joint, radii scaled with w (the corner law is a later pick).</li>
</ul>
<div class="lab">Test: a new icon, built only from the rules above</div>
<p class="sm">"Library" is not one of the 13 and nobody asked for it. It's here to test whether the rules alone make a new icon that sits with the set: books standing on BASE, as many as fit, spines between SHOULDER and TOP, one leaning at 45°, a band on each spine where w ≤ 1.5.</p>
<p class="sm"><b>Result:</b> in weight, size and detail it sits with the set at every width. As an idea it reads as a bar chart. The rules make an icon consistent; they don't make its concept clear. That still needs the concept step.</p>
<div class="across"><div></div>${WS.map(w => `<div class="h">${wl(w)}</div>`).join('')}<div class="n">Library (test)</div>${WS.map(w => `<div class="c">${badge(w, lib[w].b)}</div>`).join('')}<div class="n">Chip</div>${WS.map(w => `<div class="c">${chip(lib[w].c)}</div>`).join('')}<div class="n">Beside the set</div>${WS.map(w => `<div class="c">${badge(w, GL[w].museum.b24.d)}</div>`).join('')}</div>
<div class="lab">On the grid, enlarged ${(px / 24).toFixed(1)}x</div>
<div class="big">${[0.8, 1.25, 2, 2.5].map(w => `<div>${onG(w)}${wl(w)}</div>`).join('')}</div>
</section>`;
}

function page(W, rel) { return { css: CSS(W), cards: [sheetIntro(rel, 0), sheetSweep(1), sheetAcross(W, 2), sheetApp(rel, 3), sheetGuide(W, 4)] }; }

{
  const { css, cards } = page(390, '../inventory-png/');
  fs.writeFileSync(path.join(ROOT, 'cards-g4.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=390"><title>Grid round 4: stroke sweep</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&display=swap">
<style>body{margin:0;background:#E4DCCB}${css}</style></head><body><div class="cards">${cards.join('\n')}</div></body></html>\n`);
}
const out = process.argv[2];
if (out) {
  const W = 760, assets = JSON.parse(process.env.ASSETS || '{}');
  HOME = assets.home || 'apple-touch-icon.png';
  let { css, cards } = page(W, '');
  cards = cards.map(h => h.replace(/src="row-stamp.png"/g, `src="${assets.stamp || 'row-stamp.png'}"`).replace(/src="sticker-near.png"/g, `src="${assets.sticker || 'sticker-near.png'}"`));
  const names = ['Grid4Intro', 'Grid4Sweep', 'Grid4Across', 'Grid4App', 'Grid4Guide'];
  const titles = ['Stroke width, 0.8 to 2.5px', 'The sweep, real size', 'One icon across the sweep', 'In the app, real size', 'Guidance for the next icon'];
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
  fs.writeFileSync(path.join(out, 'measure.html'), `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0}${css}.card{margin:0}</style></head><body><div class="cards">${page(W, '/home/user/la-trip-map/.claude/worktrees/agent-a8232643d0d0e8556/design/icon-system/inventory-png/').cards.join('')}</div></body></html>`);
}
console.log('ink', WS.map(w => wl(w) + ' ' + INK[w] + '%').join(' · '));
