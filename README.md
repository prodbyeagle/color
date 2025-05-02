# 🦅 @prodbyeagle/color ⚠️ WORK IN PROGRESS

**@prodbyeagle/color** is a lightweight, framework-agnostic TypeScript library for extracting and formatting dominant colors from images. It supports RGB, HEX, and HSL formats, making it ideal for color palette generation, theming, and creative applications.

---

## ✨ Features

-   🎨 Quantizes colors using a simple k-means algorithm
-   🧠 Extracts dominant color clusters from images
-   📦 Formats to `rgb`, `hex`, or `hsl`
-   📁 Works with `Blob`, `File`, or `Image` sources
-   💡 Written in modern TypeScript
-   🛠 Zero dependencies

---

## 🚀 Installation

```
bun add @prodbyeagle/color
```

Or with npm:

```
npm install @prodbyeagle/color
```

---

## 🧪 Usage

```ts
import { getImageDataFromFile, quantize, formatColors } from 'eaglecolor';

const file = /* some Blob or File (e.g. from input) */;
const imageData = await getImageDataFromFile(file);
const rawColors = quantize(imageData.data, 5); // top 5 dominant colors
const hexColors = formatColors(rawColors, 'hex');

console.log(hexColors); // ['#aabbcc', '#ff2211', ...]
```

---

## 📚 API

### `getImageDataFromFile(file: Blob): Promise<ImageData>`

Converts an image file (or any blob) into raw `ImageData` (RGBA pixel array).

---

### `quantize(data: Uint8ClampedArray, maxColors: number): number[][]`

Extracts `maxColors` dominant `[r, g, b]` values from the image using a naive k-means clustering algorithm.

---

### `formatColors(colors: number[][], format: 'rgb' | 'hex' | 'hsl')`

Formats raw `[r, g, b]` arrays into the desired color string format.

---

## 🧪 Testing

```bash
bun test
```

Tests live under `tests/`. Written using Bun's test runner.

---

## 🛠 Build

```bash
bun build:bun // bun build:node
```

This will emit the compiled ESM output to `dist/` (via `tsconfig.json` settings).

## 🧼 License

MIT – use freely in personal or commercial work.
