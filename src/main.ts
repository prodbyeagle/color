import { formatColors } from './lib/colorFormatters';
import { getImageDataFromFile } from './lib/imageProcessing';
import { quantize } from './lib/quantization';

/**
 * Defines the supported output color formats.
 *
 * - `'rgb'`: Array of RGB triplets, e.g., `[255, 204, 0]`
 * - `'hex'`: Hexadecimal color strings, e.g., `'#ffcc00'`
 * - `'hsl'`: HSL strings, e.g., `'hsl(45, 100%, 50%)'`
 * - `'oklch'`: OKLCH strings, e.g., `'oklch(0.823 0.173 84.2deg)'`
 */
export type ColorFormat = 'rgb' | 'hex' | 'hsl' | 'oklch';

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
 */
export async function extractColors(
	imageFile: File | Blob,
	maxColors: number,
	format: ColorFormat = 'hex',
	distance: number = 10
): Promise<string[] | number[][]> {
	const imageData = await getImageDataFromFile(imageFile);
	const palette = quantize(imageData.data, maxColors, distance);
	const formattedColors = formatColors(palette, format);

	if (
		format === 'hex' ||
		format === 'rgb' ||
		format === 'hsl' ||
		format === 'oklch'
	) {
		return formattedColors as string[];
	}

	return formattedColors as number[][];
}
