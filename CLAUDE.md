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

**Not yet merged:**
- `claude/visited-btn-and-city-cleanup` branch — visited-checkbox CSS fix
  + orphan-city cleanup, pushed but still awaiting the owner's own
  merge/review decision (unrelated to the marker work above).

**Queued next (ready to start) — "Get Directions" button:**
A button (per pin, likely on the map popup and/or the location card) that
opens the device's native maps app pre-loaded with directions to that
pin's coordinates — the owner is primarily on an iPhone. Explicitly
requested to go through the same design agent + UX expert agent + CD
review loop used for the marker-size work — that work has now shipped, so
this is unblocked. Nothing has been designed yet — open questions for
that loop to resolve: which URL scheme(s) to target (Apple Maps `maps://`/
`https://maps.apple.com/?daddr=`, a `geo:` intent for Android, a Google
Maps universal link as a fallback — this app has no platform detection
today, so "opens in maps on my phone" needs a decision on how that
resolves cross-platform, not just for iOS), where the button lives (map
popup only, list card only, both), and how it fits the existing
click-to-navigate/highlight interaction without conflicting with it.

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
