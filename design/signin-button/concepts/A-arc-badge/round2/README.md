# Concept A, round 2: what changed and why

Owner on round 1 (verbatim): "on the right track but it's ugly. icon should be centered... maybe too small? text should be smaller and probably tracked out some because it's crowding"

Sheet: `sheet-3x.png` (1170 wide, 3x). Built from `sheet.html`; real-app stills from
`render2.js` (patched copy `index-A2.html` = real index.html + `../../flow/proto/patch.js` + `badge2.js`).
Re-render: `node render2.js` (motion frames for variant 2; `V=1|3 node render2.js` for another), then
`node ../../sketches/shoot.js sheet.html sheet-3x.png`.

## What changed
- **Person centred.** Glyph bbox centre (12,12 of the 24-unit lucide user) sits at the badge centre (25,25).
  Round 1 had it high at y 17.6 with the text below, so the badge read as "icon up top, label at the bottom".
- **Person bigger.** ×0.42 → ×0.58 / ×0.68 / ×0.76 (variants 1/2/3); stroke 1.35-1.5px.
- **SIGN IN smaller and tracked out.** Round 1: 8px at 75% width, 0.5px spacing (condensed + tight = crowding).
  Now normal width (100%) for legibility at small size, with wide tracking, on a radius that hugs the rim:
  | | person | text | tracking | weight | arc radius |
  |---|---|---|---|---|---|
  | 1 Small change | ×0.58 | 6.5px | 1.3px | 700 | 17.6 |
  | 2 Balanced (pick) | ×0.68 | 6px | 1.8px | 650 | 18.0 |
  | 3 Big person | ×0.76 | 5.5px | 2.3px | 650 | 18.3 |
- **The arc is now truly centred.** Round 1's SIGN IN leaned (Chromium places textPath glyphs off-centre with
  `text-anchor: middle` + letter-spacing). `SB.centerArcs()` measures the first/last glyph and rotates the arc
  group so the word is symmetric about 6 o'clock. Builder: call it after the badge renders and fonts are ready
  (or hard-code the measured rotation per variant). Unchecked in Safari.
- **Stands on its own.** Shown in the corner with + gone (in case + moves). Paper face + warm 1px edge + 1px
  contact shadow carry it alone on cream and on water; it doesn't need the navy + beside it to read.
- Unchanged: 50px scallop die, paper `#FAF5EA`, navy ink, no rim/tilt, pressed face `#DCD3C3`, signed-in badge.

## Motion
Same Strike in / dry-up out, same timings. Only the person's start changed: it's already centred, so it just
grows ×0.68 → ×1 and thickens to 2px (no upward travel any more), reversing to orange under the ink. The
0.13s frame's blot is a touch bigger (r 19.5) so the words are covered by then. Frames are variant 2.

## Not redone
The flow sheet (`../../flow/sheet-3x.png`) frame 5 still uses round 1's `../shots/in-0|130|380.png`. Once a
variant is picked, point it at `round2/shots/in-*.png` (render with that `V`) and re-shoot; nothing else on it changes.

## Open
- 5.5-6px caps at real size: the owner asked for smaller; Chromium renders read, iPhone unverified.
- Weight 650 vs 700 at 6px: Safari's variable-font rendering of 650 is unchecked.

## Round 2b: director's fixes to variant 2 (scores.md, round 2 entry; 2 scored 8)
Variant 2 was overwritten in place (`badge2.js` V[2]); every v2 still, the motion frames, `sheet-3x.png` and the
flow sheet were re-rendered over the same filenames. Variants 1 and 3 are dropped from the sheet. Their values and
shots (`shots/v1-*`, `v3-*`) stay on disk for the record.
- Arc baseline r 18.0 -> **16.6**. Scallop valleys measured at r 18.81, so the letters' feet clear them by **2.2px**
  (1.7px to the inner side of the 1px edge stroke).
- Tracking 1.8 -> **1.3px (0.22em)**. Word space -> **hair space U+200A**. Measured ink gaps (canvas, 100x):
  S-I 2.01, I-G 2.06, G-N 2.16, **N-I 3.88**, I-N 2.21. So the word gap is **1.85x** the mean letter gap (2.11).
- End letters (glyph start/end positions, after centring): **±53.8°** from 6 o'clock (target ≤60).
- Weight 650 -> **700** so the I holds at 1x. Cap height 4.11px. Cap tops at r 12.49, figure's lowest ink at
  r 6.85, which leaves ~5.6px between shoulders and caps. That's no crowding, so the person stays at true centre
  (25,25; `cy` 25). No optical nudge was needed.
- Enlargements draw the edge and contact shadow at 1 CSS px (`badgeA({size})` divides by the blow-up), so the
  hero doesn't get a tan outline.
- Sheet: leads with "We'd pick this one" and 2 at 3x (150px). Below it: pressed + signed in at 72px, the full
  top-of-screen strip, and 1:1 crops next to +, over water, and on its own (cream, water). Then the in/out strips.
- Flow sheet (`../../flow/sheet.html` + `proto/make-sheets.js`): the title is now "Signing in" (was "Signing in,
  both concepts"), and frame 5 uses `A-arc-badge/round2/shots/in-0|130|380.png`. Re-shot `flow/sheet-3x.png`.
- Measure again with `node measure.js 2` (uses `measure.html`).

## Round 2c: lifted to the optical centre (owner on 2b)
Owner (verbatim): "i like this badge but it feels weighted low so maybe everything should be up some / visually
centered. this could allow for more space betwen the icon and sign in -- look at the inspo for guidance"

Sheet: `sheet-2c-3x.png` (from `sheet-2c.html`). Stills: `shots/2c/` (v6 = A, v7 = B, motion = B). Render with
`OUT=shots/2c VS=6,7 V=7 node render2.js`. The 2b sheet and shots are untouched.

**Inspo drawn on**
- `inspo/visited-badge/passport-stamps-grid.jpg`, mainly the GREAT BRITAIN / LONDON roundel and the DUBLIN
  oval. The emblem and the curved words are balanced as one block, with even margin all round. Nothing sits
  on the rim, and the curved line follows the rim at a steady distance.
- `inspo/project/matchbooks-collage-1.jpg`: the Little Washington seal (top left) and Ralph's "ENJOY A CUP OF"
  arc. The curved type gets clear air from the emblem. Emblem and text read as two parts with breathing room
  between them, not packed together.
- What I took: centre the **group** (person + SIGN IN) by its ink, not the person by geometry. A bottom-only
  arc drags the visual weight down, so the emblem has to rise above centre to balance it.
  I also opened the person-to-words gap.

**How:** the person and the arc move up independently. The arc's own centre (`ay`) moves up, so it's no
longer concentric with the die. Its clearance from the rim only grows, most at 6 o'clock. Sizes, tracking,
hair space and weight 700 are unchanged from 2b. The ink blot and the dry-up are now centred on the person,
so at 0.06s the reversed figure is whole, not cut. With `cy` 25, as in 2b, the blot is identical to before.

**Measured** (ink-only render at 10x, `node ink.js <v> && python3 ink.py <v>`; 50-unit box, centre 25)
| | person centre cy | arc centre ay | ink top / bottom | ink bbox centre | ink centroid | room top / bottom (to valley r 18.81) | min ink-to-rim | person-to-caps gap |
|---|---|---|---|---|---|---|---|---|
| 2b (owner saw) | 25.0 | 25.0 | 18.2 / 41.6 | 29.9 | 30.8 | 12.0 / 2.2 | 2.25 | 5.6 |
| A (v6) | 18.8 | 21.2 | 12.0 / 37.8 | 24.9 | 25.7 | 5.8 / 6.0 | 4.46 | 8.0 |
| **B (v7, pick)** | 18.4 | 21.6 | 11.6 / 38.2 | 24.9 | 25.7 | 5.4 / 5.6 | 4.22 | 8.8 |
- The gap is measured from the person's lowest ink (cy + 6.85) to the cap tops at 6 o'clock (ay + 12.49).
- End letters stay at ±53.8° about the arc's own centre.
- Both lifts put the ink box at 24.9, a hair above the true centre, which is the usual optical centre. The ink
  centroid sits 0.7 lower because the words spread wide at the foot.
- A and B are close: B moves the person up 0.4 and the words down 0.4, so it trades even margins for more air
  between the two. That air is the owner's ask, so B is the pick.

## Round 2d: navy and orange, person lowered (owner on 2c)
Owner (verbatim): "Person is too high and let's take it to the blue and orange style again since the plus is changing"

Sheet: `sheet-2d-3x.png` (from `sheet-2d.html`). Stills are in `shots/2d/`; re-render with
`OUT=shots/2d VS=9 V=9 SOLO=1 node render2.js`. With `SOLO`, + is hidden and the badge sits alone at right:16,
because + is changing and the + crew owns where it goes.
- **Style** (`nv: 1` in `badge2.js`): a plain navy scallop die, like today's `#accountBtn`, with no paper edge and
  no shadow. The person and the SIGN IN arc are both `--brand-orange` #EE7434. Orange on navy measures 5.08:1.
  Pressed uses today's state: face `--state-on-press` #2A4F73, ink `--paper` #F2EBDD (7.18:1).
- **Height** (v9): halfway between 2b and 2c. The person centre is at 21.6 (2b 25, 2c 18.4) and the arc centre at
  23.2 (2b 25, 2c 21.6). I judged it against the same colours at the 2b and 2c heights (`lift.html`, keys 11 and 12).
  On navy, the 2c height clearly reads high and 2b reads low. 10 (20.8/22.8) was a near second.
- Measured (ink): ink box centre **27.35** (2b 29.9, 2c 24.9); centroid 28.2; room to the valley, top/bottom,
  **8.6 / 3.9**; closest ink to the rim **3.47**, so ≥2px holds; person-to-caps gap **7.24** (2b 5.6, 2c 8.8).
  Sizes, tracking, the hair space and weight 700 are unchanged.
- **Motion**: same frames and timings. The navy strike over the navy die is invisible except where it covers
  orange, so signing in reads as the words sinking into the navy from the person outward while the person grows to
  ×1 and settles to centre. The dry-up's slightly translucent navy lets the words fade back from the rim in.
  The signed-in badge is unchanged.
- **For the director:** signed out and signed in now differ only by the arc and the person's size (job 2: "tell at
  a glance"). The orange words are the whole signal.

## Round 2e: paper signed out, navy signed in (owner on 2d)
Owner (verbatim): "The sign in badge looks good now but I forgot it was orange and blue when signed in so let’s do white and blue signed out", then "I mean the style it was before I said to change it to orange and blue".

Sheet: `sheet-2e-3x.png` (1170 wide) and `sheet-2e-1x.png`, from `sheet-2e.html`. Stills are in `shots/2e/`. To
re-render: `OUT=shots/2e VS=14 V=14 SOLO=1 node render2.js`, then `node ../../sketches/shoot.js sheet-2e.html sheet-2e-3x.png`.
- **Spec: V[14]** in `badge2.js`. It is V[9]'s geometry exactly (ps .68, sw 1.45, fs 6, ls 1.3, r 16.6, weight 700,
  hair space, person cy 21.6, arc ay 23.2) with 2c's colours: a `--paper-raised` #FAF5EA die, a warm 1px edge
  (rgba(107,74,40,.22)) and the + button's 1px contact shadow. The person and SIGN IN are `--navy` #12293F. No `nv` flag.
- **Pressed:** the face goes to `--paper-pressed` #DCD3C3 and the ink stays navy. That's the app's pressed-in rule
  for paper (the patch's `#accountBtn.signin:active { --sb-face: #DCD3C3 }`). `badgeA({pressed:1})` now draws this
  for paper dies.
- **Signed in:** unchanged (navy die, orange person at ×1, stroke 2).
- **Height:** kept at 2d's (between 2b and 2c), as approved. It was judged on navy. On paper it still sits between
  2b's low and 2c's high, which is what he asked for in 2d. The geometry is identical to V[9], so the 2d ink numbers
  apply.
- **Sign-in moment:** this is the original Strike again, and it can be seen again. Navy ink floods the paper die from
  the person outward. Inside the ink the person turns orange and grows to ×1, and the words go under the ink. With the
  pop, it lands on the signed-in badge. Signing out, the navy dries back to paper from the rim inward and the navy
  words return. The two states now differ by die colour, mark colour, words and person size, so job 2 ("tell at a
  glance") is fully met. 2d's risk (the same colours in both states) is gone.
- **Watch (motion):** at 0.13s the blot (r 19.5, scale 1.12) leaves a thin paper fringe at the scallop tips. It reads
  as ink that hasn't reached the edge yet. If it looks like a halo on the device, raise the 0.13s blot to r 21.
