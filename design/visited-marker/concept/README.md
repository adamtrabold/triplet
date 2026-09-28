# Visited pins on the map — concept stage

Owner's question (2026-09-28, posed as a concept question, not a commitment):
*"should visited places have a different treatment on the map itself?"*

This is concept-stage exploration only. Nothing in `index.html` was touched.
All code below lives in `design/visited-marker/concept/mockup.html`, a
faithful, isolated port of `badgeHtml()` / `markerIcon()` /
`clusterMarkerIcon()` / `markerStarHtml()` — same shell geometry, same
category inks (`CATEGORY_COLORS`), same real glyph paths, same star
placement math — so what you're looking at below is what the real marker
code would actually produce, not an idealized stand-in.

Renders: `full-4x.png` (4x, for judging detail) and `full-1x.png` (true
device pixels) from
`chrome --headless=new --force-device-scale-factor={4,1} --screenshot=...`
against `mockup.html`. Crops referenced below are cut from those two files.

## What's already using the badge's visual budget

Read in full: `markerIcon()`, `badgeHtml()`, `markerStarHtml()`,
`applyMarkerStacking()`, `mapVisibleLocations()`, `clusterMarkerIcon()`
(`index.html` ~3555–4096).

- The badge itself is a **filled circle** (or dashed-rim circle for an
  "(approx.)" fallback pin, or a diamond for a shape) at exactly two solo
  sizes — `MARKER_SIZE_FAR` = 16px (shape/colour only, no glyph, below
  `GLYPH_MIN_ZOOM`=12) and `MARKER_SIZE_NEAR` = 24px (glyph visible, at/above
  zoom 12), plus a flat `+8` highlighted bump (24/32).
- **Category is carried by ink colour alone** (`CATEGORY_COLORS`, 11
  hues) — the rim, and the glyph once it's visible.
- **The star already owns the upper-right shoulder** — `markerStarHtml()`
  places a fixed ~10–16px `--ink` star on a `--paper` halo at the 45°
  point on the rim, at every tier, solo or clustered ("a cluster wears the
  star if any member is starred").
- **`markerKind()`** (solid rim / dashed rim / diamond) already means
  something (pin vs. approx.-pin vs. shape) — that channel is spoken for.
- Cluster badges are a **different, deliberately category-less** shape: a
  flat `--figure-deep` disc with a white count, `CLUSTER_BADGE_PX`=24,
  the star riding the same shoulder position.

So a "visited" signal has exactly two free slots to work with at these
sizes: the **rim** (currently solid ink, 2px), and the **opposite
shoulder** (lower-left, mirroring the star). Nothing else is unclaimed.

## The four treatments

All four were rendered for `restaurant` / `nature` / `hotel` / `shopping`
(a spread of category hues, including the low-contrast lavender), at FAR
16px, NEAR 24px and HI 32px, unvisited vs. visited, plus a
visited+starred combo. See `crop-AB-4x.png`, `crop-CD-4x.png`,
`crop-all-1x.png`.

### A — Dotted rim (passport-stamp motif, ported to the shell)

The solid 2px rim becomes a fine dotted rim once visited — literally the
same "dotted track" idea as `.row-stamp`'s passport stamp, but applied to
the badge's *existing* circular shell instead of adding a new element.
No new geometry, no new colour, no competing with the star's shoulder.

**Legibility (measured against the 4x crop):** reads clearly at all three
sizes, **including FAR 16px** — the dash pattern is still distinguishable
from a solid ring at that size, which is the tier that matters most (most
of the map, most zoom levels, is FAR tier). It is a *shape* cue on the rim,
not a colour cue, so it doesn't compete with `CATEGORY_COLORS` and passes
the same "don't rely on colour alone" bar the list-row stamp itself was
built to satisfy.

**Execution issue (perfection-stage, not concept-blocking):** at HI 32px
the fixed dash array (`"1.6 2.1"`, tuned for the FAR/NEAR sizes) reads a
bit like a gear/sunburst rather than a clean dotted line — the dash count
needs to scale with the rim's circumference, not stay fixed, the same
lesson the real `.row-stamp` track already learned (its own track is a
tuned static SVG mask, not a flat CSS `dasharray`, for exactly this
reason).

### B — Receded field + muted ink (aged-paper motif, ported directly)

Field goes `--paper` → `--paper-filed`, category ink is pulled toward
`--ink-2`, glyph opacity drops slightly — the literal `.is-visited`
recipe from the list row, applied to the badge.

**Legibility: fails.** In the 4x crop (`crop-B2-4x.png`), unvisited and
visited badges at NEAR and HI are barely distinguishable side by side —
the 1.12:1 step that reads as "older paper" across a whole 56px-wide list
row (a large, close-up, full-attention surface) disappears into noise
once it's confined to a 2px rim and a ~16–24px fill glanced at while
panning a map. This is exactly the trap CLAUDE.md's guidance warns about:
the aged-paper motif is real history for *why the list row looks the way
it does*, not a rule that the same colour step must be reused here — the
actual goal (communicating "already seen" at a glance) fails at this
scale, so the motif doesn't transfer even though it's the most
"grounded" option. **Not recommended for the map**, regardless of how
established it is elsewhere in the app.

### C — Small checkmark tick (independent motif, opposite shoulder)

A second small bordered-circle badge — literally the same visual grammar
as the existing 44px popup visited-checkbox affordance (hollow/filled
circle), scaled down — sits at the badge's lower-left shoulder, the exact
mirror of the star's upper-right slot. Two independent signals ("I care
about this" / "I've been here") each get their own fixed position and
never collide, by construction (they're geometrically opposite corners of
the same circle, same math the star already proves out at FAR tier).

**Legibility:** the most explicit of the four — it's a literal checkmark,
unambiguous even at FAR 16px (`crop-CD-4x.png`). But it costs an extra
element, and at NEAR 24px / HI 32px the tick's fixed-ratio size
(`size*0.42`, capped) starts to **overlap the category glyph's own
lower-left edge** (visible on `hotel` and `shopping` in the HI row of
`crop-D-4x.png` — the tick clips into the bed/bag icon). That's a real
execution problem, not just a polish nit: the whole point of `badgeHtml`'s
glyph-floor formula is legibility of the 11-glyph set, and this treatment
reopens that budget without re-solving it. Fixable (shrink the tick or
inset it further), but it needs a real pass, and a *starred + visited*
combo at FAR tier (two decorations on a 16px shell) specifically wants a
rendered check before shipping — not built here; flagging it as an open
question rather than asserting it's fine.

### D — Opacity only (no new geometry, no new colour)

The whole marker — shell, rim, glyph — drops to ~55% opacity once
visited (highlighted always overrides back to 100%, matching the
established "highlighted wins" pattern used everywhere else in this
codebase).

**Legibility:** surprisingly the cleanest of the four in the crops
(`crop-D-4x.png`) — reads immediately at every tier including FAR 16px,
adds zero visual clutter, and is the cheapest possible implementation
(one wrapper `opacity`, no recolouring, no new element). It doesn't
compete with the star or with category colour at all.

**Real risk, not visible in this mockup:** this is a *luminance-only*
cue, tested here against a flat `#F2EFE9` background standing in for OSM
beige. Against a busy real tile (dense street lines, other markers,
water, green space) a faded marker risks reading as "still loading" or
"low-zoom placeholder" rather than a deliberate state — the same
category of risk the visited *list row* explicitly rejected relying on
colour/luminance alone for, which is why that row got the non-colour
`.row-stamp` mark on top of the `--paper-filed` background (WCAG 1.4.1,
called out directly in CLAUDE.md's own history). Opacity-alone on the map
hasn't earned that same double-channel treatment, and this sandbox can't
screenshot real map tiles to check it. Flagging honestly rather than
recommending on faith.

## The cluster case

`crop-cluster3-4x.png`. A cluster already carries one aggregate rule for
starred: **"any member starred → the cluster wears the star."** Visited
needs its own rule, and it isn't the same shape of question — starred is
"is there something here I care about" (any is enough to raise the
flag); visited is closer to "is there still a reason to come here" (which
argues for the opposite logic: only signal once *everything* here is
already done).

Three cluster states were mocked: **plain**, **some members visited**,
**all members visited**.

- **All visited → recede the whole cluster** (rendered here as the same
  fill shifting toward a muted grey-brown, same direction as treatment B,
  but this time at the cluster's actual size — 22px, similar area to a
  solo NEAR badge — where the receded-fill effect reads far better than
  it did on a solo pin's thin rim, because the whole disc is doing the
  work, not just a 2px ring). This is a real, useful piece of information:
  a fully-cleared cluster is telling the owner "nothing left in this
  cluster," which changes whether it's worth navigating there.
- **Some visited → recommend no change.** A rejected alternative is shown
  in the same crop: a faint dashed inner ring meaning "partially
  cleared." Rendered at 22px it is nearly invisible next to the star and
  the count text — a third simultaneous signal crowded onto an already-busy
  22px badge (count + optional star) is the wrong trade. A cluster
  standing for 2+ mixed-category pins is inherently a coarse signal;
  "some but not all visited" doesn't change what action the owner should
  take (there's still a reason to zoom in), so it isn't worth the clutter
  cost. **Not recommended.**

This gives visited an intentionally *asymmetric* rule from starred's
"any," which is the right shape for what each signal is actually telling
the owner, not just a stylistic difference for its own sake.

## Zoom-level question

Should visited show at every zoom, like the star, or only at/above
`GLYPH_MIN_ZOOM` like the glyph itself? The rim-based treatments (A) and
the opacity treatment (D) both read fine at FAR 16px in the crops above,
so there's no legibility reason to gate them — **recommend showing
visited at every zoom, same as the star**, rather than adding a second
zoom-dependent code path alongside `GLYPH_MIN_ZOOM`/`SOLO_MIN_ZOOM` that
would need its own justification.

## Recommendation

**Lead with Treatment A (dotted rim).** It's the only one of the four
that (1) reads at FAR 16px, (2) doesn't add a new element or contend for
space with the star's shoulder or the category glyph, (3) is a shape cue
rather than a colour/luminance cue so it won't wash out on a busy real
tile the way D might, and (4) genuinely descends from the app's own
passport-stamp grammar *because it still works at this scale* — not
because reuse is a goal in itself (see B, which reuses the *other*
established motif and fails outright once measured at marker size).
Treat the HI-tier dash-density issue as a perfection-stage fix (scale
dash count to rim circumference, the way `.row-stamp`'s own track already
had to solve this once).

**Keep Treatment C (checkmark tick) as the fallback if the owner wants a
more explicit, unambiguous mark** and is fine spending the map's one
remaining unclaimed shoulder on it — but it needs the glyph-overlap issue
fixed and a real starred+visited+FAR rendering checked before it's a
real proposal, not just a promising sketch.

**Reject Treatment B outright for the map** — measured, not assumed, to
fail at this scale despite being the most "on-brand" choice by history.

**Treatment D (opacity) is an honest maybe** — the cleanest and cheapest
option in every crop here, but its one real risk (reading as "unloaded"
against a busy real tile, not a deliberate state) is exactly the kind
this sandbox cannot test, since it can't reach map tiles. If the owner
wants to *test* rather than commit, D is the cheapest thing to try first
in a real browser; if it reads ambiguously there, that's the signal to
move to A instead of trying to rescue it with more opacity tuning.

Cluster rule: **recede on all-visited only**; leave partially-visited
clusters untouched. Show the marker treatment at every zoom, not gated by
`GLYPH_MIN_ZOOM`.

Not recommending a build decision here — this is the concept-stage
comparison and the owner's call on which direction (if any) to carry to
UX for concept-level blocker checks before a CD round.
