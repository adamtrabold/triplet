# v10 · Swipe reveals the board sideways (CURRENT; replaces v9's top-down flap)

Owner on v9: "This is good but the swipe should follow standard convention and bring in/reveal from
the left rather than the top"; then "The signpost can still flip over alongside the swipe".

## Direction: swipe LEFT, the board comes in from the right (trailing edge)
- **Why:** "standard convention" on iOS (Mail, Messages, Reminders) is that the destructive action
  is a leftward swipe revealing from the trailing edge. I read "from the left" as the swipe's
  direction (your finger moves left), which is that convention.
- **The owner's alternative:** a rightward swipe with the board coming in from the left (leading)
  edge. Possible, but iOS keeps the leading edge for non-destructive actions (pin, mark read).
- **Clash check:** on place rows left = visit and right = Pencil Star. The city rows live in the
  title dropdown, not the list, and no row there has a swipe today, so it doesn't share code or a
  surface; the meaning differs (visit vs remove). Open question 1.

## The reveal
- The row's name stays put (so you always see which city). The city's REMOVE board, the
  signpost's own arrow shape in navy with its point leading, slides in over the row's right end,
  tracking your finger 1:1, with a soft shadow on its leading edge.
- Past half the board's width (66px of 132) it settles open on release (220ms, slight
  overshoot); under that it slides back. Dragging past full width resists (rubber band).
  Horizontal only once |dx| > 2·|dy| after 10px, so the menu still scrolls.
- The open board covers the row's tally and check, never the name.
- **Signpost:** when the city's signpost is on the map (zoom ≤ 8), its board turns over to REMOVE
  as the reveal passes halfway, and turns back if you let it slide back.
- **Tap the board:** the confirm (move its places to a city you pick, or remove them too). Swipe
  right, tap the row or tap another row and the board slides away.
- Animation separation: driven by the menu row's own touch handling, never the list's row-gesture
  code. **Reduced motion:** the board appears and leaves without sliding; the signpost shows its
  back at once. **VoiceOver:** "Remove {city}" custom action on the row. **Keyboard:**
  Shift+Delete. **Signed out:** the board reads SIGN IN.

## Prototype
`design/city-crud/proto/swipe-flap.html` (same path, updated in place): five city rows plus a
signpost. Swipe a row left; the board tracks your finger, settles open past halfway, and that city's
signpost turns over. Tap the board for the confirm. Checked in Chromium with real touch drags (CDP):
the row tracks at 30/70/110px, settles open on release past halfway, springs back from a 40px
swipe, and the signpost turns at the halfway mark.

Stills: `stills/v10/1-R-swipe-reveal.png` (raws `stills/v10/raw/V1..V4`).
