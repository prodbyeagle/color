import { getImageDataFromFile } from './lib/image-utils';
import { quantize } from './lib/quantize';
import { formatColors } from './lib/format';

/**
 * A type representing supported color formats.
 */
export type ColorFormat = 'rgb' | 'hex' | 'hsl';

/**
 * Extracts the dominant colors from an image file or blob.
 *
 * This function takes an image file or blob, extracts the pixel data, performs
 * quantization to reduce the number of colors, and then formats the resulting
 * color palette based on the desired output format (RGB, HEX, or HSL).
 *
 * @param imageFile - The image file or Blob from which colors will be extracted.
 * @param maxColors - The maximum number of colors to return in the palette.
 * @param format - The format to return the colors in, can be 'rgb', 'hex', or 'hsl'. Defaults to 'hex'.
 * @returns A promise that resolves to an array of colors in the specified format.
 *          - If 'hex' is selected, returns an array of hex color strings.
 *          - If 'rgb' is selected, returns an array of RGB color arrays.
 *          - If 'hsl' is selected, returns an array of HSL color strings.
 *
 * @throws {Error} Throws an error if an unsupported format is provided.
 */
export async function extractColors(
	imageFile: File | Blob,
	maxColors: number,
	format: ColorFormat = 'hex'
): Promise<string[] | number[][]> {
	const imageData = await getImageDataFromFile(imageFile);
	const palette = quantize(imageData.data, maxColors);
	const formattedColors = formatColors(palette, format);
	if (format === 'hex' || format === 'rgb' || format === 'hsl') {
		return formattedColors as string[];
	}
	return formattedColors as number[][];
}
