# Grid: notes


## The live Grid concepts page (10-26 simplification, canvas v255)

Owner: "canvases are too long not everything is showing. do we really need this much content? simplify my view to only important information and concise breakdowns". Supersedes the v236 layout below. Two titled rows, every frame set to its rendered height (Chromium), none over 2,420px:

- **Row 1 · Waiting on you** (`gridRow1`, y 0; boards at y 300): Start here (`Grid7Start`, 856: where things stand in 3 lines, then 4 open questions) · Now: where the icons stand (`Grid7Now`, 860 wide, 1170: the approved six + fork and knife, bed, bag (unsolved) at 24 and 72; the eight root kinds as close-up crops of those drawings, one line each; proven / not yet).
- **Row 2 · Decided** (`gridRow2`, y 1590; boards at y 1890): The master grid (`Grid7Master`, 2213: badge, classes, fitting, blocks, the line; its joins figure and rounds table moved to Rules) · Rules (`Grid7Rules`, 2417: Construction's 20 rules condensed, the joins figure and the rounds table).
- **Archive**, row "Before the 10-26 simplification" (`archiveG7beSimplify`, y 197700; boards at 198000): `Archive-G7be-*`: old Start, the master grid as it was, Originals, and NewIcons (2 parts), Between (4 parts), Construction (3 parts), sliced at their own section boundaries because they were taller than a frame can be (8000px; Between was 20,658, Construction 16,182). Slices are lossless (same text, SVGs and element count as the originals). `Grid7Between`, `Grid7NewIcons`, `Grid7Construction` and `Grid7Originals` are gone from the live page.
- Questions dropped from Start as superseded (still on the archived boards): blind round 1's family read of the bed and person (the bed was rebuilt in the mix), "the glass on a plate" (the cap rule), "does Joins connect the museum" (capitals are now a root).
- Code: `simplify/build.py <live project dir> <out root>` (copies icon paths from the live boards; nothing redrawn), `simplify/measure.js` (Chromium heights), `simplify/layout.py <live canvas.json> <out root>`. Published boards in `simplify/boards/`. A new round: update `Grid7Now` and `START_QS`; keep each board under ~2,400px; move the old Now to the Archive.

## Sharp at 2x and 3x (10-26): round 4, canvas v261, placement only (current)

Owner: "lets just keep the line weight and stuff where it was and just opimize point placement as possible. the other options look like shit". Widths kept; only positions move, once, in the drawings (`src/placement.js`, board from `src/placement-board.py`). Soft core edges 107 -> 67 of 130 (2x+3x); max move 0.25px. A/B/C archived (`Archive-G7bf-WholeGrid`, y 210000). Details: `pixel-fit.md` round 4.

## Sharp at 2x and 3x (10-26): round 3, canvas v259, the grid itself (rejected)

Owner: "no i want the base grid to make great icons without extrawork". Whole px is the only position sharp at 2x and 3x, so the line can't be 1.5px; options A (24, 2px), B (32, 2px, recommended: his proportion), C (24, 1px) in `pixel-fit.md` round 3; code `src/whole-grid.js`. The fitting pass below is superseded.

## Sharp at 2x and 3x: the pixel fit (10-26, canvas v257, superseded)

Owner: "the long play is an iphone app, so we need to resolve the subpixel issue ... i am also using a 5k LG display on mac". A last pass outside the drawing logic (`src/pixel-fit.js`) fits each outline per render size and density: widths to whole device px (line 3 at 2x, 5 at 3x; ties by rank), core edges to whole device px, centring snapped, symmetry kept, curves carried by per-contour interpolation. At 24: soft core edges 41/50 (2x) and 40/50 (3x) -> 0. Full write-up, costs, checks and open questions: `pixel-fit.md`. Board `Grid7Sharp` (x 5040, y 300, 940 x 2246) on the Grid concepts page, item 6 on Start; source in `simplify/boards/`.

## Round g3 (2026-10-16), after the owner: "I don't see a single grid" and "what about the interior?"

- **Sheets show the grid as a grid:** outside (circle, air, live area, keyshapes, pixel or ring structure), inside (guides with all 13 overlaid), the 12px chip grid, and corners. Icons are secondary.
- **Two grids:** A pixel keyline (box 6–18, TOP 6, SHOULDER 10, BASE 18, axis 12; by-joint corners; Ø16) and B radial seal (rings r3/5.5/8.5, chords 5.5/18.5, 15° rays; even-wear corners; Ø17). Both hand over to one 12px chip grid (6 × 6 modules of 2px).
- **The interior system** (shared): 2px lines; parts in whole px, 2/4/6/8/12 by default; gaps only 1px or 2px; holes ≥ 2px (the ⌘'s loops are the exception); circle radii 1.5/2/3/4. Precedent for shared horizontal guides: type design's baseline, x-height and cap height.
- **Skeletons rebuilt to obey the interiors:** `src/picks3.js`. Sheets: `src/boards3.js` → `cards-g3.html`, `stills/g3-*`, `svg/g3/`. The g2 canvas boards are on Archive.

## Round g2 (2026-10-16), after the director's g1 score (7)

- **One frame, the team's call:** a drawing per size; 24 and 32 on the pixel grid; 12 on the 2px module. Why: B's one-drawing chip broke "but also make sense on their own" at 12 (g1 card 2).
- **Two choices for the owner, made visible:** the corner law and fullness. The g1 laws differed by tenths of a pixel. The g2 laws put the softness in different places (joins / silhouette / inside corners), so they differ in kind at 4x and on the 32 pin; at 24 the difference is texture, and the card says so. Numbers in `src/frame.js` (`LAWS`, `LAW_INFO`).
- **Fullness:** Ø16 (2px of air) vs Ø18 (1px). Ø17 was built and dropped from the cards because it moved each edge only half a pixel.
- **32 pin and Ø18:** `refit()` scales the 24's parts exactly, keeps every 2px line at 2px about its own centre, and keeps any part that touched a line touching it. A first fit; pixel snapping is drawing-step work.
- **⌘:** 2px like every line (the director withdrew the heavier-line condition; owner: "its heavy enough").
- Files: `cards-g2.html`, `stills/g2-card-*.png`, `svg/g2/<law>/`, `src/frame.js`, `src/boards2.js`. g1 stays as history (`cards.html`, `stills/g1-*`, `svg/A-pixel` …, `src/concepts.js`, `src/boards.js`); the g1 canvas boards are on the Archive page.

# Round g1 (2026-10-16)

Product designer (icon specialist). Owner, verbatim: "we're not at drawing step next, next step is defining the grid"; "lets not focus on differentiation yet we aren't making final icons here"; "i want more than one concept." His build brief is quoted in full on card 0 and in `../owner.md`.

## What's here

- `cards.html`: the review as phone cards (390 wide). Stills: `stills/g1-card-0..6.png` (3x), plus `g1-card-5-1x.png`.
- Canvas: https://claude.ai/artifact/SVKZ9PpaMCKUpk7Ks622jW, page **Grid concepts** (7 boards, the same content at 760 wide).
- `svg/<A-pixel|B-seal|C-press>/<pick>-24.svg` and `-12.svg`: every skeleton as a single-path SVG (currentColor, real holes).
- `src/`: the code. `engine.js` (shapes → one joined outline → corner law → path), `picks.js` (the 13 skeletons per grid), `concepts.js` (frames, rules, corner laws), `boards.js` (writes the cards, canvas boards and SVGs). Run: `npm i paper@0.12.18` in a tools folder, then `TOOLS=<that folder> node src/boards.js [canvasOut]`.
- `handoff.md` and `sketches/grid-lib.js` are the previous designer's WIP. I used its research and size facts and its corner ideas (A's joinery and C's press come from there); the code is new.

## Measured in index.html (this branch)

- Row badge and near pin: `badgeHtml()` (5264). 24px circle, rim 2, inside Ø20; the glyph box is `min(field-2, max(18, field-4))` = 18.
- Selected pin: 24 + `MARKER_HI_DELTA` 8 = 32, rim 2.5, inside Ø27, glyph box 23, colours inverted.
- Filter chip: `.chip-glyph` 12×12 (1148), via `glyphHtml(cat, 12)`.
- Far pin 16 (`MARKER_SIZE_FAR`), no glyph. The + : 26.4px glyph at stroke 1.8182 = 2.00px (2850, `setAddBtnGlyph`).
- Today's glyphs are one 24-unit symbol scaled: a 2-unit part is 1.5px at 18 and 1px at 12.

## Research (sources)

- Material system icons: 24dp grid, 20dp live area, 2dp padding; keyline shapes for circles, squares, rectangles; 2dp stroke. Secondary sources give a 2dp default outer radius with inner corners square, which is precedent for treating outside and inside corners differently. https://material.io/design/iconography/system-icons.html · https://designsystem.tech.gov.sg/foundations/iconography
- IBM UI icons: whole-pixel coordinates; stroke weight changes by size. https://www.ibm.com/design/language/iconography/ui-icons/usage (via `handoff.md`)
- Fluent: a separate drawing per size. https://fluent2.microsoft.design/iconography (via `handoff.md`)
- SF Symbols: small/medium/large scales; a variable template of three source designs interpolates the rest, and only works when paths correspond point for point; margins per variant. https://developer.apple.com/documentation/uikit/creating-custom-symbol-images-for-your-app · https://developer.apple.com/documentation/technologyoverviews/custom-sf-symbols
- Aicher, Munich 1972: orthogonal and 45° grid; Holt's critique that limbs mixing orthogonal and 45° parts can't keep one thickness. https://eyemagazine.com/blog/post/this-sporting-myth (via `handoff.md`)
- Cartographic minimum dimensions (design for the smallest scale): Ledermann 2022, TU Wien (via `handoff.md`).
- Ink traps and spread: Bell Centennial (Matthew Carter, 1975–78, AT&T directories) cut notches at joins so ink spreading on newsprint fills them at small sizes. https://en.wikipedia.org/wiki/Bell_Centennial · https://www.typeroom.eu/matthew-carter-10-things-to-know-about
- Letterpress "ink squeeze" (the squeegee effect): ink pushed to the edges of the line by impression pressure. https://www.nist.gov/glossary-term/47691 · https://briarpress.org/49058
- Screen print: mesh count governs edge definition; dot gain fills fine detail. https://repository.rit.edu/theses/5056 · https://lawsonsp.com/blogs/education-and-training/screen-printing-mesh-count-production-guide
- Figma MCP write tools (beta): https://developers.figma.com/docs/figma-mcp-server/write-to-canvas (via `handoff.md`).

## Decisions and reasons

- **Three concepts that differ in kind** (frame, size strategy, shape vocabulary, corner law), not one grid at three paddings. A: pixel grid, a drawing per size, corners by joint. B: polar grid, one drawing plus a 2px pen, corners by even wear. C: the 2px module, smallest size first, corners by press.
- **Skeletons are real single paths.** Simple shapes joined by booleans, then the corner law. No paper-coloured fake holes (they broke on the navy selected pin before).
- **One cubic per rounded corner,** sized so it approximates a circular arc. Curves are counted per glyph on the cards, because the owner asked for "minimal bezier curves".
- **Corner radii are in screen px at the size drawn,** because "slight" is a screen fact: 0.5px = 1.5 dots on a 3x phone.
- **Inside corners fill in all three laws:** it's what print does to ink (the reason for ink traps). The laws differ in how they vary by angle, the "different architecturally sound principles" part. These numbers are ours, not the owner's.
- **The selected pin in A and C shows the 24 drawing at 1:1**, so the line stays exactly 2.00px; B enlarges it with the pen fixed. Flagged as a cost, not decided.
- **Fit is measured on the finished outline:** every skeleton stays inside its grid's point limit (r 8.5 for A and C, r 9 for B).
- **Measured findings reported, not argued:** at 12px with a 2px line any grid is 6 × 6 modules, so A's and C's chips are the same drawing; the ⌘, the wheel's spokes and the walker's arms need 1.5px there; a 3px ⌘ with 1px openings needs Ø18.3, more than any badge's live area.
- **Tool:** keep authoring as code (the grid is the code; diffable; the corner law in one place), Figma via MCP offered only if he wants to push curves by hand.

## Not done (on purpose)

- No final drawings, no colours, no read-apart work ("lets not focus on differentiation yet").
- index.html untouched.

## Round g5 (2026-10-17), after "Feels like 1.5 or 2 to me right now" and "What's closest to the inspo"

- 1.5, 1.75 and 2 side by side in the app's contexts, with the deciding differences shown big and at real size, the whole family per width, and MUTCD compared two ways (same size on screen; picture to picture). Skeletons are unchanged from g4. `src/boards5.js` → `cards-g5.html`, `stills/g5-*`. MUTCD measurements and method: `for-director.md`.

## Round g6, batch 1 (2026-10-17), after "Weight wise 1.5 but these icons are far from there drawing wise"

- The drawing step starts, a few icons at a time, each batch pressure-testing the grid. Batch 1: café, bar, museum, nature, the +, the Star.
- `src/picks6.js` holds the drawings (functions of the box size); `src/laws6.js` the corner laws at 1.5px; `src/boards6.js` writes `cards-g6.html`, `stills/g6-*` and `svg/g6/`. The rules sheet (sheet 5) is the grid's current state.

## Round g7 (2026-10-19), batch 1 redrawn after "none of these are yet at the craft level i need"

- The six redrawn to named icon-design practices. `src/picks7.js` (drawings), `src/laws7.js` (laws with the size fit), `src/optics.js` (area, centroid), `src/boards7.js` (sheets; `place()` = optical centring). Reference sets in `reference/`. `cards-g7.html`, `stills/g7-*`, `svg/g7/`.

## The live Grid concepts page (v236 clean-up, 2026-10-23)

Owner: "Yeah the boards are untenable to view so cleanup would be freat". The page holds only what's current, in two titled rows (notes `gridRow1`, `gridRow2`, kind title1), 80px between frames:

- **Row 1 · Waiting on you:** Start here (`Grid7Start`, a short index: one line, then each open question with its board and section) · Between H2 and H3 (`Grid7Between`: section 0 = this round, 0c = the outline rule, 1 = the current row, its rules table and the museum) · Every icon: original and newest (`Grid7Originals`).
- **Row 2 · Decided:** the master grid (`Grid7Master`) · Construction (`Grid7Construction`, from `src/construction-board.js`).
- Generator: `TOOLS=<folder with paper> node src/boards7.js <out>` writes Start (`START_QS`, `sheetStart()`) and Between (`sheetBetween()`: `sectionRoots`, then `sectionHump(kick, quote, 'outline')` = 0c only, then section 1). `sectionHump(..., 'hump')` (0b) is kept for history only; it is on the Archive page as `Archive-G7aw-Hump`. A full run takes over 30 minutes; the v236 clean-up was published by slicing the live v235 board at its section kicks (byte-identical to what this code writes for 0, 0c and 1), not by a run, so the first designer to run it should diff its Between and Start against the live ones.
- **A new round:** put it in section 0; move the old section 0 to the Archive page as its own board (copy the live HTML slice into `Archive-<round>-<topic>.dc.html`, title it with the version and topic, set its page to `archive` in canvas.json, in a new titled row), never delete. Update `START_QS` so Start points to each open question. Row 1's boards sit at the row title's y + 300; row 2 sits below the tallest row-1 board; nothing overlaps.
- `Grid7Weight` ("Decide: line marks") is archived (superseded by v230's outline rule; its question lives on in 0c). `page()` still writes it into `<out>`: don't republish it to the live page.
