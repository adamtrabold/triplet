# Jobs check 5 (fresh checker, light pass, 2026-10-15)

Re-runs only the ids that failed or were flagged in `jobs-check-4.md`,
against the current `jobs.md` and `concepts/1-4` + `overview-3x.png`.
No new edge-case hunting; anything listed under a concept's "Known
limits" is not a fail.

## Verdicts

| Concept | Id | Verdict | Note |
|---|---|---|---|
| 1 | Rule 1 | PASS | Distance only; "only your fixes override". The old "town memory beats distance" rule is gone (memory holds only the owner's fixes). |
| 1 | Rule 2 | PASS | Normal case predictable. After a split, "its city's trip" is ambiguous when the city is in two trips; the answer ("added to most recently") lives in plumbing, which is now honestly labelled "not needed for the common case". Minor. |
| 1 | Rule 3 | PASS | All three town fixes are in the rule now, including "also belongs with"; "goes with" vs "also belongs with" makes the move-vs-add difference clear. Splits keep visited places. |
| 1 | T2 | PASS | Keflavík → Reykjavík by rule 1; Kastrup: two fixes, both named in rule 3. |
| 1 | T4 | PASS | Now in the test-case table: both join, one split each, 2026 visits stay. |
| 1 | J10 | PASS | Never mixed, one step away, separable by fixes, never per place. Minor mismatch: `jobs.md` J10 says "one split per city it covers"; concept 1's known limit says a multi-city repeat needs splits **plus merges** (each split makes its own trip). The gate (fixes, never per place) holds; the `jobs.md` parenthetical undercounts. |
| 2 | T2 | PASS | "Never a base" follows from rule 4 + "Hotel means the Hotel category" (an airport isn't one). Not spelled out the way "districts and streets are never hotels" is; a one-liner would make it explicit. The old "never on a stretch" claim is gone. |
| 3 | J2 | PASS | "How you move: as concept 1 (..., the trip view grouped by city, ..., the map shows exactly the view's set)". |
| 3 | J3 | PASS | Same line. |
| 3 | J4 | PASS | "trip ↔ city in one step". |
| 3 | J8 | PASS | "a city's view holds only and all the plans with a stop in it". |
| 3 | J11 | PASS | Map = the view's set, for every view (including "everything"). |
| 3 | C8 | PASS | Now "town fixes and together / separate; never per place". The old contradiction (claimed split/merge) is gone. |
| 3 | T4 | PASS, with a flag | States exactly what `jobs.md` asks. Flag below (F1). |
| Today | J3 | PASS | Reason given: the city filter, map the same set, "on the letter". Agrees with `jobs.md` and `index.html` (`visibleLocations()`, line 4396). |
| Today | T4 | FAIL (now run) | 2028 merges into the Copenhagen city; Berlin triggers the new-city question (`maybeDetectCity()`, line 4853). Correct. |
| Today | C4 row | Gone | Table runs C1, C2, C3, C5-C9. "From" and "real city" are gone too. |

## (a) Concept 1's rules alone predict where a place lands

**Mostly yes; one claim in the worked case doesn't follow.**

- Geysir beyond reach → its own city; Gullfoss (~10 km) joins it;
  "Bláskógabyggð goes with Reykjavík" moves all three. All of this
  follows from rules 1 and 3.
- Either order gives the same result: nothing but the owner's fixes is
  remembered, so every place is re-judged against the cities that exist.
  That's sound, and better than check 4's order-dependent result.
- **F0 (claim that doesn't hold from the rules): Þingvellir.** Rule 1
  says *nearest* city within reach. Once Geysir's city exists,
  Þingvellir is within reach of both it and Reykjavík, and the case never
  gives its distance to the new city. My approximate straight-line
  figures (from known coordinates, not measured): Hallgrímskirkja →
  Þingvellir ≈ 41 km, Geysir → Þingvellir ≈ 41 km, a tie. The new city's
  distance is measured to its anchor, "the centre of its town"
  (Bláskógabyggð, a municipality). If that's the municipal seat
  (Reykholt, ≈ 24 km from Þingvellir), Þingvellir goes to "Bláskógabyggð",
  not Reykjavík. The case's 45 / 100 / 115 km are road distances, and the
  files never say whether reach is road or straight-line (straight-line,
  Geysir is ≈ 81 km out, at the edge of 60-80).
  - So "Þingvellir goes with Reykjavík" depends on plumbing a reader
    can't see (the metric and the municipality's "centre"). To fix it,
    either give Þingvellir's distance to the new city and say what
    "centre" means for a municipality-sized town, or list
    "nearest-city ties" under Known limits.

## (b) The overview (`concepts/overview-3x.png`)

**Reads at phone size.** 1170 × 3133 (390 CSS px wide). Body text is
about 12-13 CSS px; headings are clear. "Price" / "Cost" are now
full-contrast body text.

**It agrees with the files.** All six of check 4's mismatches are fixed:
- The heading is "Trips worked out, not kept".
- Concept 3 is "Model 1's rule 1 and its town fixes", with
  "go together / are separate".
- Rule 3 has "every place there, now and later" and "places you've
  already been stay".
- The 2028-leftover chain is stated as a cost.
- The footer says "real town".
- 59 / 202 (58 + 1).

Two trivial omissions, not contradictions:
- rule 3 leaves out "in every trip";
- concept 2 leaves out "a one-night stop is a base too".

## Flags (real, not edge-case hunting)

- **F0** (above): the Golden Circle's Þingvellir outcome isn't derivable
  from the rules, and plausibly comes out the other way.
- **F1, concept 3 T4: "these trips are separate" can't act as described.**
  In both T4 cases there's only **one** worked-out trip, because the
  leftover or Berlin chains everything together. On top of that, the fix
  is stored "keyed by the trip's member cities", and Copenhagen is a
  member of both 2026 and 2028. Nothing says how the fix decides which
  Copenhagen places go to which trip; concept 1's split has "visited
  places stay", and concept 3 has no equivalent. The outcome T4 claims
  isn't backed by a stated mechanism. Berlin is fine (a distinct city).
- **Minor:** the `jobs.md` J10 parenthetical ("one split per city") vs
  concept 1's "splits plus merges" (above).

## Summary

All re-run ids pass except today's T4, which is meant to fail. The C4
row is gone. The overview is readable and consistent. Two things still
don't hold:
- the Golden Circle's Þingvellir line (F0);
- concept 3's "these trips are separate" for Copenhagen 2028 (F1).
