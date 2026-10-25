// g7bb: rebuild named jitter trials of one icon (as jitter-check.js draws them: trial j<seed>_<i>), or the base, and print the move
// and the faults: for re-checking the trials that failed after an engine change.
//   node jitter-one.js <id> base j2_1 j4_9 ...
'use strict';
const { BUILDERS, verdict, apart, NUDGE } = require('./jitter-check.js');
const fs = require('fs'), path = require('path');
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const trialJ = (id, name) => { if (name === 'base') return {}; const [, sd, ix] = name.match(/^j(\d+)_(\d+)$/); const R = rng(+sd + id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)), u = () => (2 * R() - 1) * NUDGE; let J; for (let i = 0; i <= +ix; i++) J = { ds: u(), dx: u(), dy: u() }; return J; };
const [id, ...names] = process.argv.slice(2);
const F = { cafe: 'cafe-r3.svg', bar: 'bar-r3.svg', museum: 'museum-r3.svg', nature: 'nature-r3.svg', star: 'star-r3.svg', plus: 'plus-r3.svg' };
const ref = F[id] ? fs.readFileSync(path.join(__dirname, '../svg/g7/between', F[id]), 'utf8').match(/ d="([^"]+)"/)[1] : null;
for (const n of names) {
  const t0 = Date.now(), J = trialJ(id, n), g = BUILDERS[id](J), v = verdict(g.d);
  if (process.env.JSAVE) fs.writeFileSync(path.join(process.env.JSAVE, `${id}-${n}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${g.d}"/></svg>`);
  console.log(id, n, ref ? apart(g.d, ref).m.toFixed(4) : '-', v.join(' ') || 'clean', ((Date.now() - t0) / 1000).toFixed(0) + 's');
}
