# Concept 5: city buckets, trip tags (Turn 23, the owner's reframe)

Model only (the owner: "the model is what to nail right now not ui").
Supersedes concepts 1-3 as the working model. **(We think)** marks the
team's opinion; everything else is the owner's or today's fact.

> "really what i need is a way to group cities.. something more
> conceptually like a tag that creates the conceptual connective thread
> ... the city is more of a bucket than an actual city ... "the
> copenhagen part of the trip" or "im going to LA" ... i should be able
> to somehow group cities together into a meta-trip and then show / hide
> on the map based on that" (the owner; full text in `owner.md`)

## The rules

1. **Every place is in one city bucket.** It's guessed from the pin's
   location when you add it, and you can pick another at add (today's
   behaviour). A bucket can hold places outside its real bounds (the
   Blue Lagoon in Reykjavík).
2. **A trip is a tag on cities.** You tag cities into a trip whenever
   you like, after logging. Trips are optional: nothing needs one.
3. **Showing a trip shows its cities' places** (on the map and in the
   list together); hiding it hides them.

That's the whole model. Nothing else decides anything.

## The open questions, answered at sketch level

- **How a trip gets made without setup:** it doesn't have to be. You log
  places into cities exactly as today, with no trip at all. A trip is
  made later, by naming it and tagging cities: admin, but **after** the
  places, never before (places-first holds).
  - **(We think) one optional default, owner to decide:** a city
    *created* while you're looking at a trip joins that trip. It saves
    the most common tagging step and is visible as it happens. Without
    it, the model is strictly rules 1-3.
- **A city in more than one trip:** yes, because it's a tag (Copenhagen
  in "Scandinavia 2026" and in "Øresund weekend"). Showing either trip
  shows all of Copenhagen's places.
- **A city outside every trip:** just a city, as today. It shows when no
  trip is narrowing the view, and through the city filter.
- **The city filter:** stays. A trip is one level above it: showing a
  trip narrows the city filter to that trip's cities, and picking one
  city works as today.
- **Plans:** unchanged. A plan's stops can be in any city. A trip shows
  the plans with a stop in its cities.
- **The list and the map:** a trip is a filter, so it narrows both
  together (CLAUDE.md: "A list shows everything that matches the active
  filters"). "Show / hide on the map" means that filter, not a
  map-only layer.

## What's stored

- per place (as today): its city, plus its real town
  (`address_details`), kept and not used for filing;
- cities (as today: the `cities` registry);
- **new:** trips (a name), and which cities each trip tags.

## Kept from concepts 1-3, and dropped

- **Kept:**
  - the real town on each place: stored, shown later, and the future
    "find by where it really is" (job 6);
  - places-first: nothing before logging.
  - **(We think)** maybe the city guess: "nearest city within about a
    day trip" would put the Blue Lagoon in Reykjavík without a hand
    pick, where today's box match may not. Said plainly as the guess,
    not hidden. Owner's call (Q-B below); without it, today's guess
    stays.
- **Dropped:**
  - figures as sets of towns, anchors and the town memory;
  - town fixes;
  - automatic trips, continents, splits, merges and the time gap;
  - On the way and the border;
  - hotels and bases (concept 2's order is parked, not part of this
    model).

## The prices, said plainly

- **A wrong city can't be fixed after adding** until place edit exists
  (today's gap, now the model's one missing piece). The owner: "or
  somehow manually...i dont think i can do that today".
- **A repeat trip to the same city** (Copenhagen 2028) shows all of
  Copenhagen's places, including the 2026 ones, unless the owner makes a
  separate bucket ("Copenhagen 2028"). Buckets are the unit, by design.
- **Tagging is a manual step**, after the fact. That's the owner's
  "group cities together", and it's never required to log.
- **A place belongs to one bucket:** Kastrup sits in Copenhagen or
  Malmö, not both. A trip tagging both cities shows it either way.

## Today vs. this model

The only new thing is the trip tag and its show/hide. Cities, the add
form's guess and override, the city filter and plans all stay as they
are.

## Owner questions, after the reframe

- **Answered by the reframe:**
  - Q1 (fix a town or one place): one place, by its bucket; needs place
    edit.
  - Q2 (a place under two cities): no, one bucket; a trip can group both
    cities.
  - Q5 (one trip at a time): trips are tags the owner makes; any number,
    shown or hidden.
  - Q6 (another continent starts a trip quietly): no automatic trips.
  - Q8 (Malmö near Copenhagen): Malmö is its own bucket, as today.
- **Still standing, parked with stays:** Q3 (hotels as places or the
  frame) and Q4 (trip order).
- **New, for the owner:**
  - **Q-A:** should a city created while you're looking at a trip join
    that trip automatically? (We think yes.)
  - **Q-B:** should the city guess at add be "nearest city within about
    a day trip", so the Blue Lagoon lands in Reykjavík without a pick?
    (We think yes.)
  - **Q-C:** can several trips show at once? (We think yes: it's a
    filter, like categories.)

## Prerequisite

None for the trip tag: today's cities are enough. The real town is
missing on 59 of 202 places (58 need the backfill); this model doesn't
file by it, so it doesn't block anything.
