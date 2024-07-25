/**
 * Styling function that can be used to pass in Qr component
 * @module
 */
import { QR, ReservedBits } from "@zqr/core";

import { ModuleStyleFunctionParams } from "./types";
import { roundCornerFinderPattern, smoothEdges } from "./utils";

/**
 * Qr Module styles as dots(circles)
 */
export function dotModuleStyle(
  ctx: CanvasRenderingContext2D,
  module: ModuleStyleFunctionParams[1]
) {
  const radius = Math.floor(module.size / 2);
  ctx.beginPath();
  ctx.arc(module.x + radius, module.y + radius, radius, 0, 2 * Math.PI);
  ctx.fill();
}

/**
 * Qr Module styles with with smooth edges
 */
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
