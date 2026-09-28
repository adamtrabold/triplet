# Sheet-to-bottom fix — independent UX/QA review

**Verdict: APPROVE** (perfection-stage bug fix; scoped gate per CLAUDE.md's
"scope the test gate to what the change touches"). No blockers.

All numbers below are from my own reruns in this session (Chromium via
Playwright, `NODE_PATH=/opt/node22/lib/node_modules`,
`/opt/pw-browsers/chromium`), not copied from the engineer's logs, except
where marked "per engineer log, unreproduced" (none — I reproduced
everything).

## 1. Diff hygiene (independently reproduced)

- `sheet-proposed.diff` applies clean to HEAD (`ebe02fc`) alone → resulting
  `index.html` md5 `7c40cd51e1cc4da37207685e9eb85bfa`, matches the design
  doc's claimed `sheet-proto.html` md5 exactly.
- Combined: `p8-proposed.diff` (concurrent popup change) applies clean, then
  `sheet-proposed.diff` applies clean on top, no fuzz/reject. Combined
  `index.html` md5 `bae474211faf26dd4dfe90bed9fdf41e`.
- Ran `smoke.js` and `geo.js` against the **combined** build (not just the
  standalone proto): 12/12 and 75/75 respectively. The two diffs compose
  correctly — the popup change touches gesture/popup code, this diff
  touches only layout/positioning, and there's no interaction bug at the
  seam.

## 2. Geometry (`geo.js`, rerun): 75/75, all 4 modes

Phone (390×844), standalone (440×956, CDP safe-area top 62/bottom 34),
tab-emulated (440×836, `--chrome-bottom:100px`), desktop rail (1280×800) —
sheet reaches the bottom, map meets sheet with 0px gap both expanded/
collapsed, collapsed band sits above chrome, last row clears chrome,
filters panel flush, Leaflet size == `#mainContent` size after
`invalidateSize()`, auth scrim covers 0..H and is centered above chrome,
`scrollY` stays 0 throughout including a synthetic "tall root" case
(wheel over list/map/header never scrolls the page; a raw
`scrollTo(0,100)` and a focus on an off-screen filter chip are both reset
by the guard to 0). Desktop rail is untouched: full-height sheet,
Leaflet 920×800, `--chrome-bottom` reads 0.

## 3. No page scroll / rubber-band, and guard side-effects

Reran `smoke.js`: list tap navigates, star swipe commits, visit swipe
commits with 0 deletes, vertical list drag scrolls the list (~190px) with
`scrollY` pinned at 0 — in all three geometries. `geo.js`'s guard checks
confirm `unscrollPage()` doesn't create a re-entrant loop (its own
`scrollTo(0,0)` reset is a no-op scroll, and the early-return on
`!scrollY && !scrollX` stops recursion).

**Real, but scoped and already flagged in the design doc**: making
`#filtersPanel` `absolute` in a taller-than-viewport (tab-mode) body means
a hidden panel's filter chips, which stay in tab/VoiceOver order while
closed (no `inert`/`aria-hidden`/`display:none` toggle — that's
pre-existing, not from this diff), can now trigger a real browser
scroll-into-view on focus that didn't exist before (the pre-diff fixed
positioning had no scrollable ancestor to move). `unscrollPage()` snaps it
back on the following `scroll` event. This is a real transient
scroll-then-snap that only fires in tab mode via keyboard/VoiceOver
traversal into a *closed* panel — the chip isn't visibly usable either way
since the panel is off-screen, so it's cosmetic, not a functional
regression, but it's new behavior the diff introduces and is worth a line
in the iPhone checklist (VoiceOver swipe-navigating through a closed
filters panel in a Safari tab). **Should-fix, not a blocker.**

I checked the other three risk areas named in the brief and found no
issue: address-suggestion items are plain `<div>`s built via
`.innerHTML`, not focusable/keyboard-navigated, so they can't trigger this
path. Auth modal's email/password inputs are excluded from the guard by
its `input, textarea, select, [contenteditable]` check (confirmed by
reading the selector, and indirectly by `geo.js`'s auth-scrim checks
passing). Leaflet popups pan the map's own internal transform, not
`window.scroll*` — `unscrollPage` can't fight that, and the popup-open
suite (below) passing on real popups (including autopan-triggering
off-screen targets) confirms no interference.

## 4. Risk review of the diff

- **Scope**: read all 14 hunks. Every hunk is CSS positioning/sizing, the
  collapse click handler (inline `style.bottom` → `classList.toggle`), or
  the new `unscrollPage` guard. Nothing in popup, star/visit gesture, or
  row code — matches the design doc's claim and CLAUDE.md's "no page-scroll
  regression" instincts. I did not find any change outside layout.
- **`html.standalone` detection**: the `<script>` setting the class sits at
  line ~14, the first `<style>` block at line 130 — the script runs before
  CSSOM construction, so the class is present before any rule using it is
  evaluated. Dual-detection (`navigator.standalone` JS class + CSS
  `@media (display-mode: standalone|fullscreen)`) covers both Safari's
  proprietary API and any engine that reports display-mode via media query;
  `navigator.standalone` is `undefined`/falsy elsewhere, so the script is a
  no-op there rather than throwing.
- **lvh/dvh unsupported**: `--chrome-bottom` starts at a literal `0px` and
  is only overridden by the `@supports (height: 100lvh)` block, so an
  engine without `lvh` support keeps the safe `0px` default (matches
  pre-diff, no toolbar allowance, but also no broken layout — degrades to
  the old fixed-viewport behavior). `html`/`body`'s doubled `height:` lines
  (`100%`/`100vh` then `100lvh`) follow the same pattern the file already
  used for the `dvh` fallback — an unsupported `100lvh` value is simply
  invalid and ignored by the cascade, leaving the prior valid declaration
  in effect. Standard, low-risk.
- **Desktop unaffected**: confirmed by `geo.js`'s desktop-rail checks
  (0/0 diff from expected) in both the standalone proto and combined
  build. The added `height: auto !important` at `@media (min-width:900px)`
  is *necessary*, not scope creep — hunk 4 makes `#mainContent`'s height a
  calc() unconditionally, which would otherwise leak into the desktop rail
  since the rail's rule only had `bottom: 0 !important` before; pairing it
  with the new override is the correct fix, and it's inert in practice
  (a fixed box with both `top` and `bottom` set computes height from the
  constraint regardless of `height: auto`).
- **Impeccable baseline**: ran `impeccable detect` on unmodified
  `/home/user/triplet/index.html` (current `main`, `ebe02fc`) myself — it
  already reports the *same* 3 findings (2× clipped-overflow-container,
  1× cream-palette) as the proto. This diff introduces **zero** new
  Impeccable findings; the 3-finding gate is a pre-existing baseline, not
  something newly caused by this change.

## 5. Smoke (independently rerun)

- List tap navigates + opens popup, star swipe commits, visit swipe
  commits (0 deletes), vertical list scroll works, page `scrollY` stays 0:
  `smoke.js`, 12/12, standalone proto AND the combined (sheet+p8) build.
- Popup-open: reran `loop/star/sheet-popup-test.js` (hardcoded to this
  exact `sheet-proto.html`) — 20/20, both motion modes.
- `loop/rows/op-check.js`, repointed at `sheet-proto.html`: identical
  output to the engineer's log
  (`{"heights@375":[56],"heights@390":[56],"toggle":{"before":false,"afterMarkVisited":true,"afterUnmark":false,"shapeRowsWithClass":0},"clicks":{"navs":1,"deletes":1}}`)
  — 56px rows preserved, visited toggle works, stamp tap navigates
  (not delete), delete tap deletes, no shape rows pick up `.is-visited`.

## 6. Combined-diff check (sheet + concurrent p8 popup diff)

Both diffs apply cleanly together in either order tested (p8 then sheet).
Reran `smoke.js` and `geo.js` against the combined build: 12/12 and 75/75.
No functional regression from combining.

## What only an iPhone can confirm

Everything the design doc's own iPhone checklist says, unchanged by this
review — in particular:
- Safari's *real* `100lvh`/`100dvh` split (Chromium can't produce this;
  the tab-emulated mode only tests the math with `--chrome-bottom`
  overridden, not that Safari reports the right value).
- The Home Screen short-viewport bug itself (WebKit-specific; CDP's
  `Emulation.setSafeAreaInsetsOverride` simulates the safe-area insets,
  not the underlying viewport-height bug that motivated this fix).
- Whether the new VoiceOver/closed-filters-panel scroll-then-snap
  (§3 above) is perceptible in practice — add one line to the existing
  iPhone checklist: "VoiceOver swipe-navigate through the filters panel
  while it's closed, in a Safari tab — no visible page jump/flash."
- Status-bar tint sampling from the map in a tab (unchanged mechanism,
  but worth eyeballing since `#mainContent` positioning changed from
  `bottom` to `height`).
- Rotate/resize live-`dvh`-update behavior, and minimizing Safari's
  toolbar if iOS does so.

## Blockers
None.

## Should-fix
- Add the VoiceOver/closed-panel scroll-then-snap case to the iPhone
  checklist (§3) — cosmetic, tab-mode only, but new behavior from this
  diff and untested by the automated suites (which don't simulate
  keyboard/AT focus traversal).

## Nits
- None beyond what's already logged as deferred in `sheet-design.md`
  (the `maybeTeachStar()` "row on screen" edge case in a tab, explicitly
  left out of scope and flagged as a follow-up for whoever next touches
  star code — reasonable to leave alone here).
