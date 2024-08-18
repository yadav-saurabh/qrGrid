#!/usr/bin/env node
/**
 * Qr function to generate QR Code prints to cli or save as a svg file on disk
 * @module
 */
import fs from "fs/promises";
import {
  QrOptions,
  QR,
  ReservedBits,
  ErrorCorrectionLevel,
} from "@qrgrid/core";

import { cliOptions } from "./cli.js";

const DEFAULT_SIZE = 400;
const DEFAULT_BG_COLOR = "black";
const DEFAULT_COLOR = "white";
const UTF_CHAR = {
  blank: " ",
  bottom: "▄",
  full: "█",
  top: "▀",
};

let qrOptions = {};
if (cliOptions?.errorCorrection) {
  const ec = cliOptions.errorCorrection as keyof typeof ErrorCorrectionLevel;
  if (!(ec in ErrorCorrectionLevel)) {
    console.log("error: errorCorrection is not a valid one");
    process.exit(1);
  }
  qrOptions = { errorCorrection: ec };
}
generateQr(cliOptions.input as string, qrOptions);

/**
 * write file to disk
 */
async function saveFile(data: string, name = "QrGrid.svg") {
  let fileName: string = (cliOptions.file as string) || name;
  if (fileName.slice(fileName.length - 4) !== ".svg") {
    fileName += ".svg";
  }
  await fs.writeFile(fileName, data);
}

/**
 * To apply default module style
 */
function applyModuleStyle(
  path: { codeword: string; finder: string },
  module: { index: number; x: number; y: number; size: number },
  qr: QR
) {
  const { x, y, size, index } = module;
  if (qr.reservedBits[index]?.type === ReservedBits.FinderPattern) {
    path.finder += `M${x} ${y}v${size}h${size}v-${size}z`;
  } else {
    path.codeword += `M${x} ${y}v${size}h${size}v-${size}z`;
  }
}

/**
 * generates the svg string
 */
function generateSvg(qr: QR) {
  // svg meta string
  const svgMeta =
    '<svg xmlns="http://www.w3.org/2000/svg" height="{{size}}" width="{{size}}" viewBox="0 0 {{size}} {{size}}" style="background: {{bgColor}};"><path id="finder" fill="{{finderColor}}" d="{{finderPath}}" /><path id="codeword" fill="{{codewordColor}}" d="{{codewordPath}}" /></svg>';
  // calculate module size and adjusting svg to height and wight
  const initialSvgSize = DEFAULT_SIZE;
  let size = Math.floor(initialSvgSize / (qr.gridSize + 1.5));
  const border = Math.ceil(size * qr.gridSize - initialSvgSize) + size * 2;
  const svgSize = initialSvgSize + border;
  // placing each modules in x,y position in the svg
  let x = size;
  let y = size;
  let path = { finder: "", codeword: "" };
  for (let i = 0; i < qr.data.length; i++) {
    const bit = qr.data[i];
    if (bit) {
      applyModuleStyle(path, { index: i, x, y, size }, qr);
    }
    x += size;
    if (i % qr.gridSize === qr.gridSize - 1) {
      x = size;
      y += size;
    }
  }
  return svgMeta
    .replaceAll("{{size}}", svgSize.toString())
    .replace("{{bgColor}}", DEFAULT_BG_COLOR)
    .replace("{{finderColor}}", DEFAULT_COLOR)
    .replace("{{codewordColor}}", DEFAULT_COLOR)
    .replace("{{finderPath}}", path.finder)
    .replace("{{codewordPath}}", path.codeword);
}

export function generateQr(input: string, qrOptions?: QrOptions) {
  // generate the qr data
  const qr = new QR(input, qrOptions);

  // print / save svg file if using cli
  let cliTxt = "\n";
  if (!cliOptions.silent) {
    for (let i = 0; i < qr.gridSize; i += 2) {
      cliTxt += " ";
      for (let j = 0; j < qr.gridSize; j++) {
        const top = qr.data[i * qr.gridSize + j];
        const bottom = qr.data[(i + 1) * qr.gridSize + j];
        if (top && bottom) {
          cliTxt += UTF_CHAR.full;
        } else if (top && !bottom) {
          cliTxt += UTF_CHAR.top;
        } else if (!top && bottom) {
          cliTxt += UTF_CHAR.bottom;
        } else {
          cliTxt += UTF_CHAR.blank;
        }
      }
      cliTxt += "\n";
    }
    process.stdout.write(cliTxt);
  }
  // save svg file
  if (cliOptions.file || cliOptions.silent) {
    const svg = generateSvg(qr);
    saveFile(svg);
  }
  return cliTxt;
}
