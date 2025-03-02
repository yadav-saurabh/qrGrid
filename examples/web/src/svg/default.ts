import { QR } from "@qrgrid/core";
import { getSquarePath } from "@qrgrid/styles/svg";

import { setSvgAttributes } from "./utils";
import { DEFAULT_BG_COLOR, DEFAULT_COLOR, DEFAULT_SVG_SIZE } from "../constants";

const svg = document.getElementById("defaultQrSvg") as unknown as SVGSVGElement;
const svgPath = svg.getElementById("defaultQrSvgPath") as SVGElement;

export function generateDefaultQr(qr: QR) {
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
  for (let i = 0; i < qr.data.length; i++) {
    const bit = qr.data[i];
    if (bit) {
      path += getSquarePath(x, y, size);
    }
    x += size;
    if (i % qr.gridSize === qr.gridSize - 1) {
      x = size;
      y += size;
    }
  }
  setSvgAttributes(svgPath, { d: path, fill: DEFAULT_COLOR });
}
