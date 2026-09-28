# List ordering — concept-stage proposal

Owner problem (2026-09-23): the sidebar list's order is an accident, not a
design — `locations` is fetched `.order('created_at', {ascending:false})`
(`index.html` ~line 2379) and `syncLocationCards()` (~5174) renders
`visibleLocations()` (~2817, filters only, per the "list = everything that
matches filters" rule) in that same order, untouched. Nothing groups by
visited, starred, or proximity. This doc is discovery only — no code
changes.

## 1. What is the list for?

Two real jobs, not one:

- **Pre-trip planning (couch, laptop or phone, no map context that
  matters yet):** browse/audit everything in a city — "did we capture
  every idea", "what categories are thin", "let's decide what to skip".
  Wants **completeness and scannability**, not a "next" pointer. Recency
  (current order) actually kind of works here by accident — newest ideas
  surface first while the list is being built up — but it's incidental,
  not chosen for this purpose.
- **On-the-ground (phone, in a city, walking):** "what's left near me /
  what haven't we done yet". Wants a **shrinking, actionable list** —
  visited stuff is done, starred stuff is important, unvisited-and-close
  stuff is next. Recency is actively unhelpful here — a place added
  first (early planning) sinks to the bottom just because it was typed in
  early, not because it's less relevant to today.

These two jobs pull in different directions (completeness-for-browsing
vs. progress-for-doing), but the trip has two phases in time, not two
simultaneous UIs to build — by Sept 2026 the owner is not "pre-trip
planning" any more, they're on the ground. **One good ordering that leans
on-the-ground is fine**, since pre-trip planning tolerates a worse-but-
still-complete order (nothing is hidden, only reordered), while
on-the-ground tolerates zero "hunt through everything" friction. This
argues against a mode toggle (extra UI, extra state, the owner's low-
friction bar from the trip/place item applies here too) and toward picking
the ordering that serves the phase that matters most when it matters —
with visited/starred visual treatment (already shipped) doing double duty
as the "is this still open ground" signal for the planning phase too.

## 2. Candidate orderings

All candidates keep `visibleLocations()`'s filtering untouched — city and
category filters are unaffected, only the order of what's already visible.
Shape rows are unaffected (own block, own `createShapeCard()`); shapes
have no `starred`/`visited` column so nothing below changes their order.

### A. Starred-first, then category, then created_at within category

Sort key: `(!starred, category, created_at desc)`.

- **On-the-ground:** starred items always float to the top regardless of
  visited state — "the things I care about most" stay visible, but a
  starred-and-visited item never leaves the top, which fights the "what's
  left" scan (a visited star still occupies prime position). Category
  grouping helps when you're deciding "let's do food next" but doesn't
  help "what's nearby" (category has no relationship to walking distance).
- **Planning:** category grouping is genuinely good for auditing —
  "how many restaurants do we have" is a category-clustered question.
  Starred-first is neutral-to-good (surfaces the must-dos at the top of
  the audit).
- **Cost:** ties list order to `CATEGORY_COLORS` insertion order (or
  needs its own explicit category ranking) — another place category order
  matters, alongside the filter chips (CLAUDE.md already flags filter-chip
  order and the add-form category dropdown as independent; a third list
  would need to explicitly stay independent too, per that same principle).

### B. Unvisited-first (visited sinks, starred wins ties)

Sort key: `(visited, !starred, created_at desc)` — i.e. all unvisited
rows (starred unvisited first, then plain unvisited), then all visited
rows.

- **On-the-ground:** this is the "what's left" list almost literally —
  the moment something is marked visited it drops below everything still
  open. Directly reinforces the existing `.is-visited`/`--paper-filed`
  background (visited already *looks* receded; now it also *sits* at the
  bottom, so look and position agree instead of a visited row still
  sitting stuck mid-list above things not yet done).
  Starred-but-unvisited still ranks above plain unvisited, so "important
  and not done yet" is the actual top of the list.
- **Planning:** weaker here — early in a trip almost nothing is visited,
  so the sort is a no-op and the list is just recency again (fine — see
  §1, planning tolerates a mediocre-but-complete order). Later in the
  trip, planning a *remaining* day is actually helped by this ordering
  too (it's the same "what's left" question, just asked from a chair
  instead of a sidewalk).
- **Cost:** a row visibly *jumps* position the instant it's marked
  visited (mid-list to bottom) while the popup/swipe-visit animation is
  playing on it — worth a UX check on whether that's satisfying (closure)
  or disorienting (row vanishes from where your thumb was). `cardSignature()`
  already includes `visited`, so `syncLocationCards()` already re-renders
  on that change; a re-sort on the same tick would need `insertBefore` to
  move the DOM node too (currently it only reconciles content, index
  order comes for free from the array order — this candidate requires
  actually sorting the array before rendering, a real code change but a
  contained one).

### C. Starred-first, then unvisited-before-visited, then created_at

Sort key: `(!starred, visited, created_at desc)` — starred rows (any
visited state) lead, then unvisited, then visited.

- Combines A and B's top signal (starred still means "most important,
  always visible") with B's bottom signal (visited still sinks) but drops
  A's category grouping (category is the weakest signal for either job —
  it groups but doesn't prioritize).
- **On-the-ground:** closest match to "what's left AND what matters" in
  one list: starred-not-done > plain-not-done > starred-done > plain-done.
  A starred-and-visited item still sits above plain-visited items, so
  "we did the important thing" isn't lost, but it's still below the
  unvisited work.
- **Planning:** starred-first surfaces the must-dos immediately, which is
  a reasonable audit starting point; no category clustering, so scanning
  "how many restaurants" still requires reading labels, same weakness as
  recency-only today.
- **Cost:** same DOM-reorder implementation cost as B; one more tier of
  sort key logic but no external dependency (no category-order table
  needed, unlike A).

## 3. Interaction with `.is-visited` / `--paper-filed` and the starred indent

- **A (category-grouped)** doesn't reinforce the visited field at all —
  a visited row can sit anywhere in its category block, so the "recedes"
  visual and "is near the top/bottom" position carry unrelated
  information. That's not wrong, but it's two signals doing one job's
  worth of work, and CLAUDE.md's own visited-styling history is explicit
  that the field is a *scanning* aid ("what's left") — a scanning aid
  that isn't reinforced by position is weaker than one that is.
- **B and C (visited sinks)** turn the visited field from "the only
  cue" into "the confirmation of what you already inferred from
  position" — position does the coarse job (visited stuff is down
  there), the field does the fine job (glancing mid-scroll, per-row,
  without needing to have scrolled to the boundary). This is a
  *strengthening* of what `--paper-filed` already communicates, not a
  conflict — the CLAUDE.md open item explicitly names this interaction
  ("sorting visited to the bottom would change what the field is doing")
  and this is that change: the field goes from sole signal to
  belt-and-suspenders, which is a legitimate scope reduction if it turns
  out redundant, but isn't obviously so — the field still helps *within*
  the unvisited block (e.g. previously-visited-then-unmarked edge cases,
  or just faster in-the-moment recognition than reading position).
  No CSS change is implied by any candidate — `.is-visited` stays a pure
  state class, position is an orthogonal array-order concern.
- **Starred indent (`--is-starred .row-main { padding-left: 26px }`)**
  is unaffected by any candidate — it's per-row visual, not positional,
  and stays correct regardless of where in the list a starred row lands.
  Under A/C, though, starred rows *cluster* near the top, so the indent
  (previously a rare, scattered signal down the list) becomes a
  concentrated block of indented rows at the top — worth a UX look at
  whether that reads as "a section" (implicitly fine, even desirable) or
  as visually heavy/repetitive with many stars.

## 4. Recommendation

**Candidate C** (starred-first, then unvisited-before-visited, then
created_at desc within each tier).

Reasoning: it's the only candidate that helps the on-the-ground job
(shrinking, prioritized "what's left") without actively working against
the planning job (a starred-first list is still a perfectly fine, if
imperfect, browsing order — nothing is hidden, and early-trip when
almost nothing is visited/starred it degrades gracefully to today's
recency order). Category grouping (A) trades away the "what's left"
win for an audit convenience that only matters pre-trip, and per §1 the
phase that matters now is on-the-ground. B is close to C but loses the
starred "always near the top even after being done" property, which the
Pencil Star's own design intent (CLAUDE.md: "pencilled = what you care
about") argues for keeping visible, not just weighted into the unvisited
block.

**v1 implementation touch points** (rough, not a spec):
- `visibleLocations()` (`index.html` ~2817) or a new `orderedLocations()`
  wrapper around it — filtering stays as-is, a sort is applied to its
  result before it reaches `syncLocationCards()`/`updateUI()` (~3833,
  3841). Keep the filter/order split explicit in a comment, mirroring the
  existing filter/zoom split the file already documents for shapes, so a
  future reader doesn't conflate "what's visible" with "what order it's
  in."
- `syncLocationCards()` (~5174) already reconciles by array index
  (`list.children[index] !== entry.el` → `insertBefore`), so a sorted
  input array is enough — no rewrite of the reconciler itself, just
  confirm the DOM-move path is exercised (today, real-world order changes
  are rare — only a new pin insert — so this path is more heavily used
  under C than it is today, worth a look under the visited/starred toggle
  paths specifically, e.g. `toggleLocationFlag()` ~area near 5891 and the
  swipe-visit/pencil-star settle functions that currently hold
  `starHeld`/re-render but not reorder).
- Shape cards (`createShapeCard()`, its own block after pin cards) are
  unaffected — no `starred`/`visited` column exists for them yet (see the
  CLAUDE.md street/district popup follow-up), so they keep their current
  order.
- No CSS changes implied (per §3).

## 5. Open questions for the owner

1. Does a starred-and-visited item belong near the top (favors starred
   still meaning "care about", per C) or with the other visited items
   (favors a stricter "what's left" list)? C picks the former; B is the
   fallback if the owner wants the latter.
2. Is the mid-list-to-bottom DOM jump when marking something visited
   satisfying (closure, "checked off") or disorienting (row moves out
   from under a thumb mid-trip)? This can only really be judged on a real
   phone, on the actual gesture (swipe-visit / popup Mark Visited), not in
   this sandbox — worth a concept-stage UX check specifically on the
   *reorder*, separate from the already-shipped bleed/press animation.
3. Within the unvisited (or visited) tier, is `created_at desc` (today's
   default) actually the right tiebreaker, or would the owner rather have
   alphabetical (easier to re-find a specific known place) or category
   grouping *within* the tier (A's idea, scoped down)? This doc assumes
   recency is an acceptable tiebreaker since it's a tiebreaker now, not a
   primary sort, but that's a guess.
4. Proximity-to-current-map-view ordering was in the original brief's
   candidate list but isn't proposed above as its own candidate: the list
   is filtered by `filters.city`, not by map viewport/zoom (per the
   CLAUDE.md UX principle that list membership must never be viewport-
   gated), so "near me" would need a genuinely new signal — current GPS
   position or map center, recomputed continuously — that doesn't exist
   in the app today and raises its own questions (recompute on every
   pan? on load only? does it fight the "never gate list on
   viewport/zoom" principle in spirit even if not in membership?). Flagging
   it as a live idea but out of scope for this pass unless the owner
   wants proximity prioritized over visited/starred — that would be a
   larger, separate design problem, not a tweak to the sort key.
5. Should this ship as its own small design/UX/CD loop (it's a real UX
   change to something tapped constantly) or does the owner consider it
   "small, well-specified" enough (per CLAUDE.md's process note) to skip
   straight to the perfection stage? This doc treats it as needing at
   least a concept-stage nod since it's explicitly called out as "don't
   just pick a sort" in the open item.
