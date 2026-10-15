# Pencil Star, round 7: more drama on the pop and the angle, plus the "click"

The owner asked for:
> "more dramatic ... angle ... pop — getting slightly larger then going down to the correct size ... doesn't look intentional enough"

and then:
> "feel some sort of 'click' as the star completes being drawn" (unstar clicks too)

**What changed from main (`d298e5b` / `781d73e`, `index.html` untouched):**
- `r7-proposed.diff`: 8 hunks, 67 lines. It applies cleanly and yields `r7-proto.html`.
- `build7.py` builds the three variants; `build7h.py` adds the haptic to the pick.
- Nothing else changed.

## The pop and angle: three treatments at real timing

All three:
- replace the old 1.1× press plus one-frame 1.15× spread with a single overshoot-settle, played by the ink layer;
- are full ink on the first frame;
- use the same keyframes in the popup (CSS) and the row (WAAPI), so they stay one mark;
- remove scale and rotate under reduced motion (the ink simply appears).

| | Treatment | Timing | Sketch lean | Clearance at peak (row) |
|---|---|---|---|---|
| **A: pop** | 1 → **1.35** → 0.95 → 1.01 → 1, no twist | 300ms | −7° | name ≥6.6px, badge ≥10.6px |
| **B: twist-pop** | lands at the −12° sketch lean → +8° at **1.3×** → −3° at 0.96 → upright | 320ms | **−12°** | name ≥5.6px, badge ≥9.8px |
| **C: spin-stamp (PICKED)** | lands at **−20°** → **+6° at 1.4×** → −2° at 0.95 → upright | 340ms | **−12°** | name **≥5.6px**, badge **≥9.8px** |

Clearance is measured every frame (`pop7.js` → `r7-clearance.json`), at slow, natural and brisk swipes and on highlighted rows. In the popup, the peak star keeps **≥3.05px** from the title.

**Real-time strips (CDP screencast, every compositor frame from the ink firing):**
- `r7-{A,B,C}-landing-3x.png`
- `r7-{A,B,C}-landing-1x.png` (1x shown 2× nearest-neighbour)
- `r7-C-popup.png` (3x and 1x)

**Why C.**
- It is the only one that reads as *intentional* at phone size. A pop alone (A) is still "a bit bigger". B's 8° swing is lost at 18px.
- C's 26° swing, together with the 1.4× swell, reads as a stamp being pressed and twisted home. The eye catches it even at 1x.
- The steeper −12° sketch lean makes the "hand-drawn, then set straight in ink" contrast deliberate.
- Clearance stays comfortable, and the peak holds as crisp frames: about 3 frames above 1.3× in the strips, with no blur hang.

**Timing plumbing.** The printed-star hand-off, the teaching replay and the popup all wait `STAR_POP_MS` (340ms) + 20ms, so the pop is never cut off.

**Hand-off:** 0/5,184 pixels.

## The click (haptic): research, and what is actually possible

**Android (Chrome):** `navigator.vibrate` works.
- Star: 10ms.
- Erase: `[6, 45, 6]`, two soft ticks, a "rub".

**iOS Safari has no Vibration API.**
- The only hook is toggling a hidden `<input type="checkbox" switch>` through its `<label>`. The `switch` attribute needs iOS 17.4+, and the haptic needs iOS 18+.
- **From iOS 26.5 this is closed to script.** WebKit commit **fc1ef83** (bug 309082) makes a programmatic `label.click()` reach the switch as an *untrusted* click, and an untrusted click fires no haptic. Only a real finger on the switch or its label still does.
  - Sources: mxerf/tappt PR #5 (<https://github.com/mxerf/tappt/pull/5>) and tijnjh/ios-haptics (<https://github.com/tijnjh/ios-haptics>).
- **So this is not an activation-window problem.** Firing earlier (at the 56px crossing during `touchmove`, or at release) doesn't help: a swipe produces no trusted click at all, and a script click is untrusted whatever the timing.
- **iOS 18.0–26.4:** a script click does pulse, so the tick lands exactly on the finish beat.
- **iOS 26.5 and later:** it is silent. That is almost certainly the owner's phone as of September 2026.

**Built** (`starHaptic(kind)`), firing on the finish beats only:
- **Star:** one tick, in the **same frame the ink lands** (measured: ink at 375ms, vibrate at 376ms). This covers the row stroke, and the popup at 380ms.
- **Unstar:** at the commit beat, when the ghost vanishes and the dust falls.
  - Android: two soft ticks (`[6, 45, 6]`).
  - iOS ≤26.4: two switch toggles 60ms apart.
  - The switch's system tick can't vary in strength, so erase differs from star by rhythm only.
- **Fails silently:**
  - Everything is inside `try/catch`.
  - Desktop gets nothing.
  - The label is created lazily, fixed off-screen, 1×1, `clip-path`-hidden, 0 opacity, `pointer-events:none` and `aria-hidden`; the input has `tabindex -1`.
  - Focus is restored if the engine moves it.
- **Verified** (`haptic7.js` → `r7-haptic.json`): no layout shift, focus kept, never on screen, two switch clicks for erase, and the Android patterns fire at the right beats.

**Not built (option for the owner).** The one iOS 26.5+ path that still works is a *real tap on a label*. The popup star is a tap, so a transparent label over it could give a genuine tick at **tap time**, about 380ms *before* the ink lands. The row stroke is a swipe, so that path can never give it a click. This adds an overlay element to the popup and a second hit target, so I'd only do it if the owner wants the popup tap to click.

## Gate (on `r7-proto.html`)

| Check | Result |
|---|---|
| **84 + 8** | Touch suite **84/84** (both motion modes) and `flip6.js` **8/8**; its at-rest control fails 4/4, as designed |
| Popup-open | **20/20** |
| Dust over text | **0 frames** in 100 runs (the 5 cities, highlighted, long and short, visited, both modes, brisk) |
| Lift → name moving | ≤125ms |
| Rows | 56.00px |
| Tap delay | **0ms added** (1.1–1.6ms) |
| Hand-off | 0/5,184 px |
| Impeccable | **exactly 3** baseline findings |

## iPhone checks (new)

1. **The landing reads as deliberate at arm's length.** The ink appears twisted about 20°, swells, spins upright past its size, and settles, in roughly a third of a second.
   - Dial: peak 1.3–1.45×, twist −14° to −24°, 300–380ms.
   - It never touches the name or the category ring.
2. **The −12° sketch lean looks hand-drawn, not broken.** Dial back to −7° to −10° if needed.
3. **Click:**
   - Check the iOS version in Settings › General › About.
   - On **iOS 18.0–26.4**, a single tick lands exactly with the ink, and unstar gives a double "rub" tick as the dust falls.
   - On **iOS 26.5+**, no tick is expected: the platform blocks it. Say whether you want the popup-tap click instead (see above).
   - Either way, nothing appears on screen, VoiceOver announces nothing new, and focus never jumps.
