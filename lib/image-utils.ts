/**
 * Converts a Blob (e.g., File or image response) into raw image pixel data.
 *
 * @param file - A Blob representing the image (e.g., from file input or fetch).
 * @returns A Promise resolving to an `ImageData` object containing raw RGBA data.
 *
 * @throws If the canvas 2D context cannot be initialized.
 *
 * @example
 * const data = await getImageDataFromFile(file);
 */
export async function getImageDataFromFile(file: Blob): Promise<ImageData> {
	const bitmap = await createImageBitmap(file);
	const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Failed to get 2D context');

	ctx.drawImage(bitmap, 0, 0);
	return ctx.getImageData(0, 0, bitmap.width, bitmap.height);
}
