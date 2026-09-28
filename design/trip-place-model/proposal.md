# Trip vs. place location model — discovery proposal

Status: **discovery only, nothing built.** Owner opened 2026-09-23; this
doc written 2026-09-28. No code or schema touched. Line/function
references are to `index.html` as of this commit.

## 1. The problem, precisely

Every geocoding call in the app funnels through one function:

```js
async function currentSearchCityConfig() {
  if (userOverrodeCity) return cityConfig(formCityId());
  const ctx = detectCityContext();          // nearest CITIES entry to map center, ≤75km
  ...
  return ctx.cfg;                            // { countrycodes, viewbox, geocodeSuffix, bounded? }
}
```

and `nominatim()` (`index.html:2568-2585`) applies that config's
`countrycodes` as a **hard filter** (`params.set('countrycodes', ...)`,
comment: "results outside these countries are not returned at all") and
its `geocodeSuffix` as a literal string appended to the query
(`` `${query}, ${cfg.geocodeSuffix}` ``, e.g. `"Eiffel Tower, Iceland"`).

`CITIES` (`index.html:2215-2231`) is a small hand-authored map of 5
entries — `la`, `reykjavik`, `copenhagen`, `malmo`, `stockholm` — each
carrying `label`, `center`, `zoom`, `geocodeSuffix`, `countrycodes`,
`viewbox`. It is extended at runtime by `addCity()`/`fetchCities()`
against a `cities` table, but every new row is the same shape: a
five-field geocoding+map config keyed by a slug id.

**`cities` is asked to be two different things at once:**

1. **A geocoding scope** — "when the user is adding something right now,
   which country/bounding box should Nominatim search inside, and what
   suffix string disambiguates a same-named place (e.g. bare
   `"Malmö"` vs `"København"`)?" This is inherently per-search, ideally
   inferred from context (map viewport, or where the *place itself*
   turns out to be), and it's fine for it to be wrong sometimes — it's a
   ranking/filtering hint for one geocode call.

2. **A durable filing category for a saved place/shape** — `locations.city`
   and `neighborhood_shapes.city` are foreign-key-like string columns
   that drive the city selector, the list/map filter (`filters.city`),
   `resolveShapeCity()`'s majority vote, and orphan cleanup
   (`cleanupOrphanCities()`). This is a **one-time-at-save, then stable**
   classification the owner uses to browse ("show me Reykjavík") — it
   has nothing to do with search scoping once the place is already
   found.

Today one row in one table is forced to serve both roles, and the
**search-scoping role is applied too early and too rigidly**: before a
search even runs, `currentSearchCityConfig()`/`formCityId()` pick a
single `CITIES` entry (from map viewport proximity or the form's
`cityInput` <select>) and that entry's `countrycodes` becomes a hard
exclusion. If the owner is planning around Reykjavík (`activeCity =
'reykjavik'`, `countrycodes: 'is'`) and searches for a stop in, say,
Bergen, Norway — outside Iceland — Nominatim is asked with
`countrycodes=is` and can structurally never return a Norwegian result,
no matter how exact the query text is. A same-country miss (e.g.
searching a Malmö address while `cityInput` is set to `stockholm`) fails
softer — it isn't excluded, but it's ranked against the wrong
`geocodeSuffix`/`viewbox` bias and can rank behind noise or resolve to
the wrong disambiguation.

The owner's mental model (their words, restated): **a trip is one
overarching place-ish context; the places on it can be anywhere** — a
day trip, a stop en route, a different country entirely. Nothing today
represents "the trip" as a concept above the city list; `CITIES` **is**
the trip's location vocabulary, so the geocoding hard-filter derived
from it inherits an assumption ("you're only ever adding things inside
one of these five boxes") that was true for a same-region hop
(Copenhagen/Malmö, deliberately overlapping `countrycodes`) but false in
general.

Constraint from the owner, restated for design purposes: **whatever
changes, adding a place must stay a single, fast action** — no forced
"which trip/city is this?" picker before search even starts working.

## 2. Model options

### Option A — Loosen search; keep `cities` as-is (no new concept)

Stop using `countrycodes` as a hard filter for the general case. Keep
`viewbox`/`geocodeSuffix` as **soft** ranking hints (they already are
soft per the code's own comments) derived from `detectCityContext()`,
but drop `countrycodes` from the query — or keep it opt-in only via an
explicit "narrow to a country" toggle the owner can flip for a truly
ambiguous query (e.g. "Malmö vs. Malmo, ID").

- **Schema:** none. `CITIES`/`cities` table untouched.
- **Add-form UX:** none. Same `cityInput` select, same submit flow. The
  only visible change is that search returns results outside the
  current country when they're a good text match.
- **Search/geocode call:** `nominatim()` drops the hard
  `countrycodes` param in the default path; `viewbox` alone biases
  ranking. `geocodeSuffix` might also need softening — instead of
  literally appending `", Iceland"` to every query (which actively hurts
  a Bergen search by asking Nominatim to rank against an irrelevant
  suffix), stop appending it when the query already looks like a full
  address, or drop appending it altogether and rely on `viewbox` alone
  as the bias signal.
- **What place gets filed under:** unchanged — still whatever
  `formCityId()` resolves to (the form's `cityInput`, defaulting from
  `activeCity`/proximity). A place found in Bergen while `cityInput`
  still reads "Reykjavík" gets saved with `city: 'reykjavik'` — wrong
  filing, but at least the search wasn't blocked.
- **Low-friction:** best of the three — zero new steps, zero schema
  work. The failure mode moves from "can't find it at all" to "found it,
  but filed under the wrong city until the owner notices and fixes
  `cityInput`" (the `matchCity()`/`maybeDetectCity()` machinery already
  exists for pins via `addressDetails` reverse-lookup and could correct
  this automatically post-search — see Option B, which reuses exactly
  that).
- **Downside:** doesn't touch the actual conflation. It's a real
  improvement (unblocks search) but leaves the "trip" concept implicit
  forever, and doesn't solve shapes (`resolveShapeCity()`) the same way
  since shapes have no free-text query to loosen — their city
  classification is already geometry-based post-fetch, not
  country-filtered at query time (worth checking whether shapes hit
  this bug at all — see open question below).

### Option B — Decouple "trip" from "place city"; auto-classify after the fact (recommended shape)

Introduce a **trip** as a first-class-but-lightweight concept: one row
(or even a single client-side constant, if there's truly only ever one
active trip at a time — see open question) that carries *just* the
overarching geocoding bias — roughly what `CITIES` entries already
carry (`viewbox`/`countrycodes`/`geocodeSuffix`), but scoped to the
**trip**, not to an individual "filed-under" city. `cities`/`CITIES`
keeps existing as the "which bucket does this saved place belong to for
browsing" list — unchanged in shape, just relieved of the geocoding-hard-filter
job.

- **Schema:** new `trips` table — `id`, `label`, `countrycodes` (the
  union of every country the trip touches: `'is,dk,se,us'` today),
  `viewbox` (a generous bounding box covering the whole itinerary, or
  null to mean "no hard box, just bias"), `active` (boolean, since v1
  only needs "the one current trip"). No FK from `locations`/
  `neighborhood_shapes` — they keep their existing `city` column
  untouched. This is intentionally the smallest possible new object:
  it's a search-time config, not a data-ownership relationship.
- **Add-form UX:** **unchanged**. The add-location flow already doesn't
  ask "which city?" up front for search — `cityInput` defaults silently
  (`defaultFormCity()`) and the user only ever touches it if the
  auto-guess is wrong. Search just uses the trip's wider
  `countrycodes`/`viewbox` instead of the single nearest city's. Filing
  (`formCityId()` → `locations.city`) still happens exactly as today,
  via `matchCity()`/`maybeDetectCity()` — which is the piece that
  *already* runs after a result comes back and reconciles it against the
  known `CITIES` set, including the `shapeCityConfirm`-style "this looks
  like a new city, add it?" dialog for pins that don't match any
  existing box. Nothing here forces a second decision before results
  render.
- **Search/geocode call:** `currentSearchCityConfig()` returns the
  active trip's `countrycodes`/`viewbox`/`geocodeSuffix` instead of the
  nearest `CITIES` entry's. `nominatim()` itself is unchanged — it just
  gets called with a wider-but-still-real config, so the existing
  soft/hard distinction in the code comments stays accurate, just
  applied at the trip level. A same-trip, different-city query (Bergen
  while browsing Reykjavík) now succeeds because Bergen's country isn't
  excluded; a Copenhagen/Malmö-style same-country ambiguity is
  unaffected (still resolved downstream by `matchCity()`'s
  viewbox-containment, same as today).
- **Low-friction:** equal to Option A for the *common* case (nothing new
  to click), and better for the *classification* case: because trip and
  filing-city are now separate, the owner never has to reconcile "I
  searched under Reykjavík but this is actually in Bergen" — filing
  already runs through the existing new-city-confirm path, which was
  built for exactly this (`maybeDetectCity()`/`showNewCityConfirm()`).
  One new admin surface: someone (owner, or a one-time migration) has to
  set the trip's `countrycodes`/`viewbox` once — but that's a single
  config, not a per-add step, and could default to *the union of all
  current `CITIES` countrycodes* so day one requires zero manual input.
- **Downside:** one new table + one new runtime object to keep in sync
  (though it's read-mostly — written only when the trip's scope
  changes, which should be rare). Slightly more moving parts than
  Option A for a benefit that's mostly about *correct filing*, not
  *search success* (Option A alone already unblocks search).

### Option C — Full trip/place separation with per-place free country

Go further than B: places get an explicit "this is outside my usual
cities" mode — e.g. a place can be saved with no `city` at all (an
"unfiled" bucket, shown in `ALL_CITIES` view only), or the add-form
gains an optional "far from home" toggle that removes country
restriction entirely for that one search regardless of trip config.

- **Schema:** `locations.city`/`neighborhood_shapes.city` become
  nullable (already are foreign-key-like strings, not enforced FKs, so
  this is just relaxing app logic, not a migration) plus whatever UI
  needs to render "unfiled" rows in the list/filter chips.
  `CATEGORY_COLORS`-style special-casing needed wherever `city` is
  assumed non-null (`cardsById`/`syncLocationCards()`, city selector,
  `cleanupOrphanCities()`'s reference-counting).
  A `trips` table as in Option B, or skip it and keep search unscoped
  entirely (no hard filter, no soft bias at all) when the toggle is on.
- **Add-form UX:** adds a real decision point — a toggle, or a "not
  finding it? search everywhere" fallback link under the autocomplete
  results. Even styled as an escape hatch rather than a mandatory step,
  it's still a UI element that has to be designed, and the owner's
  stated constraint is explicitly about not adding *any* required
  step — an optional one is lower-risk but still more surface than A/B.
- **Search/geocode call:** conditionally unscoped Nominatim call (no
  `countrycodes`, no `viewbox`) when the toggle fires.
- **Low-friction:** worst of the three for v1 — it's the only option
  that adds a new interactive element to the add flow, even if
  optional/hidden-by-default. It does fully solve "an entirely
  unplanned one-off stop with no sensible city bucket" in a way A/B
  don't (A/B still expect the place to land in *some* city bucket
  eventually).
- **When it'd be worth it:** if, after B ships, the owner finds
  `maybeDetectCity()`'s new-city-confirm dialog firing constantly for
  places that don't deserve a whole new city bucket (a single
  gas-station stop en route doesn't need to become a first-class city).
  That's a real possible outcome of B and is called out as an open
  question below.

## 3. Recommendation

**Option B**, as a foundation, with Option A's search-loosening folded
in as its actual implementation detail (B doesn't work without also
softening `countrycodes`/`geocodeSuffix` handling in `nominatim()`  — A
is a subset of B's mechanics, not an alternative path). Reasoning:

- It directly names the thing the owner described — "a trip has an
  overarching location; places may not match it" — as one small new
  object, without touching the two things that already work
  (`CITIES`-as-filing-bucket, `matchCity()`/new-city-confirm as the
  reconciliation path).
- It reuses `deriveNewCityConfig()`/`addCity()`/`resolveShapeCity()`
  almost verbatim — those were already built to answer "does this point
  belong to an existing bucket, and if not, should we mint one?", which
  is exactly the filing question. The trip object only replaces the
  *scoping* input to search, not the filing logic.
- It satisfies the low-friction constraint by construction: the trip
  config is set once (or defaults automatically from the union of
  today's 5 `CITIES`), not touched per add.
- Option C solves a real but narrower and not-yet-confirmed problem
  (truly unfileable one-offs) at a UX cost the owner explicitly doesn't
  want to pay yet. It's a plausible *follow-up* to B, not a v1
  requirement — defer it until B ships and the owner reports whether
  the new-city-confirm dialog firing for one-off stops actually bothers
  them in practice.

### Phased build plan

**v1 (minimal, ships the actual fix):**
1. Add a `trips` table: `id`, `label`, `countrycodes`, `viewbox`,
   `active`. Seed it with one row whose `countrycodes` is the union of
   the 5 seed `CITIES` entries' countrycodes (`'us,is,dk,se'`) and whose
   `viewbox` is their combined bounding box (or `null`/very generous, if
   a genuinely unscoped soft bias is preferred over a computed box).
2. `currentSearchCityConfig()` returns the active trip's scope instead
   of `detectCityContext()`'s nearest-`CITIES`-entry guess, for the
   *hard-filter* fields only (`countrycodes`). Keep `viewbox` sourced
   from `detectCityContext()` (still useful as a *soft* per-search bias
   toward whichever city the map/form is actually near) — i.e. hard
   filter widens to trip scope, soft ranking stays city-local. This is
   the one line of actual behavior change worth isolating and testing
   first.
3. Confirm `matchCity()`/`maybeDetectCity()`/`showNewCityConfirm()`
   already handle "found a place outside every known city's viewbox" —
   reading the code, they do (that's the whole point of the
   low-confidence branch in `deriveNewCityConfig()`), so this should be
   close to zero new logic, mostly a rewire of which config function
   feeds `nominatim()`.
4. Smoke-test (owner's browser, per the environment constraint) with a
   search for a place genuinely outside all 5 current cities' countries
   while one of them is active/selected.

**Deferred:**
- A `trips` **admin UI** (add/edit trip scope) — v1 can hardcode/seed
  the single active trip's scope directly in SQL or as a `CITIES`-style
  bootstrap constant; only build UI once there's a second trip or the
  scope needs to change often.
- Multiple simultaneous trips / trip switching — out of scope until the
  owner actually plans a second trip; today's single hardcoded/seeded
  row is enough.
- Option C's "unfiled place" / free-search toggle — revisit only if v1
  makes new-city-confirm noisy for one-off stops.
- Any relation to Phase 2 "trip context (dates/closures)" in the
  deferred roadmap — that's a different, larger feature (opening
  hours/closures keyed by date) that could plausibly live on the same
  `trips` row later, but shouldn't gate this fix.

## 4. Open questions for the owner (not guessed)

1. **Does a `trips` table need to exist as real, owner-editable data in
   v1, or is a single hardcoded/seeded scope (no admin UI, edited via
   the Supabase MCP connector when the owner starts a new trip) enough
   for now?** The proposal above assumes the latter to minimize new
   surface, but that's a call about how often trip scope will change,
   which only the owner can make.
2. **Is there ever more than one trip active at once** (e.g. planning
   next year's trip while still using this year's data), or is "trip" in
   practice always exactly one row / one hardcoded scope? This decides
   whether `active` boolean logic is needed at all in v1 or can be
   deferred entirely.
3. **What should `viewbox`/ranking bias do for a query when the map
   isn't near any known city at all** (already a real code path today —
   `detectCityContext()`'s `known: false` branch falls back to a
   viewport-bounded search) — should the trip's own wide viewbox take
   over here too, or is the existing behavior (bounded search on the
   current viewport, `bounded: true`) fine to leave as is?
4. **Does the "new city, add it?" dialog firing for one-off far-away
   stops need suppressing** — e.g. should a place resolved outside every
   known city just get filed with `city: null` / an "unfiled" bucket
   instead of always prompting to mint a new city bucket? This is
   Option C's core question — it doesn't need an answer before v1 ships,
   but the owner should decide whether to watch for it as a follow-up
   signal or design it now.
5. **Do shapes (`neighborhood_shapes`, `resolveShapeCity()`) actually
   hit this bug at all?** Shapes are found via a name + `cfg.viewbox`
   Nominatim/Overpass call, not a country-hard-filtered address search
   in the same way — worth the owner confirming whether shape-adding for
   an out-of-trip city has ever actually failed, or whether this issue
   is pins-only in practice. If pins-only, v1's fix can stay scoped to
   `geocode()`/`searchAddress()` and leave `nominatimPolygon()`/
   `overpassWay()`'s `cfg` sourcing untouched.
