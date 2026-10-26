"""Debug: show castB's stages for one icon (roots navy, the inside fill orange, removed by the outside round blue).
python3 -I src/castB-stages.py <icon> <out.png>"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np, importlib.util
from PIL import Image
from castlib import N, G, raster_path
spec = importlib.util.spec_from_file_location('castB', os.path.join(os.path.dirname(__file__), 'castB.py'))
B = importlib.util.module_from_spec(spec); spec.loader.exec_module(B)
v = {**B.six_roots(), **B.new_roots()}[sys.argv[1]]
J = np.zeros((N, N), bool)
for d in v['ink']: J |= raster_path(d)
for d in v['holes']: J &= ~raster_path(d)
from skimage import measure
lab = measure.label(J, connectivity=1)
big = np.argmax(np.bincount(lab.ravel())[1:]) + 1
C = lab == big
y0, y1, x0, x1 = B.crop_box(C, int(2.5 * G))
res = B.cast_component(C[y0:y1, x0:x1])
c, f = B.DEBUG['C'], B.DEBUG['filled']
im = np.full(c.shape + (3,), 250, np.uint8)
im[c & res] = (18, 41, 63); im[f & ~c & res] = (238, 116, 52); im[f & ~res] = (60, 140, 220)
Image.fromarray(im).save(sys.argv[2])
for a in sys.argv[3:]:
    x, y = map(float, a.split(','))
    print(a, 'rout', round(float(B.DEBUG['rout'][int(y * G) - y0, int(x * G) - x0]), 3))
print('fill px2', round((f & ~c).sum() / G / G, 2), 'removed', round((f & ~res).sum() / G / G, 2), 'rin max', float(B.DEBUG['rin'].max()))
