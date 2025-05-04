import { rgbToXyz, xyzToLab, labToOklch } from '.';

/**
 * Converts an RGB array to a HEX color string.
 *
 * @param rgb - An array `[r, g, b]` with red, green, and blue components.
 * @returns A HEX color string, e.g., `#ffcc00`.
 *
 * @example
 * rgbToHex([255, 204, 0]) // '#ffcc00'
 */
export function rgbToHex(rgb: number[]) {
	const [r = 0, g = 0, b = 0] = rgb ?? [];
	return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * Converts an RGB array to an HSL color string.
 *
 * @param rgb - An array `[r, g, b]` with red, green, and blue components.
 * @returns An HSL color string, e.g., `'hsl(45, 100%, 50%)'`.
 *
 * @example
 * rgbToHsl([255, 204, 0]) // 'hsl(45, 100%, 50%)'
 */
export function rgbToHsl(rgb: number[]): string {
	const [r = 0, g = 0, b = 0] = rgb ?? [];
	const rn = r / 255;
	const gn = g / 255;
	const bn = b / 255;

	const max = Math.max(rn, gn, bn);
	const min = Math.min(rn, gn, bn);
	const delta = max - min;

	let h = 0;
	if (delta !== 0) {
		if (max === rn) h = ((gn - bn) / delta + (gn < bn ? 6 : 0)) * 60;
		else if (max === gn) h = ((bn - rn) / delta + 2) * 60;
		else h = ((rn - gn) / delta + 4) * 60;
	}

	const l = (max + min) / 2;
	const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

	return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(
		l * 100
	)}%)`;
}

export function rgbToOklch(rgb: number[]): string {
	const xyz = rgbToXyz(rgb);
	const lab = xyzToLab(xyz);
	const [l, c, h] = labToOklch(lab);
	return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(1)}deg)`;
}
