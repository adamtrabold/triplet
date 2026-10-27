#!/usr/bin/env python3
"""Throwaway icon preview: index.html with the new grid drawings swapped in, 1:1.

    python3 design/icon-system/preview/build.py        (from the repo root)

Reads ../../../index.html and ../grid/svg/right/*.svg; writes ./index.html.
Nothing else in the app changes, except what an Artifact needs to run:
  - leaflet.css is inlined (Artifacts load stylesheets only from Google Fonts);
  - the playground reads a snapshot of the public tables baked in at build time
    (an Artifact can't reach Supabase), instead of the live database.
Never lands on main.
"""
import json, os, re, sys, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
SVG = os.path.join(HERE, '..', 'grid', 'svg', 'right')
CATS = ['cafe', 'bar', 'museum', 'nature', 'restaurant']
SUPABASE_URL = 'https://jgvckilmltimabfdvaly.supabase.co'
TABLES = ['locations', 'neighborhood_shapes', 'cities', 'plans', 'plan_stops']

src = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
out = src


def sub(old, new, count=1):
    global out
    n = out.count(old)
    if n != count:
        sys.exit(f'build.py: expected {count} of {old[:80]!r}, found {n}')
    out = out.replace(old, new)


def d_of(name):
    s = open(os.path.join(SVG, name + '.svg'), encoding='utf-8').read()
    return re.search(r'\sd="([^"]*)"', s).group(1)


def symbol(sym_id, box, d):
    return (f'<symbol id="{sym_id}" viewBox="0 0 {box} {box}"><path fill="currentColor" '
            f'fill-rule="evenodd" stroke="none" d="{d}"/></symbol>')


# 1. The new drawings as symbols, each in its own box (1:1, never scaled).
syms = [symbol(f'n-{c}-{s}', s, d_of(f'{c}-{s}')) for c in CATS for s in (12, 18, 24)]
syms.append(symbol('n-star-18', 18, d_of('star-18')))
anchor = '    <symbol id="g-restaurant"'
sub(anchor, '    <!-- ICON PREVIEW: design/icon-system/grid/svg/right/, 1:1 -->\n    ' + '\n    '.join(syms) + '\n' + anchor)

# 2. Chips: the 12 drawing in a 12 box.
sub("    function glyphHtml(category, size) {\n",
    "    const PREVIEW_ICONS = new Set(" + json.dumps(CATS) + ");   // ICON PREVIEW\n"
    "    function glyphHtml(category, size) {\n"
    "      if (size === 12 && PREVIEW_ICONS.has(category)) return `<svg width=\"12\" height=\"12\" viewBox=\"0 0 12 12\" aria-hidden=\"true\"><use href=\"#n-${category}-12\"/></svg>`;\n")

# 3. Badges: THE-GRID.md rims (24 ring 4/3px, 32 ring 2px) on every glyph badge at those sizes;
#    a new drawing's own box placed 1:1 (18 at 3,3 in the 24; 24 at 4,4 in the 32).
sub("      const rim  = opts.rim || 2;\n",
    "      const gridRim = opts.glyph !== false && (size === 24 || size === 32);   // ICON PREVIEW: THE-GRID.md rims\n"
    "      const rim  = gridRim ? (size === 24 ? 4 / 3 : 2) : (opts.rim || 2);\n")
sub("      if (opts.glyph !== false) {\n",
    "      if (opts.glyph !== false && PREVIEW_ICONS.has(category) && (size === 24 || size === 32)) {   // ICON PREVIEW\n"
    "        const g = size === 24 ? 18 : 24, o = (size - g) / 2;\n"
    "        glyph = `<svg class=\"badge-glyph\" x=\"${o}\" y=\"${o}\" width=\"${g}\" height=\"${g}\" viewBox=\"0 0 ${g} ${g}\" style=\"color:${mark}\"><use href=\"#n-${category}-${g}\"/></svg>`;\n"
    "      } else if (opts.glyph !== false) {\n")

# 4. The star: the 18 drawing, bare, 1:1 in the row's 18 box and on the tag (18 inside its 20 slot).
#    The drawing is the outline itself, so the old CSS keyline stroke is off (stroke="none" on the path).
sub("'<svg class=\"row-star\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><use href=\"#g-star\"/></svg>'",
    "'<svg class=\"row-star\" viewBox=\"0 0 18 18\" aria-hidden=\"true\"><use href=\"#n-star-18\"/></svg>'")
sub("`<svg class=\"tag-star${loc.starred ? '' : ' is-open'}\" viewBox=\"-1 -1 26 26\" aria-hidden=\"true\"><use href=\"#g-star${loc.starred ? '' : '-open'}\"/></svg>`",
    "`<svg class=\"tag-star${loc.starred ? '' : ' is-open'}\" viewBox=\"0 0 18 18\" style=\"width:18px;height:18px;margin:1px\" aria-hidden=\"true\"><use href=\"#n-star-18\"/></svg>`")

# 5. The +: the 60 drawing 1:1 in the 60px button.
plus = d_of('plus-60')
old_plus = '<svg width="26.4" height="26.4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8182" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>'
new_plus = f'<svg class="n-plus" width="60" height="60" viewBox="0 0 60 60" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="{plus}"/></svg>'
sub(old_plus, new_plus, 2)   # first paint + setAddBtnGlyph()
sub('</style>', '    #floatingAddBtn svg.n-plus { width: 60px; height: 60px; flex: none; }   /* ICON PREVIEW */\n  </style>')

# --- Artifact plumbing (no visual change) ---
css_link = '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />'
css = urllib.request.urlopen('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css').read().decode('utf-8')
sub(css_link, '<style>/* leaflet@1.9.4 leaflet.css, inlined for the Artifact */\n' + css + '\n</style>')

snap = {}
key = re.search(r"const SUPABASE_KEY = '([^']+)'", src).group(1)
for t in TABLES:
    req = urllib.request.Request(f'{SUPABASE_URL}/rest/v1/{t}?select=*', headers={'apikey': key})
    try:
        snap[t] = json.loads(urllib.request.urlopen(req).read())
    except Exception as e:
        print(f'build.py: {t} not snapshotted ({e}); the playground falls back to the live read', file=sys.stderr)
sub("      const load = name => tables[name] || (tables[name] = real.from(name).select('*')\n",
    "      const PREVIEW_SNAPSHOT = " + json.dumps(snap, separators=(',', ':')).replace('</', '<\\/') + ";   // ICON PREVIEW: the public tables at build time\n"
    "      const load = name => tables[name] || (PREVIEW_SNAPSHOT[name] ? (tables[name] = Promise.resolve({ rows: JSON.parse(JSON.stringify(PREVIEW_SNAPSHOT[name])) })) : null) || (tables[name] = real.from(name).select('*')\n")

dst = os.path.join(HERE, 'index.html')
open(dst, 'w', encoding='utf-8').write(out)
print(f'wrote {dst} ({len(out)} bytes); snapshot rows: ' + ', '.join(f'{t} {len(v)}' for t, v in snap.items()))
