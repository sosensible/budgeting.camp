# /// script
# dependencies = ["pillow"]
# ///
"""Generate the hiker sprite sheet: 8 directions x 4 walk frames.

Top-down view. The character (backpack + hiking staff) is drawn once facing
north at 4x resolution for each walk phase, then rotated in 45-degree steps.
Sheet layout: rows = directions (N, NE, E, SE, S, SW, W, NW), cols = frames.
Cell size 64px -> sheet 256x512.
"""
import math
from PIL import Image, ImageDraw, ImageFilter

HI = 256          # hi-res draw size
CELL = 64         # final cell size
FRAMES = 4
DIRS = 8
C = HI / 2        # center

SKIN    = (232, 190, 150, 255)
HAIR    = (84, 56, 36, 255)
JACKET  = (170, 62, 48, 255)
JACKET_D = (130, 44, 34, 255)
PACK    = (146, 100, 56, 255)
PACK_D  = (110, 74, 40, 255)
BOOT    = (62, 44, 32, 255)
STAFF   = (118, 80, 40, 255)
SHADOW  = (0, 0, 0, 55)


def ellipse(d, cx, cy, w, h, fill, outline=None, ow=0):
    d.ellipse([cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2],
              fill=fill, outline=outline, width=ow)


def draw_frame(phase: float, halo: bool = True) -> Image.Image:
    """Character facing up (north). phase in [0,1) walk cycle."""
    img = Image.new("RGBA", (HI, HI), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    f = math.sin(2 * math.pi * phase)   # -1..1 stride

    # boots: left forward when f>0
    ellipse(d, C - 22, C - f * 36, 26, 36, BOOT)
    ellipse(d, C + 22, C + f * 36, 26, 36, BOOT)

    # hiking staff in right hand, slides with the right arm swing
    swing = f * 18
    sx = C + 60
    d.line([(sx, C + 52 + swing), (sx, C - 78 + swing)], fill=STAFF, width=11)
    ellipse(d, sx, C - 78 + swing, 18, 18, PACK_D)  # knob

    # torso / jacket shoulders
    ellipse(d, C, C, 112, 74, JACKET, JACKET_D, 5)

    # arms (sleeve + hand), opposite phase to same-side foot
    ellipse(d, C - 56, C + f * 20, 26, 26, JACKET, JACKET_D, 3)
    ellipse(d, C + 60, C + swing, 26, 26, SKIN, JACKET_D, 3)  # staff hand

    # backpack on the back (south side when facing north)
    d.rounded_rectangle([C - 40, C + 18, C + 40, C + 66], radius=16,
                        fill=PACK, outline=PACK_D, width=5)
    d.line([(C - 22, C + 18), (C - 22, C + 66)], fill=PACK_D, width=6)
    d.line([(C + 22, C + 18), (C + 22, C + 66)], fill=PACK_D, width=6)
    # bedroll across the top of the pack
    d.rounded_rectangle([C - 46, C + 56, C + 46, C + 74], radius=9,
                        fill=(96, 116, 84, 255), outline=(70, 88, 60, 255), width=4)

    # head: hair with a sliver of face showing at the front
    ellipse(d, C, C - 12, 58, 58, SKIN)
    ellipse(d, C, C - 8, 56, 52, HAIR)

    base = Image.new("RGBA", (HI, HI), (0, 0, 0, 0))
    d2 = ImageDraw.Draw(base)
    ellipse(d2, C, C + 6, 120, 120, SHADOW)        # ground shadow

    if halo:
        # visibility halo: white glow from the character silhouette,
        # layered under the art together with the ground shadow
        halo_alpha = img.getchannel("A").point(lambda a: 255 if a > 40 else 0)
        halo_alpha = halo_alpha.filter(ImageFilter.GaussianBlur(14))
        halo_alpha = halo_alpha.point(lambda a: min(255, int(a * 1.8)))
        glow = Image.new("RGBA", (HI, HI), (255, 255, 255, 0))
        glow.putalpha(halo_alpha)
        base.alpha_composite(glow)

    base.alpha_composite(img)
    return base


def make_sheet(halo: bool) -> Image.Image:
    sheet = Image.new("RGBA", (CELL * FRAMES, CELL * DIRS), (0, 0, 0, 0))
    frames = [draw_frame(p / FRAMES, halo) for p in range(FRAMES)]
    for row in range(DIRS):                       # 0=N, clockwise
        for col, frame in enumerate(frames):
            cell = frame.rotate(-45 * row, resample=Image.BICUBIC)
            cell = cell.resize((CELL, CELL), Image.LANCZOS)
            sheet.paste(cell, (col * CELL, row * CELL))
    return sheet


def main():
    for out, halo in [("public/sprites/hiker.png", True),
                      ("public/sprites/hiker-plain.png", False)]:
        sheet = make_sheet(halo)
        sheet.save(out)
        print(f"wrote {out} {sheet.size}")


if __name__ == "__main__":
    main()
