# Batch 2: the user's jobs for the eight icons

Product designer (systems), 2026-11-02, jam turn 1. Written from the owner's words (`../briefs/batch2-loop.md`, `../categories.md`) and the app as it is (`index.html`), before reading anyone's ideas for this batch. Jobs marked *(inferred)* are mine, not his. Shopping's full write-up from its own loop is `../shopping/jobs.md`; it still holds, and is summarised here so all eight sit in one place.

## Where these icons appear, and at what size (all eight)

Measured from `index.html` (`badgeHtml()`, `glyphHtml()`, `planLead()`, the filter chips).

| Surface | Pins (Landmark, Attraction, Venue, Hotel, Shopping, Park) | Shapes (Neighbourhood, Street) |
|---|---|---|
| Map, near zoom (≥ 12) | **18** in the 24 ring, unvisited only (visited = the sticker's check, no glyph) | **never**: a shape is its outline on the map; an open tag hangs from a small anchor dot |
| Map, selected | **24** in the 32 ring, until its tag opens (then the orange close disc) | never |
| Map, far zoom (< 12) | the 16 ring and its ink, no glyph | never |
| Map, plan stop | a number in the ring, no glyph | a numbered diamond, no glyph |
| List row (Places and Plans) | **18** in the 24 ring, every row, beside the name | **18** in the 24 **diamond**, every row, beside the name |
| Filter chip | **12**, bare, beside the word | **12**, bare (no diamond), beside the word |
| The Hanging Tag | none (Type is a stamped word) | none |

Two facts fall out of this table that shape everything below:

1. **The shape icons are never seen on the map.** They live only beside a name (rows) or a word (chips). Their job is not "find it among pins at a glance"; it is "this row is an area / a stretch, not a place", and "which of the two". The diamond already says "a shape", so the glyph only has to tell Neighbourhood from Street, and still do it bare at 12 where the diamond is gone. *(Inferred consequence: they can afford to be more diagrammatic than the pins; they cannot afford to depend on the diamond.)*
2. **The pin icons do their hardest work on the map, unlabelled, in a crowd, in one ink each.** Several inks are not yet set (Venue, Museum, Landmark, Park have no colour in `CATEGORY_COLORS` yet; Park and Attraction may land near the Nature greens). So every pin glyph must read **by shape before colour**.

## How often each one is seen *(from the locked tally in `../categories.md`)*

| Category | Pins / shapes | What that means for the mark |
|---|---|---|
| Shopping | 49 (27% of pins) | the most-repeated mark; it must be quiet in a crowd and the lightest-feeling, never the heaviest |
| Landmark | 23 | the second most common; often in old-town clusters next to Museum and Attraction |
| Attraction | 15 | |
| Venue | 11 | |
| Park | 9 | |
| Hotel | 0 today | *(inferred)* about one per city per trip; the one pin you navigate back to at night |
| Neighbourhood | ~10 shapes after migration | rows and chips only |
| Street | ~10 shapes after migration | rows and chips only |

## The approved set they sit beside

Café cup and saucer, Bar coupe, Museum column front, Nature conifer, Restaurant fork and knife, star, +. The eight must match them in weight, size and method (`../grid/THE-SYSTEM.md`) and be told apart from every one of them.

---

## Landmark

**Means:** a notable place to see, notable because of people: buildings, monuments, public art and murals, squares (Hallgrímskirkja, Harpa, Sun Voyager, the Little Mermaid, Turning Torso, Malmö's murals, Lilla Torg).

**What the person is doing when they look for it:**
1. Walking an old town with an hour and asking "what's worth seeing on the way?" Scans the map at 18, unlabelled, among Museum, Attraction, Café and Shopping pins. The main job.
2. "What am I doing there?": **looking**, mostly from outside, usually free, for a few minutes, often taking a photo, then moving on. You don't go in and you don't stay. *(The look-don't-do line is the owner's own Sight/Attraction split, Revision 3 of the categories.)*
3. Filtering for just these on a first afternoon in a city ("show me the sights") *(inferred)*.
4. Recognising a row in the list ("that's the mural").

**Must be told apart from:** **Museum** (the closest: any building front is Museum's, and the column front is approved); **Attraction** (look vs do); **Nature** (the owner's line: a landmark matters because of people, Nature matters as itself); Park; the Street/Neighbourhood shapes (squares used to be areas). UI meanings: the ⌘ key (the Nordic loop's reading in the one-shot), a location pin, a camera ("camera says sight"), a trophy or podium, a flag (report).

**Hard part for the system:** it's the broadest pin (a church, a mural and a square share it). The mark has to stand for the act (looking at something notable), because no single object covers them.

## Attraction

**Means:** going in to do things, usually with a ticket: rides, castles, tours, city pools, botanical gardens (Tivoli, Gröna Lund, Skansen, Rosenborg, Perlan, the swan boats, Laugardalslaug).

**Doing when they look for it:**
1. Planning a half-day or a rainy afternoon: "what can we actually do?" Often with the kid *(the owner's kid quote is about parks, the inference that it carries here is mine)*. Filters for just these, or scans a city at 18.
2. "What am I doing there?": **going in**, paying, staying a while, doing something.
3. Recognising a row.

**Must be told apart from:** **Landmark** (do vs look); **Venue** (a ticket too, but for a show at a time); **Museum** (go in too, but to look); **Park** (free, outside, hang out); Nature. UI meanings: settings (a gear or a wheel with spokes), a loading spinner, a steering wheel, a compass, a sun.

**Hard part:** like Landmark, the category is a mixed bag (a castle, a pool, a ride). It holds because of the act (going in to do), not the object.

## Venue

**Means:** seeing a show. You'd only go if there's a show on (the owner: "if i'd go there if there wasn't a show happening"). 8 of the 11 are music (Jazzhus Montmartre, VEGA, Debaser, Fasching, Nalen), 3 are halls (Greek Theatre, Konserthuset, Øksnehallen).

**Doing when they look for it:**
1. Evening: "is anything on tonight near us?" Filters for just these, then checks listings outside the app *(inferred)*. This is the main job, and it's time-bound in a way no other category is.
2. "What am I doing there?": **watching a show**, at a set time, with a ticket.
3. Recognising a row.

**Must be told apart from:** **Bar** (the coupe; a music bar is a Bar, and the split was hard-won, so the two marks must not share any drinking or music-in-a-glass cue); **Attraction** (tickets); Hotel (a curtain reads as a bedroom window); Museum. UI meanings: the microphone (voice input), play/pause, a speaker (volume), a music note (a music app), a ticket (bookings, coupons).

## Hotel

**Means:** sleeping.

**Doing when they look for it:**
1. *(Inferred, the main job)* **Getting home.** Late, tired, maybe with a sleeping kid: "where's the hotel from here?" Usually one per city, so the person is looking for exactly one mark, not scanning a class. It must be the easiest single pin in the set to spot, by shape, from anywhere on the screen.
2. Choosing what's near the hotel for tomorrow morning *(inferred)*.
3. Recognising a row.

**Must be told apart from:** Shopping (the bag and the bed were the two 9s; neither may borrow the other's slab body), Venue (a curtain = a room), Park (a bench and a bed are both slabs on legs: the strongest risk in the set), Museum. UI meanings: a bed is unambiguous; a key (login, lock), a bell (notifications), a moon (dark mode) are not.

## Shopping (summary; full text `../shopping/jobs.md`)

**Means:** browsing and buying in a shop or at a market stall: records, ceramics, books, design, vintage, a market. Something comes home with you.

**Doing:** scanning a neighbourhood with a free hour for "anything to browse?"; walking a shopping street where most pins are shops; filtering for just these; recognising a row.

**Must be told apart from:** the café cup (both handled; the settled rule makes the handle a ring); Venue and the Hanging Tag (any paper: receipt, ticket, price tag); Museum and Landmark (any shopfront). UI meanings: padlock, briefcase, bell, gift, cart and basket (online checkout), price tag, wallet.

**Its special job:** the most-repeated mark, in the weakest ink (lavender 3.26:1). Quiet in a crowd, still countable.

## Park

**Means:** a city park, where you hang out outside in town (Griffith Park, Slottsparken, Humlegården, Superkilen, Assistens Cemetery, Folkets Park).

**Doing when they look for it:**
1. "**What if im with my kid and i just want to see what parks i marked**" (the owner, verbatim). Filters for just these. The owner's own example, so the main job: a parent, mid-day, needing somewhere outside to stop.
2. "What am I doing there?": **hanging out** outside: sitting, playing, a picnic, a walk round. Free, no ticket, no time.
3. Scanning the map for green space near a café *(inferred)*.

**Must be told apart from:** **Nature** (the conifer is approved and takes "tree": the owner's line is that "Park" means in town, Nature means getting into the natural world; a second tree is the obvious answer and the riskiest); **Hotel** (a bench and a bed); Neighbourhood; Attraction (botanical gardens are Attraction). UI meanings: a bench reads plainly; a kite collides with the shapes' diamond; a sun (weather).

## Neighbourhood (a shape)

**Means:** a part of town worth wandering, drawn on the map as its outline (Christiania, Nyboder, Gamla Stan, Södermalm areas, Grandi).

**Doing when they look for it:**
1. In the list: "which of these rows are areas to wander, not single places?" Reads the diamond, then the glyph, beside the name.
2. Filtering for just these on a first morning: "which parts of town did I mark?" *(inferred)*.
3. "What am I doing there?": **wandering around inside** something, without a single destination.

**Must be told apart from:** **Street** above all (the only other shape; same diamond, same list); Landmark (squares used to live with areas); Museum (any building). UI meanings: a grid (a layout or table view: the city blocks read as a waffle, 6 in one-shot 2), a home (one house), a puzzle piece (plugins), a map.

## Street (a shape)

**Means:** a street worth walking, saved as a box around the stretch you care about, because "interesting places on streets are close together" (Jægersborggade, Laugavegur, Skólavörðustígur, Bondegatan, Sankt Eriksgatan).

**Doing when they look for it:**
1. In the list: "this row is a stretch to walk along".
2. Filtering for just these: "which streets did I save?" *(inferred)*.
3. "What am I doing there?": **walking along** something from one end to the other, stopping as you go.

**Must be told apart from:** **Neighbourhood** (inside vs along); the walker's own UI meanings (walking directions in every maps app; the person/account icon; an "i"/info, which is what the one-shot's walker read as); a road (driving); the map city signposts (add-tag-jam phase 4, a signpost on the map). The app's Directions control uses a compass, so a person or arrow must not look like a Directions action.

---

## Jobs for the family (all eight together)

- **J-F1 Read by shape before colour** on the map at 18: six new pin marks among the approved five, inks not all set.
- **J-F2 One meaning per cue across the set** *(inferred)*: a ticket, a person, a building front, a tree, a slab-on-legs, a ring with spokes can each belong to one icon only. Today the risks are: building front (Museum vs Landmark vs Neighbourhood), slab on legs (Park bench vs Hotel bed), ring and spokes (Attraction vs settings), paper (Venue vs Shopping vs the Tag), tree (Nature vs Park), person (Street, and any scale figure).
- **J-F3 Look like the system by the decisions that made it** (the owner: "the system should be EVER PRESENT"; "dont be defining shit based on singular icons"): each concept is a declaration through `grid/src/system*.js`; anything new it needs becomes a general rule.
- **J-F4 Pass the brand filters:** plain (signs and tags), made by a tool, left of centre (personality from the subject chosen: the coupe over the wine glass).
- **J-F5 The shape pair reads as a pair** *(inferred)*: Neighbourhood and Street are the only two in the diamond and the only two never on the map; they should be visibly one family, told apart by one clear difference (inside vs along).

## Flows (how each job is checked on a concept)

- **F1 Old-town glance (Landmark, Attraction, Shopping, Venue):** a 390px map strip at z14-15, eight to ten pins at 18, the approved five mixed in, inks as proposed, no labels. Pass: a fresh reader names each new pin's kind or its act, and names none of the UI meanings listed above.
- **F2 Getting home (Hotel):** one Hotel among thirty pins at z13. Pass: found first, by shape.
- **F3 With my kid (Park):** the chip row at 12; tap Park; the map shows only Park pins. Pass: the chip glyph reads as Park without the word, and isn't confused with Nature beside it.
- **F4 Tonight (Venue):** the chip at 12, then a row list of Venue and Bar rows mixed. Pass: the two never get mixed up.
- **F5 The list (all eight):** a city section of twelve rows, shapes and pins mixed. Pass: every row's kind reads before its name; the two shapes read as shapes, and as each other's pair.
- **F6 Bare at 12 (all eight):** the chip row. Pass: each still itself; the shapes still told apart with no diamond.
- **F7 Beside the set:** 18 in the 24 ring (diamond for shapes) and 24 in the 32, beside the approved five, plus star and +. Pass: same weight, same method, and the director's blind read.
- **F8 Reversed:** paper on ink at 24 (the selected pin). Pass: counters still read.
