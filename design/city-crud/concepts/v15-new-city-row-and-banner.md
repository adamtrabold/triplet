# v15 · New city in the list, and the city-removed banner at the top

Owner on the v2d build stills: "i think new city should be part of the list, and that the "city
removed |undo" should be more of a top banner above the map"

Stills: `stills/v15/1-new-city-in-the-list.png`, `2-top-banner.png`, `3-top-banner-desktop.png`; the phone banner as revised: `stills/v15b/1-banner-pushes-controls.png`, `stills/v15b/2-banner-375.png`. They
are mock edits over the built picker at f04ab1e (`stills/v15/stills.js`). No new sizes; every value
below is an existing pattern.

## 1 · "+ New city" is a row in the list
- **Where:** the **last row of the scrolling city list** (`.rm-mine`), after the farthest city. This is
  the title menu's own pattern ("+ New city" after the cities).
- **Row:** the destinations' own `.rm-dest` (44px), with `FIND_PLUS_ICO` as its 16px `.menu-ico` in
  place of the arrow, label `menu-lab` "New city" in navy, no km. The pinned `.rm-new` line in the
  head is removed.
- **Tap:** the row turns into the built Find a city line **in place**, the same as the title menu's
  "+ New city" row: `.menu-find`, 48px, 16px entry, focus on the input.
  - The results (`.menu-res.add-res`, the built 52px result voice) open right under it, inside the
    scrolling list, and the list scrolls to keep the line and its first results in view.
  - Picking a result is unchanged: make the city (auto_added false), move the places, remove the old
    one, one step, with Undo.
  - Clearing the line or Esc turns it back into the row.
- **Head after the change:** the held row (44) + the question caption (24 min) + a 1px navy rule.
- **Separation of "Remove places too":** it keeps its place pinned at the foot, and the rule above it
  becomes the title menu's **doubled ledger rule: `border-top: 2px solid var(--hair)`**. That's the
  rule under "All places", the menu's own "slightly separated" break, and it matches the owner's
  "just another choice in the list, but slightly separated". Cancel stays below on
  `--paper-raised`.
- **Copy (owner, v15b):** the destructive row reads **"Delete places"** (was "Remove places too"); its
  aria-label stays the full sentence ("Remove Stockholm and delete its 23 places, and 2 plan stops").
- **Fit:**
  - 390×844: 12 cities + New city show without a scroll.
  - 375×667: the cities scroll, New city waits at the end, and the foot never scrolls.
  - Desktop: unchanged rule.

## 2 · The city-removed banner
- **Scope:** only the city-removed Undo (moved / removed-too / empty city). The plan slips stay as
  shipped.
- **Look:** the menu box's voice: `--paper-raised`, 1px `--navy` border, the 4px 4px 0 `--navy`
  printed offset, 52px tall (the list header's height). The two v13 lines are unchanged:
  - **Line 1:** 11/14 caps `--ink-2` weight 600 `.1em`; may truncate.
  - **Line 2:** 13/16 caps navy 700 `.06em`; never truncates. "Its places → Copenhagen" /
    "and its 23 places deleted" / none for an empty city, which shows line 1 alone, centred.
  - **Undo:** the built slip's underlined caps-12 button behind a `--hair` divider.
- **Phone (v15b, owner: "i'd like to see the toast above the controls on mobile (zoom / account) and
  then for them to shift back when the toast goes away"):**
  - **Position:** the banner takes the top: `top: calc(var(--s4) + var(--chrome-top-inset))` (where the
    zoom control and account badge sit now), `left: var(--gutter)`, `right: var(--gutter)`.
  - **The push:** while it shows, `body.banner-on` moves `.leaflet-top` (zoom), `#accountBtn`,
    `#accountFocus` and the account menu down by **60px** (the banner's 52 + `--s2`), using
    `transform: translateY(60px)`, not layout, so nothing reflows.
  - **Timing:** the push matches the banner. In: 140ms `cubic-bezier(.2,.8,.3,1)`, the same curve as
    the banner's `sortSlip` enter. Back up: 160ms ease-out, the same as its fade.
  - **Reduced motion:** the controls jump; there's no transition.
  - **What else could collide:**
    - **`--top-row-bottom`** (74px) is the ceiling for menus, the add tag's dock and the filter panel.
      It grows by 60px while the banner shows (`--top-row-bottom: calc(134px + safe-area)` under
      `body.banner-on`), so a menu opened in those 6s still clears the moved controls.
    - **An open Hanging Tag** hangs from its pin and doesn't move. It can't be open during a removal
      anyway, because the removal starts in the title menu, which closes the tag.
    - **The add tag** isn't open during a removal either. If + is tapped while the banner shows, the
      banner leaves at once, the controls go back, then the add tag opens. The banner never sits over
      the add tag.
    - **The map signposts' clear area** (`badgeSafeRect()`) is measured below the controls, so it
      follows the push. The signposts re-layout once when the push lands and once when it's undone.
- **Desktop (the rail layout), unchanged and no push:** the map's controls sit at its corners, well
  clear of a centred 420px banner, so nothing needs to move.
- **Desktop position:** over the map only, never over the list. `width: min(420px, map
  width − 32px)`, centred on the map, `top: map top + 16px`.
- **Enter:** the menus' own `sortSlip` (140ms, `cubic-bezier(.2,.8,.3,1)`, a few px down and in).
- **Leave:** fade 160ms. Reduced motion: no slide, no fade.
- **Life:** 6s, held while hovered, touched or focused (the shipped slip's rules). A second removal
  replaces it.
- **a11y:** `role="status"`, `aria-live="polite"`; Undo is focusable. With VoiceOver it stays until
  dismissed, or 6s after focus leaves.

## Open question for the owner
- Should the app's other Undo slips (plans: "Added … as stop 4", removed stops) move to the same top
  banner for consistency? Not designed in; they stay on the list header for now.
