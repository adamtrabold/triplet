# v12 · Slower sign, SEE YOU SOON?, a one-step confirm, and desktop (CURRENT)

Owner on v11: "Sign flip is too fast I said slow it down. Let's go with see you soon? And also the
confirm should just have the new city select right there I don't want to confirm then select. This
needs to work on desktop somehow"

## The sign
- **SEE YOU SOON?** on the turned board. The toggle is gone.
- **Flip: 480ms, `cubic-bezier(.45,.05,.25,1.12)`.** A deliberate turn: it starts slow, sweeps through
  the middle, and settles with a hair of overshoot. That's slower than v10's 260ms and much slower
  than v11's 140ms.
- Measured in Chromium, from the turn's start:

  | ms | 0 | 47 | 114 | 181 | 247 | 314 | 381 |
  |---|---|---|---|---|---|---|---|
  | degrees | 0 | 6 | 36 | 99 | 148 | 171 | 180 |

- Reduced motion: no transition.

## The confirm is one step
- Tapping the REMOVE board, or the turned sign, opens it under the row. **The question is the
  picker:** "Remove Stockholm. Move its 23 places to:", then every other city as a row, nearest
  first, each with its distance.
- **Tapping a city does it:** the places move there and Stockholm is removed. Nothing to confirm
  afterwards.
- Below the cities, **"Remove the 23 places too"** (quiet, `--ink-2`), then **KEEP STOCKHOLM** under a navy
  rule. Keep closes everything.
- **The deliberate commit** is still there: the swipe or reveal can be undone and is never a
  commit; the one tap on a named destination is.
- **A 6-second slip with Undo** follows every remove ("Stockholm removed. Its places are in
  Copenhagen."), because a one-tap commit deserves a way back.
- **The 70 km preselect rule is gone.** Nothing is preselected; the list is ordered nearest first, so
  the likely destination is the first row under your thumb.
- With a plan stop among the places, "Remove the places too" reads "Remove the 23 places too (and 2
  plan stops)".

## Desktop: the smallest native set on a Mac
1. **Trackpad two-finger swipe left** on the row. This is how Mail and Reminders reveal a row's
   action on a Mac. The board tracks the scroll's deltaX (natural scrolling: fingers left = deltaX
   > 0) and settles about 120ms after the last event by the same 40% rule. A mostly-vertical wheel
   is left alone, so the menu still scrolls.
2. **Right-click** (or control-click) on the row opens the same reveal. It's the Mac's own
   "more actions" gesture and covers mice.
3. **Keyboard: Shift+Delete** (or Shift+Backspace) on the focused row reveals the board and goes
   straight to the picker, focus on the nearest city.
4. **VoiceOver:** the row's "Remove {city}" custom action.

**Not chosen:**
- **Mouse drag on the row:** not a Mac convention, and it would fight text selection.
- **A hover affordance:** that's a visible button, which the owner didn't want.

## Checked in Chromium (`proto/swipe-flap.html`)
- **Touch:** a slow 90px drag left opens.
- **Picker:** the board tap shows Malmö 515 · Copenhagen 520 · Reykjavík 2,135 · LA 8,880 ·
  Remove the 23 places too · Keep Stockholm. Tapping Copenhagen hides the row and its sign and shows
  "Stockholm removed. Its places are in Copenhagen." with Undo.
- **Desktop:**
  - wheel deltaX 90px: opens and the sign turns
  - a vertical wheel after that: stays open
  - wheel back: closes
  - 32px of wheel: stays shut
  - right-click: opens
  - Shift+Backspace on a focused row: opens the picker with focus on its nearest city

Still: `stills/v12/1-one-step-confirm.png`.

## The stretch, bounded (owner: "that stretch in the places list is insane")
- **Before:** past the 132px open width the board followed 0.2× the finger with no limit. With a
  trackpad, wheel momentum kept adding distance, so the board could grow across the whole row.
- **Now:** a small give that eases toward a hard stop: `give = 12 × (1 − e^(−over/40))`. The board
  maxes out at **144px**. Its first ~20px of over-drag gives ~5px, and it's nearly flat by 100px.
- **Wheel:** the accumulator is clamped to 120px past open, so momentum can't bank distance, and
  pulling back answers immediately.
- **Checked in Chromium:**
  - a 300px touch drag reads 136 / 142 / 143 / 143.8px at 150 / 200 / 250 / 300px of finger
  - a 2,400px wheel swipe peaks at 143.4px
  - 80px of wheel back answers at once (139.6px)
  - both settle back to 132px
