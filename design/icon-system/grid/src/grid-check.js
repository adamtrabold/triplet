// THE GRID CHECK (10-27): reads every edge of every icon and reports any edge off the grid (grid/THE-GRID.md, "The check").
// An EDGE is what the eye reads as "the line lands here": every straight level or upright run 0.4px long or more, and the
// extreme of every round whose radius is 3/4px or more (pixel-fit.js findEdges, unchanged). Points (apexes, tips), diagonals
// and the small rounds at corners are not edges: they are curves by design, and the check counts them only as "free".
//   SHAPES (badge icons): every edge on a grid line (a whole px).
//   STROKES (line marks: the +, the star): every edge on a line or a half line, and each stroke has at least one edge on a line.
// Also: soft edges per screen (an edge not on a whole device pixel at 2x, at 3x), and the size against the class box.
//   node src/grid-check.js [dir=svg/the-grid] [--approved]   -> prints a table; exit 1 if any edge is off the grid
'use strict';
const fs = require('fs'), path = require('path');
process.env.TOOLS = process.env.TOOLS || '/tmp/claude-0/-home-user-la-trip-map/e88b6fb0-7c93-5435-a682-b10a85f40e06/scratchpad/tools';
require('./engine.js');
const { findEdges } = require('./pixel-fit.js');
const { measure } = require('./optics.js');
const { GRID } = require('./the-grid.js');
const fair = require('./fair-check.js'), join = require('./join-check.js');
const TOL = 0.005;   // px: an edge within 1/200 px of a line is on it (the outline is written to 4-7 decimals)
const off = (v, step) => { const q = v / step; return Math.abs(q - Math.round(q)) * step; };
const MARK = new Set(['plus', 'star', 'Add', 'Star']);
const CLS = { cafe: 'wide', bar: 'square', museum: 'square', nature: 'tall', 'Café': 'wide', Bar: 'square', Museum: 'square', Nature: 'tall' };

function check(name, d) {
  const E = findEdges(d), mark = MARK.has(name), step = mark ? 0.5 : 1, edges = [];
  for (const ax of ['x', 'y']) for (const e of E[ax]) edges.push({ ax, pos: e.pos, run: e.hi - e.lo, kind: e.kind, off: off(e.pos, step) });
  const bad = edges.filter(e => e.off > TOL);
  const soft = dpr => edges.filter(e => off(e.pos * dpr, 1) > 0.1).length;
  const m = measure(d), b = m.box, w = b.x1 - b.x0, h = b.y1 - b.y0;
  const cls = CLS[name], box = cls ? GRID.classes[cls] : null;
  return { name, edges: edges.length, off: bad, soft2: soft(2), soft3: soft(3), w, h, ink: m.area,
    over: box ? { w: +(w - box.w).toFixed(2), h: +(h - box.h).toFixed(2) } : null,
    fair: fair.check(d).length, join: join.check(d).length };
}
module.exports = { check };
if (require.main === module) {
  const args = process.argv.slice(2), approved = args.includes('--approved');
  let set;
  if (approved) {   // the approved six (the Now board), for the before count
    const now = fs.readFileSync(path.join(__dirname, '..', 'simplify', 'boards', 'Grid7Now.dc.html'), 'utf8'); set = {};
    for (const m of now.matchAll(/<svg width="24" height="24" viewBox="0 0 24 24"[^>]*aria-label="([^"]+)"[^>]*><path fill="[^"]+" fill-rule="evenodd" d="([^"]+)"\/>/g)) if (!set[m[1]] && ['Café', 'Bar', 'Museum', 'Nature', 'Star', 'Add'].includes(m[1])) set[m[1]] = m[2];
  } else {
    const dir = args.find(a => !a.startsWith('--')) || path.join(__dirname, '..', 'svg', 'the-grid');
    const B = JSON.parse(fs.readFileSync(path.join(dir, 'build.json'), 'utf8')); set = Object.fromEntries(Object.entries(B).map(([k, v]) => [k, v.d]));
  }
  let total = 0, offN = 0, s2 = 0, s3 = 0;
  console.log('icon      edges  off-grid  soft 2x  soft 3x   size (w x h)    over box   ink   fair join');
  for (const [n, d] of Object.entries(set)) {
    const r = check(n, d); total += r.edges; offN += r.off.length; s2 += r.soft2; s3 += r.soft3;
    console.log(`${n.padEnd(9)} ${String(r.edges).padStart(5)}  ${String(r.off.length).padStart(8)}  ${String(r.soft2).padStart(7)}  ${String(r.soft3).padStart(7)}   ${r.w.toFixed(2).padStart(5)} x ${r.h.toFixed(2).padEnd(6)}  ${r.over ? `${r.over.w >= 0 ? '+' : ''}${r.over.w} / ${r.over.h >= 0 ? '+' : ''}${r.over.h}` : 'mark'.padEnd(9)}  ${r.ink.toFixed(1).padStart(5)}  ${r.fair}  ${r.join}`);
    for (const e of r.off) console.log(`   OFF ${e.ax === 'x' ? 'upright' : 'level  '} edge at ${e.pos.toFixed(4)} (${e.kind}, run ${e.run.toFixed(2)}): ${e.off.toFixed(4)} off its ${MARK.has(n) ? 'half ' : ''}line`);
  }
  console.log(`\n${total} edges, ${offN} off the grid; soft at 2x ${s2}, at 3x ${s3}`);
  if (!approved && offN) process.exit(1);
}
