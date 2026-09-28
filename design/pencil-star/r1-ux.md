# Star action (star2), round 1: UX review of the Pencil Star

Reviewer: senior UX. I drove my own touch paths through CDP `Input.dispatchTouchEvent` against `r1-proto.html` at 390px, and compared against `/home/user/triplet/index.html` where a baseline matters.

- **Scripts:** `star2/ux-touch.js`, `ux-touch2.js`, `ux-touch3.js`, `ux-touch4.js`.
- **Also reviewed:** the designer's filmstrips (star, unstar, cancel, reduced).
- All numbers are Chromium's. What only WebKit can settle is listed at the end.

## Verdict

**Right concept. Approve the direction. It is not ready for the CD until S1–S3 are fixed.**

The Pencil Star is the best of the five concepts, and it meets the owner's bar:
- One stroke, with no chrome at rest.
- The feedback *is* the mark, drawn where it will live.
- A felt detent, plus the ability to back off and cancel.
- 0ms of added tap delay.
- A metaphor from this app's own world.

Three measured defects stand between it and "effortless", and none of them is conceptual:
- **S1:** a tap right after starring is swallowed.
- **S2:** there's a dark press-flash at the start of every stroke.
- **S3:** diagonal scrolls that the list handles today now go dead.

## Measured (my runs)

| Path | Result |
|---|---|
| Straight right-and-up drags of 100px at 20°, 25°, 30° and 33° from horizontal | star (these are horizontal swipes, so correct) |
| The same at 36° and 40° | **no star and no scroll (dead)** |
| The same at 50° | scrolls 70px |
| `main`, same drags at 36° / 40° / 45° | scrolls 0 / **58 / 65px** |
| Thumb arcs starting at 35°, 45° or 55° and bending to vertical (5 paths) | never star; the up-arcs scroll 156–161px |
| 12px sideways, then a 150px scroll up | proto **0px scroll** (the lock eats it); `main` 166px |
| Drag starting at x = 20 or 23 | inert |
| Drag starting at x = 25, 30 or 40 | stars |
| Drag starting 2, 6 or 10px left of the delete X, going right | nothing: no star, no delete (touch adjustment routes the touch to `.delete-btn`, which is excluded) |
| Stationary tap 3px left of the X | delete confirm. This is the pre-existing touch-adjust zone, not new. |
| Star, then tap a **different** row after 60ms | **no navigation** (`main` navigates at 60ms) |
| Star, then tap the **same** row after 60 / 250ms | **no navigation** (it navigates from about 450ms) |
| Press class during the stroke | `.active` stays on for finger travel 0–12px (about 50ms), then clears at the lock |
| Flick commits | 45–65px in 30–100ms all star. Unstar flicks are slightly inconsistent at the boundary (45px/60ms failed; 45/40 and 55/60 passed). |

## Answers to the ten questions

1. **Travel: 56px of content (66 of finger) is right.**
   - That is about 12mm on a 390pt iPhone: comfortably inside one thumb stroke for either hand, starting mid-row.
   - It is far less than a Mail full-swipe, and 6.6× the 10px lock.
   - Vertical scrolls and arcs never star. Only swipes flatter than about 34° star, which is intentional.
   - The problem is not accidental stars. It is **lost scrolls** (S3).
2. **Discoverability: needs one quiet teaching moment (S4).**
   - The owner knows the feature exists; Erica doesn't.
   - At rest there's nothing, which is correct.
3. **Undo and confirmation: good on a drag, risky on a flick (S5).**
   - The live eraser preview shows the result before release, and backing off cancels. That makes "same stroke unstars" clear.
   - A flick commits before the preview can be read.
4. **Delete safety: no new risk.**
   - Drags that start on or near the X do nothing, and drags ending on the X only star (the designer's test; consistent with a touch drag never producing a click on the X).
   - The only way to reach delete is still a stationary tap in its touch-adjust zone, which is pre-existing and backed by `confirm()`.
5. **Press darkening: real on every stroke.** See S2.
6. **Edge guard at 24px: correct.**
   - It is ≥ the 20px web convention and about 1.8× the reported 13pt system zone. It never `preventDefault`s, so Safari's back-swipe stays intact.
   - Starting inside the guard, the row simply doesn't respond. Since the natural start is on the name (x ≥ 56), almost nobody will feel it.
   - Don't add "give" there. Anything that moves the row would compete with Safari.
7. **Other interactions: fine, apart from S1 and S3.**
   - There is no sheet drag in `main`: the only row touch listeners are the passive press handlers, and the sheet collapses via a button.
   - The list sits outside the Leaflet container.
   - A row drag doesn't cancel a pending list-tap popup, which is fine.
   - Scroll-then-tap still navigates (the designer's case).
8. **Accessibility: acceptable.**
   - The popup star is a real toggle button with `aria-pressed`, so it is a complete non-gesture path. The web has no VoiceOver custom actions, so it has to be.
   - Reduced motion is handled correctly: motion the finger drives still follows the finger, and nothing moves on its own.
   - The `.sr-only` single source is unchanged.
9. **Map: 2 taps (pin, then star) is acceptable.**
   - After a list tap the popup is already open, so it's 1 tap there.
   - A map-side gesture (long-press on a pin) would fight Leaflet's drag and contextmenu for little gain.
10. **Rejected concepts: none beat it.**
    - **B** needs a second tap or a 234px swipe, and it reveals chrome.
    - **C** spends the stamp metaphor, which means *visited*, and is at least 450ms.
    - **D** costs +250ms on every tap, or mis-stars on re-taps.
    - **E** puts a target beside delete.
    - One thing to keep from the exploration: **leave the leftward stroke inert** (the 6px "no" give) and reserve it. Don't spend it on anything now.

## Findings

### Blockers

None.

### Should-fix

**S1. The next tap after a star is swallowed.**
- Measured:
  - A tap on another row 60ms after release does nothing, where `main` navigates.
  - A tap on the same row does nothing until somewhere between 250 and 450ms.
- "Star it, then open the next one" is the owner's exact flow, and a dead tap reads as "the app ignored me".
- **Two causes:**
  1. The 400ms `suppressClickUntil` window blocks the same row.
  2. Something during the settle/optimistic re-render blocks *other* rows; my guess is that a card touched mid-settle is re-rendered.
- **Fix:**
  - Replace the time window with a one-shot flag that eats only the drag's own click. Touch rows already drop it via `touchMoved`.
  - Make sure no row except the dragged one is replaced during the settle.
- **Re-test:** a star, then a tap at 0, 60 and 150ms on another row, and at 60 and 150ms on the same row, must all navigate.

**S2. A dark press flash starts every stroke.**
- `.active` (`--paper-pressed`) is on for the first ~12px (about 50ms) and then clears at the lock.
- So every star begins with a dark blink before the pencil appears.
- **Apply the 80ms press delay now, not as a fallback.**
  - Add `.active` after 80ms of no movement past the lock threshold.
  - If `touchend` arrives first, show the press for ~100ms on release, so quick taps still acknowledge.
- This also removes the same blink from flick-scrolls, which the owner's pending iPhone check asks about.

**S3. The dead zone for diagonal and sideways-starting scrolls.**
- `.location-card { touch-action: pan-y }` makes Chromium refuse any pan whose first movement is horizontal-dominant.
- Swipes at 36–45° now neither scroll nor star: `main` scrolls 58–65px at 40–45°, while the proto scrolls 0.
- A scroll that begins with 10–12px of sideways thumb travel is captured by the lock and goes nowhere (166px on `main` → 0).
- WebKit may behave differently, so **make this iPhone check #1.** Flick-scroll the list with a loose thumb 20 times; if even one sticks, fix it.
- **Fix (if needed):** drop `pan-y`; keep `touch-action: auto` and add a non-passive `touchmove` that calls `preventDefault()` only once the horizontal lock has engaged. This is the standard iOS-web swipe pattern.
  - **(a)** Also hand off to scroll whenever |dy| ≥ 8 before the lock, not only when |dy| ≥ |dx|, so the 34–45° band scrolls instead of dying.

**S4. Teach it once, in place.**
- The first 3 times a star is set **from the popup** while the list is visible, play a ~400ms ghost stroke on that place's (highlighted) row: the name eases 16px right, the graphite star traces, and it settles back.
- That demonstrates, on the actual row, "you can do this here".
  - It is gated by `prefers-reduced-motion`. Under reduced motion, show a one-line toast instead: "Tip: drag a place right to star it".
  - It runs per device (`localStorage`, try/catch).
  - After that, nothing: no permanent hint and no coach-mark.
- That covers Erica without cluttering any row.

**S5. Unstar requires the detent; a flick only stars.**
- The erase preview is what makes "same stroke unstars" safe, and a flick skips it.
- Removing something the owner "really cares about" is the costly direction, so let flick velocity commit **star** only.
- Unstar needs the full 56px, where the eraser dust has visibly happened.
- This asymmetry costs a few px on a rare action and removes the only unseen mis-unstar path.

### Nits

- **N1.** Mid-trace, the 12px pencil is a squiggle. That's fine while moving (it's under the thumb's motion and always resolves), but the CD should judge the 24–38px frames at arm's length.
- **N2.** Don't ship the pencil-tick sound. The owner didn't ask for it, and audio in a trip app used in quiet museums is a surprise. Revisit only if the detent doesn't read on-device.
- **N3.** Shape rows ignore the stroke entirely. That's correct (no column), but give them the same 6px "no" give as the wrong way, so a drag feels acknowledged rather than broken.
- **N4.** Mouse drags (desktop rail) have no edge guard. That's fine, but the one-shot click flag from S1 must cover mouse too.
- **N5.** Flick commit is slightly inconsistent at the boundary (see the table). It is acceptable, and moot for unstar once S5 lands.

## What only an iPhone can confirm

1. Diagonal and loose-thumb scrolling isn't sticky (S3). **This decides whether `pan-y` stays.**
2. A right drag starting at x ≈ 24–40 isn't claimed by Safari's back-swipe.
3. After S2, no dark blink at stroke start, and taps still visibly press.
4. After S1, star → immediate tap on the next place navigates.
5. The detent bloom reads beside a thumb in daylight, and the 1px graphite reads as pencil, not as a rendering fault.
6. The pencil-to-printed-star hand-off doesn't flicker (WebKit, `text-indent` plus dash animation).

---

# Round 2

Reviewer: senior UX. I verified `r2-proto.html` with my own CDP touch paths and mouse paths at 390px, comparing against `main` where a baseline matters.

- **Scripts:** `ux2-touch.js`, `ux2-flick.js`, `ux2-popup.js`.
- **Also reviewed:** the r2 filmstrips (star, unstar, teach, popup), the 4x mid-star/mid-unstar still, and the 1x strip.

## Verdict

**Ready for the CD. No blockers, and one should-fix.**

- All five round-1 findings (S1–S5) are fixed and hold up under my own paths.
- None of the regressions I checked for showed up.
- Mid-stroke direction is now readable in a single still.
- The one visible craft wart is the re-truncation "pop" on the final settle frame. See R2-S1.

## Verification (my runs)

| Check | Result |
|---|---|
| **S1**, touch: star then tap, 0 / 60 / 150ms, other row and same row | **6/6 navigate** |
| **S1**, mouse: drag-star then click another row, 0 / 60 / 150ms | **3/3 navigate** |
| **S2**, 50ms tap | Press shows on release at 71ms for about 100ms. Navigation fires at 73ms, so there is no delay. |
| **S2**, 300ms hold | Press at 113ms (80ms plus CDP latency) |
| **S2**, stroke | Never shows a press |
| **S3**, diagonal 34 / 36 / 38 / 40 / 45 / 50° | r2 scrolls 0 / 0 / 0 / 58 / 64 / 70px. **`main` is identical: 0 / 0 / 0 / 58 / 64 / 70.** None star. |
| **S3**, 12px sideways then up | r2 167px, `main` 156px |
| **S3**, plain vertical | r2 162px, `main` 161px |
| **S5**, full 80px stroke on a starred row | Unstars |
| Flicks | **Not testable in real time here.** CDP delivers a touchmove about every 45ms, so my "flicks" were really 0.2px/ms drags (`ux2-flick.js`). The designer's synthetic-timestamp cases are the only evidence. |
| Delete: drag starting 2 or 8px left of the X | No delete, no star |
| Delete: drag ending on the X | Stars, no delete |
| Plain tap on a row | Navigates |
| Popup-open fix, with the real `highlightMarker` | Row tap from z12 → Café Pascal's popup opens |
| Starring a row by stroke while its popup is open | The popup's star turns `aria-pressed=true` |
| Popup star rapid taps | 2 taps 120ms apart → the data follows each tap. 3 taps at 90ms → net one toggle. `aria-pressed` flips on the tap, not after the animation. |

## Answers

1. **The S1–S5 fixes:**
   - **Quick taps feel instant.** Navigation isn't delayed. The on-release press matches iOS table cells, where a short tap highlights on lift.
   - **The 80ms hold delay is right.**
   - **Diagonal scroll.** In my runs it matched `main` exactly; the designer's "up to 10px shorter" did not reproduce. Even 10px on a 60px fling is below what anyone would notice, and iOS momentum dominates. **Acceptable.**
   - **Teaching replay.** It is right: capped at 2 plays, only when the row is on screen, and it plays on the focus row (`r2-film-teach.png` shows it on highlighted Stockholm). The reduced-motion version (a static sketch, then the ink by opacity) is correct.
   - **Flick asymmetry.** It is clear enough. A flick on a starred row shows the rub starting and then springing back, which reads as "not far enough", not as "broken". The owner then drags a bit further. It is untestable in real time here, so it's an iPhone check.
2. **Direction mid-gesture: yes, it's clear.** Starring is crisp straight graphite strokes building an outline, which reads as a Λ by 12px. Unstarring is a *filled* star that greys, gets grainy and erodes inside a smudge. Outline versus fill separates them even at 1x (content 12–38 in `r2-1x-armslength.png`).
3. **Name slide:**
   - Moving the name as a block under a clip is the right fix: no per-frame re-truncation any more.
   - **The re-truncation on the last settle frame is visible** (R2-S1). In `r2-film-unstar.png`, "…of Pe…" becomes "…of Perfo…" between +170 and +220ms: three letters appear in the one frame where the eye has just come to rest. The star direction has the mirror effect, with letters vanishing at rest.
   - The hard clip also slices glyphs mid-air, 12px before the stamp or X (N-a).
4. **Graphite at 1x: 3.67 is legible enough.** By content 25–50 the 1x marks read as a star. The owner's iPhone is 3x (4.96–5.53), so 1x only matters on a desktop rail. Accept it.
5. **Popup star: doesn't slow repeated use.**
   - The state (`aria-pressed`, data) flips on the tap, the animation doesn't block further taps, and it plays once.
   - The only cost is visual: the ink lands at 220ms.
   - **Nit:** at tap +0 the hollow star vanishes and the slot is empty until the first stroke at 40ms (N-b).
6. **Regressions: none.**
   - Row tap navigates, the popup-open fix opens popups, and delete can't be triggered by a stroke.
   - There's still no sheet drag.
   - The scroll-then-tap behaviour is intact (S1 matrix).

## Findings

### Blockers

None.

### Should-fix

**R2-S1. Move the re-truncation to release, not to rest.**
- At `touchend`/commit, swap the row into its final layout straight away: printed star in or out, final truncation.
- Then animate the name from the dragged offset to 0 (FLIP: measure, invert, play).
- The text then changes on the frame the finger lifts, when the name is moving fastest, instead of on the settled frame.
- **Re-shoot `r2-film-unstar.png`.** The last 3 frames should show identical glyphs.

### Nits

- **N-a.** Feather the clip edge with an 8px `mask-image` gradient instead of a hard `clip-path`. The name should read as slipping *under* something, not being sliced in mid-air.
- **N-b.** Popup: keep the hollow star until the first graphite stroke appears, or start stroke 1 at 0ms, so there's no empty-slot frame on tap.
- **N-c.** The non-passive `touchmove` sits on every row. It is fine in Chromium (scroll distances match `main`). On iOS, confirm there's no scroll jank on a 190-row list.

## Carry-forward iPhone checks (additions)

1. `touchmove` stays cancelable for a horizontal stroke in iOS Safari, so the lock and `preventDefault` actually engage. This is **the #1 check**; if it fails, the gesture never arms.
2. A real flick (not a drag) stars, and a real flick on a starred row springs back.
3. After R2-S1, no letter pop at the end of the settle.
4. A quick tap's on-release press reads as a press, not a flash.

---

# Round 3

I re-ran my own scripts against `r3-proto.html`, as copies re-pointed at it (`me3-ux2-touch.js`, `me3-ux2-popup.js`), not the designer's `r3-ux2-*` copies. I also wrote a new FLIP and feather probe (`me3-flip.js` → `me3-flip-*.png`).

## Verdict

**Approve. No blockers and no should-fixes.** R2-S1 and N-b are fixed. N-a is fixed as the feathered mask.

## Verified

| Check | Result |
|---|---|
| **FLIP (R2-S1)** | Long visited names, star and unstar: the row crop at release +200ms and +260ms is **byte-identical** to +600ms. The final truncation ("…of Perfo…") is already in place by +120ms, while the name is still sliding, so no letters change at rest. The drag's `h3` is replaced on the release frame, as designed. |
| **Feather (N-a)** | `.row-main` computed `mask-image: linear-gradient(to right, #000 calc(100% − 8px), transparent)`. The +5ms frame shows the name fading under the edge, not sliced. |
| **Taps after a star (S1)** | Touch: other and same row at 0 / 60 / 150ms, **6/6 navigate**. Mouse: 0 / 60 / 150ms, **3/3 navigate**. |
| **Press (S2)** | A 50ms tap presses on release (58ms) for 100ms; navigation at 59ms. |
| **Diagonal (S3)** | 34–50°: r3 scrolls 0 / 0 / 0 / 58 / 64 / 70px; `main` 0 / 0 / 0 / 58 / 64 / 71px. Sideways-then-up: 166 vs 167px. Plain vertical: 156 vs 163px (run-to-run noise; round 2 measured 162 vs 161). No stars. |
| **Delete** | A drag starting 2 or 8px left of the X: no delete, no star. A drag ending on the X: stars, no delete. |
| **Popup** | Row tap → popup opens. A row stroke updates the popup star. Rapid taps each register. |
| **Flicks** | Still untestable in real time here (CDP delivers a touchmove about every 45ms). The designer's synthetic-timestamp cases stand. |

## The 16px clearance

**It isn't late or unresponsive.**
- The name starts moving 1:1 at the lock, so the row answers the finger immediately. The pencil is the *second* layer of feedback, not the first.
- The first graphite appears at content 16, which is about 26–31px of finger travel including the lock. That is under 40% of the way to the 56px commit. The Λ is complete by content 24.
- The clearance buys a clean first stroke that never collides with the name's first glyph (a 4.23px minimum gap). That's worth more than an earlier squiggle.

## The rub-out ghost at 1.41–1.51:1

**Not a usability problem.**
- It is a transient preview under a moving finger, not a state. Nothing has to be read from it to decide or complete anything.
- Its low contrast *is* its meaning: "almost gone".
- WCAG 1.4.11 is about the contrast of UI components and of graphics needed to understand content. Both resting states pass: the printed star is ≥ 4.30:1, and "no star" leaves only the name.
- One thing to confirm on the iPhone: that the unstar **commit moment** (the ghost vanishes and the dust falls at 56) is noticeable in daylight. The ghost going to nothing is a small visual change. The name's position and the dust carry it, and backing off still restores the ink, so a missed cue costs nothing.

## iPhone checks (additions)

1. No flicker from `mask-image` on a transformed child, and the FLIP swap on release is invisible at 120Hz.
2. The unstar commit cue (ghost to gone, plus dust) is noticeable in daylight.

---

# Round 4 (the owner's iPhone feedback: too fast, too pointy, size/placement)

I verified `r4-proto.html` with my own scripts:
- **New:** `me4.js` (honesty, commit cue and repeated starring) and `me4-edge.js` (edge guard and popup).
- **Re-pointed:** `me4-touch.js`, which is `ux2-touch` aimed at r4.

CDP delivers a touchmove about every 45ms here, so the absolute times below include that latency. The *relative* ordering is what matters.

## Verdict

**Approve the direction:**
- the hand-speed pen;
- the S1 soft star;
- P1, subject to the owner's on-device look.

**Two should-fixes**, both side-effects of the pen now trailing the finger:
- **R4-S1:** the commit cue now arrives late.
- **R4-S2:** a quick second star on another row is dropped.

## Verified

| Check | Result |
|---|---|
| **Honesty: fast release at finger 55 / 62px** (content < 56) | Never inks, never stars. Timeline empty. |
| **Honesty: fast release at finger 68 / 72 / 90px** | Stars. Ink lands **after** release (~545–596ms from touch start), and the printed star follows ~165ms later. |
| **Fast to 90, back to 40, release** | No ink, no star |
| **Fast to 90, hold 150ms, back to 40** | Ink appeared while held (482ms), lifted on back-off (566ms); no star. Honest. |
| **Fast to 90, hold** | Ink at 482ms, about 300ms after the finger crossed the commit (see R4-S1) |
| **Taps after a star** | Touch: other and same row at 0 / 60 / 150ms, **6/6 navigate**. Mouse: **3/3**. A tap on the same row while its pen is still finishing navigates. |
| **Press** | 50ms tap: press on release, navigation at 71ms. 300ms hold: press at 110ms. |
| **Diagonal** | r4 scrolls 0 / 0 / 0 / 58 / 65 / 71px at 34 / 36 / 38 / 40 / 45 / 50°; `main` 0 / 0 / 0 / 58 / 64 / 70. Sideways-then-up: 164 vs 165px. |
| **Edge** | x = 20 or 23 inert; x = 25 or 30 stars |
| **Delete** | A drag starting 2 or 8px left of the X: nothing. A drag ending on the X: stars, no delete. |
| **Popup** | Star `aria-pressed` and data flip on the tap (+30ms). A second tap 30ms later flips back. The 380ms draw never blocks a tap. |
| **Repeated starring** | Star row 0, then stroke row 3 after 100 / **250** / 400 / 600ms → row 3 stars **no / no / yes / yes**. The dropped strokes don't navigate either: the stroke is simply dead. |

## Answers

1. **Honesty: yes, it holds.** The pen never runs ahead of the finger. A release short of 56 never shows ink, and ink never lands for an uncommitted stroke. Finishing after release is honest, because the result was decided at release.
   - **But the threshold is no longer *felt*** (R4-S1). With the pen trailing, a stroke released at 62px and one released at 72px look identical under the finger: both show a partial sketch. The difference appears only after lift-off, when one retracts and the other completes. The only live threshold cue is the ×0.35 rubber-band past 56, and that is subtle.
2. **360ms+ for repeated starring.** The duration itself isn't slow: taps navigate at once, and the draw runs in the background. The **~250–400ms dead window for the next stroke** is the real cost (R4-S2). Going down a list starring several places is exactly the owner's flow.
3. **P1 vs P0: recommend P1.**
   - The 18px star at a fixed x is the strongest scan signal of the options, and it matches the gesture (both lines move).
   - The badge is a ringed glyph and the star an un-ringed filled shape, so the two icons read as different kinds of mark. On restaurant rows they share a hue family, but the shape separates them (as in round 1).
   - **The real cost is a ragged text edge:** starred rows' whole text block starts 26px further right. Because stars are scarce, that reads as an intentional call-out (the guidebook convention), not misalignment. It would stop working if the owner starred most places.
   - The truncation cost (+2 unvisited; +8 at 375 and +10 at 390 visited, of 193, worst case with every row starred) is acceptable.
   - The owner judges it on device; P0 remains the one-file fallback.
4. **Popup at the new pace: fine.** The state is immediate, and 72ms strokes plus ink at 380ms read as drawing without delaying anything.
5. **Scroll, flick and edge: unchanged.** Flick is still untestable in real time here.

## Findings

### Blockers

None.

### Should-fix

**R4-S1. Give the commit a live cue again.**
- Keep hand speed *before* the threshold. Once finger travel crosses 56, have the pen **finish its remaining strokes within ~120ms**, and let the ink land then.
- A slow drag still shows ≥ 360ms of drawing. A fast one still shows ≥ ~200ms of strokes (the owner's "can't see it" is solved) plus a visible acceleration into the ink.
- The ink goes back to meaning "you're past the line", close to when you crossed it: about 120ms instead of about 300ms.
- Backing off still retracts.
- **Measure:** time from crossing 56 to the ink frame; target ≤ 150ms.

**R4-S2. Never drop a stroke because the previous row is still finishing.**
- When a new row locks, fast-forward the previous row: finish its pen, ink and settle instantly, then run the FLIP to final.
- Don't refuse to arm the new row.
- **Re-test** the 100 and 250ms cases above. Both must star.

### Nits

- **N4-a.** On a starred **restaurant** row in P1, check the 18px `--figure-deep` star beside the orange fork ring at 1x in daylight. It is the one place where the two left icons could merge.
- **N4-b.** The unstar hold (the name waits until the dust falls, ≥ 400ms) should be judged on device. If it feels stuck, let the name start home at dust-fall minus 100ms.

## iPhone checks (additions)

1. At a natural swipe, the star is visibly drawn stroke by stroke.
2. After R4-S1, you can tell during the stroke when it has gone far enough.
3. Starring three rows in quick succession: every stroke lands.
4. P1 next to the category glyph reads as one entry, not two competing icons. If not, ship P0.

---

# Round 5 (pressure commit, black ink star, R4-S2, N4-b)

I checked `r5-proto.html` with my own scripts:

| Script | What it covers |
|---|---|
| `me5.js` | Pressure cue, repeated strokes, N4-b |
| `me5b.js` | Three quick strokes on visible rows |
| `me5-flip.js`, `me5-flip2.js` | Frame-by-frame FLIP audit |
| `me5-touch.js`, `me5-edge.js` | Regression suite, re-pointed at r5 |

## Verdict

**Approve. No blockers and no should-fixes.**

- The CD's pressure ruling solves R4-S1 better than my proposal did: the threshold becomes legible without shortening the drawing.
- The test re-spec is legitimate. I checked it independently (§4).

## 1. Pressure commit cue

- **Same event.** A document listener, running *after* the row's handler in the same `touchmove` event, sees `.sg-press` on the first event whose travel crosses 56:
  - finger 72: the event at x = 242 (dx 72) is the first pressed one;
  - finger 62: never pressed, never starred.
- **Nothing is inked before commit.** `.sg-press` is present at release only when the stroke commits.
- **Pre-release legibility.**
  - `r5-62-vs-72.png` shows a clear light/heavy difference at 3x and 4x.
  - More importantly, the user sees the *change*: a stroke visibly darkens in one frame as it crosses. Change-detection doesn't need a remembered reference.
  - At natural and brisk speed the sketch is still mid-draw at the crossing (≥ 17 sketch frames, per the designer's metrics), so the darkening lands on visible strokes, not on an empty slot.
- The 3px detent adds the felt beat.
- **Verdict:** a committing stroke now reads differently from a failing one *before* lift-off.

## 2. R4-S2: fixed

| Test | Result |
|---|---|
| Second stroke on another row at 0 / 100 / 250 / 400ms | **4/4: both rows star, both end printed**, no stray navigation, no overlay left behind |
| Three strokes on three visible rows, 0ms and 150ms apart | 3/3 each time |

(One harness run used an off-screen row 5; that was my mistake, and the re-run used visible rows.)

## 3. N4-b: fixed

- On an unstar with a natural swipe, the name starts home **56ms after lift**, where round 4 held it about 300ms.
- The first eraser speck is already visible at release (it dropped at the crossing), and 3 specks peak as designed.
- Nothing reads as stuck.

## 4. The skeptical check: the FLIP re-spec is legitimate, not a masked regression

I did not rely on `flip5.js`. Its "moving" test only checks that the transform isn't `''`, which would pass a still, offset name, and under reduced motion it passes trivially. Instead I logged every rAF frame: the `h3` node identity, `clientWidth` and `scrollWidth`, the printed-star visibility, and the computed translateX.

**Star (long visited, and short):**
- The only re-layout (cw 194 → 168) happens at tx ≈ 38px, with **13 more frames of motion after it**. That is 216ms before rest.
- The only change on the rest frame is the overlay → printed star swap, which is the pixel-identical hand-off (0/5,184). No glyphs change.

**Unstar (long visited):**
- The re-layout (cw 168 → 194) happens as the name *starts* home.
- The raw tx jumps 63.9 → 89.9 on that frame. That jump is the FLIP compensating the removed 26px slot, so on screen the name is **still** on that frame and starts moving on the next. That is exactly why "only while moving" had to be re-specified.
- **I checked whether the swap is visible** (`me5-flip2.js`):

| Stroke | Old truncation edge | New truncation edge | Mask fade starts at |
|---|---|---|---|
| Unstar | x = 314 | x = 340 | x = 242 |
| Star | x = 314 | x = 288 | x = 242 |

- Both edges are **fully under the feathered mask**, and the text's left edge is unchanged (146 → 146).
- So the only glyphs that change are the tail letters, which are invisible at that moment. The visible letters are identical. Then there are 13 frames of motion and 216ms before rest.

**This holds in general.** The margin under the mask is (name offset at the swap) − about 18px. Star swaps happen at ~38px and unstar swaps at ~90px, so both clear it. Under reduced motion everything lands in one frame by design.

**Conclusion:** letters never change on the frame the eye comes to rest, for star or unstar, long or short names. The old assertion (re-render on the release frame) no longer matches the choreography, because of the unstar hold and N4-b. The new rule is the one that actually protects the user.

**Suggestion (N5-a):** replace `flip5.js`'s check with the two measurements above: no signature change within the last 3 motion frames, and any truncation edge change lying under the mask.

## 5. Light pencil at 3.28:1 (1x): legible

- In `r5-1x.png`, the Λ reads from about 150ms and the star from about 250ms.
- It is transient and never the committed state. On commit it jumps to the pressed graphite (9.44:1 as a token).
- The owner's 3x screen gets ≥ 3.84.
- Accept.

## 6. The black ink star: reads as "I care", and does not recede

- At 14.69:1 it is the highest-contrast mark in the row. It reads as typography ("★ Name"), not as a second badge.
- **On starred restaurant rows in all 5 cities** (`r5-restaurant-5cities-3x/1x.png`), it separates cleanly from the orange fork ring. The Stockholm merge and the Copenhagen clash of round 4 are gone.
- Next to the navy VISITED stamp on starred+visited rows, the shapes are distinct.
- If anything it is now the loudest mark on the left. That's appropriate while stars stay scarce; if the owner finds it heavy, the CD's `--ink-2` fallback is the dial.

## 7. Regressions: none

| Check | Result |
|---|---|
| Taps after a star | 6/6 touch, 3/3 mouse |
| Press | 50ms tap: press on release, navigation at 61ms |
| Diagonal 34–50° | r5 0 / 0 / 0 / 58 / 65 / 70px; `main` 0 / 0 / 0 / 57 / 64 / 70 |
| Sideways-then-up | 166 = 166 |
| Edge | x = 20 or 23 inert; x = 25 or 30 stars |
| Delete | Safe: a drag from near the X does nothing; a drag ending on the X stars only |
| Popup | Row tap → popup opens (real `highlightMarker`); popup star flips on each tap within 30ms |

## iPhone checks (additions)

1. The pressure step is visible under the thumb at the crossing (dial 1.3–1.5×), and the 3px catch is felt, not seen as a glitch.
2. Three quick stars down the list all land, each visibly inking.
3. The black star next to the category ring reads as one entry.

---

# Round 6 (dust swept into the gutter, a faster unstar release, `flip6.js`)

## Verdict

**Approve. No findings.**

## 1. Regressions: none

My round-5 scripts, re-pointed at `r6-proto.html` (`me6-touch.js`, `me6-edge.js`, `me6-main.js`):

| Check | Result |
|---|---|
| Taps after a star | 6/6 touch, 3/3 mouse |
| Press | 50ms tap: press on release, navigation at 68ms |
| Diagonal 34–50° | r6 0 / 0 / 0 / 58 / 65 / 70px = `main` 0 / 0 / 0 / 58 / 65 / 70 |
| Sideways-then-up | 166 vs 167px |
| Delete | Safe |
| Edge | x = 20 or 23 inert; x = 25 or 30 arm |
| Popup | Opens from a list tap; the star flips on each tap |
| Pressure | Applied in the crossing event; a 62px stroke never pressed or starred |
| Second stroke at 0 / 100 / 250 / 400ms | 4/4 |
| N4-b | The name leaves **12ms** after lift (round 5: 56ms) |

The "three strokes" row-5 miss is my known off-screen-row harness artifact from round 5, not a regression.

## 2. Dust over text: 0

`me6-dust.js` checks every rAF frame for any `.sg-crumb` with opacity > 0.05 whose box overlaps the stroked row's h3 or meta **text** (Range) box. It is independent of the designer's `dust6.js`.

- **Coverage:**
  - long visited, normal and **highlighted** (Stockholm, LA brisk);
  - short, normal (Reykjavík) and **highlighted** (Copenhagen);
  - a Malmö slow stroke.
- **Result: 0 over-text frames in 6/6 runs.** Every run unstarred, with 18–21 speck frames each.
- **The detector is sensitive.** The same script on `r5-proto.html` flags 6 over-text frames on the LA brisk highlighted run.

## 3. `flip6.js` does fail on an at-rest swap

I ran it myself. The real cases pass 8/8 (4 rows × 2 motion modes; swaps sit 12–13 frames before the last motion). **The negative control fails 4/4:**
- It overrides `flipToFinal` to slide the *old* row home and then `renderCard` at the end.
- It reports "swap within the last 3 motion frames" and "0 motion frames after swap".

So the new proof can detect the defect it guards against. That resolves my round-5 N5-a.

## 4. The suite going from 88 to 84: legitimate

`diff test4.js test6.js` shows exactly one removed block: the R2-S1 FLIP case, which ran on 2 rows (star long visited, unstar long) in 2 motion modes. That is **the 4 cases**.

- That was the obsolete "laid out on release, same h3 node at rest" assertion. It froze `sgNow` and couldn't see the post-round-4 choreography. It's the one that failed in round 5.
- The case log diff confirms that nothing else was dropped. The other line differences are only measured values in case titles (the S2 ms and S3 scroll px), whose counts are unchanged.
- It is **replaced by a superset**: `flip6.js` covers 4 rows (adding short star and short unstar) × 2 modes = 8 frame-by-frame cases, plus a failing negative control.
- **One condition:** the reported total should read "84 + 8 (`flip6.js`)" wherever it's summarised, so the FLIP proof stays in the gate and isn't quietly dropped.

---

# Round 7 (the C spin-stamp, the −12° sketch lean, the haptic tick)

**Scripts:**
- **New:** `me7.js` and `me7b.js` (popup clearance, reduced motion, haptic element).
- **Re-pointed:** `me7-touch.js`, `me7-edge.js`, `me7-main.js` and `me7-dust.js`, i.e. the round-6 set aimed at r7.

## Verdict

**Approve the motion. Two small should-fixes, both in `starHaptic()`.**

## Motion

| Check | Result |
|---|---|
| **Popup clearance, peak frame** (ink element rect, every rAF, 32 ink frames) | Title **3.06px**, category glyph and word 7.35px, Visited ring 27.7px (one-line title) or 47.7px (two-line). Peak scale 1.4, peak rotation 20°. |
| **Taps after a star during the bigger pop** | Touch at 0 / 60 / 150ms, other row and same row: **6/6 navigate**. Mouse: **3/3**. The pop never delays or eats a tap. |
| **Reduced motion, popup** | Scale 1.00, rotation 0° |
| **Reduced motion, row stroke** | Scale 1.00. The only rotation seen is the static −12° sketch lean, not the spin. |
| **Regressions** | S2 press, S3 diagonal (r7 0 / 0 / 0 / 57 / 65 / 69 vs `main` 0 / 0 / 0 / 58 / 65 / 70), sideways 169/168, delete safe, edge 20/23 inert and 25/30 arm, popup taps, pressure cue at the crossing event, second stroke at 0–400ms 4/4, **dust over text 0/6 runs**, lift → name moving 57ms. |

**On the 3.06px popup clearance.** It is measured from the axis-aligned box of a rotated star, so the true ink-to-glyph gap is larger. Nothing touches or overlaps, so it is **acceptable**. **N7-a:** if the owner finds the popup crowded at peak, dial the popup to 1.35× only.

## The haptic element

I forced the iOS path by removing `navigator.vibrate`. That matters, because Chromium has `vibrate`, so the switch code never runs in a default Playwright run.

| Check | Result |
|---|---|
| Invisible | Yes: at (−9999, 0), 1×1, clip-path, opacity 0 |
| No layout shift | Yes: scroll size unchanged |
| Accessibility tree | Not present (the Playwright snapshot with `interestingOnly:false` has no switch or checkbox node from it) |
| Scroll after a tick | 169–172px. The ios-haptics "touch starts on the element" issue can't happen here, because the element is off-screen with `pointer-events: none`. |
| Toggles | Star 1, unstar 2 (the double tick) |

**Should-fix 1: R7-S1, focus is stolen when nothing was focused.**
- After a row stroke, `document.activeElement` went **BODY → the hidden INPUT**.
- The restore only runs `prev.focus()`, and `body.focus()` is a no-op, so the off-screen, `aria-hidden` checkbox keeps focus.
- That is focus on an `aria-hidden` element, and a keyboard or switch-control user's next Tab starts from the end of `<body>`.
- With the popup star focused, focus was preserved correctly.
- **Fix:** after the click, `if (document.activeElement === input) input.blur()`, then restore `prev` if it is focusable.

**Should-fix 2: R7-S2, each tick dispatches 2 synthetic clicks that bubble to `document`** (4 for an erase: LABEL (synthetic), then INPUT).
- `document` has two global click listeners:
  - one that closes the account dropdown on an outside click;
  - one that hides the add-form autocomplete.
- A haptic tick can therefore close either of them.
- On desktop Safari (no `vibrate`, no `switch` haptic) the click still runs silently, with the same side effects.
- **Fix:** a capture-phase listener on the label that calls `e.stopPropagation()` for both the label click and the input's activation click.
- **Verify:** 0 document-level clicks per tick.

## Carry to the iPhone

The designer's list stands, plus:
1. On **iOS 18.0–26.4**, after a tick, an open account dropdown stays open (after R7-S2), and external-keyboard Tab continues from the row (after R7-S1).
2. On **iOS 26.5+**, no tick is expected, as the designer's research says.

---

# Round 8 (re-cut pop, the popup origin, R7 fixes, the popup real-tap haptic)

**Scripts:**
- **New:** `me8.js`.
- **Re-pointed:** `me8-touch.js`, `me8-edge.js`, `me8-main.js` and `me8-dust.js`.
- The iOS path was forced by removing `navigator.vibrate`.

## Verdict

**Approve. No blockers and no should-fixes.** R7-S1 and R7-S2 are fixed.

## Checks

| Check | Result |
|---|---|
| **Popup star, touch tap** (CDP) | Toggles; `aria-pressed` follows; **exactly 1** switch toggle |
| **Popup star, mouse click** | Toggles; 1 toggle |
| **Popup star, keyboard** (Enter, then Space on the focused button) | Toggles each time. 0 toggles, which is correct: no tick for keyboard. Focus stays on the button. |
| **Accessibility tree of the popup** | `button "Star" pressed=false`, `button "MARK VISITED"`, `link "Get directions"`, `button "Close popup"`. **No label, no checkbox.** |
| **Hit-map** | Star (label + button) 1,980px = 44×45, unchanged. **Dead band to Mark Visited: 7 clear rows (8px geometric)**, unchanged. The star's box over the title's first glyphs: 112px, the known and accepted N1, unchanged. |
| **Taps** | A tap at Mark Visited's top edge toggles Visited, not the star. A tap mid-title toggles nothing. |
| **Document clicks** | Row swipe on the iOS path: **0 document clicks** (star: 1 switch toggle; unstar: 2). The account dropdown stays open. |
| **Focus after a swipe** | BODY → BODY: never the switch |
| **Popup tap** | The only document click is the forwarded Star-button click, the same as a direct tap on `main` |
| **Taps after a star (longer pop)** | 6/6 touch at 0 / 60 / 150ms, other and same row; 3/3 mouse. The pop never delays a tap. |
| **Regressions** | None: S2 press, S3 diagonal (0 / 0 / 0 / 58 / 64 / 69 vs `main` 0 / 0 / 0 / 58 / 65 / 69), sideways 165/166, delete safe, edge 20/23 inert and 25/30 arm, pressure at the crossing event, second stroke 4/4, dust over text 0/6, lift → move 58ms |

## Nits

- **N8-a. Focus after a mouse or touch toggle is `body`, not the button.**
  - The overlay forwards the click programmatically, so the button no longer takes focus on a pointer click. With round 2's refocus, a pointer toggle used to leave focus on the button.
  - Keyboard users are unaffected (focus stays on the button). Touch doesn't need focus.
  - A desktop mouse user who clicks and then presses Tab starts from the document. Low impact. Optionally, call `btn.focus({preventScroll:true})` in `popupStarTap()` when `pointerType === 'mouse'`.
- **N8-b. VoiceOver double-tap** activates at the button's centre, where the hit test lands on the `aria-hidden` label, which forwards the click. It should toggle exactly once; confirm on the iPhone with VoiceOver on (**new iPhone check**).
