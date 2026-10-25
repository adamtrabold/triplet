// g7bb: WHY did a nudged rebuild change? Builds an icon twice (two jitter trials) and lists, corner by corner, how the engine drew
// each round (hill / g2 / plain, cubics, leaned flare, S, arc ease), where it leaves its edges, its crest, and the faults near it.
//   node jitter-why.js <id> '<J json a>' '<J json b>'     e.g. node jitter-why.js nature '{}' '{"law1000":true}'
'use strict';
const { BUILDERS, verdict, apart } = require('./jitter-check.js');
const [id, ja, jb] = process.argv.slice(2);
const A = BUILDERS[id](JSON.parse(ja || '{}')), B = BUILDERS[id](JSON.parse(jb || '{}'));
const f = v => v == null ? '-' : Array.isArray(v) ? v.map(x => (+x).toFixed(3)).join(',') : (+v).toFixed(3);
const row = c => `${c.how}${c.cubics.length}${c.flared ? ' flare:' + c.flared : ''}${c.sSpan ? ' S' : ''}${c.arcEase ? ' arc' : ''}${c.ease ? ' ease' : ''} r ${f(c.r)} pA ${f(c.pA)} pB ${f(c.pB)} kM ${f(c.kM)}`;
console.log('faults a:', verdict(A.d).join(' ') || 'clean'); console.log('faults b:', verdict(B.d).join(' ') || 'clean'); console.log('apart', JSON.stringify(apart(A.d, B.d)));
const n = Math.max(A.corners.length, B.corners.length);
for (let i = 0; i < n; i++) {
  const a = A.corners[i], b = B.corners[i]; if (!a || !b) { console.log(i, 'MISSING', !!a, !!b); continue; }
  const ra = row(a), rb = row(b), dA = Math.hypot(a.pA[0] - b.pA[0], a.pA[1] - b.pA[1]), dB = Math.hypot(a.pB[0] - b.pB[0], a.pB[1] - b.pB[1]);
  const same = ra.split(' r ')[0] === rb.split(' r ')[0] && dA < 0.03 && dB < 0.03 && Math.abs((a.kM || 0) - (b.kM || 0)) < 0.05 * Math.abs(a.kM || 1);
  if (!same || process.env.ALL) console.log(i, same ? ' ' : '*', f(a.P0), '\n   a', ra, '\n   b', rb);
}
