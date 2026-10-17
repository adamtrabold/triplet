# Operator handoff — add tag + city jam → build (2026-10-17)

For the next operator session. Read CLAUDE.md first (process, gates, roles).

## Where things are
- **Design branch:** `claude/elegant-galileo-1c5ntm` — all design work lives here, not on main
  (main is at 90c396e). Also holds `design/icon-system/` (a separate icon session's work).
- **This project:** `design/add-tag-jam/`
  - `handoff.md` — the build spec, 4 phases, "How it works" + "How it looks and feels". START HERE.
  - `owner.md` — every owner quote, verbatim. `history.md` — decisions, one line each.
  - `jam.md` / `jobs.md` / `notes/` — reasoning history. `stills/`, `snapshots/` — images.
- **Canvas (decided screens):** https://claude.ai/artifact/6aSGgGczYGfWGP1UqTDGP3 —
  "Now" page = decided boards (green "Decided" stickies); "Archive" = everything else.
  Board HTML: `read` path `project/<Board>.dc.html`.
- **Design system:** https://claude.ai/artifact/JXWsMZs32JyKdcEzakKrPW (Triplet).
- **Trip model (background):** `design/trip-location-model/` — trips dropped; city buckets decided.
- **App docs:** `docs/architecture.md` (also as a page: https://claude.ai/artifact/5UNGq7t3VN5WsnbxCEdT3u).

## Designer memory
- `notes/visual.md` (190 lines) and `notes/systems.md` are the designers' running notes; `handoff.md` is the spec.
- `canvas-src/gen2.py` + `canvas-src/project/` — the canvas generator and every board's source (copied from the old session's scratchpad, which is gone). To change the canvas: edit/regenerate here, publish to the canvas url with `root` = canvas-src.
- The designer/systems agents themselves don't carry over; a new session starts fresh agents and briefs them from these files.

## Status
- Every canvas decision is made; nothing on the canvas waits on the owner.
- Owner approved building: "Great to build". Lane 2 (feature): ONE builder per phase, worktree,
  stills to owner before landing; ONE combined CD + UX check + `design/impeccable-gate/run.sh --review`
  on the finished build (owner asked whether it had "gone through impeccable" — it runs on the build).
- Phases (each lands separately): 1 list/title/sections/collapse · 2 add tag · 3 city-bucket model ·
  4 map city badge. No DB migration in any phase. Phases 1 and 3 need the full gesture gate.

## Open with the owner
- **Phase 2 scope:** the canvas add tag (blank-tag form) was never built — today's form is plain
  `#addForm`. Asked: A) build the new tag whole, or B) put the decisions into today's form first,
  tag later. No answer yet.

## Owner working rules learned this round
- Terse plain-language messages; one per real event. Owner reads on a phone.
- "When I say something is good that means ship it" (CLAUDE.md).
- Never label options with codes (T1, I2…) — use short plain names.
- Canvas comments: the owner often doesn't "send to Claude"; read all threads for unanswered
  owner comments, not just notifications. Answer un-activated ones in chat.
- Show real app elements on boards; no mocks; no blue "NEW" outlines by default.
- Owner dislikes process overhead; skip ceremony, keep records (owner.md, history.md) current.

## Backlog items added this round (on main)
- Automated Photon-vs-Nominatim search trial (owner: "I want the test automated not manual").
- Edit a place after adding it; first open centres on the user's location (shipped 2b9ffcc).
