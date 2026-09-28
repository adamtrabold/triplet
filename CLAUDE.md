# Triplet

Personal single-file trip-planning app (Iceland/Scandinavia, Sept 2026).
Vanilla JS/HTML/CSS in `index.html`, Leaflet + Supabase, deployed via GitHub
Pages on push to `main`. **No build step — this is permanent, not a
temporary simplification.**

## UX principles (learned the hard way — don't repeat these)

- **A list shows everything that matches the active filters, full stop.**
  Never gate list membership on map viewport/zoom/pan. Zoom is a rendering
  concern for the *map layer only* — see `visibleNeighborhoodShapes()`
  (filters only) vs `mapVisibleNeighborhoodShapes()` (adds the zoom gate,
  feeds only `syncNeighborhoodLayers()`). If you add a new listable thing,
  give it the same split.
- **Clicking any list item navigates the map to it** — pan and zoom in
  enough to actually see the thing, regardless of current zoom. Pins do
  this via `focusMap()`/`highlightMarker()`; shapes via `focusShape()`
  (`map.flyToBounds()` on the shape's geometry). A new list item type needs
  the same click-to-navigate behavior, not just a static row.
- Category filter chips (`CATEGORY_COLORS`) are independent of the
  add-form's category dropdown — adding a category to one doesn't require
  touching the other, and the reverse is also true.

## Team process (owner-set, 2026-09-28)

Design work runs through a designer → UX → creative director (CD) loop,
coordinated by an operator who doesn't do design work. **New ideas go
through two stages, not one**, because driving every concept to a 9
before the owner has seen it burned heavy tokens on directions the owner
then rejected (e.g. the popup-only star went to 9/10 and was rejected as
"very average"):

The CD's bar is **9/10 in both stages** — what changes is what's being
scored.

1. **Concept stage — scored on QUALITY OF CONCEPT.** The designer
   explores a few distinct directions and prototypes the pick only to
   the fidelity needed to judge the idea. UX checks for concept-level
   blockers (does the idea break tap-to-navigate, scroll, delete
   safety, a11y basics) — not polish. The CD scores 1–10 on the
   concept itself: on-brief, intentional, the right idea for this
   app/brand, better than the alternatives. Rounds continue until the
   CD gives the *concept* ≥9. Execution flaws (pixel alignment, exact
   timing, contrast tuning, edge cases) are noted but do NOT cost
   points here and are NOT fixed yet — no exhaustive measurement, no
   polish passes. Then show the owner the concept (stills/filmstrip +
   the one-line why, and the rejected alternatives in a line each) and
   ask for approval or redirection.
2. **Perfection stage — only after the owner approves the concept —
   scored on PRODUCTION READINESS / EXECUTIONAL PERFECTION.** The full
   loop: designer → UX → CD rounds until the CD scores the execution
   ≥9, measured at 3x, ~4x crops and 1x, with real-timing checks for
   motion; then `npx -y impeccable@4.1.0 detect index.html` must show
   exactly the 3 baseline findings; then integrate, verify, and hand
   back with iPhone checks. The concept itself isn't relitigated here
   unless execution proves it unworkable (then back to the owner).

Small, well-specified follow-ups (a bug the owner reported, a tweak to
an approved design) skip stage 1 and go straight to stage 2. Pick the
cheapest model/agent setup that does each stage well; don't spin up
fresh agents when a warm one has the context.

## Architecture

- `locations` table: pins (point features) — `city`, `category`, `lat/lng`.
- `neighborhood_shapes` table: districts/streets (area/line features) —
  `city`, `type` (`district`|`street`), `geometry` (array of `[lat,lng]`
  pairs, this app's convention, not GeoJSON). Fetched live from OSM
  (Nominatim polygon / Overpass way) at add time, not hand-authored.
- A shape's `city` is never trusted from the pre-fetch form selection — it's
  resolved from the fetched geometry itself by `resolveShapeCity()`
  (`index.html`), which classifies every point against `CITIES` and
  majority-votes a winner. For streets (which arrive as multiple merged OSM
  way segments), a whole segment that disagrees with the winner gets
  dropped rather than diluting the vote — this is what catches a spurious
  OSM merge (a same-named way in a different city) automatically instead of
  requiring a human to eyeball a preview map. When no existing city gets a
  confident majority (`SHAPE_CITY_CONFIDENT_SHARE`, currently 60%),
  `handleAddShapeSubmit()` shows the `shapeCityConfirm` dialog: create a new
  city (reusing the pin flow's `deriveNewCityConfig()`/`addCity()`, via a
  fresh `nominatimReverse()` lookup on the shape's centroid since a shape
  fetch has no `addressDetails` of its own) or assign to the runner-up
  existing city anyway. The bulk/offline tool
  (`tools/neighborhood-shapes.html`) has its own port of the same
  classification logic (no build step ⇒ duplicated, not shared) but no
  Supabase write path, so it surfaces disagreement as a warning on the
  shape's review card instead of a dialog — the human still accepts/rejects
  via the existing checkbox.
- When OSM has no polygon/way at all for a district/street, `handleAddShapeSubmit()`
  falls back through `findApproximatePoint()`: a plain Nominatim point search,
  then an Overpass node search scoped to the city bbox. If either finds a
  point, it's saved as a `locations` row (not `neighborhood_shapes`) — category
  set to the shape's `type` (`district`/`street` are already valid pin
  categories, sharing `CATEGORY_COLORS` with real point categories, so no
  filter-chip changes were needed), label suffixed `" (approx.)"`, notes
  recording which tier resolved it. City resolution reuses
  `resolveShapeCity([[point.lat, point.lng]], null)` — a single-point
  geometry degenerates correctly through the same majority-vote/confidence
  logic used for real shapes, `shapeCityConfirm` included. Only a true
  double-miss (no boundary/way AND no point AND no node) still fails with an
  alert. No automatic re-upgrade if OSM later gains a real boundary for one
  of these — that'd be a separate re-check, not implemented.
- `cities` table: runtime-extensible city registry, merged into the static
  `CITIES` bootstrap object in `index.html` (never replacing it — that
  object is the offline-safe seed before any fetch resolves).
- The add-location form routes on category alone: `isShapeCategory(category)`
  (true for `district`/`street`) decides both which fields show and which
  table the submit goes to. No separate "this is a shape" toggle.
- RLS pattern, identical across all three tables: public `SELECT`;
  `INSERT`/`UPDATE`/`DELETE` restricted to
  `auth.jwt() ->> 'email' IN ('adamtrabold@gmail.com', 'ericatrabold@gmail.com')`.

## Environment constraints

- The sandbox's own HTTPS egress is policy-blocked for Supabase, Nominatim,
  and Overpass alike (confirmed: a direct `curl` to either gets a 403 from
  the proxy gateway, not a DNS/routing failure) — but as of 2026-09-19, a
  **Supabase MCP connector** is connected for this project (Trip Map,
  `jgvckilmltimabfdvaly`), which reaches Supabase through Anthropic's
  connector infra instead of the sandbox's own egress. Use its
  `apply_migration`/`execute_sql`/`list_tables` etc. tools directly instead
  of handing SQL to the user to paste into the SQL editor. No equivalent
  connector exists for Nominatim/Overpass (checked the registry — nothing
  fits; the closest, TomTom Maps, is a different provider and not worth
  swapping to) or for a browser, so anything depending on a live
  Nominatim/Overpass call (`tools/*.html`, and smoke-testing any add-form
  change that fetches OSM data) still has to run in the user's own browser.
- The user often works from a phone — don't hand them a file they can't
  open. Prefer pasting copy-pasteable text directly in chat, or an Artifact
  with a copy button, over `SendUserFile` for anything they need to paste
  elsewhere (like SQL for the Supabase editor).

## Open items (as of 2026-09-23)

Update this list as items get resolved or new ones surface — don't let it
go stale, and don't leave it silently out of date either.

**Shipped (2026-09-21):**
- Marker size/density fix — merged to `main` (`05afef5`). Two-tier sizing
  (`MARKER_SIZE_NEAR`=24/`MARKER_SIZE_FAR`=16, scale-aligned to `--s6`/
  `--s4`, sharing `GLYPH_MIN_ZOOM`'s crossing-guard; highlighted = tier +
  `MARKER_HI_DELTA`=8), a size-aware glyph-floor formula in `badgeHtml()`,
  a shared `applyMarkerStacking()` z-index helper, a padded invisible
  hit-area for far-tier badges (WCAG 2.5.8), and a scoped grid-snap
  clustering (`mapVisibleLocations()`) for pins that are genuinely
  pixel-coincident below `GLYPH_MIN_ZOOM` — click-to-navigate only, never
  expand-in-place, so it can't conflict with the sidebar list's
  click-to-navigate contract. Went through 3 rounds of CD review (final
  score 9/10) before shipping. Not yet visually smoke-tested in a real
  browser (this environment can't reach Supabase/tiles) — worth a check on
  a real trip city, especially the zoom-12 crossing transition and the
  cluster badges in Reykjavik/Stockholm's old-town cores.
- Cluster banding follow-up — merged to `main` (`77b674e`, then retuned at
  `4d4a28e`). The clustering above was a single on/off switch at
  `GLYPH_MIN_ZOOM`, which the owner felt "blasted" from all-clustered to
  all-solo in one zoom tick (three of five cities default to zoom 11,
  right at that boundary). Replaced the flat `CLUSTER_CELL_PX` with
  `clusterCellPxForZoom()`, currently **64px at zoom ≤9, 48px at zoom 10,
  32px at zoom 11** — still no clustering at/above `GLYPH_MIN_ZOOM`=12.
  (First pass shipped 48/32/24, leaving zoom 11 unchanged from before
  clustering existed; a real screenshot of downtown Reykjavik's *default*
  view — zoom 11, not some rarely-seen far-out state — showed that was
  still a dense overlapping cascade, so every band got bumped up a step.
  64 is a new top tier above the app's own `--s12`=48 spacing token,
  still a 4px multiple, past that scale's own ceiling.) Cluster badges
  render at a fixed `CLUSTER_BADGE_PX`=24 regardless of which band bucketed
  them, so they don't balloon at the coarsest band. UX-agent-only pass
  (owner explicitly skipped the CD loop both rounds), scope deliberately
  limited to clustering only — marker size/glyph tiers untouched. A
  fade-in-only animation on newly-added markers was proposed but not
  built; only worth it if the banding alone doesn't feel smooth enough
  after a real-browser check. Grid-snap bucketing has a known limitation
  worth knowing about if the owner reports a *chain* of pins along a
  street still not fully merging: it's an independent per-point rounding,
  not nearest-neighbor merging, so points near a cell boundary can land in
  different cells despite looking close together on screen — not yet hit
  in practice, but the next thing to look at if bumping the band size
  again doesn't fix a reported case.
- Clustering extended past `GLYPH_MIN_ZOOM` — merged to `main` (`79c037c`).
  Real screenshots showed glyphs already visible (so real zoom was 12+,
  not 11) with dense overlap still there — clustering had been hard-capped
  at `GLYPH_MIN_ZOOM`=12 specifically because that's also where
  `highlightMarker()`'s `focusMap({ atLeast: 14 })` was known to always
  land past, the property that keeps a list-item click from ever landing
  on a still-clustered pin. Rather than raise `GLYPH_MIN_ZOOM` itself
  (which would also delay glyphs turning on, unrelated), clustering now
  has its own cutoff, **`SOLO_MIN_ZOOM` = 14**, pinned exactly to that
  `focusMap()` call — both the list-click and cluster-badge-click paths
  reference the constant directly instead of a duplicated `14` literal, so
  the safety property can't silently drift out of sync if either changes
  later. `clusterCellPxForZoom()` gained two more bands: 24px at zoom 12,
  16px at zoom 13. `GLYPH_MIN_ZOOM` itself and everything tied to it
  (glyph visibility, NEAR/FAR marker size) is untouched — a solo NEAR-tier
  marker still renders exactly as before; only which pins get absorbed
  into a cluster badge changed. Not yet re-confirmed against a fresh
  screenshot at the app's actual real-world zoom.
- Visited-checkbox CSS fix + orphan-city cleanup — merged to `main`
  (`1d6602e`). See git history for detail; this was written up earlier in
  this same session before the marker-size work started.
- "Get Directions" button — merged to `main` (`02ebca8`). Design + UX +
  CD loop (final score 9/10). Plain static `directionsUrl(loc)` link to
  `https://maps.apple.com/?daddr=lat,lng&dirflg=d` — no JS platform
  detection, opens the native app on iOS and degrades to a normal webpage
  everywhere else. Ships in BOTH the location card's action cluster
  (`.directions-btn`, reuses the `#g-compass` glyph, icon-only) and the
  map popup (`.popup-directions`, visible "Get Directions" text) — design
  initially proposed card-only and deferring the popup as a separate
  follow-up, but the CD caught that assumption was wrong: `buildPopupHtml()`
  has no click listener to guard against at all (unlike the card, which
  needs the same `.directions-btn` exclusion its `.visit-btn`/`.delete-btn`
  already have in `createCard()`'s click handler), so the popup version is
  actually cheaper than the card version, not more expensive — shipping
  both cost nothing extra. No `confirm()` dialog, no visited-state
  coupling, pins only (shapes excluded — no single natural destination
  point). The CD also caught two things neither agent's plan mentioned: the
  `.location-card.highlighted` color-override selector needed
  `.directions-btn` added or it'd render illegibly on the dark highlighted
  background, and two "two-button cluster" doc comments needed updating
  for the new third button — both folded in before shipping. Not yet
  tapped in a real browser (same sandbox constraint as everything else
  needing live Supabase/tiles) — worth confirming the Apple Maps link
  actually opens correctly and the popup's new row doesn't crowd existing
  content. **Superseded in part by the next entry**: `.directions-btn` was
  later removed from the list card (see below) — Get Directions now lives
  in the popup only, not both places.
- List row made delete-only; visited-toggle + directions moved to the
  popup — merged to `main` (`9858161`). The owner found the three-button
  list row (`visit-btn`, `directions-btn`, `delete-btn`) risked mis-tapping
  delete. A design/UX/CD loop found removing visited-toggle from the list
  entirely would be a real regression (it's likely the app's most-tapped
  action) and that making the popup's visited status clickable required
  building the app's *first-ever* popup-scoped click handler (Leaflet
  popups are plain HTML strings re-inserted via `setPopupContent()`, no
  built-in event wiring) — the owner was shown this tradeoff and chose it
  anyway: list is now delete-only, and a real popup toggle got built.
  - `buildPopupHtml()` reordered: category-with-glyph now sits above the
    title (was below), so title+notes/address chunk together; requested
    directly by the owner after seeing the shipped layout.
  - New `.popup-visited` button (was a read-only `✓ Visited` div) toggles
    via a single delegated click listener on Leaflet's own `popupPane`
    (`map.getPane('popupPane').addEventListener('click', ...)`), bound
    once at map init — reused for every popup open/replace, so it can't
    double-bind. Reads the target location off a `data-id` attribute, not
    Leaflet's popup internals. A first UX pass shipped this as plain text
    with a color swap; a second review caught that it looked pixel-identical
    to the old *read-only* status text (no signal it was now tappable) and
    had an ~12px touch target — fixed with a small bordered-circle checkbox
    affordance (hollow/filled, reusing `.visit-btn`'s old shape grammar)
    and bigger padding.
  - A UX review after the list went delete-only caught a real regression
    nobody had scoped: the list lost ALL visited signal, not just the
    tappable toggle — no way to scan the list for what's left without
    opening every popup. Fixed with `.row-visited-dot`, a small
    non-interactive hollow/filled circle rendered unconditionally (hollow
    = unvisited, since "what's left" scanning needs the negative state
    visible too). Placed as its own fixed grid column on `.location-card`
    (already `display:grid`) rather than trailing the variable-length
    category/city text — a CD review caught that trailing placement would
    shift the dot's x-position row to row and defeat the "glance down the
    list" goal entirely. `.location-actions` got an explicit
    `grid-column: -1` so shape-card rows (which have no dot) keep their
    delete button aligned with pin rows instead of auto-placing one column
    earlier. **Superseded by the next entry** — the unconditional/hollow
    version below didn't survive contact with a real device.
  - Two follow-ups explicitly deferred, not forgotten: a "12/38 visited"
    header count (`updateUI()`'s `${activeCityLabel()} list (...)` text) —
    low-risk but judged to deserve its own review rather than riding along;
    and map markers still don't reflect visited status anywhere on the map
    itself (only the list/popup do) — a real, related gap, but a bigger,
    separate design problem (touches `markerIcon()`/`badgeHtml()`, shared
    with cluster badges, and the marker-size work already went through 3
    rounds of CD review to get that system right). Both still open.
- Popup buttons side-by-side; list dot reverted to visited-only — merged
  to `main` (`62880ce`). Two changes the owner asked for after seeing the
  prior entry live on their phone.
  - **Popup**: `.popup-visited`/`.popup-directions` were stacked full-width
    lines; now share one row (`.popup-actions`, `space-between` — visited
    left, directions right). Popup's inline `min-width` bumped 200→240px
    so neither label wraps (Leaflet's own 300px popup cap is what actually
    prevents overflow; the `min-width` is only a floor — noted so a future
    reader isn't misled about the mechanism).
  - **List**: `.row-visited-dot` no longer renders unconditionally. UX
    review confirmed the owner's instinct was right, not just a
    preference call: a hollow dot on nearly every row (most places are
    unvisited early in a trip) reads as clutter, not signal — the eye
    scans for *presence* of a mark far more easily than *absence* of one.
    Now: nothing renders on unvisited rows; visited rows get a filled dot
    + the word "Visited", leading `.row-meta`'s text (before category/
    city) rather than trailing it, since `text-overflow:ellipsis` clips
    from the end and "Visited" must never be the part that gets clipped
    on a long name. A CD review caught two bugs in the first draft before
    it shipped: the dot would've silently rendered as an invisible sliver
    once moved from a grid child into inline text (non-replaced inline
    elements ignore `width`/`height` — needed explicit `display:
    inline-block`/`inline-flex`), and the new visible "Visited" text
    needed `aria-hidden="true"` on its wrapper so it isn't announced
    twice alongside the existing (unconditional, both-branches-kept)
    `.sr-only` text, which stays the one source screen readers get this
    from. Since the dot is no longer its own grid column, `.location-card`
    reverted to its original 3-column grid and `.location-actions` dropped
    the now-unneeded `grid-column: -1` hack.
  - Real-device check confirmed the popup buttons and "Visited" placement
    both read fine — the owner's only follow-up from looking at this live
    was the category-icon spacing, fixed in the next entry.
- Popup category icon/text gap tightened — merged to `main` (`bcb72ca`).
  Owner reported the category glyph and its label (e.g. a shopping-bag
  icon next to "SHOPPING") looked too far apart on a real phone.
  `.popup-cat`'s `gap` was `var(--s2)` (8px) — the same value the sidebar
  filter chips use for an identical glyph+label pairing, so the gap
  itself wasn't an outlier value. The actual cause: `glyphHtml()`'s SVG
  symbols carry real internal whitespace (e.g. `#g-shopping`'s path only
  spans ~67% of its `viewBox`), which scales up with render size — at the
  chips' 12px it's ~1-2px, invisible; at the popup's 20px it's ~3-4px,
  stacking with the flat 8px gap to look like much more separation than
  the identical gap produces at chip size. Fix scoped to `.popup-cat`
  alone: `gap: var(--s1)` (4px) — chips, `glyphHtml()`, and every other
  icon+text pairing in the file are untouched. CD confirmed a flat
  hardcoded value (not a size-proportional formula) was the right call
  given there's only one 20px call site and no way to visually iterate
  in this sandbox — lowest-risk, most reversible option.
- Visited "passport stamp" in the list row — merged to `main`
  (`24bb7db`, 2026-09-23), replacing the
  inline `.row-visited` dot + "Visited" text in `.row-meta`. `.row-stamp`
  (84-dot SVG-mask track, see round 3 below) wrapping `.row-stamp-ring` (2px solid ring +
  "VISITED" in `.row-meta`'s type voice), 72×32, placed at the head of
  `.location-actions` with `margin-right: var(--s2)` before delete.
  Design/UX/CD loop, 3 rounds (7/10 → 9/10 → owner-caught defects →
  9/10), then Impeccable (baseline 3 only). Decisions worth knowing before touching it:
  - **CSS borders, never SVG strokes** for the oval — SVG-stroked
    ellipses read as variable-width at this size; the full history is in
    `design/visited-badge/NOTES.md`. Inspo lives in `design/inspo/`.
  - Ink is navy at 82% via `color-mix()` (solid `--navy` fallback line
    first) so the place name wins the first read; the highlighted row is
    100% `--paper` because 90% fails AA on Stockholm's `--figure-deep`.
    `mix-blend-mode: multiply` was tried and dropped (visually inert,
    risked softening rotated 10px text on iOS).
  - **Round 3 (owner caught 3 geometry defects on-device that the CD's
    9/10 missed):** the dotted track and ring weren't parallel (two
    `border-radius:50%` ovals of different aspect ratios aren't parallel
    curves — gap swung ~1.6px), the dotted border had a start/end seam
    (dot collision at top-centre), and "VISITED" sat off-centre. Fixed and
    *pixel-measured*, not eyeballed: the track is now a static SVG **mask**
    (`--stamp-track` data URI on `.row-stamp::before`, no JS) of 84 round
    zero-length-dash dots on a path tuned to the ring's parallel curve
    (gap spread ≤0.27px, no seam); the text uses `text-box: trim-both cap
    alphabetic` (needs iOS 18.2+; without it the caps sit ~0.4px high,
    never low). The solid ring is still a CSS border — the "no SVG strokes
    for the ring" rule stands; round-cap dots have no stroke width to vary.
    The owner asked the team to justify this against pure CSS: every CSS
    option measured kept a seam (the browser places dotted-border dots
    itself, and WebKit does so differently), and a JS-generated mask was
    only ~0.1px better than the static one, so simplest won.
    **`pathLength='166.29'` is load-bearing**: it deliberately equals the
    path's measured length, with dasharrays in real units, so an engine
    that ignores `pathLength` still gets near-correct dots rather than a
    solid second ring. Path, `pathLength` and both dasharrays change
    together (re-measure with `getTotalLength()`), and the path assumes
    `.row-stamp` 72×32 / ring inset `--s1` + 2px border. JS fallback, radius
    search and swap steps: `design/visited-badge/README.md`.
  - 1x fallback: the same path with dashes (`--stamp-track-1x`, via
    `max-resolution: 1dppx` + `-webkit-max-device-pixel-ratio: 1` twin) —
    dots rasterize to haze at 1x.
  - Per-place tilt via `stampTilt(loc.id)`, deterministic (never
    `Math.random`). Originally −1.5°…−3.5° one-way; the owner couldn't see
    any variation, so it's now six separated buckets `STAMP_TILTS =
    [−5, −3.5, −2, 2, 3.5, 5]` — both directions (positive = left side
    higher), nothing under 2° (reads as unstamped), distinct leans ≥1.5°
    apart. Measured: ±5° is as crisp at 1x as the old −3.5°; the rotated
    box stays ≥10.7px clear of the delete X and ≥8.4px inside the row.
    About 1 in 6 neighbouring rows repeat an angle (unavoidable while the
    angle depends only on the place). The 9 visited Reykjavík places split
    4 left-high / 5 right-high. Gentler alternative (±1.5/±2.75/±4) was
    rejected: ±1.5 is too slight to see. Fixed −3° is a two-line revert
    (drop the helper and the inline `--stamp-tilt`).
  - Also fixed a bug the stamp would have introduced: `createCard()`'s
    `addActive` excluded the whole `.location-actions` cluster, so a tap
    on the (pointer-events:none) stamp right after a scroll never reset
    `touchMoved` and was silently dropped. It now excludes only `.delete-btn`.
  - Cost accepted by the CD: visited rows truncate ~12 chars earlier
    (~21–25 chars fit at 375–390px; 17% of current names exceed that).
  - All pixel numbers are Chromium-only; Safari's mask/`pathLength`
    rendering, `text-box`, `color-mix()` and tap targeting are unverified
    on a real iPhone.

- Visited rows recede (scannability) — merged to `main`
  (`807c0d4`, 2026-09-23).
  The owner's actual problem was scanning the list for what's left; the
  stamp helped but wasn't enough at a glance. Visited rows get
  `.is-visited` (toggled in `renderCard()`, which re-runs whenever
  `cardSignature()` — which includes `visited` — changes) and sit on
  `--paper-filed: #E7DFD0`: `--paper` one value step down with hue and
  chroma held (LCh 89.1/8.3/89 vs 93.2/7.6/90), 1.12:1 against `--paper`.
  Every ink is unchanged, so rows never read disabled (name 13.17:1, meta
  5.53:1, stamp 6.92:1, divider 1.18:1 on the field). The field is the
  ROW-level cue (peripheral, mid-scroll), the stamp the POINT-level and
  non-colour one (WCAG 1.4.1) — keep both. Design/UX/CD loop, 2 rounds
  (8/10 → 9/10), then Impeccable (baseline 3 only).
  - Round 1's `#E5DFD4` was pitched as "cooler/navy-tinted" but measured
    the same hue, only greyer (chroma 7.6→6.1) — read as putty/dust,
    leaning into the "greyed-out" look the brief forbade. Aged paper gets
    warmer, not grey.
  - Darker, never lighter: a lighter field advances visited rows and
    collides with `--paper-raised` (the press state). Rule order matters:
    `.is-visited` sits above the press rule (press wins) and the
    `.highlighted` block (focus wins).
  - **Dial** (documented in the token comment): if too faint on device,
    `#E3DBCC` TOGETHER WITH a `#CBC0A9` visited-row divider — the field
    alone would drop `--hair` to 1.14:1 and runs would slab together.
  - Shipped with a separate prior commit fixing a pre-existing AA failure
    the designer found: `--paper-warm` `#F0D9C8` → `#F4E6DA` (highlighted
    row's category line was 4.19:1 on Stockholm; now 4.65–5.05:1).
  - Chromium-only numbers; whether a 1.12:1 step reads on the owner's OLED
    in daylight is unproven — that's what the dial is for.

- Pressed row goes darker, not lighter; stamp tilts both ways — merged
  to `main` (`a6f08f9`, 2026-09-23). Owner found the
  press flash too light once visited rows sat on `--paper-filed` (a
  visited row jumped 1.22:1 *lighter* to `--paper-raised`). Every row now
  presses to `--paper-pressed: #DCD3C3` — same hue, one equal step below
  the visited field (paper → filed → pressed at ~1.12:1 each), so a press
  can't read as "visited" and never flashes. AA while pressed: name 11.74,
  meta 4.93, stamp 6.37; `.highlighted` still wins. The old
  `.location-card.active .delete-btn` colour rule was removed: it matched
  only the persisted `.active` class (the X changed when the row was
  pressed, not when the X was), failed AA on the new colour, and made the
  X invisible on the focus row. `--paper-raised` no longer means "pressed
  row" (chips/fields only). Design/UX/CD round (9/10), Impeccable
  baseline only. Rejected: per-state press colours (a pressed unvisited
  row sat only 1.089:1 from the visited field) and a softer lighter press.
  iPhone fallbacks: the ~80ms press delay is now SHIPPED (with the Pencil Star): a touch press shows after 80ms of stillness, and a quicker tap shows a 100ms press on release, so neither a star stroke nor a flick-scroll starts with a dark blink; mouse presses stay immediate, and compat mouse events within 800ms of a touch are ignored (they were clearing the release press after 1ms). The bare `:active` rule is neutralised for touch so it can't paint the press early. If the visited press feels faint, `#D9D0BF` still passes AA.

- **List click always opens the popup** — merged to `main` (`798134f`, 2026-09-28). `openPopupOnArrival()` replaces the 300ms timers in `highlightMarker()`/`focusShape()`, which raced the 0.5s fly: a pin clustered at the start zoom had no solo marker yet, a shape below its min zoom had no layer, and nothing opened. The popup now opens on the `moveend` where the map has ARRIVED (zoom ≥ target, target within 2px of centre) — checked on every moveend, not assumed from the first — after re-running the idempotent syncs and re-looking up the marker/layer. No timer. Reduced motion: `setView()` fires moveend synchronously, same path. Already there: opens immediately. Last tap wins (one pending intent; a new tap cancels it and closes any open popup). **Any direct map input cancels a pending intent** — `pointerdown`/`wheel` capture listeners on the map container, plus `dragstart` — so a stale list-tap popup can't replace a pin the user just tapped, or fire later on an unrelated moveend. Arrival is checked at `SOLO_MIN_ZOOM` for pins, so the clustering safety property holds. `focusShape()` never lands below `neighborhoodMinZoom()`: a shape that would fit below it is framed AT its min zoom on purpose, even if part of its outline sits off-screen — before, it could never open at all. Popups appear after landing (~0.5s), not mid-fly; that timing is deliberate (cause and effect on a still frame). Playwright suite: 20 cases × both motion modes, 20/20.

- **Personal priority star — the "Pencil Star"** — first merged to `main` (`798134f`, 2026-09-28); rounds 4–6 merged to `main` (`d298e5b`, 2026-09-28), after the `starred` migration (`locations.starred boolean not null default false`; RLS unchanged). **Display (unchanged from the first star round):** Baedeker printed a star *before* a sight's name for "particularly worth seeing" — one bit (a `**` tier is the `smallint` upgrade path). List: 12px `--figure-deep` star leading the `h3` (never ellipsis-clipped, fixed x = a scannable column), non-interactive, single `.sr-only` source ", starred". Map: `--ink` star on a `--paper` halo (on the map `--figure-deep` already means "cluster"); a cluster wears the star if any member is starred; stacking ladder highlighted 1000 > starred cluster 700 > cluster 600 > starred pin 500 > pin 0. Popup: hollow/filled star leading the title (44×44 target, 8px dead band to Mark Visited, `z-index:201` load-bearing). Add form: "STAR" toggle, hidden for district/street. **Interaction history:** the first round made the popup (and add form) the only way to star, and ruled any list-row interaction out. **The owner rejected that as "very average"**: starring must be fast *from the row itself*, with as few interactions as possible, and "better than what every other app does, not a copy". A batch "Star…" mode was dropped as unnecessary once a per-row action is fast. Swipe was reconsidered once the Safari back-swipe was measured rather than assumed (WebKit's `ViewGestureControllerIOS.mm`: a screen-EDGE pan recogniser, left = back, right = forward; still edge-only in Safari on iOS 26). **The Pencil Star won** (design/UX/CD, 3 rounds, 6 → 8 → 9/10) against a Mail-style tag reveal (2 interactions, chrome, on the delete side), a long-press stamp (≥450ms, and it spends the *visited* stamp metaphor), a double-tap punch (+250–300ms on every navigation tap, or mis-stars on impatient re-taps) and a dog-ear (next to delete). It completes the app's three-way grammar: **printed = the guide's facts, stamped = where you've been, pencilled = what you care about.** **Gesture:** stroke a row RIGHT: the name + meta slide as one block (transform, 1:1), and in the printed star's own box a star is pencilled in five straight strokes, the way a hand draws one, leaning −7°. At 56px of content travel the ink lands (the approved `--figure-deep` printed star, 100% on its first frame, pressed in 1.2→1 over 160ms, one 17ms spread frame); release and the name docks against it. The SAME stroke on a starred row rubs it out: colour first (ink → `--ink-2` over 0–10px, no grain on orange — it read as glitter), grain only once 100% graphite (10–16), erosion from the points inwards with a widening smudge (16–50), a 25% ghost of the star held from 44 to the commit, and the ghost vanishes + three specks of eraser dust fall on the 56px frame exactly (honest: letting go before 56 never looks done). Left is inert (6px of give); shape rows give 6px and never star. **Numbers (`STAR_SWIPE`):** EDGE 24 (no arming within 24px of either screen edge; never `preventDefault` on touchstart, so Safari's back-swipe stays intact), LOCK 10px horizontal at >1.5× vertical (flatter than ~34°), SCROLL 8 (8px of vertical travel before the lock hands the touch to the scroller for good — 34–45° drags scroll exactly as on `main`), COMMIT 56 (66px of finger), MAX 104 with ×0.35 rubber-band, FLICK ≥32px at ≥0.5px/ms **stars only** (unstar must pass through the visible erase). **Clearance rule:** no graphite until the name is ≥3px clear of the whole sketch, measured per row at lock (`mountPencilStar()`/`textLeft()`; the five strokes are remapped into the travel that has clearance, still front-loaded: Λ within 8px of stroke 1). First 16px of a star stroke move the name without a mark — accepted by the CD; don't claw it back by overlapping the name. **FLIP-at-release rule (`flipToFinal()`):** the final row (printed star in/out, final truncation) is laid out on the RELEASE frame and the name slides home from the dragged offset — letters never change on the frame the eye comes to rest. During the drag the name slips under an 8px feathered `mask-image` edge 12px before the stamp/X (never a hard clip). **Touch plumbing:** `touch-action: auto`; a non-passive `touchmove` calls `preventDefault()` only after the lock and only if `cancelable`; a one-shot `eatClick` eats only the stroke's own click (never a time window — a tap right after a star must navigate). **Ghost-contrast ruling:** the rub-out ghost is 1.41–1.51:1 and is NOT a 3:1 mark by design — a transient preview whose meaning is also carried by the name held aside and the absent dust; both resting states pass (printed star ≥4.30:1, "no star" = the name). **Dial if the owner's daylight check fails: ghost opacity 0.35, ceiling 0.45** (past ~0.5 it reads as a state); add no other cue. **Popup (the non-gesture/accessible path):** one tap on the star draws the same five strokes (40ms each) then inks at 220ms, with the hollow star held until stroke 1 is under way (no empty slot); unstar plays the same colour-first rub over 240ms then the hollow star; `popupInkId` plays once and never replays on refetch. **Teaching:** the first two times a star is set from the POPUP while that place's row is on screen, the row replays the stroke once (~500ms); `localStorage` cap (try/catch), off-screen rows skipped and not counted; reduced motion shows a static sketch then the ink by opacity, no toast. **Reduced motion generally:** finger-driven motion stays; release lands in 0ms; no press-in, no dust. **Writes:** the stroke commits through `toggleLocationFlag()` (optimistic, `flagWritesInFlight`, per-write rollback); `syncLocationCards()` holds only the dragged row's re-render. Pencil→printed hand-off measured 0/2,916 px. Rows 56.00px throughout; tap delay 0ms added; Impeccable baseline 3. Chromium-only numbers — see the iPhone checks. Design record: `design/pencil-star/`.
  **Rounds 4–6 (owner's live-iPhone feedback: "too fast I can't see it", "too pointy", size/placement "a little weird"; perfection-stage, 8 → 8 → 9/10) — these SUPERSEDE the display/pace details above where they conflict:**
  - **Display (P1):** an 18px star in its own slot at the head of the text column, centred across both lines; starred rows indent both lines 26px. **Black ink (`--ink`) everywhere** — list, popup (filled), add form, gesture ink (the map already was); `--paper` on highlighted rows. `--figure-deep` was dropped because an 18px accent star became a second badge that merged with/clashed against orange category rings (Stockholm, Copenhagen). Contrast 14.69 (paper) / 13.17 (visited) / 11.74 (pressed); highlighted ≥4.79. **S1 soft star**: one path for `#g-star`, `#g-star-open` and `STAR_D` (tip rounding 1.3, inner 0.6, ratio 0.47; the rounder S2 was rejected as blobby at 1x). Truncation cost: 8–10 more of 193 names if every row were starred (`design/pencil-star/r4-trunc.json`); the ragged text edge is accepted only because stars are meant to be scarce. Fallback on record: P0 (12px inline, same fixes).
  - **Pace — the root cause the owner hit:** the sketch was tied to ~34px of finger travel, so a natural swipe showed it for only 4 frames (66ms). Now the pen is **hand-speed**: `HAND_MS` **300** (dial 280–340; was 360 until the owner found it "a little too slow", 2026-09-28). The finger still owns the name and the 56px commit; the pen never runs ahead of the finger, retracts at once on back-off, and a committed release finishes drawing, then inks. Unstar rub ≥400ms, finishing `RUB_AFTER_LIFT` 180ms after lift. Popup: **60ms per stroke, ink at 316ms** (was 72/380).
  - **Commit cue = pressure, not speed.** At the 56px crossing, in the same event, every stroke goes heavier (~1.4×, 85%→100% opacity, darker, denser grain); back-off lightens it. A 3px, 140ms detent on the name (not under reduced motion). After commit, strokes are ≥46ms each and the sketch stays visible ≥235ms (`SKETCH_MIN` — a hard floor, never below ~13 sketch frames; was 55ms/280ms). Unstar's first eraser speck drops at the crossing. Ruling on record: UX's "finish the pencil within 120ms of commit" was REJECTED because it re-creates "too fast to see".
  - **Ink landing:** 1.1→1 press-in over 140ms plus exactly ONE rAF-driven 1.15× spread frame — the peak must be the crispest frame (a 2-frame hang read as blur).
  - **Dust sweep:** specks start at the star's lower-left inner corner and are swept 11–13px left into the badge/text gutter, fading over 200–240ms (gone by ~530ms; `releaseStarRow()` compensates the box shift). The name leaves at dust − 100ms; lift → name moving ≤150ms (measured ≤117). **Rule: dust may never overlap text — 0 frames**, guarded by the dust detector. Why: round 5 slid the name under falling specks and they read as accents ("ÀTTRACTION").
  - **Rapid strokes (R4-S2):** a new row's lock fast-forwards any still-finishing row to its visible ink landing — never refuses the new stroke, never snaps silently.
  - **FLIP rule, re-specified (replaces "laid out on the RELEASE frame" above):** glyph changes happen only while the name is moving, ≥3 motion frames before rest, and any truncation-edge change lies under the feathered mask. `flip6.js` is the proof (8/8, and its deliberate at-rest-swap control fails 4/4).
  - **Test gate: "84 + 8"** — touch suite 84/84 in both motion modes (4 obsolete "laid out on release" cases were retired, replaced by) + `flip6.js` 8/8; plus popup-open 20/20, 0 dust-over-text frames, rows 56.00px, 0ms tap delay, hand-off 0/5,184 px, Impeccable baseline 3. Always report it as "84 + 8", never "84".
  - **Dials:** `HAND_MS` (280–440), pressure step 0.5–0.9 units (1.3–1.5×), light-graphite opacity 0.8–0.9, detent 2–4px, ghost 0.35 (ceiling 0.45), `RUB_AFTER_LIFT`, dust fade (toward 160ms / two specks if it reads as punctuation), star ink `--ink-2` if black feels heavy.
  - Design record `design/pencil-star/` now includes the r4–r6 decision frames and `r4-trunc.json`.
  **Rounds 7–8 (merged to `main` `0c95a59`, 2026-09-28; owner: "more dramatic pop and angle"; a haptic click). Perfection stage: CD scored round 7 at 8, round 8 at 9/10. These SUPERSEDE the rounds 4–6 "Ink landing" bullet above. Keep that bullet as history only: the 1.1→1 press-in plus one 1.15× spread frame is no longer current behaviour.**
  - **Spin-stamp ink landing.** Row and popup share one table, `STAR_POP`, with `STAR_POP_MS` = 380:

    | Offset | Rotation | Scale | Easing into the next segment |
    |---|---|---|---|
    | 0 | −20° | 1 | `cubic-bezier(.2,.9,.3,1)` |
    | .34 | +6° | peak | `cubic-bezier(.6,0,.85,.45)` |
    | .65 | −2° | 0.95 | `cubic-bezier(.4,0,.3,1)` |
    | 1 | 0° | 1 | — |

    - **The effect easing is LINEAR, with the easing on each keyframe.** The row uses WAAPI `ink.animate(STAR_POP, { easing: 'linear' })`. The popup uses CSS `@keyframes sgpPress` with per-keyframe `animation-timing-function`, 1:1 with the table.
    - Why: round 7 used an effect-level ease-out, which compressed the whole drama into about 90ms. That was "too fast to see" again.
    - Peaks: the row peaks at 1.4×. The popup peaks at **1.35×**, with the popup ink's `transform-origin` at 70% 55%. That origin was measured, not assumed: title clearance is 4.41px (50% gave 3.44px).
    - Full ink on the first frame. The hand-off, teaching and popup waits follow `STAR_POP_MS` + 20.
    - **Rule: at least 6 frames at ≥1.3×**, measured at real timing. Measured: row 11 frames at ≥1.3× and 3 at ≤0.97; popup 8 and 3. Peak about 100–117ms, dip about 233–250ms, rest about 350–367ms.
    - Clearance at the peak: row name ≥4.68px, badge ≥8.91px.
    - Rejected: A, a plain pop (read as "a bit bigger"), and B, an 8° twist (lost at 18px).
  - **Sketch lean −12°** (was −7°): drawn by hand, then set straight in ink.
  - **Erase pop (owner, 2026-09-28: "the star should slightly pop out when erasing it"):** at the erase lock the star lifts to 1.12× over 240ms (no twist — the gentle inverse of the 1.4× landing), then the rub/dust proceed; row and popup alike; none under reduced motion. It fires at the lock, so it also plays on a cancelled erase — accepted by the CD as "lifting the star to rub it out". Clearance 8.47px to name, 5.04px to popup title. Haptic timing unchanged. CD 9/10.
  - **Reduced motion:** no scale and no rotation; the ink just appears. **Haptics still fire.** They aren't motion, and they are the only finish cue there.
  - **Haptics (`starHaptic(kind)`):**
    - Android: `navigator.vibrate`, 10ms for star and `[6,45,6]` for erase.
    - iOS: a hidden `<input type="checkbox" switch id="starHapticSwitch">`, toggled via its label. The switch needs iOS 17.4+; the haptic needs 18+.
      - `starHapticSwitch()` builds it lazily, fixed off-screen, clipped, `aria-hidden`, `tabindex -1`.
      - All of its clicks are stopped at **window capture** (`stopImmediatePropagation`), so 0 clicks reach document. Otherwise the outside-click handlers would close the account menu and the address suggestions.
      - If it takes focus it is blurred. The previous focus is restored only if focusable and not `body`.
    - Row swipe: the tick fires **on the ink landing** (star), and as a double tick (two toggles 60ms apart) at the erase commit (unstar).
    - **Platform limit:** from iOS 26.5, WebKit fc1ef83 (bug 309082) makes a script `label.click()` untrusted, and an untrusted click gives no haptic. **A swipe can never tick on iOS 26.5+.** That is not a bug and can't be fixed by timing. **Owner-confirmed on iOS 27 (2026-09-28): the popup real-tap path ticks; the swipe path is silent — as predicted.** It works on iOS 18.0–26.4 and on Android.
  - **Popup real-tap path (owner-approved):**
    - `.popup-star-tap` is an `aria-hidden` `<label for="starHapticSwitch">` placed exactly over the star's 44×44 `::after` target, at `z-index:202`. `.popup-title-row` is `position:relative` with no z-index.
    - The finger's trusted tap toggles the switch, so it ticks on iOS 26.5+ too. `popupStarTap()` forwards the click to the button one task later, which keeps the label attached while its activation finds the switch.
    - One tick at tap time, for star and unstar alike (a tap is one trusted event). Android vibrates on the tap. There are no delayed popup ticks.
    - Keyboard and VoiceOver go straight to the button and produce no tick.
    - Unchanged: the 8px dead band, `.popup-star` `z-index:201`, and the accessibility tree (only `button "Star"` with `pressed`).
    - A **mouse** click refocuses the button (N8-a). It uses `pointerType`, or the last `pointerdown` type on Safari. A touch leaves focus on `body`, so no focus ring appears on iPhone.
  - **Dials:**
    - peak 1.3–1.45× (popup ≤1.35×);
    - twist −14° to −24°;
    - duration 340–400ms;
    - undershoot 0.95 → **0.97** if the dip after the swell reads as a bounce;
    - sketch lean −7° to −12°.
  - **Test gate:** "84 + 8 (+ N8-a)". That is the touch suite 84/84 plus `flip6.js` 8/8, plus a mouse click on the popup star leaving focus on the star button. Also:
    - popup-open 20/20;
    - `curve8.js` frame counts (row ≥11/3, popup ≥8/3);
    - `haptic8.js` (0 frames of focus on the switch, 0 document clicks, overlays stay open) and `tap8.js` (1 toggle per tap, trusted);
    - 0 dust-over-text frames, rows 56.00px, tap delay ≤~2ms over `main` (touchend→navigate 1.8–2.8ms vs ~1.0ms; imperceptible), hand-off 0/5,184, Impeccable baseline 3.

- **Swipe LEFT to mark visited — "ink bleed + stamp"** — first merged to `main` as "carry and press" (`aa0445e`, 2026-09-28, at the owner's request before its CD score, to test on device); the owner then rejected the carry ("I don't think it should slide it should stamp with some grow shrink that feels good…maybe the same as the star"; "It shouldn't draw its a stamp"; "It should look like ink bleeding in or something"). Rounds p3–p7 on branch `claude/visited-state-badge-list-yultpy` (CD 8 → 8 → 8 → 9/10 + must-fix P6-N1, fixed in p7). **Everything below supersedes the carry.** Design record: `design/swipe-visit/` (concept, p1–p7 design/UX/CD docs, strips, `vtest.js`).
  - **Gesture:** stroke a pin row LEFT, the mirror of the Pencil Star's right stroke (same LOCK / EDGE 24 / SCROLL / COMMIT 56 / flick numbers). On lock the X fades (80ms) and stops taking taps; the name's feather edge sets once (full reach after the first 6px, then static — rewriting it per move was a repaint source). **Nothing slides and nothing is drawn.**
  - **Pre-commit = ink bleeding into paper:** a dense centre blot lands first (the core stays at 0.10 scale inside the blot until 18px, so no word fragment shows), then a crisp pale core in the stamp's own navy at lower density (chroma 0.030–0.035, hue 246–247°, ≤2.96:1 on paper; highlighted row 1.86–2.40:1) soaks outward under a constant-1.4px-blur wet halo leading it by ~3px, with a static fibrous paper edge. The reveal mask is rounder than the stamp (aspect 1.4), so the ring's top and bottom ink early while its ends still soak: ring coverage 0/26/42/57/69% at 24/32/40/48/54px — **never closed before the press**. Technique (WebKit-safe and cheap): the fibre edge is a static `feTurbulence` SVG data-URI used as a mask image; the spread is `transform: scale()` on the mask wrapper with the ink counter-scaled; ink strength is three pre-rendered core copies crossfaded by opacity. No per-frame blur, gradient, filter or class-driven repaint (P6-N1: 0 mid-drag frames >33.5ms in 12 runs at 200 rows / 4× throttle; raster 20–21ms vs main 45–51). A release before 56 dries the bleed away: no ink, no field, no haptic.
  - **Press at 56, one frame:** the bleed snaps to the crisp in-flow stamp, the visited field lands, the final truncation lands (letters never change on a still frame — V18), haptic tick, then the star's `STAR_POP` timing/easings around the place's `stampTilt()` with two measured deviations: peak **1.2×** (1.25× leaves 3.0px to the name, 1.3× 1.2px, 1.4× touches; 1.2× keeps ≥4.8px to name and X across all six tilts) and the twist scaled ×0.6. Backing off 4px below 56 (`HYST`) un-presses.
  - **Un-visit** (same stroke on a visited row): the star's erase pop (1.12×, no twist) at the lock, then the stamp pales toward a light navy tint by opacity (lightness holds at rest value through 12px then only rises — never darkens; chroma ≥0.045 — never grey), gone at 56 with the field draining and the erase double tick. A flick never un-visits. Shape rows don't take the gesture.
  - **Delete safety:** only a near-still tap on the X deletes — `DELETE_TAP_SLOP` 4px between down and up (read from `touchend`); a touch that moves 4px+ does nothing (no delete, no navigate). Keyboard Enter unaffected; a stroke's own click is eaten by `eatClick`. UX sweep: 0–3px delete; 4/5/6/8/12/20/40/90px never do.
  - **Reduced motion:** the bleed stays finger-driven; no pop/scale/rotate; haptics still fire.
  - **Gates:** star "84 + 8 (+ N8-a)", visit suite `vtest.js` **95/95** both motion modes (incl. D1–D10 delete safety, V18 glyph rule, V23 mid-drag perf), popup-open 20/20, star curve row 11 frames ≥1.3× in 9/10 runs (main also shows an occasional 10 — frame-phase jitter, confirmed by UX over 10-run samples), Impeccable baseline 3. Chromium-only numbers.
  - **Dials:** peak 1.2× (ceiling 1.25×), twist ×0.6, `HYST` 4, `DELETE_TAP_SLOP` 4 (3–6), halo blur 1.4px, core-hidden-until 18px, reveal aspect 1.4; if the drag stutters on iPhone, keep the blur static and scale a masked wrapper (already so) or drop the fibre mask.
  - Not done: a teaching replay from the popup's Mark Visited.

**Priority (owner-requested, next up):**
- **List ordering is confusing** (owner, 2026-09-23). Current behavior,
  not a designed choice: `locations` are fetched `.order('created_at',
  { ascending: false })` (newest-added first) and `syncLocationCards()`
  keeps that order after `visibleLocations()` filters by city/category;
  shape rows render in their own block via `createShapeCard()`. Nothing
  groups by visited state, category, or proximity, so the list reads as
  arbitrary. Needs a Design/UX/CD pass on what the list is *for*
  (planning vs. on-the-ground "what's near/left") — and it interacts with
  the visited-row field (e.g. sorting visited to the bottom would change
  what the field is doing). Don't just pick a sort.
  "Star…" (batch) mode was dropped: the owner ruled a fast per-row action makes it unnecessary, and the Pencil Star stroke is that action. "Starred first" remains a candidate ordering for this pass.
- **Trip vs. place location model — search can't find places in other
  cities** (owner, 2026-09-23). Root cause of the search failure: every
  Nominatim call goes through `currentSearchCityConfig()` (the city
  detected from the map/filter, or the form's city), which appends that
  city's `geocodeSuffix` to the query (e.g. `"<query>, Stockholm"`) AND
  sets its `countrycodes` as a HARD filter (`CITIES` in `index.html`) —
  so a place outside the current city's country(ies) can never be
  returned, and one in another city of the same country is ranked
  against the wrong suffix. The owner's intended mental model: a **trip**
  has an overarching location, and the **places** on that trip may or
  may not be in the same city (day trips, other towns, a stop en route).
  The app currently conflates the two — `cities` is doing double duty as
  both "where the trip is" and "where this place is". Constraint from the
  owner: adding a place must stay low-friction ("I don't want adding
  things to the list to be crazy egregious") — no forced multi-step
  city/trip selection just to add a pin. Scope is a real rework (data
  model, search scoping, the city filter/list, the add form, and how
  `resolveShapeCity()` / new-city creation fit in); needs discovery and a
  proposal the owner approves before any build. Related: Phase 2 "trip
  context (dates/closures)" in the deferred roadmap.
- **Day agendas — plan AND follow an ordered route** (owner,
  2026-09-27). For days where the owner wants a set order: build an
  agenda for a given day, then use it on the ground. The owner is unsure
  how deep v1 needs to go to test the idea; the aspirational end state is
  maps-app-like — paths drawn between stops, reorder stops and see how
  the route/travel changes. Problem for the team to scope: the smallest
  v1 that tests plan+follow (e.g. an ordered list per day with
  prev/next and numbered markers) vs. what needs routing data. Known
  constraints to weigh: no build step; the sandbox can't reach OSM
  services (routing would need a provider — check what's reachable from
  the browser and its usage terms); Get Directions already hands off to
  Apple Maps per stop (`directionsUrl()`), which may be enough for
  "follow" in v1. Relates to list ordering, the trip/place location
  rework, Phase 2 trip dates, and personal priority — sequence the
  discovery so these don't get designed in isolation.

**Needs the user's action:**
- iPhone check of swipe-left visited (#1 is a gate):
  1. **(Gate)** A left stroke from the X or the row's right half visits. A 4–12px nudge on the X never raises delete; a still tap does (dial `DELETE_TAP_SLOP` 3–6).
  2. The drag reads as **ink bleeding into the paper**: a drop at the centre soaking outward in the stamp's own navy, thinner — not fog, not a focus pull, not a brighter blue.
  3. At ~54px it still looks unfinished (ends soaking); the press snaps it crisp with the grow-shrink and settles at the stamp's tilt.
  4. Let go early: it dries away with no stain.
  5. On the focus (highlighted) row the bleed is visibly weaker than the pressed stamp.
  6. No hitch as the ink deepens mid-drag on a long list.
  7. Un-visit lifts with the star's erase pop, pales, never darkens or goes grey.
  8. The scaled mask and fibre edge render without shimmer.
  9. Haptics: swipes are silent on iOS 26.5+ (incl. iOS 27) — the platform limit, not a bug. Android / iOS ≤26.4: one tick on the press, a double tick on the lift.
- iPhone check of the Pencil Star (in this order — #1 is a gate):
  1. **(Gate)** A horizontal stroke on a list row engages the star (iOS Safari delivers a *cancelable* `touchmove`). If it never arms, stop and report before anything else.
  2. Loose-thumb flick scrolls never stick or catch a row; 34–45° drags scroll; no jank on a long list (non-passive `touchmove` on every row).
  3. A stroke starting ~24–40px from the left edge stars and isn't taken by Safari's back-swipe; one from the very edge still goes back.
  4. A real quick flick stars; a flick on a starred row springs back without unstarring.
  5. At a natural swipe you can **watch** the star being pencilled stroke by stroke. The ink lands twisted, swells and holds, then turns upright to size in about ⅓s. It reads as a stamp pressed home, not a bounce. If the dip after the swell reads as a second bounce, apply the undershoot dial (0.97). The pencil grain reads as graphite on the OLED; dial `HAND_MS` for the pencil pace.
  6. The unstar commit — the ghost vanishes and the first speck drops at the crossing — is noticeable in daylight; if not, apply the ghost dial (0.35, ceiling 0.45).
  7. No flicker at the FLIP swap, the feathered edge, the pencil → ink hand-off, or the one-frame spread (at 120Hz it's 8ms — confirm it doesn't read as a flash); `color-mix()` renders in the SVG fills.
  8. The 80ms press feels like a press, not lag; a quick tap's press on release reads as a press, not a flash; no dark blink at the start of a stroke or a flick-scroll.
  9. Star a place, then immediately tap the next one: it navigates.
  10. Popup star: one tap draws then inks; one tap rubs out to the hollow star; with the popup open it plays once and doesn't replay after the save.
  11. The first two popup stars replay the stroke on the on-screen row; after that it never replays.
  12. Still open from before (keep them): the popup's 8px dead band and `z-index:201` upper target, the map's ink star on real tiles, list-tap → pinch mid-flight → no popup, the add form's STAR row, and the press/tilt, visited-background and visited-stamp checks below.
  13. The pressure step at 56 is visible under the thumb, and the 3px catch is felt, not seen as a glitch (dials: pressure 1.3–1.5×, detent 2–4px).
  14. The soft black star beside the category ring reads as one entry ("★ Name"), not a second badge; softened but still a star in daylight. If it feels heavy, fall back to `--ink-2`.
  15. The swept dust reads as eraser crumbs brushed off — not dirt beside the badge or a colon before the category. If it reads as punctuation, shorten the fade toward 160ms or trim to two specks.
  16. Three quick stars down the list all land, each visibly inking.
  17. On unstar, the name leaves at lift; nothing feels stuck.
  18. The −12° pencil lean looks hand-drawn, not broken (dial −7° to −10°).
  19. The popup star's swell never feels crowded against the title (dial ≤1.35×).
  20. **Haptic. First check Settings › General › About › iOS Version.**
      - **Popup star tap:** one click on every tap, star and unstar alike, on **any** iOS ≥18, including 26.5+.
      - **Row swipe:** on iOS 18.0–26.4, one click as the ink lands and a double click as the erase dust falls. **On 26.5+, expect no click from a swipe: that is the platform limit, not a bug.**
  21. No side effects: an open account menu or address suggestions stay open after a swipe-star or swipe-erase. Nothing flashes on screen, and focus never jumps.
  22. With VoiceOver on, double-tapping the popup star toggles it exactly once, and VoiceOver announces only "Star, toggle button"/"selected". There is no stray checkbox.
- iPhone check of press + tilt: (1) pressing a row reads as pressed in,
  not a flash, on both visited and unvisited rows; (2) ~~rows don't blink darker when starting a flick-scroll~~ — covered by Pencil Star check 8; (3) the ±5° stamps look deliberate
  and hand-stamped, not broken.
- iPhone check of the visited-row background: (1) at a glance in
  daylight, visited rows visibly sit back from unvisited ones (if not,
  apply the dial — field and divider together); (2) the visited field
  reads as warm, older paper, not grey. (Its original check (3), "pressing
  a visited row flashes lighter", is superseded: the owner found that
  flash too light and presses now go darker — see the press check above.)
- iPhone check of the visited stamp (round 3): (1) the outer track is
  evenly spaced round dots, no bunching/collision at top-centre (if it's
  uneven or solid, swap in the JS fallback per
  `design/visited-badge/README.md`); (2) the dotted track and solid ring
  look parallel — even gap all the way round; (3) "VISITED" looks centred,
  and if off at all, high rather than low; (4) scroll, then immediately
  tap a stamp — the map should navigate; (5) tap just left of the X on a
  visited row — should navigate, not raise the delete confirm; (6) stamp
  text at arm's length looks crisp, not soft. Also pick fixed −3° vs
  per-place tilt if per-place doesn't feel right.
- ~~Confirm the `cities` table migration has been run~~ — confirmed done
  (2026-09-19).
- Smoke-test the new shape-city resolution in a real browser (agent
  sandboxes here can't reach Nominatim/Overpass): add a district/street
  that should confidently match an existing city, one that should trip the
  `shapeCityConfirm` dialog, and try both its "Add city" and "Add to
  [city]" buttons.
- Re-run `tools/neighborhood-shapes.html` for `reykjavik-klapparstigur` in
  your own browser. The tool now auto-drops OSM segments that disagree with
  the majority-voted city (see Architecture above), which should exclude
  the ~50km Keflavík fragment without needing to eyeball the preview map —
  but this hasn't been verified against the real Overpass response, since
  the agent that wrote it can't reach Overpass either. Check the card's
  warning text before accepting.

**Data cleanup (neighborhood shapes):**
- `copenhagen-nyboder` (Nyboder) and `stockholm-gamla-stan` (Gamla Stan)
  should now resolve automatically as approximate pins via
  `findApproximatePoint()`'s fallback chain (see Architecture above) next
  time they're added through the live form or the bulk tool — not yet
  verified against the real Nominatim/Overpass response, same environment
  constraint as everything else needing live OSM access. If both fallback
  tiers genuinely come up empty for either, manual tracing via geojson.io is
  still the last resort.

**Known minor bugs / follow-ups:**
- Delete X's effective tap zone extends ~9–12px left of its 28px box via
  browser touch adjustment (measured in Chromium on today's unvisited
  rows; iOS unmeasured — its hit-testing may favor the clickable row
  more). Pre-existing, not caused by the stamp. `confirm()` is the
  backstop. If mis-deletes are still reported, the next move is
  shrinking/relocating delete, not more stamp margin.
- Many `locations.name` values redundantly end in the city already shown
  in `.row-meta` (e.g. "Mother restaurant Copenhagen") — trimming them is
  a data cleanup that would win back truncation room on visited rows.
- Possible follow-up: a matching mini-stamp for the popup's visited state
  (`.popup-visited`), for visual coherence. Not scoped.
- Shape rows (districts/streets) have no visited state, so they always
  stay forward on `--paper` — late in the trip they'll be the brightest
  rows and can't be cleared. Known consequence of the visited-row field;
  don't tint shapes to fake it. Resolved properly only if shapes gain a
  `visited` column (see the street/district popup item below).
- Street/district popups lag behind pin popups (owner-reported
  2026-09-23). `buildNeighborhoodLayer()` binds a bare
  `<strong>label</strong><p>note</p>` string, while pins get
  `buildPopupHtml()`: category glyph + label, title, address, notes, and a
  `.popup-actions` row with the visited toggle and Get Directions. Gaps to
  resolve: no category/type header, none of the popup typography classes,
  no visited toggle, no directions. Visited needs a schema change first —
  `neighborhood_shapes` has no `visited` column (checked 2026-09-23:
  id, city, type, label, color, note, min_zoom, geometry, created_at), and
  the shape list rows (`createShapeCard()`) would need the stamp too.
  Directions were deliberately excluded for shapes when that feature
  shipped (no single natural destination point); revisit with a centroid
  or nearest-point destination, or keep excluded on purpose. Needs a
  Design/UX/CD pass rather than a straight port.

Previously tracked and fixed: (Previously: `showError()`/
`hideError()` banner masking, and `slugifyCityId()` not decomposing Nordic
`ø`/`æ`/`å`/`þ`/`ð` — both fixed 2026-09-19. `showError`/`hideError` now
take a `source` tag and only a matching source's `hideError()` clears the
banner; `slugifyCityId()` (and the bulk tool's mirrored `slugify()`)
explicitly map those five letters before the generic NFD strip.)

**Deferred roadmap (not started):**
- Phase 2 — trip context (dates/closures) and shared traits (kid-friendly,
  vegetarian, etc.) across both pins and shapes.
- SRI hashing on the CDN script tags.
- Nominatim autocomplete-while-typing (currently only fires on submit).
