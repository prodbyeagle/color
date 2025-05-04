Here is the improved version of your `README` with additional sections and more detailed descriptions:

---

# 🦅 @prodbyeagle/color

**@prodbyeagle/color** is a lightweight, framework-agnostic TypeScript library for extracting and formatting dominant colors from images. It supports RGB, HEX, HSL, and OKLCH formats, making it ideal for color palette generation, theming, and creative applications.

---

### ✨ Features

-   🎨 **Color Quantization**: Uses a simple k-means algorithm to group similar colors together, ensuring accurate extraction of the most dominant colors.
-   🧠 **Dominant Color Extraction**: Efficiently extracts the most prominent color clusters from images, ideal for dynamic theming or palette generation.
-   📦 **Flexible Formatting**: Converts extracted colors into `rgb`, `hex`, `hsl`, or `oklch` formats, providing flexibility for various use cases.
-   📁 **Source Flexibility**: Works with `Blob`, `File`, or `Image` sources, enabling easy integration with various input types (e.g., images from user uploads or external sources).
-   🖥️ **TypeScript Support**: Built with TypeScript, ensuring type safety and auto-completion in modern IDEs.
-   ⚡ **Lightweight**: Designed with performance in mind, minimizing overhead for fast execution even with large images.

---

### 🚀 Installation

To install `@prodbyeagle/color` into your project:

#### With Bun (Recommended for performance):

```
bunx jsr add @prodbyeagle/color
```

#### With npm:

```
npm install @prodbyeagle/color
```

#### With yarn:

```
yarn add @prodbyeagle/color
```

---

### 🔧 Usage

#### Extract Dominant Colors

To extract the dominant colors from an image, simply use the `extractColors` function. You can specify the source image, the maximum number of colors to extract, and the desired output format (`rgb`, `hex`, `hsl`, or `oklch`).

```ts
import { extractColors } from '@prodbyeagle/color';

// Example usage with an image file
const imageFile = document.getElementById('image') as HTMLImageElement;

const colors = await extractColors(imageFile, 5, 'hex');
console.log(colors); // Example output: ['#ffcc00', '#003366', '#cccccc']
```

---

### 📚 API Reference

#### `extractColors(imageFile: File | Blob, maxColors: number, format: ColorFormat = 'hex')`

-   **imageFile** (`File | Blob`): The image file or blob source from which colors will be extracted.
-   **maxColors** (`number`): The maximum number of dominant colors to extract (e.g., 5 for a palette of 5 colors).
-   **format** (`ColorFormat`, optional): The format in which to return the colors. Can be `'rgb'`, `'hex'`, `'hsl'`, or `'oklch'` (default is `'hex'`).

**Returns**: A promise that resolves to an array of colors in the specified format.

---

### 🎨 Supported Color Formats

-   **RGB**: An array of red, green, and blue values in the range \[0, 255].

    -   Example: `[255, 204, 0]`

-   **HEX**: A color string in hexadecimal format.

    -   Example: `#ffcc00`

-   **HSL**: A string representing the color in Hue, Saturation, and Lightness format.

    -   Example: `'hsl(45, 100%, 50%)'`

-   **OKLCH**: A string representing the color in the OKLCH color space (lightness, chroma, and hue).

    -   Example: `'oklch(0.532 1.044 40.8deg)'`

---

### 💡 Use Cases

-   **Palette Generation**: Automatically extract the dominant colors from any image to create custom color palettes for your website or application.
-   **Theming**: Dynamically adjust website themes based on the dominant color of uploaded images.
-   **Image Analysis**: Analyze images for their prominent colors, useful in art, design, or even machine learning projects.
-   **Creative Applications**: Ideal for creative tools or apps that need to generate or match colors to images.

---

### 🛠️ Contributing

We welcome contributions! If you'd like to improve this library, please feel free to open an issue or submit a pull request. Here's how you can contribute:

1. Fork the repository.
2. Clone your fork to your local machine.
3. Create a new branch for your feature or bug fix.
4. Make your changes and add tests if necessary.
5. Submit a pull request with a detailed description of your changes.

---

### 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
