# Jam: trips, cities and places (concept phase)

## Turn 1 -- product designer (systems focus)

### The owner's words (verbatim, `owner.md`)

> "there are the "locations" (things you want to visit), "cities" they
> exist in, and "trips" they may be grouped to. there are also "plans"
> which may include "locations" in many "cities." i may as a user be
> starting from a few different points... i might be planning stops
> across a large trip (e.g. "scandinavia 2026" may include spots in
> copenhagen, stockholm, reykjavik, etc. and places in between). or i
> might be planning for a specific "city" within that "trip." the real
> challenge is that mentally i might be thinking of a location being
> tied to a specific "city" that it doesn't specifically reside in, and
> so when navigating the app, i may want to click "Reykjavik" as a
> filter, but also want to see, like, the Blue Lagoon or the Airport
> that technically exist within other cities in reality."

> "the usabiity model does not have to match with how we store data. the
> app should be as simple and low friction as possible, while supporting
> my specific mental model and use case as closely as possible."

> "i expect many ideas here, not a hard recommendation, unless they have
> one that is completely obvious and stands out meaningfully against the
> others."

Earlier: "I need to be able to include a place in a city that does not
match how I'm thinking about the trip which may be a city name or
something else … This is separate from filters which should have a
filter by city."

### Jobs (written from his words before reading anything else)

1. **Plan across a whole trip:** see and work with every place in
   "Scandinavia 2026" at once, across its cities.
2. **Focus on one city of a trip:** narrow to Reykjavík and plan just it.
3. **Move between the two easily** ("starting from a few different
   points"). The trip and the city are both natural starting points,
   and neither is a detour.
4. **See a place under the city I think it belongs to, even when it's
   somewhere else:** tap "Reykjavik" and see the Blue Lagoon and the
   airport.
5. **Still find places by where they really are:** "a filter by city".
6. **Group places into trips.**
7. **Plans that cross cities:** a day that starts in Malmö and ends in
   Copenhagen.
8. **Add with as little friction as possible:** no forced picking of
   city or trip.
9. *(inferred)* **Places in between** have a home: a stop en route
   ("places in between") belongs somewhere you'll find it.
10. *(inferred)* **Other trips stay out of the way:** LA doesn't clutter
    Scandinavia, and it's still there later.
11. *(inferred)* **The map matches what you're looking at:** whatever
    narrows the list narrows the map (the app's own rule).
12. *(inferred)* **Understand it at a glance:** the header always names
    what you're looking at (a trip or a city), the owner's rule "the
    header should show whatever the list is".

Not jobs: editing a place later and holding the map to place a pin (both
future, his answers).

### The structural question underneath

Every idea below is one answer to a single question: **where does "the
city I think of it with" come from?**
- A stored choice per place?
- A rule the app works out (distance, area, route)?
- A tag you can add more than one of?
- The moment you added it?
- Some other object you already have (a plan, a base)?

Real location and real city are data in every idea (stored today in
`lat/lng` and `address_details`). Trips are a container in most of them.

### Random draws (real RNG)

Fields: **watersheds / catchment areas**, **ZIP codes vs. mailing city
names**, **genealogy trees**. Oblique: **"Is there something missing?"**
and **"Change nothing and continue with immaculate consistency."**

### Ideas that differ in kind

**I1. Home city, chosen (the minimal change; "change nothing…").**
- Today's model, kept consistent: a place has one home city (today's
  `city`), which is now *your* choice rather than its geography. The
  real city is data, with a separate "real city" filter. The trip is a
  folder of home cities.
- Add: the home is pre-filled with the city you're looking at.
- This is the round-12c group/real-city idea.
- *Strength:* almost nothing new to learn.
- *Weakness:* a place lives in exactly one home. "Places in between"
  need an arbitrary home.

**I2. Also-known-as (ZIP codes: a preferred name plus acceptable
names).**
- In US mail, a ZIP has one real city and several "acceptable" names
  you can write on the envelope.
- Here, a place's real city is fixed. You can add **"also show in
  Reykjavík"**, more than one if you like. The Reykjavík filter shows
  places whose real city is Reykjavík **plus** the ones that say "also
  Reykjavík".
- The airport can be "also Reykjavík" *and* "also Keflavík".
- *Strength:* additive. Nothing is wrong by default, and you only touch
  the exceptions.
- *Weakness:* exceptions have to be added by hand; one more control on
  the tag.

**I3. Catchments (watersheds): edit the area, not the place.**
- Every city has a soft area on the map, its catchment. A place belongs
  to whichever catchment it falls in.
- The default catchment is generous: the city's area, grown to take in
  nearby places with no closer city. You can **stretch** it on the map
  to swallow the Blue Lagoon and the airport.
- Filing is never a per-place choice; it's spatial and visible.
- *Strength:* zero friction when adding; the map shows the mental
  model.
- *Weakness:* editing a shape on a phone is fiddly. Two catchments can't
  share a place unless they overlap.

**I4. Bases: "the place you go *from*" ("is there something
missing?" — yes: where you sleep).**
- What makes the Blue Lagoon "Reykjavík" is that you go there from
  Reykjavík. So a trip is an **ordered set of bases** (Copenhagen,
  Malmö, Stockholm, Reykjavík), perhaps with dates.
- Every place belongs to the base you'll visit it from: the nearest base
  by default, and you can change it. The airport belongs to the base you
  fly out of.
- "Places in between" belong to the **leg** between two bases.
- *Strength:* matches how trips actually work. Plans fall out of it
  (a day is planned from a base).
- *Weakness:* it needs the trip's bases to be set up. A city you're not
  sleeping in (Malmö as a day trip from Copenhagen?) becomes a place
  set, not a base. Mixed.

**I5. The route (genealogy turned sideways: a line, not a tree).**
- A trip is a **route**: an ordered line through cities. Places snap to
  the nearest stop or the nearest leg.
- The filter is a stretch of the route: "Reykjavík" = the Reykjavík stop
  and its spur. The list header reads like a ticket: "Scandinavia 2026 ›
  Reykjavík".
- *Strength:* "the whole trip" and "one city" are the same control at
  two zoom levels (the route vs. one stop), and in-between places have
  an obvious home.
- *Weakness:* the route has to exist. It's weird for a trip with no
  order (a list of cities you might visit).

**I6. Around, not in (no filing at all).**
- Store nothing beyond real location. Tapping "Reykjavík" shows
  **Reykjavík and around**: everything within a reach the app works
  out (for example, the nearest city's territory, a Voronoi split
  between your cities).
- The Blue Lagoon is closer to Reykjavík than to any other of your
  cities, so it shows. A second, narrower chip shows the real city only.
- *Strength:* zero filing, zero setup. It answers the Blue Lagoon case
  automatically.
- *Weakness:* it's wrong exactly when your mental home isn't the
  nearest city (the airport's real nearest might be Keflavík if that's
  one of your cities). There's no override, unless it's combined with
  I2.

**I7. The moment you saved it (provenance).**
- A place's home = **the city you were looking at when you added it.**
  You added the Blue Lagoon while planning Reykjavík, so it's Reykjavík.
  No question asked: the context *is* the answer.
- Real city stays data. Adding while looking at the whole trip → the
  home is the real city (or nearest base).
- *Strength:* zero-friction filing that matches intent, because you add
  things while thinking about the city you're in.
- *Weakness:* it's invisible. A place added from the "wrong" view is
  misfiled silently. That needs a visible home on the tag (and edit is
  future).

**I8. Plans are the groups (invert: use what exists).**
- The app already has Plans, ordered lists that cross cities. Make a
  "Reykjavík" plan (or a "Reykjavík & around" collection) that holds the
  Blue Lagoon and the airport.
- The city chips filter by **real** city; your mental groupings are
  collections. A trip is a collection of collections.
- *Strength:* no new concept: grouping = collecting, and it's
  many-to-many by nature.
- *Weakness:* collections and plans are different jobs (an ordered day
  vs. "everything near Reykjavík"). Overloading Plans may blur both.
  Every add becomes "add to which collection?" unless defaulted.

**I9. Two lenses on one map (separate the "where" from the "about").**
- The filters panel offers two kinds of chip that combine:
  - **Trip / city lens** (mental: Scandinavia 2026 › Reykjavík, from
    any of I1-I7);
  - **Where it is** (real city: Reykjavík, Grindavík, Keflavík).
- The header names the mental lens. The real-city chips only appear
  inside it, so the owner's "separate from filters which should have a
  filter by city" is satisfied by structure.
- This isn't a model of its own. It's the interface any of I1-I8 needs,
  and I flag it as a likely constant across concepts.

### Where each idea shows up in the app (checklist for every concept)

- **List header:** names the trip and/or city ("Scandinavia 2026" or
  "Reykjavík").
- **Filters panel:** how trip → city → real city chips nest.
- **Add flow:** what's pre-filled, what's asked (ideally nothing), and
  where the place lands.
- **Map:** what a city view draws (its catchment? its route? nothing?).
- **Plans:** cross-city by nature in all of them. Does a plan belong to
  a trip?
- **Past trips:** where LA goes.

### Scope widened: the whole app's workflow (owner, folded in)

> "i want to be clear, im wanting to rev the app workflow as a whole not
> just fit in new ideas. i want to make sure it all sings."

So today's app (`../add-button-placement/concepts/blank-tag-form/diagrams/app-model.html`,
https://claude.ai/artifact/HzSR9UF58wh7pcZ9FcfZr1) is the **baseline to
question, not to preserve**. Today's shape, for reference:
- city chips in the filters panel switch "the city";
- the map plus a list sheet underneath;
- Plans is a separate view behind the filters panel;
- add is a form that infers a city.

The ideas above (I1-I8) answer *where a place's home comes from*. The
whole-app question is **how you move around**. Four app shapes that
differ in kind, each able to carry several of I1-I8:

**S1. The lens (one breadcrumb runs everything).**
- One control in the list header, **Scandinavia 2026 › Reykjavík**.
  Tap the trip to widen, tap a city to narrow, tap the chevron to switch
  trip.
- It replaces the city chips. The map, the list and the + all follow
  the lens.
- The filters panel keeps only "what kind" (categories, visited,
  starred) and "where it really is" (real-city chips, I9).
- Add pre-fills from the lens (I7 for free).
- Plans live inside the lens: the trip's plans, or this city's plans.
- *Strength:* one place answers "what am I looking at?" (the header
  rule).
- *Risk:* the header gets busy at 320 (the trip name plus the city
  name).

**S2. The route spine (the list *is* the trip).**
- The list becomes the trip in order: a section per stop (Copenhagen,
  Malmö, Stockholm, Reykjavík), with in-between places on the legs
  between them (I5).
- Scrolling the list *travels*: the map follows the section in view.
  Tapping a section header collapses the trip to that city.
- Plans are days inside a stop.
- *Strength:* "the whole trip" and "one city" are the same list at two
  zooms; no mode switch.
- *Risk:* the map following the scroll conflicts with today's rule that
  the list never depends on the map. Here it's the reverse (the map
  follows the list), which is allowed, but it's new motion. It needs an
  order for the trip.

**S3. Trip home → city (two levels, like an album).**
- Opening a trip shows a **trip page**: its cities as cards (counts,
  visited progress, the next plan), plus "everything" and in-between
  places. Tapping a card goes into today's map-and-list for that city
  (its home view, I1-I7 deciding membership).
- Plans can sit on the trip page (cross-city) or the city.
- *Strength:* the clearest place to start "from a few different
  points".
- *Risk:* one more level, so more taps for the person who lives in one
  city all trip.

**S4. Atlas (the map navigates; the list is "here and around").**
- There's no city selector at all. Where the map is decides the city:
  pan to Reykjavík and the header reads "Reykjavík & around", and the
  list shows that city's catchment (I3/I6), not just what's on screen.
- The trip is the set of places you've saved, framed together when you
  zoom out.
- *Strength:* the least chrome; it matches "I'm in Reykjavík".
- *Risk:* it **questions a CLAUDE.md rule** ("never gate list
  membership on map viewport"). Strictly, membership follows the
  catchment, not the viewport, but picking the catchment from the map
  centre is close. It needs the owner's explicit OK, flagged rather than
  assumed.

**What every shape must also revise, not just carry:**
- **The tag:** shows its home and its real city ("Reykjavík · in
  Grindavík"), and which trip it's in.
- **The add flow:** lands where you're looking, with nothing to pick
  (this is the blank-tag form's group entry, recast).
- **Plans:** are they part of a trip, a city, or free?
- **The + and account:** unchanged positions; the + is global (any trip
  or city), as he said.
- **Past trips:** where LA lives (switching trip in S1, the trip list in
  S3, panning away in S4).

### Early lean (not a recommendation)

- **App shape:** S1 (the lens) is the least disruptive and fixes the
  header rule. S2 (the route) is the most "it all sings" if trips have
  an order; worth a full concept.
- **I7 + I2 + I9** look like the lowest-friction mix: home = where you
  were when you added it, plus "also show in…" for exceptions, plus
  real-city chips nested under it.
- **I4/I5** (bases, route) are the most *true to trips*, but cost setup.
- **I6** is the most automatic, with a known failure.

None of them is "completely obvious" yet. The jobs to test them hardest
against are 4, 8 and 9.

### Questions for the director (not the owner yet)

- Is a trip in scope as a real container now (LA vs. Scandinavia), or
  only the city-level mental grouping?
- Can one place belong to two cities' views (many-to-many), or must
  there be one home?
- Should concepts differ in where the home comes from (choice / rule /
  context / area), as above? I'd keep 3-4 that differ in kind.

**Owner, verbatim (2026-10-15): "i dont want full on visuals -- i just
want sketch level thought here -- the model is what to nail right now
not ui".** So the work stays at model level: entities, relationships,
how you move through trip / city / plan, and rough flows. Any picture
is a sketch. The S1-S4 "app shapes" above are movement models (how you
navigate), not screens.

NEXT: product designer (visual focus) — sketch level only (boxes and
arrows, no stills): react to the I1-I9 home sources and the S1-S4
movement models. Push or kill them, add any that differ in kind, and say
which feel simplest to live with. Then the director picks 3-4 models
that differ in kind to take into concepts.

## Turn 2 -- product designer (visual focus)

Sketch level only, as the owner asked: "i dont want full on visuals -- i
just want sketch level thought here -- the model is what to nail right now
not ui". Boxes are for thinking, not screens.

**Random draws (real RNG):**
- fields: **library call numbers** and **restaurant menus (courses)**;
- Oblique Strategy: **"Look closely at the most embarrassing details and
  amplify them."**

### What each movement model is like to live with

**S1, the lens.**
- You open the app to the last lens you used.
- Moving between the trip and a city is one tap on the header, both ways.
- The map frames the lens. The list is the lens.
- It's the simplest to live with: one question ("what am I looking at?")
  has one answer, in one place.
- **Sharper:** the header names **one** thing, what the list is, with the
  step back to the wider level beside it. That fixes the 320 width.
  ```
  ┌──────────────────────────────────────┐
  │ ‹ Scandinavia   REYKJAVÍK  (23)   ⇅ ⚙ │   city lens: one name, a step back
  └──────────────────────────────────────┘
  ┌──────────────────────────────────────┐
  │ ▾ SCANDINAVIA 2026  (96)          ⇅ ⚙ │   trip lens: ▾ = switch trip (LA lives here)
  └──────────────────────────────────────┘
  ```
  Tapping the city name opens the trip's cities as a short sheet (S3's
  cards, reduced to rows: name, count, visited x/y). That's the only
  "album" anyone needs.

**S2, the route spine.**
- As a whole app it's heavy. A single-city day scrolls past three other
  cities, and the trip needs an order before it works.
- Its best part is **how the trip lens's list reads**, so I'd fold it
  into S1 rather than keep it as a shape.
- **Sharper:** in the trip lens, the list is in sections by city (the
  menu's courses). With no order set, they're alphabetical; if you've
  given an order, they're in trip order. Tapping a section heading
  narrows the lens to that city.
- The map does **not** follow the scroll. That's new motion and against
  the spirit of the list rule.
  ```
  SCANDINAVIA 2026
  ── COPENHAGEN (31) ─────────────
     Tivoli · Torvehallerne · …
  ── MALMÖ (12) ──────────────────
  ── REYKJAVÍK (23) ──────────────
  ```

**S3, trip home → city.**
- As a level of its own, it's one more tap every time for someone who
  spends the whole trip in one city.
- **Kill as a shape.** Keep its content as S1's city sheet (above).

**S4, atlas.**
- It's lovely in a demo and confusing to live with: the list changes
  when you nudge the map.
- It also fights the owner's own "should have a filter by city" and the
  list rule in CLAUDE.md.
- **Kill.** The "& around" part survives below without needing the map
  to steer.

### Home sources: kills, keeps, sharper versions

| | Verdict | Why |
|---|---|---|
| I1 home city, chosen | **Keep as the floor** | Every idea still needs one place where a place is "filed". |
| I2 also-known-as | **Keep, sharper** (library, below) | It's additive, and only the exceptions are touched. |
| I3 catchments you edit | **Kill** | Dragging an area on a phone is fiddly, and edit is future (owner). |
| I4 bases | **Keep, reshaped** (anchors, below) | It's the truest to trips, but the setup has to disappear. |
| I5 route | **Fold into S1** as optional section order | It's a source of order, not a home. |
| I6 around (nearest of your cities) | **Keep as the default** | It gets the Blue Lagoon right with zero filing. |
| I7 where you added it | **Keep for add only** | The lens pre-fills the home and the tag prints it, so it's never silent. |
| I8 plans as groups | **Kill** | "Everything near Reykjavík" and "Tuesday" are different jobs, and overloading Plans blurs both. |
| I9 two lenses | **Mostly absorbed** (In / From, below) | Real-city chips stay for "filter by city". |

### New ideas, and sharper versions

**N1. "In" and "From" (restaurant courses + I6 + I9 in one move).**
- A city lens's list has two courses:
  - **In Reykjavík**: places whose real city is Reykjavík;
  - **From Reykjavík**: everything that's nearer Reykjavík than any of
    your other cities (I6), plus anything you've said is "also
    Reykjavík".
- The ruled line between the sections **is** the real-city distinction.
  Most of the time nobody needs a filter to see it.
- The Blue Lagoon and the airport appear under "From" without anyone
  filing them.
- The rows in "From" print their real place and distance, for example
  `Blue Lagoon · Grindavík · 47 km`.
  ```
  REYKJAVÍK (23)
     Hallgrímskirkja
     Sundhöllin …
  ── FROM REYKJAVÍK (4) ──────────
     Blue Lagoon        Grindavík · 47 km
     Keflavík Airport   Reykjanesbær · 50 km
     Þingvellir         Bláskógabyggð · 45 km
  ```
- The map shows both sections. The "From" pins sit outside the city, so
  you can see "around" without a drawn boundary.
- **This is the one I'd push hardest. It reads simplest.** It needs no
  new setup, no new control and no filing at add time.

**N2. See also (library call numbers: one shelf, many subject cards).**
- This is I2 in the library's terms. A place has **one shelf** (its real
  location) and any number of **"see also"** cards.
- The tag prints them the way a catalogue card does, under the address:
  `See also: Reykjavík`.
- It's the override for N1's rule when "nearest" is wrong; for example,
  the airport as "see also Copenhagen" for the flight out.
- How you set one is an add-time and future-edit question. It's not
  needed for the common case.

**N3. Anchors (the embarrassing detail, amplified).**
- The embarrassing detail: **the airport isn't a place you want to
  visit.** It's logistics, and today it sits in the list beside the
  bakeries.
- Amplified, the hotel, the airport and the ferry are a different kind of
  place: **anchors** (arrive, sleep, leave).
- **Adding an anchor creates the base (I4) by itself.** You add the
  Reykjavík hotel, and Reykjavík is a base of the trip, with no setup.
- Anchors also give the trip its order, through dates if they have any
  or the order you added them. S2's sections then have an order for
  free, and "places in between" (job 9) sit between two anchors.
- In the list, an anchor heads its city's section rather than being one
  of its rows.
- *Risk:* it's a new kind of place. It may be the "is there something
  missing?" answer, or it may be too much. I'd show it as a wildcard.

**N4. One trip at a time (Do the simplest thing).**
- The app is always in exactly one trip. LA is a past or other trip,
  reached through ▾, and its places never mix in.
- So "trip" costs nothing visible day to day. It's the outer frame,
  named once in the trip lens. Cities are what you actually move
  between.

### Which reads simplest

**S1 (one name in the header, with a step back) + N1 (In / From) + I7
(add pre-fills the lens's city)**, inside **N4** (one trip at a time).
- That takes nothing new to set up, and a single tap moves you between
  trip and city.
- The Blue Lagoon case is answered by the list's own structure.
- N2 is the escape hatch. N3 is the wildcard that would make trips sing
  if the owner wants dates and order.

Not "completely obvious" yet. N1's default (nearest of *your* cities)
is wrong whenever two of your cities are close: is a place on the
Øresund "from" Copenhagen or Malmö? N2 has to cover that.

### Open questions
- Should a place in "From Reykjavík" also appear in "In Grindavík" if
  Grindavík is one of your cities? (No, in my opinion: then it's simply
  "In".)
- Does the airport belong to every city you fly through, or to the
  flight's anchor only (N3)?
- Should real-city filter chips remain once In / From exists? The
  owner's own words say a city filter should exist, so yes, but maybe
  inside the filters panel only.

NEXT: design director — pick 3-4 models that differ in kind. My
suggestion:
- (a) S1 + N1 (automatic);
- (b) S1 + I1/I7 (chosen home, filed at add);
- (c) N3 anchors (trip-shaped);
- (d) N2 see-also as the many-to-many alternative.

## Turn 3 -- design director

The owner asked for "many ideas here, not a hard recommendation", and
(new ledger rule) "judgments are opinions, not facts". So I'm choosing
what goes forward as *different kinds of answer*, not picking a winner.
Real draws: field **constellations**; Oblique **"Emphasize
differences"**.

### The direction: a city in his head is a constellation, not a border

- A constellation groups stars that look together *from where you
  stand*, even though they're at wildly different real distances.
  Astronomers keep both: the star's real position, and the figure we
  see it in.
- That's his Blue Lagoon exactly. "Reykjavík" is the figure he sees
  from where he'll be standing; Grindavík is the star's real position.
- So every concept must keep **two truths side by side, without either
  one overwriting the other**:
  - where a place *is* (data, never edited by the user);
  - which figure it belongs to in his head (the model's job).
- The concepts differ in **where the figure comes from**. Per the
  Oblique, I want those differences sharp. Three sources, three
  concepts:

**Concept A: Drawn by rule ("From").** The app works the figure out.
- This is visual's N1. A city lens lists **In Reykjavík**, then **From
  Reykjavík**: everything nearer Reykjavík than your other cities.
- The override is visual's N2, "see also", for when nearest is wrong.
- **Zero filing.** Its failure is two close cities (Copenhagen and
  Malmö); systems must show what happens there, not wave at it.

**Concept B: Drawn by you (a home, chosen once).** You file it.
- I1 + I7: every place has one home, pre-filled from the lens you
  added it in, and printed on the tag.
- Real city is data, with its own filter.
- It's the most predictable and the most conventional. That's a fair
  answer and I won't mark it down for it.
- Its deliberate difference: **one home only.** The airport can't be in
  two figures. Show that cost honestly.

**Concept C: Drawn by the trip (anchors).** The figure comes from
where you sleep.
- Visual's N3, pushed: **anchors aren't a new kind of place. They're
  the Hotel category the app already has** (plus Transport for the
  airport and ferry, if needed).
- Add a hotel and its city becomes a **base** of the trip. Every place
  belongs to the base you'd go *from*. Places between two bases sit on
  the leg.
- The trip gets an order for free, from hotel dates or the order added.
- It's the truest to how trips work, and the only one where "places in
  between" (job 9) has a real home.
- Its risk: a trip with no hotels yet has no figures at all, so systems
  needs a fallback (A's rule, until a hotel exists).

### Constants across all three (so the concepts differ only where it matters)

- **One movement model: S1, the lens, as visual sharpened it.**
  - One name in the header with a step back ("‹ Scandinavia
    REYKJAVÍK").
  - In the trip lens, the list runs in city sections, in trip order where
    one exists.
  - The cities sheet is the only "album".
- **N4: one trip at a time.** Other trips (LA) are behind ▾ and never mix
  in.
- **Real city stays data on every place.** The owner's "filter by city"
  is the real-city chips, inside the filters panel and inside the
  current trip.
- **Plans belong to a trip** and can cross its cities. A city lens shows
  the plans that touch that city.
- **Add:** nothing to pick. The lens pre-fills. The tag prints both
  truths: "Reykjavík · in Grindavík".

### Rulings on the open questions

- **Is a trip a real container? Yes, in scope now.** He named it himself
  ("trips they may be grouped to", "scandinavia 2026"). It's a
  container of places, with cities inside it as figures, and plans
  inside it.
- **Can a place show under more than one city?**
  - **In A and C, yes, in the view.** A place can be "In" one figure and
    "see also" another. Storage stays one place, one real location.
  - **In B, no, by design.** That's the difference the owner should see.
  - It isn't mine to settle for him; it's the clearest question to put
    to him with the concepts.
- **Kills: agreed with visual.**
  - S2 as a shape (its sections live in S1's trip lens);
  - S3 and S4;
  - I3 and I8;
  - I5 folded into C's order.
- **N2 "see also"** is A's override, not a concept on its own.

### Push for pass 2

- **Systems:** run A, B and C through jobs 1-12 and the checklist
  (header, filters, add, map, plans, past trips). Then run three cases
  through each:
  - the Øresund (a place between Copenhagen and Malmö);
  - the airport (logistics, flown into and out of);
  - a day trip on a leg (Þingvellir from Reykjavík, or Lund between
    Malmö and Copenhagen).
  Also say what each one stores. The model is the deliverable.
- **Visual:** one box-and-arrow sketch per concept, the same three
  views each (trip lens, city lens, the tag's two truths). Sketch level
  only, as he asked.

### Owner questions (for the send with the concepts, not now)

1. When you tap Reykjavík, should the Blue Lagoon just *be there*
   (worked out), or only once you've said so?
2. Can one place show under two cities (the airport under Reykjavík
   and Copenhagen)?
3. Are hotels and airports places you visit, or the frame of the trip
   (where you stay and leave from)?
4. Do your trips have an order or dates you'd want the app to use?
5. One trip at a time (LA kept separate), or do you ever want everything
   at once?

NEXT: product designer (systems focus) — the jam's second pass: run
A, B and C through the jobs, the checklist and the three cases (Øresund,
airport, day trip on a leg), and say what each stores, so the concepts
start from a tested model.

## Turn 4 -- product designer (systems focus): A, B and C walked through; a fourth that differs in kind

Sketch level, as asked. Facts used:
- the trip's 5 cities and 202 places;
- **0 places in the Hotel category today**, and no Transport category
  exists;
- real city comes from `address_details` (stored for new places only;
  the backfill is 0 of 202);
- **edit after adding is future** (owner).

That last fact turned out to matter most (see "What the walk showed").

Test places:
- **Øresund:** Saltholm, an island about 12 km from Copenhagen and 20 km
  from Malmö (Danish), and Kastrup Søbad (Tårnby).
- **Airport:** Keflavík (Reykjanesbær, about 50 km from Reykjavík), and
  Copenhagen Kastrup (Tårnby, about 8 km from Copenhagen and 30 km from
  Malmö), which you'd fly in and out of for both cities.
- **Day trip on a leg:**
  - Lund (about 17 km from Malmö, 40 km from Copenhagen);
  - Þingvellir (about 45 km from Reykjavík);
  - Jönköping, a stop between Stockholm and Malmö (about 300 km from
    each).

### What each stores (model, not schema)

| | A · by rule ("From") | B · by you (one home) | C · by the trip (anchors) |
|---|---|---|---|
| Trip | name; its cities (name, centre) | the same | the same, plus an **order** (hotel dates, or the order the hotels were added) |
| Place | real location, real city, trip, **see-also: cities (0 or more)** | real location, real city, trip, **home city (exactly 1)** | real location, real city, trip; **hotel / transport places can carry dates** |
| Derived, never stored | its figure = In (its real city is a trip city) or From the nearest trip city; plus its see-also | nothing: the home *is* the figure | its base = the nearest base (a city with a hotel), or the leg between two consecutive bases |
| Today's data → model | `city` becomes "trip city"; the figure is recomputed | `city` = home (a straight carry-over) | the same as A until hotels exist (**fallback = A's rule**) |

### The three cases

| Case | A · rule | B · one home | C · anchors |
|---|---|---|---|
| **Saltholm** (between Copenhagen and Malmö) | From Copenhagen (nearest). Right. | Home = whichever city lens you added it from; from the trip lens, the nearest (Copenhagen). Right either way, by your choice | Base Copenhagen if you sleep there. If Malmö is a base too and they're consecutive → **on the Copenhagen ↔ Malmö leg** |
| **Kastrup Søbad** (Tårnby, just outside Copenhagen) | From Copenhagen. Right. | Home Copenhagen (from the lens). Right | From the Copenhagen base. Right |
| **Keflavík airport** | From Reykjavík. Right. | Home Reykjavík. Right | **An anchor:** it opens the Reykjavík base (arrive) or closes it (leave). It's listed as the base's frame, not as a sight |
| **Kastrup airport, for both Copenhagen and Malmö** | From Copenhagen. **Under Malmö only with a see-also**, set at add time (edit is future) | Copenhagen **only**; it can't also be Malmö (by design) | An anchor at the edge of *both* bases' stays. It shows in both, with no setting |
| **Lund** (17 km from Malmö) | From Malmö (nearest). Wrong if you'd go from Copenhagen; fix with a see-also at add | Home = the lens you added from. Predictable | From whichever base you sleep in. If both are bases → on the leg |
| **Þingvellir** | From Reykjavík. Right | Home Reykjavík. Right | From the Reykjavík base. Right |
| **Jönköping** (between Stockholm and Malmö) | From Malmö (nearest), **arguably wrong: there's no "between"** unless "From" has a fixed reach, beyond which it's "On the way" | Home = the lens you added from; there's no "between" either | **On the Stockholm → Malmö leg.** The only model where it has a real home |
| **Close cities** (Copenhagen–Malmö, 28 km apart) | Works by nearest, but a place near the midpoint flips on a few km, with no say | No issue: you chose | Bases decide. If only Copenhagen is a base, **Malmö becomes a sub-group "From Copenhagen › Malmö"**, a real difference: a city you don't sleep in isn't a figure of its own |

### Jobs 1-12

| Job | A | B | C |
|---|---|---|---|
| 1 Whole trip | ✓ trip lens, city sections | ✓ | ✓ sections **in trip order** |
| 2 One city | ✓ In + From | ✓ its homes | ✓ a base. A non-base city is a sub-group |
| 3 Between the two | ✓ (S1 lens) | ✓ | ✓ |
| 4 Blue Lagoon under Reykjavík | ✓ **automatic** | ✓ if added from Reykjavík's lens; ✗ if added from the trip or another lens (**unfixable until edit exists**) | ✓ automatic (with no hotels: A's rule) |
| 5 Filter by real city | ✓ real-city chips | ✓ | ✓ |
| 6 Group into trips | ✓ | ✓ | ✓ |
| 7 Plans across cities | ✓ | ✓ | ✓, and **a day starts at its base** |
| 8 Low-friction add | ✓ nothing to pick | ✓ pre-filled, but it *is* a choice made at add | ✓ nothing to pick. Adding a hotel *is* the setup |
| 9 Places in between | **partial** (only with an "On the way" reach) | **partial** (filed somewhere arbitrary) | ✓ legs |
| 10 Other trips out of the way | ✓ one trip at a time | ✓ | ✓ |
| 11 Map matches | ✓ (In and From pins) | ✓ | ✓ |
| 12 Header names it | ✓ | ✓ | ✓ (a sub-group needs a name: "Malmö · from Copenhagen") |

### The app-wide checklist (sketch)

- **Header (all):** S1, one name with a step back. C's trip lens adds
  order: "Copenhagen → Malmö → Stockholm → Reykjavík".
- **Filters (all):**
  - categories, visited, starred;
  - **real-city chips inside the trip** (the owner's "filter by city");
  - nothing else, because the figure is the lens, not a filter.
- **Add:**
  - **A:** the trip comes from the lens and nothing else is asked. A
    see-also is only possible here, at add (edit is future).
  - **B:** the home is pre-filled from the lens and shown on the tag,
    tappable at add.
  - **C:** as A. A hotel or transport place may ask for dates
    (optional).
- **Map:**
  - **A:** In pins plus From pins.
  - **B:** that home's pins.
  - **C:** the base's pins, plus legs drawn as the in-between places in
    the trip lens. Sketch only.
- **Tag (all):** two truths, "Reykjavík · in Grindavík".
  - In A the first is worked out.
  - In B it's chosen.
  - In C it reads "from Reykjavík" (base), or "on the way, Stockholm →
    Malmö".
- **Plans (all):** belong to the trip. A city lens shows the plans with
  any stop in that figure. In C a plan can default to "a day from a
  base".
- **Past trips (all):** behind ▾ (N4).

### What the walk showed

1. **Edit after adding is future, and that changes the comparison.**
   - B's misfile, and A's missing see-also, can only be fixed **at add
     time**.
   - So any model that relies on a per-place choice is fragile *right
     now*: a place added from the wrong lens stays wrong until edit
     ships.
   - Models where the figure is worked out (A, C) degrade more
     gracefully: a wrong rule can be fixed **once, by changing the
     rule**, not per place.
2. **A's "nearest" needs a reach,** or Jönköping-style stops get a wrong
   figure. A fixed reach (the owner: no distance setting, so it's a
   fixed app rule) with "On the way" beyond it brings A close to C's
   legs, without hotels.
3. **C has no figures until a hotel exists** (0 today), so it's A
   in practice until you add your stays.
4. **Real city everywhere needs the backfill** (0 of 202). A's "In"
   and every real-city filter depend on it.

### A fourth model, different in kind (from the walk)

**D · Drawn by region: a figure is a named set of real cities.**
- Nobody files places, and no distance rule is involved. Each figure in
  the trip *is a list of real cities*:
  - "Reykjavík" = Reykjavík, Grindavík, Reykjanesbær, Bláskógabyggð;
  - "Copenhagen" = Copenhagen, Frederiksberg, Tårnby.
- A place's figure follows from its real city.
- **Stores:**
  - per place: real city only (plus trip);
  - per figure: its member real cities (and a real city may be in two
    figures; Tårnby can be in Copenhagen *and* Malmö for the airport).
- **New real cities arrive with no setup:** the first place from
  Grindavík joins the nearest figure, so Grindavík becomes "Reykjavík"
  from then on.
- **The fix-it is per region, not per place,** and it doesn't need place
  editing: "Lund belongs with Copenhagen" is one change that moves every
  Lund place, now and later.
- It joins the owner's two asks into one control. The **real-city
  chips** he wants as a filter are the *same list* the figures are made
  of: a figure is a saved bundle of real-city chips.
- **The cases:**
  - Saltholm and Kastrup Søbad → Tårnby → Copenhagen ✓;
  - Keflavík → Reykjanesbær → Reykjavík ✓;
  - Kastrup airport → Tårnby, which is in both Copenhagen and Malmö
    if you put it in both ✓;
  - Lund → its own real city, joining Malmö (nearest) until you say
    Copenhagen ✓;
  - Þingvellir → Bláskógabyggð → Reykjavík ✓;
  - Jönköping → nearest, unless it becomes a figure of its own ("On the
    way"), or one set is shared by two figures. **Partial, like A.**
- **Risk:**
  - Real-city granularity is uneven (a municipality can be huge, and
    some rural results have no city).
  - The backfill is a hard prerequisite.
- It differs from A (distance), B (per place) and C (stays) in kind:
  **membership is decided at the level of real places' names, once.**

### How things come into being (owner constraint, folded in)

> "we also need to think about how these things are created. e.g. if we
> have a trips model how do i create that -- i do not want someone to
> have to manually do a bunch of shit to set up a thing before they just
> start getting to logging the places they want to go"

**Rule I've applied to every model:**
- Trips and figures (cities, bases) are **created as a side effect of
  logging places**, never as a step before it.
- They're named automatically. A trip is named after its first place's
  country, with no year, because there are no dates yet: "Iceland".
- They can be renamed whenever (renaming a trip isn't editing a place,
  but it's flagged as an owner question).
- **A model fails the owner's rule if it needs anything made, named or
  dated before the first place can be logged.**

| Moment | A · rule | B · one home | C · anchors | D · region sets |
|---|---|---|---|---|
| **The very first place** (empty app) | A trip is made ("Iceland"), and its first city is the place's real city. Nothing asked | The same; home = its real city | The same. **No bases** until a hotel is logged, so the figure comes from A's rule | The same; the first figure = {its real city} |
| **The first place in a new city, same country** | It joins the nearest city's "From" (within the reach), or becomes a new trip city beyond it. Nothing asked | Home pre-filled from the lens. **Adding Lund while looking at Malmö = Malmö**; to make Lund its own home, choose "New city…" on the tag (one step) | As A. A hotel there makes it a base | It joins the nearest figure, or becomes a new figure beyond the reach. Nothing asked |
| **The first place in a new country** (Copenhagen while the trip is Iceland) | A new trip city (it's far from every other one). The trip now spans two countries ("Scandinavia" is a rename) | Home pre-filled from the lens = **Reykjavík, which is wrong**. It must be changed at add ("New city…"), or it's misfiled until edit exists | As A | A new figure (far away). Nothing asked |
| **Starting a second trip** (LA) | The place is far from every city in the trip (another continent) → **one question: "Start a new trip?"** (pre-named "United States"), or ▾ → New trip | The same | The same | The same |
| **Setup before the first log** | **None** | **None** | **None** required. Its *structure* needs hotels logged; hotel dates are optional (order = the order added) | **None** |
| **Choices per add** | 0 (see-also optional, add only) | **1, pre-filled**, and wrong whenever the lens isn't the place's city | 0 | 0 |
| **Later tuning** (optional) | per place, at add only (edit is future) | none possible until edit exists | log your stays | **per region, any time** ("Lund goes with Copenhagen") |

**Plainly:**
- **None of the four needs setup before logging,** as long as trips and
  figures are made automatically, as above.
- The version of *any* model that asks you to create a trip, name a city
  or set dates first **fails the owner's rule**. That includes C if it
  insisted on hotel dates. All of them are written here without it.
- **B pays its cost at every add:** a pre-filled home that's a real
  decision, wrong whenever you add outside the city on screen, and
  unfixable until edit exists. It's the weakest on "just start logging",
  though it doesn't strictly fail.
- **C costs nothing up front,** but its benefit (bases, legs, order)
  only appears if you log your stays, and today there are none. Logging
  a hotel *is* a kind of setup, if one you might do anyway.
- **A and D are the cheapest:** zero to start, zero per add.
- **The one question every model shares** is "Start a new trip?" when a
  place lands far from the current trip. That's the only moment trips
  are visible at all, and it can be skipped (it joins the current trip).

### Places-first: the check, plainly

> "the philosophical approach should be places-first; immediately doing
> the thing you actually want to do not the adin"

The test for each model: **open the app → log a place or look at places
straight away**, with trips and figures appearing *from* the places, and
no admin before, during or as a condition of logging.

| | Open and log at once? | Groups emerge from places? | Admin during logging? | Verdict |
|---|---|---|---|---|
| **A · rule** | yes | yes: trips and figures appear as places land | none (see-also optional) | **Pass** |
| **D · region sets** | yes | yes: a new real city joins a figure by itself | none (per-region tuning is optional, any time, never in the way) | **Pass** |
| **C · anchors** | yes | **partly**: the trip order and bases emerge only from logging stays, and "a hotel" is closer to admin than to "a place you want to go". Without stays it's A | none required. Asking for hotel dates would be admin | **Pass, conditionally:** only if stays are optional and never asked for; its signature value depends on them |
| **B · one home** | yes | **no**: a home is a filing decision attached to every place, even when it's pre-filled | **yes, every add**: the pre-filled home must be checked and is wrong whenever you add outside the city on screen | **Fails the spirit.** It's filing on every add, the admin he's ruling out. Kept only as the conventional baseline to compare against |

- **Places-first also rules out:** any "create a trip", "add a city" or
  "set up your bases" step, any up-front trip or city picker, and any
  required field beyond the place itself.
- The one shared question, "Start a new trip?", fires only when a place
  lands far away. **It's the one admin moment left in A, C and D.**
  Places-first says it should default to *yes, quietly* (the trip is
  made and named from the place), with a way to merge if it was wrong.
  That would make it zero admin, so it's flagged as an owner question.

### For the director

- A, B, C and D differ in **where the figure comes from**: distance,
  your per-place choice, your stays, or your per-region choice.
- My read (opinion, not a recommendation):
  - **D** is the most robust while place edit doesn't exist.
  - **C** is the only one that answers "places in between" fully.
  - **A** is the most automatic.
  - **B** is the most predictable, and the most fragile without edit.
- On creation: A and D need nothing up front and nothing per add. B
  asks at every add (pre-filled). C needs nothing up front, but its
  value waits on logging stays.
- New owner question to add: "If the app gets one place's city wrong,
  would you rather fix that place, or fix the rule (for example 'Lund
  belongs with Copenhagen') once for all places like it?"

NEXT: design director — decide whether D joins A, B and C (four kinds),
and whether A gets a fixed "On the way" reach. Then concepts start:
visual's sketch of the three views per model, and my per-model flows
(add, the lens, plans) written up.

## Turn 5 -- product designer (visual focus): places-first, felt from the first open

Owner, verbatim:
- "i do not want someone to have to manually do a bunch of shit to set up
  a thing before they just start getting to logging the places they want
  to go";
- "the philosophical approach should be places-first; immediately doing
  the thing you actually want to do not the adin".

Sketch level only. Judgments below are my opinions, not facts.

### The first five minutes, the same for every model that passes

Ideally nothing on screen says "trip" or "city" until places have made
them.
```
 open (empty)            log 1st place             log a place in Grindavík      log a place in Copenhagen
┌─────────────────┐     ┌─────────────────┐       ┌─────────────────┐           ┌─────────────────┐
│ map             │     │ map, 1 pin       │       │ map, 2 pins      │           │ map              │
│              (+)│ ──▶ │                  │  ──▶  │                  │   ──▶     │                  │
├─────────────────┤     ├─────────────────┤       ├─────────────────┤           ├─────────────────┤
│ YOUR PLACES (0) │     │ REYKJAVÍK (1)    │       │ REYKJAVÍK (1)    │           │ ‹ Iceland & Denmark│
│ + to log one    │     │  Hallgrímskirkja │       │ ─ FROM REYKJAVÍK ─│           │ COPENHAGEN (1)   │
└─────────────────┘     └─────────────────┘       │  Blue Lagoon     │           └─────────────────┘
                                                   └─────────────────┘
```
- **What you see first:** the map, the list and the +. There's no picker,
  no "new trip" and no onboarding.
  - Empty, the list's one line is print: "+ to log one".
  - The search is worldwide, because there's no trip to scope it.
- **The city appears the moment a place lands:** the header names it.
  **The trip appears only once there are two cities:** that's when the
  "‹" step back has somewhere to go.
  - The trip's name is generated from its countries ("Iceland",
    "Iceland & Denmark").
  - Renaming it "Scandinavia 2026" is the only admin, and it's optional,
    whenever.
- **A far-away place starts a new trip without asking.** The tag you've
  just added prints it, on the tag itself, after the fact:
  `New trip · United States`, with `Keep in Iceland & Denmark` as the
  stub's other half.
  - That's a correction after the thing you wanted, never a question
    before it. It sharpens Turn 4's "Start a new trip?" into a non-question.
  - Owner question: is an after-the-fact correction acceptable here,
    given that edit is future? It's on the tag only while it's open.

### Each model through that lens

**A · rule ("From"). Pass, and it *feels* like nothing.**
- The Blue Lagoon just shows up under "From Reykjavík" on the first log,
  with no moment of filing. That's the whole pitch.
- Where it feels wrong is when a place flips sides near a midpoint
  (Lund), and you can't do anything about it. Without edit, that's a
  shrug.

**D · region sets. Pass, and I'd merge A into it.**
- At the first open it's indistinguishable from A. The difference only
  appears when the rule is wrong, and then the fix is **beside the
  places, not in a settings screen**:
  - in "From Malmö", the places group by real city, under quiet print
    sub-heads;
  - a sub-head carries one printed action, `Lund · 3  — belongs with…`.
  ```
  ── FROM MALMÖ ───────────────
     Lund · 3               belongs with…
       Lund Cathedral
       …
  ```
  That's one tap, once, for every Lund place, past and future. It's
  places-first, because you fix it while looking at the places.
- **Push: A and D are one concept, "a rule that remembers".**
  - "Nearest" (A) is how a new real city gets its first figure.
  - D's per-region memory is how you overrule it.
  - Two concepts that differ only in whether the correction exists would
    waste the owner's attention.
  - Call it **A/D**. The see-also per place (N2) can then retire: a
    region correction does its job without a control on the tag.
- The cost: the backfill (0 of 202) is a prerequisite, and an
  uneven-sized municipality can be coarse. Jönköping still needs a
  "between" (below).

**C · anchors. Keep as a layer, not a model.**
- Through places-first, "log your hotel" is closer to admin than to "a
  place I want to go". The owner said hotels may be a frame (owner
  question 3, still open).
- **Reshape:** C becomes an **optional layer on A/D**. Nothing changes
  until a place in the Hotel category is logged. Then:
  - its city gets a base mark in the trip lens;
  - the trip's sections take the hotels' order;
  - places in between get legs.
- You never set it up; it only reacts. If he never logs a hotel, he never
  sees it.
- That keeps job 9 (places in between) answerable without making it a
  condition.

**B · one home. Kill as a live concept (keep it as the "today" reference).**
- On every add the tag carries a pre-filled home you're meant to check,
  and it's wrong whenever you add outside the city on screen.
- That's filing at the moment he said he wants to "immediately do the
  thing". With edit being future, a wrong home is permanent.
- Showing it as a concept invites a choice we already know fails his
  rule. It can stand as the "this is what today is" column in the send.

### Sharper ideas that came from this

- **"Between" without hotels (for A/D's Jönköping):** when a place is far
  from every figure but inside the trip's spread, it files under
  `On the way` in the trip lens, as a section of its own. There's no
  leg logic, just "not near any of your cities yet". Log a second place
  there and it becomes a figure itself.
- **The header names a city only when the places made it one.** One
  place in Jönköping doesn't add a "Jönköping" city to the cities
  sheet; two do. The threshold is a fixed app rule, not a setting (owner:
  no distance setting). It's my opinion of the number, not a measured
  one.
- **Nothing structural is ever asked for at add.** At add, the tag
  shows only what the place *is*: name, address, type, pencil notes.
  Figures and trips are shown on the tag *after* ADD, as print.

### What I'd take to concepts (for the director)

1. **A/D**, a rule that remembers: nearest, plus a per-real-city
   correction beside the places.
2. **A/D + the stays layer (C)**: the same, plus bases, order and legs
   that switch on when you log a hotel.
3. A deliberately different one, to keep the set honest: **N4 relaxed**,
   all your places at once.
   - No trip container: trips are just the "figure of figures" the app
     clusters by distance.
   - It tests owner question 5 ("one trip at a time, or everything at
     once?"). It's places-first in the extreme: there's no trip object
     at all.
4. **B** only as the "today" reference column.

Open (owner questions):
- the after-the-fact "New trip" on the tag;
- the two-places threshold for a new city;
- whether hotels are places or the frame.

NEXT: design director — rule on merging A and D, on C as a layer, on
killing B as a live concept, and on adding the "no trip container"
model; then concepts at sketch level.

## Turn 6 -- design director: the jam closes

Governing principle (owner, verbatim): "the philosophical approach should
be places-first; immediately doing the thing you actually want to do not
the adin". And: "i expect many ideas here, not a hard recommendation,
unless they have one that is completely obvious and stands out
meaningfully against the others." Sketch level; model, not UI. Anything
below that rests only on our taste is marked **(we think)** and stays
visible to the owner as an option.

### Rulings

**1. The places-first verdicts: agreed.**
- A and D pass.
- C passes only as something you never have to do.
- B fails, and that isn't our taste: it's his test applied. A pre-filled
  home on every add is filing at the moment he said he wants to
  "immediately do the thing", and with edit future a wrong home is
  permanent.

**2. Merge A and D into "a rule that remembers": yes.**
- They're one idea with and without its correction. Showing them apart
  would spend his attention on a difference he'd see in one sentence.
- How it works:
  - "nearest of your cities" files a new real city the first time;
  - the per-real-city memory overrules it from then on;
  - a real city may sit in two figures (Tårnby, for the airport, in both
    Copenhagen and Malmö).
- **The group-level fix replaces the per-place "see also": yes.** It's
  fixed beside the places ("Lund · 3 — belongs with…"), once, for every
  Lund place, past and future, and it needs no place edit.
- **The cost, said plainly:** one Lund place can't go with Copenhagen
  while the rest go with Malmö. **(We think that's rare enough.)** It
  goes to him as a question, not a settled point.
- **Prerequisite for this and every concept:** the real-city backfill
  (0 of 202 today).

**3. C as an optional stays layer, switched on by logging a hotel:
yes.**
- Nothing appears until a Hotel-category place exists. Then:
  - its city gets a base mark;
  - the trip's sections take the stays' order;
  - in-between places sit on legs.
- Hotel dates are never asked; order defaults to the order added.
- Whether hotels are places to visit or the trip's frame is still his
  to say. The layer works either way.

**4. Kill B as a live concept: yes.** It stays only as the **"today"
reference** column in the send, so he can see what changes. We don't
dress it up as an option we expect to fail.

**5. The added ideas:**
- **"On the way": yes.** A place far from all your figures but inside
  the trip's spread files there, as its own section. It's job 9 without
  hotels.
- **A new city once there are two places there: yes, as a fixed rule.**
  - Not a setting: he's said no distance or threshold settings.
  - **The number 2 is our opinion (we think);** it goes to him visibly.
- **Nothing structural asked at add: yes, a constant for every
  concept.**
  - The tag at add shows what the place *is*.
  - Figure and trip print on it after ADD.
- **The "no trip container" model: yes, as the third concept.**
  - It differs in kind: trips aren't objects at all, just how your
    places cluster.
  - It's the honest test of his question "one trip at a time, or
    everything at once?", and places-first in the extreme.

**6. The quiet new-trip default (correct it after, don't ask first):
yes.**
- A far-away place starts a new trip, named from its country.
- The open tag prints it with the correction beside it
  ("Keep in Iceland & Denmark").
- With place edit future, the safety net is **trip-level**: two trips can
  be merged later from the trip list. That isn't editing a place.
- **(We think)** an after-the-fact correction is right for places-first.
  It's his call, so it's on the list.

### Is one model plainly ahead?

- **Not enough to send only one.** "A rule that remembers" is ahead on
  places-first: zero setup, zero choices per add, and every fix is made
  once, beside the places.
- But concepts 2 and 3 each answer something it can't: in-between and
  order, and whether trips should exist at all.
- **(We think)** concept 1 is the strongest. It's sent as our opinion,
  with the other two in full.

### Concepts going to sketch (model, not UI)

1. **A rule that remembers.** Nearest of your cities, plus a per-real-city
   correction beside the places. "On the way" for places far from every
   figure. One trip at a time, made and named by your places.
2. **The same, plus stays.** Log a hotel, and bases, trip order and legs
   appear. Nothing until then.
3. **No trip container.** All your places at once; trips are clusters the
   app sees, named by country. The figures work as in 1.
- **Reference: today (B).** One home per place, filed at add.

**Constant across all three:**
- the lens (one name in the header, one tap back out);
- real-city chips as his "filter by city";
- plans belong to the trip (or, in 3, to the cluster their stops sit in);
- nothing structural asked at add;
- the tag prints both truths ("Reykjavík · in Grindavík").

Each concept's sketch walks the same moments:
- the first open;
- the first place;
- a place in a new real city;
- a place in a new country;
- a far-away place;
- the fix ("Lund belongs with…").
Plus the three test cases: Øresund, the airport, Jönköping.

### Owner questions still open (send with the concepts)

1. **When the app files a place under the wrong city:** fix the rule
   once ("Lund belongs with Copenhagen", every Lund place), or fix that
   one place? (One place on its own needs edit, which is future.)
2. **Can one place show under two cities?** For example, Copenhagen's
   airport under both Copenhagen and Malmö.
3. **Are hotels and airports places you want to visit, or the frame of
   the trip** (where you stay and leave from)?
4. **Do your trips have an order or dates** you'd want the app to use?
5. **One trip at a time** (LA kept apart), **or everything at once?**
   Concept 3 shows the second.
6. **A far-away place starts a new trip quietly,** with "keep it in this
   trip" on its tag right after. Is that the right moment, or should it
   ask first?
7. **A place becomes a city of its own once there are two places
   there.** We think 2; is that right?

Retired from Turn 3's list: "should the Blue Lagoon just be there?" All
three concepts answer yes, and Q1 covers when it's wrong.

NEXT: product designer (systems focus) — write `jobs.md` for the
trip-model concepts: jobs 1-12 with places-first as the governing rule,
the creation moments above, and the three test cases, so visual and
systems sketch the three concepts against one list.

## Turn 7 -- product designer (visual focus): the concepts sketched

Sketch level (owner: "sketch level thought… the model is what to nail
right now not ui"). Text and box sketches, one file per concept, each run
through P, C1-C9 and T1-T3, with a jobs line for the checker:
- `concepts/1-rule-that-remembers.md`, the full rule, with a "where a new
  place goes" decision tree;
- `concepts/2-rule-plus-stays.md`, only what the stays layer adds;
- `concepts/3-no-trip-container.md`;
- `concepts/4-reference-today.md`.

Overview for the owner, phone-readable: `concepts/overview-3x.png`
(1170 wide, large text). It carries the corrected prerequisite: **58
places with no `address_details`** (not "0 of 202").

**Flags for systems and the director:**
1. **C4 as jobs.md writes it breaks job 5.** "The second place in a real
   city becomes a city of its own" means a second Grindavík place pulls
   the Blue Lagoon out of Reykjavík.
   - The sketches apply the threshold of 2 only to places **beyond the
     reach** (On the way).
   - Within the reach, a real city stays "From" its figure however many
     places it has, unless the owner says "belongs with… its own city".
   - jobs.md's C4 check needs the same wording, or a different rule.
2. **The rule needs three fixed distances.** These are app rules, never
   settings:
   - REACH (joins a figure);
   - SPREAD (between figures → On the way);
   - "far away" (a new trip).
   **(We think)**: REACH about a day trip (60-80 km), SPREAD the box
   around the figures, "far away" another continent. All unmeasured.
   - Known quirk: a first place inside the box (Oslo) waits in On the
     way until a second place arrives.
3. **Concept 2's surprise:** one hotel turns Malmö from a top-level city
   into "Malmö · from Copenhagen". It only fits if hotels are the trip's
   frame (owner question 3).
4. **Concept 3's weakness:** clusters chain through stopovers. A
   "these are separate" fix brings the trip object back.

NEXT: design director (or a fresh checker): run jobs.md's P, C1-C9,
T1-T3 and jobs 1-14 against the four files, and rule on flag 1 (C4)
before the send.

## Turn 8 -- design director: C4 ruled; the concepts scored; changes before the send

### 1. C4: I adopted visual's rule and fixed jobs.md (C4 and T3)
- The threshold of 2 applies **only to a real city beyond every
  figure's reach** (in "On the way").
- Within reach (Grindavík), a real city stays "From" its figure however
  many places it gets, unless the owner says "belongs with… its own
  city".
- That protects job 5. The number 2 and the reach stay labelled
  as the team's opinion.

### 2. Scores (concept phase: the idea, against places-first and "it all sings")

**Concept 1, a rule that remembers: 9.**
- It passes P with nothing to set up and nothing chosen per add.
- Every fix is made once, beside the places.
- The lens, figures, On the way and the tag's two truths make one
  system.
- Likely owner pushback:
  - a "From" section in every city list;
  - unmeasured distances.
  Both are said plainly, so neither holds it under 9.

**Concept 2, plus stays: 8.**
- **Gap 1: the demotion.** One logged hotel turns Malmö from a city into
  "Malmö · from Copenhagen". Logging a place changes the structure he
  sees, a side effect he never asked for.
  - **Fix:** bases add a mark and order only. A figure never folds under
    a base.
  - Legs hold only places with no figure (they replace "On the way").
- **Gap 2: order by the order added is arbitrary.** Log the Reykjavík
  hotel first and Reykjavík leads a trip that ends there.
  - **Fix:** show the stays' order only once each base's hotel has a
    date. Until then, the sections keep concept 1's order. That's no
    question asked, and no wrong order shown.
  - Dates are still never asked; a date he gives is used.
- With both fixes it can reach 9.

**Concept 3, no trip container: 7.**
- It's places-first in the extreme and the honest answer to owner
  question 5.
- But by its own account, clusters chain (a Toronto stopover, a Paris
  weekend), and the fix ("these are separate") brings the trip back.
  There's no past trip either.
- It can't reach 9 as a model. **It stays in the set as the
  "everything at once" answer,** labelled with those weaknesses. It
  isn't something we're recommending.

### 3. The overview (overview-3x.png): what has to change (visual; not fixed by me)

It reads cold at phone size: large text, one card per concept, the
opinion stated at the foot. Changes:
1. **Concept 1's card:** "joins the nearest of the trip's cities"
   reads as unlimited distance. Add: "if it's within about a day trip
   (we think 60-80 km); farther goes 'On the way'".
2. **The threshold of 2 isn't on the overview.** Add one line to
   card 1: "two places beyond reach make a new city (we think 2)".
3. **Concept 2's card has no cost line.**
   - After the fixes above: "Order appears once hotels have dates; a
     city never folds under a hotel city."
   - If gap 1 isn't fixed, the card must say the Malmö demotion plainly.
4. **Concept 3's naming contradiction (orchestrator's a):** "named by
   country" vs the header "SCANDINAVIA 2026". Use a generated name in
   the example ("ICELAND · DENMARK · SWEDEN"). Note that "Scandinavia
   2026" is a rename you can give it.
5. **The airport (orchestrator's b):** Keflavík airport may fall in
   Reykjanesbær or Suðurnesjabær depending on OSM. Change the row to
   "Keflavík airport · (its OSM town)". Better: add one line, "the town
   OSM gives can surprise; that's what 'belongs with…' fixes", which
   is the concept's point anyway.
6. **The count (orchestrator's c):** 58 places have no
   `address_details`, and 1 more has details but no town. That makes
   **59 of 202** without a real town. Systems confirms the number, and
   both the overview and the concept files use it.
7. **Label the three distances** (reach, spread, far away) as "we think,
   unmeasured" wherever they appear. Concept 3's "another continent" is
   labelled; concept 1's file is labelled. Check the overview after
   edits 1-2.
8. **Concept files:** concept 2 takes gap fixes 1-2. All three take the
   59 count.

### Owner questions: unchanged from Turn 6 (7)
Q4 (order/dates) now carries concept 2's gap-2 fix.

NEXT: product designer (visual focus) — overview changes 1-7 and
concept 2's two gap fixes in its file. Systems confirms the 59 count.
Then I check and re-score concept 2.
