#!/usr/bin/env node

/**
 * Image Aspect Ratio Expander
 * Expands images from 16:1 to 1.91:1 aspect ratio by adding padding on the sides.
 */

import sharp from 'sharp';
import { program } from 'commander';
import { promises as fs } from 'fs';
import path from 'path';

interface ExpandOptions {
  targetRatio?: number;
  paddingColor?: 'black' | 'white';
  sourceRatio?: number;
}

/**
 * Expand an image from source aspect ratio to target aspect ratio.
 */
async function expandImage(
  inputPath: string,
  outputPath?: string,
  options: ExpandOptions = {}
): Promise<string> {
  const {
    targetRatio = 1.91,
    paddingColor = 'black',
    sourceRatio = 16.0
  } = options;

  // Check if input file exists
  try {
    await fs.access(inputPath);
  } catch (error) {
    throw new Error(`Input file '${inputPath}' does not exist`);
  }

  // Get image metadata
  const image = sharp(inputPath);
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error('Unable to read image dimensions');
  }

  const originalWidth = metadata.width;
  const originalHeight = metadata.height;
  const originalRatio = originalWidth / originalHeight;

  console.log(`Original image size: ${originalWidth}x${originalHeight}`);
  console.log(`Original aspect ratio: ${originalRatio.toFixed(2)}:1`);

  // Calculate new dimensions
  const newHeight = originalHeight;
  const newWidth = Math.round(newHeight * targetRatio);

  console.log(`Target aspect ratio: ${targetRatio}:1`);
  console.log(`New image size: ${newWidth}x${newHeight}`);

  // Determine padding color
  const backgroundColor = paddingColor === 'white'
    ? { r: 255, g: 255, b: 255, alpha: 1 }
    : { r: 0, g: 0, b: 0, alpha: 1 };

  // Calculate position to center the original image
  const xOffset = Math.floor((newWidth - originalWidth) / 2);

  // Create expanded image
  const inputBuffer = await image.png().toBuffer();
  
  const expandedImage = await sharp({
    create: {
      width: newWidth,
      height: newHeight,
      channels: metadata.hasAlpha ? 4 : 3,
      background: backgroundColor
    }
  })
    .composite([
      {
        input: inputBuffer,
        top: 0,
        left: xOffset
      }
    ])
    .png()
    .toBuffer();

  // Generate output path if not provided
  if (!outputPath) {
    const parsedPath = path.parse(inputPath);
    outputPath = path.join(
      parsedPath.dir,
      `${parsedPath.name}_expanded${parsedPath.ext}`
    );
  }

  // Save the expanded image
  await sharp(expandedImage).toFile(outputPath);
  console.log(`Saved expanded image to: ${outputPath}`);

  return outputPath;
}

// CLI interface
if (require.main === module) {
  program
    .name('expand-image')
    .description('Expand images from 16:1 to 1.91:1 aspect ratio with padding')
    .argument('<input>', 'Input image path')
    .option('-o, --output <path>', 'Output image path')
    .option(
      '-c, --color <color>',
      'Padding color (black or white)',
      'black'
    )
    .option(
      '-t, --target-ratio <ratio>',
      'Target aspect ratio width:height',
      '1.91'
    )
    .option(
      '-s, --source-ratio <ratio>',
      'Source aspect ratio width:height',
      '16.0'
    )
    .action(async (input, options) => {
      try {
        const color = options.color as 'black' | 'white';

        if (color !== 'black' && color !== 'white') {
          console.error('Error: Color must be either "black" or "white"');
          process.exit(1);
        }

        await expandImage(input, options.output, {
          targetRatio: parseFloat(options.targetRatio),
          paddingColor: color,
          sourceRatio: parseFloat(options.sourceRatio)
        });

        process.exit(0);
      } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        process.exit(1);
      }
    });

  program.parse();
}

export { expandImage, ExpandOptions };
