# Builder notes: add-tag-jam phase 1 (the list title, city sections, show/hide, collapse)

Branch `add-tag-p1` (from origin/main 90c396e). Not landed: the CD + UX check and the owner's look
at the stills come first (CLAUDE.md lane 2). Spec: `handoff.md` "Phase 1" + "One menu spec".

## Built (index.html)

- **Gone:** the city chips (`#cityFilters`, `createCitySelector()`, `updateCitySelectorUI()`), the
  Places | Plans switch (`#listSwitch`), the plan picker + slip (`#planPick`, `#planLedger`,
  `layoutPlanLedger()`, `renderPlanPanel()`), `#collapseBtn`, `syncLocationCards()` /
  `syncShapeCards()` (replaced by `syncPlacesList()`), `activeCityLabel()`. The filter panel holds the
  category chips only; its button is now "Filters".
- **Model:** `filters.city` is gone; `hiddenCities` (Set, `localStorage` `triplet.hiddenCities`,
  try/catch, empty = none). `visibleLocations()` / `visibleNeighborhoodShapes()` keep a place when
  its city is shown + the chips; a plan's stops always show. `setActiveCity()` is go-to only
  (frames, scrolls the list to the header via `pendingSectionScroll` / `applySectionScroll()`,
  unhides a hidden city unless `opts.reveal === false`). `goToCity()` switches to Places first.
- **Title** (`#titleBtn` > h2 `.h-name` + `.tally` + 12px chevron): `titleState()`. Places: the last
  go-to city + `cityTally()`, or "All places" + `shownTally()`; Plans: the plan + stop count, or
  "All plans" + plan count.
- **Title menu** (`#titleMenu.menu-box`, `#menuScrim`, body `.menu-open`): `openTitleMenu()`,
  `renderTitleMenu()`, `placeTitleMenu()`, `refreshTitleMenu()` (poll-safe: re-renders in place,
  keeps focus). Shared menu classes `.menu-box/.menu-row/.menu-ico/.menu-lab/.menu-end/.menu-cap`;
  the box reuses `#sortMenu`'s rule and `sortSlip`. Quiet last row swaps sides without closing.
- **City sections** (`syncPlacesList()`, `cityHeads`, `renderCityHead()`): keyed non-row nodes,
  section order = `sectionCityIds()` (CITIES order, then unknown ids), per-section sort (the global
  sort grouped), shapes after pins, `group-end` per section, `heldOrder()` unchanged. Header: Go to
  name button + eye (`setCityHidden()`); first header compact (`.is-first`); hidden = greyed name,
  closed eye, rows folded.
- **All plans** (`syncPlansList()`, `planListRows`): plan rows (route glyph, name, "n stops · A →
  B", ⋯ = today's Rename / Delete plan…, ›), New plan row / create form (`planPanel` reused).
  `setListView('plans')` reopens the remembered plan or All plans (no auto `plans[0]`); a deleted
  open plan falls back to All plans. Map: every plan's stops (`allPlanStopIds()`), `frameAllPlans()`.
- **Leg sections** (`syncPlanCards()`, `legHeads`, `renderLegHead()`, `currentLegs`, `frameLeg()`):
  broken where the stop's city changes; recurring city = its own header; no eye.
- **Stop rows:** the lead is the number only (15px 700, 85% width, 28px column); the category
  badge left the stop row (handoff "A plan").
- **Collapse tab** (`#collapseTab`, K2): on the sheet's top edge at the right, 44x24, ::before to 44
  tall, rotates 180 lowered, aria-label Lower/Raise the list; `#locations` border-top 1px --hair;
  `.leaflet-bottom.leaflet-right` margin-bottom 24px (0 on the rail; tab hidden on the rail).
- **Edge cases:** zero places "All places 0" (menu: All cities + quiet row); every city hidden =
  only greyed headers (no empty line); a place added into a hidden city reveals it (`revealCity()`
  in `addLocation()` / `addNeighborhoodShape()`).

## Decisions (mine, inside the spec's gaps) -- flag list in the hand-back

1. Menu placement on a real phone: 7 rows don't fit "44px below the sheet top" in a 300px sheet, so
   `placeTitleMenu()` opens it above the header band (sort menu's rule) when it doesn't fit below,
   and scrolls inside when neither side fits (many plans).
2. Plan rule caption "Add from <city>" became "Add from all places" (cities don't filter now).
3. Title for a city with no places at all (stale go-to, zero places) = "All places".
4. The collapsed sheet keeps its 60px band (header is now 52 + the 1px sheet rule; 7px of empty
   paper shows under it, list hidden) -- not re-plumbing the 60/240 constants shared by the +,
   the map height, the panel and TAG_LIST_MIN.
5. ⋯ on each plans-list row sits before the › (the spec moves it there; the stills don't draw it).
6. A restore at boot / first open / orphan cleanup doesn't unhide a hidden city (`reveal: false`);
   only the user's go-to does.
7. Zero plans keeps today's empty list ("No plans yet." + New plan button) instead of a lone New
   plan row.
8. Hiding the city of an open tag closes the tag (its pin leaves the map).

## Tests touched

- `design/gesture-harness/lib.js`: hides every other fixture city (`triplet.hiddenCities`) so the
  suites still read one city's 21 rows by index.
- `design/list-ordering/build/harness.js`, `design/plans-build/harness.js`: hide Malmö (the old
  Copenhagen chip).
- `design/impeccable-gate/driver.js`: same hiding; the `plans` state opens via the title menu.
- `plantest.js`: switch/picker/slip tests rewritten for the title menu + plans list; new H block
  (sections, hide/show + persistence, go-to scroll, section name, All cities, poll with the menu
  open, the tab, a recurring-city plan). Crash guards on `.slice(-1)[0].op`.
- `design/gesture-harness/plans.js`: opens the plan with `choosePlan()`; `shapes.js`: scrolls the
  shape row to the list's foot (hidden headers follow it now).
- `sorttest.js`: header 52, the ⇅ zone vs the title button (was vs the collapse arrow), the tab.

## Open gaps

- Impeccable runtime: 2 new low-contrast identities = the spec'd greyed hidden header (name at
  opacity .5 = 3.0:1, tally 2.2:1). Needs an owner waiver or a design change; no `--update` run.
- plantest S5: a 20-character plan name no longer fits the 18px title with its tally + chevron.
- plantest's harness runs in playground mode (since 2026-10-13), so ~25 write/poll tests fail on
  main too (backlog).
- During a stop drag across a leg header, the shifting rows move by one row height while headers
  stay put (approximate visuals; the drop index is right).

## Check fixes, batch A (2026-10-17; `design/add-tag-jam/checks/p1-cd-ux.md`)

1. **Drag across a leg header (blocker).** `attachStopDrag()`: the drop slot now comes from the
   lifted row's edges against the other stops' resting middles (list content y, so leg headers and
   the edge auto-scroll count), not `round(dy / h)`; every node between the old place and the slot --
   stop rows AND the leg headers between them -- shifts one row height (`.sec-head.plan-shift` gets
   the rows' 150ms transition), so the preview gap is exactly the drop index. New plans.js cases:
   across a header near the top, up from the list's foot, down at the foot with auto-scroll; all
   three fail on the previous commit and pass now. Limitation kept: the preview shows the index;
   if the drop makes or merges a leg, the headers re-form after the drop.
2. **Title for a hidden go-to city** falls back to "All places" + the shown count (0 with every city
   hidden) -- `titleState()` checks `cityShown()`. Section and menu tallies are unchanged.
3. **Targets:** the title button's ::before covers the whole 52px band from the screen edge to the
   ⇅ zone (the ⇅ zone keeps the 12px gap). The section eye already answered 44x44 through its
   ::before (now asserted by plantest H12b).
4. **a11y:** `<h2><button id="titleBtn">` (was a heading inside the button) with a `.title-text`
   span; section and leg names sit in `<h3 class="sec-title">`; the eye drops `aria-pressed` and
   keeps its Show/Hide label (the name's label adds ", hidden"). No visual change: the stills
   re-shoot pixel-identical except 09 (the title now reads "All places 0").

## Batch B: the approved looks (2026-10-17; handoff addendum "Phase 1 fixes (after build check)")

Took the designer's prototype `design-p1-fixes` (ce4586b, a fast-forward of add-tag-p1) and cleaned
it: the plans list's acting/renaming modes, `.plan-more`, `planEmptyBtn` / `planEmptyLine2` /
`wantNew` and the `.plan-empty-*` CSS are deleted (not stubbed); the hidden add-from tally is
`addableTally()`; the break caption escapes its category text; the prototype's "p1-fixes vN"
comment tags became plain comments. One bug fixed on top: `renderTitle()` ran before the
`plan-none` class toggled, so a plan title was fitted with ⇅ hidden and then CSS-ellipsized a
second time (18px "…"-to-tally gap); it now runs after the classes (9.6px, as an uncut name).
Tests: plantest K block (menu box locked / raised-sheet top / hidden / separators; add-from
sections, shared eye, tap-name stays in plan, hidden tally; the break), W4-W8 through the plan
foot, E1/L7 zero plans, H6 compact landing (-16px), title reads use the button's full label (a
long name is cut on screen); N5 closes by the scrim (the menu covers the title now).

# Phase 2: the add tag (2026-10-17; branch `add-tag-p2` from main 6e0b3bf3; NOT LANDED)

Spec: `handoff.md` "Phase 2" (systems + visual), "One menu spec", the Phase 3 visual for the city
menu / NEW stamp / distance note, and the blank-tag form
(`../add-button-placement/concepts/blank-tag-form/how-it-works.md` rounds 8b-12c). Operator's scope
call: build the new tag whole, not a retrofit of `#addForm`.

## What's built
- **The tag** (`#addForm`, body level, z 1500): a fixed card made of the Hanging Tag's own parts
  (`.tag-body/.tag-stock/.tag-patch/.tag-x/.tag-in/.tag-stub/.tag-string`, `.tag-band` when
  starred), so the die-cut, eyelet, notches, shadow and stub are the shipped ones. Not a Leaflet
  popup (round 9/10b's "card in the screen's frame"): `placeAddTag()` puts its centre 45% down the
  open map (below the top controls + 8, above the credit - 6, the pin kept inside); with the
  keyboard up (visualViewport 120px+ short) and NAME focused, or NOTES covered, it docks under the
  top controls; docked with a place it is `.is-lifted` (pin + string hidden, map still).
- **The wash** (`#addWash`, inside the map container, z 750: over the panes, under the controls and
  credit): `--paper` 78% while there is no place; 200ms fade (reduced motion: snap). It stays as a
  transparent blocker for as long as the tag is up, so a drag/pinch can never move the place out
  from under the pin. Zoom buttons work: `zoomend` re-aligns (zooms about the place).
- **The pick** (`selectAddress()`): name, display_name (stored as `address`), the short address
  (shown), the OSM pair, osm_type/id; TYPE via `osmToType()` unless `typeHand`; city via
  `guessCity()` unless `cityHand`; then `alignMapToPin()` (a `setView` with no animation at zoom
  max(current, 16; shapes 14)), then the wash lifts. Editing NAME voids the pick (`voidAddPick()`).
- **Search** (`searchAddress()`): `currentSearchCityConfig()` = the map's bounds as a soft viewbox,
  no suffix / countrycodes / bounded (so `nominatimWithFallback()` never widens); results
  re-sorted by `rankSearchResults()` (map view padded 25% -> within 75 km of a city -> rest, each
  by distance); rows print name + "type · Town, Country" (`resultWhere()`), results in an opaque
  panel inside the tag from under NAME's rule to the tag's foot (`#addResults`), keyboard-navigable.
- **TYPE** (`OSM_TYPE_TABLE`, jam Turn 11 + the director's pool/sports-centre/water-park rows):
  `highway=*` -> Street except point features (bus_stop, crossing, platform...);
  `boundary=administrative` with a sub-city addresstype -> District. The trigger + the menu
  (caption "Type", 20px badges, check right); the pin above the tag follows it.
- **The city**: routing line (`#addCityBtn`), the menu (caption "City", the current city with the
  pin glyph + check, the others spaced, then "New city" + "+ {real town}" when the pick's town
  isn't one of your cities), the NEW stamp, the distance note (`addDistanceText()`).
- **ADD** (`submitAddTag()`): pins need a pick; shapes need a name. A NEW city: 
  `deriveNewCityConfig()` + `addCity()` first; fail -> error line, nothing inserted. Inserts carry
  `visited` (pins and shapes). `addLocation()` / `addNeighborhoodShape()` now return true/false; on
  false the tag stays with "Couldn't save — try again. Nothing is lost." Shapes: Nominatim
  `/lookup` by the pick's OSM id first (polygon / line), else the old name searches near the pick
  (bounded ±0.15°) or in the line's city; no outline -> the approx pin at the pick (or
  `findApproximatePoint()`). Saved: `finishAdd()` clears the draft, the list comes back, and the
  new place's tag opens through its row's tap path.
- **Cancel** (×, Esc; Esc closes a menu / the results first): the map view jumps back (guarded
  from the zoomend re-align), the list and the previously open tag come back, the draft is kept.
- **Gone:** `#controls`, the old form CSS/markup, `#cityInput`, `#categoryInput`, `#starInput`
  (`.form-star*`), `#newCityConfirm`, `#shapeCityConfirm` (+ JS), `#addressAutocomplete` /
  `fitAutocomplete()`, `geocode()`, `maybeDetectCity()`, `populateCityInput()`, `formCityId()`,
  `defaultFormCity()` (its rule lives on in `preGuessCity()`), `syncAddCredit()`'s form math.
- **Tokens added:** `--paper-rgb`, `--navy-rgb`, `--brand-orange-deep-rgb` (channels of existing
  colours: the wash, ADD saving, the NEW stamp's 88%).

## Decisions (builder; flagged in the hand-back)
- Pencil entries are flat `--ink-2` (the boards' look), not the concept's textured graphite.
- "NAME IT FIRST" under a not-ready ADD at 11px (the concept's 9px failed Impeccable's floor).
- NOTES writes at 16px (iOS no-zoom floor), not the tag's 14.
- The TYPE menu keeps a fixed order (the old select's), scrolling the current row into view; the
  board listed the current type first.
- Before a pick with no cities at all, the routing line is empty (kept height); after the pick
  it's the real town, NEW.
- `userOverrodeType`/`cityHand` reset when the draft clears (a successful ADD), not on every open,
  because the draft (incl. hand picks) survives a cancel.
- ADD snaps to the new place's own tag (no ink-over): the jam handoff names no ADD motion.

## Open / for the owner
- Can't rename a picked place before ADD (editing NAME voids the pick) -> backlog.
- Distance-first ranking can rank a bus stop above the landmark ("Harpa") -> backlog.
- No pre-ADD district outline -> backlog.
- Keyboard docking, the hidden jump and focus-in-the-tap are iPhone checks (Chromium has no
  keyboard).

## Checks
- `design/add-tag-jam/p2/addtest.js` (48 cases, live-search fixtures in `p2/fixtures/`).
- Stills: `design/add-tag-jam/stills/build-p2/stills.js`.

## Phase 2, batch A: the CD + UX check's fixes (2026-10-17; `checks/p2-cd-ux.md`)
1. **NAME edit keeps the pick** (W1/W2 blocker): `voidAddPick()` is gone; typing only re-runs the
   results; the typed name is saved (D7 saves "Sundhöllin" at Sundhöll's place).
2. **Address hits** (`resultName(r, query)`, `isAddressHit()`): a nameless house/building is named
   "road number" (number-first countries as `deriveShortAddress()`), else from the typed text; an
   address hit, or a street/building found for a typed house number, is never Street/District.
3. **Quiet search** (`cityRegions()`, `searchNearCities()`): no result near the map or a city ->
   one bounded search per other region (1/s), merged, re-ranked. A countrycodes-only retry was
   tried first and didn't find Noma; bounded boxes do.
4. `accept-language=en` on search, reverse and lookup (a URL parameter). Fixtures re-fetched with
   a generic UA (`p2/fetch-fixtures.sh`, with the tests' view as the soft viewbox).
5. **TYPE table**: water:*, leisure beach -> Nature; leisure resort/beach_resort/spa/sauna, amenity
   public_bath/spa -> Attraction (flag: a resort could be a hotel; the Blue Lagoon's lake row is
   Nature, its resort row Attraction). No match / address hit -> Other (an existing category).
6. `townOf()` skips admin names; `deriveNewCityConfig()` uses it.
7. Ranking: importance inside a tier; duplicates merged (same OSM object, or same name + kind
   within 50 m).
8. **District outline before ADD** (`syncAddOutline()`): /lookup at the pick, drawn with
   `neighborhoodStyle()`, removed when TYPE leaves District/Street or the tag closes; ADD reuses it.
   Vesterbro's top hit is a node (no outline); Sund's is a relation.
9. a11y: "Type: X" button name; "new city" in the city button's name; `aria-describedby="addDist"`;
   `placeAddMenu()` re-fits on window / visualViewport resize (the menu no longer closes on resize).
Left for batch B (designer): result-row type words, "NAME IT FIRST", District's address slot,
TYPE menu fit, the Street/District pin, the TYPE trigger's weight.
Checks: addtest 66/66; Impeccable PASSED; stills re-shot (+ `10b-district-outline.png`).
