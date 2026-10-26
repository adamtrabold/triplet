"""Overlay approved vs B at the grid's resolution: navy both, orange approved only, blue B only.
python3 -I src/castB-overlay.py <name> <out.png>"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np
from PIL import Image
from castlib import N, G, raster_path
import importlib.util
spec = importlib.util.spec_from_file_location('castB', os.path.join(os.path.dirname(__file__), 'castB.py'))
B = importlib.util.module_from_spec(spec); spec.loader.exec_module(B)
k = sys.argv[1]; allr = {**B.six_roots(), **B.new_roots()}
a = raster_path(allr[k]['approved'])
b = np.unpackbits(np.load(os.path.join(B.HERE, f'svg/castB/{k}.npy')))[:N * N].reshape(N, N).astype(bool)
im = np.full((N, N, 3), 250, np.uint8)
im[a & b] = (18, 41, 63); im[a & ~b] = (238, 116, 52); im[b & ~a] = (60, 140, 220)
ys, xs = np.where(a | b); y0, y1, x0, x1 = ys.min() - 20, ys.max() + 20, xs.min() - 20, xs.max() + 20
Image.fromarray(im[y0:y1, x0:x1]).save(sys.argv[2])
print(k, 'approved only', round((a & ~b).sum() / G / G, 2), 'px2; B only', round((b & ~a).sum() / G / G, 2), 'px2')
