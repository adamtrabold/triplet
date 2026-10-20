import sys
from PIL import Image
d = sys.argv[1]
for n in ['cafe', 'bar', 'museum', 'nature', 'star', 'plus', 'ref0', 'ref1', 'ref2', 'ref3']:
    im = Image.open(f'{d}/{n}.png').convert('L'); w, h = im.size; px = im.load()
    vals = []
    for y in range(h):
        for x in range(w):
            if (x - w / 2) ** 2 + (y - h / 2) ** 2 <= (w * 16 / 48) ** 2:   # the Ø16 live circle at 4x
                vals.append(1 - px[x, y] / 255)
    vals.sort()
    peak = vals[int(len(vals) * 0.98)]
    mean = sum(vals) / len(vals)
    top = vals[int(len(vals) * 0.8):]; core = sum(top) / len(top)
    print(f'{n:8s} mean {mean*100:5.1f}  core(top20%) {core*100:5.1f}  peak98 {peak*100:5.1f}')
