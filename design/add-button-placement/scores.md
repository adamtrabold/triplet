# Scores

## Concept round 1 -- claim-check stub (director, 2026-10-12)

**Score: 8 / 10. Not READY yet: one short fix round, then re-score.**

Looked at: `concepts/stub/` owner stills 1-5 (`1-rest-today-vs-stub`,
`2-adding-664`, `2-tap-strip`, `3-tag-open`, `4-states`,
`5-320-copenhagen`), `overview-sheet.png`, `perf-1x-paper.png`, the appendix
(`filters_after` = the form at 390x844, `safe_*`, `signedout_*`, `play_tap`,
`desktop_*`, `measure.json`), `how-it-works.md`, `looks-and-feels.md`,
`jobs.md`.

### What earns the 8

- It answers both halves of the owner's sentence by structure, not by
  decoration. *Prominent*: the one filled field in a band of outline icons,
  and no longer the account badge's twin (still 1 makes the difference
  obvious at a glance). *Reachable*: it's in the thumb band in every state,
  including collapsed, with a tag open, Plans, and desktop.
- It fits the brand without adding anything. It uses the tag stub's
  perforation, ADD LOCATION's orange, and the header's own ON state. The
  four-state table is one system with the filters tile (`4-states`).
- The tag still wins on hierarchy (`3-tag-open`). The 320 drop order reads
  as intended (`5-320`). The 1x perforation on `--paper` is just legible.
- It fixes two real bugs on the way: Add hidden in Safari, and the form
  opening behind filters.

### Likely owner objections (strongest first)

1. **"What's that empty gap?"** At 390x844 (`appendix/filters_after`) the
   form sits at the top, then about 290px of blank map, then the band with
   the ×. ADD LOCATION is at y 450-494, mid-screen, and the × is 290px
   below it. It looks unfinished, and it undercuts "reachable": Add isn't in
   the thumb band at full height. The owner's phone may well be at 844
   (Home Screen), so he'll likely see it. **Likely.**
2. **"What's that grey?"** In `2-tap-strip`, mid-ride, the stub is a
   muddy dark grey, from crossfading orange into navy. That frame is in the
   still that goes with his decision question, and it reads as a glitch.
   **Likely.**
3. "The button moves." He's being asked this directly (Q1), honestly
   framed, so it isn't marked down here. It is the decision most likely to
   send the concept back.
4. "It's just an orange rectangle / average." The claim-check reading rests
   on one perforation. I'd defend it under "simple simple simple", and I'm
   not asking for marks. **Possible, not likely.**

(1) and (2) are likely, so the score is under 9.

### Fixes (numbered)

1. **Anchor the form to the band.** While the form is open, its bottom
   edge sits on the band (ADD LOCATION just above the ×), and the form
   grows upward from there. The map shows above it in whatever height is
   left. At 664 it looks the same as now (the form fills the space). At 844
   the 290px gap moves above the form, as map, and Add comes down to around
   y 700-740. That fixes the gap and puts Add in the thumb band, which is
   job 3 as the owner would read it. This is the form's *position*, not its
   fields, so it's inside my turn-6 scope ("how the form shares the
   screen"). Re-render still 2 at 664 **and add a 390x844 version** of it,
   so the owner sees both phone heights. Check that the account badge
   doesn't collide with the form's top at 664. Systems: update
   how-it-works sizes table + `jobs.md` step 2 wording if it changes.
2. **No muddy mid-state.** The field must never show a blend of orange and
   navy. Options, visual's call: the field switches cleanly at a single
   point (e.g. on the press, as the deep-orange press already does, then
   navy when the ride starts), or the navy wipes/fills rather than
   fades. The + to × rotation can stay at 0.3s. Re-shoot the strip's middle
   frame.
3. **Send stills, not the sheet.** `overview-sheet.png` at 2500 wide with
   four phones per row isn't phone-readable (the list text is a few px).
   Orchestrator: send owner stills 1, 2 (+ the 844 version), 3, 4 and 5 as
   separate images, and the sheet only as an index if at all.

### Steering on the designers' open items

- **Opening filters/sort while the form is open: yes, it closes the form**
  ("one ON tile in the band"), *provided the draft survives*. If the owner
  has typed a search or notes, tapping filters must not throw it away. The
  next tap on + reopens the form with the draft. If today's close
  discards the draft, then filters/sort stay disabled while the form is
  open, and nothing closes on its own. Builder verifies which applies;
  either way the band never shows two ON tiles.
- **Escape closes the form**: approved, as a desktop nicety. Not owner-facing.
- **Empty map below the form at 844** (systems' flag): resolved by fix 1.
- **The perforation on `--paper`**: approved (`perf-1x-paper.png`, just
  legible at 1x, nothing added).
- **Rotation at 0.3s on the collapse timing**: fine, once fix 2 lands.

### Did the work change since my last look?
First score; n/a.

## Concept round 2 -- claim-check stub (director, 2026-10-12)

**Score: 9 / 10. READY: claim-check stub goes to the owner.**

Looked at: `2-adding-844-3x.png` (new), `2-adding-664-3x.png`,
`2-tap-strip-3x.png`, `looks-and-feels.md` (updated). Stills 1, 3, 4, 5 are
unchanged since round 1.

### Did the work change? Yes, both blocking fixes landed

1. **The form is anchored to the band.** At 844, ADD LOCATION is at y
   716-760, directly above the × at y 784. The gap is gone and Add is in the
   thumb band, so job 3 now holds at both phone heights. At 664 the form
   fills the space with Search, Add and × all visible. The account badge
   clears the form's top edge at 664 (~80px of map between them).
2. **No blend.** The strip's middle frame shows a clean navy × mid-ride,
   with no grey. It reads as one control changing state as it travels.

### Rulings

- **Unasked change: the OSM credit rides to the form's top edge.**
  Approved. It stays visible on the map, which is the only hard rule, and
  sitting on the form's edge reads as on purpose.
- **Flag: the map above the open form shows no pins at 844. Re-fit? No.**
  - Re-fitting moves the user's map on open, and then again on cancel to
    restore it. That's two camera jumps for a glance, and it fights job 4
    ("add without losing your place").
  - The strip above the form is context, not a working view. In the real
    app it shows map tiles; it's only blank paper in our renders because
    tiles don't load headless. So it reads as map, not as emptiness.
  - If the owner says yes to Q2, Add then flies to the new pin anyway.
    That's the moment the map should move, not on open.
  - Orchestrator: caption still 2b with one line: "Map tiles don't load in
    our renders; on your phone the strip above the form shows the map."

### Likely owner objections (remaining)

- "The button moves": Q1 asks it directly, with the strip as evidence. It
  is the one decision that could send the concept back. That's his call,
  not a flaw I'm hiding.
- "It's just an orange rectangle": possible. I'd defend it as is: it's
  simple, it's the tag's stub, and it's ADD LOCATION's orange. No marks
  added.
- Neither is likely enough, as a *design* objection, to hold the score
  under 9.

### Stills for the owner (send these, separately, in this order)

All are in `concepts/stub/`:

1. `1-rest-today-vs-stub-3x.png`: today vs the stub, at rest.
2. `2-tap-strip-3x.png`: tap + → the list slides down → adding (390x664,
   Safari). **Q1 goes with this one.**
3. `2-adding-844-3x.png`: adding at full height, with the one-line tiles
   caption.
4. `3-tag-open-3x.png`: a tag open, the selected row and the stub.
5. `4-states-3x.png`: rest / pressed / open / filters open.
6. `5-320-copenhagen-3x.png`: a small phone, a long city name.

Don't send: `overview-sheet.png` (not phone-readable), `2-adding-664-3x.png`
(already covered by the strip's last frame), or the appendix.
Questions: `jobs.md` 1-3 verbatim, plus its "Just so you know" line. Q1 is
the only one that decides the concept.

## Concept round 3 -- the set: stub, B, C (new director, 2026-10-12)

Context: the owner said "i want more than one concept." I scored the new
concepts in one pass against the same bar as the stub. One extra question
for each: is it a *real choice* he'd want to have?

### Claim-check stub: 9, standing
I didn't re-score it; the work hasn't changed. Its two honest costs are
now answered elsewhere in the set:
- It rides the sheet (Q1); B is the "never moves" option.
- It's right-thumb only; B is handedness-free.

### B. Striker strip: 9 / 10. READY after one re-shoot

Looked at: `1-rest-today-vs-B`, `2-add-strip`, `4-states`, `6-keyboard`,
`7-collapsed`, `8-safari-tab`, `stills/3-tag-open`, how-it-works,
looks-and-feels.

What earns it:
- It's the most prominent and the most reachable answer: words, full
  width, the bottom edge, either thumb.
- It never moves, so it answers Q1 by existing.
- The same strip starts and finishes the add. The blank `ADD ______` is a
  printed form waiting for an entry, not a greyed button. It's the app's
  grammar, and it's the best idea in this round.
- ADD stays reachable while typing (`6-keyboard`); no other concept manages
  that.
- The list never moves, and an open tag stays visible while adding.
- It does all this with the tag's own perforation and paper tooth, no new
  vocabulary.
- It's the deliberate "conventional at its best" member of the set, and I
  don't mark it down for being conventional.

Likely owner objections:
1. **"It takes space / it's a big orange bar"**:
   - 56px all the time.
   - 150px of bottom chrome with the list down from the Home Screen.
   - Three stacked bars in a Safari tab.
   - In `3-tag-open` it's the largest orange area on screen.
   - The stills show it honestly (`7`, `8`). The owner asked for "more
     prominent", and B is the far end of that range on purpose. Possible,
     not likely enough to hold it under 9, because the set gives him the
     quieter stub and C right beside it.
2. **"Average / a checkout bar"**: the paper tooth and perforation carry
   it, just. Possible.
3. **Fix-blocking (likely, if sent as-is):** in `6-keyboard`, the account
   badge sits on the OSM credit and on the form's top rule. It looks broken.

Fixes:
1. With the keyboard up or on a short screen, the form's top stops below
   the account badge; the form scrolls inside. The credit sits clear of the
   badge. Re-shoot `6-keyboard`. I check it before sending.
   (Not B's: the Address field's long raw address is today's form,
   unchanged.)

**Owner stills for B** (in this order):
1. `1-rest-today-vs-B-3x.png`
2. `2-add-strip-3x.png`
3. `6-keyboard-3x.png` (re-shot)
4. `7-collapsed-3x.png`
5. `8-safari-tab-3x.png`
6. `stills/3-tag-open-3x.png`

Not sent: `4-states` (the strip still already shows rest → blank → ready),
the 320 still (B leaves the header as it is today), and desktop/filters
(appendix).

Caption line for the owner: "Never moves; costs 56px of screen all the
time."

### C. Pencilled pin: 8 / 10. One fix round, then re-score

Looked at: `1-rest-today-vs-C`, `2-add-strip`, `2d-done`, `4-states`
(incl. 1x), `stills/pending-tag-664`, how-it-works, looks-and-feels.

What earns the 8:
- It's the most *Triplet* idea anyone has had on this task. The thing you
  tap is a blank pin with a tag that says + ADD. You place it, and the form
  is a blank Hanging Tag that inks into the real one: the owner's "pin and
  what it opens are one idea" bonus, all the way through.
- It has the best search (results grow up above the keyboard), the fewest
  taps (3 against 4, with autofocus), and it ends on the place with its row
  selected, which answers Q2 by construction.
- Shapes work, starring prints the band, and the herbarium blank tag is
  lovely.
- The blank pin reads as "add" at 1x.

Likely owner objections:
1. **"The + disappears when a tag is open / when filters are open."** With
   rulings (b) and "close filters to add", that's the honest cost of a home
   on the map. It's told, not hidden. It's the concept's trade, and the
   stills must say it in one line.
2. **"It's smaller than today's +."** The tag is 44x31, against today's 50px
   badge. Orange and words make it louder than the navy badge, but the owner
   said "more prominent". **Likely as drawn.**
3. **"That search frame is a mess"** (`2-add-strip` frame 2): the results
   box overlaps the zoom control and cuts the account badge in half at the
   top. **Likely.**
4. **"Why is there still an ADD pin next to my new place?"** (`2d-done`):
   the blank pin shows beside the new tag. That breaks ruling (b), and the
   new selected row is half below the fold. **Likely.**
5. "That's a big build": true. It changes the form. Told plainly.

Fixes:
1. Apply ruling (b) everywhere: the blank pin is hidden whenever a tag is
   open, including `2d-done`. Re-shoot `3-tag-open` to show it (with a
   caption: "close the tag to add").
2. Search frame: the results must never overlap the top chrome. Either cap
   the results' height below the zoom and badge, or hide the top chrome
   while searching. It's the designers' call, but the frame must be clean.
3. After Add, scroll the new row fully into view (as a list tap does).
   Re-shoot `2d-done`.
4. **Prominence study:**
   - Show the blank pin at today's size, and one step larger (e.g. a 52-56px
     wide tag), next to today's badge.
   - Make the hit area at least 44x44 and document it.
   - Pick the size that reads as the main action on still 1 without
     covering pins. It must stay a pin + tag, not a disc.
5. Captions on C's owner stills, one line each:
   - "Bigger change: the add form becomes a tag on the map."
   - "With a tag or the filters open, close them to add."
6. Systems: update how-it-works for rulings 2-5 (b, filters, 16px overlay,
   draft kept).

Can it reach 9? Yes, as the bold option, if fixes 1-4 land and objection 1
reads as a fair trade next to the stub and B. If the size study can't make
it read as more prominent than today without covering the map, it stops at
8 and doesn't go.

Planned owner stills for C (after fixes):
1. `1-rest-today-vs-C`
2. `2-add-strip`
3. `2d-done`
4. `3-tag-open` (pin stepped aside)
5. `4-states`, the top half (rest/pressed/1x) + starred band

### D. Eyelet: killed
It reads as a docked FAB or a drag knob, and it covers the OSM credit.

### What keeps blocking a 9 (across rounds)
- **Owner-still finish:** collisions with the top-right chrome (B's
  keyboard frame, C's search frame) and leftovers in end states. Each round
  the new frame types (keyboard, search, done) are the ones that haven't
  been checked against the corner badge. Fix at the source: every new state
  frame gets checked against the badge, the credit and the zoom before it
  reaches me.
- **Map-side homes run out of room at 664.** That's structural, not
  cosmetic. It's why the jam killed the tab and the seal, and it's why C
  must lose + in two states. It won't go away with polish; it can only be
  traded openly.

### Did the work change?
B and C are new this round; D is new and killed. The stub didn't change, so
its score stands.

## Concept round 4 -- re-score C, check B (director, 2026-10-12)

Looked at: B `6-keyboard-3x.png` (re-shot); C `1-rest-today-vs-C`,
`2-add-strip`, `2d-done`, `3-tag-open`, `4b-size` (all new);
`chrome-check.js` results in both `stills/measure.json`.

### B. Striker strip: 9, confirmed. Fix 1 landed
In `6-keyboard`, the form's top rule sits below the credit row, and the
credit sits clear below the account badge. Nothing overlaps. The chrome
check is clean on every B frame. READY.

### C. Pencilled pin: 9 / 10. READY

Did the work change? Yes, all five fixes landed:
1. **The pin steps aside whenever a tag is open.** `3-tag-open` shows one tag
   and no + ADD pin, captioned "Close the tag to add". `2d-done` shows the
   new place's inked pin and tag, with no blank pin beside them.
2. **The search frame is clean.** The results are a full-width paper sheet
   that stops below the zoom and the badge, with 3 results at 664.
3. **The new row is in view after Add**, selected navy at the foot of the
   list in `2d-done`. Systems should check one nit at build time: the row
   above the header is clipped mid-row.
4. **Size:** the tag is now 55px wide, with 15px words and a 65x83 tap
   area.
   - In `4b-size` and still 1 it reads as louder than today's 50px navy
     badge: orange, words, and a bigger footprint including the ring and
     string.
   - It's still a pin and a tag, not a disc.
   - It doesn't cover a pin at the default view.
   - That answers "more prominent".
5. **The cost lines are on still 1:** "Bigger change: the add form becomes
   a tag on the map" and "With a tag or the filters open, close them to
   add."

Likely owner objections, and why they don't hold it under 9:
- **"The + disappears when a tag is open."** It's real, and the owner hears
  it on two stills. It's C's trade for adding on the map and ending on the
  place, and the stub and B sit beside it with no such cost. That's a choice
  to put to him, not a flaw I'm hiding.
- **"That's a big change to the form."** Also told plainly. A bolder option
  is what "i want more than one concept" asked for.
- I don't see a likely objection about finish: every frame passes the chrome
  check.

Build-time notes (not owner-facing):
- `desktop-placed` flags the search bar crossing the OSM credit on the
  desktop rail. That's a desktop-only frame, so it's a builder fix: the
  credit lifts above the bar.
- The iOS 16px overlay selects are an iPhone check.
- The keyboard behaviour of the search line is an iPhone check.

### The set for the owner (one message)

Order: stub, B, C, so he goes from least to most change. One cost line each.
Then jobs.md Q1-3. Q1 (does the button ride down?) is the stub's question;
B is the "never moves" answer.

**Claim-check stub** (`concepts/stub/`; he has seen these, so resend as a
reminder):
1. `1-rest-today-vs-stub-3x.png`
2. `2-tap-strip-3x.png`
3. `2-adding-844-3x.png`
4. `3-tag-open-3x.png`

Cost line: "+ rides down with the list when the form opens (question 1)."
(`4-states` and `5-320-copenhagen` aren't resent; he has them.)

**B. Striker strip** (`concepts/B-striker/`):
1. `1-rest-today-vs-B-3x.png`
2. `2-add-strip-3x.png`
3. `6-keyboard-3x.png`
4. `7-collapsed-3x.png`
5. `8-safari-tab-3x.png`
6. `stills/3-tag-open-3x.png`

Cost line: "Never moves; costs 56px of screen all the time."

**C. Pencilled pin** (`concepts/C-pin/`):
1. `1-rest-today-vs-C-3x.png` (the cost lines are on it)
2. `2-add-strip-3x.png`
3. `2d-done-3x.png`
4. `3-tag-open-3x.png`
5. `4-states-3x.png`

Cost line: "Bigger change: the add form becomes a tag on the map; with a
tag or the filters open, close them to add."
(Not sent: `4b-size`, which was my check, plus the pending frames and the
appendix.)

**Not sent:** D (killed), overview sheets, appendix frames, pending
frames.

### What kept blocking a 9 (closing note)
- Finish in the new state frames. It's now caught at source by
  `chrome-check.js`.
- The map-side home's 664 squeeze. It's traded openly in C's captions, not
  polished away.

### Did the work change?
B: yes (fix 1), and the score is confirmed, not raised. C: yes (fixes 1-5),
so 8 → 9.
