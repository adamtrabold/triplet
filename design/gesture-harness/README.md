# Row-gesture test harness (the load-bearing gate)

Rebuilt 2026-10-01. The original harness was never committed. Its files were
`design/pencil-star/lib.js`, `s2.js`, `r5-metrics.js`, `design/star2/lib.js`,
`curve8.js`, `dust6.js` and the popup-open suite (`docs/backlog.md`,
`docs/shipped.md` "List order"). That left the CLAUDE.md gate impossible to run.
This folder replaces all of them. It runs against the real `index.html`, unmodified,
in headless Chromium.

## Run it

```sh
design/gesture-harness/run-all.sh [path/to/index.html] [suite ...]
```

- With no path, it runs this checkout's `index.html`. Any path works, e.g. a
  scratch copy or another worktree's file.
- With no suite names, it runs all nine: `touch flip visit popup-open dust rows curve delete plans`.
  (`plans` needs a page with Plans; on one without, it errors and the summary leaves it out.)
- `OUTDIR=dir` keeps each suite's `.log` and `.json`. The default is a temp dir.
- Single suite: `FILE=path OUT=x.json node design/gesture-harness/<suite>.js`.
- A full run takes about **12.5 minutes** (748s on origin/main, 4 cores). Suites run one at a time on purpose:
  `curve`, `dust`, `flip` and S2 measure real time per rAF, and parallel
  browsers would disturb that.

The last two lines printed are the gate. A fully passing run reads like this:

```
GATE star "84 + 8 (+ N8-a)" · vtest 95/95 · popup-open 20/20 + 20/20 · dust 0 frames (65 runs, lift->move <=127ms) · rows 56.00px · curve8 row 11/3, highlighted 11/3, popup 10/3 · delete-slop 36/36
GATE PASSED            (or: GATE FAILED: <suites>, followed by each failing case)
```

## What it is

- **`lib.js`**
  - Loads the page at `https://triplet.test/` with every request routed:
    - `stub.js` stands in for supabase-js;
    - `vendor/` serves Leaflet 1.9.4 and Archivo;
    - map tiles are blank;
    - all other network is 404.
  - The session is signed in as the owner, so replays and toggles run.
  - Instrumentation, installed after load:
    - `__nav`: one `[id, t]` per `highlightMarker()` call;
    - `__del`: `confirmDelete()` is stubbed to record and never delete;
    - `__te`: touchend times;
    - `__rowIds()` and `__rename()`.
  - Touch input is CDP `Input.dispatchTouchEvent` at real timing.
    - Moves are scheduled from the start time, and each event is sent without
      waiting for its ack.
    - Awaiting each ack, as the old harness did, costs about 35–50ms per
      touchmove here. A 16ms cadence ran 2–3× slow.
    - `synthTs` stamps events with their ideal times for flick tests.
- **`stub.js`**: a fixture of the same 21 places in each of the 5 seed cities, plus a district and a street.
  - Rows are addressed by A–Z index. `lib.js` asserts the order on every load.
    - 0 is short and plain.
    - 1 is long, starred and visited.
    - 2 is long and visited.
    - 5 is long and plain.
    - 10 is starred.
  - Writes patch the fixture, so a refetch returns what is on screen.
- **Viewport**: 390×844, touch, `isMobile`, at 1× (3× where a case says so). Both
  motion modes come from `reducedMotion`.

## Suites: what each asserts and the number it must print

| Suite | Gate number | Spec (docs/shipped.md unless noted) |
|---|---|---|
| `touch.js` | **84/84**: 42 cases × 2 motion modes | Pencil Star entry (all rounds). It is `design/pencil-star/test6.js` case for case. |
| `flip.js` | **8/8**, and its negative control must **fail 4/4** | Rounds 4–6, "FLIP rule, re-specified". It is `flip6.js` (N5-a). |
| N8-a (in `touch.js`) | **4/4**: mouse and touch × 2 modes | Rounds 7–8, "A mouse click refocuses the button (N8-a)". |
| `visit.js` | **95/95**: 49 full + 46 reduced | Swipe-left visited. It is `design/swipe-visit/vtest.js` (p7) case for case. |
| `popup-open.js` | **20/20 in each motion mode** | "List click always opens the popup". |
| `dust.js` | **0** speck-over-text frames | Rounds 4–6 "Dust sweep" and `design/pencil-star/r6-design.md`. |
| `rows.js` | **56.00px** is the only height ever seen | "Rows 56.00px throughout". |
| `curve.js` | row **≥11/3**, popup **≥8/3** | Rounds 7–8 spin-stamp, and `r8-design.md` §1. |
| `delete.js` | **36/36** | Swipe-left "Delete safety", the UX sweep. |
| `plans.js` | **22/22**: 11 cases × 2 motion modes | "Plans (v3 build)": on a stop row, tap (text and number) navigates; star right, visit left from ×; a quick or 300ms-rested vertical stroke from the number scrolls; a 450ms hold lifts and moves one place; × removes and + adds only below `DELETE_TAP_SLOP`; rows 56.00px. Its fixture plan is opted in with localStorage `gh.plans`, so the other suites see no plans. |

Gate line in CLAUDE.md terms: star `"84 + 8 (+ N8-a)"` = touch + flip (+ N8-a);
`vtest` = visit.

### touch.js (84)

The cases:

- Star, unstar, and cancels at 30 and 60px.
- Past the detent and back, for star and unstar.
- Vertical scroll, tap → navigate (touchend → `highlightMarker` < 16ms), and a sloppy 6px tap.
- EDGE start at x=12.
- A drag from the X (no delete, no star), and a drag ending on the X (stars).
- A flick stars. S5: a flick never unstars.
- touchcancel reverts. A left drag never stars.
- Rows 56px on every drag step. Scroll, settle, tap.
- Diagonal 60/100.
- Clearance ×3 names: no graphite until the name is ≥3px clear.
- Honest rub: ghost 0.25 held from 44 to 55.9, 0 at 56, no grain before 100% graphite.
- S1 swallowed taps ×5, plus mouse.
- The S3 angle matrix (20–50°), plus sideways-then-up.
- S2 press delay: none during a stroke, about 100ms on a quick tap's release, about 80ms on a still hold.
- Popup → row replay ×2, the popup ink, and N3 shape give.

Cases that assert the current spec instead of the r6 one are tagged in their names:

- **[visit]**: "drag LEFT is inert" became "drag left never stars". Left is now the visit stroke.
- **[p8]**:
  - The two S4 teach cases (`maybeTeachStar`, removed) became the popup → row
    replay: every time, both ways, and none off screen.
  - The popup "pencil draw / rub" case became fade + pop once / fade + lift to hollow.
- **S3**:
  - The "main" scroll reference is now the same page with the row gesture detached.
  - main *is* the gesture build now.

### flip.js (+8)

- It logs every rAF frame of a real-time 0.6px/ms, 100px touch stroke.
- It runs on 4 rows (star long visited, unstar long, star short, unstar short) in each motion mode.
- In motion, every h3 swap must come ≥3 motion frames before rest, with ≥3 motion frames after it.
- Under reduced motion, the swap is the landing.
- The control re-times the swap to happen at rest and must fail all 4.
- On origin/main, swaps sit 12–13 frames before the last motion. That matches r6-design.md.

### visit.js (vtest)

- V1–V23 and D1–D10 come from p7, with the same numbering.
- **[p8]**:
  - The V17 pop thresholds are scaled to 1.10×/0.97 in p7's proportions (75% of the swell, 60% of the dip).
  - V16 waits out the popup replay.
- **[1ec21c2]**: "Visit-swipe text now slides + FLIPs" landed on main after p8 and is undocumented in `docs/shipped.md`. So:
  - V14 measures the slid glyphs against the bleed halo and the pressed track.
  - V15 checks the documented "final truncation lands on the press frame" through the h3 itself.
  - V18 accepts p7's press/lift-frame rule or the star's FLIP rule.
  - V23 checks that the text-side writes are transforms only.
- Slow releases (V3, V4, V21b, and touch's cancels) step at 33ms per 6–8px, so they aren't flicks. The lost harness's awaited sends ran them at about 0.15px/ms. At a true 16ms cadence the same "50px then release" is 0.52px/ms, which is a flick and visits by design.

### The rest

- **popup-open.js**: 20 real taps per mode.
  - 8 pins that are clustered at the start view.
  - 4 chained taps, then "already there".
  - Last tap wins.
  - A map touch mid-flight cancels the open.
  - A district below its min zoom, and a street.
  - From zoom 5; the highlighted row and marker; a solo marker at `SOLO_MIN_ZOOM`.
  - Reduced motion has no flight. There, last-tap-wins and the cancel case assert the synchronous path instead.
- **dust.js**: 65 runs. The rule is ≤150ms; r6 measured ≤117.
  - Unstar on long, short and unvisited rows, with natural and brisk swipes.
  - All 5 cities, normal and highlighted rows, both modes.
  - Stars, which drop no dust.
  - The popup → row unstar replay.
  - It also reports lift → name moving.
- **rows.js**: every row kind (plain, starred, visited, starred+visited, highlighted, shape).
  - At rest: all 5 cities at 1× and 3×.
  - In motion: every rAF frame of star, unstar, visit, un-visit and cancels, in both modes.
- **curve.js**: STAR_POP, sampled per rAF, 10 runs each for the row, the highlighted row and the popup.
  - It reports frames ≥1.3×, frames ≤0.97, the peak, and the rest.
  - It also reports the animation's own `currentTime` at the sampled frames.
- **delete.js**: the UX sweep.
  - 0–3px must delete. 4/5/6/8/12/20/40/90px must not.
  - Directions: left, right, up, down and a 3-4-5 diagonal.
  - Plus mouse at 0/3/4/8px and keyboard Enter, both modes.
  - Plus an out-and-back case: 4/6/8/12px out and back to the start must not delete. It was an ungated probe until fix-d7 fixed it.

## Findings on origin/main (`9a53d71`)

Full results: see the report that landed this folder, and re-run for current numbers.

1. **curve8 row 10/3, not 11/3.** This is a measurement artifact, not a code change: `STAR_POP` is byte-identical since `48bb11e`.
   - STAR_POP's ≥1.3× window is 31.4–199.9ms, which is 168.5ms or **10.11 frames** at 60Hz.
   - Here the animation starts on a frame, so samples land at `currentTime` 33.3 … 183.3ms. The 12th would be 200.0ms, 0.1ms past the window.
   - The result is exactly 10 frames in 30/30 runs, on the plain row, the highlighted row and the popup.
   - An 11th frame needs the sampling phase to fall in a 1.8ms slack. That is plausible on the setups that recorded 11.
   - The gate keeps the documented ≥11 and **fails** here. Changing it is an owner call.
2. **vtest V14: on long names the text runs into the stamp's ink**, by up to about 23px, before the press.
   - This came in with `1ec21c2`. The text slides 1:1 (56px at the commit), but the stamp plus the gap to the X is about 76px.
   - p7 hid the tail under the mask wipe.
   - Visible in a still: "…Ce…" over the bleeding "VISITED".
3. **vtest V15 (×2): the final truncation no longer lands on the press frame.**
   - Since `1ec21c2`, it lands at release via `flipVisitToFinal()`, while the name is moving. V18's FLIP rule passes.
   - This is doc drift (shipped.md still says "the final truncation lands" at the press) or a behaviour change nobody recorded.
4. **vtest D7 (reduced motion): a tap on the X right after an un-visit stroke deletes.**
   - Under reduced motion, `settleVisitDrag()` → `flipVisitToFinal()` → `vsCleanup()` → `updateUI()` all run synchronously.
   - That happens before `toggleLocationFlag()` (async) has flipped `locations`. The stale signature re-renders the row and drops the X's 120ms `pointer-events:none` guard.
   - Full motion is unaffected.
   - **Fixed on `fix-d7`**, with the out-and-back probe: see `docs/shipped.md` "Delete-guard fixes".

## Mutation check (2026-10-01)

Each scratch copy of index.html below has one behaviour broken, and each one
fails the suite that guards it:

| Mutant | Suite | Result |
|---|---|---|
| `DELETE_TAP_SLOP` 40 | delete | 20/34 |
| Flick may unstar | touch | 82/84 (S5 ×2) |
| Dust swept right | dust | 20/65 (9 frames per unstar) |
| 300ms popup timer | popup-open | 26/42 |
| STAR_POP peak 1.2 | curve | 0 frames ≥1.3× |
| Visited rows 57px | rows | 0/12 |

flip.js has its own built-in control (swap at rest), which fails 4/4.

## Limits

- **Chromium only, emulated touch.** No WebKit and no iOS. Every pixel and timing number is Chromium's, as CLAUDE.md already says of `docs/`.
- **Touch slop.** Chromium (`isMobile`) holds back touchmoves inside its ~15px slop when touchstart isn't consumed. Android Chrome does the same; iOS sends every move. Consequences seen here:
  - A stroke that starts slower than about 0.2px/ms shows the 80ms row press. S2 therefore strokes at a natural 0.6px/ms.
  - The `delete.js` out-and-back case: here touchmoves inside the slop never arrive, but touch `pointermove`s do, and since fix-d7 the X reads them. Before that it deleted.
  - Neither is known on iOS. Both are device checks.
- **Haptics**: only `navigator.vibrate` calls are observable. The iOS switch tick can't be.
  - `haptic8`/`tap8`/`ax8` (focus frames on the switch, document clicks, trusted toggles) were **not** rebuilt.
  - The hand-off pixel check (0/5,184) was not rebuilt either. V8 covers the visit stamp's hand-off.
- **Unknown cases**: p8's vtest had 113 cases and its 18 additions were never committed. This suite is p7's 95, updated.
- The fixture is synthetic. Its long names were chosen to truncate at 390px.
