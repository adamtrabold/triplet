// The Between board's section "Blind test, round 1: what failed and the rules that fix it" (g7ba), from svg/blind/blind.json
// (src/blind.js) and the spec's own pieces (proportions-board.js). Round 1 as shown at v240: blind-board-r1.js.
//   TOOLS=<dir with paper> node blind-board.js  -> svg/blind/section.html (an HTML fragment, the top of Grid7Between.dc.html)
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

const ft = id => { const x = J[id]; return `fair check ${x.fair.length ? `<b>${x.fair.length} faults</b> (${[...new Set(x.fair.map(q => q.kind))].join(', ')})` : '<b>clean</b>'}, join check ${x.join.length ? `<b>${x.join.length}</b>` : '<b>clean</b>'}, ${x.curves} curves`; };

// ---- g7ba: the round-1 section, replaced: what failed, the rules that fix it, blind beside the re-run
const PB = require('./proportions-board.js'), { PROP } = require('./proportions.js');
const rowR = (t, bedD, perD, bold) => `<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:8px 0">${lab(t, bold)}${[...SIX, bedD].map(chip).join('')}${sp(6)}${[...SIX, bedD].map(d => badge(d, 24)).join('')}${bare(PLUS, 26.4)}${bare(STAR, 20)}${bare(perD, 24)}</div>
<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:4px 0 12px">${lab('')}${[...SIX, bedD].map(d => badge(d, 72)).join('')}${bare(STAR, 60)}${bare(perD, 72)}</div>`;
const b2 = J.bed2, p2 = J.person2, fx = J.bedFixed, pe = J.person;
const pair = (a, b, la, lb, px) => `<div style="display:flex;gap:16px;align-items:flex-end;flex-wrap:wrap">${[[a, la], [b, lb]].map(([d, l], i) => `<div>${bare(d, px)}<div style="font-size:13px;color:${i ? N : MUTE};${i ? 'font-weight:700;' : ''}margin-top:4px">${l}</div></div>`).join('')}</div>`;
const fin = g => g.finished.map(v => v.toFixed(2)).join(' × ');
const html = `<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${MUTE};text-transform:uppercase;margin:30px 0 8px">Blind test, round 1: what failed and the rules that fix it</div>
<div style="margin:6px 0 12px;padding:10px 14px;background:${PAPER};font-size:17px;line-height:1.4;color:${N}">You: "Yeah let's try for a ten also it's be best if the underlying shapes were proportionally related to each other and the grid so they weren't just random." And: "ideally future ones come out perfect on first try."</div>
${P(`<b>What happened.</b> A designer who had seen only the spec drew a bed and a person. Both passed the checks, but by eye neither looked like one of the family: the person was too big (${fin(pe)}px against the star's 14.07), and the bed was the right weight but generic, "a library bed", with none of the flares, caps or cut-free parts the six have. The director scored the system 7. The cause was the spec, not the designer: it said how to build an icon, not what makes one ours. Below are the seven gaps it found, each now a rule in the code and in the spec, and the two icons re-drawn by me under the fixed spec. That is a check, not a blind test: a fresh designer draws two other icons next.`)}
<div style="padding:12px 0;border-top:1px solid ${RULE}"><div style="font-size:19px;font-weight:700;color:${N};margin-bottom:6px">In the row: 12px chip, 24px badge, the + and the star, the person at its 24px slot; then 72px</div>
${rowR('Round 1, blind', fx.d, pe.d)}
${rowR('Now, under the fixed spec', b2.d, p2.d, true)}
<div style="font-size:14px;color:${MUTE};margin:2px 0 4px">The star is at its 20px slot, the person at its 24px slot (the account button's glyph); the outline cut sizes both to the same width on screen.</div></div>
<div style="display:flex;gap:40px;align-items:flex-end;flex-wrap:wrap;margin:6px 0 16px">${pair(fx.d, b2.d, 'bed, blind', 'bed, now', 150)}${J.bed2o ? pair(J.bed2o.d, b2.d, 'v241: overhang at the foot', 'now: holds only', 150) : ''}${pair(pe.d, p2.d, 'person, blind', 'person, now', 150)}</div>
${H('The seven gaps, worst first, and the rule that fixes each')}
${table([
  ['1 · Nothing carried the family\'s character into a new join', `<b>Rule 4, the joins.</b> Every place two roots meet is one of five kinds, and the kind decides how it looks: <b>holds</b> (a post flares a step into what it carries), <b>overhang</b> (a slab on two or more posts passes its outer posts by 1/3 post and drops a step, the flare and drop one curve: the capital; a mass on legs takes holds only), <b>rests</b> (cut free on every face it touches, flat on flat), <b>base</b> (one support: a cap; several posts: a slab with holds and overhang; legs: none), <b>free</b> (a post ends square; a living mass hangs to a tip). Each is taken from the six (figure below). The capital is now one function, <code>joins.js heldSlab</code>, which the museum is drawn with (byte for byte as before).`],
  ['2 · Outline sizing', `<b>Rule 15.</b> An outline mark is sized by its <b>outside</b> to the outline cut: Wide, Square and Tall scaled so Square is the star's width on screen, ${PROP.outline.square}px. It is drawn at its slot with the line 1 1/2px on screen. Its counters are a check, at least ${PROP.outline.counterMin} lines (3px), not the sizer. Two counters stacked at 2 1/2 lines need 14.5px of height, more than the cut, so 2 1/2 stays the star's own value, not the floor.`],
  ['3 · The spec\'s corner table differed from the code\'s', `<b>Rule 17: one table</b> (<code>PROP.rounds</code>), with two columns: shaped marks, and line marks (outline and open, the star's law: no flares, mass corners 0.45). The engine is now built from it (<code>laws7 fromTable</code>), and <code>rounds-check.js</code> proves it gives the same answer as the laws the six were built with, corner by corner (164,880 cases). The six rebuild byte for byte.`],
  ['4 · Slab or mass, undefined', `<b>Rule 5.</b> A block that carries or caps something (beam, plinth, saucer, foot) is a <b>slab</b>, one line. A block that is the thing (the cup's body, a mattress) is a <b>mass</b>, a ratio of the widest root, at least 2 lines tall. Test: if it still names the thing drawn one line thick, it's a slab.`],
  ['5 · The line (1 1/2px) off the 1/3px lattice', `<b>Rule 10.</b> The lattice places a part's first edge. A thickness that is a <b>part</b> (line, post, slab) is exact, and its far edge may sit off the lattice. A <b>space or a shown length</b> (a cut, a gap, how much of a post shows) is a minimum: the next part starts on the first lattice line at least that far away. That is what the cup's saucer already did; legs that show one line show 1 2/3px.`],
  ['6 · "One cut per icon"', `<b>Rule 14.</b> At most one part per icon is cut free. It is cut on every face it touches, all at 1px, and that counts as one cut.`],
  ['7 · The master grid was out of date', `Rebuilt from the code (<code>master-board.js</code>): the outline cut, the fit read from the engine, slab and mass, the joins, the one round table, the lattice rule. The old one is on the Archive page.`],
  ['And the two the blind designer proposed', `<b>Rule 13, placed by weight, scoped:</b> a part resting on one part alone sits centred on it; a part resting on one part and against another sits against it. <b>Rule 2, a whole ellipse:</b> at least 2/3 as tall as wide; flatter is a cap or a rounded rectangle. Both kept as he wrote them, as the director ruled.`],
], '27%')}
${H('The joins, on the six, and on the re-run bed')}
${PB.joinsFig(true)}
${H('The re-run, constructed')}
${sheet(b2, 'Hotel: the bed, under the fixed spec', [
  `<b>Roots and kinds:</b> the mattress, a <b>mass</b> (it is the thing), the widest root, 1/4 as tall as wide. The headboard, a post that <b>holds</b> the mattress and runs on past it, so no overhang: the engine's flare round on both faces, its top a <b>free</b> end. The foot leg, a post that <b>holds</b> it, flush under its end: the flare on its open inside face. No overhang: that is a slab's treatment, on two or more posts (v241 gave the mattress the museum's capital at its foot; on a block 2px deep it read as a clipped corner). The legs reach the floor themselves, so <b>no base</b>, and show 1 2/3px (rule 10). The pillow <b>rests</b> on the mattress and against the headboard: cut free on both faces, one cut, and, a soft part with a curved top, a <b>cap</b> (ellipse on top, flat on the mattress), 2/5 of the mattress wide, half as tall.`,
  `<b>Tried:</b> v241's foot with the overhang (shown beside, below); the pillow 1/3 wide (clean, but a crumb at 24); 2/3 as tall (2 KINK: a cap taller than half its width turns its ends under 30°). <b>Engine:</b> class Wide, ${fin(b2)}px in the 11 × 8.56 cut; not mirrored; centred by rule 19 (the engine writes every size and offset to 1/1000 of a unit). ${ft('bed2')}. Ink ${J.bed2.ink || 46}px² (coupe 45, cup 57, tree 34, museum 63).`,
])}
${sheet(p2, 'Account: the person, under the fixed spec', [
  `<b>Roots:</b> the shoulders, the top half of a <b>circle</b> with a flat base, the widest root; the head, a circle half as wide, resting across the 1px cut. Counters are the same roots on the same centres less a line.`,
  `<b>Size:</b> by its outside to the outline cut, class Square: ${fin(p2)}px on screen (blind: ${fin(pe)}). <b>Counters, checked:</b> ${p2.counters.map(v => v.toFixed(2)).join(' and ')}px, ${(p2.counters[0] / 1.5).toFixed(2)} lines each, over the 2-line floor. The blind shoulders, an ellipse 4/5 as tall as wide, would leave the shoulders' counter 2.6px at this size, under the floor, so the rule changed the proportion (the series' 1), not the size.`,
  `<b>Engine:</b> the line marks' rounds (rule 17: the star's), mirrored, centred. ${ft('person2')}.`,
], 12)}
${H('Did the six change?')}
${P('No. Their svgs are byte for byte the same: the museum is now drawn by the shared capital function and every icon\'s rounds come from the one table, and both give exactly what they gave before (construction.js: 6 of 6 identical).')}
${P('<b>The 1/1000 rule is now the engine\'s</b> (turn 159): every new build has its offsets and positions written to 1/1000 of a unit, so a new icon\'s designer never meets it. The six stay as you approved them. Rebuilt under it, they move 0.0001 to 0.02px, nothing you could see, but the tree\'s top tip gains a TAIL in the check (and if sizes are rounded too, the coupe\'s rim does instead). Rounding moves the engine\'s knife-edge cases; it doesn\'t remove them. The real fix is in how the engine solves a round, and that is the next engine job.')}
${H('What I see, as you would, true size first')}
${table([
  ['Person', 'Now the star\'s size and the star\'s line; at 24 and 72 it sits in the row as one of the family. The half-circle shoulders read a touch more like a dome than shoulders; that\'s the cost of keeping both counters open at this size.'],
  ['Bed', 'The right weight in the row. The pillow now rests where a pillow does, with one even cut, and has the coupe foot\'s crown. The headboard\'s and the legs\' flares read at 72; at 24 they are a hair. The foot is now square under the mattress (v241\'s capital there read as a clipped corner, and the rule now keeps the capital for slabs on posts). Closer to the family than the blind bed.'],
])}
${H('Checks run')}
${table([
  ['Fair check, join check', `Bed: ${ft('bed2')}. Person: ${ft('person2')}. The six: unchanged.`],
  ['Rounds', 'rounds-check.js: the table equals the engine on 164,880 corners, both columns.'],
  ['Rebuild', 'construction.js with the table and the shared capital: the six identical to their svgs.'],
  ['By eye', 'At 12, 24 and 72px in the row beside the six, at 1x and 3x.'],
])}
<div style="margin:0 0 24px;padding:18px 20px;background:${PAPER};border-top:4px solid ${OR};font-size:24px;line-height:1.3;color:${N};font-weight:600">Do the re-run bed and person read as part of the family to you? And is a dome for the shoulders all right, to keep both holes open at the star's size?</div>
<div style="margin:0 0 18px;font-size:16px;color:${MUTE}">Next: a fresh designer draws two other icons blind from the fixed spec (a shaped one with joins, and an outline with one counter). Detail: src/proportions.js (PROP.joins, block, lattice, rounds, outline, ellipseWhole, bed2, person2), src/joins.js, src/laws7.js fromTable, src/rounds-check.js, src/picks-blind.js bed2 / person2, src/blind.js, src/blind-board.js. Round 1 as it was shown is on the Archive page.</div>
`;
fs.writeFileSync(path.join(G, 'blind/section.html'), html);
console.log('section', html.length);
