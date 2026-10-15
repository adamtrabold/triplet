# Trips, cities and places: jobs and checks

What the model has to let the owner do. Sketch level: the model, not UI.
Each job has a check a fresh checker can run against a concept's sketch
(boxes, arrows, a walk-through), and say PASS or FAIL.

Concepts this applies to (jam Turn 6):
1. **A rule that remembers.**
2. **Rule + stays.**
3. **No trip container.**
4. **Reference: today (B, one home per place).** Today fails several jobs
   on purpose; it's the comparison, not a candidate.

## The owner's words (verbatim, `owner.md`)

> "there are the "locations" (things you want to visit), "cities" they
> exist in, and "trips" they may be grouped to. there are also "plans"
> which may include "locations" in many "cities." i may as a user be
> starting from a few different points... i might be planning stops
> across a large trip (e.g. "scandinavia 2026" may include spots in
> copenhagen, stockholm, reykjavik, etc. and places in between). or i
> might be planning for a specific "city" within that "trip." the real
> challenge is that mentally i might be thinking of a location being
> tied to a specific "city" that it doesn't specifically reside in, and
> so when navigating the app, i may want to click "Reykjavik" as a
> filter, but also want to see, like, the Blue Lagoon or the Airport
> that technically exist within other cities in reality."

> "the usabiity model does not have to match with how we store data. the
> app should be as simple and low friction as possible"

> "i want to be clear, im wanting to rev the app workflow as a whole not
> just fit in new ideas. i want to make sure it all sings."

> "i do not want someone to have to manually do a bunch of shit to set up
> a thing before they just start getting to logging the places they want
> to go"

> "the philosophical approach should be places-first; immediately doing
> the thing you actually want to do not the adin"

Earlier: "This is separate from filters which should have a filter by
city." Settled: editing a place is future; nothing saves without an
explicit ADD; hold-to-place is future.

## The governing rule: places-first

**P. Open the app and log or see places immediately.** Trips and cities
come out of the places, never ahead of them.

- **PASS if** the sketch's first open shows the map, the list and the +,
  with no step, picker or required field that isn't about the place
  itself, and nothing structural (trip, city, group) is asked at add.
- **FAIL if** anything must be created, named, chosen or dated before
  (or as a condition of) logging a place, or the add asks which trip or
  city.

Every job below is read through P.

## Terms (one meaning each, as in concept 1's rule tree)

All three are fixed app rules, never settings, and unmeasured (the
team's opinion):
- **Reach:** about a day trip from a figure (we think 60-80 km). A new
  place within reach of a figure joins it, as "From …".
- **Spread:** the box around the trip's figures. A place beyond every
  figure's reach but **inside** the spread goes in **On the way**.
- **Outside the spread, same part of the world:** the place starts a
  **new figure** in the same trip, and the trip widens.
- **Far away** (we think another continent): a **new trip** (concepts 1
  and 2), or a new cluster (concept 3).
- **Dated:** a Hotel place with stay dates (see C7).

## Jobs

1. **Log a place on the very first open.**
   - Check: an empty app, tap +, log a place. PASS if no trip or city
     exists, or is asked for, beforehand, and after ADD the place is in
     the list with a city name in the header.
2. **See a whole trip at once:** every place in "Scandinavia 2026",
   across its cities.
   - Check: PASS if one view lists all of the trip's places, grouped by
     city (and "On the way"), and the map shows the same set.
   - Concept 3: "the trip" = the cluster.
3. **Focus on one city of a trip.**
   - Check: PASS if one view lists just Reykjavík's figure, and the map
     shows the same set.
4. **Move between the trip and a city in one step, either way.**
   - Check: PASS if trip → city and city → trip are each one action from
     the place you are (the lens), with no screen in between.
5. **See a place under the city you think of it with, without filing
   it.** The Blue Lagoon (Grindavík) and Keflavík airport (Reykjanesbær)
   show under Reykjavík.
   - Check: PASS if, after logging both with nothing chosen, the
     Reykjavík view includes them.
   - FAIL if that needs a per-place choice at add.
6. **Find places by where they really are** ("a filter by city").
   - Check: PASS if, inside a trip or city view, the places can be
     narrowed to one real city (Grindavík), separately from the figures.
7. **Fix a wrong grouping without editing a place** (edit is future).
   - Check: PASS if "Lund belongs with Copenhagen" can be said once,
     beside the Lund places, and moves every Lund place, now and later.
   - FAIL if the only fix is a per-place change, or is impossible.
8. **Plans that cross cities.**
   - Check: PASS if a plan can hold stops from more than one city, and
     a city view shows the plans that touch that city.
9. **Places in between have a home.**
   - Check: PASS if a place beyond every figure's reach but inside the
     spread (Jönköping) appears in a findable, named section, not under
     an arbitrary city.
   - That section is **On the way** in concepts 1 and 3, and in concept
     2 until every base is dated. It's **a leg between two bases** in
     concept 2 once every base is dated.
10. **Other trips stay out of the way** (concepts 1 and 2), **or
    everything is visible at once** (concept 3).
    - Check (1, 2): PASS if LA's places never appear in Scandinavia's
      views, and LA is one action away.
    - Check (3): PASS if all places show together, with the clusters
      visible and nameable.
11. **The map shows what the list shows.**
    - Check: PASS if every view's list and map show the same set (zoom
      may hide pins on the map; it never changes the list).
12. **The header always names what you're looking at.**
    - Check: PASS if every view in the sketch has exactly one name that
      matches its list. The allowed names:
      - a trip;
      - a city (figure);
      - "On the way";
      - the empty state's "Your places";
      - concept 3's everything view, "All places", plus a cluster's
        name.
13. **The tag tells both truths, after ADD.**
    - Check: PASS if a filed place's tag shows the figure and the real
      city ("Reykjavík · in Grindavík"), and neither was asked for at
      add.
14. **Stays only appear if you log them** (concept 2). **All three
    clauses must hold:**
    - (a) With no Hotel-category place, concept 2 is identical to
      concept 1.
    - (b) After logging an **undated** hotel, its city gets a base mark
      and nothing else changes: no reorder, no folding of a city under
      another, no legs.
    - (c) Once **every** base's hotel is dated, the trip's sections take
      the stays' order, and places in On the way sit on the leg between
      the two bases they fall between.
    - In all three, no dates are ever *asked* for (see C7 for how dates
      arrive).

## Creation moments (each checked against P)

| # | Moment | PASS if the sketch shows | FAIL if |
|---|---|---|---|
| C1 | **First open, empty** | the map, an empty list ("+ to log one"), the +. Search is worldwide | any trip, city or onboarding step |
| C2 | **The first place ever** | after ADD, a trip and a city exist, named from the place (country / real city). Nothing was asked | a name, trip or city was requested |
| C3 | **The first place in a new real city within a figure's reach** (Grindavík, near Reykjavík) | it's filed under that figure as "From"; no new city appears | a question, or a new city from that one place |
| C4 | **The second place in a real city that is beyond every figure's reach** (in "On the way") | it becomes a city of its own (threshold 2: a fixed rule, not a setting; the number is the team's opinion). **Within a figure's reach (Grindavík) a real city stays "From" its figure however many places it has**, unless "belongs with… its own city" is said (director, 2026-10-15: protects job 5) | a setting, or a question; or a within-reach city splitting off on its own |
| C5 | **The first place outside the spread, in the same part of the world** (Copenhagen while the trip is Iceland; also the first Stockholm place while the trip is Copenhagen + Malmö) | a new city (figure) in the same trip from that one place; the generated trip name widens ("Iceland & Denmark"). In concept 3: it joins the same cluster, and the cluster's name widens | a question, or a forced new trip |
| C6 | **A far-away place** (LA) | **Concepts 1 and 2:** a new trip starts quietly, named from its country. The open tag prints "New trip · United States" with "Keep in Iceland & Denmark" beside it, after ADD. **Concept 3:** a new cluster appears, named from its country, visible in "All places". Nothing to keep or merge | a question before ADD |
| C7 | **A hotel** (concept 2) | **undated:** a base mark only (job 14b). **Every base dated:** stays' order and legs (14c). Dates arrive only by one of the routes in "How dates could arrive" below, never by a prompt | a date prompt, a required date, or any setup |
| C8 | **Correcting trips later** | two trips can be merged (a trip-level action, not a place edit) | the only fix is editing places |
| C9 | **Naming** | the trip is renameable any time, optionally ("Scandinavia 2026") | renaming is required to proceed |

## Test cases (run each through each concept)

| Case | Facts | PASS if (concepts 1-3) |
|---|---|---|
| **T1 Øresund:** Saltholm (an island about 12 km from Copenhagen, 20 km from Malmö) and Kastrup Søbad (Tårnby) | both in Tårnby municipality (Saltholm's we believe, not verified) | both appear under **From Copenhagen** with nothing chosen. If the owner says "Tårnby belongs with Malmö", it's one rule change that moves both |
| **T2 The airport:** Keflavík (Reykjanesbær, about 50 km from Reykjavík); Copenhagen Kastrup (Tårnby), used for both Copenhagen and Malmö | | Keflavík shows under Reykjavík with nothing chosen. Kastrup shows under Copenhagen, **and under Malmö too if Tårnby is put in both figures** (a real city in two figures). In concept 2 the airport is a place like any other: it sits in its figure's list (under the ◆ city), not on a leg, because it has a figure |
| **T3 Jönköping:** about 300 km from both Stockholm and Malmö | | it appears under **On the way** in the trip view. In concept 2, **once every base is dated**, on the leg between the two bases it falls between in the stays' order (in the concept's example, Copenhagen ↔ Stockholm). A second Jönköping place makes it a city of its own (C4: Jönköping is beyond every reach) |

Reference (today, B): T1 and T2 are filed by whatever city was chosen at
add, with one home only (Kastrup can't be under both). T3 has no
"between". Expected to fail jobs 5, 7 and 9, and P.

## What the model stores, and its prerequisite (checked)

- **Concept 1 stores:**
  - per place: its real location, real city and trip;
  - per trip: the real-city memory (which figure each real city belongs
    to; a real city can be in two), the trip's optional name, and
    merges.
- **Concept 2 stores** concept 1's, plus **a stay date on a Hotel place**
  when one arrives. Base marks, order and legs are **derived**.
- **Concept 3 stores:**
  - per place: its real location and real city (no trip);
  - **one global real-city memory** (there's no trip to hang it on);
  - **cluster rules:** "these go together" and "these are separate",
    each a pair of clusters identified by their member figures, not by
    a cluster id, since clusters are derived and re-form;
  - an optional cluster name, keyed the same way.
- **The real city comes from `locations.address_details`.** That's the
  raw OpenStreetMap address, written at add time since 2026-10-05, the
  same column the short-address work uses. The city is its `city`,
  `town`, `village` or `municipality` key.
- **The "0 of 202" in the jam (and in CLAUDE.md and docs) is out of
  date.** A read-only count of the live database today (2026-10-15)
  gives:
  - 144 of 202 places have `address_details`;
  - 143 of those carry a city / town / village / municipality;
  - **58 places have none, and 1 more has details but no city / town /
    village / municipality: 59 places without a real town.**
  - So it *is* the short-address backfill (`tools/short-address-backfill.html`,
    which writes `address_details` and `short_address`), not a separate
    one. It has evidently been run, or places have been added since,
    and it covered 144 rows.
  - The prerequisite is the **59 places without a real town**: run the
    backfill again for the 58 with none (the 1 with details but no town
    stays filed by location). Otherwise the model files them by location
    alone (nearest figure), with no real city to show or filter by.
  - CLAUDE.md's and `docs/iphone-checks.md`'s "0/202" lines are stale
    and should be corrected when this lands (the operator's call).

## How dates could arrive (concept 2), without breaking P

The problem:
- order and legs need every base dated;
- dates are never asked;
- edit is future;
- today's add form has no date.
So, as sketched, concept 2's order and legs can never switch on. Three
routes that keep P (nothing asked, nothing required). The director
rules:

| Route | How it works (sketch) | P? | Cost |
|---|---|---|---|
| **D1. Paste the booking** | At add, the NAME line accepts a pasted booking confirmation (or its text). The app finds the hotel name or address to search, and the **check-in/out dates**, which print in pencil on the blank tag ("Stay · 14-17 Sept"). ADD saves them; cross them out before ADD to drop them | **Yes:** nothing asked; the dates come from what you already did (paste) | Parsing is unreliable across booking sites (dates in many formats). A wrong date is fixable only before ADD (edit is future). Untestable here |
| **D2. An optional stay line on a Hotel tag** | When TYPE is Hotel, the blank tag shows one more pencil line, "Stay", empty by default. Write dates if you like, or ignore it | **Borderline.** It's about the place itself and never required, but it's a field that appears, which the owner may read as admin | One line, only for hotels. It's the conventional route |
| **D3. Learned on the trip** | No dates at all. The **order emerges from use**: the first time any place in a figure is marked visited, that figure's position in the trip is fixed (the order you actually travelled). Legs appear between consecutive visited figures | **Yes, fully:** places-first in the extreme; it uses what you do anyway | Order exists only *during and after* the trip, not when planning ahead. Needs a hidden `visited_at` timestamp (today `visited` is a boolean; `updated_at` changes on any edit, so it can't stand in) |

- **My read (an opinion):** D1 + D3 together, with D2 held back.
  - D1 gives order before the trip when the owner pastes bookings
    anyway.
  - D3 fills it in during the trip with no effort at all.
  - D2 is the one that asks for something to be typed, even optionally.
- **If none is accepted:** concept 2 is concept 1 plus a base mark, and
  the owner should hear that plainly with the concept, not discover it.

## Out of scope here

- UI. The look is sketch only (owner: "sketch level thought … the model
  is what to nail right now not ui").
- Editing a place, and hold-to-place: both future (owner).

NEXT: design director — rule on how concept 2's dates arrive (D1 / D2 /
D3, or none, which makes concept 2 "concept 1 plus a base mark"). Then a
fresh checker re-runs the changed checks (9, 12, 14, C3, C5-C7, T2, T3)
against the concept files.
