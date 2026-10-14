# Builder notes: sign-in badge

## Status (2026-10-14, round 1 of the build)
Built into `index.html` on `claude/elegant-galileo-1c5ntm` from `handoff.md`
(round 2e, owner: "Sign in is great"). Not on main: next is the director's
score, the systems walk, the reviewer, then the combined CD + UX check and the
owner's final stills. Stills: `design/signin-button/build/` (`stills.js`
regenerates them).

## What's built (all in `index.html`)
- **Markup:** `#authModalContent` is `role="dialog" aria-modal aria-labelledby`;
  `#authModalLine` (the sheet's one line), `#authError` is a polite live
  region; `#accountBtn` carries `aria-haspopup`/`aria-expanded`, its glyph is
  `aria-hidden`; `#accountFocus` (the scalloped focus ring) sits directly after
  `#accountBtn` (the `+` sibling selector depends on it). Login/Logout copy is
  now Sign in / Sign out everywhere.
- **CSS:** `--account-slot-right` (new token: button, ring and dropdown share
  the slot's x), `--badge-edge` / `--badge-contact` (the paper die's warm edge
  and 1px contact shadow, from `--warm-edge-rgb`), `#accountBtn.signin` (the
  button paints nothing; the SVG is the badge; pressed via `--sb-face:
  var(--paper-pressed)`), `#accountBtn.swap` (transition off for one-frame
  swaps), `#accountFocus` (paper 4px + navy 2px, scallop x1.16), busy sheet
  and "Signing out…" via `--state-off-alpha`.
- **JS, "ACCOUNT BADGE + SIGN-IN" section** (replaces the old auth functions):
  `SCALLOP_PTS`, `SIGNIN_BADGE` (V[14] numbers), `STRIKE_SCALE`, `STRIKE_INK`
  (the handoff's ms table, r 21 at 130ms), `ARRIVAL`, `SIGNIN_ERR`,
  `SHEET_LINE`; drawing ported from badge2.js (`badgePerson`, `signinArc`,
  `badgeBlotPts`, `badgeDryPts`, `badgeInkLayer`, `signinBadgeSvg`);
  `centreSigninArc()` measures once after `document.fonts.ready` (Chromium:
  2.91deg, default kept as `ARC_ROT`); `setAccountBadge()` (the only place the
  name/role swap); `playStrike()` (WAAPI scale from STAR_POP's offsets/easings,
  ink driven from its currentTime); `startArrival()`/`finishArrival()` (hold
  until `bootLoadDone` + 250ms, 3s cap, tap finishes); `playDryUp()` (an empty
  WAAPI clock of `DRY.MS`, k from the DRY constants + `dryEaseThr`);
  `afterBadgeSettles()` (transitionend background-color or 150ms);
  hop marker (`writeAuthHop`, read+removed at boot into `authHop`,
  `restoreHopView` after the boot load); `login()` with busy, 15s timeout,
  plain errors, storage check; `logout()` with "Signing out…", error banner,
  dry-up, reload; Esc + Tab trap for the sheet.
- Playground paints the badge synchronously at boot; real mode stays hidden
  until `checkAuth()`.

## Decisions (mine, all build-level) and why
- **Hop marker is written before the request AND the playground listener
  skips while `loginInFlight`** (the handoff offered either; both is safest).
  The listener also skips when no session is stored: real supabase-js still
  emits SIGNED_IN when storage is blocked, which would have reloaded into the
  playground and defeated the storage-blocked message (found by the test).
- **Strike clock = the scale animation itself** (one animation, rAF reads its
  currentTime); the dry-up uses `el.animate(null, {duration: DRY.MS})` as its
  clock. No literals for 380/540: `STAR_POP_MS`, `DRY.MS`; keyframe offsets and
  easings are read from `STAR_POP`.
- **Frames re-render the badge's SVG** (fresh clipPath ids per frame) rather
  than mutating attributes: 50px, ~23 frames, simplest correct port of
  badge2.js.
- **Click-outside uses `composedPath()`**: a tap that finishes the arrival
  replaces the badge's content under the finger, so `contains(e.target)` would
  have closed the dropdown it just opened.
- **Esc on the sheet stops propagation** so the tag's own Esc handler (later
  on `document`) doesn't also close an open tag behind the sheet.

## Interpretations to confirm (flag to UX)
1. **Focus after an error other than wrong-password** (offline, 429, other,
   storage): the handoff says the fields are kept but not where focus goes; I
   focus Password (Enter retries). Wrong password: Password, as specified.
2. **Focus on close for the 'edit' form** (from an edit or the tag's slip):
   the handoff says "returns to the badge"; for the edit form I return it to
   whatever had focus when the sheet opened (the control you tried), and to
   the badge for both badge forms. iOS doesn't focus tapped buttons, so on a
   phone that's usually nothing.
3. **Enter in Email** does not submit (handoff: button, or Enter in Password;
   unchanged from today).

## Deviations from the handoff
- None in look or behaviour that I know of. The auth error line keeps today's
  position (below the buttons); the round-1 flow prototype had moved it under
  Password, but the handoff says `#authError` is unchanged.

## Checks run (all pass) -- scoped to the diff
- `design/impeccable-gate/run.sh index.html`: IMPECCABLE GATE PASSED (static
  3/3, runtime 13/13, 0 new, 0 missing; no baseline change).
- `design/signin-button/signin-test.js`: 36/36 (rewritten: the handoff's
  arrival rules -- Strike once, reload none, Reduce Motion, another tab, double
  submit, wrong password, every error message, storage blocked, Esc, Tab trap,
  busy, sign-out states and error, view + tag carried both ways, tap during the
  arrival, signed-out real mode in place, focus ring).
- `design/signin-button/mode-test.js`: playground writes never reach the
  client; sign in -> real; sign out -> playground (updated: the badge opens the
  sheet directly; waits for the Strike).
- `design/signin-button/play-test.js`: updated to load signed out (it had been
  testing real mode since the playground became the signed-out app).
- Gesture harness `popup-open` 20/20 + 20/20, `rows` 56.00px (signed-in stub
  only; see backlog).
- Shared setup: `design/signin-button/signin-lib.js` (stub where the mode
  follows the stored key, scripted sign-in/out outcomes, a badge recorder).

## Open gaps
- **Beside the new +** (job 4): not checkable until the + team has a build.
- **Safari:** arc centring (2.91 is Chromium's), 6px caps at 700, the warm
  edge -- added to `docs/iphone-checks.md`.
- The paper badge isn't covered by the gesture harness or the Impeccable
  runtime layer (both signed in) -- backlog.
- `docs/shipped.md` entry and the backlog close-out happen when it lands.
