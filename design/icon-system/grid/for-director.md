# Grid g4: stroke-width sweep, for the design director

From the product designer (icon specialist), 2026-10-17. Built to your turn-9 order. The g3 handoff is in git history.

## His words (verbatim, relayed)

> "A feels to be producing better sized icons but the icons are too simplistic that are coming out in reality. Let's try a bunch of pixel widths for the stroke to give us the perfect overall density goal. I want sub pixels from prolly .8 to 2.5"

> "Also include app icons not just the ones for types"

> "Yes I'm looking for an harmonious complete set and guidance for the future"

> "Home Screen icon will also need to feel naturally part of the family"

## Where

- **Canvas, page "Grid concepts":** https://claude.ai/artifact/SVKZ9PpaMCKUpk7Ks622jW. It holds 5 g4 boards (`Grid4Intro`, `Grid4Sweep`, `Grid4Across`, `Grid4App`, `Grid4Guide`), and the page title is the question.
- **The g3 boards (after fixes)** moved to Archive at y 16400.
- **The visited stamp, the visited sticker and today's home-screen icon** are uploaded as canvas assets and shown unchanged.
- **Stills:** `stills/g4-sheet-0..4.png` (3x) and `g4-sheet-1-1x.png`. Source: `cards-g4.html`.
- **Code:** `src/picks4.js` (parametric skeletons, the detail rule, the test icon) and `src/boards4.js`.
- **SVGs:** `svg/g4/w<width>/`.
- I rendered all five sheets at 3x and the sweep sheet at 1x, and looked at them.

## Against your order

1. **Density at real size on a phone.**
   - Sheet 1 has one block per width (0.8, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5px). Each block shows the 13 badges at 24px, the 13 chips at 12px and the app icons at their real sizes. The badges and chips are 1:1 CSS px, so on his phone they show at true size; the app icons scale their strokes to w at each icon's real size.
   - Each block carries an "ink" number: the share of a 24px badge that's ink, averaged over the 13. It runs 26% at 0.8 to 57% at 2.5.
   - Sheet 3 shows each width in list rows, on the map and in the header.
2. **Thinner lines buy richness.**
   - The 13 are parametric (`G4[id](w)`), rebuilt at each width, not scaled.
   - Repeated parts are "as many as fit" with the cut and space rules: tines 5→2, columns 5→3, spokes 8→4, slats 3→2, tiers 5→3, blocks 4×4→2×2.
   - Small details appear only at w ≤ 1.5: the rim, the drink line, the fold and the architrave. The scallops last to 1.75.
   - Each block's "Buys:" line prints the counts the rule chose.
3. **Honest costs per width.** Each block has a "Costs:" line, written from the renders:
   - 0.8: the ring is lighter than the visited marks; 4×4 blocks read as an app grid; a 0.8px line looks grey on non-retina screens.
   - 2.25 and 2.5: the wheel closes up, the roof merges with the columns, and the chips clog.
4. **UI icons in their real contexts.**
   - The set: +, ×, account, star (outline), locate, sort, filters, directions, tag ×, tick, chevron and more, each at its app size with stroke = w.
   - Sheet 3 puts them in rows and the header, next to today's visited stamp and sticker (context only; Visited doesn't change).
   - The UI icons are plain strokes with round caps and joins. Their corner rule follows the later corner pick.
5. **One family.** Each width is one block: places, chips, UI icons, the + button and the home-screen icon together.
6. **Future-icon test** (sheet 4).
   - The written rules: box, guides, the middle rule, one width w, cuts 0.6w and spaces w, repeated parts as many as fit, small details only at w ≤ 1.5, angles, corners.
   - Then "Library", labelled as a test, built only from those rules at all eight widths, beside the set and on the grid.
   - Result, stated on the sheet: in weight, size and detail it sits with the set at every width, but as an idea it reads as a bar chart. The rules make an icon consistent; they don't make its concept clear.
7. **Craft.** The same visual language as g3. The badges' ring takes w too: one width for everything.

## The home-screen icon (flagged plainly on sheet 0)

- **It is today's PNG, unchanged,** shown at 60px with the iOS corner in every block.
- **Measured:**
  - its stem is 3.75px wide at 60px, about a 2px line relative to its seal;
  - its ink covers 39% of the square.
- **The flag:** as it stands it doesn't sit naturally in the family at any width. It's the only solid, scalloped, ringless mark: it pairs with the + button's scallop, not with the ringed badges, and it's the heaviest thing in every block. Redesigning it wasn't asked for, so it isn't attempted.

## Fixed, so the sweep only varies w

Grid A's box and guides, the middle rule, the live circle Ø16, and the corner rule (by joint, with its radii scaled by w/2).

## My read (not on the sheets)

1.25–1.5 is where the set gets the richness he's asking for without the ring falling below the visited marks: all the small details are in, and cuts are 0.75–0.9px. Below 1.25 the badges look fragile next to the stamp and sticker; above 2 the details go and the chips clog. The sheets don't say this; he compares.

## The ask

"Which stroke width gives the overall density you want? (Or two neighbours to look at closer.)"
