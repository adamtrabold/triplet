// THE SYSTEM, the three boards (10-28): "Icons" (every icon the system makes, real SVGs at the sizes the app uses, then the same
// SVG at 6x), "Icons on the grid" (the same set and layout with the grid under each: the iPhone pixel, whole pixels, the keylines,
// the centre, and at 6x the roots outlined), and "Rules" (every decision point, its setting and date, grouped; the open decisions;
// each icon's declaration). Written from system.js, the build (svg/system/<size>) and the roots (system-roots.js), so they
// regenerate with the system and never drift from it.
//   node system-boards.js <out dir>        writes <out>/{Icons,IconsGrid,SystemRules}.html (to measure) and, with BOARD_H_<NAME>=<px>,
//                                           the canvas files <out>/Grid7{Icons,IconsGrid,SystemRules}.dc.html at that height
'use strict';
const fs = require('fs'), path = require('path');
const S = require('./system.js'), P7 = require('./picks7.js');
const C = { navy: '#12293F', paper: '#FAF5EA', tile: '#F2EBDD', orange: '#EE7434', deep: '#A8400C', grey: '#5A564C', rule: '#D8CEBA', ink: '#1A1A18', ask: '#FBE9DD', moss: '#547326', lattice: '#C9BBA0', whole: '#A39274', key: '#2F6FA8' };
const FONT = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&amp;display=swap">';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const J = f => fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null;
const B = (size, id) => J(path.join(S.OUT, String(size), `${id}.json`));
const ROOTS = (size, id) => J(path.join(S.OUT, 'roots', String(size), `${id}.json`));
// what each drawing is (the owner's names for them); the category it serves is the declaration's name
const LABEL = { cafe: 'Café', bar: 'Coupe', museum: 'Museum', nature: 'Tree', restaurant: 'Fork and knife', park: 'Bench', star: 'Star', plus: '+' };
const CAT = id => S.MARK[S.DECL[id].cls] ? (id === 'star' ? 'line mark' : 'line mark') : S.DECL[id].proof ? 'the system\'s proof' : S.DECL[id].name;
const BIG = 6;   // the larger view: the same SVG at 6x (one iPhone pixel = 2 CSS px)

// ---------------------------------------------------------------------------------------------------------------------------
// THE VIEWS. Every view is the app's own SVG: a 24-unit drawing shown at the px the app gives it (the 18 in the 24 ring, the 24
// in the 32 ring, the 12 at 16 bare, the star at 18 bare, the + at 28 in its 60 button). `px` is the screen size, `scale` the
// magnification on top (1 at true size, BIG for the larger view).
const RING = { 24: 4 / 3, 32: 5 / 3 };   // the ring's width in px (system.js RING: the 24 ring round the 18, the 32 ring round the 24)
function ringed(d, px, scale, label, over = '') {
  const u = RING[px] * 24 / px;
  return `<svg width="${px * scale}" height="${px * scale}" viewBox="0 0 24 24" role="img" aria-label="${esc(label)}" style="display:block;overflow:visible"><circle cx="12" cy="12" r="${12 - u / 2}" fill="${C.tile}"${over ? '' : ` stroke="${C.navy}" stroke-width="${u}"`}/>${over ? over.under + `<circle cx="12" cy="12" r="${12 - u / 2}" fill="none" stroke="${C.navy}" stroke-width="${u}" stroke-opacity=".78"/>` : ''}<path fill="${C.navy}" fill-rule="evenodd" d="${d}"${over ? ' fill-opacity=".78"' : ''}/>${over ? over.top : ''}</svg>`;
}
function bare(d, px, scale, label, over = '', bg = 'none') {
  return `<svg width="${px * scale}" height="${px * scale}" viewBox="0 0 24 24" role="img" aria-label="${esc(label)}" style="display:block;overflow:visible;background:${bg}">${over ? over.under : ''}<path fill="${C.navy}" fill-rule="evenodd" d="${d}"${over ? ' fill-opacity=".78"' : ''}/>${over ? over.top : ''}</svg>`;
}
// the + in its 60 button (as the app: the 28 box at 16,16)
function button(d, scale, label, over = '') {
  const s = scale;
  return `<div style="width:${60 * s}px;height:${60 * s}px;border-radius:50%;background:${C.orange};position:relative;flex:none" role="img" aria-label="${esc(label)}"><div style="position:absolute;left:${16 * s}px;top:${16 * s}px">${bare(d, 28, s, label, over)}</div></div>`;
}

// ---------------------------------------------------------------------------------------------------------------------------
// THE GRID UNDER A VIEW. Lines are placed in SCREEN px (an iPhone pixel is 1/3 of a screen px), written in the drawing's 24 units
// (u = 24 / px units per screen px). Widths are in units too, so they scale with the canvas zoom and resolve when zoomed in.
function gridOver(px, scale, { id, size, roots, mark } = {}) {
  const u = 24 / px, big = scale > 1, css = w => w / scale * u;   // a width in CSS px at this view, in the drawing's units
  const lw = css(big ? 0.4 : 0.045), ww = css(big ? 0.7 : 0.11);
  const lines = [];
  for (let i = 0; i <= 3 * px; i++) { const v = (i / 3) * u, whole = i % 3 === 0;
    if (whole) continue;
    lines.push(`M${f(v)} 0V24M0 ${f(v)}H24`); }
  const lat = `<path d="${lines.join('')}" stroke="${C.lattice}" stroke-width="${f(lw)}" fill="none"/>`;
  const wl = []; for (let i = 0; i <= px; i++) { const v = i * u; wl.push(`M${f(v)} 0V24M0 ${f(v)}H24`); }
  const whole = `<path d="${wl.join('')}" stroke="${C.whole}" stroke-width="${f(ww)}" fill="none"/>`;
  // the keylines: the class box (the cut the icon is fitted to) and the coin (every class box has its area), centred; the centre
  let keys = '';
  const kw = css(big ? 1.4 : 0.22), dash = big ? `stroke-dasharray="${f(css(5))} ${f(css(3))}"` : '';
  if (!mark) {
    const b = B(size, id), cls = (b && b.meta && b.meta.cls) || S.DECL[id].cls.toUpperCase(), K = P7.KEY[cls] || P7.KEY.SQUARE, FK = 11 / 12;
    const apex = (b && S.DECL[id].spine.some(r => r.kind === 'gable' || r.kind === 'tiers')) ? P7.APEX : 0;
    const w = K[0] * FK, h = (K[1] + apex) * FK;
    keys += `<rect x="${f(12 - w / 2)}" y="${f(12 - h / 2)}" width="${f(w)}" height="${f(h)}" fill="none" stroke="${C.key}" stroke-width="${f(kw)}" ${dash}/>`;
    keys += `<circle cx="12" cy="12" r="6" fill="none" stroke="${C.key}" stroke-width="${f(kw * 0.8)}" stroke-opacity=".6"/>`;
  }
  const cl = 1.5;
  keys += `<path d="M12 ${f(12 - cl)}V${f(12 + cl)}M${f(12 - cl)} 12H${f(12 + cl)}" stroke="${C.deep}" stroke-width="${f(css(big ? 1.4 : 0.22))}"/>`;
  // the construction: the roots as the system landed them, outlined (a root that cuts dashed)
  let rs = '';
  if (big && roots) rs = roots.map(r => `<path d="${r.d}" fill="none" stroke="${C.orange}" stroke-width="${f(css(1))}"${r.cut ? ` stroke-dasharray="${f(css(4))} ${f(css(3))}"` : ''}/>`).join('');
  return { under: lat + whole, top: keys + rs };
}
const f = v => +(+v).toFixed(4);

// ---------------------------------------------------------------------------------------------------------------------------
// THE TABLE: the same for both boards; `grid` adds the grid under every view
const COLW = 176, LABW = 150, GAP = 14;
function views(id, grid) {
  const d = S.DECL[id], n = LABEL[id], b18 = B(18, id), b24 = B(24, id), b12 = B(12, id), R = grid ? ROOTS(18, id) : null;
  const none = t => `<div style="font-size:12.5px;color:${C.grey};text-align:center;line-height:1.3">${t}</div>`;
  const G = (px, s, extra) => grid ? gridOver(px, s, { id, ...extra }) : '';
  if (d.cls === 'outline') return [
    bare(b18.d, 18, 1, `${n}, row, 18`, G(18, 1, { mark: true }), C.paper), none('one drawing, every size'), '',
    bare(b18.d, 18, BIG, `${n}, ${BIG}x`, G(18, BIG, { mark: true, roots: R && R.roots }))];
  if (d.cls === 'open') return [
    button(b18.d, 1, `${n}, in the 60 button`, G(28, 1, { mark: true })), none('one drawing, every size'), '',
    bare(b18.d, 28, BIG, `${n}, ${BIG}x`, G(28, BIG, { mark: true, roots: R && R.roots }))];
  return [
    ringed(b18.d, 24, 1, `${n}, 18 in the 24 ring`, G(24, 1, { size: 18 })),
    b24 ? ringed(b24.d, 32, 1, `${n}, 24 in the 32 ring`, G(32, 1, { size: 24 })) : '',
    b12 ? bare(b12.d, 16, 1, `${n}, 12 on a chip`, G(16, 1, { size: 12 })) : '',
    ringed(b18.d, 24, BIG, `${n}, 18 at ${BIG}x`, G(24, BIG, { size: 18, roots: R && R.roots }))];
}
const ROWS = [
  ['App size', '18 in the 24 ring (pins, rows) · star bare · + in its button'],
  ['Selected', '24 in the 32 ring'],
  ['Chip', '12'],
  [`${BIG}x`, 'the 18 drawn larger: the same SVG'],
];
function table(grid) {
  const cols = S.ORDER.map(id => ({ id, v: views(id, grid) }));
  const head = `<div style="width:${LABW}px"></div>` + cols.map(c => `<div style="width:${COLW}px;text-align:center"><div style="font-size:19px;font-weight:700;color:${C.navy}">${esc(LABEL[c.id])}</div>${CAT(c.id) !== LABEL[c.id] ? `<div style="font-size:12.5px;color:${C.grey};margin-top:2px">${esc(CAT(c.id))}</div>` : '<div style="font-size:12.5px;margin-top:2px">&#160;</div>'}</div>`).join('');
  const rowH = [40, 48, 30, null];
  const rows = ROWS.map(([t, sub], ri) => `<div style="display:flex;gap:${GAP}px;align-items:center;padding:${ri === 3 ? 18 : 12}px 0;border-top:1px solid ${C.rule}">
<div style="width:${LABW}px;flex:none"><div style="font-size:15px;font-weight:700;color:${C.navy}">${t}</div><div style="font-size:12.5px;color:${C.grey};line-height:1.3;margin-top:2px">${sub}</div></div>
${cols.map(c => `<div style="width:${COLW}px;flex:none;display:flex;justify-content:center;align-items:center;${rowH[ri] ? `height:${rowH[ri] * (ri === 0 && c.id === 'plus' ? 1.6 : 1)}px` : ''}">${c.v[ri] || ''}</div>`).join('')}</div>`).join('');
  return `<div style="display:flex;gap:${GAP}px;align-items:flex-end;padding-bottom:10px">${head}</div>${rows}`;
}
const W_ICONS = 36 * 2 + LABW + S.ORDER.length * (COLW + GAP);
function shell(W, kicker, title, lede, body) {
  return `<div style="width:${W}px;box-sizing:border-box;padding:30px 36px 32px;background:${C.paper};font-family:Archivo,Arial,sans-serif;color:${C.ink}">
<div style="font-size:14px;letter-spacing:.12em;font-weight:700;color:${C.deep};text-transform:uppercase">${kicker}</div>
<h1 style="margin:4px 0 6px;font-size:38px;line-height:1.1;color:${C.navy}">${title}</h1>
<p style="margin:0 0 18px;font-size:17px;line-height:1.4;max-width:1100px">${lede}</p>
${body}</div>`;
}
function iconsBoard(check) {
  const ok = check ? (check.ok ? `<b style="color:${C.moss}">Every check passes at 18, 24 and 12.</b>` : `<b style="color:${C.deep}">Checks fail: not ready.</b>`) : '';
  return shell(W_ICONS, 'Icon system', 'Icons', `Every icon the system makes, as the app shows them, then the same SVG at ${BIG}x. ${ok}`, table(false));
}
function legendItem(svg, t) { return `<div style="display:flex;align-items:center;gap:8px;font-size:14px">${svg}<span>${t}</span></div>`; }
function gridBoard() {
  const sw = (stroke, w, dash = '') => `<svg width="34" height="14" aria-hidden="true"><path d="M2 7H32" stroke="${stroke}" stroke-width="${w}" ${dash}/></svg>`;
  const legend = `<div style="display:flex;flex-wrap:wrap;gap:10px 28px;margin:0 0 16px">
${legendItem(sw(C.lattice, 1.2), 'iPhone pixel, ⅓px')}${legendItem(sw(C.whole, 1.6), 'whole pixel')}
${legendItem(sw(C.key, 1.6, 'stroke-dasharray="5 3"'), 'class box (the keyline the icon is fitted to)')}${legendItem(sw(C.key, 1.4, 'stroke-opacity=".6"'), 'coin, Ø12 (every class box has its area)')}
${legendItem(sw(C.deep, 1.6), 'centre')}${legendItem(sw(C.orange, 1.6), 'roots, outlined (dashed: a root cut away)')}</div>`;
  return shell(W_ICONS, 'Icon system', 'Icons on the grid', `The same icons with the grid under each. At app size the grid is at true scale (zoom in to see the iPhone pixels); at ${BIG}x one iPhone pixel is 2px, and the roots each icon is built from are outlined.`, legend + table(true));
}

// ---------------------------------------------------------------------------------------------------------------------------
// RULES: every decision point, grouped, its setting and date; open decisions with their choices; the sizes; each declaration
const GROUPS = [
  ['Purpose', ['One set, one system', 'What it covers', 'Rules, not drawings', 'Flexible, not specific', 'How it looks wins', 'The grid is the brand']],
  ['Size and grid', ['Master size', 'Where each size ships', 'The grid', 'Scale and weight', 'The box']],
  ['Snapping', ['Snap priority', 'Centring', 'Centred under a part', 'Sharpness']],
  ['Weight', ['Stroke', 'Stroke at 18 on the grid', 'Parts that are not strokes', 'Thinnest part at 12', 'Solids are shapes', 'Same role, same width', 'The ring']],
  ['Construction', ['Roots', 'Proportions', 'Aligned roots', 'Brand in the roots', 'Few points', 'Holes', 'Handles', 'Protrusions', 'No narrow passages', 'When rules meet']],
  ['Tooling', ['Machined', 'The cutter rack', 'The rack at 24 and 12', 'Chamfer under an overhang', 'Chamfer angle', 'Fillet into a face', 'Points', 'Every meeting rounded', 'Inner corners']],
  ['Curvature', ['Whole curves', 'Continuous curvature', 'Counters follow', 'Humanist line']],
  ['Counters and rows', ['Counters and gaps', 'Inner bands', 'Rows', 'Combs', 'Comb depth']],
  ['Brand', ['Direction', 'Three filters', 'Ring and alone', 'Never', 'Outline or solid', 'Novelty']],
  ['Line marks', ['Star and +', 'Star', '+']],
  ['Subjects', ['Categories', 'Subjects', 'Museum columns', 'Shopping']],
];
function rulesBoard() {
  const all = new Map(); for (const g of S.SETTINGS) for (const it of g.items) all.set(it[0], it);
  const used = new Set(GROUPS.flatMap(g => g[1]));
  const missing = [...all.keys()].filter(k => !used.has(k)); if (missing.length) GROUPS.push(['Other', missing]);   // nothing is dropped
  const unknown = [...used].filter(k => !all.has(k)); if (unknown.length) throw new Error('rules board names settings the system no longer has: ' + unknown.join(', '));
  const DATE = s => `<span style="color:${C.grey};font-size:12.5px;white-space:nowrap">${s.replace('-', '·')}</span>`;
  const item = ([name, setting, date, by, choices]) => setting === 'open'
    ? `<li style="margin:0 0 7px;break-inside:avoid"><b style="color:${C.deep}">${esc(name)}: open.</b> ${choices.map((c, i) => `(${i + 1}) ${esc(c)}`).join(' ')} ${DATE(date)}</li>`
    : `<li style="margin:0 0 7px;break-inside:avoid"><b style="color:${C.navy}">${esc(name)}.</b> ${esc(setting)} ${DATE(date)}${by === 'designer' ? ` <span style="font-size:12px;font-weight:700;color:${C.deep};white-space:nowrap">· designer's, yours to change</span>` : ''}</li>`;
  const groups = GROUPS.map(([g, names]) => `<div style="break-inside:avoid-column;margin:0 0 14px"><div style="font-size:13px;letter-spacing:.1em;font-weight:700;color:${C.grey};text-transform:uppercase;border-bottom:1px solid ${C.rule};padding-bottom:4px;margin-bottom:7px">${g}</div><ul style="margin:0;padding:0;list-style:none">${names.map(n => item(all.get(n))).join('')}</ul></div>`).join('');
  const open = [...all.values()].filter(it => it[1] === 'open');
  const openBox = `<div style="background:${C.ask};padding:12px 16px;border-radius:6px;margin:0 0 18px"><div style="font-weight:700;color:${C.deep};margin-bottom:6px;font-size:15px">Open decisions</div><ul style="margin:0;padding-left:18px;font-size:14.5px;line-height:1.4">${open.map(([n, , d, , ch]) => `<li><b>${esc(n)}:</b> ${ch.map((c, i) => `(${i + 1}) ${esc(c)}`).join(' ')} ${DATE(d)}</li>`).join('')}</ul></div>`;
  // the sizes, from SIZES
  const fr = v => { const T = [[1 / 3, '⅓'], [2 / 3, '⅔'], [4 / 3, '1⅓'], [5 / 3, '1⅔'], [1.25, '1¼'], [1.5, '1½']]; const m = T.find(([x]) => Math.abs(v - x) < 1e-6); return m ? m[1] : String(v); };
  const cols = [['Stroke', 'stroke'], ['Parts', 'part'], ['Thinnest part', 'min'], ['Gaps and cuts', 'gap'], ['Inner band', 'band'], ['Counter minimum', 'counter'], ['Protrusion', 'protrude']];
  const td = 'padding:4px 10px;border-bottom:1px solid ' + C.rule;
  const sizes = `<table style="border-collapse:collapse;font-size:14px;margin:0 0 6px"><tr><th style="${td};text-align:left">Size</th>${cols.map(c => `<th style="${td};text-align:left;font-weight:700">${c[0]}</th>`).join('')}</tr>${[12, 18, 24].map(s => `<tr><td style="${td};font-weight:700">${s}</td>${cols.map(c => `<td style="${td}">${fr(S.SIZES[s][c[1]])}${c[1] === 'counter' && S.SIZES[s].close ? ', smaller closes' : ''}</td>`).join('')}</tr>`).join('')}</table><div style="font-size:13px;color:${C.grey};margin-bottom:16px">px at that size. Ring: 1⅓ at 24, 1⅔ at 32.</div>`;
  const decls = S.ORDER.map(id => `<li style="margin:0 0 7px;break-inside:avoid"><b style="color:${C.navy}">${esc(LABEL[id])}</b> <span style="color:${C.grey}">(${esc(S.DECL[id].cls)})</span>: <span style="font-family:ui-monospace,Menlo,monospace;font-size:12.5px">${esc(S.words(S.DECL[id]))}</span></li>`).join('');
  const W = 1600;
  const body = `${openBox}
<div style="column-count:3;column-gap:34px;font-size:14px;line-height:1.38">${groups}</div>
<div style="display:grid;grid-template-columns:auto 1fr;gap:34px;margin-top:16px;padding-top:14px;border-top:1px solid ${C.rule};align-items:start">
<div><div style="font-size:13px;letter-spacing:.1em;font-weight:700;color:${C.grey};text-transform:uppercase;margin-bottom:6px">The sizes</div>${sizes}</div>
<div><div style="font-size:13px;letter-spacing:.1em;font-weight:700;color:${C.grey};text-transform:uppercase;margin-bottom:6px">Each icon's declaration (its only input)</div><ul style="margin:0;padding:0;list-style:none;font-size:14px;line-height:1.38">${decls}</ul></div></div>`;
  return { W, html: shell(W, 'Icon system', 'Rules', 'Every decision point, its current setting and the date it was set. A change to any icon is a change here first.', body) };
}

function dc(title, body, w, h) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${title}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
${FONT}
<style>
body{margin:0}
</style>
</helmet>
${body}
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":${w},"height":${h}}}'>
class Component extends DCLogic {
renderVals() { return {}; }
}
</script>
</body>
</html>
`;
}
module.exports = { iconsBoard, gridBoard, rulesBoard, W_ICONS };
if (require.main === module) {
  const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
  const check = J(path.join(S.OUT, 'check.json')), R = rulesBoard();
  const boards = { Icons: ['Icons', iconsBoard(check), W_ICONS], IconsGrid: ['Icons on the grid', gridBoard(), W_ICONS], SystemRules: ['Rules', R.html, R.W] };
  for (const [k, [t, body, w]] of Object.entries(boards)) {
    fs.writeFileSync(path.join(out, `${k}.html`), `<!doctype html><html><head><meta charset="utf-8">${FONT}</head><body style="margin:0">${body}</body></html>`);
    const h = process.env[`BOARD_H_${k.toUpperCase()}`];
    if (h) fs.writeFileSync(path.join(out, `Grid7${k}.dc.html`), dc(t, body, w, +h));
    console.log(k, 'width', w);
  }
}
