---
title: Server
outline: deep
---

# Angular

Implementation of the Qr grid library for Angular applications.

## Installation

::: code-group

```sh [npm]
npm install @qrgrid/angular
```

```sh [bun]
bun add @qrgrid/angular
```

```sh [pnpm]
pnpm install @qrgrid/angular
```

```sh [yarn]
yarn add @qrgrid/angular
```

:::

## Using Canvas

```typescript
import { CanvasQr } from "@qrgrid/angular";

<qr input="Hello World!"/>
```

### Props and Events

| Prop        | Type                                                        | Description    | Default               |
| ----------- | ----------------------------------------------------------- | -------------- | --------------------- |
| input       | string                                                      | Data to encode |                       |
| qrOptions?  | [QrOptions](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/core/src/qr.ts#L47-L49) | Options for QR encoding |     |
| image?      | [QrImageOption](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/angular/src/canvas/qr.component.ts#L35-L41) | Image options for the image in QR code | sizePercent: `15`,   opacity: `1`,  overlap: `true`,   border: `false`  |
| size?        | number                                                      | Canvas size |  400   |
| bgColor?     | [QrColor](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/angular/src/canvas/qr.component.ts#L30) \| ((ctx: CanvasRenderingContext2D) => [QrColor]((https://github.com/yadav-saurabh/qrGrid/blob/main/packages/angular/src/canvas/qr.component.ts#L30)))     | Background color | black   |
| color?       | [QrColor](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/angular/src/canvas/qr.component.ts#L30) \| ((ctx: CanvasRenderingContext2D) => [QrColor]((https://github.com/yadav-saurabh/qrGrid/blob/main/packages/angular/src/canvas/qr.component.ts#L30)))     | QR code color |  white   |
| moduleStyle?        | [ModuleStyleFunction](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/angular/src/canvas/qr.component.ts#L16-L20)               | Custom styles for QR modules |    |

| Events        | Event Type                                                  | Description     | Default               |
| ------------- | ----------------------------------------------------------- | --------------- | --------------------- |
| onQrDataEncoded? | (qr: [QR](./core#properties)) => void;               | Emitted once sata is encoded |     |
| onQrRendered?    | (ctx: CanvasRenderingContext2D, size: number, qr: [QR](./core#properties)) => void;               | Emitted once QR code is generated |     |

[see in code.](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/angular/src/canvas/qr.component.ts)

## Using Svg

```typescript
import { SvgQr } from "@qrgrid/angular";

<qr input="Hello World!"/>
```

### Props

| Prop        | Type                                                        | Description    | Default               |
| ----------- | ----------------------------------------------------------- | -------------- | --------------------- |
| input       | string                                                      | Data to encode |                       |
| qrOptions?  | [QrOptions](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/core/src/qr.ts#L47-L49) | Qr Options for QR encoding |     |
| image?      | [QrImageOption](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/angular/src/svg/qr.component.ts#L25-L31) | Image options for image in the QR code | sizePercent: `15`,   opacity: `1`,  overlap: `true`,   border: `false`  |
| size?        | number                                                      | SVG size |  400   |
| bgColor?     | string                                                      | Background color | black   |
| color?       | string \| \{ codeword?: string; finder?: string \}  | QR code color            |  white   |
| moduleStyle? | [ModuleStyleFunction](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/angular/src/svg/qr.component.ts#L14-L18)               | Custom styles for QR modules |    |

| Events        | Event Type                                                  | Description     | Default               |
| ------------- | ----------------------------------------------------------- | --------------- | --------------------- |
| onQrDataEncoded? | (qr: [QR](./core#properties)) => void;               | Emitted once sata is encoded |     |
| onQrRendered?    | (ctx: CanvasRenderingContext2D, size: number, qr: [QR](./core#properties)) => void;               | Emitted once QR code is generated |     |

[see in code.](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/angular/src/svg/qr.component.ts)

## Examples

Explore [Styles](./styles) for custom styling and other utilities

- Basic

  ```typescript
  <qr input="Hello World!" />
  ```

- ErrorCorrection

  ```typescript
  <qr input="Hello World!" [qrOptions]="{errorCorrection: 'H'}" />
  ```

- Color

  ```typescript
  <qr input="Hello World!" bgColor="#F8EDED" color="#173B45" />
  ```

- Module Style from [@qrgrid/styles](https://www.npmjs.com/package/@qrgrid/styles)

  ```typescript
  import { dotModuleStyle } from "@qrgrid/styles/canvas/styles";
  
  <qr input="Hello World!" [moduleStyle]={dotModuleStyle} />
  ```

  ```typescript
  import { smoothModuleStyle } from "@qrgrid/styles/canvas/styles";
  
  <qr input="Hello World!" [moduleStyle]={smoothModuleStyle} />
  ```

- Images

  ```typescript
  <qr input="Hello World!" [image]="{ src: ''./vite.svg' }" />
  ```

  ```typescript
  <qr input="Hello World!" [image]="{ src: './vite.svg', overlap: false }" />
  ```

- Downloading using [@qrgrid/styles](https://www.npmjs.com/package/@qrgrid/styles)

  :::code-group

  ```typescript [Canvas]
  import { CanvasQr } from "@qrgrid/angular";
  import { downloadQr } from "@qrgrid/styles/canvas/utils";

  // inside class component
  @ViewChild(CanvasQr) canvasQr!: CanvasQr;

  download() {
    if (this.canvasQr?.canvas?.nativeElement) {
      downloadQr(this.canvasQr.canvas.nativeElement);
    }
  }
  ```

  ```typescript [Svg]
  import { SvgQr } from "@qrgrid/angular";
  import { downloadQr} from "@qrgrid/styles/svg/utils";

  // inside class component
  @ViewChild(SvgQr) svgQr!: SvgQr;

  download() {
    if (this.svgQr?.svg?.nativeElement) {
      downloadQr(this.svgQr.svg.nativeElement);
    }
  }
  ```

  :::

For more examples and customization options, [see the examples.](https://github.com/yadav-saurabh/qrGrid/tree/main/examples/angular/)
