# City CRUD + adding a place: jobs

Written before reading the spec, from the owner's words (verbatim in `notes/visual.md` and below).
Every concept in `concepts/` is checked against this list. A concept fails if a job can't be
completed, whatever the spec says.

> "There's really no good way to add a new city. And you can't edit one even if it creates a new
> one while you're working. My workflow was trying to put a place in that was in a city I hadn't
> added yet…and it was also for a roadtrip so while I wanted it attached to a certain city the stop
> was not in that city. Also I could not type the address in I had to put it in the name which was
> confusing. Let's figure this out."
>
> "This can do the normal process. Name and address should be separate. Cures [Cities] should have
> crud principles. Cities are a conceptual bucket for a trip not always the actual city…eg I'm going
> to Philadelphia but I'm putting things down for the roadtrip"

## The owner's jobs

| # | Job | From |
|---|-----|------|
| J1 | **Add a place in a city I haven't added yet**, without setting anything up first. | "put a place in that was in a city I hadn't added yet" + places-first ("immediately doing the thing you actually want to do not the adin") |
| J2 | **File a place under a city it isn't in** (a roadtrip stop under "Philadelphia"), including a city that doesn't exist yet. | "I wanted it attached to a certain city the stop was not in that city" |
| J3 | **Create a city by my own name**, not only one the app derives from the place's real town. | "no good way to add a new city"; "a conceptual bucket for a trip not always the actual city" |
| J4 | **Fix a city the app made while I'm working** (rename it / swap it) before or after saving. | "you can't edit one even if it creates a new one while you're working" |
| J5 | **Find a place by its address**, typed in an address field. | "I could not type the address in I had to put it in the name" |
| J6 | **Name the place what I call it**, separately from its address. | "Name and address should be separate" |
| J7 | **See my cities** and what's filed in each (Read). | "crud principles" |
| J8 | **Rename a city.** | "crud principles"; J4 |
| J9 | **Change where a city "is"** (where going to it lands, what it measures distance from). | "crud principles" (update means the whole record, not just the label) -- *inferred* that the centre is part of what the owner means |
| J10 | **Delete a city, knowing what happens to its places.** | "crud principles" |

## Inferred jobs (marked: not the owner's words)

| # | Job | Why inferred |
|---|-----|--------------|
| J11 *(inferred)* | **Add several roadtrip stops in a row to the same bucket** without re-picking the city every time. | A roadtrip is many stops; the reach guess (70 km) files a far stop under a NEW real town each time, so each add would need a hand pick. |
| J12 *(inferred)* | **See a bucket's stops together** -- going to "Philadelphia" shows the Delaware / Baltimore stops too, not just central Philly. | Going to a city frames its stored centre at zoom 11-12; a roadtrip bucket's stops can be 100+ km out. |
| J13 *(inferred)* | **Know both truths at a glance:** the bucket a place is filed in and the real town it's in. | Owner (2026-10-15): "the address needs to comfortably balance the idea of the city it belongs to in the app vs the city the address actually places it". |
| J14 *(inferred)* | **Save a place that has an address but no name of its own** (a friend's house, a rental, a trailhead car park) and give it my name. | Follows from J5 + J6: an address hit has no POI name. |
| J15 *(inferred)* | **Not lose places, visited stamps, stars or plan stops by accident** when deleting a city. | Delete-and-re-add already "loses visited/starred and plan stops" (backlog, "Edit a place after adding it"). |
| J16 *(inferred)* | **A city I made by hand doesn't vanish on its own.** | `cleanupOrphanCities()` silently deletes empty auto-added cities; a bucket made on purpose ("Philadelphia", before the first stop) must survive being empty. |
| J17 *(inferred)* | **Signed out / playground: can't change cities, and is told why.** | Shipped rule for every edit ("Sign in to make changes"). |

## Settled constraints (not jobs; must hold)

- No build step. Lists show everything matching the filters; clicking a list item navigates the map
  to it and opens its tag (a section header is a list item if it opens anything).
- Places-first: making a city never has to come before adding a place.
- "User should not have to select distance."
- The Hanging Tag, brand orange (one accent), existing look language.
- Trips are not an entity (owner: "drop"). How "a bucket for a trip" sits with that is named in each
  concept and as an open question.

## Coverage (checked 2026-10-23 against the stills)

✓ = done in the concept, where; ~ = partly; ✗ = not supported. "Shared" = `concepts/0-shared-name-and-address.md`.

| Job | A · Write on the line | B · City Labels (rec.) | C · The city you're in |
|-----|------|------|------|
| J1 add in an un-added city | ✓ type on the city line (A1) | ✓ "+ Name a city…" / "+ town" in the menu (B1) | ✓ same menu line, or New city first (C1) |
| J2 file under a city it isn't in | ✓ (A1) | ✓ (B1→B2) | ✓ automatic when you're in it (C3) |
| J3 city by my own name | ✓ (A1, A2 New city) | ✓ (B1, B7-B9) | ✓ (C1) |
| J4 fix a city made mid-work | ✓ retype the line; later, edit mode (A2) | ✓ menu line holds the NEW name; later the label's Rename (B4) / Delete-and-move (B6) | ✓ menu; later the foot |
| J5 find by address | ✓ Shared (S1) | ✓ Shared | ✓ Shared |
| J6 name separate | ✓ Shared (S2) | ✓ Shared | ✓ Shared |
| J7 see my cities | ~ title menu + sections only | ✓ sections + the label: places, visited, farthest, where (B3) | ~ sections + foot (C2) |
| J8 rename | ✓ edit mode (A2) | ✓ label (B4) | ✓ foot |
| J9 change where it is | ~ only via the name's lookup | ✓ Move with the signpost (B5) | ✓ Move centre (B's move mode) |
| J10 delete, knowing what happens | ✓ in the menu row (A3) | ✓ label: move to / delete too (B6) | ✓ foot → same choices |
| J11 several far stops in a row *(inf.)* | ~ type the name each time | ~ hand pick per far stop (near ones auto-file) | ✓ the city you're in catches them (C3) |
| J12 see a bucket's stops together *(inf.)* | ✗ | ~ FARTHEST says they exist; framing = open Q | ~ same |
| J13 both truths *(inf.)* | ✓ address + distance note | ✓ address + note; label's where line | ✓ |
| J14 address-only place, my name *(inf.)* | ✓ Shared | ✓ Shared | ✓ Shared |
| J15 nothing lost on delete *(inf.)* | ✓ move is the default | ✓ move is the default | ✓ |
| J16 hand-made city survives empty *(inf.)* | ✓ rule | ✓ rule + empty header | ✓ rule + empty note (C2) |
| J17 signed out told why *(inf.)* | ✓ shipped slip | ✓ label segments greyed + slip | ✓ |

No concept fails a stated owner job (J1-J10). J12 is not fully met by any: it needs a decision on
what "going to" a roadtrip city frames (open question).
