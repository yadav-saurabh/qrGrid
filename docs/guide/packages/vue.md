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

```jsx
import { Qr } from "@qrgrid/vue/canvas";

<Qr input="Hello World!"/>
```

OR

```jsx
import { Canvas } from "@qrgrid/vue";

<Canvas.Qr input="Hello World!"/>
```

## Using Svg

```jsx
import { Svg } from "@qrgrid/vue";

<Svg.Qr input="Hello World!"/>
```

OR

```jsx
import { Qr } from "@qrgrid/vue/svg";

<Qr input="Hello World!"/>
```
