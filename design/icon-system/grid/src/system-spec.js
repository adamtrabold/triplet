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
  L.push('## The sizes', '', '| Size | Stroke | Parts | Thinnest part | Gaps and cuts | Inner band | Counter minimum | Protrusion |', '|---|---|---|---|---|---|---|---|');
  for (const [s, Z] of Object.entries(S.SIZES)) L.push(`| ${s} | ${fr(Z.stroke)} | ${fr(Z.part)} | ${fr(Z.min)} | ${fr(Z.gap)} | ${s === '12' ? 'closes' : fr(Z.band)} | ${fr(Z.counter)}${Z.close ? ', smaller closes' : ''} | ${fr(Z.protrude)} |`);
  L.push('', 'Widths are px at that size, on whole iPhone pixels except the 1½ stroke at 18. The ring: 1⅓ at 24, 1⅔ at 32.', '',
    '## How an icon is made', '',
    '1. Declare it (below): its roots top to bottom, each a kind of root, its size a share of a parent, and how it meets the root above it (rests on, a cut apart; into, a fillet; held under an overhang, a chamfer; a loop on a wall, one tangent curve; tiers notched). The declaration is data and the only per-icon input.',
    '2. The system lays the roots out by those relations, fits the icon to its class box by the sides that scale (never past its v264 size), and centres it optically within the box.',
    '3. Straight widths and overhangs land on the iPhone grid before anything is drawn on them; the roots land by the snap priority; a row or a comb lands as one.',
    '4. Every corner takes a cutter from the rack, every join is faired to continuous curvature, a symmetric icon is mirrored.',
    '5. The checks run on every size; any failure stops it.', '', '## The declarations', '');
  for (const id of S.ORDER) { const d = S.DECL[id]; L.push(`- **${d.name}** (${d.cls}${d.proof ? "; the system's proof: built from a declaration with no new code, not a set member" : ""}): ${S.words(d)}.`); }
  L.push('', '## Build and check', '', '- `node src/system.js build 18` (and 24, 12): writes `svg/system/<size>/<icon>.svg` (one process per size; any icon list).',
    '- `node src/system.js check`: every automatic check; exit 1 blocks publishing. Eye checks print after.',
    '- `node src/system.js spec`: rewrites this file. `src/system-make.js` is the maker (kinds, joins, layout, pipeline); nothing in it names an icon.', '');
  return L.join('\n');
}
module.exports = { write: () => fs.writeFileSync(path.join(__dirname, '..', 'THE-SYSTEM.md'), md()), md };
