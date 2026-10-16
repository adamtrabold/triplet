# Icon concepts: director scores

## Round 1 (t4 cards), 2026-10-15: NOT READY, one short fix pass

Scored in one pass, the strips card first. I read all six cards at phone
size (cards 0, 1, 2, 4 and 5 whole; card 3 in two halves) and the build
tests in jam turn 4.

**My bias check, from turn 3.** For every concept, in this order:
1. Does it read at real size?
2. Does it cover what he saved?
3. Is it one family?
4. Only then, wit.

I looked for places where I'd prefer the trip object on a tie. I didn't
find one. On card 0, the common-sign strip is the calmer of the two, and I
say so rather than argue for strip 2. The ticket, the coffee pot and the
hot spring (the clever ones I'd have liked) failed the real-size test, and
they're off, correctly.

| Card | Score | Why |
|---|---|---|
| 0 Strips | **9** | His question in his words, the same build quality in both strips (checked first), the same rows and map, and it asks nothing. It's a fair test of novelty by eye. |
| 1 Food and drink | **9** | Clear pairs. The facts are his own saved places. The restaurant second is honestly labelled. The bar's 8-of-12 fact lets his pick answer the naming question. |
| 2 Sights, outdoors, shops | **8** | The peaks don't read as peaks, and one row is missing its city. |
| 3 Parts of town, hotel, other | **8** | Two padded seconds aren't labelled as weaker, and the fountain has a misread the card doesn't name. |
| 4 Tools | **8** | Job gaps: the marks and furniture that stay, and Plans' + and ×. The bin's "could be" line is a cost, not a misread. |
| 5 Dropped | **9** | Every kill, with a reason he can argue with. |

### Likely owner objections

1. **"Those aren't mountains."** Nature B is a single rounded mound on a
   base line. At 24px it reads as a sunrise or a hat, not peaks. *Likely*:
   nature is a real choice for him (Iceland), so he'll look hard.
2. **"Why show me that?"** District B (the solid parcel: a "D", a pill, a
   shield) and area B (the fountain) are seconds that exist so every place
   has two. Restaurant and hotel say "we'd keep…"; these two don't.
   *Likely.*
3. **"Is that an anchor?"** The fountain reads as an anchor or an upload
   arrow in a bowl at 24px. The card names only "drinking water".
   *Possible.*
4. **"Gunnuhver, NATURE · (nothing)?"** The row has no city. A
   wrong-looking row makes a still feel unfinished. *Possible.*
5. **"What about the stars, clusters, numbers?"** The jobs ask whether each
   mark and piece of map furniture is in scope. No card says. *Possible*;
   systems would flag it anyway.
6. Overstating him: none found. Card 0 quotes him in full, and nothing
   turns his examples into rules. Too many questions: no. There are three,
   and two of them are yes/no.

### Fixes

1. **Nature B:** draw it as peaks: two summits on a base, reading as
   mountains at 24px and 12px, still without a sun. Update card 0's strip
   2, card 2 and the map crops.
2. **Gunnuhver row:** show the row as the app would render it. If his row
   has a city, show it. If it's blank in the data, use a nature place that
   has one, and keep Gunnuhver in the fact line.
3. **District B:** add the honest line, the same form as restaurant and
   hotel: "Shown so you can see a second idea; we'd keep the blocks."
4. **Area B (fountain):** its "Could be" becomes "Drinking water, or an
   anchor." No verdict line. If he answers "no" to question 2, it's area's
   own idea, so it stays an option.
5. **Card 4, one "Staying as it is" line** (jobs: marks and map
   furniture): "Staying as they are: the Star, Visited, cluster counts,
   stop numbers, the far pin's ring, the approximate pin's dashed rim and
   the tag's anchor dot. Plans' + and × stay as they are until Plans is
   live."
6. **Card 4, the bin:** "Could be" becomes "Nothing else; but it's heavier
   in every row than the ×." Optional wording; keep the meaning.

After 1–6: systems runs coverage against `jobs.md` on all six cards. Then
I look at cards 2, 3 and 4 (a look, not a re-score). Then it's READY.

### Send (after the fixes, coverage and my check)

As phone-width images, in this order. No canvas.
1. `t4-card-0-strips.png`
2. `t4-card-1-food-drink.png`
3. `t4-card-2-sights-outdoors.png`
4. `t4-card-3-places-of-town.png`
5. `t4-card-4-tools.png`
6. `t4-card-5-dropped.png`

The questions, word for word (2 and 3 also appear on card 3):
1. "For each icon, which concept do you want — or neither?"
2. "Area and district are often the same places (Djurgården,
   Möllevångstorget and Laugavegur are saved as both). Should they share
   one icon?"
3. "Nothing is filed under Other yet. Keep it in the add form, or remove
   it?"

### What's blocking a 9

Not the concepts. It's the card honesty I've flagged since phase 1: a
second option that's there to fill a slot has to say so, and every
visible line (a row, a misread) has to be true at real size. No pattern of
manufactured difference this round. The common signs carry the set, as
he'd expect.

### Did the work change?

This is the first scored round of this step.

---

## Round 1b: fix-pass check (cards 2–4), 2026-10-15: all six at 9

A look, not a re-score. I checked the nature section of card 2, the
district section of card 3 (plus the fountain line in `t4.html`) and the
top and bin sections of card 4, at full size.

- **Card 2: 9** (from 8). The peaks are two summits with a snowcap on a
  base bar. They read as mountains at 24px, at the 12px chip and on the
  map, with no sunrise or image read. The Gunnuhver row now matches his
  data ("Gunnuhver - fumarole", NATURE · REYKJAVÍK).
- **Card 3: 9** (from 8). District B carries "we'd keep the blocks". The
  fountain's "could be" names the anchor.
- **Card 4: 9** (from 8). The "Staying as they are" line opens the card,
  word for word. The bin's line is fixed.
- Cards 0, 1 and 5 hold at 9. Card 0's strip 2 picked up the new peaks,
  and the frame is still fair.

**READY once the systems coverage run comes back with no blockers.** If
coverage finds a blocker, it gets fixed and I look at that card only. The
send order and the three questions are as in round 1 above, unchanged.

---

## Round 1c: coverage-fix check (card 4 and the crisp cuts), 2026-10-15: READY

- **Card 4: 9.** I checked:
  - The account (solid head, open shoulders, on the navy scallop) is in
    the settled strip.
  - The + line is plain and honest: one symbol, told apart by its box. I
    agree with keeping it; a pin-with-+ was dropped for ink.
  - The pointer covers the current plan.
  - Each "staying" item has its reason. The anchor-dot quote is genuinely
    his ("Dot or something in the middle is fine", owner-taste.md, about
    the district/street tag anchor), so it isn't overstated.
- **The crisp cuts on cards 0–3:** the shop door, the plate's name bar,
  the snowcap and the bun's highlight are sharp at 24px in card 0's strip 2.
  No blur reads as a fault now.
- **All six t4 cards are at 9. Coverage is clean. READY.** The send order
  and the three questions are as in round 1, unchanged.

---

## Round 1d: brown-sign rulings (turn 12), 2026-10-15

No re-score. The cards stay at 9. The changes:
- **Street A:** one rebuild of the walker with the street under the
  figure only. It swaps in only if it clearly beats the plain walker at 12
  and 24px. A tie keeps the walker (the common sign).
- **Restaurant B:** the plate is NOT swapped (it clashes with the open
  pin's fill). It goes to the dropped card. The covered dish stays.
- **Attraction B:** the arrow at a disc gets no second build ("open link"
  is a misread in the concept, and the camera is the signs' own choice). It
  goes to the dropped card. The column front stays.
- **Dropped card:** a "From the brown road signs" group: ⌘, lighthouse,
  lookout tower, the wave drink, "?", the plate, the arrow, and the kerbs
  if they tie.
- **Card 2:** a camera fact line ("The US brown road signs use a camera
  for 'viewing area' too.").

The changes are rebuilt on the canvas page "Icon concepts", not as PNGs. I
look at the changed sections there.

---

## Round 2 (t6 cards, the locked list), 2026-10-16: NOT READY, one fix pass

Scored in one pass. I read all five cards at full size (cards 1–3 in
1900px strips), with `t6.html` open for the glyph sources. The rulings
are in jam turn 15.

**Bias check.** As before: real size, then his places, then family, then
wit. The clever ideas I'd have liked are the kringle, skål, the stage
and the carousel. Two of them lose here on real size (the stage, the
carousel as built). The common sign leads wherever it reads: notes,
column front, Ferris wheel, round tree, peaks. The ⌘ leads on Landmark
because it's his own lean and it's the sign's literal meaning, not
because it's clever.

| Card | Score | Based on | Why |
|---|---|---|---|
| 0 The list | **8** | Whole card | Neighbourhood sits under "Settled by your picks", but he never picked the blocks. The new pins carry placeholder colours. There's no all-13 strip in one ink (his original ask, and the only cross-group test). |
| 1 Café, bar, venue | **8** | Café A–C, Bar A–D, Venue A–D, one-ink trio | The concepts are good and honest. But the stage leads while it reads as a stack at 24px. Four weak options are still shown (bun, pint, microphone, stage). The trio rows carry CLEAR/WEAK verdicts. The kringle is never checked against the ⌘. |
| 2 Museum, landmark, attraction | **7** | Museum A–D, Landmark A–D, Attraction A–D, one-ink trios | A false verdict: the carousel and the column front are the same roof on posts at 12px, and the row is labelled CLEAR. The loop is shown on two categories. The filled loop is a clover. The vase and the castle make a chess set, untested. |
| 3 Park and nature | **8** | Park A–D, Nature A–C, one-ink pairs | The pair framing is right. But the seesaw's "you with your kid" repurposes a filtering quote. The waterfall reads as a comb and nothing is saved for it. The fountain is offered to two categories. The conifer leads Nature over the peaks that fit his vent and rift. |
| 4 Dropped | **9** | Whole card | Every kill has a reason he can argue with. It takes this round's additions. |

### Likely owner objections

1. **"The museum and the carousel are the same building."** *Likely.*
   It's the first trio row he'd look at.
2. **"I said the loop for attraction."** *Likely* to be asked about.
   It's answered by question 2 and the card's one line on *sevärdhet*.
3. **"Why is that a burger?"** (the stage) *Likely.*
4. **"I never picked the blocks."** *Possible.* He's called out
   overstating twice.
5. **"Too many options."** *Possible.* Eight open icons with four
   concepts each is about 30 rows on one page. The survivors list cuts
   it to about 20.
6. **"Why are the new ones these colours?"** *Possible.* A
   placeholder colour invites a reaction to the wrong thing.
7. **"Is that ⌘ allowed under the outline rule?"** *Unlikely.* He said
   "its heavy enough". Covered by showing it beside the Star.

### Fixes (one batch, then I look at the canvas)

1. **Carousel:** one rebuild (cone tent, scallop, horses on poles, not a
   roof on posts), judged in one ink at 12px against the column front.
   If it fails, it goes to the dropped card.
2. **The ⌘:** Landmark A only. The filled loop goes to the dropped card.
   The "Could be" line becomes "The Mac ⌘ key." Show it once beside the
   outline Star at 24 and 12.
3. **Survivors only on the canvas** (ruling list in jam turn 15):
   - Café: cup, kringle.
   - Bar: skål, coupe, with the wine glass as the control.
   - Venue: notes, curtain.
   - Museum: column front, rope, vase.
   - Landmark: ⌘, camera, fountain.
   - Attraction: Ferris wheel, castle, carousel if rebuilt.
   - Park: round tree, bench, seesaw.
   - Nature: peaks, conifer.
4. **To the dropped card:** the bun, the pint, the stage, the
   microphone, the picture on a nail, the monument, the waterfall, the
   filled loop and the fountain-as-Park, one line each.
5. **Text:**
   - The seesaw line becomes "The playground, mid-tip."
   - The vase's misread adds "a chess pawn, or a bust".
   - Card 0's Neighbourhood label becomes "Carried over from District;
     you haven't commented on it".
   - The one-ink rows state facts, with no CLEAR/WEAK/BUSY tags.
6. **The new four** (Venue, Museum, Landmark, Park) go in one neutral
   ink, labelled "Colour comes later".
7. **Top of the page:** all 13 leads side by side, coloured, then in one
   ink, at 24 and 12. Below it, the cross pairs: kringle / ⌘, vase /
   castle, coupe / fountain.

### Rulings asked for (short form; full text in jam turn 15)

- **⌘:** Landmark. He confirms with a yes/no.
- **The heavy-line loop:** it doesn't break "only blanks are empty". It
  has no filled version, so it can't mean "not marked yet". This holds
  only while the line is clearly heavier than the 2.00px outline (a
  drawing-step requirement).
- **Park and Nature:** a pair. Lead: round tree + peaks. Second: bench +
  conifer. Third: seesaw + peaks.
- **Bar, café, venue:** the ideas differ in kind. Café: cup or kringle.
  Bar: skål or coupe. Venue: notes or curtain.
- **The four colours:** the product designer (visual focus) proposes
  them in the drawing step, from the brand tokens. The director scores.
  The owner sees them first.

### Send (after the fixes and my canvas look)

On the canvas page "Icon concepts", with the page replaced, not added
to. Two questions, word for word:
1. "For each open icon — café, bar, venue, museum, landmark,
   attraction, park, nature — which one, or neither?"
2. "You leaned to the ⌘ loop for Attraction. On the Nordic signs it
   means 'worth seeing', which is now Landmark, so we've put it there.
   OK, or do you want it back on Attraction?"

### What keeps blocking a 9 (across rounds)

- The same thing as round 1: card honesty at real size. This round it
  showed up in three forms:
  - a verdict tag that's false at 12px (the carousel);
  - a quote repurposed as a reason (the seesaw's "with my kid", and
    Neighbourhood "settled by your picks");
  - a lead that the card itself says misreads (the stage).
- **Why it keeps happening:** the designer tests within the groups it
  set up and labels its own results. Conflicts across groups go unseen,
  and its own leads get the kinder label.
- **The structural fix:** an all-13 strip in one ink, and facts instead
  of verdict tags. Then he judges, and the cards report.

### Did the work change?

Yes. This is a new round on the locked list: new categories, new
concepts and new cards. No score carried over.

---

## Round 2b: the turn-15 batch check (40c3480), 2026-10-16: 9, pending four text fixes

What I looked at:
- `t6.html`, rendered myself (headless Chromium, 390 wide at 3x): cards
  0–5 at full size.
- The canvas index: the concepts page holds the six T6 boards and the
  two question notes, and the t4 boards are gone.

The work changed: every round-2 fix landed.

| Card | Score | Note |
|---|---|---|
| 0 All 13 | **9** after fix 1 | The strip is right: in colour, then one ink, with the new four in grey. Line 203 still says "Five are settled". |
| 1 Café, bar, venue | **9** | Survivors only. The kringle's Could be names the ⌘. Honest. |
| 2 Museum, landmark, attraction | **9** after fix 2 | The ⌘ text is right; the vase names the pawn. The castle says "a big share" when it's 3 of 15. |
| 3 Park and nature | **9** after fix 3 | The pairs are framed right and the seesaw line is fixed. The conifer's Could be argues instead of listing misreads. |
| 4 Neighbours in one ink | **9** after fix 4 | Facts, not verdicts. The cross pairs and the ⌘ beside the Star are there. The carousel row's labels collide. |
| 5 Dropped | **9** | Complete, one honest line each. The carousel's failure is shown. |

Fixes (text only; I check them by text, with no further look):
1. Card 0: "Four are your picks and Neighbourhood is carried over; for
   the other eight this strip shows our lead. The cards after it show
   the other concepts for each."
2. Castle Shows: "A place you go into. Three of the 15 are castles
   (Rosenborg, Christiansborg, Malmöhus), and Tivoli has towers too.
   Pure grid: battlements and a door."
3. Conifer Could be: "A Christmas tree."
4. Carousel row: label the columns "FIRST BUILD" and "REBUILD".

Likely owner objections now:
- **"Ferris wheel and fountain are busy at 12px."** *Possible.* The
  cards say so, and it's a drawing-step matter.
- **"Kringle and ⌘ are both knots."** *Possible.* It's shown, and only
  matters if he picks both.

Neither blocks the send; both are visible to him.

**READY once fixes 1–4 are in `t6.html` and on the canvas boards.** Ask
the two questions from round 2, word for word. They're already posted as
title notes on the concepts page; hold the ask until the fixes land.

**Blocker trend:** the honesty issues are down to wording, in the
same family as before (a count, a lean, an argument in a misread
field). The structural fix worked: the cross-group and real-size
problems are gone.
