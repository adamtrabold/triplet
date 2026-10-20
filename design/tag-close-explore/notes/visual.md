# Tag close concepts: visual designer notes

## Where things stand (2026-10-20)
Four concepts with stills are on branch `tag-close-concepts`, all behind one html class each
(`close-pin | close-fold | close-reel | close-untie`, an exploration CSS block after `.tag-x:focus-visible`
in `index.html`). Nothing has landed on main. The owner picks next.

- Sheet: `design/tag-close-explore/concepts/concepts.png`, plus one phone-width sheet per concept
  (`concept-<key>.png`).
- Stills: `concepts/stills.js` (390x844 at 3x, real OSM tiles cached in `../raw/.tiles`, not committed);
  `crop.py` (3x crops around each mark, using `raw/points.json`); `sheet.py`.

## The concepts (each a different kind)
- A. **Pin is the close** (reference, the owner's favourite of last round): a mark on what the tag hangs from. Navy only.
- B. **Dog-ear**: the paper's own form is the control. The top-right chamfer becomes a folded corner showing the
  paper's back (a soft gradient, 1px warm edge, a small cast shadow down-left), with a 10px --ink-2 x on the fold.
  On a starred tag the fold lies cream over the orange band. The band collision is gone because the band is printed
  on the front and the fold shows the back. 44px target overhangs the corner by 8px.
- C. **Badge reel**: a gesture with no mark. Pull the tag down (resistance 0.6, max 96px; the string stretches), let go
  past 44px and it reels back into the pin (240ms, the pop-out reversed); short of that it springs back. A real touch
  handler exists in the prototype. Discoverability depends on the pop-out teaching where the tag comes from;
  tapping the pin or map still closes.
- D. **Untie the bow**: the hardware is the control. The string is tied through the eyelet in a small bow (1.5px, same
  ink as the string; --ink on the band). The grommet ring is hidden and the hole is filled with patch paper under
  the knot, because the map showing through the hole under a bow read as a rough join. Tap: the bow loosens and the tag drops (4deg tilt).
- Dropped: an **index flag** (a paper tab sticking up off the tag's top edge with an x). At 3x it read as a corner x
  in a tab, the same idea the owner already counted.

## How the ideas were drawn
Random draw (python secrets): fields picked were zipper, window roller blind, library card pocket, origami, wax seal;
oblique strategies were "Honor thy error as a hidden intention", "Abandon normal instruments", "Do the words need changing?".
Roller blind became the badge reel. Origami became the dog-ear. "Honor thy error" turned the band collision into the
dog-ear's point. "Abandon normal instruments" became the reel (no button). The physical tag gave the bow.

## My pick
B, Dog-ear: it is the corner the owner first asked for. It turns the starred-band collision into a feature, and it is
paper, not chrome.

## Open questions
- Dog-ear: keep the small x on the fold, or let the fold alone say it (purer, less obvious)?
- Reel: does it need any resting hint, or does tap-pin/tap-map cover anyone who never pulls?
- Bow: whimsy that means something, or decoration? (owner-taste "no dots/decoration that adds noise")
- All of these are Chromium-only. Safari or the iPhone are unchecked, the reel's touch handling most of all.
