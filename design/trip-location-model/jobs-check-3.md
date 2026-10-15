# Jobs check 3 (fresh checker, 2026-10-15)

Against `jobs.md` and `owner.md` as of commit f0470c4. Files checked:
`concepts/1-rule-that-remembers.md`, `2-rule-plus-stays.md`,
`3-no-trip-container.md`, `4-reference-today.md`, `overview-3x.png`.

Strict reading: a check passes only if the concept file states the
outcome (directly, or by an explicit "as concept 1" inheritance). Where
the stated outcome holds only on the jobs' own example, or only in one
order of logging, it's marked PASS with a flag below.

## Scoreboard

28 checks each: P, jobs 1-14, C1-C9, T1 (border on), T1 (border off), T2, T3.

| Concept | PASS | FAIL | n/a | Flagged passes |
|---|---|---|---|---|
| 1 Rule that remembers | 26 | 0 | 2 (14, C7) | 7, 9, 12, 13, C9, T2, T3 |
| 2 Rule + stays | 28 | 0 | 0 | as 1, plus 2, 14(b), 14(c), C7 |
| 3 No trip container | 26 | 0 | 2 (14, C7) | 2, 9, 10, 12, 13, T3 |
| 4 Reference (today) | 4 | 22 | 2 (14, C7) | 5 and 8 pass against jobs.md's claim; 12 is strained |

On paper, all three candidates pass every job that applies to them. The
real problems are in cases the jobs don't cover (see "Breaks"), and in
four places where the rules are undefined.

## Per-check results

| Check | 1 | 2 | 3 | 4 (today) |
|---|---|---|---|---|
| P | PASS (§P; nothing asked at add) | PASS | PASS | FAIL (City field; new-city question) |
| 1 first open → log | PASS (C2: view becomes figure) | PASS (inherits C2) | PASS (C2) | FAIL (no trip/figure made; cities pre-seeded) |
| 2 whole trip | PASS (quick-read table + map constraint) | PASS (follows order; legs only if on) | PASS* (cluster) | FAIL (no trip; "All cities" is all places, not a trip) |
| 3 one city | PASS (figure view; contents not spelled out beyond the name) | PASS | PASS | FAIL as framed (no figures). Note: today's city filter does show exactly one city with the map matching; it fails only on "of a trip" |
| 4 one step | PASS | PASS | PASS ("one level up or down") | FAIL |
| 5 Blue Lagoon/Keflavík | PASS (C3, T2) | PASS | PASS | **PASS on the literal check**, contradicting jobs.md: both points fall inside Reykjavík's seed viewbox (Keflavík directly; Blue Lagoon, lat 63.88, via `matchCity()`'s 0.05° pad), so the add form pre-fills Reykjavík and nothing is chosen. It works by a hand-drawn box, not a model, and the real city is lost (job 13) |
| 6 real-city filter | PASS (stated) | PASS | PASS | FAIL (`address_details` unused) |
| 7 fix grouping once | PASS* | PASS* | PASS (global memory: truly "now and later") | FAIL |
| 8 plans cross cities | PASS | PASS | PASS (plan in two clusters belongs to both) | **PASS on literal wording**: plans cross cities, and the plan ledger is global, so every city view "includes" them. jobs.md should say "only the plans with a stop in it" |
| 9 in-between home | PASS* | PASS* (On the way; legs off by default) | PASS* | FAIL |
| 10 other trips | PASS | PASS | PASS (everything view; clusters nameable) | FAIL |
| 11 map = list | PASS (constraint stated) | PASS | PASS | PASS (verified: `visibleLocations()` feeds both; `mapVisibleLocations()` only clusters) |
| 12 clear view | PASS* | PASS* (leg is not a view: stated) | PASS* | Strained: today has an "All cities" view and a plan view, neither of which is a trip/figure/On the way/empty. The reference's reason ("the view names its city") is false for All cities. PASS in spirit only |
| 13 both truths | PASS* | PASS* | PASS* | FAIL |
| 14 stays | n/a | PASS: (a) §ordering bullet 1; (b) C7b; (c) C7c/C7d; no date asked | n/a | n/a |
| C1 | PASS | PASS | PASS | FAIL |
| C2 | PASS ("Iceland", "Reykjavík", view = figure) | PASS | PASS | FAIL |
| C3 | PASS | PASS | PASS | FAIL |
| C4 | PASS | PASS | PASS | FAIL |
| C5 | PASS (Tivoli row; Malmö by rule 3; name widens because it's generated from countries) | PASS | PASS | FAIL |
| C6 | PASS (new trip, undo right after) | PASS | PASS (new cluster, "these go together" later) | FAIL |
| C7 | n/a | PASS | n/a | n/a |
| C8 | PASS (merge) | PASS | PASS | FAIL |
| C9 | PASS* | PASS* | PASS (survival rules stated) | FAIL |
| T1 border on | PASS (one change) | PASS (as 1) | PASS (as 1) | FAIL |
| T1 border off | PASS (two changes, stated in parentheses) | PASS (as 1) | PASS (as 1, implicitly) | FAIL |
| T2 | PASS* | PASS* (airport has a figure, so never on a leg) | PASS* | FAIL (Keflavík and Kastrup pre-fill correctly, but Kastrup can never be in Malmö too) |
| T3 | PASS* | PASS* | PASS* | FAIL |

### What the flags mean

- **7 (concepts 1, 2):** the memory is per trip. "Lund goes with
  Copenhagen" moves every Lund place in *this* trip; a Lund place in a
  later trip is filed fresh. "Now and later" holds only within one trip.
  Not stated either way.
- **9, 13 (all):** places with no town go "by location alone (nearest
  figure)" (Prerequisite). That's an arbitrary figure (job 9's FAIL
  condition) and has no real city (job 13). The files treat this as a
  legacy backfill gap (59/202). It isn't only legacy: a **new** place with
  no town in OSM (Saltholm is an uninhabited island; national parks; sea
  spots) hits the same fallback, and the fallback also skips rules 3-6:
  no border, no On the way, no new trip.
- **12 (all):** the view list leaves out a **plan view**. Plans exist
  today (`inPlanView()`), and job 8 puts plans inside figure views, but
  no file says whether opening a plan is a view. Also unstated: whether
  real-city narrowing works in the trip view or On the way. If it does,
  "a trip narrowed to Jönköping" isn't on job 12's list (only a figure may
  be narrowed). Jönköping is in no figure, so narrowing to it can't live
  inside a figure.
- **C9 (concepts 1, 2):** survival of a custom name on growth is implied
  only by "the trip's name, until renamed" (inferred column). What
  happens when two renamed trips are merged isn't stated (concept 3 does
  state its rule).
- **T2 (concepts 1-3):** concept 1's Kastrup row says "Malmö exists by
  rule 3". **With the border off,** Malmö is From Copenhagen, so putting
  Kastrup in Malmö too takes **two** changes, and T2 says "after one
  change". jobs.md runs only T1 in both branches; T2 silently assumes the
  border is on.
- **T3 (all):** the outcome depends on the order things were logged. The
  spread is "the box around the trip's figures". If Jönköping is logged
  while the trip is only Copenhagen and Malmö, it's outside that small box,
  so rule 5 makes it a figure from one place. Nothing re-files it once
  Stockholm arrives (the memory is stored). Only "Stockholm first" gives
  On the way.
- **2 (concept 2):** "a figure that isn't a base sits right after the
  ordered base whose anchor is nearest" is ordering non-bases. That
  contradicts "only bases are ordered" (jobs.md Terms, and concept 2's
  own heading). Where a non-base figure sits when there's no order (0 or
  1 positioned base) isn't stated.
- **14(b) (concept 2):** "nothing else moves" holds, except that a stay in
  a real city that's in two figures (a Kastrup airport hotel, Tårnby in
  Copenhagen and Malmö after T2) makes **both** figures bases at once.
- **14(c) (concept 2):** places already marked visited before the new
  "first visited at" field have a visit but no time. Do they give a
  position, no position, or the migration date? Unstated. Ties (two bases
  from one hotel date, as above) are unstated too.
- **2, 9, 10 (concept 3):** "far away" is defined as "another continent"
  (a category), but clusters "chain together within far away of each
  other" (a distance). Taken literally, every European place ever logged
  is one cluster: a 2024 Paris weekend, Scandinavia 2026 and a later
  Rome trip are one "trip" until split. Job 10's "clusters distinct" then
  holds only across continents.

## Breaks (realistic cases the jobs don't cover)

1. **Which trip does a new place go into? (concepts 1, 2; the one that
   matters most).** Rules 4-6 say "the trip's spread" and "this trip",
   and the undo says "keep it in the current trip", so the rule seems to
   run against the current view's trip. That's never stated, and there
   is no rule for choosing among several existing trips.
   - Viewing the US trip and adding Tivoli: far from the US, so a new
     trip "Denmark" starts. The Scandinavia trip that already has
     Copenhagen in its memory is ignored, and undo would put Tivoli in
     the US trip.
   - Returning to a region (Copenhagen again in 2028): a new trip can't
     be started (nothing is set up ahead, and trips can only be merged,
     never split), so it goes into Scandinavia 2026.
   - Concept 3 has the same problem worse: Copenhagen 2026 and 2028 share
     a figure, and its rules are keyed by figures, so "these are
     separate" can't tell them apart. ("No past trips" is admitted.)
2. **A place in a city the owner hasn't planned, same continent (Berlin
   saved as a someday idea while planning Scandinavia).** Concepts 1 and
   2: rule 5 makes Berlin a figure in Scandinavia 2026, and the trip
   widens and is renamed. The far-away undo only exists for far-away
   places, and trips can't be split, so Berlin stays in the trip and
   its box now covers north Germany. Concept 3 handles it ("these are
   separate", keyed by figures).
3. **The spread box with Iceland in it (the owner's own "Scandinavia
   2026 ... reykjavik" example).** The box from Reykjavík (-21.9°, 64.1°)
   to Copenhagen and Stockholm covers the Faroes, Bergen, Oslo,
   Gothenburg and north-east Scotland: one Edinburgh or Aberdeen place
   is "On the way" in Scandinavia. Within a one-figure trip, the
   opposite happens: the box is a point, so every out-of-reach Icelandic
   place (Vík, Jökulsárlón, Akureyri) is a figure from one place, and the
   threshold of 2 never applies.
4. **A day in Gothenburg.** In Scandinavia 2026, one Liseberg place →
   On the way (about 280 km from Copenhagen, 225 km from Malmö). The
   owner likely thinks "Gothenburg". It becomes a figure only with a
   second place, or with one "make it its own figure" change (concept
   1's correction list allows that for any real city). With a hotel
   there (concept 2), it's still On the way, **not a base**, because a
   base must be a figure. A one-night stopover hotel (Jönköping,
   Gothenburg) never takes a place in the order. The same holds with
   legs on, where it lands on the Copenhagen-Stockholm leg even if the
   route was Oslo → Gothenburg → Copenhagen.
5. **Districts and streets (`neighborhood_shapes`).** No concept says how
   a shape gets a figure, a trip or a cluster. Today a shape's `city`
   comes from `resolveShapeCity()` voting against `CITIES`, the registry
   these models replace. Shapes are list items and plan stops, so jobs
   2, 3, 8 and 11 are silent on them. Approximate pins ("(approx.)",
   from `findApproximatePoint()`) may have no `address_details`, which
   is the no-town fallback again.
6. **Lund before Malmö (concept 1).** Lund's first place is within reach
   of Copenhagen across the border, so rule 3 makes "Lund" a figure.
   Malmö then joins From Lund, and the figure is named "Lund" until Malmö
   has more places. The anchor rule makes it right eventually, but the
   files only show the Malmö-first order.

## Contradictions and ambiguities

- **jobs.md vs code (reference):** "today fails ... jobs 1-10". Job 5
  passes literally (see table), job 8 passes on the current wording, and
  job 3 fails only on "of a trip". Job 12's PASS rests on a reason that's
  false for "All cities".
- **jobs.md Terms vs concept 2:** "only bases are ordered" vs non-base
  figures placed "right after" the nearest base.
- **Concept 3:** "far away" is a continent, but clustering is "by
  distance". The overview repeats both.
- **Concept 1 Prerequisite vs rules 3-6 and job 9:** "nearest figure"
  for no-town places overrides the border, On the way and new-trip
  rules.
- **Undefined in jobs.md and concepts 1 and 2:** "same part of the
  world" (Iceland → Greenland is another continent; the Canaries are
  Spain politically and Africa geographically). Also how "nearest
  figure" is measured in rule 2 (presumably to the anchor).
- **Saltholm:** jobs.md says it's in Tårnby "we believe, not verified".
  If OSM gives it no town, it's not a Tårnby place, and T1's "one change
  moves both" fails for it in every concept.

## UI detail still present

Mostly what the jobs themselves ask for ("one step", "search is
worldwide", "current view"), which is fine. Beyond that:
- **Concept 2:** "read from a booking you paste" (Q4, and jobs.md
  "Dates") is an input mechanism. "The trip view follows that order",
  "a group inside the trip view, in order between its two bases" and
  "sits right after the ordered base" are list layout.
- **Concept 3:** "one level up" is a navigation hierarchy (borderline;
  job 4 needs some step).
- **Concept 1:** the Q8 question is drafted in owner-facing copy (it's
  a question to the owner, so acceptable).
- **Concept 4:** it cites form field order and line numbers. That's fine
  for a reference.

## overview-3x.png

- **Phone readability:** it reads. It's 1170 px wide (iPhone 3x), and
  body text is about 13-14 pt at 1x. It's about 1.3 screens tall, a
  plain single-column scroll. The grey secondary text is lighter but
  legible.
- **Agrees with the files, except:**
  - The intro "Three models and today. In each, you log places first ...
    Nothing is ever set up ahead" reads as covering Today, which is false
    (Today fails P; cities are seeded).
  - The footer "We think model 1 is strongest" is a recommendation that
    appears in no concept file. It's labelled as opinion, but the owner
    asked for no hard recommendation unless it's obvious.
  - Model 2's "then its city is a base" vs the file's "a figure that
    contains a stay". The card hides that a hotel in On the way makes no
    base.
  - Model 3's card never says it keeps the "city in your head" rule.
    Read alone, model 3 looks like it has no figures.
  - Model 1's example omits Bláskógabyggð. That's a harmless
    simplification.
  - The 59/202 split, the 60-80 km reach, the threshold of 2, the
    border marked "pending", and legs off by default ("If you want it")
    all match.
