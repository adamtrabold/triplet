# C · Shell off: how it works (systems)

**Idea:** the guide prints a place as a shell (ring + paper) with its glyph.
When you've been, the printed shell comes off, and what's left is the
glyph **in your ink**: category colour, seeded tilt, slight ink texture,
straight on the map. A visited place carries *less* ink than an open one,
changes *form* (no container), and keeps its category (J7).

Shared by B, C and D, not repeated as a variable: the grammar (Printed /
Inked by you / Line; one 2px stroke; one ×, +, chevron; a Line check for
"current" and the open Visited control, an Inked check only inside VISITED),
the **rim star** (mask-cut, no keyline, no halo), **selection replaces the
rim** (navy ring *becomes* the rim, same size, never a second outline, and
the shipped pulse stays the motion), the **cluster rule** (below), and the
tag (§4). Fixture: `../fixture/fixture.json`.

## 1. Legend (one channel, one meaning)

| Channel | Means in C | Notes |
|---|---|---|
| **Shell present / absent** | **open (shell) vs visited (no shell)** | the state channel |
| Shell line style | approx (dashed rim), only while open | visited drops it, like the shipped sticker ("visited = less information") |
| Fill vs hollow | (not spent) | open shell = paper field; that is the shell, not a state |
| Value | (not spent) | visited glyph is full category ink, not a tint, so it never reads 40% |
| Size | **zoom only** (near 24 / far 16) | selected no longer +8 (`MARKER_HI_DELTA` → 0) |
| Hue: category ink | category | in every state |
| Hue: brand orange | star (+ action glyphs off-map) | clusters: Q6. If orange stays, this row is a DOUBLE (star + cluster), so it's shown both ways |
| Hue: navy (place marks) | **selection** (ring) | you-are-here = navy *target* (disc + paper ring, no glyph). It's a different form, and "the thing that is you" is close to selection anyway. Kept; see risk R4 |
| Glyph slot | category; a plan stop's number (shipped Plans grammar) | never a check |
| Rim position 12 o'clock | star | open: cut into the rim; visited: no rim, see matrix |
| **Tilt + ink texture** | **marked by you** (visited) | the same seeded tilt as the stamp (`stampTilt()`-style, per place), so nothing jumps on re-render; range ±6° to start, can go down (director risk) |
| Motion | visit = shell peels off; un-visit = ink dries up; selected = pulse | |

**Cluster** (systems rule, accepted): a cluster is drawn **open** if any
member is open, and **visited** (shell off: the count printed in ink on the
map, no disc) if all members are visited. It shows the star only if an
**open** member is starred. A cluster is never darker than an open pin.

## 2. State matrix (what each cell is)

Real sizes. Each cell is drawn on stand-in tile; rows on `--paper` and on the
navy selected row.

| Surface | open | open★ | visited | visited★ |
|---|---|---|---|---|
| **Pin near (24)** | ring 2px category ink, paper field, glyph 18 | + rim star at 12 o'clock (mask cut) | glyph only, **15–16px**, category ink, seeded tilt, ink texture, hairline paper knock-out (≤1px) for legibility on tiles | + star 9px, Inked (same tilt), at 12 o'clock above the glyph; one element |
| **Pin near, selected** | navy ring replaces the category rim, glyph in category ink, pulse | same + rim star | navy ring comes back around the tilted glyph (one outline only; no paper field, so the tile shows through: it's still "shell off") + pulse | same + star |
| **Pin far (16)** | ring, no glyph | ring + small rim star | **solid category-ink dot 5px** (alt shown beside it: 7–8px solid glyph silhouette, the director's dot risk) | dot + 7px star |
| **Pin far, selected** | navy 16px ring **with the glyph at 12px** (selection replaces the rim, so the category moves into the glyph; otherwise a selected far pin would carry no category) | same + star | navy ring around the dot → use the 12px tilted glyph instead | same + star |
| **Approx** | dashed rim | dashed + rim star | same as visited (dashes drop) | same as visited★ |
| **Plan stop** | ring + Printed numeral (grey `--ink-2`) | + rim star | shell off: the numeral alone, Inked (tilt), in `--ink-2` | + star |
| **Plan shape stop (diamond)** | diamond shell + numeral | + star | numeral alone, Inked | + star |
| **Shape anchor (district/street)** | none (owner: no shape pins) | star 12px at the anchor | glyph (district/street), Inked, 15px at the anchor; replaces the dark sticker of `shapeVisitIcon()` | glyph + star |
| **Cluster (24)** | open style (ring + count, orange or ink per Q6) | + star | all visited: count printed in ink, no disc, no ring | all visited + starred: no star (visited★ never stars a cluster) |
| **Row badge (24 in 28 col)** | today's ringed badge, redrawn in the grammar | + orange star before the name | glyph 15px, tilted, no ring, **centred on the column's axis** (by rendered ink, not the box) | + star before the name, full orange (row star unchanged; Q3) |
| **Row, selected (navy)** | badge in paper ink | star | glyph in paper ink, tilted | star |
| **Row visited mark** | — | — | **(a)** today's VISITED stamp; **(b)** the concept's row (visual's call: smaller stamp / struck word). Owner Q2 | same |
| **Tag stub** | see §4 | | | |
| **Filter chip** | not state-bearing: active glyph full ink; inactive greyed, shown beside the 40% swatch | | | |

Z-order (shipped `Z_PIN_VISITED_DROP`): to-do above visited★ above visited.
Keep it, because shell-off glyphs must sit under open pins in the real
overlaps (fixture 3/5, 2/24).

## 3. Flows (storyboards, 5 beats each)

**Visit from the tag** (Kaffibarinn, open, selected; the pin is visible
above the tag):
1. Rest: tag open; Visited segment = Line check + VISITED label, full ink;
   pin = navy-ring selected, glyph upright.
2. Tap: segment press (`hapticTap()`).
3. Impact: the tag's stamp comes down (`tagStampIn`, shipped, 420ms).
   **At the same moment** the pin's shell **peels off**: paper + ring lift
   from one seeded corner (the shipped peel geometry: `stickerCorner()` /
   flap curl, re-used for the *shell* rather than a sticker) and fall away
   with a short fade.
4. Settle: the glyph rotates from 0° to its seeded tilt, with a small ink
   bleed (the shipped stamp's ink language, scaled to 15px); the navy
   selection ring stays (it's selection, not shell).
5. Rest: done: the tag shows the stamp; the pin is the tilted glyph inside
   the navy selection ring.

**Visit from a row swipe** (left, on Café Loki):
1–4. The shipped row gesture, unchanged: stamp hover, press at 56px, field,
     haptic (`paintVisit()` / `settleVisitDrag()`; gesture code is not
     touched).
5. **After** the gesture (`afterRowGesture()` / the state change), as a separate
   step: the row badge's shell peels off (same motion as the pin, 24px), then,
   if the pin is on screen, the pin's shell peels off (`syncMarkers()` on the
   state change, as `placeStickerPin()` is triggered today).

**Un-visit, dry-up** (Brauð & Co, done, selected):
1. Rest done. 2. Tap the stamp segment. 3. The tag's stamp dries up by
thickness (shipped `dryUp()`, `DRY` timings untouched); on the pin the
**inked glyph dries up by thickness** (same filter, its thick parts last),
while underneath, the printed shell and the upright printed glyph fade back
in. 4. Final snap (`SNAP_*`). 5. Rest open: the printed pin.
In C the dry-up still has ink to dry: the done state is *your ink*, so
reversing the visit = your ink drying away. No reversed motion is needed.

Reduced motion: shell simply goes / comes back; the glyph appears at its
tilt (as the shipped sticker "simply appears").

## 4. Tag (all concepts; C changes nothing extra)

Directions = Line compass. Star: open = Line star, full ink; done = orange
filled star + the band (`TAG_STAR_STYLE` 'band'). Visited: open = Line check
+ "VISITED" label at full ink; done = the inked stamp (1.1x). There are two
states per segment and no signed-out state (playground). The 40% swatch sits
beside the open segments on the board, and they must not resemble it.

## 5. Jobs (`jobs.md`): how C meets them, and the frame that proves it

| Job | How | Proof frame | Risk |
|---|---|---|---|
| 1 See what's left | open = shell (more ink, contained); visited = bare small glyph | near day0/halfway/lastDay squint | lastDay: 24 tilted glyphs read messy, not done (director) |
| 2 Open vs done | shell vs no shell: a form change, survives grayscale | matrix, grayscale copy | far: ring vs dot is small at 16 vs 5px |
| 3 No noise | visited★ = 2 elements; selected = 1 outline | matrix | tilt adds visual motion at lastDay |
| 4 One family | shared grammar board | grammar sheet 2 | — |
| 5 Side by side | canvas row "C · …" beside TODAY | canvas | — |
| 6 Choose | one of three (B value, C form, D weight) | — | — |
| 7 Category kept | glyph in every state, map and row | matrix | far dot loses glyph shape (colour only) |
| 8 Find starred | open★ = rim star on a full pin; visited★ star small and inked | lastDay: 10, 14, 20 found first | orange road under pin 1 |
| 9 Buttons vs labels | tag open segments in Line at full ink | tag frame + 40% swatch | — |
| 10 See it land | peel-off (the peel he chose, as motion) + dry-up (approved, untouched) | storyboards | peel now a *motion*, not at rest (Q1) |

Named risks to show, not argue: **R1** lastDay messy → also show tilt ±3°.
**R2** far dot vs "dots… absolutely not" → dot and 7–8px silhouette side by
side. **R3** bare glyph read as an OSM POI → stand-in basemap with OSM POIs
by pins 2, 8, 6. **R4** C's 5px dot in bar/area ink (#3D5A7A / #2B3F52)
near you-are-here's navy → put one beside it in the far frame.

## 6. What it would touch in index.html (for scoping, not a build spec)

- Sprite `<symbol id="g-*">` (~2495–2512): glyph redraws (shared grammar).
- `badgeHtml()` 4517: rim → navy on selected (no inversion); an Inked
  "shell-off" variant (glyph only, tilt, texture).
- `markerIcon()` 4850: visited path stops calling `stickerPinParts()`;
  selected keeps size (`MARKER_HI_DELTA` → 0); far selected shows the glyph.
- `markerStarHtml()` 4559 / `stickerStarHtml()` 4849: rim star (mask cut);
  the Inked small star for visited★.
- `placeStickerPin()` 7712 → a shell-peel equivalent; `STICKER` / flap
  geometry (`stickerFold()`, `stickerCorner()`) re-used for the shell.
- `dryUp()` 5005: applied to the pin's glyph as well as the stamp.
- `clusterMarkerIcon()` 6877 + `mapVisibleLocations()` 6827: star only for
  an open starred member (`m.starred && !m.visited`), an all-visited flag,
  both in the cluster id (so the badge recreates); `syncClusterMarkers()`.
- `planNumberIcon()` 5630, `planLead()` / `numSpan()` 5593–5597: shell-off
  numeral.
- `shapeVisitIcon()` 6596, `shapeStarIcon()` 6578.
- `renderCard()` 8183: row badge visited variant; the row stamp is inline
  markup here (~8198). There's no `rowStampHtml()`: the same stamp markup
  is repeated in `buildPopupHtml()` (5074/5077) and the visit drag
  (7811/7860), so a row-stamp change (Q2 b) touches gesture code → **lane 3,
  full gesture gate**. Keeping the stamp (Q2 a) doesn't.
- `buildPopupHtml()` 5047: tag Line star / Line check for open segments.
- Line icons: `rowActionHtml()` 5602 (× text glyph), collapse ▼ (~2642),
  plan + (`.plan-add-glyph` rotate), header icons, Leaflet zoom (CSS or
  `zoomControl` off: Q4), you-are-here (~4297).
