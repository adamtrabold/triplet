# C · the tag is the button, round 11: how it looks and feels

## Round 11b, short upright (director: keep the third list row)

- **36 × 58** (`p6`, upright): the + is 15 across with a 3.2 stroke, the hole r 2.6 with its ring, the end 12. The hole, the dotted line and the end all read at 1x (V7).
- **Tag open:** `TAG_SHEET_GAP` = 20 + 58 + 12 = **90**, which keeps **3 list rows at 664** (43 × 70 needs 108, which shows 2).
- **Rough weight:** about 1.5× the account (systems re-measures).
- **V2 (the choice)** now shows the upright at 36 × 58.

## Round 11b: turned 90° (owner: "Let's try it turned 90 degrees too")

`drawR11()` dial `data-trot = up | down`: the same horizontal tag rotated. Frames `r11v-*`.

- **Lead: hole at the top, claim-check end at the bottom** (`p4`, 43 × 70).
  - It hangs the way the place's Hanging Tag does: eyelet up, stub down. The upright luggage tag is the classic silhouette, and the most "tag" read we've had at 1x.
- **Hole at the bottom, end at the top:** the tag stood on its eyelet. It reads more like a price label or a flag. Shown, not recommended.
- **Slimmer upright** (`p5`, 38 × 64): the same tag, one size down. The + is 16.
- **The + doesn't change** (it's symmetric). It sits centred between the hole's ring and the perforation, as when flat.
- **Placement:** bottom-left, left edge 19.9, foot min(list − 20, credit − 6). It is 27px taller and 27px narrower than when flat. The credit is clear at every width (x ≤ 69). The list edge is unchanged (foot 20 above).
- **Rough weights** (systems re-measures): orange upright about 2×, the same as flat. Cream upright about 0.6× (quieter than the account). p5 orange about 1.6×.
- **Stills:**
  - V1: three ways up × both colourways at real size × 1.5;
  - V2: **the choice** (Float | C flat | C upright);
  - V3: upright vs today;
  - V4: upright at real size;
  - V5: upright, both colourways;
  - V6: 320, list down, a tag open.

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
