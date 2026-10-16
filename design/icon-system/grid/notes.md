# Grid: notes (round g1, 2026-10-16)

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
