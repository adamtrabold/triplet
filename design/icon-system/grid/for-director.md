# Grid g3: for the design director

From the product designer (icon specialist), 2026-10-16. This round restructures after the owner's two reactions. g1 and g2 handoffs are in git history.

## What he said (verbatim, relayed)

On g2 cards 2 and 4:
> "I don't understand. I see a bunch of icons redrawn. I don't see a single grid"

On the g2 frame card:
> "I am glad we have the outer stuff defined in that grid by what about the interior? There's nothing to keep them consistent outside height/width and space to the ring"

He has also said:
> "i want more than one concept"

## What changed

**The grid is now the subject.** Each grid has its own sheet. Icons are secondary: rough skeletons laid on the grid only to show it in use. Each sheet runs:

1. **Outside** (what he said works). A large construction drawing at 24px, enlarged 14x on the phone, with pixel rulers. It shows the ring, the air, the live circle, how far points may reach, and the keyshapes. Below it, each keyshape on its own, and the numbers.
2. **Inside** (his new question). The guides every glyph obeys, drawn large, with **all 13 glyphs overlaid as outlines**, so you can see the system holding them together. Then a strip of all 13 at 3.5x with the guides running straight through every badge, like a type specimen. Then the interior rules:
   - one box
   - three guide lines (or, in B, rings and chords)
   - part sizes, two gap sizes, minimum holes, a short set of circle radii
   - 2px lines
3. **The chip.** The 12px grid: 6 × 6 modules of the 2px line. Both grids hand over to this same chip grid, and the sheet says why.
4. **Corners** as part of the grid: an elbow, a T-join and the conifer's notch, enlarged.

**Two grids, not three.** They are genuinely different in kind:

- **A · Pixel keyline grid:** square.
  - Glyphs sit inside a 12px box (6 to 18).
  - Guides: TOP 6, SHOULDER 10, BASE 18, centre axis 12.
  - Corners by joint.
  - Live circle Ø16 (2px of air).
- **B · Radial seal grid:** round.
  - Rings: CORE r3, BODY r5.5, REACH r8.5.
  - Chords: TOP 5.5 and BASE 18.5.
  - Rays every 15°.
  - Corners by even wear.
  - Live circle Ø17 (1.5px of air).

The g1 module grid became the chip grid shared by both. The pressed corner law isn't shown this round.

**The 13 skeletons were rebuilt to obey each grid's interior** (`src/picks3.js`), so the overlays are evidence, not decoration.
- **A's overlay is tight:** every glyph sits inside the box, stands on BASE and reaches TOP, and joins at SHOULDER.
- **B's overlay is looser,** by the nature of a round grid: the pediment and the bench are wider than the box, and round glyphs fill REACH. I've left that visible rather than hiding it.
- **Gaps checked by hand:** 1px or 2px only.
- **Fit measured on the finished outlines:** A ≤ 8.34 (limit 8.5), B ≤ 8.91 (limit 9).

## Canvas and files

- **Canvas, page "Grid concepts":** https://claude.ai/artifact/SVKZ9PpaMCKUpk7Ks622jW. It holds 5 g3 boards (`Grid3Intro`, `Grid3A`, `Grid3B`, `Grid3Compare`, `Grid3Tool`), and the page title is the question.
- **g2's 6 boards** are on Archive at y 9400 under "Round g2 · … (replaced by g3 …)". g1 is still there above them.
- **Stills:** `stills/g3-sheet-0..4.png` (3x), plus `g3-sheet-3-1x.png`. Source: `cards-g3.html`. SVGs: `svg/g3/<A-pixel|B-radial>/`.
- **Code:** `src/boards3.js`, `src/picks3.js`.
- **I rendered and looked at them myself at 3x and 1x.**
  - The big construction drawings, the overlays and the guide strips read on a phone.
  - At 1x the side-by-side sheet is legible: both grids, both overlays and the real-size rows.

## My read

- **A is the stronger grid.** The overlay shows why: one box, three lines, and the 13 visibly share a ground, a top and a shoulder. That answers his "nothing to keep them consistent" directly.
- **B is the more characterful one.** It fills the seal, and its rings suit the wheel, the ⌘ and the cup. But its interior holds the set together less tightly, and the overlay shows it.
- **I'd draw on A.** The cards don't say so.

## Things you may flag

- **Low glyphs look low.** The cup and the bed sit low in A because they stand on BASE. That's the cost of a shared ground; centring them would break the guide.
- **The 12px chip has no interior guides of its own yet.** Its drawings are the earlier set. The sheet only claims the 6 × 6 module.
- **The tool card is now short** and has no question.

## The ask

"Which grid do we draw the 13 on: A, the square pixel grid, or B, the round seal grid?"
