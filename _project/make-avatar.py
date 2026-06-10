# /// script
# dependencies = ["pillow"]
# ///
"""Front-facing bust portrait of the hiker for the HUD avatar.

Matches the sprite palette: red jacket, brown hair, tan skin, brown pack straps.
Rendered at 4x and downscaled to 128px with a transparent circular mask.
"""
from PIL import Image, ImageDraw

HI = 512
OUT = 128
C = HI / 2

SKIN    = (232, 190, 150, 255)
SKIN_D  = (205, 160, 120, 255)
HAIR    = (84, 56, 36, 255)
JACKET  = (170, 62, 48, 255)
JACKET_D = (130, 44, 34, 255)
STRAP   = (110, 74, 40, 255)
BG_TOP  = (122, 162, 86, 255)   # camp-green backdrop
RING    = (242, 234, 212, 255)  # parchment ring


def main():
    img = Image.new("RGBA", (HI, HI), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    # backdrop disc
    d.ellipse([8, 8, HI - 8, HI - 8], fill=BG_TOP)

    # shoulders / jacket
    d.rounded_rectangle([C - 170, 330, C + 170, HI + 80], radius=110,
                        fill=JACKET, outline=JACKET_D, width=10)
    # collar
    d.polygon([(C - 60, 345), (C, 415), (C + 60, 345)], fill=SKIN_D)
    # pack straps
    d.line([(C - 110, 370), (C - 60, HI)], fill=STRAP, width=34)
    d.line([(C + 110, 370), (C + 60, HI)], fill=STRAP, width=34)

    # neck + head
    d.rectangle([C - 42, 290, C + 42, 360], fill=SKIN_D)
    d.ellipse([C - 105, 110, C + 105, 350], fill=SKIN)

    # hair: rounded top + sides
    d.pieslice([C - 112, 95, C + 112, 320], start=180, end=360, fill=HAIR)
    d.rectangle([C - 112, 200, C - 78, 250], fill=HAIR)
    d.rectangle([C + 78, 200, C + 112, 250], fill=HAIR)

    # face: eyes, brows, smile
    d.ellipse([C - 52, 232, C - 28, 258], fill=(60, 42, 30, 255))
    d.ellipse([C + 28, 232, C + 52, 258], fill=(60, 42, 30, 255))
    d.arc([C - 38, 280, C + 38, 330], start=15, end=165, fill=(150, 100, 70, 255), width=10)

    # circular mask + ring
    mask = Image.new("L", (HI, HI), 0)
    ImageDraw.Draw(mask).ellipse([0, 0, HI, HI], fill=255)
    img.putalpha(mask)
    d = ImageDraw.Draw(img)
    d.ellipse([4, 4, HI - 4, HI - 4], outline=RING, width=14)

    img = img.resize((OUT, OUT), Image.LANCZOS)
    out = "public/scenario/alpha-3/avatar.png"
    img.save(out)
    print(f"wrote {out} {img.size}")


if __name__ == "__main__":
    main()
