# @qrgrid/styles

<p>
  <a href="https://www.npmjs.com/package/@qrgrid/styles"><img src="https://img.shields.io/npm/v/@qrgrid/styles" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@qrgrid/styles"><img src="https://img.shields.io/npm/dm/@qrgrid/styles" alt="npm downloads"></a>
  <a href="https://github.com/yadav-saurabh/qrGrid/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@qrgrid/styles" alt="MIT License"></a>
</p>

Drawing utilities and ready-made styles for QR Grid. Circles, smooth edges, round corners, download helpers, and neighbor detection. Works with plain canvas and SVG, no framework required.

Part of [QR Grid](https://github.com/yadav-saurabh/qrgrid).

**[Docs](https://www.qrgrid.dev/guide/packages/styles)**

## Why this package exists

The `@qrgrid/core` package gives you raw QR data. This package gives you the tools to make that data look good without writing all the drawing math yourself. Every function here works directly with the Canvas 2D API or returns SVG path strings. No framework dependency.

## Install

```bash
npm install @qrgrid/styles
```

## Built-in module styles

Two styles come ready to use. Pass them as the `moduleStyle` prop in any QR Grid component, or call them directly in your own rendering loop.

### Dot style

Renders each module as a circle.

```js
// Canvas
import { dotModuleStyle } from "@qrgrid/styles/canvas/styles";

// SVG
import { dotModuleStyle } from "@qrgrid/styles/svg/styles";
```

### Smooth style

Renders modules with rounded edges that connect intelligently to their neighbors. The function checks all 8 surrounding modules and decides which corners to round and where to add connecting arcs.

```js
// Canvas
import { smoothModuleStyle } from "@qrgrid/styles/canvas/styles";

// SVG
import { smoothModuleStyle } from "@qrgrid/styles/svg/styles";
```

## Using with plain canvas (no framework)

Every canvas function takes a `CanvasRenderingContext2D` and a module object `{ index, x, y, size }`. You call them inside your rendering loop:

```js
import { QR } from "@qrgrid/core";
import { drawCircle } from "@qrgrid/styles/canvas";

const qr = new QR("Hello World!");
const ctx = canvas.getContext("2d");

// ... set up canvas size ...

let x = size,
  y = size;
for (let i = 0; i < qr.data.length; i++) {
  if (qr.data[i]) {
    drawCircle(ctx, { index: i, x, y, size });
  }
  x += size;
  if (i % qr.gridSize === qr.gridSize - 1) {
    x = size;
    y += size;
  }
}
```

## Using with plain SVG (no framework)

SVG functions return path `d`-attribute strings. You accumulate them and set the result on a `<path>` element:

```js
import { QR } from "@qrgrid/core";
import { getCirclePath } from "@qrgrid/styles/svg";

const qr = new QR("Hello World!");
let d = "";

let x = size,
  y = size;
for (let i = 0; i < qr.data.length; i++) {
  if (qr.data[i]) {
    d += getCirclePath(x, y, size);
  }
  x += size;
  if (i % qr.gridSize === qr.gridSize - 1) {
    x = size;
    y += size;
  }
}

pathElement.setAttribute("d", d);
```

## Canvas drawing functions

All imported from `@qrgrid/styles/canvas`:

| Function                                             | What it does                                                                 |
| ---------------------------------------------------- | ---------------------------------------------------------------------------- |
| `drawCircle(ctx, module)`                            | Filled circle that fits the module square                                    |
| `drawCircleOutline(ctx, module, strength?)`          | Ring/donut shape. `strength` controls thickness (defaults to 25% of radius)  |
| `drawRoundCorner(ctx, module, corners, cornerSize?)` | Square with specified corners rounded                                        |
| `drawCornerArc(ctx, module, corner, cornerSize?)`    | Single corner arc (used by smooth edges internally)                          |
| `drawSmoothEdges(ctx, module, qr)`                   | Neighbor-aware smooth rendering. Analyzes all 8 neighbors to decide rounding |
| `downloadQr(canvas, type?, name?)`                   | Download as `"png"`, `"jpeg"`, or `"webp"`                                   |

`module` is always `{ index: number, x: number, y: number, size: number }`.

`corners` is an array of `"top-left" | "top-right" | "bottom-left" | "bottom-right"`.

## SVG path functions

All imported from `@qrgrid/styles/svg`:

| Function                                           | What it returns                                                     |
| -------------------------------------------------- | ------------------------------------------------------------------- |
| `getSquarePath(x, y, size)`                        | Square path: `M{x} {y}v{size}h{size}v-{size}z`                      |
| `getCirclePath(x, y, size)`                        | Circle path using arcs                                              |
| `getCircleOutlinePath(x, y, size, strength?)`      | Ring path                                                           |
| `getRoundCornerPath(module, corners, cornerSize?)` | Square with specified corners rounded using quadratic bezier curves |
| `getCornerArcPath(module, corner, cornerSize?)`    | Single corner arc path                                              |
| `getSmoothEdgesPath(module, qr)`                   | Neighbor-aware smooth path                                          |
| `downloadQr(svg, type?, name?)`                    | Download as `"svg"`, `"png"`, `"jpeg"`, or `"webp"`                 |

All path functions return a string that you append to a path `d` attribute.

## Common utilities

Imported from `@qrgrid/styles/common`:

### `getNeighbor(index, qr)`

Returns the state of all 8 neighbors around a module. Each value is truthy (1) if that neighbor is a dark module, falsy (0 or false) if light or out of bounds.

```js
import { getNeighbor } from "@qrgrid/styles/common";

const neighbors = getNeighbor(i, qr);
// { left, right, top, bottom, topLeft, topRight, bottomLeft, bottomRight }

if (neighbors.top && neighbors.left && !neighbors.topLeft) {
  // concave inner corner
}
```

### `getFinderPatternDetails(size, qr)`

Returns pixel positions and sizes for the three finder patterns:

```js
import { getFinderPatternDetails } from "@qrgrid/styles/common";

const { positions, sizes } = getFinderPatternDetails(moduleSize, qr);
// positions.inner -> 3 {x, y} coordinates for the inner 3x3 squares
// positions.outer -> 3 {x, y} coordinates for the outer 7x7 squares
// sizes.inner -> pixel size of inner square
// sizes.outer -> pixel size of outer square
```

Useful when you want to replace the standard finder patterns with custom shapes (circles, rounded squares, etc).

### `isOuterFinderPattern(index, qr)`

Returns `true` if the module at that index is on the outer ring of a finder pattern. Handy for drawing finder pattern outlines differently from the filled center.

## Writing your own module style

A module style is just a function with a specific signature.

**For Canvas:**

```js
function myStyle(ctx, module, qr) {
  // module: { index, x, y, size }
  // draw whatever you want using ctx
  ctx.beginPath();
  ctx.arc(
    module.x + module.size / 2,
    module.y + module.size / 2,
    module.size / 3,
    0,
    Math.PI * 2,
  );
  ctx.fill();
}
```

**For SVG:**

```js
function myStyle(path, module, qr) {
  // path: { codeword: string, finder: string }
  // module: { index, x, y, size }
  // append SVG path data to the right bucket
  const key =
    qr.reservedBits[module.index]?.type === "FinderPattern"
      ? "finder"
      : "codeword";
  path[key] +=
    `M${module.x} ${module.y}h${module.size}v${module.size}h-${module.size}z`;
}
```

## License

[MIT](https://github.com/yadav-saurabh/qrgrid/blob/main/LICENSE)
