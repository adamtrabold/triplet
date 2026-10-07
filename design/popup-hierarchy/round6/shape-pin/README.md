> **Shelved (2026-10-07).** Owner: "I guess the district and streets are fine with just the area box nevermind". No pin for shapes; an open tag hangs from a small dot at the area's middle (round 7).

# Shape pin: a map pin for districts and streets (round 6, after review)

Designer, 2026-10-07. These are concept stills only, and `index.html` is untouched. The tag is round 6's
Hanging Tag v4 (`../tag/tag4.js`), unchanged except that a street's type word reads "Street". Another
designer owns the tag.

- **Owner page:** `../shape-pins.html` ("District & Street Pins"), built by `build.js`.
- **Reviews:** `ux-review.md` and `cd-review.md`. Every fix they asked for is listed under "Fixes after
  review" below.

## The ask (owner, verbatim)

"Districts and streets need a map pin type."

This was the answer to "OK for a district to show a small diamond?". Other owner words applied:

- "Bonus points but not required if the map pin is conceptually aligned with whatever it "opens up" to"
- "Same category icon treatment on map and popup"
- "Visited vs pin are not differentiated nearly enough"
- "No star unless it's been starred"
- "I like whimsy and these all seem kinda average"
- "Dots add an insane amount of visual noise absolutely not"
- "Keep in mind the brand color palette.. we should be using best practices around how to apply
  consistently and meaningfully"
- "Stars should be colored imo" (2026-10-07). The star colour is being settled app-wide in
  `round7/star-colour/`. **The stars here stay black for now and will follow that decision.**

## Variants (two; the tie-on tag was killed)

### Trail blaze (`blaze-*`)

The pin is the list's own diamond badge, the trail blaze nailed to a tree. The inspo is the Pacific
Crest Trail diamond in `design/inspo/project/yosemite-trail-scrapbook-collage.jpg`; the crop is
`stills/inspo-pct-blaze.jpg`.

**States:**

- **Unvisited:** a 28px diamond with a `--paper` field, a 2px category rim and a 17px glyph.
- **Starred:** the map star sits on the upper-right edge.
- **Visited:** the dark sticker (`STICKER.INK`), cut as a diamond, with a cream check and one vertex
  peeled. It peels left when starred, and never at the bottom tip, where the string ties.
- **Open:** 36px and filled with the category ink. The string starts at the bottom tip.
- **Plan stop:** the grey number replaces the glyph.

**Strength:** it is the same mark in the list and on the map, and its pin point is its centre.

**Weak spot:** it can read as "the diamond again" (kinda average). A diamond that opens a tag is not
one idea.

### Staked pennant (`pennant-*`)

A swallowtail pennant on a staff, planted at the shape's point: you stake your claim on an area, like a
park pennant or a surveyor's flag.

**States:**

- **Unvisited:** a 25×18 paper flag with a 1.6px category rim, a 15px glyph, a 30px staff in `--ink-2`,
  and a faint foot shadow.
- **Starred:** the star sits at the fly corner.
- **Visited:** the flag fills with `STICKER.INK` and carries a cream check. There is no peel, because a
  flag is not a sticker.
- **Open:** 1.3× and filled with the category ink. There is no foot shadow; the staff runs on into the
  string.
- **Plan stop:** the number sits on the flag.

**Strength:** it is the clearest "area, not a place" silhouette at 1x, and the clearest visited state.

**Weak spot:** the flag sits up and right of the true point.

### Tie-on tag (killed by the CD)

When it is open, two tags hang on one string. Every pin would also carry an eyelet dot. The code and
stills are removed; the idea is in the git history (`2ff1910`).

## Rules for both variants

- **Point:** one point per shape, shared by the pin, Directions and the old map star.
  - A district uses its label point: the interior point farthest from the edges (`labelPoint()`).
  - A street uses its midpoint along its length.
  - Today `shapeAnchor()` (vertex centroid) drives Directions; it would become the label point.
- **Zoom:** the pin shows exactly while its outline does (`mapVisibleNeighborhoodShapes()`). With the
  default min zoom (14 or 15, never below `SOLO_MIN_ZOOM`), a shape pin never meets a cluster in Places.
  A hand-set lower min zoom clusters like a pin, at its point. Plans keeps its shipped shape-stop
  clustering.
- **One mark:** the pin carries star, visited and the plan number. It replaces `shapeStarIcon`,
  `shapeVisitIcon` and the numbered stop diamond.
- **Stacking:** shape pins sit under every place pin (`SHAPE_DROP` −3000). Among shape pins, the pin
  ladder still applies (starred above, visited below). The exceptions are a selected shape pin
  (`Z_HIGHLIGHTED`) and a plan stop (`Z_PLAN_STOP − n`). The reasoning: a shape is the larger, vaguer
  thing, and its outline is tappable too. `*-busy-z14-crop` shows a restaurant pin over the visited
  Hlemmur pin.
- **Tap area:** 44px, centred on the pin's visual body (the blaze's centre, the pennant's flag), not on
  its point. Where it overlaps a place pin's area, the nearer visual centre wins, as between place pins.
  The rings are drawn in `*-hit`.
- **Opening:**
  - A list tap goes through `focusShape()`, and a tap on the outline opens the tag directly.
  - Either way, the map first pans, if needed, so the pin and the tag's drop space (the pin's point
    plus about 44px of string and the tag's height below it) are on screen. Then the tag opens.
  - This matters for a long street whose midpoint is off-screen, and for a big district framed by its
    bounds.
- **Signed out:** the pins look the same; a pin carries no control.
- **Size:** shapes draw only at zoom ≥ `GLYPH_MIN_ZOOM`, so there is one size, plus the usual +8px or
  1.3× when open.

## App-wide options (the owner decides; not silent)

The variant stills are shot with **both options on**, and the page says so.

- `opt-shipped`: today. Grey outlines, the 6px dotted street line, and the dotted `#g-street` glyph.
- `opt-a`: **coloured outlines.** Each outline is in its category ink, with stroke opacity 0.9 → 0.6;
  weights, dashes and the 0.12 fill are unchanged.
- `opt-b`: **dot-free street.**
  - The street line becomes 3px solid, replacing the 6px `'2 8'` round-cap dots.
  - `#g-street` becomes a solid curved road stroke, in the list as well as the pin.
- `opt-ab`: both options together.

The pins always use the solid road glyph (`#g-street-road`). The dotted glyph reads as specks at pin
size (CD).

## Colour map (only existing tokens)

| Colour | Token | Where | Meaning |
|---|---|---|---|
| Teal `#328177` / rust `#5E2C17` | `CATEGORY_COLORS.district` / `.street` | rim + glyph; fill when open; outlines (option A) | the category, as the list badge and chip |
| Oat `#F2EBDD` | `--paper` | the pin's field; the glyph when open | the paper the unvisited seals are printed on |
| Category fill + paper glyph | `markerIcon()`'s highlighted inversion | open | selected, exactly as a place pin |
| Slate `#3A4C5B` | `STICKER.INK` | visited face / flag | visited: the one neutral; the category colour drops |
| Cream `#FAF5EA` | `STICKER.FACE` / `HI_RING` | visited check, a visited stop's number, selected ring | printed on the visited mark |
| Black `#1A1A18` on a `--paper` halo | `--ink` (`.marker-star-*`) | the star | starred (pending the app-wide star colour) |
| Grey-brown `#5A564C` | `--ink-2` | plan-stop number; pennant staff | secondary numbers; neutral structure |
| `--ink` at 16-22% | | contact shadows | depth only, kept restrained |

`--figure`, `--figure-deep` and `--navy` never appear on a pin. On the map, `--figure-deep` means
"cluster". The CD notes that street rust and café brown are close at 1x, so silhouette has to carry that
difference.

## Fixes after review

- The tie-on tag is dropped.
- Glyphs are bigger: blaze 28px / 17px glyph, pennant +20% / 15px glyph. Each is about the ink of a
  place seal's glyph.
- The pennant has no foot-shadow smudge when open; the shadow shows only at the foot when standing.
- The visited diamond's peel is bigger (chord at 0.5), so it reads at 1x.
- Stacking, tap area, the opening pan and the one-point rule are specified above, and the hit-area
  rings are drawn in `*-hit`.
- The visited crops centre on the visited Miðborg pin beside visited place stickers.
- `busy-z16` adds the old town's places (about 14 on screen).
- Options A and B are shown before and after.

## Stills

- `stills/` holds the 1x phone stills (`*-phone@1x.png`) and the 3x crops (`*-crop@3x.png`).
- `_sheet/` holds jpgs for the page.

| Name | What |
|---|---|
| `{v}-busy-z14`, `{v}-busy-z16` | the busiest map, where shapes first draw; the old town at 16 |
| `{v}-district`, `{v}-street` | open, the tag hanging from the pin |
| `{v}-visited` | visited and starred shapes among visited and starred places |
| `{v}-states` | the states board |
| `{v}-plan` | Plans: a district and a street as stops 2 and 4 |
| `{v}-hit` | 44px hit areas |
| `opt-shipped`, `opt-a`, `opt-b`, `opt-ab` | the app-wide options (shown with Blaze, in Plans so the list's street glyph shows) |
| `inspo-pct-blaze.jpg` | Blaze's inspo crop |

## How to re-render

```
node design/popup-hierarchy/round6/shape-pin/render.js [name|variant|scene ...]
node design/popup-hierarchy/round6/shape-pin/build.js
```

Run the renders a few at a time; one 26-still run exhausted the container's memory.

These are Chromium stills on a stand-in basemap with a synthetic Reykjavík scene. Real hit testing and
the overlap rate on real data are unverified.
