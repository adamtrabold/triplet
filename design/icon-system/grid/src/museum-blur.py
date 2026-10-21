import sys, json
from PIL import Image
d = sys.argv[1]
names = json.load(open(d + '/names.json'))
for i, n in enumerate(names):
    im = Image.open(f'{d}/g{i}.png').convert('L'); w, h = im.size; px = im.load()
    vals = [1 - px[x, y] / 255 for y in range(h) for x in range(w) if (x - w / 2) ** 2 + (y - h / 2) ** 2 <= (w * 16 / 48) ** 2]
    vals.sort(); mean = sum(vals) / len(vals); top = vals[int(len(vals) * 0.8):]
    print(f'{n:22s} mean {mean*100:5.1f}  core(top20%) {sum(top)/len(top)*100:5.1f}')
