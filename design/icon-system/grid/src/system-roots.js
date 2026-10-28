// THE SYSTEM, the construction: each icon's root shapes as the system lands them (on the iPhone grid, before any corner is rounded),
// for the "Icons on the grid" board. Runs the same make() as the build, so the roots are the ones the icon was built from; writes
// svg/system/roots/<size>/<id>.json = { d (the built glyph, for a check against the build), roots: [{ d, cut, role, id }] }.
//   TOOLS=<dir with node_modules/paper> node system-roots.js <18|24|12> [ids]
'use strict';
const fs = require('fs'), path = require('path');
const S = require('./system.js'), Mk = require('./system-make.js'), SL = require('./system-land.js'), E = require('./engine.js');
const size = +(process.argv[2] || 18), ids = process.argv[3] ? process.argv[3].split(',') : S.ORDER, Z = S.SIZES[size];
const dir = path.join(S.OUT, 'roots', String(size)); fs.mkdirSync(dir, { recursive: true });
for (const id of ids) {
  const decl = S.DECL[id], line = S.MARK[decl.cls];
  if (line && size !== 18) continue;
  let R, prims;
  if (line) { R = Mk.mark(decl); prims = R.prims ? E.xform(R.prims, 1, 0, 0, 0, R.dy || 0) : []; }
  else { R = Mk.make(decl, Z, S, { v264: S.v264Box(id, size), land: (p, s_) => SL.landPrims(p, s_, { size: Z.frame, std: { stroke: null, counter: 0 } }) }); prims = R.prims; }
  const parts = E.parts(prims).map((p, i) => ({ d: p.d, cut: p.cut, role: prims[i].role || null, id: prims[i].rid || prims[i].id || null }));
  fs.writeFileSync(path.join(dir, `${id}.json`), JSON.stringify({ size, d: R.d, roots: parts }));
  console.log(size, id, parts.length, 'roots');
}
