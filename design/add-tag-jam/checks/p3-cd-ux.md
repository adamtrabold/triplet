# Phase 3 build check (CD + UX), add-tag-p3 @ 65b145a0, 2026-10-19

Renders (local, not committed): CD `/tmp/claude-0/-home-user-triplet/059e9216-ffb6-56b1-9102-5c38b9dc3fec/scratchpad/renders/` (390-/375-/main- prefixes; approved boards in `.../scratchpad/canvas/`); UX `.../scratchpad/ux3/shots/`. Impeccable review packet (untracked): `/home/user/triplet/.claude/worktrees/agent-a4f69e7092bf3f463/design/impeccable-gate/reviews/2026-10-19-324b7bd33d15/`.

## CD: execution 6/10 (capped), matches approved CityDistance/CityChange
Owner objections predicted: (1) "Why is the tag cut off on my phone now?" — busiest tag scrolls/clips at 375x667 where main fits (city line ~34px + note ~18px); (2) "I moved it to Reykjanesbær and the header still says Reykjavík."; (3) "That line above New city is heavy" — last city row's rule + "New city" caption's top rule stack into a doubled band (caps at 6). Runner-up: "Reykjavík three times on one screen".
Fixes: 1 reclaim tag height at 375x667 (look change → owner sees 375 + 390 stills); 2 list title follows the place after a move/add (owner: "The header should show whatever the list is"); 3 one rule above "New city" (shared menu, add tag too); 4 signed-out slip copy doesn't cover changing the city; 5 at 375 the open city menu covers the + badge, orange sliver at its edge; 6 stills.js step 6 comment says greyed, build is navy. Audit P3: `.route-city` lacks `:active`/`--state-press`.
Rulings: button reading as printed text — accept (UX's call on discoverability); navy when signed out — keep; Village-of — backlog; **Impeccable `kicker-above-heading` — CD would defend waiving it** (owner-approved city line, a working control) via runtime-baseline entry with a written reason, operator-approved.

## UX: 1 BLOCKER, 2 should-fix
Pass: file under a non-matching city; the guess; both truths + note; new city and undo; failed save.
- **BLOCKER (discoverability):** at rest the Hanging Tag's city is plain caps with no cue; it is the only way to change a place's city; the add tag's same control has a chevron. Rule: it must read as changeable at rest, consistent with the add tag's city button; look is the designer's (no "FILED UNDER" labels — owner: "we do not need this on every tag").
- **S1 reveal leaks:** (a) a failed move un-hides the target city and rollback doesn't re-hide it; (b) in an open plan, moving a stop un-hides its new city though stops never hide — reveal only when the place would otherwise disappear.
- **S2 menu reach:** with ~14 cities the menu covers its trigger and "+ town" needs scrolling; keep the trigger visible and "+ town" findable.
Rulings: 2 accept; 3 accept; 4 accept; 5 accept; 6 accept behaviour, copy nit (designer); 7 accept; 8 accept for landing, should-fix soon: strip leading "Village of / Town of / City of" in `townOf()`; **9 list title keeps the last go-to: ACCEPT** ("filing is not navigating", job 12).

## Conflict for the owner
List title after moving/adding a place into another city: CD says follow the place (owner: "The header should show whatever the list is"); UX says keep the last go-to (filing ≠ navigating).
