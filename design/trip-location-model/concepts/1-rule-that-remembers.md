# Concept 1: a rule that remembers

Model only (owner: "the model is what to nail right now not ui"). No
screens, wording or controls. **(We think)** marks the team's opinion.

## What exists

- **Place:** a real location, its real city (from `address_details`),
  and the trip it belongs to.
- **Trip:** a group of places. It's made by the places, never ahead of
  them. Its name is generated from its countries, and can be renamed any
  time (never required).
- **Figure:** "the city I think of it with". A figure is a named set of
  real cities, belonging to one trip.
  - Example: figure Reykjavík = {Reykjavík, Grindavík, Reykjanesbær,
    Bláskógabyggð}.
  - A real city can be in more than one figure (Tårnby in Copenhagen and
    Malmö).
- **On the way:** places in a trip that are beyond every figure's reach.
  This isn't a figure; it's the absence of one.
- **Plan:** an ordered list of stops, belonging to a trip. It can cross
  figures.

## Stored vs. inferred

| Stored | Inferred (never stored on the place) |
|---|---|
| per place: location, real city, trip | the place's figure: from its real city, through the memory |
| per trip: the **memory** (which figure(s) each real city belongs to), the trip's optional name, and merges | "In" (its real city *is* the figure's own) vs. "From" (another real city in the figure) |
| | the trip's name, until renamed |

## Definitions

- **A figure's anchor:** the centre of its *named member*, which is the
  member real city with the most places (ties: the earliest). The figure
  takes that member's name.
  - So the first place in a region doesn't fix the name for good: log
    Roskilde before Tivoli, and the figure is "Roskilde" until
    København has more places. Then it's "Copenhagen", and Roskilde is
    From Copenhagen.
- **Within reach:** the new place's location is within the reach
  distance of a figure's **anchor**, never of its other members. That
  way figures can't snowball outward town by town.

## The rule (where a new place goes)

For a new place with real city R:
1. If R is already in the memory → its figure(s). (A big municipality
   joins once: Þingvellir brings Bláskógabyggð into Reykjavík, so Geysir,
   about 100 km out but in the same municipality, follows.)
2. Else, if the place is **within reach** of a figure's anchor **and in
   the same country** → R joins the nearest such figure (From).
3. Else, if it's **within reach but across a border** → R becomes a new
   figure at once: a neighbouring city, not a stop on the way. This is
   **the second signal (proposed, for the director)**; see below.
4. Else, if it's **inside the trip's spread** → On the way. When R has 2
   places, it becomes a figure of its own.
5. Else, if it's in the same part of the world → R becomes a new figure,
   and the trip widens.
6. Else (**far away**) → a new trip, started without asking.

### Why a second signal (the Malmö problem)

- Malmö is about 28 km from Copenhagen and Lund about 39 km, well inside
  a 60-80 km reach. Distance alone would file both From Copenhagen for
  good, and the owner's own example cities would merge.
- **Proposed signal: the country border.** A real city in another
  country never joins a figure by reach; it starts its own (rule 3).
  - Malmö (Sweden) → its own figure. Lund (Sweden) → From Malmö (same
    country, nearest). Tårnby (Denmark) → From Copenhagen.
  - It's places-first: nothing is asked, and it comes from data each
    place already has.
  - **Cost:** two close cities in the *same* country that the owner
    thinks of separately (Stockholm and Uppsala, about 65 km) still
    merge, until the owner fixes it once ("Uppsala is its own figure",
    one change).
- **Alternatives considered:**
  - **A city's size** (OSM tells a city from a town). It would also
    split Lund and Frederiksberg off as figures, which the owner
    probably doesn't want.
  - **The owner fixes it once.** It's always available, and it's the
    honest fallback for every case the border misses.
- **If the director rejects the border,** the honest answer is "the
  owner fixes it once": "Malmö is its own figure", one change, after
  which Lund still has to be checked.

- Reach, spread and far away are fixed app rules, never settings (the
  owner: no distance settings).
- **(We think):** reach is about a day trip (60-80 km), spread is the box
  around the trip's figures, far away is another continent. The
  threshold is 2. All unmeasured.
- **Known quirk:** the first place in a real city inside the box (Oslo)
  waits in On the way until a second arrives.

## What can be corrected, and when

- **A real city's figure(s), any time, once, for all its places now and
  later:** move it to another figure, add it to an extra figure, or make
  it its own figure. That changes the memory, never a place.
- **A new trip started for a far-away place:** undone right after adding
  (keep it in the current trip), or later by merging two trips (a
  trip-level change, not a place edit).
- **The trip's name:** any time.
- **Not correctable:** one place's figure on its own (that needs place
  edit, which is future). **(We think that's rare)** (owner question 1).

## How you move

- The current view is always exactly one of: a trip, a figure, On the
  way, or (empty) nothing yet.
- Trip ↔ figure is one step either way (job 4).
- Other trips are one step away and never mixed in (job 10).
- Places can be narrowed by real city, separately from figures (job 6).
- Plans belong to the trip; a figure's view includes the plans with any
  stop in it.
- Constraint (job 11): the map shows exactly the view's set.

## P: places-first

**PASS.** Nothing is created, named, chosen or dated before or during
adding. Trip and figure are inferred, and are exposed after the place is
added.

## Creation moments

| # | Moment | Outcome | Check |
|---|---|---|---|
| C1 | First open, empty | No trip, no figure. Search is worldwide | PASS |
| C2 | First place ever (Hallgrímskirkja) | A trip ("Iceland") and a figure (Reykjavík) now exist, named from the place. Nothing asked. **The current view becomes the new place's figure** (Reykjavík) | PASS |
| C3 | First place in a new real city within reach (Blue Lagoon, Grindavík) | Grindavík joins the nearest figure, Reykjavík (From). No new figure | PASS |
| C4 | Second place in a real city beyond every reach | It becomes a figure of its own (the threshold of 2). Within reach (Grindavík), it stays From however many places it has, unless corrected to "its own figure" | PASS |
| C5 | First place outside the spread, same part of the world (Tivoli while the trip is Iceland) | A new figure, Copenhagen, in the same trip. The generated name widens ("Iceland & Denmark") | PASS |
| C6 | A far-away place (Griffith Observatory) | A new trip ("United States") starts without asking. It can be undone right after (keep it in the current trip) | PASS |
| C7 | A hotel | Just a place in the Hotel category (no stays layer) | n/a |
| C8 | Correcting trips later | Merge two trips (a trip-level change) | PASS |
| C9 | Naming | Rename a trip any time; never needed | PASS |

## Test cases

| Case | Outcome | Check |
|---|---|---|
| T1 Øresund: Saltholm, Kastrup Søbad (Tårnby) | Tårnby (Denmark) joins the nearest same-country figure, Copenhagen; both places are From Copenhagen. Malmö is a figure of its own (rule 3, border). Moving Tårnby to Malmö is **one** correction that moves both | PASS (with the border signal; without it, the owner first makes Malmö its own figure, so two changes) |
| T2 airport: Keflavík (Reykjanesbær) | Reykjanesbær joins Reykjavík; the airport is From Reykjavík. Nothing chosen | PASS |
| T2 airport: Kastrup (Tårnby), for both cities | In Copenhagen by default. Adding Tårnby to the Malmö figure too (one change; Malmö exists by rule 3) puts the airport in both | PASS |
| T3 Jönköping | Beyond every reach, inside the spread → On the way. A second Jönköping place makes it a figure | PASS |

## Jobs (quick read for the checker)

| Job | Where |
|---|---|
| 1 | C2: the current view becomes the new place's figure |
| 2 | the trip view: every place, by figure, plus On the way |
| 3 | the figure view |
| 4 | one step either way |
| 5 | C3, T2 |
| 6 | narrowing by real city |
| 7 | the memory correction |
| 8 | plans belong to the trip |
| 9 | On the way |
| 10 | one trip at a time |
| 11 | the map constraint |
| 12 | the current view is one trip, figure, On the way, or nothing yet |
| 13 | a place exposes its figure and real city, after adding |
| 14 | n/a (concept 2) |

## Prerequisite

**59 of 202 places have no real town** (58 with no `address_details`, 1
with details but no town; live count, 2026-10-15). Until the
short-address backfill covers them, they're filed by location alone
(nearest figure).

## Open (owner questions)

1 (fix the rule or one place), 2 (a place in two figures), 6 (a quiet
new trip), 7 (the threshold of 2), **8 (new):** "When a place is close
to one of your cities but across a border (Malmö near Copenhagen),
should it be a city of its own automatically? We think yes. The cost:
two close cities in one country (Stockholm and Uppsala) count as one
until you fix it once." (Rule 3, the border, is on in this model as
sent **(we think)**; the owner's one fix exists either way.)
