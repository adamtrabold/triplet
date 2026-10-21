// The coupe's drink (g7aa), measured the same way on any coupe: the glass's inside is its silhouette moved in by
// one line (the walls taken off); the drink is the ink inside that. Reported at badge scale (px, px²):
//   liquid  the drink's area;  share  the drink over the glass's inside;  depth  the drink's height at the centre.
// usage: liquid(d, dSilhouette) with both outlines in the same coordinates
const paper = require(process.env.TOOLS + '/node_modules/paper/dist/paper-core.js');
if (!paper.project) paper.setup(new paper.Size(100, 100));
const E = require('./engine.js');
const W = 1.5;
function liquid(d, sil) {
  const s = new paper.CompoundPath(sil), kids = s.children && s.children.length ? s.children : [s];
  const outer = kids.reduce((a, k) => (Math.abs(k.area) > Math.abs(a.area) ? k : a));
  const od = outer.pathData; s.remove();
  const inside = E.erode(od, W, true);
  const ink = new paper.CompoundPath(d), drink = inside.intersect(ink);
  const area = Math.abs(drink.area), all = Math.abs(inside.area);
  const b = inside.bounds, cx = b.center.x;
  const ln = new paper.Path.Line(new paper.Point(cx, b.top - 1), new paper.Point(cx, b.bottom + 1));
  const ys = drink.getIntersections(ln).map(i => i.point.y).sort((a, b_) => a - b_); ln.remove();
  let depth = 0; for (let i = 0; i + 1 < ys.length; i += 2) depth += ys[i + 1] - ys[i];
  const out = { liquid: area, inside: all, share: area / all, depth };
  inside.remove(); ink.remove(); drink.remove();
  return out;
}
module.exports = { liquid };
