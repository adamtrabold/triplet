// THE SYSTEM, step 1: the working system restored. Regenerates the v264 set from the code that made it, and proves it.
// The code is the system as it stood at v264 (commit a7ed489f), unchanged since: engine.js (union, the corner law, fairing,
// tip landing, leaned flares, mirror), picks7.js (the drawings as root calls), laws7.js + proportions.js (the one table:
// proportions, thicknesses, rounds, joins), construction.js (size, place, optical centring), joins.js (the capital),
// mix-curves.js (fork and knife from root calls), placement.js's rule (each outline moved once so core edges land).
//   node system-v264.js            build all, write svg/system/v264/<id>.svg and svg/system/v264/proof.json
//   REUSE=<dir> node system-v264.js   take the construction.js outputs already built (CONS_OUT=<dir>/<id>.json)
// v264's set: bar, museum, nature (posts at the line) and restaurant from svg/post-line; cafe, star, + from svg/placement.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const pf = require('./pixel-fit.js'), { diff, readD } = require('./system-diff.js');
const OUT = path.join(ROOT, 'svg', 'system', 'v264');
fs.mkdirSync(OUT, { recursive: true });

// placement.js's rule, as a function of an outline (placement.js itself reads the board file): the whole icon moved on a 1/48
// grid within 1/4px (along x only for a symmetric icon), then parts moved to a lattice if no point moves over 1/2px and the ink
// changes under 2%; the candidate with the fewest soft core edges at 2x + 3x wins, then the smaller move.
const SYMX = { bar: 1, museum: 1, nature: 1, star: 1, plus: 1 };
function place(id, d0) {
  const soft = (d, dpr) => pf.edges(d, 24, dpr).filter(e => e.off > 0.1).length, c0 = pf.centroid(d0);
  const shiftD = (d, dx, dy) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (m, a, b) => `${(+a + dx).toFixed(6)} ${(+b + dy).toFixed(6)}`);
  let best = { d: d0, s2: soft(d0, 2), s3: soft(d0, 3), move: 0 }, tb = null;
  const better = c => c.s2 + c.s3 < best.s2 + best.s3 || (c.s2 + c.s3 === best.s2 + best.s3 && c.move < best.move);
  for (let i = SYMX[id] ? 0 : -12; i <= (SYMX[id] ? 0 : 12); i++) for (let j = -12; j <= 12; j++) {
    const dx = i / 48, dy = j / 48, d = shiftD(d0, dx, dy), c = { d, s2: soft(d, 2), s3: soft(d, 3), move: Math.hypot(dx, dy) };
    if (!tb || c.s2 + c.s3 < tb.s2 + tb.s3 || (c.s2 + c.s3 === tb.s2 + tb.s3 && c.move < tb.move)) tb = c;
  }
  if (better(tb)) best = tb;
  for (const dpr of [1, 2, 3]) {
    const F = pf.fit(d0, { size: 24, dpr, tie: 'keep' }), c = { d: F.d, s2: soft(F.d, 2), s3: soft(F.d, 3), move: F.maxMove };
    if (c.move <= 0.5 + 1e-9 && Math.abs(pf.centroid(F.d).area / c0.area - 1) < 0.02 && better(c)) best = c;
  }
  return best.d;
}

const REF = { cafe: 'placement/cafe.svg', bar: 'post-line/bar.svg', museum: 'post-line/museum.svg', nature: 'post-line/nature.svg',
  restaurant: 'post-line/restaurant.svg', star: 'placement/star.svg', plus: 'placement/plus.svg' };
const PLACED = { cafe: 1, star: 1, plus: 1 };
const fmt7 = d => d.replace(/-?\d*\.?\d+(?:e-?\d+)?/g, t => (+(+t).toFixed(7)).toString());
const proof = {};
for (const id of Object.keys(REF)) {
  let d;
  if (id === 'restaurant') d = require('./mix-curves.js').buildIcon('restaurant').d;
  else if (process.env.REUSE) d = JSON.parse(fs.readFileSync(path.join(process.env.REUSE, `${id}.json`), 'utf8'))[id].d;
  else { const C = require('./construction.js'); d = (id === 'star' || id === 'plus' ? C.mark(id) : C.shaped(id)).d; }
  if (PLACED[id]) d = place(id, d);
  fs.writeFileSync(path.join(OUT, `${id}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill-rule="evenodd" d="${d}"/></svg>\n`);
  const ref = readD(path.join(ROOT, 'svg', REF[id]));
  proof[id] = { ref: 'svg/' + REF[id], ...diff(d, ref), sameAt7dp: fmt7(d) === fmt7(ref) };
  console.log(id, JSON.stringify(proof[id]));
}
fs.writeFileSync(path.join(OUT, 'proof.json'), JSON.stringify(proof, null, 1));
