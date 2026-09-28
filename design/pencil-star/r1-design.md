# Star action, round 1 (star2): the Pencil Star

**Pick: drag a row right, and a star is pencilled in before the place's name.**

When you drag a row to the right, the name slides aside. In the gap it leaves, a star is traced in graphite in one continuous stroke, in the exact spot where the printed Baedeker star will sit. At 56px it is **inked** (`--figure-deep`, with a small bloom). When you let go, the name settles against it.

The same stroke on a starred row does the reverse: it lifts the ink and rubs the star out, leaving three specks of eraser dust.

- One gesture, one meaning: the gesture toggles the star.
- Nothing shows on the row at rest.
- A tap still navigates, with **0 ms of added delay** (measured).
- `index.html` and the database were not touched.

On the owner's notes: Clear is only a benchmark for quality. This is not a Clear copy, and it is not a swipe-to-reveal. It was chosen on its merits:

- It is the fewest interactions possible (1).
- There is no chrome.
- The feedback is the mark itself, drawn where it will live.
- The metaphor comes from this app's own world: Baedeker readers pencilled their own stars into the margin, next to the printed ones.

---

## 1. Concepts

For every concept, the interaction count is measured from intent to done. The non-gesture path is always the popup star (tap the row, then tap the star: 2 taps, or 1 if the popup is already open).

### A. Pencil Star: horizontal drag on the row (**PICKED**)

- **Metaphor.** Annotating your own guidebook. Graphite means provisional; ink means committed.
- **Gesture.**
  - It arms only if the touch starts at x ≥ 24px from both screen edges, and not on `.delete-btn`.
  - Lock: after 10px of horizontal travel, provided |dx| > 1.5·|dy| (within about 34° of horizontal).
  - Hand-off to scroll: 8px of mostly-vertical travel first gives the touch to the scroller for good (`touch-action: pan-y`).
- **Thresholds.**
  - Commit when the content has moved ≥ 56px past the lock (66px of finger travel).
  - Or a flick: ≥ 32px of content at ≥ 0.5 px/ms over the last 80ms.
  - Past 56px, travel rubber-bands at ×0.35, capped at 104px.
- **While dragging.**
  - Name and meta follow the finger 1:1 (via `text-indent`, so the ellipsis stays live).
  - The row keeps its resting colour, not the pressed colour.
  - The pencil traces the `#g-star` outline, starting at the top point and running clockwise, with progress equal to travel/56. It is a 1px `--ink-2` stroke, the same weight as the popup's hollow star.
  - At the detent the pencil crossfades to a solid `--figure-deep` fill in 90ms, with a 200ms bloom (1 → 1.33 → 1, `cubic-bezier(.3,1.6,.5,1)`).
  - Backing off below 56px lifts the ink again.
- **Settle.**
  - 220ms `cubic-bezier(.2,.9,.3,1)`, with no overshoot, because overshoot would drive the name into the star.
  - The name lands at +16px (starred) or 0 (unstarred). Meta always returns to 0.
- **Mark left behind.** The existing printed row star. The pencil is drawn inside the printed star's measured box, so the hand-off is **0 differing pixels out of 2,916** (3x, paper and highlighted rows).
- **Undo.** The same stroke again, or the popup star.
- **Wrong way (drag left).** At most 6px of give, then it springs back. Nothing else happens.
- **Reduced motion.**
  - Anything the finger drives still follows the finger, because that is the user's own motion.
  - Nothing moves on its own: no bloom, no dust, no settle. Release lands in 0 ms.
- **Interactions.** 1 drag, about 150–250ms.

### B. Porter's Luggage Tag: swipe left to reveal a tag button (Mail done in our voice)

- **Gesture.**
  - Swipe left past 72px: the row slides left and reveals a navy luggage tag reading "★ MUST SEE". Tap it to star.
  - A full swipe past 60% of the width commits directly, and the tag stretches.
- **Undo.** Swipe again, and the tag reads "UNSTAR".
- **Reduced motion.** The tag appears without a slide.
- **Interactions.** 2 (swipe + tap), or 1 long swipe.
- **Rejected:**
  - It moves the row's content off-screen.
  - The revealed panel is chrome.
  - It opens on the delete side of the row.
  - It needs a second tap, or a long swipe (60% of 390 ≈ 234px).
  - It is the baseline, not better than it.

### C. Rubber Stamp: press and hold 450ms

- **Gesture.** An ink ring fills around the category badge while you hold. At 450ms the stamp thunks and the star lands. A move of more than 8px cancels.
- **Undo.** Hold again.
- **Reduced motion.** No ring animation; the star just appears at 450ms.
- **Interactions.** 1, but at least 450ms each.
- **Tap delay.** None for taps shorter than 450ms, but a slow tap (on a bus, with gloves) stars by accident.
- **Rejected:**
  - It is slower than A.
  - There is no affordance and no iOS web haptic. The iOS 18 switch-input hack was reportedly patched in 26.5.
  - It overloads the stamp metaphor, which already means *visited*.

### D. Conductor's Punch: double-tap punches a star through the ticket

- **Classic disambiguation.**
  - Every navigation tap must wait out the double-tap window before it fires: **+250–300 ms on every row tap**.
  - The prototype's tap goes from touchend to `highlightMarker` in 1.0 ms (baseline 0.9–1.2 ms), so this would be about a **250× slowdown** of the app's most frequent action.
- **Zero-delay variant.** Tap 1 navigates, and tap 2 within 300ms stars.
  - It has no delay, but it stars by mistake on impatient re-taps.
  - The popup only appears about 0.5s after the tap (the fly), which is exactly the window where people re-tap.
- **Interactions.** 2 taps.
- **Rejected.**

### E. Dog-ear: drag the row's top-right corner down-left to fold it

- **Rejected:**
  - The corner target is tiny.
  - It sits right beside delete, which is the owner's mis-tap history.
  - A diagonal gesture fights scroll.

Rough frames of B–E: `r1-alts-rough.png`.

### Why A wins

| | A Pencil | B Tag | C Stamp | D Punch |
|---|---|---|---|---|
| Interactions | **1** | 2 (or 1 long) | 1 | 2 |
| Time | **~0.2s** | ~0.6s | ≥0.45s | 0.3s |
| Tap delay | **0** | 0 | 0 | +250–300 ms (or mis-stars) |
| Chrome on the row | **none** | panel | ring | none |
| Near delete | **no (starts left, delete excluded)** | yes | no | no |
| Feedback is the mark | **yes, drawn in place** | no | partly | partly |

A is also the only concept whose in-progress state is legible as "not yet": a half-traced pencil star.

## 2. The Safari edge zone (measured from sources, not assumed)

- **Back and forward are edge-only by construction.**
  - WebKit's `ViewGestureControllerIOS.mm` builds the back/forward swipe from a `UIScreenEdgePanGestureRecognizer`.
  - On iOS, `HAVE_UI_PARALLAX_TRANSITION_GESTURE_RECOGNIZER` selects its subclass, `_UIParallaxTransitionPanGestureRecognizer`.
  - It is set with `edges = UIRectEdgeLeft` for back and `UIRectEdgeRight` for forward.
  - Sources: `raw.githubusercontent.com/WebKit/WebKit/main/Source/WebKit/UIProcess/ios/ViewGestureControllerIOS.mm`, lines 136–158, and `Source/WTF/wtf/PlatformHave.h`, line 539.
- **iOS 26 made back-swipe full-width in native apps, but Safari kept it edge-only** (MacRumors, 10 June 2025).
- **The width is private UIKit** (`_edgeRegionSize`).
  - UIKit debug dumps reportedly show 13pt. I could not verify this myself.
  - Common web practice guards 20px (pqina.nl, "Blocking navigation gestures on iOS 13.4").
- **Design response.**
  - The gesture never arms for a touch starting within **24px** of either edge. That is at least the 20px web guard and about 1.8× the reported 13pt.
  - If Safari still claims a touch, we get `pointercancel`, which reverts cleanly (tested).
  - Rows start their content at 56px, and a natural right-drag starts mid-row, so the guard costs nothing.
  - We never `preventDefault()` the touchstart, so Safari's own back gesture keeps working.

## 3. Conflict checks (Playwright, CDP `Input.dispatchTouchEvent`, 390px)

`test.js` → `r1-test.json`: **36/36** (17 cases × full and reduced motion, plus 2 baseline cases). The suite was run three times, all green.

| Case | Result |
|---|---|
| Star, and unstar with the same stroke | pass |
| Cancel at 20px and 50px of content, and past the detent then back to 20px | reverts; DOM restored; no navigation |
| Vertical scroll with 4px drift; diagonal 60x/100y | list scrolls; never stars |
| Tap | navigates; **touchend → highlightMarker 1.0–1.1 ms, same as baseline 0.9–1.2 ms → 0 ms added** |
| Sloppy tap (6px) | still navigates |
| Start at x = 12 (edge zone) | never arms |
| Drag starting on delete | nothing |
| Drag *ending* on delete | stars, never deletes |
| Flick (46px in about 60ms) | commits |
| `touchcancel` past the detent (Safari claims the touch) | reverts cleanly |
| Drag left | inert |
| Every row, at every drag step | 56.00px |
| Scroll, then tap | navigates. The `touchMoved` fix holds: the gesture never resets it, and a drag sets it, so the drag's click is dropped. |
| Popup star | 1 tap stars and plays pencil → ink |

Further notes on the checks:

- **A tap within about 30ms of a fling ends does not navigate.** It only stops the fling. Baseline `index.html` behaves identically, so this was not introduced here.
- **Sheet drag.** There isn't one: the sheet collapses via `#collapseBtn` only. If a drag handle is ever added, keep it on the header. Rows already hand vertical drags to the scroller.
- **Leaflet.** The list sits outside the map container, so no map handlers are involved. A row drag does not cancel a pending list-tap popup, which is deliberate: starring row B while row A's popup is flying in is fine.
- **Data.**
  - The gesture calls `toggleLocationFlag(id,'starred')` on release (optimistic).
  - `syncLocationCards()` skips re-rendering the dragged row until the settle lands, then renders the printed star at identical pixels.
  - If signed out or rejected, the row repaints the truth.

## 4. Measurements

- **Rows.** 56.00px at every step, in both motion modes.
- **Contrast, as the minimum across all 5 cities** (`measure.js` → `r1-measure.json`):

| Mark | Min ratio | City |
|---|---|---|
| Pencil `--ink-2` on paper / filed | 6.17 / 5.53 | all |
| Inked star on paper / filed | 4.79 / 4.30 | Stockholm |
| Highlighted row: paper pencil or ink | 4.79 | Stockholm |
| Eraser dust | ≥5.53 | all |
| Popup ink | 4.79 | Stockholm |
| Name while dragging | ≥13.17 | all |

  Every mark clears the 3:1 non-text bar, and all text is unchanged.
- **Thresholds against slop.**
  - The lock at 10px equals UIKit's pan hysteresis (about 10pt).
  - A 6px sloppy tap still navigates.
  - The commit, at 66px of finger, is 6.6× the lock.
- **Tap delay: 0 ms.**
- **Impeccable** (`npx impeccable@4.1.0 detect r1-proto.html`): **exactly the 3 baseline findings** (2× clipped-overflow-container, 1× cream-palette).

## 5. Files

All paths are under `…/scratchpad/loop/star2/`.

- **The prototype.**
  - `r1-proto.html` is `index.html` plus the gesture. It is built by `build.py`, and every change is anchored and asserted.
  - CSS: the "PENCIL STAR" block before `</style>`.
  - JS: `attachStarGesture`, `beginStarDrag`, `paintStarDrag`, `settleStarDrag` and `STAR_SWIPE`, placed before `stampTilt`.
  - Other changes: a 1-line hold in `syncLocationCards()`, and the popup's `popupInkId`.
- **Motion.**
  - `r1-video-full.webm` and `r1-video-reduced.webm` are real-time recordings at 390px covering star, unstar, cancel, wrong way, scroll, tap → fly + popup, and popup star. A blue dot marks the finger.
  - `r1-video-*-contact.png` are contact sheets of those recordings.
- **Filmstrips (3x).** `r1-film-star.png`, `r1-film-unstar.png`, `r1-film-cancel.png`, `r1-film-wrongway.png`, `r1-film-highlighted.png`, `r1-film-reduced.png`.
- **4x.** `r1-crops-4x.png` (the reading edge at 4x device pixels) and `r1-film-4x.png`.
- **Other concepts.** `r1-alts-rough.png`.
- **Harness.** `lib.js`, `test.js`, `film.js`, `crops4x.js`, `measure.js`, `video.js`, `contact.js`, `alts.js`.

## 6. Known issues and open calls

- **A brief press darkening at the start of every drag.** This is the existing touchstart press state; scroll does the same today. The existing fallback applies: an 80ms press delay.
- **The half-traced 12px pencil reads as a scribble mid-stroke** (see the 4x crops). This is intended ("being drawn"), but the CD should judge it at arm's length.
- **Discoverability.** The gesture is invisible by design. Options for the CD:
  - A one-time hint: the first time the popup star is used, the row it came from plays a 400ms ghost pencil.
  - Or no hint at all, since the owner asked for this gesture.
- **Sound** is proposed but not built: a 30ms synthesized pencil tick at the detent, using `navigator.audioSession.type='ambient'` so the silent switch mutes it. **Haptics** are not possible: the iOS switch hack reportedly stops working in 26.5.

## 7. What only an iPhone can confirm

1. Starting a right-drag at x ≈ 24–40px is not claimed by Safari's back swipe, and at x < 13 it is.
2. `touch-action: pan-y` plus the 10px lock feels instant, not sticky, and a vertical flick never catches a row.
3. The detent bloom and the ink colour read under a thumb, in daylight.
4. There is no flicker when the printed star replaces the pencil (WebKit rendering of `text-indent` transitions and the SVG dash).
5. The press darkening at drag start: tolerable, or does it need the 80ms delay?
6. The 1px pencil stroke looks like graphite, not like a rendering fault, on a 3x OLED.
7. The popup's pencil-to-ink plays once and doesn't replay on the post-write refetch.
