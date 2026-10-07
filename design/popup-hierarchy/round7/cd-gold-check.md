# CD gate check: gold star, recoloured categories, gold tag (round 7)

Fresh CD. I did not author, suggest or score any of this work. Did not read
any `*review*` / `*check*` file. Brief: `docs/cd-brief.md`.

## Ledger rules that apply

- "Stars should be colored"; one starred colour, used the same way everywhere.
- "Orange/yellow makes more sense to use on a star"; "change the color of the
  category types that clash".
- "Not sold on pink".
- "Keep in mind the brand color palette.. consistently and meaningfully":
  every colour from the existing family, keeping its meaning elsewhere.
- "Colour must communicate, or go neutral"; "colour alone is not enough".
- "Simple simple simple"; no colour that communicates nothing; secondary
  marks never outrank content; "a 1px hard edge to add shadow definition is
  fine", kept as subtle as it can be.
- "I like whimsy and these all seem kinda average."

## Scores

- **Concept: 8.** Gold star + moving the two clashing categories is the
  owner's own direction and it works: in `gold-list-reykjavik-phone@1x` and
  `gold-map-near-phone@1x` "starred" reads instantly, and it no longer
  fights attraction gold or the orange selected row (`gold-oldcats-*` shows
  the old clash clearly).
- **Execution: 6** (capped: the band variant duplicates the starred colour,
  see noise audit), with three fixes below.

## Answers

**1. Does the gold star read as "starred" at 1x? Does the outline look foreign?**
Yes, instantly, on the list and on pins (`gold-list-reykjavik-phone@1x`,
`gold-list-stockholm-phone@1x`, `gold-map-near-phone@1x`). On clusters
(`gold-map-far-crop@3x`) the gold badge on the orange disc still separates
thanks to the keyline. But the near-black `--ink` keyline makes it the
stock emoji or rating-widget star (yellow fill, black stroke) at 3x
(`gold-list-reykjavik-crop@3x`). Nothing else in the app is drawn that way.
Category icons are tonal (ring and glyph in one ink), and the stamp and
sticker use navy/slate ink. It is the "average" read the owner complained
about. It needs a keyline from its own family (fix 2).

**2. Claret reads as pink? Moss collides with greens? On-brand?**

- **Claret `#972068` reads as the rejected pink at 1x.** Hue is about 324°,
  about 10° from the set-aside pink `#C0306E` (about 334°), only darker. In
  `gold-list-reykjavik-phone@1x` and `gold-map-near-crop@3x` the fork ring
  is clearly magenta/raspberry. It is also the only hue in the palette that
  isn't a park-poster ink (Bryce, Zion, Yellowstone, McKinley). Predicted
  reaction: "I said not sold on pink." Moving restaurant off orange is right
  (it also sat next to Reykjavík's selected-row `#A8400C`). The problem is
  the hue.
- **Moss `#547326` passes, just.** It's a poster olive (on-brand). It is far
  enough in value from spruce nature `#1E3A2B` and teal district that the
  rings separate at 1x (`gold-map-near-crop@3x`), and the glyph differs. The
  weak point is meaning: green already means park/nature on the map (park
  fill, spruce), so a church (Hallgrímskirkja) in green leans outdoorsy. I
  wouldn't hold it back for that. Flag it to the owner as "two greens,
  different icons".

**3. Tag: band or gold segment with navy star? Which passes the noise audit?**
**The gold segment with a navy star** (`g-none-segn-busiest-*`). It puts the
colour on the control it describes ("a color focus would be better on
starred") and adds no new field elsewhere. The navy star reversed on gold
follows the same rule as the paper star on the selected row. The band
(`g-band-busiest-*`) is the most whimsical luggage-tag move, but it fails
the audit. It's a 40px saturated slab, the heaviest thing on the tag,
outranking the name. It also says "starred" a second time, away from the
control that sets it, and the gold star in the stub says it again. That is
colour carrying no new information, so it hits the cap. The owner liked the
band, so show it, but as the second option.

Segment execution issues:

- the pencil circle turns a muddy olive on gold
  (`g-none-segn-busiest-crop@3x`);
- signed out (`g-none-segn-signedout-phone@1x`), the glyph dims but the gold
  fill stays at full strength, so the unavailable control is the loudest
  thing on the tag, which breaks the state system (`--state-off-alpha`).

**4. Verdict: three fixes first, then show the owner.**

## Owner objections (predicted, owner's voice)

1. "The restaurant colour is pink again. I said not sold on pink."
2. "The star with the black outline looks like a generic emoji star, kinda
   average."
3. "Why is the gold all over the top of the tag AND on the star? Pick one."

## Noise count (busiest views)

- `gold-list-reykjavik-phone@1x`: 7 colours on the row layer (paper, filed,
  orange selection, claret, brown, moss, lavender, spruce), plus gold stars,
  navy stamps and grey ×. No rejected pattern. The black keyline is the one
  off-system line.
- `g-band-busiest-phone@1x`: gold band, gold eyelet tab, gold star, pencil
  circle, navy stamp, compass glyph, and three dashed dividers.
  **Rejected-pattern match:** colour that communicates nothing new (band
  duplicating the starred star), and a secondary mark outranking the name.
  Caps at 6.
- `g-none-segn-busiest-phone@1x`: gold cell, navy star, pencil circle, navy
  stamp, compass. One "on" signal too many (fill + circle), but within the
  provisional-circle ruling. No cap.

## Fixes (at most 3)

1. **Restaurant off the magenta axis.** Pull claret toward a wine/brick red
   (hue about 350–5°, dark enough for 4.5:1 on paper). Check it against
   Copenhagen `--figure-deep #B23A2C` and street `#5E2C17`. Put one still
   with the old pink next to it so the owner can see they differ.
2. **Star keyline in its own ink.** Swap the `--ink` black stroke for a dark
   amber from the existing family (e.g. Malmö `figureDeep #8A5A0E`, about
   5:1 on paper) so the star is drawn like the category icons. Re-shoot the
   list, near-map and cluster stills.
3. **Tag: lead with the gold segment with a navy star.** Draw the pencil
   circle in navy on the gold. When signed out, apply `--state-off-alpha` to
   the fill too. Show the band as the second option only. Also render Malmö
   (list + near map + far map), the one close gold pair (7.5 ΔE) the page
   asks the owner to judge without a still.
