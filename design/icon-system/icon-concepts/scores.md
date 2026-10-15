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
