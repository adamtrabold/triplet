# Adding a place: the city workflows, mapped

Systems, 2026-10-15. This answers the owner: "I don't understand the
workflow for the city thing — I think we need to map it out."

Sources:
- `design/trip-location-model/proposal.md` (discovery; its option B, "file
  day trips under the nearest base", was deferred);
- CLAUDE.md "Trips vs. cities restructure";
- the code: `detectCityContext()`, `nominatim()`, `nominatimWithFallback()`,
  `matchCity()`, `maybeDetectCity()`, `CITIES` and the `cities` table.

## How it works today, in one breath

- **Search:** it uses the city the map is showing (the nearest of your
  cities within 75 km of the map's centre). It **adds that city's name to
  what you type** ("…, Stockholm") and **allows only its country**. If
  that finds nothing, it tries once more with no name added and no
  country limit, still favouring the area on screen.
- **Filing:** a picked place goes under whichever of your cities' boxes
  contains it. If it's in no box, the app asks "Add [town] as a new
  city?".
- **No trips:** a city is both the filing bucket and the list you look
  at.

## The workflows

### W1. "It's Chicago to me, but it's really in a suburb"

1. You're looking at Chicago and type the place's name.
2. **Today:** the search becomes "name, Chicago, IL". A suburb's address
   doesn't say Chicago, so it may find **nothing**. Then the wider retry
   runs and usually finds it. *Can go wrong: a wrong same-name place
   inside Chicago wins first.*
3. You pick it. **Filing today:** if the suburb is inside Chicago's box,
   it's filed under Chicago. If it isn't, it asks **"Add Oak Park as a new
   city?"**, which is wrong for you: you think of it as Chicago.
4. **What it needs:** filing by *the base you think in*. A place near one
   of your cities goes under that city without asking (a suburb or a day
   trip; Reykjanes under Reykjavík is the same case, already in your
   data).

### W2. Planning ahead: paste an address

1. You paste a full address, for a city you aren't looking at, maybe
   one that isn't in the app yet.
2. **Today:** the pasted text gets the *current* city's name added
   ("…, Iceland") and Iceland-only, so it finds nothing. Then the wider
   retry finds it. It works, but slowly (two searches) and by luck.
3. You pick it. **Filing:** if the city exists, it goes there. If not:
   "Add Chicago as a new city?".
4. **What it needs:** an address carries its own location, so search it
   **anywhere, first time**.
   - File it by where it is, and create the city if needed.
   - **Then "coded to a trip":** a new city has no trip to belong to,
     because trips don't exist yet. That's the open part (below).
   - After ADD, the list switches to that city (job 14).

### W3. The hardest: just a name, could be anywhere

1. You type "Noma" or "Tivoli" with no address. You might be looking at
   any city.
2. **Today:** it's locked to the city on screen and that city's country.
   If a same-name place exists there, **that's all you see**. The real
   one in another country never shows, because the wider retry only runs
   on *zero* results. *This is the case that fails.*
3. **What it needs:** search everywhere, but **show what's near you
   first**, so a local "Tivoli" still comes first when you're at home in
   it.

### Inferred (marked)

- **W4 (inferred): adding where you're standing, on the trip.** The map is
  already on that city, so local-first is right. Nothing extra is needed.
- **W5 (inferred): a district or street.** The outline lookup (Overpass)
  needs a box. A suburb street outside your cities' boxes can't be
  traced; today it falls back to an "(approx.)" pin. It's the same
  filing question as W1. Deferred in the proposal, and still deferred.
- **W6 (inferred): seeing a business on the map and saving it.** That's
  your "future, with real maps" item. Out of scope.

## One rule for all three (recommendation)

**Search: always everywhere, nearest first.**
- One search, with nothing added to your words and no country lock. It
  leans toward the area on screen.
- The app then **re-orders** the results:
  1. places in the city you're looking at;
  2. places in your other cities;
  3. everything else, nearest first.
- Every row already shows its town, so you can see where each one is.
- This fixes W3 (the far "Noma" is in the list), W2 (an address finds
  itself) and W1 (the suburb is found, and found first because it's
  near).
- No buttons, no extra rows.
- *(The safety net, invisible: if none of the results is in the city on
  screen, the app also runs today's local search and puts any local hits
  first. That covers a common name where the world's famous one would
  crowd out the local one. It's a browser test; the sandbox can't reach
  the search service.)*

**Filing: by where the place is, then by the base you think in.**
1. Inside one of your cities' areas → that city. Inside two (Copenhagen
   and Malmö overlap) → **"Which city?"** on the tag.
2. **Near one of your cities** (within a distance you set once, say 150
   km) → that city, without asking. That's the suburb and day-trip case
   (W1).
3. Far from all of them → **"New city? [town]"** on the tag. That's W2's
   new city.

## Trip vs. city: what each workflow needs (not deciding the model)

- **W1 needs** a city to mean "a base", not a municipality. That works
  with or without trips; it only needs the "near one of your cities"
  rule and its distance.
- **W2 needs** a new city to belong to *something*: today it's just a
  new city among all the others. With trips it would join a trip ("Chicago
  2027"), and you'd see that trip's places, not Iceland's.
- **W3 needs** nothing from trips. The search rule covers it. Trips would
  only change "your other cities" to "this trip's cities".

## Open, for the owner

1. **The suburb and day-trip distance:**
   - (a) 100 km;
   - (b) 150 km;
   - (c) 200 km;
   - (d) always ask "File under Chicago?" when it's outside a city's
     area.
2. **Is a trip what you want to build next?** A trip = a name, maybe
   dates, and its cities. If yes: when you add a new city (W2), it joins
   the trip you're looking at, or asks "Which trip?". If not yet: a new
   city just joins the list, as today.
3. **After adding a place in another city or trip (W2), should the app
   jump there?** We'd say yes, so you see it land. It means you leave the
   city you were looking at.
