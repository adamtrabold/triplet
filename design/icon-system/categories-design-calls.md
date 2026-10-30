# Categories migration: design calls (2026-10-30)

The team's calls (visual designer) for `docs/categories-migration-plan.md` section 4, items 1-7.
Source list: `categories.md` (locked 2026-10-16). Owner: "let's not put them in the app just yet"
(the new icon set stays out; these calls cover the interim). Still:
`design/icon-system/cat-calls.png` (chips + rows, Chromium 390 @3x, rendered from a scratch copy of `index.html`).

## 1. Inks for the four new pin categories

| Key | Ink | Name (poster source) | On --paper | Why |
|---|---|---|---|---|
| venue | `#AF4B82` | Bryce sunset rose | 4.26:1 | Stage-light magenta: the only free warm hue clear of wine, rust and the orange. |
| museum | `#523875` | Grand Canyon dusk violet | 8.12:1 | A deep ink for quiet halls, between bar's blue and hotel's plum without touching either. |
| landmark | `#4889A8` | Crater Lake blue | 3.27:1 | Light, open blue for things you look at; sits a full value step above bar's McKinley blue. |
| park | `#3F925B` | Yosemite meadow green | 3.23:1 | Lawn green, lighter than attraction's moss and far lighter than nature's spruce, so Park and Nature never read as one. |

How they were checked (`scratchpad` script, same metrics as the `CATEGORY_INKS` comment):
- Every ink >= 3:1 on `--paper` #F2EBDD (WCAG 1.4.11, the existing floor).
- CIEDE2000 against every other ink (the method used since the 2026-10-07 re-inks): every new
  pair >= 14.8, above the palette's existing closest pair (cafe/street 13.2). Nearest new pairs:
  park/attraction 14.8, park/neighborhood 14.8 (a pin vs an outline, so form separates them too),
  museum/bar 16.5, museum/hotel 16.6.
- Star and brand orange: every new ink >= 34.8 from `--star` #EE7434 and `--star-deep` #A8400C
  (venue is closest, 34.8 from star-deep). Navy (selected row): museum 15.3 is the nearest; the
  selected row inverts its badge to paper, so no ink sits on navy.
- Saturation capped at 0.42 to stay in the poster-ink family (the existing inks run 0.17-0.61).

The other inks don't change. The 2026-10-07 note that the old pair-rule counts were "not re-run"
still holds; the builder should rewrite that comment block to state the CIEDE2000 floor above
instead of the 55-pair ladder (which already fails restaurant/cafe and restaurant/street).

## 2. Neighborhood's ink

Keep District's Yellowstone teal `#328177`. Why: it's the same thing renamed, and the teal is
already how the owner knows a district outline on the map. The stored `neighborhood_shapes.color`
column is left alone (not a category ink; out of this change).

## 3. New categories until their icons ship

One approach for all four (venue, museum, landmark, park): borrow the old Other dot
(`g-other`'s 5px-radius disc), as `g-venue` / `g-museum` / `g-landmark` / `g-park` symbols, in
the category's own ink. Why: borrowing a real glyph would say the wrong thing (Park with Nature's
pine tree is the exact confusion the owner split them to fix); a blank badge reads as broken; a
neutral dot in the right ink says "this type, icon to come". `g-district` is renamed (same
drawing) `g-neighborhood`.

## 4. Fallback for an unknown category

`--ink-2` #5A564C (6.17:1) with the same dot glyph. Why: an unknown key isn't a category, so it
gets the label grey, not a category ink; nothing new to keep distinct.

## 5. Labels

- **Neighborhood**, US spelling, and the key `neighborhood` (not `neighbourhood` as the plan
  has it). Why: the owner writes "Neighborhood", and the code already spells it that way
  (`neighborhood_shapes`, `visibleNeighborhoodShapes()`). One spelling everywhere avoids a
  key/table split.
- **Café** shown with the accent, key stays `cafe`. Why: the app's copy keeps real diacritics
  (Reykjavík, Malmö) and shows them in caps (CAFÉ, as REYKJAVÍK).
- Chips, row meta, the tag's TYPE stamp and the add-tag TYPE menu all read one label map
  (Restaurant, Café, Bar, Venue, Museum, Landmark, Attraction, Park, Nature, Shopping, Hotel,
  Neighborhood, Street) instead of the raw key; CSS uppercases it where it does today.

## 6. OSM tags -> TYPE (first match wins; rows in this order)

| TYPE | Tags |
|---|---|
| hotel | unchanged |
| restaurant | unchanged |
| cafe | unchanged |
| venue | amenity: theatre, arts_centre, cinema, nightclub, music_venue, events_venue, concert_hall; leisure: stadium |
| bar | amenity: bar, pub, biergarten; craft: brewery, distillery (nightclub moves to venue) |
| museum | tourism: museum, gallery; shop: art |
| attraction | tourism: attraction, zoo, aquarium, theme_park; historic: castle; amenity: public_bath, spa; leisure: swimming_pool, sports_centre, water_park, resort, beach_resort, spa, sauna |
| landmark | tourism: artwork; historic: * (after castle above); amenity: place_of_worship, townhall, fountain; man_made: lighthouse, tower; place: square, plaza |
| park | leisure: park, garden, playground, dog_park; landuse: cemetery; amenity: grave_yard |
| nature | natural: *; water: *; leisure: nature_reserve, beach; boundary: national_park, protected_area; waterway: waterfall; tourism: viewpoint (park and garden leave nature) |
| shopping | shop: * (after museum's shop=art); amenity: marketplace |
| neighborhood | place: suburb, quarter, neighbourhood; boundary=administrative with a sub-city addresstype (was district) |
| street | highway, unchanged |

Airports, stations, ferry and bus terminals, and `place=locality`: no row (`null`). Why: none
passes "would I ever filter for just these?", the live data has none, and `null` already means
"TYPE stays as it was; the person sets it", which is honest. Botanical gardens tagged only
`leisure=garden` land in Park; the person corrects TYPE by hand (Nominatim gives one pair, so
the table can't tell them apart).

## 7. Order (chips, list category runs, `categoryRank()`, add-tag TYPE menu)

Restaurant, Café, Bar, Venue, Museum, Landmark, Attraction, Park, Nature, Shopping, Hotel, then
Neighborhood, Street. Why: it's the locked list's own order, and it reads as a day: eat and
drink, see a show or a collection, look, do, go outside, shop, sleep; shapes last as today.
