# The grid

How every Triplet icon lands on the screen. Draw the icon first, the way the set is drawn (the v264 drawings). Then the build
lands it on the iPhone's pixels at each size it ships, by the rules below. Nothing is redrawn to fit the grid.

Code: `src/one-side.js` (the rules), `src/back-to-drawings.js` (the set), `src/back-check.js` (the check).
Board: "The grid" (canvas v275, Grid concepts page). Written 10-27.

## 1. The grid

| | value |
|---|---|
| Grid | one iPhone pixel: ⅓px (iPhones are 3x) |
| Frame | 24 × 24, its centre at 12, 12 (a grid point at every size below) |
| Master size | 24 |
| Other sizes | 18 (the badge glyph in the app), 12 (the filter chip): their own builds from the same drawing |
| Stroke | 1½px at 24 |
| Counter minimum | 1px at 24 and 18; ⅔px (2 iPhone pixels) at 12 |
| The 5K (2x) | a check, not the target |

## 2. The rules

1. **Build each icon for the size it ships at.** The landing step is part of the build, at every size, not a pass applied afterwards.
2. **Put outer edges on the grid.** Every straight edge that faces the outside of the icon, and the extreme of every curve with a
   radius of ¾px or more (a bowl's bottom, the side of a handle), goes to the nearest iPhone pixel. No edge moves more than ⅙px.
3. **Put one side of every stroke on the grid: the outer side.** The part keeps its width; the inner side falls where the width
   puts it. At 24 the 1½px stroke is 4½ iPhone pixels, so its inner side sits half a pixel off. That is the design.
4. **Leave inner edges, counters and cut-outs as drawn.** They are sized by the drawing, never snapped.
5. **Open a short counter by moving the stroke beside it, never the mass.** A counter is a space closed on every side (the
   coupe's band, the cup's ear). Below the size's minimum it opens: the stroke moves outward, its width kept.
6. **Keep a centred part centred.** A symmetric icon stays exactly on its centre, its right half the mirror of its left. A part on
   the centre line keeps its width and stays centred, even when that leaves both its sides off the grid (a 1½px stem at 24).
7. **Never snap curves, diagonals, points or corner rounds.** They ride on the edges either side of them, so a curve keeps its
   shape and a join stays smooth.
8. **Give each size its own stroke.** At 18 and 12, the stroke is the drawing's weight at that size, rounded to whole iPhone
   pixels: 18 → 3 (1px), 12 → 2 (⅔px). Both its sides land. A stroke on the centre line takes the nearest even count (18 → 4,
   12 → 2), so it lands and stays centred. A stroke changes on its inner side; the outer side stays put.
9. **Judge weight by eye at true size, on the iPhone.** Each size should read as the same weight as the 24.
10. **Marks live at 1:1 in their own slot, never in a ring.** The star is one drawing, 12px tall, in the row and on the tag. The +
    is two 1½px strokes, arms equal, 13½ across; its centre is drawn at 12 1/12 so one side of each stroke and one end of each
    arm land, and the button's centre sits on the mark's centre, so it is dead centre in its circle.

## 3. Writing a new icon

1. Draw it with the engine like the set (roots, joins, rounds), at 24, with its strokes at 1½ and counters at least 1px.
2. If it is symmetric, say its centre (`sym: 12`).
3. Build it with `land(d, { size, sym })` at 24, 18 and 12 (marks at 24 only).
4. Look at it at true size on the iPhone (`src/back-shots.js`), beside the set. Run `src/back-check.js` for which edges land.
   The check is information, not the goal.

## 4. The set (v264 drawings, landed)

| | what changed from v264 | ink at 24 vs v264 |
|---|---|---|
| Café | nothing in the drawing; landed | +0.2% |
| Coupe | the band opens ¾ → 1px (rule 5 lifts the rim ¼px); the drink stays 2½ | −0.4% |
| Museum | three columns at 1½, two openings of 2.14 (were four, at 0.93); same box, slabs, roof, capitals | −6.8% |
| Tree | nothing; landed | +0.3% |
| Fork and knife | gaps between the tines 1px (were ¾); the knife's edge 1¼px past its handle (was ¾) | +6.1% |
| Star | one drawing, 12px tall (was 14 in the row, 13.4 on the tag) | −13% (smaller) |
| + | strokes 1½ (were 1⅔), 13½ across | −7.1% |

## 5. The check (`node src/back-check.js`)

Edges that land on an iPhone pixel, the five badge icons and the two marks at 24, new vs v264:

| kind | now | v264 |
|---|---|---|
| outer edges | 38 of 42 | 6 of 41 |
| free posts (one side each) | 6 of 12 | 3 of 20 |
| stroke inner sides | 0 of 8 (by design) | 1 of 7 |
| centred parts | 4 of 14 (the +'s one side each) | 0 of 4 |

At 18: outer 35 of 37, everything else lands. On the 5K at 24: outer 14 of 42 (v264 16 of 41): as sharp as before.
join-check: clean on all seven. fair-check: the museum's capitals 8 marginal KNEEs (2.50 against a limit of 2.48) on top of
v264's 4 TAILs, and 2 KNEEs at the coupe's band ends; none shows at 24, 72 or 192.

## 6. Retired

- Whole-pixel parts (v266 to v274): 2px solids, slab and post rules in whole px, the box limits, the give order, the ¼px offset,
  option menus. Kept from them: counters at least 1px, the knife's edge, one star, the + dead centre in its button.
- `src/the-grid.js`, `src/pixel-shapes.js`, `src/whole-grid.js`, `src/placement.js`, `src/pixel-fit.js`'s fitting pass: kept to
  rebuild old boards. `pixel-fit.js`'s edge finder is used by the check.

## Open

- The app draws the badge glyph's 24 box at 18px and the chip at 12px today: it should take the 18 and 12 builds.
- Not yet built on this: the bed, shopping.
