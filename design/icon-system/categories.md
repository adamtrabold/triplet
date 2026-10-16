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

## Questions only the owner can answer

1. **Square:** its own pin category, or fold squares into Attraction?
2. **Street box:** a stretch you trim when adding, about 600m by default. OK?
4. **Pools and hot springs** (Laugardalslaug, Sundhöllin, Gunnuhver): stay in Nature, or get their own category?
5. **Names:** "District" → "Neighbourhood". Yes or no? (Attraction stays.)
6. **The Venue table:** any place the "would I go without a show?" test puts in the wrong bucket?
