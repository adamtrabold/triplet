# Jobs check: the four concepts against jobs.md

Fresh checker, 2026-10-15. I read `jobs.md`, `owner.md`, the four files in
`concepts/`, and (to settle what the reference claims about today)
`index.html` plus jam Turns 8-10.

**How strict I was:**
- A check passes only if the concept file states or draws the outcome.
- An explicit "as in concept 1" counts as stating it.
- Plausible-but-unstated fails.
- N/A only where jobs.md scopes the check to another concept.

## Totals

| Concept | PASS | FAIL | N/A | of 27 |
|---|---|---|---|---|
| 1 A rule that remembers | 25 | 0 | 2 (14, C7) | 27 |
| 2 Rule + stays | 23 | 4 (2, 14, C7, T2) | 0 | 27 |
| 3 No trip container | 22 | 3 (1, C1, C6) | 2 (14, C7) | 27 |
| 4 Reference: today | 1 (12) | 24 | 2 (14, C7) | 27 |

All four of jobs.md's predicted failures for the reference (5, 7, 9 and
P) are confirmed. It also fails a good deal more than jobs.md predicts.

---

## Concept 1: a rule that remembers (`concepts/1-rule-that-remembers.md`)

| Check | Result | Reason (concept file) |
|---|---|---|
| P | PASS | §P: first open is map, list and +; the tag at add shows only name, address, type and notes; trip and figure print after ADD |
| 1 | PASS | C2: after ADD, trip "Iceland" and figure "Reykjavík" exist; header `REYKJAVÍK (1)`; nothing asked |
| 2 | PASS | Trip lens: `REYKJAVÍK (23)`, `COPENHAGEN (3)`, `ON THE WAY (1)` = 27, matching the header; "The map always shows the list's set". *Flag: the drawing shows section headings only, with no rows under them, and "tap a heading" goes to the city lens. The quick-read says "sections", so I read it as a list.* |
| 3 | PASS | City lens `REYKJAVÍK (23)` plus `FROM REYKJAVÍK`; the map shows the list's set |
| 4 | PASS | "‹" (city → trip) and "tap a heading" (trip → city), one action each, drawn |
| 5 | PASS | C3: Blue Lagoon goes under `FROM REYKJAVÍK › Grindavík` with nothing chosen. T2: Keflavík under `FROM REYKJAVÍK › Reykjanesbær`. *Note: this depends on a Reykjavík figure already existing. If the Blue Lagoon is the first place ever, C2 makes "Grindavík" the figure. Job 5 doesn't test that order.* |
| 6 | PASS | The filters panel has "+ REAL-CITY chips ('filter by city')", separate from the figures |
| 7 | PASS | "belongs with…" sits beside `Lund · 3`: "one tap: every Lund place, now and later" |
| 8 | PASS | Quick-read: "plans belong to the trip; a city lens shows the plans touching it". *Stated in text only; the city-lens drawing has no plans row.* |
| 9 | PASS | Jönköping goes in `ON THE WAY` in the trip lens (T3); the rule tree's SPREAD branch |
| 10 | PASS | "▾ = other trips (LA), never mixed in"; one tap |
| 11 | PASS | "The map always shows the list's set" |
| 12 | PASS | Each drawn view has one name. *Flag: the C1 empty view is `YOUR PLACES (0)`, which is none of "a trip, a city, or On the way" (see the ambiguities section)* |
| 13 | PASS | Quick-read 13 and §P: the tag after ADD reads "Reykjavík · in Grindavík"; nothing asked at add |
| 14 | N/A | Scoped to concept 2 |
| C1 | PASS | Map, `YOUR PLACES (0)`, "+ to log one", the +, "Search is worldwide" |
| C2 | PASS | Trip "Iceland" and figure "Reykjavík" are named from the place; nothing asked |
| C3 | PASS | Grindavík goes "From Reykjavík"; no new city. *Flag: only the within-reach case is shown. The rule tree makes a new figure from ONE place for a same-country city outside the spread (e.g. the first Stockholm place while the trip is Copenhagen + Malmö), which C3's FAIL column forbids as written (see the ambiguities section)* |
| C4 | PASS | Matches jobs.md's amended C4: threshold 2 only beyond reach; Grindavík stays "From"; "its own city" is offered. *Flag: the file's "Flag on C4" quotes jobs.md wording that is no longer in jobs.md (it was fixed in Turn 8), so that flag is stale* |
| C5 | PASS | Tivoli makes a new figure "Copenhagen" in the same trip; the name widens to "Iceland & Denmark". *Flag: "spread" means the opposite here from jobs.md (see the ambiguities section)* |
| C6 | PASS | New trip "United States" starts quietly; the tag prints `New trip · United States` / `Keep in Iceland & Denmark` after ADD |
| C7 | N/A | Concept 2 only (the file also says n/a) |
| C8 | PASS | "Trip list: merge two trips (a trip-level action)". Stated, not drawn |
| C9 | PASS | "Rename the trip any time; never needed to proceed" |
| T1 | PASS | Both places under `FROM COPENHAGEN › Tårnby`; "Tårnby belongs with Malmö" is one change that moves both. *Note: Saltholm's Tårnby is unverified (jobs.md). If its OSM address has no town, it's filed by location; still nearest to Copenhagen* |
| T2 | PASS | Keflavík under Reykjavík; Kastrup under Copenhagen, and in both figures after "belongs with… also Malmö" |
| T3 | PASS | Inside the spread, so `ON THE WAY`; a second place makes it a city |

## Concept 2: rule + stays (`concepts/2-rule-plus-stays.md`)

"Everything in concept 1 holds" (line 3), so its passes carry over unless
something below differs.

| Check | Result | Reason (concept file) |
|---|---|---|
| P | PASS | §P: stays and dates are never asked for; the layer only reacts |
| 1 | PASS | As concept 1 (C1-C6 "as in concept 1") |
| 2 | **FAIL** | Both trip-lens drawings say `SCANDINAVIA 2026 (96)`, but their sections add up to 31+12+1+20+23 = **87**. As drawn, 9 of the trip's places appear in no section. Probably a drafting slip, but the view as drawn doesn't list the whole trip |
| 3 | PASS | "the city lens is concept 1's, with the base's hotel(s) heading its list" |
| 4 | PASS | As concept 1 |
| 5 | PASS | T2: Keflavík under Reykjavík, and under the ◆ Reykjavík section with a hotel |
| 6 | PASS | As concept 1 |
| 7 | PASS | "the same 'belongs with…'" |
| 8 | PASS | As concept 1, plus "a plan defaults to a day from a base (we think)" |
| 9 | PASS | On the way until every base is dated, then legs. Either way the place has a findable section |
| 10 | PASS | As concept 1 (▾) |
| 11 | PASS | As concept 1 |
| 12 | PASS | One name per view; "┄ on the way to Stockholm ┄" names its section |
| 13 | PASS | As concept 1 |
| 14 | **FAIL** | First clause PASSES: "No Hotel-category place … IDENTICAL to concept 1". The second clause fails. Jobs.md wants "after logging a hotel … the trip takes the stays' order, and in-between places sit on legs, with no dates asked". Concept 2 (C7, C7b) gives only the ◆ mark until **every base has a date**. *Flag: unclear whether "Also PASS if" means either clause or both; I read it as both* |
| C1-C6 | PASS (×6) | "C1-C6, C8 and C9 are as in concept 1 (all PASS)" |
| C7 | **FAIL** | jobs.md: "the base, order and legs appear; no dates asked". Concept 2's C7 shows the base only: "no reorder, no folding, no legs". Order and legs need dates (C7c). This is the director's Turn 8 fix, but jobs.md's C7 was never updated (see the contradictions section) |
| C8 | PASS | As concept 1 |
| C9 | PASS | As concept 1 |
| T1 | PASS | "As in concept 1 … Bases don't change a figure" |
| T2 | **FAIL** | Keflavík and Kastrup PASS as in concept 1. The concept-2 clause, "a hotel-adjacent airport sits at the edge of its base", isn't shown: Keflavík simply "sits under the ◆ Reykjavík section". *Flag: "at the edge" is undefined (a list position? the map?)* |
| T3 | PASS | On the leg when every base is dated, otherwise On the way; a second place → city (inherited). *Flag: jobs.md says "Stockholm → Malmö leg"; the concept says Copenhagen ↔ Stockholm, because Malmö has no hotel in its example. Same geography, different data* |

**Load-bearing issue, not a scored check:** there is no way to give a
date.
- Dates are "given, never asked", but no sketch shows where a date is
  entered.
- Editing a place is future (owner), and today's add form has no date
  field.
- So as sketched, C7c (order and legs) can never trigger. Concept 2 is
  concept 1 plus a ◆ mark until a date input is designed.
- Adding an optional date field at add needs a P ruling. Arguably it's
  "about the place itself", but it's a new field on the add form.

## Concept 3: no trip container (`concepts/3-no-trip-container.md`)

Figures are "exactly as in concept 1" (line 3). Jobs not listed under
"where they differ" are read as concept 1's.

| Check | Result | Reason (concept file) |
|---|---|---|
| P | PASS | "There's no trip to make, name or merge"; the first open is map, list and + |
| 1 | **FAIL** | Job 1 needs "a city name in the header" after ADD. C1 opens on `ALL PLACES (0)`, and C2 never says which lens or header shows after the first ADD. The only lens shown at that moment is ALL PLACES |
| 2 | PASS | "the trip" = the cluster view (jobs.md allows this); the model picture shows the cluster → figures + On the way. *Flag: the cluster view, the concept's own middle level, is never drawn. It passes only through concept 1's trip lens* |
| 3 | PASS | "CITY LENS = concept 1's" |
| 4 | PASS | "Each is one tap down; '‹' is one tap up" |
| 5 | PASS | C3 and T2 "as in concept 1" |
| 6 | PASS | As concept 1 (city lens and filters) |
| 7 | PASS | "belongs with…" as concept 1 |
| 8 | PASS | "a plan belongs to the cluster its stops sit in … two clusters … shows in both" |
| 9 | PASS | On the way, inside the cluster (model picture; T3 as in concept 1) |
| 10 | PASS | Concept-3 variant: the EVERYTHING lens shows both clusters, named; renameable (C9) |
| 11 | PASS | Everything lens: "the map: everything at once"; the city lens is concept 1's. *Flag: the cluster view's map isn't stated (same undrawn view as job 2)* |
| 12 | PASS | One name per view. *Flag: `ALL PLACES` isn't "a trip, a city, or On the way", yet job 10(3) requires such a view (see the ambiguities section)* |
| 13 | PASS | As concept 1 (not listed as different). C6's "Los Angeles · United States" is figure · cluster, a place inside its own figure |
| 14 | N/A | Concept 2 only |
| C1 | **FAIL** (minor) | `ALL PLACES (0)`, "+ to log one", the +, but no "Search is worldwide". C1's row is restated in full without it, so it isn't inherited. Fix: one phrase |
| C2 | PASS | "A figure (its real city) exists, and a cluster is named from its country. Nothing asked" |
| C3 | PASS | As concept 1 (same flag as concept 1's C3) |
| C4 | PASS | As concept 1 |
| C5 | PASS | "It joins the same cluster; the name widens" |
| C6 | **FAIL** (by the letter) | jobs.md's PASS needs a new trip and `New trip · United States` / `Keep in …` on the tag. Concept 3 has "no new trip and nothing to keep". It doesn't hit the FAIL column (no question before ADD), but it doesn't meet the PASS column either. *C6 has no concept-3 variant, unlike job 10* |
| C7 | N/A | "n/a (no stays layer)" |
| C8 | PASS | "these go together" merges two clusters at the rule level, not by editing places |
| C9 | PASS | "Name a cluster any time … optional". *Flag: a name stored on a cluster that's derived "every time" has no stable key once clusters re-chain* |
| T1 | PASS | "as in concept 1, inside the Scandinavian cluster" |
| T2 | PASS | Same (the concept-2 clause doesn't apply) |
| T3 | PASS | Same |

## Concept 4: reference, today (`concepts/4-reference-today.md`)

| Check | Result | Reason (concept file) |
|---|---|---|
| P | **FAIL** (predicted) | "every add files the place into one city … a wrong home is permanent". *Worse than the file says: today's add form opens with a visible **City** select (`index.html` 2801-2802), and pins also get a new-city confirm (`maybeDetectCity`, 4853-4865), not just shapes. The add asks which city, so P fails outright, not "in spirit"* |
| 1 | **FAIL** | The cities are seeded before any place: "a fixed registry … the cities exist before any place" |
| 2 | **FAIL** | "No trip object … no grouping above a city"; no grouped view and no On the way |
| 3 | **FAIL** | `REYKJAVÍK LIST` holds only places filed "Reykjavík" ("the Blue Lagoon shows here only if it was filed 'Reykjavík'"), not a figure. The map isn't stated |
| 4 | **FAIL** | No trip to move to |
| 5 | **FAIL** (predicted) | One home per place; the Blue Lagoon shows only if inferred or chosen as Reykjavík |
| 6 | **FAIL** | "Real city … not shown or filtered" |
| 7 | **FAIL** (predicted) | "a misfiled place needs edit (future)" |
| 8 | **FAIL** | Plans aren't in the sketch |
| 9 | **FAIL** (predicted) | "there's no 'between'" (T3) |
| 10 | **FAIL** | C6: "LA is just another city among the five; no trips" |
| 11 | **FAIL** | Not stated in the sketch (an omission; I didn't verify the app's behaviour) |
| 12 | PASS | `REYKJAVÍK LIST (23)` names the city it lists |
| 13 | **FAIL** | The real city isn't shown |
| 14 | N/A | Concept 2 only |
| C1 | **FAIL** | "opened on the active city; the cities are seeded". A city exists ahead of the places. *The file says "PASS-ish"* |
| C2 | **FAIL** | No trip is created, and the city is the seeded one or chosen in the City field, not named from the place. *The file says PASS* |
| C3 | **FAIL** | "no 'From'; it's arbitrary" (the file agrees) |
| C4 | **FAIL** | "no new city appears from places", so the PASS outcome never happens. *The file says n/a* |
| C5 | **FAIL** | A new-city dialog (a question), or the nearest city; no trip name widens. *The file says "partial"* |
| C6 | **FAIL** | Agrees with the file |
| C7 | N/A | |
| C8 | **FAIL** | Agrees with the file |
| C9 | **FAIL** | There's no trip to rename. *The file says n/a* |
| T1 | **FAIL** | Each place is filed on its own; there's no single rule that moves both. *The file says "partial"* |
| T2 | **FAIL** | "One home only" (agrees) |
| T3 | **FAIL** | "no 'between'" (agrees) |

Prediction check: jobs.md's "fails 5, 7 and 9, and P" is confirmed, but
it's incomplete. Today also fails jobs 1-4, 6, 8, 10, 11 and 13. The
reference file under-grades itself on P (the City field), C1, C2, C4,
C5 and C9.

---

## Ambiguous checks (fix in jobs.md)

1. **C3 contradicts C4/T3 and C5.**
   - C3 says the first place in a new same-country real city is "filed
     under the nearest city as From" and FAILs "a new city from one
     place".
   - But jobs.md's own C4/T3 send a beyond-reach place (Jönköping, same
     country as Stockholm and Malmö) to On the way, not "From".
   - And concept 1's rule tree makes a new figure from one place for a
     same-country city outside the spread. The first Stockholm place,
     while the trip is Copenhagen + Malmö, is exactly that, and it's what
     the owner wants.
   - Fix: scope C3 to "within a figure's reach".
2. **"Spread" means opposite things.**
   - jobs.md C5: "within the trip's spread → a new city".
   - Concept 1: "inside the SPREAD → ON THE WAY"; "outside the spread,
     same part of the world → a new figure".
   - One word needs one definition.
3. **Job 14's "Also PASS if"** can be read as either clause or both
   clauses. I used both.
4. **T2's "at the edge of its base"** (concept 2) is undefined.
5. **Job 12's allowed names** ("a trip, a city, or On the way") exclude
   the empty state (`YOUR PLACES`, concept 1) and concept 3's required
   everything view (`ALL PLACES`, which job 10(3) itself demands).
6. **C6 has no concept-3 variant,** so concept 3 fails it by design.
   Job 10 gives concept 3 an alternative; C6 should too.

## Contradictions

1. **jobs.md wasn't updated after concept 2's Turn 8/9 revision.**
   - Job 9 ("or a leg"), job 14 (second clause), C7 ("base, order and
     legs appear") and T3 ("with stays: on the leg") all assume a hotel
     alone produces order and legs.
   - Concept 2 now waits for every base to be dated.
   - This is the source of concept 2's C7 and job 14 failures. The
     director accepted the revision (Turn 10, scored 9), so jobs.md is
     the stale side.
2. **Concept 1's "Flag on C4" quotes a C4 wording jobs.md no longer
   has** (amended Turn 8). The flag is stale.
3. **Concept 2's counts:** a header of 96 against sections that sum to 87.
4. **jobs.md's "What the model stores" doesn't fit concept 3.**
   - jobs.md says concepts 1 and 3 store per-real-city memory "per
     trip". Concept 3 has no trip, so its memory must be global.
   - Concept 3 says "the only thing stored about a cluster: an optional
     NAME". But C8's "these go together" (and the weakness fix "these
     are separate") must also be stored.
5. **The prerequisite count.**
   - jobs.md says "58 places have none" and "the prerequisite is the 58
     remaining".
   - All four concept files say **59** (58 with no `address_details`,
     plus 1 with details but no town), as do the director (Turn 8) and
     systems.
   - jobs.md should say 59.
6. **The reference understates today:** "inferred from the point; a
   new-city dialog for shapes". Today's add form has a City select as
   its first field, plus a new-city confirm for pins (`index.html`
   2801-2802, 4853-4865).

## Failures that matter

- **Concept 2: there's no way to give a date.** Order and legs need
  every base dated, dates are never asked, and editing is future. As
  sketched, its stays benefit can't switch on. This needs a designed
  input (with a P ruling) or the owner's Q4 answer.
- **jobs.md C3 vs C4/T3/C5, and the two meanings of "spread".** Every
  concept "passes" C3 only on the within-reach example. Fix the check
  before the owner reads the results.
- **Concept 3's middle level (the cluster = trip view) is never drawn.**
  Jobs 2, 9 and 11 pass only by inheritance, and job 1 fails because the
  first-ADD header isn't shown.
- Everything else is drafting (concept 2's 96/87, concept 3's C1
  search line) or a stale jobs.md line.
