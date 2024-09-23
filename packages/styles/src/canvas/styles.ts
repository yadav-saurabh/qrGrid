/**
 * Styling function that can be used to pass in Qr component
 * @module
 */
import { QR } from "@qrgrid/core";

import { ModuleType, drawSmoothEdges } from "./utils";

/**
 * Qr Module styles as dots(circles)
 */
export function dotModuleStyle(
  ctx: CanvasRenderingContext2D,
  module: ModuleType
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
  module: ModuleType,
  qr: QR
) {
  ctx.fillStyle = "white";
  drawSmoothEdges(ctx, module, qr);
}
