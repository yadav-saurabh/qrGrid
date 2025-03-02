import { QR, ReservedBits } from "@qrgrid/core";

import { setSvgAttributes, createSvgNode, generateSvg } from "./utils";
import {
  DEFAULT_BG_COLOR,
  DEFAULT_COLOR,
  DEFAULT_SVG_SIZE,
  FINDER_COLOR,
} from "../constants";
import { getFinderPatternDetails, isOuterFinderPattern } from "@qrgrid/styles/common";
import { getCirclePath, getSquarePath } from "@qrgrid/styles/svg";

const svg = generateSvg("E 06");
const svgFinderPath = createSvgNode(svg, "path", { fill: FINDER_COLOR });
const svgPath = createSvgNode(svg, "path", { fill: DEFAULT_COLOR });

export function E_06(qr: QR) {
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
      if (qr.reservedBits[i]?.type === ReservedBits.FinderPattern) {
        if (isOuterFinderPattern(i, qr)) {
          path.finder += getSquarePath(x, y, size);
        }
      } else {
        const newSize = size * 0.95;
        const squarePath = `M${x} ${y}v${newSize}h${newSize}v-${newSize}z`;
        path.codeword += squarePath;
      }
    }
    x += size;
    if (i % qr.gridSize === qr.gridSize - 1) {
      x = size;
      y += size;
    }
  }

  const { positions, sizes } = getFinderPatternDetails(size, qr);
  for (let i = 0; i < positions.inner.length; i++) {
    const pos = positions.inner[i];
    path.finder += getCirclePath(pos.x, pos.y, sizes.inner);
  }

  setSvgAttributes(svgFinderPath, { d: path.finder });
  setSvgAttributes(svgPath, { d: path.codeword });
}
