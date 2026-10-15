# Hanging Tag v3 (round 5)

Designer, 2026-10-06. Concept stills only; the app's `index.html` is untouched.

## Owner's notes (verbatim)

"the whole area down there being just for visited makes no sense. thinking of
that area kind of like a claim check maybe the directions button gets put
there centered? or maybe it's a segmented area with multiple buttons? here
are some more reference shots. i don't like the new palcement of category
type."

The reference shots are in `design/inspo/luggage-tags/` (described in
`design/inspo/README.md`). Both quotes are in `docs/owner-taste.md`.

## What I took from the references

- **The order on the tags:** one big destination word, then small fields,
  each with a tiny caps label above its value (FLIGHT, DATE, TO, No. of
  Pieces), divided by thin rules. Then a perforated claim stub at the foot.
- **The eyelet:** a reinforcement patch around it (the brown patches on the
  Southern Pacific checks). Here it is a quiet paper-tone patch with a
  neutral grommet.
- **The place name is the "destination"**, in condensed lettering. I didn't
  invent a fake code; the name already plays that part.
- **I left out serial numbers.** They carry no meaning for us, so they would
  be decoration.

## Kept from v2 (owner-approved)

- The tag pops out of the pin onto a straight string. The motion is
  unchanged from round 4 (`../../round4/tag/stills/pop*`).
- The short address, street · neighbourhood, sits under the name.
- Notes always show in full, including the 8-line approx note.
- Signed out: the actions are visible but disabled, and Directions stays
  live.
- The list drops to its header while a tag is open, and the pin turns to
  its visited sticker when the place is visited.
- Districts hang from their diamond seal.

The header band now holds only the eyelet and the ×. **Type has left it**
in both variants.

## Variant 1: Segmented stub (`seg-*`)

- **Stub.** The claim stub is three equal segments split by dashed rules:
  DIRECTIONS (orange), STAR, MARK VISITED. Each segment is about 105×60, a
  whole-segment target, with the icon above the word, like the labelled
  boxes on the tags.
- **Visited.** Its moment is the conductor's punch through the Visited
  segment: a check-shaped hole, the map showing through, and the chad
  dropping out (`seg-v1` → `seg-v3`). The pin flips to its sticker at the
  same time.
- **Type.** A labelled field line under the note, tier 2: `TYPE  BAR` and,
  in Plans, `PLAN  STOP 2 OF 3`. It reads like a tag's FLIGHT / DATE line:
  quiet, but in a clear slot.
- **Weak spot.** Directions is one of three equals here, not the hero.

## Variant 2: Claim check (`claim-*`)

- **Stub.** The stub is the claim check: DIRECTIONS centred, larger (13px
  caps, 20px compass). It's the one thing you take with you, as the owner
  suggested.
- **Fields.** Above the perforation is a row of labelled fields, as on the
  references: TYPE (+ PLAN) | STARRED | VISITED.
  - Star and Visited are "check here" fields (the Hawaiian Air tag's "CHECK
    HERE IF BAG IS RECEIVED DAMAGED ☐").
  - When visited, the list's own VISITED stamp comes down into its field
    (grow, then shrink).
  - Each field is a ≥44px target; the fields sit under 1px hair rules.
- **Weak spots.**
  - The empty ☐ in the Visited field is a control, but it could read as a
    mark for an empty state. CD to judge.
  - The field rules add lines.
  - "Star" under a "Starred" label is a slightly odd pairing.

## Truth list (`docs/ux-brief.md`)

- **J1 identify:** the name in lettering, with the short address under it.
- **J2 decide:** the full note, every length.
- **J3 Directions:** one tap. A whole segment in variant 1; the centred
  claim check in variant 2, which is about 316×60.
- **J4 Visited, J5 Star:** one tap each, in fixed slots that don't move
  when toggled.
- **Type:** tier 2, in a labelled field under the note, never in the
  header.
- **J6 plan stop:** the PLAN field.
- **J7 close:** 44px × plus a map tap.
- **J8 address:** the short form under the name.
- **Signed out** (`*-signedout`): Star and Visited at the state system's off
  alpha, Directions live.
- **Rules held:** no star mark unless starred; the unstarred star is a
  labelled control. Pins are unchanged except for the shipped visited
  sticker.

## Files

- `stills/{seg,claim}-{busiest,typical,approx,bare,shape,signedout,v1,v2,v3}-{phone@1x,crop@3x}.png`
- `tag3.js` draws the tag; `render.js [name ...]` re-renders.
- Chromium only, with a stand-in basemap.

---

## Fixes after `ux-review.md` and `cd-review.md`

- **Punch.** Now a flat cut-out: the map shows through, with only a faint
  soft 1px inner edge and no bevel or drop shadow. It's 17px, the same size
  as the other icons. The chad is the hole's own shape in flat paper. At 1x
  it is quiet, and the navy VISITED word carries the state. Its contrast
  depends on the real tiles under it, which are unchecked (the basemap is a
  stand-in).
- **Icon sizes**, matched by drawn ink: compass at 20px (its ring draws
  small), star at 18px, check at 17px.
- **Unvisited** is an outline check, drawn like the outline star, instead of
  the bare ring.
- **The type value is tier 2:** weight 500, `--ink-2`.
- **Directions in Segmented** gets a larger glyph and 11px type. It's the
  only coloured segment.
- **Claim check kept, without the grid.** No ruled cells and no ☐. Type sits
  on the same quiet line as in Segmented, with Star and Visited as two
  ordinary controls under it. Directions stays the centred claim check, and
  Visited gets the same punch. TYPE reads as data, not a control. The copy
  pairs are the app's own: Star / Starred and Mark visited / Visited, with
  no verb-to-"YES" flip. VoiceOver names are "Directions", "Star /
  Starred" and "Mark visited / Visited"; with no label/value split left,
  each reads as one control.
- **Worst case** (`*-worst`): starred, visited, plan stop, the 8-line approx
  note, signed out. The punched hole fades when signed out.
- **The owner page** is `../index.html` ("Hanging Tag v3"), built by
  `../build.js`.
