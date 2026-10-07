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
- `docs/cd-brief.md` — mandatory brief/checklist for every CD agent.
- `docs/owner-taste.md` — the owner's stated design-taste rules, verbatim.
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
  enough to see it, from any zoom, and open its popup (the Hanging Tag) on
  arrival. Pins:
  `focusMap()`/`highlightMarker()`; shapes: `focusShape()`
  (`flyToBounds()`); both via `openPopupOnArrival()`. A new list item type
  needs the same behavior.
- Category filter chips (`CATEGORY_COLORS`) are independent of the
  add-form's category dropdown — changing one never requires the other.

## Team process (owner-set): fast lane by default

Owner: "Fast lane. As little process other than what I've explicitly dictated
or is necessary." The operator picks the lane, says which in one phrase; the
owner can override with `tweak:` or `full:`.

1. **TWEAK (default)** — any visual/copy/spacing/colour/size/shadow change and
   plain UI bugs. ONE agent (best model, worktree) changes it, re-shoots only
   the affected stills at 1x/3x and looks at them itself, runs only the checks
   covering the diff + `design/impeccable-gate/run.sh index.html` (must print
   `IMPECCABLE GATE PASSED`), shows the owner the stills BEFORE landing a new
   look, and lands on the owner's "yes" (immediately for a plain bug with no
   visual change). No CD, no UX, no review loops, no fresh-agent passes.
2. **FEATURE / NEW LOOK** — a designer produces phone-readable stills; the
   owner sees them first. After approval ONE builder builds it. ONE combined
   CD + UX check (parallel; each gets `docs/cd-brief.md` / `docs/ux-brief.md`
   pasted verbatim plus the owner's quotes) runs ONCE on the finished build,
   not per round; fixes in one batch; the owner sees final stills if anything
   visual changed after approval; then land.
3. **GESTURE / DATA** — row gestures, touch plumbing or the database add the
   FULL gesture gate (`design/gesture-harness/run-all.sh`) ONCE at the very
   end (not per round) and, for the DB, applying the migration via the
   Supabase MCP after the build is green. Baseline numbers in
   `docs/shipped.md`.

**Always:** the owner sees any new visual look before it lands; the Impeccable
gate passes; images sent to the owner are phone-readable; the operator makes
no design/UX/brand calls (Roles below); designers read `docs/owner-taste.md`
and new taste rules go there the same day; the owner's quotes go in briefs
verbatim; messages to the owner are terse, plain language, one per real event
(decision needed, thing live, blocker); a plain bug the owner reports is
verified by one agent before theorizing. Everything else is optional.

### Roles (owner-set)

Owner: "Designer is focused on ui and brand representation, ux on overall ux
of the app and interactions, cd on overall adherence to project and brand
goals and presence/identity." Designer = UI and brand representation. UX =
the app's overall UX and interactions (`docs/ux-brief.md`). CD = overall
adherence to project and brand goals and the app's presence/identity. The
operator makes none of these calls.

### Operator rules

- **Every agent that touches a tracked file gets `isolation: "worktree"`** —
  it's one no-build file and shared-checkout races have happened.
  Discovery-only may run in the primary dir.
- **Agents land their own work** on `main` (`git push origin HEAD:main`,
  retry with backoff, resolve conflicts keeping both sides' intent).
- **Scope the test gate to the diff;** agents report which checks they ran and
  why that covers the diff.
- **Prior rationale is history, not commandment** unless the owner said it.
  In briefs, separate "why it's like this" from "must preserve".
- **Briefs** carry the owner's verbatim words, confirmed constraints and
  relevant records; they never prescribe solutions or pre-resolve questions
  that belong to a role. Ground design briefs in `design/inspo/project/` (the
  app's visual language) plus any feature folder.
- When asking for wildcard ideas, state what's settled vs. actually open.

## Architecture

- `locations`: pins — `city`, `category`, `lat/lng`, `visited`, `starred`.
- `locations.address_details` (raw Nominatim `address` jsonb) / `short_address`
  ("street number · area", `deriveShortAddress()`, duplicated in
  `tools/short-address-backfill.html`): written at add time; not shown yet.
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
- **Visited stamp / pin sticker:** list rows (and plan/shape rows) show the
  original **stamp** (`.row-stamp`: CSS-border ring, dotted-track SVG mask
  `pathLength='166.29'` — path and dasharrays change together — navy 82%
  ink, per-place `stampTilt`) with the check glyph + VISITED; no peel, no
  cast shadow. Map pins (and plan-stop / shape markers) keep the peeled
  **sticker**, now the DARK neutral `STICKER.INK` #3A4C5B with a CREAM
  `STICKER.FACE` check (selected: a cream ring on the face); flap corner/angle
  and size from id hashes (`stickerCorner`/`stickerSize`), one fixed
  upper-left light, the check a filled path. Details: `docs/shipped.md`
  (2026-10-03 "Stamp returns to rows"),
  `design/visited-system/stamp-first/README.md`. Tweak-lane work
  self-reviews against `docs/owner-taste.md` before handing back. The
  place popup is the **Hanging Tag** (`TagPopup`, `buildPopupHtml()`): its
  Visited segment carries the same `.row-stamp` at 1.1x.
- **Brand orange, star and selection colours** (2026-10-07): ONE accent, the
  **brand orange** `--brand-orange` #EE7434 / `--brand-orange-deep` #A8400C
  (read through `--figure`/`--figure-deep`/`--star`): account and + buttons,
  star, tag band, clusters, submit. Cities have no colour of their own (the
  per-city palette is gone; don't reintroduce one). Every star (row, map,
  cluster, tag, add form, the Pencil Star's landed ink) is `--star` with a
  `--star-deep` keyline on its paper halo on the map. The **selected row is
  navy** (`--navy`), its star `--star` with no keyline; selection follows the
  open tag (pin tap selects, close clears).
  Restaurant is wine `#7A2436`, attraction moss `#547326`.
- **Animation separation:** visual animations never touch row-gesture code;
  they're triggered by state change or called after/during the gesture as a
  separate step.
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
  (never raw `npx impeccable`). Any UI change runs:
  `run.sh` (gate: static + rendered states, identity diff vs committed
  baselines; must print `IMPECCABLE GATE PASSED`). `run.sh --review` then
  `--check-review <packet>` (critique + audit) and the other commands
  (`--review --all`, `--commands animate,typeset,...`) are opt-in, on request
  or alongside a lane-2 check, not per-change. Exit 3 = didn't
  run, never a pass. Baseline changes (`--update`) need owner/operator
  approval. The vendored skill (`/impeccable`, `.agents/skills/impeccable/`)
  is a critic and a tool: this file, the lane process and the owner's brief
  override its defaults. Details: `design/impeccable-gate/README.md`.

## Current priorities (full text in `docs/backlog.md`)

Concept work exists for visited pins (owner hasn't picked); popup star
concept is in progress. Get a decision before building (lane 2).

- **Popup redesign (Hanging Tag) + orange star** — LANDED 2026-10-07
  (owner: "ok i think we're good enough to go to build"). Spec:
  `docs/shipped.md` "Hanging Tag + orange star". Open owner calls: the
  starred treatment (`TAG_STAR_STYLE`, band by default; owner: "orange for
  star / tag top all the way"). Next: the owner runs the short-address
  backfill (0/202 rows filled; no tag shows an address until then) --
  top of `docs/iphone-checks.md`.
- **Icon system full revision** (owner, 2026-10-07) — next after the popup
  redesign and star colour; lane 2. Quote and pointers in `docs/backlog.md`.
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
