import { QR } from "@qrgrid/core";
import { smoothModuleStyle } from "@qrgrid/styles/svg";

import { setSvgAttributes, createSvgNode, generateSvg } from "./utils";

const DEFAULT_SVG_SIZE = 400;
const DEFAULT_BG_COLOR = "black";
const DEFAULT_COLOR = "white";

const svg = generateSvg("smoothEdgesQr");
const svgFinderPath = createSvgNode(svg, "path", { fill: DEFAULT_COLOR });
const svgPath = createSvgNode(svg, "path", { fill: DEFAULT_COLOR });

export function generateSmoothEdgesQrSvgQr(qr: QR) {
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
  let path = {
    codeword: "",
    finder: "",
  };
  for (let i = 0; i < qr.data.length; i++) {
    const bit = qr.data[i];
    if (bit) {
      smoothModuleStyle(path, { index: i, x, y, size }, qr);
    }
    x += size;
    if (i % qr.gridSize === qr.gridSize - 1) {
      x = size;
      y += size;
    }
  }
  setSvgAttributes(svgFinderPath, { d: path.finder });
  setSvgAttributes(svgPath, { d: path.codeword });
}
