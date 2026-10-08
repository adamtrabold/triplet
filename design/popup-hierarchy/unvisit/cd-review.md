# CD review: Un-visit transition (tag, Visited segment)

Fresh CD, 2026-10-08. I did not author, suggest or score any of this work.
I read `docs/cd-brief.md` and `docs/owner-taste.md` in full first. I did not
read any other review file. Evidence: `stills/<option>-strip.png` at 3x, plus
the same strips downsampled to true 1x (each 1x pixel enlarged 2x with
nearest-neighbour) to judge phone size. Frame names are the strip labels.

**Concept round.** Owner, 2026-10-05: "we're trying to rate concepts here
not execution — tell cd don't kill if the mock was bad kill if the idea was
bad". Each KILL/KEEP below is a call on the idea. Mock flaws are fixes.

## 1. Owner taste first: the rules that apply

- The ask: "just disappearing feels like kind of a letdown". The bar is an
  *event*, not a better-made dissolve.
- **Whimsy, not average.** "I like whimsy and these all seem kinda average."
  The whimsy has to carry meaning: form, paper/ink, motion. No added
  decoration.
- **Motion must be visible and symmetric.** "too fast I can't see it";
  "Star animation should go both ways". The un-visit should answer the
  stamp-in, which is 420ms of grow, land and settle.
- **Stamp, don't draw or slide.** "It shouldn't draw its a stamp". This
  was said about the visit. It still tells us the owner wants the stamp to
  behave like a stamp.
- **The grammar.** "printed = the guide's facts, stamped = where you've
  been, pencilled = what you care about". Each medium keeps its own verbs.
- **The erase pop means "lifted to be removed".** "the star should slightly
  pop out when erasing it". It is the family's removal cue.
- **Dust may never overlap text** (the shipped rule). **No heavy rules or
  boxes** ("Getting heavy handed with the thick blue lines").
- **Restrained effects** (three "too harsh" notes). **Colour must
  communicate.** The row's un-visit pale is light navy, never grey.
- **Nothing past the shape's edge that makes no physical sense.**
- **Marks scale down with their space**: the stamp is 1.1 / 1.0 / 0.85 by
  tag width.
- **Animation separation**: animations are triggered by state change and
  never touch row-gesture code. All four options comply: they hang off
  `.tag-stamp-out` and the `popupUnstampId` render.

## 2. Busiest real state: FAIL, ask for it

Only 3x crops of the stub were rendered. Missing:

- The full tag with full content (long name, address, long notes, starred
  band) at true 1x on a phone.
- The narrow-tag stamp scales (1.0 at SE width, 0.85 at 240px). The README
  says these were not shot.

This matters for two of the options:

- Lift's 1.45x rise reaches the tag's right edge (`190ms`). At 0.85 on a
  240px tag, the clearance is only 8.6px.
- Strike's stroke overruns 9px each side. On the narrow segment that may
  cross the segment rules.

The motion itself can be judged from the stub. The fit in the tag cannot.
That alone puts the verdict at "after fixes".

## 3. Option by option

### 1. Lift off: KEEP (idea). Concept 8, execution 6.

- **Grammar.** Fits. This is the stamp-in played backwards. It uses the
  stamp's own verb in reverse, and the README's physics objection ("a lifted
  stamp doesn't take its impression") doesn't hold *in this app*. Our
  stamp-in already shows the impression arriving with the stamp, from 2.09x
  at -14° with blur. So lifting it away is the honest mirror of that same
  fiction. It is the only option that meets "Star animation should go both
  ways" directly. The erase pop opens it, so it speaks the family's
  removal word.
- **1x.** It reads. The pop (`60ms`, `130ms`) is visible, and the rise and
  tilt (`190ms`) read as "picked up". It is clearly an event, not a fade.
  It is the best answer to "letdown".
- **3x, frame by frame.**
  - `0ms`: clean.
  - `60ms`/`130ms`: the pop, good.
  - `190ms`: at 1.45x the ring passes the segment and touches the tag's
    right edge. This frame also reads **grey**, not navy, from opacity and
    blur over cream. That breaks the "never grey" pale.
  - `250ms`: the worst frame of the set. A blurred, double-exposed ghost of
    VISITED sits over the arriving "MARK VISITED" and the check, and reads
    as a rendering glitch.
  - `380ms`: clean rest.
- **Whimsy.** Moderate. It's a good reversal, but it is still the expected
  one.

### 4. Strike through: KEEP (idea). Concept 7, execution 5.

- **Grammar.** Fits, and it is the most *meaningful* of the four. Pencil
  over a stamp is exactly "pencilled = what you care about": your own
  judgement correcting the record. A clerk cancelling a stamp comes straight
  out of the inspo (ledgers, claim checks, passport stamps). This is the
  whimsy the owner asked for: it carries meaning and adds no decoration.
- **Risks** (on the idea, not the mock):
  - It says "cancelled", which is a stronger statement than "un-visited".
  - The finale still pales away, so the last beat is a fade. A real clerk's
    cancellation would stay on the paper.
- **1x.** The stroke is the most legible mark of any option at phone size
  (`50ms`–`200ms`).
- **3x.**
  - `110ms`/`200ms`: the stroke is a perfectly straight, even 1.6px rule.
    It reads as a ruler line or a CSS border, not a pencil. It is also
    heavy at 1x, close to "no heavy rules".
  - The overrun to the left of the ring (`50ms`) goes past the stamp's
    shape, which makes no physical sense for a hand stroke that starts on
    the stamp.
  - `290ms`: struck stamp, ghost words and the arriving check all overlap.
    This is the same cross-over mush as Lift `250ms`.
- No erase pop. That's acceptable for a cancel, but it should still read as
  part of the family.

### 2. Dry up: KILL (idea). Concept 4.

- **Grammar.** OK on medium: it's ink, and the bleed reversed.
- **Why kill.** The best possible version of this idea is still a dissolve.
  A fibrous edge on a 26px-tall stamp is invisible on a phone. At 1x,
  `160ms`–`240ms` read simply as "it faded". That is exactly the "just
  disappearing" the owner called a letdown. The designer's README says so
  too ("it may still feel like 'disappearing', just better made").
- `240ms` "VISITE" reads as cropped type. That's a mock flaw, but the idea
  has nothing bigger to give.

### 3. Rub out: KILL (idea). Concept 3.

- **Grammar.** Breaks it. "pencilled = what you care about" owns the rub,
  the eraser and the crumbs. Ink stamps can't be rubbed out, and spending
  the pencil's verb on the stamp blurs the one system that makes the motion
  family legible. If the owner later sees the star rub and the stamp rub
  side by side, the two marks stop meaning different things.
- **Rules.**
  - It also brings eraser dust onto a control with words directly beneath
    it (`170ms`, `240ms`). That is the "dust may never overlap text"
    hazard, and it is unmeasured.
  - At 1x the rub reads as a left-to-right wipe mask (`240ms` "VISITED"
    sliced). The owner rejected "slide" for this stamp.
- `310ms`: the stamp's last letters collide with "MARK VISITED".
- Even perfectly executed, it is the wrong verb.

## Ranking

1. **Lift off**: KEEP
2. **Strike through**: KEEP
3. **Dry up**: KILL
4. **Rub out**: KILL

## 4. Owner-objection prediction (owner's voice, 1x on a phone)

1. "Why does the stamp turn into a blurry grey mess over the words right at
   the end? That's the moment I'm looking at." (Lift `250ms`, Strike
   `290ms`)
2. "The strike line looks like a ruler line, not a pencil, and it's
   heavy. Also, crossing it out feels like I failed. I just tapped it by
   mistake." (Strike)
3. "Lift is fine but is that it? It's just the stamp-in backwards. Where's
   the whimsy?" Plus: "did you check this on the small tag?"

All three are plausible, so this is not ready for the owner as is.

## 5. Noise count (stub, peak frames; full tag not rendered)

- **Lift `250ms`:**
  - Marks in one 96px segment: ghost ring, ghost VISITED, ghost check,
    arriving check, arriving label. That is 5 marks where rest has 2.
  - Colours: navy, grey (an unintended second ink), cream.
  - No rejected pattern on the idea. The grey caps the execution.
- **Strike `110ms`–`200ms`:**
  - Marks: ring, dotted track, VISITED, check, stroke. That is +1 line.
  - **Rejected-pattern match: the stroke resembles a heavy rule ("thick
    lines"). It caps at 6** until it reads as light graphite.
  - `290ms`: 5 overlapping marks.
- **Rub `170ms`–`240ms`:**
  - 4 crumbs near text.
  - **Rejected-pattern matches: dots/dust near text, and slide (the wipe).
    Each caps at 6.**
- **Dry:**
  - It's the cleanest: at most 1 fragment (`240ms`).
  - It's killed on intent, not on noise.

## 6. Numbered fixes (for the two kept options)

1. **Render the busiest state.** Show the full tag with full content at true
   1x, plus the 1.0 and 0.85 stamp scales, for Lift and Strike. A phone-
   readable filmstrip is required before the owner sees it.
2. **Kill the cross-over frame (both).**
   - The stamp must be essentially gone (opacity below about .1, out of the
     label's box) before "MARK VISITED" and the check ink in.
   - Equivalently, start the rest-state ink later or shorten the fade.
   - No frame may show stamp and label double-exposed (Lift `250ms`,
     Strike `290ms`).
3. **Pale toward light navy, not grey (both).**
   - Opacity over cream, plus blur, goes visibly grey (Lift `190ms`, and
     shipped `90ms`).
   - Hold the hue the way the row un-visit does: lightness rises, chroma
     stays at or above 0.045.
4. **Lift: keep it inside the segment.**
   - Cap the rise scale so the ring never crosses the segment's dashed
     rules or the tag edge at any `--tag-stamp-scale`.
   - Let tilt and blur do more of the "lifting" and scale less.
   - Nothing past the shape's edge.
5. **Lift: give it one beat of character.**
   - It should be a stamp, not a reversed tween. A brief hold at the top
     of the pop before it lifts would do it, mirroring the stamp-in's
     settle.
   - Keep it within the 400ms cap and keep it restrained. Whimsy through
     motion, not added marks.
6. **Strike: make the stroke graphite, not a rule.**
   - Use the Pencil Star's stroke vocabulary: slight taper and wobble, a
     few degrees off the stamp's tilt, the light-graphite weight.
   - Start and end it on or just inside the ring, with no 9px overrun past
     the stamp's shape.
   - At 1x it must read lighter than the ring's ink.
7. **Strike: soften "cancelled → failed".**
   - The designer should explore whether the cancel can read as a
     correction (a quick single tick-through, a shorter stroke) rather than
     a full cross-out.
   - Separately, explore whether the struck stamp should *leave* by the
     family's removal word (the erase pop) rather than a plain fade. Right
     now the last beat is still "just disappearing".
   - These are open questions for the designer, not a prescription.
8. **Both: confirm reduced motion stays the 160ms crossfade**
   (`stills/reduced-strip.png` is fine). Re-shoot after fixes 2 and 3.

## 7. Gating

These are concept frames only, and `index.html` is untouched. Nothing is
built. Correct. Lane 2: the owner picks before any build.

## Show the owner

**Lift off** and **Strike through**, side by side, with shipped as the
baseline. Lift is the safe, symmetric family answer. Strike is the
meaningful, whimsical one. Let the owner choose between "undo" and
"correct the record".

## Verdict: **after fixes** (1–3 at minimum, plus 4 and 6)
