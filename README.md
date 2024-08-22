<p align="center">
  <a href="https://github.com/yadav-saurabh/qrGrid#gh-light-mode-only">
    <img src="https://raw.githubusercontent.com/yadav-saurabh/qrGrid/main/docs/public/logo-dark.svg#gh-light-mode-only" alt="QrGrid - JavaScript Library for QR Code Encoding and Generation" width="350">
  </a>
  <a href="https://github.com/yadav-saurabh/qrGrid#gh-dark-mode-only">
    <img src="https://raw.githubusercontent.com/yadav-saurabh/qrGrid/main/docs/public/logo-light.svg#gh-dark-mode-only" alt="QrGrid - JavaScript Library for QR Code Encoding and Generation" width="350">
  </a>
</p>

# Qr Grid

The Ultimate Customizable QR Code JavaScript Library

<p>
  <a href="https://github.com/yadav-saurabh/qrGrid/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@qrgrid/core" alt="license"></a>
  <a href="https://www.npmjs.com/package/@qrgrid/core"><img src="https://img.shields.io/npm/v/@qrgrid/core?label=core" alt="npm package"></a>
  <a href="https://www.npmjs.com/package/@qrgrid/react"><img src="https://img.shields.io/npm/v/@qrgrid/react?label=react" alt="npm package"></a>
  <a href="https://www.npmjs.com/package/@qrgrid/vue"><img src="https://img.shields.io/npm/v/@qrgrid/vue?label=vue" alt="npm package"></a>
  <a href="https://www.npmjs.com/package/@qrgrid/angular"><img src="https://img.shields.io/npm/v/@qrgrid/angular?label=angular" alt="npm package"></a>
  <a href="https://www.npmjs.com/package/@qrgrid/styles"><img src="https://img.shields.io/npm/v/@qrgrid/styles?label=styles" alt="npm package"></a>
  <a href="https://www.npmjs.com/package/@qrgrid/cli"><img src="https://img.shields.io/npm/v/@qrgrid/cli?label=cli" alt="npm package"></a>
  <a href="https://www.npmjs.com/package/@qrgrid/server"><img src="https://img.shields.io/npm/v/@qrgrid/server?label=server" alt="npm package"></a>
</p>

> [!NOTE]
> For complete documentation visit: [qrgrid.dev](https://www.qrgrid.dev/)

## Table of Contents

- [Usage](#usage)
  - [Core](#core)
  - [Cli](#cli)
  - [Server](#server)
  - [React](#react)
  - [Vue](#vue)
  - [Angular](#angular)
  - [Styles](#styles)
- [Credits](#credits)
- [License](#license)

## Usage

### Core

This package serves as the foundational component for encoding QR codes, utilized by all other qrGrid packages. For maximum customization and full control over QR code generation, it is recommended to use this core package directly.

Installation:

```sh
npm i @qrgrid/core
```

Example usage:

```javascript
import { QR } from "@qrgrid/core";

new QR("Hello World!")
```

### Cli

Generate QR codes directly from the command line with this straightforward CLI tool. It supports generating SVG output for easy conversion to other formats. While it doesn't offer customization options, it provides a reliable and efficient way to create standard QR codes quickly in terminal-based environments.

Installation:

```sh
# Use it directly with npx
npx @qrgrid/cli 
# Or install globally
npm i -g @qrgrid/cli 
```

Example usage:

```sh
# Using npx
npx @qrgrid/cli -i "Hello world in cli"
# If installed globally
qrgrid -i "Hello world in cli"
```

### Server

Generate QR codes seamlessly in the backend with official support for SVG output, enabling easy conversion to other formats. This package offers robust and flexible options for creating QR codes, making it a versatile choice for any backend application.

Installation:

```sh
npm i @qrgrid/server
```

Example usage (Express server):

```javascript
import { generateQr } from "@qrgrid/server";
import express from "express";

const app = express();
// api routes
app.use("/", (req, res) => {
  const qr = generateQr("hello world from server");
  res.set("Content-Type", "text/html");
  res.send(Buffer.from(qr));
});

app.listen(5000);
```

### React

This package serves as a wrapper for `@qrgrid/core`. Provides two ways to generate the Qr using **Canvas** and **Svg**.

Installation:

```sh
npm i @qrgrid/react
```

Example usage:

```javascript
import { Canvas, Svg } from "@qrgrid/react";

<Canvas.Qr input="Hello World!"/>
<Svg.Qr input="Hello World!"/>
```

### Vue

This package serves as a wrapper for `@qrgrid/core`. Provides two ways to generate the Qr using **Canvas** and **Svg**.

Installation:

```sh
npm i @qrgrid/vue
```

Example usage:

```javascript
import { Canvas, Svg } from "@qrgrid/vue";

<Canvas input="Hello World!"/>
<Svg input="Hello World!"/>
```

### Angular

This package serves as a wrapper for `@qrgrid/core`. Provides two ways to generate the Qr using **Canvas** and **Svg**.

Installation:

```sh
npm i @qrgrid/angular
```

Example usage:

```javascript
import { CanvasQr, SvgQr } from "@qrgrid/angular";

<qr input="Hello World!"/>
```

### Styles

It provides utility functions and styling options for customizing QR codes.

Installation:

```sh
npm i @qrgrid/styles
```

Example usage (React):

```javascript
import { Qr } from "@qrgrid/react/canvas";
import { downloadQr } from "@qrgrid/styles/canvas/utils"

const canvasRef = useRef<HTMLCanvasElement | null>(null);
// pass the ref to the download utility function
downloadQr(canvasRef.current, "png", "qr");

<Qr input="Hello World" ref="canvasRef" />
```

## Credits

Inspired from [soldair/node-qrcode](https://github.com/soldair/node-qrcode) by Ryan Day

## License

Qr Grid is totally free for commercial use and personally use, this software is licensed under the [MIT](https://github.com/yadav-saurabh/qrgrid/blob/main/LICENSE)

The word "QR Code" is registered trademark of: DENSO WAVE INCORPORATED
