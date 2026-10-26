"""8x close-up overlay for the mix prototype: navy both, orange approved only, blue mix only.
python3 -I src/mix-crop.py <name> x0 y0 x1 y1 <out.png>   (units of the 24 box)"""
import importlib.util, os, sys
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(__file__))
spec = importlib.util.spec_from_file_location('s', os.path.join(os.path.dirname(__file__), 'mix-sheet.py'))
S = importlib.util.module_from_spec(spec); spec.loader.exec_module(S)
from castlib import G, raster_path
allr = {**S.M.six(), **S.M.new()}
k = sys.argv[1]; x0, y0, x1, y1 = map(float, sys.argv[2:6])
m = S.load(k)
a = raster_path(allr[k]['approved']) if allr[k].get('approved') else m
im = np.full(a.shape + (3,), 250, np.uint8); im[a & m] = (18, 41, 63); im[a & ~m] = (238, 116, 52); im[m & ~a] = (60, 140, 220)
Image.fromarray(im[int(y0 * G):int(y1 * G), int(x0 * G):int(x1 * G)]).save(sys.argv[6])
