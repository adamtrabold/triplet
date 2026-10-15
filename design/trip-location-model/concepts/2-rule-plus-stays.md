# Concept 2: the rule that remembers, plus stays

Model only. **(We think)** marks the team's opinion.

## The rules

1-3. **Concept 1's three rules**, unchanged (near → that city; one trip
   per continent at a time; you fix things once, after the fact).
4. **A hotel makes its city a base.** A hotel beyond reach is already a
   city of its own (rule 1), so a one-night stop is a base too.
5. **Bases go in order, each from the first it has:** its hotel's dates
   (if the app has them), else when you first visited a place in it,
   else no position yet. A new base never moves the others.

With no hotel logged, this is concept 1 exactly. Nothing is ever asked
for.

## Invisible plumbing

- Concept 1's plumbing.
- **Ties share a position** (two bases with the same date, or one hotel
  whose town is in two cities).
- **No time, no position:** a place marked visited before the new "first
  visited at" field existed has no visit time, and none is invented.
- **Cities that aren't bases** are unordered, never folded into a base.
- **Stored, beyond concept 1:** a hotel's dates when it has them, and
  per place when it was first marked visited (a new field; `updated_at`
  can't stand in).
- The order is something the trip has; how a view shows it is not this
  model's call.
- Districts and streets are never hotels, so never bases.

## Off by default: stretches (Q4)

Only if the owner asks: a place sits on the stretch between two
consecutive ordered bases nearest to it. **(We think)** worth it only
with dates.

## Creation moments, test cases and jobs

As concept 1, plus:

| # | Moment | Outcome | Check |
|---|---|---|---|
| C7 | The first hotel (Copenhagen) | Copenhagen is a base. One base, no order. Nothing else changes | PASS |
| C7b | Another hotel, undated, unvisited | A base with no position. Nothing else moves | PASS |
| C7c | Bases dated, or first visited | They take positions; the trip has that order | PASS |
| C7d | No dates, the trip under way | Bases take positions as you first visit them | PASS |
| C7e | Two bases on the same date | They share a position | PASS |

- **T1-T3:** as concept 1. Jönköping is its own city; with a hotel there
  it's a base. An airport is never on a stretch.
- **Job 2:** the trip has the order when there is one. **Job 14:** (a)
  no hotel → concept 1; (b) an undated, unvisited hotel → a base with no
  position, nothing else moves; (c) dated or visited bases → an order.

## P: places-first

**PASS.** Hotels, dates and order are never asked for.

## Prerequisite

As concept 1 (59 of 202). **0 hotels today,** so on day one it is
concept 1. The visit order needs the new "first visited at" field.

## Open (owner questions)

3 (hotels as places or the frame), 4 (order from hotel dates, visits,
both or neither; stretches), plus concept 1's.
