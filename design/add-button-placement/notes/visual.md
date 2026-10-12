# Visual designer notes -- + placement

## Where things stand (2026-10-12, after jam turn 2)
- Jam turn 2 written in `jam.md` (after systems' turn 1). Jam only: no
  scores, no concepts, no jobs.md yet.
- Four quick sketches rendered headless at 3x (390x844 @3x = 1170 wide),
  rest + collapsed: `concepts/sketches/{seal,tab,stamp,stub}-{rest,collapsed}-3x.png`.
  Script `concepts/sketches/render-sketches.js` (injects CSS + one element
  into an in-memory copy of index.html; `ONLY=<name>` renders one). The real
  index.html is untouched; nothing committed.
- In all sketches + is hidden from the top corner, the account badge moves
  to `right: var(--s4)` alone, and + lives on the list sheet.

## Directions and my read
1. **Stub (lead)** -- full-height brand-orange tear-off stub at the right end
   of the list header, to the screen edge, dashed perforation (the Hanging
   Tag's stub grammar), navy +. Edge-bound eyes-closed target; prominent by
   being the only filled block in the band; no extra height; works on the
   desktop rail. Costs: ~68px header width (320px truncation), loudness next
   to navy selected row (dial: paper field + orange glyph), column above
   the rows' delete x.
2. **Tab (live)** -- orange index-card tab growing out of the sheet's top
   edge at right (76x36). Zero header width. Costs: over Leaflet
   attribution, into the tag's 48px gap, nowhere to grow on desktop rail;
   tab->card transition would move the control.
3. **Seal (baseline)** -- today's badge, orange, straddling the edge. Stock
   FAB in a costume; over attribution.
4. **Postage stamp (proposed kill)** -- collides with the rubber VISITED
   stamp metaphor; "ADD" is a second text line; too many effects.
- Not sketched: watch crown half off the right edge (new shape, reads as bug).
- Tried and dropped: claim-check notches on the stub -- the top notch reads
  as a dot on the map (ledger: no dots).

## Decisions so far (mine, provisional) and why
- + stops being the account badge's twin: different shape and fill, so it's
  primary by structure. Account keeps the scalloped badge and the top corner.
- Big by footprint (edge-bound), not by scaling the glyph; glyph stroke
  stays in the icon language (2.5-2.75).
- Open state for an orange-at-rest +: swap ends of today's system (navy
  field, orange x), x stays where + was; press = one tone deeper, glyph to
  paper (existing press state). Motion lives on the form, not the button.

## Director objections
- None yet (no steering round).

## Open questions
- Is the form's origin (rising from the band) in scope? Stub is strongest
  if yes.
- Does the Leaflet attribution move (tab/seal collide)?
- Orange-field-at-rest vs today's "orange field = open": CD should see it.
- Sign-in crew: their badge was drawn left of +; now alone top-right
  (orchestrator to tell them). Likely helps their "never louder than +".
- Stub field: orange vs paper-with-orange-glyph (only if the orange block
  reads too loud; avoid offering both by default -- "fewer variations").

## Randomness used
Oblique: "Disconnect from desire", "Consider transitions". Fields: postal
service, clockmaking. Twists: "it is half hidden", "it must work with eyes
closed".

## Next
Systems stress-tests stub and tab against the ten flows (filters panel over
the header, tag gap, 320px, desktop rail, keyboard). Then director steers.
My next pass: stub at 320px and with a navy selected row, the open (x)
state, the form rising from the band; tab with attribution moved.
