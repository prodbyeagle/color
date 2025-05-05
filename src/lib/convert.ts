/**
 * Clamp a number into the closed interval [0, 1].
 *
 * @param value – The input value to clamp.
 * @returns The clamped value, never less than 0 or greater than 1.
 * @author prodbyeagle
 */
function clamp01(value: number): number {
	return value < 0 ? 0 : value > 1 ? 1 : value;
}

/**
 * Convert an sRGB channel from 0–255 to linear-light 0–1 using the standard
 * gamma expansion formula.
 *
 * @param channel – An sRGB component (0–255). Non-finite values default to 0.
 * @returns The linear-light equivalent (0–1).
 * @author prodbyeagle
 */
function srgbToLinear(channel: number): number {
	const normalized = clamp01(Number.isFinite(channel) ? channel / 255 : 0);
	return normalized <= 0.04045
		? normalized / 12.92
		: Math.pow((normalized + 0.055) / 1.055, 2.4);
}

/**
 * Convert an RGB color to a CSS-compatible HEX string.
 *
 * @param rgb – A 3-element array of red, green, blue values (0–255).
 *              Missing or non-finite entries default to 0.
 * @returns A 7-character string `#rrggbb`, always lowercase.
 *
 * @example
 * rgbToHex([255, 204, 0]); // '#ffcc00'
 * @author prodbyeagle
 */
export function rgbToHex(rgb: number[]): string {
	const [r = 0, g = 0, b = 0] = rgb;
	const toHexChannel = (x: number) => {
		const intVal = Number.isFinite(x) ? Math.round(x) : 0;
		const scaled = Math.round(clamp01(intVal / 255) * 255);
		return scaled.toString(16).padStart(2, '0');
	};
	return `#${toHexChannel(r)}${toHexChannel(g)}${toHexChannel(b)}`;
}

/**
 * Convert an RGB color to a CSS HSL string.
 *
 * Uses the standard formula to compute hue (°), saturation (%), and lightness (%).
 * All percentages are rounded to the nearest integer, hue is integer degrees.
 *
 * @param rgb – A 3-element array of red, green, blue values (0–255).
 *              Missing or non-finite entries default to 0.
 * @returns A string of the form `hsl(h, s%, l%)`.
 *
 * @example
 * rgbToHsl([255, 204, 0]); // 'hsl(45, 100%, 50%)'
 * @author prodbyeagle
 */
export function rgbToHsl(rgb: number[]): string {
	const [r = 0, g = 0, b = 0] = rgb;
	const rn = clamp01(r / 255);
	const gn = clamp01(g / 255);
	const bn = clamp01(b / 255);

	const max = Math.max(rn, gn, bn);
	const min = Math.min(rn, gn, bn);
	const delta = max - min;

	let hue = 0;
	if (delta !== 0) {
		if (max === rn) {
			hue = ((gn - bn) / delta + (gn < bn ? 6 : 0)) * 60;
		} else if (max === gn) {
			hue = ((bn - rn) / delta + 2) * 60;
		} else {
			hue = ((rn - gn) / delta + 4) * 60;
		}
	}

	const lightness = (max + min) / 2;
	const saturation =
		delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

	const h = Math.round(hue) % 360;
	const s = Math.round(saturation * 100);
	const l = Math.round(lightness * 100);

	return `hsl(${h}, ${s}%, ${l}%)`;
}

/**
 * Convert an RGB color to OKLCH, a perceptually uniform color space.
 *
 * Follows the canonical pipeline:
 * 1. sRGB → linear-light
 * 2. linear RGB → LMS (using OkLab matrix)
 * 3. LMS → cube root non-linearity
 * 4. OKLab → OKLCH (L, C, H)
 * 5. Round L and C to 3 decimal places, H to 1 decimal place
 *
 * @param rgb – A 3-element array of red, green, blue values (0–255).
 *              Missing or non-finite entries default to 0.
 * @returns A string of the form `oklch(L CCC H.deg)`,
 *          where L ∈ [0.000,1.000], C and H have fixed decimal precision.
 *
 * @example
 * rgbToOklch([255, 102, 147]); // 'oklch(0.747 0.258 19.6deg)'
 * @author prodbyeagle
 */
export function rgbToOklch(rgb: number[]): string {
	const [rLin, gLin, bLin] = rgb.map(srgbToLinear);

	const l_ =
		0.4122214708 * rLin! + 0.5363325363 * gLin! + 0.0514459929 * bLin!;
	const m_ =
		0.2119034982 * rLin! + 0.6806995451 * gLin! + 0.1073969566 * bLin!;
	const s_ =
		0.0883024619 * rLin! + 0.2817188376 * gLin! + 0.6299787005 * bLin!;

	const l = Math.cbrt(l_);
	const m = Math.cbrt(m_);
	const s = Math.cbrt(s_);

	const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
	const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
	const b2 = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

	const C = Math.hypot(a, b2);
	let H = (Math.atan2(b2, a) * 180) / Math.PI;
	if (H < 0) H += 360;

	const Ls = L.toFixed(3);
	const Cs = C.toFixed(3);
	const Hs = H.toFixed(1);

	return `oklch(${Ls} ${Cs} ${Hs}deg)`;
}
