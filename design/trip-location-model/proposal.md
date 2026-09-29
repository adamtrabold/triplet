# Trip vs. place location model — discovery + proposal

Status: discovery only. Nothing built, no schema touched. Written
2026-09-29. Line numbers are `index.html` at `7b8a52e`.

## Owner decision (2026-09-29): search only, for now

> "For now we should simply widen the search if it doesn't find it in the
> trip city. When we expand cities vs trips and create the different
> structure maybe that should change. User should not have to select
> distance."

- **Built:** option A. On zero scoped results, run one widened search: no
  suffix, no countrycodes, soft viewbox, spaced ≥1 s, with a stale guard.
  Applies to autocomplete, typed-address submit, district outline, and the
  approx-pin Nominatim step. Spec: `docs/shipped.md`, "Search widens on a
  miss".
- **Not built:** the §3B nearest-base filing rule, any distance setting,
  a trip entity. All three are deferred to the trips/cities restructure
  (`docs/backlog.md`). Filing is unchanged; see the trace in
  `docs/shipped.md` for what a far-away pick does today.
- The rest of this doc is the discovery as written. Its recommendation (B)
  and §6 questions 1–3 are answered or deferred by the decision above.

## Summary (read this on a phone)

1. **Why search misses:** each search is locked to one city. It adds that city's name to what you type and only allows its country, so other cities and countries get cut out.
2. **Which city:** the one the map is centred on (within 75 km), or whatever you pick in the form's City menu. The list filter doesn't set it directly.
3. **Fix (v1):** search your city first as now. If that finds nothing, search again everywhere, still favouring your area. No new taps, no schema change.
4. **Filing:** a place still goes under the city its coordinates are in. If it's outside every city's box, it goes under the nearest trip city within a set distance (a day trip). Only a truly far place offers "add new city?".
5. **Not in v1:** a "trip" table and grouping cities into trips. That's bigger work, and it doesn't fix search by itself.

## 1. What the code actually does

### Search / add path (pins)

| Step | Where | What |
|---|---|---|
| Type in Name | `nameInput` `input` → `debounce(searchAddress, 1000)` (5593-5598) | 1 s debounce |
| Autocomplete | `searchAddress()` (2785-2823) | `nominatim(query, currentSearchCityConfig(), {limit:10, addressdetails})` |
| Scope choice | `currentSearchCityConfig()` (3070-3077) | if `userOverrodeCity` → `cityConfig(formCityId())`; else `detectCityContext()`, and it **silently rewrites `cityInput`** to that city |
| Viewport guess | `detectCityContext()` (3050-3063) | nearest `CITIES` centre to **map centre** within 75 km (`rankCitiesByProximity`, 3033). None within 75 km → `{viewbox: viewport padded 25%, bounded: true}`, which is a **hard** viewport box |
| Request | `nominatim()` (2653-2670) | `q = "<query>, <geocodeSuffix>"`; `countrycodes` = **hard** filter; `viewbox` = soft bias; `bounded=1` only on the no-known-city fallback |
| Pick a row | `selectAddress()` (2832-2858) | name = first comma chunk; stores lat/lng; `maybeDetectCity()` |
| Filing guess | `maybeDetectCity()` (3345-3357) → `matchCity()` (3092-3100) | viewbox containment (+0.05° pad), nearest centre breaks ties. No match → `deriveNewCityConfig()` → "X isn't in your city list yet. Add it?" |
| Save | `handleAddLocationSubmit()` (5873-5935) | free-typed text → `geocode()` (2762-2773), **same scoping**; a pending new-city prompt blocks the save; `city = formCityId()` (5918) |

Seed scopes (`CITIES`, 2300-2316; the live `cities` table matches exactly):

| city | geocodeSuffix | countrycodes (hard) |
|---|---|---|
| la | `Los Angeles, CA` | us |
| reykjavik | `Iceland` | is |
| copenhagen | `København` | dk,se |
| malmo | `Malmö` | se,dk |
| stockholm | `Stockholm` | se |

### Shapes (district/street) — hit harder than pins

`handleAddShapeSubmit()` (5782-5871) uses `cityConfig(formCityId())`.
The form's City menu lists only known cities, so there's no way to aim
it anywhere else:
- `nominatimPolygon()` gets the same suffix + countrycodes.
- `overpassWay()` (2693) and the Overpass half of `findApproximatePoint()`
  (2742-2744) use the city viewbox as a **hard bbox**. A street outside
  a known city's box can never be found.
- Filing goes through `resolveShapeCity()` (geometry vote). That part
  is already coordinate-based and fine.

### The backlog's diagnosis: right and wrong

- **Right:** `countrycodes` is a hard filter and the suffix is appended
  to every query, so a place in a country outside the current city's
  list can never come back.
- **Imprecise:** "the city detected from the map/filter". It's the map
  centre (≤75 km) or a manual form pick. The filter only matters because
  switching city moves the map there.
- **Understated:** "a place in another city of the same country is ranked
  against the wrong suffix." The suffix is part of `q`, and Nominatim's
  free-text search needs the query terms to match the place's address.
  So for Stockholm, Malmö and Copenhagen (city-name suffixes), a place in
  another town is **probably dropped, not just ranked lower**. Examples:
  Uppsala while in Stockholm, or a Malmö café while the map is on
  Copenhagen (`"…, København"`). Reykjavík's suffix is `Iceland`, which
  is why Reykjanes day-trip pins worked. *Needs the owner's browser test
  (T2) to confirm. The sandbox can't reach Nominatim.*
- **Missing:** shapes (above), and free-typed submit via `geocode()`,
  which uses the same scoping.
- **Hidden workarounds that exist today** (usable on the trip right now):
  (a) pick the target city in the form's **City** menu *before* typing.
  That sets `userOverrodeCity` and searches with that city's scope, but
  it only works for a known city. (b) Pan the map more than 75 km from
  every known city. Search is then hard-bounded to the visible map.

### Corrections to the earlier doc (`design/trip-place-model/proposal.md`, 2026-09-28)

- It says `locations.city` / `neighborhood_shapes.city` are "not enforced
  FKs" and could go nullable "without a migration". Both are wrong. Live
  DB: `locations_city_fkey` and `neighborhood_shapes_city_fkey` →
  `cities.id` are enforced, and both columns are `NOT NULL`.
- Its recommended v1 widens the hard filter to the union of trip
  countries (`us,is,dk,se`). That still excludes a stop in Norway, Finland
  or Germany, and it doesn't touch the suffix problem. It also says a
  Bergen search "now succeeds", which contradicts its own mechanism.
- Treat this doc as superseding it.

## 2. Live data (read-only, Supabase `jgvckilmltimabfdvaly`)

- `cities`: 5 rows, all seed (`auto_added = false`). No runtime city has
  ever been minted.
- `locations`: 198 rows. copenhagen 56, reykjavik 45, stockholm 42,
  la 28, malmo 27. LA rows date from Jan 2026, Nordic rows from
  2026-09-19 on. Visits are already being marked (Reykjavík 9,
  Copenhagen 1, Stockholm 1), so **the trip is in progress**. 1
  `(approx.)` pin.
- `neighborhood_shapes`: 12 (reykjavik 4, copenhagen 3, stockholm 3,
  malmo 2).
- Places outside their city's viewbox (+0.05°): 2, both Reykjanes
  (Reykjanesviti, Gunnuhver), about 52 km out and filed under reykjavik.
  They show the day-trip pattern is real. Under today's `matchCity()`, a
  fresh add there would **offer to create a new city** (e.g.
  "Reykjanesbær") rather than file it under Reykjavík. Presumably they
  were added before auto-detect existed, or via the City menu.
- Schema: `city text NOT NULL` + FK on both tables; `locations.city`
  defaults to `'la'`. `cities` has `id, label, center_lat/lng, zoom,
  geocode_suffix, countrycodes, viewbox, created_by, auto_added,
  created_at`.

## 3. Options

### A. Widen on miss (search only)

- **You see:** the same results as today when your city has a match.
  When it has none, results from anywhere appear. Your area still ranks
  first (soft viewbox), and each row's full address already names the
  town and country. Free-typed submit does the same.
- **Change:** ~25 lines in `searchAddress()` / `geocode()`, plus
  optional scope flags on `nominatim()`. No schema.
- **Risks:** a common name with no local hit can return a far-away
  namesake. The earlier "V1 Gallery → Copenhagen Central Station"
  mismatch came from an unscoped search. Mitigations: this only runs on
  a miss, the address is shown, and the pin drops on the map. A miss
  costs a second request, and Nominatim's policy is ≤1 request/s: space
  the second call ≥1 s after the first, or reuse the debounce.
- **Friction:** none added. A miss now costs about 1 s more instead of
  "No results".
- **Gap:** filing still follows `matchCity()`. A day-trip place
  (Reykjanes, Golden Circle, Uppsala) offers "add new city?", which is
  the friction the owner doesn't want.

### B. A + nearest-base filing (recommended)

A, plus one filing rule: when `matchCity()` finds no box, file under the
**nearest trip city within `FILE_RADIUS_KM`** (proposed 150 km, a dial),
with no prompt. Only beyond that radius does the existing one-tap "Add
<town>?" prompt appear. This is the owner's model: *cities are the trip's
bases; a place belongs to the base you'd do it from*.

- **You see:** add Gunnuhver or Uppsala → it lands under Reykjavík or
  Stockholm with no questions. Add something in Bergen → one tap: "Add
  Bergen?" (or Dismiss, then pick from the menu).
- **Change:** A + ~10 lines in `maybeDetectCity()` (reuse
  `rankCitiesByProximity()`). No schema. Optional: have the approx-pin
  path for shapes (`resolveShapeCity([[lat,lng]])`) use the same
  fallback.
- **Risks:** the radius has to be chosen. Too big and a new city gets
  swallowed by an old one (Reykjavík → Vík is ~140 km straight-line, Gullfoss ~90 km; Copenhagen →
  Stockholm is 520 km, so that's safe). LA is also a "base", which is
  harmless because it's far from everything. A place filed under the
  wrong base is fixed today by the City menu before saving; there's no
  edit-city-after-save UI (not new).
- **Friction:** lower than today. It removes a prompt that currently
  fires for every day trip.

### C. Explicit trip entity

A `trips` table (`id, label, dates…`) with `cities.trip_id` FK, and a
trip switcher above the city chips (e.g. "Nordic Sept 2026" vs "LA").
Search is scoped to the active trip's countries plus a bias; places keep
`city`.

- **You see:** a new top-level switch. City chips show only the active
  trip's cities.
- **Change:** a migration (new table, FK, backfill of 5 rows, RLS policy
  ×1), plus a switcher UI going through concept → UX → CD stages, plus
  persistence and cleanup rules (`cleanupOrphanCities()` must respect
  trips). Largest by far.
- **Risks:** it doesn't fix search on its own (a trip's countries are
  still a hard list, so an unplanned stop in another country still
  misses unless A is also done). It adds a new state to reason about
  mid-trip.
- **Friction:** neutral per add, as long as the trip is implied. It adds
  a navigation level. It's the right home later for Phase 2 "trip
  context (dates/closures)" and day agendas' per-day grouping.

**Rejected:** a manual "Search everywhere" toggle or link. It's a tap on
every miss, and A does the same thing automatically.

## 4. Recommendation and smallest v1

**B.** It fixes the reported bug (A) and the filing friction that fixing
the bug would otherwise expose, with no schema change or new UI, while
the owner is on the trip. C stays on the roadmap as the home for trip
dates and agendas, not as the search fix.

v1 scope (pins, plus the district polygon lookup):
1. `nominatim()` accepts a scope object with suffix, countrycodes, viewbox
   and bounded all optional. `searchAddress()` and `geocode()` run the
   scoped query as today. On **0 results** they re-query after ≥1 s with
   no suffix, no countrycodes, `viewbox` = the same city's box (soft,
   **not** `bounded`), and `limit` 10. Widened results render in the
   same list; their `display_name` already carries town and country.
   The widened query also needs a stale-result guard: the second
   request can land after the user has typed more.
2. `maybeDetectCity()`: `matchCity()` → else nearest city within
   `FILE_RADIUS_KM` → else the existing new-city prompt.
3. `nominatimPolygon()` gets the same miss → widen step (district
   search). **Deferred:** Overpass streets and node search outside
   known city boxes. Overpass needs a bbox, and a free bbox is its own
   small design problem.
4. Checks: add-form cases plus Impeccable. No gesture suites (no row
   or touch code touched).

What v1 leaves alone: the `cities` table, the chips, list and filter
behaviour, `resolveShapeCity()`, and new-city creation.

## 5. Owner browser tests (sandbox can't reach Nominatim/Overpass)

Before build (confirms the diagnosis):
- T1: map on Reykjavík, add → type a Stockholm place (e.g.
  "Vasamuseet"). Expect: no results today.
- T2: map on Stockholm, type "Uppsala domkyrka". Expect: no results
  today, which confirms the suffix drops same-country towns.
- T3: map on Copenhagen, type a Malmö place (e.g. "Malmöhus"). Expect:
  likely no results (suffix `København`).
- T4 (workaround check): set the form's City menu to Stockholm first,
  then T2's query. Tells us whether the menu workaround helps today.

After build: T1–T3 return the place. Uppsala and Malmöhus file under
Stockholm and Malmö with no prompt. A Bergen place shows "Add Bergen?".
Popular chains ("Espresso House") still return local results first.

## 6. Decisions only the owner can make

1. Fix scope: **(a)** B, search + filing (recommended) · **(b)** A only,
   search · **(c)** go straight to C, trips.
2. Day-trip radius: **(a)** 100 km · **(b)** 150 km · **(c)** 200 km ·
   **(d)** always ask.
3. When a widened search returns results, should rows from outside your
   city look different? **(a)** No, the address says where (recommended)
   · **(b)** add a small "farther away" divider.
4. Is LA a "home" or a past trip? **(a)** leave as-is ·
   **(b)** it's a separate trip, so it waits for C.
5. Street shapes outside known cities: **(a)** defer (recommended) ·
   **(b)** include in v1.
