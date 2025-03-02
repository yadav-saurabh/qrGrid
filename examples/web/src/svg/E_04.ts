import { QR, ReservedBits } from "@qrgrid/core";
import { getCircleOutlinePath, getCirclePath } from "@qrgrid/styles/svg";

import { setSvgAttributes, createSvgNode, generateSvg } from "./utils";
import {
  DEFAULT_BG_COLOR,
  DEFAULT_COLOR,
  DEFAULT_SVG_SIZE,
  FINDER_COLOR,
} from "../constants";
import { getFinderPatternDetails } from "@qrgrid/styles/common";

const svg = generateSvg("E 04");
const svgFinderPath = createSvgNode(svg, "path", { fill: FINDER_COLOR });
const svgPath = createSvgNode(svg, "path", { fill: DEFAULT_COLOR });

export function E_04(qr: QR) {
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
      if (!(qr.reservedBits[i]?.type === ReservedBits.FinderPattern)) {
        path.codeword += getCirclePath(x, y, size);
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
  for (let i = 0; i < positions.outer.length; i++) {
    const pos = positions.outer[i];
    path.finder += getCircleOutlinePath(pos.x, pos.y, sizes.outer);
  }
  setSvgAttributes(svgFinderPath, { d: path.finder });
  setSvgAttributes(svgPath, { d: path.codeword });
}
