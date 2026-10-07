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

**Starred, final (after `cd-check.md`).** The navy tile is gone. It copied the
`.seg[aria-checked]` "selected option" look, it was the heaviest mass on the
tag, and it made navy mean both starred and visited. My earlier claim that it
was "the rule every on/off control uses" was wrong: the state system's named
exception 2 says star and visited "on" is a filled glyph with no tile.

Starred now follows the state system (the filled black star) and gets a mark
of its own from the app's grammar: **printed = the guide's facts, stamped =
where you've been, pencilled = what you care about.** It's a loose
hand-drawn pencil loop around STARRED, the way you'd circle something on a
tag; the references have handwriting in their fields. It's drawn in `--ink`
at pencil weight (1.2px, 60%), loose and tilted so it never reads as the stamp's oval, with no tile and no colour, so it stays well
under the name. Visited stays the stamp on its segment, so each state has
its own mark.

**The colour question, plainly, for the owner:** stars are black everywhere
in the app because the team ruled the orange accent clashed with orange
category rings (Pencil Star rounds 4–6). That was a team ruling, not the
owner's words. The owner has asked for "a color focus … on starred". Should
starred have a colour app-wide, on the pin, list and tag together? Until the
owner says yes, the tag keeps starred black and gets its personality from
the pencil mark instead.

### Colour map (tag) vs meaning elsewhere

| Colour (token) | In the tag | Elsewhere in the app | Same meaning? |
|---|---|---|---|
| `--paper-raised` | tag stock | raised surfaces: chips, fields, sticker face, plan slip | yes |
| `--paper-filed` | the tag's paper once visited | a visited list row's field | yes |
| `--paper` | the eyelet's reinforcement patch | the base ground | yes (a paper step) |
| `--paper-pressed` | the patch once the tag is filed | the pressed row (one step down) | a paper step only; no "pressed" meaning implied |
| `--ink` | name, note, Directions, Star, the filled star, the pencil loop | body text; the black star on pin and list; the Pencil Star graphite | yes |
| `--ink-2` | address, TYPE/PLAN, ×, the string | metadata and labels | yes (a quiet line) |
| `--hair` | perforation, dividers, grommet | 1px rules, dashed borders | yes |
| `.row-stamp` ink, `color-mix(--navy 82%)` | the VISITED stamp on the stub | the list row stamp | yes. Pins use `STICKER.INK` #3A4C5B, the same ink flattened |
| `--navy` | sign-in slip text | `#planSlip` text | yes |
| `--figure`, `--figure-deep` | not used | accent buttons, selected row, cluster | n/a |

**Off-token hex values: none left.** The patch, the grommet, the screened
patch and the string now use `--paper`, `--hair`, `--paper-pressed` and
`--ink-2`. The only literals left are `#fff`/`#000` in SVG masks.

**Restaurant case** (`star-resto`): a starred Bæjarins Beztu under the
Reykjavík palette, where the accent #A8400C is closest to restaurant
#AC5019. With no accent in the tag there's no clash.

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
