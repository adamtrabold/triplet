#!/usr/bin/env python3
"""Throwaway icon preview: index.html with the system's drawings swapped in, at their shipped size.

    python3 design/icon-system/preview/build.py        (from the repo root)

Reads ../../../index.html and ../grid/svg/system/{18,24,12}/*.svg (THE-SYSTEM.md); writes ./index.html.
Each system SVG is used exactly as written: its viewBox and its own width/height (18 -> the whole
24 badge box, 24 -> the whole 32 badge box, 12 -> a 16 box centred on the chip's 12 slot, star 18,
+ 28 centred in the 60 button). Rings per THE-SYSTEM.md: 1 1/3 at 24, 1 2/3 at 32.
Nothing else in the app changes, except what an Artifact needs to run:
  - leaflet.css is inlined (Artifacts load stylesheets only from Google Fonts);
  - the playground reads a snapshot of the public tables baked in at build time
    (an Artifact can't reach Supabase), instead of the live database.
Never lands on main.
"""
import json, os, re, sys, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
SVG = os.path.join(HERE, '..', 'grid', 'svg', 'system')
SIZES = ('12', '18', '24')
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


def read_svg(size, name):
    s = open(os.path.join(SVG, size, name + '.svg'), encoding='utf-8').read()
    vb = re.search(r'viewBox="([^"]*)"', s).group(1)
    w = float(re.search(r'\swidth="([^"]*)"', s).group(1))
    d = re.search(r'\sd="([^"]*)"', s).group(1)
    return vb, w, d


def symbol(sym_id, vb, d):
    return (f'<symbol id="{sym_id}" viewBox="{vb}"><path fill="currentColor" '
            f'fill-rule="evenodd" stroke="none" d="{d}"/></symbol>')


# 1. Every category icon present at all three sizes (variants like museum-d5 skipped), plus star and +.
def names(s):
    return {f[:-4] for f in os.listdir(os.path.join(SVG, s)) if f.endswith('.svg')}


CATS = sorted(n for n in names('18') & names('24') & names('12') if '-' not in n)
syms, W = [], {}
for c in CATS:
    for s in SIZES:
        vb, w, d = read_svg(s, c)
        syms.append(symbol(f'n-{c}-{s}', vb, d))
        W[(c, s)] = w
star_vb, star_w, star_d = read_svg('18', 'star')
plus_vb, plus_w, plus_d = read_svg('18', 'plus')
syms.append(symbol('n-star', star_vb, star_d))
for c in CATS:   # the code below places 18 at 24px, 24 at 32px, 12 at 16px
    assert (W[(c, '18')], W[(c, '24')], W[(c, '12')]) == (24, 32, 16), (c, W)
assert star_w == 18 and star_vb == '0 0 24 24', star_vb
anchor = '    <symbol id="g-restaurant"'
sub(anchor, '    <!-- ICON PREVIEW: design/icon-system/grid/svg/system/ -->\n    ' + '\n    '.join(syms) + '\n' + anchor)

# 2. Chips: the 12 drawing, its 16 box centred on the chip's 12 slot.
sub("    function glyphHtml(category, size) {\n",
    "    const PREVIEW_ICONS = new Set(" + json.dumps(CATS) + ");   // ICON PREVIEW\n"
    "    function glyphHtml(category, size) {\n"
    "      if (size === 12 && PREVIEW_ICONS.has(category)) return `<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" style=\"display:block;margin:-2px;overflow:visible\" aria-hidden=\"true\"><use href=\"#n-${category}-12\"/></svg>`;\n")

# 3. Badges: THE-SYSTEM.md rims (24 ring 4/3px, 32 ring 5/3px) on every glyph badge at those sizes;
#    a system drawing fills the badge's own box (18 at 24px, 24 at 32px).
sub("      const rim  = opts.rim || 2;\n",
    "      const gridRim = opts.glyph !== false && (size === 24 || size === 32);   // ICON PREVIEW: THE-SYSTEM.md rims\n"
    "      const rim  = gridRim ? (size === 24 ? 4 / 3 : 5 / 3) : (opts.rim || 2);\n")
sub("      if (opts.glyph !== false) {\n",
    "      if (opts.glyph !== false && PREVIEW_ICONS.has(category) && (size === 24 || size === 32)) {   // ICON PREVIEW\n"
    "        glyph = `<svg class=\"badge-glyph\" x=\"0\" y=\"0\" width=\"${size}\" height=\"${size}\" viewBox=\"0 0 24 24\" style=\"color:${mark}\"><use href=\"#n-${category}-${size === 24 ? 18 : 24}\"/></svg>`;\n"
    "      } else if (opts.glyph !== false) {\n")

# 4. The star: one drawing, bare, at 18 in the row's 18 box and on the tag (18 inside its 20 slot).
#    The drawing is the outline itself, so the old CSS keyline stroke is off (stroke="none" on the path).
sub("'<svg class=\"row-star\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><use href=\"#g-star\"/></svg>'",
    "'<svg class=\"row-star\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><use href=\"#n-star\"/></svg>'")
sub("`<svg class=\"tag-star${loc.starred ? '' : ' is-open'}\" viewBox=\"-1 -1 26 26\" aria-hidden=\"true\"><use href=\"#g-star${loc.starred ? '' : '-open'}\"/></svg>`",
    "`<svg class=\"tag-star${loc.starred ? '' : ' is-open'}\" viewBox=\"0 0 24 24\" style=\"width:18px;height:18px;margin:1px\" aria-hidden=\"true\"><use href=\"#n-star\"/></svg>`")

# 5. The +: its own box (28px), centred in the 60px button.
old_plus = '<svg width="26.4" height="26.4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8182" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>'
new_plus = f'<svg class="n-plus" width="{plus_w:g}" height="{plus_w:g}" viewBox="{plus_vb}" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="{plus_d}"/></svg>'
sub(old_plus, new_plus, 2)   # first paint + setAddBtnGlyph()
sub('</style>', f'    #floatingAddBtn svg.n-plus {{ width: {plus_w:g}px; height: {plus_w:g}px; flex: none; }}   /* ICON PREVIEW */\n  </style>')

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
