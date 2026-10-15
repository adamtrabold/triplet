# Concept 5: city buckets, trip tags (the owner's reframe)

Model only (the owner: "the model is what to nail right now not ui").
Supersedes concepts 1-3 as the working model. **(We think)** marks the
team's opinion; everything else is the owner's words, the owner's
answers (Q-A to Q-C, and D as answered), or today's fact.

> "really what i need is a way to group cities.. something more
> conceptually like a tag that creates the conceptual connective thread
> ... the city is more of a bucket than an actual city ... "the
> copenhagen part of the trip" or "im going to LA" ... i should be able
> to somehow group cities together into a meta-trip and then show / hide
> on the map based on that" (the owner; full text in `owner.md`)

## The rules

1. **Every place is in one city bucket, pre-filled by a guess you can
   change at add.** Nothing is asked and nothing blocks ADD.
   - **The guess:** the nearest bucket within about a day trip
     **(we think 60-80 km, unmeasured)**, measured to the centre of
     that bucket's places (owner, Q-B: "Yes").
   - **No bucket within reach** (the first place ever, Jönköping,
     anything past a day trip): the guess is a **new bucket named from
     the place's real town**, made when you press ADD. **(We think)** this
     replaces today's new-city question, because places-first rules out
     asking.
   - At add you can pick another bucket or make a new one, named
     anything ("Golden Circle", "Copenhagen 2028"). A bucket can hold
     places outside its real bounds (the Blue Lagoon in Reykjavík).
   - **Both truths** (owner, Q-B: "the address needs to comfortably
     balance the idea of the city it belongs to in the app vs the city
     the address actually places it"): a place shows its bucket and its
     real town ("Reykjavík · in Grindavík").
2. **A trip is a tag on cities.**
   - A place belongs to every trip its city is in, automatically (owner,
     D).
   - A city is tagged into a trip, or untagged, any time after; or when a
     city is created on its own, optionally and with low prominence
     (owner, A). **Never inside adding a place** (owner, D).
   - Trips are optional: nothing needs one. A city can be in several
     trips.
3. **Trips filter what you see, on the map and in the list together.**
   - No trip selected: every place shows, whether or not its city is in
     a trip.
   - One or more trips selected (owner, Q-C: "yes"): the places whose
     city is in **any** selected trip show. A city in two trips shows if
     either is selected.
   - "Hiding" a trip means deselecting it. Deselecting the last one goes
     back to everything. **(We think)** there's no "exclude this trip"
     mode; that's our reading of the owner's "show / hide", kept as one
     filter so the list always matches the map (CLAUDE.md).

## The rest, at sketch level

- **First open (C1):** no buckets, no trips; search is worldwide. The
  first place makes its bucket (rule 1). The owner's existing seeded
  cities simply stay as buckets.
- **The city filter:** sits under the trip: with trips selected it picks
  among their cities; with none, it picks among all.
- **Plans:** a plan's stops can be in any city. A trip shows the plans
  with a stop in its cities.

## What's stored

- per place: its bucket and its real town (`address_details`), the town
  shown, never used for filing;
- buckets (today's `cities` registry);
- **new:** trips (a name), and which cities each trip tags.

## The prices, said plainly

- **A wrong bucket can't be fixed after adding** unless the move edit
  comes (Q-D, open). The owner: "or somehow manually...i dont think i
  can do that today".
- **A repeat trip to the same city needs its own bucket**
  ("Copenhagen 2028"), and **its places must be picked by hand at
  add**: two buckets on the same ground have near-identical centres, so
  the guess can land in either.
- **One bucket per place:** Kastrup is in Copenhagen or Malmö, not both.
  A trip tagging both cities shows it either way.
- **Tagging is a step done afterwards,** never during adding a place.
- **A new bucket's name** comes from the real town, so a place with no
  real town (below) is named from the next address level OSM gives.
- **Both truths isn't on every place yet:** 59 of 202 places have no
  real town. The short-address backfill fixes 58; 1 has an address with
  no town, so it shows the bucket alone.

## What changes from today

- The guess becomes "nearest bucket within a day trip" (today: the
  seeded city's box).
- No new-city question: a new bucket is pre-filled instead.
- The real town shows beside the bucket.
- Trips (tags) and the trip filter are new.
- The move edit, if Q-D is yes.

Unchanged: the pick at add, the city filter, plans.

## Owner questions

- **Decided (2026-10-15, verbatim in `owner.md`):**
  - **A:** "it should be able to add a city to a trip when adding a
    city, it should not be or feel required. in fact it should not feel
    very high prominence at all imo."
  - **B:** "Yes. the address needs to comfortably balance the idea of
    the city it belongs to in the app vs the city the address actually
    places it"
  - **C:** "yes"
  - **D (as answered: trips at add):** "When adding a place to a city,
    it should automatically be added to any relevant trips. BUT you
    should not add cities to trips inside of the ui of adding a place."
- **Still open:**
  - **Q-D (as asked):** should moving a place to another bucket after
    adding come with trips, or wait for full place editing? (We think
    with trips.) The orchestrator re-asks it.
  - **Seeing the trip at add:** the owner: "Im ambivalent/not sure if
    you should see the associated trip alongside the city when adding a
    place."
- **Answered by the reframe:** Q1, Q2, Q5, Q6, Q8.
- **Parked with stays:** Q3 (hotels as places or the frame), Q4 (trip
  order).

## On record

Concepts 1-3 (trips by rule) are kept in this folder in case the owner
ever wants trips to form by themselves.
