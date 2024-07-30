<p align="center">
  <a href="https://github.com/yadav-saurabh/qrGrid#gh-light-mode-only">
    <img src="https://github.com/yadav-saurabh/qrGrid/blob/main/assets/qr-grid-light-bg.svg#gh-light-mode-only" alt="QrGrid - JavaScript Library for QR Code Encoding and Generation" width="480">
  </a>
  <a href="https://github.com/yadav-saurabh/qrGrid#gh-dark-mode-only">
    <img src="https://github.com/yadav-saurabh/qrGrid/blob/main/assets/qr-grid-dark-bg.svg#gh-dark-mode-only" alt="QrGrid - JavaScript Library for QR Code Encoding and Generation" width="480">
  </a>
</p>
<p align="center">
  <a href="https://github.com/yadav-saurabh/qrGrid/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@qrgrid/core" alt="license"></a>
  <a href="https://www.npmjs.com/package/qrGrid"><img src="https://img.shields.io/npm/v/@qrgrid/core" alt="npm package"></a>
</p>

# qrGrid

JavaScript Library for QR Code Encoding and Generation

## Table of Contents

- [Features](#features)
- [Usage](#usage)
  - [Core](#core)
  - [React](#react)
- [Credits](#credits)
- [License](#license)

## Features

- Fast
- Typescript
- No Framework
- Zero Dependency
- Customizable
- Well Documented

<!-- ## Installation

All the qrGrid packages are available through [npm](https://www.npmjs.com/search?q=qrgrid)

```bash
# npm
npi i @qrgrid/package-name # where package-name can be core/react/angular/....
``` -->

## Usage

### Core

This package serves as the foundational component for encoding QR codes, utilized by all other qrgrid packages. For maximum customization and full control over QR code generation, it is recommended to use this core package directly. For detailed examples, see the [web examples](https://github.com/yadav-saurabh/qrgrid/tree/main/examples/web)

```javascript
import { QR } from "@qrgrid/core";

new QR("Hello World!")
```

### React

This package serves as a wrapper for `@qrgrid/core`. For detailed examples, see the [react examples](https://github.com/yadav-saurabh/qrgrid/tree/main/examples/react)

```javascript
import { Qr } from "@qrgrid/react";

<Qr input="Hello World!"/>
```

## TODO

- [ ] (core) Support for Kanji Mode
- [ ] (react) Support for using SVG
- [ ] (web) examples using svg
- [ ] package and examples for angular
- [ ] package and examples for vue
- [ ] package and examples more frameworks

## Credits

Inspired from [soldair/node-qrcode](https://github.com/soldair/node-qrcode) by Ryan Day

## License

qrgrid is totally free for commercial use and personally use, this software is licensed under the [MIT](https://github.com/yadav-saurabh/qrgrid/blob/main/LICENSE)

The word "QR Code" is registered trademark of: DENSO WAVE INCORPORATED
