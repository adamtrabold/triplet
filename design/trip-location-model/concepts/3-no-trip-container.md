# Concept 3: no trip container

Sketch level, model not UI. Figures (cities) work exactly as in concept
1: nearest, the memory, "belongs with…", On the way. **What's different
is that a trip isn't an object.** All places are one collection; the
app sees **clusters** (places close enough to be one trip) and names them
by country. **(We think)** marks the team's taste.

## The model in one picture

```
 ALL PLACES (one collection; nothing stores "trip")
   │
   ├── CLUSTER "Iceland · Denmark · Sweden"   ← worked out from distance, named from countries
   │      ├── figure Reykjavík  { Reykjavík, Grindavík, Reykjanesbær … }
   │      ├── figure Copenhagen { København, Frederiksberg, Tårnby }
   │      ├── figure Stockholm  { … }
   │      └── On the way        { Jönköping … }
   └── CLUSTER "United States"
          └── figure Los Angeles
```

**Stored** (corrected after the jobs check):
- **per place:** location and real city only; there's no trip field.
- **global, not per trip:** the per-real-city memory (which figure(s)
  each real city belongs to).
- **per cluster, all optional:**
  - a NAME given to it ("Scandinavia 2026");
  - "these go together" / "these are separate" rules between clusters.

**Derived:** the clusters, every time. Places within "far away" of each
other chain into one cluster. **(We think)** "far away" is another
continent; unmeasured.

## The cluster: this concept's "trip", on its own terms

The middle level is a cluster: a group the app worked out, not a
container anyone made. It's drawn here as its own view.

```
 CLUSTER LENS
┌────────────────────────────────────────────┐
│ ‹ All places                               │   one tap up to everything
│ ICELAND · DENMARK · SWEDEN (202)           │   the generated name (or "Scandinavia 2026" once renamed)
│ ── REYKJAVÍK (23) ───────────────────────  │   tap a heading → that city lens
│    Hallgrímskirkja                         │
│    Sundhöllin …                            │
│    from Reykjavík: Blue Lagoon · Grindavík │
│ ── COPENHAGEN (31) ──────────────────────  │
│    Tivoli …                                │
│ ── MALMÖ (12) ───────────────────────────  │
│ ── STOCKHOLM (20) ───────────────────────  │
│ ── ON THE WAY (1) ───────────────────────  │
│    Jönköping place · Jönköping             │
│ …                                          │
└────────────────────────────────────────────┘
 MAP: exactly this list's set (every place in the cluster, On the way included),
      framed to the cluster. Zoom may hide pins; it never changes the list.
 FILTERS: kind, visited, starred + real-city chips within the cluster.
```
- **Job 2 (a whole trip):** this view lists every place in the cluster,
  by city, with On the way. The sections add up to the header.
- **Job 9 (in between):** Jönköping sits under ON THE WAY in the cluster
  lens, as in concept 1's rule, but with the cluster standing in for
  the trip.
- **Job 11 (the map matches):** for the cluster lens, the map shows the
  cluster's set, framed to it.
  - For ALL PLACES: everything, framed to the world.
  - For a city lens: as concept 1.

## What you see, all three levels

```
 ALL PLACES                         CLUSTER LENS (above)             CITY LENS = concept 1's
┌──────────────────────────────┐   ┌──────────────────────────┐    ┌──────────────────────────┐
│ ALL PLACES (225)             │   │ ‹ All places             │    │ ‹ Iceland · Denmark · Sw… │
│ ── ICELAND · DENMARK ·       │──▶│ ICELAND · DENMARK ·      │──▶ │ REYKJAVÍK (23)           │
│    SWEDEN (202) ──────────── │   │ SWEDEN (202)             │    │ ── FROM REYKJAVÍK ────   │
│ ── UNITED STATES (23) ────── │◀──│ ── REYKJAVÍK (23) ── …   │◀── │   Blue Lagoon · Grindavík│
└──────────────────────────────┘   └──────────────────────────┘    └──────────────────────────┘
 map: the world, both clusters      map: the cluster               map: the city's figure
```
- Each level is one tap down (tap a heading) and one tap up ("‹").
- Cluster names are generated from countries. "Scandinavia 2026" is a
  rename the owner can give one.
- **(We think)** the app opens on the last lens used, usually a city.

## P: places-first

**PASS, in the extreme.** There's no trip to make, name or merge. The
first open is the map, the list and the +, and nothing structural is
asked at add.

## Creation moments

| # | Moment | What happens | Check |
|---|---|---|---|
| C1 | First open, empty | Map, `ALL PLACES (0)`, "+ to log one", the +. **Search is worldwide** (there's no cluster to scope it) | PASS |
| C2 | First place ever (Hallgrímskirkja) | After ADD, a figure "Reykjavík" and a cluster "Iceland" exist, both named from the place. **The lens moves to the place's city: header `‹ Iceland  REYKJAVÍK (1)`.** Nothing asked | PASS (job 1: a city name in the header) |
| C3 | New real city within reach, same country | As in concept 1 (From the nearest) | PASS |
| C4 | Second place in a real city beyond every reach | As in concept 1 / jobs.md C4 (a city of its own). Within reach it stays "From" | PASS |
| C5 | New country nearby (Tivoli) | It joins the same cluster as a new figure; the generated name widens to "Iceland · Denmark" | PASS |
| C6 | A far-away place (Griffith Observatory) | See below | see below |
| C7 | A hotel | n/a (no stays layer; could be added as in concept 2) | n/a |
| C8 | Correcting groupings later | Nothing to merge: clusters follow distance. Rules at the cluster level, never per place: "these go together" (two clusters as one trip) and "these are separate" (break a chain) | PASS |
| C9 | Naming | Name a cluster any time ("Scandinavia 2026"); optional. *(The jobs check flagged that a name on a derived cluster needs a stable key when clusters re-chain. We think it sticks to the cluster holding most of the places it was given to; unresolved.)* | PASS |

### C6, played out (concept 3's own version)

```
 log Griffith Observatory  ──ADD──▶  it's "far away" from every place, so the app sees a 2nd cluster
                                     the lens moves to its city:  ‹ United States   LOS ANGELES (1)
                                     the open tag prints, after ADD:
                                       Los Angeles · in Los Angeles
                                       New group · United States   |   Goes with Iceland · Denmark · Sweden
```
- **Nothing is asked before ADD.** The new group is just what the app
  sees.
- "Goes with…" is the correction beside it, after the fact. It writes a
  "these go together" rule, so LA would show inside the Scandinavian
  cluster. **(We think)** it's rarely used.
- This is concept 1's C6 moment, with "trip" read as "cluster".
  jobs.md's C6 has no concept-3 variant (the checker's point). Judged by
  its intent, PASS: nothing is asked, a group starts quietly, and a
  correction sits on the tag. A concept-3 wording for C6 is for systems
  and jobs.md.

## Test cases

T1 (Øresund), T2 (airport) and T3 (Jönköping) behave **as in concept 1**,
inside the Scandinavian cluster. T3's Jönköping shows under ON THE WAY in
the cluster lens (drawn above). All PASS.

## Jobs (where they differ)

- **1:** after the first ADD, the header names the city (C2).
- **2, 9, 11:** the cluster lens, drawn above.
- **10:** **the other check applies:** everything is visible at once,
  and the clusters are visible and nameable. PASS.
  - Cost: LA is one level up, never hidden. Opening the app wide shows
    both.
  - **(We think)** most opens land on the last city lens, so in practice
    LA is out of sight.
- **8:** a plan belongs to the cluster its stops sit in. A plan with
  stops in two clusters is allowed, and it shows in both.

## The honest weaknesses

- **Clusters can surprise.** A place halfway between two clusters
  (a stopover in Toronto) could chain them into one. "Far away" has to
  be generous **(we think another continent)**, and then a weekend in
  Paris and Scandinavia 2026 would be one cluster.
  - The fix is a cluster-level "these are separate", which is the trip
    object coming back in through the side door.
- **No "past trip":** an old trip's places stay in the collection
  forever. Visited marks keep them honest, but nothing archives them.

## Prerequisite

As in concept 1: **59 of 202 places without a real town** (58 with no `address_details`, 1 with no town in them).

## Open (owner questions)

- 5: one trip at a time, or everything at once? This concept is the
  "everything" answer.
- Plus concept 1's questions.
