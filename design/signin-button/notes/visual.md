# Visual designer notes: sign-in button

## Where things stand (concept phase, sheets built)
- Jam closed (director turn 6). Built three sheets from patched copies of index.html:
  `concepts/A-arc-badge/sheet-3x.png`, `concepts/B-label/sheet-3x.png`, `concepts/flow/sheet-3x.png`,
  each folder with `looks-and-feels.md`. Tools in `concepts/flow/proto/` (patch.js, render.js,
  make-sheets.js, sheet.css). Team-only A fallback: `concepts/A-arc-badge/team-fallback-3x.png`.
- **Correction found while rendering the real app:** the signed-in account badge at rest is NAVY with an
  ORANGE person (orange only with its menu open). The team assumed orange. Strike is now navy ink
  (covers the navy arc; the person reverses to orange inside the ink); dry-up dries navy. jobs.md job 5
  says "orange badge" and needs fixing (systems).
- Reshapes: B right edge at right:78 (aligns with the badge's visible scallop); sheet errors moved under
  the password field; playground line uses text-wrap: balance; build note: kill #accountBtn's background
  transition for the state swap (it flashed a navy square).
- Director scored A 9 (READY), B 7 (held back). Presentation fixes done (no redesign): flow sheet cut
  10041 -> 6516px tall (sign-in sheet once at full size; busy / both errors / Q1 real-app sheet as tight
  crops of fields+buttons; frame 1 cropped to the map part; 'works the same with B' dropped; arrival strip
  and both questions kept); sheet A intro adds "Signed in, it's inked into your usual navy badge.";
  sign-in/out frames on the final sheets are navy (the pass2-motion jam sketch still shows orange; it's
  superseded, not used). Busy button now a flat 50% orange/paper mix with ink-2 text (opacity left an
  inner box artifact).
- Next: owner sees sheet A + flow sheet; if approved, write the handoff's looks-and-feels part for A.


## Where things stand (after jam pass 2, turn 4)
- Pass 2 sheets: `../concepts/sketches/pass2-look-3x.png`, `pass2-motion-3x.png` (html + shared `lib.js`/`page.css`; real VISITED crop `rowstamp-crop-3x.png`).
- Director (turn 3) steered: two concepts, A arc badge + B printed label; printed not stamped (tilt killed); rim too loud; one drawing hand; motion as storyboard only; register sheet / playground notice / F1c out; signed-in initial parked.
- My pass-2 calls: A rim = none (warm 1px edge + `+`'s 1px shadow); A person outline 1.4px (solid killed); B = hotel-label banner with notched left tail (rect killed, scallop capsule alternate); B maybe 28px tall vs `+` dominance; A motion = Strike (STAR_POP scale only, peak ~1.12) in, dry-up out; B motion = two-object swap (weaker).

## Earlier (after jam turn 2)
- Jam turn 2 written in `../jam.md`. Sketches in `../concepts/sketches/`:
  `arc-badges.html` (SVG generator; real 50-unit scallop from index.html's
  mask), `arc-badges-3x.png` (1170 wide), `shoot.js` (renders any sketch at
  390 wide, 3x: `node shoot.js <html> <png>`; font is the vendored Archivo
  from `design/gesture-harness/vendor/`).
- Gotcha: index.html has more than one scallop polygon; the 50-unit one
  starts `45.00,25.00`. The first `points=` match is a 64-unit one.

## Decisions / positions (mine, not yet agreed)
- Secondary = the same scallop die cut from paper (`--paper-raised`), navy
  keyline + navy ink. Not orange (orange = signed in / you / action).
- Keep the die at 50px; shrink the person to ~10px (0.4 of the 24-unit
  glyph, centred y≈17.6 in the 50 box) so SIGN IN can be 8px Archivo 700,
  75% width, letter-spacing ~0.5, on a U arc of r≈15.6 (textPath,
  startOffset 50%, text-anchor middle; path `M9.4,25 A15.6,15.6 0 0 0
  40.6,25`). Sketch `A1+`.
- Motion: "the Strike" — sign-in = press + orange ink bleeds in + arc dries
  up + person grows; logout = dry-up-by-thickness back to paper. No flip.
- ~~±2° seeded arc tilt~~ KILLED by director (reads as the VISITED rubber stamp; sign-in is the form's own printed words).

## Killed (with reasons in jam turn 2)
Dashed person (grit at 1x), blind emboss resting state (illegible), text
roundel (upside-down words, no person), orange-ink paper die (reads as a
faded signed-in badge), 42px die (type 6.7px), coin flip (slide/turn),
ribbon tail (string collision), ex-libris plate (second row of text).
Patch band A3+ kept only as a bold alternate (too heavy vs `+`).

## Director objections
- Turn 3: tilt = stamp (killed); keyline the noisiest thing (fixed: no rim); glyph + arc must be one hand (fixed: 1.4px outline); patch band dead.
- Expected owner objections (director): A letters too small; looks like the visited stamp; sign-in louder than +; B 'just a button'.

## Open questions
- Motion in scope this round?
- Signed-in initial (A/E) instead of a generic person: in or parked?
- Keyline weight; outline vs solid person at 10px; legibility on device
  (my renders are Chromium).
- Register-sheet sign-in form: scope?

## Next
- Systems maps flow frames onto A and B; then concept build pass (final-looking stills at 1x/3x in the real app, copied index.html in `../concepts/`).
- After the director steers: build the chosen concept's states (rest,
  pressed, focus, strike, dry-up, signed-in + dropdown, 320px, in the real
  app via a copied index.html in `../concepts/`), stills at 1x/3x.
