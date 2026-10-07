# Owner's pending iPhone checks

Moved from `CLAUDE.md` (2026-09-29); items describing superseded behaviour
were rewritten to current behaviour or dropped the same day. Things only the
owner can verify on a real device (the sandbox can't reach Supabase, tiles,
or OSM). Remove an item once the owner confirms it; add new ones when a
feature ships. Specs for each feature: `docs/shipped.md` (latest entry wins).

- **FIRST: run the short-address backfill** (`tools/short-address-backfill.html`,
  in your browser, signed in). Until it runs, no tag shows an address line
  (0/202 places have `short_address`/`address_details`); the tag lays out
  cleanly without it. Afterwards, check a few tags show "street number · area".
- iPhone check of the Hanging Tag + orange star (landed 2026-10-07):
  (1) tap a pin: the map pans it under the top controls and the tag pops out
  of the pin on a straight string with one bounce, smooth in Safari; with
  Reduce Motion on, it is simply there; (2) tap a list row: the map flies,
  then the tag opens on arrival (pins, a district, a street, an approx pin);
  a district/street hangs from a small dot in its middle and Directions goes
  to that dot; (3) a long note (Værnedamsvej) shows in full; the list lowers
  only as far as the tag needs, with clear map below it (never past its
  header, one row and half the next, the full row being this place's), and comes back to
  the same height and scroll on close (x, map tap); a list you collapsed
  stays collapsed; ▼/▲ while a tag is open works and the tag stays;
  (4) Directions, Star and Visited are each one tap with a haptic tick on
  Star/Visited (iOS 26.5+ included); nothing moves on tap; Visited stamps
  onto its segment and the tag paper stays the same cream; (5) tap another
  pin while a tag is open: it swaps in one tap; a drag that starts on the tag
  doesn't pan the map; (6) signed out: Directions works; Star/Visited are
  greyed and a tap shows the sign-in slip under the tag; the first tap
  elsewhere only dismisses the slip; SIGN IN opens the sign-in sheet and you
  come back to the same tag, now live; (7) VoiceOver: focus moves into the
  tag on open and back on close; greyed controls read "Star, sign in to
  use"; the slip is announced; (8) the brand-orange band and the paper
  texture look printed on real map tiles in daylight, the same orange in
  every city; the orange star with its keyline reads on rows, pins,
  clusters (set off the disc) and the add form; the selected row is navy
  with an orange star, and a pin tapped on the map selects its row;
  (9) the tag's edges stay clear of Safari's 24px back-swipe edge and the
  bottom toolbar; the OSM credit stays visible; (10) the short address shows
  under the name once the backfill has run (`tools/short-address-backfill.html`);
  rows the backfill could not fill show no address line.
- iPhone check of the Hanging Tag follow-ups (branch `tag-followups`, 2026-10-07):
  (1) a starred tag shows the orange band and the orange star + STARRED, no
  pencil circle; (2) with the list where you left it, tap a pin on the MAP
  whose row is scrolled out of sight: the list scrolls just enough to show
  its navy row in full (above Safari's bottom toolbar), the tag and map
  don't jump, and closing the tag puts the list back where it was; tapping
  a ROW never scrolls the list; (3) touch and VoiceOver: opening a tag shows
  no new mark on the eyelet or string (they stay grey/cream); with a
  keyboard (iPad or a Bluetooth keyboard: Tab to a pin, Enter) the eyelet
  ring and string turn navy while the tag itself has focus; (4) VoiceOver on
  Directions reads "Directions, link" then "Opens in Maps"; (5) the list
  header's soft shadow appears once the list is scrolled (no :has() needed
  now); (6) on the narrowest phone you have (iPhone SE 320pt: tag 288px) the
  tag hangs centred under its pin (it sat 14px left before) and the stub's
  labels stay on one line; at 240px (Chromium only, screens under 272pt)
  MARK VISITED takes two centred lines with all three icons level.
- iPhone check of the visited sticker's light + fold (branch `visited-sticker-2`): (1) mark a
  place visited from its popup: the map pin arrives lifted and is pressed down, the flap settling
  last (~200ms), with no flicker or jump in Safari; (2) during the row swipe's hover the check bends
  into the curl near the lifted end and relaxes flat as it is pressed; (3) at rest the four corners
  look lit from one upper-left light (an upper-left peel shades its own face, a lower-right peel
  throws a faint shadow past its edge) and nothing reads harsh; (4) a visited Plans stop's number is
  never cut by its flap.
- iPhone check of the visited sticker (branch `visited-sticker`; cream +
  neutral look): (1) in daylight the cream sticker with its check reads as
  "done" and a to-do pin (coloured ring + glyph) is obviously different at
  NEAR and FAR, with most places visited; (2) the flap (lower-left lifted
  corner) is visible at FAR (16px) and its soft shadow looks natural on real
  map tiles, and the cream face's thin edge holds on cream land and white
  roads; (3) the visit swipe on a row: the sticker hovers lifted, is pressed
  down at the commit, the flap settles -- smooth, no flicker, the name's
  tail never shows under the sticker; un-visit peels it off; (4) swipe feel on
  already-visited rows is unchanged; (5) real long names: truncation with the
  72px sticker is acceptable; (6) a visited Plans stop keeps its number,
  legible over the flap; (7) a visited district/street shows the sticker at
  its anchor, with the star on its shoulder when starred; (8) the selected
  visited pin (dark neutral with cream check) pulses and reads.
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
  7. **(Gate, fix-d7)** With Settings → Accessibility → Motion → Reduce Motion **on**, un-visit a row with a left stroke from the X, then tap the X straight away: no delete confirm. Wait about a second and tap the X again: the confirm appears (cancel it). Also nudge the X 5–10px and back to the start before lifting: no confirm.
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
- iPhone check of Plans (v3 build). **Before the migration is applied (do
  this first):** (0) open filters, tap PLANS: the picker beside the switch
  reads NOT SET UP YET and does nothing when tapped, the list says "Plans
  aren't set up yet.", the city and category chips still work, the map shows
  the city as Places does (no stop pins), no error banner; tap PLACES: the app is exactly as before. A plan
  view you left open reopens in Places. **After the migration** (the operator
  applies it):
  1. **Panel, both views:** the switch and the picker share one row; every
     city chip and every category chip shows without scrolling, on PLACES and
     on PLANS, and the panel is the same height in both. The picker in Places
     is grey. Tap it: a list of plans drops over the chips (counts, ⋯ on
     every plan, New plan); the picker turns beige with its arrow up. Say if
     the map strip above the open panel now feels too short (it lost 33px).
  2. **No plans yet:** the picker reads "No plan" (grey, like an empty
     select); the list reads "No plans yet." / "A plan's stops show here and
     on the map." on two lines with one NEW PLAN button. **New plan:** the
     keyboard opens on a name field; Create opens the plan; the map frames the
     city's places; the list says "NO STOPS YET · TAP + ON A PLACE BELOW"
     above a grey caption line ("ADD FROM COPENHAGEN (n)"), then your places
     with a grey + (the × turned 45°: say if it reads as a +).
  3. **+ :** tap + on a place: it becomes stop 1 above the line; on the map
     its pin shows the grey number 1 where the icon was. Add seven places
     from different corners of the city: the map keeps every stop in view and
     never slides away from the first ones. Add a second: the slip (a band over
     the caption line, or filling the list header if the line is scrolled
     away; filter and locate stay tappable) reads "STOP 2 ADDED · HOLD A NUMBER TO MOVE"
     (only once per phone), later "ADDED … AS STOP n" (a long name shortens,
     the stop number always shows); the slip ends up on the divider line, never
     over the new stop's name or the next row's + / ×. **Undo** inside 6s
     takes it back out. A sideways stroke that starts on + adds nothing.
  4. **Numbers at 1x:** grey numbers left of the icons; the chevron in the
     header, the numbers and the icons of the places below the line all sit
     on one vertical line; a stop's icon lines up with the first letter of
     the place names below (ring to round letters). Say if anything looks
     off-axis at arm's length.
  5. **Hold-to-drag vs scroll:** rest a thumb on a number and hold still
     about half a second: the row lifts onto paper; drag it and drop: the
     slip reads "MOVED … TO STOP n · UNDO"; Undo puts it back. Then rest on a
     number and scroll right away (or after a short rest): the list scrolls,
     nothing lifts. Long move: with the panel open, drag stop 7 to the top
     edge of the list: the list scrolls under it until stop 1.
  6. **Long-press callout:** holding a number never brings up text selection,
     the magnifier or a copy/share menu.
  7. **Back-swipe from the left edge:** the number's touch area reaches the
     screen's left edge. In Safari and from the Home Screen app, swipe in
     from the very left edge over a stop row: say whether iOS goes back, the
     row's visit swipe runs, or a row lifts (it should never lift without a
     still hold). Then rest a thumb at the edge on a number (as when holding
     the phone) and scroll: it should just scroll.
  8. **× and Undo:** × on a stop removes it (the place stays in Places, below
     the line with +); the slip says "REMOVED …"; Undo puts it back at the
     same number. Swipe a stop row right (star) and left from × (visit): both
     work as in Places and nothing is removed.
  9. **Map numbers:** each stop on the map is its pin with the grey number
     where the icon was (selected: filled, white number); zoom out until stops
     join red clusters: the cluster shows a small grey ring (a circle, or a
     pill for "2–4") right beside its count ("2–4"), never on top of the digits; tapping the tag zooms in like
     the red disc. Where clusters crowd, two clusters' stops share one tag
     ("1–2,4–5"); no tag ever sits on another, and no star or disc covers a
     tag's numbers. In daylight at arm's length the tag numerals (10px) and the
     caption line above the places ("ADD FROM …", 10px) are readable. Say if the thin
     ring tag reads as part of its cluster, and if a stop's category is hard to tell from its ring colour alone.
  10. **The map's two jobs:** with the panel open the map shows the stops and
      the places you can add; close the panel: it re-fits to the stops (the
      selected city's leg on a two-city plan). Pan yourself, then close and
      reopen the panel: the map stays yours.
  11. **Filters in Plans:** tap a category chip or a city: the stops all stay,
      the list jumps so the caption line is at the top, and the caption names
      the filters; tap the plan's name in the header to get back to the
      stops. ⇅ sorts only the places below the line ("Sort places not in the
      plan").
  12. **Panel on a real phone:** the picker's list over the chips scrolls if
      long; closing the panel closes it; Rename and Delete from ⋯ work on a
      plan that isn't open; Delete asks with the phone's own dialog.
  13. **Places ×** on a place that is a stop asks "It is a stop in “…”; it
      will leave that plan too."; the plan renumbers 1..n.
  14. Signed out: everything readable; +, ×, dragging a number to a new place and
      New plan open the sign-in.
  15. **UX round:** double-tap + quickly: only one stop is added. Remove two
      stops within 6s: one slip "REMOVED 2 STOPS"; Undo brings both back in
      place. Rest a finger on the slip past 6s: it stays; lift: it goes 6s
      later. Undo is easy to hit without catching the × above or the + below.
      Adding and removing: the rows around the change slide to open or close
      the gap (no flash); with Reduce Motion on, instantly. With many plans the
      picker's list scrolls with a half row showing at the bottom and New
      plan pinned; with 0 or 1 plans its edge never cuts through a chip.
      Airplane mode in Plans: the picker reads OFFLINE and the stops stay.
      VoiceOver: the sliders button reads "Filters and plans", expanded or
      collapsed; account and locate have names.
  16. A starred + visited stop with a real long name: the row is the same
      136px-wide text area as in Places; say if names truncate badly.
- iPhone check of the owner-approved Places changes (2026-10-01): (1) with the
  filter panel open, tap a row in the list (Places, and a place in Plans): the
  panel closes, the map flies, and the popup opens fully visible above the
  list; reopen the panel: your filters (and plan) are as you left them; the
  delete × and Plans' + / × never close the panel. (2) Turn every category chip
  off: the list says "NOTHING MATCHES THESE FILTERS."; pick a city with no
  places: "NOTHING HERE YET." (3) Airplane mode, then star or visit a place: it
  flips back and the red band says "COULDN'T SAVE. CHECK YOUR CONNECTION.",
  gone after about 6s; while offline the navy band "OFFLINE. SHOWING WHAT'S
  LOADED." appears at the next refresh and goes when you're back online; any
  band disappears when tapped and sits above the round account / + buttons.
- Plans-only picker + scrolling filter panel (2026-10-02): open the filter panel. (1) Tap Plans, then Places, several times: the switch, the panel's top edge, the map and the list must not move at all. The plan picker shows only in Plans, under the switch. (2) In Plans, flick up inside the chips: the panel scrolls, momentum included, until DISTRICT / STREET are fully visible and tappable. The switch and picker stay put, and the map and list must not scroll or pan. Flick down to return. (3) Toggle a category chip on and off: nothing moves. (4) Open the picker in Plans after scrolling the chips: the list drops under the picker with no half-cut chip showing below it.
- Shape parity (2026-10-02, districts and streets visit and star like pins): (1) on a DISTRICT and a STREET row, swipe right: the pencil star draws and inks, the row stays 56px; swipe right again: it rubs out. Swipe left from the ×: the VISITED stamp presses and the row recedes; again: it lifts off. A tap still flies to the shape and opens its popup; a quick tap on the × asks to delete, a wiggle on it never does. (2) The shape's popup now matches a place's: star, name, note, GET DIRECTIONS (Apple Maps opens on a point on the street / inside the district: say if it's a sensible place to go), the type line and MARK VISITED; star / Mark Visited each give one haptic tick and replay on the list row. (3) A starred district/street shows the black map star on the shape at its zoom; unstar removes it. (4) Star or visit a district on one phone; within ~10s the other phone's row and popup show it. (5) Sort by Starred / What's left: the district/street block orders by its own marks (still after the places). (6) Plans: add a visited district/street as a stop: its stop row shows the stamp like a place stop. (7) The add form shows STAR for District/Street too; a district added starred arrives starred.
- Short address backfill (2026-10-05, in a browser, phone or laptop): (1) open the app and sign in, then open `https://adamtrabold.github.io/la-trip-map/tools/short-address-backfill.html` (the app's address with `tools/short-address-backfill.html` on the end; same site, so it says "Signed in as ..."; if not, sign in on the page). (2) Tap **1. Load places** (about 200), then **2. Look up**: about one place a second, roughly 4 minutes for all; Pause or closing the page is fine, it resumes. (3) Read down the list: each place shows its full address and, after the arrow, the short form (e.g. "Jægersborggade 57 · Nørrebro"). Untick any that look wrong; say which and why, so the rules can be tuned. (4) Tap **3. Write checked**: it says "Wrote N." (5) Add a new place in the app from the autocomplete; within a minute the operator can confirm in the database that it got a short address (or reload the tool: the new place should not be listed).
