// ROUND 4 (10-26): PLACEMENT ONLY. Owner on the whole-pixel grids: "lets just keep the line weight and stuff where it was and
// just opimize point placement as possible. the other options look like shit". And still: "no i want the base grid to make
// great icons without extrawork".
// Every width stays as drawn (1.5px line, 1.25px posts, the ring, the badge, the sizes, the proportions). Only positions move,
// once, in the drawing itself (one outline for every screen): each icon is placed, and its straight edges moved, so as many
// core edges as possible land on whole device pixels at 2x AND 3x at the 24 badge.
//   Whole CSS px are whole at both. A stem keeps its width, so only ONE of its edges can be a whole px: it lands whichever
//   edge moves less (pixel-fit.js, tie 'keep'). Its other edge: a 1.5px line's is then whole at 2x (3 device px) but half at
//   3x (4.5); a 1.25px post's is soft at both (2.5 / 3.75). Symmetric icons stay symmetric (mirror about a whole or half px).
// For each icon three lattices are tried for the moved edges (whole px, 1/2px, 1/3px) and the one with the fewest soft core
// edges summed over 2x and 3x wins (then the smaller move).
//   NODE_PATH=<playwright> node src/placement.js -> svg/placement/<icon>.svg, svg/placement/measure.json,
//                                                   stills/placement/raw/<icon>-<before|after>-<dpr>x.png
'use strict';
const fs = require('fs'), path = require('path');
const pf = require('./pixel-fit.js'), fair = require('./fair-check.js'), join = require('./join-check.js');
const ROOT = path.join(__dirname, '..');
const now = fs.readFileSync(path.join(ROOT, 'simplify', 'boards', 'Grid7Now.dc.html'), 'utf8');
const SIX = {};
for (const m of now.matchAll(/<svg width="24" height="24" viewBox="0 0 24 24"[^>]*aria-label="([^"]+)"[^>]*><path fill="[^"]+" fill-rule="evenodd" d="([^"]+)"\/>/g)) if (!SIX[m[1]]) SIX[m[1]] = m[2];
const ID = { 'Café': 'cafe', Bar: 'bar', Museum: 'museum', Nature: 'nature', Star: 'star', Add: 'plus' };
const SV = path.join(ROOT, 'svg', 'placement'), RAW = path.join(ROOT, 'stills', 'placement', 'raw');
fs.mkdirSync(SV, { recursive: true }); fs.mkdirSync(RAW, { recursive: true });
const soft = (d, dpr) => pf.edges(d, 24, dpr).filter(e => e.off > 0.1).length;
const res = {}, OUTL = {};
for (const [n, id] of Object.entries(ID)) {
  const d0 = SIX[n], c0 = pf.centroid(d0);
  const base = { lattice: 'as drawn', d: d0, s2: soft(d0, 2), s3: soft(d0, 3), move: 0 };
  let best = base;
  const better = c => c.s2 + c.s3 < best.s2 + best.s3 || (c.s2 + c.s3 === best.s2 + best.s3 && c.move < best.move);
  // 1. the whole icon moved (its optical centring snapped), shape untouched: the best shift on a 1/48px grid within half a px
  //    either way; a symmetric icon moves only along its unsymmetric axis unless its centre lands on a whole or half px
  const shiftD = (d, dx, dy) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (m, a, b) => `${(+a + dx).toFixed(6)} ${(+b + dy).toFixed(6)}`);
  let tb = null;
  // capped at 1/4px a side (optical centring must not visibly move); an icon symmetric across x stays on the badge's centre line
  // (round 5: the + may move vertically too)
  const SYMX = { bar: 1, museum: 1, nature: 1, star: 1, plus: 1 }, SYMY = {};   // vertical centring is optical, per icon (director, turn 178): every icon may move up or down
  for (let i = SYMX[id] ? 0 : -12; i <= (SYMX[id] ? 0 : 12); i++) for (let j = SYMY[id] ? 0 : -12; j <= (SYMY[id] ? 0 : 12); j++) {
    const dx = i / 48, dy = j / 48, d = shiftD(d0, dx, dy), c = { lattice: 'moved whole', d, s2: soft(d, 2), s3: soft(d, 3), move: Math.hypot(dx, dy) };
    if (!tb || c.s2 + c.s3 < tb.s2 + tb.s3 || (c.s2 + c.s3 === tb.s2 + tb.s3 && c.move < tb.move)) tb = c;
  }
  if (better(tb)) best = tb;
  const shiftOnly = { s2: tb.s2, s3: tb.s3, move: +tb.move.toFixed(3) };
  // 2. parts moved too (each straight edge to a lattice, widths kept), accepted only while the change stays negligible:
  //    no point moves over 1/2px and the ink changes by under 2%
  for (const [lat, dpr] of [['1px', 1], ['1/2px', 2], ['1/3px', 3]]) {
    const F = pf.fit(d0, { size: 24, dpr, tie: 'keep' });
    const c = { lattice: lat, d: F.d, s2: soft(F.d, 2), s3: soft(F.d, 3), move: F.maxMove };
    const area = Math.abs(pf.centroid(F.d).area / c0.area - 1);
    if (c.move <= 0.5 + 1e-9 && area < 0.02 && better(c)) best = c;
  }
  const c1 = pf.centroid(best.d);
  res[id] = { edges: pf.edges(d0, 24, 2).length, before: { s2: base.s2, s3: base.s3 }, shiftOnly, after: { s2: best.s2, s3: best.s3 }, lattice: best.lattice,
    maxMovePx: +best.move.toFixed(3), centreShiftPx: +Math.hypot(c1.cx - c0.cx, c1.cy - c0.cy).toFixed(3), areaChange: +((c1.area / c0.area - 1) * 100).toFixed(2),
    fair: fair.check(best.d).length, join: join.check(best.d).length };
  OUTL[id] = { before: d0, after: best.d };
  fs.writeFileSync(path.join(SV, `${id}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill-rule="evenodd" d="${best.d}"/></svg>\n`);
  console.log(id, JSON.stringify(res[id]));
}
const tot = k => Object.values(res).reduce((s, r) => s + r[k].s2 + r[k].s3, 0);
console.log('soft core edges, 2x+3x, all six:', tot('before'), '->', tot('after'), 'of', 2 * Object.values(res).reduce((s, r) => s + r.edges, 0));
fs.writeFileSync(path.join(SV, 'measure.json'), JSON.stringify(res, null, 1));
fs.writeFileSync(path.join(SV, 'paths.json'), JSON.stringify(OUTL));

(async () => {
  const { chromium } = require('playwright'), b = await chromium.launch();
  const NAVY = '#12293F', PAPER = '#F2EBDD';
  for (const dpr of [2, 3]) {
    const p = await b.newPage({ viewport: { width: 200, height: 200 }, deviceScaleFactor: dpr });
    for (const [id, o] of Object.entries(OUTL)) for (const st of ['before', 'after']) for (const ring of [true, false]) {
      await p.setContent(`<body style="margin:0;background:${PAPER}"><svg style="position:absolute;left:8px;top:8px" width="24" height="24" viewBox="0 0 24 24">${ring ? `<circle cx="12" cy="12" r="11.25" fill="none" stroke="${NAVY}" stroke-width="1.5"/>` : ''}<path fill="${NAVY}" fill-rule="evenodd" d="${o[st]}"/></svg></body>`);
      await p.screenshot({ path: path.join(RAW, `${id}-${st}-${dpr}x${ring ? '' : '-glyph'}.png`), clip: ring ? { x: 8, y: 8, width: 24, height: 24 } : { x: 12, y: 12, width: 16, height: 16 } });
    }
    await p.close();
  }
  await b.close(); console.log('rendered');
})();
