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

Approved to build (owner: "Great to build"). These are the exact values for
every decided state, set in phases 1–4 like the systems section. Each value
comes from the canvas board named in brackets.

- **Canvas:** https://claude.ai/artifact/6aSGgGczYGfWGP1UqTDGP3, page **Now**.
- **Board sources:** each board's full HTML is the artifact file
  `project/<Board>.dc.html`. Read it with the Artifact tool, `action: "read"`,
  `path: "project/<Board>.dc.html"`. Ignore the blue NEW outlines and tabs:
  they're a canvas-only marker, off by default.
- **Phone stills:** `design/add-tag-jam/stills/places-plans/`.
- **End-of-design snapshot:** `design/add-tag-jam/snapshots/2-end-design-decided.png`.

**How to read the values.**

- **Tokens:** every colour is an existing `:root` token in `index.html`. No new colours.
- **Type:** all of it is `--font-ui` (Archivo). "Caps" means `font-stretch:75%`,
  `text-transform:uppercase`, `font-weight:700`.
- **Tally:** the count after a name, one treatment everywhere.
  - `margin-left:.45em`, `font-size:.8em` (11px in section headers), 700, `letter-spacing:.06em`.
  - `color:var(--ink-2)`, `font-variant-numeric:tabular-nums`. No brackets.
  - [SectionHeaders]
- **Motion:** only where stated below. Everything else snaps.
  - Every new motion sits behind `prefers-reduced-motion: no-preference`, as `#sortMenu.opening` does.
  - The visited stamp/sticker and the Star/Visited stub are untouched (owner: "do not tuch").

### One menu spec (used in phases 1–3)

Every new menu is `#sortMenu`'s box and row voice. Build it once as a shared
class and reuse it.

**Box.**

- `background:var(--paper-raised)`, `border:1px solid var(--navy)`, `border-radius:2px`.
- `box-shadow:2px 2px 0 var(--navy)`, `overflow:hidden`.
- `width:max-content`, `min-width:200px` (the title menu is 248px).
- It opens just under its trigger, left-aligned with it.
- Scrim, attribution-hiding and outside-tap close: the same as sort.
- Opening motion: the existing `sortSlip`, 140ms `cubic-bezier(.2,.8,.3,1)`.

**Caption** (optional; the title menu has none).

- 24px tall, `padding:0 var(--s3)`, `border-bottom:1px solid var(--navy)`.
- Caps 10/12, `letter-spacing:.12em`, `var(--ink-2)`.
- A mid-menu caption ("New city") also gets `border-top:1px solid var(--hair)`.

**Row.**

- Box: `display:flex; align-items:center; gap:var(--s2)`, `height:40px`, `padding:0 var(--s3)`.
- Rule: `border-bottom:1px solid var(--hair)`. The last row keeps its rule too, so every row centres the same way.
- Hit area: 44px, from the same `::before` −2px trick as `.sort-opt`.
- Label: caps 13/16, `letter-spacing:.05em`, `var(--navy)`, plus **`position:relative; top:1px`**.
  - That 1px is the optical centring the owner asked for ("icon alignment isn't centered").
  - Without it, caps sit 1.4px high against the icons. Measured result: icon, text and check centres within 0.4px.
- Pressed and focus: as `.sort-opt`.

**Icon column.**

- A 16px leading slot on every row, `flex:none`.
- A row with no icon ("All cities", "All plans") gets an empty 16px spacer, so all text shares one left edge.
- The TYPE menu uses its 20px category badges here instead.

**Right slot.**

- A 16px slot.
- The current item gets a check: `viewBox 0 0 16 16`, path `M3 7.75l3.2 3.2L13 4.05`, stroke `var(--navy)` 1.5, no fill.
  - Note the 7.75: this check sits 0.75px higher than a naive one, to centre it.
- A hidden city gets the closed eye at 16px instead (Phase 1, Hide / show).
- Otherwise the slot is empty.

**Glyphs** (all 24-unit viewBox at 16px, `var(--navy)`).

- **City ring:** circle r8, stroke 2, plus a dot r2.5 filled.
- **Plan route:** two r2.6 rings at (6,6) and (18,18), stroke 2, joined by `M8.5 6h5a3 3 0 0 1 0 6h-3a3 3 0 0 0 0 6h5`, round caps.
- **Plus:** `M12 5v14M5 12h14`, stroke 2, round caps.
- **Row chevron ›:** 16px, path `M6 3.5l4.5 4.5L6 12.5`, stroke 1.6, round caps and joins.

---

### Phase 1 · List title, city sections, show/hide, collapse

**List header** (`#locationsHeader`) [ListHeaderType, decided "one step up, 18px"]

- `min-height:52px` (was 56), `padding:9px var(--gutter)`. The 1px `var(--hair)` rule below stays.
- h2: **18px/22px** (was 15/20), caps, `letter-spacing:.08em`, tabular-nums, ellipsis.
- The sort, filters and locate icons are unchanged.

**Title button** [PlacesPlansKinds]

- The h2 becomes a `<button aria-haspopup="menu" aria-expanded>`: `display:flex; align-items:center; gap:6px`, then the tally, then a 12px chevron.
  - Chevron: path `M3 4.5L6 7.5L9 4.5`, stroke `var(--navy)` 1.6, round caps.
- The title reads only what is shown, never "Places" or "Plans":
  - "Reykjavík 23", "All places 202", "Golden Circle 3" or "All plans 3".
  - Owner: "Places/plans does not need to be in the list header".

**Title menu** [PlacesPlansKinds, decided; stills `2-places-menu-quiet-row.png`, `3-plans-menu-quiet-row.png`]

- Box: the menu spec at `min-width:248px`, left edge on the gutter (16px), top 44px below the sheet's top edge. It overlaps the header band's lower 8px, as drawn.
- It has no caption and no switch on top: it opens straight onto the items.
- **Places side:**
  - "All cities 202": spacer, no icon.
  - Then each city: ring glyph, name and tally. The current one gets the check; a hidden one is dimmed (see Hide / show below).
  - Last, the **quiet row** "Plans 3 ›": route glyph, caps label and tally, a flex gap, then the row chevron ›.
- **Plans side:**
  - "All plans 3": spacer.
  - Each plan: route glyph, name and its stop tally. The current one gets the check.
  - "New plan": plus glyph.
  - Last, the quiet row "Places 202 ›" with the ring glyph.
- The quiet row is a plain row: no fill, no extra top rule. Tapping it swaps the menu's contents in place, with no animation.

**What each choice shows** [PlacesPlansKinds stills 1, 4, 5]

- **A city:** the title becomes the city. The list stays whole and scrolls to that city's section; the map moves. Nothing hides.
- **A plan:** the title becomes the plan. The list shows its stops, grouped by city in stop order.
  - Each stop row's lead is its number: 28px column, centred, 15px 700, `font-stretch:85%`, `var(--ink-2)`.
- **All plans:** one row per plan.
  - Lead: the route glyph at 22px, in the 28px column.
  - h3: the plan name. Meta: "3 stops · Reykjavík".
  - Trailing: › at 16px `var(--ink-2)`, instead of ×.
  - Last, "New plan": the plus glyph in the 28px column, caps 13 `.05em` `var(--navy)`, `min-height:56px`.

**City section header** [SectionSeparate, SectionHeaders, GoToSections; decided "air above, light rule"]

- Layout: `display:grid; grid-template-columns:1fr 28px; column-gap:var(--gap); align-items:end`.
- Size: `height:60px`, `padding:0 var(--gutter) 6px 18px`.
- Ground: `background:var(--paper)`, **`border-bottom:2px solid var(--hair)`**. No band, no navy rule.
- The 18px left edge lines the name up with the row badges' left edge (16 + (28−24)/2).
- **Name** is a `<button aria-label="Go to {city}">`, 32px tall, `align-items:flex-end`, `padding-bottom:4px`.
  - Caps 12/14, `letter-spacing:.12em`, `var(--navy)`, with an 11px tally.
- **Eye** is a `<button aria-label="Hide {city}">`, 28×32, holding the 20px eye:
  - outline `M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z`, stroke `var(--ink-2)` 2;
  - a pupil r2.8 filled `var(--ink-2)`.
- **First section**, directly under the list header: **44px**, `align-items:center`, no bottom padding, and the name and eye buttons 44 tall. Owner: "First row doesn't need all the extra padding".

**Hide / show a city** [HiddenCity, decided "greyed header, closed eye"]

- A hidden city's header stays in its place in the list: the same 60px header, and its rows fold away.
- The name drops to `opacity:.5`.
- The eye becomes the **closed eye**, `<button aria-label="Show {city}">`, 20px:
  - the eye as above, with the slash `M4 4l16 16` drawn twice;
  - first in `var(--paper)` at stroke 4.5 (a knock-out);
  - then in `var(--ink-2)` at stroke 2, round caps.
- **Title menu:** the hidden city's row is `opacity:.55`, with the closed eye at 16px in the right slot. Its knock-out stroke is `var(--paper-raised)` there, to match the menu's ground.
- Going to a hidden city shows it again.
- No animation on fold. The list doesn't animate today.

**Collapse tab** [CollapseRefined, decided]

- The sheet gains `border-top:1px solid var(--hair)`. Owner: "the list needs the subtle top border that the tab has".
- The old header `#collapseBtn` goes.
- **Tab:** `<button aria-label="Lower the list">` (when lowered, "Raise the list").
  - Placement: `position:absolute; right:var(--gutter); top:-24px` on the sheet; 44×24.
  - Look: `background:var(--paper)`, `border:1px solid var(--hair)` with `border-bottom:0`, `border-radius:4px 4px 0 0`. Its paper runs into the sheet's.
  - Hit area: extend it to 44px tall with an invisible `::before` upward.
- **Icon:** 16px, stroke `var(--navy)` 2, no fill: a line from (4,20) to (20,20) plus `M7 8l5 5 5-5`.
  - Lowered, it's rotated 180°, with `transition: transform 0.3s ease` (as `#collapseBtn` today).
- **Motion:** the sheet's existing `transform 0.3s ease`. The tab rides with it.
- The map attribution sits above the tab and never under it.
- The + badge keeps bottom-left; the tab is right-aligned so the two never meet.

---

### Phase 2 · The add tag

The shipped tag die, the stub (Add | Star | Mark visited), the patch and its
shadows stay as they are. [Main, CityDifferent, StarVisited, CityMetaRefined]

**Routing line** (the city, decided "R2, left-aligned", no rule under it)

- It's the tag's first line, above the name, on the content's left edge. The CITY row is gone.
- Line box: `display:flex; align-items:center; gap:var(--s2); min-height:28px; padding-bottom:2px; margin-bottom:4px`.
- **City button:** `<button aria-expanded>`, `display:inline-flex; align-items:center; gap:4px; height:28px`.
  - Label: caps 12/14, `letter-spacing:.12em`, `var(--navy)`, then the 12px chevron in `var(--navy)`.
- **Open:**
  - `background:var(--navy)`, `border-radius:3px`, `padding:0 6px 0 8px`, `margin-left:-8px`, so the text doesn't move.
  - The text and chevron turn `var(--paper)` and the chevron turns 180°.
- **Edit tag:** the same, with "Save" in the stub. [CityDistance, second phone]
- **Hanging Tag** (a place's popup): the city prints in the same type, with no chevron and no button. [CityDistance, third phone]

**TYPE select** [TypeClosed, TypeOpen, decided "the one dropdown spec"]

- **Row:** `min-height:44px`, `display:grid; grid-template-columns:40px 150px 1fr; column-gap:var(--s2)`, `padding:6px 0`. No rule under it: it's the last row.
- **Label:** the `.tag-lab` style: caps at weight 500, 11/16, `.12em`, `var(--ink-2)`.
- **Trigger:** a button, 32px tall, `border:1px solid var(--hair)`, `border-radius:3px`, `padding:0 8px 0 6px`, `gap:6px`.
  - Contents: the 20px category badge, the value in caps 12, `.12em`, `var(--ink-2)`, a flex gap, then the 12px chevron in `var(--ink-2)`.
- **Open:** the trigger's border goes `var(--navy)`. The menu (spec above, caption "Type") opens right under it.
  - Each row: the 20px category badge in the icon slot, the category name, and the check on the current one.
- **Notes row** above it: unchanged. `min-height:32px`, label at the bottom, `padding-bottom:4px`, 1px `var(--hair)` rule.

**TYPE detected** [TypeDetected, decided]

- The value arrives already set, shown plainly. There's no "guessed" mark, chip or tint.
- The 32px pin above the tag takes the category's colour and glyph at once. That change is the only feedback. No animation.
- A neighbourhood pick shows District, with its outline (systems section).

---

### Phase 3 · City buckets (the city on the tag)

**Changing the city** [CityChange]

- The routing line's button opens the menu spec with the caption "City", left-aligned under the button.
- Rows:
  - The current city, with the city pin glyph at 16px (`var(--ink-2)`) and the check.
  - Each other city, with a 16px spacer.
  - Then a "New city" caption (24px, top `var(--hair)` rule).
  - Then "+ {real town}", which makes a new city.
- No tallies in this menu.

**NEW stamp** (a city that ADD will create) [CityNew, decided "NEW stamp, before the chevron"]

- **Where:** inside the city button, between the name and its chevron, wrapped with `margin:0 -1px 0 3px`.
- **Box:** 48×24, `rotate(-4deg)`, colour `rgba(168,64,12,.88)` (that is `--brand-orange-deep` at 88%; write it via a channels var or `color-mix`).
- **Outer track:** the `.row-stamp` dotted-track SVG.
  - Same path and `pathLength='166.29'`, `stroke-dasharray='0 1.9797'`, stroke 1.1, round caps.
  - Drawn in a 72×32 viewBox scaled to 48×24 (`preserveAspectRatio="none"`).
- **Inner ring:** `inset:3px`, `border:1.5px solid currentColor`, `border-radius:50%`.
- **Word:** "NEW", caps 9px, `letter-spacing:.08em`, centred.
- **Behaviour:** static. It shows when the chosen city doesn't exist yet. Cancel makes nothing.

**Distance note** [CityDistance, decided "under the address line, like a helper note"]

- **Where:** under the address line's rule, as form helper text: `padding-top:4px`.
- **Type:** Archivo at normal width, 400, 11/14, `var(--ink-2)`.
- **Text:** "≈ 40 km from Reykjavík" (straight line, rounded).
- **When:** only for a place outside its city's area. Most tags show nothing.
- **Where it appears:** add, edit and the Hanging Tag. Never on list rows.

---

### Phase 4 · The map's city badge [GoToMap, decided "the boxed city label"]

**Badge**

- A `<button>` on the map at zoomed-out levels, centred on the city's stored `center`; which cities get one and at what zoom: systems, Phase 4.
- **Look:** `background:var(--paper-raised)`, `border:1.5px solid var(--navy)`, `border-radius:2px`, `padding:5px 9px`.
- **Shadow:** `box-shadow:2px 2px 0 var(--navy)`, the menu's offset shadow, so it reads as the same family.
- **Label:** caps 13px, `letter-spacing:.08em`, `var(--navy)`, then the tally. No icon.
- **Tap:** the map flies to that city's places, the same move as Go to (`flyToBounds`). At city zoom the badge gives way to the pins. The zoom threshold is in the systems section.

**"All cities" control**

- It sits under the Leaflet zoom control at `left:10px`.
  - On the board it's at `top:84px`, below the zoom buttons. Keep the zoom control's own 10px gap.
- **Look:** height 34, `box-sizing:border-box`, `padding:0 9px 0 7px`, `gap:5px`.
  - The Leaflet control look: `background:#fff`, `border:2px solid rgba(0,0,0,.2)`, `border-radius:4px`. That's the zoom control's own CSS, not a brand colour, so leave it as Leaflet's.
- **Contents:** the ring glyph at 16px, then "All cities" in caps 11/14, `.1em`, `var(--navy)`.
- **Tap:** fits every city that has places.

---

## Phase 1 fixes (after build check)

Designer pass, 2026-10-17, on the CD + UX check (`checks/p1-cd-ux.md`),
then three owner rounds the same day. **This section is the complete final
spec**, and later rounds replace earlier ones wherever they overlap.
- The owner has approved the menu ("I like the menu"; "Blue is great for the
  one you put it on").
- The wavy break got no comment, so it stands.
- Rename / Delete in the open plan got no comment either; the owner sees it
  again in the final stills.

Each fix is built and working in the prototype branch **`design-p1-fixes`**
(head ce4586b). It is `add-tag-p1` (batch A 48d40d2 merged in) plus the fixes,
so diff it against `origin/add-tag-p1` to get the reference implementation.

Stills are in `stills/p1-fixes/` (3x raws in `raw/`, rendered by `stills.js`).
The final ones:
- `9-menu-v4.png`: the menu;
- `8-add-divider-v3.png`: the break;
- `2-plan-building.png`: the add-from sections;
- `3-plans-list.png`: the plans list, the plan foot and zero plans;
- `1-choosing.png`: the go-to landing and the hidden header only. Its menu
  frames are the superseded upward v1.
- `4-small.png`: the long title and the lowered strip.

The menu's place and look in `1-choosing.png` are superseded. The divider
caption in the other early sheets is superseded by the wavy break.

The Impeccable gate **PASSES** on the prototype.

Everything not named here stays as built. These are still the builder's
fixes, with no design answer needed:
- the title button's target covering the 52px header band;
- the section eye at least 44 wide;
- the h2 nested inside the title button;
- the eye's double announce;
- the drag-across-leg blocker;
- UX's title fallback when the gone-to city is hidden: "All places" plus the
  shown count.

### 1. Building a plan for one city (UX blocker)

**Decision:** the open plan's addable places use the Places list's own city
sections:
- the same header: name = go to, tally, eye;
- the same order (`sectionCityIds()`);
- the same hidden state. There is one `hiddenCities` for both kinds, so hiding
  a city here hides it in Places too, and the reverse.

A plan's stops never hide (unchanged).

An open plan's list, top to bottom:
1. its leg sections (unchanged);
2. the plan foot (fix 2);
3. the caption band (`.plan-rule`);
4. one city section per city that has addable places matching the chips, or
   that is hidden. Inside a section: today's sort, shapes after pins, as in
   Places;
5. the "every place is in this plan" note when nothing is addable
   (unchanged).

- **Section headers:**
  - exactly `.sec-head` (60px, air above, 2px `--hair` rule);
  - the **first one under the caption is the compact 44px** (`is-first`),
    like the first section in Places.
- **Tally** in an add-from header: the places it would add (matching the
  chips, not already stops).
  - A hidden city gets the same count, worked out as if it were shown. Never
    "0".
- **Hidden header:** as in Places (fix 4), with its rows folded away.
- **Tapping the name** (`data-addgo`, not `data-go`) keeps you **in the
  plan**:
  - the map runs `focusCity(id)`;
  - the list scrolls so that header lands compact (fix 5's +16px);
  - a hidden city shows again, as go-to does in Places;
  - the title stays the plan's name.
  - Reference: `planGoToCity()`.
- **Eye:** `setCityHidden()`, unchanged.
- **Caption, v3: the wavy line.** Owner on the v2 dashes: "Let's use a style we
  already use for the add places break. What about the wavy line?"
  - **Where the line comes from:** the app's one wavy line is the scalloped
    die-cut edge of the account badge (`#accountBtn`, the `SCALLOP_PTS` mask),
    the + badge (`ADD_SCALLOP_PTS`) and the mark's seal. `index.html`'s own
    comment on `#accountBtn` calls that edge "the same wavy line". At the
    account badge's 50px, its 16 lobes sit about 7.9px apart and about 2.2px
    deep.
    - The panel divider that comment also names no longer exists; the badges
      are what's live.
  - **Laid flat:** an 8px period, 2.5px from peak to trough, a 1.5px stroke,
    round caps, in `rgba(var(--ink-2-rgb), .55)`.
  - **How it's drawn:** `.plan-rule::before` and `::after` are each
    `flex:1 1 0; min-width:var(--s4); height:6px`, with
    `background:rgba(var(--ink-2-rgb), .55)` masked by one 8×6 SVG tile
    repeated along x:
    - the path is `M0 4.25C1.33 4.25 2 1.75 4 1.75S6.67 4.25 8 4.25`;
    - its stroke is `#000`, 1.5px wide, round caps;
    - it's applied as `-webkit-mask` and `mask` at `left center / 8px 6px repeat-x`;
    - the exact CSS is on `design-p1-fixes`.
  - **The band:** 40px tall, `--paper`, no solid rules,
    `padding:0 var(--gutter)`, `gap:var(--s2)`.
  - **The caption:** centred between the two waves, caps 11px/12px, .12em,
    700, `--ink-2`, `top:1px`.
    - Markup: `<span class="rule-cap"><span class="h-name">Add
      places{cats}</span><span class="tally">{n}</span></span>`.
    - `.rule-cap { display:flex; align-items:baseline; gap:.45em }`.
    - The tally is 11px with no margin of its own.
    - The text reads `ADD PLACES 89`, or `ADD PLACES · CAFE 4` with chips off.
  - **Why it reads as a break:** a centred caption between waves sets it apart
    from the city headers, which are left-aligned, navy, on a solid 2px rule.
  - `showPlanRule()` and the slip anchor here. The slip now covers a 40px band,
    so the builder should check its fit.
  - The first city header under the break stays compact (44px).
- Reorder (drag) never crosses the caption: unchanged.

Why: the owner's job is "build a plan by filtering places", and the app
already has the filter for it: hide the cities you don't care about, jump to
the one you do. A second, Plans-only filter would be a second system (owner
rules "Fewer variations", "clear systems"). The sections also show which city
each addable place is in at a glance, which the flat block didn't.

### 2. Rename / Delete plan's home

**Decision:**
- The ⋯ leaves the plans-list rows. They end in › only.
- Rename and Delete live **in the open plan, at the foot of its stops** (the
  plan foot), between the last stop and the caption band.
- A plan with no stops shows the foot after its "No stops yet" note.

The parts:
- **Plan foot** (`.plan-foot`):
  - `display:flex; align-items:center; min-height:44px;
    padding:0 var(--gutter); background:var(--paper)`;
  - no rule of its own: the last stop's rule sits above it and the caption's
    top rule below it.
- **Its two buttons** are today's `.plan-act` text buttons, **"Rename"** and
  **"Delete plan…"**:
  - 11px, letter-spacing .1em, `--ink-2`, 44px tall;
  - `margin-left:var(--s1)` between them;
  - the first keeps `.plan-act`'s `margin-left:calc(var(--s3) * -1)`, so its
    text starts on the gutter (16px), the caption's left edge;
  - `role="group"`, with `aria-label` = the plan's name.
- **Rename:** the foot turns into today's in-row form, in place, and takes
  focus:
  - `.plan-foot.plan-form`: 56px tall, `--paper-raised`;
  - input + Cancel / Save, from `planFormHtml('Plan name','save')`;
  - Save calls `renamePlan()`.
- **Delete plan…:** today's `confirm()` ("Delete "{name}"? Its places stay in
  your list."). After a delete, Plans falls back to All plans
  (`frameAllPlans()`), as today.
- Both stay behind `requireAuth()`, as today.
- The All plans list's `acting` / `renaming` modes and the `.plan-more` CSS
  can be deleted.

Why: a thing's own settings live inside the thing (as in iOS Notes or
Contacts), so the plans list stays one clean column of names with no mark on
every row (owner rules "Dots add an insane amount of visual noise" and
"Simple, simple, simple"). It's still two taps away from anywhere: open the
plan, then scroll to the end of its stops.

### 3. Title menu: position, size, separators (final)

The owner turned down v1, the menu opening upward: "I don't like it opening
upwards because then the places/plan switch is where the thumb is rather than
the cities…that is backwards to what will be used most".

**Decision:** the menu opens **downward, in the raised sheet's own place**,
and its box is locked for as long as it's open.

- **Phone (the bottom sheet), raised or lowered:**
  - the box's **top edge sits on the raised sheet's top edge**
    (`raisedSheetTop()` = the sheet's rect top minus its current `translateY`);
  - its left edge is on the gutter;
  - it covers the list header (the scrim already closes the menu on an
    outside tap).
  - So the rows you use most (All places and the cities, or All plans and the
    plans) start right where you tapped the title. The quiet Places/Plans row
    is the farthest row, at the box's foot.
  - When the list is lowered, the box opens in the same place as when raised:
    one place on screen.
- **Rail (≥900px):** the box's top sits at the rail's top + 44px, with the
  same locks.
- **Locked box, set when it opens:** render both sides, then fix:
  - `width` = the wider natural width, clamped to `[248px, 100vw − 2 × gutter]`;
  - `height` = the taller side's height (rows + 2px border), capped at
    `innerHeight − 8 − top`.
  - Swapping kinds moves **nothing**: no edge, no row, no width. The shorter
    side leaves plain paper between its last item and the quiet row.
  - Real data fits without scrolling: 5 cities → 7 rows = 282px, and the room
    in a 300px sheet is 292px. More rows scroll inside the box.
- **The quiet row is pinned to the foot:**
  - `#titleMenu { display:flex; flex-direction:column; box-sizing:border-box }`;
  - `#titleMenu .menu-row { flex:none }`;
  - `#titleMenu .menu-row[data-kind] { margin-top:auto; position:sticky; bottom:0; background:var(--paper-raised); z-index:1 }`,
    pressed `--paper-pressed`.
  - **You must add `#titleMenu[hidden] { display:none }`.** The id rule's
    `display:flex` beats `.menu-box[hidden]`, so without it the menu never
    hides.
- **Two separators in the box, both from the app's existing rules:**
  - **Under the "All" row** ("All places" / "All plans"): the ledger's
    **doubled rule**, the category break `.location-card.group-end`, which is
    the row's 1px `--hair` bottom rule at **2px**:
    `#titleMenu .menu-row:first-child { border-bottom-width: 2px; }`.
    - Owner: "Maybe we do the double thickness between the "all" and the
      list?"
  - **Above the quiet Places/Plans row:** a **1px `var(--navy)` line**, the
    shared menu spec's caption rule (`.menu-cap`'s border) and the box's own
    edge colour:
    `#titleMenu .menu-row[data-kind] { box-shadow: 0 -1px 0 var(--navy), 0 -2px 0 var(--paper-raised); }`.
    - The navy line covers the hair of the row above, and the paper layer
      covers any leftover hair, so one clean line shows and the row keeps its
      40px.
    - It sits on the quiet row's top edge even when the shorter side leaves
      blank paper above it.
    - Owner: "Need a stronger separator between the list in it and the button
      to the other menu", then "Blue is great for the one you put it on".
  - So the box reads in three parts: the overview row, the items, the other
    kind.
- The opening slip comes down from above: `--slip-from: -4px`. The title
  chevron doesn't rotate (v1's rotation is dropped).
- Resizing while open re-decides: clear the lock and place the menu again.
- Reference: `menuLock`, `measureMenu()`, `raisedSheetTop()`,
  `placeTitleMenu()` on `design-p1-fixes`.

Why:
- Cities first and nearest the thumb is what the owner asked for.
- Opening downward from under the title needs 282px where only 248px fit;
  starting the box at the sheet's top edge (over the header) gives 292px. That
  makes one fixed box possible.
- The locked height keeps the quiet row from moving when you tap it.

### 4. Hidden city: header and menu row contrast

**Decision:**
- A hidden city's name is **`--ink-2` at full strength** (6.17:1 on
  `--paper`).
- Its tally stays `--ink-2` (6.17:1).
- The **closed eye carries the state**, and the rows fold away (unchanged).
- No opacity anywhere.

The CSS:
- `.sec-head.is-hidden .sec-name { color: var(--ink-2); }` replaces
  `opacity:.5`.
- In the title menu,
  `.menu-row.is-hidden .menu-lab, .menu-row.is-hidden .menu-ico { color: var(--ink-2); }`
  replaces `opacity:.55`. The closed eye stays in the right slot, as built.

It still reads as hidden: a grey name between navy ones, the slashed eye, and
no rows under it (the next header follows straight away). That keeps the
owner's pick ("Definitely h1 for hidden cities"): same place, greyed.

### 5. Go-to landing

**Decision:** a go-to lands the city's header at the **first section's
compact height**.
- The list scrolls to the header's top **plus 16px** (60 − 44). The air above
  the name scrolls out of view, and the header shows as a 44px band right
  under the list title.
- A header that is already `is-first` lands at 0.

Details:
- `landingTrim(head) = is-first ? 0 : max(0, head.offsetHeight − 44)`, added
  in `applySectionScroll()` and in the plan's add-from go-to.
- The header stays 60px in the list (nothing changes size); only the landing
  scroll changes. Rows then start at the same height on screen whichever city
  you pick.
- Near the end of the list, where it can't scroll that far, it lands as close
  as it can (as today).

Why: the owner said "First row doesn't need all the extra padding". The city
you land on should look like the list's first city.

### 6. Smaller looks

- **Zero plans:** All plans shows the list's own **New plan row alone**, the
  same row as under a list of plans.
  - The outlined NEW PLAN button and its "No plans yet. / A plan's stops show
    here…" lines go (`planEmptyBtn`, `planEmptyLine2`, the `wantNew` append).
  - The title reads "All plans 0".
- **The lowered sheet's 7px strip:** on the phone, the lowered header loses
  its bottom rule:
  `@media (max-width:899px) { #locations.collapsed #locationsHeader { border-bottom-color: transparent; } }`.
  The strip under the title is then plain paper, part of the band, and it
  also clears the home indicator. Nothing moves.
- **Truncated title:** cut by script, not by CSS `text-overflow`, so the "…"
  sits the same distance from the tally as an uncut name's last letter: the
  6px flex gap, measured at about 8px ink to ink, cut or uncut.
  - Put the full name in `.h-name`.
  - If it overflows, binary-search for the longest prefix (with trailing
    spaces trimmed) plus "…" that fits the box's width.
  - Fit again on resize.
  - `aria-label` keeps the full name.
  - Reference: `fitTitleName()`.
- **One name for one state:** the menu's top Places row reads **"All
  places"** (was "All cities"). It matches the title it sets and the Plans
  side's "All plans".

### Checks for the builder

Run the full Phase 1 set from the systems section: the gesture gate once at
the end, plantest, sorttest, places-ux and Impeccable. New coverage to add:
- the menu's top sits on the raised sheet's top edge, raised and lowered
  alike, and its box (top, left, width, height) is identical before and after
  the quiet-row swap; `#titleMenu[hidden]` really hides it; the 2px rule under
  the first row and the navy line above the quiet row are both there;
- the add-from block:
  - its city sections;
  - the eye, shared with Places;
  - tapping a name keeps you in the plan;
  - a hidden city's tally isn't 0;
- the plan foot's Rename and Delete, and no `.plan-more` on the plans list;
- zero plans shows one New plan row;
- a go-to lands its header showing 44px.

### Open for the owner

- Final stills: the menu (`9-menu-v4.png`) and the wavy break
  (`8-add-divider-v3.png`).
- Rename and Delete in the open plan (sheet 3): no comment from the owner yet;
  it's in the final stills.

---

## Phase 2 fixes (after build check)

Designer pass, 2026-10-17, on the CD + UX check (`checks/p2-cd-ux.md`).

- **Reference build:** branch **`design-p2-fixes`**, one commit (00d71d60) on
  top of `add-tag-p2` ec265096. Diff it against ec265096; it doesn't contain
  batch A.
- **The two touch different code.** Batch A is behaviour only. My edits are
  all in `resultWhere()` / the new `resultKind()`, `addStubHtml()` /
  `addGoHint()`, `renderAddTag()`'s address and pin, `openAddMenu()`'s
  placement, and CSS. One crossing: the pick object gains `where`, written in
  `selectAddress()`.
- **Stills** are in `stills/p2-fixes/` (3x raws in `raw/`; `stills.js`
  renders them on the p2 fixtures):
  - `1-results-and-add.png`
  - `2-type.png`
  - `3-district.png`
- **Impeccable gate:** PASSED.
- Everything not named here stays as built and as in the Phase 2 sections
  above. The Star / Visited stub is untouched (owner: "do not tuch").

### 1. Result rows: plain kind words

The row stays "**kind · Town, Country**" (name above, unchanged). The kind is
an everyday word, never raw OSM vocabulary. Write `resultKind(r)` with this
order:

1. **`key` is `place` or `boundary`:** look up the value, then
   `r.addresstype`, in this table. With no hit, the word is **Area**.

   | OSM value / addresstype | Word |
   |---|---|
   | city | City |
   | town | Town |
   | village, hamlet, isolated_dwelling | Village |
   | farm | Farm |
   | suburb, quarter, neighbourhood, city_district, borough | District |
   | municipality, county, state, state_district, region, province | Region |
   | country | Country |
   | island, islet | Island |
   | square, plaza | Square |
   | locality | Area |
   | postcode | Postcode |
   | house | Address |

2. **`key` is `highway`:** the value table below, else **Street**.
3. **`key` is `building` (or the addresstype is building / house):**
   **Address**.
4. **The value table:**

   | OSM value | Word |
   |---|---|
   | bus_stop | Bus stop |
   | platform | Stop |
   | tram_stop | Tram stop |
   | station, halt | Station |
   | subway_entrance | Metro |
   | aerodrome | Airport |
   | ferry_terminal | Ferry |
   | place_of_worship | Church |
   | fast_food | Fast food |
   | guest_house | Guest house |
   | attraction | Sight |

5. **Otherwise:** the value itself, humanised (`_` becomes a space, first
   letter capital): "Swimming pool", "Museum", "Theatre", "Cafe".
6. **Value missing or `yes`:** **Place**.

The where-part is unchanged: the town (city / town / village / hamlet /
municipality / county / state), then the country. With batch A's English
names it reads "Village · Ærøskøbing, Denmark".

Why: the owner's rule "never label options with codes", applied to OSM's
codes. "District" and "Street" match the TYPE words, so a District result
reads the same before and after the pick.

### 2. ADD's hint

ADD's small second line (`.add-sub`, 11px, as built) says what's missing,
and nothing once ADD is ready:

| State | ADD |
|---|---|
| NAME empty | disabled, "**Name it first**" (as approved) |
| A name typed, no place picked (a pin type) | disabled, "**Pick a place**" |
| A place picked, or a District / Street with a name | ready ("+ ADD"), no line |
| Saving | "Adding…" (as built) |

`addGoHint()` returns "Pick a place" when `nameInput.value.trim()` is
non-empty, else "Name it first". `renderAddGo()` already runs on every NAME
input, so the line follows typing. While the results panel is up it covers
the stub, so "Pick a place" shows once the results are put away (no match,
a tap elsewhere, an edit with the panel closed).

### 3. District and Street on the tag

**No pin.** A District or Street hangs from **the shipped shape anchor dot**
(`showTagDot()`: 14px, a paper r6 circle under an ink r4 circle, the ink
being the type's `categoryInk()`), not the 32px pin. Owner: "Districts and
streets need no map pin"; and on the dot, "Dot or something in the middle is
fine".
- `#addPin.is-dot { width:14px; height:14px; margin-left:-7px; top:calc(var(--tag-drop) - 29px) }`,
  so the dot sits over the string's top end.
- `renderAddTag()` writes the dot's SVG instead of `badgeHtml(…32…)` when
  `isShapeCategory(d.type)`.
- The string is unchanged. `alignMapToPin()` already aligns to the element's
  centre, so the dot stands on the pick's point.
- With batch A's outline drawn at pick time, the dot sits on the outline's
  anchor, exactly as the place's Hanging Tag will sit after ADD.
- No pick (a name typed by hand): no dot and no string, the eyelet empty, as
  for a place with no pick.

**The address slot prints where the area is, never a sentence.** The
"Traced from OpenStreetMap when you add it" line goes.
- After a pick: `pick.where`, the result's town, country, e.g.
  "Copenhagen, Denmark" (`resultTown(r)`, stored on the pick in
  `selectAddress()`). It uses the address's own style (13/18, `--ink-2`).
- No pick: the slot stays empty, with its ADDRESS caption, like a place's.
- The distance note stays off for shapes (as built).

### 4. TYPE menu: placement and fit

The TYPE (and city) menu still opens **6px under its trigger**, left-aligned.
It is then kept on screen:
- **floor** = 8px above the list bar (the lowered sheet's top,
  `#locations` rect top), or 8px above the screen's foot if that's higher;
- **ceiling** = the tag's open-area top (`addOpenArea().top`: the zoom /
  account row + 8).
- `top = max(ceiling, min(trigger.bottom + 6, floor − menuHeight))`.
  When it doesn't fit below, the menu **slides up** as far as it must and may
  cover its own trigger (the check marks the current type).
- `max-height = floor − top`. It scrolls inside only when even that room is
  short (a 667px-tall phone).

At 390×844, all 11 rows (466px with the caption) fit, District and Street
included, with nothing over the list bar. This is already in
`openAddMenu()` on the prototype and applies to the city menu too.

### 5. TYPE trigger: the city button's voice (a change from the approved board)

**Decision:** the closed TYPE value is styled exactly like the city button.
- No box, no badge.
- Caps 12/14, `.12em`, 700, `var(--navy)`, then the 12px chevron right after
  the word.
- Open: the navy fill, paper text, the chevron turned 180°, `border-radius:3px`.
- `padding:0 6px 0 8px; margin-left:-8px` so the word doesn't move.
- 28px tall, with a 44px target via `::before` (top/bottom −8px).
- The row becomes `grid-template-columns:40px 1fr`. The trigger is
  `justify-self:start`, so its width is the word's.
- The menu keeps its 20px category badges (the owner: icons "may be helpful
  in the dropdown"). The pin above the tag shows the type's glyph and colour.
- a11y as UX asked: the button is labelled by "Type" + the value.
- CSS on the prototype: `.add-type-btn` (and the `.menu-badge` / `.menu-gap`
  inside it hidden; the builder can simply drop them from the markup).

Why, in the owner's words:
- "The text here is louder than the other dropdown";
- "lets treat all dropdowns the same";
- from the first day, "i dont like seeing all the icons in the tag. but they
  may be helpful iin the dropdown?".

The boxed trigger + badge was the one dropdown on the tag that looked
different, and the badge said the type a second time under the pin that
already says it. **The owner sees this departure before it lands.**

### Checks for the builder
- **The Phase 2 set:** addtest, the Impeccable gate.
- **New coverage:**
  - result rows never print Administrative / Hamlet / Building / Yes;
  - the ADD line in each of its three states;
  - a shape draft has `#addPin.is-dot`, and its address is the where-line or
    empty, never the sentence;
  - the TYPE menu's rect stays inside `[ceiling, floor]` at 390×844 and
    375×667;
  - the TYPE trigger has no border or badge.

### Open for the owner
- The TYPE dropdown now looks like the city dropdown: no box, no icon on the
  tag (`2-type.png`). OK?

---

## Phase 3 fixes (after build check)

Designer pass, 2026-10-19, on the CD + UX check (`checks/p3-cd-ux.md`).

- **Reference build:** branch **`design-p3-fixes`** (93642a15): `add-tag-p3`
  with batch A f9a5c0a3 merged in, plus one designer commit (c23cde34). Diff
  it against `origin/add-tag-p3`.
- **Stills** are in `stills/p3-fixes/` (3x raws in `raw/`; `stills.js`
  renders them, printing the tag's fit as `{sh, ch}`):
  - `1-tag-fits.png`
  - `2-city-menu.png`
- **Impeccable gate:** the only new finding is the known
  `kicker-above-heading` (the approved city line), which is being waived
  separately. Nothing else is new.
- The visited stamp/sticker and the Star/Visited stub are untouched.

### 1. The Hanging Tag's city reads as changeable (UX blocker)

**Decision:** the Hanging Tag's city button gets **the add tag's 12px
chevron** after the name: the same SVG (`M3 4.5L6 7.5L9 4.5`, stroke 1.6,
round caps), the same `.add-chev` class and the same 4px gap.
- Open, it turns 180° on the navy fill, as the add tag's does.
- Signed out it keeps its chevron and its navy; a tap gives the sign-in slip
  (fix 4).
- No label is added (owner: "we do not need this on every tag").

Reference: `ROUTE_CHEV` in `buildPopupHtml()`.

Why: "lets treat all dropdowns the same". One control is now drawn one way
on both tags, and the chevron is the app's existing "this opens a menu" mark
(the list title, the add tag's city and TYPE).

### 2. The busiest tag fits again at 375×667 (CD P1)

The city line (+34px) and the note line (+18px) pushed the busiest tag
(a 2-line name, address, distance, a 3-line note, starred, visited, a plan
stop) past its room. Main fitted it with 1px to spare. **Measured on the
prototype: the tag's inner height is 232px at both 375×667 and 390×844, the
same as main, so there's no scroll.** It is reclaimed like this, for the
Hanging Tag only (the add tag is unchanged):

| What | Was (build) | Now |
|---|---|---|
| `.tag-in` padding-top | 48px | **38px** (the city text sits 5px under the 36px band) |
| `.tag-in > .route-line` | min-height 28, padding-bottom 2, margin-bottom 4 | **min-height 20, no padding, no margin** |
| `.tag-in .route-city` | height 28, `::before` −8px | **height 20, `::before` top/bottom −12px** (the target stays 44) |
| `.tag-addr` after the route line | margin-top 2px | **0** (the name's 28px line still leaves ~10px) |
| Distance note | its own line under the address (4px + 14px) | **ends the address line**: `Vitabraut · Reykjanesbær · ≈ 50 km from Reykjavík` |
| `.tag-fields` | margin-top 12, padding-bottom 12 | **8 / 8** |
| `.tag-x` top | 74px | **50px** (it stays centred on the name's first line) |

**The note on the address line:**
- Markup: `<div class="tag-addr">{addr}<span class="tag-dist-sep" aria-hidden="true"> · </span><span class="tag-dist" id="tag-dist-{id}">{note}</span></div>`.
- `.tag-addr .tag-dist { display:inline; padding-top:0; white-space:nowrap; font-size:11px }`,
  so it wraps as one piece onto a second address line when the address is
  long.
- With no address it stands alone in `.tag-addr`.
- The city button's `aria-describedby` still points at it.

Why the note moved: the owner asked that it "feel more related to the actual
address". On the Hanging Tag (no field rules) the closest relation is the
address line itself: the real town, then how far it is from the filed city
printed just above. This only changes where the line sits; the wording is
unchanged.

### 3. One rule above "New city" (shared city menu)

The last city row's hair rule and the caption's top hair rule stacked into a
2px band. Now the city row just before the New city block carries
`.before-foot { border-bottom-color: transparent }`, so the caption's own top
rule is the one line. This applies to both tags (one `cityMenuHtml()`).

### 4. Signed-out slip copy

"Sign in to star and mark visited" becomes **"Sign in to make changes"**, the
one slip for star, visited and city. The SIGN IN button is unchanged.

### 5. City menu reach

**The city menus (Hanging Tag and add tag) never slide over their trigger.**
- They open 6px under it and stay there. The cities scroll inside the box.
- **"New city" + "+ town" are one block pinned to the box's foot**:
  `.menu-foot { position:sticky; bottom:0; z-index:1; background:var(--paper-raised) }`,
  wrapping the caption and the row. So the town is in reach with any number
  of cities.
- Exception: if under 160px remain below the trigger, the menu slides up as
  TYPE does.
- `placeMenuUnder(menu, trig, keepTrigger)` takes `keepTrigger = true` for
  `tagCityMenu` and `addCityMenu`, and `false` for TYPE. TYPE keeps the
  phase-2 slide, so its 11 rows show District and Street.

**The floor clears the + badge.**
- When the menu's horizontal span crosses the visible `#floatingAddBtn` box,
  the floor is `badge.top − 8`. This happens on the Hanging Tag at 375; the
  badge hides while adding.
- The menu then ends above the badge, with no orange sliver at its edge.

### 6. City button pressed state

`.route-city:active:not([aria-expanded="true"]) { background:var(--state-press) }`:
the tag's own pressed tint, on the button's 3px-radius box, as on the other
tag controls. Both tags.

### Checks for the builder
- **The Phase 3 set**, plus the Impeccable gate with the waiver.
- **New coverage:**
  - the busiest tag doesn't scroll at 375×667 or 390×844;
  - `.tag-city` has its chevron;
  - one 1px rule above "New city";
  - with 14 cities, the menu's top stays under its trigger and the
    "+ town" row stays visible;
  - at 375 the menu doesn't overlap the + badge;
  - the slip reads "Sign in to make changes".

### Open for the owner
- The distance on a place's tag now ends the address line
  ("… · ≈ 50 km from Reykjavík") instead of sitting on its own line, so the
  tag fits small phones again (`1-tag-fits.png`).
- The city on a place's tag now has a small arrow, like the add tag's, so it
  reads as tappable.
- (Not mine, left for the owner: after moving a place to another city,
  should the list title switch to that city? CD and UX disagree.)
