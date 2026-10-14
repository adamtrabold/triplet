# C · The tag is the button (round 10): how it works

Systems, 2026-10-14. The look is visual's (`looks-and-feels.md`,
`t.inc.html`). The form is `../blank-tag-form/how-it-works.md` (its
"Round 10b" note). Measured on the **real 202 pins** with visual's own
layers: `../r10-check/t-check.js` (`TAG=t10-`) and `mass.py t10-`.

## The object (visual's pick #2: `data-tv=twoend`, 104 × 54)

- **What it is:** a cream claim-check tag with a navy +, an orange
  claim-check end and no pin: a loose tag, not yet pinned to anything.
- **Placement:** bottom-left. The left edge is on 19.9, and the foot is
  min(20 above the list, 6 above the credit).
- **Hit area:** the whole tag box (104 × 54, over 44 high). The + isn't a
  separate control.

## Rank and footprint

| Variant | Squint vs the account, σ4 / σ8 | Read |
|---|---|---|
| **#2 orange end (pick)** | **1.37 / 1.31** | clears 1.2 at both blurs, the best of any C so far without an added block |
| #5 orange stock, punched + | 3.85 / 3.88 | 3x the account: rank by flood, the pattern the director rules out |
| #1 plain paper | 0.41 / 0.36 | too quiet (as visual said) |
| Float (ref) | 1.34 / 1.33 | |

- **Pins, at the opening fit (40 scenes):** 0 under, except 320
  Stockholm, list up: 1 (+2 within 6px). 9c had 4 and 6.
- **Street zoom, 390x664:** Copenhagen 16%, Stockholm 16%, Malmö 20%,
  LA 4%. The Float is 12 / 13 / 16 / 3; 9c was 19 / 22 / 26 / 7.
- **Credit:**
  - 9px clear at 390 and 4 at 320 (with the prefix dropped).
  - **At 375 the tag's right end (123.9) meets the credit's left edge
    (123.9)** and sits about 3-6px above it: corner to corner.
- **104 vs my 96 cap: I'll follow 104.** The fix is to drop "Leaflet |"
  below 380px wide instead of 338. Then the credit starts at 188 on a
  375 screen, about 64px clear. It's the same rule the Float and P
  already need at 320, with one number changed. I withdraw the 96 cap.
- **Tag-open gap:** 54 tall at a foot of 20, so `TAG_SHEET_GAP` = 20 + 54
  + 12 = **86** (the Float's is 88). Both stay tappable with a place's tag
  open, at the same list-row cost: at 320, 1 row instead of 2. Only the
  filters stay an exception for both.

## States

| State | C |
|---|---|
| Rest | shown at the sheet edge |
| Pressed | the end goes deep orange, the paper `--paper` |
| Tap | the claim-check end tears off (120ms), and the tag rises as the blank form (docked, keyboard up). The button is hidden while adding |
| A place's tag open | shown (gap 86). Tapping closes the tag, and cancel reopens it |
| Filters open | under the panel: close them to add |
| Sort menu open | the tap closes it first |
| After ADD | a fresh tag (end intact) is at rest when the new place's tag closes |
| Signed out / stale sign-in | adds / asks; nothing moves |
| Plans | shown; adds a place |
| Desktop | the map column's bottom-left |

## Coverage against jobs.md (round 10)

| Job | C #2 |
|---|---|
| 1 Reach | yes. Left side; the only exception is the filters (shared with the Float) |
| 2 Main action | yes: 1.37 / 1.31 |
| 3 Know what you'll fill out | yes, the strongest: the button *is* the blank tag |
| 4 Never in the way | yes: 1 pin at 320 Stockholm (list up); 16-20% of dense street views; the credit is clear once the prefix drops below 380 |
| 5 For the whole trip | yes, via "Search everywhere" and the city correction (form spec) |
| 6 Signed out | yes |
| 7-18 | yes, via the form, **once the two form fixes in its Round 10b note land** (fixed card height; the city must be tappable) |
