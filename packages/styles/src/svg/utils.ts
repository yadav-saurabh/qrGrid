/**
 * Utils functions that can be used in styling the module or downloading the qr image
 * @module
 */
import { QR } from "@qrgrid/core";
import { getNeighbor } from "../common";

export type ModuleType = { index: number; x: number; y: number; size: number };
export type PathType = { codeword: string; finder: string };

export type CornerType =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

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
  if (d > size) {
    throw new Error("cornerSize cannot be greater than size");
  }

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
  if (d > size) {
    throw new Error("cornerSize cannot be greater than size");
  }
  if (type === "top-left") {
    return `M${x} ${y} v${d}q0 -${d} ${d} -${d}z`;
  }
  if (type === "top-right") {
    return `M${x} ${y} v${d}q0 -${d} -${d} -${d}z`;
  }
  if (type === "bottom-left") {
    return `M${x} ${y} h${d}q-${d} 0 -${d} -${d}z`;
  }
  if (type === "bottom-right") {
    return `M${x} ${y} v${-d}q0 ${d} -${d} ${d}z`;
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
 * get the path string to draw a circle outline (same as circle stroke)
 */
export function getCircleOutlinePath(
  x: number,
  y: number,
  size: number,
  strength?: number
) {
  const r = Math.floor(size / 2);
  let d = strength || r * 0.25;
  let cx = x;
  let cy = y + r;
  return `M${cx} ${cy}a ${r} ${r} 0 1 0 ${r * 2} 0 m-${d} 0a ${r - d} ${r - d} 0 0 1 -${(r - d) * 2} 0 h-${d} a ${r} ${r} 0 0 1 ${r * 2} 0 m-${d} 0a ${r - d} ${r - d} 0 0 0 -${(r - d) * 2} 0 h-${d}z`;
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
export function getSmoothEdgesPath(module: ModuleType, qr: QR) {
  const { index, x, y, size } = module;
  let path = "";
  const neighbor = getNeighbor(index, qr);
  const cornerDist = size * 0.5;

  if (!neighbor.left && neighbor.topLeft) {
    const arcCoords = { ...module };
    path += getCornerArcPath(arcCoords, "top-right", cornerDist);
  }
  if (!neighbor.left && neighbor.bottomLeft) {
    const arcCoords = { ...module, y: y + size };
    path += getCornerArcPath(arcCoords, "bottom-right", cornerDist);
  }
  if (!neighbor.right && neighbor.topRight) {
    const arcCoords = { ...module, x: x + size };
    path += getCornerArcPath(arcCoords, "top-left", cornerDist);
  }
  if (!neighbor.right && neighbor.bottomRight) {
    const arcCoords = { ...module, x: x + size, y: y + size };
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

function downloadFile(blob: Blob, name?: string) {
  const url = URL.createObjectURL(blob!);
  const link = document.createElement("a");
  link.download = name || "qrgrid";
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
