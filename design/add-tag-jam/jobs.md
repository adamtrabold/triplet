# Add tag + city control: jobs and checks

Model level, not UI: each check says what must be true, never how it
looks. The owner's words are in `owner.md`; trips are dropped; the city
model is `../trip-location-model/concepts/5-city-buckets-trip-tags.md`
minus trips (a city is a bucket).

**Places-first (P) governs every job:** nothing structural is asked or
blocks ADD.

## Today (checked in `index.html`, 2026-10-15)

- **The city control filters, it doesn't just navigate.** Picking a city
  (`setActiveCity()`) frames the map on it **and** sets `filters.city`,
  so `visibleLocations()` hides every other city's places on the map
  **and** in the list. Only "All cities" shows everything. Re-tapping
  the active city re-frames the map (the recovery path). The choice
  persists. The owner thought it only moved the map.
- **The add form:** the City select comes first (guessed, overridable,
  `userOverrodeCity`); a pin outside every city asks a new-city question
  (`maybeDetectCity()`); TYPE is already a `<select>` (`#categoryInput`);
  STAR exists at add (`#starInput`); **visited can't be set at add**
  (the insert writes `visited: false`).
- **The blank tag concept** (round 10, `../add-button-placement/
  concepts/blank-tag-form/`): TYPE as a row of pins (the owner now
  wants a select); the city as a tappable word in the address line;
  ADD | STAR | MARK VISITED in the stub.

## 1. The city in the add tag

1. **The guess fills it.**
   - PASS if, after a pick, the city is pre-filled with no question: the
     nearest of your cities within about a day trip (we think 60-80 km),
     else a new city named from the real town (the team's call).
   - FAIL if a question appears, or ADD waits on the city.
2. **Both truths, readable at a glance.**
   - PASS if the tag shows the city the place is filed under **and**
     where it really is, and a reader can't mistake one for the other
     (the Blue Lagoon: filed under Reykjavík, really in Grindavík).
   - When the two are the same (Sundhöllin, Reykjavík), it's said once.
   - With no real town (59 of 202 today), the city shows alone.
   - The owner: "the address needs to comfortably balance the idea of
     the city it belongs to in the app vs the city the address actually
     places it".
3. **Changing it at add.**
   - PASS if the city can be changed from the tag in about one step,
     choosing from your cities or a new one; the pin doesn't move; the
     real town doesn't change.
4. **A new city.**
   - PASS if a new city is visibly new before ADD (so the owner knows
     one will be made), is made only on ADD (cancel makes nothing), and
     an existing city can be chosen instead.
5. **Later.** The city stays editable after adding (owner, decided). Not
   the add tag's job; listed so the tag doesn't contradict it.

## 2. TYPE as a select

6. **One choice, shown as a choice.**
   - PASS if the closed tag shows only the picked type (its word, and
     its pin if wanted), not every type's icon. The owner: "i dont like
     seeing all the icons in the tag".
   - PASS if opening it lists every type; icons there are allowed ("they
     may be helpful iin the dropdown?").
   - PASS if the type's word is always shown with any icon (colour alone
     is never enough), and the pin above the tag follows the pick.

## 3. Star and visited at add

7. **Star at add.** PASS if the place can be starred before ADD and is
   saved starred; optional; one step. (Exists today.)
8. **Mark visited at add** (owner: "yes"). PASS if the place can be
   marked visited before ADD and is saved visited; optional; one step.
   (New: today's insert can't.)
9. **Both are reversible before ADD,** and neither changes the city or
   the type.

## 4. The city control: go to vs. show/hide

10. **Go to a city (common).** "i do like having a way to quickly center
    myself on a city … navigate around to my cities with stops".
    - PASS if, from anywhere, one step frames the map on a city's
      places.
    - PASS if going there **changes nothing about what's shown**: pan
      to Malmö afterwards and Malmö's pins are there, and the list's
      membership is unchanged.
    - PASS if going to the city you're already at re-frames it (today's
      recovery path).
11. **Show/hide cities (rarer).** "i also feel like i need a way to
    show/hide the cities i care or dont care about".
    - PASS if any set of cities can be hidden and shown again; all are
      shown by default; the choice persists.
    - PASS if a hidden city's places leave the map **and** the list
      together (CLAUDE.md: "A list shows everything that matches the
      active filters, full stop").
12. **The two never mix.**
    - PASS if going to a city never changes which cities are shown, and
      showing/hiding never moves the map.
    - Edge (needs a call): going to a hidden city, and adding a place
      into one. See jam.md.
13. **The list.**
    - PASS if the list holds every place in every shown city that
      matches the other filters, never gated on the map's viewport or
      on the city you went to.
    - Order may change (for example the city you went to first);
      membership may not.
    - Clicking a list item still navigates the map to it (CLAUDE.md).
14. **Plans still work.** PASS if the plan view's rules (the open plan's
    stops always show) hold with hidden cities.

## Out of scope

UI and visuals (the visual designer's), trips (dropped), place editing
beyond the city (future).
