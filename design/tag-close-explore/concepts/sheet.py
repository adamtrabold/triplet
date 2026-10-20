# Contact sheet for the tag-close concepts: python3 sheet.py  (reads raw/ and crops/, writes concepts.png
# and one phone-width sheet per concept, concept-<key>.png)
import os
from PIL import Image, ImageDraw, ImageFont
D = os.path.dirname(os.path.abspath(__file__))
F = '/usr/share/fonts/truetype/dejavu/'
font = lambda s, b=False: ImageFont.truetype(F + ('DejaVuSans-Bold.ttf' if b else 'DejaVuSans.ttf'), s)
INK, INK2, PAPER = (26, 26, 24), (90, 86, 76), (250, 245, 234)

CONCEPTS = [
    ('pin', 'A. The pin is the close (reference)',
     "Last round's favourite, one colour: while the tag is open, the pin it hangs from turns into a navy x. Tap it to close.", None),
    ('fold', 'B. Dog-ear',
     "The tag's top-right corner is folded over, not cut. Tap the fold to close. On a starred tag the fold is the paper's cream back lying over the orange band, so the band and the close agree.", None),
    ('reel', 'C. Badge reel',
     "No mark. Pull the tag down and let go: it zips back up into the pin, like an ID badge reel. A short pull springs back.",
     ['Finger on the tag', 'Pull down', 'Let go: it reels in', 'Closed']),
    ('untie', 'D. Untie the bow',
     "The string is tied through the eyelet in a small bow. Tap the bow: it pulls loose and the tag drops off its string.",
     ['Tied', 'Tap: the bow pulls loose', 'The tag drops', 'Closed']),
]
STATES = [('1-plain', 'Plain pin'), ('2-starred', 'Starred'), ('3-visited', 'Visited'), ('4-stop', 'Plan stop'), ('5-district', 'District')]
SW, MAPH = 420, 560   # still width; the stills show the map (where the tag hangs), cut above the list
SH = round(MAPH * SW / 390)
CW = 240              # 3x crops, 80 CSS px

def still(name):
    im = Image.open(os.path.join(D, 'raw', name + '.png'))
    return im.crop((0, 0, 1170, MAPH * 3)).resize((SW, SH), Image.LANCZOS)

def block(key, title, line, film, cols=5, gap=16):
    w = cols * SW + (cols - 1) * gap
    parts = []
    def text_img(t, f, color, width):
        words, lines, cur = t.split(), [], ''
        dd = ImageDraw.Draw(Image.new('RGB', (1, 1)))
        for wd in words:
            tr = (cur + ' ' + wd).strip()
            if dd.textlength(tr, font=f) > width: lines.append(cur); cur = wd
            else: cur = tr
        lines.append(cur)
        lh = int(f.size * 1.35)
        im = Image.new('RGB', (width, lh * len(lines) + 6), PAPER); d = ImageDraw.Draw(im)
        for i, l in enumerate(lines): d.text((0, i * lh), l, font=f, fill=color)
        return im
    parts.append(text_img(title, font(40, True), INK, w))
    parts.append(text_img(line, font(28), INK2, w))
    def row(names, labels, size, cw=None):
        cw = cw or SW
        n = len(names)
        im = Image.new('RGB', (w, size[1] + 44), PAPER); d = ImageDraw.Draw(im)
        for i, (nm, lb) in enumerate(zip(names, labels)):
            x = i * ((w - cw) // max(1, cols - 1)) if cw == SW else i * (cw + 24)
            d.text((x, 0), lb, font=font(24, True), fill=INK2)
            p = os.path.join(D, 'crops', nm + '.png')
            pic = still(nm) if size[1] == SH else Image.open(p)
            im.paste(pic, (x, 36))
        return im
    parts.append(row([f'{key}-{s}' for s, _ in STATES], [l for _, l in STATES], (SW, SH)))
    if film:
        parts.append(row([f'{key}-f{i}' for i in range(1, 5)], [f'{i}. {t}' for i, t in enumerate(film, 1)], (SW, SH)))
    parts.append(text_img('The close at 3x' if key != 'reel' else 'At 3x: nothing on the tag or the pin', font(26, True), INK, w))
    names = [f'{key}-{s}' for s, _ in STATES] + ([f'{key}-f{i}' for i in (2, 3)] if key == 'untie' else [])
    labels = [l for _, l in STATES] + (['Loose', 'Drop'] if key == 'untie' else [])
    parts.append(row(names, labels, (CW, CW), CW))
    H = sum(p.height for p in parts) + 20 * len(parts)
    im = Image.new('RGB', (w, H), PAPER); y = 0
    for p in parts: im.paste(p, (0, y)); y += p.height + 20
    return im

blocks = [block(*c) for c in CONCEPTS]
for c, b in zip(CONCEPTS, blocks):
    pad = 40; out = Image.new('RGB', (b.width + 2 * pad, b.height + 2 * pad), PAPER); out.paste(b, (pad, pad))
    out.save(os.path.join(D, f'concept-{c[0]}.png'))
pad = 48
head = Image.new('RGB', (blocks[0].width, 150), PAPER); d = ImageDraw.Draw(head)
d.text((0, 0), 'Closing the place tag: four different ways', font=font(52, True), fill=INK)
d.text((0, 76), 'Each on a plain pin, a starred tag, a visited pin, a plan stop and a district (390 wide, real map). Esc and a keyboard close stay in all four.', font=font(26), fill=INK2)
H = head.height + sum(b.height for b in blocks) + 90 * len(blocks) + 2 * pad
out = Image.new('RGB', (blocks[0].width + 2 * pad, H), PAPER); out.paste(head, (pad, pad)); y = pad + head.height + 30
for b in blocks:
    ImageDraw.Draw(out).line((pad, y - 30, out.width - pad, y - 30), fill=(216, 206, 186), width=3)
    out.paste(b, (pad, y)); y += b.height + 90
out.save(os.path.join(D, 'concepts.png'), optimize=True)
print(out.size)
