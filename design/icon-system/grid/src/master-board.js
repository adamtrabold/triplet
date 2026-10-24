// g7ba THE MASTER GRID, rebuilt from the live system (director, turn 156, gap 7: "The master grid is stale on the outline
// numbers. Update or retire it"). boards7's sheetMaster drew from the g7 rows of its day (the outline at 1 2/3px with holes
// >= 4px, the museum Wide, corners by the joint law alone, counters as offsets); this draws everything from what is current:
// src/proportions.js (PROP), svg/g7/construction.json (the six as the engine builds them), svg/blind/blind.json (the person,
// the outline mark re-run under the outline cut), and the spec's own pieces (proportions-board.js joinsFig, roundsTable).
//   TOOLS=<dir with node_modules/paper> node master-board.js [out.html]   -> the board body (an HTML fragment) or a preview page
'use strict';
const fs = require('fs'), path = require('path');
const paper = require(path.join(process.env.TOOLS, 'node_modules/paper/dist/paper-core.js'));
if (!paper.project) paper.setup(new paper.Size(100, 100));
const E = require('./engine.js');
const { PROP, LINE, capOver } = require('./proportions.js');
const { joinsFig, roundsTable } = require('./proportions-board.js');
const COL = { paper: '#F2EBDD', raised: '#FAF5EA', hair: '#D8CEBA', ink: '#1A1A18', ink2: '#5A564C', navy: '#12293F', or: '#EE7434', ord: '#A8400C' };
const N = COL.navy, O = COL.or, OD = COL.ord, H = COL.hair, I2 = COL.ink2;
const f2 = v => +(+v).toFixed(2), f3 = v => +(+v).toFixed(3);
const J = JSON.parse(fs.readFileSync(path.join(__dirname, '../svg/g7/construction.json'), 'utf8'));
const BJ = path.join(__dirname, '../svg/blind/blind.json'), B = fs.existsSync(BJ) ? JSON.parse(fs.readFileSync(BJ, 'utf8')) : {};
const T3 = v => Math.round(v * 3) / 3, FK = 11 / 12;
const KEY = { SQUARE: [T3(Math.sqrt(Math.PI * 36)), T3(Math.sqrt(Math.PI * 36))], WIDE: [12, T3(Math.PI * 3)], TALL: [T3(Math.PI * 3), 12] };
const OM = PROP.outline.square / (KEY.SQUARE[0] * FK), OCUT = Object.fromEntries(Object.entries(KEY).map(([k, v]) => [k, v.map(x => x * FK * OM)]));
const FR = [[1 / 6, '1/6'], [1 / 5, '1/5'], [1 / 4, '1/4'], [1 / 3, '1/3'], [2 / 5, '2/5'], [1 / 2, '1/2'], [3 / 5, '3/5'], [2 / 3, '2/3'], [3 / 4, '3/4'], [4 / 5, '4/5'], [5 / 6, '5/6']];
const fr = v => { const w = Math.floor(v + 1e-9), t = v - w; if (t < 1e-6) return `${w}`; const q = FR.find(([x]) => Math.abs(x - t) < 1e-6); return q ? (w ? `${w} ${q[1]}` : q[1]) : v.toFixed(2); };
const lab = (x, y, t, o = {}) => `<text x="${f2(x)}" y="${f2(y)}" font-family="Archivo, Arial, sans-serif" font-size="${o.fs || 0.55}" font-weight="${o.fw || 700}" fill="${o.fill || I2}" text-anchor="${o.a || 'start'}">${t}</text>`;
const title = t => `<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${I2};text-transform:uppercase;margin:40px 0 14px">${t}</div>`;
const note = t => `<p style="margin:10px 0 0;font-size:16px;line-height:1.45;color:${COL.ink};max-width:1400px">${t}</p>`;
const card = (fig, name, a, b) => `<div style="display:flex;flex-direction:column;align-items:center">${fig}<div style="font-size:18px;font-weight:700;color:${N};margin-top:8px">${name}</div>${a ? `<div style="font-size:14px;color:${I2};text-align:center">${a}</div>` : ''}${b ? `<div style="font-size:14px;color:${I2};text-align:center;font-style:italic">${b}</div>` : ''}</div>`;

function body() {
  // 1. the badge: ring, air, live circle, the coin and its 12px box, guides, the 1px grid and the 1/3px lattice
  const S = 30; let g = `<rect x="0" y="0" width="24" height="24" fill="${COL.raised}"/>`;
  for (let i = 1; i < 72; i++) if (i % 3) g += `<line x1="${f2(i / 3)}" y1="0" x2="${f2(i / 3)}" y2="24" stroke="${H}" stroke-width="0.01" opacity=".6"/><line x1="0" y1="${f2(i / 3)}" x2="24" y2="${f2(i / 3)}" stroke="${H}" stroke-width="0.01" opacity=".6"/>`;
  for (let i = 1; i < 24; i++) g += `<line x1="${i}" y1="0" x2="${i}" y2="24" stroke="${H}" stroke-width="0.03"/><line x1="0" y1="${i}" x2="24" y2="${i}" stroke="${H}" stroke-width="0.03"/>`;
  g += `<circle cx="12" cy="12" r="11.25" fill="none" stroke="${N}" stroke-width="1.5"/><circle cx="12" cy="12" r="10.5" fill="none" stroke="${O}" stroke-width="0.04" stroke-dasharray="0.25 0.2"/><circle cx="12" cy="12" r="8" fill="none" stroke="${N}" stroke-width="0.05" stroke-dasharray="0.4 0.25"/><circle cx="12" cy="12" r="6" fill="none" stroke="${O}" stroke-width="0.07"/><rect x="6" y="6" width="12" height="12" fill="none" stroke="${N}" stroke-width="0.05"/>`;
  g += `<line x1="6" y1="12" x2="18" y2="12" stroke="${O}" stroke-width="0.03"/><line x1="12" y1="6" x2="12" y2="18" stroke="${O}" stroke-width="0.03"/>`;
  g += lab(12, 3.15, '2PX OF AIR', { a: 'middle', fs: 0.42 }) + lab(12, 5.25, 'LIVE CIRCLE Ø16', { a: 'middle', fs: 0.42 }) + lab(12, 7.05, 'THE COIN Ø12 · THE BOX 12', { a: 'middle', fs: 0.42, fill: O });
  const badge = `<svg width="${24 * S}" height="${24 * S}" viewBox="0 0 24 24" role="img" aria-label="The badge: ring, air, live circle, the coin">${g}</svg>`;
  // 2. the classes: every cut has the coin's area; the outline cut is the same three scaled to the star
  const C8 = 10, ok = `fill="${O}" fill-opacity=".14" stroke="${O}" stroke-width="0.12"`;
  const cutFig = (w, h, d, vb = [4, 4, 16, 16], coin = 6) => `<svg width="${vb[2] * C8}" height="${vb[3] * C8}" viewBox="${vb.join(' ')}" aria-hidden="true"><rect x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}" fill="${COL.raised}"/><circle cx="12" cy="12" r="${coin}" fill="none" stroke="${H}" stroke-width="0.12"/><rect x="${f2(12 - w / 2)}" y="${f2(12 - h / 2)}" width="${f2(w)}" height="${f2(h)}" ${ok}/>${d ? `<path d="${d}" fill="${N}"/>` : ''}</svg>`;
  const at = id => J[id].d;
  const sc = (d, k) => { const p = new paper.CompoundPath(d); p.scale(k, new paper.Point(12, 12)); const s_ = p.pathData; p.remove(); return s_; };
  const classes = [
    card(cutFig(KEY.WIDE[0] * FK, KEY.WIDE[1] * FK, at('cafe')), 'Wide', `${f2(KEY.WIDE[0] * FK)} × ${f2(KEY.WIDE[1] * FK)}px`, 'the cup'),
    card(cutFig(KEY.SQUARE[0] * FK, KEY.SQUARE[1] * FK, at('bar')), 'Square', `${f2(KEY.SQUARE[0] * FK)}px`, 'the coupe, the museum'),
    card(cutFig(KEY.TALL[0] * FK, (KEY.TALL[1] + 0.5) * FK, at('nature')), 'Tall', `${f2(KEY.TALL[0] * FK)} × ${f2(KEY.TALL[1] * FK)}px · apex +1/2`, 'the tree'),
    card(cutFig(OCUT.SQUARE[0], OCUT.SQUARE[1], sc(J.star.d, 20 / 24), [2, 2, 20, 20], 6 * OM), 'Outline', `Square ${f2(OCUT.SQUARE[0])}px on screen · counters ≥ ${PROP.outline.counterMin} lines`, 'the star, the person'),
    card(`<svg width="${16 * C8}" height="${16 * C8}" viewBox="4 4 16 16" aria-hidden="true"><rect x="4" y="4" width="16" height="16" fill="${COL.raised}"/><circle cx="12" cy="12" r="6" fill="none" stroke="${H}" stroke-width="0.12"/><rect x="${12 - LINE / 2}" y="6" width="${LINE}" height="12" ${ok}/><rect x="6" y="${12 - LINE / 2}" width="12" height="${LINE}" ${ok}/></svg>`, 'Open', 'arms span the coin · line 1 2/3px', 'the +'),
  ].join('');
  // 3. fitting: each icon in its cut, measured from the engine's own record
  const fitCard = (id, nm) => { const g_ = J[id], b = g_.mFin.box, [cw, ch] = g_.cut; return card(cutFig(cw, ch, g_.d), nm, `${f2(b.x1 - b.x0)} × ${f2(b.y1 - b.y0)}px in a ${f2(cw)} × ${f2(ch)} cut`, `${g_.cls.toLowerCase()}`); };
  // the outline marks at their slots, on screen: the star at 20px (its 24 box × 20/24), the person at 24px
  const oFig = (d, k, nm, a) => { const p = new paper.CompoundPath(sc(d, k)), b = p.bounds; p.remove(); return card(cutFig(OCUT.SQUARE[0], OCUT.SQUARE[1], sc(d, k), [2, 2, 20, 20], 6 * OM), nm, `${f2(b.width)} × ${f2(b.height)}px on screen`, a); };
  const fits = [fitCard('cafe', 'Cup'), fitCard('bar', 'Coupe'), fitCard('museum', 'Museum'), fitCard('nature', 'Tree'), oFig(J.star.d, 20 / 24, 'Star', 'outline, at its 20px slot'), B.person2 ? oFig(B.person2.d, 1, 'Person (re-run)', 'outline, at its 24px slot') : ''].join('');
  // 4. the blocks: roots drawn generic, at 10x, with their measures
  const R10 = 10, root = (prims, vb, nm, a, b) => card(`<svg width="${vb[2] * R10}" height="${vb[3] * R10}" viewBox="${vb.join(' ')}" aria-hidden="true"><path d="${E.build(prims).d}" fill="${N}"/></svg>`, nm, a, b);
  const post = PROP.line.post * LINE, ell = (cx, cy, rx, ry) => E.D(`M${cx + rx} ${cy}A${rx} ${ry} 0 1 0 ${cx - rx} ${cy}A${rx} ${ry} 0 1 0 ${cx + rx} ${cy}Z`);
  const k4 = 0.5523, ellC = (cx, cy, rx, ry) => E.D(`M${cx + rx} ${cy}C${cx + rx} ${cy + ry * k4} ${cx + rx * k4} ${cy + ry} ${cx} ${cy + ry}C${cx - rx * k4} ${cy + ry} ${cx - rx} ${cy + ry * k4} ${cx - rx} ${cy}C${cx - rx} ${cy - ry * k4} ${cx - rx * k4} ${cy - ry} ${cx} ${cy - ry}C${cx + rx * k4} ${cy - ry} ${cx + rx} ${cy - ry * k4} ${cx + rx} ${cy}Z`);
  const co = capOver(), capW = 8, capH = LINE, capD = E.I(ellC(4, capH, capW / 2 * co, capH), E.R(0, -1, capW, capH + 1));
  const blocks = [
    root([E.R(0, 0, 9, LINE)], [-0.5, -0.5, 10, LINE + 1], 'Slab', '1 line (1 1/2px), never scaled', 'carries or caps: beam, plinth, saucer, foot'),
    root([E.R(0, 0, 9, 3)], [-0.5, -0.5, 10, 4], 'Mass', `a ratio of the widest root, ≥ ${PROP.block.massMin} lines`, 'is the thing: cup body, mattress'),
    root([E.R(0, 0, post, 7)], [-0.5, -0.5, post + 1, 8], 'Post', `${fr(PROP.line.post)} line (${post}px)`, 'stem, column, trunk, leg'),
    root([E.P([4, 0], [8, 3.5], [0, 3.5])], [-0.5, -0.5, 9, 4.5], 'Gable', 'flat base', 'roof, tier'),
    root([ellC(4, 3.2, 4, 3.2)], [-0.5, -0.5, 9, 7.4], 'Vessel ellipse', `${fr(PROP.ellipse.vessel)} as tall as wide`, 'bowl, cup bottom'),
    root([capD], [-0.5, -0.5, 9, capH + 1], 'Cap', `a slab cut by one ellipse, ends at ${fr(PROP.cap.end)} its height (${co.toFixed(3)} × wide)`, 'foot, saucer, a resting cushion'),
    root([ellC(3, 2, 3, 2)], [-0.5, -0.5, 7, 5], 'Whole ellipse', `at least ${fr(PROP.ellipseWhole.min)} as tall as wide`, 'flatter: a cap'),
  ].join('');
  const grid = (html, n) => `<div style="display:grid;grid-template-columns:repeat(${n},auto);justify-content:start;gap:28px;align-items:end">${html}</div>`;
  return `<div style="font-size:15px;letter-spacing:.12em;font-weight:700;color:${OD};text-transform:uppercase">Icon grid · the master</div>
<h1 style="margin:6px 0 10px;font-size:38px;line-height:1.1;color:${N}">The master grid</h1>
<p style="margin:0 0 6px;font-size:19px;line-height:1.45;max-width:1400px">Everything a new icon is drawn from, in one place, drawn from the code the icons are built from (<code>src/proportions.js</code>, the engine's own record of the six), so it changes when a rule does. px are pixels at the 24px badge. The full spec, with every rule and the steps, is at the top of Construction, beside this board.</p>
${title('The badge, the coin, the lattice')}
<div style="display:flex;gap:36px;align-items:flex-start">${badge}<div style="max-width:560px">${note('The badge is the seal; the glyph is struck inside it like a coin. Ring 1 1/2px · 2px of air · live circle Ø16 · the coin Ø12 in the 12px box. Grid: 1px. Faint: the <b>1/3px lattice</b>. The lattice places a part\'s first edge. A thickness that is a part (a line, post, slab) is exact and its far edge may sit off the lattice; a space or a shown length (a cut, a gap, how much of a post shows) is a minimum, and the next part starts on the first lattice line at least that far away.')}</div></div>
${title('The classes: every cut has the coin\'s area')}
${grid(classes, 5)}
${note(`Shaped icons take the cut nearest their own width to height, read at the fitted size, × 11/12; a lone apex passes by a step (1/2px). <b>Outline marks</b> are sized by their outside, never a counter, to the <b>outline cut</b>: the same three cuts scaled so Square is the star's width on screen (${PROP.outline.square}px; Wide ${f2(OCUT.WIDE[0])} × ${f2(OCUT.WIDE[1])}). Each closed counter is checked at ${PROP.outline.counterMin} lines (${PROP.outline.counterMin * LINE}px) across or more. The + is open: its arms span the coin.`)}
${title('Fitting: the whole drawing meets its cut')}
${grid(fits, 6)}
${note('Positions scale, thicknesses never do, until the finished outline meets the cut in width or height (solved, to 1/1000 of a unit). Measured on the finished glyphs as the engine builds them; the outline marks on screen at their slots.')}
${title('The blocks: like parts, one shape')}
${grid(blocks, 7)}
${note('A horizontal block that carries or caps something is a <b>slab</b>, one line; a block that is the thing itself is a <b>mass</b>, a shape. Test: if it still names the thing drawn one line thick, it\'s a slab. Every curved edge is part of one root: a vessel\'s ellipse, a cap\'s, a circle. A counter is a root too: the same shape made smaller, the space a spacing leaves, or a root moved.')}
${title('The joins: what makes it ours, by kind')}
${joinsFig(true)}
${title('The rounds: one table, the engine\'s')}
${roundsTable()}
${note('The engine\'s law in px on screen, never chosen per icon; <code>src/rounds-check.js</code> checks the engine against this table, corner by corner. Shaped marks flare where a post holds a mass; line marks have no masses, so no flares and lighter mass corners. Inside corners are tighter than outside ones; no ink traps.')}
${title('The line')}
${note('Monoweight: one line, 1 1/2px, the ring\'s weight, everywhere, horizontals and verticals alike. Posts are 5/6 of it (1 1/4px), the resting cut 2/3 (1px), a step 1/3 (1/2px), a clear band 1/2 (3/4px). Outline marks keep the line; the open mark (the +) carries 10/9 of it, 1 2/3px, set by darkness.')}
${title('Stacked')}
${note(`A thing of tiers takes the tree as its template: tiers showing ${PROP.tree.heights.join(' : ')} of the height, tip to base; half widths ${PROP.tree.widths.join(' : ')} (the bottom one the class's); each notch ${fr(PROP.tree.notch)} of the half width of the tier above; living things droop 1/2 line and sweep in 1/5 line, buildings stay straight; the trunk shows one line. These are his chosen rhythm, off the series on purpose.`)}`;
}
module.exports = { body };
if (require.main === module) {
  const out = process.argv[2] || 'master-preview.html';
  fs.writeFileSync(out, `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&display=swap"></head><body style="margin:0;background:${COL.raised};font-family:Archivo,Arial,sans-serif;color:${COL.ink}"><div style="width:1600px;box-sizing:border-box;padding:48px 56px 56px">${body()}</div></body></html>`);
  console.log('ok', out);
}
