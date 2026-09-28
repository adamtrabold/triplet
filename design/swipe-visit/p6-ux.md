# Swipe LEFT to mark visited: p6, focused UX pass

My own scripts, re-pointed at `p6-proto.html`, in Chromium at 390px:
- **Held frames at 3x:** `me-p6a.js`
- **Un-visit L at 1px steps:** `me-p6n.js`
- **Release at ~40px:** `me-p6r.js`
- **Long-frame attribution:** `me-p6f.js`
- **N8-a:** `me-p6n8.js`
- **Gates:** re-run

## Verdict

**Approve.** All five p5 findings are fixed, measured in pixels.

There is one performance nit: a rare mid-drag long frame from the core-strength class step. It is not a blocker.

## The five p5 findings

| Finding | p5 | **p6 (measured by me)** |
|---|---|---|
| **S1: highlighted-row cap** | 4.76–4.84:1 before the commit; ring 92% at 54px | **1.86 → 2.11 → 2.40:1** (pressed 4.79); ring **68%** at 54px |
| **S2: no un-visit darkening** | L 0.401 → **0.274** at the lock | **L 0.401 held through c12**, then 0.451 (c16) and 0.550 (c24). It never drops. Chroma 0.035–0.038, hue 244–247° |
| **Chroma ~0.035** | 0.042–0.046 | **0.028–0.035**, hue 246–247° (pressed: L 0.401, C 0.035, hue 247°) |
| **Core hidden until 18px** | core scale 0.332 at 16px; "SIT" on the highlighted row | **Core scale 0.10 at 8, 12 and 16px on both row types.** Word-band ink is 9% on the normal row and 8% highlighted, which is the blot only. The core opens at 20px (0.456). |
| **Ring coverage** | 0% until 40px | **0 / 28 / 42 / 57 / 69%** at 24 / 32 / 40 / 48 / 54px on the normal row; highlighted 0 / 25 / 42 / 56 / 68%. **Never closed before the press** (100% only when pressed). |

**Honesty on the normal row:** ≤**2.92:1** (pressed 6.9:1).

**Release at ~40px:** dries away 184ms after lift, with one field colour throughout, never visited and no haptic. That holds on the normal and highlighted rows; under reduced motion it clears on the lift frame.

**From the compare strip:**
- The pre-commit ink now reads as the stamp's navy at a lower density, not cornflower.
- The first ink is a small blot on both row types.
- From 32px the oval's top and bottom arcs arrive together with the word.
- The word still leads by one step: at 24px, "ISITE" shows with 0% ring. The CD accepted that as P4-N2.

## Performance (200 rows, dsf 3, 4× CPU throttle)

**Per-frame attribution** (each long frame tagged with what changed on the frame before it), 6 runs:

| Where it happens | Frame length | How often |
|---|---|---|
| Lock (`→live`) | 50ms | 3 runs |
| Press (`→visited`) | 50 / 67ms | 2 runs |
| Release teardown | 50ms | 4 runs |
| **Mid-drag**, after a core-strength class step (`STAMPCLASS`, the `vs-s2`/`vs-s3` repaint) | **50ms** | **1 run** |

- Every other drag frame was ≤33.5ms.
- The designer's 83ms peak didn't reproduce; my worst was **66.7ms, on the press frame**.
- **`main`** (4 runs, same harness): drag frames ≤33.5ms. One 66.6ms idle frame.

So:
- The lock and press hits are confirmed at the lock and press (plus release) frames. Unthrottled they are about 12–17ms.
- There is **one real mid-drag source** that `main` doesn't have: the core-strength step repaint, 1 in 6 runs, about 12ms unthrottled.
- **Nit P6-N1:** if it shows on the device, do the step as an opacity crossfade between the pre-rendered core copies instead of a class change, so it's compositor-only. Otherwise, accept it.

## Gates (spot-check, re-run by me)

| Gate | Result |
|---|---|
| Star touch suite (`test6.js`, `PROTO=p6v.html`) | **84/84** |
| `flip6.js` | **8/8**; its control fails **4/4** |
| N8-a | A mouse click on the popup star leaves focus on `.popup-star` and toggles it; a touch tap leaves focus on `body` |
| Visit gate (`vtest.js`) | **93/93** |
| Impeccable | **exactly the 3 baseline findings** |

## iPhone checks (additions)

1. The pre-commit ink reads as the same navy, only fainter.
2. The oval's top and bottom arcs appear with the word, and the ends soak until the press.
3. There's no hitch when the ink steps darker mid-drag (P6-N1).
