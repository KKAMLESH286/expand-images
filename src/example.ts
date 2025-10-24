#!/usr/bin/env node

/**
 * Example script demonstrating the image expansion functionality.
 * Creates a sample 16:1 image and expands it to 1.91:1.
 */

import sharp from 'sharp';
import { expandImage } from './expand-image';

/**
 * Create a sample 16:1 aspect ratio image for demonstration.
 */
async function createSampleImage(
  filename: string = 'sample_16x1.png',
  width: number = 1600,
  height: number = 100
): Promise<string> {
  // Create a gradient image
  const svgImage = `
    <svg width="${width}" height="${height}">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:rgb(0,100,200);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgb(255,200,100);stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad1)" />
      <rect width="${width}" height="${height}" fill="none" stroke="white" stroke-width="2" />
      <text x="${width / 2}" y="${height / 2}"
            font-family="Arial" font-size="20"
            fill="white" text-anchor="middle" dominant-baseline="middle">
        16:1 Sample Image
      </text>
    </svg>
  `;

  await sharp(Buffer.from(svgImage))
    .png()
    .toFile(filename);

  console.log(`Created sample image: ${filename} (${width}x${height}, ${(width / height).toFixed(1)}:1)`);
  return filename;
}

/**
 * Main example function
 */
async function main(): Promise<void> {
  console.log('Image Expansion Example');
  console.log('='.repeat(50));
  console.log();

  try {
    // Create a sample 16:1 image
    console.log('Step 1: Creating a sample 16:1 image...');
    const sampleFile = await createSampleImage();
    console.log();

    // Expand with black padding (solid strategy)
    console.log('Step 2: Expanding with SOLID BLACK padding...');
    const outputBlack = await expandImage(sampleFile, 'sample_expanded_black.png', {
      targetRatio: 1.91,
      paddingColor: 'black',
      paddingStrategy: 'solid'
    });
    console.log();

    // Expand with white padding (solid strategy)
    console.log('Step 3: Expanding with SOLID WHITE padding...');
    const outputWhite = await expandImage(sampleFile, 'sample_expanded_white.png', {
      targetRatio: 1.91,
      paddingColor: 'white',
      paddingStrategy: 'solid'
    });
    console.log();

    // Expand with blurred edge padding
    console.log('Step 4: Expanding with BLURRED EDGE padding...');
    const outputBlur = await expandImage(sampleFile, 'sample_expanded_blur.png', {
      targetRatio: 1.91,
      paddingStrategy: 'blur',
      blurAmount: 15
    });
    console.log();

    // Expand with edge extension
    console.log('Step 5: Expanding with EDGE EXTENSION...');
    const outputEdge = await expandImage(sampleFile, 'sample_expanded_edge.png', {
      targetRatio: 1.91,
      paddingStrategy: 'edge-extend'
    });
    console.log();

    console.log('='.repeat(50));
    console.log('Example completed successfully!');
    console.log();
    console.log('Generated files:');
    console.log(`  - ${sampleFile} (original 16:1)`);
    console.log(`  - ${outputBlack} (solid black padding)`);
    console.log(`  - ${outputWhite} (solid white padding)`);
    console.log(`  - ${outputBlur} (blurred edge padding)`);
    console.log(`  - ${outputEdge} (edge extension padding)`);
    console.log();
    console.log('You can now view these images to see the different expansion effects.');
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
}

// Run the example
if (require.main === module) {
  main();
}

export { createSampleImage };
