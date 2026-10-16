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

2026-10-16, canvas comments:
> alignment of both of these dropdowns are weird
> nothces arent cutting out -- did something change in tag design or is this just an artifact of it being a sketch?
> same here re: design change -- is this a sketching artifact?
> maybe instead of city we refer to *this* level as trip? run that idea by the team -- the pro is that it would clarify this situation, but the con is that usually it *will* be a city
> (on the "FILED UNDER / Reykjavík" alternative) we do not need this on every tag. it probably only needs to be there when editing
> (on Star + visited at add) we don't need to change how visited marking works at all. do not tuch
> (on Go to 1: menu under the list title) hmm i hadnt considered changing the ui for selecting a city. maybe this is better than having the filter panel chips -- certainly clearer from a ux perspective. how do plans work here?
> (on SectionHeaders, variant A — heading row on the list grid: locate glyph = go to, name at 56, count + hide eye) i really like this header.
> (on PlansGoTo) what does selecting a plan vs selecting a city look like?
> (on StarVisited) is this just a mock of the visited badge? looks nothing like the real one
> (on GoToMap) let's polish up the screens now that we're starting to align -- pull in the real elements everywhere
> (on header A) this doesnt feel like the right place for the number... it also doesnt match approaches elsewhere... we should get to the best thing (e.g. niether is perfect) and align
> (on TypeOpen tag) this feels good, but i'm curious -- does the city selection scope search? if so, maybe it should be treated differently and put somewhere else. may need some divergent thought here.

Fact (orchestrator, index.html `nominatim()` / `formCityId()`): yes — today the add form's city scopes the search: it appends the city's `geocodeSuffix` to the query, applies its `countrycodes` as a HARD filter, and its `viewbox` as a soft ranking hint (search widens on a miss).
> (on CityDifferent "in Grindavík") i dont think we need to show when it's different from the real town
> (on TypeOpen menu) this dropdown feels good, but alignment is odd. lets left align all content and put the check on the right
> (on CityNew badge) this badge isn't perfect, i want it to have more of the app's personality. give this to the team
> (on CityAlternatives "FILED UNDER / Reykjavík" top-right) i do like this top right city tag thingy. this is not the right execution, but in regards to my comment about the city scoping search, this direciton (again not specific ui) would help with that by making the city both higher level heirarchy but also still make sense. selecting a city before typing an address from a ux perspective feels odd... having it here feeling more like metadata is really clear from that angle
> (on TYPE open) is this our dropdown style? struggling with what to give feedback since this is supposed to be a sketch but it's looking like its using the design system
> (on Go to 2's section header) alignment reads funky here -- i do like the clear sightlines, but there's something off about this table header. keep pexploring.
> (on Go to 3's badges) i like having a badge for the city at a zoomed out level. it's nice. are these clickable? would be cool to zoom in if you did.
> (on Go to 3's badge) i also think about the fact that the map itself will have a city name... so what this is really communicating is "there is a trip here and this is the city" -- i wonder if it needs something to communicate the first half (an icon or something?)
> (on Go to 1's menu) everything should go full width inside a dropdown
> (on Go to 1, the go-to icon) i preferred the older icon.. i know we're working on thsoe in a different thread, but lets put it back. this is the "my location" button right now so it's confusing.
> (on Go to 2, header A) actually i dont think it want an icon in the table header... let's just drop it and align the header text with the edge of the icon
> (on Search 2, the near chip) no this is far too complex.
> (on TYPE open) this dropdown is far too wide -- what should it actually do? when i said full width i meant the dividers should stretch the full width of the dropdown window
> (on Changing the city, the menu) lets treat all dropdowns the same -- also the distance between dropdown select and the actual list is massive
> (on Plans, plan vs city) the plan vs city selection is far too complex. let's simplify it to as few separate actions as possible with extreme clarity between picking a plan or city and then the "go to" sections within a plan
> (on CityChange, in the City/Trip naming thread) this is great. no feedback on this screen anymore
Read as: the CityChange screen is approved as drawn (label "City"); the naming question closes on City.
> (on CityNew, mark C, the rubber stamp) this with just "new"?
> (search scope thread) is there some sort of open source or available search model that achieves this? im worried we wont be able to build something as robust as what may already exist that we could integrate
Orchestrator answer (thread 5baf422c): Photon (komoot, OSM, autocomplete + lat/lon location bias; free fair-use public API or self-host) recommended first; alternatives Mapbox Search Box, Google Places (terms restrict non-Google maps).
> (on PlanCity1, Option 1's title menu) no you are not thinking deep enough. think about the model. there are places and there are plans. there may be a bunch of both. they dont make sense in the same list so there either needs to be a different view or a different button for plans vs places
> (on the section-header board, variant B's "Reykjavík") i like this type size for the city name
> (on the section-header board, the tally "23") i like this for the number count
> (on the section-header board, the eye beside it) i like this for the show / hide
> (on Go to 3's list header "All places (202)") the type size here is good for overall header. the number should match what we do in the list headers...maybe that type size will be too small though
> (on Go to 1's menu) this is great but how do you pick a plan
> (on the list header "▼All places (202)") i wonder if collapse shouldn't live somewhere else to not confuse with the dropdown select. also is this the right icon for collapse or could we do something more different.

## 2026-10-16 (canvas threads, round b)
> (on CityNew's NEW stamp) i like this but i want it closer to the dropdown than closer to the edge
> (on CityAsMetadata, execution 1) this *feels* good but looks really ugly and doesnt feel like rational placement
> (on GoToHeader's Go to menu) this is looking good but nearest and hidden are oddly placed / baselines aren't aligned. also im not really sure if we need either text there. hiddens are already visually hidden and i probably know what city i'm near
> (on the section header) good for now... though now im wondering if the header is separate enough visually
> (on GoToSections' "Hidden: Malmö  Show" row) this ui is awkward
> (on GoToMap's fit button) what is this icon?
> (on GoToMap's little-tag badge B) i like tying to the tag but i dont think this is quite there yet
> (on Collapse option B's header) i like this icon but im not sure if placement is right or treatment
> (on Collapse option C's LOWER tab) i love this but itll get in the way of the + and it clutters up the map. maybe the icon in the version above in here would be good with no text? and then it could be right aligned? idk if that will feel messy
> (on Collapse option A, the grab handle) maybe this is the most elegant approach?
> (to the team) lets clean up the jam design board -- want to know what to pay attention to
