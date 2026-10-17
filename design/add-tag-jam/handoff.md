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
