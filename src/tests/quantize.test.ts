import { quantize } from '@/src/lib/quantize';
import { expect, test } from 'bun:test';

test('quantize returns correct number of colors', () => {
	const imageData = new Uint8ClampedArray([
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
		255, // blue
		255,
		0,
		0,
		255, // red
	]);

	const result = quantize(imageData, 2);
	expect(result.length).toBe(2);
	for (const color of result) {
		expect(color).toHaveLength(3);
		for (const c of color) {
			expect(typeof c).toBe('number');
			expect(c).toBeGreaterThanOrEqual(0);
			expect(c).toBeLessThanOrEqual(255);
		}
	}
});
