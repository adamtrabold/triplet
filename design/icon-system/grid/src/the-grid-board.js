// THE GRID board (10-27): one board, "The grid", drawn from the code (the-grid.js GRID, svg/the-grid/build.json, grid-check.js).
//   node src/the-grid-board.js <out.dc.html> [blobs.json]   blobs.json: {"grid-2x": "/_blob/..", "grid-3x": ".."}; without it the
//   local PNGs are linked (for the phone stills)
'use strict';
const fs = require('fs'), path = require('path');
process.env.TOOLS = process.env.TOOLS || '/tmp/claude-0/-home-user-la-trip-map/e88b6fb0-7c93-5435-a682-b10a85f40e06/scratchpad/tools';
const ROOT = path.join(__dirname, '..');
const { GRID } = require('./the-grid.js'), { check } = require('./grid-check.js');
const B = JSON.parse(fs.readFileSync(path.join(ROOT, 'svg', 'the-grid', 'build.json'), 'utf8'));
const now = fs.readFileSync(path.join(ROOT, 'simplify', 'boards', 'Grid7Now.dc.html'), 'utf8'), A = {};
for (const m of now.matchAll(/<svg width="24" height="24" viewBox="0 0 24 24"[^>]*aria-label="([^"]+)"[^>]*><path fill="[^"]+" fill-rule="evenodd" d="([^"]+)"\/>/g)) if (!A[m[1]]) A[m[1]] = m[2];
const OUT = process.argv[2], BLOB = process.argv[3] ? JSON.parse(fs.readFileSync(process.argv[3], 'utf8')) : null;
const img = k => BLOB ? BLOB[k] : 'file://' + path.join(ROOT, 'stills', 'the-grid', `${k}.png`);
const NAVY = '#12293F', ORANGE = '#EE7434', DEEP = '#A8400C', GREY = '#5A564C', RULE = '#D8CEBA', PAPER = '#FAF5EA', FIELD = '#F2EBDD', LINE = '#B9C6D2';
const W = 1200;
const ORDER = ['cafe', 'bar', 'museum', 'nature', 'star', 'plus'];
const NAME = { cafe: 'Café', bar: 'Coupe', museum: 'Museum', nature: 'Tree', star: 'Star', plus: '+' };
const APPROVED = { cafe: A['Café'], bar: A.Bar, museum: A.Museum, nature: A.Nature, star: A.Star, plus: A.Add };
const fx = v => String(Math.round(v * 100) / 100);
const frac = v => { const w = Math.floor(v + 1e-9), t = +(v - w).toFixed(3), q = { 0: '', 0.25: '¼', 0.5: '½', 0.75: '¾' }[t]; return q === undefined ? fx(v) : `${w || (q ? '' : '0')}${q}`; };

// ---- pieces
const T = (s, o = {}) => `<p style="margin:${o.m || '0 0 8px'};font-size:${o.size || 17}px;line-height:1.4;color:${o.color || '#1A1A18'}">${s}</p>`;
const H2 = (n, s) => `<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${GREY};text-transform:uppercase;margin:20px 0 8px">${n} · ${s}</div>`;
// grid lines in a viewBox of 24 units; win = [x0, y0, x1, y1] to draw; centre lines orange
function gridLines(win = [0, 0, 24, 24], sw = 0.04, cx = 12, cy = 12, half = false) {
  let s = '';
  if (half) for (let i = win[0]; i < win[2]; i++) { s += `<line x1="${i + 0.5}" y1="${win[1]}" x2="${i + 0.5}" y2="${win[3]}" stroke="${LINE}" stroke-width="${sw * 0.8}" stroke-dasharray="0.12 0.12"/>`; }
  if (half) for (let i = win[1]; i < win[3]; i++) { s += `<line x1="${win[0]}" y1="${i + 0.5}" x2="${win[2]}" y2="${i + 0.5}" stroke="${LINE}" stroke-width="${sw * 0.8}" stroke-dasharray="0.12 0.12"/>`; }
  for (let i = win[0]; i <= win[2]; i++) s += `<line x1="${i}" y1="${win[1]}" x2="${i}" y2="${win[3]}" stroke="${LINE}" stroke-width="${sw}"/>`;
  for (let i = win[1]; i <= win[3]; i++) s += `<line x1="${win[0]}" y1="${i}" x2="${win[2]}" y2="${i}" stroke="${LINE}" stroke-width="${sw}"/>`;
  s += `<line x1="${cx}" y1="${win[1]}" x2="${cx}" y2="${win[3]}" stroke="${ORANGE}" stroke-width="${sw * 2}"/><line x1="${win[0]}" y1="${cy}" x2="${win[2]}" y2="${cy}" stroke="${ORANGE}" stroke-width="${sw * 2}"/>`;
  return s;
}
const svg = (w, h, vb, inner, label) => `<svg width="${w}" height="${h}" viewBox="${vb}" role="img" aria-label="${label}" style="display:block">${inner}</svg>`;

// ---- 1. the grid itself
function gridDiagram() {
  const box = (x0, y0, x1, y1, dash, col) => `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="none" stroke="${col}" stroke-width="0.09" stroke-dasharray="${dash}"/>`;
  const lab = (x, y, s, col = NAVY, a = 'start') => `<text x="${x}" y="${y}" font-family="Archivo,Arial,sans-serif" font-size="0.62" font-weight="700" fill="${col}" text-anchor="${a}">${s}</text>`;
  let s = `<rect x="0" y="0" width="24" height="24" fill="${FIELD}"/>`;
  s += gridLines([0, 0, 24, 24], 0.035);
  s += `<circle cx="12" cy="12" r="11.25" fill="none" stroke="${NAVY}" stroke-width="1.5" opacity="0.18"/>`;
  s += `<circle cx="12" cy="12" r="8" fill="none" stroke="${GREY}" stroke-width="0.07" stroke-dasharray="0.3 0.2"/>`;
  s += `<circle cx="12" cy="12" r="6" fill="none" stroke="${GREY}" stroke-width="0.07" stroke-dasharray="0.08 0.18"/>`;
  s += box(7, 7, 17, 17, '', DEEP) + box(7, 8, 18, 17, '0.35 0.2', '#2E6E9E') + box(8, 7, 16, 18, '0.12 0.15', '#547326');
  s += lab(7, 6.6, 'SQUARE 10', DEEP) + lab(18.25, 10.6, 'WIDE', '#2E6E9E') + lab(18.25, 11.4, '11 × 9', '#2E6E9E') + lab(12, 18.9, 'TALL 8 × 11', '#547326', 'middle');
  s += lab(12, 3.65, 'live ⌀16', GREY, 'middle') + lab(12, 5.65, 'coin ⌀12', GREY, 'middle');
  s += lab(3.9, 11.7, '12', ORANGE) + lab(12.2, 20.6, '12', ORANGE);
  return svg(384, 384, '0 0 24 24', s, 'the grid: 24 cells of 1px, the centre lines, the badge ring, live circle, coin and the three class boxes');
}
const NUMBERS = [
  ['Cell', '1px', 'the only place sharp on both your 5K (2x) and an iPhone (3x).'],
  ['Centre', 'a line', '12 is a grid line, so anything centred is an even width.'],
  ['Solid', '2px', 'every solid part (slab, post, column, stem, trunk, rim, wall, ear): the first whole px not thinner than the 1½ stroke.'],
  ['Gap', '1px', 'the space between two parts: a cut, an opening, the coupe\'s band.'],
  ['Counter', '1 or 2', 'a hole in one part: what its root leaves; at least 2 along, or the root grows a px (1 × 1 reads as a dot).'],
  ['Stroke', '1½px', 'the + and the star only: one edge on a line, one on the half line. Sharp on the 5K; on an iPhone the half edge is soft (the price of 1½).'],
  ['Overhang', '1px', 'what sticks out does so by a whole px. The capital\'s ½ bevel is one curve: no edge to land.'],
  ['Point', '+½', 'an apex or tip may pass its box by ½ (a point carries less ink).'],
  ['Boxes', '10 · 11 × 9 · 8 × 11', 'each class\'s size limit: the approved size to whole px. Marks: star 12 tall, + 13½ across, 1:1 where they live.'],
];
const numbersList = () => `<div style="display:grid;grid-template-columns:92px 118px 1fr;gap:5px 12px;font-size:15px;line-height:1.32;align-items:baseline">${NUMBERS.map(([a, b, c]) => `<div style="font-weight:700;color:${NAVY}">${a}</div><div style="font-weight:700;color:${DEEP}">${b}</div><div>${c}</div>`).join('')}</div>`;

// ---- 2. how each kind of part lands
const PARTS = [
  ['Slab', 'beam, plinth: 2 tall, both faces on lines. A cap (saucer, foot): crown 2, ends 1, half the crown.'],
  ['Post', 'column, stem, trunk, rim, wall: 2 wide, on lines. Centred, it sits 11..13.'],
  ['Gap · counter', 'a gap is 1. A counter is 1 or 2 across and at least 2 along.'],
  ['Curve', 'its extremes (a bowl\'s bottom, an ellipse\'s side, a tier\'s lowest point) on lines. Where a straight cut meets it, the corner sits on the curve.'],
  ['Point · diagonal', 'tips, apexes, roof pitches and the small rounds at corners are free: they have no edge to land.'],
  ['A row of equal parts', 'centred, the thing on the centre is even. 2px parts in an odd count take 1px gaps (the middle part on the centre); an even count takes 2px gaps (the middle gap on it).'],
  ['Protrusion', 'whole px, at least 1 (the knife\'s edge, an overhang).'],
  ['Proportions', 'every ratio stays (proportions.js). Its result goes to the nearest whole px. If the box can\'t hold it, the box wins.'],
  ['Placement', 'an icon moves only in whole px: up or down to its optical centre; a symmetric icon on the centre line; a lopsided one (the cup) to the whole px nearest its optical centre.'],
  ['A centred stroke', 'its centre on a quarter line (k + ¼), so each edge lands on a line or a half line. The + is drawn so; its frame\'s centre is its button\'s centre, so it is dead centre in the orange circle.'],
];
const partsList = () => `<div style="display:grid;grid-template-columns:150px 1fr 150px 1fr;gap:6px 14px;font-size:15px;line-height:1.32;align-items:baseline">${PARTS.map(([a, b]) => `<div style="font-weight:700;color:${NAVY}">${a}</div><div>${b}</div>`).join('')}</div>`;

// ---- 3. the museum on the grid
function museumDiagram() {
  const m = B.museum, d = m.d, win = [5, 5, 19, 19];
  const lab = (x, y, s, col = DEEP, a = 'middle', fs = 0.5) => `<text x="${x}" y="${y}" font-family="Archivo,Arial,sans-serif" font-size="${fs}" font-weight="700" fill="${col}" text-anchor="${a}">${s}</text>`;
  let s = `<rect x="5" y="5" width="15.5" height="14" fill="${FIELD}"/>` + gridLines([5, 5, 20, 19], 0.03);
  s += `<path fill="${NAVY}" fill-opacity="0.82" fill-rule="evenodd" d="${d}"/>`;
  // widths along the bottom: overhang 1, columns 2, openings 1
  const xs = [[7, 8, '1'], [8, 10, '2'], [10, 11, '1'], [11, 13, '2'], [13, 14, '1'], [14, 16, '2'], [16, 17, '1']];
  for (const [a, b, t] of xs) s += lab((a + b) / 2, 17.85, t);
  s += lab(12, 18.65, '10 wide', NAVY, 'middle', 0.55);
  // heights at the right
  const ys = [[15, 17, 'plinth 2'], [12, 15, 'columns 3'], [10, 12, 'beam 2'], [9, 10, 'gap 1'], [8, 9, 'ends 1'], [6.53, 8, 'roof 1½']];
  for (const [a, b, t] of ys) s += `<line x1="17.25" y1="${a + 0.08}" x2="17.25" y2="${b - 0.08}" stroke="${DEEP}" stroke-width="0.06"/>` + lab(17.45, (a + b) / 2 + 0.17, t, DEEP, 'start', 0.46);
  return svg(400, 361, '5 5 15.5 14', s, 'the museum drawn on the grid with every part measured');
}

// ---- 4. the six at 72 over the grid, and at 24
function tile(n, d, size = 96, grid = true, approved = false) {
  const ring = !['star', 'plus'].includes(n);
  // the approved marks were drawn in a 24 box shown at their slot (star 20, + 26.4); the grid's + is drawn on its quarter line,
  // so its view is shifted by ¼ to keep its own centre in the middle of the tile, with the grid lines where they really are
  const sc = approved && n === 'star' ? 20 / 24 : approved && n === 'plus' ? 1.1 : 1, o = 12 - 12 * sc;
  const q = !approved && n === 'plus' ? 0.25 : 0, vb = `${q} ${q} 24 24`;
  let s = `<rect x="${q}" y="${q}" width="24" height="24" fill="${FIELD}"/>`;
  if (grid) s += gridLines([0, 0, 25, 25], 24 / size * 0.75, 12 + q, 12 + q);
  if (ring) s += `<circle cx="12" cy="12" r="11.25" fill="none" stroke="${NAVY}" stroke-width="1.5" opacity="${grid ? 0.35 : 1}"/>`;
  s += `<path fill="${NAVY}" fill-opacity="${grid ? 0.85 : 1}" fill-rule="evenodd" d="${d}" transform="translate(${o} ${o}) scale(${sc})"/>`;
  return svg(size, size, vb, s, `${NAME[n]}${approved ? ', approved' : ', on the grid'}`);
}
const ck = Object.fromEntries(ORDER.map(n => [n, check(n, B[n].d)])), ca = Object.fromEntries(ORDER.map(n => [n, check({ star: 'Star', plus: 'Add' }[n] || n, APPROVED[n])]));
const shown = (n, r, appr) => { const s = appr && n === 'star' ? 20 / 24 : appr && n === 'plus' ? 1.1 : 1; return `${fx(r.w * s)} × ${fx(r.h * s)}`; };
const inkShown = (n, r, appr) => { const s = appr && n === 'star' ? 20 / 24 : appr && n === 'plus' ? 1.1 : 1; return Math.round(r.ink * s * s); };
const WHY = {
  cafe: 'saucer 11 (9/5 of the 6 cup), crown 2, ends 1; the ear grew 5 → 6 so its counter is 2, not a dot; walls 2',
  bar: 'bowl 10 × 6 (rim cut ⅕ of 8 → 2 above the centre), rim 2, band 1, drink 3; stem 2 × 2; foot 6, crown 2',
  museum: 'three 2px columns, 1px openings, 1px overhang; 10 + the apex\'s ½',
  nature: 'tiers as approved; trunk 1¼ → 2 (11..13); the tips 0.16 longer (a wider trunk shortens their edge)',
  star: 'one star, 12 tall (round 8), outline 1½; its top tip on a line',
  plus: 'stroke 1½ on its quarter line; arms 13½; edges on lines and half lines',
};
function sixSection() {
  const head = `<div></div>${ORDER.map(n => `<div style="font-size:15px;font-weight:700;color:${NAVY};text-align:center">${NAME[n]}</div>`).join('')}`;
  const r72 = (lab, appr) => `<div style="font-size:15px;font-weight:700;color:${NAVY}">${lab}</div>${ORDER.map(n => `<div style="display:flex;justify-content:center">${tile(n, appr ? APPROVED[n] : B[n].d, 72, true, appr)}</div>`).join('')}`;
  const r24 = (lab, appr) => `<div style="font-size:15px;font-weight:700;color:${NAVY}">${lab}</div>${ORDER.map(n => `<div style="display:flex;justify-content:center">${tile(n, appr ? APPROVED[n] : B[n].d, 24, false, appr)}</div>`).join('')}`;
  const cell = (s, b) => `<div style="padding:4px 0;border-top:1px solid ${RULE};font-size:14px;line-height:1.3;${b ? 'font-weight:700;color:' + NAVY : ''}">${s}</div>`;
  const rows = [
    ['Size, approved', n => shown(n, ca[n], true)],
    ['Size, on the grid', n => `<b>${shown(n, ck[n], false)}</b>`],
    ['Ink (px²), approved → grid', n => `${inkShown(n, ca[n], true)} → ${inkShown(n, ck[n], false)}`],
    ['Edges off the grid', n => `${ca[n].off.length} → <b>${ck[n].off.length}</b> of ${ck[n].edges}`],
    ['Soft 5K / iPhone', n => `${ca[n].soft2} / ${ca[n].soft3} → <b>${ck[n].soft2} / ${ck[n].soft3}</b>`],
  ];
  const table = `<div style="display:grid;grid-template-columns:150px repeat(6,1fr);gap:0 10px;margin-top:8px">${rows.map(([l, f]) => cell(l, true) + ORDER.map(n => cell(f(n))).join('')).join('')}</div>`;
  return `<div style="display:grid;grid-template-columns:150px repeat(6,1fr);gap:6px 10px;align-items:center">${head}${r72('Approved, at 72', true)}${r72('On the grid, at 72', false)}${r24('Approved, 24', true)}${r24('On the grid, 24', false)}</div>${table}`;
}

const tot = o => ORDER.reduce((a, n) => a + o[n].off.length, 0), totE = ORDER.reduce((a, n) => a + ck[n].edges, 0), totA = ORDER.reduce((a, n) => a + ca[n].edges, 0);
const soft = (o, k) => ORDER.reduce((a, n) => a + o[n][k], 0);
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>The grid</title>
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
<div style="width:${W}px;box-sizing:border-box;padding:28px 36px 12px;background:${PAPER};font-family:Archivo,Arial,sans-serif;color:#1A1A18">
<div style="font-size:15px;letter-spacing:.12em;font-weight:700;color:${DEEP};text-transform:uppercase">Icon grid · the one grid</div>
<h1 style="margin:6px 0 10px;font-size:40px;line-height:1.1;color:${NAVY}">The grid</h1>
${T(`One grid, every icon drawn on it: <b>1px cells in a 24 frame, the centre on a grid line.</b> Every solid part lands on lines; strokes (the + and the star) are 1½px, one edge on a line and one on the half line. The six below are built on it by the engine, and the check reads every edge: <b>${tot(ck)} of ${totE} off the grid</b> (approved: ${tot(ca)} of ${totA}).`, { size: 19 })}
${H2(1, 'The grid')}
<div style="display:grid;grid-template-columns:384px 1fr;gap:28px;align-items:start">${gridDiagram()}${numbersList()}</div>
${H2(2, 'How each kind of part lands')}
${partsList()}
${H2(3, 'Your museum question: three columns, centred')}
<div style="display:grid;grid-template-columns:400px 1fr;gap:28px;align-items:start">${museumDiagram()}<div>
${T(`<b>Width.</b> Columns 2, openings 1 (a gap between parts): 2 + 1 + 2 + 1 + 2 = 8; the beam and plinth pass it by 1 each side: <b>10</b>, the square box. The middle column sits 11..13, on the centre.`)}
${T(`<b>Not four:</b> an even count puts an opening on the centre, so openings of 2: 4 × 2 + 3 × 2 + 2 = 16, past the box.`)}
${T(`<b>Height.</b> Plinth 2, columns 3 (⅓ of the colonnade: 2⅔ → 3), beam 2, gap 1, gable ends 1, roof 1½ to the apex: <b>10½</b>, the box's 10 plus the apex's ½.`)}
${T(`<b>Why it is taller than approved (9.6 → 10.5):</b> the beam and plinth were 1.04 each and are now 2 (+1.9); the columns 2.6 → 3 (+0.4). The box takes back 1.4 from the roof (its rise 1⅔ → 1½, the ends 1.2 → 1). It is wider by 0.2 (9.8 → 10, the nearest even).`)}
${T(`20 of 20 edges on lines, sharp on both screens; only the roof's slopes and apex are free.`, { color: GREY, size: 15 })}
</div></div>
${H2(4, 'The six, built on the grid')}
${T(`Built by the engine from the grid's numbers, no hand-placed point; grid beneath, orange the centre (the +'s view is centred on its quarter-line centre).`, { size: 15, color: GREY })}
${sixSection()}
${H2(5, 'True size, one block per device pixel')}
<div style="display:grid;grid-template-columns:70px 1fr;gap:8px 12px;align-items:center">
<div style="font-size:15px;font-weight:700;color:${NAVY}">5K, 2x</div><img src="${img('grid-2x')}" alt="the six on the grid at true size, 2x device pixels" width="672" height="112" style="display:block;image-rendering:pixelated">
<div style="font-size:15px;font-weight:700;color:${NAVY}">iPhone, 3x</div><img src="${img('grid-3x')}" alt="the six on the grid at true size, 3x device pixels" width="1008" height="168" style="display:block;image-rendering:pixelated">
</div>
${T(`Soft edges: 5K ${soft(ca, 'soft2')} → <b>${soft(ck, 'soft2')}</b>, iPhone ${soft(ca, 'soft3')} → <b>${soft(ck, 'soft3')}</b> (the +'s half-line edges). Holds at 1:1 only: the app draws the badge glyph's 24 box at 18px today; the build shows it 1:1.`, { size: 15, m: '10px 0 8px' })}
${H2(6, 'Retired, and the one question')}
${T(`<b>Retired</b> (the two grids that never agreed: the Master grid's lattice and cuts, and the whole-px rules added part by part): the ⅓px lattice and the fractional class cuts (9.78, 11 × 8.56, 8.56 × 11); the line as the post and slab width (posts 1½, slabs 1½ then 2); bands of ¾ or 1½; the ¼px offset; options per icon. Kept: every proportion, the cap rule, the vessel ellipse, the joins and the rounds.`, { size: 16 })}
<div style="display:grid;grid-template-columns:32px 1fr;gap:10px;padding:8px 0;border-top:1px solid ${RULE}"><div style="font-size:24px;font-weight:700;color:${ORANGE}">1</div><div style="font-size:19px;line-height:1.35;color:${NAVY};font-weight:600">Coupe: with a 2px rim and a 1px band, a drink of 3 needs the bowl 6 deep, so the glass is 10 tall (approved 8.7) and the heaviest change in the set (ink +32%). Holding it at 9 tall leaves a drink of 2, less than approved. We built the drink of 3. Keep it, or the 9-tall glass?</div></div>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":${W},"height":${process.env.BOARD_H || 2398}}}'>
class Component extends DCLogic {
renderVals() { return {}; }
}
</script>
</body>
</html>
`;
fs.writeFileSync(OUT, html);
console.log('board', OUT, html.length);
