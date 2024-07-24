import { QR } from "@zqr/core";

import { ModuleStyleFunctionParams } from "./types";
import { ReservedBits } from "@zqr/core/enums";

export type CornerType =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

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

export function roundCorner(
  ctx: CanvasRenderingContext2D,
  module: ModuleStyleFunctionParams[1],
  type: CornerType[],
  cornerSize = 0
) {
  ctx.save();

  ctx.globalCompositeOperation = "xor";
  for (let i = 0; i < type.length; i++) {
    cornerArc(ctx, module, type[i], cornerSize);
  }
  ctx.fillRect(module.x, module.y, module.size, module.size);

  ctx.restore();
}

export function cornerArc(
  ctx: CanvasRenderingContext2D,
  module: ModuleStyleFunctionParams[1],
  type: CornerType,
  cornerSize = 0
) {
  const { x, y, size } = module;

  let radius: number = 0;
  if (type === "top-left") {
    radius = 0;
  } else if (type === "top-right") {
    radius = 90;
  } else if (type === "bottom-right") {
    radius = 180;
  } else if (type === "bottom-left") {
    radius = 270;
  }

  const centerX = x + 0.5 * size;
  const centerY = y + 0.5 * size;

  ctx.save();

  ctx.translate(centerX, centerY);
  ctx.rotate((Math.PI / 180) * radius);
  ctx.translate(-centerX, -centerY);

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + size - cornerSize);
  ctx.quadraticCurveTo(x, y, x + size - cornerSize, module.y);
  ctx.fill();

  ctx.restore();
}

export function smoothEdges(
  ctx: CanvasRenderingContext2D,
  module: ModuleStyleFunctionParams[1],
  qr: QR
) {
  const { reservedBits } = qr;
  const { index, x, y, size } = module;
  if (reservedBits[index]?.type === ReservedBits.FinderPattern) {
    return;
  }
  const neighbor = getNeighbor(index, qr);
  const cornerDist = size * 0.5;

  if (!neighbor.left && neighbor.topLeft) {
    const arcCoords = { ...module, x: x - size };
    cornerArc(ctx, arcCoords, "top-right", cornerDist);
  }
  if (!neighbor.left && neighbor.bottomLeft) {
    const arcCoords = { ...module, x: x - size };
    cornerArc(ctx, arcCoords, "bottom-right", cornerDist);
  }
  if (!neighbor.right && neighbor.topRight) {
    const arcCoords = { ...module, x: x + size };
    cornerArc(ctx, arcCoords, "top-left", cornerDist);
  }
  if (!neighbor.right && neighbor.bottomRight) {
    const arcCoords = { ...module, x: x + size };
    cornerArc(ctx, arcCoords, "bottom-left", cornerDist);
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
    roundCorner(ctx, module, corners, cornerDist);
    return;
  }

  ctx.fillRect(x, y, size, size);
}

export function roundCornerFinderPattern(
  ctx: CanvasRenderingContext2D,
  module: ModuleStyleFunctionParams[1],
  qr: QR
) {
  const { reservedBits } = qr;
  const { index, x, y, size } = module;
  const neighbor = getNeighbor(index, qr);

  if (reservedBits[index]?.type === ReservedBits.FinderPattern) {
    if (!neighbor.top && !neighbor.left) {
      roundCorner(ctx, module, ["top-left"]);
      const arcCoords = { ...module, y: y + size, x: x + size };
      cornerArc(ctx, arcCoords, "top-left");
      return;
    }
    if (!neighbor.top && !neighbor.right) {
      roundCorner(ctx, module, ["top-right"]);
      const arcCoords = { ...module, y: y + size, x: x - size };
      cornerArc(ctx, arcCoords, "top-right");
      return;
    }
    if (!neighbor.bottom && !neighbor.right) {
      roundCorner(ctx, module, ["bottom-right"]);
      const arcCoords = { ...module, y: y - size, x: x - size };
      cornerArc(ctx, arcCoords, "bottom-right");
      return;
    }
    if (!neighbor.bottom && !neighbor.left) {
      roundCorner(ctx, module, ["bottom-left"]);
      const arcCoords = { ...module, y: y - size, x: x + size };
      cornerArc(ctx, arcCoords, "bottom-left");
      return;
    }
    ctx.fillRect(module.x, module.y, module.size, module.size);
  }
}
