# Visited as one system: stamp-first (concept stage)

## FINAL visual spec (round 7e; owner's check sizes)

Check, centred on the circle's centre (the flap may slightly overlap it): big circle (map pin NEAR, and the selected pin) 9px, stroke 2.4; small circle (map pin FAR) 6.2px, stroke 2.2; wide row sticker 8px, stroke 2.1.
Check shape: a filled path with square ends and lightly rounded corners (radius 1 of 24, like the category glyphs' small corner arcs and the star's 1.3 tips), not a pill-round stroke; `sticker/check-vs-glyph-ends-4x.png` compares it to the fork, cup and martini.
Row oval: 72x24, 12px (--s3) padding, check + VISITED. Pin: category-wash face, flap bottom-left (~18% of the diameter), warm 21% shadow. Truncation: 16 of 204 names, 1 of the 21 visited (shipped stamp: 16).
Stills: `sticker-contact-1x.png`, `sticker/M1-crop-3x.png`, `sticker/M1-overlap-3x.png`, edge and row before/after, `sticker-keyframes-3x.png`. Reproduce with `sticker7.js`.

---

## Round 7c: check 12% smaller (superseded by 7e; same files as 7b)

Check: pin NEAR 9 to 8px (stroke 2.4 to 2.15), FAR 7 to 6.2px (stroke 2.5 to 2.2), list oval 9 to 8px (stroke 2.4 to 2.1); the selected pin follows the NEAR size.
Row oval is now 72x24 (was 76) with the same 12px (--s3) padding. Truncation of the 204 real names at 390px: 16 (shipped stamp 16, check-only 8, word-only 12); of the 21 visited now, 1 truncates.

---

## Round 7b: natural shadow, padded 76px row sticker (superseded by 7c; `mockup.html?sys=M1`, `sticker7.js`)

Sheets: `sticker-contact-1x.png`, `sticker/M1-crop-3x.png`, `sticker-edge-before-after-{1x,3x}.png`, `sticker-row-word-before-after-{1x,3x}.png`, `sticker-keyframes-3x.png`.
Shadow: warm paper-brown (#6b4a28) at 21% opacity (was black at 83%), 1.1px blur with a longer fall, a faint 16% blurred crease, no edge stroke. Flap size unchanged.
Row sticker: 76x24 with 12px (--s3, the filter-chip padding) on both sides; the flap counts as part of the left padding. Truncation cost is a record, not a constraint (owner).
Truncation of the 204 real names at 390px (`sticker/row-truncation.json`): none 2, shipped stamp 16, check-only 48 wide 8, word-only 64 wide 12, round 7 68 wide 15, **check + word 76 wide 19**. Of the 21 visited now: 2 truncate at 76 wide (shipped 1).

---

## Round 7: shadow edge, row sticker says VISITED (superseded; `mockup.html?sys=M1`, `sticker7.js`)

Sheets: `sticker-contact-1x.png`, `sticker/M1-crop-3x.png`, `sticker-edge-before-after-{1x,3x}.png`, `sticker-row-word-before-after-{1x,3x}.png`, `sticker-keyframes-3x.png`.
Flap size is unchanged. The hard fold line and edge hairline are gone: the lift is a soft blurred crease plus a cast shadow, and the flap reads through its paper-tone back.
Row sticker: check + VISITED (10px condensed caps, .08em, same type as the meta line) on a 68x24 oval; map pins keep the check only.
Truncation of the 204 real names at 390px (`sticker/row-truncation.json`): none 2, shipped stamp 16, check-only oval 8, check + word oval 15. Of the 21 visited now: 1 truncates (shipped 1, check-only 0).

---

## Round 6b: quieter flap (superseded; `mockup.html?sys=M1`, `sticker6.js`)

Sheet: `sticker-contact-1x.png`. Crops: `sticker/M1-crop-3x.png`, `sticker/M1-verify-{1x,3x}.png`. Motion: `sticker-keyframes-3x.png`. Blind (new seeds): `blind/set{1,2,3}-{near,far}-1x.png`, truth in `blind/TRUTH-do-not-show-testers.json`.
The flap is now about 18% of the pin's diameter (was ~35-40%), with a soft paper-shadow edge and a thin (0.75px) category-ink fold line. The list oval's flap is clipped inside the oval's outline. At FAR the check is the darkest mark.
**Plainly, at true 1x:** the flap is visible as a lighter lifted corner at NEAR; at FAR it is faint and mostly reads through the thin fold line, so FAR is borderline. Earlier finding kept: a fold-geometry bug had made every flap since round 5 a sliver.

---

## Round 5: the peel is back, and the pin carries a check (superseded; `mockup.html?sys=K1|K2|K3`, `sticker5.js`)

Sheet: `sticker-contact-1x.png`. 3x crops: `sticker/K{1,2,3}-crop-3x.png` (approx, starred, selected pin, white-road rows).
Motion: `sticker-keyframes-3x.png`. Rule kept: no rim or colour past the fold; the flap is a paper-tone back, never pure white.

**1. Bold check + word (PICK).** Category-wash face with no rim, inward peel at the lower-right, and a heavy check in the category ink.
The list oval carries the check plus VISITED. The check says "done" without a key, and the wash keeps the category colour.
**2. Check-only, matte.** Paper-deep face, peel at the upper-left, and the heaviest check; the list oval is the check alone.
Clean, but the beige face is dull and every category looks grey-brown, so colour carries less.
**3. Light check, ringed.** The same ringed disc as to-do (family), with a lighter check and a lower-left peel.
The ring plus a one-sided peel reads as a teardrop map pin, so the polarity problem comes back.

**Cost to flag: visited pins lose their glyph.** Category then reads from colour alone. FAR loses nothing, because to-do pins have no glyph at FAR today either.
At NEAR the closest wash pairs are bar/other, cafe/other, nature/area, cafe/street, bar/area and area/hotel, at roughly 3-5 OKLab units (`sticker/K-category-colour-distances.json`), so I would not rely on colour alone to tell those apart.
Recommendation: no mitigation for v1. The list row and popup still show the glyph, and a done place is not a wayfinding target. A ghost glyph next to the check would add noise.
The list badge keeps its category glyph; only the oval carries the check.

**Blind test:** `blind/K{1,2,3}-{near,far}-1x.png` have no key or captions. The truth is in `blind/TRUTH-do-not-show-testers.json`. I did not score these myself; a fresh agent should.

---

## Round 4: two channels, three directions (superseded; notch-only pick dropped by the owner; `mockup.html?sys=S6|S7|S8`, `sticker4.js`)

Sheet: `sticker-contact-1x.png`. 3x crops: `sticker/S{6,7,8}-crop-3x.png`. Rule kept: nothing exists past a peel or cut.

**A. Matte sat-down (S6).** Visited is a matte paper-deep sticker with no rim, the glyph printed on it, and one big peel.
Reads as a different object at both zooms. On a visited approx pin the dashed rim stays, so it looks like a to-do pin.
Weak spot: at FAR the pale disc is a beige blob, and on a green park it is faint.

**B. Raised vs stuck (S7).** To-do pins get a drop shadow, and visited lies flat with a thin edge and a medium peel.
At 1x the shadow is close to invisible, so only the peel carries it, and a peel on a ring looks like a teardrop map pin.
Not enough of a second channel. Dropped.

**C. Die-cut notch (S8, PICK).** Visited is a category-wash sticker with no rim and a big straight-cut corner missing.
The silhouette and the ringed-vs-filled difference read at a glance at NEAR and FAR, and it keeps category colour.
No flap needed; motion is unchanged: the sticker still gets placed at the press.

**Test, honest version:** I could not spawn a fresh agent from here, so this was a self-test on visited sets whose
positions I had not seen (new seed, no key, truth computed afterwards). I designed these, so it is not clean.
To-do pins found / actually to-do, with false to-dos: A NEAR 7/8 (+1), FAR 4/4 (+1); B NEAR 4/5 (+2), FAR 2/2 (+1 unsure);
C NEAR 5/5 (+0), FAR 3/3 (+0). Misses: A's visited approx pin and B's shadowed/peeled pins.
A truly blind run is still needed: give a fresh agent only the `blind/*-1x.png` sheets (no key) and compare with
`blind/TRUTH-do-not-show-testers.json`. Visited approx pins in C also keep a dashed rim, which is still open.

---

## Sticker revision 2: "Folded in" (superseded; `mockup.html?sys=S5`, `sticker3.js`)

The lower-left corner folds inward and lies over the face. It is physically honest, following the
owner's fix: past the fold there is no rim and no colour, only a real notch where the map shows
through. The flap shows the sticker's back in paper-deep `#DCD3C3`, the fold line is 1px category
ink, and visited pins stack under to-do pins. The same rule holds on the list oval and the
selected pin.
**1x count:** NEAR 18/18 and FAR 10/10. This is not strictly blind, because I had seen the true
positions from the previous pass. White-road rows are in `sticker/S5-crop-3x.png`, and the swipe
frames are in `sticker-contact-1x.png`.

## Sticker revision 1: "Folded corner" (superseded; `mockup.html?sys=S4`, `sticker2.js`)

The whole sticker stays. One pure-white corner folds up past the rim at the lower-left, with a
crisp fold line and a 1px shadow, so the pin gains a corner instead of losing a bite. The fold is
14–18px long (13.9 on the list oval), and the flap covers the glyph's corner but never its centre.
In the visit swipe (B1), the trailing oval is what animates: it lifts at 40px, presses at 56px
and settles to rest. The badge and name never move. See the frames at the bottom of
`sticker-contact-1x.png`, and the 3x crop (with approx and selected pins) at `sticker/S4-crop-3x.png`.
**Blind 1x count:** NEAR 18/18 and FAR 10/10, with no false positives. Two or three NEAR corners
over white roads needed a second look. At rest the corner reads more as "lifted" than "pressed
flat", which is still open.

## Sticker round (superseded by the revision above)

Sheet: `sticker-contact-1x.png` (true 1x). 3x crops: `sticker/S{1,2,3}-crop-3x.png`. Motion: `sticker-keyframes-3x.png`.
Visited = a sticker with one peeled edge. On the map it stays a circle; in the list it is an oval.
Files: `sticker.js`, `mockup.html?sys=S1|S2|S3`. The basemap is a stand-in.

**1. Small curl (PICK).** Today's pin gets one small lower-left curl that shows the white back.
Nothing is added and a sliver is removed, so it is never louder than a to-do pin.
The list oval uses the same curl on its left tip. At FAR 16px the curl reads as a small notch.

**2. Die-cut edge.** This is 1 plus a thin paper-white margin.
At 1x the margin disappears against the light map, so it adds work for no read.
Dropped.

**3. Big lift.** A larger curl on the lower-right reads best at FAR.
At 1x, though, the pins look bitten ("C" shapes), and the curl eats the glyph.
Too loud for a "slightly peeled" edge.

**Motion (pick 1):** the swipe lifts the sticker (1.14× with a soft shadow and a big curl). At 56px
it presses down (0.97×, haptic). The curl then smooths out over about 120ms, and one small peel
stays. There is no ink bleed. **Stage 2:** the list curl is faint at 1x, so size it up there.

---

## Round 2: keep the stamp, give it the pin's container (superseded)

Sheet: `r2-contact-1x.png` (true 1x; each band shows list + to-do/visited key | map NEAR | map FAR).
Every stamp now uses the pin's container: a 2px solid stroke on a paper fill, with no dots.
Files: `r2.js`, frames in `r2/`, `mockup.html?sys=R1|R2|R3`. The basemap is a stand-in.

**1. Stamp-shaped (PICK).** A visited pin becomes the stamp's oval. It is the same width as the
round seal but shorter, about 70% of its area, and stacks below to-do pins. The row stamp is that
same oval holding the word. Close up (NEAR) the oval leans at the place's stamp angle, and its
12px glyph leans with it. Zoomed out (FAR) it lies flat, so the shape alone carries it. Approx
dashes are fitted to the oval. Owner crop: `r2-pairs-3x.png`.

**2. Stamp ink.** Visited pins and the stamp share one slate ink.
The difference is obvious, but grey reads as "disabled".
Zoomed out, the category colour is lost.

**3. Smaller seal.** A visited pin drops one size and loses its glyph.
The difference is clear up close, but zoomed out the visited pins become 10px rings that look
like map dots. The stamp only echoes the pin loosely.

---

## Owner stills: the combined system (CD 9/10, UX pass)

**Sheet:** `owner-combined-1x.png`. It shows the combined system above alternative D. Each is
list | map NEAR | map FAR at true 1x, with 75% of pins visited, and a FAR dial inset sits below.
**3x specimens:** `owner/combined-spec-3x.png` and `owner/D-spec-3x.png`. Each shows a
visited+starred row, a visited row and a to-do row, then 9 categories plus the 2 approx pins as
to do / visited / visited+starred at NEAR and FAR. The individual frames are in `owner/`
(`<set>-list|map-near|map-far-1x.png`, `dial-edge-off|on-1x|3x.png`), and they are regenerated
by `owner.js`. The basemap is a stand-in.

**What the combined system is** (`?sys=X` in `mockup.html`). A visited pin is coloured in. The
rim is gone and the field is a flat wash of the category's own hue. This folder's wash is used:
OKLCH, lightness tracks the ink's lightness, and chroma is floored at 0.032 and capped at 0.066.
The glyph is **tinted through** (pin-first's idea): it drops to a deeper tone of its own hue, a
fixed 0.33 in lightness below its wash and never lighter than L 0.50. That puts every glyph at
an even **3.57–4.07:1** on its wash (`measure.js`), so none falls under 3:1 and none stays as
heavy as a to-do pin. Approx pins keep their dashed rim, drawn in the same tone. The row's
leading badge is the same `badgeHtml()` drawing, so it colours in identically, and the row keeps
`--paper-filed`. The star is unchanged everywhere.
- **FAR 1px edge: OFF by default.** It is a dial, shown in the inset. Turn it on only if real
  tiles make the visited FAR discs read as map POI dots.
- **Z-order:** visited pins stack below to-do pins. In `applyMarkerStacking()`'s ladder
  (highlighted 1000 > starred cluster 700 > cluster 600 > starred pin 500 > pin 0), visited
  subtracts one step of 1000. That gives visited starred pin −500 and visited pin −1000, which
  keeps "starred beats plain" inside each state and keeps every to-do pin above every visited
  one. Clusters are unchanged. As today, Leaflet adds each marker's pixel y to its offset, so
  steps of 500 or more hold only while the map is under about 500px tall. Stage 2 should confirm
  this, or widen the steps.

**Stated plainly:**
- **The pick retires the VISITED stamp as a mark.** It also **drops the backlog idea of a ghost
  VISITED stamp in the popup**, because there is no stamp left to ghost.
- **The stamp's action lives on as motion.** The visit swipe's ink-bleed and press land on the
  row's badge, which colours in, instead of on a trailing stamp.
- **D is the path if the owner wants to keep the word.** It uses the same pins and badges, and
  the row keeps only the tilted navy "VISITED" with the ring and dots gone.

**Stage-2 requirement (UX must-resolve B1):** during the visit swipe the badge slides off-screen,
so as built today the colouring-in would happen out of sight. The colouring must be visible at
the press frame (56px). For example, the badge could stay put while the name and meta move, or
the bleed could land in view. Popup Mark Visited is unchanged: its hollow ring filling in navy
already says "filled = done".

---

*Everything below is the original exploration (systems A–D, first-pass pin). The combined system
above supersedes its pin details: the glyph is now tinted through and the FAR edge is off by
default.*

`index.html` is untouched. The owner asked (2026-09-29) for the visited stamp and the pin to
"communicate with each other". Their steer on the nine pin-only concepts was: "the colored in
ones with reduction of information read the cleanest". That points to set-1 "Coloured in" and
set-3 "Wax seal". So every system here fills the pin in and takes information away, rather than
adding a mark. This folder works from the row outward and asks what the row's version of
"coloured in, reduced" is.

**Primary image:** `contact-sheet-1x.png`. Every panel is true 1x at 390px. Each band shows one
system as list | map NEAR 24 | map FAR 16, with 75% of the map pins visited. The first band is
a reference showing what ships today.
**3x specimens:** `renders/<sys>-spec-3x.png`. Each one has visited+starred, visited, and to-do
rows, then 9 categories plus the 2 dashed approx pins. The pin rows are to-do / visited /
visited+starred, at NEAR and then FAR.
**Files:** `mockup.html` (`?sys=ref|A|B|C|D` & `view=list|spec` or `tier=near|far`),
`shoot.js` (renders and contact sheet), `measure.js` (contrast table).

**Fidelity.** The rows use the shipped row CSS (`.location-card` … `.delete-btn`, `.row-stamp`
with its 1x dash fallback), the real tokens, Archivo, `badgeHtml()`, `markerStarHtml()`,
`stampTilt()`, `CATEGORY_COLORS` and the glyph symbols, all copied verbatim. **The basemap is a
stand-in**: it reuses the SVG from explore-3/set-2, uses the same pin seeds, and sits under the
real re-tone filter. The sandbox can't reach real tiles.

## The key fact from the code

The row's leading glyph is already the pin. `renderCard()` draws it with the same
`badgeHtml(category, kind, 24)` that `markerIcon()` uses for a NEAR pin. So whatever a visited
pin becomes, the row's badge becomes too, and the two surfaces share one object for free. In
every system below, the badge follows the pin. The systems only differ in what else the row
does.

## The pin, shared by all four systems: coloured in

Visited = the 2px rim is dropped, and the paper field is filled with a flat wash of the
category's own hue. The glyph stays, in category ink. Stars, approx dashes and the glyph box
are unchanged.

- **Muddy darks, fixed.** Set-1 mixed each ink toward paper, and that turns the low-chroma darks
  grey. Here the wash is built in OKLCH instead: the hue is held exactly, and chroma is floored
  at 0.032 and capped at 0.066. The floor stops the putty grey and the cap keeps the look flat
  print ink rather than app pastel. Spruce becomes a clear sage, slate becomes a blue-grey, and
  plum becomes a mauve. Only `other`, a deliberate neutral, stays neutral.
- **Value order is kept.** Wash lightness tracks the ink's own lightness: L 0.775–0.87 at NEAR
  and 0.76–0.85 at FAR. That keeps hotel and shopping apart, and area and bar apart, at FAR,
  where colour is all there is. My first pass used one lightness for every category, and it
  made hotel and shopping the same lilac and area and bar the same sky blue.
- **Light inks get a deeper glyph.** Gold, lavender and teal glyphs are darkened to OKLCH
  L ≤ 0.50. Glyph-on-wash contrast is 3.7–7.2:1, so every glyph clears 3:1 for a non-text mark
  (`measure.js`).
- **Confusion with POI dots.** OSM POIs are about 6px saturated dots. A visited FAR pin keeps the
  full 16px footprint, and it gets a 1px cut edge in the wash's own deeper tone (2.3–3.2:1 on the
  ground). That edge is a die-cut sticker edge, not a rim. The shipped rim measures 3.2–12.9:1,
  so the to-do rings stay clearly on top. Visited pins also stack below unvisited ones.
  **Unproven:** this needs checking on real tiles, which is an iPhone check.
- **Mass.** A wash disc on the ground measures 1.3–1.9:1, against 3.2–12.9:1 for the shipped
  rim. At 1x, the ringed to-do seals are the figure at both tiers.

## The four systems (judged by eye at 1x first)

### A. Coloured in: one mark (PICK)
The stamp retires. The row's leading badge fills in, exactly like the pin, and the row keeps the
`--paper-filed` field.
- **Row equivalent:** the row does the same thing the pin does, and nothing more. Ringed means to
  do and filled means done, on both surfaces, because it is the same drawing. Visited rows also
  get back the ~12 characters of name the stamp was costing them.
- **At 1x:** the two ringed rows (Kaffibarinn, Dill) jump out as "what's left". The filled
  badges read as done without any word. It is the quietest of the four and the one that reads
  most clearly as a single system.
- **Weakness:** the word "VISITED" disappears, so the list signal is now one 24px disc plus the
  field. That still isn't colour alone (ring vs filled disc is a shape change), but a first-time
  viewer has to learn it once. D is the fallback if the owner misses the word.

### B. Inked from one pad
The stamp keeps its fixed-x column and its tilt. It fills in with the same wash as the pin, and
the ring and dots go. The word is set in the deepened category ink.
- **At 1x:** the stamp now reads as a coloured tag or button chip, which is not what a passport
  stamp looks like. With the badge also filled in the same colour, every visited row repeats the
  mark twice and carries a coloured pill. That adds information instead of taking it away.

### C. The row is coloured in
The whole visited row takes a light tint of the category hue (L 0.915, about filed's value). The
stamp retires.
- **At 1x:** it's a patchwork. Mint and lilac rows advance while the gold and brown ones vanish
  into filed, so visited rows stand out unevenly. That runs against "visited recedes, what's left
  reads first", and it would force the focus and press states to be re-solved over 11 tints.

### D. Just the word
The pin fills in. The stamp drops its ring and dots and keeps only the tilted navy "VISITED"
(11px), like a rubber-stamp word such as "PAID".
- **At 1x:** it's clean and it keeps the explicit label and the scannable right column. The
  unintelligible dotted track is gone. But the row now carries two visited signals (the filled
  badge and the word), and the word shares nothing visible with the pin. It's a good fallback,
  but not one system.

## Pick: A. Coloured in, one mark
**Why:** the row badge is literally the pin, so filling both in is one drawing on two surfaces:
ringed means to do and filled means done, with less information on both, which is exactly the
owner's "coloured in with reduction of information".
- **B rejected:** the filled stamp reads as a tag or button, and it doubles the mark in every row.
- **C rejected:** a tinted row is a patchwork that advances unevenly, and visited must recede.
- **D rejected (fallback):** it's clean, but the word is a second signal that doesn't talk to the
  pin. Keep it in reserve if the owner misses "VISITED".

## Fit with the star, gestures, popup (notes, not designed)
- **Star:** it is unchanged in both places. On the map the paper halo sits on the filled disc and
  reads cleanly at both tiers (see the specimen). In the list the leading star is untouched.
- **Visit swipe (left):** the "ink bleed" moves from the stamp slot to the leading badge, and the
  bleed becomes the colouring-in itself: the category wash soaks in from the centre and the rim
  dissolves at the press. The press, pop, haptic and field landing stay the same. Two follow-ons:
  the ink target is the category wash, not navy, and the V18 truncation rule gets simpler,
  because nothing appears in the action column so the name never re-truncates. Un-visit is the
  reverse: the wash drains and the rim returns. The popup replay (`vsReplay`) replays on the
  badge. This is a stage-2 motion job and needs perf re-measurement (the badge is small, so it
  should be cheaper than the stamp).
- **Popup Mark Visited:** a hollow ring that becomes a filled navy circle is already "coloured in
  = done", so it doesn't contradict the system. An optional stage-2 tweak is to fill it with the
  place's category wash, but navy is the safer AA choice. No change is needed for concept
  approval.
- **Highlighted row / marker:** the highlighted marker already inverts to a solid ink disc, and
  it must stay distinct from "visited". It does, because the highlight is full ink and larger
  while visited is a pale wash. On the highlighted row the badge flips to paper as it does
  today. Stage 2 should check the filled badge on `--figure-deep`.
- **Clusters:** unchanged here. An all-visited cluster treatment is left open.

## Checks run
- 1x and 3x renders of each system: list, map NEAR and map FAR at 75% visited, plus a 3x specimen
  of 11 categories × {to do, visited, visited+starred} × {NEAR, FAR}. All in headless Chromium
  1194.
- `measure.js`: glyph-on-wash, wash-on-ground and edge-on-ground contrast.
- No motion was built. Impeccable doesn't apply because `index.html` is unchanged. The numbers
  are Chromium-only on a flat stand-in ground, and on-device and real-tile legibility is
  unverified.
