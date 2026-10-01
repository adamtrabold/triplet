# Backlog

Moved from `CLAUDE.md` (2026-09-29; shipped/stale items cleaned the same
day). Keep it current: close items
as they ship (and record them in `docs/shipped.md`), add new ones as they
surface. `CLAUDE.md` carries a one-line summary of the priority items.

## Priority (owner-requested, next up)

Concept work already produced — the next crew should get the owner to
pick/redirect before building anything.

- **Popup star alignment with full content** (owner, 2026-09-29,
  verbatim: "I was never debating outline or not that was decided forever
  ago. No star unless it's been starred. What I need to fix is the
  alignment of the star in the pop up - it looks weird when all the content
  is in it."). Settled, not candidates: the list row shows a star only when
  starred (no always-visible or hollow star in the list). Open: the POPUP
  star's alignment when the popup has full content (long name, address,
  notes); includes the CD-deferred 41px empty gap above Get Directions in a
  bare popup (star-target geometry). **Active concept thread:
  `design/popup-star-alignment/`.** `design/star-alignment/` is history
  only: an earlier exploration (2026-09-28) that misframed the problem as
  an outline/list-row question, so its variants (reserved-column,
  dog-ear/stripe/action-cluster, corner badge, starred-only section, etc.)
  are not candidates.
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
- **Trips vs. cities restructure** (owner, 2026-09-23; trimmed
  2026-09-29). *The search bug is fixed:* search widens on a miss (see
  `docs/shipped.md`, "Search widens on a miss"). Owner: "When we expand
  cities vs trips and create the different structure maybe that should
  change. User should not have to select distance." Still open, as one
  piece of work:
  - **A trip entity.** A trip has an overarching location; the places on
    it may or may not be in one city (day trips, other towns, a stop en
    route). Today `cities` does double duty as both "where the trip is"
    and "where this place is".
  - **Filing friction a widened search now exposes:**
    - A pick outside every city box raises "Add <town>?", even for a day
      trip (e.g. Uppsala from Stockholm, Reykjanes from Reykjavík).
    - Dismissing it files the place under the map's city.
    - A result with no city/town/village in its address (a rural
      viewpoint) is filed silently under the map's city, even in another
      country.
    - A pin filed to a new city doesn't appear in the current city's list
      until you switch city.
  - **No distance setting** for the owner, per the quote above.
  - **Overpass street/node lookups** outside known city boxes (need a
    bbox).
  - **Constraint:** adding a place stays low-friction, with no forced
    city/trip picking.
  - Discovery: `design/trip-location-model/proposal.md`. Related: Phase 2
    "trip context (dates/closures)".
- **Plans: apply the migration, then the iPhone checks** (v3 built on
  branch `plans-v3-build`, see `docs/shipped.md` "Plans (v3 build)").
  **Blocker:** apply `supabase/migrations/20260929000000_add_plans.sql` to
  the live project (operator, after review); until then the Plans side says
  plans aren't available yet and nobody can create one. Then the owner's
  iPhone pass (`docs/iphone-checks.md`). Open for designer/UX at stage 2:
  the starred stop's name starts at 122px, not 96px (v3 §7 CD note); the
  build decisions listed in the shipped entry (reorder Undo copy, stamp at
  normal ink, chip framing). Owner question still open (v3 §4, owner-12):
  while following, should the map show every filter match (a, built) or only
  the plan (b)?

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

- **Plans follow-ups from the final review** (critics-final 9c5296e,
  `design/impeccable-gate/reviews/2026-10-01-6d3609c2c34d/REPORT.md`; not
  now): accessible names for map markers (numbered stop pins "Stop 2:
  Harpa", tag-bearing clusters "Cluster of 11, stops 1–3"; Places' pins have
  none either, WCAG 4.1.2); the error banner covers the account / + badges
  and zoom + for its 6s (check against main: likely existing behaviour);
  the star knock-out notch (existing Places); paper hex `#F2EBDD` hard-coded
  in JS-built SVG instead of `var(--paper)`; cluster tag numerals 10px at 1x
  (CD to judge on device).

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

- Impeccable gate follow-ups (`design/impeccable-gate/`): (1) 13 runtime
  baseline identities are "pre-existing, unreviewed" (10px category·city
  row meta, 10px popup "Get Directions"/"Mark Visited"/category, all-caps
  row meta): CD/owner to accept each with a reason or fix it. (2) The first
  full `--review` (17 critic commands) on `main` hasn't been run. (3) No
  PRODUCT.md/DESIGN.md: `/impeccable init` / `document` are owner decisions
  (they'd also feed the skill's context). (4) The design hook is not
  installed (harness config: owner decision). (5) #mainContent clip: check
  the add-form autocomplete dropdown isn't clipped (static baseline reason).

- State system shipped (see `docs/shipped.md`). Left open: floating
  add/account buttons' pressed fill is the off-token literal `#1B3A57`; map
  it to a token or leave it. Hover styles exist only on three menu items.
  Known polish (not restyled, from `design/state-system/README.md`): the
  popup star tile's right edge sits 4px from the popup title; the popup's
  right-side tiles (close x and Mark Visited) do not share a right edge. By
  design, not bugs: the row delete X has no pressed look (the row press is
  the feedback); hover is pointer-only (raised paper) and touch uses pressed.

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
- ~~Gesture test harness can't run~~ — **rebuilt** (2026-10-01) as
  `design/gesture-harness/`. One command, `design/gesture-harness/run-all.sh
  [index.html]`, about 15 minutes. It runs eight suites: touch (84),
  flip (8 plus a control that must fail), N8-a, vtest (p7's 95), popup-open
  20/20 per mode, dust, rows 56.00px, curve8, and the delete-slop sweep.
  It prints the gate line in CLAUDE.md's format.
  - Limits: Chromium only, emulated CDP touch, not iOS. Not rebuilt:
    `haptic8`/`tap8`/`ax8`, the 0/5,184 hand-off check, and p8's 18 extra
    vtest cases (never committed).
  - The old `test6.js`, `flip6.js` and `vtest.js` stay as history.
  - Its first run on `origin/main` (`9a53d71`) found the items below. Details
    are in `design/gesture-harness/README.md`, "Findings".
- **Visit swipe vs. its gate after `1ec21c2`** ("text now slides + FLIPs",
  merged after p8 without a gate run and absent from `docs/shipped.md`).
  - **V14:** on long names the sliding text runs up to ~23px into the
    bleeding stamp before the press. The text travels 56px; the stamp plus
    its gap to the X is ~76px.
  - **V15:** the final truncation now lands at release (FLIP), not on the
    press frame as `docs/shipped.md` says. The spec needs updating, or the
    code does.
  - ~~**D7, reduced motion only:**~~ **fixed** (`fix-d7`, 2026-10-01): a tap
    on the X right after an un-visit stroke deleted. See `docs/shipped.md`,
    swipe-left "Delete safety".
- **curve8 row reads 10/3, not 11/3**, in the rebuilt harness (30/30 runs).
  `STAR_POP` is unchanged since `48bb11e`. Its ≥1.3× window is 168.5ms =
  10.11 frames, so 11 depends on frame phase. Here the animation starts on a
  frame and the 12th sample lands 0.1ms late. Owner/CD call: keep ≥11, which
  then fails in this harness, or restate it.
- ~~**Android-only delete edge (Chromium probe, not gated):**~~ **fixed**
  (`fix-d7`, 2026-10-01): a 4–12px out-and-back wiggle on the X deleted,
  because the X's travel ignored touch `pointermove`s. Now gated in
  `delete.js` (36 cases). iOS still to check on a device.

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
- **Plans: route mapping.** Draw a plan's route between its stops, in order,
  on the map (walking route, or straight legs as a first cut), so the order
  of the journey reads from the map itself. Today the order shows only
  through the grey stop numbers: list numerals plus map tags, chosen by the
  owner as the interim "until we can do full mapping". When this ships,
  reconsider whether the numbers (list and map tags) are still needed or
  should change. Open questions: routing source (no OSM routing connector in
  the sandbox; the owner's browser only), cross-city legs, dense knots of
  stops, and a starting-point marker (the owner floated one).
- Plans, deferred from v3 §6: add a stop from a place's popup or straight
  from the add form; share a route to Maps; animate the default fit (the
  build jumps).
