// THE SYSTEM, the spec: writes grid/THE-SYSTEM.md from system.js (the decision points, the sizes, the declarations, the checks).
'use strict';
const fs = require('fs'), path = require('path');
const S = require('./system.js');
const fr = v => { const w = Math.floor(v + 1e-9), r = v - w, F = [[0, ''], [1 / 4, '¼'], [1 / 3, '⅓'], [1 / 2, '½'], [2 / 3, '⅔'], [3 / 4, '¾']];
  const m = F.find(([x]) => Math.abs(r - x) < 1e-6); return m ? `${w || (m[1] ? '' : '0')}${m[1]}` : (+v.toFixed(2)).toString(); };
function md() {
  const L = ['# The system', '', 'Every decision about Triplet\'s icons is a decision point here, with its current setting and the date it was set.',
    'A change to any icon is a change here first. Open points are still to be set; their choices are listed.', ''];
  for (const g of S.SETTINGS) {
    L.push(`## ${g.g}`, '');
    for (const [name, setting, date, by, choices] of g.items) {
      if (setting === 'open') L.push(`- **${name}:** open. Choices: ${choices.map((c, i) => `(${i + 1}) ${c}`).join('; ')}. [${date}]`);
      else L.push(`- **${name}:** ${setting} [${date}]${by === 'designer' ? ' *(set by the designer; yours to change)*' : ''}`);
    }
    L.push('');
  }
  L.push('## The sizes', '', '| Size | Stroke | Parts | Gaps and cuts | Inner band | Counter minimum | Protrusion |', '|---|---|---|---|---|---|---|');
  for (const [s, Z] of Object.entries(S.SIZES)) L.push(`| ${s} | ${fr(Z.stroke)} | ${fr(Z.part)} | ${fr(Z.gap)} | ${s === '12' ? 'closes' : fr(Z.band)} | ${fr(Z.counter)}${Z.close ? ', smaller closes' : ''} | ${fr(Z.protrude)} |`);
  L.push('', 'Widths are px at that size, on whole iPhone pixels except the 1½ stroke at 18. The ring: 1⅓ at 24, 1⅔ at 32.', '',
    '## How an icon is made', '',
    '1. Declare it: its roots, how they relate, joined or cut (below). Nothing else.',
    '2. The system fits it to its class box, sets every width from the size, rounds every corner by the machined rule and the round table, fairs every join to continuous curvature, mirrors it if it is symmetric and centres it optically.',
    '3. It lands on the iPhone grid by the snap priority, at each size it ships.',
    '4. The checks run; any failure stops it.', '', '## The declarations', '');
  for (const id of S.ORDER) { const d = S.DECL[id]; L.push(`- **${id}** (${d.cls}): ${d.roots}. Joins: ${d.joins}.`); }
  L.push('', '## Build and check', '', '- `node src/system.js build 18` (and 24, 12): writes `svg/system/<size>/<icon>.svg`.',
    '- `node src/system.js check`: every automatic check; exit 1 blocks publishing. Eye checks print after.',
    '- `node src/system-v264.js`: proves the kernel still regenerates v264.', '- `node src/system.js spec`: rewrites this file.', '');
  return L.join('\n');
}
module.exports = { write: () => fs.writeFileSync(path.join(__dirname, '..', 'THE-SYSTEM.md'), md()), md };
