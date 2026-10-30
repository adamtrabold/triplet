# v11 · What the turned signpost says, the faster flip, and tapping the sign

Owner on the v10 prototype: "sign flip is a bit slow. can i clcik that to remove too? it doesnt seem
to do anything. maybe instead of flipping to remove as if it's a button it should flip to something
more whimsical like "bye-bye?" or "see you soon?" or something more about going away or not taking
a trip or something .. want some brainstorming"

## Draws (real randomness)
`words.py` (python, `secrets`-seeded), run twice: each draw = a voice (15 to choose from) + an
Oblique Strategy + a word limit (1-3). All twelve draws and what each produced:

| # | Voice · Oblique · max words | Produced |
|---|---|---|
| 1 | weather forecast · Repetition is a form of change · 2 | **Clearing off** |
| 2 | map legend · Use an old idea · 1 | **Off the map** (broke the limit by 2: "Unmapped" read as an error) |
| 3 | weather forecast · Honor thy error as a hidden intention · 3 | **Change of plans** |
| 4 | camp counsellor · Make it more sensual · 3 | **Strike the tent** |
| 5 | customs officer · What wouldn't you do? · 1 | **Declined** (thrown away: reads as a card refused) |
| 6 | departure board · Emphasize the flaws · 2 | **Cancelled** |
| 7 | tour guide · Use an old idea · 2 | **Tour's over** |
| 8 | wistful · Use an old idea · 1 | **Someday** |
| 9 | customs officer · Repetition is a form of change · 2 | **No entry** (thrown away: hostile) |
| 10 | old telegram · Give the game away · 2 | **Trip off. Stop.** (kept as a candidate; leans costume) |
| 11 | travel agent · Make it more sensual · 2 | **Not this time** (3 words) |
| 12 | hotel front desk · What wouldn't you do? · 2 | **Checking out** |

## Candidates (13)
- **Departure board:** Cancelled · Not departing
- **Postcard sign-off:** Wish we'd been there · See you soon? (owner)
- **Luggage tag / hotel:** Checking out · Unclaimed
- **Travel agent:** Not this time · Change of plans
- **Wistful:** Someday · Bye-bye? (owner)
- **Deadpan / weather / camp:** Clearing off · Strike the tent · Tour's over
- **Telegram:** Trip off. Stop.

**Owner-taste check.** Whimsy has to carry meaning, not costume: "Trip off. Stop." leans on a
telegram costume, the same family as the typewriter face the owner turned down, so it's out. It has
to stay simple: "Wish we'd been there" is too long for a board. "Unclaimed" and "Someday" are too
vague about what happens. The ones that keep their meaning are the departure-board and travel words.

## Top 3
1. **Cancelled** (in the prototype). It's the departure board's own word, on a sign that just turned
   over like one: the city's trip is off. One word, fits the board, unmistakable, not a button.
2. **Change of plans.** Kinder, says why you're doing it, and it's true whether you'll come back or
   not.
3. **See you soon?** The owner's seed, the most wistful. The question mark softens it. It fits a
   city you might go back to, and suits the default of moving its places elsewhere.

The prototype has a small "Sign says:" toggle at the top to swap between the three.

## Row board, confirm and tapping the sign
- **The dropdown row's board keeps REMOVE.** It's where you act, so it stays the plain, clear
  action. The signpost carries the whimsy: it's the map's commentary, not the control.
- **The confirm heading stays plain:** "Remove Stockholm from your cities? Its 23 places move to a
  city you pick, or are removed too."
- **Buttons: KEEP STOCKHOLM | REMOVE** (was Cancel | Remove). Cancel would clash with a sign that
  says CANCELLED, and Keep says plainly what happens.
- **Tapping the turned sign opens the same confirm**, the same as tapping the row's board (owner:
  "can i clcik that to remove too?").
- **When the menu is closed:** the sign isn't turned (it's only turned while its row is open), so
  there's nothing to tap; a resting sign still just goes to its city. That keeps a map tap from ever
  starting a remove on its own.
- **VoiceOver:** the direct path is the row's "Remove {city}" custom action. The turned sign is
  decorative to VoiceOver (aria-hidden), so it isn't a second, confusing control.

## The flip
- **140ms** (was 260ms), `cubic-bezier(.3,1.35,.5,1)`, a slight snap.
- Measured in Chromium: 172° at 56ms, settled at 180° by about 140ms.
- Reduced motion: no transition.

## Checked in Chromium (`proto/swipe-flap.html`)
- The flip timing above.
- Tapping the turned sign opens the confirm.
- Tapping an unturned sign does nothing.
- The toggle swaps the sign's words; all three fit the board.
