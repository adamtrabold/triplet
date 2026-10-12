# Visual designer notes -- + placement

## Where things stand (2026-10-12, after jam pass 2 = my turn 5)
- Turn 2 (pass 1): four directions sketched (`concepts/sketches/`).
- Director turn 3: **stub leads**; tab killed (reads as a sheet pull-handle,
  plus attribution/tag-gap/rail costs); stamp killed; seal = "least change"
  baseline frame only. Six checks set.
- Systems turn 4: stress test (`concepts/stub-stress/`): stub passes safe
  area, filters visible, tag hierarchy, signed out/playground, desktop rail;
  fails 320 on width. Found a pre-existing bug: below ~790px tall the list
  sheet covers ADD LOCATION. Proposed: list drops to its band while the form
  is open; opening the form closes filters/sort. One-band wildcard dropped.
- My turn 5 (pass 2): spec-grade stub look. Stills + script in
  `concepts/sketches/pass2/` (`render.js`, `ONLY=<prefix>`; `measure*.json`).
  Key sheets: `width-study-3x.png`, `states-3x.png`,
  `form-664-A-vs-B-3x.png`.

## The stub as it stands (my spec)
- 60px wide (= tag stub height), full header height, flush right, to the
  screen edge. Centre x = rows' x centre at every width (390: 360; 320: 290).
- Icons: three 32px tiles at --s1 (4px) gaps, --s1 to the stub. Title room
  at 390: 154px (today 186; turn-2 sketch 118).
- Title = spans name / " list" / count; drop order "list" first, then name
  ellipsizes; count never truncates. 390: COPENHAGEN (112). 375:
  COPENHAG... (112). 320: COP... (112) -- proposed: drop count before
  ellipsizing the name (-> COPENHA...). Nit: sliver gap after the ellipsis.
- Perforation: the tag stub's exact rule (1.5px dashed var(--hair), 10px end
  insets), placed var(--s1) INSIDE the orange -- on the seam it read as a
  glitch; inside, it reads as punched holes. Same on navy. No notches (dots),
  no texture, no shadow.
- States: rest orange/navy + (= ADD LOCATION); pressed orange-deep/paper +
  (= submit press); open navy/paper x (= header ON tile, --state-on-bg/fg);
  pressed-open keeps the tile. + rotates 45deg into x with field crossfade,
  150ms; no pop, no grow.

## Decisions so far and why
- x is paper, not orange: matches the header's ON system; orange-on-navy is
  the account badge's rest look and would re-twin the controls.
- Form open: back systems' "drop" (A). Hold-and-scroll (B) at 664 hides
  Search and pins Add over Address -- looks broken. Always drop (one
  behaviour). Existing collapse motion; the +->x turn rides with it.
- BUT A moves the x 240px on the tap (list-up state) -- literally the
  owner's "button changes physical location after click". Must go to the
  owner as a plain question (wording in jam turn 5), not under the
  director's reading.
- "One ON tile in the band at a time": opening the form retracts the
  filters panel and un-tiles filters in the same beat.

## Director objections (turn 3) and status
- "Reads as an orange toolbar slab, not a stub" -> answered with the tag's
  perforation placed inside the orange, 60px on the x axis. Director to
  judge.
- Tab: accepted the kill (no answer to the pull-handle misread).
- Wants rest/pressed/open side by side with the account badge -> done
  (`states-3x.png`).

## Open questions
- Director/owner: add count to the drop order at narrow widths?
- Owner: OK that the x rides down with the list when the form opens?
- CD: account-open (orange field) = stub-rest colouring; sign-in crew's area.
- CD: two oranges with a starred tag open (star vs add) -- one family per
  the ledger, confirm.

## Randomness used
Pass 1: Oblique "Disconnect from desire", "Consider transitions"; fields
postal service, clockmaking; twists "half hidden", "eyes closed". Pass 2:
none new (refinement pass).

## Next
Director steers: is the stub ready to become the concept, and which
questions go to the owner. Then concepts with systems: full frames (rest,
collapsed, tag open, form open via drop, filters->form, signed out, 320,
desktop) at 3x, plus the seal baseline frame for comparison.
