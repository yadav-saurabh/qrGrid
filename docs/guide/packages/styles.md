---
title: Styles
outline: deep
---

# Styles

The `@qrgrid/styles` package provides utility functions and styling options for customizing QR codes.

## Installation

::: code-group

```sh [npm]
npm install @qrgrid/styles
```

```sh [bun]
bun add @qrgrid/styles
```

```sh [pnpm]
pnpm install @qrgrid/styles
```

```sh [yarn]
yarn add @qrgrid/styles
```

:::

## Available Styles

You can apply two main styles to QR codes: `dotModuleStyle` and `smoothModuleStyle`. These styles are available for both canvas and SVG rendering.

::: code-group

```typescript [react]
import { dotModuleStyle, smoothModuleStyle } from "@qrgrid/styles/canvas/styles"; 
// use "@qrgrid/styles/svg/styles" if using svg

<Qr input="Hello World" moduleStyle={dotModuleStyle} />
<Qr input="Hello World" moduleStyle={smoothModuleStyle} />
```

```typescript [vue]
import { dotModuleStyle, smoothModuleStyle } from "@qrgrid/styles/canvas/styles"; 
// use "@qrgrid/styles/svg/styles" if using svg

<Qr input="Hello World" :moduleStyle="dotModuleStyle" />
<Qr input="Hello World" :moduleStyle="smoothModuleStyle" />
```

```typescript [angular]
import { dotModuleStyle, smoothModuleStyle } from "@qrgrid/styles/canvas/styles"; 
// use "@qrgrid/styles/svg/styles" if using svg

<qr input="Hello World" [moduleStyle]="dotModuleStyle" />
<qr input="Hello World" [moduleStyle]="smoothModuleStyle" />
```

<!-- ```typescript [server]
import { dotModuleStyle, smoothModuleStyle } from "@qrgrid/styles/canvas/styles"; 
// use "@qrgrid/styles/svg/styles" if using svg

<qr input="Hello World" [moduleStyle]="dotModuleStyle" />
``` -->

:::

## Utility Functions

### Canvas

- `downloadQr`: Download the generated QR code.

  ::: code-group

  ```typescript [react]
  import { Qr } from "@qrgrid/react/canvas";
  import { downloadQr } from "@qrgrid/styles/canvas/utils"

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // pass the ref to the download utility function
  downloadQr(canvasRef.current, "png", "qr");
  
  <Qr input="Hello World" ref="canvasRef" />
  ```

  ```typescript [vue]
  import { Qr } from "@qrgrid/vue/canvas";
  import { downloadQr } from "@qrgrid/styles/canvas/utils"

  const qrRef = ref<InstanceType<typeof Qr> | null>(null);
  // pass the ref to the download utility function
  downloadQr(qrRef.value.canvasRef, "png", "qr");
  
  <Qr input="Hello World" ref="qrRef" />
  ```

  ```typescript [angular]
  import { CanvasQr } from "@qrgrid/angular";
  import { downloadQr } from "@qrgrid/styles/canvas/utils"
  
  // get the qr ref
  @ViewChild(CanvasQr) canvasQr!: CanvasQr;

  // pass the ref to the download utility function
  downloadQr(this.canvasQr.canvas.nativeElement, "png", "qr");
  ```

  :::

- Additional Utilities:
  - getNeighbor: Retrieves the neighboring module.
  - roundCorner: Rounds corners of the modules.
  - cornerArc: Adds an arc at the corner.
  - smoothEdges: Smooths module edges.
  - roundCornerFinderPattern: Rounds corners for square modules.

### Svg

- `downloadQr`: Download the generated QR code.

  ::: code-group

  ```typescript [react]
  import { Qr } from "@qrgrid/react/svg";
  import { downloadQr } from "@qrgrid/styles/svg/utils"

  const svgRef = useRef<HTMLCanvasElement | null>(null);
  // pass the ref to the download utility function
  downloadQr(svgRef.current, "svg", "qr");
  
  <Qr input="Hello World" ref="svgRef" />
  ```

  ```typescript [vue]
  import { Qr } from "@qrgrid/vue/svg";
  import { downloadQr } from "@qrgrid/styles/svg/utils"

  const qrRef = ref<InstanceType<typeof Qr> | null>(null);
  // pass the ref to the download utility function
  downloadQr(qrRef.value.svgRef, "svg", "qr");
  
  <Qr input="Hello World" ref="qrRef" />
  ```

  ```typescript [angular]
  import { SvgQr } from "@qrgrid/angular";
  import { downloadQr } from "@qrgrid/styles/svg/utils"
  
  // get the qr ref
  @ViewChild(SvgQr) svgQr!: SvgQr;

  // pass the ref to the download utility function
  downloadQr(this.svgQr.canvas.nativeElement, "svg", "qr");
  ```

  :::

- Additional Utilities:
  - getNeighbor: Retrieves the neighboring module.
  - getFinderPatternDetails: Finds positions and sizes of finder patterns.
  - getCirclePath: Generates a path for a circle.
  - getCircleOutlinePath: Generates a path for a circle outline.
  - getSquarePath: Generates a path for a square.
  - getCornerArcPath: Adds an arc at the corner.
  - getSmoothDataBitPath: Generates a smooth edge path.
  - roundCornerFinderPattern: Rounds corners for square modules.
