# Round 6: r6-proto.html = r5-proto.html + eraser dust that is brushed OUT of the text column.
import pathlib, sys
s = pathlib.Path('r5-proto.html').read_text()
def R(a, b, n=1):
    global s
    if s.count(a) != n: sys.exit(f'anchor x{s.count(a)} != {n}: {a[:80]!r}')
    s = s.replace(a, b)
R("""      [[2, 9, -1], [6, 11, 0.5], [10, 8, 1]].map(([a, b2, c]) => [a * k, b2 * k, c]).forEach(([cx, cy, drift], i) => {
        if (!which.includes(i)) return;
        const c = document.createElement('span');
        c.className = 'sg-crumb';
        c.style.left = (x + cx) + 'px'; c.style.top = (y + cy) + 'px';
        g.main.appendChild(c);
        c.animate([{ transform: 'translate(0,0)', opacity: 1 }, { transform: `translate(${drift}px, 2px)`, opacity: 0 }],
                  { duration: 140 + i * 30, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' })
          .finished.then(() => c.remove(), () => c.remove());
      });""", """      // Round 6: the dust is BRUSHED OFF THE PAGE -- out of the text column.
      // It falls from the star's lower-left inner corner and is swept left
      // (fast at first) into the 12px gutter between the category badge and
      // the text column, which no text ever enters, fading as it goes. The
      // name, already on its way home (N4-b), therefore never meets a speck:
      // no stray "accent" on the letters.
      [[3.5, 9.5, -12, 2], [4.5, 10.8, -13, 3], [2.8, 8.4, -11, 1.5]].map(([a, b2, dx, dy]) => [a * k, b2 * k, dx, dy]).forEach(([cx, cy, dx, dy], i) => {
        if (!which.includes(i)) return;
        const c = document.createElement('span');
        c.className = 'sg-crumb';
        c.style.left = (x + cx) + 'px'; c.style.top = (y + cy) + 'px';
        g.main.appendChild(c);
        c.animate([{ transform: 'translate(0,0)', opacity: 1 },
                   { transform: `translate(${dx * 0.7}px, ${dy * 0.5}px)`, opacity: 0.9, offset: 0.3 },
                   { transform: `translate(${dx}px, ${dy}px)`, opacity: 0 }],
                  { duration: 200 + i * 20, easing: 'cubic-bezier(.2,.6,.4,1)', fill: 'forwards' })
          .finished.then(() => c.remove(), () => c.remove());
      });""")
# the live row borrows 12px on the left; when it hands it back, any dust still falling keeps its place on screen
R("""    function releaseStarRow(el, g, restore) {
      el.classList.remove('sg-live');""", """    function releaseStarRow(el, g, restore) {
      const dust = [...el.querySelectorAll('.sg-crumb')], before = dust.length && g.main ? g.main.getBoundingClientRect().left : 0;
      el.classList.remove('sg-live');
      if (dust.length && g.main) { const shift = before - g.main.getBoundingClientRect().left; dust.forEach(c => { c.style.left = (parseFloat(c.style.left) + shift) + 'px'; }); }""")
# lift -> name moving <= 150ms: after an unstar is released, the rub finishes by lift+220ms at
# the latest (180ms; it has already been running during the drag), and the name leaves at dust - 100ms.
R("""          const at = STAR_SWIPE.COMMIT - 100 * STAR_SWIPE.COMMIT / STAR_SWIPE.RUB_MS;
          g.onNear = { at, cb: () => flipToFinal(el, g, nowStarred, STAR_SWIPE.SETTLE, both) };
          g.onPen = () => both();
          setPen(g, STAR_SWIPE.COMMIT);
          if ((g.v || 0) >= at && g.onNear) { const cb = g.onNear.cb; g.onNear = null; cb(); }""",
"""          const at = STAR_SWIPE.COMMIT - 100 * STAR_SWIPE.COMMIT / STAR_SWIPE.RUB_MS;
          g.rubDeadline = sgNow() + STAR_SWIPE.RUB_AFTER_LIFT;          // round 6: lift -> name moving <= 150ms
          g.onNear = { at, time: g.rubDeadline - 100, cb: () => flipToFinal(el, g, nowStarred, STAR_SWIPE.SETTLE, both) };
          g.onPen = () => both();
          setPen(g, STAR_SWIPE.COMMIT);
          if ((g.v || 0) >= at && g.onNear) { const cb = g.onNear.cb; g.onNear = null; cb(); }""")
R("""        if (g.onNear && v >= g.onNear.at) { const cb = g.onNear.cb; g.onNear = null; cb(); }""",
  """        if (g.onNear && (v >= g.onNear.at || now >= g.onNear.time)) { const cb = g.onNear.cb; g.onNear = null; cb(); }""")
R("""          let rate = g.starred ? STAR_SWIPE.COMMIT / STAR_SWIPE.RUB_MS : (STAR_SWIPE.COMMIT - s0) / STAR_SWIPE.HAND_MS;""",
  """          let rate = g.starred ? STAR_SWIPE.COMMIT / STAR_SWIPE.RUB_MS : (STAR_SWIPE.COMMIT - s0) / STAR_SWIPE.HAND_MS;
          if (g.starred && g.rubDeadline !== undefined) rate = Math.max(rate, (STAR_SWIPE.COMMIT - v) / Math.max(1, g.rubDeadline - now));""")
R("""HAND_MS: 360, RUB_MS: 400, SKETCH_MIN: 280 };""", """HAND_MS: 360, RUB_MS: 400, SKETCH_MIN: 280, RUB_AFTER_LIFT: 180 };""")
pathlib.Path('r6-proto.html').write_text(s); print('ok')
