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

**Update (2026-10-13):** C `2-add-strip` re-shot. Frames 1 and 3 show the shortened credit; frame 2 has the results sheet over the map, as before. Checked: **RELEASED.** The full set goes as listed above.

---

## Concept round 6 -- director, 2026-10-13

Looked at, 1x crops and squint tests first: `E-float/R6-F2-1x`,
`stub/R6-A2-1x`, `C-pin/R6-C2-1x`. Then `R6-F1`, `R6-F3`, `R6-F5`;
`R6-A1`, `R6-A3`; `R6-C1`, `R6-C3`; `D-floated-ticket/R6-D1`;
`r6-check/frames/F-tag_320`; `r6-check/measure-tagrows.json`; jam turns 21
and 22.

### Rulings
1. **`TAG_SHEET_GAP` 88 on phones, for the Float: accepted.**
   - At 664 and 375x667 it still keeps 3 rows, the same as today.
   - At 320x568 it keeps 1 row against today's 2. In `F-tag_320` the
     selected row is whole and about 31px of the 56px next row shows. That
     meets the owner's floor ("the list header, one list item, half second
     list item... the one selected").
   - Draw it at 60px, not with `scale()` (systems' builder note).
2. **A: admission, not the tag cut.**
   - At 1x the tag cut's eyelet reads as a dot.
   - It turns A into C's object (a tag), so the set loses a difference in
     kind.
   - In the sort/filter row a tag shape reads as "tags".
   - The tag cut stays visible only as a route in `R6-A3`, with its verdict.
3. **D: killed** (visual and systems agree). The bare version reads as "A
   moved to the corner"; the pinned version needs two marks and an empty
   pin. One line to the owner.
4. **The "Leaflet |" prefix is dropped for the Float and C** at every width
   (already ruled). At 320 it's now required: the prefix overlaps the 60px
   badge by 6.3px. A keeps the credit as is.
5. **Captions:** stop calling the Float's edge a "postage-stamp edge".
   - Stamps are the VISITED mark's language, and the postage stamp was
     killed for exactly that in turn 2.
   - At 1x it reads as a finer cut of the badge's own edge, so say that:
     "a finer cut of the badge's edge".
   - The look doesn't change; only the words that plant the wrong idea.
6. **The account step-down (`R6-F4`): not needed, and not flagged** to the
   sign-in crew. + wins without it.
   - Still flag to the orchestrator: the account's open state is an orange
     field, the seam for the brand-token pass.

### Likely owner objections, named before scoring
- **Float:**
  - "now it's the standard FAB": he asked to see this option, and the
    badge family's edge and the paper tooth keep it ours;
  - "too big or too loud": 60 against 50, so prominent, but not a slab;
  - two oranges with the clusters at city zoom: the clusters are small,
    deep orange and numbered, so low risk.

  None is likely to block.
- **A:**
  - "still not about a place": we answer that honestly in his own terms (a
    ticket for adding);
  - "it looks the same as last time": the change is the notch position.
    It's visible at 3x and at 1x, but small.

  Possible, not likely: he set the ticket condition himself.
- **C:** "the + still isn't ranked above the account". This is **likely**.
  - In the squint test the navy disc is level with the navy account badge.
  - The cream tag body disappears into the cream map, so the object's mass
    is lost.
  - He made this exact note about the badge this round.

### Scores
- **Float: 9.**
  - At 1x and blurred, + is clearly first and account clearly second, on
    three axes (orange, 60px, a finer cut).
  - `R6-F3` shows why each axis alone fails: an honest dial study.
  - The ink is still 20/20, on the account's line. The rule is kept and
    the twin is gone.
  - It's still Triplet's badge, so it answers his note directly.
- **A, admission ticket: 9.**
  - At 1x it reads "ticket" before "orange block": a tear line inside the
    stock, half-round notches at its ends (the tag stub's own notch).
  - The place link was tried five ways and answered honestly (`R6-A3`): a
    punch reads as a dot or a water drop; the tag cut becomes C.
  - He said "maybe as a 'ticket' it works if i think of it that way". This
    is the strongest version of that ticket, with no added marks. Whether
    he reads it that way is his call, and it's a real choice he likes.
- **C, pin and tag: 8.**
  - The big step is real: it's now the map's own selected pin with its
    tag open, drawn by `badgeHtml()`, among 17 real pins. "A pin with a
    tag" reads without a caption, so his note on the pin is answered.
  - It fails the rank test against the account (the likely objection
    above).

### C fixes (one round, visual)
1. **Rank:** C must clear the squint test above the account badge without
   leaving the pin and tag grammar. The mass is lost where the cream tag
   body melts into the map.
   - Dials to try (visual's call):
     - the tag's scale;
     - how the tag's stock separates from the map within its own
       restrained edge and shadow (the owner's rules on effects apply);
     - the disc's size, within what the map does for a selected pin.
   - No orange-flooded tag body (that's the 5b price label), and no second
     +.
2. **Alignment:** the tag's right edge sits 3.9px off the account badge's
   ink line. Put it exactly on the line ("Small marks line up exactly").
3. **Re-shoot the flow in the new pin:** the 5b `2-add-strip` and `C5`
   still show the old graphite ring, as the rest pin and as the placed
   marker. Bring a tag-open frame (the pin steps aside) and the add strip,
   with the placed marker drawn in the same grammar.
4. Builder note, not a still: hit-test the disc, string and tag only, not
   the 72x94 box's bare corners.

### Float re-shoots before the send (mechanical)
- `R6-F5`:
  - the "Adding" crop cuts off the ADD LOCATION label; re-crop so the
    label and the × both show;
  - the "Tag open" crop shows no tag; re-crop to show the tag's foot above
    the badge.
- Full phone screens at the 60px badge (from `r6-check` frames, at owner
  fidelity):
  - tag open at 390x664 with gap 88;
  - adding at 844 (ride, scale-aware Add);
  - 320 Copenhagen with a tag open (`F-tag_320`).

  The 5b E3–E7 show the old navy badge, so they don't go.
- Captions per ruling 5.

### Send (one message, when C's round is back; order Float → A → C)

**Float** (`concepts/E-float/`):
1. `R6-F1-vs-account-3x.png`
2. `R6-F2-1x.png`
3. `R6-F3-dials-3x.png`
4. `R6-F5-states-3x.png` (re-cropped)
5. new: tag open at 664
6. new: adding at 844
7. new: 320 with a tag open

Cost line: "+ rides down with the list when you tap it (and back on
cancel); with the filters open, close them first."
Just so you know: "With a tag open the list sits a little lower to clear
the bigger +: still 3 rows on your phone, 1½ on the smallest."

**A** (`concepts/stub/`):
1. `R6-A1-vs-account-3x.png`
2. `R6-A2-1x.png`
3. `R6-A3-routes-3x.png`

Cost line: "The list title gets 32px shorter ('list' drops first, at 320 the
count too). It's a ticket for adding; we couldn't make it say 'place'
without adding a mark."
Flows are unchanged from last round; don't resend the coat-check frames.

**C** (`concepts/C-pin/`), only if it reaches 9:
1. `R6-C1` (re-shot)
2. `R6-C2` (re-shot)
3. `R6-C3`
4. the new tag-open frame
5. the new add strip

Cost line: "The add form becomes a tag on the map; with a tag or the
filters open, close them to add."

**Also in the message:**
- one line: "We tried a fourth, your ticket loose in the corner. It just
  read as the ticket moved, so we dropped it."
- jobs.md Q2/Q3 (still open).

**If C misses after its one round,** send Float and A, with one line on C
("the pin reads as a pin now, but it doesn't yet outrank the account").

### Did the work change?
Yes, all three:
- Float: a new field, size and cut.
- A: a new cut.
- C: rebuilt on the real pin.

These scores are fresh, not raised from 5b.

---

## Concept round 6b -- C re-scored, Float frames checked, final send (director, 2026-10-13)

Looked at:
- C: `R6-C2-1x` first, then `R6-C4-rank`, `R6-C1`, `R6-C5`, `R6-C6`,
  `R6-C7`.
- Float: `R6-F5` (re-cropped), `R6-F6`, `R6-F7`, `R6-F8`.
- Code check: in `index.html` (~4865) a highlighted pin is the badge
  filled with its own ink and a paper glyph, and `.tag-band` is printed
  only when `loc.starred`.

### Flag 1: the miniature's orange band means "starred". Ruling: drop the band at rest.
- On a real tag the band appears **only** on a starred place (`TAG_STAR_STYLE`
  'band'). The owner's rule is that every colour "keeps the meaning it has
  elsewhere in the app".
- C contradicts itself as drawn: the rest tag has the band, but the blank
  tag it opens into (C6 frame 3) is unstarred cream, and its STAR prints
  the band.
- C's whole idea is "the object you tap is the object you get". So the
  rest tag must be the unstarred blank tag: cream stock, chamfers, the
  eyelet patch and grommet on paper, the real tag's warm edge and shadow.
- The orange stays on the pin (the action), not on the tag.

### Flag 2: an orange disc is close to the deep-orange clusters. Ruling: accepted, no change.
- Clusters are `--brand-orange-deep` discs with paper numbers, and they sit
  among the pins.
- The + pin is a brand-orange disc with a navy +, it hangs a tag on a
  string, and it's always in the corner.
- In C6 frame 1 both are on screen at city zoom, and they read as different
  things at a glance.
- The orange disc is also exactly the map's selected-pin grammar (a
  highlighted pin is filled with its own ink, paper glyph) with orange as
  its ink, and C7 resolves it into the place's own colour. That's
  coherent.
- Rank: in the squint test (C2, C4) C now clearly comes before the account
  badge. The orange pin did that, not the band.

### C: 8 → 9, after one bandless re-shoot that I check
- **Did it change?** Yes:
  - an orange pin;
  - the tag at 84x66 with the real tag's edge and shadow;
  - the right edge on the account's line (C1 caption, measured).
- **Every round-6 note is answered:**
  - it's our pin;
  - the tag reads as a tag;
  - + outranks the account.
- **The flow frames read in the same grammar:**
  - C5: the pin steps aside under a real tag;
  - C6: the search line's glyph is the same pin, and the blank tag is the
    form;
  - C7: the + pin becomes the place's own filled pin.
- **Re-shoot (the band ruling):** C1, C2, C4's pick column and C6 frame 1,
  with the rest tag unbanded.
  - I check that the 1x squint still puts + first.
  - If it doesn't, C goes back for one more round; the band does not come
    back. In that case send Float and A, with a line on C.
- **Likely owner objection:** "it's a big object in the corner" (84x104).
  It's told in the cost line. I'd defend it: it's the concept, and it
  hides under any tag.
- Builder note stands: hit-test the parts only.

### Float frames: checked, clean
- **R6-F5:** pressed, the tag's foot clearing the +, and ADD LOCATION and
  the × on one line, all legible now.
- **R6-F6 (664, gap 88):** 3 rows, the tag clears the badge, the credit is
  shortened.
- **R6-F7 (844, adding):** the navy ×, ADD LOCATION on its line, the list
  band below, the cost line on the frame.
- **R6-F8 (320, tag open):** the selected row is whole, about half the next
  row shows, and the credit is "© OpenStreetMap contributors".
- Captions now say "finer cut", not "postage stamp" (checked F1 and F3).
  **Float stays 9.**

### FINAL SEND (one message, in this order; supersedes round 6's list)

**1. Float: today's badge, floated low and promoted** (`concepts/E-float/`):
1. `R6-F1-vs-account-3x.png`
2. `R6-F2-1x.png`
3. `R6-F3-dials-3x.png`
4. `R6-F5-states-3x.png`
5. `R6-F6-tag-open-664-3x.png`
6. `R6-F7-adding-844-3x.png`
7. `R6-F8-320-tag-3x.png`

Cost line: "+ rides down with the list when you tap it (and back on
cancel); with the filters open, close them first."
Just so you know: "With a tag open the list sits a little lower to clear
the bigger +: still 3 rows on your phone, 1½ on the smallest."

**2. A: admission ticket** (`concepts/stub/`):
1. `R6-A1-vs-account-3x.png`
2. `R6-A2-1x.png`
3. `R6-A3-routes-3x.png`

Cost line: "The list title gets 32px shorter ('list' drops first, at 320 the
count too). It's a ticket for adding; we couldn't make it say 'place'
without adding a mark."

**3. C: pin and tag** (`concepts/C-pin/`), **after the bandless re-shoot
passes my check:**
1. `R6-C1-vs-account-3x.png` (re-shot)
2. `R6-C2-1x.png` (re-shot)
3. `R6-C6-add-strip-3x.png` (frame 1 re-shot)
4. `R6-C5-tag-open-3x.png`
5. `R6-C7-added-3x.png`

Cost line: "The add form becomes a tag on the map; with a tag or the
filters open, close them to add."

**Also in the message:**
- "We tried a fourth, your ticket loose in the corner. It just read as the
  ticket moved, so we dropped it."
- jobs.md Q2 (fly to the new place after Add? C does it by design) and Q3.

**Not sent:** `R6-F4` (account step, not needed), `R6-C3`, `R6-C4`, `D1`,
the `r6/` studies, the `r6-check` frames, and every 5b still.

**If C's re-shoot is held up or fails:** send Float and A now, and C after
it, or with the line "the pin reads as a pin now, but it isn't ready yet".
Never send C with the banded tag.

### Did the work change?
- C: yes, 8 → 9 (conditional on the mechanical re-shoot).
- Float: frames only; 9 confirmed, not raised.
- A: unchanged; 9 stands.

## Orchestrator, 2026-10-13
C re-shot without the band (visual): + no longer clearly ahead of account in the squint test, so C stays 8 and is not sent (per round 6b ruling: "If C's re-shoot ... fails: send Float and A now"). Float and A sent.

---

## Concept round 7 -- director, 2026-10-14 (Float at the left; A as the Hanging Tag cut)

Looked at, 1x and squint first: `E-float/R7-F2-1x`, `stub/R7-A2-1x`,
`stub/R7-A3-eyelet`. Then `R7-F1`, `R7-F4`; `R7-A4`, `R7-A5`, `R7-A7`;
jam turns 26 and 28.

### Rulings on the two mild reads
1. **The × against the band's ▲ (15px off-axis): accepted, no change.**
   - In `R7-F4` the × reads as the start of the Add row: ink + 12 to Add,
     both centred on one line, with the ▲ small and about 70px below.
   - Moving it would be a control changing place on tap (turn 27).
2. **Two oranges with a starred tag open (`R7-A5`, right): accepted, no
   change.**
   - One brand orange for the star, the tag band and actions is the
     owner's own system ("orange for star / tag top all the way"; "the
     star is the action orange").
   - The navy + keeps the header tag reading as "add", not "starred".
   - The open tag is 316px of content and stays first.
   - The shared cut is his "ties to the view state", visible on purpose.

### Likely owner objections, named first
- **Float:**
  - "ADD LOCATION doesn't line up with the fields": told in F4's cost
    line; it's the action row.
  - "two +s on the left": at 1x the boxed white zoom and the orange cut
    badge don't read as one family.

  Neither is likely to block. He chose the left himself.
- **A:**
  - "where's the hole, is it still a tag?": `R7-A3` shows the hole and the
    hole + patch beside the pick, with the reason (a dot, a switch knob).
  - "it points left like an arrow": at 1x in R7-A2 and A7 the two
    chamfers read as a tag's cut end, and A5 puts the real tag's identical
    cut on screen to confirm it.

  Possible, not likely, and the alternatives are in front of him.

### Scores
- **Float, bottom-left: 9.**
  - The look is his (orange, 60px, finer cut). In `R7-F2` the squint test
    puts + clearly first with no shared line to the account.
  - The ink is 20/20, on the row icons' left channel.
  - The credit is back at the right, the form row is exact, and every
    state is clean.
  - The work changed (corner), so this is a fresh score.
- **A, Hanging Tag cut: 9.**
  - At 1x it's an object at the band's end, not a fourth icon. The
    chamfers say tag without the dot-prone hole.
  - It doesn't read as "starred": a cream tag with an orange band is
    starred, and this is an all-orange stock with a navy + (A4, A5).
  - `R7-A5` shows his reason: the header tag and the open place tag share
    one cut, and the open tag wins.
  - At 320 the chamfers give locate room (A7).
  - The work changed (shape), so this is a fresh score.

### Mechanical fix before the send
- **`R7-A4`:** the REST and PRESSED crops carry a white sliver with tick
  marks along the top (the credit strip's bottom edge). At phone size it
  reads as stray marks. Re-crop below the credit, the same window for all
  three states. I check it.

### FINAL SEND (one message, Float → A)

**1. Float, bottom-left** (`concepts/E-float/`):
1. `R7-F1-right-vs-left-3x.png`
2. `R7-F2-1x.png`
3. `R7-F3-tag-open-664-3x.png`
4. `R7-F4-adding-844-3x.png`
5. `R7-F5-collapsed-3x.png`
6. `R7-F6-320-tag-3x.png`

Cost line: "+ rides down with the list when you tap it (and back on
cancel); with the filters open, close them first."
Just so you know: "While adding, ADD LOCATION starts about 27px right of the
form's fields so it can sit beside the ×; and the map credit goes back to
the bottom-right."

**2. A, the tag in the list header** (`concepts/stub/`):
1. `R7-A1-tag-vs-ticket-3x.png`
2. `R7-A2-1x.png`
3. `R7-A3-eyelet-3x.png`
4. `R7-A4-states-3x.png` (**re-cropped**)
5. `R7-A5-tag-open-3x.png`
6. `R7-A6-adding-3x.png`
7. `R7-A7-320-3x.png`

Cost line: "The list title gets 32px shorter ('list' drops first, at 320 the
count too)."
Just so you know: "With a starred place open there are two oranges, its band
and the + tag. It's one brand orange, and the + keeps it reading as add."

**Also in the message:**
- jobs.md Q2 (fly to the new place and open its tag after Add?).
- Q3 (later ideas) only if it's not already answered.
- C stays parked; don't mention it unless he asks.

**Not sent:** `R7-check` frames, the `r7/` raw frames, and all round-6
stills.

### Did the work change?
Yes, both (corner; shape). Fresh scores, 9 and 9.

## Concept round 8 -- director, 2026-10-14 (blank pin + blank-tag form: P, A, Float frame)

### Evidence
- At phone size first:
  - T0-T8;
  - P1, P2, P3-tap, P4-P6;
  - A1, A2, A3-tap, A4, A5.
- Then the two changes at the top of `blank-tag-form/how-it-works.md`.

### Turn-36 fixes: checked
1. **Pencil:** fixed. T0 proves it at 1x: cool graphite with visible
   grain, clearly not the warm faded grey of a signed-out control. T3
   and T8 now read as writing.
2. **The whole blank tag:** fixed (T2 left, P3-tap, A3-tap).
3. **Two-panel journeys:** fixed (P3-tap, A3-tap).
4. **T2 crop:** fixed.
5. **P2 needle:** fixed. 2px, the ground shadow visible at 1x; the FAB
   beside it has neither.

### Likely owner objections, named first
1. **"Why is there so much empty space on the tag?"** (T3, T8 picked,
   T5 before). LIKELY.
   - Once picked, the tag runs about 1.6x the real tag's height, with
     uneven bands: name→address 140, address→NOTES 137 (empty),
     NOTES→TYPE 188 (3x px).
   - That's his own "Spacing between things is insane … A measured
     spacing system should already exist".
   - With systems' no-shrink at ADD, the real tag keeps that height
     while it's open, so the "after" is a bloated real tag.
2. **P: "a FAB with a stick" / "bigger than every other pin".** POSSIBLE,
   not likely. At 1x (P2) the needle and ground contact make it a pin
   being placed, and the FAB beside it shows the difference. He revived
   this object himself.
3. **P: the orange pin near the orange clusters (P5, P3-tap rest).**
   POSSIBLE. It's lighter, larger, with a + and a needle.
4. **A: "+ on the right; I said left is easier."** POSSIBLE. A1's cost
   line says it in his words.
5. **"ADD isn't orange."** POSSIBLE. The T3 caption answers it in one
   line.
6. **A3-tap / A5: the account badge sitting on a map pin.** Real app
   behaviour, but a stranger reads it as a slip. LIKELY to draw a
   comment that's not about the concept.

### Scores
- **P · Blank pin: 8.**
  - The idea is a 9: one object from + to place, and the pin and what it
    opens are one idea (his "bonus points").
  - Objection 1 is likely, and it sits on the shared form every frame
    after the pick shows. The T5 "after" also doesn't match the spec.
- **A · Header tag: 8.**
  - Same reason (the shared form).
  - Otherwise it's at 9: the only no-exception trigger (A4), and the tag
    pulls up out of a tag.
- **Float frame (A5):** fine as a frame; the badge-on-pin crop is fix 4.

### Fixes (one batch; then I re-score from the re-shot stills only)
1. **One measured rhythm on the blank tag (visual, systems checks the
   numbers).**
   - Every line sits on one interval from the spacing system: name,
     address·city, NOTES, TYPE.
   - Captions follow one rule: under-captions only while the line is
     empty; TYPE keeps its inline caption, as on the real tag.
   - Picked height = the real tag's height + only the NOTES writing line.
     No empty band.
   - Re-shoot T3, T4, T6, T7, T8 (picked), and the T5 "before".
2. **ADD → the real tag without moving the stub (director's ruling on
   systems' change 5).**
   - Keep systems' rule: DIRECTIONS stays under your thumb (owner: "I
     don't want … the button to change physical location after click").
   - But the tag becomes the real tag *now*, not on the next open. On
     ADD, the tag reaches the real tag's height by its top edge coming
     down, and the map pans by the same amount: the pin and eyelet come
     down with it, the string stays `TAG_HANG`, and the stub doesn't move.
   - If systems finds the pan fights the popup in Leaflet, fall back to
     their no-shrink, but then the empty paper must be gone by fix 1 (the
     only extra height is the NOTES line).
3. **T5 = two panels: before | after ADD** (inked, stamped TYPE, the pin
   in its category, DIRECTIONS in place, the stub not moved). Drop the
   third "closed, row selected" panel: P4 and A4 already show that state.
   Two panels is the phone-readable size.
4. **Re-crop A3-tap (rest) and A5 (right)** to a pan where nothing sits
   under the account badge. Same zoom, different centre.
5. **Results start: 89 on screens ≥ 600 tall, 72 below** (systems
   offered it). The NAME caption stays while typing where it fits.
   Re-shoot only T8's typing panel at the spec value, and check that it
   shows ≥ 3 rows.

Not changing: P's size and needle, the orange-vs-clusters read, A on the
right, navy ADD.

### Send list, prepared (goes once fixes 1-5 are re-shot and I re-score 9)
One message, P → A → shared tag → Float.

1. **P (blank pin):**
   - P1 rest vs today;
   - P2 pin or button (1x);
   - P3-tap;
   - P4 tag open (the cost);
   - P5 small phone, list down.
2. **A (header tag):**
   - A1 rest vs today (cost: title 32px shorter, + on the right);
   - A2 1x;
   - A3-tap;
   - A4 tag open (no extra step).
3. **The blank tag (shared):**
   - T0 pencil vs greyed;
   - T2 just tapped / no results;
   - T1 typing;
   - T3 picked;
   - T4 starred, visited, note;
   - T5 ADD inks;
   - T6 district;
   - T7 questions / couldn't save;
   - T8 320.
4. **Float:** A5, the same tag from the badge.

**Held back:** P6 (pressed + "also tried" pocket) only if he asks, since
the pocket's one line goes in P's caption. Also held: raw/, pass-a-check/,
sketches.

**Cost lines:**
- **P:** "One extra tap to add while a place's tag or the filters are
  open."
- **A:** "The list title is 32px shorter; the + is on the right."
- **The tag:** "TYPE is a guess from OpenStreetMap (or your last type)
  in pencil; tap to change. It can't be tested here; it's an iPhone
  check."

**Owner questions (with the send):**
1. While adding, mark it visited too?
2. Fix a place after adding by opening its tag in pencil again?
3. Skip ADD: picking a result saves the place, with Undo?
4. Later, place a pin by dragging it onto the map or holding the map?
5. Just so you know: on the tag, ADD is navy, because orange on a tag
   means starred.
6. Just so you know: the blank pin needs one extra tap while a tag or
   the filters are open; the header tag doesn't.

### Did the work change?
- Yes, since turn 36: pencil, blank state, journeys, crops, needle.
- This is the first score for round 8.

## Concept round 8b -- director, 2026-10-14 (re-score after the round-8 fixes; round-8 scores kept above)

### Evidence
- At phone size first: T0-T8 (re-shot, demo place Sundhöllin), P3-tap,
  A3-tap, A5.
- Then the 8b top note in `blank-tag-form/how-it-works.md`.

### Round-8 fixes: checked
1. **Spacing:** fixed.
   - The picked tag is 248: the real tag plus the NOTES row, on one 32
     rhythm (T3).
   - The empty bands are gone, and the captions follow one rule.
2. **ADD keeps the stub put:** fixed (T5). Before and after share the
   stub's foot, the top comes down, and it's the real tag at once.
3. **T5 has two panels:** fixed, and readable.
4. **A3-tap rest and A5 right:** the badge is clear in both.
5. **Results start:** T8 typing shows 3 full rows plus a half.

### Systems' three flags: ruled
- **(a) The list held at its band while the new tag is open: accepted.**
  - The add is what put the list down. Nothing closes it, and it comes
    back when the tag closes.
  - A stub that stays under your thumb is the stronger of the owner's two
    rules at that moment.
  - It goes on my objection list, not to the owner as a question.
- **(b) 89 vs 72, chosen by room: accepted.** The 375x629 case at 2.9
  rows is an iPhone check.
- **(c) Lines min-height 32, growing: accepted as the spec.**
  - The owner's own rule is "long notes should just show full length", so
    one still should show it.
  - T4 is being re-shot anyway (below), so its note goes to two lines.
  - No new still.

### Mechanical re-shoots (I check them before the send; no re-score)
1. **The stub's foot clears the map credit.**
   - In T3, T4 and T5 the "Leaflet | © OpenStreetMap" box touches or
     overlaps the stub's bottom edge (foot 588, band 604, credit about 18
     tall).
   - Set the hanging tag's foot to the credit's top − 6 and keep the same
     no-move rule.
   - Re-shoot every hanging-tag frame where they meet: T3, T4, T5 (both
     panels), T6, T7, T8 picked.
2. **T4's note wraps to two lines** (the min-height spec, shown once).
3. **A3-tap typing panel: re-pan** so no pin shows through the eyelet.
   Right now a starred pin's orange star sits in the hole, which reads as
   a starred mark.

### Likely owner objections
- **P:**
  - "a FAB with a stick" (P2 answers);
  - "bigger than other pins";
  - the orange pin vs the orange clusters.
- **A:** "+ on the right; I said left" (in the cost line).
- **The tag:**
  - "ADD isn't orange" (T3 caption);
  - "the list stays down after I add" (flag a);
  - "a guessed type is wrong" (cost line).
- None is likely enough to hold a 9. The one that was likely (spacing) is
  fixed.

### Scores
- **P · Blank pin: 9.**
  - One object from + to place, and his own revived idea.
  - The pin reads as a pin being placed at 1x (P2).
  - The form now looks like the real tag before and after.
- **A · Header tag: 9.**
  - The same form, with the only trigger that has no extra step (A4).
  - The tag pulls up out of a tag.
- **Float frame (A5):** clean.

### FINAL SEND (one message, in this order; after re-shoots 1-3 are checked)
**P · the blank pin**
1. P1-rest-vs-today
2. P2-1x-pin-or-button
3. P3-tap
4. P4-tag-open. Cost: "One extra tap to add while a place's tag or the
   filters are open."
5. P5-sizes (320 + list down)

**A · the header tag**
6. A1-rest-vs-today. Cost: "The list title is 32px shorter; the + is on
   the right."
7. A2-1x
8. A3-tap
9. A4-tag-open

**The blank tag (both packages)**
10. T0-pencil-vs-greyed-1x
11. T2-blank-and-no-results
12. T1-typing
13. T3-picked
14. T4-starred-visited (two-line note)
15. T5-ink-over
16. T6-district
17. T7-questions
18. T8-320

**Float**
19. A5-float-frame

**Cost line for the tag:** "TYPE is a guess from OpenStreetMap (or your
last type), in pencil; tap to change it. It can only be checked on your
iPhone."

**Held back:**
- P6 (pressed + "also tried" pocket): only if he asks.
- raw/, pass-a-check/, sketches.

**Owner questions, with the send:**
1. While adding, mark it visited too (VISITED on the blank tag)?
2. Fix a place after adding by opening its tag in pencil again?
3. Skip ADD: picking a result saves the place, with Undo?
4. Later, place a pin by dragging it onto the map or holding the map?
5. Just so you know: on the tag, ADD is navy, because orange on a tag
   means starred.
6. Just so you know: the blank pin needs one extra tap while a tag or the
   filters are open; the header tag doesn't.

### Did the work change?
Yes:
- spacing;
- ADD by the top;
- T5;
- crops;
- the results rule.

P and A go 8 → 9 on the re-shot stills.

### Round 8b re-shoots checked -- SEND RELEASED (2026-10-14)
- Checked at phone size: T4, T5, A3-tap.
  - The tag's foot is clear of the credit in T4 and T5.
  - T4's note wraps to two lines, as it should.
  - A3-tap's eyelet is clear (a sliver of a pin behind the tag's top
    edge is acceptable).
- Coverage check passed (`concepts/coverage-r8.md`).
- Scores stand: P 9, A 9.
- The send is released as listed under "FINAL SEND" in round 8b, with
  19 stills, the three cost lines and the six owner questions.

### Send held for one fix: Sundhöllin's TYPE (2026-10-14)
- "NATURE" for a swimming pool is an accident of the demo. It isn't
  what the spec's mapping would produce, and in the hero stills it reads
  as a bad guess.
- **Ruling:** the builder table maps OSM `leisure=swimming_pool` (and
  `sports_centre`) to **Attraction**.
- **Visual:** re-shoot every still showing Sundhöllin's TYPE or its
  landed pin as ATTRACTION:
  - T3, T4, T5 (both panels; the "after" pin becomes the attraction pin);
  - T8 picked;
  - A5;
  - plus any other frame that shows it.
- No re-score. I check the re-shoots, then the send goes as listed.

### TYPE fix checked -- SEND RELEASED, final (2026-10-14)
- Checked T5, A5 and P5:
  - Sundhöllin is ATTRACTION throughout.
  - T5's landed pin is the attraction pin.
  - P5's 320 panel is re-centred, with nothing under the account badge
    or the blank pin.
- Water parks were added to the Attraction mapping row (spec only).
- The 19-still send stands exactly as listed in round 8b (same files,
  same order), with the same cost lines and the same six owner
  questions.

## Concept round 9 -- director, 2026-10-14 (C pin+tag button; A header tag; shared form with the fallback model)

### Evidence
- At phone size first:
  - C1, C2 (1x + blurred), C3, C6 (pressed);
  - T5, T7, T9;
  - A3/A5 as re-shot.
- Then `C-pintag/how-it-works.md` for coverage, and systems' questions.

### The standard I'm scoring against
On round 8b he said "Blank pin looks ugly" about a 9 that passed every
metric. So: it looks at home beside the app's pins and the account
badge first; rank second; metrics last.

### Likely owner objections, named first
1. **C: "what's the dark block?"** LIKELY.
   - The navy ADD slot on the button's stub carries the rank: 1.4x with
     it, 0.85x without.
   - At 1x (C1, C2) it's an unlabelled navy rectangle at the tag's
     corner. It's a fragment of the form's ready-ADD state, borrowed
     without its label, so it reads as noise ("no dots/decoration that
     adds noise").
   - It's rank bought by accretion again, P's mistake in a different
     form.
2. **C: "the pin doesn't look like a pin."** LIKELY, and his R5b words.
   - The app's pins are a coloured ring with a glyph on paper; the
     selected one is filled *with its glyph*.
   - A solid orange disc with nothing in it, beside 15 real pins in C1,
     reads as a ball or a dot on a stick.
   - "Blank" has to read as an *empty pin*, not as no pin.
3. **C: "busy" / "ugly".** POSSIBLE. Four parts at 1x: ball, string, tag
   with a +, block.
4. **C covers a place in about 1 street view in 4** (twice the Float).
   POSSIBLE. It's honest in the cost line.
5. **The form:** none likely now.
   - T9 is the answer to "buttons aren't reading like buttons": city and
     TYPE are the filter chips, ADD is navy, and STAR/VISITED are the
     real segments.
   - T7's answers in the stub read as the next action.
   - The map still while filling, then one flight on ADD (T5): it reads.

### Scores
- **C · Pin+tag: 7.**
  - The *idea* is right and is his.
  - The tag now reads as a tag at 1x (chamfers, eyelet, notches,
    perforation survive), and the + on the tag answers R4.
  - But objections 1 and 2 are likely, and both are about the resting
    object, the one thing the round is for.
- **A · Header tag: 9 on the concept**, with the shared form now
  fixed in look. It's held only by the two spec bugs below (mechanical,
  they change stills). A doesn't go alone: he asked for C, so they go
  together.
- **Float frame (A5):** fine.

### Rulings on systems' questions
1. **Control rows:**
   - The chip rows (address·city, TYPE) are 40px, and the NOTES row
     stays 32.
   - Tap areas never overlap and are never clipped below 40.
   - The look barely changes (+16 on the tag).
2. **C's coverage, 1 in 4 street views:** accepted as a cost line in
   plain words. It's one more reason the button must not get bigger to
   find rank.
3. **Credit hidden whenever the tag is up: a bug.**
   - OpenStreetMap credit stays visible in every state. The tag's foot
     clears it, as in 8b.
   - Re-shoot every frame where it's missing (T5 before, T7 both, and
     any other).
4. **Chip hit areas overlapping × / NOTES:** fixed by ruling 1.

### Fixes (one batch)
1. **C: rank from the object's form, not an added block.**
   - Drop the navy slot from the button's stub.
   - Find the 1.2x in what the object already is: the +'s weight and
     size, the tag's proportion within today's footprint (no bigger, see
     coverage), the pin.
   - Systems re-measures.
2. **C: the pin must read as one of the app's pins at 1x.**
   - Use the app's pin grammar (the ring/face/glyph family), in the
     action orange, so a stranger looking at C1 says "that's a pin".
   - "Blank" = an empty pin, not a dot.
   - One + on the whole object (pin or tag: visual's call).
3. **C: show the R6 arrangement as the one "also tried"** (the + on the
   pin, blank tag), with today's tag. It's literally the version he asked
   to revisit, so he should see it beside the pick.
4. **Every C frame at 1x beside the real pins and the account badge,
   before any squint.** The first question I'll ask is "does it look at
   home?"
5. **Form spec bugs:** rulings 1 and 3. Re-shoot T5 (before), T7, T9,
   and any frame missing the credit.

### What keeps blocking a 9 across rounds (R4 → R9)
- The resting + has to do three things at once:
  - read as what it is (pin / tag / badge);
  - read as a button;
  - outrank the account.
- Every time one fails, we've rescued it by *adding mass*: a bigger disc
  (P), an orange flood (R5b), a navy block (R9).
- Mass wins the squint and costs the look or the meaning, and he
  rejects it each time ("same weight", "ugly", "doesn't look like a
  pin").
- **Why it keeps happening:** the squint test is the one thing we can
  measure, so we optimise it. Rank has to come from a *clear
  silhouette* instead: one object, recognisable at 1x, with its one +
  as the strongest ink.
- I'll score the 1x look before I open a squint number.

### Did the work change?
Yes, all new: the C object, the fallback model, stub answers, T9.

## Concept round 9b -- director, 2026-10-14 (C redrawn: a sideways blank tag pinned through its eyelet; the form re-shot)

### Real-size look first
- Evidence: C1 (1x), C3 rest vs today, C2 also-tried, C8 pressed, C5
  tap.
- Then the form: T7 re-shot, with the credit visible and 40px chip rows.

**C at 1x:**
- **The best-looking resting object this crew has made.**
  - One clear silhouette.
  - The tag reads as a luggage tag at once: the pointed end, the
    perforated stub and the notches all survive.
  - The + is the strongest ink.
  - No block, nothing inflated.
  - It sits beside the real pins and the account badge without
    shouting. "Rank from form" worked: 1.23x / 1.15x.
- **But two things it says at 1x aren't what it means:**
  1. **"O+".** An empty ring followed by a + on a label reads as the
     blood type at phone size (C3 right, C1). It's a real word, and it
     arrives before "pin". LIKELY to be the owner's first reaction.
  2. **The pin reads as the tag's eyelet,** an orange grommet, not one
     of the app's pins pushed through it.
     - It's flat, printed on the paper, with no glyph. The app's pins
       are recognised by their glyph, and a blank pin has none.
     - This is the third round in a row a glyph-less pin has read as
       something else (a ball in R9, an eyelet now; P's disc before
       that). It's his R5b "the pin doesnt look like a pin" again.
     - LIKELY.

### Likely owner objections, named first
1. "It says O+." (LIKELY)
2. "That's a ring/eyelet, not a pin." (LIKELY)
3. "Covers places at street zoom" (7-26%; it's the cost line).
   POSSIBLE.
4. The button tag lies sideways and the form tag hangs upright.
   POSSIBLE; the C5 motion answers it (it comes off the pin and rises).

### Scores
- **C · Pin+tag: 8 (from 7).**
  - The silhouette, the tag and the rank are solved.
  - The pin's identity, and the "O+" it makes with the +, are not. One
    focused fix.
- **A · Header tag: 9.** The form's re-shoots are clean: the credit is
  visible in T7, the chip rows are 40, and the answers sit in the stub.
  It waits for C.

### Rulings on systems' items
- **Raise C 6px off the credit:** yes.
- **Tap areas clipped to their own row:** yes. That closes the ×/NOTES
  overlap.
- **Coverage 7-26%:** cost line, in plain words: "At street zoom it
  sometimes sits on a place; pan the map to uncover it."

### Fix (one; then I re-score from the C stills only)
**The pin is the glyph's job.**
- A blank pin has no identity in this app; its glyph is what makes a pin
  a pin. So the direction to test first:
  - keep the pick's sideways tag exactly (silhouette, size, rank);
  - put the **+ on the pin as its glyph** (the app pin's ring/face +
    glyph grammar, in the action orange);
  - leave the tag blank.
- That's one +, it kills "O+", and the pin reads as one of the app's
  pins with the tag being the blank you'll fill. It's also the
  arrangement he asked to revisit (R6), on the tag that now works.
  Systems' also-tried number (1.26x) says rank survives.
- If visual has something that beats it at 1x, show it, but the test
  is fixed:
  - (a) a stranger at 1x names a pin and a tag;
  - (b) nothing on it reads as a word or a symbol (O+, ♀);
  - (c) it beats the account (≥ 1.2x);
  - (d) the footprint is no bigger.
- Re-shoot C1, C3, C4, C5 (rest), C7, C8. C2 becomes "also tried" = this
  round's ring + "+" pick.

### What keeps blocking a 9 (updated)
- Rank by mass is solved this round: rank came from form.
- **What's left is the pin's identity at small size.** Every glyph-less
  "blank" pin has read as something else (a FAB/ball, an eyelet, an
  O). In this app a pin is a ring *plus a glyph*. "Blank" has to mean
  "no type yet", with the + as the glyph, not "no mark".

### Did the work change?
- Yes. C is a new object; the form is re-shot.
- C goes 7 → 8 on real change. A stays 9.

## Concept round 9c -- director, 2026-10-14 (C: the + as the pin's glyph, a blank ruled tag)

### Real-size look first
Evidence: C1, C3, C4, C8, C2, C6, C7.
- At 1x (C1, C3), a stranger names it:
  - an orange pin with a +, pushed through the end of a blank luggage
    tag with two lines to write on.
- "O+" is gone, and so is the eyelet misread.
- The pin is one of the app's pins in the action orange: the selected
  pin's filled face, with the + where every pin's icon goes. It means "a
  place still to add".
- One silhouette, one +, nothing added to carry rank. Pressed (C8)
  follows the orange-action grammar.
- It looks at home beside the real pins and the account badge. That's
  the bar he set with "ugly", and it clears it.

### Systems' question
**Accept 1.19x at σ8 (1.24x at σ4).** No 6px stroke.
- A heavier + inside a 40 disc starts to look crude, and I don't trade
  the look for the metric (the round-8b lesson).
- It's a different object, bigger and at a different place from the
  account, so it doesn't share the account's weight-and-hierarchy row
  as the old badge did.

### Likely owner objections
1. "Why sideways? I meant the pin with the tag hanging." POSSIBLE.
   - C2 must answer it, so C2 is re-shot (below) to show the R6 hanging
     arrangement beside the pick.
2. "It sits on places at street zoom." POSSIBLE. It's the cost line.
3. "The pin is bigger than other pins" (40 vs 32). UNLIKELY at 1x.
4. A: "+ on the right." POSSIBLE. It's the cost line.
- None is likely.

### Scores
- **C · Pin+tag: 9 (from 8).** The pin's identity is fixed by its
  glyph, and the misreads are gone.
- **A · Header tag: 9** (unchanged).

### Re-shoots before the send (mechanical; I check them, no re-score)
1. **C7:** re-pan both panels. A dotted street-shape line through a
   visited sticker runs right beside the button, which reads as clutter
   next to the thing being judged.
2. **C2 "also tried":** show the pick beside **the R6 arrangement he
   asked about** (the + on the pin, the blank tag hanging below it, at
   real size), with the reason in one line:
   - at that size a hanging tag reads as a box with a hat, and stands
     twice as tall over the map;
   - lying flat, it reads as a tag.
   - The "O+" panel isn't needed.

### FINAL SEND (after re-shoots 1-2 are checked), in this order

**C · the pin and its blank tag**
1. /home/user/triplet/design/add-button-placement/concepts/C-pintag/C3-rest-vs-today-3x.png
2. /home/user/triplet/design/add-button-placement/concepts/C-pintag/C1-real-size-3x.png
3. /home/user/triplet/design/add-button-placement/concepts/C-pintag/C4-squint-1x.png
4. /home/user/triplet/design/add-button-placement/concepts/C-pintag/C2-also-tried-3x.png
5. /home/user/triplet/design/add-button-placement/concepts/C-pintag/C5-tap-3x.png
6. /home/user/triplet/design/add-button-placement/concepts/C-pintag/C6-tag-open-3x.png
7. /home/user/triplet/design/add-button-placement/concepts/C-pintag/C7-sizes-3x.png

**A · the header tag**
8. /home/user/triplet/design/add-button-placement/concepts/A-header-tag/A1-rest-vs-today-3x.png
9. /home/user/triplet/design/add-button-placement/concepts/A-header-tag/A2-1x-3x.png
10. /home/user/triplet/design/add-button-placement/concepts/A-header-tag/A3-tap-3x.png
11. /home/user/triplet/design/add-button-placement/concepts/A-header-tag/A4-tag-open-3x.png

**The blank tag you fill (both)**
12. /home/user/triplet/design/add-button-placement/concepts/blank-tag-form/T2-blank-and-no-results-3x.png
13. /home/user/triplet/design/add-button-placement/concepts/blank-tag-form/T1-typing-3x.png
14. /home/user/triplet/design/add-button-placement/concepts/blank-tag-form/T3-picked-3x.png
15. /home/user/triplet/design/add-button-placement/concepts/blank-tag-form/T9-tappables-3x.png
16. /home/user/triplet/design/add-button-placement/concepts/blank-tag-form/T7-questions-3x.png
17. /home/user/triplet/design/add-button-placement/concepts/blank-tag-form/T4-starred-visited-3x.png
18. /home/user/triplet/design/add-button-placement/concepts/blank-tag-form/T5-ink-over-3x.png
19. /home/user/triplet/design/add-button-placement/concepts/blank-tag-form/T6-district-3x.png
20. /home/user/triplet/design/add-button-placement/concepts/blank-tag-form/T8-320-3x.png
21. /home/user/triplet/design/add-button-placement/concepts/blank-tag-form/T0-pencil-vs-greyed-1x.png

**Float (the same tag from the badge)**
22. /home/user/triplet/design/add-button-placement/concepts/A-header-tag/A5-float-frame-3x.png

**Held back:** C8 (pressed), r9-check/, raw/.

**Cost lines:**
- **C:** "One extra tap to add while a place's tag or the filters are
  open. Zoomed in to street level it can sit on a place; move the map
  to uncover it."
- **A:** "The list title is 32px shorter, and the + is on the right."
- **The tag:**
  - "TYPE is filled in as a guess (from OpenStreetMap, or your last
    type), in pencil; tap to change it. Only your iPhone can check the
    guesses."
  - "After you add, the list stays down until you close the new tag, so
    the button you just tapped doesn't move."

**Owner questions:**
1. When you add a place, do you want to be able to mark it visited at
   the same time?
2. Should you be able to fix a place later by opening its tag back up in
   pencil?
3. Should picking a search result save the place straight away (with
   Undo), with no ADD tap?
4. Later on, would you want to place a pin by dragging it onto the map,
   or by holding a spot on the map?
5. Just so you know: on the tag, ADD is navy, because orange on a tag
   already means starred.
6. Just so you know: the pin-and-tag button needs one extra tap while a
   place's tag or the filters are open; the header tag doesn't.

### What blocked a 9, and what unblocked it
- **Rank by mass:** R4-R9. Solved in 9b by form.
- **The pin's identity:** R9-9b. Solved in 9c by the glyph: in this app
  a pin is a ring/face plus a glyph.

### Did the work change?
Yes: the + moved onto the pin, and the tag is blank and ruled. C goes
8 → 9.

### Round 9c re-shoots checked -- SEND RELEASED (2026-10-14)
- **C2:** now the pick beside the hanging arrangement he asked about,
  with the one-line reason. Clean.
- **C7:** re-panned. Nothing beside the button; one pin peeks behind
  the zoom control at 320, which is real app behaviour and acceptable.
- The 22-still send stands exactly as listed in round 9c, with its cost
  lines and six owner questions.

## Concept round 10 -- director, 2026-10-14 (the final call: Float vs C; the form, revised)

### Signal from the turned-down 9 (A, cut)
"It conflates that bar with list actions and global actions (e.g. i
could be adding to any city not just the one showing)."
- I scored A's *look* and its exception-free reach, and missed its
  *scope*: a global action placed in local chrome.
- Job 5 ("+ is for the whole trip") now says that, and I score
  placement against scope from here on.

### Real-size look first
**C, the team's pick (#2: cream tag, navy +, orange claim-check end).**
Evidence: C2, R5, C0, C4.
- At 1x it reads as a tag and as a button. The tear-off story in C4
  (the orange end tears off and the tag becomes your form) is charming.
- **But the colour is on the part that does nothing.**
  - The orange slab is the empty end, and the + sits on quiet cream.
  - That's his own "colour with personality on the thing that matters…
    Directions feels unnecessarily orange".
  - And it's two colour fields plus a mark, where he asked to *simplify*.
- **R4 right (#7: the whole tag in the action orange, navy +)** is the
  simpler, stronger object.
  - One shape, one colour, one mark. The tag *is* the button, as he
    said.
  - It reads as a control at once, and it uses exactly the Float's ink
    (orange, navy +).
  - So his final call becomes purely about shape, badge vs tag, which is
    the fairest comparison we can give him.
  - My earlier rule "orange paper = starred" is mine, not his, and is
    about place tags on the map. A button isn't one; his old orange +
    badge already established orange = add.
- **Float.** Evidence: C0 left, F4. As complete as he said: orange
  scalloped badge, navy +, bottom-left. It now opens the same blank tag.

**The form.** Evidence: R10-F1, F2, F5.
- Unpinned: the map is washed back and the tag is a card in the visual
  middle, with every line there from the start.
- Pinned once there's an address: the wash lifts, and the place's own
  pin stands above on its string.
- TYPE is a row of the app's own pins: tap one and that's your pin.
  That's the right answer to "dropdowns very awkward": no dropdown at
  all, and the choice *is* the outcome.
- City is a tappable word whose list prints on the tag.
- "Search everywhere" serves job 5.
- Nothing saves without ADD.
- It answers every note he gave.

### Likely owner objections
1. **C as picked: "why is the end orange and not the button?"**
   LIKELY. Fixed by making #7 the pick.
2. **Float vs C "look the same weight".** POSSIBLE. That's the choice
   he's making; C0 shows it.
3. **The form: the TYPE row's last pin clipped at the tag's edge**
   (F2, F5). POSSIBLE.
   - It's a scroll row (9 types), so the cut must read as "more this
     way", not an error.
   - Keep a clear half-pin with a soft fade, as his "half second list
     item" rule.
4. **The dotted street-shape line by a sticker at the bottom right**
   (F2, F5). Clutter in a hero frame. LIKELY to catch his eye. Re-pan.

### Scores
- **Float: 9.**
- **C: 8 as picked (#2). It goes to 9 on one swap:** #7 becomes the
  pick, and #2 leads the "also explored".
- **The form: 9** after the re-pan of F2/F5 (mechanical).

### Fixes (re-shoot; I check, then release)
1. **C's pick = #7 (orange tag, navy +, the tag as the button).**
   - Re-shoot C0, C1, C2, C3, C4 (rest and the tear-off), C6 and C7
     with it.
   - The tear-off in C4 still works: the claim-check end is the part
     that comes away.
   - Systems re-measures rank and coverage.
2. **"Also explored" = R1 (the eight ways at real size) + R2 + R3 + R4,**
   so he sees colour wasn't assumed ("don't assume a color… explore").
   - Re-caption R1 with #7 marked "the pick" and #2 marked "the
     runner-up (the claim-check end in orange)".
   - No other changes.
3. **The form:**
   - re-pan R10-F2 and F5 off the dotted line;
   - make the TYPE row's cut a deliberate half-pin with a fade.

### Send (after fixes 1-3 are checked), in this order
**The choice**
1. /home/user/triplet/design/add-button-placement/concepts/C-tag-r10/C0-two-options-3x.png

**C · the tag is the button**
2. /home/user/triplet/design/add-button-placement/concepts/C-tag-r10/C1-rest-vs-today-3x.png
3. /home/user/triplet/design/add-button-placement/concepts/C-tag-r10/C2-real-size-3x.png
4. /home/user/triplet/design/add-button-placement/concepts/C-tag-r10/C3-squint-1x.png
5. /home/user/triplet/design/add-button-placement/concepts/C-tag-r10/C4-tap-3x.png
6. /home/user/triplet/design/add-button-placement/concepts/C-tag-r10/C5-tag-open-3x.png
7. /home/user/triplet/design/add-button-placement/concepts/C-tag-r10/C6-sizes-3x.png

**C · also explored (colour)**
8. /home/user/triplet/design/add-button-placement/concepts/C-tag-r10/R1-eight-ways-real-size-3x.png
9. /home/user/triplet/design/add-button-placement/concepts/C-tag-r10/R2-paper-and-two-end-3x.png
10. /home/user/triplet/design/add-button-placement/concepts/C-tag-r10/R3-ticket-and-punch-3x.png
11. /home/user/triplet/design/add-button-placement/concepts/C-tag-r10/R4-solid-tags-3x.png

**Float · the badge**
12. /home/user/triplet/design/add-button-placement/concepts/E-float/F1-rest-vs-today-3x.png
13. /home/user/triplet/design/add-button-placement/concepts/E-float/F2-real-size-3x.png
14. /home/user/triplet/design/add-button-placement/concepts/E-float/F3-squint-1x.png
15. /home/user/triplet/design/add-button-placement/concepts/E-float/F4-tap-3x.png
16. /home/user/triplet/design/add-button-placement/concepts/E-float/F5-tag-open-3x.png
17. /home/user/triplet/design/add-button-placement/concepts/E-float/F6-sizes-3x.png

**The form (both)**
18. /home/user/triplet/design/add-button-placement/concepts/blank-tag-form/R10-F1-unpinned-3x.png
19. /home/user/triplet/design/add-button-placement/concepts/blank-tag-form/R10-F2-pinned-3x.png
20. /home/user/triplet/design/add-button-placement/concepts/blank-tag-form/R10-F5-city-3x.png
21. /home/user/triplet/design/add-button-placement/concepts/blank-tag-form/R10-F3-pinned-starred-3x.png
22. /home/user/triplet/design/add-button-placement/concepts/blank-tag-form/R10-F4-320-3x.png

**Held back:**
- C7 and F7 (pressed);
- R5 (it duplicates C2 once #7 is the pick);
- E1-E8 (round 7);
- r10-check/.

**Cost lines:**
- **C and Float:** "Either one steps aside while a place's tag or the
  filters are open: one extra tap to add then."
- **C:** "Zoomed in to street level it can sit on a place; move the map
  to uncover it." (Systems re-measures it for #7.)
- **The form:** "TYPE is guessed (from OpenStreetMap, or your last type)
  and shown as the pin you'd get; tap another pin to change it. Only
  your iPhone can check the guesses."

**Open question, with the send:**
- When you add a place, do you want to be able to mark it visited at
  the same time?

**Recorded from his answers (not asked again):**
- edit-after-add is a future update;
- nothing saves without an explicit ADD;
- hold-to-place is future, with real maps.

### What keeps blocking a 9 (updated)
- **Mass:** solved (R9b).
- **Pin identity:** solved (R9c). Now moot: no pin on the button.
- **Scope:** new. A failed on what the action *is* (global vs local).
- **This round:** colour put on the part that doesn't matter. It's the
  same root as the mass problem: weight added to win the squint
  instead of putting the emphasis where the meaning is.

### Did the work change?
Yes, all new: A is cut, C is simplified (eight ways), Float carries the
new form, and the form is revised to his notes.

### Round 10c -- #7's width ruled; caption corrected (2026-10-14)
- **Width: 84** (84 × 44).
  - At 104, #7 is 4x the account and 3x the Float. C0 shows it: next to
    the Float it's simply *bigger*, so his "final call" would be about
    size as well as shape. That's rank bought by mass, the pattern he
    has rejected every time.
  - At 84 it's 2.0x the Float, its street-zoom coverage equals the
    Float's (12-16%), and 44 tall is the tap target with no invisible
    padding.
  - 78 would need padding and gains little.
- **#7 at 84 holds at 9**, judged on the re-shot look. The same ink and
  near-equal footprint make the C0 comparison pure shape.
- **Watch, not a fix:** in C5 the orange button sits under a starred tag
  (orange band). At 84 the collision shrinks, and the + keeps it a
  control.
- **Cost line corrected (my draft was wrong):** "Either one is hidden
  while the filters are open: one extra tap to close them first. With a
  place's tag open it stays tappable; adding closes that tag, and
  cancelling brings it back."
- **Re-shoot at 84:** C0 (also fix its caption: "both step aside the
  same way" → "both open the same blank tag; both hide only while the
  filters are open"), C1, C2, C3, C4, C5, C6.
  - R1/R4 stay as they are: they show the variants at the study size,
    and the colour is the point.
- The release follows my check of those re-shoots. The send list is
  unchanged from round 10.

### Round 10c re-shoots checked -- SEND RELEASED (2026-10-14)
- **C0-C6 at 84:**
  - C0's caption is correct.
  - Next to the Float it's the same ink at a near-equal size, so the
    choice is pure shape.
  - C5's button sits clear under the starred tag.
- **R10-F6** (ADD before/after) is clean. The stub holds its place and
  nothing flies.
- **Scores stand:** Float 9, C (#7 at 84) 9, the form 9.
- **The send is 23 stills,** in round 10's order, with R10-F6 placed
  after R10-F3 and before R10-F4. It carries the round-10c cost lines
  and the one open question (visited-while-adding).

## Concept round 11 -- director, 2026-10-15 (C iterated: narrower, smaller +, hole back; two colourways)

Owner, verbatim: "Let's iterate the tag a bit before I make a call. The tag is too wide and the plus is too large. Balance feels off. I feel like both sides could get narrower. Also I miss the hole. I think in the smaller arrangement I'd like to see orange tag as well as cream with orange claim check edge"

### Real-size look first
Evidence: C0, C2, K1, K2, K3, S1, C6, C4.

**Orange tag, 70 × 43, + at 18, the hole back (the lead):**
- At 1x it's a luggage tag at once:
  - the pointed end with its hole;
  - the +;
  - the perforation and the claim-check end.
- The parts sit in even thirds, so the balance he felt was off is
  fixed. Both sides are narrower, and the + no longer crowds the tag.
- Beside the Float in C0 the two are now the same size, so his call is
  shape alone.
- 2.12x the account and 1.58x the Float. Coverage is at or under the
  Float's.
- The hole at 1x is a small pale ring. It's quiet, but it's there, and
  it's what he asked for.

**Cream with the orange claim-check end, the same tag:**
- It looks right: the warmest, most "tag" of the two.
- But at 0.59x the account it comes second to the account badge. That's
  his own round-5b objection ("same weight and hierarchy as account,
  which it shouldnt be"), here even lower.
- He asked to see it, so it goes. Its cost is said plainly, not hidden
  and not fixed by inflating it.

**S1 (four proportions):**
- It shows the narrowing was explored, not guessed.
- Golden (the lead) and Compact are close.
- Slim's + is too small, and Squat loses the claim-check proportion.

### Likely owner objections
1. "The cream one is too quiet." LIKELY. It's the cost line.
2. "The hole reads as a dot." POSSIBLE at 1x. On the orange tag it's a
   ring showing the map through it, which is the shipped tag's hole
   logic.
3. "Now it's the same size as the badge, so which?" That's the point
   of C0: his call.
- Nothing likely holds the orange lead under 9.

### Scores
- **C, orange tag (the lead): 9.**
- **C, cream with orange end:** shown as he asked, with its cost. Not a
  9 on rank, by his own rule; I'm not recommending it.
- **Float 9 and the form 9:** unchanged, not re-sent.

### Send (this iteration plus the choice frame), in order
1. /home/user/triplet/design/add-button-placement/concepts/C-tag-r11/C0-two-options-3x.png
2. /home/user/triplet/design/add-button-placement/concepts/C-tag-r11/K1-two-colourways-3x.png
3. /home/user/triplet/design/add-button-placement/concepts/C-tag-r11/C2-real-size-3x.png
4. /home/user/triplet/design/add-button-placement/concepts/C-tag-r11/K2-cream-real-size-3x.png
5. /home/user/triplet/design/add-button-placement/concepts/C-tag-r11/S1-proportions-real-size-3x.png

**Held back:**
- C1, C3-C7: unchanged in kind from round 10 and covered by C0/C2.
- K3: duplicates K1.

**Cost lines:**
- "The cream tag is quieter than the account badge: at a glance your
  eye goes to the account first. The orange one comes first."
- "Either button is hidden while the filters are open: one extra tap to
  close them first."

**Visited-while-adding:**
- Not re-asked. He has said "not sure" and it's been asked twice.
- The form as sent keeps MARK VISITED on the blank tag's stub (one tap,
  optional, the real stamp).
- It's settled at handoff unless he raises it.

### Did the work change?
Yes:
- new proportions (70 × 43);
- a smaller +;
- the hole back;
- the cream colourway added.

C's orange lead stays at 9 on real change.

## Concept round 11b -- director, 2026-10-15 (C turned 90°)

Owner, verbatim: "Let's try it turned 90 degrees too"

### Real-size look first
Evidence: V2 (choice), V1, V5.
- **Upright, hole up, claim-check end down (43 × 70):** the best read of
  the three.
  - It *is* the place's tag, hanging: eyelet up, stub down. That's the
    owner's "pin and what it opens are one idea" without drawing a pin.
  - Tap-to-form becomes a pure grow, with no rotation. It's simpler.
  - Same weight as flat (2.12x).
- **Hole-down:** reads as a price label. Rightly not the lead.
- **Cream upright:** the same 0.59x cost as flat.

### The list-row cost: not accepted at 43 × 70
- To stay tappable under an open place tag, the list drops 105px, and at
  664 it shows 2 rows instead of 3.
- His rule: "we should show the list header, one list item, half second
  list item … the list item in view should be the one selected". Two
  rows is a real loss on the screen he uses most.
- Stepping aside under a tag would bring back an exception we've told
  him is gone. No.
- **Call:** visual frames the shorter upright **36 × 58** (the same
  proportions, + ~15) as **V7**. It sits at real size beside 43 × 70,
  in the orange colourway, plus one tag-open frame at 664 showing 3
  rows.
- Systems measures its weight. **It must stay ≥ 1.2x the account and
  read as the tag at 1x** (eyelet, perforation, end all visible).
  - If it holds, 36 × 58 is the upright, with no row cost.
  - If it doesn't, 43 × 70 goes with the cost line: "With a place's tag
    open, the list shows 2 rows instead of 3 on a typical phone."

### Scores
- **C upright (orange, at whichever size passes the V7 check): 9.**
- **C flat (orange, 70 × 43): stays 9.**
- **Cream (either way):** shown with its cost; not recommended.

### Send (lean; after V7 is checked), in order
1. /home/user/triplet/design/add-button-placement/concepts/C-tag-r11/V2-choice-3x.png (re-shot with the chosen upright size if it changes)
2. /home/user/triplet/design/add-button-placement/concepts/C-tag-r11/V1-upright-options-real-size-3x.png
3. /home/user/triplet/design/add-button-placement/concepts/C-tag-r11/V5-upright-colourways-3x.png
4. /home/user/triplet/design/add-button-placement/concepts/C-tag-r11/V7-short-upright-3x.png (new; sent only if 36 × 58 is the pick)

**Held back:** V3, V4, V6 and the round-11 flat set (he has them).

**Cost lines:**
- "The cream tag is quieter than the account badge; the orange one
  comes first."
- "Any of them is hidden while the filters are open: one extra tap to
  close them first."
- Plus the 2-rows line, only if 43 × 70 stays.

### Round 11b checked -- upright 36 × 58 picked; SEND RELEASED (2026-10-15)
- **V7 at 1x:** the hole, the +, the dotted line and the end all read.
  It's the same tag a size down, not a shrunk one.
- **Systems:**
  - 1.45x the account and 1.08x the Float, so it sits beside the badge
    at nearly the same weight and his call is about shape;
  - the lowest coverage of any C (9/10/12/2%);
  - the credit is clear;
  - the tag-open gap of 90 keeps 3 rows at 664;
  - a 44 × 58 tap area;
  - the only exception is open filters.
- **C upright, 36 × 58, orange: 9.** The 2-rows cost line is dropped.

**Send (lean), in order:**
1. /home/user/triplet/design/add-button-placement/concepts/C-tag-r11/V2-choice-3x.png
2. /home/user/triplet/design/add-button-placement/concepts/C-tag-r11/V7-short-upright-3x.png
3. /home/user/triplet/design/add-button-placement/concepts/C-tag-r11/V1-upright-options-real-size-3x.png

**Cost lines:**
- "Each one is hidden while the filters are open: one extra tap to
  close them first."
- "The cream tag is quieter than the account badge; the orange one
  comes first."

### Correction to the 11b send (2026-10-15)
- V5 wasn't in the send, but the orchestrator's check exposes a gap.
  The cream upright appears only at 43 × 70, which is no longer the
  pick. V1 has the same problem (it labels 43 × 70 "the lead").
- **Re-shoot V5 at 36 × 58, both colourways.**
- That V5 replaces V1 in the send. Hole-down was already ruled out, so
  V1 isn't needed.

**Send (lean, final), in order, after I check the V5 re-shoot:**
1. /home/user/triplet/design/add-button-placement/concepts/C-tag-r11/V2-choice-3x.png
2. /home/user/triplet/design/add-button-placement/concepts/C-tag-r11/V7-short-upright-3x.png
3. /home/user/triplet/design/add-button-placement/concepts/C-tag-r11/V5-upright-colourways-3x.png (re-shot at 36 × 58)

The cost lines are unchanged.

### V5 re-shoot checked -- 3-still send RELEASED (2026-10-15)
- V5 is at 36 x 58 in both colourways, with honest weights in the caption.
- The send is V2, V7, V5, with the 11b cost lines.
