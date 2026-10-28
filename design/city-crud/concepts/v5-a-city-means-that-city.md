# v5 · Picking a city shows that city (CURRENT; supersedes v4's Remove placement, keeps v4's New city)

Owner on the v4 Remove still: "Why would Stockholm be shown if Malmö is selected", then, told that
going to a city never filters (a phase-1 team call, not an owner quote): "Oh I don't think I
realized that was the call I was making yeah that's weird".

Stills: `stills/v5/1-a-city-means-that-city.png`, `stills/v5/2-remove-city.png`.

## The list model (smallest change that does the job)
- **A city picked in the title menu is a filter again**, for both the list and the map. The list holds
  that city's places only (one section, no eye); the map draws only its pins and shapes. The title
  reads "MALMÖ 23", as it does today. CLAUDE.md's rule holds: the list shows everything that matches
  the active filters (city + category chips); zoom still gates only the map layer.
- **All places is unchanged:** every city in sections, each with its eye. The eye now matters only in
  All places (it hides a city from that view, list and map, signpost included). Below zoom 8 in All
  places the signposts show as today; a board tap picks that city (filters to it).
- In a single city, zooming out shows only that city's signpost. Other cities are a title-menu pick
  away. (Open question 2.)
- Adding a place that's filed in another city: after ADD the app switches to that city, so the new
  place's tag opens in a list that holds it (the shipped "reveal" rule, now a switch).
- Plans: unchanged (a plan shows its stops wherever they are; the add-from sections follow the
  picked city, or all cities in All places).

## What this undoes from phase 1 (2026-10-17)
- "Go to never filters" and the removal of `filters.city`: a picked city filters again.
- Scrolling the whole list to a city's section on go-to (`pendingSectionScroll`, `landingTrim()`): no
  longer needed in a single city (it stays for All places' section-name taps, if those keep going to
  a city; see below).
- A section header's name as "Go to" inside All places: kept, now it means "show only this city".
- Kept from phase 1: the title menu itself, city sections in All places, the eye, the collapse tab,
  the Plans list.

## Remove city: the foot of the city's own list
- With one city picked, its list ends with one quiet text button, **"Remove Malmö…"** (the plan
  foot's voice, `--ink-2`), after its last place, district and street. Not in All places, not in
  any menu, not on a tag: you only find it by picking a city and scrolling to its end. This replaces
  v4's "hide first, then Remove…" (there's no hidden header in a single-city list).
- The confirm (unchanged from v4): move its places to [city ⌄] (preselected only if a city is within
  70 km) or remove them too (with their plan stops); CANCEL / REMOVE. After removing: All places.

## Kept from v4
New city (title menu row → the built Find a city line → you land in the new, empty city: now its own
filtered, empty list); hand-picked cities are `auto_added = false` and survive cleanup.
