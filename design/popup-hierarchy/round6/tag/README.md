# Hanging Tag v4 (round 6): the Segmented stub, with colour and a Visited moment

Designer, 2026-10-07. Concept stills only; the app's `index.html` is
untouched. The owner picked **A Segmented stub** in round 5.

## Owner (verbatim)

"1. Segmented stub is awesome. I now wonder about the color application in
there — should we give that more personality? Directions feels unnecessarily
orange and like maybe a color focus would be better on starred. Also when
visited is tapped should we screen it back with the visited stamp on top? Or
use another action method to trigger the stamp that makes more sense?
2. Direction stays tappable, tapping greyed out should offer sign in.
3. Let's try it idk yet.
4. Districts and streets need a map pin type."

The colour note and the signed-out decision are recorded in
`docs/owner-taste.md` (2026-10-07).

- **Note 3** (the list drops to its header while a tag is open): kept. It
  isn't settled; the owner will judge it live.
- **Note 4:** another designer is drawing the district and street pin. The
  diamond in `star-shape` is a **placeholder**; the string will hang from
  the new pin.

## Colour: three applications

Directions is ink in all three; it is no longer the orange focus. Colour
only ever says something.

- **A. Starred carries the colour** (`star-*`).
  - The stub is ink on paper.
  - A starred place's Star segment is printed solid in the city accent
    (`--figure-deep`) with paper type, like the coloured fields on the
    references (`design/inspo/luggage-tags/1.jpg`, `2.jpg`).
  - Unstarred, the segment is ink, so the colour appears only when it means
    "I care about this one". The owner's suggestion, taken literally.
  - Cost: the stub is plain until you star something.
- **B. The stub is printed in the pin's colour** (`cat-*`).
  - The whole tear-off strip is the pin's category ink with paper type
    (`3.webp`, `4.webp`: colour-coded stubs). The stub you keep matches the
    pin you tapped, which ties the pin and the tag together.
  - Cost: it's a colour slab on every tag. It communicates category,
    which the pin already does. The CD may call it decoration, and starred
    has no colour of its own here.
- **C. Two-ink** (`two-*`).
  - Ink everywhere. Colour appears only on state: a starred star in
    `--figure` with its word in `--figure-deep`, and VISITED in stamp navy.
  - Cost: it's the quietest of the three, so the least "personality".

My lead is **A**: the colour lands exactly where the owner pointed and
carries a meaning.

## Visited: three triggers

All three keep Visited one segment, 44px or more, in a fixed slot, with
undo on the same segment. The pin turns to its visited sticker on completion
in every option.

- **1. Screen-back + stamp** (`screen-1` → `screen-3`, `screen-busiest`).
  - One tap. The list's own VISITED stamp comes down over the tag (big and
    faint, then a shrink) and lands at the tag's lower right, above the
    stub.
  - The tag's paper turns `--paper-filed`, the filed tone of a visited list
    row, so "screened back" uses the list's existing visited language.
  - The text isn't dimmed, so notes stay readable (tier 1).
  - Undo: tap the ✓ VISITED segment.
  - Cost: two visited marks on one tag (the stamp and the segment's ✓), and
    the stamp can sit near the type line.
- **2. Press and hold** (`hold-1` → `hold-3`, `hold-busiest`).
  - The segment says HOLD: VISITED. While held, a ring fills around the
    check (about 450ms). Release early and nothing happens; complete it and
    the segment inks VISITED.
  - Cost: it isn't one tap. The UX hard limit is "one tap or clearly
    discoverable": the copy says HOLD, but a plain tap does nothing, which
    needs a nudge (for example a ring blip). It prevents accidental marks.
    Undo also needs a hold.
- **3. Punch** (`punch-*`): v3's flat punched check, kept as the baseline.

My lead is **1**. It is the owner's idea, it is one tap, and it reuses the
stamp and filed paper the list already uses for visited.

## Signed out (owner decision)

- **Directions stays live.** Star and Visited are greyed (`star-signedout`).
- **Tapping a greyed control** slides a navy sign-in slip out under the stub
  (`star-signin`): "Sign in to star places and mark them visited. SIGN IN".
- The tag doesn't move. Tapping the slip, or anywhere, dismisses it.

## Truth list (`docs/ux-brief.md`)

- **J1 identify:** name, then the short address.
- **J2 decide:** the full note.
- **J3 Directions:** one tap, now in ink.
- **J4 Visited:** one tap (1, 3) or a hold (2), in a fixed slot, with undo
  in the same slot.
- **J5 Star:** one tap. Its colour shows the state (A).
- **J6 plan stop:** the PLAN field.
- **J7 close:** 44px × plus map tap.
- **Signed out:** live Directions, plus the sign-in slip on a greyed tap.
- **No star mark** unless starred; the unstarred star is a labelled outline
  control.

## Files

- `stills/{star,cat,two}-{busiest,typical,bare}`, plus `star-shape`,
  `star-signedout` and `star-signin`.
- `{screen,hold,punch}-{1,2,3,busiest}`.
- Each still has a `phone@1x` and a `crop@3x` version.
- `tag4.js` draws the tag; `render.js [name ...]` re-renders.
- Chromium only, with a stand-in basemap. Pink marks are annotations.

---

## Fixes after `ux-review.md` and `cd-review.md`

**Dropped:** colour B, press-and-hold (2) and the punch (3). The proposal
is **A + Visited 1**. C + 1 is the one quiet alternate, shown once
(`two-busiest`, `two-typical`).

**The colour conflict, superseded by the owner's palette note (2026-10-07):**
"Keep in mind the brand color palette.. we should be using best practices
around how to apply consistently and meaningfully". The first fix (a 30%
`--figure` print) gave the city accent a new meaning, "starred". The app
had already ruled that out: stars are black `--ink` everywhere, and
`--figure-deep` was dropped from the star because it "merged with/clashed
against orange category rings" (`docs/shipped.md`, Pencil Star rounds 4–6).
`--figure-deep` also already means "cluster" on the map and "selected" on a
row. So **the tag uses no city accent at all.** Starred uses the state
system's existing **ON** rule (`design/state-system/`: "on / open /
selected = `--state-on-bg` tile + `--state-on-fg` glyph"): a navy tile, inset
by `--state-tile-inset`, with the paper star and STARRED. Starring is an on
toggle, so this is the app's own grammar, and it's the brand's navy (the
frame). The star stays the app's one star shape; only its tile says "on".
The dashed dividers and notches stay visible around the inset tile, and the
name still leads at 1x. Alternate C is now **no colour**: the filled black
star only.

### Colour map (tag) vs meaning elsewhere

| Colour (token) | In the tag | Elsewhere in the app | Same meaning? |
|---|---|---|---|
| `--paper-raised` | tag stock | raised surfaces: chips, fields, the sticker face, the plan slip | yes |
| `--paper-filed` | the tag's paper once visited (screen-back) | a visited list row's field | yes |
| `--ink` | name, note, Directions, Star, the unstarred star | body text; the star on the pin and in the list | yes |
| `--ink-2` | address, TYPE / PLAN, × | metadata and category labels | yes |
| `--hair` | perforation, dividers, grommet edge | 1px rules, dashed borders | yes |
| `--state-on-bg` (navy) + `--state-on-fg` | the starred segment's tile | every ON / open / selected control tile | yes, starred is an on toggle |
| stamp navy 82% | the VISITED stamp on the stub | the row stamp; `STICKER.INK` on pins | yes |
| `--navy` (sign-in slip text) | slip copy | the `#planSlip` text | yes |
| `--figure`, `--figure-deep` | **not used** | buttons and accents, selected row, cluster | n/a |

No new hex values. The eyelet patch `#EDE4D3` / grommet `#CFC5B1` from
round 5 are paper steps between `--paper` and `--hair`. Nothing in the app
changes meaning, so there's no app-wide decision. **Owner question,
optional:** does "starred" want a colour of its own app-wide? Today it's
black everywhere, and the tag keeps it that way.

**Restaurant case** (`star-resto`): a starred Bæjarins Beztu under the
Reykjavík palette, where the accent #A8400C is closest to restaurant
#AC5019. With no accent in the tag there's no clash: the navy ON tile sits
under the orange pin.

**One VISITED on the tag.** The stamp now lands **on the Visited segment
of the stub** (a stamped claim stub, as on the references). The stamp is
the segment's content and its undo control (`aria-pressed`, label
"Visited"). There's no separate ✓ word and no stamp floating over the body,
so it has a reserved spot that never touches the note or the TYPE/PLAN line.
The pin's sticker is the map's own mark on another surface, as everywhere
in the app.

**Screen-back** is the paper only, turning `--paper-filed` (#E7DFD0, the
visited row's paper). Text stays at full contrast. The step is visible at
1x (`star-busiest`, `st-3`, `st-4`). It's paper tone, not opacity, so it
can't look like signed-out dimming.

**Sign-in slip** (`star-signin`), rebuilt in the `#planSlip` language:
paper-raised, 1px hair top and bottom, navy condensed caps, and an
underlined SIGN IN after a hair divider (a 44px target). It sits at the
tag's width, just under the stub, and the tag doesn't move. Behaviour
contract:
- The first tap outside only dismisses the slip; it doesn't close the tag
  or reach the map.
- Greyed controls stay focusable with `aria-disabled="true"`, labelled for
  example "Star, sign in to use".
- The slip is `role="status"`, so VoiceOver announces it.
- After signing in you come back to the same tag, still open.

**Stamp motion** is now a phone-readable filmstrip, `filmstrip.png`, built
by `../build.js` from `st-1`…`st-4`: tap, then the stamp comes down big and
faint, then lands with a shrink, then settles.

The owner page is `../index.html` ("Hanging Tag v4").
