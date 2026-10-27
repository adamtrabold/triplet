// THE SYSTEM, the checks. Every decision point that can be measured is measured on every built size; a failure blocks
// publishing (system.js check exits 1). The rest print as eye checks. Results: svg/system/check.json.
'use strict';
const fs = require('fs'), path = require('path');
const S = require('./system.js'), OS = require('./one-side.js'), pf = require('./pixel-fit.js');
const fair = require('./fair-check.js'), join = require('./join-check.js'), { diff, readD } = require('./system-diff.js');
const ROOT = path.join(__dirname, '..');
const paper = require(path.join(process.env.TOOLS, 'node_modules/paper/dist/paper-core.js'));
paper.setup(new paper.Size(100, 100));
const V264 = id => readD(path.join(ROOT, 'svg', 'system', 'v264', `${id}.svg`));
const box = d => { const it = new paper.CompoundPath(d), b = it.bounds; it.remove(); return { x0: b.x, x1: b.x + b.width, y0: b.y, y1: b.y + b.height, w: b.width, h: b.height, cx: b.x + b.width / 2 }; };
// solids and gaps across each axis: an edge where ink starts, paired with the next edge where it ends (overlapping runs)
function spans(d, ax, inBand) {
  const E = pf.findEdges(d)[ax].filter(e => e.kind === 'straight' && inBand(e)).sort((a, b) => a.pos - b.pos), out = [];
  for (const a of E) {
    const b = E.find(e => e.pos > a.pos + 1e-6 && e.ink === -a.ink && Math.min(e.hi, a.hi) - Math.max(e.lo, a.lo) > 0.2);
    if (b) out.push({ kind: a.ink > 0 ? 'solid' : 'gap', a: a.pos, b: b.pos, w: b.pos - a.pos });
  }
  return out;
}
const near = (a, b, t) => Math.abs(a - b) <= t;

function checkOne(size, id, B) {
  const Z = S.SIZES[size], frame = (B.meta && B.meta.frame) || Z.frame, k = frame / 24, d = B.d, res = [], px = v => +(v * k).toFixed(3);
  const add = (point, ok, detail) => res.push({ point, ok, detail });
  const bx = box(d), v = box(V264(id));
  // Centring: a symmetric icon is exactly on its centre
  if (B.sym != null) add('Centring', near(bx.cx, 12, 0.02 / k), `centre ${px(bx.cx - 12)}px off`);
  if (id === 'plus') add('+', near(bx.w, bx.h, 0.01), `width ${px(bx.w)} height ${px(bx.h)}`);
  // Snap priority: every outer straight edge on the iPhone grid
  const SE = pf.findEdges(d), straightAt = (ax, pos) => SE[ax].some(e => e.kind === 'straight' && Math.abs(e.pos - pos) < 1e-3);
  // core edges: straight, 3/4 long or more (a curve's extreme and a point's flat ride on the edges either side; they are not snapped)
  const R = OS.report(d, frame, 3, B.sym).filter(r => r.run >= 0.75 && straightAt(r.ax, r.pos)), outer = R.filter(r => r.kind === 'outer'),   // core edges: 3/4 long or more (a point's flat is not an edge)
    off = outer.filter(r => !r.lands), free = R.filter(r => r.kind === 'outer (free post)');
  // a part with both sides outside lands one side (its width places the other): those are counted, not required
  add('Snap priority', off.length === 0, `${outer.length - off.length} of ${outer.length} core outer edges on the iPhone grid; parts with both sides outside: ${free.filter(r => r.lands).length} of ${free.length} sides landed`);
  // Parts that are not strokes: no solid under the size's minimum (at 18, 1 1/4)
  const minPx = (B.meta && B.meta.frame) ? 1.25 : size === 18 ? 1.25 : Math.min(Z.part, Z.stroke) - 0.01, sol = [...spans(d, 'x', () => true), ...spans(d, 'y', () => true)].filter(s => s.kind === 'solid');
  const thin = sol.filter(s => px(s.w) < minPx - 0.02);
  add('Parts that are not strokes', thin.length === 0, thin.length ? `thinnest ${Math.min(...thin.map(s => px(s.w)))}px` : `every straight solid at least ${+minPx.toFixed(2)}px`);
  // The box: never past its v264 size (one iPhone pixel for landing)
  if (id !== 'star' && id !== 'plus') { const out = { left: px(v.x0 - bx.x0), right: px(bx.x1 - v.x1), top: px(v.y0 - bx.y0), bottom: px(bx.y1 - v.y1) }, worst = Math.max(...Object.values(out));
    const txt = `outer edges against v264 at this size: ${Object.entries(out).map(([k_, x]) => `${k_} ${x > 0 ? '+' : ''}${x}`).join(', ')}`, decl0 = S.DECL[id];
    // When rules meet, the box gives way last: a row, comb or protrusion that needs room may pass it by up to one part
    if (worst <= 1 / 3 + 0.01) add('The box', true, txt);
    else if ((decl0.rows || decl0.protrudes) && worst <= Z.part + 0.01) add('The box', true, txt + ' (gives way to the row and the protrusion, as When rules meet sets)');
    else add('The box', false, txt); }
  // Counters and gaps: every counter at least the size's minimum, or closed (12)
  const holes = d.split(/(?=M)/).slice(1).map(box), small = holes.filter(h => Math.min(px(h.w), px(h.h)) < Z.counter - 0.02);
  add('Counters and gaps', small.length === 0, `${holes.length} counters${small.length ? `, ${small.length} under ${+Z.counter.toFixed(2)}px` : ''}`);
  // Same role, same width / Rows / Protrusions, wherever a declaration has a row, a comb or a protrusion
  const decl = S.DECL[id];
  if (decl.rows && decl.rows.tines) {
    const m = B.meta, tines = spans(d, 'x', e => e.lo < 7.6 && e.hi > 7.0).filter(s => s.b <= m.x0 + m.fw + 0.1);
    const tw = tines.filter(s => s.kind === 'solid').map(s => px(s.w)), sw = tines.filter(s => s.kind === 'gap').map(s => px(s.w));
    const all = [...tw, ...sw];
    add('Same role, same width', all.length >= 3 && Math.max(...all) - Math.min(...all) < 0.02, `parts ${tw.join(', ')}; slots ${sw.join(', ')}`);
    // the edge: the outline's right extreme against the knife handle's right side (the handle below the blade)
    const hx = pf.findEdges(d).x.filter(e => e.kind === 'straight' && e.ink === -1 && e.lo < 17 && e.hi > 15.5 && e.pos > m.ks - 0.01).map(e => e.pos);
    const pr = hx.length ? px(bx.x1 - Math.max(...hx)) : px(m.protrude);
    add('Protrusions', pr >= Z.protrude - 0.02, `the edge stands ${pr}px past what it sticks out from (minimum ${+Z.protrude.toFixed(2)})`);
  }
  if (decl.rows && decl.rows.posts) {
    // the row's counters are the holes taller than they are wide; the columns between them are measured hole to hole
    const op = d.split(/(?=M)/).slice(1).map(box).filter(h => h.h > h.w).sort((a, b) => a.x0 - b.x0);
    const gw = op.map(h => px(h.w)), cw = op.slice(1).map((h, i) => px(h.x0 - op[i].x1));
    const sameW = a => a.length < 2 || Math.max(...a) - Math.min(...a) < 0.05;
    add('Same role, same width', sameW(gw) && sameW(cw), `counters ${gw.join(', ')}; columns between them ${cw.join(', ') || 'none'}`);
    add('Rows', op.length + 1 >= 3 && gw.every(g => g >= Z.counter - 0.02), `${op.length + 1} columns, ${op.length} counters (${B.meta.onGrid ? 'on the grid' : 'filling the span'})`);
    const xe = pf.findEdges(d).x.filter(e => e.kind === 'straight' && e.ink === 1), y0 = op.length ? op[0].y0 : 12, y1 = op.length ? op[0].y1 : 14;
    const end = Math.min(...xe.map(e => e.pos)), face = Math.min(...xe.filter(e => e.lo < y1 && e.hi > y0).map(e => e.pos)), over = px(face - end);
    add('Chamfer under an overhang', over >= 0.2, `the beam runs ${over}px past the outer column; the bevel joins them (eye: it reads as a bevel)`);
  }
  // Inner bands: no thicker than the stroke (or closed)
  if (id === 'bar') { const top = d.split(/(?=M)/).slice(1).map(box).sort((a, b) => a.y0 - b.y0)[0];
    add('Inner bands', !top || px(top.h) <= Z.stroke + 0.02, top ? `band ${px(top.h)}px, stroke ${Z.stroke}` : 'closed: the glass reads full'); }
  // Continuous curvature: no more faults than v264's own drawing
  const fNow = fair.check(d).length + join.check(d).length, f264 = fair.check(V264(id)).length + join.check(V264(id)).length;
  add('Continuous curvature', fNow <= f264, `${fNow} curvature faults (v264: ${f264})`);
  // how close to v264 (the 18 is the v264 drawing at 1:1; the others against v264 at their k)
  const h = diff(B.d, V264(id)).hausdorff;
  return { size, id, checks: res, v264: { hausdorffPx: px(h) } };
}
const EYE = ['Every icon the same optical size and weight in the row, at 18 on the phone', 'Vertical centring reads right, per icon',
  'Loosened, humanist curves; flares restrained and sound; no hump or wobble leaving a join', 'The museum reads as a museum, not a bank',
  'The coupe\'s drink reads full', 'The star and + read as the set\'s weight', 'Each size reads as the same icon as the 18'];
function run() {
  const out = { results: [], eye: EYE }; let ok = true;
  for (const size of [18, 24, 12]) for (const id of S.ORDER) {
    const f = path.join(S.OUT, String(size), `${id}.json`); if (!fs.existsSync(f)) continue;
    const r = checkOne(size, id, JSON.parse(fs.readFileSync(f, 'utf8'))); out.results.push(r);
    for (const c of r.checks) { if (!c.ok) ok = false; console.log(`${c.ok ? 'pass' : 'FAIL'}  ${size} ${id.padEnd(10)} ${c.point}: ${c.detail}`); }
    console.log(`      ${size} ${id.padEnd(10)} v264: ${r.v264.hausdorffPx}px at most`);
  }
  for (const e of EYE) console.log('eye   ' + e);
  out.ok = ok; fs.writeFileSync(path.join(S.OUT, 'check.json'), JSON.stringify(out, null, 1));
  console.log(ok ? 'SYSTEM CHECKS PASSED' : 'SYSTEM CHECKS FAILED: not publishable');
  return ok;
}
module.exports = { run, checkOne };
