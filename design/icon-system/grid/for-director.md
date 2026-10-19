# Grid g7: batch 1 redrawn to the craft bar, for the design director

From the icon designer, 2026-10-19, built to your turn-24 gates (G1–G4 first). The g6 handoff is in git history.

## His words (verbatim, `../owner.md`)

> "i definitely think it's the right side for all of the icons on the first board on this page... and i definitely think the 1.5px weight feels the best right now. that said none of these are yet at the craft level i need the icons to be at -- the sizes of various parts of many of these are not yet optically pleasing, the rounding at various intersections feels wrong (some places too broad roujnding, some too tight), and some of the choices inside of the icons don't make sense (for example why does the coffee cup handle cut off on the bottom - it creates a narrow passage that will definitely disappear at small sizes...and why is the interior of the museum pillars totally rounded pill shapes...these are just examples). i also think some of these decisions are contributing to poor optical alignment inside of the badge -- some feel like they're floating above center, some feel slightly lower on center. none have the same optical weight exactly yet when viewed as a set."

> "i want them all to be focusing on best practices and principles for icon design"

## Where

- **Canvas, page "Grid concepts":** https://claude.ai/artifact/SVKZ9PpaMCKUpk7Ks622jW. Seven boards: `Grid7Intro`, `Grid7Set`, `Grid7Drawings`, `Grid7Corners`, `Grid7App`, `Grid7Air`, `Grid7Grid`.
- **g6 (batch 1 as he saw it) moved to Archive** (y 36500).
- **Stills:** `stills/g7-sheet-0..6.png` (3x) and `g7-sheet-1-1x.png`. Source: `cards-g7.html`.
- **Code:**
  - `src/picks7.js`: the drawings; each comment names its principles;
  - `src/laws7.js`: the laws with the size fit;
  - `src/optics.js`: ink area, ink centroid and box, exact from the outline;
  - `src/boards7.js`: the sheets, with `place()` (optical centring).
- **SVGs:** `svg/g7/<law>-<air>/`.
- **Reference sets:** `reference/` (Material Symbols Rounded, Apache 2.0; Phosphor, MIT), with a README.
- I looked at every sheet at 3x, sheet 1 at 1x, and the set rows blurred.

## After g7c (your 9): no ink traps, joins meet square

The owner, on g7c: "i do not want ink traps... no reason for that on digital imo".

- **Change 14 is replaced.** Joins now meet square, under all three laws.
  - That covers the + crossing, the coupe's stem at bowl and foot, the trunk, the ear on the cup, and the columns on the beam and plinth.
  - There's no notch, and no round to fill the corner either. A square join adds the least ink a join can without cutting into the line, so the "too broad rounding adds ink" problem stays solved.
  - Outside corners keep each law's rounds. That's where the three laws still differ.
- **Sheet 6** shows the + and the coupe's stem at 3x in three states: g7 rounded, g7c with traps (turned down), and square now.
- **Weight re-checked.** Squaring the joins adds very little ink: the museum goes from 37.4% to 37.8%, the others by 0.1 or less.
  - Blur scores: conifer 75, cup 74, coupe 70, museum 66. The spread is still about 9 and the order is unchanged, so no drawing was retuned.
- **Not acted on yet:** your note to try the ear one 1/3px narrower at 32. It's waiting with the owner's other answers (craft level, corners, air).

Checks: 0 slivers; 33 of 33 symmetric.

## After your g7b score (8): the museum between, the cup lighter, the texts true

1. **The museum, between g7 and g7b.** The pediment sits on a thin 4/3px beam (joined, so there's no cut); the four columns hang from the beam and stand on the plinth. Every gap is a closed 1.5px slot, nothing under the line. Low pediment, drawn 10.3px tall.
2. **The cup, lighter.** It's 0.25px narrower each side (6.75 wide), and the ear's counter is opened to 2.25 × 2px. It keeps its height and keeps the ear joined.
3. **The blurred verdict, measured.**
   - New `src/blur-measure.js` (Playwright) and `src/blur-measure.py`: the mean of the darkest fifth of the Ø16 live circle after a 1.5px blur.
   - Scores: conifer 75, cup 74, coupe 69, museum 66, a spread of 9 (g7b: 25).
   - Sheet 1, plainly: the conifer and the cup are darkest and about equal; the museum is lightest, now only slightly.
   - To meet in the middle, the coupe got a little more (bowl 4.7 deep, a fuller foot) and the conifer a little less.
4. **Texts.**
   - Sheet 1 now says "Every counter and slot is at least the line (1.5px)". It names the one 1px gap (cup to saucer, open at both ends).
   - The stale join line is gone from this file.

Checks: 0 slivers; 33 of 33 symmetric.

## After your g7 score (8): the four fixes

1. **The cup (C3).**
   - **The ear:** the handle is now a D-shaped ear joined to the wall over its height. The wall runs straight down past it before the bowl turns under. Its counter is 2 × 1.67px, closed by the straight wall, so there's no passage. Arms are 4/3px and the back 1.5px.
   - **Sheet 2:** shows it beside the g7 ring and both reference cups, at 24 and 3x. **Kept: the ear.** It reads as a handle at 24, as both references do.
   - **Size:** the cup is taller (wall from 1.33, 6.3 deep), so it no longer reads smallest. Ink 33%.
2. **The museum (C2).**
   - No separate beam: the pediment's base is the entablature, and the four columns stand free under it after the 1px cut (as Material draws it). It's drawn 10.7px tall. Ink 32%, down from 38%.
   - Four columns, no pills.
   - Cost, stated on sheet 2: the spaces between the columns now open into the 1px cut, the narrowest passage in the set.
3. **Joins (C6), change 14.**
   - Where a line meets or crosses another part at about a right angle (a concave corner of 75–105°), the join gets an ink trap: a V, 0.25px back along each edge and 0.25px into the ink, instead of a round.
   - It applies under all three laws: the + crossing, the coupe's stem at bowl and foot, the trunk, the ear on the cup, the columns on the plinth. It's in the engine (`{ trap }` from a law) and in `laws7.js`.
   - Sheet 6 shows the + at 3x before and after, in the badge, and the coupe's stem before and after.
   - Cost: the three laws now differ only at outside corners and sharp notches (sheet 3 says so).
4. **The set row, re-shot** (sheet 1).
   - Ours, Material, Phosphor at 24, then at 12, at 1x.
   - The same subjects in our badge, then each set blurred.
   - **Plainly:** the darkest is our cup (a compact mass), and the lightest is our museum. The coupe and conifer sit between, and both references read lighter overall in our badge.

Checks: 0 slivers; 33 of 33 symmetric; change 7 fires nowhere. g7 as scored is on Archive (y 40000).

## Your gates, by eye (g7 as first sent)

- **G1, centring (sheet 1, "Centring").**
  - Each drawing is placed by its optical centre: halfway between its box centre and its ink centroid. Steps are 1/3px vertically and 1/4px horizontally.
  - Batch 1 measured: coupe 0.8px high, cup 0.2px high, museum and conifer 0.4px low.
  - Redrawn: every optical centre is within 1/6px of the badge centre.
  - The rows are shown at 2.6x with centre lines and dots, and at 24 and on the 32 pin.
- **G2, weight (sheet 1, "Weight").**
  - Squint test (a blurred row, before and after) plus ink share. Redrawn: café 31%, bar 29%, museum 38%, nature 30%.
  - Plainly: the museum still carries the most ink. Blurred, it reads about as dark as the cup, because its ink is spread out. If you read it as heavier, its next lever is height (it is already drawn 11.3px tall, as a wide glyph).
  - The + and the Star sit in the same rows.
- **G3, interiors.**
  - The cup's handle is a closed ring with its own counter, 1.8px across, held clear of the wall: no passage.
  - The museum's spaces are 1.5px slots with 0.3px corners, so no pills.
  - The conifer droops less, so its notches stay open.
  - The coupe is solid.
  - The Star's counter is about 6px across.
  - No passage is narrower than the line.
- **G4, proportion and corners.**
  - **Coupe:** foot about 70% of the bowl.
  - **Museum:** a low pediment (about 22°); beam and plinth overhang the columns 0.5px so it reads as a colonnade. Three columns were tried and read as a box with two doors, so four stay.
  - **Cup:** about 1.4:1, with the saucer at full width.
  - **Corners:** all three laws now share a fit rule: a round is never more than 0.2 of the shortest edge at its corner. That gives small corners on slots and line ends and full rounds on big joins. The by-joint values are also retuned: joins 0.6 (was 0.825), mass corners 0.45, line ends and tips 0.3.

## The practices, where each is used

- **Optical centring:** `place()`, all six. Sheet 1 shows it; sheet 6, change 10.
- **Overshoot:**
  - the conifer's tip rises 1/2px above TOP;
  - the museum's apex rises 1/3px;
  - change 13.
- **Equal optical weight:**
  - checked by the squint row and ink share;
  - wide glyphs are drawn shorter;
  - change 11.
- **Proportion:** per icon, sheet 2.
- **Counters that survive small sizes:** G3 above.
- **Joins and corners by angle and by size:** `laws7.js`; change 9.
- **Contrast compensation:** horizontals are 4/3px against 1.5px uprights (the saucer, beam, plinth and the + crossbar); change 12.
- **Pixel fitting** (your batch-2 ask, brought forward):
  - 4/3px is exactly 4 device pixels on a 3x phone;
  - horizontal edges sit on the 1/3px lattice, and placement moves in 1/3px steps;
  - uprights stay 1.5px and centred, so their edges are half a dot off: symmetry wins for uprights;
  - shown on sheet 6 (change 12) against the device-pixel grid.
  - Cost, stated on the air sheet: 1.5px of air puts the box at 5.625 and loses the lattice.

## Reference strip (sheet 1)

Your turn 25 asked for Material Symbols and SF Symbols. SF Symbols isn't shown: Apple's licence limits them to Apple-platform work, and they can't be downloaded here. Phosphor (MIT) stands in, and the sheet says so.

Material Symbols Rounded (fill) and Phosphor (fill) for the cup, coupe, column front, tree, + and Star. Each is shown at 24px as drawn, then inside our badge at our 12px box, with ours in the same row. They're shown to judge craft (joins, counters, proportion), not to copy. They also appear at 12px beside our chips, with a faint centre line on our 24px row.

Plainly, on the sheet: in our badge at our box, both references look lighter than ours. That's the 1.5px line on a 12px drawing.

## Interiors enlarged (sheet 1)

At 8x, with widths: the cup's counter is 2.25 × 2px; the museum's slots are 1.5px, closed at both ends; the conifer's notches open to the outside; the Star's counter is about 6px at 20px.

## Construction

- `check-svg.py` on `svg/g7`: 0 slivers; 33 of 33 symmetric files mirror within 0.01px (the café is skipped by design).
- The collision rule (change 7) fires nowhere: 0 arcs in every icon under every law, because fitted rounds never collide.

## My read (not on the sheets)

- **Best gains:** centring is fixed by method, not by eye-nudging, and the slots and the handle are fixed.
- **Weakest:** the cup's ring handle. It reads clearly as a handle at 24, but at 3x it's a ring, a simplification more than an ear. If he wants an ear, it needs a vertical cup wall the full height of the counter. That changes the cup's silhouette, and I'd show it as an option, not slip it in.
- **The museum's weight** is the open judgement call (G2).

## The ask

"Are these at the craft level now, as a set? If so: which corners (by joint, even wear or pressed), and 2px or 1.5px of air?"
