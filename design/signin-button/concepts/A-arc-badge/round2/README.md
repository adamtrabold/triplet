# Concept A, round 2: what changed and why

Owner on round 1 (verbatim): "on the right track but it's ugly. icon should be centered... maybe too small? text should be smaller and probably tracked out some because it's crowding"

Sheet: `sheet-3x.png` (1170 wide, 3x). Built from `sheet.html`; real-app stills from
`render2.js` (patched copy `index-A2.html` = real index.html + `../../flow/proto/patch.js` + `badge2.js`).
Re-render: `node render2.js` (motion frames for variant 2; `V=1|3 node render2.js` for another), then
`node ../../sketches/shoot.js sheet.html sheet-3x.png`.

## What changed
- **Person centred.** Glyph bbox centre (12,12 of the 24-unit lucide user) sits at the badge centre (25,25).
  Round 1 had it high at y 17.6 with the text below, so the badge read as "icon up top, label at the bottom".
- **Person bigger.** ×0.42 → ×0.58 / ×0.68 / ×0.76 (variants 1/2/3); stroke 1.35-1.5px.
- **SIGN IN smaller and tracked out.** Round 1: 8px at 75% width, 0.5px spacing (condensed + tight = crowding).
  Now normal width (100%) for legibility at small size, with wide tracking, on a radius that hugs the rim:
  | | person | text | tracking | weight | arc radius |
  |---|---|---|---|---|---|
  | 1 Small change | ×0.58 | 6.5px | 1.3px | 700 | 17.6 |
  | 2 Balanced (pick) | ×0.68 | 6px | 1.8px | 650 | 18.0 |
  | 3 Big person | ×0.76 | 5.5px | 2.3px | 650 | 18.3 |
- **The arc is now truly centred.** Round 1's SIGN IN leaned (Chromium places textPath glyphs off-centre with
  `text-anchor: middle` + letter-spacing). `SB.centerArcs()` measures the first/last glyph and rotates the arc
  group so the word is symmetric about 6 o'clock. Builder: call it after the badge renders and fonts are ready
  (or hard-code the measured rotation per variant). Unchecked in Safari.
- **Stands on its own.** Shown in the corner with + gone (in case + moves). Paper face + warm 1px edge + 1px
  contact shadow carry it alone on cream and on water; it doesn't need the navy + beside it to read.
- Unchanged: 50px scallop die, paper `#FAF5EA`, navy ink, no rim/tilt, pressed face `#DCD3C3`, signed-in badge.

## Motion
Same Strike in / dry-up out, same timings. Only the person's start changed: it's already centred, so it just
grows ×0.68 → ×1 and thickens to 2px (no upward travel any more), reversing to orange under the ink. The
0.13s frame's blot is a touch bigger (r 19.5) so the words are covered by then. Frames are variant 2.

## Not redone
The flow sheet (`../../flow/sheet-3x.png`) frame 5 still uses round 1's `../shots/in-0|130|380.png`. Once a
variant is picked, point it at `round2/shots/in-*.png` (render with that `V`) and re-shoot; nothing else on it changes.

## Open
- 5.5-6px caps at real size: the owner asked for smaller; Chromium renders read, iPhone unverified.
- Weight 650 vs 700 at 6px: Safari's variable-font rendering of 650 is unchecked.

## Round 2b: director's fixes to variant 2 (scores.md, round 2 entry; 2 scored 8)
Variant 2 was overwritten in place (`badge2.js` V[2]); every v2 still, the motion frames, `sheet-3x.png` and the
flow sheet were re-rendered over the same filenames. Variants 1 and 3 are dropped from the sheet. Their values and
shots (`shots/v1-*`, `v3-*`) stay on disk for the record.
- Arc baseline r 18.0 -> **16.6**. Scallop valleys measured at r 18.81, so the letters' feet clear them by **2.2px**
  (1.7px to the inner side of the 1px edge stroke).
- Tracking 1.8 -> **1.3px (0.22em)**. Word space -> **hair space U+200A**. Measured ink gaps (canvas, 100x):
  S-I 2.01, I-G 2.06, G-N 2.16, **N-I 3.88**, I-N 2.21. So the word gap is **1.85x** the mean letter gap (2.11).
- End letters (glyph start/end positions, after centring): **±53.8°** from 6 o'clock (target ≤60).
- Weight 650 -> **700** so the I holds at 1x. Cap height 4.11px. Cap tops at r 12.49, figure's lowest ink at
  r 6.85, which leaves ~5.6px between shoulders and caps. That's no crowding, so the person stays at true centre
  (25,25; `cy` 25). No optical nudge was needed.
- Enlargements draw the edge and contact shadow at 1 CSS px (`badgeA({size})` divides by the blow-up), so the
  hero doesn't get a tan outline.
- Sheet: leads with "We'd pick this one" and 2 at 3x (150px). Below it: pressed + signed in at 72px, the full
  top-of-screen strip, and 1:1 crops next to +, over water, and on its own (cream, water). Then the in/out strips.
- Flow sheet (`../../flow/sheet.html` + `proto/make-sheets.js`): the title is now "Signing in" (was "Signing in,
  both concepts"), and frame 5 uses `A-arc-badge/round2/shots/in-0|130|380.png`. Re-shot `flow/sheet-3x.png`.
- Measure again with `node measure.js 2` (uses `measure.html`).
