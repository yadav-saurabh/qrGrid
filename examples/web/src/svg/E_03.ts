import { QR } from "@qrgrid/core";
import { dotModuleStyle } from "@qrgrid/styles/svg";

import { setSvgAttributes, createSvgNode, generateSvg } from "./utils";
import {
  DEFAULT_BG_COLOR,
  DEFAULT_COLOR,
  DEFAULT_SVG_SIZE,
  FINDER_COLOR,
} from "../constants";

const svg = generateSvg("E 03");
const svgFinderPath = createSvgNode(svg, "path", { fill: FINDER_COLOR });
const svgPath = createSvgNode(svg, "path", { fill: DEFAULT_COLOR });

export function E_03(qr: QR) {
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
      dotModuleStyle(path, { index: i, x, y, size }, qr);
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
