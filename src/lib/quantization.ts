import { filterSimilarColors, dist } from './utils';

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
	maxColors: number,
	distanceThreshold: number = 10
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

	let dominantColors = kMeans(pixels, maxColors);
	dominantColors = filterSimilarColors(dominantColors, distanceThreshold);

	return dominantColors;
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
