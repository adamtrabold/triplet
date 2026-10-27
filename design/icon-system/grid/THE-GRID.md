# The grid

The one pixel grid every Triplet icon is drawn on, and the rules that put each kind of part on it. A new icon follows these
rules and nothing else; every number in it is a grid value, a whole px, or a proportion taken to the grid.
Code (the one source of truth): `src/the-grid.js` (`GRID`, the rule functions, the six). Check: `src/grid-check.js`.
Board: "The grid" (canvas v272, Grid concepts page, after Start here). Written 10-27.

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
| Badge | ring 1½ (a stroke, outer edge on the frame); live circle ⌀16 (4..20); coin ⌀12 (6..18) | Kept from the master grid; now on lines. |
| Solid | 2px | Every solid part's thickness: slab, post, column, stem, trunk, rim, wall, ear. The first whole px not thinner than the 1½ stroke. |
| Gap | 1px | The space between two parts: a cut, an opening between columns, the coupe's band (rim / drink). |
| Counter | 1 or 2 across, at least 2 along | A hole inside one part: what its root leaves. Under 1 × 2 it reads as a dot, so the root grows a px. |
| Stroke | 1½px | Line marks only (the +, the star's outline): one edge on a line, the other on the half line. |
| Overhang / protrusion | 1px | What reads by sticking out does so by a whole px. |
| Bevel | ½ drop + ½ flare, one curve | The capital: a curve, so it has no edge to land. |
| Point | may pass its box by ½ | An apex or tip carries less ink than an edge. |

**Class boxes** (the size limit of every icon in the class: the approved size taken to whole px, centred widths even):
Square 10 × 10 (coupe, museum; approved cut 9.78) · Wide 11 × 9 (cup; cut 11 × 8.56) · Tall 8 × 11 (tree; cut 8.56 × 11)
· marks 1:1 in their slot: the star 12 tall, the + 13½ across.

**Weight: the two owner lines reconciled.** "Nothing should go that thin" (on 1.24px posts) is the floor: no ink under the
1½ stroke. "If it's not a stroke it doesn't have to be 1.5px ... just has to read the right weight": a solid part goes to
whole px. The only whole px at or over the floor near the line is 2, so every solid part is 2 (1 is too thin; 1½ is soft).
Strokes stay 1½ (his rule), on a line and a half line. Cost, measured: the badge icons are 5 to 32% darker than approved
(table below); the marks are lighter (smaller).

## 2. How each kind of part lands

1. **Slab** (beam, plinth): 2 tall, both faces on lines. **Cap** (saucer, foot: a slab cut by one ellipse): crown 2, ends 1
   (the cap rule, half the crown); its flat side, ends and crown on lines.
2. **Post** (column, stem, trunk, rim, wall, a loop's wall): 2 wide, on lines. Centred, 11..13.
3. **Gap**: 1. **Counter**: 1 or 2 across, ≥ 2 along (`counter()`, `GRID.counterLong`).
4. **Curve**: its extremes (where it turns level or upright: a bowl's bottom, an ellipse's side, a tier's lowest point) on
   lines. Where a straight cut meets a curve (the rim on the bowl), the corner sits on the curve.
5. **Point, diagonal, the small rounds at corners** (the engine's law): free. They have no edge to land.
6. **Centred part**: even px (`centred()` refuses an odd one).
7. **A centred row of equal parts** (`row()`): the thing on the centre line is even. 2px parts in an odd count take 1px gaps
   (the middle part on the centre); an even count takes 2px gaps (the middle gap on it).
8. **Protrusion, overhang**: whole px, ≥ 1.
9. **Proportions**: every ratio in `proportions.js` stays; its result goes to the nearest whole px (`whole()`, `even()` for
   centred widths). If the box can't hold it, the box wins (`fits()`), and a point may pass by ½.
10. **Placement** (`place()`): an icon moves only in whole px. Up or down to its optical centre (the engine's opticalY); a
    symmetric icon stays on the centre line; a lopsided one (the cup) goes to the whole px nearest its optical centre.
11. **A centred stroke**: its centre on a quarter line (k + ¼), so each edge lands on a line or a half line. The + is drawn
    so (centre 12¼, 12¼; edges 11½ | 13, arm ends 5½ | 19), and its frame is placed so that centre is its button's centre:
    dead centre in its orange circle (the circle has no straight edge, so its ¼px shows nowhere).
12. **Joins and rounds**: the engine's law, unchanged (`PROP.rounds.shaped` / `.line`, `fromTable`), by the corner, never per icon.

## 3. The museum (his construction question)

Three 2px columns, 1px openings (gaps between parts): 2 + 1 + 2 + 1 + 2 = 8; beam and plinth pass it by 1 each side: **10**,
the square box. The middle column is 11..13, on the centre. Four columns can't: an even count puts an opening on the centre,
so openings 2: 4 × 2 + 3 × 2 + 2 = 16, past the box.

Height: plinth 2 · columns 3 (⅓ of the colonnade: 2⅔ → 3) · beam 2 · gap 1 · gable ends 1 (⅘ of a line, 1.2 → 1) · roof
1½ (⅓ of its run would be 1⅔; the box holds it to 10 + the apex's ½) = **10½**. Approved 9.62: the slabs were 1.04 and are
2 (+1.9), the columns 2.6 → 3 (+0.4); the box takes 1.4 back from the roof. Width 9.78 → 10 (nearest even).

## 4. The six (built by `node src/the-grid.js`, outlines `svg/the-grid/`)

| | approved (w × h, ink) | on the grid | what the grid set |
|---|---|---|---|
| Café | 10.77 × 8.5, 56 | **11 × 9**, 65 | saucer 11 (9/5 of the 6 cup), crown 2, ends 1, gap 1; cup 6 square; ear 4/5 → 5 left a 1 × 1 counter (a dot), so it grew to 6 (counter 2 × 1); walls 2 |
| Coupe | 9.78 × 8.67, 45 | **10 × 10**, 59 | bowl ellipse 10 × 8, rim cut ⅕ of 8 = 1.6 → 2 above centre: bowl 6 deep; rim 2, band 1, drink 3; stem 2 × 2; foot 6 (⅘ of the bowl over the cap's 1.155: 6.9 → 6), crown 2 |
| Museum | 9.78 × 9.62, 63 | **10 × 10.47**, 75 | above |
| Tree | 6.98 × 11.46, 34 | **7.29 × 11.21**, 36 | tiers as approved (fixed point); trunk 1¼ → 2 (11..13) and shows 2 (was 2.29) under the bottom tier's lowest point, which lands on a line; the tips are 0.16 longer each side (the tip round is a share of its edge, and the wider trunk shortens the edge) |
| Star | 14.07 × 13.39 on screen, 58 | **12.6 × 12**, 51 | one star (round 8), outline 1½, top tip on a line |
| + | 13.2 × 13.2 on screen, 41 | **13½ × 13½**, 38 | stroke 1½ on its quarter line; arm span 13½ |

Sizes are outline boxes after the engine's rounds (a 30° apex loses about ½px to its round, so the museum reads 10.47).

## 5. The check (`node src/grid-check.js`)

Reads every edge of every outline: each straight level or upright run ≥ 0.4px, and each round's extreme where its radius is
≥ ¾px (`pixel-fit.js findEdges`). Shapes must sit on lines; strokes on lines or half lines. Exit 1 on any miss.
`--approved` runs it on the approved six. Result (10-27):

| | edges | off the grid | soft 5K / iPhone |
|---|---|---|---|
| approved six | 65 | 61 | 54 / 53 |
| on the grid | 60 | **0** | **0 / 6** (the +'s half-line edges at 3x: the price of 1½) |

No named exceptions were needed. Also reported: fair-check (café 1 JUMP as before + 3 KNEEs and a SHOULDER at the ear's foot;
museum the 4 capital TAILs as before + 8 KNEEs where the longer 1px bevel meets its lines) and join-check 0 everywhere. The
KNEEs are join craft, not grid, and are open.

## 6. Retired (history, not commandment)

- The ⅓px lattice (`PROP.lattice`) and the fractional class cuts (Master grid: 9.78, 11 × 8.56, 8.56 × 11, × 11/12): the
  boxes above replace them. The lattice landed at 3x only (⅓px = ⅔ device px at 2x).
- The line as the width of posts and slabs (`PROP.line.post`, `PROP.block.slab`, mix-curves `T`), and `PROP.px` (round 6-8:
  slab 2 but posts 1½, `band`, `centreOff`, `counterMin`, `mark`): `GRID` replaces them.
- Sums from the centre line (`pixel-shapes.js museum()`), which put museum E's edges on quarter px.
- Bands of ¾ and 1½; the ¼px offset; options per icon (A/B/C, D/E).
- Kept: every proportion in `proportions.js`, the cap rule, the vessel ellipse, the joins, the rounds table, the transitions.
`pixel-shapes.js`, `whole-grid.js` and the construction path (`construction.js`, class fit) stay for history and rebuilding old
boards; new icons are written in `the-grid.js`.

## 7. Writing a new icon

1. Pick its class box. 2. Name its roots and say which is the widest (it takes the box's width). 3. Every other size is a
proportion of a root (`proportions.js`) through `whole()` / `even()`; every thickness is `GRID.solid`, every space `GRID.gap`,
every hole `counter()`. 4. Rows through `row()`, centred parts through `centred()`, heights through `fits()`. 5. `place()` it,
build it (`build()`), run `grid-check.js`: 0 off the grid, or a rule is missing here (add it, don't nudge the icon).

## Open

- The one owner question (board section 6): the coupe at drink 3 is 10 tall and +32% ink; at 9 tall the drink is 2.
- Weight: the badge icons are darker than approved, the marks lighter. Judged by eye at true size it reads as one family to
  us (opinion); the owner's eye decides.
- The app: show the badge glyph 1:1 (24 box at 24px) and place the + button so its centre is on k + ¼.
