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
const NAVY = '#12293F', ORANGE = '#EE7434', DEEP = '#A8400C', GREY = '#5A564C', RULE = '#D8CEBA', PAPER = '#FAF5EA', FIELD = '#F2EBDD', LINE = '#9DB0C3';
const W = 1200;
const ORDER = ['cafe', 'bar', 'museum', 'nature', 'star', 'plus'];
const NAME = { cafe: 'Café', bar: 'Coupe', museum: 'Museum', nature: 'Tree', star: 'Star', plus: '+' };
const APPROVED = { cafe: A['Café'], bar: A.Bar, museum: A.Museum, nature: A.Nature, star: A.Star, plus: A.Add };
const fx = v => String(Math.round(v * 100) / 100);
const frac = v => { const w = Math.floor(v + 1e-9), t = +(v - w).toFixed(3), q = { 0: '', 0.25: '¼', 0.5: '½', 0.75: '¾' }[t]; return q === undefined ? fx(v) : `${w || (q ? '' : '0')}${q}`; };

// ---- pieces
const T = (s, o = {}) => `<p style="margin:${o.m || '0 0 8px'};font-size:${o.size || 17}px;line-height:1.4;color:${o.color || '#1A1A18'}">${s}</p>`;
const H2 = (n, s) => `<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${GREY};text-transform:uppercase;margin:16px 0 8px">${n} · ${s}</div>`;
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
  // each icon's limit, where it sits as built (the approved box rounded up)
  const lb = n => { const b = B[n].box, l = B[n].meta.limit, x0 = Math.round(b.x0), y1 = Math.round(b.y1); return [x0, y1 - l.h, x0 + l.w, y1]; };
  const [m0, m1, m2, m3] = lb('museum'), [c0, c1, c2, c3] = lb('cafe'), [t0, t1, t2, t3] = lb('nature');
  s += box(m0, m1, m2, m3, '', DEEP) + box(c0, c1, c2, c3, '0.35 0.2', '#2E6E9E') + box(t0, t1, t2, t3, '0.12 0.15', '#547326');
  s += lab(m0, m1 - 0.25, 'MUSEUM 10 × 10', DEEP) + lab(c2 + 0.2, 10.6, 'CAFÉ', '#2E6E9E') + lab(c2 + 0.2, 11.4, '11 × 9', '#2E6E9E') + lab(12, t3 + 0.75, 'TREE 8 × 12', '#547326', 'middle');
  s += lab(12, 3.65, 'live ⌀16', GREY, 'middle') + lab(12, 5.35, 'coin ⌀12', GREY, 'middle');
  s += lab(3.9, 11.7, '12', ORANGE) + lab(12.2, 20.6, '12', ORANGE);
  return svg(384, 384, '0 0 24 24', s, 'the grid: 24 cells of 1px, the centre lines, the badge ring, live circle, coin and the three class boxes');
}
const NUMBERS = [
  ['Cell', '1px', 'the only place sharp on both your 5K (2x) and an iPhone (3x).'],
  ['Centre', 'a line', '12 is a grid line, so anything centred is an even width.'],
  ['Stroke', '1½px', 'a line in the thing (a rim, a handle, a ring, a mark): outer edge on a line, inner edge on the half line. Sharp on the 5K; the inner edge is soft on an iPhone.'],
  ['Solid', '2px +', 'a body or a member that carries or stands (slab, base, post, column, stem, trunk): whole px, never thinner than the stroke.'],
  ['Gap', '1px', 'the space between two parts: a cut, an opening, the coupe\'s band.'],
  ['Counter', '1 or 2', 'a hole in one part, across; a 1-across hole is at least 2 long (1 × 1 reads as a dot).'],
  ['Overhang', '1px', 'what sticks out does so by a whole px. Past its post a slab drops to half (1), as a cap\'s ends.'],
  ['Limit', 'approved ↑', 'each icon\'s approved size rounded up to whole px (a centred width to even): café 11 × 9, coupe 10 × 9, museum 10 × 10, tree 8 × 12. Points count inside.'],
  ['Weight', '±10%', 'ink within 10% of approved, then by eye in the row of six.'],
];
const numbersList = () => `<div style="display:grid;grid-template-columns:92px 118px 1fr;gap:5px 12px;font-size:15px;line-height:1.32;align-items:baseline">${NUMBERS.map(([a, b, c]) => `<div style="font-weight:700;color:${NAVY}">${a}</div><div style="font-weight:700;color:${DEEP}">${b}</div><div>${c}</div>`).join('')}</div>`;

// ---- 2. how each kind of part lands
const PARTS = [
  ['Stroke or solid', 'would the part still be the thing drawn as one pen line? A stroke (rim, handle, ring). Otherwise a solid (body, slab, base, post, stem, trunk).'],
  ['Solid parts', '2 or more, every edge on lines; centred, a post sits 11..13. A cap (saucer, foot): crown 2, ends 1, half the crown.'],
  ['Stroke parts', '1½: outer edge on a line, inner edge on the half line; a gap laid from that inner edge stays on the half line (the coupe\'s band).'],
  ['Gap · counter', 'a gap is 1. A counter is 1 or 2 across; at 1 across, at least 2 long.'],
  ['Curve', 'its extremes (a bowl\'s bottom, an ellipse\'s side, a tier\'s lowest point) on lines; where a straight cut meets it, the corner sits on the curve.'],
  ['Point · diagonal', 'tips, apexes, roof slopes and the small rounds at corners are free: no edge to land.'],
  ['A row of equal parts', 'centred, the thing on the centre is even: 2px parts in an odd count take 1px gaps, an even count 2px gaps.'],
  ['The give order', 'if the proportions pass the limit, they round down instead of to the nearest (columns 2⅔ → 2, the rim cut 1.6 → 1); only then does a detail in lines shrink (a gable\'s ends). Strokes, solids, gaps, counters, the drink and centring never give.'],
  ['Placement', 'whole px only: up or down to the optical centre; symmetric icons on the centre line; the cup by its optical centre.'],
  ['A centred stroke', 'its centre on a quarter line (k + ¼), each edge on a line or a half line; the +\'s frame centre is its button\'s centre.'],
  ['Other sizes', 'only 24 at 1:1 is defined; 48 lands too. At 12 (the chip) lines fall on half px: sharp on the 5K only.'],
];
const partsList = () => `<div style="display:grid;grid-template-columns:150px 1fr 150px 1fr;gap:6px 14px;font-size:15px;line-height:1.32;align-items:baseline">${PARTS.map(([a, b]) => `<div style="font-weight:700;color:${NAVY}">${a}</div><div>${b}</div>`).join('')}</div>`;

// ---- 3. the museum and the coupe on the grid, every part measured
const labF = (x, y, s, col = DEEP, a = 'middle', fs = 0.5) => `<text x="${x}" y="${y}" font-family="Archivo,Arial,sans-serif" font-size="${fs}" font-weight="700" fill="${col}" text-anchor="${a}">${s}</text>`;
const dims = (ys, x = 17.25) => ys.map(([a, b, t]) => `<line x1="${x}" y1="${a + 0.08}" x2="${x}" y2="${b - 0.08}" stroke="${DEEP}" stroke-width="0.06"/>` + labF(x + 0.2, (a + b) / 2 + 0.17, t, DEEP, 'start', 0.46)).join('');
function onGrid(n, xs, ys, label, extra = '') {
  let s = `<rect x="5" y="5" width="15.5" height="14" fill="${FIELD}"/>` + gridLines([5, 5, 20, 19], 0.03) + extra;
  s += `<path fill="${NAVY}" fill-opacity="0.82" fill-rule="evenodd" d="${B[n].d}"/>`;
  for (const [a, b, t] of xs) s += labF((a + b) / 2, 17.85, t);
  s += labF(12, 18.65, '10 wide', NAVY, 'middle', 0.55) + dims(ys);
  return svg(340, 307, '5 5 15.5 14', s, label);
}
const museumDiagram = () => onGrid('museum', [[7, 8, '1'], [8, 10, '2'], [10, 11, '1'], [11, 13, '2'], [13, 14, '1'], [14, 16, '2'], [16, 17, '1']],
  [[15, 17, 'plinth 2'], [13, 15, 'columns 2'], [11, 13, 'beam 2'], [10, 11, 'gap 1'], [B.museum.box.y0, 10, 'gable 2⅔']], 'the museum drawn on the grid with every part measured');
function coupeDiagram() {
  const y0 = B.bar.box.y0, half = (B.bar.meta.half || []).map(h => `<line x1="5" y1="${h.pos}" x2="20.5" y2="${h.pos}" stroke="${ORANGE}" stroke-width="0.05" stroke-dasharray="0.25 0.15"/>`).join('');
  return onGrid('bar', [[11, 13, 'stem 2']], [[y0, y0 + 1.5, 'rim 1½'], [y0 + 1.5, y0 + 2.5, 'band 1'], [y0 + 2.5, y0 + 5, 'drink 2½'], [y0 + 5, y0 + 7, 'stem 2'], [y0 + 7, y0 + 9, 'foot 2']], 'the coupe drawn on the grid with every part measured; dashed: the half lines its rim stroke makes', half);
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
const ck = Object.fromEntries(ORDER.map(n => [n, check(n, B[n].d, B[n].meta)])), ca = Object.fromEntries(ORDER.map(n => [n, check({ star: 'Star', plus: 'Add' }[n] || n, APPROVED[n])]));
const shown = (n, r, appr) => { const s = appr && n === 'star' ? 20 / 24 : appr && n === 'plus' ? 1.1 : 1; return `${fx(r.w * s)} × ${fx(r.h * s)}`; };
const inkShown = (n, r, appr) => { const s = appr && n === 'star' ? 20 / 24 : appr && n === 'plus' ? 1.1 : 1; return Math.round(r.ink * s * s); };
function sixSection() {
  const head = `<div></div>${ORDER.map(n => `<div style="font-size:15px;font-weight:700;color:${NAVY};text-align:center">${NAME[n]}</div>`).join('')}`;
  const r72 = (lab, appr) => `<div style="font-size:15px;font-weight:700;color:${NAVY}">${lab}</div>${ORDER.map(n => `<div style="display:flex;justify-content:center">${tile(n, appr ? APPROVED[n] : B[n].d, 72, true, appr)}</div>`).join('')}`;
  const r24 = (lab, appr) => `<div style="font-size:15px;font-weight:700;color:${NAVY}">${lab}</div>${ORDER.map(n => `<div style="display:flex;justify-content:center">${tile(n, appr ? APPROVED[n] : B[n].d, 24, false, appr)}</div>`).join('')}`;
  const cell = (s, b) => `<div style="padding:4px 0;border-top:1px solid ${RULE};font-size:14px;line-height:1.3;${b ? 'font-weight:700;color:' + NAVY : ''}">${s}</div>`;
  const rows = [
    ['Size, approved', n => shown(n, ca[n], true)],
    ['Size, on the grid', n => `<b>${shown(n, ck[n], false)}</b>`],
    ['Ink (px²), approved → grid', n => `${inkShown(n, ca[n], true)} → ${inkShown(n, ck[n], false)}`],
    ['Limit, held', n => ck[n].limit ? `${ck[n].limit.w} × ${ck[n].limit.h}: <b>${ck[n].over.w <= 0.01 && ck[n].over.h <= 0.01 ? 'yes' : 'NO'}</b>` : 'its slot'],
    ['Weight vs approved', n => { const sg = v => `${v >= 0 ? '+' : ''}${v}%`; if (ck[n].weight != null) return `<b>${sg(Math.round(ck[n].weight * 100))}</b>`;
      const v = Math.round((inkShown(n, ck[n], false) / (ck[n].w * ck[n].h) / (inkShown(n, ca[n], true) / (ca[n].w * ca[n].h * (n === 'star' ? 25 / 36 : 1.21))) - 1) * 100);
      return `${sg(v)}${n === 'plus' ? ' (1½, was 1⅔)' : ''} per area`; }],
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
<div style="width:${W}px;box-sizing:border-box;padding:24px 36px 8px;background:${PAPER};font-family:Archivo,Arial,sans-serif;color:#1A1A18">
<div style="font-size:15px;letter-spacing:.12em;font-weight:700;color:${DEEP};text-transform:uppercase">Icon grid · the one grid</div>
<h1 style="margin:6px 0 10px;font-size:40px;line-height:1.1;color:${NAVY}">The grid</h1>
${T(`One grid, every icon drawn on it: <b>1px cells in a 24 frame, the centre on a grid line.</b> Solid parts land on lines; strokes (rims, handles, the + and the star) are 1½px, one edge on a line and one on the half line. Each icon holds its approved size and weight. The six below are built on it by the engine, and the check reads every edge: <b>${tot(ck)} of ${totE} off the grid</b> (approved: ${tot(ca)} of ${totA}).`, { size: 19 })}
${H2(1, 'The grid')}
<div style="display:grid;grid-template-columns:384px 1fr;gap:28px;align-items:start">${gridDiagram()}${numbersList()}</div>
${H2(2, 'How each kind of part lands')}
${partsList()}
${H2(3, 'Your museum question, and the coupe, on the grid')}
<div style="display:grid;grid-template-columns:340px 340px 1fr;gap:20px;align-items:start">${museumDiagram()}${coupeDiagram()}<div>
${T(`<b>Museum.</b> 2 + 1 + 2 + 1 + 2 = 8, and 1 past each side: <b>10</b>. The middle column sits 11..13. Four can't: an even count puts a 2px opening on the centre, 16 wide.`, { size: 15 })}
${T(`<b>Height, held at 10:</b> plinth, beam (2 each) and gap (1) are fixed. To the nearest px the columns (⅓ of 8: 2⅔ → 3) and gable (ends 1, rise 1⅔) make 10⅔, so by the give order they round down: columns 2. It reads ${fx(B.museum.box.y1 - B.museum.box.y0)} tall (approved 9.62).`, { size: 15 })}
${T(`<b>Coupe, 9 tall:</b> rim 1½ (a stroke), band 1, drink 2½ (as approved), bowl 10 × 5, stem 2, foot 2. To fit, the rim cut (1.6) rounds down to 1. Dashed: the rim's half lines.`, { size: 15 })}
</div></div>
${H2(4, 'The six, built on the grid')}
${T(`Built by the engine from the grid's numbers; grid beneath, orange the centre (the +'s view centred on its quarter line).`, { size: 15, color: GREY })}
${sixSection()}
${H2(5, 'True size, one block per device pixel')}
<div style="display:grid;grid-template-columns:70px 1fr;gap:8px 12px;align-items:center">
<div style="font-size:15px;font-weight:700;color:${NAVY}">5K, 2x</div><img src="${img('grid-2x')}" alt="the six on the grid at true size, 2x device pixels" width="672" height="112" style="display:block;image-rendering:pixelated">
<div style="font-size:15px;font-weight:700;color:${NAVY}">iPhone, 3x</div><img src="${img('grid-3x')}" alt="the six on the grid at true size, 3x device pixels" width="1008" height="168" style="display:block;image-rendering:pixelated">
</div>
${T(`Soft edges: 5K ${soft(ca, 'soft2')} → <b>${soft(ck, 'soft2')}</b>, iPhone ${soft(ca, 'soft3')} → <b>${soft(ck, 'soft3')}</b> (each a stroke's inner edge on a half line: the price of 1½). Holds at 1:1 only: the app draws the badge glyph's 24 box at 18px today; the build shows it 1:1.`, { size: 15, m: '10px 0 8px' })}
${H2(6, 'Retired')}
${T(`The ⅓px lattice and fractional cuts; posts and slabs at the line; ¾ and 1½ bands; the ¼px offset; option menus. Kept: every proportion, the cap rule, the joins, the rounds.`, { size: 16 })}
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
