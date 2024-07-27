import { QR } from "@qrgrid/core";
import { generateCanvas } from "./utils";

const DEFAULT_CANVAS_SIZE = 400;
const DEFAULT_COLOR = "white";

const canvas = generateCanvas("gradientQr");

export function generateGradientQr(qr: QR) {
  const ctx = canvas.getContext("2d")!;

  let size = Math.floor(DEFAULT_CANVAS_SIZE / (qr.noOfModules + 1.5));
  const border =
    Math.ceil(size * qr.noOfModules - DEFAULT_CANVAS_SIZE) + size * 2;
  const canvasSize = DEFAULT_CANVAS_SIZE + border;
  canvas.height = canvasSize;
  canvas.width = canvasSize;
  ctx.fillStyle = DEFAULT_COLOR;

  let x = size;
  let y = size;
  for (let i = 0; i < qr.data.length; i++) {
    const bit = qr.data[i];
    if (bit) {
      ctx.fillRect(x, y, size, size);
    }
    x += size;
    if (i % qr.noOfModules === qr.noOfModules - 1) {
      x = size;
      y += size;
    }
  }

  ctx.globalCompositeOperation = "destination-over";
  const grad = ctx.createLinearGradient(0, 0, canvasSize, canvasSize);
  grad.addColorStop(0, "lightblue");
  grad.addColorStop(1, "darkblue");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvasSize, canvasSize);
}
