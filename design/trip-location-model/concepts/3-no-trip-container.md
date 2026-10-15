# Concept 3: no trip container

Model only. **(We think)** marks the team's opinion.

## The rules

1. **Near → that city**, as concept 1 (60-80 km, we think).
2. **Trips are worked out, never kept.** Places are in the same trip
   when they're on the same continent **and** logged or visited within
   about 6 months of each other **(we think)**, chaining. Named from the
   countries.
3. **You fix things once, after the fact:** a town goes with another
   city or is its own (as concept 1); "these go together"; "these are
   separate".

Rule 2 is this model's own third rule: time is the only way a model
with no trip object can tell trips apart.

## Invisible plumbing

- Concept 1's plumbing (anchor, continent table, no-town fallback,
  districts and streets as places).
- **Stored:** per place, its location, real town, when it was logged
  (`created_at`) and first visited; one global memory; the "together" /
  "separate" rules and an optional trip name, each keyed by the trip's
  member cities (trips re-form, so they can't be keyed by an id).
- **A custom name survives the trip changing:** if it grows, it stays;
  if it splits, the part with most of those cities keeps it; if two named
  trips join, the one with more places keeps its name.
- A plan belongs to the trip its stops sit in (both, if it spans two).

## What it does with the cases

- Paris 2024, Scandinavia 2026 and Copenhagen 2028: three trips (years
  apart). The US trip: its own (another continent).
- T1-T3: as concept 1.
- **Honest limit:** trips chain. Someday Berlin logged while planning
  Scandinavia joins it until "these are separate"; so does a year of
  steady European logging.
- No trip closes; an old trip is one nothing new links to.

## How you move

- The current view is exactly one of: everything, a trip, a city, a
  plan (any narrowed by real town), or nothing yet.
- Everything is visible at once, with trips distinct and nameable (job
  10's concept-3 check).

## P: places-first

**PASS, in the extreme.** There's no trip to make, name or merge.

## Creation moments

C1-C5 and C8: as concept 1. **C6** (another continent, or months
later): a new trip, worked out, named from its country; "these go
together" fixes it. **C7:** n/a. **C9:** a trip can be named any time;
optional.

## Prerequisite

As concept 1 (59 of 202).

## Open (owner questions)

5 (this concept is the "everything at once" answer), plus concept 1's.
