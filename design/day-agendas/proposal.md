# Day agendas — v1 scoping proposal

Discovery only, no code. Written in response to the open item "Day agendas
— plan AND follow an ordered route" (owner, 2026-09-27). Environment check
redone for this task: no MCP connector reaches a routing/maps provider (only
Claude_Docs, github, and Supabase are attached; a search of the full
deferred-tool registry turns up nothing maps-shaped) — this reconfirms
CLAUDE.md's existing note, it doesn't change it. So v1 has to be scoped
assuming zero live routing data, in this sandbox or the owner's browser.

## 1. The smallest v1 that tests "plan an order, then follow it"

**An ordered list of existing pins, scoped to one day, with a big
prev/next "on the ground" mode.** Concretely:

- The owner picks a day and drags/taps a subset of that city's *existing*
  `locations` rows into an order. No new places are created here — an
  agenda is a sequencing of stops that already exist on the map.
- The map gets numbered markers (1, 2, 3…) for the agenda's stops instead
  of category glyphs, so the plan is visible spatially, not just as a
  list.
- A "Start" control switches the agenda into a follow mode: one stop at a
  time, large, with prev/next and a direct "Get Directions" hand-off to
  Apple Maps for *that* stop (reusing `directionsUrl()` exactly as it
  works today — no change to it). Advancing can be manual (tap Next) for
  v1; auto-advance on arrival/visited would need geolocation, which is a
  separate, later decision (see §3).
- Marking a stop visited from follow mode reuses the existing
  `toggleLocationFlag()`/visited machinery — an agenda stop and a list row
  are the same underlying `locations` record, so visited state, the star,
  and the stamp all keep working unmodified.

This tests the actual hypothesis (does having a *committed order*, and a
*mode to walk it*, change how the owner uses the app on a real day) without
building or depending on any routing/travel-time data. It is deliberately
"maps-app-*flavored*", not "maps-app-*equivalent*".

## 2. What v1 needs

**Schema** — one new table, no changes to `locations` or
`neighborhood_shapes`:

```
day_agendas
  id            uuid pk
  city          text        -- which CITIES entry, mirrors locations.city
  date          date null   -- optional; the owner may want "Day 3" before
                             -- real dates are assigned (see trip/place item)
  label         text        -- e.g. "Reykjavik day 2"
  created_at    timestamptz

day_agenda_stops
  id            uuid pk
  agenda_id     uuid fk -> day_agendas
  location_id   uuid fk -> locations      -- only pins, not shapes (see below)
  position      int         -- 1-based order, resequenced on reorder
  created_at    timestamptz
```

RLS: same pattern as the other three tables (public `SELECT`; write
restricted to the two owner emails).

Why a join table and not, say, an `agenda_position` column on `locations`:
a place can belong to zero or one agenda today, but the join table doesn't
foreclose a place appearing on two different days (e.g. a repeat coffee
stop) without a schema change later, and it keeps `locations` from growing
agenda-shaped columns for what is fundamentally a separate concern
(sequencing, not "where is this place").

Shapes (`neighborhood_shapes`) are **excluded from v1 agendas** — same
reasoning CLAUDE.md already gives for excluding them from Get Directions
(no single natural destination point / no visited column yet). A district
can still be referenced informally (put a pin at its centroid, or just
note it) but isn't a first-class agenda stop yet.

**UI surface** — a new mode, not a rewrite of the existing list:

- A new top-level view/tab ("Agenda" alongside the current list/filters),
  scoped to the active city like everything else. Reuses `visibleLocations()`-style
  filtering to pick candidates, then a lightweight add-to-agenda action per
  row (star and visited already prove one-tap-from-the-row actions work
  well here; a plain "+ Add to today" button per card is enough, no new
  gesture needed for v1).
  A drag-to-reorder list of just that day's stops, numbered.
  A "Start" button that enters follow mode (full-screen-ish, one stop at
  a time, prev/next, the stop's existing popup content minus the map
  chrome, plus Get Directions).
- Map integration: when an agenda is active, its stops render with number
  badges instead of category glyphs (or a small number badge layered on
  the existing marker — cheaper, keeps category color/glyph info). This
  is new marker-rendering logic but does not touch `markerIcon()`'s
  existing size/glyph/cluster system for non-agenda view.
- Follow mode's prev/next should call the existing `focusMap()`/
  `highlightMarker()` path so the map pans/zooms to each stop as you
  advance — same click-to-navigate contract as everything else, not a new
  navigation mechanism.

**Follow, given Get Directions already exists per stop:** v1's "follow" is
*sequencing + one tap to Apple Maps per stop*, not turn-by-turn or a drawn
route. This is very likely sufficient to test the concept: the thing being
tested is "does committing to an order and walking it stop-by-stop help,"
not "does in-app routing help" — those are separable, and the second is
expensive to build speculatively.

## 3. Explicitly OUT of v1 (deferred, not abandoned)

- **Drawn routing lines between stops.** Needs a routing provider (OSRM/
  Mapbox/Google Directions/etc.) reachable from the *owner's browser*
  (confirmed again this session: no MCP connector reaches one, matching
  CLAUDE.md's existing Nominatim/Overpass finding). Worth a provider
  reachability + ToS check before any commitment, but that's its own
  discovery task, not bundled into v1.
- **Live travel-time / ETA between stops.** Same dependency as above, plus
  it implies picking a travel mode (walk/transit/drive) per leg — a real
  design decision, not a technical afterthought.
- **Drag-reorder with live recalculation** (of route/time as you drag).
  v1's drag-reorder just rewrites `position` integers; there is nothing to
  recalculate without routing data, so this is naturally deferred with it.
- **Auto-advance on geolocation/arrival.** Possible later, but adds a
  permission prompt and battery/accuracy concerns the owner hasn't asked
  for; manual Next is enough to test the core idea.
- **Multi-day trip view / calendar.** One agenda = one day's stops for
  v1. A trip-level view is a natural v2 once the trip/place model
  (below) is settled.

## 4. Interaction points with sibling open items (flagged, not solved here)

- **List ordering pass:** the agenda view is a *second*, separate ordering
  (per-day, owner-curated) layered on top of whatever the main list's
  default sort becomes. They shouldn't fight — e.g. if list ordering ships
  "starred first" or "visited last," the agenda view's explicit
  `position` column should stay independent and always win inside agenda
  mode. Worth deciding together which one the owner reaches for by
  default once both exist.
- **Trip/place location model rework:** `day_agendas.city` and the
  optional `date` column above lean directly on however "trip" ends up
  modeled. If a `trips` table is introduced, `day_agendas` likely wants a
  `trip_id` instead of (or in addition to) `city`, and `date` becomes
  real trip-context data (CLAUDE.md's "Phase 2 — trip context
  (dates/closures)") rather than a loose nullable field. Don't build the
  agenda schema first and then retrofit — sequence discovery so the trip
  model is at least sketched before `day_agendas` is finalized, or accept
  a migration later.
- **Personal priority (star):** already shipped and orthogonal — a
  starred place can be added to an agenda and keeps its star; no
  interaction needed. Possible v2 idea: default-suggest starred, unvisited
  places when building a new day's agenda (not scoped here).

## 5. Open questions for the owner

1. Does a stop's order matter *within* a day only, or does the owner ever
   want cross-day sequencing (e.g. "save this for day 3")? Affects whether
   `day_agendas` needs the `date` field now or can stay dateless until the
   trip/place rework lands.
2. Is follow mode a separate full-screen view, or a collapsed strip that
   sits above the current map (so the map/list are still visible while
   following)? Affects UI surface scope more than schema.
3. Should adding a stop to today's agenda also pull it out of consideration
   for other days (a place used once), or is repeat use intentional (a
   recurring lunch spot)? Affects whether `day_agenda_stops` needs a
   uniqueness constraint.
4. Is manual Next enough for the on-the-ground test, or does the owner
   want to try geolocation-based "you've arrived" nudges even in v1? (My
   recommendation: manual only for v1, revisit after a real day's use.)
5. Any appetite for checking a specific routing provider's reachability
   from the owner's own browser (not this sandbox) as a fast side-quest,
   so a routing follow-up isn't blocked on discovering *that* later? Not
   required for v1, but cheap to check now if the owner's curious.
