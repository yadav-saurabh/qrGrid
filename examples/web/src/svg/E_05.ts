import { QR, ReservedBits } from "@qrgrid/core";

import { setSvgAttributes, createSvgNode, generateSvg } from "./utils";
import {
  DEFAULT_BG_COLOR,
  DEFAULT_COLOR,
  DEFAULT_SVG_SIZE,
  FINDER_COLOR,
} from "../constants";

const svg = generateSvg("E 05");
const svgFinderPath = createSvgNode(svg, "path", { fill: FINDER_COLOR });
const svgPath = createSvgNode(svg, "path", { fill: DEFAULT_COLOR });

export function E_05(qr: QR) {
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
      const newSize = size * 0.95;
      const squarePath = `M${x} ${y}v${newSize}h${newSize}v-${newSize}z`;
      if (qr.reservedBits[i]?.type === ReservedBits.FinderPattern) {
        path.finder += squarePath;
      } else {
        path.codeword += squarePath;
      }
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
