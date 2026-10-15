# Backlog

Moved from `CLAUDE.md` (2026-09-29; shipped/stale items cleaned the same
day). Keep it current: close items
as they ship (and record them in `docs/shipped.md`), add new ones as they
surface. `CLAUDE.md` carries a one-line summary of the priority items.

## Priority (owner-requested, next up)

Concept work already produced — the next crew should get the owner to
pick/redirect before building anything.

- **Playground = the signed-out app** -- LANDED 2026-10-13 as `?play`, then
  made the signed-out experience (owner: "play shouldn't live at its own url
  -- it should be the experience pre-sign in"); spec: `docs/shipped.md`
  "Playground". Open: (1) the sign-in badge LANDED 2026-10-14 (spec:
  `docs/shipped.md` "Sign-in badge"); (2) the playground cue: the owner
  replied "Yep" to "is the sheet's one line enough, or something on the map
  too?" -- read as the line is enough, no map cue; reopen if he says otherwise;
  (4) share-preview/title for the link.
- **Brand colour tokens: one system** (owner, 2026-10-07, verbatim:
  "how are our colors defined in the app -- it should be clear from a
  systems perspective that all colors are brand level color tokens" ;
  "'reykjavik orange' should not be a thing -- it should be our brand
  orange. it's used on the account and + icon also" ; "cities shouldn't
  have their own color -- did we build a programmatic way to assign that
  as cities are created? i dont think we did." ; and on doing it as its own
  pass right after the popup build lands: "yes that sounds good").
  Already done with the Hanging Tag (2026-10-07): the per-city palette is
  removed and the accent is `--brand-orange` / `--brand-orange-deep` (read via
  `--figure`, `--figure-deep`, `--star`); the rest of the palette is still
  to be named. Lane 1 (tweak): no visual change. Sequencing: its own pass
  after the popup redesign (the Hanging Tag landed 2026-10-07) and before
  the icon system revision below, which leans on the same mark colours.
  Status (2026-10-15): not started (no token-pass commit on main).
  Current state (`index.html` on main, 2026-10-07):
  - Already CSS custom properties on `:root` (lines 189-235): `--paper`,
    `--paper-raised`, `--paper-pressed`, `--paper-filed`, `--paper-warm`,
    `--ink`, `--ink-2`, `--navy`, `--hair`, the state tokens
    (`--state-press`, `--state-on-bg`, `--state-on-fg`, `--state-on-press`,
    `--state-press-filed`, `--state-off-alpha`), and `--figure` /
    `--figure-deep`.
  - Not tokens:
    - `CATEGORY_COLORS` (line 2706): a JS object of 11 hex values.
    - `CITY_PALETTES` (line 2727) + `DEFAULT_PALETTE` /
      `applyCityPalette()`: per-city `--figure`/`--figure-deep`, rewritten
      at runtime; runtime-added cities inherit the Reykjavik pair. The
      `reykjavik` entry duplicates the `:root` values as raw hex. The popup
      build removes these and keeps one brand orange.
    - `STICKER` (line 4475) / `STICKER_CHECK` (line 4519): `INK` #3A4C5B,
      cream `FACE` / `HI_RING` / `ROW.FACE` (all #FAF5EA, i.e.
      `--paper-raised` as raw hex), flap back (`PIN_BACK`, `PIN_BACK_FOLD`,
      `PIN_BACK_TIP`, `ROW.BACK`), `CAST_INK` #1A2630 (also hard-coded in
      the `#stk-lift` / `#stk-lift-far` SVG filters, lines 2497-2498),
      `CURL`, and rgba `EDGE` / `CREASE`.
    - Literal hex in code that duplicates a token (12 sites, excluding the
      STICKER ones above): `#F2EBDD` (= `--paper`) at lines 4406, 4755,
      4756, 5356, 6603, 6604; `#5A564C` (= `--ink-2`) as the shape line
      fallback colour at 6279-6280; the Leaflet container background
      `#F2EFE9` at line 506 (no token).
    - Shapes can also carry a per-row `color` from the database
      (`nb.color`, preferred over the category ink).
  Added by the Hanging Tag follow-ups (`tag-followups`, Impeccable A5):
  `--ink-rgb` (26, 26, 24 -- `--ink` as channels, for `rgba()` shadows that
  must work without `color-mix()`; derive one from the other in this pass),
  `--warm-edge-rgb` (107, 74, 40 -- the same brown as `STICKER.EDGE` in JS),
  and the role tokens `--tag-edge`, `--tag-shadow-contact`,
  `--tag-shadow-lift`, `--scroll-shadow` (list header + tag stub) built from
  them.
  Goal: every colour is defined once as a named brand-level token, and
  everything else reads from it. Category colours, sticker inks and the
  star (`--star` / `--star-deep`, added on the popup branch) become tokens;
  JS reads them via `getComputedStyle` or one shared map built from them.
  Zero visual change, proven by the Impeccable identity diff and
  before/after stills.
- **Icon system full revision** (owner, 2026-10-07, verbatim:
  "also i want the next priority to be fixing our icon system -- they're too noisy, the approacah we're using the checked items are stronger visually than the open ones. the icon system needs more clarity... i need a full rev. so note that"). Lane 2 (feature / new look). The popup redesign
  (Hanging Tag) and the star colour it followed have landed (2026-10-07).
  **In design** on branch `claude/elegant-galileo-1c5ntm`,
  `design/icon-system/` (not on main): inventory, then phase 1 = a brand
  approach to icons (`brand-approach/`); the owner's 2026-10-14 direction
  (place icons solid, outlined = not yet tapped by me, visited unchanged)
  and phase 2 (grid + SVG drawing after approval) are in its `owner.md`. Related prior owner quotes in
  `docs/owner-taste.md`: Icons / marks ("Same icon drawing language
  everywhere": "Checkmark was only supposed to be lightly rounded like the
  rest of the icons" ; "we need to do an icon pass on the rest at some other
  time") and Alignment / spacing ("Spacing between things is insane and
  icons don't fill the same visual space"). Scope, approach and solutions
  are open; they belong to the designer/CD/UX roles.
  Include the + badge (owner, 2026-10-15, verbatim: "Build the matched icon
  but we need to include this in the icon project everything is
  inconsistent"). On-screen line weights measured today: account icon
  2.00px, list rows' category icons 2.00px, list toolbar icons 1.50px,
  locate-me 2.08px, the + 2.00px (was 2.29). The + follows whatever weight
  the project sets: one attribute, `stroke-width` in `setAddBtnGlyph()` and
  the initial `#floatingAddBtn` markup.
- ~~**Popup star alignment with full content**~~ CLOSED by the Hanging Tag
  (built 2026-10-07 on `popup-hanging-tag`, `docs/shipped.md` "Hanging Tag +
  orange star"): the star is no longer beside the title; it is a fixed
  segment of the claim stub, so it can't float against long content.
  Original item, for history: (owner, 2026-09-29,
  verbatim: "I was never debating outline or not that was decided forever
  ago. No star unless it's been starred. What I need to fix is the
  alignment of the star in the pop up - it looks weird when all the content
  is in it."). Settled, not candidates: the list row shows a star only when
  starred (no always-visible or hollow star in the list). Open: the POPUP
  star's alignment when the popup has full content (long name, address,
  notes); includes the CD-deferred 41px empty gap above Get Directions in a
  bare popup (star-target geometry). (The concept thread it named,
  `design/popup-star-alignment/`, never reached main.)
  `design/archive/star-alignment/` is history only: an earlier exploration (2026-09-28) that misframed the problem as
  an outline/list-row question, so its variants (reserved-column,
  dog-ear/stripe/action-cluster, corner badge, starred-only section, etc.)
  are not candidates.
- ~~**Short address in the popup**~~ BUILT 2026-10-07 with the Hanging Tag
  (`tagAddress()`: `short_address`, else derived from `address_details`,
  else omitted -- never the full string). Still open: 59 of 202 places lack
  a real town (58 have no `address_details`, 1 has details but no town;
  live count 2026-10-15); the owner re-runs
  `tools/short-address-backfill.html`. Original item: (owner, 2026-10-05: "#1 since there's a
  directions button"). The data shipped 2026-10-05 (`locations.short_address`,
  `docs/shipped.md` "Short address"); showing it lands WITH the popup
  redesign, not before: the current popup still prints the full `address`.
  The redesign adds `short_address` to `doFetchLocations()`'s select (fail
  soft is no longer needed: the columns are live) and decides the fallback
  for rows the backfill could not fill (NULL). Owner still has to run
  `tools/short-address-backfill.html` (`docs/iphone-checks.md`).
- ~~**Visited system: peeled sticker**~~ LANDED (built 2026-10-02 on
  `visited-sticker`, merged with `visited-sticker-2`; see `docs/shipped.md`
  "Visited sticker" and, superseding it for rows, 2026-10-03 "Stamp returns
  to rows": dark sticker on map pins, the stamp on rows). Original item, for history: (owner,
  2026-09-29 ask; final check size/shape decisions 2026-10-02). Supersedes
  the old "Visited pins have no map treatment" thread: Round 4 dots
  (`design/archive/visited-marker/concept/`) were REJECTED by the owner as visual
  noise; do not revive. Approved direction, in stills:
  `design/visited-system/stamp-first/README.md` (final spec at top).
  Pin = category-wash face + centred check (9px NEAR, 6.2px FAR, selected
  follows NEAR; lightly-rounded filled check drawn like the category
  glyphs: square ends, radius ~1/24) + peeled flap bottom-left (about 18%
  of the pin, soft natural shadow, no hard fold line). List row = wide
  matte oval 72x24 with check (8px) + the word VISITED (10px condensed
  caps, .08em tracking), 12px (`--s3`) padding each side, flap counts as
  left padding. Owner accepted that name truncation gets worse (measured
  16/204 names truncated vs shipped stamp 16/204 and none 2/204).
  Build needs: full gesture gate (it replaces the VISITED stamp; vtest /
  replay cases must be rewritten, V14's 72x32 ring model), the Impeccable
  gate, and iPhone checks. Nothing built yet.
- **Trips vs. cities restructure** (owner, 2026-09-23; trimmed
  2026-09-29). *The search bug is fixed:* search widens on a miss (see
  `docs/shipped.md`, "Search widens on a miss"). Owner: "When we expand
  cities vs trips and create the different structure maybe that should
  change. User should not have to select distance." Still open, as one
  piece of work:
  - **A trip entity.** A trip has an overarching location; the places on
    it may or may not be in one city (day trips, other towns, a stop en
    route). Today `cities` does double duty as both "where the trip is"
    and "where this place is".
  - **Filing friction a widened search now exposes:**
    - A pick outside every city box raises "Add <town>?", even for a day
      trip (e.g. Uppsala from Stockholm, Reykjanes from Reykjavík).
    - Dismissing it files the place under the map's city.
    - A result with no city/town/village in its address (a rural
      viewpoint) is filed silently under the map's city, even in another
      country.
    - A pin filed to a new city doesn't appear in the current city's list
      until you switch city.
  - **No distance setting** for the owner, per the quote above.
  - **Overpass street/node lookups** outside known city boxes (need a
    bbox).
  - **Constraint:** adding a place stays low-friction, with no forced
    city/trip picking.
  - Discovery: `design/trip-location-model/proposal.md`. Related: Phase 2
    "trip context (dates/closures)".
  - **Active design (2026-10-15)** on branch `claude/elegant-galileo-1c5ntm`,
    `design/trip-location-model/` (not on main): `owner.md` (the owner's
    words: the model is locations, cities, trips and plans; a place may
    belong to a city it isn't physically in; sketch level, model not UI;
    near-zero setup), `jam.md`, `jobs.md`, and `concepts/` with three
    concepts -- 1 "a rule that remembers", 2 the same plus stays (hotels),
    3 no trip container -- plus 4, a reference of today (not a candidate).
    Not yet sent to the owner (status per the branch's own notes; no owner
    reply recorded). Governing rule, places-first (owner, 2026-10-15: "the
    philosophical approach should be places-first; immediately doing the
    thing you actually want to do not the adin").
  - The blank-tag add form (`design/add-button-placement/concepts/blank-tag-form/`,
    same branch) continues after the + badge as its own design work; it
    touches the same city/search questions. Status unclear: reported on hold
    until the trip model settles, but no record of the pause in the repo.
- **Edit a place after adding it** (owner, 2026-10-15, verbatim: "we need
  to add the ability to edit places in the backlog"). Today nothing about a
  place can be changed once it's added (name, notes, category, city,
  position); the only fix is delete and re-add, which loses visited/starred
  and plan stops. The trip model needs this too: changing a place's city
  after adding. Owner, in `design/trip-location-model/owner.md`: "if the app
  puts a place in the wrong city you should be able to edit the city
  attached to the place". Applies to every place, whether it shows as a pin
  or as a district/street outline. Lane 2 (needs design first).
- ~~**First open for a new user centres on their location**~~ LANDED
  2026-10-15 (owner: "let's change default city to last viewed; first
  timers it loads the user's location; if the user declines location
  access idk give me a good city to start from"). Returning devices restore
  the last viewed city; a first open asks for the location once and picks
  the city within 80 km or All cities. Fallback rule on denial/no answer:
  the city of the most recently added place, else the known city nearest
  the device's time zone, else `DEFAULT_CITY`. With per-person accounts
  (owner: "im assuming here eventually we will build accounts and that
  wont be the place") step 1 becomes the user's own newest place. Spec:
  `docs/shipped.md` "First open"; flow: `docs/architecture.md` §3 "Open".
- **Plans: the iPhone checks** (v3, see `docs/shipped.md` "Plans (v3
  build)"). The v3 code is in `index.html` on main (its commits, e.g.
  `42bd919`, are on main; branch `plans-v3-build` is gone from the remote).
  The `plans` / `plan_stops` tables exist in the live DB (checked
  2026-10-15); no docs entry records when
  `supabase/migrations/20260929000000_add_plans.sql` was applied. Next: the
  owner's iPhone pass (`docs/iphone-checks.md`). Open for designer/UX:
  the starred stop's name starts at 122px, not 96px (v3 §7 CD note); the
  build decisions listed in the shipped entry (reorder Undo copy, stamp at
  normal ink, chip framing). Owner question still open (v3 §4, owner-12):
  while following, should the map show every filter match (a, built) or only
  the plan (b)?

- **Ghost the VISITED stamp in the popup** - DROPPED (owner, 2026-10-02);
  superseded by the peeled-sticker system above.

- **Icon pass** (owner, 2026-10-02): "Redraw the check that looks great
  but we need to do an icon pass on the rest at some other time." The new
  lightly-rounded filled check (square ends, radius ~1/24) is the
  reference. Review the category glyphs and other icons (fork, cup,
  martini, etc., star, chevrons, + and x, the plan/shape marks) for one
  consistent drawing language (end caps, corner radius, stroke/fill,
  optical size), later. Folded into the "Icon system full revision" above
  (now in design in `design/icon-system/` on `claude/elegant-galileo-1c5ntm`).

- **Plans follow-ups from the final review** (critics-final 9c5296e,
  `design/impeccable-gate/reviews/2026-10-01-6d3609c2c34d/REPORT.md`; not
  now): accessible names for map markers (numbered stop pins "Stop 2:
  Harpa", tag-bearing clusters "Cluster of 11, stops 1–3"; Places' pins have
  none either, WCAG 4.1.2); the error banner covers the account / + badges
  and zoom + for its 6s (check against main: likely existing behaviour);
  the star knock-out notch (existing Places); paper hex `#F2EBDD` hard-coded
  in JS-built SVG instead of `var(--paper)`; cluster tag numerals 10px at 1x
  (CD to judge on device).

- **Add form's ADD LOCATION hidden behind the list on shorter screens**
  (found 2026-10-12 by the + placement crew, Chromium only). Below ~790px
  viewport height (Safari tab with toolbars, 390x664; SE 375x667) the list
  sheet covers ADD LOCATION, so a tap on Add lands on a list row. Repro:
  open the add form at 390x664 -- `design/add-button-placement/concepts/stub-stress/today-form664-3x.png`.
  FIXED, landed 2026-10-15 with the + badge (`plus-badge-build`): the form
  sits on the band, ADD LOCATION on the ×'s line at every height.
- **Add form opens behind the open filters panel** (same source): with the
  filters panel open, tapping + opens the form behind it and a tap on Add
  hits a filter chip. Repro: open filters, tap +. Proposal in the + work:
  opening the form closes filters and the sort menu. FIXED, landed
  2026-10-15 with the + badge: the panel covers the badge (close filters
  first); a keyboard open closes filters and the sort menu.

- ~~**+ rides up with the filters panel**~~ LANDED 2026-10-15 (main
  `764c45a`). The panel sizes to its content up to 12px below the
  zoom/account row and scrolls inside past that. The + rides the panel's top
  edge wherever it fits; where it doesn't, it moves to the top-right at the
  account's size and the account steps left. Spec: `docs/shipped.md` "+
  badge" entry; stills `design/add-button-placement/build/filters/` and
  `build/top/`.

- **A place added in another city vanishes from the list** (found
  2026-10-12 by the + placement crew, in a prototype). If the place you
  add belongs to a city other than the one showing, the list filters the
  new row out and nothing says where it went. Repro: with Reykjavík
  showing, add a Copenhagen place. Candidate fix: switch to that city (or
  say where it went) after Add. Being considered as part of the + work.

## Data cleanup (neighborhood shapes)

- `copenhagen-nyboder` (Nyboder) and `stockholm-gamla-stan` (Gamla Stan)
  should now resolve automatically as approximate pins via
  `findApproximatePoint()`'s fallback chain (see Architecture in `CLAUDE.md`) next
  time they're added through the live form or the bulk tool — not yet
  verified against the real Nominatim/Overpass response, same environment
  constraint as everything else needing live OSM access. If both fallback
  tiers genuinely come up empty for either, manual tracing via geojson.io is
  still the last resort.

## Known minor bugs / follow-ups

- **plans harness: long-name slip check fails on main** (builder, 2026-10-15,
  seen while testing the suggestions-over-x tweak). `node
  design/gesture-harness/plans.js index.html` is 31/32 on origin/main
  (was 32/32 at the + badge landing): reduced pass, "a long name: Added …
  as stop 4 truncates the name only" gets `{"text":"Added Kaffi Vínyl as
  stop 4","nameCut":false}`, i.e. the name no longer truncates at that
  width. Either the fixture/width drifted or the slip's layout changed;
  not investigated.

- **Esc handlers that don't mark the keypress spent** (reviewer, + badge
  build round 1, 2026-10-15). The sort menu's document-level Esc
  (`initSort()`: `if (e.key === 'Escape' && sortMenuOpen()) closeSortMenu()`)
  and the error banner's (`dismissErrorByKey()` listener) don't call
  `preventDefault()`, so a later Esc listener acts on the same keypress.
  The + form's Esc skips while the sort menu is open, and the tag's Esc
  doesn't check `defaultPrevented`. Repro (from reading the code, not yet
  run): show the error banner with a tag open, press Esc: the banner and the
  tag both close. **Live case (reviewer, landing round):** Esc with the error
  banner showing also cancels the + add form. The form's Esc listener on
  `document` runs before the banner's, which listens on `window` (bubbling
  reaches `document` first), so `defaultPrevented` isn't set yet when the
  form checks it. Fix:
  `preventDefault()` in both handlers and have later listeners skip on
  `e.defaultPrevented`, and make the form's Esc skip while `#error.show`
  (listener order means it can't rely on the banner's preventDefault).
- **Bug: expanding the list (▲) with a tag opened while collapsed leaves the
  tag under the top controls** (pre-existing on main; found by the + badge
  review, 2026-10-15). The tag ends about 10px above the map's top, under the
  zoom / account row. Repro: 390x844, collapse the list, tap a pin near the
  top of the map, then ▲. The + form's cancel reaches it too: with the form
  open, tap a pin, then ×. Fix: re-fit the tag (pan + `tagSheetNeed()`) on
  expand.
- **A tap on the +'s spot with the filters panel open** (+ badge review,
  2026-10-15). The panel covers the badge by design; a tap where the + usually
  sits lands on a category chip and silently toggles that filter off. Owner
  answered: "for 1 let's push the + up with the panel" -- FIXED, landed
  2026-10-15 (main `764c45a`): the + rides above the panel where it
  fits. Where it doesn't, it moves to the top-right corner, matched to the
  account's size, and the account steps left (owner: "matched is good but
  let's put it to the right of account"), so no chip is ever under it.
- **Open task, for the designers: `planSafeBox()` treats the + badge's top as
  a full-width bottom limit** (+ badge review, 2026-10-15). The badge is in
  `planChrome()`, so plan fits lose about 100px at the bottom across the whole
  width, not just the bottom-left corner. Designers to know; a corner-only
  exclusion would be a design call.
- **Open task: tell the sign-in crew** (`design/signin-button/`) that the
  account badge moved: `--account-slot-right` is now `var(--s4)`, and it sits
  alone at the top-right (the + is bottom-left). Their "re-judge beside the
  new +" item can run now.
- **The first tag open of a session lowers the list 4px more than later
  opens** (pre-existing on main; found by the + badge build's jobs check,
  2026-10-15). The first open measures the tag 212px tall, later opens of the
  same tag 208px, so `tagSheetNeed()` lowers the sheet 4px more the first
  time (main at 390x664: 34px, then 30, 30; the + build: 74, then 70, 70).
  Something in the tag (fonts or the stamp line, likely) settles 4px shorter
  after its first render. Repro: 390x664, tap a starred row, read
  `--sheet-lower`; close it, tap it again, read again. Visible as the add
  badge (and the list) sitting 4px higher after a cancel restores the tag.

- Sign-in badge review findings (reviewer, 2026-10-14, build `ba473f8`):
  (1) BLOCKER, in-place sign-in (flow 4, signed-out real mode): `login()`
  ends busy, then `updateAuthUI()` swaps the slot to 'account' BEFORE
  `playStrike()`, so the Strike runs on the navy masked button, the label
  turns "Account" at the start, and the end's `setAccountBadge('account')` is
  a no-op: the last Strike frame stays as the badge's content for good, which
  hides the dropdown's orange `.active` look under navy ink (a tap
  mid-Strike freezes that frame). `signin-test.js` case 9 only checks
  `accountBadge`, not the content. (2) `docs/iphone-checks.md`'s older
  Playground entry still says "account badge -> Sign in" and "Logout". (3)
  `restoreHopView()` reopens a pin with `marker.openPopup()`, not the normal
  open path; a pin clustered at the restored zoom won't reopen. (4) No
  committed check runs the real supabase-js (all stubs); the reviewer's
  probe against the real 2.39.3 UMD (playground writes, hop, storage blocked,
  `scope=local`, expired session) passed 7/7 -- worth committing one.
  Status: (1), (2) and (3) fixed in build round 2 (2026-10-14; `signin-test.js`
  cases 9, 9b and 9c fail on `ba473f8` and pass now). (4) stays open.

- Sign-in hop view restore, plan view only (reviewer, 2026-10-14):
  `restoreHopView()` keeps the saved zoom when no listed place is within one
  cluster cell, but in plan view district/street stops also join the
  cluster grid and aren't counted, so a pin next to one may cluster after
  the restore and its tag silently doesn't reopen. Fix: count plan-stop
  shape centroids in the neighbour check.

- Sign-in badge build follow-ups (2026-10-14): (1) the 50-unit scallop
  polygon now lives three times -- `#floatingAddBtn`/`#accountBtn`'s CSS
  mask (`-webkit-mask-image` and `mask-image`) and JS `SCALLOP_PTS` (the
  sign-in badge, its ink clip and `#accountFocus`). Why: CSS can't read a JS
  constant; a later pass could set the mask from `SCALLOP_PTS` at boot or
  move both to one inline SVG `<symbol>`. (2) The automated gates only see
  the signed-in app: the gesture harness stub and the Impeccable runtime
  layer store a session, so neither renders the paper badge or the
  playground. Why: a regression in the signed-out corner (popups clearing
  the paper badge, its contrast findings) goes unseen; `design/signin-button/
  signin-test.js` covers its behaviour, not its paint. (3)
  `design/signin-button/play-test.js` was stale since the playground became
  the signed-out app (its `?play` loads stored a session, so it tested real
  mode); fixed in the build to load signed out.

- Auth follow-ups found reviewing "playground = signed-out app" (2026-10-13,
  commit `1b52211`): (1) fixed in the same change: `logout()` now
  signs out this device only (`scope: 'local'`). (2) and (3) fixed by the
  sign-in badge build (2026-10-14, on `claude/elegant-galileo-1c5ntm`): a
  sign-out error keeps you signed in with "Couldn't sign out. Try again.";
  a blocked-storage sign-in says so instead of reloading into the
  playground. (4) `design/signin-button/jobs.md` still has the "Edit
  while signed out (real trip)" flow and `context.md` still says
  `index.html?play`; neither exists any more.

- Hanging Tag follow-ups (2026-10-07, `docs/shipped.md` "Hanging Tag +
  orange star"): (0) short address: 59 of 202 places lack a real town (58
  have no `address_details`, 1 has details but no town; live count
  2026-10-15) -- the owner re-runs `tools/short-address-backfill.html`, then
  a read-only count; (1) the
  starred treatment is the band (owner: "tag top all the way"; `TAG_STAR_STYLE`
  keeps segment / both); (2) the reversed paper star of the segment option is
  2.69:1 on brand orange -- `TAG_REVERSED_STAR_KEYLINE` lifts its edge to
  5.67:1 if it is ever picked; (3) ~~the pencil circle is the owner's
  provisional keep~~ DONE on `tag-followups` (owner: "yes let's drop the
  pencil"): removed; (4) no edit
  path from the tag (none exists anywhere); (5) the full address is no longer
  reachable in-app (geocode audit, ux-analysis J8) -- UX to decide whether the
  short line should expand (UX: acceptable as a rule once the short address
  exists -- Directions opens Apple Maps at the pin, which shows the street);
  (6) for the icon revision (CD): filled star, pencil circle, double-ring
  stamp and orange-starred dark stickers deepen "checked stronger than
  open"; the name column jumps left on unstarred rows; two greens (moss
  attraction, spruce nature); (7) at 390x664 the compressed list's top
  scroll fade (`#locationsList.scrolling`) softens the selected row's top
  edge -- superseded 2026-10-07: the fade is now a header shadow.; (8) ~~Impeccable critique C3: when the list isn't lowered, a map-tapped
  pin's navy row may sit scrolled out of view~~ DONE on `tag-followups`
  (owner: "yes"): a map tap scrolls the row fully into view (nearest).
  Also on that branch (Impeccable A2-A6, owner-approved): keyboard-only
  focus look on the tag, Directions' "Opens in Maps" description, the list
  header shadow without `:has()`, tag shadow tokens, stub labels that wrap
  cleanly at 240px; and a pre-existing bug fixed: tags narrower than 316px
  were centred off their pin. Open from that review: C4 (TYPE/PLAN line:
  ~~open~~ DONE 2026-10-08: D Rubber stamp, numbers-only plan stamp,
  randomized ink -- LANDED from `type-stamp` (owner approved the stills in
  `design/popup-hierarchy/type-line/stills/build/`; shipped.md "Type line:
  Rubber stamp"), C5 (icon revision), C6 (no change, the greens are
  ΔE 24). Not tokenised yet: the star segment's press tint
  `rgba(18, 41, 63, .16)` (navy 16%; only drawn in the unused 'segment'
  style).

- Impeccable gate follow-ups (`design/impeccable-gate/`): (1) the runtime
  baseline identities still marked "pre-existing, unreviewed" (10px
  category·city row meta, 10px popup "Get Directions"/"Mark Visited"/category):
  CD/owner to accept each with a reason or fix it. (2) The first
  full `--review` (17 critic commands) on `main` hasn't been run. (3) No
  PRODUCT.md/DESIGN.md: `/impeccable init` / `document` are owner decisions
  (they'd also feed the skill's context). (4) The design hook is not
  installed (harness config: owner decision).

- ~~Add form: the new close badge (×, bottom-left) overlaps the left edge of
  the place-suggestion list~~ FIXED 2026-10-15 (`621f4f5`, `docs/shipped.md`
  "Place suggestions lie over the x").

- State system shipped (see `docs/shipped.md`). Left open: floating
  add/account buttons' pressed fill is the off-token literal `#1B3A57`; map
  it to a token or leave it. Hover styles exist only on three menu items.
  Known polish (not restyled, from `design/state-system/README.md`): the
  popup star tile's right edge sits 4px from the popup title; the popup's
  right-side tiles (close x and Mark Visited) do not share a right edge. By
  design, not bugs: the row delete X has no pressed look (the row press is
  the feedback); hover is pointer-only (raised paper) and touch uses pressed.

- Delete X's effective tap zone extends ~9–12px left of its 28px box via
  browser touch adjustment (measured in Chromium on today's unvisited
  rows; iOS unmeasured — its hit-testing may favor the clickable row
  more). Pre-existing, not caused by the stamp. Since the swipe-visit
  round, delete also needs a near-still tap (`DELETE_TAP_SLOP` 4px), and
  `confirm()` is the backstop. If mis-deletes are still reported, the next move is
  shrinking/relocating delete, not more stamp margin.
- Many `locations.name` values redundantly end in the city already shown
  in `.row-meta` (e.g. "Mother restaurant Copenhagen") — trimming them is
  a data cleanup that would win back truncation room on visited rows.
- ~~Shape rows have no visited state~~ and ~~street/district popups lag
  behind pin popups~~ -- **closed 2026-10-02** ("Shape parity" in
  `docs/shipped.md`; owner: "Every category should have the same
  information and capabilities"). Open for UX/designer, not blocking:
  the Get Directions / map-star point on a shape (street: halfway along
  its length; district: vertex centroid if inside, else the nearest
  vertex), the star's place on the map (that same point), shapes still
  sorting as their own block after the pins (Starred / What's left
  included), and a tapped shape row not taking the highlighted state
  pins get.
- Closed filters panel's chips stay focusable: in a Safari tab a
  keyboard/VoiceOver focus there scroll-then-snaps (UX should-fix from the
  sheet round, 2026-09-28). Cosmetic; fix is making the closed panel
  `inert`. Not done as of 2026-09-29.
- Popup → row replays (`ssReplay`/`vsReplay`) treat a row hidden behind
  the Safari toolbar as on screen (they test against the list's rect,
  which extends behind the toolbar), so the replay can play unseen.
  Carried over from the sheet round's `maybeTeachStar()` follow-up;
  cosmetic.
- Header visited count ("12/38 visited" in `updateUI()`'s
  `${activeCityLabel()} list (...)` text) — deferred in the delete-only
  list-row round to get its own review; still not built.
- ~~Gesture test harness can't run~~ — **rebuilt** (2026-10-01) as
  `design/gesture-harness/`. One command, `design/gesture-harness/run-all.sh
  [index.html]`, about 15 minutes. It runs eight suites: touch (84),
  flip (8 plus a control that must fail), N8-a, vtest (p7's 95), popup-open
  20/20 per mode, dust, rows 56.00px, curve8, and the delete-slop sweep.
  It prints the gate line in CLAUDE.md's format.
  - Limits: Chromium only, emulated CDP touch, not iOS. Not rebuilt:
    `haptic8`/`tap8`/`ax8`, the 0/5,184 hand-off check, and p8's 18 extra
    vtest cases (never committed).
  - The old `test6.js`, `flip6.js` and `vtest.js` stay as history.
  - Its first run on `origin/main` (`9a53d71`) found the items below. Details
    are in `design/gesture-harness/README.md`, "Findings".
- **Visit swipe vs. its gate after `1ec21c2`** ("text now slides + FLIPs",
  merged after p8 without a gate run and absent from `docs/shipped.md`).
  - **V14:** on long names the sliding text runs up to ~23px into the
    bleeding stamp before the press. The text travels 56px; the stamp plus
    its gap to the X is ~76px.
  - **V15:** the final truncation now lands at release (FLIP), not on the
    press frame as `docs/shipped.md` says. The spec needs updating, or the
    code does.
  - ~~**D7, reduced motion only:**~~ **fixed** (`fix-d7`, 2026-10-01): a tap
    on the X right after an un-visit stroke deleted. See `docs/shipped.md`,
    swipe-left "Delete safety".
- **curve8 row reads 10/3, not 11/3**, in the rebuilt harness (30/30 runs).
  `STAR_POP` is unchanged since `48bb11e`. Its ≥1.3× window is 168.5ms =
  10.11 frames, so 11 depends on frame phase. Here the animation starts on a
  frame and the 12th sample lands 0.1ms late. Owner/CD call: keep ≥11, which
  then fails in this harness, or restate it.
- ~~**Android-only delete edge (Chromium probe, not gated):**~~ **fixed**
  (`fix-d7`, 2026-10-01): a 4–12px out-and-back wiggle on the X deleted,
  because the X's travel ignored touch `pointermove`s. Now gated in
  `delete.js` (36 cases). iOS still to check on a device.

Previously tracked and fixed: `showError()`/
`hideError()` banner masking, and `slugifyCityId()` not decomposing Nordic
`ø`/`æ`/`å`/`þ`/`ð` — both fixed 2026-09-19. `showError`/`hideError` now
take a `source` tag and only a matching source's `hideError()` clears the
banner; `slugifyCityId()` (and the bulk tool's mirrored `slugify()`)
explicitly map those five letters before the generic NFD strip.


## Deferred roadmap (not started)

- Phase 2 — trip context (dates/closures) and shared traits (kid-friendly,
  vegetarian, etc.) across both pins and shapes.
- SRI hashing on the CDN script tags.
- Nominatim autocomplete-while-typing (currently only fires on submit).
- **Plans: route mapping.** Draw a plan's route between its stops, in order,
  on the map (walking route, or straight legs as a first cut), so the order
  of the journey reads from the map itself. Today the order shows only
  through the grey stop numbers: list numerals plus map tags, chosen by the
  owner as the interim "until we can do full mapping". When this ships,
  reconsider whether the numbers (list and map tags) are still needed or
  should change. Open questions: routing source (no OSM routing connector in
  the sandbox; the owner's browser only), cross-city legs, dense knots of
  stops, and a starting-point marker (the owner floated one).
- Plans, deferred from v3 §6: add a stop from a place's popup or straight
  from the add form; share a route to Maps; animate the default fit (the
  build jumps).
- **Edit a place after adding it** (owner, 2026-10-14: "editing a place is
  a future update for sure"). Today only star and visited change after Add.
  The + placement crew's blank-tag form (design/add-button-placement/)
  suggested reopening a place's tag in pencil as the edit surface.
- **Save a place by tapping a real business on the map** (owner, 2026-10-14:
  holding a spot "would not work very well unless there was a place
  underneath it that the map was providing ... i could see this in the
  future once we make this an iphone app and integrate real maps"). Needs a
  map with POIs; not with today's Leaflet tiles.
