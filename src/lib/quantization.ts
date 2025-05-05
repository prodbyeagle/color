import type { RGB } from '../types';
import { distSq, filterSimilarColors } from './utils';

const MAX_SAMPLE_SIZE = 2000;
const MAX_ITERATIONS = 10;
const ALPHA_THRESHOLD = 16;

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 *
 * This function randomly reorders the elements of the array. It creates a copy of the
 * input array before modifying it.
 *
 * @param arr - The array to shuffle.
 * @returns A new array with the shuffled elements.
 */
function shuffle<T>(arr: T[]): T[] {
	const copy = [...arr];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = copy[i]!;
		copy[i] = copy[j]!;
		copy[j] = temp;
	}
	return copy;
}

/**
 * Performs color quantization on raw image data using the K-means clustering algorithm.
 *
 * This function processes the RGBA image data, filters out fully transparent pixels
 * (alpha value below the `ALPHA_THRESHOLD`), and applies K-means clustering to extract
 * the most dominant colors in the image. It limits the number of clusters (colors) to
 * the specified `maxColors` and returns the dominant colors as an array of RGB triplets.
 *
 * @param data - A `Uint8ClampedArray` of raw image data in RGBA format (typically from `ImageData.data`).
 * @param maxColors - The maximum number of dominant colors to extract from the image.
 * @param distanceThreshold - The threshold for filtering out similar colors from the final result. Default is 10.
 * @returns An array of the dominant colors as RGB triplets, e.g., `[[255, 0, 0], [0, 255, 0], ...]`.
 */
export function quantize(
	data: Uint8ClampedArray,
	maxColors: number,
	distanceThreshold = 10
): RGB[] {
	const pixels: RGB[] = [];

	for (let i = 0; i <= data.length - 4; i += 4) {
		const r = data[i];
		const g = data[i + 1];
		const b = data[i + 2];
		const a = data[i + 3];

		if (a! < ALPHA_THRESHOLD) continue;
		pixels.push([r!, g!, b!]);
	}

	if (pixels.length === 0) return [];

	const sampled =
		pixels.length > MAX_SAMPLE_SIZE
			? shuffle(pixels).slice(0, MAX_SAMPLE_SIZE)
			: pixels;

	const dominantColors = filterSimilarColors(
		kMeans(sampled, maxColors),
		distanceThreshold
	);

	return dominantColors;
}

/**
 * Performs K-means clustering on an array of RGB colors.
 *
 * The function divides the given pixel colors into `k` clusters by iteratively
 * assigning each pixel to the closest centroid and updating the centroids based on
 * the mean of their corresponding cluster pixels. The algorithm runs for a fixed
 * number of iterations or until convergence.
 *
 * @param pixels - An array of RGB colors, each represented as `[r, g, b]`.
 * @param k - The number of clusters (centroids) to compute. Typically corresponds to the
 *           number of dominant colors requested.
 * @returns An array of `k` cluster centroids, each represented as `[r, g, b]`.
 */
export function kMeans(pixels: RGB[], k: number): RGB[] {
	if (pixels.length === 0) return [];

	let centroids: RGB[] = pixels.slice(0, k).map((p) => [...p]);
	let clusters: RGB[][] = Array.from({ length: k }, () => []);

	for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
		clusters = Array.from({ length: k }, () => []);

		for (const pixel of pixels) {
			let minDist = Infinity;
			let closestIndex = 0;

			for (let i = 0; i < k; i++) {
				const centroid = centroids[i];
				if (!centroid) continue;
				const d = distSq(pixel, centroid);
				if (d < minDist) {
					minDist = d;
					closestIndex = i;
				}
			}

			clusters[closestIndex]?.push(pixel);
		}

		let converged = true;
		for (let i = 0; i < k; i++) {
			const cluster = clusters[i];
			if (!cluster || cluster.length === 0) continue;

			const newCentroid: [number, number, number] = [0, 0, 0];
			for (const pixel of cluster) {
				newCentroid[0] += pixel[0]!;
				newCentroid[1] += pixel[1]!;
				newCentroid[2] += pixel[2]!;
			}

			newCentroid[0] = Math.round(newCentroid[0] / cluster.length);
			newCentroid[1] = Math.round(newCentroid[1] / cluster.length);
			newCentroid[2] = Math.round(newCentroid[2] / cluster.length);

			const current = centroids[i];
			if (
				!current ||
				newCentroid[0] !== current[0] ||
				newCentroid[1] !== current[1] ||
				newCentroid[2] !== current[2]
			) {
				centroids[i] = newCentroid;
				converged = false;
			}
		}

		if (converged) break;
	}

	return centroids.filter(Boolean);
}
