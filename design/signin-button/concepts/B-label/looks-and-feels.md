# Concept B, the hotel-label banner: how it looks and feels (visual)

Sheet: `sheet-3x.png` (1170 wide), rendered from `index-B.html` (a patched
copy, see `../flow/proto/`). Read `../A-arc-badge/looks-and-feels.md` §"Correction"
first: the signed-in badge is navy at rest, so B's strike is navy too.

## Spec (as rendered)
- Button: 84×44 (44px hit box), label drawn 84×28, centred on `+`'s centre
  line (`margin-top: 3px` inside the 50px row).
- **Right edge at `right: 78px`, not 74.** The round badge's *visible*
  scallop sits ~4px inside its 50px box, so a flat label edge at 74 would
  stick out 4px past where the signed-in badge's ink ends. 78 lines the
  label's edge up with the badge's visible edge. It grows leftward only.
- Shape: a rectangle with 2.5px-rounded right corners, a 7px notched tail on
  the left (`M0,0 H81.5 Q84,0 84,2.5 V25.5 Q84,28 81.5,28 H0 L7,14 Z`).
- Face, edge, shadow and pressed state are identical to A.
- Print: person = account glyph ×0.42, 1.4px stroke, at x 15; SIGN IN in
  Archivo 700, 75%, 11px, letter-spacing 0.9px, navy, baseline at centre
  +0.36em. Fixed px: no Dynamic Type growth.
- Signed in: today's round button, untouched.

## Motion (stills)
- **In:** the round navy badge is struck down over the label's right end
  (STAR_POP scale only, peak 1.12) while the label's paper and print fade
  under it; ends with only the round badge. 380ms.
- **Out:** the badge dries up to **nothing** (no paper disc), and the label
  prints back in beneath it, on DRY timing. Fixed from pass 2.
- The last frames of the out-motion show a small navy speck with an orange
  fragment over "IN": the thickest part drying last. It's true to the dry-up,
  but on B it lands on the word. On A it lands on paper. A point for
  scoring.

## Why
- The banner's notch is what keeps it from being "just a button"; it's the
  only shaped edge, so it's calm next to the scalloped `+`.
- 11px caps read instantly at real size: this is B's whole case against A.

## Open
- On the darker map it's still the largest pale shape in the corner (84×28
  of paper vs `+`'s ~42 navy disc). Smaller than pass 2's 92×32, and it
  reads calmer on the sheet, but J4 stays the scoring question.
