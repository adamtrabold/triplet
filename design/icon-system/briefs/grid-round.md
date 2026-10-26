# Brief: THE GRID — one pixel grid and visual system that makes coherent icons from our rules

## The owner's words (verbatim, newest last)

> we're not at drawing step next, next step is defining the grid
> I don't understand. I see a bunch of icons redrawn. I don't see a single grid
> I am glad we have the outer stuff defined in that grid by what about the interior? There's nothing to keep them consistent outside height/width and space to the ring
> star feels a lot bigger than the others. again with these size things, address this at the grid level across all of them... i dont want to have to negotiate this all the time, "how could our grid be improved" is an overarching question we need to address
> the grid and various drawing approaches should be as much a part of the brand as anything
> yeah i think we should create something consistent because the goal of this is to establish the foundation for all future icons.. ideally future ones come out perfect on first try.
> it's be best if the underlying shapes were proportionally related to each other and the grid so they weren't just random.
> the long play is an iphone app, so we need to resolve the subpixel issue. subpixels are fine in some cases, but in core dimensions and core line landings the fuzziness is tough. ... i am also using a 5k LG display on mac...so im seeing these in high res no matter where i am looking.
> no i want the base grid to make great icons without extrawork
> lets just keep the line weight and stuff where it was and just opimize point placement as possible. the other options look like shit
> ok yeah i must be viewing these too big then -- nothing should go that thin.
> [museum plinth] i think of the counters as shapes. they can go to (or be shortened to) a whole pixel. no problem.
> [+ ends] why would moving the ends take them off whole pixels? it is a hard pixel number wide, it should be the same hard pixel number tall?
> the museum and coupe counters are reading as too small now -- maybe they could go up to 2px? would the museum width need to account for that so that the posts/beams can be the right size? im not sure how that is all constructed.
> re museum what does it look like if we just make it wide enough (and the grid pattern for whatever grid its aligning with) to support three cols with a 1px minimum counter space? that icon feels the most visually balanced with the rest. ... off center is not acceptable.
> The museum keeps getting worse. Why isn't the 2px counter on even pixels centered? Why is it getting taller? I just don't understand where the fuck the grid is in all of this these decisions are not making sense
> Why is there no grid!!! This whole fucking exercise has been about creating a system and grid!! For days! I am livid
> We talked about doing the counters 1 or 2 px I am so tired of this back and forth. I need a grid and visual system that creates coherent icons based on our rules

## What went wrong (measured by the orchestrator; check it)

- Two grids that never agreed: the construction grid (Master grid board; `grid/src/proportions.js`: outer size, ring space, proportions, a 1/3px lattice) and this week's whole-pixel rules (`grid/src/pixel-shapes.js`, `grid/pixel-fit.md`), added part by part.
- The 1/3px lattice lands at 3x but not at 2x (1/3px = 2/3 device px).
- `museum()` in `pixel-shapes.js` lays parts out from the centre line by sums: museum E's edges sit at 7.75, 9.25, 11.25, 12.75, 14.75, 16.25 — on neither grid. Three 1½ columns centred always put the middle one on 11.25..12.75.
- It grew taller because slabs went from ~1.04px (approved; thinner than the line) to 2px and columns from ~2.6 to 3, with no height limit held (approved 9.62 → 10.7).
- Rounds kept offering option menus (A/B/C, D/E) instead of one coherent answer from one system. He is tired of the back and forth.

## Settled (his rules; don't reopen)

1.5px line, monoweight; no ink thinner than the line; slabs and other solid parts are shapes on whole px; counters are shapes, whole px, 1 or 2px; line-mark ends whole; centred is centred, never off-centre; no per-size/per-screen fitting pass; every piece from a root shape, proportions related to each other and the grid; machined rounds and joins; holes are proportional root shapes; the approved six (cup, coupe, museum, tree, +, star) keep their sizes and character (tree and "Coupe, after" fixed points); the + and star are never in a ring; one star; brand = plain, made by a tool, left of centre.

## The task

Define THE grid — one pixel grid, explicit, that every icon is drawn on — and the visual system that makes icons from it, so a new icon "comes out perfect on first try" and every decision is explainable by the grid. Then the six come out of it.

- The grid is a thing he can SEE: its unit, the centre, keylines, the live area, and the positions a part's edges may take (whole px for shapes and counters; where the 1.5 line's edges go). Say in one line why each is what it is.
- How each kind of part lands on it (slab, counter, gap, line/post/wall, cap, curve, point, protrusion, a centred part, odd vs even counts of a repeated part such as columns) — as rules a new icon follows without judgement.
- Size is held by the grid: the approved width/height of each of the six is a limit, not an outcome. If the grid forces a change, show it and say exactly why in plain numbers.
- Answer his construction question plainly with the grid drawn: how a three-column museum sits on it (columns, counters 1 or 2px, beam, plinth, height), centred.
- The six, generated from the grid by the engine (not hand-placed), shown at 24 and 72 with the grid visible beneath each, and at true size on 2x and 3x crops. No option menus: one answer per icon. Where a genuine choice is HIS (not a craft call), at most one, stated with what each side costs.
- A check that proves it: a script that reads every edge of every icon and reports any edge off the grid. Zero off-grid edges except those the rules name.
- Write it down: `design/icon-system/grid/THE-GRID.md` (the spec a new designer can draw from alone), code in `grid/src/` (one source of truth, replacing the conflicting rules: retire or reconcile `pixel-shapes.js`'s and `proportions.js`'s rules; say what was retired).

## Canvas

https://claude.ai/artifact/SVKZ9PpaMCKUpk7Ks622jW (Design-type; Artifact tool read with `path` `project/canvas.json`, then boards; the read returns publishing instructions). ONE board "The grid" on the Grid concepts page, first after Start here, ≤ 2,400px measured, frame sized to content; a line on Start here; archive (never delete) the "Sharp at 2x and 3x" board it supersedes. Read the live canvas right before publishing; change only your boards. Phone-readable stills (~1500px wide, 2-3 PNGs) to `/tmp/claude-0/-home-user-la-trip-map/e88b6fb0-7c93-5435-a682-b10a85f40e06/scratchpad/grid-N.png`; open each yourself.

## Git

Own worktree: `git fetch origin claude/elegant-galileo-1c5ntm && git checkout -B the-grid origin/claude/elegant-galileo-1c5ntm`. Commit, push `git push origin HEAD:claude/elegant-galileo-1c5ntm` (fetch and merge on rejection, keep both sides). End commit messages with:

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_017adeKGQosgkH8rdDFz7cVM
