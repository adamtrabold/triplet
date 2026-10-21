// The coupe's drink (g7r): the ink below the clear band, down to where the bowl narrows into the stem
// (the first row narrower than two lines), measured row by row on a finished glyph (24 units).
// Usage: node src/drink-measure.js <bar svg> [...]   (TOOLS must point at paper)
'use strict';
const fs = require('fs'), path = require('path');
const paper = require(path.join(process.env.TOOLS, 'node_modules/paper/dist/paper-core.js'));
paper.setup(new paper.Size(100, 100));
function drink(d, line = 1.5) {
  const cp = new paper.CompoundPath(d);
  const kids = cp.children.slice().sort((a, b) => Math.abs(b.area) - Math.abs(a.area));
  // the band: the largest hole (a child inside the outline)
  const outer = kids[0], band = kids.slice(1).filter(k => outer.contains(k.bounds.center)).sort((a, b) => b.bounds.width - a.bounds.width)[0];
  const y0 = band.bounds.bottom, cx = band.bounds.center.x;
  const widthAt = y => { const ln = new paper.Path.Line(new paper.Point(-10, y), new paper.Point(40, y)); const xs = cp.getIntersections(ln).map(i => i.point.x).sort((a, b) => a - b); ln.remove(); let w = 0; for (let i = 0; i + 1 < xs.length; i += 2) w += xs[i + 1] - xs[i]; return w; };
  let area = 0, y = y0 + 0.005, dy = 0.01, wTop = widthAt(y);
  for (; ; y += dy) { const w = widthAt(y); if (w < 2 * line) break; area += w * dy; }
  cp.remove();
  return { area, depth: y - y0, surface: wTop, top: y0, bandW: band.bounds.width };
}
module.exports = { drink };
if (require.main === module) for (const f of process.argv.slice(2)) {
  const d = fs.readFileSync(f, 'utf8').match(/<path[^>]* d="([^"]+)"/g).map(m => m.match(/d="([^"]+)"/)[1]).pop();
  const r = drink(d);
  console.log(f, `drink area ${r.area.toFixed(2)} px², depth at centre ${r.depth.toFixed(2)}, surface ${r.surface.toFixed(2)} wide`);
}
