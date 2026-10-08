# Un-visit transition (tag, Visited segment)

## Round 6: Dry up B, from two directions, thickest last

The owner, verbatim (2026-10-08), on the round-5 blot:

> "yeah this reads as it breaking up, not as it drying up. i liked the dry
> up b i just think it needed to dry up from two directions"

and then:

> "the thickest things should dry up slowest"

The blot (round 5) is dropped. This is B's own mechanism again.

**Live page:** `live.html` (title unchanged), built by `live-build.js`.
- It shows the new two-direction B and the original B side by side, each
  with "Play again".
- The blot's "New place" is gone because nothing here is seeded.
- The filmstrips sit below.

CSS: `options.js` key `dry2`, CSS only. Stills: `stills/r2/dry2-*`
(390 / 320 / 272 phones and the 1x tag).

### What it does (560ms, no pop, B's `cubic-bezier(.87,0,.13,1)`)

- **Outer front: B exactly.** A soft radial mask draws in from the edges,
  sized 210% → 75% of the stamp.
- **Inner front, new.** A soft radial area grows out from the centre on the
  same curve, at the same time. The `--uvi` stop runs from -42% to 40%; it's
  a registered `@property <percentage>`, so it animates smoothly.
  - It thins the centre to 30% ink rather than clearing it, so it never
    cuts through the word.
  - The two fronts meet in a soft band.
- **Thickest dries slowest.** Within the same curve, thin marks go first and
  heavy marks last:
  1. The dotted outer track (1.1px dots) fades 9–45% (50–250ms).
  2. The ring's 2px stroke fades 30–72% (170–400ms).
  3. The bold word and the filled check erode last, 40–86% (225–480ms). A
     paper-coloured stroke grows on their outlines (the word's text-stroke
     0 → 1.3px; the check's path stroke 0 → 1.5px). That thins each glyph
     evenly from its edges, so thin parts go first, while the pale and the
     fronts finish them.
- **Paling:** the ink pales to the light-navy tint over 50–336ms and is gone
  by 480ms. Words: 490–560ms.
- **No cropped "VISITE"** at any frame, at any of the three sizes. The word
  thins and pales whole.
- **Soft and smooth:** no noise, no seeds, no ragged edges.

### Measured (`r2-frames.json`, `sync.js`), stamp scales 1.1 / 1.0 / 0.85

- **No crossing frame.** The stamp is gone before "MARK VISITED" inks in.
- **Light navy, never grey.** Chroma stays ≥ 0.045.
- **Inside the segment** by 10.2 / 11.1 / 8.7px.
- **Re-tap unchanged.** Tapping again leaves 0 leftover copies, the
  stamp-in plays, and `aria-pressed` is "true".
- **Reduced motion.** The 160ms crossfade only; the track, ring, word and
  check animations are off.
- **Live page:** no horizontal scroll at 390px and 0 script errors in
  Chromium. Play again replays both.

### Weaknesses

- **The inner front is subtle.** It shows mostly as a paler middle to the
  word (180–250ms), not as a visible clear hole. That's because, per
  "thickest dries slowest", it is not allowed to cut the bold letters. If
  the owner wants the centre to visibly clear, the trade-off is a word that
  breaks in the middle.
- **Uses `@property`, `-webkit-text-stroke` and an animated SVG `stroke`.**
  These are fine in Chromium. WebKit is unchecked, though all three are
  supported on iOS 16.4+.
- **The row:** per round 4, it follows the picked tag option. With this,
  the row's stamp gets the same layers at its own size. This is a
  proposal; UX confirms it.

---

## Round 5: Dry up as a blot (owner pick)

The owner, verbatim (2026-10-08): "i like dry up B but it should dry up
from the center and edges inward like a real blot with that weight"

**Live page:** `live.html`, "Un-visit: Dry up Blot", built by
`live-build.js`.
- It shows only the new blot and B as the owner saw it, for comparison.
- Each has "Play again" and "New place". New place steps through the 21
  fixture places; B is not seeded, so it looks the same at every place.
- The filmstrips sit below.

CSS and JS: `options.js` key `blot`, plus `BLOT_FN` / `BLOT_JS`. Stills:
`stills/r2/blot-*` (390 / 320 / 272 phones and the 1x tag).

### What it does (560ms, no pop)

- **A real blot dries where the ink is thinnest.** Two fronts advance at
  once:
  - the outer edge retreats inward;
  - holes open from the centre and spread outward.

  The last ink sits in irregular patches between the two.
- **How it's built:** an SVG filter on the leaving copy thresholds two
  fields. `rad` runs from 1 at the stamp's centre to 0 at its ellipse edge.
  - The edge front keeps ink where `rad + .6*n1 > t`.
  - The hole front keeps ink where `(1 - rad) + .6*n2 > t`.
  - n1 and n2 are fractal noise (3 octaves, blotches of about 11px with fine
    grain), contrast-stretched so both fronts are ragged, never two circles.
  - The paper-tooth mask still applies on top.
- **Seeded per place:** the noise seeds come from `uvSeed(id, 'blot:1'/'blot:2')`,
  which is the app's `seedRand()` verbatim. The same place always dries the
  same way; places differ.
- **B's weight is kept:**
  - `t` runs from 0.02 (all ink) to 0.92 on B's
    `cubic-bezier(.87,0,.13,1)` over 0–460ms. It's nearly still at first,
    breaks up fast through the middle (about 180–280ms), and the last,
    thickest patches linger in the curve's slow tail (about 280–420ms).
  - The ink pales to the light-navy tint from 56ms to 350ms and is gone by
    450ms. Words: 460–560ms.
- **No half-cut "VISITE":**
  - Holes open in the middle of the word while the rim retreats, so the word
    breaks up irregularly ("VI:ITED") and never as a straight crop.
  - It's already pale when it breaks up.
  - Checked frame by frame at all three stamp sizes.
- **The clock:** the fronts are driven from the copy's own CSS clock (the
  pale animation). Pausing or seeking that animation for stills, or playing
  it live, moves them exactly. Nothing else times it.

### Measured (`r2-frames.json`, `sync.js`), stamp scales 1.1 / 1.0 / 0.85

- **No crossing frame.** The stamp is gone before "MARK VISITED" inks in.
- **Light navy, never grey.** Chroma stays ≥ 0.045.
- **Inside the segment** by 10.2 / 11.1 / 8.7px.
- **Re-tap unchanged.** Tapping again leaves 0 leftover copies, the
  stamp-in plays, and `aria-pressed` is "true".
- **Reduced motion.** No filter; the same 160ms crossfade.
- **Live page:** no horizontal scroll at 390px and 0 script errors in
  Chromium. New place gives a different pattern.

### Build note / weaknesses

- **Build:** the filter is made with the leaving copy in `buildPopupHtml()`
  and keyed on `loc.id`. The fronts are driven from the copy's animation
  clock by one rAF loop, which stops when the copy is removed.
- **Weight:** its strongest moment is about 100ms in the middle of the
  curve, by design (B's weight). On a phone, at real speed, it may read as
  "breaks up, then dust". The live page is the place to judge that.
- **Two filter features:**
  - `feImage` with a data-URI radial field. It's warmed once at load; if it
    hasn't decoded by the first un-visit, that frame would drop the field.
  - `feTurbulence` on an HTML element.

  WebKit/iPhone is unchecked for both. Chromium only.
- **The row:** per round 4, it follows the picked tag option. With the blot,
  the row's stamp would use the same filter and seeds at its own size. This
  is a proposal; UX confirms it.

---

## Round 4: no pop; two Dry up curves; erratic Erase

Two owner quotes, verbatim, on `live.html` (2026-10-08). These go into
`docs/owner-taste.md` when this lands.

> "i dont think either should pop after clicking unvisited -- that's
> muddying my feedback. but i'd also like to see a more dramatic easing curve
> on the "dry up" (but maybe it takes slightly longer?) and erase to be more
> erratic -- like randomized strokes brushing it away... it should take some
> work"

> "im looking at the tag not the row --- the row should do whatevers logical"

**Live page:** `live.html` ("Un-visit: Dry up vs Erase"), built by
`live-build.js`.
- It shows three of the tag's real stubs: Dry up A, Dry up B and Erase.
- Each has "Play again". Erase also has "New place", which steps to the
  next of the 21 fixture places, so you see a different seeded stroke
  pattern.
- Filmstrips sit below.
- No horizontal scroll at 390px. Measured in Chromium: 0 script errors, and
  reduced motion gives the crossfade with no strokes.

CSS: `options.js` keys `dryA`, `dryB`, `erase`. The round-3 Erase is kept
as `erase_r3`. Strokes: `options.js` `STROKES_FN` / `ERASE_JS`. Stills:
`stills/r2/{dryA,dryB,erase}-*` (390 / 320 / 272 phones and the 1x tag).

### Changes

- **No pop on un-visit** in any of the three. The stamp starts leaving on
  the first frame at its resting size.
- **Dry up A, "hold, then rush" (560ms):**
  - It holds at full ink for 200ms; the dry edge only creeps.
  - Then the ink rushes back into the centre on a hard ease-in,
    `cubic-bezier(.55,0,.85,.3)`, paling as it goes. It's gone 470–500ms.
  - Words: 510–560ms.
  - Why 560: the held beat has to read as held, not as lag (200ms), and
    the rush needs about 280ms to read as acceleration rather than a jump.
- **Dry up B, "sharp in-out" (560ms):**
  - One draw-back on a steep `cubic-bezier(.87,0,.13,1)`: almost still for
    the first ~150ms, most of the travel in the middle ~150ms, then a
    glide to its end.
  - It pales from 120ms and is gone 440–480ms.
  - Words: 490–560ms.
  - Why 560: a steep in-out spends about two thirds of its time near its
    ends, so the travel needs about 480ms for the fast middle to show.
- **Erase, erratic (720ms):**
  - 5–8 strokes, seeded per place. `uvSeed` is the app's `seedRand()`
    verbatim, keyed `erase:*` on the place id: the same on every play,
    different between places, and never `Math.random`.
  - Each stroke is a ragged swath of the tag's own paper (`--paper-raised`,
    through the paper tooth, so it leaves grit). Each has its own:
    - angle (±40°), length (30–64px), thickness (8–16px) and speed
      (70–150ms);
    - direction and easing;
    - place in a seeded shuffled order, with uneven, overlapping gaps.
  - The stamp clears in patches over 20–560ms, so you see it take several
    goes. The leftover ink pales to the tint from 340ms and is gone
    560–600ms. Words: 650–720ms.
  - Why 720: 6–7 strokes at a real scrubbing rate (8–11 a second) is about
    550ms of visible effort, plus the pale-out and the words. That's 1.7x
    the 420ms stamp-in, because undoing should take work.
  - Paper over ink is the same as ink removed, because the tag's paper
    never changes colour (owner rule). The strokes are clipped to the
    stamp's own box (`overflow: hidden`), so nothing reaches the dividers.
  - Crumbs of the rubbed-off ink, in the tint, drop into the segment's
    empty lower-right corner (245–560ms) and are gone before the words
    start.
  - **Build note:** strokes are generated with the leaving copy in
    `buildPopupHtml()`, keyed on `loc.id`. The mock injects them with an
    observer.

### Measured (`r2-frames.json`, `sync.js`), all three, at stamp scales 1.1 / 1.0 / 0.85

- **No crossing frame.** The stamp is gone before "MARK VISITED" inks in.
- **Light navy, never grey.** Chroma stays ≥ 0.045 on every visible
  frame.
- **Inside the segment** by at least 8.7px at every stamp size.
- **Re-tap unchanged.** Tap, then tap again at 150ms:
  - 0 leftover leaving copies;
  - the stamp-in plays;
  - `aria-pressed` is "true".
- **Reduced motion.** The same 160ms crossfade: no strokes, no crumbs, no
  mask motion.

### The row (owner: "the row should do whatevers logical")

- **What I'd do:** the row's un-visit (`vsReplay` and the swipe) follows
  whichever tag option is picked, and drops its 1.12x erase pop. The pop was
  only ever the shared "lifted to be removed" cue. With the tag now leaving
  straight away, a row that still pops would be the one place the stamp
  says something different.
- **For the swipe:** the finger-driven pale stays; only the pop at the
  lock goes.
- **For the popup replay:**
  - If Dry up wins: the row's stamp draws back to its centre on the same
    curve.
  - If Erase wins: the row uses the same seeded strokes (same id, same
    pattern), scaled to the 72x32 stamp.
- **Status:** a proposal, not applied. UX confirms it when the chosen option
  is reviewed.
- **Until then:** the tag (no pop) and the row (pop) differ for the first
  ~84ms. The two only play together when the tag is open and the row is on
  screen.

### Weaknesses

- **Dry up B:**
  - Through its fast middle the soft edge shows a partial word for 2–3
    frames ("VISITE", `dryB` 360–420ms). It is pale by then, but it's
    there.
  - A has no cropped frame because it pales before it shrinks.
- **Erase:**
  - The check glyph often goes last, which depends on the seed. Strokes are
    stratified across the stamp's width, but a pattern can leave a corner
    for the pale to finish.
  - The crumbs weren't run through the dust detector; they are kept out by
    placement and timing.
- **Chromium only.** WebKit is unchecked for: WAAPI `clip-path` on masked
  spans, and `mask-size` animation.

---

## Round 3: Dry up vs Erase (owner pick)

The owner, verbatim: "dry up is the best -- what about erase? i'd like to see
both of those". Erase is round 1's option 3, Rub out. Both reviewers killed
it, for two reasons: pencil verbs on an ink stamp, and dust near text. It
is rebuilt here with every round-2 rule and shown fairly next to Dry up.

**Live owner page:** `live.html`, "Un-visit: Dry up vs Erase", built by
`live-build.js`.
- Two of the tag's real stubs, one per option. Tap Visited to un-visit;
  tap again to re-stamp with the shipped stamp-in. "Play it again" replays.
- The markup is captured from the real page. The CSS is the app's own
  rules, extracted from `index.html` by selector, plus each option scoped
  to its own stub.
- The only external file is Google Fonts (Archivo), as in the app.
- Reduced motion is respected; both become the 160ms crossfade.
- The filmstrips sit below as a fallback.
- No horizontal scroll at 390px (measured). The stubs stack on a phone and
  sit side by side from 720px. Two 316px stubs can't sit side by side at
  390px without breaking the stub.

### Erase, rebuilt (`options.js` `erase`), 380ms

- **The ink eraser.** The gritty, abrasive kind that takes ink off by
  wearing the paper's surface. The worn edge of each pass runs through the
  paper tooth (`--tex-stamp`, offset per place like the stamp), so it breaks
  up into grit, not a soft wipe.
- **Grammar, in one line:** an ink eraser abrades the paper the ink sits in,
  so the stamp stays in its own world of ink on paper. The pencil keeps the
  soft rub, the graphite and the star.
- **Timing:**
  - 0–240ms: the row's erase pop, same frame (measured: first moving frame
    0/0 in `sync.json`).
  - 40–300ms: three passes, left to right, each reaching further.
  - Meanwhile it pales to the row's light-navy tint at full opacity; gone
    250–300ms.
  - 310–380ms: the check and words ink in.
- **Crumbs:**
  - Three or four 1.5px specks of the rubbed-off ink, in the tint, not
    graphite.
  - They drop 8px into the segment's empty lower-right corner (115–290ms)
    and are gone before the words start, so they never sit over text.
  - Their start point steps in with the stamp at 1.0 / 0.85.
  - Off under reduced motion.
- **Measured** (`r2-frames.json`):
  - No crossing frame at any stamp size.
  - Chroma ≥ 0.045 on every visible frame.
  - The stamp stays inside its segment by 7.3 / 6.7 / 4.9px at 1.1 / 1.0
    / 0.85.
  - Re-tap unchanged: 0 leftover copies, stamp-in plays, `aria-pressed`
    is "true".
- **Weaknesses:**
  - At real speed the three passes are quick (each 40–70ms). On a phone it
    may read as one wipe with grit rather than as rubbing. The live page is
    there to judge that.
  - The reviewers' grammar objection stands as their call. The ink eraser
    is my answer to it, not a ruling.
  - The crumbs weren't run through the dust detector. They are kept out of
    the label's box by placement and timing only.

Files: `live.html`, `live-build.js`, `stills/r2/erase-*`.

---

## Round 2: Lift off (lead), Dry up, Strike through, after `ux-review.md` and `cd-review.md`

Both reviews keep **1 Lift off** and kill **3 Rub out**. They split on the
other two: UX keeps Dry up and the CD keeps Strike through. The owner sees
all three:

- **Lift off:** both reviewers back it. The stamp-in, answered.
- **Dry up:** UX's alternate. The same story as the row's un-visit.
- **Strike through:** the CD's alternate. You correct the record in pencil.

Today's behaviour comes first for contrast. Owner page: `index.html`
("Un-visit Transition"), built by `build.js`. Round 1's CSS and page are in
`options-r1.js` / `build-r1.js` / `render.js`.

CSS is in `options.js`. Stills come from `render-r2.js` (writes
`stills/r2/` and `r2-frames.json`). The real-time sync and re-tap checks
come from `sync.js` (writes `sync.json`; `NOSYNC=1` gives the before
measurement, `sync-nosync.json`).

### Fixes, one batch (both reviews)

- **No crossing frame** (CD 2, UX 3/4). The words "MARK VISITED" and their
  check start to ink only after the stamp is at opacity 0. Between them
  there is a beat of clean paper (Lift and Dry 290–300ms, Strike
  320ms). Measured in `r2-frames.json`: on every frame of all three
  options, at all three stamp scales, no frame has both stamp opacity > 0
  and words alpha > 0. Today: 5 of 6 frames do.
- **Pale toward light navy, never grey** (CD 3). The stamp's ink now runs
  from its resting 82% navy to the row's own ghost tint, `VS_GHOST_TINT
  oklch(0.80 0.045 249.2)` from `index.html`, at FULL opacity. That is the
  row's P3-N1 rule: lightness only rises, chroma never drops below 0.045.
  Only then does it go, in about 40ms. Measured: chroma stays ≥ 0.045 and
  the hue at 249° on every visible frame. Opacity over cream was the cause
  of the grey.
- **Dry up: no cropped word** (UX 3). The mask edge is now a soft radial
  (opaque to 55%, then a long falloff). It shrinks only to 70%, and the
  stamp is pale and then gone before any letter is cut. The old "VISITE"
  frame is gone.
- **Lift stays inside its segment** (UX 4, CD 4). There is no growth past
  the pop's 1.12x. The lift is a 6° tilt back toward the stamp-in's angle,
  a 2px rise and a 0.4px soften. Measured, the stamp box against the
  segment at every frame stays inside on every side:
  - 1.1x scale: 1.2px clear at its closest;
  - 1.0x: 3.7px;
  - 0.85x: 3.7px.

  It used to reach the tag edge.
- **Lift: one beat of character** (CD 5). A 46ms hold at the top of the pop
  (84–130ms) before it lifts, so the hand has the stamp and then pulls. It
  mirrors the stamp-in's settle.
- **Strike: a pencil stroke, not a rule** (CD 6).
  - The stroke is now tapered (0.4 → 1.4 → 0.7px) and slightly bowed.
  - It is graphite `--ink` at about .6, through the paper tooth, drawn
    left to right in 110ms.
  - It sits 3° off the stamp's tilt and starts and ends inside the ring,
    with no overrun.
  - At 1x it reads lighter than the ring's ink.
- **Strike: leaves by the family's word** (CD 7, partly). The struck stamp
  now opens with the erase pop, and the stroke is drawn during the pop. The
  last beat is the same pale-and-go as the others. The cancel-vs-correct
  tone is still the open question: it's a lighter stroke, but still a
  strike.
- **Same pop as the row, same frame** (UX 1).
  - Every option opens with exactly `STAR_ERASE_POP`: 1.12x at 35% of
    240ms, the same easings as the row's `VISIT_LIFT` and the popup unstar.
  - Lift then holds at the top instead of settling.
  - **Measured before:** the row's rAF pop led the tag's CSS animation by
    2–3 frames, about 40ms (`sync-nosync.json`). The tag's leaving copy only
    exists after the re-render.
  - **Fix (a mock shim, `options.js` `SYNC_JS`):** when the leaving copy
    appears, its animations get `startTime` = the tap's timeline time. In
    the build, this goes in the same click handler that sets
    `popupUnstampId`.
  - **Measured after:** both start on the same frame. Per-frame scale
    matches within 0.004 through the rise (`sync.json`: lift, dry and strike
    all have first moving frame 0/0).
- **Re-tap stays as built** (UX 2). The leaving copy keeps the shipped
  `pointer-events: none`, and the button stays the target. Measured
  (`sync.json` retap), tap then tap again at 150ms, after 40ms:
  - 0 leftover leaving copies;
  - the stamp-in is playing;
  - `aria-pressed` is "true".

  The same holds for all three.
- **Missing renders** (CD 1).
  - The whole busiest tag (VEGA: band, address, long note, starred) at
    TRUE 1x, key frames side by side (`stills/r2/<opt>-tag1x.png`). On the
    page they're shown at native size in a sideways scroller.
  - The stub strips at stamp scale 1.0 (320 phone, 288 tag) and 0.85 (272
    phone, 240 tag): `stills/r2/<opt>-strip-s100.png` / `-s085.png`.
- **Reduced motion.** 160ms, with no pop, motion or mask. The stamp pales
  to the tint and goes (0–80ms), then the words ink in (80–160ms). There is
  no crossing frame here either (`stills/r2/reduced-strip.png`).

### Timings (round 2)

| | pop (= row) | hold | leave | gone | words ink in | total |
|---|---|---|---|---|---|---|
| Lift off | 0–84ms rise | 84–130 | 130–290 tilt/rise/soften, pale | 250–290 | 300–360 | 360 |
| Dry up | 0–240 (rise and settle) | – | 60–290 ink draws in, pale | 250–290 | 300–360 | 360 |
| Strike through | 0–240 | – | stroke 20–130; pale 150–280 | 280–320 | 320–380 | 380 |

### Still open / weaknesses (round 2)

- **Lift**:
  - 1.2px of clearance at 1.1x is tight. The measurement uses the
    unblurred box, and the 0.4px soften reaches about 0.4px beyond it.
  - It is still the "expected" reversal (CD: moderate whimsy).
- **Dry up:** still the quietest, which is the CD's reason to kill it.
- **Strike through**:
  - At 1x the stroke is light by design, so on a phone the pop and the
    pale carry more of the event than the stroke does.
  - "Cancelled" vs "corrected" is unresolved.
- **The empty beat:** all three now have a beat of clean paper, about 10ms
  plus the 40ms the word takes to reach readable ink. This is deliberate,
  per the no-crossing rule. It may read as a blink at real speed, which
  needs checking in real time.
- **Not verified:**
  - Chromium only (WebKit: animated `mask-size`, `clip-path` on a masked
    pseudo-element, `filter` on a masked element).
  - The sync shim is mock-only.
  - Frames are stepped, not captured live.

---

## Round 1 (history)


Designer, 2026-10-08. Concept frames only. The app's `index.html` is
untouched.

## The ask

The owner, verbatim: "we also need to iterate on the unvisited transition --
what's the best way for that to go away? just disappearing feels like kind
of a letdown"

## What ships today (`stills/shipped-strip.png`)

`.tag-stamp-out` / `tagStampOut` fades the stamp over 220ms (ease-out) while
it grows 1.136x. The resting outline check and "MARK VISITED" are laid out
under it from frame 0, so for the whole 220ms the fading stamp sits over the
words. It reads as a dissolve over a label that is already there, not as an
event. The stamp-in it answers is a 420ms grow, land and settle.

## The family it has to belong to (`docs/shipped.md`)

- **Erase pop** (Pencil Star unstar, row un-visit, popup unstar): 1.12x over
  240ms, no twist, `cubic-bezier(.2,.9,.3,1)` up and `(.5,0,.4,1)` back. It
  means "lifted to be removed".
- **Row un-visit:** the erase pop, then the stamp pales toward a light navy
  tint by opacity: never grey, never darker.
- **Popup unstar:** the fill fades off the outline over 240ms during the
  erase pop. No rub, no dust.
- **Pencil Star rub:** a rub of 400ms or more, and 1.5px `--ink-2` crumbs
  swept 11–13px into the gutter, fading over 200–240ms. **Dust may never
  overlap text.**
- **Visit bleed (swipe):** the ink soaks outward through a fibrous paper
  edge.
- **Tag stamp-in:** 420ms, from 2.09x at −14° with a 0.6px blur, landing at
  0.91x, settling at 1.045x, then 1x.
- **Grammar:** "printed = the guide's facts, stamped = where you've been,
  pencilled = what you care about".

## Held in every option

- The other two segments never move. The leaving stamp is the shipped
  absolutely positioned `.tag-stamp-out` copy.
- The resting state comes back exactly: the outline check and "MARK
  VISITED", which ink in (colour transparent → `--ink`) only once the stamp
  is mostly gone. Shipped shows them from frame 0.
- At most 400ms.
- Existing tokens only. CSS only on the shipped hooks (`.tag-stamp-out` and
  the segment). No markup or JS change (`options.js`).
- Triggered by the state change (the existing `popupUnstampId` render), so
  it never touches row-gesture code. The row's own un-visit replay
  (`vsReplay`) is unchanged.
- **Reduced motion (all four):** a plain 160ms crossfade, with the stamp out
  and the rest state in. No scale, no rotation, no mask motion, no dust
  (`stills/reduced-strip.png`). Shipped today shows nothing; the stamp
  simply vanishes.

## Options

Each option has a filmstrip, `stills/<option>-strip.png`, with 3x crops of
the stub: before, then 6 frames. The single frames are in
`stills/<option>/`.

### 1. Lift off (`lift`), 340ms

- **Idea.** The stamp-in played backwards. The stamp gives the erase pop,
  then rises off the paper along the path it came down: the angle returns
  toward the stamp-in's −14°, the scale opens to 1.45x, its 0.6px approach
  blur comes back, and it's gone.
- **Source.** Tag stamp-in (path, angle, blur) + erase pop.
- **Timing.**
  - 0–26% (0–88ms): erase pop up, 1.12x, `(.2,.9,.3,1)`.
  - 26–80% (88–272ms): rise and fade, `(.45,0,.7,.7)`, out by 272ms.
  - The rest state inks in from 70% (238ms) to 340ms.
- **Weaknesses.**
  - Physically, lifting a rubber stamp doesn't take its impression with it,
    so this reads as "undo" more than as something happening to the paper.
  - At 1.45x the rising stamp reaches the tag's right edge (`190ms`). It is
    faded by then, but it does pass beyond its segment.
  - The cross-over frame (`250ms`) shows a ghost of the stamp over the
    arriving words.

### 2. Dry up (`dry`), 380ms

- **Idea.** The visit swipe's bleed, reversed. The swipe soaks the ink
  outward through the paper's fibre; un-visit dries it back inward. During
  the erase pop, the ink retreats from the ring's ends toward its centre,
  through the paper tooth (`--tex-stamp`). It pales by opacity, per the
  row's un-visit rule (lighter navy, never grey).
- **Source.** The visit bleed (inverse) + the row un-visit's pale + erase pop.
- **Timing.**
  - Pop: 240ms.
  - Dry: a radial mask shrinking from 170% to 0, opacity 1 → .25, over
    380ms, `(.35,0,.65,1)`.
  - The rest state inks in from 70% (266ms).
- **Weaknesses.**
  - It ends on a fragment ("VISITE" at `240ms`) that reads like cropped
    type for a frame.
  - It is the quietest of the four, so it may still feel like "disappearing",
    just better made.
  - The radial mask is a hard-ish oval, not fibre. A fibrous edge, like the
    bleed's static `feTurbulence` mask, would be truer but costs a second
    mask image.

### 3. Rub out (`rub`), 400ms

- **Idea.** The Pencil Star's erase.
  - The erase pop, then three back-and-forth rubs across the stamp, left to
    right, each reaching further. It pales as it goes.
  - Four 1.5px `--ink-2` crumbs drop off the stamp's trailing end and are
    swept 12px down-right into the segment's lower corner. They fade by 78%
    (312ms), before the words arrive.
- **Source.** Pencil Star unstar (rub, crumbs, dust sweep) + erase pop.
- **Timing.**
  - Pop: 240ms.
  - Rub: 360ms from a 40ms delay, keyframes 0/28/42/68/80/100%,
    `(.4,0,.6,1)` per stroke.
  - Crumbs: 40–78% (160–312ms).
  - The rest state inks in from 74% (296ms).
- **Weaknesses.**
  - **The metaphor breaks the app's grammar.** Pencil rubs out; a rubber
    stamp's ink doesn't. Rubbing out the stamp spends the pencil's verb on
    the stamp. The CD should rule on this.
  - The right end of the stamp is erased last, exactly where "VISITED" sits,
    so at `310ms` the stamp's last letters overlap the arriving words.
  - Crumbs near text: these are placed below the label's line and gone
    before the label inks in, but they are unmeasured by the dust detector.
  - It is the longest (400ms), at the cap.

### 4. Strike through (`strike`), 380ms

- **Idea.** A clerk doesn't remove a stamp, they cancel it. One pencil
  stroke (`--ink` at about 78%, the light-graphite weight) is drawn through
  the stamp, left to right, in about 110ms, the way the Pencil Star draws a
  stroke. Then stamp and stroke pale away together. There is no pop.
- **Source.** The Pencil Star's stroke drawing + the row un-visit's pale.
  Pencil on a stamp fits the grammar: pencilled = your own judgement, here
  "not visited after all".
- **Timing.**
  - Stroke: 0–30% (0–114ms), `(.3,.1,.3,1)`.
  - Hold to 34%, then fade `(.4,0,.7,.6)`, out by 85% (323ms).
  - The rest state inks in from 74% (281ms).
- **Weaknesses.**
  - The stroke overruns the stamp to the left, which reads as a cross-out
    and is the most "negative" of the four. Un-visiting is a correction,
    not a failure.
  - It adds a line for 200ms, close to the owner's "no heavy rules" at its
    peak (`110–200ms`).
  - It is the only option without the family's erase pop.
  - It mixes media, graphite over ink, on a control the owner sees as one
    stamp.

## Not done / not verified

- Chromium only. In WebKit, check `mask-composite` with an animated
  `mask-size` / `mask-position` (dry, rub) and `filter: blur` on a masked
  element (lift).
- Frames are stepped with the Web Animations API in reduced-motion-off
  mode. There is no real-time capture or frame-drop measurement.
- Not run through the dust detector (rub).
- Not shot on the narrow-tag stamp scales (1.0 / 0.85). The motion is
  written relative to `--tag-stamp-scale`, so it scales with them.
- No scoring here. UX and CD review comes next.

## Files

- `options.js`: the CSS per option (all of the diff).
- `render.js`: `node design/popup-hierarchy/unvisit/render.js [option ...]`
  makes a scratch copy of `index.html` with the option appended, opens
  Aurora (starred, visited), taps Visited, steps every animation and writes
  `stills/`.
- `build.js`: writes `index.html`, the owner page "Un-visit Transition".
- `stills/<option>-strip.png`: the filmstrips. `stills/<option>/*.png` holds
  the single 3x frames.
