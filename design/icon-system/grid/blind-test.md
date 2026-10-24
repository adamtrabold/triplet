# Blind test: two new icons from the spec

Canvas v240 (version id 1792880267-543d): new top section "Blind test: two new icons from the spec" on the
"Between H2 and H3" board (`project/Grid7Between.dc.html`). Board frame grown by 4600px; row 2 of the Grid page
(Master, Construction, its title note) moved down 4600px to clear it. Nothing else changed.

Read: the Construction board's spec, the master grid, `src/proportions.js`, `engine.js`, `laws7.js`, `picks7.js`
(API), `construction.js` (the pipeline Step 4 names), `optics.js`, `fair-check.js`, `join-check.js`,
`docs/owner-taste.md`. Not read: jam, archive, owner, history, scores, notes, archived boards.

## What I drew

- **Hotel: a bed** (shaped, side view). Roots: mattress (rectangle, widest root, 1/4 as tall as wide);
  headboard (post, 5/6 line, standing 1/3 of the mattress's width above it, running to the floor); foot leg
  (post); legs show one line (the trunk rule, reused); pillow (one ellipse, 1/3 of the mattress's width, 1/2 as
  tall as wide) resting on the mattress across the 1px cut. Engine: Wide, 11.00 x 8.00, 44 curves.
- **Account: a person** (outline, like the star), at a 24px slot. Roots: shoulders (top half of an ellipse 4/5
  as tall as wide, flat base, widest root); head (circle, 1/2 the shoulders' width) resting across the 1px cut.
  Counters by rule 5. Sized by its smallest counter = 2 1/2 lines. Finished 16.76 x 16.19px, mirrored, 28 curves.

New table lines: `PROP.bed`, `PROP.person` in `src/proportions.js`. Code: `src/picks-blind.js` (drawings),
`src/blind.js` (build + checks, -> `svg/blind/`), `src/blind-board.js` (board section).

## Result

- **Person: landed first time.** Fair check clean, join check clean, reads at 12/24/72 and in the account button.
- **Bed: did not.** Two rules failed:
  1. **Rule 11 (placed by weight)** as written centres any resting part over what it rests on, so the pillow
     sits mid-mattress ("a loaf on a bench"). Proposed fix: placed by weight only for a part resting on one
     other part alone; a part resting on one part and against another sits against it across the same cut.
  2. **Whole ellipse vs the fair check.** The 1/2 pillow fails TAIL x4 at its ends though it is a pure root.
     Whole ellipses at pillow size: 1/2 fails, 3/5 fails at 3.7px wide / passes at 5.5px, 2/3+ always pass.
     Proposed rule: a whole ellipse is at least 2/3 as tall as wide (flatter = a rounded rectangle or a cap).
  With both fixes (`bedFixed`: pillow against the headboard, 2/3): both checks clean, weight 45px² (coupe 45,
  cup 57, tree 34). The table keeps the blind 1/2 until the director rules.

## Spec gaps and choices

1. Outline mark with two counters: spec assumes one. Chose: the smallest counter across sets the size
   (shoulders', up the axis), because the rule keeps holes open. Sizing by the head leaves the shoulders' counter 2.4px.
2. Outline mark's slot: not specified. Chose 24px, the account button's glyph size (`#accountBtn` svg).
3. Corner law for outline marks: rule 14 gives one table (mass 0.6); the code draws the star with the joint law
   + tip share (mass 0.45). Chose rule 14.
4. One line vs the 1/3px lattice: 1 1/2px is off the lattice. Chose the first lattice line at least a line
   below the mattress (as the cup's saucer), so the legs show 1 2/3px.
5. Slab or mass: nothing says when a horizontal block is a slab (the line thick) or a mass (a shape). Chose mass.
6. "At most one cut per icon": the fixed pillow is 1px from mattress and headboard. Counted as one cut (one part, two faces).
- Inside the spec: side view (front-view pillows come out under 2px at 24); headboard as a post; legs reuse the
  trunk rule; shoulders reuse the vessel 4/5; mirrored the person (rule 11) though the star's build doesn't pass sym.
- Stale doc: the master grid board still says outline holes >= 4px and a 1 2/3px line; followed the spec.

## Checks run

- `fair-check.js` (knee, tail, jump, inflect, shelf, shoulder, dip, kink): person clean; bed blind 4 TAIL; bed fixed clean.
- `join-check.js` (jump, hump, wobble): all clean.
- Engine pipeline per Step 4 (class at fitted size, solved fit, rounds by kind, mirror, rule 16 centring).
- By eye at 12/24/72 beside the six, in list rows, in the 50px account button (rendered in Chromium).
