# Qr Grid Vue

This library offers two methods for generating QR codes: using **Canvas** and **Svg**. It also includes utility functions for downloading images and styling QR codes.

For full documentation, visit [qrgrid.dev](https://www.qrgrid.dev/)

## Key Features

- **Canvas-based QR Code Generation**: Create QR codes using the HTML5 Canvas element for high-performance rendering.
- **SVG-based QR Code Generation**: Generate QR codes as scalable vector graphics (SVG) for infinite scalability without loss of quality.
- **Utility Functions**: Easily download QR codes as images and apply custom styles.

## Installation

```bash
npm i @qrgrid/vue
```

## Using Canvas

```javascript
import { Canvas } from "@qrgrid/react";

<Canvas input="Hello World!"/>
```

OR

```javascript
import { Qr } from "@qrgrid/react/canvas";

<Qr input="Hello World!"/>
```

## Using Svg

```javascript
import { Svg } from "@qrgrid/react";

<Svg input="Hello World!"/>
```

OR

```javascript
import { Qr } from "@qrgrid/react/svg";

<Qr input="Hello World!"/>
```
