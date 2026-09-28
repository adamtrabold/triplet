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

---

## 6. Revision (2026-09-28): multiple selectable modes, not one sort

The owner reviewed §4's single-candidate recommendation and pushed back on
two points: (1) the starred+visited tier question in Candidate C
shouldn't be decided for them, it should stay explorable, per mode; (2)
"Options baby. Just needs to be logical, recency is not a clear default
UX wise but could be an option." — i.e. **build a picker with 2-4 modes,
not a hardcoded sort.** They also agreed this needs a concept-stage check
(this section) before building, and separately pushed on the picker's
*feel*: "I want this UI to be whimsical yes but also as minimal as
possible… it should feel painfully intentional and obvious with how
simple it is." Concretely: no dropdown/select, no labeled settings-style
row of options bolted onto the filters panel — fewer, more confident
modes with a control that feels inevitable.

This section supersedes §4's single-candidate pick. §§1-3 (the job
analysis, candidates A/B/C as sort-key material, and the visited-field/
star-indent interaction) all still hold and are reused below — they just
become per-mode ingredients instead of one committed answer.

### 6.1 The modes

Three, not four. The owner's "fewer, more confident" note argues directly
against a 4th mode just to round out the picker, and Candidate A's
category-grouping (the natural 4th) is the weakest signal for *either*
job per §2 — it's left out of the picker entirely, not deferred as a
future option (see §6.6).

#### Mode 1 — **What's Left** (default). On-the-ground triage.

> "What haven't we done yet, with the stuff I care about surfaced within
> that."

Sort key: **`(visited asc, !starred, tiebreak)`** — this is exactly
Candidate B (§2), with starred added as the tiebreak's first field rather
than left to `created_at`. Two clean tiers only: not-yet-done, then done
— starred just decides who goes first *inside* each tier.

- Resolves the starred+visited question explicitly, on this mode's own
  terms: **once something is visited, it's done, full stop** — a
  starred-and-visited place does NOT get pulled back up to the top. This
  is a deliberate divergence from §4's Candidate C: a mode literally
  named "what's left" should mean what it says. A starred-visited place
  still floats to the top of the *visited* pile (so "we did the important
  one" isn't lost, satisfying the same intent Candidate C was reaching
  for) — it just doesn't out-rank an unvisited plain place.
- Tiebreaker within each of the two tiers — genuinely ambiguous, propose
  two, recommend one:
  - **Alphabetical (recommended for this mode).** On the ground, days
    into a trip, you're not adding much any more — `created_at` stops
    carrying real information and just reflects when you happened to
    type it in during planning. A stable, predictable position ("place
    starting with G is always after F") helps the repeated "did I lose
    that place" re-scan this mode exists for. Zero new schema; a
    client-side `.localeCompare()` on `name`.
  - **Recency (`created_at desc`, today's implicit behavior, zero-cost).**
    Keep if the owner would rather not introduce any new tiebreaker logic
    for v1, or finds alphabetical fights muscle memory for where things
    "usually" sit.
  - Category grouping as a tiebreaker (A's idea, scoped down to
    within-tier only) is not proposed here: per §2 it's the weakest
    signal for the on-the-ground job specifically, and this mode's whole
    point is progress, not audit.

#### Mode 2 — **Starred** (previously "Starred First"). Jump straight to what matters.

> "Just the things I actually care about, first — regardless of whether
> I've already done them."

Sort key options — genuinely open, propose both, lean toward the second:

- **2a, flat:** `(!starred, tiebreak)`. Visited plays no role at all;
  every starred place (done or not) sits together, ordered only by the
  tiebreaker. Truest to the mode's name — "starred" means starred, done-
  ness is irrelevant here by design.
- **2b, nested (recommended):** `(!starred, visited asc, tiebreak)`. Same
  top-level "starred always first" promise, but *within* starred, not-
  yet-done still leads done — so a fully-conquered starred place stops
  competing for the top slot against one you still need to get to. This
  is Candidate C (§2), scoped to just this mode. Recommended because it
  degrades better as the trip progresses: late in the trip, 2a would let
  a pile of done-and-starred places sit above a handful of not-done-and-
  plain places purely because they're pinned as favorites, which starts
  to feel like clutter rather than a "must-do" list.
- Tiebreaker: same two options as Mode 1 (alphabetical vs. recency), same
  reasoning — recommend alphabetical, for the same "this is a scanning
  list, not a diary" reason.

#### Mode 3 — **Recent**. Pre-trip / at-the-couch browsing.

> "Everything, in the order I thought of it — good for auditing what's
> been captured."

Sort key: **`created_at desc`** — no starred/visited tiers at all. This
is deliberately today's shipped (accidental) behavior, promoted to an
explicit, named, opt-in mode rather than removed. It's the mode the owner
flagged as "not a clear default UX-wise" — so it's available, never
default.

- No tiebreaker options proposed: recency *is* the entire sort for this
  mode, by definition — there's nothing ambiguous to resolve. Ties (same
  timestamp) fall back to insertion/id order, which never matters in
  practice (server timestamps aren't coarse enough to collide).

All three modes leave `visibleLocations()`'s filtering completely alone
— city/category filters and shape rows are untouched by all three, per
the CLAUDE.md rule that a list shows everything that matches filters,
full stop. Modes only ever reorder what's already there.

### 6.2 Where the picker lives — and the whimsical-vs-minimal problem

The obvious move — a labeled segmented-control row bolted into
`#filtersPanel`, mirroring `.city-btn`'s flush strip with "What's Left /
Starred / Recent" as three button labels — was the first draft of this
doc and is now explicitly rejected. It's the "obvious" failure mode the
owner called out: a generic settings-row control, discoverable but inert,
one more thing to notice and learn. A static mockup of it is not
included here for that reason — it wasn't wrong functionally, it was
wrong in kind.

**Recommended: the heading IS the dial.** `#locationsHeader`'s `<h2>`
already says "All Locations" and does nothing else. Make the mode name
*be* the heading text, and tapping it cycles to the next mode
(What's Left → Starred → Recent → What's Left → …, a closed loop, never
a dead end). No new row, no new button, no dropdown — the exact tap
target and text that were already sitting there inertly now does the
job. The only new pixel is a small double-caret (▾▾, ~8×5px each, the
second at half opacity) after the label, built from the *same* triangle
`collapseBtn` already draws two icons to its left — so the affordance
reads as "this app's existing tappable-triangle grammar, applied to
text" rather than a new icon language. Uppercase 15px/700-weight tracked
text (the heading's existing voice) already has enough visual "this is a
control, not passive copy" presence that the caret is confirmation, not
the whole signal.

- **State machine:** current mode is a single persisted value (e.g.
  `localStorage` — this is view state, not shared/synced data); tap
  advances it and re-renders the list via the existing
  `syncLocationCards()` path (§6.4).
- **Discoverability:** first-run, the heading reads "All Locations" (identical
  to production today — nothing changes for someone who never taps it,
  which matters since this is a v1 the owner hasn't approved a teaching
  moment for). Once tapped, the label becomes the mode's own name — the
  control teaches itself by naming what it just did, the same trick the
  filters panel's `.city-btn.active` state already uses (the active city
  becomes visibly-different chrome, not a separate "current city:" label).
- **Accessibility:** the `<h2>` becomes a `<button>`-role element (or a
  real `<button>` replacing the plain `<h2>`, styled identically) with
  `aria-label="Sort: What's Left. Double tap to change."`, updated on
  each change; VoiceOver users get the mode name and the affordance in
  one string, sighted users get the caret. This needs a UX check at
  perfection stage, not resolved here.
- **Motion (concept-level only, not specified in full — perfection stage
  decides real timing):** a quick crossfade of the label text is enough;
  reuses the app's existing `0.15s ease` opacity-transition convention
  (already the exact timing `#toggleFiltersBtn`/`#centerMeBtn` use for
  their `:active` press) rather than inventing a new duration. No
  page-flip/3D flip — that would be motion for its own sake at concept
  stage, and CLAUDE.md's own history (the Pencil Star, the visited stamp)
  shows this app's whimsy budget goes toward the gesture that changes
  *data* (starring, visiting), not chrome that changes *view*. A sort
  mode is view state; it should feel light, not ceremonial.

**Considered and rejected: a 4th icon-only button.** Add `#sortBtn`
beside `collapseBtn`/`toggleFiltersBtn`/`centerMeBtn`, same 32px square,
glyph swapping per mode (e.g. a footprint/bar-chart for What's Left, the
shipped star glyph for Starred, an open-book for Recent), cycling on tap.
Rejected because it's a real 5th tap target crammed into an already
4-element header row, and — this is the actual reason, not just
crowding — it leaves "All Locations" permanently inert, so the mode state
now lives *only* in a small glyph nobody has a reason to decode until
told what it means. That's discoverable-once-explained, not
"obvious-because-simple." Kept on record as the fallback if the owner
finds the heading-as-dial too clever or too easy to tap by accident
(mis-triggering the collapse chevron) in real use.

A static filmstrip of both treatments (heading-as-dial across its three
mode frames, plus the rejected icon-button variant, and a "What's Left"
list body underneath so the tiering is visible in place) is at
`design/list-ordering/concept/mockup.html`, screenshotted to
`design/list-ordering/concept/mockup.png`. Built from the app's real
tokens/classes (`--paper`, `--ink`, `--hair`, `.location-card`,
`.row-star`, `#locationsHeader`'s exact 56px/32px-button geometry) copied
verbatim, not approximated — concept fidelity, not production code.

### 6.3 Concept-level UX self-check

- **Crowding:** no new row, no new persistent button — the heading's
  footprint is unchanged (same flex slot, same max-width before
  ellipsis), so there's nothing to crowd. The double-caret adds ~20px to
  the heading's own content, which already has slack (today's label,
  "All Locations", is close to the longest of the three mode names —
  "Starred First" was intentionally shortened to "Starred" partly to keep
  this true, so the header never visibly reflows against the two
  neighboring icon buttons on a 375px phone).
- **Reshuffle transition:** a mode switch is a full re-sort of a
  potentially ~40-row array, unlike today's only reorder trigger (a new
  pin insert, one row). Per the existing proposal's §4 touch point notes,
  `syncLocationCards()` already reconciles by array index (`insertBefore`
  when `list.children[index] !== entry.el`), so it's mechanically able to
  reorder many rows in one tick — but that path is exercised far more
  under a mode switch than anything today has exercised it, and every
  row potentially moves at once (not one row sliding to the bottom, all
  ~40 reshuffling simultaneously). Recommend this get an explicit
  perfection-stage check on a long real list (a plain instant reorder is
  probably fine and is the cheap default — no animation is proposed here
  — but "probably fine" isn't a measured claim, and CLAUDE.md's gate
  language is explicit that claims like this need to be measured, not
  eyeballed, before shipping).
- **"List shows everything that matches filters, full stop":** all three
  modes are pure reorders of `visibleLocations()`'s output — no mode
  removes, hides, or paginates anything. Verified against the rule by
  construction: every mode's key is defined over the same array
  `visibleLocations()` already returns; none of them touch its filter
  predicate.
- **Interaction with the visited-row field / starred indent (§3):** still
  holds for What's Left and Starred (both keep visited-sinks and/or
  starred-leads structure — see §6.1); Recent mode reintroduces the §3
  "field carries position-independent information" case for its own
  duration (visited rows can be anywhere in a Recent-sorted list), which
  is fine — that's the same tradeoff §3 already named for Candidate A,
  just scoped to an explicitly-named, non-default mode instead of always
  being true.

### 6.4 v1 implementation touch points (rough, unchanged in kind from §4, extended)

- A `sortMode` piece of state (`'left' | 'starred' | 'recent'`,
  `localStorage`-persisted, default `'left'`) and a small
  `sortLocations(locs, mode)` pure function implementing 6.1's three keys
  — sits between `visibleLocations()` and `syncLocationCards()`/
  `updateUI()`, same seam §4 already identified.
- `#locationsHeader`'s `<h2>` gains a click handler that advances
  `sortMode`, updates its own text + `aria-label`, and calls the existing
  render path. Shape rows are unaffected (own block, no `starred`/
  `visited` column, per §2's note — unchanged here).
- No CSS changes beyond the caret glyph and the `<h2>`-as-button states
  (cursor, `:active` opacity reusing the existing 0.15s convention).

### 6.5 Recommendation

Ship all three modes for v1 — the owner explicitly asked for options, not
a single default, and none of the three is speculative: What's Left is
§4's original recommendation, Starred directly answers "I want to jump to
my must-dos," and Recent is free (it's already what the app does today,
just named and made switchable). Default to **What's Left** on first
load; remember the last-picked mode after that. Build the heading-as-dial
control (§6.2); keep the icon-button treatment on record, not built,
unless the owner's real-device reaction says the heading control is too
subtle.

Recommend the **alphabetical tiebreaker** for What's Left and Starred,
with recency kept on record as a one-line-change fallback if alphabetical
feels wrong on a real device (a UX-only judgment call this environment's
sandbox constraints can't make — no live app to feel it in).

Recommend the **2b nested key** for Starred (visited still sub-sorts
within starred) over 2a (flat) for the degradation reason in §6.1, but
flag it as genuinely a coin flip for the owner — unlike the What's Left
key (where "done means done" follows from the mode's name), nothing about
"Starred" as a name settles whether done-ness should matter at all inside
it.

### 6.6 Open questions left for the owner

1. **Alphabetical vs. recency tiebreaker**, for What's Left and Starred —
   this doc leans alphabetical but can't measure "which feels better
   scanning a real 30-40 row list on a phone" from here.
2. **2a (flat) vs. 2b (nested) for the Starred mode's own visited
   handling** — this doc leans 2b but, per the owner's original ask, is
   explicitly not deciding this one either.
3. **Heading-as-dial vs. the icon-button fallback** — this doc has a
   clear recommendation, but "does tapping the title feel inevitable or
   does it feel like an easter egg nobody would find" is exactly the kind
   of thing that can only really be judged in the owner's hand, not in
   this sandbox. Worth a real first look before committing past concept
   stage.
4. **Is 3 modes actually enough, or is a "Nearby" mode (flagged as out of
   scope in §5, item 4) going to be asked for the moment the owner tries
   this on the ground?** Not re-litigated here — still a separate, larger
   design problem per §5 — but flagging that "fewer, more confident
   modes" and "the owner's actual on-the-ground want" could end up in
   tension if proximity turns out to matter more than any of these three
   once actually walking around a city.
5. Category grouping (Candidate A) is dropped entirely rather than kept
   as a 4th deferred mode — confirm the owner agrees "fewer, more
   confident" means cutting it, not shelving it for later.
