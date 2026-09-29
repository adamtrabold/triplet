# Backlog

Moved from `CLAUDE.md` (2026-09-29; shipped/stale items cleaned the same
day). Keep it current: close items
as they ship (and record them in `docs/shipped.md`), add new ones as they
surface. `CLAUDE.md` carries a one-line summary of the priority items.

## Priority (owner-requested, next up)

Concept work already produced — the next crew should get the owner to
pick/redirect before building anything.

- **Star alignment looks off** (owner, 2026-09-28: "the star is looking
  weird either way" = alignment, in both the list row and the popup;
  "no clean alignment, no clean grid"). Includes the CD-deferred 41px
  empty gap above Get Directions in a bare popup (star-target geometry).
  Root cause: `.location-card.is-starred .row-main { padding-left: 26px }`
  only indents starred rows, so the name's x-position depends on starred
  state — no shared grid line with unstarred rows. **Three concept
  tracks already built and screenshotted, owner has NOT picked one:**
  `design/star-alignment/README.md` (scope note: the star's position is
  confirmed correct, only the reserved-space mechanism needs fixing —
  several wildcard variants explored relocating the star instead, which
  is off-scope, filed as history not candidates).
  - `concept-legacy/` — 3 reserved-column variants (nested-silent,
    nested-always, outer-column). Top pick: nested-silent.
  - `concept-wild-a/` — dog-ear, edge stripe, action-cluster star. Top
    pick: the stripe (least new risk, but not star-shaped).
  - `concept-wild-b/` — corner badge, starred-only section (no per-row
    glyph — cross-references list-ordering below), reserved-margin
    (independently converged on the same fix as concept-legacy), a
    typographic-only treatment (rejected, reopens a settled Pencil Star
    decision).
  Owner has seen the screenshots (sent via chat) but not yet said which
  to build.
- **List ordering is confusing** (owner, 2026-09-23: don't just pick a
  sort). **Concept work already produced, owner has NOT picked a final
  spec:** `design/list-ordering/proposal.md` — §§1-5 is the original
  single-sort analysis (superseded), §6 is the revision into **3
  selectable modes** (What's Left / Starred / Recent) per the owner's
  "options, not one hardcoded default" pushback, §6.7 is a correction:
  the picker can't be `#locationsHeader`'s `<h2>` (that's the live
  city+count label, not free real estate) — needs a fresh placement idea
  that still hits the owner's "whimsical but painfully minimal, feels
  inevitable" bar (their words, 2026-09-28) before anything is built.
  `design/list-ordering/concept/mockup.html`/`.png` is the (now-invalid)
  heading-picker mockup — useful as a reference for what NOT to do, not
  a starting point. "Starred first" is folded into the What's Left mode's
  tiebreak logic already, not a separate open question.
- **Visited pins have no map treatment** (owner, 2026-09-29, asked
  directly: "should visited places have a different treatment on the
  map itself"). **Concept work already produced,
  through a full UX-check + CD loop, scored 9/10, owner has NOT yet
  approved or redirected:** `design/visited-marker/concept/README.md`.
  Path taken: 4 initial options (A dotted rim, B receded field — tested
  and REJECTED, invisible at marker scale, direct evidence against
  porting list-row visual rationale unchanged — C checkmark tick,
  overlap issues, D opacity-only, can't rule out a "still loading"
  read) → owner reviewed the shipped list-stamp's dotted track live on
  their phone, found it "unintelligible" at real size, asked for a
  hybrid of B's receded field + a toned-down dotted rim → 3 dot-density
  hybrids tested at true 1x (not just 4x blowup), Hybrid 2 (12 dots)
  picked as the sweet spot → owner said tighten it further toward the
  real `.row-stamp` grammar (full-strength navy ink, not muted) →
  Round 3 (dots inside the rim) scored 6/10, rejected — collided with
  `badgeHtml()`'s glyph, a real legibility blocker not a dial → **Round 4
  (dots OUTSIDE the rim) scored 9/10, recommended** — sent to the owner
  as `stampring-truesize-restauranthotel.png`/`-shopping.png` (the risky
  hue)/`-starred.png` (checked against the existing star shoulder, no
  collision). Two things explicitly flagged as still open for perfection
  stage, not assumed fine: real-tile legibility (sandbox can't render
  live tiles) and whether the outer-ring treatment extends cleanly to
  cluster badges (the existing "recede only if ALL members visited" rule
  is separate and untouched). This is concept-stage sign-off only —
  nothing built. The owner's last read on this whole thread: "these
  aren't even following good design principles at this point" — treat
  that as a real signal to look at Round 4 with fresh, skeptical eyes,
  not to assume it's a done deal.
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

- **Ghost the VISITED stamp in the popup** (owner, 2026-09-28; promoted
  from the old "popup mini-stamp" follow-up). Once a place is marked
  visited, a ghosted VISITED stamp should appear somewhere in the popup
  card, so the popup carries the same "been here" mark as the list row.
  Problem for the team: where it sits (without crowding the p8 layout —
  title/star, notes, Get Directions button, category + Mark Visited row),
  how ghosted (it must read as a mark, not a disabled state), whether it
  reuses the shipped `.row-stamp` geometry/tilt/ink, and whether the
  popup's Mark Visited toggle animates it (bleed + press / lift, like the
  row). New idea → concept stage first.

## Data cleanup (neighborhood shapes)

- `copenhagen-nyboder` (Nyboder) and `stockholm-gamla-stan` (Gamla Stan)
  should now resolve automatically as approximate pins via
  `findApproximatePoint()`'s fallback chain (see Architecture in `CLAUDE.md`) next
  time they're added through the live form or the bulk tool — not yet
  verified against the real Nominatim/Overpass response, same environment
  constraint as everything else needing live OSM access. If both fallback
  tiers genuinely come up empty for either, manual tracing via geojson.io is
  still the last resort.

## Known minor bugs / follow-ups

- Delete X's effective tap zone extends ~9–12px left of its 28px box via
  browser touch adjustment (measured in Chromium on today's unvisited
  rows; iOS unmeasured — its hit-testing may favor the clickable row
  more). Pre-existing, not caused by the stamp. Since the swipe-visit
  round, delete also needs a near-still tap (`DELETE_TAP_SLOP` 4px), and
  `confirm()` is the backstop. If mis-deletes are still reported, the next move is
  shrinking/relocating delete, not more stamp margin.
- Many `locations.name` values redundantly end in the city already shown
  in `.row-meta` (e.g. "Mother restaurant Copenhagen") — trimming them is
  a data cleanup that would win back truncation room on visited rows.
- Shape rows (districts/streets) have no visited state, so they always
  stay forward on `--paper` — late in the trip they'll be the brightest
  rows and can't be cleared. Known consequence of the visited-row field;
  don't tint shapes to fake it. Resolved properly only if shapes gain a
  `visited` column (see the street/district popup item below).
- Street/district popups lag behind pin popups (owner-reported
  2026-09-23). `buildNeighborhoodLayer()` binds a bare
  `<strong>label</strong><p>note</p>` string, while pins get
  `buildPopupHtml()` (p8 layout): title row with the star, address/notes,
  the Get Directions text link, then a bottom row of category glyph +
  label (left) and Mark Visited (right). Gaps to
  resolve: no category/type header, none of the popup typography classes,
  no visited toggle, no directions. Visited needs a schema change first —
  `neighborhood_shapes` has no `visited` column (checked 2026-09-23:
  id, city, type, label, color, note, min_zoom, geometry, created_at), and
  the shape list rows (`createShapeCard()`) would need the stamp too.
  Directions were deliberately excluded for shapes when that feature
  shipped (no single natural destination point); revisit with a centroid
  or nearest-point destination, or keep excluded on purpose. Needs a
  Design/UX/CD pass rather than a straight port.
- Closed filters panel's chips stay focusable: in a Safari tab a
  keyboard/VoiceOver focus there scroll-then-snaps (UX should-fix from the
  sheet round, 2026-09-28). Cosmetic; fix is making the closed panel
  `inert`. Not done as of 2026-09-29.
- Popup → row replays (`ssReplay`/`vsReplay`) treat a row hidden behind
  the Safari toolbar as on screen (they test against the list's rect,
  which extends behind the toolbar), so the replay can play unseen.
  Carried over from the sheet round's `maybeTeachStar()` follow-up;
  cosmetic.
- Header visited count ("12/38 visited" in `updateUI()`'s
  `${activeCityLabel()} list (...)` text) — deferred in the delete-only
  list-row round to get its own review; still not built.

Previously tracked and fixed: `showError()`/
`hideError()` banner masking, and `slugifyCityId()` not decomposing Nordic
`ø`/`æ`/`å`/`þ`/`ð` — both fixed 2026-09-19. `showError`/`hideError` now
take a `source` tag and only a matching source's `hideError()` clears the
banner; `slugifyCityId()` (and the bulk tool's mirrored `slugify()`)
explicitly map those five letters before the generic NFD strip.


## Deferred roadmap (not started)

- Phase 2 — trip context (dates/closures) and shared traits (kid-friendly,
  vegetarian, etc.) across both pins and shapes.
- SRI hashing on the CDN script tags.
- Nominatim autocomplete-while-typing (currently only fires on submit).
