# Owner taste: general rules

The owner's design-taste rules that hold on any product, with their verbatim
words. Every designer and the creative director reads this before every
design task. Rules, not rationale; a rule here outranks any agent's earlier
reasoning. A project may keep its own taste file for rules that only make
sense in that product (e.g. `docs/owner-taste.md`); read both.

Most quotes were said about one product (Triplet, a trip-planning map app);
the bracket says what they were about, so the example doesn't get mistaken
for the rule.

New rule? Record it the same day: general → here, product-specific → the
project's taste file. If unsure, it's product-specific.

## Visual weight / noise

- **Simple, simple, simple.** "We need to figure out how to make this simple
  simple simple visually" [a sort control].
- **No decoration that adds noise.** "Dots add an insane amount of visual
  noise absolutely not" [decorative dots on map pins, which a CD had scored
  9/10].
- **No second row of text where one will do.** "two rows of text it reduces
  clarity" [a sort control].
- **Fewer variations.** "I don't think we need this many variations".
- **Reduce information when marking state.** A done state is "coloured in
  with reduction of information" [visited places].
- **Never "not following good design principles."** [the owner's read of a
  concept that agents had scored highly].

## Hierarchy

- **Secondary marks never outrank content.** "the numbers feel really
  egregiously attention grabbing. They should feel more hierarchically like
  the x" [stop numbers in a list].
- **Busy views must keep their hierarchy.** "so much information all visual
  hierarchy is starting to struggle" [a full popup].
- **Don't show empty states as marks.** "No star unless it's been starred"
  [list rows].

## Alignment / spacing

- **A measured spacing system, used everywhere.** "Spacing between things is
  insane and icons don't fill the same visual space" ; "A measured spacing
  system should already exist - if not create it".
- **One left channel.** "Left Padding should align with how it's treated
  everywhere else and have that solid left visual channel".
- **One centred axis for left-column items.** "Alignment is still a lil weird—
  should be a centered vertical line for all the left column things
  (chevron, number, icon)".
- **Align optically, by the rendered ink, not CSS numbers.** "make sure the
  icon in the plans list is visually left aligned with the text in the normal
  list…looks off. May not follow mathematical number".
- **Centre the mark in its container, even if clipped.** "I want it centered
  in the circle even if it's slightly cut off".
- **Standard padding holds inside marks.** "the sticker in the row is not
  wide enough to maintain standard padding" [a badge in a row].
- **Non-interactive marks sit tight to neighbours.** "closer to the X, it's
  not interactive" [a status badge next to a delete button].
- **Controls don't move or grow.** "I don't want it to grow height/for the
  button to change physical location after click and it's getting very tall"
  [a view toggle: it stays put; the panel is fixed height and scrolls].

## Icons / marks

- **One icon drawing language everywhere.** "Checkmark was only supposed to
  be lightly rounded like the rest of the icons" ; "we need to do an icon
  pass on the rest at some other time".
- **The same thing is drawn the same way on every surface.** "icon is
  treated differently for category in the pop up than on the map — why?" ;
  "add one to the visited sticker (list) for continuity".
- **Colour alone is not enough; keep the icon.** "color coding is not enough
  … needs to preserve the icon so a simple number should do in the left
  column".
- **Mark size matches text weight.** "smaller to match the visual weight of
  the text".
- **Simplest marker first.** "Numbers may just be the simplest (until we can
  do full mapping)".

## Motion

- **Motion must be visible and symmetric.** "too fast I can't see it" ; "too
  pointy" ; "more dramatic pop and angle" ; "Star animation should go both
  ways".
- **Moving things move everything.** "it should move like any other element"
  [a badge that stayed put while its row swiped].

## Shadows / edges / lines

- **Effects (shadow, gradient, shade) are restrained.** Called too harsh three
  times ("Shadow is too harsh", "Shadow isn't realistic / too intense", "far
  too intense"). Default to subtle; let the owner ask for more.
- **Natural shadow, not harsh.** "Shadow is too harsh should look more
  natural".
- **Edges are shadows, not hard lines.** "the dark line on the edge should be
  a shadow not a hard line".
- **A 1px hard edge that gives a shadow definition is fine.** "The 1px hard
  edge to add shadow definition is fine" — as subtle as it can be while doing
  the job.
- **Nothing that makes no physical sense.** "Why would there be an
  outline/color past the peel that makes no sense".
- **No heavy rules or boxes.** "Getting heavy handed with the thick blue lines
  (divider/select box pattern)".

## Colour

- **Colour must communicate, or go neutral.** "The color is not really
  communicating anything on a visited badge… Let's make all the visited
  badges that cream background with a neutral color".
- **One neutral for secondary numbers, one state.** "Numbers should be grey
  no need for a blue one or multiple states".
- **Colour alone is not enough to differentiate.** "color coding is not
  enough".

## Controls

- **One clear, matching state system.** "why are the active states not
  matching come on we should have clear systems at this point".
- **A toggle must look like a toggle.** "toggler doesn't look like a toggle".
- **Reuse existing control styles.** "the same text button not a new button
  style".
- **Follow convention unless there's a reason.** "number/drag control should
  probably be on the left to follow normal convention".
- **Mode-specific controls only in their mode.** "plans picker only in the
  plans view… Is it not confusing the plans/places metaphor?".
- **Drop steps that aren't needed.** "Next isn't necessary".
- **Don't make the user pick settings the app can infer.** "User should not
  have to select distance."

## Lists / views

- **Don't mix two lists in one view.** "as far as plans vs places just
  separating them in the same view is confusing".
- **The header names the current list.** "The header should show whatever
  the list is — either the place or the plan."
- **Every view gets the full controls.** "I need a filter panel that
  supports all the chips and location menu on both views".
- **Same capabilities for every kind of item.** "Every category should have
  the same information and capabilities".

## Process

- **Make sense before it reaches the owner.** "We need to make sure shit
  makes sense before bringing it to me".
- **The owner sees a look before it is built.** "why did you not clear
  concept with me before building".
- **Quality is the CD's job.** "The CD should also have caught that…quality
  is their job".
- **UX catches job failures.** "Why is the ux agent not catching this stuff?
  … it's their job".
- **Images must be phone-readable.** "the screenshot was far too low res".
- **Plain UI bugs get light process.** "Make these changes more simply…
  don't do all the loops and checks except what's necessary. These are just
  ui bugs until I say otherwise."
- **Don't defend constraints the owner didn't set.** "I don't care if the
  truncation happens sooner also idk why that is a thing yall are fighting so
  hard for".
- **Fast lane by default.** "Yes do this. Fast lane. As little process other
  than what I've explicitly dictated or is necessary" (after: "Jesus Christ
  why is this process taking so long. How can I reduce the time and agents it
  takes for these simple things").
- **Roles.** "Designer is focused on ui and brand representation, ux on
  overall ux of the app and interactions, cd on overall adherence to project
  and brand goals and presence/identity." ; "the ux and ui designers are
  product designers focusing on ux or ui, they are not ux or ui designers
  (these are specific in the industry)".
