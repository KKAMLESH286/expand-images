#!/usr/bin/env python3
"""
Image Aspect Ratio Expander
Expands images from 16:1 to 1.91:1 aspect ratio by adding padding on the sides.
"""

from PIL import Image
import argparse
import os
from pathlib import Path


def expand_image(
    input_path: str,
    output_path: str = None,
    target_ratio: float = 1.91,
    padding_color: str = "black",
    source_ratio: float = 16.0
) -> str:
    """
    Expand an image from source aspect ratio to target aspect ratio.

    Args:
        input_path: Path to the input image
        output_path: Path to save the output image (optional)
        target_ratio: Target aspect ratio (width:height), default 1.91:1
        padding_color: Color for padding ('black' or 'white'), default 'black'
        source_ratio: Source aspect ratio (width:height), default 16:1

    Returns:
        Path to the output image
    """
    # Open the image
    img = Image.open(input_path)
    original_width, original_height = img.size

    print(f"Original image size: {original_width}x{original_height}")
    print(f"Original aspect ratio: {original_width/original_height:.2f}:1")

    # Calculate the new dimensions
    # For 16:1 -> 1.91:1, we need to add padding on left and right
    # The height stays the same, width changes based on target ratio
    new_height = original_height
    new_width = int(new_height * target_ratio)

    print(f"Target aspect ratio: {target_ratio}:1")
    print(f"New image size: {new_width}x{new_height}")

    # Determine padding color
    if padding_color.lower() == "white":
        bg_color = (255, 255, 255)
        if img.mode == "RGBA":
            bg_color = (255, 255, 255, 255)
    else:  # black
        bg_color = (0, 0, 0)
        if img.mode == "RGBA":
            bg_color = (0, 0, 0, 255)

    # Create new image with padding
    new_img = Image.new(img.mode, (new_width, new_height), bg_color)

    # Calculate position to paste the original image (centered)
    x_offset = (new_width - original_width) // 2
    y_offset = 0

    # Paste the original image onto the new background
    new_img.paste(img, (x_offset, y_offset))

    # Generate output path if not provided
    if output_path is None:
        input_file = Path(input_path)
        output_path = str(input_file.parent / f"{input_file.stem}_expanded{input_file.suffix}")

    # Save the new image
    new_img.save(output_path)
    print(f"Saved expanded image to: {output_path}")

    return output_path


def main():
    parser = argparse.ArgumentParser(
        description="Expand images from 16:1 to 1.91:1 aspect ratio with padding"
    )
    parser.add_argument(
        "input",
        help="Input image path"
    )
    parser.add_argument(
        "-o", "--output",
        help="Output image path (default: adds '_expanded' suffix to input filename)",
        default=None
    )
    parser.add_argument(
        "-c", "--color",
        choices=["black", "white"],
        default="black",
        help="Padding color (default: black)"
    )
    parser.add_argument(
        "-t", "--target-ratio",
        type=float,
        default=1.91,
        help="Target aspect ratio width:height (default: 1.91)"
    )
    parser.add_argument(
        "-s", "--source-ratio",
        type=float,
        default=16.0,
        help="Source aspect ratio width:height (default: 16.0)"
    )

    args = parser.parse_args()

    # Check if input file exists
    if not os.path.exists(args.input):
        print(f"Error: Input file '{args.input}' does not exist")
        return 1

    try:
        expand_image(
            args.input,
            args.output,
            args.target_ratio,
            args.color,
            args.source_ratio
        )
        return 0
    except Exception as e:
        print(f"Error: {e}")
        return 1


if __name__ == "__main__":
    exit(main())
