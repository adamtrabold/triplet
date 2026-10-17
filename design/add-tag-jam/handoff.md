# Add tag + city jam: handoff

Owner: "Great to build". Decided boards: the canvas's **Now** page
(https://claude.ai/artifact/6aSGgGczYGfWGP1UqTDGP3, index
`project/canvas.json`; green "Decided" notes). Quotes: `owner.md`.
Model: `jobs.md`, `jam.md` Turns 1-11, and
`../trip-location-model/concepts/5-city-buckets-trip-tags.md` (trips
dropped).

## How it works (systems)

Four phases, each landing on its own, in this order. **(We think)**
marks a team call the builder may raise; everything else is decided.
Function names are today's `index.html`.

**Before phase 2, one scope fact.** Today's add form is the plain
`#addForm` (a City `<select>` first, Category `<select>`, Name, Address,
Notes, STAR, "Add Location"). **The add tag on the canvas is not built.**
It's the blank-tag form designed in
`../add-button-placement/concepts/blank-tag-form/how-it-works.md`
(rounds 8b-12c: the card, the dock, the wash, the pick). Phase 2 builds
it, with this jam's decisions replacing three of its parts:
- the city row becomes the routing line;
- the row of pins becomes the TYPE select;
- the search scope becomes worldwide.

If the owner wants these decisions on today's form first, phase 2
splits into 2a (today's form) and 2b (the tag shell). That's the
operator's call to raise.

**DB summary: no migration in any phase.** Every write uses existing
columns and today's RLS. The new writes are listed per phase.
**Gesture-sensitive:** phase 1 (the row list's structure) and phase 3
(the Hanging Tag). Each runs `design/gesture-harness/run-all.sh` once
at its end.

---

### Phase 1: the list title, city sections, show/hide, collapse

**Gesture-sensitive** (section headers enter the row list). No DB.

**What goes:**
- the city chips (`#cityFilters`, `createCitySelector()`,
  `updateCitySelectorUI()`);
- the Places | Plans switch (`#listSwitch`);
- the plan picker and its slip (`#planPick`, `#planLedger`,
  `layoutPlanLedger()`, `sizeFiltersPanel()`'s picker term).

The filter panel keeps the category chips and anything else not named
here.

**The model change: "go to" and "hide" come apart.**
- `filters.city` (one city, a filter) is replaced by
  `filters.hiddenCities` (a Set of city ids).
  - `visibleLocations()` and `visibleNeighborhoodShapes()` keep a place
    when `!hiddenCities.has(city)`, plus the category test.
  - Plans' branch is unchanged: a plan's stops always show, hidden or
    not.
- **Going to a city never filters.**
  - `setActiveCity()` becomes go-to only: `focusCity()` plus scrolling
    the list to that city's header. It stops writing `filters.city`.
  - `citySelection` / `CITY_STORAGE_KEY` stay as "the last go-to", for
    the title and for the boot frame.
- **Hidden cities persist per viewer** in `localStorage`
  (`triplet.hiddenCities`). Wrap reads and writes in try/catch; an
  empty store means none are hidden.
- **Going to a hidden city shows it again** (decided). This also covers
  picking it in the menu.

**The list title (`#locationsHeader h2`, written in `updateUI()`):**

| State | Title | The list | The map |
|---|---|---|---|
| Places, last go-to = All | "All places" + tally (every shown place) | every shown place, in city sections | as today's all-cities fit |
| Places, went to Reykjavík | "Reykjavík" + its tally | **the same full list**, scrolled to Reykjavík's header; nothing hidden | `focusCity('reykjavik')` |
| Plans, All plans | "All plans" + tally (plan count) | the plans list (below) | frames every plan's stops; none → as Places |
| Plans, a plan open | the plan's name + its stop tally | its stops in stop order, in **leg sections**; then the addable places (today's `planOthers()` block) | `frameActivePlan()` |

- **Tapping the title opens the menu.** It opens straight onto the
  current kind's items (decided: "the menu opens on the items; a quiet
  bottom row switches").
  - **Places:**
    - All cities + tally;
    - each city + tally, with a hidden one repeating the closed eye on
      the right;
    - then the quiet last row, "Plans 3 ›".
  - **Plans:**
    - All plans + tally;
    - each plan + its stop tally;
    - New plan;
    - then the quiet last row, "Places 202 ›".
  - The last row swaps the menu to the other kind **without closing it**.
    Picking an item closes it.
- **The title doesn't follow panning (we think).** It names the last
  pick. Picking "All cities" titles "All places". It's a go-to label,
  not a claim about the viewport. UX may revisit.
- `setListView()` / `choosePlan()` stay the state writers.
  - `setListView('plans')` no longer auto-opens `plans[0]`: with no
    plan picked it shows All plans.
  - Each kind remembers its last item (`triplet.listView`,
    `triplet.activePlan`, plus the go-to city).

**City sections (Places):**
- One header per city that has a shown place matching the category
  chips, or that is hidden.
- **The header:**
  - the name: tapping it goes to the city;
  - the quiet tally: the city's places matching the category chips,
    shapes included;
  - the eye: hide/show.
- **Hidden = H1:** the header stays in its place, greyed, with the eye
  closed and its rows folded away. Tap the eye to show the city.
- **Section order (we think):** stable, in the menu's order (today's
  `CITIES` order, new cities appended). It never re-orders while you
  pan.
- **Inside a section:**
  - today's sort (`sortLocations()` / `heldOrder()`), applied per
    section;
  - shapes keep their block after the pins, as today.
- A city with no matching place and not hidden has no header. It's still
  in the menu.
- **`syncLocationCards()`** must reconcile headers as keyed non-row
  nodes:
  - rows stay `createCard`/`renderCard` rows at 56.00px;
  - `heldOrder()` still holds a dragged row;
  - the scroll-preservation rules still hold;
  - a header is never a gesture target.
- **List rows' tap-to-navigate is unchanged** (CLAUDE.md).

**The plans list (Plans, All plans):**
- One row per plan: name, "3 stops · Reykjavík" (its cities in stop
  order, "Copenhagen → Malmö"), and ›.
- Tapping a row calls `choosePlan()`. New plan is the last row (today's
  create form).
- **Rename and delete keep a home:** today's `.plan-more` (⋯) moves onto
  each plans-list row, with the same Rename / "Delete plan…" actions.
- With the tables missing or offline, the list shows today's labels
  ("Not set up yet", "Offline").

**Leg sections (a plan open):**
- The stops in stop order, broken where the stop's city changes.
- Each break gets a header: the city, plus that leg's stop tally. Tapping
  it frames that leg's stops.
- No eye: a stop is never hidden.
- A city can recur (Reykjavík → Golden Circle → Reykjavík). That gives
  two Reykjavík legs, each its own header.
- Plan stop rows' gestures (number, 400ms hold, × / +) are unchanged.
- The addable places below keep today's block, unsectioned (we think).

**Collapse:**
- The ▲/▼ leaves the list header. It becomes the K2 tab: icon only, on
  the sheet's top edge at the right, so it clears the + bottom-left.
- It calls the same `toggleSheetCollapsed()`; `#collapseBtn` moves into
  the tab.
- The map's credit line sits above the tab.
- The list gets the tab's subtle top border.
- The tag-open rules in `toggleSheetCollapsed()` are unchanged.

**Edge cases:**
- **Zero places:** the title is "All places 0"; the menu holds All cities
  and the quiet row.
- **Every city hidden:** the list holds only greyed headers.
- **A category chip off:** section tallies and the title's tally follow
  it. Hidden cities' headers stay.
- **The add form opened while a city is hidden, and the new place lands
  there:** adding into a hidden city shows that city (jobs.md 12; we
  think), or the new place would vanish on ADD.
- **The poll tick** re-renders without moving the scroll, or the open
  menu.
- **Checks:**
  - the full gesture gate: star "84 + 8 (+ N8-a)", vtest, popup-open,
    rows 56.00px, curve8, plan-rows, delete-slop;
  - plantest, sorttest, places-ux;
  - the Impeccable gate.
  - `places-ux` and `plantest` will need updates for the removed chips
    and switch.

---

### Phase 2: the add tag

No migration. **Writes:** the insert now carries `visited` (and a new
city's `cities` row on ADD, via `addCity()`). Not gesture-sensitive (the
harness doesn't cover the add form). Smoke tests need live search: the
owner's browser, or the sandbox (Nominatim and Photon return 200 there
now; Overpass doesn't).

**The routing line (the city):**
- It's the tag's first line, left-aligned with the name and address, with
  no rule under it. The CITY row is gone.
- Tap it to change the city: a menu of your cities, then "New city · +
  <real town>".
- **The pin never moves:** the city is a filing, not a location.
- Before a pick, the line shows the city the guess would give for the
  map's centre (we think). After the pick, the guess runs (phase 3's
  rule).
- **A hand pick wins** for this add: today's `userOverrodeCity`,
  carried over.
- **The NEW stamp** sits inside the city dropdown, before the chevron.
  It appears exactly when the city is one ADD will make.
  - ADD calls `addCity()` first, then inserts.
  - Cancel makes nothing.
  - `#newCityConfirm` and `showNewCityConfirm()` go: there's no
    question.
  - If `addCity()` fails, ADD fails with today's write error, and
    nothing is inserted.
- **Shapes (District/Street):** the same line. `resolveShapeCity()` still
  votes, but the low-confidence dialog (`#shapeCityConfirm`) goes.
  Below `SHAPE_CITY_CONFIDENT_SHARE` the winner is the guess on the
  shape's centroid (phase 3's rule), shown on the line, changeable.

**The distance note:**
- Under the address line, like a form helper note: "≈ 40 km from
  Reykjavík".
- **When:** the place is outside its city's area, i.e. `pointInViewbox()`
  is false for the city's `viewbox` (no pad).
- **What:** `haversineKm()` to the city's `center`, rounded:
  - under 10 km, to 1 km;
  - otherwise to 5 km (we think).
- The same note shows on the edit tag and the Hanging Tag (phase 3),
  never on list rows.
- Inside the city: no note.
- It recomputes when the city is changed on the tag.

**TYPE as a select, auto-detected:**
- Closed, it shows the type's badge plus its word. Open, it's the one
  dropdown spec: natural width, dividers edge to edge, a left edge,
  the check at the right, opening just under its trigger. The pin above
  the tag follows it.
- **On a pick:** read the result's OSM pair and map it through one table
  (jam.md Turn 11). The pair is Nominatim `format=json` `class` /
  `type`, or Photon `osm_key` / `osm_value`. Stash it on the
  autocomplete row like `data-address-details`.
- **Decided:** a neighbourhood (`place=suburb|quarter|neighbourhood`) →
  District. That switches the save path (`isShapeCategory()`) to the
  shape flow, visibly, as TYPE District.
- **No match, or no class:** TYPE stays as it was. Never asks, never
  blocks.
- **A TYPE set by hand in this add is never overridden** (a
  `userOverrodeType` flag, reset when the tag opens).
- Shown plainly as the value, not marked as a guess.
- Category chips stay independent of this select (CLAUDE.md).

**Star and visited:**
- Unchanged in look and behaviour (the owner: "do not tuch"): the tag's
  own Star and Mark visited segments.
- **The one change:** `handleAddLocationSubmit()` and
  `handleAddShapeSubmit()` write `visited` from the segment instead of
  `visited: false`. Star already writes.

**Search (decided: worldwide, each result says where):**
- The city no longer scopes the search.
  - `currentSearchCityConfig()` stops reading `formCityId()`.
  - `nominatim()` drops `geocodeSuffix` and the `countrycodes` hard
    filter, and keeps the map's view as a soft `viewbox` hint.
  - `nominatimWithFallback()`'s widening becomes moot.
  - The `bounded` fallback goes.
- **Each result row** prints its name, then "type · Town, Country" (from
  `address` and the OSM pair).
- **Ranking (jam Turn 6, we think):** near the map first, then near any
  of your cities, then the rest. Re-sort client-side by distance.
- The Photon trial is on the backlog as an automated test (owner).

**Edge cases:**
- **Editing NAME after a pick** voids the pick, as in the blank-tag
  spec. City and TYPE stay as last set, and a hand pick stays a hand
  pick.
- **A pick in a hidden city** shows that city on ADD (phase 1).
- **The first place ever** (no cities): the guess is a new city, NEW
  stamped.
- **Shapes with no OSM outline** keep `findApproximatePoint()`. The city
  comes from the guess on that point.

---

### Phase 3: the city-bucket model (guess, edit, both truths)

**Writes, no migration:** `locations.city` and `neighborhood_shapes.city`
updated after adding. Both columns exist, and RLS already allows the two
owners' writes. **Gesture-sensitive:** the Hanging Tag (popup-open
20/20 must hold).

**The guess (replaces `matchCity()`'s box containment in
`maybeDetectCity()`):**
- The nearest city whose stored `center` is within **CITY_REACH_KM**
  (decided: about a day trip; **we think 70**, one constant, never a
  setting), using `rankCitiesByProximity(latlng, CITY_REACH_KM)[0]`.
  - Measured to the stored centre, so an empty city can still be
    guessed and a nearby place never duplicates it.
- **None within reach:** a new city, with `deriveNewCityConfig()` from
  the place's `address_details` (named from the real town), NEW-stamped
  (phase 2).
  - With no address details, use `nominatimReverse()` on the point.
    Failing that, the nearest city regardless of distance, not new (we
    think), so ADD is never blocked.
- `defaultFormCity()`'s 150 km and `detectCityContext()`'s 75 km stop
  deciding filing. They keep only the pre-pick display (phase 2) and
  the map context.
- **Seeded cities keep their boxes:** the box decides only the distance
  note.

**Editing a place's city after adding (owner, Q-D):**
- **Where:** the Hanging Tag (`buildPopupHtml()`) gets the same routing
  line as the add tag (the city, left-aligned, first line). Tap it to
  open the same city menu.
  - Picking a city writes `city` on the place: a new
    `setPlaceCity(key, cityId)`, built like `toggleLocationFlag()`
    (optimistic, `requireAuth()`, per-write rollback,
    `flagWritesInFlight`, both tables by row key).
  - "New city" there runs `addCity()` first.
- **Never edits trips:** there are none, and a city's grouping is never
  edited from a place.
- **After a move:**
  - the row moves to its new section;
  - the map pin doesn't move;
  - `cleanupOrphanCities()` runs as today, so an auto-added city left
    empty is removed;
  - an open plan is unaffected (stops point at places).
- Signed out or in the playground: today's sign-in slip
  (`showTagSlip()`).
- **There is no other place edit** (still future). The tag's other
  fields stay read-only.

**Both truths:**
- The city is the routing line. The real town stays in the address line
  (`tagAddress()` / `short_address`).
- The distance note (phase 2) shows when the place is outside its city.
- **59 of 202 places** have no `address_details`: they show the address
  line as today, and the note still works (it's coordinates only).

**Checks:**
- popup-open 20/20;
- the full gesture gate (the tag is a gesture surface);
- a new stub case for the city write and its rollback;
- the Impeccable gate.

---

### Phase 4: the map's city badge (the boxed label)

No DB. Not gesture-sensitive (map markers only; the list is
untouched).

- **What:** at zoomed-out levels, each **shown** city with at least one
  shown place gets one boxed label, its name plus the quiet tally, at
  its stored `center`.
- **When (we think):** below a new `CITY_BADGE_MAX_ZOOM` (about 8), in
  place of that city's clusters and pins. At or above it, today's
  clusters and pins (`SOLO_MIN_ZOOM`, `GLYPH_MIN_ZOOM` unchanged; don't
  duplicate them).
- **Tap:** go to that city: `focusCity()`, the same as the menu and the
  section header. The list scrolls to its header, and nothing is hidden.
- **Hidden cities:** no badge.
- **The count** follows the category chips, like the section tally.
- **Plans view:** no badges (we think). A plan's numbered stops show as
  today at every zoom.
- **Where:** `syncMarkers()` / `mapVisibleLocations()`. Badges are a
  zoom-gated **map layer** only, so list membership is unaffected
  (CLAUDE.md's viewport rule).
- **Checks:**
  - Impeccable;
  - a zoom sweep (badges ↔ clusters swap at one zoom, no flicker on
    pan);
  - one cluster-click check, which still lands at `SOLO_MIN_ZOOM`.

## How it looks and feels (visual)

*(The visual designer writes this section.)*
