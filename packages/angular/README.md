# @qrgrid/angular

<p>
  <a href="https://www.npmjs.com/package/@qrgrid/angular"><img src="https://img.shields.io/npm/v/@qrgrid/angular" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@qrgrid/angular"><img src="https://img.shields.io/npm/dm/@qrgrid/angular" alt="npm downloads"></a>
  <a href="https://github.com/yadav-saurabh/qrGrid/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@qrgrid/angular" alt="MIT License"></a>
</p>

Angular standalone components for rendering QR codes. Canvas and SVG, fully typed, with support for custom module styles, colors, and logo embedding.

Part of [QR Grid](https://github.com/yadav-saurabh/qrgrid).

**[Docs](https://www.qrgrid.dev/guide/packages/angular)** · **[Playground](https://www.qrgrid.dev/generate)** · **[Examples](https://www.qrgrid.dev/examples)**

## Install

```bash
npm install @qrgrid/angular
```

## Basic usage

### Canvas

```typescript
import { CanvasQr } from "@qrgrid/angular";

@Component({
  imports: [CanvasQr],
  template: `<qr input="Hello World!" />`,
})
export class MyComponent {}
```

### SVG

```typescript
import { SvgQr } from "@qrgrid/angular";

@Component({
  imports: [SvgQr],
  template: `<qr input="Hello World!" />`,
})
export class MyComponent {}
```

Both are standalone components, so you import them directly without adding them to a module.

## When to use Canvas vs SVG

**Canvas** gives you raster output. Supports gradients and patterns. Good for performance with many QR codes on the page.

**SVG** gives you vector output. Scales to any size without pixelation. Lets you color finder patterns and data modules separately.

## Custom colors

```html
<!-- solid colors -->
<qr input="Hello World!" bgColor="#F8EDED" color="#173B45" />

<!-- separate finder and data colors (SVG only) -->
<qr input="Hello World!" [color]="{ finder: '#ff3131', codeword: '#173B45' }" />
```

For Canvas gradients, pass a function via the `color` input:

```typescript
@Component({
  imports: [CanvasQr],
  template: `<qr input="Hello World!" [color]="gradientColor" />`,
})
export class MyComponent {
  gradientColor = (ctx: CanvasRenderingContext2D) => {
    const gradient = ctx.createLinearGradient(0, 0, 400, 400);
    gradient.addColorStop(0, "#e94560");
    gradient.addColorStop(1, "#0f3460");
    return gradient;
  };
}
```

## Module styles

```typescript
import { CanvasQr } from "@qrgrid/angular";
import { dotModuleStyle } from "@qrgrid/styles/canvas/styles";

@Component({
  imports: [CanvasQr],
  template: `<qr input="Hello World!" [moduleStyle]="moduleStyle" />`,
})
export class MyComponent {
  moduleStyle = dotModuleStyle;
}
```

You can write your own `moduleStyle` function. For Canvas, it receives `(ctx, module, qr)`. For SVG, it receives `(path, module, qr)` where `path` is `{ codeword: string, finder: string }`.

## Logo embedding

```html
<qr
  input="Hello World!"
  [qrOptions]="{ errorCorrection: 'H' }"
  [image]="{ src: '/logo.png', overlap: false, sizePercent: 20 }"
/>
```

Use high error correction when embedding logos.

| Option        | Type      | Default  | Description                                 |
| ------------- | --------- | -------- | ------------------------------------------- |
| `src`         | `string`  | required | Image URL                                   |
| `sizePercent` | `number`  | `15`     | Max image size as percentage of the QR code |
| `opacity`     | `number`  | `1`      | Image opacity (0 to 1)                      |
| `border`      | `boolean` | `false`  | Quiet zone border around the image          |
| `overlap`     | `boolean` | `true`   | Whether QR modules render behind the image  |

## Events

The component emits `onQrDataEncoded` after the QR data is generated:

```typescript
@Component({
  imports: [CanvasQr],
  template: `<qr input="Hello World!" (onQrDataEncoded)="onEncoded($event)" />`,
})
export class MyComponent {
  onEncoded(qr: QR) {
    console.log("Version:", qr.version);
    console.log("Grid size:", qr.gridSize);
  }
}
```

For post-render access, use the `generated` input (called after all drawing is complete):

```typescript
@Component({
  imports: [CanvasQr],
  template: `<qr input="Hello World!" [generated]="onGenerated" />`,
})
export class MyComponent {
  onGenerated = (ctx: CanvasRenderingContext2D, size: number, qr: QR) => {
    // do something after the QR code is drawn
  };
}
```

## Accessing the element

Use `@ViewChild` to get the component, which holds a reference to the underlying canvas or SVG element:

```typescript
@Component({
  imports: [CanvasQr],
  template: `<qr input="Hello World!" />`,
})
export class MyComponent {
  @ViewChild(CanvasQr) qrComponent!: CanvasQr;

  download() {
    const canvas = this.qrComponent.canvas.nativeElement;
    // use downloadQr from @qrgrid/styles/canvas/utils
  }
}
```

## All inputs

### Canvas `<qr>` inputs

| Input         | Type                                                            | Default                    | Description                        |
| ------------- | --------------------------------------------------------------- | -------------------------- | ---------------------------------- |
| `input`       | `string`                                                        | required                   | Data to encode                     |
| `size`        | `number`                                                        | `400`                      | Canvas size in pixels              |
| `qrOptions`   | `{ errorCorrection?: "L"\|"M"\|"Q"\|"H" }`                      | `{ errorCorrection: "M" }` | QR encoding options                |
| `bgColor`     | `string \| CanvasGradient \| CanvasPattern \| (ctx) => QrColor` | `"black"`                  | Background color                   |
| `color`       | `string \| CanvasGradient \| CanvasPattern \| (ctx) => QrColor` | `"white"`                  | Module color                       |
| `moduleStyle` | `(ctx, module, qr) => void`                                     | square fill                | Custom drawing function per module |
| `image`       | `QrImageOption`                                                 | none                       | Center logo/image                  |
| `generated`   | `(ctx, size, qr) => void`                                       | none                       | Called after rendering is complete |

### SVG `<qr>` inputs

| Input         | Type                                               | Default                    | Description                       |
| ------------- | -------------------------------------------------- | -------------------------- | --------------------------------- |
| `input`       | `string`                                           | required                   | Data to encode                    |
| `size`        | `number`                                           | `400`                      | SVG size in pixels                |
| `qrOptions`   | `{ errorCorrection?: "L"\|"M"\|"Q"\|"H" }`         | `{ errorCorrection: "M" }` | QR encoding options               |
| `bgColor`     | `string`                                           | `"black"`                  | Background color                  |
| `color`       | `string \| { finder?: string, codeword?: string }` | `"white"`                  | Module color(s)                   |
| `moduleStyle` | `(path, module, qr) => void`                       | square path                | Custom path generation per module |
| `image`       | `QrImageOption`                                    | none                       | Center logo/image                 |
| `generated`   | `(path, size, qr) => void`                         | none                       | Called after path generation      |

### Output events (both Canvas and SVG)

| Output            | Type               | Description                    |
| ----------------- | ------------------ | ------------------------------ |
| `onQrDataEncoded` | `EventEmitter<QR>` | Fires after QR data is encoded |

## Exported types

```typescript
import type { CanvasQr, SvgQr } from "@qrgrid/angular";

// Canvas types
import type {
  ModuleStyleFunction,
  GeneratedFunction,
  QrColor,
  QrImageOption,
} from "@qrgrid/angular";

// SVG types (same names, different signatures for ModuleStyleFunction and GeneratedFunction)
```

## License

[MIT](https://github.com/yadav-saurabh/qrgrid/blob/main/LICENSE)
