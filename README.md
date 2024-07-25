# Zqr

JavaScript Library for QR Code Encoding and Generation

## Table of Contents

- [Usage](#usage)
  - [Core](#core)
  - [React](#react)
- [Credits](#credits)
- [License](#license)

## Usage

### Core

This package serves as the foundational component for encoding QR codes, utilized by all other zqr packages. For maximum customization and full control over QR code generation, it is recommended to use this core package directly. See [web](https://github.com/yadav-saurabh/zqr/tree/main/examples/web) in examples

```javascript
import { QR } from "@zqr/core";

new QR("Hello World!")
```

### React

## TODO

- [ ] (core) Support for Kanji Mode
- [ ] (react) Support for using SVG
- [ ] (web) examples using svg
- [ ] package and examples for angular
- [ ] package and examples for vue

## Credits

Inspired from [soldair/node-qrcode](https://github.com/soldair/node-qrcode) by Ryan Day

## License

Zqr is totally free for commercial use and personally use, this software is licensed under the [MIT](https://github.com/yadav-saurabh/zqr/blob/main/LICENSE)

The word "QR Code" is registered trademark of: DENSO WAVE INCORPORATED
