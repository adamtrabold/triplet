# Brand signatures (round 3, 2026-10-26, canvas v260)

Board "Brand signatures" on the Grid concepts page (`Grid7Signatures.dc.html`). Generator: `python3 -I src/signatures-board.py <live Grid7Now.dc.html> reference/generic <out>`. Still: `stills/signatures-board.png`. History: round 1 (v256, swoop/flare/press) scored 6 (jam turn 173); round 2 (v258, weight + shadow, the bracket, swings on lintel/plinth, the ring) scored 7 (turn 175 and addenda 1-3).

## The owner's words on round 2 (verbatim)

- "the bracket looks really awkward -- i don't like it. i'd prefer to use an apple-like methodology where the roundedness matches how something would actually be machined to be smooth."
- "bevel is *way* better than proposed version... how do we square these logics."
- "no this is bad... a building can't have a rounded base it will look like it's wobbling." (plinth sag)
- "no i hate this too . what about the sides?" (lintel arch)
- "i can't see what the new icon would look like"

Earlier: the ask ("1-3 core brand visual signatures ... as a filter"), "swoop, flare, press are all things i've basically said verbatim", "what's the underlying shape that a handle is", and the blocks note ("only ellipses no circles... do not weight towards this just keep it as a possibility"). Full text in `../owner.md`.

## The signature: weight

Triplet's objects are heavy things, set down and carried. Two yes/no tests show it:

1. **Squashed.** No curve is a circle: every curve is cut from an ellipse 4/5 or flatter, as if a round had settled under weight. (Tool rounds at corners aside.)
2. **Machined where it carries.** Wherever one part holds another, the join is cut by a tool (a chamfer across a step, or a fillet), never a plain corner.

- **The generic test (director's standing test):** the same objects from Material Symbols Rounded, Phosphor and Lucide all fail on every object (cup, glass, museum, tree, fork, bag): round bowls and handles, circular fork heads, plain stems and trunks, columns that float. Ours pass on all six approved (the museum, star and + have no curves, so test 1 is empty for them). Apple SF Symbols can't be redistributed, so they're not shown; by eye they fail both tests on the cup and the wine glass.
- **Honest finding:** at 24px only two things separate our six from those sets: the shape of the curves and how parts join. Weight is the idea behind both. His "only ellipses no circles" note turned out to be one of its two tests; we did not start from it.
- **Reads at:** 24 and 72 (a flattened bowl and a cut join show at 24 on 2x/3x). At 12 the shadow carries the icon.
- **Buildable:** test 1 = every root curve's ellipse ratio ≤ 4/5 (the vessel, cap, ring roots already are); test 2 = every holds/overhang join is a chamfer or a cutter fillet (the machined rule below).
- **Today's bag fails both:** its handle is nearly a circle (0.94) and stands on a ledge.

## The machined rule (replaces the bracket; the bracket is out)

- **Three cutters**, each double the last: fine 0.15, medium 0.3, broad 0.6 (2/5 line). Every round is the radius of the tool that cut it. Outside rounder than inside; never more than 1/5 of the shorter edge (the rounds table, re-derived as tools: the table's 0.35 tip and 0.7 wide outside collapse to medium and broad).
- **Continuous curvature:** every round ramps in from the straight (Apple's continuous corner: the curve starts about 1.5x the radius back along each edge), never a circle meeting a line. The engine's fairing already makes rounds curvature-smooth; this makes it the rule for every round. (The board's proposals approximate the ramp with one cubic per corner.)
- **Thin into thick, by join type:** a post under an overhang: a **chamfer** across the step, its two edges broken by the fine cutter (the museum's bevel he prefers comes out of this). A post into a curved face: the **broad** fillet (the bar's stem and the fork's neck, as approved). A post into a flat face: the **medium** fillet (the bed). No added flare shapes.
- **Against today (approved drawings, ghost cutters on the board):** museum capital = chamfer, passes; bar stem into bowl and fork neck = broad fillets, pass; tree trunk 0.42 snaps to broad (the tier droops); bed leg 0.38 snaps to medium.

## Proposals, shown finished (in the badge, 72 and 24, beside the six)

- **Museum, sides** ("what about the sides?"): the outer columns' faces swell as one shallow ellipse arc, 1/6 line out at mid-height (entasis, as a Greek column swells). Capitals stay the bevel (chamfer, fine cutters). Base flat, gable separated, openings square, four columns. Not the v220 foot sweep (it swells in the middle, not out at the foot), not a rounded base or lintel. At 24 on 1x the swell is a quarter pixel: it reads at 72 and on 2x/3x.
- **Bag A, tote:** the ring lies level along the top (long axis along the edge), so it reads as a carried handle, not a kettlebell's grip; sides bow 0.3 (a full bag; the swing on the sides); flat base; medium fillets where the ring meets the body.
- **Bag B, paper:** taller and narrower, sides bow 0.2, a folded hem as one cut.
- A blind "what is this?" read of the bags at 24 is still owed by someone who hasn't seen them.
- Hand-built from root shapes and the three cutters, not engine output.

## Givens (the bar, not signatures)

- **The shadow:** fill every cut; the side-on silhouette still names it (the 12px test).
- **The press:** the three cutters.
- **A handle is a ring:** one whole ellipse 4/5, its hole the same ellipse with both radii shortened by one line (wall one line all round), centre on the body's edge so half shows. The cup's ear already is it (within 0.1px). Round 3 lays the bag's ring level.

## How we got here

Random draws (round 3: saddlery, enamel signs, signwriting, carousel carving; earlier: kites, tailoring, knots, glassblowing, origami; Oblique Strategies) and the director's test that a signature must fail Material, Phosphor and Lucide. Candidates cut over the rounds: seam, landing, stack, free end, blown; the shadow moved to the givens (every good sign set passes it).

## Open questions (on the board)

1. Weight, shown by two tests (squashed curves; machined where it carries): is that the signature?
2. The museum's sides: does the swell read as part of the building, or push it / drop it?
3. Bag A (tote) or B (paper)? Or neither yet?
