# Owner taste ledger

Rules the owner has stated, with the verbatim words. Designers and the CD
read this before every design task. Entries are rules, not rationale; a rule
here outranks any agent's earlier reasoning. When the owner states a new
taste rule, add it here the same day (quote, context, source).

Source key: chat = owner in session (as relayed by the operator); other
sources are the file where the quote is recorded.

## Visual weight / noise

- **Simple, simple, simple.** "We need to figure out how to make this simple
  simple simple visually" (sort control; chat).
- **No dots/decoration that adds noise.** "Dots add an insane amount of
  visual noise absolutely not" (visited-pin dots concept, CD-scored 9/10;
  chat).
  - **Exception: the shape anchor dot.** "Dot or something in the middle is
    fine" (2026-10-07, what an open district/street tag hangs from; chat).
    A small mark at the district's label point or the street's midpoint,
    shown only while its tag is open.
- **Districts and streets need no map pin.** "I guess the district and
  streets are fine with just the area box nevermind" (2026-10-07; chat).
  Supersedes "Districts and streets need a map pin type" (same day); the
  shape-pin work is shelved.
- **No second row of text.** Rejected because "two rows of text it reduces
  clarity" (sort control; chat).
- **No extra header height.** Rejected for the sort control (chat). The
  header text is the city name, not a control: "I don't like the header
  for sort because that's the city name" (`design/list-ordering/proposal.md`).
- **Fewer variations.** "I don't think we need this many variations"
  (chat).
- **Reduce information when marking state.** Visited = "coloured in with
  reduction of information" (`design/visited-system/stamp-first/README.md`).
- **Don't let a design read as "not following good design principles"**
  (visited pins, Round 4; CLAUDE.md).

## Character

- **Whimsy, not average.** "Have them check this against the inspo /
  product philosophy…I like whimsy and these all seem kinda average. The
  most exciting ideas as far as whimsy have been cut" (2026-10-05, popup
  round 2; chat). Character is wanted, drawn from the inspo (labels,
  stamps, matchbooks, park posters, the trail scrapbook). It still has to
  pass the noise rules above: whimsy that carries meaning (form, type,
  paper/ink, motion), not added decoration.
- **Bonus: the pin and what it opens are one idea.** "Bonus points but not
  required if the map pin is conceptually aligned with whatever it "opens
  up" to" (2026-10-05, popup round 3; chat). A nice-to-have, not a rule.
  The pin's look is shipped; changing the pin itself is a separate decision.
- **No typewriter face; use the app's own type.** "the typewriter font is
  unnecessary." (2026-10-05, on the round-3 Card File popup concept; chat).
  Character comes from form and paper, not a costume typeface.
- **The tag's stub is a claim check, not a Visited-only area.** "the whole
  area down there being just for visited makes no sense. thinking of that
  area kind of like a claim check maybe the directions button gets put there
  centered? or maybe it's a segmented area with multiple buttons? here are
  some more reference shots." (2026-10-06, Hanging Tag v3; chat; references
  in `design/inspo/luggage-tags/`).
- **Type not in the tag's header band.** "i don't like the new palcement of
  category type." (2026-10-06, Hanging Tag v2; chat).
- **The tag pops out of the pin onto a straight string.** "i think the tag
  should just pop down "out of" the pin but end with a straight string"
  (2026-10-05, Hanging Tag v2; chat).

## Hierarchy

- **Secondary marks never outrank content.** "the numbers feel really
  egregiously attention grabbing. They should feel more hierarchically like
  the x" (Plans stop numbers; chat, `design/ACCEPTANCE-plans.md`).
- **Busy views must keep their hierarchy.** "so much information all visual
  hierarchy is starting to struggle" (popup; chat).
- ~~**Type goes above the name.** "type should go back above the name"
  (popup; chat).~~ **WITHDRAWN 2026-10-05:** "Don't pay attention to old
  feedback ignore it. The type thing I mean." (chat). Type placement in the
  popup is open; see the re-tier entry below.
- **In the popup, notes are tier 1; type is tier 2 or the bottom of tier 1.**
  "Type is actually tier 2 imo — or bottom of tier 1. Notes are tier 1"
  (2026-10-05, popup; chat, correcting `design/popup-hierarchy/ux-analysis.md`).
  Only the weighting stands; where type sits is open (the "above the name"
  rule above is withdrawn).
- **Long notes show full length; no flip-over.** "long notes should just
  show full length - the flip over is meh." (2026-10-05, Hanging Tag v2;
  chat).
- **The address can matter at a glance.** "i wonder if the address
  shouldn't be closer to the place name (as sometimes the address *does*
  matter at a glance, if something has multiple locations or something)"
  (2026-10-05, Hanging Tag v2; chat).
- **Don't show empty states as marks.** "No star unless it's been starred"
  (list row; chat).

## Alignment / spacing

- **A measured spacing system, used everywhere.** "Spacing between things is
  insane and icons don't fill the same visual space" ; "A measured spacing
  system should already exist - if not create it" (chat).
- **One left channel.** "Left Padding should align with how it's treated
  everywhere else and have that solid left visual channel" (Plans round 11;
  chat).
- **One centred axis for left-column items.** "Alignment is still a lil
  weird— should be a centered vertical line for all the left column things
  (chevron, number, icon)" (Plans round 14; `design/ACCEPTANCE-plans.md`).
- **Align optically, by the rendered ink, not CSS numbers.** "make sure the
  icon in the plans list is visually left aligned with the text in the normal
  list…looks off. May not follow mathematical number" (Plans round 15;
  `design/plans-deepdive/v3/README.md`).
- **Centre the mark in its container, even if clipped.** "I want it centered
  in the circle even if it's slightly cut off" (chat).
- **Standard padding holds inside marks.** "the sticker in the row is not
  wide enough to maintain standard padding" (visited sticker; chat).
- **Decorative marks sit tight to neighbours.** "closer to the X, it's not
  interactive" (visited stamp vs delete X; `design/state-system/sheet.html`).
- **Controls don't move or grow.** "I don't want it to grow height/for the
  button to change physical location after click and it's getting very tall"
  (Plans/Places toggle: it stays put; the panel is fixed height and scrolls;
  chat).

## Icons / marks

- **The icon system needs a full revision: less noise, more clarity.**
  "also i want the next priority to be fixing our icon system -- they're too noisy, the approacah we're using the checked items are stronger visually than the open ones. the icon system needs more clarity... i need a full rev. so note that"
  (2026-10-07; chat).
- **Same icon drawing language everywhere.** "Checkmark was only supposed to
  be lightly rounded like the rest of the icons" ; "we need to do an icon
  pass on the rest at some other time" (chat).
- **Same category icon treatment on map and popup.** "icon is treated
  differently for category in the pop up than on the map — why?" (chat).
- **Preserve the category icon; don't replace it with colour or numbers.**
  "color coding is not enough … needs to preserve the icon so a simple number
  should do in the left column" (Plans; `docs/shipped.md`,
  `design/ACCEPTANCE-plans.md`).
- **Visited must be clearly different from an unvisited pin.** "Visited vs
  pin are not differentiated nearly enough" (chat).
- **Mark size matches text weight.** "smaller to match the visual weight of
  the text" (sticker; chat).
- **Wide marks say what they mean.** "the wide sticker on the row should also
  say visited" (chat).
- **A peel is a peel.** "Why is there no peel and just a notch? Looks
  stupid." ; "the flap should be bottom left" (sticker; chat). Original ask:
  "sticker route ... slightly peeled edge"
  (`design/visited-system/stamp-first/sticker.js`).
- **Continuity between surfaces.** "visited icon changes to a checkmark in
  the sticker ... add one to the visited sticker (list) for continuity"
  (`design/visited-system/stamp-first/mockup.html`).
- **Stamp, don't draw or slide.** "It shouldn't draw its a stamp" ; "I don't
  think it should slide it should stamp with some grow shrink that feels
  good…maybe the same as the star" ; "It should look like ink bleeding in or
  something" (swipe-to-visit; `docs/shipped.md`).
- **Motion must be visible and symmetric.** "too fast I can't see it" ; "too
  pointy" ; "more dramatic pop and angle" ; "the star should slightly pop out
  when erasing it" ; "Star animation should go both ways" (Pencil Star;
  `docs/shipped.md`, `design/swipe-visit/p8-design.md`).
- **Moving rows move everything.** "it should move like any other element"
  (stamp during swipe; `design/state-system/sheet.html`).

## Shadows / edges / lines

- **Effects (shadow, gradient, shade) must be restrained:** the owner has
  called them too harsh/intense three times ("Shadow is too harsh", "Shadow
  isn't realistic / too intense", "far too intense"); default to subtle and
  let the owner ask for more.
- **Natural shadow, not harsh.** "Shadow is too harsh should look more
  natural" (sticker; chat).
- **Edges are shadows, not hard lines.** "the dark line on the edge should be
  a shadow not a hard line" (sticker; chat). That was about the dark hard
  line along the peel/fold: a hard dark line on a fold is still not OK.
- **A 1px hard edge added to give a shadow definition is fine.** "The 1px
  hard edge to add shadow definition is fine" (visited sticker, 2026-10-02;
  via the coordinator). Keep it as subtle as it can be while doing the job
  (the cream sticker uses a warm 1px edge at low alpha on its outer outline
  only, never along the fold).
- **Nothing past the shape's edge that makes no physical sense.** "Why would
  there be an outline/color past the peel that makes no sense" (sticker;
  chat).
- **No heavy rules or boxes.** "Getting heavy handed with the thick blue lines
  (divider/select box pattern)" (Plans round 11; chat, `docs/shipped.md`).

## Color

- **Stars are coloured.** "Not sure on the circle we can keep for now. Stars
  should be colored imo" (2026-10-07; chat). Reverses the team's "black
  stars everywhere" ruling (Pencil Star rounds 4–6, `docs/shipped.md`): one
  starred colour, used the same way on the pin, list row, tag and add form.
  The tag's pencil circle is kept for now, provisionally.
- **Star colour: orange/yellow, and recolour the categories that clash.**
  "Not sold on pink what about the orange?"; "We can change the color of the
  category types that clash. Orange/yellow makes more sense to use on a star"
  (2026-10-07, star colour; chat). The star family is gold/amber; categories
  that collide with it move.
- **The star is the action orange.** "i dont like the gold too loud-- can
  we try the orange so it's consistent with other action buttons that are
  either navy or orange?" (2026-10-07, star colour; chat). Action colours
  are navy or orange (`--figure`); the star joins them. Gold is out.
- **Tag band liked; try the segment.** "The band is cool did we try the
  segment background? Star could be reverse (white/cream) or navy on the
  orange" (2026-10-07, Hanging Tag stub; chat).
- **Tag paper colour may carry state.** "I'm also wondering if we couldn't
  play with the background color of some or all of the tag in any or all
  states as part of the approach to some or all of the actions. Looking at
  the inspo" (2026-10-07, Hanging Tag; chat; `design/inspo/luggage-tags/`).
- **Use the brand palette consistently and meaningfully.** "Keep in mind the
  brand color palette.. we should be using best practices around how to
  apply consistently and meaningfully (the designer and cd should know
  this)" (2026-10-07, Hanging Tag colour; chat). Every colour comes from the
  existing tokens and keeps the meaning it has elsewhere in the app.
- **Colour with personality, on the thing that matters.** "Segmented stub is
  awesome. I now wonder about the color application in there — should we
  give that more personality? Directions feels unnecessarily orange and like
  maybe a color focus would be better on starred." (2026-10-07, Hanging Tag
  stub; chat).

- **Colour floods need texture -- paper, not clouds.** "also i feel like
  the color flood needs some texture (and the stamp too?... could probably
  be a bit larger in the tag?)"; then "texture looks like clouds on the
  orange, should look like paper and be somewhat subtler. visited is too big
  now." (2026-10-07, Hanging Tag build; chat). Fine paper tooth/fibre, no
  large soft blotches; a modest stamp bump at most.
- **Tag starred treatment: the band, for now.** "on the tag, let's try the
  orange background for starred, but reveresed star (text stays navy)"; then
  "i like the orange band across the top of the tag too -- i want to see both
  (though note that the orange bar is not matching the shape of the tag)";
  then "let's do band still not sure on color" (2026-10-07; chat). A printed
  band follows the tag's die-cut. The colour itself is still open.

- **One brand orange; cities have no colour of their own.** "cities
  shouldn't have their own color -- did we build a programmatic way to
  assign that as cities are created? i dont think we did. orange for star /
  tag top all the way imo." ; "'reykjavik orange' should not be a thing --
  it should be our brand orange. it's used on the account and + icon also"
  (2026-10-07; chat). The per-city palette is gone; the star (everywhere,
  the tag's Star segment included) and the tag's band are brand orange.

- **Colour must communicate, or go neutral.** "The color is not really
  communicating anything on a visited badge… Let's make all the visited
  badges that cream background with a neutral color" (chat).
- **One neutral for secondary numbers, one state.** "Numbers should be grey
  no need for a blue one or multiple states" (Plans round 11; chat).
- **Colour alone is not enough to differentiate.** "color coding is not
  enough" (Plans; `docs/shipped.md`).

- **Visited: stamp on rows, dark sticker with cream check on pins.** "The
  pin colors are not correct. Correct them but then reverse them I want the
  checkmark cream and the pin sticker the dark color... the visited sticker
  is not working so keep the check and text but take the visual style back to
  the stamp" (2026-10-03; chat). Supersedes the cream-sticker rows/pins above.
## Controls / toggles

- **Clear, matching state system.** "why are the active states not matching
  come on we should have clear systems at this point" (chat).
- **A toggle must look like a toggle.** "toggler doesn't look like a toggle"
  (Plans/Places; chat).
- **Reuse existing control styles.** "the same text button not a new button
  style" (Get Directions; `design/swipe-visit/p8-design.md`).
- **Copy: "Directions" is fine.** "Directions is fine" (2026-10-05, popup
  action label, replacing "Get Directions"; chat).
- **Grip/number leads, by convention.** "number/drag control should probably
  be on the left to follow normal convention" (Plans; chat,
  `design/ACCEPTANCE-plans.md`).
- **Mode switches live in the panel, not the list header.** "plans / places
  may be good toggle labels? Also they should only be selectable from the
  panel not the list header." (chat).
- **Mode-specific controls only in their mode.** "plans picker only in the
  plans view… Is it not confusing the plans/places metaphor?" (chat).
- **Signed out: Directions stays tappable; greyed-out controls offer
  sign-in.** "Direction stays tappable, tapping greyed out should offer sign
  in." (2026-10-07, popup; chat). Also on the Visited moment: "when visited
  is tapped should we screen it back with the visited stamp on top? Or use
  another action method to trigger the stamp that makes more sense?"
  (open, 2026-10-07).
- **Signed out: actions visible but disabled.** "If you're not logged in
  actions should be visible but disabled" (2026-10-05, popup actions;
  chat). Applies to the edit actions (star, visited); Directions needs no
  sign-in.
- **Drop steps that aren't needed.** "Next isn't necessary" (Plans round 11;
  chat, `design/plans-deepdive/v3/README.md`).
- **Simplest marker first.** "Numbers may just be the simplest (until we can
  do full mapping)" (Plans stop order; chat,
  `design/plans-deepdive/v3/README.md`).
- **Don't make the user pick settings the app can infer.** "User should not
  have to select distance." (trips; `docs/backlog.md`).

## Lists / maps behaviour

- **A list shows everything that matches the active filters** (CLAUDE.md).
- **Clicking any list item navigates the map to it** (CLAUDE.md).
- **Room above the tag's name; a compressed list still shows it scrolls.**
  "there is not enough padding above the location name in the tag. if the
  tag is so tall it forces a lot of list compression, we should show the
  list header, one list item, half second list item to show that it's
  scrollable. the list item in view should be the one selected"
  (2026-10-07, Hanging Tag build; chat).
- **An open tag adjusts the list, it doesn't close it.** "i dont like
  closing the list when a tag is open now -- it should just adjust height if
  it needs to (with a good amount of padding below the tag." (2026-10-07,
  Hanging Tag build; chat). Supersedes the round-4 "list drops to its
  header" trial ("Let's try it idk yet").
- **Don't mix two lists in one view.** "as far as plans vs places just
  separating them in the same view is confusing" (chat).
- **The header names the current list.** "The header should show whatever
  the list is — either the place or the plan." (chat).
- **Every view gets the full filter panel.** "I need a filter panel that
  supports all the chips and location menu on both views" (chat,
  `design/ACCEPTANCE-plans.md`).
- **One clustering behaviour.** "I don't like using a different approach for
  clustered places… Stop clusters should function the same as a normal
  cluster" (Plans; chat, `design/ACCEPTANCE-plans.md`).
- **Same capabilities for every category.** "Every category should have the
  same information and capabilities" (districts/streets; `docs/shipped.md`).

## Process

- **Visual animations never touch row-gesture code;** they're triggered by state change or called after/during the gesture as a separate step (2026-10-03; coordinator-relayed owner rule).

- **Make sense before it reaches the owner.** "We need to make sure shit
  makes sense before bringing it to me" (chat).
- **The owner sees a look before it is built.** "why did you not clear
  concept with me before building" (visited-pin dots; chat).
- **Quality is the CD's job.** "The CD should also have caught that…quality
  is their job" (chat; see `docs/cd-brief.md`).
- **UX catches job failures.** "Why is the ux agent not catching this stuff?
  … it's their job" (`docs/ux-brief.md`).
- **Images must be phone-readable.** "the screenshot was far too low res"
  (chat).
- **Plain UI bugs get light process.** "Make these changes more simply…
  don't do all the loops and checks except what's necessary. These are just
  ui bugs until I say otherwise." (chat).
- **Don't defend constraints the owner didn't set.** "I don't care if the
  truncation happens sooner also idk why that is a thing yall are fighting so
  hard for" (chat; prior rationale is history).
- **Fast lane by default.** "Yes do this. Fast lane. As little process other
  than what I've explicitly dictated or is necessary" (2026-10-02, after:
  "Jesus Christ why is this process taking so long. How can I reduce the time
  and agents it takes for these simple things"; CLAUDE.md Team process).
- **Roles.** "Designer is focused on ui and brand representation, ux on
  overall ux of the app and interactions, cd on overall adherence to project
  and brand goals and presence/identity." (CLAUDE.md).
