# Visual designer notes: sign-in button

## Round 2e (owner on 2d: "I forgot it was orange and blue when signed in so let's do white and blue signed out";
## clarified: "I mean the style it was before I said to change it to orange and blue")
- I started on two readings of "white and blue": paper marks on the navy die, and a paper die with navy marks. The
  owner's clarification settled it on 2c's paper style before the sheet went out, so the first reading was dropped,
  not shown. (Its one strength, for the record: signing in "colours in" the marks, like the visited rule.)
- Spec: V[14] in `badge2.js` = V[9]'s geometry + 2c's colours (paper-raised die, warm 1px edge, 1px shadow, navy
  ink). `badgeA({pressed:1})` on a paper die = --paper-pressed face, navy ink.
- Signed in is unchanged. The sign-in moment is the original Strike (navy floods the paper, the person turns orange
  and grows), and it can be seen again. The dry-up returns to paper. The states now differ by die, ink, words and size.
- Sheet `sheet-2e-3x.png` (+ `-1x`), stills in `shots/2e/`. It opens with signed out and signed in side by side at 3x,
  then pressed, with 2d for reference. Real size follows: the top strip, signed-out vs signed-in crops, and the
  darkest map. Then the in/out strips.
- Open: (1) see it beside the new orange + before the build. A paper badge next to an orange + should read quieter,
  which is right for a secondary control, but check it. (2) The 0.13s paper fringe at the scallop tips (README).
  (3) Flow sheet frame 5 still points at the 2b frames; once approved, re-point it to `round2/shots/2e/in-*`.
  (4) Q1/Q2 from earlier rounds are still unanswered.
- Next: the director's look, then the owner; then the handoff's looks-and-feels part, with V[14] as the spec.

## Round 2d (owner on 2c: "Person is too high and let's take it to the blue and orange style again since the plus is changing")
- v9 = navy die + orange person/arc (today's account colours; `nv` flag), person cy 21.6 / arc ay 23.2 (midway 2b-2c,
  judged on navy against 2b/2c heights). Ink box centre 27.35, room 8.6/3.9, rim clearance 3.47, gap 7.24.
- Pressed = --state-on-press face + paper ink. Orange-on-navy 5.08:1.
- Rendered alone in the corner (SOLO=1) since + is changing (+ crew: 60px orange badge, placement theirs).
- Motion: navy strike is invisible except over orange, so the words sink into the navy. Dry-up fades them back.
- Risk: signed-out vs signed-in now differ only by the arc and the person's size (job 2). Flagged for the director.
- Sheet `sheet-2d-3x.png`, stills `shots/2d/`. Flow sheet frame 5 still points at 2b; re-point after approval.

## Round 2c presentation (director: B/v7 = 9, A/v6 = 8; show B only)
- `sheet-2c-3x.png` re-shot to the same path (1170x2808). A is cut everywhere. The sheet leads with a small 'Before' badge next to B at 3x and a plain line with no letters, then B's real-size crops two across (next to +, over water, alone on cream and on water), then the in/out strips. v6 stays in code and shots for the record.

## Round 2c (owner on 2b: "feels weighted low ... everything up some / visually centered ... more space betwen the icon and sign in -- look at the inspo")
- Inspo: passport-stamps-grid (LONDON roundel, DUBLIN oval: emblem + curved words as one block, even margins)
  and matchbooks-collage-1 (Little Washington seal, Ralph's arc: air between emblem and arc type).
- Group centred by ink: person cy 25 -> 18.4, arc centre ay 25 -> 21.6 (arc no longer concentric; rim clearance
  2.25 -> 4.22). Ink bbox centre 29.9 -> 24.9; gap person-to-caps 5.6 -> 8.8; room top/bottom 5.4/5.6.
  Sheet shows A (v6: 18.8/21.2) and B (v7: 18.4/21.6, pick). `sheet-2c-3x.png`, `shots/2c/`.
- Strike blot and dry-up are now centred on the person's current centre (no cut figure at 0.06s). This is a
  no-op for cy 25.
- Tools: `ink.html/ink.js/ink.py` (ink balance and rim clearance), `measure.*` (gaps/angles), `lift.html` (sketch).
- Flow sheet frame 5 still points at the 2b frames (`round2/shots/in-*`). After the owner picks A/B, re-point it
  to `round2/shots/2c/in-*` and re-shoot.
- Next: owner picks A/B (or approves B); then the handoff's looks-and-feels, with values from the README table.

## Round 2b (director scored 2 = 8, 1/3 = 7; fixes applied to 2 only, files overwritten in place)
- V[2] now: person x0.68 at true centre (25,25), stroke 1.45; text 6px Archivo 700, 100% width, tracking 1.3px
  (0.22em), hair space between words, baseline r 16.6.
- Measured: valleys r 18.81 -> 2.2px clearance; ink gaps 2.01/2.06/2.16/[N-I 3.88]/2.21 -> word gap 1.85x;
  end letters ±53.8° from 6 o'clock; cap tops r 12.49 vs figure ink r 6.85 (5.6px air, no nudge needed).
- Enlargements: edge/shadow kept at 1 CSS px. Sheet leads with 2 alone; 1 and 3 dropped from the sheet.
- Flow sheet re-titled "Signing in", frame 5 points at round2 frames; re-shot.
- Next: director's quick real-size re-look; then the owner; then handoff looks-and-feels.

## Where things stand (round 2 of concept A, 2026-10-12; new visual designer took over)
- Owner turned A down (rejection 1 of a 9): "on the right track but it's ugly. icon should be centered...
  maybe too small? text should be smaller and probably tracked out some because it's crowding".
- Round 2 in `concepts/A-arc-badge/round2/`: `sheet-3x.png` (3 variants up close + real size next to +,
  over water, and alone in the corner; motion strip for variant 2), `README.md` (what changed + table),
  `badge2.js` (variant-aware `SB.badgeA({v})` + `SB.centerArcs()`), `render2.js`, `sheet.html`, `sketch.html`.
- Changes: person centred at (25,25) by glyph bbox and bigger (x0.58/0.68/0.76); text 6.5/6/5.5px at 100% width
  with 1.3/1.8/2.3px tracking on r 17.6/18/18.3. My pick: **2 (Balanced)**.
- Found a round-1 bug: the arc text leaned off-centre (Chromium textPath + middle anchor + letter-spacing).
  Fixed by measuring glyph angles and rotating the arc group (`SB.centerArcs`). Probably part of "ugly".
- Condensed 75% at small size was the crowding; tracked caps at small sizes want normal width.
- Badge shown alone in the corner (+ may move, separate crew); it holds up on its own.
- Motion unchanged in kind; person now only grows/thickens (no travel). Flow sheet frame 5 still uses round-1
  frames: re-point to `round2/shots/in-*` after the pick (README says how).
- Next: director picks a variant (or asks for a tweak); then owner sees the sheet; then the looks-and-feels
  part of handoff.md.

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
