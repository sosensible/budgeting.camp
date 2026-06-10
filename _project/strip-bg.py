# /// script
# dependencies = ["pillow"]
# ///
"""Strip baked-in checkerboard/white backgrounds from alpha-2 building art.

Flood-fills from the image border: any near-neutral bright pixel (the fake
checkerboard grays / white) connected to the edge becomes transparent.
Warm-tinted art pixels (tents, wood) are left alone.
"""
import sys
from collections import deque
from PIL import Image

def strip(src: str, dst: str, max_chan_diff=18, min_bright=168):
    im = Image.open(src).convert("RGBA")
    w, h = im.size
    px = im.load()

    def is_bg(x, y):
        r, g, b, _ = px[x, y]
        return (max(r, g, b) - min(r, g, b)) <= max_chan_diff and min(r, g, b) >= min_bright

    seen = [[False] * w for _ in range(h)]
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if is_bg(x, y) and not seen[y][x]:
                seen[y][x] = True
                q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if is_bg(x, y) and not seen[y][x]:
                seen[y][x] = True
                q.append((x, y))

    while q:
        x, y = q.popleft()
        px[x, y] = (0, 0, 0, 0)
        for nx, ny in ((x+1, y), (x-1, y), (x, y+1), (x, y-1)):
            if 0 <= nx < w and 0 <= ny < h and not seen[ny][nx] and is_bg(nx, ny):
                seen[ny][nx] = True
                q.append((nx, ny))

    # soften the cutout edge: average alpha with 4-neighbours once
    alpha = im.getchannel("A").load()
    out = im.copy()
    opx = out.load()
    for y in range(h):
        for x in range(w):
            if alpha[x, y] == 255:
                n = [alpha[nx, ny] for nx, ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1))
                     if 0 <= nx < w and 0 <= ny < h]
                if n and min(n) == 0:
                    r, g, b, _ = px[x, y]
                    opx[x, y] = (r, g, b, 140)

    # crop to content and save
    bbox = out.getbbox()
    out = out.crop(bbox)
    out.save(dst)
    print(f"{src} -> {dst} {out.size}")

if __name__ == "__main__":
    strip(sys.argv[1], sys.argv[2])
