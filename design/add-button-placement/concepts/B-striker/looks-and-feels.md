# B. Striker strip: how it looks and feels (visual designer)

+ leaves the top-right corner and becomes **a full-width strip along the
screen's bottom edge, the list's tear-off**. It says what it does
(+ ADD A PLACE), it's in the same place in every state, and **the same strip
finishes the add**: once you pick a place it reads ADD HALLGRÍMSKIRKJA. The
account badge keeps the corner to itself. Structure and measurements are in
systems' `how-it-works.md`; this file covers the look.

## Owner stills (3x, 1170 wide, real app from this folder's `index.html` copy, stub data, Reykjavík)

| # | File | What it shows |
|---|---|---|
| 1 | `1-rest-today-vs-B-3x.png` (raw: `stills/1-rest-B-3x.png`) | Rest, list up, 390x844: today next to B |
| 2 | `2-add-strip-3x.png` (raw: `stills/2a-…`, `2b-blank-664`, `2c-ready-664`, `2d-done-664`) | The add at 390x664 (Safari): tap the strip, the form rises and the strip waits blank, then you pick and it reads ADD HALLGRÍMSKIRKJA |
| 3 | `stills/3-tag-open-3x.png` | Starred tag open, navy selected row, the strip |
| 3b | `stills/3b-tag-form-3x.png` | Adding with a tag open at 844: the tag stays visible above the form |
| 4 | `4-states-3x.png` | Rest, pressed, open and blank, open and ready, adding |
| 5 | `stills/5-320-copenhagen-3x.png` | 320 wide, Copenhagen. The header is today's: B takes nothing from it |
| 6 | `6-keyboard-3x.png` | Typing a note with the keyboard up: ADD rides on the keyboard (keyboard drawn) |
| 7 | `7-collapsed-3x.png` | List down, Home Screen: band and strip as one piece |
| 8 | `8-safari-tab-3x.png` | Safari tab: strip right above Safari's toolbar (drawn). The honest height cost |
| -- | `stills/9-filters-then-add-3x.png`, `stills/desktop-rest-1x.png` | Filters closed by the add; desktop rail foot (appendix) |

Re-render: `node stills.js` (`ONLY=<prefix>`), then `node ../compose-stills.js B`.
The look is `visual.inc.html`, layered on systems' `concept.inc.html` in memory.

## Look

- **The field:** `--brand-orange` printed through the app's paper tooth
  (`--tex-flood`, the tag band's own texture, 160px tile). This is what keeps
  it from reading as a checkout bar. A flat orange slab is web; this one is
  printed stock, like the tag's band. No grit and no "striker" texture: the
  matchbook is a reference, not a costume.
- **The words:** `+ ADD A PLACE`, navy, the app's button type (Archivo 75%
  width, 700, uppercase, .08em tracking) at 15px, one size up from ADD
  LOCATION's 14px because it is the screen's main action. The + is the same
  stroke as the header icons (18px).
- **Height 56px**, the same as a list row, plus the home-indicator inset from
  the Home Screen. The orange runs on under the home bar to the screen edge,
  the way a tag's flood runs to the die-cut. The words stay centred in the top
  56px.
- **The seam:** no navy rule. There's one perforation along the top, the tag
  stub's own rule (1.5px dashed, 10px end insets, `--s1` inside the field),
  in `--paper` on orange as with the claim-check stub (the 1x check:
  `--hair` was too faint on orange). It's the only seam between the list and
  the strip.
- **List down (still 7):** the band sits straight on the strip and loses its
  bottom rule, so the band and strip read as **one ticket, the header and its
  stub**, not two stacked toolbars. That answers the "two bars" read the
  director expected. The cost doesn't change: it's still 150px of bottom
  chrome from the Home Screen.
- **Header and corner:** today's header, unchanged (title room as today). The
  account badge is alone at top-right.

## States (one system with ADD LOCATION and the tag stub)

| State | Field | Words | Notes |
|---|---|---|---|
| Rest | orange, tooth | navy `+ ADD A PLACE` | |
| Pressed | `--brand-orange-deep`, tooth | paper | = ADD LOCATION pressed |
| Open, nothing picked | **`--paper`, the form's own paper** | navy `ADD` + a write-in blank (`--ink-2` rule, 55%) | **not greyed**. See below |
| Open, ready | orange, tooth | navy `ADD HALLGRÍMSKIRKJA` (ellipsizes) | the name fills the blank |
| Adding… | deep orange, tooth | paper `ADDING…` | pressed tone holds while it saves |
| × (open only) | `--paper` segment, 56px, left end | navy × 20px | press = `--state-press`. A dashed `--hair` divider only when both segments are paper |

- **The inactive state is a printed form waiting for an entry, not a
  disabled button.** Open with nothing picked, the strip turns to the form's
  own paper, so the form and strip read as one tag with its stub. It prints
  ADD followed by a blank. The words stay full-strength navy; nothing is
  dimmed or at 40% opacity. Picking a place fills the blank and floods the
  field orange. That one switch is how you can tell it's ready. It's the
  app's grammar: printed form, clerk's entry.
- The perforation is one continuous line across × and the field: `--hair` on
  paper, `--paper` on orange.

## The form, risen

- Today's fields, unchanged. Its bottom sits on the strip and it grows up over
  the list (the list doesn't move). Its top keeps the 2px navy rule, as the
  stub's form does. **The cast shadow systems used is removed** (the owner
  has asked for restrained effects three times; the rule already separates
  form and map).
- Today's ADD LOCATION button is hidden: the strip is the submit.
- Keyboard up (still 6): the strip sits on the keyboard (y 452-508 at 844) and
  the form scrolls above it. ADD stays reachable while you type a note.

## Feel / motion

Every timing is an existing one. Colours switch and never blend, as with the
stub (director fix 2).

- **Press:** an instant tone step (deep orange, paper words), as ADD
  LOCATION. No scale, no pop.
- **Tap at rest:** on release the field switches to paper in one step and the
  form **slides up out of the strip** (translateY from 100% to 0, clipped at
  the strip's top edge, 0.3s ease: the sheet's own collapse timing). It reads
  as a ticket fed out of the strip. × appears with the switch, not animated.
- **Pick:** the name drops into the blank, and in the same frame the field
  switches paper to orange. No typing animation (the owner rejected
  typewriter costumes).
- **Add:** the field holds deep orange through ADDING…. On success the form
  slides back down into the strip (the reverse, 0.3s) and the strip returns
  to rest. Systems' flight-strip idea (the new row "files" up into the list)
  is a possible extra; I'd hold it until owner Q2 (fly to the new place) is
  answered, since the two would fight.
- **Cancel (×):** the same slide down. The draft is kept, so reopening shows
  the strip ready again.
- **Keyboard:** the strip and form follow `visualViewport`, with no motion
  of their own (no lag animation layered on the keyboard's). iPhone check.
- **Reduced motion:** no slide. The form appears or disappears with the field
  switch.

## Where I pushed or reshaped

- **Seam, not rule:** I replaced the 2px navy top rule with the perforation.
  The strip becomes the list's tear-off, the same idea as the tag's stub and
  the claim-check stub, and it makes the collapsed band + strip one object
  (draw: "Only one element of each kind" / laundry tickets).
- **The inactive state:** a write-in blank on paper, not a greyed slab.
- **Printed flood:** the orange carries the paper tooth, so a full-width
  orange bar reads as Triplet stock and not a checkout bar. Director objection
  2: judge it on still 1.

## Open / honest

- **Height** is the concept's cost and no look removes it: 56px always, 150px
  of bottom chrome with the list down from the Home Screen, and a third bar
  (Safari's) in a tab (still 8). The owner's "no extra header height" applies
  in spirit.
- **Will "ADD ____" read as "pick a place first"?** The form above has the
  focused search, so I think yes. If the director doubts it, the fallback is
  printed `ADD` + `PICK A PLACE` in `--ink-2` on the blank line, still one row.
- Keyboard riding is a Chromium emulation (systems): iPhone check.
- The add form's own Address field still shows a long raw address (today's
  form, unchanged; not this concept's scope).
