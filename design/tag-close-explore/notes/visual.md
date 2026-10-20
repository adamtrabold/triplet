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

## Round 2: a close that floats outside the tag (2026-10-20)
Owner on the four above, verbatim: "no those last ones are too clever... the dog ear is the closest non-pin one, but its a tag so why would it have a dogear. what about floating outside the tag?"

Three placements, one mark: a 28px disc of --paper-raised (the tag's own paper) with the tag's warm edge and
contact/lift shadow and a 12px --ink-2 x. It has a 44px target, sits off the paper and has no colour of its own
(`html.close-float-corner | close-float-above | close-float-below`). It has the same states as before, plus a reference pin row.
Sheet: `concepts/float.png`; phone sheets `concepts/concept-pin.png`, `concept-float-corner.png`, `concept-float-above.png`, `concept-float-below.png`.

- B. **In the cut corner**: centred on the corner the die-cut removed (the tag's bounding top-right), ~6px clear of the chamfer.
- C. **Above the corner**: above the top edge, its right side 8px past the tag's right edge, level with the string's run.
- D. **Below the tag**: centred under the stub, 16px clear, in thumb reach.

Collisions checked at 390 (the tag is 316 wide, so there's a 37px margin each side):
- Zoom and account controls: none. The tag always pans so its pin sits just under those controls (`pinPopupTopPad()`).
  C sits ~56px below the account button's bottom, and B lower still.
- Map edge: B and C reach 14px and 22px past the tag's right edge. At 390 there's plenty of room. On screens narrower
  than 348 the tag is the screen less 32, so B would sit ~2px from the edge and C would clip. Each would need a clamp if built.
- D: `tagSheetNeed()` doesn't count the extra ~60px below the stub. A tall tag (long note) could tuck D under the list
  sheet unless that room is added (as `tagSlipRoom()` does for the signed-out slip). The signed-out slip also lives
  under the tag, so the two would stack.
- Other pins: a disc can land on a neighbouring pin (see C's plan stop, beside a visited stop pin). The disc sits above pins in z-order.

Pick: B, in the cut corner. It's the "corner of the overall tag" the owner asked for, fills a gap the tag already has,
and stays off the band and the content.

## Round 3: the pin is the close -- its colour (2026-10-20)
Owner, verbatim: "pin is making the most sense to me, but navy feels too much like visited... it disappears... i want a more "close"-y color"

Decided: while its tag is open, the pin (or a district's dot) becomes the close. Open: its colour. Three options, each
added on top of `close-pin` as one more html class (`pin-paper | pin-orange | pin-ring`). Each is a 30px disc with a 16px x (2.6 stroke):
- A. **Paper**: --paper-raised disc, --ink x, 1.5px --ink ring, the tag's shadow. The classic light close; no pin on
  the map is a light disc with a dark x. Quietest of the three; on pale tiles it relies on the ink ring.
- B. **Brand orange**: --brand-orange disc, --ink x (orange carries dark type, not paper), a paper ring. The + badge's
  colour, so add and close pair up; it's the loudest and can't be read as visited. Weak spot: on a starred place the orange star
  sits on the orange disc, kept apart only by its paper halo.
- C. **Orange ring**: paper disc, --brand-orange-deep x and 2px ring. The accent as a line; the star stays clear.
  The deep orange (#A8400C) is a rust that sits nearer the restaurant wine (#7A2436) than B does, though as a ring rather than a fill.

No new colour is needed. A true "close red" would be a system change and would read as a restaurant (wine) pin, so I didn't propose one.
Sheet: `concepts/pin-colour.png`; phone sheets `concept-pin-navy.png` (today, for comparison), `concept-pin-paper.png`,
`concept-pin-orange.png`, `concept-pin-ring.png`.

Pick: B, brand orange. It's the most unmistakably "close" (loud, action-coloured, never visited) using the one accent the app already has.
Open: on a starred place, does the star even need to stay on the closing pin (the tag's band already says starred)? Dropping it there removes B's only weak spot.
