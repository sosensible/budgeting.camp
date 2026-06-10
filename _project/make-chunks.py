# /// script
# dependencies = ["pillow"]
# ///
"""Background chunks for the alpha-4 large-map spike.

Builds a 3x3 grid of 1920x1440 chunks (world 5760x4320) by mirror-tiling the
alpha-2 main background: chunk (r, c) is flipped horizontally when c is odd
and vertically when r is odd, so every shared edge is pixel-continuous —
no seams, no blending needed.
"""
from PIL import Image
import os

CHUNK_W, CHUNK_H = 1920, 1440
COLS, ROWS = 3, 3
SRC = "scenario/alpha-2/main-background.jpg"
OUT = "public/scenario/alpha-4/bg"


def main():
    os.makedirs(OUT, exist_ok=True)
    base = Image.open(SRC).convert("RGB").resize((CHUNK_W, CHUNK_H), Image.LANCZOS)
    for r in range(ROWS):
        for c in range(COLS):
            chunk = base
            if c % 2: chunk = chunk.transpose(Image.FLIP_LEFT_RIGHT)
            if r % 2: chunk = chunk.transpose(Image.FLIP_TOP_BOTTOM)
            path = f"{OUT}/r{r}c{c}.jpg"
            chunk.save(path, quality=82)
            print("wrote", path)


if __name__ == "__main__":
    main()
