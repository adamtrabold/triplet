# Brief: The STAR ACTION — back to the drawing board

Repo /home/user/triplet, single-file `index.html` (vanilla JS/CSS, Leaflet + Supabase), NO build step, ever.
Branch claude/visited-state-badge-list-yultpy. READ `/home/user/triplet/CLAUDE.md` first (UX principles, the
full shipped log, and the two newest entries: "List click always opens the popup" and "Personal priority star
(Baedeker star)" — both built on this branch, NOT merged).

## What happened
The team shipped (to a branch) a star that's set from the map popup or an add-form toggle, and ruled out any
list-row interaction (per-row target, swipe, long-press) plus proposed a batch "Star…" mode. The CD scored it 9.
**The owner rejected the interaction.** Their words, verbatim:

> "starring in bulk doesn't seem useful if it's easy to do from the list row — a fast interaction on any item
> negates the need for it. I'd like as few interactions as possible for both the star action and the popup
> action. I get why it shouldn't be ever present in the list row and agree, but swiping on a row doesn't feel
> as egregious of a Safari risk when you consider it's only from the edge that that happens. These solutions
> are feeling very average and I want more intentionality, uniqueness, and whimsy. I want it to feel effortless
> and considered but not because it matches what every other app does — I want it to do it better. Let's go
> back to the drawing board with the Star action."

## What the owner has now decided (don't relitigate)
- Starring must be FAST, directly from a list row (and fast from the map/popup too). Fewest possible interactions.
- No ever-present star control on every row (agreed with the team: clutter/mis-tap).
- Batch "Star…" mode is dropped — a fast per-row action makes it unnecessary.
- Swipe is NOT ruled out: Safari's back-swipe only triggers from the screen's very edge. The team previously
  over-weighted that risk. Measure the real edge zone rather than assuming.
- "Popup action" also wants minimum interactions: a list tap should open the place's popup in one step (the
  popup-open fix on this branch does that — keep it); anything the owner does in the popup should be one tap.
- The bar is NOT "safe and conventional". It's: **intentional, unique, whimsical, effortless, considered — better
  than what every other app does, not a copy of it.** A generic swipe-to-reveal-a-button (iOS Mail) is the
  baseline to BEAT, not the target.

## Still true (constraints)
- The row stays calm and delete must stay hard to hit by accident (the owner's mis-tap history is why the row is
  delete-only). Row tap = navigate + open popup — must stay one tap and not be delayed (e.g. a double-tap gesture
  that forces a single-tap delay would be a real cost — quantify any delay).
- Brand world: vintage travel ephemera — passport stamps (the shipped VISITED stamp is the craft benchmark), hotel
  luggage labels, matchbooks, national-park posters, Baedeker guides. Inspo in `design/inspo/`. Whimsy should come
  from THIS world (e.g. physical metaphors of stamping, punching, pinning, dog-earing, ticking a guidebook),
  not generic confetti.
- Phone-first (iPhone, iOS Safari). No build step — gestures must be hand-rolled with Pointer/Touch events and
  must coexist with vertical list scroll, the scroll-then-tap fix in `createCard()`'s `addActive`, the bottom
  sheet's own drag (check how the sidebar/sheet is dragged on mobile), and Leaflet.
- Accessibility: any gesture needs a non-gesture equivalent (the popup star can remain that path); respect
  `prefers-reduced-motion`; screen-reader state via the existing single-source `.sr-only` pattern.
- AA for text, ≥3:1 for meaningful marks, in every state incl. all 5 cities' `--figure-deep`; 56px rows uniform.
- Data: `locations.starred boolean not null default false` already exists in the live DB (migration applied).
- The star's DISPLAY (12px `--figure-deep` star before the name; ink star with paper halo on map pins) was
  approved and the owner didn't object to it — keep it unless the new action genuinely calls for a change
  (e.g. the mark the action leaves behind should feel like the result of the gesture).
- Impeccable: `npx -y impeccable@4.1.0 detect index.html` → exactly the 3 baseline findings.

## Process rules
- Review at 3x AND ~4x crops, plus 1x; measure (Playwright) everything claimed; say what only an iPhone confirms.
- Motion/gesture work can't be judged from stills alone: produce short frame sequences (filmstrips) or a
  recorded video (Playwright `recordVideo`) of each gesture at 390px, including the reduced-motion version.
- Previous round's materials (what was rejected and why) are in `loop/star/` — r1/r2/r3 design, UX, CD files.

## Tooling
Playwright + Chromium: `NODE_PATH=/opt/node22/lib/node_modules node script.js`, `executablePath:
'/opt/pw-browsers/chromium'` if needed; touch emulation via `hasTouch: true` + CDP `Input.dispatchTouchEvent` for
real swipe paths. Harness: `loop/rows/r1-lib.js`. The live app's data can't load here — inject rows.

## Working folder
/tmp/claude-0/-home-user-triplet/ff59149f-a142-59f7-989c-71e5f360daff/scratchpad/loop/star2/
Do NOT edit index.html or the database until the operator says the CD approved.

## OWNER CLARIFICATION (added after round start) — supersedes "beat iOS Mail, don't copy it"
"Sometimes it is fine to copy if it's the right solution. Clear did that concept years ago and it was amazing.
It's not novel now but the interaction patterns are great and an example of what I'm talking about with pushing
things forward."
Novelty for its own sake is NOT the goal. A familiar gesture is fine — even best — if it's the right one. The bar
is Clear-level (Realmac, 2012) EXECUTION: gestures ARE the interface; the row physically responds and reveals
meaning continuously as you drag; the commit threshold is felt; the settle motion is satisfying; feedback is rich
but brief; no chrome; consistent across the app. Judge by that, in this app's own vintage-travel voice.

## OWNER CORRECTION (latest — overrides the tone of the clarification above)
"I'm not saying to do the Clear thing." Clear is only an EXAMPLE that (1) reusing a proven pattern is acceptable
when it's the right solution, and (2) of the quality bar. It is NOT a template, a direction, or a preference for
swipe. Concept exploration stays fully open; judge on intentionality, effortlessness, considered detail, whimsy.

## OWNER FEEDBACK AFTER SHIPPING TO MAIN (2026-09-28, on their iPhone) — round 4
Verbatim: "It's a little fast I can't see it — also it feels a bit too pointy maybe it should be softened? Also maybe
it should move both lines of text / be bigger? Not sure on that one with it next to the category icon but it does
feel a little weird."
1. TOO FAST TO SEE. Ambiguous which moment — investigate all of: the pencil drawing during the drag (strokes
   happen over only ~40px of finger travel, 16→56, so a natural swipe blows through them), the ink landing (160ms
   press-in), the release settle, and the popup draw (40ms/stroke, ink at 220ms). The owner must actually SEE a
   star being pencilled. Consider decoupling the drawing from raw finger distance (e.g. the drawing completes on its
   own timeline once armed, or plays out after release), without making the gesture feel laggy or the commit
   dishonest.
2. TOO POINTY — soften the star (rounder points / softer joins / hand-drawn pencil softness), for BOTH the pencil
   sketch and the printed ink star everywhere it appears (list, popup, map, add form) so they stay one mark.
   Keep it unmistakably a star at 12px and 1x.
3. SIZE / PLACEMENT FEELS "A LITTLE WEIRD" — owner is unsure, so this is exploration, not a mandate: a bigger
   star that spans BOTH text lines (name + meta), and the drag moving both lines; weigh against the category glyph
   badge that already sits at the row's left (two icons side by side?). Show options (at least: current 12px
   inline; a two-line-tall star in its own slot; any better idea) at 3x/4x/1x in a real list, with the truncation
   cost measured. Recommend one with reasons the owner can relay.
Everything else from rounds 1–3 stands (edge guard, lock, scroll handoff, 0ms tap, FLIP, feathered edge, honest
rub-out, popup path, teaching). Work against index.html on main (Pencil Star is live there).

## OWNER FEEDBACK (2026-09-28, live, after rounds 4–6 merged) — round 7, perfection stage
Verbatim: "I want the animation angle to be more dramatic as well as the pop — it should have more of a size shift
in the pop getting slightly larger then going down to the correct size. It doesn't look intentional enough yet."
1. POP: a real, legible overshoot-and-settle on the ink landing — star visibly grows past final size ("slightly
   larger"), then settles to the correct size. Current = 1 frame @1.15× + 1.1→1 over 140ms: too subtle to read.
   Must read as deliberate at real speed on a phone; keep the peak crisp (no blur hang) and never grow into text.
2. ANGLE: more dramatic rotation in the animation (e.g. the star lands with a bigger lean/twist and settles to its
   rest angle, and/or a steeper sketch lean than −7°). Interpret "animation angle" across draw + land; propose.
Applies to row stroke AND popup star (one mark). Reduced motion: no scale/rotate. Everything else stands.
3. HAPTIC "CLICK" (owner, added to round 7): "I'd want to feel some sort of 'click' as the star completes being
   drawn." iOS Safari has no Vibration API; the known workaround is toggling a hidden `<input type="checkbox"
   switch>` (iOS 17.4+; haptic on iOS 18+) programmatically inside a user-activation window. Time it to the ink
   landing / pop (the "finish" beat). Risk: the landing happens ~300ms+ after touchend — verify against WebKit's
   transient-activation rules; if it may fall outside the window, fall back to firing at release (or at the 56px
   commit crossing, which is inside touchmove). Must fail silently everywhere (Android: `navigator.vibrate(10)` is
   fine; desktop: nothing), never steal focus, never be announced by screen readers, never render visibly, no layout
   shift; respect reduced motion? (haptics aren't motion — decide and justify). Unstar: decide whether it clicks too.
   Only the owner's iPhone can confirm — list it as a check.
   OWNER DECISION: unstar/erase clicks too — at the erase's finish beat (ghost vanishes + dust at commit).
   OWNER DECISION: YES to a popup-star real-tap haptic (trusted tap on a label wired to the hidden switch — works on iOS 26.5+). Owner says their iOS is fine.
