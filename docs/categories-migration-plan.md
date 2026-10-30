# Categories migration: plan (DATA lane, not yet applied)

Source of truth: `design/icon-system/categories.md` (branch `claude/elegant-galileo-1c5ntm`, "locked 2026-10-16").
Owner: "i didnt realize that the system hadnt been updated for our new categories. have an agent do that -- they'll need to edit the existing entries. let's not put them in the app just yet" (= categories go in, NEW ICONS do not).

Status: plan only. Nothing written to the DB, nothing pushed. Waiting on the design calls at the end and a go.

## 1. Live DB check (2026-10-30, read-only `execute_sql`)

- Pins: 202 (area 18, attraction 62, bar 12, cafe 16, district 1, nature 10, restaurant 30, shopping 53). Shapes: 11 (district 6, street 5). Same as categories.md's 2026-10-16 snapshot.
- Every place named in categories.md exists under the category it says it comes from. All moves add up to its tally (183 pins after).
- No `plan_stops` reference any pin being removed or turned into a shape (and none reference a shape at all).
- Constraints: `neighborhood_shapes_type_check` = `type IN ('district','street')`. `locations.category` has NO check constraint.
- Shapes carry a stored `color` (#A8C5DD districts, #E8B84E streets) that the plan-stop marker reads before `categoryInk()`.

Mismatches / gaps (not guessed; need an answer):
- **M1. The 9 "becomes a shape" pins have no shape yet** (Christiania, Nyboder, Gamla Stan, Fashion District, Hornstull Strand, Klapparstígur, Ravnsborggade, Sankt Eriksgatan, Værnedamsvej). Shapes need live OSM = the owner's browser. Gamla Stan is starred+visited with notes, Christiania and Ravnsborggade are visited with notes. Proposal: until the owner fetches each shape, the pin stays, re-categorised `neighbourhood` / `street` (the existing "approx. pin" route already does exactly this); when the shape lands, move notes/star/visited onto it and delete the pin.
- **M2. Bondegatan has two pins merging into one shape** (`Bondegatan Stockholm` area, `Bondegatan Erstagatan Stockholm` attraction), both with notes. Proposal: shape note = the two notes joined by a blank line, area pin's first. Star/visited = OR of the pins and shape.
- **M3. Duplicate names differ slightly**: "Old Harbour Reykjavik" pin -> Grandi shape (id 1); "Bondegatan Stockholm"; names otherwise match. Old Harbour is visited; Grandi is not -> Grandi becomes visited.
- **M4. "Streets are clipped to a stretch over ~1.5km"** (Laugavegur 161 pts, Bondegatan 158, Grandagarður 45): where to cut is an owner/UX call and the trim step is a lane-2 feature. Not in this change.

## 2. DB migration (one `apply_migration`, one transaction)

1. Constraint: drop `neighborhood_shapes_type_check`; `UPDATE neighborhood_shapes SET type='neighbourhood' WHERE type='district'`; re-add the check as `type IN ('neighbourhood','street')`.
2. Carry-over, then delete, for the 10 duplicate pins (by id, not name):
   - Skogskyrkogården -> shape 12; Djurgården -> 10; Västra Hamnen Bo01 -> 9; Old Harbour Reykjavik -> 1 (Grandi); Jægersborggade -> 6; Laugavegur -> 2; Grandagarður -> 3; Skólavörðustígur -> 4; Bondegatan Stockholm + Bondegatan Erstagatan -> 11.
   - Per pair: `note = concat_ws(E'\n\n', nullif(shape.note,''), pin.notes)`, `starred = shape.starred OR pin.starred`, `visited = shape.visited OR pin.visited`. Then `DELETE FROM locations` those 10 ids.
3. Re-category pins (`UPDATE locations SET category=... WHERE id IN (...)`, ids from the read above):
   - venue (11): the 8 bars + Greek Theatre, Konserthuset, Øksnehallen.
   - museum (24), landmark (23: 17 attraction + Reykjanesviti + Lilla Torg, Möllevångstorget, Nytorget + Israels Plads, Frederiksberg Runddel), park (9: Folkets Park + 5 nature + Superkilen, Björns Trädgård, Assistens), attraction (+2 pools), shopping (+Hornstulls Marknad).
   - Interim shape-pins (M1): neighbourhood: Christiania, Nyboder, Gamla Stan, Fashion District; street: Hornstull Strand, Klapparstígur, Ravnsborggade, Sankt Eriksgatan, Værnedamsvej (approx.).
4. Verify: counts per category = categories.md tally (+9 interim shape-pins until fetched); zero `area`/`other`/`district` rows.
5. Category keys (code + DB, lowercase like today): `restaurant cafe bar venue museum landmark attraction park nature shopping hotel neighbourhood street`.

Ordering: the code must land with (or before) the migration -- today's code falls back to `other`'s ink for unknown categories, and a shape of type `neighbourhood` would read as "not a shape" to `isShapeCategory()`. Plan: land code that accepts both old and new keys for one deploy, apply the migration, then drop the old keys. Or one push immediately followed by the migration (single-user app; a minute's mismatch is cosmetic). Builder's pick: the two-step, zero-gap one.

## 3. Code places that know categories (`index.html` unless noted)

- `CATEGORY_COLORS` (~l.2989) + its contrast-ladder comment: add venue/museum/landmark/park, drop area/other, rename district->neighbourhood. Order = list order, filter-chip order and `categoryRank()` sort.
- `categoryInk()` fallback `CATEGORY_COLORS.other` -> needs a new fallback once `other` is gone.
- `filters.categories` init and `createFilters()` (chips generated from `CATEGORY_COLORS`; label = raw key, so "neighbourhood" shows as the key; `cafe` shows without the accent).
- `ADD_TYPES` (l.9671), `ADD_TYPE_DEFAULT` (restaurant, unchanged), `addTypeName()` (hard-codes 'District').
- `OSM_TYPE_TABLE` / `osmToType()`: museum/gallery -> museum; theatre/arts_centre/cinema/concert_hall/nightclub? -> venue; artwork/monument/memorial/place_of_worship/historic/square -> landmark; leisure=park/garden -> park; `place=square/plaza` (was area) -> landmark; `place=locality` (was area) and the `other` row (airports, stations, ferry) need a home or `null`; the admin-boundary line returns `neighbourhood`. Tag-to-category mapping is a UX call, flagged below.
- Tag popup TYPE stamp prints `loc.category` raw.
- Glyphs: `<symbol id="g-…">` (l.2666-2676) looked up as `#g-${category}` by `glyphHtml()` / `badgeHtml()` (rows, chips, map pins, add tag, clusters). New keys have no symbol -> an empty glyph. `g-district` must be renamed/aliased `g-neighbourhood`; `g-area`/`g-other` become unused.
- `isShapeCategory()`, the shape fit checks (`type === 'district'` l.9928, l.10276), `shapeRowItem()` (category = nb.type), `syncNeighborhoodLayers` style, shape insert (`color: CATEGORY_COLORS[type]`).
- `tools/neighborhood-shapes.html`: type `<option value="district">` + seed list -> `neighbourhood` (the owner fetches the 9 new shapes with it, or with the app's add tag).
- `design/gesture-harness/shapes.js`, `popup-open.js` fixtures and `design/impeccable-gate/runtime-baseline.json` use `district` -> update; the baseline change needs approval (`--update`).
- Docs: `docs/architecture.md`, `CLAUDE.md` Architecture (`district`|`street`), `docs/shipped.md` entry, `docs/backlog.md`, `docs/iphone-checks.md`.
- Left alone: `tools/geocoder*.html` (historical one-shot seeders).

Gates for the build: DATA lane -> full `design/gesture-harness/run-all.sh` once at the end, `design/impeccable-gate/run.sh index.html`, plus a scripted check that every live category resolves to an ink and a glyph.

## 4. Design calls needed (not made)

1. Inks for **venue, museum, landmark, park** (must sit on the existing 11-ink value ladder, clear of `--star`).
2. Ink for **neighbourhood**: keep district's teal #328177? (and whether the stored shape `color` column is touched).
3. Glyphs meanwhile, with the new icons kept out: blank, or borrow an existing one (e.g. attraction's for museum/landmark/venue, nature's for park, `g-district` for neighbourhood)?
4. Fallback ink/glyph for an unknown category once `other` is gone.
5. Visible labels: "Neighbourhood" (British, per categories.md) vs "Neighborhood"; "Café" with the accent in chips/stamp/menu, or "cafe" as today; chip copy is the raw key today.
6. OSM tag -> category table for the new set (which tags auto-pick venue/museum/landmark/park; what airports/stations/localities get now `other`/`area` are gone).
7. Order of categories in chips/list/menu.
8. M1 (interim shape-pins), M2 (note merge), M4 (street clipping) above.
