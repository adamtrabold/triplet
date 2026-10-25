# Blind test, round 2: a bag and a heart from the spec

Drawn by a designer who had read only the Construction board's spec, the master grid, `src/proportions.js`,
`engine.js`, `laws7.js`, the API of `picks7.js`, the checks, and `docs/owner-taste.md`. Nothing from the six's history.

- Code: `src/picks-blind2.js` (the drawings and the builds). New values: `PROP.bag`, `PROP.heart` in `src/proportions.js`.
- Checks: `src/blind2-checks.js` (fair, join, walls; `jitter <ids>` runs `src/jitter-check.js` on them). Results:
  `svg/blind2/checks.json`, `svg/g7/jitter/{bag,heart,heart-on}.json`.
- Outlines: `svg/blind2/{bag,heart,heart-on}.svg`, the build record `svg/blind2/construction.json`.
- Board section: `src/blind2-board.js`, at the top of "Between H2 and H3" (`project/Grid7Between.dc.html`).
- Canvas version: see the end of this file.

## What I drew

**Shopping, a carrier bag.** Class: **shaped**, by rule 15's second line: "If it names what a place is (a category, in
the badge ring), it is shaped, a solid mass."
- Body: a rectangle, a mass (rule 5), the widest root (1). It is 4/5 as tall as it is wide.
- Handle: a loop a line thick (1 1/2px), a half circle on two arms, 3/5 of the body's width outside. Its counter is a
  circle on the same centre, a line less (rule 7), running straight for half a line into the body's top wall (rule 7).
  The body's top sits on the first lattice line past the arms (rule 10).
- The engine picked **Tall** (0.82 wide to tall at its fitted size; I started it as Square). It is 8.56 × 10.18px, so
  it meets the cut's width. It is mirrored and centred by rule 19.
- Rounds: bottom corners 0.6 (mass corner), top corners 0.3 (line end: see gap 3), handle into body 0.15, counter
  corners 0.15.

**Favourite, a heart.** Class: **outline**, solid when on, by rule 15's first line: "If a tap fills it (a state that
toggles: the star, visited), it is an outline, the same shape solid when on."
- Roots: a square turned 45° and two circles, each as wide as the square's side (1), centred on its upper sides'
  midpoints. Each circle runs into the square's lower sides tangent (rule 6), and they meet at the square's top corner,
  a 90° cleft. One ratio makes the whole outside.
- Counter: rule 7 per root. The square loses a wall on each side and each circle loses a line, all on their own centres.
- Size: by its outside to the outline cut, Square (1.11 wide to tall): 14.07 × 12.68px at its 20px slot. It has
  57.3px² of ink, against the star's 58.4.
- Rounds (line marks): the point 0.45 (a 90° outside corner counts as a mass corner, not a tip), the cleft 0.15,
  counter corners 0.11 to 0.15.

## Verdict by eye, beside the six, before any check

Neither landed first time.
- **Heart.** Right size and weight beside the star. Its counter, drawn by rule 7 as written, has two notches low on the
  inner lobes and a V under the cleft, which show at 72 and 3x.
- **Bag.** Right size, but the darkest thing in the row (69px² against the museum's 63, the cup's 57 and the tree's
  34, all in one block). It has none of the family's joins, and at 12 and 24px it reads close to a padlock.

## Spec gaps and choices

1. **Rule 7, a counter of overlapping roots.** Spec gap: a counter "the same shape on the same centre made smaller"
   gives even walls only when the counter is one root. I chose the per-root reading (each root less a wall), because
   that is how the spec defines counters ("a counter is a root"; "less a wall on each axis"). Cost:
   - the smaller square's side corners stick out past the smaller circles, making notches;
   - its top corner makes a V under the cleft;
   - the walls run 1.49 to 1.73px against 1.5, with 69 samples off.

   The other reading, the heart scaled, has uneven walls too. A rule that would hold: the counter is the outside's
   roots (circles, lower sides) each moved in by a line; where two outside roots meet in a notch, the wall turns on a
   circle of the line's radius about that point.
2. **Rule 4, a loop fixed to a mass (the handle).** Spec gap: it is not holds, overhang, rests, base or free. I chose no
   kind and let the engine's law answer (a 0.15 join), because the spec gives nothing else. Finding: the engine treats a
   join by its angle and edge length, not by its kind. If the arm were 1.5px or longer it would flare whatever its kind.
   The cup's ear is the same unnamed case.
3. **Rule 17, line end vs mass corner.** Spec gap: a mass corner whose edge is cut short by a joined part (the handle
   leaves 1.71px of top edge) gets the line end's 0.3, not the mass's 0.6. I left it as the engine drew it. At 72 the
   top corners read crisper than the bottom ones.
4. **Rule 4, base, for a mass that sits on the ground with no posts** (a bag, a box, a suitcase). Spec gap: base covers
   no such case. I chose no base, because nothing in the rule asks for one.
5. **Rule 2, a turned root.** Spec gap: whether a root may be rotated. I chose to turn the square 45°, because the
   heart's sides are its edges.
6. **Rule 15, the heart's slot.** Spec gap: no slot is set for a favourite toggle. I chose 20px, the row star's,
   because it is the same job.
7. **Rule 15, the "on" state.** Spec gap: its colour and its column of the round table. I chose the line-mark column
   (the same outline) and showed it in the star's orange. The colour is a brand call, not mine.
8. **Rule 13, the mirror, on an outline mark.** Spec gap / engine disagreement: rule 13 and step 4 say mirror, but
   `construction.js` builds the outline marks unmirrored. What I found:
   - Mirrored (engine `symD`), the heart showed KNEE + SHOULDER on the axis, at the cleft and at the counter's V.
   - The engine crashed on a nudged rebuild (`symD`: "k.segments is not iterable").
   - Unmirrored, the star's way, it is fair-clean but mirrors only to 0.07px (the star itself is off by 0.03px).

   I chose unmirrored, the engine's own outline path. The bag, mirrored as the six are, shows the same seam under the jitter check: 27 of 50 nudged builds put a KINK at the handle's crown on the axis and move the outline 0.33 to 0.37px there; the rest move 0.03px or less.
9. **Rule 20, fair check on the bag's handle.** JUMP where the loop's outer half circle leaves its half-line arm, both
   sides. The cup's loop is eased there and this one is not. Splitting the arc as the cup's bottom is split changed
   nothing (tested). Probable cause: the arm is too short for the ease. Rule 7 gives the counter its run-in and says
   nothing about the loop's outside. Not patched.
10. **Weight.** Spec gap: no rule sizes or lightens a plain mass by weight, so a solid mass comes out darkest.
11. **What makes it ours, on a plain mass.** Spec gap: none of the five treatments fire on the bag, so it is generic
    (round 1's finding again). That and the padlock reading are partly my concept, but the spec gives no push toward
    the family.
12. **Rule 20, jitter: the engine loses the heart.** With its size nudged 0.015px (the square's side 9.879 or 9.900
    against 9.890), `E.build` returns an empty outline and the jitter check stops. A sweep of 21 sides from 9.880 to
    9.900 lost one (9.888). Probable cause: the roots meet tangent, as rule 6 asks, and the booleans or the corner pass
    drop them. The heart shown is the build at the solved size, which is whole. The spec asks for tangents the engine
    can't build reliably.

## Checks (rule 20)

| Check | Bag | Heart, off | Heart, on |
|---|---|---|---|
| Fair check | JUMP, JUMP (handle arc into arm) | clean (unmirrored) | clean |
| Join check | clean | clean | clean |
| Jitter (50 nudged + 3 fixed) | FAILS: max move 0.37px (limit 0.05), 27 verdict changes (KINK at the handle crown, on the mirror axis; gap 8) | FAILS: empty outline at some nudges (gap 12) | FAILS: empty outline at some nudges too |
| Walls (offset-check) | 1.50 to 1.51px | 1.49 to 1.73px (69 off) | no counter |
| Counters ≥ 2 lines (outline marks) | n/a (handle's 2.13px) | lobes over 5px: pass | n/a |
| Slivers / symmetry (check-svg.py) | mirrors; zero-length closing line as the six | 0.07px (unmirrored) | 0.07px |
| rounds-check.js | holds (engine unchanged) | | |
| By eye at 12, 24, 72 | heaviest; padlock-like; generic | size and weight right; notches at 72 | reads well |

## Canvas

Published to the canvas (https://claude.ai/artifact/SVKZ9PpaMCKUpk7Ks622jW) as **version 245** (id 1792919279-1893): a new section at the top of "Between H2 and H3", above round 1; nothing else on the board changed except its frame height in `canvas.json` (15360 to 20860).
