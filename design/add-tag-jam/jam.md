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

## Turn 4 -- design director: naming the bucket

The owner: "maybe instead of city we refer to *this* level as trip? …
the pro is that it would clarify this situation, but the con is that
usually it *will* be a city".

- **Trip: we think no.** It clears up the Blue Lagoon's label, but it
  clashes with two things the owner already set:
  - a repeat visit keeps one Copenhagen, so it can't be two trips;
  - in the owner's own example, "trip" is the bigger thing (Scandinavia
    2026).
  It would also say "trip" on the 90% of places that are simply in their
  city.
- **Our pick: the label-free row (we think).** The tag shows just
  "Reykjavík ⌄ · in Grindavík", the way an address never labels its
  city.
  - That gets the owner's pro (no label claiming the Blue Lagoon is in
    the city Reykjavík) without the con.
  - "City" stays where it's always true: the filter, go-to, and the
    city list.
- **If the owner wants a word on the tag:** "City" (we think, since it
  usually is one) beats "Area". The "in Grindavík" print already
  carries the odd case.

**The owner's choice:** a label-free row (our pick), "City", or "Area".
"Trip" is not recommended, for the reasons above.

NEXT: the owner picks; then visual applies it on the canvas.

## Turn 5 -- product designer (systems focus): Plans with the Go-to menu

The owner, on "Go to 1: menu under the list title" (verbatim): "hmm i
hadnt considered changing the ui for selecting a city. maybe this is
better than having the filter panel chips -- certainly clearer from a ux
perspective. how do plans work here?"

### Today in Plans (checked in `index.html`)

- **The switch:** Places | Plans, in the filter panel.
- **The list title** is the open plan's name, which is also the plan
  picker. It isn't a city: `updateUI()` prints `activePlan().name`, and
  "Plans" with none open.
- **The list:** the plan's stops, numbered, **always all of them,
  whatever the filters say**. After them come the other places the
  filters match, each with a + to add (`planOthers()`).
- **The city chip already does double duty in Plans** (`frameActivePlan()`):
  - With the panel closed ("following"), it frames that city's stops.
    The code calls it "which leg am I on".
  - With the panel open ("building"), it frames the stops plus the
    candidates.
  - It also narrows the + candidates to that city, because it's a
    filter.

### The model with Go-to and show/hide

1. **Two questions in Plans, kept apart:**
   - *which plan*: the plan picker. It stays the list title, as today.
   - *where in it*: Go-to.
2. **Go-to in Plans lists the plan's cities first** (we think):
   - "Whole plan" first, which frames every stop;
   - then the cities that have stops, **in stop order** (Reykjavík →
     Copenhagen → Malmö), each with its stop count;
   - then your other cities, so you can reach a city with no stops yet
     while building.
   - A tap frames that city's stops, or its places if it has none. This
     is today's "which leg am I on", now said plainly. It moves the map
     only.
3. **Go-to never filters, in Plans either.** The + candidates are no
   longer narrowed to the city you went to. They're every place in the
   **shown** cities that matches the categories, not already a stop.
   - **(We think)** they're ordered nearest to where you went first,
     which changes order but never membership.
4. **Show/hide never hides a stop.** A plan's stops always show, as
   today. Hiding Malmö removes Malmö's + candidates, and its other
   places, but a Malmö stop stays in the plan, numbered, on the map and
   in the list.
   - In Go-to, a hidden city that holds stops still lists in the plan
     section.
5. **Plans can span cities, unchanged.** A stop is a place, and the
   place keeps its own city. Nothing about a plan is per-city.

**Where Go-to sits in Plans** (the title is taken by the plan picker) is
visual's call. Two ways to read it:
- **(we think)** a second, smaller Go-to beside the plan's name;
- or the same Go-to button in the same spot in both views, with the
  plan picker moved.

NEXT: director — score; visual places Go-to in Plans view on the canvas.

## Turn 6 -- product designer (systems focus): what scopes the search, if not the city row

The owner (verbatim): "this feels good, but i'm curious -- does the city
selection scope search? if so, maybe it should be treated differently and
put somewhere else. may need some divergent thought here."

**Fact (`nominatim()`, `formCityId()`):** yes, today's form city scopes
the search:
- its `geocodeSuffix` is appended to the query;
- `countrycodes` is a **hard** filter;
- `viewbox` is a soft hint;
- it widens only on zero results.

In the new tag the city is **guessed after the pick**, so it can't also
be the scope: that's circular. The city row becomes filing only, and
search needs its own answer.

### The options (they differ in kind)

| | What scopes it | Where it lives | Cost |
|---|---|---|---|
| **A. The map's view** (the blank tag's current rule, `detectCityContext()`) | the city the map shows, or the visible area | nowhere: implicit | You must look at Copenhagen before adding Tivoli; a same-name match where you are wins. As a **hard** country filter it's the Tivoli bug; soft, it's tolerable |
| **B. Worldwide, ranked by you** (round 12b, `workflows.md`) | nothing hard; results ranked: near the map → near any of your cities → the rest. An invisible local search runs alongside when nothing near lands | nowhere: no control | Two requests per pause (Nominatim's 1/s etiquette); a bare common name lists several (several Tivolis) |
| **C. B, and every result says where it is** | as B | each result row ends with its real town and country ("Tivoli · København, Denmark") | none beyond B. It makes worldwide safe: you pick by reading, not by scope |
| **D. Typing the place says where** (round 12's rule) | a city name in the text ("tivoli copenhagen") scopes to that city's area | in the NAME text: no control | Invisible, so you have to know it; best as a booster to B, not alone |
| **E. A "near" chip in the search field** | an explicit scope, pre-set to the map's view, tappable to one of your cities, "Near me" or "Anywhere" | a small chip inside or beside NAME, gone once a place is picked | One more control, and two city-ish things on one tag ("near Reykjavík", filed under Reykjavík) until the pick. It's honest and predictable |
| **F. Where you are** (device location) | the phone's position | an option in E, or automatic when you're near one of your cities | A location permission prompt; useless when planning from home, which is most adding |
| **G. The last city you used** | sticky, like today's `activeCity` | nowhere | Unpredictable after switching cities; it's today's hidden state, the thing the owner just asked about |
| **H. Search the map, not the world** | results are the OSM names inside the visible map, as you pan | the map itself: you search where you look | Precise when planning a neighbourhood, but you have to go there first; anything off-screen is unfindable |

### What we think

- **The hard country filter goes, whatever we pick.** It's what hides
  Copenhagen's Tivoli while you're looking at Iceland.
- **Strongest default: B + C + D, with no scope control (we think).**
  - Search is worldwide.
  - Results rank your own cities first.
  - Each result says where it is.
  - Typing a city in the text sharpens it.
  - It's places-first in the extreme: you type the place and read where
    each result is.
  - The search never depends on what the map shows or on a hidden
    "current city".
- **Strongest alternative: E,** the "near" chip, if the owner wants the
  scope visible and in hand. It separates "where to look" from "where to
  file", which is exactly the owner's instinct ("treated differently and
  put somewhere else").
- **The baseline to compare against: A, softened** (today's map rule
  with no hard filter). It needs no new idea; its cost is "pan first".
- **F, G and H** are weaker as defaults. F is worth keeping as one of
  E's options ("Near me").

**For visual to draw (the strongest three):**
1. **B + C:** the results list with each row's place line.
2. **E:** the "near" chip in the NAME field, before and after the pick.
3. **A softened:** the baseline.

NEXT: visual designer — draw those three on the canvas; then the owner
picks.

## Turn 7 -- product designer (systems focus): plan vs. city, simplified

The owner, on the PlansGoTo board (verbatim): "the plan vs city
selection is far too complex. let's simplify it to as few separate
actions as possible with extreme clarity between picking a plan or city
and then the "go to" sections within a plan".

**What the board has now:**
- three controls in Plans: the Places | Plans switch (filter panel), the
  plan picker (the title), and a Go to beside it;
- in Places, a Go-to title menu and show/hide chips.
- Turn 5 caused it: I kept "which plan" and "where in it" as two
  pickers. Too many.

**The model, in two questions:**
1. **What am I looking at?** Your places, or one plan. One answer at a
   time, always named in the title.
2. **Where in it?** A section of what you're looking at: a city in
   Places, a leg in a plan.

### Option 1 (we think, clearly the simpler): one picker; the list's sections are "go to"

- **The title is the one picker.** It holds "All places", then your
  plans, then "New plan". It replaces the Places | Plans switch, so
  there's no switch any more.
- **"Go to" isn't a control: it's the list's own section headings.**
  - In Places, the list runs in city sections (Turn 2's direction 2).
  - In a plan, it runs in legs, one per city in stop order ("Reykjavík ·
    3 stops", "Copenhagen · 6 stops").
  - Tap a heading and the map frames that section. That's the same
    gesture in both, and it's never a filter.
- **Show/hide cities stays in the filter panel** (it's rare, like
  categories) and never hides a plan's stops (Turn 5).
- **Separate actions:** two. Pick what (the title), go where (a
  heading). Nothing else.
- **Cost:**
  - the Places list is always grouped by city, so a sort applies within
    each city;
  - reaching a far city means scrolling to its heading. Whether headings
    pin or index is visual's call.

### Option 2: one menu for everything

- The title opens one menu with three groups:
  - *In this plan* (Whole plan, then its legs), shown only while a plan
    is open;
  - *Places* (All, then each city);
  - *Plans* (each plan, New plan).
- Picking a city shows Places, framed there. Picking a plan opens it.
  Picking a leg frames it.
- **Separate actions:** one control.
- **Cost:** "what" and "where" share one long menu, so the clarity
  between picking a plan and going inside it rests on group headings,
  not on two different gestures. It's the opposite of "extreme clarity
  between" them.

**Recommendation: Option 1.** Two kinds of action that never look
alike:
- the title picks what you're looking at;
- a section heading takes you somewhere inside it.

That's the owner's line between "picking a plan or city" and "go to
sections within a plan". "Picking a city" here means going to its
section, never filtering to it. Hiding stays in the filter panel.

NEXT: visual designer — draw Option 1 (Option 2 beside it if useful) and
answer the owner's thread 91154dfc.

## Turn 8 -- product designer (systems focus): places and plans are two kinds of thing

The owner, on PlanCity1 (verbatim): "no you are not thinking deep
enough. think about the model. there are places and there are plans.
there may be a bunch of both. they dont make sense in the same list so
there either needs to be a different view or a different button for
plans vs places".

**The owner is right, and Turn 7 withdraws.** Its title menu put two
kinds of thing in one list.

### The model

- **Places:** a collection, many of them, grouped by city.
  - Unordered: it's sorted, never sequenced.
  - Filterable (categories, show/hide cities).
- **Plans:** a list of routes, possibly many.
  - Each plan is an *ordered* set of stops, and a stop is a place.
  - Inside a plan, its cities in stop order form **legs**.
- **Two levels in Plans, one in Places.**
  - Places is the collection itself.
  - Plans is first a list of plans, then one plan.
  - Turns 5 and 7 went wrong by flattening that second level into a
    picker.

### Today (`#listSwitch`, `setListView()`)

- The Places | Plans switch sits **inside the filter panel**, with the
  plan picker (`#planPick`) under it. So it's hidden whenever the panel
  is closed.
- Switching to Plans jumps straight into the last plan, or the first
  (`activePlan() || plans[0]`), and frames it. There's never a list of
  plans you see first.
- That's why the plan picker drifted up into the title: the real
  top-level choice was buried in a filter panel.

### Option A (we think, clearly better): two views, the switch at the top

- **Places | Plans is the top-level switch, always visible** (out of the
  filter panel). It answers "what am I looking at" by kind.
- **Places view:** the title says "Places" (with its count).
  - **Go to** = a city: the list runs in city sections, and tapping a
    heading frames that city. It moves the map only, never filters.
  - **Show/hide cities** lives in the filter panel, with categories.
- **Plans view, level 1: the plans list.** One row per plan: its name,
  its stop count, its cities.
  - Tap a row to open the plan. "New plan" is the list's last row.
  - The map frames all plans' stops, or your cities if there are none.
- **Plans view, level 2: one plan.** The title is the plan's name, with
  a back step to the plans list.
  - **Go to** = a leg: its stops run in leg sections (Reykjavík → Golden
    Circle → Copenhagen), and tapping a leg heading frames it.
  - Below the stops, the places you can add with + (as today).
- **Show/hide never hides a stop** (Turn 5). It only narrows the
  addable places.
- **Each view remembers where it was:** Places its scroll, Plans its
  open plan or the list.
- **Separate actions:** the switch (kind), a row (which plan), a
  section heading (go to). Each is a different gesture for a different
  question.

### Option B: Places is home; Plans is a button

- The app is Places. A separate **Plans** button (on the map or the
  list's edge) opens the plans list as a sheet; tapping a plan opens it
  in place of the Places list.
  - You leave the plan with ×, back to Places.
- Go-to and show/hide are the same as A.
- **Cost:**
  - plans become a mode you enter and leave, not a peer;
  - one more permanent button on a screen that already has the + and
    the account badge;
  - "am I in a plan?" rests on remembering you opened it, where A's
    switch always says so.

**Recommendation: A.** Places and plans are peers you move between
often while planning, and A shows which one you're in at all times. B
fits only if plans are rare, and the owner says "there may be a bunch of
both".

NEXT: visual designer — draw A (B beside it if useful) and answer thread
0d441a3b.

## Turn 9 -- product designer (systems focus): "near the main city", and where the switch lives

### 1. "Near the main city"

The owner (verbatim): "I'm actually having second thoughts/.. maybe we
do need some way to note this city is near the main city of the trip".
Earlier: "i dont think we need to show when it's different from the real
town".

**In the bucket model, "the main city of the trip" is the place's own
city** (Reykjavík). Trips stay dropped. The relationship is one fact:
**this place is outside its city, and this far from it.** The owner's
word is "near", not "a different town". The real town already prints in
the address line ("Norðurljósavegur 9 · Grindavík"), so naming it again
was the redundant part. The distance is the part that's missing.

**Minimal model statement (we think):**
- **When:** only when the place lies **outside its city's own area**.
  Cities carry bounds today (`CITIES[...].viewbox`), and a new city gets
  them from its first place. Names aren't compared: "København" vs.
  "Copenhagen" would misfire.
- **What:** the straight-line distance from the city's centre, rounded:
  "≈ 40 km from Reykjavík". It's derived from data the place already
  has, so nothing is stored or asked.
- **Where:** on the tag only, beside the city in R2's routing line, on
  the add tag, the edit tag and the place's Hanging Tag alike.
  - Not in list rows: the city sections already group it, and the
    row's short address names the real town.
  - Inside the city (Sundhöllin), nothing extra shows. Most tags look
    exactly as decided.

### 2. Where the Places | Plans switch lives (not always visible)

The owner (verbatim): "No i do not want it always visible".

**Option 1 (we think, better): the list title is a two-entry menu.**
- The title reads what you're looking at: "All places (202)" or "Plans"
  or a plan's name.
- Tapping it opens a menu with **exactly two entries, Places and Plans**.
  They're kinds, never items, so places and plans are never in one list
  (the rejected Turn 7).
- **Plans opens the plans list.** Tapping a plan opens it, the title
  becomes its name, and a back step returns to the plans list.
- **Go to stays where the owner liked it:** city section headers in
  Places, leg headers in a plan.
- **Cost:** the title is now a control. The collapse affordance has to
  live elsewhere (the owner already asked: "collapse shouldn't live
  somewhere else to not confuse with the dropdown select"; K2's tab).

**Option 2: keep it in the filter panel** (today), as the panel's first
row.
- Plans then shows the plans list (today it jumps straight into a plan).
- **Cost:** two steps away (open the panel, then switch), and the
  switch sits among filters though it isn't one. That's why the plan
  picker kept drifting up into the title.

**The collapse tab's area** is ruled out: the owner already chose K2 for
collapse there, and it would crowd the +.

**Recommendation: Option 1.** The title already answers "what am I
looking at", so the one tap that changes the answer belongs there.

NEXT: visual designer — the distance note in R2's routing line (outside
the city only), and the two-entry title menu with the plans list.

## Turn 10 -- product designer (systems focus): kind, then the item within it

The owner (verbatim): "Places plans is absolutely not solved I need to be
able to specify inside of either".

**The coordinator's reading is right**, and the owner's history supports
it:
- "i do like having a way to quickly center myself on a city" — picking
  a city is a first-class act;
- the Go-to menu "maybe this is better than having the filter panel
  chips" — a menu of cities;
- "they dont make sense in the same list" — kinds never mix;
- "No i do not want it always visible" — the kind switch can't be a
  standing control.

Turn 9 failed because it chose only the **kind**. The **item** (which
city, which plan) was left to scrolling headers or a second screen.

**The structure: two levels, one choice each.**
1. Kind: Places | Plans.
2. The item within it:
   - Places: All cities, or one city;
   - Plans: All plans, or one plan.

### What each choice shows

| Choice | List | Map |
|---|---|---|
| Places · All cities | every place matching the filters, in city sections | frames all your (shown) cities |
| Places · Reykjavík | **the same list** (picking a city goes there; it never hides anything; the owner: "if it does im not sure if i like that"), scrolled to Reykjavík's section | frames Reykjavík |
| Plans · All plans | the plans list: one row per plan (name, stops, cities), New plan last | frames every plan's stops |
| Plans · Golden Circle | its stops in leg sections, then the places you can add with + | frames its stops; a leg heading frames that leg |

- Picking a hidden city shows it again; hidden cities sit in the menu
  with the closed eye (the owner: "just repeat the closed eye icon").
- **(We think)** in Places the title follows the city the map shows
  (today's `detectCityContext()`: the nearest of your cities within
  reach of the map's centre), and reads "All cities" when zoomed out.
  That way it never names a city you've panned away from. Picking from
  the menu is just the fast way there.

### Option 1 (we think, better): one title, one menu, the kind toggle inside it

- The title reads both levels: "Places · Reykjavík ⌄", "Plans · Golden
  Circle ⌄".
- Tapping it opens one menu:
  - **a Places | Plans toggle at its top** (visible only here, so it's
    never always visible);
  - **below it, the items of that kind only**: All cities plus your
    cities, or All plans plus your plans plus New plan.
  - Flipping the toggle swaps the items without closing the menu.
    Picking an item closes it.
- **Taps:** any item of the same kind is one tap after opening; the
  other kind's item is two.
- Kinds never share a list: the toggle shows one kind at a time.

### Option 2: two title segments

- "Places ⌄ · Reykjavík ⌄": the first segment opens a two-entry kind
  menu, and the second opens that kind's items.
- **Cost:**
  - two controls side by side;
  - switching kind changes what the second segment holds;
  - reaching another kind's plan takes two menus.
- It's clearer only if the owner wants the kind to read as its own
  button.

**Recommendation: Option 1.** One control, read as "kind · item", answers
"what am I looking at" in full. The kind toggle exists only inside the
menu, and each kind's items are one tap away.

NEXT: visual designer — draw Option 1's title states and its menu in
both kinds (Option 2 beside it if useful).
