# Grid g6, batch 1: the first drawn icons, for the design director

From the icon designer, 2026-10-17, built to your turn-18 criteria (A: craft; B: the grid held/broke report). The g5 handoff (and my MUTCD measurements) are in git history.

## His words (verbatim)

> "Weight wise 1.5 but these icons are far from there drawing wise"

> "Let's do a few at a time— we will need to pressure test the grid as it's being made"

His build brief is quoted in full on sheet 0, and in `../owner.md`.

## What's in batch 1, and why these

| Icon | What it tests |
|---|---|
| Café | curves: the low cup, the ear, the saucer's lifted ends |
| Bar | a curve flowing into a straight stem, and a foot |
| Museum | right angles, and a repeated part (the columns) |
| Nature | sharp tips and notches |
| The + | a crossing (an app icon) |
| The Star | the one outline (an app icon) |

These are four kinds of joint, plus one crossing and one outline, so each corner law gets tested on every kind. Hotel, venue, landmark and attraction are proposed for batch 2.

## Where

- **Canvas, page "Grid concepts":** https://claude.ai/artifact/SVKZ9PpaMCKUpk7Ks622jW. Six boards (`Grid6Intro`, `Grid6Drawings`, `Grid6Corners`, `Grid6App`, `Grid6Air`, `Grid6Rules`). The page title is the question.
- **g5 moved to Archive** (y 30000), nothing deleted.
- **Stills:** `stills/g6-sheet-0..5.png` (3x) and `g6-sheet-3-1x.png`. Source: `cards-g6.html`.
- **Code:**
  - `src/picks6.js`: the drawings, as functions of the box size, so the air option redraws them rather than scaling them;
  - `src/laws6.js`: the three laws at 1.5px, the g2 radii × 0.75;
  - `src/boards6.js`.
- **SVGs:** `svg/g6/<law>-<air>/`, single paths, `currentColor`.
- I looked at every sheet at 3x, sheet 3 at 1x, and sheet 2 at 760.

## The sheets

- **0. The batch.** His two quotes, his brief verbatim, which icons and why, and what he can now judge. Ends with the question.
- **1. The drawings.** Each icon on grid A at 6.3x: the g5 skeleton beside the drawing, with the construction shown as orange outlines of the simple shapes (cuts dashed). Below that:
  - real size at 24, 12 and on the 32 pin, and 3x;
  - a line on how it's built, and the curve count.
  The + and the Star are shown beside the g5 1.5px strokes.
- **2. The corners, on the drawings.** All 6 icons × 3 laws at 3.5x and at real size (24, 12, the 32 pin), plus two close-ups per law (the museum's beam and columns; the conifer's notches).
  - The clearest difference, stated on the sheet: by joint and pressed turn the spaces between the columns into small arches and fill the conifer's notches. Even wear keeps them square.
  - Plainly: at real size the three laws are close.
- **3. In the app, real size.** The three laws stacked in list rows (with today's visited stamp), on a map with a selected pin and today's sticker, in the chips and on the + badge.
- **4. The air.** 2px (box 12) vs 1.5px (box 12.75, every line still 1.5), on the grid at 4x, at real size, on the selected pin and in a row. Plainly: it's half a pixel a side. The cost is named: at 12.75 the guides fall off the lattice.
- **5. The grid, pressure-tested** (to your turn-18 B):
  - held and broke, icon by icon (all six);
  - each of the six proposed changes, shown before and after on the icons it fixes;
  - the curve rule shown with points and handles;
  - "none is a one-icon exception" (change 2 removes one);
  - no earlier batch to re-check, so it says so;
  - the open items.

## How the drawings answer his brief

- **"at their root simple shapes, but joined together":** every part is a rectangle, a triangle, a two-point curve or half a ring, united into one solid path with real counters.
- **"minimal bezier curves with perfect architecture":**
  - each bowl is two cubics between its extremes, with flat or upright handles;
  - each conifer branch is one curve a side;
  - curves per outline, by joint: café 16, bar 12, museum 23, nature 27. Most of these are the corner rounds (one cubic each);
  - points sit on a 0.25px lattice.
- **"personality in the approach to how strokes are connected and curve":**
  - the cup's ear hangs on its shoulder;
  - the coupe's bowl flows into the stem;
  - the conifer's branches droop to their tips;
  - the saucer's ends lift.
- **"slight rounding … not 100% consistent … screened or pressed":** the three laws are shown on these drawings, and each gives a different radius per kind of corner.
- **The four details that cost the read at 1.5:** not drawn (change 3, shown with and without on the café and bar). The rim and the drink line are gone; the cup and the coupe read from their silhouettes. The bag and the bed are in batch 2.

## Grid pressure test (sheet 5)

**Kept:**
- 1.5px everywhere;
- the box and the TOP and BASE guides (every icon uses them);
- MIDDLE (the cup and saucer centres on it exactly).

**Changed (proposed):**
- **Cut 1px, not 0.9.** 0.9 never lands on the lattice.
- **Spaces between repeated parts = the line.** The museum gets four columns; the skeleton's special spacing allowed three.
- **No hairline cuts inside a mass.** Detail comes from the silhouette and from open counters. This replaces "small details only at w ≤ 1.5".
- **A curve rule:** a curve runs between its extremes and ends on the lattice or at a corner.
- **Angles:** straight lines keep "orthogonal, 45° or whole-pixel slope"; curves follow the curve rule.
- **App icons are drawn as shapes**, not strokes, so they can take the corner law.

**Open:**
- **SHOULDER (4) held in two of four** (the coupe's bowl, redrawn shallower to end on it, and the museum's beam). Batch 2 tests it again.
- The corner law and the air are his picks.
- **The lattice:** a 1.5px line centred in a 12px box can't sit on whole or half pixels, so its edges fall between dots on a 3x phone.

## Craft checks

- **Slivers (your g2 must-do) are fixed in the engine.** A straight run under 0.2px between two rounded corners is dropped.
  - `microseg.py` on `svg/g6`: 0 slivers, down from 81 before the fix.
  - `boards4.js` now writes its SVGs only when run itself, so the archived g4 SVGs don't change.
- **Every drawing fits:** the furthest ink is 8.38px from the centre, against a 10.5px inside edge of the ring.

## My read (not on the sheets)

- **The drawings are clearly closer than the skeletons at real size.** The cup and the coupe now read as objects, and the museum reads as a column front.
- **Corners:** by joint gives the most "carved" character: the column arches and the + crossing. Even wear softens the cut ends, which reads friendlier but less precise; pressed is the most "printed".
- **Air:** I'd expect him to see little difference at real size.
- **Weakest drawing:** nature. At 12px its four tiers crowd, and batch 2 may want three at the chip.

## The ask

"Are these closer drawing-wise? If so: which corners (by joint, even wear or pressed), and 2px or 1.5px of air?"
