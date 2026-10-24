// The Between board's "Blind test: two new icons from the spec" section, from svg/blind/blind.json (src/blind.js).
//   node blind-board.js  -> svg/blind/section.html (an HTML fragment, inserted at the top of Grid7Between.dc.html)
'use strict';
const fs = require('fs'), path = require('path');
const G = path.join(__dirname, '../svg');
const J = JSON.parse(fs.readFileSync(path.join(G, 'blind/blind.json'), 'utf8'));
const rd = f => fs.readFileSync(path.join(G, f), 'utf8').match(/ d="([^"]+)"/)[1];
const SIX = ['cafe', 'bar', 'museum', 'nature'].map(k => rd(`g7/between/${k}-r3.svg`)), PLUS = rd('g7/between/plus-r3.svg'), STAR = rd('g7/between/star-r3.svg');
const N = '#12293F', PAPER = '#F2EBDD', MUTE = '#5A564C', RULE = '#D8CEBA', OR = '#EE7434', ORD = '#A8400C';
const scallop = fs.readFileSync(path.join(__dirname, '../../../../index.html'), 'utf8').match(/polygon fill='white' points='([^']+)'/)[1];
const f2 = v => +v.toFixed(3);
const badge = (d, px) => `<svg width="${px}" height="${px}" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11.25" fill="${PAPER}" stroke="${N}" stroke-width="1.5"/><path d="${d}" fill="${N}"/></svg>`;
const bare = (d, px, c = N) => `<svg width="${px}" height="${px}" viewBox="0 0 24 24" aria-hidden="true"><path d="${d}" fill="${c}"/></svg>`;
const chip = d => `<svg width="12" height="12" viewBox="6 6 12 12" aria-hidden="true"><path d="${d}" fill="${N}"/></svg>`;
const lab = (t, bold) => `<span style="width:96px;font-size:14px;line-height:1.2;color:${bold ? N : MUTE};${bold ? 'font-weight:700' : ''}">${t}</span>`;
const sp = w => `<span style="width:${w}px"></span>`;
const row = (t, bed, bold) => `<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:8px 0">${lab(t, bold)}${[...SIX, bed].map(chip).join('')}${sp(6)}${[...SIX, bed].map(d => badge(d, 24)).join('')}${bare(PLUS, 26.4)}${bare(STAR, 20)}${bare(J.person.d, 24)}</div>
<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:4px 0 12px">${lab('')}${[...SIX, bed].map(d => badge(d, 72)).join('')}${bare(STAR, 60)}${bare(J.person.d, 72)}</div>`;
const P = (t) => `<p style="margin:0 0 12px;font-size:19px;line-height:1.45">${t}</p>`;
const H = (t) => `<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${MUTE};text-transform:uppercase;margin:22px 0 6px">${t}</div>`;
const table = (rows, w = '30%') => `<table style="width:100%;border-collapse:collapse;font-size:16px;line-height:1.38;margin:4px 0 14px">${rows.map(([a, b]) => `<tr style="border-top:1px solid ${RULE};vertical-align:top"><td style="padding:8px 8px 6px 0;width:${w};font-weight:700;color:${N}">${a}</td><td style="padding:8px 8px 6px;color:${N}">${b}</td></tr>`).join('')}</table>`;

// ---- a construction sheet: left, the roots run past the glyph; right, every round by its kind
const KIND = { 'mass corner': '#C2410C', 'line end': '#2563A8', 'flare': '#5A7D2A', 'counter corner': '#8A3FA0', 'tip': '#B8860B', 'wide outside': '#C2410C', 'join / notch': '#8A3FA0', 'wide inside': '#8A3FA0' };
function sheet(g, title, notes, sym) {
  const b = g.mFin.box, pad = 1.3, x0 = Math.floor(b.x0 - pad), y0 = Math.floor(b.y0 - pad), x1 = Math.ceil(b.x1 + pad), y1 = Math.ceil(b.y1 + pad), W = x1 - x0, Hh = y1 - y0, S = 336 / Math.max(W, Hh);
  let grid = ''; for (let x = x0; x <= x1; x++) grid += `<line x1="${x}" y1="${y0}" x2="${x}" y2="${y1}"/>`; for (let y = y0; y <= y1; y++) grid += `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}"/>`;
  const gridG = `<g stroke="#D8CEBA" stroke-width="${f2(1 / S)}">${grid}</g>`;
  const glyph = `<path d="${g.d}" fill="${N}" fill-opacity="0.16"/>`;
  const roots = g.parts.map((d, i) => `<path d="${d}" fill="none" stroke="${OR}" stroke-width="${f2(1.6 / S)}"${g.prims[i].cut ? ` stroke-dasharray="${f2(4 / S)} ${f2(3 / S)}"` : ''}/>`).join('');
  const caps = g.prims.filter(q => q.cap).map(q => `<ellipse cx="${f2(q.cap.cx)}" cy="${f2(q.cap.cy)}" rx="${f2(q.cap.rx)}" ry="${f2(q.cap.ry)}" fill="none" stroke="#8B5A2B" stroke-width="${f2(1 / S)}" stroke-dasharray="${f2(3 / S)} ${f2(2 / S)}"/>`).join('');
  const cutBox = g.cut ? `<rect x="${f2(b.x0)}" y="${f2(b.y0)}" width="${f2(g.cut[0])}" height="${f2(g.cut[1])}" fill="none" stroke="${MUTE}" stroke-width="${f2(1 / S)}" stroke-dasharray="${f2(6 / S)} ${f2(3 / S)}"/>` : '';
  const axis = sym != null ? `<line x1="${sym}" y1="${y0}" x2="${sym}" y2="${y1}" stroke="${ORD}" stroke-width="${f2(1 / S)}" stroke-dasharray="${f2(8 / S)} ${f2(3 / S)} ${f2(2 / S)} ${f2(3 / S)}"/>` : '';
  const ctr = `<circle cx="12" cy="12" r="${f2(5 / S)}" fill="none" stroke="${OR}" stroke-width="${f2(2 / S)}"/><circle cx="${f2(g.mFin.cx)}" cy="${f2(g.mFin.cy)}" r="${f2(2.5 / S)}" fill="${N}"/>`;
  const rounds = g.laws.map(l => `<circle cx="${f2(l.pt[0])}" cy="${f2(l.pt[1])}" r="${f2(Math.max(l.r, 0.12))}" fill="none" stroke="${KIND[l.why] || N}" stroke-width="${f2(2 / S)}"/>`).join('');
  const vb = `${x0} ${y0} ${W} ${Hh}`, w = f2(W * S), h = f2(Hh * S);
  const kinds = [...new Set(g.laws.map(l => l.why))].map(k => { const ls = g.laws.filter(l => l.why === k); return `<span style="color:${KIND[k] || N};font-weight:700">${k}</span> ${[...new Set(ls.map(l => l.r.toFixed(2)))].join(', ')} ×${ls.length}`; }).join(' · ');
  return `<div style="padding:14px 0;border-top:1px solid ${RULE}"><div style="font-size:19px;font-weight:700;color:${N};margin-bottom:8px">${title}</div>
<div style="display:flex;gap:12px;flex-wrap:wrap;align-items:flex-start"><div style="width:${w}px"><svg width="${w}" height="${h}" viewBox="${vb}" style="background:${PAPER};display:block" aria-hidden="true">${gridG}${cutBox}${glyph}${caps}${roots}${axis}${ctr}</svg><div style="font-size:13px;color:${MUTE};margin-top:4px">Roots (orange; dashed: a counter), ellipses whole (dashed brown)${g.cut ? ', the cut (dashed grey)' : ''}${sym != null ? ', the mirror axis' : ''}; ring: the badge's middle, dot: the ink centre. 1px grid of the 24 badge.</div></div>
<div style="width:${w}px"><svg width="${w}" height="${h}" viewBox="${vb}" style="background:${PAPER};display:block" aria-hidden="true">${gridG}<path d="${g.d}" fill="${N}" fill-opacity="0.85"/>${rounds}</svg><div style="font-size:13px;color:${MUTE};margin-top:4px">Every round the engine drew: ${kinds}</div></div></div>
<ul style="margin:10px 0 0;padding-left:22px;font-size:16px;line-height:1.42;color:${N}">${notes.map(n => `<li style="margin:0 0 4px">${n}</li>`).join('')}</ul></div>`;
}
const listRow = (d, name, type) => `<div style="display:flex;align-items:center;gap:10px;height:56px;background:${PAPER};padding:0 10px;border-bottom:1px solid ${RULE};width:250px;box-sizing:border-box">${badge(d, 24)}<div style="flex:1;font-size:16px;font-weight:600;line-height:1.15">${name}<div style="font-size:10.5px;letter-spacing:.08em;font-weight:700;opacity:.72;margin-top:2px">${type}</div></div></div>`;
const account = (px) => { const k = px / 50; return `<svg width="${px}" height="${px}" viewBox="0 0 50 50" aria-hidden="true"><polygon points="${scallop}" fill="${N}"/><g transform="translate(13 13)"><path d="${J.person.d}" fill="${OR}"/></g></svg>`; };

const bed = J.bed, fx = J.bedFixed, pe = J.person;
const ft = id => { const x = J[id]; return `fair check ${x.fair.length ? `<b>${x.fair.length} faults</b> (${[...new Set(x.fair.map(q => q.kind))].join(', ')})` : '<b>clean</b>'}, join check ${x.join.length ? `<b>${x.join.length}</b>` : '<b>clean</b>'}, ${x.curves} curves`; };
const html = `<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${MUTE};text-transform:uppercase;margin:30px 0 8px">Blind test: two new icons from the spec</div>
<div style="margin:6px 0 12px;padding:10px 14px;background:${PAPER};font-size:17px;line-height:1.4;color:${N}">You: "ideally future ones come out perfect on first try." The director's test for a 10: two new icons drawn blind from the Construction board's spec, run through the checks and put in the row. If they land first time, it's a 10. If not, the rule that failed gets fixed.</div>
${P(`<b>How it went.</b> Drawn by a designer who had seen only the spec, the code it names and your taste rules, not how the six were made. <b>The person landed first time</b>: both checks clean, and it reads at 12, 24 and 72px. <b>The bed did not.</b> Two rules failed on it. Rule 11 ("placed by weight") put the pillow in the middle of the mattress. And a whole ellipse as flat as the pillow (1/2 as tall as wide) fails the fair check, though it is a pure root shape. So it's not a 10 yet: two rules to fix, and six places where the spec didn't say and I had to choose (listed below). The bed below is shown twice: as drawn blind, and with the two fixes. The second is not hand-tuned: both changes are rule changes.`)}
<div style="padding:12px 0;border-top:1px solid ${RULE}"><div style="font-size:19px;font-weight:700;color:${N};margin-bottom:6px">In the row: 12px chip, 24px badge, 72px</div>
${row('Bed as drawn blind', bed.d)}
${row('Bed with the two fixes', fx.d, true)}
<div style="font-size:14px;color:${MUTE};margin:2px 0 4px">The person is an outline mark like the star, shown bare at its own slot: 24px, the account button's glyph size (the star's slot is 20px, so the person reads bigger in this row; in the app it sits alone in the 50px button).</div></div>
<div style="display:flex;gap:18px;align-items:center;margin:8px 0 14px;flex-wrap:wrap"><div>${listRow(SIX[0], 'Kaffeverket', 'CAFÉ · STOCKHOLM')}${listRow(fx.d, 'Hotel Skeppsholmen', 'HOTEL · STOCKHOLM')}${listRow(SIX[2], 'Vasa Museum', 'MUSEUM · STOCKHOLM')}${listRow(bed.d, 'Hotel Skeppsholmen', 'HOTEL · BLIND, AS DRAWN')}</div><div style="text-align:center">${account(50)}<div style="font-size:13px;color:${MUTE};margin-top:4px">Account button, 50px</div></div><div style="text-align:center">${account(100)}<div style="font-size:13px;color:${MUTE};margin-top:4px">at 2x</div></div></div>
${H('What I judge, looking at them in the row')}
${table([
  ['Person', `Reads as a person at every size and sits with the star as one family: the same line, the same even walls, its counter on the star's 2 1/2 lines. The shoulders are a touch heavy at 72px against the head; that is the 4/5 ellipse plus the counter rule, not something I tuned. Weight: 85 px² of ink at its slot, the star 84 at its own (both about 70% of their slot across).`],
  ['Bed as drawn', `Reads as a bed at 24 and 72px. But the pillow floats in the middle of the mattress, as rule 11 says it must: it reads as a loaf on a bench. And the pillow's two ends fail the fair check (TAIL).`],
  ['Bed with the fixes', `The pillow rests against the headboard, 2/3 as tall as wide: it reads as a bed and a pillow at 24 and 72. At the 12px chip the pillow is under a pixel tall and greys to a dot, as the museum's cut does there. Weight 45 px² (the coupe 45, the cup 57, the tree 34), so it sits in the row's range. It came out Wide, fitted to the cut's width (11 × 8.00 in an 11 × 8.56 cut).`],
], '22%')}
${sheet(fx, 'Hotel: the bed, constructed (with the two fixes)', [
  `<b>Roots:</b> the mattress, a rectangle, the widest root (1); the headboard, a post (5/6 line, 1 1/4px) at the head end, from its top to the floor (it is the head's leg); the foot leg, a post at the foot end; the pillow, one ellipse.`,
  `<b>Ratios:</b> mattress 1/4 as tall as wide · headboard stands 1/3 of the mattress's width above it · legs show one line under the mattress (the tree trunk's rule, reused) · pillow 1/3 of the mattress's width, ${'<b>2/3</b>'} as tall as wide (blind: 1/2) · the pillow rests on the mattress and against the headboard across the 1px cut (blind: centred, rule 11).`,
  `<b>Engine:</b> class Wide (drawn 1.38 : 1; Wide's cut 1.29, Square 1); fitted to the cut's width, 11.00 × 8.00; not mirrored (a side view); centred by rule 16. ${ft('bedFixed')}. Blind version: ${ft('bed')}.`,
])}
${sheet(pe, 'Account: the person, constructed', [
  `<b>Roots:</b> the shoulders, the top half of one ellipse closed by a flat base, the widest root (1); the head, a circle, resting on the shoulders across the 1px cut. <b>Counters</b> (rule 5): the head's, a circle on the same centre a line smaller; the shoulders', the same ellipse less a line on each axis, its base raised a line.`,
  `<b>Ratios:</b> head 1/2 as wide as the shoulders · shoulders' ellipse 4/5 as tall as wide (the vessel value, reused). <b>Size</b> (rule 12, Outline: sized by its counter, 2 1/2 lines across): the smaller counter, the shoulders', is 2 1/2 lines (3 3/4px) up its axis; the head's comes out 5.44px across.`,
  `<b>Engine:</b> the line 1 1/2px at its 24px slot; mirrored about its axis; centred by rule 16 (moved ${pe.dy.toFixed(2)} down). Finished ${pe.finished.map(v => v.toFixed(2)).join(' × ')}px. ${ft('person')}.`,
], 12)}
${H('The two rules that failed, and the fix for each')}
${table([
  ['Rule 11, placed by weight', `As written: "A part that rests on another sits with its ink centre over the other's centre." The pillow rests on the mattress, so it is centred on it: a bed with a pillow in the middle. The rule was written for the cup on its saucer, a part resting on one thing alone. <b>Fix:</b> "A part resting on one other part alone sits with its ink centre over that part's centre. A part that rests on one part and against another (a pillow on a mattress, against the headboard) sits against it, across the same cut."`],
  ['A whole ellipse, how flat', `The pillow, a pure ellipse 1/2 as tall as wide, fails the fair check: 4 TAIL faults, at its two ends (the bend creeps up and then shoots up at the ends, 0.75 of the way before it is halfway). Measured on whole ellipses at pillow size: 1/2 fails, 3/5 fails at 3.7px wide and passes at 5.5px, 2/3 and rounder always pass. The six never met this: every vessel ellipse is 4/5. <b>Fix:</b> a rule, "An ellipse drawn whole is at least 2/3 as tall as it is wide; anything flatter is a rectangle the law rounds, or a cap." (Or the check exempts a root ellipse's ends. I'd rather the rule: it keeps the check strict.)`],
])}
${H('Where the spec didn\'t say, and what I chose')}
${table([
  ['1 · Outline marks with two counters', `"Outline (sized by its counter, 2 1/2 lines across)" assumes one counter. The person has two. I chose: the smallest counter across sets the size (the shoulders', up the axis), because the rule is there to keep holes open. Sizing by the head instead would make the person 13.5px wide and leave the shoulders' counter 2.4px, under 2 lines.`],
  ['2 · An outline mark\'s slot', `The star is drawn "in its own 24 box at 20px"; nothing says what slot a new outline mark gets. I chose 24px, the account button's glyph size in the app (#accountBtn's svg).`],
  ['3 · Which corner law for outline marks', `Rule 14 gives one table (mass corners 0.6). The code draws the star with a different law, the joint law with a tip share, scaled to its slot (mass corners 0.45). I used rule 14's, since that is what the spec says; the person's only outside corners are the shoulders' base, 0.6.`],
  ['4 · One line vs the 1/3px lattice', `The legs show one line (1 1/2px), but horizontal edges sit on the 1/3px lattice and 1 1/2 is not on it. I chose the first lattice line at least a line below the mattress (as the cup's saucer does with its cut), so the legs show 1 2/3px.`],
  ['5 · A slab or a mass', `"The line: every wall, slab, beam and plinth." A mattress is a horizontal block, but at a line thick the bed reads as a bench. Nothing says when a block is a slab (a thickness) and when it is a mass (a shape). I chose a mass: 1/4 as tall as wide.`],
  ['6 · One cut, two faces', `"A cut of 2/3 line between parts that rest on each other (at most one per icon)." The fixed pillow is 1px from the mattress and from the headboard. I counted that as one cut: one part, cut free on two faces.`],
  ['Also chosen (inside the spec)', `Side view, not front: a front view's two pillows come out under 2px wide at 24. The headboard is a post (it holds the bed's head up), not a wall. Legs reuse the trunk's "shows one line" (the spec says reuse a value where the job is the same). The shoulders reuse the vessel ellipse, 4/5. New values are new lines in src/proportions.js (PROP.bed, PROP.person). The master grid board still says outline holes ≥ 4px and a 1 2/3px line; I followed the spec (2 1/2 lines, 1 1/2px).`],
], '28%')}
${H('Checks run')}
${table([
  ['Fair check', `knee, tail, jump, inflect, shelf, shoulder, dip, kink. Person: clean. Bed blind: 4 TAIL (the pillow's ends). Bed fixed: clean.`],
  ['Join check', `jump, hump, wobble. All three: clean.`],
  ['Engine', `Class at the fitted size, the solved fit, rounds by kind, mirror, centre by rule (src/blind.js, the same pipeline as construction.js). Every round listed on the sheets above.`],
  ['By eye', `At 12, 24 and 72px in the row beside the six, in list rows and in the account button (above).`],
])}
<div style="margin:0 0 24px;padding:18px 20px;background:${PAPER};border-top:4px solid ${OR};font-size:24px;line-height:1.3;color:${N};font-weight:600">Two rule fixes to approve: rule 11's scope, and whole ellipses no flatter than 2/3. And do the bed and the person land for you?</div>
<div style="margin:0 0 18px;font-size:16px;color:${MUTE}">Detail: src/picks-blind.js (the drawings), src/blind.js (the build and checks), src/blind-board.js (this section); report design/icon-system/grid/blind-test.md.</div>
`;
fs.writeFileSync(path.join(G, 'blind/section.html'), html);
console.log('section', html.length);
