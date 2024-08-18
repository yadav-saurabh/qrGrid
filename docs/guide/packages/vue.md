---
title: Vue
outline: deep
---

# Vue

Implementation of the Qr grid library for Vue applications.

## Installation

::: code-group

```sh [npm]
npm install @qrgrid/vue
```

```sh [bun]
bun add @qrgrid/vue
```

```sh [pnpm]
pnpm install @qrgrid/vue
```

```sh [yarn]
yarn add @qrgrid/vue
```

:::

## Using Canvas

```vue
<script>
  import { Qr } from "@qrgrid/vue/canvas";
</script>

<template>
  <Qr input="Hello World!" />
</template>
```

OR

```vue
<script>
  import { Canvas } from "@qrgrid/vue";
</script>

<template>
  <Canvas input="Hello World!" />
</template>
```

### Props

| Prop        | Type                                                        | Description    | Default               |
| ----------- | ----------------------------------------------------------- | -------------- | --------------------- |
| input       | string                                                      | Data to encode |                       |
| qrOptions?  | [QrOptions](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/core/src/qr.ts#L47-L49) | Options for QR encoding |     |
| image?      | [QrImageOption](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/vue/src/canvas/types.ts#L29-L33) | Image options for the image in QR code | sizePercent: `20` <br> opacity: `1`  |
| size?        | number                                                      | Canvas size |  400   |
| bgColor?     | [QrColor](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/vue/src/canvas/types.ts#L22) \| ((ctx: CanvasRenderingContext2D) => [QrColor]((https://github.com/yadav-saurabh/qrGrid/blob/main/packages/vue/src/canvas/types.ts#L22)))     | Background color | black   |
| color?       | [QrColor](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/vue/src/canvas/types.ts#L22) \| ((ctx: CanvasRenderingContext2D) => [QrColor]((https://github.com/yadav-saurabh/qrGrid/blob/main/packages/vue/src/canvas/types.ts#L22)))     | QR code color |  white   |
| moduleStyle?        | [ModuleStyleFunction](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/vue/src/canvas/types.ts#L10-L14)               | Custom styles for QR modules |    |
| getQrData?        | (qr: [QR](./core#properties)) => void;               | Retrieve QR data |     |
| getCanvasCtx?        | (ctx: CanvasRenderingContext2D) => void;               | Retrieve canvas context |     |
| onGenerated?        | (ctx: CanvasRenderingContext2D, size: number, qr: [QR](./core#properties)) => void;               | Callback once QR code is generated |     |

[see the props in code.](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/vue/src/canvas/types.ts#L38-L49)

## Using Svg

```vue
<script>
  import { Qr } from "@qrgrid/vue/svg";
</script>

<template>
  <Qr input="Hello World!"/>
</template>
```

OR

```vue
<script>
  import { Svg } from "@qrgrid/vue";
</script>

<template>
  <Svg input="Hello World!" />
</template>
```

### Props

| Prop        | Type                                                        | Description    | Default               |
| ----------- | ----------------------------------------------------------- | -------------- | --------------------- |
| input       | string                                                      | Data to encode |                       |
| qrOptions?  | [QrOptions](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/core/src/qr.ts#L47-L49) | Qr Options for QR encoding |     |
| image?      | [QrImageOption](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/vue/src/svg/types.ts#L21-L25) | Image options for image in the QR code | sizePercent: `20` <br> opacity: `1`  |
| size?        | number                                                      | SVG size |  400   |
| bgColor?     | string                                                      | Background color | black   |
| color?       | string \| \{ codeword?: string; finder?: string \}  | QR code color            |  white   |
| moduleStyle? | [ModuleStyleFunction](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/vue/src/svg/types.ts#L10-L14)               | Custom styles for QR modules |    |
| getQrData?    | (qr: [QR](./core#properties)) => void;               | get Qr data |     |
| onGenerated?  | (path: ModuleStyleFunctionParams[0], size: number, qr: [QR](./core#properties))  => void; | Callback once QR code is generated |     |

[see the props in code.](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/vue/src/svg/types.ts#L30-L44)

## Examples

Explore [Styles](./styles) for custom styling and other utilities

- Basic

  ```vue
  <Qr input="Hello World!" />
  ```

- ErrorCorrection

  ```vue
  <Qr input="Hello World!" :qrOptions="{errorCorrection: 'H'}" />
  ```

- Color

  ```vue
  <Qr input="Hello World!" bgColor="#F8EDED" color="#173B45" />
  ```

- Module Style from [@qrgrid/styles](https://www.npmjs.com/package/@qrgrid/styles)

  ```vue
  <script>
    import { dotModuleStyle } from "@qrgrid/styles/canvas/styles";
  </script>

  <template>
    <Qr input="Hello World!" :moduleStyle="dotModuleStyle" />
  </template>

  ```

  ```vue
  <script>
    import { smoothModuleStyle } from "@qrgrid/styles/canvas/styles";
  </script>

  <template>
    <Qr input="Hello World!" :moduleStyle="smoothModuleStyle" />
  </template>
  ```

- Images

  ```vue
  <Qr input="Hello World!" :image="{ src: './vite.svg' }" />
  ```

- Downloading using [@qrgrid/styles](https://www.npmjs.com/package/@qrgrid/styles)

  :::code-group

  ```vue [Canvas]
  <script>
    import { Qr } from "@qrgrid/vue/canvas";
    import { downloadQr} from "@qrgrid/styles/canvas/utils";

    const qrRef = ref<InstanceType<typeof Qr> | null>(null);

    const download = () => {
      if (qrRef.value?.canvasRef) {
        downloadQr(qrRef.value?.canvasRef);
      }
    };
  </script>
  
  <template>
    <Qr input="Hello World!" ref="qrRef" />
  </template>
  ```

  ```vue [Svg]
  <script>
    import { Qr } from "@qrgrid/vue/svg";
    import { downloadQr} from "@qrgrid/styles/canvas/utils";

    const qrRef = ref<InstanceType<typeof Qr> | null>(null);

    const download = () => {
      if (qrRef.value?.svgRef) {
        downloadQr(qrRef.value?.svgRef);
      }
    };
  </script>
  
  <template>
    <Qr input="Hello World!" ref="qrRef" />
  </template>
  ```

  :::

For more examples and customization options, [see the examples.](https://github.com/yadav-saurabh/qrGrid/tree/main/examples/vue/)
