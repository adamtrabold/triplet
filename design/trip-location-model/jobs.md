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

## Terms (one meaning each; Turn 18)

- **Figure** (a "city" in the concept files): "the city I think of it
  with", a named group of places in one trip, made by rule 1 and the
  fixes.
- **Reach:** about a day trip (we think 60-80 km, unmeasured), measured
  to a figure's anchor (plumbing).
- **Rule 1:** each place by its own distance: within reach → the
  nearest figure; otherwise a figure of its own, even with one place.
  Only the owner's fixes override it; nothing else is remembered.
- **Rule 2:** a place joins its city's trip. A place on a continent
  where you have no trip starts one quietly, named from its country.
  Concept 3 instead works trips out by continent and a time gap (we
  think 6 months).
- **Fixes (rule 3), after the fact, never asked first:**
  - a town **goes with** another figure, **is its own**, or **also
    belongs with** a second figure (each global: every place in that
    town, now and later, in every trip);
  - a figure **splits off** into its own trip ("places you've already
    been stay with the old trip");
  - two trips **merge** (concept 3: "these go together" / "these are
    separate" instead).
- **Known limits** are listed in each concept file, one line each; they
  aren't rules.
- **Base and order** (concept 2): a base is a figure with a hotel; bases
  are ordered by hotel dates, else first visit, else not at all.
  Stretches between bases are off by default (Q4).
- Gone in Turn 18: the spread and band, On the way, the two-place
  threshold, "past", the automatic border (now an option, Q8).

## Jobs

1. **Log a place on the very first open.**
   - Check: from an empty app, log a place. PASS if no trip or figure
     existed or was asked for beforehand, and afterwards a trip and a
     figure exist **and the current view is the new place's figure**.
2. **See a whole trip at once.**
   - Check: PASS if one view holds every place in the trip, grouped by
     figure, and the map shows the same set.
3. **Focus on one city of a trip.**
   - Check: PASS if one view holds exactly one figure's places, and the
     map shows the same set.
4. **Move between the trip and a city in one step, either way.**
   - Check: PASS if trip → figure and figure → trip are each one step.
5. **See a place under the city you think of it with, without filing
   it.** The Blue Lagoon (Grindavík) and Keflavík airport (Reykjanesbær)
   come under Reykjavík.
   - Check: PASS if, after logging both with nothing chosen, both are in
     the Reykjavík figure **and each still exposes its real town**. FAIL
     if that needs a per-place choice, or the real town is lost.
6. **Find places by where they really are** ("a filter by city").
   - Check: PASS if places can be narrowed to one real town (Grindavík),
     separately from figures.
7. **Fix a wrong grouping without editing a place** (edit is future).
   - Check: PASS if "Lund goes with Copenhagen" is one fix, which moves
     every Lund place, now and later. FAIL if the only fix is per place,
     or impossible.
8. **Plans that cross cities.**
   - Check: PASS if a plan can hold stops from more than one figure, and
     a figure's view includes **only** the plans with a stop in it (every
     one of them).
9. **Places in between have a home.**
   - Check: PASS if a place beyond every reach (Jönköping) is findable
     as **a figure of its own** in the trip, not filed under an arbitrary
     figure.
10. **Other trips stay out of the way** (concepts 1 and 2), **or
    everything is visible at once** (concept 3).
    - Check (1, 2): PASS if another trip's places never mix into this
      trip's views, that trip is one step away, and a repeat or someday
      trip on the same continent can be separated by fixes, never per
      place (one split per city it covers).
    - Check (3): PASS if all places can be seen together, with the
      trips distinct and nameable.
11. **The map shows what the list shows.**
    - Check: PASS if every view's map set equals its list set (zoom may
      hide pins on the map; it never changes the list).
12. **It's always clear what you're looking at.**
    - Check: PASS if every view is exactly one of: a trip, a figure, a
      plan, any of those narrowed by real town, or nothing yet (empty);
      concept 3 adds everything.
13. **A place shows both truths.**
    - Check: PASS if a place exposes its figure and its real town, and
      neither was asked for when it was added.
14. **Hotels only matter if you log them** (concept 2). All three must
    hold:
    - (a) With no hotel, concept 2 is identical to concept 1.
    - (b) A new undated, unvisited hotel makes its figure a base with no
      position. Nothing else moves.
    - (c) Bases with a date (or a first visit) take positions in order.
    - No date is ever asked for.

## Creation moments (each checked against P)

| # | Moment | PASS if | FAIL if |
|---|---|---|---|
| C1 | **First open, empty** | no trip, no figure exists; search is worldwide | any trip, city or setup step exists or is required |
| C2 | **The first place ever** | a trip and a figure exist afterwards, named from the place (country, real town); the current view is that figure; nothing asked | a name, trip or city was requested |
| C3 | **A new town within reach** (Grindavík) | it joins the nearest figure; no new figure | a question, or a new figure |
| C4 | *(retired in Turn 18: there's no threshold)* | | |
| C5 | **Beyond reach, same continent** (Copenhagen while the trip is Iceland; Jönköping) | a new figure in the same trip from that one place; the generated trip name widens. Concept 3: the same, inside the time gap | a question, or a forced new trip |
| C6 | **Another continent** (LA) | concepts 1 and 2: a new trip starts quietly, named from its country. Concept 3: a new trip worked out (also for months later). Either is fixable after (merge, or "these go together") | a question before adding |
| C7 | **A hotel** (concept 2) | job 14 (b) and (c) | a date prompt, a required date, or any setup |
| C8 | **Correcting trips later** | merge or split (concepts 1 and 2), or "these go together" / "these are separate" (concept 3): never a place edit | the only fix is editing places |
| C9 | **Naming** | a trip can be renamed any time, optionally; a custom name survives the trip growing | renaming is required to proceed |

## Test cases (run each through each concept)

The automatic border is off (Turn 18), so the fixes below are what the
owner actually has to make. If the owner turns the border on (Q8), each
needs one fix fewer.

| Case | PASS if |
|---|---|
| **T1 Øresund:** Saltholm, Kastrup Søbad (both in Tårnby municipality; Saltholm's we believe, not verified), with Malmö logged | All three are in the Copenhagen figure with nothing chosen. Putting Tårnby with Malmö takes **two fixes**: "Malmö is its own", then "Tårnby goes with Malmö", each moving every place in its town. (If OSM gives Saltholm no town or municipality, the second fix doesn't move it: say so.) FAIL if any step is per place |
| **T2 The airport:** Keflavík (Reykjanesbær, about 50 km from Reykjavík); Kastrup (Tårnby), for both Copenhagen and Malmö | Keflavík is in Reykjavík with nothing chosen. Kastrup is in Copenhagen; in Malmö too after **two fixes** ("Malmö is its own", then "Tårnby also belongs with Malmö"). Concept 2: an airport is never a base |
| **T3 Jönköping:** about 300 km from both Stockholm and Malmö | **a figure of its own** in the trip, in any logging order, with nothing chosen |
| **T4 Repeat and someday trips:** Copenhagen in 2028, after Scandinavia 2026; Berlin logged while planning Scandinavia | concepts 1 and 2: both join Scandinavia, and **one split fix** each separates them (the split takes unvisited places, so 2026's visits stay). Concept 3: 2028 separates by time only if no 2026 place is visited in 2028; otherwise, and for Berlin, "these are separate" |

Reference (today): it fails P, jobs 1, 2, 4-10, 12 and 13, and T1-T4,
and passes 3 (a city filter, on the letter) and 11 (list and map share
the same filtered set). Job 5 fails on the real
town (nothing exposes it); job 12 fails on "All cities".

## What the model stores, and its prerequisite (checked)

- **Concept 1 stores:**
  - per place: its real location, real town and trip;
  - one global memory, holding only the owner's town fixes;
  - per trip: an optional name, merges and splits.
- **Concept 2 stores** concept 1's, plus a hotel's dates when it has
  them, and **per place, when it was first marked visited** (a new
  field). Bases and order are inferred.
- **Concept 3 stores:**
  - per place: real location, real town, when it was logged and first
    visited (no trip; so concept 3 also needs the new "first visited"
    field);
  - one global memory;
  - "these go together" / "these are separate" rules and an optional
    trip name, keyed by member figures, so they survive the trip
    re-forming.
- **The real town comes from `locations.address_details`.** That's the
  raw OpenStreetMap address written at add since 2026-10-05; the short
  address uses the same column. The town is its city, town, village or
  municipality (else the next level OSM gives; else none, and rule 1
  runs on the location alone). Districts and streets use their centroid.
- **Today (2026-10-15, live count):** 144 of 202 places have it, and 143
  name a town. **59 places have no real town:** 58 with no
  `address_details`, and 1 with details but no town.
  - The prerequisite: run the short-address backfill again for the 58.
  - The "0/202" in CLAUDE.md and `docs/iphone-checks.md` is stale.

## Dates (concept 2), as ruled in Turn 12

- **In:** order from first visits (needs the stored "first visited at").
- **In, as "we think":** dates from booking text supplied when a hotel
  is added. It's unreliable; a wrong date can only be fixed before
  adding (edit is future).
- **Held back, but visible to the owner:** an optional date on hotels.
- **If neither date route is accepted,** order comes from visits only.

## Out of scope

- UI. The owner: "the model is what to nail right now not ui".
- Editing a place, and hold-to-place: both future (owner).
