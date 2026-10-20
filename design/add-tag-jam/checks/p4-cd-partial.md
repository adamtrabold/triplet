# P4 CD findings (in progress)

Worktree at origin/add-tag-p4 796a41ed. Spec/board exported to scratchpad/d/.

## From builder stills (flat tiles)
- 01 (z3 Nordic): Copenhagen badge almost fully covered by Malmö ("CO" + "3" visible). Text collision. Owner-no.
- 04b (z7): "COPENH[MALMÖ]" overlapping; Copenhagen tally obliterated.
- 07 (after All cities): only Reykjavík badge, clipped off right edge ("REYKJAVÍK 2"); fit doesn't account badge width; ends mid-Atlantic, empty cream map.
- 09: tag opens ~24px under the white Leaflet "All cities" box; control is a 4th top-left object over pins.
- Owner earlier asked of the board's fit button: "what is this icon?" -- ring glyph shipped unchanged; ring+dot also reads as "my location" (owner: "this is the 'my location' button right now so it's confusing").
- Label "All cities" vs menu "All places" -- owner's phase-1 "one name for one state" rule broken.

## Next
- render with real OSM tiles (curl 200) -- badge vs printed city names
- impeccable --review
