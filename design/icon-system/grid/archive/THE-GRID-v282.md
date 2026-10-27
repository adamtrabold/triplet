# The grid

How every Triplet icon lands on the screen. Every icon is drawn at the size the app shows it, 1:1 in CSS px, on that size's own
iPhone pixel grid. Never scale one size's drawing to make another.

Code: `src/right-size.js` (the set, per size), `src/one-side.js` (the landing rules), `src/right-grey.js` (the check).

## The sizes the app uses

| Size | Where | Box | Strokes, posts, columns | Counters | Ring |
|---|---|---|---|---|---|
| **18, the master** | every pin and list row | the glyph's 18 box at 3, 3 in the 24px badge; the icon 10–11px across | 1⅓px (4 iPhone px) | at least 1px | badge rim 1⅓px |
| 24 | the selected pin | the 24 box at 4, 4 in the 32px badge, ink field | 2px (6 iPhone px) | at least 1⅓px | rim 2px |
| 12 | filter chips | the 12 box, no ring | 1px (3 iPhone px); a centred part 1⅓ | at least 1px; shorter ones close | none |
| star | starred row and the tag | one 18 box, bare, the star 12 tall | outline 1⅓px | — | never |
| + | the add button | 1:1 in the 60px button, centred on 30, 14 across | 2px (6 iPhone px) | — | never |

No other sizes. The app's badge places the glyph's own box 1:1 (`viewBox 0 0 18 18` at 18px); never a 24 drawing scaled to 18.

## The rules

1. **18 is the master.** Draw the icon at 18 first. Draw 24 and 12 from it, each 1:1 on its own grid, with the detail adjusted
   for the size: add detail at 24 (counters and gaps open wider), remove it at 12 (a counter under the minimum closes; the part
   goes solid).
2. **The grid is one iPhone pixel, ⅓px.** Every width is a whole number of iPhone pixels at the size it is drawn. Pick each by
   eye at that size: strokes the nearest to 1½px the grid allows; every other part the width that reads right beside its
   openings.
3. **The silhouette first.** An edge facing the outside of the icon goes to a whole px when one is within ¼px (it lands on the
   iPhone and the 5K), else to the nearest iPhone pixel. When both sides of a part face out, land one fully (the side that
   reaches a whole px, else the longer side); the width places the other.
4. **Then one side of every stroke, the outer side.** Keep the width; the inner side falls where the width puts it.
5. **Leave inner edges, counters and cut-outs as drawn.** Never snap them.
6. **Centred stays centred.** A centred part is an even count of iPhone pixels, so both its sides land; a symmetric icon is the
   mirror of itself about its centre, and its centre sits on a whole px of its box.
7. **Never snap curves, diagonals, points or corner rounds.** They ride on the edges either side of them.
8. **A part reads as what it is.** A free-standing part (a column, a post) shows clear space or overhang on both sides: a
   museum's beam and plinth run 1px past its outer columns.
9. **Marks (the star, the +) are 1:1 in their own slot, never in a ring.** One drawing per mark everywhere it appears.
10. **Judge at true size on the iPhone.** Each size reads as the same weight as the 18 beside it; the ring reads as one weight
    with its glyph.

## Writing a new icon

1. Draw it at 18 in the badge's units (the 24px badge's CSS px; the glyph's box is 3..21): strokes and posts 1⅓, counters at
   least 1, centred on 12 if it is symmetric.
2. Add it to `SET` in `src/right-size.js` and build: `node src/right-size.js <name>` writes `svg/right/<name>-18|24|12.svg`,
   each in its own box.
3. Look at all three at true size beside the set on the iPhone and the 5K (`node src/right-sheet.js <out.html>`). Adjust its
   detail per size by eye.
4. Show it on a board as the real SVG at its true size, never as an image; a larger view is the same SVG scaled as vector,
   labelled.
