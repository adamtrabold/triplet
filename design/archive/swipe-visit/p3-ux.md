# Swipe LEFT to mark visited: p3 ("stamp in place"), UX verification

**How:** my own measurements in Chromium at 390px, using real CDP touch paths.

**Scripts:**
- **Pop and clearance:** `visit/me-p3a.js`
- **Pre-commit sweep:** `me-p3b.js`
- **Un-visit ghost colour:** `me-p3c.js`
- **Haptics:** `me-p3d.js`
- **Delete, combinations, glyphs, re-pointed:** `me-p3xd.js`, `me-p3xe.js`, `me-p3xb.js`
- **Gates:** `star2/test6.js`, `flip6.js` and `curve8.js` (with `OUT=`), the designer's `vtest.js` re-run by me, `star/me3-popupfix-test.js`, and Impeccable

## Verdict

**Approve.** No blockers.

One should-fix is conditional on the iPhone: it applies if the pre-commit cue reads dead on the device. There are two nits. One of them corrects my own p2 advice.

## 1. The owner's ask

**The stamp never slides.** Before the commit, the stamp's scale and rotation changed on **0 of 31 frames**. It sits in its slot at its tilt. The only thing that moves is the track sweep.

**The press pop is the star's.**
- `VISIT_POP` uses the star's offsets (.34 / .65), the same per-segment easings, `STAR_POP_MS` 380 and a linear effect (checked in the code).
- The measured per-frame curve fits the table to **±0.02 scale and ±1.6°** (frame quantisation on the fast segments), after a phase of about 30ms. See the nit below on the start.

**Measured pop:**

| Measure | Value |
|---|---|
| Peak | 1.20 |
| Dip | 0.95 |
| Frames at ≥1.15× | 10 |
| Frames at ≤0.97× | 3 |
| Rotation range | tilt −12° … tilt +4° |
| Rest | **rotation = `stampTilt()` exactly (−5.00° on the test row), scale 1.000** |

**The two deviations are justified.**
- I swept all six `STAMP_TILTS` across the whole pop timeline and measured to the name's line box, the meta line and the X:

  | Peak | Minimum to the name | Minimum to the X | Minimum to the row edge | Worst tilt |
  |---|---|---|---|---|
  | **1.20 (p3)** | **4.80px** | **4.80px** | 7.37px | −3.5° |
  | 1.25 | 3.00 | 3.00 | 6.53 | −3.5° |
  | 1.30 | 1.20 | 1.20 | 5.69 | −3.5° |
  | 1.40 (the star's) | **0.00** (touches) | 0.00 | 4.01 | −5° |

- The designer's ≥4.8px holds exactly.
- 1.25–1.3× would crowd the name and the X to 1–3px, and 1.4× touches both.
- The ×0.6 twist is the right call for a 72px oval.

## 2. Before 56px: is the pre-commit cue honest, and is it alive?

**Honest: yes.**
- The track sweeps with the finger and retracts on back-off.
- On a release before 56, it sweeps back with **no ink, no field and no haptic** (0 haptic calls on cancel, in both motion modes).
- An open outline never reads as a stamp.

**Visible: yes, just.**
- The swept dots are dark: the darkest pixel is **7.37:1** against the paper, at 3x and 1x.
- The sweep starts top-centre and runs anticlockwise, so it grows **ahead of the finger**. With the finger at x = 305–335, the arc sits at x = 262–296, left of the contact point, where a right thumb doesn't cover it.
- Only in the last ~10px of travel does it wrap under the finger (up to x = 333).

**Alive: this is the risk.**
- The arc is a *dotted hairline*: at 3x, a near-full arc is only about 850 dark pixels, and about 170 at 1x.
- Everything else in the row is still. The star, by contrast, moves the whole name 1:1.
- In Chromium frames it reads as "something is being traced". Whether a still row with a faint dotted trace feels responsive under a moving thumb in daylight is **the #1 iPhone check**.

**Should-fix, only if the iPhone check says "dead" (P3-S1):**
- Trace the stamp's **2px solid ring** alongside or instead of the dotted track, so the arc has weight.
- Optionally, let the name's tail feather edge track travel for the whole 0–56px, not just 0–6px. That adds movement outside the stamp slot without sliding anything.
- Don't add sliding: the owner ruled that out.

## 3. Un-visit

- **The erase pop is the star's `STAR_ERASE_POP`** (1.12×, no twist; designer V20, consistent with the strips).
- The ring stays visible while it thins. The ghost is gone at 56, and the erase double tick fires (`erase` called once; the double tick is inside `starHaptic`).

**Nit P3-N1 (corrects my p2 note): the ghost still goes grey.** Pixel-measured ink on the visited field:

| Travel | 16px | 30px | 40px | 48px | 54px |
|---|---|---|---|---|---|
| p3 chroma | 0.129 | 0.094 | 0.051 | **0.016** (hue 180) | 0.016 (hue 75) |
| p2 chroma | 0.129 | 0.094 | 0.047 | 0.020 | 0.012 |

- An opacity fade composites navy over warm paper. That is the same mix as `color-mix` toward the field, so the "opacity, not mix" change I suggested in p2 can't remove the grey. That advice was wrong.
- **If the grey reads as "disabled" on the device:** fade toward a *light navy tint* (for example `color-mix(in oklch, var(--navy), white)` stepping lighter, at full opacity), or thin it by erosion like the star's rub. Don't fade by alpha.
- It is a transient on the way out, so it is a nit, not a should-fix.

## 4. Kept behaviour

**Delete safety D1–D10**, starting on the X of an unvisited row:

| Movement from the X, or path | Delete confirm |
|---|---|
| Still tap, 2px or 3px | **yes** |
| 4 / 5 / 6 / 8 / 12 / 20 / 40px | **no** |
| 90px left (visit, un-visit) | 0 deletes |
| Right stroke, vertical scroll, 40° diagonal, mouse drag | 0 deletes |
| Start at x = 372 (EDGE) | inert |

- **New in p3:** the X stays hidden until the pop lands (`VISIT_POP_MS` + 20).
  - A tap on the X at 0ms or **100ms** after a stroke now *navigates*; in p2 the 100ms tap deleted. At 300ms it deletes.
  - This is safer. It's a new window where the X area navigates, which is harmless.

**Glyph rule: 0 changes on still frames**, in both motion modes, for visit, press-then-back-off and un-visit on long names.
- Visit changes on the press frame (stamp transform, field and mask all change).
- Un-visit changes on the lift frame (stamp transform and ink change), under the feather.

**Other checks:**

| Check | Result |
|---|---|
| Reduced motion | Scale 1.000 on every frame, rotation fixed at the tilt, 0 movement; the row visits |
| Haptics | Visit → `ink`, un-visit → `erase`, cancel → none. Same in reduced motion. |
| Starred and visited rows | `SV → S- → --`; marks 8px and ~98px clear of the text |
| Rapid strokes across rows (star↔visit, visit↔visit, at 0 and 100ms) | All land |
| Scroll-then-tap | Navigates |
| Popup Mark Visited | `aria-pressed` false → true live; the popup stays open |

## 5. Gates (re-run by me)

| Gate | Result |
|---|---|
| Star touch suite (`test6.js`, `PROTO=p3v.html`) | **84/84** |
| `flip6.js` | **8/8**; its at-rest control fails **4/4**, as designed |
| Visit gate (`vtest.js`, run by me) | **91/91** |
| Popup-open | **20/20** |
| Impeccable (`p3-proto.html`) | **exactly the 3 baseline findings** |

**curve8** (frames at ≥1.3×; 5 interleaved runs each; `OUT` set, so `r8-curve.json` was left untouched):

| Build | Row | Highlighted row | Popup |
|---|---|---|---|
| `main` (HEAD 4c746e7) | 11, 11, 11, 10, 11 | 11 ×5 | 9 ×5 |
| p3 | 11, 11, 10, 11, 11 | 10, 11, 11, 11, 11 | 9 ×5 |

That is 1 of 10 runs at 10 on `main` against 2 of 10 on p3. That is the same frame-phase jitter seen in p2, **not a regression**.

**Not re-run by me:** `haptic8` / `tap8`, the dust detector and N8-a. I took those from the designer's gate; this change doesn't touch any of them.

## Nits

- **P3-N1:** the un-visit ghost goes grey (above).
- **P3-N2: the pop starts about 2 frames after the press frame.** The press frame (field on, ring closed) shows the stamp in the start pose (tilt −12°, 1.0), which holds for about 30ms before the curve runs. That's harmless and arguably reads as "set down, then pressed". If the CD wants the swell to begin on the press frame itself, start the timeline from the press event's timestamp.

## iPhone checks (additions)

1. **(First)** A left stroke feels alive with the row still. Can you see the outline tracing ahead of your thumb? If it feels dead, apply P3-S1.
2. The pop reads as the star's family: a grow/shrink/settle to the place's own tilt, never crowding the name.
3. The un-visit ghost doesn't read as a greyed-out, disabled stamp (P3-N1).
