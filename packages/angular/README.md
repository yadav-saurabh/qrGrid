# Qr Grid Angular

This library offers two methods for generating QR codes: using **Canvas** and **Svg**. It also includes utility functions for downloading images and styling QR codes.

> [!NOTE]
> For complete documentation visit: [qrgrid.dev](https://www.qrgrid.dev/)

## Key Features

- **Canvas-based QR Code Generation**: Create QR codes using the HTML5 Canvas element for high-performance rendering.
- **SVG-based QR Code Generation**: Generate QR codes as scalable vector graphics (SVG) for infinite scalability without loss of quality.
- **Utility Functions**: Easily download QR codes as images and apply custom styles.

## Installation

```bash
npm i @qrgrid/angular
```

## Using Canvas

```javascript
import { CanvasQr } from "@qrgrid/react";

<qr input="Hello World!"/>
```

## Using Svg

```javascript
import { SvgQr } from "@qrgrid/react";

<qr input="Hello World!"/>
```
