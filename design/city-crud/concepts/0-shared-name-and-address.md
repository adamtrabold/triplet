# Shared by every concept: NAME and ADDRESS are two lines, and each one searches

Owner: "Name and address should be separate." "I could not type the address in I had to put it in
the name which was confusing."

Stills: `stills/1-today-and-address.png` (raw: `T1-today`, `S1-address-search`, `S2-address-picked`).

## How it works

- The add tag keeps its lines (city, NAME, ADDRESS, NOTES, TYPE). ADDRESS stops being a read-only
  printout and becomes a line you can write on, exactly like NAME (caption printed on the empty
  line, pencil ink, the rule turns navy while you type; 16px entry so iOS never zooms). **While a
  line is being written on, its caption stays printed above the entry** (ADDRESS over the typed
  address, as the City Label's rename keeps CITY NAME), so it's never in doubt which line you're
  on; an empty NAME line above still shows NAME.
- **Typing in NAME** searches by name (today's search, unchanged). **Typing in ADDRESS** runs the
  same worldwide search with what you typed; its results open under the ADDRESS rule. Result rows
  are today's ("1007 North Orange Street / Address · Wilmington, United States").
- **A pick from either line fills both.** ADDRESS gets the pick's short address. NAME: if you've
  typed a name, yours stays; if NAME is empty, it takes the pick's own name, or "street number" for
  an address hit (today's rule).
- **After a pick, NAME is just the name.** Typing in it no longer searches (so "Rental, night 2"
  doesn't throw "No places called that"). To find a different place, write in ADDRESS or clear it.
  (Changes the phase-2 W1/W2 behaviour, where editing NAME after a pick re-ran the results; flagged.)
- ADD's hint reads NAME IT FIRST only when NAME is empty after an address pick.
- Before any pick, the city line no longer shows a far-away city (today it printed REYKJAVÍK on an
  add in Pennsylvania): with no city near the map it shows the printed caption CITY.

## Why

A place's name and its address are different facts; the owner's rental, a friend's house or a
trailhead car park has an address and no name. Keeping both lines live means nobody has to know
which kind of search to use: you write the fact you have on the line it belongs to.

## Jobs

J5 (address), J6 (name separate), J14 (address-only place, my name). The rest are the concepts'.
