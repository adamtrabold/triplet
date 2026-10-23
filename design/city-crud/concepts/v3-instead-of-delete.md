# v3 · Instead of "Delete city" (CURRENT for this one question; the rest of v2 stands)

Owner: "Idk about delete city though — brainstorm better options". Earlier: "Delete is good but not
rename — cities should Be the names of real citirs". Settled and untouched: two lines for name and
address, "+ Find a city…" (real cities only), no rename, the roadtrip is a plan.

## What "delete a city" was really for

1. **A city the app made by mistake** (East Marlborough Township for Longwood Gardens). The real
   job: the place belongs somewhere else.
2. **A trip that's done, or off**, cluttering the list, the title menu and the map. The real job:
   get it out of the way.
3. **Forget a trip completely.** Rare. The owner said earlier: "if i go back to a place i may want to
   see all the places i noted prior / which i visited", which argues against destroying anything.

Random draws used (python `secrets`): Oblique Strategies "Water", "Faced with a choice, do both",
"Make it more sensual"; fields: seasonal menus, bird migration, wardrobe capsule.

## Options (they differ in kind)

**A · Cities come and go with their places (RECOMMENDED; drawn).** No Delete control anywhere. A
city exists only while it holds a place, for every city, the 5 seeds included. Move its last place
out (or delete it) and the city dries up, using the un-visit's dry-up ink on its section header
and signpost, then it's gone from the list, the menus and the map.
*Job:* 1 fully (fix the place, and the wrong city goes by itself); 2 with the eye that ships today.
*Cost:* forgetting a whole trip means deleting its places one by one. A wrong city holding many
places needs one move each, but mistake cities are born holding one place. The seeds stop being
permanent. *(Draws: "Water": a city is a pool that dries when empty; "Make it more sensual":
the dry-up ink the owner tuned.)*

**B · Move them all (merge).** Under the city you've gone to: "Move all 6 places to [city ⌄]".
The emptied city then disappears, as in A.
*Job:* 1 in one step, even for a city holding many places; also consolidation. *Cost:* a city-level
control remains, and it does nothing for 2 or 3.

**C · Pack a trip away (drawn as the alternative).** "Pack away…" under the city you've gone to puts
the whole trip away: off the list, the map, the menus and the city guess, kept whole with its stars
and stamps, under "Packed away n" in the title menu. Unpack it to bring it back.
*Job:* 2 without losing anything, and it honours "i may want to see all the places i noted prior".
*Cost:* a third city state next to shown and hidden (the eye), and it overlaps the eye.
*(Draws: seasonal menus, wardrobe capsule.)*

**D · Catch it at birth.** The mistake never needs undoing. When ADD would make a NEW city, the city
line's menu leads with your cities nearby and the closest real cities, each with its distance, so
the right one is one tap and there's no typing.
*Job:* 1, prevented rather than repaired. *Cost:* nothing for 2. It adds weight to the add tag at
the moment you're trying to finish.

**E · Let them migrate.** Delete stays, but asks nothing: each place re-files itself by the normal
guess, as if the city had never existed (nearest city in reach, else its real town).
*Job:* 1 and 2 in one tap. *Cost:* the result can surprise (six NEW small towns), and it's still a
destructive-feeling control. *(Draw: bird migration.)*

## Recommendation: A

It removes a control instead of adding one, and it fixes the mistake job at its root: you fix the
place, and the city follows. The "out of the way" job is already met by the eye, which keeps the
memory the owner asked for. It's the leanest, and it matches "Cities should be the names of real
cities": a city is a real place you have something in, nothing more. D is worth adding later if
mistake cities keep happening; it's a ranking change to the "+ Find a city…" list that v2 is
building now.

## Rules for A (systems)

- `cleanupOrphanCities()` covers every city, not only auto-added ones: no place or shape → removed.
  The static seed bootstrap draws only seed cities that hold a place (or the live table is
  authoritative once loaded); the offline seed stays a fallback, not a guarantee.
- "+ Find a city…" makes a city only at the moment a place is filed into it, so no city is ever born
  empty.
- The dry-up: a city's section header and its signpost board fade with the un-visit's dry-up
  (thickest ink last), triggered by the state change, never by gesture code; reduced motion: gone
  at once.
- A plan's stops are places, so a city emptied of places also has no stops; plans are unaffected.
- **For the build running now:** v2's "Delete city…" foot and its confirm come out. Nothing else
  in v2 changes.

Stills: `stills/v3/1-A-cities-come-and-go.png` (A), `stills/v3/2-C-pack-a-trip-away.png` (C).
