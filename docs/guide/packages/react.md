---
title: React
outline: deep
---

# React

Implementation of the Qr grid library for React applications.

## Installation

::: code-group

```sh [npm]
npm install @qrgrid/react
```

```sh [bun]
bun add @qrgrid/react
```

```sh [pnpm]
pnpm install @qrgrid/react
```

```sh [yarn]
yarn add @qrgrid/react
```

:::

## Using Canvas

```tsx
import { Qr } from "@qrgrid/react/canvas";

<Qr input="Hello World!"/>
```

OR

```tsx
import { Canvas } from "@qrgrid/react";

<Canvas.Qr input="Hello World!"/>
```

### Props

| Prop        | Type                                                        | Description    | Default               |
| ----------- | ----------------------------------------------------------- | -------------- | --------------------- |
| input       | string                                                      | Data to encode |                       |
| qrOptions?  | [QrOptions](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/core/src/qr.ts#L47-L49) | Options for QR encoding |     |
| image?      | [QrImageOption](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/react/src/canvas/types.ts#L29-L33) | Image options for the image in QR code | sizePercent: `20` <br> opacity: `1`  |
| size?        | number                                                      | Canvas size |  400   |
| bgColor?     | [QrColor](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/react/src/canvas/types.ts#L24) \| ((ctx: CanvasRenderingContext2D) => [QrColor]((https://github.com/yadav-saurabh/qrGrid/blob/main/packages/react/src/canvas/types.ts#L24)))     | Background color | black   |
| color?       | [QrColor](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/react/src/canvas/types.ts#L24) \| ((ctx: CanvasRenderingContext2D) => [QrColor]((https://github.com/yadav-saurabh/qrGrid/blob/main/packages/react/src/canvas/types.ts#L24)))     | QR code color |  white   |
| moduleStyle?        | [ModuleStyleFunction](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/react/src/canvas/types.ts#L10-L14)               | Custom styles for QR modules |    |
| getQrData?        | (qr: [QR](./core#properties)) => void;               | Retrieve QR data |     |
| getCanvasCtx?        | (ctx: CanvasRenderingContext2D) => void;               | Retrieve canvas context |     |
| onGenerated?        | (ctx: CanvasRenderingContext2D, size: number, qr: [QR](./core#properties)) => void;               | Callback once QR code is generated |     |

[see the props in code.](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/react/src/canvas/types.ts#L38-L49)

## Using Svg

```tsx
import { Svg } from "@qrgrid/react";

<Svg.Qr input="Hello World!"/>
```

OR

```tsx
import { Qr } from "@qrgrid/react/svg";

<Qr input="Hello World!"/>
```

### Props

| Prop        | Type                                                        | Description    | Default               |
| ----------- | ----------------------------------------------------------- | -------------- | --------------------- |
| input       | string                                                      | Data to encode |                       |
| qrOptions?  | [QrOptions](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/core/src/qr.ts#L47-L49) | Qr Options for QR encoding |     |
| image?      | [QrImageOption](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/react/src/svg/types.ts#L21-L25) | Image options for image in the QR code | sizePercent: `20` <br> opacity: `1`  |
| size?        | number                                                      | SVG size |  400   |
| bgColor?     | string                                                      | Background color | black   |
| color?       | string \| \{ codeword?: string; finder?: string \}  | QR code color            |  white   |
| moduleStyle? | [ModuleStyleFunction](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/react/src/svg/types.ts#L10-L14)               | Custom styles for QR modules |    |
| getQrData?    | (qr: [QR](./core#properties)) => void;               | get Qr data |     |
| onGenerated?  | (path: ModuleStyleFunctionParams[0], size: number, qr: [QR](./core#properties))  => void; | Callback once QR code is generated |     |

[see the props in code.](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/react/src/svg/types.ts#L30-L44)

## Examples

Explore [Styles](./styles) for custom styling and other utilities

- Basic

  ```tsx
  <Qr input="Hello World!" />
  ```

- ErrorCorrection

  ```tsx
  <Qr input="Hello World!" qrOptions={{errorCorrection: 'H'}} />
  ```

- Color

  ```tsx
  <Qr input="Hello World!" bgColor="#F8EDED" color="#173B45" />
  ```

- Module Style from [@qrgrid/styles](https://www.npmjs.com/package/@qrgrid/styles)

  ```tsx
  import { dotModuleStyle } from "@qrgrid/styles/canvas/styles";
  
  <Qr input="Hello World!" moduleStyle={dotModuleStyle} />
  ```

  ```tsx
  import { smoothModuleStyle } from "@qrgrid/styles/canvas/styles";
  
  <Qr input="Hello World!" moduleStyle={smoothModuleStyle} />
  ```

- Images

  ```tsx
  <Qr input="Hello World!" image={{ src: "./vite.svg" }} />
  ```

- Downloading using [@qrgrid/styles](https://www.npmjs.com/package/@qrgrid/styles)

  :::code-group

  ```tsx [Canvas]
  import { Qr } from "@qrgrid/react/canvas";
  import { downloadQr } from "@qrgrid/styles/canvas/utils";

  const qrRef = useRef<HTMLCanvasElement | null>(null);

  const download = () => {
    if (qrRef.current) {
      downloadQr(qrRef.current);
    }
  };
  
  <Qr input="Hello World!" ref={qrRef} />
  ```

  ```tsx [Svg]
  import { Qr } from "@qrgrid/react/svg";
  import { downloadQr} from "@qrgrid/styles/svg/utils";

  const qrRef = useRef<SVGSVGElement | null>(null);

  const download = () => {
    if (qrRef.current) {
      downloadQr(qrRef.current);
    }
  };
  
  <Qr input="Hello World!" ref={qrRef} />
  ```

  :::

For more examples and customization options, [see the examples.](https://github.com/yadav-saurabh/qrGrid/tree/main/examples/react/)
