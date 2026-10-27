# The grid

How every Triplet icon lands on the screen. Draw the icon first. Then build it at each size it ships; the build lands it on the
iPhone's pixels by the rules below. Never redraw an icon to fit the grid.

Code: `src/one-side.js` (the rules), `src/back-to-drawings.js` (the set), `src/back-check.js` (the check).

## The grid

| | value |
|---|---|
| Grid | one iPhone pixel: ⅓px. A whole px lands on the iPhone and on the 5K |
| Frame | 24 × 24, centre 12, 12, placed on whole px |
| Master size | 24 |
| Other sizes | 18 (the badge glyph in the app), 12 (the filter chip), built from the same drawing |
| Stroke | 1½px at 24; 1px at 18; ⅔px at 12 |
| Posts, stems, columns | 1¼ or 1½px at 24, by eye |
| Counter minimum | 1px at 24 and 18; ⅔px at 12 |
| Ring | 1¼px around a 24 glyph; 1½px on the app's 26px badge around the 18 glyph |
| The 5K | a check, not the target |

## The rules

1. **Build each icon for the size it ships at.** Landing is part of the build at every size, never a pass applied afterwards.
2. **Land in this order: the silhouette, then strokes, then nothing else.** The silhouette is every straight edge facing the
   outside of the icon and the extreme of every curve with a radius of ¾px or more.
3. **Put the silhouette on whole px first.** A silhouette edge goes to the nearest whole px when one is within ¼px: it lands on
   both screens. Otherwise it goes to the nearest iPhone pixel (at most half an iPhone pixel away). Never move an edge further.
4. **When both sides of a part are silhouette** (a free post, a tine), land one side fully: the side that reaches a whole px; if
   both do, the longer side; if neither does, the side nearer an iPhone pixel. The width places the other side.
5. **Then the strokes: put one side of every stroke on the grid, the outer side.** Keep the width; the inner side falls where
   the width puts it. At 24 a 1½px stroke's inner side sits half an iPhone pixel off by design.
6. **Leave inner edges, counters and cut-outs as drawn.** Never snap them.
7. **Keep counters at the size's minimum.** A counter is a space closed on every side. At 24 and 18, open a short one by moving
   the stroke beside it outward, never the mass. At 12, close it: the part goes solid.
8. **Keep a centred part centred: an even count of iPhone pixels at every size.** Both its sides land; the centre never moves.
   The centre beats the silhouette. A symmetric icon stays exactly on its centre, its right half the mirror of its left. At 18
   and 12, a centred part with an odd count goes up one, and everything either side of it moves out half an iPhone pixel so
   the openings beside it keep their width.
9. **Never snap curves, diagonals, points or corner rounds.** They ride on the edges either side of them, so curves keep their
   shape and joins stay smooth.
10. **Give each size its own widths.** At 18 and 12 every width is whole iPhone pixels: the stroke at the size's standard, every
    other part its drawn width rounded, a tie to the even count.
11. **Draw a stroke only for a line in the thing** (a rim, a handle, a slab, an outline). A part that carries or stands (a column,
    a post, a stem) is a solid: give it the width that reads right beside its openings, 1¼ or 1½px.
12. **Judge weight by eye at true size on the iPhone.** Every size reads as the same weight as the 24. The ring reads as one
    weight with the glyph inside it.
13. **Show marks at 1:1 in their own slot, never in a ring.** One drawing per mark everywhere it appears. Put a mark's centre where
    one side of each stroke lands, and place its button's centre on the mark's centre. A mark whose centre is not on a whole or
    half px keeps its edges on iPhone pixels only.

## Writing a new icon

1. Draw it with the engine like the set, at 24: strokes 1½, posts 1¼ or 1½, counters at least 1px.
2. Name its centre if it is symmetric (`sym: 12`).
3. Build it with `land(d, { size, sym })` at 24, 18 and 12 (marks at 24 only).
4. Look at it at true size on the iPhone and the 5K (`src/back-shots.js`) beside the set. Run `src/back-check.js` to see which
   edges land, the silhouette on its own. The check is information, not the goal.
5. Show it on a board as the real SVG at its true size, never as an image; a larger view is the same SVG scaled as vector.
