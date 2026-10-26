# Visual designer notes: Shopping round (2026-10-26)

My notes for the Shopping concept round (`design/icon-system/shopping/`). Brief: `briefs/shopping-concepts.md`. The system-wide notes are `notes/visual.md` (the pixel designer's seat); this file covers only Shopping.

## Where things stand (jam turn 2, done)

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
