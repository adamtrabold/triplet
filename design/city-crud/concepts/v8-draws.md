# v8 · The reveal, from real random draws (CURRENT; replaces v7's stub and stamp)

Owner on v7: "Neither of these is good… use some of the randomness principles to drive more
exploration". Settled: hold a city row in the title dropdown; the hold reveals a way to remove;
"feel like the brand somehow… a place for some whimsy"; calm enough for a destructive action;
VoiceOver and reduced motion must work.

## How the draws were made
`/tmp/.../scratchpad/draw.py` (python, `secrets`-seeded `random`), run four times, four draws each.
Each draw = one Oblique Strategy + one unrelated field + one constraint + one inversion, from fixed
lists in the script (33 strategies, 26 fields, 8 constraints, 4 inversions). Nothing hand-picked.

## Every draw and what it produced

Run 1
1. "Consider transitions" · film (fade to black) · the city must say goodbye · conceal everything
   else → **I · The iris** (drawn).
2. "Change instrument roles" · hot-air ballooning · only the navy ink · the city removes itself →
   **Balloon**: the city's ring lifts off the row as a navy balloon on a string; "Let go" removes.
   Kept as a direction; too cute for a destructive act to draw.
3. "Use fewer notes" · typesetting (pulling a slug) · the row must not move · the button comes to
   your finger → **F · Under your finger** (drawn).
4. "Reverse" · cartography (erasing a coast) · the city must say goodbye · the button comes to your
   finger → the city's outline is erased from the map as you hold. Thrown away: erasing before
   asking reads as already done.

Run 2
5. "Reverse" · postal (return to sender) · say goodbye · to your finger → a "return to sender"
   hand. Thrown away: another stamp, which the owner just rejected.
6. "Reverse" · kites · say goodbye · to your finger → the signpost's board lifts like a kite. Folded
   into D.
7. "Change instrument roles" · photography (darkroom) · reversible by doing nothing · conceal
   everything else → **Undeveloped**: the row fades like a print that wasn't fixed; one word,
   Remove, stays sharp; do nothing and it develops back. Kept as a direction.
8. "Use an old idea" · film (fade to black) · one word only · conceal everything else → same as 1;
   confirmed I's one-word button.

Run 3
9. "Emphasize the flaws" · pinball (tilt) · say goodbye · the city removes itself → the menu
   tilts. Thrown away: violent, not calm.
10. "Destroy the most important thing" · chess (resigning: tip the king) · say goodbye · remove is
    the default → **Tip the sign**: as you hold, the city's signpost leans further and further;
    past the tipping point it shows Remove at its foot; let go early and it rights itself. Kept
    as a direction (close to D; D is calmer).
11. "Listen to the quiet voice" · sand mandalas · one word only · to your finger → the row's
    letters drift to dust leaving "Remove". Kept as a direction; too close to the shipped dust to
    keep meanings apart.
12. "Use an unacceptable colour" · typesetting · row must not move · to your finger → a red slug.
    Thrown away: red is outside the palette (owner-taste: brand palette only).

Run 4
13. "The most important thing is the thing most easily forgotten" · kites · it happens on the
    map, not the menu · conceal everything else → **the reveal happens on the city's own map
    mark** → with draw 15, **D**.
14. "Change instrument roles" · darkroom · only an existing mark · remove is the default → same
    as 7.
15. "Give the game away" · railway (departure boards flipping) · one word only · to your finger →
    **D · The departure board** (drawn, picked).
16. "Honor thy error as a hidden intention" · camping (striking the tent) · takes longer than
    comfortable · to your finger → the row "strikes" like a tent, poles folding. Thrown away:
    slow and fussy for a menu row.

## The six directions
1. **D · Departure board.** Hold a city: up on the map its own signpost board turns over, like a
   railway departure board, to a navy back with one word, REMOVE. Tap the board to confirm.
2. **I · Iris.** Hold: the map and every other row sink under navy, leaving only the held row lit,
   with a REMOVE button at its end.
3. **F · Under your finger.** The row stays still; a paper REMOVE chip rises just above your
   fingertip. Slide onto it and let go.
4. **Tip the sign.** Hold: the city's signpost leans further the longer you hold; past the tipping
   point REMOVE shows at its foot.
5. **Undeveloped.** Hold: the row fades like an unfixed photo, only REMOVE stays sharp; do nothing
   and it develops back.
6. **Balloon.** The city's ring lifts off the row as a balloon on a string; Let go removes.

## Drawn: D, I, F. Pick: D, the departure board
- It happens on the city's own brand mark, the signpost the owner loved ("oh man i love the
  signpost"), so the thing being removed is unmistakable: the city's sign itself turns to REMOVE.
- Calm: one quiet flip and one word; nothing else moves; the row stays put. It's information on a
  sign, not an alarm.
- Whimsy carried by meaning (owner-taste): a sign that turns over is a departures board, a
  destination leaving the trip.
- **Motion:** the board turns over on its horizontal axis over the 500ms hold (a split-flap step
  or two, not a spin), haptic tick when it lands. Tap anywhere else and it turns back. Triggered by
  the press state; no row-gesture code. **Reduced motion:** the board just shows its back.
- **When the city's sign isn't on screen** (zoomed in): the map eases out to the sign zoom first,
  then the board turns. Open question 2.
- **VoiceOver / keyboard:** the city row's custom action "Remove {city}" opens the confirm directly
  (the flip is visual only); keyboard Shift+Delete does the same.
- **Signed out:** the board turns to SIGN IN; a tap opens the sign-in slip.

Runner-up: **I · Iris**: the calmest and most obvious, but less brand.

Stills: `stills/v8/1-D-departure-board.png`, `stills/v8/2-I-iris.png`,
`stills/v8/3-F-under-your-finger.png`.
