# Owner taste ledger: Triplet-specific

Rules the owner has stated that only make sense in Triplet, with the verbatim
words. **The owner's general taste rules (simplicity, hierarchy, spacing,
shadows, colour, controls, process) live in
`skills/design-loop/taste.md`. Read both** before every design task.
Entries are rules, not rationale; a rule here outranks any agent's earlier
reasoning. When the owner states a new taste rule, add it the same day:
general → `skills/design-loop/taste.md`, Triplet-only → here (quote,
context, source).

Source key: chat = owner in session (as relayed by the operator); other
sources are the file where the quote is recorded.

## Header / list rows / popup

- **No extra header height; the header is the city name, not a control.**
  Rejected for the sort control (chat): "I don't like the header for sort
  because that's the city name" (`design/list-ordering/proposal.md`).
- **Type goes above the name.** "type should go back above the name"
  (popup; chat).

## Visited / stamp / sticker

- **Visited must be clearly different from an unvisited pin.** "Visited vs
  pin are not differentiated nearly enough" (chat).
- **Wide marks say what they mean.** "the wide sticker on the row should also
  say visited" (chat).
- **A peel is a peel.** "Why is there no peel and just a notch? Looks
  stupid." ; "the flap should be bottom left" (sticker; chat). Original ask:
  "sticker route ... slightly peeled edge"
  (`design/visited-system/stamp-first/sticker.js`).
- **The check carries across surfaces.** "visited icon changes to a
  checkmark in the sticker ... add one to the visited sticker (list) for
  continuity" (`design/visited-system/stamp-first/mockup.html`).
- **Stamp, don't draw or slide.** "It shouldn't draw its a stamp" ; "I don't
  think it should slide it should stamp with some grow shrink that feels
  good…maybe the same as the star" ; "It should look like ink bleeding in or
  something" (swipe-to-visit; `docs/shipped.md`).
- **The star pops out when erased.** "the star should slightly pop out when
  erasing it" (Pencil Star; `docs/shipped.md`,
  `design/swipe-visit/p8-design.md`).
- **The cream sticker's 1px edge** is on its outer outline only, warm, low
  alpha, never along the fold (2026-10-02; via the coordinator). A hard dark
  line on the fold is still not OK.
- **Visited: stamp on rows, dark sticker with cream check on pins.** "The
  pin colors are not correct. Correct them but then reverse them I want the
  checkmark cream and the pin sticker the dark color... the visited sticker
  is not working so keep the check and text but take the visual style back to
  the stamp" (2026-10-03; chat). Supersedes the cream-sticker rows/pins.

## Plans / Places

- **Mode switches live in the panel, not the list header.** "plans / places
  may be good toggle labels? Also they should only be selectable from the
  panel not the list header." (chat).

## Lists / map behaviour

- **A list shows everything that matches the active filters** (CLAUDE.md).
- **Clicking any list item navigates the map to it** (CLAUDE.md).
- **One clustering behaviour.** "I don't like using a different approach for
  clustered places… Stop clusters should function the same as a normal
  cluster" (Plans; chat, `design/ACCEPTANCE-plans.md`).

## Process

- **Visual animations never touch row-gesture code;** they're triggered by
  state change or called after/during the gesture as a separate step
  (2026-10-03; coordinator-relayed owner rule).
