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
