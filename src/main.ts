import { formatColors } from './lib/colorFormatters';
import { getImageDataFromFile } from './lib/imageProcessing';
import { quantize } from './lib/quantization';

/**
 * Extracts a color palette from an image file or blob, returning the most dominant colors
 * in the specified format.
 *
 * This function performs the following steps:
 * 1. Decodes the image and extracts raw pixel data.
 * 2. Quantizes the image to reduce it to the most dominant colors.
 * 3. Formats the resulting colors into the specified output format.
 *
 * @param imageFile - A `File` or `Blob` representing the image source.
 * @param maxColors - The maximum number of dominant colors to extract from the image.
 *                    Must be a positive integer greater than 0.
 * @param format - The desired output format for the extracted colors. Defaults to `'hex'`.
 *                 Must be one of `'rgb'`, `'hex'`, `'hsl'` or `'oklch'`.
 * @param distance - The threshold for filtering out similar colors from the final result.
 *
 * @returns A `Promise` resolving to an array of colors in the specified format:
 * - `'rgb'`: Returns an array of RGB arrays — `number[][]`, e.g., `[[255, 204, 0], [0, 0, 0], ...]`
 * - `'hex' | 'hsl' | 'oklch'`: Returns an array of formatted color strings — `string[]`
 *
 * @throws {Error} If an unsupported format is specified or if image decoding fails.
 *
 * @example
 * ```ts
 * const file = new File([/* image data *\/], 'photo.jpg', { type: 'image/jpeg' });
 * const palette = await extractColors(file, 5, 'oklch');
 * console.log(palette); // ['oklch(0.82 0.15 90.0deg)', ...]
 * ```
 * @author prodbyeagle
 */
export async function extractColors(
	imageFile: File | Blob,
	maxColors: number,
	format: 'rgb' | 'hex' | 'hsl' | 'oklch' = 'hex',
	distance: number = 10
): Promise<string[] | number[][]> {
	if (maxColors <= 0 || !Number.isInteger(maxColors)) {
		throw new Error('maxColors must be a positive integer greater than 0.');
	}

	if (!['rgb', 'hex', 'hsl', 'oklch'].includes(format)) {
		throw new Error(`Unsupported color format: ${format}`);
	}

	const imageData = await getImageDataFromFile(imageFile);
	const palette = quantize(imageData.data, maxColors, distance);
	const formattedColors = formatColors(palette, format);

	return format === 'rgb'
		? (formattedColors as number[][])
		: (formattedColors as string[]);
}
