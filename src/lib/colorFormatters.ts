import { rgbToHex, rgbToHsl, rgbToOklch } from './convert';

/**
 * Converts an array of RGB color values into a different color representation.
 *
 * This function provides formatting utilities for color output based on user preference.
 * RGB values are left unchanged, HEX values are returned as strings (e.g., `#ff0000`), and
 * HSL values are returned as `[h, s, l]` arrays.
 *
 * @param colors - An array of RGB color triplets, each in the form `[r, g, b]`.
 * @param format - The desired output format: `'rgb'`, `'hex'`, or `'hsl'`.
 * @returns An array of colors in the chosen format:
 * - `'rgb'`: Returns the input unchanged.
 * - `'hex'`: Returns an array of hex color strings (e.g., `'#00ff88'`).
 * - `'hsl'`: Returns an array of HSL triplets `[h, s, l]`.
 *
 * @throws Will throw an error if an unsupported format is passed.
 *
 * @example
 * ```ts
 * const palette = [[255, 0, 0], [0, 255, 0]];
 * formatColors(palette, 'hex'); // ['#ff0000', '#00ff00']
 * formatColors(palette, 'hsl'); // [[0, 100, 50], [120, 100, 50]]
 * ```
 */
export function formatColors(
	colors: number[][],
	format: 'rgb' | 'hex' | 'hsl' | 'oklch'
): (string | number[])[] {
	switch (format) {
		case 'rgb':
			return colors;
		case 'hex':
			return colors.map(rgbToHex);
		case 'hsl':
			return colors.map(rgbToHsl);
		case 'oklch':
			return colors.map(rgbToOklch);
		default:
			throw new Error(`Unsupported color format: ${format}`);
	}
}
