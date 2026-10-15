# Adding a place: groups and real cities (revised)

Systems, 2026-10-15. This replaces the first version of this file. The
owner, on that version:

> "You're taking me to literal on the suburb use case — backing way out I
> need to be able to include a place in a city that does not match how
> I'm thinking about the trip which may be a city name or something else.
> Right now it's by city name. This is separate from filters which should
> have a filter by city."

Read with:
- `design/trip-location-model/proposal.md` (earlier thinking);
- `docs/backlog.md` "Trips vs. cities restructure" (its constraint:
  adding stays low-friction, with no forced city or trip picking).

## The model, in plain terms

Two different things are both called "city" today. They come apart:

| | **Group** (working name) | **Real city** |
|---|---|---|
| What it is | how *you* think about the trip: "Chicago", "Reykjavík", "Golden Circle", "Iceland"… | where the place actually is: Oak Park, Hafnarfjörður, Frederiksberg |
| Who decides | you (the app suggests) | the address (OpenStreetMap) |
| Where it shows | the list you're looking at and the group switcher | the tag's address line, and the new filter |
| In the data today | `locations.city` (the `cities` table: label, map centre, search area) | `locations.address_details` (stored at add time since the short-address work; old rows need the backfill, which is 0 of 202 filled) |

- **Today's five "cities" simply are groups.** They happen to be named
  after cities, and nothing about them has to change except that a place
  no longer has to physically sit in one to belong to it.
- **The distance rule (150 km) is moot.** A place goes in the group you
  put it in, not the nearest one. The one heuristic left is when to *ask*
  (below), and that's a country check, not a distance.

## How a place gets its group when you add it

The tag shows the group as one pencilled entry, pre-filled. The entry
can be tapped to change it. This is a real choice now, so it's a
visible control, unlike round 12's city word. You never *have* to touch
it.

The pre-fill, in order:
1. **A group whose area contains the place** (its search area, or near
   its existing places) → that group.
2. Otherwise **the group you're looking at.**
3. **It asks only when that guess is clearly off:** the place is in a
   different country from everything in the group you're looking at
   (adding a Chicago place while looking at Reykjavík).
   - **"Add to Reykjavík, or a new group?"** appears in the stub, the
     same question pattern as before.
   - A new group is pre-named from the place's real city ("Chicago"),
     and you can edit the name.

Tapping the group entry prints your groups as rows on the tag, plus
"New group…". It's the same pattern as the type choices.

## The three workflows again

**W1. "It's Chicago to me" (the place's real city differs)**
1. You're looking at Chicago and type the name. Search finds it (below).
2. The tag shows "… · **Oak Park**" in the address (the real city) and
   the group **Chicago** (pre-filled, because that's where you are).
3. ADD. It's in your Chicago list. Filter by city shows it under Oak
   Park.

*Can go wrong:* nothing structural. If you were looking at another
group, you change the group entry with one tap.

**W2. Planning ahead: paste an address**
1. You paste it. Search finds it anywhere, first time.
2. If an existing group's area contains it, it pre-fills that group.
   If it's in another country from the group on screen, the tag asks:
   "Add to Reykjavík, or a new group?". New → "Chicago" (editable).
3. ADD. The list switches to that group so you see it land (job 14).

*"Coded to a trip":* a group may **be** your trip, or trips may sit
above groups. That's open (below).

**W3. Just a name, could be anywhere**
1. Search: round 12b's rule still holds, with "city" read as "group":
   - one search everywhere;
   - one plain list, ordered: places near **the group you're looking
     at** first, then your other groups, then the rest;
   - an invisible local search fills in local hits first when none came
     back;
   - no headings, no extra rows.
2. Group pre-fill as above.

## What filter-by-city adds

- A **City** set of chips in the filters panel, built from the real
  cities of the places in the group you're looking at (Chicago · Oak
  Park · Evanston).
- It's shown only when the group has two or more.
- It narrows the list and the map, and it's separate from the group
  switcher. ("A list shows everything that matches the active filters"
  holds.)
- **It needs the real city for old places:** the short-address backfill
  (0 of 202 rows today) has to run first, or old places have no city to
  filter by.
- Today's `#cityFilters` chips are really the group switcher. Naming and
  placement are visual's and UX's, but the two must not look like the
  same control.

## What changes from earlier rounds

- **Round 12's city rule** ("plain pencil, not a control; 'Which city?'
  only on overlap") is **replaced**.
  - The group is a tappable entry. The real city is plain text in the
    address line.
  - The overlap question goes: the group is your choice, pre-filled from
    whichever group's area contains the place.
- **Round 12b search:** it holds, with "group" for "city".
- **"New city?"** becomes "Add to [group], or a new group?", asked
  only on the country mismatch.

## Open, for the owner (not decided here)

1. **What do you call the grouping?** Trip, city, place, or something
   else. Are today's five simply renamed in the app's words (Reykjavík,
   Copenhagen… stay as they are)?
2. **Trips above groups, or a group *is* the trip?** For example, "Nordic
   Sept 2026" holding Reykjavík, Copenhagen, Malmö and Stockholm, or
   just the five groups as now.
3. **Can a place be in more than one group?** We'd say no for now.
4. **Filter by city:** only within the group you're looking at (our
   suggestion), or across all groups?
5. **When the guess is off:** is a country mismatch the right moment to
   ask? Or should it always quietly use the group on screen, and you
   change it if needed?
