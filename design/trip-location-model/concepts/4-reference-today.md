# Reference: today (B, one home per place)

This isn't a candidate. It's what the app does now, so the owner can see
what the concepts change. Sketch level.

## The model in one picture

```
 CITIES  (a fixed registry: Reykjavík, Copenhagen, Malmö, Stockholm, Los Angeles; extendable)
   │
   └── PLACE.city = exactly ONE city, decided at add (a City select, pre-filled by inference; a new-city confirm)

 No trip object. The "trip" is all the cities; there's no grouping above a city.
 Real city: in address_details (59 of 202 places lack a real town: 58 with none, 1 with no town), not shown or filtered.
```

## What you see

```
┌──────────────────────────────────┐
│ REYKJAVÍK LIST (23)          ⇅ ⚙ │   the city switches in the filters panel (city chips)
│   Hallgrímskirkja …              │   the Blue Lagoon shows here only if it was filed "Reykjavík"
└──────────────────────────────────┘
```

## P: places-first

**FAIL, outright.** Today's add form opens with a **City** select as its
first field (`index.html` ~2801, `#cityInput`). A pin outside every city
gets a **new-city confirm** (`maybeDetectCity()` → `showNewCityConfirm()`,
~4853-4865), not only shapes.
- So the add asks which city: that's P's FAIL column as written.
- With edit future, a wrong city is also permanent.

## Creation moments

Graded strictly against jobs.md (corrected after the fresh jobs check,
`../jobs-check.md`).

| # | Today | Check |
|---|---|---|
| C1 | The map opens on the active city; the cities are seeded in the app before any place exists | **FAIL** (a city exists ahead of the places) |
| C2 | The place goes to the seeded city that's inferred, or chosen in the City select. No trip is created, and nothing is named from the place | **FAIL** |
| C3 | Grindavík is filed to whichever city is inferred or chosen; there's no "From" | **FAIL** |
| C4 | No threshold; no city ever appears from places | **FAIL** (the PASS outcome never happens) |
| C5 | A new-city confirm (a question), or the nearest city; no trip name to widen | **FAIL** |
| C6 | LA is just another city among the five; no trips | **FAIL** |
| C7 | n/a | n/a |
| C8 | No trips to merge; a misfiled place needs edit (future) | **FAIL** |
| C9 | No trip to rename | **FAIL** |

## Test cases

| Case | Today | Check |
|---|---|---|
| T1 Øresund | Each place is filed on its own; no single rule moves both | **FAIL** |
| T2 Kastrup for both | One home only; it can't be under Copenhagen and Malmö | **FAIL** |
| T3 Jönköping | Filed to some city, or none; there's no "between" | **FAIL** |

**Jobs:**
- **Fails:** 1-11 and 13, and P. That's more than jobs.md's predicted
  "5, 7 and 9, and P".
- **Passes:** only 12 (`REYKJAVÍK LIST` names what it lists).
- **14:** n/a.
