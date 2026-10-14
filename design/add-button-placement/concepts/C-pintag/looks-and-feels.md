# C · Pin+tag: how it looks and feels (round 9)

Visual, 2026-10-14. Owner (on round 8b): "Blank pin looks ugly. I wanted to explore the version where the pin+tag was the button and see if that could work with tweaks." Director turn 38 set the rules: the app's own pin at its own size, a tag that reads as the Hanging Tag at 1x, one +, orange off the paper, at home beside the real pins and the account badge first.

Prototype: `c.inc.html` (variant dials in its header comment), layered by `../blank-tag-form/stills.js` (page `C`, frames `r9-*`, `cv-*`); stills by `../blank-tag-form/compose.js`.

Stills (3x, 1170 wide):
- `C1` rest vs today;
- `C2` 1x and the squint, plus a 1x ×4 close-up of the pick vs "also tried";
- `C3` tap: rest | tapped;
- `C4` tag open (the exception, with its cost line);
- `C5` 320 + list down;
- `C6` pressed.
The form's stills: `../blank-tag-form/T0`-`T9`.

## The object (the pick: `data-cpin=fill data-cstub=third data-cplus=tag`)

- **Pin.** The app's selected-pin grammar at its real 32px:
  - an orange face (`--brand-orange`) with a 2.5 `--brand-orange-deep` rim and a 2px `--paper` halo;
  - **blank: no glyph**, because a place with no type yet has no icon. Same size as a selected pin, nothing inflated.
- **String.** The real `.tag-string`: 1.5px `--ink-2`, 14px from the pin's foot to the eyelet.
- **Tag.** 100 × 84: a 62 body and a 22 stub.
  - It has the real tag's die-cut at a size that survives 1x: 20px chamfers, a 26 × 15 eyelet patch with its grommet (`--hair`, 2.4) and a hole, a 1.5 dashed `--hair` perforation, and r3.5 side notches.
  - It uses the real tag's paper (`--paper-raised`), its 1px warm edge and its shadow. There's no band: the paper is cream, and orange paper means starred.
- **The + is printed on the tag's body, where you'll write:** navy, 28px across, 4.5 stroke, round caps. It's the one +; the pin's face stays blank. The owner's R4 objection was that the tag "doesn't read like a plus button", so the + goes on the tag.
- **The stub is the form's stub in miniature:** three segments, with the first one ADD's navy flood (`--navy`), exactly what ADD looks like on the form it opens. The other two are cream with a dashed divider. This borrowed mark keeps its meaning (navy segment = ADD).
- **Box:** 100 × 125. The tag's left edge is on the 19.9 ink line and its foot is 20 above the list. It rides the sheet edge.

## Why this one (variants in `raw/cv-*`; rough squint mass vs the account, σ4 / σ8)

| Variant | Read at 1x | Mass |
|---|---|---|
| **Pick: orange pin, + on the tag, ADD's navy slot on the stub** | a luggage tag with a +, hanging from a pin; the navy slot echoes the form | **1.44 / 1.36** |
| No navy on the stub (`C2` "also tried") | the cleanest tag, but quiet: the R5b "same weight as account" again | 0.86 / 0.79 |
| Whole stub navy | the tag turns into a dark-bottomed box; tag-ness drops | 2.61 / 2.55 |
| A ring pin (cream face, orange ring) | an empty selection ring; weakest | 0.54 / 0.47 |
| The + on the pin, tag blank | his R4 objection, word for word | 0.71 / 0.67 |
| A bigger + (34 / 5.5) | barely moves rank | 0.96 / 0.88 |

The rank comes from the tag, not from a bigger disc: the pin is the app's 32. These are my rough masses (Gaussian blur, colour distance, vs `cv-none` / `cv-noacct`); systems re-measures on their harness.

## States

- **Pressed:** the pin face goes deep orange and the tag's paper goes `--paper` (one step down), the shared pressed grammar.
- **Tap:** the tag comes off the pin. It grows from 100 to 316 wide and rises to the dock above the keyboard as the blank form, in one tag-pop beat. **The pin stays at its spot** (under the keyboard or the tag by then) and the eyelet is empty while you fill the tag in (the director's (ii); the owner's "the pin placed after creation").
- **ADD:** one flight. The place comes to the tag's hanging point and the pin drops into the eyelet (`T5`). When that tag closes, a fresh pin+tag is at rest.
- **Hidden:** while a place's tag is open, while the filters are open, and while adding. No animation; it's back when they close.

## Open

- **Footprint:** 100 × 125 is the largest corner object we've had.
  - At z14 views it sat on a real pin often enough that I had to choose the still's map views (systems' 320 Stockholm hit is the known one). At the city's opening view it's clear.
  - Systems: measure it against the 202 pins.
  - A smaller tag (88 wide) is the dial if needed.
- **The navy slot's weight** at 1x reads as a small dark block at the tag's foot. If the director finds it heavy, 0.8 opacity navy is the next dial; it stays above 1.2 by my estimate.
