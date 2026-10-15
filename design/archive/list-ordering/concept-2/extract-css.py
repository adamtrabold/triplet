# Regenerates app.css from index.html: the app's real tokens, header,
# ledger rows, stamp, star and action rules, copied verbatim. Ids become
# classes so several phone frames can share one page. Run from repo root:
#   python3 design/list-ordering/concept-2/extract-css.py
import re, pathlib
here = pathlib.Path(__file__).parent
lines = (here / '../../../index.html').resolve().read_text().split('\n')
# 1-based inclusive ranges, as read on 2026-09-29 (main @ worktree base)
ranges = [(154, 245), (266, 266), (302, 307), (773, 895), (916, 1370)]
out = ['/* VERBATIM from index.html -- see extract-css.py. Do not hand-edit. */']
for a, b in ranges:
    out += lines[a - 1:b]
css = '\n'.join(out)
for name in ['filtersPanel', 'cityFilters', 'locationsHeader', 'locationsList', 'collapseBtn', 'toggleFiltersBtn', 'centerMeBtn']:
    css = css.replace('#' + name, '.' + name)
css = re.sub(r'#locations\b', '.locations', css)
css = re.sub(r'#filters\b', '.filters', css)
(here / 'app.css').write_text(css + '\n')
print(css.count('{'), css.count('}'))
