import { rgbToHex, rgbToHsl, rgbToOklch } from './convert';

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
	format: 'rgb' | 'hex' | 'hsl' | 'oklch' | 'lab'
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

/**
 * Converts a `Blob` (such as a `File` or image fetched from a URL) into raw pixel data.
 *
 * This utility loads the image into memory using `createImageBitmap`, renders it to an
 * `OffscreenCanvas`, and extracts the image’s RGBA pixel data via `ImageData`.
 *
 * It supports all common image formats (JPEG, PNG, WebP, etc.) as long as they are browser-decodable.
 *
 * @param file - A `Blob` representing the image. This could come from an `<input type="file">` element or a network response.
 * @returns A `Promise` that resolves to an `ImageData` object containing the raw RGBA pixel data.
 *
 * @throws Will throw an error if the 2D rendering context could not be initialized.
 *
 * @example
 * ```ts
 * const imageData = await getImageDataFromFile(file);
 * const { width, height, data } = imageData;
 * ```
 */
export async function getImageDataFromFile(file: Blob): Promise<ImageData> {
	const bitmap = await createImageBitmap(file);
	const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Failed to get 2D context');

	ctx.drawImage(bitmap, 0, 0);
	return ctx.getImageData(0, 0, bitmap.width, bitmap.height);
}

/**
 * Performs color quantization on raw image data using K-means clustering.
 *
 * This function extracts the visible (non-transparent) pixels from an image's RGBA data
 * and clusters them into a representative color palette using the K-means algorithm.
 *
 * Transparent pixels (alpha < 16) are ignored to prevent background colors or padding
 * from affecting the results—this is especially important when analyzing PNG images with
 * transparency.
 *
 * @param data - A `Uint8ClampedArray` of raw image data in RGBA format (typically from `ImageData.data`).
 * @param maxColors - The maximum number of colors to extract. Also used as the number of K-means clusters.
 * @returns An array of dominant colors represented as RGB triplets, e.g., `[[255, 0, 0], [0, 255, 0], ...]`.
 *
 * @example
 * ```ts
 * const imageData = await getImageDataFromFile(file);
 * const palette = quantize(imageData.data, 5);
 * // palette: [[123, 45, 67], [89, 210, 123], ...]
 * ```
 */
export function quantize(
	data: Uint8ClampedArray,
	maxColors: number
): number[][] {
	const pixels: number[][] = [];

	for (let i = 0; i < data.length; i += 4) {
		const r = data[i] ?? 0;
		const g = data[i + 1] ?? 0;
		const b = data[i + 2] ?? 0;
		const a = data[i + 3] ?? 255;

		if (a < 16) continue;

		pixels.push([r, g, b]);
	}

	return kMeans(pixels, maxColors);
}

/**
 * Runs a basic K-means clustering algorithm on a set of RGB pixels.
 *
 * This function partitions the given pixel colors into `k` clusters by repeatedly assigning
 * pixels to the nearest centroid and updating centroid positions based on the mean of their cluster.
 * The algorithm runs for a fixed number of iterations (10).
 *
 * @param pixels - An array of RGB colors, each represented as `[r, g, b]`.
 * @param k - Number of clusters to compute. Usually corresponds to the desired number of dominant colors.
 * @returns An array of cluster centroids (dominant colors), each as `[r, g, b]`.
 *
 * @example
 * ```ts
 * const dominant = kMeans([[255, 0, 0], [250, 5, 5], [0, 255, 0]], 2);
 * // dominant: [[252, 2, 2], [0, 255, 0]]
 * ```
 */
export function kMeans(pixels: number[][], k: number): number[][] {
	const centroids: number[][] = pixels.slice(0, k);
	const clusters: number[][][] = Array.from({ length: k }, () => []);

	for (let i = 0; i < 10; i++) {
		clusters.forEach((c) => (c.length = 0));

		for (const pixel of pixels) {
			const nearest = centroids.reduce((minIdx, c, idx) => {
				const currentDist = dist(pixel, c);
				const minDist = dist(pixel, centroids[minIdx] ?? [0, 0, 0]);
				return currentDist < minDist ? idx : minIdx;
			}, 0);

			clusters[nearest]?.push(pixel);
		}

		centroids.forEach((_, idx) => {
			const cluster = clusters[idx];
			if (!cluster || cluster.length === 0) return;

			const mean = cluster[0]
				? cluster[0].map((_, i) =>
						Math.round(
							cluster.reduce((sum, p) => sum + (p[i] ?? 0), 0) /
								cluster.length
						)
				  )
				: [];

			centroids[idx] = mean;
		});
	}

	return centroids;
}

/**
 * Calculates the Euclidean distance between two RGB colors.
 *
 * Used as the distance metric in K-means clustering. Ignores alpha channels.
 *
 * @param a - First RGB vector `[r, g, b]`.
 * @param b - Second RGB vector `[r, g, b]`.
 * @returns The Euclidean distance between the two colors.
 *
 * @example
 * ```ts
 * const d = dist([255, 0, 0], [128, 0, 0]); // ≈ 127
 * ```
 */
export function dist(a: number[], b: number[]): number {
	const len = Math.min(a.length, b.length);
	let sum = 0;
	for (let i = 0; i < len; i++) {
		const ai = a[i] ?? 0;
		const bi = b[i] ?? 0;
		sum += (ai - bi) ** 2;
	}
	return Math.sqrt(sum);
}
