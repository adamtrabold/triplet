# v4 · New city (no stop needed) and Remove city (out of the way) -- CURRENT for these two

Owner on v3: "I don't like a because there should Be the ability to create a city without a stop. I
think there should be a remove city but it shouldn't be a front and center control". Standing: real
cities only, no rename. Built on the v2 build (908dd0c).

Stills: `stills/v4/1-new-city.png`, `stills/v4/2-remove-city.png` (raws in `stills/v4/raw/`).

## New city
- The title menu's Places side gets **"+ New city"** before the Plans switch row (Plans has "New
  plan" in the same spot). A tap turns the row into the **same Find a city line** the built city
  menus have (`findCities()`: real settlements, nearest the map's centre first, "Kind · State,
  Country · ≈ n km away"). Picking a result makes the city (`addCity()` with the found config) and
  goes to it. Picking one you already have just goes to it.
- You land in the empty city: its section header with a 0 tally and one note, "Nothing here yet. Tap
  + to add a place; it's yours until you remove it." The add tag's pre-pick guess already files near
  it (it's a real city with a real centre).

## Remove city: behind the eye
- **Remove… appears only on a hidden city's section header**, quiet (the plan foot's text-button
  voice, `--ink-2`), just before the closed eye. Shown cities never show it, and nothing else offers
  it: no menu row, no tag control. To remove you first hide (the shipped eye), so it's two
  deliberate steps and is never in the way. Owner's "not front and center", taken literally.
- **Its places:** an inline confirm under the header: "Remove Stockholm from your cities?"
  ( ) Move its n places to [city ⌄]  ( ) Remove the n places too (and their plan stops, counted when
  there are any). The default is **move** to the nearest other city **only when that city is within
  reach** (70 km, `CITY_REACH_KM`); otherwise nothing is preselected and Remove stays quiet until you
  choose (so 23 Stockholm places are never filed under Malmö by accident). CANCEL / REMOVE.
  An empty city: just "Remove X? Nothing is filed here." CANCEL / REMOVE.
- Removing is permanent. For "I'm done with this trip", hiding already keeps everything; that is
  the point of putting Remove behind the eye. (v3's "pack away" isn't needed: hidden *is* put away.)

## Rule: hand-made cities survive cleanup
- A city is **kept** if you chose it: made from New city, from Find a city, or from "+ {town}" in a
  city menu. It is written with `auto_added = false`, so today's `cleanupOrphanCities()` (which only
  removes empty `auto_added` cities) never touches it.
- Only a city **the guess** made on its own (the NEW stamp with no hand pick) stays `auto_added =
  true`, and still disappears once emptied, as today. Builder: the v2 build's Find a city path
  currently writes `auto_added: true`; that flips to false.
- Seed cities: kept (as today) until removed by hand; a removed seed must not return from the static
  `CITIES` bootstrap (a tombstone or the live table as the truth; builder's call).

## Not drawn
The empty-city confirm, the plan-stop count line, signed out (Remove… greyed with the sign-in slip,
New city's line too), Remove with the in-reach default preselected.
