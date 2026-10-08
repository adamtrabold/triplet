# Visual designer notes: sign-in button

## Where things stand (after jam turn 2)
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
- Optional whimsy: ±2° seeded arc tilt per device (stampTilt analogue).

## Killed (with reasons in jam turn 2)
Dashed person (grit at 1x), blind emboss resting state (illegible), text
roundel (upside-down words, no person), orange-ink paper die (reads as a
faded signed-in badge), 42px die (type 6.7px), coin flip (slide/turn),
ribbon tail (string collision), ex-libris plate (second row of text).
Patch band A3+ kept only as a bold alternate (too heavy vs `+`).

## Director objections
- None yet.

## Open questions
- Motion in scope this round?
- Signed-in initial (A/E) instead of a generic person: in or parked?
- Keyline weight; outline vs solid person at 10px; legibility on device
  (my renders are Chromium).
- Register-sheet sign-in form: scope?

## Next
- After the director steers: build the chosen concept's states (rest,
  pressed, focus, strike, dry-up, signed-in + dropdown, 320px, in the real
  app via a copied index.html in `../concepts/`), stills at 1x/3x.
