// THE GRID CHECK (10-27): reads every edge of every icon and reports any edge off the grid, any icon over its size limit, and
// any icon outside the weight gate (grid/THE-GRID.md, "The check").
// An EDGE is what the eye reads as "the line lands here": every straight level or upright run 0.4px long or more, and the
// extreme of every round whose radius is 3/4px or more (pixel-fit.js findEdges, unchanged). Points (apexes, tips), diagonals
// and the small rounds at corners are not edges: they are curves by design.
//   BADGE ICONS: every edge on a grid line, except a stroke's inner edge (and a gap laid from it), which is on a half line; each
//                such edge is named by the rule that made it (build.json meta.half), so the check accepts only those.
//   LINE MARKS (the +, the star: all stroke): every edge on a line or a half line.
//   SIZE: the outline box within the icon's limit (its approved box rounded up to the grid; points count inside).
//   WEIGHT: ink within GRID.weight (10%) of the approved (badge icons; the marks are sized by their slot, so by ink per box area).
//   node src/grid-check.js [dir=svg/the-grid] [--approved]   -> a table; exit 1 if any edge is off, or any size or weight fails
'use strict';
const fs = require('fs'), path = require('path');
process.env.TOOLS = process.env.TOOLS || '/tmp/claude-0/-home-user-la-trip-map/e88b6fb0-7c93-5435-a682-b10a85f40e06/scratchpad/tools';
require('./engine.js');
const { findEdges } = require('./pixel-fit.js');
const { measure } = require('./optics.js');
const { GRID, limit } = require('./the-grid.js');
const fair = require('./fair-check.js'), join = require('./join-check.js');
const TOL = 0.005;   // px: an edge within 1/200 px of a line is on it (the outline is written to 4-7 decimals)
const off = (v, step) => { const q = v / step; return Math.abs(q - Math.round(q)) * step; };
const MARK = new Set(['plus', 'star', 'Add', 'Star']);
const ID = { 'Café': 'cafe', Bar: 'bar', Museum: 'museum', Nature: 'nature' };
const SYM = { cafe: false, bar: true, museum: true, nature: true };

function check(name, d, meta = {}) {
  const E = findEdges(d), mark = MARK.has(name), edges = [], half = meta.half || [];
  for (const ax of ['x', 'y']) for (const e of E[ax]) {
    const named = half.find(h => h.ax === ax && Math.abs(h.pos - e.pos) < TOL);
    const o = mark ? off(e.pos, 0.5) : named ? 0 : off(e.pos, 1);
    edges.push({ ax, pos: e.pos, run: e.hi - e.lo, kind: e.kind, off: o, half: mark ? off(e.pos, 1) > TOL : !!named, why: named && named.why });
  }
  const bad = edges.filter(e => e.off > TOL);
  const soft = dpr => edges.filter(e => off(e.pos * dpr, 1) > 0.1).length;
  const m = measure(d), b = m.box, w = b.x1 - b.x0, h = b.y1 - b.y0, id = ID[name] || name;
  const lim = GRID.approved[id] ? limit(id, SYM[id]) : null;
  const inkA = GRID.approvedInk[id], wt = inkA ? m.area / inkA - 1 : null;
  return { name, edges: edges.length, halfEdges: edges.filter(e => e.half).length, off: bad, soft2: soft(2), soft3: soft(3), w, h, ink: m.area, limit: lim,
    over: lim ? { w: +(w - lim.w).toFixed(2), h: +(h - lim.h).toFixed(2) } : null, weight: wt,
    fair: fair.check(d).length, join: join.check(d).length };
}
module.exports = { check };
if (require.main === module) {
  const args = process.argv.slice(2), approved = args.includes('--approved');
  let set, metas = {};
  if (approved) {   // the approved six (the Now board), for the before count
    const now = fs.readFileSync(path.join(__dirname, '..', 'simplify', 'boards', 'Grid7Now.dc.html'), 'utf8'); set = {};
    for (const m of now.matchAll(/<svg width="24" height="24" viewBox="0 0 24 24"[^>]*aria-label="([^"]+)"[^>]*><path fill="[^"]+" fill-rule="evenodd" d="([^"]+)"\/>/g)) if (!set[m[1]] && ['Café', 'Bar', 'Museum', 'Nature', 'Star', 'Add'].includes(m[1])) set[m[1]] = m[2];
  } else {
    const dir = args.find(a => !a.startsWith('--')) || path.join(__dirname, '..', 'svg', 'the-grid');
    const B = JSON.parse(fs.readFileSync(path.join(dir, 'build.json'), 'utf8')); set = Object.fromEntries(Object.entries(B).map(([k, v]) => [k, v.d])); metas = Object.fromEntries(Object.entries(B).map(([k, v]) => [k, v.meta]));
  }
  let total = 0, offN = 0, s2 = 0, s3 = 0, fails = 0;
  console.log('icon      edges  half  off-grid  soft 2x/3x   size (w x h)   limit    ink   weight  fair join');
  for (const [n, d] of Object.entries(set)) {
    const r = check(n, d, metas[n]); total += r.edges; offN += r.off.length; s2 += r.soft2; s3 += r.soft3;
    const overF = r.over && (r.over.w > 0.01 || r.over.h > 0.01), wtF = r.weight != null && Math.abs(r.weight) > GRID.weight + 1e-9;
    if (!approved && (overF || wtF)) fails++;
    console.log(`${n.padEnd(9)} ${String(r.edges).padStart(5)}  ${String(r.halfEdges).padStart(4)}  ${String(r.off.length).padStart(8)}  ${`${r.soft2}/${r.soft3}`.padStart(10)}   ${r.w.toFixed(2).padStart(5)} x ${r.h.toFixed(2).padEnd(6)} ${r.limit ? `${r.limit.w} x ${r.limit.h}${overF ? ' OVER' : ''}` : 'mark'}`.padEnd(78) + `${r.ink.toFixed(1).padStart(5)}  ${r.weight == null ? '  -   ' : `${r.weight >= 0 ? '+' : ''}${(r.weight * 100).toFixed(1)}%${wtF ? ' FAIL' : ''}`.padStart(6)}  ${r.fair}  ${r.join}`);
    for (const e of r.off) console.log(`   OFF ${e.ax === 'x' ? 'upright' : 'level  '} edge at ${e.pos.toFixed(4)} (${e.kind}, run ${e.run.toFixed(2)}): ${e.off.toFixed(4)} off its ${MARK.has(n) ? 'half ' : ''}line`);
  }
  console.log(`\n${total} edges, ${offN} off the grid; soft at 2x ${s2}, at 3x ${s3}${approved ? '' : `; ${fails} over a limit or outside the weight gate`}`);
  if (!approved && (offN || fails)) process.exit(1);
}
