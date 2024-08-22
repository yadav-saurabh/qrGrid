---
title: Server
outline: deep
---

# Server

The `@qrgrid/server` package is designed for non-DOM JavaScript environments like backend applications. It generates SVG-based QR codes that can be further customized or sent directly to the frontend.

## Installation

::: code-group

```sh [npm]
npm install @qrgrid/server
```

```sh [bun]
bun add @qrgrid/server
```

```sh [pnpm]
pnpm install @qrgrid/server
```

```sh [yarn]
yarn add @qrgrid/server
```

:::

## Usage

```typescript
import { generateQr } from "@qrgrid/server";

const svgQr = generateQr("hello world from server");
```

### Parameters

| Parameter | Type                       | Description                        |
| --------- | -------------------------- | ---------------------------------- |
| input     | string                     | Data to encode                     |
| options?  | [QrOptionType](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/server/src/index.ts#L21-L33) | Optional configurations for the QR code. |

## Example

- Generating a simple QR code

  ```typescript
  import { generateQr } from "@qrgrid/server";

  const qr = generateQr("hello world from server");
  ```

- Module Style from [@qrgrid/styles](https://www.npmjs.com/package/@qrgrid/styles)

  ```typescript
  import { generateQr } from "@qrgrid/server";
  import { dotModuleStyle } from "@qrgrid/styles/svg/styles";

  const qr1 = generateQr("hello world from server", { moduleStyle: dotModuleStyle });
  ```

- Generating a QR code and serving it as an SVG via an Express API

  ```typescript
  import { generateQr } from "@qrgrid/server";
  import express from "express";
  // init express
  const app = express();
  // api routes
  app.use("/", (req, res) => {
    const qr = generateQr("hello world from server");
    res.set("Content-Type", "text/html");
    res.send(Buffer.from(qr));
  });
  // listen to port
  app.listen(5000, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  ```

For more examples and customization options, [see the examples.](https://github.com/yadav-saurabh/qrGrid/tree/main/examples/server)
