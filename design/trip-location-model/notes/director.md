# Director notes -- trip / location model

## Carried over from + placement (history, not argument)
- The owner turns down 9s that buy weight with mass, or that put a
  global action in local chrome.
- His new rule: "judgments are opinions, not facts". Show the options,
  and label the team's taste as taste.
- He wants several concepts; feedback on concepts is normal iteration.

## Jam turn 3 (2026-10-15)
- **Direction:** constellations. Two truths side by side: real location
  (data) and the figure in his head (the model).
- **Concepts differ by where the figure comes from:**
  - A, rule (In/From + see-also);
  - B, choice (one home, filed at add);
  - C, trip (anchors = the Hotel/Transport categories; bases and legs).
- **Constants:**
  - S1 lens;
  - N4 one trip at a time;
  - real-city chips for "filter by city";
  - plans belong to a trip;
  - add pre-fills from the lens;
  - the tag prints both truths.
- **Rulings:**
  - the trip is a container now;
  - many-to-many in the view for A/C, not for B (an owner question);
  - kills S2 (as a shape), S3, S4, I3 and I8.
- **Owner questions:** auto vs. said-so; two cities; hotels as frame;
  order/dates; one trip at a time.
- **Next:** systems pass 2 (the jobs plus the Øresund / airport /
  day-trip cases, and what each stores).
- 2026-10-15: owner added places-first (no setup before logging places). It governs the model pick. Systems' turn 4 adds D (by region). Waiting on systems' handover.

## Jam closed -- turn 6 (2026-10-15)

### Rulings
- **Verdicts:** A, D pass; C conditional; B fails (his test, not our
  taste).
- **A + D merged** into "a rule that remembers":
  - nearest first, then a per-real-city memory;
  - a real city can sit in two figures;
  - the group-level "belongs with…" replaces the per-place see-also;
  - cost: no single-place exception (an owner question).
- **C** is an optional stays layer (it appears only once a hotel is
  logged; dates are never asked).
- **B** is kept only as the "today" reference.
- **Accepted:**
  - "On the way";
  - the 2-place city threshold (the number is our opinion);
  - nothing structural asked at add (a constant);
  - the "no trip container" model as concept 3;
  - a quiet new trip with an after-the-fact correction, plus trip merge
    as the safety net.

### Concepts
1. The rule that remembers.
2. 1 + stays.
3. No trip container.
Plus the B reference.

We think 1 is strongest. It's sent as an opinion, not as the only
option.

### Owner questions (7)
1. Fix the rule vs. one place.
2. One place under two cities.
3. Hotels as places or frame.
4. Order/dates.
5. One trip vs. everything.
6. A quiet new trip.
7. The threshold of 2.

### Prerequisite
The real-city backfill.

### Next
Systems writes jobs.md.

## Concepts scored -- turn 8 (2026-10-15)

### C4
Fixed in jobs.md: the threshold of 2 applies only beyond reach; within
reach a city stays "From" (protects job 5).

### Scores
- **C1: 9.**
- **C2: 8.** Two gaps:
  - one hotel demotes Malmö (fix: no folding, legs only for figureless
    places);
  - order by the order added is arbitrary (fix: show order only once
    hotels have dates).
- **C3: 7.** Clusters chain, and "separate" brings trips back. It stays
  as the Q5 answer, not recommended.

### Overview changes
1. Card 1's reach line.
2. Card 1's threshold line.
3. Card 2's cost line.
4. Card 3's naming (generated name).
5. Airport town softened.
6. 59 not 58.
7. Distances labelled "we think".

### Next
Visual's fixes, then I re-check C2 and the overview.
- 2026-10-15 (turn 10): C2 -> 9 (no folding; order and legs wait for dates). Overview passes cold. Send the overview + 7 questions after the jobs check.

## Turn 12 (2026-10-15)

### Visual off the loop
The owner asked why a visual designer is on a model loop. Systems owns
the concept files now.

### Date routes
- **Model:** order = dated stays → first-visit order → none. Nothing
  asked.
- **D3 is in:** it follows from places-first. It needs a stored "first
  visited at" (a DB change).
- **D1 (pasted booking) is "we think"**, an option offered to the owner.
- **D2 is held back** but visible.
- **None** = concept 2 is concept 1 plus a base mark.

### Q4 reworded
Order from hotel dates (pasted), visit order, both, or neither (we
think both).

### UI flagged for systems to strip (10 items)
- headers and counts;
- empty copy;
- tag wording;
- the "belongs with…" control;
- section headings and ◆;
- gestures;
- chips;
- map sentences;
- C3's view;
- the stale C4 flag and the reference's P grade (a fail).

## Turn 15 (2026-10-15)

### Rulings
- **Border:** an owner question (we think on), Q8.
- **Legs:** default off, inside Q4.
- **Anchor and naming:** anchor = most places (correctness); naming =
  "we think".
- **C3's name rule:** accepted.

### Scores
1 = 9, 2 = 9, 3 = 7.

### Overview edits
1. Separate "new city" from "new trip" distances.
2. Fold the trip paragraph.
3. Card 2's stretch marked "if you want it".

### Questions
8 now.

## Turn 18 -- too clever (2026-10-15)

### The count
Concept 1 had about 14 rules, 4 numbers and a table. Unpredictable, so it
doesn't sing. My own pattern: closing every checker case by rule.

### Simple version (we think)
1. Near (a day trip) → that city, else its own city.
2. One trip per continent at a time, else a new trip quietly.
3. Fix once after the fact: a town's city, split a city into a trip,
   merge trips.

Plumbing: the anchor, the continent table, the no-town fallback.

### Dropped
- the band;
- On the way;
- the threshold of 2;
- past = 60 days;
- the nearest active trip;
- the border (now an option, Q8).

### Scores
- C1 (Turn 17) = 7.
- C1 simple = 9.
- C2 = 9 (on the simple base).
- C3 = 7 (its 6-month gap accepted for it only).

### Questions
- Q7 retired.
- Q5, Q6 and Q8 reworded.

### Lesson
Count the rules a person must hold. If you can't say it out loud in
three lines, it doesn't sing.
- 2026-10-15 (turn 20): split-unvisited = plumbing, if the split fix says 'places you've been stay'. Tie-break = plumbing, but rule 2 reworded: 'A place joins its city's trip; a new continent starts one quietly.' Overview passes, with that edit. Scores 9/9/7.
