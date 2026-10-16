# Place categories: locked (2026-10-16)

Owner: "i think that's good fo rnow". Two tests decide every category: **what am I doing there?** and **would I ever filter for just these?** (owner: "what if im with my kid and i just want to see what parks i marked", "sometimes i do just want to go to a museum").

**Pins (11):**
- **Restaurant**: eating a meal.
- **Café**: coffee or a pastry (owner: "id be looking for a bakery if i want a pastry").
- **Bar**: having a drink.
- **Venue**: seeing a show. You'd only go if there's a show on.
- **Museum**: any museum or gallery: art, history, themed.
- **Landmark**: a notable place to see: buildings, monuments, public art and murals, squares.
- **Attraction**: going in to do things: rides, castles, tours, city pools, botanical gardens.
- **Park**: a city park, where you hang out outside in town. "Park" in the name makes it a Park, except national parks.
- **Nature**: getting into the natural world: waterfalls, volcanoes, coast, hikes.
- **Shopping**: shopping.
- **Hotel**: sleeping.

**Shapes (2):**
- **Neighbourhood**: drawn as its outline.
- **Street**: a box around the stretch you care about. Streets under about 1.5km are saved whole.

**Landmark vs Nature:** why it matters. A Landmark matters because of people (Plymouth Rock, a church). Nature matters as nature itself. Tie-breaker: what would most people do there?

**Gone:** Area, Other, Square (now in Landmark), Art and Sight (superseded), District (renamed Neighbourhood).

## Migration for the locked list (every place that changes)

Data: the live DB on 2026-10-16, 202 pins and 11 shapes. Places not listed keep their category. Before a duplicate pin is removed, its notes, star and visited state move onto the matching shape.

**Bar → Venue (8):** Jazzhouse, Jazzhus Montmartre, VEGA (Copenhagen); Debaser Nova, Debaser Strand, Fasching, Nalen, Slaktkyrkan (Stockholm).
*Stay Bar (4):* WarPigs, Covell, Tiki-ti, Metro bar.

**Attraction → Museum (24):**
- Copenhagen: Designmuseum Danmark, BLOX, Galleri Bo Bjerggaard, Nils Stærk, V1 Gallery
- LA: Hammer Museum, Photo Booth Museum, The Broad, Shepard Fairey Exhibit
- Malmö: Moderna Museet Malmö
- Reykjavík: Ásmundarsafn, Hafnarhús, Icelandic Punk Museum, Kjarvalsstaðir, Maritime Museum, Marshall House
- Stockholm: ABBA Museum, ArkDes, Fotografiska, Moderna Museet, Spårvägsmuseet, Spritmuseum, Scenkonstmuseet, Vasa Museum

**Attraction → Venue (3):** Greek Theatre (LA), Konserthuset (Stockholm), Øksnehallen (Copenhagen).

**Attraction → Landmark (17):**
- Copenhagen: 8 House, Amalienborg, Little Mermaid, Rentemestervej (mural)
- Malmö: Turning Torso, plus 5 murals (Davidshallsgatan 10 and 24, Grynbodagatan 9, Södra Skolgatan, Stenhuggaregatan)
- Reykjavík: Hallgrímskirkja, Harpa, Sólfar Sun Voyager, Þúfa
- Stockholm: City Hall, Public Library
- LA: The Philosophical Research Society

**Attraction → Park (1):** Folkets Park (park in the name).

**Attraction → Street shapes (4):** Grandagarður and Skólavörðustígur (remove the pins; the shapes exist); Klapparstígur (new Street); Bondegatan Erstagatan (merge into the Bondegatan street).

*Stay Attraction (13):* Christiansborg, CopenHill, Rosenborg, Tivoli, Echo Park Swan Boats, Hollyhock House, Malmöhus Castle, Aurora Reykjavík, Omnom, Perlan, Gröna Lund, Junibacken, Skansen.

**Nature → Park (5):** Griffith Park, Slottsparken, Humlegården, Tantolunden, Vasaparken.
**Nature → Attraction (2):** Laugardalslaug, Sundhöllin (city pools).
**Nature → Landmark (1):** Reykjanesviti (lighthouse).
*Stay Nature (2):* Bridge Between Continents, Gunnuhver.

**Area (18) goes:**
- → Landmark (squares): Lilla Torg, Möllevångstorget, Nytorget
- → Park: Superkilen park, Björns Trädgård, Assistens Cemetery
- → Shopping: Hornstulls Marknad
- → Neighbourhood (fetch outline): Freetown Christiania, Nyboder, Gamla Stan
- → Street: Hornstull Strand
- Remove the pin (a shape already exists): Skogskyrkogården, Djurgården, Västra Hamnen Bo01, Old Harbour (covered by Grandi), Jægersborggade, Laugavegur, Bondegatan

**Shopping changes (5):**
- → Street: Ravnsborggade, Sankt Eriksgatan
- → Landmark (squares): Israels Plads, Frederiksberg Runddel
- → Neighbourhood: Fashion District

**District pin → Street:** Værnedamsvej (approx.).

**Shapes:** the 6 district shapes are renamed Neighbourhood. The 5 streets are clipped to a stretch where they're over about 1.5km.

**Restaurant, Café, Hotel:** no changes.

**Tally after migration:**

| Category | Count |
|---|---|
| Restaurant | 30 |
| Café | 16 |
| Bar | 4 |
| Venue | 11 |
| Museum | 24 |
| Landmark | 23 |
| Attraction | 15 |
| Park | 9 |
| Nature | 2 |
| Shopping | 49 |
| Hotel | 0 |

That's 183 pins. 202 minus 19 that become shapes or are removed as duplicates. Plus new shapes to fetch in the owner's browser: 4 Neighbourhoods (Christiania, Nyboder, Gamla Stan, Fashion District) and 5 Streets (Hornstull Strand, Klapparstígur, Ravnsborggade, Sankt Eriksgatan, Værnedamsvej).

## What the app change costs (locked list)

- **Categories:** 11 pin categories, the same number as today, which counted Area and Other. New: Venue, Museum, Landmark, Park. Gone: Area, Other.
- **`CATEGORY_COLORS`:** colours for Venue, Museum, Landmark and Park; drop Area and Other; District becomes Neighbourhood.
- **Add form:** the new list. Street gets the "trim to the stretch" step, the biggest new piece of work.
- **Data:** a one-time migration through the Supabase MCP, plus fetching the 9 new shapes in the owner's browser (the `tools/` page; the sandbox can't reach OpenStreetMap).
- **Icons:** the icon team is working from this list (Venue, Museum, Landmark, Park vs Nature, Attraction).


---

# Place categories: a recommendation

2026-10-16. A recommendation, not a decision. The owner decides. Written from the live data (202 pins, 6 district shapes, 5 street shapes).

Owner, verbatim: "i actually think we're uncovering a flaw in the data model. things like squares are really not quite areas either. they could be represented by a pin. a street however is closer to a district (but not quite) and *should* have a box, becuase interesting places on streets are close together and streets can run through entire cities. do a deeper recommendation on amending the categories."

## The flaw

A category answers two different questions at once:

1. **What is it?** A restaurant, a sight, a neighbourhood.
2. **How is it drawn?** A dot (a pin) or a shape (an outline or a box).

Today the category decides the drawing: district and street are shapes, and everything else is a pin. "Area" is a category trying to be a drawing ("a place with size"), but it's stored as a dot. So it collects anything big: 18 places of four different kinds, and 8 of them are also saved as a district or street shape.

**The fix:** each category says what a place is, and the drawing follows from the kind of place. Something you stand at is a pin. Something you walk around inside, or along, is a shape.

## Proposed list

**Pins** (you go *to* them):

| Category | Means | Change |
|---|---|---|
| Restaurant | Somewhere to eat a meal | none |
| Café | Coffee, a bakery, a snack | none |
| Bar | You go for the drink (music or not) | keeps 4: WarPigs, Covell, Tiki-ti, Metro |
| Venue | You'd only go if there's a show on | **new**; 8 from Bar, 3 from Attraction |
| Attraction | Something made to visit: museum, landmark, gallery, castle, mural, ride | name kept (owner); loses the venues |
| Square | A square, plaza or market place to sit in | **new**; takes the squares from Area |
| Nature | A park, garden, coast, pool, hot spring | gains the parks from Area |
| Shopping | A shop or market stall | none |
| Hotel | Where you sleep | none |
| Other | Anything else (the asterisk) | none |

**Shapes** (you walk *around in* or *along* them):

| Category | Means | Drawn as |
|---|---|---|
| Neighbourhood | A part of town worth wandering | its outline (renamed from District) |
| Street | A street worth walking | **a box around the stretch you care about** |

**Area goes away.** Each of its places moves to where it belongs (migration below).

## Streets: the box

The owner's point: "interesting places on streets are close together and streets can run through entire cities."

- A street is saved as **a stretch, not the whole street**. When you add one, you get the OSM line, then trim it to the part you care about: from cross street A to cross street B. The default is about 600m around the spot you searched.
- The stretch is drawn as **a box**: a band about 60m wide around it. The places on it sit inside the box, so the street reads as a strip of things to do.
- A long street can be saved twice, as two stretches with different notes.
- Data: same table (`neighborhood_shapes`, type `street`), with geometry clipped to the stretch. No new table.

## Migration: every place that changes

**Area → (18):**

| Place | City | Moves to | Why |
|---|---|---|---|
| Lilla Torg | Malmö | Square | a square |
| Möllevångstorget | Malmö | Square | the square (the Möllan neighbourhood shape stays) |
| Nytorget | Stockholm | Square | a square |
| Hornstulls Marknad | Stockholm | Shopping | a market |
| Superkilen park | Copenhagen | Nature | a park |
| Björns Trädgård | Stockholm | Nature | a park |
| Assistens Cemetery | Copenhagen | Nature | a cemetery park |
| Skogskyrkogården | Stockholm | remove the pin | already a Neighbourhood shape |
| Djurgården | Stockholm | remove the pin | already a Neighbourhood shape |
| Västra Hamnen Bo01 | Malmö | remove the pin | already a Neighbourhood shape |
| Old Harbour Reykjavík | Reykjavík | remove the pin | Grandi already covers it |
| Jægersborggade | Copenhagen | remove the pin | already a Street shape |
| Laugavegur | Reykjavík | remove the pin | already a Street shape |
| Bondegatan | Stockholm | remove the pin | already a Street shape |
| Freetown Christiania | Copenhagen | Neighbourhood | needs its outline fetched |
| Nyboder | Copenhagen | Neighbourhood | needs its outline fetched |
| Gamla Stan | Stockholm | Neighbourhood | needs its outline fetched |
| Hornstull Strand | Stockholm | Street | a waterfront promenade; needs its stretch |

**Streets saved as pins elsewhere:**

| Place | City | Now | Moves to |
|---|---|---|---|
| Grandagarður | Reykjavík | Attraction | remove the pin (Street shape exists) |
| Skólavörðustígur | Reykjavík | Attraction | remove the pin (Street shape exists) |
| Klapparstígur | Reykjavík | Attraction | Street (needs its stretch) |
| Bondegatan Erstagatan | Stockholm | Attraction | merge into the Bondegatan street |
| Ravnsborggade | Copenhagen | Shopping | Street |
| Sankt Eriksgatan | Stockholm | Shopping | Street |
| Israels Plads | Copenhagen | Shopping | Square |
| Frederiksberg Runddel | Copenhagen | Shopping | Square |
| Fashion District | LA | Shopping | Neighbourhood |
| Værnedamsvej (approx.) | Copenhagen | District pin | Street (needs its stretch) |

Murals saved at a street address (Davidshallsgatan 10 and 24, Södra Skolgatan, Stenhuggaregatan, Rentemestervej) are points. They stay Attraction.

**Notes and stars carry over.** Before a duplicate pin is removed, its notes, star and visited state are copied onto the matching shape.

## What it costs in the app

- **Add form:** the category list changes: Area out, Square in, District renamed Neighbourhood. Choosing Street adds a "trim to the stretch" step on the map. That step is the biggest piece of new work.
- **Filters and colours:** one chip out, one in; Square needs a colour.
- **Shapes:** street geometry clipped to a stretch and drawn as a box instead of a line. District → Neighbourhood is a label change only.
- **Approximate pins:** a street with no OSM line becomes an approximate pin, as today.
- **Plans:** a stop can already be a shape, so nothing changes.
- **Icons:** Area's fountain or square idea moves to **Square**, which fits it better. Neighbourhood keeps the city blocks; street keeps the walker. This also settles the area-vs-district icon clash.
- **Data:** a one-time migration through the Supabase MCP. Fetching the 6 new outlines and stretches needs live OpenStreetMap, which only works in the owner's browser (the `tools/` page).


## Revision 1 (owner feedback, 2026-10-16)

Owner, verbatim: "i think sight is different from attraction -- think mountain vs theme park. though i guess that would be nature. which makes me think sight is still wrong and attraction is actually better. the other thing is that bars and music should be two separate things -- bars and venues. if a bar has music, that is different from a venue that is primarily music that may or may not be a bar if that makes sense? maybe it doesnt pressure test the thinking"

**Attraction stays.** Pressure test: a mountain is Nature. What's left in Attraction is things *made* to be visited: museums, landmarks, castles, galleries, murals, Tivoli, Gröna Lund, the swan boats. "Sight" fails for the rides (you do them, you don't look at them). "Attraction" covers both. One flag: 23 of the 62 are museums or galleries. If the list ever feels like a junk drawer, Museum is the natural split. Not proposed now.

**Bar and Venue split.** The owner's test, verbatim: "the venue differentiator in my head is if i'd go there if there wasn't a show happening". If you wouldn't go without a show, it's a Venue. If you'd go anyway, it's a Bar, an Attraction or Nature, whatever it is without the show. The test holds on the data:

| Place | Without a show? | Moves to |
|---|---|---|
| Jazzhouse, Jazzhus Montmartre, VEGA (Copenhagen) | wouldn't go | Bar → Venue |
| Debaser Nova, Debaser Strand, Fasching, Nalen, Slaktkyrkan (Stockholm) | wouldn't go | Bar → Venue |
| Greek Theatre (LA), Konserthuset (Stockholm), Øksnehallen (Copenhagen) | wouldn't go | Attraction → Venue |
| Harpa (Reykjavík) | would go, for the building | stays Attraction |
| Folkets Park (Malmö) | would go, it's a park | stays Attraction (or Nature) |
| WarPigs, Covell, Tiki-ti, Metro bar | would go, for the drink | stay Bar |

The owner knows these places, so any row can flip on his call. The test decides it, not the place's name.

## Revision 2 (owner answers, 2026-10-16)

- **Museums & galleries split out of Attraction** (owner: "i like museums + galleries or museum/gallery or something similar (not all galleries are museums)"). Working name: **Museums & galleries**. It takes 23 places:
  - Copenhagen: Designmuseum Danmark, Danish Architecture Center BLOX, Galleri Bo Bjerggaard, Nils Stærk, V1 Gallery
  - LA: Hammer Museum, Photo Booth Museum, The Broad, Shepard Fairey Exhibit
  - Malmö: Moderna Museet Malmö
  - Reykjavík: Ásmundarsafn, Hafnarhús, Icelandic Punk Museum, Kjarvalsstaðir, Reykjavík Maritime Museum
  - Stockholm: ABBA Museum, ArkDes, Fotografiska, Moderna Museet, Spårvägsmuseet, Spritmuseum, Scenkonstmuseet, Vasa Museum

  Attraction keeps landmarks, castles, rides, murals and tours.
- **Square: its own category.** Decided.
- **Street length.** 600m is about a 7–8 minute walk. Proposal: a street under about 1.5km (a 20-minute walk) is saved whole. A longer one is trimmed to about 1.5km around where you searched, with handles to stretch it. For scale: Jægersborggade is roughly 300m long, so it's always saved whole.
- **Pools and natural spots** (owner: "nature if it's natural; pools if it's like a city pool should be closer to attraction"):
  - Laugardalslaug and Sundhöllin are city pools → Attraction.
  - Gunnuhver and the Bridge Between Continents are natural → stay Nature.
  - Reykjanesviti is a lighthouse in the landscape. It's built, so by the rule → Attraction. The owner can flip it.

## Revision 3: Sight and Attraction (2026-10-16)

Owner, verbatim: "i do wonder if there should be sight vs attraction -- an attraction usually costs money and has thinigs to do and i wouldnt necessarily think of a mural as an attraction"

**Pressure test: it holds.** The rule: a **Sight** you look at, usually from outside, free, for a few minutes. An **Attraction** you go into and do something, usually with a ticket. Once museums, venues and streets have moved out, the 32 places left split about evenly:

| Sight (look at it) | Attraction (go in, do things) |
|---|---|
| Murals: Davidshallsgatan 10 and 24, Grynbodagatan 9, Södra Skolgatan, Stenhuggaregatan, Rentemestervej | Tivoli, Gröna Lund, Skansen, Junibacken |
| Little Mermaid, Sólfar Sun Voyager, Þúfa | Echo Park Swan Boats, Perlan, Aurora Reykjavík, Omnom factory tour |
| Turning Torso, 8 House, Harpa | Rosenborg, Christiansborg, Malmöhus Castle, Hollyhock House |
| Stockholm Public Library | Folkets Park, CopenHill |
| Reykjanesviti lighthouse | Laugardalslaug, Sundhöllin (city pools) |

**Edge cases** are places you can look at or go into (owner's call; the default is what you'd mostly do):
- Hallgrímskirkja (sight; the tower costs extra)
- Amalienborg (sight; the changing of the guard)
- Stockholm City Hall (sight from outside; attraction on a tour)
- The Philosophical Research Society (sight)
- Marshall House (it's mostly galleries, so Museums & galleries)

**Icons:** this fits the earlier note that "camera says 'sight' more than attraction". The camera goes to Sight. Attraction needs its own idea; the Nordic loop is literally the Scandinavian "sight" sign, so the team should test which of the two it belongs to.

## Decided (owner, 2026-10-16)

Square: its own category. Streets: trimmed, long enough (see Revision 2). City pools → Attraction, natural spots → Nature. District → Neighbourhood. Venue split as tabled. Attraction keeps its name; Museums & galleries splits out of it. (Revision 3 proposes a Sight split as well.)

## Still open

1. **Name:** "Museums & galleries", or something shorter?
2. **Sight split:** OK, and are the edge cases right?
