<p align="center">
  <a href="https://github.com/yadav-saurabh/qrGrid#gh-light-mode-only">
    <img src="https://github.com/yadav-saurabh/qrGrid/blob/main/assets/qr-grid-light-bg.svg#gh-light-mode-only" alt="QrGrid - JavaScript Library for QR Code Encoding and Generation" width="350">
  </a>
  <a href="https://github.com/yadav-saurabh/qrGrid#gh-dark-mode-only">
    <img src="https://github.com/yadav-saurabh/qrGrid/blob/main/assets/qr-grid-dark-bg.svg#gh-dark-mode-only" alt="QrGrid - JavaScript Library for QR Code Encoding and Generation" width="350">
  </a>
</p>

# Qr Grid

The Ultimate Customizable QR Code JavaScript Library

<p>
  <a href="https://github.com/yadav-saurabh/qrGrid/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@qrgrid/core" alt="license"></a>
  <a href="https://www.npmjs.com/package/@qrgrid/core"><img src="https://img.shields.io/npm/v/@qrgrid/core" alt="npm package"></a>
</p>

## Table of Contents

- [Features](#features)
- [Usage](#usage)
  - [Core](#core)
  - [React](#react)
- [TODO](#todo)
- [Credits](#credits)
- [License](#license)

## Features

- Fast
- Typescript
- No Framework
- Zero Dependency
- Customizable
- Well Documented

## Usage

### Core

This package serves as the foundational component for encoding QR codes, utilized by all other qrGrid packages. For maximum customization and full control over QR code generation, it is recommended to use this core package directly.

Install the package:

```bash
npm i @qrgrid/core
```

Example usage:

```javascript
import { QR } from "@qrgrid/core";

new QR("Hello World!")
```

For more details, see the [documentation](https://github.com/yadav-saurabh/qrgrid/tree/main/packages/core) and [example code](https://github.com/yadav-saurabh/qrgrid/tree/main/examples/web)

### React

This package serves as a wrapper for `@qrgrid/core`.Provides two ways to generate the Qr *Canvas* and *Svg*. It also comes with utility function to download images and style the Qr code.

Install the package:

```bash
npm i @qrgrid/core
```

Example usage:

```javascript
import { Canvas, Svg } from "@qrgrid/react";

<Canvas.Qr input="Hello World!"/>
<Svg.Qr input="Hello World!"/>
```

For more details, see the [documentation](https://github.com/yadav-saurabh/qrgrid/tree/main/packages/react) and [example code](https://github.com/yadav-saurabh/qrgrid/tree/main/examples/react)

## TODO

- [ ] (core) Support for Kanji Mode
- [x] (react) Support for using SVG
- [ ] (web) examples using svg
- [ ] package and examples for angular
- [ ] package and examples for vue
- [ ] package and examples more frameworks

## Credits

Inspired from [soldair/node-qrcode](https://github.com/soldair/node-qrcode) by Ryan Day

## License

qrgrid is totally free for commercial use and personally use, this software is licensed under the [MIT](https://github.com/yadav-saurabh/qrgrid/blob/main/LICENSE)

The word "QR Code" is registered trademark of: DENSO WAVE INCORPORATED
