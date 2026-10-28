// THE SYSTEM, the board: what needs the owner first (a few lines), the system in six lines, the row as the app shows it, then each
// icon's declaration beside what the system makes of it (real SVGs at the size the app shows them, v264 beside). Written from
// system.js, the build and the checks, so it never drifts from them. The full register is THE-SYSTEM.md.
//   node system-board.js <out.dc.html> [--local <out.html>]
'use strict';
const fs = require('fs'), path = require('path');
const S = require('./system.js'), { readD } = require('./system-diff.js');
const C = { navy: '#12293F', paper: '#FAF5EA', tile: '#F2EBDD', orange: '#EE7434', deep: '#A8400C', grey: '#5A564C', rule: '#D8CEBA', ink: '#1A1A18', ask: '#FBE9DD', moss: '#547326' };
const FONT = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&amp;display=swap">';
const W = 1200;
const B = (size, id) => { const f = path.join(S.OUT, String(size), `${id}.json`); return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null; };
const V = id => { const f = path.join(S.OUT, 'v264', `${id}.svg`); return fs.existsSync(f) ? readD(f) : null; };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const NAME = id => S.DECL[id].name;

// real SVGs: the 18 in its 24 ring, the 24 in its 32 ring, the 12 bare; a larger view is the same SVG drawn larger, labelled
function badge(d, px, ring, label, scale = 1) {
  const u = ring * 24 / px;
  return `<svg width="${px * scale}" height="${px * scale}" viewBox="0 0 24 24" role="img" aria-label="${esc(label)}" style="display:block"><circle cx="12" cy="12" r="${12 - u / 2}" fill="${C.tile}" stroke="${C.navy}" stroke-width="${u}"/><path fill="${C.navy}" fill-rule="evenodd" d="${d}"/></svg>`;
}
const bare = (d, px, label, scale = 1) => `<svg width="${px * scale}" height="${px * scale}" viewBox="0 0 24 24" role="img" aria-label="${esc(label)}" style="display:block"><path fill="${C.navy}" fill-rule="evenodd" d="${d}"/></svg>`;
const plusBtn = (d, label) => `<div style="width:60px;height:60px;border-radius:50%;background:${C.orange};position:relative" role="img" aria-label="${esc(label)}"><div style="position:absolute;left:16px;top:16px">${bare(d, 28, label)}</div></div>`;
const empty = px => `<div style="width:${px}px;height:${px}px"></div>`;
const cell = (inner, t) => `<div style="display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:4px">${inner}<div style="font-size:12px;color:${C.grey};white-space:nowrap">${t}</div></div>`;
const H2 = t => `<div style="font-size:14px;letter-spacing:.1em;font-weight:700;color:${C.grey};text-transform:uppercase;margin:18px 0 8px">${t}</div>`;

// 1. WHAT NEEDS HIM: the open points, then what the designer set where it was asked for (each his to change)
function needs(check) {
  const open = [], set = [];
  for (const g of S.SETTINGS) for (const [name, setting, , by, choices] of g.items) {
    if (setting === 'open') open.push(`<b>${esc(name)}:</b> ${choices.map((c, i) => `(${i + 1}) ${esc(c)}`).join(' ')}`);
    else if (by === 'designer') set.push(`<b>${esc(name)}:</b> ${esc(setting)}`);
  }
  // what the rules decided that he may want otherwise: a declared count the rule could not keep
  const gave = [];
  if (check) for (const r of check.results) { const b = B(r.size, r.id); if (!b) continue;
    for (const c of [...(b.meta.rows || []), ...(b.meta.combs || [])]) if (c.n !== c.declared) gave.push(`<b>${NAME(r.id)} at ${r.size}:</b> declared ${c.declared}, the room its box leaves (${c.room ?? c.rootSpan}px) holds ${c.n}. Keep ${c.n}, or let the ${r.size} box grow?`); }
  const li = a => a.map(x => `<li style="margin:0 0 4px">${x}</li>`).join('');
  return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
<div style="background:${C.ask};padding:12px 16px;border-radius:6px"><div style="font-weight:700;color:${C.deep};margin-bottom:6px">Yours to decide</div><ul style="margin:0;padding-left:18px;font-size:14px;line-height:1.35">${li([...gave, ...open])}</ul></div>
<div style="background:#fff;padding:12px 16px;border-radius:6px;border:1px solid ${C.rule}"><div style="font-weight:700;color:${C.navy};margin-bottom:6px">Set by the designer, yours to change</div><ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.35">${li(set)}</ul></div></div>`;
}
// 2. THE SYSTEM IN SIX LINES
const RULES = [
  'An icon is a declaration and nothing else: its roots top to bottom, each a kind of root (vessel, loop, cap, slab, post, gable, tiers, row, comb, head, blade) sized as a share of a parent, each meeting the one above it: rests on (a cut), into (a fillet), held under an overhang (a chamfer), on a wall (one tangent curve), stacked (notched).',
  'The box: fitted to its class (wide, square, tall) by the sides that scale; never more than one iPhone pixel past its v264 size.',
  'The grid: straight widths and overhangs land on the iPhone pixel before anything is drawn on them; the roots land silhouette first; a row or a comb lands as one, its parts and gaps equal.',
  'Rows and combs: parts at the size\'s part width, gaps equal and at least the counter minimum; parts thin before a part is lost.',
  'Machined: every round is a cutter from the rack (1/8, 1/4, 1/2px at 18, scaled at 24 and 12); a post under an overhang meets it with a 45° chamfer, its edges broken; a post into a face with the 1/2 fillet; tips broken by their edge.',
  'Curvature continuous through every join. Every check runs on every size and a failure blocks publishing.',
];
function icons(check) {
  const res = id => (check ? check.results.filter(r => r.id === id) : []);
  return S.ORDER.map(id => {
    const d = S.DECL[id], b18 = B(18, id); if (!b18) return '';
    const mark = !!S.MARK[d.cls], v = V(id), n = NAME(id);
    let set;
    if (d.cls === 'outline') set = [v ? cell(bare(v, 18, `${n} v264`), 'v264, 18 box') : '', cell(bare(b18.d, 18, `${n}, the system`), 'system, 18 box'), cell(bare(b18.d, 18, `${n}, the system, 3x`, 3), 'the same SVG 3x')];
    else if (d.cls === 'open') set = [v ? cell(plusBtn(v, `${n} v264`), 'v264') : '', cell(plusBtn(b18.d, `${n}, the system`), 'system, 60 button'), cell(bare(b18.d, 28, `${n}, the system, 2x`, 2), 'the same SVG 2x')];
    else { const b24 = B(24, id), b12 = B(12, id);
      set = [v ? cell(badge(v, 24, 4 / 3, `${n} v264`), 'v264 at 18') : cell(empty(24), 'new'), cell(badge(b18.d, 24, 4 / 3, `${n} 18`), '18, the master'),
        cell(b24 ? badge(b24.d, 32, 5 / 3, `${n} 24`) : empty(32), '24, selected'), cell(b12 ? bare(b12.d, 16, `${n} 12`) : empty(16), '12, chip'),
        v ? cell(badge(v, 24, 4 / 3, `${n} v264, 3x`, 3), 'v264, 3x') : '', cell(badge(b18.d, 24, 4 / 3, `${n} 18, 3x`, 3), '18, the same SVG 3x')]; }
    const r = res(id), fails = r.flatMap(x => x.checks.filter(c => !c.ok).map(c => `${c.point} at ${x.size}`)), h = r.find(x => x.size === 18);
    const status = !check ? '' : fails.length ? `<span style="color:${C.deep};font-weight:700">Fails: ${esc(fails.join('; '))}</span>` : `<span style="color:${C.moss};font-weight:700">Every check passes</span> (${r.map(x => x.size).join(', ')})`;
    const dist = h && h.v264 ? ` · ${h.v264.hausdorffPx}px from v264 at 18 at most` : v ? '' : ' · new: built from its declaration with no new code';
    return `<div style="display:grid;grid-template-columns:420px 1fr;gap:22px;padding:10px 0;border-top:1px solid ${C.rule};align-items:center">
<div><div style="font-size:18px;font-weight:700;color:${C.navy}">${esc(n)} <span style="font-weight:400;font-size:13px;color:${C.grey}">${esc(d.cls)}</span></div>
<div style="font-size:12.5px;line-height:1.35;margin-top:3px;font-family:ui-monospace,Menlo,monospace;color:${C.ink}">${esc(S.words(d))}</div>
<div style="font-size:12.5px;line-height:1.35;margin-top:5px">${status}<span style="color:${C.grey}">${dist}</span></div></div>
<div style="display:flex;gap:22px;align-items:flex-end">${set.join('')}</div></div>`;
  }).join('');
}
function row() {
  const ids = S.ORDER.filter(id => !S.MARK[S.DECL[id].cls]);
  const line = (f, t) => `<div style="display:flex;gap:14px;align-items:center"><div style="width:120px;font-size:13px;color:${C.grey}">${t}</div>${ids.map(f).join('')}</div>`;
  return `<div style="display:flex;flex-direction:column;gap:10px">${line(id => V(id) ? badge(V(id), 24, 4 / 3, `${NAME(id)} v264`) : empty(24), 'v264')}${line(id => B(18, id) ? badge(B(18, id).d, 24, 4 / 3, `${NAME(id)} 18`) : empty(24), 'the system, 18')}</div>`;
}
function html(check) {
  return `<div style="width:${W}px;box-sizing:border-box;padding:22px 36px 22px;background:${C.paper};font-family:Archivo,Arial,sans-serif;color:${C.ink}">
<div style="font-size:14px;letter-spacing:.12em;font-weight:700;color:${C.deep};text-transform:uppercase">Icon system</div>
<h1 style="margin:4px 0 4px;font-size:38px;line-height:1.1;color:${C.navy}">The system</h1>
<p style="margin:0 0 4px;font-size:17px;line-height:1.4">Each icon below is made by the system from its declaration alone. ${check ? (check.ok ? `<b style="color:${C.moss}">Every check passes on every size.</b>` : `<b style="color:${C.deep}">Checks fail: not ready.</b>`) : ''}</p>
${H2('1 · Needs you')}${needs(check)}
${H2('2 · The system, in six lines')}<ol style="margin:0;padding-left:20px;font-size:14px;line-height:1.4">${RULES.map(r => `<li style="margin:0 0 3px">${esc(r)}</li>`).join('')}</ol>
<div style="font-size:13px;color:${C.grey};margin-top:6px">Every setting, with its date, is in THE-SYSTEM.md.</div>
${H2('3 · The row, as the app shows it (18 in the 24 ring, true size)')}${row()}
${H2('4 · Each declaration, and what the system makes of it')}${icons(check)}
<p style="margin:12px 0 0;font-size:13.5px;line-height:1.45"><b style="color:${C.navy}">Checked by eye:</b> ${check ? check.eye.map(esc).join('; ') : ''}.</p>
</div>`;
}
function dc(body, h) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>The system</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
${FONT}
<style>
body{margin:0}
</style>
</helmet>
${body}
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":${W},"height":${h}}}'>
class Component extends DCLogic {
renderVals() { return {}; }
}
</script>
</body>
</html>
`;
}
module.exports = { html, dc };
if (require.main === module) {
  const a = process.argv.slice(2), cf = path.join(S.OUT, 'check.json'), check = fs.existsSync(cf) ? JSON.parse(fs.readFileSync(cf, 'utf8')) : null;
  const body = html(check), h = +(process.env.BOARD_H || 2400);
  if (a[0] && a[0] !== '--local') fs.writeFileSync(a[0], dc(body, h));
  const li = a.indexOf('--local'); if (li >= 0) fs.writeFileSync(a[li + 1], `<!doctype html><html><head><meta charset="utf-8">${FONT}<style>body{margin:0;background:#ddd}</style></head><body>${body}</body></html>`);
}
