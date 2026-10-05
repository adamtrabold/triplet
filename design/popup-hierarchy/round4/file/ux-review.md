# Card File v2: UX review (Stand-Up, Rolodex, Dealt Out)

UX agent, 2026-10-05, on `eea8267`. Brief: `docs/ux-brief.md`. Jobs from
`../../ux-analysis.md`; hard limits and defaults from `../../round2/ux-review.md`
§4. Evidence: 1x phone stills, Plans first, then the 3x crops. The idea is
judged, and mock flaws are listed as fixes.

Owner (verbatim): "i also think the card file exploration is interesting,
but i can't really see it... would like more there. the typewriter font is
unnecessary." The tag notes apply here too: the address goes near the name,
and long notes show at full length.

## Ranking (UX)

| # | Variant | Verdict | Ready for the owner? |
|---|---|---|---|
| 1 | **Dealt Out** | KEEP | **Yes.** The whole list stays live, the foot sits at one y, there are two put-back targets, and Plans flows stop to stop in one tap. |
| 2 | **Stand-Up** | KEEP | **Yes**, with the end-of-list fix noted. |
| 3 | **Rolodex** | KEEP (conditional) | **Yes as a concept**, but the owner should see it with its two problems named. The header moves per place and the edges look tappable but aren't. Both are fixable, so it isn't killed. |

All three now show the file (`f1`), so the owner's "can't really see it" is
answered. No hard limit is broken at the idea level.

## Shared findings

- **Address line: fixed here.** "Rejsbygade, Humleby" and "Sibyllegatan 2,
  Östermalm" are street + neighbourhood, which answers the owner's "which
  one" job. In the Hanging Tag review the same line showed the venue's own
  name in 108/201 places. **Must-fix (both concepts):** run the extraction
  rule over all 201 real addresses and show the misses before build.
  Hanging Tag should use the same rule.
- **Notes in full:** yes in all three (approx 8 lines + the break).
- **Put back ⌄: accepted in all three.** It's 44px. Its meaning ("down,
  into the file") matches every variant's motion and never reads as the
  rows' delete ×. Map tap also puts back. Dealt Out adds a tap on the gap,
  which is the best of the three.
- **List state:** every variant scrolls the list to stage the card. Stand-Up
  scrolls the row to the first slot; Dealt Out puts the gap at the top
  (`out/busiest`: row 1 is scrolled away). **Must-fix (contract):** put
  back restores the scroll that was there before the tap, not the staged
  one.
- **Pin-to-pin and row-to-row while a card is out:** must be a one-tap swap
  wherever another pin or live row is visible.
- **Signed out:** in all three, Star and Visited are dimmed and Directions is
  live (`out/signedout`, cream at 0.4 on the ink card, still legible). Flag
  to the owner as before: Directions stays live because it edits nothing.
  The owner still has to say what a tap on a dimmed control does (UX
  recommends offering sign-in).
- **Safari toolbar:** unverified in all three, because `--chrome-bottom` is
  0 in the harness. Stand-Up's and Rolodex's foot rows sit low (y≈633–812,
  y≈775). Must be checked in a tab.

## 1. Dealt Out: KEEP (rank 1)

| Job | Result | Evidence |
|---|---|---|
| J1 | PASS | Seal + name; the tab "BAR · STOP 2 OF 3" points at the pin (`busiest`). |
| J2 | PASS | Whole note; approx in full (`approx`). |
| J3 / J4 / J5 | PASS | Foot at y≈505 in busiest and approx. Fixed, because it's pinned 14px above the file. |
| J6 Plans | **PASS, best** | The numbered gap "2" holds the card's place. Stop 3 and the add-from rows stay live, so a tap on stop 3 should go straight to its card (swap). |
| J7 | PASS | ⌄, the gap (56px), or a map tap. |
| J8 | PASS | Address line + ›. |
| J10 | PASS | Deal motion. |

- **List live?** Yes, all of it: header (sort, filter, locate, ▼), rows,
  and swipes. That's the best parity of the three.
- **Covers the most map** (the coordinator's check): the card fills the
  strip between the pin and the list. In `busiest` that's y≈270–530, and in
  `approx` y≈200–530, leaving ~200–270px of map above. Nearby pins *below*
  the selected pin are under the card. Map-cover is a soft default and the
  notes rule wins. Two things make it workable:
  - the map pans so the pin is always visible above the tab;
  - the swap contract.
- The dark visited card is a state, not a control, so interaction-wise
  it's fine. Whether it's too loud is the CD's call.
- **Must-fix:**
  1. Restore the list scroll on put back.
  2. One-tap swap from rows and pins.
  3. Decide what happens when a note is too tall for the space above the
     list. The pin must never be pushed under the top controls; the card
     scrolls inside instead (not drawn).
  4. A district's tab points at its outline, not a pin. Say what the tab
     aims at for a shape.

## 2. Stand-Up: KEEP (rank 2)

| Job | Result | Evidence |
|---|---|---|
| J1 / J2 / J8 | PASS | `busiest`, `approx`, `plans`. |
| J3 / J4 / J5 | PASS (friction) | Foot at y≈633 in busiest, plans and approx, but y≈812 in `shape`. A row near the list's end can't scroll to the first slot, so its card stands lower and the foot moves. |
| J6 Plans | PASS | The card keeps "1"/"2". The stops in front (2, 3 in `plans`; 3 in `busiest`) stay visible and live. The stops behind are covered. |
| J7 | PASS | ⌄ + map tap. |

- **It covers the list header** (the coordinator's check). Sort, filters,
  locate and ▼ are unreachable while a card is up. The owner said replacing
  the list is fine to explore, so this isn't a blocker. But **locate is a
  map control that lives in the header**: while a card is up you can't
  re-centre on yourself. Note it for the owner.
- **List live?** Partly: the rows in front are live, the rows behind and the
  header are not.
- **Must-fix:**
  1. End-of-list rows: pad the list so any row can reach the first slot,
     keeping the foot at one y.
  2. Restore the scroll on put back.
  3. One-tap swap from the live rows in front.

## 3. Rolodex: KEEP, conditional (rank 3)

| Job | Result | Evidence |
|---|---|---|
| J1 / J2 / J8 | PASS | `busiest`, `approx`, `bare`. |
| J3 / J4 / J5 | PASS | Foot at y≈775 in busiest, approx and bare. Fixed. |
| J6 Plans | PASS (friction) | Order reads as edges: 1 above, 3 below. But the edges are **18px and not tappable**, so going to stop 3 means put back, then tap. |
| J7 | PASS | ⌄ + map tap. |

- **The edges look like rows but can't be tapped** (the coordinator's
  check). They show names and numbers and look like the rows you just
  tapped, so people will tap them. A dead target that looks live is a
  false affordance. **Must-fix:** either a tap on an edge swaps to that
  card (pool the edge stack into ≥44px zones: tap above = previous, tap
  below = next), or make the edges read as non-interactive. Swapping is the
  better fit for Plans.
- **The map height and the header move per place** (the coordinator's
  check). The list header's y is ≈505 (busiest), ≈395 (approx) and ≈605
  (bare). Sort, filters and locate change physical position every time a
  different place is opened, and the map edge jumps with them. That's
  against the owner's "I don't want it to grow height/for the button to
  change physical location after click". **Must-fix:** a fixed drawer
  height (the card scrolls inside past it). That keeps the idea and only
  changes the sizing, so it doesn't kill the variant.
- **List live?** The header yes (but it moves); the rows no (they're edges).
- The notch alone fails "visited must be clearly different", but ✓ VISITED
  and the filed paper carry the state (designer says so). For interaction,
  undo is the foot button, same slot.

## Comparison on the coordinator's checks

| Check | Stand-Up | Rolodex | Dealt Out |
|---|---|---|---|
| List header | covered | live, but moves per place | live, fixed |
| Rows | in front live, behind covered | become 18px untappable edges | all live; numbered gap |
| Map | card stands over its bottom; map height fixed | height changes per place | most covered (pin → list strip) |
| Foot y | fixed except end-of-list | fixed | fixed |
| Put back | ⌄ + map | ⌄ + map | ⌄ + gap + map |
| Signed out | dimmed, Directions live | same | same |

## Not verified

Stills and frames only. Timing, the swap behaviour, scroll restore, the
Safari toolbar and VoiceOver are unchecked. Rolodex and Dealt Out's
full-address state isn't drawn.
