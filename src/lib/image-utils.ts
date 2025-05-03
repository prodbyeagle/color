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
export async function getImageDataFromFile(file: Blob): Promise<ImageData> {
	const bitmap = await createImageBitmap(file);
	const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Failed to get 2D context');

	ctx.drawImage(bitmap, 0, 0);
	return ctx.getImageData(0, 0, bitmap.width, bitmap.height);
}
