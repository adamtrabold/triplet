# Trips, cities and places: model checks (concept 5)

What the model has to let the owner do. Model only, not UI. Each check
says PASS or FAIL against `concepts/5-city-buckets-trip-tags.md`.
Rewritten for the owner's reframe (Turn 24); concepts 1-4 and their
checks are on record in `concepts/` and jam.md Turns 4-22.

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

After the three-model overview (the reframe this file now checks):

> "really what i need is a way to group cities.. something more
> conceptually like a tag that creates the conceptual connective thread.
> cities should probably continue to operate as today ... the city is
> more of a bucket than an actual city ... i should be able to somehow
> group cities together into a meta-trip and then show / hide on the map
> based on that"

Earlier: "This is separate from filters which should have a filter by
city." Settled: editing a place is future; nothing saves without an
explicit ADD; hold-to-place is future.

## The governing rule: places-first

**P. Log or see places immediately.** Nothing structural stands between
the owner and a place.
- **PASS if** nothing (a trip, a city, a date) has to exist, or be
  created, named or chosen, before or as a condition of logging a place.
- **FAIL if** any of that is required, or adding blocks on it.

## Terms

- **Bucket** (a "city" in the app): one per place. Pre-filled by the
  guess: the nearest bucket within about a day trip (owner, Q-B; we
  think 60-80 km, unmeasured, measured to each city's stored centre, so
  an empty city can be guessed); if none is within reach, (we think) a
  new bucket named from the real town. Changeable or new at add; it can hold places outside its real
  bounds and be named anything.
- **Real town:** where the place really is (`address_details`).
- **Trip:** a tag on buckets; optional, any number; a bucket can be in
  several (the owner's current guess: "i should be able to assign a
  city to many trips"), and a place is in every trip its bucket is in. Tagged after,
  or when a city is created on its own; never inside adding a place.
- **Trip filter:** none selected → every place; some selected → the
  places whose bucket is in any of them. The list and the map move
  together.

## Model checks

1. **Log a place with no trip.** PASS if a place can be logged, and
   seen, with no trip existing.
2. **A bucket can hold a place outside its real town.** PASS if the
   Blue Lagoon (Grindavík) is guessed into Reykjavík (about 40 km, within
   a day trip; Q-B decided), or picked at add.
3. **Both truths** (owner, Q-B). PASS if a place exposes its bucket and
   its real town ("Reykjavík · in Grindavík"), wherever the real town is
   known (not yet on 59 of 202: 58 fixable by the backfill, 1 with no
   town).
4. **Trips are tags.** PASS if a city can be tagged any time after, or
   optionally when created on its own (never inside adding a place); any
   number of trips exist; one bucket can be in several; a new place
   joins its bucket's trips automatically; a city created by adding a
   place joins no trip until it's tagged later, elsewhere; and adding a
   place never shows a trip (owner, E).
5. **The trip filter.** PASS if, with no trip selected, every place
   shows; with one or more selected (Q-C decided), exactly the places
   whose bucket is in any of them show, in the list and on the map
   together; deselecting the last one returns to everything; a city in
   two trips shows if either is selected.
6. **The city filter sits under the trip.** PASS if, with a trip shown,
   the city filter picks among the selected trips' buckets, and with
   none, among all.
7. **Plans.** PASS if a trip shows the plans with a stop in its
   buckets, and a plan's stops can be in any buckets.
8. **A repeat trip doesn't change the pins** (owner). PASS if a second
   trip to Copenhagen tags the same city, and all its places, noted or
   visited before, show under both trips.
9. **Nothing structural is required at add.** PASS if the bucket is
   always pre-filled (an existing bucket, or a new one named from the
   real town) and never asked for or blocking ADD.
10. **A wrong guess can be fixed** (owner, Q-D). PASS if a place's city
    can be edited after adding, and editing a place never changes which
    trips a city is in.

## Creation moment

| # | Moment | PASS if | FAIL if |
|---|---|---|---|
| C1 | **First open, empty** | no bucket or trip exists or is required; search is worldwide; the first place is logged at once, into a new bucket named from its real town | any trip, city or setup step is required |

C2-C9 are retired (they checked automatic trips and figures).

## Test cases under concept 5

| Case | Outcome | Check |
|---|---|---|
| **T1 Øresund:** Saltholm, Kastrup Søbad (Tårnby), and Malmö | Malmö is its own bucket. Saltholm and Kastrup Søbad go to the guessed bucket (the nearest within reach: Copenhagen) or the pick; their real town shows Tårnby. A trip tagging Copenhagen and Malmö shows all of them | PASS |
| **T2 The airport:** Keflavík; Kastrup for both Copenhagen and Malmö | Keflavík goes to Reykjavík by the guess (about 40 km straight-line, approximate) or the pick. Kastrup is in **one** bucket; a trip tagging both cities shows it either way. It can't be under both buckets (by design) | PASS |
| **T3 Jönköping** | No bucket within a day trip, so the guess is a new "Jönköping" bucket (or the pick). It joins the trip only when tagged afterwards | PASS |
| **T4 Copenhagen again in 2028** | A 2028 trip tags Copenhagen too. Copenhagen is in both trips; every Copenhagen place, noted or visited in 2026, shows under both. No pin changes, no new bucket, no place edit | PASS |

## Today, for reference

Today has buckets, the guess (the seeded city's box) and the override.
It **fails 4 and 5** (no trips), **8** (no second trip to tag), **3** (the real town isn't shown), **9** (a pin outside every
city triggers the new-city question, `maybeDetectCity()`) and **10** (no move). It **passes 1, 2
(by the pick), 6 and 7**, and C1 fails (cities are seeded before any
place).

## What the model stores, and its prerequisite

- per place: its bucket and its real town (as today);
- buckets (today's `cities` registry);
- **new:** trips (a name) and which buckets each trip tags;
- one place edit: a place's city (Q-D); a city's trips are never edited
  from a place.
- **Real town:** 144 of 202 places have it; 59 don't (58 need the
  short-address backfill, 1 has details but no town; live count,
  2026-10-15). Check 3 needs the backfill for 58 of them (1 has no
  town to find). New buckets are named from it; without it, from the
  next address level.

## Out of scope

- UI. The owner: "the model is what to nail right now not ui".
- Stays and trip order (Q3, Q4): parked.
- Full place editing and hold-to-place: future (owner).
