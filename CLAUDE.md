# Triplet

Personal single-file trip-planning app (Iceland/Scandinavia, Sept 2026).
Vanilla JS/HTML/CSS in `index.html`, Leaflet + Supabase, deployed via GitHub
Pages on push to `main`. **No build step — permanent, not a temporary
simplification.**

## Where things live

This file loads every session: keep it to rules and pointers. Detail goes in:

- `docs/shipped.md` — spec + history of every shipped feature (constants,
  dials, test gates, rejected alternatives). **Read a feature's section
  before touching it.** Later entries supersede earlier ones.
- `docs/backlog.md` — open work in full (priority concepts, bugs, data
  cleanup, roadmap).
- `docs/iphone-checks.md` — checks only the owner can run on a real device.
- `docs/ux-brief.md` — mandatory brief/checklist for every UX agent.
- `design/<feature>/` — design records; `design/inspo/` — visual reference.

When something ships: add its entry to `docs/shipped.md`, close it in
`docs/backlog.md`, add its iPhone checks, and touch this file only if a rule
or a load-bearing gate below changes. Don't let any of these go stale.

## UX principles (learned the hard way)

- **A list shows everything that matches the active filters, full stop.**
  Never gate list membership on map viewport/zoom/pan; zoom gates the map
  layer only — see `visibleNeighborhoodShapes()` (filters) vs
  `mapVisibleNeighborhoodShapes()` (adds zoom; feeds only
  `syncNeighborhoodLayers()`). A new listable thing gets the same split.
- **Clicking any list item navigates the map to it** — pan and zoom in far
  enough to see it, from any zoom, and open its popup on arrival. Pins:
  `focusMap()`/`highlightMarker()`; shapes: `focusShape()`
  (`flyToBounds()`); both via `openPopupOnArrival()`. A new list item type
  needs the same behavior.
- Category filter chips (`CATEGORY_COLORS`) are independent of the
  add-form's category dropdown — changing one never requires the other.

## Team process (owner-set)

Design work runs designer → UX → creative director (CD), coordinated by an
operator who does no design work. The CD's bar is **9/10 in both stages**;
what's scored differs.

1. **Concept stage — quality of concept.** Designer explores a few distinct
   directions, prototypes the pick only far enough to judge it. UX runs
   `docs/ux-brief.md` in full and owns the owner's jobs at both stages: job
   walkthrough, control parity, hierarchy, convention (only pixel-level
   execution is deferred to stage 2). CD scores the idea (on-brief, intentional, right for this
   app, better than alternatives); execution flaws are noted, not scored or
   fixed. At ≥9, show the owner stills/filmstrip + one-line why + a line per
   rejected alternative, and ask to approve or redirect. (Why two stages:
   polishing unseen concepts to 9 burned tokens on ideas the owner then
   rejected.)
2. **Perfection stage — execution, only after owner approval.** Full loop
   until CD scores execution ≥9, measured at 3x, ~4x crops and 1x, with
   real-timing checks for motion; the Impeccable gate and review pass (see
   the Impeccable bullet below); then integrate,
   verify, hand back with iPhone checks. The concept isn't relitigated
   unless execution proves it unworkable (then back to the owner).

Small, well-specified follow-ups (owner-reported bug, tweak to an approved
design) skip straight to stage 2.

### Roles (owner-set)

Owner: "Designer is focused on ui and brand representation, ux on overall ux
of the app and interactions, cd on overall adherence to project and brand
goals and presence/identity." Designer = UI and brand representation. UX =
the app's overall UX and interactions (`docs/ux-brief.md`). CD = overall
adherence to project and brand goals and the app's presence/identity. The
operator makes none of these calls.

### Operator rules

- **Terse.** One message per real event (decision needed, thread finished,
  blocker). No narration, no re-deriving or restating what's established.
  Farm research, investigation and verification out to agents — including
  checking a reported bug is real before theorizing about it.
- **Never trade correctness for thrift.** Every loop requirement (stages,
  CD ≥9, UX verification, 3x/4x/1x + real-timing, measured claims,
  Impeccable gate + review, gates, byte-compare before integrating) applies in
  full. Savings come from language and orchestration only.
- **Cheapest setup that does each job well**: strongest model for design/CD
  judgment and tricky measurement, cheaper ones for mechanical checks.
  Reuse warm agents rather than spawning fresh ones.
- **Every agent that touches a tracked file gets `isolation: "worktree"`,
  unconditionally** — it's one no-build file and shared-checkout races have
  already happened. Discovery-only (no edits) may run in the primary dir.
- **The operator does not merge.** A merge agent lands each finished branch
  on `main`, one at a time: resolves conflicts, re-runs checks the branch
  didn't cover, confirms intent, runs the Impeccable gate post-merge. The operator
  picks merge order when branches overlap.
- **Scope the test gate to the diff.** Keep diffs confined, iterate on fast
  checks, and run only suites covering touched code
  (e.g. popup change → popup/replay/haptic cases + popup-open + Impeccable);
  the full gesture gate (touch suite, flip6, curve8, dust) only when shared
  row-gesture/touch plumbing changes. Agents report which checks they ran
  and why that covers the diff.
- **Prior rationale is history, not commandment.** Past agents' reasoning
  (here, in `docs/`, in code comments) explains why something is the way it
  is; it's not an owner constraint unless the owner said so. The goal is
  "looks right and communicates as intended". In briefs, separate "why it's
  like this" from "must preserve", defaulting to the former.
- **Briefs carry the owner's verbatim words, the confirmed constraints (what
  is settled, what is off the table) and the relevant records** (UX also gets
  `docs/ux-brief.md` verbatim and the owner's job list; never "verify against
  the spec"). They never prescribe solutions, reinterpret the owner's words as
  design decisions, or pre-resolve questions that belong to a role. On a
  cross-role conflict, route the question to its owner (interaction → UX,
  brand/identity → CD, visual execution → designer); ask the owner only when
  roles disagree.
- **Ground design briefs in the inspo, not just the code.**
  `design/inspo/project/` is the app's visual language (vintage travel
  labels, matchbooks, national-park posters — source of the paper/ink/
  figure-deep tokens and stamp/label/ledger-row motifs); feature folders
  (e.g. `design/inspo/visited-badge/`) hold reference for one mark;
  `project/` applies even where no feature folder exists.
- **Bound divergent exploration.** When asking for wildcard ideas, state
  what's confirmed and off the table vs. what's actually open (the
  star-alignment round drifted into relocating the star, which the owner
  had said was fine).

## Architecture

- `locations`: pins — `city`, `category`, `lat/lng`, `visited`, `starred`.
- `neighborhood_shapes`: districts/streets — `city`, `type`
  (`district`|`street`), `geometry` (array of `[lat,lng]`, not GeoJSON),
  fetched live from OSM (Nominatim polygon / Overpass way) at add time;
  `visited`, `starred` like pins (2026-10-02). Shape rows/popups run the pin
  code via `shapeRowItem()`, keyed `'shape:<id>'` (`rowItem()`/`rowKey()`).
- `plans` / `plan_stops`: named, ordered stop lists (a stop is a pin OR a
  shape); read by `fetchPlans()`, fail soft when the tables are missing.
- `cities`: runtime-extensible registry, merged into (never replacing) the
  static `CITIES` bootstrap in `index.html`, the offline-safe seed.
- RLS, identical on all of them: public `SELECT`; writes restricted to
  `auth.jwt() ->> 'email' IN ('adamtrabold@gmail.com', 'ericatrabold@gmail.com')`.
- The add form routes on category alone: `isShapeCategory()` (true for
  `district`/`street`) picks the fields and the target table — no separate
  shape toggle.
- **Shape city resolution:** a shape's `city` is never taken from the form;
  `resolveShapeCity()` classifies every point against `CITIES` and
  majority-votes (street segments that disagree with the winner are dropped
  — catches spurious same-name OSM merges). Below
  `SHAPE_CITY_CONFIDENT_SHARE` (60%), `handleAddShapeSubmit()` shows
  `shapeCityConfirm`: create a new city (`deriveNewCityConfig()`/`addCity()`
  via `nominatimReverse()` on the centroid) or assign to the runner-up.
  `tools/neighborhood-shapes.html` has a duplicated port (no build step) that
  shows a warning on the review card instead of a dialog.
- **No OSM shape → approximate pin:** `findApproximatePoint()` tries a
  Nominatim point search, then an Overpass node search in the city bbox; a
  hit is saved to `locations` with category = the shape type (already a
  valid pin category sharing `CATEGORY_COLORS`), label suffixed
  `" (approx.)"`, notes naming the tier, city via
  `resolveShapeCity([[lat, lng]], null)`. Only a double miss alerts. No
  automatic re-upgrade if OSM later gains a boundary.

## Environment constraints

- Sandbox egress to Supabase, Nominatim and Overpass is blocked (proxy 403).
  Supabase is reachable through the **Supabase MCP connector** (project
  Trip Map, `jgvckilmltimabfdvaly`) — use `apply_migration`/`execute_sql`
  directly rather than handing SQL to the owner. No connector exists for
  Nominatim/Overpass or a real browser, so anything needing live OSM
  (`tools/*.html`, add-form smoke tests) runs in the owner's browser.
- All pixel/timing numbers in `docs/` are Chromium-only; Safari/iPhone
  behaviour is unverified until the owner checks it.
- The owner often works from a phone: paste copy-pasteable text in chat, or
  an Artifact with a copy button, rather than sending a file.

## Load-bearing gates and constants (details in `docs/shipped.md`)

- **Clustering:** `SOLO_MIN_ZOOM` = 14 is shared by the list-click and
  cluster-click paths so a list tap never lands on a clustered pin — never
  duplicate it as a literal. `GLYPH_MIN_ZOOM` = 12 is separate.
- **Visited stamp:** CSS borders for the ring, never SVG strokes; the dotted
  track is a static SVG mask whose `pathLength='166.29'`, path and
  dasharrays change together (see `design/visited-badge/README.md`).
- **Row gestures (Pencil Star right, visit left):** report the star gate as
  **"84 + 8 (+ N8-a)"**, never "84"; visit suite `vtest.js`; plus
  popup-open 20/20, 0 dust-over-text frames, rows 56.00px, curve8 frame
  counts; plan-rows (Plans stop rows: number, 400ms hold, × / +) once
  Plans is in the page. Delete fires only on a near-still tap
  (`DELETE_TAP_SLOP` 4px). All of it runs with
  `design/gesture-harness/run-all.sh [index.html]`
  (Chromium-emulated touch; see its README for limits and known failures).
- **iOS haptics:** from iOS 26.5 a scripted click gives no haptic, so swipe
  gestures are silent there by platform limit (owner-confirmed); real taps
  via `hapticTap()` still tick.
- **Impeccable:** the only way to run it is `design/impeccable-gate/run.sh`
  (never raw `npx impeccable`). Any UI change runs BOTH:
  `run.sh` (gate: static + rendered states, identity diff vs committed
  baselines; must print `IMPECCABLE GATE PASSED`) and `run.sh --review`
  then `--check-review <packet>` (ONE read-only agent runs `critique` +
  `audit`; open P0/P1 block until designer/UX/CD dispose of them). The other
  15 commands are opt-in deeper passes on request (`--review --all` or
  `--commands animate,typeset,...`), not part of the per-change review. Exit 3 = didn't
  run, never a pass. Baseline changes (`--update`) need owner/operator
  approval. The vendored skill (`/impeccable`, `.agents/skills/impeccable/`)
  is a critic and a tool: this file, the team process and the owner's brief
  override its defaults. Details: `design/impeccable-gate/README.md`.

## Current priorities (full text in `docs/backlog.md`)

Concept work exists for visited pins (owner hasn't picked); popup star
concept is in progress. Get a decision before building.

- **Popup star alignment** (star looks off when the popup has full
  content; list-row star-only-when-starred is settled). Active concept:
  `design/popup-star-alignment/`; `design/star-alignment/` is history.
- **Visited pins on the map** — Round 4 (dots outside the rim) scored 9/10
  in `design/visited-marker/concept/`; owner's last read was skeptical
  ("not following good design principles") — review with fresh eyes.
- **Trips vs. cities restructure**: search already widens on a miss. Still
  open: a trip entity and day-trip filing, with no distance setting for
  the user (`design/trip-location-model/`). Adding a place must stay
  low-friction.
- **Plans** — v3 (build and follow in one list, shared filters, grey
  numbers, map tags, Undo slip) is built on `plans-v3-build`, not merged;
  the plans migration must be applied before anyone can create a plan.
  Spec: `design/plans-deepdive/v3/README.md`; shipped entry "Plans (v3
  build)". Route mapping is on the roadmap.
- **Ghost VISITED stamp in the popup** — new idea, concept stage.
