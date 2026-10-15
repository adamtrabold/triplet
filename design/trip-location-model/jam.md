# Jam: trips, cities and places (concept phase)

## Turn 1 -- product designer (systems focus)

### The owner's words (verbatim, `owner.md`)

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
> app should be as simple and low friction as possible, while supporting
> my specific mental model and use case as closely as possible."

> "i expect many ideas here, not a hard recommendation, unless they have
> one that is completely obvious and stands out meaningfully against the
> others."

Earlier: "I need to be able to include a place in a city that does not
match how I'm thinking about the trip which may be a city name or
something else … This is separate from filters which should have a
filter by city."

### Jobs (written from his words before reading anything else)

1. **Plan across a whole trip:** see and work with every place in
   "Scandinavia 2026" at once, across its cities.
2. **Focus on one city of a trip:** narrow to Reykjavík and plan just it.
3. **Move between the two easily** ("starting from a few different
   points"). The trip and the city are both natural starting points,
   and neither is a detour.
4. **See a place under the city I think it belongs to, even when it's
   somewhere else:** tap "Reykjavik" and see the Blue Lagoon and the
   airport.
5. **Still find places by where they really are:** "a filter by city".
6. **Group places into trips.**
7. **Plans that cross cities:** a day that starts in Malmö and ends in
   Copenhagen.
8. **Add with as little friction as possible:** no forced picking of
   city or trip.
9. *(inferred)* **Places in between** have a home: a stop en route
   ("places in between") belongs somewhere you'll find it.
10. *(inferred)* **Other trips stay out of the way:** LA doesn't clutter
    Scandinavia, and it's still there later.
11. *(inferred)* **The map matches what you're looking at:** whatever
    narrows the list narrows the map (the app's own rule).
12. *(inferred)* **Understand it at a glance:** the header always names
    what you're looking at (a trip or a city), the owner's rule "the
    header should show whatever the list is".

Not jobs: editing a place later and holding the map to place a pin (both
future, his answers).

### The structural question underneath

Every idea below is one answer to a single question: **where does "the
city I think of it with" come from?**
- A stored choice per place?
- A rule the app works out (distance, area, route)?
- A tag you can add more than one of?
- The moment you added it?
- Some other object you already have (a plan, a base)?

Real location and real city are data in every idea (stored today in
`lat/lng` and `address_details`). Trips are a container in most of them.

### Random draws (real RNG)

Fields: **watersheds / catchment areas**, **ZIP codes vs. mailing city
names**, **genealogy trees**. Oblique: **"Is there something missing?"**
and **"Change nothing and continue with immaculate consistency."**

### Ideas that differ in kind

**I1. Home city, chosen (the minimal change; "change nothing…").**
- Today's model, kept consistent: a place has one home city (today's
  `city`), which is now *your* choice rather than its geography. The
  real city is data, with a separate "real city" filter. The trip is a
  folder of home cities.
- Add: the home is pre-filled with the city you're looking at.
- This is the round-12c group/real-city idea.
- *Strength:* almost nothing new to learn.
- *Weakness:* a place lives in exactly one home. "Places in between"
  need an arbitrary home.

**I2. Also-known-as (ZIP codes: a preferred name plus acceptable
names).**
- In US mail, a ZIP has one real city and several "acceptable" names
  you can write on the envelope.
- Here, a place's real city is fixed. You can add **"also show in
  Reykjavík"**, more than one if you like. The Reykjavík filter shows
  places whose real city is Reykjavík **plus** the ones that say "also
  Reykjavík".
- The airport can be "also Reykjavík" *and* "also Keflavík".
- *Strength:* additive. Nothing is wrong by default, and you only touch
  the exceptions.
- *Weakness:* exceptions have to be added by hand; one more control on
  the tag.

**I3. Catchments (watersheds): edit the area, not the place.**
- Every city has a soft area on the map, its catchment. A place belongs
  to whichever catchment it falls in.
- The default catchment is generous: the city's area, grown to take in
  nearby places with no closer city. You can **stretch** it on the map
  to swallow the Blue Lagoon and the airport.
- Filing is never a per-place choice; it's spatial and visible.
- *Strength:* zero friction when adding; the map shows the mental
  model.
- *Weakness:* editing a shape on a phone is fiddly. Two catchments can't
  share a place unless they overlap.

**I4. Bases: "the place you go *from*" ("is there something
missing?" — yes: where you sleep).**
- What makes the Blue Lagoon "Reykjavík" is that you go there from
  Reykjavík. So a trip is an **ordered set of bases** (Copenhagen,
  Malmö, Stockholm, Reykjavík), perhaps with dates.
- Every place belongs to the base you'll visit it from: the nearest base
  by default, and you can change it. The airport belongs to the base you
  fly out of.
- "Places in between" belong to the **leg** between two bases.
- *Strength:* matches how trips actually work. Plans fall out of it
  (a day is planned from a base).
- *Weakness:* it needs the trip's bases to be set up. A city you're not
  sleeping in (Malmö as a day trip from Copenhagen?) becomes a place
  set, not a base. Mixed.

**I5. The route (genealogy turned sideways: a line, not a tree).**
- A trip is a **route**: an ordered line through cities. Places snap to
  the nearest stop or the nearest leg.
- The filter is a stretch of the route: "Reykjavík" = the Reykjavík stop
  and its spur. The list header reads like a ticket: "Scandinavia 2026 ›
  Reykjavík".
- *Strength:* "the whole trip" and "one city" are the same control at
  two zoom levels (the route vs. one stop), and in-between places have
  an obvious home.
- *Weakness:* the route has to exist. It's weird for a trip with no
  order (a list of cities you might visit).

**I6. Around, not in (no filing at all).**
- Store nothing beyond real location. Tapping "Reykjavík" shows
  **Reykjavík and around**: everything within a reach the app works
  out (for example, the nearest city's territory, a Voronoi split
  between your cities).
- The Blue Lagoon is closer to Reykjavík than to any other of your
  cities, so it shows. A second, narrower chip shows the real city only.
- *Strength:* zero filing, zero setup. It answers the Blue Lagoon case
  automatically.
- *Weakness:* it's wrong exactly when your mental home isn't the
  nearest city (the airport's real nearest might be Keflavík if that's
  one of your cities). There's no override, unless it's combined with
  I2.

**I7. The moment you saved it (provenance).**
- A place's home = **the city you were looking at when you added it.**
  You added the Blue Lagoon while planning Reykjavík, so it's Reykjavík.
  No question asked: the context *is* the answer.
- Real city stays data. Adding while looking at the whole trip → the
  home is the real city (or nearest base).
- *Strength:* zero-friction filing that matches intent, because you add
  things while thinking about the city you're in.
- *Weakness:* it's invisible. A place added from the "wrong" view is
  misfiled silently. That needs a visible home on the tag (and edit is
  future).

**I8. Plans are the groups (invert: use what exists).**
- The app already has Plans, ordered lists that cross cities. Make a
  "Reykjavík" plan (or a "Reykjavík & around" collection) that holds the
  Blue Lagoon and the airport.
- The city chips filter by **real** city; your mental groupings are
  collections. A trip is a collection of collections.
- *Strength:* no new concept: grouping = collecting, and it's
  many-to-many by nature.
- *Weakness:* collections and plans are different jobs (an ordered day
  vs. "everything near Reykjavík"). Overloading Plans may blur both.
  Every add becomes "add to which collection?" unless defaulted.

**I9. Two lenses on one map (separate the "where" from the "about").**
- The filters panel offers two kinds of chip that combine:
  - **Trip / city lens** (mental: Scandinavia 2026 › Reykjavík, from
    any of I1-I7);
  - **Where it is** (real city: Reykjavík, Grindavík, Keflavík).
- The header names the mental lens. The real-city chips only appear
  inside it, so the owner's "separate from filters which should have a
  filter by city" is satisfied by structure.
- This isn't a model of its own. It's the interface any of I1-I8 needs,
  and I flag it as a likely constant across concepts.

### Where each idea shows up in the app (checklist for every concept)

- **List header:** names the trip and/or city ("Scandinavia 2026" or
  "Reykjavík").
- **Filters panel:** how trip → city → real city chips nest.
- **Add flow:** what's pre-filled, what's asked (ideally nothing), and
  where the place lands.
- **Map:** what a city view draws (its catchment? its route? nothing?).
- **Plans:** cross-city by nature in all of them. Does a plan belong to
  a trip?
- **Past trips:** where LA goes.

### Early lean (not a recommendation)

- **I7 + I2 + I9** look like the lowest-friction mix: home = where you
  were when you added it, plus "also show in…" for exceptions, plus
  real-city chips nested under it.
- **I4/I5** (bases, route) are the most *true to trips*, but cost setup.
- **I6** is the most automatic, with a known failure.

None of them is "completely obvious" yet. The jobs to test them hardest
against are 4, 8 and 9.

### Questions for the director (not the owner yet)

- Is a trip in scope as a real container now (LA vs. Scandinavia), or
  only the city-level mental grouping?
- Can one place belong to two cities' views (many-to-many), or must
  there be one home?
- Should concepts differ in where the home comes from (choice / rule /
  context / area), as above? I'd keep 3-4 that differ in kind.

NEXT: product designer (visual focus) — how each kind of idea (a chosen
home, also-known-as, a catchment on the map, bases/route, provenance)
would look in the list header, the filters and the map, and which reads
as simplest at a glance. Then the director picks 3-4 that differ in
kind.
