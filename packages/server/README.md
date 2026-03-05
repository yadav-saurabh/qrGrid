# @qrgrid/server

<p>
  <a href="https://www.npmjs.com/package/@qrgrid/server"><img src="https://img.shields.io/npm/v/@qrgrid/server" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@qrgrid/server"><img src="https://img.shields.io/npm/dm/@qrgrid/server" alt="npm downloads"></a>
  <a href="https://github.com/yadav-saurabh/qrGrid/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@qrgrid/server" alt="MIT License"></a>
</p>

Server-side QR code generation for Node.js. Give it a string, get back an SVG string. No browser APIs, no DOM, no canvas needed.

Part of [QR Grid](https://github.com/yadav-saurabh/qrgrid).

**[Docs](https://www.qrgrid.dev/guide/packages/server)**

## Why use this

When you need QR codes on the backend: API endpoints that return SVG, email templates, PDF generation, server-rendered pages, or saving QR codes to disk. The output is a plain SVG string that you can serve directly, embed in HTML, or write to a file.

## Install

```bash
npm install @qrgrid/server
```

## Basic usage

```js
import { generateQr } from "@qrgrid/server";

const svg = generateQr("Hello World");
// returns a complete SVG string ready to use
```

## With an Express API

```js
import { generateQr } from "@qrgrid/server";
import express from "express";

const app = express();

app.get("/qr", (req, res) => {
  const data = req.query.data || "Hello World";
  const svg = generateQr(data, {
    size: 400,
    qrOptions: { errorCorrection: "H" },
  });
  res.set("Content-Type", "image/svg+xml");
  res.send(svg);
});

app.listen(5000);
```

## Custom colors

```js
// solid color
const svg = generateQr("Hello World", {
  bgColor: "#1a1a2e",
  color: "#e94560",
});

// different colors for finder patterns and data
const svg = generateQr("Hello World", {
  bgColor: "#F8EDED",
  color: { finder: "#ff3131", codeword: "#173B45" },
});
```

The SVG output has two separate `<path>` elements (one for finder patterns, one for data modules), so the two-color approach works cleanly.

## Custom module styles

Use the built-in styles from `@qrgrid/styles`, or write your own:

```js
import { generateQr } from "@qrgrid/server";
import { dotModuleStyle } from "@qrgrid/styles/svg/styles";

const svg = generateQr("Hello World", {
  moduleStyle: dotModuleStyle,
});
```

A custom `moduleStyle` function receives `(path, module, qr)`:

```js
const svg = generateQr("Hello World", {
  moduleStyle: (path, module, qr) => {
    // path: { codeword: string, finder: string }
    // module: { index, x, y, size }
    // append SVG path data to path.codeword or path.finder
    const key =
      qr.reservedBits[module.index]?.type === "FinderPattern"
        ? "finder"
        : "codeword";
    path[key] +=
      `M${module.x} ${module.y}h${module.size}v${module.size}h-${module.size}z`;
  },
});
```

## Save to file

```js
import { generateQr } from "@qrgrid/server";
import { writeFileSync } from "fs";

const svg = generateQr("https://yoursite.com", { size: 600 });
writeFileSync("qr.svg", svg);
```

## Injecting extra SVG content

The `onGenerated` callback can return a string that gets injected into the SVG output, after the QR paths and before the closing `</svg>` tag. Useful for adding text, watermarks, or other elements:

```js
const svg = generateQr("Hello World", {
  onGenerated: (path, size, qr) => {
    return `<text x="${size / 2}" y="${size - 10}" text-anchor="middle" fill="white" font-size="14">Scan me</text>`;
  },
});
```

## All options

```js
generateQr(input, options?)
```

| Option        | Type                                               | Default                    | Description                                                           |
| ------------- | -------------------------------------------------- | -------------------------- | --------------------------------------------------------------------- |
| `size`        | `number`                                           | `400`                      | SVG size in pixels                                                    |
| `qrOptions`   | `{ errorCorrection?: "L"\|"M"\|"Q"\|"H" }`         | `{ errorCorrection: "M" }` | QR encoding options                                                   |
| `bgColor`     | `string`                                           | `"black"`                  | Background color                                                      |
| `color`       | `string \| { finder?: string, codeword?: string }` | `"white"`                  | Module color(s)                                                       |
| `moduleStyle` | `(path, module, qr) => void`                       | square path                | Custom path generation per module                                     |
| `getQrData`   | `(qr: QR) => void`                                 | none                       | Callback after QR data is encoded                                     |
| `onGenerated` | `(path, size, qr) => void \| string`               | none                       | Called after path generation. Can return extra SVG content to inject. |

## SVG output structure

The generated SVG looks like this:

```xml
<svg xmlns="..." height="400" width="400" viewBox="0 0 400 400" style="background: black;">
  <path id="finder" fill="white" d="..." />
  <path id="codeword" fill="white" d="..." />
  <!-- onGenerated return value goes here -->
</svg>
```

Two paths keep finder patterns and data modules separate, which is why `color: { finder, codeword }` works.

## Exported types

```typescript
import type {
  QrOptionType,
  ModuleStyleFunction,
  ModuleStyleFunctionParams,
} from "@qrgrid/server";
```

## License

[MIT](https://github.com/yadav-saurabh/qrgrid/blob/main/LICENSE)
