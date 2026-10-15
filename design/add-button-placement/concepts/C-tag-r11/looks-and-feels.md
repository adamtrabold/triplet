# C · the tag is the button, round 11: how it looks and feels

Visual, 2026-10-15. Owner (on round 10): "Let's iterate the tag a bit before I make a call. The tag is too wide and the plus is too large. Balance feels off. I feel like both sides could get narrower. Also I miss the hole. I think in the smaller arrangement I'd like to see orange tag as well as cream with orange claim check edge"

Prototype: `../C-tag-r10/t.inc.html`, `drawR11()` with presets `P11` (dial `data-tp`); frames `r11-*`, `c11-*`, `c11b-*` in `../blank-tag-form/stills.js`; stills come from `../blank-tag-form/compose.js`.

## What changed

- **Narrower both sides:**
  - the die-cut end's chamfer is 12 (it was 16);
  - the claim-check end is 14 (it was 25 at 104 wide);
  - the whole tag is 70 × 43 (it was 84 × 44, and 104 × 54 before that).
- **A smaller +:** 18 across, 3.6 stroke, round caps. It was 28 / 5.4.
- **The hole is back, at the die-cut end:**
  - a punched hole, r 2.8, through which the map shows;
  - on its grommet ring: 2.2 stroke, `--hair` on cream, paper at 55% on orange;
  - like the Hanging Tag's eyelet.
- **Balance:** the + sits in the middle of the field between the hole's ring and the perforation, not the middle of the whole tag. So it's hole | + | end, which reads as even thirds on the golden tag.
- **The perforation** is 1.4 dashed, 3.5/2.5, with r3 notches.

## Proportions (S1, both colourways each)

| Preset | Size | Ratio | Read |
|---|---|---|---|
| p1 compact | 72 × 42 | 1.7 | close to the lead, a touch long |
| p2 squat | 64 × 44 | 1.45 | the tightest footprint; the + crowds the hole |
| p3 slim | 80 × 36 | 2.2 | a long claim check; the + reads small |
| **p4 golden (lead)** | **70 × 43** | **1.62** | hole, +, and end in even thirds; the best balance |

## Colourways (K1-K3)

- **Orange tag (the lead colourway, C0-C7):** brand orange stock, navy +, navy dashed perforation at 50%. Rough weight about 2× the account and about 1.5× the Float. Systems re-measures.
- **Cream, orange claim-check end:** `--paper-raised` with the tag's edge and shadow, an orange end, a navy +, a `--hair` ring and perforation. Rough weight about 0.6×: **quieter than the account badge**, so it doesn't come first. It's said on K1 so he can see that trade.
- **Pressed:**
  - orange: the whole stock goes deep orange;
  - cream: the paper goes one step down and the end goes deep orange.

## Stills (`C-tag-r11/`)

- S1: proportions at real size × 1.5.
- C0: the two options (the Float vs C orange).
- C1: rest vs today.
- C2: real size.
- C3: squint (rough).
- C4: tap.
- C5: a place's tag open.
- C6: 320 + list down.
- C7: pressed (held).
- K1: the colourways side by side.
- K2: cream at real size.
- K3: cream vs orange at 664.

## Open

- **If the owner prefers the cream colourway,** its rank is the issue (about 0.6×). The dial is a wider orange end (18-20), not more paper.
