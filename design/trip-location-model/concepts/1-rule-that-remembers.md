# Concept 1: a rule that remembers (three rules)

Model only (the owner: "the model is what to nail right now not ui").
**(We think)** marks the team's opinion.

## The rules (all a person needs, to predict where a place lands)

1. **Near → that city.** Each place is judged by its own distance: it
   goes with the nearest of your cities if it's within about a day trip
   **(we think 60-80 km, unmeasured)**. Otherwise it's a city of its
   own, even with one place. Only your fixes (rule 3) override this.
2. **A place joins its city's trip.** A place on a continent where you
   have no trip starts one quietly, named from the country.
3. **You fix things once, after the fact; nothing is ever asked first.**
   Each fix is remembered for every place in that town, now and later,
   in every trip:
   - a town **goes with** another city ("Lund goes with Copenhagen");
   - a town **is its own** city ("Malmö is its own city");
   - a town **also belongs with** a second city ("Tårnby also belongs
     with Malmö", so Kastrup shows under both).

   And for trips:
   - a city **splits off** into its own trip ("someday Berlin",
     "Copenhagen 2028"); places you've already been stay with the old
     trip;
   - two trips **merge**.

Nothing is created, named, chosen or dated before adding.

## Invisible plumbing (not needed for the common case)

- **Reach is a straight line**, measured to a city's **anchor**: the
  centre of the city's own places in its town with the most places
  (ties: the earliest). It's where your places are, never a municipal
  seat. The city takes that town's name.
- **A new city's trip:** the trip of the nearest city on its continent
  (normally your only one there). If a city is in two trips (Copenhagen
  2026 and 2028), the one added to most recently. A fix names a city;
  it applies to that city in whichever trip the place lands.
- **Continent:** a fixed country table (Iceland and the Canaries are
  Europe; Greenland is North America). A person only knows "another
  continent".
- **No town in OSM** (Saltholm, a national park): the town is the next
  level OSM gives (municipality, then county). If there is none, rule 1
  runs on the location alone, and a town fix can't move that place.
- **Districts and streets** are places: their centroid, and the town
  from it.
- **Hotel** means the Hotel category (concept 2).
- **What's stored:**
  - per place: its location, its real town (`address_details`) and its
    trip;
  - one global memory, holding **only the owner's town fixes**;
  - per trip: an optional name, merges and splits.
  - A place's city is worked out from rule 1 and the fixes, never stored
    on the place.

## What exists

- **Place:** a real location in a real town.
- **City** ("the city I think of it with"; *figure* in jobs.md): a
  named group of places in one trip, made by rule 1 and the fixes.
  - Example: Reykjavík holds the Blue Lagoon (Grindavík) and the airport
    (Reykjanesbær) by distance, and each place keeps its real town.
- **Trip:** made by the places; named from its countries until renamed
  (never required). "Scandinavia 2026" is a rename.
- **Plan:** an ordered list of stops, which can cross cities.

## Worked case: the Golden Circle (rule 1, no memory)

Þingvellir, Geysir and Gullfoss are all in Bláskógabyggð municipality.
Straight-line distances are **approximate, from known coordinates, not
measured**: Reykjavík → Þingvellir about 41 km, → Geysir about 81 km,
→ Gullfoss about 90 km; Geysir → Gullfoss about 10 km; Geysir →
Þingvellir about 41 km.
- Gullfoss is beyond reach → a city of its own ("Bláskógabyggð"), and
  Geysir, about 10 km away, joins it. Geysir alone sits at the edge of a
  60-80 km reach, so on its own it could go either way.
- **Þingvellir is roughly a tie** between Reykjavík and that new city.
  It can land either way, depending on what's logged and the exact
  anchors.
- **One fix settles it** either way: "Bláskógabyggð goes with
  Reykjavík" puts all three under Reykjavík; "Bláskógabyggð is its own
  city" keeps all three together, Þingvellir included.

## The prices, said plainly

- **Small one-place cities** sit in a trip (Jönköping). **(We think)**
  that's honest rather than cluttered.
- **Malmö (28 km) joins Copenhagen** until the owner says "Malmö is its
  own city": one fix, once, ever. The automatic border is the owner's
  option (Q8).
- **Copenhagen 2028 joins Scandinavia 2026** until the owner splits it
  off. Someday Berlin, the same. **(We think)** that's rare (Q5).
- **One place can't be moved on its own** until place edit exists
  (future; Q1).

## Known limits (no rule added for these)

- **A repeat trip across several cities** (Paris, Versailles, Lyon in
  2027, after Scandinavia 2026) needs one split per city plus merges, or
  a split before logging the rest.
- **A plan crossing a split city** now has stops in two trips; it shows
  in both.
- **A merge** keeps the bigger trip's name; a custom name on the smaller
  one is lost.
- **Adding a place outside the current view:** it lands in its own city
  and trip; whether the view follows it is not this model's call.
- **The name can change** as another town in a city overtakes the
  anchor, and **reach is a range**, so a place at about 70 km is a
  judgement call until the number is measured.
- **Near-ties between two cities** (Þingvellir) can land either way; one
  town fix settles them.

## How you move

- The current view is exactly one of: a trip, a city, a plan (any of
  them narrowed by real town), or nothing yet (empty).
- Trip ↔ city is one step either way. Other trips are one step away and
  never mixed in.
- The trip view holds every place in the trip, grouped by city.
- A city's view holds only the plans with a stop in it, and all of them.
- A place shows its city and its real town.
- The map shows exactly the view's set (zoom only clusters).

## P: places-first

**PASS.** Nothing is asked at add; the city and trip are exposed after.

## Creation moments

| # | Moment | Outcome | Check |
|---|---|---|---|
| C1 | First open, empty | No trip, no city. Search is worldwide | PASS |
| C2 | First place ever (Hallgrímskirkja) | A trip ("Iceland") and a city (Reykjavík) exist; the current view is Reykjavík. Nothing asked | PASS |
| C3 | A new town within reach (Blue Lagoon, Grindavík) | Rule 1: goes with Reykjavík | PASS |
| C5 | Beyond reach, same continent (Tivoli while the trip is Iceland; Jönköping) | Rule 1: a city of its own, in the nearest city's trip. The generated name widens ("Iceland & Denmark") | PASS |
| C6 | Another continent (Griffith Observatory) | Rule 2: a new trip ("United States"), quietly | PASS |
| C7 | A hotel | Just a place (no stays layer) | n/a |
| C8 | Correcting later | Rule 3: a town fix, a split or a merge; never per place | PASS |
| C9 | Naming | Rename a trip any time; never needed | PASS |

## Test cases

| Case | Outcome | Check |
|---|---|---|
| T1 Øresund: Saltholm, Kastrup Søbad (Tårnby) | Both go with Copenhagen (rule 1). So does Malmö. Putting Tårnby with Malmö takes **two fixes**: "Malmö is its own city", then "Tårnby goes with Malmö". (If OSM gives Saltholm no town or municipality, the second fix doesn't move it.) | PASS |
| T2 Keflavík (Reykjanesbær) | Goes with Reykjavík | PASS |
| T2 Kastrup for both cities | In Copenhagen. **Two fixes:** "Malmö is its own city", then "Tårnby also belongs with Malmö" | PASS |
| T3 Jönköping | Beyond reach of Malmö and Stockholm → a city of its own in the trip, in any logging order | PASS |
| T4 Copenhagen 2028; someday Berlin | Both join Scandinavia; **one split each** separates them, and places already visited in 2026 stay | PASS |

## Jobs (quick read)

1: C2. 2-4: How you move. 5: rule 1 (C3, T2), the real town kept. 6:
narrowing by real town. 7: the town fix. 8: plans as above. 9: its own
city (T3). 10: split (T4). 11: the map. 12: the views above. 13: a
place shows its city and its town. 14: n/a.

## The team's opinion

**We think** this model is the strongest of the three. That's the
director's labelled opinion, not a recommendation the owner has to
follow.

## Prerequisite

**59 of 202 places have no real town yet** (58 with no
`address_details`, 1 with details but no town; live count,
2026-10-15). Until the short-address backfill covers them, rule 1 still
works (it's distance), but town fixes can't reach them.

## Open (owner questions)

1, 2, 5, 6 and 8 (wording in jam.md Turn 19).
