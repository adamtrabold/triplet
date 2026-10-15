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

- **Bucket** (a "city" in the app): one per place, guessed from the pin,
  overridable or new at add; it can hold places outside its real bounds
  and be named anything.
- **Real town:** where the place really is (`address_details`).
- **Trip:** a tag on buckets; optional, made after logging, any number;
  a bucket can be in several.
- **Showing a trip:** a filter; the list and the map narrow together.

## Model checks

1. **Log a place with no trip.** PASS if a place can be logged, and
   seen, with no trip existing.
2. **A bucket can hold a place outside its real town.** PASS if the
   Blue Lagoon (Grindavík) can be in Reykjavík by the guess (Q-B,
   pending) or the pick at add.
3. **Both truths.** PASS if a place exposes its bucket and its real town
   ("Reykjavík · in Grindavík").
4. **Trips are tags made after.** PASS if a trip is made after logging,
   any number exist, and one bucket can be in several.
5. **Showing trips.** PASS if showing a trip narrows the list and the
   map together to its buckets' places, and hiding it removes them;
   several at once (Q-C, pending).
6. **The city filter sits under the trip.** PASS if, with a trip shown,
   the city filter picks among that trip's buckets, and with none, it
   works as today.
7. **Plans.** PASS if a trip shows the plans with a stop in its
   buckets, and a plan's stops can be in any buckets.
8. **A repeat trip.** PASS if Copenhagen 2028 can be kept apart from
   2026 through a separate bucket ("Copenhagen 2028").
9. **Nothing structural is required at add.** PASS if the bucket is
   pre-filled and never asked for or blocking ADD.
10. **A wrong bucket can be fixed.** PASS only with the move edit (Q-D,
    pending). Without it: FAIL, stated as the model's one gap.

## Creation moment

| # | Moment | PASS if | FAIL if |
|---|---|---|---|
| C1 | **First open, empty** | no trip exists or is required; search is worldwide; the first place can be logged at once | any trip, city or setup step is required |

C2-C9 are retired (they checked automatic trips and figures).

## Test cases under concept 5

| Case | Outcome | Check |
|---|---|---|
| **T1 Øresund:** Saltholm, Kastrup Søbad (Tårnby), and Malmö | Malmö is its own bucket, as today. Saltholm and Kastrup Søbad go to the guessed bucket (Copenhagen) or the pick; their real town shows Tårnby. A trip tagging Copenhagen and Malmö shows all of them | PASS |
| **T2 The airport:** Keflavík; Kastrup for both Copenhagen and Malmö | Keflavík goes to Reykjavík by the guess (Q-B) or the pick. Kastrup is in **one** bucket; a trip tagging both cities shows it either way. It can't be under both buckets (by design) | PASS |
| **T3 Jönköping** | The guess or the pick: a nearby bucket, or a new "Jönköping" bucket tagged into the trip | PASS |
| **T4 Copenhagen 2028** | A separate bucket ("Copenhagen 2028") in its own trip. Places already in 2026's Copenhagen that you go back for need the move edit (Q-D) | PASS with Q-D; without it, the leftovers stay in 2026's bucket |

## Today, for reference

Today has buckets, the guess and the override. It **fails 4, 5 and 8**
(no trips; a repeat trip could have its own city only via the new-city
question), **3** (the real town isn't shown), **9** (a pin outside every
city triggers the new-city question, `maybeDetectCity()`) and **10** (no move). It **passes 1, 2, 6 and 7**, and C1
fails (cities are seeded before any place).

## What the model stores, and its prerequisite

- per place: its bucket and its real town (as today);
- buckets (today's `cities` registry);
- **new:** trips (a name) and which buckets each trip tags;
- the move edit (Q-D) changes a place's bucket; nothing else is edited.
- **Real town:** 144 of 202 places have it; 59 don't (58 need the
  short-address backfill, 1 has details but no town; live count,
  2026-10-15). Check 3 needs the backfill for those 59; nothing else
  does.

## Out of scope

- UI. The owner: "the model is what to nail right now not ui".
- Stays and trip order (Q3, Q4): parked.
- Full place editing and hold-to-place: future (owner).
