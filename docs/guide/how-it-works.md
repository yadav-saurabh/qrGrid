---
title: How It Works
outline: deep
---
<script setup>
import Binary from '../.vitepress/components/howItWorks/Binary.vue'
import GridBinary from '../.vitepress/components/howItWorks/GridBinary.vue'
import ModuleQr from '../.vitepress/components/howItWorks/ModuleQr.vue'
</script>

# How It Works

The process of generating a QR code involves several key steps that ensure the input data is accurately represented and easily scannable

## Data Encoding

The encoding is performed by the `@qrgrid/core` package, which converts the
input data into a binary format. This process transforms the data into a
`Uint8Array` of `1`'s and `0`'s, structured according to QR code specifications.
Proper encoding ensures that the information can be accurately decoded by
QR scanners.

<Binary />

## Grid Formation

After encoding, a grid is created based on the `gridSize`. This grid includes both the modules and a surrounding quiet zone (border) to ensure the QR code is easily detected by scanners. The grid size varies depending on the QR code version, which is determined by the type and length of the encoded data.

<GridBinary />

## Module Assignment

Finally, the binary data is mapped onto the grid. Each `1` corresponds to a dark-colored module, while each `0` corresponds to a light-colored module. This pattern of dark and light modules forms the visual structure of the QR code, allowing it to store and transmit data effectively.

<ModuleQr />

## Code Example

### Data Encoding

Encoding using `@qrgrid/core`

```typescript
import { QR } from "@qrgrid/core";

const qr = new QR("Hello World!");

```

### Grid Formation

Calculate module size

```typescript
import { QR } from "@qrgrid/core";
// data encoding
const qr = new QR("Hello World!");
// [!code focus:8]
// QR_SIZE -> size of QR without border
const moduleSize = Math.floor(QR_SIZE / (qr.gridSize + 1.5));
// calculating border
const border = Math.ceil(moduleSize * qr.gridSize - QR_SIZE) + moduleSize * 2;
// Assuming canvas is used, update the canvas size
canvas.height = QR_SIZE + border;
canvas.width = QR_SIZE + border;
```

Looping through the data

```typescript
import { QR } from "@qrgrid/core";
// data encoding
const qr = new QR("Hello World!");
// [!code focus:4]
let x = moduleSize;
let y = moduleSize;
for (let i = 0; i < qr.data.length; i++) {
  /**
   * Module Assignment logic in between
   */
  x += size; // [!code focus:6]
  if (i % qr.gridSize === qr.gridSize - 1) {
    x = moduleSize;
    y += moduleSize;
  }
}
```

### Module Assignment

Fill the dark modules

```typescript
import { QR } from "@qrgrid/core";
// data encoding
const qr = new QR("Hello World!");
let x = moduleSize;
let y = moduleSize;
for (let i = 0; i < qr.data.length; i++) {
  const bit = qr.data[i]; // [!code focus:5]
  if (bit) {
    // Assuming canvas is used, fill the content
    ctx.fillRect(x, y, moduleSize, moduleSize);
  }
  x += moduleSize;
  if (i % qr.gridSize === qr.gridSize - 1) {
    x = moduleSize;
    y += moduleSize;
  }
}
```
