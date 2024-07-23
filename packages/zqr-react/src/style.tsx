import { QR } from "@zqr/core";
import { ReservedBits } from "@zqr/core/enums";

export function dotModuleStyle(
  ctx: CanvasRenderingContext2D,
  coord: { index: number; x: number; y: number },
  size: number
) {
  const radius = Math.floor(size / 2);
  ctx.beginPath();
  ctx.arc(coord.x + radius, coord.y + radius, radius, 0, 2 * Math.PI);
  ctx.fill();
}

export function getNeighbor(
  index: number,
  noOfModules: number,
  data: QR["data"]
) {
  const left = index % noOfModules !== 0 && data[index - 1];
  const right = index % noOfModules !== noOfModules - 1 && data[index + 1];
  const top = data[index - noOfModules];
  const bottom = data[index + noOfModules];
  return { top, bottom, left, right };
}

export function roundCorner(
  ctx: CanvasRenderingContext2D,
  coord: { index: number; x: number; y: number },
  size: number,
  type: "top-left" | "top-right" | "bottom-left" | "bottom-right",
  cornerSize = 0
) {
  let radius: number = 0;
  if (type === "bottom-right") {
    radius = 0;
  } else if (type === "bottom-left") {
    radius = 90;
  } else if (type === "top-left") {
    radius = 180;
  } else if (type === "top-right") {
    radius = 270;
  }

  const centerX = coord.x + 0.5 * size;
  const centerY = coord.y + 0.5 * size;

  ctx.save();

  ctx.translate(centerX, centerY);
  ctx.rotate((Math.PI / 180) * radius);
  ctx.translate(-centerX, -centerY);

  ctx.beginPath();
  ctx.lineTo(coord.x, coord.y);
  ctx.lineTo(coord.x + size, coord.y);
  ctx.lineTo(coord.x + size, coord.y + cornerSize);
  ctx.quadraticCurveTo(
    coord.x + size,
    coord.y + size,
    coord.x + cornerSize,
    coord.y + size
  );
  ctx.lineTo(coord.x, coord.y + size);
  ctx.fill();

  ctx.restore();
}

export function roundArc(
  ctx: CanvasRenderingContext2D,
  coord: { index: number; x: number; y: number },
  size: number,
  type: "top-left" | "top-right" | "bottom-left" | "bottom-right",
  cornerSize = 0
) {
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

  const centerX = coord.x + 0.5 * size;
  const centerY = coord.y + 0.5 * size;

  ctx.save();

  ctx.translate(centerX, centerY);
  ctx.rotate((Math.PI / 180) * radius);
  ctx.translate(-centerX, -centerY);

  ctx.beginPath();
  ctx.moveTo(coord.x, coord.y);
  ctx.lineTo(coord.x, coord.y + size - cornerSize);
  ctx.quadraticCurveTo(coord.x, coord.y, coord.x + size - cornerSize, coord.y);
  ctx.fill();

  ctx.restore();
}

export function roundCornerFinderPattern(
  ctx: CanvasRenderingContext2D,
  coord: { index: number; x: number; y: number },
  size: number,
  { data, noOfModules, reservedBits }: QR
) {
  const neighbor = getNeighbor(coord.index, noOfModules, data);

  if (reservedBits[coord.index]?.type === ReservedBits.FinderPattern) {
    if (!neighbor.top && !neighbor.left) {
      roundCorner(ctx, coord, size, "top-left");
      const arcCoords = { ...coord, y: coord.y + size, x: coord.x + size };
      roundArc(ctx, arcCoords, size, "top-left");
      return;
    }
    if (!neighbor.top && !neighbor.right) {
      roundCorner(ctx, coord, size, "top-right");
      const arcCoords = { ...coord, y: coord.y + size, x: coord.x - size };
      roundArc(ctx, arcCoords, size, "top-right");
      return;
    }
    if (!neighbor.bottom && !neighbor.right) {
      roundCorner(ctx, coord, size, "bottom-right");
      const arcCoords = { ...coord, y: coord.y - size, x: coord.x - size };
      roundArc(ctx, arcCoords, size, "bottom-right");
      return;
    }
    if (!neighbor.bottom && !neighbor.left) {
      roundCorner(ctx, coord, size, "bottom-left");
      const arcCoords = { ...coord, y: coord.y - size, x: coord.x + size };
      roundArc(ctx, arcCoords, size, "bottom-left");
      return;
    }
  }

  ctx.fillRect(coord.x, coord.y, size, size);
}
