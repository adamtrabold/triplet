# v9 · A swipe triggers the departure-board flip (CURRENT; refines v8's D)

Owner on v8: "The departure board is interesting. What if all that was triggered by a swipe or
something".

## Placements (differ in kind)

**R · Swipe the city's row in the title dropdown (RECOMMENDED).** Swipe a city's row left and the
row itself flaps over like a split-flap departure board to REMOVE {CITY}; tap it for the confirm.
When that city's signpost is on the map (zoom ≤ 8), the signpost turns over with it.
*Cost:* it's the same direction as visit-swipe on list rows, but it lives in a menu, not the list,
and does something else; the menu needs a horizontal axis lock against its vertical scroll.

**S · Flick the signpost board on the map.** An upward flick on a city's board turns it over to
REMOVE; tap for the confirm.
*Cost:* only possible at zoom ≤ 8 (signposts don't exist zoomed in); a touch that starts on a board
can no longer pan the map; small target.

**T · Swipe the list title (not drawn).** Swipe the picked city's name in the list header; it flaps
to REMOVE MALMÖ.
*Cost:* removes only the city you're in (you'd pick a city first); nothing to do in All places; the
title is a button that opens the menu, so a swipe on it is easy to trigger by accident.

## Pick: R, swipe the row
- **Answers v8's zoom question:** the row *is* the board, so it works at every zoom; the signpost
  turning too is a bonus when it's on screen, never required.
- **One place in every view** (the dropdown lists every city in both views), next to New city.
- **The swipe:** left, past 48px, with an axis lock (horizontal only once |dx| > 2·|dy| after 10px),
  so the menu still scrolls. Swipe right, or tap another row, and it flaps back. Under 48px the row
  springs back and nothing happens; a tap still picks the city.
- **The flip:** split-flap, two halves: the front's top half falls (180ms), the back's bottom half
  falls into place with a small overshoot (200ms); a haptic tick when it lands. Triggered by the
  swipe's end state, never by list row-gesture code ("Animation separation"); the menu isn't a list
  row, so the Pencil Star / visit / plan-hold code is untouched.
- **The back:** navy, paper caps, one line: REMOVE STOCKHOLM. Tap it: the confirm (move its places
  to a city you pick, or remove them too; Remove waits for a choice).
- **Reduced motion:** the row shows its back at once. **VoiceOver:** a "Remove {city}" custom
  action on the row opens the confirm directly. **Keyboard:** Shift+Delete on the focused row.
  **Signed out:** the back reads SIGN IN; tap opens the sign-in slip.

## Motion prototype
`design/city-crud/proto/swipe-flap.html`: a throwaway page (not the product) with five city rows:
swipe one left to watch it flap, tap it for the confirm, swipe right to flap back. Open on a
phone.

Stills: `stills/v9/1-R-swipe-the-row.png`, `stills/v9/2-S-flick-the-board.png`.
