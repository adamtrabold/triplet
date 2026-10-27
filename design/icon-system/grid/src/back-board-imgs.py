# THE GRID: the board's true-size images: each raw row (one device pixel per pixel) enlarged by a whole factor, nearest
# neighbour, so every device pixel is a clean block. 3x rows by 2, 2x rows by 3: both shown at the same size.
#   python3 -I src/back-board-imgs.py <raw dir> <out dir>
import sys, os
from PIL import Image
raw, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
for row, dpr, f in [('24', 3, 2), ('24', 2, 3), ('18', 3, 2), ('18', 2, 3), ('12', 3, 2), ('12', 2, 3), ('button', 3, 1)]:
    for s in ['before', 'after']:
        im = Image.open(f'{raw}/{s}-{row}-{dpr}x.png').convert('RGB')
        im.resize((im.width * f, im.height * f), Image.NEAREST).save(f'{out}/{s}-{row}-{dpr}x.png')
