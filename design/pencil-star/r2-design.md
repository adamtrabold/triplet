# Pencil Star, round 2

**The concept is unchanged:** printed = the guide's facts, stamped = where you've been, pencilled = what you care about.

- Stroke a row to the right: the name slides aside as one block, and a star is pencilled in the printed star's own box. At 56px the ink lands. The same stroke on a starred row rubs the star out.
- Every CD direction and UX finding (S1–S5, N3) is addressed below, in the CD's order.
- The prototype is `r2-proto.html`, built by `build2.py` from `index.html`. `index.html` and the DB were not touched.

## 1. A mid-stroke that reads as a star (CD 1)

I built both options and compared them at 4x (`r2-4x-a-vs-b.png`). **I picked (a): five straight strokes in the 12px printed slot.**

- (b), drawing at 20px in the gap, collides with the name and meta until about 24px of travel, and it would also need a shrink step on release.

**How (a) is drawn:**
- **Stroke order** is how a hand draws a star, as one continuous line: lower-left → top → lower-right → left arm → right arm → home.
- **Timing is front-loaded.** The strokes start at content 0, 6, 12, 25 and 38, and the sketch is whole at 50. By 12px you already have a Λ, which reads as "a star being drawn".
- **The sketch leans −7°**, as a hand does, and the ink lands upright over it. The lean also stops the half-drawn Λ-with-crossbar from sitting on the type's baseline and reading as a letter "A".
- **Each stroke is a tapered quad**, 2.7 → 1.6 units wide, so pressure lifts off along the stroke. It is revealed by its own dash mask; a mask per stroke means crossings never leak.

## 2. Graphite grain (CD 2)

- The grain is static SVG: `feTurbulence` alpha speckle plus a 0.35px `feDisplacementMap` wobble, in `--ink-2`. There is no JS.
- **Measured on the rendered pixels** (the darkest 4% of the stroke against its field, `r2-measure.json`):

| | Paper | Filed | Highlighted (paper on `--figure-deep`) |
|---|---|---|---|
| 3x | 5.53 | 4.96 | 4.49 (Stockholm) |
| 1x | 3.93 | 3.67 | 3.67 (Stockholm) |

  Everything clears 3:1.
- Arm's-length 1x strip: `r2-1x-armslength.png`.

## 3. The ink landing is the crispest frame (CD 3)

- **No crossfade.** On the detent frame, the pencil goes to opacity 0 and the ink to opacity 1 at once.
- The ink presses in from 1.2× to 1× over 160ms with `cubic-bezier(.2,.8,.3,1)`.
- There is a single **17ms spread frame**: the fill at 1.3× and 45% opacity.
- **Stills:**
  - `r2-4x-ink-peak.png`: paper, filed and highlighted Stockholm, at +0 / +17 / +60 / +160ms.
  - `r2-realtime-detent-frames.png`: 6 real-time compositor frames about 16ms apart, from a CDP screencast. The first frame after the ink fires is already 100% ink.

## 4. The rub-out has its own material (CD 4)

The printed star is **pixel-identical at lock**. The rub is applied only once travel is greater than 0. Then, in order:

1. **Ink lightens to graphite** over content 0–14 (`color-mix`) and turns grainy (the same grain filter).
2. **Erased from the points inwards, unevenly.** A mask threshold on a radial gradient plus noise, `0.1 + 1.1·t^1.8`, running over content 4–52.
3. **A soft smudge widens** alongside it: blur 0.5 → 2.1 units, scale up to 1.22, opacity peaking at 0.26 mid-stroke.
4. **Eraser dust** at 56: three 1.5px specks, drifting at most 2px, gone within 200ms. There is no dust under reduced motion.

`r2-4x-mid-star-vs-unstar.png` pairs the two at the same travel and field. Mid-star is crisp, straight graphite strokes; mid-unstar is a grainy, greying, eroding blot inside a smudge. You can tell them apart in one still.

## 5. The name moves as an object (CD 5)

- `h3` and meta move by `transform`, and `.row-main` gets a `clip-path` at its right edge (12px before the stamp or the X). The truncation is frozen for the whole drag: the words slide under the clip and are not re-truncated.
- A starred row keeps its printed star in the layout (`visibility:hidden`), so nothing re-lays out at lock.
- On the settle, the name docks against the star (+16 when starring, −16 when unstarring) and the meta always returns home.
- **Known limit:** at the hand-off to the printed row, a long name's tail re-truncates once. In `r2-film-unstar.png`, "Pe…" becomes "Perfo…" at the very end of the settle. This is unavoidable, because the starred layout is 16px narrower.

## 6. The UX findings (S1–S5, N3)

- **S1: no swallowed taps.**
  - A one-shot `eatClick` eats only the drag's own click. It is cleared on the next touchstart or pointerdown, and it covers mouse too.
  - The re-render hold applies only to the dragged row.
  - Measured: star, then tap another row at 0, 60 or 150ms, or the same row at 60 or 150ms: **all navigate**. With a mouse, the drag's click is eaten and the next two clicks navigate.
- **S2: 80ms touch press delay.** Mouse presses stay immediate.
  - A quick tap presses on release for **100ms**.
  - A still finger presses at 80ms (measured 104–111ms including CDP latency).
  - A stroke never shows a press.
  - The bare `:active` rule is neutralised, and compat mouse events within 800ms of a touch are ignored. Those compat events were clearing the release press after 1ms.
- **S3: `touch-action` stays `auto`.** The touchmove listener is non-passive and calls `preventDefault()` **only after the lock**.
  - Lock rule: at least 10px of horizontal travel, and more than 1.5× the vertical travel (flatter than about 34°). Otherwise, 8px of vertical travel hands the touch to the scroller.
  - If the scroller already owns the touch (`!cancelable`), we never lock.
  - An early "unlock" (vertical travel ≥ 16px while content < 16) aborts a star.
  - The matrix against `main`:

| Angle | Prototype | `main` |
|---|---|---|
| ≤33° | stars (horizontal strokes) | — |
| 36° | 0px scroll | 0px scroll (Chromium's own scroll rails) |
| 40° | 56px | 64px |
| 45° | 62px | 64px |
| 50° | 68px | 78px |
| 12px sideways, then up | **156px, no star** (r1: 0px) | — |

  In Chromium, the prototype scrolls up to 10px less than `main`, probably because the listener is non-passive. That is the iPhone check #1.
- **S5.** A flick of at least 32px at ≥0.5px/ms can **star** but never **unstar**. Removal needs the full stroke, through the visible erase.
- **S4: teach it in place.**
  - After a **popup** star, if that place's row is on screen and the sheet is open, the row replays the stroke once: the name slips out 30px, the five strokes draw, the ink lands and the name docks (about 460ms; `r2-film-teach.png`).
  - It plays at most **twice per device** (`localStorage`, try/catch). An off-screen row is skipped and not counted.
  - Under reduced motion: a static pencilled star for about 1s, then the ink comes in by opacity only. There is no toast.
- **N3.** Shape rows give 6px and spring back.

## 7. The popup star (CD 7)

- It uses the same markup and grain at 16px, and it is CSS only: five strokes × 40ms, then the ink lands at 220ms (press-in plus a 17ms spread frame).
- **It plays once.** `popupInkId` is consumed on first render, so a refetch or re-render doesn't replay it (tested).
- **Unstar from the popup:** the same rub over 240ms, then the hollow star.
- Filmstrip: `r2-film-popup.png`.

## Measurements

- **Suite (`test2.js` → `r2-test.json`, `r2-test.log`): 76/76.** That is 38 cases × full and reduced motion:
  - the 17 r1 cases;
  - the UX cases: swallowed-tap timing (touch and mouse), the 8-angle diagonal matrix, sideways-then-scroll, flick-unstar, press timings;
  - teach ×2, popup, N3.
  - Flicks use synthetic 8ms event timestamps.
- **Rows:** 56.00px at every drag step.
- **Tap delay: 0ms added.** Touchend → navigation measured 1.6–1.9ms (baseline 0.9–1.2ms); the click path is unchanged, with no timer or `preventDefault` before it, so the gap is measurement noise.
- **Token contrast, as the minimum across the 5 cities:**

| Pair | Ratio |
|---|---|
| Graphite on paper / filed | 6.17 / 5.53 |
| Ink on paper / filed | 4.79 / 4.30 |
| Highlighted row | 4.79 |
| Name while dragging | ≥13.17 |

- **Hand-off:** 9 of 2,916 pixels differ, by at most 6/255. That is the name's final 0.01px of easing at 219.9ms, not the star.
- **Impeccable:** exactly the 3 baseline findings.

## Deliverables

| File | What it shows |
|---|---|
| `r2-film-star.png` | Star, 3x |
| `r2-film-unstar.png` | Unstar, 3x |
| `r2-film-cancel20.png`, `r2-film-cancel50.png` | Cancel at 20 and 50 |
| `r2-film-flick.png` | Flick |
| `r2-film-highlighted.png` | Highlighted Stockholm |
| `r2-film-visited.png` | Visited row |
| `r2-film-reduced.png` | Reduced motion |
| `r2-film-popup.png` | Popup star and unstar |
| `r2-film-teach.png` | S4 teaching replay |
| `r2-4x-mid-star-vs-unstar.png` | Mid-star vs mid-unstar, 4x |
| `r2-4x-ink-peak.png` | Ink landing, 4x |
| `r2-4x-a-vs-b.png` | Option (a) vs (b), 4x |
| `r2-1x-armslength.png` | 1x arm's-length read |
| `r2-realtime-detent-frames.png` | Real-time frames around the detent |
| `r2-video-full.webm`, `r2-video-reduced.webm` (+ `-contact.png`) | Videos |

Scripts: `film2.js`, `test2.js`, `s2.js`, `measure2.js`, `screencast.js`, `video.js`.

**Harness artifact:** Chromium doesn't deliver touchmoves inside its roughly 15px tap slop, so in these films the lock lands at about 15px of finger travel rather than 10.

## Only an iPhone can confirm

1. Loose-thumb flick scrolls never stick. The non-passive listener costs no scroll distance, and a 34–45° drag scrolls.
2. Right-drags starting at x = 24–40 aren't claimed by Safari's back-swipe.
3. The grain reads as pencil, not as a rendering fault, on a 3x OLED. `feTurbulence` inside a mask and a filter under WebKit.
4. The ink landing reads beside a thumb in daylight.
5. No flicker at the hand-off (transform plus clip-path plus SVG mask in WebKit).
6. `color-mix()` in an SVG `fill` (iOS 16.2+).
7. The 80ms press delay feels like a press, not lag.
