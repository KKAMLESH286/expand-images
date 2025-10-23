#!/usr/bin/env python3
"""
Example script demonstrating the image expansion functionality.
Creates a sample 16:1 image and expands it to 1.91:1.
"""

from PIL import Image, ImageDraw, ImageFont
import os
from expand_image import expand_image


def create_sample_image(filename="sample_16x1.png", width=1600, height=100):
    """
    Create a sample 16:1 aspect ratio image for demonstration.

    Args:
        filename: Output filename for the sample image
        width: Width of the image (default 1600)
        height: Height of the image (default 100)
    """
    # Create a gradient image
    img = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(img)

    # Draw a gradient from blue to green
    for x in range(width):
        r = int(255 * (x / width))
        g = int(100 + 155 * (1 - x / width))
        b = int(200 * (1 - x / width))
        draw.line([(x, 0), (x, height)], fill=(r, g, b))

    # Add some text
    try:
        # Try to add text (may fail if font not available)
        draw.text((width//2 - 100, height//2 - 10),
                 "16:1 Sample Image",
                 fill=(255, 255, 255))
    except:
        pass

    # Add border
    draw.rectangle([(0, 0), (width-1, height-1)], outline=(255, 255, 255), width=2)

    img.save(filename)
    print(f"Created sample image: {filename} ({width}x{height}, {width/height:.1f}:1)")
    return filename


def main():
    print("Image Expansion Example")
    print("=" * 50)
    print()

    # Create a sample 16:1 image
    print("Step 1: Creating a sample 16:1 image...")
    sample_file = create_sample_image()
    print()

    # Expand with black padding
    print("Step 2: Expanding to 1.91:1 with BLACK padding...")
    output_black = expand_image(sample_file, "sample_expanded_black.png",
                                target_ratio=1.91, padding_color="black")
    print()

    # Expand with white padding
    print("Step 3: Expanding to 1.91:1 with WHITE padding...")
    output_white = expand_image(sample_file, "sample_expanded_white.png",
                                target_ratio=1.91, padding_color="white")
    print()

    print("=" * 50)
    print("Example completed successfully!")
    print()
    print("Generated files:")
    print(f"  - {sample_file} (original 16:1)")
    print(f"  - {output_black} (expanded with black padding)")
    print(f"  - {output_white} (expanded with white padding)")
    print()
    print("You can now view these images to see the expansion effect.")


if __name__ == "__main__":
    main()
