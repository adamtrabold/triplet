# Concept 1: a rule that remembers

Sketch level (owner: "sketch level thought … the model is what to nail
right now not ui"). Text and boxes only. Anything resting only on the
team's taste is marked **(we think)**.

## The model in one picture

```
 TRIP  (made by the places, named from its countries: "Iceland & Denmark")
   │      renameable any time ("Scandinavia 2026"), never required
   │
   ├── FIGURE "Reykjavík"   = { Reykjavík, Grindavík, Reykjanesbær, Bláskógabyggð }   ← real cities
   ├── FIGURE "Copenhagen"  = { København, Frederiksberg, Tårnby }
   ├── FIGURE "Malmö"       = { Malmö, Lund, Tårnby }        ← a real city may sit in two figures
   └── ON THE WAY           = places far from every figure (Jönköping, one place)

 PLACE  = real location + real city (from address_details) + trip
          its figure is NEVER stored on the place: it follows from its real city
```

**What's stored:**
- **per place:** location, real city, trip;
- **per trip:** the memory, i.e. which figure(s) each real city belongs
  to.

**The rule:**
- A real city seen for the first time joins the **nearest** figure.
- From then on the memory decides.
- The only correction is to the memory ("Lund belongs with…"), never to
  a place.

## Where a new place goes (the whole rule)

```
 new place, real city R
   │
   ├─ R already in the memory? ───────────────────────────▶ its figure(s). Done.
   │
   ├─ within REACH of a figure? ──────────────────────────▶ R joins the nearest figure ("From …")
   │
   ├─ inside the trip's SPREAD (between figures)? ─────────▶ ON THE WAY; at 2 places in R → R is a figure
   │
   ├─ outside the spread, but the same part of the world? ─▶ a new figure R; the trip widens (C5)
   │
   └─ far away (another continent) ────────────────────────▶ a new trip, quietly (C6)
```
- REACH, SPREAD and "far away" are fixed app rules, never settings
  (owner: no distance settings). Their numbers aren't set here.
- **(We think)** REACH is about a day trip, roughly 60-80 km. SPREAD is
  the box around the trip's figures. "Far away" is another continent.
  All unmeasured.
- **Known quirk:** a first place in a real city that falls inside the box
  (Oslo, between Reykjavík and Stockholm) waits in On the way until a
  second place arrives.

## What you see

```
 CITY LENS                                  TRIP LENS
┌───────────────────────────────┐          ┌───────────────────────────────┐
│ ‹ Iceland & Denmark           │  tap ‹   │ ▾ ICELAND & DENMARK (27)      │
│ REYKJAVÍK (23)                │ ───────▶ │ ── REYKJAVÍK (23) ──────────  │
│   Hallgrímskirkja             │ ◀─────── │ ── COPENHAGEN (3) ──────────  │
│   …                           │ tap a    │ ── ON THE WAY (1) ──────────  │
│ ── FROM REYKJAVÍK ──────────  │ heading  └───────────────────────────────┘
│   Grindavík · 1               │                ▾ = other trips (LA), never mixed in
│     Blue Lagoon               │
│   Reykjanesbær · 1            │          The map always shows the list's set.
│     Keflavík airport          │          Filters panel: kind, visited, starred,
└───────────────────────────────┘          + REAL-CITY chips ("filter by city").
```

## P: places-first

**PASS.**
- The first open is the map, the list and the +.
- At add, the tag shows only what the place is (name, address, type,
  notes). Trip and figure print on the tag after ADD.
- Nothing is created, named, chosen or dated first.

## Creation moments

| # | Moment | What happens | Check |
|---|---|---|---|
| C1 | First open, empty | Map, `YOUR PLACES (0)`, "+ to log one", the +. Search is worldwide | PASS |
| C2 | First place ever (Hallgrímskirkja) | After ADD: trip "Iceland" and figure "Reykjavík" exist; header `REYKJAVÍK (1)`. Nothing asked | PASS |
| C3 | First place in a new real city, same country (Blue Lagoon, Grindavík) | Grindavík joins the nearest figure, Reykjavík. The place lists under `FROM REYKJAVÍK › Grindavík · 1`. No new city | PASS |
| C4 | Second place in that real city | **It depends on the reach.** (See the flag below.) **Beyond the reach of every figure** ("On the way", like Jönköping), 2 places make it a city of its own **(we think 2; a fixed rule, not a setting)**. **Within the reach** (Grindavík, 47 km from Reykjavík), it stays in "From Reykjavík" however many places it gets. You can still make it its own city with "belongs with… its own city" | PASS with the deviation flagged |
| C5 | First place in a new country (Tivoli, while the trip is Iceland) | It's outside the spread, in the same part of the world, so it's a new figure "Copenhagen" in the same trip. The generated name widens to "Iceland & Denmark" (unless you've renamed it) | PASS |
| C6 | A far-away place (Griffith Observatory) | A new trip "United States" starts quietly. The open tag prints `New trip · United States` with `Keep in Iceland & Denmark` beside it, after ADD | PASS |
| C7 | A hotel | It's just a place in the Hotel category. There's no stays layer here (see concept 2) | n/a |
| C8 | Correcting trips later | Trip list: merge two trips (a trip-level action) | PASS |
| C9 | Naming | Rename the trip any time; never needed to proceed | PASS |

**Flag on C4, for systems and the director.** As jobs.md writes it ("the
second place in that real city becomes a city of its own"), C4 breaks job
5. Log a second Grindavík place and the Blue Lagoon leaves Reykjavík.
- This sketch applies the threshold only to places beyond the reach
  (On the way).
- The reach is a fixed app rule; its number isn't set here. **(We
  think)** about a day trip, roughly 60-80 km; unmeasured.
- If the director keeps C4 as written, job 5 needs a different rule.

**The fix, beside the places:**
```
 ── FROM MALMÖ ─────────────────────────
    Lund · 3                 belongs with…  ──▶  [ Malmö ✓ ] [ Copenhagen ] [ its own city ]
      Lund Cathedral                          one tap: every Lund place, now and later
```
**Cost:** one Lund place can't go with Copenhagen while the others stay
with Malmö (that would need place edit, which is future). **(We think
that's rare.)** It's owner question 1.

## Test cases

| Case | Result | Check |
|---|---|---|
| **T1 Øresund:** Saltholm, Kastrup Søbad (Tårnby) | Tårnby's first place → nearest figure, **Copenhagen**. Both list under `FROM COPENHAGEN › Tårnby`. "Tårnby belongs with Malmö" is one change that moves both | PASS |
| **T2 airport:** Keflavík (Reykjanesbær) | `FROM REYKJAVÍK › Reykjanesbær`, nothing chosen | PASS |
| **T2 airport:** Kastrup (Tårnby), for both cities | Under Copenhagen by default. "Tårnby belongs with… **also** Malmö" puts Tårnby in both figures, so Kastrup shows in both | PASS |
| **T3 Jönköping** | Far from every figure but inside the trip's spread, so it goes in `ON THE WAY` in the trip lens. A second Jönköping place makes it a city (C4) | PASS |

## Jobs 1-14 (quick read for the checker)

| Job | Result |
|---|---|
| 1 | C2 |
| 2 | trip lens, sections + On the way |
| 3 | city lens |
| 4 | ‹ and a heading tap |
| 5 | C3, T2 |
| 6 | real-city chips |
| 7 | "belongs with…" |
| 8 | plans belong to the trip; a city lens shows the plans touching it |
| 9 | On the way |
| 10 | ▾ |
| 11 | the map = the list |
| 12 | one name in the header |
| 13 | the tag after ADD: "Reykjavík · in Grindavík" |
| 14 | n/a (concept 2) |

## Prerequisite

The real city comes from `address_details`. **59 of 202 places have
no real town**: 58 have no `address_details` and 1 has details but no
town (live count, 2026-10-15, confirmed by systems). Until the
short-address backfill covers them, those 59 are filed by location alone (nearest
figure), with no real city to print or filter by.

## Open (owner questions)

- 1: fix the rule or one place.
- 2: a place under two cities.
- 6: a quiet new trip.
- 7: the threshold of 2.
