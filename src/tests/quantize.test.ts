import { describe, expect, it } from 'bun:test';
import { quantize, kMeans } from '../lib/quantization';
import { dist } from '../lib/utils';
import type { RGBA, RGB, PixelData } from '../types';

function createImageData(colors: RGBA[]): PixelData {
	return new Uint8ClampedArray(colors.flat());
}

describe('quantize', () => {
	it('filters out fully transparent pixels and returns quantized colors', () => {
		const raw = createImageData([
			[255, 0, 0, 255],
			[0, 255, 0, 255],
			[0, 0, 255, 0], // transparent
			[255, 0, 0, 255],
		]);

		const result = quantize(raw, 2, 5);
		expect(result.length).toBeLessThanOrEqual(2);
		expect(result).toEqual(
			expect.arrayContaining<RGB>([
				expect.arrayContaining([255, 0, 0]),
				expect.arrayContaining([0, 255, 0]),
			])
		);
	});

	it('returns empty array if all pixels are transparent', () => {
		const raw = createImageData([
			[100, 100, 100, 0],
			[200, 200, 200, 10],
		]);
		const result = quantize(raw, 5);
		expect(result).toEqual([]);
	});

	it('returns one color when only one visible pixel', () => {
		const raw = createImageData([[123, 45, 67, 255]]);
		const result = quantize(raw, 3);
		expect(result.length).toBe(1);
		expect(result[0]).toEqual([123, 45, 67]);
	});

	it('handles more clusters than available unique pixels', () => {
		const raw = createImageData([
			[255, 255, 0, 255],
			[255, 255, 0, 255],
		]);
		const result = quantize(raw, 10);
		expect(result.length).toBeLessThanOrEqual(2);
	});
});

describe('quantize (performance)', () => {
	it('handles large input efficiently under MAX_SAMPLE_SIZE', () => {
		const pixel: RGBA = [100, 150, 200, 255];
		const raw = new Uint8ClampedArray(Array(4000).fill(pixel).flat());

		const start = performance.now();
		const result = quantize(raw, 5);
		const end = performance.now();

		expect(result.length).toBeLessThanOrEqual(5);
		expect(end - start).toBeLessThan(100);
	});
});

describe('kMeans', () => {
	it('clusters into the requested number of centroids', () => {
		const pixels: RGB[] = [
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

	it('returns empty array for empty input', () => {
		const result = kMeans([], 5);
		expect(result).toEqual([]);
	});

	it('handles more clusters than data', () => {
		const pixels: RGB[] = [
			[10, 10, 10],
			[20, 20, 20],
		];
		const result = kMeans(pixels, 5);
		expect(result.length).toBeLessThanOrEqual(2);
	});
});

describe('dist', () => {
	it('calculates correct Euclidean distance', () => {
		expect(dist([0, 0, 0], [255, 255, 255])).toBeCloseTo(441.6729, 3);
		expect(dist([10, 20, 30], [10, 20, 30])).toBe(0);
	});
});
