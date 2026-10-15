# design/archive/ — history only, not guidance

Finished or superseded design work, moved here on 2026-10-15 so the live
`design/` folders show only what is current. Nothing in here is a spec, a gate
or a rule. Read it only when you need to know how something came to be; the
current truth is `docs/shipped.md`, `docs/owner-taste.md` and the live
`design/<feature>/` folders. Scripts in here were not updated for the move and
may no longer run.

Each line: what it was. All history only — not guidance.

- `ac-over-x/` — before/after stills and a one-off check for the "suggestions over the x" tweak (landed 2026-10-15).
- `box-strokes/` — patch and two stills for "Box edges: menus take the divider line" (landed 2026-10-14).
- `city-filter-wrap/` — city filter chip wrapping concepts; Option B (gapped chips) shipped.
- `day-agendas/` — v1 scoping proposal for day agendas, superseded by Plans.
- `pencil-star/` — Pencil Star (swipe-right star) design rounds and its uncommitted-harness tests; shipped 2026-09-28, gate now in `design/gesture-harness/`.
- `shape-parity/` — stills for the shape-parity fix (districts/streets visit and star like pins; landed 2026-10-02).
- `star/` — the star-mode mock and the hand-run `locations.starred` migration (the record now lives in `supabase/migrations/20260928000000_add_locations_starred.sql`).
- `star-alignment/` — early popup-star exploration that misframed the problem; closed by the Hanging Tag.
- `suggest-clip/` — stills for "Add-form place suggestions no longer cut off" (landed 2026-10-15).
- `swipe-visit/` — swipe-left visit rounds p1–p8 and the original `vtest.js`; shipped, gate now `design/gesture-harness/visit.js`.
- `trip-place-model/` — first trip/place model proposal, superseded 2026-09-29 by `design/trip-location-model/`.
- `visited-marker/` — Round 4 visited-pin dots on the map; rejected by the owner ("do not revive").
- `popup-hierarchy/round2/`, `round4/`, `round5/` — superseded popup-redesign rounds; the Hanging Tag shipped (rounds 1, 3 and 6 stay live because current render scripts read them).
- `plans-deepdive/v2/` — Plans v2 (Edit mode) design, replaced by `design/plans-deepdive/v3/`.
- `list-ordering/concept/`, `concept-2/`, `concept-3/` — list-ordering concepts; the result shipped (`docs/shipped.md` "List order: ⇅ sort menu"), `design/list-ordering/build/` stays live.
