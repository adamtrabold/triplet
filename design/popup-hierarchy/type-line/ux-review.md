# Type / Plan line: UX review (A–F)

UX agent, 2026-10-07, on `type-line-concepts` @ `db521f8`. Brief:
`docs/ux-brief.md`.

**Evidence:**
- the 1x sheets (`stills/*-sheet@1x.png`: busiest, typical, district,
  signed out);
- my own long-content render in the real page (`ux-longcheck.js` →
  `ux-longcheck.json` and `stills/ux-long-<variant>@3x.png`): each variant's
  CSS with **"restaurant"** (the longest category, tied with "attraction")
  and **"Stop 12 of 14"** on one tag.

Owner (verbatim): "yes this should run through the loop — there were some
explorations of that along the way based on tag inspo we should do some
iteration there." Standing rule: "Type is actually tier 2 imo — or bottom
of tier 1. Notes are tier 1".

## Ranking

| # | Variant | Verdict | One line |
|---|---|---|---|
| 1 | **A Ledger** | KEEP | Label and value split three ways (case, colour, size). One line, +2px. The number stays quiet. The easiest to scan. |
| 2 | **F Margin print** | KEEP | Just as quiet (+2px). In Plans it separates Type from Plan. Watch item: Plan sits flush right against the stub. |
| 3 | **D Rubber stamp** | KEEP, conditional | The whimsy carries meaning and the value is still `--ink-2` (tier 2). The textured ink's contrast must be measured. Plan at 17px is louder but holds. |
| 4 | **C Form blank** | KEEP, conditional | Most readable values (sentence case), but a 14px `--ink` value is the note's own size and colour, so Type starts to read as note text (tier blur). It also adds two hairlines over the perforation. |
| 5 | **B Field stack** | KILL | The value is 17px `--ink` bold on its own row. It outranks the tier-1 note at 1x, "STOP 3 OF 3" becomes a headline number, and the tag gains +20px. That size *is* the idea. |
| 6 | **E Destination code** | KILL | A 22px value is the second-largest text on the tag, so the owner's tiering is inverted. A long Plan line **wraps to a second row** (measured), adding +34px. The numbers are loud. |

B and E are killed on the idea: their point is a big value, which breaks
the owner's "Type is … tier 2" and "numbers … egregiously attention
grabbing". A better execution can't keep the idea and fix that.

## The checks

| Check | A | B | C | D | E | F |
|---|---|---|---|---|---|---|
| Label vs value scannable at 1x | **Yes**: "Type" in sentence case, grey, then the CAPS value in ink | Yes (position) | Yes (line under the value) | Yes (stamped) | Yes (size) | **Yes** |
| Type stays tier 2 under name and note | **Yes**: 13px condensed, below the note's 14px | No: 17px ink outranks the note | **Borderline**: same 14px ink as the note | Yes: 17px but `--ink-2` and textured, so it reads as print | **No**: 22px, competes with the 26px name (`code/district`) | **Yes** |
| Plan stop readable, not a loud number | **Yes** | No: a 17px ink headline | Yes: sentence case, 14px | Mostly: 17px grey, tilted | **No**: 22px | **Yes** |
| Tag height vs shipped (174px test tag) | +2 | **+20** | +6 | +6 | **+34** (wraps) | +2 |
| Long category + "Stop 12 of 14" | one line, nothing clipped | one row, fits | fits the half-width blanks (134px each), not clipped | fits | **wraps to 2 rows** | fits, bracketing the line |
| Screen reader | **Same in all six**: the markup is unchanged, so it reads "Type, restaurant, Plan, Stop 12 of 14". CSS `uppercase` / `capitalize` / rotation don't change what's spoken. | | | | | |

**List-adjust rule.** The rule (lower only as far as the tag needs, 32px
gap, never below header + one row) is unchanged; only the tag's height
feeds it.
- A, F (+2) and C, D (+6) are negligible.
- B (+20) and E (+34) mean more lowering at 390×664, where the tallest tag
  already hits the minimum list and scrolls inside. Another reason to kill
  them.

## Must-fixes

All variants:
1. Keep the shipped markup, so the reading stays "Type, …, Plan, …". If
   the label and value ever split into separate visual rows (B, C), keep
   them in one `.tag-f` group so VoiceOver doesn't read two orphan words.
2. Plan uses the plan's own words ("Stop n of m"). Don't shorten it to
   "3/3"; a bare fraction would be the loud number the owner rejected.

Per variant:
- **A Ledger:**
  - Check the 13px ink caps value against the stub's ink caps labels at 1x
    (the designer's own note). If they tie, drop the value to `--ink-2` at
    600. Which one is the CD's call; for UX either keeps tier 2.
- **F Margin print:**
  - With Type only, the line simply reads as A, which is fine.
  - In Plans, Plan sits flush right beside the Visited segment's column.
    Keep the 16px gap above and 8px below so it reads as the tag's print,
    not a stub label. Verify at 1x in Plans with "Stop 12 of 14".
- **D Rubber stamp:**
  - Measure the masked ink's effective contrast at 1x; it needs ≥4.5:1
    (flat `--ink-2` is 6.5:1).
  - The tilt must be a fixed per-place angle (like `stampTilt`), never
    random per render. A re-render after a star tap must not wobble the
    line (the "nothing moves on tap" rule).
  - The CD rules whether "stamp" must mean only visited.
- **C Form blank:**
  - Separate the value from the note: smaller than 14px, or `--ink-2`.
  - With Type only, the empty right half is fine for interaction.
  - The two `--hair` lines sit 12px above the dashed perforation. The owner
    and CD rule on "no heavy rules".

## Not verified

- Chromium only. The long-content render patched one fixture tag (no
  address line).
- Plans view wasn't re-shot with "Stop 12 of 14"; the plan field was
  appended in place.
- D's masked contrast wasn't measured.
