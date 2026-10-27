# BACK TO THE DRAWINGS: a quick look sheet (rows enlarged, nearest neighbour, before above after) for checking by eye.
#   python3 -I src/back-look.py <raw dir> <dpr> <scale> <out.png> [rows...]
import sys
from PIL import Image
raw, dpr, sc, out = sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4]
rows = sys.argv[5:] or ['24', '18', '12', 'button']
ims = []
for r in rows:
    for s in ['before', 'after']:
        im = Image.open(f'{raw}/{s}-{r}-{dpr}x.png').convert('RGB')
        ims.append(im.resize((im.width * sc, im.height * sc), Image.NEAREST))
W = max(i.width for i in ims); H = sum(i.height + 12 for i in ims)
sheet = Image.new('RGB', (W, H), (255, 255, 255)); y = 0
for i in ims:
    sheet.paste(i, (0, y)); y += i.height + 12
sheet.save(out)
