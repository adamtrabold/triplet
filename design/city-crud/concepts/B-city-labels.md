# B · City Labels (RECOMMENDED)

**A city becomes a thing with its own tag.** Tap a city's name in the list and it opens its own
label, a Hanging Tag with a navy printed band, hung from the city's centre: name, where it is, how
many places, how far its farthest stop is, and Rename · Move · Delete. In the add flow, the city
menu gets one more line, where you type any name ("Philadelphia").

Stills, in order: `stills/2-B-file-a-stop.png`, `stills/3-B-city-label.png`,
`stills/4-B-make-a-city-first.png` (raws `B1`..`B9` in `stills/raw/`).

## Draws on

- **The app's own grammar** (CLAUDE.md UX principle: clicking any list item navigates the map to
  it and opens its tag). A section header is a list item; a city that's tappable should open its
  tag on arrival like a pin or a district does. The close is the shipped pin-close disc on the
  city's centre.
- **The inspo: hotel luggage labels** (`design/inspo/project/hotel-de-la-poste-cortina-label.jpg`:
  "HOTEL DE LA POSTE / CORTINA D'AMPEZZO / DOLOMITI" is literally a place's name printed big on a
  label with where it is beneath). The City Label is the same idea in the app's own parts: the tag
  die, a printed band, big condensed caps, small stamped numbers.
- **Oblique Strategy "Go outside. Shut the door."** (a real random draw): city admin leaves the add
  flow. The add tag stays a place tag; the city has its own door.
- **Oblique Strategy "Honor thy error as a hidden intention"**: the city the app makes by mistake
  (East Marlborough Township) is the cue: it's now a thing you can open, rename, merge away.
- **Orienteering** (random draw of an unrelated field): the stamped FARTHEST ≈ 150 km and the move
  mode's fixed signpost over a moving map, like setting a control point on a course.

## The moments

1. **File a roadtrip stop under a city that isn't there yet (places-first).** Add the stop as
   usual. Tap the city line: the menu shows your cities, "New city · + Wilmington" (where it is),
   and a new line "+ Name a city…". Type Philadelphia, USE (or Return). The line reads PHILADELPHIA
   with the NEW stamp; the address still says Wilmington; the note says "≈ 40 km from
   Philadelphia". ADD makes the city, then the place. Reopen the menu before ADD and the line holds
   "Philadelphia" to change (J4).
2. **Read a city.** Tap its name in the list (or its signpost board when zoomed out): the map goes
   there (unchanged) and its label opens on arrival. Name, where its centre is ("Pennsylvania,
   United States", or "Centred on Philadelphia, Pennsylvania" for a name that isn't a town),
   PLACES / VISITED / FARTHEST stamped. The centre disc closes it.
3. **Rename.** The name becomes an entry on a navy rule (caption CITY NAME). Any name is allowed:
   "Philly roadtrip". CANCEL | SAVE.
4. **Move (its centre).** The label closes; the city's own signpost (phase 4's post and board)
   stands fixed at the map's centre; drag the map under it; a slip says what moving changes
   (go-to lands here, distances measured from here, places stay put). CANCEL / DONE.
5. **Delete.** The label asks: "Delete East Marlborough Township?" (•) Move its 1 place to
   [PHILADELPHIA ⌄] (default: the nearest other city) or ( ) Delete the place too. CANCEL |
   DELETE CITY. With nothing filed: just "Delete X? Nothing is filed here."
6. **Make a city before any place.** The title menu's Places side gets "New city" (as Plans has
   "New plan"). It opens a blank City Label in the screen's frame (the add tag's card with the navy
   band): CITY NAME searches towns so the centre is real; MAKE CITY. With no pick it can still be
   made, centred on the map's centre. You land in the new, empty city.

## Rules (systems)

- **The guess is unchanged** (nearest city within 70 km, else the real town NEW). The new input
  line is the escape hatch; the guess never asks.
- **A city made from a typed name** gets its centre from one Nominatim lookup of that name, settlement
  results only, with today's sanity box (≤ 3°, `deriveNewCityConfig()`); no settlement found: the
  place's own point (or the map's centre when made from the title menu). The lookup runs at USE,
  so the distance note can show before ADD.
- **Hand-made is kept.** A city made from a typed name, the title menu, or renamed / moved by hand
  is `auto_added = false`; `cleanupOrphanCities()` only removes auto-added cities never touched by
  hand. An empty hand-made city shows its section header with a 0 tally and "Nothing here yet."
- **Delete** moves its places (keeping star, visited, plan stops) or deletes them and their plan
  stops (the confirm names the plan-stop count when there is one). A seeded city can be deleted
  too: the static `CITIES` bootstrap must not bring it back (needs a tombstone; builder's call).
- **Move** writes the centre (and shifts the box by the same offset, keeping its size, so the
  distance note follows).
- **Rename to a name you already use**: SAVE reads MERGE INTO PHILADELPHIA and moves the places
  (open question below).
- Signed out / playground: the label's segments are greyed (`aria-disabled`) and offer sign-in, as
  the place tag does.
- The Hanging Tag's own city menu gets the same "+ Name a city…" line (re-file a saved place under
  a new named city).

## Trips

No trip entity (owner: "drop"). A city is the bucket a trip (or a leg of one) fills, named anything
the owner wants. Named as an open question.

## Not covered well

- J11, several far stops in a row: each stop more than 70 km from Philadelphia still guesses NEW
  (one hand pick each). C's rule would fix it; offered as an open question.
- J12, seeing a roadtrip bucket's stops together: going to Philadelphia still frames its centre.
  The label shows FARTHEST so you know they're out there; framing is an open question.
