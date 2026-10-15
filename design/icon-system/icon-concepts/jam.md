# Icon concepts: jam

Step 3 of the icon project: **what each icon depicts and why**, not how
it's drawn. Inputs: `../owner.md` (newest at the bottom), `jobs.md`,
`../inventory.md`, the v6 rules card
(`../brand-approach/concepts/sketches/v6-card-rules.png`), the Constructed
card (`v6-card-2-constructed.png`), `../../inspo/`, and the owner's saved
places (read from the live `locations` and `neighborhood_shapes` tables,
2026-10-15, read-only).

Settled: Constructed (built on the grid, warmth from subtle rounding,
the vintage brochure feel); the v6 rules (outlined = not marked by me,
only blanks are empty, places solid in a circle, 2.00px); Visited FIXED;
hand-made looks out.

---

## Turn 1: product designer (systems focus)

Real draws (python `secrets`). Oblique Strategies: **"Use unqualified
people"** and **"Look at the order in which you do things"**. Borrowed
fields: **the Ordnance Survey map legend** and **hobo signs**. All four
are used below.

### 0. The lesson from "your calls have been the exact opposite of mine"

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
whimsical." This turn reads wit as a property of the **concept** (what
the icon depicts, a double meaning, a trip object). Hand-made warmth
(texture, ink bleed) is a property of the **craft**, and belongs to the
grid and drawing step. I note where an icon could carry it.

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
3. **The craft layer as a concept, for the grid step**. His "the inkblot
   thing" points at one specific, already-shipped hand-made source: **ink
   bleed**. The stamp and the Pencil Star already behave like ink. A
   printed place glyph could carry a very faint ink-spread at its corners
   (the rounding *is* ink spread, rather than a CSS radius). That's warmth
   from construction method, his phrase. It's not a concept for this step;
   I'm noting it so the grid step tests it rather than defaults to a
   plain radius.

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
