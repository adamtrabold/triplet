# Brand signatures (2026-10-26)

Owner (verbatim): "i think we're missing a set of brand-specific visual cues. thinking of the inspo and the brand identity this far -- i see whimsy and tactility. i see the joy of movement. this is represented by things like the root shapes harkening back to print icon mechanics (drawing with tools), i see the light swoops in the tree branches, and the flares. I see the graphic nature of the iconography harkening to travel signs. from there come up with 1-3 core brand visual signatures that we can apply as a filter on decisions (e.g. we need one element X one element Y)."

Canvas v256: Grid concepts page, board "Brand signatures" (`Grid7Signatures.dc.html`, generator `src/signatures-board.py`, still `stills/signatures-board.png`). Nothing is redrawn; the marks sit over the live drawings.

## Recommended: swoop, flare, press

**The filter: every place icon has one swoop and one flare. Every icon is pressed.** Marks (star, +, controls) carry the press only, so they stay plain beside the places.

Swoop = the joy of movement. Flare and press = the tactility of print and tools. Travel-sign clarity is the bar each one must clear, not a fourth cue: a swoop or flare that doesn't read on a solid silhouette at 24px is drawn wrong.

### 1. The swoop

- **Test:** does one side of a solid part bend as one shallow ellipse arc you could pull with a curve template?
- **His words:** "the light swoops in the tree branches"; "the joy of movement".
- **In the six:** café, the saucer's underside (and the cup's foot); bar, the bowl; tree, each tier's sweep and droop. Museum: none (question 1). Star, +: marks, not asked.
- **In new icons:** fork and knife, the knife's back; bed, the pillow's dome; bag, none (see below).
- **Built by:** a side of a mass or slab declared as one ellipse, flatter than a circle (the vessel's 4/5 or flatter; the cap's 7/6 cut), spanning at least half the drawing. Rules 6 and 11; the tier's droop (1/2 line) and sweep (1/5 line), rule 12. Checkable: the icon has at least one declared ellipse side on a mass or slab, of that span.
- **Rules out:** all-ruler drawings; half circles; curves that are only corner rounds; a loop or a hole standing in for it (the bag's handle is an arch, not a swoop).

### 2. The flare

- **Test:** where a thin part meets a heavier one, does its edge swell into it on a concave curve, like ink squeezed at the joint?
- **His words:** "the flares"; "something screened or pressed".
- **In the six:** bar, the stem into bowl and foot; museum, the capitals and the plinth; tree, the trunk into the lowest tier; café, the cup's foot leaning into the ear (the leaned flare). Star, +: marks, no flares by rule.
- **In new icons:** fork and knife, the fork's head and the knife's blade into their handles; bed, headboard and leg; bag, none (the handle stands on the body square).
- **Built by:** the holds join (a post flares 1/3 line, 0.5px, on open faces), the capital, the leaned flare into a curve (rule 4, rule 18; rounds table: flare 0.5, at most 0.45 of the shorter edge). Places only. Checkable: at least one holds or capital join.
- **Rules out:** square T and L joints; ink-trap notches; flares on outside edges or on line marks; flares bigger than 1/3 line.

### 3. The press

- **Test:** is every corner pressed soft, outside rounder than inside, with no knife point and no pill end?
- **His words:** "slight rounding of interior and exterior corners to add a vintage softness ... the effect of the rounding should allude to something screened or pressed".
- **In the six:** every corner; the star's soft tips and the +'s line ends are where the marks carry it.
- **Built by:** the rounds table (rule 17): mass corner 0.6, line end 0.3, tip 0.35 or less, inside join 0.15, never more than 1/5 of the shorter edge. Already checked by `src/rounds-check.js`.
- **Rules out:** sharp corners; one radius everywhere; round caps and pill ends; corners rounded so far the root shape is lost.

### Why this set

- It is what you see, so it is a filter a designer can apply by eye, and the engine can check from the root calls ("the brand should be built into the root calls").
- It predicts both failures he named: the museum (no swoop; "completely out of place", v147) and the bag (no swoop, no flare; reads as a padlock). The fork and knife and the bed pass and were the two new icons that read as family.
- The bag's next designer gets a brief instead of a drawing: one solid side drawn as a swoop, and a handle that flares into the body instead of standing on it.

## Alternatives considered

- **B · Three tools: compass, brush, knife** (how it was made). Every curve from a whole circle or ellipse; every join lands with a flare or lifts to a soft tip; one knife cut lets the paper in (a lifted part or a hole). Drawn from brush calligraphy (press and release) and letterpress (blocks of type). Not recommended: the bag passes compass and knife and still reads as a padlock. It tests the making, not the look, so it is too easy to pass; the tree, the + and the fork fail the knife.
- **C · Signpost: stands, lifts** (composition and play). Every place stands on a level ground edge, like a sign symbol; one part floats free on a paper gap (the cup off its saucer, the gable off its beam, the pillow). The lift is the most whimsical cue the family has. Not recommended: it would ask him to change the coupe, the tree and the fork (none has a lift; the fork has no ground), and the ground edge is shared by every sign set, so it isn't ours.
- **Also weighed: "ellipses, never circles"** (owner, 10-26, on the Rules board's blocks strip: "the blocks can be part of this visual signature, for instance i'm seeing only ellipses no circles... not that this is correct, but something to consider. do not weight towards this just keep it as a possibility"; `owner-marks/v255-rules-blocks.png`). Not shortlisted as its own signature: the museum, tree, star and + have no curves to test, and the bag passes it (its handle is an ellipse) yet reads as a padlock. It already lives inside the swoop, which must be flatter than a circle.
- First idea thrown away: "one flare, one swoop" as two decorations to add. Kept only after reframing as features of root calls (an ellipse side, a holds join), so they come from construction, not from ornament.

How I got past the first idea: a random draw (brush calligraphy, cake piping, letterpress; Oblique Strategies "Use an old idea", "Emphasize the flaws"; constraint "must be countable"). Calligraphy and piping gave press-and-release (B); "emphasize the flaws" gave the lift, the gap where parts don't touch (C); "countable" gave the one-swoop-one-flare form of A.

## Open questions (on the board)

1. The museum has flares and press but no swoop. Should buildings be the one kind exempt from the swoop, or should the museum earn one? Not changed.
2. Is "every place icon has one swoop and one flare; every icon is pressed" the filter? If yes, it becomes an engine check on every new icon.
3. The lift (set C) is allowed by rule 14 but not asked for. Optional flourish, or a fourth signature?

Also unsure (team): at 24px on a 1x screen the flare is half a pixel and reads as softness, not shape; it reads as shape at 3x and on his 5K. The subpixel work (in progress elsewhere) decides whether 1/3 line lands cleanly.
