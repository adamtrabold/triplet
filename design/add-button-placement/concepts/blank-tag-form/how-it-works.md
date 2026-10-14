# The blank-tag form: how it works (shared by P, A and the Float frame)

> **Round 9b, checked by systems (2026-10-14).** Visual's `raw/measure.json` of 13:20.
> - **The credit is fixed:** visible in every card state (587-604 at 664, 491-508 at 320). Flag 1 below is closed.
> - **Rows that hold a control are 40 tall** (address · city, TYPE); NOTES stays 32. The card at 664 is now **317-581 (264)**, ADD unchanged at 521-581, and the hanging point moves to (195, 273). At 320 it's 221-485; new city 285-581; failed 275-581; Float 248-512.
> - **Hit areas with 40 rows:**
>   - The × (309-353 × 357-401) against the city chip (234-337 × 408-433): a 44px chip hit overlaps the × by **2.5px** (was 10.5).
>   - The city chip's 44 runs **5.5px** into NOTES' row (437-469).
>   - TYPE (478-503) clears NOTES (0.5px) and the stub.
>   - At 320 the × and the city chip overlap by 2.5px.
>   - **Builder rule, which closes both: each control's hit area is its own row band.** The chips get the full 40 (close to 44); the × hit stops at the NAME row's foot. With that there's no overlap anywhere.
> - **Results while typing and ADD:** the docked tag (74-390 at 664) and its stub (330-390, behind the keyboard) are unchanged.

> **Round 9 (director turn 38), checked by systems on the real render (2026-10-14). This overrides everything below where they differ.** Numbers come from visual's `raw/measure.json` (stub data) plus `../r9-check/` (real pins).
>
> **The model:** the filled tag is a **card in the screen's frame**: docked on the keyboard while you type, then on the list's band. **The map doesn't move until ADD.** There's no pin or string while you fill it in, and the eyelet is empty. On **ADD** there's one flight: the map brings the place to the card's hanging point (x 195, y = card top − 44), the pin drops into the eyelet, and the ink-over runs. After that, round 8b's no-move shrink applies: the top comes down, the stub stays. Section 2's "Hanging" placement and the map pans in "Numbers" (the picked tag) are void.
>
> **Card numbers, checked:**
> - **664:** the card is 333-581 (248), its foot 6 above the credit's top (587), the list's band at 604, **ADD 37-142 × 521-581 (105 × 60)**, the hanging point (195, 289).
> - **320:** the card is 237-485, ADD 16-112 × 425-485, the hanging point (160, 193).
> - **New city (664):** the card is 301-581 and grows at the top; the stub becomes two segments, **ADD [CITY] 37-195 and PICK FROM MY LIST 195-353, both × 521-581**. "ANSWER ABOVE" is gone.
> - **Float frame:** the card is 264-512, ADD 452-512.
>
> **Two flags:**
> 1. **The credit is hidden while the card is up.** In `raw/measure.json` the credit reads `hidden` in every card state (`body:has(#btDock) .leaflet-control-attribution { visibility: hidden }`). The director ruled the credit is hidden only while the keyboard is up; the picked, question and failed states must show it (it's a required credit). Scope the rule to `#btDock.kbd` (or whatever marks "keyboard up"). Visual's stills crop it out, but the builder would ship the bug.
> 2. **The 25px chips' 44px hit areas collide on the 32px rhythm (T9).** At 664:
>    - the city chip is 234-337 × 416-441, so its 44 hit spans 406.5-450.5;
>    - the tag's **× is 309-353 × 373-417**, so the two **overlap by about 10 × 28 at the top-right**;
>    - the city hit runs 5.5px into NOTES' row (445-477);
>    - the TYPE chip (89-218 × 478-503) has a 44 hit of 468.5-512.5, **8.5px into NOTES' row**.
>    - At 320 the × (277-321) and the city chip (320-345) touch edge to edge.
>    - **A mis-tap on × cancels the add.** The draft is kept, but it's the worst miss on the tag.
>    - **Rule I'd give the builder:** each tappable gets its own row band as its hit area (the chip's row: full 32 high, the chip's width plus 8 each side), never 44 across rows. And the × hit stops at the NAME row's foot.
>    - That makes the chips 32-high targets, under Apple's 44pt minimum. The fix that keeps 44 is rows that hold a tappable at 40 (address·city, TYPE): +16 on the card (264). That's the director's and visual's call; I lean 40, because a mis-tap on a pencil-entry chip just opens a picker, but a miss on × cancels the add.
>
> **Re-checked:**
> - **Results while typing:** unchanged from 8b (docked numbers; 89 or 72 by room).
> - **ADD and the stub don't move:** in the card, ADD is at the foot (fixed); a question grows the card from the top. Holds.
> - **The flight:** a single move. New city: a country-scale flight on ADD (Reykjavík → Lisbon), and the list switches. District: the move frames the outline (it may zoom out) and the centre dot lands at the hanging point.

> **Round 8b, checked and folded in by systems (2026-10-14).** This replaces the round-8 note. Visual's numbers are in `looks-and-feels.md` "Round 8b" and `blank.inc.html`.
>
> **Followed (numbers checked):**
> - **The picked tag is 248** (48 top + 4 x 32 rows + 12 foot + the 60 stub), the real tag plus the NOTES row only.
> - **ADD → DIRECTIONS at y 528-588 at 664, and it never moves.** On ADD the tag tightens to the real tag by its *top* coming down while the map pans down by the same amount. The stub's foot is the pin's y + `TAG_HANG` + the height, so the stub stays put when the pin moves +Δ and the height shrinks by Δ.
>   - At 664 the picked tag runs 340-588, with the pin at 280-312.
>   - The foot is 16 above the list's band (604).
>   - The director's fallback (no shrink, no empty paper) is only needed if Leaflet's `panBy` can't track the 300ms CSS shrink. That goes on the iPhone checks: the stub must not jitter.
> - **The list stays at its band until the new tag closes.** This is the cost of a stub that doesn't move. If the list rose to fit the tag, the tag would have to move up. Two owner rules meet here: "controls don't move" against "an open tag adjusts the list, it doesn't close it". I think it's acceptable because the add put the list down and nothing *closes* it. It still goes on the director's objection list.
> - Results start at 89 on tall screens and at 72 on short ones, where NAME's caption also hides. The lines under the results hide.
>
> **One change, said plainly:**
> - **The 89/72 switch should go by room, not `innerHeight < 600`.** The rule: start at 89 when the space below it, down to the keyboard, holds 3 rows (152px); otherwise start at 72. It gives the same answer on every screen measured: 664 → 89, 3.3 rows; 667 → 89, 3.3; 844 Home Screen → 89, 3.5; 568 → 72, 3.2. It also catches screens just over 600 that fail by height: a 375x629 mini Safari tab with a 336 keyboard leaves only 2.5 rows at 89. That one is under 3 even at 72 (2.9), so it's an iPhone check, and the keyboard height there is unverified.
>
> **Found (for visual / the builder):**
> - `.bt-f` is a **fixed** 32px row, so a long name (the real tag wraps names) or a long note (owner: "long notes should just show full length") overflows its row. Rows should be `min-height: 32px` and grow. The 32 rhythm applies to single lines, and the shrink-by-the-top on ADD still keeps the stub put.

Systems, concept turn 1 (2026-10-14). The rulings are from jam turns 30-35;
the jobs are numbered as in `../../jobs.md`. The look belongs to visual
(turns 31 and 34). Numbers come from `../pass-a-check/` unless marked
*estimate*.

The form is **one component with an entry point**. A trigger (P's pin,
A's header cut, the Float badge) only decides where the tag comes from
and where it goes back to on cancel. Everything below is the same for
all three.

## Structure

The blank tag is a `TagPopup`, the real tag's Leaflet popup, in a new
`blank` mode. It is not a sheet and not an absolute div, so the string,
the pan and the zoom behave like the real tag. It has two placements:
- **Docked.** While the keyboard is up, the tag is fixed to the visual
  viewport.
  - The pin is at the top on the tag's axis, and the tag hangs below it.
  - The tag runs on behind the keyboard, so the stub is below the fold.
- **Hanging.** After a pick, the tag is a normal popup on the picked
  point, and the pin stands on that point.

The parts, in the real tag's order:

| # | Part | Live when | Feeds |
|---|---|---|---|
| 1 | Pin + straight string | always (rule 1) | — |
| 2 | Eyelet + patch | always | — |
| 3 | **NAME**: the search input, 16px (iOS zoom rule) | always | `#nameInput` → `selectAddress()` |
| 4 | Results: an opaque panel inside the tag, from under the NAME rule to the stub, over lines 5-7 | while typing (≥ 2 chars, the current debounce) | the app's autocomplete, `limit: 10`, scrolls |
| 5 | **address · city**, pencil | printed and empty from the first frame; filled after a pick; hidden for a district or street | `addressInput`, `cityInput` (city auto from `maybeDetectCity`) |
| 6 | **NOTES** | printed and empty from the first frame; writable after a pick | `notesInput`, 16px |
| 7 | **TYPE**, pencil | printed and empty from the first frame; filled after a pick | `categoryInput` |
| 8 | Questions slot: new city / which city / error line | when raised | `newCityConfirm`, `shapeCityConfirm`, the errors |
| 9 | **Stub: ADD \| STAR \| VISITED** | after a pick (behind the keyboard while typing) | `submitBtn`, `starInput`, the new `visitedInput` |
| — | × close (the real tag's `.tag-x`) | always | cancel |

- The fields stay the real form's elements, moved and restyled. **The
  add machinery isn't rewritten:** `requireAuth()`, `selectAddress()`,
  the submit handler for pins and shapes, `resolveShapeCity()`,
  `findApproximatePoint()` and `closeAddForm()` are all reused.
- Selects (TYPE, the city correction) are a transparent native
  `<select>` at 16px over the printed or pencilled entry, so they get the
  iOS picker with no zoom (C's ruling).

## States

| State | What shows | ADD | Notes |
|---|---|---|---|
| **Blank, docked** | the **whole blank tag** (fixed: `.tag-in` ≥ 256, 316 with the stub): pin, eyelet, NAME, ADDRESS · CITY, NOTES and TYPE, all printed and empty; keyboard up | behind the keyboard at 664 and below (stub y 330-390 at 664); visible, printed NAME IT FIRST, at 844 Home Screen (377-437) | entered from a trigger tap |
| **Typing** | results under NAME: 48px rows (name 14/600 plus a one-line address in 11px, both truncated), plus a half row when more follow | behind the keyboard | "Searching…" printed in the results area until the first answer |
| **No results / timeout** | a printed line in the results area ("No places called that — try another name." / "Search timed out — try again.") | — | keyboard stays up, entry kept |
| **Picked, hanging** | the pin on the spot; name in pencil; address · city, TYPE (pre-filled), NOTES line; stub | **navy flood** | the list drops to its band; ADD low on the screen |
| **Picked, not ready** | the same, while a question is open (new city) | printed **NAME IT FIRST** → here the question's wording instead ("ANSWER ABOVE") | see "Open" |
| **Starred** | the orange band prints across the top, exactly as on a starred real tag | — | the band pushes the name down 12 (36 → 48), the real tag's rule |
| **Visited set** | the VISITED segment shows its stamp, as on the real stub | — | the insert carries `visited: true` |
| **District / Street** | the address · city line hides, a one-line printed hint shows, and the pin stays **lifted** over the point | ADD (the same word) | — |
| **Saving** | ADD prints "ADDING…" and taps are ignored | — | shapes: the OSM fetch runs here |
| **Which city?** (shape under 60%) | the question prints in the questions slot: **NEW CITY** \| **[runner-up]**, then "another city…" (a native select over the line) and Cancel | hidden while asked | the answer resumes the save |
| **New city?** (a point outside every city, on the pick) | **"New city? Lisbon"**: **ADD CITY** \| **PICK FROM MY LIST** | not ready until answered | either answer fills the city in pencil |
| **Save failed** | the tag as it was, plus a printed line above the stub ("Couldn't save — try again") | ready | nothing is cleared |
| **No outline and no spot** (shapes, double miss) | a printed line ("Couldn't find [name] on OpenStreetMap") | ready (you can change the type to a pin category and add) | replaces today's `alert()` |
| **Inking** | the name graphite → navy; TYPE stamped; ADD reprints as DIRECTIONS; the rules and captions fade; the pin takes its category. VISITED isn't re-stamped (it landed when you set it; turn 36). **The tag keeps its height until it closes** | — | then it's the real tag of the real place |
| **Stale sign-in at ADD** | the sign-in sheet over everything; the tag waits | — | today's `requireAuth()` |

## Pre-fill (closest-friend rule: tap, type, pick, ADD)

- **City:** auto, as today (`maybeDetectCity`), in pencil, tap to
  correct. Not shown for shapes (`resolveShapeCity()` decides, as today).
- **TYPE:**
  - It comes from OSM's own kind for the place where that maps to a
    category; otherwise it's the type you used last (per device). It's
    always pencil.
  - The search needs the OSM class and type, which jsonv2 returns. The
    mapping is a small builder table.
  - It's untestable in the sandbox (Nominatim is blocked), so it goes on
    the iPhone checks.
  - If nothing maps and there's no last-used type, it's **Other**.
  - **Mapping rows ruled so far** (director, 2026-10-14): OSM `leisure=swimming_pool`, `leisure=sports_centre` (and `leisure=water_park`) → **Attraction**. The rest of the table is the builder's, and every row is an iPhone check (Nominatim).
- **Address:** from the pick, as today.

## Numbers (phone, keyboard up, docked)

The keyboard is the drawn 336pt (390 wide) or 260 (320 wide). The account
badge's foot binds the tag's top, because the tag's width spans the
badge's x.

| Viewport | Pin | Tag top | NAME | Results area | 48px rows |
|---|---|---|---|---|---|
| 390x844, Home Screen (inset 47) | 61-93 | 121 | 157-185 | 193-377 (to the stub, which shows) | 3.8 |
| **390x664 (Safari)** | **14-46** | **74** | **110-138** | **146-320** | **3.6** |
| 375x667 | 14-46 | 74 | 110-138 | 146-323 | 3.7 |
| 320x568 | 14-46 | 74 | 110-138 | 146-300 | 3.2 |

The results start 72 below the tag's top. With visual's 89 it would be 3.3 at 664 and **2.85 at 320** (see the top note). The stub stays at the tag's fixed foot (top + 256) in every row of this table.

- The pin is 32 (the real hanging-pin size) in every docked state, on
  the tag's axis: x 179-211 at 390, clear of zoom (x 10-44) and the
  account badge.
- The floor of 3 holds everywhere with 48px rows. **46px rows aren't
  needed** at 320 under these assumptions (the director asked).
- **After a pick** (visual's round 8 numbers, checked against the band):
  - the hanging tag is 248 tall (round 8b; more with a question, a long name or long notes, the row growing; +12 when starred);
  - the map pans so the tag's foot clears the list's band by 16;
  - **at 664 (round 8b): the tag is 248, at 340-588; ADD at y 528-588; the pin at 280-312**;
  - **at 320x568** (round 8 numbers at 316, so 8b is roomier): the tag's top is about 176 and the pin about 116-148. The worst case (question + starred, about 370) puts the tag's top at about 122 and the pin at about 62-94. The pin's x is 144-176 and the account badge's is 254-304, so it's clear. **It fits with no inner scroll;** the tag scrolls inside only below about 540 tall (landscape).
  - **Float frame:** the pan target for the tag's foot is 512 at 664, to clear the open badge (× at 524-584). That puts ADD at about 452-512, still in the thumb zone.

## Cancel and draft

- **× on the tag** (and the trigger's own cancel, if it has one; Esc on
  desktop) goes back to the state before the tap:
  - the list's position and scroll;
  - the map view;
  - a tag that was open reopens on the same place.
- **The draft is kept in memory:** the NAME text, the pick, TYPE, city,
  NOTES, STAR and VISITED.
  - The next trigger tap re-opens the tag filled in. With a pick, it
    hangs on the kept place with the keyboard down; without one, it's
    docked with the text.
  - No marker stays on the map in between.
  - `closeAddForm()` (the clear) runs only after a successful ADD.
- **Re-search:** tap NAME on a hanging tag. It re-docks with the keyboard
  up, and a new pick re-hangs it.

## After ADD

1. The ink-over. The tag tightens to the real tag by its top while the map pans the same amount, so the stub (now DIRECTIONS) doesn't move.
2. If the place's city isn't the active one, the list switches to it (still at its band).
3. The place's tag stays open (it is now that tag). The list **stays at its band until the tag closes** (round 8b).
4. When it closes, the list comes back up with the new row scrolled fully into view. It isn't selected, because selection follows the open tag and close clears it (the shipped rule).
5. The draft is cleared.
6. The trigger comes back to rest:
   - P: the fresh lifted pin appears when this tag closes;
   - A: + on the header;
   - Float: the badge's +.

## Builder notes

- `pinPopupTopPad()` / `planChrome()` list `#floatingAddBtn`. Update them
  to whatever the trigger is (P: none at the top; A: none at the top).
- The docked tag follows `visualViewport` (resize and scroll), the same
  technique as B and C. The lag and focus-scroll go on the iPhone checks.
- Focus on the trigger tap must happen inside the tap. Whether
  `requireAuth()`'s microtask keeps the gesture is an iPhone check; the
  fallback is one tap on NAME.
- No row gesture is touched. The animations are triggered by state
  changes only (the animation-separation rule).
- One tag on screen at a time: opening the blank tag closes a real tag
  (and reopens it on cancel).
