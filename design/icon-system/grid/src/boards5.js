// Round g5: a closer look at 1.5, 1.75 and 2px (owner: "Feels like 1.5 or 2 to me right now").
// Writes grid/cards-g5.html and, given an out dir, canvas artboards. Run: TOOLS=<paper dir> node boards5.js [out]
'use strict';
const fs = require('fs'), path = require('path');
const B4 = require('./boards4.js');
const { COL, f2, wl, GL, INK, UI, uiIcon, badge, chip, COSTS, buys } = B4;
const { NAMES } = require('./picks.js');
const { details } = require('./picks4.js');
const ROOT = path.join(__dirname, '..');
const WS = [1.5, 1.75, 2];
const Q = 'Of 1.5, 1.75 and 2px, which feels right?';
const QUOTE = 'Feels like 1.5 or 2 to me right now';

let REL = { stamp: '../inventory-png/row-stamp.png', sticker: '../inventory-png/sticker-near.png', home: '../../../apple-touch-icon.png', lighthouse: 'inspo-crops/lighthouse.png', pedxing: 'inspo-crops/pedxing.png', tower: 'inspo-crops/tower.png', tent: 'inspo-crops/tent.png' };
// MUTCD brown signs (design/inspo/mutcd-recreation, fig-2h-05-1), each sign 81px square, scaled so the sign = the 24px badge
const PAIRS = [['lighthouse', 'museum', 'Lighthouse / column front'], ['pedxing', 'street', 'Ped Xing / walker'], ['tower', 'attraction', 'Lookout tower / wheel'], ['tent', 'nature', 'Tent / conifer']];
const sign = (k, px) => `<img src="${REL[k]}" width="${px}" height="${px}" alt="MUTCD sign" style="display:block">`;
const MEASURE = 'Measured on MUTCD sheet 1: each sign is 81px; at that scale a 24px badge is 0.296 of it. Line parts: lookout-tower legs 4px (1.2px at badge scale), the walker\'s limbs 6px (1.8), the crosswalk dashes 3px (0.9), the litter can\'s walls 4–7px (1.2–2.1). Heavy walls: the cup 7–8px (2.1–2.4), the tunnel arch 14px (4.1, a mass). The lines centre near 1.5px; the weight comes from solid masses. The signs\' pictures also fill more of their square than our 12px box fills the badge, so compare line weight, not overall size.';
const stamp = () => `<img src="${REL.stamp}" width="82" height="44" alt="Visited stamp, unchanged">`;
const sticker = () => `<img src="${REL.sticker}" width="40" height="40" alt="Visited sticker, unchanged">`;
const home = (px = 60) => `<img src="${REL.home}" width="${px}" height="${px}" alt="Home-screen icon, today's" style="border-radius:${f2(px * 0.2237)}px;display:block">`;
const NAME = id => NAMES.find(n => n[0] === id)[1];

// the selected pin: 32px, ink field, rim = w, the 24 drawing at 1:1 in paper
const selPin = (w, id) => `<svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="${f2(16 - w / 2)}" fill="${COL.navy}" stroke="${COL.navy}" stroke-width="${w}"/><path d="${GL[w][id].b24.d}" transform="translate(4 4)" fill="${COL.paper}"/></svg>`;
const accountBtn = w => `<div class="acct">${uiIcon(2, w).replace(`color:${COL.navy}`, `color:${COL.paper}`)}</div>`;

const CSS = W => `
*{box-sizing:border-box}
.cards{width:${W}px;font-family:Archivo,Arial,sans-serif;color:${COL.ink};background:#E4DCCB}
.card{background:${COL.raised};padding:14px 16px 18px;margin:0 0 24px}
.no{font-size:10px;letter-spacing:.12em;color:${COL.ink2};font-weight:700;text-transform:uppercase}
h2{font-size:22px;margin:2px 0 4px;letter-spacing:.04em;text-transform:uppercase;color:${COL.navy};line-height:1.1}
h2 span{color:${COL.ord}}
.att{font-size:13px;margin:4px 0 10px;line-height:1.4}
.sm{font-size:12px;line-height:1.4;margin:6px 0}
.lab{font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;color:${COL.ink2};font-weight:700;margin:16px 0 6px}
.q{font-size:13px;line-height:1.4;color:${COL.navy};background:#F3ECDF;border-left:3px solid ${COL.or};padding:8px 10px;margin:10px 0}
.q b{display:block;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:${COL.ord};margin-bottom:2px}
table.cmp{width:100%;border-collapse:collapse;font-size:11.5px;line-height:1.35}
table.cmp th{font-size:15px;color:${COL.navy};text-align:left;padding:4px;border-bottom:2px solid ${COL.navy}}
table.cmp td{border-top:1px solid ${COL.hair};padding:6px 4px;vertical-align:top}
table.cmp td:first-child{font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;color:${COL.navy};width:62px}
.x3{display:grid;grid-template-columns:${W > 500 ? '120px' : '74px'} repeat(3,1fr);gap:4px 6px;align-items:center}
.x4{display:grid;grid-template-columns:${W > 500 ? '120px' : '74px'} repeat(4,1fr);gap:4px 6px;align-items:center}
.x4 .n{font-size:10px;font-weight:700;color:${COL.navy};line-height:1.15}
.x4 .c{display:flex;justify-content:center;align-items:center;min-height:52px}
.x3 .h{font-size:15px;font-weight:700;color:${COL.navy};text-align:center}
.x3 .n{font-size:10px;font-weight:700;color:${COL.navy};line-height:1.15}
.x3 .c{display:flex;justify-content:center;align-items:center;min-height:52px}
.bar{display:flex;align-items:center;gap:14px;height:52px;padding:0 16px;margin:0 -16px;background:${COL.raised};border-bottom:1px solid ${COL.hair}}
.bar .city{font-size:19px;font-weight:700;letter-spacing:.06em;color:${COL.navy};flex:1;text-transform:uppercase}
.acct{width:40px;height:40px;border-radius:50%;background:${COL.navy};display:flex;align-items:center;justify-content:center}
.chips{display:flex;gap:6px;overflow:hidden;padding:10px 0}
.chip{display:inline-flex;align-items:center;gap:7px;height:30px;padding:0 10px;background:${COL.raised};border:1px solid ${COL.hair};border-bottom:2px solid ${COL.navy};font-size:11px;font-weight:700;letter-spacing:.08em;color:${COL.navy};flex:none}
.row{display:flex;align-items:center;gap:10px;height:56px;background:#F1E9DB;padding:0 16px;border-bottom:1px solid ${COL.hair};margin:0 -16px}
.row .t{font-size:16px;font-weight:600;line-height:1.15;flex:1}
.row .t small{display:block;font-size:10.5px;letter-spacing:.08em;font-weight:700;opacity:.72;margin-top:2px}
.map{position:relative;height:190px;background:${COL.map};margin:0 -16px;overflow:hidden}
.map .pn{position:absolute;line-height:0}
.map .plus{position:absolute;left:14px;bottom:12px;width:56px;height:56px;border-radius:50%;background:${COL.or};display:flex;align-items:center;justify-content:center}
.tag{position:relative;margin:14px auto 4px;width:300px;background:${COL.raised};border:1px solid ${COL.hair};border-top:7px solid ${COL.or};box-shadow:0 2px 6px rgba(0,0,0,.12);padding:12px 14px 10px}
.tag .x{position:absolute;right:8px;top:8px}
.tag .nm{font-size:18px;font-weight:700;color:${COL.navy};padding-right:24px}
.tag .ct{display:flex;align-items:center;gap:6px;font-size:10px;letter-spacing:.1em;font-weight:700;color:${COL.ink2};margin:4px 0 10px}
.tag .seg{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid ${COL.hair}}
.tag .seg div{display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 0 2px;font-size:9.5px;letter-spacing:.08em;font-weight:700;color:${COL.navy};text-transform:uppercase}
.tag .seg div+div{border-left:1px solid ${COL.hair}}
.fam{display:flex;gap:12px;align-items:center;margin-top:12px}
.fam .plus{width:56px;height:56px;border-radius:50%;background:${COL.or};display:flex;align-items:center;justify-content:center}
`;

function sheetIntro(n) {
  const d = WS.map(w => details(w));
  return `<section class="card" id="c${n}"><div class="no">Grid · round 5 · sheet ${n}</div><h2>1.5, 1.75 or 2px</h2>
<div class="q"><b>You said</b>"${QUOTE}"</div>
<p class="att">A closer look at that range. You asked what's closest to the inspo: sheet 1 opens with MUTCD signs beside each width at the same scale. Sheet 1 puts each icon at 2x with the three widths side by side, so the difference is easy to see. Sheets 2 to 4 show each width on its own in the app at real size, as the same screen, so you can flip between them.</p>
<table class="cmp"><tr><th></th>${WS.map(w => `<th>${wl(w)}</th>`).join('')}</tr>
<tr><td>Ink</td>${WS.map(w => `<td>${INK[w]}% of the badge</td>`).join('')}</tr>
<tr><td>Cut</td>${WS.map(w => `<td>${f2(Math.max(0.6, 0.6 * w))}px</td>`).join('')}</tr>
<tr><td>Buys</td>${WS.map(w => `<td>${buys(w)}</td>`).join('')}</tr>
<tr><td>Costs</td>${WS.map(w => `<td>${COSTS[w]}</td>`).join('')}</tr></table>
<p class="sm" style="color:${COL.ink2}">Same as the sweep: grid A, places solid, closed shapes solid, the Star the only outline, Visited and today's home-screen icon unchanged. Corners and the home-screen icon come after this pick. Skeletons, not final drawings.</p>
<div class="q"><b>The question</b>${Q}</div>
</section>`;
}

function sheetTwoX(W, n) {
  const px = W > 500 ? 72 : 48;
  const head = `<div></div>${WS.map(w => `<div class="h">${wl(w)}</div>`).join('')}`;
  const places = NAMES.map(([id, nm]) => `<div class="n">${nm}</div>${WS.map(w => `<div class="c">${badge(w, GL[w][id].b24.d, px)}</div>`).join('')}`).join('');
  const ui = UI.map((u, i) => `<div class="n">${u[0]}</div>${WS.map(w => `<div class="c">${uiIcon(i, w, u[1] * 2 * (px / 48))}</div>`).join('')}`).join('');
  const chips = NAMES.map(([id, nm]) => `<div class="n">${nm}</div>${WS.map(w => `<div class="c" style="min-height:30px"><svg width="${px / 2}" height="${px / 2}" viewBox="0 0 12 12"><path d="${GL[w][id].c12.d}" fill="${COL.navy}"/></svg></div>`).join('')}`).join('');
  return `<section class="card" id="c${n}"><div class="no">Grid · round 5 · sheet ${n}</div><h2>Each icon at 2x, side by side</h2>
<p class="att">Every icon at twice its real size, the three widths in columns. Read across a row to see what changes.</p>
<div class="lab">Beside the inspo: MUTCD brown signs, scaled so a sign is the size of a badge (2x)</div>
<div class="x4"><div class="n">MUTCD</div>${PAIRS.map(([k]) => `<div class="c">${sign(k, px)}</div>`).join('')}${WS.map(w => `<div class="n" style="font-size:13px">${wl(w)}</div>${PAIRS.map(([, id]) => `<div class="c">${badge(w, GL[w][id].b24.d, px)}</div>`).join('')}`).join('')}</div>
<div class="x4" style="margin-top:6px"><div class="n">Real size</div>${PAIRS.map(([k]) => `<div class="c" style="min-height:28px">${sign(k, 24)}</div>`).join('')}${WS.map(w => `<div class="n">${wl(w)}</div>${PAIRS.map(([, id]) => `<div class="c" style="min-height:28px">${badge(w, GL[w][id].b24.d)}</div>`).join('')}`).join('')}</div>
<p class="sm" style="color:${COL.ink2}">${PAIRS.map(p => p[2]).join(' · ')}. ${MEASURE}</p>
<div class="lab">The 13 place badges (24px, shown at 2x)</div>
<div class="x3">${head}${places}</div>
<div class="lab">The app's icons (each at 2x its real size)</div>
<div class="x3">${head}${ui}</div>
<div class="lab">The chips (12px, shown at 2x)</div>
<div class="x3">${head}${chips}</div>
</section>`;
}

function sheetApp(w, n) {
  const pins = [['restaurant', 22, 30], ['bar', 92, 12], ['museum', 150, 70], ['nature', 236, 24], ['shopping', 300, 64], ['street', 210, 120], ['park', 120, 140], ['venue', 330, 140]];
  return `<section class="card" id="c${n}"><div class="no">Grid · round 5 · sheet ${n}</div><h2>In the app at <span>${wl(w)}</span></h2>
<p class="att">Real size. Ink ${INK[w]}% of the badge.</p>
<div class="bar"><span class="city">Stockholm</span>${uiIcon(5, w)}${uiIcon(6, w)}${uiIcon(4, w)}${accountBtn(w)}</div>
<div class="chips">${['restaurant', 'cafe', 'museum', 'park', 'nature'].map(id => `<span class="chip"><svg width="12" height="12" viewBox="0 0 12 12"><path d="${GL[w][id].c12.d}" fill="${COL.navy}"/></svg>${NAME(id).toUpperCase()}</span>`).join('')}</div>
<div class="row">${badge(w, GL[w].museum.b24.d)}<div class="t">Vasa Museum<small>MUSEUM · STOCKHOLM</small></div>${uiIcon(3, w)}</div>
<div class="row">${badge(w, GL[w].landmark.b24.d)}<div class="t">Hallgrímskirkja<small>LANDMARK · REYKJAVÍK</small></div>${stamp()}</div>
<div class="row">${badge(w, GL[w].attraction.b24.d)}<div class="t">Tivoli<small>ATTRACTION · COPENHAGEN</small></div>${uiIcon(3, w)}</div>
<div class="row">${badge(w, GL[w].nature.b24.d)}<div class="t">Gunnuhver - fumarole<small>NATURE · REYKJAVÍK</small></div>${uiIcon(3, w)}</div>
<div class="map">${pins.map(([id, x, y]) => `<div class="pn" style="left:${x}px;top:${y}px">${badge(w, GL[w][id].b24.d)}</div>`).join('')}
<div class="pn" style="left:60px;top:84px">${selPin(w, 'museum')}</div><div class="pn" style="left:262px;top:96px">${sticker()}</div>
<div class="plus">${uiIcon(0, w)}</div></div>
<div class="tag"><div class="x">${uiIcon(8, w)}</div><div class="nm">Vasa Museum</div><div class="ct">${badge(w, GL[w].museum.b24.d)}MUSEUM · STOCKHOLM</div>
<div class="seg"><div>${uiIcon(3, w)}Star</div><div>${uiIcon(7, w)}Directions</div><div>${uiIcon(9, w)}Mark visited</div></div></div>
<div class="lab">Beside the inspo, real size</div>
<div style="display:flex;gap:6px;align-items:center">${PAIRS.map(([k, id]) => `${sign(k, 24)}${badge(w, GL[w][id].b24.d)}<span style="width:6px"></span>`).join('')}</div>
<div class="fam">${home(60)}<div class="sm" style="color:${COL.ink2};flex:1">Today's home-screen icon, unchanged, at its home-screen size.</div></div>
<div class="q"><b>The question</b>${Q}</div>
</section>`;
}

function page(W) { return { css: CSS(W), cards: [sheetIntro(0), sheetTwoX(W, 1), ...WS.map((w, i) => sheetApp(w, i + 2))] }; }

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
    const abs = { stamp: '/home/user/la-trip-map/.claude/worktrees/agent-a8232643d0d0e8556/design/icon-system/inventory-png/row-stamp.png', sticker: '/home/user/la-trip-map/.claude/worktrees/agent-a8232643d0d0e8556/design/icon-system/inventory-png/sticker-near.png', home: '/home/user/la-trip-map/.claude/worktrees/agent-a8232643d0d0e8556/apple-touch-icon.png' };
    REL = abs; const m = page(W);
    REL = JSON.parse(process.env.ASSETS || '{}'); const { css, cards } = page(W);
    const names = ['Grid5Intro', 'Grid5TwoX', 'Grid5App150', 'Grid5App175', 'Grid5App200'];
    const titles = ['1.5, 1.75 or 2px', 'Each icon at 2x, side by side', 'In the app at 1.5px', 'In the app at 1.75px', 'In the app at 2px'];
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
    fs.writeFileSync(path.join(out, 'measure.html'), `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0}${m.css}.card{margin:0}</style></head><body><div class="cards">${m.cards.join('')}</div></body></html>`);
  }
  console.log('ok', WS.map(w => wl(w) + ' ' + INK[w] + '%').join(' · '));
}
