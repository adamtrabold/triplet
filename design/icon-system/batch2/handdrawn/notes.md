# Batch 2, drawn by hand (18, the master)

Product designer (visual), 2026-11-06. **Round 2**, after the director's score (5e3142d1, `../../grid/scores.md`: 7 as a batch; "a second hand, close to Material Symbols"). These are drawings, not system builds. The system is untouched (owner: "Don't change the system until I've approved an icon").

- **Files:** SVGs in `18/<icon>.svg`; the sheet is `sheet.png`.
- **Source:** `src/icons.js` holds the drawings and `src/lib.js` a small paper.js kit. `src/run.js` writes the SVGs and the sheet; it needs `npm i paper@0.12.18`, with the path in `PAPER`. `src/ink.js` gives ink areas.

**How they're made.** Each icon starts as roots (blocks, discs, posts, flared posts, cap curves, polygons), joined or cut with booleans. One milling pass then rounds every corner from the rack: 1/8 for cuts, 1/4 for a part's own corners, and 1/2 for a post into a face and for a mass's corners. Widths are the system's: stroke 1 1/2, parts 1 1/3, a figure's posts 1 1/2 to 1 2/3, cuts 1.

## What round 2 changed (the director's ten fixes)

1. **Family:** every icon now carries a curve, flare or fillet that the object has, taken from the five's vocabulary (see each icon below). Every post meets its face with the 1/2 fillet.
2. **Camera:** made ours: a compact rangefinder with barrel ends, a viewfinder window top left, the lens right of centre, and a domed shutter button. The prism hump is gone. Ink went from 62 to 47.
3. **Wheel:** four spokes at 1 1/3 (two posts crossed), the hub a pin, the rim at the stroke. The question for the owner is on the sheet: the four spokes crossed (X, the lead) or upright (+, a crosshair risk).
4. **Curtain:** a tie-back knob stands 1px proud of the waist. The rail runs a protrusion past the drapes. The fall flares into a hem, so the outer edges no longer frame a window.
5. **Bed:** the cover step is gone. The pillow (soft, 0.9 rounds) rests on the mattress. Every post is filleted at 1/2, the headboard has a domed top, and the mattress's foot end is eased.
6. **Bag:** lighter (ink 50, was 60): a body slightly wider at its base, base corners eased, and the handle at the part width (1 1/3), clearly narrower than the body.
7. **Picnic table:** the top at full weight (2px), the legs filleted into it at 1/2, the seat across them.
8. **Houses:** the museum's gable family: a roof overhanging its walls by 1/3, held on the 45-degree chamfer, with short upright eave ends and a steeper pitch (0.9). A door in each. Scaled 1.12 to fill the diamond.
9. **Walker:** both arms straight in opposing swing, reaching the hips. The shoulders are one half round, with no bump. The head is narrower than the shoulders, and the torso flares from 2 at the shoulders to 1 2/3 at the hips.
10. **Sheet:** `sheet.png` shows the eight beside the five at app size, a mixed row of pins, bare, and 6x.

## Ink (px² at 18)

| Icon | Ink |
|---|---|
| Camera | 47 |
| Wheel | 61 |
| Curtain | 57 |
| Bed | 41 |
| Bag | 50 |
| Picnic table | 48 |
| Houses | 46 |
| Walker | 30 |

The approved five run 34 to 66.

## Moves each icon uses (for the system pass to generalize)

- **Camera.** A mass whose two ends are curves (an arc through the end's midpoint, 2/3 deep): the barrel. A capped part (curve on top) stands on its top face. One round hole has a disc left in it (a ring cut a line wide) at a share across, and a small block hole sits at the other side's top.
- **Wheel.** A ring at the stroke. Two posts are crossed at plus and minus 60 degrees through a pin. The legs run on from the two lower spokes, past the rim, down to a footing slab that runs a protrusion past their feet, filleted 1/2 into it. The legs are the spokes carried on: one line each way.
- **Curtain.** A rail slab, with two mirrored drapes a cut below it. The inner edge is two cubics: from the top centre, easing to the waist at the tie, then flaring to the floor. The outer edge flares into a small hem. A rounded knob is the tie, standing a protrusion proud of the waist.
- **Bed.** A post with a half-round top (the headboard). A slab with one eased end (the mattress). A short post filleted under it (the foot). A soft block resting on the slab (the pillow: rounds near half its height).
- **Bag.** A vessel slightly wider at its base, its base corners eased (1 px). A half-ellipse loop at the part width stands on the top face, narrower than the face by about a third.
- **Picnic table.** A full-weight slab, with two posts splayed from under it, inset from its ends and filleted 1/2. A thinner slab crosses them and runs past both their feet and the top.
- **Houses.** A gable over walls: the roof overhangs by a third, is held on a 45-degree chamfer, and has eave ends of a quarter line. Two houses stand a cut apart at different heights, each with a door cut up from its base.
- **Walker.** A disc for the head. A flared post for the torso, with a half round for the shoulders. Four straight posts end square: arms from one point inside the shoulders, legs from the hip, each swinging opposite its pair. The figure leans about 12 degrees.

## Least happy

The wheel. Four spokes at 1 1/3 in this rim make its openings small, and it is the heaviest of the eight (61). At app size it reads as a wheel on a stand, but crossed it can look like an X in a ring, and upright like a crosshair. That's why both are on the sheet.
