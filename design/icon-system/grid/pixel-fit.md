# Sharp at 2x and 3x

## Round 3 (10-26, canvas v259): the grid itself, no fitting pass

Owner, on the fitting pass (comment on the board, verbatim): "no i want the base grid to make great icons without extrawork". This supersedes the fitting pass below (rounds 1 and 2 are kept as history) and the director's turn-174 fixes where they differ.

**The arithmetic.** A position is whole at 2x (his 5K) and at 3x (iPhone) only if it is a whole CSS px: x*2 and x*3 both whole means x is whole. 1/2px lands only at 2x, 1/3px only at 3x. So a grid that is sharp at both with no per-size or per-screen work must have:
- **Every core edge on a whole px**, so the line and every part are a whole number of px. **1.5px cannot satisfy the rule at any size it is drawn at 1:1.** "Weight wise 1.5" can survive only as a proportion: line : badge = 1/16.
- **A 1px lattice**, not 1/3px. Of the coin, halves, quarters and eighths come out whole; thirds and sixths round to the nearest px (the proportion series loses its exact thirds and sixths). Posts can't be 5/6 of the line, so a post equals the line (or 1px).
- **Optical centring in whole px.** A symmetric glyph centres exactly when its centred stem is an even width (2px is); an odd one needs a half-px centre, which fails at 3x.
- **Each glyph shown only at 1:1 (or 2x, 3x).** One drawing can't serve 24, 18 and 23: at 18 its edges would need to be every 4px of the 24 grid, at 23 every 24px. So 18 and 23 go: the selected pin grows its ring, not the glyph. The 12px chip can't reuse a 2px-line drawing (half of it is 1px, but every edge would need to be on even px): it needs its own drawing. 72 (a showcase) becomes a whole multiple.
- **Where no grid can satisfy it:** curves, diagonals and tips (the star, the pediment, the tree's tiers) never land whole. The owner's own words allow it ("subpixels are fine in some cases").

**The options** (src/whole-grid.js; previews: the approved six moved once onto each grid, not yet redrawn; the star keeps its drawn line). Every straight edge is sharp at 2x and 3x in all three (0 soft edges, against 41/40 of 50 today):
- **A: 24px badge, 2px line.** A third heavier than chosen (line : badge 1/12). Counters shrink (the cup's ear closes in the preview); posts drop to 1px. Ink +19% (café) to +29% (+).
- **B: 32px badge, 2px line. Recommended.** The approved proportion exactly (1/16); everything a third bigger. Costs size, not weight: badges 32 in rows and on the map, the selected pin 40 (ring grows, glyph 1:1). The chip at 16px with a 1px line keeps the proportion (its own drawing). Posts become the line.
- **C: 24px badge, 1px line.** A third lighter (1/24); the + loses 38% of its ink.
- Not offered: 1.5px on a 1/2px lattice (sharp on the 5K, soft on iPhone) and 4/3px on a 1/3px lattice (the reverse): each fails one screen.

Checks on the previews (fair / join): B is clean except the museum (12 fair faults, the capital flares, which go to the flare redraw) and the bar (2); A and C carry more because their snaps change widths in place. These are snaps, not redraws: the engine would redraw on the chosen grid.

Board: "Sharp at 2x and 3x" (`simplify/boards/Grid7Sharp.dc.html`, from `src/pixel-fit-board.py`), Start item 6. Images: `stills/wholegrid/raw/`; outlines `svg/wholegrid/`.

---

## Rounds 1 and 2 (superseded): the pixel fit

Owner, verbatim: "additionally, the long play is an iphone app, so we need to resolve the subpixel issue. subpixels are fine in some cases, but in core dimensions and core line landings the fuzziness is tough. and while i am also testing on iphone (even though you say nobody has looked) i am also using a 5k LG display on mac...so im seeing these in high res no matter where i am looking."

Standing decisions kept: the 1.5px monoweight line, optical centring per icon, the proportion system, the six as approved, programmatic only. Nothing in the drawings or the engine changed: the fit is a separate last pass.

Canvas board: "Sharp at 2x and 3x" (Grid concepts page). Code: `src/pixel-fit.js` (the pass), `src/pixel-fit-run.js` (measure + checks), `src/pixel-fit-crops.js` (Chromium crops), `src/pixel-fit-crop.py`, `src/pixel-fit-sheet.py`. Output: `svg/pixelfit/<icon>-<size>@<dpr>x.svg` (fitted, all six at 12, 18, 23, 24, 72 at 2x and 3x), `svg/pixelfit/measure-rank.json`, `stills/pixelfit/` (raw crops, glyph crops, `sheet.png`, `fuzz.json`).

## 1. What lands between device pixels (measured)

Densities: the 5K at its default ("looks like 2560x1440") is 2x; iPhones are 3x. A whole device pixel is 1/2px at 2x and 1/3px at 3x, so the only positions whole at both are whole CSS pixels. The six's paths are copied from the live Now board (the approved 24 row); sizes are the 24 drawing shown at 12, 18, 23, 24 and 72px.

Core edges: every straight upright or level edge (0.4px or longer) and the extremes of every round with a radius of 3/4px or more (the bottom of a bowl, the side of the cup's ear). 50 across the six (the star has none: it is all diagonals and tips).

| at | soft edges (over 1/10 device px off) | near half a pixel (1/3 or more off) |
|---|---|---|
| 24 @2x | 41 of 50 | 13 |
| 24 @3x | 40 of 50 | 9 |
| 12 @2x | 35 | 19 |
| 18 @3x | 41 | 19 |
| 23 @2x | 45 | 27 |
| 72 @2x | 43 | 28 |

Why, in one line each:
- **The line at 3x.** 1.5px is 4.5 device px: if one edge is whole the other is half. Every slab, rim and ring wall has one soft edge on an iPhone.
- **Posts at both.** 1.25px is 2.5 device px at 2x and 3.75 at 3x: never whole.
- **Optical centring.** Each glyph is moved by its own optical offset (Café 7.944, Bar 8.079 ...), which takes the whole 1/3px lattice off the device grid.
- **Solved sizes.** Positions scale until the outline meets its cut (to 1/1000), so interior edges land on arbitrary fractions.
- **Symmetric odd widths.** A 1.5px stem centred on 12 at 2x is 3 device px about a whole pixel: both edges at half.
- **The badge ring.** 1.5px with its outer edge on the badge's edge: the inner edge is half a pixel at 3x.

Worst offenders at 24 (device px off a whole pixel, longest runs first):
1. Museum, the plinth's bottom edge (9.6px long): 0.43 at 3x, 0.38 at 2x.
2. Bar, the foot's flat bottom: 0.49 at 2x; the clear band (3/4px) is 1.5 device px at 2x, so it prints as one grey row instead of a gap.
3. Add, both stems at 2x: 0.48 (a centred 3-device-px stem).
4. Museum, the columns (1.25px): 0.42 to 0.44 at both.
5. Café, the ear's counter, top and bottom: 0.43 at 2x.
6. Nature, the trunk's foot: 0.46 at 2x.

Read from real Chromium pixels (`fuzz.json`: of the pixels a glyph touches, the share that are neither ink nor paper): Café 33% at 2x / 24% at 3x, Bar 43 / 28, Museum 30 / 22, Nature 33 / 25, Star 34 / 23, Add 48 / 31.

## 2. The rule

A final fitting pass, per render size and per density (like an @2x and an @3x asset). In the order the pass runs:

1. **Line and part widths are whole device pixels per density.** Each width is read as its token (to 1/12px) and rounded: 1.5px is 3 device px at 2x and **5 at 3x (1 2/3px)**; a post (1.25px) is 2 at 2x, 4 at 3x. A tie (exactly half over) goes by rank: the line and heavier up, thinner parts down, so a post stays thinner than the line at both densities. Same token, same width, everywhere in the icon, and the badge ring takes the same width as the line.
2. **Every core edge lands on a whole device pixel.** A stem's first edge goes to the nearest pixel and its far edge is first + fitted width. A lone edge (an outside edge, a round's extreme) goes to the nearest pixel.
3. **Optical centring is itself snapped:** the whole glyph moves by under half a device pixel first (the run-weighted mean phase of its edges), so the drawing's own lattice comes back onto the grid.
4. **Symmetric stays symmetric:** a glyph drawn symmetric is fitted on its left half and mirrored. Its centre goes to the nearest whole or half pixel; a stem standing on the centre decides which (an odd device width needs a half-pixel centre).
5. **A step never closes:** a short step that would snap to nothing (a capital past its column, at a size where the step is under a device pixel) keeps one device pixel.
6. **Everything else stays subpixel and is carried:** curves, diagonals, the star's points, the tips, the rounds at corners. Per contour, each point moves by straight interpolation between the fitted edges on its own contour (TrueType's IUP), so a curve is stretched with its edges and never bent. Handles move with their node, and any node that ran on smooth runs on smooth again.

Which edges are core: straight uprights and levels (outer edges, posts, slabs, rims, a counter's sides) and big rounds' extremes. Which may stay subpixel: curves between those extremes, diagonals, tips, and corner rounds.

## 3. Before and after (built and measured)

All six at 24 (and 12, 18, 23, 72) at 2x and 3x. Soft core edges at 24: **0 of 50 at both densities** after the fit (from 41 and 40). From Chromium pixels, the grey share before → after (2x / 3x): Café 33→14 / 24→11, Bar 43→17 / 28→13, Museum 30→10 / 22→5, Add 48→2 / 31→3, Nature 33→27 / 25→23 (its tiers are diagonals, left soft by the rule), Star unchanged (no core edges). The bar's clear band reads as a gap again at 2x. Phone-readable sheet: `stills/pixelfit/sheet.png`.

What it costs, measured at 24:
- **The line weighs differently by density:** 1.5px at 2x, 1 2/3px at 3x (+11%). Ink area changes -7.5% to +7.3%.
- **Optical centring moves** (the ink centroid) by at most 0.35px at 2x (the +: centred on a half pixel, 1/4px across and 1/4px down) and 0.28px at 3x (Café).
- **Proportions drift by up to one device pixel:** the museum's capital step is 1 1/4 device px at 3x and becomes 1; the coupe's 3/4px band becomes 1/2px at 2x and 2/3px at 3x; a post at 2x is 1px (2/3 of the line, where the system says 5/6).
- **No point moves more than 1.2 device px** (0.4px at 3x, 0.6px at 2x).

### Checks on the fitted outlines (at 24)

- **join-check (the kink check): 0 faults** on all 12 (six icons x two densities).
- **fair-check:** Bar, Star, Add clean at both; Café 1 at 2x (a KNEE 2.08 against a limit of 2); Nature 2 at 2x (JUMP 0.36 against 0.35); Museum 4 at 2x and 6 at 3x, all at the capitals' flares: the flare's step can't keep its exact angle when the step becomes a whole number of device pixels, and its rounds were drawn for that angle. At 72 @3x everything is clean.
- **jitter (the fit itself; the input nudged up to 0.02px, 30 times):** the fitted shape is the same in every rebuild for 4 of 6 icons at both densities. Café at 2x (6 of 30) and Bar at 3x (4 of 30) flip where an interior edge sits within a twelfth of a device pixel of a half: both results are equally sharp, they differ in which pixel. For a frozen drawing the fit is deterministic (the assets are generated once from the approved outline).

## 4. What is still open

- **The 3x line: 5 device px (1 2/3px, chosen) or 4 (1 1/3px).** 4.5 has no sharp answer. 5 keeps posts visibly thinner (4) and suits a mark that already reads light; 4 matches the 2x weight's darkness more closely at small sizes. `fit(d, { tie: 'down' })` builds the other.
- **The museum's capitals.** Make the step a lattice length (1/3 or 2/3px) in the drawing and its rounds survive the fit at every size. Not done: the drawings are approved.
- **12px (the filter chip).** At 2x the line is 1.5 device px and goes to 2 (+33% darkness). A per-size line, or a separate drawing at 12, would serve it better than any fit.
- **Shipping:** iOS asset catalogs take @2x and @3x files, so the fitted outlines ship natively. On the web, inline SVG would pick the fit for the screen with a resolution media query; not built.

Not done on purpose: no change to the drawings, the engine, the canvas's other boards, or `index.html`.
