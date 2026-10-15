# Concept 3: trips worked out, not kept

Model only. **(We think)** marks the team's opinion.

## The rules

1. **Near → that city**, exactly as concept 1's rule 1 (60-80 km, we
   think; each place by its own distance; only your fixes override it).
2. **Trips are worked out from the places, never kept.** Two places are
   in the same trip when they're on the same continent **and** either
   one's logged or visited time is within about 6 months **(we think)**
   of the other's. Trips chain through those links, and are named from
   the countries.
3. **You fix things once, after the fact; nothing is ever asked first:**
   - concept 1's town fixes ("goes with", "is its own", "also belongs
     with");
   - "these trips go together";
   - "these trips are separate".

   There's no split or merge: trips aren't objects.

## Invisible plumbing

- Concept 1's plumbing (anchor, continent table, no-town fallback,
  districts and streets as places), except which trip, which rule 2
  decides.
- **Stored:** per place, its location, real town, when it was logged
  (`created_at`) and when it was first visited (concept 2's new field);
  the town fixes; the "together" / "separate" fixes and an optional trip
  name, each keyed by the trip's member cities (trips re-form, so they
  can't be keyed by an id).
- **A custom name survives the trip changing:** if it grows, it stays;
  if it splits, the part with most of those cities keeps it; if two
  named trips join, the one with more places keeps its name.
- A plan belongs to the trip its stops sit in (both, if it spans two).

## How you move

As concept 1 (trip ↔ city in one step, the trip view grouped by city,
a city's view holds only and all the plans with a stop in it, a place
shows its city and its town, the map shows exactly the view's set),
plus one more view: **everything**, with trips distinct and nameable.

## What it does with the cases

- The US trip: its own (another continent).
- Paris 2024 and Scandinavia 2026: two trips (years apart, nothing
  links them).
- T1-T3: as concept 1.
- **T4:** Copenhagen 2028 separates by itself **only if** nothing from
  2026 is visited in 2028. The likely case, a 2026 leftover you go back
  for, links the two, and "these trips are separate" fixes it. Someday
  Berlin needs the same fix.

## Known limits (no rule added for these)

- **Trips chain:** a someday city logged mid-planning, a 2026 leftover
  visited in 2028, or a year of steady logging on one continent.
- **Marking a place visited can re-form trips,** so the trip you're
  looking at can change under you.
- No trip ever closes; an old trip is one nothing new links to.

## P: places-first

**PASS, in the extreme.** There's no trip to make, name or merge.

## Creation moments

C1-C3 and C5: as concept 1. **C6** (another continent, or months
later): a new trip, worked out, named from its country; "these trips go
together" fixes it. **C7:** n/a. **C8:** town fixes and "together" /
"separate"; never per place. **C9:** a trip can be named any time;
optional.

## Prerequisite

As concept 1 (59 of 202 places have no real town), **plus the new
"first visited" field** that rule 2 reads. Today's visited places have
no visit time, so until they're visited again they link by logged time
only.

## Open (owner questions)

5 (this concept is the "everything at once" answer), plus concept 1's.
