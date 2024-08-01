# qrgrid React

This package serves as a wrapper for `@qrgrid/core`. For detailed examples, see the [react examples](https://github.com/yadav-saurabh/qrgrid/tree/main/examples/react)

## Installation

```bash
npm i @qrgrid/react
```

## using canvas

```javascript
import { Canvas } from "@qrgrid/react";

<Canvas.Qr input="Hello World!"/>
```

OR

```javascript
import { Qr } from "@qrgrid/react/canvas";

<Qr input="Hello World!"/>
```

## using svg

```javascript
import { Svg } from "@qrgrid/react";

<Svg.Qr input="Hello World!"/>
```

OR

```javascript
import { Qr } from "@qrgrid/react/svg";

<Qr input="Hello World!"/>
```
