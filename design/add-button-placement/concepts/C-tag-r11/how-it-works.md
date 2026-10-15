# C · The tag is the button, round 11: how it works

Systems, 2026-10-15. Round 11 changes the button's size and look only.
Its behaviour is unchanged from `../C-tag-r10/how-it-works.md` ("Round
10c") and the form (`../blank-tag-form/how-it-works.md`, "Round 10b").

**Measured:** `../r10-check/t-check.js` (`TAG=t11-`, `data-tp=p4`),
`mass.py t11-`, and street-zoom odds. That's on the real 202 pins, with
visual's own layer (`drawR11`).

## The object

- **Size:** 70 × 43 (the p4 "golden" preset).
- **Parts:**
  - a punched hole at the die-cut end;
  - an 18px + centred between the hole and the perforation;
  - a 14px claim-check end.
- **Placement:** bottom-left. The left edge is on 19.9, and the foot is
  min(20 above the list, 6 above the credit), which is 23 above the list
  in practice.

## Numbers

| | Orange tag (lead) | Cream, orange end |
|---|---|---|
| Squint vs the account, σ4 / σ8 | **2.12 / 2.12** | **0.59 / 0.56** |
| vs the Float (1.34) | 1.58x | 0.44x |
| Pins at the opening fit (5 cities × 4 viewports × list up / collapsed) | **0 in all 40** | 0 in all 40 |
| Street zoom (z14, 390x664): Copenhagen / Stockholm / Malmö / LA | 11 / 12 / 14 / 3%, **at or under the Float (12 / 13 / 16 / 3)** | the same |
| Credit (horizontal clearance, prefix rule as today: dropped below 338) | 43 at 390, 28 at 375, 38 at 320 | the same |

- **The credit:** at 70 wide the tag clears it at every width with the
  existing rule. **Round 10's "drop the prefix below 380" isn't needed
  any more.**
- **Tag-open gap:** the foot is 23 above the list, plus 43, plus 12, so
  `TAG_SHEET_GAP` = **78** (the Float's is 88). It stays tappable with a
  place's tag open. Visual's harness uses 86, which is safe but costs a
  little list. Use 78.
- **Tap target:** 43 tall, so **pad the hit area 1px to 44** (invisible,
  upward). The hit area is the rectangle, not the drawn path, so the
  hole (where the map shows through), the chamfers and the notches all
  count as the button.

## Jobs re-check (round 11)

| Job | Orange | Cream with an orange end |
|---|---|---|
| 1 Reach (bottom-left; filters the only exception) | yes | yes |
| 2 Main action, above the account | **yes: 2.12x** (1.58x the Float, down from 2.0x at 84) | **no: 0.59x, quieter than the account badge.** This is the owner's own round-5b objection ("same weight and heirarchy as account, which it shouldn't be"). It should go to him with that cost said plainly, as K1 does |
| 3 Know what you'll fill out | yes: the tag, now with its hole, *is* the blank tag | yes |
| 4 Never in the way | yes: 0 pins at every opening view; street zoom at Float level; the credit is clear everywhere | yes |
| 5-18 | unchanged; yes via the form (`../coverage-r10.md`) | unchanged |

**No unsupported job for the orange tag.** The cream colourway fails job
2. It isn't a send-back, because orange is the lead and cream is shown
because the owner asked to see it, but it must carry the cost line.
