---
title: Web
outline: deep
---

# Web / Core

This package serves as the foundational component for encoding QR codes, utilized by all other qrgrid packages. For maximum customization and full control over QR code generation, it is recommended to use this core package directly.

## Installation

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

::: code-group

```javascript
import { QR } from "@qrgrid/core";

const qr = new QR("Hello World!")
```

```typescript
import { QR } from "@qrgrid/core";

const qr = new QR("Hello World!")
```

:::

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
| noOfModules      | number                             | modules in qr ex: 21 represents 21 x 21 for version 1 |
| version          | number                                 | qr version |
| maskPattern      | number                             | mask pattern used |
| errorCorrection  | [ErrorCorrectionLevel](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/core/src/enums.ts#L9) | errorCorrection used while generating the qr, default is `M` |
| reservedBits  | { [key: number]: { type: [ReservedBits](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/core/src/enums.ts#L34); dark: boolean } }  | key is the index of the data |

## Example

::: code-group

```javascript
import { QR } from "@qrgrid/core";

const qr = new QR("Hello World!")

// get the canvas element
const canvas = document.getElementById("defaultQrCanvas");
const ctx = canvas.getContext("2d")!;
const canvasSize = 400;
// calculate module size and adjusting canvas to height and wight 
let size = Math.floor(canvasSize / (qr.noOfModules + 1.5));
const border = Math.ceil(size * qr.noOfModules - canvasSize) + size * 2;
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
  if (i % qr.noOfModules === qr.noOfModules - 1) {
    x = size;
    y += size;
  }
}
// background color (optional)
ctx.globalCompositeOperation = "destination-over";
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvasSize + border, canvasSize + border);
```

```typescript
import { QR } from "@qrgrid/core";

const qr = new QR("Hello World!")

// get the canvas element
const canvas = document.getElementById("defaultQrCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const canvasSize = 400;
// calculate module size and adjusting canvas to height and wight 
let size = Math.floor(canvasSize / (qr.noOfModules + 1.5));
const border = Math.ceil(size * qr.noOfModules - canvasSize) + size * 2;
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
  if (i % qr.noOfModules === qr.noOfModules - 1) {
    x = size;
    y += size;
  }
}
// background color (optional)
ctx.globalCompositeOperation = "destination-over";
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvasSize + border, canvasSize + border);
```

:::
