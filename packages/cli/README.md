# @qrgrid/cli

<p>
  <a href="https://www.npmjs.com/package/@qrgrid/cli"><img src="https://img.shields.io/npm/v/@qrgrid/cli" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@qrgrid/cli"><img src="https://img.shields.io/npm/dm/@qrgrid/cli" alt="npm downloads"></a>
  <a href="https://github.com/yadav-saurabh/qrGrid/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@qrgrid/cli" alt="MIT License"></a>
</p>

Generate QR codes from your terminal. Displays them using Unicode block characters and can save them as SVG files. No configuration needed, works with `npx`.

Part of [QR Grid](https://github.com/yadav-saurabh/qrgrid).

**[Docs](https://www.qrgrid.dev/guide/packages/cli)**

## Quick start

No install required:

```bash
npx @qrgrid/cli -i "Hello World"
```

This prints a scannable QR code right in your terminal.

## Install globally (optional)

```bash
npm install -g @qrgrid/cli

qrgrid -i "Hello World"
```

## Save as SVG

```bash
npx @qrgrid/cli -i "https://yoursite.com" -f qr.svg
```

This both prints the QR code to your terminal and saves it as an SVG file. If you only want the file without terminal output, add `-s`:

```bash
npx @qrgrid/cli -i "https://yoursite.com" -f qr.svg -s
```

## Common use cases

```bash
# URL
npx @qrgrid/cli -i "https://yoursite.com"

# WiFi network (scannable on phones)
npx @qrgrid/cli -i "WIFI:T:WPA;S:MyNetwork;P:MyPassword;;"

# email address
npx @qrgrid/cli -i "mailto:hello@example.com"

# phone number
npx @qrgrid/cli -i "tel:+1234567890"

# plain text
npx @qrgrid/cli -i "Meet me at the coffee shop at 3pm"

# with high error correction
npx @qrgrid/cli -i "Hello World" -ec H

# save to file with custom error correction, no terminal output
npx @qrgrid/cli -i "Hello World" -ec H -f output.svg -s
```

## All options

| Option                      | Short | Description                                  |
| --------------------------- | ----- | -------------------------------------------- |
| `--input <value>`           | `-i`  | Data to encode (required)                    |
| `--file <path>`             | `-f`  | Save as SVG file at this path                |
| `--errorCorrection <level>` | `-ec` | Error correction: L, M, Q, or H (default: M) |
| `--silent`                  | `-s`  | Skip terminal output (use with `--file`)     |
| `--version`                 | `-v`  | Print CLI version                            |
| `--help`                    | `-h`  | Show help                                    |

## How the terminal rendering works

The CLI uses Unicode half-block characters to display QR codes. It processes two rows of modules at a time, combining them into a single terminal character:

| Top module | Bottom module | Character              |
| ---------- | ------------- | ---------------------- |
| dark       | dark          | `█` (full block)       |
| dark       | light         | `▀` (upper half block) |
| light      | dark          | `▄` (lower half block) |
| light      | light         | ` ` (space)            |

This doubles the effective vertical resolution, so QR codes look proportional in the terminal even though terminal characters are taller than they are wide.

## License

[MIT](https://github.com/yadav-saurabh/qrgrid/blob/main/LICENSE)
