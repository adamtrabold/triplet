# Brief: draw every icon at the size it ships

## The owner's words (verbatim, newest last)

> now looks a lot worse somehow. and i dont want two cols in the museum i need three two reads as a bank
> the now rows all look more crispy/blurry
> but wait why am i seeing htem at 24, 18, and 12... what is the size they actually are? that's all i care about
> why would we have a 24px master size if the icons are only ever 18?
> they should be drawn at the right size

Standing: "I want them to be as sharp as possible and strokes to be 1.5px. If it's not a strike it doesn't have to be 1.5px! Just has to read the right weight"; "i think 1 1/4 has to be ok because moving certain things up to 1 1/2 feels overly heavy on most of the proposed icons. that said, the exterior circle is also feeling slightly heavy now"; "i think we need rules as far as what side is pixel snapped so that we reduce blurriness on the external form first"; "off center is not acceptable"; the star and + are not approved and are never shown in a ring; "i dont want images i want the actual svgs"; "clean and simple directives only".

## Facts (measured by the orchestrator in index.html and the v280 board; check them)

- Where icons render in the app: place glyphs at **18px** inside a 24px ring on map pins and every list row (`badgeHtml()`: `g = min(field-2, max(18, field-4))`, drawn from a `viewBox 0 0 24 24`, i.e. the 24 drawing scaled by ¾); **24px** inside a 32px ring only on the selected pin; **12px** on filter chips (`glyphHtml(cat, 12)`); the row star in an 18px box (`.row-star`).
- Scaling the 24 drawing by ¾ moves every snapped edge off the iPhone grid, so in the app the snapping is undone.
- v280 is blurrier than v277 (grey share at 24: iPhone 27% → 29%, 5K 40% → 43%) because the new 1¼px widths (ring, stems, trunk, tines) are not whole iPhone pixels (1¼ = 3¾ device px), so both edges land soft.
- The museum has three columns but two openings; its outer columns merge into the ends, so it reads as a block with two windows ("a bank").

## Task

1. **Draw at the size it ships, 1:1.** The master is the 18px glyph (in its 24px ring), drawn on its own 18 box on the iPhone pixel grid — not the 24 drawing scaled. Then the 12px chip and the 24px selected pin, each drawn at its own size. Keep the v264 character and the silhouette-first rules.
2. **Every width is a whole number of iPhone pixels** at the size it's drawn (⅓px steps): pick by eye (e.g. 1⅓ where 1¼ read right; strokes as close to 1½ as the grid allows, say what you chose). The ring too, at its real size.
3. **The museum reads as three columns** at 18 and 12, not a block with windows. If that takes three openings (four columns), or open outer ends, show it as the one answer and say why in one line.
4. **The star** drawn at its real 18px box size, bare in its row and on the tag; **the +** at its real size in its button.
5. Update THE-GRID.md (directives only, no sources, no history): the sizes the app uses, one drawing per size, widths in whole iPhone pixels.
6. **Board:** "The grid" in place. Lead with the icons at 18 in their 24px ring, exactly as the app shows them (real inline SVGs at true size, never images), v280 beside now; then 12 and 24-selected; a larger vector view only if labelled. No row at a size the app doesn't use. ≤2,400px. Read the live canvas right before publishing; archive the v280 board; the page keeps only Start here + The grid (update Start here's lines).
7. Report grey-pixel share at the shipped sizes on both screens, v280 vs now, measured from the real SVGs.

Not in scope: changing index.html (that's a later build once he approves).

## Git

Own worktree: `git fetch origin claude/elegant-galileo-1c5ntm && git checkout -B right-size origin/claude/elegant-galileo-1c5ntm`. Push `git push origin HEAD:claude/elegant-galileo-1c5ntm` (fetch and merge on rejection, keep both sides). End commit messages with:

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_017adeKGQosgkH8rdDFz7cVM
