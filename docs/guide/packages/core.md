---
title: Web
outline: deep
---

# Core

The core package is the foundation for encoding QR codes, used across all QR Grid packages. For complete customization and control over QR code generation, using this core package directly is recommended.

## Installation

Official packages are available for certain libraries and frameworks. For others, the core package can be used directly, allowing full customization of QR codes for advanced use cases.

::: code-group

```sh [npm]
npm install @qrgrid/core
```

```sh [bun]
bun add @qrgrid/core
```

```sh [pnpm]
pnpm install @qrgrid/core
```

```sh [yarn]
yarn add @qrgrid/core
```

:::

## Usage

```typescript
import { QR } from "@qrgrid/core";

const qr = new QR("Hello World!")
```

### Parameters

| Parameter | Type                                                        | Description    | Default               |
| --------- | ----------------------------------------------------------- | -------------- | --------------------- |
| inputData | string                                                      | data to encode |                       |
| options?  | [QrOptions](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/core/src/qr.ts#L43-L48) | Qr option passed to encode the data | errorCorrection: `M`  |

### Properties

| Key               | Type                                                        | Description                      |
| ----------------- | ----------------------------------------------------------- | -------------------------------- |
| inputData         | string                                                      | input data passed to constructor |
| segments          | [Segments](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/core/src/segment.ts#L17) | segments of the input data as per the encoded qr |
| data             | Uint8Array                           | qr data in 1's and 0's representing the dark and light module of qr |
| gridSize         | number                             | gridSize of qr ex: if 21 then no of modules is 21 x 21 |
| version          | number                                 | qr version |
| maskPattern      | number                             | mask pattern used |
| errorCorrection  | [ErrorCorrectionLevel](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/core/src/enums.ts#L9) | errorCorrection used while generating the qr, default is `M` |
| reservedBits  | { [key: number]: { type: [ReservedBits](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/core/src/enums.ts#L34); dark: boolean } }  | key is the index of the data |

## Example

### Web

::: code-group

```typescript [canvas]
import { QR } from "@qrgrid/core";

const qr = new QR("Hello World!")

// get the canvas element
const canvas = document.getElementById("defaultQrCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const canvasSize = 400;
// calculate module size and adjusting canvas to height and wight 
let size = Math.floor(canvasSize / (qr.gridSize + 1.5));
const border = Math.ceil(size * qr.gridSize - canvasSize) + size * 2;
canvas.height = canvasSize + border;
canvas.width = canvasSize + border;
// module color
ctx.fillStyle = "white";
// placing each modules in x,y position in the canvas using fillRect
let x = size;
let y = size;
for (let i = 0; i < qr.data.length; i++) {
  const bit = qr.data[i];
  if (bit) {
    ctx.fillRect(x, y, size, size);
  }
  x += size;
  if (i % qr.gridSize === qr.gridSize - 1) {
    x = size;
    y += size;
  }
}
// background color (optional)
ctx.globalCompositeOperation = "destination-over";
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvasSize + border, canvasSize + border);
```

```typescript [svg]
import { QR } from "@qrgrid/core";

const qr = new QR("Hello World!")

// get the svg and it's path element
const svg = document.getElementById("defaultQrSvg") as unknown as SVGSVGElement;
const svgPath = svg.getElementById("defaultQrSvgPath") as SVGElement;
const defaultSvgSize = 400;
// calculate module size and adjust svg height width and viewport 
let size = Math.floor(defaultSvgSize / (qr.gridSize + 1.5));
const border = Math.ceil(size * qr.gridSize - defaultSvgSize) + size * 2;
const svgSize = defaultSvgSize + border;
setSvgAttributes(svg, {
  style: `background:${DEFAULT_BG_COLOR}`,
  height: svgSize,
  width: svgSize,
  viewBox: `0 0 ${svgSize} ${svgSize}`,
});
// placing each modules in x,y position in the canvas
let x = size;
let y = size;
let path = "";
for (let i = 0; i < qr.data.length; i++) {
  const bit = qr.data[i];
  if (bit) {
    path += `M${x} ${y}v${size}h${size}v-${size}z`;
  }
  x += size;
  if (i % qr.gridSize === qr.gridSize - 1) {
    x = size;
    y += size;
  }
}
setSvgAttributes(svgPath, { d: path, fill: DEFAULT_COLOR });

function setSvgAttributes(element: SVGElement,attributes: CommonSVGAttributes) {
  for (const [key, value] of Object.entries(attributes)) {
    if (value !== undefined) {
      element.setAttributeNS(null, key, value.toString());
    }
  }
}
```

:::

For more examples and customization options, [see the examples.](https://github.com/yadav-saurabh/qrGrid/tree/main/examples/web)

### Server

Checkout [server documentation.](./server)
