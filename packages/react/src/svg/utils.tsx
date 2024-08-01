/**
 * Utils functions that can be used in styling the module or downloading the qr image 
 * @module
 */
import { QR } from "@qrgrid/core";

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
 * get the path string to draw a circle
 */
export function getCirclePath(x: number, y: number, r: number) {
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
