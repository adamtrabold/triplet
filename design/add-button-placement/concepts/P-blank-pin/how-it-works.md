# P · Blank pin: how it works

Systems, concept turn 1 (2026-10-14). P is the trigger. The form is
`../blank-tag-form/how-it-works.md`; read that first. Jobs are as in
`../../jobs.md`.

## Structure

- **The lifted pin** stands at the **bottom-left** of the map:
  - a 48 orange disc with a 2px paper halo (52 overall), a deep-orange
    rim and a navy +;
  - a 1.6px navy straight string, about 22px, to a ground point with a
    soft ground shadow.
  - It's the app's own round pin, held above the map. The look is
    visual's, from turns 34-35.
- **Placement:**
  - ink 19.9 from the left (the Float's line, the rows' left channel);
  - the ground point 20 above the list's top edge.
  - It rides the sheet edge: list up, collapsed, and the tag-fit
    lowering.
- **Box, list up:** x 17.9-69.9, and y 450-528 at 390x844 (174-252 at
  320x568). Sizes at 390x664 and 375x667 follow the sheet edge.
- **Hit area:** the disc, plus a 44-wide column down the string to the
  ground point (52 x 78). No bare corners, so it never steals a map tap
  next to the string.
- **`#floatingAddBtn` leaves the top-right.** The account badge sits
  alone at the top-right, and moves to `right: var(--s4)` (the Float's
  ruling, nothing new for the sign-in crew).
- **The credit:**
  - it stays bottom-right;
  - at 320 the "Leaflet |" prefix drops (the Float's rule: below about
    338px wide), else it touches the pin's box (0.9px);
  - at 375 and wider, it's clear with the prefix.

## Rank (job 2), on the real render

`../pass-a-check/lifted.js` and `lifted-squint.py`, Reykjavík, real pins:

| Squint mass vs the account | σ 4 | σ 8 |
|---|---|---|
| Lifted, disc 44 | 1.18x | 1.15x |
| **Lifted, disc 48 (the pick)** | **1.40x** | **1.37x** |
| Lifted, disc 52 | 1.64x | 1.61x |
| Stock FAB 56 (reference) | 1.92x | 1.91x |

- The director's estimate (1.39 / 1.35) is confirmed.
- The string and the ground point add almost nothing to the mass, and
  the shape is what keeps it from reading as a FAB:
  `frames/lifted-vs-fab-3x.png` is a systems rough, not visual's drawing.

## States of the trigger

| State | P |
|---|---|
| Rest, list up / collapsed | shown at the sheet edge |
| Pressed | visual's (deep-orange disc, paper +) |
| Tapped | it rises to the dock and becomes the form's 32px pin (the form takes over) |
| A place's tag open | **hidden**, at every height. It's back when the tag closes. This is the ruled exception, a plain cost line. |
| Filters open | **hidden** under the panel. Close the filters to add. This is the ruled exception. |
| Sort menu open | shown. Tapping + closes the sort menu first. |
| While adding | hidden; the form's pin is the only orange pin |
| After ADD | hidden while the new place's tag is open; the fresh lifted pin is standing when you close it |
| Signed out (playground) | shown; adds as signed in |
| Stale stored sign-in | tap → the sign-in sheet, nothing moves |
| Plans view | shown; adds a place (not a stop) |
| Desktop | at the map column's bottom-left; the tag hangs in the map column with no dock |

## Flows

1. **Add:**
   - tap the lifted pin;
   - it rises and the tag drops down its string, with the keyboard up;
   - type; results on the tag;
   - pick: the keyboard drops, the list drops to its band, the map flies,
     the pin **lands** on the spot and the tag hangs from it with
     everything in pencil;
   - ADD (y 515-559 at 664);
   - ink-over;
   - the list comes back on the place's city with the row in view, and
     the place's tag is open;
   - close it: the fresh lifted pin is at bottom-left.
2. **Cancel:** the tag's × → the tag goes back up its string, the pin
   drops back to rest, and everything is restored; the draft is kept.
3. **A tag is open:** close it (×, a map tap or Esc), and then flow 1.
   That's one extra tap.
4. **Filters are open:** close them, and then flow 1. That's one extra
   tap.
5. **District / street:** as in the form spec. The pin stays lifted over
   the point, and on ADD it fades as the outline draws.

## Collisions (job 4), real 202 pins, 5 cities, list up and collapsed

| | 390x844 | 390x664 | 375x667 | 320x568 |
|---|---|---|---|---|
| Pins under / within 6px | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| Credit | clear | clear | clear | prefix must drop (the Float's rule) |
| Under an open tag | hidden (it would overlap at ≤ 664: the tag's foot is 52 above the list, the pin's top 94 above it) | hidden | hidden | hidden |

- At street zoom any corner object can sit on a place; panning frees it.
  The dead zone is 52 x 78, about 1.2% of the map at 844.

## Coverage against jobs.md

| Job | P | Where |
|---|---|---|
| 1 Reach | **yes, with 2 exceptions** (tag open, filters open: +1 tap each) | bottom-left, thumb side |
| 2 Main action, reads as + and as a pin | yes, by the numbers (1.40x the account); the pin read is visual's 1x test | rank table |
| 3 Know what you'll fill out | yes: the string is the one the tag comes down | rest |
| 4 Never in the way | yes | collisions |
| 5 Signed out | yes | states |
| 6-16 | yes, via the shared form | `../blank-tag-form/how-it-works.md` |

## Open

- Visual's 1x re-test: "lollipop" or "FAB with a stick", beside real 24
  and 32 pins (the director's kill condition).
- The pressed and rise motion is visual's, from the existing tag-pop
  timing.
- Not measured yet: desktop; the docked pin's x at 375 and 320 against
  the account badge after it moves right.
