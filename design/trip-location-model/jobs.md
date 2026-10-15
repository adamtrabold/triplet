# Trips, cities and places: jobs and checks

What the model has to let the owner do. Sketch level: the model, not UI.
Each job has a check a fresh checker can run against a concept's sketch
(boxes, arrows, a walk-through), and say PASS or FAIL.

Concepts this applies to (jam Turn 6):
1. **A rule that remembers.**
2. **Rule + stays.**
3. **No trip container.**
4. **Reference: today (B, one home per place).** Today fails several jobs
   on purpose; it's the comparison, not a candidate.

## The owner's words (verbatim, `owner.md`)

> "there are the "locations" (things you want to visit), "cities" they
> exist in, and "trips" they may be grouped to. there are also "plans"
> which may include "locations" in many "cities." i may as a user be
> starting from a few different points... i might be planning stops
> across a large trip (e.g. "scandinavia 2026" may include spots in
> copenhagen, stockholm, reykjavik, etc. and places in between). or i
> might be planning for a specific "city" within that "trip." the real
> challenge is that mentally i might be thinking of a location being
> tied to a specific "city" that it doesn't specifically reside in, and
> so when navigating the app, i may want to click "Reykjavik" as a
> filter, but also want to see, like, the Blue Lagoon or the Airport
> that technically exist within other cities in reality."

> "the usabiity model does not have to match with how we store data. the
> app should be as simple and low friction as possible"

> "i want to be clear, im wanting to rev the app workflow as a whole not
> just fit in new ideas. i want to make sure it all sings."

> "i do not want someone to have to manually do a bunch of shit to set up
> a thing before they just start getting to logging the places they want
> to go"

> "the philosophical approach should be places-first; immediately doing
> the thing you actually want to do not the adin"

Earlier: "This is separate from filters which should have a filter by
city." Settled: editing a place is future; nothing saves without an
explicit ADD; hold-to-place is future.

## The governing rule: places-first

**P. Log or see places immediately.** Trips and cities come out of the
places, never ahead of them.

- **PASS if** nothing (a trip, a city, a group, a date) has to exist,
  or be created, named or chosen, before or as a condition of logging a
  place, and adding a place asks for nothing structural.
- **FAIL if** any of that is required, or adding asks which trip or
  city.

Every job below is read through P.

## Terms (one meaning each)

The distances are fixed app rules, never settings, and unmeasured (the
team's opinion):
- **Figure:** "the city I think of it with", a named set of real cities.
- **Anchor:** the centre of a figure's named member, the member real city
  with the most places (ties: the earliest). The figure takes that name.
- **Reach:** about a day trip, measured from a new place to a figure's
  **anchor** (we think 60-80 km).
- **Within reach, same country:** the place's real city joins the
  nearest such figure ("From").
- **Within reach, across a border:** a new figure at once (the border
  signal; proposed in Turn 14, pending the director).
- **Spread:** the box around the trip's figures. Beyond every reach but
  inside it, a place goes to **On the way**.
- **Outside the spread, same part of the world:** a new figure in the
  same trip, and the trip widens.
- **Far away** (we think another continent): a new trip (concepts 1 and
  2), or a new cluster (concept 3).
- **Base, order, leg** (concept 2):
  - a base is a figure with a stay (a Hotel place);
  - only bases are ordered, each by its stays' earliest date, else its
    first visit, else not at all;
  - a leg is the stretch between two consecutive ordered bases.
    **Legs are off by default**; they exist only if the owner asks for
    them (Q4, Turn 15).

## Jobs

1. **Log a place on the very first open.**
   - Check: from an empty app, log a place. PASS if no trip or figure
     existed or was asked for beforehand, and afterwards a trip and a
     figure exist **and the current view is the new place's figure**.
2. **See a whole trip at once.**
   - Check: PASS if one view holds every place in the trip, grouped by
     figure (and On the way, and in concept 2 by leg), and the map shows
     the same set. Concept 3: the cluster.
3. **Focus on one city of a trip.**
   - Check: PASS if one view holds exactly one figure's places, and the
     map shows the same set.
4. **Move between the trip and a city in one step, either way.**
   - Check: PASS if trip → figure and figure → trip are each one step.
5. **See a place under the city you think of it with, without filing
   it.** The Blue Lagoon (Grindavík) and Keflavík airport (Reykjanesbær)
   come under Reykjavík.
   - Check: PASS if, after logging both with nothing chosen, both are in
     the Reykjavík figure. FAIL if that needs a per-place choice.
6. **Find places by where they really are** ("a filter by city").
   - Check: PASS if places can be narrowed to one real city (Grindavík),
     separately from figures.
7. **Fix a wrong grouping without editing a place** (edit is future).
   - Check: PASS if "Lund goes with Copenhagen" is one change, which
     moves every Lund place, now and later. FAIL if the only fix is per
     place, or impossible.
8. **Plans that cross cities.**
   - Check: PASS if a plan can hold stops from more than one figure, and
     a figure's view includes the plans with a stop in it.
9. **Places in between have a home.**
   - Check: PASS if a place beyond every reach but inside the spread
     (Jönköping) belongs to a named group, not to an arbitrary figure:
     - **On the way** (all concepts, by default);
     - or, only in concept 2 with legs turned on and an order, **the
       leg** whose line between two ordered bases is nearest to it.
       Places on no leg stay in On the way.
10. **Other trips stay out of the way** (concepts 1 and 2), **or
    everything is visible at once** (concept 3).
    - Check (1, 2): PASS if another trip's places never mix into this
      trip's views, and that trip is one step away.
    - Check (3): PASS if all places can be seen together, with the
      clusters distinct and nameable.
11. **The map shows what the list shows.**
    - Check: PASS if every view's map set equals its list set (zoom may
      hide pins on the map; it never changes the list).
12. **It's always clear what you're looking at.**
    - Check: PASS if every view is exactly one of:
      - a trip;
      - a figure (narrowed by real city or not; it's still the figure);
      - On the way;
      - nothing yet (empty);
      - concept 3: everything, or a cluster.
    - In concept 2 a leg is a group inside the trip view, not a view.
13. **A place shows both truths.**
    - Check: PASS if a place exposes its figure and its real city, and
      neither was asked for when it was added.
14. **Stays only matter if you log them** (concept 2). All three must
    hold:
    - (a) With no stay, concept 2 is identical to concept 1, visits or
      not.
    - (b) A new undated, unvisited stay makes its figure a base with no
      position. Nothing else moves.
    - (c) Bases with a date (or a first visit) take positions in order.
      No-figure places stay On the way (legs only if the owner turns
      them on).
    - No date is ever asked for.

## Creation moments (each checked against P)

| # | Moment | PASS if | FAIL if |
|---|---|---|---|
| C1 | **First open, empty** | no trip, no figure exists; search is worldwide | any trip, city or setup step exists or is required |
| C2 | **The first place ever** | a trip and a figure exist afterwards, named from the place (country, real city); the current view is that figure; nothing asked | a name, trip or city was requested |
| C3 | **The first place in a new real city within reach, same country** (Grindavík) | it joins that figure (From); no new figure | a question, or a new figure from that one place |
| C4 | **The second place in a real city beyond every reach** (On the way) | it becomes a figure (threshold 2, a fixed rule; the number is the team's opinion). Within reach, a real city stays From however many places it has, unless corrected to "its own figure" | a setting, a question, or a within-reach city splitting off on its own |
| C5 | **The first place outside the spread, same part of the world** (Copenhagen while the trip is Iceland), **or within reach across a border** (Malmö while the trip has Copenhagen) | a new figure in the same trip from that one place; the generated trip name widens. Concept 3: a new figure in the same cluster | a question, or a forced new trip |
| C6 | **A far-away place** (LA) | concepts 1 and 2: a new trip starts without asking, named from its country, and can be undone right after (keep it in the current trip). Concept 3: a new cluster, named from its country, correctable any time after ("these go together") | a question before adding |
| C7 | **A stay** (concept 2) | job 14 (b) and (c) | a date prompt, a required date, or any setup |
| C8 | **Correcting trips later** | merging two trips (concepts 1 and 2), or "these go together" / "these are separate" (concept 3): never a place edit | the only fix is editing places |
| C9 | **Naming** | a trip or cluster can be renamed any time, optionally; a custom name survives the trip or cluster growing | renaming is required to proceed |

## Test cases (run each through each concept)

| Case | PASS if |
|---|---|
| **T1 Øresund:** Saltholm, Kastrup Søbad (both in Tårnby municipality; Saltholm's we believe, not verified) | **Both branches must hold:** (i) **border on:** both are in the Copenhagen figure with nothing chosen; Malmö is already a figure; putting Tårnby with Malmö is **one** change that moves both. (ii) **border off:** both are in the Copenhagen figure with nothing chosen; Malmö first has to be made a figure (one change), then putting Tårnby with Malmö is one more: **two changes**, each moving every place of its real city. FAIL if either branch needs a per-place change |
| **T2 The airport:** Keflavík (Reykjanesbær, about 50 km from Reykjavík); Kastrup (Tårnby), for both Copenhagen and Malmö | Keflavík is in Reykjavík with nothing chosen. Kastrup is in Copenhagen, **and in Malmö too after one change** (Tårnby in both figures). In concept 2 an airport has a figure, so it's never on a leg |
| **T3 Jönköping:** about 300 km from both Stockholm and Malmö | it's in **On the way** (all concepts, by default). Only in concept 2 with legs turned on and Copenhagen and Stockholm as consecutive ordered bases: on their leg. A second Jönköping place makes it a figure (C4) |

Reference (today): it fails P and jobs 1-10 and 13, and passes 11 (list
and map share the same filtered set) and 12.

## What the model stores, and its prerequisite (checked)

- **Concept 1 stores:**
  - per place: its real location, real city and trip;
  - per trip: the memory (which figure(s) each real city belongs to),
    an optional name, and merges.
- **Concept 2 stores** concept 1's, plus a stay's date range when it has
  one, and **per place, when it was first marked visited** (a new
  field). Bases, order and legs are inferred.
- **Concept 3 stores:**
  - per place: real location and real city (no trip);
  - one global memory;
  - "these go together" / "these are separate" rules and an optional
    cluster name, keyed by member figures, so they survive the cluster
    growing.
- **The real city comes from `locations.address_details`.** That's the
  raw OpenStreetMap address written at add since 2026-10-05; the short
  address uses the same column. The city is its city, town, village or
  municipality.
- **Today (2026-10-15, live count):** 144 of 202 places have it, and 143
  name a town. **59 places have no real town:** 58 with no
  `address_details`, and 1 with details but no town.
  - The prerequisite: run the short-address backfill again for the 58.
    Until then, those are filed by location alone (the nearest figure).
  - The "0/202" in CLAUDE.md and `docs/iphone-checks.md` is stale.

## Dates (concept 2), as ruled in Turn 12

- **In:** order from first visits (needs the stored "first visited at").
- **In, as "we think":** dates read from a booking the owner pastes when
  adding a hotel. It's unreliable; a wrong date can only be fixed before
  adding (edit is future).
- **Held back, but visible to the owner:** an optional date on hotels.
- **If neither date route is accepted,** order comes from visits only.

## Out of scope

- UI. The owner: "the model is what to nail right now not ui".
- Editing a place, and hold-to-place: both future (owner).
