# Reference: today (B, one home per place)

This isn't a candidate. It's what the app does now, so the owner can see
what the concepts change. Sketch level.

## The model in one picture

```
 CITIES  (a fixed registry: Reykjavík, Copenhagen, Malmö, Stockholm, Los Angeles; extendable)
   │
   └── PLACE.city = exactly ONE city, decided at add (inferred from the point; a new-city dialog for shapes)

 No trip object. The "trip" is all the cities; there's no grouping above a city.
 Real city: in address_details (144 of 202 places have it; 58 don't), not shown or filtered.
```

## What you see

```
┌──────────────────────────────────┐
│ REYKJAVÍK LIST (23)          ⇅ ⚙ │   the city switches in the filters panel (city chips)
│   Hallgrímskirkja …              │   the Blue Lagoon shows here only if it was filed "Reykjavík"
└──────────────────────────────────┘
```

## P: places-first

**FAIL, in spirit.** Nothing has to be made before the first log. But
every add files the place into one city: inferred, or a dialog when it's
unclear. With edit being future, a wrong home is permanent.

## Creation moments

| # | Today | Check |
|---|---|---|
| C1 | The map, opened on the active city; the cities are seeded in the app | PASS-ish (the cities exist before any place) |
| C2 | The place is filed to the inferred city | PASS |
| C3 | Grindavík is filed to whichever city the add infers; there's no "From" | **FAIL** (no from/in; it's arbitrary) |
| C4 | No threshold; no new city appears from places | n/a |
| C5 | A place in a new country: a new-city path for shapes, or the nearest city | partial |
| C6 | LA is just another city among the five; no trips | **FAIL** (other trips aren't kept apart) |
| C7 | n/a | n/a |
| C8 | No trips to merge; a misfiled place needs edit (future) | **FAIL** |
| C9 | n/a | n/a |

## Test cases

| Case | Today | Check |
|---|---|---|
| T1 Øresund | Filed to the one city inferred at add | partial |
| T2 Kastrup for both | One home only; it can't be under Copenhagen and Malmö | **FAIL** |
| T3 Jönköping | Filed to some city, or none; there's no "between" | **FAIL** |

**Expected:** it fails jobs 5, 7 and 9, and P (as jobs.md says).
