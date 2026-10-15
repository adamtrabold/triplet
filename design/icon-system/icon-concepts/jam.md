# Icon concepts: jam

Step 3 of the icon project: **what each icon depicts and why**, not how
it's drawn. Inputs: `../owner.md` (newest at the bottom), `jobs.md`,
`../inventory.md`, the v6 rules card
(`../brand-approach/concepts/sketches/v6-card-rules.png`), the Constructed
card (`v6-card-2-constructed.png`), `../../inspo/`, and the owner's saved
places (read from the live `locations` and `neighborhood_shapes` tables,
2026-10-15, read-only).

Settled: he picked Constructed. His words: "the clarity is best with
built. i think through subtle rounding, etc. we can get some of the warmth
/ mimicry of the inspo / vintage roadtrip brochures/pamphlets/ etc." The
rest of what he said is in `../owner.md` (newest at the bottom), including
"i dont want to say never to that" and "these are just examples. not
exhaustive." Also settled: the v6 rules card (outlined = not marked by me,
only blanks are empty, places solid in a circle, 2.00px), and Visited
FIXED.

---

## Turn 1: product designer (systems focus)

Real draws (python `secrets`). Oblique Strategies: **"Use unqualified
people"** and **"Look at the order in which you do things"**. Borrowed
fields: **the Ordnance Survey map legend** and **hobo signs**. All four
are used below.

### 0. The lesson from "your calls have been the exact opposite of mine"

*Correction (turn 3, §0b):* this section overstates him where it treats
hand-made as ruled out (the hobo-signs "warning"). His later words in
`../owner.md` stand over it: "i dont want to say never to that".

Across three rounds the team's picks went to the hand: Field Guide, then
Cut Paper, then Specimen. He picked the press every time it was on offer:
Spot, then Constructed. My reading of why:

- **We read "vintage" as craft. He reads it as print.** The brochures,
  park maps and luggage labels in the inspo were made by printers. Their
  warmth is ink on paper and soft corners, not a wobbly hand. The hand-made
  version reads to him as "amateurish", his word.
- **We judged at 24px on a board. He judges at real size, on a phone,**
  where an irregular edge reads as an error, not as charm.
- **We kept trying to make the concepts *different*.** He kept choosing
  *clear*. "Make it distinct" pushed us towards quirk.

How that steers this step: **for every icon, the first candidate is the
conventional sign a printed pictogram system would use** (park-map legend,
rail and transit pictograms, the Ordnance Survey legend, the Michelin
guide). Character comes from choosing the *right object for this trip*,
not from a twist in the drawing. A clever concept has to beat the
convention on clarity, not just on charm. Hobo signs, the second draw, make
the point by contrast: they're a real traveller's code, chalked by hand
and meaningful only to insiders. That's exactly the warm, clever,
private-language answer we'd have reached for, and it's the wrong one
here. Kept as a warning, not a source.

### 1. "Use unqualified people": what's actually in each category

I asked what a stranger would call the places he has saved, not what the
category is named. That's the most useful finding of this turn: **several
categories don't mean what their names say.**

| Category | Saved | What's actually in it (samples) | Finding |
|---|---|---|---|
| Restaurant | 30 | vegan places, a hot-dog stand, food halls (Östermalms Saluhall, Reffen), Noma | Clear. "A meal." Food halls are fine. |
| Café | 16 | bakeries (Sankt Peders, Mirabelle), a cat café, a laundromat café | Clear, but **bakeries are half of it**. A cup alone may under-serve. |
| Bar | 12 | **mostly music venues**: Jazzhouse, Montmartre, Fasching, Nalen, VEGA, Debaser ×2, Slaktkyrkan; a tiki bar; WarPigs | **Unclear name.** It's "nights out / live music", not "cocktails". A martini glass misdescribes most of these. |
| Attraction | 62 | museums (Vasa, Fotografiska, ABBA, Punk Museum), galleries, palaces and castles, landmarks (Hallgrímskirkja, Harpa, Perlan, Turning Torso, Sun Voyager, the Little Mermaid), amusement parks (Tivoli, Gröna Lund, Skansen), a library, **street addresses in Malmö (likely murals)**, two streets (Skólavörðustígur, Klapparstígur) | **The biggest and the fuzziest.** "A sight". A column front fits about half. The streets here duplicate the street shapes. |
| Nature | 10 | parks (Humlegården, Vasaparken, Tantolunden, Griffith Park), **two pools** (Laugardalslaug, Sundhöllin), **a lighthouse** (Reykjanesviti), **a fumarole** (Gunnuhver), a bridge between continents | **Unclear.** It's "outdoors and the landscape", plus Iceland's pools. A tree fits the parks only. |
| Shopping | 53 | records, ceramics, books, design (Svenskt Tenn), vintage, a farmers' market | Clear. "A shop." |
| Area | 18 | neighbourhoods (Gamla Stan, Christiania, Nyboder), squares and markets (Lilla Torg, Möllevångstorget, Hornstulls Marknad), parks and cemeteries (Björns Trädgård, Skogskyrkogården, Assistens), **streets** (Jægersborggade, Laugavegur, Bondegatan) | **Overlaps district and street.** Djurgården, Möllevångstorget, Västra Hamnen, Skogskyrkogården, Jægersborggade and Laugavegur are saved **both** as an area pin and as a district or street shape. "Area" is the pin twin of the shapes. |
| Hotel | **0** | none | Clear, but unused so far. |
| Other | **0** | none | **Unused.** Its icon has had three concepts (dot, radio button, flag) because it has no thing behind it. |
| District (shape) | 6 (+1 approx. pin) | Möllan, Grandi, Västra Hamnen, Skogskyrkogården, Djurgården, Nyhavn | Clear as a *map shape*. Its concept overlaps area's. |
| Street (shape) | 5 | Grandagarður (murals), Jægersborggade, Laugavegur, Skólavörðustígur, Bondegatan | Clear as a shape. Also saved as areas and attractions. |

**Flagged for the owner (one batch, through the director):**

1. **Bar**: keep "bar", or rename it for what's in it ("music & bars", "nights
   out")? The concept follows the name.
2. **Attraction vs nature vs area**: these three carry almost everything
   that isn't food or shops, and the lines between them are blurry
   (streets in attraction, pools in nature, parks in area).
3. **Area vs district/street**: is "area" simply "a district or street
   saved as a pin, without a shape"? If so, its icon should be the same
   concept as district's (a pin-sized version), not a fourth idea. That's
   cleaner, and it matches the approx. fallback, which already files a
   district with no shape as a district pin.
4. **Other**: keep it (it's the safety valve in the add form) or remove it?
   Nothing's in it.

Renaming or merging categories is a data and product change: the
`category` column, `CATEGORY_COLORS`, the chips. It isn't ours to make,
and it isn't needed to brainstorm. Each candidate below says which naming
it assumes.

### 2. "Look at the order in which you do things": the tools in a traveller's order

Find → narrow → place yourself → choose → go → mark. Laid out in that
order, the tools have three overloads that no drawing can fix. They have
to be fixed by concept:

- **× means four things**: close the tag, close the add form, **delete a
  place (destructive)** and remove from a plan. Delete is the only one
  that loses data.
- **+ means four things**: add a place (the badge), new plan, add to plan,
  zoom in.
- **The current-choice tick (sort menu, plan list) is the visited check's
  shape.** Visited is FIXED, so the tick is the one that has to move. Under
  the rules, a check means "visited".

Rule proposal: **one symbol, one meaning, at least for destructive and
marking acts.** × may keep "close" and "out of this plan" (both reversible).
Delete gets its own concept. The tick gets its own concept.

### 3. Places: candidate concepts

At least two per place, differing in kind:
- **object**: a thing you'd hold or see;
- **building or site**: the structure;
- **sign**: the printed convention a legend already uses;
- **activity**: what you do there.

The first listed is the convention, per §0. For each: what it means to a
traveller, then its misread risk.

**Restaurant** (assumes "a meal")
- A. *Sign:* **fork and knife side by side.** The universal road-sign and
  OS-legend "food". The clearest. Risk: it's on every app; the Constructed
  build read as "Y4" in v6, which is a drawing problem, not a concept one.
- B. *Object:* **a covered dish (cloche) or a plate with fork and knife.**
  It says "a served meal" more than "food". Risk: a cloche reads as "room
  service" or a bell.
- C. *Activity:* **a steaming bowl.** Nordic soup, ramen, the hot-dog
  stand's steam. Risk: it collides with café (a cup with steam).

**Café** (assumes "coffee and bakeries")
- A. *Sign:* **a cup and saucer.** The rail-pictogram "buffet/coffee". Clear,
  and it covers coffee. Risk: a cup alone misses bakeries.
- B. *Object:* **a cup with a pastry beside it**, or **a kanelbulle /
  pretzel** (the Nordic baker's sign: the gilded pretzel hangs over Danish
  bakeries). It's very specific to this trip, and printed shop signs are
  exactly brochure material. Risk: a pretzel alone reads as "bakery only"
  or as a knot.
- C. *Sign:* **a coffee pot**, the old diner and road-trip roadside sign.
  Risk: it reads as a kettle (as in "kitchen").

**Bar** (concept depends on owner Q1)
- If "bar": A. *Sign:* **a stemmed glass** (OS legend: PH; transit
  pictograms: a cocktail glass). Risk: it misdescribes a jazz club, and
  it's a funnel or a lamp at 12px.
- If "music & nights": B. *Object:* **a note pair or a microphone.** Jazz
  posters and festival brochures. Risk: a note reads as "audio / Spotify".
- C. *Sign:* **a glass and a note together**: one glass, one note. Risk: two
  objects in an 18px circle is the noise he's asked against.
- D. *Activity:* **a crescent moon** ("nightlife"), as hotel brochures
  marked their evening listings. Risk: it reads as "night mode" or "sleep",
  and collides with hotel.

**Attraction** (assumes "a sight")
- A. *Sign:* **the park-map "point of interest"**: a camera, or a
  viewfinder, the brochure's "see this". It covers museums, landmarks,
  murals and Tivoli alike, because it depicts *the act of seeing*, not one
  kind of building. Risk: a camera reads as "photo / take a picture".
- B. *Building:* **a column front (museum).** Classic "museum" sign. Risk:
  it fits museums only (about half), and reads as a bank or court.
- C. *Sign:* **the Michelin and Baedeker star or "sight" mark.** Guidebooks
  rank sights with stars. Risk: **it collides with the user's Star** (orange,
  settled). Ruled out by our own rules. Listed so nobody proposes it later.
- D. *Object:* **binoculars.** A park-poster favourite that means
  "viewpoint / look out". Risk: it reads as "search", and as nature
  (birdwatching).
- E. *Sign:* **a pennant or ticket stub.** Admission, "go in". Ticket stubs
  are luggage-label kin. Risk: a ticket reads as "events/booking".

**Nature** (assumes "outdoors")
- A. *Sign:* **a conifer.** The park-map "forest/park". Clear. Risk: it
  doesn't cover pools, the lighthouse, the fumarole or the bridge, and
  reads as a Christmas tree in December.
- B. *Sign:* **mountain with sun**: the National Park poster's own motif,
  "the landscape". It covers fumaroles, coasts and parks in one idea, and
  it's the most brochure-like option. Risk: it reads as "image/photo"
  (it's the generic image-placeholder icon in most software).
- C. *Object:* **a leaf.** "Green space". Risk: it reads as eco or vegan,
  which actually *collides* with his vegan restaurants.
- Flag: Iceland's pools are a real category for this trip (two already).
  If he wants them, "pool / bath" is a separate concept (the wave line, or
  the steam over water), not a nature icon. That's an owner question, not
  ours.

**Shopping** (assumes "a shop")
- A. *Object:* **a carrier bag with handles.** The universal sign. Risk: a
  padlock or briefcase at 12px.
- B. *Building:* **a shopfront with an awning**: the striped awning of a
  street shop. Very brochure, and it covers the record shops and design
  stores. Risk: it reads as "market" or "store locator"; the stripes are
  detail at 18px.
- C. *Sign:* **a price tag.** It's luggage-label kin (a tag with an eyelet).
  Risk: it reads as "sale/discount", and it collides with the Hanging Tag
  as the app's own motif.

**Area** (depends on owner Q3)
- If "the pin twin of district/street": A. **the same concept as district,
  reduced for a pin.** One idea for "a part of town", whether it has a
  shape or not. I recommend this.
- If kept as its own idea: B. *Sign:* **a folded map**, "an area to
  explore" (v6's). Risk: it reads as "maps / open in maps", and the app is
  a map. C. *Building:* **a cluster of rooftops**, "the old town". Risk:
  it reads as "city/home".

**Hotel** (0 saved, but in the add form)
- A. *Sign:* **a bed.** The OS and transit "accommodation". Clear. Risk: a
  sofa at 12px.
- B. *Object:* **a room key with its tag**: the hotel key fob, kin to the
  luggage label and the Hanging Tag. Risk: it reads as "password / lock /
  sign in", and collides with the account.
- C. *Sign:* **a bellhop's bell.** Risk: it reads as notification.

**Other** (depends on owner Q4)
- A. *Sign:* **a map pin or flag**: "a spot I've marked". Risk: a pin
  inside a pin is a tautology on the map, and the flag reads as "report".
- B. *Sign:* **a plain asterisk or a dot of a different shape (a diamond):**
  the printed footnote mark, "see note". Risk: an empty-feeling glyph, and
  the diamond echoes the old shape shell.
- C. **Remove the category.** The honest answer for zero rows. Owner call.

**District** (a shape on the map)
- A. *Sign:* **a block cut by streets**: the OS legend's built-up area,
  the map's own convention. Clear. Risk: a grid, a window or an app
  launcher (seen in round 3).
- B. *Sign:* **the outline of an irregular parcel with a dashed edge**,
  exactly how the map draws it. Risk: under the rules a dashed *outline*
  is an empty shape, so it would have to be a solid parcel. Then it reads
  as a blob.
- C. *Building:* **rooftops** (a skyline fragment). Risk: it reads as
  "city", and collides with area option C.

**Street** (a line on the map)
- A. *Sign:* **a road with a centre line**, the road-map convention. Risk:
  a film strip or a pencil when it's built from bars (seen in v6).
- B. *Sign:* **a street sign on a post**: the enamel blue name plate of
  Nordic streets. Very specific to this trip, and very printed. Risk: it
  reads as "directions/signpost", and collides with Directions.
- C. *Object:* **a lamppost**, "a street to walk". Risk: it reads as
  "light/idea".

### 4. Tools: candidate concepts

- **+ (add a place):** A. **plus** (convention). B. **a pin with a +** ("add
  a place on the map"), which separates it from zoom + and plan +. Risk:
  more ink on the loudest button. C. **a pencil on a tag** ("write a new
  tag"), the tag metaphor. Risk: it reads as "edit". He said "Build the
  matched icon", so the + stays unless he asks. B is recorded as the
  overload fix.
- **Account:** A. **head and shoulders** (settled in v6: solid head).
  B. **a passport.** The traveller's ID: very on-brand, and stamps live in
  passports, which ties it to Visited. Risk: it reads as "documents", and
  it's less instant than a head for "sign in".
- **Sort:** A. **up/down arrows** (convention). B. **lines of decreasing
  length**, a printed list being ordered. Risk: it reads as "text align".
- **Filters:** A. **sliders** (today). B. **a funnel.** Risk: it collides
  with bar's martini glass, which was already misread as a funnel.
  C. **the category chips themselves as a tiny legend** (three dots of
  category ink). Risk: colour carries the meaning, which breaks "color
  coding is not enough". Recommend A.
- **Locate:** A. **a crosshair with a solid centre** (today, law-compliant).
  B. **an arrowhead** (iOS-style "my location"). Risk: it's an arrow, and
  collides with Directions. C. **the you-are-here mark itself** (navy disc,
  paper ring), so the button shows what it puts on the map: the OS-legend
  logic of "the symbol is the thing". Risk: a ring with a dot can read as
  a radio button. Under the law, its centre must be solid.
- **Directions:** A. **compass ring with a solid needle** (settled in v6).
  B. **a road sign arrow**: dropped in v6 ("turn right").
- **Delete (row ×):** A. **×** (today, shared with close). B. **a
  wastebasket**: separates the destructive act from close and remove.
  Risk: more ink in a row, against "secondary marks never outrank content".
  C. **a × in a smaller, quieter size, with close at its own size.** It
  keeps one shape, but that's a drawing fix, not a concept fix. Recommend
  B as the concept to test. It's an interaction change (the delete
  affordance), so UX/the owner should see it.
- **Close (tag ×, add form ×):** **×**. Unchanged as a concept.
- **Plan remove × / add to plan +:** A. **× / +** (today). B. **a tick in a
  numbered disc / an empty numbered disc**: "is a stop". Risk: the empty
  disc is an outline, which means "not marked yet". That *agrees* with the
  law, since a stop you haven't added is a mark you haven't made. Worth
  testing. The v6 rules card left Plans' "+ to add, then a stop number" as
  it is for now, so this reopens it on purpose.
- **Current-choice tick:** must not be the visited check. A. **a solid
  pointer** (▸): the timetable and rail-index marker for "this one".
  B. **a solid dot**: the radio-selected dot, "chosen". Risk: a dot can
  read as a bullet. C. **bold the row text and drop the icon.** Risk: none
  visible; it's an interaction call. Recommend A.
- **More (…):** three dots (convention). No alternative worth his time.
- **Chevron / collapse ▼:** one disclosure concept for both (a solid
  wedge). Today they're two shapes for one meaning.
- **Zoom + / −:** Leaflet's control. Keep +/− as the concept, drawn into
  the set. Its + is the only + left after the fixes above.
- **Empty list:** A. **compass** (today, same as Directions). B. **a blank
  luggage tag**: "nothing filed yet", the brand's own object. Risk: a tag
  is the Hanging Tag. That's fine for "no places yet", but it's a new
  motif. Recommend B, or no icon at all.

### 5. Marks and map furniture: in or out of scope

- **Star, Visited:** out (settled / FIXED).
- **Cluster** (orange disc + count), **plan stop numbers**, **far pin
  ring**, **approx. pin dashed rim**, **tag anchor dot**: out. They're
  numbers and containers, not concepts. Each is already named on the rules
  card where it touches the law.
- **You-are-here:** in only if Locate takes option C (the button and the
  mark become one concept).
- **Leaflet attribution flag:** out (Leaflet's own, legally required
  attribution).

### Open questions

For the owner, one batch through the director:
1. Bar: rename for what's in it (music venues)?
2. Attraction / nature / area: are those lines where he wants them? Do
   pools get their own category?
3. Area: is it the pin twin of district/street (one concept)?
4. Other: keep or remove?

For the team:
5. Delete gets its own concept (a wastebasket)? It's an interaction change,
   so it needs a UX check.
6. The current-choice tick moves off the check shape (to a pointer)?
7. One disclosure concept for the chevron and ▼?

NEXT: product designer (visual focus) — push or kill the place concepts on
brand (the brochure, park-map and rail-pictogram vocabulary; Nordic-specific
objects like the pretzel sign and the enamel street plate), and say which
of each pair can be *built* clearly on the 2px grid at 18px. Then the
director steers which questions go to the owner.

---

## Turn 2: product designer (visual focus)

Sketch: `sketches/t2-concepts.png` (source `sketches/concepts-t2.html`).
Every candidate below is roughly built on the 2px grid and shown as a
24px badge, at 12px bare, and the tools at 22px navy. These are concept
tests, not drawings, but a concept that can't be built clearly at real
size isn't a concept we can ship. "Builds" below means what I saw on that
sheet at 1x, not what I expect.

**Correction to turn 1's "Settled" line.** "Hand-made looks out" is wrong.
The owner's words: "clarity comes first is great. subtle rounding is a
place where warmth can come from. "never a hand made look" is bad. i dont
want to say never to that and handmade can come from many angles --
construction method, textural approach, the inkblot thing, etc." Specimen
and Cut Paper were cut on execution risk, not on idea. He adds: "i do
think whimsy is totally great; there is not one correct way to show
whimsy though and the craft matters most… i do think built can still be
whimsical." He also said his examples "are just examples. not
exhaustive. again you are overstating my intent." So nothing here turns
them into a list of options or a rule. Because this step is about what
each icon depicts, I look for the wit that a concept can carry (a double
meaning, a trip object). Everything about surface and construction waits
for the drawing step, where he can judge it by eye.

Real draws (python `secrets`). Oblique Strategies: **"Retrace your steps"**
and **"Water"**. Borrowed fields: **laundry care labels** and **the Swiss
railway clock**.

### 1. Where the wit lives in a built set (the Swiss railway clock)

Hilfiker's station clock is pure construction: bars, a circle, nothing
freehand. Yet everyone remembers it for **one** playful part: the red
disc on the second hand, borrowed from the guard's signalling paddle. One
witty part, inside a strict build, is what makes a built set feel loved
rather than municipal.

As a craft idea for the next step, not a concept ruling: **in each place
icon the wit sits in one part, and everything else stays plain
construction.** Examples:
- the olive in the glass
- the note heads
- the sun over the peaks
- the knife's rounded back
- the pillow head on the bed

That's how "built can still be whimsical" without a hand-made surface.

The risk is that it turns into a dot on every icon, which is the noise he
rejected ("Dots add an insane amount of visual noise"). So the wit part
has to be **part of the object**, never added to it.

**Novelty** (his "something to consider but not lock on"): built
pictograms on their own are the airport. They aren't novel, and the
sheet proves it: the conventional column (fork, cup, bag, bed, crosshair)
could be any transit app. Novelty in this app can only come from two
places:
- **What we choose to depict**: trip objects, the brochure's own
  vocabulary.
- **The craft layer**: rounding, ink, maybe texture.

So my pushes below lean on **specific objects** wherever they still read
at 12px. I'd show him one strip of "convention" against one strip of
"our objects", so he can judge novelty with his eyes, not from our
argument.

### 2. "Retrace your steps": the app already has a vocabulary

Going back through the inspo and the shipped work, Triplet already talks
in **travel paperwork**:
- the luggage tag, the claim-check stub and the stamp
- the scalloped badge, like a stamp or seal edge
- the printed TYPE line

The places' natural source is the **printed legend** (park map,
Ordnance Survey, rail pictograms). The **paperwork** is the natural
source for app states: an empty list, an admission, a passport. That
gives a clean split that stays one family:

- **Places = legend signs** (things in the world, drawn like a map key)
- **States and empties = paperwork** (the tag, the ticket, the stamp)

It also tells us what to kill: a price tag for shopping (paperwork used
as a place) and a pennant for "other". Both are in the wrong drawer.

### 3. Places: push / keep / kill, with what the build showed

"Builds" means it reads at a 24px badge **and** at 12px bare on the
sheet.

| Place | Candidate | Verdict | Builds? | Why |
|---|---|---|---|---|
| Restaurant | fork + knife | **KEEP** | yes | The most common pin should be the plainest. Wit: the knife's round back is its one curve. A plate between fork and knife read as a dumbbell in v6. |
| Café | cup + saucer | **KEEP** | yes | Clear for coffee. |
| | coffee pot | push (wit) | weak: reads as a kettle | The road-trip diner pot is exactly his "vintage roadtrip brochures". The 18px build reads as a kettle/teapot, so it needs the drawing step to prove it. Keep it alive as a wit option. |
| | kringle (bakers' sign) | **KILL** | no | Built from loops, so at 18px it's an outline (and "nothing else is an empty shape") or a knot. The idea is lovely; the build can't carry it. |
| | steaming bowl | **KILL** | — | Collides with restaurant (turn 1). |
| Bar | martini | **KILL** | reads as a funnel | Confirmed again at 12px. |
| | stemmed glass, round bowl | **KEEP** (if "bar") | yes | The round bowl is what stops the funnel read. A wine/beer glass also fits the WarPigs/tiki end. |
| | two beamed notes | **PUSH** (if "music & bars") | yes, the clearest of the set | Most of what he saved here is Jazzhouse, Fasching, Debaser. Notes are what a jazz-festival poster prints. Risk: "audio/Spotify". In a place circle, in his colour, on a map, I think it reads as "music venue". |
| | jazz horn | **KILL** | no: a fish or a brush at 18px | Great poster object, unbuildable at this size. |
| | glass + note together | **KILL** | — | Two objects in one 18px circle is the noise he's against (turn 1 agrees). |
| | crescent moon | **KILL** | — | Sleep / night mode, and it collides with hotel. |
| Attraction | admission ticket | **PUSH (concept), build unproven** | no: a battery/bandage when horizontal | Best concept for a 62-place mixed bag: museums, Tivoli, castles and palaces all mean "you go in". It's the paperwork drawer, though (§2). It may need its classic tilted stub and one punched notch to read. Test it in the drawing step; fall back to the camera if it fails. |
| | camera | **KEEP** | yes, clearly | "See this": covers landmarks and murals too. Risk: "take a photo". The safe pick. |
| | binoculars | keep (backup) | yes | Reads, but leans to nature and "search". |
| | column front | **KILL** | yes, but wrong | Fits half the set, and reads as a bank. |
| | Michelin star | **KILL** | — | Collides with the Star (turn 1). |
| | manicule ☞ ("look here", the vintage brochure's pointing hand) | **KILL** (new, recorded) | — | Peak brochure wit, but in an app a pointing hand means "tap here". |
| Nature | conifer | **KEEP** | yes | Park-map clear. Parks are most of the set. |
| | peaks + sun + water | push (brand) | yes, but reads as the generic **"image"** icon | It's the park poster's own motif, and it covers the lighthouse and fumarole coast. At 12px it's every app's photo placeholder. Show it, and say so. If the sun goes, the image read goes too, but so does the wit. |
| | hot spring ♨ ("Water": pools + fumaroles in one sign) | **PUSH (concept), not as nature** | reads as a soup bowl | The double meaning is the best wit on the sheet: the Japanese map sign covers both Iceland pools *and* Gunnuhver. Built as a bowl, it collides with restaurant. Built over a water line instead of a bowl, it could carry a **"pools & hot springs" category** if he wants one (turn 1's flag). Not a nature icon. |
| | leaf | **KILL** | — | Reads as vegan, which collides with his vegan restaurants. |
| Shopping | carrier bag | **KEEP** | yes, with the square handle (a round handle = padlock) | The convention. |
| | shopfront with scalloped awning | **PUSH** | yes, at 24 and at 12 | Records, ceramics, design stores: it says "a little shop on a street", which is what he saves. The scallops rhyme with the app's scalloped badges, so the wit is built into the set. Risk: "market/store locator", which is fine for a shop. |
| | price tag | **KILL** | — | The Hanging Tag's twin, in the wrong drawer (§2). |
| Area / district | city blocks | **PUSH** | yes (v6 build) | Agree with turn 1: area is district's pin twin, one concept for "a part of town". |
| | folded map | **KILL** | — | The app *is* a map. It reads as "open in maps". |
| | rooftops | **KILL** | — | Reads as "city/home". |
| Street | enamel street-name plate on its post | **PUSH** | yes, as "a sign"; at 12px it's a T | The blue enamel plates of Copenhagen and Stockholm, and Reykjavík's: a trip object, and very printed. It doesn't collide with Directions, which is a compass, not a signpost. Risk: "information sign". |
| | road with centre line | **KILL** (built) | no: pencil, cone, escalator across three builds | Three tries on the grid; the convention doesn't survive construction at 18px. |
| | lamppost | **KILL** | — | Reads as "light/idea". |
| Hotel | bed | **KEEP** | yes | Clear, and there are 0 saved anyway. Not worth wit. |
| | room key | **KILL** | — | The bow is a ring (an empty shape), and it reads as "sign in". |
| Other | printed asterisk (footnote) | keep, weakly | reads as a sun or a snowflake | The honest answer is turn 1's: remove the category (0 rows). If it stays, the footnote asterisk at least isn't a control. |
| | flag | **KILL** | — | "Report", and the wrong drawer. |

### 4. Tools

| Tool | Candidate | Verdict | Builds? | Why |
|---|---|---|---|---|
| Account | head and shoulders | **KEEP** | yes | Instant "me". |
| | passport | **PUSH as wit, but it fails as a build** | no: a phone or speaker at 22px | Passport + stamp is the best story in the set (your stamps live in it). As a button it doesn't say "me/sign in". Record it; don't send it as an option. |
| Locate | crosshair with a solid centre | **KEEP** | yes | |
| | the you-are-here mark | **KILL** | reads as a selected radio button | Logical ("the button shows what it puts on the map"), but the read loses. |
| Directions | compass | **KEEP** (settled) | yes | It can't also be the empty-list icon. |
| Close | × | **KEEP** | yes | |
| Delete | wastebasket | **PUSH** (UX call) | yes, clearly | It separates the destructive act from close. My visual worry: it's heavier in every row. "Secondary marks never outrank content", so it has to be smaller than the × it replaces, or appear only on swipe. That's an interaction question, not mine. |
| Current-choice | the visited check | **KILL** | — | It's Visited's shape (FIXED). |
| | solid pointer ▸ | **PUSH** | yes, but alone it reads as "play" | Beside a menu line, the way a rail timetable or index marks "this one", it reads as current. It needs the row to read. |
| Disclosure | one solid wedge for chevron and ▼ | **PUSH** | yes | One meaning, one shape. |
| Empty list | blank luggage tag | **PUSH** | yes | Paperwork drawer, the brand's own object: "nothing filed yet". It also frees the compass to mean only Directions. |
| + (add a place) | + | **KEEP** | yes | Settled, and he said "Build the matched icon". |
| | pin with + | kill | — | More ink on the loudest button. The overload is better fixed by giving the other +'s their own concepts. |
| Sort | arrows | **KEEP** | yes | |
| Filters | sliders | **KEEP** | yes | |
| | funnel | **KILL** | — | Collides with the martini's funnel read, as turn 1 said. |

### 5. Missing concepts that differ in kind

1. **"Our objects" strip vs "convention" strip** (a framing, not one
   icon). For the novelty question, build a whole set two ways:
   - Convention: fork, cup, glass, camera, tree, bag, blocks, plate, bed.
   - Ours: fork, cup, notes, ticket, tree or ♨, awning, blocks, enamel
     plate, bed.
   He judges novelty by eye. Today there are only single-icon options,
   which can't answer "does built still feel novel".
2. **A trip-only category: pools & hot springs** (♨ over water). Two
   pools and a fumarole are already saved. It's the most Iceland thing in
   the app and the cleanest double meaning available. It's an owner
   question (a new category), so it rides with turn 1's batch.
3. **One idea for the drawing step, mine, not his rule:** the softening of
   corners could behave like ink spread on paper rather than a plain
   geometric radius. The stamp and the Pencil Star already behave like
   ink. It's one option among many for that step, noted so it gets tried
   alongside the others, not a default.

### What I'd send up

- **Places, concept pairs to show him:** café (cup / coffee pot), bar or
  music (stemmed glass / notes, once the name is answered), attraction
  (camera / ticket, if the ticket builds), nature (conifer / peaks),
  shopping (bag / awning), street (enamel plate, alone; the road failed
  three times).
- **Settle without him:** fork, cup as the default, blocks for area and
  district, bed, the tool rows above.
- **Owner questions** (with turn 1's four): add "pools & hot springs"?
  And show him the two strips for novelty.

### Open questions

1. Can the ticket be built to read at 18px (tilted, one notch)? It needs
   a drawing test before it goes to him.
2. Peaks + sun: is reading as "image" fatal, or is the park-poster
   meaning strong enough in a nature-coloured circle on a map? (Director.)
3. Delete as a bin: the size/visibility question goes to UX.

NEXT: design director — steer which pairs and owner questions go up
(turn 1's four, plus pools & hot springs and the two-strip novelty test),
and rule on the ticket, the peaks, and the convention vs "our objects"
framing.

---

## Turn 3: design director, steer

I read the owner's new words in `../owner.md` and `docs/owner-taste.md`,
`jobs.md`, turns 1 and 2, and `sketches/t2-concepts.png` at phone size.
No scores this turn.

My real draw (python `secrets`): **"Courage!"**. Here it means having the
nerve to send the plain sign when it's the best one, and to ask him fewer
questions.

### 0. My bias, named first

He wrote: "its interesting that your calls have been the exact opposite of
mine, i wonder why." Across three rounds, the director's scores (mine and my
predecessor's) rewarded the hand-made and the novel: Field Guide 9, Cut
Paper kept alive, Timetable "the most distinct", and Constructed scored
lowest of the two when he picked it. So I hold myself to this order of tests
for every concept in this step, and I'll score in this order:

1. **It reads at real size**: a 24px badge, a 12px chip and a map pin, on a
   phone.
2. **It covers what he actually saved**, not the category's name.
3. **It belongs to one printed family.**
4. Only then: wit, or something new.

A trip object beats the common sign only if it reads as well. A concept
being plain is never a mark against it. If I catch myself preferring the
clever option on a tie, the common sign wins.

### 0b. Two records to correct (systems, before anything is built)

He has twice said we overstate his intent. Two lines in this folder still
do it:
- The jam header's "Settled" line says "hand-made looks out". That's wrong.
  Turn 2 corrected it, but the header still says it.
- `jobs.md` "Settled" says "with warmth from subtle rounding, in the manner
  of vintage road-trip brochures". That turns one example into the method.

Replace both with his words, quoted, and add nothing:
> "the clarity is best with built. i think through subtle rounding, etc. we
> can get some of the warmth / mimicry of the inspo / vintage roadtrip
> brochures/pamphlets/ etc."

Then point to `../owner.md` for the rest ("i dont want to say never to
that…"; "these are just examples. not exhaustive."). On the cards, his
words appear only as quotes, never as our rules. Nothing in this step is
about surface, texture or rounding. That's the drawing step, and he judges
it by eye there.

Also: the sheet and turn 2's table disagree. The sheet labels the jazz
horn, the passport and the you-are-here mark PUSH, but the text kills them.
The text is the ruling. Fix the sheet labels so the record agrees with
itself.

### 1. Rulings on visual's push/kill list

I agree with turn 2's KEEPs and KILLs, except where noted below. Where they
don't conflict, its reasons stand.

- **The admission ticket (attraction): one build test, then in or out.**
  The concept is the best fit for a 62-place mix ("you go in"), and that
  is exactly why I distrust my liking it. On the sheet it reads as a
  battery or a bandage. One test, the tilted stub with one notch, judged at
  18px and 12px on the sheet. If it doesn't read as a ticket there, it
  isn't shown to him. A concept that can't be read at real size isn't a
  concept for this app. If it fails, attraction's pair is camera / column
  front. The column front fits museums only, so its line says that
  honestly ("museums and palaces; not landmarks or Tivoli"). Binoculars
  stay a backup only. They lean to nature and "search".
- **Peaks + sun (nature): the sun goes.** The "image placeholder" read is
  every phone's, and it's at its strongest exactly at real size, where he
  judges. Clarity first, so wit doesn't outvote that. The pair is
  **conifer / peaks without the sun** (landscape vs park). If the plain
  peaks read as "hiking" or "terrain", that's a fair read for Iceland's
  coast and the fumarole. Say it on the card as the risk.
- **The hot-spring sign: not a nature concept, and not a question.** See §3.
- **Jazz horn, passport, you-are-here, kringle, martini, folded map,
  rooftops, price tag, flag, lamppost, room key: KILLED**, for turn 2's
  reasons. The passport is the best story in the set, and it still doesn't
  say "me". Recorded and not sent, as visual said.
- **The coffee pot (café): only if the build reads as a pot.** A kettle
  means "kitchen". If it can't be told from a kettle at 18px, café's second
  concept is cup + pastry (one object beside the cup, so it covers the
  bakeries, half of the 16), and its noise risk goes on the card.
- **Street: the enamel plate stays, and needs a second concept that
  builds.** The road failed three times. Find one more concept that
  differs in kind and reads at 18px. If none survives the sheet, the card
  says "one concept: the road didn't survive construction three times",
  and shows the failed road small. Owning the miss is better than padding
  the card.
- **Restaurant, hotel: the common sign is clearly best.** He asked for more
  than one concept, so each still gets a second that differs in kind,
  labelled honestly as weaker ("shown so you can see it; we'd keep the
  fork and knife"). That gives him the choice without our pretending it's
  close. (Courage: say it plainly.)
- **Tools, settled by the team and shown as one strip, with no question:**
  close ×, sort arrows, filter sliders, locate crosshair, Directions
  compass, more (…), one solid wedge for both disclosures, zoom +/−, the +
  (his "Build the matched icon"). The current-choice mark moves off the
  check, because the check is Visited's (FIXED). It becomes the solid
  pointer ▸, shown in a menu row, where it reads, not alone, where it
  reads as play.
- **Tools with a real choice** (each a pair on the tools card):
  - delete, × vs bin. The card says it changes how delete works, and UX
    checks it before anything ships.
  - empty list, blank luggage tag vs no icon. The compass is now
    Directions' alone.

### 2. "Convention" vs "our objects" strips: YES, as one frame, not a choice of set

This is the only way to answer his novelty question by eye ("im wondering
if built in context of the rest of the app still feels novel … or if we
should push some more. something to consider but not lock on"). So:

- **One card, near the front**: two full strips of the 11 at 24px.
  1. The common sign for each.
  2. Our object where one survived the sheet, and the common sign where
     none did.
- Each strip is also shown **in a row and on the same small map crop**,
  because his question is "in context of the rest of the app".
- **The same build quality in both.** If the "ours" strip is drawn with
  more care, the frame is rigged. I'll check this first.
- Title it as a question, in his words. No verdict, no editorial. He mixes
  per icon on the cards that follow; the strips aren't two sets to pick
  from.
- Because he said "not lock on", this card asks nothing. It's there to
  look at.

### 3. Which category questions go to him

Fewer is better, and nothing that asks him to do our sorting:

- **Bar → not a question.** The bar card carries the fact ("8 of your 12
  bars are music venues: Jazzhouse, Fasching, Debaser…") and shows glass vs
  notes. His pick answers it. Renaming the category is a data change he
  can raise if he wants. We don't propose it.
- **Attraction / nature / area boundaries → not asked.** It's too broad,
  and it hands him our job. Each place card states, in one line, what's
  actually in it from his saved places. That's enough for him to see a
  mismatch if he cares.
- **Area = district's pin twin → ASKED.** It's concrete, it's his data, and
  it decides whether area needs a concept of its own.
- **Other → ASKED,** as a yes/no. Zero rows. The card shows the asterisk in
  case he keeps it.
- **Pools & hot springs → NOT asked.** It's a new category he never asked
  for. That's the exact pattern he called out ("We aimed at a goal you
  never set"). The nature card's fact line already names the two pools and
  the fumarole. If he wants a category for them, he'll say so. Recorded in
  my notes, not sent.

The questions, word for word, sent with the cards:
1. "For each icon, which concept do you want — or neither?"
2. "Area and district are often the same places (Djurgården,
   Möllevångstorget and Laugavegur are saved as both). Should they share
   one icon?"
3. "Nothing is filed under Other yet. Keep it in the add form, or remove
   it?"

### 4. What goes to him (the cards; all 390 wide at 3x, phone-readable)

Concept level, not drawings. Each card says "rough builds, not drawings"
once, at the top. Each concept is shown as:
- the 24px badge
- the 12px chip glyph
- one row
- one map pin among a few neighbours

with two plain lines:
- **What it shows, and why it fits** what he saved.
- **Could be mistaken for.**

The common sign comes first in every pair. No verdicts on the cards. Where
we'd keep the common sign, the line says so in plain words.

1. `t4-card-0-strips.png`: convention vs our objects (§2). It asks nothing.
2. `t4-card-1-food-drink.png`: restaurant, café, bar.
3. `t4-card-2-sights-outdoors.png`: attraction, nature, shopping.
4. `t4-card-3-places-of-town.png`: area, district, street (with question 2
   beside area), hotel, other (with question 3).
5. `t4-card-4-tools.png`: the settled strip (one line: "settled by the
   team"), then the two pairs (delete, empty list), the pointer in a menu
   row, and the + at 2.00px.
6. `t4-card-5-dropped.png`: every KILL, with its 24px build and one line,
   so he can bring any back. That includes the passport, the hot spring and
   the jazz horn.

Every place has at least two concepts that differ in kind. The only
possible exception is street, and if so it's said openly on the card.

### Open (mine)

- If he picks "ours" for several, the family check (job 6) becomes the
  first test in the drawing step.
- The bin is an interaction change. It needs a UX check before it ships,
  even if he picks it.

NEXT: product designer (systems focus) — fix the two "Settled" records and
the sheet labels (§0b), then product designer (visual focus) — the ticket,
coffee-pot and second-street build tests, then the six t4 cards in §4;
then I score them in one pass, the strips card first.

---

## Turn 4: product designer (visual focus): build tests and the t4 cards

The source is `sketches/t4.html`. It renders the build-test sheet and the
six cards (390 wide at 3x).

### Build tests (`sketches/t3-buildtests.png`, team only)

Each candidate is shown as a 24px badge, then bare at 18px and at 12px,
and judged at 1x.

**Ticket (attraction): FAIL. It isn't shown as a concept.**
- Flat: a battery.
- Tilted 25° with notches at the perforation: a wrapped sweet or a
  plaster.
- Tilted 45°: a pill.
- Scooped corners: a battery or a pill.
- Tilted 20° with end bites, printed lines and a perforated stub: reads as
  a ticket at 24px, but becomes a label at 12px.

Per turn 3, attraction's pair is now **camera / column front**. The
column front's line says it plainly: "It fits museums and palaces, not
landmarks or Tivoli." The ticket goes on the dropped card with its four
misreads.

**Coffee pot (café): FAIL.**
- The diner decanter reads as a lab flask or a kettle.
- The percolator reads as a kettle or a watering can.
- I drew a kettle for comparison, and neither pot clearly beats it.

Café's second concept is now **cup + bun**. Its risk is on the card: "Two
objects in a small circle: busier than one." The decanter goes on the
dropped card.

**Street: a second concept found.**
- The **pedestrian-street sign** (a walking figure, the road sign for a
  street you walk) reads at 18px and at 12px. Its risk: "walking
  directions" or steps.
- The zebra crossing reads as a ladder or a barcode, so it's dropped.

Street's pair is now **pedestrian sign / enamel plate**. Neither is a
road, so the card doesn't need the "one concept" admission. The road
goes on the dropped card with its three failures.

### The six cards (for the owner, after the director's score)

| Card | File |
|---|---|
| 0 Strips | `sketches/t4-card-0-strips.png` |
| 1 Food and drink | `sketches/t4-card-1-food-drink.png` |
| 2 Sights, outdoors and shops | `sketches/t4-card-2-sights-outdoors.png` |
| 3 Parts of town, hotel, other | `sketches/t4-card-3-places-of-town.png` |
| 4 Tools | `sketches/t4-card-4-tools.png` |
| 5 Dropped | `sketches/t4-card-5-dropped.png` |

What every card shares:
- "Rough builds, not drawings" once, in the header.
- Each concept is shown four ways: in a row with one of his real saved
  places, as a 24px badge, as a 12px chip, and as a pin among four
  neighbours on a small map.
- Each concept has two lines:
  - **Shows** (what it is and why it fits what he saved)
  - **Could be** (what it might be mistaken for)
- The common sign comes first.
- No verdicts. Where we'd keep the common sign (restaurant, hotel), the
  line says so plainly.
- Each category opens with a fact line about what he has saved.

**Card 0 (strips):**
- The title is a question, followed by his words, quoted.
- Strip 1 is the common sign for each place. Strip 2 is a travel object
  wherever one survived the sheet: café cup + bun, bar notes, nature
  peaks, shopping awning, street enamel plate. Elsewhere it keeps the
  common sign.
- Both strips use the same build quality, the same three rows (Jazzhouse,
  Svenskt Tenn, Jægersborggade) and the same map crop with one pin per
  category.
- It asks nothing.

**The pairs:**

| Place | A (common sign) | B |
|---|---|---|
| Restaurant | fork + knife | covered dish ("we'd keep the fork and knife") |
| Café | cup | cup + bun |
| Bar | glass | two notes (with his 8-of-12 music venues fact) |
| Attraction | camera | column front |
| Nature | conifer | peaks, without the sun |
| Shopping | bag | shopfront with an awning |
| Area | city blocks, the same as district | a fountain on a square (its own idea) |
| District | city blocks | a solid parcel |
| Street | pedestrian sign | enamel plate |
| Hotel | bed | crescent moon ("we'd keep the bed") |
| Other | asterisk | solid diamond |

Question 2 sits beside area, and question 3 beside other, word for word.

**Card 4 (tools):**
- The settled strip (close, sort, filters, locate, directions, more, one
  wedge, zoom +/−, and the + on its orange badge at 2.00) is labelled
  "settled by the team".
- The pointer is shown in a sort menu row.
- Delete: × vs bin, with the line "This changes how delete works, so our
  UX check comes before anything ships."
- The empty list: blank tag vs no icon.

**Card 5:** every kill, with its 24px build and one line, including the
ticket, the coffee pot, the hot spring, the jazz horn and the passport.

Question 1 ("For each icon, which concept do you want — or neither?") goes
in the coordinator's message with the cards. It isn't on a card.

### Unsure

- Area B (the fountain) and district B (the solid parcel) are the weakest
  seconds. They exist so every place has two concepts that differ in kind.
  Their risks are stated.
- Rows for hotel and other use placeholder names ("A hotel", "Something
  else"), because he has saved nothing in either.

NEXT: design director — score the t4 cards in one pass, the strips card
first.

---

## Turn 5: design director, round 1 scores

Full text in `scores.md`. Cards 0 (strips), 1 (food and drink) and 5
(dropped) score 9. Cards 2, 3 and 4 score 8. My bias check held: no trip
object won on a tie. The fixes:
1. Nature B as real peaks (two summits).
2. Gunnuhver's row as the app renders it (it has no city).
3. District B gets "we'd keep the blocks".
4. The fountain's "could be" adds "an anchor".
5. A "staying as they are" line on card 4 for the marks, the map
   furniture, and Plans' + and ×.
6. The bin's "could be" wording.

NEXT: product designer (visual focus) — fixes 1–6 in scores.md; then
product designer (systems focus) — coverage against jobs.md on all six
cards; then the director looks at cards 2–4 and hands the send list to the
coordinator.

## Turn 6: product designer (visual focus), t4 fixes 1–6

All six `t4-card-*.png` are re-rendered from `sketches/t4.html`.

1. **Peaks redrawn.** Two summits (the taller one with a cream snowcap)
   on a base bar, with no sun. They read as mountains at 24px and 12px.
   The new peaks are in card 0's strip 2, card 2 and every map crop.
2. **Gunnuhver row** now matches his data, read from `locations`
   (read-only): "Gunnuhver - fumarole", NATURE · REYKJAVÍK.
3. **District B** adds "Shown so you can see a second idea; we'd keep the
   blocks."
4. **Area B (fountain):** "Could be" now reads "Drinking water, or an
   anchor."
5. **Card 4** opens with the "Staying as they are" line, word for word
   from scores.md.
6. **The bin's "Could be"** now reads "Nothing else; but it's heavier in
   every row than the ×."

NEXT: product designer (systems focus) — coverage against jobs.md on all
six cards; then the director looks at cards 2–4.

---

## Turn 7: design director, fix-pass check

Cards 2, 3 and 4 are now 9. All six t4 cards are at 9 (`scores.md` round
1b). READY, pending a clean coverage run.

NEXT: coordinator — when systems' coverage against jobs.md comes back
with no blockers, send the six t4 cards in order with the three questions
(word for word in scores.md round 1); if it finds a blocker, the visual
designer fixes it and the director looks at that card only.

---

## Turn 8: product designer (systems focus), coverage on the t4 cards

The full table is in `coverage.md`. **2 blockers, both on card 4 (tools),
each a one-icon or one-line fix.** All 11 places pass every job: two
concepts each, his real saved places, all four views, a "Could be", and
the area and other questions.

1. **The account is on no card** (job 1). The passport is on the dropped
   card, but the kept account (v6's solid head) isn't in card 4's settled
   strip.
2. **The + overload is unanswered** (jobs.md: "Concepts must say which
   meanings may share a symbol"). × and the check are handled; zoom + and
   "add a place" sit side by side with no line.

Not blocking:
- The blurred cream details (shopfront door, enamel plate, snowcap, bun)
  read as faults.
- The pointer should say it also covers the current plan.
- "Staying as they are" lists items without a reason.
- If he answers "keep area and district separate", area A has to change.

NEXT: product designer (visual focus) — the two card-4 fixes (and the
blur, if cheap); then the director looks at card 4 only, per turn 7.

## Turn 9: product designer (visual focus), card-4 blockers and the crisp cuts

All `t4-card-*.png` are re-rendered from `sketches/t4.html`.

1. **Account:** the kept account icon (v6's solid head with open
   shoulders, orange on the navy scalloped button) is now in card 4's
   settled strip.
2. **The + overload: kept together, no split.** The card says: "+ means
   two things here: zoom in, and add a place. We keep one symbol for both.
   Zoom + always sits with − in the map's small white zoom box; add a place
   is the big orange badge. The box around each tells them apart."
   - Why: the containers already separate them, and a pin-with-+ was
     dropped for adding ink to the loudest button.
   - Plans' + stays out of this until Plans is live, as the card's
     "Staying as they are" line says.
   - Systems: say if you disagree.
3. **Crisp cuts.** The cream details are now drawn a second time, sharp,
   on top of the softened ink (the soft filter was blurring them). That
   fixes the shop door, the plate's name bar, the snowcap, the bun's
   highlight, and every other cream cut on every card.
4. **The pointer** line now says "the chosen sort, and the current plan,
   get a pointer instead".
5. **"Staying as they are"** gives each item a few words of why.

NEXT: design director — look at card 4 (and the crisp cuts on cards
0–3), then hand the send list to the coordinator.
