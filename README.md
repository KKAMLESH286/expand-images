# expand-images

A TypeScript program to expand images from 16:1 to 1.91:1 aspect ratio with intelligent edge-aware padding.

## Features

- Converts images from 16:1 to 1.91:1 aspect ratio
- **Intelligent padding strategies:**
  - **Solid**: Black or white solid color padding
  - **Blur**: Blurred edge padding for smooth transitions
  - **Edge-extend**: Extends the edge pixels for seamless continuation
- Centers the original image in the expanded canvas
- Preserves image quality
- Supports various image formats (PNG, JPG, WebP, etc.)
- Customizable source and target aspect ratios
- Built with TypeScript and Sharp (high-performance image processing)

## Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd expand-images
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Usage

### Command Line Interface

#### Basic Usage

Expand an image with black padding (default):
```bash
node dist/expand-image.js input.png
```

This will create `input_expanded.png` in the same directory.

#### Specify Output Path

```bash
node dist/expand-image.js input.png -o output.png
```

#### Use White Padding

```bash
node dist/expand-image.js input.png -c white
```

#### Intelligent Padding Strategies

**Blurred Edge Padding** - Creates smooth transitions by blurring the edges:
```bash
node dist/expand-image.js input.png -p blur -b 15
```

**Edge Extension** - Extends the edge pixels for seamless continuation:
```bash
node dist/expand-image.js input.png -p edge-extend
```

#### Custom Aspect Ratios

```bash
node dist/expand-image.js input.png -s 16.0 -t 1.91
```

#### All Options

```bash
node dist/expand-image.js input.png \
  -o output.png \
  -p blur \
  -b 10 \
  -t 1.91 \
  -s 16.0
```

### Programmatic Usage

You can also use the library programmatically in your TypeScript/JavaScript code:

```typescript
import { expandImage } from './src/expand-image';

// Expand with solid color padding
await expandImage('input.png', 'output.png', {
  targetRatio: 1.91,
  paddingColor: 'black',
  paddingStrategy: 'solid'
});

// Expand with blurred edges
await expandImage('input.png', 'output_blur.png', {
  targetRatio: 1.91,
  paddingStrategy: 'blur',
  blurAmount: 15
});

// Expand with edge extension
await expandImage('input.png', 'output_edge.png', {
  targetRatio: 1.91,
  paddingStrategy: 'edge-extend'
});
```

### Run Example

To see the tool in action with a generated sample image:

```bash
npm run example
```

This will create a sample 16:1 image and expand it using all padding strategies (solid black/white, blur, and edge-extend).

## Command Line Arguments

- `<input>` - Input image path (required)
- `-o, --output <path>` - Output image path (default: adds '_expanded' suffix)
- `-p, --padding-strategy <strategy>` - Padding strategy: 'solid', 'blur', or 'edge-extend' (default: solid)
- `-c, --color <color>` - Padding color for solid strategy: 'black' or 'white' (default: black)
- `-b, --blur-amount <amount>` - Blur amount for blur strategy (default: 10)
- `-t, --target-ratio <ratio>` - Target aspect ratio width:height (default: 1.91)
- `-s, --source-ratio <ratio>` - Source aspect ratio width:height (default: 16.0)

## NPM Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Run the program in development mode with ts-node
- `npm run example` - Run the example script
- `npm run clean` - Remove compiled files

## Examples

### Example 1: Basic black padding (solid)
```bash
node dist/expand-image.js my_16x1_image.png
# Output: my_16x1_image_expanded.png (with solid black padding)
```

### Example 2: Blurred edge padding
```bash
node dist/expand-image.js banner.jpg -o banner_blur.jpg -p blur -b 20
# Output: banner_blur.jpg (with smooth blurred edge transitions)
```

### Example 3: Edge extension padding
```bash
node dist/expand-image.js photo.png -o photo_edge.png -p edge-extend
# Output: photo_edge.png (edges extended seamlessly)
```

### Example 4: White padding with custom output
```bash
node dist/expand-image.js banner.jpg -o banner_wide.jpg -c white -p solid
# Output: banner_wide.jpg (with solid white padding)
```

### Example 5: Custom aspect ratios with blur
```bash
node dist/expand-image.js photo.png -s 16.0 -t 2.0 -p blur -b 15
# Converts from 16:1 to 2:1 with blurred edge padding
```

### Example 6: Using TypeScript directly (development)
```bash
npm run dev -- input.png -p edge-extend -o output.png
```

## How It Works

The program:
1. Loads the input image using Sharp
2. Calculates the new dimensions based on the target aspect ratio
3. Applies the selected padding strategy:
   - **Solid**: Creates a canvas with the specified color and composites the image
   - **Blur**: Extracts edge strips, blurs them, and uses them as padding for smooth transitions
   - **Edge-extend**: Extends the leftmost and rightmost pixels to fill the padding areas
4. Centers and composites the original image onto the new canvas
5. Saves the result

For a 16:1 to 1.91:1 conversion:
- Height remains the same
- Width is calculated as: `new_width = height × 1.91`
- Original image is centered horizontally
- Padding fills the left and right sides using the chosen strategy

### Padding Strategy Details

- **Solid**: Traditional approach with uniform color padding (black or white)
- **Blur**: Samples 20 pixels from each edge, applies gaussian blur, and stretches them to fill the padding area. Best for images with colorful or gradient edges.
- **Edge-extend**: Repeats the edge pixels to create seamless continuation. Best for images with uniform edges or patterns.

## Requirements

- Node.js 16+
- TypeScript 5.0+
- Sharp (for high-performance image processing)

## Dependencies

- **sharp** - High-performance image processing library
- **commander** - Command-line interface framework
- **typescript** - TypeScript compiler

## Development

### Project Structure

```
expand-images/
├── src/
│   ├── expand-image.ts  # Main program with CLI
│   ├── example.ts       # Example usage script
│   └── index.ts         # Library exports
├── dist/                # Compiled JavaScript (generated)
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

### Building from Source

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run build

# Run the compiled program
node dist/expand-image.js input.png
```

## License

MIT License
