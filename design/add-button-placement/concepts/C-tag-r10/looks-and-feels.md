# C · The tag is the button (round 10): how it looks and feels

Visual, 2026-10-14. Owner (on round 9c): "i think the tag itself needs to be simplified … just the tag with the + in it, the dotted line, and the "claim check" end. then the + would not need to be in any container, so the tag itself becomes the button. explore that - don't assume a color for the tag … don't only respond to my specific notes." The header tag (A) is cut. Float is "fairly complete".

Prototype: `t.inc.html` (dial `data-tv`; the variants are listed in its header), layered by `../blank-tag-form/stills.js` (page key `T:<variant>[:w[:tilt]]`, frames `t10-*`). Stills come from `../blank-tag-form/compose.js`.

## The common object

There's no pin and no lines. It's a claim-check tag lying across, 104 × 54:
- the left end die-cut with two chamfers (16);
- the claim-check end on the right, 25 wide, behind an upright 1.5 dashed perforation, with r3.5 notches top and bottom;
- the + on the body, 2 × 14 arms at a 5.4 stroke, round caps.

Bottom-left: left edge 19.9, foot min(20 above the list, 6 above the credit). It takes up about a quarter less map than round 9c's (104 × 54 vs 144 × 75).

## Eight ways (R1, each at real size; weights are rough, systems-scaled, vs the account)

| # | Variant | What it draws on | Weight | Read |
|---|---|---|---|---|
| 1 | Paper (the shipped tag's paper, edge and shadow), navy + | the Hanging Tag itself | 0.45 | the purest tag; **too quiet**, loses to the account |
| 2 | **Paper, orange claim-check end**, navy + | claim checks: the end you tear off is the action | **1.25** | **my pick.** A tag, a +, and one colour exactly where the action is; meets the rank without flooding |
| 3 | Paper, blank; **the + on a navy claim-check end** | deli / cloakroom "take a ticket" | 1.3 | clever, but the + is in a box again (the owner's "not in any container") |
| 4 | Navy, the + **punched through** | ticket punches: the map shows through | ~5 | striking; navy pairs it with the account badge (R5b "same weight") |
| 5 | Orange, the + punched through | the same, in the action colour | ~3.2 | the boldest that still reads as a tag; heavy |
| 6 | Navy tag, paper + | the frame colour | ~5 | heavy, pairs with the account |
| 7 | Orange tag, navy + | the old orange + badge | ~3.5 | heavy |
| 8 | The app's own tag shape in miniature (chamfers on top, the eyelet, the stub along the bottom) | the Hanging Tag | 0.5 | reads as a card more than a button |

- **On colour (the owner said explore, don't assume):** orange on a place's tag means starred (the band). On this button it's off the map's tags and on the claim-check end only (2), or on the whole stock (5, 7). I flag it; rule 2 (orange off the paper = act) supports it being the trigger's colour.
- **Mass:** 4-7 buy their rank by flood. That is the pattern that has failed the owner before ("what keeps blocking a 9"). 2 gets its rank from one meaningful patch.

## Pick: #2, the orange claim-check end

- **Pressed:** the end goes deep orange and the paper goes to `--paper`.
- **Tap, the motion:** the claim-check end tears off along the perforation (a short 120ms rip, the end dropping a few px and fading), and the tag rises as the blank form.
  - That is the claim-check gesture: you keep the stub, the tag goes on the bag.
  - The form opens (docked) with the tag's left end leading.
  - When the form closes or ADD lands, a fresh tag with its end is at rest.
- **Tilt:** `data-tilt` exists (a tag dropped at a few degrees). Not shown; it fights "simple, simple, simple".

## Also worth showing (beyond the notes)

- The punched + (4/5) is the most "whimsy with meaning" option: a claim check punched. If the owner likes it, a smaller one (W 84) brings its weight down toward 2.
- The pin+tag of round 9c is retired by the owner's note, not shown again.

## Open

- **Systems:** measure #2 (and #5) for rank and coverage. My numbers are rough (my blur metric × 1.2).
- At 1x, #2's orange end is a 25 × 54 patch. If the director finds it reads as a separate block, the next dial is the end at 20 wide with the + nudged right.
