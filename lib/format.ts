import { rgbToHex, rgbToHsl } from './convert';

/**
 * Formats a list of RGB color arrays into a specified format (RGB, HEX, or HSL).
 *
 * @param colors - An array of `[r, g, b]` color arrays.
 * @param format - Desired output format: `'rgb'`, `'hex'`, or `'hsl'`.
 * @returns An array of formatted color values as strings or `[r, g, b]` arrays.
 *
 * @example
 * formatColors([[255, 0, 0]], 'hex') // ['#ff0000']
 */
export function formatColors(
	colors: number[][],
	format: 'rgb' | 'hex' | 'hsl'
): (string | number[])[] {
	switch (format) {
		case 'rgb':
			return colors;
		case 'hex':
			return colors.map(rgbToHex);
		case 'hsl':
			return colors.map(rgbToHsl);
		default:
			throw new Error(`Unsupported color format: ${format}`);
	}
}
