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
  content.

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
