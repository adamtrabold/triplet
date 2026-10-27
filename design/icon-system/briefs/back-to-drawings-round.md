# Brief: back to the drawings, one-side fitting, built for iPhone

## The owner's words (verbatim, newest last)

> I want them to be as sharp as possible and strokes to be 1.5px. If it's not a strike it doesn't have to be 1.5px! Just has to read the right weight
> (on v274 "The grid", a 9) I'm bummed these dont look nearly as good as before
> I don't think it goes counter to "This is the opposite of your 'no i want the base grid to make great icons without extra work'" what i meant by that was that i want the system to create great icons without a specific refit process for a specific phone model. iPhone is the core output so having a specific pixel fitting process should not be an extra thing the system should just be creating for that environment.
> I don't remember what option a was but I think we should go back to what it was before trying to pixel fit and then just have that rule about one side should be pixel fitting whatever that was. Any other leanings we should absorb? I'm fine with size specific standards and approaches. Louie is right.

Still standing from earlier rounds (verbatim): "nothing should go that thin" (on 1.24px posts); "off center is not acceptable"; "the star in the row and the star in the tag are different stars -- they need to be the same star"; the + "should look visually the same weight, actual pixel is irrelevant"; the coupe options "are all terrible -- the drink looks empty"; "the museum and coupe counters are reading as too small now"; "the knife edge doesnt stick out far enough to be visible"; "the star is way too fucking big -- it would never be in a circle. and the plus is never in a circle like that."

## What "before trying to pixel fit" is

The drawings as of v264 ("Brand and Shopping", the round he called "ok this is a lot better"): `grid/svg/post-line/` (coupe = bar, museum, tree = nature, fork and knife = restaurant; posts at the line) plus the café, star and + as placed on v262 (`grid/svg/placement/`). Confirm against `grid/pixel-fit.md` ("Before = ...") and git (a7ed489f). The whole-pixel rounds after it (v266-v274: `pixel-shapes.js`, THE-GRID.md's all-solids-2px rule) are retired as the drawing method; keep what they learned as history.

## The rule he means ("one side should be pixel fitting")

From the research (sources below): a 1.5px stroke keeps ONE side on the pixel grid (Shopify Polaris: "since the stroke has half a pixel, one side of the stroke should always be aligned with the pixel grid"); "Align the outer edge of shapes to pixel boundaries when possible" and don't align the inner edge (GitHub Octicons, 1.5px stroke at 16 and 24).

## Leanings the orchestrator proposes to absorb (the owner asked; he may strike any; you own how they become rules)

1. Outer edges of shapes and one side of each 1.5 stroke on the grid; inner edges, counters and cut-outs sized by eye (Octicons; Polaris even cuts 1.25 inside shapes).
2. Alignment never at the cost of shape, curves or balance (Lucide: "Pixel alignment should not take precedence over the visual quality of the icon").
3. Curves and diagonals aren't snapped; their extremes (a bowl's bottom, a side) may be.
4. iPhone (3x) is the core output: "the grid" is what lands on its pixels by construction, not a refit pass. Say which unit that is and why (the old 1/3px lattice = one iPhone device pixel); the 5K (2x) is a check, not the target.
5. Size-specific drawings where a size needs it (Octicons draws 16 and 24 separately; Mantia: "It is just as important to create additional detail in a large icon as it is to remove excess detail in a small icon"): at least the 12px filter chip, and the in-app 18px badge glyph, as their own standards.
6. Optics over maths: overshoot, keylines per silhouette, weight judged by eye at true size on the target screen (Frere-Jones; Iconic: "Your eye balances mass, not bounding boxes").
7. Brand through traits (Mantia: "Use elements of your brand like color, shape, weight, and style").

## Carry-overs to answer on these drawings (his asks since v264 that are still open)

Coupe: drink reads full. Museum and coupe counters readable (he floated 2px, then a 1px minimum; judge by eye, not by rule). Knife edge visibly sticks out at 24. Star: one drawing, row and tag, sized by its real context, never in a ring. +: centred, equal arms, same visual weight as the set, in its button. Museum: three columns "the most visually balanced"; keep its approved size.

## Sources (cite in the doc)

Primer/Octicons https://primer.style/octicons/design-guidelines · Shopify Polaris https://polaris.shopify.com/design/icons/creating-icons · Lucide https://lucide.dev/contribute/icons/specification and /design-principles · Apple high-res https://developer.apple.com/library/ios/DOCUMENTATION/GraphicsAnimation/Conceptual/HighResolutionOSX/Optimizing/Optimizing.html · Material Symbols optical size https://developers.google.com/fonts/docs/material_symbols · Louie Mantia https://lmnt.me/blog/1024x1024.html, https://notes.jim-nielsen.com/n/2018-07-28-1227/ · Frere-Jones overshoot https://stockholmstypografiskagille.se/typonyheter/typeface-mechanics-001/ · Iconic https://iconic.iconbuddy.com/p/week-01-why-your-icons-look-off · Nucleo https://nucleoapp.com/ui-icons

## Deliver

- The six (and the fork and knife) from the v264 drawings with the rules above, generated by the engine (rules in code, so new icons inherit them), at true size on 3x and 2x crops, before (v264) / after, beside each other in the row. One answer per icon, no option menus; at most one question that is genuinely his.
- The rules written for a new designer: rewrite `grid/THE-GRID.md` as the spec (what retired, what kept), with the sources.
- A check that reports which edges land and which don't, by kind (outer, stroke side, inner), as information, not as the goal.
- Canvas https://claude.ai/artifact/SVKZ9PpaMCKUpk7Ks622jW (Artifact read with `path` `project/canvas.json`; the read returns publishing instructions): update "The grid" in place (≤2,400px measured, frame sized to content), archive v274's, never delete; read the live canvas right before publishing. Phone stills ~1500px wide to `/tmp/claude-0/-home-user-la-trip-map/e88b6fb0-7c93-5435-a682-b10a85f40e06/scratchpad/back-N.png`; open each.

## Git

Own worktree: `git fetch origin claude/elegant-galileo-1c5ntm && git checkout -B back-to-drawings origin/claude/elegant-galileo-1c5ntm`. Push `git push origin HEAD:claude/elegant-galileo-1c5ntm` (fetch and merge on rejection, keep both sides). End commit messages with:

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_017adeKGQosgkH8rdDFz7cVM
