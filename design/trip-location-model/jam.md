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

## Turn 9 -- product designer (visual focus): Turn 8's changes made

- **Overview** (`concepts/overview-3x.png`, re-rendered at 1170x3130 and
  checked at phone size):
  1. Card 1 gives the reach: "if it's within about a day trip (we think
     60-80 km, unmeasured); farther goes 'On the way'".
  2. Card 1 gives the threshold: "two places there make a new city (we
     think 2)".
  3. Card 2's cost line: "Order appears once hotels have dates; a city
     never folds under a hotel city". Its sketch is labelled "once
     dated".
  4. Card 3 uses a generated name ("ICELAND · DENMARK · SWEDEN"), with
     "'Scandinavia 2026' is a rename".
  5. The airport row is "Keflavík airport · its OSM town", plus "The town
     OSM gives can surprise; 'belongs with…' fixes that".
  6. **59 of 202** (58 need the backfill; 1 has an address with no
     town).
  7. The reach and "far away" are labelled "we think, unmeasured" where
     they appear. The spread isn't named on the overview; it's in
     concept 1's file, labelled.
- **Concept 2** (`2-rule-plus-stays.md`), rewritten:
  - a base adds only a mark, and a figure never folds under a base;
  - the stays' order and legs appear only once every base's hotel has a
    date (never asked); until then, concept 1's order and On the way;
  - legs hold only places with no figure.
- **The count is 59 in every concept file** (1, 2, 3 and the "today"
  reference). Concept 3's example names are now generated.

NEXT: design director — check the overview and re-score concept 2.

## Turn 10 -- design director: concept 2 re-scored; overview checked

**Concept 2: 8 → 9.**
- Both gaps are fixed. A hotel only adds a mark, a city never folds,
  and order and legs wait for dates that are never asked for.
- Logging a place no longer restructures anything he didn't ask for.
- Its honest limit: until his hotels have dates, it *is* concept 1. That
  makes his answers to Q3 and Q4 decide its worth, which is the right
  place for that decision. Said plainly on its card.

**The overview, cold at phone size: passes.**
- One card per concept, large type, and each card carries its own cost.
- Every unmeasured number reads "we think": the reach, the threshold of
  2 and "far away".
- The count is 59 with its reason. The airport town is softened, and
  concept 3's name is generated, with the rename noted.
- "The team thinks concept 1 is strongest; that's an opinion" closes
  it.

**Scores:**
- C1: 9.
- C2: 9.
- C3: 7, sent as the "everything at once" answer, not recommended.

**Send** (after the fresh jobs check passes):
- `concepts/overview-3x.png`;
- the seven owner questions from Turn 6.
The concept files stay in the repo for anyone who wants depth; the
owner gets the overview.

NEXT: orchestrator — once the jobs checker passes, send the overview and
the seven questions to the owner.

## Turn 11 -- product designer (systems focus): jobs.md fixed after the fresh check; how concept 2's dates could arrive

`jobs-check.md` read. Only `jobs.md` changed (visual is in the concept
files):
1. **Concept 2's revision carried in** (Turns 8-10):
   - **Job 14** is now three clauses, all required: (a) no hotel =
     concept 1; (b) an undated hotel = a base mark only; (c) every base
     dated = order and legs.
   - **C7** matches.
   - **Job 9 and T3:** On the way until every base is dated, then a leg
     (the example's Copenhagen ↔ Stockholm).
2. **One meaning per term.** A new "Terms" block uses concept 1's rule
   tree:
   - reach (joins a figure, "From");
   - spread (inside it but beyond reach = On the way);
   - outside the spread in the same part of the world (a new figure);
   - far away (a new trip, or a cluster in concept 3).
   **C3** is now limited to within reach. **C5** is now "outside the
   spread" (it said "within" before: the contradiction the checker
   found).
3. **59, not 58:** 58 places with no `address_details` plus 1 with
   details but no town (the orchestrator verified this). The
   prerequisite is reworded.
4. **Concept 3's storage:**
   - one *global* real-city memory (no trip to hang it on);
   - "these go together" and "these are separate" stored as rules,
     keyed by their member figures, because clusters re-form;
   - the optional cluster name, keyed the same way.
5. **Ambiguities resolved:**
   - job 14 (all clauses);
   - T2: the airport has a figure, so in concept 2 it sits in its city's
     list under the ◆, never on a leg ("at the edge" is gone);
   - job 12 allows "Your places" (empty) and concept 3's "All places"
     and cluster names;
   - **C6** has a concept-3 variant (a new cluster, nothing to keep).

**Concept 2's dates: how they could arrive without breaking P** (full
table in jobs.md):
- **D1, paste the booking:** the dates are read from a pasted
  confirmation and pencilled on the tag before ADD. Nothing asked.
  Parsing is unreliable.
- **D2, an optional "Stay" line** on a Hotel tag. Borderline on P: it's
  an optional field.
- **D3, learned on the trip:** order comes from the first visited mark
  in each city. Needs a hidden `visited_at` timestamp (none today:
  `visited` is a boolean, and `updated_at` moves on any change). It only
  helps during and after the trip.
- **My read (opinion):** D1 + D3, with D2 held back.
- **If none is accepted:** concept 2 is concept 1 plus a base mark, and
  the owner should hear that on its card.

Not in jobs.md (the concept files' issues, for visual):
- concept 2's header count of 96 vs. sections summing to 87;
- concept 3's first-ADD header (job 1) and its undrawn cluster view;
- concept 3's C1 missing "search is worldwide";
- concept 1's stale "flag on C4";
- the reference under-grading itself on P (today's add form opens with a
  City select, `index.html` 2801-2802).

NEXT: design director — rule on the date routes (D1 / D2 / D3 or none).
Then the checker re-runs the changed checks (9, 12, 14, C3, C5-C7, T2,
T3) once visual's concept fixes land.

## Turn 12 -- design director: concept 2's dates ruled; UI flagged for stripping

Model, not UI (owner: "the model is what to nail right now not ui").

### The model statement (this is what gets ruled, not a route)

- **A stay is a Hotel-category place that may carry a date range.**
- **A trip's order comes from the first source that exists:**
  1. dated stays (the stays' dates);
  2. else the order you actually visited its cities (the first visit
     in each city);
  3. else no order: concept 1's sections, and "On the way" instead of
     legs.
- **Nothing is ever asked for.** Every source is something you've
  already done.

### The routes

- **D3, learned from visits: in.**
  - It follows from the owner's own principle ("places-first;
    immediately doing the thing you actually want to do"). It uses only
    what you'd do anyway.
  - **Model consequence:** a place must record *when* it was first marked
    visited.
    - Today `visited` is a yes/no, and `updated_at` can't stand in.
    - That's a stored field (a database change, gesture/data lane at
      build), flagged now so it isn't a surprise.
  - Its limit is plain: it gives order only during and after the trip.
- **D1, dates read from a pasted booking: in, as "we think".**
  - It extends what the owner already does: "planning in advance… pasting
    an address first".
  - It gives order *before* the trip, which D3 can't.
  - **Its costs:**
    - reading dates from bookings is unreliable;
    - with edit future, a wrong date is only fixable before ADD.
  - So it's offered to the owner as an option, not settled.
- **D2, an optional date line on hotels: held back, but visible to the
  owner as the conventional route.**
  - **(We think)** it's the one route that puts a field in front of
    him, which leans toward the admin he ruled out.
  - Not hidden: it's his call.
- **None:** still possible. Then concept 2 is concept 1 plus a base
  mark, and its card has to say so.

### Owner question 4, reworded (replaces Turn 6's Q4)

> "Should the app put your trip in order? It could use your hotel dates
> (read from a booking you paste), the order you actually visit
> places, both, or neither. (We think both, with hotel dates first.)"

### UI to strip from the concept files (for systems)

**Keep only:** entities, what's stored vs. derived, the rule tree,
creation-moment outcomes, test-case outcomes, and the jobs lines.

**Strip, or restate as a plain model statement:**
1. **Header strings and counts:**
   - "‹ Iceland & Denmark";
   - "REYKJAVÍK (23)";
   - "YOUR PLACES (0)";
   - "ALL PLACES (225)";
   - "▾ SCANDINAVIA 2026 (96)", including the 96 vs 87 mismatch, which
     goes away with it.
   - Model: *the current view is always one trip, one figure, On the
     way, or (concept 3) everything / a cluster.*
2. **Empty-state copy:** "+ to log one". Model: *an empty app has no
   trip or figure.*
3. **Tag wording and layout:**
   - "Reykjavík · in Grindavík";
   - "New trip · United States" / "Keep in Iceland & Denmark";
   - "after ADD, print on the tag";
   - "pencil", "NAME line", "blank tag", "stub".
   - Model: *a place exposes both its figure and its real city; a
     far-away place makes a new trip, and that can be undone by keeping
     it in the current trip (or by merging trips later).*
4. **"belongs with…" as a control:**
   - sub-heads with counts;
   - "beside the places";
   - the [Malmö ✓] [Copenhagen] [its own city] chips.
   - Model: *a real city's figure(s) can be changed once, for all its
     places; options: an existing figure, an extra figure, or its own.*
5. **List section headings and order on screen:**
   - "FROM REYKJAVÍK";
   - "ON THE WAY" as a section;
   - ◆ as the base mark.
   - Model: *a place is In or From its figure; a place with no figure
     is On the way; a figure with a stay is a base.*
6. **Navigation gestures:** "tap ‹", "tap a heading", "one tap down",
   ▾. Model: *moving between trip and figure is one step either way
   (job 4).*
7. **The filters panel and "real-city chips".** Model: *places can be
   narrowed by real city, separately from figures.*
8. **Map behaviour sentences.** Keep these as the constraint in job 11,
   not as a description.
9. **Concept 3's undrawn cluster view and first-ADD header** (systems'
   list). These vanish with 1 and 6.
10. **The stale "flag on C4" in concept 1,** and the reference's P grade
    (today's form opens with a City select, so it **fails** P). Model
    fixes, not UI: correct them.

NEXT: product designer (systems focus) — strip the concept files to
model statements per the list above, add concept 2's ordering rule
(stays' dates → visit order → none), then the checker re-runs the
changed checks.

## Turn 13 -- product designer (systems focus): concept files stripped to the model; concept 2's ordering rule; the overview rebuilt

The owner: "the model is what to nail right now not ui". Visual is off
this loop, and systems owns the concept files.

1. **Turn 12's items 1-9 stripped and restated as model statements** in
   all four files. Each file now has the same shape:
   - what exists;
   - stored vs. inferred;
   - the rule;
   - what can be corrected, and when;
   - how you move (as model statements: the current view is one trip /
     figure / On the way / nothing yet; one step either way; narrowing
     by real city; the map constraint);
   - P;
   - creation moments;
   - test cases;
   - jobs;
   - prerequisite;
   - open questions.

   Gone:
   - header strings and counts (the 96/87 mismatch with them);
   - empty-state copy;
   - tag wording;
   - the "belongs with…" control and chips (now "a real city's figure(s)
     can be changed once, for all its places: another figure, an extra
     figure, or its own");
   - section headings and ◆;
   - gestures;
   - the filters panel;
   - map description, except as job 11's constraint.
2. **Concept 2's ordering rule (Turn 12)** is in its file:
   - dated stays → else first-visited order → else no order;
   - with the stored **"first visited at" per place** it needs (a new
     field; `visited` is yes/no today and `updated_at` can't stand in);
   - C7 is split into C7 (undated: a base only), C7b, C7c (dated: order
     and legs) and C7d (no dates, under way: visit order);
   - owner Q4 reworded as Turn 12 gives it.
3. **Item 10, checked:**
   - concept 1's stale C4 flag is gone (the C4 outcome is stated as a
     model);
   - today's P is **FAIL**, with the reason (the City field first, a
     new-city question for pins);
   - concept 3's drawn cluster view (added by visual) was UI, so it's
     stripped and restated: "a cluster's view holds every place in it,
     by figure, plus On the way". Its first-ADD header became "the
     current view becomes that figure", and its C6 tag wording became "a
     new cluster exists, visible beside the others; corrected after the
     fact or any time".
4. **Overview rebuilt** (`concepts/overview-3x.png`, 1170x2927, with the
   same playwright renderer from the scratchpad `ov/ov.html`):
   - one card per model, plus today;
   - each card: what's stored or inferred in plain words, the cost, and
     "we think" on every unmeasured number;
   - no UI strings, no sections, no ◆, no tag text;
   - checked at phone size.
5. **"The owner", never "he"/"his"/"him":** none left in the concept
   files or jobs.md.

**Check ids that changed (for the checker):** P, 1, 2, 3, 4, 6, 8, 9, 10,
11, 12, 13, 14, C1, C2, C4, C6, C7, C8, T2, T3, in all four concept
files.

NEXT: fresh checker — re-run the changed ids against the stripped
concept files and the jobs.md of Turn 11; then the director checks the
overview for the send.

## Turn 14 -- product designer (systems focus): after check 2 (Malmö, concept 2's rule, the gaps)

`jobs-check-2.md` read in full. Model only.

**1. Malmö: distance alone can't do it.**
- Malmö is about 28 km from Copenhagen, Lund about 39 km. Any day-trip
  reach merges them.
- **Proposed second signal: the country border.**
  - Within reach and the same country → join (From).
  - Within reach but across a border → a new figure at once.
  - So Malmö is a figure, Lund is From Malmö, and Tårnby is From
    Copenhagen.
  - It's places-first (from data each place has) and needs no question.
  - **Cost:** close same-country cities the owner thinks of apart
    (Stockholm and Uppsala) merge until the owner fixes it once.
- **Considered:** a city's size (it splits Lund and Frederiksberg off
  too), and "the owner fixes it once" (always available).
- **If the director rejects the border, the honest answer is the
  owner's one fix,** and T1 then takes two changes (make Malmö a figure,
  then move Tårnby). jobs.md's T1 now says Malmö must already be a
  figure, and the fix counts as one change.

**2. Concept 2, made coherent and kept close to "the same, plus stays":**
- **Only bases are ordered.** No stay means concept 1 exactly, whatever
  has been visited.
- **Per base, never all-or-nothing:** its stays' earliest date, else its
  first visit, else no position. A new base never moves the others.
- **With an order:**
  - non-base figures sit after the nearest ordered base;
  - a no-figure place sits on the leg whose line (anchor to anchor) is
    nearest, within the spread;
  - a no-figure place on no leg (one ordered base, or beyond the ends)
    stays On the way.
- **Views are unchanged:** a leg is a group inside the trip view, not a
  view.
- **Simpler option, said plainly:** drop legs, so bases are ordered and
  in-between places stay On the way. (We think legs are only worth it
  if the owner answers Q4 with dates.)

**3. One-liners:**
- concepts 1 and 2, C2 / job 1: the current view becomes the new place's
  figure;
- concept 3: narrowing by real city (6), a figure's plans (8), a place
  exposing both truths (13).

**4. Gaps:**
- **Reach is measured from a figure's anchor:** the centre of its named
  member, which is the member real city with the most places. That
  stops snowballing.
- **The name follows the most places:** Roskilde-first becomes
  Copenhagen once København has more places.
- **A big municipality joins once through the memory** (Þingvellir
  brings Bláskógabyggð, so Geysir follows).
- **A concept-3 custom name survives growth.** It's keyed to its figures
  at naming; on a split, the bigger part keeps it; on a join, the bigger
  cluster's name wins. The generated name never overrides it.

**5. UI stripped:**
- concept 2's date-entry wording and the "plan defaults to a day" line;
- in jobs.md, every UI string (the map / list / + / empty copy / tag
  text / ◆ / pencil / NAME line / "beside");
- every check is now a model outcome: Terms (anchor, border, base /
  order / leg), job 9/14/T3 for the per-base order, job 12 (legs aren't
  views; a figure narrowed by real city is still the figure);
- "My read", "The director rules:" and the stale NEXT are gone, and the
  Dates section records Turn 12's ruling.

**6. Today's reference, job 11:** verified in `index.html`. The list and
the map both come from `visibleLocations()` (the same filters); the map
only adds zoom clustering (`mapVisibleLocations()`). **PASS.** Today
now fails P and jobs 1-10 and 13, and passes 11 and 12.

**7. Overview:**
- card 1 now says how a trip forms (by itself with the first place,
  named from countries; a far-away place quietly starts another;
  rename and merge optional), with the border rule (pending), On the
  way, the threshold, and "farther out starts a new city";
- card 2 is the per-base order;
- re-rendered (1170x3277), and checked.

**Director to rule:**
1. The border as the second signal (or "the owner fixes it once").
2. Concept 2 with legs, or the simpler no-legs version.
3. The anchor and naming rule (most places).
4. Concept 3's name-survival rule.

**Changed ids for the checker:** 1, 2, 7, 9, 11 (reference), 12, 13, 14,
C1, C2, C5, C6, C7, C8, C9, T1, T2, T3, plus concept 3's 6 and 8.

NEXT: design director — rule items 1-4; then the checker re-runs the
changed ids.

## Turn 15 -- design director: Turn 14 ruled; re-scored; overview checked

Model only. Anything resting on the team's taste goes to the owner as an
option, not settled here.

### Rulings

**1. The border as the second signal: an owner question, with our
opinion.**
- Distance alone can't keep Malmö apart from Copenhagen, so something
  must.
- The border is a fair proxy because every place carries it, nothing is
  asked, and it's places-first.
- But whether it matches how the owner thinks is the owner's to say,
  and the Stockholm-Uppsala cost is real.
- **Model as sent:** border on **(we think)**. The fallback is "the
  owner fixes it once", which exists either way.
- T1 counts a single change only if the border is on. The checker should
  test both branches.

**2. Concept 2: legs go to the owner inside Q4. Default: no legs.**
- Per-base order (dates → first visit → none, and a new base never moves
  the others) is coherent. Accepted.
- Legs add a second rule: nearest anchor-to-anchor line within the
  spread. **(We think)** they earn that only if the owner wants a dated
  order.
- So: **no legs unless the owner asks for them in Q4**. In-between
  places stay On the way.
- That keeps concept 2 to "the same, plus stays".

**3. The anchor, and naming by most places: accepted.**
- Measuring reach from the anchor (the member real city with the most
  places) is a correctness rule: without it, figures snowball. Not a
  question.
- A figure's name following the most places is **(we think)**: the
  owner sees it in the files, not as a question. It's too fine-grained
  for the owner's attention, and a rename can come later if wanted.

**4. Concept 3's name survival: accepted as written (we think).**
- The bigger part keeps the name, and a custom name beats a generated
  one.
- It's mechanics for a model we don't recommend. No owner question.

### Scores
- **Concept 1: 9.** It's still coherent, with the border labelled
  "pending" and the owner's one fix behind it.
- **Concept 2: 9.** Per-base order makes it robust: a new base never
  reshuffles. With legs left to the owner, it stays close to "the same,
  plus stays".
- **Concept 3: 7.** The name rule doesn't touch its real weakness
  (chaining through stopovers). It stays as the "everything at once"
  answer.

### The overview (1170×3277), cold at phone size

It reads, and every unmeasured number carries "we think". Changes
before the send:
1. **Card 1: the two "farther" levels blur.** "Farther out it starts a
   new city" and "a far-away place quietly starts another [trip]" read
   as the same distance.
   - Say: "farther out, still in the same part of the world → a new city
     in this trip; much farther (we think another continent) → a new
     trip."
2. **Card 1 is long** (five paragraphs).
   - Fold the trip paragraph into one line: "Trips form by themselves,
     named from countries; renaming and merging are optional."
   - Keep the border sentence with its "pending".
3. **Card 2:** "places in between belong to the stretch between two
   ordered bases" becomes "**(if you want it)** places in between can
   belong to the stretch between two ordered bases". That matches
   ruling 2.

### Owner questions (now 8)
1. When the app files a place under the wrong city: fix the rule once
   (every place in that town), or that one place? (One place alone needs
   edit, which is future.)
2. Can one place show under two cities (Copenhagen's airport under
   Copenhagen and Malmö)?
3. Are hotels and airports places you want to visit, or the frame of the
   trip?
4. **(Reworded)** Should the app put your trip in order? It could use
   your hotel dates (read from a booking you paste), the order you
   actually visit, both, or neither. If it has an order, should places in
   between sit on the stretch between two stays? (We think both sources,
   hotel dates first, and stretches only if you want dates.)
5. One trip at a time, or everything at once?
6. A far-away place quietly starts a new trip, with "keep it in this
   trip" right after. Is that OK, or should it ask first?
7. Two places beyond reach make a new city. We think 2; is that right?
8. **(New)** When a place is close to one of your cities but across a
   border (Malmö near Copenhagen), should it be a city of its own
   automatically? We think yes. The cost: two close cities in one country
   (Stockholm and Uppsala) count as one until you fix it once.

NEXT: product designer (systems focus) — the overview's three edits and
the no-legs default in concept 2's file; then the fresh checker re-runs
the changed ids (T1 both branches).

## Turn 16 -- product designer (systems focus): Turn 15 applied

- **Overview** (`concepts/overview-3x.png`, re-rendered at 1170x3277,
  checked at phone size):
  1. Card 1 separates the two distances: "Farther out, still in the same
     part of the world, it's a new city in this trip; much farther (we
     think another continent), a new trip."
  2. Card 1's trip paragraph is one line: "Trips form by themselves,
     named from countries; renaming and merging are optional." The
     border sentence keeps "pending".
  3. Card 2: "(If you want it) places in between can belong to the
     stretch between two ordered bases."
- **Concept 2: legs off by default.**
  - A leg exists only if the owner asks for it in Q4.
  - No-figure places stay On the way by default.
  - C7c, T3, and jobs 9 and 14(c) are reworded to match.
- **Questions:**
  - Q4 is reworded (the "stretch between two stays" clause added) in
    concept 2's file;
  - Q8 (the border) is added to concept 1's open questions (concepts 2
    and 3 point to concept 1's).
  - The full list of eight is in Turn 15.
- **jobs.md:**
  - Terms: legs are off by default.
  - Job 9 and T3: On the way by default; a leg only with legs on.
  - 14(c): an order, no legs unless turned on.
  - **T1 has both branches:** border on, one change; border off, two
    changes (make Malmö a figure, then move Tårnby), each per real city
    and never per place.

**Changed ids for the checker:** 9, 14, C7, T1 (both branches), T3;
plus concept 2's 2 and 12 (the no-legs default), and the overview.

NEXT: fresh checker — re-run those ids (T1 both branches); then the
director releases the send.

## Turn 17 -- product designer (systems focus): after check 3 (which trip a place joins)

Applied jobs-check-3.md, items 1-8. Every new number is **(we think)**,
unmeasured.

- **1. Trip assignment (the missing rule):** concepts 1 and 2 now run it
  before the figure rule. Nothing is asked:
  1. an **active** trip that already has the place's real city (the most
     recently added-to, if several);
  2. else the nearest active trip on the same continent (to its nearest
     anchor);
  3. else a new trip, named from the country.
  - **Past** = has visits and none in 60 days. Past trips take nothing
    new, so Copenhagen 2028 starts "Denmark 2028".
  - **Continent:** a fixed country table (Iceland and the Canaries are
    Europe; Greenland is North America). It replaces "same part of the
    world" and "far away".
  - **Tivoli while viewing the US trip** → Scandinavia; the view never
    decides.
  - **Someday Berlin** widens the trip by default. A new correction,
    **split a figure into its own trip**, fixes it.
  - The memory is now **global**, so job 7 holds across trips. Merging
    keeps the name of the trip with more places.
  - Concept 3: clusters link by same continent **and** a time gap of
    about 6 months, by when places were logged or visited. Paris 2024,
    Scandinavia 2026 and Copenhagen 2028 separate; someday Berlin chains
    until "these are separate". That's an honest limit.
  - **Q5 extended, not a 9th question:** "a new city on the same
    continent widens the trip, or starts its own; we think widen."
- **2. The spread box is gone. Nearby band:** within 300 km of any
  anchor → On the way.
  - Order-independent: Jönköping is within the band of both Malmö and
    Stockholm.
  - Edinburgh, about 800 km out → a new figure (it doesn't balloon).
  - One-city trip: Vík, about 180 km out → On the way.
  - Honest limit: it's still one fixed distance; one correction per real
    city fixes it.
  - Lund before Malmö: Lund is a figure by the border rule; Malmö joins
    From Lund; the name follows the anchor.
- **3. Concept 2:**
  - A stay in On the way promotes its real city to a figure, and so a
    base, at once (the Gothenburg one-night base).
  - Non-base figures are **unordered** ("right after" is dropped).
  - Ties share a position, including one stay making two bases.
  - Visits from before the new field have no time, so no position;
    nothing is invented.
- **4. No-town places:** the real city = the next OSM level
  (municipality, then county). Else the place goes through the rules by
  location alone and no real-city correction moves it. Saltholm caveat
  added under T1.
  - Districts and streets are places (centroid → real city → the same
    rules), with one line in each concept. Today's file notes the
    shape vote.
- **5. T2 has both branches:** border on, one change; border off, two.
- **6. jobs.md:**
  - Job 5 now requires the real city to stay exposed, so today fails.
  - Job 8: "only the plans with a stop in it".
  - Job 12 allows a plan and "narrowed by real city"; today fails on
    "All cities".
  - Today now passes **only 11**.
  - Terms: band, continent, trip assignment, past, global memory,
    no-town.
  - Dates: "booking text supplied when a hotel is added".
- **7. Concept 2's UI is gone:**
  - "read from a booking you paste" → "if the app has them";
  - the list-layout wording → "how a view shows the order is not this
    model's call".
- **8. Overview:**
  - intro: "Three models, plus today for comparison";
  - card 1: band, continent, trip assignment, past;
  - card 2: "a hotel on the way makes its town a city first";
  - card 3: "keeps model 1's city in your head", time-gap trips, and a
    new cost line;
  - concept 1's file has a "We think … director's labelled opinion"
    section;
  - re-rendered 1170x3520 and read at phone size.

**What can't fully hold:**
- No single rule gets both Copenhagen 2028 (a new trip) and someday
  Berlin (its own trip) without asking. We chose time ("past") for the
  first and a split correction for the second.
- A no-town place with no municipality can't be moved by any correction
  until place edit exists.

**Director rulings needed:**
- trip assignment, including "most recently added-to" and "nearest
  active trip";
- past = 60 days;
- the continent table;
- the split correction;
- the band = 300 km (replacing the spread);
- concept 2's stay promotion, ties and no-time visits;
- concept 3's time gap (6 months);
- the no-town fallback;
- the Q5 extension.

**Changed ids for the checker:**
- jobs 5, 7 (global), 8, 9, 12;
- C5, C6;
- T1 (Saltholm caveat), T2 (both branches), T3 (band);
- concept 2: C7e, C7f (new) and job 14;
- concept 3: C5, C6;
- concept 4: the grade (11 only);
- the overview.

NEXT: director — rule on the list above; then a fresh checker re-runs
the changed ids.

## Turn 18 -- design director: it got too clever; the simplest version that still passes

Owner: "the app should be as simple and low friction as possible" and
"i want to make sure it all sings".

### The step back: count what a person must know to predict where a place lands

Concept 1 as Turn 17 has it:

**Trip rules (6):**
1. an active trip with the same real city;
2. the most recently added-to, among several;
3. the nearest active trip on the same continent;
4. otherwise a new trip;
5. "past" means 60 days since the last visit;
6. a continent table (Iceland is Europe, Greenland is North America).

**City rules (8):**
1. the memory;
2. reach is 60-80 km;
3. reach is measured from the anchor;
4. the anchor is the town with the most places;
5. the border splits;
6. a 300 km band means On the way;
7. two places on the way make a city;
8. beyond the band, a new city.

**Plus:** the no-town fallback, and a split correction.

That's **about 14 rules, 4 fixed numbers and a lookup table.** Nobody
holds that in their head, so nobody can predict where a place lands.
Unpredictable is the opposite of "sings". Every rule was a reasonable
answer to a checker case, and together they're too clever. **That's
on me as much as anyone:** I asked for the cases to be closed by rule,
and each fix added one more.

### The simplest version that still passes the jobs (we think)

Three rules a person can say out loud, plus the fixes:

1. **Near → that city.** A place goes with the nearest of your cities if
   it's within about a day trip **(we think 60-80 km, unmeasured)**.
   Otherwise it's a city of its own, even with one place.
2. **One trip per continent at a time.** A place joins your current trip
   on its continent. If you have none there, a new trip starts quietly,
   named from the country.
3. **You fix things once, after the fact; nothing is ever asked first.**
   - a town goes with another city, or is its own ("Lund goes with
     Copenhagen", "Malmö is its own city");
   - a city splits off into its own trip ("Copenhagen 2028", "someday
     Berlin");
   - two trips merge.

**Invisible plumbing**, which a person never has to know: the anchor
that measures reach, the continent lookup, the no-town fallback, and
tie-breaking.

**What collapses, and the price, said plainly:**
- **The 300 km band, On the way and the two-place threshold become rule
  1's "otherwise it's a city of its own".**
  - Jönköping is a one-place city in the trip. Job 9 still passes: it's
    findable, not under an arbitrary city.
  - Price: small one-place cities sit in the trip's list. **(We think)**
    that's honest rather than cluttered.
- **The border becomes a fix.**
  - Malmö (28 km) joins Copenhagen until the owner says "Malmö is its
    own city", once, ever.
  - Price: one fix for this trip. **The owner decides** (Q8), and the
    automatic border stays available as the option.
- **"Past = 60 days" and "nearest active trip" become rule 2 plus the
  split fix.**
  - Copenhagen 2028 joins Scandinavia 2026 until the owner splits it
    off.
  - Price: one fix per repeat trip to the same continent. **(We think)**
    that's rare enough. It goes in Q5.
- **Kept, because they cost no understanding:** the continent table (the
  person only knows "another continent"), the anchor, and the no-town
  fallback.

**Jobs check:**
- Job 5: the Blue Lagoon is near Reykjavík. Pass.
- Job 7: the per-town fix, global. Pass.
- Job 9: its own city. Pass.
- Job 10: one trip per continent, plus split. Pass.
- P: nothing asked. Pass.
- T1: Tårnby goes to Copenhagen by nearest. Malmö needs one fix with the
  border off. Pass.
- T2: Keflavík goes to Reykjavík. Pass.
- T3: Jönköping becomes its own city. Pass.

### Item-by-item rulings, inside the simple version

| Item | Ruling |
|---|---|
| Trip-joining rule | **Replaced** by rule 2 (your trip on that continent, else a new one) |
| Past = 60 days | **Dropped.** The split fix covers repeat trips (Q5) |
| Continent table | **Kept**, as invisible plumbing |
| Split correction | **Kept.** It's now the main trip fix |
| 300 km band | **Dropped** (with On the way and the threshold) |
| Border rule | **Off in the simple version.** It's the owner's option in Q8 |
| Concept 2, hotel promotion | **Moot:** an off-reach hotel town is already its own city, and so a base |
| Concept 2, ties and no-time visits | **Accepted** as plumbing (ties share a position; no time means no position; nothing is invented) |
| Concept 3, 6-month gap | **Accepted for concept 3 only (we think).** Time is the only way a no-container model can separate trips. It's that model's own complexity, said on its card |
| No-town fallback | **Accepted** as plumbing |
| Q5 extended | **Reworded** (below) |

### Scores
- **Concept 1 as in Turn 17: 7.** It's correct case by case, but it
  doesn't sing: a person can't predict it.
- **Concept 1, simple (the three rules above): 9.** This is what goes to
  the owner.
- **Concept 2: 9 on the simple base.** Order is per base, from dates or
  else first visits, with no legs by default.
- **Concept 3: 7, unchanged.** Its time gap is an honest third rule, and
  chaining is still its weakness. It stays as the "everything at once"
  answer.

### Owner questions (the list changes)
1. When a place lands in the wrong city: fix it once for the whole town,
   or fix that one place? (One place alone needs edit, which is future.)
2. Can one place show under two cities (Copenhagen's airport under both)?
3. Are hotels and airports places you want to visit, or the frame of the
   trip?
4. Should the app put your trip in order? It could use hotel dates (if
   it has them), the order you actually visit, both, or neither. If it
   has an order, should places in between sit between two stays? (We
   think both sources, hotel dates first; in-between only with dates.)
5. **(Reworded)** One trip per continent at a time: a new city on the
   same continent joins your current trip until you split it off
   ("Copenhagen 2028"). OK? Or should old trips close by themselves? Or
   do you want everything at once (concept 3)?
6. **(Reworded)** A place on another continent quietly starts a new trip.
   OK, or ask first?
7. **(Retired: no threshold any more.)**
8. **(Reworded)** Malmö is 28 km from Copenhagen. Should it join
   Copenhagen until you say "Malmö is its own city" (simplest, we
   think), or should a border keep them apart automatically?

### What has to change (systems)
- **Concept 1's file:** rewrite as the three rules, plus fixes, plus
  plumbing.
  - Delete the band, On the way, the threshold, past, the "nearest active
    trip" and the border (the border moves to an option under Q8).
- **Concept 2's file:** rests on the new concept 1. Hotel promotion
  goes.
- **Concept 3's file:** its card names the time gap as its own rule.
- **jobs.md:**
  - Terms: remove band, past and spread.
  - Job 9: "its own city" passes.
  - T3: Jönköping becomes its own city.
  - C4: retired.
  - T1 and T2: border-off as the main branch.
- **Overview:** card 1 becomes the three rules in plain words. That's
  shorter than today's card.

NEXT: product designer (systems focus) — rewrite concept 1 to the three
rules and fixes, cascade into 2, 3, jobs.md and the overview; then a
fresh checker.

## Turn 19 -- product designer (systems focus): Turn 18 applied (three rules)

Each concept file now opens with its numbered rules, then the invisible
plumbing, then everything else, kept short.

- **Concept 1** is rewritten as the director's three rules: near → that
  city; one trip per continent at a time; fix things once, after.
  - Plumbing: the anchor, which trip when a continent has two, the
    continent table, the no-town fallback, districts and streets as
    places, and what's stored.
  - The band, On the way, the threshold, "past", the nearest active
    trip and the automatic border are all gone; the border survives
    only as the Q8 option.
  - The prices are listed plainly.
- **Concept 2:** the first rules are concept 1's three. Rule 4: a hotel
  makes its city a base. Rule 5: bases are ordered by hotel dates, else
  first visit, else no position.
  - Hotel promotion is dropped as moot.
  - Ties and no-time visits are plumbing.
  - Stretches are off by default (Q4).
- **Concept 3:** concept 1's rules 1 and 3, plus its own rule 2: trips
  are worked out by continent and a time gap of about 6 months (we
  think). Its cases and its chaining limit are said plainly.
- **Today:** opens with its three rules. Job 12 drops On the way.
- **jobs.md:**
  - Terms are rewritten (rules 1-3, the fixes, base and order) with a
    "gone in Turn 18" line.
  - Job 9: "a figure of its own" passes.
  - Job 10 adds "split off with one fix".
  - Job 12 drops On the way.
  - C3 and C5 are reworded; C4 is retired; C6 is another continent.
  - **The test cases now count the owner's real fixes, with the border
    off:**
    - T1 takes two fixes (Malmö its own, then Tårnby with Malmö); the
      Saltholm caveat stays.
    - T2 Kastrup takes two fixes.
    - T3 Jönköping is its own city.
    - **New T4:** Copenhagen 2028 and someday Berlin take one split fix
      each in concepts 1 and 2. In concept 3, 2028 separates by itself
      and Berlin needs "these are separate".
- **One gap the director didn't close, filled as plumbing:** a split
  takes the city's **unvisited** places, so the 2026 visits stay in
  2026. Without that, splitting Copenhagen 2028 would drag the old trip's
  Copenhagen with it.
  - After a split, a place within reach of a city joins that city's
    trip, and a new city joins the trip of the nearest city on its
    continent; ties go to the most recently added-to.
  - This needs a director check.
- **Owner questions, as Turn 18 rewords them** (no "he" was in the
  Turn 18 text; the wording here uses "you" throughout):
  1. When a place lands in the wrong city: fix it once for the whole
     town, or fix that one place? (One place alone needs edit, which is
     future.)
  2. Can one place show under two cities (Copenhagen's airport under
     both)?
  3. Are hotels and airports places you want to visit, or the frame of
     the trip?
  4. Should the app put your trip in order? It could use hotel dates (if
     it has them), the order you actually visit, both, or neither. If it
     has an order, should places in between sit between two stays? (We
     think both sources, hotel dates first; in-between only with dates.)
  5. One trip per continent at a time: a new city on the same continent
     joins your current trip until you split it off ("Copenhagen 2028").
     OK? Or should old trips close by themselves? Or do you want
     everything at once (concept 3)?
  6. A place on another continent quietly starts a new trip. OK, or ask
     first?
  7. *(Retired: there's no threshold any more.)*
  8. Malmö is 28 km from Copenhagen. Should it join Copenhagen until you
     say "Malmö is its own city" (simplest, we think), or should a
     border keep them apart automatically?
- **Overview:**
  - card 1 is now the three rules, a one-line example and the price;
  - card 2 is "model 1's three rules, plus a hotel makes its city a
    base";
  - card 3 names its time-gap rule;
  - it was re-rendered at 1170x2911 (shorter) and read at phone size.

**Changed ids for the checker:**
- jobs 2, 9, 10, 12;
- C3, C4 (retired), C5, C6;
- T1, T2, T3, and the new T4;
- concept 2: C7e (now the tie case);
- the overview.

NEXT: director — check the split-takes-unvisited plumbing; then a fresh
checker on the ids above.

## Turn 20 -- design director: plumbing checked; overview checked

### 1. A split takes only the city's unvisited places: plumbing, accepted
- It happens as the result of a fix the owner performs, so the outcome
  shows up at once. Nobody has to predict it.
- It also matches what a person expects: what you've already done stays
  with the old trip, and what's still wanted moves to the new one.
- **One condition:** the split fix's description carries it in plain
  words: "places you've already been stay with the old trip".
  Then it's understood, not hidden.

### 2. The tie-break when a continent has two trips: plumbing, but rule 2's wording must change
- After a split, rule 2 ("one trip per continent at a time") is no
  longer literally true. A person reading it would predict wrong, so the
  rule as written is the bug, not the tie-break.
- **Reword rule 2 to what actually happens, which is simpler:**
  > **"A place joins its city's trip. A place on a continent where you
  > have no trip starts one quietly."**
- Trips then follow cities: rule 1 picks the city, and the city carries
  the trip.
- "Nearest city's trip" and "most recently added-to on a tie" sink into
  plumbing, because a person never needs them to predict the common
  case.
- Still three rules; none added.

### 3. The overview at phone size: passes, with one edit
- It's shorter (2911), with one idea per card, every number marked "we
  think", and the price plainly said.
- **Edit:** card 1's rule 2 takes the wording above, in concept 1's file
  and jobs.md Terms as well.

### Scores
- Concept 1: 9.
- Concept 2: 9.
- Concept 3: 7.
Unchanged; the work only got simpler.

NEXT: product designer (systems focus) — reword rule 2 (overview,
concept 1, jobs.md Terms) and add the "places you've already been stay"
line to the split fix. After the checker passes, the orchestrator sends
the overview and the seven live questions (Q1-Q6, Q8).

## Turn 21 -- product designer (systems focus): Turn 20 and check 4 applied (final pass)

No rules added. Everything the check found that would have needed a new
rule is now a one-line **Known limit**.

- **Turn 20:**
  - Rule 2 now reads "A place joins its city's trip. A place on a
    continent where you have no trip starts one quietly." It's changed
    in concept 1, concept 2's rule list, jobs.md Terms and the overview.
  - The split fix now says "places you've already been stay with the
    old trip".
- **1. Predictability (concept 1):**
  - Rule 1 judges each place by its own distance. The memory holds
    **only the owner's town fixes**, so a remembered town never pulls a
    place beyond a day trip.
  - Worked case, the Golden Circle: Þingvellir → Reykjavík; Geysir and
    Gullfoss → a city "Bláskógabyggð", in either order; one fix puts
    them all under Reykjavík.
  - Rule 3 lists all three town fixes (goes with, is its own, also
    belongs with), "every place in that town, now and later", the split
    line, and merge.
  - T2 uses "also belongs with". T4 is now in the test table.
  - The trip a place joins follows rule 2. Plumbing only covers a brand
    new city (the nearest city's trip) and a city in two trips (the
    most recently added-to).
  - A city is a group of places, so contradiction 1 (global memory vs.
    one trip) is gone: a fix applies to the named city in whichever trip
    the place lands.
- **2. Concept 3:**
  - The heading is now "Trips worked out, not kept".
  - Rule 3 is the town fixes plus "together" / "separate" (no split or
    merge); C8 matches.
  - "How you move: as concept 1", plus everything. That closes J2, J3,
    J4, J8 and J11.
  - Rule 2 says either time links.
  - T4 is honest: 2028 separates only if no 2026 place is visited in
    2028.
  - The prerequisite adds the "first visited" field.
- **3. Known limits (one line each):**
  - **Concept 1:**
    - a repeat trip across several cities;
    - a plan crossing a split city (it shows in both trips);
    - a merge dropping a custom name;
    - adding outside the current view;
    - the anchor rename and reach as a range.
  - **Concept 2:**
    - the loop trip;
    - a hotel within reach;
    - hotel dates pending Q4.
    - "An airport is never on a stretch" was underivable, so it's
      dropped. Hotel = the Hotel category, stated.
  - **Concept 3:**
    - chaining (including the 2026 leftover);
    - visits re-forming trips.
- **4. Today:**
  - J3 PASS on the letter (the city filter and the map share
    `visibleLocations()`; the seeded city isn't a city in your head);
  - T4 FAIL added;
  - C4 removed;
  - "From" and "real city" replaced.
  - jobs.md's reference line now reads: passes 3 and 11.
- **jobs.md:** job 10's check is now "separated by fixes, never per
  place (one split per city it covers)".
- **5. Overview:**
  - card 3 heading and text (rule 1, town fixes, together/separate, the
    chaining cost, the first-visited record);
  - rule 2 reworded; rule 3 is fuller;
  - the price lines are darker (#24323f) and slightly larger (38px);
  - the footer says "real town";
  - re-rendered at 1170x3133 and read at phone size.

**Changed ids for the checker:**
- concept 1: rule 1/2/3, T2, T4, J10;
- concept 2: T2 (no stretch claim);
- concept 3: J2, J3, J4, J8, J11, C8, T4;
- today: J3, T4, C4 (gone);
- the overview.

NEXT: fresh checker (light pass on the ids above); then the
orchestrator sends the overview and Q1-Q6, Q8.

## Turn 22 -- product designer (systems focus): check 5's two claims (honesty edits only)

No new rules.

- **F0, reach and the Golden Circle:**
  - Concept 1's plumbing and jobs.md Terms now say reach is a
    **straight line** to the anchor. The anchor is **the centre of the
    city's own places** in its biggest town, never a municipal seat.
  - The Golden Circle case is redone with approximate straight-line
    distances (from known coordinates, **not measured**):
    - Reykjavík → Þingvellir about 41 km, → Geysir about 81 km, →
      Gullfoss about 90 km;
    - Geysir → Gullfoss about 10 km, → Þingvellir about 41 km.
  - Results:
    - Geysir sits at the edge of reach.
    - **Þingvellir is roughly a tie and can land either way.**
    - One fix settles it.
  - "Near-ties between two cities" is added to Known limits.
- **F1, concept 3's T4:**
  - It's graded **FAIL for a repeat trip to the same city**. When the
    places chain, "separate" is keyed by cities, Copenhagen is in both
    trips, and nothing says which places go where.
  - It moves into Known limits as a one-liner.
  - Berlin still passes.
  - jobs.md T4 says so.
- **J10 (jobs.md):** a multi-city repeat now reads "one split per city,
  plus merges to rejoin them", matching concept 1's limit.
- **Concept 2:** "only Hotel-category places are stays, so an airport, a
  district or a street is never a base".
- **Overview:** card 3's cost now says a repeat trip to the same city
  can't be separated. It was re-rendered (1170x3185) and read at phone
  size.

NEXT: orchestrator — send the overview and Q1-Q6, Q8.

## Turn 23 -- product designer (systems focus): the owner's reframe (city buckets, trip tags)

The owner, after seeing the three-model overview (verbatim):

> "ok re trips im actually coming to a realization. really what i need is
> a way to group cities.. something more conceptually like a tag that
> creates the conceptual connective thread. cities should probably
> continue to operate as today — where they are something set based on
> location of a pin (or somehow manually...i dont think i can do that
> today). items can also be outside of that city today and still be
> considered part of that city... in this mental model the city is more
> of a bucket than an actual city — i'd think about it like "the
> copenhagen part of the trip" or "im going to LA"... sometimes that's
> the whole of the trip, sometimes that's part of a larger trip... i
> should be able to somehow group cities together into a meta-trip and
> then show / hide on the map based on that"

Fact: the City select is auto-guessed from the pin and can be overridden
at add (`userOverrodeCity`); nothing changes after adding.

**The new model** (`concepts/5-city-buckets-trip-tags.md`). It has
three rules and no plumbing:
1. Every place is in one city bucket: guessed from the pin, overridable
   at add (as today), and it can hold places outside its real bounds.
2. A trip is a tag on cities, made whenever you like, after logging.
   It's optional.
3. Showing a trip shows its cities' places, in the list and on the map
   together (it's a filter); hiding it hides them.

**The open questions, answered at sketch level:**
- **Made without setup:** nothing needs a trip, so logging is exactly
  today's. Tagging is admin, but after the places.
  - One optional default (Q-A, we think yes): a city created while
    you're looking at a trip joins it.
- **A city in several trips:** yes, it's a tag.
- **A city outside every trip:** a plain city, as today.
- **The city filter:** stays, one level below the trip.
- **Plans:** unchanged; a trip shows the plans with a stop in its
  cities.
- **Show/hide:** it's a filter, so the list and the map move together
  (the CLAUDE.md rule), never map-only.

**Kept and dropped:**
- **Kept:**
  - the real town on each place (stored, for job 6 later);
  - places-first;
  - and possibly "nearest city within about a day trip" as the add-time
    guess, stated as the guess itself, never hidden (Q-B, we think
    yes).
- **Dropped:**
  - figures, anchors, town memory and town fixes;
  - automatic trips, continents, splits, merges and the time gap;
  - On the way and the border;
  - stays and order, which are parked.

**The prices:**
- A wrong city can't be fixed after adding until place edit exists.
  That's now the model's one missing piece, and the owner named it.
- A repeat trip to the same city shows the old places too, unless the
  owner makes a separate bucket ("Copenhagen 2028").
- Tagging is a manual, after-the-fact step.
- One bucket per place (Kastrup is in Copenhagen or Malmö, not both).

**Owner questions:**
- **Answered by the reframe:** Q1, Q2, Q5, Q6 and Q8.
- **Parked:** Q3 and Q4 (stays, order).
- **New:**
  - Q-A: does a new city join the trip you're looking at?
  - Q-B: should the city guess be the nearest city within a day trip?
  - Q-C: can several trips show at once? We think yes.

**Not done:**
- jobs.md and the overview still describe concepts 1-3. They need
  rescoping to this model once the director scores it.
- Concepts 1-4 are left as the record.

NEXT: director — score concept 5 against the owner's words and
places-first, and rule on Q-A/Q-B/Q-C before any jobs.md rewrite.

## Turn 24 -- design director: concept 5 scored; Q-A/B/C; the rescope

The owner's reframe (verbatim in `owner.md`) is the owner's own model:
"a way to group cities.. something more conceptually like a tag", "the
city is more of a bucket", "group cities together into a meta-trip and
then show / hide on the map".

### Score: concept 5 = 9
- **Against the owner's words:** it's the owner's model, said back in
  three rules.
  - "Bucket" and "the copenhagen part of the trip" → rule 1.
  - "a tag … connective thread" → rule 2.
  - "show / hide … based on that" → rule 3.
  - "sometimes that's the whole of the trip, sometimes part of a larger
    trip" → a city in any number of trips.
- **Places-first:** logging is exactly today's. Trips never stand
  between the owner and a place; tagging comes after.
- **"Sings":** a person can predict everything from three sentences.
  It's simpler than any of concepts 1-3, and that's the strongest signal
  in this loop.
- **Why not 10:** it leans on one thing that doesn't exist. **A place in
  the wrong bucket can't be moved after adding.** The owner named it
  ("or somehow manually...i dont think i can do that today"), and every
  repeat-trip and wrong-guess case lands on it. That's the honest gap,
  and it becomes a question (Q-D), not a rule.

### Q-A, Q-B, Q-C: each goes to the owner as "we think"
- **Q-A: a city created while looking at a trip joins it.**
  - We think yes. It's places-first, it's visible as it happens, and a
    trip's tags can be changed any time. That's a trip-level change, not
    a place edit.
  - The risk: it's the one place the current view decides something.
    Said plainly.
- **Q-B: the city guess is "the nearest of your cities within about a
  day trip".**
  - We think yes. It's the one piece of concepts 1-3 that serves job 5
    (the Blue Lagoon in Reykjavík without a pick), and it changes
    nothing else.
  - The day trip is still an unmeasured "we think 60-80 km". A pick at
    add still overrides it.
- **Q-C: several trips shown at once.**
  - We think yes: it's a filter, like categories, and the list and the
    map move together.

### New owner question
- **Q-D: moving a place to another city after adding.**
  - This model needs one edit and no other: change a place's bucket.
  - Should that one edit come with trips, or wait for full place
    editing?
  - We think it comes with trips. Without it, a wrong guess and the
    repeat trip have no fix.

### Missing from concepts 1-3 that's worth keeping
1. **Both truths on a place.** Keep, as a model statement: a place
   exposes its bucket **and** its real town ("Reykjavík · in Grindavík").
   Concept 5 stores the real town but says "shown later". Keep job 13 as
   a model requirement, so the Blue Lagoon never pretends to be in
   Reykjavík.
2. **The bucket's name is the owner's.** The owner said earlier the
   grouping "may be a city name or something else". The model should say
   a bucket can be named anything ("Golden Circle", "Copenhagen 2028"),
   and new buckets are made at add, as today's "new city".
3. **Nothing structural is *required* at add.** The bucket is pre-filled
   by the guess and never blocks ADD. Today's add form puts City first,
   which is why today failed P. Concept 5 says "as today", so keep the
   requirement explicit: guessed and overridable, never asked.

**Dropped, rightly:** the town memory, automatic trips, continents,
splits, On the way, the border and stays. All of that was the team
solving a problem the owner has now dissolved by naming the model.

### Obvious answer, or alongside alternatives?
- **The obvious answer.** It's the owner's own model, stated by the
  owner, and plainly simpler than everything the team proposed.
- Sending concepts 1-3 beside it would ask the owner to re-argue a
  decision the owner just made. They stay in the repo as the record.
- One line in the send says so: "Earlier models (trips by rule) are kept
  on record if you ever want trips to form by themselves."

### Rescope

**jobs.md, rewritten for concept 5:**
- P: unchanged.
- The rest of the jobs, as model checks:
  1. Log a place with no trip.
  2. A place can be in a bucket outside its real town (the guess or the
     pick).
  3. The real town is exposed beside the bucket.
  4. Trips are tags made after, any number, a city in several.
  5. Showing trips narrows the list and the map together; several at
     once (Q-C).
  6. The city filter sits under the trip.
  7. Plans show in a trip when a stop is in its cities.
  8. A repeat trip works through a separate bucket.
  9. Nothing structural is required at add.
- **Retire:** creation moments C2-C9 (automatic trips and figures).
  Keep C1 (the first open).
- **Re-run T1-T4 under concept 5:**
  - Malmö is its own bucket, as today;
  - Kastrup is in one bucket, with the trip grouping both;
  - Jönköping is the guess or the pick;
  - Copenhagen 2028 is a separate bucket.
- The guess (Q-B) and the move edit (Q-D) are marked pending.

**Overview: one card, not four.**
- Concept 5's three rules in the owner's own words where possible.
- The prices:
  - one bucket per place;
  - a wrong bucket needs the move edit (Q-D);
  - a repeat trip needs its own bucket;
  - tagging is a step done afterwards.
- The two truths, in one line.
- Questions: Q-A, Q-B, Q-C, Q-D. Q3 and Q4 are noted as parked with
  stays.
- The one record line about earlier models.

NEXT: product designer (systems focus) — fold items 1-3 above into
concept 5, rewrite jobs.md and the overview to the rescope; then a fresh
checker.

## Turn 25 -- product designer (systems focus): Turn 24 applied (concept 5 rescope)

- **Concept 5 folds in the three kept items:**
  1. **Both truths:** a place shows its bucket and its real town
     ("Reykjavík · in Grindavík").
  2. **A bucket is the owner's to name:** anything, including "Golden
     Circle" or "Copenhagen 2028", made at add as today's new city.
  3. **Never asked:** the bucket is pre-filled by the guess and never
     blocks ADD. This is now rule 1's own text.
  - Q-D is added (we think it comes with trips). The move edit is now
    the model's one stated gap.
  - Q-A's risk is said plainly: it's the one place the view decides
    something.
  - An "On record" line covers concepts 1-3.
- **jobs.md is rewritten as concept-5 model checks:**
  - P, plus the reframe quote beside the earlier owner words;
  - Terms: bucket, real town, trip, showing a trip;
  - checks 1-9 as the director listed them, plus 10 (a wrong bucket
    can be fixed: PASS only with Q-D);
  - C1 is kept and C2-C9 are retired.
- **T1-T4 under concept 5:**
  - T1 PASS: Malmö is its own bucket; a trip tagging both cities shows
    all of them.
  - T2 PASS: Kastrup is in one bucket, by design.
  - T3 PASS: the guess or the pick.
  - T4 PASS with Q-D: Copenhagen 2028 is its own bucket; 2026
    leftovers need the move.
- **Today, for reference:**
  - it passes 1, 2, 6 and 7;
  - it fails 3, 4, 5, 8, 9, 10 and C1.
- **Prerequisite:** only check 3 needs the backfill for the 59.
- **The overview is one card,** re-rendered at 1170x2011 and read at
  phone size. It holds:
  - the three rules, quoting the owner where possible;
  - both truths in one line;
  - the costs;
  - Q-A to Q-D (we think yes);
  - Q3 and Q4, parked with stays;
  - the record line about earlier models.

NEXT: fresh checker — run jobs.md (concept 5) and the overview.

## Turn 26 -- product designer (systems focus): the owner's answers and check 6 folded into concept 5

**The owner's answers** (verbatim in `owner.md`; copied into concept 5
as written):
- **A:** "it should be able to add a city to a trip when adding a city,
  it should not be or feel required. in fact it should not feel very
  high prominence at all imo."
- **B:** "Yes. the address needs to comfortably balance the idea of the
  city it belongs to in the app vs the city the address actually places
  it". Both truths are now owner-backed; the "we think" on them is
  dropped.
- **C:** "yes".
- **D (as answered, trips at add):** "When adding a place to a city, it
  should automatically be added to any relevant trips. BUT you should
  not add cities to trips inside of the ui of adding a place."
  - Open: "Im ambivalent/not sure if you should see the associated trip
    alongside the city when adding a place."
- **Repeat trips:** "a repeat trip to the same place should not change
  the pins -- if i go back to a place i may want to see all the places i
  noted prior / which i visited / etc". There's no "Copenhagen 2028"
  bucket: the same city is tagged into the second trip.
- **Many trips per city** (the owner's current guess, not a hard rule):
  "my guess right now is that i should be able to assign a city to many
  trips".
- **Q-D:** "if the app puts a place in the wrong city you should be able
  to edit the city attached to the place. you should not be able to edit
  the trips the city is attached to".

**Check 6 fixes:**
1. **The guess is fully stated:**
   - the nearest bucket within about a day trip (we think 60-80 km,
     unmeasured), measured to the centre of its places;
   - with none within reach (the first place, Jönköping), a new bucket
     named from the real town, made on ADD;
   - (we think) that replaces today's new-city question, since
     places-first rules out asking;
   - "exactly as today" claims are gone, and a "What changes from
     today" list replaces them;
   - co-located buckets: the guess can land in either, so pick by hand.
     A repeat trip never needs one now.
2. **The trip filter:**
   - none selected → everything;
   - some selected → places whose city is in any of them, so a city in
     two trips shows if either is selected;
   - "hide" = deselect; the last one off → everything;
   - (we think) there's no exclude mode: it's our reading of "show /
     hide", kept as one filter so list = map.
3. **C1 and the real town:**
   - C1: no buckets and no trips; search is worldwide; the first place
     makes its bucket.
   - Both truths are honest about the 59 places without a real town
     (58 fixable by the backfill; 1 has no town and shows the bucket
     alone).
4. **The overview is one card,** re-rendered at 1170x2420 and read at
   phone size:
   - the 60-80 km figure matches the file;
   - the 59 note is in;
   - A-D and the wrong-city edit are marked decided;
   - the one open question;
   - Q3 and Q4 are parked;
   - the record line.

**jobs.md:**
- Terms cover the guess, trip and filter.
- Check 2 cites the guess (about 40 km, approximate). Check 3 carries
  the 59 caveat.
- Check 4: tagging after or at city creation, never in add-place; auto
  trips via the city.
- Check 5: full filter semantics. Check 6: picks among the selected
  trips' cities.
- **Check 8:** a repeat trip doesn't change the pins.
- Check 9: always pre-filled.
- **Check 10:** the place's city is editable, never its trips (PASS).
- C1 is restated. T1-T3 are reworded.
- **T4:** Copenhagen is tagged into the 2028 trip; everything shows
  under both; no new bucket, no edit.
- Today: fails 3, 4, 5, 8, 9, 10 and C1; passes 1, 2 (by the pick), 6
  and 7.

**Every owner question is now answered except one:** whether adding a
place shows the city's trip.

NEXT: director — score concept 5 as answered, then a fresh checker
(light pass) before the summary goes back to the owner.

## Turn 27 -- design director: concept 5 as answered

### Score: 9
- Every rule now stands on the owner's own words:
  - bucket, and "the Copenhagen part";
  - trip tags;
  - pick trips to see them, several at once (C);
  - both truths (B);
  - the wrong city editable, its trips never (Q-D);
  - repeat trips re-tag the same city ("should not change the pins").
- Places-first holds, and the three rules are still predictable.
- Its one remaining team opinion (below) is labelled.

### The new-city pre-fill: it fits, with two conditions
- **It fits A ("should not be or feel required"):** nothing is asked and
  ADD is never blocked.
- **But it's a team call.** It replaces today's new-city question, and
  the owner said cities "should probably continue to operate as today".
  So:
  1. **Label it "(we think)" on the overview too.** Rule 1's "if none is
     that close, a new city named from the real town" is unlabelled
     there; the concept file has the label.
  2. **State what happens to a city made this way and trips.** It's
     created inside add-place, and D says "you should not add cities to
     trips inside of the ui of adding a place". So a city born at ADD
     joins **no** trip until it's tagged later, elsewhere. A's optional,
     low-key "add to a trip" belongs to making a city on its own, not
     to this path.
     - Concept 5, jobs.md (check 4) and the overview each get one line.

### The overview at phone size: reads, but one stale item
- **"Still open: show a city's trip next to it while adding a place?
  (You weren't sure.)" is answered.** The owner's last entry: "i
  actually dont think you should show the trip when adding a place …
  what matters is where you're putting the pin."
  - Move it to Decided ("**E** No trip shown when adding a place; what
    matters is the pin").
  - "Still open" then holds nothing but the parked Q3 and Q4.
  - The same goes for concept 5's file and jobs.md, wherever it's
    listed as open.
- Everything else reads cold:
  - one card;
  - "we think 60-80 km" labelled;
  - the 59 note;
  - Decided A-D plus the wrong city;
  - the costs;
  - the record line.

### No new owner questions
After E, everything is answered except stays (Q3, Q4), which are parked
by design.

NEXT: product designer (systems focus) — the three edits:
1. the "we think" on the overview's new-city pre-fill;
2. the line that a city made at ADD joins no trip until tagged later;
3. E moved to Decided in the overview, concept 5 and jobs.md.
Then a light checker pass, and the summary goes back to the owner.

## Turn 28 -- product designer (systems focus): Turn 27 and check 7 applied (final edits)

- **From Turn 27:**
  1. The whole new-city naming rule is marked "(we think)" in the file
     and the overview. It's a team call: it replaces today's question,
     and the owner said cities "should probably continue to operate as
     today".
  2. **A city created by adding a place joins no trip until it's tagged
     later, elsewhere.** This is now in concept 5's rule 1, jobs.md
     check 4 and overview rule 2.
  3. **E is decided: no.** The owner, verbatim: "i actually dont think
     you should show the trip when adding a place because what if you're
     going to a place multiple times ... it would be impossible to
     determine which trip you're thinking about. and honestly it doesn't
     even matter... what matters is where you're putting the pin."
     - Concept 5 now says "Nothing is open".
     - jobs.md check 4 now includes "adding a place never shows a trip".
     - The overview shows E under "Decided (nothing is open)".
- **From check 7:**
  4. **The empty city:** the guess is now measured to each city's
     **stored centre** (we think). Every city carries one today
     (`CITIES[...].center` in index.html); a new city's centre is its
     first place's location. So an empty seeded or self-made city can
     be guessed, and a nearby place never starts a duplicate. This
     replaces "the centre of its places".
  5. **Q-B credit:**
     - the owner's "Yes" covers "nearest city within a day trip";
     - the 60-80 km figure and the stored-centre measure are both
       "(we think)".
  6. **Wording:**
     - the real town is "used only to name a new bucket, never to pick
       an existing one";
     - the city filter moved into "What changes" (it narrows to the
       selected trips' cities);
     - first open (no seeded cities on a fresh start, worldwide search
       from the start) added to "What changes".
  7. **The overview:**
     - "Hiding a trip means unpicking it";
     - many trips per city is marked "(your current guess)";
     - re-rendered at 1170x2389 and read at phone size.

Every owner question is now answered; Q3 and Q4 stay parked with stays.

NEXT: orchestrator — send the overview to the owner.
