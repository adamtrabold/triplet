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

---

## Round 11b (systems, 2026-10-15): turned 90°, upright 43 × 70 (the hole at the top, the end at the bottom)

Owner: "Let's try it turned 90 degrees too". Measured the same way
(`TAG=t11b-`, `data-trot=up`).

| | Upright orange (p4, 43 × 70) | Upright cream, orange end | Upright orange, slim (p5, 38 × 64) | Flat orange (11, ref) |
|---|---|---|---|---|
| vs the account, σ4 / σ8 | **2.12 / 2.12** | **0.59 / 0.56** | 1.69 / 1.69 | 2.12 / 2.12 |
| vs the Float (1.34) | 1.58x | 0.44x | 1.26x | 1.58x |
| Pins at the opening fit (40 scenes) | 0 | 0 | 0 | 0 |
| Street zoom: Copenhagen / Stockholm / Malmö / LA | 11 / 12 / 15 / 3% | the same | 10 / 11 / 13 / 3% | 11 / 12 / 14 / 3% |
| Credit, horizontal clearance (390 / 375 / 320) | 73 / 58 / 68 | the same | wider | 43 / 28 / 38 |
| `TAG_SHEET_GAP` (foot 23 + height + 12) | **105** | 105 | **99** | 78 |

- **Rank and coverage: turning it changes nothing.** It has the same
  area, so the same mass. Street-zoom coverage is within a point, and
  the credit is clearer, because the tag is narrower.
- **The one structural cost is the taller footprint with a place's tag
  open.**
  - To stay tappable under an open tag, the list sits lower by the
    tag's height: a gap of 105 (99 for p5), against 78 flat and 88 for
    the Float.
  - **At 664 that drops the list from 3 rows to 2 with a tag open**
    (3 rows need a gap of 93 or less). At 320 it stays at 1 row either
    way.
  - The choices:
    - (a) accept 2 rows at 664;
    - (b) an upright at 58 tall or less (for example 36 × 58), which
      keeps 3 rows;
    - (c) step aside under a tag, which brings back the tag-open
      exception that the Float doesn't have.
  - I lean **(b)** if the owner picks upright. It's the owner's
    visual call, so (b) needs a frame from visual.
- **Tap target:** 43 wide → pad 1px to 44 (invisible, sideways). It's 70
  tall. The hit area is the rectangle, so the hole counts.
- **Placement:**
  - the drawn left edge stays on 19.9 (the 3px pad sits outside it);
  - the foot is 23 above the list;
  - the top is 93 above the list at 664 (y 251-344 with the list up).
  - It clears zoom and every top control at every size.
- **The hand-off gets simpler: no rotation.**
  - The upright button is already the form's orientation: hole at the
    top (it becomes the form's eyelet), + in the body, claim-check end at
    the bottom (it becomes the form's stub with ADD).
  - Tap = a pure grow, from the button's box to the docked tag (43 → 316
    wide), with every part in place.
  - The flat tag had to turn upright while it grew. Upright is the
    clearest job-3 read yet ("what you tap is the tag you'll fill"),
    with nothing to re-map.
  - The claim-check-end tear (round 10's motion) becomes a downward
    tear at the bottom, which still reads.

### Jobs re-check (round 11b)

| Job | Upright orange | Upright cream |
|---|---|---|
| 1 Reach | yes. The only exception is the filters, **if** the tag-open gap of 105 is accepted (2 rows at 664) or the tag is 58 tall or less. With (c) it gains a tag-open exception | the same |
| 2 Main action | yes: 2.12x | **no: 0.59x** (the same cost line as the flat cream) |
| 3 Know what you'll fill out | **yes, the strongest:** the same orientation as the form | yes |
| 4 Never in the way | yes: 0 pins at the opening views; street zoom at Float level; the credit is clear | yes |
| 5-18 | unchanged (the form) | unchanged |

**No unsupported job for the upright orange.** There's one cost to put
on the send: the list loses a row with a tag open at 664 at 70 tall (or
the tag goes to 58 tall or less).

### Round 11b, the short upright: orange 36 × 58 (preset p6; visual's V7)

Measured with `TAG=t11c-`, plus `../r10-check/gap-check.js`, which opens
a real tag on the real app with `TAG_SHEET_GAP` patched (48 to 105), at
4 viewports, with a short name and a two-line name.

- **Rank:**
  - **1.45 / 1.44 x the account** (σ4 / σ8): over the director's 1.2 at
    both blurs;
  - **1.08x the Float** (1.34), so the two buttons are nearly equal in
    weight, which makes the owner's call a pure comparison of shape;
  - the 43 × 70 upright was 2.12x, and p5 was 1.69x.
- **Coverage:**
  - 0 pins at all 40 opening views;
  - street zoom: Copenhagen 9% / Stockholm 10% / Malmö 12% / LA 2%
    (the lowest of any C; the Float is 12 / 13 / 16 / 3).
- **Credit:** 80 / 65 / 75px of horizontal clearance at 390 / 375 / 320.
- **Tag-open gap: 90 is confirmed.**

| `TAG_SHEET_GAP` | 664: rows, button top to tag foot | 375x667 | 320x568 | 844 |
|---|---|---|---|---|
| 48 (today) | 3 rows, **overlaps by 32** | 3, overlaps 32 | 2, overlaps 32 | 4, clear |
| 88 (the Float) | 3, clear by 8 | 3, 8 | 1, 4 | 4 |
| **90** | **3, clear by 10** | **3, 10** | **1, 6** | **4** |
| 93 | **2**, 13 | 3, 13 | 1, 9 | 4 |
| 105 (43 × 70) | 2, 25 | 2, 25 | 1, 18 | 4 |

- **90 keeps 3 rows at 664 and 667 and clears the open tag.** 93 is
  already one row short at 664, so **90 is the ceiling, not just a
  value that works**.
- At 320 the list is already at its minimum, so the open tag sits a
  little higher instead. It's 1 row, the same as the Float's 88.
- The two-line name gave the same result as the short one (the tag
  grows upward).
- **Tap target:**
  - 36 wide → pad 4px on each side to 44, invisibly; 58 tall is fine;
  - the hit area is that 44 × 58 rectangle, so the hole counts;
  - with the left padding the hit area starts at 15.9, inside the
    screen's 16px gutter; fine, since nothing else is there.
- **Hand-off:** the same as the 43 × 70 upright: a pure grow into the
  form (hole → eyelet, end → stub). No rotation.

**Jobs:** every job holds for the orange 36 × 58.
- Job 1 has no tag-open exception at gap 90; only the filters, the same
  as the Float.
- Job 2: 1.45x.
- Job 3 is the strongest read (the same orientation as the form).
- Job 4: the lowest coverage of any C.
- Jobs 5-18 are unchanged (the shared form).

**No costs left that the Float doesn't also have.**
