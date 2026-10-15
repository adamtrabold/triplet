# Visit p8 (revised): smaller pop, popup → row replays, popup layout, popup star, haptics

**Base:** branch HEAD `0e5113f`, which includes the sheet-to-bottom fix `758470a`. `git apply --check` is clean on a fresh worktree at `0e5113f`, and applying it gives a file `cmp`-identical to `p8-proto.html` (md5 `591c7dca213594485727a762c2b7d344`). The diff adds no trailing whitespace.

**Files** (all in `visit/`):
- `p8-proposed.diff`
- `p8-proto.html` (md5 in `p8-md5.txt`)
- builder: `buildp9.py`, run with `VARIANT=110 REPLAY=1 LAYOUT=1 STAR=1 REV=1 PAN=1` (base `base-0e5113f.html`)
- `p8-popup-before-after.png` (main vs revised), `p8-star-replay-film.png` (star replay, both ways)
- the pre-revision doc: `p8-design-prerev.md`

## p8 revision: the owner's four decisions

### R1. Get Directions is the shipped text button again
The owner said: "the same text button not a new button style".
- It is the shipped `.popup-directions`: compass + condensed caps, 10px, `--figure-deep`, `padding: --s4 0`, no fill. The orange `--figure` button, its `::after` extension and its `:active` colours are gone.
- It stays in its p8 place, on its own line under the address/notes.
- It is content-width (`fit-content`, 106px), so only the words are the link. The space to its right is dead.
- The compass sits on the 20px icon column (3px each side, the old Mark Visited ring's rule). "GET DIRECTIONS" starts at **24.00px** in all 24 cases, the same x as the category word below it (24.00).
- The margins drop by 4px, since the target is now the box itself. The text lands on exactly the p8 y.

| Measure (`popup8r.js`, 6 content cases × 4 cities = 24) | Result |
|---|---|
| Dead band, star target → Directions | ≥ 8px (8 / 16 / 18 / 54 by case) |
| Dead band, Directions → Mark Visited | 8px in every case |
| Targets | Directions 106×46, Mark Visited 46 tall, star 44×44 |
| Label wrapping | none: "GET DIRECTIONS" and "MARK VISITED" are one line in all 24 |
| AA, Directions (`--figure-deep` on `--paper`) | 4.79 (Stockholm), 4.99 (Malmö), 5.01 (Copenhagen), 5.20 (Reykjavík) |
| AA, Mark Visited / category | 6.17 / 6.17 |
| Popup width | 267–327px, unchanged from p8 and main |

Before R5, 4 of the 24 cases had the zoom control over the star's target: p8's taller popups, with the star top-left, were pinned under it by autopan's 5px top padding (UX S1). R5 fixes it; the re-shot stills and the geometry are from the final proto.

### R2. The star replay goes both ways, every time
The owner said: "Star animation should go both ways". The new code is `ssReplay(id)`.
- The popup handler now calls `ssReplay` for the star and `vsReplay` for visited, both before the toggle.
- `maybeTeachStar`, the 2-per-device cap and `STAR_TEACH_KEY` are deleted. On load, one `localStorage.removeItem('triplet.pencilStarTaught')` runs (in a try/catch), and nothing ever reads the key. Measured: 0 `getItem` calls for it across 4 replays.
- The rules are `vsReplay`'s, exactly:
  - It is started by the click, never by a render, so it plays once.
  - The row is held (`starHeld`), so a refetch can't cut it short or replay it.
  - It plays only if the row is on screen. Otherwise the state just lands.
  - Last wins: a running replay's `ff()` lands its final state synchronously, then the next one starts. Its late FLIP frames are parked on a detached node.
  - Reduced motion or signed out: no replay.
  - No haptic from the replay itself, because the popup tap already ticked.

**Recommendation: star = pencil + ink.** The row's grammar is "a row star is always pencilled". Only the popup fades, because its outline is already printed. Ink-only on the row would be a mark from nowhere, and it would contradict the swipe the owner will also be using. This is the old teaching replay's CD-approved rhythm:
1. The name steps 30px aside, clear of the sketch.
2. The five strokes play at `HAND_MS`.
3. The ink lands at about 433ms with `STAR_POP` (peak 1.40×, 10–11 frames ≥1.3×).
4. The name docks under FLIP. It rests at 602–618ms, and the overlay is gone by about 850ms.

**Recommendation: unstar = the full rub + dust.** A lean erase has no finish beat. The dust is the row's "done" signal, and without it the row would just blink.
1. The star lifts with `STAR_ERASE_POP` (1.12×, 9 frames ≥1.05×, no twist).
2. It is rubbed out over `RUB_MS` 400: colour first, then grain, erosion and the ghost.
3. At about 428ms the ghost vanishes and the three specks fall.
4. The name moves home under FLIP, resting at 620–635ms.

The name doesn't slip first, because there is no sketch to clear. That keeps the unstar calmer than the star.

| Measure (`ssrep.js`: 4 cities × plain/highlighted × long/short name × visited/not, both ways = 64 replays) | Result |
|---|---|
| Dust over text | **0 frames** |
| Glyph changes at rest | **0** (each change has ≥4 moving frames) |
| Ends in the right state | 64/64 |
| Star: ink / rest / overlay gone | ~433 / 602–618 / 835–851ms |
| Unstar: dust / rest / overlay gone | 420–436 / 620–635 / 637–652ms |

Film: `p8-star-replay-film.png`. It uses a stepped clock (`sgNow`, `setTimeout` and WAAPI `currentTime`), so every frame is the exact state at T ms after the popup tap. It covers both directions, 3x shown at 4x and 1x shown at 2x.

**Tests:**
- Touch suite: the two obsolete S4 teaching cases were replaced in `star2/test6p8r.js`, so the count stays 84:
  - "popup star/unstar ×4 → replays every time, both ways; held while playing; right end state; key never read" (reduced: no replay, the state lands);
  - "row off screen → no replay".
- vtest gained **V30–V32b** in both modes:
  - V30: the star replay plays once and survives a re-render mid-replay;
  - V31: the unstar replay;
  - V32: rapid star/unstar/star toggles, where last wins with no leftovers;
  - V32b: an unstar then Mark Visited within 30ms on the same row.

### R3. Haptics everywhere logical
The popup star's real-tap path is now one generic `hapticTap()`. `HAPTIC_TAPS` = `.popup-star-tap, .popup-visited-tap, .form-star-tap`.
- **Added: popup Mark Visited / Unmark.** An `aria-hidden` `<label for="starHapticSwitch">` sits exactly over the button's box (measured equal in all 24 cases), at z 202, inside a `position:relative` slot. The click is forwarded one task later.
- **Added: the add form's STAR toggle.** It sets the same mark. Its −8/+8 pull-up moved from the button to the new `#starInputRow` slot, so the label covers exactly the 44px button. The shape categories now hide the slot.
- Android uses `navigator.vibrate`: 10ms to set, `[6,45,6]` to clear. That is the row gestures' rhythm, keyed off `aria-pressed`.
- The `:active` feedback is carried to the label via `:has()`.
- **Skipped, and why:**
  - The filter chips, city chips, sheet collapse, account menu and panel toggles are navigation or chrome, not a mark on a place. A tick there would be noise and would dilute the meaning of "you marked it".
  - Delete goes to a native `confirm()`. A tick before the confirm would say "done" before it is.
  - The Add Location submit is async and can fail. A tick at tap time would promise a save, and a later tick can't use the trusted-tap path, so it would be silent on iOS 26.5+.
  - The list-row tap is navigation.
  - The row swipes already tick.
  - Get Directions leaves the app.

| Check (`tap8r.js`: ios / android / ios-reduced × star / visited / form STAR) | Result |
|---|---|
| Real tap, on and off | 1 switch toggle each; Android `10` / `[6,45,6]`; 1 action; state flips |
| Label and switch clicks reaching the document | 0 |
| Focus after a touch tap | `body` (never on the switch) |
| Keyboard, Space then Enter | 2 actions, 0 ticks, 0 vibrates |
| N8-a: a mouse click | focus on the button, for all 3 targets |
| Label | the hit at its centre, `aria-hidden`, `for=starHapticSwitch` |

| Check (`haptic8r.js`) | Result |
|---|---|
| Original probes | 0 switch-focus frames and focus restored, from body, a row and the popup star; overlays open after a swipe star and erase; reduced motion ticks (iOS ×1/×2, Android `10`/`[6,45,6]`) |
| New targets | 0 document or window clicks, 0 switch-focus frames, 1 switch flip |
| Overlays | the same as main's direct tap: the popup keeps the dropdown and autocomplete open, as main does; the form STAR closes them, as main's direct tap on it does |
| **A11y tree (CDP, whole page, popup and add form open, plain and starred+visited)** | identical to main as a multiset; 0 checkbox/switch nodes |

One difference from main: a touch tap on Mark Visited now leaves focus on `body`, as the popup star already does, where Chromium used to focus the button. iOS never focuses on tap anyway.

### R5. UX S1: popups autopan clear of the top controls and the safe area
**Why:**
- p8 popups are 22–38px taller than main's, and the star sits in their top-left corner, which is where the zoom control is.
- With Leaflet's default 5px top padding, autopan pinned long popups under the zoom "−" and the "+" button.
- In a Home Screen launch it also pinned the title and star under the status bar, because autopan ignores the safe area.

**The fix:**
- Pin popups are bound through `bindPinPopup()`.
- It puts a *getter* on the popup's own `autoPanPaddingTopLeft`, which Leaflet 1.9.4 re-reads in `_adjustPan()` on every pan.
- The getter returns `(5, top)`. `top` is the lowest bottom edge of the zoom control, `#floatingAddBtn` and `#accountBtn`, measured from the map's top, plus `--s2` (8px).
- Those controls already include `env(safe-area-inset-top)`, so the padding follows the safe area without a second copy of the maths. That gives 82px in a tab and 141px with a 59px inset.
- It falls back to 84 if nothing measures.
- The sides and bottom keep Leaflet's 5px. Shape and "you are here" popups are unchanged.

`s1.js` is UX's `pan-comb.js`, extended: main vs p8 × 375/390 × inset 0/59 × long/bare × 7 marker positions (centred, and 12/50/88% across at 20% and 45% down). That is 112 opens.

| Measure | p8 (fixed) | main (`0e5113f`) |
|---|---|---|
| Star target blocked by a control, worst case | **0% in 56/56** | up to 77% |
| Long name, marker at 45%, 375 and 390, x 12/50/88% | 0 / 0 / 0% (inset 0 and 59) | 7 / 2.5–4 / 0% (inset 0); 77 / 27–46 / 0% (inset 59) |
| Long name, default centred open | 0% | 0% (inset 0); 22–37% (inset 59) |
| Title under the inset or a control | 0/56 | 28/56 |
| Popup overlaps the zoom control or "+" | 0/56 | "+" 38/56 |
| Popup top below the inset | 82–97px | as low as −54px |
| Marker hidden by the pan | 0/56 | 0/56 |

The 59px inset is simulated the way UX did it, by moving `.leaflet-top` and the buttons. So the real `env()` value on a device is an iPhone check.

**Scoped checks** (per the new gate rule; this change touches only popup binding and autopan):
- popup-open: 20/20, since list-tap → arrival → open → autopan is still intact;
- the S1 geometry above;
- Impeccable: exactly 3 baseline findings.

### R4. Star alignment
Not touched. It is the next loop's problem.

---
*(Sections 1–5 below are the p8 record; statements superseded by R1–R3 are marked.)*

## 1. Visit pop: 1.20× → **1.10×** (recommended)

Only the peak changed. Twist and dip scale with it; timing, offsets and per-segment easings are still the star's.

| Pop (real timing, 60Hz) | Peak | Frames within 0.02 of peak | Frames ≥1.05× | Dip frames ≤0.985 | Min scale | Twist |
|---|---|---|---|---|---|---|
| 1.20 (main) | 1.20 | 8 | 13 | 4 | 0.951 | −12 / +4 |
| 1.12 | 1.12 | 8 | 12 | 4 | 0.961 | −12 / +4 |
| **1.10** | **1.10** | **10** | **12** | **3** | **0.970** | **−10 / +3** |
| 1.08 | 1.08 | 10 | 11 | 3 | 0.975 | −8 / +2.5 |
| Un-visit lift (unchanged) | 1.12 | 6 | 9 | 0 | 1.00 | none |

Filmstrip: `p8-pop-compare.png`. It shows real compositor frames at 3x, displayed at about 4x. The un-visit row now starts t0 at the lock, and the strip wraps at 6 frames per row.

**Why 1.10:**
- It holds its peak longest (10 frames), so it still reads as a thunk rather than a blip.
- The 72px oval grows by 7px, where 1.20 grew it by 14px.
- 1.08 reads as a wobble.

**Visit and un-visit stay distinct.** The visit pop twists (−10 → +3 → −1.2°) and dips (0.97). The un-visit lift has no twist and no dip; it only rises, then pales. Their peaks now differ by 0.02, but their motion shapes don't overlap.

## 2. Popup Mark Visited / Unmark → the row replays (every time)

`vsReplay(id)` runs from the popupPane handler just before `toggleLocationFlag`. It reuses the gesture's own machinery (`beginVisitDrag`, `paintVisit`, `settleVisitDrag`) driven by a timeline instead of a finger:
- **Visit:** a 240ms bleed, then the press frame (ink + field + final truncation on one frame), then the new 1.10× pop.
- **Unmark:** 260ms into the erase lift (1.12×) and pale-out, then the reveal.

Rules:
- **When it plays:** only if the row is on screen, signed in, and the sheet is open. Otherwise the state just lands.
- **Plays once:** the row's re-render is held through `starHeld`, so a refetch or re-render can't cut it short or replay it. It is started by the click, never by a render.
- **Last wins:** a new toggle fast-forwards the running replay to its final state before starting.
- **Reduced motion:** no replay; the state lands.
- **No haptic from the replay:** `g.replay` suppresses the gesture's. *(Revised, R3: the popup tap itself now ticks.)*

Tests: vtest **V24–V28** (replay, glyph rule, un-visit lift, off screen, rapid toggles), in both motion modes. V16 and V17 were updated for 1.10.

*(Superseded by R2.)* **The star's popup → row replay before the revision:** `maybeTeachStar` runs only on **set** from the popup, never on unstar. It is capped at **2 ever** (localStorage). Off-screen rows are skipped and not counted, and reduced motion shows a static sketch. **I recommend matching visit for consistency:** every time, and on unstar too (the row erase). The cap was framed as teaching, but the owner's complaint ("the animation doesn't happen in the list") applies to both marks. That's the owner's call.

## 3. Popup layout

New order:
1. Title, with the star in its slot
2. Address, then notes (italic)
3. **Get Directions** *(superseded by R1: the shipped text button again, same place)*, was a real button: the brand's primary voice (`--figure` field, `--navy` condensed caps, 2px radius), full width, 36px tall plus a 4px invisible extension (44px target)
4. Bottom row: the category (glyph + word) on the left, **Mark Visited** on the right

**Circle on the right: yes.**
- It is now a trailing checkbox, so label then control reads naturally at the row's end.
- The category glyph owns the left edge, so a leading circle would sit beside another icon and read as a second badge.
- The popup's right edge becomes the one place for "state".

**Measured** (`popup8.js`: 6 content cases × 4 cities = 24; `p8-popup-geo.json`):

| Check | Result |
|---|---|
| Dead band, star target → Directions target | ≥8px |
| Dead band, Directions target → Mark Visited | 8px |
| Targets | star 44×44, Directions 44, Mark Visited 46 |
| Star target top | ≥5px inside the popup's top edge |
| Tap label | exactly over the star target |
| "Mark Visited" label | one line in all cases |
| Category | never clipped |
| AA: Directions (navy on figure) | 4.74 |
| AA: Mark Visited | 6.17 |
| AA: category | 6.17 |

**Popup width** is the same as main in every case: 241px content by default, and long names widen to the 300px cap. I caught and fixed a regression here: with a `1fr` column Leaflet stopped at the 240 floor, and long names wrapped to 3 lines.

**Accessible names:**
- `button "Star"`, pressed
- `button "Visited" / "Mark Visited"`, pressed
- `link "Get directions"`

**Kept:**
- the delegated `popupPane` click listener (unchanged);
- `.popup-star` at z-index 201 and the label at 202;
- `min-width` 240.


**Stills** (`p8-popup-before-after.png`): 3x shown at about 4x, and 1x shown at 2x. They cover before and after for 6 cases: bare; address + notes, visited and starred; notes only, starred; address only, visited; wrapped title with no address; wrapped title with address.

## 4. Popup star = the list's star

- **Size and slot:** 18px, in its own slot at the head of the text column. Column gap 8px, so the text indent is 26px, the same as the list's P1.
- **Measured:** gap 8.00, indent 26.00 in every case. Centre offset is 0.00px from the block it centres on.
- **Centring:** it spans grid rows 1–2, the title and the address.
  - **No address:** it centres on the title alone. Notes can run several lines, and centring on them would sink the star below the name it marks.
  - **Title wraps (with an address):** it centres across the whole heading block, as the list centres across its whole text column.
- **Target:** 13px on every side. With no address it is 9px up and 17px down, so it never reaches the map above the popup. The tap label shares the same rule.

## 5. Popup star: fade/pop, no draw (popup only)

**Star:**
- The fill fades into the outline over 100ms.
- The whole star plays the spin-stamp (`STAR_POP` table and easings, 380ms from the tap).
- The outline drops out on the frame the fill is full, under full ink and mid-spin.

**Unstar:**
- The ink fades off the outline over 240ms while the star lifts 1.12× with no twist (the row's erase pop).
- No rub and no dust. It rests on the hollow outline.
- This is the mirror I'd keep: same lift as the row, and the outline was always there.

**Peak: 1.4×**, the row's value (it was 1.35). The 1.35× cap existed because the old popup star sat 4px from the title. It now has the row's size and 8px gap.

| Measure (real timing) | Result |
|---|---|
| Frames ≥1.3× | 11 |
| Dip frames ≤0.97 | 3 |
| Rest | 350–367ms |
| Clearance to the title's first glyph | ≥4.68px (the same as the row) |
| Clearance to the popup's top | ≥11px |
| Unstar lift | 9 frames ≥1.05×, clearance 8.08px |

Dial: 1.35× gives 9 frames and 5.12px clearance.

Other details:
- **Reduced motion:** no scale or rotation, and the state lands.
- **Haptic:** one tick at tap time, as before.
- **Once-guards:** `popupInkId`/`popupRubId` still ensure it plays once per tap, with no replay after the save.

Removed:
- the popup pencil CSS (`.sgp-play`, 60ms strokes, ink at 316);
- `runPopupRub()`;
- the `play` option of `pencilStarMarkup()`;
- the `.sgp` pencil selectors.

The row gesture is untouched. *(The teaching replay was replaced by R2's `ssReplay`.)*

Filmstrip: `p8-popup-star-film.png`, before and after, star and unstar, at 3x and 1x. I fixed one flaw found there: on unstar the fading ink had flashed `--ink-2` on frame 0.

**Tests changed:** the touch suite case "popup: 1 tap plays pencil->ink once (no replay); unstar rubs out to hollow" was replaced (in `star2/test6p8.js`) by "**popup (p8): 1 tap fades + pops the star once, no pencil (no replay); unstar fades off with the lift to hollow, no rub/dust (no replay)**". `curve8`'s popup sampler works unchanged.

## Gates: the revision proto before S1 (md5 `e8a76bdd…`, on `3493217`), checked before and after

The S1 fix (R5) changed only the popup binding and autopan, so its checks are the scoped ones listed in R5, run on the final md5 `591c7dca…`.

I ran the full gate once, on the final rebased proto. That was before the coordinator scoped the gate down. The diff does not modify the touch plumbing: touchmove, lock, eatClick and the FLIP functions are untouched. `ssReplay` *calls* `mountPencilStar`, `flipToFinal`, `starCrumbs` and `releaseStarRow`, which is why the dust, glyph and replay checks matter here.

| Gate | Result |
|---|---|
| Star touch suite (`test6p8r`, both modes) | 84/84 |
| `flip6` | 8/8, control fails 4/4 |
| N8-a | ✓, now for all 3 tap targets |
| vtest (both modes, incl. V24–V32b) | **113/113** |
| popup-open | 20/20 |
| `ssrep` (star replay, both ways) | 64/64 correct; 0 dust-over-text frames; 0 glyph changes at rest |
| dust (row gesture) | 0 frames over text (100 runs); worst lift→move 121ms |
| rows | 56.00px |
| tap delay | 1.4–1.5ms |
| hand-off | 0 differing |
| `tap8r` / `haptic8r` / `ax8r` | all pass (see R3) |
| Impeccable | exactly 3: 2× clipped-overflow-container, 1× cream-palette |

**`curve8` ×10:**
- Popup: 11 frames ≥1.3× in 10/10 runs, and 3 dip frames.
- Row: 11 in 9/10 runs (one 10, the frame-phase jitter already on record).
- Highlighted row: 11 in 10/10.

## iPhone checks (only a device can confirm)
0. **S1:** in a Safari tab and a Home Screen launch, open a long-name place high on the map. The popup should settle below the zoom control and the "+", with the title and star clear of the Dynamic Island. Tapping the star's left edge stars it and never zooms out. The map shouldn't feel over-panned for a place near the top.
1. **Haptic, popup Mark Visited:** one click on every tap, visit and unmark, on any iOS ≥18 including 26.5+. No click with VoiceOver or a keyboard.
2. **Haptic, add-form STAR:** one click per tap, on and off. The row's tap area is unchanged: the pull-up into the textarea gap still belongs to STAR, not to the notes field.
3. **Haptic, popup star:** still one click per tap.
4. With the account menu or address suggestions open, tapping popup Mark Visited leaves them open. Nothing flashes, and focus never jumps.
5. **VoiceOver:** "Mark Visited, toggle button" / "Visited, selected" and "Star, toggle button" are unchanged. There is no stray checkbox, and double-tap toggles exactly once.
6. **Get Directions** reads as the old text link under the notes, and "GET DIRECTIONS" lines up with the category word below it. Tapping only the words opens Apple Maps; the space to its right does nothing.
7. **Star replay (popup → row), star:** with the list visible behind the popup, the row visibly pencils the star, then inks with the pop. It reads as the same act as the swipe, not a glitch behind the popup. It plays every time.
8. **Star replay, unstar:** the row visibly lifts, rubs out and drops the crumbs, then the name slides home. The crumbs never land on letters.
9. Rapid star/unstar in the popup never leaves the row half-drawn.
10. The 1.10× visit pop still reads as a thunk, distinct from the 1.12× un-visit lift.
11. Still open from p8: the popup star fade/pop; the popup→row visit replay.
12. Out of scope: the star's alignment (next loop).
