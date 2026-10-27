# Brief: build THE SYSTEM that derives the icons; then the icons

## The owner's words (verbatim, newest last)

> i feel like all of the guidance has been lost
> oh my god why the fuck are the brand and icon decisions not persistent we are building a SYSTEM
> no this is a bad way. create the SYSTEM to derive the icons. THEN create the icons. we are trying to get the SYSTEM to the right place so that the ICONS follow.
> bring back all of my decisions around source tooling, curvature, etc etc

Earlier, still standing: "I think declarative is fine but I don't want it to be so specific…it needs to be a flexible system that outputs coherent consistent icons." · "the brand should be built into the root calls" · "ideally future ones come out perfect on first try" · "no i want the base grid to make great icons without extrawork" (meaning: no per-device refit; the system itself produces crisp icons for the iPhone) · "they should be drawn at the right size" / "yes 18 should be the master, detail should be adjusted for 24px and 12px".

> make that part of the SYSTEM
> the system should be EVER PRESENT
> all the decisions we make should be evolving the SYSTEM and we are testing these first six icons as a TEST OF THE SYSTEM

## What that means for how we work (standing)

- The SYSTEM (`grid/THE-SYSTEM.md` + the engine) is the one place every decision lives. STANDING.md folds into it: each of his decisions is a rule of the system (in the spec and, where it can be, in code), not a separate list. Delete nothing; retire STANDING.md into the system and point to it.
- Every decision he makes from now on changes the system first; icons change only because the system did.
- The six (café, coupe, museum, tree, fork and knife; star and + as line marks) are a test of the system. A wrong icon is a finding about the system.
- The system is ever present: "The system" board is always the first thing on the page, and every round shows the system and its current rules beside the test icons.

## Inputs (read all)

- `design/icon-system/STANDING.md`: every standing decision, latest wins. This is the system's requirements list.
- `design/icon-system/owner.md`: all of it. Audit STANDING.md against it and against the decided engine features, and add anything missing, specifically his decisions on **source tooling** (the machined rule: rounds and joins by how a tool would cut them; the cutter rack; the chamfer/bevel under an overhang; the fillet into a face; the tip rule for sharp points), **curvature** (curves drawn whole from one circle or ellipse; continuous curvature at joins, no humps or wobbles leaving a join; a counter's curve follows the outside curve; inner corners rounder less than outer), roots and proportions, flares, caps, handles. Each as a plain directive with its date. Don't add anything he didn't decide.
- The existing engine and history of how the six were made: `grid/src/engine.js`, `joins.js`, `mix-curves.js`, `proportions.js`, `grid/flexible-system.md`, `grid/THE-GRID.md`, `grid/pixel-fit.md`, `grid/signatures.md` (the machined rule), `notes/systems.md`, `notes/visual.md` (latest: what the 18 redraw lost vs v264 and why). The v264 drawings (`grid/svg/post-line/`, `grid/svg/placement/`) are the character the system must reproduce.

## Task, in this order

1. **The system, as code and a spec.** One engine where an icon is a short, flexible declaration (which roots, how they relate, joined or cut) and the system supplies everything else from rules: the grid (18 master on the iPhone pixel grid, ⅓px; 24 and 12 as detail-adjusted variants), weights, snap priority (silhouette first), the machined joins/bevels/chamfers/fillets, curvature, counters, caps, handles, centring. No icon-specific geometry outside its declaration. Rounds change rules or declarations, never hand-placed points. Write the spec as plain directives (no sources, no history) in `grid/THE-SYSTEM.md`, replacing THE-GRID.md (archive it).
2. **Checks.** Every checkable STANDING line runs automatically on every build; a failure blocks publishing; non-automatable lines print as eye checks.
3. **Only then, the icons:** generate café, coupe, museum, tree, fork and knife (and the star and + as line marks) from their declarations, at 18 (master), 24 and 12. Where an icon comes out wrong, fix the system or the declaration, not the output. Report how close each comes to its v264 character, and every STANDING line it fails.
4. **Board:** "The grid" becomes "The system": the rules in a few lines, each icon's declaration beside its output, the icons as real inline SVGs at the size the app shows them (18 in its 24px ring first), v264 beside them. ≤2,400px. Read the live canvas right before publishing; archive what it replaces; the page keeps only Start here + this board. Directives only, no sources.

Not in scope: index.html, Shopping (it comes after, from the system).

## Git

Own worktree: `git fetch origin claude/elegant-galileo-1c5ntm && git checkout -B the-system origin/claude/elegant-galileo-1c5ntm`. Push `git push origin HEAD:claude/elegant-galileo-1c5ntm` (fetch and merge on rejection, keep both sides). End commit messages with:

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_017adeKGQosgkH8rdDFz7cVM
