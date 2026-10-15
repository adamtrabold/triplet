# Swipe LEFT to mark visited: round 3 (p3), after the owner tried p2 live

> "I don't think it should slide it should stamp with some grow shrink that feels good…maybe the same as the star"

This is a perfection-stage tweak to a shipped design.

**The diff:** `p3-proposed.diff` changes `index.html` only, against main `aa0445e`: 7 hunks, 249 changed lines.
- It is verified with `git apply` and then `cmp` against `p3-proto.html`, which `buildp3.py` builds from main.
- `index.html` has not changed on HEAD since `aa0445e`.

## What changed

- **No carry.** The stamp never slides and never moves off its slot. It is the shipped `.row-stamp`, placed exactly in its slot at the place's `stampTilt()` from the lock onward.
- **Before the 56px commit, the travel shows the stamp being lined up.**
  - Nothing moves.
  - Between 0 and 6px, the name's tail feathers out of the slot.
  - From 6px to 56px, only the stamp's own perforated track sweeps round, starting at top-centre and running anticlockwise the way the finger travels. Under the hood this is a conic mask intersected with the track mask.
  - The ring and the word stay hidden. An open ring never looks done, and it closes exactly on the frame the stamp lands.
  - The sweep follows the finger; backing off retracts it. Letting go before 56px sweeps it back out, and nothing is inked (V21b; `p3-cancel-3x.png` and `p3-cancel-4x.png`).
- **Press: "the same as the star".** `VISIT_POP` is the star's `STAR_POP`, played around the place's tilt.
  - Same 380ms (`STAR_POP_MS`), same offsets (.34, .65), same per-segment easings, same linear-effect model. It is rAF-driven so every frame renders crisp at 4x.
  - The 0.95 dip and the rest at scale 1 are unchanged from the star.
  - It rests at exactly `stampTilt()` (V17: rest rotation equals the tilt).
  - On the press frame, all of these land at once: the ring closes, ring and word ink on, the visited field, the final truncation, and the haptic.
  - Two deviations from the star, both measured:
    - **Peak 1.2× (star: 1.4×).** At 1.2× the 72px oval already grows 14px wide, which is twice the star's absolute growth at 1.4×. At 1.25×, the stamp would come within 4px of the name.
    - **Twist ×0.6: −12° → +4° → −1.5° → 0° (star: −20° → +6° → −2° → 0°).** For the same angle, a wide oval's ends swing about 3× further than a star's points.
  - Measured across all six `STAMP_TILTS` on a long name at the peak (`tilt3.js`):

    | Clearance at the peak | Worst case |
    |---|---|
    | To the name | ≥4.80px (star's popup: 4.41) |
    | To the X | ≥4.80px |
    | Inside the row, top and bottom | ≥7.37px |

  - Frame counts at real timing: 10 frames at ≥1.15× (the gate is ≥6) and 2–3 frames at ≤0.97. The dip frames vary with frame phase, as the star's do.
- **Un-visit: the star's erase pop.**
  - At the lock, the stamp lifts with `STAR_ERASE_POP` (1.12× over 240ms, no twist).
  - The track then sweeps back out and the stamp thins by opacity to a 30%-ink ghost between 12px and 44px. The ring and the word stay visible throughout.
  - At 56px the ghost is gone, the field drains, and the erase double tick fires.
  - On release, the wider row is still revealed by the feather sweep, as before.
  - Per UX p2, the ghost now fades by opacity rather than by mixing toward the paper, so it no longer passes through a neutral grey.
- **Removed:**
  - the carried stamp's opaque face, cast shadow, lift and descent;
  - the N1 clip (the stamp never comes near the X any more: V19, ≥10.7px clear);
  - the p1/p2 thunk.
- **Reduced motion:** no pop and no lift. The sweep (finger-driven) stays, and the press simply appears (V17 reduced: scale 1 and the tilt on every frame). Haptics still fire.

## Kept (all re-verified)

- **Delete safety:**
  - `DELETE_TAP_SLOP` is still 4px, and D1–D10 pass.
  - The X fades out at the lock and is tappable again only once it is back.
  - The X now also stays away until the pop has landed (`VISIT_POP_MS` + 20).
- **Glyph changes only on a press or lift frame, or under the sweep:** V18, 0 changes on still frames, in both motion modes.
- **The field lands on the press frame.**
- **Haptics:** a tick on the press and a double tick on the lift; the account menu and suggestions stay open.
- **Popup Mark Visited stays in sync** with the row.
- **Starred and visited rows:** both work together.
- **Hand-off:** the landed stamp is pixel-identical to the rendered stamp at 3x (V8).
- **EDGE 24 and rows at 56px.**

## Gate

- **Star gate:** "84 + 8 (+ N8-a)". The touch suite is 84/84 in both motion modes, and `flip6.js` is 8/8 (its deliberate at-rest control fails 4/4). N8-a passes on iOS, Android and reduced motion.
- **Other star checks:**
  - popup-open 20/20
  - dust 0 frames over text; lift → move ≤126ms
  - rows 56.00px
  - tap delay 1.2–2.1ms
  - hand-off 0/5,184 in all four cases
  - `haptic8`: 0 focus frames on the switch, 0 document clicks, overlays stay open, reduced motion still ticks
  - `tap8`: 1 trusted toggle per tap
- **Star curve (`curve8.js`), 10 runs each, always with `OUT=`:**

  | Build | row (≥1.3× frames) | row highlighted | popup |
  |---|---|---|---|
  | **p3** | **11 in 10 of 10 runs** | 11 in 10 of 10 | 9 in 10 of 10 |
  | main `aa0445e` (= p2), same session | 11 in 8, 10 in 2 | 11 in 8, 10 in 2 | 9 in 10 of 10 |

  p3 does not make the curve worse; in this sample it read 11 on every run. The 10 readings are frame-phase jitter, the same as UX's earlier p2 and main samples.
- **Visit gate (`vtest.js`): 91/91** in both motion modes.
  - New or rewritten cases:
    - V13: nothing moves before the commit; the track sweep is monotonic and never closed.
    - V14: ink stays ≥4px from the text on every frame, including the peak; measured 4.81.
    - V17: pop frames, the peak, and the rest angle equal to the tilt.
    - V19: the stamp never reaches the X.
    - V20: the un-visit erase pop reaches 1.12× with no twist.
    - V20b: the ring stays visible during un-visit.
    - V21 and V21b: cancel in both directions.
  - Kept: V1–V12, V15, V16, V18, D1–D10.
- **Impeccable: baseline 3.**

## Strips (real timing)

| Case | 3x | ~4x crop | 1x |
|---|---|---|---|
| Visit | `p3-visit-3x.png` | `p3-visit-4x.png` | `p3-visit-1x.png` |
| Un-visit | `p3-unvisit-3x.png` | `p3-unvisit-4x.png` | `p3-unvisit-1x.png` |
| Cancel | `p3-cancel-3x.png` | `p3-cancel-4x.png` | — |
| Reduced motion, visit | `p3-reduced-visit-3x.png` | — | — |
| Reduced motion, un-visit | `p3-reduced-unvisit-3x.png` | — | — |

Plus `p3-ios-overlays-1x.png`.

## Dials

- pop peak 1.15–1.2× (anything over 1.2× costs clearance to the name)
- twist ×0.5–0.8 of the star's
- sweep start: top-centre, anticlockwise
- ghost 0.3
- `DELETE_TAP_SLOP` 3–6px

## iPhone checks (replace the p2 carry checks)

1. A left stroke shows the stamp's dotted outline tracing round in its own spot, with nothing sliding.
2. At 56px the stamp lands with the star's grow-shrink, in the stamp's voice. It reads as the same family as the star, not a copy.
3. Let go early and the partial outline retracts; it never looks stamped.
4. Un-visit lifts the stamp with the star's erase pop, then it fades away.
5. On a long name the ellipsis lands with the pop, and nothing changes when you let go.
6. A wobbled tap on the X neither deletes nor navigates (dial 3–6px).
