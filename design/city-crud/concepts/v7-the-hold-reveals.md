# v7 · The hold reveals Remove, with whimsy (CURRENT; refines v6)

Owner on v6: "I like the hold, but I want it to feel like the brand somehow. It feels like a place for
some whimsy. I don't know if I like the idea of holding a city to remove it, but I like the idea of
holding a city to show a button to remove it, Or something like that? Also, if you've selected a city
in the main city dropdown, there should be no list header for that city. It's just repetitive,
unnecessarily. And the faded signposts do read as hidden. But I think you should be able to tap them."

Random draws: Oblique "Consider transitions", "Use an old idea"; fields: coat check, library due-date
stamps.

## Options

**A · The claim stub (RECOMMENDED).** Holding a city row punches a perforation down the row's end,
hole by hole; let go and that end tears away as a claim stub reading REMOVE, a little askew, lifted
on the tag's own soft shadow. Tap the stub for the confirm; tap anywhere else and it tucks back.
*Draws on:* coat check and luggage claim stubs; the Hanging Tag's perforated stub the owner called
"a claim check"; the luggage-tag inspo. The reveal *is* the button, and it's paper, not chrome.

**B · The due-date stamp.** Holding brings a rubber stamp down on the row: REMOVE? inks in, in deep
orange, bleeding in like the visited stamp. Tap the stamp for the confirm; if you don't, it dries
up (the un-visit dry-up).
*Draws on:* library due-date stamps; the app's own stamp motion. *Cost:* the stamp already means
VISITED on rows; a second meaning for the same mark muddies it, and orange is the star's colour.

**C · The matchbook (not drawn).** Holding folds the row's cover up like a matchbook, showing a
striker strip printed REMOVE underneath; it folds shut on its own after a few seconds.
*Draws on:* the matchbook inspo. *Cost:* a fold needs real 3D motion in a 40px row and hides the
city's name while open.

## Recommendation: A, the claim stub
It turns "hold to show a button" into one physical idea from the brand: a tag with a tear-off claim
stub, the same thing the Hanging Tag already has. No new colour, no reused meaning.
- **Motion:** the perforation is punched in about 8 steps over the 500ms hold (each hole a tiny
  ink dot, like the stamp's dotted track), a haptic tick at the last hole (`hapticTap()`). On
  release the stub springs ~8px out, tilts −5° and settles (the Pencil Star's pop-and-settle
  easing). Tuck-back runs the same path backwards ("motion both ways"). Triggered by the press state
  in the menu, never by row-gesture code; reduced motion: the stub simply appears.
- **The stub:** paper-raised, the hair perforated edge, two half-circle notches like the tag's
  stub, the tag's soft contact + lift shadow (restrained), REMOVE in the menu's caps, navy.
- **Tap the stub:** the confirm from v6 opens under the row (move places to [Pick] or remove them
  too; Remove waits for a choice). Letting go before the last hole: nothing, it's a tap (picks the
  city).
- VoiceOver: "Remove {city}" custom action; keyboard: Shift+Delete. Signed out: the hold runs, the
  stub reads SIGN IN and opens the sign-in slip.

## Settled here too
- **A picked city has no section header:** the list starts with its first place; the title names
  it. (All places keeps its headers and eyes.)
- **Faded signposts stay tappable:** opaque paper face (not see-through), dashed `--ink-2` rule,
  grey label, no navy shadow; pressed shows the shipped `--state-press` face like any board. A tap
  picks that city.

Stills: `stills/v7/1-A-claim-stub.png` (four frames: the motion as a strip),
`stills/v7/2-B-due-date-stamp.png`, `stills/v7/3-picked-city.png`.
