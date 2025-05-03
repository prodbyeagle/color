/**
 * Performs color quantization on image data using K-means clustering.
 *
 * @param data - The raw RGBA image data (from canvas or image bitmap).
 * @param maxColors - The maximum number of distinct colors to return.
 * @returns An array of RGB color values, each represented as `[r, g, b]`.
 *
 * @example
 * const result = quantize(imageData, 5);
 * // result = [[255, 0, 0], [0, 255, 0], ...]
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
		pixels.push([r, g, b]);
	}

	return kMeans(pixels, maxColors);
}

/**
 * Runs a simplified K-means clustering algorithm to group similar colors.
 *
 * @param pixels - An array of `[r, g, b]` values.
 * @param k - Number of clusters to generate (i.e. desired number of colors).
 * @returns The calculated centroids representing dominant colors.
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
 * Calculates the Euclidean distance between two RGB vectors.
 *
 * @param a - First RGB vector.
 * @param b - Second RGB vector.
 * @returns Distance between the two vectors.
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
