/**
 * A tuple representing a color in 8-bit sRGB.
 * @example
 * const red: RGB = [255, 0, 0];
 */
export type RGB = [number, number, number];
export type RGBA = [r: number, g: number, b: number, a: number];
export type PixelData = Uint8ClampedArray;
export type PixelMatrix = RGB[];

/**
 * Defines the supported output color formats.
 *
 * - `'rgb'`: Array of RGB triplets, e.g., `[255, 204, 0]`
 * - `'hex'`: Hexadecimal color strings, e.g., `'#ffcc00'`
 * - `'hsl'`: HSL strings, e.g., `'hsl(45, 100%, 50%)'`
 * - `'oklch'`: OKLCH strings, e.g., `'oklch(0.823 0.173 84.2deg)'`
 */
export interface ColorFormat {
	format: 'rgb' | 'hex' | 'hsl' | 'oklch';
}
