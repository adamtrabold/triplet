# Concept 2: the rule that remembers, plus stays

Model only. **Everything in concept 1 holds,** including its
definitions, the border signal (pending the director) and its views.
This concept adds stays and an order. **(We think)** marks the team's
opinion.

## What exists (beyond concept 1)

- **Stay:** a place in the Hotel category. It may carry a date range.
- **Base:** a figure that contains at least one stay.
- **A stay in On the way promotes its real city at once** (Turn 17): a
  hotel in Gothenburg or Jönköping, logged while the town is On the way,
  makes that real city a figure (without waiting for a second place),
  and so a base. A one-night base is still a base.
- **Order:** an order of the trip's **bases**. It exists only when the
  trip has at least two bases.
- **Leg (off by default):** the stretch between two consecutive
  *ordered* bases. It only exists if the owner asks for it in Q4
  (director, Turn 15).

## Stored vs. inferred

| Stored | Inferred |
|---|---|
| concept 1's | bases (from stays) |
| a stay's date range, when it has one | the order of the bases (rule below) |
| per place: **when it was first marked visited** (a new field; today `visited` is yes/no, and `updated_at` can't stand in) | (only with legs on) which leg an On-the-way place sits on |

## The ordering rule (one source per base, never all-or-nothing)

- **Only bases are ordered.** With no stays there are no bases and no
  order, so concept 2 is exactly concept 1, whatever has been visited.
- Each base gets its position from the first source it has:
  1. its stays' earliest date;
  2. else when a place in it was first visited (only visits made once
     the new field exists: a place marked visited before then has no
     visit time, and none is invented);
  3. else it has no position. It's a base with no place in the order
     yet.
- **Ties share a position.** Two bases with the same date (or one stay
  whose real city sits in two figures, making both bases) sit side by
  side in the order, with no rule between them.
- Bases with a position are in order; bases without one aren't ordered.
  **Adding a base never moves the others.**
  - A new undated, unvisited stay just makes a base with no position.
  - It gets a position when it's dated or first visited.
- Nothing is ever asked for. Dates and visits are things already done
  (where dates come from: jobs.md "Dates").

## Where everything sits once there's an order (default: no legs)

- **Bases:** in order.
- **No-figure places:** stay **On the way**, as in concept 1. There are no
  legs by default.
- **A figure that isn't a base** (Malmö with no hotel): it stays a
  figure, **unordered**, like a base with no position. It's never folded
  into a base.
- **Only if the owner asks for legs (Q4):** a no-figure place sits on
  the leg whose straight line (anchor to anchor) is nearest to it, within
  concept 1's nearby band. A no-figure place on no leg (only one ordered base,
  or beyond the ends) stays On the way.
- **Views (job 12):** unchanged from concept 1. They're a trip, a
  figure, On the way, or nothing yet. The order is something the trip
  has; how a view shows it is not this model's call.
  - With legs on, a leg is **not** a view of its own: it belongs to the
    trip, between its two bases.
  - On the way remains a view.
- **(We think)** legs earn their extra rule only if the owner wants a
  dated order, so they're off unless the owner asks in Q4.

## What can be corrected, and when

- As concept 1 (including split and merge).
- A stay's dates: only when it's added (place edit is future).
- The visit order is what happened: nothing to correct.

## Places with no town, and districts and streets

As concept 1. A district or street is never a stay (only the Hotel
category is), so it never makes a base.

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
| C7c | Bases dated (or first visited) | Those bases take positions, and the trip view follows that order. No-figure places stay On the way (with legs on, if the owner asked: on the nearest leg) | PASS |
| C7d | No dates, the trip under way | Bases take positions as you first visit them | PASS |
| C7e | A stay in an On-the-way town (one night in Gothenburg) | Its real city becomes a figure and a base at once. Nothing else moves | PASS |
| C7f | Two bases with the same date | They share a position | PASS |

## Test cases

| Case | Outcome | Check |
|---|---|---|
| T1 Øresund | As concept 1 | as concept 1 |
| T2 airports | As concept 1. An airport has a figure, so it's never on a leg | PASS |
| T3 Jönköping | On the way (default). With legs on and Copenhagen and Stockholm as consecutive ordered bases → on their leg | PASS |

## Jobs (only where they differ from concept 1)

- **2:** the trip view follows the order when there is one.
- **9:** On the way (a leg only if the owner turns legs on).
- **14:**
  - (a) no stay → identical to concept 1, visits or not;
  - (b) an undated, unvisited stay → a base with no position, nothing
    else moves;
  - (c) dated (or visited) bases → an order (legs only if the owner
    asks).

## Prerequisite

As concept 1 (59 of 202 places without a real town). **0 Hotel places
today,** so on day one it is concept 1. The visit-order source needs the
new "first visited at" field.

## Open (owner questions)

3 (hotels as places or frame); 4: "Should the app put your trip in
order? It could use your hotel dates (if the app has them),
the order you actually visit, both, or neither. If it has an order,
should places in between sit on the stretch between two stays? (We
think both sources, hotel dates first, and stretches only if you want
dates.)" Plus concept 1's.
