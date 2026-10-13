# D · Sticker, re-weighted: how it works (systems)

**Idea:** keep what the owner chose (the dark sticker, cream check, the
peel, the placing motion) and fix only its **weight**: the sticker becomes
**smaller than an open pin** and its face goes **one value step lighter**
(still "the dark colour").

**Size ruling (director, concept steer 1):** the size is set by the peel, not
by a number. At 12px the peel reads as a notch, and the owner called a notch
"stupid". Visual draws a strip of **14 / 16 / 18 / 20px** stickers at 1x on
the stand-in basemap beside an open 24px pin. **D's near size `S` = the
smallest one where the flap still reads as a peel at 1x.** At `S`, with the
lighter face, D goes into the lastDay squint. If the eye still lands on the
stickers before the 3 open starred pins (10, 14, 20), D has failed its own
premise. It still goes to the owner, as the honest "keep what you chose,
here's what it costs" option. Below `S` (far zoom) there's **no peel**: a plain
small disc. The resting peel stays here only, by
design (owner Q1 shown, not argued). Alternative shown only inside D's
matrix: the **cream category glyph instead of the check** (Q5), which also
fixes J7.

Shared (not a variable): grammar, rim star (mask-cut, no keyline/halo),
**selection replaces the rim** (never a second outline; pulse stays), the
cluster rule, the tag (§4). Fixture: `../fixture/fixture.json`.

## 1. Legend

| Channel | Means in D | Notes |
|---|---|---|
| **Size + form (sticker `S` px vs the 24px ringed pin)** | **open vs visited** | size is spent on state as well as zoom: a declared DOUBLE (below). If `S` comes out at 20, the size difference is small and form carries it |
| Value of the sticker face | visited (one step lighter than #3A4C5B) | |
| Shell line style | approx (dashed), open only | visited drops it (shipped "visited = less information") |
| Size (otherwise) | zoom (24 / 16) | `MARKER_HI_DELTA` → 0 |
| Hue: category ink | category, **open only** in D-main | **D-main: a visited pin carries no category.** J7 fails on the map; D-alt (cream glyph) fixes it |
| Hue: dark sticker ink | visited | |
| Hue: brand orange | star | clusters: Q6 (DOUBLE if orange) |
| Hue: navy (place marks) | selection | |
| **Glyph slot** | category (open) / **check (visited, D-main)**: **DOUBLE** | D-alt: the cream category glyph, which clears the DOUBLE |
| Peel (flap, at rest) | visited (the sticker's own form) | the only concept with detail at rest |
| Tilt | visited (shipped `stickerLean()` / corner hash) | |
| Motion | visit = placed (shipped `placeStickerPin()`); un-visit: §3; selected = pulse | |

**Honest DOUBLE count (director: D's declared cost; don't redesign D to dodge it):** D-main carries one (the glyph slot) and spends size
on state as well as zoom (a small sticker vs a full pin). That's D's cost for
keeping the shipped idea, and the legend shows it rather than hiding it.
D-alt clears the glyph slot DOUBLE; the size one stays.

**Cluster:** drawn open if any member is open. All-visited = a
sticker-style disc **at the lighter face**, with a cream count, at `S` (no
peel below `S`), never darker than an open pin. This is D's hardest cell: a dark disc at
cluster size is the original complaint moved to clusters. If it can't meet
"never darker", an all-visited D cluster uses the open cluster style at the
lighter value. Star only for an open starred member.

## 2. State matrix

| Surface | open | open★ | visited | visited★ |
|---|---|---|---|---|
| **Pin near** | 24 ring + glyph (redrawn) | + rim star | **sticker at `S` (14–20, from the strip)**, lighter face, cream check (D-alt: cream glyph), peel at the seeded corner, shipped shadows (restrained) | + star 8px, cut-out (mask) where it overlaps the sticker; no halo |
| **Pin near, selected** | navy rim, glyph category ink, pulse | + star | sticker face → **navy** (selection replaces the face colour; no ring added), cream check/glyph, scale pulse (`markerPulseSolid`) | + star |
| **Pin far (16)** | ring | + rim star | **no peel** (below the size where it reads): a plain disc in the lighter face, ~10px, a cream check if it still reads at 1x, otherwise none | + star 6px |
| **Pin far, selected** | navy ring + 12px glyph | + star | navy-face disc, no peel | + star |
| **Approx** | dashed rim | + star | sticker (dashes drop) | + star |
| **Plan stop** | ring + numeral | + star | small sticker, cream numeral (shipped: visited stop keeps its number) | + star |
| **Plan shape stop** | diamond + numeral | + star | small round sticker + numeral | + star |
| **Shape anchor** | none | star 12px | small sticker at the anchor (`shapeVisitIcon()`, re-sized) | sticker + star |
| **Cluster** | per Q6 | + star | all visited: see cluster note | no star |
| **Row badge** | ringed badge | + star before name | **unchanged ringed badge** (D only re-weights the visited mark) | + star |
| **Row visited mark** | — | — | **(a)** today's stamp; **(b)** the stamp at reduced weight (smaller, lighter ink). Q2 | same |
| **Row, selected (navy)** | paper-ink badge | star | paper stamp (shipped) | star |
| **Filter chip** | inactive greyed glyph beside the 40% swatch | | | |

Z-order: keep `Z_PIN_VISITED_DROP`. A sticker at `S` sits under neighbouring
24px pins in the real overlaps (fixture 3/5, 2/24), which helps J1.

## 3. Flows

**Visit from the tag:** 1 rest open (navy-rim selected pin). 2 tap.
3 impact: the tag stamp comes down (shipped) **and** the sticker is placed on
the pin (shipped `placeStickerPin()`: grow 1.12x, travel toward the flap,
flap edge last, 460ms), at `S`. The open pin under it
**fades out** as the sticker lands (the sticker replaces the pin, as today).
4 settle. 5 rest done (navy-face sticker, selected).

**Visit from a row swipe:** the shipped gesture with the stamp, untouched;
**after** it, as a separate step, the pin's sticker is placed (exactly
today's chain via `syncMarkers()`).

**Un-visit:** the tag/row stamp dries up (shipped `dryUp()`). The pin: the
sticker **peels off** (the shipped row un-visit language: flap curls, shadow
lifts, fades) and the open pin prints back under it. The sticker is a
physical object, so it peels rather than dries; the dry-up stays where the
ink is (stamp). That's consistent with the owner's "Un-visit dries up; it
never just disappears, never pops" only if the peel reads as a motion, not a
pop. Show the frames.

## 4. Tag (shared)

Directions = Line compass. Star open = Line star, done = orange + band.
Visited open = Line check + label, done = inked stamp. Two states per
segment; the 40% swatch beside the open segments.

## 5. Jobs

| Job | How | Proof frame | Risk |
|---|---|---|---|
| 1 See what's left | visited is smaller than an open pin (`S` < 24) and lighter | size strip at 1x, then the squint at lastDay (D's premise test) | dark + compact still pulls the eye. If so, D goes to the owner as the honest cost option |
| 2 Open vs done | form + size + colour: very distinct | matrix | — |
| 3 No noise | star 1 element; a resting peel + shadow = detail at rest | size strip at 1x | `S` is chosen exactly so the peel reads as a peel, not a notch |
| 4 One family | grammar board | sheet 2 | the sticker is the one non-grammar mark left |
| 5 / 6 | canvas; one of three | | |
| 7 Category kept | **D-main fails on the map** (check replaces the glyph); D-alt passes | matrix both | owner's continuity rule ("visited icon changes to a checkmark") vs "preserve the category icon": Q5 |
| 8 Find starred | open★ rim star on a full pin among small stickers | lastDay 10, 14, 20 | — |
| 9 Buttons vs labels | tag Line full ink | tag + swatch | — |
| 10 See it land | shipped placing motion + stamp | storyboards | un-visit peel must not read as a pop |

## 6. What it would touch in index.html

Smallest diff of the three:
- `STICKER` (4587) size/face constants (sticker size decoupled from `MARKER_SIZE_NEAR`; a no-peel far variant) (`PIN_*`, face ink), `STICKER_CHECK`
  near/far sizes (4631); `stickerPinParts()` 4832 size; D-alt: the glyph
  instead of the check in `stickerPrint()` (4791) / `stickerPinParts()`.
- `markerIcon()` 4850: sticker size decoupled from the pin size; selected
  face navy (today `STICKER.HI_FACE` `--ink-2`); `MARKER_HI_DELTA` → 0.
- `stickerStarHtml()` 4849 / `markerStarHtml()` 4559: rim/cut-out star.
- `placeStickerPin()` 7712 (sizes only); an un-visit peel for the pin (new;
  today the pin just re-renders).
- `clusterMarkerIcon()` 6877, `mapVisibleLocations()` 6827 (cluster rule).
- `planNumberIcon()` 5630, `shapeVisitIcon()` 6596.
- Rows: Q2 (b) touches the inline stamp markup in `renderCard()` 8198,
  `buildPopupHtml()` 5074/5077 and the visit drag 7811/7860 → **gesture
  gate**. (a) touches nothing.
- `buildPopupHtml()` 5047: Line star / Line check.
- Line icons as in B/C.

## 7. Jobs check (pass/fail with proof frames)

Checked 2026-10-13 on `set/` (canvas v11). Size from the strip: **`S` =
18px** (`set/d-size-1x`: at 12–14 the flap reads as a notch, at 16 it's
marginal, at 18 it reads as a peel on land, road and park).

| Job | Verdict | Evidence |
|---|---|---|
| 1 See what's left | **BLOCKER** | `set/d-near-D-lastDay-squint-3x`: the 24 dark stickers at 18px are still the first thing the eye hits; the 3 open★ (10, 14, 20) are not. D's premise test fails, as the director predicted |
| 2 Open vs done | **PASS** | very distinct: form, size and colour (`d-near-D-lastDay-1x`) |
| 3 No noise | **PASS, weak** | star = 1 element, but each visited pin carries sticker + check + flap + shadow at rest. That's the declared cost of keeping the peel |
| 4 One family | **PASS** (shared) | `gx-*`. The sticker is the one non-grammar mark left |
| 5 / 6 | **PASS** | canvas v11; one of three |
| 7 Category kept | **BLOCKER (D-main) · PASS (D-alt)** | `d-near-D-lastDay-1x`: every visited pin is the same check, so the category is gone on the map. D-alt (`d-size`, "16, cream glyph (Q5)") keeps it |
| 8 Find starred | **BLOCKER** | same frame as J1: the open★ pins aren't found first among the stickers |
| 9 Buttons vs labels | **PASS** (shared tag) | `../c/set/c-tag-C-8` (+ `-off`) |
| 10 See it land | **UNPROVEN** | no D storyboards. The placing motion is shipped, but the un-visit peel on the pin is new and not drawn |

**Verdict:** D fails J1 and J8 at 18px, which is its own premise. Per the
director it still goes to the owner, as the honest "keep what you chose,
here's what it costs" option: show the lastDay squint beside C's, and
D-alt for J7.
