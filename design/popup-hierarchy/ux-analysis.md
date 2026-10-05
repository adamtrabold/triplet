# Map popup: hierarchy and purpose (UX analysis, phase 1)

UX agent, 2026-10-05, on `main` @ `a3c7579` (`index.html` unmodified). Role:
interactions and the owner's real jobs. No visual styling is proposed here;
section 7 lists the interaction constraints any design must satisfy.

Owner, this task: "i want to fix the design of the popup -- it has awkward
heirarchy and spacing and doesnt follow our standards in that way. i also need
more ideas for displaying so *much* ndensity. first i want the ux agent to give
me a heirarchical analysis as well as a clear purpose for each piece of the
content inside of the popup ... things dont *have* to all be contained in the
popup, they could be outside, or attached to the side via a tab, etc."

Earlier owner words in play: "so much information all visual hierarchy is
starting to struggle"; "type should go back above the name"; "icon is treated
differently for category in the pop up than on the map — why?"; "No star unless
it's been starred. What I need to fix is the alignment of the star in the pop
up - it looks weird when all the content is in it."; "Spacing between things is
insane and icons don't fill the same visual space"; "A measured spacing system
should already exist - if not create it".

## 0. Thirty-second version

**Intended hierarchy** (my call, from the jobs below):

| Tier | Read when | Content |
|---|---|---|
| 1 | first glance | **Name**, **type** (category glyph + word; approx/district/street kind), **your marks** (starred, visited) as state |
| 2 | deciding / acting now | **Notes** (why you saved it), **Get Directions**, **Mark Visited**, **Stop n of m** (Plans only) |
| 3 | sometimes | **Star toggle** (planning; rows can also swipe), **close**, neighbourhood part of the address |
| 4 | on demand | **Full address** (postcode, municipality, county, country), approx-placement provenance |

**Biggest mismatches** (evidence in section 5):

1. **The address is the heaviest thing in the popup and the least needed.**
   Real addresses are full OSM strings (avg 103 characters; 135 of 202 are
   over 90), so it is 3 lines. Ink mass in the busiest popup: address 1,248 vs
   name 514 (2.4x).
2. **Your notes are the only place your reasons appear anywhere in the app,
   and they're styled as the quietest text** (12px italic grey, under the
   address, up to 8 lines, line breaks lost).
3. **Type sits at the bottom, ~235px below the name** in a full popup, against
   "type should go back above the name"; and the popup glyph is still bare
   while the map pin and list row wear it in a ring.
4. **Spacing is set by invisible 44px tap boxes, not the 4px scale.** Visible
   gaps are 3 / 10 / 25 / 37 / 42px. A name-only popup is 162px tall; about
   70% of it is empty.
5. **Five controls in four corners.** Star top-left, close top-right,
   Directions mid-left, Visited bottom-right. Directions is the only coloured
   element so it reads as *the* action; Visited (the on-trip status) is 10px
   grey caps.

## 1. Jobs (before reading any spec)

No job list was supplied; all are inferred from the owner's words and the
code, marked (I) where inferred.

- **J1 Identify** a pin I tapped on the map: what is it, what kind of place.
  Owner: "type should go back above the name". (I, plus quote)
- **J2 Decide** whether to go now: recall why I saved it (notes), whether I
  starred it, whether I've been. (I)
- **J3 Go there**: hand off to Apple Maps. (I; shipped "Get Directions")
- **J4 Record a visit** on the trip, from the map, one hand. (I; popup is the
  only non-gesture visit path since the row went delete-only)
- **J5 Star / unstar** from the map. (I; popup is the accessible,
  non-gesture path)
- **J6 Follow a plan**: know which stop this is. (I; "Stop n of m")
- **J7 Get back to the map** with context: close, see neighbours. (I)
- **J8 Check the address** (taxi, verify geocode; notes show geocodes were
  wrong before: "a prior geocode wrongly matched this to Central Station").
  (I, rare)
- **J9 Viewer (public, signed out) browses** the trip read-only. (I)
- **J10 Open from the list** and land on the place's popup. (CLAUDE.md rule)

## 2. Task walkthrough (busiest real view: 390x844, Plans view, popup over map, sheet at default height)

Renders: `current/phone-busiest@1x.png`, `current/popup-*@{1,3}x.png`.
Probes: `statecheck.js`. All "PASS" = the step can be completed today; the
friction column is where hierarchy hurts it.

| Job | Steps / controls | Result | Evidence / friction |
|---|---|---|---|
| J1 Identify | tap pin → read name → read type | PASS (friction) | Type is the last line; busiest: name at 15px from the top, type at ~250px (~235px apart). Pin glyph under the tip is the faster cue. |
| J2 Decide | read notes, see star / visited | PASS (friction) | Notes start after 3 address lines; italic grey 12px; VEGA's 5-line note is a list of acts with lost structure; Værnedamsvej's two paragraphs merge into one ("homewares) Approximate placement"). Starred shows as the filled star; visited only as the bottom-right "VISITED ●". |
| J3 Go | tap Get Directions → Apple Maps | PASS (note) | One tap, 44px target. `directionsUrl()` hard-codes `dirflg=d` (driving) for city walking trips: a job question, not a popup layout one; route to backlog. |
| J4 Visit | tap Mark Visited | PASS | 44px target bottom-right; tick + row replay. Smallest, greyest words in the popup. |
| J5 Star | tap star | PASS | 44x44 target; its first 13px overlap the title (accepted earlier). |
| J6 Plan stop | read "· STOP 2 OF 3" | PASS (friction) | Appended to the type at the bottom, 10px grey caps; the pin's number shows it louder. No add/remove-from-plan in the popup (backlog, deferred). |
| J7 Back to map | × or tap map | PASS (friction) | × is Leaflet's 24x24 box, under the 44px rule every other popup control meets (map tap works as backup). Busiest popup covers 327x282 = 84% of width, 52% of the 544px map strip. |
| J8 Address | read address | PASS | Always fully shown, whether wanted or not. |
| J9 Viewer | read popup | PASS (question) | Signed out, the star and Mark Visited still render as controls; a tap opens sign-in (`requireAuth()`). Owner hasn't said whether viewers should see editor controls. |
| J10 From list | tap row → fly → popup | PASS | popup-open suite exists (20/20 on record); not re-run (no code change). |

**No BLOCKERs today.** Every job completes; the failures are hierarchy and
weight, which is what the owner reported.

## 3. Inventory: every element the popup can render

Builder: `buildPopupHtml(loc)` (`index.html` ~4751). Shapes go through it via
`shapePopupHtml()` → `shapeRowItem()` (address always null; Directions to
`shapeAnchor()`; glyph colour = the shape's colour). Plus Leaflet's close ×
and tip. A separate one-line "You are here" popup exists for the locate
marker (title only).

| # | Element | Shown when | Size / style today | Notes |
|---|---|---|---|---|
| E1 | Star toggle | always (hollow = off, filled = on) | 18px, 44x44 target, leading column | Also shows to signed-out viewers |
| E2 | Name | always | 15px/600, `--ink`; wraps (2 lines at 49 chars) | Approx pins carry " (approx.)" in the name |
| E3 | Address | pins with an address (201/202); never shapes | 12/16 `--ink-2`, 1–4 lines | Full OSM display string |
| E4 | Notes | 152/202 pins; 0/11 shapes | 12/16 italic `--ink-2`, margin-top 8 | Up to 357 chars = 8 lines; `\n` collapsed; approx pins get system provenance text appended |
| E5 | Get Directions | always | 10px condensed caps, `--figure-deep`, compass 14px, 44px target | Only saturated colour in the popup |
| E6 | Type (glyph + word) | always | 20px bare glyph in category ink + 10px caps `--ink-2`; bottom-left | Approx pin: dashed square + DISTRICT/STREET; shape: its own colour |
| E7 | "· Stop n of m" | Plans view, place is a stop of the active plan | same 10px caps, appended to E6 | Information, not a control |
| E8 | Mark Visited / Visited | always | 10px caps + 14px ring (off) / navy filled dot + navy word (on); bottom-right, 44px target | Visual language differs from the list stamp and map sticker |
| E9 | Close × | always | Leaflet default, 24x24 | Below the 44px target |
| E10 | Tip | always | points at the pin | The pin itself (category ring / sticker / stop number) stays visible under it |

Not in the popup (and where it lives): delete (list row only), add/remove plan
(Plans rows only), city (implicit in the active city), `hours` (DB column,
0 rows filled, never shown), edit (no edit path anywhere in the app).

**Real data ranges** (Supabase, read-only, 2026-10-05): 202 pins, 11 shapes.
Name avg 17 / max 49 chars. Address avg 103 / max 173 (only the LA rows are
short street addresses). Notes on 75% of pins, avg 59 / p90 109 / max 357.
30 visited, 10 starred, 1 approximate pin. No shape has a note.
Busiest real pins rendered: VEGA Copenhagen (long address + 5-line note,
starred + visited + plan stop), Aurora Reykjavík (typical), Swedish Museum of
Performing Arts Scenkonstmuseet (2-line name), Værnedamsvej (approx., 8-line
note), Grandi district (shape), Perlan (bare), a short LA address.

## 4. Purpose of each element

Frequency is inferred (I) for a two-person on-foot trip; "if it moves" = what
is lost if it leaves the popup's first view (tab, sheet, second layer).

| Element | Purpose (job) | When needed | Frequency (I) | Must be in the popup's first view? | If it moves, you lose |
|---|---|---|---|---|---|
| Name | J1, confirms the right pin | glance | every open | **Yes** | identity; every other line depends on it |
| Type | J1, kind of place; kind of geometry (approx/district/street) | glance | every open | **Yes**, owner wants it above the name | partly duplicated by the pin glyph under the tip, so the popup copy can be light, not absent |
| Starred (state) | J2, "I care about this" | glance | every open | state yes; the hollow "off" mark is a control, not information | — |
| Visited (state) | J2, "been there" | glance on trip | every open on trip | state yes | the pin sticker also shows it |
| Notes | J2, why I saved it, tips, times | deciding | most opens (75% have one) | at least its start; full text can be one step away | the only place notes exist in the app; hiding all of it removes the reason to open the popup |
| Get Directions | J3 | acting, on trip | high on trip, ~0 at home | **Yes**, one tap | the only route-out; a second tap on the street costs real time |
| Mark Visited | J4 | right after a visit | once per place | **Yes**, one tap (the map's only visit path; the a11y path) | swipe exists only in the list |
| Star toggle | J5 | planning | low on trip | reachable in one tap from the popup (it's the map's and VoiceOver's only star path) | row swipe exists; the control can be quieter than the state |
| Stop n of m | J6 | following a plan | Plans only | no; the pin number and list row also carry it | low |
| Address (neighbourhood part) | J8, "which part of town" | sometimes | low | optional | locality context |
| Address (full string) | J8, taxi / verify geocode | rare | rare | **No** | must stay reachable on demand: it's the only way to audit a bad geocode in-app |
| Approx provenance | trust in the pin's position | rare | 1 pin | no | the "(approx.)" in the name already says it |
| Close | J7 | leaving | every open | yes (or an equivalent dismiss) | map tap also closes |

## 5. Hierarchy audit: current weight vs intended

Measured on the 3x renders (`inkmass.js`; mass = summed darkness in 1x px).

| Popup | star | name | address | notes | Directions | type | Visited |
|---|---|---|---|---|---|---|---|
| busiest (VEGA) | 112 | **514** | **1,248** | **1,700** | 180 (only colour) | 182 | 218 |
| typical (Aurora) | 53 | 433 | 1,025 | 1,237 | 179 | 141 | 159 |
| long name | 112 | 1,366 | 1,235 | 341 | 180 | 141 | 159 |
| approx | 53 | 605 | — | 3,112 | 180 | 112 | 159 |
| bare (Perlan) | 53 | 167 | — | — | 180 | 141 | 159 |

Current rank by what the eye hits first at 1x (busiest): (1) the grey address
+ notes slab, by mass; (2) Get Directions, the only saturated element; (3) the
filled black star, a solid shape at the leading edge; (4) the name, darkest
but one short line; (5) the navy Visited dot; (6) the type glyph; (7) the 10px
caps words; (8) ×.

Intended: name + type → your marks → notes → actions → address.

Mismatches:

- **M1 Address outweighs the name** 2.4x (busiest), 2.4x (typical). Tier 4
  content holding tier-1 weight and position (directly under the name).
- **M2 Notes are the biggest block yet the weakest style.** Italic grey reads
  as "fine print", but it's the owner's own research and appears nowhere else.
  Paragraph breaks are dropped (the approx note's provenance runs on from the
  shop list).
- **M3 Type is last.** Owner: "type should go back above the name". Name→type
  distance: 1 line in the list row, ~235px in the busiest popup. The popup
  glyph is a bare 20px glyph; the pin and row show it in a ring (owner: "icon
  is treated differently ... why?" — still true).
- **M4 Action weight is inverted for the trip.** Directions is the only
  coloured element; Mark Visited and the star are grey/outline 10px. The
  trip's two key actions (go, mark) read at very different volumes. The
  "VISITED ●" state uses a navy dot, a third visited language next to the
  list stamp and the map sticker.
- **M5 Size and occlusion.** Text width 300 max → 327x282 popup on a 390x544
  map strip. Neighbouring pins under it are hidden, which hurts J2 (deciding
  needs the neighbourhood).
- **M6 Star centring.** The star is centred on name + address; with a
  3-line address and wrapped name it floats mid-block, unrelated to any line
  (`popup-longname@3x.png`) — the owner's "looks weird when all the content
  is in it".

## 6. Spacing audit

A system exists: `--s1..--s12` = 4/8/12/16/24/32/48px (`:root`, ~line 238),
plus the 28px glyph spine (`--col-glyph`) that rows, header and forms use
(content at 56px). The popup breaks it in three ways:

1. **Visible gaps are off-scale and inconsistent** (rendered line boxes,
   1x): name→address 3, address→notes 10, notes→Directions 25,
   address→Directions 29, name→Directions 42 (bare), Directions→type 37,
   type→bottom edge 18, top edge→name 15. The cause is that the CSS spaces
   *44px tap boxes and 8px dead bands*, not the visible words: Directions and
   Visited each carry 16px of invisible padding above and below.
2. **Within-block gaps are tight, between-block gaps are huge** (3–10 vs
   25–42), so the popup reads as three islands; in the bare popup 70% of
   162px is air (the CD-deferred 41px gap).
3. **Two left channels, neither on the app spine.** Star column 18px at x=13,
   type glyph column 20px at x=13, compass at x=16; name text starts at ~38,
   the caps words at ~36. The app's rows use a 28px glyph column with text at
   56. Owner: "solid left visual channel"; "one centred axis for left-column
   items".

Also: the popup's right edge has two different right lines (× and Visited do
not share one; already in the backlog).

## 7. Interaction constraints any design must respect

Must preserve (shipped, owner-confirmed or rule):

1. **One tap** from the opened place to Get Directions and to Mark Visited;
   both ≥44px targets with ≥8px dead band between adjacent targets.
2. Star toggle reachable from the place's popup (or whatever replaces it) in
   one tap: it is the map's and VoiceOver's only star path. The `hapticTap()`
   real-tap label pattern must cover every star/visit target (iOS 26.5 haptic
   limit).
3. Toggles never close the popup or move the map; the place stays open and
   the list row replays.
4. **Opening must keep the tapped pin visible** (the tip/pin relationship or
   an equivalent link to it) and clear the top controls (autopan pads).
5. List tap → map arrives → place opens (`openPopupOnArrival()`); every list
   item type behaves the same; districts/streets/approx pins get the same
   content and capabilities ("Every category should have the same
   information and capabilities").
6. Dismiss: an explicit close ≥44px plus map-tap-to-close.
7. No full-screen takeover of the map for the glance tier: the glance must
   leave the neighbouring map visible.
8. Notes must stay fully readable somewhere reachable in ≤1 tap; the full
   address must stay reachable (geocode audit).
9. Content that leaves the popup (tab, side sheet, bottom sheet) must not
   collide with the list sheet, its gestures, or Safari's edge back-swipe
   (24px edges), and must not change the list's filters/scroll/selection.
10. No new controls appear for empty data ("no star unless starred" applies to
    marks; the off-state star is a control and the designer/CD decide how it
    reads).

Open, belongs to the loop (not decided here): what the glance layer is vs the
detail layer; whether type sits above the name (owner asked: treat as a
requirement unless the owner withdraws it); whether address shortens to a
locality; whether Stop n of m stays in the popup.

## 8. Control parity and state

| Control | List row | Map popup | Status |
|---|---|---|---|
| Star | swipe right | tap | live both |
| Visit | swipe left | tap | live both |
| Delete | quick tap on × | — | row-only (no owner ruling; fine, delete safety) |
| Add / remove plan stop | +/× in Plans | — | **gap**: in Plans you can't add a pin you found on the map (backlog, deferred) |
| Directions | — | tap | popup-only |
| Notes / address | — | shown | popup-only |

State findings (probed, `statecheck.js`):

- **S1 A map-tapped pin opens its popup with no selection**: `highlightedId`
  null, no row highlighted. A list tap selects both. Same place, two states.
- **S2 Closing the popup keeps the selection** (list-opened): × leaves the
  pin and row highlighted. Selection outlives the popup.
- **S3 Signed-out viewers** see star and Mark Visited as live controls that
  open sign-in.
- **S4** Toggling re-renders the popup in place (focus kept); the 10s poll
  re-renders it too (signature-gated). Fine.

## 9. Convention audit

- Close top-right: platform norm, but 24px target.
- Leading star in the name's slot: matches the list row's mark slot; on iOS a
  leading mark is usually status, trailing is action. It is both here.
- Actions split left (Directions) and right (Visited) on different rows: no
  stated reason beyond fitting widths (p8). Primary action placement is a
  designer/UX call for the loop.

## 10. Nits

- "(approx.)" is in the name *and* a provenance sentence in the notes.
- Notes lose line breaks (`white-space` normal).
- `hours` column is unused (0 rows): don't design for it yet.
- Directions is driving mode (`dirflg=d`).

## Not verified

- Chromium only (headless, emulated touch, 390x844, blank tiles, vendored
  Archivo). Safari/iPhone rendering, real tiles under the popup, and VoiceOver
  order not checked.
- Real text was patched into fixture rows; positions are fixture positions.
- Gesture gate not run (no code changed).

## Files

- `render.js` (renders + `current/metrics.json`), `inkmass.js`
  (`current/inkmass.json`), `statecheck.js` (state probes).
- `current/popup-<state>@{1,3}x.png` and `current/phone-<state>@{1,3}x.png`
  for states: busiest, typical, longname, shortaddr, bare, approx, shape.
