# The grid

The one pixel grid every Triplet icon is drawn on, and the rules that put each kind of part on it. A new icon follows these
rules and nothing else; every number in it is a grid value, a whole px, or a proportion taken to the grid.
Code (the one source of truth): `src/the-grid.js` (`GRID`, the rule functions, the six). Check: `src/grid-check.js`.
Board: "The grid" (canvas v273, Grid concepts page, after Start here). Written 10-27; round 2 the same day (director turn 192).

Owner, verbatim: "Why is there no grid!!! This whole fucking exercise has been about creating a system and grid!! For
days!" · "We talked about doing the counters 1 or 2 px I am so tired of this back and forth. I need a grid and visual system
that creates coherent icons based on our rules" · "I want them to be as sharp as possible and strokes to be 1.5px. If it's
not a strike it doesn't have to be 1.5px! Just has to read the right weight" ("strike" = stroke).

## 1. The grid

| | value | why |
|---|---|---|
| Cell | 1px | A whole CSS px is the only position sharp on both the 5K (2x) and an iPhone (3x). |
| Frame | 24 × 24, drawn and shown 1:1 | The grid only holds 1:1. (The app draws the badge glyph's 24 box at 18px today: the build must show it 1:1.) |
| Centre | the lines x 12, y 12 | A grid line, not a cell, so a centred part is an even width (2, 6, 10). |
| Badge | ring 1½ (a stroke, outer edge on the frame); live circle ⌀16 (4..20); coin ⌀12 (6..18) | Kept from the master grid. |
| Stroke | 1½px | A line in the thing: outer edge on a line, inner edge on the half line. Sharp on the 5K; the inner edge is soft on an iPhone. |
| Solid | 2px or more | A body or a member that carries or stands: whole px, never thinner than the stroke. |
| Gap | 1px | The space between two parts: a cut, an opening between columns, the coupe's band (rim / drink). |
| Counter | 1 or 2 across | A hole inside one part: what its root leaves. A 1-across counter is at least 2 long (1 × 1 reads as a dot). |
| Overhang / protrusion | 1px | What reads by sticking out does so by a whole px. |
| Capital | past its last post a slab drops to half its height (2 → 1), the post flaring ½ into it, one curve | The cap rule's half, applied to a held slab; a curve, so no edge to land. |
| Limit | each icon's approved box rounded UP to whole px (a centred width to the next even); points count inside | Never smaller than approved, at most 1px bigger (2 for a centred width). Café 11 × 9, coupe 10 × 9, museum 10 × 10, tree 8 × 12. |
| Weight | ink within 10% of approved, then by eye in the row of six | Owner: "just has to read the right weight". Marks (sized by their slot) by ink per box area. |
| Marks | 1:1 in their slot: the star 12 tall, the + 13½ across | Round 8's one star; the + as approved (13.2) to the grid. |

**Stroke or solid** (his question, "when is an icon outlined vs not", for parts): would the part still be the thing drawn as
one pen line? Then it is a STROKE: a rim, a handle or loop, a ring, the wall round a hole, a mark's outline or arms. Otherwise
it is a SOLID: a body, a slab or base, a post, column, stem, trunk, leg. Whole icons by job stay as `PROP.classByJob`.

**Weight: his lines reconciled.** "Strokes to be 1.5px": every stroke is 1½. "Nothing should go that thin": no ink under 1½.
"If it's not a strike it doesn't have to be 1.5px ... just has to read the right weight": solids go to whole px (2 or more),
and the WEIGHT GATE holds each icon's ink within 10% of approved. Round 1 of this grid made every part solid (walls and rims at
2): ink rose 16-32%. Making the lines in the thing strokes again, and letting proportions round down to fit the limit, brings
every badge icon inside the gate (table below).

## 2. How each kind of part lands

1. **Solid parts** (slab, base, post, column, stem, trunk): 2 or more, every edge on lines. Centred, a post is 11..13. A **cap**
   (saucer, foot): crown 2, ends 1 (half the crown); flat side, ends and crown on lines.
2. **Stroke parts** (rim, handle, ring): 1½, outer edge on a line, inner edge on the half line. A gap laid from that inner edge
   stays on the half line (the coupe's band). Each half-line edge is named in the build (`meta.half`) by the rule that made it;
   the check accepts no other.
3. **Gap**: 1. **Counter**: 1 or 2 across; at 1 across, at least 2 long (`counter()`, `GRID.counterLong`).
4. **Curve**: its extremes (a bowl's bottom, an ellipse's side, a tier's lowest point) on lines. Where a straight cut meets a
   curve (the rim on the bowl), the corner sits on the curve.
5. **Point, diagonal, the small rounds at corners** (the engine's law): free. They have no edge to land.
6. **Centred part**: even px (`centred()` refuses an odd one).
7. **A centred row of equal parts** (`row()`): the thing on the centre is even. 2px parts in an odd count take 1px gaps (the
   middle part on the centre); an even count takes 2px gaps (the middle gap on it).
8. **Protrusion, overhang**: whole px, ≥ 1.
9. **Proportions** (`proportions.js`, all kept): each result goes to the nearest whole px (`whole()`, `even()` for centred widths).
10. **The give order** (`give()`), when the icon then passes its limit: (1) the proportions round DOWN instead of to the nearest
    (each part a little smaller, none lost); (2) only then does a detail measured in lines (a gable's ends, a step) shrink to 0.
    The fixed units (stroke, solid, gap, counter) and his standing asks (the drink, centring, the tree) never give. If nothing
    fits, the build stops and says by how much: the grid is not bent.
11. **Placement** (`place()`): whole px only. Up or down to the optical centre (the engine's opticalY); a symmetric icon on
    the centre line; a lopsided one (the cup) to the whole px nearest its optical centre.
12. **A centred stroke**: its centre on a quarter line (k + ¼), so each edge is on a line or a half line. The + is drawn so
    (centre 12¼; edges 11½ | 13; arm ends 5½ | 19), and its frame's centre is its button's centre: dead centre in its orange
    circle (the circle has no straight edge, so its ¼px shows nowhere).
13. **Joins and rounds**: the engine's law, unchanged (`PROP.rounds.shaped` / `.line`), by the corner, never per icon.
14. **Other sizes**: only 24 at 1:1 is defined. At 48 (2:1) everything still lands. At 12 (the filter chip, ½) every line falls
    on a half px: sharp on the 5K, soft on an iPhone. Map pins at other sizes scale the 24 drawing and are not promised sharp;
    a size that must be sharp needs its own grid, not drawn yet.

## 3. The museum (his construction question)

Three 2px columns, 1px openings: 2 + 1 + 2 + 1 + 2 = 8; beam and plinth pass it by 1 each side: **10**. The middle column is
11..13, on the centre. Four can't: an even count puts an opening on the centre, so openings 2: 4 × 2 + 3 × 2 + 2 = 16.

Height, held at 10: plinth 2, beam 2 and gap 1 are fixed units. To the nearest px the columns (⅓ of the colonnade: 2⅔ → 3) and
the gable (ends 1.2 → 1, rise 1⅔ to a point) make 10⅔: over. The give order rounds the proportions down: columns 2. Total
9⅔ to the apex point; it reads **9.62** tall after the apex's round (approved 9.62). Width 10 (approved 9.78).

## 4. The six (built by `node src/the-grid.js`, outlines `svg/the-grid/`)

| | approved (w × h, ink) | on the grid | limit | weight | what the grid set |
|---|---|---|---|---|---|
| Café | 10.77 × 8.5, 56.5 | **11 × 9**, 61.5 | 11 × 9 | +9% | saucer 11 (9/5 of the 6 cup), crown 2, ends 1, gap 1; cup 6 square; ear 4/5 → 5 tall, a stroke 1½ round a 2-across hole |
| Coupe | 9.78 × 8.67, 44.8 | **10 × 9**, 49.0 | 10 × 9 | +9% | bowl ellipse 10 × 8; rim cut ⅕ of 8 = 1.6, to fit rounded down to 1: bowl 5 deep; rim 1½ (stroke), band 1, drink 2½ (as approved); stem 2 × 2; foot 6, crown 2 |
| Museum | 9.78 × 9.62, 63.0 | **10 × 9.62**, 68.7 | 10 × 10 | +9% | above; capitals drop to half the slab |
| Tree | 6.98 × 11.46, 34.3 | **7.29 × 11.21**, 35.9 | 8 × 12 | +5% | tiers as approved; trunk 1¼ → 2 (11..13), shows 2 under the bottom tier's lowest point (on a line); tips 0.16 longer (the tip round is a share of its edge) |
| Star | 14.07 × 13.39 on screen, 58 | **12.6 × 12**, 51 | its slot | +10% per area | one star (round 8), outline 1½, top tip on a line |
| + | 13.2 × 13.2 on screen, 41 | **13½ × 13½**, 38 | its slot | −11% per area | stroke 1½ (approved 1⅔: his "strokes to be 1.5px") on its quarter line |

Sizes are outline boxes after the engine's rounds.

## 5. The check (`node src/grid-check.js`)

Reads every edge of every outline (each straight level or upright run ≥ 0.4px, and each round's extreme where its radius is
≥ ¾px: `pixel-fit.js findEdges`). Badge icons: every edge on a line, or on a half line where the build names it a stroke's
inner edge. Marks: lines or half lines. Then the size against the limit and the ink against the gate. Exit 1 on any miss.
`--approved` runs it on the approved six. The star has no straight run, so for it the check proves only size and weight.

| | edges | off the grid | soft 5K / iPhone | limits | weight |
|---|---|---|---|---|---|
| approved six | 65 | 61 | 54 / 53 | | |
| on the grid | 62 | **0** | **0 / 11** (every one a stroke's inner edge on a half line) | all held | all within 10% |

Also: join-check 0 everywhere; fair-check café 3 (as round 1: at the ear), museum 4 (the capitals' TAILs, as approved).

## 6. Retired (history, not commandment)

- The ⅓px lattice (`PROP.lattice`) and the fractional class cuts (Master grid: 9.78, 11 × 8.56, 8.56 × 11, × 11/12): the
  boxes above replace them. The lattice landed at 3x only (⅓px = ⅔ device px at 2x).
- The line as the width of posts and slabs (`PROP.line.post`, `PROP.block.slab`, mix-curves `T`), and `PROP.px` (round 6-8:
  slab 2 but posts 1½, `band`, `centreOff`, `counterMin`, `mark`): `GRID` replaces them.
- Sums from the centre line (`pixel-shapes.js museum()`), which put museum E's edges on quarter px.
- Bands of ¾ and 1½; the ¼px offset; options per icon (A/B/C, D/E).
- Round 1 of this grid (v272): class boxes as the size limit, and every part a 2px solid (rims and handles too): the icons grew and darkened 16-32%.
- Kept: every proportion in `proportions.js`, the cap rule, the vessel ellipse, the joins, the rounds table, the transitions.
`pixel-shapes.js`, `whole-grid.js` and the construction path (`construction.js`, class fit) stay for history and rebuilding old
boards; new icons are written in `the-grid.js`.

## 7. Writing a new icon

1. Take its limit (the approved or agreed box, rounded up). 2. Name its roots and the widest (it takes the limit's width).
3. Sort each part: stroke or solid (the pen-line test). 4. Every size is a proportion of a root through `whole()` / `even()`;
every stroke `GRID.stroke`, every solid `GRID.solid` or more, every space `GRID.gap`, every hole `counter()`; name each
half-line edge a stroke makes. 5. Rows through `row()`, centred parts through `centred()`, heights through `give()`.
6. `place()`, `build()`, then `grid-check.js`: 0 off the grid, within the limit and the weight gate, or a rule is missing here
(add it, don't nudge the icon).

## Open

- Judged by eye, the set reads as one weight to us (opinion): the badge icons +5 to +9%, the star about the same per area,
  the + 11% lighter per area (his 1½). The owner's eye decides.
- The museum's columns are 2 tall (2 × 2 with 1 × 2 openings): squatter than approved (1¼ × 2.6). It is what the give order
  leaves at 10 tall; 3 tall needs 10⅔.
- The app: show the badge glyph 1:1 (24 box at 24px) and put the + button's centre on k + ¼.
- Not yet in `the-grid.js`: fork and knife, bed, shopping.
