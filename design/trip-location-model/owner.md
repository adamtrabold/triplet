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
