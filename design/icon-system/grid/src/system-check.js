// THE SYSTEM, the checks. Every decision point that can be measured is measured on every built size; a failure blocks
// publishing (system.js check exits 1). The rest print as eye checks. Results: svg/system/check.json.
// No check names an icon: each reads what the build recorded (the rows, combs, bands, protrusions and chamfers its declaration
// made, the class) and measures the finished outline.
'use strict';
const fs = require('fs'), path = require('path');
const S = require('./system.js'), OS = require('./one-side.js'), pf = require('./pixel-fit.js');
const fair = require('./fair-check.js'), join = require('./join-check.js'), { diff, readD } = require('./system-diff.js');
const ROOT = path.join(__dirname, '..');
const paper = require(path.join(process.env.TOOLS, 'node_modules/paper/dist/paper-core.js'));
paper.setup(new paper.Size(100, 100));
const V264 = id => { const f = path.join(ROOT, 'svg', 'system', 'v264', `${id}.svg`); return fs.existsSync(f) ? readD(f) : null; };
const box = d => { const it = new paper.CompoundPath(d), b = it.bounds; it.remove(); return { x0: b.x, x1: b.x + b.width, y0: b.y, y1: b.y + b.height, w: b.width, h: b.height, cx: b.x + b.width / 2 }; };
// solids and gaps across an axis: an edge where ink starts, paired with the next edge where it ends (overlapping runs)
function spans(d, ax, inBand) {
  const E = pf.findEdges(d)[ax].filter(e => e.kind === 'straight' && inBand(e)).sort((a, b) => a.pos - b.pos), out = [];
  for (const a of E) {
    const b = E.find(e => e.pos > a.pos + 1e-6 && e.ink === -a.ink && Math.min(e.hi, a.hi) - Math.max(e.lo, a.lo) > 0.2);
    if (b) out.push({ kind: a.ink > 0 ? 'solid' : 'gap', a: a.pos, b: b.pos, w: b.pos - a.pos });
  }
  return out;
}
const near = (a, b, t) => Math.abs(a - b) <= t;
const holesOf = d => d.split(/(?=M)/).slice(1).map(box);
const sameW = a => a.length < 2 || Math.max(...a) - Math.min(...a) < 0.05;

function checkOne(size, id, B) {
  const Z = S.SIZES[size], decl = S.DECL[id], frame = (B.meta && B.meta.frame) || Z.frame, k = frame / 24, d = B.d, res = [], px = v => +(v * k).toFixed(3);
  const add = (point, ok, detail) => res.push({ point, ok, detail }), mark = !!S.MARK[decl.cls], M = B.meta || {};
  const bx = box(d), v = V264(id) ? S.v264Box(id, size) : null;
  // Centring: a symmetric icon is exactly on its centre
  if (B.sym != null) add('Centring', near(bx.cx, 12, 0.02 / k), `centre ${px(bx.cx - 12)}px off`);
  if (decl.cls === 'open') add('Line marks', near(bx.w, bx.h, 0.01), `width ${px(bx.w)} height ${px(bx.h)}`);
  // Snap priority: every core outer straight edge on the iPhone grid
  const SE = pf.findEdges(d), straightAt = (ax, pos) => SE[ax].some(e => e.kind === 'straight' && Math.abs(e.pos - pos) < 1e-3);
  const R = OS.report(d, frame, 3, B.sym).filter(r => r.run >= 0.75 && straightAt(r.ax, r.pos)), outer = R.filter(r => r.kind === 'outer'),
    free = R.filter(r => r.kind === 'outer (free post)'), sw = mark ? null : Z.stroke / Z.k,
    // a solid one stroke thick with both faces outside lands one face; the other is the stroke's side (Stroke at 18: half an iPhone
    // pixel soft), as a free post's is
    strokeSide = r => sw != null && SE[r.ax].some(e => e.kind === 'straight' && Math.abs(Math.abs(e.pos - r.pos) - sw) < 0.02 && OS.report(d, frame, 3, B.sym).some(q => q.ax === r.ax && Math.abs(q.pos - e.pos) < 1e-3 && q.lands)),
    off = outer.filter(r => !r.lands && !strokeSide(r));
  add('Snap priority', off.length === 0, `${outer.length - off.length} of ${outer.length} core outer edges on the iPhone grid; parts with both sides outside: ${free.filter(r => r.lands).length} of ${free.length} sides landed`);
  // Parts that are not strokes: no straight solid under the size's thinnest
  const minPx = mark || size === 18 ? 1.25 : Z.min, sol = [...spans(d, 'x', () => true), ...spans(d, 'y', () => true)].filter(s => s.kind === 'solid');
  const thin = sol.filter(s => px(s.w) < minPx - 0.02);
  add('Parts that are not strokes', thin.length === 0, thin.length ? `thinnest ${Math.min(...thin.map(s => px(s.w)))}px` : `every straight solid at least ${+minPx.toFixed(2)}px`);
  // The box: one rule for every icon: never past its v264 size by more than one iPhone pixel a side
  if (!mark && v) { const o = { left: px(v.x0 - bx.x0), right: px(bx.x1 - v.x1), top: px(v.y0 - bx.y0), bottom: px(bx.y1 - v.y1) }, worst = Math.max(...Object.values(o));
    add('The box', worst <= 1 / 3 + 0.01, `outer edges against v264 landed at this size: ${Object.entries(o).map(([k_, x]) => `${k_} ${x > 0 ? '+' : ''}${x}`).join(', ')}`); }
  // Counters and gaps: every counter at least the size's minimum, or closed (12)
  const holes = holesOf(d), small = holes.filter(h => Math.min(px(h.w), px(h.h)) < Z.counter - 0.02);
  add('Counters and gaps', small.length === 0, `${holes.length} counters${small.length ? `, ${small.length} under ${+Z.counter.toFixed(2)}px` : ''}`);
  // ROWS (from the declaration): the row reads as its count (its counters measured), counters and columns each one width
  for (const rw of M.rows || []) {
    // a closed row (a slab under it too): its counters are the holes as tall as the row; an open row: the parts measured across its foot
    if (!rw.closed) { const yF = bx.y1 - 0.4 / k, parts = spans(d, 'x', e => e.lo < yF && e.hi > yF).filter(s_ => s_.kind === 'solid');
      add('Rows', parts.length === rw.n, `${parts.length} parts measured across the foot; declared ${rw.declared}`);
      add('Same role, same width', sameW(parts.map(s_ => px(s_.w))), `parts ${parts.map(s_ => px(s_.w)).join(', ')}`); continue; }
    const op = holes.filter(h => Math.abs(px(h.h) - rw.hPx) < 0.8).sort((a, b) => a.x0 - b.x0);
    const gw = op.map(h => px(h.w)), cw = op.slice(1).map((h, i) => px(h.x0 - op[i].x1));
    add('Rows', op.length === rw.n - 1 && gw.every(g => g >= Z.counter - 0.02), `${op.length + 1} parts and ${op.length} counters measured; declared ${rw.declared}${rw.n !== rw.declared ? `, the rule gave ${rw.n}` : ''} (${rw.onGrid ? 'gaps on the grid' : 'gaps filling the span'}${rw.thinned ? `, parts thinned to ${rw.w}px` : ''})`);
    add('Same role, same width', sameW(gw) && sameW(cw), `counters ${gw.join(', ')}; parts between them ${cw.join(', ') || 'none'}`);
    // the chamfer: the slab runs past the outer post (measured on the outline), the bevel joins them
    const xe = SE.x.filter(e => e.kind === 'straight' && e.ink === 1), y0 = op.length ? op[0].y0 : 12, y1 = op.length ? op[0].y1 : 14;
    const end = Math.min(...xe.map(e => e.pos)), face = Math.min(...xe.filter(e => e.lo < y1 && e.hi > y0).map(e => e.pos)), over = px(face - end);
    add('Chamfer under an overhang', over >= 0.3, `the slab runs ${over}px past the outer post; the bevel joins them`);
  }
  // COMBS: parts and slots one width (measured across the comb's band of the outline: the tines' middle)
  for (const cb of M.combs || []) {
    const op = spans(d, 'y', () => true), top = bx.y0, yMid = top + 1.2 / k;
    const row = spans(d, 'x', e => e.lo < yMid && e.hi > yMid).filter(s => s.a < bx.x0 + cb.span / k + 0.2 + (bx.x0 - bx.x0));
    const tines = row.filter(s => s.b <= bx.x0 + cb.span / k + 0.05), tw = tines.filter(s => s.kind === 'solid').map(s => px(s.w)), sw = tines.filter(s => s.kind === 'gap').map(s => px(s.w));
    add('Combs', tw.length === cb.n, `${tw.length} parts measured; declared ${cb.declared}${cb.n !== cb.declared ? `, the rule gave ${cb.n} (the room the box leaves: ${cb.room}px)` : ''}${cb.thinned ? `, parts and slots thinned to ${cb.w}px to keep the count` : ''}`);
    add('Same role, same width', [...tw, ...sw].length >= 3 && sameW([...tw, ...sw]), `parts ${tw.join(', ')}; slots ${sw.join(', ')}`);
  }
  // COMB DEPTH: what is left under the slots is one line
  for (const cb of M.combs || []) if (cb.bridge != null) add('Comb depth', Math.abs(cb.bridge - Z.stroke) < 0.02, `slots ${cb.slotDepth}px deep (${cb.past}px into the root); left under the outer slots: ${cb.bridge}px, the line ${Z.stroke}px`);
  // POINTS: every apex's crest reads a fifth of the line on screen
  if (M.apex) { const want = (mark ? 1.5 : Z.stroke) / 5; add('Points', M.apex.crestPx != null && M.apex.crestPx >= 0.9 * want - 0.005, `${M.apex.n} apex corner${M.apex.n > 1 ? 's' : ''}: crest ${M.apex.crestPx}px on screen, a fifth of the line ${+want.toFixed(3)}px${M.apex.scale !== 1 ? ` (round x${M.apex.scale})` : ' (as drawn)'}`); }
  // PROTRUSIONS: the outline's extreme past the nearest long straight face under it
  for (const pr of M.protrusions || []) {
    const faces = SE.x.filter(e => e.kind === 'straight' && e.ink === -1 && e.hi - e.lo >= 2).map(e => e.pos), face = faces.length ? Math.max(...faces) : bx.x1, p = px(bx.x1 - face);
    add('Protrusions', p >= Z.protrude - 0.02, `stands ${p}px past what it sticks out from (minimum ${+Z.protrude.toFixed(2)})`);
  }
  // INNER BANDS: no thicker than the stroke (or closed: the fill reads full)
  for (const bd of M.bands || []) { const top = holes.sort((a, b) => a.y0 - b.y0)[0];
    add('Inner bands', !top || px(top.h) <= Z.stroke + 0.02, top ? `band ${px(top.h)}px, stroke ${Z.stroke}` : 'closed: the fill reads full'); }
  // Continuous curvature: no more faults than v264's own drawing (none for a new icon)
  const fNow = fair.check(d).length + join.check(d).length, f264 = v ? fair.check(V264(id)).length + join.check(V264(id)).length : 0;
  add('Continuous curvature', fNow <= f264, `${fNow} curvature faults (${v ? `v264: ${f264}` : 'none allowed'})`);
  return { size, id, checks: res, v264: v ? { hausdorffPx: px(diff(B.d, V264(id)).hausdorff) } : null };
}
const EYE = ['Every icon the same optical size and weight in the row, at 18 on the phone', 'Vertical centring reads right, per icon',
  'Loosened, humanist curves; flares restrained and sound; no hump or wobble leaving a join', 'The museum reads as a museum, not a bank; its bevel reads as a bevel',
  'The coupe\'s drink reads full', 'The star and + read as the set\'s weight', 'Each size reads as the same icon as the 18'];
function run(ids = S.ORDER) {
  const out = { results: [], eye: EYE }; let ok = true;
  for (const size of [18, 24, 12]) for (const id of ids) {
    const f = path.join(S.OUT, String(size), `${id}.json`); if (!fs.existsSync(f)) continue;
    const r = checkOne(size, id, JSON.parse(fs.readFileSync(f, 'utf8'))); out.results.push(r);
    for (const c of r.checks) { if (!c.ok) ok = false; console.log(`${c.ok ? 'pass' : 'FAIL'}  ${size} ${id.padEnd(10)} ${c.point}: ${c.detail}`); }
    if (r.v264) console.log(`      ${size} ${id.padEnd(10)} v264: ${r.v264.hausdorffPx}px at most`);
  }
  for (const e of EYE) console.log('eye   ' + e);
  out.ok = ok; fs.writeFileSync(path.join(S.OUT, 'check.json'), JSON.stringify(out, null, 1));
  console.log(ok ? 'SYSTEM CHECKS PASSED' : 'SYSTEM CHECKS FAILED: not publishable');
  return ok;
}
module.exports = { run, checkOne };
