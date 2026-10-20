# Every closing pin side by side, at 1x (true phone size), on the same map spot (Sundhöllin, plain pin).
# 4 across x 2 rows, ~phone width, so on a phone it shows close to real size. Writes strip-1x.png.
import json, os
from PIL import Image, ImageDraw, ImageFont
D = os.path.dirname(os.path.abspath(__file__))
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 10)
pts = json.load(open(D + '/raw/points.json'))
ITEMS = [('pin', 'Navy (first)'), ('pin-odisc', 'Orange disc'), ('pin-nox+pin-nostar', 'Navy, orange x'), ('pin-onx+pin-nostar', 'Orange, navy x'),
         ('pin-lsmall+pin-nostar', 'A. Small orange'), ('pin-lpaper+pin-nostar', 'B. Paper, orange x'), ('pin-lwash+pin-nostar', 'C. Orange wash'), ('pin-lglyph+pin-nostar', 'D. Orange x only'),
         ('pin-lw16+pin-nostar', 'Wash 16%'), ('pin-lw10+pin-nostar', 'Wash 10%')]
C, G, LH = 100, 8, 16
out = Image.new('RGB', (4 * C + 5 * G, 3 * (C + LH) + 4 * G), (250, 245, 234)); d = ImageDraw.Draw(out)
for i, (k, lb) in enumerate(ITEMS):
    p = pts[k + '-1-plain']; im = Image.open(f'{D}/raw/{k}-1-plain.png')
    x, y, h = round(p['x'] * 3), round((p['y'] - 22) * 3), C * 3 // 2
    tile = im.crop((x - h, y - h, x + h, y + h)).resize((C, C), Image.LANCZOS)
    ox, oy = G + (i % 4) * (C + G), G + (i // 4) * (C + LH + G)
    d.text((ox, oy), lb, font=F, fill=(90, 86, 76)); out.paste(tile, (ox, oy + LH))
out.save(D + '/strip-1x.png')
out.resize((out.width * 3, out.height * 3), Image.LANCZOS).save('/tmp/claude-0/-home-user-triplet/059e9216-ffb6-56b1-9102-5c38b9dc3fec/scratchpad/strip3.png')
print(out.size)
