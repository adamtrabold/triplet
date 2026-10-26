# Brief: Shopping, a new concept round (design loop, concept phase)

Work folder: `design/icon-system/shopping/` (its own `jam.md`, `jobs.md`, `concepts/`). Scores go in `design/icon-system/grid/scores.md`. Notes persist in `design/icon-system/notes/<role>.md`.

## The owner's words on Shopping (verbatim, in order)

> (10-15, Shopping A, carrier bag) i think bag is easier to udnerstand at a glance
> (10-26, on v247) And a bag should look like this system by the decisions it took to make the bag…the brand should be built into the root calls
> (10-26, canvas comment, the bag) im noticing the handle of the bag is meaningfully different from the handle of the cup -- maybe this could be reasoned about in some way in the rules
> (10-26, on the summary "Handles: one rule for all handles and loops") this is a bad rule -- what's the underlying shape that a handle is that we can make a good rule about
> (10-26, on v258, a bag proposal drawing) i can't see what the new icon would look like
> (10-26, on v260) some of these are too cheeky. i do think the prior straightforwardness is part of the allure considering the source inspiration. i dont think the swoop is working. i do think i like the machined rules a lot -- and maybe that is stronger than defining the rounds by a shape.. it's by underlying method of creation. i think all of these things together speak to the brand. the bag i think is conceptually the problem -- the way we have added personality is by icon choice -- the bar coupe is one of the specifically good ones. whereas other systems used a simple wine glass or something, we went slightly left-of-center. i think the shopping bag works, but it may be one step too common?
> (10-26, on v264 Brand and Shopping) i do not like any of the proposed shopping icons.

He gave no reason for the v264 rejection. Don't invent one; if the team needs it to proceed, say so as a question for him.

## Settled (don't reopen)

- The category: Shopping = "a shop or market stall" (`design/icon-system/categories.md`; the real places filed there are listed in it). Test: "what am I doing there?"
- The system: 1.5px monoweight line; no ink thinner than the line; every piece from a root shape, joined or cut, proportions halves to sixths of a parent root; holes are proportional root shapes; the machined rule for rounds and joins; outline/solid/open follows the icon's job; a handle is a ring (the cup's ear matches it). Read `design/icon-system/grid/flexible-system.md`, `grid/signatures.md`, `src/proportions.js`.
- Brand as three filters, his words: plain (signs and tags), made by a tool, left of centre (personality from the subject chosen, like the coupe over a wine glass).
- Rejected for Shopping (v263/v264, `grid/signatures.md`, still `grid/stills/brand-shopping-board.png`): swing tag, market basket, awning, parcel, till. Also rejected earlier: the "cheeky" proposals, the swoop.
- The six approved icons (cup, coupe, museum, tree, +, star) and the tree / "Coupe, after" are fixed points it must sit beside.
- A parallel round (shapes on whole pixels: counters to 2px, minimum protrusion, line marks resized) is running at the same time on the same branch. Draw on its rules as they land; don't change its files.

## Open

- The subject: what Shopping is, drawn. Anything, including a bag again if the team can say what makes it not "one step too common".
- How it is built from the system's roots, and what that adds to the rules (the handle question is open).

## How he judges

By eye at true size (24 in the badge, as it sits beside the six; 72 too), on an iPhone and a 5K display. Show every concept as the finished icon at 24 and 72 beside the six, construction beside it, never instead of it. Run a blind read at 24 (labels cropped) before anything reaches him. Canvas short: "canvases are too long ... simplify my view to only important information and concise breakdowns". Taste: `docs/owner-taste.md`. Inspo: `design/inspo/` (including the MUTCD recreation signs). Owner's full record: `design/icon-system/owner.md`.

## Canvas

https://claude.ai/artifact/SVKZ9PpaMCKUpk7Ks622jW (Design-type artifact; Artifact tool, read action with `path`: `project/canvas.json`, then boards; the read returns the publishing instructions). Designers only: ONE short board "Shopping" (≤ 2,400px, frame set to measured content; render in Chromium to measure) on the Grid concepts page, replacing the Shopping part of "Brand and Shopping" (archive, never delete), and a line on Start here. Another designer publishes to the same canvas in parallel: read the live canvas files right before publishing and change only your own board(s). Directors don't publish.

## Git

Use your own worktree: `git fetch origin claude/elegant-galileo-1c5ntm && git checkout -B <your-branch> origin/claude/elegant-galileo-1c5ntm`. Commit, push `git push origin HEAD:claude/elegant-galileo-1c5ntm` (fetch and merge on rejection, keep both sides). End commit messages with:

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_017adeKGQosgkH8rdDFz7cVM
