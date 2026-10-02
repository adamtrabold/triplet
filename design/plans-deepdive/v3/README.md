# Plans v3: the build spec

This is the current spec for Plans, phase 2. It replaces phase 1's read-only Plans and v2's Edit mode. It is the result of fifteen review rounds; the history is in git (branch `plans-v3`). The checklist is `design/ACCEPTANCE-plans.md`. `truths.md` lists every frame's asserted facts.

**Owner's words that set it:**
> "if I make a plan I need to filter against the places to add things … I need a filter panel that supports all the chips and location menu on both views"
> "the numbers feel really egregiously attention grabbing … the number/drag control should probably be on the left"
> "I don't like using a different approach for clustered places … color coding is not enough to know which kind of place it is … needs to preserve the icon so a simple number should do in the left column"
> "Next isn't necessary. Numbers should be grey no need for a blue one or multiple states. Left Padding should align with how it's treated everywhere else and have that solid left visual channel. Getting heavy handed with the thick blue lines (divider/select box pattern)" (round 11)
> "Number should be to the left of the icon. I like that moving the icon over— it provides another visual differentiator against the normal list" (round 13)
> "Alignment is still a lil weird— should be a centered vertical line for all the left column things (chevron, number, icon)" (round 14)
> "Now make sure the icon in the plans list is visually left aligned with the text in the normal list…looks off. May not follow mathematical number…so check that" (round 15)

The owner confirmed that "location menu" means the city chips.

## 1. The model

Places | Plans is a switch. It changes only what the list shows, and so what the map draws. Filters, sort and the panel are shared, and a city or chip never changes the view.

- **Places** is the app as it is today.
- **Plans** is where you both build and follow a plan. There is no Edit mode, no DONE and no "Edit stops".

## 2. The filter panel (identical in both views, same height)

- **One 61px row:** Places | Plans (176px) and the **plan picker** (the open plan's name ⌄). The picker is grey in Places, where picking a plan opens it in Plans.
  - Tapping the picker drops a slip over the chips. It lists every plan with its stop count and ⋯ (Rename / Delete, for any plan, without opening it), plus New plan.
  - The picker and the switch use the city chips' language: a 1px `--hair` edge on `--paper-raised`, ink text. The switch's ON half is the state system's solid navy tile, the same as a selected city chip. The plan list that drops from the picker has a 1px `--hair` edge and a 2px `--hair` drop, not the sort menu's navy box.
  - Open state: the pressed tone with the chevron turned up. This is a named exception to the state system's "open = navy", because navy beside the solid PLANS half read as a third segment.
- **The city chips** (LA, Reykjavík, Copenhagen, Malmö, Stockholm, ALL CITIES) and **the 11 category chips**, exactly as in Places.
- **Height:** the panel's max height grows by the 33px it would otherwise scroll, so every chip shows unscrolled in both views. The cost is that the map above the open panel is 33px shorter than on main.

## 3. The Plans list

1. **The plan's stops**, all of them and in plan order, whatever the filters. The chips choose what you can add; they never hide your plan. Hiding a stop would break the numbering and the route.
2. **Places' own group divider** (2px of `--hair`, as where a category changes in Places) **with a one-line caption**, e.g. "ADD FROM COPENHAGEN · CAFE (1)": where the plan ends, and what the filters put below it. The caption does the telling, so the line stays quiet.
3. **Every place and district/street the filters match that isn't a stop**, in the current sort (⇅ is shared with Places and orders only this part; the menu caption reads "Sort places not in the plan"), each with +.

**Rows**
- **Layout (r14, owner): one left axis.** The app's left column is centred on x=30: the 16px gutter plus half the 28px glyph column. The header chevron is centred on it, and so is every Places icon. In Plans:
  - A **stop row's number** takes the glyph column and is centred on that same line. Measured on the glyph, 1 and 2 digits alike: 30.00px, the same as the chevron.
  - **Its category icon** moves one column over, to the 28px column at x=56–84. Its text follows at x=96.
  - **r15: the icon is placed by its ink, not its box.** A 24px badge centred in its column puts its ring's ink at 58.0px, 1.3px right of where the Places names' letters start. So the stop icon is shifted with `transform: translateX(-1.33px)` (a transform, so the sub-pixel shift isn't snapped to a whole pixel). The district diamond is shifted -1.83px. Measured from the pixels at 3x, the rings' ink now starts where round capitals (C, G, O, S) start, and the diamond's tip where pointed capitals (A, T) start; that is the type's own optical rule (§11).
  - **Places rows below the divider** are plain Places rows: icon centred on x=30, text at 56.
  - The stops' shifted icons set them apart, which the owner asked for in round 13. Rows stay 56px.
- **The number** is plain and has **one state**: 13px/600 `--ink-2`, tabular, centred, with no ring, tile, rim or navy. It carries 4% of the name's ink at 1x (the phase-1 tile was 21%, its NEXT tile 114%).
- **A starred stop** keeps Places' star slot at the head of the text (star x=96, name x=122). The number and icon do not move.
- **Places itself is unchanged.** Its chevron and icons were already centred on x=30, so the rule needed no change there.
- **There is no NEXT** (owner, round 11). A visited stop is simply a Places visited row (filed field + stamp); Plans adds nothing of its own. The popup keeps "Stop n of m".
- **× on a stop** (the Places delete ×'s slot, grey) removes it from the plan; the place stays in Places. Undo lasts 6s.
- **+ on a place** is a bare glyph (20px/400) in the same slot, grey (`--ink-2`) like × (r12, CD): the glyph, + or ×, says which. It is quieter than the name and the icon. Both fire only on a near-still tap (`DELETE_TAP_SLOP`), with a 44×44 hit area.
- **The slip:** "Added Hart Bageri as stop 7 · Undo" / "Removed The Coffee Collective · Undo". For its 6 seconds it sits **on the rule**, covering exactly the rule's caption line, because it is news about the plan's edge. If the rule is scrolled out of the list, it sits on the list header over the plan's name. When the one-time drag hint needs more room, it also covers the collapse chevron and ⇅ for its 6 seconds, never the filter toggle or locate, and its letter-spacing drops to 0.04em so it fits one line at 390px (frame 06b). It never covers the map (the stops' tags), the chips, a stop row or any row's + (its 44px hit area). It moves with the list when you scroll or toggle the panel. See §4 and the matrix SLIP checks.

**Reorder**
- Hold the number (or the badge) still for 400ms (r12, UX: clear of a scroll's settle), then drag. The lifted row sits on `--paper-raised` with a `--hair` edge and drop, not a navy box. The row lifts and stays inside the list's box, and the other stops make room.
- Within 48px of the list's edge, the list auto-scrolls, so a 7-stop plan moves stop 7 to stop 1 even with the panel open.
- Keyboard: ArrowUp/Down moves a stop one place; Home/End moves it to first or last.
- The number's hit area is 44×44. Until the hold arms, a touch on it belongs to the row: a tap flies, a vertical stroke scrolls, and a sideways stroke stars or visits, as in Places.
- **Finding it:** the first time a plan reaches 2 stops, the add slip reads "Stop 2 added · hold a number to move", once per device. On desktop the number shows a grab cursor.

**Empty states** (one quiet line each):
- "No places match these filters."
- "Every place these filters match is in this plan."
- "No stops yet. Tap + on a place below."
- "No plans yet. A plan's stops show here and on the map." with a New plan button (sign-in first if needed). With no plan open, the map draws nothing and ⇅ hides.

**Header:** the plan's name, fitting 20 characters at 390px. After a filter change the list scrolls so the rule is at the top; tapping the plan's name returns to the stops.

## 4. The map (Places' approach; only the stops differ)

- **Everything that isn't a stop is exactly Places:** pins, red count clusters, `SOLO_MIN_ZOOM`, tap-to-zoom, and the highlight on a tapped place.
- **A stop** is its ordinary Places pin (same ring, same glyph) plus a small **numbered tag**: a square paper tile with a 1px `--ink-2` edge and an `--ink-2` numeral. It looks the same for every stop, with one state and no navy.
  - The tag alone marks a stop. There is no heavier rim and no outer ring.
  - **r17 (owner): stops cluster exactly like any place:** same grid, same `SOLO_MIN_ZOOM`, same red count disc (its count includes the stops), same tap-to-zoom. A district/street stop clusters at its centroid. A cluster that holds stops carries **one grey tag with their numbers** at its shoulder (§12). A stop outside every cluster keeps its pin and tag.
- **Tags:**
  - Each tag takes the first free spot of eight (re-placed after every pan and zoom): the four corners (upper-left, upper-right, lower-right, lower-left), then the four sides. A free spot touches no cluster, no other stop's pin, no other tag, no screen edge and **no map chrome** (the zoom control, the account and + buttons, the attribution). A spot is also not free if its centre is nearer any other marker (a place pin or another stop) than its own pin, so a tag always reads as its own pin's; place pins are soft obstacles. If none is free, the least-bad spot wins (screen edge > map chrome > another tag > nearer another marker > another stop > a cluster > a place pin).
  - **Travel cap:** the tag always touches its own pin: its near edge is at most 13px from the pin's centre, and there is never a leader line. A tag that can't find room overlaps something rather than floating away from its pin.
  - The 12px margin round a stop's pin is pass-through, so it never covers a neighbour's tag or takes its tap.
  - Stops whose pins overlap keep their pins at their true spots and share **one** tag on the lowest number's pin, labelled with all their numbers ("1–6", "2–3").
  - So every stop number is visible and no cluster count is ever covered.
- **Stacking (Leaflet adds the marker's screen y to these, so the steps are 5000 apart):**
  - selected stop 35000
  - **Places clusters 30000** (they beat every pin in Places, and here stops too; a cluster that holds stops carries their tag)
  - stop 20000−n
  - the tapped place 15000
  - places 0–500
- **Default view** (opening or picking a plan, a city or category chip; opening or closing the panel, per the rule below). Everything is framed inside a **safe box**: 24px in from the sides, 16px below the zoom control and round buttons, and 24px above the open panel (or above the attribution when the panel is closed). Nothing is framed under a control.
  - **Building (panel open):** fit the stops **and every place the filters match**, so you can see what you are choosing from. There is no zooming in for a close pair; overlapping stops share one tag ("1–6").
  - **Following (panel closed)** (r12, UX ruling): fit the stops in the **selected city chip**, which is the "which leg am I on" control, with no new UI. With ALL CITIES, or when that city has no stops, fit every stop. Stops whose pins overlap share one tag ("2–3"), so one close pair never sets the zoom. On a two-city plan, Copenhagen on frames the Copenhagen leg (frame 30) and Malmö on frames the Malmö leg (30b).
  - **Cross-city:** picking Malmö while building a Copenhagen plan fits the stops and Malmö's places together (frame 07). The stops become a "1–6" knot, but they stay on screen, so stops 2–6 are never hidden.
- **Opening and closing the panel:** the map changes job (building ↔ following), so it re-fits both ways, as long as the map is still where the app last put it (a fit, or the pan after +). Once you have moved the map yourself, it stays yours. Closing then leaves it alone, since you only gain room. Opening keeps your zoom and pans the least that lifts the stops you had on screen out from under the panel; it zooms out only if they can't fit in the strip. The matrix `*-reopen*` cells cover this: untouched, after your own pan, and after a + (all three plans).
- **After +:** the new stop stays in view. If its pin is outside the safe box and the map is still where the app put it, the view re-fits every stop, the new one included (frame 06, owner-05). If you had moved the map yourself, it pans the smallest distance that brings the new stop in, with no zoom change.
- **The slip** sits on the rule (see §3), never on the map.
- **Known and accepted:**
  - At zoom 14 and above, stops can sit over candidate pins; their category and name are one list tap away.
  - Zoomed far out, a plan is a pin knot with one "1–6" tag.
  - **Honest cost (owner-10b):** zoomed out (about z8 to z11), Places' red count discs draw over stop pins. You see the stop tags ("1–6") but not the pins' glyphs. The **building** view opens there when the plan and the places to add are spread out: the Nørrebro plan at z10, the two-city plan at z8. One or two zoom steps in clears it.
  - Below z12 (`GLYPH_MIN_ZOOM`), a place's pin is a bare ring with no glyph, as in Places. So in a zoomed-out building view, the place you are about to add is an 11px ring; its row names it.
  - Clusters draw over stop pins (the tags stay clear).
  - A visited stop's pin looks like an unvisited one on the map, as in Places today; see the visited-pins backlog item ("Visited pins on the map", `docs/backlog.md`).
  - With no plan open, the map is empty; UX found that fine.
  - Frame 34: the "4" tag sits nearly as close to a neighbouring pin as to its own (it passes the nearer-its-own-pin rule by a few px). Check it at 1x on iPhone.
  - After your own pan, reopening the panel only lifts the stops you had on screen into the strip; it doesn't check the chrome. A pin can then sit under a control, e.g. on the Harbour loop, stop 3 under the account button or stop 7 under the zoom control. Its tag moves clear, the list row still flies to it, and one drag fixes it. Known limit.
- **Owner question (owner-12):** while following, should the map show every filter match as in Places (a, recommended: one rule, and you can add as you go), or only the plan (b, frame 38)? Option (b) needs the app to guess when you are "just following".

## 5. Other states

- **Signed out:** + / × / drag open the sign-in.
- **Tables missing:** the picker reads "Not available yet", and the list says "Plans aren't available yet."
- **Collapsed sheet** and the ≥900px rail are framed (frames 26, 28).
- **The add form** opens over Plans unchanged. A new place that matches the filters appears below the rule with + (frames 36, 37).
- **Deleting a place in Places that is a stop:** the confirm reads "Delete Mirabelle bakery? / It is a stop in “Nørrebro afternoon”; it will leave that plan too." The plan closes up to 1..n (frame 39).

## 6. The smallest complete slice (ship this)

- **Ships:** create / pick / rename / delete plans; add (+), remove (× with Undo), reorder (hold-drag with edge auto-scroll, plus the keyboard); following (tap-to-fly on every row); the filters in both views; the map above. It reuses phase 1's data layer (`addStop`, `removeStop`, `reorderStop`; fail-soft) and adds `restoreStop` for Undo.
- **Deferred:**
  - Add from a place's popup, or straight from the add form.
  - Undo for a reorder.
  - Sharing a route to Maps.
  - Animating the default fit (the prototype jumps; the build can fly to the computed view).
  - **Route mapping (owner, round 14: "number may just be the simplest … (Until we can do full mapping)").** The numbers are the interim. Revisit them when route mapping exists: once the map draws the route between stops, so the journey's order shows without numbers, the number tags on the map and the list numerals could go or change.
    - Backlog entry text for the build to add to `docs/backlog.md` (Roadmap):
      > **Plans: route mapping.** Draw a plan's route between its stops, in order, on the map (walking route, or straight legs as a first cut), so the order of the journey reads from the map itself. Today the order shows only through the grey stop numbers: list numerals plus map tags, chosen by the owner as the interim "until we can do full mapping". When this ships, reconsider whether the numbers (list and map tags) are still needed or should change. Open questions: routing source (no OSM routing connector in the sandbox; the owner's browser only), cross-city legs, dense knots of stops, and a starting-point marker (the owner floated one).


## 7. Files and checks

- `harness/patch.py` is the built `index.html` (`ba0865c`) plus exact, single-occurrence edits; it is the starting point for the build diff. The tracked `index.html` is untouched, so Impeccable is unaffected.
- **Checks:**
  - `harness/frames.js` renders `frames/`: 47 states, each 390×844 at 1x and 3x, with crops. Frame 40 is a Places list for the side-by-side comparison.
  - `check.js` asserts `truths.md`: **348/348**. The round-11 lines are asserted as computed styles: the divider, picker, switch, plan slip, add/remove slip and map tag.
  - `griptest.js` covers touch, drag, keyboard, delete copy and filters in Chromium: **30/30**.
  - `matrix.js` covers the map rules, z9–z15 × three plans × panel/collapsed, plus the reorder, tapped-place, default-fit and (r9) close→reopen cells: **56 cells, all passing**; sheet at `matrix/sheet.png`.
    - R1: digits appear only on stop tags and clusters.
    - R2 (r17): every stop in view is its own pin at its true location, or a member of a Places cluster.
    - R3: other places behave as in Places.
    - R4: no cluster's centre or count is under a stop; every stop's number is on a visible tag; stops draw above place pins.
    - R5: the tapped place is under the stops.
    - R4 (r9): every tag is on a clean spot (on screen, clear of the chrome, off other tags, nearer its own pin than any other marker) whenever one exists.
    - REOPEN / SLIP (r9): after close→reopen, the stops are in the strip (untouched and after +: all of them; after your own pan: the ones you had on screen). The slip covers no tag, no visible map, no chip, no stop row and no + hit area.
    - FIT: at the default fit, no two tags overlap and every stop is inside the safe box. While building, every filter-matched place is inside the safe box when the fit zoom is 10 or more. No marker centre is under the map's chrome.
  - `sweep.js` (r9) pans Nørrebro and the Harbour loop over a 7×7 grid (±120px) at z14/z15, sheet down and panel open: 392 views, with the same tag judgement after every pan. It also reports how many tags had no clean spot (pin at the edge, under a button, or overlapped by a place pin).
  - `ink.js` (r15) measures the rendered **ink** edges (stop icons, Places names by first letter, header title) at 1x and 3x into `ink.json`. Run it before `check.js`, which asserts them.
  - `measure.js` writes the ink numbers and (r11) the row left edges to `measure.json`.
- **At build, also drop phase 1's dead NEXT code:** `.plan-tile`, `planTileHtml`, the `r.next` bookkeeping and `Z_PLAN_NEXT`. The prototype leaves them in place, unused, because `patch.py` only edits the built file.
- **Run with:** `REPO=<worktree> VENDOR=<dir with leaflet.js, leaflet.css, archivo.css, *.woff2> node harness/<script>`.
- **At build:** the number, +/× and hold-drag touch shared row plumbing, so the full gesture gate runs (star "84 + 8 (+ N8-a)", vtest, popup-open 20/20, dust, curve8, rows 56.00px). All numbers here are Chromium-only.
- **iPhone checks** (for `docs/iphone-checks.md` at ship):
  - Hold vs scroll: a 400ms hold on the numeral lifts the row; a rest that then moves scrolls.
  - No long-press callout (text selection or the link menu) on the numeral.
  - The + near-still tap.
  - Every tag at 1x, including the frame-34 "4" beside its neighbour.
- **Stage 2 (CD):** on a starred stop the name starts at 122px, not 96px, as in Places (+26). Try keeping the name edge fixed on starred stops within the star-alignment constraints; the star itself does not move.

## 8. Round 11: what changed (owner redirect), line weights at 1x

All weights are computed styles in Chromium; the check.js truths assert the after values.

| Line | Before | After |
|---|---|---|
| Stops / places boundary | 2px `--navy` rule | Places' group divider: 2px `--hair` (last stop's 1px + caption's 1px) |
| Plan picker | 1px `--navy` box, navy text | 1px `--hair`, ink text (a city chip) |
| Places / Plans switch | 1px `--navy` halves | 1px `--hair` halves; ON = solid navy tile (state system) |
| Plan list (picker's drop-down) | 1px `--navy` + 2px `--navy` offset shadow | 1px `--hair` + 2px `--hair` drop |
| Add / remove slip | 1px `--navy` + 2px `--navy` shadow; 2px `--navy` top on the rule | 1px `--hair` edge, no shadow |
| Lifted row (reorder) | 1px `--navy` ring + 3px `--navy` drop | 1px `--hair` ring + 3px `--hair` drop |
| Map stop tag | 1.5px `--navy` (renders 1px) + navy numeral; NEXT = navy fill | 1px `--ink-2` + `--ink-2` numeral; one style |
| Row number | `--ink-2` / NEXT navy 800 | `--ink-2` 600 only |

Kept, because they are Places' own and not Plans lines: the active city chip's navy fill, the active category chip's 2px rule in its category ink, the sort menu's navy box, focus rings (a11y). The + glyph went grey in round 12 (CD).

**For CD:** reusing the city-chip hairline for the picker and switch, the group divider for the boundary, and (r13) the number column left of the icon. **For UX:** the following fit (every stop), and whether the number is still found as the drag handle now that it sits before the name.

## 9. Round 13: the number left of the icon (owner; geometry superseded by §10)

- Stop rows: number x=16 (20px column, left-aligned), icon x=44, text x=84; starred name x=110. Places rows below the divider: icon 16, text 56 (owner-11 shows both beside a Places row, with measured edges).
- The number's hit area is 44×44, from the screen edge to the icon (-16px / +8px, ±14px); it is the hold-to-drag handle (400ms). It also stops the long-press callout (`-webkit-touch-callout: none`, no text selection).
- × keeps the Places delete ×'s slot on the right; + on Places rows is unchanged.
- **For UX:** the number's target now reaches the screen's left edge, where iOS's back-swipe and the visit swipe start. Check that a hold there is not taken as an edge swipe (iPhone check). Also check whether stop names at 84 against place names at 56 read as two lists or one.
- **For CD:** the 8px number-to-icon gap and the left-aligned number column. Also, the header title stays at 56 while stop names move to 84.

## 10. Round 14: one centred left axis (owner)

- x=30 is the centre of the chevron, of every stop number (1 or 2 digits, measured on the rendered glyphs) and of every Places icon. check.js asserts all three to within 0.5px on every Plans frame. Frame 41 is a 12-stop plan for the two-digit case; frame 40 is the Places reference.
- owner-11 draws the axis in red through Places rows, a Plans list (stops and the places below the divider) and the 12-stop list.
- The number's hit area is 44×44, from the screen edge to the glyph column's edge (−16px / 0, ±14px). The icon (from 56) is also a hold handle, as before.
- **For UX:** the stop text now starts at 96 against 56 for the places below. Does that 40px step still read as one list? It is a bigger step than r13's 28px.
- **For CD:** a stop's icon edge lines up with the header title (x=56). Is that the intended second alignment, or should the stop icon sit tighter to its number?

## 11. Round 15: aligned by the ink (owner: "may not follow mathematical number … check that")

Measured by `harness/ink.js` from the rendered pixels. An edge is the first column, scanning right, where the ink covers at least 50% (the perceived edge of an anti-aliased stroke), in css px.

| | 1x | 3x |
|---|---|---|
| Places names' ink, by first letter: stems (H, K, R, M…) | 57.09 | 57.13 |
| rounds (C, G, O, S) | 56.83 | 56.69 |
| points (A, T) | 56.31 | 56.36 |
| header title ink | 56.93 | 56.89 |
| **Before** (r14, box at 56): stop ring / dotted ring / diamond | 58.01 / 58.17 / 58.10 | 58.01 / 58.15 / 58.00 |
| **After** (r15): stop ring / dotted ring / diamond | 56.94 / 56.98 / 56.37 | 56.67 / 56.82 / 56.27 |

- **Before:** every stop icon sat 1.2–1.5px right of the names' letters. That is the "looks off": the boxes matched at 56, the ink didn't.
- **The rule (asserted in check.js at 1x and 3x, ≤0.5px):** a round icon's ink lands where round capitals land, and the diamond's tip lands where A and T land. Type sets letters the same way: rounds and points reach slightly past a straight stem's edge so that they look aligned with it. So against an H the ring overshoots by 0.4px, as an O would.
- **For CD:** the same optical rule probably applies wherever an icon is meant to align with text, for example the Places header title (ink 56.9) against nothing above it, the add form, and popups. Here it is applied only to stop rows, because Places is shipped.
- owner-11 draws the ink edges: red is the left column's centre line, blue dashed is the names' ink edge, with ×4 crops of the icon/text edge.

## 12. Round 17: stops cluster like any place (owner)

> "Why would I see so many stops by clusters wouldn't they cluster? Stop clusters should function the same as a normal cluster and if the stops are inside of a cluster the squared number thing is fine near the red cluster number"

- **Why the r16 image was confusing:** it showed the old rule, where stops never clustered. So stops sat *under* red discs that didn't contain them, and r16 then nudged those discs away, which nobody asked for. Both are gone.
- **The rule now:** stops cluster exactly like any pin (Places' clustering, unchanged). A cluster holding stops gets **one grey tag** listing their numbers ("3", "2–4", "1,5–6"). It sits at the disc's shoulder: upper-left, then upper-right (unless the cluster's star is there), then lower-right, lower-left, then the four sides. The tag touches the disc's edge and is never over a count. With more than 3 runs of numbers, the tag reads "first…last" (e.g. "2…9").
- **A district/street stop** clusters at its centroid like a pin; clustered, its own mark is hidden and the cluster counts and tags it.
- **A tap** on the grey tag does what a tap on the disc does: it zooms in.
- **List tap:** a stop row still flies to at least `SOLO_MIN_ZOOM` (14), where nothing clusters, so a list tap always lands on the stop's own pin. check.js asserts this on frame 24: zoom ≥ 14, the stop's own tag drawn, no cluster in view.
- **Default fits:** unchanged (building = stops + candidates, following = the selected city's stops). They needed no special case: a stop in a cluster is inside the fit like any member.
- **Candidates and stops** can share a cluster. Its count includes both; its tag lists only the stops.
- **Matrix (r17):** every stop in view is either its own pin or a member of a cluster (R2). Every stop number is on a visible tag, its own or its cluster's (R4). No tag ever covers a cluster's count. A cluster's tag sits ≤16px from its count. Every count is on top with ≥60% of its disc exposed (Places' own disc-on-disc overlaps excluded). The r16 nudge and the stops-above-clusters order are removed.
- **For UX:** the "first…last" collapse past 3 runs, and whether a stop number on a cluster tag needs a tap-to-reveal at z13.
- **For CD:** the tag at the disc's shoulder versus centred above it, and whether a cluster that holds stops needs any cue beyond its tag. I gave it none.
- (The r17 image is replaced by `r18-map-numbers.png`; see §13.)

## 13. Round 18: the number IS the map pin (owner, map only)

> "Instead of adding a number next to the icon let's just change the icon to the number like we used to do and only use the square thing next to clusters when there are a bunch…and it should be much closer if not touching the cluster number" — and: "only on the map. Don't change the list".

- **A single stop pin** shows its **number in place of the category glyph**. It keeps the same 24px ring in its category ink and the same paper field. The numeral is grey (`--ink-2`, 6.17:1): 13px/700, or 12px for two digits; condensed, tabular. There is no tag beside it. A district or street stop shows its number in its diamond.
  - When selected, the ring fills with its ink and the numeral turns paper, as a selected Places pin does.
  - The star keeps its place on the ring.
  - Lower numbers draw on top.
- **Category on the map** is told by the ring's colour and shape (circle, dashed for approx., diamond for districts and streets). The glyph is gone on stop pins only; candidates keep their glyphs, so in building mode the two read apart at a glance. The list keeps the icon (owner).
  - **For UX/CD:** with the glyph gone, a stop's category on the map is colour plus shape only, about the same as the colour-only map the owner earlier said wasn't enough. Mitigation: a tap shows it in the popup, and the list row has the icon. I recommend the owner's words win: there's no functional loss, because the number is how you follow a plan.
- **The square grey tag** appears **only beside a red cluster that holds stops** ("2–4", "1,5–6"; past 3 runs, "first…last"). It sits **flush against the count digits, 2px away**: on the right, or on the left when the cluster's star rides its upper-right. Then above or below, if the sides run off screen or onto another cluster's count. It covers part of the red disc but never a digit. A tap on it zooms in like the disc.
- **Zooming:** at `SOLO_MIN_ZOOM` (14) and above nothing clusters, so every stop is a numbered pin. Below it, a stop is a numbered pin or a member of a cluster with its tag. The list tap still lands at 14 or closer.
- **Overlapping single pins** (two stops a few px apart that didn't share a cluster cell) stack like Places pins: the lower number shows. The matrix counts these cases rather than failing them. **For UX:** is that acceptable at z13, or should touching stop pins share a cluster?
- **Matrix (r18):**
  - R1: a single stop pin has no glyph and a grey numeral ≥12px; a cluster tag is a grey-ruled paper square.
  - R2: every stop is a numbered pin or a cluster member.
  - R4: every stop number is visible (pin or cluster tag), excepting pins stacked under another stop pin. A cluster's tag is flush against its count (0–2.5px from the digits, level or centred), never over any count. Counts stay on top with ≥60% of the disc.
  - check.js asserts the same on frames, plus no tag over another cluster's count.
- Before/after over the build stills: `r18-map-numbers.png` (22, 31, 41, 27, 17), 1:1 at 3x.

## 14. Round 19: the cluster's stop tag is a ring, like a stop pin (owner asked "maybe … circle too?")

- **Pick:** a **grey ring on paper**, the same family as a numbered stop pin. It is a 16px circle for one number and a pill for "2–4" / "1,5–6", with a 1.5px `--ink-2` ring and a grey 10px/700 numeral. It sits flush against the count, 2px from the digits, as in r18, and never over a digit or another count.
- **Rejected: solid grey circle.** A dark disc with digits beside a red disc with digits reads as two clusters.
- **Rejected: square.** It's the one square on a map of circles. It no longer has to differ from the clusters, because the ring-vs-solid difference already sets it apart.
- Side by side at 3x and 1x on 22, 31 and 41: `r19-tag-shape.png`.
- **Matrix R1:** a cluster's tag has an `--ink-2` ring, is fully rounded (radius ≥ half its height) and is never a solid fill.
- One matrix cell (Nørrebro, panel open, z11: a tight knot of overlapping clusters) has no flush spot that avoids another cluster's count. That tag is reported in the matrix as a forced knot (1 of 56 cells), not a pass. It is not a default framing.
- **For CD:** a 1.5px ring at 16px against the stop pins' 2px at 24px.

## 15. Round 20: tags never overlap, digits always on top (build sweep finding)

- **Never tag-on-tag.** A merged tag is placed again at its new width. If a cluster's best flush spot still lands on another cluster's tag, its stop numbers merge into that tag ("1,5" + "2,4" → "1–2,4–5"). The same happens if its tag ends up under another tag-bearing cluster's disc: the numbers merge into the tag of the disc on top. Every number stays readable, and a tap on either cluster zooms in.
- **A tag-bearing cluster draws above plain clusters** (`Z_PLAN_CLUSTER + 1000`), so a neighbouring disc never hides its tag.
- **The cluster's star never sits on a stop number:** the tag stacks above the star (`z-index: 3`). The star stays where it is and may tuck under the tag's edge. A star isn't a digit, but it must not hide one.
- **sweep.js now covers z11–z15** (980 views: Nørrebro and the Harbour loop × panel/collapsed × 7×7 pans). After every pan it checks:
  - no two cluster tags overlap;
  - each tag's numerals are on top at 3 points;
  - every stop in view is findable, as its numbered pin or in a tag's list.
  - Disclosed rather than failed: single stop pins stacked under another stop pin, and forced knots.
