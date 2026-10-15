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
   ├── cluster "Iceland & Denmark & Sweden"   ← worked out from distance, named from countries
   │      ├── figure Reykjavík { Reykjavík, Grindavík, Reykjanesbær … }
   │      ├── figure Copenhagen { … }
   │      └── On the way
   └── cluster "United States"
          └── figure Los Angeles

 PLACE = real location + real city.  Figures: the per-real-city memory (as concept 1).
 Clusters: DERIVED every time (places within "far away" of each other chain together;
 "far away" = we think another continent, unmeasured).
 The only thing stored about a cluster: an optional NAME you gave it ("Scandinavia 2026").
```

## What you see

```
 EVERYTHING (the widest lens)                CITY LENS = concept 1's
┌──────────────────────────────────┐        ┌──────────────────────────┐
│ ALL PLACES (225)                 │        │ ‹ Iceland · Denmark · Sw…│
│ ── ICELAND · DENMARK · SWEDEN (202)│  tap   │ REYKJAVÍK (23)           │
│    Reykjavík 23 · Copenhagen 31… │ ─────▶ │ ── FROM REYKJAVÍK ────   │
│ ── UNITED STATES (23) ─────────  │        └──────────────────────────┘
└──────────────────────────────────┘
 cluster names are generated from countries; "Scandinavia 2026" is a rename you can give it
 the map: everything at once, zoomed out across the world; the clusters are visible as groups
```

There are three levels:

> All places → a cluster → a city

Each is one tap down; "‹" is one tap up.

## P: places-first

**PASS, in the extreme.** There's no trip to make, name or merge. The
first open is the map, the list and the +.

## Creation moments

| # | Moment | What happens | Check |
|---|---|---|---|
| C1 | First open, empty | Map, `ALL PLACES (0)`, "+ to log one", the + | PASS |
| C2 | First place ever | A figure (its real city) exists, and a cluster is named from its country. Nothing asked | PASS |
| C3 | New real city, same country | As in concept 1 (From the nearest) | PASS |
| C4 | Second place there | As in concept 1 (the threshold applies only beyond the reach; see concept 1's flag) | PASS |
| C5 | New country nearby | It joins the same cluster; the name widens | PASS |
| C6 | A far-away place (LA) | **No new trip and nothing to keep.** It's simply a second cluster, "United States". The tag after ADD prints "Los Angeles · United States" | PASS (and there's no correction to make) |
| C7 | A hotel | n/a (no stays layer; could be added as in concept 2) | n/a |
| C8 | Correcting trips later | **Nothing to merge:** clusters follow distance. A rule-level option, **(we think)** rarely needed: "these go together" (two clusters you think of as one trip) | PASS |
| C9 | Naming | Name a cluster any time ("Scandinavia 2026"); optional | PASS |

## Test cases

T1 (Øresund), T2 (airport) and T3 (Jönköping) behave **as in concept 1**,
inside the Scandinavian cluster. All PASS.

## Jobs (where they differ)

- **2:** "the trip" = the cluster view.
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
