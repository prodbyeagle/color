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

/**
 * Filters out similar colors using a distance threshold.
 * Identical colors or colors that are very close in distance will be filtered.
 *
 * @param colors - An array of RGB colors (e.g., [[255, 0, 0], [0, 255, 0]]).
 * @param threshold - The maximum allowed distance for two colors to be considered similar.
 * @returns An array of filtered colors with no very similar colors.
 */
export function filterSimilarColors(
	colors: number[][],
	threshold: number = 10
): number[][] {
	const filteredColors: number[][] = [];

	for (const color of colors) {
		let isSimilar = false;
		for (const existingColor of filteredColors) {
			if (dist(color, existingColor) < threshold) {
				isSimilar = true;
				break;
			}
		}
		if (!isSimilar) {
			filteredColors.push(color);
		}
	}

	return filteredColors;
}
