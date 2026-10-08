# Concept A, the arc badge: how it looks and feels (visual)

Sheet: `sheet-3x.png` (1170 wide). It's rendered from `index-A.html`, a patched
copy of `index.html` that `../flow/proto/render.js` writes from the real file
plus `../flow/proto/patch.js`. Team-only fallback sizes are in `team-fallback-3x.png`.

## Correction that reshapes the motion (affects A, B and jobs.md)
**At rest, the signed-in account badge is NAVY with an ORANGE person**, the
same as `+` (`#accountBtn` background `--navy`, colour `--figure`). It's
orange only while its menu is open (`.active`). The rejected still showed
the menu open, and the team (me included) read that as "signed in =
orange". So:
- The strike lands **navy ink**, not orange. Physically that works better:
  navy printed over the navy arc simply covers it, so the words disappear
  under the ink with no fade, and inside the ink the person **reverses to
  orange**, which is exactly how the signed-in badge is printed.
- The dry-up dries navy away, revealing the paper print beneath.
- `jobs.md` job 5 ("the same orange badge as today") should read "the same
  account badge as today" (navy; orange while its menu is open).
- Secondary vs `+` still holds: paper against two navy badges.

## Spec (as rendered)
- 50×50 button in `#accountBtn`'s place (`right: 74px`), same centre line
  as `+`. The scallop mask is off for this state; the drawing is an SVG.
- Face `--paper-raised` #FAF5EA; edge 1px `rgba(107,74,40,.22)` (the sticker's
  approved warm edge), outer outline only; a 1px contact shadow
  `rgba(0,0,0,.22)` offset down 1px. **Note:** the real `+` has no visible
  shadow (its `box-shadow` is clipped by its own mask), so this shadow is
  the paper badge's own, the minimum that lifts paper off a cream map.
- Person: the account glyph (lucide user) ×0.42, centred at (25, 17.6) in the
  50 box, 1.4px stroke, round caps/joins, navy.
- SIGN IN: Archivo 700, `font-stretch` 75%, 8px, letter-spacing 0.5px,
  navy, on `M9.4,25 A15.6,15.6 0 0 0 40.6,25` (`textPath`, startOffset 50%,
  `text-anchor` middle). Upright, no tilt, no texture, full-strength ink.
- Pressed: face → `--paper-pressed` #DCD3C3 (via `--sb-face`); ink unchanged.
- Focus-visible (records only): 2px navy outline, 2px offset.
- Signed in: today's button, untouched.

## Motion (stills on the sheet; timings are captions, not built)
- **In (arrival strike), 380ms:** STAR_POP's offsets and easings, scale only,
  no rotation, peak 1.12. Navy ink lands from the centre (a slightly rough
  blot, clipped to the badge), covering the arc. The person grows ×0.42 → ×1
  and moves to centre, its stroke 1.4 → 2px, and reverses to orange where
  the ink is.
- **Out (dry-up), DRY timing (~540ms with the snap):** thin lobes dry
  first, the centre last; the paper print is revealed, not animated. No pop.
- **Build note:** switching the button between its states must not run
  `#accountBtn`'s `transition: background .15s`. My first render showed a
  translucent navy square flashing for 150ms (the mask comes off while the
  background is still fading). Turn the transition off for the state swap.

## Why
- No rim, upright, flat ink: printed, not stamped (director turn 3); the
  sheet's side-by-side cleared any resemblance to VISITED.
- Navy-on-navy covering is a real printing behaviour, so the strike needs no
  invented fades: whimsy that carries meaning.
- Person outline at 1.4px matches the caps' stem weight: one drawing hand.

## Open
- 8px arc legibility on the owner's phone (the deciding risk). Fallback
  (team only): 8.5px, person ×0.38, in `team-fallback-3x.png`; 9px is the
  limit before the arc crowds the rim.
- Chromium-only renders; the warm edge on a real iPhone screen is unchecked.
