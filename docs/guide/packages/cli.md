---
title: Cli
outline: deep
---

# Cli

The `@qrgrid/cli` is a command-line tool for generating QR codes directly in the terminal.

## Installation and Usage

You can run the CLI tool without installing it globally, using one of the following package managers:

::: code-group

```sh [npm]
npx @qrgrid/cli -i "Hello world"
```

```sh [bun]
bunx @qrgrid/cli -i "Hello world"
```

```sh [pnpm]
pnpm dlx @qrgrid/cli -i "Hello world"
```

```sh [yarn]
yarn dlx @qrgrid/cli -i "Hello world"
```

:::

| Option            |  Alias | Description                                                    |
| ----------------  |  ------ | ------------------------------------------------------------- |
| --input           |  -i     | Input data for generating the QR code.                        |
| --errorCorrection |  -ec    | Set the error correction level (L, M, Q, H). Default `M`      |
| --file            |  -f     | Save the QR code to a specified file path. (SVG format only)  |
| --version         |  -v     | Output the version number of the CLI.                         |
| --silent          |  -s     | Skip printing the QR code to the terminal (use with -f).      |
| --help            |  -h     | Display help information for the CLI.                         |

## Examples

Generate and display a QR code for "Hello World" in the terminal:

```sh

npx @qrgrid/cli -i "Hello World"
```

Generate a QR code and save it as a SVG file:

```sh

npx @qrgrid/cli -i "Hello World" -f qr.svg
```

Run the CLI silently and save the output without displaying it:

```sh

npx @qrgrid/cli -i "Hello World" -f qr.svg -s
```
