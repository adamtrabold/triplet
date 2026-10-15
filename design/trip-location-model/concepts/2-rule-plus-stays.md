# Concept 2: the rule that remembers, plus stays

Sketch level, model not UI. **Everything in concept 1 holds.** This file
covers only what the stays layer adds. **(We think)** marks the team's
taste.

Revised after the director's Turn 8:
- **a base only adds a mark**; a figure never folds under a base;
- **the stays' order shows only once every base has a date**; until
  then, concept 1's order.

## The model in one picture

```
 No Hotel-category place in the trip  ──▶  IDENTICAL to concept 1 (nothing extra shows)

 Log a hotel (an ordinary place, category Hotel)
   │
   ▼
 its figure gets a BASE MARK ◆        nothing else moves: every figure stays a figure
   │                                  (Malmö with no hotel is still "MALMÖ", top level)
   │
   └── every base's hotel has a date? (dates are never asked; one you give is used)
          │ no  ──▶ sections keep concept 1's order; in-between places stay "On the way"
          │ yes ──▶ sections take the stays' order, and in-between places sit on LEGS

 TRIP "Scandinavia 2026", all base hotels dated:
   ◆ Copenhagen ──leg──▶ ◆ Stockholm ──leg──▶ ◆ Reykjavík
     MALMÖ (no hotel): its own section, placed after the base nearest it
     Jönköping (no figure) ──▶ on the Copenhagen ↔ Stockholm leg
```

**Stored:** nothing new, beyond a date on a hotel if one is given. Base
marks, order and legs are **derived** from Hotel places and their dates.

**Legs hold only places with no figure** (what concept 1 calls "On the
way"). A place that has a figure is never moved onto a leg.

## What you see

```
 TRIP LENS, every base dated                  TRIP LENS, no dates (or no hotels) = concept 1
┌──────────────────────────────────┐        ┌──────────────────────────────┐
│ ▾ SCANDINAVIA 2026 (87)          │        │ ▾ SCANDINAVIA 2026 (87)      │
│ ◆ COPENHAGEN (31)    12–15 Sep   │        │ ◆ COPENHAGEN (31)            │
│ ── MALMÖ (12) ─────────────────  │        │ ── MALMÖ (12) ────────────   │
│ ┄ on the way to Stockholm (1) ┄  │        │ ◆ STOCKHOLM (20)             │
│ ◆ STOCKHOLM (20)     15–18 Sep   │        │ ◆ REYKJAVÍK (23)             │
│ ◆ REYKJAVÍK (23)     18–22 Sep   │        │ ── ON THE WAY (1) ────────   │
└──────────────────────────────────┘        └──────────────────────────────┘
 the header counts every place in the sections: 31 + 12 + 1 + 20 + 23 = 87
 the city lens is concept 1's, with the base's hotel(s) heading its list
```

## P: places-first

**PASS, conditionally.**
- It passes because stays and dates are never asked for; the layer only
  reacts to what was logged.
- It would FAIL if it ever prompted "add a hotel" or asked for dates.

## Creation moments

C1-C6, C8 and C9 are as in concept 1 (all PASS). What differs:

| # | Moment | What happens | Check |
|---|---|---|---|
| C7 | A hotel (the first, in Copenhagen) | Copenhagen gets ◆. **Nothing else changes:** no reorder, no folding, no legs. No dates asked | PASS |
| C7b | A second hotel, in another city | That city gets ◆ too. **The order is still concept 1's**, because not every base has a date. Malmö, with no hotel, stays its own top-level city | PASS |
| C7c | Every base's hotel has a date (given, never asked) | The sections take the stays' order. Places with no figure (On the way) move onto the leg between the two bases they sit between | PASS |

**What's gone, from the first sketch:**
- One hotel no longer turns Malmö into "Malmö · from Copenhagen".
  Logging a place never restructures what the owner sees.
- The order no longer follows the order hotels were added, so the
  Reykjavík hotel logged first can't make Reykjavík lead a trip that
  ends there.

## Test cases

| Case | Result | Check |
|---|---|---|
| T1 Øresund (Tårnby) | As in concept 1: from Copenhagen, by the memory. Bases don't change a figure | PASS |
| T2 Keflavík | As in concept 1: under Reykjavík. With a Reykjavík hotel, it sits under the ◆ Reykjavík section | PASS |
| T2 Kastrup for both cities | As in concept 1 (Tårnby in both figures, if the owner puts it there) | PASS |
| T3 Jönköping | **Every base dated**, with Copenhagen and Stockholm next to each other in order → on the Copenhagen ↔ Stockholm leg. **Otherwise** → On the way (concept 1) | PASS |

## Jobs (only where they differ from concept 1)

- **2:** the sections are in trip order once every base is dated.
- **7:** the same "belongs with…".
- **8:** a plan defaults to a day from a base **(we think)**.
- **9:** legs, once dated; On the way before that.
- **14:** PASS. It's identical to concept 1 without a hotel. A hotel
  adds the base mark; dates (never asked) add order and legs.

## Prerequisite

As in concept 1: **59 of 202 places without a real town** (58 with no
`address_details`, 1 with no town in them). Also: **0 Hotel-category
places today**, so on day one this concept *is* concept 1.

## Open (owner questions)

- 3: are hotels and airports places to visit, or the trip's frame?
- 4: should order or dates be used? This concept uses order only once
  every base has a date.
- Plus concept 1's questions.
