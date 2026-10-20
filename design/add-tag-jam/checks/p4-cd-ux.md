# Phase 4 build check (CD + UX), add-tag-p4 @ 796a41ed, 2026-10-20

Live DB has the same 5 cities as the fixture (Copenhagen 54, Stockholm 48, Reykjavík 45, LA 28, Malmö 27) — the busiest real state. Renders (local): CD real-tile renders `/tmp/claude-0/-home-user-triplet/059e9216-ffb6-56b1-9102-5c38b9dc3fec/scratchpad/renders/` (c-z4, e-z6, f-z7-cph-malmo, j-after-allcities-tap, crop-*; @1x/@3x); UX `.../scratchpad/shots/` (j1–j5). Impeccable packet (untracked): `/home/user/triplet/.claude/worktrees/agent-a7d3d3a9c5d30d82e/design/impeccable-gate/reviews/2026-10-20-34ceb010dea3/REPORT.md` (--check-review blocked on 2 P1s).

## UX: 2 BLOCKERS
1. Go to a city from the zoomed-out map — BLOCKER for Copenhagen: Malmö's badge covers it at every badge zoom (39px strip left at z6); name and count unreadable. Other cities PASS.
2. "All cities" — BLOCKER: lands z3 mid-Atlantic, Reykjavík clipped, Copenhagen/Malmö/Stockholm/LA off screen. Rule: after the tap every shown city's badge is on screen and readable at 390px. Fix the menu's "All places" fit too.
PASS: list unaffected by zoom; list tap from badge zoom lands at SOLO_MIN_ZOOM with tag; zoom out + pan; hidden/chips; Plans no badges; cluster tap.
Rulings: overlap BLOCKER (fix is the designer's: merge/offset/…); framing BLOCKER; label "All cities" vs "All places" nit (lean "All places"); hidden in add tag OK; **hidden in Plans needs the owner's yes**; zoom 8 OK; 24px clearance OK; cityTally OK. Nit: add a test "after All cities every shown badge fully in view at 390px".

## CD: execution 5/10
Badge itself ≈8 (matches board; contrast 14:1 / 6.5:1; 44px target). Fails in the busiest real state:
- Copenhagen/Malmö collide at every badge zoom; Malmö's box sits almost inside Copenhagen's → tapping "Copenhagen" goes to Malmö (function bug).
- "All cities" lands over the ocean (LA x=−219, Nordics off screen).
- Owner hasn't seen these states (board placed badges by hand).
Predicted objections: "Copenhagen and Malmö are on top of each other…"; "I tapped All cities and got the ocean with half a Reykjavík"; "one name for one state… And what is this icon?" (owner asked "what is this icon?" of this glyph on the board; a similar ring "is the 'my location' button right now so it's confusing").
Also: Stockholm's badge slides under the account badge at z6; the white All cities box is near the badges' weight.
Fixes: 1 badges never overlap each other or map controls (designer; owner sees it); 2 All cities framing rule (designer + UX; owner sees it; fix "All places" too; badges stay inside the screen after the fit); 3 one name (match "All places"; fixes label-in-name a11y miss); 4 re-show the owner the ring glyph; 5 badges clear of account badge and +; flags: Plans/add-tag hide accept; zoom 8 accept; update clearance lists; add a zoomed-out badge state to the Impeccable gate (needs --update approval); cityTally accept.

## Owner question pending
"All cities" hidden in Plans (UX: needs the owner's yes; CD: accept).
