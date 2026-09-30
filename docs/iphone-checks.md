# Owner's pending iPhone checks

Moved from `CLAUDE.md` (2026-09-29); items describing superseded behaviour
were rewritten to current behaviour or dropped the same day. Things only the
owner can verify on a real device (the sandbox can't reach Supabase, tiles,
or OSM). Remove an item once the owner confirms it; add new ones when a
feature ships. Specs for each feature: `docs/shipped.md` (latest entry wins).

- iPhone check of the ⇅ list order: (1) ⇅ sits between the title and the
  filters icon, same weight as the sliders; a tap on it never opens filters
  (and vice versa); the longest city title isn't cut. (2) The menu rises
  above the sheet over the map, collapsed or not; tapping the map/list
  while it's open only closes it. (3) Pick each order: A–Z, Category,
  What's left, Starred, Newest reorder the list and nothing disappears.
  (4) Nearest: iOS asks for location only now; the list sorts by distance
  with "NN M ·" leading each row; walking a block (~150 m) re-sorts, small
  moves don't. Deny location: back to A–Z with a short banner, Nearest
  greyed "Location off". (5) Close and reopen the app: the order is
  remembered (Nearest only if location is already allowed). (6) Star a row
  in Starred order / visit one in What's left: the animation plays in
  place, then the row moves. (7) VoiceOver: ⇅ reads "Sort list, A–Z",
  the menu reads as radio items, the new order is announced.
- iPhone check of the popup round: (1) a long-name place opened high on
  the map settles below the controls/Dynamic Island, and tapping the
  star's left edge stars it (never zooms out); (2) one haptic tick per tap
  on popup star, popup Mark Visited and the add-form STAR (none with
  VoiceOver); (3) the popup star fades + pops (no pencil) and unstar fades
  off with a gentle lift (no rub, no dust); with the popup open it plays
  once per tap and doesn't replay after the save; (4) popup Mark Visited / star / unstar replay on the list row
  behind the popup every time; (5) the 1.10× visit pop still reads as a
  thunk, distinct from the 1.12× un-visit lift; (6) Get Directions text
  link sits right under the notes; category left, Mark Visited + circle
  right.
- iPhone check of the sheet fix: (1) Home Screen: the list reaches the
  bottom with no band; collapsed band just above the home indicator; map
  still behind the clock. (2) Collapse/expand: map meets the sheet, no
  sliver/overlap. (3) Safari tab: rows scroll behind the toolbar and the
  last row ends fully above it; the collapsed band sits right on the
  toolbar (if it floats ~100px high or hides under it, report the gap).
  (4) Dragging the band/map edge/list end never moves or rubber-bands the
  page. (5) Filters panel flush on the sheet. (6) Login: scrim covers
  everything; the password field lifts above the keyboard; dismissing
  returns the page to 0. (7) Rotate / toolbar minimise: band follows.
- iPhone check of swipe-left visited (#1 is a gate):
  1. **(Gate)** A left stroke from the X or the row's right half visits. A 4–12px nudge on the X never raises delete; a still tap does (dial `DELETE_TAP_SLOP` 3–6).
  2. The drag reads as **ink bleeding into the paper**: a drop at the centre soaking outward in the stamp's own navy, thinner — not fog, not a focus pull, not a brighter blue.
  3. At ~54px it still looks unfinished (ends soaking); the press snaps it crisp with the grow-shrink and settles at the stamp's tilt.
  4. Let go early: it dries away with no stain.
  5. On the focus (highlighted) row the bleed is visibly weaker than the pressed stamp.
  6. No hitch as the ink deepens mid-drag on a long list.
  7. Un-visit lifts with the star's erase pop, pales, never darkens or goes grey.
  8. The scaled mask and fibre edge render without shimmer.
  9. Haptics: swipes are silent on iOS 26.5+ (incl. iOS 27) — the platform limit, not a bug. Android / iOS ≤26.4: one tick on the press, a double tick on the lift.
- iPhone check of the Pencil Star (in this order — #1 is a gate):
  1. **(Gate)** A horizontal stroke on a list row engages the star (iOS Safari delivers a *cancelable* `touchmove`). If it never arms, stop and report before anything else.
  2. Loose-thumb flick scrolls never stick or catch a row; 34–45° drags scroll; no jank on a long list (non-passive `touchmove` on every row).
  3. A stroke starting ~24–40px from the left edge stars and isn't taken by Safari's back-swipe; one from the very edge still goes back.
  4. A real quick flick stars; a flick on a starred row springs back without unstarring.
  5. At a natural swipe you can **watch** the star being pencilled stroke by stroke. The ink lands twisted, swells and holds, then turns upright to size in about ⅓s. It reads as a stamp pressed home, not a bounce. If the dip after the swell reads as a second bounce, apply the undershoot dial (0.97). The pencil grain reads as graphite on the OLED; dial `HAND_MS` for the pencil pace.
  6. The unstar commit — the ghost vanishes and the first speck drops at the crossing — is noticeable in daylight; if not, apply the ghost dial (0.35, ceiling 0.45).
  7. No flicker at the FLIP swap, the feathered edge, or the pencil → ink hand-off (the spin-stamp landing starts at full ink on its first frame); `color-mix()` renders in the SVG fills.
  8. The 80ms press feels like a press, not lag; a quick tap's press on release reads as a press, not a flash; no dark blink at the start of a stroke or a flick-scroll.
  9. Star a place, then immediately tap the next one: it navigates.
  10. Still open from before (keep them): the popup star's 44×44 target keeps an 8px dead band to Get Directions below it and its `z-index:201`/`202` upper target still wins over the category glyph, the map's ink star on real tiles, list-tap → pinch mid-flight → no popup, the add form's STAR row, and the press/tilt, visited-background and visited-stamp checks below.
  11. The pressure step at 56 is visible under the thumb, and the 3px catch is felt, not seen as a glitch (dials: pressure 1.3–1.5×, detent 2–4px).
  12. The soft black star beside the category ring reads as one entry ("★ Name"), not a second badge; softened but still a star in daylight. If it feels heavy, fall back to `--ink-2`.
  13. The swept dust reads as eraser crumbs brushed off — not dirt beside the badge or a colon before the category. If it reads as punctuation, shorten the fade toward 160ms or trim to two specks.
  14. Three quick stars down the list all land, each visibly inking.
  15. On unstar, the name leaves at lift; nothing feels stuck.
  16. The −12° pencil lean looks hand-drawn, not broken (dial −7° to −10°).
  17. The popup star's spin-stamp swell (1.4× peak, same as the row since p8 gave it the row's 18px slot) never feels crowded against the title; if it does, lower the peak in `@keyframes sgpPress`.
  18. **Haptic. First check Settings › General › About › iOS Version.**
      - **Popup star tap:** one click on every tap, star and unstar alike, on **any** iOS ≥18, including 26.5+ (same `hapticTap()` path as popup Mark Visited and the add-form STAR — see the popup round check (2)).
      - **Row swipe:** on iOS 18.0–26.4, one click as the ink lands and a double click as the erase dust falls. **On 26.5+, expect no click from a swipe: that is the platform limit, not a bug.**
  19. No side effects: an open account menu or address suggestions stay open after a swipe-star or swipe-erase. Nothing flashes on screen, and focus never jumps.
  20. With VoiceOver on, double-tapping the popup star toggles it exactly once, and VoiceOver announces only "Star, toggle button"/"selected". There is no stray checkbox.
- iPhone check of press + tilt: (1) pressing a row reads as pressed in,
  not a flash, on both visited and unvisited rows (no dark blink at the
  start of a flick-scroll is Pencil Star check 8); (2) the ±2°–±5° stamps
  (six per-place buckets, both directions) look deliberate and
  hand-stamped, not broken.
- iPhone check of the visited-row background: (1) at a glance in
  daylight, visited rows visibly sit back from unvisited ones (if not,
  apply the dial — field and divider together); (2) the visited field
  reads as warm, older paper, not grey. (Its original check (3), "pressing
  a visited row flashes lighter", is superseded: the owner found that
  flash too light and presses now go darker — see the press check above.)
- iPhone check of the visited stamp (round 3): (1) the outer track is
  evenly spaced round dots, no bunching/collision at top-centre (if it's
  uneven or solid, swap in the JS fallback per
  `design/visited-badge/README.md`); (2) the dotted track and solid ring
  look parallel — even gap all the way round; (3) "VISITED" looks centred,
  and if off at all, high rather than low; (4) scroll, then immediately
  tap a stamp — the map should navigate; (5) tap just left of the X on a
  visited row — should navigate, not raise the delete confirm; (6) stamp
  text at arm's length looks crisp, not soft. (Tilt is the press + tilt
  check above.)
- Smoke-test the new shape-city resolution in a real browser (agent
  sandboxes here can't reach Nominatim/Overpass): add a district/street
  that should confidently match an existing city, one that should trip the
  `shapeCityConfirm` dialog, and try both its "Add city" and "Add to
  [city]" buttons.
- Re-run `tools/neighborhood-shapes.html` for `reykjavik-klapparstigur` in
  your own browser. The tool now auto-drops OSM segments that disagree with
  the majority-voted city (see Architecture in `CLAUDE.md`), which should exclude
  the ~50km Keflavík fragment without needing to eyeball the preview map —
  but this hasn't been verified against the real Overpass response, since
  the agent that wrote it can't reach Overpass either. Check the card's
  warning text before accepting.
- Browser/iPhone check of search widening (needs live Nominatim; any
  browser, signed in, open Add):
  1. **Other town, same country:** put the map on Stockholm and type
     "Uppsala domkyrka". After a short extra pause (~1s), Uppsala
     Cathedral appears. Picking it shows "Uppsala isn't in your city list
     yet. Add it?" (expected; filing is unchanged).
  2. **Other country:** put the map on Reykjavík and type "Vasamuseet".
     The Stockholm result appears; picking it files under Stockholm with
     no prompt. Then type "Bryggen Bergen": the Bergen result appears,
     with an "Add Bergen?" prompt on pick.
  3. **Local search unchanged:** with the map on Copenhagen, type a
     Copenhagen place (e.g. "Torvehallerne"). Same results and speed as
     before, no extra pause.
  4. **Typing fast:** type a miss, then keep typing within a second. Only
     results for the final text show, never a flash of older ones.
  5. **District:** Add → District, map on Stockholm, name "Fjärdingen"
     (Uppsala). It fetches an outline and asks which city.
- iPhone check of the state system: (1) press and hold each header icon
  (collapse, sort, filters, locate): a soft beige tile appears behind it, no
  dimming; (2) open filters: the icon becomes a navy tile with a paper glyph,
  same as sort when its menu is open; pressing an open one keeps navy; (3) press
  a city chip or category chip: the chip goes beige while held; (4) popup Mark
  Visited: a beige tile shows while pressed, then the usual toggle; (5) Add
  form submit while saving looks dim (.4), still legible.
- iPhone check of Plans, phase 1 (only once the plans migration is applied;
  before that, step 1 only): (1) open filters: a PLACES | PLANS switch sits on
  top, Places navy; tap Plans: the chips disappear and your plans list shows
  (before the migration: "Plans aren't available yet.", and nothing else in
  the app changes); (2) New plan: the keyboard opens on a name field in the
  row; Create opens the plan, the panel stays open, the list shows EDIT STOPS
  (greyed, "Coming next") and "No stops yet."; (3) with a plan that has stops
  (added by the operator for now): stops in order, outline number tiles, the
  first unvisited one solid navy, the same numbers inside the pins on the map
  (a district gets one numbered diamond), no ⇅; tap a stop: the map flies
  there and the popup says "· Stop n of m"; (4) swipe a stop row right and
  left: the star and VISITED stamp work as in Places, and the solid number
  moves on to the next unvisited stop; (5) ⋯ on the open plan → Rename (the
  keyboard opens, Save/Enter), then ⋯ → Delete plan: the phone's own dialog
  asks first; (6) switch back to Places: the same city, its list and count,
  ⇅ and the X's all back; (7) close and reopen the app: it reopens where you
  were (the plan, or Places); (8) signed out: plans are readable, New plan
  opens the sign-in; (9) note the Places side of the panel now scrolls a
  little (the District/Street chips sit below the fold on most phones):
  say if that bothers you.
