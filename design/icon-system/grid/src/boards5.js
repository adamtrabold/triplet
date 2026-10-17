// Round g5: a closer look at 1.5, 1.75 and 2px (owner: "Feels like 1.5 or 2 to me right now"),
// and "What's closest to the inspo". Same skeletons as g4 (src/picks4.js via boards4.js); only the
// sheets are new. Writes grid/cards-g5.html and, given an out dir, the canvas artboards.
// Run: TOOLS=<dir with node_modules/paper> node src/boards5.js [canvasOut]
'use strict';
const fs = require('fs'), path = require('path');
const B4 = require('./boards4.js');
const { COL, f2, wl, GL, INK, UI, uiIcon, badge, chip } = B4;
const { NAMES } = require('./picks.js');
const { details } = require('./picks4.js');
const ROOT = path.join(__dirname, '..');
const WS = [1.5, 1.75, 2];
const Q = 'Which of 1.5, 1.75 and 2px gives the density you want?';
const QUOTE1 = 'Feels like 1.5 or 2 to me right now';
const QUOTE2 = "What's closest to the inspo";
const NAME = id => NAMES.find(n => n[0] === id)[1];
const cutW = w => Math.max(0.6, 0.6 * w);

// image paths (relative for cards-g5.html; replaced by asset URLs for the canvas)
let REL = { stamp: '../inventory-png/row-stamp.png', sticker: '../inventory-png/sticker-near.png', home: '../../../apple-touch-icon.png' };
const CROP = k => (REL.crops || 'inspo-crops/') + k + '.png';
const stamp = () => `<img src="${REL.stamp}" width="82" height="44" alt="Visited stamp, unchanged" style="display:block">`;
const sticker = () => `<img src="${REL.sticker}" width="40" height="40" alt="Visited sticker, unchanged" style="display:block">`;
const home = (px = 60) => `<img src="${REL.home}" width="${px}" height="${px}" alt="Home-screen icon, today's" style="border-radius:${f2(px * 0.2237)}px;display:block">`;

// ---- MUTCD (design/inspo/mutcd-recreation/fig-2h-05-1.gif), measured by src/../for-director.md method ----
// Each crop is the 81px sign. Legend boxes (x, y, w, h) inside the crop, measured from the white pixels.
const LEG = { lighthouse: [20, 5, 39, 71], pedxing: [5, 5, 70, 71], tower: [22, 5, 37, 71], tent: [5, 15, 70, 51], water: [9, 5, 64, 70], litter: [7, 5, 64, 70] };
const PAIRS = [['lighthouse', 'museum', 'Lighthouse', 'Museum'], ['tower', 'attraction', 'Lookout tower', 'Attraction'], ['pedxing', 'street', 'Ped Xing', 'Street'], ['water', 'bar', 'Drinking water', 'Bar'], ['tent', 'nature', 'Tent', 'Nature']];
const SIGN = 81, BADGE_K = 24 / SIGN, PIC_K = 12 / 71; // sign = badge; picture (71px tall) = our 12px box
// line parts measured on the sheet (run lengths of the white legend, in sheet px)
const PARTS = [
  ['Crosswalk dashes (Ped Xing)', 3, 3],
  ['Lookout-tower legs', 4, 4],
  ['Litter can walls; study-area spiral', 4, 5],
  ['Tent ground line', 5, 5],
  ["Walker's limbs (Ped Xing)", 6, 8],
  ['Drinking-water glass walls', 7, 8],
];
const MASSES = 'Masses, not lines: the tunnel walls 14px, the tent sides 16px.';
const sign = (k, px) => `<img src="${CROP(k)}" width="${px}" height="${px}" alt="MUTCD sign" style="display:block">`;
// the sign's picture only, scaled so its height (71px) = h
function pic(k, h) {
  const [x, y, w, hh] = LEG[k], s = h / 71, bw = f2(w * s), bh = f2(hh * s);
  return `<div style="width:${bw}px;height:${bh}px;overflow:hidden;position:relative;background:#7B4A26"><img src="${CROP(k)}" alt="MUTCD picture" style="position:absolute;left:${f2(-x * s)}px;top:${f2(-y * s)}px;width:${f2(SIGN * s)}px;height:${f2(SIGN * s)}px;max-width:none"></div>`;
}
const glyph = (w, id, px, col = COL.navy) => `<svg width="${px}" height="${px}" viewBox="0 0 12 12" aria-hidden="true"><path d="${GL[w][id].c12.d}" fill="${col}"/></svg>`;

// ---- the + badge as it ships: 60px scalloped orange (index.html #floatingAddBtn mask) ----
const SCALLOP = '30.00,4.68 30.66,4.88 31.29,5.42 31.88,6.09 32.45,6.65 33.04,6.92 33.67,6.81 34.37,6.42 35.12,5.92 35.87,5.57 36.55,5.54 37.14,5.91 37.61,6.59 38.01,7.39 38.41,8.08 38.91,8.49 39.55,8.55 40.33,8.35 41.18,8.07 41.99,7.92 42.66,8.07 43.13,8.58 43.41,9.36 43.59,10.23 43.80,11.01 44.17,11.53 44.77,11.76 45.58,11.76 46.47,11.71 47.30,11.77 47.90,12.10 48.23,12.70 48.29,13.53 48.24,14.42 48.24,15.23 48.47,15.83 48.99,16.20 49.77,16.41 50.64,16.59 51.42,16.87 51.93,17.34 52.08,18.01 51.93,18.82 51.65,19.67 51.45,20.45 51.51,21.09 51.92,21.59 52.61,21.99 53.41,22.39 54.09,22.86 54.46,23.45 54.43,24.13 54.08,24.88 53.58,25.63 53.19,26.33 53.08,26.96 53.35,27.55 53.91,28.12 54.58,28.71 55.12,29.34 55.32,30.00 55.12,30.66 54.58,31.29 53.91,31.88 53.35,32.45 53.08,33.04 53.19,33.67 53.58,34.37 54.08,35.12 54.43,35.87 54.46,36.55 54.09,37.14 53.41,37.61 52.61,38.01 51.92,38.41 51.51,38.91 51.45,39.55 51.65,40.33 51.93,41.18 52.08,41.99 51.93,42.66 51.42,43.13 50.64,43.41 49.77,43.59 48.99,43.80 48.47,44.17 48.24,44.77 48.24,45.58 48.29,46.47 48.23,47.30 47.90,47.90 47.30,48.23 46.47,48.29 45.58,48.24 44.77,48.24 44.17,48.47 43.80,48.99 43.59,49.77 43.41,50.64 43.13,51.42 42.66,51.93 41.99,52.08 41.18,51.93 40.33,51.65 39.55,51.45 38.91,51.51 38.41,51.92 38.01,52.61 37.61,53.41 37.14,54.09 36.55,54.46 35.87,54.43 35.12,54.08 34.37,53.58 33.67,53.19 33.04,53.08 32.45,53.35 31.88,53.91 31.29,54.58 30.66,55.12 30.00,55.32 29.34,55.12 28.71,54.58 28.12,53.91 27.55,53.35 26.96,53.08 26.33,53.19 25.63,53.58 24.88,54.08 24.13,54.43 23.45,54.46 22.86,54.09 22.39,53.41 21.99,52.61 21.59,51.92 21.09,51.51 20.45,51.45 19.67,51.65 18.82,51.93 18.01,52.08 17.34,51.93 16.87,51.42 16.59,50.64 16.41,49.77 16.20,48.99 15.83,48.47 15.23,48.24 14.42,48.24 13.53,48.29 12.70,48.23 12.10,47.90 11.77,47.30 11.71,46.47 11.76,45.58 11.76,44.77 11.53,44.17 11.01,43.80 10.23,43.59 9.36,43.41 8.58,43.13 8.07,42.66 7.92,41.99 8.07,41.18 8.35,40.33 8.55,39.55 8.49,38.91 8.08,38.41 7.39,38.01 6.59,37.61 5.91,37.14 5.54,36.55 5.57,35.87 5.92,35.12 6.42,34.37 6.81,33.67 6.92,33.04 6.65,32.45 6.09,31.88 5.42,31.29 4.88,30.66 4.68,30.00 4.88,29.34 5.42,28.71 6.09,28.12 6.65,27.55 6.92,26.96 6.81,26.33 6.42,25.63 5.92,24.88 5.57,24.13 5.54,23.45 5.91,22.86 6.59,22.39 7.39,21.99 8.08,21.59 8.49,21.09 8.55,20.45 8.35,19.67 8.07,18.82 7.92,18.01 8.07,17.34 8.58,16.87 9.36,16.59 10.23,16.41 11.01,16.20 11.53,15.83 11.76,15.23 11.76,14.42 11.71,13.53 11.77,12.70 12.10,12.10 12.70,11.77 13.53,11.71 14.42,11.76 15.23,11.76 15.83,11.53 16.20,11.01 16.41,10.23 16.59,9.36 16.87,8.58 17.34,8.07 18.01,7.92 18.82,8.07 19.67,8.35 20.45,8.55 21.09,8.49 21.59,8.08 21.99,7.39 22.39,6.59 22.86,5.91 23.45,5.54 24.13,5.57 24.88,5.92 25.63,6.42 26.33,6.81 26.96,6.92 27.55,6.65 28.12,6.09 28.71,5.42 29.34,4.88';
const plus = (w, px = 60) => `<div style="position:relative;width:${px}px;height:${px}px;line-height:0"><svg width="${px}" height="${px}" viewBox="0 0 60 60" style="position:absolute;left:0;top:0" aria-hidden="true"><polygon points="${SCALLOP}" fill="${COL.or}"/></svg><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${uiIcon(0, w)}</div></div>`;

// the selected pin: 32px, navy field, rim = w, the 24 drawing at 1:1 in paper
const selPin = (w, id) => `<svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="${f2(16 - w / 2)}" fill="${COL.navy}" stroke="${COL.navy}" stroke-width="${w}"/><path d="${GL[w][id].b24.d}" transform="translate(4 4)" fill="${COL.paper}"/></svg>`;
const accountBtn = w => `<div class="acct">${uiIcon(2, w).replace(`color:${COL.navy}`, `color:${COL.paper}`)}</div>`;

const CSS = W => `
*{box-sizing:border-box}
.cards{width:${W}px;font-family:Archivo,Arial,sans-serif;color:${COL.ink};background:#E4DCCB}
.card{background:${COL.raised};padding:14px 16px 18px;margin:0 0 24px}
.no{font-size:10px;letter-spacing:.12em;color:${COL.ink2};font-weight:700;text-transform:uppercase}
h2{font-size:22px;margin:2px 0 4px;letter-spacing:.04em;text-transform:uppercase;color:${COL.navy};line-height:1.1}
.att{font-size:13px;margin:4px 0 10px;line-height:1.4}
.sm{font-size:12px;line-height:1.4;margin:6px 0}
.mute{color:${COL.ink2}}
.lab{font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;color:${COL.ink2};font-weight:700;margin:18px 0 6px}
.q{font-size:13px;line-height:1.4;color:${COL.navy};background:#F3ECDF;border-left:3px solid ${COL.or};padding:8px 10px;margin:10px 0}
.q b{display:block;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:${COL.ord};margin-bottom:2px}
.facts{font-size:12.5px;line-height:1.4;margin:0;padding:0;list-style:none}
.facts li{padding:6px 0;border-top:1px solid ${COL.hair}}
.facts b{color:${COL.navy}}
table.cmp{width:100%;border-collapse:collapse;font-size:12px;line-height:1.35}
table.cmp th{font-size:15px;color:${COL.navy};text-align:left;padding:4px;border-bottom:2px solid ${COL.navy}}
table.cmp td{border-top:1px solid ${COL.hair};padding:6px 4px;vertical-align:top}
table.cmp td:first-child{font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;color:${COL.navy};width:64px}
.tri{display:grid;grid-template-columns:44px 1fr;align-items:center;border-top:1px solid ${COL.hair}}
.tri:first-of-type{border-top:0}
.wl{font-size:15px;font-weight:700;color:${COL.navy};line-height:1}
.wl small{display:block;font-size:9px;letter-spacing:.08em;color:${COL.ink2};margin-top:2px}
.bar{display:flex;align-items:center;gap:14px;height:52px;padding:0 10px;background:${COL.raised}}
.bar .city{font-size:19px;font-weight:700;letter-spacing:.06em;color:${COL.navy};flex:1;text-transform:uppercase}
.acct{width:40px;height:40px;border-radius:50%;background:${COL.navy};display:flex;align-items:center;justify-content:center}
.chips{display:flex;gap:6px;overflow:hidden;padding:8px 0}
.chip{display:inline-flex;align-items:center;gap:7px;height:30px;padding:0 10px;background:${COL.raised};border:1px solid ${COL.hair};border-bottom:2px solid ${COL.navy};font-size:11px;font-weight:700;letter-spacing:.08em;color:${COL.navy};flex:none}
.row{display:flex;align-items:center;gap:10px;height:56px;background:#F1E9DB;padding:0 10px;border-bottom:1px solid ${COL.hair}}
.row .t{font-size:16px;font-weight:600;line-height:1.15;flex:1;white-space:nowrap;overflow:hidden}
.row .t small{display:block;font-size:10.5px;letter-spacing:.08em;font-weight:700;opacity:.72;margin-top:2px}
.map{position:relative;height:120px;background:${COL.map};overflow:hidden;margin:4px 0}
.map .pn{position:absolute;line-height:0}
.tag{position:relative;margin:8px 0;width:300px;max-width:100%;background:${COL.raised};border:1px solid ${COL.hair};border-top:7px solid ${COL.or};box-shadow:0 2px 6px rgba(0,0,0,.12);padding:12px 14px 10px}
.tag .x{position:absolute;right:8px;top:8px;line-height:0}
.tag .nm{font-size:18px;font-weight:700;color:${COL.navy};padding-right:24px}
.tag .ct{display:flex;align-items:center;gap:6px;font-size:10px;letter-spacing:.1em;font-weight:700;color:${COL.ink2};margin:4px 0 10px}
.tag .seg{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid ${COL.hair}}
.tag .seg div{display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 0 2px;font-size:9.5px;letter-spacing:.08em;font-weight:700;color:${COL.navy};text-transform:uppercase}
.tag .seg div+div{border-left:1px solid ${COL.hair}}
.dg{display:grid;grid-template-columns:${W > 500 ? '170px' : '92px'} repeat(3,1fr);gap:2px 6px;align-items:center}
.dg .h{font-size:15px;font-weight:700;color:${COL.navy};text-align:center;padding-bottom:4px;border-bottom:2px solid ${COL.navy}}
.dg .n{font-size:11px;line-height:1.3;color:${COL.ink};padding:8px 0;border-top:1px solid ${COL.hair};align-self:stretch;display:flex;flex-direction:column;justify-content:center}
.dg .n b{font-size:12px;color:${COL.navy};display:block}
.dg .c{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:8px 0;border-top:1px solid ${COL.hair};align-self:stretch}
.dg .c i{font-style:normal;font-size:10px;font-weight:700;color:${COL.ord};letter-spacing:.04em}
.dg .c i.same{color:${COL.ink2}}
.x3{display:grid;grid-template-columns:${W > 500 ? '120px' : '74px'} repeat(3,1fr);gap:4px 6px;align-items:center}
.x3 .h{font-size:15px;font-weight:700;color:${COL.navy};text-align:center}
.x3 .n{font-size:10px;font-weight:700;color:${COL.navy};line-height:1.15}
.x3 .c{display:flex;justify-content:center;align-items:center;min-height:52px}
.step{border-top:2px solid ${COL.navy};padding:8px 0 12px}
.step .hd{display:flex;align-items:baseline;gap:10px;margin-bottom:6px}
.step .hd b{font-size:20px;color:${COL.navy}}
.step .hd span{font-size:10px;color:${COL.ink2};letter-spacing:.06em;text-transform:uppercase;font-weight:700}
.ics{display:flex;flex-wrap:wrap;gap:2px;align-items:center}
.ics.ch{gap:14px;padding:6px 0}
.ics.ui{gap:9px;padding-top:4px}
.fam{display:flex;gap:12px;align-items:center;margin-top:8px}
.mg{display:grid;grid-template-columns:${W > 500 ? '130px' : '70px'} repeat(5,1fr);gap:6px 4px;align-items:center;justify-items:center}
.mg .n{justify-self:start;font-size:10px;font-weight:700;color:${COL.navy};line-height:1.15}
.mg .t{font-size:9px;color:${COL.ink2};text-align:center;line-height:1.15}
.ruler{display:grid;grid-template-columns:1fr 54px;gap:5px 8px;align-items:center;font-size:11.5px;line-height:1.25}
.ruler .v{font-variant-numeric:tabular-nums;text-align:right;font-weight:700;color:${COL.navy}}
.ruler .bx{display:flex;align-items:center;gap:8px}
.ruler .ln{height:0;flex:none}
`;

const tri = fn => WS.map(w => `<div class="tri"><div class="wl">${String(w)}<small>PX</small></div><div>${fn(w)}</div></div>`).join('');

// ---- sheet 0: the question, what differs, what doesn't -------------------------------------------
function sheetIntro(n) {
  const d = Object.fromEntries(WS.map(w => [w, details(w)]));
  return `<section class="card" id="c${n}"><div class="no">Grid · round 5 · sheet ${n}</div><h2>1.5, 1.75 or 2px</h2>
<div class="q"><b>You said</b>"${QUOTE1}" &nbsp;·&nbsp; "${QUOTE2}"</div>
<p class="att">A closer look at those three widths. Same grid, same skeletons as the sweep; only the width changes.</p>
<table class="cmp"><tr><th></th>${WS.map(w => `<th>${wl(w)}</th>`).join('')}</tr>
<tr><td>Ink</td>${WS.map(w => `<td>${INK[w]}% of the badge</td>`).join('')}</tr>
<tr><td>Cut</td>${WS.map(w => `<td>${f2(cutW(w))}px</td>`).join('')}</tr>
<tr><td>Fork</td>${WS.map(w => `<td>${d[w].tines} tines</td>`).join('')}</tr>
<tr><td>Conifer</td>${WS.map(w => `<td>${d[w].tiers} tiers</td>`).join('')}</tr>
<tr><td>Small details</td>${WS.map(w => `<td>${d[w].small ? 'Yes: rim, drink line, bag band, fold, architrave' : 'None'}</td>`).join('')}</tr>
<tr><td>Curtain</td>${WS.map(w => `<td>${d[w].scallops ? 'Scalloped' : 'Plain'}</td>`).join('')}</tr></table>
<ul class="facts" style="margin-top:12px">
<li><b>What decides it:</b> the weight of every line and the ring, plus five things the grid's rules change: the fork's tines, the conifer's tiers, the small details, the curtain's scallops, and how full the 12px chips get. Sheet 2 shows each one, big and real size.</li>
<li><b>The same at all three:</b> 3 columns, 4 spokes, 2 bench slats, 2 × 2 blocks, the bed, the walker, the ⌘, the + and the ×. They differ in weight only.</li>
<li><b>Plainly, at real size:</b> 1.5 and 1.75 are hard to tell apart in a row or on the map; 2 is visibly bolder. The detail differences show at real size in the fork and the conifer; the small details mostly need a close look. It's clearest in the header, the chips and the + (sheet 1).</li>
<li><b>Where the details stop is our rule, not the width:</b> in the sweep we cut each detail at the width where we judged it stopped opening at 24px. Those cut-offs could move by a quarter pixel; the weight can't.</li>
<li><b>Closest to the inspo:</b> sheet 5 puts the MUTCD signs beside each width at the same size, with their measured line weights.</li>
</ul>
<p class="sm mute">Fixed: grid A, places solid, closed shapes solid, the Star the only outline. Visited and today's home-screen icon are unchanged. Corners, air and the home-screen icon come after this pick. Skeletons, not final drawings.</p>
<div class="q"><b>The question</b>${Q}</div>
</section>`;
}

// ---- sheet 1: side by side in the app, real size -------------------------------------------------
function sheetCtx(n) {
  const pins = [['restaurant', 6, 10], ['bar', 70, 4], ['museum', 128, 44], ['nature', 196, 8], ['shopping', 250, 50], ['street', 160, 90], ['venue', 230, 92], ['cafe', 282, 6]];
  return `<section class="card" id="c${n}"><div class="no">Grid · round 5 · sheet ${n}</div><h2>Side by side in the app</h2>
<p class="att">Real size: the three widths, one under another, in each place the icons live. Hold your phone at a normal distance.</p>
<div class="lab">Header</div>${tri(w => `<div class="bar"><span class="city">Stockholm</span>${uiIcon(5, w)}${uiIcon(6, w)}${uiIcon(4, w)}${accountBtn(w)}</div>`)}
<div class="lab">Filter chips (12px)</div>${tri(w => `<div class="chips">${['restaurant', 'cafe', 'park', 'nature', 'museum'].map(id => `<span class="chip">${chip(GL[w][id].c12.d)}${NAME(id).toUpperCase()}</span>`).join('')}</div>`)}
<div class="lab">List rows</div>${tri(w => `<div class="row">${badge(w, GL[w].restaurant.b24.d)}<div class="t">Fiskmarkaðurinn<small>RESTAURANT · REYKJAVÍK</small></div>${uiIcon(3, w)}</div><div class="row">${badge(w, GL[w].nature.b24.d)}<div class="t">Skansen<small>NATURE · STOCKHOLM</small></div>${stamp()}</div>`)}
<div class="lab">Map: pins, a selected pin, the visited sticker</div>${tri(w => `<div class="map">${pins.map(([id, x, y]) => `<div class="pn" style="left:${x}px;top:${y}px">${badge(w, GL[w][id].b24.d)}</div>`).join('')}<div class="pn" style="left:52px;top:58px">${selPin(w, 'attraction')}</div><div class="pn" style="left:104px;top:2px">${sticker()}</div></div>`)}
<div class="q"><b>The question</b>${Q}</div>
</section>`;
}
function sheetCtx2(n) {
  return `<section class="card" id="c${n}"><div class="no">Grid · round 5 · sheet ${n}</div><h2>Side by side: the + and the tag</h2>
<p class="att">Real size. The + is the 60px badge as it ships; only its line changes. The tag shows the place badge, the Star, Directions, the tick and the ×.</p>
<div class="lab">The + button</div>${tri(w => `<div style="display:flex;align-items:center;gap:16px;padding:6px 0">${plus(w)}<span class="sm mute">${wl(w)} line on the +</span></div>`)}
<div class="lab">The tag</div>${tri(w => `<div class="tag"><div class="x">${uiIcon(8, w)}</div><div class="nm">Vasa Museum</div><div class="ct">${badge(w, GL[w].museum.b24.d)}MUSEUM · STOCKHOLM</div><div class="seg"><div>${uiIcon(3, w)}Star</div><div>${uiIcon(7, w)}Directions</div><div>${uiIcon(9, w)}Visited</div></div></div>`)}
<div class="q"><b>The question</b>${Q}</div>
</section>`;
}

// ---- sheet 2: the differences, big and real size --------------------------------------------------
function sheetDiff(W, n) {
  const big = W > 500 ? 96 : 66;
  const cell = (w, id, note, same) => `<div class="c">${badge(w, GL[w][id].b24.d, big)}${badge(w, GL[w][id].b24.d)}${note ? `<i${same ? ' class="same"' : ''}>${note}</i>` : ''}</div>`;
  const d = Object.fromEntries(WS.map(w => [w, details(w)]));
  const rows = [
    ['restaurant', 'The fork', 'Tines', w => `${d[w].tines} tines`, w => w !== 1.5],
    ['nature', 'The conifer', 'Tiers', w => `${d[w].tiers} tiers`, w => w !== 1.5],
    ['cafe', 'The cup', 'Rim band', w => d[w].small ? 'rim' : 'no rim', w => !d[w].small],
    ['bar', 'The coupe', 'Drink line', w => d[w].small ? 'drink line' : 'none', w => !d[w].small],
    ['shopping', 'The bag', 'Band under the handle', w => d[w].small ? 'band' : 'none', w => !d[w].small],
    ['hotel', 'The bed', "Blanket's fold", w => d[w].small ? 'fold' : 'none', w => !d[w].small],
    ['museum', 'The column front', 'Architrave', w => d[w].small ? 'architrave' : 'none', w => !d[w].small],
    ['venue', 'The curtain', 'Scallops', w => d[w].scallops ? 'scallops' : 'plain', w => !d[w].scallops],
    ['landmark', 'The ⌘', 'Weight only', () => '', () => false],
  ];
  const chipRow = ids => WS.map(w => `<div class="c">${ids.map(id => glyph(w, id, 48)).join('')}<div style="display:flex;gap:6px">${ids.map(id => chip(GL[w][id].c12.d)).join('')}</div></div>`).join('');
  return `<section class="card" id="c${n}"><div class="no">Grid · round 5 · sheet ${n}</div><h2>What actually changes</h2>
<p class="att">Each difference, big (${(big / 24).toFixed(1)}x) and at real size underneath. Orange notes mark what the width loses.</p>
<div class="dg"><div></div>${WS.map(w => `<div class="h">${wl(w)}</div>`).join('')}
${rows.map(([id, nm, what, note, lost]) => `<div class="n"><b>${nm}</b>${what}</div>${WS.map(w => cell(w, id, note(w), !lost(w))).join('')}`).join('\n')}
<div class="n"><b>The chips</b>Bench, bed, blocks at 12px (4x, then real size)</div>${chipRow(['park', 'hotel', 'neighbourhood'])}
</div>
<p class="sm mute">Not changing: columns, spokes, slats and blocks keep the same count at all three. The ⌘ only gets heavier.</p>
<div class="q"><b>The question</b>${Q}</div>
</section>`;
}

// ---- sheet 3: the whole family per width, real size ----------------------------------------------
function sheetFamily(n) {
  const steps = WS.map(w => `<div class="step"><div class="hd"><b>${wl(w)}</b><span>ink ${INK[w]}% of the badge</span></div>
<div class="ics">${NAMES.map(([id]) => badge(w, GL[w][id].b24.d)).join('')}</div>
<div class="ics ch">${NAMES.map(([id]) => chip(GL[w][id].c12.d)).join('')}</div>
<div class="ics ui">${UI.map((u, i) => uiIcon(i, w)).join('')}</div>
<div class="fam">${plus(w)}${home(60)}<span class="sm mute" style="flex:1">The + and today's home-screen icon (unchanged).</span></div></div>`).join('');
  return `<section class="card" id="c${n}"><div class="no">Grid · round 5 · sheet ${n}</div><h2>The whole family, real size</h2>
<p class="att">As in the sweep: per width, the 13 badges, the 13 chips, the app's icons at their own sizes, the + and the home-screen icon.</p>
${steps}
<div class="q"><b>The question</b>${Q}</div>
</section>`;
}

// ---- sheet 4: every icon at 2x -------------------------------------------------------------------
function sheetTwoX(W, n) {
  const px = W > 500 ? 72 : 48;
  const head = `<div></div>${WS.map(w => `<div class="h">${wl(w)}</div>`).join('')}`;
  const places = NAMES.map(([id, nm]) => `<div class="n">${nm}</div>${WS.map(w => `<div class="c">${badge(w, GL[w][id].b24.d, px)}</div>`).join('')}`).join('');
  const ui = UI.map((u, i) => `<div class="n">${u[0]}</div>${WS.map(w => `<div class="c">${uiIcon(i, w, u[1] * 2)}</div>`).join('')}`).join('');
  const chips = NAMES.map(([id, nm]) => `<div class="n">${nm}</div>${WS.map(w => `<div class="c" style="min-height:30px">${glyph(w, id, 24)}</div>`).join('')}`).join('');
  return `<section class="card" id="c${n}"><div class="no">Grid · round 5 · sheet ${n}</div><h2>Every icon at 2x</h2>
<p class="att">Twice real size, the three widths in columns. Read across a row.</p>
<div class="lab">The 13 place badges</div><div class="x3">${head}${places}</div>
<div class="lab">The app's icons</div><div class="x3">${head}${ui}</div>
<div class="lab">The chips (12px, shown at 24)</div><div class="x3">${head}${chips}</div>
</section>`;
}

// ---- sheet 5: closest to the inspo -----------------------------------------------------------------
function sheetInspo(W, n) {
  const big = W > 500 ? 96 : 52, picH = W > 500 ? 72 : 44;
  const S = 8; // ruler: 1px of line = 8px drawn
  const line = (px, col) => `<span class="ln" style="width:${W > 500 ? 260 : 120}px;border-top:${f2(px * S)}px solid ${col}"></span>`;
  const partRows = PARTS.map(([nm, a, b]) => { const lo = f2(a * BADGE_K), hi = f2(b * BADGE_K); return `<div class="bx">${line(lo, '#7B4A26')}<span>${nm}: ${a === b ? a : a + '–' + b}px</span></div><div class="v">${a === b ? lo.toFixed(2) : lo.toFixed(2) + '–' + hi.toFixed(2)}</div>`; }).join('');
  const ours = WS.map(w => `<div class="bx">${line(w, COL.navy)}<span><b>Ours, ${wl(w)}</b></span></div><div class="v">${w.toFixed(2)}</div>`).join('');
  const pr = (a, b) => `${(100 * a / 71).toFixed(1)}${b && b !== a ? '–' + (100 * b / 71).toFixed(1) : ''}%`;
  return `<section class="card" id="c${n}"><div class="no">Grid · round 5 · sheet ${n}</div><h2>Closest to the inspo</h2>
<div class="q"><b>You asked</b>"${QUOTE2}"</div>
<p class="att">MUTCD brown signs (sheet 1 of Figure 2H-5), beside our icons that match in subject. Two ways to compare, because the signs and the badges are built differently: a sign's picture fills most of its square; our glyph fills the 12px box inside a 24px badge.</p>
<div class="lab">1 · Same size on screen: a sign the size of a badge</div>
<div class="mg"><div></div>${PAIRS.map(p => `<div class="t">${p[2]}<br>/ ${p[3]}</div>`).join('')}
<div class="n">MUTCD</div>${PAIRS.map(([k]) => sign(k, big)).join('')}
${WS.map(w => `<div class="n" style="font-size:13px">${wl(w)}</div>${PAIRS.map(([, id]) => badge(w, GL[w][id].b24.d, big)).join('')}`).join('')}
<div class="n">Real size</div>${PAIRS.map(([k]) => sign(k, 24)).join('')}
${WS.map(w => `<div class="n">${wl(w)}</div>${PAIRS.map(([, id]) => badge(w, GL[w][id].b24.d)).join('')}`).join('')}</div>
<div class="lab">The signs' lines at that size (sign 81px = badge 24px), drawn 8x</div>
<div class="ruler">${partRows}${ours}</div>
<p class="sm mute">${MASSES} Measured as the run length of the white picture on the sheet's 81px signs, then × 24/81.</p>
<div class="lab">2 · Picture to picture: the sign's picture the height of our glyph</div>
<div class="mg"><div></div>${PAIRS.map(p => `<div class="t">${p[2]}<br>/ ${p[3]}</div>`).join('')}
<div class="n">MUTCD</div>${PAIRS.map(([k]) => pic(k, picH)).join('')}
${WS.map(w => `<div class="n" style="font-size:13px">${wl(w)}</div>${PAIRS.map(([, id]) => glyph(w, id, picH)).join('')}`).join('')}</div>
<p class="sm">Line as a share of the picture's height: the signs' lines run ${pr(3)} (dashes) to ${pr(8)} (the glass walls), most often ${pr(4)}. Ours: ${WS.map(w => `${wl(w)} = ${(100 * w / 12).toFixed(1)}%`).join(', ')}.</p>
<ul class="facts" style="margin-top:10px">
<li><b>Same size on screen:</b> the signs' lines run 0.9 to 2.4px; the most common (the 4px tower legs, can walls, spiral) is 1.2px. 1.5 sits inside that range, at the tent's ground line; 1.75 at the walker's limbs; 2 at the glass walls, the heaviest line on the sheet.</li>
<li><b>Picture to picture:</b> all three of ours are heavier than any sign line except the glass walls; 1.5 is nearest to those.</li>
<li><b>Where the signs' weight comes from:</b> solid masses (the tunnel, the tent, the lighthouse, the bodies), not heavy lines.</li>
<li>The signs are white on brown; light marks on a dark ground look a little heavier than they measure. Ours are dark on paper.</li>
</ul>
<div class="q"><b>The question</b>${Q}</div>
</section>`;
}

function page(W) { return { css: CSS(W), cards: [sheetIntro(0), sheetCtx(1), sheetCtx2(2), sheetDiff(W, 3), sheetFamily(4), sheetTwoX(W, 5), sheetInspo(W, 6)] }; }
const NAMES5 = ['Grid5Intro', 'Grid5Context', 'Grid5Plus', 'Grid5Diff', 'Grid5Family', 'Grid5TwoX', 'Grid5Inspo'];
const TITLES5 = ['1.5, 1.75 or 2px', 'Side by side in the app', 'Side by side: the + and the tag', 'What actually changes', 'The whole family, real size', 'Every icon at 2x', 'Closest to the inspo'];

if (require.main === module) {
  {
    const { css, cards } = page(390);
    fs.writeFileSync(path.join(ROOT, 'cards-g5.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=390"><title>Grid round 5: 1.5 to 2</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&display=swap">
<style>body{margin:0;background:#E4DCCB}${css}</style></head><body><div class="cards">${cards.join('\n')}</div></body></html>\n`);
  }
  const out = process.argv[2];
  if (out) {
    const W = 760;
    const wt = path.join(ROOT, '..', '..', '..');
    REL = { stamp: path.join(ROOT, '../inventory-png/row-stamp.png'), sticker: path.join(ROOT, '../inventory-png/sticker-near.png'), home: path.join(wt, 'apple-touch-icon.png'), crops: path.join(ROOT, 'inspo-crops') + '/' };
    const m = page(W);
    REL = JSON.parse(process.env.ASSETS || '{}');
    const { css, cards } = page(W);
    fs.mkdirSync(path.join(out, 'project'), { recursive: true });
    cards.forEach((html, i) => fs.writeFileSync(path.join(out, 'project', NAMES5[i] + '.dc.html'), `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${TITLES5[i]}</title>
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
    fs.writeFileSync(path.join(out, 'boards.json'), JSON.stringify(NAMES5.map((nm, i) => ({ file: nm + '.dc.html', title: TITLES5[i] })), null, 1));
    fs.writeFileSync(path.join(out, 'measure.html'), `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0}${m.css}.card{margin:0}</style></head><body><div class="cards">${m.cards.join('')}</div></body></html>`);
  }
  console.log('ok', WS.map(w => wl(w) + ' ' + INK[w] + '%').join(' · '));
}
