# City CRUD v2 + v2b: builder's notes

Branch: `claude/city-place-creation-workflow-vcblfw`. v2 (name/address, Find a city, the PLAN line)
built on the designer's d82f850; **v2b (below, READ FIRST)** built on aceb356 after the owner approved
the rest of the design ("amazing so much better!!! perfect now imo" on the v12 prototype). The
prototype layer (`proto/`) is reference only; nothing of it ships -- except `proto/swipe-flap.html`'s
gesture logic, ported into `index.html` as the spec required.

## v2d (2026-11-03): v14 (the picker's new city) and the owner's rulings on the gate -- READ FIRST

- **v14** (`concepts/v14-picker-new-city.md`, owner's copy verbatim): `rmPickerHtml()` -- the question
  "Should we move {City}’s places to a new city?" (`.rm-q.menu-cap`), the pinned "+ A new city…" line
  (`.rm-new`, `wireRmNewCity()` = `wireFindCity()` scoped to the picker, near the removed city; results in
  `.rm-found` swap in for `.rm-mine`), your cities, the foot (`.is-too` with `RM_BIN` "Remove places
  too", `.rm-band`, `.is-keep` "Cancel"). A new-city pick: `addCity(cfg, false)` then `rmCommit(id,
  newId, false, newId)`; `rmUndoMove(..., made)` deletes the made city again. An empty city: "Remove
  {City}? Nothing is filed here." + "Remove {City}" (bin) + Cancel, no line (the destructive row is named
  "Remove {City}" there: "Remove places too" would name nothing).
- **The owner's rulings** (none waived, no `--update`): no overshoot (`.sp-face` 480ms
  `cubic-bezier(.45,.05,.25,1)`; `.menu-city.settle.to-open` `cubic-bezier(.25,1,.45,1)` -- the coordinator
  extended the bounce ruling to every new easing, so v10's ~5px open overshoot is gone too); the picker
  uses `.menu-cap` / `.menu-lab` / `.tally` only (the typed entry in "+ A new city…" stays 16px, the iOS
  no-zoom floor, as the built Find a city line; its placeholder is in the row label's voice);
  `.menu-lab .tally, .rm-dest .tally { font-size: 11px }` (the type floor, as the other tallies).
- Gate: `IMPECCABLE GATE PASSED` (static 1/1, runtime 47/47, 0 new) -- flat-type-hierarchy no longer fires.
- **Then (same day):** the coordinator reverted the over-broad easing change: the board's open snap is
  back to the owner-approved `cubic-bezier(.25,1.45,.45,1)` (the ruling covered only the sign's turn).
  Impeccable now flags it: `bounce-easing | cubic-bezier(.25, 1.45, .45, 1)` [removeboard picker] --
  PENDING the owner, not worked around. Also: the picker's box re-fits while typing a new city
  (`wireRmNewCity()` -> `placeRmPicker()`, not on "Searching…"); Find a city ranks own-name matches
  first (`findCities()`), so Amman (an alt name of "Philadelphia") comes last.
- **The owner on the v2d stills:** an empty city is removed at once (`rmShowPicker()` -> `rmCommit(id,
  null, viaKey)`; the held path; slip "{City} removed", no line 2); the empty-city picker variant is
  gone. "Remove places too" = the destinations' own row (bin as a 16px `.menu-ico`, stroke 2.4/24 =
  the arrow's 1.6px), one `--hair` rule above the foot (the last city's rule already drops: the
  `.before-foot` pattern); the band, the navy rule, `.rm-bin` and the is-too overrides are gone. The
  snap's `bounce-easing` added to `runtime-baseline.json` by hand after `--update` (its output also
  rewrote the informational state lists; reverted so only that entry changed). cctest 132 (P8, Y3,
  Y9-Y9e rewritten/new; T7 now allows the desktop box to fit short of the foot -- the shorter foot
  lets all 12 cities fit).
- Flag for the designer/owner: at 390 the one hair rule above "Remove places too" is the same rule
  as between the cities, so with no scroll shadow the row reads as one more city row, barely set
  apart. The city menu's "New city" foot is set apart by its caption too, which needs copy (a
  design call); not added.
- Noticed: after Undo of a remove, the city comes back at the END of the menu's order (CITIES insertion
  order); a re-fetch would sort it as the table returns it. Logged.

## v2c (2026-11-03): the CD + UX check's fix batch (builder half + the designer's v13)

Builder half (the coordinator's list):
1. **J8 (UX ruling):** an open plan's add-from list crosses cities -- every shown city, the picked
   city's section first, each with All places' eye (`cityListed()` is All-places-like in Plans;
   `syncPlanCards()` orders the picked city first). The eye's scope: All places and a plan's add-from.
2. **Signed out:** the map sign never turns while the board reads SIGN IN (`rmSetDrag()` checks
   `currentUser`).
3. **Signposts fit within a pixel** (`SIGN_FIT_SLACK` = 1 in `fitsAt()`; phase 4 bug: the
   Copenhagen+Malmö post at x1 382.5 against 382 vanished after a move). A post that is truly over
   (e.g. 2.5px at one 390 view after a Stockholm -> Copenhagen move) still hides, by the phase 4 rule.
4. **Find a city:** "≈\u00a045\u00a0km away" (no-break spaces; never a lone ≈ on a wrap).
5. **Focus:** a keyboard commit (Enter/Space on a destination, `e.detail === 0`) focuses the slip's
   Undo (which also pauses its 6s, as the shipped slip does for focus); a mouse click on the board
   lands on the picker's first choice.
6. **N1:** when every result is beyond `FIND_CITY_FAR_KM` (300) from the place, Find a city ranks by
   OSM importance (Philadelphia, PA first), else nearest first.

Designer's v13 (`concepts/v13-post-build-fixes.md`):
1. **The picker takes over the box** (`#titleMenu.is-picking`, `placeRmPicker()`): the held row
   (44px, board open) and the question pinned on top, `.rm-dests` the only scroller (the
   `--scroll-shadow` inset at the edge with more beyond: `rmShadows()`), `.rm-foot` pinned
   (Remove-too / Keep). Width max(menu, min(100vw - 32, 340)). Phone: bottom fixed, grows up to
   `--top-row-bottom` + 8 (82px). Rail: down from the menu's top, at most to 16px above the foot.
   Keep, Esc or a tap outside (`rmExitPicker()`) bring the menu's rows and box back (it stays open).
2. **Two-line Undo slip** for city removes (`showPlanSlip({ l1, pre, name })`, `#planSlip.two-line`,
   always on the header band): l1 "X removed" (grey 11px, the only part that may cut), l2 "Its
   places → Y" (no-break spaces round the arrow) / "and its N places" (navy 13px, never cut). An
   EMPTY city's remove has no line 2 (v13 doesn't cover it; flagged).
3. **Empty-city copy:** "Nothing here yet · tap + to add a place".

Waiting on the owner (the coordinator asked; not changed): S1 (a move from a place's tag switches
the picked city to the destination) and the 3 Impeccable waivers.

## v2b (2026-11-02): a picked city filters, faded signposts, New city, Remove city

Specs: `concepts/v5-a-city-means-that-city.md` (minus its "Remove Malmö…" foot), `v7-the-hold-reveals.md`
("Also in this round" only), `v4-new-and-remove.md` (New city only), `v10-swipe-reveal.md`,
`v11-sign-words.md` (the sign's words), `v12-one-step-and-desktop.md`; behaviour reference
`proto/swipe-flap.html`. Earlier "HOLD: Delete city" is resolved by this round (Remove city).

### Built
1. **A picked city filters** (`cityListed()`): `visibleLocations()` / `visibleNeighborhoodShapes()` use
   it, so the list AND the map hold the picked city only; All places = every shown city (the eye's
   only scope). `setActiveCity()` scrolls a pick to the top (no section scroll). `titleState()` names a
   picked city even when empty or hidden. `menuCityIds()` lists every one of your cities (an empty
   one you made too). A plan's add-from sections follow the picked city (its section alone, no eye).
   - **No header for a picked city** (`syncPlacesList()`); All places' header names are plain
     headings (`.sec-name.is-static`, no go-to, the eye is the only action).
   - **The reveal rule is now a switch** (`revealCity()` / `unrevealCity()`): a place filed in another
     city (ADD, the city menu on a tag) switches the picked city to it (the map stays); a failed
     write switches back. One render with the move, so the pin and its tag never drop out.
   - Empty picked city: the empty line reads "Nothing here yet. Tap + to add a place; it's yours until
     you remove it." (v4's note, in the shipped empty-state voice).
2. **Faded signposts** (`mapVisibleLocations()`: `faded` badges; CSS `.sp-board.is-faded`): with a
   city picked, zoomed out, every other city with a chip-matching place stands faded -- dashed
   `--ink-2` rule, grey label, no navy shadow, the opaque paper face; a tap is `goToCity()`.
3. **New city** (`openNewCityLine()`): "+ New city" before Plans on the title menu's Places side;
   signed in, it turns in place into the Find a city line (`wireFindCity()`, near the map's centre);
   a pick = `addCity(cfg, false)` + `goToCity()`; one of your cities = just `goToCity()`.
4. **Kept cities**: `addCity(cfg, auto)` writes `auto_added = auto`; every hand pick passes false
   (New city, Find a city on both tags, "+ town" on both tags); only the guess's own NEW city is
   auto. `CITIES[id].auto` is kept locally (`fetchCities()` selects `auto_added`);
   `cleanupOrphanCities()` only removes `auto !== false`.
5. **Seeds**: the live `cities` table is the truth once it answers (`fetchCities()`: a seed id it
   doesn't hold, with no places, is dropped from `CITIES`; an empty answer changes nothing). The
   seeds are rows in that table already (20260920 migration), so **no migration is needed**.
6. **Remove city** (the module "NEW CITY and REMOVE A CITY in the title menu", ported from the
   prototype): each city row is `.menu-city` = the shipped `.menu-row` + `.rm-clip/.rm-board` + a
   visually hidden `.rm-sr` "Remove {city}" menuitem (VoiceOver). Constants `RM_OPEN 132`,
   `RM_FLICK_V .25`, `RM_VEL_WINDOW 80`, `RM_OPEN_AT .4`, `RM_MAX_GIVE 12` / `RM_GIVE_K 40`; snap
   240ms `cubic-bezier(.25,1.45,.45,1)` open / 160ms `cubic-bezier(.4,0,.2,1)` close; detent tick
   6ms, landing tick 10ms at 170ms (`navigator.vibrate`; iOS silent by platform). Touch: axis lock
   after 10px (|dx| > 2|dy|), flick or 40% rule. Trackpad: `rmWheelGesture()` (a new swipe = the
   stream turns around, or speeds up after decaying; 80ms quiet), axis once per swipe, owner row,
   clamped accumulator, edge snap + same-direction momentum lock, 120ms settle; a document wheel
   listener forwards a wheel over a row's band (`rmRowUnder()`). Right-click/control-click opens;
   Shift+Delete/Backspace opens + the picker, focus on the nearest city. Signed out: the board reads
   SIGN IN and `requireAuth()` (the sign-in sheet). Reduced motion: no transitions (board, sign).
   - **The sign** (`boardHtml()` now two faces; `setSignTurned()`, `rmTurned`): turns at the 40% line
     to SEE YOU SOON? on navy (480ms `cubic-bezier(.45,.05,.25,1.12)`), as wide as its words; a tap on
     a turned sign (through `#menuScrim`, via `elementsFromPoint`) opens the picker.
   - **The picker** (`rmPickerHtml()`): "Remove X. Move its N places to:", other cities nearest
     first ("≈ n km", `roundKm()`), "Remove the N places too (and K plan stops)", "Keep X". An empty
     city: "Remove X? Nothing is filed here." + "Remove X" + "Keep X".
   - **Move** (`rmCommit(id, to)`): optimistic; `locations.update({city}).eq('city', id)`, the same on
     shapes, then `cities.delete().eq('id', id)`; failure rolls back. Slip (the plans slip,
     `showPlanSlip()`): "X removed. Its places are in Y." Undo (`rmUndoMove()`): re-insert the city row
     (its config, its auto flag), then move those place ids back (`.in('id', ids)`).
   - **Remove too = held** (operator ruling (a)): `pendingRemoval`; gone from the screen at once,
     nothing written; `withoutHeldRemoval()` filters the places/shapes/plan-stop reads so a poll can't
     resurrect them; Undo (`rmUndoHeld()`) writes nothing. The slip's end (`planSlipEnd`, new
     `onEnd` hook on `showPlanSlip()`/`hidePlanSlip()`) runs `commitHeldRemoval()`: delete places by
     id (their plan stops cascade), shapes by id, then the city row; failure shows it all again. A
     second remove (or any other slip) commits the held one first. **Leaving the app**:
     `visibilitychange` (hidden) and `pagehide` commit at once -- the deletes are SENT immediately
     (best effort); if the page dies before they land, the data survives (the safe direction). Chosen
     over "leave it undone" because a backgrounded phone often never returns to the page.
   - After removing the picked city: All places (v5).
   - The menu never re-renders under a swipe, an open board, the picker or a search (`rmBusy()`).

### Gaps / calls for the check
1. **The picker scrolls inside the title menu's locked box** (phase 1 locks its height to the raised
   sheet's top); at 390 "Remove the 23 places too" / "Keep" need a scroll, at 375x667 more so. The
   prototype's menu grew. Not changed (the box is a shipped design rule).
2. **The undo slip truncates** on the list header at 390 and 375 ("Stockholm removed. Its places
   a…"); I made the whole sentence truncate at its end so the city reads first (it was the city that
   truncated). Copy unchanged.
3. **Find a city's results in the title menu** wrap their where-line (the menu's locked width cut
   "≈ n km away"); the add tag / tag city menus are unchanged.
4. **Empty-city picker** copy is v4's ("Remove X? Nothing is filed here.") with v12's one-step rows.
5. **Seed cities with no places** now appear in the menu with 0 (every one of your cities is listed).
6. **Signed out** gets the sign-in SHEET (`requireAuth()`), as New plan does; the tag-only "sign-in
   slip" isn't available in the menu.
7. **Faded boards ignore the eye** (the eye's scope is All places).
8. At 375x667 with the list raised, the map's clear area (202px) fits a 4-board post only in a narrow
   band of views (shipped phase 4 rule; the stills pick such a view).
9. **Impeccable** (new states rendered, approved): 3 new identities, NOT baselined -- bounce-easing on
   the approved sign turn (needs a waiver); flat-type-hierarchy in the picker (its 14px question,
   as approved); undersized-ui-text "23" (the shipped title-menu tally at 10.4px, newly scanned).

### Tests (v2b)
cctest 97 (V filter/faded, N New city, R touch snap cases + sign + scrim tap + picker + right-click +
Shift+Delete + VoiceOver, P move/Undo/held/poll/commit/seed/second-remove/background, W trackpad
streams with no quiet gap, S signed out/reduced motion/375). citytest D3/E1/F2/S1a/S1c and plantest
P6/H1-H12/V17/K5/EM1-2 rewritten to the new rules (the old ones encoded "go-to never filters").
Stills: `build/stills-v2b.js` -> `build/stills/v2b/`.

## What's built (all in `index.html`)

1. **NAME and ADDRESS, two lines that each search.**
   - `#addrInput` (a 16px textarea, the iOS no-zoom floor) lies unseen over the ADDRESS line at rest
     (the span `#addAddr` prints the pick's address, today's 13px look); a tap lands on it and
     `.is-writing` shows the entry instead.
   - `searchAddress(query, src)`: `src` 'name' | 'addr'; `addResultsSrc` remembers which line the
     rows answer; `showAddResults()` opens them under that line's rule; the outside-click closer
     and the results' ArrowUp go back to that line.
   - `selectAddress()`: a pick from NAME names the place as today; from ADDRESS a NAME you wrote
     stays (empty NAME takes the pick's name). ADDRESS gets `addPickAddress()` (a place's short
     address, else its full one; a district/street's where).
   - After a pick NAME never searches (the nameInput input handler).
   - `addrSettle()`: leaving ADDRESS with no new pick puts the pick's address back; an emptied
     ADDRESS lets the pick go (pin and string leave, the wash returns, an unhanded city re-guesses
     pre-pick) and NAME searches again ("To find a different place, write in ADDRESS or clear it").
   - `.add-f.is-writing`: the line's rule navy; with text, its caption stays printed above the
     entry. Applied to NAME, ADDRESS and NOTES (see Deviations 1).
   - `addGoHint()` / `addReady()`: before a pick "Pick a place"; "Name it first" only when NAME is
     empty after a pick (or a district/street with no name, unchanged); a pin needs a pick AND a
     name.
   - `placeAddTag()`: ADDRESS docks under the top controls with the keyboard up, like NAME.
2. **Pre-pick city line:** `preGuessCity()` no longer falls back to the last go-to's city; null
   prints the caption CITY (`.route-city-name.is-cap`, --ink-2, weight 500), still a menu.
3. **Find a city** (both city menus, `cityMenuHtml()`'s foot under "New city" / "+ town"):
   `findCities()` = `nominatim(q, {soft viewbox ±1° around the place}, {featureType: 'city', limit
   10})`, then `foundCity()` keeps addresstype city/town/village only, strips "Village of"
   (TOWN_PREFIX_RE), adds "Kind · State, Country · ≈ n km away" (placeDistanceText's rounding),
   sorts nearest the place, merges same name + country within 15 km, max 5. `existingCityFor()`:
   one of your cities by name (label or geocodeSuffix's first part, accent-insensitive) and country
   (in its countrycodes). `cityConfigFromFound()`: id `freshCityId()`, the result's name, centre,
   box (≤ 3° guard, else a fixed ±0.15° box), zoom 12, suffix "Name, Country", auto_added true via
   `addCity()` unchanged. `wireFindCity()` debounces 1 s (Nominatim's etiquette), prints Searching…,
   "No cities called that — try another name.", or the add search's failure lines.
   - Add tag: a pick sets `addDraft.city` (an id, or `{ newCity: { label, cfg } }`, NEW-stamped,
     made at ADD by `addResolveCity()`), `cityHand = true`.
   - Hanging Tag: `movePlaceToFoundCity()`: an existing city -> `setPlaceCity()`; a new one ->
     `addCity(cfg)` then `setPlaceCity()`; the emptied auto city goes by today's cleanup.
   - `.menu-box.is-finding`: the foot stops being sticky while a search shows, and the box scrolls
     the search line to its top, so the results never outgrow the box (375x667 checked).
   - `renderTagCityMenu()` never re-renders over a search in progress (the late town lookup).
4. **The PLAN line** (`#addPlanRow`, TYPE's row voice under a hair rule; `#addPlanMenu`):
   `openAddForm()` shows it only when `inPlanView() && plansAvailable === true && activePlan()`,
   preset to that plan on every +. STOP n = `planRowsFor(plan).length + 1`, printed STOP + a
   stamped number (`.tag-stamp`, the Hanging Tag's recipe). The menu: your plans + "Not in a plan".
   `finishAddInPlan()` after any successful insert (pin, approx pin, shape): `addStop()` for the
   chosen plan; a failure sets `addDraft.saved`, keeps the tag up with
   "Saved, but not added to the plan — try again." and ADD then retries only the stop. Cancel
   with `saved` clears the draft (the place exists; no duplicate on the next +).
5. **Bug fixed in passing (in the touched search code):** the quiet near-cities pass could reopen
   the results over a place you had already picked (NAME still reading the query). A pick now
   makes any in-flight search stale; a debounced search whose line moved on never starts.

## Data

No migration. Found cities use the existing `cities` columns and insert path (`addCity()`,
auto_added true, so an emptied found city is cleaned up exactly as an auto town is today --
"as today" in the spec). Plans use the existing `plan_stops` insert.

## Deviations / calls flagged for the check (CD + UX)

1. **Caption above the entry on every line** (NAME and NOTES too, not only ADDRESS). The spec states
   it as a general rule ("While a line is being written on, its caption stays printed above the
   entry"), and "exactly like NAME" for the navy rule; only ADDRESS was drawn. Still
   `stills/raw/B2b-name-writing.png`. Easy to narrow to ADDRESS (one selector) if unwanted.
2. **"it" in "write in ADDRESS or clear it" read as ADDRESS:** an emptied ADDRESS drops the pick.
   (Reading it as NAME would bring back the "Rental, night 2 -> No places called that" problem the
   rule exists to stop.)
3. **A pin needs a name to ADD:** with NAME emptied after a pick, ADD waits ("Name it first").
   Before, an empty NAME saved the pick's own name.
4. **Find a city's empty/error copy** is invented by analogy with the add search's
   ("No cities called that — try another name."). The field's placeholder "Find a city…" is the
   spec's wording.
5. **Results indent 40px** as drawn in V3 (off the 4px scale's named steps; matches the still).
6. **A found NEW city on the add tag** isn't listed (checked) in its own menu when reopened (it
   isn't in CITIES until ADD); the line shows it with the NEW stamp. "+ town" is checked only when
   it is the town itself.
7. **Failed stop, two messages:** the plans write banner (shipped `planWrite()` ->
   "Couldn't save. Try again.") shows with the tag's "Saved, but not added to the plan — try
   again." (`stills/raw/B7-stop-failed.png`). Reads a little contradictory; a UX call.
8. **Signed out:** no greying was needed: the + already asks for sign-in before the add tag opens,
   and the Hanging Tag's city button is already the greyed slip (no menu, so no Find line).

## Tests

- New: `design/city-crud/build/cctest.js` (50 cases) + `lib-cc.js` + `fixtures/`
  (`fetch-fixtures.sh`: real Nominatim answers, 2026-10-23).
- `design/add-tag-jam/p2/addtest.js`: D6b (NAME after a pick no longer searches), W3/W4 (fresh add
  per address, since NAME no longer re-searches after a pick), N1 (the new hint rule + the
  emptied-NAME case) changed to the spec's new rules.
- `design/list-ordering/build/harness.js` honours `CHROME` (the container's chrome-linux64 path).
- Run: `CHROME=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome node design/city-crud/build/cctest.js`
  (plantest/sorttest also need `VENDOR=design/gesture-harness/vendor PAGE=<index.html>`).

## Stills

`CHROME=... node design/city-crud/build/stills.js` (`frames` / `sheets`): the real build, no design
layer, real tiles cached in the session scratchpad (`CC_TILES`). Sheets in `build/stills/`, frames
in `build/stills/raw/`.

## What's left

- The combined CD + UX check, then land.
- Delete city: on hold for the owner's brainstorm.
- Impeccable's runtime states don't include the new ones (the city menu with Find, the PLAN line,
  ADDRESS being written): the gate passed but never rendered them. Adding states to the gate is
  a baseline change (owner/operator approval).
