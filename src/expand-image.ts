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
  paddingStrategy?: 'solid' | 'blur' | 'edge-extend';
  blurAmount?: number;
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
    sourceRatio = 16.0,
    paddingStrategy = 'solid',
    blurAmount = 10
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
  console.log(`Padding strategy: ${paddingStrategy}`);

  // Calculate position to center the original image
  const xOffset = Math.floor((newWidth - originalWidth) / 2);
  const paddingWidth = xOffset;

  let expandedImage: Buffer;

  if (paddingStrategy === 'edge-extend') {
    // Use Sharp's extend with edge repeat
    expandedImage = await image
      .extend({
        left: paddingWidth,
        right: paddingWidth,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toBuffer();

    // Since extend doesn't have a true edge-repeat, we'll manually create it
    const inputBuffer = await image.png().toBuffer();

    // Extract left edge strip (1 pixel wide)
    const leftEdge = await sharp(inputBuffer)
      .extract({ left: 0, top: 0, width: 1, height: originalHeight })
      .resize(paddingWidth, originalHeight, { kernel: 'nearest' })
      .toBuffer();

    // Extract right edge strip (1 pixel wide)
    const rightEdge = await sharp(inputBuffer)
      .extract({ left: originalWidth - 1, top: 0, width: 1, height: originalHeight })
      .resize(paddingWidth, originalHeight, { kernel: 'nearest' })
      .toBuffer();

    // Composite everything together
    expandedImage = await sharp({
      create: {
        width: newWidth,
        height: newHeight,
        channels: metadata.hasAlpha ? 4 : 3,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
      .composite([
        { input: leftEdge, top: 0, left: 0 },
        { input: inputBuffer, top: 0, left: paddingWidth },
        { input: rightEdge, top: 0, left: paddingWidth + originalWidth }
      ])
      .png()
      .toBuffer();

  } else if (paddingStrategy === 'blur') {
    // Create blurred edge padding
    const inputBuffer = await image.png().toBuffer();

    // Extract left edge strip (20 pixels wide for better blur effect)
    const edgeWidth = Math.min(20, Math.floor(originalWidth * 0.1));

    const leftEdge = await sharp(inputBuffer)
      .extract({ left: 0, top: 0, width: edgeWidth, height: originalHeight })
      .blur(blurAmount)
      .resize(paddingWidth, originalHeight, { fit: 'fill' })
      .toBuffer();

    // Extract right edge strip
    const rightEdge = await sharp(inputBuffer)
      .extract({
        left: originalWidth - edgeWidth,
        top: 0,
        width: edgeWidth,
        height: originalHeight
      })
      .blur(blurAmount)
      .resize(paddingWidth, originalHeight, { fit: 'fill' })
      .toBuffer();

    // Composite everything together
    expandedImage = await sharp({
      create: {
        width: newWidth,
        height: newHeight,
        channels: metadata.hasAlpha ? 4 : 3,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
      .composite([
        { input: leftEdge, top: 0, left: 0 },
        { input: inputBuffer, top: 0, left: paddingWidth },
        { input: rightEdge, top: 0, left: paddingWidth + originalWidth }
      ])
      .png()
      .toBuffer();

  } else {
    // Solid color padding (original behavior)
    const backgroundColor = paddingColor === 'white'
      ? { r: 255, g: 255, b: 255, alpha: 1 }
      : { r: 0, g: 0, b: 0, alpha: 1 };

    const inputBuffer = await image.png().toBuffer();

    expandedImage = await sharp({
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
  }

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
    .description('Expand images from 16:1 to 1.91:1 aspect ratio with intelligent padding')
    .argument('<input>', 'Input image path')
    .option('-o, --output <path>', 'Output image path')
    .option(
      '-c, --color <color>',
      'Padding color for solid strategy (black or white)',
      'black'
    )
    .option(
      '-p, --padding-strategy <strategy>',
      'Padding strategy: solid, blur, or edge-extend',
      'solid'
    )
    .option(
      '-b, --blur-amount <amount>',
      'Blur amount for blur strategy (default: 10)',
      '10'
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
        const strategy = options.paddingStrategy as 'solid' | 'blur' | 'edge-extend';

        if (color !== 'black' && color !== 'white') {
          console.error('Error: Color must be either "black" or "white"');
          process.exit(1);
        }

        if (!['solid', 'blur', 'edge-extend'].includes(strategy)) {
          console.error('Error: Padding strategy must be "solid", "blur", or "edge-extend"');
          process.exit(1);
        }

        await expandImage(input, options.output, {
          targetRatio: parseFloat(options.targetRatio),
          paddingColor: color,
          sourceRatio: parseFloat(options.sourceRatio),
          paddingStrategy: strategy,
          blurAmount: parseFloat(options.blurAmount)
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
