# CD check: Hanging Tag v4 colour + Visited (round 6, pre-owner)

Fresh CD, 2026-10-07. I didn't author, suggest or score any of this work.
I didn't read any `*review*` file. Evidence: `stills/star-busiest`,
`star-typical`, `star-resto`, `star-signin`, `two-busiest`, `filmstrip.png`,
`tag4.js`, `../index.html`, `index.html` `:root`, `design/state-system/README.md`,
`docs/shipped.md` (Pencil Star rounds 4–6).

**Verdict: don't show it yet.** There are 3 fixes, listed below. The stub,
the stamp landing on the Visited segment and the screen-back all work. The
problem is the starred colour, and how the page explains it to the owner.

## Owner rules that apply (`docs/owner-taste.md`)

- Brand palette applied "consistently and meaningfully" (2026-10-07). Every
  colour must come from a token and keep the meaning it has elsewhere.
- "more personality … a color focus would be better on starred."
- "I like whimsy and these all seem kinda average."
- Colour must communicate something, or go neutral.
- No heavy rules or boxes ("the divider/select box pattern").
- Secondary marks never outrank content.
- Clear, matching state system.

## Answers

### 1. Is the colour map correct? No. It has three errors.

- **Error 1: the navy tile is not the star's ON rule.** The README and the
  owner page both say the navy tile is "the same rule every on/off control
  uses". But `design/state-system/README.md` lists **Named exception 2: "Star
  / visited toggles: on = the glyph fills, no tile."**
  - Everywhere in the app, a starred star is a filled black glyph with no
    tile. The tag breaks the system while claiming to follow it.
  - Inside a segmented control, the navy fill is exactly
    `.seg button[aria-checked="true"]` in `index.html`: the *selected option*
    of a choice.
- **Error 2: the stamp row overstates the match.** Its "elsewhere" column
  says "`STICKER.INK` on pins". Pins use `STICKER.INK` #3A4C5B, the dark
  neutral, not stamp navy at 82%. The meaning (visited) is the same, but the
  token is not.
- **Error 3: "No new hex values" is false.** `tag4.js` has four colours that
  aren't tokens:
  - `#EDE4D3`: eyelet patch. Acknowledged.
  - `#CFC5B1`: grommet. Acknowledged.
  - `#DDD3C1`: screened eyelet patch. New this round, and not listed.
  - `#7A6A55`: the string. Carried over from round 3, so the owner has seen
    it, but it isn't listed.

  `#fff` and `#000` are mask values only, which is fine.
- **Correct rows:** `--paper-raised`, `--paper-filed`, `--ink`, `--ink-2`,
  `--hair` and the `--navy` slip text are all used with their existing
  meaning. Dropping `--figure` / `--figure-deep` is right: per Pencil Star
  rounds 4–6, stars are black and the accent already means cluster and
  selected.

### 2. Does the navy tile honour "more personality … color focus on starred"? No.

- **It reads as a selected button.** In a three-part segmented strip, one
  filled navy segment reads as "Starred is the chosen option", like a radio
  button or tab. It doesn't say "I care about this place". This is the
  generic iOS segmented-control look: average, not whimsy.
- **It is the rejected select-box pattern.** It's a solid box. In the
  busiest still at 1x it is the darkest, heaviest mass on the tag and
  competes with "VEGA Copenhagen". That breaks "secondary marks never
  outrank content", and the owner already called the "select box pattern"
  heavy-handed. **This caps the colour application at 6.**
- **The colour isn't meaningful.** The tile's `--navy` (#12293F) sits right
  next to the stamp's navy at 82%. On one strip, navy now means both
  "starred" and "visited", in two slightly different navies. That fails "apply
  consistently and meaningfully" directly.
- **The fallback is no better.** The owner's other choice, `two-*` (black
  filled star, no colour), is correct but it is the "average" the owner is
  pushing against. So the decision as offered is "selected tile or nothing".
  Neither answers "more personality".
- **The real conflict is hidden.** The owner asked for a colour on starred,
  but the app rules stars are black. That was a team ruling (the accent
  clashed with orange category rings), not the owner's own words. The README
  calls it an "optional" question at the bottom. The owner page doesn't
  mention it, and claims the tile *is* the rule.

### 3. Does visited show VISITED only once? Is the screen-back visible at 1x? Yes to both.

- The settled tag (`star-busiest`, filmstrip frame 4) shows one VISITED:
  the stamp on the stub segment. There's no ✓ word and no stamp over the
  body. It's in a reserved slot that never touches the note or the TYPE/PLAN
  line. Good, and it's real whimsy.
- The screen-back (`--paper-raised` → `--paper-filed`) shows clearly in the
  filmstrip (frames 1–2 against 3–4) and is visible, if quiet, in
  `star-busiest` at 1x. Text stays at full contrast, so it can't be mistaken
  for signed-out dimming.
- One watch item for the owner's phone check: the filed tag is now slightly
  darker than the map paper and loses some lift.

## Score

- **Concept** (segmented claim stub, stamp-on-segment Visited, paper
  screen-back): **8.**
- **Colour application on starred:** **5.** Capped at 6 by the select-box
  pattern, then lowered for the mixed navy meaning and the miscited rule.
- **Execution of everything else:** **8.**

## Owner objections (my prediction, in the owner's voice)

1. "That's just a selected button. I asked for personality on starred, and
   this looks like a segmented control with the middle one picked."
2. "Why is starred the loudest thing on the tag? And now navy means starred
   *and* visited, so that's not using colour meaningfully."
3. "You told me this is the same rule everything uses. But a starred star
   is just a filled star everywhere else, so which is it?"

## Noise count (`star-busiest`, 1x)

- **14 marks:** pin, string, eyelet patch, grommet, ×, name, address, note,
  TYPE/PLAN, perforation, 2 dividers, Directions glyph, navy tile + star,
  stamp (ring, dotted ring, check).
- **6 colours:** filed paper, ink, ink-2, hair, navy, stamp navy.
- **1 match with a rejected pattern:** the filled navy tile is the heavy
  select box. Nothing else matches; the perforation and dividers are hair
  weight and stay quiet.

## Fixes before the owner sees it (3)

1. **Give starred its own mark, not a selection fill.**
   - The app already has a three-part grammar: "printed = the guide's
     facts, stamped = where you've been, pencilled = what you care about"
     (`docs/shipped.md`, Pencil Star).
   - Visited now *stamps* its segment. Starred should carry the app's own
     starred language with the same character. The designer owns the form.
   - It must not be a filled tile, must not use navy (navy now says
     visited), must stay quieter than the name at 1x, and must keep the
     one star shape.
2. **Put the colour question to the owner honestly, in one line.**
   - Tell the owner: "You asked for colour on starred. Stars are black
     app-wide because the orange accent clashed with orange category rings
     (team call, Pencil Star r4–6). Do you want starred to own a colour
     app-wide?"
   - Remove "the same rule every on/off control uses" from the owner page
     and the README. The state system makes the star an exception.
3. **Fix colour hygiene.**
   - Map `#EDE4D3`, `#DDD3C1`, `#CFC5B1` and `#7A6A55` onto existing tokens
     (paper / filed / pressed / hair / ink-2 steps), or list each one
     truthfully as an off-token value.
   - Correct the stamp row of the colour map: pins use `STICKER.INK`
     #3A4C5B.
   - Re-shoot `star-busiest` 1x/3x and the filmstrip after fix 1.

Keep as is: Directions in ink, no city accent in the tag, the stamp landing
on the Visited segment, the screen-back by paper tone, the sign-in slip.
