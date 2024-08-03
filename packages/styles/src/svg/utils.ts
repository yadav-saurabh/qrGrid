/**
 * Utils functions that can be used in styling the module or downloading the qr image
 * @module
 */
import { QR, ReservedBits } from "@qrgrid/core";

export type ModuleType = { index: number; x: number; y: number; size: number };
export type PathType = { codeword: string; finder: string };

export type CornerType =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

/**
 * get Neighbor status of the given index
 */
export function getNeighbor(index: number, qr: QR) {
  const { noOfModules, data } = qr;

  const firstModule = index % noOfModules === 0;
  const lastModule = index % noOfModules === noOfModules - 1;

  const leftNeighbor = data[index - 1];
  const rightNeighbor = data[index + 1];
  const topNeighbor = data[index - noOfModules];
  const bottomNeighbor = data[index + noOfModules];

  const topLeftNeighbor = data[index - noOfModules - 1];
  const topRightNeighbor = data[index - noOfModules + 1];
  const bottomLeftNeighbor = data[index + noOfModules - 1];
  const bottomRightNeighbor = data[index + noOfModules + 1];

  return {
    left: !firstModule && leftNeighbor,
    right: !lastModule && rightNeighbor,
    top: topNeighbor,
    bottom: bottomNeighbor,
    topLeft: !firstModule && topLeftNeighbor,
    topRight: !lastModule && topRightNeighbor,
    bottomLeft: !firstModule && bottomLeftNeighbor,
    bottomRight: !lastModule && bottomRightNeighbor,
  };
}

/**
 * make a module corner (square) round
 */
export function getRoundCornerPath(
  module: ModuleType,
  type: CornerType[],
  cornerSize = 0
) {
  const { x, y, size } = module;
  let d = cornerSize || 0.5 * size;
  let topLeft = false;
  let topRight = false;
  let bottomLeft = false;
  let bottomRight = false;

  for (let i = 0; i < type.length; i++) {
    const corner = type[i];
    if (corner === "bottom-left") {
      bottomLeft = true;
    }
    if (corner === "top-left") {
      topLeft = true;
    }
    if (corner === "top-right") {
      topRight = true;
    }
    if (corner === "bottom-right") {
      bottomRight = true;
    }
  }

  let path = `M${topLeft ? x + d : x} ${y}`;
  path += topLeft ? `q${-d} 0 ${-d} ${d}` : "";
  path += bottomLeft
    ? `v${topLeft ? size - d - d : size - d} q0 ${d} ${d} ${d}`
    : `v${topLeft ? size - d : size}`;
  path += bottomRight
    ? `h${bottomLeft ? size - d - d : size - d} q${d} 0 ${d} ${-d}`
    : `h${bottomLeft ? size - d : size}`;
  path += topRight
    ? `v-${bottomRight ? size - d - d : size - d} q0 ${-d} ${-d} ${-d}`
    : `v-${bottomRight ? size - d : size}`;

  return (path += "z");
}

/**
 * get the path string to draw a circle
 */
export function getCornerArcPath(
  module: ModuleType,
  type: CornerType,
  cornerSize = 0
) {
  const { x, y, size } = module;
  const d = cornerSize || 0.5 * size;
  if (type === "top-left") {
    return `M${x - d} ${y} h${d}v${d}Q${x} ${y} ${x + d} ${y}z`;
  }
  if (type === "top-right") {
    return `M${x + size} ${y} v${d}Q${x + size} ${y} ${x + d} ${y}z`;
  }
  if (type === "bottom-left") {
    return `M${x} ${y + size} h${d}Q${x} ${y + size} ${x} ${y + d}z`;
  }
  if (type === "bottom-right") {
    return `M${x + d} ${y + size} h${d}v${-d}Q${x + size} ${y + size} ${x + d} ${y + size}z`;
  }
  return "";
}

/**
 * get the path string to draw a circle
 */
export function getCirclePath(x: number, y: number, size: number) {
  const r = Math.floor(size / 2);
  let cx = x + r;
  let cy = y + r;
  return `M${cx - r} ${cy}a ${r} ${r} 0 1 0 ${r * 2} 0a ${r} ${r} 0 1 0 -${r * 2} 0`;
}

/**
 * get the path string draw a square
 */
export function getSquarePath(x: number, y: number, size: number) {
  return `M${x} ${y}v${size}h${size}v-${size}z`;
}

/**
 * get smooth edge path
 */
export function getSmoothDataBitPath(module: ModuleType, qr: QR) {
  const { reservedBits } = qr;
  const { index, x, y, size } = module;
  if (reservedBits[index]?.type === ReservedBits.FinderPattern) {
    return;
  }
  let path = "";
  const neighbor = getNeighbor(index, qr);
  const cornerDist = size * 0.5;

  if (!neighbor.left && neighbor.topLeft) {
    const arcCoords = { ...module, x: x - size };
    path += getCornerArcPath(arcCoords, "top-right", cornerDist);
  }
  if (!neighbor.left && neighbor.bottomLeft) {
    const arcCoords = { ...module, x: x - size };
    path += getCornerArcPath(arcCoords, "bottom-right", cornerDist);
  }
  if (!neighbor.right && neighbor.topRight) {
    const arcCoords = { ...module, x: x + size };
    path += getCornerArcPath(arcCoords, "top-left", cornerDist);
  }
  if (!neighbor.right && neighbor.bottomRight) {
    const arcCoords = { ...module, x: x + size };
    path += getCornerArcPath(arcCoords, "bottom-left", cornerDist);
  }

  const corners: CornerType[] = [];

  if (!neighbor.topLeft && !neighbor.top && !neighbor.left) {
    corners.push("top-left");
  }
  if (!neighbor.topRight && !neighbor.top && !neighbor.right) {
    corners.push("top-right");
  }
  if (!neighbor.bottomLeft && !neighbor.bottom && !neighbor.left) {
    corners.push("bottom-left");
  }
  if (!neighbor.bottomRight && !neighbor.bottom && !neighbor.right) {
    corners.push("bottom-right");
  }

  if (corners.length) {
    path += getRoundCornerPath(module, corners, cornerDist);
    return path;
  }

  return path + getSquarePath(x, y, size);
}

/**
 * get finderPatterns path to make it round
 */
export function roundCornerFinderPatternPath(module: ModuleType, qr: QR) {
  const { reservedBits } = qr;
  const { index, x, y, size } = module;
  const neighbor = getNeighbor(index, qr);

  if (reservedBits[index]?.type === ReservedBits.FinderPattern) {
    let path = "";
    if (!neighbor.top && !neighbor.left) {
      path += getRoundCornerPath(module, ["top-left"]);
      if (!neighbor.bottomRight) {
        const arcCoords = { ...module, y: y + size, x: x + size };
        path += getCornerArcPath(arcCoords, "top-left");
      }
    }
    if (!neighbor.top && !neighbor.right) {
      path += getRoundCornerPath(module, ["top-right"]);
      if (!neighbor.bottomLeft) {
        const arcCoords = { ...module, y: y + size, x: x - size };
        path += getCornerArcPath(arcCoords, "top-right");
      }
    }
    if (!neighbor.bottom && !neighbor.right) {
      path += getRoundCornerPath(module, ["bottom-right"]);
      if (!neighbor.topLeft) {
        const arcCoords = { ...module, y: y - size, x: x - size };
        path += getCornerArcPath(arcCoords, "bottom-right");
      }
    }
    if (!neighbor.bottom && !neighbor.left) {
      path += getRoundCornerPath(module, ["bottom-left"]);
      if (!neighbor.topRight) {
        const arcCoords = { ...module, y: y - size, x: x + size };
        path += getCornerArcPath(arcCoords, "bottom-left");
      }
    }
    return path || getSquarePath(module.x, module.y, module.size);
  }
  return "";
}

function downloadFile(blob: Blob, name?: string) {
  const url = URL.createObjectURL(blob!);
  const link = document.createElement("a");
  link.download = name || "qrgrid-react";
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * download the qr in the provided format
 */
export function downloadQr(
  svg: SVGSVGElement,
  type?: "svg" | "png" | "jpeg" | "webp",
  name?: string
) {
  const svgBlob = new Blob([svg.outerHTML], {
    type: "image/svg+xml;charset=utf-8",
  });

  if (!type || type === "svg") {
    return downloadFile(svgBlob!, name);
  }

  const img = new Image();
  const url = URL.createObjectURL(svgBlob!);
  img.src = url;

  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = svg.clientWidth;
    canvas.height = svg.clientHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, svg.clientWidth, svg.clientHeight);

    URL.revokeObjectURL(url);
    canvas.toBlob((blob) => downloadFile(blob!, name), `image/${type}`);
  };
}
