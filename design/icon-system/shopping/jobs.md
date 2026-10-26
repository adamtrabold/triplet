# Shopping icon: the user's jobs

Product designer (systems), 2026-10-26, jam turn 1. Written from the owner's words (`../briefs/shopping-concepts.md`) and the app as it is on this branch (`index.html`), before any concept. Jobs marked *(inferred)* are mine, not his.

## Where the icon appears, and at what size

Measured from `index.html` (`badgeHtml()`, `glyphHtml()`, `markerIcon()`):

| Surface | Badge | The glyph itself | Ink | When it shows |
|---|---|---|---|---|
| Map pin, near zoom (≥ `GLYPH_MIN_ZOOM` 12) | 24px ring, 2px rim, paper field | **18px** | lavender `#8A7AA8` (3.26:1, the lowest-contrast category ink) on paper `#F2EBDD` | unvisited places only; a visited pin is the sticker with a check, no glyph |
| Map pin, selected | 32px, ink field | **24px**, paper on lavender | reversed | only until its tag opens; then the pin is the orange close disc |
| Map pin, far zoom (< 12) | 16px ring | none | | the ring and its colour only |
| Pin half under a cluster | ring | hidden | | |
| List row (Places and Plans) | 24px ring | **18px** | lavender | every row, visited or not |
| Filter chip | none, bare glyph | **12px** | chip ink | always, in the filters panel *(inferred: the brief names 24 and 72 only; 12 is a real size in the app)* |
| The Hanging Tag | | none: Type is a rubber-stamped word | | |

So "24 in the badge" means an 18px drawing inside a 24px ring. The 72px view is for judging construction; nobody uses the icon at 72.

## Beside what

- **On the map:** the other ten pin glyphs, each in its own ink, plus visited stickers, orange clusters, stars on shoulders, plan numbers. At a glance, at 18px, often several shops side by side in one street.
- **Frequency** *(inferred, from `../categories.md`)*: Shopping is the largest category, 49 of 183 pins (27%). It is the mark the map repeats most. In a shopping street it will be most of what you see. The bag of the last rounds was the darkest mark in the set; the most-repeated mark should not be the heaviest.
- **The six fixed points:** café cup, bar coupe, museum, tree, +, star. It must sit beside them in weight, size and method.

## What it must be told apart from

- **Café's cup.** Both have a "handle", and the settled rule makes them the same root (a ring). The cup's handle is on its side; anything with a handle on top must not read as a cup turned, and the two must differ in silhouette before the handle is noticed.
- **Restaurant, Bar, Venue, Hotel, Museum, Landmark, Attraction, Park, Nature.** Any building silhouette (shopfront) competes with Museum and Landmark; any paper (receipt, ticket) competes with Venue (already noted: "a receipt beside Shopping").
- **UI meanings people already carry:** a padlock (the round-handled bag read as one), a briefcase (work), a bell (notifications), a gift (a present), a cart (online checkout), a price tag (and in this app, the Hanging Tag itself: a tag icon would also mean "the place's tag"), a wallet (expenses).

## What the person is doing when they look for it

1. **Scanning the map in a neighbourhood with a free hour** ("is there anything to browse near here?"). Reads a cluster of 18px glyphs, without the legend, without a label, and picks the shops out by shape before colour (lavender is the weakest ink). This is the main job.
2. **Filtering for just these** (the category test: "would I ever filter for just these?"). Finds the Shopping chip among eleven at 12px, taps it, and sees only shops.
3. **Recognising a saved place in a list row** ("that's the record shop"). The glyph confirms the kind before the name is read.
4. **Walking a shopping street** *(inferred)*: Klapparstígur, Jægersborggade, Sankt Eriksgatan. Many shop pins close together; the mark must stay quiet in a crowd and still be countable.
5. **What am I doing there?** (the category test): browsing and buying in a shop or at a market stall, on a trip. What's saved: records, ceramics, books, design (Svenskt Tenn), vintage, a farmers' market, Hornstulls Marknad (`../icon-concepts/jam.md`, the 2026-10-16 inventory). Something comes home with you.

## What the icon must also do for the system (the owner's words)

6. **Look like the system by the decisions that made it** ("a bag should look like this system by the decisions it took to make the bag…the brand should be built into the root calls"): roots joined or cut, proportions from a parent root, holes as root shapes, the machined rule, nothing under 1.5px, counters as shapes.
7. **Pass the three brand filters:** plain (signs and tags), made by a tool, left of centre ("the bar coupe is one of the specifically good ones").
8. **Add to the rules, not to a catalogue** *(inferred, from "the goal of this is to establish the foundation for all future icons")*: whatever new part or join Shopping needs should become a rule every later icon gets.

## Flows (how each job is checked on a concept)

- **F1 Glance (job 1, 4):** a street of six to eight pins at 18px, Shopping mixed with Café, Restaurant, Bar, Museum; no labels. Pass: a fresh reader points to the shops, and doesn't name a padlock, bag-of-work, bell, gift or tag.
- **F2 Filter (job 2):** the eleven chips at 12px on a phone. Pass: Shopping is findable without reading the word first, and it doesn't blur into a blob.
- **F3 Row (job 3):** a list section of ten rows, three of them shops. Pass: the kind reads before the name.
- **F4 Beside the six (jobs 6-7):** at 18 in the 24 badge and at 72, beside the six. Pass: same weight, same method, and the blind read.
- **F5 Reversed (selected):** paper on lavender at 24. Pass: the counters still read.
