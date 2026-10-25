// g7bc: every check the spec lists (rule 20), run on the blind round 2 icons (src/picks-blind2.js -> svg/blind2/*.svg)
//   TOOLS=<dir with node_modules/paper> node blind2-checks.js            fair, join, counters/walls, slivers and symmetry
//   TOOLS=... node blind2-checks.js jitter <id>[,<id>] [N=50]            the jitter check (src/jitter-check.js), ids bag heart heart-on
'use strict';
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '../svg/blind2'), ids = ['bag', 'heart', 'heart-on'];
const svgD = id => fs.readFileSync(path.join(dir, id + '.svg'), 'utf8').match(/ d="([^"]+)"/)[1];
if (process.argv[2] === 'jitter') {
  const jc = require('./jitter-check.js'); Object.assign(jc.BUILDERS, require('./picks-blind2.js').JITTER);
  let bad = 0; for (const id of process.argv[3].split(',')) if (!jc.run(id, +(process.argv[4] || 50), 1).ok) bad++;
  process.exit(bad ? 1 : 0);
}
const fair = require('./fair-check.js'), joinC = require('./join-check.js'), off = require('./offset-check.js');
const out = {};
for (const id of ids) {
  const d = svgD(id), lw = id === 'bag' ? 1.5 : 1.5 * 24 / 20;   // the line in the svg's units (the heart's box is at its 20px slot)
  const fa = fair.check(d), jo = joinC.check(d), c = off.check(d, lw);
  // slivers: a straight run under 0.2px, or a zero-length curve (check-svg.py's rule)
  out[id] = { fair: fa.map(x => x.kind + '@' + x.at.map(v => v.toFixed(2))), join: jo.map(x => x.kind + '@' + x.at.map(v => v.toFixed(2))), walls: c.holes.map(h => ({ min: +h.min.toFixed(3), max: +h.max.toFixed(3), off: h.off })) };
  console.log(id.padEnd(9), 'fair', fa.length ? fa.map(x => x.kind).join(' ') : 'clean', '· join', jo.length ? jo.map(x => x.kind).join(' ') : 'clean',
    '· walls (box units; line', lw.toFixed(2) + ')', c.holes.length ? c.holes.map(h => `${h.min.toFixed(2)}-${h.max.toFixed(2)}${h.off ? ` (${h.off} off)` : ''}`).join(' | ') : 'none');
}
fs.writeFileSync(path.join(dir, 'checks.json'), JSON.stringify(out, null, 1));
