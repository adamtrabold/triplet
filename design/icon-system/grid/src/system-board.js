// THE SYSTEM, the board: every decision point first, then the test icons as real SVGs at the size the app shows them, v264
// beside, each icon's declaration and its checks. Written from system.js and the build, so it never drifts from them.
//   node system-board.js <out.dc.html> [--local <out.html>]
'use strict';
const fs = require('fs'), path = require('path');
const S = require('./system.js'), { readD } = require('./system-diff.js');
const C = { navy: '#12293F', paper: '#FAF5EA', tile: '#F2EBDD', orange: '#EE7434', deep: '#A8400C', grey: '#5A564C', rule: '#D8CEBA', ink: '#1A1A18' };
const FONT = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&amp;display=swap">';
const W = 1200;
const B = (size, id) => { const f = path.join(S.OUT, String(size), `${id}.json`); return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null; };
const V = id => readD(path.join(S.OUT, 'v264', `${id}.svg`));
const NAME = { cafe: 'Café', bar: 'Bar', museum: 'Museum', nature: 'Nature', restaurant: 'Restaurant', star: 'Star', plus: '+' };
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

// real SVGs: the 18 in its 24 ring, the 24 in its 32 ring, the 12 bare; px = the size it shows at (a larger view is the same SVG)
function badge(d, px, ring, label, scale = 1) {
  const u = ring * 24 / px;   // the ring in the drawing's units
  return `<svg width="${px * scale}" height="${px * scale}" viewBox="0 0 24 24" role="img" aria-label="${label}" style="display:block"><circle cx="12" cy="12" r="${12 - u / 2}" fill="${C.tile}" stroke="${C.navy}" stroke-width="${u}"/><path fill="${C.navy}" fill-rule="evenodd" d="${d}"/></svg>`;
}
const bare = (d, px, label, scale = 1) => `<svg width="${px * scale}" height="${px * scale}" viewBox="0 0 24 24" role="img" aria-label="${label}" style="display:block"><path fill="${C.navy}" fill-rule="evenodd" d="${d}"/></svg>`;
const plusBtn = (d, label) => `<div style="width:60px;height:60px;border-radius:50%;background:${C.orange};position:relative" aria-label="${label}"><div style="position:absolute;left:16px;top:16px">${bare(d, 28, label)}</div></div>`;
const cap = t => `<div style="font-size:12px;color:${C.grey};margin-top:4px;text-align:center;white-space:nowrap">${t}</div>`;
const cell = (inner, t) => `<div style="display:flex;flex-direction:column;align-items:center;justify-content:flex-end">${inner}${cap(t)}</div>`;

function decisions() {
  const groups = S.SETTINGS.map(g => {
    const items = g.items.map(([name, setting, date, by, choices]) => {
      const open = setting === 'open';
      const body = open ? `<span style="color:${C.deep};font-weight:700">Open, yours to set:</span> ${choices.map((c, i) => `(${i + 1}) ${esc(c)}`).join(' ')}` : esc(setting);
      return `<div style="padding:3px 0 4px;border-top:1px solid ${C.rule};font-size:11.5px;line-height:1.25;${open ? `background:#FBE9DD;` : ''}"><b style="color:${C.navy}">${esc(name)}.</b> ${body} <span style="color:${C.grey};font-size:11px;white-space:nowrap">${date}${by === 'designer' ? ' · set by the designer' : ''}</span></div>`;
    }).join('');
    return `<div style="break-inside:avoid;margin:0 0 10px"><div style="font-size:11.5px;letter-spacing:.1em;font-weight:700;color:${C.deep};text-transform:uppercase;margin:0 0 2px">${g.g}</div>${items}</div>`;
  }).join('');
  return `<div style="column-count:3;column-gap:24px">${groups}</div>`;
}

function icons(check) {
  const res = id => (check ? check.results.filter(r => r.id === id) : []);
  const rows = S.ORDER.map(id => {
    const b18 = B(18, id), b24 = B(24, id), b12 = B(12, id), d = S.DECL[id];
    if (!b18) return '';
    const mark = id === 'star' || id === 'plus';
    let set;
    if (id === 'star') set = [cell(bare(V(id), 18, 'Star v264 in the row'), 'v264, 18 box'), cell(bare(b18.d, 18, 'Star, the system'), 'system, 18 box'),
      cell(bare(V(id), 18, 'Star v264, 2x', 2), 'v264, the same SVG 2x'), cell(bare(b18.d, 18, 'Star, the system, 2x', 2), 'system 2x')];
    else if (id === 'plus') set = [cell(plusBtn(V(id), '+ v264'), 'v264 at 14 across'), cell(plusBtn(b18.d, '+ the system'), 'system, 60 button'),
      cell(bare(V(id), 28, '+ v264, 2x', 2), 'v264 2x'), cell(bare(b18.d, 28, '+ the system, 2x', 2), 'system 2x')];
    else set = [cell(badge(V(id), 24, 4 / 3, `${NAME[id]} v264`), 'v264 at 18'), cell(badge(b18.d, 24, 4 / 3, `${NAME[id]} 18`), '18, the master'),
      b24 ? cell(badge(b24.d, 32, 5 / 3, `${NAME[id]} 24`), '24, selected') : cell('<div style="width:32px;height:32px"></div>', '24 building'),
      b12 ? cell(bare(b12.d, 16, `${NAME[id]} 12`), '12, chip') : cell('<div style="width:16px;height:16px"></div>', '12 building'),
      cell(badge(V(id), 24, 4 / 3, `${NAME[id]} v264 2x`, 2), 'v264, the same SVG 2x'), cell(badge(b18.d, 24, 4 / 3, `${NAME[id]} 18 2x`, 2), '18, the same SVG 2x')];
    const r = res(id), fails = r.flatMap(x => x.checks.filter(c => !c.ok).map(c => `${c.point} at ${x.size} (${c.detail})`)), h = r.find(x => x.size === 18);
    const status = check ? (fails.length ? `<span style="color:${C.deep};font-weight:700">Fails:</span> ${esc(fails.join('; '))}` : `<span style="color:#547326;font-weight:700">Every check passes</span> at ${r.map(x => x.size).join(', ')}.`) : '';
    return `<div style="display:grid;grid-template-columns:440px 1fr;gap:18px;padding:6px 0;border-top:1px solid ${C.rule};align-items:end">
<div><div style="font-size:19px;font-weight:700;color:${C.navy}">${NAME[id]}</div><div style="font-size:13px;line-height:1.35;margin-top:3px">${esc(d.roots)}.</div><div style="font-size:12.5px;line-height:1.35;color:${C.grey};margin-top:3px">Joins: ${esc(d.joins)}.</div>
<div style="font-size:12.5px;line-height:1.35;margin-top:5px">${status}${h ? ` <span style="color:${C.grey}">From v264: ${h.v264.hausdorffPx}px at most at 18.</span>` : ''}</div></div>
<div style="display:flex;gap:26px;align-items:flex-end">${set.join('')}</div></div>`;
  }).join('');
  // the row as the app shows it: every badge at 18 side by side, v264 above
  const six = S.ORDER.filter(id => !['star', 'plus'].includes(id));
  const row = (f, t) => `<div style="display:flex;gap:14px;align-items:center"><div style="width:110px;font-size:13px;color:${C.grey}">${t}</div>${six.map(id => f(id)).join('')}</div>`;
  const app = `<div style="display:flex;flex-direction:column;gap:10px;padding:12px 0 6px">${row(id => badge(V(id), 24, 4 / 3, `${NAME[id]} v264`), 'v264')}${row(id => B(18, id) ? badge(B(18, id).d, 24, 4 / 3, `${NAME[id]} 18`) : '', 'the system, 18')}</div>`;
  return { rows, app };
}

function html(check) {
  const { rows, app } = icons(check);
  const eye = check ? check.eye.map(e => `<li>${esc(e)}</li>`).join('') : '';
  return `<div style="width:${W}px;box-sizing:border-box;padding:22px 36px 18px;background:${C.paper};font-family:Archivo,Arial,sans-serif;color:${C.ink}">
<div style="font-size:15px;letter-spacing:.12em;font-weight:700;color:${C.deep};text-transform:uppercase">Icon system</div>
<h1 style="margin:6px 0 6px;font-size:40px;line-height:1.1;color:${C.navy}">The system</h1>
<p style="margin:0 0 14px;font-size:18px;line-height:1.4">Every decision is a setting of the system. The icons below are its test: each is a short declaration, and the system makes the rest. <b>The v264 set regenerates from it exactly</b> (every point identical).</p>
<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${C.grey};text-transform:uppercase;margin:6px 0 8px">1 · The decision points</div>
${decisions()}
<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${C.grey};text-transform:uppercase;margin:10px 0 0">2 · The row, as the app shows it (18 in the 24 ring, true size)</div>
${app}
<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${C.grey};text-transform:uppercase;margin:14px 0 0">3 · The test: each declaration and what the system makes of it</div>
${rows}
<p style="margin:12px 0 0;font-size:14px;line-height:1.45"><b style="color:${C.navy}">Checked by eye, not by code:</b> ${check ? check.eye.map(esc).join('; ') : ''}.</p>
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
