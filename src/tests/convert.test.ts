import { describe, expect, it } from 'bun:test';
import { rgbToHex, rgbToHsl } from '../lib/convert';

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
