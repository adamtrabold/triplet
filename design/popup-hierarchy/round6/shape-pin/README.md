# Shape pin: a map pin for districts and streets (round 6)

Designer, 2026-10-07. These are concept stills only. `index.html` is untouched, and the Hanging Tag
is round 5's claim-check tag, unchanged (its owner is another designer).

## The ask (owner, verbatim)

"Districts and streets need a map pin type."

Context: this answered "OK for a district to show a small diamond?", asked about the stand-in diamond
in `../../round5/tag/stills/*-shape-*`.

Other owner words applied here:

- "Bonus points but not required if the map pin is conceptually aligned with whatever it "opens up" to"
- "Same category icon treatment on map and popup"
- "Visited vs pin are not differentiated nearly enough"
- "No star unless it's been starred"
- "I like whimsy and these all seem kinda average"
- "Dots add an insane amount of visual noise absolutely not"
- "Keep in mind the brand color palette.. we should be using best practices around how to apply
  consistently and meaningfully" (2026-10-07; see the colour map below)

## What every variant shares

- **Settled:** the tag hangs from the pin on a straight string. The pin stays on the map while the
  tag is open, and the string starts at the pin's tie point.
- **One pin per shape.** It replaces the shipped interim marks: the shape's own map star
  (`shapeStarIcon`), its visited sticker (`shapeVisitIcon`) and a plan stop's numbered diamond
  (`planNumberIcon(..., 'diamond')`). The pin carries all of those states itself.
- **Where it sits:**
  - A district sits at its **label point**: the interior point farthest from every edge (a pole of
    inaccessibility, `labelPoint()` in `pins.js`). A concave or C-shaped district never puts its pin
    outside itself, which the centroid can.
  - A street sits **halfway along its length**, which is the shipped `shapeAnchor()` for streets. This
    is also where Directions points.
- **Zooms:** the pin shows exactly while its shape's layer does (`mapVisibleNeighborhoodShapes()`, the
  shape's `min_zoom`, default city zoom + 3). The shape and its pin are one thing on the map. The list
  is not affected: it still shows every shape that matches the filters.
- **Clustering:**
  - Places: with the default min zoom, shapes first draw at 14 (Reykjavík, Stockholm, LA) or 15
    (Copenhagen, Malmö). That is at or above `SOLO_MIN_ZOOM` (14), so a shape pin never meets a
    cluster.
  - A shape with a hand-set `min_zoom` below 14 clusters like any pin, at its label point: it is
    counted in the disc, and its own pin hides. This is the rule plan shape stops already follow
    (owner: "One clustering behaviour").
  - Plans: unchanged from the shipped rule. A shape stop draws at any zoom and clusters at its point.
- **Size:** shapes draw only at or above `GLYPH_MIN_ZOOM` (12), so there is no FAR tier. Every
  variant has one NEAR size, about 24px of ink, and the selected size adds the usual +8px.
  - Each pin's tap target is 24px or more.
  - A tap on the pin or on the shape opens the same tag.
- **Stacking:** the pins' own ladder (`Z_HIGHLIGHTED` > `Z_PIN_STARRED` > 0; plan stops at
  `Z_PLAN_STOP - n`). Within the same rung, Leaflet's usual south-over-north order applies.
- **Signed out:** the pins look the same. A pin carries no control. In the tag, Star and Mark visited
  go to the state system's off alpha, and Directions stays live (round 5's `*-signedout`).

## Colour map (every colour the pins use)

Every colour below is already a token or constant. None is new.

| Colour | Token / constant | Where on the pin | What it means (as everywhere else) |
|---|---|---|---|
| Teal `#328177` | `CATEGORY_COLORS.district` | rim + glyph of a district pin; fill when open | the category. It is the same ink as the district's list badge and filter chip. |
| Deep rust `#5E2C17` | `CATEGORY_COLORS.street` | rim + glyph of a street pin; fill when open | the category, as above |
| Oat `#F2EBDD` | `--paper` (the seals' `badge-field`) | the pin's field; the glyph when open | the paper every unvisited seal is printed on |
| Category ink fill + paper glyph | (the inversion `markerIcon()` uses for a highlighted pin) | open / selected | **selected**. It is exactly the shipped selected place pin: the ink fills, the glyph reverses to paper, +8px, the usual pulse. |
| Slate `#3A4C5B` | `STICKER.INK` | visited face (diamond sticker, round sticker, coloured-in pennant) | **visited**. It is the one neutral of every visited mark, and the category colour goes, as on every visited pin. |
| Cream `#FAF5EA` | `STICKER.FACE` / `STICKER.HI_RING` | visited check, a visited stop's number, the selected ring | printed on the visited sticker, as on pins |
| Black `#1A1A18` | `--ink` (`.marker-star-ink`), on a `--paper` halo | the star | **starred**, as on every map mark. It is never `--figure-deep`, which means "cluster" on the map. |
| Grey-brown `#5A564C` | `--ink-2` | a plan stop's number; the pennant's staff | the one secondary-number grey. The staff is neutral structure in the same grey the shipped shape outlines use by default. |
| `--ink` at 16-22% | `#1A1A18` alpha | the tie-on tag's and pennant's contact shadow | no meaning, just depth, restrained (owner: "Shadow is too harsh") |

What the pins never use:

- `--figure` / `--figure-deep` (the city accent). On the map it already means "cluster", and in the
  tag it means the Directions action.
- `--navy` (the frame, and the "on" state of controls).
- Any colour per state other than the ones above.

**Note on "orange = selected":** I found no orange selected state for map marks in the shipped code.
A selected pin inverts to its own category ink (`markerIcon()`), and `--figure-deep` (orange in
Reykjavík) is the cluster. So the shape pins follow the code. If the owner means a new rule, it
applies to place pins and shape pins alike, and that is a system decision, not this pin's.

**Observation (not changed here):** the shipped shape layer draws in `--ink-2` grey unless the row
has its own `color`, while the pin and the list badge use the category ink. So a teal district pin
sits inside a grey dashed outline. That reads fine (outline = structure, pin = identity), but the CD
may want the outline in the category ink at its existing 0.9 / 0.12 alphas.

---

## Variant A: Trail blaze (`blaze-*`)

**Idea.** The list already marks a shape with a diamond badge (`row-badge[data-kind="diamond"]`), so
the map pin is that same diamond seal: a paper field, a category-ink rim and the district or street
glyph. It is the trail blaze nailed to a tree, as in the Pacific Crest Trail diamond in the
Yosemite scrapbook. A blaze is literally how a trail or a territory is marked on the ground. Round
pin = a place; diamond = an area or a route. This answers "same icon treatment on map and popup/list"
most directly.

**Inspo.** `design/inspo/project/yosemite-trail-scrapbook-collage.jpg` (the PCT diamond),
`national-park-posters.jpg` (flat ink on paper).

**States** (`blaze-states`):

- **Unvisited:** a 26px diamond, `--paper` field, 2px category rim, a 13px glyph.
- **Starred:** the map star on the upper-right edge.
- **Visited:** the shipped dark sticker cut as a diamond (`stickerFold('diamond')`, which the app
  already supports). It has the cream check and one vertex peeled (left, right or top, from the shape
  id; never the bottom tip, where the string ties).
  - The shipped rule said "visited = the one round sticker, no district diamond". That is prior
    rationale, not an owner quote. Keeping the diamond keeps "this is an area" readable after a visit.
  - The diamond still loses its colour and glyph, so visited remains "reduction of information".
- **Visited + starred:** the peel goes to the left, clear of the star.
- **Open:** inverted, 34px, and the string starts at its bottom tip.
- **Plan stop:** the number replaces the glyph in grey. This is the shipped numbered diamond, now
  also the Places pin.

**Truth list** (`docs/ux-brief.md`):

- *J identify / navigate:* the pin taps open the tag, so tapping a shape needs no aiming at a
  dashed line.
- *Control parity:* star, visit and plan state all show on one mark, as on a place pin.
- *Hierarchy:* same size and weight as a place seal. It never outranks the pins.
- *Convention:* the diamond-for-area grammar is the app's own (list, plans list).

**Weaknesses.**

- It is the most "system" and least surprising of the three, so it risks the owner's "kinda average".
- At 26px the diamond's inner field is small, so the district glyph (a dashed square) is about 9px
  of ink.
- At 1x the street's dotted-curve glyph is faint.

## Variant B: Tie-on tag (`tie-*`)

**Idea.** The pin is the Hanging Tag in miniature: the tag's own silhouette (top corners clipped), a
punched eyelet, and the glyph. It hangs from its eyelet at the shape's point and swings a few
degrees per shape (from the id hash, like the stamps' lean).

- Tap it and the full tag drops out of it on the string.
- Open, the little tag hangs plumb.
- This is the strongest version of "the pin and what it opens are one idea", and it is literal
  luggage-tag whimsy.

Places stay round seals; only areas and routes are tagged.

**Inspo.** `design/inspo/luggage-tags/` (tag die-cut, eyelet), `5.webp` (the reinforced eyelet), and
the tag in `../../round5/tag/`.

**States** (`tie-states`):

- **Unvisited:** 20×26 tag, `--paper` field, 2px category rim, the eyelet punched through (the map
  shows through), a 13px glyph.
- **Starred:** the star on the upper-right clipped corner.
- **Visited:** the shipped round dark sticker (17px) is stuck on the little tag over its glyph, as
  hotel labels were stuck on cases. The glyph is covered and the rim stays.
- **Open:** inverted, 1.3×, plumb. The string ties at the eyelet and runs behind it to the big tag.
- **Plan stop:** the number replaces the glyph. On a visited stop, the number is on the sticker.

**Truth list:**

- *Identify:* the tag shape says "this opens a tag".
- *Hierarchy:* it is about the same ink area as a seal.
- *Parity:* all marks on one pin.
- *Convention:* the pin hangs below its point. The point is the eyelet, so the tag body sits about
  20px south of the true label point.

**Weaknesses.**

- Open, two tags hang on one string (the small one above the big one). Some will read that as
  redundant.
- The visited state keeps the rim, so it removes less information than A or C.
- The hanging offset means the tag body covers the map just south of the point, where it overlaps
  pins more often than a centred mark (see the `tie-plan` crop).
- The tilt is a little more motion-like noise on a busy map.

## Variant C: Staked pennant (`pennant-*`)

**Idea.** A small swallowtail pennant on a staff, planted at the shape's point: you stake a claim
on an area, like a surveyor's flag or a park pennant. The staff's foot is the exact point, and the
flag carries the glyph.

- Visited = the flag is coloured in (`STICKER.INK`, cream check): you've planted your flag.
- It is the only variant whose silhouette is not a seal at all. It reads as "a territory, not a
  shop" even at a glance.

**Inspo.** Park pennants and trail flags from the park posters / scrapbook ephemera
(`design/inspo/project/`). The swallowtail cut matches the tag's clipped corners.

**States** (`pennant-states`):

- **Unvisited:** a 21×15 paper flag, 1.6px category rim, a 11.5px glyph, and a 27px staff in
  `--ink-2` with a faint contact shadow at its foot.
- **Starred:** the star at the flag's fly corner.
- **Visited:** the flag filled `STICKER.INK` with a cream check. There is no peel, because a flag
  isn't a sticker.
- **Open:** the flag inverts at 1.3×. The string ties at the staff's foot, so the staff and the
  string read as one line down to the tag.
- **Plan stop:** the number on the flag.

**Truth list:**

- *Identify:* this is the most distinct silhouette from place seals.
- *Hierarchy:* the flag is smaller than a seal. The staff adds height but very little ink.
- *Parity:* all marks on one pin.
- *Convention:* a flag's foot is a familiar "here" marker on maps.

**Weaknesses.**

- The glyph is small (11.5px in a 15px flag). At 1x the street's dotted curve is barely legible.
- The flag sits above and right of its point, so the tap target is offset from the true point.
- Visited has no peel, so it breaks the "visited = sticker" family that pins and rows share. Only the
  colour and the check carry it.
- Open, the long staff plus string can read as one tall pole.

---

## Stills

All stills are in `stills/` at 1x full phone (`*-phone@1x.png`) and 3x crop (`*-crop@3x.png`);
`_sheet/` has jpgs for an owner page.

| Name | What |
|---|---|
| `{v}-busy-z14` | busy Places map at zoom 14, where Reykjavík's shapes first draw: about 25 pins, 3 districts, 2 streets (one visited, one starred) |
| `{v}-busy-z16` | the same scene at 16 (a district fills the screen; its pin at the label point) |
| `{v}-district` | Grandi open: round 5's claim-check tag hanging from the new pin |
| `{v}-street` | Laugavegur open |
| `{v}-visited` | visited and starred shapes among visited and starred place pins |
| `{v}-states` | the states board: district / street / shipped place pin / plan stop × unvisited, starred, visited, visited + starred, open; the signed-out note |
| `{v}-plan` | Plans: a district and a street as stops 2 and 4 among place stops |

`{v}` is `blaze`, `tie` or `pennant`.

## Files

- `pins.js`: the three pin builders, the label point, and the states board. It is page-side.
- `render.js`: renders the stills. Run it with `node design/popup-hierarchy/round6/shape-pin/render.js [name|variant|scene ...]`.
  - It drives the real app (unmodified) in the gesture harness (`design/gesture-harness/lib.js`).
  - It uses round 3's helpers and stand-in basemap, plus round 5's `tag3.js`. The only patch to
    `tag3.js` is "Street" for a street's type word.

Limits: Chromium only, with a stand-in basemap; the scene is a synthetic Reykjavík with made-up
shapes.
