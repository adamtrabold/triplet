# Notes: product designer (visual focus)

## Where things stand (2026-10-14, after jam turn 7: six stills built)

The jam is closed (director turn 6). I built the six stills per §3 in
`../concepts/sketches/attitudes-v3.html`. They render to `v3-card-0-today`,
`v3-card-1-field-guide`, `v3-card-2-cut-paper`, `v3-card-3-timetable-sorts`,
`v3-card-4-side-by-side` and `v3-card-5-dropped` (.png, 1170 wide, 3x).

How to re-render: playwright from `npm root -g`. The scratchpad script
`cards3.js` loads the page, waits for `document.fonts.ready` plus 1.5s, then
takes an element screenshot of each `.card` at DSF 3. The real visited PNGs
are `ref-row-stamp`, `ref-row-stamp-selected`, `ref-tag-stamp` and
`ref-sticker-near`. The map land colour is #E8E4DA, so the sticker PNG's
background blends in.

Builder-relevant structure: `G[dir][name]` holds the inner SVG markup for
every glyph (dirs T, F, C, S). Knockouts use `var(--ko)`, so selected pins
and rows can invert them. Timetable strokes use `var(--sw)`, set per size by
`swFor()`: 12px = 2.9, 18px = 2.35, 24px = 2.

Turn-6 rulings, as applied:
- Field Guide: tools are navy at 1.8 round (never grey). Buttons keep their
  loudness; at 1.8 the glyph isn't timid.
- Timetable: ink traps, squarish curves, flat ends, mitred corners, and the
  optical masters. It's the only direction that looks different at a
  glance in rows and on the map.
- Cut Paper: tools are about 1.7 strips; the row × is quiet; the off star
  is dotted with a solid fallback inset; places get a fixed 3–5° lean.
- District = a block cut by streets in every direction. Street = FG a
  perspective road, CP a winding ribbon, TS converging edges with a dashed
  centre.
- Mark-visited check: FIXED, unchanged, on every card.

Findings:
- In rows and on the map, Field Guide and Cut Paper are near-Today: one
  detail per glyph. Card 4 says so.
- The dotted star is the faintest mark in its stub; I'd ship the solid
  fallback.
- Cut Paper's account glyph in the scallop looks timid, and its tools
  converge with Field Guide's.

Open for the director: push FG and CP further at 18px, or show them as
they are.

## Earlier (after jam turn 4 = pass 2)

Pass 2 is done. Board: `../concepts/sketches/attitudes-v2.html`, with one
PNG per card (`v2-card-0-today` … `v2-card-4-dropped`) plus
`attitudes-v2-3x.png`. Rendered with the scratchpad scripts `shot.js` (full
page) and `cards.js` (per-card element shots, DSF 3, waiting on
`document.fonts.ready` so Archivo loads from Google Fonts). Directions
going forward (director, turn 3): **Field Guide, Cut Paper (with Spot
merged in), Timetable Sorts**. Dropped strip: Same Die (kept as the grid
seed), Spot, Badge, Code, Linocut. Parity is NOT a premise: each card
states its own on/off stance.

Pass-2 decisions:
- Field Guide: specimens are filled with corner radius ~0.8; tools are a 1.8
  stroke with round ends (radius 0.9), in ink-2. One grammar, two weights.
  District is a solid parcel with a cream dashed inner boundary, and the
  dashes mush at 12px.
- Cut Paper: off = the dotted cut-here line in tool ink (passes 1-bit);
  the fallback is a solid knife line. District is one off-true block cut
  into 4 by two cream street gaps. Its tools are still the heaviest marks
  on the board.
- Timetable Sorts: a 2-unit monoline with flat ends and mitred joins,
  filled only where a typeface would fill (star, knife blade, needle).
  ☆/★ are a typographic pair. There is an inline proof line in caps
  type. Next: real Archivo cues (ink traps, squarish curves).
- Every card: a plain + selected navy row, the tag stub with the real
  stamp, a map crop (near pins, a selected inverted pin, a cluster),
  12px and 1-bit strips, and Says / Risks / Choosing. Still to add:
  true 1x insets.

## Earlier (after jam turn 2)

Phase 1 (brand approach to icons: conceptual attitude, not drawings). I took
jam turn 2 in `../jam.md`. No concepts, no scoring, no grid. Next: the
design director steers.

Fixed: **"Visited should not change."** The owner wants more than one
direction. Feedback is normal iteration.

## Read

`../../owner.md`, `docs/owner-taste.md` (all of it), the inspo README and all
8 `design/inspo/project/` images, CLAUDE.md, `../../inventory.md`, the badge
row and the starred+visited context screen, and turn 1. NOT read: the
superseded `design/icon-system/concepts/`, the old jam, scores and notes.

## Sketch

`../concepts/sketches/attitudes.html` produces `attitudes-3x.png` (1170 wide,
3x, headless Chromium via global playwright; the script was in the
scratchpad: load the file, then a fullPage screenshot at DSF 3, viewport
390). It shows Today, Spot pictogram, Cut paper, Same die and Specimen &
key. Each one has the same 7 icons (cafe, district, star off, star on,
filters, ×, +) at 24px, a real row crop with the REAL visited stamp
(`ref-row-stamp.png`, copied from inventory-png), a 12px strip, and a
one-ink strip (an SVG threshold filter at 67% grey). These are sketches of
an attitude, not drawings.

What the sketch showed:
- With full-ink tools (Spot pictogram, Same die), filters and × end up
  heavier than the visited stamp. Tools outrank content.
- Cut paper's "uninked stock" off star vanishes in one ink, so it's
  colour-only. It needs another off state (the cut hole).
- The tint-screen off star (Spot pictogram) survives one ink at 24px, but
  turns to mush at 12px.
- Specimen & key is the calmest row; the stamp reads as the loudest mark.

## Decisions so far and why

- Ethos one-liner: "Printed with care, marked by hand, kept like a
  souvenir." The inspo's icons are quiet furniture inside loud compositions
  (the Savoy pictograms), so icons are the furniture, not the poster.
- A (Printed & Stamped) is a governing law over all the directions, not a
  look of its own.
- Kept B (Spot pictogram), with print-logic off states: tint screen,
  keyline, and blind deboss (killed).
- C reshaped from linocut to **Cut paper** (Matisse draw): the hand goes in
  the drawing, not the edge.
- D killed as a direction. "Outer shape = family" is already shipped, so
  every direction keeps it.
- E killed ("preserve the icon").
- New **F Same die**: draw with the visited check's bar and the tag's 45°
  die-cut corner, so the fixed marks become family.
- New **G Specimen & key**: places are specimens with character; tools are
  at the weight of the caps type, in ink-2. It must share one grammar and
  differ only in weight and ink.
- Whimsy budget: place glyphs and the user's own marks only, never tools.
- Show the owner at most 4 cards, Today first, the same layout as the
  sketch, plus a tag-stub crop.

## Director's objections

Turn 3: parity rested on an old note, so it was dropped as a premise. The
sketch's districts were weak ("medical badge", "guitar pick"). The
sketch was missing the map, the reversal and the tag stub. Same Die is a
method, not an attitude. Q2 (is the star printed or applied?) was answered
by the Pencil Star. Q3 (whimsy for places only) is now a team default.
Turn 6: the three directions look near-identical in rows and on the map
(the top risk). District was still weak and street was missing. No grey
tools in FG. Buttons keep their loudness. Timetable needs its typeface cues
and a 12px cut now. Cut Paper's tools should be lighter and its row ×
quiet. Mark visited is treated as FIXED.

## Open questions (owner's calls)

1. "Checked stronger than open": should off get stronger, or everything
   else get quieter? This decides whether G is eligible, and the weight
   for B and F.
2. Is the star printed or applied?
3. Is whimsy for place glyphs only, or for tools too?

## Next

The director's steering. Then build the concept cards with the systems
designer: for each chosen direction, how it looks and feels on the stress
set plus the tag stub, beside the unchanged visited stamp. Fix Cut paper's
off state first. Try a two-weight version of Same die.
