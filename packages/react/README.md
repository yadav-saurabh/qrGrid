# @qrgrid/react

<p>
  <a href="https://www.npmjs.com/package/@qrgrid/react"><img src="https://img.shields.io/npm/v/@qrgrid/react" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@qrgrid/react"><img src="https://img.shields.io/npm/dm/@qrgrid/react" alt="npm downloads"></a>
  <a href="https://github.com/yadav-saurabh/qrGrid/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@qrgrid/react" alt="MIT License"></a>
</p>

React components for rendering QR codes. Canvas and SVG, fully typed, with support for custom module styles, colors, gradients, and logo embedding.

Part of [QR Grid](https://github.com/yadav-saurabh/qrgrid).

**[Docs](https://www.qrgrid.dev/guide/packages/react)** · **[Playground](https://www.qrgrid.dev/generate)** · **[Examples](https://www.qrgrid.dev/examples)**

## Install

```bash
npm install @qrgrid/react
```

## Basic usage

### Canvas

```tsx
import { Qr } from "@qrgrid/react/canvas";

<Qr input="Hello World!" />;
```

### SVG

```tsx
import { Qr } from "@qrgrid/react/svg";

<Qr input="Hello World!" />;
```

### Alternative imports

Both components are also available from the root:

```tsx
import { Canvas, Svg } from "@qrgrid/react";

<Canvas.Qr input="Hello World!" />
<Svg.Qr input="Hello World!" />
```

## When to use Canvas vs SVG

**Canvas** gives you raster output. Better for performance with lots of QR codes on a page, and supports gradients and patterns via the `CanvasRenderingContext2D` API.

**SVG** gives you vector output. Scales to any size without pixelation, and lets you color finder patterns and data modules separately using the `color` prop with `{ finder, codeword }`.

## Custom colors

```tsx
// solid colors
<Qr input="Hello World!" bgColor="#F8EDED" color="#173B45" />

// separate finder and data colors (SVG only)
<Qr input="Hello World!" color={{ finder: "#ff3131", codeword: "#173B45" }} />

// gradient (Canvas only)
<Qr
  input="Hello World!"
  color={(ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 400, 400);
    gradient.addColorStop(0, "#e94560");
    gradient.addColorStop(1, "#0f3460");
    return gradient;
  }}
/>
```

## Module styles

Use the built-in styles from `@qrgrid/styles`, or write your own function:

```tsx
import { dotModuleStyle } from "@qrgrid/styles/canvas/styles";
import { smoothModuleStyle } from "@qrgrid/styles/canvas/styles";

<Qr input="Hello World!" moduleStyle={dotModuleStyle} />
<Qr input="Hello World!" moduleStyle={smoothModuleStyle} />
```

A custom `moduleStyle` for Canvas receives the canvas context, the module's position and size, and the QR data:

```tsx
<Qr
  input="Hello World!"
  moduleStyle={(ctx, module, qr) => {
    // module has: index, x, y, size
    // draw whatever you want
    ctx.beginPath();
    ctx.arc(
      module.x + module.size / 2,
      module.y + module.size / 2,
      module.size / 3,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }}
/>
```

## Logo embedding

Place an image in the center of the QR code. Use high error correction (`"H"`) so the code stays scannable.

```tsx
<Qr
  input="Hello World!"
  qrOptions={{ errorCorrection: "H" }}
  image={{ src: "/logo.png", overlap: false, sizePercent: 20 }}
/>
```

Image options:

| Option        | Type      | Default  | Description                                 |
| ------------- | --------- | -------- | ------------------------------------------- |
| `src`         | `string`  | required | Image URL                                   |
| `sizePercent` | `number`  | `15`     | Max image size as percentage of the QR code |
| `opacity`     | `number`  | `1`      | Image opacity (0 to 1)                      |
| `border`      | `boolean` | `false`  | Add a quiet zone border around the image    |
| `overlap`     | `boolean` | `true`   | Whether QR modules render behind the image  |

## Downloading the QR code

Use a ref to access the underlying canvas or SVG element:

```tsx
import { useRef } from "react";
import { Qr } from "@qrgrid/react/canvas";
import { downloadQr } from "@qrgrid/styles/canvas/utils";

function MyQr() {
  const ref = useRef<HTMLCanvasElement>(null);
  return (
    <>
      <Qr input="Hello World!" ref={ref} />
      <button onClick={() => ref.current && downloadQr(ref.current)}>
        Download PNG
      </button>
    </>
  );
}
```

`downloadQr` supports `"png"`, `"jpeg"`, and `"webp"` for Canvas, and `"svg"`, `"png"`, `"jpeg"`, `"webp"` for SVG.

## Callbacks

| Prop           | Signature                                                              | When it fires                                              |
| -------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------- |
| `getQrData`    | `(qr: QR) => void`                                                     | After QR data is encoded, before rendering                 |
| `getCanvasCtx` | `(ctx: CanvasRenderingContext2D) => void`                              | Canvas only. Before drawing, so you can modify the context |
| `onGenerated`  | `(ctx, size, qr) => void` (Canvas) or `(path, size, qr) => void` (SVG) | After all drawing is complete                              |

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
| `watchKey`     | `string \| number`                                              | none                       | Change this to force a re-render   |
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
// from "@qrgrid/react/canvas"
import type {
  QrProps,
  QrColor,
  QrImageOption,
  ModuleStyleFunction,
  ModuleStyleFunctionParams,
} from "@qrgrid/react/canvas";

// from "@qrgrid/react/svg"
import type {
  QrProps,
  QrImageOption,
  ModuleStyleFunction,
  ModuleStyleFunctionParams,
} from "@qrgrid/react/svg";
```

## License

[MIT](https://github.com/yadav-saurabh/qrgrid/blob/main/LICENSE)
