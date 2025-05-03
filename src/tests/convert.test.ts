import { expect, test } from 'bun:test';
import { rgbToHex, rgbToHsl } from '../lib/convert';

test('rgbToHex converts RGB to HEX', () => {
	expect(rgbToHex([255, 0, 0])).toBe('#ff0000');
	expect(rgbToHex([0, 255, 0])).toBe('#00ff00');
	expect(rgbToHex([0, 0, 255])).toBe('#0000ff');
});

test('rgbToHsl converts RGB to HSL', () => {
	expect(rgbToHsl([255, 0, 0])).toBe('hsl(0, 100%, 50%)');
	expect(rgbToHsl([0, 255, 0])).toBe('hsl(120, 100%, 50%)');
	expect(rgbToHsl([0, 0, 255])).toBe('hsl(240, 100%, 50%)');
});
