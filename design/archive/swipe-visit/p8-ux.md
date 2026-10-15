# p8 (revised): UX review

**Verdict: APPROVE, with one should-fix. No blockers.** The should-fix is pre-existing, but p8 makes it worse and the design doc understates it.

## What I checked, and why it covers the diff

- The diff applies cleanly to the repo's `index.html` (`ebe02fc`), and the result is byte-identical to `p8-proto.html`.
- The diff touches four things: the popup markup and CSS, `hapticTap`/`HAPTIC_TAPS`, `vsReplay`/`ssReplay`, and the `VISIT_POP` constants. It also adds `g.replay` guards in `paintVisit`/`settleVisitDrag`.
- It does not touch touchmove, lock, eatClick or FLIP. So I skipped the full row-gesture suites, per the scope rule.
- My own scripts are in `visit/ux8/`: `geo.js`, `pan.js`, `tap.js`, `ax.js`, `rep2.js`, `pop.js`, `h.js` and `still.js`. They use Chromium with touch emulation.

## Measured

**Popup geometry.** `geo.js` covers 6 content cases × 4 cities × 375/390 = 48 popups, compared with main.
- Star target is 44×44. The z-202 label equals the `::after` box to within 0.5px in 48/48.
- The visited label equals the button box in 48/48.
- Directions and Mark Visited are each 46px tall.
- Dead bands: star → Directions is 8–54px; Directions → Mark Visited is 8px in every case.
- The category's right edge is 93–166px clear of Mark Visited.
- Close button: at least 199px right of the star target.
- The title's first 5px fall inside the star target, which was accepted before.
- No wrapping: Directions, Mark Visited and the category are 1 line each in 48/48. Title line counts match main in 48/48.
- Width is 267–327px, identical to main, so it stays within Leaflet's cap.
- AA contrast:

  | Text | Contrast |
  |---|---|
  | Directions | 4.79–5.20 |
  | Mark Visited | 6.17 (12.51 when visited) |
  | Category, address, notes | 6.17 |

- Hit grid (every 2px across the target):
  - Mark Visited: 0 misses.
  - Star: 0 misses in 40/48. The 8 misses are all in the long-name case (see S1).

**Keyboard and VoiceOver.**
- Tab order: Star → Get directions → Mark Visited/Visited → Close. That matches the visual order. Main had Visited before Directions.
- The a11y tree (`ariaSnapshot`) has the same nodes as main, only reordered. There are 0 checkbox/switch nodes.
- The add form's a11y tree is identical to main's.

**Haptics.** `tap.js`: CDP touch, then Space and Enter, in normal and reduced motion.

| Target | Real tap | Keyboard (Space / Enter) |
|---|---|---|
| Popup star | 1 switch flip; vibrate `10` / `[6,45,6]`; 1 toggle; 0 document clicks; ends on `body` | 0 flips, 0 vibrates, 1 toggle |
| Popup visited | same as the star | same as the star |
| Form STAR | same as the star | same as the star |

- The switch receives a transient `focusin`, which is blurred in the same task. Main's popup star does exactly the same.

**Replays.** `rep2.js` and `rep.js`: 2 rows × plain/highlighted × Stockholm/Reykjavík × star/unstar/visit/unvisit, in both motion modes.
- Each case includes a refetch at +150ms and +500ms, and another after rest.
- 1 replay call per tap. The pencil mounts once, at 3–5ms. There are 0 mounts after rest or after the refetch.
- The replay runs to full length through the refetches: star released at ~836–850ms, unstar at ~638–653ms.
- End state is correct in 64/64, with 0 leftover nodes and nothing held.
- 0 dust-over-text frames.
- 0 glyph or truncation changes at rest. The only still-frame change is the star-mark swap at release: the pencil ink hands off to the printed `.row-star`. That is `releaseStarRow`'s existing hand-off, which this diff doesn't change.
- Last wins (star, unstar and star 60ms apart, then Mark Visited 30ms later): the end state is correct in 8/8. No `sg-live`, no crumbs, no inline transforms, and `starHeld` is empty.
- Reduced motion: 0 mounts, no motion, and the state lands.

**1.10× pop vs the un-visit lift.** `pop.js`, real timing, 3 runs each.

| | Visit | Un-visit |
|---|---|---|
| Peak | 1.10 | 1.12 |
| Frames at ≥1.05× | 11–12 | 9 |
| Dip frames at ≤0.985 | 3 (min 0.97) | 0 |
| Twist, relative to the −5° tilt | −10° → +3° | 0° |
| Starts | ~283ms after the tap | ~20ms after the tap |

The two remain distinct in shape: the visit twists and dips, and the lift does neither.

**Combined build: sheet fix `758470a` + p8** (`ux8/comb.html`, md5 `bae47421…`). I compared it against sheet-only (`ux8/sheet.html`) and reran `pan-comb.js`, `geo-comb.js` and `whoc.js`.
- The results are identical to p8 on `ebe02fc`: the same S1 numbers, all 48 geometry results equal, and the same widths, dead bands and AA.
- The map is 544px tall and the sheet top sits at 544 in Chromium. There, `lvh` = `svh`, so the sheet change has no effect on popup placement.
- On iOS the difference is real: the `100lvh` root can make the map box taller than the visible area once the toolbar collapses. That affects autopan's bottom edge, not its top. This is an iPhone check (#7 below).

**Impeccable:** exactly 3 findings (2× clipped-overflow-container, 1× cream-palette).

**Stills:** `ux8/still-long-{3x,1x}.png` and `ux8/still-bare-{3x,4xcrop,1x}.png`.

## Should-fix

**S1. The popup top collides with the top controls, and p8 moves the star into that corner.**
- p8 makes every popup 22–38px taller than main (at 375px: bare 124→162, long 184→222, addr 140→166). A long popup therefore gets pinned against the top by autopan (5px padding) across a band of marker positions about 38px deeper.
- The star is now the popup's top-left item, which is exactly where the zoom control sits (10–44 × 10–74).
- **Default open, long-name case:** the zoom "−" covers **18% of the star target at 375px and 11% at 390px. Main: 0%.**
- Marker at 45% of map height (`pan.js`, inset 0):

  | Marker x | p8, star target blocked | Main |
  |---|---|---|
  | Left (12%) | 77% | 7% |
  | Centre | 27–46% | 3–4% |

- The "+" add button overlaps the popup's top-right, including the close button, at every x. That was already true in main.
- **Simulated home-screen inset of 59px:**
  - The zoom control and "+" move down, so the star target is mostly clear (0–7% blocked).
  - But autopan ignores the safe area. The pinned popup's top sits at y 5–10, so the title and the star (target top 24–29, glyph at about 37–55) sit under the status bar / Dynamic Island.
  - In main, the category line took that slot.
- The design doc calls this a "pre-existing harness artefact, same as main". **That is wrong for the star.** Main's star was clear in these cases.
- **Fix (one line on the pins' `bindPopup`):** give autopan a top padding that clears the controls plus the safe area. For example `autoPanPaddingTopLeft: L.point(5, 84 + safeTop)`, where `safeTop` is read from a CSS var set to `env(safe-area-inset-top)`. The 544px map still fits a 245px popup plus its tip.
- If the operator rules it out of scope: log it under Known bugs, and fix the doc's claim.

## Nits

- **N1.** The bare popup is sparse: 41px of air between the title and "GET DIRECTIONS". This comes from the 17px down-bias of the solo-case star target plus the 8px dead band. It is CD territory; flag it with the alignment loop.
- **N2.** The visit landing peak (1.10) is now below the un-visit lift (1.12), so the committing action is the quieter of the two. They stay distinct by twist and dip. Just be aware of it on device.
- **N3.** VoiceOver now reads the category ("attraction") immediately before the "Visited" button. That is harmless, but it can sound like part of the button's label. An `.sr-only` separator or leaving it as is are both fine.
- **N4.** A touch on the popup Mark Visited now ends with focus on `body`. Main focused the button in Chromium. This matches the star and has no effect on iOS.

## Only an iPhone confirms

1. The label-over-button path gives one tick per tap on popup Mark Visited and form STAR on iOS 26.5+, and none under VoiceOver or a keyboard.
2. The `:has(> .…-tap:active)` press feedback shows on both new labels.
3. **S1 in real conditions:**
   - In a Safari tab and in a home-screen launch, open a long-name place in the upper half of the map.
   - Check whether the star or title sits under the zoom control, the "+" button or the Dynamic Island.
   - Check whether tapping the star's left edge zooms out instead.
4. The popup → row replays are visible behind the popup when the sheet is up, and read as the same act as the swipe.
5. The 1.10× visit pop still lands as a thunk, and is not confused with the 1.12× lift.
6. The popup star's fade and 1.4× pop at 120Hz. The pop stays clear of the title, which measures ≥4.68px in the designer's numbers; I didn't re-measure the popup pop.
7. **Combined build:** with Safari's toolbar collapsed and expanded, a popup opened near the bottom of the visible map doesn't autopan under the sheet or the toolbar. The `lvh` map box may be taller than what you can see.
