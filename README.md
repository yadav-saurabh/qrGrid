# Zqr

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

## Installation

All the Zqr packages are available through [jsr](https://jsr.io/@zqr)

```bash
# deno
deno add @zqr/package-name # where package-name can be core/react/angular/....
# npm
npx jsr add @zqr/package-name # where package-name can be core/react/angular/....
# yarn
yarn dlx jsr add @zqr/package-name # where package-name can be core/react/angular/....
# pnpm
pnpm dlx jsr add @zqr/package-name # where package-name can be core/react/angular/....
# bun
bunx jsr add @zqr/package-name # where package-name can be core/react/angular/....
```

## Usage

### Core

This package serves as the foundational component for encoding QR codes, utilized by all other zqr packages. For maximum customization and full control over QR code generation, it is recommended to use this core package directly. For detailed examples, see the [web examples](https://github.com/yadav-saurabh/zqr/tree/main/examples/web)

```javascript
import { QR } from "@zqr/core";

new QR("Hello World!")
```

### React

This package serves as a wrapper for `@zqr/core`. For detailed examples, see the [react examples](https://github.com/yadav-saurabh/zqr/tree/main/examples/react)

```javascript
import { Qr } from "@zqr/react";

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

Zqr is totally free for commercial use and personally use, this software is licensed under the [MIT](https://github.com/yadav-saurabh/zqr/blob/main/LICENSE)

The word "QR Code" is registered trademark of: DENSO WAVE INCORPORATED
