# Add tag + city control jam

## Turn 1 -- product designer (systems focus): ideas at model level, and questions for visual

The owner (verbatim, `owner.md`): "today doesnt show one city at a time,
the filter panel just takes you to that city. it doesnt "hide" the other
things if i scroll over does it? if it does im not sure if i like that"
· "i think the "type" should be a select in the tag" · "im still no sure
how the city thing works in the tag here. i thin it would be better for
us to jam in a design canvas".

**The fact:** it does hide. Picking a city frames the map **and**
filters both the map and the list to that city (`setActiveCity()` sets
`filters.city`). So the owner's surprise is the finding: today's one
control does two jobs, and the owner wants them apart. Jobs in
`jobs.md`.

### Ideas (model level; how they look is visual's)

**The city in the tag (jobs 1-5).** The city has three states, and the
tag should make each one readable:
1. **Same:** the city is the real town (Sundhöllin → Reykjavík). Said
   once.
2. **Different:** filed under one, really in another (the Blue Lagoon →
   Reykjavík, in Grindavík). Both shown, plainly different roles.
3. **New:** no city within reach (Jönköping), so ADD will make
   "Jönköping". Visibly new before ADD.

Changing it reuses round 10b's path: the city is tappable, and your
cities print as rows plus "New city…". The pin never moves. The new-city
question goes.

**TYPE (job 6).** The closed tag shows one line: TYPE plus the picked
type's word (and, if visual wants, its pin). It opens to the full list,
icons allowed there. The pin above the tag still changes with the pick.
Round 10's row of pins goes (the owner).

**Star and visited (jobs 7-9).** Round 10's stub already has ADD | STAR
| MARK VISITED. The model change is small: visited is saved at insert
(today hard-coded false). Both are toggles until ADD.

**The city control (jobs 10-14): split it in two.**
- **Go to** (common): a list of your cities; a tap frames the map. It's
  navigation only, like a bookmark. It filters nothing, and the list
  keeps everything.
- **Show/hide** (rarer): a filter, the same kind of thing as the
  category chips, so **(we think)** it lives beside them, not beside
  go-to. Default all shown; any subset hidden; it persists.
- **(We think) two edge rules, owner to confirm:**
  - going to a hidden city shows it again (otherwise you fly to an empty
    map);
  - adding a place into a hidden city shows that city (otherwise the new
    place vanishes on ADD).
- **The list** holds every shown city's matching places. Its title can't
  be "Reykjavík list" any more (it isn't). **(We think)** going to a
  city may re-order the list to put that city first, which changes order
  but never membership.
- **Plans:** unchanged; a plan's stops still show even in a hidden city.

### Open questions for the visual designer

1. **Both truths in the address line:** how "filed under Reykjavík" and
   "in Grindavík" read without either looking like the other, at
   address-line size. Also how "new city" reads.
2. **The city as a control:** round 10b's tappable word with an
   underline, or something else. (Round 12 removed the underline;
   round 10b kept a tap.)
3. **TYPE closed:** word only, or word plus pin? **Open:** icons in the
   options or not (the owner: "may be helpful")?
4. **Go to:** where it lives, and how it lists cities (with place
   counts, nearest first?).
5. **Show/hide:** beside the category chips in the filter panel, or its
   own spot? How a hidden city reads in the go-to list.
6. **The list's title** once it holds several cities.
7. **The design system:** the owner asked for one "if not". One exists
   (Triplet, https://claude.ai/artifact/JXWsMZs32JyKdcEzakKrPW); the
   canvas is https://claude.ai/artifact/6aSGgGczYGfWGP1UqTDGP3.

NEXT: visual designer — the tag's city states and TYPE select on the
canvas, plus a first sketch of go-to vs. show/hide.

## Turn 2 -- product designer (visual focus): the canvas, and answers to Turn 1's questions

**Canvas:** https://claude.ai/artifact/6aSGgGczYGfWGP1UqTDGP3. It's built
on the Triplet design system (installed on the canvas), with 11 artboards
at phone size (390x844), in three rows. Stickies carry the open
questions. These are options to react to, not final work; taste calls
are marked **(we think)**.

**Row 1, the city on the add tag:**
- same;
- different;
- new;
- changing it;
- two other ways.

**Row 2:**
- TYPE closed;
- TYPE open, with icons;
- star + visited at add.

**Row 3, the city control, three directions:**
1. a "Go to" menu under the list title;
2. the list in city sections;
3. city labels on the zoomed-out map.

### Answers to systems' questions

1. **Both truths.**
   - The filed city gets **its own CITY row, a select drawn exactly like
     TYPE's** (a label, a chip with the value in pencil, a chevron), so
     the tag's two filing choices look alike.
   - The address line stays the address ("Norðurljósavegur 9 ·
     Grindavík").
   - When the real town differs, it prints quietly at the right of the
     CITY row, as "in Grindavík" in `ink-2`. That's print, not a control.
   - When they're the same, it's said once (just "Reykjavík").
   - A new city carries a small **NEW CITY** mark in
     `brand-orange-deep` caps until ADD.
   - **(We think)** a fixed row beats the earlier tappable word: the tag
     never changes height between the three states (the owner: "controls
     don't move or grow").
   - Two other ways are on the last board of row 1, for the owner to
     react to:
     - **A:** a routing label, "FILED UNDER / REYKJAVÍK", printed like a
       baggage tag's destination;
     - **B:** one address line ending "→ Reykjavík ⌄".
2. **The city as a control: a select chip, not an underlined word.**
   - Tapping it prints the cities as rows over the tag's lower half:
     - the guess first, with its reason ("nearest · 47 km"; we think only
       the guess shows a distance);
     - then the other cities;
     - then "+ New city · Grindavík, from the address".
   - The pin never moves.
3. **TYPE closed: the type's badge plus its word,** in a chip like CITY.
   - The pin above the tag follows the pick.
   - **Icons in the open list: (we think) yes.** The glyph is how a type
     is recognised on the map, and the word always sits beside it.
   - The list is drawn like the sort menu (paper-raised, a navy 2px
     printed offset). The picked type is a navy row, and it scrolls past
     9 rows.
4. **Go to: three directions that differ in kind.**
   - **1, a menu.** The list title becomes a button ("ALL PLACES (202)
     ⌄") that opens "Go to": the cities, nearest first, with counts.
   - **2, the list.** The list runs in city sections. A section heading
     is go-to (tap it and the map frames that city) and carries its own
     "Hide".
   - **3, the map.** At a wide zoom each city is one printed label
     ("REYKJAVÍK 23"). Tap it to go there; a "fit all my cities" button
     sits under the zoom.
5. **Show/hide.**
   - In 1 and 3, **(we think)** city chips in the filter panel, beside
     the category chips (it's a filter, like categories).
   - In 2, it's on the section heading. Hidden cities collect in one
     "Hidden: Malmö · Show" line at the list's end.
   - A hidden city reads greyed in a go-to list. Going to it shows it
     again (systems' edge rule, owner to confirm).
6. **The list's title:** "ALL PLACES (202)" **(we think)**. It always
   names what the list holds, and changes only when cities are hidden
   ("PLACES · 4 CITIES (190)" is an alternative; open).
7. **The design system:** Triplet exists and is installed on the canvas.
   No new one is needed. The icon revision (another session) will
   restyle the badges.

**Not done:** the pencil grain and the paper texture are left out of the
canvas drawings (sketch fidelity), and the account badge is drawn as a
plain circle.

NEXT: the owner reacts on the canvas. Then systems checks the picked
direction against jobs 1-14.

## Turn 3 -- product designer (systems focus): what to call the bucket ("trip" vs. "city")

The owner, on the canvas's CITY row (verbatim): "maybe instead of city
we refer to *this* level as trip? run that idea by the team -- the pro
is that it would clarify this situation, but the con is that usually it
*will* be a city".

**What's being named:** only the bucket a place is filed under. Trips as
a grouping were dropped ("drop"). The bucket is usually the real city
(Sundhöllin → Reykjavík), and sometimes not (the Blue Lagoon → Reykjavík,
really in Grindavík; a "Golden Circle" bucket).

**The owner's own words for it:**
- "the city is more of a bucket than an actual city";
- "the copenhagen part of the trip" / "im going to LA";
- "sometimes that's the whole of the trip, sometimes that's part of a
  larger trip";
- "navigate around to my cities with stops".
- Earlier, "trip" meant the bigger thing: "scandinavia 2026 may include
  spots in copenhagen, stockholm, reykjavik".

### The names, weighed

| | Add tag | Filter | Go to | List title | Repeat visit (Copenhagen 2026 and 2028) | Clash with earlier "trip" |
|---|---|---|---|---|---|---|
| **City** (today) | "CITY Reykjavík · in Grindavík": the odd case reads as two cities, but the "in Grindavík" print carries the difference | "Show/hide cities": plain | "Go to a city": plain | "All places", unchanged | One Copenhagen: right | None |
| **Trip** | "TRIP Reykjavík" for a café in Reykjavík reads strangely, because most buckets are a city | "Hide trips" sounds like hiding history, not an area | "Go to a trip" is odd for a place on a map | unchanged | **Breaks:** one "Copenhagen" bucket would be called one trip, though the owner takes it twice. The owner's rule says a repeat visit doesn't change the pins, so the app can't make "Copenhagen 2028" a second trip | **Strong:** "Scandinavia 2026" (the owner's trip) holds several of these, so a trip would contain trips |
| **Area** ("Reykjavík area") | "AREA Reykjavík · in Grindavík": honest for both cases | "Show/hide areas": fine | "Go to an area": fine | unchanged | One area: right | None |
| **Base** (where you head out from) | Fits the Blue Lagoon and "im going to LA" | "Hide bases": odd | fine | unchanged | One base: right | It implies a hotel. That collides with the parked stays idea (Q3, Q4), and a day-trip bucket like "Golden Circle" isn't one |

### What we think

- **Trip is clearly the weakest.** It fixes the Blue Lagoon's label but
  breaks the two things the owner already decided:
  - a repeat visit doesn't change the pins, so one Copenhagen can't be
    two "trips";
  - "trip" in the owner's own example (Scandinavia 2026) is the bigger,
    multi-city thing. Calling the bucket a trip would block that word if
    the owner ever wants trips back.
- **City is the best word (we think),** because "usually it *will* be a
  city", as the owner says.
  - The odd case is already handled by both truths: the bucket prints
    "Reykjavík" and the real town prints "in Grindavík".
  - The problem in the comment is that a label says "City" above a value
    that isn't one, not the word itself.
- **Area is the honest runner-up (we think)** if the owner wants the
  word itself to cover the odd case. Its cost is that it's a little
  vaguer for the 90% of places that are just in their city.
- **An idea for visual, not a rule:** the tag's CITY row could drop its
  label and show only the value ("Reykjavík ⌄ · in Grindavík"), the way
  an address doesn't label its city. Then the tag never has to pick a
  word, and "city" stays for the filter and go-to, where it's always
  right.

NEXT: director — score the naming; then the owner picks City (we
think), Area, or the label-free row.
