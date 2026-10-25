// g7bc: the Between board's section "Blind test, round 2: a bag and a heart from the spec", built from svg/blind2/construction.json
// (src/picks-blind2.js), svg/blind2/checks.json (src/blind2-checks.js), svg/g7/jitter/{bag,heart,heart-on}.json and the six's r3 svgs.
//   node blind2-board.js <out.html>     -> the section's HTML fragment (inserted above round 1 on the board)
'use strict';
const fs = require('fs'), path = require('path');
const G = path.join(__dirname, '..');
const d = f => fs.readFileSync(path.join(G, f), 'utf8').match(/ d="([^"]+)"/)[1];
const J = JSON.parse(fs.readFileSync(path.join(G, 'svg/blind2/construction.json'), 'utf8'));
const CK = JSON.parse(fs.readFileSync(path.join(G, 'svg/blind2/checks.json'), 'utf8'));
const jit = id => { const f = path.join(G, 'svg/g7/jitter', id + '.json'); return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null; };
const INK = '#12293F', PAPER = '#F2EBDD', OR = '#EE7434', ORD = '#A8400C', MUTE = '#5A564C', HAIR = '#D8CEBA';
const six = ['cafe', 'bar', 'museum', 'nature'].map(id => d(`svg/g7/between/${id}-r3.svg`));
const star = d('svg/g7/between/star-r3.svg'), plus = d('svg/g7/between/plus-r3.svg');
const bag = J.bag.d, heart = J.heart.d, heartOn = J['heart-on'].d;
const badge = (p, px) => `<svg width="${px}" height="${px}" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11.25" fill="${PAPER}" stroke="${INK}" stroke-width="1.5"/><path d="${p}" fill="${INK}"/></svg>`;
const mark = (p, px, col = INK) => `<svg width="${px}" height="${px}" viewBox="0 0 24 24" aria-hidden="true"><path d="${p}" fill="${col}"/></svg>`;
const lab = (t, w = 70) => `<span style="width:${w}px;font-size:14px;line-height:1.2;color:${MUTE}">${t}</span>`;
const flex = (inner, gap = 8) => `<div style="display:flex;gap:${gap}px;align-items:center;flex-wrap:wrap;margin:8px 0">${inner}</div>`;
const P = t => `<p style="margin:0 0 12px;font-size:19px;line-height:1.45">${t}</p>`;
const H = t => `<div style="font-size:19px;font-weight:700;color:${INK};margin:18px 0 6px">${t}</div>`;
const shaped = [...six, bag], newMark = (html) => `<span style="display:inline-flex;align-items:center;gap:8px;padding:2px 6px;outline:1px dashed ${OR};outline-offset:2px">${html}</span>`;

// ---- the row
const rowSec = `<div style="padding:12px 0;border-top:1px solid ${HAIR}">${H('In the row: 12px chip, 24px badge, the + and the star and the heart at their slots; then 72px')}
${flex(lab('12 chip') + shaped.slice(0, 4).map(p => badge(p, 12)).join('') + newMark(badge(bag, 12)))}
${flex(lab('24 badge') + shaped.slice(0, 4).map(p => badge(p, 24)).join('') + newMark(badge(bag, 24)) + mark(plus, 26.4) + mark(star, 20) + newMark(mark(heart, 20) + mark(heartOn, 20, OR)))}
${flex(lab('72') + shaped.slice(0, 4).map(p => badge(p, 72)).join('') + newMark(badge(bag, 72)))}
${flex(lab('3x slot') + mark(star, 60) + newMark(mark(heart, 60) + mark(heartOn, 60, OR)) + mark(plus, 79.2))}
<div style="font-size:15px;color:${MUTE}">Dashed orange: the two new icons. The heart off (navy outline) and on (filled, in the star's orange), at the row star's 20px slot.</div></div>`;

// ---- in context: list rows (the board's own row), the heart as the row's toggle
const lrow = (p, name, kind, tog) => `<div style="display:flex;align-items:center;gap:10px;height:56px;background:${PAPER};padding:0 10px;border-bottom:1px solid ${HAIR};width:300px;box-sizing:border-box">${badge(p, 24)}<div style="flex:1;font-size:16px;font-weight:600;line-height:1.15">${name}<div style="font-size:10.5px;letter-spacing:.08em;font-weight:700;opacity:.72;margin-top:2px">${kind}</div></div>${tog || ''}</div>`;
const ctx = `<div style="padding:12px 0;border-top:1px solid ${HAIR}">${H('In context: list rows at true size, the heart where a row toggle sits')}
<div style="display:flex;gap:18px;flex-wrap:wrap"><div>${lrow(six[0], 'Kaffeverket', 'CAFÉ · STOCKHOLM', mark(heart, 20))}${lrow(bag, 'Svensk Hemslöjd', 'SHOP · STOCKHOLM', mark(heartOn, 20, OR))}${lrow(six[2], 'Vasa Museum', 'MUSEUM · STOCKHOLM', mark(star, 20))}${lrow(bag, 'Kronans Droghandel', 'SHOP · STOCKHOLM', mark(heart, 20))}${lrow(six[3], 'Djurgården', 'NATURE · STOCKHOLM')}</div></div></div>`;

// ---- construction sheets (12px a unit of the 24 grid; the heart's box is its 20px slot's)
const K = 12, C = { 'mass corner': OR, 'cut end': '#2E7D6B', 'join / notch': '#7A2436', 'counter corner (join round)': '#3B6EA5' };
function grid(n = 24) { let s = ''; for (let i = 0; i <= n; i++) { const w = i % 12 === 0 ? 0.08 : 0.03; s += `<line x1="${i}" y1="0" x2="${i}" y2="${n}" stroke="#B9AE98" stroke-width="${w}"/><line x1="0" y1="${i}" x2="${n}" y2="${i}" stroke="#B9AE98" stroke-width="${w}"/>`; } return s; }
function sheetBag() {
  const b = J.bag, [kw, bh] = b.cut, cx = b.sym, cyC = 12;
  const roots = b.parts.map((p, i) => `<path d="${p}" fill="none" stroke="${b.prims[i].cut ? OR : ORD}" stroke-width="0.07" stroke-dasharray="${b.prims[i].cut ? '0.25 0.15' : ''}"/>`).join('');
  const circ = b.prims.filter(q => q.root === 'LOOP' || q.root === 'CIRCLE').length;
  const loopP = b.prims.find(q => q.root === 'LOOP'), holeP = b.prims.find(q => q.root === 'CIRCLE');
  const corners = b.laws.map(l => `<circle cx="${l.pt[0]}" cy="${l.pt[1]}" r="${Math.max(0.12, l.r)}" fill="none" stroke="${C[l.why] || INK}" stroke-width="0.09"/>`).join('');
  return `<svg width="${24 * K}" height="${24 * K}" viewBox="0 0 24 24" style="background:#FFFDF8">${grid()}
<rect x="${12 - kw / 2}" y="${12 - bh / 2}" width="${kw}" height="${bh}" fill="none" stroke="${OR}" stroke-width="0.06" stroke-dasharray="0.4 0.2"/>
<path d="${b.d}" fill="${INK}" fill-opacity="0.18"/>${roots}
<line x1="${cx}" y1="1" x2="${cx}" y2="23" stroke="${ORD}" stroke-width="0.05" stroke-dasharray="0.5 0.3"/>${corners}
<circle cx="12" cy="12" r="0.25" fill="none" stroke="${OR}" stroke-width="0.08"/></svg>`;
}
function sheetHeart() {
  const h = J.heart, k = h.k;
  const roots = h.parts.map((p, i) => `<path d="${p}" fill="none" stroke="${h.prims[i].cut ? OR : ORD}" stroke-width="0.08" stroke-dasharray="${h.prims[i].cut ? '0.25 0.15' : ''}"/>`).join('');
  const seen = new Set(), corners = h.laws.filter(l => { const key = l.pt.map(v => v.toFixed(2)).join(); if (seen.has(key)) return false; seen.add(key); return true; })
    .map(l => `<circle cx="${l.pt[0]}" cy="${l.pt[1]}" r="${Math.max(0.15, l.r)}" fill="none" stroke="${l.hole ? '#3B6EA5' : l.convex ? OR : '#7A2436'}" stroke-width="0.1"/>`).join('');
  const cut = 14.07 * k;
  // the roots are drawn before the centring move (dy); the glyph after it: shift the roots by dy so they sit on it
  return `<svg width="${24 * K}" height="${24 * K}" viewBox="0 0 24 24" style="background:#FFFDF8">${grid()}
<rect x="${12 - cut / 2}" y="${12 - cut / 2}" width="${cut}" height="${cut}" fill="none" stroke="${OR}" stroke-width="0.06" stroke-dasharray="0.4 0.2"/>
<path d="${h.d}" fill="${INK}" fill-opacity="0.18"/><g transform="translate(0 ${h.dy})">${roots}${corners}</g>
<line x1="12" y1="1" x2="12" y2="23" stroke="${ORD}" stroke-width="0.05" stroke-dasharray="0.5 0.3"/><circle cx="12" cy="12" r="0.25" fill="none" stroke="${OR}" stroke-width="0.08"/></svg>`;
}
const legend = `<div style="font-size:14px;color:${MUTE};line-height:1.5">Brown: a root as drawn; dashed orange: a counter (a cut); dashed orange box: the class's cut; dashed brown: the mirror axis; orange ring: the badge's middle. Circles at corners: the round the engine drew, its radius to scale (orange mass corner or tip, green line end, wine join or notch, blue counter corner). Grid: 1px of the 24 badge (the heart: 1 unit of its own 24 box, shown at 20px, so 1 unit = 0.83px).</div>`;
const b = J.bag, h = J.heart;
const bagNotes = `<ol style="margin:6px 0 0 18px;padding:0;font-size:16px;line-height:1.45">
<li><b>Class: shaped</b>, by rule 15's second line: "If it names what a place is (a category, in the badge ring), it is shaped, a solid mass."</li>
<li><b>Body</b>: a rectangle, a mass (it is the thing; one line thick it would not say bag), the widest root (1). 4/5 as tall as wide.</li>
<li><b>Handle</b>: a loop a line thick (1 1/2px), a half circle on two arms, 3/5 of the body's width outside. Its counter: a circle on the same centre a line less (rule 7), running straight for half a line into the body's top wall (rule 7). Body top on the first lattice line past the arms (rule 10).</li>
<li><b>Size</b>: drawn ${(b.classFrom.ratio).toFixed(2)} wide to tall at its fitted size, so <b>Tall</b>, not Square (the engine re-picked it). Cut ${b.cut[0].toFixed(2)} × ${b.cut[1].toFixed(2)}px; finished ${(b.mFin.box.x1 - b.mFin.box.x0).toFixed(2)} × ${(b.mFin.box.y1 - b.mFin.box.y0).toFixed(2)}px (meets the width).</li>
<li><b>Rounds</b> (the engine's): bottom corners 0.6 (mass corner); <b>top corners 0.3, as line ends</b>, because the handle leaves only ${(16.28 - 14.57).toFixed(2)}px of top edge (gap 3); handle into body 0.15 (join); counter corners 0.15.</li>
<li><b>Centre</b>: mirrored about x = ${b.sym.toFixed(3)}; its box centred on the badge, not lifted (rule 19: its ink sits low, ${(b.mPre.cy - b.mPre.box.cy).toFixed(2)}px under the box centre).</li></ol>`;
const heartNotes = `<ol style="margin:6px 0 0 18px;padding:0;font-size:16px;line-height:1.45">
<li><b>Class: outline</b>, solid when on, by rule 15's first line: "If a tap fills it (a state that toggles: the star, visited), it is an outline, the same shape solid when on."</li>
<li><b>Roots</b>: a square turned 45° and two circles, each as wide as the square's side (1), on the midpoints of its upper sides. Each circle runs into the square's lower sides tangent (rule 6); they meet at the square's top corner, a 90° cleft. One ratio makes the whole outside.</li>
<li><b>Counter</b>: rule 7 per root: the square less a wall on each side, each circle a line less, all on their own centres. This is where it fails (gap 1): the smaller square's side corners poke out past the smaller circles, so the counter has two notches low on the lobes and a V at the top, and the wall runs ${(CK.heart.walls[0].min / 1.2).toFixed(2)} to ${(CK.heart.walls[0].max / 1.2).toFixed(2)}px against the 1 1/2px line.</li>
<li><b>Size</b>: by its outside, to the outline cut, Square (it is 1.11 wide to tall): ${(14.07).toFixed(2)}px across at its 20px slot, ${((h.mFin.box.y1 - h.mFin.box.y0) / h.k).toFixed(2)}px tall. Its counter: each lobe over 5px across, over 2 lines.</li>
<li><b>Rounds</b> (line marks): the point 0.45 (a 90° outside corner is a mass corner, not a tip); the cleft 0.15 (notch); counter corners 0.11 to 0.15.</li>
<li><b>Centre</b>: drawn about its axis, not mirrored (the star's way; gap 8); moved down ${(h.dy / h.k).toFixed(2)}px by rule 19. Ink ${'57.3'}px² on screen against the star's 58.4: the same weight.</li></ol>`;
const cons = `<div style="padding:12px 0;border-top:1px solid ${HAIR}">${H('Construction: roots, proportions, rounds')}
<div style="display:flex;gap:20px;flex-wrap:wrap;align-items:flex-start"><div style="width:300px">${sheetBag()}<div style="font-size:17px;font-weight:700;color:${INK};margin-top:6px">The bag</div>${bagNotes}</div>
<div style="width:300px">${sheetHeart()}<div style="font-size:17px;font-weight:700;color:${INK};margin-top:6px">The heart (off)</div>${heartNotes}</div></div>${legend}</div>`;

// ---- gaps
const GAPS = [
  ['Rule 7, a counter of overlapping roots', 'The rule makes a counter per root ("the same shape on the same centre made smaller", "less a wall on each axis"). That gives an even wall only when the counter is one root (the star, the ear). The heart is three roots overlapping, and the union of the smaller roots is not the heart made smaller: the smaller square\'s side corners stick out past the smaller circles (two notches on the inner lobes) and its top corner makes a V under the cleft. The wall runs 1.49 to 1.73px. Read the other way, "the same shape made smaller" means the heart scaled, which has no even wall either. Drawn per root, as the spec says. A rule that would hold: the counter is the roots that make the outside (circles, lower sides) each moved in a line, and where two outside roots meet in a notch (the cleft) the wall turns on a circle of the line\'s radius about that point. Even walls, all from roots.'],
  ['Rule 4, joins: a loop fixed to a mass', 'The handle is fixed to the body, but it isn\'t a post and holds nothing up, so it isn\'t holds, overhang, rests, base or free. I named no kind, and the engine answered by angle and edge length: a 0.15 join, because the arm is only half a line long. Had the arm been 1 1/2px or longer, the engine would have flared it (0.5) whatever its kind. The cup\'s ear is the same case, and the spec doesn\'t say what kind it is either. The engine picks the treatment by geometry, not by kind, so rule 4\'s "the kind decides" isn\'t what the code does.'],
  ['Rule 17, line end vs mass corner', 'The body is a mass, but its top corners got 0.3 (line end) where its bottom ones got 0.6 (mass corner). The table calls a corner a line end when an edge next to it is 2px or less, and the handle cuts the body\'s top edge down to 1.71px. So a mass corner gets a line end\'s round because of something joined beside it. At 72 the top corners read a touch crisper than the bottom ones.'],
  ['Rule 4, base: a mass that sits on the ground', 'Base covers one support (a cap), two or more posts (a slab) and legs to the ground (none). It doesn\'t cover a mass that sits straight on the ground with no posts (a bag, a suitcase, a box). I drew no base, the body\'s own foot, because nothing in the rule asks for one.'],
  ['Rule 2, a turned root', 'The roots list has "a rectangle (a slab, a mass or a post)". The heart\'s square is turned 45° and isn\'t any of the three, and the spec doesn\'t say whether a root may be turned. I turned it, because the heart\'s two straight sides are that square\'s edges.'],
  ['Rule 15, the heart\'s slot', 'An outline mark is drawn in its own 24 box "at whatever slot the app shows it". No slot is set for a favourite toggle. I chose 20px, the row star\'s, because it is the same job (a toggle on a row).'],
  ['Rule 15, the "on" state', 'The spec says "the same shape solid when on" but not its colour or which column of the round table it takes. I kept the line marks\' column (the same outline) and showed it in the star\'s orange. The colour is a brand call, not mine.'],
  ['Rule 13, the mirror, on an outline mark', 'Rule 13 says a symmetric icon is drawn about its axis and mirrored, and the engine (step 4) mirrors. But construction.js builds the outline marks (the star, the +) without the mirror. I first built the heart mirrored (engine symD, as the shaped six are). That gave KNEE + SHOULDER on the axis at the cleft (off and on) and at the counter\'s bottom V, and the engine crashed outright on a nudged rebuild (symD: "k.segments is not iterable"). Built the star\'s way, unmirrored, it is fair-clean, but it mirrors only to 0.07px (the star is 0.03px off). Shown: unmirrored, the engine\'s own outline path. The spec and the engine disagree, and the mirror breaks where a feature sits on the axis. The bag, a shaped icon, is mirrored as the six are, and the jitter check shows the same seam: 27 of 50 nudged builds put a KINK at the handle\'s crown, on the axis, and move the outline 0.33 to 0.37px there; the rest move 0.03px or less.'],
  ['Rule 20, the fair check on the bag\'s handle', 'JUMP where the handle\'s outer half circle leaves its half-line arm (both sides). The cup\'s loop is eased there ("drawn arcs eased in"); this one isn\'t. Splitting the arc as the cup\'s bottom is split changed nothing (tested). My guess: the arm\'s 3/4px, part of it taken by the join round below, is too short for the ease. Rule 7 gives the counter its half-line run-in and says nothing about the loop\'s outside. Not patched.'],
  ['Weight: a solid mass with no counter', 'The bag is the heaviest icon in the row: 69px² of ink against the museum\'s 63, the cup\'s 57 and the tree\'s 34, all in one block. Nothing in the spec sizes or lightens a shaped icon by weight (the fit is by the cut alone), so a thing that is just a mass comes out darkest. By eye at 24 it reads as a dark tile beside the six.'],
  ['Concept: no rule for "ours" on a plain mass', 'The bag uses none of the five treatments that make the six ours (flare, overhang, cut-free part, cap, tip). Its parts don\'t meet in any of those ways, so the rules never fire. That is round 1\'s "generic" finding again, from the other side. At 12 and 24 it also reads close to a padlock (a block under a loop). That is my concept, not the spec, but the spec gives a designer nothing to push it toward the family.'],
  ['Rule 20, jitter: the engine loses the heart', 'Rebuilt with its size nudged by 0.015px (the square\'s side 9.879 or 9.900 against 9.890), the engine returns an empty outline and the check stops. A sweep of 21 sides from 9.880 to 9.900 lost one (9.888). The cause is probably the three roots meeting tangent (each circle runs into the square\'s sides at a single point, and the smaller roots cross close to tangent too), which the booleans or the corner pass drop. Rule 6 asks for exactly those tangents, so the spec asks for what the engine can\'t build reliably. The heart shown is the build at the solved size, which is whole.'],
];
const gapSec = `<div style="padding:12px 0;border-top:1px solid ${HAIR}">${H('Every spec gap and choice')}
<ol style="margin:0 0 0 20px;padding:0;font-size:17px;line-height:1.45">${GAPS.map(([t, x]) => `<li style="margin-bottom:8px"><b>${t}.</b> ${x}</li>`).join('')}</ol></div>`;

// ---- checks
const HEART_JIT = 'FAILS, can\'t finish: at some nudged sizes the engine returns an empty outline (a nudge of ±0.015px in size: the square\'s side 9.879 or 9.900 against 9.890; a sweep of 21 sides from 9.880 to 9.900 lost 9.888). The run stops at the first one.';
const jl = id => { if (id === 'heart') return HEART_JIT; if (id === 'heart-on') return 'FAILS, can\'t finish: the engine returns an empty outline at some nudged sizes here too, though the single ±0.015px nudges that broke the off heart build whole. The run stops at the first one.'; const r = jit(id); return r ? `${r.ok ? 'holds' : 'FAILS'}: ${r.trials.length} builds, max move ${r.maxMove.toFixed(3)}px (limit 0.05), verdict changes ${r.flips}` : 'not run'; };
const fk = id => CK[id].fair.length ? CK[id].fair.map(x => x.split('@')[0]).join(', ') : 'clean';
const wl = id => CK[id].walls.length ? CK[id].walls.map(w => `${(w.min / (id === 'bag' ? 1 : 1.2)).toFixed(2)} to ${(w.max / (id === 'bag' ? 1 : 1.2)).toFixed(2)}px`).join('; ') : 'no counter';
const td = t => `<td style="padding:6px 8px;border-bottom:1px solid ${HAIR};vertical-align:top">${t}</td>`;
const checks = `<div style="padding:12px 0;border-top:1px solid ${HAIR}">${H('Checks run (rule 20) and results')}
<table style="border-collapse:collapse;font-size:15px;line-height:1.35;width:100%"><tr style="text-align:left;color:${MUTE}">${td('Check')}${td('Bag')}${td('Heart, off')}${td('Heart, on')}</tr>
<tr>${td('Fair check (src/fair-check.js)')}${td(fk('bag'))}${td(fk('heart'))}${td(fk('heart-on'))}</tr>
<tr>${td('Join check (src/join-check.js)')}${td('clean')}${td('clean')}${td('clean')}</tr>
<tr>${td('Jitter check, 50 nudged builds + 3 fixed (src/jitter-check.js)')}${td(jl('bag'))}${td(jl('heart'))}${td(jl('heart-on'))}</tr>
<tr>${td('Walls, line 1 1/2px (src/offset-check.js)')}${td(wl('bag'))}${td(wl('heart'))}${td('no counter')}</tr>
<tr>${td('Counters at least 2 lines (outline marks)')}${td('not asked (shaped); the handle\'s is 2.13px')}${td('each lobe over 5px: passes')}${td('none')}</tr>
<tr>${td('Slivers and symmetry (src/check-svg.py)')}${td('mirrors; the zero-length closing line the six also have')}${td('mirrors to 0.07px (unmirrored, as the star: 0.03px)')}${td('the same')}</tr>
<tr>${td('Rounds table = engine (src/rounds-check.js)')}${td('holds (engine unchanged)')}${td('')}${td('')}</tr>
<tr>${td('By eye at 12, 24, 72, beside the six')}${td('right size; heaviest; reads close to a padlock; no family character')}${td('right size and weight beside the star; counter notches visible at 72')}${td('reads well')}</tr></table></div>`;

const verdict = `<div style="margin:0 0 12px;padding:10px 14px;background:#F2EBDD;font-size:17px;line-height:1.4;color:${INK}"><b>Verdict, by eye before any check: neither landed first time.</b> The heart is right in size and weight beside the star, but its counter, drawn by rule 7 as written, has notches. The bag is the right size, but it is the darkest thing in the row, has none of the family's joins, and at 12px reads close to a padlock. The checks: the bag has a fair-check JUMP at its handle and fails the jitter check (a KINK at its crown, on the mirror axis, in 27 of 50 nudges); the heart is fair-clean only unmirrored (mirrored by rule 13, it KNEEs at the cleft and the engine crashes on a nudge). The rules that failed, in order of cost: rule 7 (counters of overlapping roots), rule 4 (no kind for a fixed loop or a mass on the ground; the engine treats joins by geometry, not kind), rule 17 (line end vs mass corner by edge length), rule 13 vs the engine (the mirror), the engine losing tangent roots under the jitter check, and no weight rule for a plain mass.</div>`;

const html = `<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${MUTE};text-transform:uppercase;margin:30px 0 8px">Blind test, round 2: a bag and a heart from the spec</div>
${P('<b>What this is.</b> A designer who had seen only the Construction board\'s spec, the master grid, the code it names and your taste rules drew two new icons: Shopping, a carrier bag (you: "i think bag is easier to udnerstand at a glance"), and a heart, a favourite toggle that a tap fills. No hand fixes: where a rule gave a bad result it is drawn as the rule says, and the gap is listed. Code: src/picks-blind2.js (values in src/proportions.js, PROP.bag and PROP.heart), checks src/blind2-checks.js, this section src/blind2-board.js; report blind-test-2.md.')}
${verdict}${rowSec}${ctx}${cons}${gapSec}${checks}`;
fs.writeFileSync(process.argv[2] || path.join(G, 'svg/blind2/section.html'), html);
console.log('section', html.length, 'bytes');
