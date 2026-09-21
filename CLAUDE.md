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

## Open items (as of 2026-09-21)

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

**Needs the user's action:**
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

**Known minor bugs:** none currently tracked. (Previously: `showError()`/
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
