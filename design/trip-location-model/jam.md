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
