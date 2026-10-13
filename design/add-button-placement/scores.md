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

## Concept round 5 -- Float (baseline), A ticket, C ring (director, 2026-10-13)

The owner, after the round-4 set (verbatim): "These are concepts so it’s
normal for me to have feedback". So feedback isn't a rejection, and I've
dropped the "rejection 1 of 9s" framing from jam turn 13 and my notes. The
bar stays what his notes taught us: craft at real size, a + that reads as a
+, and restrained UI weight, judged beside the floated badge.

Looked at, 1x crops first:
- `stub/A2-close-up-1x`, `C-pin/C2-close-up-1x` (one shared window with the
  floated badge);
- then `E-float/E1`, `E4`, `E5`, `E6`, `E8`; `stub/A1`, `A4`;
  `C-pin/C1`, `C3`;
- jam turns 14-16.

### Float (baseline), right corner `r-gutter-20`: 9, after two re-shoots

**1x:** today's badge, read at once as +, and it doesn't fight anything.
**E1:** both corners are clean, and the pick line is short and true. **E8:**
the badge's ink shares one vertical with the account badge and sits 20px
above the list, the same as its side gap. That's the kind of exact small
alignment the owner checks ("Small marks line up exactly"). **E4:** the tag
hangs clear with `TAG_SHEET_GAP` 78, and nothing moves.

Likely owner objections:
- In E5, the open × is an orange scallop right beside the orange ADD
  LOCATION bar: two orange buttons side by side, and he'd see it at once.
  Fixed by ruling 5 below.
- It moves 240px on tap (old Q1). It's told in the cost line, and "stay"
  was measured as broken, so this is a real trade, not one we're hiding.
- "It's the standard." That's his own option, and we show it at our best
  craft.

**Fixes before it goes (mechanical; I check the stills):**
1. Re-shoot E5 with ruling 5 (navy × badge).
2. Re-shoot E6 with ruling 4 (credit without "Leaflet |"). Today the credit
   ends about 3px from the badge, which reads as touching at 1x.

### A. Claim-check stub, "ticket": 9, after one caption fix

**1x (A2):** the Hanging Tag stub's concave notches give it a real ticket
silhouette that you can see at real size. The paper tooth reads as paper,
not clouds. The + is bolder and still says add first. Next to the badge it's
the more particular object, and that was the push his "boring" asked for.
It got there by form (die-cut) and paper alone, with no added marks.
**A4:** rest, pressed and open are one system with the header. The
notches and tooth hold on navy.

Likely owner objections:
- "Still an orange block." It's lighter now: the silhouette is the change,
  and it's visible at 1x. I'd defend it.
- "The + is heavier than the other icons." It's 3px against the icons'
  ~2.5px. It's the action glyph, and it's printed on a flood, not drawn on
  paper. I'd defend that too, but it's the dial if he asks.
- The perforation is still nearly invisible at 1x. It no longer carries the
  idea (the notches do), so that's fine.

**Fix before it goes:** A1's cost line says "60px less room". Systems
measured **32px**. Change the line to: "The list title gets 32px shorter:
'list' drops first, and at 320 the count too."

### C. Pencilled pin, "ring": 8, one fix round

**1x (C2):** the push worked on the main point. The + now *is* the sign:
a heavy navy + on a die-cut orange tag, no words. It reads as a + button
that is our pin and our tag, never a disc. That's the owner's note answered.

What holds it under 9 (the objection I expect first):
1. **The dashed pencilled ring reads as a loading spinner at 1x.** At real
   size an 18px dashed circle above a button is the web's "busy" mark. The
   dashes also read as dots ("dots add an insane amount of visual noise").
   - The fix is the visual designer's: the unplaced pin must read as "not
     placed yet" and not as "loading", and it can't use dashes at 1x.
   - Bar: the C2 crop at 1x shows a ring a stranger wouldn't call a
     spinner.
   - Don't drop the ring. The bare tag was tested and read as a price label.
2. **The flow stills still show the old "+ ADD" pin** (`2-add-strip`,
   frame a). Re-shoot `2-add-strip` with the new pin, so he never sees two
   versions of C in one message.

Not holding it under 9: the costs (form becomes a tag; close the tag or the
filters to add), which are told plainly in C1. Also the size (60x48, a touch
bigger than the badge), which reads as "more prominent", the original ask.

### Rulings

1. **Float, `TAG_SHEET_GAP` 78: accepted, on phones, if Float wins.**
   - In round 3 I ruled out 96 for C because it cost a list row. Systems
     measured that 78 costs no row: at 664 the sheet lowers 64 instead of
     34 and still shows 3 rows, and at 844 nothing changes. That keeps the
     owner's "header, one item, half a second item".
   - The other way would be to hide the badge under a tag (C's rule), which
     would add a job-1 exception to the baseline for nothing.
2. **Float with the filters open: the badge stays under the panel, so you
   close the filters to add.** It's the same rule C has, and riding the
   panel puts it at y −1 at 664. It goes in the cost line.
3. **Float, form: ride, not stay.** Stay is broken: at 844 the × lands on
   ADD LOCATION, and at 664 Add is behind the list. Ride puts Add and × on
   one line in the thumb band, and cancel restores the list, the tag and the
   draft. Moving on tap is old Q1, told in the cost line, and the owner
   decides by picking.
4. **The 320 credit: drop the "Leaflet |" prefix, at every width, for Float
   and C** (one rule, not a 320 special case).
   - Keep "© OpenStreetMap contributors" exactly; that's the licence
     requirement.
   - The Leaflet link is a courtesy, not a licence term.
   - It doesn't apply to A, which leaves the credit alone; whichever
     concept wins carries it.
5. **The two oranges with the form open (Float E5): the open badge stays
   navy, and only the glyph turns + → ×** (orange × on navy). ADD LOCATION
   is then the only orange field in the band.
   - The badge's state change is still more than colour: + turns into ×.
   - Today's orange-field open state is the seam the stub work already
     flagged (account badge, brand-token pass). For the Float, the open
     field is the state that loses.
   - Re-shoot E5. One "just so you know" line to the owner if Float wins.
     Not a question.

### Did the work change?

Yes, all three are new. Float is new. A changed its silhouette (notches),
paper tooth and + weight. C changed from words to a + glyph, the tag
shape and size, and the corner. Round-4 scores don't carry over.

### What keeps blocking a 9 (across rounds)

- **Rounds 1-4:**
  - finish in new state frames (now caught by `chrome-check.js`);
  - the 664 squeeze (traded openly);
  - our 9 judged the idea, not the 1x read beside the simplest alternative.
- **Round 5:** the process change worked; the 1x crops found the real issues
  (C's ring, E5's oranges).
- **What's left is small-mark craft:**
  - a ring that reads as a spinner;
  - a credit about 3px from a badge;
  - a caption number that didn't match the measurement.
- These keep happening because the stills are checked for collisions by
  script, but not for what a small mark *reads as* at 1x, or for whether a
  caption matches the measurement. The visual seat should add a 1x
  "what does each small mark read as" pass and a caption-vs-measure check
  before handing over.

### The owner send (one message, after the fixes; I check every re-shot still)

Order: Float first (his own ask, the bar), then A, then C. One cost line
each.

**Float, today's badge floated low** (`concepts/E-float/`):
1. `E1-left-or-right-3x.png` (both corners, the pick)
2. `E8-alignment-3x.png` (how it lines up)
3. `E3-right-list-down-3x.png`
4. `E4-right-tag-open-3x.png`
5. `E5-right-adding-3x.png` (**re-shot**: navy × badge)
6. `E6-right-320-3x.png` (**re-shot**: credit without "Leaflet |")
7. `E7-right-664-3x.png`

Not sent: `E2` (the right corner at rest is already in E1).
- **Cost line:** "+ rides down with the list when you tap it (and back on
  cancel); with the filters open, close them first."
- **Just so you know** (one line): "While the form is open the badge stays
  navy and the + turns into ×, so Add is the only orange."

**A. Claim-check stub, now a ticket** (`concepts/stub/`):
1. `A1-vs-float-3x.png` (**caption fixed**)
2. `A2-close-up-1x.png`
3. `A4-states-3x.png`
4. `A5-adding-3x.png`
5. `A6-tag-open-3x.png`
- **Cost line:** "The list title gets 32px shorter: 'list' drops first,
  and at 320 the count too."

**C. Pencilled pin, now a + tag** (`concepts/C-pin/`), only if the ring fix
reaches 9:
1. `C1-vs-float-3x.png` (**re-shot**, new ring)
2. `C2-close-up-1x.png` (**re-shot**)
3. `2-add-strip-3x.png` (**re-shot** with the new pin)
4. `C5-tag-open-3x.png`
- **Cost line:** "The add form becomes a tag on the map; with a tag or the
  filters open, close them to add."

If C's ring doesn't reach 9 in one round, send Float and A, plus one line:
"The pin now reads as a +, but its unplaced ring still looked like a loading
spinner; we're holding it."

Plus one line on B: "We dropped the bottom bar: smaller, it turns into the
floated badge."

Questions with the send (unchanged, none blocking): jobs.md Q2 (fly to the
new place after Add) and Q3 (later ideas). Q1 is now answered by picking:
Float and A ride, and C's form is on the map.

## Concept round 5b -- re-shots checked, C re-scored (director, 2026-10-13)

Looked at: `C-pin/C2-close-up-1x` (first), `C1-vs-float`, `C5-tag-open`,
`2-add-strip`; `E-float/E5`, `E6`; `stub/A1` (caption and credit crops),
`A2` (credit crop); jam turn 18.

### Float: 9, confirmed
- **E5:** the badge stays navy and the glyph turns into a **paper ×**. My
  ruling said an orange ×, but paper is the header's ON glyph, the same as
  A's open stub, so the two concepts now share one open state. That's
  better than my call; I accept it.
  - ADD LOCATION is the one orange button on the line. The caption says
    "the one orange button", which is accurate: the account's person glyph
    is orange too.
- **E6:** the credit is "© OpenStreetMap contributors" at bottom-left,
  68px clear of the badge at 320.

### A ticket: 9, confirmed
- A1's cost line now reads the measured 32px.
- A1 and A2 still show "Leaflet |" on A's side. That's correct: ruling 4
  applies to Float and C only, because A leaves the credit alone. The two
  sides of the comparison differ on purpose. Not a fix.

### C. Blank pin: 8 → 9, after one mechanical re-shoot
- **Did it change?** Yes. The dashed ring is now an **empty pin head**, a
  solid 2px graphite ring.
- **At 1x (C2)** it reads as a pin head on a string with a + tag hanging
  from it, not as a spinner, and there are no dots. The + is still the
  loudest mark, and it reads as a + button that is our pin and tag.
- **The search glyph is a pushpin** (ring on a string). That's the right
  call: a lone ring beside a field reads as a radio button.
- **C5:** the pin steps aside, "close the tag to add", with the credit
  fixed.
- **`2-add-strip`:** frame 1 now shows the current pin.
- **Remaining objection:** "The tag is bigger and louder than the badge."
  It reads as more prominent, which was the original ask, so I'd defend it.
- **Re-shoot before it goes:** `2-add-strip` frame 3 (the placed tag at
  664) still shows "Leaflet | © OpenStreetMap contributors", against ruling
  4 (C, every width). It's mechanical, and I check it before release.
  Visual's caption check reads captions against measurements but didn't
  catch a ruling-vs-frame mismatch. So add a check: every frame against the
  current rulings.

### FINAL SEND (one message, in this order; supersedes the round-5 list)

**1. Float, today's badge floated low** (`concepts/E-float/`):
1. `E1-left-or-right-3x.png`
2. `E8-alignment-3x.png`
3. `E3-right-list-down-3x.png`
4. `E4-right-tag-open-3x.png`
5. `E5-right-adding-3x.png`
6. `E6-right-320-3x.png`
7. `E7-right-664-3x.png`

Cost line: "+ rides down with the list when you tap it (and back on
cancel); with the filters open, close them first."
Just so you know: "While the form is open the badge stays navy and its +
turns into a cream ×, so ADD LOCATION is the one orange button."

**2. A. Claim-check stub, now a ticket** (`concepts/stub/`):
1. `A1-vs-float-3x.png`
2. `A2-close-up-1x.png`
3. `A4-states-3x.png`
4. `A5-adding-3x.png`
5. `A6-tag-open-3x.png`

Cost line: "The list title gets 32px shorter: 'list' drops first, and at
320 the count too."

**3. C. Blank pin** (`concepts/C-pin/`):
1. `C1-vs-float-3x.png`
2. `C2-close-up-1x.png`
3. `2-add-strip-3x.png` (**after the frame-3 credit re-shoot**)
4. `C5-tag-open-3x.png`

Cost line: "The add form becomes a tag on the map; with a tag or the
filters open, close them to add."

**Also in the message:**
- One line: "We dropped the bottom bar: smaller, it turns into the floated
  badge."
- jobs.md Q2 (fly to the new place after Add?) and Q3 (later ideas).
  Picking a concept answers Q1.

**Not sent:** E2; A3, A7, A8; C3, C4, C6, C7; the `r5/` studies and the
appendix.

If the `2-add-strip` re-shoot is held up, send Float and A now and C with
it. Don't send C with the stale frame.

### Did the work change?
- C: yes (the ring), 8 → 9.
- Float: E5 and E6 changed; its 9 is confirmed, not raised.
- A: a caption fix; its 9 is confirmed.
