# Visited pins on the map — concept stage

> Note (2026-09-29): `CLAUDE.md`'s shipped-feature history and open items, cited below as "CLAUDE.md", now live in `docs/shipped.md` and `docs/backlog.md`.

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

## Hybrid round (owner feedback, 2026-09-29)

The owner reviewed the four treatments above **on a real device**, not
just the Chromium crops, and gave concrete direction: Treatment A's
dotted-track motif reads as noisy/"unintelligible" at real small marker
sizes — the 4x crop overstated its legibility. Wanted: a **hybrid of B
(receded/muted field) + a toned-down A (dotted rim), with far fewer
dots** so it doesn't read as "wavy." Scoped to the map-marker concept
only — `.row-stamp` (the shipped list-row badge) is untouched.

Three hybrid variants were added to `mockup.html` (`markerHybrid()` +
`markerHybrid1/2/3`), all built on the same real `badgeHtml()` port used
above — same shell geometry, same `CATEGORY_COLORS`, same star math — so
what's below is real marker code, not a stand-in. All three combine B's
`--paper` → `--paper-filed` field shift + muted ink with a dotted rim at
a **fixed, low dot count**, computed against the rim's actual
circumference (`dottedRimDasharray()`) so the count stays constant across
FAR/NEAR/HI instead of scaling into density the way a flat CSS
`stroke-dasharray` would.

- **Hybrid 1** — 8 dots, `muted()` amount 0.42 (same field/ink shift as
  standalone B), glyph opacity 0.78.
- **Hybrid 2** — 12 dots, same field/ink shift, glyph opacity 0.78.
- **Hybrid 3** — 16 dots, a *lighter* field shift (0.30, closer to B's
  untuned original) + glyph opacity 0.85, testing whether a lighter field
  affords more dots before it reads as wavy.

All three render the dots as true round dots (`stroke-linecap="round"`
with a near-zero dash length) — the same technique behind the shipped
`.row-stamp` mask's "84 round zero-length-dash dots," not the flat
rectangular dashes Treatment A used. **This mattered in practice**: the
first pass of this hybrid round left `stroke-linecap` at its default
(`butt`), and a butt-capped zero-length dash is genuinely invisible —
rendered at true 1x size, all three hybrids looked like they'd simply
lost their rim entirely (no dots, no line, just a soft muted fill with
no border), which would have been a false negative reported as "dots
don't render at small sizes" when the actual bug was the missing
linecap. Fixed before evaluating below. Worth remembering if this gets
ported into `badgeHtml()` for real: a round-dot rim needs an explicit
`stroke-linecap:round`, not just a short dash.

**Renders:** `hybrid-full-4x.png` / `hybrid-full-1x.png` (same
`chrome --headless=new --force-device-scale-factor={4,1}` method as the
first round, now via Playwright's bundled Chromium for exact per-element
crop coordinates). `crop-hybrid-4x.png` — restaurant, all three hybrids,
FAR/NEAR/HI, for judging dot shape/spacing. **`crop-hybrid-truesize-nearest10x.png`
— restaurant at true 1x device pixels, nearest-neighbor blown up 10x with
no smoothing, i.e. exactly the real pixel grid a real marker would
render, just magnified for viewing** — this is the crop that actually
answers the legibility question, not the 4x one.
`crop-hybrid-hues-truesize.png` — the same true-1x check across
nature/hotel/shopping (dark green, dark purple, low-contrast lavender)
to confirm the finding isn't restaurant's orange-specific.

### Legibility at true 1x size (the honest answer)

Reading `crop-hybrid-truesize-nearest10x.png` and
`crop-hybrid-hues-truesize.png` — the FAR (16px) and NEAR (24px) tiers,
which is where nearly all real-world zoom levels sit:

- **Hybrid 1 (8 dots)** reads as a clean, sparse ring of distinct dots at
  both FAR and NEAR, across all four hues. Not wavy. The only soft
  concern: at 8 dots the ring is sparse enough that at FAR it can read
  more like a few scattered flecks around the badge than a continuous
  "ring" motif — still legible as "not a solid rim," which is the actual
  bar, but the least "ring-like" of the three.
- **Hybrid 2 (12 dots)** is the sweet spot: still clearly individual
  round dots (not a line, not a blur) at every size and hue tested, but
  dense enough to read as a deliberate ring rather than scattered marks.
  This is the one that best satisfies the owner's brief — "dotted rim,
  but not wavy."
- **Hybrid 3 (16 dots)**, even with a lighter field pass, starts
  crowding back toward continuous at FAR — individual dots are still
  distinguishable under magnification, but at a glance it's closer to
  Treatment A's original problem than to Hybrid 1/2. The lighter-field
  trade didn't buy much: the field itself was less noticeable (closer to
  B's original too-subtle problem) while the rim was busier — worse on
  both axes it was meant to balance.
- The **receded field alone (B's contribution)** is genuinely more
  visible here than it was in standalone Treatment B, because it's now
  paired with the dot rim as a second, corroborating cue rather than
  standing alone — but on its own, at 1x, it's still a subtle shift, not
  a strong signal. The dotted rim is doing most of the "this is visited"
  work at a glance; the field is the supporting, closer-look confirmation
  (a reasonable division of labor, consistent with the list row's own
  two-channel approach: a peripheral field cue + a non-color point mark).
- At **HI (32px)**, all three hybrids render `highlighted:true` (this
  mockup's HI tier is always the highlighted/focused pin state, matching
  the original A–D rows), which overrides to a solid ink fill per the
  app's existing "highlighted wins" pattern — so the dotted rim doesn't
  apply there by design, not by omission. A real *solo, non-highlighted*
  32px badge isn't rendered separately here since the app has no such
  state (32px only occurs via the highlighted `+8` bump); this matches
  how the original four treatments were scoped too.

### Recommendation

**Hybrid 2 (12-dot rim + B's field/ink shift) is the one to carry
forward.** It's the only variant that reads as an intentional, legible
"dotted ring" at true FAR/NEAR pixel sizes across all four tested hues,
without tipping into the "wavy"/noisy read the owner rejected in
Treatment A, and it adds the field recede as a second corroborating cue
rather than relying on the dots alone. Hybrid 1 (8 dots) is the fallback
if the owner wants an even quieter mark and doesn't mind it reading as
sparser/scattered. Hybrid 3 (16 dots) is not recommended — it re-opens
the density problem the owner asked to fix, and its lighter field is a
net loss on both dimensions the hybrid is meant to balance.

Still open, same as the base round: whether visited should show at every
zoom (recommend yes, unchanged) and the cluster aggregate rule
(all-visited-only recede, unchanged) — this round only re-tested the
solo-badge rim/field question the owner specifically flagged.

Not a build decision — concept-stage only, `index.html` untouched. Next
step if the owner approves Hybrid 2: UX concept-level blocker check, then
a CD round, per the normal loop.

## Stamp-tightened round (owner direction, 2026-09-29)

The owner liked the dotted-rim direction and asked to keep iterating on
the *dot treatment specifically* (not the shipped `.row-stamp`, which
stays as-is) so it reads as more of a piece with the app's actual
passport-stamp grammar per `design/inspo/project/`. Instructed to run the
rest of the loop (UX blocker check, CD round(s) to ≥9) without stopping
to check in after each round. All work below is still concept-stage —
`index.html` untouched — in `stampring-mockup.html`, a copy of the same
`badgeHtml()`/`markerStarHtml()` port used above.

**What "tighter to the stamp" means, concretely.** Re-read `.row-stamp`
in `index.html` (~1120–1225) before touching anything, and two things
about the real component didn't carry into Hybrid 2:

1. **`.is-visited` never touches ink.** The shipped list-row recipe is
   "field recedes (`--paper` → `--paper-filed`), every ink stays at full
   strength" — documented in CLAUDE.md's own history as deliberate ("Every
   ink is unchanged, so rows never read disabled"). Hybrid 2 muted the
   category ink and dropped glyph opacity, which isn't what the real
   component does and reintroduces the exact "reads as disabled/washed
   out" risk the row was built to avoid.
2. **The mark is navy, not a muted version of whatever's under it.** The
   stamp's ink is a fixed `--navy` at 82%, independent of context — an
   "official stamp" color, not a recolored version of the row's own
   ink. Hybrid 2's dots were `muted(categoryColor)` — a desaturated
   version of *that pin's own hue*, so a stamp on a lavender shopping pin
   looked different from a stamp on an orange restaurant pin. The real
   stamp doesn't vary by what it's stamped on.
3. **The stamp is structurally two concentric parts**, not one dashed
   line standing in for a solid one: a perforated dot *track* and a solid
   *ring*, at different radii (`--stamp-track`'s mask covers the whole
   72×32 box; `.row-stamp-ring`'s solid border sits inset inside it,
   `var(--s1)` + border in from the track's own edge). Hybrid 2 replaced
   the badge's one existing rim with dashes — same single-ring shape,
   losing the two-part relationship entirely.

### Round 3 — dots moved inside the rim (concept score: does not reach 9, real execution defect)

First attempt: keep the solid category rim exactly as an unvisited badge
(full ink, no muting — fixes point 1 above), add a *separate* navy dotted
ring (point 2 and 3) inset just inside it, mirroring ring+track as two
concentric elements.

**UX concept-blocker check caught a real problem before this went
further, not just a polish nit.** `stampring-truesize-restauranthotel.png`
(rows 2–3, the 9-dot and 7-dot inner variants) and
`stampring-truesize-shopping.png` (row 1, cols 6/8 and row 2, cols 2/4)
show the inner dots landing **on top of the category glyph itself** —
`badgeHtml()`'s existing glyph-floor formula already sizes the glyph to
fill nearly the entire field inside the rim (by design — 3 rounds of CD
review already went into that budget for the marker-size work), so
there's no free radius left inside the rim for a second ring without
either shrinking the glyph (touches the shared formula, affects every
badge, not just visited ones — out of scope) or overlapping it. At FAR
16px this reads as noise on the glyph, not a ring; the shopping crop
confirms it's not restaurant-specific. Concept-blocker, not an execution
flaw: the idea only works if it doesn't visibly break the glyph, and it
does. **Scored ~6/10** — genuinely closer to the stamp's real structure
in principle, but fails "communicates visited clearly at marker scale"
in practice. Not worth a second inner-dot-count iteration; the fix is
geometric, not a dial.

### Round 4 — dots moved outside the rim (concept score: 9/10)

Fix: put the navy dots on the **outside** of the solid rim instead of
the inside (`markerStampRingOuter()` in `stampring-mockup.html`,
`stampring-full-4x.png` / `stampring-full-1x.png`). This isn't just
dodging the collision — it's actually the more faithful mapping of the
real component's own order once you look at it precisely: the real
track is the *larger* of the two concentric parts (it's the outer 72×32
box; the solid ring is inset inside it). So "solid ring smaller, dotted
mark larger and outside it" is the same relationship, not just a
different one that happens to avoid the bug. Adds ~3px to the badge's
visible radius on visited pins only; the rim and the entire glyph field
are byte-for-byte untouched.

Rendered at true 1x device pixels (`stampring-truesize-restauranthotel.png`,
`stampring-truesize-shopping.png`, `stampring-starred-truesize.png`),
FAR 16px and NEAR 24px, across restaurant/nature/hotel/shopping
(shopping specifically because the original round flagged its lavender
as the low-contrast case to watch):

- **Reads clearly as a distinct navy ring at both FAR and NEAR, every hue
  tested**, including shopping's lavender and hotel's near-black plum —
  because the dots sit *outside* the rim, against the paper/paper-filed
  field, their contrast no longer depends on what category color they're
  next to. This is a real, measurable improvement over Hybrid 2 and
  Treatment A, where the mark's legibility varied by hue because it
  shared the rim's own space.
- **Category rim and glyph are completely undisturbed** — same ink,
  same opacity, same shape as an unvisited pin. No "is this washed out or
  still loading" risk (Treatment D's flagged risk), because nothing about
  the pin's own identity changed; only a mark was added.
- **Visited + starred combo** (`stampring-starred-truesize.png`): the
  star still sits at its existing 45° shoulder position on the rim
  itself; the outer dot ring simply continues past/around it. One or two
  dots in that exact 45° arc sit under the star's own paper halo, the
  same way the star already partially covers the rim there for an
  *unvisited* pin — not a new collision, an existing, already-accepted
  one extended to one more layer. Reads fine in the crop, no crowding.
- **Round 4b** (`navyOpacity: 0.7`, 8 dots) tests a softer version — still
  legible but a noticeably quieter signal; kept as the dial, not the
  recommendation, since full-strength navy is what actually reads at a
  glance in the true-1x crops.

**UX concept-blocker check (Round 4):**
- Tap-to-open-popup: unaffected — the dots/ring are decorative SVG
  layered inside the same marker icon Leaflet already treats as one
  click target, same as the existing star overlay. No new listener, no
  new hit-testing.
- Cluster-star precedent: untouched by this round on purpose — scope was
  the solo-badge dot/field question the owner flagged; the cluster
  aggregate rule (recede the whole cluster only once every member is
  visited) from the base round stands as-is and wasn't re-tested against
  this specific ring-outside geometry. Flagging as open, not assuming it
  carries over cleanly — a cluster's fill already uses `--figure-deep`
  muted toward the "cleared" color, and a navy outer ring on TOP of a
  22px cluster disc that's already changing color on the aggregate rule
  needs its own render before it's approved, not assumed from the solo
  case.
- Accessibility basics: decorative (`aria-hidden`), non-color mark
  (shape + a second field cue), same "don't rely on color alone" pattern
  the list row itself satisfies (WCAG 1.4.1). No text alternative is
  newly needed here since the map layer already isn't the accessible
  surface for this app (the list is); unchanged from every earlier round
  in this doc.
- Legibility against real tile colors: **still can't test this — same
  sandbox limitation as every earlier round.** Flagging honestly rather
  than asserting it reads fine against a busy real OSM tile; this is the
  first thing to check once it's in a real browser.
- New item this round: the ~3px footprint growth on visited pins only
  is a real, measurable geometry change (not present in Hybrid 2, which
  stayed within the existing shell). It doesn't break any interaction
  (hit-testing is already handled by `badgeHtml()`'s separate padded hit
  area, not the visible glyph bounds), but it's worth a real-device check
  for whether it visibly crowds an *adjacent*, non-clustered pin at NEAR
  tier in a dense area — not a concept blocker, but flagged for the
  perfection stage rather than asserted fine.

**CD score: 9/10.** On-brief: this is the most faithful of every
treatment tried so far, not because reuse was a goal in itself but
because — unlike Hybrid 2's muted-rim recipe, which was an invented
approximation — this one actually uses the real `.row-stamp` ink (navy,
not a muted category hue) and the real two-part concentric relationship
(inset ring, larger mark around it), and it's the only one of the two
"tightened" attempts that survives contact with the marker's actual
glyph budget. Communicates "visited" clearly at marker scale: confirmed
at true 1x pixels across four hues including the one flagged as risky.
Distinct from the star (black ink, corner shoulder) and the cluster
badge (`--figure-deep`, filled disc, no ring): yes, by both color and
shape. Not a 10 only because of the deferred items above (real-tile
legibility, cluster-badge application, the exact dot-count/opacity dial)
— genuine perfection-stage/follow-up questions, not concept flaws, per
the loop's own rule that execution polish doesn't cost points at this
stage.

### Recommendation

**Round 4 (outer navy dotted ring + untouched solid category rim)
supersedes Hybrid 2 as the recommended direction**, pending the owner's
sign-off. Concept-stage only — nothing in `index.html` changed. Before
any real build: (1) the owner looks at `stampring-truesize-*.png` and
`stampring-full-1x.png` and either approves this direction or redirects;
(2) if approved, the deferred items above (cluster-badge application,
real-tile check, dot-count/opacity dial) get resolved in the perfection
stage, not decided here.
