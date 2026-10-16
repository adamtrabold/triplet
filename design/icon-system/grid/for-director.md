# Grid g1: for the design director

From the product designer (icon specialist), 2026-10-16. Please score before anything goes to the owner.

## What to look at

- Phone stills: `stills/g1-card-0.png` … `g1-card-6.png` (390 wide at 3x; cards 1–3 are tall), and `g1-card-5-1x.png` for 1x. Source: `cards.html`.
- Canvas, page **Grid concepts**: https://claude.ai/artifact/SVKZ9PpaMCKUpk7Ks622jW (the same 7 cards at 760 wide). Nothing was replaced, so nothing went to Archive.
- SVGs: `svg/A-pixel/`, `svg/B-seal/`, `svg/C-press/` (the 13 skeletons at 24 and 12, single paths with real holes).
- Code and reasons: `src/`, `notes.md` (research with links).

Cards: 0 the brief and the measured sizes · 1 A Pixel plate · 2 B Seal · 3 C Press kit · 4 corners, three laws on the same shapes · 5 all 13 per grid at real size, plus measured findings · 6 the tool and the question.

## How each concept answers his brief (his sentences, as he wrote them)

| His words | A · Pixel plate | B · Seal | C · Press kit |
|---|---|---|---|
| "sit in the stroked circle but also make sense on their own" | Drawn in the badge's own pixels (live Ø16, 2px air); a separate 12 drawing for the chip | Drawn in the badge, fuller (live Ø17, 1.5px air); the chip is the same drawing shrunk, pen at 2px | 12 modules in the badge; the 12 chip is drawn first |
| "at their root simple shapes, but joined together" | Rectangles, circles, arcs, 45° | Masses plus centre-lines drawn with a pen; polar | A kit of module parts |
| "minimal bezier curves with perfect architecture" | 264 curves for the 13 (24 badge) | 285 | 245 |
| "corner rounding should not be 100% consistent … different architecturally sound prinicples to how different angles intersect" | By joint: what the corner is (line end, mass, tip, shoulder, join, notch) | By angle: even wear, so the radius follows the angle | By side: one outside and one inside radius; the angle changes only what you see |
| "allude to something screened or pressed" | Inside corners fill | Inside corners fill | Most literal: ink squeeze outside, ink fill inside |

## My honest read

- **A · Pixel plate.** The safest. It is the crispest at 1x and the closest to how established systems work (Material keylines, IBM whole pixels, Fluent per-size drawings). Its corner law answers "different principles for different angles" most directly, because it names the joints. Costs: 26 drawings, and the selected pin doesn't grow its glyph. Its skeletons come out a little stiff (45° only).
- **B · Seal.** The best-looking skeletons at 24: fuller in the circle, and the wheel, the column front and the cup read best here. It is one drawing per icon. But its chip is the weakest: the wheel loses its spokes, the column front drops to two columns and the cup's handle closes. That is the "make sense on their own" sentence, failing at 12. The even-wear law is the most principled angle rule, but at right angles it is almost the same as A.
- **C · Press kit.** The most "printed" character, and the press law is the most literal reading of "screened or pressed". It is also the coarsest. Pressed inside corners fill small openings (the wheel's openings become round holes), and some skeletons are crude (the cup). Risk: its rule is one pair of radii, which he may read as "100% consistent" even though the visible effect varies with the angle. The card says this plainly.
- **If I had to lean:** A's frame and sizes, with either A's joinery or B's even-wear corners. That's why the question allows mixing. I have not put a recommendation on the cards; the cards report.

## Facts on the cards I want you to check

- At 12px with a 2px line, any grid is 6 × 6 modules, so A and C share one chip drawing. Card 5 says so.
- The ⌘, the wheel's spokes and the walker's arms need 1.5px at 12 in A and C. These break the 2.00px rule there, and they are labelled as a drawing-step question.
- The ⌘ heavier than 2px (your condition): a 3px ⌘ with 1px openings needs Ø18.3. The live areas are Ø16 (A, C) and Ø17 (B). Only the 32 selected pin has room. This one is computed, not guessed.
- Every skeleton fits its grid's limit, measured on the finished outline.
- Real rows use three of his saved places named on the t6 cards (Vasa Museum, Tivoli, Hallgrímskirkja).

## Known weak spots

- The skeletons are rough by design. The ones that look worst at 24: C's wheel (a button), A's bed and C's bed (sofa-like), and the bag (still near a padlock). These are notes for the drawing step, not grid faults, but he will see them.
- B's polar vocabulary only shows in a few picks (the wheel, the coupe, the bag handle, the cup).
- C claims "the 24 adds parts to the 12". In this round the 12s were drawn as their own set. They hold the same ideas, but I didn't derive the 24 from the 12 in code.

## The ask (one question)

"Which grid do we draw the 13 on: A, B, C, or parts of more than one (for example one grid's frame with another's corners)?"

The tool line is a recommendation, not a question. We keep authoring as code; Figma via its MCP is offered only if he wants to push curves himself.
