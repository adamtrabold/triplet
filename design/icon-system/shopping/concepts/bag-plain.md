# The plain bag (round 2): how it works

Product designer (systems), 2026-10-26, after director turn 7. Direction: the plainest readable bag in the system; no ring standing on a box; net ink at or under the museum (62.9); a fresh blind read (pass = "bag" or "shop" as the first word at 18 in lavender). If it passes, it goes to him with: "Is this bag one step too common, or is readable the point here?"

Grid rules as before (`../../grid/pixel-fit.md`): line 1½, slabs 2, counters ≥ 2, gaps ≥ 1, protrusion ≥ 1, and the rack ⅛ / ¼ / ½. Coordinates are on the 24 grid, drawn 1:1; the blind read is at 18 in the ring (director, turn 6). Ink numbers are computed from the plain shapes before rounding (`python3` shoelace, holes subtracted); the visual designer's measure is the real one.

## His question: "what's the underlying shape that a handle is that we can make a good rule about"

**A handle is the hole the grip goes through.** It is a counter, walled by the line where it's free and closed by the body where it's attached. Its depth is one finger. Its length is the fingers that go through it.

As a rule, three parts:
1. **The counter is the root.** It is 2px deep, always (one finger; it's also the counter floor). Its length is set by the grip: **one finger, a circle 2 × 2** (a cup, a mug, a jug); **a hand, a stadium 2 deep and ⅓ to ½ of the body's top long** (a bag, a basket, a case, a kettle).
2. **The wall is the line,** 1½, on the counter's free sides. It never thickens. A handle carries, so it's drawn at the line (the "support is the line" rule).
3. **The body closes the attached side,** and the feet join it with the ½ fillet (a post into a face).

**On the cup and the bag, one rule:** the café's ear is the circle counter on the cup's side, walled by the line on the back and closed by the cup (it is already built this way, a half circle around a counter: `grid/src/proportions.js`, `cup.ear`). The bag's handle is the stadium counter on the bag's top, walled by the line over the top and closed by the bag. Same depth, same wall, same join. They look different because one is a finger and one is a hand, which is the reason they *should* differ. That's what the earlier "one rule for all handles and loops" lacked: it fixed the shape, where this fixes the grip and lets the shape follow.

**Why a ring on a box reads as a padlock, from the same rule:** a shackle's counter is deeper than it is long (a tall U), and nothing grips it. Under this rule a handle's counter is never deeper than 2, so a hand's handle is always long and low. The padlock read is ruled out by construction rather than avoided by eye. Turn 5's narrowing still holds: a ring where a hand or hook uses the hole; a post where the hole would only be seen.

## What stops it reading as a padlock, a briefcase or a handbag at 18

| Misread | What makes it | What the plain bag does instead |
|---|---|---|
| Padlock | a tall, narrow shackle; a compact rounded body; a hole or slot in the body | handle counter 2 deep and long (rule above); arch height ≤ ½ its span; **no hole in the body** (F4 and K3's slot was the lock's hood and the lamp's top) |
| Briefcase | a landscape body; a small handle, low, centred | a **portrait or square body that flares** 1px a side toward the foot; a handle span of at least ½ the top |
| Handbag | a landscape body with rounded sides and a rounded top | straight flared sides, a **flat top edge**, foot corners ½ and top corners ¼ (a slab's own) |
| Lampshade or bin (K3) | a flared block with no handle above it | the handle is always above the body, visible in the silhouette |

## Three variants (they differ in construction)

All three keep one body: a flared slab with a flat top, the foot wider by 1 a side (the bag standing on its gusset), foot corners ½, top corners ¼, centred on x 12, no hole in the body.

### P1: the ear, turned up (a counter and a line arch)

- **Body:** top 6, foot 8, 7 tall: x 9..15 at the top, 8..16 at the foot, y 10..17.
- **Handle:** a stadium counter 3 × 2 (x 10½..13½, y 8..10; ½ of the top), walled by a 1½ line arch: outer x 9..15, y 6½..10. Feet into the body's top with the ½ fillet.
- **Construction:** the cup's ear, built the same way and moved to the top. This is the purest test of the rule above.
- **Ink:** 49 + 12.7 = **about 62**. Just under the museum.
- **Risk:** the arch's outer width equals the top's width, so its sides run up from the body's corners and the silhouette is one shape (a tall dome over a block). That's the bell-jar or padlock-hood read. If so, P1b: counter 2 wide (just a circle, the cup's exact ear) is the shackle, so don't; instead go to P3's wider body.

### P2: the square handle (three posts at the line)

- **Body:** top 6, foot 8, 6½ tall: y 10½..17.
- **Handle:** two posts and a bar at the line, around a slab counter 3 × 2 (square ends, not round): outer x 9..15, y 7..10½. Its own corners are the ¼ (a part's own corners on a post); feet into the body with the ½ fillet.
- **Construction:** the handle is built from the support-is-the-line rule (posts) rather than from a curve. An earlier build already found that a square handle doesn't read as a padlock and a round one does (`../../icon-concepts/jam.md`, carrier bag: "with the square handle (a round handle = padlock)").
- **Ink:** 45½ + 15 = **about 60½**.
- **Risk:** at 18 a square handle on a square block is a crate, a toolbox or a briefcase. The portrait body and the flare are what keep it a bag.

### P3: the cuffed paper bag (handle on a folded top)

- **Body:** top 7, foot 9, 7 tall: x 8½..15½ at the top, 7½..16½ at the foot, y 10..17. Its top 2 is a **cuff**, the folded-over top of a paper shop bag, cut from the rest by a 1px gap at y 12..13 (a fold is a cut, from K).
- **Handle:** as P1 but a hand wide: a stadium counter 4 × 2 (x 10..14, y 8..10; about ⅗ of the top), the line arch outer x 8½..15½, its feet on the cuff.
- **Construction:** the cut is what pays for a wider handle: it takes out about 7½px², so the handle can span the top without the bag going over the museum. Unlike K3, the fold sits *under* a visible handle, at the top, where a paper bag's cuff really is.
- **Ink:** 56 + 14.2 − 7.6 = **about 62½**. At the ceiling, so it needs measuring.
- **Left of centre, without costing a read:** the cuff is the small shop's paper bag, as the coupe's flare is to a glass. If the blind read gives "bag" first, this is the one that answers "one step too common?" with something to see.
- **Risk:** the 1px cut at 18 is ¾px; it may disappear, and then it's P1 with a wider handle, which is fine. Or it reads as a lidded box (the cuff as a lid), which is the risk to watch.

## How each passes jobs F1-F5 (`../jobs.md`; predicted, the blind read decides)

| Flow | P1 | P2 | P3 |
|---|---|---|---|
| F1 Glance (18, lavender, a street) | bag; risk dome or lock hood | bag; risk crate | bag; risk lidded box |
| F2 Filter chip, 12 | pass: the counter is 1½ and stays open | pass: square counter holds best | pass: the cuff fades, still a bag |
| F3 List row | as F1 | as F1 | as F1 |
| F4 Beside the six, 24 and 72 | ink ~62; the handle rhymes with the cup's ear | ink ~60½; posts rhyme with the stem and columns | ink ~62½; the most particular |
| F5 Reversed (24) | 2px counter holds | holds | holds |

## What I'd send to the blind read

All three, shuffled with the café, bar and museum, the same way as round 1. The reader's first word decides. If two pass, the lighter one goes to him. If only P3 passes, it also answers the "too common" question best.

## Open

- His answer to "one step too common, or is readable the point?" decides whether round 3 hunts a subject or polishes this bag. Until then, nothing here should be called settled.
- The handle rule, if he takes it, changes the cup's ear in words only. Its drawing is already this rule.
