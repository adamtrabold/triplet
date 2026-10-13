# Systems designer notes: icon system

## Update 2026-10-13 (after the director's concept steer 1)

- **C is now C′** (rim off, paper disc kept with a warm 1px outer edge, glyph
  Inked + tilted ±6°; bare C dropped: OSM POI confusion). Rewrote
  `concepts/c/how-it-works.md`: legend (rim = state; disc = "a place"; edge =
  structure, and a DOUBLE if it reads as a ring), full matrix (far = disc +
  dot vs a 7–8px silhouette; selected = navy rim back on the disc; plan
  shape stops go round like the shipped sticker; **rows drop the disc**
  because paper on paper is invisible, and keep the bare tilted glyph on one
  centred axis), flows (rim peels; un-visit = ink dries on the shipped `DRY`
  clock with the printed rim and glyph returning from 300ms).
  - Flag to visual: `lib/marks.js` has `TILT = 4`; the director's ruling is ±6.
  - Alternative left open for visual: while selected, keep the navy rim and
    only tilt/ink the glyph (no peel + reprint of the selection ring).
- **D**: size `S` = the smallest of 14/16/18/20 where the peel reads at 1x
  (no 12px); no peel at far; the DOUBLEs stay as D's declared cost. If the
  lastDay squint at `S` still lands on stickers, D goes as the honest cost
  option.
- **B**: reverse pull specced frame by frame against `DRY` (pin holds 0–370;
  pull right→left 370–450 inside the snap, ease-in; glyph back into register
  450–490; reduced motion steps at 80ms; row swipe = 80 + 40ms standalone;
  forward pull 120–320 + jolt 320–360).
- **Line ladder accepted:** 14 in-row × / +, 18 menus, 20 header/tag, 24
  seals; no row or menu grows.
- **Jobs check:** only C has frames. Provisional: J1 PASS, J8 PASS with a
  note (visited★ full-orange stars compete as specks at lastDay, so Q3 matters).
  The rest are pending visual's full C′ set, B's gate strip + near frames and
  D's size strip + lastDay. §7 of each how-it-works holds the table.

## Update 2026-10-13 (concept phase, how-it-works written)

- Jam closed (director pass 2 rulings): **A Blaze killed**; B Second run, C
  Shell off, D Sticker re-weighted go forward. Grammar commitments kept
  (one 2px stroke, two checks, rim star as a mask cut-out, no keyline/halo).
  **Selection replaces the rim** (navy ring becomes the rim, same size, never
  a second outline). Clusters shown orange and ink (owner Q6). My cluster rule
  was accepted. Owner Qs 1-7 go with the first scored concepts.
- Wrote `concepts/b|c|d/how-it-works.md`: legend, full state matrix, the
  3 storyboard flows, the jobs table with proof frames and risks, and the
  index.html touchpoints.
- Systems calls made in them (director may overrule):
  - **Far selected pin shows the 12px glyph** (selection replaces the rim,
    so otherwise a far selected pin has no category). A far pin *can* be
    selected: `markerIcon()` computes far size + `MARKER_HI_DELTA`.
    Resolves my old open question; under the ruling `MARKER_HI_DELTA` -> 0.
  - **B's reprint = one target lightness for all 11 inks** (not one mix %),
    glyph >= 3:1 on paper, never opacity.
  - **D-main has a DOUBLE in the glyph slot** (category vs check) and spends
    size on state. Stated openly; D-alt (cream glyph) clears the glyph one.
  - **You-are-here stays** a navy target (different form from the selection
    ring); risk vs C's far dot in bar/area ink noted.
  - Un-visit: C = the inked glyph dries up (no reversal needed). B = no ink to
    dry on the pin, so a reverse pull timed to the stamp's snap (new motion).
    D = the sticker peels off (must not read as a pop).
- Touchpoint fact: there's **no `rowStampHtml()`**. The stamp markup is
  inline in `renderCard()` ~8198, `buildPopupHtml()` 5074/5077 and the visit
  drag 7811/7860. Any row-stamp change (Q2 b) touches gesture code, so it
  needs the full gesture gate (lane 3). Keeping the stamp doesn't.
- Local checkout now includes the playground (main merged in).

Next: check visual's grammar sheet 2 against the legends, then each concept's
frames against jobs.md (pass/fail per job) before the director scores.

## Where things stand (2026-10-13, end of jam pass 2)

- Jam pass 1 (jobs, diagnosis, families, state model, D1–D6) and pass 2 (the
  build plan) are in `jam.md`. `jobs.md` is written (10 jobs, J7–J10
  inferred, plus 8 "walks").
- Shared fixture built: `concepts/fixture/make-fixture.py` →
  `fixture.json`. It has 27 real Reykjavík places, 3 moments (day0 / halfway
  13 visited / lastDay 24 visited with the 3 left all starred), and 3 frames
  (near z14 solo, mid z13 with 3 clusters, far z11 with 4 clusters + 3 far
  pins) in a 390x545 map viewport. Clusters use the app's
  `clusterCellPxForZoom` grid-snap. Selected = id 2 (★ done) and id 8
  (open). Plan "Saturday" = 5, 3, 12, 16, 21, 7. Edit the script, not the
  JSON.
- Visual pass 1: sketches in `concepts/sketches/`. Finding: at 24px only fill
  / value / shell / size survive. Proposed V1–V5; three voices.
- Director pass 1 steer: concepts **A Blaze, B Second run, C Shell off, D
  Sticker re-weighted**, one shared grammar (Printed / Inked by you / Line),
  a legend per concept with no channel used twice (the weather-map rule), and
  five owner questions batched with the concepts.

## Decisions so far and why

- Concepts differ in the state model and share one grammar (director),
  so the comparison has one variable.
- Tag = two states per segment (open / done). There's no signed-out column:
  origin/main's playground gives signed-out visitors a live guest session
  (6df733a). The guard instead: nothing may look like `--state-off-alpha`
  0.4 (the app's one "unavailable" look). That's a risk for B's tint and
  V5's ghost stamp.
- Cluster rule (my call, director may overrule): the star shows only for an
  open starred member, and weight follows "any open member". Today a cluster
  stars if any member is starred, visited or not, and it's always solid
  orange.
- Real OSM tiles are unreachable (proxy 403 on OSM, Carto, Stadia). Use a
  stand-in basemap in OSM-Carto colours, always labelled. Optional ask
  for the owner: one phone screenshot at z14–15 near Hallgrímskirkja.
- Local checkout is behind origin/main. Read current behaviour via `git
  show origin/main:index.html`.

## Director objections (to carry into checks)

A: hollow = "unchecked" reading, day-0 noise. B: reads "disabled", or "not
differentiated enough". C: a bare glyph reads as an OSM POI; rows get
heavier. D: still the darkest mark, and the check erases the category.

## Open questions

- Owner batch (director's 5): resting peel → transition OK? Is the row stamp
  part of "too strong"? Should visited still show its star? Leaflet zoom
  restyle or remove? May the sticker check become the category glyph?
- Mine: can a far pin be selected without a zoom-in? (matrix cell n/a if
  not). For A/C, does "dries up" reverse, since done carries less ink?

## Next

Wait for visual's grammar board and A–D matrices. Then for each concept:
fill in its legend and "how it works" (cluster rule, selection, motion), and
run the jobs check (§6 of pass 2) before the director scores. After a
concept is approved: the handoff's "How it works" section.
