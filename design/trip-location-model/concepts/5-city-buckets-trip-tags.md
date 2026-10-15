# Concept 5: city buckets, trip tags (the owner's reframe)

> **2026-10-15: owner dropped trips ('drop'). The city-bucket rules stand; everything about trips below is history.**

Model only (the owner: "the model is what to nail right now not ui").
Supersedes concepts 1-3 as the working model. **(We think)** marks the
team's opinion; everything else is the owner's words, the owner's
answers (A to E, Q-D, repeat trips, many trips), or today's fact.

> "really what i need is a way to group cities.. something more
> conceptually like a tag that creates the conceptual connective thread
> ... the city is more of a bucket than an actual city ... "the
> copenhagen part of the trip" or "im going to LA" ... i should be able
> to somehow group cities together into a meta-trip and then show / hide
> on the map based on that" (the owner; full text in `owner.md`)

## The rules

1. **Every place is in one city bucket, pre-filled by a guess you can
   change at add.** Nothing is asked and nothing blocks ADD.
   - **The guess:** the nearest bucket within about a day trip (owner,
     Q-B: "Yes"); **(we think 60-80 km, unmeasured)**.
   - **(We think) measured to each city's stored centre.** Every city
     carries one today (`CITIES[...].center`); a new city's centre is
     its first place's location. So an empty city (seeded, or created on
     its own) can still be guessed, and a nearby place never starts a
     duplicate of it.
   - **(We think) no bucket within reach** (the first place ever,
     Jönköping, anything past a day trip): the guess is a **new bucket
     named from the place's real town**, made when you press ADD. This
     whole naming rule is the team's call, not the owner's: it replaces
     today's new-city question, and the owner said cities "should
     probably continue to operate as today". Places-first rules out
     asking, which is why we think it's right.
   - **A city created by adding a place joins no trip** until it's
     tagged later, elsewhere (owner, D and E).
   - At add you can pick another bucket or make a new one, named
     anything ("Golden Circle"). A bucket can hold
     places outside its real bounds (the Blue Lagoon in Reykjavík).
   - **Both truths** (owner, Q-B: "the address needs to comfortably
     balance the idea of the city it belongs to in the app vs the city
     the address actually places it"): a place shows its bucket and its
     real town ("Reykjavík · in Grindavík").
   - **A wrong guess is fixed by editing the place's city, after adding**
     (owner, Q-D). From a place you never edit which trips its city is
     in.
2. **A trip is a tag on cities.**
   - A place belongs to every trip its city is in, automatically (owner,
     D).
   - A city is tagged into a trip, or untagged, any time after; or when a
     city is created on its own, optionally and with low prominence
     (owner, A). **Never inside adding a place** (owner, D).
   - Trips are optional: nothing needs one. A city can be in several
     trips (the owner's current guess, not a hard rule: "my guess right
     now is that i should be able to assign a city to many trips").
   - **A repeat trip tags the same city again** (owner: "a repeat trip
     to the same place should not change the pins -- if i go back to a
     place i may want to see all the places i noted prior / which i
     visited / etc"). Copenhagen in "Scandinavia 2026" and in a 2028
     trip shows all its places, visited or not, under both.
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
  shown, and used only to name a new bucket, never to pick an existing
  one;
- buckets (today's `cities` registry);
- **new:** trips (a name), and which cities each trip tags.

## The prices, said plainly

- **Editing a place's city is new work:** today nothing can change
  after adding (the owner: "or somehow manually...i dont think i can do
  that today"). It's the one place edit this model needs.
- **Two buckets on the same ground** (if the owner ever makes one) have
  nearly the same centre, so the guess can land in either; pick by hand.
  A repeat trip never needs this: it re-tags the same city.
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
- A place's city can be edited after adding (Q-D).
- The city filter narrows to the selected trips' cities.
- First open: no seeded cities on a fresh start, and search is worldwide
  from the start (today seeds cities and widens search only on a miss).

Unchanged: the pick at add, plans.

## Owner questions

- **Decided (2026-10-15, verbatim in `owner.md`):**
  - **A:** "it should be able to add a city to a trip when adding a
    city, it should not be or feel required. in fact it should not feel
    very high prominence at all imo."
  - **B:** "Yes. the address needs to comfortably balance the idea of
    the city it belongs to in the app vs the city the address actually
    places it"
  - **C:** "yes"
  - **Many trips per city (the owner's current guess):** "my guess right
    now is that i should be able to assign a city to many trips"
  - **Repeat trips:** "a repeat trip to the same place should not change
    the pins -- if i go back to a place i may want to see all the places
    i noted prior / which i visited / etc"
  - **D (as answered: trips at add):** "When adding a place to a city,
    it should automatically be added to any relevant trips. BUT you
    should not add cities to trips inside of the ui of adding a place."
  - **Q-D:** "if the app puts a place in the wrong city you should be
    able to edit the city attached to the place. you should not be able
    to edit the trips the city is attached to"
  - **E, the trip at add: no.** "i actually dont think you should show
    the trip when adding a place because what if you're going to a place
    multiple times, or a second or third time or wahtever, it would be
    impossible to determine which trip you're thinking about. and
    honestly it doesn't even matter... what matters is where you're
    putting the pin."
- **Nothing is open.**
- **Answered by the reframe:** Q1, Q2, Q5, Q6, Q8.
- **Parked with stays:** Q3 (hotels as places or the frame), Q4 (trip
  order).

## On record

Concepts 1-3 (trips by rule) are kept in this folder in case the owner
ever wants trips to form by themselves.
