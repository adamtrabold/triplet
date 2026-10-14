# Shared flow: how it looks (visual)

Sheet: `sheet-3x.png` (1170 wide), shown with A (B is identical except the
corner). The renders come from the patched copies; the sheet's words are
applied by `proto/patch.js` `SB.sheet(mode, state)`.

## The sign-in sheet: words only, look unchanged (director turn 6)
- Title **SIGN IN**; primary **SIGN IN**; secondary **KEEP PLAYING**
  (playground) / **CANCEL** (real app).
- Playground line: "Only the trip’s owners can sign in. Your changes here
  won’t be kept." With `text-wrap: balance` it breaks cleanly after "sign
  in." on a 390 phone. Without it, "be kept." is orphaned on line 2 (owner:
  "make wrap work").
- Busy: "SIGNING IN…", the button at 60% opacity, disabled, fields read-only.
- **Errors moved under the password field** (they sat below Keep playing,
  far from what they're about): "That email and password don’t match." /
  "Can’t reach the sign-in server. Check your connection." in the existing
  `--figure-deep` error style. That's a one-element move, not a restyle.
- The sheet's email shows `you@example.com` in the stills (a placeholder, not
  a real account).

## Frames on the sheet
1. A place open in the playground, then the sheet over it (half size, for
   context).
2. The sheet at real size.
3. Busy.
4. Wrong password; no connection.
5. Arrival in the real trip: sign-in badge → inked → signed in (from A's storyboard).
6. Owner Q1 (with the real-app sheet, no line) and Q2, in plain words.

## Tools (team)
- `proto/patch.js`: the concept drawing and the sheet words, injected into
  a copy of `index.html`.
- `proto/render.js`: writes `../A-arc-badge/index-A.html` and
  `../B-label/index-B.html`, renders every crop into each folder's `shots/`
  (real app, gesture-harness stub, stand-in basemap; the darker map is a
  water-and-park stand-in).
- `proto/make-sheets.js` + `proto/sheet.css`: compose the sheets; shoot with
  `node ../sketches/shoot.js <sheet.html> <sheet-3x.png>`.
