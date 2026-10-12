# Visual designer notes -- + placement

## UPDATE 2026-10-12, round 3 fixes (after director turn 10: B 9 pending, C 8, D killed)
- B fix 6 done: `#controls.show` max-height = --form-max - 26px (the credit's
  row reserved between badge and form). 6-keyboard: form y147, credit
  129-147, badge bottom 113; form scrolled to the CATEGORY boundary.
- C fixes: (1) the pin steps aside (150ms fade) whenever a .tag-popup or the
  filters panel is open (body:has). (2) Results = a full-width paper sheet
  capped by --res-max below the zoom/badge: 3 results at 664 + keyboard.
  (3) a capture click on #locationsList scrolls a not-fully-visible row in
  before the app selects it, so the new row after Add is fully in view.
  (4) Size knob --pin-s; study `4b-size-3x.png`; CHOSEN 1.25 (tag 55x39,
  15px words, tap area 65x83). (5) Still 1 carries the two plain-cost lines;
  new composed `3-tag-open-3x.png` with "close the tag to add".
- Desktop: the credit lifts above the bottom search bar while adding.
- NEW: `concepts/chrome-check.js`, run by both stills.js, writes `clash`
  into stills/measure.json (badge/zoom/credit/pin vs form/strip/tag/results/
  bar/filters). All owner frames are clean; the only flag is
  pending-filters-664 (today's own filters panel over zoom). Use it on every
  new frame type before sending: the director's recurring blocker.
- Rulings recorded in C's looks-and-feels: 16px overlay selects/notes/search
  (no zoom lock), draft kept on cancel (systems).
- Next: director re-scores C; if 9, owner gets stub + B + C in one message.
  Then handoff "How it looks and feels" for whichever the owner picks.

## UPDATE 2026-10-12, turn 9 (new visual designer): B and C at owner fidelity, D frame
Taking over from the previous visual designer. Context: the owner said "i want
more than one concept"; the stub stays in the set; director turn 7 opened B
(striker strip), C (pencilled pin), D (eyelet, one frame). Systems turn 8
prototyped B and C (structure, wiring, measurements). Owner answers to Q1-Q3
come only after a concept is approved.

### How the files fit
- Each concept folder: systems' `concept.inc.html` + `render.js` (rough
  frames/), `index.html` = copy of the real file + concept.inc. MY look is
  `visual.inc.html`, injected in memory by my `stills.js` (at the LAST
  `</body>`: systems' comment contains a `</body>` string). Raw stills in
  `stills/`; captioned owner stills at the folder root via
  `concepts/compose-stills.js B|C`. If systems re-runs render.js the copy is
  rebuilt; my stills still layer on top.
- D: `concepts/D-eyelet/render.js` builds its own copy; one frame + verdict.

### B decisions (looks-and-feels.md)
- Orange field through `--tex-flood` (the band's paper tooth) = printed stock,
  not a checkout bar. 15px button type, + 18px. 56px = a row's height; orange
  runs under the home bar.
- No navy top rule: ONE perforation (tag stub rule, paper on orange, hair on
  paper), continuous across x and field. Collapsed: band loses its bottom
  rule and sits on the strip = one ticket.
- Inactive = paper (the form's paper) + navy "ADD" + write-in blank; ready =
  orange "ADD <NAME>"; adding = deep orange + paper words; x = paper segment
  at the left, hair divider only when both paper.
- Form keeps the 2px navy top rule; systems' cast shadow removed.
- Motion: form slides out of / back into the strip, 0.3s ease; colours
  switch, never blend.

### C decisions (looks-and-feels.md)
- Blank pin = dashed ring + straight string + 44x31 orange die-cut tag
  printed "+ ADD" (12px). Reads at 1x. Killed systems' teardrop.
- Search line = band paper, ring glyph, no input box/focus ring.
- Placed marker = the dashed ring (CSS on systems' .pencil-marker).
- Blank tag = real tag structure (.tag-shadow/.tag-stock/.tag-patch/.tag-in/
  .tag-stub) wrapped round systems' h3/.addr/#addForm; CITY/TYPE pencilled
  entries on dashed rules (field-sizing: content; Chromium only); notes as a
  write-in line; stub = STAR | ADD LOCATION (2fr, orange tooth). Star prints
  the band. "Category" label shown as "Type". 270px tall at 390.
- Motion: tag pops down out of the ring (tag-pop/tagString 280ms); Add inks
  the ring into the real pin (stamp ink-bleed), stamps TYPE, swaps the stub.

### D
Killed: docked-FAB / drag-knob read, covers OSM credit, crowds the title.

### Open
- Director: score B/C; rule on C 664 failures (my visual vote (b) pin steps
  aside under an open tag; close filters to add).
- B: does "ADD ____" read as pick-first? Fallback copy noted.
- C: iOS <16px focus zoom on pencilled selects/notes (overlay / 16px);
  new row may land half below fold after Add (systems).
- B keyboard riding: iPhone check.
- After the director's pick: owner set = stub + whichever of B/C reach 9;
  then the handoff "How it looks and feels" for the approved one.

---

## Previous designer's notes (history)

## UPDATE 2026-10-12, after the director's score of 8 (fixes 1 + 2 applied)
- Fix 1, form anchored to the band: `#controls.show` absolute, bottom 0 of
  #mainContent (which ends at the band), grows upward, z 900 (over map,
  under sheet). Top padding --s6; the 2px navy rule moves to the top edge;
  the attribution rides up to the form's top edge (body.adding
  .leaflet-bottom{bottom:var(--form-h)}). Measured: 664 form top y140
  (badge ends y66, 74px clear), Add 536-580, x 604. 844 Add 716-760, x 784,
  map above (empty here because the pins sit under the form; flagged).
- Fix 2, no blended field: colour transitions removed; the field/glyph
  colour switches (press = deep orange; release = navy), and only the glyph
  rotation animates (0.3s). Strip middle frame re-shot: clean navy.
- New still `2-adding-844-3x.png`; strip, overview and captions
  recomposed. looks-and-feels.md updated (form section, motion).
- Fix 3 (send stills, not the sheet) is the orchestrator's.

## Earlier: concept phase
- Jam closed (director turn 6): ONE concept, the claim-check stub. Tab, seal,
  stamp, one-band all dead. Rulings: list drops while the form is open
  (owner decides, Q1, stills show it); title drop order " list" -> count ->
  city ellipsis (decided, also for plan names); x paper; one ON tile in the
  band at a time; perforation must read at 1x.
- Rendered the five owner stills + overview into `concepts/stub/`
  (`render.js` for the raw stills, `compose.js` for the pair / strip / states
  / overview). Spec and motion in `concepts/stub/looks-and-feels.md`.
  Systems owns `how-it-works.md`, `appendix/`, `jobs.md` (consistent with
  mine: checked states, 60px, rotation).
- Perforation 1x check: --hair on orange is 1.87:1, faint at 1x
  (`perf-1x-hair.png`). Raised to --paper (2.46:1, `perf-1x-paper.png`),
  the paper showing through the holes. No marks added.
- Motion settled: the + -> x turn + field crossfade run 0.3s ease, the
  sheet's own collapse timing (was 150ms in the jam; changed so the turn
  spans the ride as one gesture). List already down: same turn in place.
- Stills use Reykjavik (the real trip) except still 5 (Copenhagen).
  REYKJAVIK LIST (23) fits at 390; COPENHAGEN (23) drops "list" at 390;
  COPENHA... at 320.
- Real-app behaviours verified in render: Add hit-tests as ADD LOCATION at
  390x664 with the drop (stub y 604, Add y 450-494).
- Jobs check (jobs.md 1-6): 1 reach (stills 1/3, appendix collapsed and
  filters), 2 primary (still 1), 3 finish near thumb at 664 (still 2),
  4 cancel restores (motion spec: exact reverse), 5 never over pins/tag/
  names/x (stub lives in the header; still 3), 6 signed out looks identical
  (appendix). Covered.
- Next: director/CD scoring of the concept; answer the builder later in
  handoff.md "How it looks and feels". Optional tappable copy for the owner
  only if the director asks.

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
