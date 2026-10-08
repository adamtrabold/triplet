# Un-visit transition (tag, Visited segment)

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
