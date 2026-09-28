# Browser test harnesses

Playwright + Chromium scripts that drive the real `index.html` at phone size
with injected rows (the sandbox can't reach Supabase or map tiles). Leaflet,
supabase-js and the Archivo font are served from `vendor/` (~440KB) by
request routing; every other network request is aborted. The repo still has
no build step and no `package.json`; these are run-by-hand scripts.

## Running

```
cd /home/user/triplet
NODE_PATH=/opt/node22/lib/node_modules node tests/<script>.js
```

- Chromium: newest `chromium-<n>` under `/opt/pw-browsers` (override with
  `CHROMIUM=/path/to/chrome`).
- `PROTO=<path>` tests a prototype instead of `../index.html` (absolute or
  relative to CWD).
- `BASE=<path>` is the "main" reference for the scripts that diff against
  one (`a11y`, `haptic-overlays`/`haptic-ext`, `popup-geo` stills). It
  defaults to the tested file itself, so those diffs are trivially empty
  unless you save a baseline first (`git show main:index.html > /tmp/base.html`,
  then `PROTO=index-wip.html BASE=/tmp/base.html ...`).
- `OUT=<path>` overrides the result file. Default: `tests/out/<name>.json`
  (gitignored). Screenshots (`visit-suite`, `popup-geo`) go there too.
- Every script exits non-zero on failure and prints `ALL PASS` (or `N/N`) as
  its last line. Don't run two at once: timing/frame-count checks are
  CPU-sensitive.
- Helper modules (not runnable tests): `lib.js` (browser launch, request
  routing, row injection, touch helpers), `data.js`, `s2.js`,
  `star-driver.js` (the `window.__swipe` finger driver the star scripts
  inject; also a metrics dump when run directly).

## Scripts

Times are wall-clock on the sandbox at HEAD `c58afe4`. "Both motion modes"
suites run full and `prefers-reduced-motion: reduce` internally.

| Script | Protects | Run when you touch | Pass | Time |
|---|---|---|---|---|
| `op-check.js` | Rows stay 56px, `.is-visited` toggles, stamp tap navigates and X deletes | **Always** | ALL PASS | 4s |
| `star-touch.js` | Pencil Star row gesture: arming/lock/scroll hand-off, commit, flick, edge, unstar, shape give, press, delete safety, tap; both motion modes | Row gesture / touch plumbing (`createCard`, `STAR_SWIPE`, `attach*`) | 84/84 | ~250s |
| `star-flip.js` | FLIP letter rule: glyphs only change while the name moves. Has 4 CONTROL cases (swap at rest) that **must fail** | Row gesture, row layout/truncation | 8 pass + 4 controls fail | 28s |
| `star-curve.js` | Spin-stamp pop frame counts (row >=11 frames at >=1.3x (10 tolerated as jitter), popup >=8, >=3 dip frames) | Pop keyframes, `STAR_POP`, popup star | ALL PASS | 9s |
| `star-dust.js` | Erase dust never overlaps text (0 frames), lift-to-move <=150ms, 100 runs | Row gesture, dust/crumbs | ALL PASS | ~230s |
| `visit-suite.js` | Swipe-left visited: bleed, press, un-visit, delete safety D1-D10, glyph rule V18, mid-drag perf V23, popup replays; both motion modes | Row gesture, visit stamp, `DELETE_TAP_SLOP` | 113/113 | ~190s |
| `popup-open.js` | List click always opens the popup (`openPopupOnArrival`): 10 scenarios x 2 motion modes | Popup, `highlightMarker`/`focusShape`, map flight, clustering | 20/20 | ~60s |
| `popup-geo.js` | Popup layout: 44/46px targets, 8px dead bands, no wrap, AA >=4.5, hit-testing, 4 cases x 5 cities (+ stills in `out/`) | Popup markup/CSS | ALL PASS (24 cases) | ~40s |
| `replay.js` | Popup star/visit replays on the list row; no dust over text, no glyph swap at rest | Popup actions, `ssReplay`/`vsReplay` | ALL PASS (64) | ~135s |
| `haptic-tap.js` | Real-tap label path: 1 tick per tap (iOS/Android/reduced), 0 document clicks, keyboard silent, a11y tree unchanged | Haptics, popup buttons, add-form STAR | ALL PASS | ~55s |
| `haptic-overlays.js` (+ `haptic-ext.js`) | Hidden switch never keeps focus, doesn't close the account menu/suggestions, reduced-motion haptics still fire | Haptics | ALL PASS | ~30s |
| `a11y.js` | Accessibility tree unchanged vs baseline; no stray checkbox/switch | Popup, add form, haptics | ALL PASS | ~8s |
| `layout-geo.js` | Sheet reaches the bottom edge in phone/standalone/tab/desktop; no page scroll or rubber-band; collapse | **Layout** (`html/body`, `#locations`, `--chrome-bottom`, safe area) | 75 PASS | ~20s |
| `layout-smoke.js` | Tap/star/visit/scroll still work under the sheet layout (plain, standalone, tab-emulated) | Layout | ALL PASS (12) | ~35s |
| Impeccable | Design lint | **Always** | exactly 3 findings | ~30s |

## Scoped gate (from CLAUDE.md: run what the diff touches)

- **Always:** `node tests/op-check.js` and `npx -y impeccable@4.1.0 detect index.html`.
  Impeccable must report exactly 3 findings: 2x `clipped-overflow-container`
  (body, div) and 1x `cream-palette` (`rgb(242, 235, 221)`).
- **Popup change:** `popup-open`, `popup-geo`, `replay`, `haptic-tap`,
  `a11y`, `star-curve`.
- **Row gesture / shared touch plumbing:** the full gesture gate, reported as
  "84 + 8": `star-touch` (84/84) + `star-flip` (8/8, controls fail), plus
  `visit-suite` (113/113), `star-curve`, `star-dust`, `popup-open`.
- **Haptics:** `haptic-tap`, `haptic-overlays`, `a11y`.
- **Layout / sheet:** `layout-geo`, `layout-smoke`, `popup-open`.

## Full gate (about 17 minutes, run sequentially)

```
cd /home/user/triplet && export NODE_PATH=/opt/node22/lib/node_modules
for n in op-check layout-geo layout-smoke star-flip star-curve star-dust star-touch \
         visit-suite popup-open popup-geo replay haptic-tap haptic-overlays a11y; do
  node tests/$n.js > tests/out/$n.log 2>&1; echo "$n exit=$? $(tail -1 tests/out/$n.log | cut -c1-80)"
done
npx -y impeccable@4.1.0 detect index.html     # exactly 3 findings
```

## Notes

- All pixel/timing numbers are Chromium-only; iPhone checks stay manual.
- `star-touch` N3 scrolls `#locationsList` itself (not `scrollIntoView()`,
  which also scrolls ancestors under the absolute sheet layout and left the
  shape row out of reach).
- `star-curve`: a row at 10 frames instead of 11 is frame-phase jitter, so both row cases pass at >=10
  (seen 1 in 3 runs here; documented in CLAUDE.md).
