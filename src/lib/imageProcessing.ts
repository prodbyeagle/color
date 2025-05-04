/**
 * Converts a `Blob` (such as a `File` or image fetched from a URL) into raw pixel data.
 *
 * This utility loads the image into memory using `createImageBitmap`, renders it to an
 * `OffscreenCanvas`, and extracts the image’s RGBA pixel data via `ImageData`.
 *
 * It supports all common image formats (JPEG, PNG, WebP, etc.) as long as they are browser-decodable.
 *
 * @param file - A `Blob` representing the image. This could come from an `<input type="file">` element or a network response.
 * @returns A `Promise` that resolves to an `ImageData` object containing the raw RGBA pixel data.
 *
 * @throws Will throw an error if the 2D rendering context could not be initialized.
 *
 * @example
 * ```ts
 * const imageData = await getImageDataFromFile(file);
 * const { width, height, data } = imageData;
 * ```
 */
export async function getImageDataFromFile(
	file: Blob,
	maxSize: number = 512
): Promise<ImageData> {
	const bitmap = await createImageBitmap(file);
	const { width, height } = bitmap;

	const scale = Math.min(1, maxSize / Math.max(width, height));
	const targetWidth = Math.round(width * scale);
	const targetHeight = Math.round(height * scale);

	const canvas = new OffscreenCanvas(targetWidth, targetHeight);
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Failed to get 2D context');

	ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
	return ctx.getImageData(0, 0, targetWidth, targetHeight);
}
