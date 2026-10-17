# Grid g5: 1.5, 1.75 or 2px, for the design director

From the icon designer (taking over mid-round after the container restart), 2026-10-17. Built to your g4 note ("The one test for it: can he actually choose between the three on his phone?"). The g4 handoff is in git history.

## His words (verbatim)

> "Feels like 1.5 or 2 to me right now"

> "What's closest to the inspo"

Standing: "Yes I'm looking for an harmonious complete set and guidance for the future", "Also include app icons not just the ones for types", "Home Screen icon will also need to feel naturally part of the family".

## Where

- **Canvas, page "Grid concepts":** https://claude.ai/artifact/SVKZ9PpaMCKUpk7Ks622jW. Seven g5 boards (`Grid5Intro`, `Grid5Context`, `Grid5Plus`, `Grid5Diff`, `Grid5Family`, `Grid5TwoX`, `Grid5Inspo`); the page title is the question.
- **g4 moved to Archive** (y 24000, "Round g4 · stroke sweep 0.8–2.5px"). Nothing deleted.
- **Stills:** `stills/g5-sheet-0..6.png` (3x) and `g5-sheet-1-1x.png`. Source: `cards-g5.html`, built by `src/boards5.js` (skeletons unchanged: `src/picks4.js` via `boards4.js`).
- **The WIP:** its approach was sound (2x columns, MUTCD crops), but the committed `boards5.js` was older than its HTML and showed each width on its own sheet, not side by side. I rebuilt the sheets; the 2x columns sheet is its sheet 1 minus the MUTCD part.
- I looked at every sheet at 3x, sheet 1 at 1x, and the 760 canvas versions of sheets 1 and 6.

## Against your test

1. **Side by side, same contexts, real size.** Sheet 1: header, chips, two list rows (one with the Star, one with the visited stamp), a map strip with a selected pin and the sticker; the three widths stacked under each other with a width label. Sheet 2: the + as it ships (60px scalloped badge, its line only changes) and the tag (badge, Star, Directions, ×, today's Visited stamp). Sheet 4: the whole family per width, as in the sweep.
2. **The deciding differences, named and visible.** Sheet 0 has a table; sheet 3 shows each one big (2.75x) with real size under it, and an orange note where the width loses it:
   - fork 3 tines → 2 (1.5 → 1.75);
   - conifer 4 tiers → 3 (1.5 → 1.75);
   - the small details, 1.5 only: cup rim, drink line, bag band, blanket fold, architrave;
   - the curtain's scallops, gone at 2;
   - the bench, bed and blocks chips at 12px, at 4x and real size;
   - the ⌘ as the "weight only" control.
   Also stated: what doesn't change (3 columns, 4 spokes, 2 slats, 2 × 2 blocks, bed, walker, ⌘, +, ×).
3. **If they look alike, say so.** Sheet 0, verbatim: "Plainly, at real size, they look alike. In the header the three are almost the same. The bigger lines show it most: the + and the tag's ×. In the rows, chips and map, what you notice is the fork (3 tines or 2) and the conifer (4 tiers or 3), which change between 1.5 and 1.75. From 1.75 to 2 the change is weight only, apart from the curtain's scallops, and it's hard to see." That's what I saw at 3x and 1x.
4. **Honesty about the rule.** Sheet 0 says the detail cut-offs are our g4 rule ("small details only at w ≤ 1.5", scallops to 1.75), not physics: they could move by a quarter pixel; the weight can't. This matters because he might choose 2 for weight and assume the details are forfeit.
5. **MUTCD beside them** (sheet 6), two ways, because a sign's picture fills ~87% of its square and our glyph fills 50% of the badge:
   - same size on screen (sign 81px = badge 24px): signs and badges at 2.2x and real size, plus a line ruler (8x) of the signs' measured lines against ours;
   - picture to picture (the sign's picture the height of our 12px glyph).
   The facts are stated; there's no pick.
6. **No recommended width** on any sheet. The question on every sheet: "Which of 1.5, 1.75 and 2px gives the density you want?"

## My check of the MUTCD numbers (fig-2h-05-1.gif, measured, not eyeballed)

Method: each sign's brown field, then the run lengths of white pixels in rows and columns inside it (`scratchpad/g5m/find.py`; per-sign histograms). The signs are 80–81px square (brown to the edge; the white border is the paper), not 78.

| Part | Sheet px | Same size (× 24/81) | Share of picture height (÷ 71) |
|---|---|---|---|
| Crosswalk dashes (Ped Xing) | 3 | 0.89 | 4.2% |
| Lookout-tower legs | 4 | 1.19 | 5.6% |
| Litter can walls; study-area spiral | 4–5 | 1.19–1.48 | 5.6–7.0% |
| Tent ground line | 5 | 1.48 | 7.0% |
| Walker's limbs (Ped Xing) | 6–8 | 1.78–2.37 | 8.5–11.3% |
| Drinking-water glass walls | 7–8 | 2.07–2.37 | 9.9–11.3% |
| Masses: tunnel walls, tent sides | 14, 16 | 4.1, 4.7 | — |
| Ours | — | 1.5 / 1.75 / 2 | 12.5% / 14.6% / 16.7% |

Against the orchestrator's quick read:
- **Holds:** most lines are 4–5px; the weight comes from solid masses; 1.5 is the closest of the three.
- **Corrections:** the field is 81px, not 78. The walker's *dashes* are 3px (the crosswalk); its *limbs* are 6–8. The tunnel arch is 14px, a mass, not a 7–8px wall; the 7–8px wall is the drinking-water glass ("the cup").
- **Range:** the most common line is 4px = 1.2px at badge size, so the centre is nearer 1.2–1.5 than 1.5.
- **Picture to picture, all three of ours are heavier than every sign line.** 1.5 (12.5%) sits just above the glass walls (11.3%). By either measure 1.5 is nearest, and 2 is heavier than the inspo's lines.
- **Colour:** the signs are white on brown, which reads slightly heavier than it measures. Noted on the sheet.

## The home-screen icon

Unchanged and shown in every family block (sheet 4), as asked. The g4 flag still stands: it doesn't sit naturally in the family. Redesign comes after the width pick.

## Not done (on purpose)

Corner law, air, home-screen redesign, the engine slivers: after his pick, per your order. `index.html` untouched.

## My read (not on the sheets)

At real size the honest story is "1.5 versus the other two". 1.75 and 2 are nearly the same picture; 1.5 is lighter and keeps the fork, the conifer and the small details. Against the inspo, 1.5 is nearest by both measures. If he wants 2's weight with 1.5's details, that's a rule change (move the cut-offs), and it would need its own look.

## The ask

"Which of 1.5, 1.75 and 2px gives the density you want?"
