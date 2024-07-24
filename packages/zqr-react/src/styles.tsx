import { QR } from "@zqr/core";
import { ReservedBits } from "@zqr/core/enums";

import { ModuleStyleFunctionParams } from "./types";
import { roundCornerFinderPattern, smoothEdges } from "./utils";

export function dotModuleStyle(
  ctx: CanvasRenderingContext2D,
  module: ModuleStyleFunctionParams[1]
) {
  const radius = Math.floor(module.size / 2);
  ctx.beginPath();
  ctx.arc(module.x + radius, module.y + radius, radius, 0, 2 * Math.PI);
  ctx.fill();
}

export function smoothModuleStyle(
  ctx: CanvasRenderingContext2D,
  module: ModuleStyleFunctionParams[1],
  qr: QR
) {
  ctx.fillStyle = "white";
  if (qr.reservedBits[module.index]?.type === ReservedBits.FinderPattern) {
    roundCornerFinderPattern(ctx, module, qr);
    return;
  }
  smoothEdges(ctx, module, qr);
}
