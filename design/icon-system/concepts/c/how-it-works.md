# C · Shell off (C′: rim off, paper kept): how it works (systems)

*Rewritten 2026-10-13 after the director's concept steer 1. The bare-glyph C
is dropped: at 1x its glyph read as OSM's own POI icon
(`c-poi-check-3x.png`). This is the C that goes forward.*

**Idea:** the guide prints a place as a **rim + paper disc + upright glyph**.
When you've been, the printed **rim comes off**, and what's left is the
paper the place was printed on with **your ink** on it: the glyph in its
category colour, at a seeded tilt, with a slight ink texture. It's a change of
*form* (the rim is gone), not of value (so it's distinct from B), and the
paper disc is what OSM never draws.

Shared by B, C and D (not a variable): the grammar (Printed / Inked by you /
Line; one 2px stroke; Line ladder **14 in-row × / +, 18 menus, 20 header/tag,
24 seals**, with no row or menu growing), the **rim star** (mask cut-out, no
keyline, no halo), **selection replaces the rim** (navy ring *becomes* the
rim, same size, never a second outline; the shipped pulse is the motion),
the cluster rule, and the tag (§4). Fixture: `../fixture/fixture.json`.

## 1. Legend (one channel, one meaning)

| Channel | Means in C | Notes |
|---|---|---|
| **Rim present / absent** | **open (rim) vs visited (no rim)** | the state channel |
| Rim line style | approx (the grammar's approximate tell), open only | a visited approx place drops it (shipped "visited = less information") |
| Paper disc | "a place" (present in every pin state) | not a state: open and visited both have it |
| **Disc edge: warm 1px, low alpha, outer outline only** | (structure, not meaning) | owner-approved "1px hard edge to add shadow definition" (the shipped `STICKER.EDGE` rule). It makes the coin read the same on land, road, park and water. If it reads as a ring at 1x it's too strong, and then it *would* spend the rim channel twice |
| Value | (not spent) | the visited glyph is full category ink: never a tint, never 40% |
| Size | **zoom only** (24 near / 16 far) | selected stays the same size (`MARKER_HI_DELTA` → 0) |
| Hue: category ink | category, every state | |
| Hue: brand orange | star (+ the action glyphs off-map) | clusters: owner Q6. If clusters stay orange, this row is a DOUBLE, shown both ways |
| Hue: navy (place marks) | **selection** (ring) | you-are-here = navy *target* (disc + paper ring, no glyph): a different form, kept |
| Glyph slot | category; a plan stop's numeral (shipped Plans grammar) | never a check |
| Glyph orientation + ink texture | **marked by you** (visited) | upright = printed; **tilt ±6°** (director: keep 6; `lib/marks.js` has `TILT = 4`, so set it to 6), seeded per place so nothing jumps on re-render (like `stampTilt()`) |
| Rim position 12 o'clock | star | visited★: no rim to cut, see matrix |
| Motion | visit = rim peels off; un-visit = your ink dries up; selected = pulse | |

**Cluster** (accepted rule): drawn **open** if any member is open; if all
are visited, it's drawn the visited way: **rim off, paper disc + edge, count
in ink**. Star only if an **open** member is starred. Never darker than an
open pin.

## 2. State matrix

Real sizes. Map cells on the stand-in basemap over **land, road, park and
water** (the edge's test). Rows on `--paper` and on the navy selected row.

| Surface | open | open★ | visited | visited★ |
|---|---|---|---|---|
| **Pin near (24)** | rim 2px category ink, paper disc, upright Printed glyph 17–18 | + rim star at 12 o'clock (mask cut) | **no rim**; paper disc (r ≈ 10.6) + warm 1px edge; glyph Inked, 17, category ink, tilt ±6°, a paper knock-out under the glyph only where it overlaps the edge | + star at 12 o'clock, Inked, ~9px, the same tilt, sitting on the disc's edge (one element; no rim to cut) |
| **Pin near, selected** | navy rim replaces the category rim, upright glyph in category ink, pulse | + rim star | **navy rim comes back on the disc** (one outline, the selection), glyph keeps its tilt and ink; pulse | + star |
| **Pin far (16)** | rim, no glyph | rim + small rim star | **paper disc + edge with a category-ink dot ~5px** (alt beside it: a 7–8px solid glyph silhouette, the director's "dot" risk) | + 7px star |
| **Pin far, selected** | navy rim + glyph 12px (the category moves into the glyph, since the rim is navy) | + star | navy rim + tilted glyph 12px | + star |
| **Approx** | the grammar's approx rim (visual is testing 2–3 long segments vs dashes) | + star | as visited (approx tell drops) | as visited★ |
| **Plan stop** | rim + Printed numeral `--ink-2` | + rim star | rim off: disc + edge, numeral Inked (tilt) in `--ink-2` | + star |
| **Plan shape stop (diamond)** | diamond rim + numeral | + star | diamond rim off: **round** disc + edge (as the shipped sticker made shapes round), numeral Inked | + star |
| **Shape anchor (district/street)** | none (owner: no shape pins) | star 12px at the anchor | disc + edge + district/street glyph Inked, at the anchor (replaces `shapeVisitIcon()`'s sticker) | + star |
| **Cluster (24)** | rim + count (orange or ink, Q6) | + star | all visited: disc + edge, count in ink, no rim | all visited★: no star |
| **Row badge (24 in the 28 column)** | ringed badge (rim + paper + upright glyph) | + orange star before the name | **bare glyph, 15–17px, tilted, no rim, no disc.** Paper on paper is invisible, so the disc is dropped in rows (said plainly: rows don't carry the disc, and the rim-off is the change) | + star before the name, full orange (Q3) |
| **Row, selected (navy)** | badge in paper ink | star | bare glyph in paper ink, tilted | star |
| **Row alignment** | the open 24px ringed badge and the visited bare glyph share **one centred axis by rendered ink** (measured overlay, director §5) | | | |
| **Row visited mark** | — | — | **(a)** today's VISITED stamp; **(b)** the concept's lighter row (Q2) | same |
| **Filter chip** | not state-bearing; the inactive greyed glyph shown beside the 40% swatch | | | |

Z-order: keep `Z_PIN_VISITED_DROP` (to-do above visited★ above visited), so
the paper discs sit *under* open pins in the real overlaps (3/5, 2/24).

## 3. Flows (5 beats each)

**Visit from the tag** (Kaffibarinn, open, selected; its pin visible above
the tag). *Updated from visual's storyboard `set/c-sb-tag-*`.*

**Finding: from the tag the rim peel can't show.** A pin with its tag open
is always selected, so its rim is the **navy selection ring**, not the
category rim, and there's no printed rim to peel. "Selection replaces the
rim" and "the visit peels the rim" meet on the same ring, and selection
wins. So from the tag:
1. Rest: Visited segment = Line check + MARK VISITED, full ink; pin = navy
   rim, upright glyph.
2. Tap (`hapticTap()`): segment press.
3. Impact: the tag's stamp comes down (`tagStampIn`, 420ms, shipped). It's
   the moment, and it's the big surface. The pin's glyph **takes the ink**
   (Printed → Inked texture) in the same frames.
4. Settle: the glyph turns to its seeded tilt (±6°) with a small bleed.
   The navy rim stays (it's selection).
5. Rest done: navy rim, paper disc, inked tilted glyph.
   On **tag close** the selection ring simply goes (as today's deselect does)
   and the visited coin is left. No deferred peel: a peel on close would
   make selection look like a visited state (one channel, one meaning).

The peel is still in the concept. It plays **wherever the pin isn't
selected**: after a row swipe on any row whose tag isn't open (below),
and in Plans. A swipe on the selected (navy) row behaves like the tag: ink +
tilt, no peel. That covers the owner's "state changes
animate wherever they come from": the tag animates the stamp + glyph, and
the unselected pin animates the peel. Open question for the director: is
"tilt + ink only" on the selected pin enough of a pin change, given that
the tag stamp beside it carries the moment? My read is yes, because J10 is
met by the tag. The pin's change is legible once the tag closes.

**Visit from a row swipe** (left, on Café Loki):
1–4. The shipped gesture, untouched (`beginVisitDrag()` / `paintVisit()` /
`settleVisitDrag()`; stamp hover, press at 56px, field, haptic).
5. **After** the gesture, as a separate step (state change /
`afterRowGesture()`): the row badge's rim peels off and the glyph tilts. Then,
if the pin is on screen, the pin's rim peels off (from `syncMarkers()`, as
`placeStickerPin()` is triggered today).

**Un-visit, dry-up** (Brauð & Co, done, selected): the shipped `DRY` clock
(540ms) runs on the tag's stamp **and** on the pin's inked glyph:
- 0–370ms: the glyph's ink dries by thickness (thin parts first: fork
  tines, cup handle; the thick body last), in the same `--ghost-tint` shell
  → core language, filter at glyph size.
- 370–450ms: the snap; the last cores go.
- From ~300ms, under the drying ink, the **upright Printed glyph** (and,
  if the pin isn't selected, the category rim) **print back in** (opacity 0 → 1 by 450ms; no pop, no scale).
- 470–540ms: the tag's MARK VISITED words ink in (shipped). The pin is at
  rest open.

C still has ink to dry: the done state *is* your ink. Nothing in the
shipped motion is reversed.

Reduced motion: the rim goes or comes back in one step; the glyph appears
at its tilt; the tag uses the shipped `dryFadeRm`.

## 4. Tag (shared; C adds nothing)

Directions = Line compass (20). Star: open = Line star, full ink; done =
orange star + the band (`TAG_STAR_STYLE` 'band'). Visited: open = Line
check + label, full ink; done = inked stamp at 1.1x. Two states per segment,
with no signed-out state (playground). The 40% swatch is shown beside the
open segments.

## 5. Jobs: how C meets them (proof frames named; the pass/fail check is §7)

| Job | How | Proof frame | Risk |
|---|---|---|---|
| 1 See what's left | open = rim + upright print; visited = no rim, so it recedes | near day0/halfway/lastDay + squints | patchy coin on mixed basemap (the edge fix) |
| 2 Open vs done | rim vs no rim: survives grayscale | matrix, grayscale copy | far: rim vs dot-on-disc at 16px |
| 3 No noise | visited★ = 2 elements; selected = 1 outline | matrix | the edge reading as a ring |
| 4 One family | grammar sheet 2, 16→18 step, no row grows | grammar + 18px context crops | — |
| 5 Side by side | canvas row "C · …" beside TODAY | canvas | — |
| 6 Choose | B value / C form / D weight | — | — |
| 7 Category kept | glyph in every state; the paper disc stops it reading as an OSM POI | `c-poi-check` redone for C′ | far dot = colour only |
| 8 Find starred | open★ = full pin + rim star | lastDay: 10, 14, 20 found first | orange road under pin 1 |
| 9 Buttons vs labels | tag open segments are Line at full ink | tag + 40% swatch | — |
| 10 See it land | the rim peels (his peel, moved into the motion) + the approved dry-up | storyboards | peel at rest → motion is Q1 |

## 6. What it would touch in index.html (scoping only)

- Sprite `<symbol id="g-*">` (~2495–2512): glyph redraws (grammar).
- `badgeHtml()` 4517: navy rim on selected (no inversion); the rim-off
  variant (disc + edge + tilted Inked glyph); rows' bare-glyph variant.
- `markerIcon()` 4850: the visited path stops using `stickerPinParts()`;
  `MARKER_HI_DELTA` → 0; far selected shows the glyph.
- `markerStarHtml()` 4559 / `stickerStarHtml()` 4849: rim star (mask);
  the small Inked star for visited★.
- `placeStickerPin()` 7712 → a rim-peel equivalent; `stickerFold()` /
  `stickerCorner()` geometry reused for a ring strip.
- `dryUp()` 5005 / `.dry-out`: applied to the pin's glyph as well.
- `clusterMarkerIcon()` 6877 + `mapVisibleLocations()` 6827: star only for
  `m.starred && !m.visited`, an all-visited flag, both in the cluster id;
  `syncClusterMarkers()` 6892.
- `planNumberIcon()` 5630, `planLead()` / `numSpan()` 5593–5597,
  `shapeVisitIcon()` 6596, `shapeStarIcon()` 6578.
- `renderCard()` 8183: row badge visited variant. The row stamp is inline
  markup (~8198; also `buildPopupHtml()` 5074/5077 and the visit drag
  7811/7860). There's no `rowStampHtml()`. Q2 (b) therefore touches gesture
  code → **full gesture gate**. Q2 (a) doesn't.
- `buildPopupHtml()` 5047: Line star / Line check open segments.
- Line icons: `rowActionHtml()` 5602 (text ×), collapse ▼ (~2642), plan +
  (`.plan-add-glyph`), header icons, sort/plan checks (16 → 18), Leaflet
  zoom (Q4), you-are-here (~4297).

## 7. Jobs check (pass/fail with proof frames)

Checked 2026-10-13 on visual's full C′ set (`set/`, canvas v11) and the shared
grammar frames (`../grammar/gx-*`). Frames are 1x unless named.

| Job | Verdict | Evidence |
|---|---|---|
| 1 See what's left | **PASS** | `set/c-near-C-{day0,halfway,lastDay}-squint-3x`: day 0 is as calm as today; at lastDay the open 14 (on the trunk road), 20 and 10 (approx) are the darkest map marks after the out-of-scope seals; today's lastDay is a field of dark blots (`c-near-today-lastDay-squint-3x`) |
| 2 Open vs done | **PASS near · UNPROVEN far** | near: rim vs no rim, `c-near-C-lastDay-1x`. Far: `c-far-C-ink-lastDay` has **no open far pin** (all 3 solo far pins, 4/26/27, are visited at lastDay), so open vs done at far isn't shown. Needs **far/halfway**, where 27 Grótta (★) is open |
| 3 No noise | **PASS** | visited★ = coin + star (2 elements); selected = one navy outline (`c-tag-C-2`). Note: visited★ stars at full orange read as specks next to the open★ rim stars at lastDay (Q3) |
| 4 One family | **PASS** (shared) | `gx-line18`: the sort menu rows stay 40px and the ledger 45px, nothing grows; `gx-axis-overlay`: the left column's ink centres sit within 0.67px of the axis horizontally |
| 5 Side by side | **PASS** | canvas v11 rows "C · …" beside TODAY, labelled draft |
| 6 Choose | **PASS** | B / C / D are three kinds |
| 7 Category kept | **PASS** (with the far silhouette) | near and rows keep the glyph (`c-near-C-lastDay-1x`, `c-list-C-*`). OSM POIs (orange-brown cup and fork) have no disc, and C′'s coins read as ours. Far: the 7–8px silhouette keeps the glyph (`c-far-C-ink-lastDay`, `c-far-detail`); the 5px dot is colour only, so **the silhouette is the one to send** (visual agrees) |
| 8 Find starred | **PASS with a note** | the 3 open★ are found first at lastDay. Visited★ orange stars compete a little (J3 note, Q3) |
| 9 Buttons vs labels | **PASS** | `c-tag-C-8`: Star / MARK VISITED are Line icons at full ink; `c-tag-C-8-off` is the 40% look beside it and reads clearly different |
| 10 See it land | **PASS** | `c-sb-tag` (stamp + glyph inks and tilts; no peel on a selected pin, see §3), `c-sb-row` (rim peels after the gesture), `c-sb-dry` (dry by thickness, printed glyph returns) |

Nits: the visited bare glyph in rows sits 1.67px low against the axis
(`gx-axis-overlay`, vertical), where open badges are at +0.83, so nudge it
up ~0.8px. The far frame wants a halfway twin (J2).
