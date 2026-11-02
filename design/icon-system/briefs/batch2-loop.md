# Brief: design loop for the eight icons not yet approved

Work folder: `design/icon-system/batch2/` (`jam.md`, `jobs.md`, `concepts/`). Scores in `design/icon-system/grid/scores.md`. Notes persist in `design/icon-system/notes/<role>.md`.

## The owner's words (verbatim)

> some of these aren't looking super great yet. there may be some preconcieved notions on what these icons should be... i see in the rules a LOT of detail when i thought we'd do the loop for all of them?
> i think you should run the design loop on the icons yes. idk if they all need separate loops or if one loop for all or whatever

Standing: "the system should be EVER PRESENT"; "all the decisions we make should be evolving the SYSTEM and we are testing these first six icons as a TEST OF THE SYSTEM"; "dont be defining shit based on singular icons"; "what it looks like is more important than letter of the law"; brand = plain (signs and tags), made by a tool, left of centre (personality from the subject chosen, like the coupe over a wine glass).

## The eight

Landmark, Attraction, Venue, Hotel, Shopping, Park (pins) and Neighborhood, Street (shapes, in the app's diamond badge). Meanings and the "what am I doing there?" / "would I filter for just these?" tests: `design/icon-system/categories.md`.

## History, not commandment

The subjects picked on 10-16, before the system existed (Landmark Nordic loop, Attraction Ferris wheel, Park bench, Venue curtain, Hotel bed, Neighbourhood city blocks, Street walker), and the one-shot built from them (canvas v293-v294; director turns 220-222; the bed and bag scored 9; the Nordic loop reads as the ⌘ key; city blocks read as tiles). His 10-15 words on some of these are in `design/icon-system/owner.md` lines ~60-75 (e.g. "walker is the best here", "bed is the best here", the bag "easier to understand at a glance", "the bag ... may be one step too common?"). He now says these may be preconceived. Weigh them; don't assume them. Shopping's earlier rounds: `design/icon-system/shopping/`.

## Settled

The system (`grid/THE-SYSTEM.md`, `grid/src/system*.js`): every concept is drawn through it, as a declaration only; any new rule must be general. The approved icons (café, coupe, museum, tree, fork and knife, star, +) don't change. Concepts are shown as finished icons at the app's real sizes (18 in the 24 ring; diamond badge for shapes), real SVGs, beside the approved set.

## How it runs (orchestrator's call: one loop for all eight)

One jam covering all eight, so the family is designed together; jobs per category; 2-3 distinct concepts per category; the director scores all in one pass with a fresh blind read; only 9s go to the owner, all eight together.

## Canvas

https://claude.ai/artifact/SVKZ9PpaMCKUpk7Ks622jW. Designers publish ONE board "Batch 2 concepts" on the Grid concepts page, only when the director passes it. The page keeps Start here + Icons + Icons on the grid + Rules + this board. Read the live canvas right before publishing; archive, never delete.

## Git

Own worktree: `git fetch origin claude/elegant-galileo-1c5ntm && git checkout -B <name> origin/claude/elegant-galileo-1c5ntm`. Push WIP every ~20 minutes; push `git push origin HEAD:claude/elegant-galileo-1c5ntm` (fetch and merge on rejection). Commits end with:

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_017adeKGQosgkH8rdDFz7cVM
