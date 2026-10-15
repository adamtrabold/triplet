# Concept 2: the rule that remembers, plus stays

Model only. **Everything in concept 1 holds,** including its
definitions, the border signal (pending the director) and its views.
This concept adds stays and an order. **(We think)** marks the team's
opinion.

## What exists (beyond concept 1)

- **Stay:** a place in the Hotel category. It may carry a date range.
- **Base:** a figure that contains at least one stay.
- **Order:** an order of the trip's **bases**. It exists only when the
  trip has at least two bases.
- **Leg:** the stretch between two consecutive *ordered* bases.

## Stored vs. inferred

| Stored | Inferred |
|---|---|
| concept 1's | bases (from stays) |
| a stay's date range, when it has one | the order of the bases (rule below) |
| per place: **when it was first marked visited** (a new field; today `visited` is yes/no, and `updated_at` can't stand in) | which leg an On-the-way place sits on |

## The ordering rule (one source per base, never all-or-nothing)

- **Only bases are ordered.** With no stays there are no bases and no
  order, so concept 2 is exactly concept 1, whatever has been visited.
- Each base gets its position from the first source it has:
  1. its stays' earliest date;
  2. else when a place in it was first visited;
  3. else it has no position. It's a base with no place in the order
     yet.
- Bases with a position are in order; bases without one aren't ordered.
  **Adding a base never moves the others.**
  - A new undated, unvisited stay just makes a base with no position.
  - It gets a position when it's dated or first visited.
- Nothing is ever asked for. Dates and visits are things already done
  (where dates come from: jobs.md "Dates").

## Where everything sits once there's an order

- **Bases:** in order.
- **A figure that isn't a base** (Malmö with no hotel): it stays a
  figure. It sits right after the ordered base whose anchor is nearest
  to it (it's never folded into that base).
- **"Between two bases":** a no-figure place sits on the leg whose
  straight line (anchor to anchor) is nearest to it, if it's within the
  trip's spread.
- **A no-figure place on no leg** (only one ordered base, or beyond the
  first or last base): it stays **On the way**, as in concept 1.
- **Views (job 12):** unchanged from concept 1. They're a trip, a
  figure, On the way, or nothing yet.
  - A leg is **not** a view of its own. Its places are a group inside the
    trip view, in order between its two bases.
  - On the way remains a view for the places on no leg.

**Can it be simpler?** Yes, by dropping legs: order bases only, and keep
every no-figure place in On the way. That costs job 9's "between" being
specific (Jönköping is just "on the way"), and halves the rules. **(We
think)** legs are worth it only if the owner answers Q4 with dates.

## What can be corrected, and when

- As concept 1.
- A stay's dates: only when it's added (place edit is future).
- The visit order is what happened: nothing to correct.

## P: places-first

**PASS.** Stays, dates and order are never asked for; the layer only
reacts to what's logged and visited.

## Creation moments

C1-C6, C8 and C9: as concept 1 (C2: the current view becomes the new
place's figure).

| # | Moment | Outcome | Check |
|---|---|---|---|
| C7 | A stay, the first (Copenhagen) | Copenhagen is a base. One base, so no order, no legs. Nothing else changes | PASS |
| C7b | Another stay, another figure, undated, unvisited | That figure is a base with no position. Nothing else moves | PASS |
| C7c | Bases dated (or first visited) | Those bases take positions; legs run between consecutive ordered bases; On-the-way places nearest a leg move onto it | PASS |
| C7d | No dates, the trip under way | Bases take positions as you first visit them | PASS |

## Test cases

| Case | Outcome | Check |
|---|---|---|
| T1 Øresund | As concept 1 | as concept 1 |
| T2 airports | As concept 1. An airport has a figure, so it's never on a leg | PASS |
| T3 Jönköping | Copenhagen and Stockholm are consecutive ordered bases → on their leg (it's nearest that line). Otherwise → On the way | PASS |

## Jobs (only where they differ from concept 1)

- **2:** the trip view follows the order when there is one.
- **9:** a leg when ordered; On the way otherwise.
- **14:**
  - (a) no stay → identical to concept 1, visits or not;
  - (b) an undated, unvisited stay → a base with no position, nothing
    else moves;
  - (c) dated (or visited) bases → order and legs.

## Prerequisite

As concept 1 (59 of 202 places without a real town). **0 Hotel places
today,** so on day one it is concept 1. The visit-order source needs the
new "first visited at" field.

## Open (owner questions)

3 (hotels as places or frame); 4: "Should the app put your trip in
order? It could use your hotel dates (read from a booking you paste),
the order you actually visit places, both, or neither. (We think both,
with hotel dates first.)" Plus concept 1's.
