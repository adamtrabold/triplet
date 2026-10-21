// The coupe's wall beside its clear band: at the band's top, middle and bottom, the shortest distance from the
// band's side to the bowl's outside (the true wall), on the finished outline. usage: wall(d) -> {top, mid, bot, h}
const paper = require(process.env.TOOLS + '/node_modules/paper/dist/paper-core.js');
if (!paper.project) paper.setup(new paper.Size(100, 100));
function wall(d) {
  const cp = new paper.CompoundPath(d), kids = cp.children;
  const outer = kids.reduce((a, k) => (Math.abs(k.area) > Math.abs(a.area) ? k : a));
  // the band: the hole nearest the rim (smallest top y among the holes)
  const holes = kids.filter(k => k !== outer && outer.contains(k.interiorPoint));
  const band = holes.reduce((a, k) => (k.bounds.top < a.bounds.top ? k : a));
  const b = band.bounds, at = y => {
    const ln = new paper.Path.Line(new paper.Point(b.left - 1, y), new paper.Point(b.center.x, y));
    const xs = band.getIntersections(ln).map(i => i.point); ln.remove();
    const p = xs.reduce((a, q) => (q.x < a.x ? q : a));
    const lo = new paper.Path.Line(new paper.Point(-5, y), new paper.Point(p.x, y)), ox = outer.getIntersections(lo).map(i => i.point.x); lo.remove();
    return { sq: p.getDistance(outer.getNearestPoint(p)), across: p.x - Math.min(...ox) };
  };
  const e = 0.2;   // stay clear of the band's own corner rounds
  const r = { top: at(b.top + e), mid: at(b.center.y), bot: at(b.bottom - e), h: b.height, left: b.left, top_y: b.top };
  cp.remove(); return r;
}
module.exports = { wall };
if (require.main === module) {
  const E = require(__dirname + '/engine.js'), P7 = require(__dirname + '/picks7.js'), { LAWS7, HUMAN } = require(__dirname + '/laws7.js');
  const B = { style: 'mono', bd: 5.5, bk: 0.35, bx: 0.5, fb: 10.333, bandH: +(process.argv[2] || 4 / 3) };
  for (const [nm, o, law, ease] of [['Now', {}, LAWS7.joint, 0], ['H2', { droop: 0.5, bow: -0.2 }, LAWS7.joint, 2.3], ['H3', { dome: true }, HUMAN({ flare: 1.5, mass: 0.6, end: 0.3 }), 2.3], ['H3r', { dome: true, post: 1.25 }, HUMAN({ flare: 1.5, mass: 0.6, end: 0.3 }), 2.3]]) {
    const d = E.build(P7.DRAW.bar(12, { ...B, ...o }), { law, tightHoles: true, ease: ease || undefined }).d, w = wall(d);
    const q = k => `${w[k].across.toFixed(2)} across (${w[k].sq.toFixed(2)} square)`;
    console.log(nm.padEnd(4), 'wall: top', q('top'), '· middle', q('mid'), '· bottom', q('bot'), '· band height', w.h.toFixed(3));
  }
}
