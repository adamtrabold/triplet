# Visual designer notes -- + placement

## UPDATE 2026-10-15, round 11b (owner: "Let's try it turned 90 degrees too")
- **`data-trot=up|down`** in `drawR11()`; preset p5 (64×38) for a slimmer
  upright.
- **Lead upright:** orange p4, hole up, end down (43×70).
- **Stills:** `C-tag-r11/V1-V6`; V2 is the three-way choice (Float | flat |
  upright).
- **Rough weights:** upright orange about 2×, cream about 0.6×.
- **Next:** systems measures upright coverage; the director scores; the
  send.

## UPDATE 2026-10-15, round 11 (owner: tag too wide, + too large, balance off, miss the hole; show orange + cream-with-orange-end)
- **`drawR11()`** in `C-tag-r10/t.inc.html`, presets `P11`:
  - p1 72×42, p2 64×44, p3 80×36, p4 70×43 (the lead);
  - the hole at the die-cut end with its grommet ring;
  - the + is 18 / 3.6, centred between the hole and the perforation.
- **Lead:** orange p4 (`T11 = 'T:orange:104:0:p4'`); cream colourway
  `T11B`.
- **Rough weights:** orange about 2× the account, cream about 0.6×.
- **Stills:** `C-tag-r11/` S1, C0-C7, K1-K3.
- **Next:** systems re-measures; the director scores; the send.

## UPDATE 2026-10-14, round 10c re-shoot at 84 + the ADD still
- **C #7 is 84 × 44** (`TC = 'T:orange:84'`). C0-C7 re-shot.
  - C0's caption now says "both hide only while the filters are open".
  - C3 shows systems' measure (2.65× the account, 2.0× the Float).
- **New `blank-tag-form/R10-F6-add-3x.png`:** pinned card | the place's
  real tag (`r10-f-after664`: +2 zoom, `alignReal(458)`). Both stubs sit
  at 398-458, so the tag tightens by its top with a small pan; no fly.

## UPDATE 2026-10-14, round 10c (director: Float 9, form 9, C → pick #7)
- **C's pick is #7** (`TC = 'T:orange'`), re-shot C0-C4, C6, C7.
  - Pressed = deep orange stock.
  - Flagged in the concept file: about 3.5× the account vs the Float's
    about 1.3×. Dials: 84 wide ≈ 2.3×, 78 ≈ 2.0×.
- **R1 re-captioned** "Also explored", with #7 the pick and #2 the
  runner-up.
- **Form:**
  - `.bt-cats` gap 15, so the half-pin falls at the edge, with a fade.
  - Pinned frames use `hang(... z1: 2)` (+2 zoom on the place; `ZD`
    env overrides) to keep the street line and the account's pin out.

## UPDATE 2026-10-14, round 10b (systems measured C #2 at 1.37/1.31; the Float made complete)
- **Form:** the card is fixed (TYPE row from blank, 48 top, blank card at
  the pinned spot). No caret when unfocused. While typing: offers from
  72 + "Search everywhere" (`.bt-every`). City: `.bt-city` underline +
  the `cityopen` state.
- **Frames:**
  - `r10-*` (re-shot);
  - `c10-*` (page `T:twoend`, gap 86);
  - `f10-*` (page F, gap 88; `floatBadge(p, 'press')`).
  - Prefix 380.
- **Stills:**
  - `C-tag-r10/C0-C7` (C0 = the two options side by side);
  - `E-float/F1-F7`;
  - `blank-tag-form/R10-F1-F5`.
- **Next:** the director scores C vs Float; then the send for the owner's
  final call.

## UPDATE 2026-10-14, round 10 (owner cut A; push C as tag-is-button; the form centred, unpinned → pinned)
- **C:** `concepts/C-tag-r10/t.inc.html` has 8 variants (`data-tv`). The
  pick is #2, `twoend`: paper, an orange claim-check end, a navy +.
  - Systems-scaled weight about 1.25.
  - The solid and punched tags are about 3-5× (flood mass).
  - Stills: R1 (eight at real size), R2-R4 pairs vs today, R5 full
    real size.
  - Frames `t10-*`.
- **Form:**
  - wash (`#btWash` inside the map container, z 650) while there's no
    address;
  - `hang(... realPin, centre)` = the type's pin above the tag;
  - optical centre `OPTICAL` 0.45, clamped for the pin;
  - TYPE = `pinStrip()` (the app's 32 pins, guess first);
  - city is pencil text.
  - Stills: `blank-tag-form/R10-F1-F4`.
- **Next:** systems measures C #2 and writes the behaviour (the map move
  on pick, city correction); the director scores.

## UPDATE 2026-10-14, round 9c re-shoots (C 9, A 9)
- **C7:** the map moved in both panels.
  - 320 uses [64.1400, -21.9250].
  - List down uses [64.1500, -21.9450].
  - No street outline or sticker sits by the button now.
- **C2:** the "also tried" is the hanging arrangement (+ on the pin,
  blank tag below; `hang:fillplus:none:0:100:40:4:heavy`), with the
  line on why the tag lies flat.
  - Crop y 382-525 at 1x ×3, chosen pixel-exact to clear a sticker above.

## UPDATE 2026-10-14, round 9c (director 9b: C 8, A 9)
- **C:** the + moved onto the pin as its glyph (filled orange 40, navy
  +, heavier glyph `data-cg=heavy`). The tag is blank with two ruled
  lines (`data-cplus=rules`).
  - Pick string: `side:fillplus:rules:0:144:40:4:heavy`.
  - The foot is 6 above the credit (`footY()`).
  - Rough mass 0.98 (≈1.2 systems').
- **C2's "also tried"** is now 9b's ring + printed + (`r9-c-alt`).
- **Re-shot:** C1, C2, C3, C4, C5, C7, C8 (C6 is unchanged; C is hidden
  there).
- **Next:** systems re-measures rank; the director scores.

## UPDATE 2026-10-14, round 9b (director: C 7, A 9; five fixes)
- **C's new pick:** a shipping tag lying across, pinned through its
  eyelet by an orange ring pin (40, 4 ring, empty face), with a navy +
  46/8.5 beside it. 144×75, no added block.
  - Rough mass 1.09 (σ4).
  - Dial string: `side:ring:tag:4:144:40:4` (`CPICK` in `stills.js`;
    `c.inc.html` `drawSide()`).
- **Killed:** any circle-over-cross arrangement (it reads as the female
  sign).
- **Also tried:** R6 (`hang:fillplus:none:0:100:32`).
- **Stills:** `C1` real size, `C2` also tried, `C3` vs today, `C4`
  squint, `C5` tap, `C6` tag open, `C7` sizes, `C8` pressed. The old
  C1-C6 are deleted.
- **Form:**
  - 40px chip rows.
  - The credit is never hidden; `dock()` now collapses the list first.
  - T9 crop is 300-584.
- **Mass method:** my blur metric reads about 0.83× of systems' (R6b:
  0.71 mine vs 0.86 theirs). The baseline frames `cv-none`/`cv-noacct`
  must use the same centre as the variant.

## UPDATE 2026-10-14, round 9 (owner: "Blank pin looks ugly…"; director turn 38)
- **P is dropped.** C (pin+tag) and A carry the shared form; Float is one
  frame.
- **C's look:** `concepts/C-pintag/c.inc.html`. The pick:
  - a 32 orange blank pin;
  - a 100×84 tag with real die-cut details;
  - a navy + on the body;
  - a mini stub with ADD's navy first segment.
  - Rough mass is 1.44× the account; without the navy it's 0.86.
  - Variants are in `raw/cv-*`.
- **Form:**
  - `__BT.card()`: the filled tag as a card with its foot at
    credit − 6, the map still, the string hidden, the eyelet empty.
  - `dock()` has no pin by default.
  - Chips are `.filter-btn` for city and TYPE.
  - Questions: `.bt-ask` above the stub, answers in a two-segment stub.
  - `__BT.taps()` gives the boxes for the T9 audit.
- **Frames:** `r9-*` in `stills.js` (page C, `CREST` [64.1460, -21.9380]).
  - C at 664 and the 320 rest use the city view / [64.1360, -21.9426]
    to keep pins out from under the object (it's big).
- **Stills:**
  - `C-pintag/C1-C6`;
  - `blank-tag-form/T0-T9` (all re-shot; T9 is new);
  - `A-header-tag/A3`, `A5` re-shot.
  - P stills are left on disk, not for sending.
- **Next:** systems measures C's rank and footprint on the real render.
  Then the director scores.

## UPDATE 2026-10-14, the TYPE fix before the send
- The demo place Sundhöllin (a pool) is now ATTRACTION everywhere: the
  blank's default type, and the real row via `window.__ROWS` injected in
  `stills.js` (it was the fixture's "nature").
  - The director's mapping row (pools and sports centres → Attraction)
    is in how-it-works' pre-fill section.
- Re-rendered every frame and recomposed all 20 stills (all at 1170).
- P5's 320 panel had a pin under the account badge AND one under the
  lifted pin. Its view is now [64.1420, -21.9380]. measure.json has
  `lpPins` too.

## UPDATE 2026-10-14, round 8b re-shoots (P 9, A 9; director's three mechanical fixes)
- **The hanging tag's foot = the map credit's top − 6** (`footLimit()`
  in `blank.inc.html`; Float still min'd with its badge, 512).
  - At 664 the foot is 581 (credit 587); at 320 it's 485.
  - The stub doesn't move at ADD (`alignReal` uses the same limit).
- **Lines grow:** `.bt-f` is min-height 32. The notes row has an 8px
  head so a wrapped note clears the rule above.
  - T4's note is two lines; the picked tag is still 248.
- **Docked map centre** is [64.1440, -21.9400], so no pin shows in the
  eyelet. measure.json has `eyePin` (0 in every docked frame) and
  `acctPins`.
- **Re-shot:** T0, T1, T2, T3-T8, P3-tap, A3-tap, A5. All 20 stills open
  at 1170.

## UPDATE 2026-10-14, round 8b (director scored P 8 / A 8; five fixes)
- **Fix 1, one rhythm:** 32px rows (`.bt-f`), the rule at the foot.
  - Empty-line captions print ON the line. Only NAME, docked, has an
    under-caption with a 16px band.
  - Picked = 248 tall (real 196 + NOTES).
  - Docked keeps min 256 (the stub behind the keyboard).
- **Fix 2:** `__BT.alignReal()` pans the real tag so its foot equals the
  blank's (588 at 664). The `f-after664` frame shows it.
  - The list stays at the band until close: written into the
    how-it-works top box for systems.
- **Fix 3:** T5 is two panels (before | after).
- **Fix 4:** the demo place switched to Sundhöllin (`short_address`
  injected).
  - Every docked frame resets the view to [64.1440, -21.9426] z14;
    320 typing uses [64.1500, -21.9480].
  - `acctPins` in measure.json counts pins under the account badge:
    0 in every frame the owner gets.
- **Fix 5:** `.tag.short` (innerHeight < 600) gives results at 72 and
  no NAME caption.
- **Next:** systems checks the numbers, then the director re-scores
  from the re-shot stills.

## UPDATE 2026-10-14, round 8 fixes (director turn 36)
- **Fix 1, pencil = graphite.** Graphite #3F454E with a #6A717C sheen
  (background-clip text), plus streak grain seeded per entry
  (`pencilMask()`, 50% floor).
  - Proof: `blank-tag-form/T0-pencil-vs-greyed-1x.png` (raw `cmp-*`
    frames).
- **Fix 2, a whole ruled blank tag.** `.tag-in` is at least 256, flex
  `space-between`, gap 10. The stub is fixed (behind the keyboard at
  664).
  - Results are an opaque overlay from 89px.
  - The hanging tag is 316. `__BT.hang` pans the map to clear the list
    (`s.clear` sets the limit, e.g. the Float badge).
- **Fix 3:** `P3-tap` and `A3-tap` are two panels; the old journey PNGs
  are deleted.
- **Fix 4:** T2 is whole frames; T7 and T0 are re-cropped (watch the
  pins cut at crop tops).
- **Fix 5:** the needle is 2px with a 5px point; the ground is 14×4.4
  at 28%.
- **Systems looped in:** a box at the top of
  `blank-tag-form/how-it-works.md` (fixed height, overlay, ADD now at
  518-578 at 664, the Float pan 512, rules fading on ADD).
- **Next:** the director scores round 8.

## UPDATE 2026-10-14, concepts turn 1 (after director turn 35 and systems' concept turn)
- **Packages:**
  - P (lifted pin) and A (header tag) share one blank-tag form; Float is
    one frame. V3 is dropped (shown once as "also tried").
- **Prototype:** `concepts/blank-tag-form/blank.inc.html` plus
  `stills.js` (raw frames in `blank-tag-form/raw/`, `ONLY=` prefixes)
  plus `compose.js` (owner stills).
  - The blank tag is the REAL tag: open a place's tag, then
    `__BT.capture()` / `dock()` / `hang()` rewrite its contents. The
    keyboard is drawn (`__BT.kb`).
  - Pages: today / P / A (stub r5+r6+r7 layers) / F (the Float badge
    drawn with the account's scalloped mask).
- **Stills:**
  - `P-blank-pin/P1-P6`, `A-header-tag/A1-A5`, `blank-tag-form/T1-T8`;
  - one `looks-and-feels.md` per folder.
- **Decisions this turn:**
  - The needle is a tapered navy wedge, 2.2 → 0.6, 22 long, ground
    ellipse 12×3.8 at 15%. It's tapered so it doesn't read as a
    lollipop.
  - Captions use `--ink-2` label print (the real tag's), not navy.
    Pencil = `--ink-2` 86% over paper, with a tooth mask on a 62% floor.
    The name inks to `--ink`.
  - NOTES comes before TYPE (the real tag's order). This pushes against
    systems' table.
  - The VISITED stamp is not re-stamped at ADD (it landed when tapped).
    This amends the director's item 7.
  - ADD has a cream + glyph over the label, like the other segments.
  - The credit is hidden while docked (it peeked past the tag at 320).
- **1x read:**
  - Not a FAB at 1x.
  - Blurred, the needle vanishes, so rank comes from the disc
    (1.40x).
  - The orange face near the deep-orange clusters at city zoom is
    flagged.
- **Gotchas:**
  - Rest frames at 664 use the city view: at z14 the lifted pin sat on
    a sticker.
  - The ink-over frame for A must be shot on A's page (the band ×).
- **Next:** the director scores; systems checks coverage. Then the
  handoff.

## UPDATE 2026-10-14, jam turn 34 (pass 2, last jam pass)
- **Director (turn 32):** V1 dropped. V2 and V3 forward, bottom-left; ADD
  is navy; A stays orange. **Rule 1:** the pin is always above the tag on
  a straight string. **Rule 2:** orange off the paper = act, orange on
  the paper = starred. Minimum add: tap, type, pick, ADD. A fresh blank
  waits after Add.
- **Systems (turn 33, `concepts/pass-a-check/`):**
  - V2 needs a 52px squint mass to outrank the account, which makes a
    disc a FAB.
  - V3 must be ≤120 wide, and the credit must move.
  - Dock at 664: pin 14-46, tag top 74, results 150-320.
- **My turn 34 (sketches in `concepts/sketches/pass-a/`, re-render with
  `node render.js`):**
  - V2 = the **lifted pin**: a 44 disc with a 2px halo, a 1.6 navy string
    ~22 down to a ground point, and a faint shadow. It lands on pick.
  - Dropped: teardrop, push-pin, ring-string, big disc.
  - V3-B ("narrow, not small", 120 wide, 22 chamfers, full-size patch) is
    drawable, but my vote is to drop V3.
  - Typing: the name at 36 below the top, in pencil; results printed on
    the tag; 48px rows (3 and a half); no slip edge; docked pin 32.
  - ADD order: name ink + TYPE stamp, VISITED stamp +150ms, ADD →
    DIRECTIONS, pin + → glyph.
  - The fresh blank appears when the tag closes.
  - Shapes: the pin stays lifted, then fades into the outline; ADD
    everywhere (no TRACE IT).
  - TYPE in pencil from OSM, else last-used. CITY folded into the address
    line.
- **Waiting on:**
  - systems' squint on the lifted shape (and 46px rows at 320);
  - director rulings (V2 vs V3, items 1 and 3-5).
- **Next:** concepts, then real stills at 3x.

## UPDATE 2026-10-14, jam turn 31 (new visual designer): blank pin + blank-tag form
- **Owner:** revive C as ONE package with the add form as a blank tag you
  fill out. Float and A (round 7) are still with him; keep them open.
- **Form look (proposed):** three inks, one meaning each.
  - Print (navy small caps) = the form's own words.
  - Pencil (`--ink-2` graphite, the app's faces) = entries before ADD.
  - Stamp/ink-over on ADD = the confirmation.
  - Full-size tag, real proportions, cream, no band until STAR.
- **Blank stub:** ADD | STAR | VISITED. ADD sits in Directions' slot and
  re-prints as DIRECTIONS on add.
  - Inactive ADD is printed `--ink-2` with NAME IT FIRST under it.
  - Active ADD is a navy flood (orange = starred on a tag). **Open.**
- **Resting objects offered:**
  - V1 tag-first: a bigger tag with notches and perforation, + on the name
    line, blank orange pin.
  - V2 pin-only: no tag at rest; it pops out on tap.
  - V3 pocket: the tag tucked behind the list, top third showing (from the
    draw: library card catalogue).
  - Dropped: a stacked pad; a dashed-ring pin (it borrows visited's track).
- **My diagnosis of R6 C:** the pin already reads; the 84x66 tag lost the
  tag signatures (notches, stub, perforation), and the + wasn't on the tag.
- **Pairings:**
  - Float works plainly. Don't make the badge a "stamp": a stamp on a tag
    means visited.
  - A's orange tag cut now reads "starred" beside a real-looking tag.
    Proposed: A goes navy.
- **Next:** the director rules; systems measures the survivors; then stills.
  No sketches made this turn.


## UPDATE 2026-10-14, round 7 (jam turn 28): Float at the left, A as the Hanging Tag cut
- **Owner:** the badge is most interesting ("orange and bigger", but the +
  "on the left? Easier for me to reach"). The tag shape in the header
  "ties better to the view state". C is parked.
- **Scripts:**
  - `concepts/r7-stills.js` builds main copies with systems' r7 patches,
    plus Add = the ×'s ink + 12 and the prefix dropped below 338px of map.
    Writes `E-float/r7/`, `stub/r7/`.
  - `concepts/compose-r7.js` writes `E-float/R7-F1..F6` and
    `stub/R7-A1..A7`.
- **A layer:** `stub/r7.inc.html` (`data-a="tag7"`,
  `data-eye=none|hole|patch`).
  - Pick: none (the chamfers only, 14px).
  - The + is shifted 5px right to centre on the stock.
- **Decisions:**
  - Eyelet dropped: a hole is a dot, and a patch is a switch knob.
  - Float-left alignment as systems measured.
  - Form line A per the director.
- **Reads (for the director):**
  - × vs ▲ offset: mild, reads as the Add row's start.
  - The two left +s don't read as one family.
  - Squint: + first.
  - A with a starred tag open shows two oranges; the + keeps it add.
- **Gotcha:** the shared scratchpad's `sheet.py` was overwritten by
  another agent. Mine is in `scratchpad/vis/crops.py` now.

## UPDATE 2026-10-13, round 6b re-shoot (director turn 24: C 9 conditional on dropping the band)
- **The change:** C's resting tag has no band (`data-band="none"`).
  - Reason: on a real tag a band means starred, and this blank tag is
    unstarred cream.
  - The eyelet patch is the unbanded tag's own (solid paper, `--hair`
    grommet). The orange stays on the pin.
- **Re-shot:** `R6-C1`, `R6-C2`, `R6-C4` (pick column), `R6-C6` frame 1
  (`R6-C3`'s pick column follows the same frame). Clash-clean.
- **Squint test, plainly: the + no longer clearly comes before the account
  badge.**
  - Blurred, the 50px navy account badge is the darker, bigger mass. The
    32px orange disc is about level with it, and the cream tag nearly
    vanishes.
  - The band was carrying the rank. Captions now say so (C2 makes no claim;
    C4 says "about level").
  - Levers left, each with a cost:
    - a pin bigger than the map's 32px selected size (breaks "same size as
      the pins around it");
    - a stronger tag edge or shadow (the owner's restraint rule).
- **New standing check:** any part borrowed from a real component keeps
  that component's meaning in the state shown.

## UPDATE 2026-10-13, round 6b (after director turn 23: Float 9, A 9, C 8, D killed)
- **C rank fix.** The pick is now:
  - an orange-filled selected pin (32px, navy +);
  - a tag at 84x66 with the real tag's 1px warm edge (.38) and shadow;
  - the right edge on the account's ink line (right 19.9px).
  - Dials and squint: `C-pin/R6-C4`. The navy disc stayed a pair with the
    account; the edge is what keeps the cream from melting into the map.
- **C flow redrawn:**
  - the placed marker is the orange disc with a navy +;
  - the search glyph is the same pin;
  - stills `R6-C5` (tag open), `R6-C6` (tap, search, placed) and `R6-C7`
    (added: the + becomes the place's own filled pin).
  - The done frame needed the playground session (signed in, the stub's
    Add doesn't complete).
- **Float:**
  - `R6-F5` re-cropped;
  - new full screens `R6-F6` (tag open at 664, 3 rows), `R6-F7` (adding at
    844) and `R6-F8` (320 with a tag, 1½ rows);
  - captions say "a finer cut of the badge's edge" (never "postage
    stamp").
- **Script:** `concepts/r6b-stills.js` builds copies of today's main with
  systems' r6-check patches (`TAG_SHEET_GAP` 88 box, scale-aware Add,
  prefix dropped) and writes `r6/measure-r6b.json`. Everything is
  clash-clean.
- **Gotcha:** the page's tap target for C is `#pencilPin .c6-tagw`. The
  box centre can land on a bare corner (systems' hit-test note).
- **Open (flag to the director):**
  - the orange band on the miniature means "starred" on a real tag;
  - the orange disc vs the deep-orange clusters;
  - C's new 84x104 footprint needs systems' re-measure;
  - the squint margin is clear, but smaller than the Float's.

## UPDATE 2026-10-13, round 6 (turn 21; new visual designer): Float ranks, A routes, C real pin, D killed
Owner on 5b (verbatim in owner.md): ticket "disconnected" from place; C's
"pin doesnt look like a pin"; the Float is "the same weight and heirarchy
as account". Director turn 20 asked for the Float's hierarchy dials, A's
place routes, C rebuilt on the app's own pin, and one D frame. All of them
at 1x beside the account badge.

### Files (all new; nothing older edited except the docs)
- `concepts/r6-stills.js`: renders every round-6 frame into
  `E-float/r6/`, `stub/r6/`, `C-pin/r6/`, `D-floated-ticket/r6/` (3x + 1x,
  `measure.json` with clash lists). `ONLY=a,b` takes comma prefixes.
  - **Every frame is the same zoomed view** (setView 64.1471,-21.9426 z14):
    17 real pins are in shot and the account badge is always in frame.
- `concepts/compose-r6.js`: the owner stills.
  - Float: `E-float/R6-F1..F5`.
  - A: `stub/R6-A1..A3`.
  - C: `C-pin/R6-C1..C3`.
  - D: `D-floated-ticket/R6-D1`.
  - The 1x window is x150–390, y0–610 (account down to the list header),
    shown at 2x pixelated, with a blurred copy beside it (the squint test).
- Layers:
  - Float: `E-float/r6.inc.html` (dials `data-ff/fs/fc/acct`).
  - A: `stub/r6.inc.html` (routes on `data-a`; an SVG mask sized live).
  - C: `C-pin/visual-r6.inc.html` (`data-c6`, `data-ct="big"`).
  - D: `D-floated-ticket/d.inc.html` (`data-d`).

### Decisions and why
- **Float pick:** orange stock + navy 3px +, 60px (scale 1.2 about the
  lower-right ink corner), postage-stamp edge (24 lobes, depth 1.7).
  - Orange alone looks lighter than navy, and size alone still reads as a
    pair; together they win the squint test.
  - 10-lobe "rosette" reads as a flower or a gear.
  - The account frame (40px) isn't needed.
- **A pick: admission.** The tear line is 15px in, with half-round notches
  r6 on it.
  - Tag cut (chamfers + eyelet) is the only route that says place, but it
    isn't a ticket; offered to the director.
  - Punches killed (round = a dot; teardrop = a water drop, not our pin).
- **C pick: hi + big tag.**
  - The pin: `badgeHtml('add','circle',32,{ink navy, fill navy, mark
    cream, rim 2.5})`, which is the selected-pin grammar.
  - The tag: 72x56, band 22, chamfer 13, eyelet r3.2 at 11.
  - The object is 72x94.
  - **Gotcha:** concept.inc's `#pencilPin svg {52x64}` sizes every nested
    svg, so visual-r6 resets the pin, glyph and + svg sizes.
  - **Gotcha:** an SVG `<symbol>` inserted as HTML text loses its viewBox,
    so use DOMParser.
- **D: kill.** It reads as "A moved to the corner", and the pinned cut needs
  two marks.

### Open
- The Float's seam: the account's open state is also an orange field
  (sign-in crew / brand-token pass). Clusters are deep orange, so "the only
  orange object" holds only at street zoom.
- C ranks level with the account in the squint test (colour and position,
  not mass). If the director wants more, the next dial is the tag (80x62)
  or the pin's field in brand orange (but that risks reading as a cluster).
- C's placed marker, search glyph and form-tag haven't been re-drawn to the
  new pin yet (round 5 still uses the graphite ring). Needed if C goes
  forward.
- A tag-cut vs admission: the director's call.
- Owner Q1/Q2 still wait for an approved concept.

### Next
Systems measures the Float's 60px footprint and C's 72x94 slot; then the
director scores all of them in one pass.

## UPDATE 2026-10-13, turn 18: the director's turn-17 fixes (scores: Float 9, A 9, C 8)
- C: the dashed ring read as a loading spinner at 1x, so it's now an EMPTY
  PIN (solid 2px --ink-2 ring on paper), `data-ring="graphite"` in
  `C-pin/visual-r5.inc.html`; study `C-pin/r5/ring-*`. The same ring is on
  the placed marker. The search glyph is ring + string (a lone ring read as
  a radio button). `C-pin/stills.js` now layers visual-r5 (so the old stills
  re-render with the current pin); `compose-stills.js` takes `ONLY=`.
  Still title is "C · Blank pin".
- Credit "Leaflet |" dropped for Float and C (set with the `map` binding:
  `window.map` is the #map DIV, a trap that cost a re-render).
- Float: open = navy field + paper x (`R17` in `E-float/stills.js`), so ADD
  LOCATION is the one orange BUTTON (the account glyph is orange too). All of
  E1–E8 re-shot.
- A1 cost line = systems' measured 32px line.
- New standing checks before every handover: (1) a 1x "what does each mark
  read as" pass, (2) every caption against measure.json. Both done for this
  set.
- Next: the director re-checks and releases Float, A, C to the owner in one
  message.


## UPDATE 2026-10-13, round 5 (turn 15; new visual designer): baseline stills, A and C pushed
Context: the owner turned the A/B/C set down as concepts ("normal feedback",
not a rejection; owner.md). Director turn 13: show the **baseline Float**
(today's badge floated low) at its best alignment; push A (stop being
boring at rest, no added marks) and C (read as a + button, + glyph at least
the badge's weight, words optional, never a disc). B is ruled out. Every
concept still 1 sits **beside the baseline**, plus a 1x crop of the + area,
chrome-check clean, one cost line.

### Files
- `concepts/compose-r5.js`: composes ALL round-5 owner stills (1170 wide).
  Run after the three stills scripts.
- Baseline: `E-float/stills.js` (my renders of systems' prototype in
  Reykjavík; only the `<html>` config is set) -> `E-float/stills/`. Owner
  stills `E-float/E1..E8`. Spec: `E-float/looks-and-feels.md` (new).
- A: `stub/r5.inc.html` (the round-3 stub structure + the round-5 look;
  variants `ticket` (pick) / `wave` / `postage` / `seal` / `r3` on
  `<html data-a>`), `stub/r5-stills.js` (injects into the REAL index.html's
  text in memory) -> `stub/r5/`. Owner stills `stub/A1..A8`.
- C: `C-pin/visual-r5.inc.html` (layered after `visual.inc.html`; redraws
  only the resting pin; variants `ring` (pick) / `bare` / `big` on
  `<html data-c>`), `C-pin/stills-r5.js` -> `C-pin/r5/`. Owner stills
  `C-pin/C1..C7`.
- The 1x crops use ONE window (x150 y400 240x240 at 390x844) in all three.

### Decisions and why
- Baseline: keep systems' pick r-gutter-20 (ink 20 from the side and from the
  list; one ink line with the account badge). The 12 gap reads as sitting on
  the list; 16 matches nothing. Left is the close second (ink on the row
  icons' channel).
- A = `ticket`: concave 10px bites at the torn-side corners = the Hanging
  Tag stub's own notches; the perforation runs between them; `--tex-flood`
  paper; + 28px box, 19px arms, 3px stroke, navy, 4px optical shift right.
  Dropped: wave (pinking shears), postage (a stamp on the header), seal
  (two marks, the badge in costume).
- C = `ring`: no words; 60x48 die-cut orange tag (12px chamfers, punched
  eyelet, tooth, the tag's restrained shadow), navy + 26px box (18.7px arms,
  3.1px stroke), the straight string to an 18px pencilled ring. bare = a price
  label, dropped. Placed at the Float's exact corner (right 16, foot 20 above
  the list), credit to bottom-left.

### Open
- Float E5: two oranges (today's orange ON × next to ADD LOCATION). If Float
  wins, propose the open × as navy/paper (header ON rule): the owner's call.
- A: the open navy stock carries the tooth, unlike the flat ON tiles (the
  brand-token pass).
- C: systems' structural check of the new footprint; if the dashed ring
  reads as noise, try a thin solid ring before removing it.
- Owner questions (Q1 the ride, Q2 fly to new place) still wait for an
  approved concept.

### Next
Systems checks C's footprint; the director scores the round-5 set (Float,
A, C) in one pass from the 1x crops first. Then the owner gets: E1 + E8
(+E5), A1 + A2, C1 + C2, each one message's worth.


## UPDATE 2026-10-12, round 3 fixes (after director turn 10: B 9 pending, C 8, D killed)
- B fix 6 done: `#controls.show` max-height = --form-max - 26px (the credit's
  row reserved between badge and form). 6-keyboard: form y147, credit
  129-147, badge bottom 113; form scrolled to the CATEGORY boundary.
- C fixes: (1) the pin steps aside (150ms fade) whenever a .tag-popup or the
  filters panel is open (body:has). (2) Results = a full-width paper sheet
  capped by --res-max below the zoom/badge: 3 results at 664 + keyboard.
  (3) a capture click on #locationsList scrolls a not-fully-visible row in
  before the app selects it, so the new row after Add is fully in view.
  (4) Size knob --pin-s; study `4b-size-3x.png`; CHOSEN 1.25 (tag 55x39,
  15px words, tap area 65x83). (5) Still 1 carries the two plain-cost lines;
  new composed `3-tag-open-3x.png` with "close the tag to add".
- Desktop: the credit lifts above the bottom search bar while adding.
- NEW: `concepts/chrome-check.js`, run by both stills.js, writes `clash`
  into stills/measure.json (badge/zoom/credit/pin vs form/strip/tag/results/
  bar/filters). All owner frames are clean; the only flag is
  pending-filters-664 (today's own filters panel over zoom). Use it on every
  new frame type before sending: the director's recurring blocker.
- Rulings recorded in C's looks-and-feels: 16px overlay selects/notes/search
  (no zoom lock), draft kept on cancel (systems).
- Next: director re-scores C; if 9, owner gets stub + B + C in one message.
  Then handoff "How it looks and feels" for whichever the owner picks.

## UPDATE 2026-10-12, turn 9 (new visual designer): B and C at owner fidelity, D frame
Taking over from the previous visual designer. Context: the owner said "i want
more than one concept"; the stub stays in the set; director turn 7 opened B
(striker strip), C (pencilled pin), D (eyelet, one frame). Systems turn 8
prototyped B and C (structure, wiring, measurements). Owner answers to Q1-Q3
come only after a concept is approved.

### How the files fit
- Each concept folder: systems' `concept.inc.html` + `render.js` (rough
  frames/), `index.html` = copy of the real file + concept.inc. MY look is
  `visual.inc.html`, injected in memory by my `stills.js` (at the LAST
  `</body>`: systems' comment contains a `</body>` string). Raw stills in
  `stills/`; captioned owner stills at the folder root via
  `concepts/compose-stills.js B|C`. If systems re-runs render.js the copy is
  rebuilt; my stills still layer on top.
- D: `concepts/D-eyelet/render.js` builds its own copy; one frame + verdict.

### B decisions (looks-and-feels.md)
- Orange field through `--tex-flood` (the band's paper tooth) = printed stock,
  not a checkout bar. 15px button type, + 18px. 56px = a row's height; orange
  runs under the home bar.
- No navy top rule: ONE perforation (tag stub rule, paper on orange, hair on
  paper), continuous across x and field. Collapsed: band loses its bottom
  rule and sits on the strip = one ticket.
- Inactive = paper (the form's paper) + navy "ADD" + write-in blank; ready =
  orange "ADD <NAME>"; adding = deep orange + paper words; x = paper segment
  at the left, hair divider only when both paper.
- Form keeps the 2px navy top rule; systems' cast shadow removed.
- Motion: form slides out of / back into the strip, 0.3s ease; colours
  switch, never blend.

### C decisions (looks-and-feels.md)
- Blank pin = dashed ring + straight string + 44x31 orange die-cut tag
  printed "+ ADD" (12px). Reads at 1x. Killed systems' teardrop.
- Search line = band paper, ring glyph, no input box/focus ring.
- Placed marker = the dashed ring (CSS on systems' .pencil-marker).
- Blank tag = real tag structure (.tag-shadow/.tag-stock/.tag-patch/.tag-in/
  .tag-stub) wrapped round systems' h3/.addr/#addForm; CITY/TYPE pencilled
  entries on dashed rules (field-sizing: content; Chromium only); notes as a
  write-in line; stub = STAR | ADD LOCATION (2fr, orange tooth). Star prints
  the band. "Category" label shown as "Type". 270px tall at 390.
- Motion: tag pops down out of the ring (tag-pop/tagString 280ms); Add inks
  the ring into the real pin (stamp ink-bleed), stamps TYPE, swaps the stub.

### D
Killed: docked-FAB / drag-knob read, covers OSM credit, crowds the title.

### Open
- Director: score B/C; rule on C 664 failures (my visual vote (b) pin steps
  aside under an open tag; close filters to add).
- B: does "ADD ____" read as pick-first? Fallback copy noted.
- C: iOS <16px focus zoom on pencilled selects/notes (overlay / 16px);
  new row may land half below fold after Add (systems).
- B keyboard riding: iPhone check.
- After the director's pick: owner set = stub + whichever of B/C reach 9;
  then the handoff "How it looks and feels" for the approved one.

---

## Previous designer's notes (history)

## UPDATE 2026-10-12, after the director's score of 8 (fixes 1 + 2 applied)
- Fix 1, form anchored to the band: `#controls.show` absolute, bottom 0 of
  #mainContent (which ends at the band), grows upward, z 900 (over map,
  under sheet). Top padding --s6; the 2px navy rule moves to the top edge;
  the attribution rides up to the form's top edge (body.adding
  .leaflet-bottom{bottom:var(--form-h)}). Measured: 664 form top y140
  (badge ends y66, 74px clear), Add 536-580, x 604. 844 Add 716-760, x 784,
  map above (empty here because the pins sit under the form; flagged).
- Fix 2, no blended field: colour transitions removed; the field/glyph
  colour switches (press = deep orange; release = navy), and only the glyph
  rotation animates (0.3s). Strip middle frame re-shot: clean navy.
- New still `2-adding-844-3x.png`; strip, overview and captions
  recomposed. looks-and-feels.md updated (form section, motion).
- Fix 3 (send stills, not the sheet) is the orchestrator's.

## Earlier: concept phase
- Jam closed (director turn 6): ONE concept, the claim-check stub. Tab, seal,
  stamp, one-band all dead. Rulings: list drops while the form is open
  (owner decides, Q1, stills show it); title drop order " list" -> count ->
  city ellipsis (decided, also for plan names); x paper; one ON tile in the
  band at a time; perforation must read at 1x.
- Rendered the five owner stills + overview into `concepts/stub/`
  (`render.js` for the raw stills, `compose.js` for the pair / strip / states
  / overview). Spec and motion in `concepts/stub/looks-and-feels.md`.
  Systems owns `how-it-works.md`, `appendix/`, `jobs.md` (consistent with
  mine: checked states, 60px, rotation).
- Perforation 1x check: --hair on orange is 1.87:1, faint at 1x
  (`perf-1x-hair.png`). Raised to --paper (2.46:1, `perf-1x-paper.png`),
  the paper showing through the holes. No marks added.
- Motion settled: the + -> x turn + field crossfade run 0.3s ease, the
  sheet's own collapse timing (was 150ms in the jam; changed so the turn
  spans the ride as one gesture). List already down: same turn in place.
- Stills use Reykjavik (the real trip) except still 5 (Copenhagen).
  REYKJAVIK LIST (23) fits at 390; COPENHAGEN (23) drops "list" at 390;
  COPENHA... at 320.
- Real-app behaviours verified in render: Add hit-tests as ADD LOCATION at
  390x664 with the drop (stub y 604, Add y 450-494).
- Jobs check (jobs.md 1-6): 1 reach (stills 1/3, appendix collapsed and
  filters), 2 primary (still 1), 3 finish near thumb at 664 (still 2),
  4 cancel restores (motion spec: exact reverse), 5 never over pins/tag/
  names/x (stub lives in the header; still 3), 6 signed out looks identical
  (appendix). Covered.
- Next: director/CD scoring of the concept; answer the builder later in
  handoff.md "How it looks and feels". Optional tappable copy for the owner
  only if the director asks.

## Where things stand (2026-10-12, after jam pass 2 = my turn 5)
- Turn 2 (pass 1): four directions sketched (`concepts/sketches/`).
- Director turn 3: **stub leads**; tab killed (reads as a sheet pull-handle,
  plus attribution/tag-gap/rail costs); stamp killed; seal = "least change"
  baseline frame only. Six checks set.
- Systems turn 4: stress test (`concepts/stub-stress/`): stub passes safe
  area, filters visible, tag hierarchy, signed out/playground, desktop rail;
  fails 320 on width. Found a pre-existing bug: below ~790px tall the list
  sheet covers ADD LOCATION. Proposed: list drops to its band while the form
  is open; opening the form closes filters/sort. One-band wildcard dropped.
- My turn 5 (pass 2): spec-grade stub look. Stills + script in
  `concepts/sketches/pass2/` (`render.js`, `ONLY=<prefix>`; `measure*.json`).
  Key sheets: `width-study-3x.png`, `states-3x.png`,
  `form-664-A-vs-B-3x.png`.

## The stub as it stands (my spec)
- 60px wide (= tag stub height), full header height, flush right, to the
  screen edge. Centre x = rows' x centre at every width (390: 360; 320: 290).
- Icons: three 32px tiles at --s1 (4px) gaps, --s1 to the stub. Title room
  at 390: 154px (today 186; turn-2 sketch 118).
- Title = spans name / " list" / count; drop order "list" first, then name
  ellipsizes; count never truncates. 390: COPENHAGEN (112). 375:
  COPENHAG... (112). 320: COP... (112) -- proposed: drop count before
  ellipsizing the name (-> COPENHA...). Nit: sliver gap after the ellipsis.
- Perforation: the tag stub's exact rule (1.5px dashed var(--hair), 10px end
  insets), placed var(--s1) INSIDE the orange -- on the seam it read as a
  glitch; inside, it reads as punched holes. Same on navy. No notches (dots),
  no texture, no shadow.
- States: rest orange/navy + (= ADD LOCATION); pressed orange-deep/paper +
  (= submit press); open navy/paper x (= header ON tile, --state-on-bg/fg);
  pressed-open keeps the tile. + rotates 45deg into x with field crossfade,
  150ms; no pop, no grow.

## Decisions so far and why
- x is paper, not orange: matches the header's ON system; orange-on-navy is
  the account badge's rest look and would re-twin the controls.
- Form open: back systems' "drop" (A). Hold-and-scroll (B) at 664 hides
  Search and pins Add over Address -- looks broken. Always drop (one
  behaviour). Existing collapse motion; the +->x turn rides with it.
- BUT A moves the x 240px on the tap (list-up state) -- literally the
  owner's "button changes physical location after click". Must go to the
  owner as a plain question (wording in jam turn 5), not under the
  director's reading.
- "One ON tile in the band at a time": opening the form retracts the
  filters panel and un-tiles filters in the same beat.

## Director objections (turn 3) and status
- "Reads as an orange toolbar slab, not a stub" -> answered with the tag's
  perforation placed inside the orange, 60px on the x axis. Director to
  judge.
- Tab: accepted the kill (no answer to the pull-handle misread).
- Wants rest/pressed/open side by side with the account badge -> done
  (`states-3x.png`).

## Open questions
- Director/owner: add count to the drop order at narrow widths?
- Owner: OK that the x rides down with the list when the form opens?
- CD: account-open (orange field) = stub-rest colouring; sign-in crew's area.
- CD: two oranges with a starred tag open (star vs add) -- one family per
  the ledger, confirm.

## Randomness used
Pass 1: Oblique "Disconnect from desire", "Consider transitions"; fields
postal service, clockmaking; twists "half hidden", "eyes closed". Pass 2:
none new (refinement pass).

## Next
Director steers: is the stub ready to become the concept, and which
questions go to the owner. Then concepts with systems: full frames (rest,
collapsed, tag open, form open via drop, filters->form, signed out, 320,
desktop) at 3x, plus the seal baseline frame for comparison.
