# Systems designer notes: icon system

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
