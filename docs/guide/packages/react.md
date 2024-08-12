---
title: React
---

# React

Implementation of the Qr grid library for React applications.

## Installation

::: code-group

```sh [npm]
npm install @qrgrid/react
```

```sh [bun]
bun add @qrgrid/react
```

```sh [pnpm]
pnpm install @qrgrid/react
```

```sh [yarn]
yarn add @qrgrid/react
```

:::

## Using Canvas

```jsx
import { Qr } from "@qrgrid/react/canvas";

<Qr input="Hello World!"/>
```

OR

```jsx
import { Canvas } from "@qrgrid/react";

<Canvas.Qr input="Hello World!"/>
```

### Examples

Basic Qr

```jsx
<Qr input="Hello World!"/>
```

Qr using `H` as ErrorCorrection

```jsx
<Qr input="Hello World!" qrOptions= {{errorCorrection: 'H'}}/>
```

<!-- ### Props

See the props and it's type [here](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/react/src/canvas/types.ts#L38-L49) -->

## Using Svg

```jsx
import { Svg } from "@qrgrid/react";

<Svg.Qr input="Hello World!"/>
```

OR

```jsx
import { Qr } from "@qrgrid/react/svg";

<Qr input="Hello World!"/>
```

<!-- See the props and it's type [here](https://github.com/yadav-saurabh/qrGrid/blob/main/packages/react/src/svg/types.ts#L30-L44) -->
