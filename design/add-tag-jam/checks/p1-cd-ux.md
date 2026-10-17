# Phase 1 build check (CD + UX), add-tag-p1 @ 0bd1e32, 2026-10-17

Lane 2's one combined check. Two fresh agents, run in parallel. Their reports are below as they came back,
lightly condensed. Renders are local to this session (worktree paths, not committed):
- CD: `/home/user/triplet/.claude/worktrees/agent-a4350cec874afa857/cdcheck/renders/` (A–L @1x/@3x), `crops/`
- UX: `/home/user/triplet/.claude/worktrees/agent-a827fc397a0ebdece/ux-p1/` (a–o2)

## UX — two BLOCKERS

| Job | Result | Evidence |
|---|---|---|
| Go to a city | PASS | menu → Reykjavík: map centre z11, list scrolled to header, all 105 rows kept |
| Going there changes nothing shown | PASS | panned to Malmö, its pins present |
| Re-pick current city recentres | PASS | |
| Show/hide cities | PASS | eye: 105→84 rows, pins gone, map still; persists on reload |
| Go to hidden city shows it | PASS | |
| Kind then item | PASS | opens on current kind; "Plans 3 ›" swaps without closing; Esc closes |
| Follow a plan (legs) | PASS | recurring city gets 2 headers; leg tap frames leg |
| Tap list item → map | PASS | |
| Rename/delete plans | PASS (⋯ target only 28×28) | |
| **Build a plan by filtering places** | **BLOCKER** | open plan's "Add from all places (112)" block is unsectioned, mixes all cities (`h-plan-addable.png`). No way to narrow to a city from Plans: menu city items leave Plans, eyes exist only in Places. Workaround = leave plan, hide 4 cities, return, unhide later. Main's city chip narrowed this ("Add from Copenhagen") — regression. |
| **Reorder stops across legs** | **BLOCKER** (builder flag 11) | dragging stop 2 ~1.5 rows: next stop slides under the Malmö header and covers it, "3" clipped (`n2-drag-across-leg-top.png`); can't see which leg you drop into; stop jumped 2 places; one drag → 5 legs. Near list bottom, auto-scroll + 112px drag sent stop 2 to last (`n-drag-across-leg.png`). |
| Plans with hidden cities | PASS (code) | |

UX's proposal for blocker 1: in an open plan, the "Add from…" block gets the same city sections, working eyes, tap-name to go to — needs a short designer pass and the owner sees it. (The spec marked the unsectioned block "(we think)".)

Blocker 2: during a drag, headers move with the rows and the preview matches where the stop lands. Add a plans.js case dragging across a leg header.

State: with the gone-to city hidden (e.g. every city hidden), the title still reads "COPENHAGEN 23" over an empty list; `cityTally()` counts hidden places. Fix: fall back to "All places" + shown count (or 0). Title not following pan: keep. Nit: after leaving Plans via a city, the remembered plan has no check on the Plans side.

Convention/a11y: title button target is 226×22 — must cover the full 52px header band. Plans-row ⋯ 28×28 and section eye 28 wide — ≥44. Collapse tab 44×24 acceptable but tight.

UX rulings on builder flags: 1 menu opens above — accept · 2 hidden contrast — fix (name ≥4.5:1, tally ≥3:1, closed eye carries state; designer picks how) · 3 title truncation — accept · 4 "Add from all places" — accept for now, changes with blocker 1 fix · 5 empty city titles "All places" — accept · 6 7px strip — designer's call · 7 ⋯ before › — accept order, target to 44 · 8 only user go-to unhides — accept · 9 zero plans — accept · 10 hiding closes tag — accept · 11 — BLOCKER · 12 number-only stops — accept.

Smaller: menu says "All cities 115", title it sets says "All places 115" — two names for one state.

## CD — execution 6/10 (capped)

Holds up: type voice, menu reuse, icon column, compact first section, K2 tab, stamps/stars/56px rows untouched, leg headers drop the eye.

Predicted owner objections:
1. "Why does the dropdown jump? It opened above, I tapped Plans and now it's below, and wider. I saw it open under the title." (builder 04→05; CD D→E)
2. "I said the first row doesn't need all the extra padding. Every time I pick a city there's a big empty band under the header." (go-to lands the city header with full 60px air under the title; builder 02, 08b; CD B)
3. "What are all these dots on the plans list? I didn't see those." (⋯ + › on every row; builder 06, CD F)

Rejected-pattern match: the ⋯ on every plans row (dots / unneeded marks, owner never saw it) → cap 6.

Fixes:
1. Title menu must not change position or width when the bottom row switches kind: lock to the side it opened on, one width for both kinds. With real data it always opens above at default sheet height — differs from what the owner saw (under the title). Either fit below (scroll inside) or show the owner "opens upward" in final stills.
2. Go-to landing: target city header lands compact under the list header (scroll past the air, or `is-first` treatment for the header at top).
3. Hidden contrast: fix. CD's call: name + tally in `--ink-2` full strength (6.17:1), closed eye carries state; same for `.menu-row.is-hidden` (.55 = 3.4:1). Owner sees it in final stills.
4. ⋯ on plans rows: remove from the look; rename/delete needs a home with no per-row mark (UX picks where). If it stays, owner sees it first.
5. Divider caption: drop brackets, "(112)" → standard quiet tally.
6. Zero plans: show the list's "+ New plan" row, not the old outlined NEW PLAN button (two looks for one action).
7. Truncated title: ellipsis-to-tally gap 13px vs 6px untruncated — match.
8. Lowered sheet: hairline then 7px bare paper — hide header rule when lowered, or size strip to header.

Gating: not ready. After fixes, owner needs final stills of the menu (position/width), hidden-city colour, plans list.

## Impeccable review (run by CD)
Gate FAILED: runtime 2 new `low-contrast` (hidden header #828a8e on #f2ebdd 3.0:1; #a6a195 2.2:1). Packet `design/impeccable-gate/reviews/2026-10-17-91c4119cc95d/` (in the CD worktree; REPORT.md not written).
- critique 27/40: P1 menu jumps/changes width (`placeTitleMenu()` re-runs on switch); P1 go-to 60px air; P1 hidden contrast; P2 ⋯ per row; P2 "(112)"; P2 two New plan looks; P3 ellipsis gap; P3 7px strip.
- audit 14/20: P1 contrast; P2 `<h2>` inside `<button id="titleBtn">` (invalid); P3 eye changes label AND sets aria-pressed (double announce); P3 section headers aren't headings; P3 ⋯ 18px beside 16px ›.

## Conflict to resolve
⋯ on plans rows: UX accepts it (target to 44); CD removes it from the look (no per-row mark). Rename/Delete needs a home either way.
