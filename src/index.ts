import { getImageDataFromFile } from '@/src/lib/image-utils';
import { quantize } from '@/src/lib/quantize';
import { formatColors } from '@/src/lib/format';

export type ColorFormat = 'rgb' | 'hex' | 'hsl';

export async function extractColors(
	imageFile: File | Blob,
	maxColors: number,
	format: ColorFormat = 'hex'
): Promise<string[] | number[][]> {
	const imageData = await getImageDataFromFile(imageFile);
	const palette = quantize(imageData.data, maxColors);
	const formattedColors = formatColors(palette, format);
	if (format === 'hex' || format === 'rgb' || format === 'hsl') {
		return formattedColors as string[];
	}
	return formattedColors as number[][];
}
