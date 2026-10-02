# Plans deep dive (concept, replaces day-agendas rev 6.1)
### Why rev 6.1 fails (its `filmstrip-1x.png`):
- **The toggle reads as chips.** PLANS and PLACES are two separate boxes with a gap, the same shape as the city chips under them. There's no shared track, and the "on" half looks exactly like a selected city.
- **You can't add from the list.** The Plans list shows only the stops. To add a place you go through panel, Edit, panel, PLACES, then tap + on a row, or use "+ Add 8 in view" (only at zoom 15+, and it adds everything in view). The map shows places the list can't reach.
- **Editing is a hidden mode split across three places.** Edit is in the panel. Done is a banner row in the list. Rename and Delete sit in a disguised `<select>`. Editing also changes what the map shows.
- **Actions look like choices.** "+ NEW" and "EDIT" are chips in the same wrapping row as the plan names. HIG says a segmented control is for switching views, never for add or edit actions.
- **Switching takes about 4 taps** (panel, PLANS, plan, close). The header is only a label, so the list gives no clue how to get back.
- **Owner didn't name these:** in edit, the × becomes + / ✓ / — under the finger (delete-safety risk). The — reads as a dash. Stop numbers are 13px, well under a 44px target. "Tap NEXT for 4s" is hidden. The dotted-underline "links" read as plain text.
### Three models (research notes: `research.md`; re-render with `harness/frames.js`, `sheet.js`)
(`contact-sheet-1x.png`: 4 frames each at 390px 1x, from the real index.html). All three use one real segmented control: a joined navy track with equal halves, and the ON half is the state system's navy tile.
- **A. Plan column on Places:** you build in the normal list. Each row's right slot shows + or its stop number. PLAN is a second list, used only for following.
- **B. The plan is the sheet (PICK):** open a plan and the list shows its stops, a rule, then everything else in your list with +. The same view builds and follows.
- **C. Plans as saved lists:** works like Google Maps Save. A place's popup gets "Add to plan", and PLANS shows your plans as rows you open.
### Pick: B
It's the only model with no edit mode and no view switch between building and following. Every place the map shows is one tap from being added (+ appends it at the end). The header names the plan, and the map keeps every pin, with the stops numbered.
- **A rejected:** once the panel closes, nothing on screen says which plan + adds to (a hidden mode again). The × also has to move out of the row.
- **C rejected:** each add takes 3 taps and goes through the popup, and the list-of-plans step and a "‹ All plans" row add depth.
### Reordering: drag a grip
in the stop's right slot (the stops have no ×). This is the Google Maps stops / Wanderlog norm. In code it means a pointer handler on `.grip` with `touch-action: none`, kept out of the row's tap and swipe handling the same way `.delete-btn` is. Siblings shift with transforms, and a `position` column goes in `plan_stops`. The full gesture gate has to run, because this touches the row plumbing.
- **UX check passes:** a row tap still navigates and opens the popup, star and visit swipes are unchanged on every row, all targets are 44px, the collapsed header names the plan, the list scrolls normally, and the switch is a radiogroup.
- **Open risk in B:** removing a stop means dragging it below the rule (with Undo), which is hard to discover. Delete (×) happens only in PLACES.
### Assumptions for the owner to confirm
1. While following, the rest of your places sit below the rule. Is that (a) fine, (b) better hidden behind one "Add places" row, or (c) do you prefer A's separate lists?
2. Removing a stop: (a) drag it below the rule + Undo, (b) a visible remove control on each stop, or (c) from its popup?
3. Picking a plan in the panel: (a) closes the panel straight away, or (b) leaves it open?
