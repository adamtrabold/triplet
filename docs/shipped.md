# Shipped features — specs and history

Moved verbatim from `CLAUDE.md` (2026-09-29), then given inline
*(superseded by …)* markers where an earlier entry states as current
something a later entry changed. Chronological, oldest first.
**Later entries supersede earlier ones where they conflict** (entries say so
explicitly). Read the section for a feature before touching it — the
constants, dials, gates and rejected alternatives recorded here are the
current spec. Design records for most features live in `design/<feature>/`.

Sections: marker size · cluster banding · clustering past GLYPH_MIN_ZOOM ·
visited-checkbox fix · Get Directions · delete-only list row · popup buttons
side-by-side · popup category gap · visited passport stamp · visited rows
recede · pressed row darker · list click opens popup · Pencil Star (rounds
1–8) · swipe-left visited · sheet reaches bottom edge · popup + replay (p8) ·
search widens on a miss.

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
    directly by the owner after seeing the shipped layout. *(Superseded by
    "Popup + replay round (p8)", below: category now sits in the bottom
    row, left of Mark Visited.)*
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
    rounds of CD review to get that system right). Both still open — now
    tracked in `docs/backlog.md`.
- Popup buttons side-by-side; list dot reverted to visited-only — merged
  to `main` (`62880ce`). Two changes the owner asked for after seeing the
  prior entry live on their phone.
  - **Popup**: `.popup-visited`/`.popup-directions` were stacked full-width
    lines; now share one row (`.popup-actions`, `space-between` — visited
    left, directions right). *(Superseded by "Popup + replay round (p8)",
    below: Get Directions is now its own line under the notes, and the
    bottom row is category left · Mark Visited right.)* Popup's inline `min-width` bumped 200→240px
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

- **Personal priority star — the "Pencil Star"** — first merged to `main` (`798134f`, 2026-09-28); rounds 4–6 merged to `main` (`d298e5b`, 2026-09-28), after the `starred` migration (`locations.starred boolean not null default false`; RLS unchanged). **Display (unchanged from the first star round):** Baedeker printed a star *before* a sight's name for "particularly worth seeing" — one bit (a `**` tier is the `smallint` upgrade path). List: 12px `--figure-deep` star leading the `h3` (never ellipsis-clipped, fixed x = a scannable column), non-interactive, single `.sr-only` source ", starred". Map: `--ink` star on a `--paper` halo (on the map `--figure-deep` already means "cluster"); a cluster wears the star if any member is starred; stacking ladder highlighted 1000 > starred cluster 700 > cluster 600 > starred pin 500 > pin 0. Popup: hollow/filled star leading the title (44×44 target, 8px dead band to Mark Visited, `z-index:201` load-bearing). *(p8, below, moved Mark Visited to the bottom row: the 8px dead band is now to Get Directions.)* Add form: "STAR" toggle, hidden for district/street. **Interaction history:** the first round made the popup (and add form) the only way to star, and ruled any list-row interaction out. **The owner rejected that as "very average"**: starring must be fast *from the row itself*, with as few interactions as possible, and "better than what every other app does, not a copy". A batch "Star…" mode was dropped as unnecessary once a per-row action is fast. Swipe was reconsidered once the Safari back-swipe was measured rather than assumed (WebKit's `ViewGestureControllerIOS.mm`: a screen-EDGE pan recogniser, left = back, right = forward; still edge-only in Safari on iOS 26). **The Pencil Star won** (design/UX/CD, 3 rounds, 6 → 8 → 9/10) against a Mail-style tag reveal (2 interactions, chrome, on the delete side), a long-press stamp (≥450ms, and it spends the *visited* stamp metaphor), a double-tap punch (+250–300ms on every navigation tap, or mis-stars on impatient re-taps) and a dog-ear (next to delete). It completes the app's three-way grammar: **printed = the guide's facts, stamped = where you've been, pencilled = what you care about.** **Gesture:** stroke a row RIGHT: the name + meta slide as one block (transform, 1:1), and in the printed star's own box a star is pencilled in five straight strokes, the way a hand draws one, leaning −7° *(−12° since rounds 7–8)*. At 56px of content travel the ink lands (the approved `--figure-deep` printed star, 100% on its first frame, pressed in 1.2→1 over 160ms, one 17ms spread frame) *(colour superseded by rounds 4–6 — black `--ink`; landing superseded by rounds 7–8 — `STAR_POP` spin-stamp)*; release and the name docks against it. The SAME stroke on a starred row rubs it out: colour first (ink → `--ink-2` over 0–10px, no grain on orange — it read as glitter), grain only once 100% graphite (10–16), erosion from the points inwards with a widening smudge (16–50), a 25% ghost of the star held from 44 to the commit, and the ghost vanishes + three specks of eraser dust fall on the 56px frame exactly (honest: letting go before 56 never looks done). Left is inert (6px of give); shape rows give 6px and never star. **Numbers (`STAR_SWIPE`):** EDGE 24 (no arming within 24px of either screen edge; never `preventDefault` on touchstart, so Safari's back-swipe stays intact), LOCK 10px horizontal at >1.5× vertical (flatter than ~34°), SCROLL 8 (8px of vertical travel before the lock hands the touch to the scroller for good — 34–45° drags scroll exactly as on `main`), COMMIT 56 (66px of finger), MAX 104 with ×0.35 rubber-band, FLICK ≥32px at ≥0.5px/ms **stars only** (unstar must pass through the visible erase). **Clearance rule:** no graphite until the name is ≥3px clear of the whole sketch, measured per row at lock (`mountPencilStar()`/`textLeft()`; the five strokes are remapped into the travel that has clearance, still front-loaded: Λ within 8px of stroke 1). First 16px of a star stroke move the name without a mark — accepted by the CD; don't claw it back by overlapping the name. **FLIP-at-release rule (`flipToFinal()`):** the final row (printed star in/out, final truncation) is laid out on the RELEASE frame and the name slides home from the dragged offset — letters never change on the frame the eye comes to rest. During the drag the name slips under an 8px feathered `mask-image` edge 12px before the stamp/X (never a hard clip). **Touch plumbing:** `touch-action: auto`; a non-passive `touchmove` calls `preventDefault()` only after the lock and only if `cancelable`; a one-shot `eatClick` eats only the stroke's own click (never a time window — a tap right after a star must navigate). **Ghost-contrast ruling:** the rub-out ghost is 1.41–1.51:1 and is NOT a 3:1 mark by design — a transient preview whose meaning is also carried by the name held aside and the absent dust; both resting states pass (printed star ≥4.30:1, "no star" = the name). **Dial if the owner's daylight check fails: ghost opacity 0.35, ceiling 0.45** (past ~0.5 it reads as a state); add no other cue. **Popup (the non-gesture/accessible path):** one tap on the star draws the same five strokes (40ms each) then inks at 220ms, with the hollow star held until stroke 1 is under way (no empty slot); unstar plays the same colour-first rub over 240ms then the hollow star; `popupInkId` plays once and never replays on refetch. *(Superseded by p8, below: no pencil draw or rub in the popup — fade + spin-stamp pop / fade + 1.12× lift.)* **Teaching:** the first two times a star is set from the POPUP while that place's row is on screen, the row replays the stroke once (~500ms); `localStorage` cap (try/catch), off-screen rows skipped and not counted; reduced motion shows a static sketch then the ink by opacity, no toast. *(Superseded by p8, below: the row replays on every popup star/unstar; the 2-time cap and its localStorage key are gone.)* **Reduced motion generally:** finger-driven motion stays; release lands in 0ms; no press-in, no dust. **Writes:** the stroke commits through `toggleLocationFlag()` (optimistic, `flagWritesInFlight`, per-write rollback); `syncLocationCards()` holds only the dragged row's re-render. Pencil→printed hand-off measured 0/2,916 px. Rows 56.00px throughout; tap delay 0ms added; Impeccable baseline 3. Chromium-only numbers — see the iPhone checks. Design record: `design/pencil-star/`.
  **Rounds 4–6 (owner's live-iPhone feedback: "too fast I can't see it", "too pointy", size/placement "a little weird"; perfection-stage, 8 → 8 → 9/10) — these SUPERSEDE the display/pace details above where they conflict:**
  - **Display (P1):** an 18px star in its own slot at the head of the text column, centred across both lines; starred rows indent both lines 26px. **Black ink (`--ink`) everywhere** — list, popup (filled), add form, gesture ink (the map already was); `--paper` on highlighted rows. `--figure-deep` was dropped because an 18px accent star became a second badge that merged with/clashed against orange category rings (Stockholm, Copenhagen). Contrast 14.69 (paper) / 13.17 (visited) / 11.74 (pressed); highlighted ≥4.79. **S1 soft star**: one path for `#g-star`, `#g-star-open` and `STAR_D` (tip rounding 1.3, inner 0.6, ratio 0.47; the rounder S2 was rejected as blobby at 1x). Truncation cost: 8–10 more of 193 names if every row were starred (`design/pencil-star/r4-trunc.json`); the ragged text edge is accepted only because stars are meant to be scarce. Fallback on record: P0 (12px inline, same fixes).
  - **Pace — the root cause the owner hit:** the sketch was tied to ~34px of finger travel, so a natural swipe showed it for only 4 frames (66ms). Now the pen is **hand-speed**: `HAND_MS` **300** (dial 280–340; was 360 until the owner found it "a little too slow", 2026-09-28). The finger still owns the name and the 56px commit; the pen never runs ahead of the finger, retracts at once on back-off, and a committed release finishes drawing, then inks. Unstar rub ≥400ms, finishing `RUB_AFTER_LIFT` 180ms after lift. Popup: **60ms per stroke, ink at 316ms** (was 72/380). *(Popup stroke timing superseded by p8, below: the popup no longer draws.)*
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
    - Peaks: the row peaks at 1.4×. The popup peaks at **1.35×**, with the popup ink's `transform-origin` at 70% 55%. That origin was measured, not assumed: title clearance is 4.41px (50% gave 3.44px). *(Superseded by p8, below: the popup star moved to the row's 18px slot and now peaks at 1.4× with `transform-origin` 50% 55%.)*
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
  - **Popup real-tap path (owner-approved; generalised by p8, below, into `hapticTap()` for popup star, popup Mark Visited and add-form STAR):**
    - `.popup-star-tap` is an `aria-hidden` `<label for="starHapticSwitch">` placed exactly over the star's 44×44 `::after` target, at `z-index:202`. `.popup-title-row` is `position:relative` with no z-index.
    - The finger's trusted tap toggles the switch, so it ticks on iOS 26.5+ too. `popupStarTap()` forwards the click to the button one task later, which keeps the label attached while its activation finds the switch.
    - One tick at tap time, for star and unstar alike (a tap is one trusted event). Android vibrates on the tap. There are no delayed popup ticks.
    - Keyboard and VoiceOver go straight to the button and produce no tick.
    - Unchanged: the 8px dead band, `.popup-star` `z-index:201`, and the accessibility tree (only `button "Star"` with `pressed`).
    - A **mouse** click refocuses the button (N8-a). It uses `pointerType`, or the last `pointerdown` type on Safari. A touch leaves focus on `body`, so no focus ring appears on iPhone.
  - **Dials:**
    - peak 1.3–1.45× (popup ≤1.35× — pre-p8; the popup now peaks at 1.4×);
    - twist −14° to −24°;
    - duration 340–400ms;
    - undershoot 0.95 → **0.97** if the dip after the swell reads as a bounce;
    - sketch lean −7° to −12°.
  - **Test gate:** "84 + 8 (+ N8-a)". That is the touch suite 84/84 plus `flip6.js` 8/8, plus a mouse click on the popup star leaving focus on the star button. Also:
    - popup-open 20/20;
    - `curve8.js` frame counts (row ≥11/3, popup ≥8/3);
    - `haptic8.js` (0 frames of focus on the switch, 0 document clicks, overlays stay open) and `tap8.js` (1 toggle per tap, trusted);
    - 0 dust-over-text frames, rows 56.00px, tap delay ≤~2ms over `main` (touchend→navigate 1.8–2.8ms vs ~1.0ms; imperceptible), hand-off 0/5,184, Impeccable baseline 3.

- **Swipe LEFT to mark visited — "ink bleed + stamp"** — first merged to `main` as "carry and press" (`aa0445e`, 2026-09-28, at the owner's request before its CD score, to test on device); the owner then rejected the carry ("I don't think it should slide it should stamp with some grow shrink that feels good…maybe the same as the star"; "It shouldn't draw its a stamp"; "It should look like ink bleeding in or something"). Rounds p3–p7 merged to `main` (`379aed3`, 2026-09-28; CD 8 → 8 → 8 → 9/10 + must-fix P6-N1, fixed in p7). **Everything below supersedes the carry.** Design record: `design/swipe-visit/` (concept, p1–p7 design/UX/CD docs, strips, `vtest.js`).
  - **Gesture:** stroke a pin row LEFT, the mirror of the Pencil Star's right stroke (same LOCK / EDGE 24 / SCROLL / COMMIT 56 / flick numbers). On lock the X fades (80ms) and stops taking taps; the name's feather edge sets once (full reach after the first 6px, then static — rewriting it per move was a repaint source). **Nothing slides and nothing is drawn.**
  - **Pre-commit = ink bleeding into paper:** a dense centre blot lands first (the core stays at 0.10 scale inside the blot until 18px, so no word fragment shows), then a crisp pale core in the stamp's own navy at lower density (chroma 0.030–0.035, hue 246–247°, ≤2.96:1 on paper; highlighted row 1.86–2.40:1) soaks outward under a constant-1.4px-blur wet halo leading it by ~3px, with a static fibrous paper edge. The reveal mask is rounder than the stamp (aspect 1.4), so the ring's top and bottom ink early while its ends still soak: ring coverage 0/26/42/57/69% at 24/32/40/48/54px — **never closed before the press**. Technique (WebKit-safe and cheap): the fibre edge is a static `feTurbulence` SVG data-URI used as a mask image; the spread is `transform: scale()` on the mask wrapper with the ink counter-scaled; ink strength is three pre-rendered core copies crossfaded by opacity. No per-frame blur, gradient, filter or class-driven repaint (P6-N1: 0 mid-drag frames >33.5ms in 12 runs at 200 rows / 4× throttle; raster 20–21ms vs main 45–51). A release before 56 dries the bleed away: no ink, no field, no haptic.
  - **Press at 56, one frame:** the bleed snaps to the crisp in-flow stamp, the visited field lands, the final truncation lands (letters never change on a still frame — V18), haptic tick, then the star's `STAR_POP` timing/easings around the place's `stampTilt()` with two measured deviations: peak **1.2×** *(superseded by p8, below: now 1.10×, twist −10/+3/−1.2°, dip 0.97)* (1.25× leaves 3.0px to the name, 1.3× 1.2px, 1.4× touches; 1.2× keeps ≥4.8px to name and X across all six tilts) and the twist scaled ×0.6. Backing off 4px below 56 (`HYST`) un-presses.
  - **Un-visit** (same stroke on a visited row): the star's erase pop (1.12×, no twist) at the lock, then the stamp pales toward a light navy tint by opacity (lightness holds at rest value through 12px then only rises — never darkens; chroma ≥0.045 — never grey), gone at 56 with the field draining and the erase double tick. A flick never un-visits. Shape rows don't take the gesture.
  - **Delete safety:** only a near-still tap on the X deletes — `DELETE_TAP_SLOP` 4px between down and up (read from `touchend`); a touch that moves 4px+ does nothing (no delete, no navigate). Keyboard Enter unaffected; a stroke's own click is eaten by `eatClick`. UX sweep: 0–3px delete; 4/5/6/8/12/20/40/90px never do.
  - **Reduced motion:** the bleed stays finger-driven; no pop/scale/rotate; haptics still fire.
  - **Gates:** star "84 + 8 (+ N8-a)", visit suite `vtest.js` **95/95** both motion modes (incl. D1–D10 delete safety, V18 glyph rule, V23 mid-drag perf), popup-open 20/20, star curve row 11 frames ≥1.3× in 9/10 runs (main also shows an occasional 10 — frame-phase jitter, confirmed by UX over 10-run samples), Impeccable baseline 3. Chromium-only numbers.
  - **Dials:** peak 1.2× (ceiling 1.25×; p8 set it to 1.10×), twist ×0.6, `HYST` 4, `DELETE_TAP_SLOP` 4 (3–6), halo blur 1.4px, core-hidden-until 18px, reveal aspect 1.4; if the drag stutters on iPhone, keep the blur static and scale a masked wrapper (already so) or drop the fibre mask.
  - Not done: a teaching replay from the popup's Mark Visited. *(Shipped in p8, below: Mark Visited/Unmark replays on the row every time.)*

- **Sheet reaches the bottom edge (Home Screen + Safari tab)** — merged
  to `main` (`758470a`), 2026-09-28 (owner-reported band under the list). Measured on the
  owner's iPhone with `tools/viewport-test.html`: from the Home Screen
  (black-translucent) WebKit makes the layout viewport short by the top
  inset (innerHeight 894 of 956), so every bottom-anchored
  `position: fixed` layer stopped 62px short; in a Safari tab, fixed
  layers stop above the translucent toolbar while absolute content in a
  `100lvh` root runs behind it; nothing draws behind the TOP status bar
  in a tab (Safari tints it from the top fixed layer, hence
  `.leaflet-container` = OSM beige `#F2EFE9`). Fix: `html, body
  { height: 100lvh }`, `body { position: relative }`, and `#locations`,
  `#filtersPanel`, `#authModal` are `absolute`; `#mainContent` stays fixed
  but is sized by height from the top (WebKit only cuts a fixed element's
  bottom) and keeps the status-bar tint from the map. `--chrome-bottom` =
  `max(0, 100lvh − 100dvh)` (toolbar allowance, pinned to 0 standalone via
  `html.standalone`), `--sheet-under` = that + safe-area bottom: list
  bottom padding and the collapsed band sit above the toolbar/home
  indicator. Collapse now toggles `#mainContent.sheet-collapsed` (also
  fixes a collapse→desktop-rail→back desync). `unscrollPage()` resets any
  programmatic page scroll (a taller-than-viewport root can be scrolled by
  focus), but stands aside while a form field has focus so iOS can lift it
  above the keyboard. Engineer + UX (scoped gate: geometry 75/75 in
  phone/standalone/tab/desktop, smoke 12/12, popup-open 20/20, op-check,
  Impeccable 3). Should-fix (UX): a CLOSED filters panel's chips are still
  focusable, so in a tab a keyboard/VoiceOver focus there scroll-then-snaps;
  pre-existing focusability, cosmetic — make the closed panel `inert`
  (not done yet; tracked in `docs/backlog.md`).
  Follow-up: `maybeTeachStar()` counts a row behind the toolbar as on
  screen. *(`maybeTeachStar()` was removed in p8; its replacements
  `ssReplay`/`vsReplay` use the same list-rect test, so the follow-up
  carries over — tracked in `docs/backlog.md`.)* Design record: scratch `loop/sheet/`.

- **Popup + replay round ("p8")** — merged to `main` (`d5e765f`),
  2026-09-28, CD 9/10 (UX
  approve). Owner asks, all shipped together; **these SUPERSEDE the
  Pencil Star entry's popup draw/teaching bullets and the swipe-visit pop
  peak.** Design record: `design/swipe-visit/p8-*`.
  - **Visit pop 1.10×** (twist −10/+3/−1.2°, dip 0.97; was 1.2×) — owner:
    "Visited pops too large". Stays distinct from the 1.12× un-visit lift
    by twist + dip.
  - **Popup layout:** title row (star) → address/notes → **Get Directions**
    (the shipped `.popup-directions` TEXT link, own line, as wide as its
    words) → bottom row: category (left) · **Mark Visited** with its circle
    on the RIGHT. 44/46px targets, ≥8px dead bands, AA ≥4.79, no wrap,
    width unchanged.
  - **Popup star = the list's:** 18px own slot, centred across title +
    address (title alone if no address; whole heading if it wraps). **No
    pencil draw in the popup** ("the outline is already there"): star =
    fill fades in + spin-stamp pop at 1.4×; unstar = ink fades off with the
    1.12× lift, no rub/dust.
  - **Popup → row replays, every time, both ways** (on-screen rows,
    signed in): Mark Visited/Unmark replays the stamp (bleed → press → pop /
    lift → pale); star replays pencil + ink, unstar the full rub + dust
    (`ssReplay`/`vsReplay`: once per click, held against refetch, last tap
    wins, reduced motion = state lands). The old 2-time teaching cap and
    its localStorage key are gone.
  - **Haptics everywhere logical** via one `hapticTap()` real-tap label
    path: popup star, popup Mark Visited, add-form STAR (1 tick per tap,
    works on iOS 26.5+; none from keyboard/VoiceOver; 0 document clicks;
    a11y tree unchanged). Deliberately none on: filters/menus/collapse
    (navigation), delete (`confirm()` follows), Add Location submit (can
    fail), row tap, Get Directions (leaves the app); row swipes already tick.
  - **Autopan clears the top chrome:** `bindPinPopup()` sets
    `autoPanPaddingTopLeft` from the live bottom edge of the zoom control /
    + / account buttons (which already include the safe-area top) + 8px —
    82px in a tab, 141px with a 59px inset. Star target blocked 0/56 (main:
    up to 77%).
  - Deferred (CD): the 41px gap above Directions in a bare popup belongs to
    the star-alignment loop. Accepted: VoiceOver reads category just before
    "Visited"; a touch leaves focus on `body`.
  - Gates (last full gate on the pre-autopan proto; autopan re-checked
    scoped): touch 84/84, flip6 8/8, vtest 113/113, popup-open 20/20, dust
    0, replays 64/64, tap8r/haptic8r/ax8r, curve8 ×10, Impeccable 3.

- **Search widens on a miss** — branch `worktree-agent-a356ba8b4fe22d230`
  (2026-09-29). Owner decision (verbatim): "For now we should simply widen
  the search if it doesn't find it in the trip city. When we expand cities
  vs trips and create the different structure maybe that should change.
  User should not have to select distance." Why: every search was scoped
  to one city: the city's `geocodeSuffix` is appended to `q` and its
  `countrycodes` is a hard filter. A place in another country could never
  come back, and one in another town of the same country probably couldn't
  either (city-name suffixes). **Behaviour:** `nominatimWithFallback()`
  runs the scoped query exactly as before. Only on **zero results** does it
  run ONE widened query: no suffix, no `countrycodes`, the same `viewbox`
  as a SOFT bias (`bounded` dropped; `widenedSearchConfig()` returns null,
  so no second call, when there's nothing to widen). Widened rows render
  exactly like normal ones, with no divider; the address says where. A
  scoped error or timeout does not widen.
  - **Paths:** autocomplete (`searchAddress()`), typed-address submit
    (`geocode()`), district outline (`nominatimPolygon()`), and the
    Nominatim step of `findApproximatePoint()`. Deliberately not widened:
    Overpass street/node lookups (need a city bbox) and
    `deriveNewCityConfig()`'s country-scoped settlement lookup.
  - **Etiquette:** the widened call waits until `NOMINATIM_SPACING_MS`
    (1000) after the previous request started (`lastNominatimAt`, set in
    `nominatim()`), per Nominatim's 1 req/s policy.
  - **Stale guard:** `searchSeq` + the Name field's current value. A
    response (scoped or widened) is dropped if a newer search started or
    the field no longer holds its query. It is checked before the wait,
    after it (so no widened request is sent), and on arrival.
  - **Filing unchanged** (`maybeDetectCity()`/`matchCity()`). Traced with
    a stubbed fetch:
    - Malmö place with the map on Copenhagen → filed `malmo`, no prompt.
    - Uppsala from Stockholm, or Bergen from Reykjavík → the existing "X
      isn't in your city list yet. Add it?" prompt. Tapping Add Location
      while the prompt shows saves nothing. Add creates the city (then tap
      Add Location again). Dismiss files it under the map's city.
    - A result with no city/town/village in its address → saved silently
      under the map's city (wrong for a far-away rural spot).
    - A far district polygon → `shapeCityConfirm` "doesn't match any known
      city".
  - **Deferred** to the trips restructure: nearest-base filing for day
    trips, a trip entity, widening Overpass lookups. See
    `design/trip-location-model/proposal.md`.
  - **Gates:** `design/trip-location-model/widen-test.js`, a
    stubbed-fetch headless-Chromium check, 19/19 (scoped
    unchanged, one widened call, ≥1000ms spacing, bounded dropped, no
    widen on error or when unscoped, stale drop ×3, geocode / polygon /
    approx paths, settlement lookup untouched). A mutation run with the
    guard removed fails B4/B5, so the stale checks discriminate. No repo
    suite covers the add form or search. Impeccable 3. Live Nominatim is
    owner-verified only (`docs/iphone-checks.md`).

- **List order: ⇅ sort menu** (branch `worktree-agent-a8dadf08509e7d7df`,
  2026-09-29; owner-approved concept-3 #1; design record
  `design/list-ordering/` — proposal §6.1 keys, concept-2 byline (rejected
  by the owner: two text rows hurt clarity), concept-3 contact sheet, and
  `build/` with the harness, `sorttest.js` and stills).
  - **Six orders**, menu order: **A–Z** (default; owner: "Should default to
    alphabetical"), **Category** (groups in `CATEGORY_COLORS` / filter-chip
    order, A–Z inside), **Nearest** (distance from you), **What's left**
    (unvisited first, starred leading, A–Z), **Starred** (starred first,
    not-yet-visited leading inside, A–Z), **Newest** (the server's
    `created_at DESC` order — no schema change). `sortLocations()` is a
    pure reorder of `visibleLocations()`: **an order never filters**
    (tested per mode, with and without a category filter). Shape rows keep
    their own block after the pins: A–Z by label, by type in Category, by
    centroid distance in Nearest. Category has **no group labels**; the
    last row of each category run doubles its `--hair` rule to 2px
    (`.group-end`, CD rounds 2-3) -- no louder than the header's rule, no height.
  - **Button:** `#sortBtn` sits between the title and the filters button,
    drawn in the sliders icon's terms (18px, 24-unit box, 2px butt
    strokes, solid heads). Hit zone 50×56 (12px into the title gap and
    band padding, 6px right) leaving a **6px inert margin** before the
    filters box. Open = pressed paper square (`--paper-pressed`), not the
    greyed opacity of a toggled filter -- CD round 1: now an **ink tile with a
    paper glyph** (navy field, like an active city chip). The header stays **one 57px row**;
    the title keeps 186px on a 390 phone (widest real title 166). Desktop
    rail packs the icons at 4px (title 176px wide, spine still 56px).
    **No "not A–Z" mark** at rest — a 4px ink dot was tried and cut (read
    as a notification badge; non-default orders show themselves).
  - **Menu** (after CD round 1, 7/10): a label slip — `--paper-raised`
    (one step lighter than the sheet), 1px navy edge + crisp 2px navy
    offset, a "SORT BY" caption band (the one label motif), six 40px ledger
    rows (each with a 2px-above/below hit extension → 44px targets), 13px
    condensed caps at 0.05em, an **ink ✓** (1.5px stroke, 16px gutter) on
    the current order. Fixed width 200px (fits NEAREST + "LOCATION OFF").
    Sits on the header band with its 2px ink offset ending exactly on the
    band's top line (CD round 2), right-aligned to ⇅ (below ⇅ on the
    desktop rail); the Leaflet attribution is hidden while it's open. 140ms slip-in
    (none under reduced motion). A transparent scrim swallows the outside
    tap; a second ⇅ tap, Escape and Tab also close. Opening it closes the
    filters panel and vice versa.
  - **a11y:** `aria-haspopup`/`aria-expanded`/`aria-controls` on ⇅, whose
    `aria-label` is "Sort list: <order>"; `role=menu` of
    `menuitemradio` with `aria-checked`; focus moves to the checked item
    on open and back to ⇅ on close; Arrow/Home/End roving focus; a polite
    `#sortLive` region announces "Sort: <order>".
  - **Persistence:** `localStorage['triplet.sortMode']`, every read/write in
    try/catch; unknown values fall back to A–Z.
  - **Nearest:** location is asked for only when Nearest is picked, never
    on load (a stored Nearest resumes silently only if the Permissions API
    already says `granted`, else A–Z). One `watchPosition`, alive only
    while Nearest is the order; center-me's fix is shared (`takeFix()`), so
    it can sort at once. Re-sorts only after moving ≥ `NEAREST_RESORT_M`
    (150 m) from the position the order was computed at. Denied → A–Z with
    a 4s notice slip on the header band above ⇅ (never over the
    zoom/account/add controls; the OSM attribution is hidden while it shows
    -- never half-covered) + announcement, and the Nearest row greys with "Location
    off"; no fix (error or 20s `NEAREST_WAIT_MS` with nothing) → same with
    "No fix". Tapping the greyed row retries. While locating, ⇅ dims
    (0.4, like center-me) and the list stays A–Z. In Nearest the distance
    leads the row meta in **ink** ("80 M · SHOPPING · COPENHAGEN", "1.2 KM");
    a long name ellipsizes, the distance never does; works across cities.
  - **Row gestures:** while any row is held (`starHeld`: pencil star, visit
    stamp, popup replays) the list keeps its current order; the re-sort
    runs when the last hold releases (`starHeld` is a Map subclass whose
    `delete()` calls `afterRowGesture()`). So a star in Starred order or a
    visit in What's left moves the row once the gesture has landed.
  - **Gates run** (Chromium, 390×844 touch + 1280×800 mouse,
    `design/list-ordering/build/sorttest.js`): **77/77** — keys ×5,
    never-filters, menu a11y/keyboard/dismissal/mutual exclusion, motion
    real-timing (140ms), reduced motion, persistence (incl. throwing
    storage), Nearest (mocked position, 100 m no-jump, 2 km re-sort,
    denied, no fix, unanswered prompt, no prompt on load, center-me
    sharing), star/visit gestures in sorted orders, **popup-open 20/20**
    across five orders, geometry (57px header, rows 56.00px, 50×56 zone,
    6px inert), desktop rail, collapsed sheet. Impeccable: 3 (baseline,
    identical findings). **Gesture gate caveat:** `test6.js`, `flip6.js` and `vtest.js` are
    tracked but cannot run -- their harness (`design/pencil-star/lib.js`,
    `s2.js`, `r5-metrics.js`, the `r6`/`p7` protos, `design/star2/lib.js`)
    was never committed to any ref, and `curve8.js` does not exist
    anywhere; no "84 + 8 (+ N8-a)", vtest, dust or curve8 numbers could be
    produced. Stand-in: `build/gesturediff.js` runs 11 gesture cases
    (star, unstar, cancel, visit, un-visit, cancel, X nudge, X tap, row
    tap, two quick strokes, rows 56.00px) × both motion modes against the
    base commit and this branch: **22/22 identical outcomes, 0 errors**.


## State system (2026-09-29)

Owner: "why are the active states not matching come on we should have clear
systems at this point." One rule per meaning, on existing tokens, no new
colours or dots. Tokens on `:root`: `--state-press` (= `--paper-pressed`),
`--state-on-bg` (= `--navy`), `--state-on-fg` (= `--paper`),
`--state-on-press` (#2A4F73, about 1.7:1 from navy: an ON tile pressed, and the floating add/account press), `--state-off-alpha` (.4). Design record and audit: `design/state-system/`
(sheet, README audit table, `stills.js`, `check.js`, stills in `stills/`).

| Meaning | Treatment | Applies to |
|---|---|---|
| Pressed (finger down) | `--state-press` fill, pressed IN, never dimmed | rows (already), header buttons (collapse, sort, filters, locate; 3px tile), city and category chips (unselected only), popup Mark Visited (`::before` tile, equal 6px inset on all sides), popup star (tile, 4px spread; the star's ink/rub animation is on the svg and untouched; the old scale .85 shrink is gone) |
| On / open / selected, then pressed | `--state-on-press` (open sort / filters held) | header sort and filters |
| On / open / selected | `--state-on-bg` tile, `--state-on-fg` glyph/text | sort open, filters open (`#toggleFiltersBtn.active`), selected city chip |
| Unavailable / loading | opacity `--state-off-alpha` | locate/sort loading, submit disabled (was .6) |
| Filled primary button, pressed | one tone step: submit DEEPENS (`--figure` to `--figure-deep`); floating add/account LIGHTEN (`--navy` to `--state-on-press`, was #1B3A57, now slightly lighter) | submit, floating add, account |
| Current item | figure-deep reversed block (row), check (sort menu) | unchanged |

Deliberate exceptions (unchanged): category chips keep the category rule
= on, dashed hairline = off (on is the default; 11 navy chips would shout);
star and visited toggles fill their own glyph. Open press order: `open`
rules come after `:active`, so pressing an open button keeps the navy tile.
Not done: floating add/account buttons still press to hard-coded `#1B3A57`
(off-token; needs an owner call). Checks: sorttest.js 77/77 (incl. popup-open
20/20), `check.js` 9/9, gesturediff.js identical to origin/main. The touch /
flip6 / vtest suites could not run (their helper files were never
committed).

Revision after CD 8/10: open-pressed variant added; popup star moved from shrink to the tile; Mark Visited tile got equal insets; loading verified at computed opacity 0.4 (settled past the .15s transition); collapse arrow shows its pressed tile (28px, the spine width, not 32). check.js 11/11, sorttest 77/77, gesturediff identical.

Second revision (CD 8/10 again): `--state-on-press` lightened to #2A4F73 (open-pressed now reads at 1x; paper glyph on it stays >=7:1); this also lightens the floating add/account press slightly. Fourth meaning added, filled primary buttons shift one tone step when pressed. The two directions differ on purpose and are flagged: the coral submit field can go deeper, the navy floating buttons cannot, so they lighten. Submit disabled text is `--ink` (was navy) at .4, a warm grey rather than blue-grey on the coral; it reads as unavailable, not broken.
