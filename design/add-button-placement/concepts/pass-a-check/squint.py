# V2 squint weight vs the account badge. Each frame is the real app at 390x844 @1x (Reykjavik, real pins) with one candidate
# disc drawn bottom-left. Weight = sum over a window of the blurred colour distance (CIE Lab dE76) from the frame without the disc
# (v2-0.png), i.e. how much the object adds to the page once squinted (gaussian sigma 4 and 8 px). Account measured the same way
# against a frame where it is painted out with the local map colour.
import json, numpy as np
from PIL import Image, ImageFilter
def lab(img):
    a = np.asarray(img.convert('RGB')).astype(float) / 255
    a = np.where(a > 0.04045, ((a + 0.055) / 1.055) ** 2.4, a / 12.92)
    M = np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]])
    xyz = a @ M.T / np.array([0.95047, 1, 1.08883])
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)
def weight(img, base, box, s):
    A = lab(img.filter(ImageFilter.GaussianBlur(s))); B = lab(base.filter(ImageFilter.GaussianBlur(s)))
    x0, y0, x1, y1 = [int(v) for v in box]; m = 3 * s
    dE = np.sqrt(((A - B) ** 2).sum(-1))[max(0, y0 - m):y1 + m, max(0, x0 - m):x1 + m]
    return float(dE.sum()), float(dE.max())
if __name__ == '__main__':
    base = Image.open('frames/v2-0.png'); p = json.load(open('probe.json'))
    ac = p['acct844']
    # account painted out: fill its box with the median colour of a ring just outside it
    arr = np.asarray(base.convert('RGB')).copy(); x0, y0, x1, y1 = ac
    ring = np.concatenate([arr[y1 + 4:y1 + 10, x0:x1].reshape(-1, 3), arr[y0:y1, x0 - 10:x0 - 4].reshape(-1, 3)])
    arr[y0 - 2:y1 + 4, x0 - 2:x1 + 2] = np.median(ring, 0); noacct = Image.fromarray(arr)
    out = {}
    for s in (4, 8):
        out[f'account_s{s}'] = weight(base, noacct, ac, s)
        for D in (32, 40, 44, 48, 52, 56, 60):
            out[f'V2-{D}_s{s}'] = weight(Image.open(f'frames/v2-{D}.png'), base, p[f'v2box{D}'], s)
    json.dump(out, open('squint.json', 'w'), indent=1)
    for s in (4, 8):
        A = out[f'account_s{s}'][0]
        print(f'sigma {s}: account mass {A:.0f} peak {out[f"account_s{s}"][1]:.1f}')
        for D in (32, 40, 44, 48, 52, 56, 60):
            m, pk = out[f'V2-{D}_s{s}']; print(f'  V2 {D}px: mass {m:.0f} = {m / A:.2f}x account, peak {pk:.1f}')
