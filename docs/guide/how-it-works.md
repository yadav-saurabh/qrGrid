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
