# Reference: today (one home per place)

Not a candidate: it's today's model, so the owner can see what the
concepts change.

## What exists

- **City:** a registry, seeded before any place exists (Reykjavík,
  Copenhagen, Malmö, Stockholm, Los Angeles). It can be extended.
- **Place:** exactly one city, decided when it's added, plus its
  location. Its real city is stored in `address_details` (missing on 59 of
  202), but nothing uses it.
- **Plan:** an ordered list of stops across cities.
- **No trip.** Nothing groups cities.

## Stored vs. inferred

- **Stored:** the place's city (chosen at add, pre-filled by inference
  from the location).
- **Inferred:** only that pre-fill.

## What can be corrected, and when

- A place's city only at add; afterwards it needs place edit (future).
- A new city can be created at add, by answering a question.

## P: places-first

**FAIL.** Adding asks which city: the City field comes first in today's
add form (`index.html` ~2801), and a pin outside every city triggers a
new-city question (`maybeDetectCity()`, ~4853-4865).

## Creation moments

| # | Today | Check |
|---|---|---|
| C1 | Cities exist before any place | FAIL |
| C2 | The place goes to an existing city, inferred or chosen. No trip; nothing named from the place | FAIL |
| C3 | Filed to whichever city is inferred or chosen; no "From" | FAIL |
| C4 | No city ever comes from places | FAIL |
| C5 | A new-city question, or the nearest city | FAIL |
| C6 | Just another city; no trips | FAIL |
| C7 | n/a | n/a |
| C8 | No trips; a misfiled place needs edit (future) | FAIL |
| C9 | No trip to name | FAIL |

## Test cases

| Case | Today | Check |
|---|---|---|
| T1 Øresund | Each place filed on its own; no single correction moves both | FAIL |
| T2 Kastrup for both cities | One city only | FAIL |
| T3 Jönköping | Filed to some city; there's no "between" | FAIL |

**Jobs:**
- **Fails:** 1-10 and 13, and P.
- **Passes:** 11 and 12.
  - **11:** verified in `index.html`. The list and the map both come from
    the same filtered set (`visibleLocations()`); the map only adds zoom
    clustering (`mapVisibleLocations()`), and zoom never changes the
    list.
  - **12:** the current view names its city.
- **14:** n/a.
