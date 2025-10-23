# expand-images

A simple Python program to expand images from 16:1 to 1.91:1 aspect ratio by adding black or white padding on the left and right sides.

## Features

- Converts images from 16:1 to 1.91:1 aspect ratio
- Supports black or white padding colors
- Centers the original image in the expanded canvas
- Preserves image quality
- Supports various image formats (PNG, JPG, etc.)
- Customizable source and target aspect ratios

## Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd expand-images
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### Basic Usage

Expand an image with black padding (default):
```bash
python expand_image.py input.png
```

This will create `input_expanded.png` in the same directory.

### Specify Output Path

```bash
python expand_image.py input.png -o output.png
```

### Use White Padding

```bash
python expand_image.py input.png -c white
```

### Custom Aspect Ratios

```bash
python expand_image.py input.png -s 16.0 -t 1.91
```

### All Options

```bash
python expand_image.py input.png \
  -o output.png \
  -c black \
  -t 1.91 \
  -s 16.0
```

## Command Line Arguments

- `input` - Input image path (required)
- `-o, --output` - Output image path (default: adds '_expanded' suffix)
- `-c, --color` - Padding color: 'black' or 'white' (default: black)
- `-t, --target-ratio` - Target aspect ratio width:height (default: 1.91)
- `-s, --source-ratio` - Source aspect ratio width:height (default: 16.0)

## Examples

### Example 1: Basic black padding
```bash
python expand_image.py my_16x1_image.png
# Output: my_16x1_image_expanded.png (with black bars)
```

### Example 2: White padding with custom output
```bash
python expand_image.py banner.jpg -o banner_wide.jpg -c white
# Output: banner_wide.jpg (with white bars)
```

### Example 3: Custom aspect ratios
```bash
python expand_image.py photo.png -s 16.0 -t 2.0 -c white
# Converts from 16:1 to 2:1 with white padding
```

## How It Works

The program:
1. Loads the input image
2. Calculates the new dimensions based on the target aspect ratio
3. Creates a new canvas with the padding color
4. Centers and pastes the original image onto the new canvas
5. Saves the result

For a 16:1 to 1.91:1 conversion:
- Height remains the same
- Width is calculated as: `new_width = height × 1.91`
- Original image is centered horizontally
- Padding fills the left and right sides

## Requirements

- Python 3.6+
- Pillow (PIL Fork)

## License

MIT License
