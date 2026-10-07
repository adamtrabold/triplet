# CD review: shape pin (round 6)

Fresh CD, 2026-10-07. I did not author, suggest or score any of this work. Brief: `docs/cd-brief.md`.
This is a concept round: "we're trying to rate concepts here not execution — tell cd don't kill if
the mock was bad kill if the idea was bad." I kill on the idea. Flaws in the mocks are fix notes.

Gating: these are concept stills only. `index.html` is untouched (the last commit to touch it is
`be4105e`, before this round). Nothing is built, so no unseen look lands.

## Verdict

**Show after these fixes.** Rank: **1. Staked pennant (KEEP)**, **2. Trail blaze (KEEP)**,
**3. Tie-on tag (KILL)**. Show the owner two variants, not three ("Fewer variations").

## 1. Owner taste that applies (read before the stills)

- "Simple, simple, simple"; "Dots add an insane amount of visual noise absolutely not"; "Fewer
  variations".
- "I like whimsy and these all seem kinda average." Whimsy must carry meaning, not decoration.
- "Bonus points but not required if the map pin is conceptually aligned with whatever it "opens up" to".
- "Visited vs pin are not differentiated nearly enough"; visited = "coloured in with reduction of
  information"; "the pin colors… I want the checkmark cream and the pin sticker the dark color".
- "No star unless it's been starred."
- "Keep in mind the brand color palette.. we should be using best practices around how to apply
  consistently and meaningfully". "Colour must communicate, or go neutral." "Color coding is not
  enough."
- "Same category icon treatment on map and popup"; "Mark size matches text weight"; "Secondary marks
  never outrank content"; "Busy views must keep their hierarchy".
- "Nothing past the shape's edge that makes no physical sense"; "Shadow is too harsh".
- "The tag pops out of the pin onto a straight string" (settled).

## 2. Scores (concept, then execution)

| Rank | Variant | Concept | Execution | Call |
|---|---|---|---|---|
| 1 | Staked pennant | 8 | 6 (capped) | **KEEP** |
| 2 | Trail blaze | 7 | 6 (capped) | **KEEP** |
| 3 | Tie-on tag | 4 | 5 (capped) | **KILL** |

The execution cap of 6 applies to all three, from the same rejected-pattern match (the street glyph is
literal dots, see section 4). That glyph is shipped and shared, so it does not drag the concept scores.

### Staked pennant: KEEP (concept 8)

- **Best "area, not a place" read at 1x.** In `pennant-busy-z14-phone@1x` it is the only shape pin
  you can find without hunting. A flag is not a seal, so 25 round pins and five flags separate by
  silhouette, not by colour. That answers "color coding is not enough".
- **Best visited.** The flag filled in `STICKER.INK` with a cream check (`pennant-states`, VISITED
  column) is "coloured in with reduction of information" exactly: the glyph and the category colour
  go. Outline flag vs solid flag is the clearest visited/unvisited difference in this round, so it
  answers "Visited vs pin are not differentiated nearly enough". The lack of a peel is right, because
  a flag is not a sticker. The cream check and the slate keep it in the visited family.
- **Real whimsy with meaning.** "Plant your flag" is what visiting an area feels like, drawn from the
  park-pennant and trail ephemera. It is not decoration.
- **The bonus, partly.** When open (`pennant-district-crop@3x`), the staff runs into the string, so
  the tag hangs from a flagpole. That is one continuous line from the claim to the claim check.
- **Risks (fix notes, not kills):**
  - The glyph is 11.5px. The staff adds a thin vertical line per shape.
  - The flag sits up and right of its point, so it covers neighbours. In `pennant-plan-crop@3x` the
    street flag sits on the café pin.
  - When open, a contact-shadow smudge floats halfway up the pole (`pennant-district-crop@3x`).

### Trail blaze: KEEP (concept 7)

- **The most consistent with the palette and the system.** It is the list's own diamond badge, with
  the same rim, field and glyph. The selected inversion is the shipped place-pin rule, and visited is
  the shipped dark sticker cut as a diamond. Of the three, this one meets the owner's colour rule
  most strictly: every colour keeps its meaning.
- **Visited reads** (`blaze-busy-z14-crop@3x`): the dark diamond with a cream check is clearly
  "visited" and clearly "not a place".
- **Its risk is the owner's "kinda average".** The trail-blaze story (the PCT diamond in the Yosemite
  scrapbook) is real. On screen, though, it is a 26px diamond outline that is easy to miss among
  seals at 1x (`blaze-busy-z14-phone@1x`). It needs the inspo story told beside it on the owner page.
- **The bonus is weak.** A diamond opening a tag is not one idea.

### Tie-on tag: KILL (concept 4)

The flaws are in the idea, not the mock:

- **Two tags on one string.** The pin stays on the map while its tag is open (settled), and this pin
  *is* a tag, so when open a small tag hangs over the big tag (`tie-district-crop@3x`). No better mock
  removes that.
  - The string also has to run from the eyelet across the small tag's face to reach the big tag, which
    breaks "nothing… that makes no physical sense".
- **A hanging mark sits south of its point.** That is how hanging works, so the body always covers
  the map below the label point:
  - over the restaurant pin in `tie-busy-z14-crop@3x`;
  - over the stop-4 restaurant in `tie-plan-crop@3x`.
- **Every pin carries a punched eyelet.** That is a dot on each shape pin. On a busy map it
  re-introduces the dot noise the owner rejected.
- **Visited keeps the coloured rim under the sticker** (`tie-states`). That adds information instead
  of reducing it.

The bonus alignment was the right instinct. The owner called it a bonus, not a rule, and here it
costs more than it earns.

## 3. Owner-objection prediction (owner's voice, 1x on a phone)

1. "Why are the street lines a chain of grey dots, and why is the district outline grey when its pin
   is teal? I said use colour consistently and meaningfully."
2. "The street icon in the pin is a few specks. I can't read it." For the blaze: "This is just the
   diamond again. Kinda average."
3. "The visited district is sitting on top of a restaurant pin. Which one is which?" For the tie:
   "Why are there two tags?"

All three are plausible, so the work is not ready as shot.

## 4. Noise count: `*-busy-z14-phone@1x` (the busiest view)

- **Marks:** about 25 place seals (round, 8 category inks), 5 peeled slate stickers (visited),
  5 stars, 3 district outlines (grey, dashed, 0.12 fill), 2 street lines (grey, 6px, round dots),
  and 5 shape pins.
- **Distinct shape-pin additions:**
  - Blaze: 1 new form (the diamond, already in the list) and 2 colours (teal, rust), both already
    categories. No new lines.
  - Pennant: 1 new form (flag), 2 category colours, plus 5 thin `--ink-2` staffs.
  - Tie: 1 new form, 2 colours, 5 eyelets (dots) and per-pin tilt.
- **Rejected-pattern matches (each caps the score at 6):**
  1. **The street glyph is dots.** `#g-street` is `stroke-dasharray="2 8"` with round caps, which
     makes three dots on a curve. Inside a 24px pin it reads as specks (all variants,
     `*-street-*`, `*-states`). It is shipped, but these pins put it on the map five times.
  2. **The shipped street line is dots.** It is 6px, `dashArray '2 8'`, round caps
     (`index.html:6279`). These are the heaviest marks in every busy still, and they outrank the pins.
     This is not the designer's work, but the owner will see it in these stills and say "dots".
  3. **The tie-on tag's eyelet** is a dot on every pin.
  4. **Colour that says nothing:** a grey outline around a teal pin. The two pieces of one shape
     carry two different colours, so neither one communicates.
- **Hierarchy.** Place pins are primary, and the shape pins sit at or below seal weight in all
  variants, which is good. The street dot chains outrank both, which is bad.

## 5. Colour map check (against `:root`, `CATEGORY_COLORS`, `STICKER`)

| What I checked | Result |
|---|---|
| Teal `#328177` = `CATEGORY_COLORS.district` | Correct. |
| Rust `#5E2C17` = `CATEGORY_COLORS.street` | Correct. |
| Oat `#F2EBDD` = `--paper` | Correct. |
| Slate `#3A4C5B` / cream `#FAF5EA` = `STICKER` | Correct. |
| Star `--ink` | Correct. |
| Numbers and staff `--ink-2` `#5A564C` | Correct. |
| `--figure`, `--figure-deep` and `--navy` kept off the pins | Correct, and the reasons given are right: on the map those mean cluster and frame. |
| Anything new | Nothing is invented. The map is accurate. |

Two palette notes for the owner page:

- **Rust street vs. café brown.** Street (`#5E2C17`, H 17.7) and café (`#6E4C22`, H 33.2) are both
  dark browns. At 1x they look nearly the same next to each other: in `blaze-busy-z14-phone@1x` the
  street diamond sits beside a café seal. Silhouette has to carry that difference, which the pennant
  does best and the blaze does adequately.
- **Slate visited vs. the `area` category.** Visited slate `#3A4C5B` sits close to the `area`
  category `#2B3F52`. The difference is fill vs. rim, so this is acceptable. It is not a fix.

**On the designer's flag (grey outline, category-ink pin).** My call, as the owner of palette
consistency: the outline must be in the category ink. The owner's rule is that "every colour… keeps
the meaning it has elsewhere". A shape's chip, list badge and pin are teal, so its outline being the
one grey thing breaks the link. When districts overlap, it also stops the eye matching a pin to its
area. Grey is the right colour for the pennant's staff, which is structure. It is wrong for the
shape's own boundary, which is identity.

- **Do not make the outline louder while recolouring it.** Keep the district's 2.5px dash and drop
  the stroke opacity from 0.9 to about 0.6; the fill stays at 0.12.
- **The street line should stop being 6px dots** (fix 2).

The stills also contradict each other: `*-states` draws teal and rust outlines, while every map scene
draws grey. The owner would be looking at two systems.

## 6. Numbered fixes (before the owner sees it)

1. **Drop the tie-on tag** from the owner page. Show the pennant first and the blaze second, with one
   line on why the tag was killed (two tags on one string, and the eyelet dot).
2. **One outline rule in every still.** Draw each shape's outline in its category ink, with the same
   weights and dashes and the stroke at about 0.6. Re-render the busy, visited and plan scenes so
   they match `*-states`. For streets, show a thin line in category ink (about 2.5-3px, a dash or
   solid, no round-dot chain), clearly marked as a proposed change to the shipped street line, so
   the owner judges the pins without the dot chains. If the operator rules the street line out of
   scope, the owner page must still name it as shipped and pending.
3. **A street glyph that isn't dots at pin size**, for all keepers. At 24px use a solid (or long-dash)
   curved road stroke. Keep the list's glyph unless the owner wants the change there too. Check it at
   1x in `*-street-phone@1x` and `*-busy-z14-phone@1x`.
4. **Glyph legibility.** The blaze inner glyph is about 9-13px and the pennant's is 11.5px, both under
   the app's own 18px glyph floor (`badgeHtml()`). Grow the pennant's flag by about 20% (the staff
   stays thin) and the blaze diamond to about 28px. Hold the visual weight to a seal's ("mark size
   matches text weight").
5. **Stacking: a shape pin sits under the place pins on the same rung.** A shape is the vaguer, larger
   thing, and a place is the precise one. In `blaze-busy-z14-crop@3x` and `tie-busy-z14-crop@3x` the
   visited district pin covers a restaurant seal. Show one still with a collision resolved this way.
6. **Pennant fixes:**
   - Remove the contact-shadow smudge floating mid-pole in the open state, so the shadow appears only
     at the foot.
   - Make sure the tap target covers both the flag and the foot.
   - Re-shoot `pennant-plan` so the street flag doesn't sit on the café pin. Either move the pin or
     state the collision rule (fix 5).
7. **Re-crop the `*-visited-crop@3x` stills.** All three show only the starred street and miss every
   visited shape pin. The visited crop is the frame that answers "Visited vs pin are not
   differentiated nearly enough". It must show a visited shape pin beside a visited place sticker.
8. **Blaze, for "kinda average":**
   - Put the PCT-blaze inspo crop next to the blaze stills on the owner page, so the idea reads as
     intended.
   - Don't add decoration to compensate.
   - If the visited diamond's peel can't be seen at 1x, either drop it (a clean slate diamond) or make
     it legible at 3x and 1x. A peel you can't see is noise.
9. **Make `*-busy-z16` busy, or label it honestly.** It shows about 4 pins, so it is not a busy view.
   Either add the scene's pins inside the district or call it "district fills the screen".
