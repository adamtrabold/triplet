# Round 7: UX review of star colour and tag paper as state

UX agent, 2026-10-07, on `0afc4c2`. I judge **meaning and legibility
only**; the look is the CD's call. Brief: `docs/ux-brief.md`. Evidence:
the 1x phone stills, then the 3x crops, plus a colour-blindness simulation
of my own (Machado 2009, full severity, CIE76 ΔE; script in the session
scratchpad, numbers below).

Owner (verbatim): "Not sure on the circle we can keep for now. Stars should
be colored imo" · "I'm also wondering if we couldn't play with the
background color of some or all of the tag in any or all states as part of
the approach to some or all of the actions. Looking at the inspo" · palette:
"using best practices around how to apply consistently and meaningfully".

## Ranking

| Area | Rank | Ready for the owner? |
|---|---|---|
| Star colour | **A Magenta** > today's ink (baseline) > B Leaf | Yes, A. B collides with the "nature" meaning (spruce-green pins) and has the thinnest contrast (3.44:1 on pressed). |
| Tag paper | **2 Whole tag** ≥ 1 Stub > 3 Band | Yes, 2 or 1. Band mixes two scopes and puts the × on a state colour. |

## 1. Does the star read as "starred" at a glance?

| Surface | Result | Evidence |
|---|---|---|
| List | PASS | `magenta-list-reykjavik`: the magenta star sits between the category ring and the name, clearly not a category colour, next to orange restaurant rings. |
| Map, near | PASS | `magenta-map-near`: the magenta star on its paper halo, next to orange, lavender and green rings and on dark visited stickers. |
| Map, clusters | PASS | `magenta-map-far`: small magenta stars on the orange cluster discs. The halo keeps them apart from the disc. They're small at 1x but readable. |
| Tag | PASS | The STARRED segment's star + word in magenta (`whole-starred`). |
| Gesture | PASS | The landed ink is magenta; the pencil sketch stays grey. Same "pencilled → inked" story. |

**Collisions with other meanings (normal vision):**
- Magenta never sits near orange (selected/cluster) or navy (visited).
- The nearest category is shopping lavender, and it's still a different hue
  family.
- The star *shape* plus its paper halo is always the primary cue.

**Highlighted (orange) row: the star falls back to paper. Not confusing.**
- Everything on a highlighted row reverses to paper, so the star follows
  the same rule as the name and meta, and keeps its shape.
- It's the row you just selected, and the open tag next to it shows the
  magenta star at the same moment.
- It's the only surface where starred isn't magenta. Make sure no one
  "fixes" this into a magenta star on orange, which would be 1.1–1.2:1.

**Colour-blind safety** (ΔE between the simulated colours; lower = harder
to tell apart):

| | shopping lavender | restaurant orange | `--figure-deep` (Reykjavík) | visited ink | `--ink` |
|---|---|---|---|---|---|
| normal | 44.6 | 63.1 | 62.4 | 59.4 | 65.1 |
| protan | 21.7 | 66.8 | 66.7 | **13.3** | 34.2 |
| deutan | 20.2 | 55.3 | 56.5 | **12.4** | 33.4 |
| tritan | 59.9 | **12.6** | **13.7** | 72.3 | 66.4 |

- **Magenta against shopping lavender** (the coordinator's check): still
  separable under every simulation (≥20).
- **Magenta against restaurant orange:** fine for red-green (protan/deutan),
  but **close for tritan (~13)**. That means a star on a restaurant ring or
  an orange cluster disc.
- **Not asked about, but the real risk:** under protan and deutan, magenta
  is close to the **visited sticker ink** (~12–13). A starred + visited pin
  puts a magenta star on a slate sticker.
- These are safe **only because the star never relies on colour**: it's
  always a star shape, always on a paper halo. **Must-fix 1:** keep the
  `--paper` halo on every map star (pins, clusters, visited stickers, shape
  pins). Never draw a bare magenta star on a coloured field.

## 2. Tag paper as state: telling the four states apart at 1x

| State | 1 Stub | 2 Whole tag | 3 Band |
|---|---|---|---|
| neither | plain | plain | plain |
| starred | blush stub + ★ STARRED | blush tag + ★ STARRED | magenta band + ★ STARRED |
| visited | filed stub + stamp | filed tag + stamp | filed tag + stamp |
| both | darker stub + both marks | darker tag + both marks | band + filed tag + both marks |
| Paper alone tells the 4 states apart at 1x? | Hard: the stub is small and blush vs filed is subtle | **Mostly:** the starred tag reads pink and the visited tag reads tan at 1x (`whole-starred` vs `whole-visited`). "Both" is the darkest. | Starred, yes (strong). Visited vs neither by tint only. |
| Without colour at all? | **Yes:** the segment marks carry every state | **Yes**, same | **Yes**, same |

- **Not colour alone, in all three.** The STARRED / ★ and stamp / ✓ VISITED
  marks carry every state, and the paper only reinforces them. That
  passes.
- **Why Whole ≥ Stub:**
  - Whole makes the state glanceable from across the tag, with one rule
    ("the tag's stock is its state"). It extends the shipped visited-row
    filing that the owner already knows.
  - Stub keeps the colour next to the controls it reflects (good mapping),
    but at 1x the colour barely registers, so it adds little.
  - Both pass. Pick on taste.
- **Why Band is last:**
  - Starred is shown by a band at the top while visited is shown by the
    whole paper: two scopes for two states, so it's harder to learn.
  - The × (close) sits on the starred band, so a control's background
    changes with state.
  - Under tritan, the magenta band sits close to the orange category and
    cluster colours on the map right above it.
- **Must-fix 2 (Whole):**
  - The blush and filed papers must stay distinct from the signed-out
    dimming and from the pressed state (`--paper-pressed`). A tapped segment
    on blush paper must still show its press.
  - Use the existing pressed-on-filed step (`--state-press-filed`) and add
    an equivalent for the blush papers.
- **Must-fix 3:** the "both" paper is the darkest. Notes stay ≥11:1, as
  measured, so keep the text contrast check in the build gate for all four
  papers.

## 3. Signed out

`*-signedout`: the paper still shows the state (viewers can read it), and
only Star and Visited are dimmed. In `whole-signedout` the dimmed
"STARRED" in 0.4 magenta on blush is faint, but the paper and the pin star
still say "starred". Dimmed must not read as "unstarred". **Must-fix 4:**
- the dimmed starred control keeps its *filled* glyph (it does);
- VoiceOver says "Starred, sign in to change", not just "dimmed";
- the round 6 slip rules apply (first tap only dismisses the slip,
  aria-disabled, live region).

## Must-fixes

1. A paper halo on every map star. Colour is never the only cue (it matters
   for protan/deutan against visited ink and for tritan against orange).
2. Whole tag: pressed states defined on the blush and blush-filed papers.
3. Keep the text-contrast check for all four papers in the gate.
4. Signed out: the dimmed control keeps its state glyph; the VoiceOver label
   gives the state + the reason.
5. The highlighted row keeps the paper star (the reversal rule): don't make
   it magenta.

## Not verified

Chromium stills and a numeric colour-blindness simulation only, with no
real colour-blind viewer and no device. 10–12px map stars at 1x on real OSM
tiles are unchecked.
