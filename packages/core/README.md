# qrgrid Core

This package serves as the foundational component for encoding QR codes, utilized by all other qrgrid packages. For maximum customization and full control over QR code generation, it is recommended to use this core package directly. For detailed examples, see the [web examples](https://github.com/yadav-saurabh/qrgrid/tree/main/examples/web)

## Installation

All the qrgrid packages are available through [npm](https://www.npmjs.com/search?q=qrgrid)

```bash
# npm
npm i add @qrgrid/core
```

## Usage

The QR constructor expects two parameters:

- inputData (string): The input string to encode in the QR code.
- options (QrOptions): Optional settings for QR code generation.

```typescript
QR(
inputData: string,
options?: QrOptions,
)
// where QrOptions is:
type QrOptions = {errorCorrection?: keyof typeof ErrorCorrectionLevel};
// where ErrorCorrectionLevel is:
enum ErrorCorrectionLevel {
  L = "L",
  M = "M",
  Q = "Q",
  H = "H",
}
```

The QR class has the following public properties

``` typescript
// QR Properties
{
  inputData: string; // input data passed in the constructor
  segments: Segments; // segments of the input data to make the qr
  data: Uint8Array; // qr data in 1's and 0's representing the dark and light module of qr
  noOfModules: number; // modules in qr ex: 21 represents 21 x 21 for version 1
  version: number; // qr version
  errorCorrection: ErrorCorrectionLevel; // errorCorrection used
  reservedBits: { [key: number]: { type: ReservedBits; dark: boolean } }; // reserved bits used
  maskPattern: number; // mask pattern used
}
// where
type Segments = Array<{ value: string; mode: Mode }>;
enum Mode {
  Numeric = "Numeric",
  AlphaNumeric = "AlphaNumeric",
  Byte = "Byte",
  Kanji = "Kanji",
}
```

## Example

Implementing in a web project using canvas

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
