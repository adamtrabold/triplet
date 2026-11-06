# Batch 2, drawn by hand (18, the master)

Product designer (visual), 2026-11-06. These are drawings, not system builds, and the system is untouched (owner: "Don't change the system until I've approved an icon"). SVGs: `18/<icon>.svg`; sheet: `sheet.png`. Source: `src/icons.js` (the drawings), `src/lib.js` (a small paper.js kit), `src/run.js` (writes the SVGs and the sheet; needs `npm i paper@0.12.18`, path in `PAPER`).

**How they're made.** Each one is sharp roots (blocks, discs, posts, polygons) joined or cut with booleans, then one milling pass rounds every corner: convex corners at 1/4 (1/2 on a mass's corners), concave joins and cuts at 1/8. The rack is the system's, and it runs on the whole outline, not part by part. Widths are the system's: parts 1 1/3, a figure's limbs 1 2/3, cuts and counters 1. Coordinates are on thirds wherever an edge is straight.

## Moves each icon uses (for the system pass to generalize)

- **Camera (Landmark).** A mass (body, 1/2 corners) with a **raised part off-centre on its top face** (the prism is a trapezoid with 45-degree sides, left of centre), and a **small block on the same face** on the other side (the shutter button). The lens is **a round hole with a disc left in it** (a ring cut, a cut wide): the body reads as a mass, not a ring in a ring. The lens sits a little right of centre, balancing the prism.
- **Ferris wheel (Attraction).** A ring, **three posts crossed at 60 degrees through a hub disc**. The **legs run on from two of the spokes** (60 and 120), so the A-frame is the spokes carried on to the ground, and they stand on a **footing slab** that runs past their feet. Concave joins into the footing are filleted at 1/2. Spokes are 2/3 px, thinner than the system's 1 1/4 floor at 18: at 1 1/4 the six openings close. This one is a deliberate break, for the owner to rule on.
- **Curtain (Venue).** A rail slab and **two mirrored drapes a cut below it**. Each drape's **inner edge is one cubic** from the top centre (leaving a cut between the drapes), easing down and out to the **tie, where the drape is narrowest**. Below the tie the **fall flares slightly** to the floor, so the tie reads by the waist, not by an added band. The rail **overhangs the drapes by 1/3** each side, as a slab over posts does. No stage floor: with one it read as a window with a sill.
- **Bed (Hotel).** A headboard post to the floor (1/2 round on top), a mattress slab, a short foot post. **The cover is a second slab, one cut higher than the mattress, from mid-bed to the foot**: a step that says "turned down". The **pillow rests a cut above the mattress** at the head, with mass corners.
- **Bag (Shopping).** A vessel: **walls tapering out slightly to the base** (8.33 to 8 each side over 7 px) and a flat base. The **handle is a thin half ellipse** (1 px band, wider than it is tall) standing on the top face. What keeps it off a padlock is the thin handle against a heavy body: a shackle is as thick as its lock. No cuff: a cut across the top made a lid.
- **Picnic table (Park).** Seen end on: a top slab, **two legs splayed from under it, inset from its ends**, and **a seat slab crossing the legs** that runs past both the feet and the top. The legs end square on one ground line, which is a clip.
- **Houses (Neighbourhood).** **Two gabled houses side by side, a cut apart**, of different heights (the right one taller and wider). Roofs at 45 degrees, eaves square. One **door cut up from the base** of the taller house; the other stays plain. They're **scaled as a group (1.1) to fill the diamond by reach**, and centred a little high.
- **Walker (Street).** A head disc a cut clear of a **tapered torso** (1 5/6 at the shoulders, 1 2/3 at the hips) that **leans about 12 degrees** into the step, with 1/2 rounds on the shoulders. **Arms (1 1/3) and legs (1 2/3) are posts that end square**, each arm swinging opposite its leg, and every one starts inside the torso, so the joins are fillets, not stubs.

## Shared moves (the candidates for general rules)

1. Mill the whole outline once at the end, so every corner (outer, join and cut) takes the rack by its kind. This is what makes them look machined and of a piece.
2. One detail per icon that's true to the object and quiet at size: the prism and button, the turned-down cover, the tie's waist, the door. The detail is a cut or a step of one part, never an added ornament.
3. Asymmetry from the subject, not from styling: the prism left, the taller house right, the walker's lean.
4. Overhangs by a third (the rail over the drapes, the seat past the legs, the footing past the wheel's legs).

## Least happy

The walker: it reads, but it's still a little stiff and short-armed beside the café cup's finish, and its feet stand 1/3 below the set's floor line. Next is the Ferris wheel's 2/3 spokes, which are under the system's floor and fill in at 2x.
