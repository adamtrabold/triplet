# Concept 2: the rule that remembers, plus stays

Model only. **Everything in concept 1 holds.** This adds stays and
trip order. **(We think)** marks the team's opinion.

## What exists (beyond concept 1)

- **Stay:** a place in the Hotel category. It may carry a date range.
- **Base:** a figure that contains at least one stay.
- **Trip order:** the order of the trip's figures.
- **Leg:** the stretch between two consecutive bases in the trip order.
  It holds only places with no figure (what concept 1 calls On the way).
  A place with a figure is never on a leg.

## Stored vs. inferred

| Stored | Inferred |
|---|---|
| concept 1's | bases (from stays) |
| **a stay's date range**, when one arrives | the trip order (rule below) |
| **per place: when it was first marked visited** (a new stored field; today `visited` is yes/no and `updated_at` can't stand in) | legs, and which leg an On-the-way place sits on |

## The ordering rule (director, Turn 12)

A trip's order comes from the first source that exists:
1. **Dated stays:** every base has a dated stay → the stays' dates.
2. **Else the order you actually visited:** each figure's position is
   when a place in it was first marked visited.
3. **Else no order:** concept 1's figures, and On the way instead of
   legs.

- **Nothing is ever asked for.** Every source is something already done.
- Where dates come from (jobs.md, "How dates could arrive"):
  - **read from a pasted booking** at add, as an option offered to the
    owner (we think);
  - an optional date on hotels, held back but visible to the owner as
    the conventional route;
  - or none, in which case only rule 2 or 3 applies.
- Rule 2 gives order only during and after the trip.

## What a stay changes, and what it never changes

- A stay only marks its figure as a base. **A figure never folds under
  a base**, and nothing is reordered until the ordering rule has a
  source.
- With no stays and no visits, concept 2 **is** concept 1.

## What can be corrected, and when

- As concept 1.
- A stay's dates: only before adding (place edit is future).
- The visit order is whatever happened; it can't be corrected (there's
  nothing wrong to correct).

## P: places-first

**PASS, conditionally.** It passes because stays, dates and order are
never asked for; the layer only reacts. It would fail if it ever
prompted for a hotel or a date.

## Creation moments

C1-C6, C8 and C9: as concept 1.

| # | Moment | Outcome | Check |
|---|---|---|---|
| C7 | A hotel, undated (the first, in Copenhagen) | Copenhagen becomes a base. Nothing else changes: no order, no folding, no legs | PASS |
| C7b | A second hotel, another figure | That figure is a base too. Still no order unless the ordering rule has a source | PASS |
| C7c | Every base's stay dated (from a pasted booking) | The trip takes the stays' order. On-the-way places sit on the leg between the two bases they fall between | PASS |
| C7d | No dates, but the trip under way | The order follows the first visits (rule 2); legs follow from that order | PASS |

## Test cases

| Case | Outcome | Check |
|---|---|---|
| T1 Øresund | As concept 1. Bases never change a figure | PASS |
| T2 airports | As concept 1. An airport has a figure, so it's never on a leg | PASS |
| T3 Jönköping | With an order (from dates or visits) and Copenhagen and Stockholm consecutive → on the Copenhagen ↔ Stockholm leg. With no order → On the way | PASS |

## Jobs (only where they differ from concept 1)

- **2:** the trip view follows the trip order when one exists.
- **8:** a plan can default to a day from a base **(we think)**.
- **9:** legs when ordered; On the way before that.
- **14:** (a) no stay → identical to concept 1; (b) an undated stay → a
  base only; (c) every base dated → order and legs. Also (rule 2) visit
  order when there are no dates.

## Prerequisite

As concept 1 (59 of 202 places without a real town). Plus **0 Hotel
places today**, so on day one this concept is concept 1. Rule 2 needs the
new "first visited at" field.

## Open (owner questions)

3 (hotels as places or frame); 4, reworded: "Should the app put your
trip in order? It could use your hotel dates (read from a booking you
paste), the order you actually visit places, both, or neither. (We think
both, with hotel dates first.)" Plus concept 1's.
