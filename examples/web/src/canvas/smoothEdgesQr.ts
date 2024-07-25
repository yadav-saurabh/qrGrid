import { QR, ReservedBits } from "@zqr/core";
import {
  cornerArc,
  CornerType,
  generateCanvas,
  getNeighbor,
  roundCorner,
  roundCornerFinderPattern,
  smoothEdges,
} from "./utils";

const DEFAULT_CANVAS_SIZE = 400;
const DEFAULT_BG_COLOR = "black";
const DEFAULT_COLOR = "white";

export function generateSmoothEdges(qr: QR) {
  canvasStyle1(qr);
  canvasStyle2(qr);
  canvasStyle3(qr);
}

const canvas1 = generateCanvas("smoothEdgesQr: style1");
export function canvasStyle1(qr: QR) {
  const ctx = canvas1.getContext("2d")!;
  const canvasSize = DEFAULT_CANVAS_SIZE;

  let size = Math.floor(canvasSize / (qr.noOfModules + 1.5));
  const border = Math.ceil(size * qr.noOfModules - canvasSize) + size * 2;
  canvas1.height = canvasSize + border;
  canvas1.width = canvasSize + border;
  ctx.fillStyle = DEFAULT_COLOR;

  let x = size;
  let y = size;
  for (let i = 0; i < qr.data.length; i++) {
    const bit = qr.data[i];
    const module = { x, y, index: i, size };
    if (bit) {
      if (qr.reservedBits[i]?.type === ReservedBits.FinderPattern) {
        roundCornerFinderPattern(ctx, module, qr);
      } else {
        smoothEdges(ctx, module, qr);
      }
    }
    x += size;
    if (i % qr.noOfModules === qr.noOfModules - 1) {
      x = size;
      y += size;
    }
  }

  ctx.globalCompositeOperation = "destination-over";
  ctx.fillStyle = DEFAULT_BG_COLOR;
  ctx.fillRect(0, 0, canvasSize + border, canvasSize + border);
}

const canvas2 = generateCanvas("smoothEdgesQr: style2");
export function canvasStyle2(qr: QR) {
  const ctx = canvas2.getContext("2d")!;
  const canvasSize = DEFAULT_CANVAS_SIZE;

  let size = Math.floor(canvasSize / (qr.noOfModules + 1.5));
  const border = Math.ceil(size * qr.noOfModules - canvasSize) + size * 2;
  canvas2.height = canvasSize + border;
  canvas2.width = canvasSize + border;
  ctx.fillStyle = DEFAULT_COLOR;

  let x = size;
  let y = size;
  for (let i = 0; i < qr.data.length; i++) {
    const bit = qr.data[i];
    const module = { x, y, index: i, size };
    if (bit) {
      if (qr.reservedBits[i]?.type === ReservedBits.FinderPattern) {
        roundCornerFinderPattern(ctx, module, qr);
      } else {
        const neighbor = getNeighbor(i, qr);
        const cornerDist = size * 0.5;

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
          roundCorner(ctx, module, corners, cornerDist);
        } else {
          ctx.fillRect(x, y, size, size);
        }
      }
    }
    x += size;
    if (i % qr.noOfModules === qr.noOfModules - 1) {
      x = size;
      y += size;
    }
  }

  ctx.globalCompositeOperation = "destination-over";
  ctx.fillStyle = DEFAULT_BG_COLOR;
  ctx.fillRect(0, 0, canvasSize + border, canvasSize + border);
}

const canvas3 = generateCanvas("smoothEdgesQr: style3");
export function canvasStyle3(qr: QR) {
  const ctx = canvas3.getContext("2d")!;
  const canvasSize = DEFAULT_CANVAS_SIZE;

  let size = Math.floor(canvasSize / (qr.noOfModules + 1.5));
  const border = Math.ceil(size * qr.noOfModules - canvasSize) + size * 2;
  canvas3.height = canvasSize + border;
  canvas3.width = canvasSize + border;
  ctx.fillStyle = DEFAULT_COLOR;

  let x = size;
  let y = size;
  for (let i = 0; i < qr.data.length; i++) {
    const bit = qr.data[i];
    const module = { x, y, index: i, size };
    if (bit) {
      const neighbor = getNeighbor(i, qr);
      if (qr.reservedBits[i]?.type === ReservedBits.FinderPattern) {
        if (!neighbor.top && !neighbor.left) {
          roundCorner(ctx, module, ["top-left"]);
          const arcCoords = { ...module, y: y + size, x: x + size };
          cornerArc(ctx, arcCoords, "top-left");
        } else if (!neighbor.bottom && !neighbor.right) {
          roundCorner(ctx, module, ["bottom-right"]);
          const arcCoords = { ...module, y: y - size, x: x - size };
          cornerArc(ctx, arcCoords, "bottom-right");
        } else {
          ctx.fillRect(x, y, size, size);
        }
      } else {
        const cornerDist = size * 0.5;

        const corners: CornerType[] = [];

        if (!neighbor.top && !neighbor.left) {
          corners.push("top-left");
        }
        if (!neighbor.bottom && !neighbor.right) {
          corners.push("bottom-right");
        }

        if (corners.length) {
          roundCorner(ctx, module, corners, cornerDist);
        } else {
          ctx.fillRect(x, y, size, size);
        }
      }
    }
    x += size;
    if (i % qr.noOfModules === qr.noOfModules - 1) {
      x = size;
      y += size;
    }
  }

  ctx.globalCompositeOperation = "destination-over";
  ctx.fillStyle = DEFAULT_BG_COLOR;
  ctx.fillRect(0, 0, canvasSize + border, canvasSize + border);
}
