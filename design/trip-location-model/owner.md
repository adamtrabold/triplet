# Owner's words (verbatim)

2026-10-15 (from the + placement session):
> ok on the model -- i am thinking we really have a high level model like this ——  there are the "locations" (things you want to visit), "cities" they exist in, and "trips" they may be grouped to. there are also "plans" which may include "locations" in many "cities." i may as a user be starting from a few different points... i might be planning stops across a large trip (e.g. "scandinavia 2026" may include spots in copenhagen, stockholm, reykjavik, etc. and places in between). or i might be planning for a specific "city" within that "trip." the real challenge is that mentally i might be thinking of a location being tied to a specific "city" that it doesn't specifically reside in, and so when navigating the app, i may want to click "Reykjavik" as a filter, but also want to see, like, the Blue Lagoon or the Airport that technically exist within other cities in reality.
>
> i want the team to deeply think about this and propose a model that can be reflected in the app workflow. the usabiity model does not have to match with how we store data. the app should be as simple and low friction as possible, while supporting my specific mental model and use case as closely as possible.
>
> i expect many ideas here, not a hard recommendation, unless they have one that is completely obvious and stands out meaningfully against the others.

Earlier, in the + placement work (design/add-button-placement/owner.md): "You're taking me to literal on the suburb use case — backing way out I need to be able to include a place in a city that does not match how I'm thinking about the trip which may be a city name or something else. Right now it's by city name. This is separate from filters which should have a filter by city." · Answers: editing a place = future; no save without an explicit ADD; hold-to-place = future (real maps/iPhone app).

2026-10-15:
> i want to be clear, im wanting to rev the app workflow as a whole not just fit in new ideas. i want to make sure it all sings.

Scope: a revision of the whole app workflow around the model, not new ideas slotted into today's app.

2026-10-15:
> i dont want full on visuals -- i just want sketch level thought here -- the model is what to nail right now not ui

Fidelity: sketch-level only; nail the model, not UI.

2026-10-15:
> we also need to think about how these things are created. e.g. if we have a trips model how do i create that -- i do not want someone to have to manually do a bunch of shit to set up a thing before they just start getting to logging the places they want to go

Constraint: creation must be near-zero setup — no manual setup before logging places; trips/cities/etc. should come into being as a by-product of adding places (or with minimal friction).

2026-10-15:
> the philosophical approach should be places-first; immediately doing the thing you actually want to do not the adin

Principle: places-first — you immediately do the thing you want (log/see places), not the admin ("adin" = admin). Structure (trips, cities, groups) follows from places, never ahead of them.

2026-10-15, after seeing the three-model overview (reframe — supersedes the concept set):
> ok re trips im actually coming to a realization. really what i need is a way to group cities.. something more conceptually like a tag that creates the conceptual connective thread. cities should probably continue to operate as today — where they are something set based on location of a pin (or somehow manually...i dont think i can do that today). items can also be outside of that city today and still be considered part of that city... in this mental model the city is more of a bucket than an actual city — i'd think about it like "the copenhagen part of the trip" or "im going to LA"... sometimes that's the whole of the trip, sometimes that's part of a larger trip... i should be able to somehow group cities together into a meta-trip and then show / hide on the map based on that

Fact check (orchestrator, index.html): today the add form's City select is auto-guessed from the pin's location and can be overridden by hand at add time (`userOverrodeCity`); there is no way to change it after adding (no place editing).

2026-10-15, answers to Q-A..Q-D on concept 5:
> A. Im not sure about complexity of ux here so thinking conceptually -- it should be able to add a city to a trip when adding a city, it should not be or feel required. in fact it should not feel very high prominence at all imo.
> B. Yes. the address needs to comfortably balance the idea of the city it belongs to in the app vs the city the address actually places it
> C. yes
> D. When adding a place to a city, it should automatically be added to any relevant trips. BUT you should not add cities to trips inside of the ui of adding a place. Im ambivalent/not sure if you should see the associated trip alongside the city when adding a place.

Note (orchestrator): the owner's D answers trips-at-add, not Q-D as asked (moving a place to another city after adding — with trips, or wait for place editing?). Q-D is still open.

2026-10-15, on repeat trips (concept 5):
> a repeat trip to the same place should not change the pins -- if i go back to a place i may want to see all the places i noted prior / which i visited / etc

Read as: no separate "Copenhagen 2028" bucket; a repeat trip tags the same city again (a city in two trips), and all its places, visited or not, show under both.

2026-10-15:
> my guess right now is that i should be able to assign a city to many trips

2026-10-15, answering Q-D (moving a place to another city):
> if the app puts a place in the wrong city you should be able to edit the city attached to the place. you should not be able to edit the trips the city is attached to

Read as: Q-D = yes, a place's city is editable after adding; from a place you never edit which trips its city is in (consistent with D: city↔trip tagging happens elsewhere).

2026-10-15, closing the last open question (show the trip when adding a place?):
> i actually dont think you should show the trip when adding a place because what if you're going to a place multiple times, or a second or third time or wahtever, it would be impossible to determine which trip you're thinking about. and honestly it doesn't even matter... what matters is where you're putting the pin.
