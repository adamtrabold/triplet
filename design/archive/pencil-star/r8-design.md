# Pencil Star — round 8 (perfection stage)

Option C (spin-stamp) is unchanged in concept. This round fixes its timing, sets the popup peak, fixes the haptic, and adds the owner-approved popup real-tap haptic.

## 1. One curve, real timing

**Cause.** In round 7 the effect-level ease-out was applied over the whole animation's progress. That compressed the drama into about 90ms.

**Fix.**
- The row (WAAPI) now uses `easing: 'linear'` on the effect, with each keyframe segment carrying its own easing.
- The popup's `@keyframes sgpPress` uses the same table through per-keyframe `animation-timing-function`, with `linear` on the animation.

The shared table (`STAR_POP_MS` = 380):

| Offset | Rotation | Scale | Easing into the next segment |
|---|---|---|---|
| 0 | −20° | 1 | `(.2,.9,.3,1)`: swell fast, then hang at the peak |
| .34 | +6° | peak | `(.6,0,.85,.45)`: leave the peak slowly, then drop |
| .65 | −2° | 0.95 | `(.4,0,.3,1)`: settle |
| 1 | 0° | 1 | — |

The peak scale is 1.4 on the row and 1.35 on the popup (N7-a).

Measured in-page, per rAF at 60Hz, in real time (`curve8.js` → `r8-curve.json`):

| | Frames ≥1.3× | Frames ≤0.97 | Peak | Undershoot | Rest |
|---|---|---|---|---|---|
| Row (normal and highlighted) | **11** | **3** | 1.40 at 100–117ms | 0.95 at 233ms | 350ms |
| Popup | **8** | **3** | 1.35 at 117ms | 0.95 at 250ms | 367ms |
| Round 7, for comparison | 2 | 2 | — | — | 267ms |

**Clearance at the peak:**
- Row: name ≥4.68px, badge ≥8.91px.
- Popup title: **4.41px** (it was 3.05px at 1.4×).
  - To get there, the popup ink's `transform-origin` is set to 70% 55%, so the swell grows away from the title.
  - That origin was measured, not assumed: 50% gives 3.44px, 30% gives 2.47px, and 70% gives 4.41px.
  - The resting star position is unchanged.

**Strips** (real compositor frames, t=0 is ink):
- `r8-row-landing-3x.png` and `r8-row-landing-1x.png`
- `r8-popup-landing-3x.png` and `r8-popup-landing-1x.png`

## 2. Haptic fixes (swipe path; `haptic8.js` → `r8-haptic.json`)

**R7-S1 (focus).** After each tick:
- If the switch took focus, it is blurred.
- `prev` is restored only if it is focusable and is not `body` or the switch.

Tested from body, from a focused row (delete button) and from the popup star. The switch was the active element on **0** frames, and focus returned to where it started.

For comparison, r7 left focus on the switch for 12 frames when starting from body.

**R7-S2 (propagation).** All clicks made by the switch machinery are stopped at **window capture**, the first hop, with `stopImmediatePropagation`. The switch still toggles, because activation ignores propagation.
- Document-level clicks per tick: **0**, in both capture and bubble phases. r7 had 18 per 3 ticks.
- The account dropdown and the address autocomplete **stay open** across a real star swipe and a real erase swipe. In r7, both closed.

**Reduced motion.** Haptics still fire:
- Android: `10` for star, `[6,45,6]` for erase.
- iOS: 1 switch toggle for star, 2 for erase.

## 3. Popup real-tap haptic (owner decision)

**How it works.**
- `.popup-star-tap` is an `aria-hidden` `<label for="starHapticSwitch">` placed exactly over the star's 44×44 `::after` box, at `z-index:202`.
- A finger's tap on the star is therefore a **trusted** label click, and the switch toggles from it. This pattern still ticks on iOS 26.5+.
- `popupStarTap()` then clicks the button one task later. The delay keeps the label attached while its activation looks up the switch.
- Android calls `vibrate(10)` for star and `vibrate([6,45,6])` for unstar at the tap.
- The old delayed popup ticks (at 380ms and 240ms) are **removed**. The tick lands on the tap for both star and unstar.
- iOS gives one tick for unstar, because a tap is a single trusted event.

**Measured with a CDP touch tap** (`tap8.js`, `ax8.js`):

| Check | Result |
|---|---|
| Tap box vs `.popup-star::after` | Identical: 61,156 44×44 |
| Dead band to Mark Visited | 8px |
| `.popup-star` z-index | 201, unchanged |
| Hit test at the corner and centre | Both land on the tap label |
| Ticks per tap | Exactly 1 switch toggle per tap, for star and unstar, in both motion modes: **no double tick** |
| Label and switch clicks reaching document | 0 |
| Focus afterwards | `body`; the switch never had focus on any frame |
| Trust | The label click and the switch change both have `isTrusted: true` |
| Accessibility tree | Exposes only `button "Star"` with `pressed` true/false; no label or checkbox is exposed |

**Unchanged by design.** The forwarded button click behaves exactly like today's direct tap on the star. It still counts as an outside click for the account dropdown, as it always did. Keyboard and VoiceOver activation go straight to the button and produce no tick.

The `:active` shrink is kept for the label through `:has(> .popup-star-tap:active)`.

## Gate: "84 + 8"

- `test6.js`: **84/84**, both motion modes.
- `flip6.js`: **8/8**; the negative control fails 4/4, as expected.
- Popup-open: 20/20.
- Dust: 0 frames of specks over text in 100 runs; lift → move takes at most 116ms.
- Rows are 56.00px throughout.
- Tap delay: 1.2–2.5ms (0ms added).
- Hand-off: 0/5,184 px differ, in all 4 scenarios.
- Impeccable: the 3 baseline findings only.

## Diff

`r8-proposed.diff` has 12 hunks and 128 changed lines, against main (md5 c478958…). I verified it with `git apply` followed by `cmp` against `r8-proto.html`.

## Unverified on device

- That iOS 26.5+ ticks on the label tap. This rests on the tappt PR #5 pattern; Chromium can't produce a haptic.
- Whether Safari focuses the switch on a label tap. The blur covers that case either way.
