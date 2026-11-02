# Batch 2 jam

See `../briefs/batch2-loop.md`. Turns in order; each ends with `NEXT: <role> — <why>`.

## Turn 1 — product designer (systems), 2026-11-02

### Jobs first (full text in `jobs.md`)

- **Pins** do their hard work on the map at 18, unlabelled, in one ink each, and four inks aren't set yet: every pin reads **by shape before colour**.
- **Shapes are never on the map.** Neighbourhood and Street live only beside a name (rows, in the diamond) and bare at 12 (chips, no diamond). Their job is "an area or a stretch, and which", not "find me in a crowd".
- Frequency: Shopping 49 (the most repeated must be the quietest), Landmark 23, Attraction 15, Venue 11, Park 9, Hotel ~1 per city (the one you look for to get home: it should be the easiest single pin to spot).
- Each category is an **act**, and two of them are mixed bags of objects (Landmark: church, mural, square; Attraction: castle, pool, ride). The owner's own tests are about acts ("what am I doing there?"). So: look (Landmark), go in and do (Attraction), watch a show (Venue), sleep (Hotel), browse and carry home (Shopping), hang out outside (Park), wander inside (Neighbourhood), walk along (Street).

### Family findings (before any subject)

1. **One cue, one icon.** A building front, a slab on legs, a ring with spokes, a piece of paper, a tree, a person: each may carry the read of one icon in the whole set. Museum already owns the building front; Nature owns the tree. Live clashes in the 10-16 subjects: **bench vs bed** (both slabs on legs), **curtain vs bedroom window**, **Ferris wheel vs a settings wheel**. Proposed general rule: *a cue that carries an icon's read is that icon's alone; another icon may use the root, never the read.*
2. **Plan vs elevation** (a candidate rule, for the director): pins are drawn as you'd see them standing there (elevation); shapes are drawn as the map draws them (from above), because that's how the app shows them. It would make the shapes one family by construction and keep any top-down drawing off the pins.
3. **At most one person in the set.** If Street keeps the walker, no other icon uses a figure (no scale figure on Landmark, no child on Park).
4. **Paper goes to one icon.** Ticket, receipt, price tag, the Hanging Tag itself: if Venue or Attraction takes a ticket, Shopping and the other stay off paper.

### The draw (`secrets`-seeded `random.Random`, run, not chosen)

| Icon | Oblique Strategy | Fields | Twists |
|---|---|---|---|
| Landmark | What would your closest friend do? | braille; plumbing fittings | the queue; the sign the place would hang |
| Attraction | Discard an axiom | subway diagrams; clock mechanisms | a door or threshold; the queue |
| Venue | Fill every beat with something | bicycle parts | a number or count; light on/off |
| Hotel | Take away the elements in order of apparent non-importance | weather maps | a moment in time; a part of the place, cropped |
| Shopping | The most important thing is the thing most easily forgotten | chess notation; postal stamps | a view from above; what's behind you |
| Park | From nothing to more than nothing | Morse code; bookbinding | a moment in time; light on/off |
| Neighbourhood | Imagine the piece as a set of disconnected events | hobo signs; orienteering flags | the floor plan; an instrument for measuring |
| Street | Water | heraldry; braille | light on/off; the queue |

I didn't start from the 10-16 subjects. Where an incumbent comes back, it's listed as the control and said so.

### Landmark (the act: looking at something notable)

- **L1. The coin-op viewer.** (Plumbing fittings; the friend: "the big binoculars on the lookout".) The pay telescope on a post at every viewpoint and harbour front: two barrels on a yoke, a post, a foot. It says *you look at this, from here, and move on*, the category's act exactly, and it covers a church, a mural and a square equally because it draws the looker, not the looked-at. Plain (street furniture), made by a tool (it *is* a machined pipe fitting), left of centre (the coupe move: everyone draws the monument; we draw the thing you look through). Roots: vessels (the barrels: the cup's root turned), a post, a cap foot (the coupe's). Risk: binoculars (a "search" meaning in some apps), a camera on a tripod. **Strongest.**
- **L2. The empty plinth.** (The sign the place would hang; "take away".) The stepped stone base that makes anything a monument, with nothing on it, or a stub. Built from slabs and chamfers the system has. Risk: a podium (rankings), and Museum's plinth slab: under "one cue, one icon" the stepped base must be a relation Museum doesn't use.
- **L3. The frame, not the thing.** (Braille: read by its edges.) Four corner cuts round an empty centre, the viewfinder's crop marks: the act of framing a view. The lightest mark possible. Risk: scan / QR / screenshot, and it may read only once learned. Draw to learn.
- **L4. Scale.** (The queue.) A tall needle beside a tiny standing figure: "big, and notable". A relation, not an object. Breaks finding 3 if Street keeps the walker; only worth it if the shapes go plan.
- *(Control: the Nordic sights loop, which read as ⌘ in both one-shots, by its subject. I'd drop it; the director can keep it as the control.)*

### Attraction (the act: going in to do things)

- **A1. The turnstile.** (A door or threshold; the queue.) The three-armed tripod gate on its drum: the one moment every attraction shares, from Tivoli to a pool to a castle tour, is pushing through the gate with a ticket. Roots: a drum (a slab), three arms from one point (the system has "posts from one point" and "spokes count as a row"). Plain, made by a tool, left of centre. Risk: at 18, three arms off a hub can read as a peace sign or a car badge; the side view must win. **Strongest** if it reads; judge it beside A3.
- **A2. One gondola, cropped.** (A part of the place; discard the axiom "an icon shows the whole thing".) A single Ferris-wheel cabin hanging from a short arc of rim, the rest out of frame. Keeps "ride", loses the settings-wheel read and the spoke blob at 12. Risk: a lantern or a bucket.
- **A3. The wheel, as the control.** (Clock mechanisms.) The Ferris wheel as declared (rim, spokes, legs): 7-8 on execution. If kept, its legs must say "stands on the ground", or it's a gear.
- **A4. The swing ride.** (Discard the axiom "fun is a wheel".) The chair-o-plane: a mast, a cap on top, seats flung out on lines; a ride's motion in a still silhouette. Risk: an umbrella or a lamp.

### Venue (the act: watching a show, when one's on)

- **V1. Curtain at the stage lip.** (Fill every beat.) Not a rail and two drapes (a window), but two drapes meeting a stage floor that runs past them, the gap between them the read: the moment before the show. The floor is what turns window into stage. Genre-free: music, theatre and a concert hall all have a stage. **Strongest**: the only subject that says "a show" for all eleven.
- **V2. The marquee.** (Light on/off: the show is *on*.) A canopy slab with a row of bulbs along its edge, the theatre front at night; the row rule makes the bulbs a count. Risk: "dots add an insane amount of visual noise", so the bulbs must be round slots cut into the slab, never dots; an abacus.
- **V3. The mic on its stand.** (A number or count: 8 of 11 are music.) Honest to the data: a disc, a post, a tripod foot from one point. Risk: the strongest UI collision in the batch (voice input), and it shuts out the halls. Draw it to measure the collision, not to pick it.
- **V4. The stub.** (Bicycle parts → the chain's links → the perforation.) An admit-one stub torn along a perforated edge, the perforation a comb of cuts. Only if Attraction and Shopping stay off paper (finding 4). Risk: a coupon.

### Hotel (the act: sleeping; the job: getting home)

- **H1. The bed, reduced.** (Take away in order of apparent non-importance; the incumbent, said plainly.) It scored 9 and the owner said "bed is the best here". The draw says take things away: test which of headboard, foot and pillow can go before it stops being a bed. Its new problem is the bench (finding 1): either the bed loses its legs or Park isn't a bench. **Strongest**, with that solved.
- **H2. The door hanger.** (A moment in time: night, do not disturb.) A tall slab with a round hole near its top and a neck cut to the edge: "my room, I'm asleep". Risk: the Hanging Tag (a hung card), a phone; paper (finding 4).
- **H3. The key fob.** (A part of the place, cropped.) The heavy hotel key on its oblong fob. Risk: a key means login / lock in every app; likely killed for it.
- **H4. The night window.** (Weather maps → day/night.) One lit window in a dark mass: the hotel at the end of the day. Risk: abstract; a calendar or a phone. Wild card.

### Shopping (the act: browsing, and carrying something home)

Its own loop drew the bag, the blade sign, the purse, the string bag, goods on a counter, the sign that hangs the bag, the fold and the open line. New kinds only:

- **S1. The market basket.** (What's behind you: you walk out carrying it.) A tapered basket with one handle arching across the whole top, rim to rim: the market-stall and shop object. The handle is a new relation (a loop spanning a face end to end, not standing on it), which would become a rule every later handle gets. Risk: the e-commerce basket ("checkout"). **Strongest new direction.**
- **S2. The hanger.** (The most important thing is the most easily forgotten.) A clothes hanger: a hook and a wide triangle of line. The lightest mark the set could have, right for the most-repeated pin. Risk: narrows Shopping to clothes (records, books, ceramics are most of the data); a cloakroom.
- **S3. The parcel.** (Postal stamps: what comes home with you.) A box tied with string crossed over it, no bow. Risk: a gift or a delivery; heavy.
- *(Control: the bag, 9 in one-shot 2; the owner: "bag is easier to understand at a glance" and "may be one step too common?". It stays as the control, by his words.)*

### Park (the act: hanging out outside, in town, maybe with a kid)

- **P1. The swing.** ("what if im with my kid and i just want to see what parks i marked"; a moment in time.) An A-frame (two posts from one point each side: a rule we have) with a seat hung on two lines. Says "outside, play, stop here", and it's his own example. Plain, made by a tool. Risk: narrows Park to playgrounds (a cemetery park isn't one); a gallows if the seat is lost at 12. **Strongest.**
- **P2. The bench, as the control.** The 10-16 subject and the system's proof drawing. Its problem is now a family one: slab on legs = the bed (finding 1). If the bench stays, the bed loses its legs.
- **P3. The lamp post.** (Light on/off.) The old park lantern on a post. Risk: reads "street" more than "park"; it goes in the pile for Street too.
- **P4. The lawn.** (From nothing to more than nothing.) Only a low rounded mound (a cap, curve on top) and one small post on it: grass to lie on. The emptiest pin. Risk: unreadable until learned; a location marker. Draw to learn.
- *Killed before drawing:* a round tree (Nature owns the tree); a kite (the shapes' diamond).

### Neighbourhood (the act: wandering around inside)

- **N1. The roofline.** (Hobo signs: a few strokes for "town".) Three gabled houses side by side, stepped heights, in elevation: the road sign's plain "town". Roots: gables and posts the system has; tiers notched. Risk: one house = home; Museum's gable (three small ones side by side, so the count is the difference). **Strongest** if the shapes stay elevation.
- **N2. The blocks, in plan.** (The floor plan.) The 10-16 city blocks, but as one half of a pair with Street (finding 2): Neighbourhood = blocks with no through street, a patch of grid. Alone it read as a waffle (6); beside Street's corridor it may become one of a pair. The control, re-framed.
- **N3. The boundary.** (Orienteering: the control circle you have to reach.) What the app draws: a closed outline with something inside it; as a solid, an irregular cut-out piece of map with one counter. Risk: a puzzle piece or a blob.
- **N4. The walk round.** (An instrument for measuring.) A closed path you walk round, its start a cut. Risk: Plans' route mapping (on the roadmap) will want this read; a refresh icon.

### Street (the act: walking along)

- **St1. The corridor.** (Water: the street is the channel, not the banks; heraldry's *pale*, a band between two fields.) In plan, two rows of blocks with one straight run of nothing between them: the street *is* the space between facades. It pairs with N2 by construction (the same blocks; one has a corridor, one doesn't), and it's what the app draws (a box round a stretch). Risk: a pause sign, a road. **Strongest, as a pair with N2.**
- **St2. The enamel street plate.** (The sign the place would hang.) The name plate on a corner wall or post: plain, a sign, made by a tool. Risk: the map's city signposts (add-tag-jam phase 4) and "directions".
- **St3. The walker, as the control.** The owner: "walker is the best here" (10-15). One-shot 2: 7, "lighter than the set, no arms"; the one before: "an i". It also means walking directions in every maps app. If it stays, it owns the set's only person (finding 3).
- **St4. Lamps in a row.** (Light on/off; the queue.) Three lamp posts in a line: a street at dusk, the row rule doing the read. Risk: noise; a fence.

### For the director: two family-level choices, not icon by icon

- **The shapes:** (a) an elevation pair, N1 roofline + St3 walker or St2 plate; or (b) a plan pair, N2 blocks + St1 corridor, under the candidate rule "a shape is drawn as the map draws it". I lean (b): it's a general rule, it's true to what the app shows, and it rescues the blocks by giving them a partner. The owner's "walker is the best here" is the case for (a); he now calls the 10-16 picks possibly preconceived, so both go to the blind read.
- **Slab on legs:** the bench or the bed keeps it, not both. I'd give it to the bed (the 9) and send Park to the swing.

### Strongest per category

Landmark **L1 coin-op viewer** · Attraction **A1 turnstile** (A3 wheel as control) · Venue **V1 curtain at the stage lip** · Hotel **H1 bed, reduced** · Shopping **S1 market basket** (bag as control) · Park **P1 swing** · Neighbourhood **N2 blocks** with Street **St1 corridor**, as a plan pair.

### Open questions

- Are the four unset inks (Venue, Museum, Landmark, Park) set before the blind read? Shape-first says the read must work without them: run it in each concept's proposed ink and once in one grey.
- Is the turnstile known outside metro riders? Only a blind read answers it.

NEXT: product designer (visual focus) — to add its own directions per category and push, merge or kill these on how they'd look at 18 and 24, before the director steers which go to drawing.
