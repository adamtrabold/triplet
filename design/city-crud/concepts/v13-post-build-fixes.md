# v13 · Post-build fixes (CD + UX check on 952bc58)

Stills: `stills/v13/1-picker-fits.png`, `2-picker-desktop.png`, `3-undo-slip.png`, `4-empty-city.png`.
They're mock layers over the built `index.html` (`stills/v13/stills.js`).

## 1 · The remove picker fits
The locked menu height is our own rule; the owner's "controls don't move or grow" was about the
Plans/Places toggle. v12's approved still showed everything at once, so the picker gets its own
box rule.

- **Takeover:** when the picker opens it takes over the menu box. The other city rows, All places,
  New city and the Plans quiet row are hidden while it's open (Keep, Esc or a tap outside bring them
  back). The box shows, top to bottom:
  1. **Head, pinned (never scrolls):** the held city row (44px, its REMOVE board still open), then the
     question "Remove {City}. Move its N places to:" (14/20, weight 600, `--ink`, on `--paper`,
     padding 10px `--s3` 8px), then a 1px `--navy` rule.
  2. **Destinations, the only part that scrolls:** 44px rows, nearest first. When there are more
     than fit, a scroll shadow at the edge: `inset 0 -10px 10px -10px var(--scroll-shadow)`, the
     app's scroll-shadow token, at the bottom edge, and at the top edge once scrolled.
  3. **Foot, pinned (never scrolls):** a 1px `--navy` rule, then "Remove the N places too" (44px,
     `--ink-2`, weight 600) and "Keep {City}" (44px, centred, navy).
- **Width:** `max(the menu's width, min(100vw − 32px, 340px))`, left edge unchanged.
- **Phone (the sheet layout):**
  - **Bottom:** stays where the menu's bottom was.
  - **Top:** `max(var(--top-row-bottom) + 8px, bottom − content height)`, so the box grows upward,
    never over the top controls (82px at 390 / 375).
  - **Height:** bottom − top.
- **Desktop (the rail):**
  - **Top:** the menu's top.
  - **Height:** `min(content, innerHeight − top − 16px)`. No locked height.
- **Measured in the stills:**
  - 390×844 with 12 destinations: everything fits, no scroll.
  - 375×667: the middle scrolls (about 9 rows show), and Remove-too and Keep are always on screen.
  - 1280×800: all 12 fit.
- **Rule:** Remove-too and Keep never need a scroll at any size. The minimum box is head (≈96) +
  2 destination rows (88) + foot (89) ≈ 273px, which fits under the top controls at 375×667.

## 2 · The Undo slip: two lines, destination never cut
On the list header at the header's own height (52px), replacing the one-line slip for city removes
only:

| | Text | Style |
|---|---|---|
| **Line 1** | "{City} removed" | 11/14 caps, `--ink-2`, weight 600, `.1em`; the only part that may truncate (ellipsis) |
| **Line 2, moved** | "Its places → {Destination}" ("Its place" for one) | 13/16 caps, `--navy`, weight 700, `.06em`; never truncates. The destination is a `flex: none` span |
| **Line 2, removed too** | "and its N places" ("and its place") | same as moved |

- Gap 2px between the lines; padding left `--gutter`; Undo unchanged at the right.
- Checked at 375: "East Marlborough Township removed" plus "Its place → Philadelphia" fits whole.
- With the shipped slip's [pre, name, post] API this is a two-line variant: the builder adds a
  `two-line` kind rather than reusing the one-line truncation.

## 3 · The empty-city note
The build's rendering (the compass glyph and the empty section's condensed caps in `--ink-2`) is the
app's own empty-state voice, and that's right. It's better than my plain sentence. Only the copy
changes:

- **Was:** "Nothing here yet. Tap + to add a place; it's yours until you remove it."
- **Now:** **"Nothing here yet · tap + to add a place"** (one line at 390 and 375).

The "yours until you remove it" clause explained a rule nobody needs at that moment.
