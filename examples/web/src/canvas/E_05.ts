import { QR, ReservedBits } from "@qrgrid/core";

import { generateCanvas } from "./utils";
import {
  DEFAULT_BG_COLOR,
  DEFAULT_CANVAS_SIZE,
  DEFAULT_COLOR,
  FINDER_COLOR,
} from "../constants";
import { ModuleType } from "@qrgrid/styles/svg";

const canvas = generateCanvas("E 05");

export function E_05(qr: QR) {
  const ctx = canvas.getContext("2d")!;
  const canvasSize = DEFAULT_CANVAS_SIZE;

  let size = Math.floor(canvasSize / (qr.gridSize + 1.5));
  const border = Math.ceil(size * qr.gridSize - canvasSize) + size * 2;
  canvas.height = canvasSize + border;

  canvas.width = canvasSize + border;
  ctx.fillStyle = DEFAULT_COLOR;

  let x = size;
  let y = size;
  for (let i = 0; i < qr.data.length; i++) {
    const bit = qr.data[i];
    const module: ModuleType = { index: i, x, y, size };

    if (bit) {
      if (qr.reservedBits[i]?.type === ReservedBits.FinderPattern) {
        ctx.fillStyle = FINDER_COLOR;
      }
      ctx.fillRect(module.x, module.y, module.size * 0.95, module.size * 0.95);
      ctx.fillStyle = DEFAULT_COLOR;
    }

    x += size;
    if (i % qr.gridSize === qr.gridSize - 1) {
      x = size;
      y += size;
    }
  }

  ctx.globalCompositeOperation = "destination-over";
  ctx.fillStyle = DEFAULT_BG_COLOR;
  ctx.fillRect(0, 0, canvasSize + border, canvasSize + border);
}
