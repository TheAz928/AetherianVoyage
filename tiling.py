import os
import sys
import math
from PIL import Image

Image.MAX_IMAGE_PIXELS = None

TILE_SIZE = 256
OVERLAP = 1
TILE_FORMAT = "png"


def compute_levels(width, height):
    max_dim = max(width, height)
    return math.ceil(math.log2(max_dim)) if max_dim > 1 else 0


def save_tile(tile, level_dir, col, row):
    os.makedirs(level_dir, exist_ok=True)
    tile_path = os.path.join(level_dir, f"{col}_{row}.{TILE_FORMAT}")
    tile.save(tile_path, TILE_FORMAT.upper(), quality=90)


def generate_tiles(image, output_dir):
    width, height = image.size
    max_level = compute_levels(width, height)

    for level in range(max_level + 1):
        scale = 2 ** (max_level - level)
        level_width = math.ceil(width / scale)
        level_height = math.ceil(height / scale)
        level_img = image.resize((level_width, level_height), Image.LANCZOS)

        cols = math.ceil(level_width / TILE_SIZE)
        rows = math.ceil(level_height / TILE_SIZE)

        level_dir = os.path.join(output_dir, str(level))
        for row in range(rows):
            for col in range(cols):
                left = col * TILE_SIZE
                upper = row * TILE_SIZE
                right = min(left + TILE_SIZE + OVERLAP, level_width)
                lower = min(upper + TILE_SIZE + OVERLAP, level_height)

                tile = level_img.crop((left, upper, right, lower))
                save_tile(tile, level_dir, col, row)

        print(f"  Level {level} → {cols * rows} tiles")


def generate_dzi(image_path, output_dir, url=None):
    img = Image.open(image_path)
    width, height = img.size
    image_name = os.path.splitext(os.path.basename(image_path))[0]

    dzi_path = os.path.join(output_dir, f"{image_name}.dzi")
    with open(dzi_path, "w", encoding="utf-8") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        f.write(
            f'<Image TileSize="{TILE_SIZE}" Overlap="{OVERLAP}" Format="{TILE_FORMAT}" '
            f'xmlns="http://schemas.microsoft.com/deepzoom/2008"'
        )
        if url:
            url = url if url.endswith("/") else url + "/"
            f.write(f' Url="{url}{image_name}/"')
        f.write(">\n")
        f.write(f'  <Size Width="{width}" Height="{height}"/>\n')
        f.write("</Image>\n")
    print(f"  Wrote {dzi_path}")


def process_image(image_path, base_output, url=None):
    image_name = os.path.splitext(os.path.basename(image_path))[0]
    image_output_dir = os.path.join(base_output, image_name)
    os.makedirs(image_output_dir, exist_ok=True)

    print(f"Processing {image_name} ...")
    img = Image.open(image_path)

    generate_tiles(img, image_output_dir)
    generate_dzi(image_path, base_output, url)


def main():
    if len(sys.argv) < 3:
        print("Usage: python generate_dzi.py <input_dir> <output_dir> [url]")
        sys.exit(1)

    input_dir = sys.argv[1]
    base_output = sys.argv[2]
    url = sys.argv[3] if len(sys.argv) > 3 else None

    os.makedirs(base_output, exist_ok=True)

    for file in os.listdir(input_dir):
        if file.lower().endswith((".jpg", ".jpeg", ".png", ".tif", ".tiff")):
            process_image(os.path.join(input_dir, file), base_output, url)


if __name__ == "__main__":
    main()