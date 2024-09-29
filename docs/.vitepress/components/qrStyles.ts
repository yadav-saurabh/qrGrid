import { QR, ReservedBits } from "@qrgrid/core";
import {
  CornerType,
  getCircleOutlinePath,
  getCirclePath,
  getCornerArcPath,
  getRoundCornerPath,
  getSquarePath,
  ModuleType,
} from "@qrgrid/styles/svg";
import { getFinderPatternDetails, getNeighbor } from "@qrgrid/styles/common";
import { ModuleStyleFunctionParams } from "@qrgrid/vue/svg";

const ON_GENERATED_STYLE = 4;

export function roundCornerOuterFinderPatternPath(
  module: ModuleType,
  qr: QR,
  corner: Set<CornerType>
) {
  const { reservedBits } = qr;
  const { index, x, y, size } = module;
  const neighbor = getNeighbor(index, qr);
  const cornerSize = size;

  if (reservedBits[index]?.type === ReservedBits.FinderPattern) {
    let path = "";
    if (
      !neighbor.top &&
      !neighbor.left &&
      !neighbor.bottomRight &&
      corner.has("top-left")
    ) {
      path += getRoundCornerPath(module, ["top-left"], cornerSize);
      const arcCoords = { ...module, y: y + size, x: x + size };
      path += getCornerArcPath(arcCoords, "top-left", cornerSize);
    }
    if (
      !neighbor.top &&
      !neighbor.right &&
      !neighbor.bottomLeft &&
      corner.has("top-right")
    ) {
      path += getRoundCornerPath(module, ["top-right"], cornerSize);
      const arcCoords = { ...module, y: y + size };
      path += getCornerArcPath(arcCoords, "top-right", cornerSize);
    }
    if (
      !neighbor.bottom &&
      !neighbor.right &&
      !neighbor.topLeft &&
      corner.has("bottom-right")
    ) {
      path += getRoundCornerPath(module, ["bottom-right"], cornerSize);
      path += getCornerArcPath(module, "bottom-right", cornerSize);
    }
    if (
      !neighbor.bottom &&
      !neighbor.left &&
      !neighbor.topRight &&
      corner.has("bottom-left")
    ) {
      path += getRoundCornerPath(module, ["bottom-left"], cornerSize);
      const arcCoords = { ...module, x: x + size };
      path += getCornerArcPath(arcCoords, "bottom-left", cornerSize);
    }
    return path;
  }
  return "";
}

export function roundCornerInnerFinderPatternPath(
  module: ModuleType,
  qr: QR,
  corner: Set<CornerType>
) {
  const { reservedBits } = qr;
  const { index, x, y, size } = module;
  const neighbor = getNeighbor(index, qr);
  const cornerSize = size;

  if (reservedBits[index]?.type === ReservedBits.FinderPattern) {
    let path = "";
    if (
      !neighbor.top &&
      !neighbor.left &&
      neighbor.bottomRight &&
      corner.has("top-left")
    ) {
      path += getRoundCornerPath(module, ["top-left"], cornerSize);
    }
    if (
      !neighbor.top &&
      !neighbor.right &&
      neighbor.bottomLeft &&
      corner.has("top-right")
    ) {
      path += getRoundCornerPath(module, ["top-right"], cornerSize);
    }
    if (
      !neighbor.bottom &&
      !neighbor.right &&
      neighbor.topLeft &&
      corner.has("bottom-right")
    ) {
      path += getRoundCornerPath(module, ["bottom-right"], cornerSize);
    }
    if (
      !neighbor.bottom &&
      !neighbor.left &&
      neighbor.topRight &&
      corner.has("bottom-left")
    ) {
      path += getRoundCornerPath(module, ["bottom-left"], cornerSize);
    }
    return path;
  }
  return "";
}

export function roundCornerFinderPatternPath(
  module: ModuleType,
  qr: QR,
  corner: Set<CornerType>
) {
  const { reservedBits } = qr;
  const { index, x, y, size } = module;
  const neighbor = getNeighbor(index, qr);
  const cornerSize = size;

  if (reservedBits[index]?.type === ReservedBits.FinderPattern) {
    let path = "";
    if (!neighbor.top && !neighbor.left && corner.has("top-left")) {
      path += getRoundCornerPath(module, ["top-left"], cornerSize);
      if (!neighbor.bottomRight) {
        const arcCoords = { ...module, y: y + size, x: x + size };
        path += getCornerArcPath(arcCoords, "top-left", cornerSize);
      }
    }
    if (!neighbor.top && !neighbor.right && corner.has("top-right")) {
      path += getRoundCornerPath(module, ["top-right"], cornerSize);
      if (!neighbor.bottomLeft) {
        const arcCoords = { ...module, y: y + size };
        path += getCornerArcPath(arcCoords, "top-right", cornerSize);
      }
    }
    if (!neighbor.bottom && !neighbor.right && corner.has("bottom-right")) {
      path += getRoundCornerPath(module, ["bottom-right"], cornerSize);
      if (!neighbor.topLeft) {
        path += getCornerArcPath(module, "bottom-right", cornerSize);
      }
    }
    if (!neighbor.bottom && !neighbor.left && corner.has("bottom-left")) {
      path += getRoundCornerPath(module, ["bottom-left"], cornerSize);
      if (!neighbor.topRight) {
        const arcCoords = { ...module, x: x + size };
        path += getCornerArcPath(arcCoords, "bottom-left", cornerSize);
      }
    }
    return path || getSquarePath(module.x, module.y, module.size);
  }
  return "";
}

export function smoothDataBitPath(
  module: ModuleType,
  qr: QR,
  corner: Set<CornerType>
) {
  const { reservedBits } = qr;
  const { index, x, y, size } = module;
  if (reservedBits[index]?.type === ReservedBits.FinderPattern) {
    return;
  }
  let path = "";
  const neighbor = getNeighbor(index, qr);
  const cornerDist = size * 0.5;

  if (!neighbor.left && neighbor.topLeft && corner.has("top-right")) {
    const arcCoords = { ...module };
    path += getCornerArcPath(arcCoords, "top-right", cornerDist);
  }
  if (!neighbor.left && neighbor.bottomLeft && corner.has("bottom-right")) {
    const arcCoords = { ...module, y: y + size };
    path += getCornerArcPath(arcCoords, "bottom-right", cornerDist);
  }
  if (!neighbor.right && neighbor.topRight && corner.has("top-left")) {
    const arcCoords = { ...module, x: x + size };
    path += getCornerArcPath(arcCoords, "top-left", cornerDist);
  }
  if (!neighbor.right && neighbor.bottomRight && corner.has("bottom-left")) {
    const arcCoords = { ...module, x: x + size, y: y + size };
    path += getCornerArcPath(arcCoords, "bottom-left", cornerDist);
  }

  const smoothCorners: CornerType[] = [];

  if (
    !neighbor.topLeft &&
    !neighbor.top &&
    !neighbor.left &&
    corner.has("top-left")
  ) {
    smoothCorners.push("top-left");
  }
  if (
    !neighbor.topRight &&
    !neighbor.top &&
    !neighbor.right &&
    corner.has("top-right")
  ) {
    smoothCorners.push("top-right");
  }
  if (
    !neighbor.bottomLeft &&
    !neighbor.bottom &&
    !neighbor.left &&
    corner.has("bottom-left")
  ) {
    smoothCorners.push("bottom-left");
  }
  if (
    !neighbor.bottomRight &&
    !neighbor.bottom &&
    !neighbor.right &&
    corner.has("bottom-right")
  ) {
    smoothCorners.push("bottom-right");
  }

  if (smoothCorners.length) {
    path += getRoundCornerPath(module, smoothCorners, cornerDist);
    return path;
  }

  return path + getSquarePath(x, y, size);
}

const corners = new Set<CornerType>([
  "top-left",
  "top-right",
  "bottom-right",
  "bottom-left",
]);
export function getQrPaths(
  style: number,
  module: ModuleStyleFunctionParams[1],
  qr: QR
) {
  const { reservedBits } = qr;
  const { x, y, size } = module;
  let finder = "";
  let codeword = "";

  // if finder pattern
  if (reservedBits[module.index]?.type === ReservedBits.FinderPattern) {
    // finder style for #1
    if (style === 1) {
      finder += getSquarePath(x, y, size);
    }
    // finder style for #2
    if (style === 2) {
      finder += roundCornerFinderPatternPath(module, qr, corners);
    }
    // finder style for #3
    if (style === 3) {
      finder += getCirclePath(x, y, size);
    }
    // finder style for #4
    if (style === ON_GENERATED_STYLE) {
      // skipping for style 4
      finder = "";
    }
    return { codeword, finder };
  }

  // codeword style for #1
  if (style === 1) {
    codeword += getSquarePath(x, y, size);
  }
  // codeword style for #2
  if (style === 2) {
    codeword += smoothDataBitPath(module, qr, corners);
  }
  // codeword style for #3
  if (style === 3) {
    codeword += getCirclePath(x, y, size);
  }
  // codeword style for #4
  if (style === ON_GENERATED_STYLE) {
    codeword += getCirclePath(x, y, size);
  }
  return { codeword, finder };
}

export function getOnGeneratedQrPaths(value: number, size: number, qr: QR) {
  let finder = "";
  let codeword = "";

  // only for style #4
  if (value !== ON_GENERATED_STYLE) {
    return { codeword, finder };
  }

  const { positions, sizes } = getFinderPatternDetails(size, qr);
  for (let i = 0; i < positions.inner.length; i++) {
    const pos = positions.inner[i];
    finder += getCirclePath(pos.x, pos.y, sizes.inner);
  }
  for (let i = 0; i < positions.outer.length; i++) {
    const pos = positions.outer[i];
    finder += getCircleOutlinePath(pos.x, pos.y, sizes.outer);
  }

  return { codeword, finder };
}
