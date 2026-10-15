# Concept 1: a rule that remembers (three rules, Turn 18)

Model only (the owner: "the model is what to nail right now not ui").
**(We think)** marks the team's opinion.

## The rules (all a person needs, to predict where a place lands)

1. **Near → that city.** A place goes with the nearest of your cities if
   it's within about a day trip **(we think 60-80 km, unmeasured)**.
   Otherwise it's a city of its own, even with one place.
2. **One trip per continent at a time.** A place joins your current trip
   on its continent. If you have none there, a new trip starts quietly,
   named from the country.
3. **You fix things once, after the fact; nothing is ever asked first.**
   - A town goes with another city, or is its own ("Lund goes with
     Copenhagen", "Malmö is its own city"). It moves every place in that
     town, now and later, in every trip.
   - A city splits off into its own trip ("someday Berlin", "Copenhagen
     2028"). It takes the city's places that aren't visited yet; visited
     ones stay where they happened.
   - Two trips merge.

That's it. Nothing is created, named, chosen or dated before adding.

## Invisible plumbing (never needed to predict anything)

- **Reach** is measured to a city's **anchor**: the centre of its town
  with the most places (ties: the earliest). The city takes that town's
  name, so logging Roskilde before Tivoli renames it "Copenhagen" once
  Copenhagen has more places.
- **Which trip, when a continent has more than one** (only after a
  split): a place near a city joins that city's trip; a new city joins
  the trip of the nearest city on its continent. If two trips have the
  same city (Copenhagen 2026 and 2028), the one added to most recently.
- **Continent:** a fixed country table (Iceland and the Canaries are
  Europe; Greenland is North America). A person only knows "another
  continent".
- **No town in OSM** (Saltholm, a national park): the town is the next
  level OSM gives (municipality, then county). If there is none, rule 1
  runs on the location alone, and a town fix can't move that place.
- **Districts and streets** are places: their centroid, and the town
  from it. Today's vote against the seeded cities goes.
- **What's stored:**
  - per place: its location, its real town (`address_details`) and its
    trip;
  - one global memory (which city or cities each town belongs to);
  - per trip: an optional name, merges and splits.
  - A place's city is inferred from its town through the memory, never
    stored on the place.

## What exists

- **Place:** a real location in a real town.
- **City** ("the city I think of it with"; *figure* in jobs.md): a named
  set of real towns in one trip.
  - Example: Reykjavík = {Reykjavík, Grindavík, Reykjanesbær}, so the
    Blue Lagoon and the airport count as Reykjavík.
  - A town can be in two cities after a fix (Tårnby in Copenhagen and
    Malmö).
- **Trip:** made by the places; named from its countries until renamed
  (never required).
- **Plan:** an ordered list of stops in a trip, which can cross cities.

## The prices, said plainly

- **Small one-place cities** sit in a trip (Jönköping). **(We think)**
  that's honest rather than cluttered.
- **Malmö (28 km) joins Copenhagen** until the owner says "Malmö is its
  own city": one fix, once, ever. The automatic border is the owner's
  option (Q8).
- **Copenhagen 2028 joins Scandinavia 2026** until the owner splits it
  off: one fix per repeat trip to a continent. Someday Berlin, the same.
  **(We think)** that's rare (Q5).
- **One place can't be moved on its own** until place edit exists
  (future; Q1).

## How you move

- The current view is exactly one of: a trip, a city, a plan (any of
  them narrowed by real town), or nothing yet (empty).
- Trip ↔ city is one step either way. Other trips are one step away and
  never mixed in.
- A city's view holds only the plans with a stop in it, and all of them.
- The map shows exactly the view's set (zoom only clusters).

## P: places-first

**PASS.** Nothing is asked at add; the city and trip are exposed after.

## Creation moments

| # | Moment | Outcome | Check |
|---|---|---|---|
| C1 | First open, empty | No trip, no city. Search is worldwide | PASS |
| C2 | First place ever (Hallgrímskirkja) | A trip ("Iceland") and a city (Reykjavík) exist; the current view is Reykjavík. Nothing asked | PASS |
| C3 | A new town within reach (Blue Lagoon, Grindavík) | Rule 1: Grindavík goes with Reykjavík | PASS |
| C5 | Beyond reach, same continent (Tivoli while the trip is Iceland; Jönköping) | Rule 1: a city of its own, in the same trip (rule 2). The trip name widens | PASS |
| C6 | Another continent (Griffith Observatory) | Rule 2: a new trip ("United States"), quietly | PASS |
| C7 | A hotel | Just a place (no stays layer) | n/a |
| C8 | Correcting later | Rule 3: a town fix, a split or a merge; never per place | PASS |
| C9 | Naming | Rename a trip any time; never needed. Merging keeps the name of the trip with more places | PASS |

## Test cases

| Case | Outcome | Check |
|---|---|---|
| T1 Øresund: Saltholm, Kastrup Søbad (Tårnby) | Both go with Copenhagen (rule 1). So does Malmö. Putting Tårnby with Malmö takes **two fixes**: "Malmö is its own city", then "Tårnby goes with Malmö"; each moves every place in its town. (If OSM gives Saltholm no town or municipality, the second fix doesn't move it.) | PASS |
| T2 Keflavík (Reykjanesbær) | Goes with Reykjavík | PASS |
| T2 Kastrup for both cities | In Copenhagen. Malmö first needs its own fix; then "Tårnby is in Malmö too": **two fixes** | PASS |
| T3 Jönköping | Beyond reach of Malmö and Stockholm → a city of its own in the trip, in any logging order | PASS |

## Jobs (quick read)

1: C2. 2: the trip view, by city. 3: the city view. 4: one step. 5: rule
1 (C3, T2), the real town kept. 6: narrowing by real town. 7: the town
fix. 8: plans as above. 9: its own city (T3). 10: one trip per
continent, plus split. 11: the map. 12: the views above. 13: a place
shows its city and its town. 14: n/a.

## The team's opinion

**We think** this model is the strongest of the three. That's the
director's labelled opinion, not a recommendation the owner has to
follow.

## Prerequisite

**59 of 202 places have no real town yet** (58 with no
`address_details`, 1 with details but no town; live count,
2026-10-15). Until the short-address backfill covers them, rule 1 runs
on their location alone.

## Open (owner questions)

1 (fix the town or one place), 2 (a place under two cities), 5 (one trip
per continent until you split), 6 (another continent starts a trip
quietly), 8 (Malmö joins Copenhagen until fixed, or a border keeps them
apart). The wording is in jam.md Turn 19.
