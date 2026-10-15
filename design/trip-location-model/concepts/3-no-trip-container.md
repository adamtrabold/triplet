# Concept 3: no trip container

Model only. Figures, the memory, its corrections, On the way, and
concept 1's definitions and border signal all work as concept 1. **What's different: a trip is not an object.** **(We think)**
marks the team's opinion.

## What exists

- **Place:** a real location and its real city. No trip.
- **Cluster:** the app's "trip". Places that chain together within
  "far away" of each other. It's worked out, never made, and named from
  its countries.
- **Figure:** as concept 1, inside a cluster.
- **On the way:** as concept 1, inside a cluster.
- **Plan:** belongs to the cluster its stops sit in. A plan whose stops
  span two clusters belongs to both.

## Stored vs. inferred

| Stored | Inferred |
|---|---|
| per place: location, real city | clusters, every time (by distance) |
| **one global memory** (which figure(s) each real city belongs to; there's no trip to hang it on) | a place's figure and cluster |
| **cluster rules:** "these go together" and "these are separate", each keyed by the clusters' member figures (clusters re-form, so they can't be keyed by an id) | a cluster's generated name |
| an optional cluster name, keyed the same way | |

**A custom name survives the cluster changing.** It's attached to the
figures present when it was given.
- If the cluster grows, the name stays, and the generated name never
  overrides it.
- If the cluster splits, the part with the most of those figures keeps
  the name.
- If two named clusters join, the one with more places keeps its name.
- A "these go together" / "these are separate" rule is keyed the same
  way, so it survives growth too.

**(We think)** "far away" is another continent; unmeasured.

## What can be corrected, and when

- A real city's figure(s): as concept 1.
- Two clusters that are one trip: "these go together", any time.
- One cluster that is two trips (chained through a stopover): "these
  are separate", any time.
- A cluster's name: any time (optional).

## How you move

- The current view is always exactly one of: everything, a cluster, a
  figure, On the way, or (empty) nothing yet.
- Each level is one step up or down.
- Nothing is ever hidden: other clusters are one level up (job 10's
  concept-3 check).
- Places can be narrowed by real city, separately from figures (job 6).
- A figure's view includes the plans with any stop in it (job 8).
- A place exposes both its figure and its real city, after it's added
  (job 13).
- Constraint (job 11): the map shows exactly the view's set.

## P: places-first

**PASS, in the extreme.** There's no trip to make, name or merge, and
nothing structural is asked at add.

## Creation moments

| # | Moment | Outcome | Check |
|---|---|---|---|
| C1 | First open, empty | Nothing yet. Search is worldwide | PASS |
| C2 | First place ever | A figure (its real city) and a cluster (named from its country) now exist. The current view becomes that figure. Nothing asked | PASS |
| C3 | New real city within reach | As concept 1 (From the nearest figure) | PASS |
| C4 | Second place beyond every reach | As concept 1 | PASS |
| C5 | Outside the spread, same part of the world | A new figure in the same cluster; the cluster's name widens | PASS |
| C6 | A far-away place | A new cluster exists, named from its country. Nothing asked. "These go together" corrects it, any time after | PASS |
| C7 | A hotel | n/a (no stays layer) | n/a |
| C8 | Correcting groupings later | "These go together" / "these are separate"; never per place | PASS |
| C9 | Naming | A cluster can be named any time; optional | PASS |

## Test cases

T1, T2 and T3: as concept 1, inside the Scandinavian cluster. All PASS.

## The honest weaknesses

- **Clusters can chain** (a Toronto stopover joins Scandinavia and LA),
  or, with a generous "far away", a Paris weekend and Scandinavia 2026
  become one cluster. "These are separate" fixes it, and that is the trip
  object coming back in through the side door.
- **No past trips:** an old trip's places stay in the one collection.

## Jobs (where they differ)

- **1:** after the first place, the current view is its figure (C2).
- **2, 9, 11:** a cluster's view holds every place in it, by figure, plus
  On the way.
- **8:** plans as above.
- **10:** everything is visible, and clusters are visible and nameable.

## Prerequisite

As concept 1 (59 of 202 places without a real town).

## Open (owner questions)

5 (one trip at a time, or everything at once: this concept is
"everything"), plus concept 1's.
