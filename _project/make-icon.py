# /// script
# dependencies = ["pillow"]
# ///
"""Budgeting Camp browser icon: orange A-frame tent.

Outputs:
  public/icon.png             512x512 (PWA / general)
  public/apple-touch-icon.png 180x180 on warm background
  public/favicon.ico          48/32/16 multi-size
"""
from PIL import Image, ImageDraw

HI = 512

ORANGE   = (235, 120, 35, 255)
ORANGE_D = (180, 82, 20, 255)
DOOR     = (120, 60, 20, 255)
POLE     = (110, 74, 40, 255)
SHADOW   = (0, 0, 0, 40)
APPLE_BG = (245, 234, 210, 255)   # warm parchment


def draw_tent() -> Image.Image:
    img = Image.new("RGBA", (HI, HI), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    # ground shadow
    d.ellipse([30, 420, 482, 480], fill=SHADOW)

    # crossed pole tips above the apex
    d.line([(206, 30), (276, 130)], fill=POLE, width=20)
    d.line([(306, 30), (236, 130)], fill=POLE, width=20)

    # tent body
    d.polygon([(256, 64), (28, 448), (484, 448)],
              fill=ORANGE, outline=ORANGE_D)
    d.line([(256, 64), (28, 448)], fill=ORANGE_D, width=18)
    d.line([(256, 64), (484, 448)], fill=ORANGE_D, width=18)
    d.line([(28, 448), (484, 448)], fill=ORANGE_D, width=18)

    # door
    d.polygon([(256, 170), (186, 448), (326, 448)], fill=DOOR)
    d.line([(256, 170), (256, 448)], fill=ORANGE_D, width=10)

    return img


def main():
    tent = draw_tent()

    tent.save("public/icon.png")

    apple = Image.new("RGBA", (HI, HI), APPLE_BG)
    apple.alpha_composite(tent)
    apple.resize((180, 180), Image.LANCZOS).convert("RGB").save("public/apple-touch-icon.png")

    tent.save("public/favicon.ico", sizes=[(48, 48), (32, 32), (16, 16)])

    print("wrote icon.png, apple-touch-icon.png, favicon.ico")


if __name__ == "__main__":
    main()
