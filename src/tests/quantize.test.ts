import { describe, expect, it } from 'bun:test';
import { dist, kMeans, quantize } from '../lib';

describe('quantize', () => {
	it('filters out fully transparent pixels and returns quantized colors', () => {
		const raw = new Uint8ClampedArray([
			255,
			0,
			0,
			255, // red
			0,
			255,
			0,
			255, // green
			0,
			0,
			255,
			0, // blue but fully transparent, should be skipped
			255,
			0,
			0,
			255, // red again
		]);

		const result = quantize(raw, 2);
		expect(result.length).toBeLessThanOrEqual(2);
		expect(result).toEqual(
			expect.arrayContaining([
				expect.arrayContaining([255, 0, 0]),
				expect.arrayContaining([0, 255, 0]),
			])
		);
	});
});

describe('kMeans', () => {
	it('clusters colors into given number of centroids', () => {
		const pixels = [
			[255, 0, 0],
			[254, 0, 0],
			[0, 255, 0],
			[0, 254, 0],
		];

		const centroids = kMeans(pixels, 2);
		expect(centroids.length).toBe(2);
		for (const centroid of centroids) {
			expect(centroid.length).toBe(3);
		}
	});
});

describe('dist', () => {
	it('calculates correct Euclidean distance', () => {
		expect(dist([0, 0, 0], [255, 255, 255])).toBeCloseTo(441.6729, 3);
		expect(dist([10, 20, 30], [10, 20, 30])).toBe(0);
	});
});
