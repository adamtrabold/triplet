// Reads the suites' OUT json files from a directory and prints the gate summary in
// CLAUDE.md's format ("84 + 8 (+ N8-a)", vtest, popup-open 20/20, dust frames,
// rows 56.00px, curve8 counts) plus delete-slop. Exit 1 if any suite failed.
// node summarize.js <dir>
const fs = require('fs'), path = require('path');
const dir = process.argv[2];
const J = n => { try { return JSON.parse(fs.readFileSync(path.join(dir, n + '.json'), 'utf8')); } catch (e) { return null; } };
const t = J('touch'), f = J('flip'), v = J('visit'), p = J('popup-open'), d = J('dust'), r = J('rows'), c = J('curve'), x = J('delete'), pl = J('plans'), pu = J('places-ux');
const ok = s => s && s.pass === s.total;
const parts = [], fails = [];
const n8 = t && t.n8a ? (t.n8a.pass ? 'N8-a' : `N8-a FAIL ${t.n8a.runs.filter(q => q.pass).length}/${t.n8a.runs.length}`) : 'N8-a ?';
const star = `${t ? t.pass : '?'} + ${f ? f.pass : '?'} (+ ${n8})`;
const starOk = t && t.pass === 84 && t.total === 84 && f && f.pass === 8 && f.total === 8 && f.control && f.control.fails === f.control.runs && t.n8a && t.n8a.pass;
parts.push(`star "${star}"${starOk ? '' : ` [touch ${t ? t.pass + '/' + t.total : 'missing'}, flip ${f ? f.pass + '/' + f.total + ', control fails ' + (f.control && f.control.fails) + '/' + (f.control && f.control.runs) : 'missing'}]`}`);
if (!starOk) fails.push('star');
parts.push(`vtest ${v ? v.pass + '/' + v.total : 'missing'}`); if (!ok(v)) fails.push('vtest');
const po = p && p.tally ? Object.values(p.tally) : []; const poOk = ok(p) && po.length === 2 && po.every(n => n === 20);
parts.push(`popup-open ${po.length ? po.map(n => n + '/20').join(' + ') : 'missing'}`); if (!poOk) fails.push('popup-open');
parts.push(`dust ${d ? d.overFrames : '?'} frames (${d ? d.runs : '?'} runs, lift->move <=${d ? Math.round(d.worstLiftMs) : '?'}ms)`); if (!ok(d) || !d || d.overFrames !== 0) fails.push('dust');
const hs = r && r.heights ? r.heights.map(h => h.toFixed(2)).join(',') : '?';
parts.push(`rows ${hs}px`); if (!ok(r)) fails.push('rows');
parts.push(`curve8 row ${c ? c.summary.row : '?'}, highlighted ${c ? c.summary.highlighted : '?'}, popup ${c ? c.summary.popup : '?'}`); if (!ok(c)) fails.push('curve8');
parts.push(`delete-slop ${x ? x.pass + '/' + x.total : 'missing'}`); if (!ok(x)) fails.push('delete-slop');
// plan rows (Plans stop rows): reported when run; a page without Plans has nothing to run it on
if (pl) { parts.push(`plan-rows ${pl.pass}/${pl.total}`); if (!ok(pl)) fails.push('plan-rows'); }
if (pu) { parts.push(`places-ux ${pu.pass}/${pu.total}`); if (!ok(pu)) fails.push('places-ux'); }
console.log('GATE ' + parts.join(' · '));
console.log(fails.length ? `GATE FAILED: ${fails.join(', ')}` : 'GATE PASSED');
for (const s of [t, f, v, p, d, r, c, x, pl, pu].filter(Boolean)) { const bad = s.results.filter(q => !q.pass); if (bad.length) console.log(`  ${s.suite}: ${bad.map(q => `[${q.mode}] ${q.name.slice(0, 110)}`).join('\n  ' + ' '.repeat(s.suite.length + 2))}`); }
process.exitCode = fails.length ? 1 : 0;
