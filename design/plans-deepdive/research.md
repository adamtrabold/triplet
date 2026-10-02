# Research notes (2026-09-29)

Web search only. `support.google.com` is blocked by the sandbox proxy, and the Apple HIG page came back empty through fetch. So everything here comes from search snippets and secondary sources, not from hands-on app use.

| App | Mechanism | Verified? |
|---|---|---|
| Google Maps lists | A **Save** button on the place sheet opens a picker of lists: the built-ins (Favorites, Want to go, Starred) or a custom list via "New list". Saved places show as icons on the map. Lists can be manually reordered ("Customize list order"). | Save and the picker: yes, several sources agree. Map icons: one source. Manual reorder: snippet only, not confirmed. |
| Google Maps directions | Add stop, up to 10 stops in total, reordered by press-and-drag on the stop. | Yes, several secondary sources agree. |
| Apple Maps Guides | From a place: More, then Add to Guides, then pick a guide. Or from inside a guide: Add a Place, search, then + on a result. | Yes (iGeeksBlog, Tom's Guide). Reordering on iPhone: **not verified** (the sources only cover sorting on Mac). |
| Wanderlog | Drag-and-drop reordering and a route optimizer. Every place you add is pinned on the map straight away. Places can go to a day or to a general list. | Vendor App Store copy only. The exact "move to day" steps: **not verified**. |
| Komoot planner | By default it slots waypoints in wherever the route is shortest. You add one at the end explicitly, and there's a "Manage waypoints" menu. | Komoot's own pages. Not tried in the app. |
| Apple HIG, segmented control | For closely related choices that change a view. **Avoid it for actions** (add, remove, edit). No more than about 5 segments on iPhone, equal widths, and text or icons but not both. | Search snippet of the HIG page. The direct fetch returned no body. |

Not researched: Citymapper, TripIt, Roadtrippers and AllTrails. I make no claims about them.

**What carries over to triplet:**
1. Adding happens where you're already looking at the place. Google and Apple use one control plus a destination picker (that's model C), and Apple's in-guide "Add a Place" shows candidates with + (model B).
2. Drag to reorder is the norm for ordered stops.
3. Saved or planned places stay visible on the map.
4. A segmented control switches views. Actions like New or Edit never sit inside it or beside it as look-alike chips.
