# Jobs check 2 (fresh checker, 2026-10-15)

Run against `jobs.md` (as of Turn 13) and the four stripped concept files
in `concepts/`. The owner: "the model is what to nail right now not ui".
Rule used: a check passes only if the concept file **states** the
outcome. Plausible or implied-by-another-concept doesn't count unless the
file says it inherits it. Nothing failed for lacking UI.

## Tally

| Concept | PASS | FAIL | n/a | Total |
|---|---|---|---|---|
| 1 A rule that remembers | 23 | 2 (job 1, T1) | 2 (14, C7) | 27 |
| 2 Rule + stays | 22 | 5 (jobs 1, 12, 14; C7; T1) | 0 | 27 |
| 3 No trip container | 21 | 4 (jobs 6, 8, 13; T1) | 2 (14, C7) | 27 |
| 4 Reference: today | 1 (job 12) | 24 | 2 (14, C7) | 27 |

## The failures that matter

1. **Malmö can never become a city on its own (concepts 1-3; fails
   T1).** Malmö is about 28 km from Copenhagen (centre to centre, from
   `CITIES` in `index.html`), and Lund about 39 km. That's well inside
   "reach" (60-80 km). So rule step 2 files Malmö and Lund **From
   Copenhagen**, and C4 says a within-reach city stays From "however
   many places it has". Yet T1 ("Tårnby belongs with Malmö"), T2 (Kastrup
   under both), job 7 ("Lund belongs with Copenhagen") and C5's own
   example ("the trip is Copenhagen + Malmö") all assume a Malmö figure.
   No file shows how one arises without an extra correction ("make Malmö
   its own figure"). So T1's "one rule change" is really two. The
   owner's own example cities are the ones the rule merges.
2. **Concept 2's visit order breaks job 14 (a) and (b), and C7.**
   - (a) Rule 2 orders the trip by first visits, and it needs no hotel.
     So with no Hotel place but some visits, concept 2 is **not**
     identical to concept 1. The file's own line is narrower ("With no
     stays **and no visits**"). The overview's "Identical to 1, until a
     hotel is logged" contradicts the file.
   - (b) An undated hotel can change more than a base mark:
     - In a trip already ordered by dates, a new undated base breaks
       rule 1 ("every base has a dated stay"), so the order drops to
       visit order or none, and the legs vanish or move.
     - In a trip ordered by visits, a second base (even undated) creates
       a leg, so On-the-way places move onto it.
     - C7/C7b only state the first-hotel case.
   - Also, C7d's "legs follow from that order" has no bases to run
     between if no hotel exists. A leg is defined as running between
     bases.
3. **Concept 2: views in the ordered state are unstated (fails job
   12).** Once there's an order, On the way is replaced by legs. The
   file never says whether a leg is a view, or what the On the way view
   becomes. Job 12's allowed names don't include a leg either.
4. **Concept 2 gaps (passed, but real):**
   - Rule 1 orders only bases, so where non-base figures sit in the
     order is unstated.
   - Which two bases a place "falls between" is undefined. T3 only
     covers "Copenhagen and Stockholm consecutive".
   - A no-figure place that isn't between two bases (one base, or
     beyond the ends) has no stated home once there's an order.
5. **Concepts 1 and 2 don't say what you're looking at after the first
   ADD (fails job 1).** Concept 3 states it ("the current view becomes
   that figure"); concepts 1 and 2 don't. It's a one-line fix.
6. **Concept 3 inherits less than it uses (fails jobs 6, 8, 13).** Its
   inheritance line covers only "figures, the memory, its corrections
   and On the way". Its own "How you move" leaves out:
   - narrowing by real city (job 6);
   - a figure's view showing the plans that touch it (job 8, 2nd half);
   - a place showing both its figure and its real city (job 13).
   These are one-line fixes, not model problems.

## Concept 1: a rule that remembers

| Check | Result | Basis / note |
|---|---|---|
| P | PASS | "Nothing is created, named, chosen or dated before or during adding." |
| 1 | **FAIL** | C2 creates the trip and figure, but the file never says what the current view is after the first ADD. Job 1 needs a city name in the header. Concept 3 states this; concept 1 doesn't |
| 2 | PASS | Jobs table: the trip view shows every place, by figure, plus On the way; plus the map constraint |
| 3 | PASS | The figure view, plus the map constraint |
| 4 | PASS | "Trip ↔ figure is one step either way" |
| 5 | PASS | C3 (Grindavík) and T2 (Reykjanesbær) both join Reykjavík with nothing chosen |
| 6 | PASS | "Places can be narrowed by real city, separately from figures" |
| 7 | PASS | "A real city's figure(s), any time, once, for all its places now and later … never a place." The memory is per trip, so "later" means within this trip |
| 8 | PASS | A plan "can cross figures"; "a figure's view includes the plans with any stop in it" |
| 9 | PASS | Jönköping → On the way (T3) |
| 10 | PASS | "Other trips are one step away and never mixed in" |
| 11 | PASS | "The map shows exactly the view's set" |
| 12 | PASS | The view is always exactly one of: trip, figure, On the way, nothing yet |
| 13 | PASS | "Trip and figure are inferred, and are exposed after the place is added"; jobs table: figure and real city |
| 14 | n/a | Concept 2 only |
| C1 | PASS | No trip, no figure, search worldwide |
| C2 | PASS | "Iceland" / Reykjavík, named from the place, nothing asked |
| C3 | PASS | |
| C4 | PASS | Threshold 2 beyond reach; within reach stays From unless corrected |
| C5 | PASS | Tivoli → new figure, the name widens. (Its second example, "Copenhagen + Malmö", needs a Malmö figure; see failure 1) |
| C6 | PASS | A new trip without asking; can be kept in the current trip after |
| C7 | n/a | |
| C8 | PASS | Merge two trips |
| C9 | PASS | |
| T1 | **FAIL** | The first half passes (both From Copenhagen). "Moving Tårnby to Malmö is one correction" assumes a Malmö figure, which the rule doesn't produce (failure 1) |
| T2 | PASS (flag) | Keflavík passes. Kastrup in both: the check is phrased "if Tårnby is put in both figures", so it passes on its own terms, with the same Malmö caveat |
| T3 | PASS | |

Other concept 1 issues (not scored):
- **"Within reach of a figure" has no defined measure.** Measured from
  the figure's own city, or from any member? From the place, or from its
  real city's centre?
  - If it's from any member, figures snowball outward (each joined town
    extends the reach).
  - The figure example's **Bláskógabyggð** (Geysir / Laugarás, roughly
    90-100 km) may not join Reykjavík by the rule at all. With one
    figure the spread is tiny, so rule 4 would make it a figure of its
    own.
- **The outcome depends on order.** The first place in a region names
  the figure. Log Roskilde before Tivoli and Copenhagen becomes "From
  Roskilde" for good, unless corrected.

## Concept 2: rule + stays

Inherits concept 1's results except where noted.

| Check | Result | Basis / note |
|---|---|---|
| P | PASS | "Nothing is ever asked for." The file grades itself "conditionally"; it stays PASS only while D2 (the date line) stays out |
| 1 | **FAIL** | As concept 1 |
| 2 | PASS (flag) | The trip view follows the order. Where non-base figures go is unstated (failure 4) |
| 3-7 | PASS | As concept 1 |
| 8 | PASS | As concept 1 |
| 9 | PASS (flag) | Jönköping: On the way, or on a leg. Some no-figure places have no stated home once ordered (failure 4) |
| 10, 11, 13 | PASS | As concept 1 |
| 12 | **FAIL** | Ordered-state views unstated (failure 3) |
| 14 | **FAIL** | (a) fails: visit order applies with no hotel. (b) fails: an undated hotel can reorder, drop legs or add legs. (c) passes (C7c). All three must hold (failure 2) |
| C1-C6, C8, C9 | PASS | As concept 1 |
| C7 | **FAIL** | Same root cause as 14(b). The file's C7 row is right only for the first hotel. No prompt anywhere: that half passes |
| T1 | **FAIL** | As concept 1 |
| T2 | PASS | "An airport has a figure, so it's never on a leg" |
| T3 | PASS | On the way with no order; with an order and Copenhagen/Stockholm consecutive, on that leg; a 2nd place makes it a figure (inherited). Also gives legs from visit order, which jobs.md doesn't foresee |

## Concept 3: no trip container

| Check | Result | Basis / note |
|---|---|---|
| P | PASS | |
| 1 | PASS | C2: "the current view becomes that figure" |
| 2 | PASS | A cluster's view: every place, by figure, plus On the way; the map constraint |
| 3 | PASS | Figure is a view level |
| 4 | PASS | "Each level is one step up or down" |
| 5 | PASS | Figures and the memory as concept 1 |
| 6 | **FAIL** | Narrowing by real city isn't in concept 3's "How you move", and isn't in the inherited list |
| 7 | PASS | "A real city's figure(s): as concept 1" (global memory, so the fix holds across all clusters) |
| 8 | **FAIL** | Plans can span clusters, so multi-city stops pass. "A city view shows the plans that touch that city" isn't stated |
| 9 | PASS | On the way as concept 1 |
| 10 | PASS | "Nothing is ever hidden"; clusters are named from their countries and nameable |
| 11 | PASS | |
| 12 | PASS | Everything / cluster / figure / On the way / nothing yet |
| 13 | **FAIL** | Never says a place shows its figure and its real city |
| 14 | n/a | |
| C1-C6 | PASS | C6: a new cluster, visible, nothing asked |
| C7 | n/a | |
| C8 | PASS | "These go together" / "these are separate" |
| C9 | PASS (flag) | A cluster's name is keyed by its member figures, but C5 adds a member. Whether a custom name (or a "go together" rule) survives the cluster growing is unstated. So is whether "the name widens" overrides a custom name |
| T1 | **FAIL** | As concept 1 |
| T2, T3 | PASS | "As concept 1, inside the Scandinavian cluster" |

## Concept 4: reference (today)

Fails everything except job 12, as intended. Checked against the code:
- The City select comes first in the add form (`index.html` ~2801).
- `maybeDetectCity()` (4853) asks about a new city.
- `CITIES` (3067) is seeded with LA, Reykjavík, Copenhagen, Malmö and
  Stockholm.

| Check | Result | Note |
|---|---|---|
| P, 1, 2, 4, 5, 7, 9, 10, 13 | FAIL | As the file states |
| 3 | FAIL (flag) | No trip, so there's no "city of a trip". Today's city filter is close; the file gives no reason |
| 6 | FAIL | The real city is stored but "nothing uses it" |
| 8 | FAIL (flag) | The file says plans cross cities (that half would pass); a city view showing plans isn't stated |
| 11 | FAIL (flag) | Fails only because the file states nothing. **Likely wrong in substance:** CLAUDE.md says the list and map share filters and zoom gates only the map. So today probably passes job 11 |
| 12 | PASS | |
| 14, C7 | n/a | |
| C1-C6, C8, C9, T1-T3 | FAIL | |

## UI detail still present

The concept files are almost clean. What's left:
- **Concept 2:**
  - "read from a pasted booking **at add**" and "an optional date on
    hotels … visible" describe input mechanisms (D1/D2), not the model;
  - "a plan can default to a day from a base" is a feature/UI idea with
    no model behind it (nothing stores a plan's day).
- **Concept 3:** "visible next to the others" (C6), a small one.
- **`jobs.md` still carries the strings that Turn 12 stripped from the
  concepts:**
  - P and C1: map, list, +, "+ to log one";
  - job 7: "beside the Lund places";
  - job 12: "Your places", "All places";
  - job 13: "Reykjavík · in Grindavík";
  - C6: "New trip · United States" / "Keep in Iceland & Denmark";
  - T2: "◆ city";
  - D1/D2: pencil, NAME line, blank tag.

  I judged outcomes only, but the checks should be restated as model
  outcomes too.

## Ambiguous checks and stale text in jobs.md

- **Job 1:** "a city name in the header". After the first place, should
  the view be the figure or the trip? Concepts 1 and 2 are silent, and
  jobs.md doesn't say.
- **Job 12:**
  - It doesn't cover a view narrowed to one real city (header Reykjavík,
    list only Grindavík: does the name "match its list"?).
  - It doesn't cover concept 2's legs.
- **Jobs 9, 14 and T3 assume legs come only from dates.** Since Turn 12,
  concept 2 also orders by first visits. Jobs.md never mentions rule 2,
  so 14(a) "identical to concept 1" is now false by design.
- **"Reach of a figure" and "falls between two bases":** not defined in
  jobs.md's Terms (see the concept 1 and 2 notes).
- **C6, concept 3:** "Nothing to keep or merge" sits oddly beside the
  concept's "these go together corrects it". That's a merge after the
  fact. Probably fine (nothing is asked), but it reads as a
  contradiction.
- **The reference:** jobs.md "expects" it to fail 5, 7, 9 and P. The file
  fails 1-11 and 13. Not a conflict, but jobs.md understates it.
- **"How dates could arrive":** it still says "The director rules:" and
  then gives "My read". Turn 12 has ruled since (D3 in, D1 as "we
  think", D2 held back). The closing NEXT line is stale too.

## overview-3x.png

**Phone size: reads.**
- It's 1170 x 2927 (390 x 976 pt), about 1.5 screens.
- Body text is about 11 pt on a phone: small but legible when shrunk to
  390 wide.
- The grey secondary lines are the weakest, but still legible.
- No UI strings.

**Where it disagrees with the files:**
- **Card 1** says a real city "farther away" goes "on the way", and that
  two places there make a new city. It leaves out rule 4 (outside the
  spread → a new city from one place) and rule 5 (far away → a new
  trip). Read literally, Copenhagen added to an Iceland trip would wait
  in On the way, which contradicts C5 and C6.
- **Card 1** never mentions trips: how they form, far away → a new trip,
  merge, rename.
- **Card 2**'s "Identical to 1, until a hotel is logged" contradicts
  concept 2's rule 2 (visit order with no hotel; failure 2). It agrees
  with jobs.md 14(a), so either the file or jobs.md and the overview
  have to change.
- **Everything else matches:**
  - "we think" is on every unmeasured number;
  - the 59 / 58 / 1 counts match;
  - "old trips never go away" matches concept 3's weaknesses;
  - "We think model 1 is strongest" is labelled as an opinion.
