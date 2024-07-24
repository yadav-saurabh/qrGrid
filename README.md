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

```javascript
console.log(qr);
// outputs:
{
  data: [1,0,1,0,...] // Qr data representation, Unit8Array bits array contains 0's and 1's
  segments: [{mode: 'Binary', value: "Hello World!"}...] // Qr segments data representation
  version: 1, // version used to generate the qr code
  noOfModules: 21 // no of module in the qr, 21 x 21 for version 1
  errorCorrection: "M" // error correction level used to generate the qr code, default M
  reservedBits: {'0': { type: "FinderPattern", dark: true },...} // reserved bits in the generated qr
  maskPatten: 2 // mask pattern used
}

```

### React

## Credits

Inspired from [soldair/node-qrcode](https://github.com/soldair/node-qrcode) by Ryan Day

## License

Zqr is totally free for commercial use and personally use, this software is licensed under the [MIT](https://github.com/yadav-saurabh/zqr/blob/main/LICENSE)

The word "QR Code" is registered trademark of: DENSO WAVE INCORPORATED
