// H3's corners, per icon: which branch of HUMAN each corner takes (flare / hole / end / mass / joint), with position
// usage: TOOLS=<dir with node_modules/paper> node src/h3-ends.js
const G = __dirname + '/';
const E = require(G + 'engine.js'), P7 = require(G + 'picks7.js'), { LAWS7, HUMAN } = require(G + 'laws7.js');
const H = HUMAN({ flare: 1.5, mass: 0.6, end: 0.3 });
for (const id of ['cafe', 'bar', 'museum', 'nature']) {
  const log = [];
  const law = c => {
    const r = H(c);
    let k = c.hole ? 'hole' : (!c.convex && c.angle >= 75 && c.angle <= 105 && Math.min(c.lin, c.lout) >= 1.5) ? 'FLARE' : (c.convex && c.angle >= 75 && c.angle <= 105) ? (Math.min(c.lin, c.lout) <= 2 ? 'end' : 'mass') : 'joint';
    log.push(k);
    return r;
  };
  const info = [];
  E.build(P7.DRAW[id](12, { style: 'mono', droop: 0.5, bow: -0.2, dome: true, bandH: 4 / 3 }), { law, tightHoles: true, ease: 2.3, info });
  const pts = info.filter(i => !i.cap && !i.trap);
  console.log('==', id, 'corners', log.length, 'info', pts.length);
  log.forEach((k, i) => { const p = pts[i] || {}; console.log('  ', k.padEnd(6), p.x, p.y, 'r', p.r, p.convex ? 'cvx' : 'ccv', p.angle); });
}
