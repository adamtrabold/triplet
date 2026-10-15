# Systems designer notes: trip / city / place model

## Turn 1 (2026-10-15)
- Jobs 1-12 written from owner.md first (jobs 9-12 inferred).
- The key question: where does "the city I think of it with" come from? A choice / a rule / a tag / the moment of adding / an existing object.
- Ideas I1-I9: chosen home (minimal; = 12c), also-known-as (ZIP: additive aliases), catchments (edit the area), bases (go-from; trip = ordered bases; legs for in-between), route (trip as a line; places snap to a stop or leg), around-not-in (Voronoi of your cities; zero filing), provenance (home = the city you were viewing when you added it), plans-as-groups (collections; many-to-many), two lenses (mental lens + real-city chips nested; likely constant).
- RNG: watersheds, ZIP vs mailing names, genealogy trees; Oblique "Is there something missing?" (→ bases), "Change nothing…" (→ I1).
- Early lean: I7 + I2 + I9 (lowest friction); I4/I5 truest to trips but cost setup; I6 automatic with a failure case.
- Open for the director: trip as a container now; many-to-many; keep 3-4 concepts differing in the source of home.
- History: the add-button work's workflows.md / Round 12c / the app map artifact are one idea (I1), not the answer.
- Scope widened by the owner ("rev the app workflow as a whole … make sure it all sings"): today's app is the baseline to question. Added app shapes S1 lens (breadcrumb trip › city runs map/list/+), S2 route spine (the list is the trip; sections per stop, legs; the map follows scroll), S3 trip home → city (two levels), S4 atlas (the map navigates; "X & around"; questions the CLAUDE.md viewport rule, flagged). Each must also revise the tag, add, plans, past trips.
- Owner: sketch level only; the model, not UI. Jam turn 1's NEXT reworded (visual: sketch-level reactions to I1-I9 / S1-S4, no stills).

## Turn 4 (2026-10-15): A/B/C walked; D added
- Stores: A see-also[] + derived In/From; B home (1); C hotel/transport dates + derived base/leg; D figures = sets of real cities.
- Cases: Saltholm, Kastrup Søbad, KEF, Kastrup (both cities), Lund, Þingvellir, Jönköping, close cities. A needs a fixed "On the way" reach; B's misfile is unfixable while edit is future; C = A until hotels exist (0 hotels today); C makes non-base cities sub-groups.
- Key finding: edit-after-add being future favours models whose figure is derived (A, C, D), where fixes are per rule, not per place.
- D (by region: a figure = a named set of real cities; a new real city joins the nearest figure; a per-region fix; real-city chips = the figure's members). Needs the address backfill (0/202).
- Owner question to add: fix a place vs fix the rule once.
- Creation (owner: no setup before logging): trips and figures auto-created from places (named from the country / real city; renameable). Second trip: one question "Start a new trip?" when far (or ▾ New trip). None of A-D needs setup; B pays a pre-filled choice per add (wrong outside the lens; unfixable until edit); C's value needs stays logged (0 hotels today); A and D zero/zero. Any variant requiring create/name/dates first fails the owner's rule.
- Places-first lens (owner): A pass, D pass, C conditional (stays optional, never asked), B fails the spirit (filing on every add). The 'Start a new trip?' question → default quietly to a new trip, merge if wrong (owner question).

## jobs.md (2026-10-15), after director turn 6
- Written: P (places-first, governing), jobs 1-14 with checks, creation moments C1-C9, tests T1-T3, the B reference, what's stored.
- Verified the backfill claim: the real city = `locations.address_details` (the same column as short_address; the short-address backfill tool). The live DB today: 144/202 have address_details (143 with a city/town/village/municipality); **58 missing**. The "0/202" in CLAUDE.md / iphone-checks / the jam is stale. The prerequisite = the 58 rows.

## Turn 11 (2026-10-15): jobs.md fixed after jobs-check.md
- Concept 2's dates-gated order/legs carried into jobs 9 and 14 (3 clauses) and C7/T3; a Terms block (reach/spread/outside/far away) matches concept 1; C3 = within reach; C5 = outside the spread; 59 (58 + 1); concept 3's storage = a global memory + together/separate rules keyed by member figures + a name; T2 "edge" removed; job 12's allowed names widened; C6 concept-3 variant.
- Dates proposal: D1 paste the booking (parsed, pencilled, no ask), D2 an optional Stay line (borderline P), D3 learned on the trip (first visited per figure; needs a hidden visited_at). Lean D1 + D3; else concept 2 = concept 1 + a base mark.

## Turn 13 (2026-10-15): systems owns the concept files (visual is off the loop)
- All 4 concept files rewritten as model statements (exists / stored vs inferred / rule / correctable when / movement as model / P / C / T / jobs / prerequisite / open). UI stripped per Turn 12's items 1-9.
- Concept 2: the ordering rule (dated stays → first-visited → none) + the stored first_visited_at; C7 → C7/b/c/d.
- Item 10: concept 1's C4 flag gone; today P = FAIL; concept 3's drawn cluster view stripped to a model statement.
- Overview re-rendered from the scratchpad ov/ov.html (playwright, 1170 wide; 2927 tall), model-only.
- No he/his/him in the concept files or jobs.md.
- Changed ids: P,1,2,3,4,6,8,9,10,11,12,13,14,C1,C2,C4,C6,C7,C8,T2,T3.

## Turn 14 (2026-10-15): after jobs-check-2
- Malmö: proposed the border signal (same country + reach → join; across a border → own figure), else the owner fixes it once (T1 = 2 changes). Pending the director.
- Anchor = the centre of the member with the most places (the name follows it); reach from the anchor; Bláskógabyggð via the memory.
- Concept 2: only bases are ordered, per base (date → first visit → none); a new base never moves others; non-base figures after the nearest base; legs by the nearest line; no leg → On the way; legs aren't views. A simpler no-legs option offered.
- Concept 3: jobs 6/8/13 lines; name survival.
- Today job 11 PASS (visibleLocations shared; zoom only clusters).
- jobs.md fully rewritten as model outcomes (no UI strings); the overview cards 1/2 updated (3277 tall).
- Turn 16: Turn 15 applied (overview 3 edits, re-rendered 3277; concept 2 legs off by default; Q4 reworded + Q8 added; jobs T1 both branches). Changed: 9, 14, C7, T1, T3 (+ concept 2's 2, 12).
- Turn 17: check 3 applied. Trip assignment (active trip with the real city → nearest active same-continent trip → new; past = 60 days; continent table; view never decides; split correction; global memory). Nearby band 300 km replaces the spread. Concept 2: stay promotes On-the-way town; non-base figures unordered; ties; no-time visits. Concept 3: continent + 6-month time-gap clusters. No-town → next OSM level, else by location. Districts/streets = places. jobs 5/8/12 tightened; today passes 11 only; T2 both branches. Overview re-rendered 1170x3520. Q5 extended (widen vs own trip).
- Turn 19: Turn 18 applied. Concept 1 = three rules + plumbing; 2 = +hotel base +order; 3 = rules 1,3 + time-gap rule; files open with numbered rules. jobs: C4 retired, T1/T2 border off (two fixes), T3 own city, new T4 (split). Split takes unvisited places (needs director check). Overview 1170x2911. No 'he' found in Turn 18.
- Turn 21: final pass. Rule 2 = 'joins its city's trip'; memory = owner fixes only (Golden Circle by distance); rule 3 lists goes with/is its own/also belongs with/split (visited stay)/merge; Known limits in 1/2/3; concept 3 heading 'Trips worked out, not kept', How you move as concept 1, honest T4, first-visited prereq; today J3 PASS, T4 FAIL, C4 gone; overview price lines darker/larger, 1170x3133.
