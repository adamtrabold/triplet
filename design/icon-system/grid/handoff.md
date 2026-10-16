# Grid: handoff from the product designer (visual focus). WIP, stopped 2026-10-16

The owner handed the grid to a specialist ("the designer should be an expert icon designer with the highest attention to glyph craft"), so I stopped mid-way. Nothing here was scored, shown to the owner or published to the canvas. Use any of it, or none.

## What governs this step (owner, verbatim; full text in `../owner.md` and `docs/owner-taste.md`)

- "After I approve a direction or directions there, the team will research best practices for icon design and develop a shared grid system to iterate on drawing the icons. These should be svgs and if it's better to mcp or connect to a different tool for this they can let me know." Also: "i want more than one concept."
- "we're not at drawing step next, next step is defining the grid"; "lets not focus on differentiation yet we aren't making final icons here".
- "yes they need to sit in the stroked circle but also make sense on their own. they need to be at their root simple shapes, but joined together to make coherent glyphs. they must be crafted with the highest attention to detail and quality -- minimal bezier curves with perfect architecture. personality in the approach to how strokes are connected and curve. slight rounding of interior and exterior corners to add a vintage softness. corner rounding should not be 100% consistent though as there are different architecturally sound prinicples to how different angles intersect. the effect of the rounding should allude to something screened or pressed."
- Settled: Constructed; the 13 picks (`../icon-concepts/jam.md`, `../owner.md`); 2.00px on screen for every line, shared with the +; places solid; outlined = not yet tapped; Visited unchanged.

## The fact any grid has to answer: where the icons render

From `../inventory.md` (measured in the app):
- Place glyphs render at **12px** (filter chip, bare), **18px** (inside the 24px row badge and the 24px near pin, rim 2px), and **23px** (inside the 32px selected pin, inverted, rim 2.5).
- Tools render at 14–24px; the + glyph is 22px in its button.
- A constant 2.00px line therefore means a different number of grid units at each size: 2u at 24px, 2.67u at 18px, 4u at 12px if one 24-unit master is scaled. That mismatch is the main thing a grid has to resolve.

## Research (sources)

- **Material system icons:** 24dp canvas, 20dp live area, 2dp padding; keyline shapes (square, circle, portrait and landscape rectangles); 2dp stroke; 2dp default corner radius. [material.io system icons](https://material.io/design/iconography/system-icons.html); restated with the same numbers by [Singapore Government Design System](https://designsystem.tech.gov.sg/foundations/iconography) and [UX Planet](https://uxplanet.org/developing-design-guidelines-for-a-2-000-minimal-icons-pack-96d78dddec8d).
- **IBM / Carbon:** 32px artboard with 2px padding; the stroke changes by size (2px at 32, 1.5 at 24, 1.25 at 20, 1 at 16); whole-pixel coordinates; strokes expanded before export. [IBM UI icons usage](https://ibm.com/design/language/iconography/ui-icons/usage), [contribute](https://www.ibm.com/design/language/iconography/ui-icons/contribute). Note: we hold the weight constant where IBM scales it, which makes our 12px the hard size.
- **Fluent:** separate files per size (16/20/24/28/48), not every icon at every size yet. [@fluentui/svg-icons](https://npmjs.com/package/@fluentui/svg-icons), [Fluent 2 iconography](https://fluent2.microsoft.design/iconography).
- **Heroicons:** 24 outline, 24 solid, 20 solid, 16 solid as separate sets. [heroicons on npm](https://npmjs.com/package/heroicons).
- **SF Symbols:** templates with explicit margins per weight; top and bottom guides align a symbol with text. [Apple: custom SF Symbols](https://developer.apple.com/documentation/uikit/creating-custom-symbol-images-for-your-app).
- **Aicher, Munich 1972:** a square grid of orthogonals and 45° diagonals. [Wikipedia](https://en.wikipedia.org/wiki/Otl_Aicher), [FH Potsdam](https://interface.fh-potsdam.de/gestalten-in-code/projects/otl-aicher/). Mark Holt's critique: limbs built from one orthogonal and one 45° part can't keep a uniform thickness on that grid ([Eye](https://eyemagazine.com/blog/post/this-sporting-myth)). Relevant to the walker and anything diagonal.
- **AIGA/DOT symbol signs (1974):** history and credits only; I found no published grid spec. [AIGA](https://aiga.org/resources/symbol-signs).
- **Map symbols (minimum dimensions):** cartographers specify the smallest line, gap and solid that stay legible, and design for the smallest scale. Example print values: about 0.1mm thinnest line, 0.15–0.2mm gap. Ledermann notes few of these minimums are empirical, and that phone screens may need new ones. [Ledermann 2022, TU Wien](https://repositum.tuwien.at/bitstream/20.500.12708/139892/1/Ledermann%20Florian%20-%202022%20-%20Empirical%20assessment%20of%20minimum%20dimensions%20for..pdf), [ICA Abstracts 2023](https://ica-abs.copernicus.org/articles/6/134/2023/ica-abs-6-134-2023.pdf).
- **Tools:** Figma's official MCP server has a beta write tool, `use_figma` (frames, components, variables; vector creation not confirmed). [Figma docs](https://developers.figma.com/docs/figma-mcp-server/write-to-canvas). Third-party bridges exist but are young. Also checked: `paper` (0.12.18, path booleans) and `svgo` (4.1.0) both install from npm here.

## What I tried: `sketches/grid-lib.js` (WIP, not rendered or reviewed)

- The 13 picks as **skeletons**: construction primitives (rects, circles, triangles, bars, rings) in a 20×20 live space. These are blocks to show how a grid places and sizes parts, not drawings.
- Five grid concepts that map and snap those skeletons:
  - **A, Keyline 24** (the convention). One 24-unit master, 2u padding, keyline shapes, scaled to every size. Honest finding: scaled to 18 and 12 its 2u line becomes 1.5px and 1px, which breaks the settled 2.00px, unless the small sizes are redrawn.
  - **B, Real-size masters.** One grid per render size, 1 unit = 1 screen px: 24 (pad 2), 18 (pad 1, live 16), 12 (no pad). The line is always 2 units = 2.00px. Precedent: Fluent and Heroicons. Costs 13 × 3 drawings.
  - **C, The line is the module.** The module is the 2px line: 24 = 12 modules, 18 = 9, 12 = 6. Every part is whole modules, with a half-module allowed for cuts only. With the circle: a 24 badge is 12 modules, the rim is 1 module, and the glyph's live area is 8 modules with 1 module of air, so the rim and the glyph share one count.
  - **D, The badge is the frame.** A round grid in the badge's own coordinates: rim, a live circle Ø16 with its centre 0.5 above the geometric centre (optical), concentric and 45° keylines. Glyphs are fitted by their farthest point or by mass, not by a square box.
  - **E, Smallest first.** From the map-symbol minimums: draw at 12px first, with minimums (solid ≥ 2px, cut ≥ 1px), then enlarge for 18 and 24 while lines stay 2px. Snapping already shows the fork's three tines can't survive at 12. That's useful evidence that the small cut needs fewer parts.
- **Not yet built:** the page that renders the cards (`grids-g1.html`), the canvas boards and the jam turn. The library defines `G.gridSVG`, `G.skelOnGrid` and `G.skelReal`, which draws a skeleton at real size, with or without the stroked 24px circle. One known bug: C's position snapping ignores the 1px offset at 18px (pad 1), so it needs `(v - pad%2)` snapped to 2.

## Corners: three logics I was about to build (numbers would be ours, not his)

His words ask for rounding that varies by how angles meet, and that reads as "screened or pressed". Three ways to make that a rule rather than taste per corner. Each is one arc per corner, which keeps the béziers minimal:
1. **Angle table:** radius by angle class and by convex (outside) vs concave (inside); for example, acute convex rounded most, obtuse least, concave smaller than convex.
2. **Joinery:** radius by joint type: a free end, an elbow (outer rounded, inner mitred), a T-junction (filleted inside), a crossing (sharp). This speaks to "how strokes are connected".
3. **Press (ink spread):** the shape's morphological opening and closing. Convex corners wear by a small radius; concave corners fill by a larger one, as ink pools in an inside corner. Acute tips blunt visibly more on their own, so the rounding varies by angle without a table. This is the most literal reading of "screened or pressed".

Each grid should show its corners on abstract specimens (an elbow, a T, an acute tip, an obtuse pediment), magnified and at real size, inside the circle and on its own. Specimens only, not glyph drawings, since we aren't at the drawing step.

## Tool recommendation (my lean, not decided)

Author the SVGs **as code on the grid** (the grid is the code: parametric primitives, snapped, diffable in git; this is how every sheet in this project was built). Then add an export step that joins the primitives with real path booleans (`paper`) and applies the corner rule as true arcs, then runs `svgo`. That gives single clean paths with real holes.

Why the export step matters: today's sketches fake every cut with a paper-coloured shape (`--ko`), which breaks on any other background (the selected pin, the navy row).

Figma via its MCP is worth offering the owner if he wants to hand-adjust curves himself. Vector writing is unconfirmed, and this environment has no Figma connection.

## Next, if anyone picks this up

1. Fix C's offset and render the cards, at phone size and on the canvas as a new page: each grid magnified, the 13 skeletons on it, each one at real size in the 24px stroked circle and on its own at 18 and 12, and the corner specimens.
2. Jam with the design director (`../icon-concepts/notes/director.md` has its bias check); the director scores, and only 9s go to the owner.
3. Raise the 23px selected-pin glyph: no grid above has a 23 master; it would use the 24, which is a 1px change.
