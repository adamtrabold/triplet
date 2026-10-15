# Concept 2: the rule that remembers, plus stays

Sketch level, model not UI. **Everything in concept 1 holds.** This file
covers only what the stays layer adds. **(We think)** marks the team's
taste.

## The model in one picture

```
 No Hotel-category place in the trip  ──▶  IDENTICAL to concept 1 (nothing extra shows)

 Log a hotel (an ordinary place, category Hotel)
   │
   ▼
 its figure becomes a BASE ◆      the order is the order the hotels were added
                                  (no dates asked; a date on a hotel, if ever given, reorders)

 TRIP  "Scandinavia 2026"
   ◆ Copenhagen ──leg──▶ ◆ Stockholm ──leg──▶ ◆ Reykjavík
        │                    │                    │
     From / In            From / In            From / In
   Malmö (no hotel) = a figure under Copenhagen's base: "Malmö · from Copenhagen"
   Jönköping = on the Copenhagen ↔ Stockholm LEG (it replaces "On the way")
```

**Stored:** nothing new. Bases, order and legs are **derived** from
Hotel places and their order.

## What you see

```
 TRIP LENS (with stays)                       TRIP LENS (no stays yet) = concept 1
┌──────────────────────────────────┐        ┌──────────────────────────────┐
│ ▾ SCANDINAVIA 2026 (96)          │        │ ▾ SCANDINAVIA 2026 (96)      │
│ ◆ COPENHAGEN (31)                │        │ ── COPENHAGEN (31) ───────   │
│     Malmö · from Copenhagen (12) │        │ ── MALMÖ (12) ────────────   │
│ ┄ on the way to Stockholm (1) ┄  │        │ ── STOCKHOLM (20) ────────   │
│ ◆ STOCKHOLM (20)                 │        │ ── REYKJAVÍK (23) ────────   │
│ ◆ REYKJAVÍK (23)                 │        │ ── ON THE WAY (1) ────────   │
└──────────────────────────────────┘        └──────────────────────────────┘
 the city lens is concept 1's, with the base's hotel(s) heading its list
```

## P: places-first

**PASS, conditionally.**
- It passes because stays are never asked for, and the layer only reacts
  to a hotel you chose to log.
- It would FAIL if it ever prompted "add your hotel" or asked for dates.

## Creation moments

C1-C6, C8 and C9 are as in concept 1 (all PASS). What differs:

| # | Moment | What happens | Check |
|---|---|---|---|
| C3/C4 | A new real city near a base | As in concept 1. Near a **base** it reads "from Copenhagen" | PASS |
| C7 | A hotel (the first in Copenhagen) | Copenhagen gets ◆. The trip lens takes the stays' order. Places between two bases sit on that leg. No dates asked | PASS |
| C7b | A second hotel in another city | That city becomes a base too. Order = the order added (Copenhagen first). A non-base figure (Malmö) folds under its nearest base | PASS |

**The change you'd notice, said plainly:** with one hotel logged, Malmö
stops being a city at the top level of the trip lens and becomes "Malmö ·
from Copenhagen". That's the layer's point, and also its surprise.
**(We think)** that's right only if hotels are the trip's frame (owner
question 3).

## Test cases

| Case | Result | Check |
|---|---|---|
| T1 Øresund (Tårnby) | As in concept 1: from Copenhagen. If Malmö is also a base and is next in order, it's still Copenhagen by memory (the leg applies only to places with no figure) | PASS |
| T2 Keflavík | As in concept 1: under Reykjavík. With a Reykjavík hotel it's at the edge of the Reykjavík base | PASS |
| T2 Kastrup for both cities | As in concept 1 (Tårnby in both figures). With bases, it shows at the start and end of the Copenhagen stay | PASS |
| T3 Jönköping | With Copenhagen and Stockholm bases next to each other in order → **on the Copenhagen ↔ Stockholm leg**. With no stays → On the way (concept 1) | PASS |

## Jobs (only where they differ from concept 1)

- **2:** sections are in trip order.
- **7:** the same "belongs with…".
- **8:** a plan defaults to a day from a base **(we think)**.
- **9:** legs.
- **14:** PASS. It's identical to concept 1 without a hotel; base,
  order and legs appear with one, and no dates are asked.

## Prerequisite

As in concept 1: **58 places without `address_details`**. Also: **0
Hotel-category places today**, so on day one this concept *is* concept
1.

## Open (owner questions)

- 3: are hotels and airports places to visit, or the trip's frame?
- 4: should order or dates be used?
- Plus concept 1's questions.
