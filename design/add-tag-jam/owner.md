# Owner's words — add tag + city filter jam (verbatim)

2026-10-15:
> today doesnt show one city at a time, the filter panel just takes you to that city. it doesnt "hide" the other things if i scroll over does it? if it does im not sure if i like that. i do like having a way to quickly center myself on a city, but i also feel like i need a way to show/hide the cities i care or dont care about. i actually think it would be less common for me to hide a city than to just want to navigate around to my cities with stops.
> i think the "type" should be a select in the tag -- i dont like seeing all the icons in the tag. but they may be helpful iin the dropdown?
> im still no sure how the city thing works in the tag here. i thin it would be better for us to jam in a design canvas
> (design system) we should create one for this app if not

Fact: today a city chip hides other cities on map AND list (`visibleLocations()`); only "All cities" shows everything.

Decided earlier (see design/trip-location-model/owner.md): trips dropped ("drop"); a place's city is a bucket guessed from the pin (nearest city within ~a day trip, else new city named from the real town — team's call), editable at add and later; both truths shown ("the address needs to comfortably balance the idea of the city it belongs to in the app vs the city the address actually places it"); mark visited while adding: "yes".

Prior add-form work: design/add-button-placement/concepts/blank-tag-form/ (round 10 stills R10-*.png, how-it-works.md). The + badge is shipped.

Canvas: https://claude.ai/artifact/6aSGgGczYGfWGP1UqTDGP3 (empty, Design type)
Design system: Triplet — https://claude.ai/artifact/JXWsMZs32JyKdcEzakKrPW
