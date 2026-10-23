# City CRUD v2: builder's notes

Branch: `claude/city-place-creation-workflow-vcblfw` (built on the designer's v2 commit d82f850).
Spec: `concepts/v2-lean.md` + `concepts/0-shared-name-and-address.md`; jobs v2 in `jobs.md`;
approved stills `stills/v2/1..3` (4 is on hold, below). The prototype layer (`proto/`) was read as
reference only; nothing of it ships.

## HOLD: Delete city (owner reopened it)

Owner, after approval: "Idk about delete city though — brainstorm better options". Not built: no
"Delete city…" foot, no confirm, no move/delete-places choice, no tombstone, no migration. Nothing
was started on it, so there is nothing to drop. `cleanupOrphanCities()` and the static `CITIES`
seed are unchanged (they only matter once a hand delete exists: a deleted seed city would come
back from the bootstrap; that is the next builder's question if Delete returns).

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
