# Un-visit transition (tag, Visited segment)

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
