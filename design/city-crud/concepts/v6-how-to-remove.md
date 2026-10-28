# v6 · How Remove city is reached (CURRENT; supersedes v5's foot) + the other cities' signposts

Owner on v5: picking a city in the dropdown shows only that city (approved); a header tap in All
places does nothing, the eye stays; "If you've picked a city and you've zoomed the map out, yes, it
should show the other city's signposts. But maybe they should look hidden in some way?"; on removal:
"if you've selected a city in the dropdown, the removal button is one place. And if you're in all
places, the removal button is in another. I'm not sure if that's confusing ... I like the idea of it
in the header, but maybe not visible, maybe from a long press. I'm wondering if there isn't another
semi-hidden way to add the functionality without a visible button. Or maybe it's in the filter panel
... I think it needs more exploration."

Stills: `stills/v6/1-hold-a-city-in-the-menu.png` (recommended), `stills/v6/2-other-signposts.png`.

## Options (differ in kind)

**A · Hold a city in the title menu (RECOMMENDED).** Long-press (500ms) a city's row in the dropdown;
the row fills with the pressed tone, then the remove confirm opens under it, inside the menu.
*Find it:* the dropdown is the one list of your cities, the same in both views, and it's where cities
are made (New city), so making and removing live together. One path, never two.
*Cost:* a hold is invisible until learned. It's in a menu, not a list row, so no gesture code is
touched. VoiceOver / keyboard need their own way in (below).

**B · Long-press the city's section header.** The owner's idea: hold the header (in All places, or the
one header in a single city).
*Find it:* the header is "the city" in the list. *Cost:* the header sits among rows with swipe
gestures and the plan-row 400ms hold; a hold that starts a scroll has to be told apart from both
(the gesture gate re-runs). In a picked city the header is the only one, in All places it's one of
many: the same gesture, but two different-looking places.

**C · The filter panel holds a "Cities" block.** The filter panel (already one tap away, already
"the settings for what you see") lists your cities with the eye and a quiet ⋯ → Remove.
*Find it:* where filters live; visible but behind the filter button, not on the list. *Cost:* the
panel was chips only by design (phase 1 moved the cities out of it); adds a second place that
lists cities beside the title menu.

**D · Swipe a city row in the title menu.** Swipe a dropdown row left to reveal "Remove" (Mail-style).
*Find it:* the same one place as A. *Cost:* a swipe inside a scrolling menu is fiddly, and it
reads as a visible button once revealed; left-swipe means "visit" on list rows, a clash in meaning.

## Recommendation: A, hold a city in the title menu
One place for both views (answers the owner's worry), no visible button, makes and removes cities
in the same menu, and touches no row-gesture code.
- **The hold:** 500ms (longer than the plan rows' 400ms, so muscle memory never crosses). The fill
  runs left to right in `--paper-pressed` with a small "Hold…" at the end; releasing early is just a
  tap (the tap still picks the city). Haptic tick at open via `hapticTap()`. Animation is triggered
  by the press state, not gesture code.
- **The confirm**, inside the menu under the row: move its places to [Pick ⌄] (preselected only when
  another city is within 70 km) or remove them too; CANCEL / REMOVE (Remove waits for a choice). The
  menu grows; the row stays put.
- **Can it be found again?** One line, once: the first time the menu opens after a city is made by
  hand, the caption reads "Hold a city to remove it" (then the plain caption forever after;
  per-viewer `localStorage`). Open question 2.
- **VoiceOver:** a custom action "Remove {city}" on each city row (actions rotor). **Keyboard:**
  Shift+Delete (or the context-menu key) on a focused row opens the same confirm.
- **Signed out / playground:** the hold opens the sign-in slip ("Sign in to make changes").
- All places can't be removed; it has no hold.

## The other cities' signposts, one city picked
Below zoom 8 with one city picked, the other cities keep their signposts, printed in the eye's
hidden voice: the label in `--ink-2`, the rule dashed in `--ink-2`, no navy offset shadow, the
face a touch see-through. The picked city's board is unchanged. A tap on a faded board picks that
city (the filter changes to it). Shared posts keep one navy pole.
