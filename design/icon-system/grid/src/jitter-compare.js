// g7bb: how far each of the six moved from its approved drawing (svg/g7/between/<id>-r3.svg) when rebuilt by the engine as it is now
// (construction.json, or the json given), in px at true size (24) and at 72; and the checks on the rebuild.
//   node jitter-compare.js [construction.json]
'use strict';
const fs = require('fs'), path = require('path');
const { apart } = require('./jitter-check.js');
const fair = require('./fair-check.js'), jc = require('./join-check.js');
const F = { cafe: 'cafe-r3.svg', bar: 'bar-r3.svg', museum: 'museum-r3.svg', nature: 'nature-r3.svg', star: 'star-r3.svg', plus: 'plus-r3.svg' };
const all = JSON.parse(fs.readFileSync(process.argv[2] || path.join(__dirname, '../svg/g7/construction.json'), 'utf8'));
const dir = process.argv[3] || path.join(__dirname, '../svg/g7/between');
for (const id of Object.keys(F)) {
  if (!all[id]) continue;
  const ref = fs.readFileSync(path.join(dir, F[id]), 'utf8').match(/ d="([^"]+)"/)[1], d = all[id].d, a = apart(d, ref);
  const faults = [...fair.check(d), ...jc.check(d)].map(x => x.kind);
  console.log(`${id.padEnd(7)} ${d === ref ? 'identical' : `max ${a.m.toFixed(4)}px at 24 (${(a.m * 3).toFixed(3)}px at 72) at ${a.at}`}  s ${all[id].s ? all[id].s.toFixed(4) : '-'}  checks ${faults.join(' ') || 'clean'}`);
}
