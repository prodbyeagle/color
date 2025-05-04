import { filterSimilarColors, dist } from './utils';

const MAX_SAMPLE_SIZE = 2000;
const MAX_ITERATIONS = 10;
const ALPHA_THRESHOLD = 16;

function distSq(a: number[], b: number[]): number {
	if (!a || !b) return Infinity;
	let sum = 0;
	for (let i = 0; i < 3; i++) {
		const d = (a[i] ?? 0) - (b[i] ?? 0);
		sum += d * d;
	}
	return sum;
}

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

export function quantize(
	data: Uint8ClampedArray,
	maxColors: number,
	distanceThreshold = 10
): number[][] {
	const pixels: number[][] = [];

	for (let i = 0; i <= data.length - 4; i += 4) {
		const r = data[i];
		const g = data[i + 1];
		const b = data[i + 2];
		const a = data[i + 3]!;

		if (a < ALPHA_THRESHOLD) continue;
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

export function kMeans(pixels: number[][], k: number): number[][] {
	if (pixels.length === 0) return [];

	let centroids: number[][] = pixels.slice(0, k).map((p) => [...p]);
	let clusters: number[][][] = Array.from({ length: k }, () => []);

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
