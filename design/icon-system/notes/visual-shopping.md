# Visual designer notes: Shopping round (2026-10-26)

My notes for the Shopping concept round (`design/icon-system/shopping/`). Brief: `briefs/shopping-concepts.md`. The system-wide notes are `notes/visual.md` (the pixel designer's seat); this file covers only Shopping.

## Update: jam turn 9 (round 2, the plain bag)

- Round 1 failed blind read 1 (K3 read as a lampshade, J2 a tap or pump, B1c a person at a counter). The director scored both 3 and redirected to the plainest readable bag.
- I drew P1-P3 to spec (`concepts/bag-plain.md`) plus P4-P8: sheet `shopping/sketches/contact-sheet-r2.png` (`sheet.py r2`, `shoot.js r2`). Ink: P1 61.5, P2 63.8, P3 62.3, P8 58.1 (museum 62.9).
- **Learned:** the handle's proportion decides the read. Short and 2 deep reads as a kettlebell (P1, P5); 3 deep as a padlock (P6, P7); long (4-5) and 2 deep as a bag (P3, P8). I proposed: a hand's handle is ≥ ½ the top.
- Blind kit 2 (P1, P2, P3, P8 plus the café, bar and museum; 18 lavender, 24 navy, streets) is in the scratchpad `blind2/`, with its key beside it. Not committed.
- Open: the blind read 2 result; P8's landscape body against the brief's portrait; the owner's "too common, or is readable the point?"

## Update: jam turn 5 (the concepts drawn)

- I drew the systems designer's specs (K, B1a, B1b, J) plus reshapes: K2 (even 8:10), **K3** (6:8 × 9, light), B1c (B1a with a 4-tall board), **J2** (J with the bag 6:8 × 7 and 2px drops). Sheet: `shopping/sketches/contact-sheet-t5.png` (and `-1x`, `-3x`); `sheet.py t5` / `shoot.js t5`. Each card prints its net ink, measured in-page with holes subtracted.
- **Net ink (café 56.5, museum 62.9):** K3 50.2; K 66.2; B1c 66.2; J2 72.2; K2 73.2; B1a 74.2; J 84.2; B1b 94.2.
- **Push K3** (weight; a small paper bag; crease risk: plinth/pot) and **J2** (meaning; a bag hung from a sign; weight +15% over the museum). **Kill B1b** (cassette, heaviest). **B1a/B1c**: the ring reads as an eye or lens; it goes to the blind read as a control only. **L**: I agree with the kill (owner 10-14), not drawn.
- **Rule note:** "a link is a ring" should apply where the hole is used (a handle, a hook), not where it would only be seen. A seen hole over a mass reads as an eye.
- The concept files' "How it looks and feels" parts are written (K, B1, J, L).
- Open: J2 vs K3 is a trade (meaning vs weight) for the director. The fresh blind read is still owed. If "pot" comes back for K3, move the crease up to y 13..14.

## Where things stood after jam turn 2

- I drew turn 1's A-E and my own F-H, 15 drawings in all: `shopping/sketches/contact-sheet.png` (2x) and `contact-sheet-1x.png`. Each one is shown at 72, at 24 1:1 in the badge, at 18 in the ring (today's `badgeHtml()`), at 12 bare, in a street beside Café/Bar/Museum/Nature, in lavender, and reversed.
- **Survivors:** B1 the blade sign (strongest: a silhouette nothing else in the set has), and F4 the die-cut bag with gusset cuts.
- **Killed, with the read at 24:** A (padlock / kettlebell), B2 (face), B3 (crane), C (bowl with cherries), D (football), E (factory skyline), F1 (phone), F2 (calendar / floppy), F3 and F5 (kettlebell), G (record / target), H1 (crown / battery), H2 (calendar).
- No canvas publish this turn (as briefed).

## Decisions and why

- A ring standing on a box is a shackle, so any bag with the settled ring handle reads as a padlock at 24. That's why A dies, and why F's handle is a hole instead.
- **Proposed rule: a handle is its counter.** The finger hole is the root. The cup's ear is the line around it; the die-cut bag's handle is the hole cut through the body under a 2px band. The systems designer and the director should test this against "a handle is a ring" (settled). It doesn't contradict that rule for the cup; it says what the ring is *for*.
- B's board stays blank. Anything cut into it (a bag, a key, a pretzel) is the "cheeky" move he rejected on v260.

## Files

- `shopping/sketches/shapes.py`: every drawing, hand-built from the roots with the rack rounds (`rpoly` and `ell` from `grid/src/shop_shapes.py`). It adds `ring_above()` (the visible part of a handle ring, sunk 0.4 into the body), `stadium()` (a die-cut slot), `die_cut_tote()` and `blade_clean()`.
- `sheet.py` writes `sheet.html` and `paths.json`. `shoot.js` renders the PNGs (`NODE_PATH=/opt/node-tools/node_modules node shoot.js`). `bbox.js` measures the box and ink of a paths JSON (holes not subtracted). `six.json` holds the six's approved outlines, from `grid/svg/g7/construction.json`.

## Measured

- Ink in px² (outline, holes not subtracted): the six 34-63 (museum 63); B1 67 gross, about 60 net; F4 78.5 gross, about 71 net. Both are too heavy for the most-repeated pin (49 of 183). If one goes forward, take ink out: B1's board 1px shorter or narrower; F4 8 wide.

## Open questions

1. Is "a bag" still open after v264 ("i do not like any of the proposed shopping icons", no reason given)? F4 depends on it; B1 doesn't. It may be worth one plain question to him if F4 survives the director.
2. Does B1 read as "shop" or just "sign"? This needs a blind read at 24 by someone fresh.
3. The handle rule (counter as root) vs the settled ring: the director's and systems designer's call.
4. Draw size: the system draws 1:1 in the 24 badge; the app today scales the glyph to 18. The sheet shows both. Which one he judges at is settled by the brief ("24 in the badge"), but the app isn't built that way yet.

## Next

The director steers B1 and F4 (and the handle rule). Then, in concepts: lighten whichever survives, run a fresh blind read at 24, and build it from the root calls (the engine), not by hand.
