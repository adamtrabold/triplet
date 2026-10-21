// g7aa: the counter check (offset-check) and the curve check on svg/g7/between/*.svg
// usage: TOOLS=<dir with node_modules/paper> node src/between-checks.js
const fs = require('fs'), path = require('path');
const paper = require(process.env.TOOLS + '/node_modules/paper/dist/paper-core.js');
if (!paper.project) paper.setup(new paper.Size(100, 100));
const { check } = require('./offset-check.js');
const dir = path.join(__dirname, '../svg/g7/between');
function curveJump(d) {   // the largest curvature jump at a smooth join (1/px); joins next to an edge under 3px are line ends
  const cp = new paper.CompoundPath(d), kids = cp.children && cp.children.length ? cp.children : [cp];
  let worst = 0, end = 0;
  for (const k of kids) { const cv = k.curves; for (let q = 0; q < cv.length; q++) { const a = cv[q], b = cv[(q + 1) % cv.length];
    if (Math.abs(a.getTangentAtTime(1).getDirectedAngle(b.getTangentAtTime(0))) > 2) continue;
    const j = Math.abs(Math.abs(a.getCurvatureAtTime(1)) - Math.abs(b.getCurvatureAtTime(0)));
    if (Math.min(a.length, b.length) < 3) end = Math.max(end, j); else worst = Math.max(worst, j); } }
  cp.remove(); return { worst, end };
}
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.svg')).sort()) {
  const d = fs.readFileSync(path.join(dir, f), 'utf8').match(/ d="([^"]+)"/)[1];
  const lw = /star|plus/.test(f) ? 5 / 3 * 24 / (f.startsWith('star') ? 20 : 26.4) : 1.5;
  const c = check(d, lw), cj = curveJump(d);
  console.log(f.padEnd(10), 'counters', c.holes.length ? c.holes.map(h => `${h.min.toFixed(2)}-${h.max.toFixed(2)}${h.off ? ` (${h.off} off)` : ''}`).join(' | ') : 'none', '· curve jump', cj.worst.toFixed(2), '/px (line ends', cj.end.toFixed(2) + ')');
}
