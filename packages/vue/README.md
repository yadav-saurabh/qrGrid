# @qrgrid/vue

<p>
  <a href="https://www.npmjs.com/package/@qrgrid/vue"><img src="https://img.shields.io/npm/v/@qrgrid/vue" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@qrgrid/vue"><img src="https://img.shields.io/npm/dm/@qrgrid/vue" alt="npm downloads"></a>
  <a href="https://github.com/yadav-saurabh/qrGrid/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@qrgrid/vue" alt="MIT License"></a>
</p>

Vue 3 components for rendering QR codes. Canvas and SVG, written with the Composition API, fully typed, with support for custom module styles, colors, gradients, and logo embedding.

Part of [QR Grid](https://github.com/yadav-saurabh/qrgrid).

**[Docs](https://www.qrgrid.dev/guide/packages/vue)** · **[Playground](https://www.qrgrid.dev/generate)** · **[Examples](https://www.qrgrid.dev/examples)**

## Install

```bash
npm install @qrgrid/vue
```

## Basic usage

### Canvas

```vue
<script setup>
import { Qr } from "@qrgrid/vue/canvas";
</script>

<template>
  <Qr input="Hello World!" />
</template>
```

### SVG

```vue
<script setup>
import { Qr } from "@qrgrid/vue/svg";
</script>

<template>
  <Qr input="Hello World!" />
</template>
```

### Alternative imports

```vue
<script setup>
import { Canvas, Svg } from "@qrgrid/vue";
</script>

<template>
  <Canvas input="Hello World!" />
  <Svg input="Hello World!" />
</template>
```

## When to use Canvas vs SVG

**Canvas** gives you raster output. Supports gradients and patterns through the `CanvasRenderingContext2D` API. Good for performance when rendering many QR codes.

**SVG** gives you vector output. Scales cleanly to any size, and lets you color finder patterns and data modules separately with `{ finder, codeword }`.

## Custom colors

```vue
<!-- solid colors -->
<Qr input="Hello World!" bgColor="#F8EDED" color="#173B45" />

<!-- separate finder and data colors (SVG only) -->
<Qr input="Hello World!" :color="{ finder: '#ff3131', codeword: '#173B45' }" />
```

For Canvas gradients, pass a function:

```vue
<script setup>
import { Qr } from "@qrgrid/vue/canvas";

function gradientColor(ctx) {
  const gradient = ctx.createLinearGradient(0, 0, 400, 400);
  gradient.addColorStop(0, "#e94560");
  gradient.addColorStop(1, "#0f3460");
  return gradient;
}
</script>

<template>
  <Qr input="Hello World!" :color="gradientColor" />
</template>
```

## Module styles

```vue
<script setup>
import { Qr } from "@qrgrid/vue/canvas";
import { dotModuleStyle } from "@qrgrid/styles/canvas/styles";
import { smoothModuleStyle } from "@qrgrid/styles/canvas/styles";
</script>

<template>
  <Qr input="Hello World!" :moduleStyle="dotModuleStyle" />
  <Qr input="Hello World!" :moduleStyle="smoothModuleStyle" />
</template>
```

You can also write your own `moduleStyle` function. For Canvas, it receives `(ctx, module, qr)`. For SVG, it receives `(path, module, qr)` where `path` is `{ codeword: string, finder: string }` and you append SVG path data to it.

## Logo embedding

```vue
<Qr
  input="Hello World!"
  :qrOptions="{ errorCorrection: 'H' }"
  :image="{ src: '/logo.png', overlap: false, sizePercent: 20 }"
/>
```

Use high error correction when embedding a logo so the code stays scannable.

| Option        | Type      | Default  | Description                                 |
| ------------- | --------- | -------- | ------------------------------------------- |
| `src`         | `string`  | required | Image URL                                   |
| `sizePercent` | `number`  | `15`     | Max image size as percentage of the QR code |
| `opacity`     | `number`  | `1`      | Image opacity (0 to 1)                      |
| `border`      | `boolean` | `false`  | Quiet zone border around the image          |
| `overlap`     | `boolean` | `true`   | Whether QR modules render behind the image  |

## Accessing the element

The component exposes the underlying element through `defineExpose`:

```vue
<script setup>
import { ref } from "vue";
import { Qr } from "@qrgrid/vue/canvas";
import { downloadQr } from "@qrgrid/styles/canvas/utils";

const qrRef = ref(null);

function download() {
  if (qrRef.value?.canvasRef) {
    downloadQr(qrRef.value.canvasRef);
  }
}
</script>

<template>
  <Qr input="Hello World!" ref="qrRef" />
  <button @click="download">Download PNG</button>
</template>
```

The Canvas component exposes `canvasRef` (an `HTMLCanvasElement`). The SVG component exposes `svgRef` (an `SVGSVGElement`).

## All props

### Canvas `<Qr>` props

| Prop           | Type                                                            | Default                    | Description                        |
| -------------- | --------------------------------------------------------------- | -------------------------- | ---------------------------------- |
| `input`        | `string`                                                        | required                   | Data to encode                     |
| `size`         | `number`                                                        | `400`                      | Canvas size in pixels              |
| `qrOptions`    | `{ errorCorrection?: "L"\|"M"\|"Q"\|"H" }`                      | `{ errorCorrection: "M" }` | QR encoding options                |
| `bgColor`      | `string \| CanvasGradient \| CanvasPattern \| (ctx) => QrColor` | `"black"`                  | Background color                   |
| `color`        | `string \| CanvasGradient \| CanvasPattern \| (ctx) => QrColor` | `"white"`                  | Module color                       |
| `moduleStyle`  | `(ctx, module, qr) => void`                                     | square fill                | Custom drawing function per module |
| `image`        | `QrImageOption`                                                 | none                       | Center logo/image                  |
| `watchKey`     | `string \| number`                                              | none                       | Force re-render                    |
| `getQrData`    | `(qr: QR) => void`                                              | none                       | Callback after encoding            |
| `getCanvasCtx` | `(ctx) => void`                                                 | none                       | Callback with canvas context       |
| `onGenerated`  | `(ctx, size, qr) => void`                                       | none                       | Callback after drawing             |

### SVG `<Qr>` props

| Prop          | Type                                               | Default                    | Description                       |
| ------------- | -------------------------------------------------- | -------------------------- | --------------------------------- |
| `input`       | `string`                                           | required                   | Data to encode                    |
| `size`        | `number`                                           | `400`                      | SVG size in pixels                |
| `qrOptions`   | `{ errorCorrection?: "L"\|"M"\|"Q"\|"H" }`         | `{ errorCorrection: "M" }` | QR encoding options               |
| `bgColor`     | `string`                                           | `"black"`                  | Background color                  |
| `color`       | `string \| { finder?: string, codeword?: string }` | `"white"`                  | Module color(s)                   |
| `moduleStyle` | `(path, module, qr) => void`                       | square path                | Custom path generation per module |
| `image`       | `QrImageOption`                                    | none                       | Center logo/image                 |
| `watchKey`    | `string \| number`                                 | none                       | Force re-render                   |
| `getQrData`   | `(qr: QR) => void`                                 | none                       | Callback after encoding           |
| `onGenerated` | `(path, size, qr) => void`                         | none                       | Callback after path generation    |

## Exported types

```typescript
// from "@qrgrid/vue/canvas"
import type {
  QrProps,
  QrColor,
  QrImageOption,
  ModuleStyleFunction,
  ModuleStyleFunctionParams,
} from "@qrgrid/vue/canvas";

// from "@qrgrid/vue/svg"
import type {
  QrProps,
  QrImageOption,
  ModuleStyleFunction,
  ModuleStyleFunctionParams,
} from "@qrgrid/vue/svg";
```

## License

[MIT](https://github.com/yadav-saurabh/qrgrid/blob/main/LICENSE)
