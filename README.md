# expand-images

A TypeScript program to expand images from 16:1 to 1.91:1 aspect ratio by adding black or white padding on the left and right sides.

## Features

- Converts images from 16:1 to 1.91:1 aspect ratio
- Supports black or white padding colors
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

#### Custom Aspect Ratios

```bash
node dist/expand-image.js input.png -s 16.0 -t 1.91
```

#### All Options

```bash
node dist/expand-image.js input.png \
  -o output.png \
  -c black \
  -t 1.91 \
  -s 16.0
```

### Programmatic Usage

You can also use the library programmatically in your TypeScript/JavaScript code:

```typescript
import { expandImage } from './src/expand-image';

// Expand an image
await expandImage('input.png', 'output.png', {
  targetRatio: 1.91,
  paddingColor: 'black',
  sourceRatio: 16.0
});
```

### Run Example

To see the tool in action with a generated sample image:

```bash
npm run example
```

This will create a sample 16:1 image and expand it with both black and white padding.

## Command Line Arguments

- `<input>` - Input image path (required)
- `-o, --output <path>` - Output image path (default: adds '_expanded' suffix)
- `-c, --color <color>` - Padding color: 'black' or 'white' (default: black)
- `-t, --target-ratio <ratio>` - Target aspect ratio width:height (default: 1.91)
- `-s, --source-ratio <ratio>` - Source aspect ratio width:height (default: 16.0)

## NPM Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Run the program in development mode with ts-node
- `npm run example` - Run the example script
- `npm run clean` - Remove compiled files

## Examples

### Example 1: Basic black padding
```bash
node dist/expand-image.js my_16x1_image.png
# Output: my_16x1_image_expanded.png (with black bars)
```

### Example 2: White padding with custom output
```bash
node dist/expand-image.js banner.jpg -o banner_wide.jpg -c white
# Output: banner_wide.jpg (with white bars)
```

### Example 3: Custom aspect ratios
```bash
node dist/expand-image.js photo.png -s 16.0 -t 2.0 -c white
# Converts from 16:1 to 2:1 with white padding
```

### Example 4: Using TypeScript directly (development)
```bash
npm run dev -- input.png -c white -o output.png
```

## How It Works

The program:
1. Loads the input image using Sharp
2. Calculates the new dimensions based on the target aspect ratio
3. Creates a new canvas with the padding color
4. Centers and composites the original image onto the new canvas
5. Saves the result

For a 16:1 to 1.91:1 conversion:
- Height remains the same
- Width is calculated as: `new_width = height × 1.91`
- Original image is centered horizontally
- Padding fills the left and right sides

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
