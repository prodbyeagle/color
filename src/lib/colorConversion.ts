/**
 * Converts an sRGB component value (0–255) to linear RGB.
 *
 * This is part of the standard sRGB to XYZ conversion pipeline.
 * Applies gamma correction as per the sRGB specification.
 *
 * @param v - The sRGB channel value in the range 0–255.
 * @returns The linearized value in the range [0, 1].
 *
 * @example
 * ```ts
 * srgbToLinear(255); // ≈ 1
 * srgbToLinear(0);   // 0
 * ```
 */
export function srgbToLinear(v: number): number {
	const srgb = v / 255;
	return srgb <= 0.04045
		? srgb / 12.92
		: Math.pow((srgb + 0.055) / 1.055, 2.4);
}

/**
 * Converts an RGB triplet to CIE 1931 XYZ color space.
 *
 * This function performs gamma correction and matrix transformation
 * to convert sRGB to XYZ using the D65 illuminant.
 *
 * @param rgb - An array of 3 numbers `[r, g, b]` in 0–255 range.
 * @returns A tuple `[x, y, z]` representing the color in XYZ space.
 *
 * @example
 * ```ts
 * rgbToXyz([255, 0, 0]); // ≈ [0.412, 0.212, 0.019]
 * ```
 */
export function rgbToXyz([r = 0, g = 0, b = 0]: number[]): [
	number,
	number,
	number
] {
	const rl = srgbToLinear(r);
	const gl = srgbToLinear(g);
	const bl = srgbToLinear(b);

	const x = rl * 0.4124564 + gl * 0.3575761 + bl * 0.1804375;
	const y = rl * 0.2126729 + gl * 0.7151522 + bl * 0.072175;
	const z = rl * 0.0193339 + gl * 0.119192 + bl * 0.9503041;
	return [x, y, z];
}

/**
 * Converts a color from CIE 1931 XYZ space to CIE L*a*b* (CIELAB).
 *
 * Uses the D65 reference white and nonlinear transformation
 * to map XYZ coordinates into perceptually uniform Lab space.
 *
 * @param xyz - A `[x, y, z]` tuple from `rgbToXyz()`.
 * @returns A `[L, a, b]` tuple representing CIELAB values.
 *
 * @example
 * ```ts
 * xyzToLab([0.412, 0.212, 0.019]); // ≈ [53.2, 80.1, 67.2]
 * ```
 */
export function xyzToLab([x = 0, y = 0, z = 0]: number[]): [
	number,
	number,
	number
] {
	const Xn = 0.95047;
	const Yn = 1.0;
	const Zn = 1.08883;

	const f = (t: number) =>
		t > 0.008856 ? Math.cbrt(t) : (903.3 * t + 16) / 116;

	const fx = f(x / Xn);
	const fy = f(y / Yn);
	const fz = f(z / Zn);

	const L = 116 * fy - 16;
	const a = 500 * (fx - fy);
	const b = 200 * (fy - fz);
	return [L, a, b];
}

/**
 * Converts a CIELAB `[L, a, b]` color to OKLCH format.
 *
 * This function approximates Oklch values by converting
 * Lab to lightness (L), chroma (C), and hue (H).
 *
 * Note: The conversion is approximate and does not use the full OKLab model.
 *
 * @param lab - A Lab tuple `[L, a, b]`.
 * @returns An OKLCH tuple `[l, c, h]`:
 * - `l`: Perceptual lightness [0–1]
 * - `c`: Chroma [0–1]
 * - `h`: Hue angle in degrees [0–360)
 *
 * @example
 * ```ts
 * labToOklch([53.2, 80.1, 67.2]); // ≈ [0.532, 1.044, 40.8]
 * ```
 */
export function labToOklch([L, a, b]: [number, number, number]): [
	number,
	number,
	number
] {
	const l = L / 100;
	const c = Math.sqrt(a * a + b * b) / 100;
	const hRad = Math.atan2(b, a);
	const h = (hRad * 180) / Math.PI;
	return [l, c, (h + 360) % 360];
}
