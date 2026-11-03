# v14 · The picker: move to a new city, and a foot that tells remove from cancel

Owner on the v2c build stills: "there should be a "move to new city" and more differentiation
between remove the places too and the keep stockholm (which maybe should just be "cancel"?"

Stills: `stills/v14/1-picker-new-city.png`, `stills/v14/2-picker-small-and-desktop.png` (mock layers
over the build, `stills/v14/stills.js`). Everything else from v13 stands.

## Move to a new city, still one step
- **"+ A new city…" line, pinned in the head** under the question and above the scrolling
  destinations, so it's always in reach whatever the number of cities.
  - It's the built Find a city line, unchanged: 48px, the `+` glyph, a 16px entry on a navy rule,
    placeholder "A new city…".
  - It has a `--hair` rule above it; the head's 1px `--navy` rule moves below it.
- **Typing swaps the middle:** the scrolling destinations are replaced by the real-city results,
  in the built result voice (52px rows: name 14/20 weight 600, then "Kind · State, Country · ≈ n km
  away" 11/14 `--ink-2`). Clearing the line brings your cities back.
- **Tapping a result commits:** it makes the city (`addCity()` with the found config, auto_added
  false), moves the places, removes the old city, then shows the v13 Undo slip ("Its places →
  Philadelphia"). Undo removes the made city too.
- **A result that's already one of your cities** behaves as tapping that city's row.

## The foot: two different kinds of thing
- **Destructive row:** "Remove {City} and its N places" (was "Remove the N places too").
  - A full sentence, so it can't be misread as a plain "remove".
  - 44px, left-aligned on `--s3`, an 18px bin glyph (the app's line icon, 1.8 stroke) then the label
    in caps 13px weight 700 `--ink` (stronger than before, not grey).
  - Background `--paper`, the same as the destinations, so it reads as one more choice.
- **A band between them:** 8px of `--paper-pressed`, with a `--hair` line above and a 1px `--navy`
  line below. Two compartments, the menu's own way of separating the quiet row.
- **Cancel:** 44px, centred, caps 13px weight 700 navy, on `--paper-raised`. A plain button, not a
  choice.
- **"Cancel" replaces "Keep {City}".** Keep was only chosen because the sign once said CANCELLED;
  it now says SEE YOU SOON?, so the standard word is clearer.
- **No new colour:** the app has no red, and the bin, the sentence and the separation carry the
  difference. Owner-taste: "Colour alone is not enough", "Reuse existing control styles".

## Fit
- **Head:** held row 44 + question ~38 + new-city line 48 = ~130px.
- **Foot:** 44 + 8 + 44 = ~96px.
- **375×667:** the box (top at 82px) leaves the middle about 8 rows, and the new-city line and the
  foot are always on screen.
- **390×844:** 12 destinations fit with room to spare.
- **1280×800:** the box runs to the window's foot; the 12th city scrolls just under it.
- **Minimum box:** head + 2 rows + foot ≈ 314px, which fits under the top controls at 375×667.
