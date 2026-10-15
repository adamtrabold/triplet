# Pencil Star, round 5 (the CD's round-4 blockers, plus UX R4-S2 and N4-b)

This round keeps, unchanged:
- the hand-speed pen (`HAND_MS` 360);
- the S1 soft star;
- the popup pace (72ms per stroke, ink at 380ms);
- P1's structure (an 18px two-line star in its own slot, both lines indented).

**Files:**
- `r5-proto.html`, built by `build5.py` on top of round 4's `build4.py` P1 output. Every anchor is asserted.
- `r5-proposed.diff`, against `main` (`ab82197`; `index.html` untouched): 27 hunks, 245 changed lines. `git apply` on a clean copy produces `r5-proto.html` byte-for-byte.

## 1. The commit is shown by pressure, not speed

UX's "finish within 120ms" was rejected, as ruled. Now, in the **same event and same frame** as the finger crossing 56px of content, every stroke goes over harder, both the strokes already drawn and those still to come:

- It widens about 1.4× (a 0.7-unit stroke on the capsule).
- Its opacity goes from 85% to 100%.
- The graphite darkens (`color-mix(--ink-2 55%, --ink)`).
- The grain gets denser (a second filter, swapped in).
- Backing off below 56 makes it light again.

**Pace after the commit:** the hand may hurry, but every remaining stroke still takes at least 55ms, and the whole sketch stays visible for at least 280ms (`SKETCH_MIN`). The ink lands when the sketch completes, never by jumping.

**The detent:** the name block catches 3px (a half-sine over 140ms) as the finger crosses. This is not applied under reduced motion.

**The unstar mirror:** the first eraser speck drops in the crossing frame. The other two fall when the rub-out completes.

**Measured** (`r5-metrics.js` → `r5-metrics.json`; frame-accurate in-page touch stream, 60Hz):

| Swipe | Frames from crossing to heavy graphite | Crossing → ink | Sketch frames |
|---|---|---|---|
| slow 0.3 px/ms | **0** | 183ms | 17 |
| natural 0.6 px/ms | **0** | **250ms** (target ≤250) | 17 |
| brisk 1.2 px/ms | **0** | 267ms | **17** (target ≥17) |

- Unstar: the first speck lands in the crossing frame (0 frames later).
- Detent, holding at content 70: the name dips to −3.0px against its base and recovers within 140ms.

**Evidence:**
- `r5-62-vs-72.png` (3x and 4x): released at finger 62 (light graphite, would cancel) against 72 (pressed, committed). They are distinguishable mid-sketch.
- `r5-realtime-brisk.png` and `r5-realtime-natural.png`: every compositor frame of one real-time swipe, where the strokes visibly darken at the crossing.

## 2. The printed star is black ink everywhere

It is `--ink` in the list (P1 slot), the popup (filled), the add form (pressed) and the gesture's ink layer. The map star was already `--ink`, so now the whole app has one mark in shape and colour. Highlighted rows keep `--paper`. The unstar still goes colour first (ink → graphite), then grain.

**Contrast** (`measure5.js` → `r5-measure.json`, minimum across all 5 cities):

| Mark | Ratio |
|---|---|
| Printed ink star on paper / filed / pressed | **14.69 / 13.17 / 11.74** |
| Highlighted row (paper on `--figure-deep`) | **4.79** (Stockholm) |
| Pressed graphite on paper / filed (token) | 9.44 / 8.46 |
| Light graphite on paper / filed (token) | 6.17 / 5.53 |
| Light graphite as rendered at 85% | ≥3.84 at 3x, ≥3.28 at 1x (still ≥3:1) |
| Ghost | 1.41–1.51 (CD-accepted) |

**Stars on restaurant rows, all 5 cities:** round 4's `--figure-deep` against round 5's `--ink`, on normal and highlighted rows, at 3x, 1x and 4x (`r5-restaurant-5cities-{3,1,4}x.png`). The ink star separates from the fork ring in every city. On the highlighted row it is `--paper`, and it doesn't merge with the paper ring because of shape and the 12px gap.

## 3. The ink landing is crisp in real time

- The press-in is now 1.1× → 1 over 140ms (was 1.2× → 1 over 160ms): at most 0.9px of overhang per side at 18px.
- The spread is 1.15× at 45%, held for **exactly one painted frame**. It is rAF-driven: shown in the ink frame and hidden on the next rAF, not a timed animation that could straddle two frames. Measured: **1 spread frame** at every speed.
- The popup matches: 1.1 press, 1.15 spread, 16ms.
- Evidence: `r5-ink-landing-3x.png` (5 real-time compositor frames around the landing) and `r5-ink-landing-4x.png`.

## 4. R4-S2 and N4-b

**R4-S2: a quick second stroke is never dropped.**
- Held rows are tracked per row (`starHeld`).
- When a new row locks, any row still finishing is fast-forwarded: it jumps to its ink frame (the press-in and one-frame spread still play, and unstar dust still falls), and its FLIP carries on.
- Measured: star row 0, then stroke row 3 at 0 / 100 / 250 / 400ms: **both star, and both end printed, in all four cases** (they were dropped at 100 and 250ms in round 4).

**N4-b: an unstarred name no longer freezes.** It starts home **100ms before the dust falls** (`onNear` at 56 − 100ms of rub), instead of waiting until after. See `r5-film-unstar.png`.

## Verification (on `r5-proto.html`)

| Check | Result |
|---|---|
| Touch suite (`test4.js`), both motion modes | **87/88 + 1 re-spec.** The old "unstar long FLIP" case asserted that the row re-renders on the release frame. Since round 4's unstar hold, and N4-b here, the final row is laid out when the name starts home, not at lift-off. The rule behind it ("glyphs change only while the name is moving") is checked by `flip5.js`: **4/4.** There is exactly 1 re-layout, and it happens on a frame where the name is translating (star 38.4px, unstar 90.4px), in both motion modes. |
| UX's `ux2-touch` / `ux2-flick` / `ux2-popup` | Same as main (`r5-ux2.log`): S1 6/6 and 3/3; S3 at 34–50° 0/0/0/57/64/71 vs main 0/0/0/58/64/70; delete safe; popup taps |
| Popup-open suite | **20/20** |
| Rows | **56.00px** at every drag step |
| Tap delay | **0ms added** (1.1–1.4ms touchend → navigation) |
| Hand-off (`handoff5.js`) | **0/5,184 px** on paper, filed, highlighted Stockholm and highlighted Reykjavík (`r5-handoff.json`; the `r5-measure.log` hand-off lines use the obsolete frozen-clock method) |
| Impeccable | **Exactly the 3 baseline findings** |

**Frames:**
- Real-time sequences: `r5-realtime-{natural,brisk}.png` (commit crossing) and `r5-ink-landing-{3,4}x.png` (ink landing).
- Real-timing stepped films at 3x: `r5-film-star.png`, `r5-film-unstar.png`, `r5-film-reduced.png`, `r5-film-popup.png`.
- 4x: `r5-4x-star-unstar.png`. 1x: `r5-1x.png`.
- Restaurants: `r5-restaurant-5cities-*.png`.
- `r5-film-star-P0.png` and `r5-film-star-main.png` are re-renders of the round-4 P0 and `main` references only.
- The stepped films pause WAAPI, so eraser dust can linger a frame or two there; the real-time strips don't show this.

## Dials for the iPhone

| Dial | Range | Default |
|---|---|---|
| `HAND_MS` | 280–440 | 360 |
| Pressure step (stroke-width on the capsule) | 0.5–0.9 units (1.3–1.5×) | 0.7 |
| Light-graphite opacity | 0.8–0.9 | 0.85 |
| Detent | 2–4px | 3px |
| Ghost opacity | ceiling 0.45 | 0.35 |

## Only the iPhone confirms

1. You can tell during the stroke when it has gone far enough: the pencil pressure plus the 3px catch.
2. The black ink star beside the category ring reads as typography, not as a second badge.
3. The ink landing looks crisp at 60 and 120Hz (on 120Hz the spread frame is 8ms).
4. Three quick stars in a row all land, each visibly inking.
