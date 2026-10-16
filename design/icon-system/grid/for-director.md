# Grid g2: for the design director

From the product designer (icon specialist), 2026-10-16. This is the fix batch for your round g1 (`scores.md`, fixes 1–8). g1's handoff is in git history (87b6286).

## What to look at

- Phone stills: `stills/g2-card-0.png` … `g2-card-5.png` (390 wide at 3x), plus `g2-card-2-1x.png`. The source is `cards-g2.html`.
- Canvas, page **Grid concepts**: https://claude.ai/artifact/SVKZ9PpaMCKUpk7Ks622jW, with 6 g2 boards and the question as the page title. The 7 g1 boards are on **Archive** under "Round g1 · 2026-10-16 · grid, three concepts (scored 7; replaced by g2)".
- SVGs: `svg/g2/<joint|wear|press>/<pick>-24.svg`, `-32.svg` and `-12.svg`. The g1 SVGs stay in `svg/A-pixel` etc. as history.
- Code: `src/frame.js` (the frame, the three laws, the 24 → 32/Ø18 refit) and `src/boards2.js`.

Cards:
- 0: brief, sizes, the rough-skeleton line, the question
- 1: the frame (the team's call)
- 2: choice 1, the corner law
- 3: choice 1, close-ups
- 4: choice 2, fullness
- 5: tool

## Fixes 1–8

1. **One frame, as the team's call** (card 1, first line, with the reason in his words): a separate drawing per size on the pixel grid, and the 12 on the 2px module. B is out as a grid. The 13 are shown on the frame with corners not yet rounded, so the frame is judged apart from the corner choice.
2. **Two choices he can see.**
   - (a) **Corner law** (card 2): column front, conifer and coupe at 4x, then on the 32 selected pin and the 24 badge, then all 13 at 24, for each law. Card 2 states the visibility: "At 24 on your phone the difference is texture, not shape … On the 32 selected pin it shows, and at 4x it's obvious."
   - (b) **Fullness** (card 4): all 13 at 24 in one row each, plus 4x and the 32 pin.
3. **Personality line** for each law: each opens with his sentence in quotes, "personality in the approach to how strokes are connected and curve", then one line on where that law puts the curve.
4. **C honesty:** card 1 says what was done: "the 12s were drawn as their own set on the 2px module, not derived from the 24s. The 32s are the 24s enlarged by code, a first fit."
5. **⌘:** 2px like every line (card 1: "Every line is 2px, the ⌘ included"). Only the 12px fact remains (⌘, spokes and arms need 1.5px there).
6. **Rough skeletons named once, up front** (card 0), in your wording.
7. **g1 boards archived** on the canvas, as above.
8. **`history.md`:** not added yet. Its rule is one line when the owner sees the work, so it gets added when this goes to him.

## Two places I changed what you asked, and why

Both follow the orchestrator's note: "If the corner laws really are invisible at real size, a choice between them isn't a real choice. The options he sees have to differ visibly."

- **The corner laws were re-tuned to differ in kind, not by tenths.** In g1 all three put a little softness everywhere, so they looked the same. Now each puts the softness in a different place:
  - **by joint:** in the joins, with a 1.1px fillet; ends and edges stay crisp.
  - **even wear:** on the outer silhouette; every outside corner is worn 0.38px deep (right angle 0.92, 110° apex 1.7), and inside corners are almost untouched.
  - **pressed:** in the inside corners; ink pools 1.5px, and outside corners are 0.3.
  
  At 4x and on the 32 pin they are plainly different. At 24 the difference is a texture, and the card says so. The laws are still "slight", but are they still slight enough for him? I think yes at 24; judge it on card 2.
- **Fullness is Ø16 vs Ø18 (1px of air), not Ø17.** I built Ø17. It moved each edge half a pixel and didn't read as a choice at 24, so card 4 shows the step that does, and says why. The question's wording changed to match: "…2px of air or the fuller 1px?" If you want Ø17 back for fidelity to your ruling, it's one number in `boards2.js` (the `live` value 18 → 17).

## Things to check

- **The 32 and Ø18 glyphs are the 24's parts scaled by code, with every 2px line kept at 2px.** Parts that touched a line still touch it, edges are not snapped to pixels, and the card says so. Fit is measured on the finished outline:
  - At Ø16, everything stays within r 8.5 (pin 11.3).
  - At Ø18, everything stays within r 9.5 (pin 12.7).
- **Curves per glyph are the same under every law** (264 for the 13). Each rounded corner is one curve whatever its radius, so the laws change the character, not the count.
- **The pressed conifer:** a 1.5px fill in the narrow tier notches made round knobs, so narrow notches use 0.6 instead (and still fill deepest because of the angle). The rule text says so.

## My read

- **The frame is right**, and it's the conventional answer (Material, IBM, Fluent).
- **Of the laws,** by joint is the one that most directly answers "different architecturally sound principles to how different angles intersect", and its filleted joins carry "how strokes are connected".
- Pressed is the most literal "screened or pressed".
- Even wear reads most "vintage" on the silhouette, but at 24 its round line ends make the set look softer and a little toy-like.
- I'd lean by joint with 2px of air, but the cards don't say so; he chooses.

## The ask (word for word)

"For the grid: which corner law — by joint, even wear or pressed? And in the circle, 2px of air or the fuller 1px?"
