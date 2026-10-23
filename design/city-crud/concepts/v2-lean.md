# v2 · Lean cities, plans for trips (CURRENT; supersedes A, B, C)

Owner: "I still want to be able to move things to different / new cities for the close use case but
for the more complex roadtrip example that should just Be a saved plan"; "Delete is good but not
rename — cities should Be the names of real citirs".

Stills, in order: `stills/v2/1-name-and-address.png`, `2-move-to-a-city.png`,
`3-roadtrip-is-a-plan.png`, `4-delete-a-city.png` (raws `stills/v2/raw/V1`..`V8`).

## In four lines

1. **Name and address are two lines**, each one searches (v1's shared spec, unchanged).
2. **The city menu can find a real city** ("+ Find a city…"): pick Philadelphia from real
   results, and the place moves there (or is filed there at add). That is the only way a city is made
   by hand.
3. **A roadtrip is a plan:** with a plan open, the add tag carries a PLAN line ("Philly roadtrip ·
   STOP 3"), and ADD makes the place and its stop in one go. The stop is filed under its real town,
   as the guess does today.
4. **Delete city…** sits under the city you've gone to (an open plan's foot, for a city); it moves
   the city's places to a city you pick, or deletes them too. No rename.

## What survives from v1

- Shared name/address lines: kept whole.
- B's "+ Name a city…" line becomes **"+ Find a city…"**: a search, not a free name.
- C's foot (the plan-foot pattern) is kept for Delete only.
- B's City Label, Move, Rename, the title menu's New city, C's "the city you're in" rule, A's
  writable city line and edit mode: all cut.
- The city guess is **unchanged** (nearest city within 70 km, else the real town NEW).

## Rules (systems)

- **Find a city:** same search as the add tag, filtered to settlements (city / town / village; not
  counties or regions), ranked nearest the place; each result says "City · Pennsylvania, United
  States · ≈ 45 km away". A pick that matches one of your cities by name and country just picks
  that city. A new pick runs today's `addCity()` with the result's own name, centre and box (no
  second lookup). It is on both tags' city menus, under "New city · + {real town}".
- **No move / re-centre.** A city's name and centre both come from a real city's OSM record, so
  there's no hand-set centre to go wrong. The one case that needed it in v1 (a free-named bucket
  centred on its first stop) is gone with the owner's ruling. If a city's OSM box is ever wrong, the
  fix is a data fix, not a control.
- **The PLAN line:** shown only when you tap + with a plan open in Plans (that plan, preset). Its
  menu lists your plans and "Not in a plan". STOP n is the next position (printed STOP, stamped
  number, as the Hanging Tag does). ADD inserts the place, then `addStop(planId, {locationId})`;
  if the stop write fails, the place stays and the tag says so ("Saved, but not added to the
  plan -- try again"). Outside Plans there is no PLAN line (no extra row on every add).
- **A roadtrip stop's city:** the normal guess, so a far stop becomes a NEW real town (Lewes). In the
  plan this gives a leg per town, so the plan reads Philadelphia → Lewes. The cost: one small city
  per far town in Places (open question).
- **Delete city…:** under the gone-to city's section only (in Places). Confirm inline: "Delete X?"
  (•) Move its n places to [nearest other city ⌄] ( ) Delete the n places too (and their plan stops,
  counted when there are any). CANCEL / DELETE CITY. A city with no places isn't listed anyway
  (auto cities are cleaned up when emptied, as today). A seeded city can be deleted; the static
  `CITIES` bootstrap must not bring it back (a tombstone; builder's call).
- Signed out: the menu's search line and Delete city… are greyed and offer sign-in (shipped slip).

## Alternative considered (different in kind; not drawn)

**Roadtrip stops live only in the plan** (a stop that isn't a place: no city, never in Places). It
answers "what city is a roadtrip stop filed under" with "none" and keeps Places free of small
towns. Rejected for now: it needs a schema change (stops with their own name / point), splits
"a stop is a pin or a shape", and stops would lose star / visited. Worth reopening only if the
small-town cities in Places bother the owner (open question 1).
