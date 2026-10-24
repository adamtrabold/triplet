// g7az THE PROPORTIONS, on the boards (owner, 10-24: "Yeah let's try for a ten also it's be best if the underlying shapes were
// proportionally related to each other and the grid so they weren't just random."). Two pieces, both read from src/proportions.js
// (the one table), svg/g7/construction.json (the row as the engine builds it) and the row's svgs:
//   section(kick, quote)  Between, section 0: the system, the values set by eye and what they follow from now, v237 beside now
//   spec()                Construction, the top section: THE SPEC a designer who has seen nothing else draws a new icon from
//                         (the series drawn as rulers, every rule in one list, the table, the steps, each icon's proportions)
//   node proportions-board.js <out.html>   writes both, standalone, for a look
'use strict';
const fs = require('fs'), path = require('path');
const paper = require(path.join(process.env.TOOLS || '/tmp/claude-0/-home-user-la-trip-map/04f8fb34-0476-5960-add5-8bd3d6d8820e/scratchpad/tools', 'node_modules/paper/dist/paper-core.js'));
if (!paper.project) paper.setup(new paper.Size(100, 100));
const { SERIES, LINE, PROP, capOver } = require('./proportions.js');
const FC = require('./fair-check.js');
const COL = { paper: '#F2EBDD', raised: '#FAF5EA', hair: '#D8CEBA', ink: '#1A1A18', ink2: '#5A564C', navy: '#12293F', or: '#EE7434', ord: '#A8400C' };
const N = COL.navy, I2 = COL.ink2, OR = COL.or, OD = COL.ord;
const f = v => +(+v).toFixed(3), f2 = v => (+v).toFixed(2);
const G7 = path.join(__dirname, '../svg/g7');
const svgD = rel => fs.readFileSync(path.join(G7, rel), 'utf8').match(/ d="([^"]+)"/)[1];
const IDS = ['cafe', 'bar', 'museum', 'nature', 'star', 'plus'];
const NAME = { cafe: 'cup', bar: 'coupe', museum: 'museum', nature: 'tree', star: 'star', plus: '+' };
const BEFORE = { cafe: 'before-g7az/cafe-r2.svg', bar: 'before-g7az/bar-r2b.svg', museum: 'before-g7az/museum-r2.svg', nature: 'before-g7az/nature-r2.svg', star: 'before-g7az/star-r2.svg', plus: 'before-g7az/plus-r2.svg' };
const NOW = Object.fromEntries(IDS.map(id => [id, `between/${id}-r3.svg`]));
// a fraction as words ("1 4/5", "2/3")
const FR = [[1 / 6, '1/6'], [1 / 5, '1/5'], [1 / 4, '1/4'], [1 / 3, '1/3'], [2 / 5, '2/5'], [1 / 2, '1/2'], [3 / 5, '3/5'], [2 / 3, '2/3'], [3 / 4, '3/4'], [4 / 5, '4/5'], [5 / 6, '5/6']];
const fr = v => { const s = v < 0 ? '−' : '', a = Math.abs(v), w = Math.floor(a + 1e-9), t = a - w; if (t < 1e-6) return s + w; const q = FR.find(([x]) => Math.abs(x - t) < 1e-6); return q ? s + (w ? `${w} ${q[1]}` : q[1]) : s + a.toFixed(2); };
const px = k => +(k * LINE).toFixed(3);
// how far two outlines are apart (both ways), in px at the 24 badge
function gap(dA, dB) {
  if (dA === dB) return 0;
  const A = new paper.CompoundPath(dA), B = new paper.CompoundPath(dB); let mx = 0;
  const samp = it => { const pts = []; for (const c of (it.children.length ? it.children : [it])) for (let s = 0; s < c.length; s += 0.01) pts.push(c.getPointAt(s)); return pts; };
  for (const [P, Q] of [[A, B], [B, A]]) for (const p of samp(P)) mx = Math.max(mx, Q.getNearestPoint(p).getDistance(p));
  A.remove(); B.remove(); return mx;
}
const box = d => { const p = new paper.CompoundPath(d), b = p.bounds; p.remove(); return { x0: b.x, y0: b.y, x1: b.x + b.width, y1: b.y + b.height, w: b.width, h: b.height }; };
const ring = `<circle cx="12" cy="12" r="11.25" fill="${COL.paper}" stroke="${N}" stroke-width="1.5"/>`;
const badge = (d, s = 24) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true">${ring}<path d="${d}" fill="${N}"/></svg>`;
const ui = (d, s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true"><path d="${d}" fill="${N}"/></svg>`;
const big = d => `<svg width="72" height="72" viewBox="0 0 24 24" aria-hidden="true"><path d="${d}" fill="${N}"/></svg>`;
const phP = s => `<p style="margin:0 0 12px;font-size:19px;line-height:1.45">${s}</p>`;
const phQ = q => `<div style="margin:0 0 24px;padding:18px 20px;background:${COL.paper};border-top:4px solid ${OR};font-size:24px;line-height:1.3;color:${N};font-weight:600">${q}</div>`;
const crop = (d, x, y, w, h, hpx) => `<svg width="${Math.round(hpx * w / h)}" height="${hpx}" viewBox="${f2(x)} ${f2(y)} ${w} ${h}" style="background:${COL.paper};flex:none;display:block" aria-hidden="true"><path d="${d}" fill="${N}"/></svg>`;
const cap = (t, strong) => `<div style="font-size:13px;color:${strong ? N : I2};${strong ? 'font-weight:700;' : ''}margin-top:4px">${t}</div>`;
const row = (D, label, strong) => `<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:6px 0"><span style="width:52px;font-size:14px;color:${strong ? N : I2};${strong ? 'font-weight:700' : ''}">${label}</span>${['cafe', 'bar', 'museum', 'nature'].map(id => badge(D[id])).join('')}${ui(D.plus, 26.4)}${ui(D.star, 20)}<span style="width:6px"></span>${['cafe', 'bar', 'museum', 'nature'].map(id => big(D[id])).join('')}</div>`;

// ---------------------------------------------------------------- Between, section 0
function section(kick, quote) {
  const B = Object.fromEntries(IDS.map(id => [id, svgD(BEFORE[id])])), A = Object.fromEntries(IDS.map(id => [id, svgD(NOW[id])]));
  const mv = Object.fromEntries(IDS.map(id => [id, gap(B[id], A[id])])), same = id => B[id] === A[id];
  const mvs = id => same(id) ? 'byte for byte the same' : `moves ${f2(mv[id])}px at most in the 24px badge (${f2(3 * mv[id])} at 72)`;
  const faults = IDS.reduce((n, id) => n + FC.check(A[id]).length, 0);
  const pairCrop = (id, at, h, label) => `<div style="padding:12px 0;border-top:1px solid ${COL.hair}"><div style="font-size:19px;font-weight:700;color:${N};margin-bottom:8px">${label}</div><div style="display:flex;gap:12px;align-items:flex-end;flex-wrap:wrap"><div>${crop(B[id], ...at(B[id]), h)}${cap('v237')}</div><div>${crop(A[id], ...at(A[id]), h)}${cap('now', true)}</div></div></div>`;
  const tb = (rows, w1 = 30) => `<table style="width:100%;border-collapse:collapse;font-size:16px;line-height:1.38;margin:4px 0 14px">${rows.map(([a, b, c]) => `<tr style="border-top:1px solid ${COL.hair};vertical-align:top"><td style="padding:8px 8px 6px 0;width:${w1}%;font-weight:700;color:${N}">${a}</td><td style="padding:8px 8px 6px;color:${N}">${b}</td>${c != null ? `<td style="padding:8px 0 6px 8px;width:24%;color:${I2}">${c}</td>` : ''}</tr>`).join('')}</table>`;
  const tried = svgD('roots-tried/tree-234.svg');
  return `${kick('0 · Proportions: every root from a simple ratio of another')}
${quote("Yeah let's try for a ten also it's be best if the underlying shapes were proportionally related to each other and the grid so they weren't just random.")}
${phP('<b>The system, in three lines.</b> (1) <b>One series:</b> every proportion is a simple fraction in halves, thirds, quarters, fifths or sixths, the twelve marks of a ruler folded 2 to 6 ways, or a whole number and one of them (1 4/5, 2 1/2). (2) <b>Each ratio names its parent.</b> A shape is a fraction of another root: the icon\'s widest root is 1, because the class fit makes it the cut. A thickness (a line, post, cut, gap, step, counter) is a fraction of the line, 1 1/2px, and never scales. (3) <b>Two rules of transition</b>, which hand one shape to the next and are not proportions: the flare\'s lean and the soft tip.')}
${phP('<b>Why this series.</b> I measured 38 root measures in the six. Within 2%, halves-to-sixths already held 19. A geometric series holds far fewer: the golden section 2, root 2 6, powers of 3/4 4. Most of the rest snapped once each ratio was taken to the right parent, for example the cup\'s ear to the cup\'s depth, not to the box. Precedent: proportions from small whole numbers, as in Alberti\'s and Palladio\'s harmonic ratios and Bringhurst\'s page proportions. Said plainly: a ruler with twelve marks proves nothing by itself. The proof is a new icon drawn blind from the Construction board.')}
<div style="padding:12px 0;border-top:1px solid ${COL.hair}"><div style="font-size:19px;font-weight:700;color:${N};margin-bottom:6px">The six at 24 and 72px</div>${row(B, 'v237')}${row(A, 'now', true)}</div>
${phP(`<b>How far each moved:</b> the cup ${mvs('cafe')}; the coupe ${mvs('bar')}; the museum ${mvs('museum')}; the tree, the star and the + are ${['nature', 'star', 'plus'].every(same) ? 'byte for byte the same' : 'changed'}. At true size I can't see any of it. At your zoom you can see it, below.`)}
<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${I2};text-transform:uppercase;margin:22px 0 6px">The values that were set by eye, and what they follow from now</div>
${tb([
    ['Foot and plate ellipse, 7/6 of the slab', `The slab's ends cut its ellipse at <b>half its height</b>. The ellipse is then 1.155 of the slab, against 7/6 (1.167), so the ends sit a hair lower. It is a ratio, 1/2, and it was the value already tried clean (1.15).`],
    ['Bowl ellipse 7/8 of the depth; cup ellipse 2/5 of the depth', `<b>One value for both:</b> every vessel's ellipse is <b>4/5 as tall as it is wide</b>. The cup's was already 0.79. The coupe's rim line cuts its ellipse <b>1/5 of the ellipse's height</b> above its centre, so the bowl is 6/5 of the ellipse deep. Before, two numbers did one job.`],
    ['The star\'s counter, 2 1/2 lines', 'Already on the series (5/2), and a thickness, so it stays a measure of the line.'],
    ['The flare\'s lean, 1 3/4', 'A rule of transition, not a proportion. It is how far the round runs along the curve against along the line. 1 1/2 leaves a shelf; at 2 the line\'s half collapses. The value stays.'],
    ['When a tip goes soft', 'A rule of transition. A tip whose round would be wider than 1/6px (1/9 of a line) is softened to one wide hill. In this set only the tree\'s top tip crosses it, so it is still calibrated on one tree.'],
    ['The clear band, 5/6px', `5/6px is 5/9 of a line, which is not on the series. It is now <b>half a line, 3/4px</b>: 1/12px thinner, so a touch more drink, the way you\'ve asked for it.`],
  ])}
<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${I2};text-transform:uppercase;margin:22px 0 6px">What else is now a ratio (and moved slightly)</div>
${tb([
    ['Cup', 'The saucer is <b>1 4/5</b> of the cup\'s width. The cup is <b>square</b>. The ear is <b>4/5</b> of the cup\'s depth, and its counter runs straight from the wall for <b>half a line</b> before turning. The cup sits <b>balanced</b> on its saucer, with its ink centre over the saucer\'s centre, as a cup at rest does (it was 0.07 units off).'],
    ['Coupe', 'The stem shows <b>1/2</b> the bowl\'s depth. The foot\'s ellipse is <b>4/5</b> as wide as the bowl\'s, so it is as wide as the bowl\'s ellipse is tall.'],
    ['Museum', 'The beam and plinth pass the outer columns by <b>1/3 of a post</b>. The roof rises <b>1/3</b> of its run. The columns stand <b>1/3</b> of the colonnade\'s width tall. The apex is 0.08px lower; the rest is the same at true size.'],
    ['Grid', 'Two fixes the proportions needed. (1) The class is read at the drawing\'s <b>fitted size</b>, because px parts don\'t scale, so at the 12 box a drawing reads squatter than it is shown. (2) The fit is <b>solved</b>: v237\'s cup stopped short of its cut on both sides, because a lattice step was in the way. It now meets its height. Coupe, museum and tree were already touching their cuts.'],
  ], 18)}
${pairCrop('cafe', d => { const b = box(d); return [b.x0 - 0.3, b.y0 - 0.3, b.w + 0.6, b.h + 0.6]; }, 210, 'The cup')}
${pairCrop('bar', d => { const b = box(d); return [b.x0 - 0.3, b.y0 - 0.3, b.w + 0.6, b.h + 0.6]; }, 210, 'The coupe')}
${pairCrop('museum', d => { const b = box(d); return [11.7, b.y0 - 0.3, b.x1 - 11.4, 6.4]; }, 230, 'The museum, right half: roof, beam and capital')}
<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${I2};text-transform:uppercase;margin:22px 0 6px">What won't snap, and why</div>
${tb([
    ['The tree\'s tiers', `Their shown heights (4.83 : 3 : 3.33) and half widths (2.8 : 4.1 : 5.3) are v123's rhythm, the tree you called perfect. The nearest series values change it visibly. Widths in equal steps (2 : 3 : 4) narrow the tip tier, and it reads as a spire (tried, right). Heights in the series move the middle tier 0.2px at 24. So they stay as measured, marked "won't snap". The rest of the tree is on the series: notch 3/5, droop 1/2 line, sweep 1/5 line, trunk a post.`],
    ['The star\'s points', 'Inner radius 0.47 of the outer: a shape choice. 1/2 would fatten the points.'],
    ['The line marks\' line, 1 2/3px', '10/9 of a line, set by darkness (a weight rule), not by proportion. "The + might feel light" is still open.'],
  ], 22)}
<div style="display:flex;gap:16px;align-items:flex-end;margin:0 0 14px"><div>${crop(B.nature, 8.2, 5.8, 7.6, 12.4, 200)}${cap('the tree, kept')}</div><div>${crop(tried, 8.2, 5.8, 7.6, 12.4, 200)}${cap('tried: tiers 2 : 3 : 4')}</div></div>
${phP(`<b>Checks:</b> the fair check (knee, tail, jump, inflect, shelf, shoulder, kink) on the six: ${faults ? `${faults} faults` : 'clean'}. Construction rebuilds the row byte for byte. The tree, star and + did not move.`)}
${phQ('Do the cup, the coupe and the museum still read as yours? And is the band at half a line (1/12px thinner) right, or too thin?')}
${phP('The spec, with every rule, the table and the steps, is at the top of the Construction board. A new icon will be drawn from it blind.')}`;
}

// ---------------------------------------------------------------- Construction, the spec
function spec() {
  const J = JSON.parse(fs.readFileSync(path.join(G7, 'construction.json'), 'utf8'));
  const H = t => `<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${I2};text-transform:uppercase;margin:34px 0 12px">${t}</div>`;
  // ---- the series, drawn: one ruler for shapes (a parent root = 1), one for thicknesses (the line, at 40px a px)
  // rl: a ruler's ticks; with stagger, every other label (by position) sits a row higher, its note a row lower, so close marks don't collide
  const RW = 1500, rl = (x0, w, ticks, stagger) => ticks.slice().sort((p, q) => p[0] - q[0]).map(([v, t, sub, hi], k) => { const x = x0 + v * w, up = stagger && k % 2 ? 22 : 0; return `<line x1="${f(x)}" y1="${(hi ? 26 : 40) - up}" x2="${f(x)}" y2="${74 + up}" stroke="${hi ? OD : N}" stroke-width="${hi ? 2.5 : 1.5}"/><text x="${f(x)}" y="${20 - up + (stagger ? 22 : 0)}" font-family="Archivo,Arial,sans-serif" font-size="16" font-weight="700" fill="${hi ? OD : N}" text-anchor="middle">${t}</text>${sub ? `<text x="${f(x)}" y="${96 + up}" font-family="Archivo,Arial,sans-serif" font-size="13" fill="${I2}" text-anchor="middle">${sub}</text>` : ''}`; }).join('');
  const shapeTicks = [[0, '0'], ...SERIES.map(v => [v, fr(v), '', false])];
  const shapeRuler = `<svg width="${RW}" height="110" viewBox="0 0 ${RW} 110" role="img" aria-label="The series, for shapes: halves to sixths of a parent root" style="display:block"><rect x="40" y="56" width="${RW - 80}" height="18" fill="${N}" fill-opacity=".14"/><line x1="40" y1="74" x2="${RW - 40}" y2="74" stroke="${N}" stroke-width="1.5"/>${rl(40, RW - 80, shapeTicks)}</svg>`;
  const used = [[1 / 3, '1/3 (½px)', 'flare, drop, apex', true], [1 / 2, '1/2 (¾px)', 'band, slot, droop', true], [2 / 3, '2/3 (1px)', 'the cut', true], [4 / 5, '4/5 (1.2px)', 'gable ends', true], [5 / 6, '5/6 (1¼px)', 'a post', true], [1, '1 (1½px)', 'the line', true], [5 / 2, '2 1/2 (3¾px)', 'outline counter', true], [1 / 5, '1/5', 'sweep', true]];
  const LW = 1500, lx0 = 40, lw = (LW - 80) / 2.6;
  // the thickness marks as bars, each its length in px at 40px a pixel, one under the other (they sit too close for one ruler)
  const lineRuler = `<div style="display:grid;grid-template-columns:auto 1fr;gap:8px 18px;align-items:center;max-width:900px">${used.slice().sort((p, q) => p[0] - q[0]).map(([v, t, sub]) => `<svg width="${Math.round(v * LINE * 40) + 2}" height="16" aria-hidden="true" style="display:block"><rect x="0" y="0" width="${f(v * LINE * 40)}" height="16" fill="${v === 1 ? N : OD}"/></svg><div style="font-size:16px;color:${N}"><b>${t}</b> <span style="color:${I2}">${sub}</span></div>`).join('')}</div>`;
  // ---- every rule, one list
  const rules = [
    ['Roots.', 'Every piece is one root shape drawn whole: a circle, an ellipse, a rectangle (slab or post), a triangle (gable), a regular star, a straight line. Name each piece\'s root before drawing; an edge you can\'t name that way is the one to fix.'],
    ['Connect and cut.', 'Roots are joined into one outline, or cut apart: a counter, a 1px cut between parts that rest on each other (at most one per icon), a slab\'s end cutting an ellipse.'],
    ['A curved edge belongs to its root, ends included.', 'No end draws its own arc; rounds only where roots meet or are cut. An ellipse meets a straight edge parallel to its side at its widest point, tangent, never cut. A base with a curved side is a cap: a slab cut by one ellipse its full height, the slab\'s ends cutting it at half its height (on top under a stem, underneath under a thing that sits).'],
    ['A counter is a root.', 'The same shape on the same centre made smaller (circle in circle, star in star), the space a spacing leaves, or a root moved (the bowl\'s side moved in). An ellipse counter: the same ellipse less a wall on each axis. A counter that runs into a wall runs straight for half a line first.'],
    ['One series.', 'Every proportion is a fraction in halves, thirds, quarters, fifths or sixths, or a whole and one of them (the rulers above).'],
    ['Shapes are fractions of a root.', 'The widest root is 1 (the class fit makes it the cut). Every other root is a fraction of it or of the root it belongs to (the table).'],
    ['Thicknesses are fractions of the line.', 'The line is 1 1/2px and never scales; posts, cuts, gaps, steps and counters across are fractions of it (the second ruler). Outline marks keep the line; open marks (the +) draw 1 2/3px, set by darkness.'],
    ['Vessels.', 'A vessel\'s curved side is one ellipse, 4/5 as tall as it is wide.'],
    ['Placed by weight.', 'A part that rests on another sits with its ink centre over the other\'s centre (the cup on its saucer). A symmetric icon is drawn about its axis and mirrored.'],
    ['The class.', 'Wide, Square or Tall: whichever cut of the coin is nearest the drawing\'s own width to height, read at its fitted size; a lone apex passes the cut by a step (1/2px). Line marks: Outline (sized by its counter, 2 1/2 lines across) or Open (arms span 12).'],
    ['The fit.', 'Positions scale, thicknesses never do, until the finished outline meets the cut × 11/12 in width or height (solved, not stepped).'],
    ['Rounds, by kind.', 'The law: mass corners 0.6, wide outside 0.7, line ends 0.3, tips 0.35 or 0.0877 of the shorter edge, joins, notches and counters 0.15, wide inside 0.3, flares 1/2px (a step); never over 0.2 of the shorter edge. Every round is a smooth hill of bend, not an arc.'],
    ['Two rules of transition.', `At a flare into a gentle curve bending the other way, the round runs ${fr(PROP.transition.flareLean)} as far along the curve as along the line. A tip whose round would be wider than 1/6px goes soft (one wide hill).`],
    ['Centred by eye, by rule.', 'Across: half-way between its box centre and its ink centre, to 1/4px. Up and down: its box centre, pulled down by half of how far its ink sits above it.'],
    ['Checked.', 'The fair check clean (knee, tail, jump, inflect, shelf, shoulder, kink); looked at at 12, 24 and 72px and beside the other six.'],
  ].map(([a, b], i) => `<div style="display:flex;gap:14px;margin:0 0 10px"><span style="flex:none;width:28px;height:28px;border-radius:14px;background:${OR};color:${COL.raised};font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center">${i + 1}</span><span style="font-size:18px;line-height:1.45"><b style="color:${N}">${a}</b> ${b}</span></div>`).join('');
  // ---- the table
  const P_ = PROP, L_ = P_.line;
  const T = [
    ['Thickness', 'a post that holds a mass up', `${fr(L_.post)} line`, `${px(L_.post)}px`, 'stem, columns, trunk'],
    ['', 'the cut between resting parts', `${fr(L_.cut)} line`, `${px(L_.cut)}px`, 'cup on saucer, gable on beam'],
    ['', 'a clear gap between walls', `${fr(L_.band)} line`, `${px(L_.band)}px`, 'the coupe\'s band'],
    ['', 'a step: a flare, a slab end\'s drop, the apex past the cut', `${fr(L_.step)} line`, `${px(L_.step)}px`, 'coupe, museum, tree; museum and tree apex'],
    ['', 'a gable\'s upright ends', `${fr(L_.gableEnd)} line`, `${px(L_.gableEnd)}px`, 'museum'],
    ['', 'a counter running into a wall, straight first', `${fr(L_.slot)} line`, `${px(L_.slot)}px`, 'the cup\'s ear'],
    ['', 'an outline mark\'s counter, across', `${fr(L_.outlineCounter)} lines`, `${px(L_.outlineCounter)}px`, 'star'],
    ['', 'a tier\'s droop · its sweep', `${fr(L_.droop)} · ${fr(-L_.bow)} line`, '', 'tree'],
    ['Shape', 'every vessel\'s ellipse: height / width', fr(P_.ellipse.vessel), '', 'cup bottom, coupe bowl'],
    ['', 'a cap: where the slab\'s ends cut its ellipse', `${fr(P_.cap.end)} its height`, `ellipse ${capOver().toFixed(3)} × the slab`, 'cup saucer, coupe foot'],
    ['', 'cup: saucer / cup width · depth / width · ear / depth', `${fr(P_.cup.saucer)} · ${fr(P_.cup.depth)} · ${fr(P_.cup.ear)}`, '', 'cup (and balanced on the saucer)'],
    ['', 'coupe: rim above the ellipse\'s centre · stem / bowl depth · foot ellipse / bowl ellipse', `${fr(P_.coupe.rimCut)} of its height · ${fr(P_.coupe.stem)} · ${fr(P_.coupe.foot)}`, '', 'coupe'],
    ['', 'museum: overhang · roof rise / run · columns / colonnade', `${fr(P_.museum.over)} post · ${fr(P_.museum.pitch)} · ${fr(P_.museum.columns)}`, `${px(P_.museum.over * L_.post)}px overhang`, 'museum'],
    ['', 'tree: a notch / the tier above\'s half width', fr(P_.tree.notch), '', 'tree'],
    ['Won\'t snap', 'tree: tier heights · half widths (tip to bottom)', `${P_.tree.heights.join(' : ')} · ${P_.tree.widths.join(' : ')}`, '', 'v123\'s rhythm; 2 : 3 : 4 tried (a spire)'],
    ['', 'star: inner / outer radius', `${P_.star.ri}`, '', 'a shape choice'],
    ['Transition', 'flare lean · soft tip', `${fr(P_.transition.flareLean)} · round over 1/6px`, '', 'engine.js'],
  ];
  const table = `<table style="width:100%;border-collapse:collapse;font-size:16px;line-height:1.35"><tr style="color:${I2};font-size:13px;letter-spacing:.06em;text-transform:uppercase"><td style="padding:4px 8px 6px 0;width:9%">Kind</td><td style="padding:4px 8px 6px;width:38%">What</td><td style="padding:4px 8px 6px;width:19%">Ratio</td><td style="padding:4px 8px 6px;width:14%">At 24</td><td style="padding:4px 0 6px 8px">Where</td></tr>${T.map(([a, b, c, d, e]) => `<tr style="border-top:1px solid ${a ? COL.hair : '#EEE6D6'};vertical-align:top"><td style="padding:7px 8px 5px 0;font-weight:700;color:${N}">${a}</td><td style="padding:7px 8px 5px">${b}</td><td style="padding:7px 8px 5px;font-weight:700;color:${OD}">${c}</td><td style="padding:7px 8px 5px;color:${I2}">${d}</td><td style="padding:7px 0 5px 8px;color:${I2}">${e}</td></tr>`).join('')}</table>`;
  // ---- the steps
  const step = (n, t, b) => `<div style="padding:14px 16px;background:${COL.paper};border-top:4px solid ${OR}"><div style="font-size:13px;letter-spacing:.1em;font-weight:700;color:${OD};text-transform:uppercase">Step ${n}</div><div style="font-size:19px;font-weight:700;color:${N};margin:2px 0 6px">${t}</div><div style="font-size:15px;line-height:1.4;color:${COL.ink}">${b}</div></div>`;
  const steps = `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px">
${step(1, 'Name the roots', 'List each piece and its root shape (rule 1). Pick the widest root: it is 1.')}
${step(2, 'Give every root a ratio', 'Each root\'s size and place as a fraction of its parent from the series; each thickness as a fraction of the line (the table: reuse a value where the job is the same, e.g. any post is 5/6 line, any vessel 4/5). Write the ratios down before drawing.')}
${step(3, 'Draw it in the 12 box', 'Widest root across the box; the rest from their ratios; horizontal edges on the 1/3px lattice; caps, vessels and counters by rules 3, 4 and 8.')}
${step(4, 'Let the engine finish it', 'It joins and cuts, picks the class at the fitted size, fits to the cut, rounds every corner by its kind, mirrors, and centres it by rule.')}
${step(5, 'Check it', 'The fair check clean; at 12, 24 and 72px; in a row beside the six.')}
${step(6, 'If something won\'t snap', 'Show the nearest series value and the cost beside your value, and mark it "won\'t snap", as the tree\'s tiers are.')}
${step(7, 'Put new values in the table', 'A new job gets a new line in src/proportions.js (the code reads it; nothing else holds a value).')}
${step(8, 'Show it', 'On the board, at true size first.')}
</div>`;
  // ---- each icon's proportions, on its construction (the engine's own record, svg/g7/construction.json)
  const dia = (id, vb, marks, notes) => {
    const G = J[id], P = 320, u = v => v * vb[2] / P;
    let s = `<rect x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}" fill="${COL.raised}"/>`;
    for (let q = Math.ceil(vb[0]); q <= vb[0] + vb[2]; q++) s += `<line x1="${q}" y1="${vb[1]}" x2="${q}" y2="${vb[1] + vb[3]}" stroke="${COL.hair}" stroke-width="${f(u(1))}"/>`;
    for (let q = Math.ceil(vb[1]); q <= vb[1] + vb[3]; q++) s += `<line x1="${vb[0]}" y1="${q}" x2="${vb[0] + vb[2]}" y2="${q}" stroke="${COL.hair}" stroke-width="${f(u(1))}"/>`;
    const dy = G.dy || 0;
    s += `<path d="${G.d}" fill="${N}" fill-opacity=".14"/>`;
    (G.parts || []).forEach((d, i) => { const p = G.prims[i] || {}; s += `<path d="${d}" transform="translate(0 ${f(dy)})" fill="none" stroke="${OR}" stroke-width="${f(u(1.6))}"${p.cut ? ` stroke-dasharray="${f(u(5))} ${f(u(3))}"` : ''}/>`; if (p.cap) s += `<ellipse cx="${f(p.cap.cx)}" cy="${f(p.cap.cy)}" rx="${f(p.cap.rx)}" ry="${f(p.cap.ry)}" fill="none" stroke="${OD}" stroke-width="${f(u(1.2))}" stroke-dasharray="${f(u(6))} ${f(u(3))}"/>`; });
    s += marks(G, u).join('');
    return `<div style="width:${P}px"><svg width="${P}" height="${Math.round(P * vb[3] / vb[2])}" viewBox="${vb.join(' ')}" role="img" aria-label="The ${NAME[id]}'s proportions" style="display:block">${s}</svg><div style="font-size:18px;font-weight:700;color:${N};margin:8px 0 4px">The ${NAME[id]}</div><ol style="margin:0;padding-left:20px;font-size:15px;line-height:1.4;color:${COL.ink}">${notes.map(t => `<li>${t}</li>`).join('')}</ol></div>`;
  };
  const mk = (x, y, n, u) => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(u(11))}" fill="${N}" stroke="${COL.raised}" stroke-width="${f(u(2))}"/><text x="${f(x)}" y="${f(y + u(4.5))}" font-family="Archivo,Arial,sans-serif" font-size="${f(u(13))}" font-weight="700" fill="${COL.raised}" text-anchor="middle">${n}</text>`;
  const bb = d => box(d);
  const cupD = dia('cafe', [5.6, 6.4, 12.8, 11], (G, u) => { const body = bb(G.parts[0]), ear = bb(G.parts[1]), sau = bb(G.parts[2]), e = G.prims[0].cap; return [mk(body.x0 + body.w / 2, body.y0 - u(14), 1, u), mk(body.x0 - u(14), body.y0 + body.h * 0.4, 2, u), mk(ear.x1 + u(14), ear.y0 + ear.h / 2, 3, u), mk(e.cx, e.cy + e.ry * 0.45, 4, u), mk(sau.x0 + u(8), sau.y1 + u(16), 5, u), `<line x1="12" y1="${f(body.y0 - 0.3)}" x2="12" y2="${f(sau.y1 + 0.3)}" stroke="${N}" stroke-width="${f(u(1.2))}" stroke-dasharray="${f(u(8))} ${f(u(3))} ${f(u(2))} ${f(u(3))}"/>`, mk(12, sau.y1 + u(16), 6, u)]; },
    ['The cup is 1 (its width); it is as deep as it is wide.', 'The saucer, the widest root, is 1 4/5 of the cup.', 'The ear is 4/5 of the cup\'s depth, a half circle at its back; its counter a circle on its centre, a line in, running straight from the wall for half a line.', 'The bottom: one ellipse wall to wall, 4/5 as tall as wide, the walls tangent at its widest point.', 'The saucer: a cap, its ellipse underneath, the slab\'s ends cutting it at half its height; 1px below the cup.', 'Balanced: the cup and ear\'s ink centre over the saucer\'s centre (dashed).']);
  const barD = dia('bar', [5.6, 6.4, 12.8, 11.4], (G, u) => { const e = G.prims[0].cap, st = bb(G.parts[1]), ft = G.prims[2].cap; return [mk(e.cx + e.rx * 0.62, e.cy + e.ry * 0.62, 1, u), `<line x1="${f(e.cx - e.rx - 0.4)}" y1="${f(G.mFin.box.y0)}" x2="${f(e.cx + e.rx + 0.4)}" y2="${f(G.mFin.box.y0)}" stroke="${N}" stroke-width="${f(u(1.2))}"/>`, mk(e.cx + e.rx + u(4), G.mFin.box.y0 - u(14), 2, u), mk(st.x1 + u(16), st.y0 + st.h / 2, 3, u), mk(ft.cx + ft.rx * 0.7, ft.cy - ft.ry - u(14), 4, u)]; },
    ['The bowl: one ellipse, the widest root (the glass\'s width), 4/5 as tall as wide.', 'The rim line cuts it 1/5 of its height above its centre, so the bowl is 6/5 of the ellipse deep and its sides turn from the rim on.', 'The stem, a post (5/6 line), shows half the bowl\'s depth.', 'The foot: a cap, its ellipse 4/5 as wide as the bowl\'s, the ends at half its height. The band: half a line, the bowl\'s side moved in a line.']);
  const musD = dia('museum', [5.6, 5.8, 12.8, 12.4], (G, u) => { const g = bb(G.parts[0]), bm = bb(G.parts[1]), c0 = bb(G.parts[2]), pl = bb(G.parts[G.parts.length - 1]); return [mk(12 + g.w * 0.25, g.y0 + g.h * 0.2 - u(10), 1, u), mk(bm.x1 + u(14), bm.y0 + bm.h / 2, 2, u), mk(c0.x0 - u(16), c0.y0 + c0.h / 2, 3, u), mk(pl.x1 + u(14), pl.y0 + pl.h / 2, 4, u)]; },
    ['The roof: a gable on 4/5-line ends, rising 1/3 of its run; it rests on the beam across the 1px cut.', 'The beam, the widest root, passes the outer columns by 1/3 of a post; past them its underside drops a step, and the outer columns flare a step into it.', 'Four columns, posts (5/6 line), 1/3 of the colonnade\'s width tall; the openings are the spaces they leave.', 'The plinth: the beam\'s rule, upside down.']);
  const treeD = dia('nature', [6.2, 4.6, 11.6, 14], (G, u) => { const t0 = bb(G.parts[0]), t2 = bb(G.parts[2]), tr = bb(G.parts[3]); return [mk(t0.x1 + u(10), t0.y0 + t0.h * 0.35, 1, u), mk(t2.x1 + u(4), t2.y1 - u(26), 2, u), mk(tr.x1 + u(16), tr.y0 + tr.h / 2, 3, u)]; },
    ['Three gables. Their shown heights (4.83 : 3 : 3.33) and half widths (2.8 : 4.1 : 5.3) won\'t snap: v123\'s rhythm.', 'A notch is 3/5 of the half width of the tier above; each tier droops half a line and sweeps in a fifth of a line.', 'The trunk: a post (5/6 line) showing one line under the bottom tier; the apex passes the cut by a step.']);
  return `<div style="border-top:2px solid ${COL.hair};padding:36px 0 44px">
<h2 style="margin:0 0 10px;font-size:34px;color:${N}">The spec: draw a new icon from this</h2>
<div style="margin:0 0 10px;padding:14px 18px;background:${COL.paper};border-top:4px solid ${OR};font-size:19px;line-height:1.4;color:${N};font-weight:600;max-width:1400px">"Yeah let's try for a ten also it's be best if the underlying shapes were proportionally related to each other and the grid so they weren't just random."</div>
<p style="margin:0 0 6px;font-size:18px;line-height:1.45;max-width:1300px">Everything a new icon needs is in this section, and every value here is read from one table in the code, <code>src/proportions.js</code>, which the drawings also read. Below it: the roots audit, the corners, and each of the six built on the grid.</p>
${H('The series, for shapes: the fractions of a parent root')}${shapeRuler}
<p style="margin:2px 0 0;font-size:15px;color:${I2};max-width:1300px">Halves, thirds, quarters, fifths and sixths, or a whole and one of them (1 4/5, 2 1/2). The parent is another root: the widest root is 1.</p>
${H('The series, for thicknesses: fractions of the line (1 1/2px), drawn at 40px a pixel')}${lineRuler}
<p style="margin:2px 0 0;font-size:15px;color:${I2};max-width:1300px">The marks in use, and what they are for. Thicknesses are px: they never scale with the fit.</p>
${H('Every rule, in one list')}<div style="max-width:1400px">${rules}</div>
${H('The table')}${table}
${H('The steps')}${steps}
${H('The proportions of the four shaped icons, on the engine\'s own construction')}
<p style="margin:0 0 14px;font-size:16px;line-height:1.4;color:${I2};max-width:1300px">Orange: the roots as built; dashed brown: an ellipse drawn whole; dashed orange: a cut. 1px grid of the 24 badge. The star: a regular ten-point star, inner radius 0.47, its counter the same star on the same centre, sized so it is 2 1/2 lines across. The +: two posts of the open-mark line, its arms spanning the coin.</p>
<div style="display:flex;gap:28px;flex-wrap:wrap;align-items:flex-start">${cupD}${barD}${musD}${treeD}</div>
</div>`;
}
module.exports = { section, spec };
if (require.main === module) {
  const kick = t_ => `<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${I2};text-transform:uppercase;margin:30px 0 8px">${t_}</div>`;
  const quote = q => `<div style="margin:6px 0 12px;padding:10px 14px;background:${COL.paper};font-size:17px;line-height:1.4;color:${N}">You: "${q}"</div>`;
  const out = process.argv[2] || 'proportions-preview.html';
  fs.writeFileSync(out, `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&display=swap"></head><body style="margin:0;background:${COL.raised};font-family:Archivo,Arial,sans-serif;color:${COL.ink}"><div style="width:760px;box-sizing:border-box;padding:36px 32px 40px">${section(kick, quote)}</div><div style="width:1800px;box-sizing:border-box;padding:56px 64px">${spec()}</div></body></html>`);
  console.log('ok', out);
}
