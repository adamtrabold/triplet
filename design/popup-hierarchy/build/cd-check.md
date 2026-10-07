# CD check: Hanging Tag + orange star, finished build (lane 2)

Fresh CD. I did not author, suggest or score any of this work. I rendered the real
`index.html` on `popup-hanging-tag` (6a046d0) myself with `build/render.js final`. I added
extra shots of a Malmö list, Copenhagen/Malmö z14 and z11 cluster crops, plus a run of
`design/impeccable-gate/run.sh index.html`. I did not read any review or check files.

**Verdict: fix first.**

## Ledger rules that apply

- Stars are coloured: one starred colour, used the same way on the pin, list row, tag and add form.
- The star is the action orange. Gold is out. The owner was "not sold on pink".
- Use the brand palette consistently and meaningfully. Colour must communicate something, or go neutral.
- The tag's starred treatment is the band, for now. The colour is still open.
- Colour floods need paper texture, not clouds. A modest stamp bump at most.
- An open tag adjusts the list instead of closing it, "with a good amount of padding below the tag".
- Simple, simple, simple. No unnecessary variations. Secondary marks never outrank content.
- Icons fill the same visual space. The icon revision is next: "checked items are stronger visually than the open ones".
- Signed out, the edit actions are visible but disabled, and Directions stays live.
- "No star unless it's been starred."

## 1. Execution score: 6/10 (capped)

What works. The typical tag (`typical-crop@3x`) and the street and district tags
(`street-open-crop@3x`, `district-open-phone@1x`) are calm and whimsical in the right
way: die-cut paper, perforation, segmented stub, name clearly first. The band follows the
die-cut shoulders, which fixes the owner's "bar not matching the shape". The band texture
now reads as fine paper streaks, not clouds. In `busiest-vega-phone@1x` the list stays
open under the tag and the navy selected row reads well. The visited stamp is back to a
sensible size.

What caps it:

- **Inconsistent star state.** This is a rejected pattern ("inconsistent states") and
  caps the score at 6. In `busiest-vega-crop@3x` the pin star, the band and the list-row
  star are orange, but the stub star is filled black. This breaks the owner's own rule:
  one starred colour, used the same way on the pin, list row, tag and add form.
- **"Orange" is not orange in two of five cities.** The star is the per-city `--figure`.
  In Malmö it is `#E0A22E`, the gold the owner rejected ("gold too loud", "Gold is out")
  (my shot `x-malmo-list`). In Copenhagen it is `#E2705C`, a coral that reads pink beside
  the new wine restaurant icon (`list-copenhagen-phone@1x`); the owner said "not sold on
  pink". Stockholm `#D98A2B` reads amber (`list-stockholm-phone@1x`). The builder's tag
  stills are all Reykjavík, so the owner has never seen a gold or pink band.
- **The Impeccable gate fails.** It printed `IMPECCABLE GATE FAILED` with 3 new findings.
  CLAUDE.md requires a pass before landing.

## 2. Owner objections (in the owner's voice, 1x on a phone)

1. "Why is the star black on the tag when it's orange on the pin, the band and the list?
   And in Malmö it's gold again, and in Copenhagen it's pink. I said orange."
2. "Starred is said three times on one tag: the band, the filled star and the pencil
   scribble crossing the word. Then the visited stamp is a fourth loud thing. The checked
   stuff is shouting again, the exact thing I want fixed in the icon pass."
3. "On the long note the tag nearly hits the list. That's not a good amount of padding.
   And the 'TYPE' label is microscopic."

## 3. Noise count: busiest view (`busiest-vega`, tag plus list)

**Tag: about 24 distinct marks.**
- Band, eyelet patch, eyelet ring and string.
- Navy plan-stop badge, plus an orange star on the pin.
- Name, address, notes.
- TYPE/BAR and PLAN/STOP 3 OF 3.
- Close ×.
- Perforation, 2 notches, 2 dashed dividers.
- Compass, filled star, pencil circle, navy double-ring dotted stamp.
- 3 stub labels.

**Colours in the tag: 8 tones.** Orange, cream patch, paper, ink, ink-2 grey, navy stamp,
pencil grey, dashed grey.

**State redundancy.** Starred is signalled 4 times in one glance: pin star, band, filled
black star plus "STARRED", and the pencil circle.

**Rejected-pattern matches:**
- (a) Inconsistent states: the black star against orange stars. **Caps at 6.**
- (b) Colour that doesn't hold one meaning across the app: per-city star hue, so the same
  state is gold in Malmö, coral in Copenhagen and orange in Reykjavík.

**Hierarchy.** The name still wins on the tag. In the list, the navy selected row plus a
fully saturated orange star is the loudest pair on screen. That is acceptable for
selection. But visited stamps still outweigh the names they sit beside (existing; noted
for the icon pass).

**Map.**
- `map-z14`: the dark visited stickers with orange stars are clearly the heaviest pins.
  Open category rings recede. The build makes the owner's "checked stronger than open"
  complaint slightly worse by adding a saturated orange accent to checked-and-starred pins.
- `map-z11`: all 6 clusters carry an orange star on the `--figure-deep` disc. It reads
  tone-on-tone, the clusters become one orange blob, and the star stops communicating
  because every cluster has one.
- Attraction moss `#547326` and nature dark green now put two greens on the map. The
  icons still differentiate them, but it's a likely "why two greens".

**Signed out** (`signedout-crop@3x`). The disabled treatment is right: Directions is
live, Star and Visited are greyed. But the band stays full orange above a grey star.
That's defensible as state display, but it is a fifth way the star looks.

## 4. Numbered fixes

1. **One star, one colour.** In the band treatment, the stub star becomes the same
   orange-with-keyline star as the pin and row, not black. The designer decides whether
   the pencil circle stays once the band and the coloured star both carry starred. The
   owner called the circle provisional, and three signals is too many.
2. **Decide the star hue across cities before the owner sees finals.** Either use one
   fixed action orange for the star and band in every city, or keep it per city. If it
   stays per city, the owner must see Malmö (gold) and Copenhagen (coral) tag and list
   stills first, because both contradict his words. Add Malmö and Copenhagen busiest-tag
   stills to the final set either way. This is a designer/owner call; the CD flags it,
   it doesn't pick.
3. **Impeccable.** Raise the 8px "Type" label (`.tag-lab`) to at least 10px. It replaces
   the 10px "restaurant" meta and is a real legibility regression at 1x. The 10px stub
   labels are like-for-like with the 10px "Get Directions" / "Mark Visited" already in
   the baseline: either lift them to 11px or get operator/owner approval for
   `run.sh --update`. Re-run until it prints `IMPECCABLE GATE PASSED`.
4. **Padding below the tallest tag.** `long-note-approx-phone@1x` leaves about 31px
   between the tag and the sheet header, and the attribution strip plus a pin sit in that
   gap. Give it the "good amount" the owner asked for (at least 48px is my read), letting
   the list drop further.
5. **Clusters at z11.** Make the orange star readable against the `--figure-deep` disc
   (e.g. a paper halo like the pins), or have the UX/designer confirm a star belongs on
   clusters at all now that it's saturated. Right now it's tone-on-tone noise.
6. **Stub icon optical sizes.** The check is visibly lighter and smaller than the compass
   and star, and the label baselines drift by about 1px (`typical-crop@3x`, `street-open-crop@3x`).
   Match them optically: "icons don't fill the same visual space".
7. **The eyelet patch on the band** reads as a blank cream sticker box at 1x
   (`busiest-vega-phone@1x`). Have the designer soften it to read as reinforcement, or
   let the band show through around the eyelet.
8. **Note for the icon revision (don't fix here).** Filled black star, pencil circle,
   double-ring stamp and orange-starred dark stickers all deepen the "checked items are
   stronger than open ones" imbalance. Two more items for it: the name column jumps left
   on unstarred rows (an existing "one left channel" break), and the two greens.

Ready for the owner's final stills after fixes 1–4. Fix 2 needs the owner's answer, shown
with Malmö and Copenhagen stills.
