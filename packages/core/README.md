# @qrgrid/core

<p>
  <a href="https://www.npmjs.com/package/@qrgrid/core"><img src="https://img.shields.io/npm/v/@qrgrid/core" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@qrgrid/core"><img src="https://img.shields.io/npm/dm/@qrgrid/core" alt="npm downloads"></a>
  <a href="https://github.com/yadav-saurabh/qrGrid/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@qrgrid/core" alt="MIT License"></a>
</p>

QR encoding engine that powers all QR Grid packages. Implements the full QR code spec from scratch in pure TypeScript with zero runtime dependencies.

You give it a string, it gives you back a grid of 1s and 0s. How you render that grid is up to you.

**[Docs](https://www.qrgrid.dev/guide/packages/core)** · **[Playground](https://www.qrgrid.dev/generate)**

## Why use this directly

The framework packages (React, Vue, Angular) handle rendering for you. Use `@qrgrid/core` when you want full control: a plain `<canvas>`, an `<svg>`, a WebGL shader, a PDF, or anything else that can draw pixels.

## Install

```bash
npm install @qrgrid/core
```

## Basic usage

```typescript
import { QR } from "@qrgrid/core";

const qr = new QR("Hello World!");

qr.data; // Uint8Array of 1s and 0s
qr.gridSize; // e.g. 25 (meaning 25x25 modules)
qr.version; // QR version used (1-40)
qr.errorCorrection; // "M" by default
qr.segments; // how the input was split into encoding segments
qr.reservedBits; // what each module is (finder pattern, alignment, timing, etc.)
qr.maskPattern; // which mask pattern was applied (0-7)
```

Everything happens in the constructor. By the time `new QR(...)` returns, the grid is fully computed and ready to read.

## Options

```typescript
const qr = new QR("Hello World!", {
  errorCorrection: "H", // "L" | "M" | "Q" | "H", defaults to "M"
});
```

Higher error correction means the QR code can tolerate more damage (useful when embedding a logo), but the grid gets larger.

| Level | Recovery |
| ----- | -------- |
| L     | ~7%      |
| M     | ~15%     |
| Q     | ~25%     |
| H     | ~30%     |

## Rendering to a `<canvas>`

```typescript
import { QR } from "@qrgrid/core";

const qr = new QR("Hello World!");
const canvas = document.getElementById("qr") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const canvasSize = 400;

let size = Math.floor(canvasSize / (qr.gridSize + 1.5));
const border = Math.ceil(size * qr.gridSize - canvasSize) + size * 2;
canvas.height = canvasSize + border;
canvas.width = canvasSize + border;

ctx.fillStyle = "black";
let x = size,
  y = size;
for (let i = 0; i < qr.data.length; i++) {
  if (qr.data[i]) {
    ctx.fillRect(x, y, size, size);
  }
  x += size;
  if (i % qr.gridSize === qr.gridSize - 1) {
    x = size;
    y += size;
  }
}

// fill background behind the modules
ctx.globalCompositeOperation = "destination-over";
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvasSize + border, canvasSize + border);
```

`qr.data` is a flat array laid out row by row. Index `i` corresponds to row `Math.floor(i / qr.gridSize)`, column `i % qr.gridSize`. If `qr.data[i]` is `1`, draw something dark. If it's `0`, leave it light.

## Rendering to an `<svg>`

```typescript
import { QR } from "@qrgrid/core";

const qr = new QR("Hello World!");
const svg = document.getElementById("qrSvg") as unknown as SVGSVGElement;
const pathEl = document.getElementById("qrPath") as SVGElement;
const svgSize = 400;

let size = Math.floor(svgSize / (qr.gridSize + 1.5));
const border = Math.ceil(size * qr.gridSize - svgSize) + size * 2;
const total = svgSize + border;

svg.setAttribute("width", total.toString());
svg.setAttribute("height", total.toString());
svg.setAttribute("viewBox", `0 0 ${total} ${total}`);
svg.style.background = "white";

let x = size,
  y = size,
  d = "";
for (let i = 0; i < qr.data.length; i++) {
  if (qr.data[i]) {
    d += `M${x} ${y}v${size}h${size}v-${size}z`;
  }
  x += size;
  if (i % qr.gridSize === qr.gridSize - 1) {
    x = size;
    y += size;
  }
}

pathEl.setAttribute("d", d);
pathEl.setAttribute("fill", "black");
```

## Coloring by module type

Every module in the grid has metadata in `qr.reservedBits` that tells you what it is structurally. You can use this to color finder patterns, alignment patterns, or timing patterns differently from the data modules.

```typescript
import { QR, ReservedBits } from "@qrgrid/core";

const qr = new QR("Hello World!");

for (let i = 0; i < qr.data.length; i++) {
  if (qr.data[i]) {
    const type = qr.reservedBits[i]?.type;
    if (type === ReservedBits.FinderPattern) {
      ctx.fillStyle = "#ff3131";
    } else if (type === ReservedBits.AlignmentPattern) {
      ctx.fillStyle = "#3131ff";
    } else {
      ctx.fillStyle = "#333";
    }
    ctx.fillRect(x, y, size, size);
  }
  // ... advance x, y
}
```

Available module types: `FinderPattern`, `AlignmentPattern`, `TimingPattern`, `FormatInfo`, `VersionInfo`, `DarkModule`, `Separator`.

## How the encoding works

The constructor runs through the full QR pipeline:

1. **Segment optimization.** The input is split into segments of different encoding modes (Numeric, AlphaNumeric, Byte, Kanji). A weighted graph is built and Dijkstra's algorithm finds the combination that uses the fewest bits overall.

2. **Version selection.** The smallest QR version (1-40) that can hold the data at the chosen error correction level is picked automatically. Grid size = `version * 4 + 17`.

3. **Error correction.** Reed-Solomon codewords are generated using Galois Field GF(256) arithmetic. Data and error correction blocks are interleaved.

4. **Pattern placement.** Finder patterns, timing patterns, alignment patterns, version info, and format info are placed on the grid.

5. **Masking.** All 8 mask patterns are scored using the spec's four penalty rules. The mask with the lowest penalty is applied.

## API reference

### `new QR(inputData, options?)`

| Parameter                 | Type                       | Description                               |
| ------------------------- | -------------------------- | ----------------------------------------- |
| `inputData`               | `string`                   | The data to encode (required)             |
| `options.errorCorrection` | `"L" \| "M" \| "Q" \| "H"` | Error correction level, defaults to `"M"` |

### Properties

| Property          | Type                                                        | Description                                   |
| ----------------- | ----------------------------------------------------------- | --------------------------------------------- |
| `inputData`       | `string`                                                    | Original input string                         |
| `data`            | `Uint8Array`                                                | QR grid as 1s (dark) and 0s (light)           |
| `gridSize`        | `number`                                                    | Side length of the grid (e.g. 21 means 21x21) |
| `version`         | `number`                                                    | QR version (1-40)                             |
| `errorCorrection` | `ErrorCorrectionLevelType`                                  | Error correction level used                   |
| `segments`        | `Array<{ value: string, mode: ModeType }>`                  | How the input was segmented for encoding      |
| `reservedBits`    | `Record<number, { type: ReservedBitsType, dark: boolean }>` | Structural metadata for each module           |
| `maskPattern`     | `number`                                                    | Mask pattern index (0-7)                      |

### Exported types and enums

```typescript
import {
  QR,
  QrOptions,
  ErrorCorrectionLevel, // { L, M, Q, H }
  ErrorCorrectionLevelType, // "L" | "M" | "Q" | "H"
  Mode, // { Numeric, AlphaNumeric, Byte, Kanji }
  ModeType, // "Numeric" | "AlphaNumeric" | "Byte" | "Kanji"
  ReservedBits, // { FinderPattern, AlignmentPattern, TimingPattern, ... }
  ReservedBitsType, // "FinderPattern" | "AlignmentPattern" | ...
} from "@qrgrid/core";
```

## License

[MIT](https://github.com/yadav-saurabh/qrgrid/blob/main/LICENSE)
