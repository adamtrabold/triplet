# City CRUD: designer's notes (visual + systems; lane 2, one designer)

Branch: `claude/city-place-creation-workflow-vcblfw`. Nothing built; `index.html` untouched.

## v4: New city + Remove city (2026-10-28, latest) -- READ THIS FIRST

Owner on v3: "I don't like a because there should Be the ability to create a city without a stop. I
think there should be a remove city but it shouldn't be a front and center control". v3's A is out.
- Spec: `concepts/v4-new-and-remove.md`. Stills: `stills/v4/1-new-city.png`, `2-remove-city.png`
  (`stills/v4/stills.js`, on the v2 build 908dd0c).
- Decisions: New city = a title-menu row that becomes the built Find a city line; Remove… only on a
  hidden city's header (hide first); confirm moves places (default only when a city is within 70 km)
  or removes them; any city a person chose is `auto_added = false` and survives cleanup.
- Caption check: fixed N2 (menu widened so the result lines aren't cut) and R2 (confirm tightened so
  CANCEL / REMOVE are on screen); R1's caption trimmed to what the frame shows.
- Open: (1) Is "hide first, then Remove…" the right amount of hidden? (2) Should Remove offer
  "remove the places too" at all? (3) New city in the title menu only, or also on the + / add tag?

## v3: Delete city reopened (2026-10-23) -- history

Owner: "Idk about delete city though — brainstorm better options". Everything else in v2 stands and
is being built (a builder pushes to this branch too; don't touch `notes/builder.md`).
- `concepts/v3-instead-of-delete.md`: the job behind "delete" (mistake city / out of the way /
  forget a trip), five options that differ in kind (A cities come and go with their places, B move
  them all, C pack a trip away, D catch it at birth, E let them migrate), the recommendation (A) and
  its rules.
- Stills: `stills/v3/1-A-cities-come-and-go.png` (A, recommended), `stills/v3/2-C-pack-a-trip-away.png`
  (C); script `stills/v3/stills.js`. Captions checked frame by frame; three fixes (A2 and A4 scrolled
  so the drying header and the hidden Stockholm header are on screen; C2's map no longer shows
  Stockholm's pins; A3's caption claims only what the menu shows).
- If A is taken: the v2 build drops its "Delete city…" foot and its confirm.
- Open questions: (1) no delete control at all: the eye for done trips, and deleting places to
  forget one: OK? (2) a wrong city holding several places needs one move each: OK, or add B's
  "Move all"? (3) do the 5 seed cities follow the same rule (vanish when empty)?

## v2: where things stood (2026-10-23, later)

The owner saw the v1 stills and changed scope: "Ok I'm realizing this is going to suck. I still want
to be able to move things to different / new cities for the close use case but for the more complex
roadtrip example that should just Be a saved plan". Then: "Delete is good but not rename — cities
should Be the names of real citirs".

- Current concept: `concepts/v2-lean.md` (one concept; one alternative described in text, not
  drawn). Jobs v2 + coverage at the top of `jobs.md`; v1 jobs kept below as history.
- Stills: `stills/v2/1-name-and-address.png`, `2-move-to-a-city.png`, `3-roadtrip-is-a-plan.png`,
  `4-delete-a-city.png`; raws in `stills/v2/raw/`; one script makes both
  (`CHROME=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome node design/city-crud/stills/v2/stills.js`,
  `sheets` as the argument re-renders only the sheets). v1 stills kept as they were.
- Decisions: the guess unchanged; "Find a city" (real settlements only) replaces free naming; no
  move / re-centre (centre comes from the real city's record); the PLAN line on the add tag only
  with a plan open; a roadtrip stop filed under its real town (the plan's legs read as the route);
  Delete city… as the gone-to city's foot, moving places by default.
- Caption check done frame by frame (two fixes: sheet 3's second caption now says what the frame
  shows; sheet 4's frames scrolled so the foot and the whole confirm are on screen).
- v1 open questions 1-5 fall away (no buckets, no label, no navy band); 6 (delete-too) stays; 7
  (rename-to-merge) falls away (no rename).

### Open questions (v2, for the owner)
1. Roadtrip stops are filed under their real town (NEW Lewes), so the plan reads Philadelphia →
   Lewes, at the cost of one small city per far town in Places. OK, or file them under the nearest
   city you have?
2. The PLAN line shows only when you tap + with a plan open. OK, or offer "add to a plan" on every
   add?
3. Deleting a city: move its places (default) or delete them too. Is "delete them too" wanted?
4. Delete city… lives under the city you've gone to (like a plan's foot). OK as the place for it?

### Not drawn yet
Signed-out greying of Find a city / Delete city…; the "stop write failed" line; a Find-a-city
result that matches a city you already have; 375x667 fits.

## v1: where things stood (2026-10-23) -- history

- `jobs.md` written first (J1-J10 from the owner's words, J11-J17 inferred), with the coverage table.
- Three concepts that differ in kind (`concepts/A-*.md`, `B-*.md`, `C-*.md`) plus the shared
  name/address mechanism (`concepts/0-shared-name-and-address.md`).
- **Recommended: B · City Labels**, with two open questions that could fold C's best idea into it.
- Stills: six contact sheets in `stills/` (order below), raw phone frames in `stills/raw/`
  (390x844 @3x, the real `index.html` + the design layer, real OSM tiles). Waiting on the owner.

## The owner's words (verbatim)

"There's really no good way to add a new city. And you can't edit one even if it creates a new one
while you're working. My workflow was trying to put a place in that was in a city I hadn't added
yet…and it was also for a roadtrip so while I wanted it attached to a certain city the stop was not
in that city. Also I could not type the address in I had to put it in the name which was
confusing. Let's figure this out."

"This can do the normal process. Name and address should be separate. Cures [Cities] should have
crud principles. Cities are a conceptual bucket for a trip not always the actual city…eg I'm going
to Philadelphia but I'm putting things down for the roadtrip"

Earlier, still owner-set: trips "drop"; "places-first; immediately doing the thing you actually want
to do not the adin"; "User should not have to select distance."; "the address needs to comfortably
balance the idea of the city it belongs to in the app vs the city the address actually places it";
"if the app puts a place in the wrong city you should be able to edit the city attached to the
place".

## What I found (reproduced in the harness)

- Adding Longwood Gardens near Philadelphia today: the guess finds no city in reach and makes NEW
  "East Marlborough Township" (the OSM `city` value); the menu offers only the seed cities and that
  township. No way to say Philadelphia (`stills/raw/T1-today.png`).
- Before a pick the city line printed REYKJAVÍK on an add in Pennsylvania (the pre-pick rule falls
  back to the last go-to city). Fixed in the shared spec (prints the caption CITY).
- An address search through NAME works (Nominatim) but names the place after the address.

## Decisions so far, and why

1. **Name and address: two lines, each searches** (shared). The owner settled "separate"; the
   mechanism is mine. Writing the fact on the line it belongs to needs no mode. After a pick NAME
   stops searching so a hand name ("Rental, night 2") doesn't throw results; this changes the
   phase-2 W1/W2 ruling (a systems call I own, not an owner question; written in
   `concepts/0-shared-name-and-address.md`; the build check should test it).
2. **B over A and C.** B gives a city a real home that follows the app's own rule (a list item
   opens its tag), keeps the add flow a place tag (one extra line in the menu), covers J9 properly
   and makes the city readable (J7). A is cheapest but can't move a centre and turns a navigation
   menu into a form. C is the best at J11 but runs on invisible state.
3. **Navy band on the City Label.** Orange is taken (star / starred band, one accent). Navy is the
   frame's colour and the signposts' ink, and the city's signpost is already navy-ruled paper. Open
   to the owner.
4. **Move uses the city's signpost** (phase 4's post and board, fixed at the map's centre). The
   city's map symbol already exists; a generic teardrop pin was tried first and read as a place.
5. **Delete defaults to moving the places** to the nearest other city (J15); deleting them is the
   second choice. The motivating case is merging a mistaken auto city into the owner's bucket.
6. **Hand-made cities are never auto-cleaned** (J16): `auto_added = false` once named / moved by
   hand.
7. **Any name** for a city ("Philly roadtrip"); its centre comes from the name's lookup, else the
   place / the map. No trip entity.

## Process notes

- Real randomness used (python `secrets`-seeded draw): Oblique Strategies "Faced with a choice, do
  both" (→ shared two-line search; A's line), "Go outside. Shut the door." (→ B: city admin leaves
  the add flow), "Honor thy error as a hidden intention" (→ B's delete-and-merge of the mistaken
  township); fields: wine appellations (named area vs. where the grapes grow: both truths, already
  shipped), orienteering (→ FARTHEST, the move mode), mushroom foraging (→ C's basket); twist "the
  place picks the city, not the other way round" (→ inverted in C).
- First idea thrown away: a "Manage cities" screen (list of cities with edit/delete). It's admin
  ahead of places and a new surface; A is its sharpest form.

## How the stills are made (re-render)

```
CHROME=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome node design/city-crud/stills/stills.js [prefix]
CHROME=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome node design/city-crud/stills/sheet.js
```
- `proto/lib-cc.js` opens `index.html` in the gesture harness via `add-tag-jam/p2/lib-p2.js`
  (stub Supabase), serves `proto/fixtures/` (real Nominatim answers fetched 2026-10-23:
  Longwood Gardens, Philadelphia, Rehoboth Beach, Cape Henlopen State Park, 1007 N Orange St
  Wilmington) and real OSM tiles (cached in the session scratchpad; set `CC_TILES` to move it).
- `proto/design-layer.js` draws the new states with the app's own classes (`.tag-*`, `.menu-*`,
  `.add-*`, `.sec-*`, `.plan-*`, `.sp-*`) and tokens; only `.cc-*` is new CSS. It is a design
  prototype, not a build reference for code structure.
- The harness's `chromium-1243/chrome-linux` path is gone in this container; pass `CHROME=` as above.

## Still order for the owner

1. `stills/1-today-and-address.png`
2. `stills/2-B-file-a-stop.png`
3. `stills/3-B-city-label.png`
4. `stills/4-B-make-a-city-first.png`
5. `stills/5-A-write-on-the-line.png`
6. `stills/6-C-the-city-youre-in.png`

## Open questions (for the owner)

1. **A city can be named anything** ("Philly roadtrip"), and a city is the trip's bucket; trips stay
   dropped. OK, or should a city name be a real place?
2. **Should the city you're in catch far stops?** (C's rule, foldable into B: no city within 70 km →
   the city you've gone to, instead of a NEW town.) Saves a tap per roadtrip stop; risk: a surprise
   filing when you forgot where you were.
3. **Going to a roadtrip city: frame all its places, or its centre (today)?** Today's go-to shows
   Philadelphia at zoom 12; the Delaware stops are off screen.
4. **Tapping a city's name in the list opens its label** (as well as going there). OK, or keep the
   name a quiet go-to and open the label from somewhere else?
5. **Navy band** on the City Label (orange means starred).
6. **Delete:** move-to (default nearest city) plus "delete the places too" -- is the second choice
   wanted at all?
7. **Renaming to a name you already use** merges the two (SAVE becomes MERGE INTO X). OK?

## What comes next

- Owner picks / adjusts → this designer revises stills if needed → handoff spec for ONE builder
  (lane 2; DB: `auto_added` semantics, a tombstone for deleted seed cities -- migration via the
  Supabase MCP after the build is green) → one combined CD + UX check on the build.
- Not yet drawn: the signed-out label, a city with 0 places' label, the Hanging Tag's city menu with
  the new input line (same as B1), rename-to-existing (merge), 375x667 fit of the label.
