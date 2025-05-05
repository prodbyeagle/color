import { describe, expect, it } from 'bun:test';
import { rgbToHex, rgbToHsl, rgbToOklch } from '../lib/convert';

describe('rgbToHex', () => {
	it('converts primary colors to hex', () => {
		expect(rgbToHex([255, 0, 0])).toBe('#ff0000');
		expect(rgbToHex([0, 255, 0])).toBe('#00ff00');
		expect(rgbToHex([0, 0, 255])).toBe('#0000ff');
	});

	it('handles black and white', () => {
		expect(rgbToHex([0, 0, 0])).toBe('#000000');
		expect(rgbToHex([255, 255, 255])).toBe('#ffffff');
	});

	it('handles invalid input gracefully', () => {
		expect(rgbToHex([undefined as any, 100, 100])).toBe('#006464');
	});
});

describe('rgbToHsl', () => {
	it('converts yellow RGB to HSL', () => {
		const result = rgbToHsl([255, 204, 0]);
		const hue = parseInt(result.match(/^hsl\((\d+)/)?.[1] ?? '0', 10);
		expect(hue).toBeGreaterThanOrEqual(44);
		expect(hue).toBeLessThanOrEqual(49);
	});

	it('returns expected values for primary colors', () => {
		expect(rgbToHsl([255, 0, 0])).toBe('hsl(0, 100%, 50%)');
		expect(rgbToHsl([0, 255, 0])).toBe('hsl(120, 100%, 50%)');
		expect(rgbToHsl([0, 0, 255])).toBe('hsl(240, 100%, 50%)');
	});

	it('handles black and white', () => {
		expect(rgbToHsl([0, 0, 0])).toBe('hsl(0, 0%, 0%)');
		expect(rgbToHsl([255, 255, 255])).toBe('hsl(0, 0%, 100%)');
	});
});

describe('rgbToOklch', () => {
	it('returns expected format', () => {
		expect(rgbToOklch([255, 0, 0])).toMatch(
			/^oklch\(\d+\.\d{3} \d+\.\d{3} \d+\.\ddeg\)$/
		);
		expect(rgbToOklch([0, 255, 0])).toMatch(
			/^oklch\(\d+\.\d{3} \d+\.\d{3} \d+\.\ddeg\)$/
		);
		expect(rgbToOklch([0, 0, 255])).toMatch(
			/^oklch\(\d+\.\d{3} \d+\.\d{3} \d+\.\ddeg\)$/
		);
	});

	it('handles black and white', () => {
		expect(rgbToOklch([0, 0, 0])).toMatch(
			/^oklch\(0\.000 0\.000 \d+\.\ddeg\)$/
		);
		expect(rgbToOklch([255, 255, 255])).toMatch(
			/^oklch\(1\.000 0\.000 \d+\.\ddeg\)$/
		);
	});

	const parseOklch = (str: string): [number, number, number] => {
		const match = str.match(/^oklch\(([\d.]+) ([\d.]+) ([\d.]+)deg\)$/);
		expect(match).not.toBeNull();
		return match!.slice(1).map(Number) as [number, number, number];
	};

	it('returns expected values for known colors', () => {
		let [l, c, h] = parseOklch(rgbToOklch([255, 0, 0])); // Red
		expect(l).toBeCloseTo(0.627, 2);
		expect(c).toBeCloseTo(0.257, 2);
		expect(h).toBeCloseTo(29.2, 1);

		[l, c, h] = parseOklch(rgbToOklch([0, 255, 0])); // **Green**
		expect(l).toBeCloseTo(0.866, 2);
		expect(c).toBeCloseTo(0.297, 2);
		expect(h).toBeCloseTo(142.5, 1);

		[l, c, h] = parseOklch(rgbToOklch([0, 0, 255])); // Blue
		expect(l).toBeCloseTo(0.452, 2);
		expect(c).toBeCloseTo(0.313, 2);
		expect(h).toBeCloseTo(264.1, 1);

		[l, c, h] = parseOklch(rgbToOklch([255, 255, 0])); // Yellow
		expect(l).toBeCloseTo(0.967, 2);
		expect(c).toBeCloseTo(0.211, 2);
		expect(h).toBeCloseTo(109.8, 1);

		[l, c, h] = parseOklch(rgbToOklch([255, 102, 147])); // Pink
		expect(l).toBeCloseTo(0.715, 2);
		expect(c).toBeCloseTo(0.189, 2);
		expect(h).toBeCloseTo(5, 1);
	});

	it('rounds to 3 decimal places and 1 for hue', () => {
		const value = rgbToOklch([123, 45, 210]);
		expect(value).toMatch(/^oklch\(\d+\.\d{3} \d+\.\d{3} \d+\.\ddeg\)$/);
	});
});
