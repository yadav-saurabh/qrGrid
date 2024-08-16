import { QR, ReservedBits } from "@qrgrid/core";
import { getSquarePath } from "@qrgrid/styles/svg";

import { setSvgAttributes, createSvgNode, generateSvg } from "./utils";

const DEFAULT_SVG_SIZE = 400;
const DEFAULT_BG_COLOR = "black";
const DEFAULT_COLOR = "white";

const svg = generateSvg("coloredFinderPathQr");
const svgFinderPath = createSvgNode(svg, "path", { fill: DEFAULT_COLOR });
const svgPath = createSvgNode(svg, "path", { fill: DEFAULT_COLOR });

export function generateColoredFinderPathSvgQr(qr: QR) {
  const defaultSvgSize = DEFAULT_SVG_SIZE;

  let size = Math.floor(defaultSvgSize / (qr.gridSize + 1.5));
  const border = Math.ceil(size * qr.gridSize - defaultSvgSize) + size * 2;
  const svgSize = defaultSvgSize + border;
  setSvgAttributes(svg, {
    style: `background:${DEFAULT_BG_COLOR}`,
    height: svgSize,
    width: svgSize,
    viewBox: `0 0 ${svgSize} ${svgSize}`,
  });

  let x = size;
  let y = size;
  let path = "";
  let finderPath = "";
  for (let i = 0; i < qr.data.length; i++) {
    const bit = qr.data[i];
    if (bit) {
      if (qr.reservedBits[i]?.type === ReservedBits.FinderPattern) {
        finderPath += getSquarePath(x, y, size);
      } else {
        path += getSquarePath(x, y, size);
      }
    }
    x += size;
    if (i % qr.gridSize === qr.gridSize - 1) {
      x = size;
      y += size;
    }
  }
  setSvgAttributes(svgFinderPath, { d: finderPath, fill: "#36BA98" });
  setSvgAttributes(svgPath, { d: path });
}
